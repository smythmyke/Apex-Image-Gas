#!/usr/bin/env node

/**
 * Demo blog generation for Apex Gas
 */

const AutomatedBlogWriter = require('./automated-blog-writer');

async function demoBlogGeneration() {
  console.log('🚀 Apex Gas Blog Generation Demo\n');
  
  const writer = new AutomatedBlogWriter();
  
  // Test different categories
  const topics = [
    {
      topic: "5 Essential safety protocols for X-ray gas handling in medical facilities",
      category: "health-safety"
    },
    {
      topic: "How precision gas mixtures improve EOS 3.5 image quality",
      category: "technology"
    },
    {
      topic: "Regulatory compliance for medical gas storage in healthcare",
      category: "industry-insights"
    }
  ];
  
  // Generate one blog as demo
  const selectedTopic = topics[0];
  
  console.log(`📝 Generating blog about: ${selectedTopic.topic}`);
  console.log(`📁 Category: ${selectedTopic.category}\n`);
  
  try {
    const result = await writer.generateBlog(selectedTopic.topic, selectedTopic.category);
    
    console.log('\n✅ Blog generated successfully!');
    console.log('\n📊 Blog Details:');
    console.log(`   Title: ${result.title}`);
    console.log(`   Word Count: ${result.wordCount}`);
    console.log(`   Read Time: ~${Math.ceil(result.wordCount / 200)} minutes`);
    console.log(`   Category: ${result.category}`);
    console.log(`   Author: ${result.author}`);
    console.log('\n🎯 SEO Optimization:');
    console.log(`   Meta Title: ${result.seoMeta.title}`);
    console.log(`   Meta Description: ${result.seoMeta.metaDescription}`);
    console.log(`   Keywords: ${result.seoMeta.keywords.join(', ')}`);
    console.log(`   URL Slug: ${result.seoMeta.slug}`);
    console.log('\n📄 Excerpt:');
    console.log(result.excerpt);
    
    // Extract the CTA type
    const ctaMatch = result.content.match(/## ([^#\n]+Apex Gas[^#\n]+)/);
    if (ctaMatch) {
      console.log('\n🎯 Call-to-Action:');
      console.log(`   ${ctaMatch[1]}`);
    }
    
    console.log('\n✨ Blog Structure:');
    // Count sections by ## headers
    const sections = result.content.match(/## /g);
    console.log(`   Total sections: ${sections ? sections.length : 0}`);
    
    // Extract section titles
    const sectionTitles = result.content.match(/## ([^\n]+)/g);
    if (sectionTitles) {
      console.log('   Sections:');
      sectionTitles.forEach((title, i) => {
        console.log(`     ${i + 1}. ${title.replace('## ', '')}`);
      });
    }
    
    console.log('\n📝 Next Steps:');
    console.log('   1. This blog would be saved to Firestore');
    console.log('   2. Images would be selected from Pexels');
    console.log('   3. Content would be posted to LinkedIn and Facebook');
    console.log('   4. Analytics would track performance');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

demoBlogGeneration();