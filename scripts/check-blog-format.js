const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkBlogFormat() {
  try {
    // Get the latest blog post
    const snapshot = await db.collection('blogPosts')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      console.log('No blog posts found');
      return;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    console.log('Latest Blog Post Analysis:');
    console.log('========================');
    console.log('ID:', doc.id);
    console.log('Title:', data.title);
    console.log('Status:', data.status);
    console.log('Created:', data.createdAt.toDate());
    
    console.log('\nContent Analysis:');
    console.log('================');
    console.log('Total length:', data.content.length, 'characters');
    console.log('Has <h1> tags:', data.content.includes('<h1>'));
    console.log('Has <h2> tags:', data.content.includes('<h2>'));
    console.log('Has <h3> tags:', data.content.includes('<h3>'));
    console.log('Has <p> tags:', data.content.includes('<p>'));
    console.log('Has <ul> tags:', data.content.includes('<ul>'));
    console.log('Has <li> tags:', data.content.includes('<li>'));
    console.log('Has <strong> tags:', data.content.includes('<strong>'));
    console.log('Has markdown wrappers:', data.content.includes('```'));
    
    console.log('\nFirst 500 characters:');
    console.log('====================');
    console.log(data.content.substring(0, 500));
    
    // Count HTML elements
    const h2Count = (data.content.match(/<h2>/g) || []).length;
    const pCount = (data.content.match(/<p>/g) || []).length;
    const liCount = (data.content.match(/<li>/g) || []).length;
    
    console.log('\nElement Counts:');
    console.log('===============');
    console.log('H2 sections:', h2Count);
    console.log('Paragraphs:', pCount);
    console.log('List items:', liCount);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkBlogFormat();