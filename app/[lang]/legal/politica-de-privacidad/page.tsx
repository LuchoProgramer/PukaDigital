'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const PoliticaPrivacidadPage = () => {
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
                            <Shield className="text-puka-red" size={32} />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                            Política de Privacidad
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Lock size={20} className="text-puka-red" /> 1. Recopilación de Información
                            </h2>
                            <p className="mt-4">
                                En PukaDigital, valoramos su privacidad. Recopilamos información que usted nos proporciona voluntariamente a través de formularios de contacto, suscripciones a boletines o consultas por WhatsApp. Esta información puede incluir su nombre, dirección de correo electrónico, número de teléfono y detalles sobre su proyecto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Eye size={20} className="text-puka-red" /> 2. Uso de Cookies y Tecnologías de Rastreo
                            </h2>
                            <p className="mt-4">
                                Utilizamos cookies y tecnologías similares (como píxeles de Facebook y etiquetas de Google Ads) para mejorar su experiencia, analizar el tráfico del sitio y personalizar la publicidad.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>
                                    <strong>Google Analytics 4:</strong> Para entender cómo los usuarios interactúan con nuestro sitio web.
                                </li>
                                <li>
                                    <strong>Google Ads y Remarketing:</strong> Podemos utilizar cookies para mostrarle anuncios relevantes en otros sitios web (incluida la Búsqueda de Google y YouTube) basándonos en sus visitas anteriores a nuestro sitio.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Shield size={20} className="text-puka-red" /> 3. Protección de Datos
                            </h2>
                            <p className="mt-4">
                                No vendemos, intercambiamos ni transferimos su información personal a terceros ajenos a nuestra organización, excepto cuando sea necesario para prestarle un servicio solicitado (como el registro de un dominio a su nombre). Implementamos medidas de seguridad para mantener a salvo sus datos personales.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                4. Derechos del Usuario
                            </h2>
                            <p className="mt-4">
                                Usted tiene derecho a solicitar el acceso, corrección o eliminación de sus datos personales en cualquier momento. Puede optar por no participar en el seguimiento de Google Analytics instalando el complemento de inhabilitación para navegadores de Google.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                5. Contacto
                            </h2>
                            <p className="mt-4">
                                Si tiene preguntas sobre esta política de privacidad, puede contactarnos en: <br />
                                <strong>Email:</strong> legal@pukadigital.com <br />
                                <strong>WhatsApp:</strong> +593 96 406 5880
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                Última actualización: 02 de Enero de 2026.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliticaPrivacidadPage;
