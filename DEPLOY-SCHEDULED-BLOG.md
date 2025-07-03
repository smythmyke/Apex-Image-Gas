# Deploy Scheduled Blog Publisher

## Prerequisites Checklist

✅ **API Keys in Firestore** (already done)
- Gemini API key
- Pexels API key  
- LinkedIn webhook URL
- Facebook webhook URL

✅ **Blog Topics** (already created)
- 7 topics across categories

✅ **Firebase Functions** (ready to deploy)
- scheduledBlogPublisher
- generateBlogManually

## Step 1: Create Required Indexes

The scheduled function needs a composite index. Create it here:

https://console.firebase.google.com/v1/r/project/apex-gas-9920e/firestore/indexes?create_composite=ClFwcm9qZWN0cy9hcGV4LWdhcy05OTIwZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvYmxvZ1RvcGljcy9pbmRleGVzL18QARoMCghjYXRlZ29yeRABGggKBHVzZWQQARoMCghwcmlvcml0eRACGgwKCF9fbmFtZV9fEAI

Or manually create an index for `blogTopics` collection:
- Field 1: `category` (Ascending)
- Field 2: `used` (Ascending)  
- Field 3: `priority` (Descending)

## Step 2: Deploy the Functions

```bash
cd /home/mykemet/Desktop/Projects/Apex_gas/functions

# Deploy only the blog functions
firebase deploy --only functions:scheduledBlogPublisher,functions:generateBlogManually

# Or deploy all functions
firebase deploy --only functions
```

## Step 3: Verify Deployment

After deployment, you'll see:
```
✔ Function scheduledBlogPublisher deployed
✔ Function generateBlogManually deployed
```

Check the Firebase Console:
https://console.firebase.google.com/project/apex-gas-9920e/functions

## Step 4: Test Manual Generation

Test the manual endpoint:
```bash
curl -X POST https://us-central1-apex-gas-9920e.cloudfunctions.net/generateBlogManually \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Best practices for X-ray gas cylinder storage",
    "category": "health-safety"
  }'
```

## Publishing Schedule

The blog will automatically publish:
- **Tuesday 10 AM EST**: Technology posts
- **Thursday 10 AM EST**: Health & Safety posts  
- **Saturday 10 AM EST**: Industry Insights posts

## Monitor Blog Publishing

1. **Check Logs**:
   ```bash
   firebase functions:log --only scheduledBlogPublisher
   ```

2. **View in Firestore**:
   - `blogPosts` collection for published blogs
   - `blogAutomationLogs` for success/failure logs
   - `usedPexelsImages` for image tracking

3. **Social Media**:
   - Check LinkedIn company page
   - Check Facebook page

## Manual Controls

### Pause Scheduling
In Firebase Console, disable the scheduled function

### Add More Topics
```javascript
db.collection('blogTopics').add({
  topic: "Your new topic here",
  category: "technology", // or health-safety, industry-insights
  priority: "high", // high, medium, low
  used: false,
  createdAt: new Date()
});
```

### Force Run Now (Testing)
The function only runs on schedule, but you can:
1. Temporarily change the schedule for testing
2. Use the manual generation endpoint
3. Run the blog writer scripts locally

## Troubleshooting

### Function Timeout
Default timeout is 9 minutes (540 seconds). If blogs take longer:
- Optimize prompts for shorter content
- Increase timeout in function config

### API Limits
- Gemini: Check quotas in Google Cloud Console
- Pexels: 200 requests per hour

### Social Media Not Posting
- Verify webhooks are still active in Zapier
- Check `socialMediaLogs` collection for errors

## Success Metrics

Monitor in `blogAutomationLogs`:
- Success rate (should be >90%)
- Average generation time
- Most common errors

The system will now automatically create and publish 3 blogs per week!