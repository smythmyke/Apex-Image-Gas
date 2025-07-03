#!/usr/bin/env node

/**
 * Test blog publisher without Firebase Storage
 * Uses Pexels URLs directly
 */

const AutomatedBlogPublisher = require('./automated-blog-publisher');

async function testBlogPublisher() {
  console.log('🚀 Testing Blog Publisher (Simple Version)\n');
  
  const publisher = new AutomatedBlogPublisher();
  
  // Override the storage requirement
  publisher.uploadImageToStorage = async (imageBuffer, fileName) => {
    console.log(`📸 Would upload image: ${fileName}`);
    // Return a mock URL for testing
    return `https://storage.googleapis.com/apex-gas-blog-images/${fileName}`;
  };
  
  const topic = "How to optimize EOS 3.5 X-ray machine performance with proper gas management";
  const category = "technology";
  
  console.log(`📝 Topic: ${topic}`);
  console.log(`📁 Category: ${category}`);
  console.log('\n⏳ Generating comprehensive blog content...\n');
  
  try {
    // Just generate the blog with research
    const blogData = await publisher.generateBlogWithResearch(topic, category);
    
    if (blogData) {
      console.log('\n✅ Blog generated successfully!');
      console.log('\n📊 Blog Details:');
      console.log(`   Title: ${blogData.title}`);
      console.log(`   Word Count: ${blogData.wordCount}`);
      console.log(`   Author: ${blogData.author.name}`);
      
      console.log('\n🎯 SEO:');
      console.log(`   Meta Title: ${blogData.seo.metaTitle}`);
      console.log(`   Description: ${blogData.seo.metaDescription}`);
      console.log(`   Keywords: ${blogData.seo.keywords.join(', ')}`);
      
      // Find images in the research
      console.log('\n🖼️ Pexels Image Search:');
      if (blogData.metadata && blogData.metadata.research) {
        const imageSearch = blogData.metadata.research.imageSearch;
        if (imageSearch) {
          console.log(`   Search Query: "${imageSearch}"`);
        }
      }
      
      // Save to Firestore
      const savedBlog = await db.collection('blogPosts').add({
        ...blogData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('\n💾 Saved to Firestore:');
      console.log(`   Document ID: ${savedBlog.id}`);
      console.log(`   Status: draft (ready for review)`);
      
      // Extract main sections
      console.log('\n📄 Content Sections:');
      const sections = blogData.content.match(/## ([^\n]+)/g);
      if (sections) {
        sections.slice(0, 10).forEach((section, i) => {
          console.log(`   ${i + 1}. ${section.replace('## ', '')}`);
        });
        if (sections.length > 10) {
          console.log(`   ... and ${sections.length - 10} more sections`);
        }
      }
      
      console.log('\n✨ Blog is ready for:');
      console.log('   1. Manual review and publishing');
      console.log('   2. Social media posting');
      console.log('   3. Adding to the blog website');
      
    } else {
      console.error('❌ Failed to generate blog');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

// Add required imports at the top of the script
const admin = require('firebase-admin');
const { db } = require('./lib/firebase-config').initializeFirebase();

// Run the test
testBlogPublisher();