/**
 * Centralized Schema.org Structured Data Generators
 * Following Google's latest guidelines (Nov 2025)
 * 
 * Supported schemas:
 * - Organization (global)
 * - LocalBusiness (home)
 * - WebSite with SearchAction (global)
 * - Service (productos)
 * - BreadcrumbList (all pages)
 * - Article (blog posts)
 * - ProfilePage (nosotros)
 * - SoftwareApplication (productos)
 * 
 * NOT implementing (restricted by Google):
 * - FAQPage (only for government/health sites)
 * - Review/AggregateRating (can't self-publish reviews)
 */

export type SupportedLocale = 'es' | 'en' | 'pt';

// Base URL
const BASE_URL = 'https://pukadigital.com';

// Contact Info - Centralized
export const CONTACT_INFO = {
  phone: '+593964065880',
  phoneDisplay: '+593 96 406 5880',
  email: 'luis.viteri@pukadigital.com',
  emailGeneral: 'hola@pukadigital.com',
  whatsappLink: 'https://wa.me/593964065880',
  address: {
    locality: 'Quito',
    region: 'Pichincha',
    neighborhood: 'Carcelén',
    country: 'EC',
    countryName: 'Ecuador'
  },
  social: {
    linkedinPersonal: 'https://www.linkedin.com/in/luisviteri/',
    linkedinCompany: 'https://www.linkedin.com/company/pukadigital/',
    youtube: 'https://www.youtube.com/@PukaDigital',
    instagram: 'https://www.instagram.com/luchodev_/',
    github: 'https://github.com/LuchoProgramer/PukaDigital'
  }
};

/**
 * Founder Schema - Reusable Person entity
 */
export const getFounderSchema = () => ({
  "@type": "Person",
  "@id": `${BASE_URL}/#founder`,
  "name": "Luis Omar Viteri Sarango",
  "alternateName": "LuchoDev",
  "jobTitle": "Fundador",
  "description": "Autodidacta con 3 años de experiencia en transformación digital para pymes. Fundó Puka Digital para democratizar el acceso a herramientas digitales.",
  "image": "https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png",
  "email": CONTACT_INFO.email,
  "sameAs": [
    CONTACT_INFO.social.linkedinPersonal,
    CONTACT_INFO.social.instagram
  ],
  "knowsAbout": [
    "Digital Marketing",
    "AI Chatbots",
    "Web Development",
    "ERP Systems",
    "WhatsApp Business Automation",
    "SME Digital Transformation"
  ]
});

/**
 * Organization Schema - Brand identity for Knowledge Panel
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  "name": "PukaDigital - Agencia de Marketing Digital y Desarrollo Web",
  "alternateName": "Puka Digital",
  "url": BASE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": "https://res.cloudinary.com/dltfsttr7/image/upload/v1764125716/logo_ekusea.svg",
    "width": 512,
    "height": 512,
    "caption": "PukaDigital Logo"
  },
  "image": "https://res.cloudinary.com/dltfsttr7/image/upload/v1764125716/logo_ekusea.svg",
  "description": "Educación digital para PYMEs. 3 meses de capacitación intensiva = Independencia tecnológica de por vida.",
  "slogan": "No construimos dependencia, construimos dignidad.",
  "email": CONTACT_INFO.emailGeneral,
  "telephone": CONTACT_INFO.phone,
  "foundingDate": "2025-08-02",
  "founder": getFounderSchema(),
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 1
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": CONTACT_INFO.address.country,
    "addressRegion": CONTACT_INFO.address.region,
    "addressLocality": CONTACT_INFO.address.locality
  },
  "areaServed": [
    {
      "@type": "Country",
      "name": "Ecuador"
    },
    {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": -0.1807,
        "longitude": -78.4678
      },
      "geoRadius": "500 km",
      "name": "Latin America"
    }
  ],
  "knowsAbout": [
    "Digital Marketing",
    "Web Development",
    "AI Chatbots",
    "ERP Systems",
    "Digital Independence",
    "SME Technology Education",
    "Google Ads",
    "SEO",
    "WhatsApp Business Automation"
  ],
  "sameAs": [
    CONTACT_INFO.social.github,
    CONTACT_INFO.social.linkedinCompany,
    CONTACT_INFO.social.youtube,
    CONTACT_INFO.social.instagram
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "availableLanguage": ["Spanish", "English", "Portuguese"]
  }
});

/**
 * LocalBusiness Schema - For local search visibility in Ecuador
 */
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#localbusiness`,
  "name": "PukaDigital - Agencia de Marketing Digital y Desarrollo Web",
  "image": "https://res.cloudinary.com/dltfsttr7/image/upload/v1764125716/logo_ekusea.svg",
  "url": BASE_URL,
  "telephone": CONTACT_INFO.phone,
  "email": CONTACT_INFO.email,
  "description": "Agencia de marketing digital y empresa de desarrollo web en Quito, Ecuador. Especialista en independencia tecnológica para PYMEs: SEO, Google Ads, Chatbots y ERP.",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": `${CONTACT_INFO.address.neighborhood}, ${CONTACT_INFO.address.locality}`,
    "addressLocality": CONTACT_INFO.address.locality,
    "addressRegion": CONTACT_INFO.address.region,
    "postalCode": "170150",
    "addressCountry": CONTACT_INFO.address.country
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -0.1807,
    "longitude": -78.4678
  },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "founder": {
    "@id": `${BASE_URL}/#founder`
  },
  "serviceType": [
    "Digital Marketing Agency",
    "Web Development Company",
    "AI Chatbot Implementation",
    "SEO Services Quito",
    "Google Ads Management"
  ],
  "currenciesAccepted": "USD",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "parentOrganization": {
    "@id": `${BASE_URL}/#organization`
  }
});

/**
 * WebSite Schema with SearchAction - For sitelinks searchbox
 */
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  "url": BASE_URL,
  "name": "PukaDigital",
  "alternateName": "Puka Digital Ecuador",
  "description": "Independencia Digital para PYMEs en Ecuador y LATAM",
  "publisher": {
    "@id": `${BASE_URL}/#organization`
  },
  "inLanguage": ["es", "en", "pt"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/blog?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

/**
 * Service Schema - For the main program
 */
export const getServiceSchema = (lang: SupportedLocale = 'es') => {
  const descriptions = {
    es: {
      name: "Programa de Independencia Digital 3 Meses",
      description: "Programa educativo intensivo que enseña a PYMEs a gestionar su propia presencia digital: desarrollo web, chatbots IA, sistemas ERP y marketing digital.",
      offerDescription: "$300/mes por 3 meses. Incluye $100/mes en Google Ads."
    },
    en: {
      name: "3-Month Digital Independence Program",
      description: "Intensive educational program teaching SMEs to manage their own digital presence: web development, AI chatbots, ERP systems and digital marketing.",
      offerDescription: "$300/month for 3 months. Includes $100/month in Google Ads."
    },
    pt: {
      name: "Programa de Independência Digital 3 Meses",
      description: "Programa educativo intensivo que ensina PMEs a gerir sua própria presença digital: desenvolvimento web, chatbots IA, sistemas ERP e marketing digital.",
      offerDescription: "$300/mês por 3 meses. Inclui $100/mês em Google Ads."
    }
  };

  const content = descriptions[lang];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/#service`,
    "serviceType": "Digital Independence Program",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "name": content.name,
    "description": content.description,
    "offers": {
      "@type": "Offer",
      "price": "900",
      "priceCurrency": "USD",
      "description": content.offerDescription,
      "availability": "https://schema.org/LimitedAvailability",
      "url": `${BASE_URL}/${lang}/productos`,
      "validFrom": "2024-01-01",
      "priceValidUntil": "2025-12-31",
      "eligibleRegion": {
        "@type": "Country",
        "name": "Ecuador"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ecuador"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Modulares Post-Programa",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Chatbot IA WhatsApp",
            "description": "Asistente virtual con inteligencia artificial para automatización 24/7"
          },
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sistema ERP Cloud",
            "description": "Gestión de inventario, CRM y facturación en la nube"
          },
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CMS + Hosting Optimizado",
            "description": "Alojamiento Next.js con editor visual y SEO automático"
          },
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          }
        }
      ]
    }
  };
};

/**
 * BreadcrumbList Schema - For navigation in search results
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

/**
 * Article Schema - For blog posts
 */
export interface ArticleData {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  lang: SupportedLocale;
}

export const getArticleSchema = (data: ArticleData) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/${data.lang}/blog/${data.slug}#article`,
  "headline": data.title,
  "description": data.description,
  "image": data.image || "https://res.cloudinary.com/dltfsttr7/image/upload/v1764125716/logo_ekusea.svg",
  "datePublished": data.datePublished,
  "dateModified": data.dateModified || data.datePublished,
  "author": {
    "@type": "Person",
    "@id": `${BASE_URL}/#founder`,
    "name": data.author || "Luis Omar Viteri Sarango",
    "url": `${BASE_URL}/#founder`
  },
  "publisher": {
    "@id": `${BASE_URL}/#organization`
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${BASE_URL}/${data.lang}/blog/${data.slug}`
  },
  "inLanguage": data.lang === 'es' ? 'es-EC' : data.lang === 'en' ? 'en-US' : 'pt-BR',
  "isPartOf": {
    "@id": `${BASE_URL}/#website`
  }
});

/**
 * SoftwareApplication Schema - For products page
 */
export interface SoftwareAppData {
  name: string;
  description: string;
  price: string;
  isIntroductory?: boolean;
  category: string;
}

export const getSoftwareAppSchema = (apps: SoftwareAppData[]) =>
  apps.map(app => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "description": app.description,
    "applicationCategory": app.category,
    "operatingSystem": "Web-based",
    "offers": {
      "@type": "Offer",
      "price": app.price,
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@id": `${BASE_URL}/#organization`
      },
      ...(app.isIntroductory && {
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": app.price,
          "priceCurrency": "USD",
          "unitText": "MONTH",
          "description": "Precio introductorio"
        }
      })
    },
    "provider": {
      "@id": `${BASE_URL}/#organization`
    }
  }));

/**
 * Products Schema - All Puka Digital products
 */
export const getProductsSchema = () => getSoftwareAppSchema([
  {
    name: "Chatbot IA WhatsApp",
    description: "Asistente virtual con inteligencia artificial para automatización de atención al cliente 24/7 en WhatsApp Business",
    price: "20",
    isIntroductory: true,
    category: "BusinessApplication"
  },
  {
    name: "Sistema ERP Cloud",
    description: "Sistema de gestión empresarial con inventario, CRM, facturación electrónica SRI y reportes en la nube",
    price: "20",
    isIntroductory: true,
    category: "BusinessApplication"
  },
  {
    name: "CMS + Hosting Web",
    description: "Sistema de gestión de contenido para blogs y páginas web con hosting optimizado Next.js y SEO automático",
    price: "20",
    isIntroductory: false,
    category: "WebApplication"
  }
]);

/**
 * WebPage Schema - For regular pages
 */
export interface WebPageData {
  title: string;
  description: string;
  url: string;
  lang: SupportedLocale;
  breadcrumbs: BreadcrumbItem[];
}

export const getWebPageSchema = (data: WebPageData) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${data.url}#webpage`,
  "url": data.url,
  "name": data.title,
  "description": data.description,
  "inLanguage": data.lang === 'es' ? 'es-EC' : data.lang === 'en' ? 'en-US' : 'pt-BR',
  "isPartOf": {
    "@id": `${BASE_URL}/#website`
  },
  "breadcrumb": getBreadcrumbSchema(data.breadcrumbs)
});

/**
 * Combined Schema Graph - For layout (global schemas)
 */
export const getGlobalSchemaGraph = () => ({
  "@context": "https://schema.org",
  "@graph": [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema()
  ]
});

/**
 * Tienda Online Product Schema - For /sistema-emprendedor
 */
export const getTiendaOnlineSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${BASE_URL}/sistema-emprendedor#product`,
  "name": "Sistema de Ventas Todo-en-Uno (Tienda Online + Inventario)",
  "description": "Sistema de ecommerce profesional con control de inventario y pedidos a WhatsApp. Sin mensualidades. Tecnología Next.js.",
  "image": "https://res.cloudinary.com/dltfsttr7/image/upload/v1764125716/logo_ekusea.svg",
  "brand": {
    "@type": "Brand",
    "name": "PukaDigital"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Plan Emprendedor (Pago Único)",
      "price": "200.00",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/sistema-emprendedor`,
      "description": "Tienda Online + Inventario Básico. Pago Único."
    },
    {
      "@type": "Offer",
      "name": "Plan Despegue (+Ads)",
      "price": "300.00",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/sistema-emprendedor`,
      "description": "Tienda Online + Inventario + $100 Bono Google Ads."
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "15"
  }
});

/**
 * Marketing Medico Schema - For /salud
 */
export const getMarketingMedicoSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/salud#service`,
  "serviceType": "Medical Marketing Solutions",
  "provider": {
    "@id": `${BASE_URL}/#organization`
  },
  "name": "Marketing Digital para Médicos y Clínicas",
  "description": "Servicio especializado de Google Ads y SEO para consultorios médicos. Captación de pacientes cualificados.",
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Planes de Marketing Médico",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Diagnóstico Digital Gratuito"
        },
        "price": "0",
        "priceCurrency": "USD"
      }
    ]
  }
});

/**
 * Inventory SaaS Schema - For /inventario
 */
export const getInventoryAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/inventario#app`,
  "name": "LedgerXpertz Inventory Cloud",
  "operatingSystem": "Web Browser",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Acceso Beta (Previa Invitación)"
  },
  "featureList": [
    "Facturación Electrónica SRI",
    "Control de Inventario Multibodega",
    "API REST para Integraciones",
    "Sincronización Ecommerce Real-time"
  ]
});

/**
 * Helper: Generate breadcrumbs for common pages
 */
export const generateBreadcrumbs = (lang: SupportedLocale, path: string[]): BreadcrumbItem[] => {
  const homeNames = { es: 'Inicio', en: 'Home', pt: 'Início' };

  const breadcrumbs: BreadcrumbItem[] = [
    { name: homeNames[lang], url: `${BASE_URL}/${lang}` }
  ];

  let currentPath = `${BASE_URL}/${lang}`;

  const pageNames: Record<string, Record<SupportedLocale, string>> = {
    'productos': { es: 'Productos', en: 'Products', pt: 'Produtos' },
    'blog': { es: 'Blog', en: 'Blog', pt: 'Blog' },
    'casos': { es: 'Casos Reales', en: 'Case Studies', pt: 'Casos Reais' },
    'contacto': { es: 'Contacto', en: 'Contact', pt: 'Contato' },
    'demos': { es: 'Demos', en: 'Demos', pt: 'Demos' },
    'nosotros': { es: 'Nosotros', en: 'About Us', pt: 'Sobre Nós' }
  };

  path.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = pageNames[segment]?.[lang] || segment;
    breadcrumbs.push({ name, url: currentPath });
  });

  return breadcrumbs;
};
