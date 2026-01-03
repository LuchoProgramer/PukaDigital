'use client';

import React from 'react';
import Link from 'next/link';
import {
    Bot,
    BrainCircuit,
    MessageSquare,
    Database,
    Zap,
    Check,
    ArrowRight,
    X,
    Clock,
    ShieldCheck,
    Sparkles
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

const ChatbotPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    const handleConversion = (label: string) => {
        ga.trackWhatsAppDirectoClick(`chatbot_${label}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
            <SEO
                title="Chatbot WhatsApp Business con IA y Respuestas Automáticas | PukaDigital"
                description="Automatiza tus ventas por WhatsApp con nuestro Chatbot IA Inteligente. No usa menús fijos, entiende a tus clientes y cierra ventas mediante tecnología RAG."
                keywords="chatbot ia whatsapp, asistente virtual ia, respuestas automaticas whatsapp, rag chatbot ecuador, google cloud ai"
            />

            {/* HEADER CLEAN */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href={`/${lang}`} className="flex items-center gap-2 group">
                        <div className="bg-purple-600 rounded p-1 text-white">
                            <BrainCircuit size={20} />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">Puka<span className="text-purple-600">AI</span></span>
                    </Link>
                    <Link
                        href="https://wa.me/593964065880?text=Hola,%20quiero%20ver%20la%20demo%20del%20Chatbot%20IA."
                        target="_blank"
                        onClick={() => handleConversion('header_cta')}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-purple-600 transition-all shadow-lg shadow-purple-900/10 flex items-center gap-2"
                    >
                        <Bot size={16} /> Demo en Vivo
                    </Link>
                </div>
            </header>

            {/* 1. HERO SECTION (La Promesa RAG) */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden bg-white">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm mb-8 animate-fade-in-up">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Potenciado por Google Cloud AI</span>
                    </div>

                    <h1 className="font-display font-black text-5xl md:text-7xl mb-8 leading-tight tracking-tight text-slate-900">
                        Mensajes Automáticos y <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Chatbot para WhatsApp.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                        Olvídate de los menús aburridos <i>"Presione 1 para ventas"</i>. Nuestro <strong>Asistente IA</strong> lee tus documentos, entiende lo que tus clientes escriben y responde naturalmente 24/7.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="https://wa.me/593964065880?text=Hola,%20quiero%20probar%20el%20Chatbot."
                            target="_blank"
                            onClick={() => handleConversion('hero_cta')}
                            className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            <MessageSquare size={20} /> Probar Demo en WhatsApp
                        </Link>
                    </div>

                    <div className="mt-16 text-sm text-slate-400 font-medium flex items-center justify-center gap-8">
                        <span className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Sin Configuración Compleja</span>
                        <span className="flex items-center gap-2"><Check size={16} className="text-green-500" /> WhatsApp API Oficial</span>
                    </div>
                </div>
            </section>

            {/* 2. EL PROBLEMA (Comparativa Visual) */}
            <section className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">La Diferencia es Inteligencia</h2>
                        <p className="text-slate-500 text-lg">Tus clientes odian los bots tontos. Aman las respuestas útiles.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Bot Tradicional (Malo) */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-70 grayscale transition-all hover:grayscale-0">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    <Bot size={20} />
                                </div>
                                <div className="font-bold text-gray-500">Bot Tradicional</div>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="bg-slate-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl inline-block max-w-[80%] text-slate-700">
                                    Quiero zapatos rojos talla 40.
                                </div>
                                <div className="bg-gray-100 p-3 rounded-tl-xl rounded-br-xl rounded-bl-xl inline-block max-w-[90%] ml-auto text-gray-600 border border-gray-200">
                                    <span className="flex items-center gap-2 text-red-500 font-bold mb-1"><X size={14} /> Error</span>
                                    No entendí su mensaje. <br />
                                    Por favor elija una opción:<br />
                                    1. Ver Catálogo<br />
                                    2. Horarios<br />
                                    3. Hablar con asesor
                                </div>
                            </div>
                            <div className="mt-8 text-center text-red-500 font-bold text-sm bg-red-50 py-2 rounded">
                                Resultado: Cliente Frustrado 😠
                            </div>
                        </div>

                        {/* Puka AI (Bueno) */}
                        <div className="bg-white p-8 rounded-2xl border-2 border-purple-100 shadow-xl shadow-purple-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                                    <Sparkles size={20} />
                                </div>
                                <div className="font-bold text-slate-900">Asistente Puka AI</div>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="bg-slate-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl inline-block max-w-[80%] text-slate-700">
                                    Quiero zapatos rojos talla 40.
                                </div>
                                <div className="bg-purple-50 p-4 rounded-tl-xl rounded-br-xl rounded-bl-xl inline-block max-w-[90%] ml-auto text-slate-800 border border-purple-100 shadow-sm">
                                    <span className="flex items-center gap-2 text-purple-600 font-bold mb-2 text-xs uppercase tracking-wider"><Zap size={12} /> Pensando...</span>
                                    ¡Claro que sí! 👠 Tenemos disponibles estos 2 modelos en rojo talla 40:<br /><br />
                                    1. Stilettos de Cuero ($45)<br />
                                    2. Sandalias de Verano ($30)<br /><br />
                                    ¿Te gustaría ver fotos de alguno?
                                </div>
                            </div>
                            <div className="mt-8 text-center text-green-600 font-bold text-sm bg-green-50 py-2 rounded">
                                Resultado: Venta Cerrada ✅
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. LA TECNOLOGÍA (RAG Explicado) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-6">TECNOLOGÍA RAG</div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                No le enseñes a hablar.<br />
                                <span className="text-blue-600">Solo dale tus manuales.</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Usamos tecnología <strong>RAG (Retrieval-Augmented Generation)</strong>. Subimos tus PDFs, Excel o página web al "cerebro" del bot.
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Cuando un cliente pregunta, la IA busca la respuesta exacta en <strong>TUS documentos</strong> y la redacta al instante. Cero alucinaciones.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="bg-green-100 p-1 rounded text-green-600"><Check size={16} /></div>
                                    Sube tu catálogo en PDF
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="bg-green-100 p-1 rounded text-green-600"><Check size={16} /></div>
                                    Conecta tu sitio web
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="bg-green-100 p-1 rounded text-green-600"><Check size={16} /></div>
                                    Pega tus preguntas frecuentes
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="relative">
                                {/* Abstract representation of RAG */}
                                <div className="w-64 h-80 bg-slate-900 rounded-2xl p-6 shadow-2xl rotate-3 relative z-10 border border-slate-700">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                                        <div className="text-white font-bold flex items-center gap-2"><Database size={16} /> Brain.pdf</div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                                        <div className="h-2 w-full bg-white/20 rounded"></div>
                                        <div className="h-2 w-5/6 bg-white/20 rounded"></div>
                                        <div className="h-2 w-4/5 bg-white/20 rounded"></div>
                                    </div>

                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                                        <div className="glass-panel bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg mx-auto w-11/12 text-center">
                                            <Sparkles className="mx-auto text-yellow-400 mb-2" />
                                            <div className="text-white text-xs font-bold">Procesando y generando respuesta humana...</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 -right-4 w-64 h-80 bg-purple-600 rounded-2xl -z-10 opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CASOS DE USO */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                            <Clock className="text-purple-400 mb-6" size={32} />
                            <h3 className="text-xl font-bold mb-4">Atención al Cliente 24/7</h3>
                            <p className="text-slate-400">
                                Respuestas inmediatas sobre horarios, ubicación y precios. Tu negocio nunca duerme.
                            </p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                            <ShieldCheck className="text-blue-400 mb-6" size={32} />
                            <h3 className="text-xl font-bold mb-4">Agendamiento de Citas</h3>
                            <p className="text-slate-400">
                                La IA verifica disponibilidad y coordina la cita sin que tú muevas un dedo.
                            </p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                            <Zap className="text-yellow-400 mb-6" size={32} />
                            <h3 className="text-xl font-bold mb-4">Recuperación de Ventas</h3>
                            <p className="text-slate-400">
                                Detecta interés y hace seguimiento automático a clientes que preguntaron y no compraron.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRICING & CTA */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
                        ¿Listo para clonarte digitaImente?
                    </h2>
                    <p className="text-xl text-slate-500 mb-12">
                        Plan Beta: Entrenamiento inicial de tu IA + Conexión WhatsApp API.
                    </p>

                    <div className="inline-block p-1 rounded-full bg-slate-100 mb-12">
                        <div className="flex items-center gap-4 px-6 py-2">
                            <span className="text-slate-900 font-bold text-2xl">$20<span className="text-sm text-slate-500 font-medium">/mes</span></span>
                            <span className="h-6 w-px bg-slate-300"></span>
                            <span className="text-sm text-slate-600 font-medium">Sin permanencia</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-6">
                        <Link
                            href="https://wa.me/593964065880?text=Me%20interesa%20el%20Plan%20Chatbot%20IA."
                            target="_blank"
                            onClick={() => handleConversion('footer_cta')}
                            className="bg-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 w-full md:w-auto"
                        >
                            Empezar Ahora
                        </Link>
                        <p className="text-sm text-slate-400">
                            Incluye configuración inicial gratuita por tiempo limitado.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER SIMPLE */}
            <footer className="py-12 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-400">
                <p>© {new Date().getFullYear()} PukaAI. Inteligencia Artificial Práctica para Empresas.</p>
            </footer>
        </div>
    );
};

export default ChatbotPage;
