'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const TerminosLedgerXpertzPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link
                    href="/ledgerxpertz"
                    className="inline-flex items-center gap-2 text-puka-red hover:underline mb-8 font-bold uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={16} /> Volver a LedgerXpertz
                </Link>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-puka-red/10 rounded-sm">
                            <FileText className="text-puka-red" size={32} />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                            T&eacute;rminos de LedgerXpertz
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 1. Alcance
                            </h2>
                            <p className="mt-4">
                                Estos t&eacute;rminos rigen la suscripci&oacute;n a <strong>LedgerXpertz</strong>, el sistema de punto de venta, inventario y facturaci&oacute;n electr&oacute;nica provisto por <strong>Puka Digital LLC</strong> (Casper, Wyoming, USA &middot; EIN: <code>320856610</code>). Complementan los <Link href="/legal/terminos" className="text-puka-red hover:underline">T&eacute;rminos y Condiciones generales</Link> y la <Link href="/legal/politica-de-privacidad" className="text-puka-red hover:underline">Pol&iacute;tica de Privacidad</Link>. Si algo de esos documentos choca con lo que dice esta p&aacute;gina, para LedgerXpertz vale lo que dice esta p&aacute;gina.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 2. Per&iacute;odo de prueba de 30 d&iacute;as
                            </h2>
                            <p className="mt-4">
                                La prueba gratuita dura <strong>30 d&iacute;as contados desde la entrega de los accesos</strong>, uses o no el sistema. No pide tarjeta.
                            </p>
                            <p>
                                Sirve para que pruebes LedgerXpertz con tu operaci&oacute;n real y nos reportes lo que no funcione o te falte. Lo que no se reporte en esos 30 d&iacute;as no se considera parte de la implementaci&oacute;n.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 3. Qu&eacute; incluye tu plan
                            </h2>
                            <ul className="mt-4">
                                <li>El sistema <strong>tal como est&aacute; publicado</strong> en <Link href="/ledgerxpertz" className="text-puka-red hover:underline">pukadigital.com/ledgerxpertz</Link>: facturaci&oacute;n electr&oacute;nica SRI (facturas, gu&iacute;as de remisi&oacute;n y notas de cr&eacute;dito), inventario en tiempo real, punto de venta con caja, turnos y varias formas de pago, tienda en l&iacute;nea integrada y reportes de ventas, kardex y cierres de caja, en la nube y desde el celular.</li>
                                <li>Las <strong>actualizaciones generales</strong> que publiquemos para todos los clientes.</li>
                                <li>La <strong>carga inicial de datos</strong> que se acuerde por escrito al contratar.</li>
                                <li>La <strong>capacitaci&oacute;n inicial</strong> para empezar a usar el sistema.</li>
                                <li>El <strong>soporte</strong> descrito en el punto 7.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 4. Errores y desarrollo a medida
                            </h2>
                            <p className="mt-4">
                                <strong>Un error</strong> es algo que el sistema promete y no hace. Lo corregimos sin costo.
                            </p>
                            <p>
                                <strong>El desarrollo a medida</strong> es todo lo dem&aacute;s: una funci&oacute;n nueva, un cambio en c&oacute;mo trabaja el sistema o una integraci&oacute;n con tus sistemas o p&aacute;ginas web. No est&aacute; incluido en el plan. Se cotiza aparte, se aprueba por escrito y se agenda. Si no se aprueba por escrito, no se hace.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 5. Planes y locales
                            </h2>
                            <p className="mt-4">
                                El precio depende de cu&aacute;ntos locales o sucursales activos uses: Starter, 1 local; Grow, 2 locales; Pro, 3 locales. Los precios vigentes son los publicados en la p&aacute;gina de LedgerXpertz, m&aacute;s IVA.
                            </p>
                            <p>
                                Si usas m&aacute;s locales que los de tu plan, pasas al plan que los cubra. Por encima de los 3 locales del plan Pro, cada local adicional cuesta <strong>$10 al mes + IVA</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 6. Pagos, suspensi&oacute;n y cancelaci&oacute;n
                            </h2>
                            <ul className="mt-4">
                                <li>Se paga <strong>por adelantado</strong>, mensual o anual seg&uacute;n el plan elegido.</li>
                                <li>Si un pago no llega, el servicio se suspende <strong>a los 5 d&iacute;as del vencimiento</strong>. Tus datos se conservan y el acceso vuelve al ponerte al d&iacute;a.</li>
                                <li><strong>Sin permanencia:</strong> puedes cancelar cuando quieras. Conservas el acceso hasta el final del per&iacute;odo ya pagado, que no se reembolsa.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 7. Soporte
                            </h2>
                            <p className="mt-4">
                                Por WhatsApp, de <strong>lunes a viernes de 9:00 a 18:00</strong> (hora de Ecuador). Respondemos en un m&aacute;ximo de <strong>24 horas h&aacute;biles</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 8. Tus datos
                            </h2>
                            <p className="mt-4">
                                Los datos que registras en LedgerXpertz <strong>son tuyos</strong>. Puedes descargar en cualquier momento tus reportes (ventas, inventario y kardex, compras, gastos y cierres de caja) en Excel o PDF, y los XML de tus comprobantes electr&oacute;nicos. Un per&iacute;odo largo se descarga en partes.
                            </p>
                            <p>
                                Al cancelar, te entregamos a pedido una exportaci&oacute;n completa de tus datos. Los tratamos con confidencialidad y solo para prestarte el servicio, como explica la <Link href="/legal/politica-de-privacidad" className="text-puka-red hover:underline">Pol&iacute;tica de Privacidad</Link>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 9. Facturaci&oacute;n electr&oacute;nica y SRI
                            </h2>
                            <p className="mt-4">
                                Para emitir comprobantes, eres responsable de tener vigente tu firma electr&oacute;nica, tu RUC y tus establecimientos y puntos de emisi&oacute;n, y de cumplir tus obligaciones ante el SRI. No respondemos por rechazos que vengan de esos datos, por ejemplo una firma vencida o un establecimiento cerrado.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 10. Disponibilidad y responsabilidad
                            </h2>
                            <p className="mt-4">
                                LedgerXpertz es un servicio en la nube. Hacemos nuestro mejor esfuerzo para que est&eacute; siempre disponible, pero puede haber interrupciones por mantenimiento o por fallas de proveedores externos, incluido el SRI.
                            </p>
                            <p>
                                Nuestra responsabilidad total se limita a lo que hayas pagado por LedgerXpertz en los &uacute;ltimos 12 meses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 11. Cambios a estos t&eacute;rminos
                            </h2>
                            <p className="mt-4">
                                Si cambiamos estos t&eacute;rminos, te avisaremos con al menos 30 d&iacute;as de anticipaci&oacute;n por WhatsApp o correo. Si no est&aacute;s de acuerdo, puedes cancelar antes de que el cambio entre en vigor.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 20 de octubre de 2026. Empresa: Puka Digital LLC (Wyoming, USA). Para dudas legales espec&iacute;ficas, cont&aacute;ctanos a <strong>legal@pukadigital.com</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminosLedgerXpertzPage;
