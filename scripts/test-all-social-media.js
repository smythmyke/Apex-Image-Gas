#!/usr/bin/env node

/**
 * Test all social media platforms
 * Posts to both LinkedIn and Facebook simultaneously
 */

const axios = require('axios');

const webhooks = {
  linkedin: 'https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/',
  facebook: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/'
};

async function postToSocialMedia(platform, data) {
  try {
    const response = await axios.post(webhooks[platform], data);
    console.log(`✅ ${platform}: ${response.status} - ${response.data.status}`);
    return true;
  } catch (error) {
    console.error(`❌ ${platform} failed:`, error.message);
    return false;
  }
}

async function testAllPlatforms() {
  console.log('🚀 Testing All Social Media Platforms\n');
  console.log('Webhooks configured:');
  console.log('LinkedIn:', webhooks.linkedin);
  console.log('Facebook:', webhooks.facebook);
  console.log('-----------------------------------\n');

  // Test 1: Simple announcement
  console.log('📝 Test 1: Simple announcement to both platforms\n');
  
  const linkedinPost1 = {
    commentary: "Apex Image Gas is proud to serve the medical imaging community with precision gas solutions for X-ray detectors. Our commitment to quality ensures optimal imaging performance for healthcare providers. #MedicalImaging #XrayTechnology #HealthcareTechnology",
    visibility: "PUBLIC"
  };

  const facebookPost1 = {
    message: "🏥 Did you know that the quality of gas in X-ray detectors directly impacts image clarity? At Apex Image Gas, we provide precision-mixed gases specifically designed for medical imaging equipment. Learn more about our solutions for EOS 3.5 X-ray machines!"
  };

  await Promise.all([
    postToSocialMedia('linkedin', linkedinPost1),
    postToSocialMedia('facebook', facebookPost1)
  ]);

  console.log('\n-----------------------------------\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test 2: Blog post announcement
  console.log('📝 Test 2: Blog post announcement (adapted for each platform)\n');

  const blogTitle = "5 Essential Safety Tips for X-Ray Gas Handling";
  const blogUrl = "https://apeximagegas.net/blog/safety-tips";
  
  const linkedinPost2 = {
    commentary: `New article: "${blogTitle}"\n\nMedical facilities must prioritize safety when handling X-ray detector gases. Our latest blog post covers essential protocols, regulatory compliance, and best practices for healthcare professionals.\n\n#RadiationSafety #MedicalGas #HealthcareCompliance #PatientSafety`,
    visibility: "PUBLIC",
    link_url: blogUrl,
    link_title: blogTitle,
    link_description: "Comprehensive safety guide for medical imaging professionals"
  };

  const facebookPost2 = {
    message: `⚠️ Safety First! New Blog Post Alert ⚠️\n\n"${blogTitle}"\n\nProtect your staff and patients with these essential safety protocols for X-ray gas handling. From storage to disposal, we've got you covered!\n\n✓ Storage requirements\n✓ Handling procedures\n✓ Emergency protocols\n✓ Compliance guidelines\n✓ Staff training tips`,
    link_url: blogUrl,
    link_name: blogTitle,
    link_caption: "Apex Image Gas Blog",
    link_description: "Your guide to safe X-ray gas handling"
  };

  await Promise.all([
    postToSocialMedia('linkedin', linkedinPost2),
    postToSocialMedia('facebook', facebookPost2)
  ]);

  console.log('\n✨ All tests completed!');
  console.log('\n📱 Check your pages:');
  console.log('LinkedIn: https://www.linkedin.com/company/apex-image-gas');
  console.log('Facebook: https://www.facebook.com/profile.php?id=61578037917573');
  console.log('\n💡 Platform-specific adaptations:');
  console.log('- LinkedIn: Professional tone, industry hashtags, longer content');
  console.log('- Facebook: Conversational tone, emojis, engaging questions');
}

// Run the tests
testAllPlatforms();