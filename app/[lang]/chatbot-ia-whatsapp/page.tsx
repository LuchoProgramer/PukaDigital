'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  MessageCircle,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Shield,
  Smartphone,
  AlertCircle
} from 'lucide-react';
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

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Chatbot IA con WhatsApp Business - PukaDigital",
        "description": "Asistente virtual inteligente con GPT-4 integrado a WhatsApp Business. Automatiza atención al cliente 24/7.",
        "offers": {
          "@type": "Offer",
          "price": "20",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white">
      <SEO
        title="Chatbot IA WhatsApp para PYMEs Ecuador | La Anti-Agencia"
        description="Automatiza atención al cliente 24/7 con IA real en WhatsApp. GPT-4, calificación de leads y respuestas inteligentes. Deja de perder ventas por no contestar a tiempo."
        keywords="chatbot whatsapp ecuador, asistente virtual ia, whatsapp business api, automatizacion pymes"
        structuredData={structuredData}
      />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-puka-red/5 -skew-x-12 transform origin-right"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-puka-black dark:bg-white text-white dark:text-puka-black px-4 py-1.5 rounded-sm mb-8 text-sm font-bold tracking-wider">
              <Sparkles size={16} className="text-puka-red" />
              IMPULSADO POR GPT-4 DE OPENAI
            </div>

            <h1 className="font-display font-bold text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tight text-puka-black dark:text-white">
              Tu WhatsApp Atiende<br />
              <span className="text-puka-red inline-block mt-2 underline decoration-4 underline-offset-8">
                Aunque Estés Durmiendo.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl font-sans">
              No es un contestador automático. Es una Inteligencia Artificial que entiende, responde y vende 24/7 por solo $20/mes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/contacto"
                className="group bg-puka-black dark:bg-white text-white dark:text-puka-black px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-puka-red dark:hover:bg-puka-red dark:hover:text-white transition-all flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(199,23,30,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Configurar mi Chatbot
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <div className="py-4 px-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-puka-red font-bold">
                  <span className="flex gap-0.5">
                    <span className="w-3 h-3 bg-puka-red rounded-full"></span>
                    <span className="w-3 h-3 bg-puka-red rounded-full"></span>
                    <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  </span>
                  <span className="text-sm uppercase tracking-tighter">1 cupo disponible para setup inmediato</span>
                </div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">
                  INTEGRACIÓN OFICIAL • RESPUESTAS EN 30S • CERO COSTOS POR MENSAJE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EL ENEMIGO: EL "DÉJAME CONSULTARLO" */}
      <section className="py-24 bg-puka-black text-white overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-5xl md:text-6xl mb-8 leading-tight">
                Tus Clientes No Tienen Paciencia.<br />
                <span className="text-puka-red">Tú Tampoco Deberías.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                En el mundo actual, 5 minutos de espera es un cliente que se fue a la competencia. No pierdas ventas porque tu equipo está ocupado o porque es fin de semana.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  El 70% de los clientes compra al primero que le responde.
                </div>
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  Responder a las 2 horas disminuye la conversión un 80%.
                </div>
              </div>
            </div>

            <div className="bg-puka-beige text-puka-black p-10 rounded-sm relative">
              <div className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-puka-red">La Solución Digna</div>
              <h3 className="font-display font-bold text-3xl mb-6">Chatbot IA de Alto Rendimiento</h3>

              <div className="space-y-4 mb-8 text-lg font-bold">
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Entiende contexto (IA Real)</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Agendar citas solo</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Calificar prospectos</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Habla como tú</div>
              </div>

              <div className="bg-puka-black text-white p-6 rounded-sm text-center">
                <div className="text-xs font-bold uppercase mb-1 opacity-60">Ahorro Mensual Estimado</div>
                <div className="text-4xl font-black text-puka-red">${ahorroUSD.toFixed(0)}</div>
                <p className="text-xs mt-1 uppercase font-bold tracking-widest">{ahorroMensual.toFixed(0)} horas de trabajo humano</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="py-24 bg-white dark:bg-puka-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto border border-gray-200 dark:border-white/10 p-10 rounded-sm">
            <h2 className="font-display font-bold text-4xl mb-12 text-center italic underline decoration-puka-red decoration-4">
              Calcula Tu Libertad
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-4">Consultas por día</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={mensajesPorDia}
                    onChange={(e) => setMensajesPorDia(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                  />
                  <div className="text-2xl font-black mt-2">{mensajesPorDia} clientes/día</div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-4">Minutos por respuesta</label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={tiempoRespuesta}
                    onChange={(e) => setTiempoRespuesta(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                  />
                  <div className="text-2xl font-black mt-2">{tiempoRespuesta} mins</div>
                </div>
              </div>

              <div className="bg-puka-red text-white p-8 rounded-sm text-center flex flex-col justify-center">
                <div className="text-xs font-bold uppercase tracking-widest mb-2">ROI Anual del Chatbot</div>
                <div className="text-6xl font-black">+{roi.toFixed(0)}%</div>
                <p className="text-sm mt-4 font-bold opacity-80 uppercase tracking-tighter italic">
                  Basado en el salario básico de Ecuador
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-puka-beige text-puka-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-6xl mb-4 italic">Un Solo Precio. <span className="text-puka-red">Sin Letras Chicas.</span></h2>
          <p className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-16 italic">Tecnología de élite para el negocio real.</p>

          <div className="max-w-md mx-auto relative scale-105">
            <div className="absolute -top-6 -right-6 bg-puka-black text-white text-xs font-black p-4 rounded-full rotate-12 shadow-xl z-20">
              Pruébalo<br />7 DÍAS GRATIS
            </div>

            <div className="bg-puka-black text-white p-12 rounded-sm border-b-[16px] border-puka-red shadow-2xl">
              <div className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Suscripción Mensual</div>
              <div className="text-8xl font-black mb-4">
                <span className="text-3xl align-top mr-1 font-display hover:text-puka-red transition-colors">$</span>20
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest mb-8 italic">Mantenimiento y Servidor Incluido</p>

              <div className="space-y-4 mb-10 text-left font-bold">
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> WhatsApp Business API Oficial</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> 5,000 Mensajes Mensuales</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Entrenamiento IA con tu DATA</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Soporte Especializado</div>
              </div>

              <Link
                href="/contacto"
                className="block w-full bg-white text-puka-black py-5 rounded-sm font-display font-black text-xl hover:bg-puka-red hover:text-white transition-colors uppercase italic shadow-lg"
              >
                Empezar Mi Prueba Gratis
              </Link>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-400">
              * Implementación incluida en el Programa de 3 Meses ($300/mes)
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA - THE RED BOX */}
      <section className="py-32 bg-puka-red text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display font-bold text-6xl md:text-8xl mb-8 tracking-tighter italic uppercase">
            Vende Más <br /> <span className="text-puka-black">Hablando Menos.</span>
          </h2>
          <p className="text-2xl mb-12 font-bold max-w-2xl mx-auto opacity-90 italic">
            El asistente que no descansa, no se queja y responde como un experto de tu empresa.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center max-w-md mx-auto font-sans">
            <Link
              href="/contacto"
              className="bg-white text-puka-red px-10 py-6 rounded-sm font-display font-black text-2xl hover:bg-puka-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              LO QUIERO YA
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
            <span>CERO CONTRATOS</span>
            <span className="w-1.5 h-1.5 bg-puka-black rounded-full"></span>
            <span>CERO RIESGO</span>
          </div>
        </div>
      </section>
    </div>
  );
}
