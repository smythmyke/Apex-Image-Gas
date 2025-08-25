# SMS Notification Setup Guide

## Option 1: Twilio SMS Notifications

### Step 1: Sign up for Twilio
1. Go to [Twilio.com](https://www.twilio.com/try-twilio)
2. Sign up for a free account (includes $15 credit)
3. Verify your phone number

### Step 2: Get Twilio Credentials
From your Twilio Console, you'll need:
- Account SID
- Auth Token  
- Phone Number (get one from Twilio)

### Step 3: Add to .env file
```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
ADMIN_PHONE_NUMBER=+12144003781  # Your personal phone to receive notifications
```

### Step 4: Install Twilio package
```bash
cd functions
npm install twilio
```

### Step 5: Add SMS code to functions/index.js
The code will send you an SMS whenever:
- A new purchase is made
- A subscription is created
- A form is submitted

## Option 2: Email-to-SMS Gateway

Most carriers provide email-to-SMS gateways:
- AT&T: [phone]@txt.att.net
- T-Mobile: [phone]@tmomail.net
- Verizon: [phone]@vtext.com
- Sprint: [phone]@messaging.sprintpcs.com

You can use the existing email system to send to these addresses for free SMS.

## Notification Summary

### What You'll Receive:
1. **Instant SMS** when purchase happens
2. **Email** with full details
3. **Firestore record** for permanent tracking

### What Customer Receives:
1. **Order confirmation page** 
2. **Email receipt** with order details
3. **Stripe receipt** (from Stripe directly)

### Sample SMS Message:
```
🔔 New Apex Gas Order!
Amount: $9,999
Company: Apex Government Contracting LLC
Contact: Michael Smith
Phone: 214-400-3781
Check email for details.
```