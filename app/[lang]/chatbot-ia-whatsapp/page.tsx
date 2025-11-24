'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, MessageCircle, Zap, Clock, TrendingUp, CheckCircle, ArrowRight, Sparkles, BarChart3, Users, Shield } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

export default function ChatbotIAPage() {
  const { t } = useTranslation();
  const [mensajesPorDia, setMensajesPorDia] = useState(50);
  const [tiempoRespuesta, setTiempoRespuesta] = useState(5);

  // Cálculo ROI específico para chatbot
  const ahorroMensual = (mensajesPorDia * 30 * tiempoRespuesta * 3) / 60; // horas ahorradas
  const costoHoraEmpleado = 3; // USD promedio Ecuador
  const ahorroUSD = ahorroMensual * costoHoraEmpleado;
  const roi = ((ahorroUSD - 20) / 20) * 100;

  // Structured Data - Product + Service + FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": "https://pukadigital.com/chatbot-ia-whatsapp#breadcrumb",
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
            "name": "Chatbot IA WhatsApp",
            "item": "https://pukadigital.com/chatbot-ia-whatsapp"
          }
        ]
      },
      // Product Schema
      {
        "@type": "Product",
        "@id": "https://pukadigital.com/chatbot-ia-whatsapp#product",
        "name": "Chatbot IA con WhatsApp Business - PukaDigital",
        "description": "Asistente virtual inteligente con GPT-4 integrado a WhatsApp Business. Automatiza atención al cliente 24/7, califica leads y libera tiempo de tu equipo. Desde $20/mes para PYMEs en Ecuador.",
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
          "url": "https://pukadigital.com/chatbot-ia-whatsapp",
          "priceValidUntil": "2025-12-31",
          "seller": {
            "@id": "https://pukadigital.com/#organization"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "34",
          "bestRating": "5",
          "worstRating": "1"
        },
        "image": "https://pukadigital.com/assets/chatbot-preview.jpg",
        "category": "Software de Automatización"
      },
      // Service Schema
      {
        "@type": "Service",
        "@id": "https://pukadigital.com/chatbot-ia-whatsapp#service",
        "serviceType": "AI Chatbot Integration",
        "name": "Implementación y Capacitación Chatbot IA WhatsApp",
        "description": "Servicio completo de implementación de chatbot con inteligencia artificial: configuración técnica, entrenamiento con datos de tu negocio, integración WhatsApp Business API y capacitación para gestión autónoma.",
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
          "description": "Setup inicial incluido en Programa de 3 Meses. Mantenimiento $20/mes."
        }
      },
      // FAQPage específico de Chatbot
      {
        "@type": "FAQPage",
        "@id": "https://pukadigital.com/chatbot-ia-whatsapp#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuánto cuesta implementar un chatbot con IA en WhatsApp para mi negocio en Ecuador?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La implementación inicial está incluida en nuestro Programa de 3 Meses ($300/mes). El mantenimiento mensual del chatbot es de $20/mes, que incluye: servidor 24/7, actualizaciones de IA, soporte técnico y hasta 5000 mensajes mensuales. No hay costos ocultos de setup ni licencias anuales."
            }
          },
          {
            "@type": "Question",
            "name": "¿El chatbot puede realmente reemplazar a un empleado de atención al cliente?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El chatbot NO reemplaza empleados, los POTENCIA. Automatiza el 60-80% de consultas repetitivas (horarios, precios, ubicación, disponibilidad) permitiendo que tu equipo se enfoque en ventas complejas y atención personalizada. Caso real: Café del Centro redujo tiempo de respuesta de 15min a 30seg, liberando 3 horas diarias del equipo."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué diferencia hay entre este chatbot IA y los chatbots básicos de WhatsApp Business?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "WhatsApp Business gratuito solo permite respuestas automáticas predefinidas (horarios, bienvenida). Nuestro chatbot usa GPT-4 para entender contexto, responder preguntas complejas, calificar leads según intención de compra y aprender de tu catálogo de productos. Es la diferencia entre un contestador automático y un asistente inteligente."
            }
          },
          {
            "@type": "Question",
            "name": "¿Necesito contratar WhatsApp Business API aparte?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NO. Los $20/mes incluyen TODO: WhatsApp Business API oficial, servidor cloud 24/7, modelo GPT-4, base de conocimiento personalizada y panel de control. No necesitas contratar Meta ni servicios adicionales. Setup completo llave en mano."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuánto tiempo toma implementar el chatbot en mi negocio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Implementación técnica: 3-5 días hábiles. Entrenamiento con datos de tu negocio: 1 semana. Capacitación para tu equipo: 2 sesiones de 2 horas. Total: 2-3 semanas desde contrato hasta chatbot operativo. En el Programa de 3 Meses, esto ocurre en el MES 2 mientras ya tienes tu web del MES 1 funcionando."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo entrenar al chatbot con información específica de mi negocio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SÍ, esa es la clave. Te capacitamos para cargar: catálogo de productos/precios, políticas de garantía, procesos de compra, horarios especiales, promociones. El chatbot aprende de PDFs, textos o incluso conversaciones previas. Tú controlas 100% qué información usa para responder. Actualizaciones ilimitadas sin costo."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen transition-colors">
      <SEO 
        title="Chatbot IA WhatsApp para PYMEs Ecuador | Desde $20/mes"
        description="Automatiza atención al cliente 24/7 con inteligencia artificial en WhatsApp. GPT-4, calificación de leads, respuestas inteligentes. Implementación en 2 semanas. Caso de éxito: 60% menos consultas repetitivas."
        keywords="chatbot whatsapp ecuador, asistente virtual pymes, chatbot ia quito, whatsapp business api, automatizacion atencion cliente, chatbot gpt-4"
        structuredData={structuredData}
      />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-puka-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-600/30 backdrop-blur px-4 py-2 rounded-full mb-6 border border-purple-400/30">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-semibold">Impulsado por GPT-4 de OpenAI</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight">
              Chatbot IA en WhatsApp<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Atiende clientes 24/7
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Automatiza el 60% de consultas repetitivas. Respuestas inteligentes en segundos. 
              Libera tiempo de tu equipo para cerrar ventas.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/contacto"
                className="bg-puka-red hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold text-lg shadow-2xl transition-all flex items-center gap-2"
              >
                Prueba Gratis 7 Días <ArrowRight size={20} />
              </Link>
              <Link 
                href="/demos"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-sm font-bold text-lg border border-white/30 transition-all flex items-center gap-2"
              >
                <Bot size={20} /> Ver Demo en Vivo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-purple-300">60%</div>
                <div className="text-sm text-purple-200">Menos consultas repetitivas</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-purple-300">24/7</div>
                <div className="text-sm text-purple-200">Disponibilidad total</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-purple-300">30s</div>
                <div className="text-sm text-purple-200">Tiempo de respuesta</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-purple-300">$20</div>
                <div className="text-sm text-purple-200">Por mes todo incluido</div>
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
              Calcula Cuánto Ahorrarías con el Chatbot
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Mensajes de WhatsApp por día:
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  value={mensajesPorDia}
                  onChange={(e) => setMensajesPorDia(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-purple-600"
                />
                <div className="text-right text-2xl font-bold text-purple-600 mt-2">{mensajesPorDia}</div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Minutos promedio por respuesta:
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={tiempoRespuesta}
                  onChange={(e) => setTiempoRespuesta(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-purple-600"
                />
                <div className="text-right text-2xl font-bold text-purple-600 mt-2">{tiempoRespuesta} min</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-700 text-white p-8 rounded-sm text-center">
              <div className="text-sm uppercase tracking-wider mb-2 opacity-90">Ahorro Mensual Estimado</div>
              <div className="text-5xl font-bold mb-2">${ahorroUSD.toFixed(0)}</div>
              <div className="text-lg mb-4">en tiempo de tu equipo</div>
              
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="text-sm mb-2">ROI del Chatbot ($20/mes)</div>
                <div className="text-3xl font-bold text-green-300">+{roi.toFixed(0)}%</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
              * Cálculo basado en costo promedio de $3/hora de empleado en Ecuador y automatización del 60% de consultas.
            </p>
          </div>
        </div>
      </section>

      {/* CASO DE ÉXITO */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-purple-600 font-bold uppercase text-sm tracking-wider">Caso de Éxito Real</span>
              <h2 className="font-display font-bold text-4xl mt-2 text-puka-black dark:text-white">
                Café del Centro: 40% Menos Tiempo en Atención
              </h2>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20 p-8 md:p-12 rounded-sm border border-purple-200 dark:border-purple-800">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="bg-purple-600 text-white inline-block px-4 py-2 rounded-sm font-bold mb-4">
                    Cafetería - Quito
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-puka-black dark:text-white">
                    "El chatbot responde horarios, menú y ubicación mientras nosotros atendemos mesas"
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Antes: 40+ mensajes diarios con preguntas repetitivas interrumpían el servicio presencial. 
                    Ahora: El chatbot filtra consultas básicas, agenda reservas y solo deriva casos que requieren atención humana.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 dark:text-gray-300"><strong>60% de mensajes</strong> automatizados (horarios, menú, delivery)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 dark:text-gray-300"><strong>3 horas diarias</strong> liberadas del equipo</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 dark:text-gray-300"><strong>ROI +450%</strong> en el primer mes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-xl">
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">Métricas Reales</div>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-600 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tiempo de respuesta promedio</div>
                      <div className="text-2xl font-bold text-puka-black dark:text-white">30 segundos</div>
                      <div className="text-xs text-green-600">Antes: 15 minutos</div>
                    </div>
                    
                    <div className="border-l-4 border-purple-600 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Consultas atendidas/mes</div>
                      <div className="text-2xl font-bold text-puka-black dark:text-white">1,200+</div>
                      <div className="text-xs text-green-600">Sin costo adicional de personal</div>
                    </div>
                    
                    <div className="border-l-4 border-purple-600 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Satisfacción de clientes</div>
                      <div className="text-2xl font-bold text-puka-black dark:text-white">4.8/5.0</div>
                      <div className="text-xs text-green-600">Respuestas instantáneas valoradas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Qué Incluye Tu Chatbot IA
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Bot className="text-purple-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Inteligencia Artificial GPT-4</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Entiende contexto, responde preguntas complejas y aprende de tu catálogo de productos. No solo keywords, verdadera comprensión.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="text-green-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">WhatsApp Business API</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Integración oficial con WhatsApp. Check verde verificado, respuestas automáticas y mensajes broadcast a segmentos.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Calificación de Leads</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Detecta intención de compra alta/media/baja. Prioriza conversaciones calientes para tu equipo de ventas.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-yellow-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Disponibilidad 24/7</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Nunca pierdas un lead por horario. Responde consultas a las 2am, domingos y feriados sin costo de turnos nocturnos.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="text-red-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Analíticas en Tiempo Real</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Dashboard con métricas: preguntas frecuentes, temas populares, tasa de derivación, horarios pico. Optimiza tu servicio.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-indigo-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Gestión Autónoma</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Tú controlas las respuestas. Actualiza información sin programar. Panel visual intuitivo. No dependes de nosotros para cambios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl mb-4 text-puka-black dark:text-white">Inversión Transparente</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Sin costos ocultos. Sin licencias anuales. Sin sorpresas.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Programa 3 Meses */}
              <div className="border-2 border-purple-600 rounded-sm p-8 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  MÁS ELEGIDO
                </div>
                <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">Programa 3 Meses</h3>
                <div className="text-4xl font-bold mb-4 text-purple-600">$300<span className="text-lg text-gray-500">/mes</span></div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 2: Implementación completa del chatbot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 1: Tu web profesional (ya lista)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 3: Sistema ERP cloud incluido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Capacitación para gestión autónoma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">$100/mes en Google Ads (3 meses)</span>
                  </li>
                </ul>

                <Link 
                  href="/contacto"
                  className="block text-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-sm font-bold transition-all"
                >
                  Empezar Programa Completo
                </Link>
              </div>

              {/* Solo Chatbot */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-sm p-8">
                <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">Solo Chatbot</h3>
                <div className="text-4xl font-bold mb-4 text-puka-black dark:text-white">$20<span className="text-lg text-gray-500">/mes</span></div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Chatbot IA + WhatsApp API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Hasta 5,000 mensajes/mes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Servidor 24/7 incluido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Soporte técnico estándar</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <CheckCircle className="text-gray-400 shrink-0 mt-1" size={18} />
                    <span className="text-gray-400 line-through">Setup inicial: +$150 único</span>
                  </li>
                </ul>

                <Link 
                  href="/contacto"
                  className="block text-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-puka-black dark:text-white py-3 rounded-sm font-bold transition-all"
                >
                  Consultar Disponibilidad
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">*Requiere setup inicial independiente</p>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-sm mt-8 border border-purple-200 dark:border-purple-800">
              <p className="text-center text-gray-700 dark:text-gray-300">
                <strong className="text-purple-600">Garantía de Satisfacción:</strong> Si en 30 días el chatbot no automatiza al menos el 40% de tus consultas, 
                te devolvemos el dinero completo. Sin preguntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <details className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Cuánto cuesta implementar un chatbot con IA en WhatsApp para mi negocio en Ecuador?
                  <span className="text-purple-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  La implementación inicial está incluida en nuestro Programa de 3 Meses ($300/mes). El mantenimiento mensual del chatbot es de $20/mes, 
                  que incluye: servidor 24/7, actualizaciones de IA, soporte técnico y hasta 5000 mensajes mensuales. No hay costos ocultos de setup ni licencias anuales.
                </p>
              </details>

              <details className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿El chatbot puede realmente reemplazar a un empleado de atención al cliente?
                  <span className="text-purple-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  El chatbot NO reemplaza empleados, los POTENCIA. Automatiza el 60-80% de consultas repetitivas (horarios, precios, ubicación, disponibilidad) 
                  permitiendo que tu equipo se enfoque en ventas complejas y atención personalizada. Caso real: Café del Centro redujo tiempo de respuesta de 15min a 30seg, 
                  liberando 3 horas diarias del equipo.
                </p>
              </details>

              <details className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Qué diferencia hay entre este chatbot IA y los chatbots básicos de WhatsApp Business?
                  <span className="text-purple-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  WhatsApp Business gratuito solo permite respuestas automáticas predefinidas (horarios, bienvenida). Nuestro chatbot usa GPT-4 para entender contexto, 
                  responder preguntas complejas, calificar leads según intención de compra y aprender de tu catálogo de productos. Es la diferencia entre un contestador 
                  automático y un asistente inteligente.
                </p>
              </details>

              <details className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Puedo entrenar al chatbot con información específica de mi negocio?
                  <span className="text-purple-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  SÍ, esa es la clave. Te capacitamos para cargar: catálogo de productos/precios, políticas de garantía, procesos de compra, horarios especiales, promociones. 
                  El chatbot aprende de PDFs, textos o incluso conversaciones previas. Tú controlas 100% qué información usa para responder. Actualizaciones ilimitadas sin costo.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-puka-black text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Prueba el Chatbot Gratis por 7 Días
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Sin tarjeta de crédito. Sin compromiso. Configúralo con tus datos reales y mide resultados antes de pagar.
            </p>
            <Link 
              href="/contacto"
              className="inline-block bg-puka-red hover:bg-red-700 text-white px-10 py-5 rounded-sm font-bold text-lg shadow-2xl transition-all"
            >
              Empezar Prueba Gratuita
            </Link>
            <p className="text-sm text-purple-200 mt-4">
              Respuesta en menos de 2 horas • Setup en 48 horas
            </p>
          </div>
        </div>
      </section>

      {/* RECURSOS RELACIONADOS */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl mb-8 text-puka-black dark:text-white">
              Aprende Más Sobre Chatbots IA
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/local-13" className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-sm border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-purple-600">
                  5 Señales de que Tu PYME Necesita un Chatbot IA
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detecta si tu negocio está listo para automatizar atención al cliente con inteligencia artificial.
                </p>
              </Link>

              <Link href="/blog/local-14" className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-sm border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-blue-600">
                  Caso de Éxito: Café del Centro
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cómo un chatbot liberó 3 horas diarias del equipo y mejoró la experiencia del cliente.
                </p>
              </Link>

              <Link href="/desarrollo-web-pymes" className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-sm border border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-green-600">
                  Desarrollo Web para PYMEs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complementa tu chatbot con una web profesional. Ecosistema digital completo.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
