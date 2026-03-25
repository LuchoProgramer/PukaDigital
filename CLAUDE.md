# CLAUDE.md — PukaDigital

Guía de contexto para Claude Code al trabajar en este repositorio.

---

## Proyecto

**PukaDigital** — agencia de marketing digital y software SaaS para PYMEs en Ecuador y LATAM.
**Fundador:** Luis Omar Viteri Sarango (LuchoDev)
**URL:** https://pukadigital.com
**Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide React

---

## Productos y URLs canónicas

| Producto | URL | Descripción |
|---|---|---|
| Agencia | `/agencia` | Marketing digital, Google Ads, SEO, desarrollo web |
| PukaIA | `/agentes-ia` | Agentes IA para WhatsApp Business (Meta + Gemini) |
| LedgerXpertz | `/ledgerxpertz` | ERP SaaS: POS + inventario + facturación SRI + e-commerce |
| PukaHealth | `/pukahealth` | Historias clínicas electrónicas + facturación SRI para médicos |
| PukaSalud | `/salud` | Marketing médico ético para profesionales de salud |
| Desarrollo web | `/desarrollo-web-pymes` | Sitios web para PYMEs |

**Redirects activos** (no crear páginas en estas rutas — ya existen 301 en `next.config.ts`):
- `/inventario` → `/ledgerxpertz`
- `/sistema-inventario` → `/ledgerxpertz`
- `/sistema-erp-cloud` → `/ledgerxpertz`
- `/sistema` → `/ledgerxpertz`

---

## Arquitectura

### App Router (Next.js 15)

- Páginas de producto son `'use client'` — usan estado, hooks y analytics
- Metadata SEO va en `layout.tsx` de cada ruta (no en `page.tsx`)
- JSON-LD / Schema.org se inyecta via `<SEO structuredData={schema} />` en `page.tsx` usando `useEffect` (compatible con `'use client'`)
- Rutas en español (ej. `/agentes-ia`, `/historias-clinicas`)

### Estilos

- **Tailwind CSS** para utilidades base (tipografía, spacing, responsive)
- **Inline styles** para valores glass exactos (los valores `rgba` y `backdrop-filter` arbitrarios no están disponibles como clases Tailwind estándar)
- **Design system Dark Glass Rojo:**
  - Fondo: `#080808`
  - Acento: `#C7171E` (rojo PukaDigital)
  - Cards glass: `background: rgba(255,255,255,0.04)` + `backdrop-filter: blur(24px)` + `-webkit-backdrop-filter`
  - Bordes: `border: 1px solid rgba(255,255,255,0.08)` + `border-top: 1px solid rgba(255,255,255,0.12)`
  - Glow en botones: `box-shadow: 0 0 16-24px rgba(199,23,30,0.4-0.5)`

### Iconos

- **Lucide React** exclusivamente — sin emojis como iconos
- Íconos usados en LedgerXpertz: `FileText`, `Package`, `Monitor`, `ShoppingCart`, `Building2`, `BarChart3`, `Phone`, `Check`, `CheckCircle`, `XCircle`

### Analytics

```typescript
import * as ga from '@/lib/analytics';
ga.trackWhatsAppDirectoClick('nombre_ubicacion');
```

Formato de location: `{producto}_{seccion}` — ej. `ledgerxpertz_hero_primary`, `ledgerxpertz_nav`.

### WhatsApp CTAs

- Número principal: `593964065880`
- Patrón: `https://wa.me/{numero}?text={encodeURIComponent(mensaje)}`
- Todos los CTAs: `window.open(url, '_blank', 'noopener,noreferrer')`
- Llamar `ga.trackWhatsAppDirectoClick()` antes de `window.open()`

---

## SEO y GEO (visibilidad en LLMs)

Ver guía completa: `docs/GEO_LLM_VISIBILITY.md`

### Reglas por página de producto

1. `layout.tsx` — metadata Next.js completa: `title`, `description`, `keywords`, `canonical`, `openGraph`, `twitter`
2. `page.tsx` — dos schemas JSON-LD: `SoftwareApplication` + `FAQPage`
3. `public/llms.txt` — actualizar con nueva URL y precios cada vez que se cree o modifique un producto
4. `public/robots.txt` — no tocar, ya tiene todos los crawlers de IA permitidos

### Schema patterns

```typescript
// Múltiples schemas: pasar array al componente SEO
const schema = [
  { '@type': 'SoftwareApplication', ... },
  { '@type': 'FAQPage', mainEntity: FAQS.map(({q, a}) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  }))},
];
```

### FAQs para LLMs

- Preguntas en formato conversacional, como las escribe un usuario en ChatGPT/Perplexity
- Incluir precios concretos en al menos una respuesta
- Incluir contexto local ("en Ecuador", "SRI", "pymes")
- Mínimo 5 preguntas, óptimo 8-12

### URLs y canibalización

- Una sola URL canónica por producto
- Si hay páginas duplicadas: consolidar en una, crear 301 en `next.config.ts`, eliminar directorios huérfanos
- Actualizar `app/sitemap.ts` al añadir o eliminar rutas

---

## Convenciones de código

- TypeScript estricto — sin `any` en archivos nuevos
- Un solo `<h1>` por página (SEO) — si se necesita split visual, usar `<span>` dentro del mismo `<h1>`
- HTML entities para caracteres especiales en español: `&iquest;` (¿), `&Aacute;` (Á), `&Eacute;` (É), `&ntilde;` (ñ), `&copy;` (©), `&mdash;` (—)
- Arrays de datos (`PLANS`, `FEATURES`, `FAQS`, etc.) declarados a nivel de módulo, fuera del componente
- Glass styles en objeto `glass` a nivel de módulo para reutilización con spread: `...glass.card`

---

## Commits

Formato: `tipo(scope): descripción en español`

```
feat(ledgerxpertz): add FAQ section with FAQPage schema
fix(ledgerxpertz): fix missing accented chars per spec review
feat(llms.txt): actualizar precios y rutas canónicas
```

---

## Landings standalone (sin Navbar/Footer global)

Algunas páginas de producto tienen su propio navbar y footer embebidos (ej. `/ledgerxpertz`). Para que el Navbar/Footer global del sitio no aparezca encima, se usa el componente `ConditionalShell`.

### Cómo funciona

`components/ConditionalShell.tsx` es un componente `'use client'` que usa `usePathname()` para detectar si la ruta actual es una landing standalone. Si lo es, no renderiza `<Navbar />`, `<Footer />`, `<MobileBottomNav />` ni `<SmartChatbot />`.

### Para agregar una nueva landing standalone

Añadir la ruta a `STANDALONE_ROUTES` en `components/ConditionalShell.tsx`:

```typescript
const STANDALONE_ROUTES = [
  '/ledgerxpertz',
  '/nueva-landing',  // ← añadir aquí
];
```

### Por qué no usar route groups `(landings)`

En Next.js App Router el `app/layout.tsx` raíz **siempre** envuelve todas las rutas sin excepción. Un route group `(landings)` con su propio layout solo añade una capa adicional — no reemplaza ni omite el root layout. Para verdaderamente aislar layouts habría que mover TODAS las páginas actuales a un grupo `(site)`, lo que es un refactor de alto riesgo. `ConditionalShell` logra el mismo resultado visual con un cambio mínimo y seguro.

### Responsive en landings

El navbar embebido en las landings usa clases Tailwind para ocultar elementos en móvil:
- Links de navegación: `className="hidden sm:block"` — visibles solo desde 640px
- Botón CTA: `whiteSpace: 'nowrap'` para que no se corte
- Padding reducido en móvil: `padding: '12px 16px'`

---

## Archivos importantes

| Archivo | Propósito |
|---|---|
| `public/robots.txt` | Permite crawlers de IA (no modificar sin revisar GEO_LLM_VISIBILITY.md) |
| `public/llms.txt` | Mapa del sitio para LLMs — actualizar con cada producto nuevo |
| `next.config.ts` | Redirects 301 permanentes |
| `app/sitemap.ts` | Sitemap dinámico — añadir/quitar rutas aquí |
| `lib/analytics.ts` | Tracking de eventos GA — `trackWhatsAppDirectoClick` |
| `components/ConditionalShell.tsx` | Oculta Navbar/Footer en landings standalone — añadir rutas a `STANDALONE_ROUTES` |
| `components/SEO.tsx` | Inyecta JSON-LD via useEffect |
| `docs/GEO_LLM_VISIBILITY.md` | Guía completa de GEO/LLM SEO reutilizable |
| `docs/CRO_MASTERY_GUIDE.md` | Guía de landing pages de alta conversión |
| `docs/ANALYTICS_TRACKING.md` | Convenciones de tracking de eventos |

---

## Comandos útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # ESLint (hay errores pre-existentes en proxy.ts y tipos — no son del trabajo nuevo)
npx tsc --noEmit     # TypeScript check (limpiar .next/ primero si hay errores de rutas eliminadas)
```

**Nota sobre lint:** Hay 180+ problemas pre-existentes en `proxy.ts`, `types/index.ts` y scripts. No son parte del código de las landing pages. Los archivos en `app/` deben estar limpios.
