// app/casos/podoclinicec-cristina-munoz/layout.tsx
import type { Metadata } from 'next';
import { structuredData } from './data';

export const metadata: Metadata = {
  // El root layout añade el template "| PukaDigital" (14 caracteres).
  title: 'Caso PodoclinicEC: 371 conversiones a $2,52 en Quito',
  description:
    'De 2 a 281 clics orgánicos en un año y 371 conversiones a $2,52 cada una. Cómo una consulta de podología en Quito Norte pasó a liderar su categoría en Google. Datos verificables.',
  keywords: [
    'caso de exito marketing digital ecuador',
    'google ads para medicos ecuador',
    'marketing para consultorios medicos quito',
    'seo local quito',
    'costo por conversion google ads ecuador',
    'marketing digital podologia',
    'agencia marketing medico ecuador',
    'podoclinicec',
  ],
  alternates: {
    canonical: 'https://pukadigital.com/casos/podoclinicec-cristina-munoz',
  },
  openGraph: {
    url: 'https://pukadigital.com/casos/podoclinicec-cristina-munoz',
    type: 'article',
    title: 'Caso PodoclinicEC: 371 conversiones a $2,52 cada una',
    description:
      'De 2 a 281 clics orgánicos en un año, 56 reseñas 5.0 y top 3 en Google para las búsquedas con intención de compra de su ciudad.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caso PodoclinicEC: 371 conversiones a $2,52 cada una',
    description:
      'De 2 a 281 clics orgánicos en un año, 56 reseñas 5.0 y top 3 en Google para las búsquedas con intención de compra de su ciudad.',
  },
};

export default function CasoPodoclinicLayout({
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
