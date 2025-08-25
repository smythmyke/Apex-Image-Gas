// Stripe Configuration
// Auto-generated on 08/23/2025 11:00:07

export const STRIPE_CONFIG = {
    // Public key (safe to expose in frontend)
    PUBLISHABLE_KEY: 'pk_test_51RzJ5hD2Q6x28Ei7uvNC13aDDSHDDpMIUrc6BXqt48APu3OtoW7dMCXDBa5bju03zkFGxjXh4vNRYHniOjWVz8j700aVqsnwaL',
    
    // Products and Prices (auto-generated)
    PRICES: {
        SINGLE_PURCHASE: 'price_1RzJq5D2Q6x28Ei7b8pfapyU',
        ANNUAL_SUBSCRIPTION: 'price_1RzJsMD2Q6x28Ei7lFYgUNo7'
    },
    
    // URLs for redirects
    SUCCESS_URL: process.env.STRIPE_SUCCESS_URL || window.location.origin + '/success.html',
    CANCEL_URL: process.env.STRIPE_CANCEL_URL || window.location.origin + '/cancel.html'
};

// Product information for display
export const PRODUCTS = {
    SINGLE: {
        name: 'EOS 3.5 Gas Mixture - Single Purchase',
        description: '1 Liter 3.7% Ethane BAL Xenon for EOS 3.5 X-Ray Machines',
        price: 9999,
        currency: 'usd',
        type: 'one_time',
        productId: 'prod_SvAAoREicTey7P',
        priceId: 'price_1RzJq5D2Q6x28Ei7b8pfapyU'
    },
    SUBSCRIPTION: {
        name: 'EOS 3.5 Gas Mixture - Annual Subscription',
        description: 'Annual supply of 1 Liter 3.7% Ethane BAL Xenon',
        price: 9499,
        currency: 'usd',
        type: 'subscription',
        interval: 'year',
        productId: 'prod_SvAADbFpB7clVz',
        priceId: 'price_1RzJsMD2Q6x28Ei7lFYgUNo7'
    }
};

