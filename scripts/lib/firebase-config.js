/**
 * Firebase configuration helper
 * Loads API keys and configuration from Firestore instead of .env files
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK only once
let initialized = false;
let db;

function initializeFirebase() {
  if (!initialized) {
    const serviceAccount = require('../../serviceAccountKey.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'apex-gas-9920e'
    });
    
    db = admin.firestore();
    initialized = true;
  }
  
  return { admin, db };
}

/**
 * Load API keys from Firestore
 * @returns {Promise<Object>} Object containing all API keys
 */
async function loadApiKeys() {
  const { db } = initializeFirebase();
  
  try {
    const keysDoc = await db.collection('apiKeys').doc('Keys').get();
    
    if (!keysDoc.exists) {
      throw new Error('API keys not found in Firestore');
    }
    
    return keysDoc.data();
  } catch (error) {
    console.error('Error loading API keys from Firestore:', error);
    throw error;
  }
}

/**
 * Load social media configuration from Firestore
 * @returns {Promise<Object>} Object containing social media configs
 */
async function loadSocialMediaConfig() {
  const { db } = initializeFirebase();
  
  try {
    const configs = {};
    
    // Load LinkedIn config
    const linkedinDoc = await db.collection('config').doc('linkedin').get();
    if (linkedinDoc.exists) {
      configs.linkedin = linkedinDoc.data();
    }
    
    // Load Facebook config
    const facebookDoc = await db.collection('config').doc('facebook').get();
    if (facebookDoc.exists) {
      configs.facebook = facebookDoc.data();
    }
    
    return configs;
  } catch (error) {
    console.error('Error loading social media config:', error);
    throw error;
  }
}

/**
 * Get specific API key
 * @param {string} keyName - Name of the API key to retrieve
 * @returns {Promise<string>} The API key value
 */
async function getApiKey(keyName) {
  const keys = await loadApiKeys();
  
  if (!keys[keyName]) {
    throw new Error(`API key '${keyName}' not found in Firestore`);
  }
  
  return keys[keyName];
}

module.exports = {
  initializeFirebase,
  loadApiKeys,
  loadSocialMediaConfig,
  getApiKey
};