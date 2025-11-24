'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Database, Bot, BarChart3, Globe, Zap, Server, Shield } from 'lucide-react';
import { PricingPlan } from '@/types';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

const Products: React.FC = () => {
  const { t } = useTranslation();

  const independentServices: PricingPlan[] = [
    {
      title: t('products.plan_1_title'),
      price: "$20",
      features: [t('products.plan_1_feat_1'), t('products.plan_1_feat_2'), t('products.plan_1_feat_3'), t('products.plan_1_feat_4')],
      cta: t('products.plan_1_cta')
    },
    {
      title: t('products.plan_2_title'),
      price: "$20",
      features: [t('products.plan_2_feat_1'), t('products.plan_2_feat_2'), t('products.plan_2_feat_3'), t('products.plan_2_feat_4')],
      cta: t('products.plan_2_cta'),
      highlight: true
    },
    {
      title: t('products.plan_3_title'),
      price: "$20",
      features: [t('products.plan_3_feat_1'), t('products.plan_3_feat_2'), t('products.plan_3_feat_3'), t('products.plan_3_feat_4')],
      cta: t('products.plan_3_cta')
    }
  ];

  // Structured Data for Products & Services (Rich Snippets)
  const productSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Chatbot IA PukaDigital",
        "description": "Asistente virtual impulsado por inteligencia artificial para PYMES. Automatiza atención al cliente en WhatsApp y Web.",
        "image": "https://pukadigital.com/assets/chatbot-preview.jpg",
        "brand": {
          "@type": "Brand",
          "name": "PukaDigital"
        },
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "20.00",
          "highPrice": "150.00",
          "priceCurrency": "USD",
          "offerCount": "3",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "CMS & Hosting Optimizado",
        "description": "Servicios de hosting Next.js + CMS con SEO Rich Snippets integrados para PYMES.",
        "offers": {
          "@type": "Offer",
          "price": "20.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  return (
    <div className="pt-12 pb-24">
      <SEO 
        title="Precios Transparentes | Chatbots IA, Web y ERP"
        description="Sin costos ocultos. Chatbots con IA desde $20/mes, Sistemas ERP y Webs autoadministrables. Paga solo por lo que usas, cuando lo necesitas."
        keywords="precio chatbot ia, costo pagina web peru, tarifas agencia digital, planes mantenimiento web"
        structuredData={productSchema}
      />
      
      <div className="container mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">{t('products.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('products.subtitle')}
          </p>
        </div>

        {/* CORE MODULES EXPLANATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="text-puka-red w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="bg-puka-beige inline-flex p-3 rounded-full mb-6">
                 <Zap className="text-puka-black" size={24} />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">{t('products.web_title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('products.web_desc')}
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0"/> {t('products.web_feat_1')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0"/> {t('products.web_feat_2')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0"/> {t('products.web_feat_3')}
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-sm hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Database className="text-puka-red w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="bg-puka-beige inline-flex p-3 rounded-full mb-6">
                 <Server className="text-puka-black" size={24} />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">{t('products.erp_title')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('products.erp_desc')}
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0"/> {t('products.erp_feat_1')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0"/> {t('products.erp_feat_2')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0"/> {t('products.erp_feat_3')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* A LA CARTE PRICING (PHASE 2) */}
        <div className="mb-24">
          <h2 className="font-display font-bold text-3xl mb-4 text-center text-puka-black dark:text-white">{t('products.menu_title')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Elige solo lo que necesitas. Sin paquetes forzados.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {independentServices.map((plan, idx) => (
              <div 
                key={idx} 
                className={`border p-8 rounded-sm relative flex flex-col transition-all duration-300 ${
                  plan.highlight 
                    ? 'border-puka-red bg-white dark:bg-gray-800 shadow-xl scale-105 z-10' 
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-puka-red text-white text-xs font-bold uppercase py-1 px-3 rounded-sm shadow-sm">
                    {t('products.plan_2_badge')}
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2 text-puka-black dark:text-white">{plan.title}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold font-display text-puka-black dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-puka-red shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.cta.includes("Demo") ? "/demos" : "/contacto"}
                  className={`w-full py-3 rounded-sm font-bold text-center transition-colors ${
                    plan.highlight 
                      ? 'bg-puka-black dark:bg-white text-white dark:text-puka-black hover:bg-gray-800 dark:hover:bg-gray-200' 
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-puka-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CHATBOT SCALABILITY DETAIL */}
        <div className="bg-gray-900 text-white rounded-sm p-8 md:p-12 transition-colors relative overflow-hidden">
          {/* Abstract background */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-puka-red px-4 py-2 rounded-full mb-6 shadow-lg">
                  <Bot className="text-white" size={20} />
                  <span className="font-bold text-sm text-white">{t('products.ia_badge')}</span>
                </div>
                <h2 className="font-display font-bold text-3xl mb-6 text-white">{t('products.chatbot_section_title')}</h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  {t('products.chatbot_section_desc')}
                </p>

                <div className="space-y-6">
                  {/* Tier 1 */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-sm flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div>
                      <span className="block font-bold text-lg text-white">{t('products.chatbot_tier_1')}</span>
                      <span className="text-xs text-gray-400">{t('products.chatbot_tier_1_desc')}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-xl text-puka-beige">$20<span className="text-xs text-gray-400">/mes</span></span>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-sm flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div>
                      <span className="block font-bold text-lg text-white">{t('products.chatbot_tier_2')}</span>
                      <span className="text-xs text-gray-400">{t('products.chatbot_tier_2_desc')}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-xl text-puka-beige">$50<span className="text-xs text-gray-400">/mes</span></span>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-sm flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div>
                      <span className="block font-bold text-lg text-white">{t('products.chatbot_tier_3')}</span>
                      <span className="text-xs text-gray-400">{t('products.chatbot_tier_3_desc')}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-xl text-puka-beige">$150+<span className="text-xs text-gray-400">/mes</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Side */}
              <div className="flex-1 w-full flex flex-col items-center justify-center bg-white/5 p-8 rounded-sm border border-white/10">
                <BarChart3 className="text-puka-red mb-6" size={80} />
                <h4 className="font-bold text-xl mb-2">{t('products.chatbot_metrics')}</h4>
                <p className="text-center text-gray-400 text-sm mb-6 max-w-xs">
                  Mira cómo el chatbot responde, vende y agenda citas en tiempo real.
                </p>
                <Link 
                  href="/demos" 
                  className="bg-white text-black px-8 py-3 rounded-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  {t('products.chatbot_cta')} <Zap size={16} className="text-puka-red fill-current" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Products;