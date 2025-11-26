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
    es: "Blog & Academia Digital",
    en: "Blog & Digital Academy",
    pt: "Blog & Academia Digital"
  };
  
  const descriptions = {
    es: "Guías gratuitas de marketing digital, chatbots IA y automatización. Aprende a ser independiente sin pagar agencias. Ecuador y LATAM.",
    en: "Free guides on digital marketing, AI chatbots & automation. Learn to be independent without agencies. Ecuador & LATAM.",
    pt: "Guias gratuitos de marketing digital, chatbots IA e automação. Aprenda a ser independente sem agências. Equador e LATAM."
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: [
      "como crear chatbot whatsapp gratis",
      "tutorial automatización negocios",
      "guía erp para pymes",
      "como dejar de depender agencias marketing",
      "marketing digital sin agencias",
      "herramientas gratis negocios pequeños",
      "que es un chatbot y como funciona",
      "automatizar respuestas whatsapp business"
    ],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      url: `https://pukadigital.com/${locale}/blog`,
    },
    alternates: {
      canonical: `https://pukadigital.com/${locale}/blog`,
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
