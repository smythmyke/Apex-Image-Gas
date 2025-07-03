#!/usr/bin/env node

/**
 * Setup LinkedIn configuration for Apex Image Gas
 * This script stores LinkedIn page information in Firebase Firestore
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

async function setupLinkedInConfig() {
  try {
    console.log('🔧 Setting up LinkedIn configuration for Apex Image Gas...\n');

    // LinkedIn Company Page Information
    const linkedInConfig = {
      // Company Information
      companyName: 'Apex Image Gas',
      companyId: '103002431',
      companyUrl: 'https://www.linkedin.com/company/apex-image-gas',
      publicUrl: 'https://linkedin.com/company/apex-image-gas',
      tagline: 'A gas distribution company, specializing in x-ray detector gas used on x-ray machines such as the EOS x-ray machine.',
      
      // API Configuration (to be filled when LinkedIn app is created)
      linkedinClientId: '', // To be added when you create LinkedIn app
      linkedinClientSecret: '', // To be added when you create LinkedIn app
      
      // Zapier Webhook (to be added after Zapier setup)
      linkedinWebhookUrl: '', // To be added after Zapier setup
      
      // Posting Configuration
      postingEnabled: false, // Will enable after full setup
      defaultHashtags: [
        '#MedicalImaging',
        '#XrayTechnology', 
        '#RadiationSafety',
        '#MedicalGas',
        '#EOSImaging',
        '#HealthcareTechnology',
        '#XrayDetectors'
      ],
      
      // Timestamps
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save LinkedIn config to Firestore
    await db.collection('config').doc('linkedin').set(linkedInConfig);
    console.log('✅ LinkedIn configuration saved successfully!');

    // Also update the apiKeys document with any LinkedIn-specific keys
    await db.collection('apiKeys').doc('Keys').update({
      linkedinCompanyId: '103002431',
      linkedinConfigured: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Verify the save
    const savedConfig = await db.collection('config').doc('linkedin').get();
    if (savedConfig.exists) {
      const data = savedConfig.data();
      console.log('\n📋 LinkedIn Configuration Saved:');
      console.log('   - Company Name: ' + data.companyName);
      console.log('   - Company ID: ' + data.companyId);
      console.log('   - Public URL: ' + data.publicUrl);
      console.log('   - Default Hashtags: ' + data.defaultHashtags.join(', '));
    }

    console.log('\n📝 Next Steps:');
    console.log('\n1. **Set up Zapier Integration:**');
    console.log('   - Sign up for Zapier Professional plan ($49/month)');
    console.log('   - Create a new Zap with:');
    console.log('     • Trigger: Webhooks by Zapier (Catch Hook)');
    console.log('     • Action: LinkedIn Pages (Create Company Update)');
    console.log('   - Connect your LinkedIn company page');
    console.log('   - Copy the webhook URL');
    console.log('\n2. **Optional: Create LinkedIn Developer App:**');
    console.log('   - Go to https://www.linkedin.com/developers/');
    console.log('   - Create app for "Apex Image Gas"');
    console.log('   - Get Client ID and Client Secret');
    console.log('\n3. **Run update script with your credentials:**');
    console.log('   node scripts/update-linkedin-credentials.js');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up LinkedIn config:', error);
    process.exit(1);
  }
}

// Run the setup
setupLinkedInConfig();