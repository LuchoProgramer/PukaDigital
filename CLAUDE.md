# CLAUDE.md — PukaDigital

Empresa: **Puka Digital LLC** (Casper, Wyoming, USA · EIN: `320856610`)
Fundador: Luis Omar Viteri Sarango (LuchoDev) · Producción: **https://pukadigital.com**
Agencia de marketing digital y software SaaS para PYMEs en Ecuador y LATAM.

## Stack

**Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS · Lucide React**

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run lint         # ESLint
npx tsc --noEmit     # type check (limpiar .next/ primero si hay errores de rutas eliminadas)
```

⚠️ `lint` arrastra 180+ problemas pre-existentes en `proxy.ts`, `types/index.ts` y scripts. No son tuyos. **Los archivos en `app/` sí deben quedar limpios.**

**Este es el único repo del ecosistema con `node_modules` instalado**, así que aquí sí se compila en local. Los clones de `~/Proyectos/Podoclinic` y `~/Proyectos/HealppyPets` son solo para leer y editar código: no tienen dependencias y no se instalan. Si trabajas en ellos, verifica contra producción con `curl` y deja que Vercel compile en el preview del PR.

Deploy: automático en Vercel al pushear a `main`.

## Productos y URLs canónicas

| Producto | URL | Qué es |
|---|---|---|
| Agencia | `/agencia` | Marketing digital, Google Ads, SEO, desarrollo web |
| PukaIA | `/agentes-ia` | CRM con agentes IA para WhatsApp Business |
| LedgerXpertz | `/ledgerxpertz` | ERP SaaS: POS + inventario + facturación SRI |
| PukaHealth | `/pukahealth` | Historias clínicas + facturación SRI para médicos |
| PukaSalud | `/salud` | Marketing médico ético |
| Desarrollo web | `/desarrollo-web-pymes` | Sitios para PYMEs |

**Una sola URL canónica por producto.** Al añadir o quitar rutas, actualizar `app/sitemap.ts`.

### Precios vigentes

| Producto | Planes |
|---|---|
| PukaIA | Básico $14.99/mes · Pro $25/mes · Business $60/mes — 1 mes gratis, sin plan gratuito permanente |
| LedgerXpertz | Starter $15 · Grow $20 · Pro $25 (+IVA) — anual: 2 meses gratis |
| PukaHealth | Individual $50/mes · Anual $480/año — 30 días gratis |
| PukaSalud, Agencia, Desarrollo web | Sin precio visible, cotización por WhatsApp |

**PukaIA es un CRM, no solo un chatbot.** Tiene inbox centralizado, pipeline Kanban, gestión de clientes, reportes e integraciones. Los competidores que se posicionan como CRM cobran 5-15x más (Mercately $99-499/mes, Zolutium $79, Sellerchat $49). Ese es el ángulo competitivo; no lo describas como "chatbot" a secas.

`next.config.ts` **no tiene redirects** — solo configuración de imágenes. Decisión del 2026-04-12: empezar limpio.

## Arquitectura

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

- Fondo `#080808` · Acento `#C7171E`
- Cards glass: `rgba(255,255,255,0.04)` + `backdrop-filter: blur(24px)` + `-webkit-backdrop-filter`
- Bordes: `1px solid rgba(255,255,255,0.08)`, `border-top: rgba(255,255,255,0.12)`
- Glow en botones: `0 0 16-24px rgba(199,23,30,0.4-0.5)`

Tailwind para utilidades base; inline styles solo para los valores glass exactos (los `rgba` y `backdrop-filter` arbitrarios no existen como clases estándar). Objeto `glass` a nivel de módulo, reutilizado con spread: `...glass.card`.

### Landings standalone

Algunas páginas traen su propio navbar y footer (ej. `/ledgerxpertz`). Para que el shell global no se duplique, añadir la ruta a `STANDALONE_ROUTES` en `components/ConditionalShell.tsx`.

No uses route groups `(landings)` para esto: en App Router el `app/layout.tsx` raíz envuelve **siempre** todas las rutas, así que un grupo solo añade una capa más. `ConditionalShell` logra el mismo resultado con un cambio mínimo.

## Analytics y CTAs

```typescript
import * as ga from '@/lib/analytics';
ga.trackWhatsAppDirectoClick('ledgerxpertz_hero_primary');
```

Formato de location: `{producto}_{seccion}`.

WhatsApp: número `593964065880`, patrón `https://wa.me/{numero}?text={encodeURIComponent(mensaje)}`, siempre `window.open(url, '_blank', 'noopener,noreferrer')`, y **llamar al tracking antes de abrir**.

## Ecosistema Meta y Publicidad

- **Portfolio Comercial:** `PukaDigital` (`758680150376625`) — Verificado (**Puka Digital LLC**) + Tech Provider.
- **Cuenta Publicitaria:** `PukaDigital Ads` (`1097475412619983` · USD · America/Guayaquil).
- **Píxel / Dataset:** `PukaDigital Web` (`2045774666297992` · conectado a `PukaDigital Ads`).
- **Dominio Verificado:** `pukadigital.com` (Meta tag `zb46u0vripnq10zx6svtlcgj2n7k5o` en `app/layout.tsx`).
- **WhatsApp Cloud API:** `PukaIA` (`1124927996392227` · `+593 96 406 5880` · verificada).
- **Instagram:** `@pukadigital` (`17841476784325626`) conectado a la página `PukaDigital`.
- ⚠️ **Pendiente pauta:** Asociar tarjeta en [Billing Hub](https://business.facebook.com/billing_hub/payment_methods) para `PukaDigital Ads`.

## SEO y GEO

Reglas por página de producto:

1. `layout.tsx` — metadata completa: `title`, `description`, `keywords`, `canonical`, `openGraph`, `twitter`.
2. `page.tsx` — dos schemas: `SoftwareApplication` + `FAQPage`.
3. `public/llms.txt` — actualizar con URLs y precios al crear o modificar un producto.
4. `public/robots.txt` — ya permite todos los crawlers de IA. No tocar sin leer `docs/GEO_LLM_VISIBILITY.md`.

### El porqué correcto de GEO

Google fue explícito en mayo de 2026: *"You don't need to create new machine readable files, AI text files, markup, or Markdown to appear in Google Search... Google Search ignores them"*, y *"Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."*

Es decir: **`llms.txt` y el schema no son lo que hace que la IA de Google te cite.** Se mantienen porque sirven para otra cosa, que sí importa:

- el schema alimenta los **rich results** de Google (FAQ, precios, estrellas) — tráfico real y medible;
- `llms.txt` lo consumen algunos crawlers **no-Google**.

No inventes tácticas "para LLMs" ni trocees contenido para que "la IA lo entienda mejor" — Google dice expresamente que no hace falta. Lo que mueve la aguja es contenido útil, indexable, con criterio propio y datos originales.

### FAQs

Formato conversacional, como las escribiría alguien en ChatGPT. Mínimo 5 preguntas, óptimo 8-12. Incluir precios concretos en al menos una respuesta y contexto local ("en Ecuador", "SRI", "pymes").

## Convenciones

- TypeScript estricto, sin `any` en archivos nuevos.
- Un solo `<h1>` por página. Si hace falta split visual, `<span>` dentro del mismo `<h1>`.
- Entidades HTML en español: `&iquest;` `&Aacute;` `&Eacute;` `&ntilde;` `&copy;` `&mdash;`.
- Iconos: **Lucide React** exclusivamente, sin emojis como iconos.
- Arrays de datos (`PLANS`, `FEATURES`, `FAQS`) a nivel de módulo, fuera del componente.

## Commits

Formato: `tipo(scope): descripción en español`.

```
feat(ledgerxpertz): add FAQ section with FAQPage schema
fix(analytics): eliminar el doble conteo de conversiones
```

## Archivos importantes

| Archivo | Propósito |
|---|---|
| `app/sitemap.ts` | Sitemap dinámico — añadir/quitar rutas aquí |
| `lib/analytics.ts` | Tracking de eventos GA |
| `components/ConditionalShell.tsx` | Oculta el shell global en landings standalone |
| `components/SEO.tsx` | Renderiza el JSON-LD en el JSX |
| `public/llms.txt` | Mapa del sitio para crawlers no-Google |
| `next.config.ts` | Solo imágenes, sin redirects |

## Documentación relacionada

- `docs/PROXIMOS_PASOS.md` — auditoría del 2026-08-29 y backlog priorizado
- `docs/GEO_LLM_VISIBILITY.md` — guía de GEO/LLM SEO
- `docs/CRO_MASTERY_GUIDE.md` — landing pages de alta conversión
- `docs/ANALYTICS_TRACKING.md` — convenciones de tracking
- `docs/HISTORIAL_SEO.md` — auditorías cerradas y keyword research (historial, no doctrina)
- `docs/TRANSICION_LLC.md` — checklist pendiente de Puka Digital LLC / Stripe Atlas
