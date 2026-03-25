# LedgerXpertz Landing Page — Spec de Diseño
**Fecha:** 2026-03-24
**URL destino:** `pukadigital.com/ledgerxpertz`
**Estado:** Aprobado por usuario

---

## Contexto

LedgerXpertz es un ERP SaaS multi-tenant para PYMEs en Ecuador. Incluye inventario en tiempo real, facturación electrónica SRI, POS, e-commerce y soporte multi-sucursal. Vive en un proyecto separado (`~/Proyectos/inventario`) y se promueve desde pukadigital.com.

Las páginas previas (`/sistema-inventario`, `/sistema-erp-cloud`, `/inventario`) fueron consolidadas en `/ledgerxpertz` con redirects 301 ya configurados en `next.config.ts` y `app/sitemap.ts`.

---

## Decisiones de Diseño Aprobadas

### Estética Visual
- **Estilo:** Dark Glass Rojo
- **Fondo:** `#080808` con orbes de luz roja (`rgba(199,23,30,0.10–0.18)`) via `radial-gradient` — `position: absolute`, `pointer-events: none`
- **Cards/secciones:** `background: rgba(255,255,255,0.04–0.05)` + `backdrop-filter: blur(24–32px)` + `-webkit-backdrop-filter: blur(24–32px)`
- **Bordes:** `border: 1px solid rgba(255,255,255,0.08–0.10)` + `border-top: 1px solid rgba(255,255,255,0.12–0.15)` para efecto de luz superior
- **Sombras:** `box-shadow: 0 8px 40px rgba(0,0,0,0.4–0.5), inset 0 1px 0 rgba(255,255,255,0.07–0.08)`
- **Acento:** `#C7171E` (rojo PukaDigital) con `text-shadow: 0 0 30px rgba(199,23,30,0.4)` y `box-shadow` glow en botones
- **Iconos:** Lucide React exclusivamente — sin emojis
- **Tipografía:** `font-display font-bold` para títulos, `font-sans` para cuerpo, texto blanco sobre fondo oscuro

### Layout
- **Estructura:** Layout C — precio visible desde el hero, flujo compacto y directo
- **Scroll:** Una sola página, sin subpáginas de producto

---

## CTAs y WhatsApp

```
WHATSAPP_NUMBER = "593964065880"

CTA "Prueba 30 días gratis" (primario, rojo):
  → href: `https://wa.me/593964065880?text=Hola, me interesa probar LedgerXpertz gratis para mi negocio.`
  → ga.trackWhatsAppDirectoClick('ledgerxpertz_hero_primary')

CTA "Ver demo en vivo" (secundario, glass outline):
  → href: `https://wa.me/593964065880?text=Hola, quiero ver una demo en vivo de LedgerXpertz.`
  → ga.trackWhatsAppDirectoClick('ledgerxpertz_hero_demo')

CTA "Empezar gratis" (navbar):
  → href: `https://wa.me/593964065880?text=Hola, me interesa probar LedgerXpertz gratis para mi negocio.`
  → ga.trackWhatsAppDirectoClick('ledgerxpertz_nav')

CTA "Escribir por WhatsApp" (CTA final, glass verde):
  → href: `https://wa.me/593964065880?text=Hola, quiero más información sobre LedgerXpertz.`
  → ga.trackWhatsAppDirectoClick('ledgerxpertz_footer_whatsapp')
  → Icono: `Phone` de Lucide

CTA "Empezar gratis hoy" (CTA final, rojo):
  → href: `https://wa.me/593964065880?text=Hola, me interesa probar LedgerXpertz gratis para mi negocio.`
  → ga.trackWhatsAppDirectoClick('ledgerxpertz_footer_primary')

Todos los CTA: target="_blank" rel="noopener noreferrer"
```

---

## Estructura de Secciones

### 1. Navbar (sticky, `position: fixed top-0`)
- Glass oscuro: `rgba(255,255,255,0.03)` + `backdrop-filter: blur(24px)` + `border-bottom: 1px solid rgba(255,255,255,0.07)`
- Logo: punto rojo animado (`animate-pulse`, glow `box-shadow: 0 0 12px rgba(199,23,30,1)`) + "LEDGERXPERTZ" en mayúsculas, `letter-spacing: 3px`, blanco
- Links internos: "Precios" → `#precios`, "Features" → `#features` (smooth scroll)
- CTA: botón rojo "Empezar gratis" con glow, `box-shadow: 0 0 16px rgba(199,23,30,0.5)`

### 2. Hero (`id="hero"`)
- Badge: texto pequeño en mayúsculas, `letter-spacing: 4px`, `color: rgba(255,255,255,0.30)` — "POS · INVENTARIO · FACTURACIÓN SRI · E-COMMERCE"
- H1 línea 1: "Todo tu negocio." — blanco, `font-display font-bold`, grande
- H1 línea 2: "Un solo sistema." — `#C7171E` con `text-shadow: 0 0 30px rgba(199,23,30,0.4)`
- Subtítulo: "Factura al SRI, controla tu stock en tiempo real y vende online. Todo desde $10/mes. Sin contrato. Sin permanencia."
- Precio badge glass: `background: rgba(255,255,255,0.06)`, `backdrop-filter: blur(16px)`, `border: 1px solid rgba(255,255,255,0.12)`, `border-top: 1px solid rgba(255,255,255,0.18)` — muestra "desde $10/mes"
- CTA primario: "Prueba 30 días gratis" — rojo con glow
- CTA secundario: "Ver demo en vivo" — glass outline (`rgba(255,255,255,0.06)` bg, `border: rgba(255,255,255,0.12)`)
- Nota debajo: "Sin tarjeta de crédito · Primeros 30 clientes sin costo de instalación" — `color: rgba(255,255,255,0.20)`, texto pequeño

### 3. Social Proof Bar
- Glass sutil: `rgba(255,255,255,0.03)`, `border: rgba(255,255,255,0.06)`, `border-top: rgba(255,255,255,0.10)`
- 4 métricas con separadores verticales (`width: 1px`, `background: rgba(255,255,255,0.07)`):
  1. **100%** / SRI Compliance
  2. **Real-time** / Stock en vivo
  3. **Multi-canal** / Tienda + Web + Delivery
  4. **$0** / Setup (30 primeros)
- Valores en `#C7171E` con `text-shadow` glow, etiquetas en `rgba(255,255,255,0.35)`

### 4. Features Grid (`id="features"`)
Label sección: "TODO LO QUE INCLUYE" — `color: rgba(255,255,255,0.25)`, `letter-spacing: 3px`

Grid 3 columnas (mobile: 2 columnas → 1 columna en xs). 6 cards glass:

| # | Título | Icono Lucide | Descripción |
|---|---|---|---|
| 1 | Facturación SRI | `FileText` | Facturas, guías y notas de crédito automáticas |
| 2 | Inventario Real-time | `Package` | Stock actualizado al instante en todos los canales |
| 3 | POS Completo | `Monitor` | Caja, turnos y múltiples formas de pago |
| 4 | E-commerce | `ShoppingCart` | Tu tienda online sincronizada con tu bodega |
| 5 | Multi-sucursal | `Building2` | Hasta 3 locales desde un solo dashboard |
| 6 | Reportes 24/7 | `BarChart3` | Ventas, kardex y cierre de caja en tu celular |

Cada card: `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(20px)`, `border: rgba(255,255,255,0.08)`, `border-top: rgba(255,255,255,0.12)`, icono en `#C7171E` tamaño 22px.

### 5. Pricing (`id="precios"`)
Label sección: "ELIGE TU PLAN"

**Toggle mensual/anual:**
- Estado inicial: **mensual**
- Al activar anual: mostrar precio mensual equivalente ($8/$12/$16) con el precio original tachado ($10/$15/$20) + badge "2 meses gratis"
- Precio anual total ($96/$144/$192) como subtexto debajo
- Implementar con `useState<'mensual' | 'anual'>('mensual')`

**3 cards glass:**

| Plan | Mensual | Equiv. anual/mes | Total anual | Sucursales | Destacado |
|---|---|---|---|---|---|
| Starter | $10 | $8 | $96 | 1 | No |
| Grow | $15 | $12 | $144 | 2 | Sí — badge "MÁS POPULAR" |
| Pro | $20 | $16 | $192 | 3 | No |

Card Grow: `background: rgba(199,23,30,0.10)`, `border: rgba(199,23,30,0.35)`, `border-top: rgba(255,100,100,0.25)`, `box-shadow: 0 8px 40px rgba(199,23,30,0.15)`. Badge "MÁS POPULAR" rojo en `position: absolute top: -9px`.

Todos los planes incluyen: Facturación SRI, POS, Inventario, E-commerce — con icono `Check` de Lucide en `#C7171E`.

Nota debajo del grid: "Sin permanencia · Cancela cuando quieras · Soporte por WhatsApp" — `color: rgba(255,255,255,0.18)`.

### 6. Tabla Comparativa vs Competencia
Glass sutil. Grid 3 columnas: Feature | LedgerXpertz (header en `#C7171E`) | Otros

| Feature | LedgerXpertz | Otros |
|---|---|---|
| Facturación SRI | `Check` verde | `Check` verde |
| Inventario en tiempo real | `Check` verde | `X` rojo tenue |
| E-commerce integrado | `Check` verde | `X` rojo tenue |
| Sync Delivery (Uber Eats) | `Check` verde | `X` rojo tenue |
| Precio mensual | **$10** en `#C7171E` | $20–$50 |

Iconos: `CheckCircle` de Lucide para Sí, `XCircle` para No.

### 7. CTA Final
- Glass prominente: `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(28px)`, `border: rgba(199,23,30,0.20)`, `border-top: rgba(255,255,255,0.10)`
- Título: "¿Listo para dejar el Excel?"
- Subtítulo: "Primeros 30 clientes sin costo de instalación. Solo $10/mes."
- CTA WhatsApp: glass verde (`background: rgba(37,211,102,0.15)`, `border: rgba(37,211,102,0.30)`, `color: #4ade80`) + icono `Phone` de Lucide
- CTA principal: "Empezar gratis hoy" — rojo con `box-shadow: 0 0 24px rgba(199,23,30,0.40)`

---

## SEO / GEO

### Meta principal
- **Title:** `LedgerXpertz | Sistema POS con Facturación SRI para PYMEs Ecuador`
- **Description:** `Sistema POS con inventario en tiempo real y facturación electrónica SRI. Controla stock, vende online y factura desde $10/mes. Sin permanencia.`
- **Keywords primarias (compra):** `sistema de inventario`, `control de inventario`, `sistema pos`, `sistema punto de venta`, `software de inventario`

### layout.tsx — Metadata completa
```typescript
export const metadata: Metadata = {
  title: 'LedgerXpertz | Sistema POS con Facturación SRI para PYMEs Ecuador',
  description: 'Sistema POS con inventario en tiempo real y facturación electrónica SRI. Controla stock, vende online y factura desde $10/mes. Sin permanencia.',
  alternates: {
    canonical: 'https://pukadigital.com/ledgerxpertz',
  },
  openGraph: {
    url: 'https://pukadigital.com/ledgerxpertz',
    type: 'website',
    title: 'LedgerXpertz | Sistema POS con Facturación SRI',
    description: 'Inventario en tiempo real, POS, facturación SRI y e-commerce desde $10/mes.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LedgerXpertz | Sistema POS con Facturación SRI',
    description: 'Inventario en tiempo real, POS, facturación SRI y e-commerce desde $10/mes.',
  },
}
```

### Schema.org (JSON-LD en page.tsx)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LedgerXpertz",
  "url": "https://pukadigital.com/ledgerxpertz",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "inLanguage": "es-EC",
  "provider": { "@id": "https://pukadigital.com/#organization" },
  "areaServed": { "@type": "Country", "name": "Ecuador" },
  "offers": [
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "10.00",
      "priceCurrency": "USD",
      "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "mes" },
      "description": "1 sucursal — Facturación SRI, POS, Inventario, E-commerce"
    },
    {
      "@type": "Offer",
      "name": "Grow",
      "price": "15.00",
      "priceCurrency": "USD",
      "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "mes" },
      "description": "2 sucursales — Facturación SRI, POS, Inventario, E-commerce"
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "20.00",
      "priceCurrency": "USD",
      "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "mes" },
      "description": "3 sucursales — Facturación SRI, POS, Inventario, E-commerce + Delivery"
    }
  ]
}
```

### Contenido blog (SEO informacional — futuro)
1. "Por qué Excel ya no funciona para tu inventario" → keyword: `inventario en excel` (210/mes)
2. "Cómo conectar tu negocio al SRI: guía completa" → keyword: `facturación electrónica sri` (6,600/mes)
3. "Mejor sistema POS para tiendas y licorerías en Ecuador" → keyword: `sistema pos` (170/mes)

---

## Modelo de Precios

| | Starter | Grow | Pro |
|---|---|---|---|
| Sucursales | 1 | 2 | 3 |
| Mensual | $10 | $15 | $20 |
| Equiv. anual/mes | $8 | $12 | $16 |
| Total anual | $96 | $144 | $192 |
| Setup fee | $0 (primeros 30) | $0 (primeros 30) | $0 (primeros 30) |

**Infraestructura:** VPS Hetzner ~$8/mes actual. Escalar a CPX31 (~$13/mes) a los 50 clientes, CPX41 (~$22/mes) a los 100 clientes.

**Meta MRR:** $500 en 6 meses (~50 clientes Starter o mezcla).

---

## Stack Técnico

- **Framework:** Next.js App Router, `'use client'` en `page.tsx`
- **Estilos:** Tailwind CSS inline styles para los valores exactos de glass (rgba/blur no disponibles como clases estándar de Tailwind)
- **Iconos:** Lucide React — `FileText`, `Package`, `Monitor`, `ShoppingCart`, `Building2`, `BarChart3`, `Phone`, `Check`, `CheckCircle`, `XCircle`, `ArrowRight`, `Zap`
- **Analytics:** `import * as ga from '@/lib/analytics'` — `ga.trackWhatsAppDirectoClick(location)` en cada CTA
- **Schema:** `<script type="application/ld+json">` inline en `page.tsx`
- **i18n:** Texto hardcodeado en español — sin `useTranslation` (página de producto específico)
- **Estado:** `useState<'mensual' | 'anual'>` para toggle de precios

---

## Archivos Afectados

| Archivo | Acción | Estado |
|---|---|---|
| `app/ledgerxpertz/page.tsx` | Reemplazar — landing definitiva | Pendiente |
| `app/ledgerxpertz/layout.tsx` | Crear — metadata SEO completa | Pendiente |
| `next.config.ts` | Redirects 301 a `/ledgerxpertz` | Ya completado |
| `app/sitemap.ts` | `/ledgerxpertz` priority 0.9 | Ya completado |
| `app/inventario/` | Eliminado | Ya completado |
| `app/sistema-inventario/` | Eliminado | Ya completado |
| `app/sistema-erp-cloud/` | Eliminado | Ya completado |
| `app/sistema/page.tsx` | Código muerto (redirect activo) — eliminar directorio | Pendiente |

---

## Criterios de Éxito

- Una sola URL canónica `/ledgerxpertz` sin canibalización
- Schema.org válido con los 3 planes de precio y `areaServed: Ecuador`
- Metadata OG y canonical en `layout.tsx`
- Todos los CTAs con tracking `ga.trackWhatsAppDirectoClick()`
- Toggle mensual/anual funcional con estado inicial en mensual
- Sin emojis — solo iconos Lucide React
- Glass con `backdrop-filter: blur(24–32px)` + `-webkit-backdrop-filter` para Safari
- Responsive: mobile-first (grid 1 col → 2 col → 3 col)
- Todos los links externos: `target="_blank" rel="noopener noreferrer"`
