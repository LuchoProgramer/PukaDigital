'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const CookiesPage = () => {
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
                            <Cookie className="text-puka-red" size={32} />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                            Política de Cookies
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> ¿Qué son las cookies?
                            </h2>
                            <p className="mt-4">
                                Las cookies son pequeños archivos de texto que los sitios web que visitas envían a tu navegador. Permiten que el sitio web recuerde información sobre tu visita, lo que puede facilitar tu próxima visita y hacer que el sitio te resulte más útil.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> Cookies que utilizamos
                            </h2>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <strong className="text-puka-black dark:text-white">Cookies Técnicas:</strong> Esenciales para que el sitio web funcione correctamente, como navegar por las páginas o acceder a áreas seguras.
                                </li>
                                <li>
                                    <strong className="text-puka-black dark:text-white">Cookies de Análisis:</strong> Utilizamos Google Analytics para entender cómo interactúan los usuarios con nuestra web, lo que nos permite mejorar la experiencia de usuario.
                                </li>
                                <li>
                                    <strong className="text-puka-black dark:text-white">Cookies de Conversión:</strong> Nos ayudan a medir el éxito de nuestras campañas publicitarias en Google Ads y Meta Business.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> Cómo desactivarlas
                            </h2>
                            <p className="mt-4">
                                Puedes restringir o bloquear las cookies a través de la configuración de tu navegador. Sin embargo, si desactivas las cookies, es posible que algunas funciones de este sitio web no funcionen correctamente.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                Última actualización: 28 de diciembre de 2025.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiesPage;
