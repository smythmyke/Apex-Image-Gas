/**
 * Script to populate the usedPexelsImages collection with existing blog images
 * This ensures future blog posts won't reuse the same images
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'apex-gas-c1a45.appspot.com'
});

const db = admin.firestore();

// Extract Pexels ID from URL
function extractPexelsId(url) {
  const match = url.match(/pexels-photo-(\d+)/);
  return match ? match[1] : null;
}

async function populateUsedImages() {
  console.log('🔍 Fetching existing blog posts...');
  
  try {
    // Get all published blog posts
    const blogsSnapshot = await db.collection('blogPosts')
      .where('status', '==', 'published')
      .get();
    
    console.log(`📚 Found ${blogsSnapshot.size} published blogs\n`);
    
    const imageUsage = new Map();
    
    // Collect image usage data
    for (const doc of blogsSnapshot.docs) {
      const blog = doc.data();
      const blogId = doc.id;
      
      if (blog.featuredImage && blog.featuredImage.url) {
        const imageUrl = blog.featuredImage.url;
        const pexelsId = extractPexelsId(imageUrl);
        
        if (pexelsId) {
          if (!imageUsage.has(pexelsId)) {
            imageUsage.set(pexelsId, {
              pexelsId: pexelsId,
              imageUrl: imageUrl,
              photographer: blog.featuredImage.credit?.replace('Photo by ', '').replace(' from Pexels', '') || 'Unknown',
              usedInBlogs: [],
              firstUsedAt: blog.publishedAt || blog.createdAt
            });
          }
          
          imageUsage.get(pexelsId).usedInBlogs.push({
            blogId: blogId,
            blogTitle: blog.title,
            publishedAt: blog.publishedAt || blog.createdAt
          });
        }
      }
    }
    
    console.log(`🖼️  Found ${imageUsage.size} unique images used across blogs\n`);
    
    // Display duplicate usage
    for (const [pexelsId, data] of imageUsage) {
      if (data.usedInBlogs.length > 1) {
        console.log(`⚠️  Image ${pexelsId} used in ${data.usedInBlogs.length} blogs:`);
        data.usedInBlogs.forEach(blog => {
          console.log(`   - ${blog.blogTitle}`);
        });
        console.log('');
      }
    }
    
    // Populate the usedPexelsImages collection
    console.log('💾 Populating usedPexelsImages collection...\n');
    
    const batch = db.batch();
    let addedCount = 0;
    
    for (const [pexelsId, data] of imageUsage) {
      const docRef = db.collection('usedPexelsImages').doc(pexelsId);
      
      // Use the first blog that used this image
      const firstBlog = data.usedInBlogs.sort((a, b) => 
        (a.publishedAt?._seconds || 0) - (b.publishedAt?._seconds || 0)
      )[0];
      
      batch.set(docRef, {
        pexelsId: parseInt(pexelsId),
        photographer: data.photographer,
        pexelsUrl: `https://www.pexels.com/photo/${pexelsId}/`,
        imageUrl: data.imageUrl,
        usedAt: data.firstUsedAt || admin.firestore.FieldValue.serverTimestamp(),
        usedInBlog: firstBlog.blogId,
        searchQuery: 'medical x-ray equipment technology', // Default since we don't know original
        retroactivelyAdded: true,
        addedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      addedCount++;
    }
    
    await batch.commit();
    
    console.log(`✅ Successfully added ${addedCount} images to tracking collection`);
    console.log('🎉 Image tracking collection is now up to date!\n');
    
    // Verify the collection
    const verifySnapshot = await db.collection('usedPexelsImages').get();
    console.log(`📊 Verification: usedPexelsImages collection now has ${verifySnapshot.size} documents`);
    
  } catch (error) {
    console.error('❌ Error populating used images:', error);
  } finally {
    process.exit();
  }
}

// Run the script
populateUsedImages();