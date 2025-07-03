#!/usr/bin/env node

/**
 * Simple non-interactive blog generation test
 */

const AutomatedBlogWriter = require('./automated-blog-writer');

async function testSimpleBlog() {
  console.log('🧪 Testing Apex Gas Blog Generation\n');
  
  const writer = new AutomatedBlogWriter();
  
  const topic = "Understanding EOS X-ray detector gas requirements";
  const category = "technology";
  
  console.log(`📝 Generating blog about: ${topic}`);
  console.log(`📁 Category: ${category}\n`);
  
  try {
    const result = await writer.generateBlog(topic, category);
    
    console.log('\n✅ Blog generated successfully!');
    console.log('\n📊 Results:');
    console.log(`   Title: ${result.title}`);
    console.log(`   Word Count: ${result.wordCount}`);
    console.log(`   Category: ${result.category}`);
    console.log(`   SEO Score: ${result.validation.score}/10`);
    console.log(`   SEO Title: ${result.seoMeta.title}`);
    console.log(`   Keywords: ${result.seoMeta.keywords.join(', ')}`);
    console.log('\n📄 Excerpt:');
    console.log(result.excerpt);
    
    // Show first 500 characters of content
    console.log('\n📝 Content Preview:');
    console.log(result.content.substring(0, 500) + '...\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSimpleBlog();