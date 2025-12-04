'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, Cpu, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import SEO from '@/components/SEO';
import ROICalculator from '@/components/ROICalculator';
import VideoTestimonial from '@/components/VideoTestimonial';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const scrollToForm = () => {
    const formElement = document.getElementById('start-now');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  // Track Hero CTA clicks
  const handleAplicarClick = async () => {
    await ga.trackAplicarPrograma('hero_section');
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
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="#start-now"
                onClick={handleAplicarClick}
                className="bg-puka-red text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-red-700 transition-colors text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.cta_primary')}
              </a>
              <a
                href="#como-funciona"
                onClick={handleVerSistemaClick}
                className="bg-white dark:bg-gray-800 dark:text-white border-2 border-puka-black dark:border-gray-600 text-puka-black px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
              >
                {t('home.cta_secondary')}
              </a>
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-sm">
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                🟢 {t('home.indicator_1')}
              </span>
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                🟢 {t('home.indicator_2')}
              </span>
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                🟢 {t('home.indicator_3')}
              </span>
            </div>

            {/* HERO COMPARISON - Agencia vs Puka */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-4xl">
              {/* Agency Side */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <XCircle size={14} className="text-red-500" /> {t('home.compare_agency_title')}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {t('home.compare_agency_price')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('home.compare_agency_result')}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p>{t('home.compare_agency_3years')}</p>
                  <p className="text-red-500 font-semibold">{t('home.compare_agency_end')}</p>
                </div>
              </div>

              {/* VS */}
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">{t('home.compare_vs')}</span>
              </div>

              {/* Puka Side */}
              <div className="bg-puka-red/10 dark:bg-puka-red/20 p-6 rounded-sm border-2 border-puka-red">
                <p className="text-xs text-puka-red mb-2 flex items-center gap-1 font-semibold">
                  <CheckCircle size={14} /> {t('home.compare_puka_title')}
                </p>
                <p className="text-2xl font-bold text-puka-black dark:text-white mb-2">
                  {t('home.compare_puka_price')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {t('home.compare_puka_result')}
                </p>
                <div className="text-xs space-y-1">
                  <p className="text-gray-600 dark:text-gray-400">{t('home.compare_puka_total')}</p>
                  <p className="text-green-600 dark:text-green-400 font-semibold">{t('home.compare_puka_end')}</p>
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            <p className="mt-8 text-center text-lg text-gray-600 dark:text-gray-400">
              {t('home.compare_savings')} <span className="text-puka-red font-bold text-2xl">{t('home.compare_savings_amount')}</span>
            </p>

            {/* Cupos visual */}
            <div className="mt-8 text-center">
              <p className="text-3xl tracking-widest mb-2">🔴🔴🔴🟢🟢</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Último cupo tomado hace 4 días</p>
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

      {/* THE SYSTEM */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-4xl mb-6 text-puka-black dark:text-white">{t('home.system_title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {t('home.system_subtitle')}
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="bg-puka-black dark:bg-gray-700 text-white w-10 h-10 flex items-center justify-center font-bold rounded-sm shrink-0">1</div>
                  <div>
                    <h3 className="font-bold text-lg text-puka-black dark:text-white">{t('home.phase_1_title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('home.phase_1_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-puka-black dark:bg-gray-700 text-white w-10 h-10 flex items-center justify-center font-bold rounded-sm shrink-0">2</div>
                  <div>
                    <h3 className="font-bold text-lg text-puka-black dark:text-white">{t('home.phase_2_title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('home.phase_2_desc')} <span className="font-semibold text-puka-red">{t('home.phase_2_note')}</span>{t('home.phase_2_desc_end')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-puka-red text-white w-10 h-10 flex items-center justify-center font-bold rounded-sm shrink-0">3</div>
                  <div>
                    <h3 className="font-bold text-lg text-puka-black dark:text-white">{t('home.phase_3_title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('home.phase_3_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-700 shadow-sm rounded-sm transition-colors">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <Cpu className="text-puka-red" size={32} />
                <div>
                  <h3 className="font-bold text-xl text-puka-black dark:text-white">{t('home.stack_title')}</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t('home.stack_subtitle')}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm transition-colors">
                  <span className="block font-bold mb-1 text-puka-black dark:text-gray-200">{t('home.stack_web')}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('home.stack_web_desc')}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm transition-colors">
                  <span className="block font-bold mb-1 text-puka-black dark:text-gray-200">{t('home.stack_bot')}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('home.stack_bot_desc')}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm transition-colors">
                  <span className="block font-bold mb-1 text-puka-black dark:text-gray-200">{t('home.stack_erp')}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('home.stack_erp_desc')}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm transition-colors">
                  <span className="block font-bold mb-1 text-puka-black dark:text-gray-200">{t('home.stack_analytics')}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('home.stack_analytics_desc')}</span>
                </div>
              </div>
              <p className="text-sm text-puka-red font-medium">{t('home.stack_democratization')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTROS 3 PRIMEROS ALIADOS */}
      <section className="py-24 bg-puka-beige dark:bg-amber-900/20 transition-colors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-puka-black dark:text-white">{t('home.allies_title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.allies_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ally 1 - Cristina */}
              <div className="bg-white dark:bg-gray-900 rounded-sm p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg"
                    alt="Yadira Cristina Muñoz"
                    className="w-16 h-16 rounded-full object-cover border-2 border-puka-red"
                  />
                  <div>
                    <h3 className="font-bold text-puka-black dark:text-white">{t('home.allies_1_name')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.allies_1_business')}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                    ✅ {t('home.allies_1_status')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{t('home.allies_1_result')}</p>
                <a href="https://podoclinicec.com" target="_blank" rel="noopener noreferrer" className="text-puka-red text-sm font-bold hover:underline">podoclinicec.com →</a>
              </div>

              {/* Ally 2 - Carla */}
              <div className="bg-white dark:bg-gray-900 rounded-sm p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-2xl border-2 border-yellow-500">
                    🐕
                  </div>
                  <div>
                    <h3 className="font-bold text-puka-black dark:text-white">{t('home.allies_2_name')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.allies_2_business')}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded text-xs font-bold">
                    🟡 {t('home.allies_2_status')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{t('home.allies_2_result')}</p>
                <a href="https://healppypets.com" target="_blank" rel="noopener noreferrer" className="text-puka-red text-sm font-bold hover:underline">{t('home.allies_2_website')} →</a>
              </div>

              {/* Ally 3 - Hotel Eudiq */}
              <div className="bg-white dark:bg-gray-900 rounded-sm p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl border-2 border-green-500">
                    🏨
                  </div>
                  <div>
                    <h3 className="font-bold text-puka-black dark:text-white">{t('home.allies_3_name')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.allies_3_business')}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold">
                    🟢 {t('home.allies_3_status')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{t('home.allies_3_result')}</p>
                <a href="https://hoteleudiq.com" target="_blank" rel="noopener noreferrer" className="text-puka-red text-sm font-bold hover:underline">{t('home.allies_3_website')} →</a>
              </div>
            </div>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">{t('home.allies_note')}</p>
          </div>
        </div>
      </section>

      {/* WHY ONLY 3 CLIENTS - POR QUÉ SOLO 3 CLIENTES */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8 text-center text-puka-black dark:text-white">
            {t('home.why_limit_title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8">
            {t('home.why_limit_could')}
          </p>
          <p className="text-2xl font-bold text-puka-red text-center mb-12">
            {t('home.why_limit_dont')}
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-sm p-8 mb-12">
            <p className="text-gray-700 dark:text-gray-300 mb-6">{t('home.why_limit_because')}</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-puka-red font-bold">→</span>
                {t('home.why_limit_point_1')}
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-puka-red font-bold">→</span>
                {t('home.why_limit_point_2')}
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
              <span title="Cristina - Graduada">🔴</span>
              <span title="Carla - Mes 2">🔴</span>
              <span title="Hotel Loja - Semana 2">🔴</span>
              <span title="Disponible">🟢</span>
              <span title="Disponible">🟢</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>🔴 {t('home.why_limit_slot_1')}</p>
              <p>🔴 {t('home.why_limit_slot_2')}</p>
              <p>🔴 {t('home.why_limit_slot_3')}</p>
              <p className="text-green-600 dark:text-green-400 font-bold">🟢 {t('home.why_limit_slot_4')}</p>
              <p className="text-green-600 dark:text-green-400 font-bold">🟢 {t('home.why_limit_slot_5')}</p>
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
              <blockquote className="border-l-4 border-puka-red pl-4 italic text-gray-500 dark:text-gray-400">
                "{t('home.founder_quote')}"
              </blockquote>
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