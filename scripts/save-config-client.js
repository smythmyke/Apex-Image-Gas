#!/usr/bin/env node

/**
 * Save social media configuration using client SDK
 * This uses the existing Firebase configuration
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, updateDoc, serverTimestamp } = require('firebase/firestore');

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPx2x-YfwSpc4ZvCe6nJmKASzxMAlgmXY",
  authDomain: "apex-gas-9920e.firebaseapp.com",
  projectId: "apex-gas-9920e",
  storageBucket: "apex-gas-9920e.firebasestorage.app",
  messagingSenderId: "177024004601",
  appId: "1:177024004601:web:85819c56ce7c3a77334d28",
  measurementId: "G-PZMWFDYJ0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveSocialMediaConfig() {
  try {
    console.log('🔧 Saving social media configuration...\n');

    // 1. Update API Keys
    console.log('1️⃣ Saving webhook URLs...');
    await updateDoc(doc(db, 'apiKeys', 'Keys'), {
      linkedinWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/',
      facebookWebhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/',
      socialMediaEnabled: true,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Webhooks saved');

    // 2. LinkedIn Config
    console.log('\n2️⃣ Saving LinkedIn config...');
    await setDoc(doc(db, 'config', 'linkedin'), {
      platform: 'linkedin',
      enabled: true,
      companyName: 'Apex Image Gas',
      companyId: '103002431',
      companyUrl: 'https://www.linkedin.com/company/apex-image-gas',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubp83pd/',
      createdAt: serverTimestamp()
    });
    console.log('✅ LinkedIn configured');

    // 3. Facebook Config
    console.log('\n3️⃣ Saving Facebook config...');
    await setDoc(doc(db, 'config', 'facebook'), {
      platform: 'facebook',
      enabled: true,
      pageName: 'Apex Image Gas',
      pageId: '61578037917573',
      pageUrl: 'https://www.facebook.com/profile.php?id=61578037917573',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/',
      createdAt: serverTimestamp()
    });
    console.log('✅ Facebook configured');

    console.log('\n✨ Configuration saved successfully!');
    console.log('\n📋 Summary:');
    console.log('   LinkedIn: ✅ Ready (Webhook configured)');
    console.log('   Facebook: ✅ Ready (Webhook configured)');
    console.log('\n🚀 Blog automation can now post to both platforms!');
    
    // Give Firestore time to write
    setTimeout(() => process.exit(0), 2000);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run it
saveSocialMediaConfig();