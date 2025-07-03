#!/usr/bin/env node

/**
 * Complete Blog Automation Setup for Apex Image Gas
 * This script configures all necessary API keys and webhooks
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function completeBlogSetup() {
  try {
    console.log('🚀 Setting up complete blog automation for Apex Image Gas...\n');

    // 1. API Keys Configuration
    console.log('1️⃣ Configuring API Keys...');
    const apiKeys = {
      // AI and Image APIs (from GovTools Pro)
      REACT_APP_GEMINI_API_KEY: 'AIzaSyB9xTJtKx4ftwGufAhkLlOrS79zmqam_ZY',
      PEXELS_API_KEY: 'O6lmD7F3GGia8RGkJrmpiaGnOCzwuW2LTE81btOXgWGfAL3EmFYZKyJl',
      
      // Email Configuration (existing)
      EMAIL_APIKEY: 're_cKR4rdJv_CWrR73qa1d6WFrWzZRHbbC86',
      EMAIL_FROM: 'smythmyke@gmail.com',
      EMAIL_NOTIFICATION: 'smythmyke@gmail.com',
      
      // Social Media Webhooks
      linkedinWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/',
      facebookWebhookUrl: '', // To be added when Facebook is set up
      
      // LinkedIn Info
      linkedinCompanyId: '103002431',
      linkedinConfigured: true,
      
      // Timestamps
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('apiKeys').doc('Keys').set(apiKeys, { merge: true });
    console.log('✅ API keys configured');

    // 2. LinkedIn Configuration
    console.log('\n2️⃣ Configuring LinkedIn...');
    const linkedInConfig = {
      companyName: 'Apex Image Gas',
      companyId: '103002431',
      companyUrl: 'https://www.linkedin.com/company/apex-image-gas',
      publicUrl: 'https://linkedin.com/company/apex-image-gas',
      tagline: 'A gas distribution company, specializing in x-ray detector gas used on x-ray machines such as the EOS x-ray machine.',
      linkedinWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/',
      postingEnabled: true,
      defaultHashtags: [
        '#MedicalImaging',
        '#XrayTechnology', 
        '#RadiationSafety',
        '#MedicalGas',
        '#EOSImaging',
        '#HealthcareTechnology',
        '#XrayDetectors'
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('config').doc('linkedin').set(linkedInConfig);
    console.log('✅ LinkedIn configured');

    // 3. Blog Configuration
    console.log('\n3️⃣ Setting up blog configuration...');
    const blogConfig = {
      categories: [
        'technology',
        'health-safety',
        'industry-insights',
        'product-guides'
      ],
      publishingSchedule: {
        tuesday: { time: '10:00 AM EST', category: 'technology' },
        thursday: { time: '10:00 AM EST', category: 'health-safety' },
        saturday: { time: '9:00 AM EST', category: 'industry-insights' }
      },
      contentGuidelines: {
        minWords: 1200,
        targetWords: 1500,
        maxWords: 1800,
        tone: 'professional yet accessible',
        audience: 'Medical professionals and facility managers'
      },
      topics: [
        'X-ray technology advancements',
        'Medical imaging best practices',
        'EOS Alphatec system guides',
        'Gas detector maintenance and safety',
        'Radiation safety and health considerations',
        'Industry regulations and compliance',
        'Case studies and success stories'
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('config').doc('blog').set(blogConfig);
    console.log('✅ Blog configuration saved');

    // 4. Create necessary collections
    console.log('\n4️⃣ Creating blog collections...');
    
    // Initialize collections with sample documents
    const collections = [
      { name: 'blogPosts', doc: 'init', data: { initialized: true } },
      { name: 'usedPexelsImages', doc: 'init', data: { initialized: true } },
      { name: 'socialMediaLogs', doc: 'init', data: { initialized: true } },
      { name: 'blogAutomationLogs', doc: 'init', data: { initialized: true } }
    ];

    for (const collection of collections) {
      await db.collection(collection.name).doc(collection.doc).set(collection.data);
      await db.collection(collection.name).doc(collection.doc).delete();
      console.log(`   ✅ Created collection: ${collection.name}`);
    }

    // 5. Summary
    console.log('\n✨ Blog automation setup complete!');
    console.log('\n📋 Configuration Summary:');
    console.log('   - Gemini AI: ✅ Configured');
    console.log('   - Pexels Images: ✅ Configured');
    console.log('   - LinkedIn Posting: ✅ Configured');
    console.log('   - Email Notifications: ✅ Configured');
    console.log('   - Blog Collections: ✅ Created');
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Copy blog generation scripts from GovTools Pro');
    console.log('   2. Adapt content generation for medical/X-ray topics');
    console.log('   3. Set up Facebook page and webhook (optional)');
    console.log('   4. Deploy Firebase Functions for scheduling');
    console.log('   5. Test blog generation and posting');
    
    console.log('\n📚 Documentation:');
    console.log('   - Setup Guide: APEX-BLOG-AUTOMATION-PLAN.md');
    console.log('   - Reusable Components: REUSABLE-COMPONENTS-FROM-GOVTOOLS.md');
    console.log('   - LinkedIn Setup: LINKEDIN-SETUP-GUIDE.md');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run the complete setup
completeBlogSetup();