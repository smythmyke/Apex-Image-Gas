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

// Remove PayPal buttons from hero section
document.getElementById('paypal-buttons').remove();

// Initialize pricing section buttons
document.querySelectorAll('.paypal-button').forEach(button => {
  paypal.Buttons({
    style: {
      layout: 'vertical',
      label: 'paypal',
      height: 40
    },
    fundingSource: paypal.FUNDING.PAYPAL,
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
        return false;
      }

      const price = parseFloat(button.dataset.price);
      const description = price === 9999 ? 
        '1L Gas Bottle - Single Purchase' : 
        '1L Gas Bottle - Annual Subscription';
      
      return actions.order.create({
        purchase_units: [{
          description: description,
          amount: {
            currency_code: 'USD',
            value: price.toFixed(2)
          },
          custom_id: JSON.stringify(businessInfo)
        }],
        application_context: {
          shipping_preference: 'GET_FROM_FILE',
          user_action: 'CONTINUE',
          payment_method: {
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
            payer_selected: 'PAYPAL'
          }
        }
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture()
        .then(function(details) {
          // Combine business info with shipping details
          const businessInfo = JSON.parse(details.purchase_units[0].custom_id);
          const shippingInfo = details.purchase_units[0].shipping;
          
          const message = `
            Transaction completed successfully! 
            Our team will contact ${businessInfo.contactName} at ${businessInfo.companyName} 
            via ${businessInfo.businessEmail} or ${businessInfo.phoneNumber} 
            to coordinate delivery to:
            ${shippingInfo.name.full_name}
            ${shippingInfo.address.address_line_1}
            ${shippingInfo.address.admin_area_2}, ${shippingInfo.address.admin_area_1} ${shippingInfo.address.postal_code}
            ${shippingInfo.address.country_code}
          `;
          
          showTransactionMessage(message);
          
          // Clear the form after successful transaction
          document.getElementById('businessInfoForm').reset();
        })
        .catch(function(error) {
          console.error('Transaction failed:', error);
          showTransactionMessage('Transaction failed. Please try again or contact support.', true);
        });
    },
    onError: function(err) {
      console.error('PayPal Error:', err);
      showTransactionMessage('There was an error processing your payment. Please try again.', true);
    }
  }).render(button);
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
