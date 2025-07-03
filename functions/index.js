/* eslint-disable max-len */
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const {Resend} = require("resend");

// Initialize Resend with API key from environment variables
const {defineString} = require("firebase-functions/params");

// Define environment parameters
const emailApiKey = defineString("EMAIL_APIKEY");
const emailFrom = defineString("EMAIL_FROM");
const emailNotification = defineString("EMAIL_NOTIFICATION");

let resend;
const initResend = () => {
  if (!resend) {
    resend = new Resend(emailApiKey.value());
  }
  return resend;
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
  } catch (error) {
    logger.error("Error sending purchase notification", error);
  }
},
);

// Export scheduled blog publisher functions
const {scheduledBlogPublisher, generateBlogManually} = require("./scheduledBlogPublisher");
exports.scheduledBlogPublisher = scheduledBlogPublisher;
exports.generateBlogManually = generateBlogManually;
