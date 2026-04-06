'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Lock, Shield, Eye, Globe, AlertCircle, Mail } from 'lucide-react';

const GoogleCalendarPrivacidadPage = () => {
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
                            <Calendar className="text-puka-red" size={32} />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                            <span className="block text-sm font-bold tracking-widest text-puka-red mb-1 normal-case">
                                Integraci&oacute;n Google Calendar
                            </span>
                            Pol&iacute;tica de Privacidad
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">

                        <section className="bg-puka-red/10 p-6 rounded-sm border-l-4 border-puka-red">
                            <h2 className="text-xl font-bold text-puka-black dark:text-white mt-0">
                                Resumen
                            </h2>
                            <p className="mt-2">
                                PukaDigital accede a Google Calendar &uacute;nicamente para consultar disponibilidad y crear citas en nombre del negocio que autoriz&oacute; el acceso. <strong>No leemos correos, no accedemos a eventos anteriores con detalle personal, no vendemos datos.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Eye size={20} className="text-puka-red" /> 1. &iquest;Qu&eacute; datos accedemos?
                            </h2>
                            <p className="mt-4">
                                Al autorizar la integraci&oacute;n con Google Calendar, nuestro sistema accede exclusivamente a:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li><strong>Disponibilidad de horarios:</strong> rangos de tiempo libres u ocupados para determinar cu&aacute;ndo se puede agendar una cita.</li>
                                <li><strong>Creaci&oacute;n de eventos:</strong> insertamos un evento con el nombre del servicio, la fecha y hora acordada, y opcionalmente un enlace de Google Meet si el negocio lo requiere.</li>
                            </ul>
                            <p className="mt-4 font-semibold">
                                Expl&iacute;citamente NO accedemos a:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Correos electr&oacute;nicos (Gmail).</li>
                                <li>Contenido detallado de eventos existentes (t&iacute;tulos, descripci&oacute;n, asistentes de citas previas).</li>
                                <li>Contactos de Google.</li>
                                <li>Archivos de Google Drive.</li>
                                <li>Informaci&oacute;n de pago o financiera.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Lock size={20} className="text-puka-red" /> 2. Seguridad y almacenamiento de tokens
                            </h2>
                            <p className="mt-4">
                                Cuando el propietario del negocio autoriza el acceso, Google nos entrega un <em>refresh token</em> OAuth 2.0. Este token:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Se cifra con <strong>AES-256</strong> inmediatamente antes de ser almacenado.</li>
                                <li>Se guarda en <strong>Firestore</strong> (Google Cloud), asociado &uacute;nicamente al identificador del negocio (tenant).</li>
                                <li><strong>Nunca se almacena en texto plano</strong>, nunca aparece en logs ni en c&oacute;digo fuente.</li>
                                <li>Solo el sistema interno de PukaDigital puede descifrarlo para ejecutar llamadas a la API de Google Calendar en nombre del negocio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Shield size={20} className="text-puka-red" /> 3. Uso de Inteligencia Artificial
                            </h2>
                            <p className="mt-4">
                                El agente conversacional de PukaDigital (impulsado por Google Gemini) interpreta los mensajes de WhatsApp del cliente final para identificar su intenci&oacute;n de agendar una cita y extraer fecha, hora y servicio solicitado.
                            </p>
                            <p className="mt-4">
                                La IA <strong>no toma decisiones financieras, legales o m&eacute;dicas</strong> en nombre del usuario. Su &uacute;nica funci&oacute;n en este contexto es procesar la solicitud de agendamiento y coordinar la disponibilidad con Google Calendar. La confirmaci&oacute;n final de la cita puede requerir aprobaci&oacute;n del due&ntilde;o del negocio seg&uacute;n su configuraci&oacute;n.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <AlertCircle size={20} className="text-puka-red" /> 4. Revocaci&oacute;n del acceso
                            </h2>
                            <p className="mt-4">
                                El propietario del negocio puede revocar el acceso de PukaDigital a su Google Calendar en cualquier momento:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Desde <strong>myaccount.google.com/permissions</strong>, eliminando el permiso de la aplicaci&oacute;n PukaDigital.</li>
                                <li>Contactando directamente a nuestro equipo en <strong>legal@pukadigital.com</strong> para solicitar la eliminaci&oacute;n inmediata del token almacenado.</li>
                            </ul>
                            <p className="mt-4">
                                Tras la revocaci&oacute;n, el sistema dejar&aacute; de poder crear eventos nuevos. Los eventos ya creados en Google Calendar no son modificados ni eliminados por PukaDigital.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Globe size={20} className="text-puka-red" /> 5. Jurisdicci&oacute;n y cumplimiento legal
                            </h2>
                            <p className="mt-4">
                                PukaDigital opera desde Ecuador y cumple con la <strong>Ley Org&aacute;nica de Protecci&oacute;n de Datos Personales (LOPDP)</strong> vigente en el pa&iacute;s. Para clientes y usuarios ubicados en la Uni&oacute;n Europea o Reino Unido, el tratamiento de datos se realiza conforme a los principios del <strong>Reglamento General de Protecci&oacute;n de Datos (GDPR)</strong>, incluyendo minimizaci&oacute;n de datos, limitaci&oacute;n de finalidad y derecho a supresi&oacute;n.
                            </p>
                            <p className="mt-4">
                                Los datos personales tratados a trav&eacute;s de esta integraci&oacute;n no son transferidos a terceros con fines comerciales.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Mail size={20} className="text-puka-red" /> 6. Contacto
                            </h2>
                            <p className="mt-4">
                                Para consultas sobre esta pol&iacute;tica o para ejercer sus derechos de acceso, rectificaci&oacute;n o supresi&oacute;n de datos:
                            </p>
                            <p className="mt-2">
                                <strong>Email:</strong> legal@pukadigital.com<br />
                                <strong>WhatsApp:</strong> +593 96 406 5880
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 05 de abril de 2026. Esta pol&iacute;tica aplica espec&iacute;ficamente al uso de Google Calendar API mediante OAuth 2.0 en los servicios de agendamiento de PukaDigital.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarPrivacidadPage;
