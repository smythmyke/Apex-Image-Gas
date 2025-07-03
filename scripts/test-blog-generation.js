/**
 * Test Script for Apex Gas Blog Generation
 * This script demonstrates how to use the blog generation tools
 */

const AutomatedBlogWriter = require('./automated-blog-writer');
const AutomatedBlogPublisher = require('./automated-blog-publisher');

// Sample medical equipment topics for Apex Gas
const sampleTopics = {
  medicalGasSystems: [
    "NFPA 99 Medical Gas System Compliance: A Complete Guide",
    "Medical Oxygen Delivery Systems: Safety and Best Practices",
    "Understanding Medical Air Quality Standards in Healthcare",
    "Zone Valve Box Maintenance: Essential Tips for Healthcare Facilities"
  ],
  xrayTechnology: [
    "Digital X-Ray vs CR Systems: Which is Right for Your Facility?",
    "Reducing Radiation Exposure: Modern X-Ray Safety Protocols",
    "Portable X-Ray Systems: Benefits for Emergency Departments",
    "X-Ray Room Shielding Requirements: Meeting Safety Standards"
  ],
  equipmentMaintenance: [
    "Preventive Maintenance Schedules for Medical Gas Systems",
    "Emergency Response Plans for Medical Equipment Failures",
    "Joint Commission Compliance: Medical Equipment Documentation",
    "Cost-Effective Equipment Lifecycle Management Strategies"
  ],
  general: [
    "Essential Medical Equipment for New Healthcare Facilities",
    "Budget Planning for Medical Equipment Upgrades",
    "Healthcare Technology Trends 2025: What to Expect",
    "Improving Patient Safety Through Equipment Modernization"
  ]
};

async function testBlogWriter() {
  console.log('🧪 Testing Apex Gas Blog Writer\n');
  console.log('================================\n');

  const writer = new AutomatedBlogWriter();
  
  try {
    // Test with a medical gas system topic
    const topic = sampleTopics.medicalGasSystems[0];
    const category = 'medicalGasSystems';
    
    console.log(`📝 Generating blog about: ${topic}`);
    console.log(`📁 Category: ${category}\n`);
    
    const blog = await writer.generateBlog(topic, category);
    
    console.log('\n✅ Blog generated successfully!');
    console.log('📊 Results:');
    console.log(`   Title: ${blog.title}`);
    console.log(`   Word Count: ${blog.wordCount}`);
    console.log(`   Quality Score: ${blog.validation.score}/100`);
    console.log(`   SEO Keywords: ${blog.seoMeta.keywords.join(', ')}`);
    
    if (blog.validation.issues.length > 0) {
      console.log('\n⚠️ Validation Issues:');
      blog.validation.issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    // Save a preview
    const fs = require('fs').promises;
    const filename = `apex-gas-blog-preview-${new Date().toISOString().slice(0, 10)}.md`;
    await fs.writeFile(filename, blog.content);
    console.log(`\n💾 Blog preview saved to: ${filename}`);
    
    return blog;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

async function testBlogPublisher() {
  console.log('\n\n🧪 Testing Apex Gas Blog Publisher\n');
  console.log('===================================\n');

  const publisher = new AutomatedBlogPublisher();
  
  try {
    // Test with an X-ray technology topic
    const topic = sampleTopics.xrayTechnology[0];
    const category = 'xrayTechnology';
    
    console.log(`📝 Creating and publishing blog about: ${topic}`);
    console.log(`📁 Category: ${category}`);
    console.log(`📄 Status: Draft (for testing)\n`);
    
    const result = await publisher.createAndPublishBlog(topic, category, true);
    
    if (result.success) {
      console.log('\n✅ Blog published successfully!');
      console.log(`📍 Document ID: ${result.docId}`);
      console.log(`🔗 Slug: ${result.blogPost.slug}`);
    } else {
      console.error('❌ Failed to publish blog:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

async function generateTopicSuggestions() {
  console.log('\n\n🤖 Generating AI Topic Suggestions\n');
  console.log('==================================\n');

  const publisher = new AutomatedBlogPublisher();
  
  try {
    await publisher.loadApiKeys();
    
    console.log('Generating 3 topic suggestions based on current trends...\n');
    
    for (let i = 1; i <= 3; i++) {
      const suggestion = await publisher.generateTopic();
      console.log(`\n${i}. Topic: ${suggestion.topic}`);
      console.log(`   Category: ${suggestion.category}`);
      console.log(`   Rationale: ${suggestion.rationale}`);
      console.log(`   Keywords: ${suggestion.keywords.join(', ')}`);
    }
  } catch (error) {
    console.error('❌ Error generating topics:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Apex Gas Blog Generation Test Suite\n');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  try {
    console.log('Select a test to run:');
    console.log('1. Test Blog Writer (generates content only)');
    console.log('2. Test Blog Publisher (creates full blog with images)');
    console.log('3. Generate AI topic suggestions');
    console.log('4. Run all tests\n');

    const choice = await question('Enter your choice (1-4): ');
    
    switch (choice) {
      case '1':
        await testBlogWriter();
        break;
      case '2':
        await testBlogPublisher();
        break;
      case '3':
        await generateTopicSuggestions();
        break;
      case '4':
        await testBlogWriter();
        await testBlogPublisher();
        await generateTopicSuggestions();
        break;
      default:
        console.log('Invalid choice. Please run the script again.');
    }
    
    console.log('\n✨ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error).finally(() => process.exit(0));
}

module.exports = {
  testBlogWriter,
  testBlogPublisher,
  generateTopicSuggestions,
  sampleTopics
};