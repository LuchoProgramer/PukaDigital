'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, Shield } from 'lucide-react';

const TerminosPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link
                    href="/"
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
                                Bienvenido a PukaDigital. Estos t&eacute;rminos y condiciones rigen el uso de nuestros servicios y software SaaS (PukaIA, LedgerXpertz, PukaHealth, Agencia de Marketing y desarrollo web), operados legalmente por <strong>Puka Digital LLC</strong> (Casper, Wyoming, USA · EIN: <code>320856610</code>) y sus representantes en Ecuador. Al contratar o utilizar nuestros servicios, aceptas estos t&eacute;rminos en su totalidad.
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
                                <CheckCircle size={20} className="text-puka-red" /> 4. Pagos y Suscripciones
                            </h2>
                            <p className="mt-4">
                                Cada producto SaaS de PukaDigital (PukaIA, LedgerXpertz, PukaHealth) tiene su propia estructura de precios detallada en la p&aacute;gina del producto. Los servicios se facturan de forma recurrente (mensual o anual seg&uacute;n el plan elegido). La cancelaci&oacute;n implica la suspensi&oacute;n del servicio al vencer el periodo pagado, sin p&eacute;rdida de los datos hist&oacute;ricos generados (los cuales pueden ser exportados a solicitud del cliente).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 5. Uso Responsable de IA
                            </h2>
                            <p className="mt-4">
                                Nuestros chatbots y agentes utilizan modelos de Inteligencia Artificial de terceros (Google Gemini, OpenAI). PukaDigital implementa prompts y bases de conocimiento supervisadas, pero no se hace responsable por interpretaciones o alucinaciones generadas por los modelos fuera de los flujos programados.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 6. Facturación y Jurisdicción
                            </h2>
                            <p className="mt-4">
                                Los servicios internacionales y suscripciones SaaS son provistos por <strong>Puka Digital LLC</strong> bajo las leyes del Estado de Wyoming, Estados Unidos. Para transacciones y clientes locales en Ecuador, se emiten facturas electr&oacute;nicas v&aacute;lidas conforme a la normativa del <strong>Servicio de Rentas Internas (SRI)</strong>.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 30 de agosto de 2026. Empresa: Puka Digital LLC (Wyoming, USA). Para dudas legales espec&iacute;ficas, cont&aacute;ctanos a <strong>legal@pukadigital.com</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminosPage;
