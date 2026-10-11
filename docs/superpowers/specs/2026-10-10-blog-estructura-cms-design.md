# Blog: estructura de los bloques del CMS y FAQPage — diseño

**Fecha:** 2026-10-10 · **Rama:** `fix/blog-estructura-cms`

## Problema

Verificado contra el HTML servido de
`/blog/por-que-tu-dropshipping-esta-quemando-dinero-en-whatsapp-el-crm-que-meta-no-te-vende`:

1. `HybridCMSService.mapCMSToBlogPost` (`lib/cms.ts`) ignora `block.style`. Un bloque
   `subheading` con «1. El problema: …» sale como `<ol><li>`; ningún post del blog tiene un
   `<h2>` propio.
2. El CMS no tiene bloque de FAQ, y el blog no emite `FAQPage`.
3. `dateModified` del `BlogPosting` es siempre `datePublished`: se ignora `updatedAt`.
4. La imagen hero usa `alt={post.title}` en vez de `post.coverImageAlt`.
5. El JSON-LD se serializa sin escapar `<` (regla de `docs/ARQUITECTURA.md`), y ahora llevará
   texto escrito en el CMS.

## Contrato de estilos

Se respeta el que define el propio CMS (`pukapress-cms`, `src/lib/utils.ts`,
`convertBlocksToHTML`, y las etiquetas «H2 Principal» / «H3 Secundario» del editor):

| `style` | Sale como |
|---|---|
| `heading` | `## texto` (H2) |
| `subheading` | `### texto` (H3) |
| `list-bullet` | una línea `- item` por línea no vacía |
| `list-number` | una línea `1. item` por línea no vacía |
| `quote` | `<blockquote>` con el contenido |
| `callout` | `<aside class="callout">` con el contenido (hoy sale suelto) |
| `paragraph`, `code`, ausente | el contenido tal cual, como hoy |

El texto de `heading`/`subheading` es plano; se recorta y se le quitan los saltos de línea.
Si ya empieza con `#`, no se le antepone otro.

## FAQPage

Convención para quien escribe en el CMS, sin bloque nuevo:

- Una sección empieza con un bloque `heading` o `subheading` cuyo texto contiene
  «preguntas frecuentes» (sin distinguir mayúsculas ni tildes) o es «FAQ».
- Dentro de la sección, cada bloque `subheading` (o `heading`) que termina en `?` es una
  **pregunta**; los bloques de texto que le siguen hasta el próximo `heading`/`subheading` son su
  **respuesta**, convertida a texto plano (sin HTML ni markdown, espacios colapsados).
- La sección termina en el primer `heading`/`subheading` que no termina en `?`.
- Si hay **2 o más** pares pregunta-respuesta con respuesta no vacía, la página emite un segundo
  JSON-LD `FAQPage` con exactamente esas preguntas, iguales a las visibles.

La función es pura y exportada: `extraerFaqs(blocks): { pregunta: string; respuesta: string }[]`.
`BlogPost` gana `faqs?` y `dateModified?`.

## Fuera de alcance

- Cambios en el repositorio del CMS.
- Rediseño del blog.
- El contenido de los posts existentes.

## Verificación de punta a punta

1. `npm test`: los tests nuevos de `lib/cms.test.ts` pasan y los existentes siguen verdes.
2. `npx tsc --noEmit` limpio; `npx eslint lib/cms.ts app/blog` sin problemas nuevos.
3. `npm run build`, `npm run start`, y contra el HTML servido en local del post de dropshipping:
   - `grep -c '<h3'` mayor que los 5 de la plantilla (CTA, 3 relacionados y el pie), y «El problema» dentro de un `<h3>`, no
     de un `<li>`;
   - el JSON-LD `BlogPosting` con `dateModified` = `updatedAt` del CMS.
4. Tras desplegar, lo mismo contra `https://pukadigital.com`, y el `FAQPage` en el post nuevo de
   PukaHealth una vez cargado con la convención.
