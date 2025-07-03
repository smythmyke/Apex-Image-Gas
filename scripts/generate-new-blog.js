#!/usr/bin/env node

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

// Different topics to test
const topics = [
  "Understanding radiation safety protocols in medical imaging facilities",
  "How to optimize X-ray image quality while minimizing radiation dose", 
  "Essential maintenance schedules for medical gas systems",
  "Digital vs analog X-ray systems: Making the right choice",
  "Compliance requirements for medical gas installations"
];

async function generateNewBlog() {
  console.log('🚀 Generating New Blog Post\n');
  
  // Pick a random topic
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const category = ['technology', 'health-safety', 'industry-insights'][Math.floor(Math.random() * 3)];
  
  console.log(`Topic: ${topic}`);
  console.log(`Category: ${category}\n`);

  try {
    // Generate blog
    const writer = new AutomatedBlogWriter();
    const blogContent = await writer.generateBlog(topic, category);

    console.log('✅ Blog generated successfully!');
    console.log(`Title: ${blogContent.title}`);
    console.log(`Word count: ${blogContent.wordCount}`);

    // Create blog document
    const blogDoc = {
      title: blogContent.title,
      slug: blogContent.seoMeta.slug,
      excerpt: blogContent.excerpt,
      content: blogContent.content,
      markdownContent: blogContent.content,
      category: category,
      tags: blogContent.seoMeta.keywords.slice(0, 5),
      featuredImage: {
        url: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
        alt: 'Medical X-ray equipment',
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
        generatedBy: 'manual-trigger',
        wordCount: blogContent.wordCount
      }
    };

    // Save to Firestore
    const docRef = await db.collection('blogPosts').add(blogDoc);

    console.log(`\n✅ Saved to Firestore: ${docRef.id}`);
    console.log(`\n🌐 View at: https://blog.apeximagegas.net/${blogDoc.slug}`);
    
    // Test social media posts
    console.log('\n📱 Posting to social media...');
    
    // Get API keys
    const keysDoc = await db.collection('apiKeys').doc('Keys').get();
    const apiKeys = keysDoc.data();
    
    const blogUrl = `https://blog.apeximagegas.net/${blogDoc.slug}`;
    
    // LinkedIn
    if (apiKeys.linkedinWebhookUrl) {
      const linkedinData = {
        commentary: `${blogDoc.title}\n\n${blogDoc.excerpt}\n\nRead more: ${blogUrl}\n\n#MedicalImaging #Healthcare #XrayTechnology`,
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
        message: `📚 New Blog: ${blogDoc.title}\n\n${blogDoc.excerpt}\n\nRead the full article on our blog!`,
        link_url: blogUrl
      };
      
      try {
        await axios.post(apiKeys.facebookWebhookUrl, facebookData);
        console.log('✅ Facebook: Posted successfully');
      } catch (error) {
        console.log('❌ Facebook: Failed to post');
      }
    }
    
    console.log('\n🎉 Blog generation complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

generateNewBlog();