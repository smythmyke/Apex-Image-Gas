#!/usr/bin/env node

/**
 * Test manual blog generation locally
 * Simulates the manual generation endpoint
 */

const AutomatedBlogWriter = require('./automated-blog-writer');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize if needed
if (!admin.apps.length) {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'apex-gas-9920e'
  });
}

const db = admin.firestore();

async function testManualGeneration(topic, category) {
  console.log('🧪 Testing Manual Blog Generation\n');
  console.log(`Topic: ${topic}`);
  console.log(`Category: ${category}\n`);

  try {
    // Generate blog
    const writer = new AutomatedBlogWriter();
    const blogContent = await writer.generateBlog(topic, category);

    console.log('✅ Blog generated successfully!');
    console.log(`Title: ${blogContent.title}`);
    console.log(`Word count: ${blogContent.wordCount}`);

    // Create blog document (similar to function)
    const blogDoc = {
      title: blogContent.title,
      slug: blogContent.seoMeta.slug,
      excerpt: blogContent.excerpt,
      content: blogContent.content,
      markdownContent: blogContent.content,
      category: category,
      tags: blogContent.seoMeta.keywords.slice(0, 5),
      featuredImage: {
        url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
        alt: 'Medical equipment',
        credit: 'Photo by Pexels'
      },
      status: 'published',
      author: {
        name: 'Apex Gas Team',
        role: 'Medical Equipment Specialists'
      },
      seo: {
        metaTitle: blogContent.seoMeta.title,
        metaDescription: blogContent.seoMeta.metaDescription,
        keywords: blogContent.seoMeta.keywords
      },
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      readTime: Math.ceil(blogContent.wordCount / 200),
      metadata: {
        generatedBy: 'manual-test',
        wordCount: blogContent.wordCount
      }
    };

    // Save to Firestore
    const docRef = await db.collection('blogPosts').add(blogDoc);

    console.log(`\n✅ Saved to Firestore: ${docRef.id}`);
    
    // Test social media posts
    console.log('\n📱 Testing social media webhooks...');
    
    // Get API keys
    const keysDoc = await db.collection('apiKeys').doc('Keys').get();
    const apiKeys = keysDoc.data();
    
    const blogUrl = `https://apeximagegas.net/blog/${blogDoc.slug}`;
    
    // LinkedIn
    if (apiKeys.linkedinWebhookUrl) {
      const linkedinData = {
        commentary: `${blogDoc.title}\n\n${blogDoc.excerpt}\n\nRead more: ${blogUrl}\n\n#MedicalImaging #XrayTechnology`,
        visibility: 'PUBLIC'
      };
      
      try {
        await axios.post(apiKeys.linkedinWebhookUrl, linkedinData);
        console.log('✅ LinkedIn: Posted successfully');
      } catch (error) {
        console.log('❌ LinkedIn: Failed to post');
      }
    }
    
    // Facebook
    if (apiKeys.facebookWebhookUrl) {
      const facebookData = {
        message: `📚 New Blog: ${blogDoc.title}\n\n${blogDoc.excerpt}`,
        link_url: blogUrl
      };
      
      try {
        await axios.post(apiKeys.facebookWebhookUrl, facebookData);
        console.log('✅ Facebook: Posted successfully');
      } catch (error) {
        console.log('❌ Facebook: Failed to post');
      }
    }
    
    console.log('\n✨ Manual generation test complete!');
    console.log('\nThis simulates what the Firebase function will do.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

// Run test with sample data
const testTopic = "How to maintain consistent gas pressure in EOS X-ray systems";
const testCategory = "technology";

testManualGeneration(testTopic, testCategory);