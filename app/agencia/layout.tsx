import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agencia de Marketing Digital y Desarrollo Web en Ecuador | PukaDigital',
  description: 'Agencia especializada en desarrollo web Next.js y Google Ads de alto rendimiento desde Quito. Tecnología propia, sin contratos, 100% de propiedad del código.',
  keywords: [
    'agencia marketing digital ecuador',
    'agencia digital quito',
    'agencia seo ecuador',
    'google ads ecuador',
    'google ads quito',
    'desarrollo web quito',
    'desarrollo web next.js ecuador',
    'diseño web profesional ecuador',
    'cuanto cuesta publicidad google ecuador',
    'agencia google ads quito',
    'seo tecnico ecuador',
    'marketing digital pymes ecuador',
    'agencia sem ecuador',
    'paginas web profesionales quito',
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
