import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agente de Inteligencia Artificial para WhatsApp en Ecuador | PukaIA',
  description: 'Automatiza la atención al cliente de tu negocio en WhatsApp con IA. Respuestas 24/7, agenda citas solo, califica prospectos. Prueba el bot en vivo ahora. Desde $20/mes.',
  keywords: [
    'agente ia whatsapp ecuador', 'chatbot whatsapp inteligencia artificial',
    'automatizar whatsapp negocios ecuador', 'pukaia', 'chatbot whatsapp ecuador',
    'inteligencia artificial whatsapp business', 'automatizacion atencion cliente ecuador'
  ],
  openGraph: {
    title: 'Agente IA para WhatsApp en Ecuador | PukaIA',
    description: 'Responde 24/7, agenda citas y califica prospectos en WhatsApp con IA. Prueba el bot en vivo. Desde $20/mes.',
    url: 'https://pukadigital.com/agentes-ia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agente IA para WhatsApp Ecuador | PukaIA',
    description: 'Automatiza tu atención al cliente en WhatsApp con IA. 24/7, desde $20/mes. Prueba el bot ahora.',
  },
  alternates: {
    canonical: 'https://pukadigital.com/agentes-ia',
  },
};

const pukaIASchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://pukadigital.com/#service-pukaia",
  "name": "PukaIA - Agente de Inteligencia Artificial para WhatsApp",
  "description": "PukaIA automatiza la atención al cliente de negocios ecuatorianos mediante agentes de IA integrados en WhatsApp Business API oficial. Respuestas automáticas 24/7, agendamiento de citas, calificación de prospectos y modo humano con notificación en tiempo real.",
  "serviceType": "Inteligencia Artificial para Negocios",
  "url": "https://pukadigital.com/agentes-ia",
  "inLanguage": "es-EC",
  "provider": {
    "@id": "https://pukadigital.com/#organization"
  },
  "areaServed": [
    { "@type": "City", "name": "Quito" },
    { "@type": "City", "name": "Guayaquil" },
    { "@type": "City", "name": "Cuenca" },
    { "@type": "Country", "name": "Ecuador" }
  ],
  "knowsAbout": [
    "WhatsApp Business API",
    "Inteligencia Artificial",
    "Automatización de ventas",
    "Ecuador",
    "GPT-4",
    "Chatbots conversacionales",
    "Calificación de prospectos"
  ],
  "offers": {
    "@type": "Offer",
    "price": "20",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "20",
      "priceCurrency": "USD",
      "unitText": "mes"
    },
    "availability": "https://schema.org/InStock",
    "trialDays": 7
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Planes PukaIA",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Plan Mensual",
        "description": "Suscripción mensual con 5,000 mensajes, WhatsApp Business API oficial, entrenamiento IA y soporte especializado.",
        "price": "20",
        "priceCurrency": "USD",
        "priceSpecification": { "unitText": "mes" }
      },
      {
        "@type": "Offer",
        "name": "Programa de 3 Meses con Implementación",
        "description": "Implementación completa incluida, acompañamiento mensual y configuración personalizada del agente IA.",
        "price": "300",
        "priceCurrency": "USD",
        "priceSpecification": { "unitText": "mes" }
      },
      {
        "@type": "Offer",
        "name": "Prueba Gratuita",
        "description": "7 días de prueba gratis sin tarjeta de crédito ni contratos.",
        "price": "0",
        "priceCurrency": "USD"
      }
    ]
  }
};

export default function AgentesIALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pukaIASchema) }}
      />
      {children}
    </>
  );
}
