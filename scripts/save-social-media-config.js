#!/usr/bin/env node

/**
 * Save complete social media configuration to Firebase
 * This includes both LinkedIn and Facebook webhooks
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function saveSocialMediaConfig() {
  try {
    console.log('🔧 Saving complete social media configuration...\n');

    // 1. Update API Keys with webhooks (use set with merge to create if doesn't exist)
    console.log('1️⃣ Setting up API keys with webhook URLs...');
    await db.collection('apiKeys').doc('Keys').set({
      // AI and Image APIs
      REACT_APP_GEMINI_API_KEY: 'AIzaSyB9xTJtKx4ftwGufAhkLlOrS79zmqam_ZY',
      PEXELS_API_KEY: 'O6lmD7F3GGia8RGkJrmpiaGnOCzwuW2LTE81btOXgWGfAL3EmFYZKyJl',
      
      // Email Configuration (existing)
      EMAIL_APIKEY: 're_cKR4rdJv_CWrR73qa1d6WFrWzZRHbbC86',
      EMAIL_FROM: 'smythmyke@gmail.com',
      EMAIL_NOTIFICATION: 'smythmyke@gmail.com',
      
      // Social Media Webhooks (updated with correct URLs)
      linkedinWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/',
      facebookWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/',
      socialMediaEnabled: true,
      
      // Timestamps
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log('✅ Webhook URLs saved');

    // 2. LinkedIn Configuration
    console.log('\n2️⃣ Saving LinkedIn configuration...');
    await db.collection('config').doc('linkedin').set({
      platform: 'linkedin',
      enabled: true,
      companyName: 'Apex Image Gas',
      companyId: '103002431',
      companyUrl: 'https://www.linkedin.com/company/apex-image-gas',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/',
      defaultHashtags: [
        '#MedicalImaging',
        '#XrayTechnology', 
        '#RadiationSafety',
        '#MedicalGas',
        '#EOSImaging',
        '#HealthcareTechnology'
      ],
      postingSchedule: {
        professional: true,
        bestTimes: ['Tuesday 10am', 'Thursday 10am', 'Saturday 9am']
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ LinkedIn configured');

    // 3. Facebook Configuration
    console.log('\n3️⃣ Saving Facebook configuration...');
    await db.collection('config').doc('facebook').set({
      platform: 'facebook',
      enabled: true,
      pageName: 'Apex Image Gas',
      pageId: '61578037917573',
      pageUrl: 'https://www.facebook.com/profile.php?id=61578037917573',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/',
      defaultHashtags: [
        '#MedicalImaging',
        '#XrayEquipment',
        '#HealthcareSafety'
      ],
      postingSchedule: {
        conversational: true,
        bestTimes: ['Tuesday 10am', 'Thursday 10am', 'Saturday 9am']
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Facebook configured');

    // 4. Social Media Settings
    console.log('\n4️⃣ Saving general social media settings...');
    await db.collection('config').doc('socialMedia').set({
      platforms: {
        linkedin: {
          enabled: true,
          webhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ub7vscl/'
        },
        facebook: {
          enabled: true,
          webhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/'
        }
      },
      postingStrategy: {
        simultaneousPosting: true,
        platformSpecificContent: true,
        includeImages: true,
        trackEngagement: true
      },
      contentAdaptation: {
        linkedin: {
          tone: 'professional',
          maxLength: 3000,
          includeLinks: true,
          useHashtags: true
        },
        facebook: {
          tone: 'conversational',
          maxLength: 500,
          includeLinks: true,
          useHashtags: false,
          useEmojis: true
        }
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Social media settings saved');

    // 5. Summary
    console.log('\n✨ Social media configuration complete!');
    console.log('\n📋 Configuration Summary:');
    console.log('   LinkedIn:');
    console.log('   - Company: Apex Image Gas (103002431)');
    console.log('   - Webhook: ✅ Configured');
    console.log('   - Status: ✅ Enabled');
    console.log('\n   Facebook:');
    console.log('   - Page: Apex Image Gas (61578037917573)');
    console.log('   - Webhook: ✅ Configured');
    console.log('   - Status: ✅ Enabled');
    
    console.log('\n🚀 Your blog automation can now post to:');
    console.log('   - LinkedIn: https://www.linkedin.com/company/apex-image-gas');
    console.log('   - Facebook: https://www.facebook.com/profile.php?id=61578037917573');
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Copy blog generation scripts from GovTools Pro');
    console.log('   2. Adapt content generation for medical/X-ray topics');
    console.log('   3. Deploy Firebase Functions for scheduling');
    console.log('   4. Test automated blog generation and posting');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error saving configuration:', error);
    process.exit(1);
  }
}

// Run the configuration
saveSocialMediaConfig();