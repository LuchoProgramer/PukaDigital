# Glassmorphism Light Frosted Glass — `/agencia` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar Light Frosted Glass a `app/agencia/page.tsx` eliminando el header/footer embebidos duplicados y modernizando todas las secciones.

**Architecture:** Un solo archivo modificado. Se elimina el `<header>` embebido (el Navbar global lo reemplaza) y se convierte el `<footer>` en `<section>` CTA oscura. Canvas blanco con orbes pastel. Cards frosted glass. Sin cambios en SEO, analytics ni layout.tsx.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, inline styles para valores glass exactos.

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/agencia/page.tsx` | Reemplazar completo |

---

### Task 1: Reemplazar `app/agencia/page.tsx` completo

**Files:**
- Modify: `app/agencia/page.tsx`

- [ ] **Step 1: Escribir el nuevo `app/agencia/page.tsx`**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Globe, BarChart3, CloudLightning, ShieldCheck, XCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const glass = {
  card: {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.80)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  panel: {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.80)',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  },
  metricsCard: {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.80)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  badge: {
    background: 'rgba(255,255,255,0.70)',
    border: '1px solid rgba(0,0,0,0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.80)',
    border: '2px solid rgba(17,24,39,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
};

export default function AgenciaPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-puka-red/20 selection:text-puka-red" style={{ backgroundColor: '#ffffff', color: '#111827', position: 'relative' }}>

      {/* Orbes de fondo */}
      <div aria-hidden="true" style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(199,23,30,0.06)', filter: 'blur(140px)', borderRadius: '50%', bottom: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: 'fixed', width: '600px', height: '600px', background: 'rgba(30,60,199,0.05)', filter: 'blur(150px)', borderRadius: '50%', top: '-200px', right: '-200px', pointerEvents: 'none', zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: 'fixed', width: '350px', height: '350px', background: 'rgba(120,20,180,0.04)', filter: 'blur(120px)', borderRadius: '50%', top: '40vh', left: '35%', pointerEvents: 'none', zIndex: 0 }} />

      <SEO
        title="Agencia de Marketing Digital & Desarrollo Web | PukaDigital"
        description="Estrategias de alto rendimiento y tecnología propia desde Quito. Desarrollo Web Next.js y Google Ads para empresas que buscan ROI, no likes."
        keywords="agencia marketing digital ecuador, desarrollo web quito, google ads ecuador, nextjs ecuador, seo tecnico"
      />

      {/* HERO SECTION */}
      <section className="pt-20 pb-32 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-16 items-center">

            {/* Copy */}
            <div className="flex-1 space-y-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-800"
                style={glass.badge}
              >
                <Globe size={12} />
                Oficinas Centrales: Quito | Cobertura Nacional
              </div>

              <h1 className="font-display font-bold text-5xl md:text-6xl leading-[1.1]" style={{ color: '#111827' }}>
                Agencia de Marketing Digital y Desarrollo Web en <span className="text-blue-700">Ecuador</span>.
              </h1>

              <h2 className="text-xl leading-relaxed max-w-2xl" style={{ color: '#4B5563' }}>
                Estrategias de alto rendimiento y tecnolog&iacute;a propia desde Quito para todo el pa&iacute;s. Construimos activos digitales que son <strong style={{ color: '#111827' }}>100% tuyos</strong>, sin rentas mensuales ni &ldquo;impuestos al &eacute;xito&rdquo;.
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://wa.me/593964065880?text=Hola,%20quisiera%20agendar%20una%20consultor%C3%ADa%20t%C3%A9cnica."
                  className="bg-puka-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-puka-red/25 hover:shadow-puka-red/40 hover:-translate-y-1 text-center"
                >
                  Solicitar Consultor&iacute;a T&eacute;cnica
                </a>
                <a
                  href="#casos"
                  className="px-8 py-4 rounded-lg font-bold text-lg transition-all text-center flex items-center justify-center gap-2 group hover:bg-gray-50"
                  style={{ ...glass.btnSecondary, color: '#111827' }}
                >
                  Ver Casos de ROI <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Tarjeta de métricas — frosted glass */}
            <div className="flex-1 relative hidden md:block">
              <div className="relative z-10 p-8 transform rotate-1" style={glass.metricsCard}>
                <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-auto text-xs font-mono" style={{ color: '#9CA3AF' }}>deployment_status: success</div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between items-center" style={{ color: '#6B7280' }}>
                    <span>Performance Score</span>
                    <span className="text-green-600 font-bold">98/100</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div className="bg-green-500 h-full w-[98%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center mt-4" style={{ color: '#6B7280' }}>
                    <span>Conversion Rate</span>
                    <span className="text-blue-600 font-bold">+15.4%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div className="bg-blue-600 h-full w-[65%] rounded-full"></div>
                  </div>
                  <div className="p-4 rounded-xl mt-6" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#4B5563' }}>
                    <code>
                      <span className="text-blue-600">const</span> <span className="text-purple-600">assetOwnership</span> = <span className="text-green-600">true</span>;<br />
                      <span className="text-blue-600">const</span> <span className="text-purple-600">monthlyRent</span> = <span className="text-red-500">0</span>;
                    </code>
                  </div>
                </div>
              </div>
              {/* Blobs decorativos */}
              <div className="absolute top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10" style={{ background: 'rgba(199,23,30,0.10)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ANTI-SERVICIO */}
      <section className="py-24 relative" style={{ zIndex: 1, background: 'rgba(199,23,30,0.02)' }}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-puka-red font-bold tracking-widest uppercase text-sm mb-4 block">Filtro de Calidad</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8" style={{ color: '#111827' }}>
            Lo que <span className="text-puka-red underline decoration-4 decoration-puka-red/20">NO</span> hacemos
          </h2>

          <div className="p-8 md:p-12" style={glass.panel}>
            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: '#4B5563' }}>
              &ldquo;No gestionamos redes sociales para &lsquo;likes&rsquo;. No hacemos posts de relleno. Nos enfocamos exclusivamente en <strong style={{ color: '#111827' }}>Infraestructura</strong> (Webs r&aacute;pidas) y <strong style={{ color: '#111827' }}>Adquisici&oacute;n</strong> (Google Ads/SEO) para generar ventas.&rdquo;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3 line-through decoration-gray-300" style={{ color: '#9CA3AF' }}>
                <XCircle className="text-red-300 flex-shrink-0" /> Community Management Gen&eacute;rico
              </div>
              <div className="flex items-center gap-3 line-through decoration-gray-300" style={{ color: '#9CA3AF' }}>
                <XCircle className="text-red-300 flex-shrink-0" /> Dise&ntilde;os &ldquo;bonitos&rdquo; sin conversi&oacute;n
              </div>
              <div className="flex items-center gap-3 line-through decoration-gray-300" style={{ color: '#9CA3AF' }}>
                <XCircle className="text-red-300 flex-shrink-0" /> Contratos de permanencia forzosa
              </div>
              <div className="flex items-center gap-3 line-through decoration-gray-300" style={{ color: '#9CA3AF' }}>
                <XCircle className="text-red-300 flex-shrink-0" /> M&eacute;tricas de vanidad (Likes/Shares)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID DE SERVICIOS */}
      <section className="py-24 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl mb-4" style={{ color: '#111827' }}>Arquitectura de Alto Rendimiento</h2>
            <p className="max-w-2xl mx-auto" style={{ color: '#6B7280' }}>Nuestros 3 pilares para empresas que facturan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 — Web */}
            <div className="group p-8 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-300" style={glass.card}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors" style={{ background: 'rgba(0,0,0,0.04)' }}>
                <CloudLightning className="group-hover:text-white transition-colors" size={28} style={{ color: '#374151' }} />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#111827' }}>Web High-Performance</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
                Desarrollo a medida en <strong style={{ color: '#111827' }}>Next.js</strong> (la tecnolog&iacute;a de React). Velocidad de carga inferior a 2s. Propiedad absoluta del c&oacute;digo fuente.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0" /> Hosting Vercel/AWS
                </li>
                <li className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0" /> Sin mensualidades
                </li>
              </ul>
            </div>

            {/* Card 2 — Google Ads */}
            <div className="group p-8 hover:border-red-200 hover:bg-red-50/30 transition-all duration-300" style={glass.card}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-puka-red transition-colors" style={{ background: 'rgba(0,0,0,0.04)' }}>
                <BarChart3 className="group-hover:text-white transition-colors" size={28} style={{ color: '#374151' }} />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#111827' }}>Google Ads &amp; Tr&aacute;fico</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
                Campa&ntilde;as de <strong style={{ color: '#111827' }}>intenci&oacute;n de compra (Search)</strong>, no de interrupci&oacute;n. Atrapamos a clientes que ya est&aacute;n buscando lo que ofreces.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} className="text-puka-red flex-shrink-0" /> Configuraci&oacute;n de Conversiones
                </li>
                <li className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} className="text-puka-red flex-shrink-0" /> Auditor&iacute;a de Quality Score
                </li>
              </ul>
            </div>

            {/* Card 3 — SEO */}
            <div className="group p-8 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300" style={glass.card}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors" style={{ background: 'rgba(0,0,0,0.04)' }}>
                <ShieldCheck className="group-hover:text-white transition-colors" size={28} style={{ color: '#374151' }} />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#111827' }}>SEO &amp; GEO (IA Ready)</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
                Posicionamiento en Google tradicional y optimizaci&oacute;n para los nuevos <strong style={{ color: '#111827' }}>Motores de Respuesta IA</strong> (ChatGPT, Perplexity, Gemini).
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> Optimizaci&oacute;n Sem&aacute;ntica
                </li>
                <li className="flex items-center gap-2 text-xs font-medium" style={{ color: '#6B7280' }}>
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> Fichas de Google Maps
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION (ex-footer) — oscuro como acento */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#111827', zIndex: 1 }}>
        {/* Orbes rojos de fondo */}
        <div aria-hidden="true" style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(199,23,30,0.15)', filter: 'blur(100px)', borderRadius: '50%', bottom: '-100px', left: '-100px', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(199,23,30,0.10)', filter: 'blur(80px)', borderRadius: '50%', top: '-80px', right: '-80px', pointerEvents: 'none' }} />

        <div className="container mx-auto px-6 text-center relative z-10">
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-4" style={{ color: 'white' }}>
            &iquest;Listo para escalar la infraestructura de tu empresa?
          </h3>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Agenda una sesi&oacute;n t&eacute;cnica de 15 minutos con el equipo Senior.
          </p>
          <a
            href="https://wa.me/593964065880"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Hablar con un Ingeniero
          </a>
          <div className="mt-12 text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
            &copy; {new Date().getFullYear()} PukaDigital High-Performance Agency. Quito, Ecuador.
          </div>
        </div>
      </section>

    </div>
  );
}
```

- [ ] **Step 2: Verificar en dev**

```bash
npm run dev
```

Ir a http://localhost:3000/agencia y verificar:
- [ ] Solo un header — el Navbar global frosted glass (sin header embebido)
- [ ] Hero: badge frosted, h1 oscuro con "Ecuador" azul, tarjeta métricas glass
- [ ] Anti-Servicio: panel frosted glass sobre fondo sutilmente rosado
- [ ] 3 cards frosted glass: hover azul/rojo/verde funciona
- [ ] Sección CTA oscura `#111827` con orbes rojos al final
- [ ] Global Footer aparece después de la sección CTA

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Esperado: sin errores en `app/agencia/page.tsx`.

- [ ] **Step 4: Commit**

```bash
git add app/agencia/page.tsx
git commit -m "feat(agencia): light frosted glass — elimina header/footer duplicados"
```
