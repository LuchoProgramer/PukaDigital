// app/pukahealth/page.tsx
'use client';

import React from 'react';
import {
  FileText,
  Receipt,
  Stethoscope,
  Cloud,
  ShieldCheck,
  BarChart3,
  Phone,
  Check,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '593964065880';

const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const WA_LINKS = {
  hero_primary:      waLink('Hola, me interesa probar PukaHealth gratis para mi consultorio.'),
  hero_demo:         waLink('Hola, quiero ver una demo en vivo de PukaHealth.'),
  nav:               waLink('Hola, me interesa probar PukaHealth gratis para mi consultorio.'),
  footer_whatsapp:   waLink('Hola, quiero más información sobre PukaHealth.'),
  footer_primary:    waLink('Hola, me interesa probar PukaHealth gratis para mi consultorio.'),
  pricing_individual: waLink('Hola, me interesa el plan Individual de PukaHealth.'),
  pricing_anual:     waLink('Hola, me interesa el plan Anual de PukaHealth.'),
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: FileText,    title: 'Historias Clínicas',   desc: 'Expediente digital completo, adaptable a tu especialidad' },
  { icon: Receipt,     title: 'Facturación SRI',       desc: 'Facturas electrónicas válidas al SRI con un clic' },
  { icon: Stethoscope, title: 'Multi-especialidad',    desc: 'Campos personalizados por especialidad (JSON adaptable)' },
  { icon: Cloud,       title: '100% en la nube',       desc: 'Accede desde computadora, tablet o celular sin instalaciones' },
  { icon: ShieldCheck, title: 'Cumplimiento MSP',      desc: 'Formularios según normativa del Ministerio de Salud Ecuador' },
  { icon: BarChart3,   title: 'Reportes',              desc: 'Estadísticas de consultas, diagnósticos frecuentes y facturación' },
];

const SOCIAL_PROOF = [
  { value: '100%',            label: 'SRI Compliance' },
  { value: 'En la nube',      label: 'Sin instalación' },
  { value: 'Multi-especialidad', label: 'Campos adaptables' },
  { value: '$0',              label: 'Setup (10 primeros)' },
];

const PLAN_INCLUDES = [
  'Historias clínicas ilimitadas',
  'Facturación SRI',
  'Multi-especialidad',
  'Soporte WhatsApp',
  'Actualizaciones incluidas',
];

const COMPARISON = [
  { feature: 'Historias clínicas',              pukahealth: true,  orpheus: true,  excel: false },
  { feature: 'Facturación SRI integrada',       pukahealth: true,  orpheus: true,  excel: false },
  { feature: 'Multi-especialidad (campos flex)', pukahealth: true,  orpheus: false, excel: false },
  { feature: '100% en la nube',                 pukahealth: true,  orpheus: true,  excel: false },
];

const COMPARISON_PRICES = {
  pukahealth: '$50',
  orpheus:    '~$60–$80',
  excel:      '$0 (pero horas perdidas)',
};

const FAQS = [
  {
    q: '¿Cuánto cuesta PukaHealth?',
    a: 'PukaHealth cuesta $50 por médico al mes. También hay un plan anual por $480 al año (equivalente a $40/mes, 2 meses gratis). Los primeros 10 médicos no pagan costo de instalación. Ofrecemos 30 días de prueba gratuita sin tarjeta de crédito.',
  },
  {
    q: '¿PukaHealth emite facturas al SRI de Ecuador?',
    a: 'Sí. PukaHealth genera facturas electrónicas válidas directamente al SRI con un solo clic, desde la misma plataforma donde registras las consultas. No necesitas ningún sistema adicional.',
  },
  {
    q: '¿Funciona para cualquier especialidad médica?',
    a: 'Sí. PukaHealth usa campos JSON adaptables que se configuran por especialidad: podología, medicina general, pediatría, ginecología, y más. Puedes personalizar el expediente clínico según tu práctica.',
  },
  {
    q: '¿Necesito instalar algo?',
    a: 'No. PukaHealth es 100% en la nube. Accedes desde cualquier navegador web en tu computadora, tablet o celular. Sin instalaciones, sin actualizaciones manuales.',
  },
  {
    q: '¿Tiene período de prueba gratuito?',
    a: 'Sí, 30 días de prueba completamente gratis. No se requiere tarjeta de crédito ni pago por adelantado.',
  },
  {
    q: '¿Qué diferencia hay entre PukaHealth y Orpheus?',
    a: 'PukaHealth ofrece campos clínicos completamente flexibles por especialidad (Orpheus tiene formularios fijos), y su precio es menor ($50/mes vs $60–$80/mes de Orpheus). Además incluye soporte directo por WhatsApp.',
  },
  {
    q: '¿Qué pasa con mis datos si cancelo?',
    a: 'Tus datos son tuyos. Antes de cancelar puedes exportar todos los expedientes clínicos en formato estándar. No eliminamos tus datos de inmediato — tienes un período de gracia para realizar la exportación.',
  },
  {
    q: '¿Cumple con las normativas del Ministerio de Salud (MSP)?',
    a: 'Sí. PukaHealth incluye los formularios clínicos según la normativa del Ministerio de Salud Pública del Ecuador (MSP), incluyendo la historia clínica única.',
  },
];

// ─── Schema ────────────────────────────────────────────────────────────────────

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PukaHealth',
    url: 'https://pukadigital.com/pukahealth',
    applicationCategory: 'MedicalApplication',
    operatingSystem: 'Web, iOS, Android',
    inLanguage: 'es-EC',
    provider: { '@id': 'https://pukadigital.com/#organization' },
    areaServed: { '@type': 'Country', name: 'Ecuador' },
    offers: [
      {
        '@type': 'Offer',
        name: 'Individual',
        price: '50.00',
        priceCurrency: 'USD',
        priceSpecification: { '@type': 'UnitPriceSpecification', unitText: 'mes' },
        description: '1 médico — Historias clínicas, Facturación SRI, Multi-especialidad',
      },
      {
        '@type': 'Offer',
        name: 'Anual',
        price: '480.00',
        priceCurrency: 'USD',
        priceSpecification: { '@type': 'UnitPriceSpecification', unitText: 'año' },
        description: '1 médico — Todo incluido, 2 meses gratis',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PukaHealthPage() {
  const handleCTA = (location: string, url: string) => {
    ga.trackWhatsAppDirectoClick(location);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <SEO structuredData={schema} />

      {/* ── 1. NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        padding: '0 24px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#0ea5e9',
            boxShadow: '0 0 8px rgba(14,165,233,1)',
            display: 'inline-block',
          }} />
          <span style={{ fontWeight: 900, letterSpacing: '2px', fontSize: '18px' }}>
            <span style={{ color: '#0f172a' }}>PUKA</span>
            <span style={{ color: '#0ea5e9' }}>HEALTH</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#funciones" className="hidden sm:block"
            style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
            Funciones
          </a>
          <a href="#precios" className="hidden sm:block"
            style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
            Precios
          </a>
          <button
            onClick={() => handleCTA('pukahealth_nav', WA_LINKS.nav)}
            style={{
              background: '#0ea5e9', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '10px 20px',
              fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
            Probar gratis
          </button>
        </div>
      </nav>

      {/* ── 2. HERO ───────────────────────────────────────────────────── */}
      <section id="hero" style={{
        paddingTop: '96px', paddingBottom: '64px',
        padding: '96px 24px 64px',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px', alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: '20px', padding: '4px 14px',
              fontSize: '11px', color: '#1d4ed8', fontWeight: 700,
              letterSpacing: '1px', marginBottom: '20px',
            }}>
              HISTORIAS CL&Iacute;NICAS &middot; FACTURACI&Oacute;N SRI &middot; ECUADOR
            </div>
            <h1 className="font-display font-bold" style={{ lineHeight: 1.1, marginBottom: '16px' }}>
              <span style={{ display: 'block', color: '#0f172a', fontSize: 'clamp(36px, 5vw, 58px)' }}>
                Tu consultorio.
              </span>
              <span style={{ display: 'block', color: '#0ea5e9', fontSize: 'clamp(36px, 5vw, 58px)' }}>
                Sin papeles.
              </span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px' }}>
              Historias cl&iacute;nicas electr&oacute;nicas y facturaci&oacute;n SRI en un solo sistema.
              Accede desde cualquier dispositivo. Desde $50/mes. Sin contrato.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                onClick={() => handleCTA('pukahealth_hero_primary', WA_LINKS.hero_primary)}
                style={{
                  background: '#0ea5e9', color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '14px 28px',
                  fontWeight: 700, fontSize: '16px', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(14,165,233,0.25)',
                }}>
                Probar 30 d&iacute;as gratis
              </button>
              <button
                onClick={() => handleCTA('pukahealth_hero_demo', WA_LINKS.hero_demo)}
                style={{
                  background: '#fff', color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px', padding: '14px 28px',
                  fontWeight: 600, fontSize: '16px', cursor: 'pointer',
                }}>
                Ver demo en vivo
              </button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              Sin tarjeta de cr&eacute;dito &middot; Primeros 10 m&eacute;dicos sin costo de instalaci&oacute;n
            </p>
          </div>

          {/* Testimonial card */}
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <p style={{
              color: '#0f172a', fontSize: '16px', lineHeight: 1.7,
              fontStyle: 'italic', marginBottom: '16px',
            }}>
              &ldquo;Pas&eacute; de llevar todo en papel a tener el historial completo de mis
              pacientes en segundos. La facturaci&oacute;n al SRI me ahorra 2 horas al d&iacute;a.&rdquo;
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
              &mdash; Dra. Cristina Mu&ntilde;oz, Podoclinic
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px', marginTop: '24px',
            }}>
              {[
                { value: '100%', label: 'SRI v\u00e1lido' },
                { value: '$0', label: 'Setup' },
                { value: '30 d\u00edas', label: 'gratis' },
              ].map(({ value, label }) => (
                <div key={value} style={{
                  textAlign: 'center', background: '#f8fafc',
                  borderRadius: '8px', padding: '12px',
                }}>
                  <div style={{ color: '#0ea5e9', fontWeight: 900, fontSize: '20px' }}>{value}</div>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SOCIAL PROOF BAR ───────────────────────────────────────── */}
      <section style={{
        background: '#f0f9ff',
        borderTop: '1px solid #bae6fd',
        borderBottom: '1px solid #bae6fd',
        padding: '24px',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-around',
          flexWrap: 'wrap', gap: '16px',
        }}>
          {SOCIAL_PROOF.map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '22px' }}>{value}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FEATURES ──────────────────────────────────────────────── */}
      <section id="funciones" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center', color: '#94a3b8',
            letterSpacing: '3px', fontSize: '12px',
            fontWeight: 700, marginBottom: '12px',
          }}>TODO LO QUE INCLUYE</p>
          <h2 className="font-display font-bold" style={{
            textAlign: 'center', color: '#0f172a',
            fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '48px',
          }}>
            Todo lo que necesita tu consultorio
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderTop: '3px solid #0ea5e9',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <Icon size={22} color="#0ea5e9" style={{ marginBottom: '12px' }} />
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                  {title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRICING ───────────────────────────────────────────────── */}
      <section id="precios" style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center', color: '#94a3b8',
            letterSpacing: '3px', fontSize: '12px',
            fontWeight: 700, marginBottom: '12px',
          }}>ELIGE TU PLAN</p>
          <h2 className="font-display font-bold" style={{
            textAlign: 'center', color: '#0f172a',
            fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '48px',
          }}>
            Un precio simple, todo incluido
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {/* Individual — highlighted */}
            <div style={{
              background: '#fff',
              border: '2px solid #0ea5e9',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 8px 32px rgba(14,165,233,0.15)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '-14px', left: '50%',
                transform: 'translateX(-50%)',
                background: '#0ea5e9', color: '#fff',
                borderRadius: '20px', padding: '4px 16px',
                fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                whiteSpace: 'nowrap',
              }}>
                M&Aacute;S POPULAR
              </div>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
                Individual
              </h3>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '40px' }}>$50</span>
                <span style={{ color: '#64748b', fontSize: '16px' }}>/mes</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                1 m&eacute;dico &middot; Todo incluido
              </p>
              {PLAN_INCLUDES.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Check size={16} color="#0ea5e9" />
                  <span style={{ color: '#475569', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
              <button
                onClick={() => handleCTA('pukahealth_pricing_individual', WA_LINKS.pricing_individual)}
                style={{
                  width: '100%', marginTop: '24px',
                  background: '#0ea5e9', color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '14px',
                  fontWeight: 700, fontSize: '16px', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(14,165,233,0.25)',
                }}>
                Empezar ahora
              </button>
            </div>

            {/* Anual */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
                Anual
              </h3>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: '#0f172a', fontWeight: 900, fontSize: '40px' }}>$480</span>
                <span style={{ color: '#64748b', fontSize: '16px' }}>/a&ntilde;o</span>
              </div>
              <p style={{ color: '#0ea5e9', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                Equivale a $40/mes &mdash; 2 meses gratis
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                1 m&eacute;dico &middot; Todo incluido
              </p>
              {PLAN_INCLUDES.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Check size={16} color="#0ea5e9" />
                  <span style={{ color: '#475569', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
              <button
                onClick={() => handleCTA('pukahealth_pricing_anual', WA_LINKS.pricing_anual)}
                style={{
                  width: '100%', marginTop: '24px',
                  background: '#fff', color: '#0ea5e9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px', padding: '14px',
                  fontWeight: 700, fontSize: '16px', cursor: 'pointer',
                }}>
                Elegir plan anual
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginTop: '24px' }}>
            Sin permanencia &middot; Cancela cuando quieras &middot; Soporte directo por WhatsApp
          </p>
        </div>
      </section>

      {/* ── 6. COMPARISON TABLE ──────────────────────────────────────── */}
      <section id="comparativa" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="font-display font-bold" style={{
            textAlign: 'center', color: '#0f172a',
            fontSize: 'clamp(22px, 3vw, 32px)', marginBottom: '48px',
          }}>
            &iquest;Por qu&eacute; PukaHealth?
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '8px', marginBottom: '8px', padding: '0 8px',
          }}>
            <div />
            <div style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 700, fontSize: '14px' }}>PukaHealth</div>
            <div style={{ textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>Orpheus</div>
            <div style={{ textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>Excel</div>
          </div>
          {COMPARISON.map(({ feature, pukahealth, orpheus, excel }, i) => (
            <div key={feature} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '8px', padding: '14px 8px',
              background: i % 2 === 0 ? '#f8fafc' : '#fff',
              borderRadius: '8px',
            }}>
              <div style={{ color: '#475569', fontSize: '14px' }}>{feature}</div>
              <div style={{ textAlign: 'center' }}>
                {pukahealth ? <CheckCircle size={18} color="#22c55e" /> : <XCircle size={18} color="#ef4444" />}
              </div>
              <div style={{ textAlign: 'center' }}>
                {orpheus ? <CheckCircle size={18} color="#22c55e" /> : <XCircle size={18} color="#ef4444" />}
              </div>
              <div style={{ textAlign: 'center' }}>
                {excel ? <CheckCircle size={18} color="#22c55e" /> : <XCircle size={18} color="#ef4444" />}
              </div>
            </div>
          ))}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '8px', padding: '14px 8px',
            background: '#f8fafc', borderRadius: '8px',
          }}>
            <div style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>Precio mensual</div>
            <div style={{ textAlign: 'center', color: '#0ea5e9', fontWeight: 700, fontSize: '15px' }}>{COMPARISON_PRICES.pukahealth}</div>
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>{COMPARISON_PRICES.orpheus}</div>
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px' }}>{COMPARISON_PRICES.excel}</div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center', color: '#94a3b8',
            letterSpacing: '3px', fontSize: '12px',
            fontWeight: 700, marginBottom: '12px',
          }}>PREGUNTAS FRECUENTES</p>
          <h2 className="font-display font-bold" style={{
            textAlign: 'center', color: '#0f172a',
            fontSize: 'clamp(22px, 3vw, 32px)', marginBottom: '48px',
          }}>
            Todo lo que necesitas saber
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {FAQS.map(({ q, a }) => (
              <div key={q} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
                  {q}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA FINAL ──────────────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 className="font-display font-bold" style={{
            color: '#fff', fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '16px',
          }}>
            &iquest;Listo para digitalizar tu consultorio?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', marginBottom: '36px' }}>
            Primeros 10 m&eacute;dicos sin costo de instalaci&oacute;n. Solo $50/mes.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCTA('pukahealth_footer_whatsapp', WA_LINKS.footer_whatsapp)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(37,211,102,0.15)',
                border: '1px solid rgba(37,211,102,0.30)',
                color: '#4ade80',
                borderRadius: '10px', padding: '14px 28px',
                fontWeight: 700, fontSize: '16px', cursor: 'pointer',
              }}>
              <Phone size={18} />
              Hablar por WhatsApp
            </button>
            <button
              onClick={() => handleCTA('pukahealth_footer_primary', WA_LINKS.footer_primary)}
              style={{
                background: '#0ea5e9', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '14px 28px',
                fontWeight: 700, fontSize: '16px', cursor: 'pointer',
                boxShadow: '0 0 20px rgba(14,165,233,0.25)',
              }}>
              Empezar gratis hoy
            </button>
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────── */}
      <footer style={{
        background: '#0f172a',
        padding: '24px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
          &copy; {new Date().getFullYear()} PukaDigital. Todos los derechos reservados.
        </p>
        <a href="/" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
          &larr; Volver a pukadigital.com
        </a>
      </footer>
    </div>
  );
}
