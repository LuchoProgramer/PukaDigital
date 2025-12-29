// Google Analytics Measurement ID
export const GA_TRACKING_ID = 'G-VSGYR0EJSZ';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

// Generate or retrieve a persistent client ID for server-side tracking
export const getClientId = (): string => {
  if (typeof window === 'undefined') return 'server';

  let clientId = localStorage.getItem('ga_client_id');
  if (!clientId) {
    clientId = `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('ga_client_id', clientId);
  }
  return clientId;
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

    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId,
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
export const trackConversion = async (
  eventName: string,
  eventParams: Record<string, string | number | boolean> = {}
) => {
  // Client-side tracking (may be blocked)
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }

  // Server-side tracking (reliable, not blocked)
  await trackServerEvent(eventName, eventParams);
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
 * 12. WhatsApp Direct Click - HYBRID (Reliable against ad-blockers)
 * Location: Floating button, footer, contact page
 */
export const trackWhatsAppDirectoClick = async (
  buttonLocation: string
) => {
  return trackConversion('whatsapp_directo_click', {
    button_location: buttonLocation,
    intent: 'whatsapp_direct',
    from_page: typeof window !== 'undefined' ? window.location.pathname : '',
  });
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