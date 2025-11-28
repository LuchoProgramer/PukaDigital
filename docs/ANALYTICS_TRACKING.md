# 📊 Sistema de Analytics - PukaDigital

## Configuración General

### Google Analytics 4
- **Measurement ID:** `G-VSGYR0EJSZ`
- **Tracking:** Híbrido (Client-side + Server-side)
- **Server-side API:** Measurement Protocol v2

### Variables de Entorno Requeridas

```env
# .env.local (desarrollo)
# Vercel Environment Variables (producción)

GA_API_SECRET=ZzwOlwY4RaaqCyDU_5Ys3w
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-VSGYR0EJSZ
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 🎯 Eventos Implementados

### PRIORIDAD 1 - Conversiones Críticas (Server-side + Client)

| Evento | Ubicación | Tipo | Parámetros |
|--------|-----------|------|------------|
| `solicitar_entrevista_gratuita` | LeadForm | Conversión | business_name, user_name, whatsapp, growth_blocker, page_source, conversion_type |
| `aplicar_programa_inicio` | Homepage Hero | CTA | button_location, click_position, intent |
| `caso_exito_view` | /casos | Engagement | case_name, client_industry, conversion_metric_viewed |

### PRIORIDAD 2 - Engagement / Lead Qualification (Client-side)

| Evento | Ubicación | Parámetros |
|--------|-----------|------------|
| `producto_modulo_click` | /productos | modulo_name, modulo_number, user_interest_level |
| `calculadora_deuda_interaccion` | Homepage | monthly_spend, years_with_agency, final_debt_calculated |
| `blog_articulo_lectura` | /blog/[slug] | article_title, article_category, scroll_depth (25/50/75/100%), time_on_page |
| `demo_pagina_vista` | /demos | demo_type, engagement_with_demo, interest_signaled |
| `recurso_gratuito_acceso` | Blog | resource_type, resource_url, download_method |
| `cupos_disponibles_visto` | LeadForm | cupos_totales, cupos_disponibles, urgency_indicator_viewed |

### PRIORIDAD 3 - Navegación y Comportamiento (Client-side)

| Evento | Ubicación | Parámetros |
|--------|-----------|------------|
| `seccion_principal_navega` | Navbar | from_section, to_section, navigation_method |
| `idioma_cambiado` | Navbar | from_language, to_language, page_when_changed |
| `whatsapp_directo_click` | Float/Footer/Contact | button_location, intent, from_page |
| `caso_link_click` | /casos | case_name, website_url, location_clicked |
| `ver_sistema_graduacion_click` | Homepage | button_location, engagement_level |
| `crear_con_ia_click` | Blog | ai_tool_interest, page_location |

---

## 📁 Archivos Clave

### `/lib/analytics.ts`
Contiene todas las funciones de tracking:

```typescript
// Funciones principales
pageview(url)                    // Página vista
event({ action, category, label }) // Evento genérico
trackServerEvent(eventName, params) // Server-side (Measurement Protocol)
trackConversion(eventName, params)  // Híbrido (client + server)

// Funciones específicas
trackSolicitarEntrevista(formData)
trackAplicarPrograma(buttonLocation)
trackVerSistemaGraduacion()
trackProductoModuloClick(moduloName, moduloNumber)
trackCasoExitoView(caseName, industry, metricViewed)
trackCalculadoraDeuda(monthlySpend, years, totalDebt)
trackBlogArticleLectura(title, category, scrollDepth, timeOnPage)
trackRecursoGratuitoAcceso(resourceType, resourceUrl)
trackDemoPaginaVista(demoType, engagement)
trackSeccionNavega(from, to, method)
trackIdiomaCambiado(fromLang, toLang)
trackWhatsAppDirectoClick(buttonLocation)
trackCasoLinkClick(caseName, websiteUrl, location)
trackCuposDisponiblesVisto(total, disponibles)
trackCrearConIAClick()
trackSessionMetrics(duration, pagesCount, entryPage, exitPage)
trackUserExit(fromPage, duration, engagementScore)
```

### `/app/api/analytics/route.ts`
Endpoint para Measurement Protocol (server-side tracking):

```typescript
POST /api/analytics
Body: {
  clientId: string,
  eventName: string,
  eventParams: Record<string, string | number | boolean>
}
```

---

## 🔧 Componentes con Tracking

| Componente | Eventos |
|------------|---------|
| `LeadForm.tsx` | solicitar_entrevista_gratuita, cupos_disponibles_visto |
| `Navbar.tsx` | seccion_principal_navega, idioma_cambiado |
| `FloatingWhatsApp.tsx` | whatsapp_directo_click |
| `ROICalculator.tsx` | calculadora_deuda_interaccion |

| Página | Eventos |
|--------|---------|
| `/[lang]/page.tsx` | aplicar_programa_inicio, ver_sistema_graduacion_click |
| `/[lang]/productos/page.tsx` | producto_modulo_click |
| `/[lang]/casos/page.tsx` | caso_exito_view, caso_link_click |
| `/[lang]/blog/[slug]/page.tsx` | blog_articulo_lectura (scroll tracking) |
| `/[lang]/demos/page.tsx` | demo_pagina_vista |
| `/[lang]/contacto/page.tsx` | whatsapp_directo_click |

---

## 📈 Configuración en Google Analytics

### Eventos de Conversión (marcar en GA4)
1. `solicitar_entrevista_gratuita` ⭐ Principal
2. `aplicar_programa_inicio`
3. `caso_exito_view`
4. `recurso_gratuito_acceso`

### Audiencias Sugeridas
- **Interesados en Programa:** `aplicar_programa_inicio` + scroll > 50%
- **Exploradores de Casos:** `caso_exito_view` ≥ 2
- **Calculadora Engaged:** `calculadora_deuda_interaccion` con debt > $5000
- **Blog Readers:** `blog_articulo_lectura` con scroll_depth = 100%

---

## 🚀 Testing

### Verificar eventos en tiempo real:
1. Abre GA4 → Informes → Tiempo real
2. Navega por el sitio
3. Verifica que aparezcan los eventos

### Debug con consola:
```javascript
// En la consola del navegador
localStorage.setItem('debug_ga', 'true');
// Recarga la página - verás logs de cada evento
```

### Verificar server-side:
```bash
# En Vercel logs o terminal local
# Busca: "Server-side event sent:"
```

---

## 📋 Checklist de Implementación

- [x] GA4 Measurement ID configurado
- [x] Measurement Protocol API secret
- [x] Client-side gtag en layout
- [x] Server-side API route
- [x] Funciones de tracking en analytics.ts
- [x] LeadForm con tracking completo
- [x] Homepage CTAs tracking
- [x] Productos módulos tracking
- [x] Casos de éxito tracking
- [x] Blog scroll depth tracking
- [x] WhatsApp clicks tracking
- [x] Navegación tracking
- [x] Idioma cambio tracking
- [x] Demos page tracking
- [x] ROI Calculator tracking
- [ ] Google Ads conversions linking
- [ ] Enhanced ecommerce (si aplica)
