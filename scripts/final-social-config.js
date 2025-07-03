#!/usr/bin/env node

/**
 * Final social media configuration with correct webhooks
 * LinkedIn and Facebook webhooks for Apex Image Gas
 */

const axios = require('axios');

// Final webhook configuration
const socialMediaConfig = {
  linkedin: {
    webhook: 'https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/',
    company: 'Apex Image Gas',
    companyId: '103002431',
    url: 'https://www.linkedin.com/company/apex-image-gas'
  },
  facebook: {
    webhook: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/',
    pageName: 'Apex Image Gas',
    pageId: '61578037917573',
    url: 'https://www.facebook.com/profile.php?id=61578037917573'
  }
};

async function testBothPlatforms() {
  console.log('🚀 Final Social Media Configuration Test\n');
  console.log('📋 Configuration:');
  console.log('LinkedIn Webhook:', socialMediaConfig.linkedin.webhook);
  console.log('Facebook Webhook:', socialMediaConfig.facebook.webhook);
  console.log('-----------------------------------\n');

  // Test post content
  const testContent = {
    title: "The Importance of Gas Quality in Medical Imaging",
    message: "High-quality gas mixtures are essential for optimal X-ray detector performance.",
    url: "https://apeximagegas.net",
    hashtags: {
      linkedin: ["#MedicalImaging", "#XrayTechnology", "#HealthcareTechnology"],
      facebook: ["#MedicalImaging", "#Healthcare"]
    }
  };

  // LinkedIn post
  console.log('📝 Posting to LinkedIn...');
  const linkedinData = {
    commentary: `${testContent.title}\n\n${testContent.message}\n\nLearn more about our precision gas solutions for EOS X-ray systems.\n\n${testContent.hashtags.linkedin.join(' ')}`,
    visibility: "PUBLIC",
    link_url: testContent.url,
    link_title: "Apex Image Gas - Premium X-Ray Detector Gas",
    link_description: "Specialized gas solutions for medical imaging"
  };

  try {
    const linkedinResponse = await axios.post(socialMediaConfig.linkedin.webhook, linkedinData);
    console.log('✅ LinkedIn:', linkedinResponse.status, '-', linkedinResponse.data.status);
  } catch (error) {
    console.error('❌ LinkedIn failed:', error.message);
  }

  // Facebook post
  console.log('\n📝 Posting to Facebook...');
  const facebookData = {
    message: `💡 ${testContent.title}\n\n${testContent.message}\n\nVisit our website to learn more about our 1L gas bottles for EOS 3.5 X-ray machines!`,
    link_url: testContent.url,
    link_name: testContent.title,
    link_caption: "Apex Image Gas",
    link_description: "Premium gas solutions for X-ray imaging"
  };

  try {
    const facebookResponse = await axios.post(socialMediaConfig.facebook.webhook, facebookData);
    console.log('✅ Facebook:', facebookResponse.status, '-', facebookResponse.data.status);
  } catch (error) {
    console.error('❌ Facebook failed:', error.message);
  }

  console.log('\n✨ Configuration test complete!');
  console.log('\n📱 Check your pages:');
  console.log('LinkedIn:', socialMediaConfig.linkedin.url);
  console.log('Facebook:', socialMediaConfig.facebook.url);
  
  console.log('\n💾 Save this configuration to Firebase:');
  console.log(JSON.stringify({
    linkedinWebhookUrl: socialMediaConfig.linkedin.webhook,
    facebookWebhookUrl: socialMediaConfig.facebook.webhook,
    socialMediaEnabled: true
  }, null, 2));
}

// Show configuration and test
console.log('\n========================================');
console.log('   APEX IMAGE GAS SOCIAL MEDIA CONFIG');
console.log('========================================\n');
console.log('✅ LinkedIn Webhook:', socialMediaConfig.linkedin.webhook);
console.log('✅ Facebook Webhook:', socialMediaConfig.facebook.webhook);
console.log('\nTesting both platforms...\n');

testBothPlatforms();