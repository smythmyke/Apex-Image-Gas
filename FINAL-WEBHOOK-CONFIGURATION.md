# Final Social Media Webhook Configuration

## ✅ Verified and Working Webhooks

### LinkedIn
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/`
- **Company Page**: https://www.linkedin.com/company/apex-image-gas
- **Status**: ✅ Tested and working

### Facebook  
- **Webhook URL**: `https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/`
- **Page URL**: https://www.facebook.com/profile.php?id=61578037917573
- **Status**: ✅ Tested and working

## Add to Firebase

Go to: https://console.firebase.google.com/project/apex-gas-9920e/firestore/databases/-default-/data

### In `apiKeys` > `Keys` document, add:
```json
{
  "linkedinWebhookUrl": "https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/",
  "facebookWebhookUrl": "https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/",
  "socialMediaEnabled": true
}
```

## Test Scripts Available

### Test Both Platforms:
```bash
node scripts/final-social-config.js
```

### Test LinkedIn Only:
```bash
node scripts/update-linkedin-webhook.js
```

### Test Facebook Only:
```bash
node scripts/test-facebook-direct.js
```

## Blog Automation Ready!

Your social media automation is fully configured. When the blog system publishes a new post, it will automatically be shared to both LinkedIn and Facebook using these webhooks.

## Next Steps:
1. Add these webhook URLs to Firebase
2. Copy blog generation scripts from GovTools Pro
3. Adapt content for medical/X-ray topics
4. Deploy automated scheduling