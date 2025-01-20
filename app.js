document.addEventListener('DOMContentLoaded', function() {
  // Initialize PayPal buttons
  paypal.Buttons({
    createOrder: function(data, actions) {
      const price = data.target.dataset.price;
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: price,
            currency_code: 'USD'
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
        // You can add additional logic here, like sending purchase data to your server
      });
    },
    onError: function(err) {
      console.error('PayPal error:', err);
      alert('There was an error processing your payment. Please try again.');
    }
  }).render('.paypal-button');

  // Handle contact form submission
  const contactForm = document.querySelector('#contact form');
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(contactForm);
    
    // Basic validation
    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
      alert('Please fill out all fields');
      return;
    }

    // Here you would typically send the form data to your server
    console.log('Form data:', {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    });

    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
});
