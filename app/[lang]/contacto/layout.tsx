import type { Metadata } from "next";
import { type Locale } from "@/i18n.config";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  
  const titles = {
    es: "Contacto - Consulta Gratuita",
    en: "Contact - Free Consultation",
    pt: "Contato - Consulta Gratuita"
  };
  
  const descriptions = {
    es: "Agenda tu entrevista gratuita. Evaluamos tu negocio y diseñamos tu ruta hacia la independencia digital. WhatsApp o formulario.",
    en: "Schedule your free interview. We evaluate your business and design your path to digital independence. WhatsApp or form.",
    pt: "Agende sua entrevista gratuita. Avaliamos seu negócio e desenhamos sua rota para independência digital. WhatsApp ou formulário."
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: ["contacto puka", "consulta gratis", "asesoría digital", "whatsapp puka", "entrevista gratuita"],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      url: `https://pukadigital.com/${locale}/contacto`,
    },
    alternates: {
      canonical: `https://pukadigital.com/${locale}/contacto`,
    },
  };
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
