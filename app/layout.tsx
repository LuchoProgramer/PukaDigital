import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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
    default: "PukaDigital - Construimos Dignidad Digital",
    template: "%s | PukaDigital"
  },
  description: "No construimos websites. Construimos dignidad. 3 meses de educación intensiva = Independencia tecnológica de por vida.",
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
    locale: 'es_ES',
    url: 'https://pukadigital.com',
    title: 'PukaDigital - Construimos Dignidad Digital',
    description: 'La anti-agencia. No queremos cobrarte para siempre. Queremos enseñarte a ser libre.',
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
    title: 'PukaDigital - Construimos Dignidad Digital',
    description: 'La anti-agencia. No queremos cobrarte para siempre. Queremos enseñarte a ser libre.',
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
  verification: {
    // Agrega aquí tus códigos de verificación cuando los tengas
    // google: 'tu-codigo-de-google',
    // yandex: 'tu-codigo-de-yandex',
    // bing: 'tu-codigo-de-bing',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#c7171e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href="https://pukadigital.com" />
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
              <FloatingWhatsApp />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
