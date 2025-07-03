#!/usr/bin/env node

/**
 * Test saving a blog to Firestore
 * This demonstrates the complete blog generation and storage process
 */

const AutomatedBlogWriter = require('./automated-blog-writer');
const admin = require('firebase-admin');
const { db } = require('../scripts/lib/firebase-config').initializeFirebase();

async function testSaveBlog() {
  console.log('🚀 Testing Blog Save to Firestore\n');
  
  const writer = new AutomatedBlogWriter();
  
  const topic = "Preventive maintenance schedules for EOS X-ray gas systems";
  const category = "product-guides";
  
  console.log(`📝 Generating blog about: ${topic}`);
  console.log(`📁 Category: ${category}\n`);
  
  try {
    // Generate the blog
    const blogData = await writer.generateBlog(topic, category);
    
    console.log('✅ Blog generated successfully!');
    console.log(`   Title: ${blogData.title}`);
    console.log(`   Word Count: ${blogData.wordCount}`);
    
    // Prepare blog document for Firestore
    const blogDocument = {
      title: blogData.title,
      slug: blogData.seoMeta.slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      markdownContent: blogData.content,
      category: blogData.category,
      tags: blogData.seoMeta.keywords.slice(0, 5), // Use first 5 keywords as tags
      
      // Placeholder image (would be replaced by Pexels in production)
      featuredImage: {
        url: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg',
        alt: 'Medical X-ray equipment',
        credit: 'Photo by Pexels'
      },
      
      status: 'draft', // Start as draft for review
      
      author: {
        name: blogData.author,
        role: 'Medical Equipment Specialist',
        avatar: null
      },
      
      seo: {
        metaTitle: blogData.seoMeta.title,
        metaDescription: blogData.seoMeta.metaDescription,
        keywords: blogData.seoMeta.keywords
      },
      
      publishedAt: null, // Will be set when published
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      
      views: 0,
      readTime: Math.ceil(blogData.wordCount / 200), // Estimate reading time
      
      // Metadata
      metadata: {
        generatedBy: 'automated-blog-system',
        wordCount: blogData.wordCount,
        validationScore: blogData.validation.score,
        imageKeywords: blogData.imageKeywords
      }
    };
    
    // Save to Firestore
    console.log('\n💾 Saving to Firestore...');
    const docRef = await db.collection('blogPosts').add(blogDocument);
    
    console.log(`✅ Blog saved successfully!`);
    console.log(`   Document ID: ${docRef.id}`);
    console.log(`   Collection: blogPosts`);
    console.log(`   Status: draft`);
    
    // Show what was saved
    console.log('\n📄 Saved Blog Summary:');
    console.log(`   Title: ${blogDocument.title}`);
    console.log(`   Slug: ${blogDocument.slug}`);
    console.log(`   Category: ${blogDocument.category}`);
    console.log(`   Tags: ${blogDocument.tags.join(', ')}`);
    console.log(`   Read Time: ${blogDocument.readTime} minutes`);
    console.log(`   SEO Title: ${blogDocument.seo.metaTitle}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Review the blog in Firebase Console');
    console.log('   2. Select and upload Pexels images');
    console.log('   3. Change status to "published"');
    console.log('   4. Post to social media');
    
    // Test social media post creation
    console.log('\n📱 Social Media Preview:');
    
    // LinkedIn post
    const linkedinPost = {
      commentary: `${blogDocument.title}\n\n${blogDocument.excerpt}\n\nRead more: https://apeximagegas.net/blog/${blogDocument.slug}\n\n#MedicalImaging #XrayTechnology #HealthcareMaintenance`,
      visibility: 'PUBLIC'
    };
    
    console.log('\nLinkedIn Post:');
    console.log(linkedinPost.commentary);
    
    // Facebook post
    const facebookPost = {
      message: `🔧 New Blog Post Alert!\n\n${blogDocument.title}\n\n${blogDocument.excerpt}\n\nLearn more about maintaining your EOS X-ray equipment for optimal performance.`,
      link_url: `https://apeximagegas.net/blog/${blogDocument.slug}`,
      link_name: blogDocument.title,
      link_description: blogDocument.excerpt
    };
    
    console.log('\nFacebook Post:');
    console.log(facebookPost.message);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
  
  process.exit(0);
}

// Run the test
testSaveBlog();