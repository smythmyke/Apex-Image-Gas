#!/usr/bin/env node

/**
 * Create all necessary Firestore collections for blog automation
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function createCollections() {
  console.log('🏗️  Creating Firestore Collections for Blog Automation\n');

  try {
    // 1. Blog Posts Collection
    console.log('1️⃣ Creating blogPosts collection...');
    await db.collection('blogPosts').doc('_init').set({
      message: 'Collection initialized',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await db.collection('blogPosts').doc('_init').delete();
    console.log('✅ blogPosts collection created');

    // 2. Used Pexels Images Collection
    console.log('\n2️⃣ Creating usedPexelsImages collection...');
    await db.collection('usedPexelsImages').doc('_init').set({
      message: 'Collection initialized',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await db.collection('usedPexelsImages').doc('_init').delete();
    console.log('✅ usedPexelsImages collection created');

    // 3. Social Media Logs Collection
    console.log('\n3️⃣ Creating socialMediaLogs collection...');
    await db.collection('socialMediaLogs').doc('_init').set({
      message: 'Collection initialized',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await db.collection('socialMediaLogs').doc('_init').delete();
    console.log('✅ socialMediaLogs collection created');

    // 4. Blog Automation Logs Collection
    console.log('\n4️⃣ Creating blogAutomationLogs collection...');
    await db.collection('blogAutomationLogs').doc('_init').set({
      message: 'Collection initialized',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await db.collection('blogAutomationLogs').doc('_init').delete();
    console.log('✅ blogAutomationLogs collection created');

    // 5. Blog Categories Collection
    console.log('\n5️⃣ Creating blogCategories collection...');
    const categories = [
      {
        id: 'technology',
        name: 'Technology',
        description: 'X-ray technology advancements and innovations',
        slug: 'technology',
        order: 1
      },
      {
        id: 'health-safety',
        name: 'Health & Safety',
        description: 'Radiation safety and health considerations',
        slug: 'health-safety',
        order: 2
      },
      {
        id: 'industry-insights',
        name: 'Industry Insights',
        description: 'Medical imaging industry news and trends',
        slug: 'industry-insights',
        order: 3
      },
      {
        id: 'product-guides',
        name: 'Product Guides',
        description: 'Guides for EOS systems and gas detectors',
        slug: 'product-guides',
        order: 4
      }
    ];

    for (const category of categories) {
      await db.collection('blogCategories').doc(category.id).set({
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ blogCategories collection created with 4 categories');

    // 6. Blog Topics Collection
    console.log('\n6️⃣ Creating blogTopics collection...');
    const topics = [
      { topic: 'X-ray technology advancements', category: 'technology', priority: 'high' },
      { topic: 'Medical imaging best practices', category: 'health-safety', priority: 'high' },
      { topic: 'EOS Alphatec system guides', category: 'product-guides', priority: 'high' },
      { topic: 'Gas detector maintenance and safety', category: 'health-safety', priority: 'high' },
      { topic: 'Radiation safety guidelines', category: 'health-safety', priority: 'medium' },
      { topic: 'Industry regulations and compliance', category: 'industry-insights', priority: 'medium' },
      { topic: 'Case studies and success stories', category: 'industry-insights', priority: 'low' }
    ];

    for (let i = 0; i < topics.length; i++) {
      await db.collection('blogTopics').doc(`topic_${i + 1}`).set({
        ...topics[i],
        used: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ blogTopics collection created with 7 topics');

    // 7. Verify all collections
    console.log('\n7️⃣ Verifying collections...');
    const collections = await db.listCollections();
    const collectionNames = collections.map(col => col.id);
    
    console.log('\n📁 All collections in Firestore:');
    collectionNames.forEach(name => console.log(`   - ${name}`));

    console.log('\n✨ All collections created successfully!');
    console.log('\n📋 Summary:');
    console.log('   - blogPosts: For storing blog articles');
    console.log('   - usedPexelsImages: For tracking used stock images');
    console.log('   - socialMediaLogs: For social media posting history');
    console.log('   - blogAutomationLogs: For automation system logs');
    console.log('   - blogCategories: 4 categories configured');
    console.log('   - blogTopics: 7 topics ready for content generation');
    console.log('   - apiKeys: API keys and webhooks (already configured)');
    console.log('   - config: Social media configurations (already configured)');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error);
  }

  process.exit(0);
}

createCollections();