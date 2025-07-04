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

async function checkSpecificData() {
  console.log('🔍 Checking Specific Data in Firestore\n');
  
  // Check usedPexelsImages collection for image ID 5463575
  console.log('1. Checking usedPexelsImages collection for image ID 5463575:');
  console.log('=========================================================');
  
  try {
    const imageDoc = await db.collection('usedPexelsImages').doc('5463575').get();
    
    if (imageDoc.exists) {
      console.log('✅ Image ID 5463575 found in usedPexelsImages collection!');
      const imageData = imageDoc.data();
      console.log('\nImage Details:');
      console.log('- Pexels ID:', imageData.pexelsId);
      console.log('- Photographer:', imageData.photographer);
      console.log('- Pexels URL:', imageData.pexelsUrl);
      console.log('- Image URL:', imageData.imageUrl);
      console.log('- Used At:', imageData.usedAt ? imageData.usedAt.toDate() : 'N/A');
      console.log('- Used In Blog:', imageData.usedInBlog);
      console.log('- Search Query:', imageData.searchQuery || 'Not specified');
    } else {
      console.log('❌ Image ID 5463575 NOT found in usedPexelsImages collection');
    }
  } catch (error) {
    console.error('Error checking image:', error);
  }
  
  // Check blog post QlgHWzVwl8820BhhDesa
  console.log('\n\n2. Checking blog post QlgHWzVwl8820BhhDesa:');
  console.log('==========================================');
  
  try {
    const blogDoc = await db.collection('blogPosts').doc('QlgHWzVwl8820BhhDesa').get();
    
    if (blogDoc.exists) {
      console.log('✅ Blog post QlgHWzVwl8820BhhDesa found!');
      const blogData = blogDoc.data();
      console.log('\nBlog Details:');
      console.log('- Title:', blogData.title);
      console.log('- Author:', JSON.stringify(blogData.author, null, 2));
      console.log('- Category:', blogData.category);
      console.log('- Status:', blogData.status);
      console.log('- Published:', blogData.published);
      
      // Handle dates that might be timestamps or strings
      if (blogData.createdAt) {
        if (blogData.createdAt.toDate) {
          console.log('- Created At:', blogData.createdAt.toDate());
        } else {
          console.log('- Created At:', blogData.createdAt);
        }
      } else {
        console.log('- Created At: N/A');
      }
      
      if (blogData.publishedAt) {
        if (blogData.publishedAt.toDate) {
          console.log('- Published At:', blogData.publishedAt.toDate());
        } else {
          console.log('- Published At:', blogData.publishedAt);
        }
      } else {
        console.log('- Published At: N/A');
      }
      
      console.log('- Summary:', blogData.summary?.substring(0, 100) + '...');
      
      if (blogData.featuredImage) {
        console.log('\nFeatured Image:');
        console.log('- URL:', blogData.featuredImage.url);
        console.log('- Alt Text:', blogData.featuredImage.alt);
        if (blogData.featuredImage.credit) {
          console.log('- Credit:', blogData.featuredImage.credit);
        }
        if (blogData.featuredImage.pexelsId) {
          console.log('- Pexels ID:', blogData.featuredImage.pexelsId);
        }
      }
      
      console.log('\n- Content Length:', blogData.content ? blogData.content.length : 0, 'characters');
      console.log('- Slug:', blogData.slug);
      console.log('- Tags:', blogData.tags?.join(', ') || 'None');
    } else {
      console.log('❌ Blog post QlgHWzVwl8820BhhDesa NOT found');
    }
  } catch (error) {
    console.error('Error checking blog post:', error);
  }
  
  // Additional check: List all documents in usedPexelsImages to see what's there
  console.log('\n\n3. Listing recent entries in usedPexelsImages collection:');
  console.log('========================================================');
  
  try {
    const imagesSnapshot = await db.collection('usedPexelsImages')
      .orderBy('usedAt', 'desc')
      .limit(10)
      .get();
    
    console.log(`Found ${imagesSnapshot.size} recent images:`);
    imagesSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`\n- ID: ${doc.id}`);
      console.log(`  Photographer: ${data.photographer}`);
      console.log(`  Used At: ${data.usedAt ? data.usedAt.toDate() : 'N/A'}`);
      console.log(`  Blog: ${data.usedInBlog}`);
    });
  } catch (error) {
    console.error('Error listing images:', error);
  }
}

// Run the check
checkSpecificData()
  .then(() => {
    console.log('\n✅ Check completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });