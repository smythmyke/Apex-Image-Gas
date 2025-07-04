/**
 * Generate a new blog post using the AutomatedBlogPublisher
 * This ensures proper image selection with duplicate prevention
 */

const AutomatedBlogPublisher = require('./automated-blog-publisher');

async function generateNewBlog() {
  const publisher = new AutomatedBlogPublisher();
  
  // Blog topics to choose from
  const topics = [
    "Digital X-Ray Detectors: Gas Mixture Requirements for Optimal Performance",
    "Preventive Maintenance for Medical Gas Systems in Healthcare",
    "X-Ray Room Design: Integrating Gas Supply Systems",
    "Quality Control in Medical Imaging: Gas Purity Standards",
    "Emergency Protocols for Medical Gas System Failures",
    "Cost-Benefit Analysis of Modern X-Ray Equipment Upgrades",
    "Regulatory Compliance for Medical Gas Storage and Distribution",
    "Troubleshooting Common X-Ray Equipment Gas Pressure Issues"
  ];
  
  // Select a random topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  console.log('🚀 Starting automated blog generation');
  console.log(`📝 Topic: ${randomTopic}\n`);
  
  try {
    const result = await publisher.createAndPublishBlog(
      randomTopic,
      'medicalGasSystems', // category
      false // publish immediately (not draft)
    );
    
    if (result.success) {
      console.log('\n✅ Blog published successfully!');
      console.log(`📍 Blog ID: ${result.docId}`);
      console.log(`🔗 URL: https://blog.apeximagegas.net/${result.blogPost.slug}`);
      
      // Check if a new image was used
      console.log('\n🖼️  Image Details:');
      console.log(`   URL: ${result.blogPost.featuredImage.url}`);
      console.log(`   Credit: ${result.blogPost.featuredImage.credit}`);
      
      const pexelsId = result.blogPost.featuredImage.url.match(/pexels-photo-(\d+)/)?.[1];
      if (pexelsId) {
        console.log(`   Pexels ID: ${pexelsId}`);
      }
    } else {
      console.error('❌ Blog generation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Exit the process
    process.exit();
  }
}

// Run the generator
generateNewBlog();