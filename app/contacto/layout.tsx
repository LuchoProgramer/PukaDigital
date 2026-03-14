import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contacto - Consulta Gratuita";
  const description = "Agenda tu entrevista gratuita. Evaluamos tu negocio y diseñamos tu ruta hacia la independencia digital. WhatsApp o formulario.";

  return {
    title,
    description,
    keywords: [
      "consultoría digital gratuita ecuador",
      "asesoría chatbot gratis",
      "cotizar chatbot whatsapp",
      "presupuesto página web ecuador",
      "consulta gratis marketing digital",
      "contactar agencia digital quito",
      "pedir demo chatbot ia"
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://pukadigital.com/contacto`,
    },
    alternates: {
      canonical: `https://pukadigital.com/contacto`,
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
