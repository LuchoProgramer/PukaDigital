# Auditoría SEO, APIs de Google y Diagnóstico de Rendimiento — 2026-09-26

Documento de referencia técnica y estratégica sobre la integración de las APIs de **Google Search Console** y **Google Analytics 4 (GA4)**, hallazgos del tráfico real y la cadencia recomendada para optimización continua de SEO.

---

## 1. Conexión de APIs de Google

Se integraron las APIs oficiales con acceso programático mediante Service Account en Google Cloud.

* **Cuenta de Servicio:** `indexing-service@indexacion-podoclinic.iam.gserviceaccount.com`
* **Google Search Console:** Propiedad `sc-domain:pukadigital.com` (Rol: *siteOwner*)
* **Google Analytics 4 (GA4):** Propiedad `514366233` (*Puka Digital*, Rol: *Viewer*)
* **Ubicación de clave local:** `scripts/gsc-key.json` (Excluido en `.gitignore`)
* **Herramienta CLI unificada:** [`scripts/gsc.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/scripts/gsc.ts)

### Comandos disponibles:
```bash
npx tsx scripts/gsc.ts              # Auditoría completa (GSC URLs + Analytics GA4)
npx tsx scripts/gsc.ts inspect <url> # Inspección técnica de Schema e indexación en GSC
npx tsx scripts/gsc.ts analytics 30  # Rendimiento de keywords de los últimos N días
```

---

## 2. Correcciones de Datos Estructurados (Breadcrumbs)

* **Problema:** Search Console alertó `Invalid URL in field "id" (in "itemListElement.item")` en `/casos` y `/nosotros`.
* **Causa:** El helper `getBreadcrumbSchema` generaba el schema JSON-LD con URLs relativas (`/`, `/casos`, `/nosotros`). Google exige URLs absolutas canónicas (`https://pukadigital.com/...`).
* **Solución aplicada:**
  1. [`lib/schema.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/schema.ts#L331-L351): Se modificó `getBreadcrumbSchema` para formatear siempre a URLs absolutas con `BASE_URL`.
  2. [`lib/schema.test.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/schema.test.ts): Se añadió test unitario que garantiza la resolución correcta.
  3. [`app/blog/[slug]/page.tsx`](file:///Users/luisviteri/Proyectos/PukaDigital/app/blog/[slug]/page.tsx#L131-L167): Se eliminó schema duplicado en blog posts.

---

## 3. Diagnóstico de Tráfico Real (Últimos 30 a 90 días)

### A. Rendimiento Orgánico (Google Search Console)
| URL | Clics | Impresiones | CTR | Posición Media | Diagnóstico |
|---|---|---|---|---|---|
| `/pukahealth` | 6 | 118 | 5.08% | 5.3 | Excelente CTR, intención de compra médica alta. |
| `/ledgerxpertz` | 4 | 47 | 8.51% | 6.5 | Conversión de snippet sobresaliente. |
| `/cuanto-cuesta-una-landing-page` | 2 | 127 | 1.57% | 7.6 | Posicionado en top 1-2 para búsquedas de precio. |
| `/blog/cuanto-cuesta-pagina-web-ecuador` | 2 | 811 | 0.25% | 12.6 | **Mayor volumen del sitio**. Oportunidad de escalar x10. |
| `/blog/por-que-me-bloquearon-whatsapp...` | 0 | 115 | 0.00% | 11.0 | A las puertas del top 10 (página 2). |

### B. Comportamiento y Conversiones (GA4)
* **Tráfico GEO / IAs:** 9 sesiones desde `chatgpt.com / ai-assistant` con **77.8% de engagement**. Confirma que ChatGPT recomienda PukaDigital gracias a `llms.txt`.
* **Redes Sociales:** 22 sesiones desde Facebook e Instagram impulsadas por la fábrica de contenido.
* **Leads a WhatsApp:** **9 clics directos al botón de WhatsApp** de 7 usuarios distintos (~6.7% tasa de conversión a lead).

---

## 4. Cadencia Recomendada de Monitoreo SEO

Para no saturarse con métricas diarias pero no dejar escapar oportunidades, esta es la rutina óptima:

### 🕒 1. Quincenal (Cada 15 días) — *Chequeo Rápido de Salud (5 minutos)*
* **Qué hacer:** Ejecutar `npx tsx scripts/gsc.ts`.
* **Qué mirar:**
  1. Que no existan nuevos errores en **Inspección de URLs / Schemas**.
  2. Número de leads a WhatsApp generados en el periodo.

### 📅 2. Mensual (1 vez al mes) — *Optimización de Oportunidades (30 minutos)*
* **Qué hacer:**
  1. Revisar la tabla de **Top Queries con Impresiones** (buscar palabras en posiciones 8 a 15).
  2. **Refinar Snippets (Title + Meta Description):** Si una página tiene muchas impresiones pero CTR < 1%, ajustar su título para volverlo más atractivo (ej. incluir precio, año actual o beneficio directo).
  3. **Enlazado Interno:** Enlazar desde los nuevos artículos del blog hacia las landings de producto (`/pukahealth`, `/ledgerxpertz`, `/agentes-ia`).

### 📊 3. Trimestral (Cada 3 meses) — *Estrategia y Nuevos Contenidos*
* **Qué hacer:**
  1. Comparar crecimiento de impresiones globales trimestrales.
  2. Analizar nuevas intenciones de búsqueda para crear 2-3 artículos pilares en el blog que respondan a dudas frecuentes de clientes reales.
  3. Revisar y actualizar `public/llms.txt` si se han agregado nuevas ofertas o funcionalidades.
