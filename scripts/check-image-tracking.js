const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

async function checkImageTracking() {
  console.log('🔍 Investigating Image Tracking Issue\n');
  
  // 1. Check blog post QlgHWzVwl8820BhhDesa for image details
  console.log('1. Checking blog post QlgHWzVwl8820BhhDesa for image details:');
  console.log('=========================================================');
  
  try {
    const blogDoc = await db.collection('blogPosts').doc('QlgHWzVwl8820BhhDesa').get();
    
    if (blogDoc.exists) {
      const blogData = blogDoc.data();
      console.log('✅ Blog post found!');
      
      if (blogData.featuredImage) {
        console.log('\nFeatured Image Details:');
        console.log(JSON.stringify(blogData.featuredImage, null, 2));
        
        // Check if the URL contains the image ID
        if (blogData.featuredImage.url && blogData.featuredImage.url.includes('5463575')) {
          console.log('\n⚠️  Image ID 5463575 is used in the featured image URL!');
          console.log('URL:', blogData.featuredImage.url);
        }
      }
      
      // Check content for image references
      if (blogData.content && blogData.content.includes('5463575')) {
        console.log('\n⚠️  Image ID 5463575 is referenced in the blog content!');
      }
      
      // Check if there's a pexelsId field
      if (blogData.featuredImage && !blogData.featuredImage.pexelsId) {
        console.log('\n❌ Featured image is missing pexelsId field');
      }
    }
  } catch (error) {
    console.error('Error checking blog post:', error);
  }
  
  // 2. Check all blogs that might use this image
  console.log('\n\n2. Searching all blog posts for image ID 5463575:');
  console.log('=================================================');
  
  try {
    const blogsSnapshot = await db.collection('blogPosts').get();
    let foundCount = 0;
    
    blogsSnapshot.forEach(doc => {
      const data = doc.data();
      let found = false;
      
      // Check featured image URL
      if (data.featuredImage?.url && data.featuredImage.url.includes('5463575')) {
        console.log(`\n✅ Found in blog ${doc.id}:`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Featured Image URL: ${data.featuredImage.url}`);
        found = true;
        foundCount++;
      }
      
      // Check content
      if (data.content && data.content.includes('5463575')) {
        if (!found) {
          console.log(`\n✅ Found in blog ${doc.id} content:`);
          console.log(`   Title: ${data.title}`);
        }
        foundCount++;
      }
    });
    
    if (foundCount === 0) {
      console.log('❌ Image ID 5463575 not found in any blog posts');
    } else {
      console.log(`\n📊 Total blogs using image 5463575: ${foundCount}`);
    }
  } catch (error) {
    console.error('Error searching blogs:', error);
  }
  
  // 3. Check the structure of usedPexelsImages collection
  console.log('\n\n3. Checking usedPexelsImages collection structure:');
  console.log('=================================================');
  
  try {
    const imagesSnapshot = await db.collection('usedPexelsImages')
      .orderBy('usedAt', 'desc')
      .limit(5)
      .get();
    
    console.log(`\nSample entries (${imagesSnapshot.size} shown):`);
    imagesSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`\nDocument ID: ${doc.id}`);
      console.log(`Data: ${JSON.stringify(data, null, 2)}`);
    });
  } catch (error) {
    console.error('Error checking collection:', error);
  }
  
  // 4. Try to manually add the missing image to track it
  console.log('\n\n4. Recommendation:');
  console.log('==================');
  console.log('The image ID 5463575 should be tracked when the blog is created.');
  console.log('It appears the blog generation script may not be properly calling');
  console.log('the markImageAsUsed() function from pexels-image-tracker.js');
}

// Run the check
checkImageTracking()
  .then(() => {
    console.log('\n✅ Investigation completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });