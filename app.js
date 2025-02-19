// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDPx2x-YfwSpc4ZvCe6nJmKASzxMAlgmXY",
  authDomain: "apex-gas-9920e.firebaseapp.com",
  projectId: "apex-gas-9920e",
  storageBucket: "apex-gas-9920e.firebasestorage.app",
  messagingSenderId: "177024004601",
  appId: "1:177024004601:web:85819c56ce7c3a77334d28",
  measurementId: "G-PZMWFDYJ0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const sendEmailNotification = httpsCallable(functions, 'sendEmailNotification');

// Function to track form submissions
async function trackFormSubmission(formData) {
  try {
    const docRef = await addDoc(collection(db, "form_submissions"), {
      ...formData,
      timestamp: serverTimestamp()
    });
    console.log("Form submission tracked with ID: ", docRef.id);
    
    // Send email notification for form submission
    await sendEmailNotification({
      type: 'form_submission',
      data: {
        ...formData,
        submissionId: docRef.id
      }
    });
  } catch (error) {
    console.error("Error tracking form submission: ", error);
  }
}

// Function to track purchases
async function trackPurchase(purchaseData) {
  try {
    const docRef = await addDoc(collection(db, "purchases"), {
      ...purchaseData,
      timestamp: serverTimestamp()
    });
    console.log("Purchase tracked with ID: ", docRef.id);
    
    // Send email notification for purchase
    await sendEmailNotification({
      type: 'purchase',
      data: {
        ...purchaseData,
        purchaseId: docRef.id
      }
    });
  } catch (error) {
    console.error("Error tracking purchase: ", error);
  }
}

// Analytics tracking functions
function trackPageView() {
  const pagePath = window.location.pathname;
  const pageTitle = document.title;
  logEvent(analytics, 'page_view', {
    page_path: pagePath,
    page_title: pageTitle
  });
}

function trackSectionView(sectionId) {
  logEvent(analytics, 'section_view', {
    section_id: sectionId
  });
}

function trackScroll() {
  const scrollDepth = Math.round((window.scrollY + window.innerHeight) / 
    document.documentElement.scrollHeight * 100);
  logEvent(analytics, 'scroll_depth', {
    depth: scrollDepth
  });
}

// Handle specialty gas form submission
document.getElementById('specialtyGasForm')?.addEventListener('submit', async (e) => {
  // Google Ads conversion is handled by the form's onsubmit attribute
  
  // Track in Firebase Analytics
  const formData = {
    companyName: e.target.companyName.value,
    contactName: e.target.contactName.value,
    phoneNumber: e.target.phoneNumber.value,
    businessEmail: e.target.businessEmail.value,
    facilityType: e.target.facilityType.value,
    gas: e.target.gas.value,
    hasEosXRay: e.target.eosXRayMachine.checked,
    message: e.target.message.value
  };

  logEvent(analytics, 'specialty_gas_inquiry', formData);
  await trackFormSubmission(formData);
});

// Track page views on load and when navigation occurs
window.addEventListener('load', () => {
  trackPageView();
  
  // Set up section view tracking
  document.querySelectorAll('section').forEach(section => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackSectionView(section.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
  });
});

window.addEventListener('popstate', trackPageView);

// Track scroll depth
let lastScrollDepth = 0;
window.addEventListener('scroll', () => {
  const currentDepth = Math.round((window.scrollY + window.innerHeight) / 
    document.documentElement.scrollHeight * 100);
  if (currentDepth % 25 === 0 && currentDepth > lastScrollDepth) {
    trackScroll();
    lastScrollDepth = currentDepth;
  }
});

// Validate business information form
function validateBusinessForm() {
  try {
    const form = document.getElementById('businessInfoForm');
    if (!form) {
      showTransactionMessage('Please fill out the business information form before proceeding.', true);
      return false;
    }

    const companyName = form.querySelector('[name="companyName"]')?.value.trim();
    const contactName = form.querySelector('[name="contactName"]')?.value.trim();
    const phoneNumber = form.querySelector('[name="phoneNumber"]')?.value.trim();
    const businessEmail = form.querySelector('[name="businessEmail"]')?.value.trim();

    if (!companyName || !contactName || !phoneNumber || !businessEmail) {
      showTransactionMessage('Please fill in all business information fields before proceeding.', true);
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      showTransactionMessage('Please enter a valid business email address.', true);
      return false;
    }

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      showTransactionMessage('Please enter a valid phone number.', true);
      return false;
    }

    const formData = {
      companyName,
      contactName,
      phoneNumber,
      businessEmail
    };
    
    // Track form submission
    trackFormSubmission(formData);
    
    return formData;
  } catch (error) {
    console.error('Form validation error:', error);
    showTransactionMessage('Please fill out the business information form before proceeding.', true);
    return false;
  }
}

// Show transaction status
function showTransactionMessage(message, isError = false) {
  const existingMsg = document.querySelector('.transaction-message');
  if (existingMsg) {
    existingMsg.remove();
  }

  const msgElement = document.createElement('div');
  msgElement.className = `transaction-message ${isError ? 'error' : 'success'}`;
  msgElement.textContent = message;
  
  const pricing = document.querySelector('#pricing');
  pricing.insertBefore(msgElement, pricing.firstChild);

  setTimeout(() => msgElement.remove(), 15000); // Show message for 15 seconds
}

// Initialize PayPal buttons when ready
window.addEventListener('paypal-ready', () => {
  document.querySelectorAll('.paypal-button').forEach(button => {
    const buttonConfig = {
      fundingSource: paypal.FUNDING.PAYPAL,
      style: {
        layout: 'vertical',
        shape: 'rect',
        color: 'gold',
        label: 'pay'
      },
      env: 'sandbox',
      onClick: (data, actions) => {
        return true;
      },
      createOrder: (data, actions) => {
        try {
          const price = parseFloat(button.dataset.price);
          if (isNaN(price)) {
            throw new Error('Invalid price');
          }

          // Business info will be collected by PayPal
          // Handle subscription vs one-time purchase
          if (button.id === 'paypal-subscription') {
            return actions.subscription.create({
              plan: {
                billing_cycles: [{
                  frequency: {
                    interval_unit: 'YEAR',
                    interval_count: 1
                  },
                  tenure_type: 'REGULAR',
                  sequence: 1,
                  total_cycles: 0,
                  pricing_scheme: {
                    fixed_price: {
                      currency_code: 'USD',
                      value: price.toFixed(2)
                    }
                  }
                }],
                payment_preferences: {
                  auto_bill_outstanding: true,
                  setup_fee: {
                    currency_code: 'USD',
                    value: '0'
                  },
                  setup_fee_failure_action: 'CANCEL',
                  payment_failure_threshold: 3
                },
                taxes: {
                  percentage: '0',
                  inclusive: false
                }
              },
              custom_id: 'subscription_' + Date.now(),
              application_context: {
                shipping_preference: 'GET_FROM_FILE',
                user_action: 'SUBSCRIBE_NOW',
                brand_name: 'Apex Image Gas',
                landing_page: 'BILLING',
                user_experience: 'MINIMAL'
              },
              subscriber: {}
            });
          }

          // Single purchase
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              description: '1L Gas Bottle - Single Purchase',
              amount: {
                currency_code: 'USD',
                value: price.toFixed(2)
              },
              custom_id: 'purchase_' + Date.now()
            }],
            application_context: {
              shipping_preference: 'GET_FROM_FILE',
              user_action: 'PAY_NOW',
              brand_name: 'Apex Image Gas',
              landing_page: 'BILLING',
              user_experience: 'MINIMAL'
            }
          });
        } catch (error) {
          console.error('Order creation error:', error);
          showTransactionMessage('There was an error creating your order. Please try again.', true);
          throw error;
        }
      },
      onApprove: (data, actions) => {
        showTransactionMessage('Processing your payment...', false);
        
        // Handle subscription approval
        if (button.id === 'paypal-subscription') {
          return actions.subscription.get()
            .then((details) => {
              const message = `Annual subscription activated successfully! Our team will contact you at ${details.subscriber.email_address} to coordinate your first delivery.`;
              showTransactionMessage(message);
              
              // Track the subscription purchase
              const subscriptionData = {
                type: 'subscription',
                email: details.subscriber.email_address,
                subscriptionId: details.id,
                status: details.status,
                planId: details.plan_id,
                startTime: details.start_time,
                businessInfo: validateBusinessForm()
              };
              trackPurchase(subscriptionData);
              
              const form = document.getElementById('businessInfoForm');
              if (form) {
                form.reset();
              }
            })
            .catch((error) => {
              console.error('Subscription activation failed:', error);
              showTransactionMessage('There was an error activating your subscription. Please try again or contact support.', true);
            });
        }
        
        // Handle one-time purchase approval
        return actions.order.capture()
          .then((details) => {
              const message = `Transaction completed successfully! Our team will contact you at ${details.payer.email_address} to coordinate delivery.`;
            showTransactionMessage(message);
            
            // Track the one-time purchase
            const purchaseData = {
              type: 'one_time',
              email: details.payer.email_address,
              amount: details.purchase_units[0].amount.value,
              currency: details.purchase_units[0].amount.currency_code,
              orderId: details.id,
              status: details.status,
              businessInfo: validateBusinessForm()
            };
            trackPurchase(purchaseData);
            
            const form = document.getElementById('businessInfoForm');
            if (form) {
              form.reset();
            }
          })
          .catch((error) => {
            console.error('Payment capture failed:', error);
            showTransactionMessage('There was an error processing your payment. Please try again or contact support.', true);
          });
      },
      onError: (err) => {
        console.error('PayPal Error:', err);
        showTransactionMessage('There was an error processing your payment. Please try again or contact support.', true);
      },
      onCancel: () => {
        showTransactionMessage('Payment cancelled. Please try again when you are ready.', true);
      }
    };

    // Render PayPal button
    paypal.Buttons(buttonConfig)
      .render(button)
      .catch((error) => {
        console.error('PayPal button render error:', error);
        button.innerHTML = '<p class="text-red-600">Payment system temporarily unavailable. Please try again later.</p>';
      });
  });
});

// Remove PayPal buttons from hero section if it exists
window.addEventListener('load', () => {
  const heroButtons = document.getElementById('paypal-buttons');
  if (heroButtons) {
    heroButtons.remove();
  }
});

// Add styles for transaction messages
const style = document.createElement('style');
style.textContent = `
  .transaction-message {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    text-align: center;
    animation: slideDown 0.3s ease-out;
  }
  
  .transaction-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .transaction-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Enhanced Image Interactions
document.querySelectorAll('.product-image-container').forEach(container => {
  const img = container.querySelector('.product-image');
  
  container.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <img src="${img.src}" alt="${img.alt}">
        <button class="close-modal">×</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.close-modal').onclick = () => {
      modal.remove();
      document.body.style.overflow = '';
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = '';
      }
    };
  });
});

// Add modal styles
const modalStyle = document.createElement('style');
modalStyle.textContent = `
  .image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }
  
  .modal-content {
    position: relative;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(modalStyle);

// Enhanced Form Interactions
const formInputs = document.querySelectorAll('.form-group input');
formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
    if (input.value.trim()) {
      input.classList.add('filled');
    } else {
      input.classList.remove('filled');
    }
  });
});

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
