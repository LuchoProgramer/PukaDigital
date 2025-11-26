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
    es: "Productos y Servicios",
    en: "Products & Services",
    pt: "Produtos e Serviços"
  };
  
  const descriptions = {
    es: "Chatbot IA ($20/mes), Sistema ERP ($20/mes), Web ($20/mes). Precios transparentes. Programa 3 meses $300/mes. Ecuador y LATAM.",
    en: "AI Chatbot ($20/mo), ERP System ($20/mo), Web ($20/mo). Transparent pricing. 3-month program $300/mo. Ecuador & LATAM.",
    pt: "Chatbot IA ($20/mês), Sistema ERP ($20/mês), Web ($20/mês). Preços transparentes. Programa 3 meses $300/mês. Equador e LATAM."
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: [
      "cuanto cuesta chatbot whatsapp",
      "precio erp para pymes ecuador",
      "páginas web $20 mensuales",
      "chatbot ia precios ecuador",
      "sistema facturación electrónica sri precio",
      "mejor precio desarrollo web quito",
      "erp sin contratos ecuador",
      "chatbot restaurantes precio",
      "programa transformación digital 3 meses"
    ],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      url: `https://pukadigital.com/${locale}/productos`,
    },
    alternates: {
      canonical: `https://pukadigital.com/${locale}/productos`,
    },
  };
}

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
