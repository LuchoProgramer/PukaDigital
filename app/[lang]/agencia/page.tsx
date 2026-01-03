'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Smartphone, Globe, BarChart3, CloudLightning, ShieldCheck, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';

export default function AgenciaPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* SEO Específico */}
            <SEO
                title="Agencia de Marketing Digital & Desarrollo Web | PukaDigital"
                description="Estrategias de alto rendimiento y tecnología propia desde Quito. Desarrollo Web Next.js y Google Ads para empresas que buscan ROI, no likes."
                keywords="agencia marketing digital ecuador, desarrollo web quito, google ads ecuador, nextjs ecuador, seo tecnico"
            />

            {/* NAVBAR ESPECÍFICO (Visual) */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-display font-black text-2xl tracking-tighter text-gray-900">
                            PUKA<span className="text-puka-red">DIGITAL</span>
                        </Link>
                        <div className="hidden md:block h-6 w-px bg-gray-200"></div>
                        <span className="hidden md:block text-sm font-medium text-gray-500 uppercase tracking-widest">
                            Agencia de Alto Rendimiento
                        </span>
                    </div>
                    <a
                        href="https://wa.me/593964065880?text=Hola,%20me%20interesa%20una%20consultoría%20para%20mi%20empresa."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900 text-white px-5 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors"
                    >
                        Consultoría Técnica
                    </a>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-20 pb-32 border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-16 items-center">

                        {/* Copy */}
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider border border-blue-100">
                                <Globe size={12} />
                                Oficinas Centrales: Quito | Cobertura Nacional
                            </div>

                            <h1 className="font-display font-bold text-5xl md:text-6xl text-gray-900 leading-[1.1]">
                                Agencia de Marketing Digital y Desarrollo Web en <span className="text-blue-700">Ecuador</span>.
                            </h1>

                            <h2 className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                Estrategias de alto rendimiento y tecnología propia desde Quito para todo el país. Construimos activos digitales que son <strong className="text-gray-900">100% tuyos</strong>, sin rentas mensuales ni "impuestos al éxito".
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a
                                    href="https://wa.me/593964065880?text=Hola,%20quisiera%20agendar%20una%20consultoría%20técnica."
                                    className="bg-puka-red text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                                >
                                    Solicitar Consultoría Técnica
                                </a>
                                <a
                                    href="#casos"
                                    className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-sm font-bold text-lg hover:border-gray-900 transition-colors text-center flex items-center justify-center gap-2 group"
                                >
                                    Ver Casos de ROI <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* Visual Abstracto (Representando Estructura/Código) */}
                        <div className="flex-1 relative hidden md:block">
                            <div className="relative z-10 bg-white p-8 rounded-sm shadow-2xl border border-gray-100 transform rotate-1">
                                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <div className="ml-auto text-xs text-gray-400 font-mono">deployment_status: success</div>
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between items-center text-gray-500">
                                        <span>Performance Score</span>
                                        <span className="text-green-600 font-bold">98/100</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[98%]"></div>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 mt-4">
                                        <span>Conversion Rate</span>
                                        <span className="text-blue-600 font-bold">+15.4%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full w-[65%]"></div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded border border-gray-100 mt-6 text-gray-600">
                                        <code>
                                            <span className="text-blue-600">const</span> <span className="text-purple-600">assetOwnership</span> = <span className="text-green-600">true</span>;<br />
                                            <span className="text-blue-600">const</span> <span className="text-purple-600">monthlyRent</span> = <span className="text-red-500">0</span>;
                                        </code>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative background blob */}
                            <div className="absolute top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-puka-red/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EL ANTI-SERVICIO (FILTRO) */}
            <section className="py-24 bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <span className="text-puka-red font-bold tracking-widest uppercase text-sm mb-4 block">Filtro de Calidad</span>
                    <h2 className="font-display font-bold text-3xl md:text-4xl mb-8 text-gray-900">Lo que <span className="text-puka-red underline decoration-4 decoration-puka-red/20">NO</span> hacemos</h2>

                    <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-200">
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
                            "No gestionamos redes sociales para 'likes'. No hacemos posts de relleno. Nos enfocamos exclusivamente en <strong className="text-gray-900">Infraestructura</strong> (Webs rápidas) y <strong className="text-gray-900">Adquisición</strong> (Google Ads/SEO) para generar ventas."
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="flex items-center gap-3 text-gray-400 line-through decoration-gray-400">
                                <XCircle className="text-red-300" /> Community Management Genérico
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 line-through decoration-gray-400">
                                <XCircle className="text-red-300" /> Diseños "bonitos" sin conversión
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 line-through decoration-gray-400">
                                <XCircle className="text-red-300" /> Contratos de permanencia forzosa
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 line-through decoration-gray-400">
                                <XCircle className="text-red-300" /> Métricas de vanidad (Likes/Shares)
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GRID DE SERVICIOS - HIGH PERFORMANCE */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">Arquitectura de Alto Rendimiento</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Nuestros 3 pilares para empresas que facturan.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group p-8 rounded-sm border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 bg-white hover:bg-blue-50/30">
                            <div className="w-14 h-14 bg-gray-50 rounded-sm flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                <CloudLightning className="text-gray-900 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-900">Web High-Performance</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Desarrollo a medida en <strong>Next.js</strong> (la tecnología de React). Velocidad de carga inferior a 2s. Propiedad absoluta del código fuente.
                            </p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={14} className="text-blue-600" /> Hosting Vercel/AWS
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={14} className="text-blue-600" /> Sin mensualidades
                                </li>
                            </ul>
                        </div>

                        {/* Card 2 */}
                        <div className="group p-8 rounded-sm border border-gray-100 hover:border-red-100 hover:shadow-xl transition-all duration-300 bg-white hover:bg-red-50/30">
                            <div className="w-14 h-14 bg-gray-50 rounded-sm flex items-center justify-center mb-6 group-hover:bg-puka-red transition-colors">
                                <BarChart3 className="text-gray-900 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-900">Google Ads & Tráfico</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Campañas de <strong>intención de compra (Search)</strong>, no de interrupción. Atrapamos a clientes que ya están buscando lo que ofreces.
                            </p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={14} className="text-puka-red" /> Configuración de Conversiones
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={14} className="text-puka-red" /> Auditoría de Quality Score
                                </li>
                            </ul>
                        </div>

                        {/* Card 3 */}
                        <div className="group p-8 rounded-sm border border-gray-100 hover:border-green-100 hover:shadow-xl transition-all duration-300 bg-white hover:bg-green-50/30">
                            <div className="w-14 h-14 bg-gray-50 rounded-sm flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                                <ShieldCheck className="text-gray-900 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-900">SEO & GEO (IA Ready)</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Posicionamiento en Google tradicional y optimización para los nuevos <strong>Motores de Respuesta IA</strong> (ChatGPT, Perplexity, Gemini).
                            </p>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={14} className="text-green-600" /> Optimización Semántica
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <CheckCircle size={14} className="text-green-600" /> Fichas de Google Maps
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER SIMPLE */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="font-display font-bold text-2xl mb-4">¿Listo para escalar la infraestructura de tu empresa?</h3>
                    <p className="text-gray-400 mb-8">Agenda una sesión técnica de 15 minutos con el equipo Senior.</p>
                    <a
                        href="https://wa.me/593964065880"
                        className="inline-block bg-white text-gray-900 px-8 py-3 rounded-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        Hablar con un Ingeniero
                    </a>
                    <div className="mt-12 text-xs text-gray-600">
                        © {new Date().getFullYear()} PukaDigital High-Performance Agency. Quito, Ecuador.
                    </div>
                </div>
            </footer>

        </div>
    );
}
