'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Zap,
  TrendingUp,
  Smartphone,
  Code,
  CheckCircle,
  ArrowRight,
  Search,
  Palette,
  ShieldCheck,
  AlertCircle,
  BarChart4
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

export default function DesarrolloWebPage() {
  const { t } = useTranslation();
  const [visitasMensuales, setVisitasMensuales] = useState(500);
  const [tasaConversion, setTasaConversion] = useState(2);

  // ROI Cálculo
  const leadsMensuales = Math.round((visitasMensuales * tasaConversion) / 100);
  const ventasEstimadas = Math.round(leadsMensuales * 0.25);
  const ticketPromedio = 50;
  const ingresoMensual = ventasEstimadas * ticketPromedio;
  const roi = ((ingresoMensual - 20) / 20) * 100;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Desarrollo Web Autogestionable para PYMEs",
    "description": "Tu web profesional con Next.js que puedes editar tú mismo. Libertad tecnológica real.",
    "provider": {
      "@type": "Organization",
      "name": "Puka Digital"
    }
  };

  return (
    <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white">
      <SEO
        title="Desarrollo Web Autogestionable | Puka Digital: La Anti-Agencia"
        description="No alquiles tu presencia digital. Construimos webs en Next.js (Netflix, TikTok) que tú mismo puedes editar. Independencia real para PYMEs en Ecuador."
        keywords="diseño web ecuador, paginas web autogestionables, desarrollo web nextjs, puka digital"
        structuredData={structuredData}
      />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-puka-red/5 -skew-x-12 transform origin-right"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-puka-red text-white px-4 py-1.5 rounded-sm mb-8 text-sm font-bold tracking-wider uppercase italic">
              <Zap size={16} fill="white" />
              Independencia Tecnológica Real
            </div>

            <h1 className="font-display font-bold text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tight">
              Deja de Rentar Tu Web.<br />
              <span className="text-puka-red inline-block mt-2 underline decoration-4 underline-offset-8 italic">
                Empieza a Poseerla.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl font-sans">
              Las agencias te cobran por cada cambio. Nosotros te damos el control total. Webs ultra-rápidas en Next.js que tú mismo editas en segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/contacto"
                className="group bg-puka-black dark:bg-white text-white dark:text-puka-black px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-puka-red dark:hover:bg-puka-red dark:hover:text-white transition-all flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(199,23,30,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Solicitar Mi Independencia
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <div className="py-4 px-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-puka-red font-bold">
                  <span className="flex gap-0.5">
                    <span className="w-3 h-3 bg-puka-red rounded-full"></span>
                    <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  </span>
                  <span className="text-sm uppercase tracking-tighter italic">Solo 2 cupos para diciembre</span>
                </div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">
                  TECNOLOGÍA NEXT.JS • SEO AUTOMÁTICO • HOSTING DE ALTA VELOCIDAD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EL VERDADERO PROBLEMA */}
      <section className="py-24 bg-puka-black text-white overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-5xl md:text-6xl mb-8 leading-tight">
                ¿Tu Web es un Activo o <span className="text-puka-red">un Rehén?</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                Si tienes que llamar a tu programador y pagarle para cambiar una foto o un precio, no eres dueño de tu web. Tienes un contrato de arrendamiento digital.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  WordPress es tecnología de hace 20 años: lenta y vulnerable.
                </div>
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  Pagar mensualidades eternas por "mantenimiento" es explotación.
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-sm">
              <h3 className="font-display font-bold text-3xl mb-10 italic">El Estándar Puka Digital</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-puka-red"><Zap size={40} fill="currentColor" /></div>
                  <div className="font-display font-bold text-xl uppercase">Ultra-Rápida</div>
                  <p className="text-sm text-gray-500">Google ama las webs rápidas. Tus clientes también.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-puka-red"><Code size={40} /></div>
                  <div className="font-display font-bold text-xl uppercase">Autónoma</div>
                  <p className="text-sm text-gray-500">Panel visual para editar absolutamente todo.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-puka-red"><Search size={40} /></div>
                  <div className="font-display font-bold text-xl uppercase">SEO Nativo</div>
                  <p className="text-sm text-gray-500">Indexación automática en minutos, no meses.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-puka-red"><Smartphone size={40} /></div>
                  <div className="font-display font-bold text-xl uppercase">Mobile-First</div>
                  <p className="text-sm text-gray-500">Diseñada para el 90% del tráfico en Ecuador.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI SECTION */}
      <section className="py-24 bg-puka-beige text-puka-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-5xl italic decoration-puka-red decoration-8 underline underline-offset-8">
                Tu Web es una Inversión.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 bg-white p-12 rounded-sm shadow-2xl">
              <div className="space-y-10">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-4">Visitas Mensuales Estimadas</label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={visitasMensuales}
                    onChange={(e) => setVisitasMensuales(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                  />
                  <div className="text-2xl font-black mt-2 font-display italic">{visitasMensuales} clics</div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-4">Conversion Rate (%)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={tasaConversion}
                    onChange={(e) => setTasaConversion(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                  />
                  <div className="text-2xl font-black mt-2 font-display italic">{tasaConversion}%</div>
                </div>
              </div>

              <div className="bg-puka-black text-white p-8 rounded-sm text-center relative">
                <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60 italic">Ingresos Mensuales Proyectados</div>
                <div className="text-6xl font-black text-puka-red">${ingresoMensual.toLocaleString()}</div>
                <p className="text-xs mt-4 font-bold uppercase tracking-[0.2em] italic">Dejando de depender de terceros</p>

                <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-black">{leadsMensuales}</div>
                    <div className="text-[10px] font-bold uppercase opacity-50">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black">{ventasEstimadas}</div>
                    <div className="text-[10px] font-bold uppercase opacity-50">Ventas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA BRUTAL */}
      <section className="py-24 bg-white dark:bg-puka-black">
        <div className="container mx-auto px-6">
          <h2 className="font-display font-bold text-5xl md:text-7xl text-center mb-16 italic">La Comparativa <span className="text-puka-red">Incomoda.</span></h2>

          <div className="max-w-5xl mx-auto overflow-hidden border border-gray-200 dark:border-white/10 rounded-sm">
            <table className="w-full text-left">
              <thead className="bg-puka-black text-white font-display uppercase italic text-sm">
                <tr>
                  <th className="p-6">Característica</th>
                  <th className="p-6 text-puka-red">Puka Digital</th>
                  <th className="p-6 opacity-40">Agencia Tradicional</th>
                </tr>
              </thead>
              <tbody className="font-bold divide-y divide-gray-100 dark:divide-white/5">
                <tr className="bg-white dark:bg-puka-black">
                  <td className="p-6">Propiedad del Código</td>
                  <td className="p-6 text-xl">100% TUYO</td>
                  <td className="p-6 text-gray-400">Propiedad de ellos</td>
                </tr>
                <tr className="bg-gray-50/50 dark:bg-white/5">
                  <td className="p-6">Costo Mantenimiento</td>
                  <td className="p-6 text-xl">$0</td>
                  <td className="p-6 text-gray-400">$150 - $300/mes</td>
                </tr>
                <tr className="bg-white dark:bg-puka-black">
                  <td className="p-6">Velocidad (0-100)</td>
                  <td className="p-6 text-puka-red text-xl">95+ (Next.js)</td>
                  <td className="p-6 text-gray-400">40-60 (WordPress)</td>
                </tr>
                <tr className="bg-gray-50/50 dark:bg-white/5">
                  <td className="p-6">Editar un Texto</td>
                  <td className="p-6">Tú solo (5 seg)</td>
                  <td className="p-6 text-gray-400">Ticket + Pago ($$$)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FINAL CTA - THE BIG BOX */}
      <section className="py-32 bg-puka-red text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display font-bold text-6xl md:text-8xl mb-8 tracking-tighter italic uppercase">
            VUELVE A SER <br /> <span className="text-puka-black underline decoration-white decoration-8">EL DUEÑO.</span>
          </h2>
          <p className="text-2xl mb-12 font-bold max-w-2xl mx-auto opacity-90 italic">
            No aceptes menos que una web que trabaje para ti, no que tú trabajes para pagarla.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center max-w-md mx-auto">
            <Link
              href="/contacto"
              className="bg-white text-puka-red px-10 py-6 rounded-sm font-display font-black text-2xl hover:bg-puka-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 uppercase italic"
            >
              LO QUIERO YA
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.4em] opacity-80 font-sans">
            <span>CERO RENTAS</span>
            <span className="w-1.5 h-1.5 bg-puka-black rounded-full"></span>
            <span>CERO ATADURAS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
