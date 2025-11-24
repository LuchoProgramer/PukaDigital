import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Desarrollo Web para PYMEs Ecuador | Páginas Autogestionables desde $20/mes',
  description: 'Webs profesionales con Next.js: rápidas, SEO optimizado, editor visual sin código. Aprende a gestionar tu sitio sin depender de programadores. Casos de éxito en Quito y Ecuador.',
  keywords: 'desarrollo web ecuador, cuanto cuesta pagina web ecuador, diseño web quito, paginas web pymes, desarrollo web next.js, web autogestionable, desarrollo web profesional',
  openGraph: {
    title: 'Desarrollo Web para PYMEs Ecuador | PukaDigital',
    description: 'Webs profesionales autogestionables. Tecnología Next.js. Desde $20/mes.',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function DesarrolloWebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
