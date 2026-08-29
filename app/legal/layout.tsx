import type { Metadata } from 'next';

// Las páginas legales acumulaban 271 impresiones y 0 clics en posiciones 41+ (GSC,
// may–ago 2026), contaminando la posición media del sitio con consultas irrelevantes.
// Se mantienen accesibles y rastreables (follow) para que Google Ads pueda validarlas,
// pero fuera del índice.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
