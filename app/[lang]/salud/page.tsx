'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import {
    Stethoscope,
    Search,
    CalendarCheck,
    Activity,
    ShieldCheck,
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

// Lazy load del video testimonial para velocidad máxima
const VideoTestimonial = dynamic(() => import('@/components/VideoTestimonial'), {
    loading: () => <div className="aspect-video bg-gray-100 animate-pulse rounded-xl border border-gray-200"></div>
});

const SaludPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    const handleCtaClick = (location: string) => {
        ga.trackWhatsAppDirectoClick(`salud_${location}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <SEO
                title="Publicidad para Consultorios Médicos y Marketing Clínicas | PukaDigital"
                description="Agencia especializada en Marketing Médico. Ayudamos a doctores y odontólogos a conseguir más pacientes con Google Ads. Mira nuestros casos de éxito."
                keywords="marketing medico ecuador, publicidad doctores, marketing odontologos, google ads salud, agencia marketing clinicas"
            />

            {/* HEADER MINIMALISTA (Solo Logo) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center h-16">
                    <Link href={`/${lang}`} className="flex items-center gap-2 group">
                        <div className="relative h-8 w-8">
                            <Image src="/pegaso-rojo.svg" fill className="object-contain" alt="Puka Health" />
                        </div>
                        <span className="font-bold text-gray-900 tracking-tight">PUKA<span className="text-blue-600">SALUD</span></span>
                    </Link>
                    <Link
                        href="https://wa.me/593964065880?text=Doctor(a),%20me%20interesa%20llenar%20mi%20agenda."
                        target="_blank"
                        onClick={() => handleCtaClick('header')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Solicitar Diagnóstico
                    </Link>
                </div>
            </header>

            {/* 1. HERO SECTION (La Promesa) */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-24 px-4 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <Stethoscope size={14} /> Marketing Médico Especializado
                    </div>

                    <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-gray-900 tracking-tight">
                        Publicidad para <br className="hidden md:block" />
                        <span className="text-blue-600">Consultorios Médicos</span> y Clínicas en Ecuador
                    </h1>

                    <h2 className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                        ¿Buscas <strong>cómo conseguir más pacientes</strong> sin depender del boca a boca? Llenamos tu agenda con pacientes calificados que buscan tu especialidad en Google hoy mismo.
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="#caso-exito"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                        >
                            Ver Caso de Estudio (Podología) <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            </section>

            {/* 2. EL PROBLEMA REAL (Agitación) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-xl mb-12">
                        <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
                            <Activity className="text-red-600" />
                            "Ser el mejor especialista no sirve si nadie te encuentra."
                        </h3>
                        <div className="space-y-4 text-red-800/80 text-lg">
                            <p>
                                Tus pacientes no están viendo bailes en TikTok. Están buscando <strong>"Dolor de [Tu Especialidad]"</strong> en Google a las 2 de la mañana.
                            </p>
                            <p>
                                Las agencias tradicionales te venden "likes" y diseños bonitos. Nosotros nos enfocamos en una sola métrica: <strong>Citas Agendadas</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. LA PRUEBA (El Arma Secreta: Cristina) */}
            <section id="caso-exito" className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest block mb-2">EVIDENCIA CLÍNICA</span>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                            De 3 a 53 pacientes al mes.
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Descubre cómo <strong>Podoclinic</strong> automatizó su captación de pacientes usando nuestro sistema de Google Ads Médico.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto shadow-2xl shadow-blue-900/10 rounded-2xl overflow-hidden bg-white p-2">
                        <VideoTestimonial
                            videoId="bSge9e1Se4w"
                            title="Testimonio Dra. Cristina Muñoz - PodoclinicEC"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="text-3xl font-black text-blue-600 mb-1">+330%</div>
                            <div className="text-sm text-gray-500 font-bold uppercase">Retorno de Inversión</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="text-3xl font-black text-blue-600 mb-1">Top 1</div>
                            <div className="text-sm text-gray-500 font-bold uppercase">Posición en Google</div>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="text-3xl font-black text-blue-600 mb-1">24/7</div>
                            <div className="text-sm text-gray-500 font-bold uppercase">Agendamiento Auto</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. EL MÉTODO MÉDICO (Solución) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Nuestro Protocolo de 3 Pasos</h2>
                        <p className="text-gray-500">Tratamos tu marketing con el mismo rigor que tú tratas a tus pacientes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Paso 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">1. Diagnóstico Digital</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                No adivinamos. Analizamos radiográficamente qué buscan los pacientes en tu zona (Ej: "Odontólogo en Cumbayá" o "Ginecólogo cerca de mí").
                            </p>
                        </div>

                        {/* Paso 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">2. Receta de Relevancia</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Creamos una Landing Page ética, rápida y profesional que genera confianza inmediata. Sin distracciones, enfocada en que el paciente reserve.
                            </p>
                        </div>

                        {/* Paso 3 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">3. Tratamiento de Tráfico</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Activamos campañas de Google Ads de alta precisión. Optimizamos para conversiones ("Pedir Cita" / "WhatsApp"), no para métricas de vanidad.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. PRECIOS / CTA FINAL */}
            <section className="py-24 bg-blue-900 text-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-8">
                        ¿Listo para llenar tu agenda?
                    </h2>
                    <p className="text-blue-200 text-xl mb-12 max-w-2xl mx-auto">
                        Plan Especialistas: Solo pagas por resultados gestionados. <br />
                        <span className="text-white font-bold">Sin contratos de permanencia de 1 año.</span>
                    </p>

                    <Link
                        href="https://wa.me/593964065880?text=Hola,%20soy%20medico%20y%20quiero%20mas%20pacientes."
                        target="_blank"
                        onClick={() => handleCtaClick('footer_cta')}
                        className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-5 rounded-full font-black text-xl hover:bg-blue-50 transition-all shadow-2xl hover:scale-105"
                    >
                        <CalendarCheck size={24} />
                        Solicitar Auditoría Gratuita
                    </Link>
                    <p className="mt-8 text-sm text-blue-400 opacity-80">
                        Cupos limitados por sector geográfico para evitar competencia entre nuestros propios clientes.
                    </p>
                </div>
            </section>

            {/* FOOTER SIMPLE */}
            <footer className="bg-blue-950 py-12 text-center text-blue-200/50 text-sm border-t border-blue-900">
                <p>© {new Date().getFullYear()} PukaSalud. Una división de PukaDigital.</p>
            </footer>
        </div>
    );
};

export default SaludPage;
