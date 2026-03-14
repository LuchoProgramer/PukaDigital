import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Productos y Servicios";
  const description = "Chatbot IA ($20/mes), Sistema ERP ($20/mes), Web ($20/mes). Precios transparentes. Programa 3 meses $300/mes. Ecuador y LATAM.";

  return {
    title,
    description,
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
      title,
      description,
      type: 'website',
      url: `https://pukadigital.com/productos`,
    },
    alternates: {
      canonical: `https://pukadigital.com/productos`,
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
