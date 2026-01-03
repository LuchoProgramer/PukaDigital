'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingBag,
    MessageSquare,
    ArrowRight,
    Layers,
    Cpu,
    Globe,
    BookOpen,
    Shield
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import ManifestoSection from '@/components/ManifestoSection';

const SistemaHubPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-puka-red selection:text-white">
            <SEO
                title="Sistemas de Ventas y Automatización para Pymes Ecuador | PukaDigital"
                description="Plataforma integral para emprendedores. Encuentra soluciones de Inventario, Facturación Electrónica y Chatbots con IA. Sin rentas mensuales."
                keywords="sistema de ventas ecuador, digitalizacion negocios, inventario cloud, chatbot ia, software emprendedores"
            />

            {/* NAVBAR SIMPLE (SOLO PARA HUB) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href={`/${lang}`} className="font-display font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
                        PUKA<span className="text-puka-red">DIGITAL</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-bold text-gray-500">
                        <Link href={`/${lang}/blog`} className="hover:text-puka-red transition-colors">Recursos</Link>
                        <Link href={`/${lang}/agencia`} className="hover:text-puka-red transition-colors">Servicios Corporativos</Link>
                    </nav>
                </div>
            </header>

            {/* 1. HERO SECTION (La Visión) */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto max-w-5xl text-center">
                    <div className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
                        Infraestructura Digital v2.0
                    </div>

                    <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight leading-[1.1]">
                        El Ecosistema Digital para <br className="hidden md:block" />
                        Emprendedores Independientes.
                    </h1>

                    <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed">
                        No somos una suite de herramientas sueltas. Somos una plataforma modular que crece contigo. Empieza ordenando tu bodega o automatizando tus mensajes.
                    </p>

                    {/* Gráfico Conceptual Simplificado */}
                    <div className="relative max-w-3xl mx-auto h-[300px] md:h-[400px] flex items-center justify-center">
                        {/* Conexiones animadas */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[80%] h-[80%] border border-dashed border-gray-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
                            <div className="absolute w-[60%] h-[60%] border border-dashed border-gray-200 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                        </div>

                        {/* Nodos */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-24 h-24 bg-puka-black text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <span className="font-display font-bold text-xl">PUKA</span>
                            </div>
                            <span className="text-xs font-bold uppercase text-gray-400">Core Central</span>
                        </div>

                        {/* Satélites */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 md:translate-x-12 translate-x-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-float">
                            <Layers className="text-cyan-500 mb-2" size={24} />
                            <div className="text-xs font-bold">Inventario</div>
                        </div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 md:-translate-x-12 -translate-x-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-float-delayed">
                            <Cpu className="text-purple-500 mb-2" size={24} />
                            <div className="text-xs font-bold">IA Chatbot</div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                            <Globe className="text-green-500 mb-2" size={24} />
                            <div className="text-xs font-bold">Web Sales</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. GRID DE SOLUCIONES (Hub Central) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">¿Qué problema quieres resolver hoy?</h2>
                        <div className="w-16 h-1 bg-puka-red mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* CARD A: Inventario */}
                        <Link href={`/${lang}/inventario`} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:border-cyan-500 hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                            <div className="p-8 md:p-12">
                                <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <ShoppingBag size={28} className="text-cyan-600" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-cyan-600 transition-colors">Sistema de Gestión & Facturación</h3>
                                <p className="text-gray-500 mb-6 text-lg leading-relaxed">
                                    Para quienes sufren con Excel. Controla tu stock físico, conecta con Delyvery Apps y factura al SRI automáticamente.
                                </p>
                                <div className="flex items-center gap-2 text-cyan-600 font-bold group-hover:gap-4 transition-all">
                                    Explorar LedgerXpertz <ArrowRight size={20} />
                                </div>
                            </div>
                            {/* Falso UI de fondo */}
                            <div className="absolute bottom-0 right-0 w-48 h-32 bg-gray-50 rounded-tl-full opacity-50 group-hover:bg-cyan-50 transition-colors"></div>
                        </Link>

                        {/* CARD B: Chatbot */}
                        <Link href={`/${lang}/chatbot`} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:border-purple-500 hover:shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                            <div className="p-8 md:p-12">
                                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageSquare size={28} className="text-purple-600" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-purple-600 transition-colors">Automatización & Ventas IA</h3>
                                <p className="text-gray-500 mb-6 text-lg leading-relaxed">
                                    Para quienes pierden clientes por no contestar. Un asistente RAG que lee tus manuales y vende por WhatsApp 24/7.
                                </p>
                                <div className="flex items-center gap-2 text-purple-600 font-bold group-hover:gap-4 transition-all">
                                    Conocer PukaAI <ArrowRight size={20} />
                                </div>
                            </div>
                            {/* Falso UI de fondo */}
                            <div className="absolute bottom-0 right-0 w-48 h-32 bg-gray-50 rounded-tl-full opacity-50 group-hover:bg-purple-50 transition-colors"></div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. FILOSOFÍA (SEO de Marca) */}
            <section className="py-24 bg-puka-black text-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <Shield className="mx-auto text-puka-red mb-6" size={48} strokeWidth={1.5} />
                    <h2 className="font-display font-bold text-4xl md:text-5xl mb-8">
                        Dignidad Digital: Nuestra Filosofía
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed">
                        Creemos que el software no debe ser una renta eterna. <br />
                        Diseñamos sistemas que te dan <strong>propiedad y control</strong>, no dependencias abusivas. Tu base de datos es tuya. Tu código es tuyo.
                    </p>
                </div>
            </section>

            {/* 4. MANIFIESTO */}
            <ManifestoSection />

            {/* 5. RECURSOS RÁPIDOS (SEO Links) */}
            <section className="py-24 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-10 text-center">Aprende a digitalizar tu negocio</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href={`/${lang}/blog`} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                            <BookOpen size={24} className="text-gray-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Blog de Estrategia</h3>
                            <p className="text-sm text-gray-500">Artículos sobre tendencias B2B y growth hacking.</p>
                        </Link>
                        <div className="bg-white p-6 rounded-lg border border-gray-200 opacity-60 cursor-not-allowed">
                            <Layers size={24} className="text-gray-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Guía Facturación SRI</h3>
                            <p className="text-sm text-gray-500">Próximamente: Manual completo de tramas XML.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200 opacity-60 cursor-not-allowed">
                            <MessageSquare size={24} className="text-gray-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">Scripts de Ventas</h3>
                            <p className="text-sm text-gray-500">Próximamente: Plantillas para cerrar por WhatsApp.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer custom para Hub */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} PukaDigital Ecosystem. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default SistemaHubPage;
