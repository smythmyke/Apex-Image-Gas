// PayPal Client IDs for different environments
// Sandbox test cards and accounts for testing

// Test Credit Cards for Sandbox Testing
export const SANDBOX_TEST_CARDS = {
    VISA: {
        number: '4111111111111111',
        expiry: '12/2025',
        cvv: '123'
    },
    MASTERCARD: {
        number: '5555555555554444',
        expiry: '12/2025',
        cvv: '123'
    },
    AMEX: {
        number: '378282246310005',
        expiry: '12/2025',
        cvv: '1234'
    }
};

// Test Personal Account
export const SANDBOX_PERSONAL = {
    email: 'sb-47lhf25379799@personal.example.com',
    password: 'testpass123'
};

// Test Business Account
export const SANDBOX_BUSINESS = {
    email: 'sb-43zfp25379741@business.example.com',
    password: 'testpass123'
};

export const PAYPAL_CLIENT_IDS = {
    // Production/Live environment
    LIVE: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
    
    // Sandbox/Testing environment
    SANDBOX: 'sb-43zfp25379741@business.example.com'
};

// Export individual constants for direct imports
export const LIVE_CLIENT_ID = PAYPAL_CLIENT_IDS.LIVE;
export const SANDBOX_CLIENT_ID = PAYPAL_CLIENT_IDS.SANDBOX;
