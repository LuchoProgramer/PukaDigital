'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Settings,
  Brain,
  Power,
  MessageCircle
} from 'lucide-react';

const WA_DEMO_LINK = 'https://wa.me/593984800282?text=Hola%2C%20quiero%20probar%20PukaIA';

export default function PukaIAPage() {
  const [mensajesPorDia, setMensajesPorDia] = useState(50);
  const [tiempoRespuesta, setTiempoRespuesta] = useState(5);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ahorroMensual = (mensajesPorDia * 30 * tiempoRespuesta * 3) / 60;
  const costoHoraEmpleado = 3;
  const ahorroUSD = ahorroMensual * costoHoraEmpleado;
  const roi = ((ahorroUSD - 20) / 20) * 100;

  const faqs = [
    {
      q: '¿Necesito tener WhatsApp Business API activa?',
      a: 'Nosotros gestionamos todo el proceso de activación con Meta. Tú solo necesitas un número de teléfono dedicado. El proceso tarda entre 3 y 7 días hábiles y está incluido en el setup.'
    },
    {
      q: '¿Qué pasa si se acaban los 5,000 mensajes mensuales?',
      a: 'El bot no se apaga — te notificamos cuando llegues al 90% del límite. Puedes ampliar tu plan en cualquier momento desde el dashboard sin interrupciones.'
    },
    {
      q: '¿La IA puede cometer errores o responder algo incorrecto?',
      a: 'Sí, como cualquier IA. Por eso el sistema tiene modo humano: cuando detecta una pregunta compleja o urgente, te notifica en tiempo real para que tomes el control. Tú defines los límites de lo que el bot puede y no puede responder.'
    },
    {
      q: '¿Funciona para cualquier tipo de negocio?',
      a: 'Funciona para cualquier negocio que atienda clientes por WhatsApp: clínicas, restaurantes, tiendas, consultoras, inmobiliarias, academias. Si tienes dudas sobre tu caso específico, prueba el bot ahora y pregúntale directamente.'
    },
    {
      q: '¿Puedo cancelar cuando quiera?',
      a: 'Sí. Sin contratos de permanencia. Si cancelas antes del siguiente ciclo de facturación, no se genera ningún cargo adicional.'
    },
    {
      q: '¿En cuánto tiempo está funcionando mi bot?',
      a: 'El bot está activo en 24 horas después de que aprobamos tu número con Meta. La configuración inicial — productos, FAQs, personalidad del bot — la hacemos juntos en una sesión de 1 hora.'
    }
  ];

  return (
    <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white">

      {/* ─── HERO ─── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden bg-[#080808]">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-puka-red/20 blur-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#7c3aed]/15 blur-[100px] translate-x-1/4 translate-y-1/4 rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 mb-8">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full mb-8 text-sm font-bold tracking-wider">
                <Sparkles size={16} className="text-puka-red" />
                ✓ FUNCIONANDO EN ECUADOR
              </div>

              <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-[1.1] tracking-tight text-white">
                Agente de Inteligencia Artificial para WhatsApp
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto font-sans">
                No es un bot de respuestas fijas. Es una IA que entiende, responde y agenda citas sola —{' '}
                <span className="text-white font-bold">24/7</span> — por $20/mes.{' '}
                <span className="text-puka-red font-bold">Ya funciona en Ecuador.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <a
                  href={WA_DEMO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-puka-red text-white px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-white hover:text-puka-black transition-all flex items-center gap-3 shadow-xl"
                >
                  <MessageCircle size={22} />
                  Habla con PukaIA ahora
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                </a>

                <a
                  href="#pricing"
                  className="group border-2 border-white/30 text-white px-8 py-5 rounded-sm font-display font-bold text-xl hover:border-white hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Ver planes y precios
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-400 font-bold">
                ↑ Estás hablando con el bot real. Si te gusta, es tuyo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEMO MOCKUP ─── */}
      <section className="py-24 bg-[#0d1117]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Pruébalo ahora. Sin registrarte.
            </h2>
            <p className="text-gray-400 text-lg">Así responde PukaIA en el WhatsApp de tu negocio.</p>
          </div>

          <div className="max-w-sm mx-auto">
            {/* Cabecera estilo WhatsApp */}
            <div className="bg-[#075E54] rounded-t-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-puka-red flex items-center justify-center text-white font-black text-sm">IA</div>
              <div>
                <p className="text-white font-bold text-sm">PukaIA — Tu Negocio</p>
                <p className="text-green-300 text-xs">en línea</p>
              </div>
            </div>

            {/* Burbujas de conversación */}
            <div className="bg-[#ECE5DD] p-4 space-y-3 rounded-b-2xl">
              {/* Usuario */}
              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                  <p className="text-gray-800 text-sm">Hola, ¿cuánto cuesta el plan básico?</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:41 ✓✓</p>
                </div>
              </div>

              {/* Bot */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] shadow-sm">
                  <p className="text-gray-800 text-sm">¡Hola! 👋 El plan mensual de PukaIA cuesta <strong>$20/mes</strong> e incluye 5,000 mensajes, setup completo y soporte.</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:41</p>
                </div>
              </div>

              {/* Usuario */}
              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                  <p className="text-gray-800 text-sm">¿Puedo agendar una demo?</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:42 ✓✓</p>
                </div>
              </div>

              {/* Bot */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] shadow-sm">
                  <p className="text-gray-800 text-sm">¡Claro! Tengo disponibilidad mañana a las <strong>10:00 AM</strong> o <strong>3:00 PM</strong>. ¿Cuál prefieres? Te agendo ahora mismo. 📅</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:42</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <a
                  href={WA_DEMO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[#075E54] font-bold text-sm py-2 hover:text-[#128C7E] transition-colors"
                >
                  Continuar esta conversación en WhatsApp real →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEMA ─── */}
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

            <div className="bg-puka-beige text-puka-black p-10 rounded-sm">
              <div className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-puka-red">La Solución Digna</div>
              <h3 className="font-display font-bold text-3xl mb-6">PukaIA de Alto Rendimiento</h3>

              <div className="space-y-4 mb-8 text-lg font-bold">
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Entiende contexto (IA Real)</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Agenda citas solo</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Califica prospectos</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Habla como tú</div>
              </div>

              <div className="bg-puka-black text-white p-6 rounded-sm text-center">
                <div className="text-xs font-bold uppercase mb-1 opacity-60">Ahorro Mensual Estimado</div>
                <div className="text-4xl font-black text-puka-red">${ahorroUSD.toFixed(0)}</div>
                <p className="text-xs mt-1 uppercase font-bold tracking-widest">{ahorroMensual.toFixed(0)} horas de trabajo humano</p>
              </div>
            </div>
          </div>

          {/* 3 pasos */}
          <div className="mt-20 border-t border-white/10 pt-16">
            <h3 className="font-display font-bold text-3xl text-white text-center mb-12">
              PukaIA resuelve esto en 24 horas
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-puka-red rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Settings size={28} className="text-white" />
                </div>
                <div className="text-puka-red font-black text-xs uppercase tracking-widest mb-2">Paso 1</div>
                <h4 className="font-bold text-xl text-white mb-2">Configuramos</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Activamos tu número con Meta y personalizamos el agente con los datos de tu negocio.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-puka-red rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} className="text-white" />
                </div>
                <div className="text-puka-red font-black text-xs uppercase tracking-widest mb-2">Paso 2</div>
                <h4 className="font-bold text-xl text-white mb-2">Entrenamos</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Cargamos tus productos, precios, FAQs y definimos la personalidad del bot en una sesión de 1 hora.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-puka-red rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Power size={28} className="text-white" />
                </div>
                <div className="text-puka-red font-black text-xs uppercase tracking-widest mb-2">Paso 3</div>
                <h4 className="font-bold text-xl text-white mb-2">Activas</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Tu agente IA queda activo 24/7. Tú recibes notificaciones cuando necesita tu intervención.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROI CALCULATOR ─── */}
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
                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-none appearance-none cursor-pointer accent-puka-red"
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
                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-none appearance-none cursor-pointer accent-puka-red"
                  />
                  <div className="text-2xl font-black mt-2">{tiempoRespuesta} mins</div>
                </div>
              </div>

              <div className="bg-puka-red text-white p-8 rounded-sm text-center flex flex-col justify-center">
                <div className="text-xs font-bold uppercase tracking-widest mb-2">ROI Anual del agente IA</div>
                <div className="text-6xl font-black">+{roi.toFixed(0)}%</div>
                <p className="text-sm mt-4 font-bold opacity-80 uppercase tracking-tighter italic">
                  Basado en el salario básico de Ecuador
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 bg-puka-beige text-puka-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-5xl md:text-6xl mb-4 italic">
              Planes por Respuestas. <span className="text-puka-red">Sin Sorpresas.</span>
            </h2>
            <p className="text-xl font-bold uppercase tracking-widest text-gray-500 italic">
              Paga solo por lo que usa tu bot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

            {/* Plan Gratis */}
            <div className="bg-white rounded-sm border border-gray-200 p-8 flex flex-col">
              <div className="inline-block bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 self-start">
                Para empezar
              </div>
              <div className="mb-2">
                <span className="text-5xl font-black text-puka-black">$0</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Gratis para siempre</p>
              <ul className="space-y-3 mb-10 flex-grow">
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  300 respuestas del bot
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  Setup self-service
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  WhatsApp Business API Oficial
                </li>
              </ul>
              <a
                href={WA_DEMO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border-2 border-puka-black text-puka-black py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-puka-black hover:text-white transition-colors"
              >
                Empezar gratis
              </a>
            </div>

            {/* Plan Básico */}
            <div className="bg-white rounded-sm border border-gray-200 p-8 flex flex-col">
              <div className="inline-block bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 self-start">
                Básico
              </div>
              <div className="mb-2">
                <span className="text-5xl font-black text-puka-black">$14</span>
                <span className="text-2xl font-black text-puka-black">.99</span>
                <span className="text-gray-400 font-bold text-sm">/mes</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Sin contratos</p>
              <ul className="space-y-3 mb-10 flex-grow">
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  500 respuestas del bot
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  Setup self-service
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  WhatsApp Business API Oficial
                </li>
              </ul>
              <a
                href={WA_DEMO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border-2 border-puka-black text-puka-black py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-puka-black hover:text-white transition-colors"
              >
                Elegir Básico
              </a>
            </div>

            {/* Plan Pro — destacado */}
            <div className="bg-puka-black text-white rounded-sm border-b-[8px] border-puka-red p-8 flex flex-col relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-puka-red text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                ✦ Más popular
              </div>
              <div className="inline-block bg-white/10 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 self-start mt-2">
                Pro
              </div>
              <div className="mb-2">
                <span className="text-5xl font-black text-white">$25</span>
                <span className="text-gray-400 font-bold text-sm">/mes</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Sin contratos</p>
              <ul className="space-y-3 mb-10 flex-grow">
                <li className="flex items-start gap-3 text-sm font-bold text-white">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  2,000 respuestas del bot
                </li>
                <li className="flex items-start gap-3 text-sm font-bold text-white">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  Setup self-service
                </li>
                <li className="flex items-start gap-3 text-sm font-bold text-white">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  WhatsApp Business API Oficial
                </li>
                <li className="flex items-start gap-3 text-sm font-bold text-white">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  Entrenamiento IA con tu DATA
                </li>
              </ul>
              <a
                href={WA_DEMO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-puka-red text-white py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-white hover:text-puka-black transition-colors shadow-lg"
              >
                Elegir Pro
              </a>
            </div>

            {/* Plan Business */}
            <div className="bg-white rounded-sm border border-gray-200 p-8 flex flex-col">
              <div className="inline-block bg-puka-black text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 self-start">
                Business
              </div>
              <div className="mb-2">
                <span className="text-5xl font-black text-puka-black">$60</span>
                <span className="text-gray-400 font-bold text-sm">/mes</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Sin contratos</p>
              <ul className="space-y-3 mb-10 flex-grow">
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  6,000 respuestas del bot
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  <span>Setup asistido incluido <span className="text-puka-red">(valor $100)</span></span>
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  WhatsApp Business API Oficial
                </li>
                <li className="flex items-start gap-3 text-sm font-bold">
                  <CheckCircle size={16} className="text-puka-red shrink-0 mt-0.5" />
                  Soporte especializado
                </li>
              </ul>
              <a
                href={WA_DEMO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border-2 border-puka-black text-puka-black py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-puka-black hover:text-white transition-colors"
              >
                Elegir Business
              </a>
            </div>
          </div>

          {/* Notas explicativas */}
          <div className="max-w-3xl mx-auto mt-12 space-y-4">
            <div className="bg-white border border-gray-200 rounded-sm px-6 py-4 flex gap-3">
              <span className="text-puka-red font-black text-lg shrink-0">?</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-puka-black">¿Qué es una respuesta?</strong>{' '}
                Cada vez que el bot responde a un mensaje de tu cliente cuenta como 1 respuesta.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-sm px-6 py-4 flex gap-3">
              <span className="text-puka-red font-black text-lg shrink-0">?</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-puka-black">¿Cuánto pago a Meta?</strong>{' '}
                Las respuestas automáticas a mensajes entrantes son gratis para Meta. Solo pagas a Meta si envías campañas de marketing masivo (~$0.022 por mensaje, opcional).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 bg-white dark:bg-[#0d1117]">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-16 text-puka-black dark:text-white">
            Preguntas frecuentes
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-white/10 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-white dark:bg-puka-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-bold text-base pr-4 text-puka-black dark:text-white">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-puka-red flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>

                {openFaq === i && (
                  <div className="px-6 pb-6 bg-white dark:bg-puka-black">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 bg-puka-red text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display font-bold text-5xl md:text-7xl mb-8 tracking-tighter italic uppercase">
            Tu competencia ya está respondiendo.{' '}
            <span className="text-puka-black">¿Tú también?</span>
          </h2>
          <p className="text-2xl mb-12 font-bold max-w-2xl mx-auto opacity-90 italic">
            Prueba PukaIA 7 días gratis. Sin tarjeta de crédito. Sin contratos.
          </p>

          <a
            href={WA_DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-puka-red px-10 py-6 rounded-sm font-display font-black text-2xl hover:bg-puka-black hover:text-white transition-all shadow-2xl"
          >
            <MessageCircle size={28} />
            Empezar prueba gratis
            <ArrowRight size={24} />
          </a>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest opacity-80">
            Setup en 24h · Cancela cuando quieras · Soporte en español
          </p>
        </div>
      </section>
    </div>
  );
}
