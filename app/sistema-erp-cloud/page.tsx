'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, BarChart3, Package, Users, FileText, CheckCircle, ArrowRight, TrendingUp, Clock, Shield, Smartphone, AlertCircle, Zap } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';

export default function SistemaERPPage() {
  const { t } = useTranslation();
  const [empleados, setEmpleados] = useState(3);
  const [productos, setProductos] = useState(100);

  // Cálculo ROI específico para ERP
  const horasPorSemanaExcel = empleados * 8; // cada empleado 8h/semana en Excel
  const costoMensualExcel = (horasPorSemanaExcel * 4 * 3); // $3/hora
  const errorInventario = productos * 0.15 * 30; // 15% error promedio, $30 costo/error
  const ahorroTotal = costoMensualExcel + errorInventario;
  const roi = ((ahorroTotal - 20) / 20) * 100;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Sistema ERP Cloud para PYMEs - PukaDigital",
        "description": "Software de gestión empresarial en la nube: inventario, CRM, facturación electrónica SRI, reportes en tiempo real.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "20.00",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-puka-black min-h-screen text-puka-black dark:text-white selection:bg-puka-red selection:text-white">
      <SEO
        title="Sistema ERP Cloud para PYMEs Ecuador | Gestión sin Límites"
        description="ERP completo en la nube: inventario, CRM, facturación SRI, reportes. Reemplaza Excel con software profesional. Casos de éxito en Ecuador. Implementación en 30 días."
        keywords="erp pymes ecuador, sistema erp cloud, software inventario ecuador, facturacion electronica sri"
        structuredData={structuredData}
      />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-puka-red/5 -skew-x-12 transform origin-right"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 bg-puka-red text-white px-4 py-1.5 rounded-sm mb-8 text-sm font-bold tracking-wider uppercase">
              <Database size={16} />
              POTENCIADO POR LEDGERXPERTZ
            </div>

            <h1 className="font-display font-bold text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tight">
              Tu Empresa en <br />
              <span className="text-puka-red inline-block mt-2 underline decoration-4 underline-offset-8 italic">
                Tiempo Real.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl font-sans">
              Controla inventario, ventas, clientes y facturas desde cualquier parte del mundo. Sin instalaciones. Sin servidores costosos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/contacto"
                className="group bg-puka-black dark:bg-white text-white dark:text-puka-black px-10 py-5 rounded-sm font-display font-bold text-xl hover:bg-puka-red dark:hover:bg-puka-red dark:hover:text-white transition-all flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(199,23,30,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Migrar mi Negocio
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <div className="py-4 px-2 flex flex-col gap-1">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest leading-none">
                  SRI HOMOLOGADO • MULTI-TENANT • BACKUPS DIARIOS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA BRUTAL: ERP VS EXCEL */}
      <section className="py-24 bg-puka-black text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-bold text-5xl md:text-6xl mb-8 leading-tight">
                Excel es una Hoja, <br /> No un <span className="text-puka-red">Cerebro.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                Llevar el inventario en Excel es como manejar un avión a ciegas. Tienes los datos, pero no tienes la información para tomar decisiones hoy.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  15-30% de error promedio en digitación manual.
                </div>
                <div className="flex items-start gap-4 text-lg font-bold text-red-400">
                  <AlertCircle size={24} className="shrink-0 mt-1" />
                  Información aislada: Ventas no habla con Inventario.
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 md:p-10 rounded-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="pb-4">Funcionalidad</th>
                      <th className="pb-4 text-puka-red">ERP Puka</th>
                      <th className="pb-4">Excel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-bold">
                    <tr>
                      <td className="py-4">Datos</td>
                      <td className="py-4 text-green-500">TIEMPO REAL</td>
                      <td className="py-4 text-gray-500">Manual</td>
                    </tr>
                    <tr>
                      <td className="py-4">Acceso Móvil</td>
                      <td className="py-4 text-green-500">SI</td>
                      <td className="py-4 text-gray-500">No</td>
                    </tr>
                    <tr>
                      <td className="py-4">Factura SRI</td>
                      <td className="py-4 text-green-500">AUTOMÁTICA</td>
                      <td className="py-4 text-gray-500">Manual</td>
                    </tr>
                    <tr>
                      <td className="py-4">Usuarios</td>
                      <td className="py-4 text-green-500">ILIMITADOS</td>
                      <td className="py-4 text-gray-500">Uno</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 bg-puka-red p-6 rounded-sm text-center">
                <div className="text-sm font-bold uppercase mb-1">Ahorro Mensual Promedio</div>
                <div className="text-4xl font-black">$600+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 bg-puka-beige text-puka-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-6xl mb-16 italic">Tecnología de Corporación. <span className="text-puka-red">Precio de PYME.</span></h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
            {/* Plan 1 */}
            <div className="bg-white p-10 rounded-sm shadow-xl border-t-8 border-puka-red">
              <h3 className="font-display font-black text-2xl mb-4">Solo Sistema ERP</h3>
              <div className="text-6xl font-black mb-4">$20<span className="text-sm text-gray-400">/mes</span></div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 italic">Mantenimiento, Amazon Cloud y Soporte</p>

              <ul className="text-left space-y-4 mb-10 font-bold text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-puka-red" /> Hasta 5 Usuarios</li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-puka-red" /> Facturación SRI Automática</li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-puka-red" /> Reportes de Ventas en Vivo</li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-puka-red" /> Backups Diarios</li>
              </ul>

              <Link
                href="/contacto"
                className="block w-full bg-puka-black text-white py-4 rounded-sm font-display font-bold hover:bg-puka-red transition-colors"
              >
                Empezar Mi ERP
              </Link>
            </div>

            {/* Plan 2: Programa 3 Meses */}
            <div className="bg-puka-black text-white p-10 rounded-sm shadow-2xl relative scale-105 border-b-8 border-puka-red">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-puka-red text-white py-1 px-4 text-[10px] font-black uppercase tracking-widest rounded-full">Más Solicitado</div>
              <h3 className="font-display font-black text-2xl mb-4">Programa 3 Meses</h3>
              <div className="text-6xl font-black mb-4 text-puka-red">$300<span className="text-sm text-gray-400">/mes</span></div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 italic">Educación, Implementación y Resultados</p>

              <ul className="text-left space-y-4 mb-10 font-bold text-sm">
                <li className="flex items-center gap-2 font-black text-puka-red"><Zap size={18} fill="currentColor" /> Migración Completa de Datos</li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Capacitación para Autonomía</li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Web + Chatbot IA Incluidos</li>
                <li className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> $100/mes de Inversión Ads</li>
              </ul>

              <Link
                href="/contacto"
                className="block w-full bg-white text-puka-black py-4 rounded-sm font-display font-black hover:bg-puka-red hover:text-white transition-colors uppercase italic"
              >
                Unirme al Programa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-puka-red text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display font-bold text-6xl md:text-8xl mb-8 tracking-tighter italic uppercase">
            DOMINA TUS <br /> <span className="text-puka-black">NÚMEROS.</span>
          </h2>
          <p className="text-2xl mb-12 font-bold max-w-2xl mx-auto opacity-90 italic">
            No permitas que la falta de control mate tu crecimiento. Implementa LedgerXpertz hoy.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center max-w-md mx-auto">
            <Link
              href="/contacto"
              className="bg-white text-puka-red px-10 py-6 rounded-sm font-display font-black text-2xl hover:bg-puka-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              MIGRAR AHORA
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
