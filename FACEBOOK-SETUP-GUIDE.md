# Facebook Setup Guide for Apex Image Gas

## Prerequisites
- Facebook Business Page for Apex Image Gas
- Admin access to the page
- Zapier Professional account (already have this)

## Step 1: Get Your Facebook Page Information

1. **Go to your Facebook Business Page**
2. **Find your Page ID**:
   - Go to your page
   - Click "About" in the left menu
   - Scroll down to find "Page ID"
   - Copy this number

3. **Get your Page Name**:
   - This is your official page name on Facebook

## Step 2: Create a New Zapier Zap for Facebook

### 2.1 Create the Zap
1. **Log in to Zapier**
2. Click **"+ Create Zap"**
3. Name it: "Apex Gas Blog to Facebook"

### 2.2 Set Up the Trigger (Webhook)
1. **Search for**: "Webhooks by Zapier"
2. **Select trigger**: "Catch Hook"
3. **Click Continue**
4. **Copy the webhook URL** - It will look like:
   ```
   https://hooks.zapier.com/hooks/catch/23550148/xxxxxxx/
   ```

### 2.3 Test the Webhook
1. Keep Zapier window open
2. We'll send test data after setup

## Step 3: Set Up Facebook Action

### 3.1 Choose Facebook Pages App
1. Click **"+"** to add an action
2. Search for **"Facebook Pages"**
3. Select action: **"Create Page Post"**

### 3.2 Connect Your Facebook Account
1. Click **"Sign in to Facebook Pages"**
2. **Log in** with your Facebook credentials
3. **Authorize** Zapier to:
   - Manage your pages
   - Create content
   - Publish posts
4. **Select** your Apex Image Gas page

### 3.3 Configure the Post Fields

**Page**: 
- Select your Apex Image Gas page

**Message** (Required):
- Click in field and select "1. Message" from webhook data
- This is the main text of your Facebook post

**Link URL** (Optional):
- Map to "1. Link_url" from webhook data
- For sharing blog links

**Picture URL** (Optional):
- Map to "1. Image_url" from webhook data
- For post images

### 3.4 Test the Action
1. Use sample data for testing
2. Click **"Test action"**
3. Check your Facebook page for the test post

## Step 4: Turn On Your Zap

1. Click **"Publish Zap"**
2. Toggle to **"ON"**
3. Your Facebook webhook is now live!

## What Your Webhook Will Receive

```json
{
  "message": "Check out our latest blog post about X-ray detector gas safety! Learn best practices for handling and storing medical gases.",
  "link_url": "https://apeximagegas.net/blog/gas-safety-guide",
  "image_url": "https://images.pexels.com/photos/xxxxx.jpg",
  "link_name": "Gas Safety Guide",
  "link_caption": "Apex Image Gas Blog",
  "link_description": "Essential safety tips for medical gas handling"
}
```

## Facebook-Specific Considerations

1. **Character Limits**:
   - Recommended: 40-80 characters for best engagement
   - Maximum: 63,206 characters (but keep it short!)

2. **Best Practices**:
   - Use emojis sparingly
   - Ask questions to encourage engagement
   - Include clear CTAs
   - Post during business hours

3. **Hashtags**:
   - Less effective on Facebook than LinkedIn
   - Use 1-2 relevant hashtags maximum

## Please Provide:

1. **Facebook Page Name**: _________________
2. **Facebook Page ID**: _________________
3. **Zapier Webhook URL**: _________________

Once you provide these, I'll save the configuration and we can test posting!