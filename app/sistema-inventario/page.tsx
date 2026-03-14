'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    TrendingUp,
    Package,
    Users,
    FileText,
    CheckCircle,
    ArrowRight,
    Smartphone,
    AlertCircle,
    BarChart4,
    Zap,
    Lock
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

export default function SistemaInventarioPage() {
    const { t } = useTranslation();
    const [empleados, setEmpleados] = useState(3);
    const [productos, setProductos] = useState(100);

    // ROI Calculation (Copying logic but making it visual)
    const horasPorSemanaExcel = empleados * 8;
    const costoMensualExcel = (horasPorSemanaExcel * 4 * 3);
    const errorInventario = productos * 0.15 * 30;
    const ahorroTotal = costoMensualExcel + errorInventario;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "LedgerXpertz - Sistema de Inventario Inteligente",
        "description": "El sistema de gestión de inventarios que te libera de Excel. Integración SRI Ecuador, multi-tenant y acceso móvil.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "offers": {
            "@type": "Offer",
            "price": "20.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white">
            <SEO
                title="LedgerXpertz | El Inventario que las Agencias No Quieren que Tengas"
                description="Libérate de Excel. LedgerXpertz es el sistema de gestión definitivo para PYMEs en Ecuador. Facturación SRI, control de stock y reportes 24/7."
                keywords="sistema inventario ecuador, ledgerxpertz, facturacion sri, control de stock pymes, erp ecuador"
                structuredData={structuredData}
            />

            {/* HERO SECTION - PUKA STYLE */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-puka-red/5 -skew-x-12 transform origin-right"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl">
                        <div className="inline-flex items-center gap-2 bg-puka-red text-white px-4 py-1.5 rounded-sm mb-8 text-sm font-bold tracking-wider animate-fade-in">
                            <Zap size={16} fill="white" />
                            {t('ledgerxpertz.badge')}
                        </div>

                        <h1 className="font-display font-bold text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tight text-puka-black dark:text-white">
                            {t('ledgerxpertz.hero_h1')}<br />
                            <span className="text-puka-red inline-block mt-2 underline decoration-4 underline-offset-8">
                                {t('ledgerxpertz.hero_h1_highlight')}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl font-sans">
                            {t('ledgerxpertz.hero_desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <a
                                href="https://app.ledgerxpertz.com"
                                className="group bg-puka-black dark:bg-white text-white dark:text-puka-black px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-puka-red dark:hover:bg-puka-red dark:hover:text-white transition-all flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(199,23,30,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                            >
                                {t('ledgerxpertz.cta_app')}
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </a>

                            <div className="py-4 px-2 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-puka-red font-bold">
                                    <span className="flex gap-0.5">
                                        <span className="w-3 h-3 bg-puka-red rounded-full overflow-hidden"></span>
                                        <span className="w-3 h-3 bg-puka-red rounded-full overflow-hidden"></span>
                                        <span className="w-3 h-3 bg-puka-red rounded-full overflow-hidden"></span>
                                        <span className="w-3 h-3 bg-gray-300 rounded-full overflow-hidden"></span>
                                        <span className="w-3 h-3 bg-gray-300 rounded-full overflow-hidden"></span>
                                    </span>
                                    <span className="text-sm uppercase tracking-tighter">Últimos 2 cupos para implementación</span>
                                </div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">
                                    {t('ledgerxpertz.hero_tagline')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EL ENEMIGO SECTION */}
            <section className="py-24 bg-puka-black text-white overflow-hidden relative">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 text-[15rem] font-display font-black text-white/5 select-none leading-none">
                                !
                            </div>
                            <h2 className="font-display font-bold text-5xl md:text-6xl mb-8 leading-tight relative z-10">
                                {t('ledgerxpertz.enemy_title')}
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                                {t('ledgerxpertz.enemy_desc')}
                            </p>

                            <div className="space-y-4">
                                {[
                                    t('ledgerxpertz.compare_excel_point_1'),
                                    t('ledgerxpertz.compare_excel_point_2'),
                                    t('ledgerxpertz.compare_excel_point_3'),
                                    t('ledgerxpertz.compare_excel_point_4')
                                ].map((point, i) => (
                                    <div key={i} className="flex items-center gap-4 text-lg font-bold text-red-400">
                                        <AlertCircle size={24} className="shrink-0" />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-sm relative group overflow-hidden">
                            <div className="absolute inset-0 bg-puka-red/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <h3 className="font-display font-bold text-3xl mb-8 text-puka-red flex items-center gap-3">
                                    <ShieldCheck size={32} />
                                    {t('ledgerxpertz.compare_puka')}
                                </h3>

                                <div className="space-y-6">
                                    {[
                                        t('ledgerxpertz.compare_puka_point_1'),
                                        t('ledgerxpertz.compare_puka_point_2'),
                                        t('ledgerxpertz.compare_puka_point_3'),
                                        t('ledgerxpertz.compare_puka_point_4')
                                    ].map((point, i) => (
                                        <div key={i} className="flex items-center gap-4 text-xl font-bold">
                                            <CheckCircle size={24} className="text-puka-red shrink-0" />
                                            {point}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-puka-beige text-puka-black rounded-sm">
                                    <div className="text-sm font-bold uppercase tracking-widest mb-1">{t('ledgerxpertz.savings_title')}</div>
                                    <div className="text-4xl font-black">{t('ledgerxpertz.savings_amount')}</div>
                                    <p className="text-sm mt-1 font-medium">{t('ledgerxpertz.savings_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALCULATOR - ROI SECTION */}
            <section className="py-24 bg-puka-beige text-puka-black">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display font-bold text-5xl text-center mb-16 underline decoration-puka-red decoration-8 underline-offset-8">
                            {t('roi.title')}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-12 bg-white p-10 rounded-sm shadow-xl border-t-8 border-puka-red">
                            <div className="space-y-10">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-4 text-gray-500">
                                        {t('ledgerxpertz.compare_excel')}: Empleados/Puntos de Venta
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={empleados}
                                        onChange={(e) => setEmpleados(Number(e.target.value))}
                                        className="w-full h-3 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-xl">{empleados}</span>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('roi.years_label')}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-4 text-gray-500">
                                        Cargas de Inventario (Productos)
                                    </label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="2000"
                                        step="50"
                                        value={productos}
                                        onChange={(e) => setProductos(Number(e.target.value))}
                                        className="w-full h-3 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-xl">{productos} items</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="p-8 bg-puka-black text-white rounded-sm text-center relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-puka-red text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest">
                                        Pérdida Anual Estimada
                                    </div>
                                    <div className="text-5xl font-black text-puka-red mb-2">
                                        ${(ahorroTotal * 12).toLocaleString()}
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">
                                        En tiempo malgastado y errores de stock
                                    </p>

                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <div className="text-xs font-bold text-gray-500 uppercase mb-4">Solución LedgerXpertz</div>
                                        <div className="text-2xl font-black text-white">
                                            $240 <span className="text-sm text-gray-500 italic">anual</span>
                                        </div>
                                        <div className="text-green-500 font-bold mt-2 flex items-center justify-center gap-1">
                                            <TrendingUp size={16} />
                                            Ahorro del 95%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN API & CATÁLOGO - THE TECH POWER */}
            <section className="py-24 bg-puka-black text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-puka-red to-transparent"></div>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="font-display font-bold text-5xl mb-6">
                                {t('ledgerxpertz.api_title')}
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                {t('ledgerxpertz.api_desc')}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <div className="text-puka-red font-black text-xs uppercase mb-2">Conectividad</div>
                                    <div className="text-lg font-bold">100% Headless</div>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <div className="text-puka-red font-black text-xs uppercase mb-2">Velocidad</div>
                                    <div className="text-lg font-bold">&lt; 100ms Latency</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-puka-red p-10 rounded-sm shadow-2xl relative group">
                            <div className="absolute -top-4 -left-4 bg-puka-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest z-20">
                                Feature Exclusiva
                            </div>
                            <h3 className="font-display font-bold text-3xl mb-4 italic">
                                {t('ledgerxpertz.catalog_title')}
                            </h3>
                            <p className="text-white/90 mb-8 font-bold">
                                {t('ledgerxpertz.catalog_desc')}
                            </p>
                            <div className="bg-white/10 backdrop-blur-md p-6 border border-white/20 rounded-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-puka-red">
                                        <Smartphone size={24} />
                                    </div>
                                    <div className="font-bold">
                                        Sincronización Total<br />
                                        <span className="text-xs opacity-70">Stock Real vs. Vista Cliente</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION - MINIMALIST & AGGRESSIVE */}
            <section className="py-24 bg-white dark:bg-puka-black">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-display font-bold text-5xl md:text-7xl mb-4 italic">
                        El Precio de tu <span className="text-puka-red">Libertad.</span>
                    </h2>
                    <p className="text-xl text-gray-500 mb-16 uppercase tracking-widest font-bold">
                        {t('ledgerxpertz.pricing_title')}
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <div className="absolute -top-6 -right-6 bg-puka-red text-white text-xs font-black p-4 rounded-full rotate-12 shadow-xl animate-pulse">
                            SIN<br />CONTRATOS
                        </div>

                        <div className="bg-puka-black text-white p-12 rounded-sm border-b-[16px] border-puka-red shadow-2xl transition-transform hover:-translate-y-2">
                            <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest mb-6">PLAN SME (PYME)</div>
                            <div className="text-8xl font-black mb-4">
                                <span className="text-3xl align-top mr-1 font-display">$</span>20
                            </div>
                            <div className="text-gray-400 font-bold uppercase tracking-widest mb-8">{t('ledgerxpertz.pricing_desc')}</div>

                            <div className="space-y-4 mb-10 text-left">
                                {[
                                    t('ledgerxpertz.faq_sri'),
                                    t('products.erp_feat_2'),
                                    t('products.erp_feat_3'),
                                    'Hasta 5 usuarios incluidos'
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 font-bold">
                                        <CheckCircle className="text-puka-red" size={20} />
                                        {feat}
                                    </div>
                                ))}
                            </div>

                            <a
                                href="https://app.ledgerxpertz.com"
                                className="block w-full bg-white text-puka-black py-5 rounded-sm font-display font-black text-xl hover:bg-puka-red hover:text-white transition-colors uppercase italic"
                            >
                                Registrarme Ahora
                            </a>
                        </div>
                        <p className="mt-6 text-gray-500 font-bold text-sm italic">
                            * {t('form.scarcity')}
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-24 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-display font-bold text-4xl mb-12 text-center text-puka-black dark:text-white underline decoration-puka-red decoration-4 underline-offset-4">
                            Preguntas Directas
                        </h2>

                        <div className="space-y-4">
                            {[
                                { q: t('ledgerxpertz.faq_sri'), a: t('ledgerxpertz.faq_sri_a') },
                                { q: t('ledgerxpertz.faq_mobile'), a: t('ledgerxpertz.faq_mobile_a') },
                                { q: '¿Qué tan difícil es migrar desde Excel?', a: 'Dura exactamente lo que tardas en subir un archivo .csv. Nosotros te ayudamos en el proceso si tienes más de 100 productos.' },
                                { q: '¿Mis datos están seguros?', a: 'Cifrado de grado bancario (SSL) y backups diarios automáticos. Tus datos son un activo, no un juego.' }
                            ].map((faq, i) => (
                                <details key={i} className="group bg-white dark:bg-puka-black p-6 rounded-sm border border-gray-200 dark:border-white/10 shadow-sm transition-all open:ring-2 open:ring-puka-red">
                                    <summary className="font-bold text-xl cursor-pointer list-none flex justify-between items-center text-puka-black dark:text-white">
                                        {faq.q}
                                        <span className="text-puka-red text-2xl group-open:rotate-45 transition-transform">+</span>
                                    </summary>
                                    <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA - THE CLOSER */}
            <section className="py-32 bg-puka-red text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-puka-black rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="font-display font-bold text-6xl md:text-8xl mb-8 tracking-tighter italic">
                        DEJA DE <span className="text-puka-black underline decoration-white">PERDER</span> DINERO.
                    </h2>
                    <p className="text-2xl mb-12 font-bold max-w-2xl mx-auto opacity-90">
                        Únete a la nueva era de gestión digital en Ecuador. LedgerXpertz es la herramienta que te da el control real.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center max-w-xl mx-auto">
                        <a
                            href="https://app.ledgerxpertz.com"
                            className="bg-white text-puka-red px-10 py-6 rounded-sm font-display font-black text-2xl hover:bg-puka-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
                        >
                            EMPEZAR GRATIS
                            <ArrowRight />
                        </a>
                        <Link
                            href="/contacto"
                            className="bg-puka-black/20 backdrop-blur-md border-2 border-white/30 text-white px-10 py-6 rounded-sm font-display font-bold text-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                        >
                            SOLICITAR DEMO
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1"><Lock size={14} /> 100% SEGURO</span>
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        <span>SIN COMPROMISOS</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
