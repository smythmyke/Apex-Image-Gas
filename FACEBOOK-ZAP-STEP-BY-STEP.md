# Facebook Zap Setup - Complete Step-by-Step Guide

## Starting Fresh

### Step 1: Create a New Zap
1. Go to https://zapier.com/app/zaps
2. Click the **"+ Create Zap"** button (usually orange/purple)
3. You'll see a blank canvas with "Trigger" and "Action" sections

### Step 2: Set Up the TRIGGER (This receives data from our blog)

1. **Click on "Trigger"**
2. In the search box, type: **"webhook"**
3. Select: **"Webhooks by Zapier"**
   - Icon looks like: </> 
4. For "Trigger Event", select: **"Catch Hook"**
5. Click **"Continue"**

### Step 3: Get Your Webhook URL

1. You'll see a screen with a webhook URL like:
   ```
   https://hooks.zapier.com/hooks/catch/23550148/3xxxxxx/
   ```
2. **COPY THIS URL** - Save it somewhere safe
3. Click **"Continue"**
4. Skip the test for now (click "Skip Test")

### Step 4: Add the ACTION (This posts to Facebook)

1. Click the **"+"** button below the trigger
2. In the search box, type: **"facebook"**
3. Select: **"Facebook Pages"**
   - Make sure it's "Pages" not personal Facebook
4. For "Action Event", select: **"Create Page Post"**
5. Click **"Continue"**

### Step 5: Connect Your Facebook Account

1. Click **"Sign in to Facebook Pages"**
2. A popup window will open
3. Log in to Facebook if needed
4. You'll see permissions - click **"Continue as [Your Name]"**
5. Select which pages Zapier can access:
   - ✅ Check "Apex Image Gas"
6. Click **"Next"** or **"Done"**
7. The popup closes and you're back in Zapier

### Step 6: Configure the Facebook Post

Now you'll see fields to fill in:

**Page**:
- Select: "Apex Image Gas (61578037917573)"

**Message**:
- Click in the field
- On the right, you'll see "1. Message"
- Click on "1. Message" to insert it

**Link URL** (Optional):
- Click "Show all options" if needed
- Click in the Link URL field
- Select "1. Link_url" from the right

**Picture URL** (Optional):
- Click in the field
- Select "1. Image_url" from the right

### Step 7: Test the Action

1. Click **"Test action"**
2. Zapier will say it needs test data
3. Click **"Skip test"** for now (we'll test with real data)

### Step 8: Publish Your Zap

1. At the top, name your Zap: **"Apex Gas Blog to Facebook"**
2. Click **"Publish"**
3. Make sure the toggle is **ON**

### Step 9: Get Your Final Webhook URL

1. Click on the first step (Webhooks trigger)
2. Copy the webhook URL again
3. Share this URL with me!

## Your webhook URL should look like:
```
https://hooks.zapier.com/hooks/catch/23550148/[unique-code]/
```

## Common Issues:

**Can't find Webhooks?**
- Make sure you're searching in the TRIGGER section, not action
- Type "webhook" not "webhooks"

**Facebook not connecting?**
- Make sure you're logged in as a page admin
- Try using a different browser
- Clear cookies and try again

**Don't see your page?**
- Make sure you selected "Facebook Pages" not regular Facebook
- Ensure you have admin access to the page

---

Once you have your webhook URL, share it with me and we'll test posting to Facebook!