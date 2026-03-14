import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Nosotros - La Historia de Puka Digital";
  const description = "Conoce la historia de Luis Viteri y por qué fundó Puka Digital. De una injusticia observada a las 3AM nació la misión de dar dignidad digital a las pymes.";
  const BASE_URL = 'https://pukadigital.com';

  // ProfilePage Schema for the founder
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": "2025-08-02",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntity": {
      "@type": "Person",
      "@id": `${BASE_URL}/#founder`,
      "name": "Luis Omar Viteri Sarango",
      "alternateName": "LuchoDev",
      "description": "Fundador de Puka Digital. Autodidacta con 3 años de experiencia en transformación digital para pymes en Ecuador y Latinoamérica.",
      "image": "https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png",
      "jobTitle": "Fundador & Digital Strategist",
      "worksFor": {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Puka Digital"
      },
      "sameAs": [
        "https://www.linkedin.com/in/luisviteri/",
        "https://www.instagram.com/luchodev_/"
      ],
      "knowsAbout": [
        "Digital Marketing",
        "AI Chatbots",
        "Web Development",
        "ERP Systems",
        "WhatsApp Business Automation",
        "SME Digital Transformation"
      ],
      "email": "luis.viteri@pukadigital.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Quito",
        "addressRegion": "Pichincha",
        "addressCountry": "EC"
      }
    }
  };

  // AboutPage Schema
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/nosotros#aboutpage`,
    "name": title,
    "description": description,
    "url": `${BASE_URL}/nosotros`,
    "mainEntity": {
      "@id": `${BASE_URL}/#organization`
    },
    "inLanguage": 'es-EC'
  };

  return {
    title,
    description,
    keywords: [
      "Luis Viteri",
      "Puka Digital fundador",
      "historia puka digital",
      "agencia digital quito historia",
      "emprendedor digital ecuador",
      "autodidacta digital",
      "dignidad digital pymes",
      "independencia tecnológica ecuador"
    ],
    authors: [{ name: "Luis Omar Viteri Sarango", url: "https://www.linkedin.com/in/luisviteri/" }],
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${BASE_URL}/nosotros`,
      images: [
        {
          url: "https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png",
          width: 400,
          height: 400,
          alt: "Luis Omar Viteri Sarango - Fundador de Puka Digital"
        }
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: ["https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png"],
    },
    alternates: {
      canonical: `${BASE_URL}/nosotros`
    },
    other: {
      'script:ld+json': JSON.stringify([profilePageSchema, aboutPageSchema])
    }
  };
}

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
