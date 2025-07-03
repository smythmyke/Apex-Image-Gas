# LinkedIn Setup Guide for Apex Image Gas

## Information Needed from Your LinkedIn Company Page

Since you already have a LinkedIn Company Page for Apex Image Gas, I need the following information:

### 1. **Company Page URL**
Please provide the full URL of your LinkedIn company page.
Example: `https://www.linkedin.com/company/apex-image-gas/`

### 2. **Company Page ID**
To find your Company Page ID:
1. Go to your LinkedIn Company Page as an admin
2. Click on "Admin tools" → "Page info"
3. Look for the numeric ID in the URL or page settings
4. Example: `12345678`

### 3. **LinkedIn App Creation** (Required for API Access)
We need to create a LinkedIn App for posting automation:

1. **Go to**: https://www.linkedin.com/developers/
2. **Click**: "Create app"
3. **Fill in**:
   - App name: "Apex Gas Blog Automation"
   - LinkedIn Page: Select "Apex Image Gas"
   - Privacy policy URL: https://apeximagegas.net/privacy
   - App logo: Upload your company logo
4. **After creation, provide**:
   - Client ID: `_________________`
   - Client Secret: `_________________`

### 4. **Permissions Required**
In the LinkedIn app settings, request these permissions:
- `w_member_social` - Post on behalf of members
- `w_organization_social` - Post on behalf of organizations
- `r_organization_social` - Read organization posts

### 5. **Zapier Integration Setup**
Since we're using Zapier for posting:

1. **Create a Zapier account** (if you don't have one)
2. **Subscribe to Professional plan** ($49/month) for webhooks
3. **Create a new Zap**:
   - Trigger: Webhooks by Zapier (Catch Hook)
   - Action: LinkedIn Pages (Create Company Update)
4. **Connect your LinkedIn**:
   - Authorize Zapier to post to your company page
5. **Get the webhook URL**:
   - Example: `https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_KEY/`

## Quick Setup Checklist

Please provide:
- [ ] LinkedIn Company Page URL
- [ ] Company Page ID (numeric)
- [ ] LinkedIn App Client ID
- [ ] LinkedIn App Client Secret
- [ ] Zapier webhook URL for LinkedIn

## Alternative: Manual Collection Script

Once you provide the above information, I'll create a script to save it all to Firebase:

```javascript
// This is what we'll save to Firebase
{
  linkedinCompanyUrl: "https://www.linkedin.com/company/apex-image-gas/",
  linkedinCompanyId: "YOUR_NUMERIC_ID",
  linkedinClientId: "YOUR_CLIENT_ID",
  linkedinClientSecret: "YOUR_CLIENT_SECRET",
  linkedinWebhookUrl: "YOUR_ZAPIER_WEBHOOK_URL",
  linkedinPageName: "Apex Image Gas"
}
```

## Security Note
All these credentials will be stored securely in your Firebase Firestore database under the `apiKeys` collection, not in any .env files or code.

---

**Please provide the information above, and I'll help you complete the setup!**