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
    es: "Demos en Vivo",
    en: "Live Demos",
    pt: "Demos ao Vivo"
  };
  
  const descriptions = {
    es: "Prueba nuestros sistemas en acción: Chatbot IA, ERP, Calculadora ROI. Sin registros. Sin trampas. Todo funcional y real.",
    en: "Try our systems in action: AI Chatbot, ERP, ROI Calculator. No sign-ups. No tricks. Everything functional and real.",
    pt: "Experimente nossos sistemas em ação: Chatbot IA, ERP, Calculadora ROI. Sem cadastros. Sem truques. Tudo funcional e real."
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: ["demo chatbot", "prueba erp", "calculadora roi", "demostración gratis", "sistemas en vivo"],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      url: `https://pukadigital.com/${locale}/demos`,
    },
    alternates: {
      canonical: `https://pukadigital.com/${locale}/demos`,
    },
  };
}

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
