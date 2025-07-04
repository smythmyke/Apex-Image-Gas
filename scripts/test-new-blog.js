/**
 * Test script to generate a new blog post with unique image
 */

const axios = require('axios');

async function testNewBlog() {
  console.log('🚀 Testing new blog generation with improved image selection...\n');
  
  const blogData = {
    topic: "Digital X-Ray Systems: Reducing Patient Radiation Exposure",
    category: "xrayTechnology"
  };
  
  console.log('📝 Blog Topic:', blogData.topic);
  console.log('📂 Category:', blogData.category);
  console.log('\n⏳ Generating blog (this may take 30-60 seconds)...\n');
  
  try {
    const response = await axios.post(
      'https://us-central1-apex-gas-9920e.cloudfunctions.net/generateBlogManually',
      blogData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout
      }
    );
    
    if (response.data.success) {
      console.log('✅ Blog generated successfully!');
      console.log('📍 Blog ID:', response.data.blogId);
      console.log('📰 Title:', response.data.title);
      console.log('📊 Status:', response.data.status);
      console.log('\n🔗 View blog at: https://blog.apeximagegas.net/' + response.data.blogId);
      
      // Note: The blog starts as a draft, so it won't be visible on the public site yet
      console.log('\n⚠️  Note: This blog is saved as a DRAFT. To publish it:');
      console.log('1. Go to Firebase Console > Firestore');
      console.log('2. Find the blog in blogPosts collection');
      console.log('3. Change status from "draft" to "published"');
      console.log('4. Add a publishedAt timestamp');
    } else {
      console.error('❌ Blog generation failed:', response.data);
    }
  } catch (error) {
    if (error.response) {
      console.error('❌ Server error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. The function might be taking longer than expected.');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the test
testNewBlog();