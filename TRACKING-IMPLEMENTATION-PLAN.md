# Analytics Tracking Implementation Plan

## Overview
Add comprehensive tracking for user interactions with order buttons and checkout flow to gain insights into user behavior and conversion rates.

## Current State
- ✅ Firebase Analytics initialized (line 1495 in index.html)
- ❌ No event logging implemented
- ❌ No click tracking on order buttons
- ❌ No conversion funnel tracking
- ❌ Analytics object not globally available

## Goals
1. Track all order button clicks (single purchase vs subscription)
2. Monitor checkout funnel (click → form open → form submit → checkout start → purchase)
3. Identify drop-off points in conversion process
4. Gather data for A/B testing and optimization

## Events to Track

### 1. Button Clicks
- **Event**: `order_button_clicked`
- **Parameters**:
  - `button_type`: "single" | "subscription" | "quote"
  - `button_location`: "pricing_section"
  - `timestamp`: Date/time of click

### 2. Modal Interactions
- **Event**: `checkout_modal_opened`
- **Parameters**:
  - `checkout_type`: "single" | "subscription"

- **Event**: `checkout_modal_closed`
- **Parameters**:
  - `checkout_type`: "single" | "subscription"
  - `closure_method`: "outside_click" | "cancel_button" | "form_submit"

### 3. Form Actions
- **Event**: `business_info_submitted`
- **Parameters**:
  - `checkout_type`: "single" | "subscription"
  - `facility_type`: User's selected facility type
  - `has_delivery_instructions`: boolean

### 4. Checkout Process
- **Event**: `checkout_started`
- **Parameters**:
  - `checkout_type`: "single" | "subscription"
  - `redirect_to_stripe`: boolean

- **Event**: `purchase_completed` (tracked via webhook)
- **Parameters**:
  - `amount`: Purchase amount
  - `currency`: "usd"
  - `type`: "one_time" | "subscription"
  - `facility_type`: Business facility type

### 5. Quote Requests
- **Event**: `quote_modal_opened`
- **Event**: `quote_form_submitted`

## Implementation Steps

### Phase 1: Setup (15 minutes)

#### 1.1 Make Analytics Globally Available
**File**: `index.html` (around line 1500)

```javascript
// Make them globally available
window.firebaseApp = app;
window.analytics = analytics;  // ADD THIS LINE
window.db = db;
window.functions = functions;
window.httpsCallable = httpsCallable;
```

#### 1.2 Import logEvent Function
**File**: `index.html` (around line 1479)

```javascript
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';
```

Make logEvent globally available:
```javascript
window.logEvent = logEvent;
```

### Phase 2: Button Click Tracking (15 minutes)

#### 2.1 Track Order Button Clicks
**File**: `index.html` (around lines 1707-1724)

**Current Code**:
```javascript
singleButton.addEventListener('click', () => {
  console.log('[BUTTON] Single purchase button clicked');
  openBusinessModal('single');
});

subscriptionButton.addEventListener('click', () => {
  console.log('[BUTTON] Subscription button clicked');
  openBusinessModal('subscription');
});
```

**New Code**:
```javascript
singleButton.addEventListener('click', () => {
  console.log('[BUTTON] Single purchase button clicked');

  // Track button click
  if (window.logEvent && window.analytics) {
    logEvent(window.analytics, 'order_button_clicked', {
      button_type: 'single',
      button_location: 'pricing_section'
    });
    console.log('[ANALYTICS] Logged order_button_clicked: single');
  }

  openBusinessModal('single');
});

subscriptionButton.addEventListener('click', () => {
  console.log('[BUTTON] Subscription button clicked');

  // Track button click
  if (window.logEvent && window.analytics) {
    logEvent(window.analytics, 'order_button_clicked', {
      button_type: 'subscription',
      button_location: 'pricing_section'
    });
    console.log('[ANALYTICS] Logged order_button_clicked: subscription');
  }

  openBusinessModal('subscription');
});
```

### Phase 3: Modal Tracking (10 minutes)

#### 3.1 Track Modal Opens
**File**: `index.html` (around line 1520)

**Current Code**:
```javascript
function openBusinessModal(checkoutType) {
  console.log('[MODAL] Opening business info modal for type:', checkoutType);
  currentCheckoutType = checkoutType;
  const modal = document.getElementById('businessInfoModal');
  if (modal) {
    modal.classList.add('active');
    console.log('[MODAL] Modal displayed');
  }
}
```

**New Code**:
```javascript
function openBusinessModal(checkoutType) {
  console.log('[MODAL] Opening business info modal for type:', checkoutType);
  currentCheckoutType = checkoutType;

  // Track modal open
  if (window.logEvent && window.analytics) {
    logEvent(window.analytics, 'checkout_modal_opened', {
      checkout_type: checkoutType
    });
    console.log('[ANALYTICS] Logged checkout_modal_opened:', checkoutType);
  }

  const modal = document.getElementById('businessInfoModal');
  if (modal) {
    modal.classList.add('active');
    console.log('[MODAL] Modal displayed');
  }
}
```

#### 3.2 Track Modal Closes
**File**: `index.html` (around line 1532)

**Current Code**:
```javascript
function closeBusinessModal() {
  console.log('[MODAL] Closing business info modal');
  const modal = document.getElementById('businessInfoModal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('businessInfoForm').reset();
    currentCheckoutType = null;
    console.log('[MODAL] Modal closed and form reset');
  }
}
```

**New Code**:
```javascript
function closeBusinessModal(closureMethod = 'cancel_button') {
  console.log('[MODAL] Closing business info modal');

  // Track modal close
  if (window.logEvent && window.analytics && currentCheckoutType) {
    logEvent(window.analytics, 'checkout_modal_closed', {
      checkout_type: currentCheckoutType,
      closure_method: closureMethod
    });
    console.log('[ANALYTICS] Logged checkout_modal_closed:', closureMethod);
  }

  const modal = document.getElementById('businessInfoModal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('businessInfoForm').reset();
    currentCheckoutType = null;
    console.log('[MODAL] Modal closed and form reset');
  }
}
```

Update outside click handler (around line 1548):
```javascript
if (e.target === modal) {
  console.log('[MODAL] Closing modal via outside click');
  closeBusinessModal('outside_click');  // Pass closure method
}
```

### Phase 4: Form Submission Tracking (10 minutes)

#### 4.1 Track Form Submissions
**File**: `index.html` (around line 1770)

**Find the form submission handler**:
```javascript
businessForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('[FORM] Form submitted');

  const businessInfo = getBusinessInfoFromModal();
  if (businessInfo && currentCheckoutType) {
    console.log('[FORM] Business info valid, proceeding to checkout');

    // ADD TRACKING HERE
    if (window.logEvent && window.analytics) {
      logEvent(window.analytics, 'business_info_submitted', {
        checkout_type: currentCheckoutType,
        facility_type: businessInfo.facilityType,
        has_delivery_instructions: !!businessInfo.deliveryAddress.instructions
      });
      console.log('[ANALYTICS] Logged business_info_submitted');
    }

    const checkoutType = currentCheckoutType;
    closeBusinessModal('form_submit');  // Updated to pass closure method
    handleStripeCheckout(checkoutType, businessInfo);
  }
});
```

### Phase 5: Checkout Start Tracking (10 minutes)

#### 5.1 Track Checkout Start
**File**: `index.html` (around line 1618)

**Find the handleStripeCheckout function**:
```javascript
async function handleStripeCheckout(priceType, businessInfo) {
  console.log('[CHECKOUT] Starting checkout process');

  // Track checkout start
  if (window.logEvent && window.analytics) {
    logEvent(window.analytics, 'checkout_started', {
      checkout_type: priceType,
      redirect_to_stripe: true
    });
    console.log('[ANALYTICS] Logged checkout_started:', priceType);
  }

  showTransactionMessage('Redirecting to secure checkout...', false);

  // ... rest of function
}
```

### Phase 6: Backend Purchase Tracking (15 minutes)

#### 6.1 Track Completed Purchases
**File**: `functions/index.js` (around line 448)

**Find the webhook handler's purchase tracking section**:
```javascript
await db.collection("purchases").add(purchaseData);
logger.info("Purchase tracked successfully:", purchaseData);

// ADD ANALYTICS TRACKING
try {
  // Log to Firebase Analytics via Admin SDK
  // Note: Admin SDK doesn't support analytics directly,
  // but we can log it in the purchase data for reporting
  await db.collection("analytics_events").add({
    event_name: "purchase_completed",
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    parameters: {
      amount: purchaseData.amount,
      currency: purchaseData.currency,
      type: purchaseData.type,
      facility_type: purchaseData.businessInfo.facilityType,
      has_delivery_instructions: !!purchaseData.deliveryAddress.instructions
    }
  });
  logger.info("Analytics event logged for purchase");
} catch (analyticsError) {
  logger.error("Error logging analytics event:", analyticsError);
  // Don't fail the webhook if analytics fails
}
```

## Data Analysis & Reporting

### Firebase Console
View analytics in:
- Firebase Console → Analytics → Events
- Custom dashboards in BigQuery (if enabled)

### Key Metrics to Monitor
1. **Conversion Rate**:
   - `order_button_clicked` → `purchase_completed`
   - Calculate drop-off at each step

2. **Preferred Purchase Type**:
   - Compare `single` vs `subscription` button clicks
   - Compare conversion rates by type

3. **Form Completion Rate**:
   - `checkout_modal_opened` → `business_info_submitted`

4. **Checkout Abandonment**:
   - `checkout_started` → `purchase_completed`

5. **Quote Interest**:
   - Track `quote_modal_opened` events

### Firestore Collections for Reporting

#### Option: Create Analytics Dashboard Collection
Store aggregated data for easy dashboard queries:

```javascript
// Collection: analytics_summary
{
  date: "2025-11-21",
  single_button_clicks: 45,
  subscription_button_clicks: 23,
  modal_opens: 68,
  form_submits: 52,
  checkout_starts: 51,
  purchases: 12,
  conversion_rate: 0.176, // 12/68
  average_order_value: 9999
}
```

## Testing Plan

### Test Cases
1. ✅ Click "Order Now" on single purchase → Check Firebase Analytics events
2. ✅ Click "Order Now" on subscription → Check Firebase Analytics events
3. ✅ Open modal and close with X → Verify closure_method = "cancel_button"
4. ✅ Open modal and click outside → Verify closure_method = "outside_click"
5. ✅ Fill form and submit → Verify facility_type and delivery instructions tracked
6. ✅ Complete purchase → Verify purchase_completed event with correct amount

### Verification Steps
1. Open Firebase Console → Analytics → DebugView
2. Enable debug mode: Add `?debug_mode=true` to URL
3. Perform actions and verify events appear in real-time
4. Check event parameters are correct

## Future Enhancements

### Phase 7 (Optional): A/B Testing
- Test different button text ("Order Now" vs "Get Started" vs "Buy Now")
- Test different pricing structures
- Track which variations convert better

### Phase 8 (Optional): Advanced Tracking
- Mouse hover tracking on buttons
- Time spent on modal before submit
- Field-level form abandonment
- Device/browser segmentation

### Phase 9 (Optional): Google Analytics 4
- Integrate GA4 for additional reporting
- Set up custom funnels
- Configure e-commerce tracking

## Benefits

### Business Insights
- **Identify bottlenecks**: See where users drop off
- **Optimize pricing**: Compare single vs subscription popularity
- **Improve UX**: Data-driven decisions on form fields
- **ROI tracking**: Measure marketing campaign effectiveness

### Technical Benefits
- **Debug user issues**: Understand user paths leading to errors
- **Performance monitoring**: Track time from click to purchase
- **Feature validation**: Measure impact of new features

## Deployment Checklist

- [ ] Phase 1: Setup analytics globals
- [ ] Phase 2: Add button click tracking
- [ ] Phase 3: Add modal tracking
- [ ] Phase 4: Add form submission tracking
- [ ] Phase 5: Add checkout start tracking
- [ ] Phase 6: Add backend purchase tracking
- [ ] Test in Firebase DebugView
- [ ] Deploy to production
- [ ] Monitor events for 24 hours
- [ ] Create analytics dashboard

## Estimated Time
- **Total Implementation**: 1.5 - 2 hours
- **Testing**: 30 minutes
- **Deployment**: 15 minutes

## Files to Modify
1. `index.html` - Add tracking to frontend interactions
2. `functions/index.js` - Add tracking to backend purchases

## Notes
- All tracking is privacy-compliant (no PII in analytics)
- Analytics events are batched and sent asynchronously
- Failed analytics calls won't break user experience
- Debug mode available for real-time testing

---

**Created**: 2025-11-21
**Status**: Ready for implementation
**Priority**: Medium
**Effort**: ~2.5 hours total
