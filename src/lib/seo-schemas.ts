/**
 * Schema.org Structured Data (JSON-LD) Generators for AEO (Answer Engine Optimization),
 * SEO (Search Engine Optimization), and GEO (Generative Engine Optimization).
 */

export const SITE_URL = 'https://www.myplanetservices.com';
export const SITE_NAME = 'My Planet Services';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/tour-preview.jpg`;

/**
 * 1. Primary Organization & ProfessionalService Schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'MPS Studio',
    legalName: 'My Planet Services Inc.',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon-512.png`,
      width: 512,
      height: 512,
      caption: 'My Planet Services Logo',
    },
    image: DEFAULT_OG_IMAGE,
    description:
      'High-velocity SaaS, web, and AI automation engineering studio building custom web applications, mobile platforms, headless e-commerce, and generative AI systems for scaling enterprises.',
    email: 'hello@myplanetservices.com',
    telephone: '+1-415-555-0148',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Worldwide',
    },
    priceRange: '$$$',
    currenciesAccepted: 'USD, INR, EUR, GBP, CAD, AUD, SGD, AED',
    paymentAccepted: 'Credit Card, Stripe, Wire Transfer',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-415-555-0148',
        contactType: 'Sales & Project Briefs',
        email: 'vivek@myplanetservices.com',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+1-415-555-0148',
        contactType: 'Customer Support & Engineering',
        email: 'hello@myplanetservices.com',
        availableLanguage: ['English'],
      },
    ],
    knowsAbout: [
      'Software as a Service (SaaS)',
      'Artificial Intelligence Automation',
      'Generative Engine Optimization (GEO)',
      'Answer Engine Optimization (AEO)',
      'Search Engine Optimization (SEO)',
      'Headless Shopify Plus & Medusa E-Commerce',
      'Vector Search & RAG Architectures',
      'React 19 & Next.js Development',
      'Mobile App Development (React Native & Flutter)',
      'Custom CRM & ERP Business Systems',
      'Core Web Vitals Performance Optimization',
    ],
    sameAs: [
      'https://github.com/myplanetservices',
      'https://twitter.com/myplanetserv',
      'https://linkedin.com/company/myplanetservices',
    ],
  };
}

/**
 * 2. WebSite Schema (Enables sitelinks search and entity mapping)
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'SaaS, Web & AI Development Studio',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * 3. BreadcrumbList Schema
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...items.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: crumb.name,
        item: `${SITE_URL}${crumb.path.startsWith('/') ? crumb.path : `/${crumb.path}`}`,
      })),
    ],
  };
}

/**
 * 4. FAQPage Schema (Rich snippet extraction for Google & Answer Engines)
 */
export interface FaqItem {
  q: string;
  a: string;
}

export function getFaqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/**
 * 5. Service Schema Catalog
 */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  deliverables?: string[];
}

export function getServicesSchema(services: ServiceItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Engineered Disciplines & Product Capabilities',
    itemListElement: services.map((s, index) => ({
      '@type': 'Service',
      '@id': `${SITE_URL}/services#${s.id}`,
      position: index + 1,
      name: s.title,
      description: s.description,
      provider: {
        '@id': `${SITE_URL}/#organization`,
      },
      areaServed: 'Worldwide',
      serviceType: s.title,
      hasOfferCatalog: s.deliverables
        ? {
            '@type': 'OfferCatalog',
            name: `${s.title} Deliverables`,
            itemListElement: s.deliverables.map((item, dIdx) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: item,
              },
              position: dIdx + 1,
            })),
          }
        : undefined,
    })),
  };
}

/**
 * 6. ContactPage Schema
 */
export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: 'Contact My Planet Services — Project Brief & Scoping',
    description:
      'Submit your project brief, schedule an architecture discovery call, and receive a scoped technical plan within 48 hours.',
    mainEntity: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

/**
 * 7. Agile Sprint Process Schema (HowTo / Step-by-Step)
 */
export function getProcessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'The 4-Phase Agile Engineering Sprint Methodology',
    description:
      'How My Planet Services takes complex software from architecture workshop to production deployment with weekly working demo builds.',
    totalTime: 'P8W',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Phase 1: Architecture Workshop',
        text: 'Discovery workshop, entity relationship modeling, tech stack finalization, clickable Figma wireframes, and fixed delivery roadmap in Days 1 to 5.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Phase 2: Core Engineering Sprints',
        text: 'Two-week agile sprints. Monday backlog planning, mid-week async updates, and Friday demo builds deployed to live staging environments in Weeks 2 to 6.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Phase 3: QA, Performance & Penetration Testing',
        text: 'Automated stress testing, cross-browser QA, WCAG AAA accessibility verification, penetration testing, and Core Web Vitals optimization in Week 7.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Phase 4: Production Launch & Transfer',
        text: 'Zero-downtime DNS propagation, production environment verification, recorded team handover training, and transfer of all Git repos and cloud accounts in Week 8+.',
      },
    ],
  };
}
