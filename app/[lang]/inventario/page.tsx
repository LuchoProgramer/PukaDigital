'use client';

import React from 'react';
import Link from 'next/link';
import { getInventoryAppSchema } from '@/lib/schema';
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
    Brain,
    MessageSquare
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

const InventarioPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    const handleConversion = (source: string) => {
        ga.trackWhatsAppDirectoClick(`inventario_${source}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-cyan-500 selection:text-black">
            <SEO
                title="Sistema de Inventario Cloud con IA & Facturación SRI | PukaDigital"
                description="Consigue credenciales demo para el sistema de inventario con Inteligencia Artificial. Conecta tu stock con API a ecommerce y apps."
                keywords="sistema inventario cloud ai, facturacion sri api, erp ecuador inteligencia artificial, software inventario beta"
                structuredData={getInventoryAppSchema()}
            />
            {/* HEADER DARK MINIMAL */}
            <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href={`/${lang}`} className="font-mono font-bold text-lg tracking-tight flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        LedgerXpertz <span className="text-white/30 text-xs border border-white/20 px-1 rounded">BETA</span>
                    </Link>
                    <a
                        href="https://wa.me/593964065880?text=Hola%20soporte%2C%20tengo%20una%20duda%20sobre%20el%20sistema%."
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                        Soporte Developer
                    </a>
                </div>
            </header>

            {/* 1. HERO SECTION (High-Tech & Scarcity) */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                {/* Cyber Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 rounded-full text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest mb-8">
                        <Lock size={12} /> SOLO POR INVITACIÓN | BETA CERRADA
                    </div>

                    <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-white tracking-tight leading-tight">
                        Sistema de Inventario <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Cloud Native & IA.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Gestiona tu stock, factura electrónicamente y conecta tu negocio vía API. El primer sistema en Ecuador diseñado con <strong>Arquitectura Hexagonal</strong> para escalar.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <a
                            href="https://wa.me/593964065880?text=Hola%20Puka%2C%20quiero%20mis%20credenciales%20de%20acceso%20temporal%20(24h)%20para%20probar%20la%20Beta%20del%20Sistema%20de%20Inventario."
                            target="_blank"
                            onClick={() => handleConversion('hero_credentials')}
                            className="group bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 w-full md:w-auto"
                        >
                            <KeyIcon /> Solicitar Credenciales Demo (24h)
                        </a>
                        <p className="text-xs text-slate-500 font-mono">
                            <span className="text-green-500">●</span> No requiere tarjeta de crédito. Acceso inmediato.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. CONTROL TOTAL (Sustituye a IA) */}
            <section className="py-24 border-t border-white/5 bg-slate-900/50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="bg-slate-950 border border-white/10 rounded-xl p-6 shadow-2xl relative border-l-4 border-l-cyan-500">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-gray-400 font-mono text-xs">Venta Mostrador #001</span>
                                        <span className="text-green-400 font-bold text-xs">- 2 Unidades</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-gray-400 font-mono text-xs">Venta E-commerce #892</span>
                                        <span className="text-green-400 font-bold text-xs">- 1 Unidad</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-cyan-900/20 p-2 rounded">
                                        <span className="text-cyan-400 font-bold text-sm">STOCK ACTUALIZADO</span>
                                        <span className="text-white font-mono text-sm">14 Unidades</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-4">
                                <Globe size={20} /> Sincronización Real-Time
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Vende en web y mostrador sin romper tu stock.</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                El problema de usar Excel es que no se actualiza solo. Con nuestro sistema, si vendes una camiseta en tu E-commerce, se descuenta automáticamente de tu caja física. Cero errores, cero sobreventas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ARQUITECTURA API (Visual) */}
            <section className="py-24 border-t border-white/5 relative">
                <div className="absolute inset-0 bg-slate-950"></div>
                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">El Núcleo de tu Ecosistema.</h2>
                    <p className="text-slate-400 mb-16 text-lg">Tu inventario no es una isla. Conecta cualquier canal de venta presente o futuro mediante nuestra API REST.</p>

                    {/* Diagrama */}
                    <div className="relative flex items-center justify-center py-10">
                        {/* Circle Center */}
                        <div className="w-32 h-32 bg-cyan-600 rounded-full flex items-center justify-center z-20 shadow-[0_0_50px_rgba(8,145,178,0.5)]">
                            <Database size={48} className="text-white" />
                        </div>

                        {/* Orbiting Items */}
                        <div className="absolute w-[300px] h-[300px] border border-dashed border-white/20 rounded-full animate-spin-slow z-10"></div>

                        <div className="absolute top-0 transform -translate-y-1/2 bg-slate-900 border border-white/10 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <Globe size={16} className="text-green-400" /> Tienda Online
                        </div>
                        <div className="absolute bottom-0 transform translate-y-1/2 bg-slate-900 border border-white/10 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <Smartphone size={16} className="text-purple-400" /> Apps Delivery
                        </div>
                        <div className="absolute left-0 transform -translate-x-1/2 bg-slate-900 border border-white/10 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <Server size={16} className="text-yellow-400" /> SRI / Hacienda
                        </div>
                        <div className="absolute right-0 transform translate-x-1/2 bg-slate-900 border border-white/10 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <MessageSquare size={16} className="text-green-500" /> Chatbot Ventas
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CARACTERÍSTICAS CORE (Google Keywords) */}
            <section className="py-24 border-t border-white/5 bg-slate-900">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas para dejar el Excel.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-950 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                            <Zap className="text-yellow-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Facturación Ilimitada</h3>
                            <p className="text-slate-400 text-sm">Validación SRI en tiempo real. Envía XML y PDF al WhatsApp del cliente automáticamente.</p>
                        </div>
                        <div className="bg-slate-950 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                            <Cloud className="text-cyan-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Multibodega Cloud</h3>
                            <p className="text-slate-400 text-sm">Gestiona el stock de tu local, tu casa y tu bodega central desde una sola app.</p>
                        </div>
                        <div className="bg-slate-950 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                            <MessageSquare className="text-green-400 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Cierre de Caja WhatsApp</h3>
                            <p className="text-slate-400 text-sm">Recibe un reporte automático de ventas y stock crítico en tu celular cada noche.</p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <a
                            href="https://wa.me/593964065880?text=Hola%20Puka%2C%20quiero%20mis%20credenciales%20de%20acceso%20temporal%20(24h)%20para%20probar%20la%20Beta%20del%20Sistema%20de%20Inventario."
                            target="_blank"
                            onClick={() => handleConversion('footer_credentials')}
                            className="inline-flex bg-white text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors gap-2 items-center"
                        >
                            Quiero Probarlo Gratis <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER SIMPLE */}
            <footer className="py-8 border-t border-white/5 text-center text-xs text-slate-600 font-mono bg-slate-950">
                <p>© {new Date().getFullYear()} LedgerXpertz. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
);

export default InventarioPage;
