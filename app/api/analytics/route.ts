import { NextRequest, NextResponse } from 'next/server';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-VSGYR0EJSZ';
const GA_API_SECRET = process.env.GA_API_SECRET;

interface AnalyticsEvent {
  clientId: string;
  /** session_id real de GA4, leído de la cookie _ga_<ID> en el cliente. */
  sessionId?: string | null;
  eventName: string;
  eventParams?: Record<string, string | number | boolean>;
}

/**
 * Server-side Google Analytics Measurement Protocol API
 * 
 * Benefits:
 * - Not blocked by ad-blockers
 * - 100% reliable conversion tracking
 * - Better for Google Ads attribution
 * - More privacy-compliant
 */
export async function POST(req: NextRequest) {
  // Check if API secret is configured
  if (!GA_API_SECRET) {
    console.warn('GA_API_SECRET not configured. Server-side analytics disabled.');
    return NextResponse.json({ success: false, error: 'Analytics not configured' }, { status: 500 });
  }

  try {
    const { clientId, sessionId, eventName, eventParams = {} }: AnalyticsEvent = await req.json();

    // Validate required fields
    if (!clientId || !eventName) {
      return NextResponse.json(
        { success: false, error: 'clientId and eventName are required' },
        { status: 400 }
      );
    }

    // Build the payload for Measurement Protocol
    const payload = {
      client_id: clientId,
      events: [
        {
          name: eventName,
          params: {
            engagement_time_msec: 100,
            // El session_id debe ser el que GA4 asignó a la visita. Antes se
            // enviaba Date.now(), así que cada evento inventaba su propia sesión
            // y ninguno se unía a la real: por eso caían en (not set).
            ...(sessionId ? { session_id: sessionId } : {}),
            ...eventParams,
          },
        },
      ],
    };

    // Send to Google Analytics Measurement Protocol
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`GA API responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server-side analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

// Debug endpoint to validate events (only in development)
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  return NextResponse.json({
    configured: !!GA_API_SECRET,
    measurementId: GA_MEASUREMENT_ID,
    endpoint: 'POST /api/analytics',
    examplePayload: {
      clientId: 'unique-user-id',
      eventName: 'lead_form_submit',
      eventParams: {
        form_type: 'contact',
        page_path: '/es/contacto',
      },
    },
  });
}
