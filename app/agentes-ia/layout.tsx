import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PukaIA: CRM con Agentes IA para WhatsApp Business | Desde $14.99/mes',
  description: 'CRM con inteligencia artificial para WhatsApp Business. Inbox centralizado, pipeline Kanban, agendamiento de citas y respuestas 24/7. Alternativa a Mercately desde $14.99/mes. 1 mes gratis.',
  keywords: [
    'crm para whatsapp business',
    'crm con inteligencia artificial',
    'crm con ia para whatsapp',
    'crm barato para pymes',
    'crm whatsapp ecuador',
    'chatbot whatsapp ecuador',
    'chatbot con inteligencia artificial para whatsapp',
    'automatizar ventas whatsapp',
    'alternativa mercately',
    'alternativa sellerchat',
    'whatsapp api business',
    'pukaia',
  ],
  openGraph: {
    title: 'PukaIA: CRM con Agentes IA para WhatsApp Business',
    description: 'CRM con IA para WhatsApp Business. Inbox, pipeline Kanban y respuestas automáticas 24/7. Desde $14.99/mes. Alternativa a Mercately.',
    url: 'https://pukadigital.com/agentes-ia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PukaIA: CRM con IA para WhatsApp | Ecuador',
    description: 'CRM con agentes IA para WhatsApp Business. Desde $14.99/mes. 1 mes gratis para empezar.',
  },
  alternates: {
    canonical: 'https://pukadigital.com/agentes-ia',
  },
};

const pukaIASchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://pukadigital.com/#service-pukaia",
  "name": "PukaIA - Agente de Inteligencia Artificial para WhatsApp",
  "description": "PukaIA automatiza la atención al cliente de negocios ecuatorianos mediante agentes de IA integrados en WhatsApp Business API oficial. Respuestas automáticas 24/7, agendamiento de citas, calificación de prospectos y modo humano con notificación en tiempo real.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "WhatsApp",
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
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "60",
    "priceCurrency": "USD",
    "offerCount": "4"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Planes PukaIA",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Plan Gratuito",
        "description": "300 respuestas del bot por mes. WhatsApp Business API Oficial. Setup self-service.",
        "price": "0",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "Plan Básico",
        "description": "500 respuestas del bot por mes. WhatsApp Business API Oficial. Setup self-service. Sin contratos.",
        "price": "14.99",
        "priceCurrency": "USD",
        "priceSpecification": { "unitText": "mes" }
      },
      {
        "@type": "Offer",
        "name": "Plan Pro",
        "description": "2,000 respuestas del bot por mes. WhatsApp Business API Oficial. Setup self-service. Entrenamiento IA con tu DATA.",
        "price": "25",
        "priceCurrency": "USD",
        "priceSpecification": { "unitText": "mes" }
      },
      {
        "@type": "Offer",
        "name": "Plan Business",
        "description": "6,000 respuestas del bot por mes. Setup asistido incluido (valor $100). WhatsApp Business API Oficial. Soporte especializado.",
        "price": "60",
        "priceCurrency": "USD",
        "priceSpecification": { "unitText": "mes" }
      }
    ]
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo conectar ChatGPT a WhatsApp sin saber programar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nosotros nos encargamos de todo. Integramos modelos de lenguaje natural avanzado directamente a tu WhatsApp Business. No necesitas tocar código; nosotros configuramos los chatbots con IA para que entiendan el contexto de tu negocio y respondan como un humano, no como un robot de botones."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la diferencia entre Twilio y usar la WhatsApp Cloud API oficial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Al usar la Cloud API de WhatsApp directa de Meta con nosotros, te ahorras los recargos ocultos por mensaje que cobran intermediarios como Twilio. Además, tu conexión es oficial, más rápida y perfecta para integrarle Inteligencia Artificial."
      }
    },
    {
      "@type": "Question",
      "name": "¿Me pueden bloquear el número por usar automatización o scripts no oficiales?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Al utilizar la API de WhatsApp Business oficial aprobada por Meta, tu número está 100% seguro. Evitas el riesgo de baneos masivos que ocurren al usar herramientas piratas, extensiones dudosas o Callmebot."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuáles son los precios de WhatsApp API y cuánto cuesta la IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Meta cobra unos centavos por conversación iniciada, pero nuestra plataforma te da planes flexibles desde $14.99/mes por el cerebro de la IA. Lo mejor: te regalamos 300 interacciones gratis para que valides cómo la WhatsApp IA aumenta tus ventas antes de comprometerte. Sin contratos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué pasa si la IA no sabe responder o el cliente pide un humano?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El agente es inteligente: si detecta una pregunta fuera de su conocimiento o una queja, pausa la automatización y te notifica al instante. Puedes tomar el control del chat desde tu celular y cerrar la venta manualmente sin que el cliente note la transición."
      }
    },
    {
      "@type": "Question",
      "name": "¿Para qué tipo de empresas funciona automatizar ventas por WhatsApp?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Es la solución definitiva para negocios con alto volumen de mensajes: clínicas que necesitan agendar citas, hoteles gestionando reservas, tiendas físicas y agencias en Ecuador y toda Latinoamérica. En 24 horas tienes tu bot funcionando."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué hago si me suspendieron WhatsApp Business o tengo el número bloqueado?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Si tienes tu WhatsApp Business bloqueado o la aplicación no te deja enviar mensajes, probablemente Meta detectó el uso de aplicaciones piratas, envíos masivos (spam) o herramientas no autorizadas. Aunque te ayudamos con buenas prácticas para recuperar tu cuenta de WhatsApp Business suspendida, la única forma definitiva de evitar que esto vuelva a pasar es migrando a la API Oficial de WhatsApp. Nosotros conectamos tu número directamente a los servidores de Meta, blindando tu línea para siempre y permitiéndote usar nuestra Inteligencia Artificial de forma 100% legal y segura."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué es un CRM para WhatsApp y para qué sirve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un CRM para WhatsApp es una plataforma que centraliza todas las conversaciones de WhatsApp Business en un inbox unificado, organiza los contactos en un pipeline de ventas tipo Kanban y automatiza respuestas con inteligencia artificial. A diferencia de la app normal de WhatsApp, permite que múltiples agentes atiendan desde un solo número, ver el historial completo de cada cliente y medir resultados con reportes. PukaIA es un CRM para WhatsApp con agentes IA integrados, disponible desde $14.99/mes para negocios en Ecuador y LATAM."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cu&aacute;nto cuesta un CRM para WhatsApp en Ecuador?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los CRM para WhatsApp en Ecuador varían ampliamente en precio. Mercately cobra desde $99/mes, Zolutium desde $79/mes y Sellerchat desde $49/mes. PukaIA ofrece CRM con agentes IA integrados desde $14.99/mes (Plan Básico) hasta $60/mes (Plan Business), con 1 mes gratis para empezar. Es la opción más económica del mercado ecuatoriano con inteligencia artificial incluida."
      }
    },
    {
      "@type": "Question",
      "name": "¿C&oacute;mo enviar mensajes masivos en WhatsApp y contactar clientes sin agregarlos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Si buscas cómo enviar mensajes masivos por WhatsApp sin que te bloqueen, debes usar la API de WhatsApp Business. A diferencia de las listas de difusión, aquí no necesitas guardar el contacto en tu teléfono. Sin embargo, Meta exige reglas estrictas contra el spam: todo envío masivo de WhatsApp debe hacerse mediante Plantillas de Mensaje pre-aprobadas. Nosotros te asesoramos en la creación de estas campañas de marketing, gestionamos la aprobación de tus plantillas con Meta y aseguramos que cumplas las normativas. Lo más poderoso: una vez que lanzas la campaña y tu cliente responde, nuestro agente de Inteligencia Artificial toma el control del chat al instante para cerrar la venta."
      }
    }
  ]
};

export default function AgentesIALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pukaIASchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
