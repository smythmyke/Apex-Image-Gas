#!/usr/bin/env node

/**
 * Update LinkedIn webhook URL and test
 * New webhook for Apex Image Gas LinkedIn
 */

const axios = require('axios');

const newLinkedInWebhook = 'https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/';

async function testNewLinkedInWebhook() {
  console.log('🔧 Testing new LinkedIn webhook for Apex Image Gas\n');
  console.log('New webhook URL:', newLinkedInWebhook);
  console.log('-----------------------------------\n');

  // Test 1: Welcome post
  console.log('📝 Test 1: Welcome announcement');
  const test1 = {
    commentary: "Welcome to Apex Image Gas on LinkedIn! We're dedicated to providing premium gas solutions for medical X-ray imaging systems. Follow us for industry insights, technical expertise, and updates on X-ray detector gas technology. #MedicalImaging #XrayTechnology #HealthcareTechnology",
    visibility: "PUBLIC"
  };

  try {
    const response1 = await axios.post(newLinkedInWebhook, test1);
    console.log('✅ Response Status:', response1.status);
    console.log('✅ Zapier Response:', JSON.stringify(response1.data, null, 2));
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test 2: Technical post with link
  console.log('📝 Test 2: Technical content with website link');
  const test2 = {
    commentary: "Understanding gas purity standards in medical imaging: The quality of detector gas directly impacts X-ray image clarity and diagnostic accuracy. Our precision-mixed gases for EOS 3.5 systems meet the highest industry standards. Learn more about our specialized 1L gas bottles. #MedicalGas #RadiationSafety #HealthcareQuality",
    visibility: "PUBLIC",
    link_url: "https://apeximagegas.net",
    link_title: "Apex Image Gas - Precision Gas for Medical Imaging",
    link_description: "Specialized gas solutions for X-ray detector systems"
  };

  try {
    const response2 = await axios.post(newLinkedInWebhook, test2);
    console.log('✅ Response Status:', response2.status);
    console.log('✅ Zapier Response:', JSON.stringify(response2.data, null, 2));
    console.log('-----------------------------------\n');
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test 3: Blog post simulation
  console.log('📝 Test 3: Blog article announcement');
  const test3 = {
    commentary: "📊 New Technical Brief: Optimizing EOS X-Ray System Performance with Proper Gas Management\n\nKey topics covered:\n• Gas composition requirements for EOS 3.5 systems\n• Pressure monitoring and maintenance schedules\n• Impact of gas quality on image resolution\n• Cost optimization through proper gas management\n• Compliance with medical imaging standards\n\nEssential reading for radiology departments and imaging center managers.\n\n#EOSImaging #MedicalImaging #XrayTechnology #HealthcareOperations #RadiologyManagement",
    visibility: "PUBLIC",
    link_url: "https://apeximagegas.net/blog/eos-gas-optimization",
    link_title: "Optimizing EOS X-Ray Performance Through Gas Management",
    link_description: "Technical guide for healthcare facilities using EOS imaging systems"
  };

  try {
    const response3 = await axios.post(newLinkedInWebhook, test3);
    console.log('✅ Response Status:', response3.status);
    console.log('✅ Zapier Response:', JSON.stringify(response3.data, null, 2));
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }

  console.log('\n✨ LinkedIn webhook testing complete!');
  console.log('\n📱 Check your LinkedIn company page:');
  console.log('https://www.linkedin.com/company/apex-image-gas');
  console.log('\n📋 Updated webhook configuration:');
  console.log('LinkedIn: ' + newLinkedInWebhook);
  console.log('Facebook: https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/');
  console.log('\n💡 Note: Update your Firebase configuration with the new LinkedIn webhook URL');
}

// Run the test
testNewLinkedInWebhook();