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

  // Structured Data for FAQ - Comprehensive FAQ about Digital Independence Program
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://pukadigital.com/#faqpage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cuánto cuesta realmente una página web en Ecuador con PukaDigital?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El programa de 3 meses cuesta $300 mensuales ($900 total) e incluye: desarrollo web completo, chatbot IA, sistema ERP, capacitación intensiva y $100/mes en Google Ads. A diferencia de agencias tradicionales que cobran entre $800-$5000 solo por diseño, nosotros enseñamos a gestionar todo tu ecosistema digital con independencia total."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué incluye el programa de Independencia Digital de 3 meses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MES 1: Desarrollo web completo con Next.js, hosting en Vercel, dominio personalizado y SEO básico. MES 2: Chatbot IA conectado a WhatsApp con base de conocimiento personalizada y respuestas automáticas 24/7. MES 3: Sistema ERP cloud con gestión de inventario, CRM, facturación electrónica e integración con ODOO. Todo incluye capacitación para que gestiones tu tecnología sin dependencias."
        }
      },
      {
        "@type": "Question",
        "name": "¿Necesito conocimientos técnicos previos para el programa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No se requieren conocimientos técnicos previos. El programa está diseñado para dueños de PYMEs sin experiencia en programación. Enseñamos todo desde cero: editar tu sitio web, configurar respuestas del chatbot, gestionar inventario en el ERP, interpretar analíticas y administrar campañas de Google Ads. Al finalizar los 3 meses, tendrás autonomía total sobre tu infraestructura digital."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto cuesta mantener los servicios después del programa de 3 meses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Después del programa inicial, puedes elegir módulos según necesites: CMS + Hosting ($20/mes), Chatbot IA WhatsApp ($20/mes), Sistema ERP Cloud ($20/mes). Total máximo: $60 mensuales por los 3 módulos. Esto reemplaza costos típicos de: hosting ($15-50), mantenimiento web ($100-300), licencia CRM ($50-200) y soporte técnico ($150-400). Ahorras más del 80% mensual versus agencias tradicionales."
        }
      },
      {
        "@type": "Question",
        "name": "¿En qué se diferencia PukaDigital de otras agencias digitales en Ecuador?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La diferencia fundamental es nuestra filosofía de INDEPENDENCIA vs DEPENDENCIA. Agencias tradicionales: te cobran $2000-$5000 por diseño inicial, luego $200-$500 mensuales eternos por mantenimiento, actualizaciones y soporte. PukaDigital: invertimos 3 meses en educarte para gestionar TODO tú mismo. No queremos clientes cautivos, queremos emprendedores digitalmente autónomos. No construimos dependencia, construimos dignidad."
        }
      },
      {
        "@type": "Question",
        "name": "¿Funciona para cualquier tipo de negocio o solo para tech startups?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El programa está diseñado específicamente para PYMEs tradicionales: restaurantes, tiendas, consultorías, talleres mecánicos, salones de belleza, cafeterías, distribuidoras, etc. Ejemplos reales: Café del Centro (40% menos tiempo en atención), Ferretería Los Andes (inventario en tiempo real), Consultora Legal Mora (chatbot responde consultas básicas 24/7). Si tu negocio atiende clientes, vende productos o necesita organizar operaciones, este programa es para ti."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué pasa si no logro aprender en 3 meses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El programa incluye soporte extendido de 6 meses adicionales sin costo. Sesiones semanales de capacitación en vivo, acceso ilimitado a documentación en video, grupo privado de WhatsApp con respuesta en menos de 2 horas. Nuestro récord: 94% de clientes gestionan su web de forma autónoma al mes 2. Si después de 9 meses totales no logras autonomía, evaluamos caso por caso para garantizar tu éxito."
        }
      },
      {
        "@type": "Question",
        "name": "¿El chatbot IA realmente puede atender clientes como un humano?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El chatbot usa GPT-4 con base de conocimiento personalizada de tu negocio. Puede: responder preguntas frecuentes, dar información de productos/precios, agendar citas, calificar leads, derivar casos complejos a humanos. Limitaciones: no maneja quejas emocionales complejas ni negociaciones de alto valor. Caso real: Café del Centro redujo 60% de consultas repetitivas (horarios, ubicación, menú), liberando tiempo del equipo para atención presencial de calidad."
        }
      },
      {
        "@type": "Question",
        "name": "¿Puedo migrar mi web actual o debo empezar desde cero?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Analizamos tu sitio actual sin costo en la entrevista inicial. Si está en WordPress, Wix o similar, migramos contenido (textos, imágenes, estructura) manteniendo tu identidad visual. Si está en tecnología obsoleta o con código propietario de agencia, recomendamos reconstrucción con Next.js para garantizar que TÚ tengas control total del código. La migración está incluida en el programa sin costos extra."
        }
      },
      {
        "@type": "Question",
        "name": "¿Los $100/mes en Google Ads están incluidos para siempre?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Los $100 mensuales en Google Ads están incluidos SOLO durante el programa de 3 meses (total $300 en publicidad gratis). Esto permite probar campañas reales, aprender gestión de presupuesto y validar keywords rentables para tu negocio. Después del mes 3, decides si continúas invirtiendo en Ads (recomendado $150-300/mes) o te enfocas solo en tráfico orgánico SEO. Te enseñamos ambas estrategias para que elijas según tu ROI."
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
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-puka-black dark:text-white mb-4 transition-colors">
              {t('home.hero_h1')}
            </h1>
            <p className="font-display font-bold text-3xl md:text-5xl lg:text-7xl leading-[0.95] text-gray-700 dark:text-gray-300 mb-8 transition-colors">
              {t('home.hero_title_1')} <br />
              <span className="text-puka-red">{t('home.hero_title_2')}</span>
            </p>
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
              href="/blog/caso-exito-cafe-centro-independencia-digital"
              className="group bg-gray-50 dark:bg-gray-800 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-puka-red hover:shadow-xl transition-all"
            >
              <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <span className="text-6xl">📈</span>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-puka-red mb-2 uppercase tracking-wide">Caso de Éxito</div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                  Café del Centro: +205% en Ventas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  De pagar $450/mes a una agencia a gestionar todo ellos mismos en 90 días.
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