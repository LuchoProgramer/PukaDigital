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
  "@id": `${BASE_URL}/#service-pukaia`,
  "name": "PukaIA - Agentes de Inteligencia Artificial para WhatsApp",
  "description": "PukaIA automatiza la atención al cliente de empresas ecuatorianas mediante la Cloud API Oficial de WhatsApp con soporte de Coexistencia móvil (Meta Tech Provider). Respuestas automáticas 24/7, calificación de prospectos y agendamiento sin riesgo de baneo.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Meta Tech Provider - WhatsApp Business Automation",
  "url": `${BASE_URL}/agentes-ia`,
  "inLanguage": "es-EC"
};

export const pukaHealthServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-pukahealth`,
  "name": "PukaHealth - Historias Clínicas Electrónicas y Facturación SRI",
  "description": "Software médico en la nube para consultorios y clínicas en Ecuador: historias clínicas, facturación electrónica SRI y WhatsApp Oficial en Coexistencia para médicos sin perder la app móvil.",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  },
  "serviceType": "Software Médico y Gestión Clínica",
  "url": `${BASE_URL}/pukahealth`,
  "inLanguage": "es-EC"
};

export const pukaSaludServiceSchema = {
  "@type": "Service",
  "@id": `${BASE_URL}/#service-pukasalud`,
  "name": "PukaSalud - Marketing Digital para Médicos",
  "description": "Servicio especializado de Google Ads y posicionamiento web para consultorios y clínicas en Ecuador. Captación de pacientes mediante búsqueda orgánica y publicidad de pago.",
  "serviceType": "Marketing Digital Médico",
  "url": `${BASE_URL}/salud`,
  "inLanguage": "es-EC",
  "provider": { "@id": `${BASE_URL}/#organization` },
  "areaServed": {
    "@type": "Country",
    "name": "Ecuador"
  }
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
