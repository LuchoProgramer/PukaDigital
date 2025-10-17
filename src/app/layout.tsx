import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://pukadigital.com'),
  title: "PukaDigital - Algo Disruptivo Está Por Llegar",
  description: "Transformamos negocios con marketing, IA y software para un crecimiento imparable. La mejor agencia digital está llegando.",
  keywords: "marketing digital, agencia digital, IA, software, crecimiento empresarial, transformación digital",
  authors: [{ name: "PukaDigital" }],
  robots: "noindex, nofollow", // Prevent indexing during expectation phase
  openGraph: {
    title: "PukaDigital - Algo Disruptivo Está Por Llegar",
    description: "Transformamos negocios con marketing, IA y software para un crecimiento imparable.",
    type: "website",
    url: "https://pukadigital.com",
    siteName: "PukaDigital",
    images: [
      {
        url: "/og-image.jpg", // We'll create this later
        width: 1200,
        height: 630,
        alt: "PukaDigital - La mejor agencia digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PukaDigital - Algo Disruptivo Está Por Llegar",
    description: "Transformamos negocios con marketing, IA y software para un crecimiento imparable.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicons - Pegaso Rojo PukaDigital */}
        <link rel="icon" href="/pegaso-rojo.svg" type="image/svg+xml" />
        <link rel="icon" href="/pegaso-rojo-32x32.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="icon" href="/pegaso-rojo-16x16.svg" type="image/svg+xml" sizes="16x16" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/pegaso-rojo-180x180.svg" sizes="180x180" />
        <link rel="apple-touch-icon" href="/pegaso-rojo-192x192.svg" sizes="192x192" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Theme colors for mobile browsers */}
        <meta name="theme-color" content="#D32F2F" />
        <meta name="msapplication-TileColor" content="#D32F2F" />
        <meta name="msapplication-TileImage" content="/pegaso-rojo-192x192.svg" />
        
        {/* Additional meta for better mobile experience */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PukaDigital" />
      </head>
      <body className="font-inter">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}