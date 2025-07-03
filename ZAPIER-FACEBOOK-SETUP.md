# Zapier Facebook Integration Setup

## Your Facebook Page Information
- **Page Name**: Apex Image Gas
- **Page ID**: 61578037917573
- **Page URL**: https://www.facebook.com/profile.php?id=61578037917573

## Step 1: Create Facebook Zap in Zapier

1. **Log in to Zapier**
2. Click **"+ Create Zap"**
3. Name it: **"Apex Gas Blog to Facebook"**

## Step 2: Set Up Webhook Trigger

1. **Choose trigger**: "Webhooks by Zapier"
2. **Event**: "Catch Hook"
3. Click **Continue**
4. **Copy your webhook URL** - it will look like:
   ```
   https://hooks.zapier.com/hooks/catch/23550148/xxxxxxx/
   ```

## Step 3: Connect Facebook

1. Click **"+"** to add action
2. Search for **"Facebook Pages"**
3. Choose **"Create Page Post"**
4. Click **Continue**

## Step 4: Connect Your Facebook Account

1. Click **"Sign in to Facebook Pages"**
2. Log in with your Facebook account
3. You'll see a permissions screen - **Allow** Zapier to:
   - Manage your Pages
   - Create content
   - Publish as Pages you manage
4. Click **OK** or **Allow**

## Step 5: Configure the Post

### Select Your Page
- Choose: **Apex Image Gas (61578037917573)**

### Map the Fields

**Message** (Required):
- Click the field and select **"1. Message"** from the dropdown
- This pulls the message from the webhook

**Link URL** (Optional):
- Select **"1. Link_url"**
- For sharing blog posts

**Link Name** (Optional):
- Select **"1. Link_name"**
- The title that appears with the link

**Link Caption** (Optional):
- Select **"1. Link_caption"**
- Small text under the link

**Link Description** (Optional):
- Select **"1. Link_description"**
- Description text for the link

**Picture URL** (Optional):
- Select **"1. Image_url"**
- For post images

## Step 6: Test the Zap

1. Click **"Test action"**
2. Zapier will create a test post
3. Check your Facebook page

## Step 7: Publish the Zap

1. Click **"Publish Zap"**
2. Turn the Zap **ON**
3. Copy your webhook URL

## What We'll Send to Facebook

Our blog automation will send:
```json
{
  "message": "Check out our latest insights on X-ray detector gas safety! Learn about proper handling, storage, and maintenance of medical imaging gases.",
  "link_url": "https://apeximagegas.net/blog/gas-safety-guide",
  "link_name": "X-Ray Detector Gas Safety Guide",
  "link_caption": "Apex Image Gas Blog",
  "link_description": "Essential safety practices for medical imaging professionals",
  "image_url": "https://images.pexels.com/photos/xxxxx.jpg"
}
```

## After Setup

Once you have your webhook URL, share it with me and we'll:
1. Save the configuration
2. Test posting to Facebook
3. Set up dual posting to both LinkedIn and Facebook

---

**Need help?** Common issues:
- Make sure you're logged into Facebook as a page admin
- Ensure the Zap is turned ON
- Check that all permissions were granted to Zapier