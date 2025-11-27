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
 * 
 * Use this for:
 * - Lead form submissions
 * - CTA clicks (Aplicar al Programa, Solicitar Entrevista)
 * - Demo requests
 * - Any conversion you want to track in Google Ads
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

// Pre-defined conversion events for PukaDigital
export const trackLeadFormSubmit = (formData: { name?: string; email?: string; source?: string }) => {
  return trackConversion('lead_form_submit', {
    form_type: 'contact',
    lead_source: formData.source || 'website',
  });
};

export const trackApplyProgram = (programName: string) => {
  return trackConversion('apply_program', {
    program_name: programName,
  });
};

export const trackRequestInterview = (source: string) => {
  return trackConversion('request_interview', {
    source: source,
  });
};

export const trackWhatsAppClick = (source: string) => {
  return trackConversion('click_whatsapp', {
    click_source: source,
  });
};

export const trackDemoRequest = (demoType: string) => {
  return trackConversion('demo_request', {
    demo_type: demoType,
  });
};