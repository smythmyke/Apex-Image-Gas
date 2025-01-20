// PayPal Integration
paypal.Buttons({
  createOrder: function(data, actions) {
    const price = parseFloat(data.target.dataset.price);
    return actions.order.create({
      purchase_units: [{
        description: 'EOS 3.5 X-Ray Gas Bottle',
        amount: {
          value: (price / 100).toFixed(2)
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Transaction completed by ' + details.payer.name.given_name);
      // Here you would typically send the transaction details to your server
    });
  }
}).render('#paypal-buttons');

// Initialize pricing buttons
document.querySelectorAll('.paypal-button').forEach(button => {
  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'pay'
    },
    createOrder: function(data, actions) {
      const price = parseFloat(button.dataset.price);
      const description = price === 9999 ? 
        'Single Gas Bottle Purchase' : 
        'Annual Gas Bottle Subscription';
      
      return actions.order.create({
        purchase_units: [{
          description: description,
          amount: {
            value: (price / 100).toFixed(2)
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Thank you for your purchase!');
        // Here you would typically send the transaction details to your server
      });
    }
  }).render(button);
});
