import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Cuánto Cuesta Aparecer en Google en Ecuador?',
  description: 'Cuánto cuesta la publicidad en Google en Ecuador y por qué el 100% de tu inversión debe ir a conseguir clientes, no a pagar comisiones de agencia.',
  alternates: {
    canonical: 'https://pukadigital.com/cuanto-cuesta-publicidad-google-ecuador',
  },
  openGraph: {
    title: '¿Cuánto Cuesta Aparecer en Google en Ecuador?',
    description: 'Cuánto cuesta la publicidad en Google en Ecuador y por qué el 100% de tu inversión debe ir a conseguir clientes, no a pagar comisiones de agencia.',
    url: 'https://pukadigital.com/cuanto-cuesta-publicidad-google-ecuador',
    locale: 'es_EC',
  },
};

export default function CuantoCuestaPublicidadGoogleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
