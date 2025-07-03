#!/usr/bin/env node

/**
 * Test Facebook Webhook Directly
 * Using the provided webhook URL
 */

const axios = require('axios');

const webhookUrl = 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/';

async function testFacebook() {
  console.log('🧪 Testing Facebook Webhook...\n');
  console.log('Webhook URL:', webhookUrl);
  console.log('-----------------------------------\n');

  // Test 1: Simple text post
  console.log('📝 Test 1: Simple welcome post');
  const test1 = {
    message: "🎉 Welcome to Apex Image Gas on Facebook! We're excited to share insights about medical X-ray technology and gas detector safety with our community.",
  };

  try {
    const response1 = await axios.post(webhookUrl, test1);
    console.log('✅ Response Status:', response1.status);
    console.log('✅ Zapier Response:', JSON.stringify(response1.data, null, 2));
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  // Wait 3 seconds between posts
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test 2: Post with link to website
  console.log('📝 Test 2: Post with website link');
  const test2 = {
    message: "Did you know? The quality of gas used in X-ray detectors directly impacts image clarity and diagnostic accuracy. Learn more about our precision gas mixtures for EOS 3.5 X-ray machines.",
    link_url: "https://apeximagegas.net",
    link_name: "Apex Image Gas - Premium X-Ray Detector Gas",
    link_caption: "apeximagegas.net",
    link_description: "Specialized 1L gas bottles for medical imaging equipment"
  };

  try {
    const response2 = await axios.post(webhookUrl, test2);
    console.log('✅ Response Status:', response2.status);
    console.log('✅ Zapier Response:', JSON.stringify(response2.data, null, 2));
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test 3: Simulated blog post
  console.log('📝 Test 3: Simulated blog post announcement');
  const test3 = {
    message: "📚 New Blog Post: Essential Safety Guidelines for X-Ray Gas Handling\n\nIn our latest article, we cover:\n• Proper storage temperatures and conditions\n• Safe handling procedures\n• Leak detection methods\n• Emergency response protocols\n• Regulatory compliance requirements\n\nYour safety is our priority. Read the full guide to ensure your facility follows best practices.",
    link_url: "https://apeximagegas.net/blog/gas-safety-guidelines",
    link_name: "X-Ray Gas Safety Guidelines - Complete Guide",
    link_caption: "Apex Image Gas Blog",
    link_description: "Comprehensive safety protocols for medical facilities using X-ray detector gases",
    image_url: "https://images.pexels.com/photos/8442476/pexels-photo-8442476.jpeg?auto=compress&cs=tinysrgb&w=1200"
  };

  try {
    const response3 = await axios.post(webhookUrl, test3);
    console.log('✅ Response Status:', response3.status);
    console.log('✅ Zapier Response:', JSON.stringify(response3.data, null, 2));
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }

  console.log('\n✨ All tests completed!');
  console.log('\n📱 Check your Facebook page in 1-2 minutes:');
  console.log('https://www.facebook.com/profile.php?id=61578037917573');
  console.log('\n💡 Also check:');
  console.log('- Zapier dashboard: https://zapier.com/app/history');
  console.log('- Look for "Apex Gas Blog to Facebook" tasks');
  console.log('- Check if they show "Success" or any error messages');
}

// Run the test
testFacebook();