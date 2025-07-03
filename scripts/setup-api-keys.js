#!/usr/bin/env node

/**
 * Setup API keys for Apex Gas blog automation
 * This script stores the necessary API keys in Firebase Firestore
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function setupApiKeys() {
  try {
    console.log('🔧 Setting up API keys for Apex Gas blog automation...\n');

    // API Keys from GovTools Pro that we can reuse
    const apiKeys = {
      // Gemini API for AI content generation
      REACT_APP_GEMINI_API_KEY: 'AIzaSyB9xTJtKx4ftwGufAhkLlOrS79zmqam_ZY',
      
      // Pexels API for stock images
      PEXELS_API_KEY: 'O6lmD7F3GGia8RGkJrmpiaGnOCzwuW2LTE81btOXgWGfAL3EmFYZKyJl',
      
      // Existing Resend email key
      EMAIL_APIKEY: 're_cKR4rdJv_CWrR73qa1d6WFrWzZRHbbC86',
      EMAIL_FROM: 'smythmyke@gmail.com',
      EMAIL_NOTIFICATION: 'smythmyke@gmail.com',
      
      // Placeholder for social media webhooks (to be added later)
      linkedinWebhookUrl: '',
      facebookWebhookUrl: '',
      
      // Timestamps
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    await db.collection('apiKeys').doc('Keys').set(apiKeys, { merge: true });
    console.log('✅ API keys saved to Firestore successfully!');

    // Verify the save
    const savedDoc = await db.collection('apiKeys').doc('Keys').get();
    if (savedDoc.exists) {
      const data = savedDoc.data();
      console.log('\n📋 Saved configuration:');
      console.log('   - Gemini API: ' + (data.REACT_APP_GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'));
      console.log('   - Pexels API: ' + (data.PEXELS_API_KEY ? '✅ Configured' : '❌ Missing'));
      console.log('   - Email API: ' + (data.EMAIL_APIKEY ? '✅ Configured' : '❌ Missing'));
      console.log('   - LinkedIn Webhook: ' + (data.linkedinWebhookUrl ? '✅ Configured' : '⏳ Pending'));
      console.log('   - Facebook Webhook: ' + (data.facebookWebhookUrl ? '✅ Configured' : '⏳ Pending'));
    }

    console.log('\n✨ API keys setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. We\'ll set up your LinkedIn integration');
    console.log('   2. Create Zapier webhooks for social media posting');
    console.log('   3. Test the blog generation system');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up API keys:', error);
    process.exit(1);
  }
}

// Run the setup
setupApiKeys();