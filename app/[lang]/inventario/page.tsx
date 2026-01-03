'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Database,
    Cloud,
    Globe,
    Smartphone,
    Code,
    Zap,
    CheckCircle,
    ArrowRight,
    Server,
    Lock,
    Layers
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

const InventarioPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    const handleConversion = (source: string) => {
        ga.event({
            action: 'beta_access_click',
            category: 'Inventario Funnel',
            label: source
        });
    };

    return (
        <div className="min-h-screen bg-black font-sans text-white selection:bg-cyan-500 selection:text-black">
            <SEO
                title="Sistema de Inventario Cloud y Facturación SRI Ecuador | PukaDigital"
                description="Controla tu inventario y factura electrónicamente con nuestro sistema Cloud con API. Conecta tu stock a tu e-commerce y apps de delivery fácilmente."
                keywords="sistema inventario cloud, facturacion electronica sri, api inventario ecuador, erp nube pymes, control de stock online"
            />

            {/* HEADER DARK TECH */}
            <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href={`/${lang}`} className="flex items-center gap-2 group">
                        <div className="bg-cyan-500 rounded p-1">
                            <Layers size={20} className="text-black" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Ledger<span className="text-cyan-400">Xpertz</span></span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
                        <a href="#features" className="hover:text-white transition-colors">Características</a>
                        <a href="#api" className="hover:text-white transition-colors">API</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
                    </nav>
                    <Link
                        href="https://wa.me/593964065880?text=Me%20interesa%20la%20Beta%20de%20Inventario."
                        target="_blank"
                        onClick={() => handleConversion('header_cta')}
                        className="bg-white text-black px-4 py-2 rounded-md font-bold text-xs md:text-sm hover:bg-cyan-400 transition-all"
                    >
                        Acceso Beta
                    </Link>
                </div>
            </header>

            {/* 1. HERO SECTION (La Promesa - API First) */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-mono mb-8">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                        V2.0 STABLE RELEASE
                    </div>

                    <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 tracking-tight">
                        Sistema de Inventario Cloud <br />
                        & Facturación SRI.
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        El primer sistema en Ecuador diseñado con filosofía <strong>API-First</strong>. Gestiona tu stock físico hoy y conéctalo automáticamente a tu Tienda Online o Apps de Delivery mañana.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="#pricing"
                            onClick={() => handleConversion('hero_beta')}
                            className="bg-cyan-500 text-black px-8 py-3.5 rounded-md font-bold text-lg hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                        >
                            Obtener Acceso Fundador <ArrowRight size={18} />
                        </Link>
                        <button className="px-8 py-3.5 rounded-md font-bold text-lg border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-mono">
                            <Code size={18} /> Ver API Docs
                        </button>
                    </div>

                    {/* Diagrama Técnico Simplificado */}
                    <div className="mt-20 relative max-w-4xl mx-auto p-4 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-4 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center pt-8 pb-4">
                            {/* Columna Izq - Inputs */}
                            <div className="flex flex-col gap-4 justify-center items-end opacity-50">
                                <div className="flex items-center gap-2 text-xs font-mono"><Smartphone size={14} /> POS Físico</div>
                                <div className="flex items-center gap-2 text-xs font-mono"><Globe size={14} /> E-commerce</div>
                                <div className="h-[1px] w-full bg-gradient-to-l from-cyan-500 to-transparent"></div>
                            </div>

                            {/* Columna Centro - CORE */}
                            <div className="border border-cyan-500/50 bg-cyan-900/10 p-6 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.1)] relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-900 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-cyan-500/50">CORE</div>
                                <Database size={40} className="mx-auto text-cyan-400 mb-2" />
                                <div className="font-bold text-sm">Stock Centralizado</div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">Single Sourse of Truth</div>
                            </div>

                            {/* Columna Der - Outputs */}
                            <div className="flex flex-col gap-4 justify-center items-start opacity-50">
                                <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500 to-transparent"></div>
                                <div className="flex items-center gap-2 text-xs font-mono"><Server size={14} /> SRI Auth</div>
                                <div className="flex items-center gap-2 text-xs font-mono"><Cloud size={14} /> Apps Delivery</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. EL PROBLEMA (Silos) */}
            <section className="py-24 border-t border-white/10 bg-zinc-900">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                        El "Infierno de los Excel" termina hoy.
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="opacity-70">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-red-400">
                                <span className="text-lg">❌</span> El Pasado
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Tu inventario está atrapado en una PC vieja o en 10 archivos de Excel diferentes. Si vendes algo por WhatsApp, tienes que correr a descontarlo manualmente antes de que se venda en la tienda.
                            </p>
                            <div className="p-4 bg-red-900/10 border border-red-900/20 rounded text-xs font-mono text-red-300">
                                Error: Stock mismatch. Overselling risk detected.
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-400">
                                <span className="text-lg">✅</span> El Futuro (LedgerXpertz)
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Una base de datos central en la nube. Vendas donde vendas (web, local, app), el stock se actualiza en milisegundos para todos. Sin intervención humana.
                            </p>
                            <div className="p-4 bg-green-900/10 border border-green-900/20 rounded text-xs font-mono text-green-300">
                                Status: Synced. Latency: 45ms. All systems go.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. LA SOLUCIÓN (Módulos) */}
            <section id="features" className="py-24 border-t border-white/10">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Módulo 1 */}
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
                            <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">Facturación SRI Auto</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Cumple con la ley sin dolor. Emisión ilimitada, autorización en tiempo real y envío automático del PDF/XML al correo del cliente.
                            </p>
                        </div>

                        {/* Módulo 2 */}
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
                            <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                <Globe size={24} />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">Control Multicanal</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Vende en el mostrador, en tu web o por WhatsApp. El sistema unifica todo. Nunca más vendas algo que no tienes.
                            </p>
                        </div>

                        {/* Módulo 3 */}
                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all group">
                            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                                <Code size={24} />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-white">API Abierta (Superpoder)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                No te limitamos. Conecta tu inventario a lo que quieras en el futuro: apps de delivery propias, reportes en PowerBI o asistentes de IA.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. BETA FUNDADORES (Urgencia & Pricing) */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-black to-cyan-950/20 border-t border-white/10">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4 block">LIMITED ACCESS</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Construye el futuro de tu retail.
                    </h2>
                    <p className="text-xl text-gray-400 mb-12">
                        Únete a la Beta Privada. Obtén precios de fundador y acceso directo al roadmap de producto.
                    </p>

                    <div className="bg-black border border-white/10 p-10 rounded-2xl max-w-md mx-auto relative shadow-2xl">
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg rounded-tr-lg">EARLY BIRD -50%</div>

                        <div className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Plan Fundador</div>
                        <div className="text-6xl font-black text-white mb-2">$20</div>
                        <div className="text-gray-500 text-sm mb-8">/ mes (facturado anualmente)</div>

                        <div className="space-y-4 text-left mb-10 text-sm text-gray-300">
                            <div className="flex items-center gap-3"><CheckCircle size={16} className="text-cyan-400" /> Facturación SRI Ilimitada</div>
                            <div className="flex items-center gap-3"><CheckCircle size={16} className="text-cyan-400" /> Hasta 2,000 Productos</div>
                            <div className="flex items-center gap-3"><CheckCircle size={16} className="text-cyan-400" /> API Access (Read/Write)</div>
                            <div className="flex items-center gap-3"><CheckCircle size={16} className="text-cyan-400" /> Prioridad en Roadmap</div>
                        </div>

                        <a
                            href="https://wa.me/593964065880?text=Quiero%20el%20Plan%20Fundador%20de%20LedgerXpertz."
                            target="_blank"
                            onClick={() => handleConversion('pricing_card')}
                            className="block w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-md transition-all uppercase tracking-wide"
                        >
                            Solicitar Invitación
                        </a>
                    </div>
                </div>
            </section>

            {/* 5. FICHA TÉCNICA (Footer) */}
            <footer className="py-12 border-t border-white/10 text-center text-xs text-gray-600 font-mono">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <span className="flex items-center gap-2"><Cloud size={14} /> Cloud Native (AWS)</span>
                        <span className="flex items-center gap-2"><Lock size={14} /> AES-256 Encryption</span>
                        <span className="flex items-center gap-2"><Server size={14} /> 99.9% Uptime SLA</span>
                    </div>
                    <p>© 2026 LedgerXpertz by PukaDigital. Hecho con ❤️ y Next.js en Ecuador.</p>
                </div>
            </footer>
        </div>
    );
};

export default InventarioPage;
