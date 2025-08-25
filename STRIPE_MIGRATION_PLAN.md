# PayPal to Stripe Migration Plan

## Current Setup Summary
- **Product**: Specialized Gas Mixture for EOS 3.5 X-Ray Machines
- **Pricing**: 
  - Single Purchase: $9,999
  - Annual Subscription: $9,499/year
- **Current Integration**: PayPal buttons with client-side SDK
- **Backend**: Firebase (Firestore, Functions)

## Migration Steps

### Phase 1: Prerequisites ✅
- [x] Create Stripe account
- [x] Obtain publishable key and secret key

### Phase 2: Stripe Configuration (YOU NEED TO DO)

1. **Create Products in Stripe Dashboard**
   - [ ] Log into your Stripe Dashboard
   - [ ] Navigate to Products → Create Product
   - [ ] Create Product 1: "EOS 3.5 Gas Mixture - Single Purchase"
     - Price: $9,999.00 USD (one-time)
     - Product ID: Note this for later
   - [ ] Create Product 2: "EOS 3.5 Gas Mixture - Annual Subscription"
     - Price: $9,499.00 USD (recurring yearly)
     - Product ID: Note this for later

2. **Configure Webhook Endpoint**
   - [ ] In Stripe Dashboard → Developers → Webhooks
   - [ ] Add endpoint: `https://your-domain.com/api/stripe-webhook`
   - [ ] Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - [ ] Copy webhook signing secret

3. **Provide Required Information**
   Please provide:
   - [ ] Your domain URL (for redirect URLs)
   - [ ] Stripe Product/Price IDs from step 1
   - [ ] Webhook signing secret
   - [ ] Test mode or live mode preference for initial implementation

### Phase 3: Code Implementation (I WILL DO)

4. **Environment Configuration**
   - [ ] Create `.env` file with Stripe keys
   - [ ] Add Stripe config file (`src/stripe-config.js`)
   - [ ] Update Firebase Functions environment variables

5. **Backend Implementation**
   - [ ] Install Stripe SDK in Firebase Functions
   - [ ] Create Stripe checkout session endpoint
   - [ ] Implement webhook handler for payment confirmation
   - [ ] Update email notification function for Stripe payments

6. **Frontend Updates**
   - [ ] Replace PayPal SDK with Stripe.js
   - [ ] Update payment buttons to use Stripe Checkout
   - [ ] Implement success/cancel redirect pages
   - [ ] Update form validation for Stripe requirements

7. **Database Updates**
   - [ ] Add Stripe customer ID field to Firestore
   - [ ] Update purchase tracking to include Stripe payment data
   - [ ] Create subscription management collection

### Phase 4: Testing

8. **Test Transactions**
   - [ ] Test single purchase flow with test card
   - [ ] Test subscription creation with test card
   - [ ] Verify webhook processing
   - [ ] Check email notifications
   - [ ] Confirm Firebase tracking

9. **Test Cards for Stripe**
   ```
   Success: 4242 4242 4242 4242
   Decline: 4000 0000 0000 0002
   3D Secure: 4000 0027 6000 3184
   ```

### Phase 5: Migration & Launch

10. **Pre-Launch Checklist**
    - [ ] Update privacy policy (replace PayPal with Stripe)
    - [ ] Test full customer journey
    - [ ] Verify all tracking and analytics
    - [ ] Set up Stripe tax settings if needed
    - [ ] Configure fraud prevention rules

11. **Go Live**
    - [ ] Switch to live Stripe keys
    - [ ] Remove PayPal integration code
    - [ ] Monitor first real transactions
    - [ ] Archive PayPal configuration

## Next Steps for You

1. **Complete Phase 2** in your Stripe Dashboard
2. **Provide the required information** listed in step 3
3. Once you provide this info, I'll implement the code changes

## Questions to Answer

- Do you want to keep customer data from PayPal transactions?
- Do you need to migrate existing subscriptions from PayPal?
- Should we implement a test period before fully removing PayPal?
- Do you want to add any additional payment methods (Apple Pay, Google Pay)?

---

**Note**: Keep your secret key secure and never commit it to version control.