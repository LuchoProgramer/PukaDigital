import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SmartChatbot from "@/components/SmartChatbot";
import { getGlobalSchemaGraph } from "@/lib/schema";
import { GA_TRACKING_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

const geistSans = Geist({
  variable: "--font-futura",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pukadigital.com'),
  title: {
    default: "PukaDigital - Agencia de Marketing Digital y Desarrollo Web en Ecuador",
    template: `%s | PukaDigital`
  },
  description: "Independencia tecnológica para pymes en Ecuador. Aprende a gestionar tu web, chatbot y ERP en 3 meses. Sin contratos eternos.",
  keywords: [
    "independencia digital", "autonomía tecnológica", "educación digital pymes",
    "chatbot ia whatsapp", "chatbot para restaurantes", "chatbot pymes ecuador",
    "sistema erp pymes", "erp fácil ecuador", "gestión inventario automática",
    "desarrollo web ecuador", "página web profesional", "sitio web pymes",
    "agencia marketing digital ecuador", "agencia digital quito", "diseño web guayaquil",
    "marketing digital cuenca", "transformación digital quito", "consultoría tecnológica latam",
    "servicios digitales ecuador", "marketing digital latinoamérica",
    "páginas web baratas ecuador", "cuanto cobra diseñador web ecuador",
    "chatbot whatsapp business precio", "erp pequeñas empresas ecuador",
    "precio agencia marketing digital", "cuanto cuesta pagina web ecuador",
    "automatización whatsapp ecuador", "facturación electrónica sri",
    "sistema pos ecuador", "crm para pymes ecuador",
    "sin contratos eternos", "precios transparentes tecnología", "aprende a gestionar tu web",
    "programa 3 meses independencia digital", "educación intensiva marketing",
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
    locale: 'es_ES',
    url: 'https://pukadigital.com',
    title: "PukaDigital - Agencia de Marketing Digital y Desarrollo Web en Ecuador",
    description: "Independencia tecnológica para pymes en Ecuador. Aprende a gestionar tu web, chatbot y ERP en 3 meses. Sin contratos eternos.",
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
    title: "PukaDigital - Agencia de Marketing Digital y Desarrollo Web en Ecuador",
    description: "Independencia tecnológica para pymes en Ecuador. Aprende a gestionar tu web, chatbot y ERP en 3 meses. Sin contratos eternos.",
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
    canonical: 'https://pukadigital.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get centralized schema graph (Organization + LocalBusiness + WebSite)
  const schemaGraph = getGlobalSchemaGraph();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E30613" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

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
            gtag('config', '${GOOGLE_ADS_ID}');
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
          <LanguageProvider>
            <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 md:pb-0">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <MobileBottomNav />
              <SmartChatbot />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
