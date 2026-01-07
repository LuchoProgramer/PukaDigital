import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SmartChatbot from "@/components/SmartChatbot";
import { i18n, type Locale } from "@/i18n.config";
import { getGlobalSchemaGraph } from "@/lib/schema";
import { GA_TRACKING_ID } from "@/lib/analytics";

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
    es: "PukaDigital - Agencia de Marketing Digital y Desarrollo Web en Ecuador",
    en: "PukaDigital - Digital Marketing Agency & Web Development in Ecuador",
    pt: "PukaDigital - Agência de Marketing Digital e Desenvolvimento Web no Equador"
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
      // Localización Ecuador - Ciudades principales
      "agencia marketing digital ecuador", "agencia digital quito", "diseño web guayaquil",
      "marketing digital cuenca", "transformación digital quito", "consultoría tecnológica latam",
      "servicios digitales ecuador", "marketing digital latinoamérica",
      // Precios y búsquedas transaccionales
      "páginas web baratas ecuador", "cuanto cobra diseñador web ecuador",
      "chatbot whatsapp business precio", "erp pequeñas empresas ecuador",
      "precio agencia marketing digital", "cuanto cuesta pagina web ecuador",
      // Automatización y herramientas
      "automatización whatsapp ecuador", "facturación electrónica sri",
      "sistema pos ecuador", "crm para pymes ecuador",
      // Diferenciadores
      "sin contratos eternos", "precios transparentes tecnología", "aprende a gestionar tu web",
      "programa 3 meses independencia digital", "educación intensiva marketing",
      // Long-tail específicas con intención
      "como automatizar whatsapp negocio", "gestionar inventario sin excel",
      "dejar de depender agencias marketing", "aprender marketing digital desde cero",
      "mejor agencia seo ecuador", "crear tienda online ecuador"
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
        { rel: 'mask-icon', url: '/pegaso-rojo.svg', color: '#E30613' },
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

  // Get centralized schema graph (Organization + LocalBusiness + WebSite)
  const schemaGraph = getGlobalSchemaGraph();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E30613" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href={`https://pukadigital.com/${locale}`} />
        <link rel="alternate" hrefLang="es" href="https://pukadigital.com/es" />
        <link rel="alternate" hrefLang="en" href="https://pukadigital.com/en" />
        <link rel="alternate" hrefLang="pt" href="https://pukadigital.com/pt" />
        <link rel="alternate" hrefLang="x-default" href="https://pukadigital.com/es" />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "uxq6p6x3tm");
          `}
        </Script>

        {/* Global Schema: Organization + LocalBusiness + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGraph)
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
              <SmartChatbot />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
