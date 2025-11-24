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
    es: "No construimos websites. Construimos dignidad. 3 meses de educación intensiva = Independencia tecnológica de por vida.",
    en: "We don't build websites. We build dignity. 3 months of intensive education = Lifelong technological independence.",
    pt: "Não construímos sites. Construímos dignidade. 3 meses de educação intensiva = Independência tecnológica para toda a vida."
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
    keywords: ["independencia digital", "agencia marketing", "chatbot ia", "sistema erp", "puka digital", "desarrollo web", "transformación digital", "consultoría tecnológica"],
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
