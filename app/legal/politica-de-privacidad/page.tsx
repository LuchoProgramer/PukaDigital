'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Globe, Database, Users, FileText, AlertCircle, Mail } from 'lucide-react';

interface Tratamiento {
    quien: string;
    datos: string;
    finalidad: string;
    base: string;
    plazo: string;
}

interface Proveedor {
    nombre: string;
    ubicacion: string;
    dato: string;
    proposito: string;
}

interface Derecho {
    nombre: string;
    descripcion: string;
}

const TRATAMIENTOS: Tratamiento[] = [
    {
        quien: 'Visitantes del sitio',
        datos: 'cookies, IP, dispositivo, navegación (GA4, Google Ads, Clarity, píxeles de Meta y TikTok)',
        finalidad: 'analítica y publicidad de PukaDigital',
        base: 'Interés legítimo, con derecho de oposición',
        plazo: '14 meses',
    },
    {
        quien: 'Prospectos (formularios y WhatsApp de ventas)',
        datos: 'nombre, teléfono, correo, mensajes',
        finalidad: 'responder y cotizar',
        base: 'Consentimiento y medidas precontractuales',
        plazo: '2 años desde el último contacto',
    },
    {
        quien: 'Clientes que contratan',
        datos: 'datos del negocio y de contacto',
        finalidad: 'prestar el servicio contratado',
        base: 'Ejecución del contrato',
        plazo: 'Mientras dure el contrato, más los plazos legales',
    },
    {
        quien: 'Facturación',
        datos: 'RUC o cédula, razón social, montos',
        finalidad: 'emitir facturas al SRI',
        base: 'Obligación legal',
        plazo: '7 años',
    },
];

const PROVEEDORES: Proveedor[] = [
    {
        nombre: 'Hetzner',
        ubicacion: 'Alemania (Núremberg)',
        dato: 'Datos de aplicaciones y bases de datos de PukaHealth, LedgerXpertz y bot',
        proposito: 'Servidor principal de aplicaciones y almacenamiento de bases de datos',
    },
    {
        nombre: 'Google Cloud (Firestore, Vertex AI, Speech)',
        ubicacion: 'Brasil (Firestore); Vertex AI y Speech en la infraestructura global de Google',
        dato: 'Mensajes de WhatsApp, historial de conversaciones, tokens OAuth, datos del negocio',
        proposito: 'Base de datos conversacional, IA conversacional y procesamiento de voz',
    },
    {
        nombre: 'Meta (WhatsApp Business API)',
        ubicacion: 'Estados Unidos',
        dato: 'Número de teléfono, mensajes y datos de recordatorios de citas',
        proposito: 'Envío y recepción de mensajes y recordatorios de citas por WhatsApp',
    },
    {
        nombre: 'Cloudflare',
        ubicacion: 'Red global (empresa de Estados Unidos)',
        dato: 'Tráfico web, dirección IP y respaldos diarios de bases de datos cifrados con AES-256',
        proposito: 'Distribución del sitio web (Workers) y almacenamiento seguro de respaldos (R2)',
    },
    {
        nombre: 'Google Analytics 4',
        ubicacion: 'Estados Unidos',
        dato: 'Datos de navegación, ubicación aproximada y tipo de dispositivo',
        proposito: 'Análisis estadístico de tráfico y uso del sitio web',
    },
    {
        nombre: 'Google Ads',
        ubicacion: 'Estados Unidos',
        dato: 'Cookies de remarketing y datos de interacción',
        proposito: 'Medición de conversiones y publicidad de PukaDigital',
    },
    {
        nombre: 'Microsoft Clarity',
        ubicacion: 'Estados Unidos',
        dato: 'Grabaciones de sesiones, mapas de calor y datos de navegación',
        proposito: 'Análisis de experiencia de usuario y comportamiento en el sitio',
    },
    {
        nombre: 'Píxel de Meta',
        ubicacion: 'Estados Unidos',
        dato: 'Cookies y eventos de navegación',
        proposito: 'Medición y optimización de campañas publicitarias en Meta',
    },
    {
        nombre: 'Píxel de TikTok',
        ubicacion: 'Estados Unidos',
        dato: 'Cookies y eventos de navegación',
        proposito: 'Medición y optimización de campañas publicitarias en TikTok',
    },
];

const DERECHOS: Derecho[] = [
    {
        nombre: 'Acceso',
        descripcion: 'Solicitar y obtener una copia de los datos personales que tratamos sobre ti.',
    },
    {
        nombre: 'Rectificación y actualización',
        descripcion: 'Corregir o actualizar datos personales inexactos, erróneos o incompletos.',
    },
    {
        nombre: 'Eliminación',
        descripcion: 'Solicitar la supresión o eliminación de tus datos personales, sujeto a obligaciones legales de retención.',
    },
    {
        nombre: 'Oposición',
        descripcion: 'Oponerte al tratamiento de tus datos personales para finalidades como publicidad o mercadeo.',
    },
    {
        nombre: 'Limitación',
        descripcion: 'Solicitar la restricción del tratamiento de tus datos en los casos establecidos por la ley.',
    },
    {
        nombre: 'Suspensión',
        descripcion: 'Solicitar la cesación temporal del tratamiento mientras se verifica una impugnación o reclamo.',
    },
    {
        nombre: 'Portabilidad',
        descripcion: 'Recibir tus datos en formato estructurado y legible por máquina, o solicitar su transferencia a otro responsable.',
    },
    {
        nombre: 'No ser objeto de decisiones automatizadas',
        descripcion: 'Solicitar que decisiones con efectos jurídicos no se basen únicamente en tratamiento automatizado, y pedir intervención humana.',
    },
];

const ULTIMA_ACTUALIZACION = '26 de septiembre de 2026';

const PoliticaPrivacidadPage = () => {
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
                            <Shield className="text-puka-red" size={32} />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                                Pol&iacute;tica de Privacidad
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">&Uacute;ltima actualizaci&oacute;n: {ULTIMA_ACTUALIZACION}</p>
                        </div>
                    </div>

                    {/* Resumen ejecutivo */}
                    <div className="bg-puka-red/5 border-l-4 border-puka-red p-6 rounded-sm mb-10">
                        <p className="font-bold text-puka-black dark:text-white mb-2">Resumen</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            PukaDigital recopila &uacute;nicamente los datos necesarios para prestar sus servicios. <strong>No vendemos datos personales.</strong> No usamos datos de Google para publicidad. Los tokens de Google se almacenan cifrados con AES-256. Puedes solicitar la eliminaci&oacute;n de tus datos en cualquier momento escribiendo a <strong>legal@pukadigital.com</strong>.
                        </p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-10">

                        {/* 1. Quiénes somos */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <FileText size={20} className="text-puka-red" /> 1. Qui&eacute;nes somos
                            </h2>
                            <p className="mt-4">
                                <strong>PukaDigital</strong> es operada por <strong>Puka Digital LLC</strong>, una sociedad de responsabilidad limitada constituida en el Estado de Wyoming, Estados Unidos (EIN: <code>320856610</code>, Direcci&oacute;n: 5830 East 2nd Street, Ste 7000, Casper, WY 82609, USA), con operaciones y representaci&oacute;n para Ecuador y Latinoam&eacute;rica con sede en Quito, Ecuador. PukaDigital desarrolla y opera los siguientes productos y servicios SaaS:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>PukaIA</strong> &mdash; Agente conversacional con IA y CRM para WhatsApp Business</li>
                                <li><strong>LedgerXpertz</strong> &mdash; Sistema POS, inventario y facturaci&oacute;n SRI</li>
                                <li><strong>PukaHealth</strong> &mdash; Historias cl&iacute;nicas electr&oacute;nicas con facturaci&oacute;n SRI</li>
                                <li><strong>PukaSalud</strong> &mdash; Marketing m&eacute;dico para profesionales de la salud</li>
                                <li><strong>Agencia de Marketing Digital</strong> &mdash; Google Ads, SEO y desarrollo web para PYMEs</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Contacto del responsable de privacidad:</strong> legal@pukadigital.com &nbsp;|&nbsp; +593 96 406 5880
                            </p>
                        </section>

                        {/* 2. Responsable y encargado */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Users size={20} className="text-puka-red" /> 2. Responsable y encargado del tratamiento
                            </h2>
                            <p className="mt-4">
                                Conforme a la Ley Org&aacute;nica de Protecci&oacute;n de Datos Personales (LOPDP), el rol de PukaDigital respecto a tus datos personales depende de la relaci&oacute;n y del servicio utilizado:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>
                                    <strong>PukaDigital como Responsable del tratamiento (Parte 1):</strong> PukaDigital decide sobre los fines y medios del tratamiento cuando navegas en nuestro sitio web, cuando nos contactas o solicitas cotizaciones como prospecto (por formularios o v&iacute;a WhatsApp), cuando contratas directamente nuestros servicios como cliente, y para la emisi&oacute;n de nuestras facturas legales ante el SRI.
                                </li>
                                <li>
                                    <strong>PukaDigital como Encargado del tratamiento (Parte 2):</strong> Cuando utilizas nuestros servicios SaaS como cliente (PukaHealth, PukaIA, LedgerXpertz), t&uacute; o tu negocio act&uacute;an como <strong>responsable del tratamiento</strong> de los datos personales de tus propios pacientes o clientes. En estos casos, PukaDigital act&uacute;a &uacute;nicamente como <strong>encargado del tratamiento</strong> (procesador), tratando dichos datos &uacute;nicamente por tu cuenta, bajo tus instrucciones y para prestar el servicio contratado.
                                </li>
                            </ul>
                        </section>

                        {/* Parte 1: PukaDigital como responsable */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-xs font-bold tracking-widest text-puka-red uppercase">
                                Parte 1 &mdash; PukaDigital como responsable
                            </span>
                        </div>

                        {/* 3. Qué tratamos, para qué, con qué base legal y por cuánto tiempo */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Database size={20} className="text-puka-red" /> 3. Qu&eacute; tratamos, para qu&eacute;, con qu&eacute; base legal y por cu&aacute;nto tiempo
                            </h2>
                            <p className="mt-4">
                                En los tratamientos en los que PukaDigital es responsable, tratamos los siguientes datos personales conforme a las bases legales y plazos establecidos en la LOPDP:
                            </p>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-700">
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Titular</th>
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Datos</th>
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Finalidad</th>
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Base legal</th>
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Plazo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {TRATAMIENTOS.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-3 font-semibold text-puka-black dark:text-white">{item.quien}</td>
                                                <td className="p-3">{item.datos}</td>
                                                <td className="p-3">{item.finalidad}</td>
                                                <td className="p-3">{item.base}</td>
                                                <td className="p-3">{item.plazo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4">
                                Los servicios de anal&iacute;tica y publicidad de terceros &mdash;Google Analytics 4, Google Ads, Microsoft Clarity (que graba sesiones y mapas de calor para evaluar la experiencia de navegaci&oacute;n), el p&iacute;xel de Meta y el p&iacute;xel de TikTok&mdash; <strong>cargan autom&aacute;ticamente al entrar al sitio web</strong> sin mediar consentimiento previo, operando bajo la base de inter&eacute;s leg&iacute;timo de PukaDigital para anal&iacute;tica y publicidad. Puedes oponerte a este tratamiento y desactivar su seguimiento bloqueando cookies de terceros en la configuraci&oacute;n de tu navegador, mediante extensiones de privacidad o con las herramientas de inhabilitaci&oacute;n que se detallan a continuaci&oacute;n y en la secci&oacute;n de cookies.
                            </p>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">Google Analytics 4 y Google Ads</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Usamos GA4 para analizar el tr&aacute;fico del sitio y Google Ads para mostrar publicidad relevante a visitantes previos.</li>
                                <li>Puedes desactivar el seguimiento instalando el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">complemento de inhabilitaci&oacute;n de Google Analytics</a>.</li>
                            </ul>

                            <p className="mt-4">
                                En el caso de los prospectos comerciales, nuestro canal de WhatsApp de ventas es atendido inicialmente por un bot con inteligencia artificial que responde consultas. Puedes pedir en cualquier momento que te atienda una persona: cuando alguien de nuestro equipo responde en tu conversaci&oacute;n, el bot deja de intervenir en ella.
                            </p>
                        </section>

                        {/* 4. Lo opcional */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Eye size={20} className="text-puka-red" /> 4. Comunicaciones comerciales y tratamientos opcionales
                            </h2>
                            <p className="mt-4">
                                Cualquier env&iacute;o de comunicaciones comerciales, promociones o novedades de PukaDigital se realiza &uacute;nicamente si has otorgado tu consentimiento espec&iacute;fico de forma separada a la contrataci&oacute;n del servicio.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                    <strong>No condicionamiento:</strong> Negarte a recibir comunicaciones comerciales o no otorgar este consentimiento opcional no condiciona ni limita en modo alguno la contrataci&oacute;n, prestaci&oacute;n o continuidad de los servicios de PukaDigital.
                                </li>
                                <li>
                                    <strong>Revocaci&oacute;n libre e inmediata:</strong> Puedes revocar tu consentimiento para comunicaciones comerciales en cualquier momento, escribiendo a <strong>legal@pukadigital.com</strong> o respondiendo al mismo mensaje.
                                </li>
                                <li>
                                    <strong>Efectos hacia el futuro:</strong> La revocaci&oacute;n no tiene efectos retroactivos ni afecta la licitud del tratamiento realizado con anterioridad a la misma.
                                </li>
                            </ul>
                        </section>

                        {/* 3. Uso de Google APIs */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Shield size={20} className="text-puka-red" /> 3. Uso de Google APIs y datos de usuarios de Google
                            </h2>
                            <p className="mt-4">
                                PukaDigital utiliza las siguientes APIs de Google bajo los t&eacute;rminos de los <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">Servicios de API de Google</a>:
                            </p>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">Google Calendar API (OAuth 2.0)</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Accedemos exclusivamente a la disponibilidad de horarios y a la creaci&oacute;n de eventos de cita en nombre del negocio que autoriz&oacute; el acceso.</li>
                                <li><strong>No accedemos</strong> a correos (Gmail), archivos (Drive), contactos ni al contenido de eventos existentes.</li>
                                <li>El token OAuth se cifra con AES-256 antes de almacenarse en Firestore y <strong>nunca se comparte con terceros</strong>.</li>
                                <li>Los datos obtenidos de Google <strong>no se usan para publicidad ni para entrenar modelos de IA</strong>.</li>
                                <li>El negocio puede revocar el acceso en cualquier momento desde <strong>myaccount.google.com/permissions</strong>.</li>
                            </ul>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">Google Cloud Vertex AI / Gemini</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Los mensajes de WhatsApp se env&iacute;an a Gemini para generar respuestas. Google procesa estos datos conforme a su <a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">DPA de Google Cloud</a>.</li>
                                <li>No se env&iacute;an datos sensibles (historias cl&iacute;nicas, datos financieros) a Gemini.</li>
                            </ul>
                        </section>

                        {/* 3 bis. Uso de la Plataforma de WhatsApp Business (Meta) */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Globe size={20} className="text-puka-red" /> 3 bis. Uso de la Plataforma de WhatsApp Business (Meta)
                            </h2>
                            <p className="mt-4">
                                PukaDigital opera como Proveedor de Tecnolog&iacute;a (Tech Provider) de la Plataforma de WhatsApp Business de Meta, conforme a los <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">T&eacute;rminos de la Plataforma de Meta</a>, las Pol&iacute;ticas para Desarrolladores y la Pol&iacute;tica de Uso Aceptable de WhatsApp Business.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Procesamos el n&uacute;mero de tel&eacute;fono y el contenido de los mensajes de los clientes finales <strong>por cuenta del negocio</strong> que contrata el servicio y que conecta su cuenta de WhatsApp mediante el registro incorporado (Embedded Signup). En esta relaci&oacute;n el negocio es el <strong>responsable del tratamiento</strong> y PukaDigital act&uacute;a como <strong>encargado (procesador)</strong>.</li>
                                <li>Usamos estos datos <strong>exclusivamente</strong> para prestar el servicio contratado: generar respuestas autom&aacute;ticas y enviar recordatorios y notificaciones en nombre del negocio.</li>
                                <li><strong>No</strong> usamos los datos de la Plataforma de Meta para publicidad, no los vendemos ni cedemos a terceros, y <strong>no</strong> los utilizamos para entrenar modelos de IA propios.</li>
                                <li>El negocio puede desconectar su cuenta de WhatsApp en cualquier momento desde su Administrador de WhatsApp de Meta o escribiendo a <strong>legal@pukadigital.com</strong>; al hacerlo cesamos el procesamiento y eliminamos los datos asociados conforme a la secci&oacute;n 6.</li>
                            </ul>
                        </section>

                        {/* 5. Terceros y subprocesadores */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Users size={20} className="text-puka-red" /> 5. Terceros y subprocesadores
                            </h2>
                            <p className="mt-4">Compartimos datos con los siguientes proveedores de infraestructura, exclusivamente para prestar el servicio:</p>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-700">
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Proveedor</th>
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Dato compartido</th>
                                            <th className="text-left p-3 font-bold text-puka-black dark:text-white">Prop&oacute;sito</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        <tr>
                                            <td className="p-3 font-semibold">Google Cloud (Firestore, Vertex AI, Speech)</td>
                                            <td className="p-3">Mensajes, tokens OAuth, datos del negocio</td>
                                            <td className="p-3">Infraestructura, IA conversacional</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Meta (WhatsApp Business API)</td>
                                            <td className="p-3">N&uacute;mero de tel&eacute;fono, mensajes</td>
                                            <td className="p-3">Env&iacute;o y recepci&oacute;n de mensajes</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Google Analytics 4</td>
                                            <td className="p-3">Datos de navegaci&oacute;n anonimizados</td>
                                            <td className="p-3">An&aacute;lisis de tr&aacute;fico</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Google Ads</td>
                                            <td className="p-3">Cookies de remarketing</td>
                                            <td className="p-3">Publicidad de PukaDigital</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold">Stripe (pr&oacute;ximamente)</td>
                                            <td className="p-3">Datos de pago (procesados directamente por Stripe)</td>
                                            <td className="p-3">Cobros de suscripciones</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-sm">
                                Ninguno de estos proveedores est&aacute; autorizado a usar los datos para fines propios distintos a los descritos.
                            </p>
                        </section>

                        {/* 6. Retención de datos */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Lock size={20} className="text-puka-red" /> 6. Retenci&oacute;n y eliminaci&oacute;n de datos
                            </h2>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li><strong>Tokens OAuth de Google Calendar:</strong> se eliminan inmediatamente al revocar el acceso o cancelar el servicio.</li>
                                <li><strong>Historial de conversaciones (PukaIA):</strong> 24 meses desde la &uacute;ltima interacci&oacute;n, o hasta que el negocio solicite su eliminaci&oacute;n.</li>
                                <li><strong>Datos de facturaci&oacute;n SRI:</strong> 7 a&ntilde;os, conforme al C&oacute;digo Tributario del Ecuador.</li>
                                <li><strong>Historias cl&iacute;nicas (PukaHealth):</strong> mientras el m&eacute;dico mantenga su cuenta activa; exportables y eliminables a solicitud.</li>
                                <li><strong>Datos de contacto (formularios):</strong> 2 a&ntilde;os desde el &uacute;ltimo contacto.</li>
                                <li><strong>Cookies y datos de Analytics:</strong> 14 meses (configuraci&oacute;n por defecto de GA4).</li>
                            </ul>
                        </section>

                        {/* 7. Seguridad */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Shield size={20} className="text-puka-red" /> 7. Seguridad
                            </h2>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Tokens OAuth cifrados con <strong>AES-256</strong> antes de almacenarse</li>
                                <li>Comunicaciones protegidas con <strong>TLS 1.2+</strong></li>
                                <li>Datos almacenados en <strong>Google Cloud Firestore</strong> con reglas de acceso por tenant</li>
                                <li>Acceso interno restringido al personal autorizado de PukaDigital</li>
                                <li>Sin almacenamiento de contraseñas — autenticaci&oacute;n delegada a Google OAuth</li>
                            </ul>
                        </section>

                        {/* 8. Jurisdicción y transferencias */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Globe size={20} className="text-puka-red" /> 8. Jurisdicci&oacute;n y transferencias internacionales
                            </h2>
                            <p className="mt-4">
                                Puka Digital LLC cumple con la normativa de protecci&oacute;n al consumidor y privacidad aplicable en los Estados Unidos (incluyendo los est&aacute;ndares de privacidad de California CCPA/CPRA cuando aplique), as&iacute; como con la <strong>Ley Org&aacute;nica de Protecci&oacute;n de Datos Personales (LOPDP)</strong> del Ecuador para usuarios y operaciones locales. Los datos se procesan en infraestructura segura de Google Cloud en Estados Unidos.
                            </p>
                            <p className="mt-4">
                                Para clientes o usuarios en la Uni&oacute;n Europea o Reino Unido, el tratamiento se realiza conforme a los principios del <strong>RGPD (GDPR)</strong>: minimizaci&oacute;n de datos, limitaci&oacute;n de finalidad, exactitud y derecho a supresi&oacute;n. Las transferencias a Google LLC y Meta se amparan en las <strong>Cl&aacute;usulas Contractuales Est&aacute;ndar</strong> de la Comisi&oacute;n Europea y marcos de privacidad de datos reconocidos.
                            </p>
                        </section>

                        {/* 9. Derechos del usuario */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <AlertCircle size={20} className="text-puka-red" /> 9. Tus derechos
                            </h2>
                            <p className="mt-4">Conforme a la LOPDP y al RGPD, tienes derecho a:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Acceso:</strong> solicitar una copia de los datos personales que tenemos sobre ti.</li>
                                <li><strong>Rectificaci&oacute;n:</strong> corregir datos inexactos o incompletos.</li>
                                <li><strong>Supresi&oacute;n:</strong> solicitar la eliminaci&oacute;n de tus datos (sujeto a obligaciones legales de retenci&oacute;n).</li>
                                <li><strong>Oposici&oacute;n:</strong> oponerte al tratamiento para fines de marketing.</li>
                                <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado y legible por m&aacute;quina.</li>
                                <li><strong>Revocaci&oacute;n de Google Calendar:</strong> directamente en <strong>myaccount.google.com/permissions</strong>, sin necesidad de contactarnos.</li>
                            </ul>
                            <p className="mt-4">
                                Para ejercer cualquiera de estos derechos, escribe a <strong>legal@pukadigital.com</strong>. Respondemos en un m&aacute;ximo de <strong>15 d&iacute;as h&aacute;biles</strong>.
                            </p>
                        </section>

                        {/* 10. Cookies */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Eye size={20} className="text-puka-red" /> 10. Cookies
                            </h2>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sitio. No requieren consentimiento.</li>
                                <li><strong>Google Analytics 4:</strong> anal&iacute;tica de tr&aacute;fico anonimizada. Puedes desactivarlas con el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">opt-out de GA</a>.</li>
                                <li><strong>Google Ads / Remarketing:</strong> para mostrar anuncios de PukaDigital en otros sitios. Puedes gestionarlas en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">adssettings.google.com</a>.</li>
                                <li><strong>Facebook Pixel:</strong> para campa&ntilde;as en Meta. Puedes desactivarlo en la configuraci&oacute;n de tu cuenta de Facebook.</li>
                            </ul>
                        </section>

                        {/* 11. Cambios */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <FileText size={20} className="text-puka-red" /> 11. Cambios a esta pol&iacute;tica
                            </h2>
                            <p className="mt-4">
                                Podemos actualizar esta pol&iacute;tica cuando a&ntilde;adamos nuevos productos o integraciones. La fecha de &uacute;ltima actualizaci&oacute;n aparece en el encabezado. Para cambios sustanciales, notificaremos por correo electr&oacute;nico a los clientes activos con al menos <strong>30 d&iacute;as de anticipaci&oacute;n</strong>.
                            </p>
                        </section>

                        {/* 12. Contacto */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Mail size={20} className="text-puka-red" /> 12. Contacto
                            </h2>
                            <p className="mt-4">Para consultas sobre privacidad, ejercicio de derechos o reporte de incidentes:</p>
                            <p className="mt-2">
                                <strong>Razón Social:</strong> Puka Digital LLC (EIN: 320856610)<br />
                                <strong>Direcci&oacute;n principal:</strong> 5830 East 2nd Street, Ste 7000, Casper, Wyoming 82609, USA<br />
                                <strong>Oficina Regional LATAM:</strong> Quito, Pichincha, Ecuador<br />
                                <strong>Email:</strong> legal@pukadigital.com<br />
                                <strong>WhatsApp / Teléfono:</strong> +593 96 406 5880
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: {ULTIMA_ACTUALIZACION}. Esta pol&iacute;tica aplica a todos los servicios operados por Puka Digital LLC en <strong>pukadigital.com</strong> y sus subdominios.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliticaPrivacidadPage;
