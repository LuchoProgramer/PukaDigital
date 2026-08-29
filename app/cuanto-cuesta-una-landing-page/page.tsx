'use client';

import React from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  ArrowRight,
  Clock,
  Gauge,
  LineChart,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import * as ga from '@/lib/analytics';
import { FAQS } from './data';

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '593964065880';

type Provider = {
  who: string;
  range: string;
  weeks: string;
  best: string;
  risk: string;
  featured?: boolean;
};

const PROVIDERS: Provider[] = [
  {
    who: 'Freelancer',
    range: '$350 — $700',
    weeks: '2 — 4 semanas',
    best: 'Presupuesto ajustado y un solo objetivo claro',
    risk: 'Si desaparece, te quedas sin quien mantenga la página',
  },
  {
    who: 'Agencia tradicional',
    range: '$600 — $1.500',
    weeks: '4 — 8 semanas',
    best: 'Empresas con presupuesto y necesidad de marca',
    risk: 'Suele venir atado a una iguala mensual de mantenimiento',
  },
  {
    who: 'PukaDigital',
    range: 'desde $490 + IVA',
    weeks: '1 — 2 semanas',
    best: 'Pymes que van a enviar tráfico pago desde el primer día',
    risk: 'No hacemos proyectos de marca corporativa desde cero',
    featured: true,
  },
  {
    who: 'Plantilla (Wix, Squarespace)',
    range: '$0 — $200 + suscripción',
    weeks: 'Días',
    best: 'Validar una idea antes de invertir',
    risk: 'Carga lenta y poco control sobre SEO y medición',
  },
];

type IncludeRow = {
  item: string;
  cheap: boolean;
  agency: boolean;
  puka: boolean;
};

const INCLUDES: IncludeRow[] = [
  { item: 'Diseño a medida (no plantilla)', cheap: false, agency: true, puka: true },
  { item: 'Textos escritos para vender', cheap: false, agency: true, puka: true },
  { item: 'Versión móvil optimizada', cheap: true, agency: true, puka: true },
  { item: 'Formulario conectado a WhatsApp', cheap: true, agency: true, puka: true },
  { item: 'Google Analytics 4 configurado', cheap: false, agency: true, puka: true },
  { item: 'Conversiones medibles en Google Ads', cheap: false, agency: false, puka: true },
  { item: 'Velocidad de carga bajo 2 segundos', cheap: false, agency: false, puka: true },
  { item: 'Schema y SEO técnico', cheap: false, agency: false, puka: true },
  { item: 'Sin iguala mensual obligatoria', cheap: true, agency: false, puka: true },
];

const FACTORS = [
  {
    icon: Wrench,
    title: 'Cuántas secciones tiene',
    body: 'Una landing de una sola oferta cuesta menos que una con cuatro planes, comparativas y calculadora. Cada bloque interactivo suma horas.',
  },
  {
    icon: LineChart,
    title: 'Si hay que medir conversiones',
    body: 'Configurar GA4, eventos y conversiones importadas a Google Ads es trabajo aparte del diseño. Es también la diferencia entre invertir en anuncios a ciegas o con datos.',
  },
  {
    icon: Gauge,
    title: 'Quién escribe los textos',
    body: 'Si entregas el contenido listo, bajas el precio. Si hay que investigar tu mercado y redactar la propuesta de valor, sube.',
  },
  {
    icon: Clock,
    title: 'Qué tan rápido la necesitas',
    body: 'Una entrega en menos de una semana suele tener recargo. Planificar con dos semanas de margen es la forma más simple de no pagar de más.',
  },
];


// ─── Component ────────────────────────────────────────────────────────────────

export default function CuantoCuestaLandingPage() {
  const openWhatsApp = (location: string, message: string) => {
    ga.trackWhatsAppDirectoClick(location);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white font-sans">

      {/* HERO */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-puka-red/5 -skew-x-12 transform origin-right"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-puka-red text-white px-4 py-1.5 rounded-sm mb-8 text-sm font-bold tracking-wider uppercase italic">
              Precios reales en Ecuador &middot; 2026
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-[0.95] tracking-tight">
              &iquest;Cu&aacute;nto Cuesta una{' '}
              <span className="text-puka-red inline-block underline decoration-4 underline-offset-8 italic">
                Landing Page?
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
              Entre <strong className="text-puka-black dark:text-white">$350 y $1.500</strong>, seg&uacute;n
              qui&eacute;n la haga y qu&eacute; incluya. Abajo est&aacute; la tabla completa, sin
              &laquo;cotiza con nosotros&raquo; de por medio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="#tabla-precios"
                className="group bg-puka-black dark:bg-white text-white dark:text-puka-black px-8 py-4 rounded-sm font-display font-bold text-lg hover:bg-puka-red dark:hover:bg-puka-red dark:hover:text-white transition-all flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(199,23,30,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Ver la tabla de precios
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TABLA DE PRECIOS */}
      <section id="tabla-precios" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 leading-tight max-w-3xl">
            Precio de una landing page seg&uacute;n qui&eacute;n la hace
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
            Rangos observados en el mercado ecuatoriano para una landing de una sola oferta,
            con formulario y versi&oacute;n m&oacute;vil.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROVIDERS.map((p) => (
              <div
                key={p.who}
                className={`border p-7 rounded-sm flex flex-col gap-4 ${
                  p.featured
                    ? 'border-puka-red border-2 bg-puka-red/5'
                    : 'border-gray-200 dark:border-white/10'
                }`}
              >
                <div>
                  <p className="font-display font-bold text-lg mb-1">{p.who}</p>
                  <p
                    className={`font-display font-bold text-3xl tracking-tight ${
                      p.featured ? 'text-puka-red' : ''
                    }`}
                  >
                    {p.range}
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-3 mt-auto">
                  <p className="flex items-start gap-2">
                    <Clock size={16} className="shrink-0 mt-0.5" />
                    <span>{p.weeks}</span>
                  </p>
                  <p>
                    <span className="font-bold text-puka-black dark:text-white">
                      Ideal para:
                    </span>{' '}
                    {p.best}
                  </p>
                  <p>
                    <span className="font-bold text-puka-black dark:text-white">
                      A tener en cuenta:
                    </span>{' '}
                    {p.risk}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-8 max-w-2xl">
            Los precios de PukaDigital se muestran + IVA. Hosting y dominio se facturan aparte,
            entre $30 y $150 al a&ntilde;o seg&uacute;n el proveedor.
          </p>
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section className="py-20 md:py-28 bg-puka-black text-white">
        <div className="container mx-auto px-6">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 leading-tight max-w-3xl">
            Qu&eacute; incluye cada rango de precio
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl">
            La diferencia entre una landing de $200 y una de $490 casi nunca es el
            dise&ntilde;o. Es lo que pasa despu&eacute;s de que alguien hace clic.
          </p>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 pr-4 font-display font-bold text-sm uppercase tracking-wider text-gray-400">
                    Incluye
                  </th>
                  <th className="py-4 px-3 font-display font-bold text-sm uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    Plantilla
                    <br />
                    <span className="text-xs normal-case">$0 &ndash; $200</span>
                  </th>
                  <th className="py-4 px-3 font-display font-bold text-sm uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    Agencia
                    <br />
                    <span className="text-xs normal-case">$600 &ndash; $1.500</span>
                  </th>
                  <th className="py-4 px-3 font-display font-bold text-sm uppercase tracking-wider text-puka-red whitespace-nowrap">
                    PukaDigital
                    <br />
                    <span className="text-xs normal-case">desde $490</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {INCLUDES.map((row) => (
                  <tr key={row.item} className="border-b border-white/10">
                    <td className="py-4 pr-4 text-gray-300">{row.item}</td>
                    <td className="py-4 px-3 text-center">
                      {row.cheap ? (
                        <Check size={20} className="inline text-green-400" />
                      ) : (
                        <X size={20} className="inline text-gray-600" />
                      )}
                    </td>
                    <td className="py-4 px-3 text-center">
                      {row.agency ? (
                        <Check size={20} className="inline text-green-400" />
                      ) : (
                        <X size={20} className="inline text-gray-600" />
                      )}
                    </td>
                    <td className="py-4 px-3 text-center bg-puka-red/10">
                      {row.puka ? (
                        <Check size={20} className="inline text-puka-red" />
                      ) : (
                        <X size={20} className="inline text-gray-600" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FACTORES DE PRECIO */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-12 leading-tight max-w-3xl">
            Qu&eacute; hace que suba o baje el precio
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {FACTORS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-sm bg-puka-red/10 flex items-center justify-center">
                  <Icon size={22} className="text-puka-red" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUÁNTO COBRAR */}
      <section className="py-20 md:py-28 border-y border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-puka-red font-bold text-sm uppercase tracking-wider mb-4">
              <AlertCircle size={16} />
              Si eres t&uacute; quien la va a hacer
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 leading-tight">
              &iquest;Cu&aacute;nto cobrar por una landing page?
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed flex flex-col gap-4">
              <p>
                En Ecuador, un freelancer con portafolio cobra entre{' '}
                <strong className="text-puka-black dark:text-white">$350 y $700</strong> por una
                landing de una sola oferta. Si adem&aacute;s configuras Google Analytics 4, eventos
                de conversi&oacute;n y la conectas a Google Ads, el rango sube a{' '}
                <strong className="text-puka-black dark:text-white">$700 &ndash; $1.200</strong> sin
                salirte del mercado.
              </p>
              <p>
                Cobra por proyecto, no por hora. El cliente est&aacute; comprando m&aacute;s
                clientes, no tus horas de Figma &mdash; y una landing que convierte al 5% en vez del
                1% vale lo mismo aunque la hagas en la mitad del tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-12 leading-tight max-w-3xl">
            Preguntas frecuentes sobre el precio
          </h2>

          <div className="max-w-3xl flex flex-col divide-y divide-gray-200 dark:divide-white/10">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-7 flex flex-col gap-3">
                <h3 className="font-display font-bold text-xl leading-snug">{q}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-puka-black text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="font-display font-bold text-4xl md:text-6xl mb-6 leading-[0.95]">
              Cu&eacute;ntanos qu&eacute; vendes y te damos el precio exacto.
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
              Sin formulario de 12 campos ni llamada de descubrimiento. Escribes por WhatsApp,
              nos dices el objetivo de la landing y te respondemos con alcance y precio cerrado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                type="button"
                onClick={() =>
                  openWhatsApp(
                    'landing_page_precios_cta_final',
                    'Hola, vi la página de precios de landing pages. Quiero cotizar una para mi negocio.'
                  )
                }
                className="group bg-puka-red text-white px-8 py-4 rounded-sm font-display font-bold text-lg hover:bg-white hover:text-puka-black transition-all flex items-center gap-3 shadow-[0_0_24px_rgba(199,23,30,0.5)]"
              >
                Cotizar por WhatsApp
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
              </button>

              <Link
                href="/blog/cuanto-cuesta-pagina-web-ecuador"
                className="px-8 py-4 rounded-sm font-display font-bold text-lg border border-white/20 hover:border-white transition-all"
              >
                &iquest;Y una web completa?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
