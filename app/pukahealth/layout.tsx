// app/pukahealth/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PukaHealth | Historias Clínicas Electrónicas con Facturación SRI — Ecuador',
  description: 'Software de historias clínicas electrónicas con facturación SRI para médicos en Ecuador. Multi-especialidad, 100% en la nube. Desde $50/mes. Sin permanencia.',
  keywords: [
    'historias clinicas electronicas',
    'software medico ecuador',
    'historia clinica electronica ecuador',
    'software para consultorio medico',
    'facturacion sri medicos ecuador',
    'pukahealth',
  ],
  alternates: {
    canonical: 'https://pukadigital.com/pukahealth',
  },
  openGraph: {
    url: 'https://pukadigital.com/pukahealth',
    type: 'website',
    title: 'PukaHealth | Historias Clínicas con Facturación SRI',
    description: 'Historias clínicas electrónicas y facturación SRI para médicos en Ecuador. Desde $50/mes.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PukaHealth | Historias Clínicas con Facturación SRI',
    description: 'Historias clínicas electrónicas y facturación SRI para médicos en Ecuador. Desde $50/mes.',
  },
};

export default function PukaHealthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
