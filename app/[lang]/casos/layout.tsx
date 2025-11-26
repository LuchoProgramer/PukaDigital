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
    es: "Casos de Éxito - Clientes Reales",
    en: "Success Stories - Real Clients",
    pt: "Casos de Sucesso - Clientes Reais"
  };
  
  const descriptions = {
    es: "Historias reales de pymes en Ecuador que lograron independencia digital. Cristina (podología), Carla (veterinaria), Hotel Eudiq. Resultados verificables.",
    en: "Real stories of SMBs in Ecuador who achieved digital independence. Cristina (podiatry), Carla (veterinary), Hotel Eudiq. Verifiable results.",
    pt: "Histórias reais de PMEs no Equador que alcançaram independência digital. Cristina (podologia), Carla (veterinária), Hotel Eudiq. Resultados verificáveis."
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    keywords: [
      "casos éxito chatbot whatsapp",
      "testimonios pymes ecuador",
      "resultados marketing digital real",
      "clientes satisfechos agencia digital",
      "transformación digital pymes ecuador",
      "historias éxito automatización",
      "roi chatbot whatsapp real",
      "antes después marketing digital"
    ],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      url: `https://pukadigital.com/${locale}/casos`,
    },
    alternates: {
      canonical: `https://pukadigital.com/${locale}/casos`,
    },
  };
}

export default function CasosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
