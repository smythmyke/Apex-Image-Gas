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

async function publishBlog() {
  try {
    const blogId = 'tMfjNgRpCOSi3N2to7eU';
    
    // Update the blog status to published
    await db.collection('blogPosts').doc(blogId).update({
      status: 'published',
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Blog published successfully!');
    console.log('View it at: https://blog.apeximagegas.net');
    
  } catch (error) {
    console.error('Error publishing blog:', error);
  } finally {
    process.exit(0);
  }
}

publishBlog();