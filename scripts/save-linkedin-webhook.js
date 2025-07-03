#!/usr/bin/env node

/**
 * Save LinkedIn webhook URL to Firebase
 * This script configures the Zapier webhook for LinkedIn posting
 */

const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function saveLinkedInWebhook() {
  try {
    console.log('🔧 Saving LinkedIn webhook configuration...\n');

    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/';

    // Update LinkedIn config
    await db.collection('config').doc('linkedin').update({
      linkedinWebhookUrl: webhookUrl,
      postingEnabled: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Also update apiKeys collection
    await db.collection('apiKeys').doc('Keys').update({
      linkedinWebhookUrl: webhookUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ LinkedIn webhook saved successfully!');
    console.log('   Webhook URL:', webhookUrl);

    // Send a test post
    console.log('\n🚀 Sending test post to LinkedIn...');
    
    const testData = {
      commentary: "🚀 Apex Image Gas is excited to announce our new automated content system! We'll be sharing valuable insights about X-ray technology, medical imaging best practices, and gas detector safety. Follow us for expert content on precision gas solutions for EOS X-ray machines. #MedicalImaging #XrayTechnology #HealthcareTechnology",
      visibility: 'PUBLIC',
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post(webhookUrl, testData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Test post sent successfully!');
      console.log('   Status:', response.status);
      console.log('   Zapier Response:', response.data);
      console.log('\n📱 Check your LinkedIn company page in a few seconds!');
      console.log('   https://www.linkedin.com/company/apex-image-gas');
    } catch (error) {
      console.error('❌ Test post failed:', error.message);
      if (error.response) {
        console.error('   Response:', error.response.data);
      }
    }

    console.log('\n✨ LinkedIn integration is ready!');
    console.log('\n📋 Configuration Summary:');
    console.log('   - Company: Apex Image Gas');
    console.log('   - Company ID: 103002431');
    console.log('   - Webhook: ✅ Configured');
    console.log('   - Auto-posting: ✅ Enabled');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error saving webhook:', error);
    process.exit(1);
  }
}

// Run the setup
saveLinkedInWebhook();