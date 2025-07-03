#!/usr/bin/env node

/**
 * Test Facebook Zapier Webhook
 * This script sends test data to verify the Facebook webhook is working
 */

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testFacebookWebhook() {
  console.log('🧪 Facebook Webhook Test Tool\n');
  
  // Get webhook URL from user
  const webhookUrl = await new Promise(resolve => {
    rl.question('Enter your Facebook Zapier webhook URL: ', resolve);
  });

  if (!webhookUrl || !webhookUrl.includes('hooks.zapier.com')) {
    console.error('❌ Invalid webhook URL');
    rl.close();
    process.exit(1);
  }

  console.log('\n📝 Sending test posts to Facebook webhook...\n');

  // Test 1: Simple text post
  console.log('Test 1: Simple text post');
  const test1 = {
    message: "🎉 Testing Apex Image Gas Facebook integration! Our automated content system is being configured to share valuable insights about medical imaging and X-ray technology.",
  };

  try {
    console.log('Sending:', JSON.stringify(test1, null, 2));
    const response1 = await axios.post(webhookUrl, test1);
    console.log('✅ Response:', response1.status, response1.data);
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Post with link
  console.log('Test 2: Post with link');
  const test2 = {
    message: "Discover why precision gas mixtures are essential for optimal X-ray imaging. Our 1L gas bottles are specifically designed for EOS 3.5 X-ray machines.",
    link_url: "https://apeximagegas.net",
    link_name: "Apex Image Gas - Medical Imaging Solutions",
    link_caption: "apeximagegas.net",
    link_description: "Premium gas solutions for X-ray detector systems"
  };

  try {
    console.log('Sending:', JSON.stringify(test2, null, 2));
    const response2 = await axios.post(webhookUrl, test2);
    console.log('✅ Response:', response2.status, response2.data);
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Blog post simulation with image
  console.log('Test 3: Simulated blog post with image');
  const test3 = {
    message: "📚 New Article: Understanding X-Ray Detector Gas Requirements\n\nLearn about:\n✓ Gas purity standards for medical imaging\n✓ Proper storage and handling procedures\n✓ Maintenance schedules for optimal performance\n✓ Safety protocols for healthcare facilities\n\nRead more on our blog!",
    link_url: "https://apeximagegas.net/blog/detector-gas-requirements",
    link_name: "X-Ray Detector Gas Requirements Guide",
    link_caption: "Apex Image Gas Blog",
    link_description: "Everything you need to know about gas requirements for medical X-ray detectors",
    image_url: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=1200"
  };

  try {
    console.log('Sending:', JSON.stringify(test3, null, 2));
    const response3 = await axios.post(webhookUrl, test3);
    console.log('✅ Response:', response3.status, response3.data);
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }

  console.log('\n✨ Testing complete!');
  console.log('\n📱 Next steps:');
  console.log('1. Check your Zapier dashboard for the webhooks');
  console.log('2. Verify the Zap ran successfully');
  console.log('3. Check your Facebook page for the test posts');
  console.log('   https://www.facebook.com/profile.php?id=61578037917573');
  console.log('\nIf posts don\'t appear, check:');
  console.log('- Zapier task history for errors');
  console.log('- Facebook page permissions');
  console.log('- Field mappings in your Zap');

  rl.close();
}

// Run the test
testFacebookWebhook();