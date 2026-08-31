# Historial SEO — PukaDigital

> Archivo extraído de `CLAUDE.md` el 2026-08-29. Es **historial cerrado**, no doctrina vigente.
> Las reglas SEO/GEO activas viven en `CLAUDE.md`. Si algo de aquí contradice ese archivo, manda `CLAUDE.md`.

## SEO — Keyword Research (2026-04-11)

### Hallazgo principal: PukaIA es un CRM, no solo un chatbot

**El posicionamiento actual en `/agentes-ia` está mal enfocado.** Las keywords actuales apuntan a "API de WhatsApp" y "chatbot con IA", pero el producto tiene inbox centralizado, pipeline Kanban, gestión de clientes, reportes e integraciones — es un **CRM completo con agentes IA**. Esto es una ventaja competitiva que no se está comunicando en SEO.

Competidores que sí se posicionan como CRM cobran 5-15x más:
- Mercately (Ecuador): desde $99/mes hasta $499/mes
- Zolutium: desde $79/mes
- Sellerchat: desde $49/mes

**PukaIA Pro ($25/mes) compite directamente con productos de $99-499/mes.**

### Keywords con volumen real en Ecuador (Google Keyword Planner)

| Keyword | Volumen | Competencia | Bid estimado |
|---|---|---|---|
| `crm para whatsapp business` | 10/mes | Alta | $12.78 |
| `chatbot whatsapp ecuador` | 10/mes | Alta | — |
| `crm barato` | 10/mes | Alta | — |
| `chatbot con inteligencia artificial para whatsapp` | 10/mes | Alta | — |
| `crm para whatsapp business gratis` | 10/mes | Media | — |

> Nota: "10/mes" en Keyword Planner para Ecuador puede representar decenas o cientos de búsquedas reales — el planificador redondea a la baja en mercados pequeños.

### Diagnóstico por página

| Página | Estado keywords | Problema |
|---|---|---|
| `/agentes-ia` (`app/agentes-ia/layout.tsx`) | **CRÍTICO** | Cero keywords de "crm". Posicionada como "API de WhatsApp" en vez de "CRM con agentes IA" |
| `app/layout.tsx` (raíz) | Disperso | 40+ keywords mezclando chatbot, ERP, diseño, marketing — dilución de señal SEO |
| `/agencia` (`app/agencia/layout.tsx`) | Escaso | Solo 6 keywords, muy poco |
| `/desarrollo-web-pymes` (`app/desarrollo-web-pymes/layout.tsx`) | **Bug** | Keywords como `string`, no como `string[]` — inconsistente con el resto |
| `/ledgerxpertz` | OK | Bien enfocado, no requiere cambios |
| `/pukahealth` | OK | Bien enfocado, no requiere cambios |

### Keywords a agregar en `/agentes-ia/layout.tsx`

Reemplazar o complementar las actuales con foco en CRM:

```typescript
keywords: [
  // Posicionamiento CRM (nuevo — actualmente ausente)
  'crm para whatsapp business',
  'crm con inteligencia artificial',
  'crm con ia para whatsapp',
  'crm barato para pymes',
  'crm whatsapp ecuador',
  // Chatbot con IA (mantener)
  'chatbot whatsapp ecuador',
  'chatbot con inteligencia artificial para whatsapp',
  'automatizar ventas whatsapp',
  // Comparación competidores (capturar tráfico de búsqueda)
  'alternativa mercately',
  'alternativa sellerchat',
  // Marca
  'pukaia',
],
```

### Auditoría SEO técnica — 2026-04-12 (commit 159125b)

Todo resuelto en sesión del 2026-04-12:

- [x] `/agentes-ia/layout.tsx` — reposicionado como CRM con IA: nuevo title, description, 12 keywords CRM, 2 FAQs nuevas con precios en schema
- [x] `/desarrollo-web-pymes/layout.tsx` — keywords corregidas de `string` a `string[]`
- [x] `app/layout.tsx` — keywords reducidas de 40+ a 10 focalizadas
- [x] `/agencia/layout.tsx` — keywords ampliadas de 6 a 14
- [x] `app/sistema-emprendedor/` — ruta eliminada (página muerta)
- [x] `app/sitemap.ts` — rutas 301 removidas del sitemap
- [x] `next.config.ts` — todos los redirects eliminados (decisión: empezar limpio)
- [x] `app/gracias/layout.tsx` — creado con `noindex`

### Auditoría SEO 2026-04-12 — sesión 2 (todo resuelto)

- [x] **`www.` vs no-`www.`** — configurado en Vercel Dashboard: `www.pukadigital.com` redirige a `pukadigital.com`
- [x] **Blog "por-que-me-bloquearon-whatsapp-business"** — Meta Title actualizado a `"Me Bloquearon WhatsApp Business: Cómo Recuperarlo en 2026 (Guía)"` desde pukapresscms.vercel.app
- [x] **Blog "cuanto-cuesta-pagina-web-ecuador"** — ampliado en `data/localPosts.ts`: tabla precios 2026 por tipo de web, FAQ expandida de 5 a 10 preguntas, `metaTitle`/`metaDescription`/`tags` añadidos
- [x] **GSC: re-indexación manual** solicitada para `/agentes-ia` y `/blog/cuanto-cuesta-pagina-web-ecuador`
- [x] **GSC: URLs fantasma eliminadas** — solicitudes de eliminación enviadas para prefijos `/es`, `/en`, `/pt` (bloqueo temporal ~6 meses, sin afectar páginas reales)
- [x] **pukapress-cms `ModernBlogEdit`** — agregados campos `metaTitle` y `metaDescription` en formulario de edición (commit `5992f80`)

### Actualización SEO & Knowledge Graph — 2026-08-30 (Sesión Transición LLC y Redes)

- [x] **Google Analytics 4 ↔ Google Search Console:** Asociación completada entre `Puka Digital (514366233)` y `sc-domain:pukadigital.com`. Desbloquea en **Search Console Insights** las métricas de tráfico y referidos de redes sociales (Instagram, Facebook, TikTok, LinkedIn, YouTube).
- [x] **Schema.org `sameAs` & Entity Recognition:** Actualizado [lib/schema.ts](file:///Users/luisviteri/Proyectos/PukaDigital/lib/schema.ts) agregando perfiles oficiales de Facebook (`facebook.com/pukadigital`), Instagram (`instagram.com/pukadigital`), LinkedIn, YouTube, Clutch.co (`clutch.co/profile/pukadigital`), Crunchbase (`crunchbase.com/organization/puka-digital-llc`) y GitHub en la entidad `Organization`, y perfiles personales y de Crunchbase en `Person (Fundador)`. Esto consolida la autoridad de marca en el Knowledge Graph de Google y motores de IA.
- [x] **Google Business Profile:** Vinculadas las 4 redes sociales oficiales en la ficha de Google Maps / Search (*Puka Digital - Agencia de Marketing y Desarrollo Web*).
- [x] **Verificación de Dominio en Meta:** `<meta name="facebook-domain-verification" content="zb46u0vripnq10zx6svtlcgj2n7k5o" />` desplegado y validado.
- [x] **Clutch.co:** Perfil oficial creado y vinculado en [clutch.co/profile/pukadigital](https://clutch.co/profile/pukadigital) con categorías de Custom Software, AI Development y Web Development. Correo oficial configurado a `luis.viteri@pukadigital.com`.
- [x] **Crunchbase:** Ficha corporativa de `Puka Digital LLC` ([crunchbase.com/organization/puka-digital-llc](https://www.crunchbase.com/organization/puka-digital-llc)) y de fundador ([crunchbase.com/person/luis-omar-viteri-sarango](https://www.crunchbase.com/person/luis-omar-viteri-sarango)) publicadas y verificadas con autoridad DR 91.
- [x] **Bing Places for Business:** Ficha importada y sincronizada automáticamente desde Google Business Profile (sincronización semanal activa) con correo `luis.viteri@pukadigital.com`. Expande la presencia a Bing Search, Bing Maps y Microsoft Copilot.
- [x] **Bing Webmaster Tools:** Sincronización completa desde Google Search Console. 7 propiedades verificadas (`pukadigital.com`, `podoclinicec.com`, `hoteleudiq.com`, `healppypets.com`, `lahuequitaquitena.com`, `pukahealth.com`, `toga-fashion.com`). Sitemap de `pukadigital.com/sitemap.xml` procesado con éxito (44 URLs descubiertas, 0 errores) y re-indexación manual solicitada para acelerar la publicación de Bing Places.
- [x] **GoodFirms.co:** Perfil de empresa creado y configurado en [goodfirms.co/company/pukadigital](https://www.goodfirms.co/company/pukadigital) con distribución 40% Custom Software, 30% AI, 30% Web Development y logo oficial.
- [x] **Trustpilot Business:** Perfil verificado y reclamado (*Claimed Profile*) en [trustpilot.com/review/pukadigital.com](https://www.trustpilot.com/review/pukadigital.com) en categorías de Software Company, Marketing Agency y Web Designer.
- [x] **Sortlist:** Perfil de agencia creado y optimizado (75% Profile Quality Index) en [sortlist.com/agency/pukadigital](https://www.sortlist.com/agency/pukadigital) para captación de clientes de software y desarrollo web en LATAM.
- [x] **Unificación de WhatsApp Oficial:** `app/agentes-ia/page.tsx` y `public/llms.txt` unificados al 100% en la línea principal de la agencia `+593 96 406 5880`. El número secundario fue liberado de la Cloud API de Meta para uso personal privado.
- [x] **Servidores MCP de Asistente IA:** Integración en vivo de `google-calendar` y `gmail` en `~/.gemini/config/mcp_config.json` con tokens permanentes para `luchoviteri1990@gmail.com`.
- [x] **Cumplimiento Legal & Fiscal LLC:** Creado `docs/COMPLIANCE_LLC.md` y agendados recordatorios con alta prioridad (Rojo Tomate) en Google Calendar para el IRS Form 5472 ($25k multa) y Wyoming Annual Report ($60).
- [x] **Control de Navegador Autónomo:** Configurado alias permanente `chrome` con perfil de depuración y probado control total en vivo.

### Tareas SEO pendientes (próxima sesión)

- [ ] **`lib/i18n` + `LanguageProvider`** — refactor de baja prioridad: 73 llamados a `t()` en 4 páginas (`productos`, `demos`, `contacto`, `casos`). No causa daño SEO. El sistema siempre estuvo hardcodeado a español — nunca generó rutas `/es/` ni `/en/`. Bundle impact mínimo (~2KB comprimido).

---


