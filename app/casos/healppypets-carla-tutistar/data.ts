// app/casos/healppypets-carla-tutistar/data.ts
//
// Datos del caso HealppyPets. Cifras verificadas con fecha de corte 2026-08-29.
// Al actualizarlas, mover también DATA_CUTOFF.
//
// Fuentes:
//   - Google Search Console, propiedad de dominio healppypets.com (16 meses).
//   - Google Analytics 4, propiedad "Sitio Web de Healppy Pets" (505929117),
//     últimos 28 días.
//   - Datos públicos del negocio: healppypets.com
//
// Las cifras de GSC y GA4 son datos de negocio de la clienta y se publican con
// su autorización.
//
// IMPORTANTE — sobre lo que NO está aquí:
// La página anterior afirmaba "Top 1 en ChatGPT para veterinaria Carcelén".
// Esa afirmación se retiró porque no es verificable: los asistentes de IA no
// devuelven rankings estables ni reproducibles entre usuarios, sesiones y
// fechas. La posición en Google sí es auditable y es la que se publica.
//
// Los eventos clave de GA4 (whatsapp_click, phone_click) se marcaron como
// conversiones el 2026-08-29 y no cuentan de forma retroactiva. Las cifras de
// contacto de abajo salen del recuento bruto de eventos, no del informe de
// conversiones, y por eso se describen como "contactos" y no como "conversiones".

export const DATA_CUTOFF = '2026-08-29';

/** Search Console — acumulado 16 meses. */
export const SEO = {
  clicks: 166,
  impressions: 5460,
  ctr: 3.0,
  avgPosition: 10.2,
};

/** Posiciones en consultas locales con intención comercial. */
export const RANKINGS: { query: string; position: number; clicks: number; ctr: number }[] = [
  { query: 'veterinaria carcelen', position: 2.2, clicks: 17, ctr: 5.3 },
  { query: 'peluquería canina', position: 1.3, clicks: 1, ctr: 33.3 },
  { query: 'peluqueria carcelen', position: 11.1, clicks: 1, ctr: 6.7 },
];

/** GA4 — últimos 28 días. */
export const GA4 = {
  users: 32,
  sessions: 35,
  whatsappClicks: 12,
  whatsappUsers: 10,
  phoneClicks: 1,
  organicEngagementRate: 80,
  organicAvgTime: 53,
};

/**
 * Google Ads. La clienta probó publicidad tres semanas en enero de 2026 y la
 * detuvo: el posicionamiento orgánico ya le llenaba la agenda. Las dos campañas
 * llevan pausadas desde entonces y la cuenta no ha vuelto a gastar.
 *
 * Verificado en la cuenta 216-637-4423 el 2026-08-29:
 *   8 ene 2026   0 clics, aún sin arrancar
 *   20 ene 2026  8 clics
 *   31 ene 2026  36 clics, el máximo
 *   5 feb 2026   0 clics, detenido
 *   feb-ago      sin actividad
 *
 * Las 46 "conversiones" son clics al botón de WhatsApp, no pacientes: la acción
 * de conversión configurada mide el clic, no la conversación ni la cita. Por eso
 * el costo por conversión no se presenta como un logro.
 */
export const ADS = {
  spend: 47.74,
  clicks: 168,
  impressions: 2967,
  ctr: 5.66,
  conversions: 46,
  weeksActive: 3,
  month: 'enero de 2026',
  campaigns: [
    { name: 'Búsqueda', type: 'Search', spend: 34.02, conversions: 14 },
    { name: 'Performance Max', type: 'Performance Max', spend: 13.72, conversions: 32 },
  ],
};

const PAGE_URL = 'https://pukadigital.com/casos/healppypets-carla-tutistar';

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      'Caso HealppyPets: probó publicidad tres semanas y la dejó porque el orgánico le bastaba',
    description:
      'Una veterinaria de Carcelén, Quito, en posición 2 de Google para su búsqueda principal. Probó Google Ads en enero de 2026, lo detuvo a las tres semanas y siguió creciendo con SEO orgánico.',
    author: { '@type': 'Organization', name: 'PukaDigital', url: 'https://pukadigital.com' },
    publisher: { '@type': 'Organization', name: 'PukaDigital', url: 'https://pukadigital.com' },
    datePublished: '2026-01-07',
    dateModified: DATA_CUTOFF,
    mainEntityOfPage: PAGE_URL,
    inLanguage: 'es-EC',
    about: {
      '@type': 'VeterinaryCare',
      name: 'HealppyPets',
      description:
        'Veterinaria en Carcelén, Quito: consulta veterinaria, peluquería canina, vacunación y desparasitación.',
      url: 'https://www.healppypets.com',
      telephone: '+593987005084',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Clemente Yerovi Indaburu Oe143 y OE1B',
        addressLocality: 'Quito',
        addressRegion: 'Pichincha',
        addressCountry: 'EC',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -0.0934333,
        longitude: -78.4740052,
      },
      founder: { '@type': 'Person', name: 'Carla Vanesa Tutistar' },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Se puede posicionar un negocio local en Google sin pagar publicidad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Sí. HealppyPets, una veterinaria de Carcelén en Quito, ocupa la posición ${RANKINGS[0].position.toString().replace('.', ',')} en Google para "veterinaria carcelen" con tráfico orgánico, y su CTR medio es del ${SEO.ctr.toString().replace('.', ',')} %. Probó publicidad pagada durante tres semanas en enero de 2026 y la detuvo porque el orgánico ya le llenaba la agenda. El SEO local es más lento que los anuncios, pero no tiene costo por clic y no se apaga cuando dejas de pagar.`,
        },
      },
      {
        '@type': 'Question',
        name: '¿Conviene pagar Google Ads si ya apareces primero en Google gratis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Depende de si quieres crecer por encima de tu capacidad actual. HealppyPets probó Google Ads tres semanas en enero de 2026: ${ADS.clicks} clics y $${ADS.spend.toFixed(2)} de inversión. Detuvo las campañas porque el posicionamiento orgánico ya le llenaba la agenda, y pagar por tráfico que ya llegaba gratis no le añadía pacientes. La publicidad tiene sentido cuando la demanda orgánica se queda corta, no antes.`,
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto tarda el SEO local en dar resultados en Ecuador?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En HealppyPets el posicionamiento sostenido tomó cerca de diez meses desde la publicación del sitio. Las búsquedas de marca y las muy locales aparecen antes; las genéricas y las informativas tardan más y compiten contra sitios de otros países.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué buscan en Google los clientes de una veterinaria?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Las consultas que convierten son locales y concretas: "veterinaria carcelen", "peluquería canina", "veterinaria cerca de mí". Las búsquedas informativas amplias, como los calendarios de vacunación, generan muchas impresiones pero casi ningún clic, porque compiten a escala nacional o global sin anclaje a una ciudad.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuánto cuesta una consulta veterinaria en Carcelén, Quito?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En HealppyPets la consulta veterinaria parte de $20, la peluquería canina de $15 y la vacunación de $12. Los precios están publicados en healppypets.com.',
        },
      },
    ],
  },
];
