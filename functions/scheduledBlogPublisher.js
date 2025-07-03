/* eslint-disable max-len */
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const admin = require("firebase-admin");
const axios = require("axios");

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Blog categories and their publishing days
const BLOG_SCHEDULE = {
  tuesday: "technology",
  thursday: "health-safety",
  saturday: "industry-insights",
};

/**
 * Scheduled blog publisher - runs 3 times per week
 * Tuesday, Thursday, Saturday at 10 AM EST
 * @param {Object} event - The scheduled event
 * @return {Object} Success status and blog ID
 */
exports.scheduledBlogPublisher = onSchedule({
  schedule: "0 10 * * 2,4,6", // 10 AM on Tue(2), Thu(4), Sat(6)
  timeZone: "America/New_York",
  memory: "1GiB",
  timeoutSeconds: 540,
}, async (event) => {
  logger.info("Starting scheduled blog publication");

  try {
    // Load API keys from Firestore
    const keysDoc = await db.collection("apiKeys").doc("Keys").get();
    if (!keysDoc.exists) {
      throw new Error("API keys not found in Firestore");
    }

    const apiKeys = keysDoc.data();
    const geminiApiKey = apiKeys.REACT_APP_GEMINI_API_KEY;
    const pexelsApiKey = apiKeys.PEXELS_API_KEY;

    if (!geminiApiKey || !pexelsApiKey) {
      throw new Error("Missing required API keys");
    }

    // Determine category based on day
    const dayOfWeek = new Date()
        .toLocaleDateString("en-US", {weekday: "long"})
        .toLowerCase();
    const category = BLOG_SCHEDULE[dayOfWeek] || "technology";

    logger.info(`Publishing ${category} blog for ${dayOfWeek}`);

    // Get unused topic from Firestore
    const topicsQuery = await db.collection("blogTopics")
        .where("category", "==", category)
        .where("used", "==", false)
        .orderBy("priority", "desc")
        .limit(1)
        .get();

    let topic;
    if (!topicsQuery.empty) {
      const topicDoc = topicsQuery.docs[0];
      topic = topicDoc.data().topic;

      // Mark topic as used
      await topicDoc.ref.update({
        used: true,
        usedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Generate a new topic if none available
      topic = await generateNewTopic(geminiApiKey, category);
    }

    logger.info(`Selected topic: ${topic}`);

    // Generate blog content
    const blogContent = await generateBlogContent( // eslint-disable-line max-len
        geminiApiKey, topic, category);

    // Select image from Pexels
    const imageData = await selectPexelsImage(pexelsApiKey, topic);

    // Create blog document
    const blogDoc = {
      title: blogContent.title,
      slug: blogContent.slug,
      excerpt: blogContent.excerpt,
      content: blogContent.content,
      markdownContent: blogContent.content,
      category: category,
      tags: blogContent.keywords.slice(0, 5),
      featuredImage: imageData,
      status: "published",
      author: {
        name: "Apex Gas Team",
        role: "Medical Equipment Specialists",
      },
      seo: {
        metaTitle: blogContent.seoTitle,
        metaDescription: blogContent.seoDescription,
        keywords: blogContent.keywords,
      },
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      readTime: Math.ceil(blogContent.wordCount / 200),
      metadata: {
        generatedBy: "scheduled-blog-publisher",
        scheduledRun: true,
        wordCount: blogContent.wordCount,
      },
    };

    // Save to Firestore
    const docRef = await db.collection("blogPosts").add(blogDoc);
    logger.info(`Blog saved with ID: ${docRef.id}`);

    // Post to social media
    await postToSocialMedia(apiKeys, blogDoc, docRef.id);

    // Log success
    await db.collection("blogAutomationLogs").add({
      type: "scheduled_publication",
      success: true,
      blogId: docRef.id,
      topic: topic,
      category: category,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info("Blog publication completed successfully");
    return {success: true, blogId: docRef.id};
  } catch (error) {
    logger.error("Blog publication failed:", error);

    // Log failure
    await db.collection("blogAutomationLogs").add({
      type: "scheduled_publication",
      success: false,
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    throw error;
  }
});

/**
 * Manual blog generation endpoint
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {void}
 */
exports.generateBlogManually = onRequest({
  cors: true,
  memory: "1GiB",
  timeoutSeconds: 300,
}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const {topic, category} = req.body;

  if (!topic || !category) {
    res.status(400).json({error: "Topic and category are required"});
    return;
  }

  try {
    // Similar logic to scheduled publisher but triggered manually
    const keysDoc = await db.collection("apiKeys").doc("Keys").get();
    const apiKeys = keysDoc.data();

    const blogContent = await generateBlogContent(
        apiKeys.REACT_APP_GEMINI_API_KEY,
        topic,
        category,
    );

    const imageData = await selectPexelsImage(apiKeys.PEXELS_API_KEY, topic);

    const blogDoc = {
      title: blogContent.title,
      slug: blogContent.slug,
      excerpt: blogContent.excerpt,
      content: blogContent.content,
      markdownContent: blogContent.content,
      category: category,
      tags: blogContent.keywords.slice(0, 5),
      featuredImage: imageData,
      status: "draft", // Manual blogs start as drafts
      author: {
        name: "Apex Gas Team",
        role: "Medical Equipment Specialists",
      },
      seo: {
        metaTitle: blogContent.seoTitle,
        metaDescription: blogContent.seoDescription,
        keywords: blogContent.keywords,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      readTime: Math.ceil(blogContent.wordCount / 200),
      metadata: {
        generatedBy: "manual-blog-generator",
        manualTrigger: true,
        wordCount: blogContent.wordCount,
      },
    };

    const docRef = await db.collection("blogPosts").add(blogDoc);

    res.json({
      success: true,
      blogId: docRef.id,
      title: blogContent.title,
      status: "draft",
    });
  } catch (error) {
    logger.error("Manual blog generation failed:", error);
    res.status(500).json({error: error.message});
  }
});

// Helper functions

/**
 * Generate a new topic using Gemini AI
 * @param {string} apiKey - The Gemini API key
 * @param {string} category - The blog category
 * @return {Promise<string>} The generated topic
 */
async function generateNewTopic(apiKey, category) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({model: "gemini-2.0-flash-exp"});

  const prompt = `Generate a specific, engaging blog topic for a medical X-ray gas supply company. // eslint-disable-line max-len
Category: ${category}
Focus: EOS X-ray systems, detector gas, medical imaging, healthcare safety
Requirements:
- Specific and actionable
- Relevant to healthcare facilities
- Include numbers or specifics when possible
- Maximum 15 words

Return only the topic title, nothing else.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

/**
 * Generate blog content using Gemini AI
 * @param {string} apiKey - The Gemini API key
 * @param {string} topic - The blog topic
 * @param {string} category - The blog category
 * @return {Promise<Object>} The generated blog content
 */
async function generateBlogContent(apiKey, topic, category) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({model: "gemini-2.0-flash-exp"});

  // Load blog configuration
  const blogConfig = require("./scripts/blog-automation-config");

  const prompt = blogConfig.geminiPromptTemplate(topic, category);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let content = response.text();

  // Remove markdown code block wrappers if present
  content = content.replace(/^```markdown\n?/, "").replace(/\n?```$/, "");

  // Generate SEO metadata
  const seoPrompt = `Based on this blog topic: "${topic}"
Generate SEO metadata in JSON format:
{
  "title": "SEO title (50-60 chars)",
  "seoTitle": "Meta title for SEO",
  "seoDescription": "Meta description (150-160 chars)",
  "excerpt": "2-3 sentence excerpt",
  "keywords": ["keyword1", "keyword2", ...],
  "slug": "url-friendly-slug"
}`;

  const seoResult = await model.generateContent(seoPrompt);
  const seoResponse = await seoResult.response;
  const seoData = JSON.parse(seoResponse.text());

  return {
    content: content,
    wordCount: content.split(" ").length,
    ...seoData,
  };
}

/**
 * Select an image from Pexels API
 * @param {string} apiKey - The Pexels API key
 * @param {string} topic - The blog topic
 * @return {Promise<Object>} The selected image data
 */
async function selectPexelsImage(apiKey, topic) {
  const searchQuery = "medical x-ray equipment technology";

  try {
    const response = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: apiKey,
      },
      params: {
        query: searchQuery,
        per_page: 10,
        orientation: "landscape",
      },
    });

    if (response.data.photos.length > 0) {
      // Check for unused images
      const usedImages = await db.collection("usedPexelsImages").get();
      const usedIds = usedImages.docs.map((doc) => doc.id);

      const unusedPhoto = response.data.photos.find(
          (photo) => !usedIds.includes(photo.id.toString()),
      );

      const selectedPhoto = unusedPhoto || response.data.photos[0];

      // Mark as used
      await db.collection("usedPexelsImages")
          .doc(selectedPhoto.id.toString())
          .set({
            pexelsId: selectedPhoto.id,
            photographer: selectedPhoto.photographer,
            pexelsUrl: selectedPhoto.url,
            imageUrl: selectedPhoto.src.large2x,
            usedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

      return {
        url: selectedPhoto.src.large2x,
        alt: `${topic} - Medical imaging equipment`,
        credit: `Photo by ${selectedPhoto.photographer} from Pexels`,
      };
    }
  } catch (error) {
    logger.error("Pexels image selection failed:", error);
  }

  // Fallback image
  return {
    url: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg",
    alt: "Medical X-ray equipment",
    credit: "Photo by Pexels",
  };
}

/**
 * Post blog to social media platforms
 * @param {Object} apiKeys - The API keys object
 * @param {Object} blogDoc - The blog document
 * @param {string} blogId - The blog ID
 * @return {Promise<void>}
 */
async function postToSocialMedia(apiKeys, blogDoc, blogId) {
  const blogUrl = `https://blog.apeximagegas.net/${blogDoc.slug}`;

  // LinkedIn post
  if (apiKeys.linkedinWebhookUrl) {
    try {
      const linkedinData = {
        commentary: `${blogDoc.title}\n\n${blogDoc.excerpt}\n\n` +
            `Read more: ${blogUrl}\n\n` +
            `${blogDoc.tags.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ")}`, // eslint-disable-line max-len
        visibility: "PUBLIC",
        link_url: blogUrl,
        link_title: blogDoc.title,
        link_description: blogDoc.excerpt,
      };

      await axios.post(apiKeys.linkedinWebhookUrl, linkedinData);
      logger.info("Posted to LinkedIn successfully");
    } catch (error) {
      logger.error("LinkedIn posting failed:", error);
    }
  }

  // Facebook post
  if (apiKeys.facebookWebhookUrl) {
    try {
      const facebookData = {
        message: `📚 New Blog Post!\n\n${blogDoc.title}\n\n` +
            `${blogDoc.excerpt}\n\n` +
            `Learn more about medical imaging and X-ray technology.`,
        link_url: blogUrl,
        link_name: blogDoc.title,
        link_caption: "Apex Image Gas Blog",
        link_description: blogDoc.excerpt,
      };

      await axios.post(apiKeys.facebookWebhookUrl, facebookData);
      logger.info("Posted to Facebook successfully");
    } catch (error) {
      logger.error("Facebook posting failed:", error);
    }
  }
}
