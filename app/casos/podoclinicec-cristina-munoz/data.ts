// app/casos/podoclinicec-cristina-munoz/data.ts
//
// Datos del caso PodoclinicEC. Todas las cifras están verificadas contra la fuente
// y con fecha de corte 2026-08-28. Al actualizarlas, mover también DATA_CUTOFF.
//
// Fuentes:
//   - Google Ads, cuenta PodoclinicEC (398-809-2521), rango "All time":
//     16 sep 2025 – 28 ago 2026.
//   - Google Search Console, propiedad de dominio podoclinicec.com.
//   - Google Analytics 4, propiedad PodoClinic EC (478211821), últimos 28 días.
//   - Perfil público de Google Business y podoclinicec.com.
//
// Las cifras de Ads, GA4 y GSC son datos de negocio de la clienta y se publican
// con su autorización expresa.

export const DATA_CUTOFF = '2026-08-28';
export const START_DATE = '2025-09-16'; // primera campaña activa en Google Ads

/** Google Ads — acumulado desde el arranque de la cuenta. */
export const ADS = {
  clicks: 2520,
  avgCpc: 0.37,
  conversions: 371,
  costPerConversion: 2.52,
  totalSpend: 933, // derivado: conversions × costPerConversion
  months: 11,
};

/** Search Console — jun-ago 2026 contra el mismo periodo de 2025 (antes de empezar). */
export const SEO_YOY = {
  clicksBefore: 2,
  clicksAfter: 281,
  impressionsBefore: 204,
  impressionsAfter: 19700,
  positionBefore: 17.2,
  positionAfter: 6.6,
};

/** Search Console — acumulado 16 meses. */
export const SEO_TOTAL = {
  clicks: 842,
  impressions: 58500,
  queries: 1000,
};

/** Posiciones actuales en consultas con intención comercial. */
export const RANKINGS: { query: string; position: number; clicks: number }[] = [
  { query: 'podólogo quito precios', position: 2.9, clicks: 11 },
  { query: 'podólogo quito norte', position: 3.0, clicks: 27 },
  { query: 'podologo quito precios', position: 3.4, clicks: 8 },
  { query: 'podologos quito norte', position: 4.4, clicks: 4 },
  { query: 'podologo quito', position: 6.5, clicks: 65 },
];

/** Google Business Profile: PodoclinicEC frente a su competencia directa en Maps. */
export const REVIEWS = { rating: 5.0, count: 56, startCount: 3 };

export const COMPETITORS: { name: string; rating: number | null; count: number }[] = [
  { name: 'PodoClinic EC', rating: 5.0, count: 56 },
  { name: 'PODOCENTER', rating: 5.0, count: 10 },
  { name: 'Centro Podológico CHAKI', rating: 4.8, count: 9 },
  { name: 'PodoFamilyEc', rating: 5.0, count: 6 },
  { name: 'Podo-Spa', rating: null, count: 0 },
];

/** GA4 — últimos 28 días. */
export const GA4 = {
  sessions: 434,
  keyEvents: 143,
  paidSearchConversion: 25.7,
  organicConversion: 16.4,
};

const PAGE_URL = 'https://pukadigital.com/casos/podoclinicec-cristina-munoz';

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      'Caso PodoclinicEC: 371 conversiones a $2,52 y de 2 a 281 clics orgánicos en 11 meses',
    description:
      'Cómo una consulta de podología en Quito Norte pasó de ser invisible en Google a liderar su categoría local: 371 conversiones a $2,52 cada una, 56 reseñas 5.0 y top 3 en las búsquedas con intención de compra.',
    author: { '@type': 'Organization', name: 'PukaDigital', url: 'https://pukadigital.com' },
    publisher: { '@type': 'Organization', name: 'PukaDigital', url: 'https://pukadigital.com' },
    datePublished: '2025-12-02',
    dateModified: DATA_CUTOFF,
    mainEntityOfPage: PAGE_URL,
    inLanguage: 'es-EC',
    about: {
      '@type': 'MedicalBusiness',
      name: 'PodoClinic EC',
      description: 'Consulta de podología clínica en Quito Norte, Ecuador.',
      url: 'https://podoclinicec.com',
      telephone: '+593995832788',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Manuel Jordán y Av. La Florida',
        addressLocality: 'Quito',
        addressRegion: 'Pichincha',
        addressCountry: 'EC',
      },
      founder: {
        '@type': 'Person',
        name: 'Yadira Cristina Muñoz',
        jobTitle: 'Especialista en Podología',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: REVIEWS.rating.toFixed(1),
        reviewCount: REVIEWS.count,
        bestRating: '5',
        worstRating: '1',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuánto invirtió PodoclinicEC en Google Ads y qué obtuvo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Entre el 16 de septiembre de 2025 y el 28 de agosto de 2026, PodoclinicEC invirtió alrededor de $${ADS.totalSpend} en Google Ads y obtuvo ${ADS.conversions} conversiones, a un costo promedio de $${ADS.costPerConversion} cada una, con un CPC medio de $${ADS.avgCpc}.`,
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto creció el tráfico orgánico de PodoclinicEC?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Comparando junio-agosto de 2026 contra el mismo periodo de 2025, los clics desde búsqueda orgánica pasaron de ${SEO_YOY.clicksBefore} a ${SEO_YOY.clicksAfter}, y las impresiones de ${SEO_YOY.impressionsBefore} a ${SEO_YOY.impressionsAfter.toLocaleString('es-EC')}. La posición media mejoró de ${SEO_YOY.positionBefore} a ${SEO_YOY.positionAfter}.`,
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta captar un paciente con Google Ads en Ecuador?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `En el caso de PodoclinicEC, una consulta de podología en Quito Norte, el costo por conversión fue de $${ADS.costPerConversion} con un CPC promedio de $${ADS.avgCpc}. El costo depende de la competencia de la categoría y de la calidad de la landing page: una página rápida y relevante baja el costo por clic.`,
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto tarda en verse resultados de SEO local en Ecuador?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En PodoclinicEC las primeras conversiones por Google Ads llegaron en el mes 2, y el tráfico orgánico sostenido tomó cerca de 6 meses en consolidarse. A los 11 meses la consulta rankeaba en el top 3 para las búsquedas con intención de compra de su ciudad.',
        },
      },
    ],
  },
];
