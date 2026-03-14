import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sistema ERP Cloud para PYMEs Ecuador | Gestión Empresarial desde $20/mes',
  description: 'ERP completo en la nube: inventario, CRM, facturación SRI, reportes. Reemplaza Excel con software profesional. Casos de éxito en Ecuador. Implementación en 30 días.',
  keywords: 'erp pymes ecuador, sistema erp cloud, software inventario ecuador, erp quito, facturacion electronica sri, sistema gestion empresarial, erp odoo ecuador, software contable ecuador',
  openGraph: {
    title: 'Sistema ERP Cloud para PYMEs Ecuador | PukaDigital',
    description: 'Di adiós a Excel. ERP cloud profesional desde $20/mes. Inventario + CRM + Facturación SRI.',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function SistemaERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
