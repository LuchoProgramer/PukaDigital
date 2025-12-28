'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    CheckCircle,
    ArrowRight,
    ShieldCheck,
    Zap,
    AlertCircle,
    BarChart3,
    DollarSign,
    Search,
    Target
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';
import LeadForm from '@/components/LeadForm';

export default function CostoPublicidadGooglePage() {
    const { t } = useTranslation();
    const [inversionMensual, setInversionMensual] = useState(500);
    const [comisionAgencia, setComisionAgencia] = useState(20);

    // Cálculos Quirúrgicos
    const costoGestionMensual = (inversionMensual * comisionAgencia) / 100;
    const ahorroAnual = costoGestionMensual * 12;
    const clicsExtras = Math.floor(costoGestionMensual / 0.50); // Asumiendo un CPC promedio de $0.50

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "¿Cuánto cuesta realmente la publicidad en Google en Ecuador? (Guía 2025)",
        "description": "Desglose completo de costos de Google Ads en Ecuador. Aprende a ahorrar el 20% de comisión de agencias y toma el control de tu inversión.",
        "author": {
            "@type": "Organization",
            "name": "PukaDigital"
        },
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        "datePublished": "2025-12-27"
    };

    return (
        <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white font-sans">
            <SEO
                title="¿Cuánto Cuesta la Publicidad en Google en Ecuador? | Puka Digital"
                description="No pagues de más por aparecer en Google. Te enseñamos el costo real por clic, cuánto invertir y cómo ahorrarte la comisión del 20% de las agencias."
                keywords="costo publicidad google ecuador, cuanto cuesta google ads, publicidad en google quito, seo vs sem ecuador"
                structuredData={structuredData}
            />

            {/* HERO SECTION - THE HOOK */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-puka-red/5 -skew-x-12 transform origin-right"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl">
                        <div className="inline-flex items-center gap-2 bg-puka-red text-white px-4 py-1.5 rounded-sm mb-8 text-sm font-bold tracking-wider uppercase italic">
                            <Target size={16} fill="white" />
                            Guía de Inversión Transparente 2025
                        </div>

                        <h1 className="font-display font-bold text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tight">
                            ¿Cuánto Cuesta <br />
                            <span className="text-puka-red inline-block mt-2 underline decoration-4 underline-offset-8 italic">
                                Aparecer en Google?
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl font-sans">
                            No dejes que una agencia se quede con el 20% de tu dinero por "gestionar" tus anuncios. El 100% de tu inversión debe ir a conseguir clientes, no a pagar comisiones eternas.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <a
                                href="#calculadora-ahorro"
                                className="group bg-puka-black dark:bg-white text-white dark:text-puka-black px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-puka-red dark:hover:bg-puka-red dark:hover:text-white transition-all flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(199,23,30,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                            >
                                Calcular Mi Ahorro
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </a>

                            <div className="py-4 px-2 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-puka-red font-bold">
                                    <span className="flex gap-0.5">
                                        <span className="w-3 h-3 bg-puka-red rounded-full"></span>
                                        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                                    </span>
                                    <span className="text-sm uppercase tracking-tighter italic">Estrategia quirurjica para PYMEs</span>
                                </div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">
                                    GOOGLE ADS • BING ADS • SEO LOCAL • RETORNO REAL
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EL PROBLEMA: EL IMPUESTO DE LAS AGENCIAS */}
            <section className="py-24 bg-puka-black text-white overflow-hidden relative">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-display font-bold text-5xl md:text-6xl mb-8 leading-tight">
                                El "Impuesto" Oculto <br /><span className="text-puka-red">de las Agencias.</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                                La mayoría de agencias en Ecuador te cobran una comisión mensual por "apuntar tus anuncios". Si inviertes $1,000, ellas se quedan con $200.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                                    <AlertCircle size={24} className="shrink-0 mt-1" />
                                    Ese dinero (el 20%) podría estar trayéndote 400 clics más cada mes.
                                </div>
                                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                                    <AlertCircle size={24} className="shrink-0 mt-1" />
                                    Pagar una comisión fija te hace dependiente del presupuesto, no de los resultados.
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-10 rounded-sm relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <DollarSign size={100} />
                            </div>
                            <h3 className="font-display font-bold text-3xl mb-8 italic">Desglose de Costos Reales</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-gray-400">Costo por Clic (CPC)</span>
                                    <span className="font-bold text-xl">$0.10 - $2.00</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-gray-400">Comisión Agencia (Típica)</span>
                                    <span className="font-bold text-xl text-puka-red">20% - 30%</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-gray-400">Impuestos (Senescyt/Iva)</span>
                                    <span className="font-bold text-xl">Sujeto a ley EC</span>
                                </div>
                                <div className="mt-8 p-4 bg-puka-red/20 rounded-sm border border-puka-red/50">
                                    <p className="text-sm font-bold italic">
                                        "En PukaDigital te enseñamos a configurar tu cuenta para que pagues DIRECTO a Google. Sin intermediarios, sin retenciones innecesarias."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALCULADORA DE AHORRO QUIRURGICA */}
            <section id="calculadora-ahorro" className="py-24 bg-puka-beige text-puka-black transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-display font-bold text-5xl italic decoration-puka-red decoration-8 underline underline-offset-8 inline-block">
                                Deja de Quemar Dinero.
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 bg-white p-12 rounded-sm shadow-2xl border border-puka-black/5">
                            <div className="space-y-10">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-4">Inversión Mensual en Google</label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="5000"
                                        step="100"
                                        value={inversionMensual}
                                        onChange={(e) => setInversionMensual(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                                    />
                                    <div className="text-3xl font-black mt-2 font-display italic">${inversionMensual} / mes</div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-4">Comisión de Agencia (%)</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="40"
                                        step="5"
                                        value={comisionAgencia}
                                        onChange={(e) => setComisionAgencia(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer accent-puka-red"
                                    />
                                    <div className="text-3xl font-black mt-2 font-display italic">{comisionAgencia}%</div>
                                </div>
                            </div>

                            <div className="bg-puka-black text-white p-8 rounded-sm text-center relative border-l-[12px] border-puka-red">
                                <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60 italic">Dinero que recuperas</div>
                                <div className="text-6xl font-black text-puka-red">${costoGestionMensual.toLocaleString()}</div>
                                <p className="text-xs mt-4 font-bold uppercase tracking-[0.2em] italic">Costo de gestión eliminado</p>

                                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-green-500">${ahorroAnual.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold uppercase opacity-50 italic">Ahorro Anual</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-puka-red">+{clicsExtras}</div>
                                        <div className="text-[10px] font-bold uppercase opacity-50 italic">Clics Extras / mes</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LA ESTRATEGIA PUKA - INDEPENDENCIA TOTAL */}
            <section className="py-24 bg-white dark:bg-puka-black">
                <div className="container mx-auto px-6">
                    <h2 className="font-display font-bold text-5xl md:text-7xl text-center mb-16 italic uppercase tracking-tighter">
                        Nuestra Ofensiva <span className="text-puka-red">Digital.</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 rounded-sm hover:border-puka-red transition-all group">
                            <div className="text-puka-red mb-6 group-hover:scale-110 transition-transform"><Search size={48} /></div>
                            <h3 className="font-display font-bold text-2xl mb-4 italic uppercase">1. SEO de "Guerrilla"</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                No pagues por clics de $4 dólares. Posicionamos tu negocio orgánicamente para que el tráfico sea gratuito para siempre.
                            </p>
                        </div>
                        <div className="p-8 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 rounded-sm hover:border-puka-red transition-all group">
                            <div className="text-puka-red mb-6 group-hover:scale-110 transition-transform"><BarChart3 size={48} /></div>
                            <h3 className="font-display font-bold text-2xl mb-4 italic uppercase">2. Ads Autogestionados</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                Te instalamos la cuenta y te enseñamos a usar los primeros $300 que te regalamos. Tú tienes el control del grifo del dinero.
                            </p>
                        </div>
                        <div className="p-8 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 rounded-sm hover:border-puka-red transition-all group">
                            <div className="text-puka-red mb-6 group-hover:scale-110 transition-transform"><Zap size={48} /></div>
                            <h3 className="font-display font-bold text-2xl mb-4 italic uppercase">3. Chatbot IA Cierra-Ventas</h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                De nada sirve pagar publicidad si no respondes a tiempo. Tu asistente virtual atiende cada clic en menos de 30 segundos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARATIVA TRANSPARENTE */}
            <section className="py-24 bg-puka-black text-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto overflow-hidden border border-white/10 rounded-sm">
                        <table className="w-full text-left">
                            <thead className="bg-white text-puka-black font-display uppercase italic text-sm">
                                <tr>
                                    <th className="p-6">Transparencia de Costos</th>
                                    <th className="p-6 text-puka-red">Puka Digital</th>
                                    <th className="p-6 opacity-40">Agencia Tradicional</th>
                                </tr>
                            </thead>
                            <tbody className="font-bold divide-y divide-white/5">
                                <tr>
                                    <td className="p-6">Acceso a la cuenta de Google</td>
                                    <td className="p-6 text-xl">100% Acceso y Propiedad</td>
                                    <td className="p-6 text-gray-500">Ellos la controlan</td>
                                </tr>
                                <tr>
                                    <td className="p-6">Comisión por Inversión</td>
                                    <td className="p-6 text-puka-red text-2xl">0% (Es tu dinero)</td>
                                    <td className="p-6 text-gray-500">15% a 30%</td>
                                </tr>
                                <tr>
                                    <td className="p-6">Aprendizaje / Educación</td>
                                    <td className="p-6">Te enseñamos a hacerlo</td>
                                    <td className="p-6 text-gray-500">Secretismo total</td>
                                </tr>
                                <tr>
                                    <td className="p-6">Enfoque Primario</td>
                                    <td className="p-6">ROI y Independencia</td>
                                    <td className="p-6 text-gray-500">Retención del cliente</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* LEAD FORM - CONVERSION SECTION */}
            <section id="contacto" className="py-32 bg-puka-beige text-puka-black relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-display font-bold text-6xl md:text-7xl mb-8 tracking-tighter italic uppercase">
                                Toma el <br /> <span className="text-puka-red underline decoration-puka-black decoration-8">Control Real.</span>
                            </h2>
                            <p className="text-2xl mb-12 font-bold max-w-lg opacity-90 italic leading-relaxed">
                                Agenda una consultoría de 15 minutos. Analizaremos cuánto estás perdiendo en comisiones y cómo puedes aparecer primero en Google sin pagar una renta eterna.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-puka-black text-white flex items-center justify-center rounded-full font-bold">1</div>
                                    <p className="font-bold italic">Auditamos tu competencia gratis.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-puka-black text-white flex items-center justify-center rounded-full font-bold">2</div>
                                    <p className="font-bold italic">Definimos tu presupuesto ideal.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-puka-black text-white flex items-center justify-center rounded-full font-bold">3</div>
                                    <p className="font-bold italic">Te mostramos cómo ser 100% independiente.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-puka-red opacity-10 blur-2xl rounded-full"></div>
                            <LeadForm
                                title="Solicitar Auditoría Gratuita"
                                className="relative z-10 shadow-3xl border-4 border-puka-black"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-puka-black text-white/40 text-center text-xs font-bold uppercase tracking-[0.4em]">
                <span>Puka Digital 2025</span>
                <span className="mx-4 text-puka-red">•</span>
                <span>Independencia Tecnológica</span>
                <span className="mx-4 text-puka-red">•</span>
                <span>Quito, Ecuador</span>
            </footer>
        </div>
    );
}
