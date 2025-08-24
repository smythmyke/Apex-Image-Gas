// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from './src/stripe-config.js';

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

// Initialize Stripe
let stripe;
loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY).then(stripeInstance => {
  stripe = stripeInstance;
  initializeStripeButtons();
}).catch(error => {
  console.error('Failed to load Stripe:', error);
  document.querySelectorAll('.stripe-button').forEach(button => {
    button.innerHTML = '<p class="text-red-600">Payment system temporarily unavailable. Please try again later.</p>';
  });
});

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
    businessEmail: e.target.businessEmail.value
  };
  
  await trackFormSubmission(formData);
  logEvent(analytics, 'form_submit', {
    form_name: 'specialty_gas_inquiry'
  });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
  const scrollPercent = Math.round((window.scrollY + window.innerHeight) / 
    document.documentElement.scrollHeight * 100);
  if (scrollPercent > maxScroll) {
    maxScroll = scrollPercent;
    if (scrollPercent % 25 === 0) {
      trackScroll();
    }
  }
});

// Track section views
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      trackSectionView(entry.target.id);
    }
  });
}, observerOptions);

// Observe main sections
document.querySelectorAll('section[id]').forEach(section => {
  sectionObserver.observe(section);
});

// Get business information from forms
function getBusinessInfo(buttonId) {
  try {
    // Determine which form to get data from
    const formSuffix = buttonId.includes('subscription') ? '-subscription' : '';
    
    const companyName = document.getElementById(`companyName${formSuffix}`)?.value || '';
    const contactName = document.getElementById(`contactName${formSuffix}`)?.value || '';
    const phoneNumber = document.getElementById(`phoneNumber${formSuffix}`)?.value || '';
    const businessEmail = document.getElementById(`businessEmail${formSuffix}`)?.value || '';
    
    // Validate required fields
    if (!companyName || !contactName || !phoneNumber || !businessEmail) {
      showTransactionMessage('Please fill in all required business information.', true);
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      showTransactionMessage('Please enter a valid email address.', true);
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
  if (pricing) {
    pricing.insertBefore(msgElement, pricing.firstChild);
  }

  setTimeout(() => msgElement.remove(), 15000); // Show message for 15 seconds
}

// Initialize Stripe checkout buttons
function initializeStripeButtons() {
  document.querySelectorAll('.stripe-button').forEach(button => {
    button.addEventListener('click', async () => {
      const priceType = button.dataset.type; // 'single' or 'subscription'
      const businessInfo = getBusinessInfo(button.id);
      
      // Validate business info
      if (!businessInfo) {
        return;
      }
      
      try {
        showTransactionMessage('Redirecting to secure checkout...', false);
        
        // Create checkout session via Firebase Function
        const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
        const { data } = await createCheckoutSession({
          priceType: priceType === 'subscription' ? 'subscription' : 'single',
          businessInfo: businessInfo,
          successUrl: window.location.origin + '/success.html',
          cancelUrl: window.location.origin + '/cancel.html'
        });
        
        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        } else if (data.sessionId) {
          // Fallback to client-side redirect
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId
          });
          
          if (error) {
            console.error('Stripe redirect error:', error);
            showTransactionMessage('Error redirecting to checkout. Please try again.', true);
          }
        }
      } catch (error) {
        console.error('Checkout error:', error);
        showTransactionMessage('Error creating checkout session. Please try again.', true);
      }
    });
  });
}

// Handle success page
if (window.location.pathname.includes('success.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (sessionId) {
    // Track successful purchase
    logEvent(analytics, 'purchase', {
      transaction_id: sessionId,
      value: urlParams.get('amount') || 0,
      currency: 'USD'
    });
    
    // Google Ads conversion tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': 'AW-10810283428/F8c3CJH0heUCEKS40qUo',
        'value': urlParams.get('amount') || 0,
        'currency': 'USD',
        'transaction_id': sessionId
      });
    }
  }
}

// Handle cancel page
if (window.location.pathname.includes('cancel.html')) {
  logEvent(analytics, 'checkout_cancelled', {
    page_path: window.location.pathname
  });
}

// Track page view on load
trackPageView();

// Export functions for use in HTML
window.trackFormSubmission = trackFormSubmission;
window.trackPurchase = trackPurchase;