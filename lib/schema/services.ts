/**
 * Specialized Service Schemas for PukaDigital
 * Optimized for AI Crawlers and Spanish-only SEO
 */

const BASE_URL = 'https://pukadigital.com';

export const webDevServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-web`,
  "name": "Desarrollo Web de Alto Rendimiento",
  "description": "Desarrollo de sitios web estratégicos con Next.js enfocados en conversión y velocidad extrema. Ingeniería de software diseñada para dominar los resultados de búsqueda en Ecuador.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Desarrollo Web",
  "url": `${BASE_URL}/agencia`
};

export const googleAdsServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-google-ads`,
  "name": "Gestión de Google Ads y SEO Estratégico",
  "description": "Optimización de campañas de búsqueda y posicionamiento orgánico mediante minería de datos. Maximizamos el retorno de inversión publicitaria para empresas ecuatorianas.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Marketing en Buscadores",
  "url": `${BASE_URL}/agencia`
};

export const whatsappAgentsServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-whatsapp`,
  "name": "Agentes de IA para WhatsApp Business",
  "description": "Implementación de asistentes virtuales inteligentes que automatizan ventas y atención al cliente 24/7. Integración directa con flujos de negocio y CRM.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Automatización de Ventas",
  "url": `${BASE_URL}/agentes-ia`
};

export const medicalRecordsServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-medical`,
  "name": "PukaHealth - Gestión de Historias Clínicas",
  "description": "Software especializado PukaHealth para médicos y clínicas que deseen digitalizar su consulta. Seguridad de datos, recetas electrónicas y acceso desde cualquier dispositivo.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Software Médico",
  "url": `${BASE_URL}/historias-clinicas`
};

export const erpServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-erp`,
  "name": "Sistemas ERP y Software a Medida",
  "description": "Desarrollo de soluciones empresariales personalizadas para control de inventario, facturación y CRM. Transformación digital técnica para PYMEs en crecimiento.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Desarrollo de Software Empresarial",
  "url": `${BASE_URL}/sistema`
};
