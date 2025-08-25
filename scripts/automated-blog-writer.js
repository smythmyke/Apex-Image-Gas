const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const blogConfig = require('./blog-automation-config');
const path = require('path');
const { convertMarkdownToHTML } = require('./lib/markdown-converter');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    throw error;
  }
}

const db = admin.firestore();

class AutomatedBlogWriter {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.apiKeyLoaded = false;
  }

  /**
   * Initialize Gemini AI with API key from Firestore
   */
  async initializeGemini() {
    // DISABLED TO REDUCE GEMINI API COSTS
    // To re-enable: Remove this throw statement
    throw new Error('Gemini API is currently disabled to reduce costs. Remove this throw statement in initializeGemini() to re-enable.');
    
    if (this.apiKeyLoaded) return;

    try {
      console.log('🔑 Loading API keys from Firestore...');
      const keysDoc = await db.collection('apiKeys').doc('Keys').get();
      
      if (!keysDoc.exists) {
        throw new Error('API keys document not found in Firestore');
      }

      const keys = keysDoc.data();
      const geminiApiKey = keys.REACT_APP_GEMINI_API_KEY || keys.GEMINI_API_KEY;

      if (!geminiApiKey) {
        throw new Error('Gemini API key not found in Firestore');
      }

      this.genAI = new GoogleGenerativeAI(geminiApiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      this.apiKeyLoaded = true;
      
      console.log('✅ Gemini AI initialized with key from Firestore');
    } catch (error) {
      console.error('❌ Error loading API key from Firestore:', error);
      throw error;
    }
  }

  /**
   * Generate a complete blog post with Apex Gas integration
   */
  async generateBlog(topic, category = 'general') {
    console.log(`\n📝 Generating blog post about: ${topic}\n`);

    try {
      // Initialize Gemini if not already done
      await this.initializeGemini();

      // Step 1: Generate the main blog content
      const mainContent = await this.generateMainContent(topic, category);
      
      // Step 2: Generate SEO metadata
      const metadata = await this.generateSEOMetadata(topic, mainContent);
      
      // Step 3: Select appropriate CTA based on category
      const cta = this.selectCTA(category);
      
      // Step 4: Generate image keywords
      const imageKeywords = blogConfig.imageKeywordGenerator(topic);
      
      // Step 5: Combine everything
      const completeBlog = this.assembleBlog(mainContent, cta, metadata);
      
      // Step 6: Validate blog quality
      const validation = await this.validateBlog(completeBlog);
      
      return {
        title: metadata.title,
        content: completeBlog,
        excerpt: metadata.excerpt,
        category: category,
        seoMeta: metadata,
        imageKeywords: imageKeywords,
        wordCount: this.countWords(completeBlog),
        validation: validation,
        author: 'Apex Gas Team',
        publishDate: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error generating blog:', error);
      throw error;
    }
  }

  /**
   * Generate main blog content without CTA
   */
  async generateMainContent(topic, category) {
    const prompt = blogConfig.geminiPromptTemplate(topic, category);
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    // Remove markdown code block wrappers if present
    content = content.replace(/^```markdown\n?/, '').replace(/\n?```$/, '');
    
    return content;
  }

  /**
   * Generate SEO metadata for the blog
   */
  async generateSEOMetadata(topic, content) {
    const prompt = `
Based on this blog topic: "${topic}"
And this content preview: ${content.substring(0, 500)}...

Generate SEO metadata in JSON format for a medical equipment company blog:
{
  "title": "SEO-optimized title (50-60 characters)",
  "metaDescription": "Compelling meta description (150-160 characters)",
  "excerpt": "2-3 sentence blog excerpt for previews",
  "keywords": ["primary keyword", "medical equipment keywords", "healthcare keywords"],
  "slug": "url-friendly-slug"
}
    `;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const cleanedText = response.text().replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      // Fallback metadata
      return {
        title: topic,
        metaDescription: `Learn about ${topic} in healthcare facilities. Expert insights on medical equipment, safety standards, and best practices from Apex Gas.`,
        excerpt: `Discover essential information about ${topic}. This comprehensive guide provides technical insights and practical solutions for healthcare professionals.`,
        keywords: [...topic.toLowerCase().split(' '), 'medical equipment', 'healthcare', 'apex gas'],
        slug: topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
    }
  }

  /**
   * Select appropriate CTA based on category
   */
  selectCTA(category) {
    const ctaMap = {
      medicalGasSystems: blogConfig.ctaTemplates.medicalGasRelated,
      xrayTechnology: blogConfig.ctaTemplates.xrayEquipmentRelated,
      equipmentMaintenance: blogConfig.ctaTemplates.maintenanceRelated,
      general: blogConfig.ctaTemplates.generalPurpose
    };
    
    return ctaMap[category] || blogConfig.ctaTemplates.generalPurpose;
  }

  /**
   * Assemble the complete blog with CTA
   */
  assembleBlog(mainContent, cta, metadata) {
    // Ensure proper spacing between content and CTA
    return `${mainContent.trim()}\n\n---\n${cta.trim()}`;
  }

  /**
   * Validate blog quality and structure
   */
  async validateBlog(content) {
    const wordCount = this.countWords(content);
    const validation = {
      wordCount: wordCount,
      optimal: wordCount >= blogConfig.length.minimum && wordCount <= blogConfig.length.maximum,
      hasTitle: content.includes('# '),
      hasSubheadings: (content.match(/## /g) || []).length >= 3,
      hasBulletPoints: content.includes('- ') || content.includes('* '),
      hasCTA: content.includes('Apex Gas'),
      hasMedicalTerms: /medical|healthcare|patient|safety|compliance|FDA|NFPA/i.test(content),
      issues: []
    };
    
    if (wordCount < blogConfig.length.minimum) {
      validation.issues.push(`Blog is too short (${wordCount} words, minimum ${blogConfig.length.minimum})`);
    }
    if (wordCount > blogConfig.length.maximum) {
      validation.issues.push(`Blog is too long (${wordCount} words, maximum ${blogConfig.length.maximum})`);
    }
    if (!validation.hasSubheadings) {
      validation.issues.push('Blog needs more subheadings for better structure');
    }
    if (!validation.hasCTA) {
      validation.issues.push('Missing Apex Gas call-to-action');
    }
    if (!validation.hasMedicalTerms) {
      validation.issues.push('Content should include more medical/healthcare terminology');
    }
    
    validation.score = validation.issues.length === 0 ? 100 : 100 - (validation.issues.length * 20);
    
    return validation;
  }

  /**
   * Count words in content
   */
  countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  /**
   * Save blog to Firestore
   */
  async saveBlog(blogData) {
    try {
      const docRef = await db.collection('blogs').add({
        ...blogData,
        status: 'draft',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Blog saved with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error saving blog:', error);
      throw error;
    }
  }

  /**
   * Generate sample blog for testing
   */
  async generateSampleBlog() {
    const sampleTopics = [
      { topic: 'Medical Gas System Compliance: NFPA 99 Requirements Explained', category: 'medicalGasSystems' },
      { topic: 'Digital X-Ray vs Traditional: ROI Analysis for Healthcare Facilities', category: 'xrayTechnology' },
      { topic: 'Preventive Maintenance Schedules for Medical Equipment', category: 'equipmentMaintenance' },
      { topic: 'Essential Medical Equipment for New Healthcare Facilities', category: 'general' }
    ];
    
    // Select random topic
    const selected = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];
    
    console.log(`\n🎯 Generating sample blog:\n`);
    console.log(`Topic: ${selected.topic}`);
    console.log(`Category: ${selected.category}\n`);
    
    const blog = await this.generateBlog(selected.topic, selected.category);
    
    // Display results
    console.log('\n📊 Blog Generation Results:');
    console.log('------------------------');
    console.log(`Title: ${blog.title}`);
    console.log(`Word Count: ${blog.wordCount}`);
    console.log(`Quality Score: ${blog.validation.score}/100`);
    console.log(`SEO Keywords: ${blog.seoMeta.keywords.join(', ')}`);
    console.log(`Image Keywords: ${blog.imageKeywords.primary.join(', ')}`);
    
    if (blog.validation.issues.length > 0) {
      console.log('\n⚠️ Issues:');
      blog.validation.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    // Save sample to file
    const fs = require('fs').promises;
    const filename = `sample-blog-${new Date().toISOString().slice(0, 10)}.md`;
    
    // Create directory if it doesn't exist
    const resultsDir = path.join(__dirname, 'blog-results');
    try {
      await fs.mkdir(resultsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    await fs.writeFile(
      path.join(resultsDir, filename),
      blog.content
    );
    
    console.log(`\n✅ Sample blog saved to: scripts/blog-results/${filename}\n`);
    
    return blog;
  }
}

// Main execution
async function main() {
  try {
    const writer = new AutomatedBlogWriter();
    
    // Generate a sample blog
    const blog = await writer.generateSampleBlog();
    
    // Optionally save to Firestore
    console.log('\n💾 Would you like to save this blog to Firestore? (uncomment to enable)');
    // await writer.saveBlog(blog);
    
  } catch (error) {
    console.error('Failed to generate blog:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = AutomatedBlogWriter;