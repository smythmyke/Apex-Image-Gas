# Twilio Phone Number Setup

## Issue
You need a Twilio phone number to send SMS messages. The phone number 214-400-3781 appears to be your personal number, not a Twilio number.

## How to Get a Twilio Phone Number

1. **Log into Twilio Console**
   - Go to https://console.twilio.com
   - Use your recovery code if needed: Q711KTC9MSCUA71BUCTL692X

2. **Get a Phone Number**
   - Navigate to Phone Numbers > Manage > Buy a number
   - Or use this direct link: https://console.twilio.com/us1/develop/phone-numbers/manage/search
   - Select "SMS" capability
   - Choose a US number (preferably with 214 area code for local presence)
   - Click "Buy" (Free with trial credit)

3. **Update the .env file**
   Replace the TWILIO_PHONE_NUMBER with your new Twilio number:
   ```
   TWILIO_PHONE_NUMBER=+1[your-twilio-number]
   ADMIN_PHONE_NUMBER=+12144003781  # Your personal number stays here
   ```

## Example Twilio Numbers
Twilio numbers usually look like:
- +14695551234 (469 is near Dallas)
- +12145551234 (214 Dallas area code)
- +18335551234 (Toll-free)

## What Will Happen
Once configured:
- **From**: Your Twilio phone number (e.g., +14695551234)
- **To**: Your personal phone (214-400-3781)
- **Messages**: You'll receive SMS alerts for orders and form submissions

## Testing
After getting your Twilio number, we can test with:
```javascript
// Test message
from: '+1[twilio-number]',  // Your Twilio number
to: '+12144003781'           // Your personal number
```