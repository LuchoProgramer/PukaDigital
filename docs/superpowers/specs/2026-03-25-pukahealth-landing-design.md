# PukaHealth Landing Page — Spec de Diseño
**Fecha:** 2026-03-25
**URL destino:** `pukadigital.com/pukahealth`
**Estado:** Aprobado por usuario

---

## Contexto

PukaHealth es un ERP SaaS multi-tenant para médicos en Ecuador. Incluye historias clínicas electrónicas con campos JSON adaptables por especialidad y facturación electrónica SRI. Vive en un proyecto separado y se promueve desde pukadigital.com.

Cliente piloto activo: Dra. Cristina Muñoz, Podoclinic (podología). Precio beta: $25/mes primer año. Precio regular: $50/mes por médico.

La página `/pukahealth` es una landing standalone — usa `ConditionalShell` para suprimir el Navbar/Footer global del sitio. Añadir `/pukahealth` a `STANDALONE_ROUTES` en `components/ConditionalShell.tsx`.

---

## Decisiones de Diseño Aprobadas

### Estética Visual
- **Estilo:** Claro Profesional — blanco, azul médico
- **Fondo:** `#f8fafc` (gris muy claro) con secciones alternas en `#fff`
- **Cards:** `background: #fff`, `border: 1px solid #e2e8f0`, `box-shadow: 0 2px 12px rgba(0,0,0,0.06)`, `border-radius: 12px`
- **Acento:** `#0ea5e9` (azul médico) con `box-shadow: 0 0 20px rgba(14,165,233,0.25)` en botones CTA
- **Hover en botones:** `background: #0284c7`
- **Iconos:** Lucide React exclusivamente — sin emojis
- **Tipografía:** `font-display font-bold` para títulos, `font-sans` para cuerpo
- **Sin glassmorphism** — estilo clínico limpio y profesional

### Logo en Navbar
"PUKA" en `#0f172a` (gris oscuro) + "HEALTH" en `#0ea5e9` (azul), `font-weight: 900`, `letter-spacing: 2px`

### Layout Hero
Dos columnas (desktop) / una columna (mobile):
- **Columna izquierda:** badge, H1, subtítulo, CTAs, nota de precio
- **Columna derecha:** card blanca con testimonio Dra. Cristina + métricas

---

## CTAs y WhatsApp

```
WHATSAPP_NUMBER = "593964065880"

CTA "Probar 30 días gratis" (primario, azul):
  → href: `https://wa.me/593964065880?text=Hola, me interesa probar PukaHealth gratis para mi consultorio.`
  → ga.trackWhatsAppDirectoClick('pukahealth_hero_primary')

CTA "Ver demo en vivo" (secundario, outline):
  → href: `https://wa.me/593964065880?text=Hola, quiero ver una demo en vivo de PukaHealth.`
  → ga.trackWhatsAppDirectoClick('pukahealth_hero_demo')

CTA "Probar gratis" (navbar):
  → href: `https://wa.me/593964065880?text=Hola, me interesa probar PukaHealth gratis para mi consultorio.`
  → ga.trackWhatsAppDirectoClick('pukahealth_nav')

CTA "Escribir por WhatsApp" (CTA final, verde):
  → href: `https://wa.me/593964065880?text=Hola, quiero más información sobre PukaHealth.`
  → ga.trackWhatsAppDirectoClick('pukahealth_footer_whatsapp')

CTA "Empezar gratis hoy" (CTA final, azul):
  → href: `https://wa.me/593964065880?text=Hola, me interesa probar PukaHealth gratis para mi consultorio.`
  → ga.trackWhatsAppDirectoClick('pukahealth_footer_primary')

Todos los CTA: target="_blank" rel="noopener noreferrer"
```

---

## Estructura de Secciones

### 1. Navbar (sticky, `position: fixed top-0`)
- Fondo: `#fff` con `border-bottom: 1px solid #e2e8f0` y `box-shadow: 0 1px 8px rgba(0,0,0,0.06)`
- Logo: "PUKA" `#0f172a` + "HEALTH" `#0ea5e9`, `font-weight: 900`, `letter-spacing: 2px`
- Punto animado: `animate-pulse`, `background: #0ea5e9`, `box-shadow: 0 0 8px rgba(14,165,233,1)`
- Links: "Funciones" → `#funciones`, "Precios" → `#precios` — `hidden sm:block`
- CTA: "Probar gratis" — azul con hover, `whiteSpace: 'nowrap'`

### 2. Hero (`id="hero"`)
Grid 2 columnas desktop / 1 columna mobile:

**Columna izquierda:**
- Badge: `background: #eff6ff`, `border: 1px solid #bfdbfe`, `color: #1d4ed8` — "HISTORIAS CLÍNICAS · FACTURACIÓN SRI · ECUADOR"
- H1 línea 1: "Tu consultorio." — `#0f172a`, `font-display font-bold`, `clamp(36px, 5vw, 58px)`
- H1 línea 2: `<span>` "Sin papeles." — `#0ea5e9`
- Subtítulo: "Historias clínicas electrónicas y facturación SRI en un solo sistema. Accede desde cualquier dispositivo. Desde $50/mes. Sin contrato."
- CTA primario: "Probar 30 días gratis" — `background: #0ea5e9`, glow azul
- CTA secundario: "Ver demo en vivo" — `background: #fff`, `border: 1px solid #cbd5e1`, `color: #475569`
- Nota: "Sin tarjeta de crédito · Primeros 10 médicos sin costo de instalación" — `color: #94a3b8`

**Columna derecha:**
- Card `background: #fff`, `border: 1px solid #e2e8f0`, `border-left: 4px solid #0ea5e9`, `box-shadow: 0 4px 24px rgba(0,0,0,0.08)`
- Testimonio: *"Pasé de llevar todo en papel a tener el historial completo de mis pacientes en segundos. La facturación al SRI me ahorra 2 horas al día."* — Dra. Cristina Muñoz, Podoclinic
- 3 métricas: `100%` SRI válido / `$0` Setup (primeros 10) / `30 días` gratis

### 3. Barra de prueba social
- `background: #f0f9ff`, `border-top: 1px solid #bae6fd`, `border-bottom: 1px solid #bae6fd`
- 4 métricas con separadores:
  1. **100%** / SRI Compliance
  2. **En la nube** / Sin instalación
  3. **Multi-especialidad** / Campos adaptables
  4. **$0** / Setup (10 primeros)
- Valores en `#0ea5e9 font-bold`, etiquetas en `#64748b`

### 4. Features Grid (`id="funciones"`)
Label sección: "TODO LO QUE INCLUYE" — `color: #94a3b8`, `letter-spacing: 3px`
Grid 3 columnas (mobile: 1 columna). 6 cards:

| # | Título | Icono Lucide | Descripción |
|---|---|---|---|
| 1 | Historias Clínicas | `FileText` | Expediente digital completo, adaptable a tu especialidad |
| 2 | Facturación SRI | `Receipt` | Facturas electrónicas válidas al SRI con un clic |
| 3 | Multi-especialidad | `Stethoscope` | Campos personalizados por especialidad (JSON adaptable) |
| 4 | 100% en la nube | `Cloud` | Accede desde computadora, tablet o celular sin instalaciones |
| 5 | Cumplimiento MSP | `ShieldCheck` | Formularios según normativa del Ministerio de Salud Ecuador |
| 6 | Reportes | `BarChart3` | Estadísticas de consultas, diagnósticos frecuentes y facturación |

Cada card: `background: #fff`, `border: 1px solid #e2e8f0`, `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`, `border-top: 3px solid #0ea5e9`, icono en `#0ea5e9` tamaño 22px.

### 5. Pricing (`id="precios"`)
Label sección: "ELIGE TU PLAN"
Sin toggle — modelo simple por médico:

**2 cards:**

| Plan | Precio | Destacado |
|---|---|---|
| Individual | $50/mes | Sí — badge "MÁS POPULAR" |
| Anual | $480/año ($40/mes equiv.) | No |

Card Individual destacada: `border: 2px solid #0ea5e9`, `box-shadow: 0 8px 32px rgba(14,165,233,0.15)`

Todos los planes incluyen: Historias clínicas ilimitadas, Facturación SRI, Multi-especialidad, Soporte WhatsApp, Actualizaciones incluidas — con icono `Check` de Lucide en `#0ea5e9`.

Nota debajo: "Sin permanencia · Cancela cuando quieras · Soporte directo por WhatsApp" — `color: #94a3b8`

### 6. Tabla Comparativa
Grid 3 columnas: Feature | PukaHealth (header `#0ea5e9`) | Orpheus | Excel

| Feature | PukaHealth | Orpheus | Excel |
|---|---|---|---|
| Historias clínicas | `CheckCircle` verde | `CheckCircle` verde | `XCircle` rojo |
| Facturación SRI integrada | `CheckCircle` verde | `CheckCircle` verde | `XCircle` rojo |
| Multi-especialidad (campos flexibles) | `CheckCircle` verde | `XCircle` rojo | `XCircle` rojo |
| 100% en la nube | `CheckCircle` verde | `CheckCircle` verde | `XCircle` rojo |
| Precio mensual | **$50** en `#0ea5e9` | ~$60–$80 | $0 (pero horas perdidas) |

### 7. FAQ (`id="faq"`)
Label: "PREGUNTAS FRECUENTES"
8 cards con `FAQPage` schema:

1. ¿Cuánto cuesta PukaHealth?
2. ¿PukaHealth emite facturas al SRI de Ecuador?
3. ¿Funciona para cualquier especialidad médica?
4. ¿Necesito instalar algo?
5. ¿Tiene período de prueba gratuito?
6. ¿Qué diferencia hay entre PukaHealth y Orpheus?
7. ¿Qué pasa con mis datos si cancelo?
8. ¿Cumple con las normativas del Ministerio de Salud (MSP)?

### 8. CTA Final
- `background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)`, texto blanco
- Título: "¿Listo para digitalizar tu consultorio?"
- Subtítulo: "Primeros 10 médicos sin costo de instalación. Solo $50/mes."
- CTA WhatsApp: `background: rgba(37,211,102,0.15)`, `border: rgba(37,211,102,0.30)`, `color: #4ade80` + icono `Phone`
- CTA primario: "Empezar gratis hoy" — `background: #0ea5e9`

---

## SEO / GEO

### Metadata (`layout.tsx`)
```typescript
title: 'PukaHealth | Historias Clínicas Electrónicas con Facturación SRI — Ecuador',
description: 'Software de historias clínicas electrónicas con facturación SRI para médicos en Ecuador. Multi-especialidad, 100% en la nube. Desde $50/mes. Sin permanencia.',
keywords: ['historias clinicas electronicas', 'software medico ecuador', 'historia clinica electronica ecuador', 'software para consultorio medico', 'facturacion sri medicos ecuador', 'pukahealth'],
canonical: 'https://pukadigital.com/pukahealth',
```

### Schema.org (`page.tsx`)
```json
[
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PukaHealth",
    "url": "https://pukadigital.com/pukahealth",
    "applicationCategory": "MedicalApplication",
    "operatingSystem": "Web, iOS, Android",
    "inLanguage": "es-EC",
    "provider": { "@id": "https://pukadigital.com/#organization" },
    "areaServed": { "@type": "Country", "name": "Ecuador" },
    "offers": [
      {
        "@type": "Offer",
        "name": "Individual",
        "price": "50.00",
        "priceCurrency": "USD",
        "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "mes" },
        "description": "1 médico — Historias clínicas, Facturación SRI, Multi-especialidad"
      },
      {
        "@type": "Offer",
        "name": "Anual",
        "price": "480.00",
        "priceCurrency": "USD",
        "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "año" },
        "description": "1 médico — Todo incluido, 2 meses gratis"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": "/* generado desde array FAQS en page.tsx */"
  }
]
```

---

## Stack Técnico

- **Framework:** Next.js App Router, `'use client'` en `page.tsx`
- **Estilos:** Tailwind CSS + inline styles para valores exactos
- **Iconos:** Lucide React — `FileText`, `Receipt`, `Stethoscope`, `Cloud`, `ShieldCheck`, `BarChart3`, `Phone`, `Check`, `CheckCircle`, `XCircle`
- **Analytics:** `import * as ga from '@/lib/analytics'` — `ga.trackWhatsAppDirectoClick(location)`
- **Schema:** via `<SEO structuredData={schema} />` en `page.tsx`
- **Estado:** ninguno (sin toggle de precios)
- **Standalone:** añadir `/pukahealth` a `STANDALONE_ROUTES` en `components/ConditionalShell.tsx`

---

## Archivos a Crear/Modificar

| Archivo | Acción |
|---|---|
| `app/pukahealth/layout.tsx` | Crear — metadata SEO completa |
| `app/pukahealth/page.tsx` | Crear — landing completa |
| `components/ConditionalShell.tsx` | Modificar — añadir `/pukahealth` a `STANDALONE_ROUTES` |
| `public/llms.txt` | Modificar — añadir PukaHealth con precios |
| `app/sitemap.ts` | Modificar — añadir `/pukahealth` con priority 0.9 |

---

## Criterios de Éxito

- URL canónica `/pukahealth` sin conflicto con `/salud` (productos distintos)
- Navbar global suprimido (ConditionalShell)
- Testimonio Dra. Cristina visible en el hero
- Schema `SoftwareApplication` + `FAQPage` válidos
- Todos los CTAs con `ga.trackWhatsAppDirectoClick()`
- Sin emojis — solo Lucide React
- Responsive mobile-first
- `public/llms.txt` actualizado
