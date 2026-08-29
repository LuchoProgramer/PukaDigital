// app/cuanto-cuesta-una-landing-page/layout.tsx
import type { Metadata } from 'next';
import { structuredData } from './data';

export const metadata: Metadata = {
  // El root layout añade el template "| PukaDigital" (14 caracteres). Se deja el
  // title en 47 para que el conjunto quede en ~61 y no se corte en el SERP.
  title: '¿Cuánto Cuesta una Landing Page en Ecuador? 2026',
  description: 'Precios reales de una landing page en Ecuador: freelancer $350–$700, agencia $600–$1.500, PukaDigital desde $490 + IVA. Qué incluye cada rango y cuánto cobrar si la haces tú.',
  keywords: [
    'cuanto cuesta una landing page',
    'cuanto cuesta hacer una landing page',
    'landing page precio',
    'precio de landing page',
    'costo de landing page',
    'costo landing page',
    'landing page precios',
    'cuanto cobrar por una landing page',
    'cuanto cuesta una landing page ecuador',
    'precio landing page quito',
    'diseño de landing page ecuador',
  ],
  alternates: {
    canonical: 'https://pukadigital.com/cuanto-cuesta-una-landing-page',
  },
  openGraph: {
    url: 'https://pukadigital.com/cuanto-cuesta-una-landing-page',
    type: 'article',
    title: '¿Cuánto Cuesta una Landing Page en Ecuador? Precios 2026',
    description: 'Freelancer $350–$700, agencia $600–$1.500, PukaDigital desde $490 + IVA. Tabla comparativa de qué incluye cada rango.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Cuánto Cuesta una Landing Page en Ecuador? Precios 2026',
    description: 'Freelancer $350–$700, agencia $600–$1.500, PukaDigital desde $490 + IVA. Tabla comparativa de qué incluye cada rango.',
  },
};

export default function CuantoCuestaLandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD servido en el HTML, no inyectado por useEffect: los crawlers de
          LLM no ejecutan JavaScript y esta página existe para ser citada por ellos. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      {children}
    </>
  );
}
