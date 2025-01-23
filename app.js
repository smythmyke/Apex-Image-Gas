// Validate business information form
function validateBusinessForm() {
  const companyName = document.getElementById('companyName').value.trim();
  const contactName = document.getElementById('contactName').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const businessEmail = document.getElementById('businessEmail').value.trim();

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

  return {
    companyName,
    contactName,
    phoneNumber,
    businessEmail
  };
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

  setTimeout(() => msgElement.remove(), 5000);
}

// Initialize PayPal buttons
window.addEventListener('load', () => {
  // Remove PayPal buttons from hero section if it exists
  const heroButtons = document.getElementById('paypal-buttons');
  if (heroButtons) {
    heroButtons.remove();
  }

  // Initialize PayPal buttons
  document.querySelectorAll('.paypal-button').forEach(button => {
    if (window.paypal) {
      paypal.Buttons({
        style: {
          layout: 'vertical',
          shape: 'rect',
          color: 'gold'
        },
        funding: {
          allowed: [
            paypal.FUNDING.PAYPAL,
            paypal.FUNDING.CARD,
            paypal.FUNDING.CREDIT
          ],
          disallowed: []
        },
        onClick: function(data, actions) {
          const businessInfo = validateBusinessForm();
          if (!businessInfo) {
            return false;
          }
          return true;
        },
        createOrder: function(data, actions) {
          const businessInfo = validateBusinessForm();
          if (!businessInfo) {
            throw new Error('Business information is required');
          }

          const price = parseFloat(button.dataset.price);
          if (isNaN(price)) {
            throw new Error('Invalid price');
          }

          return actions.order.create({
            purchase_units: [{
              description: price === 9999 ? '1L Gas Bottle - Single Purchase' : '1L Gas Bottle - Annual Subscription',
              amount: {
                currency_code: 'USD',
                value: price.toFixed(2)
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            showTransactionMessage('Transaction completed successfully! Our team will contact you shortly to coordinate delivery.');
            document.getElementById('businessInfoForm').reset();
          });
        },
        onError: function(err) {
          console.error('PayPal Error:', err);
          showTransactionMessage('There was an error processing your payment. Please try again.', true);
        }
      }).render(button);
    } else {
      console.error('PayPal SDK not loaded');
      button.innerHTML = '<p class="text-red-600">Payment system temporarily unavailable. Please try again later.</p>';
    }
  });
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
    max-width: 90%;
    max-height: 90vh;
  }
  
  .modal-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
  }
  
  .close-modal {
    position: absolute;
    top: -40px;
    right: -40px;
    background: none;
    border: none;
    color: white;
    font-size: 36px;
    cursor: pointer;
    padding: 10px;
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
