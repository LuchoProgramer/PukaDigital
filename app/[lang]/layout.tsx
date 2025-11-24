import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { i18n, type Locale } from "@/i18n.config";

const geistSans = Geist({
  variable: "--font-futura",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  
  const titles = {
    es: "PukaDigital - Construimos Dignidad Digital",
    en: "PukaDigital - We Build Digital Dignity",
    pt: "PukaDigital - Construímos Dignidade Digital"
  };
  
  const descriptions = {
    es: "Independencia tecnológica para pymes en Ecuador. Aprende a gestionar tu web, chatbot y ERP en 3 meses. Sin contratos eternos.",
    en: "Tech independence for SMEs in Ecuador. Learn to manage your web, chatbot & ERP in 3 months. No eternal contracts.",
    pt: "Independência tecnológica para PMEs no Equador. Aprenda a gerir web, chatbot e ERP em 3 meses. Sem contratos eternos."
  };
  
  const localeMap = {
    es: 'es_ES',
    en: 'en_US',
    pt: 'pt_BR'
  };

  return {
    metadataBase: new URL('https://pukadigital.com'),
    title: {
      default: titles[locale],
      template: `%s | PukaDigital`
    },
    description: descriptions[locale],
    keywords: [
      // Propuesta de valor principal
      "independencia digital", "autonomía tecnológica", "educación digital pymes",
      // Servicios específicos
      "chatbot ia whatsapp", "chatbot para restaurantes", "chatbot pymes ecuador",
      "sistema erp pymes", "erp fácil ecuador", "gestión inventario automática",
      "desarrollo web ecuador", "página web profesional", "sitio web pymes",
      // Localización
      "agencia marketing digital ecuador", "transformación digital quito", "consultoría tecnológica latam",
      "servicios digitales ecuador", "marketing digital latinoamérica",
      // Diferenciadores
      "sin contratos eternos", "precios transparentes tecnología", "aprende a gestionar tu web",
      "programa 3 meses independencia digital", "educación intensiva marketing",
      // Long-tail específicas
      "como automatizar whatsapp negocio", "gestionar inventario sin excel",
      "dejar de depender agencias marketing", "aprender marketing digital desde cero"
    ],
    authors: [{ name: "PukaDigital", url: "https://pukadigital.com" }],
    creator: "PukaDigital",
    publisher: "PukaDigital",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/pegaso-rojo-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
        { url: '/pegaso-rojo-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
        { url: '/pegaso-rojo-48x48.svg', sizes: '48x48', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/pegaso-rojo-180x180.svg', sizes: '180x180', type: 'image/svg+xml' },
      ],
      other: [
        { rel: 'mask-icon', url: '/pegaso-rojo.svg', color: '#c7171e' },
      ],
    },
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: localeMap[locale],
      url: `https://pukadigital.com/${locale}`,
      title: titles[locale],
      description: descriptions[locale],
      siteName: 'PukaDigital',
      images: [
        {
          url: '/pegaso-rojo-512x512.svg',
          width: 512,
          height: 512,
          alt: 'PukaDigital Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale],
      description: descriptions[locale],
      images: ['/pegaso-rojo-512x512.svg'],
      creator: '@pukadigital',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://pukadigital.com/${locale}`,
      languages: {
        'es': 'https://pukadigital.com/es',
        'en': 'https://pukadigital.com/en',
        'pt': 'https://pukadigital.com/pt',
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const locale = lang as Locale;

  // Organization Schema (sitewide)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://pukadigital.com/#organization",
    "name": "PukaDigital",
    "url": "https://pukadigital.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pukadigital.com/logo-Puka.svg",
      "width": 512,
      "height": 512
    },
    "image": "https://pukadigital.com/pegaso-rojo-512x512.svg",
    "description": "Educación digital para PYMEs. 3 meses de capacitación intensiva = Independencia tecnológica de por vida. No construimos dependencia, construimos dignidad.",
    "email": "hola@pukadigital.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EC",
      "addressRegion": "Pichincha",
      "addressLocality": "Quito"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Ecuador"
      },
      {
        "@type": "Place",
        "name": "Latin America"
      }
    ],
    "knowsAbout": [
      "Digital Marketing",
      "Web Development",
      "AI Chatbots",
      "ERP Systems",
      "Digital Independence",
      "SME Technology Education"
    ],
    "sameAs": [
      "https://github.com/LuchoProgramer/PukaDigital"
    ],
    "founder": {
      "@type": "Person",
      "name": "PukaDigital Team"
    }
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://pukadigital.com/#service",
    "serviceType": "Digital Independence Program",
    "provider": {
      "@id": "https://pukadigital.com/#organization"
    },
    "name": "Programa de Independencia Digital 3 Meses",
    "description": "Programa educativo intensivo que enseña a PYMEs a gestionar su propia presencia digital: desarrollo web, chatbots IA, sistemas ERP y marketing digital.",
    "offers": {
      "@type": "Offer",
      "price": "900",
      "priceCurrency": "USD",
      "description": "$300/mes por 3 meses. Incluye $100/mes en Google Ads.",
      "availability": "https://schema.org/InStock",
      "url": "https://pukadigital.com/productos"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ecuador"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Modulares Post-Programa",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Chatbot IA WhatsApp",
            "description": "Asistente virtual con inteligencia artificial para automatización 24/7"
          },
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sistema ERP Cloud",
            "description": "Gestión de inventario, CRM y facturación en la nube"
          },
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CMS + Hosting Optimizado",
            "description": "Alojamiento Next.js con editor visual y SEO automático"
          },
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          }
        }
      ]
    }
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://pukadigital.com/#website",
    "url": "https://pukadigital.com",
    "name": "PukaDigital",
    "description": "Independencia Digital para PYMEs en Ecuador y LATAM",
    "publisher": {
      "@id": "https://pukadigital.com/#organization"
    },
    "inLanguage": ["es", "en", "pt"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://pukadigital.com/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#c7171e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href={`https://pukadigital.com/${locale}`} />
        <link rel="alternate" hrefLang="es" href="https://pukadigital.com/es" />
        <link rel="alternate" hrefLang="en" href="https://pukadigital.com/en" />
        <link rel="alternate" hrefLang="pt" href="https://pukadigital.com/pt" />
        <link rel="alternate" hrefLang="x-default" href="https://pukadigital.com/es" />
        
        {/* Organization + Service + WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [organizationSchema, serviceSchema, websiteSchema]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider initialLanguage={locale}>
            <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 md:pb-0">
              <Navbar lang={locale} />
              <main className="flex-grow">
                {children}
              </main>
              <Footer lang={locale} />
              <MobileBottomNav lang={locale} />
              <FloatingWhatsApp />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
