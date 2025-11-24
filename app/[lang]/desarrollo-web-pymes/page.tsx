'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Zap, TrendingUp, Smartphone, Code, CheckCircle, ArrowRight, Search, Palette, ShieldCheck } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

export default function DesarrolloWebPage() {
  const { t } = useTranslation();
  const [visitasMensuales, setVisitasMensuales] = useState(500);
  const [tasaConversion, setTasaConversion] = useState(2);

  // Cálculo ROI específico para web
  const leadsMensuales = Math.round((visitasMensuales * tasaConversion) / 100);
  const ventasEstimadas = Math.round(leadsMensuales * 0.25); // 25% conversion lead->venta
  const ticketPromedio = 50; // USD promedio Ecuador
  const ingresoMensual = ventasEstimadas * ticketPromedio;
  const roi = ((ingresoMensual - 20) / 20) * 100;

  // Structured Data - Product + Service + FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": "https://pukadigital.com/desarrollo-web-pymes#breadcrumb",
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
            "name": "Servicios",
            "item": "https://pukadigital.com/productos"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Desarrollo Web PYMEs",
            "item": "https://pukadigital.com/desarrollo-web-pymes"
          }
        ]
      },
      // Product Schema
      {
        "@type": "Product",
        "@id": "https://pukadigital.com/desarrollo-web-pymes#product",
        "name": "Desarrollo Web Profesional para PYMEs - PukaDigital",
        "description": "Páginas web autogestionables con Next.js. SEO automático, hosting optimizado, editor visual sin código. Desde $20/mes con capacitación incluida. Ideal para PYMEs en Ecuador.",
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
          "url": "https://pukadigital.com/desarrollo-web-pymes",
          "priceValidUntil": "2025-12-31",
          "seller": {
            "@id": "https://pukadigital.com/#organization"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "27",
          "bestRating": "5",
          "worstRating": "1"
        },
        "image": "https://pukadigital.com/assets/web-preview.jpg",
        "category": "Desarrollo Web"
      },
      // Service Schema
      {
        "@type": "Service",
        "@id": "https://pukadigital.com/desarrollo-web-pymes#service",
        "serviceType": "Web Development & Training",
        "name": "Desarrollo Web + Capacitación Autogestionable",
        "description": "Creamos tu web profesional con Next.js y te enseñamos a editarla sin depender de programadores. SEO, velocidad y diseño responsive incluidos.",
        "provider": {
          "@id": "https://pukadigital.com/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Ecuador"
        },
        "offers": {
          "@type": "Offer",
          "price": "300",
          "priceCurrency": "USD",
          "description": "Setup inicial incluido en Programa de 3 Meses. Hosting $20/mes después."
        }
      },
      // FAQPage específico de Desarrollo Web
      {
        "@type": "FAQPage",
        "@id": "https://pukadigital.com/desarrollo-web-pymes#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuánto cuesta realmente una página web profesional en Ecuador?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Agencias tradicionales cobran entre $800-$5000 por diseño inicial + $100-$300 mensuales por mantenimiento. En PukaDigital, el desarrollo está incluido en el Programa de 3 Meses ($300/mes) y después pagas solo $20/mes por hosting + CMS. Total primer año: $900 (programa) + $180 (9 meses × $20) = $1080. Sin renovaciones anuales ni costos de actualización."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué diferencia hay entre una web en WordPress y una en Next.js?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "WordPress: requiere hosting especializado ($30-80/mes), plugins de pago para funciones básicas, vulnerable a hackeos sin mantenimiento constante, lento en móviles. Next.js: velocidad 5x superior, SEO automático, hosting gratuito en Vercel, seguridad por defecto, escalable sin límites. Next.js es la tecnología que usan Netflix, TikTok y Nike. WordPress es del 2003."
            }
          },
          {
            "@type": "Question",
            "name": "¿Podré editar mi web yo mismo o necesito contratar cada cambio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ese es nuestro diferencial. Te capacitamos para que edites TODO: textos, imágenes, precios, secciones, colores. Panel visual intuitivo sin necesidad de programar. Cambios en vivo en segundos. Agencias tradicionales te cobran $50-150 por cada modificación porque quieren dependencia eterna. Nosotros te damos INDEPENDENCIA total."
            }
          },
          {
            "@type": "Question",
            "name": "¿Mi web aparecerá en Google? ¿Incluye SEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SÍ. Implementamos SEO técnico desde día 1: meta descriptions optimizados, Schema.org para rich snippets, sitemap automático, velocidad PageSpeed 90+, mobile-first, SSL incluido. Además te enseñamos SEO de contenido: cómo escribir títulos que rankeen, usar keywords correctamente, crear blog posts estratégicos. El SEO no es un 'extra', es base del desarrollo."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuánto tiempo toma tener mi web en línea?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En el Programa de 3 Meses: MES 1 completo dedicado a tu web. Semana 1: wireframes y contenido. Semana 2: diseño y desarrollo. Semana 3: pruebas y optimización. Semana 4: capacitación y lanzamiento. Tu web está LIVE antes del día 30. Incluye dominio, SSL, hosting, analíticas y 4 revisiones de diseño."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué pasa si mi negocio crece y necesito agregar funcionalidades?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Next.js escala sin límites. Casos reales: empezamos con web básica (5 páginas) y agregamos: tienda online, sistema de reservas, membresías, blog multiautor, integraciones con ERP. Todo sin migrar de plataforma. Y como TÚ gestionas el código (te lo enseñamos), puedes contratar cualquier desarrollador freelance sin estar atado a nosotros. Eso es verdadera independencia."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen transition-colors">
      <SEO 
        title="Desarrollo Web para PYMEs Ecuador | Páginas Autogestionables desde $20/mes"
        description="Webs profesionales con Next.js: rápidas, SEO optimizado, editor visual sin código. Aprende a gestionar tu sitio sin depender de programadores. Casos de éxito en Quito y Ecuador."
        keywords="desarrollo web ecuador, cuanto cuesta pagina web ecuador, diseño web quito, paginas web pymes, desarrollo web next.js, web autogestionable"
        structuredData={structuredData}
      />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-900 via-cyan-800 to-puka-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-600/30 backdrop-blur px-4 py-2 rounded-full mb-6 border border-cyan-400/30">
              <Zap size={16} className="text-yellow-300" />
              <span className="text-sm font-semibold">Tecnología Next.js - Usada por Netflix y TikTok</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight">
              Páginas Web que<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Tú Puedes Editar
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Sin depender de programadores. Sin costos ocultos. Te enseñamos a gestionar tu presencia digital 
              con la misma tecnología de empresas Fortune 500.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/contacto"
                className="bg-puka-red hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold text-lg shadow-2xl transition-all flex items-center gap-2"
              >
                Empezar Mi Web <ArrowRight size={20} />
              </Link>
              <Link 
                href="/demos"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-sm font-bold text-lg border border-white/30 transition-all flex items-center gap-2"
              >
                <Globe size={20} /> Ver Casos de Éxito
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-cyan-300">100%</div>
                <div className="text-sm text-cyan-200">Autogestionable</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-cyan-300">90+</div>
                <div className="text-sm text-cyan-200">PageSpeed Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-cyan-300">30d</div>
                <div className="text-sm text-cyan-200">De dev a LIVE</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-cyan-300">$20</div>
                <div className="text-sm text-cyan-200">Hosting/mes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULADORA ROI */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-sm shadow-lg">
            <h2 className="font-display font-bold text-3xl mb-6 text-center text-puka-black dark:text-white">
              Calcula el ROI de Tu Nueva Web
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Visitas mensuales esperadas:
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="100"
                  value={visitasMensuales}
                  onChange={(e) => setVisitasMensuales(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-right text-2xl font-bold text-blue-600 mt-2">{visitasMensuales}</div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Tasa de conversión a lead (%):
                </label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10" 
                  step="0.5"
                  value={tasaConversion}
                  onChange={(e) => setTasaConversion(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-right text-2xl font-bold text-blue-600 mt-2">{tasaConversion}%</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-cyan-700 text-white p-8 rounded-sm">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center border-r border-white/20 last:border-0">
                  <div className="text-sm opacity-90 mb-1">Leads Mensuales</div>
                  <div className="text-3xl font-bold">{leadsMensuales}</div>
                </div>
                <div className="text-center border-r border-white/20 last:border-0">
                  <div className="text-sm opacity-90 mb-1">Ventas Estimadas</div>
                  <div className="text-3xl font-bold">{ventasEstimadas}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-1">Ingreso Mensual</div>
                  <div className="text-3xl font-bold">${ingresoMensual}</div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="text-center">
                  <div className="text-sm mb-2">ROI vs Hosting ($20/mes)</div>
                  <div className="text-4xl font-bold text-green-300">+{roi.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
              * Cálculo conservador: ticket promedio $50, conversión lead→venta 25%. Ajusta según tu industria.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARACIÓN: NOSOTROS VS AGENCIAS */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              PukaDigital vs Agencias Tradicionales
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th className="p-4 text-left font-bold text-gray-700 dark:text-gray-300">Aspecto</th>
                    <th className="p-4 text-center font-bold text-blue-600">PukaDigital</th>
                    <th className="p-4 text-center font-bold text-gray-500">Agencias Tradicionales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Costo inicial desarrollo</td>
                    <td className="p-4 text-center text-green-600 font-bold">$300/mes × 3 meses</td>
                    <td className="p-4 text-center text-red-600 font-bold">$800 - $5,000</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Hosting mensual</td>
                    <td className="p-4 text-center text-green-600 font-bold">$20</td>
                    <td className="p-4 text-center text-red-600 font-bold">$30 - $80</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Mantenimiento/mes</td>
                    <td className="p-4 text-center text-green-600 font-bold">$0 (tú lo haces)</td>
                    <td className="p-4 text-center text-red-600 font-bold">$100 - $300</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Costo por cambio de texto/imagen</td>
                    <td className="p-4 text-center text-green-600 font-bold">$0 (panel visual)</td>
                    <td className="p-4 text-center text-red-600 font-bold">$50 - $150</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">SEO incluido</td>
                    <td className="p-4 text-center"><CheckCircle className="text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">Paquete aparte ($200+)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Capacitación autogestionable</td>
                    <td className="p-4 text-center"><CheckCircle className="text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">No (dependencia eterna)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Velocidad PageSpeed</td>
                    <td className="p-4 text-center text-green-600 font-bold">90 - 100</td>
                    <td className="p-4 text-center text-yellow-600 font-bold">40 - 70 (WordPress)</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                    <td className="p-4 text-gray-900 dark:text-white">TOTAL PRIMER AÑO</td>
                    <td className="p-4 text-center text-green-600 text-xl">$1,080</td>
                    <td className="p-4 text-center text-red-600 text-xl">$3,500 - $9,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-lg">
              <strong className="text-blue-600">Ahorro promedio primer año: $2,420 - $7,920</strong>
            </p>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS TÉCNICAS */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Tecnología de Punta para Tu Negocio
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Zap className="text-blue-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Next.js Framework</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  La tecnología que usan Netflix, Uber, TikTok. Velocidad extrema, SEO perfecto, escalabilidad ilimitada.
                </p>
                <div className="text-sm text-blue-600 font-medium">5x más rápido que WordPress</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-green-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">SEO Automático</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Schema.org, meta tags optimizados, sitemap, robots.txt, Open Graph. Todo configurado desde día 1.
                </p>
                <div className="text-sm text-green-600 font-medium">Rankea más rápido en Google</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="text-purple-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Mobile-First Design</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  70% del tráfico en Ecuador es móvil. Tu web se adapta perfecto a cualquier pantalla.
                </p>
                <div className="text-sm text-purple-600 font-medium">Responsive por defecto</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Code className="text-red-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Editor Visual</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Edita textos, imágenes, colores sin tocar código. Cambios en vivo. Panel intuitivo tipo Canva.
                </p>
                <div className="text-sm text-red-600 font-medium">Zero conocimiento técnico</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="text-yellow-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Seguridad SSL</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Certificado SSL gratis de por vida. HTTPS automático. Backups diarios. 99.9% uptime.
                </p>
                <div className="text-sm text-yellow-600 font-medium">Protección garantizada</div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="text-cyan-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Analíticas Integradas</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Google Analytics 4, heatmaps, conversiones. Entiende qué funciona y qué mejorar.
                </p>
                <div className="text-sm text-cyan-600 font-medium">Decisiones basadas en datos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO 30 DÍAS */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Tu Web LIVE en 30 Días
            </h2>

            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 text-puka-black dark:text-white">Semana 1: Estrategia y Contenido</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Reunión kick-off, wireframes de estructura, definición de páginas clave, redacción SEO, selección de paleta de colores y tipografías.
                  </p>
                  <div className="mt-2 text-sm text-blue-600 font-medium">Entregable: Wireframes aprobados + contenido listo</div>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 text-puka-black dark:text-white">Semana 2: Diseño y Desarrollo</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Diseño visual en Figma, desarrollo en Next.js, integración de componentes, optimización de imágenes, configuración de dominio.
                  </p>
                  <div className="mt-2 text-sm text-blue-600 font-medium">Entregable: Versión beta en staging para revisión</div>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 text-puka-black dark:text-white">Semana 3: Optimización y Pruebas</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Ajustes de diseño, pruebas mobile, optimización SEO on-page, configuración Google Analytics, pruebas de velocidad, formularios de contacto.
                  </p>
                  <div className="mt-2 text-sm text-blue-600 font-medium">Entregable: Web 100% funcional pre-lanzamiento</div>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 text-puka-black dark:text-white">Semana 4: Capacitación y Lanzamiento</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Sesión de capacitación (2 horas), configuración de panel de edición, documentación en video, lanzamiento oficial, indexación en Google.
                  </p>
                  <div className="mt-2 text-sm text-green-600 font-medium">🎉 Tu web LIVE y tú gestionándola de forma autónoma</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl mb-4 text-puka-black dark:text-white">Inversión Transparente</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Todo incluido. Sin letra chica.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Programa 3 Meses */}
              <div className="border-2 border-blue-600 rounded-sm p-8 relative bg-white dark:bg-gray-800">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  RECOMENDADO
                </div>
                <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">Programa 3 Meses</h3>
                <div className="text-4xl font-bold mb-4 text-blue-600">$300<span className="text-lg text-gray-500">/mes</span></div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 1: Tu web profesional completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 2: Chatbot IA WhatsApp integrado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 3: Sistema ERP cloud completo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Capacitación total para autonomía</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">$100/mes en Google Ads (3 meses)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Después: $60/mes los 3 módulos</span>
                  </li>
                </ul>

                <Link 
                  href="/contacto"
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-sm font-bold transition-all"
                >
                  Empezar Programa Completo
                </Link>
              </div>

              {/* Solo Web */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-sm p-8 bg-white dark:bg-gray-800">
                <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">Solo Desarrollo Web</h3>
                <div className="text-4xl font-bold mb-4 text-puka-black dark:text-white">$20<span className="text-lg text-gray-500">/mes</span></div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Hosting Next.js en Vercel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Editor visual CMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">SSL + Dominio incluido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Soporte técnico básico</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <CheckCircle className="text-gray-400 shrink-0 mt-1" size={18} />
                    <span className="text-gray-400 line-through">Desarrollo inicial: +$800</span>
                  </li>
                </ul>

                <Link 
                  href="/contacto"
                  className="block text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-puka-black dark:text-white py-3 rounded-sm font-bold transition-all"
                >
                  Consultar Desarrollo
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">*Si ya tienes web y solo necesitas hosting</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-sm mt-8 border border-blue-200 dark:border-blue-800">
              <p className="text-center text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600">Incluye GRATIS:</strong> Dominio .com (primer año), SSL, backups automáticos, 
                Google Analytics, 4 revisiones de diseño, capacitación en vivo y documentación en video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Cuánto cuesta realmente una página web profesional en Ecuador?
                  <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  Agencias tradicionales cobran entre $800-$5000 por diseño inicial + $100-$300 mensuales por mantenimiento. En PukaDigital, 
                  el desarrollo está incluido en el Programa de 3 Meses ($300/mes) y después pagas solo $20/mes por hosting + CMS. 
                  Total primer año: $900 (programa) + $180 (9 meses × $20) = $1080. Sin renovaciones anuales ni costos de actualización.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Qué diferencia hay entre una web en WordPress y una en Next.js?
                  <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  WordPress: requiere hosting especializado ($30-80/mes), plugins de pago para funciones básicas, vulnerable a hackeos sin mantenimiento constante, 
                  lento en móviles. Next.js: velocidad 5x superior, SEO automático, hosting gratuito en Vercel, seguridad por defecto, escalable sin límites. 
                  Next.js es la tecnología que usan Netflix, TikTok y Nike. WordPress es del 2003.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Podré editar mi web yo mismo o necesito contratar cada cambio?
                  <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  Ese es nuestro diferencial. Te capacitamos para que edites TODO: textos, imágenes, precios, secciones, colores. Panel visual intuitivo sin 
                  necesidad de programar. Cambios en vivo en segundos. Agencias tradicionales te cobran $50-150 por cada modificación porque quieren dependencia 
                  eterna. Nosotros te damos INDEPENDENCIA total.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Mi web aparecerá en Google? ¿Incluye SEO?
                  <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  SÍ. Implementamos SEO técnico desde día 1: meta descriptions optimizados, Schema.org para rich snippets, sitemap automático, 
                  velocidad PageSpeed 90+, mobile-first, SSL incluido. Además te enseñamos SEO de contenido: cómo escribir títulos que rankeen, 
                  usar keywords correctamente, crear blog posts estratégicos. El SEO no es un 'extra', es base del desarrollo.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-cyan-800 to-puka-black text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Tu Web Profesional en 30 Días
            </h2>
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
              Agenda una videollamada de 30 minutos. Analizamos tu negocio, definimos estrategia y empezamos tu MES 1.
            </p>
            <Link 
              href="/contacto"
              className="inline-block bg-puka-red hover:bg-red-700 text-white px-10 py-5 rounded-sm font-bold text-lg shadow-2xl transition-all"
            >
              Agendar Llamada Gratuita
            </Link>
            <p className="text-sm text-cyan-200 mt-4">
              Sin compromiso • Respuesta en 2 horas • Cupos limitados
            </p>
          </div>
        </div>
      </section>

      {/* RECURSOS RELACIONADOS */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl mb-8 text-puka-black dark:text-white">
              Recursos Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/local-12" className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-sm border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-blue-600">
                  ¿Cuánto Cuesta Realmente una Página Web en Ecuador?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comparativa completa: agencias, freelancers y PukaDigital. Precios reales 2024.
                </p>
              </Link>

              <Link href="/chatbot-ia-whatsapp" className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-sm border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-purple-600">
                  Chatbot IA WhatsApp
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complementa tu web con atención automatizada 24/7. Desde $20/mes.
                </p>
              </Link>

              <Link href="/sistema-erp-cloud" className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-sm border border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-green-600">
                  Sistema ERP Cloud
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona inventario, CRM y facturación desde la nube. Ecosistema completo.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
