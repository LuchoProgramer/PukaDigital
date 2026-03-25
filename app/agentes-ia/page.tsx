'use client';

import React, { useState } from 'react';
import * as ga from '@/lib/analytics';
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

const openWA = (location: string) => {
  ga.trackWhatsAppDirectoClick(location);
  window.open(WA_DEMO_LINK, '_blank', 'noopener,noreferrer');
};

const faqs = [
  {
    q: '¿Cómo conectar ChatGPT a WhatsApp sin saber programar?',
    a: 'Nosotros nos encargamos de todo. Integramos modelos de lenguaje natural avanzado directamente a tu WhatsApp Business. No necesitas tocar código; nosotros configuramos los chatbots con IA para que entiendan el contexto de tu negocio y respondan como un humano, no como un robot de botones.'
  },
  {
    q: '¿Cuál es la diferencia entre Twilio y usar la WhatsApp Cloud API oficial?',
    a: 'Al usar la Cloud API de WhatsApp directa de Meta con nosotros, te ahorras los recargos ocultos por mensaje que cobran intermediarios como Twilio. Además, tu conexión es oficial, más rápida y perfecta para integrarle Inteligencia Artificial.'
  },
  {
    q: '¿Me pueden bloquear el número por usar automatización o scripts no oficiales?',
    a: 'No. Al utilizar la API de WhatsApp Business oficial aprobada por Meta, tu número está 100% seguro. Evitas el riesgo de baneos masivos que ocurren al usar herramientas piratas, extensiones dudosas o Callmebot.'
  },
  {
    q: '¿Cuáles son los precios de WhatsApp API y cuánto cuesta la IA?',
    a: 'Meta cobra unos centavos por conversación iniciada, pero nuestra plataforma te da planes flexibles desde $14.99/mes por el cerebro de la IA. Lo mejor: te regalamos 300 interacciones gratis para que valides cómo la WhatsApp IA aumenta tus ventas antes de comprometerte. Sin contratos.'
  },
  {
    q: '¿Qué pasa si la IA no sabe responder o el cliente pide un humano?',
    a: 'El agente es inteligente: si detecta una pregunta fuera de su conocimiento o una queja, pausa la automatización y te notifica al instante. Puedes tomar el control del chat desde tu celular y cerrar la venta manualmente sin que el cliente note la transición.'
  },
  {
    q: '¿Para qué tipo de empresas funciona automatizar ventas por WhatsApp?',
    a: 'Es la solución definitiva para negocios con alto volumen de mensajes: clínicas que necesitan agendar citas, hoteles gestionando reservas, tiendas físicas y agencias en Ecuador y toda Latinoamérica. En 24 horas tienes tu bot funcionando.'
  },
  {
    q: '¿Qué hago si me suspendieron WhatsApp Business o tengo el número bloqueado?',
    a: 'Si tienes tu WhatsApp Business bloqueado o la aplicación no te deja enviar mensajes, probablemente Meta detectó el uso de aplicaciones piratas, envíos masivos (spam) o herramientas no autorizadas. Aunque te ayudamos con buenas prácticas para recuperar tu cuenta de WhatsApp Business suspendida, la única forma definitiva de evitar que esto vuelva a pasar es migrando a la API Oficial de WhatsApp. Nosotros conectamos tu número directamente a los servidores de Meta, blindando tu línea para siempre y permitiéndote usar nuestra Inteligencia Artificial de forma 100% legal y segura.'
  },
  {
    q: '¿Cómo enviar mensajes masivos en WhatsApp y contactar clientes sin agregarlos?',
    a: 'Si buscas cómo enviar mensajes masivos por WhatsApp sin que te bloqueen, debes usar la API de WhatsApp Business. A diferencia de las listas de difusión, aquí no necesitas guardar el contacto en tu teléfono. Sin embargo, Meta exige reglas estrictas contra el spam: todo envío masivo de WhatsApp debe hacerse mediante Plantillas de Mensaje pre-aprobadas. Nosotros te asesoramos en la creación de estas campañas de marketing, gestionamos la aprobación de tus plantillas con Meta y aseguramos que cumplas las normativas. Lo más poderoso: una vez que lanzas la campaña y tu cliente responde, nuestro agente de Inteligencia Artificial toma el control del chat al instante para cerrar la venta.'
  }
];

export default function PukaIAPage() {
  const [mensajesPorDia, setMensajesPorDia] = useState(50);
  const [tiempoRespuesta, setTiempoRespuesta] = useState(5);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ahorroMensual = (mensajesPorDia * 30 * tiempoRespuesta * 3) / 60;
  const costoHoraEmpleado = 3;
  const ahorroUSD = ahorroMensual * costoHoraEmpleado;
  const roi = ((ahorroUSD - 25) / 25) * 100;

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
                Integramos la API de WhatsApp Business con IA para que vendas en piloto autom&aacute;tico.
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto font-sans">
                Olvida las configuraciones t&eacute;cnicas. Conectamos WhatsApp IA a tu negocio para calificar leads y agendar citas{' '}
                <span className="text-white font-bold">24/7</span>.{' '}
                <span className="text-puka-red font-bold">Te regalamos las primeras 300 interacciones.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button
                  type="button"
                  onClick={() => openWA('agentes_ia_hero_primary')}
                  className="group bg-puka-red text-white px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-white hover:text-puka-black transition-all flex items-center gap-3 shadow-xl cursor-pointer"
                >
                  <MessageCircle size={22} />
                  Obtener mi API + 300 Mensajes Gratis
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                </button>

                <a
                  href="#pricing"
                  className="group border-2 border-white/30 text-white px-8 py-5 rounded-sm font-display font-bold text-xl hover:border-white hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Ver precios de WhatsApp IA
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-400 font-bold">
                &uarr; Est&aacute;s hablando con el bot real. Si te gusta, es tuyo.
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
              Chatbots con IA en tu WhatsApp: Pr&uacute;ebalo gratis en vivo
            </h2>
            <p className="text-gray-400 text-lg">As&iacute; responde PukaIA en el WhatsApp de tu negocio.</p>
          </div>

          <div className="max-w-sm mx-auto">
            {/* Cabecera estilo WhatsApp */}
            <div className="bg-[#075E54] rounded-t-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-puka-red flex items-center justify-center text-white font-black text-sm">IA</div>
              <div>
                <p className="text-white font-bold text-sm">PukaIA &mdash; Tu Negocio</p>
                <p className="text-green-300 text-xs">en l&iacute;nea</p>
              </div>
            </div>

            {/* Burbujas de conversación */}
            <div className="bg-[#ECE5DD] p-4 space-y-3 rounded-b-2xl">
              {/* Usuario */}
              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                  <p className="text-gray-800 text-sm">Hola, &iquest;cu&aacute;nto cuesta el plan b&aacute;sico?</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:41 ✓✓</p>
                </div>
              </div>

              {/* Bot */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] shadow-sm">
                  <p className="text-gray-800 text-sm">¡Hola! 👋 El plan b&aacute;sico de PukaIA cuesta <strong>$14.99/mes</strong> e incluye 500 respuestas y WhatsApp Business API Oficial.</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:41</p>
                </div>
              </div>

              {/* Usuario */}
              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                  <p className="text-gray-800 text-sm">&iquest;Puedo agendar una demo?</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:42 ✓✓</p>
                </div>
              </div>

              {/* Bot */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] shadow-sm">
                  <p className="text-gray-800 text-sm">¡Claro! Tengo disponibilidad ma&ntilde;ana a las <strong>10:00 AM</strong> o <strong>3:00 PM</strong>. &iquest;Cu&aacute;l prefieres? Te agendo ahora mismo. 📅</p>
                  <p className="text-gray-400 text-[10px] text-right mt-1">9:42</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => openWA('agentes_ia_demo')}
                  className="flex items-center justify-center gap-2 text-[#075E54] font-bold text-sm py-2 hover:text-[#128C7E] transition-colors w-full cursor-pointer"
                >
                  Continuar esta conversaci&oacute;n en WhatsApp real &rarr;
                </button>
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
                Olvida los dolores de cabeza t&eacute;cnicos de la{' '}
                <span className="text-puka-red">API de WhatsApp</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                Nos encargamos de la conexi&oacute;n oficial con Meta &mdash; m&aacute;s segura y confiable que Callmebot o scripts piratas. T&uacute; solo te concentras en atender a tus clientes.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  El 70% de los clientes compra al primero que le responde.
                </div>
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  Responder a las 2 horas disminuye la conversi&oacute;n un 80%.
                </div>
              </div>
            </div>

            <div className="bg-puka-beige text-puka-black p-10 rounded-sm">
              <div className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-puka-red">La Soluci&oacute;n Digna</div>
              <h3 className="font-display font-bold text-3xl mb-6">PukaIA de Alto Rendimiento</h3>

              <div className="space-y-4 mb-8 text-lg font-bold">
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Entiende contexto (IA Real)</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Agenda citas solo</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Califica prospectos</div>
                <div className="flex items-center gap-3"><CheckCircle className="text-puka-red" /> Habla como t&uacute;</div>
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
                <p className="text-gray-400 text-sm leading-relaxed">Activamos tu n&uacute;mero con Meta y personalizamos el agente con los datos de tu negocio.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-puka-red rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} className="text-white" />
                </div>
                <div className="text-puka-red font-black text-xs uppercase tracking-widest mb-2">Paso 2</div>
                <h4 className="font-bold text-xl text-white mb-2">Entrenamos</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Cargamos tus productos, precios, FAQs y definimos la personalidad del bot en una sesi&oacute;n de 1 hora.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-puka-red rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Power size={28} className="text-white" />
                </div>
                <div className="text-puka-red font-black text-xs uppercase tracking-widest mb-2">Paso 3</div>
                <h4 className="font-bold text-xl text-white mb-2">Activas</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Tu agente IA queda activo 24/7. T&uacute; recibes notificaciones cuando necesita tu intervenci&oacute;n.</p>
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
              WhatsApp IA: Respuestas Inteligentes 24/7 para tu Negocio
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-4">Consultas por d&iacute;a</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={mensajesPorDia}
                    onChange={(e) => setMensajesPorDia(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-none appearance-none cursor-pointer accent-puka-red"
                  />
                  <div className="text-2xl font-black mt-2">{mensajesPorDia} clientes/d&iacute;a</div>
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
                <div className="text-xs font-bold uppercase tracking-widest mb-2">ROI Mensual del agente IA</div>
                <div className="text-6xl font-black">+{roi.toFixed(0)}%</div>
                <p className="text-sm mt-4 font-bold opacity-80 uppercase tracking-tighter italic">
                  Basado en el salario b&aacute;sico de Ecuador
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
              WhatsApp API Precios: <span className="text-puka-red">Planes Flexibles (Mejor que Twilio)</span>
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
              <button
                type="button"
                onClick={() => openWA('agentes_ia_pricing_free')}
                className="block w-full border-2 border-puka-black text-puka-black py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-puka-black hover:text-white transition-colors cursor-pointer"
              >
                Empezar gratis
              </button>
            </div>

            {/* Plan Básico */}
            <div className="bg-white rounded-sm border border-gray-200 p-8 flex flex-col">
              <div className="inline-block bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6 self-start">
                B&aacute;sico
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
              <button
                type="button"
                onClick={() => openWA('agentes_ia_pricing_basico')}
                className="block w-full border-2 border-puka-black text-puka-black py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-puka-black hover:text-white transition-colors cursor-pointer"
              >
                Activar WhatsApp IA
              </button>
            </div>

            {/* Plan Pro — destacado */}
            <div className="bg-puka-black text-white rounded-sm border-b-[8px] border-puka-red p-8 flex flex-col relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-puka-red text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                ✦ M&aacute;s popular
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
              <button
                type="button"
                onClick={() => openWA('agentes_ia_pricing_pro')}
                className="block w-full bg-puka-red text-white py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-white hover:text-puka-black transition-colors shadow-lg cursor-pointer"
              >
                Escalar mi API
              </button>
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
              <button
                type="button"
                onClick={() => openWA('agentes_ia_pricing_business')}
                className="block w-full border-2 border-puka-black text-puka-black py-3 rounded-sm font-black text-sm uppercase text-center hover:bg-puka-black hover:text-white transition-colors cursor-pointer"
              >
                Dominar mi Mercado
              </button>
            </div>
          </div>

          {/* Notas explicativas */}
          <div className="max-w-3xl mx-auto mt-12 space-y-4">
            <div className="bg-white border border-gray-200 rounded-sm px-6 py-4 flex gap-3">
              <span className="text-puka-red font-black text-lg shrink-0">?</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-puka-black">&iquest;Qu&eacute; es una respuesta?</strong>{' '}
                Cada vez que el bot responde a un mensaje de tu cliente cuenta como 1 respuesta.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-sm px-6 py-4 flex gap-3">
              <span className="text-puka-red font-black text-lg shrink-0">?</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-puka-black">&iquest;Cu&aacute;nto pago a Meta?</strong>{' '}
                Las respuestas autom&aacute;ticas a mensajes entrantes son gratis para Meta. Solo pagas a Meta si env&iacute;as campa&ntilde;as de marketing masivo (~$0.022 por mensaje, opcional).
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
            Activa tu API de WhatsApp Business hoy mismo.
          </h2>
          <p className="text-2xl mb-12 font-bold max-w-2xl mx-auto opacity-90 italic">
            Empieza con el plan gratuito. Sin tarjeta de cr&eacute;dito. Sin contratos.
          </p>

          <button
            type="button"
            onClick={() => openWA('agentes_ia_final_cta')}
            className="inline-flex items-center gap-3 bg-white text-puka-red px-10 py-6 rounded-sm font-display font-black text-2xl hover:bg-puka-black hover:text-white transition-all shadow-2xl cursor-pointer"
          >
            <MessageCircle size={28} />
            Empezar gratis ahora
            <ArrowRight size={24} />
          </button>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest opacity-80">
            Setup en 24h &middot; Cancela cuando quieras &middot; Soporte en espa&ntilde;ol
          </p>
        </div>
      </section>
    </div>
  );
}
