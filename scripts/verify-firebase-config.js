#!/usr/bin/env node

/**
 * Verify Firebase configuration
 * Check that all necessary data is stored correctly
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function verifyConfiguration() {
  console.log('🔍 Verifying Firebase Configuration\n');

  try {
    // 1. Check API Keys
    console.log('1️⃣ Checking API Keys...');
    const apiKeys = await db.collection('apiKeys').doc('Keys').get();
    if (apiKeys.exists) {
      const data = apiKeys.data();
      console.log('✅ API Keys found:');
      console.log('   - Gemini API: ' + (data.REACT_APP_GEMINI_API_KEY ? '✅' : '❌'));
      console.log('   - Pexels API: ' + (data.PEXELS_API_KEY ? '✅' : '❌'));
      console.log('   - LinkedIn Webhook: ' + (data.linkedinWebhookUrl ? '✅' : '❌'));
      console.log('   - Facebook Webhook: ' + (data.facebookWebhookUrl ? '✅' : '❌'));
      console.log('   - Email API: ' + (data.EMAIL_APIKEY ? '✅' : '❌'));
    } else {
      console.log('❌ API Keys document not found');
    }

    // 2. Check LinkedIn Config
    console.log('\n2️⃣ Checking LinkedIn Configuration...');
    const linkedin = await db.collection('config').doc('linkedin').get();
    if (linkedin.exists) {
      const data = linkedin.data();
      console.log('✅ LinkedIn configured:');
      console.log('   - Company: ' + data.companyName);
      console.log('   - Webhook: ' + data.webhookUrl);
      console.log('   - Enabled: ' + data.enabled);
    } else {
      console.log('❌ LinkedIn configuration not found');
    }

    // 3. Check Facebook Config
    console.log('\n3️⃣ Checking Facebook Configuration...');
    const facebook = await db.collection('config').doc('facebook').get();
    if (facebook.exists) {
      const data = facebook.data();
      console.log('✅ Facebook configured:');
      console.log('   - Page: ' + data.pageName);
      console.log('   - Webhook: ' + data.webhookUrl);
      console.log('   - Enabled: ' + data.enabled);
    } else {
      console.log('❌ Facebook configuration not found');
    }

    // 4. Check Collections
    console.log('\n4️⃣ Checking Collections...');
    const collections = await db.listCollections();
    const collectionNames = collections.map(col => col.id);
    console.log('📁 Collections found:', collectionNames.join(', '));

    console.log('\n✨ Configuration verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

verifyConfiguration();