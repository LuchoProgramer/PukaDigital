import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Demos en Vivo";
  const description = "Prueba nuestros sistemas en acción: Chatbot IA, ERP, Calculadora ROI. Sin registros. Sin trampas. Todo funcional y real.";

  return {
    title,
    description,
    keywords: [
      "probar chatbot whatsapp gratis",
      "demo chatbot ia restaurante",
      "calculadora retorno inversión marketing",
      "prueba gratis erp pymes",
      "demo sistema facturación sri",
      "ver chatbot funcionando",
      "ejemplo chatbot whatsapp business"
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://pukadigital.com/demos`,
    },
    alternates: {
      canonical: `https://pukadigital.com/demos`,
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
