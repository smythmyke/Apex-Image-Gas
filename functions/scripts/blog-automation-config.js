/* eslint-disable max-len */
/**
 * Blog Automation Configuration for Apex Gas
 * Defines standards and templates for automated blog generation
 * Focused on medical gas equipment, X-ray machines, and healthcare solutions
 */

const blogConfig = {
  // Optimal blog length for SEO and engagement
  length: {
    minimum: 1200,
    target: 1500,
    maximum: 2000,
    // Research shows 1,500-2,000 words perform best for:
    // - SEO rankings (more content to index)
    // - Time on page (5-7 minute read)
    // - Social shares
    // - Conversion rates
  },

  // Blog structure template
  structure: {
    introduction: {
      words: "150-200",
      elements: [
        "Hook with healthcare/medical statistic or challenge",
        "Brief overview of topic",
        "Value proposition for healthcare facilities",
        "Preview of main points",
      ],
    },
    mainContent: {
      words: "1000-1400",
      sections: "3-5",
      elementsPerSection: [
        "Clear subheading",
        "Medical/technical challenge explanation",
        "Real-world healthcare example",
        "Solution with equipment specifications",
        "Safety/compliance considerations",
      ],
    },
    apexGasCTA: {
      words: "200-300",
      placement: "end",
      elements: [
        "Natural transition from content",
        "Specific Apex Gas equipment/services that help",
        "Quality and reliability assurance",
        "Expert consultation offer",
        "Request quote or consultation CTA",
      ],
    },
  },

  // Apex Gas integration templates
  ctaTemplates: {
    medicalGasRelated: `
## Ensure Safe and Reliable Medical Gas Systems with Apex Gas

When it comes to medical gas systems, reliability and safety are non-negotiable. Apex Gas provides comprehensive solutions that meet the highest healthcare standards, ensuring your facility operates smoothly and safely. // eslint-disable-line max-len

**Partner with Apex Gas for:**
- FDA-approved medical gas equipment and systems
- Expert installation by certified technicians
- 24/7 emergency support and maintenance
- Compliance with NFPA 99 and Joint Commission standards
- Custom solutions tailored to your facility's needs

Don't compromise on patient safety. Trust the experts who understand the critical nature of medical gas systems. // eslint-disable-line max-len

**[Request a Free Consultation](https://apexgas.com/contact) - Our experts are ready to help**
    `,

    xrayEquipmentRelated: `
## Upgrade Your Imaging Capabilities with Apex Gas X-Ray Solutions

Modern healthcare demands cutting-edge imaging technology. Apex Gas delivers state-of-the-art X-ray equipment that combines superior image quality with patient safety and operational efficiency. // eslint-disable-line max-len

**Why healthcare facilities choose Apex Gas:**
- Advanced digital X-ray systems with exceptional clarity
- Reduced radiation exposure for patient safety
- Intuitive interfaces for efficient workflow
- Comprehensive service agreements and support
- Competitive pricing with flexible financing options

Experience the difference quality imaging equipment can make in patient care.

**[Explore Our X-Ray Solutions](https://apexgas.com/xray-equipment) - Schedule a Demo Today**
    `,

    maintenanceRelated: `
## Maximize Equipment Uptime with Apex Gas Service Plans

Preventive maintenance is crucial for medical equipment reliability. Apex Gas's comprehensive service programs ensure your critical systems operate at peak performance when you need them most. // eslint-disable-line max-len

**Our service advantages:**
- Certified technicians with specialized training
- Predictive maintenance to prevent failures
- Priority response times for emergencies
- Detailed compliance documentation
- Cost-effective service agreements

Protect your investment and ensure uninterrupted patient care.

**[Learn About Our Service Plans](https://apexgas.com/services) - Keep Your Equipment Running**
    `,

    generalPurpose: `
## Ready to Enhance Your Healthcare Facility?

Whether you're upgrading existing equipment or planning new installations, Apex Gas provides the expertise and solutions you need for optimal patient care. // eslint-disable-line max-len

**Why healthcare providers trust Apex Gas:**
- **30+ years of healthcare experience**
- **Comprehensive product portfolio** from leading manufacturers
- **Expert consultation** for system design and selection
- **Turnkey solutions** from installation to maintenance
- **Dedicated support** throughout your equipment lifecycle

Join the network of healthcare facilities that rely on Apex Gas for their critical equipment needs. // eslint-disable-line max-len

**[Get Your Free Quote Today](https://apexgas.com/quote) - No obligation consultation**
    `,
  },

  // Blog topics that naturally lead to Apex Gas solutions
  topicCategories: {
    medicalGasSystems: {
      topics: [
        "Medical gas system compliance requirements",
        "Oxygen delivery system optimization",
        "Medical air quality standards",
        "Vacuum and suction system best practices",
      ],
      cta: "medicalGasRelated",
    },
    xrayTechnology: {
      topics: [
        "Digital vs analog X-ray systems",
        "Radiation safety protocols",
        "X-ray room design considerations",
        "Image quality optimization techniques",
      ],
      cta: "xrayEquipmentRelated",
    },
    equipmentMaintenance: {
      topics: [
        "Preventive maintenance schedules",
        "Equipment lifecycle management",
        "Compliance documentation requirements",
        "Emergency response protocols",
      ],
      cta: "maintenanceRelated",
    },
    general: {
      topics: [
        "Healthcare facility equipment planning",
        "Budget optimization for medical equipment",
        "Technology trends in healthcare",
        "Patient safety best practices",
      ],
      cta: "generalPurpose",
    },
  },

  // Gemini prompt template for blog generation
  geminiPromptTemplate: (topic, category) => `
Write a comprehensive blog post about "${topic}" for Apex Gas's blog.

Requirements:
- Length: 1,500-1,800 words (optimal for SEO and engagement) // eslint-disable-line max-len
- Tone: Professional yet accessible, speaking to healthcare administrators, facility managers, and medical professionals // eslint-disable-line max-len
- Structure: Clear introduction, 3-5 main sections with subheadings, natural conclusion // eslint-disable-line max-len
- Include: Technical specifications where relevant, safety considerations, compliance requirements, real-world applications // eslint-disable-line max-len

Target Audience: Healthcare facility managers, biomedical engineers, hospital administrators, and medical professionals // eslint-disable-line max-len

Content Guidelines:
1. Start with a compelling hook (healthcare statistic, patient safety concern, or operational challenge) // eslint-disable-line max-len
2. Provide genuine technical value - detailed insights they can implement // eslint-disable-line max-len
3. Include specific medical/healthcare scenarios and applications // eslint-disable-line max-len
4. Reference relevant standards (NFPA 99, Joint Commission, FDA, etc.) where applicable // eslint-disable-line max-len
5. Discuss both clinical and operational benefits
6. Break up text with subheadings, bullet points, and technical specifications // eslint-disable-line max-len
7. End with a natural transition to how proper equipment and service can help // eslint-disable-line max-len

IMPORTANT: Do NOT include a call-to-action or product pitch in the main content. Focus on providing valuable, educational content about medical equipment and healthcare operations. The CTA will be added separately. // eslint-disable-line max-len

SEO Optimization:
- Primary keyword: ${topic.toLowerCase()}
- Include related medical/healthcare terms naturally
- Optimize headings for featured snippets
- Include questions healthcare professionals might ask

Technical Accuracy:
- Ensure all medical and technical information is accurate
- Use proper medical terminology
- Include relevant measurements and specifications
- Reference industry standards appropriately

Format the blog in Markdown with proper heading hierarchy (# for title, ## for main sections, ### for subsections). // eslint-disable-line max-len
`,

  // Image selection keywords generator for medical/healthcare content
  imageKeywordGenerator: (topic) => {
    const baseKeywords = [
      "medical equipment",
      "hospital room",
      "healthcare facility",
      "medical professional",
      "x-ray machine",
      "medical gas system",
      "healthcare technology",
      "medical device",
    ];

    // Add topic-specific keywords
    const topicWords = topic.toLowerCase().split(" ");
    const medicalKeywords = [];

    // Add medical-specific variations
    if (topic.includes("X-ray") || topic.includes("x-ray")) {
      medicalKeywords.push("radiology", "imaging equipment", "diagnostic imaging"); // eslint-disable-line max-len
    }
    if (topic.includes("gas") || topic.includes("oxygen")) {
      medicalKeywords.push("medical gas", "oxygen delivery", "gas manifold");
    }
    if (topic.includes("maintenance") || topic.includes("service")) {
      medicalKeywords.push("technician", "equipment service", "calibration");
    }

    return {
      primary: [...topicWords.filter((word) => word.length > 4), ...medicalKeywords], // eslint-disable-line max-len
      secondary: baseKeywords,
      style: ["modern", "professional", "medical", "clean", "healthcare"],
    };
  },
};

module.exports = blogConfig;

