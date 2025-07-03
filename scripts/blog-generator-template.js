#!/usr/bin/env node

/**
 * Blog Generator Template for Apex Gas
 * This template shows how to use Firestore keys instead of .env
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { initializeFirebase, loadApiKeys } = require('./lib/firebase-config');

class ApexGasBlogGenerator {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('🔧 Initializing blog generator...');
    
    // Initialize Firebase
    const { admin, db } = initializeFirebase();
    this.admin = admin;
    this.db = db;
    
    // Load API keys from Firestore
    const apiKeys = await loadApiKeys();
    
    // Initialize Gemini AI
    const geminiKey = apiKeys.REACT_APP_GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error('Gemini API key not found in Firestore');
    }
    
    this.genAI = new GoogleGenerativeAI(geminiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // Store other keys for later use
    this.pexelsApiKey = apiKeys.PEXELS_API_KEY;
    this.webhooks = {
      linkedin: apiKeys.linkedinWebhookUrl,
      facebook: apiKeys.facebookWebhookUrl
    };
    
    console.log('✅ Blog generator initialized with Firestore keys');
    this.initialized = true;
  }

  async generateBlog(topic, category) {
    await this.initialize();
    
    console.log(`\n📝 Generating blog about: ${topic}`);
    console.log(`📁 Category: ${category}`);
    
    // This is where we'll add the blog generation logic
    // For now, just show that we have access to the AI model
    
    const prompt = `Write a brief outline for a blog post about "${topic}" 
    for a medical X-ray gas supply company. Focus on ${category} aspects.`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      console.log('\n📋 Blog outline:', response.text());
      
      return {
        success: true,
        topic,
        category,
        outline: response.text()
      };
    } catch (error) {
      console.error('❌ Error generating blog:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Test the template
async function testBlogGenerator() {
  const generator = new ApexGasBlogGenerator();
  
  console.log('🧪 Testing blog generator with Firestore keys\n');
  
  await generator.generateBlog(
    'X-ray detector gas purity standards',
    'technology'
  );
}

// Run if called directly
if (require.main === module) {
  testBlogGenerator().catch(console.error);
}

module.exports = ApexGasBlogGenerator;