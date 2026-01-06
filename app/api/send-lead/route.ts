import { NextRequest, NextResponse } from 'next/server';

// For now using Resend - you'll need to add RESEND_API_KEY to .env.local
// Get your free API key at https://resend.com

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'luis.viteri@pukadigital.com';

interface LeadData {
  businessName: string;
  userName: string;
  email: string;
  whatsapp: string;
  growthBlocker: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json();

    // Validate required fields
    if (!data.businessName || !data.userName || !data.whatsapp || !data.email) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Map growth blocker to readable text
    const growthBlockerMap: Record<string, string> = {
      '': 'No seleccionado',
      'no_web': 'No tengo página web',
      'no_clients': 'No consigo clientes online',
      'no_time': 'No tengo tiempo para redes',
      'other': 'Otro problema',
    };

    const growthBlockerText = growthBlockerMap[data.growthBlocker] || data.growthBlocker;
    const timestamp = new Date().toLocaleString('es-EC', {
      timeZone: 'America/Guayaquil',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: #C7171E; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
    .field:last-child { border-bottom: none; margin-bottom: 0; }
    .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .value { font-size: 18px; color: #1a1a1a; font-weight: 600; }
    .whatsapp-btn { display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    .footer { background: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #666; }
    .badge { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔴 NUEVO LEAD</h1>
      <p style="margin: 8px 0 0; opacity: 0.9;">PukaDigital.com</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">📍 Negocio</div>
        <div class="value">${data.businessName}</div>
      </div>
      <div class="field">
        <div class="label">👤 Nombre</div>
        <div class="value">${data.userName}</div>
      </div>
      <div class="field">
        <div class="label">📱 WhatsApp</div>
        <div class="value">${data.whatsapp}</div>
      </div>
      <div class="field">
        <div class="label">📧 Email</div>
        <div class="value">${data.email}</div>
      </div>
      <div class="field">
        <div class="label">🎯 Principal Reto</div>
        <div class="value">${growthBlockerText}</div>
      </div>
      <div class="field">
        <div class="label">📄 Origen</div>
        <div class="value"><span class="badge">${data.source}</span></div>
      </div>
      
      <a href="https://wa.me/${data.whatsapp.replace(/\D/g, '')}" class="whatsapp-btn">
        💬 Responder por WhatsApp
      </a>
    </div>
    <div class="footer">
      Recibido: ${timestamp}<br>
      Este lead fue generado desde pukadigital.com
    </div>
  </div>
</body>
</html>
    `;

    // Send email via Resend
    if (!RESEND_API_KEY) {
      // Fallback: Log to console if no API key (for development)
      console.log('=== NUEVO LEAD ===');
      console.log('Negocio:', data.businessName);
      console.log('Nombre:', data.userName);
      console.log('Email:', data.email);
      console.log('WhatsApp:', data.whatsapp);
      console.log('Reto:', growthBlockerText);
      console.log('Fuente:', data.source);
      console.log('==================');

      return NextResponse.json({
        success: true,
        message: 'Lead registrado (modo desarrollo - sin email)',
        fallback: true
      });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PukaDigital Leads <leads@leads.pukadigital.com>',
        to: TO_EMAIL,
        subject: `🔴 Nuevo Lead: ${data.businessName} - ${data.userName}`,
        html: emailHtml,
        reply_to: data.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend error:', errorData);
      throw new Error('Error al enviar email');
    }

    return NextResponse.json({
      success: true,
      message: 'Lead enviado correctamente'
    });

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Error al procesar el lead' },
      { status: 500 }
    );
  }
}
