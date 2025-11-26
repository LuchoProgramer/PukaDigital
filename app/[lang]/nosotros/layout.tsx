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
    es: "Nosotros - La Historia de Puka Digital",
    en: "About Us - The Puka Digital Story",
    pt: "Sobre Nós - A História da Puka Digital"
  };
  
  const descriptions = {
    es: "Conoce la historia de Luis Viteri y por qué fundó Puka Digital. De una injusticia observada a las 3AM nació la misión de dar dignidad digital a las pymes.",
    en: "Learn about Luis Viteri's story and why he founded Puka Digital. From an observed injustice at 3AM was born the mission to give digital dignity to SMEs.",
    pt: "Conheça a história de Luis Viteri e por que fundou a Puka Digital. De uma injustiça observada às 3 da manhã nasceu a missão de dar dignidade digital às PMEs."
  };

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
    "@id": `${BASE_URL}/${locale}/nosotros#aboutpage`,
    "name": titles[locale],
    "description": descriptions[locale],
    "url": `${BASE_URL}/${locale}/nosotros`,
    "mainEntity": {
      "@id": `${BASE_URL}/#organization`
    },
    "inLanguage": locale === 'es' ? 'es-EC' : locale === 'en' ? 'en-US' : 'pt-BR'
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
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
      title: titles[locale],
      description: descriptions[locale],
      type: 'profile',
      url: `${BASE_URL}/${locale}/nosotros`,
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
      title: titles[locale],
      description: descriptions[locale],
      images: ["https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png"],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/nosotros`,
      languages: {
        'es': `${BASE_URL}/es/nosotros`,
        'en': `${BASE_URL}/en/nosotros`,
        'pt': `${BASE_URL}/pt/nosotros`,
      }
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
