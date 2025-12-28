'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Database, Bot, BarChart3, Globe, Zap, Server, Shield, ArrowRight, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { PricingPlan } from '@/types';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';

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

const Products: React.FC = () => {
  const { t } = useTranslation();

  const WHATSAPP_NUMBER = '593964065880';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const handleWhatsAppClick = (location: string, message?: string) => {
    ga.trackWhatsAppDirectoClick(location);
    const finalLink = message
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
      : WHATSAPP_LINK;
    window.open(finalLink, '_blank');
  };

  // Track module clicks
  const handleModuleClick = (moduloName: 'CMS, Mapas & SEO' | 'ERP Cloud' | 'Chatbot IA', moduloNumber: 1 | 2 | 3) => {
    ga.trackProductoModuloClick(moduloName, moduloNumber);
  };

  const independentServices: PricingPlan[] = [
    {
      id: 'cms',
      name: t('products.plan_1_title'),
      price: "$20",
      period: '/mes',
      features: [t('products.plan_1_feat_1'), t('products.plan_1_feat_2'), t('products.plan_1_feat_3'), t('products.plan_1_feat_4')],
      cta: t('products.plan_1_cta')
    },
    {
      id: 'chatbot',
      name: t('products.plan_2_title'),
      price: "$20",
      period: '/mes',
      features: [t('products.plan_2_feat_1'), t('products.plan_2_feat_2'), t('products.plan_2_feat_3'), t('products.plan_2_feat_4')],
      cta: t('products.plan_2_cta'),
      highlighted: true
    },
    {
      id: 'erp',
      name: t('products.plan_3_title'),
      price: "$20",
      period: '/mes',
      features: [t('products.plan_3_feat_1'), t('products.plan_3_feat_2'), t('products.plan_3_feat_3'), t('products.plan_3_feat_4')],
      cta: t('products.plan_3_cta')
    }
  ];

  // Structured Data for Products & Services (Rich Snippets)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // BreadcrumbList for navigation
      {
        "@type": "BreadcrumbList",
        "@id": "https://pukadigital.com/productos#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": "https://pukadigital.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Productos y Servicios",
            "item": "https://pukadigital.com/productos"
          }
        ]
      },
      // Main Service - 3 Month Independence Program
      {
        "@type": "Service",
        "@id": "https://pukadigital.com/productos#programa-3-meses",
        "serviceType": "Digital Transformation Education",
        "name": "Programa de Independencia Digital - 3 Meses",
        "description": "Programa educativo intensivo: MES 1 desarrollo web, MES 2 chatbot IA, MES 3 sistema ERP. $300/mes incluye $100 en Google Ads. Logra autonomía digital total.",
        "provider": {
          "@id": "https://pukadigital.com/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Ecuador"
        },
        "offers": {
          "@type": "Offer",
          "price": "900",
          "priceCurrency": "USD",
          "description": "$300/mes por 3 meses. Incluye hosting, chatbot IA, ERP y $100/mes en Google Ads.",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://pukadigital.com/productos"
        }
      },
      // Product 1: CMS + Hosting
      {
        "@type": "Product",
        "@id": "https://pukadigital.com/productos#cms-hosting",
        "name": "CMS + Hosting Optimizado Next.js",
        "description": "Hosting especializado en Next.js con editor visual, SEO automático, analíticas y CDN global. Perfecto para webs corporativas autogestionables.",
        "brand": {
          "@type": "Brand",
          "name": "PukaDigital"
        },
        "offers": {
          "@type": "Offer",
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20.00",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          },
          "availability": "https://schema.org/InStock",
          "url": "https://pukadigital.com/productos",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "27"
        }
      },
      // Product 2: Chatbot IA
      {
        "@type": "Product",
        "@id": "https://pukadigital.com/productos#chatbot-ia",
        "name": "Chatbot IA con WhatsApp Business",
        "description": "Asistente virtual con GPT-4 integrado a WhatsApp. Base de conocimiento personalizada, respuestas automáticas 24/7, calificación de leads.",
        "brand": {
          "@type": "Brand",
          "name": "PukaDigital"
        },
        "offers": {
          "@type": "Offer",
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20.00",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          },
          "availability": "https://schema.org/InStock",
          "url": "https://pukadigital.com/productos",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "34"
        }
      },
      // Product 3: ERP Cloud
      {
        "@type": "Product",
        "@id": "https://pukadigital.com/productos#erp-cloud",
        "name": "Sistema ERP Cloud para PYMEs",
        "description": "ERP completo en la nube: gestión de inventario, CRM, facturación electrónica SRI, reportes en tiempo real. Basado en ODOO.",
        "brand": {
          "@type": "Brand",
          "name": "PukaDigital"
        },
        "offers": {
          "@type": "Offer",
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20.00",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          },
          "availability": "https://schema.org/InStock",
          "url": "https://pukadigital.com/productos",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "reviewCount": "19"
        }
      }
    ]
  };

  return (
    <div className="pt-12 pb-24">
      <SEO
        title="Precios Transparentes | Chatbots IA, Web y ERP"
        description="Sin costos ocultos. Chatbots con IA desde $20/mes, Sistemas ERP y Webs autoadministrables. Paga solo por lo que usas, cuando lo necesitas."
        keywords="precio chatbot ia ecuador, cuanto cuesta pagina web ecuador, tarifas agencia digital quito, planes mantenimiento web"
        structuredData={structuredData}
      />

      <div className="container mx-auto px-4 md:px-6">

        {/* HERO SECTION OPTIMIZED */}
        <div className="max-w-4xl mx-auto text-center mb-20 bg-puka-black text-white p-12 rounded-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-puka-red/10 blur-[100px] -z-10"></div>
          <div className="relative z-10">
            <h1 className="font-display font-bold text-4xl md:text-6xl mb-6 tracking-tight">
              {t('products.hero_h1')}
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('products.hero_desc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => handleWhatsAppClick('products_hero_primary', 'Hola, ¿qué módulo necesito para mi negocio?')}
                className="bg-[#25D366] text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-[#20bd5c] transition-colors flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <WhatsAppIcon size={24} className="fill-current" />
                {t('products.cta_wa')}
              </button>
              <Link
                href="/demos"
                className="bg-white text-puka-black border-2 border-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
              >
                {t('products.cta_demos')}
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-bold text-puka-red uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t('products.indicator_trial')}
            </div>
          </div>
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
              <h2 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">{t('products.web_title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('products.web_desc')}
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0" /> {t('products.web_feat_1')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0" /> {t('products.web_feat_2')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0" /> {t('products.web_feat_3')}
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
              <h2 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">{t('products.erp_title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {t('products.erp_desc')}
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0" /> {t('products.erp_feat_1')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0" /> {t('products.erp_feat_2')}
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-400 font-medium">
                  <Check size={18} className="text-green-600 shrink-0" /> {t('products.erp_feat_3')}
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
                onClick={() => handleModuleClick(
                  plan.id === 'cms' ? 'CMS, Mapas & SEO' : plan.id === 'erp' ? 'ERP Cloud' : 'Chatbot IA',
                  (idx + 1) as 1 | 2 | 3
                )}
                className={`border p-8 rounded-sm relative flex flex-col transition-all duration-300 cursor-pointer ${plan.highlighted
                  ? 'border-puka-red bg-white dark:bg-gray-800 shadow-xl scale-105 z-10'
                  : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-puka-red text-white text-xs font-bold uppercase py-1 px-3 rounded-sm shadow-sm">
                    {t('products.plan_2_badge')}
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2 text-puka-black dark:text-white">{plan.name}</h3>
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
                <button
                  onClick={() => handleWhatsAppClick(
                    `product_${plan.id}`,
                    `Hola, quiero el módulo de ${plan.name} ($20/mes)`
                  )}
                  className={`w-full py-3 rounded-sm font-bold text-center transition-colors flex items-center justify-center gap-2 ${plan.highlighted
                    ? 'bg-[#25D366] text-white hover:bg-[#20bd5c]'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-puka-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <WhatsAppIcon size={18} />
                  {plan.cta}
                </button>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tier 1 */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-puka-red transition-all group">
                    <span className="text-puka-red font-bold text-xs uppercase tracking-widest mb-2 block">Nivel 1</span>
                    <h3 className="font-bold text-xl mb-1 text-white">{t('products.chatbot_tier_1')}</h3>
                    <p className="text-xs text-gray-400 mb-4">{t('products.chatbot_tier_1_desc')}</p>
                    <div className="text-2xl font-bold text-white mb-4">
                      $20<span className="text-xs text-gray-400 font-normal">/mes</span>
                    </div>
                    <ul className="text-[10px] space-y-1 text-gray-500">
                      <li>• Hasta 500 hilos/mes</li>
                      <li>• Base de datos propia</li>
                    </ul>
                  </div>

                  {/* Tier 2 */}
                  <div className="bg-white/10 border-2 border-puka-red/50 p-6 rounded-sm scale-105 shadow-2xl z-10">
                    <span className="bg-puka-red text-white font-bold text-[8px] px-2 py-0.5 uppercase tracking-widest mb-2 inline-block">Más Popular</span>
                    <h3 className="font-bold text-xl mb-1 text-white">{t('products.chatbot_tier_2')}</h3>
                    <p className="text-xs text-gray-400 mb-4">{t('products.chatbot_tier_2_desc')}</p>
                    <div className="text-2xl font-bold text-white mb-4">
                      $50<span className="text-xs text-gray-400 font-normal">/mes</span>
                    </div>
                    <ul className="text-[10px] space-y-1 text-gray-200">
                      <li>• Hasta 2,000 hilos/mes</li>
                      <li>• Entrenamiento avanzado</li>
                    </ul>
                  </div>

                  {/* Tier 3 */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-puka-red transition-all">
                    <span className="text-puka-red font-bold text-xs uppercase tracking-widest mb-2 block">Nivel 3</span>
                    <h3 className="font-bold text-xl mb-1 text-white">{t('products.chatbot_tier_3')}</h3>
                    <p className="text-xs text-gray-400 mb-4">{t('products.chatbot_tier_3_desc')}</p>
                    <div className="text-2xl font-bold text-white mb-4">
                      $150+<span className="text-xs text-gray-400 font-normal">/mes</span>
                    </div>
                    <ul className="text-[10px] space-y-1 text-gray-500">
                      <li>• Hilos ilimitados</li>
                      <li>• Soporte prioritario</li>
                    </ul>
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

        {/* INTERNAL LINKING: LANDING PAGES POR SERVICIO */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-sm p-8 md:p-12 border border-blue-200 dark:border-blue-800 transition-colors">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-center text-puka-black dark:text-white">
              Explora Cada Servicio en Detalle
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 text-lg">
              Landing pages especializadas con casos de éxito, calculadoras ROI y preguntas frecuentes específicas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Chatbot IA Landing Page */}
              <Link
                href="/chatbot-ia-whatsapp"
                className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-8 rounded-sm border-2 border-purple-200 dark:border-purple-700 hover:border-purple-500 hover:shadow-2xl transition-all"
              >
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Bot className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-puka-black dark:text-white group-hover:text-purple-600 transition-colors">
                  Chatbot IA WhatsApp
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  Automatiza consultas repetitivas. Caso real: PodoclinicEC automatizó servicios a domicilio con 53 conversiones/mes.
                </p>
                <div className="flex items-center gap-2 text-purple-600 font-bold group-hover:gap-4 transition-all">
                  Ver más detalles <ArrowRight size={18} />
                </div>
              </Link>

              {/* Desarrollo Web Landing Page */}
              <Link
                href="/desarrollo-web-pymes"
                className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-8 rounded-sm border-2 border-blue-200 dark:border-blue-700 hover:border-blue-500 hover:shadow-2xl transition-all"
              >
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-puka-black dark:text-white group-hover:text-blue-600 transition-colors">
                  Desarrollo Web PYMEs
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  Webs autogestionables con Next.js. Velocidad 5x superior a WordPress. Desde $20/mes hosting incluido.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                  Ver más detalles <ArrowRight size={18} />
                </div>
              </Link>

              {/* Sistema Inventario Landing Page */}
              <Link
                href="/sistema-inventario"
                className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-8 rounded-sm border-2 border-green-200 dark:border-green-700 hover:border-green-500 hover:shadow-2xl transition-all"
              >
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-puka-black dark:text-white group-hover:text-green-600 transition-colors">
                  LedgerXpertz: Inventario
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  Di adiós a Excel. Inventario + CRM + Facturación SRI. Ferretería Los Andes eliminó 15h semanales de trabajo manual.
                </p>
                <div className="flex items-center gap-2 text-green-600 font-bold group-hover:gap-4 transition-all">
                  Ver más detalles <ArrowRight size={18} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* SPECIALIZED SYSTEMS (BETA) */}
        <section className="py-24 bg-puka-black text-white relative overflow-hidden rounded-sm mt-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-puka-red/20 blur-[120px]"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="bg-puka-red text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest inline-block mb-6">Beta Cerrada</div>
                <h2 className="font-display font-bold text-4xl mb-6">{t('products.specialized_title')}</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {t('products.specialized_desc')}
                </p>
                <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-puka-red transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-puka-red/20 p-3 rounded-sm">
                      <Calendar style={{ color: '#c7171e' }} size={24} />
                    </div>
                    <h3 className="font-bold text-xl">{t('products.medical_title')}</h3>
                  </div>
                  <p className="text-gray-400 mb-6">
                    {t('products.medical_desc')}
                  </p>
                  <Link href="/contacto" className="text-puka-red font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Postular como Early Adopter <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div className="flex-1 bg-white/5 p-8 rounded-sm border border-white/10 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-puka-red/5 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-puka-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <TrendingUp className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 italic">Alianzas Estratégicas</h3>
                  <p className="text-gray-300 mb-6">
                    No solo vendemos software. Construimos activos digitales con nuestros graduados. Si tienes un problema específico, lo resolvemos juntos.
                  </p>
                  <div className="inline-block px-4 py-2 border border-puka-red text-puka-red text-xs font-bold uppercase tracking-widest">
                    Solo para Graduados
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG RESOURCES */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-sm p-8 md:p-12 border border-gray-200 dark:border-gray-800 transition-colors mt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4 text-center text-puka-black dark:text-white">
              Recursos Gratuitos del Blog
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Guías completas para entender costos, casos de éxito y señales de que necesitas transformación digital.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Link to pricing blog post */}
              <Link
                href="/blog/local-12"
                className="group bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-lg transition-all"
              >
                <div className="bg-puka-beige dark:bg-puka-red/20 w-12 h-12 rounded-sm flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  Comparativa de Precios
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  ¿Cuánto cuesta realmente una web en Ecuador? Agencia vs PukaDigital.
                </p>
                <span className="text-puka-red text-sm font-bold inline-flex items-center gap-1">
                  Leer análisis completo →
                </span>
              </Link>

              {/* Link to chatbot signals post */}
              <Link
                href="/blog/5-senales-pyme-necesita-chatbot-ia"
                className="group bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-lg transition-all"
              >
                <div className="bg-puka-beige dark:bg-puka-red/20 w-12 h-12 rounded-sm flex items-center justify-center mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  ¿Necesitas un Chatbot?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  5 señales claras de que tu PYME necesita automatización con IA.
                </p>
                <span className="text-puka-red text-sm font-bold inline-flex items-center gap-1">
                  Ver las señales →
                </span>
              </Link>

              {/* Link to success case */}
              <Link
                href="/blog/caso-exito-podoclinicec-independencia-digital"
                className="group bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-lg transition-all"
              >
                <div className="bg-puka-beige dark:bg-puka-red/20 w-12 h-12 rounded-sm flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  Caso de Éxito Real
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Cómo PodoclinicEC logró 53 conversiones mensuales con independencia digital.
                </p>
                <span className="text-puka-red text-sm font-bold inline-flex items-center gap-1">
                  Leer historia completa →
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* STICKY WHATSAPP BAR (MOBILE) */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-50 md:hidden flex justify-center">
        <button
          onClick={() => handleWhatsAppClick('sticky_products_bar', 'Hola, me gustaría configurar mi paquete personalizado ($20-60/mes)')}
          className="bg-[#25D366] text-white w-full py-3 rounded-full font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <WhatsAppIcon size={24} />
          Configura tu paquete por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Products;