'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const GarantiaPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link
                    href={`/${lang}`}
                    className="inline-flex items-center gap-2 text-puka-red hover:underline mb-8 font-bold uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-puka-red/10 rounded-sm">
                            <ShieldCheck className="text-puka-red" size={32} />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                            Garantía de Resultados
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                        <section className="bg-puka-red/10 p-6 rounded-sm border-l-4 border-puka-red">
                            <h2 className="text-xl font-bold text-puka-black dark:text-white mt-0">
                                Resumen Ejecutivo: Devolución del 100%
                            </h2>
                            <p className="mt-2 font-medium">
                                Si después de completar los 90 días del programa de transformación digital no has obtenido resultados verificables (visibilidad en Google o leads reales), te devolvemos el 100% de lo pagado en capacitaciones y servicios de PukaDigital.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 1. Condiciones de la Garantía
                            </h2>
                            <p className="mt-4">
                                Para que la garantía sea efectiva, el cliente debe:
                            </p>
                            <ul className="mt-2 space-y-2">
                                <li>Haber completado las 3 fases del programa (Base, Google Ads, Orgánico).</li>
                                <li>Haber destinado el presupuesto publicitario acordado (directo a Google).</li>
                                <li>Haber implementado las recomendaciones técnicas sugeridas por nuestro equipo.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 2. Qué es un "Resultado Verificable"
                            </h2>
                            <p className="mt-4">
                                Entendemos el éxito como:
                            </p>
                            <ul className="mt-2 space-y-2">
                                <li>Aparición en el Top 3 de Google Maps para búsquedas de su sector.</li>
                                <li>Registro de al menos un aumento del 30% en clics de llamada o WhatsApp desde el perfil de negocio.</li>
                                <li>Sitio web 100% funcional y bajo control del cliente.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 3. Transparencia Radical
                            </h2>
                            <p className="mt-4">
                                Nuestra garantía existe porque confiamos en nuestro método. Al ser un programa de educación y herramientas, el mayor riesgo lo asume el cliente al inicio; nosotros lo neutralizamos devolviendo el dinero si el sistema no funciona para su negocio específico.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500 text-center">
                                PukaDigital: La única agencia que te enseña a no necesitarnos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GarantiaPage;
