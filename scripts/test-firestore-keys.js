#!/usr/bin/env node

/**
 * Test that all API keys are properly stored in Firestore
 * This ensures we're not relying on any .env files
 */

const { loadApiKeys, loadSocialMediaConfig } = require('./lib/firebase-config');

async function testFirestoreKeys() {
  console.log('🔐 Testing API Keys from Firestore\n');
  
  try {
    // 1. Load all API keys
    console.log('1️⃣ Loading API keys...');
    const apiKeys = await loadApiKeys();
    
    // Check required keys
    const requiredKeys = [
      'REACT_APP_GEMINI_API_KEY',
      'PEXELS_API_KEY',
      'EMAIL_APIKEY',
      'EMAIL_FROM',
      'EMAIL_NOTIFICATION',
      'linkedinWebhookUrl',
      'facebookWebhookUrl'
    ];
    
    console.log('\n📋 API Keys Status:');
    for (const key of requiredKeys) {
      const status = apiKeys[key] ? '✅' : '❌';
      const value = apiKeys[key] ? 
        (key.includes('Webhook') ? apiKeys[key] : '***' + apiKeys[key].slice(-4)) : 
        'NOT FOUND';
      console.log(`   ${status} ${key}: ${value}`);
    }
    
    // 2. Load social media config
    console.log('\n2️⃣ Loading social media configurations...');
    const socialConfig = await loadSocialMediaConfig();
    
    console.log('\n📱 Social Media Config:');
    if (socialConfig.linkedin) {
      console.log('   ✅ LinkedIn:');
      console.log(`      - Company: ${socialConfig.linkedin.companyName}`);
      console.log(`      - Webhook: ${socialConfig.linkedin.webhookUrl}`);
      console.log(`      - Enabled: ${socialConfig.linkedin.enabled}`);
    }
    
    if (socialConfig.facebook) {
      console.log('   ✅ Facebook:');
      console.log(`      - Page: ${socialConfig.facebook.pageName}`);
      console.log(`      - Webhook: ${socialConfig.facebook.webhookUrl}`);
      console.log(`      - Enabled: ${socialConfig.facebook.enabled}`);
    }
    
    // 3. Test that we're NOT using .env files
    console.log('\n3️⃣ Checking for .env dependencies...');
    const envVars = [
      'REACT_APP_GEMINI_API_KEY',
      'PEXELS_API_KEY',
      'EMAIL_APIKEY'
    ];
    
    let usingEnv = false;
    for (const envVar of envVars) {
      if (process.env[envVar]) {
        console.log(`   ⚠️  Found ${envVar} in process.env - should use Firestore instead`);
        usingEnv = true;
      }
    }
    
    if (!usingEnv) {
      console.log('   ✅ No .env dependencies found - all keys from Firestore');
    }
    
    console.log('\n✨ API key test complete!');
    console.log('\n💡 All blog generation scripts will use these Firestore keys');
    console.log('   No .env files needed for production!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

testFirestoreKeys();