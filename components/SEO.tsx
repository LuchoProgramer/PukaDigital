'use client';

import React from 'react';

interface SEOProps {
  /** @deprecated No tiene efecto. El title va en el `metadata` del layout.tsx de la ruta. */
  title?: string;
  /** @deprecated No tiene efecto. La description va en el `metadata` del layout.tsx de la ruta. */
  description?: string;
  /** @deprecated No tiene efecto. Las keywords van en el `metadata` del layout.tsx de la ruta. */
  keywords?: string;
  /** Un objeto de schema, o un array de objetos para inyectar varios. */
  structuredData?: object | object[];
}

/**
 * Inyecta JSON-LD en el HTML servido.
 *
 * Antes esto se hacía con useEffect + document.head.appendChild, lo que significaba
 * que el schema solo existía después de ejecutar JavaScript. Los crawlers de LLM
 * (GPTBot, PerplexityBot, ClaudeBot) normalmente no lo ejecutan, así que el schema
 * de /ledgerxpertz, /pukahealth, /preguntas-frecuentes y otras cuatro páginas era
 * invisible para ellos — y ChatGPT ya es la primera fuente de tráfico del sitio.
 *
 * Renderizar el <script> en el JSX lo incluye en el HTML del servidor, porque Next.js
 * también renderiza los client components en el servidor. JSON-LD dentro del <body>
 * es válido para Google y para los crawlers de IA.
 */
const SEO: React.FC<SEOProps> = ({ structuredData }) => {
  if (!structuredData) return null;

  // Escapar "<" evita que un texto con "</script>" dentro de una FAQ o descripción
  // cierre la etiqueta antes de tiempo. < es JSON válido y schema.org lo lee igual.
  const json = JSON.stringify(structuredData).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};

export default SEO;
