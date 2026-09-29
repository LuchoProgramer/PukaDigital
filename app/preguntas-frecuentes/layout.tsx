import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes sobre PukaDigital',
  description: 'Todo lo que necesitas saber antes de trabajar con PukaDigital: respuestas claras, sin jerga técnica.',
  alternates: {
    canonical: 'https://pukadigital.com/preguntas-frecuentes',
  },
  openGraph: {
    title: 'Preguntas Frecuentes sobre PukaDigital',
    description: 'Todo lo que necesitas saber antes de trabajar con PukaDigital: respuestas claras, sin jerga técnica.',
    url: 'https://pukadigital.com/preguntas-frecuentes',
    locale: 'es_EC',
  },
};

export default function PreguntasFrecuentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
