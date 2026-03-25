// app/ledgerxpertz/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LedgerXpertz | Sistema POS con Facturación SRI para PYMEs Ecuador',
  description: 'Sistema POS con inventario en tiempo real y facturación electrónica SRI. Controla stock, vende online y factura desde $10/mes. Sin permanencia.',
  keywords: [
    'sistema de inventario',
    'control de inventario',
    'sistema pos',
    'sistema punto de venta',
    'software de inventario',
    'facturacion electronica sri ecuador',
    'ledgerxpertz',
    'control de inventarios',
  ],
  alternates: {
    canonical: 'https://pukadigital.com/ledgerxpertz',
  },
  openGraph: {
    url: 'https://pukadigital.com/ledgerxpertz',
    type: 'website',
    title: 'LedgerXpertz | Sistema POS con Facturación SRI',
    description: 'Inventario en tiempo real, POS, facturación SRI y e-commerce desde $10/mes.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LedgerXpertz | Sistema POS con Facturación SRI',
    description: 'Inventario en tiempo real, POS, facturación SRI y e-commerce desde $10/mes.',
  },
};

export default function LedgerXpertzLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
