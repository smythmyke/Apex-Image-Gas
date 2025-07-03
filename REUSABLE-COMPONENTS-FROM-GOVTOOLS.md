# Reusable Components from GovTools Pro

## 🔑 API Keys Available for Reuse

### 1. **Gemini API Key** ✅
```
REACT_APP_GEMINI_API_KEY=AIzaSyB9xTJtKx4ftwGufAhkLlOrS79zmqam_ZY
```
- **Status**: Can be reused for blog content generation
- **Model**: gemini-2.0-flash-exp
- **Note**: Consider getting your own key for production

### 2. **Pexels API Key** ❓
- Not found in .env but loaded from Firestore
- Need to check Firestore `apiKeys` collection

### 3. **Zapier Webhook URLs** ✅
```javascript
linkedinWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ub9ltk5/'
facebookWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ub8y2je/'
```
- **Status**: These are specific to GovTools Pro's Zapier account
- **Action Required**: You'll need to create your own Zapier webhooks

## 📦 Code Components to Copy

### 1. **Automated Blog Writer** (`/scripts/automated-blog-writer.js`)
Key features to adapt:
- Gemini AI integration
- Content generation pipeline
- SEO metadata generation
- Word count validation
- Image keyword generation

### 2. **Blog Configuration** (`/scripts/blog-automation-config.js`)
Directly reusable:
- Blog structure templates (1,500-1,800 words)
- SEO optimization guidelines
- Content quality standards
- Markdown formatting rules

**Needs Modification**:
- CTA templates (change from GovTools Pro to Apex Gas)
- Topic categories (adapt to medical/X-ray content)

### 3. **Scheduled Blog Publisher** (`/server/functions-v2/src/scheduledBlogPublisher.ts`)
Key features:
- Firebase Cloud Scheduler integration
- Pexels image selection with tracking
- Multi-stage content generation
- Automatic publishing workflow
- Schedule: Tuesday, Thursday, Sunday at 9 AM EST

### 4. **Social Media Routes** (`/server/functions-v2/src/routes/socialMediaRoutes.ts`)
Complete implementation for:
- LinkedIn company page posting
- Facebook page posting
- Zapier webhook integration
- Activity logging

### 5. **Image Tracking System**
```javascript
class PexelsImageTracker {
  // Tracks used images to prevent duplicates
  // Stores in 'usedPexelsImages' collection
}
```

## 🏗️ Infrastructure Already in Apex Gas

### ✅ Can Reuse Directly:
1. **Firebase Setup**
   - Project: apex-gas-9920e
   - Firestore database
   - Cloud Functions

2. **Email Service (Resend)**
   - API Key: re_cKR4rdJv_CWrR73qa1d6WFrWzZRHbbC86
   - Can extend for blog notifications

3. **Analytics**
   - Google Analytics (G-PZMWFDYJ0L)
   - Event tracking

## 📋 Implementation Checklist

### Phase 1: Copy Core Files
- [ ] Copy `automated-blog-writer.js` and adapt for medical content
- [ ] Copy `blog-automation-config.js` and modify CTAs
- [ ] Copy `scheduledBlogPublisher.ts` 
- [ ] Copy `socialMediaRoutes.ts`

### Phase 2: Adapt Content Generation
- [ ] Modify prompts for X-ray/medical content
- [ ] Create Apex Gas-specific topic categories:
  - X-ray technology
  - EOS Alphatec systems
  - Gas detectors and safety
  - Health and radiation safety
  - Industry compliance

### Phase 3: Update CTAs
Replace GovTools Pro CTAs with Apex Gas versions:
```javascript
ctaTemplates: {
  productRelated: `
## Ensure X-Ray Safety with Apex Image Gas

High-quality imaging starts with premium gas mixtures. Apex Image Gas provides 
specialized 1L gas bottles designed specifically for EOS 3.5 X-ray machines.

**Why Choose Apex Image Gas:**
- Precision-mixed gases for optimal imaging
- Convenient 1L bottles perfect for medical facilities
- Reliable supply chain and fast delivery
- Expert support for all your imaging needs

**[Order Your Gas Supply Today](https://apeximagegas.net)**
  `,
  // Add more CTAs...
}
```

### Phase 4: Set Up Your Own Services
- [ ] Create your own Zapier account and webhooks
- [ ] Get your own Pexels API key
- [ ] Consider getting your own Gemini API key
- [ ] Create LinkedIn Company Page for Apex Gas
- [ ] Create Facebook Business Page for Apex Gas

## 🚀 Quick Start Guide

1. **Copy these files to Apex Gas project:**
   ```bash
   # From govtoolspro
   /scripts/automated-blog-writer.js
   /scripts/blog-automation-config.js
   /server/functions-v2/src/scheduledBlogPublisher.ts
   /server/functions-v2/src/routes/socialMediaRoutes.ts
   ```

2. **Update Firebase Functions package.json:**
   ```json
   {
     "dependencies": {
       "@google/generative-ai": "^0.1.0",
       "axios": "^1.6.0",
       "marked": "^11.0.0"
     }
   }
   ```

3. **Add to Firestore apiKeys collection:**
   ```javascript
   {
     REACT_APP_GEMINI_API_KEY: "AIzaSyB9xTJtKx4ftwGufAhkLlOrS79zmqam_ZY",
     PEXELS_API_KEY: "your-pexels-key",
     linkedinWebhookUrl: "your-zapier-linkedin-webhook",
     facebookWebhookUrl: "your-zapier-facebook-webhook"
   }
   ```

4. **Deploy scheduled function:**
   ```bash
   firebase deploy --only functions:scheduledBlogPublisher
   ```

## ⚠️ Important Notes

1. **API Keys**: The Gemini API key provided is from GovTools Pro. For production, get your own.

2. **Zapier Webhooks**: The URLs provided are specific to GovTools Pro's Zapier account. You must create your own.

3. **Content Adaptation**: All blog generation prompts need to be rewritten for medical/X-ray content instead of government contracting.

4. **Migration Path**: Since Apex Gas is currently static HTML, you'll need to migrate to Next.js first before implementing the full blog system.

5. **Testing**: Test with the Gemini API in a sandbox environment before going live.