#!/usr/bin/env node

/**
 * Test LinkedIn Zapier Webhook
 * This script sends test data to verify the webhook is working
 */

const axios = require('axios');

const webhookUrl = 'https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/';

async function testLinkedInWebhook() {
  console.log('🧪 Testing LinkedIn Zapier Webhook...\n');
  console.log('Webhook URL:', webhookUrl);
  console.log('-----------------------------------\n');

  // Test 1: Simple text post
  console.log('📝 Test 1: Simple text post');
  const test1 = {
    commentary: "Testing Apex Image Gas automated posting system. This is a test post to verify our LinkedIn integration is working correctly. 🧪 #Test",
    visibility: "PUBLIC"
  };

  try {
    console.log('Sending:', JSON.stringify(test1, null, 2));
    const response1 = await axios.post(webhookUrl, test1);
    console.log('✅ Response Status:', response1.status);
    console.log('✅ Zapier Response:', JSON.stringify(response1.data, null, 2));
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  // Wait 2 seconds between tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Post with link
  console.log('📝 Test 2: Post with link');
  const test2 = {
    commentary: "Learn about the importance of precision gas mixtures in medical X-ray imaging. Our specialized 1L gas bottles are designed specifically for EOS 3.5 X-ray machines. #MedicalImaging #XrayTechnology",
    visibility: "PUBLIC",
    link_url: "https://apeximagegas.net",
    link_title: "Apex Image Gas - Premium X-Ray Detector Gas",
    link_description: "Specialized gas solutions for medical imaging equipment"
  };

  try {
    console.log('Sending:', JSON.stringify(test2, null, 2));
    const response2 = await axios.post(webhookUrl, test2);
    console.log('✅ Response Status:', response2.status);
    console.log('✅ Zapier Response:', JSON.stringify(response2.data, null, 2));
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Blog post simulation
  console.log('📝 Test 3: Simulated blog post');
  const test3 = {
    commentary: "📚 New Blog Post: Understanding X-Ray Detector Gas Requirements\n\nDiscover why the right gas mixture is crucial for optimal X-ray imaging performance. Our latest article covers gas purity standards, storage best practices, and maintenance tips.\n\n#RadiationSafety #MedicalGas #HealthcareTechnology #EOSImaging",
    visibility: "PUBLIC",
    link_url: "https://apeximagegas.net/blog/understanding-xray-detector-gas",
    link_title: "Understanding X-Ray Detector Gas Requirements",
    link_description: "A comprehensive guide to gas mixtures for medical imaging equipment",
    image_url: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg"
  };

  try {
    console.log('Sending:', JSON.stringify(test3, null, 2));
    const response3 = await axios.post(webhookUrl, test3);
    console.log('✅ Response Status:', response3.status);
    console.log('✅ Zapier Response:', JSON.stringify(response3.data, null, 2));
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }

  console.log('\n✨ Testing complete!');
  console.log('\n📱 Next steps:');
  console.log('1. Check your Zapier dashboard for received webhooks');
  console.log('2. Verify the data was properly mapped to LinkedIn fields');
  console.log('3. Check your LinkedIn company page for the test posts');
  console.log('4. If posts don\'t appear, check Zapier\'s task history for errors');
  console.log('\nLinkedIn page: https://www.linkedin.com/company/apex-image-gas');
}

// Run the test
testLinkedInWebhook();