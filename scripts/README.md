# Apex Gas Blog Generation Scripts

This directory contains automated blog generation scripts adapted from GovTools Pro for Apex Gas, focusing on medical equipment, X-ray systems, and healthcare facility content.

## Key Differences from GovTools Pro

1. **API Key Management**: Uses Firestore for API keys instead of .env files
2. **Content Focus**: Medical equipment, healthcare compliance, and patient safety
3. **CTAs**: Customized for Apex Gas products and services
4. **Image Keywords**: Medical and healthcare-specific search terms
5. **SEO Optimization**: Healthcare facility and medical equipment keywords

## Setup

1. **Install Dependencies**:
   ```bash
   cd scripts
   npm install
   ```

2. **Firebase Configuration**:
   - Ensure `serviceAccountKey.json` exists in the project root
   - API keys should be stored in Firestore at `apiKeys/keys` document:
     ```javascript
     {
       "GEMINI_API_KEY": "your-gemini-api-key",
       "PEXELS_API_KEY": "your-pexels-api-key"
     }
     ```

## Scripts Overview

### 1. `blog-automation-config.js`
Configuration file containing:
- Blog structure templates
- CTA templates for different categories
- Image keyword generation logic
- Gemini prompt templates

### 2. `automated-blog-writer.js`
Generates blog content without publishing:
- Loads API keys from Firestore
- Generates content using Gemini AI
- Creates SEO metadata
- Validates content quality

### 3. `automated-blog-publisher.js`
Complete blog creation and publishing:
- Multi-stage research approach
- Pexels image integration
- Firebase Storage for images
- Automatic HTML conversion
- Saves to Firestore

### 4. `pexels-image-tracker.js`
Tracks used Pexels images to avoid duplicates:
- Stores used image IDs in Firestore
- Finds unused images from search results
- Maintains photographer credits

### 5. `test-blog-generation.js`
Test suite for blog generation:
- Sample topics for each category
- Interactive testing menu
- AI topic suggestions

## Usage

### Generate a Blog (Content Only)
```javascript
const AutomatedBlogWriter = require('./automated-blog-writer');

const writer = new AutomatedBlogWriter();
const blog = await writer.generateBlog(
  "Medical Gas System Compliance Guide",
  "medicalGasSystems"
);
```

### Publish a Complete Blog
```javascript
const AutomatedBlogPublisher = require('./automated-blog-publisher');

const publisher = new AutomatedBlogPublisher();
const result = await publisher.createAndPublishBlog(
  "Digital X-Ray ROI Analysis",
  "xrayTechnology",
  false // true for draft, false to publish
);
```

### Run Tests
```bash
npm test
```

## Blog Categories

1. **medicalGasSystems**: Medical gas equipment, compliance, safety
2. **xrayTechnology**: X-ray machines, imaging technology, radiation safety
3. **equipmentMaintenance**: Service, maintenance, lifecycle management
4. **general**: General healthcare equipment topics

## Blog Structure

Each blog includes:
- **Introduction** (150-200 words): Healthcare challenge hook
- **Main Content** (1000-1400 words): 3-5 sections with technical details
- **CTA** (200-300 words): Apex Gas specific call-to-action

## Image Processing

Images are:
- Sourced from Pexels with medical/healthcare queries
- Processed into 3 sizes (featured, thumbnail, grid)
- Uploaded to Firebase Storage
- Tracked to avoid duplicates

## SEO Features

- Optimized titles (50-60 characters)
- Meta descriptions (150-160 characters)
- Healthcare-specific keywords
- Medical terminology integration
- Compliance standards references

## Best Practices

1. **Topic Selection**: Focus on solving healthcare facility challenges
2. **Technical Accuracy**: Ensure medical information is correct
3. **Compliance References**: Include NFPA, FDA, Joint Commission standards
4. **CTAs**: Match CTA type to content category
5. **Images**: Use professional medical/healthcare imagery

## Troubleshooting

### API Key Issues
- Check Firestore `apiKeys/keys` document
- Ensure keys have correct field names
- Verify Firebase authentication

### Image Processing
- Pexels API key is optional but recommended
- Default images used if Pexels unavailable
- Check Firebase Storage bucket configuration

### Content Generation
- Gemini API key is required
- Uses `gemini-2.0-flash-exp` model
- Fallback to direct generation if research mode fails

## Examples

See `test-blog-generation.js` for complete examples of:
- Medical gas system topics
- X-ray equipment topics
- Maintenance and service topics
- General healthcare topics