import type { Metadata } from "next";
import "./globals.css";

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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicons - Pegaso Rojo PukaDigital */}
        <link rel="icon" href="/pegaso-rojo.svg" type="image/svg+xml" />
        <link rel="icon" href="/pegaso-rojo-32x32.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="icon" href="/pegaso-rojo-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="apple-touch-icon" href="/pegaso-rojo-180x180.svg" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#D32F2F" />
        <meta name="msapplication-TileColor" content="#D32F2F" />
        <meta name="msapplication-TileImage" content="/pegaso-rojo-192x192.svg" />
      </head>
      <body className="font-inter antialiased bg-puka-black text-puka-white">
        {children}
      </body>
    </html>
  );
}