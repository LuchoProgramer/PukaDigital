# Pendientes de visibilidad de pukadigital.com — plan de contratos (NO ENSAYADO)

Sale de la vigilancia del 2026-09-29 (skill `visibilidad-ia`, ver `docs/ESTADO_2026-09-29.md`).
Plan corto sin spec: las decisiones se tomaron en conversación con Luis el 2026-09-29
(`/productos` se retira; títulos y descripciones fijados aquí).

**Rama:** `fix/visibilidad-pukadigital`. Sin push. **No desplegar**: el despliegue lo hace
Claude Code con aprobación de Luis (`npm run deploy:cloudflare`).
**Línea base:** `npm test` en verde; `npx tsc --noEmit` limpio (borrar `.next/` si hay errores de
rutas eliminadas); `npm run lint` tiene 180+ problemas preexistentes fuera de `app/`: los archivos
tocados en `app/`, `components/` y `lib/borde.ts` tienen que quedar limpios.

## Task 1 — `www` y cabeceras de seguridad

**Files:** crear `lib/borde.ts` y `lib/borde.test.ts`; modificar `proxy.ts`.

```typescript
export const HOST_OFICIAL = 'pukadigital.com';
export function redireccionWww(url: URL): URL | null
  // host 'www.pukadigital.com' → new URL(`https://pukadigital.com${pathname}${search}`); si no, null
export const CABECERAS_SEGURIDAD: Record<string, string>
  // 'Strict-Transport-Security': 'max-age=31536000'   (SIN includeSubDomains ni preload: existe reels.pukadigital.com)
  // 'X-Content-Type-Options': 'nosniff'
  // 'Referrer-Policy': 'strict-origin-when-cross-origin'
  // 'X-Frame-Options': 'DENY'
export function conCabeceras<T extends { headers: Headers }>(respuesta: T): T   // setea todas y la devuelve
```

`proxy.ts`: lo **primero** es `redireccionWww(request.nextUrl)`; si no es `null`,
`NextResponse.redirect(destino, 301)` con cabeceras. Toda respuesta que devuelva `proxy`
(redirecciones legacy y `NextResponse.next()`) pasa por `conCabeceras`. **No cambiar el
`matcher`.**

Tests (`node:test`, estilo de `lib/piezas/*.test.ts`), que tienen que fallar antes:
- `www` con ruta y query → `https://pukadigital.com/agencia?gclid=x`.
- host oficial → `null`; otro host (`reels.pukadigital.com`) → `null`.
- `CABECERAS_SEGURIDAD` tiene las cuatro, y HSTS no contiene `includeSubDomains` ni `preload`.
- `conCabeceras` sobre un `new Response()` deja las cuatro cabeceras.

Commit: `fix(seo): www redirige al dominio oficial y cabeceras de seguridad en todas las rutas`

## Task 2 — títulos propios

**Files:** crear `app/preguntas-frecuentes/layout.tsx` y
`app/cuanto-cuesta-publicidad-google-ecuador/layout.tsx` siguiendo el patrón de
`app/cuanto-cuesta-una-landing-page/layout.tsx` (solo `metadata` y `children`; sin JSON-LD
nuevo). Modificar `app/agencia/layout.tsx`.

| Ruta | `title` (el template agrega « \| PukaDigital») | `description` |
|---|---|---|
| `/preguntas-frecuentes` | `Preguntas Frecuentes sobre PukaDigital` | `Todo lo que necesitas saber antes de trabajar con PukaDigital: respuestas claras, sin jerga técnica.` |
| `/cuanto-cuesta-publicidad-google-ecuador` | `¿Cuánto Cuesta Aparecer en Google en Ecuador?` | `Cuánto cuesta la publicidad en Google en Ecuador y por qué el 100% de tu inversión debe ir a conseguir clientes, no a pagar comisiones de agencia.` |

Cada layout lleva `alternates.canonical` absoluto y `openGraph` (`title`, `description`, `url`,
`locale: 'es_EC'`). En `app/agencia/layout.tsx`, el `title` raíz pasa de
`'Agencia de Marketing Digital y Desarrollo Web en Ecuador | PukaDigital'` a
`'Agencia de Marketing Digital y Desarrollo Web en Ecuador'` (el template ya agrega la marca).
No tocar ningún otro texto.

Commit: `fix(seo): títulos y descripciones propios en preguntas frecuentes y publicidad en Google`

## Task 3 — retirar `/productos`

- Borrar `app/productos/` completo.
- `app/sitemap.ts`: quitar la entrada `/productos`.
- `lib/indexnow.ts` y `app/api/indexnow/batch/route.ts`: quitar `'/productos'` de las listas.
- `components/Navbar.tsx` y `components/Footer.tsx`: quitar el ítem «El Programa»; quitar el
  import `Package` de `Footer.tsx` si queda sin uso.
- `data/localPosts.ts`: los enlaces markdown `](/productos)` de las líneas ~230 y ~493 pasan a
  `](/)`. No cambiar el texto de los artículos. **No tocar** la línea ~2017
  (`https://tudominio.com/productos/...` es un ejemplo de código).
- `lib/schema.ts`: borrar `getServiceSchema` (no la usa nadie; declaraba un programa de $900 con
  `url` a `/productos`). Verificar antes con `grep -rn getServiceSchema app components lib`.
- `lib/analytics.ts`: el comentario que menciona `/productos` se actualiza o se quita.

Verificación de la task: `grep -rn "/productos" app components lib public data` solo devuelve la
línea de ejemplo de `data/localPosts.ts`.

Commit: `feat(seo): retirar /productos, que publicaba precios y valoraciones que no existen`

## Task 4 — `lastmod` real en el sitemap

`app/sitemap.ts`: las páginas estáticas **sin** `lastModified` (hoy `new Date()`, que cambia en
cada petición). Los artículos del blog conservan `new Date(post.date)`.

Commit: `fix(seo): el sitemap solo declara lastmod cuando hay fecha real`

## Verificación final (Claude Code)

`npm test`, `npx tsc --noEmit`, lint de los archivos tocados, `npm run build`. Tras desplegar
(con aprobación): `python3 ~/.claude/skills/visibilidad-ia/scripts/auditar.py https://pukadigital.com`
tiene que dar ✅ en `redirecciones` y `cabeceras`, sin `hechos` en rojo y sin títulos repetidos, y
`/productos` tiene que responder 404.
