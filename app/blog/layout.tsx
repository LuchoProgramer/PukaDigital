import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Blog & Academia Digital";
  const description = "Guías gratuitas de marketing digital, chatbots IA y automatización. Aprende a ser independiente sin pagar agencias. Ecuador y LATAM.";

  return {
    title,
    description,
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
      title,
      description,
      type: 'website',
      url: `https://pukadigital.com/blog`,
    },
    alternates: {
      canonical: `https://pukadigital.com/blog`,
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
