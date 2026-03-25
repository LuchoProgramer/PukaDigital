// app/ledgerxpertz/page.tsx
'use client';

import React, { useState } from 'react';
import {
  FileText,
  Package,
  Monitor,
  ShoppingCart,
  Building2,
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
  hero_primary: waLink('Hola, me interesa probar LedgerXpertz gratis para mi negocio.'),
  hero_demo: waLink('Hola, quiero ver una demo en vivo de LedgerXpertz.'),
  nav: waLink('Hola, me interesa probar LedgerXpertz gratis para mi negocio.'),
  footer_whatsapp: waLink('Hola, quiero más información sobre LedgerXpertz.'),
  footer_primary: waLink('Hola, me interesa probar LedgerXpertz gratis para mi negocio.'),
};

// ─── Glass Style Tokens ────────────────────────────────────────────────────────

const glass = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
  } as React.CSSProperties,
  hero: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(199,23,30,0.20)',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(199,23,30,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
  } as React.CSSProperties,
  nav: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  } as React.CSSProperties,
  subtle: {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderTop: '1px solid rgba(255,255,255,0.10)',
  } as React.CSSProperties,
  pricingPopular: {
    background: 'rgba(199,23,30,0.10)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(199,23,30,0.35)',
    borderTop: '1px solid rgba(255,100,100,0.25)',
    boxShadow: '0 8px 40px rgba(199,23,30,0.15), inset 0 1px 0 rgba(255,100,100,0.15)',
  } as React.CSSProperties,
};

// ─── Data ──────────────────────────────────────────────────────────────────────

type BillingPeriod = 'mensual' | 'anual';

const PLANS = [
  { name: 'Starter', monthly: 10, annual: 96, annualMonthly: 8, sucursales: 1, popular: false },
  { name: 'Grow',    monthly: 15, annual: 144, annualMonthly: 12, sucursales: 2, popular: true },
  { name: 'Pro',     monthly: 20, annual: 192, annualMonthly: 16, sucursales: 3, popular: false },
];

const PLAN_INCLUDES = ['Facturación SRI', 'POS completo', 'Inventario real-time', 'E-commerce'];

const FEATURES = [
  { icon: FileText,     title: 'Facturación SRI',       desc: 'Facturas, guías y notas de crédito automáticas' },
  { icon: Package,      title: 'Inventario Real-time',  desc: 'Stock actualizado al instante en todos los canales' },
  { icon: Monitor,      title: 'POS Completo',          desc: 'Caja, turnos y múltiples formas de pago' },
  { icon: ShoppingCart, title: 'E-commerce',            desc: 'Tu tienda online sincronizada con tu bodega' },
  { icon: Building2,    title: 'Multi-sucursal',        desc: 'Hasta 3 locales desde un solo dashboard' },
  { icon: BarChart3,    title: 'Reportes 24/7',         desc: 'Ventas, kardex y cierre de caja en tu celular' },
];

const COMPARISON = [
  { feature: 'Facturación SRI',           ledger: true,  otros: true },
  { feature: 'Inventario en tiempo real', ledger: true,  otros: false },
  { feature: 'E-commerce integrado',      ledger: true,  otros: false },
  { feature: 'Sync Delivery (Uber Eats)', ledger: true,  otros: false },
];

const SOCIAL_PROOF = [
  { value: '100%',        label: 'SRI Compliance' },
  { value: 'Real-time',   label: 'Stock en vivo' },
  { value: 'Multi-canal', label: 'Tienda + Web + Delivery' },
  { value: '$0',          label: 'Setup (30 primeros)' },
];

// ─── Schema ────────────────────────────────────────────────────────────────────

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LedgerXpertz',
  url: 'https://pukadigital.com/ledgerxpertz',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  inLanguage: 'es-EC',
  provider: { '@id': 'https://pukadigital.com/#organization' },
  areaServed: { '@type': 'Country', name: 'Ecuador' },
  offers: PLANS.map((p) => ({
    '@type': 'Offer',
    name: p.name,
    price: p.monthly.toFixed(2),
    priceCurrency: 'USD',
    priceSpecification: { '@type': 'UnitPriceSpecification', unitText: 'mes' },
    description: `${p.sucursales} sucursal${p.sucursales > 1 ? 'es' : ''} — Facturación SRI, POS, Inventario, E-commerce`,
  })),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LedgerXpertzPage() {
  const [billing, setBilling] = useState<BillingPeriod>('mensual');

  const handleCTA = (location: string, href: string) => {
    ga.trackWhatsAppDirectoClick(location);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        background: '#080808',
        minHeight: '100vh',
        color: '#fff',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <SEO structuredData={schema} />

      {/* ── Background orbs ── */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(199,23,30,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '450px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(199,23,30,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '100px', right: '60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(199,23,30,0.07) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, ...glass.nav }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="animate-pulse" style={{ width: '8px', height: '8px', background: '#C7171E', borderRadius: '50%', boxShadow: '0 0 12px rgba(199,23,30,1)' }} />
            <span className="font-display" style={{ color: '#fff', fontWeight: 900, fontSize: '14px', letterSpacing: '3px' }}>
              LEDGERXPERTZ
            </span>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.40)', fontSize: '13px', textDecoration: 'none' }}>Features</a>
            <a href="#precios" style={{ color: 'rgba(255,255,255,0.40)', fontSize: '13px', textDecoration: 'none' }}>Precios</a>
            <button
              onClick={() => handleCTA('ledgerxpertz_nav', WA_LINKS.nav)}
              style={{ background: '#C7171E', color: '#fff', border: 'none', borderRadius: '6px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 16px rgba(199,23,30,0.5)' }}
            >
              Empezar gratis
            </button>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '80px' }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px 48px' }}>
          <div style={{ ...glass.hero, borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', marginBottom: '20px', textTransform: 'uppercase' }}>
              POS · INVENTARIO · FACTURACIÓN SRI · E-COMMERCE
            </p>
            <h1 className="font-display" style={{ fontWeight: 900, fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.05, marginBottom: '24px' }}>
              Todo tu negocio.{' '}
              <span style={{ color: '#C7171E', textShadow: '0 0 30px rgba(199,23,30,0.4)', display: 'block' }}>
                Un solo sistema.
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '16px', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 32px' }}>
              Factura al SRI, controla tu stock en tiempo real y vende online. Todo desde $10/mes. Sin contrato. Sin permanencia.
            </p>

            {/* Price badge */}
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '6px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.18)', borderRadius: '14px', padding: '12px 28px', marginBottom: '28px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>desde</span>
              <span className="font-display" style={{ color: '#fff', fontSize: '40px', fontWeight: 900, lineHeight: 1 }}>$10</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>/mes</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                onClick={() => handleCTA('ledgerxpertz_hero_primary', WA_LINKS.hero_primary)}
                style={{ background: '#C7171E', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 28px rgba(199,23,30,0.45), 0 4px 12px rgba(0,0,0,0.3)' }}
              >
                Prueba 30 días gratis
              </button>
              <button
                onClick={() => handleCTA('ledgerxpertz_hero_demo', WA_LINKS.hero_demo)}
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '14px 22px', fontSize: '15px', cursor: 'pointer' }}
              >
                Ver demo en vivo
              </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.20)', fontSize: '12px' }}>
              Sin tarjeta de crédito · Primeros 30 clientes sin costo de instalación
            </p>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR ── */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 40px' }}>
          <div style={{ ...glass.subtle, borderRadius: '14px', padding: '20px 32px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {SOCIAL_PROOF.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.07)' }} />}
                <div style={{ textAlign: 'center' }}>
                  <div className="font-display" style={{ color: '#C7171E', fontSize: '18px', fontWeight: 900, textShadow: '0 0 16px rgba(199,23,30,0.5)' }}>
                    {item.value}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '4px' }}>{item.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', marginBottom: '32px', textTransform: 'uppercase' }}>
            TODO LO QUE INCLUYE
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ ...glass.card, borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Icon size={24} color="#C7171E" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: '13px', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="precios" style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', marginBottom: '24px', textTransform: 'uppercase' }}>
            ELIGE TU PLAN
          </p>

          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ ...glass.subtle, borderRadius: '10px', padding: '4px', display: 'inline-flex', gap: '4px' }}>
              {(['mensual', 'anual'] as BillingPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setBilling(period)}
                  style={{
                    background: billing === period ? '#C7171E' : 'transparent',
                    color: billing === period ? '#fff' : 'rgba(255,255,255,0.45)',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '9px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: billing === period ? '0 0 16px rgba(199,23,30,0.35)' : 'none',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {period === 'anual' ? 'Anual — 2 meses gratis' : 'Mensual'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{
                  position: 'relative',
                  ...(plan.popular ? glass.pricingPopular : glass.card),
                  borderRadius: '16px',
                  padding: '28px 24px',
                }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#C7171E', color: '#fff', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 0 16px rgba(199,23,30,0.5)' }}>
                    M&Aacute;S POPULAR
                  </div>
                )}

                <div style={{ color: plan.popular ? '#C7171E' : 'rgba(255,255,255,0.40)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {plan.name}
                </div>

                {billing === 'mensual' ? (
                  <div style={{ marginBottom: '8px' }}>
                    <span className="font-display" style={{ fontSize: '36px', fontWeight: 900 }}>${plan.monthly}</span>
                    <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '13px' }}>/mes</span>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', fontSize: '18px', marginRight: '8px' }}>${plan.monthly}</span>
                      <span className="font-display" style={{ fontSize: '36px', fontWeight: 900 }}>${plan.annualMonthly}</span>
                      <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '13px' }}>/mes</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '4px' }}>
                      ${plan.annual}/año en total
                    </div>
                  </>
                )}

                <div style={{ height: '1px', background: plan.popular ? 'rgba(199,23,30,0.25)' : 'rgba(255,255,255,0.07)', margin: '16px 0' }} />
                <div style={{ color: 'rgba(255,255,255,0.50)', fontSize: '13px', marginBottom: '12px' }}>
                  {plan.sucursales} sucursal{plan.sucursales > 1 ? 'es' : ''}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {PLAN_INCLUDES.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color="#C7171E" />
                      <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '13px' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleCTA(`ledgerxpertz_pricing_${plan.name.toLowerCase()}`, WA_LINKS.hero_primary)}
                  style={{
                    width: '100%',
                    background: plan.popular ? '#C7171E' : 'transparent',
                    color: '#fff',
                    border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: plan.popular ? '0 0 20px rgba(199,23,30,0.40)' : 'none',
                  }}
                >
                  Empezar gratis
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: '12px', marginTop: '20px' }}>
            Sin permanencia · Cancela cuando quieras · Soporte por WhatsApp
          </p>
        </section>

        {/* ── COMPARISON ── */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ ...glass.subtle, borderRadius: '16px', padding: '32px' }}>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', marginBottom: '24px', textTransform: 'uppercase' }}>
              POR QU&Eacute; LEDGERXPERTZ
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
              <div />
              <div style={{ textAlign: 'center', color: '#C7171E', fontSize: '13px', fontWeight: 700, paddingBottom: '12px' }}>LedgerXpertz</div>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '13px', paddingBottom: '12px' }}>Otros</div>

              {COMPARISON.map(({ feature, ledger, otros }) => (
                <React.Fragment key={feature}>
                  <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: '13px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{feature}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {ledger ? <CheckCircle size={16} color="#4ade80" /> : <XCircle size={16} color="rgba(255,100,100,0.6)" />}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {otros ? <CheckCircle size={16} color="#4ade80" /> : <XCircle size={16} color="rgba(255,100,100,0.6)" />}
                  </div>
                </React.Fragment>
              ))}

              <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: '13px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>Precio mensual</div>
              <div style={{ textAlign: 'center', color: '#C7171E', fontSize: '16px', fontWeight: 900, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>$10</div>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.40)', fontSize: '13px', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>$20–$50</div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 80px' }}>
          <div style={{ ...glass.hero, borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
            <h2 className="font-display" style={{ fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '12px' }}>
              &iquest;Listo para dejar el Excel?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '15px', marginBottom: '32px' }}>
              Primeros 30 clientes sin costo de instalación. Solo $10/mes.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCTA('ledgerxpertz_footer_whatsapp', WA_LINKS.footer_whatsapp)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(37,211,102,0.30)', color: '#4ade80', borderRadius: '8px', padding: '14px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
              >
                <Phone size={16} />
                Escribir por WhatsApp
              </button>
              <button
                onClick={() => handleCTA('ledgerxpertz_footer_primary', WA_LINKS.footer_primary)}
                style={{ background: '#C7171E', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(199,23,30,0.40)' }}
              >
                Empezar gratis hoy
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.20)', fontSize: '12px' }}>
        &copy; {new Date().getFullYear()} LedgerXpertz &mdash; Powered by PukaDigital
      </footer>
    </div>
  );
}
