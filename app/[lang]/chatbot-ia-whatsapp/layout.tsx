import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chatbot IA WhatsApp para PYMEs Ecuador | Desde $20/mes | PukaDigital',
  description: 'Automatiza atención al cliente 24/7 con inteligencia artificial en WhatsApp. GPT-4, calificación de leads, respuestas inteligentes. Implementación en 2 semanas. Caso de éxito: 60% menos consultas repetitivas.',
  keywords: 'chatbot whatsapp ecuador, asistente virtual pymes, chatbot ia quito, whatsapp business api, automatizacion atencion cliente, chatbot gpt-4, chatbot whatsapp business, asistente virtual inteligente',
  openGraph: {
    title: 'Chatbot IA WhatsApp para PYMEs Ecuador | PukaDigital',
    description: 'Automatiza el 60% de consultas repetitivas con IA en WhatsApp. Desde $20/mes todo incluido.',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
