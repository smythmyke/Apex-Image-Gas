#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

async function checkTopics() {
  console.log('📋 Checking Blog Topics\n');
  
  const topics = await db.collection('blogTopics').get();
  
  console.log(`Total topics: ${topics.size}\n`);
  
  const byCategory = {};
  
  topics.forEach(doc => {
    const data = doc.data();
    if (!byCategory[data.category]) {
      byCategory[data.category] = [];
    }
    byCategory[data.category].push({
      id: doc.id,
      topic: data.topic,
      used: data.used,
      priority: data.priority
    });
  });
  
  Object.keys(byCategory).forEach(category => {
    console.log(`\n📁 ${category}:`);
    byCategory[category].forEach(topic => {
      console.log(`   ${topic.used ? '✓' : '○'} ${topic.topic} (priority: ${topic.priority})`);
    });
  });
  
  process.exit(0);
}

checkTopics();