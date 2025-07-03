#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'apex-gas-9920e'
  });
}

const db = admin.firestore();

async function checkBlogContent() {
  try {
    // Get the specific blog post
    const doc = await db.collection('blogPosts').doc('tMfjNgRpCOSi3N2to7eU').get();
    
    if (!doc.exists) {
      console.log('Blog post not found');
      return;
    }
    
    const data = doc.data();
    
    console.log('Title:', data.title);
    console.log('Has content:', !!data.content);
    console.log('Has markdownContent:', !!data.markdownContent);
    console.log('\nFirst 500 chars of content:');
    console.log(data.content ? data.content.substring(0, 500) : 'No content');
    console.log('\nFirst 500 chars of markdownContent:');
    console.log(data.markdownContent ? data.markdownContent.substring(0, 500) : 'No markdownContent');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkBlogContent();