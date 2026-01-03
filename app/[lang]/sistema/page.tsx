'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ManifestoSection from '@/components/ManifestoSection';
import {
    CheckCircle,
    XCircle,
    Zap,
    ShieldCheck,
    Smartphone,
    MessageCircle,
    ArrowRight,
    TrendingUp,
    Rocket,
    Plus,
    LayoutGrid,
    Bot,
    FileText
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';
import LiveDemoSim from '@/components/LiveDemoSim';
import dynamic from 'next/dynamic';

const VideoTestimonial = dynamic(() => import('@/components/VideoTestimonial'), {
    loading: () => <div className="aspect-video bg-gray-900 animate-pulse rounded-sm border border-gray-800"></div>
});

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

const SistemaPage = () => {
    const WHATSAPP_NUMBER = '593964065880';
    const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
    const router = useRouter();
    const { language } = useTranslation();
    const lang = language || 'es';

    const handleWhatsAppClick = (location: string) => {
        ga.trackWhatsAppDirectoClick(`sistema_${location}`);
        window.open(WHATSAPP_LINK, '_blank');
        router.push(`/${lang}/gracias`);
    };

    const scrollToPricing = () => {
        const el = document.getElementById('precios');
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col bg-[#0B0C10] text-gray-100 overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Top Urgency Banner */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 px-4 text-center text-xs md:text-sm font-bold tracking-wide">
                🚀 PROGRAMA BETA PARA FUNDADORES: Últimos 2 cupos con beneficio de Google Ads ($100).
            </div>
            <SEO
                title="Sistema de Ventas y Facturación | PukaDigital SaaS"
                description="La alternativa a las agencias. En 90 días te entregamos Web + Asistente IA + ERP Facturación. Un solo pago, independencia de por vida."
                keywords="sistema ventas ecuador, facturacion electronica sri, chatbot ia ventas, nextjs ecommerce, erp pymes ecuador"
            />

            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-36">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-3/5 text-left">
                            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-gray-800/50 text-cyan-400 font-mono text-[10px] md:text-xs tracking-widest uppercase mb-8 rounded-full border border-gray-700 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                PROGRAMA BETA PARA FUNDADORES - CUPOS LIMITADOS
                            </div>

                            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-8 tracking-tight">
                                Tu Sistema de Ventas<br />
                                y Facturación Propio.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                    Sin Rentas Mensuales.
                                </span>
                            </h1>

                            <h2 className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
                                La alternativa a las agencias. En 90 días te entregamos <span className="text-white font-medium border-b border-cyan-500/30">Web + Asistente IA + ERP Facturación</span>. Un solo pago, independencia de por vida.
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-5 mb-12">
                                <button
                                    onClick={scrollToPricing}
                                    className="bg-white text-black px-8 py-4 rounded-sm font-bold text-lg hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group hover:-translate-y-1"
                                >
                                    Aplicar a la Beta (50% OFF)
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                                <button
                                    onClick={() => handleWhatsAppClick('hero_secondary')}
                                    className="bg-transparent border border-gray-600 text-white px-8 py-4 rounded-sm font-bold text-lg hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <WhatsAppIcon size={24} />
                                    Ver Demo WhatsApp
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-mono">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid size={16} className="text-cyan-500" />
                                    <span>Web Next.js</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bot size={16} className="text-cyan-500" />
                                    <span>Chatbot IA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-cyan-500" />
                                    <span>Facturación SRI</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual */}
                        <div className="lg:w-2/5 relative animate-fade-in">
                            <div className="relative z-10 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">dashboard_v2.tsx</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ventas Hoy</p>
                                            <p className="text-2xl font-bold text-white">$1,240.00</p>
                                        </div>
                                        <div className="h-10 w-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                            <TrendingUp size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Meta Mensual</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full w-[85%] relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 grid grid-cols-2 gap-3">
                                        <div className="bg-gray-800/30 p-3 rounded border border-gray-700 text-center">
                                            <p className="text-[10px] text-gray-500 mb-1">Stock Bajo</p>
                                            <p className="text-lg font-bold text-red-400">3 Items</p>
                                        </div>
                                        <div className="bg-gray-800/30 p-3 rounded border border-gray-700 text-center">
                                            <p className="text-[10px] text-gray-500 mb-1">Leads IA</p>
                                            <p className="text-lg font-bold text-cyan-400">+12</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -right-4 top-20 bg-black border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-xs font-mono shadow-lg animate-bounce flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Sistema Activo
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. NARRATIVA DIGNIDAD DIGITAL */}
            <section className="py-24 bg-gray-900 border-y border-gray-800">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-8">
                        Deja de alquilar tu éxito.
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-12">
                        Las plataformas te cobran comisiones eternas. Las agencias te cobran renta mensual.<br />
                        <span className="text-cyan-400 font-bold">Nosotros te damos el código y el control.</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-black/50 p-8 rounded-sm border border-gray-800 hover:border-red-500/50 transition-colors group">
                            <h3 className="text-gray-500 font-mono text-sm uppercase mb-4 group-hover:text-red-400">El Modelo Viejo</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-center gap-2"><XCircle size={16} className="text-red-500" /> Pagos mensuales de por vida</li>
                                <li className="flex items-center gap-2"><XCircle size={16} className="text-red-500" /> Comisiones por venta (Shopify)</li>
                                <li className="flex items-center gap-2"><XCircle size={16} className="text-red-500" /> No eres dueño de tus datos</li>
                            </ul>
                        </div>
                        <div className="bg-cyan-900/10 p-8 rounded-sm border border-cyan-500/30 hover:bg-cyan-900/20 transition-colors group">
                            <h3 className="text-cyan-500 font-mono text-sm uppercase mb-4">El Modelo Puka</h3>
                            <ul className="space-y-3 text-white">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-cyan-500" /> Un solo pago de implementación</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-cyan-500" /> 0% Comisiones por venta</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-cyan-500" /> Propiedad total del código</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Live Demo Component */}
            <section className="py-24 bg-black relative">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-4 block">DEMO EN VIVO</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Prueba la tecnología que te entregaremos</h2>
                    </div>
                    <div className="bg-gray-900 rounded-[2rem] border border-gray-800 p-1 md:p-4 overflow-hidden">
                        <LiveDemoSim />
                    </div>
                </div>
            </section>

            {/* VIDEO TESTIMONIAL SECTION */}
            <section className="py-24 bg-black relative border-t border-gray-800">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <div className="mb-12">
                        <span className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-4 block">RESULTADOS REALES</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">No confíes en nuestra palabra.<br />Confía en sus resultados.</h2>
                        <p className="text-xl text-gray-400">Cristina duplicó sus pacientes en 30 días usando este sistema.</p>
                    </div>

                    <div className="max-w-4xl mx-auto shadow-2xl shadow-cyan-900/20 rounded-sm">
                        <VideoTestimonial
                            videoId="bSge9e1Se4w"
                            title="Testimonio Cristina Muñoz - PodoclinicEC"
                        />
                    </div>

                    <div className="mt-8 flex justify-center gap-8 text-sm text-gray-500 font-mono">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-500" />
                            <span>+33 Conversiones/mes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bot size={16} className="text-cyan-500" />
                            <span>Atención Automática 24/7</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PRICING MINIMALISTA OSCURO */}
            <section id="precios" className="py-24 bg-[#0B0C10] relative">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-center font-display font-bold text-4xl text-white mb-16">Inversión Única. <span className="text-cyan-400">Sin ataduras.</span></h2>

                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 p-10 md:p-14 rounded-3xl relative shadow-2xl max-w-lg mx-auto">
                        <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-3xl uppercase tracking-wider">
                            Más Popular
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Plan Independencia</h3>
                        <p className="text-gray-400 text-sm mb-8">Todo incluido. Llave en mano.</p>

                        <div className="flex items-baseline mb-8">
                            <span className="text-6xl font-black text-white">$300</span>
                            <span className="ml-2 text-cyan-400 text-xl font-medium">/ único</span>
                        </div>

                        <div className="space-y-4 mb-10">
                            {[
                                "Web E-commerce Next.js",
                                "Chatbot IA (GPT-4) Integrado",
                                "Módulo de Facturación SRI",
                                "Hosting & Dominio (1 año)",
                                "$100 Crédito Google Ads (Regalo)"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-300">
                                    <div className="bg-cyan-500/20 p-1 rounded-full text-cyan-400">
                                        <CheckCircle size={14} />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleWhatsAppClick('pricing_plan')}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-sm transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                        >
                            Solicitar mi Sistema
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-6 font-mono">
                            Renovación técnica anual (Opcional): $80
                        </p>
                    </div>
                </div>
            </section>

            {/* Manifiesto Rebelde (Solo para emprendedores) */}
            <ManifestoSection />

            {/* FOOTER */}
            <footer className="bg-black py-12 border-t border-gray-900 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-gray-500 mb-4 font-mono text-sm">PUKADIGITAL SYSTEMS V1.0</p>
                    <p className="text-gray-700 text-xs">
                        © {new Date().getFullYear()} PukaDigital. Hecho en Ecuador.
                    </p>
                </div>
            </footer>
        </div >
    );
};

export default SistemaPage;
