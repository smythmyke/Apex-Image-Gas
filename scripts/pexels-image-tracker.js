const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    throw error;
  }
}

const db = admin.firestore();

class PexelsImageTracker {
  constructor() {
    this.collectionName = 'usedPexelsImages';
  }

  /**
   * Check if a Pexels image has been used before
   */
  async isImageUsed(pexelsImageId) {
    try {
      const doc = await db.collection(this.collectionName).doc(pexelsImageId.toString()).get();
      return doc.exists;
    } catch (error) {
      console.error('Error checking image usage:', error);
      return false;
    }
  }

  /**
   * Mark a Pexels image as used
   */
  async markImageAsUsed(pexelsImage, blogId) {
    try {
      await db.collection(this.collectionName).doc(pexelsImage.id.toString()).set({
        pexelsId: pexelsImage.id,
        photographer: pexelsImage.photographer,
        pexelsUrl: pexelsImage.url,
        imageUrl: pexelsImage.src.large2x || pexelsImage.src.large,
        usedAt: admin.firestore.Timestamp.now(),
        usedInBlog: blogId,
        searchQuery: pexelsImage.searchQuery || null
      });
      console.log(`✅ Marked Pexels image ${pexelsImage.id} as used`);
    } catch (error) {
      console.error('Error marking image as used:', error);
    }
  }

  /**
   * Get list of all used image IDs
   */
  async getUsedImageIds() {
    try {
      const snapshot = await db.collection(this.collectionName).get();
      return snapshot.docs.map(doc => parseInt(doc.id));
    } catch (error) {
      console.error('Error getting used image IDs:', error);
      return [];
    }
  }

  /**
   * Find unused image from search results
   */
  async findUnusedImage(searchResults, maxAttempts = 5) {
    const usedIds = await this.getUsedImageIds();
    
    // Filter out used images
    const unusedImages = searchResults.filter(img => !usedIds.includes(img.id));
    
    if (unusedImages.length > 0) {
      return unusedImages[0]; // Return first unused image
    }
    
    return null; // All images have been used
  }

  /**
   * Clean up old entries (optional - keeps last 1000)
   */
  async cleanupOldEntries(keepCount = 1000) {
    try {
      const snapshot = await db.collection(this.collectionName)
        .orderBy('usedAt', 'desc')
        .get();
      
      if (snapshot.size > keepCount) {
        const batch = db.batch();
        const docsToDelete = snapshot.docs.slice(keepCount);
        
        docsToDelete.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`🧹 Cleaned up ${docsToDelete.length} old image records`);
      }
    } catch (error) {
      console.error('Error cleaning up old entries:', error);
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats() {
    try {
      const snapshot = await db.collection(this.collectionName).get();
      const photographers = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        photographers[data.photographer] = (photographers[data.photographer] || 0) + 1;
      });
      
      return {
        totalImagesUsed: snapshot.size,
        topPhotographers: Object.entries(photographers)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return null;
    }
  }
}

// Export singleton instance
const imageTracker = new PexelsImageTracker();
module.exports = imageTracker;

// Test functions if run directly
if (require.main === module) {
  async function test() {
    console.log('🧪 Testing Pexels Image Tracker for Apex Gas\n');
    
    // Test checking if image is used
    const testImageId = 12345;
    const isUsed = await imageTracker.isImageUsed(testImageId);
    console.log(`Is image ${testImageId} used? ${isUsed}`);
    
    // Get usage stats
    const stats = await imageTracker.getUsageStats();
    console.log('\n📊 Usage Statistics:');
    console.log(`Total images used: ${stats?.totalImagesUsed || 0}`);
    
    if (stats?.topPhotographers.length > 0) {
      console.log('\nTop photographers:');
      stats.topPhotographers.forEach(([photographer, count]) => {
        console.log(`  ${photographer}: ${count} images`);
      });
    }
  }
  
  test().catch(console.error);
}