import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import ConditionalShell from "@/components/ConditionalShell";
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
    "agencia marketing digital ecuador",
    "agencia digital quito",
    "desarrollo web ecuador",
    "crm whatsapp ecuador",
    "chatbot ia whatsapp",
    "sistema erp pymes ecuador",
    "facturación electrónica sri",
    "historias clínicas electrónicas ecuador",
    "marketing digital pymes ecuador",
    "pukadigital",
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
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PukaDigital - Agencia de Marketing Digital y Desarrollo Web en Ecuador',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "PukaDigital - Agencia de Marketing Digital y Desarrollo Web en Ecuador",
    description: "Independencia tecnológica para pymes en Ecuador. Aprende a gestionar tu web, chatbot y ERP en 3 meses. Sin contratos eternos.",
    images: ['/og-image.png'],
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

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D7L49URC77U471PGSURG');
              ttq.page();
            }(window, document, 'ttq');
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
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
