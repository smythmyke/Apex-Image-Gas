const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const blogConfig = require('./blog-automation-config');
const imageTracker = require('./pexels-image-tracker');
const { convertMarkdownToHTML } = require('./lib/markdown-converter');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  console.log('🔥 Initializing Firebase Admin...');
  
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    });
    console.log('✅ Firebase Admin initialized successfully');
    console.log('📍 Project ID:', serviceAccount.project_id);
    console.log('☁️ Storage Bucket:', `${serviceAccount.project_id}.appspot.com`);
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
} else {
  console.log('✅ Firebase Admin already initialized');
}

const db = admin.firestore();
console.log('📊 Firestore instance created');

class AutomatedBlogPublisher {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.pexelsApiKey = null;
    this.geminiApiKey = null;
    this.apiKeysLoaded = false;

    // Blog image directories
    this.imageDir = path.join(__dirname, '..', 'public', 'images', 'blog');
    this.altImageDir = path.join(__dirname, '..', 'public', 'blog-images');
  }

  /**
   * Load API keys from Firestore
   */
  async loadApiKeys() {
    if (this.apiKeysLoaded) return;

    try {
      console.log('🔑 Loading API keys from Firestore...');
      const keysDoc = await db.collection('apiKeys').doc('Keys').get();
      
      if (keysDoc.exists) {
        const keys = keysDoc.data();
        
        // Load Gemini API key
        this.geminiApiKey = keys.REACT_APP_GEMINI_API_KEY || keys.GEMINI_API_KEY;
        if (this.geminiApiKey) {
          this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
          this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
          console.log('✅ Gemini API key loaded from Firestore');
        } else {
          throw new Error('Gemini API key not found in Firestore');
        }

        // Load Pexels API key
        this.pexelsApiKey = keys.PEXELS_API_KEY || keys.pexelsApiKey;
        if (this.pexelsApiKey) {
          console.log('✅ Pexels API key loaded from Firestore');
        } else {
          console.warn('⚠️ Pexels API key not found in Firestore - images will not be added');
        }

        this.apiKeysLoaded = true;
      } else {
        throw new Error('API keys document not found in Firestore');
      }
    } catch (error) {
      console.error('❌ Error loading API keys from Firestore:', error);
      throw error;
    }
  }

  /**
   * Main function to create and publish a blog post
   */
  async createAndPublishBlog(topic, category = 'general', isDraft = false) {
    console.log(`\n🚀 Starting automated blog creation process...`);
    console.log(`📝 Topic: ${topic}`);
    console.log(`📁 Category: ${category}`);
    console.log(`📄 Status: ${isDraft ? 'Draft' : 'Published'}\n`);

    try {
      // Load API keys from Firestore first
      await this.loadApiKeys();
      
      // Step 1: Generate blog content
      console.log('1️⃣ Generating blog content...');
      const blogContent = await this.generateBlogContent(topic, category);
      
      // Step 2: Generate and process images
      console.log('\n2️⃣ Finding and processing images...');
      const imageData = await this.processImages(blogContent.title, blogContent.content, blogContent.imageKeywords);
      
      // Step 3: Convert markdown to HTML
      console.log('\n3️⃣ Converting content to HTML...');
      const htmlContent = convertMarkdownToHTML(blogContent.content);
      
      // Step 4: Create blog post object
      console.log('\n4️⃣ Creating blog post object...');
      const blogPost = this.createBlogPost(blogContent, htmlContent, imageData, category, isDraft);
      
      // Step 5: Save to Firestore
      console.log('\n5️⃣ Saving to Firestore...');
      const docId = await this.saveBlogPost(blogPost);
      
      // Step 6: Mark Pexels image as used
      if (imageData.pexelsImage) {
        console.log('\n6️⃣ Marking Pexels image as used...');
        await imageTracker.markImageAsUsed(imageData.pexelsImage, docId);
      }
      
      console.log(`\n✅ Blog post ${isDraft ? 'drafted' : 'published'} successfully!`);
      console.log(`📍 Document ID: ${docId}`);
      console.log(`🔗 Slug: ${blogPost.slug}`);
      console.log(`🌐 URL: https://blog.apeximagegas.net/${blogPost.slug}\n`);
      
      return { success: true, docId, blogPost };
      
    } catch (error) {
      console.error('❌ Error creating blog post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate blog content using multi-stage research approach (Deep Mode)
   */
  async generateBlogContent(topic, category) {
    console.log('🔬 Using Deep Research Mode for medical equipment blog generation...');
    
    try {
      // Create a chat session for multi-turn research
      const chat = this.model.startChat({ history: [] });
      
      // Stage 1: Identify research areas
      console.log('  📋 Stage 1: Identifying medical/technical research areas...');
      let result = await chat.sendMessage(
        `I need to write a comprehensive blog post about "${topic}" for Apex Gas, a medical equipment supplier specializing in medical gas systems and X-ray equipment. 
        What are the main areas I should research for this topic? List 5-7 key areas that would provide valuable insights for healthcare facilities, focusing on:
        - Technical specifications and standards
        - Safety and compliance requirements
        - Operational considerations
        - Cost and ROI factors
        - Patient care implications`
      );
      const researchAreas = result.response.text();
      console.log('  ✅ Research areas identified');
      
      // Stage 2: Deep dive research
      console.log('  🔍 Stage 2: Conducting deep medical/technical research...');
      result = await chat.sendMessage(
        `Now provide detailed research on each of these areas for "${topic}", including:
        - Current medical standards and regulations (FDA, NFPA 99, Joint Commission)
        - Technical specifications and requirements
        - Safety protocols and compliance measures
        - Real-world healthcare facility scenarios
        - Equipment lifecycle and maintenance considerations
        - Patient safety and care quality impacts
        - Cost analysis and budget considerations
        
        Make sure all information is current and relevant to healthcare facilities and medical equipment.`
      );
      const detailedResearch = result.response.text();
      console.log('  ✅ Detailed research completed');
      
      // Stage 3: Create blog structure
      console.log('  📐 Stage 3: Creating blog structure...');
      result = await chat.sendMessage(
        `Based on this research, create a detailed blog outline with:
        - An SEO-optimized title (50-60 characters) incorporating medical/healthcare terms
        - Compelling introduction addressing healthcare challenges (150-200 words)
        - 4-5 main sections with technical subpoints
        - Target word count for each section
        - A natural conclusion (no CTA needed)
        
        Total target: 1,500-1,800 words
        Tone: Professional yet accessible for healthcare professionals`
      );
      const blogStructure = result.response.text();
      console.log('  ✅ Blog structure created');
      
      // Stage 4: Generate the complete blog
      console.log('  ✍️ Stage 4: Writing the medical equipment blog post...');
      result = await chat.sendMessage(
        `Now write the complete blog post following this structure. 
        
        Important guidelines:
        - Incorporate all medical/technical research findings naturally
        - Use proper medical terminology and equipment specifications
        - Include relevant standards (NFPA 99, FDA, Joint Commission) where applicable
        - Provide actionable insights for healthcare facility managers
        - Address both clinical and operational perspectives
        - Format in markdown with proper headings
        - Do NOT include a call-to-action (it will be added separately)
        - Target length: 1,500-1,800 words
        
        Write the blog now.`
      );
      const mainContent = result.response.text();
      console.log('  ✅ Blog content generated');
      
      // Generate SEO metadata based on the research
      const metadata = await this.generateSEOMetadataFromResearch(topic, mainContent, detailedResearch);
      
      // Select appropriate CTA
      const cta = this.selectCTA(category);
      
      // Combine content with CTA
      const fullContent = `${mainContent.trim()}\n\n---\n${cta.trim()}`;
      
      // Generate image keywords based on research
      const imageKeywords = this.generateImageKeywordsFromResearch(topic, researchAreas);
      
      const wordCount = this.countWords(fullContent);
      console.log(`  📊 Final word count: ${wordCount}`);
      
      return {
        title: metadata.title,
        content: fullContent,
        excerpt: metadata.excerpt,
        seoMeta: metadata,
        imageKeywords: imageKeywords,
        wordCount: wordCount,
        research: {
          areas: researchAreas,
          details: detailedResearch.substring(0, 500) + '...' // Store snippet for reference
        }
      };
      
    } catch (error) {
      console.error('❌ Error in deep research blog generation:', error);
      console.log('⚠️ Falling back to direct generation method...');
      
      // Fallback to original direct method
      const prompt = blogConfig.geminiPromptTemplate(topic, category);
      const result = await this.model.generateContent(prompt);
      const mainContent = result.response.text();
      
      const metadata = await this.generateSEOMetadata(topic, mainContent);
      const cta = this.selectCTA(category);
      const fullContent = `${mainContent.trim()}\n\n---\n${cta.trim()}`;
      const imageKeywords = blogConfig.imageKeywordGenerator(topic);
      
      return {
        title: metadata.title,
        content: fullContent,
        excerpt: metadata.excerpt,
        seoMeta: metadata,
        imageKeywords: imageKeywords,
        wordCount: this.countWords(fullContent)
      };
    }
  }

  /**
   * Generate SEO metadata from research data
   */
  async generateSEOMetadataFromResearch(topic, content, research) {
    const prompt = `
Based on this medical equipment blog topic: "${topic}"
And this technical research data: ${research.substring(0, 1000)}...
And this content preview: ${content.substring(0, 500)}...

Generate SEO metadata in JSON format that incorporates medical/healthcare keywords:
{
  "title": "SEO-optimized title with medical terms (50-60 characters)",
  "metaDescription": "Compelling meta description for healthcare professionals (150-160 characters)",
  "excerpt": "2-3 sentence blog excerpt highlighting medical/technical insights",
  "keywords": ["primary medical keyword", "healthcare keywords", "equipment terms", "compliance keywords"],
  "slug": "url-friendly-slug"
}
    `;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const cleanedText = response.text().replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      // Fallback to original method
      return this.generateSEOMetadata(topic, content);
    }
  }

  /**
   * Generate image keywords from research areas
   */
  generateImageKeywordsFromResearch(topic, researchAreas) {
    // Extract medical/healthcare concepts from research areas
    const concepts = researchAreas.toLowerCase()
      .split(/[\n,.]/)
      .map(line => line.trim())
      .filter(line => line.length > 10)
      .slice(0, 3)
      .map(line => line.split(' ').slice(0, 3).join(' '));
    
    const baseKeywords = blogConfig.imageKeywordGenerator(topic);
    
    // Add medical-specific terms
    const medicalTerms = ['medical equipment', 'healthcare facility', 'hospital'];
    
    return {
      primary: [...new Set([...concepts, ...baseKeywords.primary, ...medicalTerms])].slice(0, 5),
      secondary: baseKeywords.secondary,
      style: ['medical', 'healthcare', 'professional', 'modern', 'clean']
    };
  }

  /**
   * Generate SEO metadata
   */
  async generateSEOMetadata(topic, content) {
    const prompt = `
Based on this medical equipment blog topic: "${topic}"
And this content preview: ${content.substring(0, 500)}...

Generate SEO metadata in JSON format for a medical equipment company:
{
  "title": "SEO-optimized title (50-60 characters)",
  "metaDescription": "Compelling meta description for healthcare professionals (150-160 characters)",
  "excerpt": "2-3 sentence blog excerpt for previews",
  "keywords": ["primary keyword", "medical keywords", "equipment keywords"],
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
      const slug = this.generateSlug(topic);
      return {
        title: topic,
        metaDescription: `Learn about ${topic} in healthcare facilities. Expert insights on medical equipment and compliance from Apex Gas.`,
        excerpt: `Discover essential information about ${topic}. Expert guidance for healthcare professionals from Apex Gas.`,
        keywords: [...topic.toLowerCase().split(' ').filter(word => word.length > 3), 'medical equipment', 'healthcare'],
        slug: slug
      };
    }
  }

  /**
   * Process images - find, download, and resize
   */
  async processImages(title, content, imageKeywords) {
    if (!this.pexelsApiKey) {
      console.log('⚠️ Skipping image processing - no Pexels API key');
      return this.getDefaultImages();
    }

    try {
      // Try primary keywords first (medical/healthcare focused)
      let searchQuery = imageKeywords.primary.join(' ') || 'medical equipment healthcare';
      let selectedImage = await this.findUnusedPexelsImage(searchQuery);
      
      // If no unused images with primary keywords, try secondary
      if (!selectedImage && imageKeywords.secondary) {
        console.log('🔄 Trying secondary keywords...');
        searchQuery = imageKeywords.secondary.join(' ');
        selectedImage = await this.findUnusedPexelsImage(searchQuery);
      }
      
      // If still no unused images, try medical-specific searches
      if (!selectedImage) {
        console.log('🔄 Trying medical-specific searches...');
        const medicalQueries = [
          'medical equipment',
          'hospital equipment',
          'healthcare technology',
          'medical devices',
          'x-ray machine',
          'medical gas system',
          'healthcare facility',
          'medical professional equipment'
        ];
        
        for (const medicalQuery of medicalQueries) {
          selectedImage = await this.findUnusedPexelsImage(medicalQuery);
          if (selectedImage) break;
        }
      }
      
      if (!selectedImage) {
        console.log('⚠️ No unused images found, using defaults');
        return this.getDefaultImages();
      }

      const slug = this.generateSlug(title);
      
      // Download and process image
      const processedImages = await this.downloadAndProcessImage(selectedImage, slug);
      
      // Mark image as used - we'll do this after the blog is saved
      processedImages.pexelsImage = selectedImage;
      
      return processedImages;
      
    } catch (error) {
      console.error('Error processing images:', error);
      return this.getDefaultImages();
    }
  }

  /**
   * Search Pexels for images
   */
  async searchPexelsImages(query, page = 1) {
    const perPage = 10; // Get more results to have better selection
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.pexelsApiKey
        }
      });
      
      // Add search query to each photo for tracking
      response.data.photos.forEach(photo => {
        photo.searchQuery = query;
      });
      
      return response.data.photos;
    } catch (error) {
      console.error('Pexels API error:', error.message);
      return [];
    }
  }

  /**
   * Find an unused image from Pexels
   */
  async findUnusedPexelsImage(query, maxPages = 5) {
    console.log(`🔍 Searching for unused image with query: "${query}"`);
    
    for (let page = 1; page <= maxPages; page++) {
      console.log(`  📄 Checking page ${page}...`);
      
      const images = await this.searchPexelsImages(query, page);
      if (!images || images.length === 0) {
        console.log(`  ❌ No images found on page ${page}`);
        break;
      }
      
      // Check each image to see if it's been used
      for (const image of images) {
        const isUsed = await imageTracker.isImageUsed(image.id);
        if (!isUsed) {
          console.log(`  ✅ Found unused image: ${image.id} by ${image.photographer}`);
          return image;
        }
      }
      
      console.log(`  ⚠️ All ${images.length} images on page ${page} have been used`);
    }
    
    console.log('  ❌ No unused images found in search results');
    return null;
  }

  /**
   * Download and process image into multiple sizes
   */
  async downloadAndProcessImage(pexelsImage, slug) {
    const imageUrl = pexelsImage.src.large2x || pexelsImage.src.large;
    
    // Download image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    // Initialize Storage bucket if not already done
    if (!this.storageBucket) {
      // Get service account for project ID
      const serviceAccount = require('../serviceAccountKey.json');
      this.storageBucket = admin.storage().bucket(`${serviceAccount.project_id}.appspot.com`);
    }
    
    // Process into different sizes
    const sizes = {
      featured: { width: 1200, height: 630, suffix: '-featured' },
      thumbnail: { width: 400, height: 300, suffix: '-thumbnail' },
      grid: { width: 600, height: 400, suffix: '-grid' }
    };
    
    const imagePaths = {};
    
    for (const [key, config] of Object.entries(sizes)) {
      const filename = `${slug}${config.suffix}.jpg`;
      
      // Process image
      const processedBuffer = await sharp(buffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // Upload to Firebase Storage
      const file = this.storageBucket.file(`blog-images/${filename}`);
      
      await file.save(processedBuffer, {
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            photographer: pexelsImage.photographer,
            source: 'Pexels',
            pexelsId: pexelsImage.id.toString()
          }
        }
      });
      
      // Make it public
      await file.makePublic();
      
      imagePaths[key] = `/images/blog/${filename}`;
      console.log(`✅ Created and uploaded ${key} image: ${filename}`);
    }
    
    return {
      featuredImage: imagePaths.featured,
      thumbnailImage: imagePaths.thumbnail,
      gridImage: imagePaths.grid,
      photographer: pexelsImage.photographer,
      pexelsUrl: pexelsImage.url
    };
  }


  /**
   * Create blog post object
   */
  createBlogPost(blogContent, htmlContent, imageData, category, isDraft) {
    const now = admin.firestore.Timestamp.now();
    const slug = blogContent.seoMeta.slug || this.generateSlug(blogContent.title);
    
    return {
      title: blogContent.title,
      slug: slug,
      excerpt: blogContent.excerpt,
      content: htmlContent,
      category: category,
      tags: blogContent.seoMeta.keywords || [],
      featuredImage: imageData.featuredImage,
      thumbnailImage: imageData.thumbnailImage,
      gridImage: imageData.gridImage,
      status: isDraft ? 'draft' : 'published',
      author: {
        id: 'apex-gas-team',
        name: 'Apex Gas Team',
        avatar: '/images/team/apex-team.jpg',
        bio: 'Medical equipment experts helping healthcare facilities operate safely and efficiently.'
      },
      readTime: Math.ceil(blogContent.wordCount / 200), // Average reading speed
      views: 0,
      publishedAt: isDraft ? null : now,
      createdAt: now,
      updatedAt: now,
      seo: {
        metaTitle: blogContent.seoMeta.title,
        metaDescription: blogContent.seoMeta.metaDescription,
        keywords: blogContent.seoMeta.keywords
      },
      metadata: {
        generatedBy: 'automated-blog-publisher',
        wordCount: blogContent.wordCount,
        imageCredit: imageData.photographer ? {
          photographer: imageData.photographer,
          source: 'Pexels',
          url: imageData.pexelsUrl
        } : null,
        research: blogContent.research || null
      }
    };
  }

  /**
   * Save blog post to Firestore
   */
  async saveBlogPost(blogPost) {
    try {
      console.log('📤 Attempting to save to Firestore...');
      console.log('📊 Blog post size:', JSON.stringify(blogPost).length, 'bytes');
      
      // Clean up any potential undefined values
      const cleanBlogPost = JSON.parse(JSON.stringify(blogPost));
      
      const docRef = await db.collection('blogPosts').add(cleanBlogPost);
      
      console.log('✅ Successfully saved to Firestore with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error saving to Firestore:', error);
      throw error;
    }
  }

  /**
   * Select appropriate CTA based on category
   */
  selectCTA(category) {
    const categoryMap = {
      'medicalGasSystems': 'medicalGasRelated',
      'xrayTechnology': 'xrayEquipmentRelated',
      'equipmentMaintenance': 'maintenanceRelated',
      'general': 'generalPurpose'
    };
    
    const ctaType = categoryMap[category] || 'generalPurpose';
    return blogConfig.ctaTemplates[ctaType];
  }

  /**
   * Generate URL-friendly slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  }

  /**
   * Count words in text
   */
  countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  /**
   * Get default images if Pexels fails
   */
  getDefaultImages() {
    return {
      featuredImage: '/images/blog/default-featured.jpg',
      thumbnailImage: '/images/blog/default-thumbnail.jpg',
      gridImage: '/images/blog/default-grid.jpg'
    };
  }

  /**
   * Generate topic based on medical equipment trends
   */
  async generateTopic() {
    // Ensure API keys are loaded
    if (!this.apiKeysLoaded) {
      await this.loadApiKeys();
    }
    
    const prompt = `
Analyze current trends in medical equipment and healthcare technology to suggest a blog topic that would be valuable for healthcare facilities.

Consider:
1. Current medical technology advancements
2. Regulatory changes (FDA, NFPA, Joint Commission)
3. Healthcare facility operational challenges
4. Patient safety improvements
5. Equipment maintenance and lifecycle management
6. Budget and ROI considerations

Provide:
{
  "topic": "Specific medical equipment blog topic",
  "category": "medicalGasSystems | xrayTechnology | equipmentMaintenance | general",
  "rationale": "Why this topic is timely and valuable for healthcare facilities",
  "keywords": ["relevant", "medical", "equipment", "terms"]
}

Format as JSON.
    `;
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const cleanedText = response.text().replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      // Fallback topic
      return {
        topic: "Essential Medical Gas System Safety Checks for Healthcare Facilities",
        category: "medicalGasSystems",
        rationale: "Critical safety content that helps maintain compliance",
        keywords: ["medical gas", "safety", "compliance", "healthcare"]
      };
    }
  }
}

// Test function
async function testBlogCreation() {
  const publisher = new AutomatedBlogPublisher();
  
  // Test with a specific medical topic
  const result = await publisher.createAndPublishBlog(
    "Understanding Digital X-Ray ROI: Cost Analysis for Healthcare Facilities",
    "xrayTechnology",
    true // Save as draft for testing
  );
  
  console.log('\nTest Result:', result);
}

// Run test if called directly
if (require.main === module) {
  testBlogCreation().catch(console.error);
}

module.exports = AutomatedBlogPublisher;