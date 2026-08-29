// Google Analytics Measurement ID
export const GA_TRACKING_ID = 'G-VSGYR0EJSZ';

// Google Ads Conversion Data (TODO: Replace with your actual values)
// Encuentra esto en Google Ads > Metas > Conversiones > Tu Conversión > Configuración de la etiqueta
export const GOOGLE_ADS_ID = 'AW-17832260485';
export const GOOGLE_ADS_LABEL = '4UcUCNio2d4bEIXnirdC';

// Extend Window interface for gtag and TikTok Pixel
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      identify: (params: Record<string, string>) => void;
    };
  }
}

/**
 * Devuelve el client_id REAL que GA4 asigna al visitante.
 *
 * Vive en la cookie _ga con el formato GA1.1.<client_id>, donde client_id es
 * "1234567890.1234567890". Antes esta función inventaba un id y lo guardaba en
 * localStorage: GA4 no lo reconocía como el visitante real, así que los eventos
 * enviados desde el servidor llegaban huérfanos y caían en (not set), sin
 * sesión ni fuente de tráfico. Con la cookie real, el evento se une a la visita
 * y conserva la atribución a la campaña.
 *
 * Devuelve null si la cookie aún no existe (primer render, o el usuario bloquea
 * cookies). En ese caso no se envía el evento de servidor: es preferible perder
 * un dato a registrar uno sin atribución.
 */
export const getClientId = (): string | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/_ga=GA\d+\.\d+\.(\d+\.\d+)/);
  return match ? match[1] : null;
};

/**
 * Devuelve el session_id de GA4 para esta propiedad.
 *
 * Vive en la cookie _ga_<MEASUREMENT_ID sin el prefijo G->, con formato
 * GS1.1.<session_id>.<numero_de_sesion>... Antes se enviaba Date.now(), lo que
 * hacía que cada evento inventara su propia sesión y ninguno se asociara a la
 * visita real.
 */
export const getSessionId = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookieName = `_ga_${GA_TRACKING_ID.replace('G-', '')}`;
  const match = document.cookie.match(new RegExp(`${cookieName}=GS\\d+\\.\\d+\\.(\\d+)`));
  return match ? match[1] : null;
};

// Log the page view with their URL (client-side)
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events (client-side - for non-critical events)
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Server-side event tracking (for critical conversions)
 * Benefits: Not blocked by ad-blockers, 100% reliable
 */
export const trackServerEvent = async (
  eventName: string,
  eventParams: Record<string, string | number | boolean> = {}
): Promise<boolean> => {
  try {
    const clientId = getClientId();
    const sessionId = getSessionId();

    // Sin las cookies de GA4 el evento llegaría sin atribución y caería en
    // (not set). Es preferible perder el dato a ensuciar los informes.
    if (!clientId) return false;

    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
        sessionId,
        eventName,
        eventParams: {
          page_path: typeof window !== 'undefined' ? window.location.pathname : '',
          page_title: typeof document !== 'undefined' ? document.title : '',
          ...eventParams,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to track server event:', error);
    return false;
  }
};

/**
 * Hybrid tracking: sends to both client-side (gtag) and server-side (API)
 * Use for critical conversion events
 */
/**
 * Registra una conversión UNA sola vez.
 *
 * Antes esta función disparaba el evento por los dos caminos a la vez —gtag en
 * el navegador y Measurement Protocol desde el servidor—, así que cada
 * conversión se contaba dos veces en GA4. Y como el envío de servidor llegaba
 * sin client_id ni session_id válidos, esa segunda copia caía en (not set): sin
 * sesión, sin fuente y sin campaña.
 *
 * Ahora manda el navegador, que es el único camino que sabe atribuir a la
 * campaña que trajo la visita. El envío de servidor queda como respaldo y solo
 * entra si gtag no está disponible, que es el caso que justificaba tenerlo:
 * un bloqueador de anuncios. Así no se duplica y no se pierde cobertura.
 */
export const trackConversion = async (
  eventName: string,
  eventParams: Record<string, string | number | boolean> = {}
) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
    return true;
  }

  // gtag bloqueado: se usa el respaldo de servidor.
  return trackServerEvent(eventName, eventParams);
};

// ============================================
// PRIORITY 1 - CRITICAL CONVERSION EVENTS
// ============================================

/**
 * 1. Solicitar Entrevista Gratuita - MAIN CONVERSION
 * Location: Contact page (big red button)
 */
export const trackSolicitarEntrevista = async (formData: {
  business_name: string;
  user_name: string;
  whatsapp: string;
  growth_blocker: string;
}) => {
  return trackConversion('solicitar_entrevista_gratuita', {
    business_name: formData.business_name,
    user_name: formData.user_name,
    whatsapp: formData.whatsapp,
    growth_blocker: formData.growth_blocker,
    page_source: 'contacto_directo',
    conversion_type: 'form_submission',
  });
};

/**
 * 2. Aplicar a Mi Independencia - Hero CTA
 * Location: Homepage hero section
 */
export const trackAplicarPrograma = async (buttonLocation: string = 'hero_section') => {
  return trackConversion('aplicar_programa_inicio', {
    button_location: buttonLocation,
    click_position: 'above_fold',
    intent: 'program_interest',
  });
};

/**
 * 3. Ver Sistema de Graduación - Secondary CTA
 * Location: Homepage (white bordered button)
 */
export const trackVerSistemaGraduacion = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'ver_sistema_graduacion_click', {
      button_location: 'hero_section',
      engagement_level: 'interested_in_process',
    });
  }
};

// ============================================
// PRIORITY 2 - ENGAGEMENT / LEAD QUALIFICATION
// ============================================

/**
 * 4. Product Module Click
 * Location: Products page (/productos)
 */
export const trackProductoModuloClick = (
  moduloName: 'CMS, Mapas & SEO' | 'ERP Cloud' | 'Chatbot IA',
  moduloNumber: 1 | 2 | 3
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'producto_modulo_click', {
      modulo_name: moduloName,
      modulo_number: moduloNumber,
      user_interest_level: 'exploring_features',
    });
  }
};

/**
 * 5. Case Study View (Server-side for reliability)
 * Location: Cases page (/casos)
 */
export const trackCasoExitoView = async (
  caseName: string,
  clientIndustry: string,
  metricViewed: 'conversions' | 'reviews' | 'revenue_increase' = 'conversions'
) => {
  return trackConversion('caso_exito_view', {
    case_name: caseName,
    client_industry: clientIndustry,
    conversion_metric_viewed: metricViewed,
  });
};

/**
 * 6. Debt Calculator Interaction
 * Location: Homepage (interactive calculator)
 */
export const trackCalculadoraDeuda = (
  monthlySpend: number,
  yearsWithAgency: string,
  finalDebtCalculated: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'calculadora_deuda_interaccion', {
      monthly_spend: monthlySpend,
      years_with_agency: yearsWithAgency,
      final_debt_calculated: finalDebtCalculated,
      comparison_engagement: 'viewed_puka_advantage',
    });
  }
};

/**
 * 7. Blog Article Reading
 * Location: Blog pages (/blog/*)
 */
export const trackBlogArticleLectura = (
  articleTitle: string,
  articleCategory: 'precios' | 'automatizacion' | 'casos_exito' | 'general',
  scrollDepth: 25 | 50 | 75 | 100,
  timeOnPage: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'blog_articulo_lectura', {
      article_title: articleTitle,
      article_category: articleCategory,
      time_on_page: timeOnPage,
      scroll_depth: scrollDepth,
      content_type: 'educational',
    });
  }
};

/**
 * 8. Free Resource Access (Server-side)
 * Location: Blog sidebar
 */
export const trackRecursoGratuitoAcceso = async (
  resourceType: 'precio_guide' | 'chatbot_signals' | 'case_study',
  resourceUrl: string
) => {
  return trackConversion('recurso_gratuito_acceso', {
    resource_type: resourceType,
    resource_url: resourceUrl,
    download_method: 'link_click',
  });
};

/**
 * 9. Demo Page View
 * Location: Demos page (/demos)
 */
export const trackDemoPaginaVista = (
  demoType: 'erp_system' | 'chatbot_whatsapp' | 'cms_editor',
  engagement: 'viewed' | 'scrolled' | 'interactive' = 'viewed'
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'demo_pagina_vista', {
      demo_type: demoType,
      engagement_with_demo: engagement,
      interest_signaled: true,
    });
  }
};

// ============================================
// PRIORITY 3 - NAVIGATION & BEHAVIOR
// ============================================

/**
 * 10. Main Section Navigation
 * Location: Entire site
 */
export const trackSeccionNavega = (
  fromSection: string,
  toSection: 'metodo' | 'programa' | 'casos' | 'blog' | 'demos' | 'nosotros' | 'productos' | 'contacto',
  method: 'menu' | 'cta_button' | 'link' = 'menu'
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'seccion_principal_navega', {
      from_section: fromSection,
      to_section: toSection,
      navigation_method: method,
    });
  }
};

/**
 * 11. Language Change
 * Location: Entire site
 */
export const trackIdiomaCambiado = (
  fromLanguage: 'es' | 'en' | 'pt',
  toLanguage: 'es' | 'en' | 'pt'
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'idioma_cambiado', {
      from_language: fromLanguage,
      to_language: toLanguage,
      page_when_changed: typeof window !== 'undefined' ? window.location.pathname : '',
    });
  }
};

/**
 * Sends a conversion event specifically to Google Ads
 * Requires GOOGLE_ADS_ID and GOOGLE_ADS_LABEL to be set
 */
export const trackGoogleAdsConversion = (conversionId: string, conversionLabel: string) => {
  if (typeof window !== 'undefined' && window.gtag && conversionId.includes('AW-')) {
    window.gtag('event', 'conversion', {
      'send_to': `${conversionId}/${conversionLabel}`
    });
  }
};

// ============================================
// TIKTOK PIXEL EVENTS
// ============================================

export const trackTikTokViewContent = (
  contentId: string,
  contentName: string,
  value: number = 0,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('ViewContent', {
      contents: [{ content_id: contentId, content_type: 'product', content_name: contentName }],
      value,
      currency,
    });
  }
};

export const trackTikTokCompleteRegistration = (
  contentId: string,
  contentName: string,
  value: number = 0,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('CompleteRegistration', {
      contents: [{ content_id: contentId, content_type: 'product', content_name: contentName }],
      value,
      currency,
    });
  }
};

/**
 * 12. WhatsApp Direct Click - HYBRID (Reliable against ad-blockers)
 * Location: Floating button, footer, contact page
 */
export const trackWhatsAppDirectoClick = async (
  buttonLocation: string,
  tiktok?: { contentId: string; contentName: string; value?: number }
) => {
  // Fire Google Ads Conversion (Primary Goal)
  trackGoogleAdsConversion(GOOGLE_ADS_ID, GOOGLE_ADS_LABEL);

  // Fire TikTok CompleteRegistration if content info provided
  if (tiktok) {
    trackTikTokCompleteRegistration(tiktok.contentId, tiktok.contentName, tiktok.value ?? 0);
  }

  confirmWhatsAppOpened(buttonLocation);

  return trackConversion('whatsapp_directo_click', {
    button_location: buttonLocation,
    intent: 'whatsapp_direct',
    from_page: typeof window !== 'undefined' ? window.location.pathname : '',
  });
};

/** Margen para que el navegador entregue el control a WhatsApp. */
const WHATSAPP_OPEN_WINDOW_MS = 8000;

let cancelPendingWhatsAppCheck: (() => void) | null = null;

/**
 * Confirma que WhatsApp se abrió de verdad y emite 'whatsapp_opened'.
 *
 * 'whatsapp_directo_click' cuenta el clic, no el contacto: entran los toques
 * accidentales, los rebotes y quien pulsa y se arrepiente. Si una campaña
 * optimiza hacia esa señal, Smart Bidding aprende a comprar toques de botón
 * baratos, que es lo más fácil de conseguir y lo menos valioso.
 *
 * Cuando el navegador abre WhatsApp —la app o web.whatsapp.com— la pestaña queda
 * en segundo plano y el documento pasa a 'hidden'. Si eso ocurre en los segundos
 * siguientes al clic, el usuario salió de verdad hacia WhatsApp.
 *
 * Sigue sin ser una conversación: nadie fuera de WhatsApp puede saber si llegó a
 * enviar el mensaje. Pero descarta el ruido y es la señal más honesta medible
 * desde el sitio, así que es la que conviene usar como conversión de Google Ads.
 */
const confirmWhatsAppOpened = (buttonLocation: string) => {
  if (typeof document === 'undefined') return;

  // Si el usuario pulsa varias veces sin salir, solo cuenta la última espera.
  // Sin esto quedarían varias escuchas pendientes y una sola salida hacia
  // WhatsApp dispararía una conversión por cada clic previo.
  cancelPendingWhatsAppCheck?.();

  let settled = false;

  const cleanup = () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.clearTimeout(timer);
    if (cancelPendingWhatsAppCheck === cancel) cancelPendingWhatsAppCheck = null;
  };

  const cancel = () => {
    if (settled) return;
    settled = true;
    cleanup();
  };

  const onVisibilityChange = () => {
    if (settled || document.visibilityState !== 'hidden') return;
    settled = true;
    cleanup();

    void trackConversion('whatsapp_opened', {
      button_location: buttonLocation,
      intent: 'whatsapp_direct',
      from_page: typeof window !== 'undefined' ? window.location.pathname : '',
    });
  };

  // Si la pestaña nunca se oculta, el clic no llevó a WhatsApp: se descarta.
  const timer = window.setTimeout(cancel, WHATSAPP_OPEN_WINDOW_MS);

  cancelPendingWhatsAppCheck = cancel;
  document.addEventListener('visibilitychange', onVisibilityChange);
};

/**
 * 13. Case Link Click (from testimonials)
 * Location: Homepage testimonials, cases page
 */
export const trackCasoLinkClick = (
  caseName: string,
  websiteUrl: string,
  locationClicked: 'homepage_testimonial' | 'casos_page'
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'caso_link_click', {
      case_name: caseName,
      website_url: websiteUrl,
      location_clicked: locationClicked,
    });
  }
};

/**
 * 14. Available Slots Viewed (Scarcity)
 * Location: Forms with scarcity indicator
 */
export const trackCuposDisponiblesVisto = (
  cuposTotales: number = 5,
  cuposDisponibles: number = 2
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'cupos_disponibles_visto', {
      cupos_totales: cuposTotales,
      cupos_disponibles: cuposDisponibles,
      urgency_indicator_viewed: true,
    });
  }
};

/**
 * 15. Create with AI Click (blog tool)
 * Location: Blog page
 */
export const trackCrearConIAClick = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'crear_con_ia_click', {
      ai_tool_interest: true,
      page_location: 'blog_header',
    });
  }
};

// ============================================
// PRIORITY 4 - SESSION & TIME METRICS
// ============================================

/**
 * 16. Session Metrics (auto-tracked on unload)
 */
export const trackSessionMetrics = (
  sessionDuration: number,
  pagesVisitedCount: number,
  entryPage: string,
  exitPage: string
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'session_metrics', {
      session_duration: sessionDuration,
      pages_visited_count: pagesVisitedCount,
      entry_page: entryPage,
      exit_page: exitPage,
    });
  }
};

/**
 * 17. User Exit Event
 */
export const trackUserExit = (
  fromPage: string,
  sessionDuration: number,
  engagementScore: 'bajo' | 'medio' | 'alto'
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'user_exit', {
      from_page: fromPage,
      session_duration: sessionDuration,
      engagement_score: engagementScore,
    });
  }
};