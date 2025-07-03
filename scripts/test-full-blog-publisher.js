#!/usr/bin/env node

/**
 * Test full blog publisher with Pexels images
 * This creates a complete blog post with images
 */

const AutomatedBlogPublisher = require('./automated-blog-publisher');

async function testFullBlogPublisher() {
  console.log('🚀 Testing Full Blog Publisher with Pexels Images\n');
  
  const publisher = new AutomatedBlogPublisher();
  
  // Test topic
  const topic = "Best practices for EOS X-ray detector gas maintenance";
  const category = "product-guides";
  
  console.log(`📝 Topic: ${topic}`);
  console.log(`📁 Category: ${category}`);
  console.log('\n⏳ This will take 1-2 minutes as it generates comprehensive content...\n');
  
  try {
    // Generate the full blog with images
    const result = await publisher.generateAndPublishBlog(topic, category);
    
    if (result.success) {
      console.log('\n✅ Blog published successfully!');
      console.log('\n📊 Blog Details:');
      console.log(`   ID: ${result.blogId}`);
      console.log(`   Title: ${result.blog.title}`);
      console.log(`   Word Count: ${result.blog.wordCount}`);
      console.log(`   Status: ${result.blog.status}`);
      
      console.log('\n🖼️ Images:');
      if (result.blog.featuredImage) {
        console.log(`   Featured Image: ${result.blog.featuredImage.url}`);
        console.log(`   - Alt Text: ${result.blog.featuredImage.alt}`);
        console.log(`   - Credit: ${result.blog.featuredImage.credit}`);
      }
      
      console.log('\n🎯 SEO:');
      console.log(`   Title: ${result.blog.seo.metaTitle}`);
      console.log(`   Description: ${result.blog.seo.metaDescription}`);
      console.log(`   Keywords: ${result.blog.seo.keywords.join(', ')}`);
      
      console.log('\n📱 Social Media Ready:');
      console.log(`   LinkedIn: ${result.socialMediaReady ? '✅ Ready to post' : '❌ Not ready'}`);
      console.log(`   Facebook: ${result.socialMediaReady ? '✅ Ready to post' : '❌ Not ready'}`);
      
      console.log('\n💾 Saved to Firestore:');
      console.log(`   Collection: blogPosts`);
      console.log(`   Document ID: ${result.blogId}`);
      
      // Show a preview of the content structure
      console.log('\n📄 Content Structure:');
      const sections = result.blog.content.match(/## ([^\n]+)/g);
      if (sections) {
        sections.forEach((section, i) => {
          console.log(`   ${i + 1}. ${section.replace('## ', '')}`);
        });
      }
      
      console.log('\n✨ Next Steps:');
      console.log('   1. View the blog in Firestore console');
      console.log('   2. Post to social media using the publishing functions');
      console.log('   3. Set up automated scheduling');
      
    } else {
      console.error('❌ Blog publication failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testFullBlogPublisher();