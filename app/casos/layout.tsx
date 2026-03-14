import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Casos de Éxito - Clientes Reales";
  const description = "Historias reales de pymes en Ecuador que lograron independencia digital. Cristina (podología), Carla (veterinaria), Hotel Eudiq. Resultados verificables.";

  return {
    title,
    description,
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
      title,
      description,
      type: 'website',
      url: `https://pukadigital.com/casos`,
    },
    alternates: {
      canonical: `https://pukadigital.com/casos`,
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
