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

async function checkLatestBlog() {
  try {
    // Get the latest blog post
    const snapshot = await db.collection('blogPosts')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      console.log('No blog posts found');
      return;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    console.log('\n📄 Latest Blog Post:');
    console.log('-------------------');
    console.log('ID:', doc.id);
    console.log('Title:', data.title);
    console.log('Status:', data.status);
    console.log('Slug:', data.slug);
    console.log('Category:', data.category);
    console.log('Created:', data.createdAt?.toDate().toLocaleString());
    console.log('\nBlog URL: https://blog.apeximagegas.net/' + data.slug);
    
    // Check if it's the one we just created
    if (doc.id === 'tMfjNgRpCOSi3N2to7eU') {
      console.log('\n✅ This is the blog we just generated!');
      console.log('\nNote: The blog is currently in "draft" status.');
      console.log('To publish it, update the status to "published" in Firestore.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkLatestBlog();