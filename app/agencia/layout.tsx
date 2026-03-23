import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agencia de Marketing Digital y Desarrollo Web en Ecuador | PukaDigital',
  description: 'Agencia especializada en desarrollo web Next.js y Google Ads de alto rendimiento desde Quito. Tecnología propia, sin contratos, 100% de propiedad del código.',
  keywords: [
    'agencia marketing digital ecuador', 'desarrollo web quito', 'google ads ecuador',
    'nextjs ecuador', 'seo tecnico ecuador', 'agencia digital quito'
  ],
  openGraph: {
    title: 'Agencia de Marketing Digital y Desarrollo Web — PukaDigital',
    description: 'Desarrollo web en Next.js y Google Ads para empresas que buscan ROI. Desde Quito para todo Ecuador.',
    url: 'https://pukadigital.com/agencia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agencia Marketing Digital Ecuador | PukaDigital',
    description: 'Desarrollo web high-performance y Google Ads. Propiedad del código, sin mensualidades.',
  },
  alternates: {
    canonical: 'https://pukadigital.com/agencia',
  },
};

export default function AgenciaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
