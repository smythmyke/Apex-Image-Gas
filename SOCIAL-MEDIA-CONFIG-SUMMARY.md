# Social Media Configuration Summary

## ✅ Successfully Configured:

### LinkedIn
- **Company**: Apex Image Gas
- **Company ID**: 103002431
- **Page URL**: https://www.linkedin.com/company/apex-image-gas
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/`
- **Status**: ✅ Tested and working

### Facebook
- **Page Name**: Apex Image Gas
- **Page ID**: 61578037917573
- **Page URL**: https://www.facebook.com/profile.php?id=61578037917573
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/`
- **Status**: ✅ Tested and working

## Firebase Configuration Needed:

### Option 1: Update Firestore via Console

1. Go to: https://console.firebase.google.com/project/apex-gas-9920e/firestore/databases/-default-/data

2. In the `apiKeys` collection, `Keys` document, add:
```json
{
  "linkedinWebhookUrl": "https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/",
  "facebookWebhookUrl": "https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/",
  "socialMediaEnabled": true
}
```

3. Create a `config` collection with these documents:

**Document ID: linkedin**
```json
{
  "platform": "linkedin",
  "enabled": true,
  "companyName": "Apex Image Gas",
  "companyId": "103002431",
  "companyUrl": "https://www.linkedin.com/company/apex-image-gas",
  "webhookUrl": "https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/"
}
```

**Document ID: facebook**
```json
{
  "platform": "facebook",
  "enabled": true,
  "pageName": "Apex Image Gas",
  "pageId": "61578037917573",
  "pageUrl": "https://www.facebook.com/profile.php?id=61578037917573",
  "webhookUrl": "https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/"
}
```

### Option 2: Get Service Account Key

1. Go to: https://console.firebase.google.com/project/apex-gas-9920e/settings/serviceaccounts/adminsdk
2. Generate and download the private key
3. Save as `serviceAccountKey.json` in your project root
4. Run: `node scripts/save-social-media-config.js`

## Test Scripts Available:

### Test LinkedIn Posting:
```bash
node scripts/test-linkedin-webhook.js
```

### Test Facebook Posting:
```bash
node scripts/test-facebook-direct.js
```

### Test Both Platforms:
```bash
# Create a combined test script
node scripts/test-all-social-media.js
```

## Next Steps:

1. ✅ LinkedIn webhook configured and tested
2. ✅ Facebook webhook configured and tested
3. ⏳ Add configurations to Firebase (manual or via service account)
4. ⏳ Copy blog generation scripts from GovTools Pro
5. ⏳ Adapt content for medical/X-ray topics
6. ⏳ Set up automated scheduling

## Your Blog Automation is Ready!

Once you add the configuration to Firebase, your blog posts will automatically be shared to both LinkedIn and Facebook!