#!/usr/bin/env node

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

async function checkBlogImages() {
  try {
    console.log('🔍 Checking blog images and duplicate prevention system...\n');
    
    // 1. Check usedPexelsImages collection
    console.log('=== USED PEXELS IMAGES COLLECTION ===');
    const usedImagesSnapshot = await db.collection('usedPexelsImages').get();
    console.log(`Total images marked as used: ${usedImagesSnapshot.size}`);
    
    const usedImageIds = new Set();
    const imagesByBlog = {};
    
    usedImagesSnapshot.forEach(doc => {
      const data = doc.data();
      usedImageIds.add(doc.id);
      
      if (data.usedInBlog) {
        if (!imagesByBlog[data.usedInBlog]) {
          imagesByBlog[data.usedInBlog] = [];
        }
        imagesByBlog[data.usedInBlog].push({
          pexelsId: doc.id,
          photographer: data.photographer,
          usedAt: data.usedAt?.toDate?.() || 'Unknown'
        });
      }
      
      console.log(`  - Pexels ID: ${doc.id}, Photographer: ${data.photographer}, Used in: ${data.usedInBlog || 'Unknown'}`);
    });
    
    // 2. Check all blog posts
    console.log('\n=== BLOG POSTS ===');
    const blogsSnapshot = await db.collection('blogPosts').get();
    console.log(`Total blog posts: ${blogsSnapshot.size}`);
    
    const imageUsageMap = {};
    const duplicateImages = [];
    
    blogsSnapshot.forEach(doc => {
      const data = doc.data();
      const blogId = doc.id;
      
      console.log(`\n📝 Blog: ${data.title || 'Untitled'} (ID: ${blogId})`);
      console.log(`  - Status: ${data.status}`);
      console.log(`  - Category: ${data.category}`);
      console.log(`  - Published: ${data.publishedAt?.toDate?.() || 'Not published'}`);
      
      if (data.featuredImage) {
        const imageUrl = data.featuredImage.url;
        const imageCredit = data.featuredImage.credit;
        
        console.log(`  - Featured Image: ${imageUrl ? imageUrl.substring(0, 50) + '...' : 'None'}`);
        console.log(`  - Image Credit: ${imageCredit || 'None'}`);
        
        // Extract Pexels ID from URL if possible
        const pexelsIdMatch = imageUrl?.match(/pexels-photo-(\d+)/);
        if (pexelsIdMatch) {
          const pexelsId = pexelsIdMatch[1];
          console.log(`  - Extracted Pexels ID: ${pexelsId}`);
          
          // Check if this image is used in multiple blogs
          if (!imageUsageMap[pexelsId]) {
            imageUsageMap[pexelsId] = [];
          }
          imageUsageMap[pexelsId].push({
            blogId,
            title: data.title,
            publishedAt: data.publishedAt?.toDate?.()
          });
          
          if (imageUsageMap[pexelsId].length > 1) {
            duplicateImages.push(pexelsId);
          }
        }
      } else {
        console.log(`  - No featured image`);
      }
    });
    
    // 3. Report duplicates
    console.log('\n=== DUPLICATE IMAGE ANALYSIS ===');
    if (duplicateImages.length > 0) {
      console.log('⚠️  DUPLICATE IMAGES FOUND:');
      const uniqueDuplicates = [...new Set(duplicateImages)];
      
      uniqueDuplicates.forEach(pexelsId => {
        console.log(`\n  Pexels ID ${pexelsId} used in ${imageUsageMap[pexelsId].length} blogs:`);
        imageUsageMap[pexelsId].forEach(blog => {
          console.log(`    - "${blog.title}" (ID: ${blog.blogId}) - Published: ${blog.publishedAt || 'Not published'}`);
        });
      });
    } else {
      console.log('✅ No duplicate images found across blogs');
    }
    
    // 4. Check for consistency
    console.log('\n=== CONSISTENCY CHECK ===');
    console.log(`Images tracked in usedPexelsImages: ${usedImageIds.size}`);
    console.log(`Unique images used in blogs: ${Object.keys(imageUsageMap).length}`);
    
    // Check for images in blogs but not in tracking collection
    const untrackedImages = [];
    Object.keys(imageUsageMap).forEach(pexelsId => {
      if (!usedImageIds.has(pexelsId)) {
        untrackedImages.push(pexelsId);
      }
    });
    
    if (untrackedImages.length > 0) {
      console.log(`\n⚠️  Images used in blogs but NOT tracked in usedPexelsImages: ${untrackedImages.length}`);
      untrackedImages.forEach(id => {
        console.log(`  - Pexels ID: ${id}`);
      });
    } else {
      console.log('✅ All blog images are properly tracked');
    }
    
    // 5. Summary
    const uniqueDuplicates = [...new Set(duplicateImages)];
    console.log('\n=== SUMMARY ===');
    console.log(`Total blogs: ${blogsSnapshot.size}`);
    console.log(`Total tracked images: ${usedImageIds.size}`);
    console.log(`Duplicate images found: ${uniqueDuplicates?.length || 0}`);
    console.log(`Untracked images: ${untrackedImages.length}`);
    
    // Recommendation
    console.log('\n=== RECOMMENDATIONS ===');
    if (usedImageIds.size === 0) {
      console.log('❗ The duplicate prevention system is NOT functioning - no images are being tracked');
      console.log('   - The scheduledBlogPublisher.js marks images as used (lines 344-352)');
      console.log('   - But the tracker is not being used properly in the image selection');
    } else if (duplicateImages.length > 0) {
      console.log('⚠️  The duplicate prevention system has issues - duplicates were found');
    } else if (untrackedImages.length > 0) {
      console.log('⚠️  Some images are not being tracked properly');
    } else {
      console.log('✅ The duplicate prevention system appears to be functioning correctly');
    }
    
  } catch (error) {
    console.error('Error checking blog images:', error);
  } finally {
    process.exit(0);
  }
}

checkBlogImages();