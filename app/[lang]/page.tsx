'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, Cpu, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import SEO from '@/components/SEO';
import ROICalculator from '@/components/ROICalculator';
import { useTranslation } from '@/lib/i18n';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const scrollToForm = () => {
    const formElement = document.getElementById('start-now');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  // Structured Data for FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('home.faq_1_q'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${t('home.faq_1_a')} ${t('home.faq_1_end')}`
        }
      },
      {
        "@type": "Question",
        "name": t('home.faq_2_q'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('home.faq_2_a')
        }
      },
      {
        "@type": "Question",
        "name": t('home.faq_3_q'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('home.faq_3_a')
        }
      }
    ]
  };

  return (
    <div className="flex flex-col">
      <SEO 
        title={t('home.hero_title_2')}
        description={t('home.hero_desc')}
        keywords="independencia digital, agencia marketing lima, chatbot ia pymes, sistema erp facil, puka digital"
        structuredData={faqSchema}
      />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block py-1 px-3 bg-puka-beige text-puka-black font-semibold text-xs tracking-wider uppercase mb-6 rounded-sm">
              {t('home.badge')}
            </span>
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-puka-black dark:text-white mb-8 transition-colors">
              {t('home.hero_title_1')} <br />
              <span className="text-puka-red">{t('home.hero_title_2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed transition-colors">
              {t('home.hero_desc')}
              <span className="block mt-4 font-semibold text-puka-black dark:text-white"> {t('home.hero_formula')}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={scrollToForm} className="bg-puka-red text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-red-700 transition-colors text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {t('home.cta_primary')}
              </button>
              <Link href="/demos" className="bg-white dark:bg-gray-800 dark:text-white border-2 border-puka-black dark:border-gray-600 text-puka-black px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                {t('home.cta_secondary')}
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               {t('home.ads_note')}
            </div>
          </div>
        </div>
        {/* Abstract Background Element */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gray-50 dark:bg-gray-800/30 -z-10 hidden lg:block skew-x-12 translate-x-32 transition-colors duration-300" />
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
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <Cpu className="text-puka-red" size={32} />
                <div>
                  <h3 className="font-bold text-puka-black dark:text-white">{t('home.stack_title')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('home.stack_subtitle')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24 bg-puka-beige dark:bg-amber-900/20 transition-colors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl mb-12 text-puka-black dark:text-white">{t('home.proof_title')}</h2>
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-sm shadow-xl relative transition-colors">
              <div className="text-puka-red text-6xl font-serif absolute top-4 left-6 opacity-20">"</div>
              <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-8 relative z-10">
                {t('home.proof_quote')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-puka-black dark:text-white">MG</div>
                <div className="text-left">
                  <div className="font-bold text-puka-black dark:text-white">María González</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.proof_author_role')}</div>
                </div>
              </div>
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
    </div>
  );
};

export default Home;