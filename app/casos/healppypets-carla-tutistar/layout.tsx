// app/casos/healppypets-carla-tutistar/layout.tsx
import type { Metadata } from 'next';
import { structuredData } from './data';

export const metadata: Metadata = {
  // El root layout añade el template "| PukaDigital" (14 caracteres).
  title: 'Caso HealppyPets: probó Google Ads y volvió al orgánico',
  description:
    'Una veterinaria de Carcelén en posición 2 de Google para su búsqueda principal. Probó publicidad tres semanas, la detuvo porque el orgánico le llenaba la agenda, y siguió creciendo. Datos verificables.',
  keywords: [
    'seo local quito',
    'posicionamiento organico ecuador',
    'seo para veterinarias',
    'marketing digital sin publicidad',
    'caso de exito seo ecuador',
    'veterinaria carcelen',
    'healppypets',
  ],
  alternates: {
    canonical: 'https://pukadigital.com/casos/healppypets-carla-tutistar',
  },
  openGraph: {
    url: 'https://pukadigital.com/casos/healppypets-carla-tutistar',
    type: 'article',
    title: 'Caso HealppyPets: probó Google Ads y volvió al orgánico',
    description:
      'Probó publicidad tres semanas en enero de 2026 y la detuvo: el posicionamiento orgánico ya le llenaba la agenda.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caso HealppyPets: probó Google Ads y volvió al orgánico',
    description:
      'Probó publicidad tres semanas en enero de 2026 y la detuvo: el posicionamiento orgánico ya le llenaba la agenda.',
  },
};

export default function CasoHealppyPetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD servido en el HTML: los crawlers de LLM no ejecutan JavaScript. */}
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
