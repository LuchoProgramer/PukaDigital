'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Globe, Database, Users, FileText, AlertCircle, Mail } from 'lucide-react';

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
                            <p className="text-sm text-gray-500 mt-1">&Uacute;ltima actualizaci&oacute;n: 08 de abril de 2026</p>
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
                                <strong>PukaDigital</strong> es una empresa de tecnolog&iacute;a y marketing digital con sede en Quito, Ecuador, que desarrolla y opera los siguientes productos SaaS:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>PukaIA</strong> &mdash; Agente conversacional con IA para WhatsApp Business</li>
                                <li><strong>LedgerXpertz</strong> &mdash; Sistema POS, inventario y facturaci&oacute;n SRI</li>
                                <li><strong>PukaHealth</strong> &mdash; Historias cl&iacute;nicas electr&oacute;nicas con facturaci&oacute;n SRI</li>
                                <li><strong>PukaSalud</strong> &mdash; Marketing m&eacute;dico para profesionales de la salud</li>
                                <li><strong>Agencia de Marketing Digital</strong> &mdash; Google Ads, SEO y desarrollo web para PYMEs</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Contacto del responsable:</strong> legal@pukadigital.com &nbsp;|&nbsp; +593 96 406 5880
                            </p>
                        </section>

                        {/* 2. Datos que recopilamos */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Database size={20} className="text-puka-red" /> 2. Datos que recopilamos
                            </h2>
                            <p className="mt-4">Recopilamos informaci&oacute;n seg&uacute;n el servicio utilizado:</p>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">Todos los servicios</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Nombre, correo electr&oacute;nico y tel&eacute;fono (formularios de contacto y registro)</li>
                                <li>Datos de navegaci&oacute;n (cookies, direcci&oacute;n IP, tipo de dispositivo) mediante Google Analytics 4</li>
                            </ul>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">PukaIA (agente WhatsApp)</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>N&uacute;mero de tel&eacute;fono y mensajes de WhatsApp del cliente final (procesados para generar respuestas autom&aacute;ticas)</li>
                                <li>Historial de conversaciones almacenado en Firestore (Google Cloud) asociado al identificador del negocio (tenant)</li>
                                <li>Token OAuth 2.0 de Google Calendar, cifrado con AES-256, cuando el negocio autoriza la integraci&oacute;n de agendamiento</li>
                            </ul>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">LedgerXpertz y PukaHealth</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Datos del negocio: RUC, raz&oacute;n social, direcci&oacute;n</li>
                                <li>Datos de clientes del negocio: c&eacute;dula/RUC, nombre, direcci&oacute;n (requeridos para facturaci&oacute;n SRI)</li>
                                <li>PukaHealth: historia cl&iacute;nica del paciente ingresada por el m&eacute;dico tratante</li>
                                <li>Transacciones y movimientos de inventario</li>
                            </ul>

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">Agencia y PukaSalud</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Datos de contacto del prospecto (formulario web o WhatsApp)</li>
                                <li>Informaci&oacute;n del negocio del cliente para configuraci&oacute;n de campa&ntilde;as</li>
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

                            <p className="mt-4 font-semibold text-puka-black dark:text-white">Google Analytics 4 y Google Ads</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Usamos GA4 para analizar el tr&aacute;fico del sitio y Google Ads para mostrar publicidad relevante a visitantes previos.</li>
                                <li>Puedes desactivar el seguimiento instalando el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-puka-red underline">complemento de inhabilitaci&oacute;n de Google Analytics</a>.</li>
                            </ul>
                        </section>

                        {/* 4. Cómo usamos los datos */}
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Eye size={20} className="text-puka-red" /> 4. C&oacute;mo usamos tus datos
                            </h2>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Prestar y mejorar los servicios contratados</li>
                                <li>Generar y enviar facturas electr&oacute;nicas al SRI (Ecuador)</li>
                                <li>Responder consultas y dar soporte t&eacute;cnico</li>
                                <li>Enviar comunicaciones operativas del servicio (no publicidad sin consentimiento)</li>
                                <li>Analizar el uso del sitio para mejorar la experiencia (GA4)</li>
                                <li>Cumplir obligaciones legales y fiscales en Ecuador</li>
                            </ul>
                            <p className="mt-4">
                                <strong>No usamos datos personales para:</strong> venta a terceros, publicidad de terceros, perfilado autom&aacute;tico con efectos legales, ni entrenamiento de modelos de IA propios.
                            </p>
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
                                PukaDigital cumple con la <strong>Ley Org&aacute;nica de Protecci&oacute;n de Datos Personales (LOPDP)</strong> de Ecuador. Los datos se procesan principalmente en servidores de Google Cloud en Estados Unidos.
                            </p>
                            <p className="mt-4">
                                Para clientes o usuarios en la Uni&oacute;n Europea o Reino Unido, el tratamiento se realiza conforme a los principios del <strong>RGPD (GDPR)</strong>: minimizaci&oacute;n de datos, limitaci&oacute;n de finalidad, exactitud y derecho a supresi&oacute;n. Las transferencias a Google LLC se amparan en las <strong>Cl&aacute;usulas Contractuales Est&aacute;ndar</strong> de la Comisi&oacute;n Europea.
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
                                <strong>Email:</strong> legal@pukadigital.com<br />
                                <strong>WhatsApp:</strong> +593 96 406 5880<br />
                                <strong>Direcci&oacute;n:</strong> Quito, Pichincha, Ecuador
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 08 de abril de 2026. Esta pol&iacute;tica aplica a todos los servicios operados por PukaDigital en <strong>pukadigital.com</strong> y sus subdominios.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliticaPrivacidadPage;
