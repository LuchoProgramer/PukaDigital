'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, Shield } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const TerminosPage = () => {
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
                            <FileText className="text-puka-red" size={32} />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                            Términos y Condiciones
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 1. Introducción
                            </h2>
                            <p className="mt-4">
                                Bienvenido a PukaDigital. Estos términos y condiciones rigen el uso de nuestros servicios, incluyendo nuestro CMS Headless, Chatbots con IA, ERP para PYMES y el Programa de Independencia Digital de 3 meses. Al contratar nuestros servicios, aceptas estos términos en su totalidad.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 2. El Programa de 90 Días
                            </h2>
                            <p className="mt-4">
                                PukaDigital no es una agencia de fee mensual tradicional. Nuestro modelo se basa en la transferencia de conocimiento. El compromiso es de 3 meses, durante los cuales implementamos las herramientas y capacitamos al cliente para que al finalizar el periodo, tenga control total y autonomía sobre su ecosistema digital.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 3. Propiedad de las Cuentas
                            </h2>
                            <p className="mt-4 font-bold text-puka-black dark:text-white">
                                Principio fundamental: El cliente es dueño absoluto de sus datos y cuentas.
                            </p>
                            <p>
                                A diferencia de otras agencias, todas las cuentas de Google Ads, Meta Business, Hosting y Dominios se crean a nombre del cliente y bajo su control. PukaDigital solo solicita acceso de administrador/colaborador durante el periodo de implementación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 4. Pagos y Suscripciones Modular
                            </h2>
                            <p className="mt-4">
                                Nuestros módulos de software (CMS, Chatbot, ERP) tienen un costo de $20/mes cada uno. Estos servicios se facturan de forma recurrente. La cancelación de un módulo implica la suspensión inmediata del servicio asociado, pero no la pérdida de los datos históricos generados (los cuales pueden ser exportados).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 5. Uso Responsable de IA
                            </h2>
                            <p className="mt-4">
                                Nuestros chatbots utilizan modelos de Inteligencia Artificial de terceros (como OpenAI). PukaDigital no se hace responsable por alucinaciones o respuestas incorrectas generadas por el modelo, aunque trabajamos activamente en los "prompts" y bases de conocimiento para minimizar estos riesgos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 6. Facturación SRI (Ecuador)
                            </h2>
                            <p className="mt-4">
                                PukaDigital emite facturas electrónicas válidas en Ecuador por todos sus servicios. Los precios mostrados no incluyen IVA a menos que se especifique lo contrario.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                Última actualización: 28 de diciembre de 2025. Para dudas legales específicas, contáctanos a legal@pukadigital.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminosPage;
