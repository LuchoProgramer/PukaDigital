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

/** Sin inversión publicitaria: todo el tráfico es orgánico, directo o social. */
export const ADS_SPEND = 0;

const PAGE_URL = 'https://pukadigital.com/casos/healppypets-carla-tutistar';

export const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      'Caso HealppyPets: posición 2 en Google para su búsqueda principal, sin invertir en publicidad',
    description:
      'Cómo una veterinaria de Carcelén, Quito, llegó al top 3 de Google para su búsqueda local principal con SEO orgánico y cero inversión en anuncios.',
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
          text: `Sí. HealppyPets, una veterinaria de Carcelén en Quito, ocupa la posición ${RANKINGS[0].position.toString().replace('.', ',')} en Google para "veterinaria carcelen" sin haber invertido en anuncios. El tráfico llega por búsqueda orgánica, y su CTR medio es del ${SEO.ctr.toString().replace('.', ',')} %. El SEO local es más lento que la publicidad pagada, pero no tiene costo por clic.`,
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
