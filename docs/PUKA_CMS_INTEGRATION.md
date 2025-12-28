# 🐋 PukaPress: Guía de Integración (Snippets para Clientes)

Esta guía documenta cómo conectar cualquier sitio web nuevo al ecosistema de **PukaPress CMS** utilizando el motor de Markdown optimizado.

---

## 🚀 1. Instalación Rápida
En el nuevo proyecto (Next.js / React), instala las dependencias necesarias para procesar el contenido:

```bash
npm install react-markdown remark-gfm
```

---

## 🛠️ 2. El "Kit de Conexión" (Snippet Maestro)
Copia este código en un archivo llamado `lib/puka-cms.tsx` en el nuevo proyecto.

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MAPEADOR: Convierte el formato de bloques del CMS a Markdown Puro
 */
export function mapCMSBlocksToMarkdown(blocks: any[]) {
  if (!blocks) return '';
  return blocks.map((block: any) => {
    switch (block.type) {
      case 'text': return block.content;
      case 'image': return `\n![${block.alt || 'Imagen'}](${block.src})\n`;
      case 'video': return `\n${block.src}\n`;
      default: return '';
    }
  }).join('\n\n');
}

/**
 * COMPONENTE: Renderiza el Blog con el estilo de marca del cliente
 */
export const PukaBlogContent = ({ content, brandColor = '#E31E24' }: { content: string, brandColor?: string }) => {
  return (
    <div className="puka-content prose prose-lg max-w-none transition-all">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Personalización de Links
          a: ({ node, ...props }) => (
            <a {...props} 
               style={{ color: brandColor, fontWeight: 'bold', textDecoration: 'underline' }} 
               target="_blank" 
               rel="noopener noreferrer" 
            />
          ),
          // Personalización de Párrafos
          p: ({ children }) => <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
          // Personalización de Títulos
          h2: ({ children }) => <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
```

---

## 📈 3. Estrategia de Contenido "Silo" (Whale Strategy)

Para maximizar el SEO en proyectos de clientes, sigue estas reglas al redactar en el CMS:

1.  **Anchor Text exacto:** Usa la sintaxis `[palabra clave](url)` para enlazar a la landing principal.
2.  **Links Relativos:** Usa `/es/pagina-objetivo` en lugar de la URL completa para mantener el SEO interno.
3.  **Jerarquía H3:** Usa `### Subtítulo` dentro de los bloques de texto para mejorar la lectura de Google.

---

## 🛡️ 4. Seguridad y API Keys
Cada cliente debe tener su propia **API Key** generada desde el panel de administración.
*   **Endpoint Público:** `https://pukapresscms.vercel.app/api/public/blogs`
*   **Header:** `X-API-Key: tu_llave_aqui`
*   **Query Param:** `?tenant=id_del_cliente`

---

> **Nota de Antigravity:** Este sistema permite que PukaDigital escale como agencia, entregando blogs de alta calidad con SEO quirúrgico en tiempo récord.
