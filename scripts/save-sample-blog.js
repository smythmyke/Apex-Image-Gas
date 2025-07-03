#!/usr/bin/env node

/**
 * Save a sample blog to Firestore
 * Standalone script with proper initialization
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'apex-gas-9920e'
});

const db = admin.firestore();

// Import blog writer after Firebase is initialized
const AutomatedBlogWriter = require('./automated-blog-writer');

async function saveSampleBlog() {
  console.log('🚀 Saving Sample Blog to Firestore\n');
  
  const writer = new AutomatedBlogWriter();
  
  const topic = "5 signs your EOS X-ray detector needs gas replacement";
  const category = "health-safety";
  
  console.log(`📝 Generating blog about: ${topic}`);
  console.log(`📁 Category: ${category}\n`);
  
  try {
    // Generate the blog
    const blogData = await writer.generateBlog(topic, category);
    
    console.log('✅ Blog generated!');
    console.log(`   Title: ${blogData.title}`);
    console.log(`   Word Count: ${blogData.wordCount}`);
    console.log(`   SEO Score: ${blogData.validation.score}/10`);
    
    // Create blog document
    const blogDoc = {
      // Core content
      title: blogData.title,
      slug: blogData.seoMeta.slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      markdownContent: blogData.content,
      
      // Categorization
      category: blogData.category,
      tags: blogData.seoMeta.keywords.slice(0, 5),
      
      // Media placeholder
      featuredImage: {
        url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
        alt: 'X-ray machine detector',
        credit: 'Photo by Anna Shvets from Pexels'
      },
      
      // Publishing info
      status: 'draft',
      author: {
        name: 'Apex Gas Team',
        role: 'Medical Equipment Specialists'
      },
      
      // SEO
      seo: {
        metaTitle: blogData.seoMeta.title,
        metaDescription: blogData.seoMeta.metaDescription,
        keywords: blogData.seoMeta.keywords
      },
      
      // Timestamps
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: null,
      
      // Analytics
      views: 0,
      readTime: Math.ceil(blogData.wordCount / 200),
      
      // Metadata
      metadata: {
        generatedBy: 'apex-gas-blog-automation',
        wordCount: blogData.wordCount,
        validationScore: blogData.validation.score
      }
    };
    
    // Save to Firestore
    console.log('\n💾 Saving to Firestore...');
    const docRef = await db.collection('blogPosts').add(blogDoc);
    
    console.log('\n✅ Blog saved successfully!');
    console.log(`   Document ID: ${docRef.id}`);
    console.log(`   View in console: https://console.firebase.google.com/project/apex-gas-9920e/firestore/data/~2FblogPosts~2F${docRef.id}`);
    
    // Create social media previews
    console.log('\n📱 Social Media Previews:\n');
    
    // LinkedIn
    console.log('LinkedIn Post:');
    console.log('---');
    console.log(`${blogDoc.title}\n\n${blogDoc.excerpt}\n\nRead more on our blog.\n\n#MedicalImaging #XrayTechnology #HealthcareSafety`);
    console.log('---');
    
    // Facebook
    console.log('\nFacebook Post:');
    console.log('---');
    console.log(`⚠️ Important for healthcare facilities!\n\n${blogDoc.title}\n\n${blogDoc.excerpt}\n\nProtect your patients and equipment. Learn the warning signs.`);
    console.log('---');
    
    console.log('\n✨ Blog is ready for review and publishing!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

// Run the script
saveSampleBlog();