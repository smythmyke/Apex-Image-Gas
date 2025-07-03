#!/usr/bin/env node

/**
 * Update LinkedIn credentials after Zapier setup
 * Run this script after you have your Zapier webhook URL
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function updateLinkedInCredentials() {
  try {
    console.log('🔧 Update LinkedIn Integration Credentials\n');
    console.log('This script will help you add your Zapier webhook URL for LinkedIn posting.\n');

    // Get Zapier webhook URL
    const webhookUrl = await question('Enter your Zapier LinkedIn webhook URL: ');
    
    if (!webhookUrl || !webhookUrl.includes('hooks.zapier.com')) {
      console.error('❌ Invalid webhook URL. It should look like: https://hooks.zapier.com/hooks/catch/...');
      rl.close();
      process.exit(1);
    }

    // Optional: LinkedIn Developer App credentials
    const hasLinkedInApp = await question('\nDo you have a LinkedIn Developer App? (y/n): ');
    
    let clientId = '';
    let clientSecret = '';
    
    if (hasLinkedInApp.toLowerCase() === 'y') {
      clientId = await question('Enter LinkedIn Client ID: ');
      clientSecret = await question('Enter LinkedIn Client Secret: ');
    }

    console.log('\n📝 Updating LinkedIn configuration...');

    // Update LinkedIn config
    const updateData = {
      linkedinWebhookUrl: webhookUrl,
      postingEnabled: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (clientId) updateData.linkedinClientId = clientId;
    if (clientSecret) updateData.linkedinClientSecret = clientSecret;

    await db.collection('config').doc('linkedin').update(updateData);

    // Also update apiKeys collection
    await db.collection('apiKeys').doc('Keys').update({
      linkedinWebhookUrl: webhookUrl,
      ...(clientId && { linkedinClientId: clientId }),
      ...(clientSecret && { linkedinClientSecret: clientSecret }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ LinkedIn credentials updated successfully!');

    // Test the webhook
    const testWebhook = await question('\nWould you like to send a test post to LinkedIn? (y/n): ');
    
    if (testWebhook.toLowerCase() === 'y') {
      console.log('\n🚀 Sending test post...');
      
      const axios = require('axios');
      const testData = {
        commentary: "🚀 Exciting news from Apex Image Gas! We're launching our automated content system to share insights about X-ray technology, medical imaging, and gas detector safety. Stay tuned for regular updates! #MedicalImaging #XrayTechnology",
        visibility: 'PUBLIC',
        timestamp: new Date().toISOString(),
        test_mode: true
      };

      try {
        const response = await axios.post(webhookUrl, testData);
        console.log('✅ Test post sent successfully!');
        console.log('📱 Check your LinkedIn company page for the post.');
      } catch (error) {
        console.error('❌ Test post failed:', error.message);
      }
    }

    console.log('\n✨ LinkedIn integration is ready!');
    console.log('\n📋 Configuration Summary:');
    console.log('   - Company: Apex Image Gas');
    console.log('   - Company ID: 103002431');
    console.log('   - Webhook: ' + (webhookUrl ? '✅ Configured' : '❌ Missing'));
    console.log('   - LinkedIn App: ' + (clientId ? '✅ Configured' : '⏭️  Skipped (using Zapier only)'));
    console.log('\n🎉 You can now post to LinkedIn automatically!');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating credentials:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the update
updateLinkedInCredentials();