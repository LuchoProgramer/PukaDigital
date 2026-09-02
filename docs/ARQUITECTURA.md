# Arquitectura — PukaDigital

Detalle de arquitectura del sitio. Referenciado desde `AGENTS.md`, que se queda
con las reglas de uso diario: este archivo lleva el porqué.

- Páginas de producto son `'use client'` (usan estado, hooks y analytics).
- Metadata SEO va en el `layout.tsx` de cada ruta, **no** en `page.tsx`.
- JSON-LD se inyecta vía `<SEO structuredData={schema} />` en `page.tsx`, que **renderiza el `<script>` en el JSX**. Next renderiza los client components también en el servidor, así que el schema queda en el HTML servido.

### JSON-LD — regla crítica

**Nunca inyectar schema con `useEffect` + `document.head.appendChild`, ni con `<Script>` de `next/script`.** Ambos lo inyectan desde el cliente: el HTML servido queda sin schema y los crawlers que no ejecutan JS (GPTBot, PerplexityBot, ClaudeBot) no lo ven jamás. Así estuvo hasta el 2026-08-28 y se perdían 46 preguntas de FAQ en 6 páginas.

Para páginas nuevas, lo preferible es inyectar el `<script>` desde el `layout.tsx` (server component), que lo coloca en el `<head>`. Ver `app/cuanto-cuesta-una-landing-page/{layout,data}.tsx`.

Escapar siempre `<`: `JSON.stringify(x).replace(/</g, '\\u003c')`.

Verificar contra el HTML servido, nunca contra el navegador:
```bash
curl -s https://pukadigital.com/<ruta> | grep 'application/ld+json'
```

### Estilos — Dark Glass Rojo

- Fondo `#080808` · Acento `#C7171E` — **sale del wordmark del logo**, medido a nivel de píxel (el caballo es negro). Convivían tres rojos hasta el 2026-08-30: `#E30613` en el token `puka-red` y `#D32F2F` en los favicons.
- Cards glass: `rgba(255,255,255,0.04)` + `backdrop-filter: blur(24px)` + `-webkit-backdrop-filter`
- Bordes: `1px solid rgba(255,255,255,0.08)`, `border-top: rgba(255,255,255,0.12)`
- Glow en botones: `0 0 16-24px rgba(199,23,30,0.4-0.5)`

Tailwind para utilidades base; inline styles solo para los valores glass exactos (los `rgba` y `backdrop-filter` arbitrarios no existen como clases estándar). Objeto `glass` a nivel de módulo, reutilizado con spread: `...glass.card`.

### Tipografía

| Rol | Fuente | Clase |
|---|---|---|
| Titulares | Bricolage Grotesque | `font-display` |
| Texto y `body` | Instrument Sans | `font-sans` |
| Precios, fechas, cifras | JetBrains Mono | `font-mono` |

Cargadas con `next/font/google` en `app/layout.tsx`, mapeadas en `tailwind.config.ts` y con la regla del `body` en `app/globals.css`.

Los titulares van en **ExtraBold 800**: esta cuenta le habla a pymes y puede permitirse ese filo. En PukaHealth el mismo sistema usa **Bold 700** — un consultorio no vende gritando.

⚠️ **Los nombres de las variables tienen que decir la verdad.** Hasta el 2026-08-31, `--font-futura` contenía Geist y `--font-inter` contenía Geist **Mono**. Como `fontFamily.sans` apuntaba a `--font-inter`, todo lo que llevaba `font-sans` se renderizaba monoespaciado: el `<div>` raíz de la home y de `/agencia`, el botón «Cotizar Ahora» y el subtítulo del hero — 24 elementos y 1.119 caracteres visibles. Con esos nombres el error era invisible leyendo el código.

Al tocar fuentes, verificar en el navegador con `getComputedStyle(el).fontFamily`, no solo que el build compile.

### Landings standalone

Algunas páginas traen su propio navbar y footer (ej. `/ledgerxpertz`). Para que el shell global no se duplique, añadir la ruta a `STANDALONE_ROUTES` en `components/ConditionalShell.tsx`.

No uses route groups `(landings)` para esto: en App Router el `app/layout.tsx` raíz envuelve **siempre** todas las rutas, así que un grupo solo añade una capa más. `ConditionalShell` logra el mismo resultado con un cambio mínimo.
