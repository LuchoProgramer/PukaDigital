'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Clock, Rocket, ExternalLink, Search, Star } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';
import type { SupportedLocale } from '@/lib/schema';

import { allies } from '@/data/allies';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CasosPage = () => {
  const cases = allies;
  const { t, language } = useTranslation();
  const lang = (language || 'es') as SupportedLocale;

  const completedCases = cases.filter(c => c.status === 'graduated' || c.status === 'completed');
  const inProgressCases = cases.filter(c => c.status === 'in-progress');
  const justStartedCases = cases.filter(c => c.status === 'just-started');

  const WHATSAPP_NUMBER = '593964065880';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const handleWhatsAppClick = (location: string, message?: string) => {
    ga.trackWhatsAppDirectoClick(location);
    const finalLink = message
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
      : WHATSAPP_LINK;
    window.open(finalLink, '_blank');
  };

  // Breadcrumbs
  const breadcrumbItems = [
    { name: lang === 'es' ? 'Inicio' : lang === 'en' ? 'Home' : 'Início', url: `https://pukadigital.com/${lang}` },
    { name: lang === 'es' ? 'Casos Reales' : lang === 'en' ? 'Case Studies' : 'Casos Reais', url: `https://pukadigital.com/${lang}/casos` }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero Optimizado - Grunt Test 5s */}
      <section className="py-20 text-center bg-puka-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-puka-red/10 to-transparent -z-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-6 flex justify-center">
            <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest border border-white/20">
              Transparencia Radical
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            {t('cases.hero_h1')}
          </h1>
          <div className="text-xl md:text-2xl mb-10 text-gray-400 max-w-2xl mx-auto space-y-2">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle size={20} className="text-puka-red" /> {t('cases.hero_desc_top')}
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle size={20} className="text-puka-red" /> {t('cases.hero_desc_bottom')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleWhatsAppClick('cases_hero_primary', 'Hola, quiero obtener resultados como los de Cristina y Yadira.')}
              className="bg-[#25D366] text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-[#20bd5c] transition-colors flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <WhatsAppIcon size={24} className="fill-current" />
              {t('cases.cta_wa_main')}
            </button>
            <button
              onClick={() => handleWhatsAppClick('cases_hero_secondary', 'Hola, me gustaría mi diagnóstico gratuito para empezar el programa.')}
              className="bg-white text-puka-black px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
            >
              {t('cases.cta_wa_diag')}
            </button>
          </div>

          <p className="mt-8 text-sm font-bold text-puka-red uppercase tracking-widest animate-pulse">
            🔥 {t('cases.indicator_slots')}
          </p>
        </div>
      </section>

      {/* Métricas agregadas */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-puka-black dark:text-white">
            Estado Actual del Programa
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-puka-red">{cases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clientes Activos</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-green-600">{completedCases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Graduándose</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-yellow-600">{inProgressCases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">En Progreso</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Cupos Disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Caso Principal - Cristina (Graduándose) */}
      {completedCases.map((caso) => (
        <section key={caso.slug} className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

              {/* Badge de estado */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                  {caso.statusEmoji} {caso.statusLabel}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Foto y info */}
                <div className="text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <Image
                      src={caso.photo!}
                      alt={caso.clientName}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-puka-red object-cover"
                    />
                    <div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-puka-black dark:text-white">
                        {caso.clientName}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400">
                        {caso.business} • {caso.city}
                      </p>
                      <p className="text-puka-red font-medium">{caso.industry}</p>
                    </div>
                  </div>

                  <blockquote className="text-lg italic text-gray-600 dark:text-gray-300 border-l-4 border-puka-red pl-4 my-6">
                    "{caso.testimonialQuote}"
                  </blockquote>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <button
                      onClick={() => handleWhatsAppClick(
                        `case_wa_${caso.slug}`,
                        `Hola, leí el caso de ${caso.clientName} y quiero obtener resultados similares para mi negocio.`
                      )}
                      className="bg-[#25D366] text-white px-6 py-3 rounded-sm font-bold hover:bg-[#20bd5c] transition-colors inline-flex items-center gap-2 shadow-lg"
                    >
                      <WhatsAppIcon size={20} />
                      {t('cases.card_wa_results')} {caso.clientName.split(' ')[0]}
                    </button>
                    <Link
                      href={`/es/casos/${caso.slug}`}
                      className="border-2 border-puka-black dark:border-white text-puka-black dark:text-white px-6 py-3 rounded-sm font-bold hover:bg-puka-black hover:text-white dark:hover:bg-white dark:hover:text-puka-black transition-colors inline-flex items-center gap-2"
                    >
                      Ver proceso histórico <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* Métricas */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-sm">
                  <h3 className="text-xl font-bold mb-6 text-puka-black dark:text-white text-center">
                    Resultados Verificables
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-puka-red">{caso.metrics?.conversionsAds}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Conversiones Google Ads</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-green-600">+{caso.metrics?.conversionsOrganic}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Conversiones Orgánicas</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-yellow-600">{caso.metrics?.reviewsBefore}→{caso.metrics?.reviewsAfter}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Reseñas Google</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">5★</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Calificación Promedio</div>
                    </div>
                  </div>

                  {/* Verificación */}
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-sm">
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium text-center">
                      🔍 Verifica tú mismo: Busca "podóloga quito norte" en Google
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Casos en Progreso */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-puka-black dark:text-white">
              Casos en Progreso
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              Actualizamos su progreso cada semana. Transparencia total.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[...inProgressCases, ...justStartedCases].map((caso) => (
                <div
                  key={caso.slug}
                  className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 ${caso.status === 'in-progress'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      }`}>
                      {caso.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${caso.status === 'in-progress'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          }`}>
                          {caso.statusEmoji} {caso.statusLabel}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-puka-black dark:text-white">
                        {caso.clientName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {caso.business} • {caso.city}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Rocket size={18} className="text-puka-red" />
                      <span className="font-medium">{caso.highlight}</span>
                    </div>

                    {caso.currentPhase && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock size={18} className="text-gray-400" />
                        <span>Ahora: {caso.currentPhase}</span>
                      </div>
                    )}

                    {caso.metrics?.customLabel && (
                      <div className="mt-2 text-xs bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 p-2 rounded flex items-center gap-2">
                        <Star size={14} className="fill-current" />
                        <strong>{caso.metrics.customValue}</strong> {caso.metrics.customLabel}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Link
                      href={`/es/casos/${caso.slug}`}
                      className="text-puka-red font-bold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      Ver progreso <ArrowRight size={14} />
                    </Link>
                    <a
                      href={caso.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 font-bold text-sm hover:text-puka-red inline-flex items-center gap-1"
                    >
                      {caso.website.replace('https://', '')} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-puka-red text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            ¿Quieres Ser el Siguiente Caso?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Estamos documentando cada paso de nuestros clientes.<br />
            Tu historia podría ser la próxima.
          </p>
          <Link
            href="/es/contacto"
            className="bg-white text-puka-red px-12 py-5 rounded-sm text-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Aplicar al Programa <ArrowRight size={24} />
          </Link>
          <p className="text-sm mt-6 opacity-80">
            Solo 2 cupos disponibles este mes
          </p>
        </div>
      </section>

      {/* STICKY WHATSAPP BAR (MOBILE) */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-50 md:hidden flex justify-center">
        <button
          onClick={() => handleWhatsAppClick('sticky_cases_bar', 'Hola, quiero tomar uno de los 2 cupos para mi transformación digital.')}
          className="bg-[#25D366] text-white w-full py-3 rounded-full font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <WhatsAppIcon size={24} />
          Apartar cupo por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CasosPage;
