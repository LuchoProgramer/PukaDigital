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

Implementar con el mismo patrón que LedgerXpertz:
- `waLink(message)` helper con `encodeURIComponent()` para construir las URLs
- Todos los CTAs son `<button>` con `onClick={() => handleCTA(location, url)}`
- `handleCTA` llama `ga.trackWhatsAppDirectoClick(location)` y luego `window.open(url, '_blank', 'noopener,noreferrer')`
- **No usar `<a>` tags** para los CTAs de WhatsApp

```typescript
const WHATSAPP_NUMBER = '593964065880';
const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const WA_LINKS = {
  hero_primary:     waLink('Hola, me interesa probar PukaHealth gratis para mi consultorio.'),
  hero_demo:        waLink('Hola, quiero ver una demo en vivo de PukaHealth.'),
  nav:              waLink('Hola, me interesa probar PukaHealth gratis para mi consultorio.'),
  footer_whatsapp:  waLink('Hola, quiero más información sobre PukaHealth.'),
  footer_primary:   waLink('Hola, me interesa probar PukaHealth gratis para mi consultorio.'),
  pricing_individual: waLink('Hola, me interesa el plan Individual de PukaHealth.'),
  pricing_anual:    waLink('Hola, me interesa el plan Anual de PukaHealth.'),
};
```

Tracking location strings:
- `pukahealth_hero_primary` — CTA primario hero
- `pukahealth_hero_demo` — CTA demo hero
- `pukahealth_nav` — CTA navbar
- `pukahealth_footer_whatsapp` — CTA WhatsApp sección final
- `pukahealth_footer_primary` — CTA primario sección final
- `pukahealth_pricing_individual` — botón plan Individual
- `pukahealth_pricing_anual` — botón plan Anual

---

## Estructura de Secciones

### 1. Navbar (sticky, `position: fixed top-0`)
- Fondo: `#fff` con `border-bottom: 1px solid #e2e8f0` y `box-shadow: 0 1px 8px rgba(0,0,0,0.06)`
- Logo: "PUKA" `#0f172a` + "HEALTH" `#0ea5e9`, `font-weight: 900`, `letter-spacing: 2px`
- Punto animado: `animate-pulse`, `background: #0ea5e9`, `box-shadow: 0 0 8px rgba(14,165,233,1)`
- Links: "Funciones" → `#funciones`, "Precios" → `#precios` — `hidden sm:block`
- CTA: "Probar gratis" — azul con hover, `whiteSpace: 'nowrap'` — `onClick` → `handleCTA('pukahealth_nav', WA_LINKS.nav)`

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

> **Nota precio beta:** Dra. Cristina tiene precio especial $25/mes por acuerdo privado. **No mostrar precio beta en la landing.** La landing pública muestra solo los precios regulares ($50/mes, $480/año).

**2 cards:**

| Plan | Precio | Destacado |
|---|---|---|
| Individual | $50/mes | Sí — badge "MÁS POPULAR" |
| Anual | $480/año ($40/mes equiv.) | No |

Card Individual destacada: `border: 2px solid #0ea5e9`, `box-shadow: 0 8px 32px rgba(14,165,233,0.15)`

Botones CTA por plan:
- **Individual:** "Empezar ahora" — `background: #0ea5e9`, glow azul, `onClick` → `handleCTA('pukahealth_pricing_individual', WA_LINKS.pricing_individual)`
- **Anual:** "Elegir plan anual" — `background: #fff`, `border: 1px solid #e2e8f0`, `color: #0ea5e9`, `onClick` → `handleCTA('pukahealth_pricing_anual', WA_LINKS.pricing_anual)`

Todos los planes incluyen: Historias clínicas ilimitadas, Facturación SRI, Multi-especialidad, Soporte WhatsApp, Actualizaciones incluidas — con icono `Check` de Lucide en `#0ea5e9`.

Nota debajo: "Sin permanencia · Cancela cuando quieras · Soporte directo por WhatsApp" — `color: #94a3b8`

### 6. Tabla Comparativa (`id="comparativa"`)
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
8 cards con `FAQPage` schema. Textos aprobados:

| # | Pregunta (`q`) | Respuesta (`a`) |
|---|---|---|
| 1 | ¿Cuánto cuesta PukaHealth? | PukaHealth cuesta $50 por médico al mes. También hay un plan anual por $480 al año (equivalente a $40/mes, 2 meses gratis). Los primeros 10 médicos no pagan costo de instalación. Ofrecemos 30 días de prueba gratuita sin tarjeta de crédito. |
| 2 | ¿PukaHealth emite facturas al SRI de Ecuador? | Sí. PukaHealth genera facturas electrónicas válidas directamente al SRI con un solo clic, desde la misma plataforma donde registras las consultas. No necesitas ningún sistema adicional. |
| 3 | ¿Funciona para cualquier especialidad médica? | Sí. PukaHealth usa campos JSON adaptables que se configuran por especialidad: podología, medicina general, pediatría, ginecología, y más. Puedes personalizar el expediente clínico según tu práctica. |
| 4 | ¿Necesito instalar algo? | No. PukaHealth es 100% en la nube. Accedes desde cualquier navegador web en tu computadora, tablet o celular. Sin instalaciones, sin actualizaciones manuales. |
| 5 | ¿Tiene período de prueba gratuito? | Sí, 30 días de prueba completamente gratis. No se requiere tarjeta de crédito ni pago por adelantado. |
| 6 | ¿Qué diferencia hay entre PukaHealth y Orpheus? | PukaHealth ofrece campos clínicos completamente flexibles por especialidad (Orpheus tiene formularios fijos), y su precio es menor ($50/mes vs $60–$80/mes de Orpheus). Además incluye soporte directo por WhatsApp. |
| 7 | ¿Qué pasa con mis datos si cancelo? | Tus datos son tuyos. Antes de cancelar puedes exportar todos los expedientes clínicos en formato estándar. No eliminamos tus datos de inmediato — tienes un período de gracia para realizar la exportación. |
| 8 | ¿Cumple con las normativas del Ministerio de Salud (MSP)? | Sí. PukaHealth incluye los formularios clínicos según la normativa del Ministerio de Salud Pública del Ecuador (MSP), incluyendo la historia clínica única. |

### 8. CTA Final
- `background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)`, texto blanco
- Título: "¿Listo para digitalizar tu consultorio?"
- Subtítulo: "Primeros 10 médicos sin costo de instalación. Solo $50/mes."
- CTA WhatsApp: label "Hablar por WhatsApp", icono `Phone`, `background: rgba(37,211,102,0.15)`, `border: rgba(37,211,102,0.30)`, `color: #4ade80` — `onClick` → `handleCTA('pukahealth_footer_whatsapp', WA_LINKS.footer_whatsapp)`
- CTA primario: "Empezar gratis hoy" — `background: #0ea5e9` — `onClick` → `handleCTA('pukahealth_footer_primary', WA_LINKS.footer_primary)`

### 9. Footer (minimal)
Fondo `#0f172a`, texto `#94a3b8`, fuente pequeña. Contenido:
- Copyright: `© {new Date().getFullYear()} PukaDigital. Todos los derechos reservados.` (dinámico)
- Link: `← Volver a pukadigital.com` — `href="/"`, `color: #64748b`
- Sin Navbar/Footer global del sitio (suprimidos por ConditionalShell)

---

## SEO / GEO

### Metadata (`layout.tsx`)
```typescript
export const metadata: Metadata = {
  title: 'PukaHealth | Historias Clínicas Electrónicas con Facturación SRI — Ecuador',
  description: 'Software de historias clínicas electrónicas con facturación SRI para médicos en Ecuador. Multi-especialidad, 100% en la nube. Desde $50/mes. Sin permanencia.',
  keywords: [
    'historias clinicas electronicas',
    'software medico ecuador',
    'historia clinica electronica ecuador',
    'software para consultorio medico',
    'facturacion sri medicos ecuador',
    'pukahealth',
  ],
  alternates: {
    canonical: 'https://pukadigital.com/pukahealth',
  },
  openGraph: {
    url: 'https://pukadigital.com/pukahealth',
    type: 'website',
    title: 'PukaHealth | Historias Clínicas con Facturación SRI',
    description: 'Historias clínicas electrónicas y facturación SRI para médicos en Ecuador. Desde $50/mes.',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PukaHealth | Historias Clínicas con Facturación SRI',
    description: 'Historias clínicas electrónicas y facturación SRI para médicos en Ecuador. Desde $50/mes.',
  },
};
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
    "mainEntity": []
  }
]
```

> Nota: el array `mainEntity` del `FAQPage` se genera en `page.tsx` mapeando el array `FAQS` al formato `{ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }`. El bloque JSON de arriba es solo referencia estructural.

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
| `public/llms.txt` | Modificar — reemplazar la entrada PukaHealth existente (actualmente bajo `/historias-clinicas`, líneas ~54-58) con entrada completa bajo `/pukahealth`. Incluir: precios ($50/mes Individual, $480/año Anual), características principales (historias clínicas, facturación SRI, multi-especialidad), y oferta de 30 días gratis. Seguir el mismo nivel de detalle que la entrada de LedgerXpertz. |
| `app/sitemap.ts` | Modificar — añadir `/pukahealth` con priority 0.9 (la ruta `/historias-clinicas` NO existe como página, no crearla) |

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
