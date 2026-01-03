'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ShieldCheck, TrendingUp, Cpu, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';
import { allies } from '@/data/allies';
import * as ga from '@/lib/analytics';

// Lazy Load Heavy Components to improve FCP
const LeadForm = dynamic(() => import('@/components/LeadForm'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-sm"></div>,
  ssr: false
});
const ROICalculator = dynamic(() => import('@/components/ROICalculator'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-sm"></div>
});
const VideoTestimonial = dynamic(() => import('@/components/VideoTestimonial'), {
  loading: () => <div className="aspect-video bg-black rounded-sm border border-gray-800"></div>
});

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

const Home: React.FC = () => {
  const { t, language } = useTranslation();
  const lang = language || 'es';

  const scrollToForm = () => {
    const formElement = document.getElementById('start-now');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  // Track Hero CTA clicks
  const handleAplicarClick = async () => {
    await ga.trackAplicarPrograma('hero_section');
  };

  const WHATSAPP_NUMBER = '593964065880';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const handleWhatsAppClick = (location: string) => {
    ga.trackWhatsAppDirectoClick(location);
    window.open(WHATSAPP_LINK, '_blank');
  };

  const handleVerSistemaClick = () => {
    ga.trackVerSistemaGraduacion();
  };

  // Service Schema for homepage - Better than FAQPage for our business type
  // FAQPage is now restricted to government/health sites per Google Nov 2025 guidelines
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://pukadigital.com/#programa-independencia",
    "serviceType": "Digital Transformation Education",
    "name": "Programa de Independencia Digital",
    "description": "3 meses de capacitación intensiva para que PYMEs gestionen su tecnología sin depender de agencias. Incluye sitio web, chatbot IA, ERP y $300 en Google Ads.",
    "provider": {
      "@id": "https://pukadigital.com/#organization"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ecuador"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Módulos del Programa",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mes 1: Desarrollo Web",
            "description": "Sitio web Next.js, hosting Vercel, dominio, SEO básico"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mes 2: Chatbot IA",
            "description": "Asistente virtual GPT-4, WhatsApp Business, respuestas 24/7"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mes 3: ERP Cloud",
            "description": "Sistema ODOO, inventario, CRM, facturación electrónica SRI"
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "900",
      "priceCurrency": "USD",
      "description": "$300/mes por 3 meses. Incluye $100/mes en Google Ads.",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/LimitedAvailability",
      "availabilityStarts": "2025-01-01",
      "url": "https://pukadigital.com/contacto"
    }
  };

  return (
    <div className="flex flex-col">
      <SEO
        title={t('home.hero_title_2')}
        description={t('home.hero_desc')}
        keywords="independencia digital, agencia marketing digital ecuador, chatbot ia pymes, sistema erp ecuador, puka digital quito"
        structuredData={serviceSchema}
      />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block py-1 px-3 bg-puka-red/10 text-puka-red font-semibold text-xs tracking-wider uppercase mb-6 rounded-sm border border-puka-red/20">
              {t('home.badge')}
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-puka-black dark:text-white mb-6 transition-colors">
              {t('home.hero_h1')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-6 leading-relaxed transition-colors">
              {t('home.hero_desc')}
            </p>
            <div className="bg-puka-beige dark:bg-amber-900/50 inline-block px-6 py-3 rounded-sm mb-6">
              <p className="font-bold text-xl text-puka-black dark:text-white">
                {t('home.hero_formula')}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                💡 {t('home.hero_ads_note')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => handleWhatsAppClick('hero_primary')}
                className="bg-[#25D366] text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-[#20bd5c] transition-colors text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <WhatsAppIcon size={24} className="fill-current" />
                {t('home.cta_primary')}
              </button>
              <a
                href="#start-now"
                onClick={handleAplicarClick}
                className="bg-white dark:bg-gray-800 dark:text-white border-2 border-puka-black dark:border-gray-600 text-puka-black px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center inline-flex items-center justify-center gap-2"
              >
                {t('home.cta_secondary')}
              </a>
            </div>

            {/* Bullets de Claridad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CheckCircle className="text-puka-red" size={20} />
                <span>Web que vende</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CheckCircle className="text-puka-red" size={20} />
                <span>Bot IA 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CheckCircle className="text-puka-red" size={20} />
                <span>Facturación SRI</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 text-sm border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
              <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {t('home.indicator_1')}
              </span>
              <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {t('home.indicator_2')}
              </span>
            </div>
          </div>
        </div>
        {/* Abstract Background Element */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gray-50 dark:bg-gray-800/30 -z-10 hidden lg:block skew-x-12 translate-x-32 transition-colors duration-300" />
      </section>

      {/* TESTIMONIAL HERO - Cristina */}
      <section className="py-16 bg-puka-black dark:bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Photo + Video Placeholder */}
            <div className="relative">
              <VideoTestimonial
                videoId="bSge9e1Se4w"
                title="Testimonio Yadira Cristina Muñoz - PodoclinicEC"
              />
            </div>

            {/* Quote */}
            <div>
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-6 text-puka-beige">
                {t('home.testimonial_video_title')}
              </h3>
              <blockquote className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed italic">
                "{t('home.testimonial_quote')}"
              </blockquote>
              <div className="mb-6">
                <p className="font-bold text-white text-lg">{t('home.testimonial_author')}</p>
                <p className="text-gray-400">{t('home.testimonial_role')}</p>
                <p className="text-puka-red text-sm mt-1">{t('home.testimonial_result')}</p>
              </div>
              <a href="/blog" className="inline-flex items-center gap-2 text-puka-red hover:text-red-400 font-semibold transition-colors">
                {t('home.testimonial_cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HERO COMPARISON - Agencia vs Puka (Movida después del testimonio) */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center font-display font-bold text-3xl mb-12 text-puka-black dark:text-white">
              ¿Por qué pagar una renta eterna?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Agency Side */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-wider font-bold">
                  <XCircle size={14} className="text-red-500" /> {t('home.compare_agency_title')}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {t('home.compare_agency_price')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {t('home.compare_agency_result')}
                </p>
                <div className="text-sm text-gray-500 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p>{t('home.compare_agency_3years')}</p>
                  <p className="text-red-500 font-bold">{t('home.compare_agency_end')}</p>
                </div>
              </div>

              {/* VS */}
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-300 dark:text-gray-600">{t('home.compare_vs')}</span>
              </div>

              {/* Puka Side */}
              <div className="bg-puka-red/5 dark:bg-puka-red/10 p-8 rounded-sm border-2 border-puka-red shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-puka-red text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  Inversión Inteligente
                </div>
                <p className="text-xs text-puka-red mb-2 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <CheckCircle size={14} /> {t('home.compare_puka_title')}
                </p>
                <p className="text-3xl font-bold text-puka-black dark:text-white mb-2">
                  {t('home.compare_puka_price')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  {t('home.compare_puka_result')}
                </p>
                <div className="text-sm space-y-2 border-t border-puka-red/20 pt-4">
                  <p className="text-gray-600 dark:text-gray-400">{t('home.compare_puka_total')}</p>
                  <p className="text-green-600 dark:text-green-500 font-bold">{t('home.compare_puka_end')}</p>
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="mt-12 text-center bg-puka-beige dark:bg-amber-900/20 p-6 rounded-sm">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('home.compare_savings')} <span className="text-puka-red font-bold text-3xl">{t('home.compare_savings_amount')}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE ENEMY - EL VERDADERO ENEMIGO */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8 text-puka-black dark:text-white">
            {t('home.enemy_title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {t('home.enemy_not')}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-puka-red mb-8">
            {t('home.enemy_is')}
          </p>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm p-8 mb-8 text-left shadow-sm">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('home.enemy_model_says')}</p>
            <p className="text-puka-black dark:text-white font-medium italic mb-6">"{t('home.enemy_quote')}"</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('home.enemy_sounds_good')}</p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-puka-red">→</span> {t('home.enemy_point_1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-puka-red">→</span> {t('home.enemy_point_2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-puka-red">→</span> {t('home.enemy_point_3')}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-puka-red">→</span> {t('home.enemy_point_4')}
              </li>
            </ul>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{t('home.enemy_not_service')}</p>
          <p className="text-2xl font-bold text-puka-black dark:text-white mb-8">{t('home.enemy_perpetual_rent')}</p>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">{t('home.enemy_puka_exists')}</p>
            <p className="text-xl text-puka-black dark:text-white font-medium mb-4">{t('home.enemy_teach_independence')}</p>
            <p className="text-puka-red font-bold text-lg">{t('home.enemy_dignity')}</p>
          </div>
        </div>
      </section>

      {/* WHY PUKA EXISTS - ORIGEN STORY */}
      <section className="py-20 bg-puka-beige dark:bg-amber-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 text-center text-puka-black dark:text-white">
            {t('home.origin_title')}
          </h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {t('home.origin_story_1')}
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {t('home.origin_story_2')}
            </p>
            <blockquote className="border-l-4 border-puka-red pl-6 my-8">
              <p className="text-xl italic text-gray-600 dark:text-gray-400">
                "{t('home.origin_quote')}"
              </p>
              <footer className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                — {t('home.origin_quote_author')}
              </footer>
            </blockquote>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {t('home.origin_story_3')}
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-sm p-8 mt-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-bold text-puka-black dark:text-white mb-2">
                {t('home.origin_mission_1')}
              </p>
              <p className="text-2xl font-bold text-puka-red">
                {t('home.origin_mission_2')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
                {t('home.origin_tagline')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM VS SOLUTION */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-16 text-center text-puka-black dark:text-white">{t('home.problem_title')}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {/* Old Way */}
            <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-sm bg-gray-50 dark:bg-gray-800/50 opacity-75 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="text-gray-400" size={32} />
                <h3 className="font-bold text-xl text-gray-500 dark:text-gray-400">{t('home.agency_title')}</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.agency_item_1')}
                </li>
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.agency_item_2')}
                </li>
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.agency_item_3')}
                </li>
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.agency_item_4')}
                </li>
              </ul>
              <div className="text-center py-4 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-sm">
                {t('home.agency_tag')}
              </div>
            </div>

            {/* DIY Way */}
            <div className="border border-gray-200 dark:border-gray-800 p-8 rounded-sm bg-gray-50 dark:bg-gray-800/50 opacity-75 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-gray-400" size={32} />
                <h3 className="font-bold text-xl text-gray-500 dark:text-gray-400">{t('home.freelancer_title')}</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-yellow-500 font-bold">~</span> {t('home.freelancer_item_1')}
                </li>
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.freelancer_item_2')}
                </li>
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.freelancer_item_3')}
                </li>
                <li className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-red-300 font-bold">−</span> {t('home.freelancer_item_4')}
                </li>
              </ul>
              <div className="text-center py-4 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-sm">
                {t('home.freelancer_tag')}
              </div>
            </div>

            {/* Puka Way */}
            <div className="border-2 border-puka-red p-8 rounded-sm bg-white dark:bg-gray-800 relative shadow-xl transform lg:-translate-y-4 transition-colors">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-puka-red text-white px-4 py-1 text-sm font-bold tracking-wider uppercase rounded-sm shadow-sm">
                {t('home.puka_badge')}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-puka-red" size={32} />
                <h3 className="font-bold text-xl text-puka-black dark:text-white">{t('home.puka_title')}</h3>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2 text-puka-black dark:text-gray-200 font-medium">
                  <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" />
                  <div>
                    {t('home.puka_item_1')}
                    <span className="block text-sm text-puka-red font-bold mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-sm inline-block">{t('home.puka_item_1_note')}</span>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-puka-black dark:text-gray-200 font-medium">
                  <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" /> {t('home.puka_item_2')}
                </li>
                <li className="flex items-start gap-2 text-puka-black dark:text-gray-200 font-medium">
                  <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" /> {t('home.puka_item_3')}
                </li>
                <li className="flex items-start gap-2 text-puka-black dark:text-gray-200 font-medium">
                  <CheckCircle size={18} className="text-green-600 mt-1 shrink-0" /> {t('home.puka_item_4')}
                </li>
              </ul>
              <div className="text-center py-4 bg-puka-beige text-puka-black font-bold rounded-sm">
                {t('home.puka_tag')}
              </div>
            </div>
          </div>

          {/* ROI CALCULATOR INSERTION */}
          <div className="max-w-5xl mx-auto mt-24">
            <ROICalculator />
          </div>

        </div>
      </section>

      {/* THE SYSTEM - EL PLAN DE 3 PASOS */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-4xl mb-4 text-puka-black dark:text-white">{t('home.system_title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('home.system_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Paso 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-sm shadow-sm border-t-4 border-puka-black hover:shadow-md transition-shadow">
              <span className="text-5xl font-black text-gray-100 dark:text-gray-700 block mb-4">01</span>
              <h3 className="font-bold text-xl mb-4 text-puka-black dark:text-white">Cita de Diagnóstico</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Analizamos tu negocio por WhatsApp y definimos si el programa es para ti. Sin compromisos.</p>
              <span className="text-xs font-bold text-puka-red uppercase tracking-widest">Paso Inicial</span>
            </div>

            {/* Paso 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-sm shadow-xl border-t-4 border-puka-red transform md:-translate-y-4">
              <span className="text-5xl font-black text-puka-red/10 block mb-4">02</span>
              <h3 className="font-bold text-xl mb-4 text-puka-black dark:text-white">Construcción y Pauta</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">Levantamos tu web y bot mientras lanzamos tus primeros anuncios en Google Ads.</p>
              <span className="bg-puka-red text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Ejecución Activa</span>
            </div>

            {/* Paso 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-sm shadow-sm border-t-4 border-puka-black hover:shadow-md transition-shadow">
              <span className="text-5xl font-black text-gray-100 dark:text-gray-700 block mb-4">03</span>
              <h3 className="font-bold text-xl mb-4 text-puka-black dark:text-white">Graduación y Libertad</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Te entregamos las llaves de todo. Eres 100% independiente. No nos pagas más renta.</p>
              <span className="text-xs font-bold text-puka-red uppercase tracking-widest">Resultado Final</span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => handleWhatsAppClick('system_section')}
              className="inline-flex items-center gap-2 bg-puka-black text-white px-8 py-4 rounded-sm font-bold hover:bg-gray-800 transition-all shadow-lg"
            >
              Comenzar con el Paso 1 →
            </button>
          </div>
        </div>
      </section>

      {/* THE STACK - LAS HERRAMIENTAS */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-puka-black text-white p-8 md:p-16 rounded-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Cpu size={300} />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">{t('home.stack_title')}</h2>
              <p className="text-gray-400 text-lg mb-10">{t('home.stack_subtitle')}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="block text-2xl font-bold text-puka-red mb-1">Web</span>
                  <span className="text-sm text-gray-400">Next.js de alta velocidad</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-puka-red mb-1">IA</span>
                  <span className="text-sm text-gray-400">Bot GPT-4 24/7</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-puka-red mb-1">ERP</span>
                  <span className="text-sm text-gray-400">Gestión de Stock y SRI</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-puka-red mb-1">Ads</span>
                  <span className="text-sm text-gray-400">Pauta profesional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTROS ALIADOS EN EL PROGRAMA */}
      <section className="py-24 bg-puka-beige dark:bg-amber-900/20 transition-colors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-puka-black dark:text-white">Nuestros Aliados</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.allies_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {allies.map((ally) => (
                <div
                  key={ally.slug}
                  className={`bg-white dark:bg-gray-900 rounded-sm p-6 shadow-lg border transition-colors relative ${ally.status === 'just-started' && ally.industry.includes('Licores')
                    ? 'border-2 border-amber-400 dark:border-amber-600 shadow-xl'
                    : 'border-gray-200 dark:border-gray-700'
                    }`}
                >
                  {ally.status === 'just-started' && ally.industry.includes('Licores') && (
                    <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase tracking-tighter">
                      Nuevo / Premium
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    {ally.photo ? (
                      <img
                        src={ally.photo}
                        alt={ally.clientName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-puka-red"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 shadow-sm ${ally.industry.includes('Licores') ? 'bg-black border-amber-500' :
                        ally.status === 'graduated' ? 'bg-green-100 dark:bg-green-900/30 border-green-500' :
                          'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500'
                        }`}>
                        {ally.emoji || '👤'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-puka-black dark:text-white leading-tight">{ally.clientName}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ally.business}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${ally.status === 'graduated' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      ally.status === 'just-started' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/20' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                      {ally.statusEmoji} {ally.statusLabel}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{ally.highlight}</p>

                  <div className="flex flex-col gap-2 mt-auto">
                    {ally.website !== 'https://pukadigital.com' ? (
                      <a href={ally.website} target="_blank" rel="noopener noreferrer" className="text-puka-red text-sm font-bold hover:underline">
                        {ally.website.replace('https://', '')} →
                      </a>
                    ) : (
                      <div className="text-amber-600 dark:text-amber-500 text-xs font-bold italic">
                        Próximamente: Web Catálogo
                      </div>
                    )}
                    <Link href={`/${lang}/casos/${ally.slug}`} className="text-gray-500 dark:text-gray-400 text-xs font-bold hover:text-puka-red transition-colors inline-flex items-center gap-1">
                      {ally.status === 'graduated' ? 'Ver caso completo' : 'Ver hoja de ruta'} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">{t('home.allies_note')}</p>
          </div>
        </div>
      </section>

      {/* WHY LIMIT - Reassurance bar */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-800">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-puka-black dark:text-white">
              {t('home.why_limit_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto italic">
              "{t('home.why_limit_could')}"
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-8 mb-12">
            <p className="text-gray-700 dark:text-gray-300 mb-6">{t('home.why_limit_because')}</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-puka-red font-bold">→</span>
                {t('home.why_limit_point_1')}
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300 items-center justify-between w-full">
                <div className="flex items-start gap-3">
                  <span className="text-puka-red font-bold">→</span>
                  {t('home.why_limit_point_2')}
                </div>
                <button
                  onClick={() => handleWhatsAppClick('why_limit_section')}
                  className="hidden sm:inline-flex items-center gap-1 text-puka-red font-bold hover:underline"
                >
                  Ir al WhatsApp del fundador →
                </button>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-puka-red font-bold">→</span>
                {t('home.why_limit_point_3')}
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-puka-red font-bold">→</span>
                {t('home.why_limit_point_4')}
              </li>
            </ul>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
            {t('home.why_limit_no_scale')}
          </p>

          {/* CONTADOR VISUAL DE CUPOS */}
          <div className="bg-puka-beige dark:bg-amber-900/20 rounded-sm p-8 text-center">
            <p className="font-bold text-puka-black dark:text-white mb-4">{t('home.why_limit_status')}</p>

            <div className="flex justify-center gap-2 mb-6 text-3xl">
              {/* Active clients (excluding graduated for the pool of 5) */}
              {allies.filter(a => a.status !== 'graduated').map(a => (
                <span key={a.slug} title={`${a.business} - ${a.statusLabel}`}>🔴</span>
              ))}
              {/* Available slots (Total 5 - Active) */}
              {Array.from({ length: Math.max(0, 5 - allies.filter(a => a.status !== 'graduated').length) }).map((_, i) => (
                <span key={i} title="Disponible">🟢</span>
              ))}
            </div>

            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {/* List graduated first as proof of success */}
              {allies.filter(a => a.status === 'graduated').map(a => (
                <p key={a.slug}>✅ <strong>Graduada:</strong> {a.business} ({a.clientName})</p>
              ))}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 w-1/4 mx-auto" />
              {/* List active ones */}
              {allies.filter(a => a.status !== 'graduated').map(a => (
                <p key={a.slug}>🔴 <strong>Cupo activo:</strong> {a.business} - {a.statusLabel}</p>
              ))}
              {/* List available ones */}
              {Array.from({ length: Math.max(0, 5 - allies.filter(a => a.status !== 'graduated').length) }).map((_, i) => (
                <p key={i} className="text-green-600 dark:text-green-400 font-bold">🟢 <strong>Disponible:</strong> Cupo Libre</p>
              ))}
            </div>

            <a href="#start-now" className="inline-block mt-8 bg-puka-red text-white px-8 py-4 rounded-sm font-bold hover:bg-red-700 transition-colors">
              {t('home.why_limit_cta')}
            </a>
          </div>
        </div>
      </section>

      {/* QUIÉN ESTÁ DETRÁS - FOUNDER SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="aspect-square max-w-sm mx-auto">
                <img
                  src="https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png"
                  alt="Luis Omar Viteri - Fundador de Puka Digital"
                  className="w-full h-full object-cover rounded-sm shadow-xl"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-puka-red text-white px-4 py-2 rounded-sm font-bold text-sm shadow-lg">
                {t('home.founder_years')}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-puka-black dark:text-white">
                {t('home.founder_title')}
              </h2>
              <p className="text-puka-red font-bold text-lg mb-6">{t('home.founder_name')}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('home.founder_bio_1')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('home.founder_bio_2')}
              </p>
              <blockquote className="border-l-4 border-puka-red pl-4 italic text-gray-500 dark:text-gray-400 mb-8">
                "{t('home.founder_quote')}"
              </blockquote>
              <button
                onClick={() => handleWhatsAppClick('founder_section')}
                className="bg-puka-red text-white px-6 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <WhatsAppIcon size={20} className="fill-current" />
                Hablar con Luis por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="font-display font-bold text-3xl mb-12 text-center text-puka-black dark:text-white">{t('home.faq_title')}</h2>

          <div className="space-y-6">
            <details className="group border border-gray-200 dark:border-gray-700 rounded-sm p-6 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
              <summary className="font-bold text-lg list-none flex justify-between items-center text-puka-black dark:text-white">
                {t('home.faq_1_q')}
                <span className="group-open:rotate-180 transition-transform"><TrendingUp size={20} /></span>
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                {t('home.faq_1_a')} <span className="font-bold text-puka-red">{t('home.faq_1_highlight')}</span> {t('home.faq_1_end')}
              </p>
            </details>

            <details className="group border border-gray-200 dark:border-gray-700 rounded-sm p-6 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
              <summary className="font-bold text-lg list-none flex justify-between items-center text-puka-black dark:text-white">
                {t('home.faq_2_q')}
                <span className="group-open:rotate-180 transition-transform"><TrendingUp size={20} /></span>
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                {t('home.faq_2_a')}
              </p>
            </details>

            <details className="group border border-gray-200 dark:border-gray-700 rounded-sm p-6 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
              <summary className="font-bold text-lg list-none flex justify-between items-center text-puka-black dark:text-white">
                {t('home.faq_3_q')}
                <span className="group-open:rotate-180 transition-transform"><TrendingUp size={20} /></span>
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                {t('home.faq_3_a')}
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CONVERSION SECTION (Embed Form) */}
      <section id="start-now" className="py-24 bg-puka-black dark:bg-black relative overflow-hidden transition-colors">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Copy */}
            <div className="text-white">
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">{t('home.cta_final_title')}</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                {t('home.cta_final_subtitle')}
              </p>

              <ul className="space-y-6 mb-10">
                <li className="flex items-center gap-4">
                  <div className="bg-puka-red/20 p-2 rounded-full">
                    <CheckCircle className="text-puka-red" size={24} />
                  </div>
                  <div>
                    <strong className="block text-lg">{t('home.cta_point_1')}</strong>
                    <span className="text-gray-400 text-sm">{t('home.cta_point_1_desc')}</span>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="bg-puka-red/20 p-2 rounded-full">
                    <ShieldCheck className="text-puka-red" size={24} />
                  </div>
                  <div>
                    <strong className="block text-lg">{t('home.cta_point_2')}</strong>
                    <span className="text-gray-400 text-sm">{t('home.cta_point_2_desc')}</span>
                  </div>
                </li>
              </ul>

              <div className="hidden lg:block">
                <ArrowRight className="text-white opacity-20" size={120} />
              </div>
            </div>

            {/* Right Form */}
            <div className="relative">
              <div className="absolute -inset-4 bg-puka-red opacity-20 blur-xl rounded-full"></div>
              <LeadForm title={t('form.title')} className="relative z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* INTERNAL LINKING: FEATURED BLOG POSTS */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-puka-black dark:text-white">
              Recursos Gratuitos para Tu Negocio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Aprende cómo funciona la independencia digital con nuestras guías detalladas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Featured Post 1 */}
            <Link
              href="/blog/cuanto-cuesta-pagina-web-ecuador"
              className="group bg-gray-50 dark:bg-gray-800 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-xl transition-all"
            >
              <div className="h-48 bg-gradient-to-br from-puka-red to-red-700 flex items-center justify-center">
                <span className="text-6xl">💰</span>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-puka-red mb-2 uppercase tracking-wide">Precios</div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  ¿Cuánto Cuesta una Web en Ecuador?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Comparativa brutal: Agencia ($20,500) vs PukaDigital ($2,100) en 5 años.
                </p>
                <span className="text-puka-red text-sm font-bold inline-flex items-center gap-1">
                  Leer análisis completo <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Featured Post 2 */}
            <Link
              href="/blog/5-senales-pyme-necesita-chatbot-ia"
              className="group bg-gray-50 dark:bg-gray-800 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-xl transition-all"
            >
              <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-6xl">🤖</span>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-puka-red mb-2 uppercase tracking-wide">Automatización</div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  5 Señales que Necesitas un Chatbot
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Casos reales de Ecuador: restaurantes, boutiques y gyms que automatizaron.
                </p>
                <span className="text-puka-red text-sm font-bold inline-flex items-center gap-1">
                  Ver las señales <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Featured Post 3 */}
            <Link
              href="/blog/caso-exito-podoclinicec-independencia-digital"
              className="group bg-gray-50 dark:bg-gray-800 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-xl transition-all"
            >
              <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <span className="text-6xl">📈</span>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-puka-red mb-2 uppercase tracking-wide">Caso de Éxito</div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  PodoclinicEC: 53 Conversiones/Mes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  De 3 a 15 reseñas en Google y 33 conversiones de Google Ads + 20 orgánicas.
                </p>
                <span className="text-puka-red text-sm font-bold inline-flex items-center gap-1">
                  Leer historia completa <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-puka-black dark:bg-white text-white dark:text-puka-black px-8 py-4 rounded-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Ver Todos los Artículos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;