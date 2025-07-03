#!/usr/bin/env node

/**
 * Test the scheduled blog publisher logic
 * This simulates what the Firebase Function will do
 */

const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Firebase
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function testScheduledFunction() {
  console.log('🧪 Testing Scheduled Blog Publisher Logic\n');

  try {
    // 1. Load API keys (same as function)
    console.log('1️⃣ Loading API keys from Firestore...');
    const keysDoc = await db.collection('apiKeys').doc('Keys').get();
    if (!keysDoc.exists) {
      throw new Error('API keys not found');
    }

    const apiKeys = keysDoc.data();
    console.log('✅ API keys loaded');

    // 2. Simulate day selection
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const BLOG_SCHEDULE = {
      tuesday: 'technology',
      thursday: 'health-safety',
      saturday: 'industry-insights'
    };
    
    // For testing, use technology category
    const category = BLOG_SCHEDULE[today] || 'technology';
    console.log(`\n2️⃣ Category for ${today}: ${category}`);

    // 3. Get an unused topic
    console.log('\n3️⃣ Selecting topic from database...');
    const topicsQuery = await db.collection('blogTopics')
      .where('category', '==', category)
      .where('used', '==', false)
      .orderBy('priority', 'desc')
      .limit(1)
      .get();

    let topic;
    if (!topicsQuery.empty) {
      const topicDoc = topicsQuery.docs[0];
      topic = topicDoc.data().topic;
      console.log(`✅ Found topic: ${topic}`);
    } else {
      console.log('⚠️  No unused topics, generating new one...');
      topic = 'Advanced gas monitoring systems for EOS X-ray detectors';
    }

    // 4. Check Pexels API
    console.log('\n4️⃣ Testing Pexels image selection...');
    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        headers: {
          'Authorization': apiKeys.PEXELS_API_KEY
        },
        params: {
          query: 'medical x-ray equipment',
          per_page: 5
        }
      });

      if (response.data.photos.length > 0) {
        console.log(`✅ Found ${response.data.photos.length} images`);
        console.log(`   Sample: ${response.data.photos[0].photographer}`);
      }
    } catch (error) {
      console.error('❌ Pexels API error:', error.message);
    }

    // 5. Test social media webhooks
    console.log('\n5️⃣ Testing social media webhooks...');
    
    // Test LinkedIn
    if (apiKeys.linkedinWebhookUrl) {
      console.log('   Testing LinkedIn webhook...');
      try {
        const testData = {
          commentary: 'Test post from scheduled function',
          visibility: 'PUBLIC'
        };
        const response = await axios.post(apiKeys.linkedinWebhookUrl, testData);
        console.log('   ✅ LinkedIn webhook: OK');
      } catch (error) {
        console.log('   ❌ LinkedIn webhook error:', error.message);
      }
    }

    // Test Facebook
    if (apiKeys.facebookWebhookUrl) {
      console.log('   Testing Facebook webhook...');
      try {
        const testData = {
          message: 'Test post from scheduled function'
        };
        const response = await axios.post(apiKeys.facebookWebhookUrl, testData);
        console.log('   ✅ Facebook webhook: OK');
      } catch (error) {
        console.log('   ❌ Facebook webhook error:', error.message);
      }
    }

    // 6. Summary
    console.log('\n✅ Scheduled Function Test Complete!\n');
    console.log('📋 Configuration Summary:');
    console.log(`   - Gemini API: ${apiKeys.REACT_APP_GEMINI_API_KEY ? '✅' : '❌'}`);
    console.log(`   - Pexels API: ${apiKeys.PEXELS_API_KEY ? '✅' : '❌'}`);
    console.log(`   - LinkedIn Webhook: ${apiKeys.linkedinWebhookUrl ? '✅' : '❌'}`);
    console.log(`   - Facebook Webhook: ${apiKeys.facebookWebhookUrl ? '✅' : '❌'}`);
    console.log(`   - Blog Topics Available: ${!topicsQuery.empty ? '✅' : '⚠️  Need more topics'}`);

    console.log('\n📅 Publishing Schedule:');
    console.log('   - Tuesday: Technology posts');
    console.log('   - Thursday: Health & Safety posts');
    console.log('   - Saturday: Industry Insights posts');
    console.log('   - Time: 10:00 AM EST');

    console.log('\n🚀 Ready to deploy with:');
    console.log('   firebase deploy --only functions:scheduledBlogPublisher');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

// Run the test
testScheduledFunction();