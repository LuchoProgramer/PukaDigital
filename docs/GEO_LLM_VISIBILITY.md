# GEO — Optimización para Motores de IA (LLM Visibility)

Guía de mejores prácticas para que las páginas de PukaDigital y sus clientes aparezcan citadas en ChatGPT, Perplexity, Google AI Overviews, Claude y Gemini.

Investigado y aplicado en: `pukadigital.com/ledgerxpertz` — marzo 2026.

---

## Por qué importa

Los LLMs citan entre 2 y 7 dominios por respuesta (vs. 10 resultados de Google). La competencia por un slot es mucho más intensa. El tráfico de IA es de alta intención — quien pregunta a un LLM "cuál es el mejor sistema POS para Ecuador" está a un paso de comprar.

**Dato clave:** Las marcas son 6.5x más probables de ser citadas a través de fuentes de terceros que desde su propio dominio. El SEO tradicional ya no es suficiente.

---

## 1. Infraestructura técnica (hacer una sola vez)

### robots.txt — permitir todos los crawlers de IA

```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /
```

### llms.txt — mapa del sitio para LLMs

Archivo Markdown en `/public/llms.txt` (accesible en `tudominio.com/llms.txt`).

**Estructura mínima:**
```markdown
# NombreEmpresa — Descripción en una línea

> Misión y propuesta de valor en 2-3 oraciones.

## EMPRESA
Nombre, fundador, ubicación, contacto, horario.

## PRODUCTOS / SERVICIOS
### 1. Nombre del Producto (/ruta)
Descripción, características, precios, diferenciadores, CTA.

## RUTAS DEL SITIO
- /ruta — descripción breve

## AUTORIDAD (E-E-A-T)
- Casos de éxito con métricas reales
- Tecnología propia / certificaciones

## ENLACES OFICIALES
Web, LinkedIn, YouTube, GitHub, etc.
```

**Reglas:**
- Incluir precios explícitos — los LLMs los extraen para responder "¿cuánto cuesta X?"
- Actualizar cada vez que cambie una URL, precio o producto
- Las rutas antiguas con redirects deben eliminarse; usar solo las URLs canónicas

---

## 2. Schema.org — el más importante para LLMs

Los LLMs prefieren JSON-LD porque es programáticamente parseable y está separado del HTML.

### Stack por tipo de página

| Página | Schema primario | Schema secundario |
|---|---|---|
| Homepage | `Organization` | `WebSite` |
| Producto SaaS | `SoftwareApplication` | `Offer` |
| Landing con preguntas | `FAQPage` | — |
| Blog / guía | `Article` | `BreadcrumbList` |
| Negocio local | `LocalBusiness` | `Organization` |

### SoftwareApplication (para productos SaaS)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NombreProducto",
  "url": "https://tudominio.com/producto",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "inLanguage": "es-EC",
  "provider": { "@id": "https://tudominio.com/#organization" },
  "areaServed": { "@type": "Country", "name": "Ecuador" },
  "offers": [
    {
      "@type": "Offer",
      "name": "Plan Nombre",
      "price": "10.00",
      "priceCurrency": "USD",
      "priceSpecification": { "@type": "UnitPriceSpecification", "unitText": "mes" },
      "description": "Descripción del plan"
    }
  ]
}
```

**Notas:**
- `areaServed` con el país específico mejora visibilidad en queries geolocalizados
- `priceSpecification.unitText: "mes"` es el formato correcto para SaaS mensual (no usar `billingIncrement`)
- Si hay varios planes, incluir un `Offer` por plan

### FAQPage (el schema de mayor impacto para citaciones)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Pregunta exacta como la escribe el usuario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Respuesta completa, directa, sin rodeos. Incluir datos concretos (precios, porcentajes, nombres de características)."
      }
    }
  ]
}
```

**Reglas para las preguntas FAQ:**
- Escribirlas exactamente como alguien las escribiría en ChatGPT o Perplexity
- Incluir el nombre del país/región en algunas preguntas ("en Ecuador", "para PYMEs")
- Mínimo 5 preguntas, óptimo 8-12
- Las respuestas deben ser autosuficientes — el LLM las puede citar sin contexto adicional
- Incluir precios concretos en al menos una respuesta

### Múltiples schemas en una página

Pasar un array al componente SEO:

```typescript
const schema = [
  { "@type": "SoftwareApplication", ... },
  { "@type": "FAQPage", ... },
];
```

El componente SEO de este proyecto (`@/components/SEO`) acepta `structuredData` como objeto o array y lo serializa correctamente.

---

## 3. Estructura de contenido

### Headings en formato pregunta

Cambiar headings descriptivos por preguntas directas:

| En lugar de... | Usar... |
|---|---|
| "Características" | "¿Qué incluye [Producto]?" |
| "Precios" | "¿Cuánto cuesta [Producto]?" |
| "Sobre nosotros" | "¿Quién está detrás de [Empresa]?" |
| "Cómo funciona" | "¿Cómo funciona [Producto] paso a paso?" |

Los LLMs extraen respuestas de pares H2/H3 + párrafo siguiente.

### Elementos obligatorios por página de producto

1. **Quick-answer en el hero** — responder la pregunta central en 2-3 oraciones antes de cualquier otro contenido
2. **Precio visible desde arriba del fold** — "desde $X/mes" en el hero
3. **Sección FAQ** con `FAQPage` schema — mínimo 5 preguntas de alta intención
4. **Tabla comparativa** vs. competidores o alternativas (Excel, papel, otros sistemas)
5. **Datos concretos** — porcentajes, números, nombres de integraciones (SRI, Meta, etc.)
6. **`dateModified`** en el JSON-LD — actualizar cada 7-14 días para señal de frescura

### Nota sobre idioma para Ecuador / LATAM

- Escribir en español nativo ecuatoriano — no traducido del inglés
- Los LLMs en respuestas en español favorecen contenido que suena naturalmente local
- Mencionar explícitamente el contexto local: "SRI", "pymes ecuatorianas", "facturación electrónica Ecuador"

---

## 4. Presencia en terceros (mayor palanca a largo plazo)

Las marcas son 6.5x más citadas a través de terceros que desde su propio dominio.

### Plataformas prioritarias para SaaS B2B

| Plataforma | Por qué importa | Acción |
|---|---|---|
| **G2** | El dominio más citado por LLMs para software B2B | Crear perfil, conseguir 10+ reseñas auténticas |
| **Capterra / GetApp** | Misma red Gartner, ampliamente indexada | Perfil completo con precios y screenshots |
| **Product Hunt** | Alta presencia en datos de entrenamiento de LLMs | Lanzar el producto, responder comentarios |
| **Reddit** | 46.7% de citas de Perplexity vienen de Reddit | Participar en subreddits relevantes auténticamente |
| **LinkedIn** | Claude y Perplexity usan redes profesionales | Página de empresa activa |
| **Trustpilot** | Señal de confianza para Google AI Overviews | Reseñas de clientes reales |

### Para Ecuador / LATAM específicamente

- GetApp en español
- Directorios de empresas ecuatorianas (Páginas Amarillas, Ecuador B2B)
- Menciones en grupos de Facebook de PYMEs ecuatorianas
- Cobertura en medios: Hipertextual, Enter.co, TechCrunch en Español
- Un solo artículo bien posicionado en un medio citado = impacto mayor que 100 backlinks

---

## 5. Cómo cita cada plataforma

| Plataforma | Fuente principal de citas | Correlación con Google | Señal más importante |
|---|---|---|---|
| **Perplexity** | Google top-10 + Reddit (46.7%) | 91% | Frescura (82% cita contenido <30 días) |
| **ChatGPT** | Bing + G2/Capterra + Reddit | 14% solapamiento con Google | Reseñas en agregadores, GPTBot permitido |
| **Google AI Overviews** | Propio dominio (52%) + YouTube | 52% top-10 | SEO tradicional + schema + Local |
| **Claude** | UGC + publicaciones especializadas | Media | Menciones en medios, G2, Reddit |

**Conclusión práctica:** No optimizar para una sola plataforma. El 11% de dominios son citados por tanto ChatGPT como Perplexity — necesitas una estrategia multi-plataforma.

---

## 6. Implementación en este proyecto (referencia)

### Archivos relevantes

| Archivo | Contenido GEO |
|---|---|
| `public/robots.txt` | Todos los crawlers de IA permitidos |
| `public/llms.txt` | Mapa completo del sitio para LLMs |
| `app/ledgerxpertz/layout.tsx` | Metadata Next.js: title, description, OG, canonical, keywords |
| `app/ledgerxpertz/page.tsx` | `SoftwareApplication` + `FAQPage` schemas, sección FAQ visual |
| `@/components/SEO` | Componente que inyecta JSON-LD via `useEffect` (compatible con `'use client'`) |

### Patrón de implementación de schemas en páginas `'use client'`

En Next.js App Router, las páginas `'use client'` no pueden usar `generateMetadata`. La solución:

- `layout.tsx` — metadata estática de Next.js (title, description, OG, canonical)
- `page.tsx` — JSON-LD via componente `<SEO structuredData={schema} />` que usa `useEffect`

### Checklist de verificación por página

- [ ] `robots.txt` permite GPTBot, ClaudeBot, PerplexityBot
- [ ] `llms.txt` actualizado con la nueva URL y precios
- [ ] `layout.tsx` con metadata completa (title, description, canonical, OG, twitter)
- [ ] Schema `SoftwareApplication` o `Article` según tipo de página
- [ ] Schema `FAQPage` con mínimo 5 preguntas en formato conversacional
- [ ] Precios explícitos visibles en el hero y en el schema
- [ ] `areaServed: Ecuador` en schemas de productos locales
- [ ] Sección FAQ visible en la página (no solo en el schema)
- [ ] H2/H3 en formato pregunta
- [ ] `dateModified` en JSON-LD

---

## 7. Métricas para medir visibilidad en LLMs

Herramientas para monitorear si tu marca aparece en respuestas de IA:

- **Profound** (tryprofound.com) — tracking de menciones en ChatGPT, Perplexity, Gemini
- **Otterly.ai** — monitoreo de brand en LLMs
- **BrandMentions** — incluye fuentes de IA
- **Manual:** preguntar directamente a ChatGPT/Perplexity "¿cuál es el mejor sistema POS con facturación SRI en Ecuador?" y ver si aparece

---

*Última actualización: 2026-03-24 | Basado en investigación de Firebrand, LLMrefs, Profound, Averi.ai, Omniscient Digital.*
