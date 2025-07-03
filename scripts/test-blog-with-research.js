#!/usr/bin/env node

/**
 * Test blog generation with research phase
 * This shows the deep research capabilities
 */

const AutomatedBlogPublisher = require('./automated-blog-publisher');

async function testBlogWithResearch() {
  console.log('🚀 Testing Blog Generation with Deep Research\n');
  
  const publisher = new AutomatedBlogPublisher();
  
  const topic = "The impact of gas purity on EOS X-ray image quality";
  const category = "technology";
  
  console.log(`📝 Topic: ${topic}`);
  console.log(`📁 Category: ${category}`);
  console.log('\n⏳ Starting deep research process...\n');
  
  try {
    // Load API keys first
    await publisher.loadApiKeys();
    
    // Initialize Gemini
    if (!publisher.model) {
      throw new Error('Gemini model not initialized');
    }
    
    // Test just the research phase
    console.log('📚 Phase 1: Identifying Research Areas...');
    const researchAreas = await publisher.identifyResearchAreas(topic);
    console.log('\nResearch areas identified:');
    researchAreas.forEach((area, i) => {
      console.log(`   ${i + 1}. ${area}`);
    });
    
    console.log('\n🔬 Phase 2: Conducting Deep Research...');
    const research = await publisher.conductResearch(topic, researchAreas);
    
    console.log('\n📊 Research Summary:');
    // Show first 500 characters of research
    console.log(research.substring(0, 500) + '...');
    
    console.log('\n📐 Phase 3: Creating Blog Structure...');
    const blogStructure = await publisher.createBlogStructure(topic, research);
    
    console.log('\nBlog structure created:');
    // Extract main sections from structure
    const structureSections = blogStructure.match(/\d+\.\s+([^\n]+)/g);
    if (structureSections) {
      structureSections.forEach(section => {
        console.log(`   ${section}`);
      });
    }
    
    console.log('\n✍️ Phase 4: Generating Complete Blog...');
    const blogContent = await publisher.generateBlogFromStructure(topic, research, blogStructure, category);
    
    console.log('\n✅ Blog generation complete!');
    console.log(`   Word count: ${blogContent.split(' ').length} words`);
    
    // Extract and show the title
    const titleMatch = blogContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      console.log(`   Title: ${titleMatch[1]}`);
    }
    
    // Count sections
    const sections = blogContent.match(/##\s+/g);
    console.log(`   Sections: ${sections ? sections.length : 0}`);
    
    // Show if CTA is included
    const hasCTA = blogContent.includes('Apex Gas');
    console.log(`   CTA included: ${hasCTA ? '✅ Yes' : '❌ No'}`);
    
    console.log('\n🖼️ Suggested image search:');
    console.log(`   "medical x-ray equipment technology"`);
    console.log(`   "eos imaging system"`);
    console.log(`   "medical gas equipment"`);
    
    console.log('\n✨ Research-driven content benefits:');
    console.log('   - In-depth technical accuracy');
    console.log('   - Comprehensive coverage');
    console.log('   - Industry-specific insights');
    console.log('   - Evidence-based recommendations');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
  
  process.exit(0);
}

// Run the test
testBlogWithResearch();