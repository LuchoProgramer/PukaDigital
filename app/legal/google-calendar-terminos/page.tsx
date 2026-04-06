'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle, FileText, AlertCircle, Globe, XCircle, Mail } from 'lucide-react';

const GoogleCalendarTerminosPage = () => {
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
                            T&eacute;rminos de Servicio
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <FileText size={20} className="text-puka-red" /> 1. Prop&oacute;sito del acceso
                            </h2>
                            <p className="mt-4">
                                La integraci&oacute;n con Google Calendar de PukaDigital tiene como &uacute;nico prop&oacute;sito permitir que el agente conversacional agende, consulte disponibilidad y gestione citas <strong>en nombre del negocio (tenant) que autoriz&oacute; el acceso OAuth</strong>.
                            </p>
                            <p className="mt-4">
                                El agente act&uacute;a como un asistente del negocio &mdash; no como representante del cliente final (usuario de WhatsApp). Cualquier compromiso contractual derivado de una cita es responsabilidad exclusiva del negocio y su cliente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 2. Uso permitido
                            </h2>
                            <p className="mt-4">El acceso a Google Calendar se utiliza exclusivamente para:</p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Consultar la disponibilidad de horarios del negocio.</li>
                                <li>Crear eventos de cita con el nombre del servicio, fecha, hora y enlace de videollamada (opcional).</li>
                                <li>Evitar la creaci&oacute;n de citas duplicadas mediante verificaci&oacute;n interna.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <XCircle size={20} className="text-puka-red" /> 3. Uso prohibido
                            </h2>
                            <p className="mt-4">Queda expresamente prohibido:</p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Acceder a calendarios de terceros no autorizados.</li>
                                <li>Exportar, compartir o comercializar datos del calendario.</li>
                                <li>Utilizar el acceso fuera del servicio de agendamiento contratado con PukaDigital.</li>
                                <li>Modificar o eliminar eventos existentes creados por el propietario del negocio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <AlertCircle size={20} className="text-puka-red" /> 4. Responsabilidad limitada de IA
                            </h2>
                            <p className="mt-4">
                                El agente de inteligencia artificial facilita el proceso de agendamiento interpretando los mensajes del cliente final. Sin embargo:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>El <strong>negocio es responsable</strong> de confirmar, reprogramar o cancelar citas seg&uacute;n sus pol&iacute;ticas internas.</li>
                                <li>PukaDigital no garantiza la exactitud de la informaci&oacute;n interpretada por la IA en casos de mensajes ambiguos o incompletos.</li>
                                <li>Si el negocio tiene activada la opci&oacute;n de <em>aprobaci&oacute;n manual</em>, ning&uacute;n evento se crea sin confirmaci&oacute;n expl&iacute;cita del propietario.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Calendar size={20} className="text-puka-red" /> 5. Revocaci&oacute;n y datos existentes
                            </h2>
                            <p className="mt-4">
                                El propietario del negocio puede revocar el acceso de PukaDigital a Google Calendar en cualquier momento desde <strong>myaccount.google.com/permissions</strong> o contactando a <strong>legal@pukadigital.com</strong>.
                            </p>
                            <p className="mt-4">
                                Tras la revocaci&oacute;n:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>El sistema dejar&aacute; de poder crear nuevos eventos de forma inmediata.</li>
                                <li>Los eventos ya creados en Google Calendar <strong>no son eliminados autom&aacute;ticamente</strong> por PukaDigital &mdash; permanecen en el calendario del negocio.</li>
                                <li>El historial de citas almacenado en Firestore puede ser solicitado para exportaci&oacute;n o eliminaci&oacute;n mediante solicitud a legal@pukadigital.com.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 6. Vigencia del servicio
                            </h2>
                            <p className="mt-4">
                                El acceso a Google Calendar se mantiene activo mientras el negocio tenga una suscripci&oacute;n vigente al servicio de agendamiento de PukaDigital. La cancelaci&oacute;n de la suscripci&oacute;n implica la suspensi&oacute;n del agendamiento autom&aacute;tico, pero no elimina los registros hist&oacute;ricos de citas (los cuales pueden ser exportados a solicitud del cliente).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Globe size={20} className="text-puka-red" /> 7. Jurisdicci&oacute;n y facturaci&oacute;n
                            </h2>
                            <p className="mt-4">
                                Estos t&eacute;rminos est&aacute;n sujetos a las leyes de la Rep&uacute;blica del Ecuador. PukaDigital emite facturas electr&oacute;nicas v&aacute;lidas para el <strong>Servicio de Rentas Internas (SRI)</strong> por todos los servicios contratados. Los precios no incluyen IVA a menos que se especifique lo contrario.
                            </p>
                            <p className="mt-4">
                                Para clientes internacionales, los t&eacute;rminos se interpretar&aacute;n conforme a los principios del <strong>GDPR</strong> en lo que respecta al tratamiento de datos personales.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Mail size={20} className="text-puka-red" /> 8. Contacto
                            </h2>
                            <p className="mt-4">
                                Para consultas sobre estos t&eacute;rminos:
                            </p>
                            <p className="mt-2">
                                <strong>Email:</strong> legal@pukadigital.com<br />
                                <strong>WhatsApp:</strong> +593 96 406 5880
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 05 de abril de 2026. Para dudas legales espec&iacute;ficas sobre esta integraci&oacute;n, cont&aacute;ctanos en legal@pukadigital.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarTerminosPage;
