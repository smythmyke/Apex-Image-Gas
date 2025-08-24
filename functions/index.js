/* eslint-disable max-len */
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {Resend} = require("resend");
const Stripe = require("stripe");

// Initialize Resend with API key from environment variables
const {defineString} = require("firebase-functions/params");

// Define environment parameters
const emailApiKey = defineString("EMAIL_APIKEY");
const emailFrom = defineString("EMAIL_FROM");
const emailNotification = defineString("EMAIL_NOTIFICATION");
const stripeSecretKey = defineString("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineString("STRIPE_WEBHOOK_SECRET");
const stripePriceSingle = defineString("STRIPE_PRICE_SINGLE");
const stripePriceSubscription = defineString("STRIPE_PRICE_SUBSCRIPTION");
const twilioAccountSid = defineString("TWILIO_ACCOUNT_SID");
const twilioAuthToken = defineString("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = defineString("TWILIO_PHONE_NUMBER");
const adminPhoneNumber = defineString("ADMIN_PHONE_NUMBER");

let resend;
const initResend = () => {
  if (!resend) {
    resend = new Resend(emailApiKey.value());
  }
  return resend;
};

let stripe;
const initStripe = () => {
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey.value());
  }
  return stripe;
};

let twilioClient;
const initTwilio = () => {
  if (!twilioClient) {
    const twilio = require("twilio");
    twilioClient = twilio(twilioAccountSid.value(), twilioAuthToken.value());
  }
  return twilioClient;
};

// Handle form submissions
exports.onFormSubmission = onDocumentCreated({
  document: "form_submissions/{formId}",
  memory: "256MiB",
  timeoutSeconds: 60,
}, async (event) => {
  const formData = event.data.data();
  logger.info("New form submission", formData);

  try {
    const resendClient = initResend();
    await resendClient.emails.send({
      from: emailFrom.value(),
      to: emailNotification.value(),
      subject: "New Form Submission - Apex Gas",
      text: `
        New form submission received:
        
        Company: ${formData.companyName}
        Contact: ${formData.contactName}
        Email: ${formData.businessEmail}
        Phone: ${formData.phoneNumber}
        
        Submission ID: ${event.data.id}
        Time: ${formData.timestamp.toDate().toLocaleString()}
      `,
    });

    logger.info("Form submission notification sent successfully");

    // Send SMS notification for form submission
    try {
      const client = initTwilio();
      const smsBody = `📝 New Form Submission!\nCompany: ${formData.companyName}\nContact: ${formData.contactName}\nPhone: ${formData.phoneNumber}`;

      await client.messages.create({
        body: smsBody,
        from: twilioPhoneNumber.value(),
        to: adminPhoneNumber.value(),
      });

      logger.info("Form submission SMS sent successfully");
    } catch (smsError) {
      logger.error("Error sending form submission SMS", smsError);
    }
  } catch (error) {
    logger.error("Error sending form submission notification", error);
  }
},
);

// Handle purchase tracking
exports.onPurchaseTracked = onDocumentCreated({
  document: "purchases/{purchaseId}",
  memory: "256MiB",
  timeoutSeconds: 60,
}, async (event) => {
  const purchaseData = event.data.data();
  logger.info("New purchase tracked", purchaseData);

  try {
    const subject = purchaseData.type === "subscription" ?
      "New Subscription Purchase - Apex Gas" :
      "New One-Time Purchase - Apex Gas";

    const text = purchaseData.type === "subscription" ?
      `
        New subscription purchase:
        
        Email: ${purchaseData.email}
        Subscription ID: ${purchaseData.subscriptionId}
        Status: ${purchaseData.status}
        Plan ID: ${purchaseData.planId}
        Start Time: ${purchaseData.startTime}
        
        Business Information:
        Company: ${purchaseData.businessInfo.companyName}
        Contact: ${purchaseData.businessInfo.contactName}
        Email: ${purchaseData.businessInfo.businessEmail}
        Phone: ${purchaseData.businessInfo.phoneNumber}
        
        Purchase ID: ${event.data.id}
        Time: ${purchaseData.timestamp.toDate().toLocaleString()}
      ` :
      `
        New one-time purchase:
        
        Email: ${purchaseData.email}
        Amount: ${purchaseData.amount} ${purchaseData.currency}
        Order ID: ${purchaseData.orderId}
        Status: ${purchaseData.status}
        
        Business Information:
        Company: ${purchaseData.businessInfo.companyName}
        Contact: ${purchaseData.businessInfo.contactName}
        Email: ${purchaseData.businessInfo.businessEmail}
        Phone: ${purchaseData.businessInfo.phoneNumber}
        
        Purchase ID: ${event.data.id}
        Time: ${purchaseData.timestamp.toDate().toLocaleString()}
      `;

    // Send notification to admin
    const resendClient = initResend();

    // Send notification to admin
    await resendClient.emails.send({
      from: emailFrom.value(),
      to: emailNotification.value(),
      subject,
      text,
    });

    // Send receipt to customer
    const customerSubject = purchaseData.type === "subscription" ?
      "Your Apex Gas Subscription Confirmation" :
      "Your Apex Gas Purchase Confirmation";

    const customerText = purchaseData.type === "subscription" ?
      `
        Thank you for your Apex Gas subscription!
        
        Subscription Details:
        - Status: ${purchaseData.status}
        - Start Time: ${purchaseData.startTime}
        - Subscription ID: ${purchaseData.subscriptionId}
        
        Business Information:
        - Company: ${purchaseData.businessInfo.companyName}
        - Contact: ${purchaseData.businessInfo.contactName}
        - Email: ${purchaseData.businessInfo.businessEmail}
        - Phone: ${purchaseData.businessInfo.phoneNumber}
        
        Our team will contact you shortly to coordinate 
        your first delivery.
        
        If you have any questions, please don't hesitate to contact us.
        
        Thank you for choosing Apex Gas!
      ` :
      `
        Thank you for your Apex Gas purchase!
        
        Order Details:
        - Amount: ${purchaseData.amount} ${purchaseData.currency}
        - Order ID: ${purchaseData.orderId}
        - Status: ${purchaseData.status}
        
        Business Information:
        - Company: ${purchaseData.businessInfo.companyName}
        - Contact: ${purchaseData.businessInfo.contactName}
        - Email: ${purchaseData.businessInfo.businessEmail}
        - Phone: ${purchaseData.businessInfo.phoneNumber}
        
        Our team will contact you shortly to coordinate 
        your delivery.
        
        If you have any questions, please don't hesitate to contact us.
        
        Thank you for choosing Apex Gas!
      `;

    // Send customer receipt
    await resendClient.emails.send({
      from: emailFrom.value(),
      to: purchaseData.email,
      subject: customerSubject,
      text: customerText,
    });

    logger.info("Purchase notification and customer receipt sent successfully");

    // Send SMS notification to admin
    try {
      const client = initTwilio();
      const smsBody = purchaseData.type === "subscription" ?
        `🔔 New Apex Gas Subscription!\nAmount: $${purchaseData.amount}/year\nCompany: ${purchaseData.businessInfo.companyName}\nContact: ${purchaseData.businessInfo.contactName}\nPhone: ${purchaseData.businessInfo.phoneNumber}` :
        `🔔 New Apex Gas Order!\nAmount: $${purchaseData.amount}\nCompany: ${purchaseData.businessInfo.companyName}\nContact: ${purchaseData.businessInfo.contactName}\nPhone: ${purchaseData.businessInfo.phoneNumber}`;

      await client.messages.create({
        body: smsBody,
        from: twilioPhoneNumber.value(),
        to: adminPhoneNumber.value(),
      });

      logger.info("SMS notification sent successfully");
    } catch (smsError) {
      logger.error("Error sending SMS notification", smsError);
      // Don't throw - SMS failure shouldn't break the purchase flow
    }
  } catch (error) {
    logger.error("Error sending purchase notification", error);
  }
},
);

// Export scheduled blog publisher functions
const {scheduledBlogPublisher, generateBlogManually} = require("./scheduledBlogPublisher");
exports.scheduledBlogPublisher = scheduledBlogPublisher;
exports.generateBlogManually = generateBlogManually;

// Stripe Checkout Session Creation
exports.createCheckoutSession = onRequest({
  cors: true,
  memory: "256MiB",
  timeoutSeconds: 60,
}, async (request, response) => {
  logger.info("createCheckoutSession called", {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  // Firebase callable functions wrap data in a 'data' property
  const requestData = request.body.data || request.body;
  const {priceType, businessInfo, successUrl, cancelUrl} = requestData;

  logger.info("Extracted parameters", {
    priceType,
    businessInfo,
    successUrl,
    cancelUrl,
  });

  try {
    logger.info("Initializing Stripe client");
    const stripeClient = initStripe();
    logger.info("Stripe client initialized successfully");

    // Determine which price to use
    const priceId = priceType === "subscription" ?
      stripePriceSubscription.value() :
      stripePriceSingle.value();
    logger.info("Selected price ID", {
      priceType,
      priceId,
      subscriptionPriceId: stripePriceSubscription.value(),
      singlePriceId: stripePriceSingle.value(),
    });

    // Create session configuration
    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: priceType === "subscription" ? "subscription" : "payment",
      success_url: successUrl || "https://apeximagegas.net/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "https://apeximagegas.net/cancel.html",
      metadata: {
        companyName: businessInfo.companyName,
        contactName: businessInfo.contactName,
        businessEmail: businessInfo.businessEmail,
        phoneNumber: businessInfo.phoneNumber,
      },
      customer_email: businessInfo.businessEmail,
    };

    logger.info("Session configuration prepared", sessionConfig);

    // Create the session
    logger.info("Creating Stripe checkout session");
    const session = await stripeClient.checkout.sessions.create(sessionConfig);
    logger.info("Stripe session created successfully", {
      sessionId: session.id,
      url: session.url,
    });

    // Firebase callable functions expect response wrapped in 'data'
    response.json({data: {sessionId: session.id, url: session.url}});
  } catch (error) {
    logger.error("Error creating checkout session:", {
      error: error.message,
      stack: error.stack,
      type: error.type,
      statusCode: error.statusCode,
      raw: error.raw,
    });
    response.status(500).json({
      data: {
        error: error.message,
        details: error.type || "Unknown error type",
      },
    });
  }
});

// Stripe Webhook Handler
exports.stripeWebhook = onRequest({
  memory: "256MiB",
  timeoutSeconds: 60,
}, async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    const stripeClient = initStripe();
    event = stripeClient.webhooks.constructEvent(
        request.rawBody,
        sig,
        stripeWebhookSecret.value(),
    );
  } catch (err) {
    logger.error("Webhook signature verification failed:", err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  try {
    const admin = require("firebase-admin");
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    const db = admin.firestore();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Track the purchase
        const purchaseData = {
          stripeSessionId: session.id,
          email: session.customer_email,
          amount: session.amount_total / 100,
          currency: session.currency,
          status: "completed",
          mode: session.mode,
          businessInfo: {
            companyName: session.metadata.companyName,
            contactName: session.metadata.contactName,
            businessEmail: session.metadata.businessEmail,
            phoneNumber: session.metadata.phoneNumber,
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (session.mode === "subscription") {
          purchaseData.subscriptionId = session.subscription;
          purchaseData.type = "subscription";
        } else {
          purchaseData.type = "one_time";
        }

        await db.collection("purchases").add(purchaseData);
        logger.info("Purchase tracked successfully:", purchaseData);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;

        // Update subscription status
        await db.collection("subscriptions").doc(subscription.id).set({
          customerId: subscription.customer,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});

        logger.info("Subscription updated:", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        // Mark subscription as cancelled
        await db.collection("subscriptions").doc(subscription.id).update({
          status: "cancelled",
          cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info("Subscription cancelled:", subscription.id);
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    response.json({received: true});
  } catch (error) {
    logger.error("Error processing webhook:", error);
    response.status(500).json({error: error.message});
  }
});
