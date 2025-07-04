/**
 * Central URL Configuration for Apex Image Gas
 * This file contains all the URLs used across the application
 * to ensure consistency and prevent discrepancies.
 */

const urlConfig = {
  // Main website
  mainSite: 'https://apeximagegas.net',
  
  // Blog subdomain
  blogSite: 'https://blog.apeximagegas.net',
  
  // Page paths
  pages: {
    home: '/',
    contact: '/contact',
    xrayEquipment: '/xray-equipment',
    services: '/services',
    quote: '/quote',
    about: '/about',
    products: '/products'
  },
  
  // Social media URLs
  socialMedia: {
    facebook: 'https://www.facebook.com/profile.php?id=61578037917573',
    linkedin: 'https://www.linkedin.com/company/apex-image-gas',
    twitter: 'https://twitter.com/apeximagegas'
  },
  
  // API endpoints
  api: {
    facebookWebhook: 'https://hooks.zapier.com/hooks/catch/23550148/ubpq6qe/',
    linkedinWebhook: 'https://hooks.zapier.com/hooks/catch/23550148/z7bh4gc/'
  },
  
  // Helper functions
  getBlogPostUrl: (slug) => `${urlConfig.blogSite}/${slug}`,
  getPageUrl: (page) => `${urlConfig.mainSite}${urlConfig.pages[page] || ''}`,
  
  // Generate full URLs for CTAs
  getCTAUrls: () => ({
    contact: `${urlConfig.mainSite}${urlConfig.pages.contact}`,
    xrayEquipment: `${urlConfig.mainSite}${urlConfig.pages.xrayEquipment}`,
    services: `${urlConfig.mainSite}${urlConfig.pages.services}`,
    quote: `${urlConfig.mainSite}${urlConfig.pages.quote}`
  })
};

module.exports = urlConfig;