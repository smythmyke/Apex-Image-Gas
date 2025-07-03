# Zapier LinkedIn Integration Setup Guide

## Step 1: Create Zapier Account

1. **Go to**: https://zapier.com/sign-up
2. **Sign up** with your email
3. **Choose plan**: Select "Professional" ($49/month) - Required for webhooks
   - You get a 14-day free trial
   - Webhooks are only available on paid plans

## Step 2: Create Your LinkedIn Zap

### 2.1 Start Creating the Zap
1. **Log in** to Zapier
2. Click **"+ Create Zap"** button
3. Name your Zap: "Apex Gas Blog to LinkedIn"

### 2.2 Set Up the Trigger (Webhook)
1. **Search for**: "Webhooks by Zapier"
2. **Select trigger**: "Catch Hook"
3. **Click Continue**
4. **Webhook URL**: Zapier will generate a unique URL like:
   ```
   https://hooks.zapier.com/hooks/catch/23550148/3abcdef/
   ```
5. **COPY THIS URL** - You'll need it for the blog automation

### 2.3 Test the Webhook
1. Keep the Zapier window open
2. In a new terminal, run this test command:
   ```bash
   curl -X POST https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_KEY/ \
     -H "Content-Type: application/json" \
     -d '{
       "commentary": "Test post from Apex Gas",
       "visibility": "PUBLIC"
     }'
   ```
3. Click **"Test trigger"** in Zapier
4. You should see the test data appear

## Step 3: Set Up the LinkedIn Action

### 3.1 Choose LinkedIn App
1. Click **"+"** to add an action
2. Search for **"LinkedIn Pages"**
3. Select action: **"Create Company Update"**

### 3.2 Connect Your LinkedIn Account
1. Click **"Sign in to LinkedIn Pages"**
2. **Log in** with your LinkedIn credentials
3. **Authorize** Zapier to access your company page
4. **Select** "Apex Image Gas" as the company page

### 3.3 Configure the Post
Set up the fields as follows:

**Company**: 
- Select "Apex Image Gas (103002431)"

**Commentary** (Required):
- Click in the field and select "1. Commentary" from the webhook data
- This is the main text of your LinkedIn post

**Visibility**:
- Select "1. Visibility" from webhook data
- Or set to "PUBLIC" as default

**Link URL** (Optional):
- Map to "1. Link_url" from webhook data
- This allows sharing blog links

**Link Title** (Optional):
- Map to "1. Link_title" from webhook data

**Link Description** (Optional):
- Map to "1. Link_description" from webhook data

### 3.4 Test the Action
1. Click **"Test action"**
2. Zapier will create a test post on your LinkedIn page
3. Check your LinkedIn page to verify it worked

## Step 4: Turn On Your Zap

1. Click **"Publish Zap"** at the top
2. Toggle the Zap to **"ON"**
3. Your webhook is now live!

## Step 5: Save Your Webhook URL

Run this command in your Apex Gas project:
```bash
cd /home/mykemet/Desktop/Projects/Apex_gas
node scripts/update-linkedin-credentials.js
```

Enter your webhook URL when prompted:
```
https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_KEY/
```

## What Your Webhook Accepts

Your blog automation will send data like this:
```json
{
  "commentary": "Blog post title and excerpt with hashtags",
  "visibility": "PUBLIC",
  "link_url": "https://apeximagegas.net/blog/post-slug",
  "link_title": "Blog Post Title",
  "link_description": "Brief description of the blog post",
  "image_url": "https://images.pexels.com/..."
}
```

## Testing Your Integration

After setup, test with this Node.js script:

```javascript
const axios = require('axios');

const webhookUrl = 'YOUR_WEBHOOK_URL_HERE';
const testPost = {
  commentary: "🧪 Testing Apex Gas LinkedIn integration! Learn about the importance of precision gas mixtures in medical X-ray imaging. #MedicalImaging #XrayTechnology",
  visibility: "PUBLIC",
  link_url: "https://apeximagegas.net",
  link_title: "Apex Image Gas - Premium X-Ray Detector Gas",
  link_description: "Specialized gas solutions for EOS X-ray machines"
};

axios.post(webhookUrl, testPost)
  .then(() => console.log('✅ Post sent successfully!'))
  .catch(err => console.error('❌ Error:', err.message));
```

## Troubleshooting

### Webhook not receiving data?
- Ensure you're on a paid Zapier plan
- Check the webhook URL is correct
- Verify Content-Type is "application/json"

### LinkedIn post not appearing?
- Check you selected the right company page
- Ensure you have admin access to the page
- Verify the post content meets LinkedIn's requirements

### Need to find your webhook URL again?
1. Go to your Zaps
2. Click on "Apex Gas Blog to LinkedIn"
3. Click on the trigger step
4. Your webhook URL is displayed there

## Next Steps

Once your webhook is working:
1. The blog automation will automatically post to LinkedIn
2. Posts will include relevant hashtags
3. Each blog post will link back to your website
4. Analytics will track engagement

---

**Need help?** The most common issue is forgetting to upgrade to a paid Zapier plan. Webhooks require at least the Professional plan.