# Plan — Blog: estructura de bloques del CMS y FAQPage

> **NO ENSAYADO.** Plan de contratos: archivos, firmas y tests que tienen que caer. La
> implementación la escribe quien ejecuta, con test en rojo primero.

Spec: `docs/superpowers/specs/2026-10-10-blog-estructura-cms-design.md`
Rama: `fix/blog-estructura-cms` (ya creada desde `origin/main`).
Tests: `npm test` = `node --import tsx --test 'lib/**/*.test.ts' 'lib/*.test.ts'` (node:test +
`node:assert/strict`, ver `lib/borde.test.ts` como ejemplo de estilo).

## Task 1 — `bloqueAMarkdown` (lib/cms.ts)

Extraer de `mapCMSToBlogPost` una función pura exportada:

```ts
export function bloqueAMarkdown(block: BloqueCMS): string
```

con `BloqueCMS` un tipo exportado mínimo (`type`, `style?`, `content?`, `url?`, `src?`, `alt?`,
`caption?`) — sin `any` nuevo. Implementa la tabla «Contrato de estilos» de la spec. Imagen y
video conservan exactamente su salida actual.

Tests en `lib/cms.test.ts` (rojo primero):
- `heading` «Por qué todos los chatbots olvidan» → `## Por qué todos los chatbots olvidan`
- `subheading` `'1. El problema: El costo de oportunidad de un "Hola"\n'` → empieza con `### 1. El problema` y no tiene `\n` final
- `subheading` que ya empieza con `## ` → no se duplica el `#`
- `list-bullet` `'A\nB\n\n'` → `'- A\n- B'`
- `list-number` `'A\nB'` → `'1. A\n1. B'`
- `quote` → contiene `<blockquote>`; `callout` → contiene `<aside class="callout">`
- `paragraph` y sin `style` → contenido intacto

`mapCMSToBlogPost` usa `bloqueAMarkdown` y une con `\n\n`, como hoy.

## Task 2 — `extraerFaqs` (lib/cms.ts)

```ts
export interface FaqBlog { pregunta: string; respuesta: string }
export function extraerFaqs(blocks: BloqueCMS[]): FaqBlog[]
```

Reglas exactas en la sección «FAQPage» de la spec. Devuelve `[]` si hay menos de 2 pares válidos.

Tests (rojo primero):
- Sección «Preguntas frecuentes» (`heading`) + 3 preguntas `subheading` con un párrafo `<p>…</p>` cada una → 3 pares, respuestas sin HTML
- Encabezado «PREGUNTAS FRECUENTES» y «preguntas frecuéntes» → detectado; «FAQ» también
- Una pregunta con dos párrafos → respuesta con los dos, separados por un espacio
- Pregunta sin respuesta → se descarta
- Un `heading` sin `?` después de las preguntas → corta la sección; lo que sigue no entra
- Solo 1 par válido → `[]`
- `subheading` con `?` **fuera** de una sección FAQ → no cuenta

## Task 3 — `BlogPost` y el mapeo (types/index.ts, lib/cms.ts)

- `BlogPost` gana `dateModified?: string` y `faqs?: FaqBlog[]` (importar el tipo, no duplicarlo).
- `mapCMSToBlogPost`: `dateModified: cmsPost.updatedAt || undefined`, `faqs` = `extraerFaqs(blocks)` solo si no está vacío.

Test: `mapCMSToBlogPost` es `private static`; si hace falta probarlo, exportar una función
`mapearPostCMS` y que el método la llame. Un test: con `updatedAt` y bloques de FAQ, el resultado
trae `dateModified` y `faqs.length === 2`.

## Task 4 — La página (app/blog/[slug]/page.tsx, lib/schema.ts)

- `getArticleSchema` recibe `dateModified: post.dateModified`.
- Si `post.faqs?.length`, un segundo `<script type="application/ld+json">` con
  `FAQPage` → `mainEntity[]` de `Question` / `acceptedAnswer: Answer`. Si `lib/schema.ts` ya
  tiene un helper de FAQPage, reutilizarlo (verificar con `grep -n FAQPage lib/schema.ts`).
- Los dos JSON-LD se serializan con `JSON.stringify(x).replace(/</g, '\\u003c')`.
- Hero: `alt={post.coverImageAlt || post.title}`.

Verificar: `npx tsc --noEmit` y `npx eslint lib/cms.ts lib/schema.ts "app/blog/[slug]/page.tsx"`
sin problemas nuevos.

## Task 5 — Verificación contra el HTML servido en local

```bash
npm run build && (npm run start &) ; sleep 8
curl -s localhost:3000/blog/por-que-tu-dropshipping-esta-quemando-dinero-en-whatsapp-el-crm-que-meta-no-te-vende > /tmp/post.html
grep -o '<h3[^>]*>[^<]*El problema' /tmp/post.html      # debe salir
grep -c '<li>1. El problema' /tmp/post.html              # debe dar 0
grep -o '"dateModified":"[^"]*"' /tmp/post.html           # = updatedAt (2026-04-13T15:28:43.189Z)
```

Pegar la salida real en el reporte. Parar el servidor al terminar.

## Commits

Uno por task, formato `tipo(blog): descripción en español`, solo con los archivos de esa task.
