'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, BarChart3, Package, Users, FileText, CheckCircle, ArrowRight, TrendingUp, Clock, Shield, Smartphone } from 'lucide-react';
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

  // Structured Data - Product + Service + FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": "https://pukadigital.com/sistema-erp-cloud#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": "https://pukadigital.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Servicios",
            "item": "https://pukadigital.com/productos"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Sistema ERP Cloud",
            "item": "https://pukadigital.com/sistema-erp-cloud"
          }
        ]
      },
      // Product Schema
      {
        "@type": "SoftwareApplication",
        "@id": "https://pukadigital.com/sistema-erp-cloud#product",
        "name": "Sistema ERP Cloud para PYMEs - PukaDigital",
        "description": "Software de gestión empresarial en la nube: inventario, CRM, facturación electrónica SRI, reportes en tiempo real. Basado en ODOO. Desde $20/mes para PYMEs en Ecuador.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "20",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "20.00",
            "priceCurrency": "USD",
            "unitText": "MONTH"
          },
          "availability": "https://schema.org/InStock",
          "url": "https://pukadigital.com/sistema-erp-cloud",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "reviewCount": "19",
          "bestRating": "5",
          "worstRating": "1"
        },
        "featureList": "Gestión de Inventario, CRM, Facturación Electrónica SRI, Reportes en Tiempo Real, Multi-usuario, Acceso Móvil"
      },
      // Service Schema
      {
        "@type": "Service",
        "@id": "https://pukadigital.com/sistema-erp-cloud#service",
        "serviceType": "ERP Implementation & Training",
        "name": "Implementación y Capacitación Sistema ERP Cloud",
        "description": "Migración desde Excel a ERP cloud profesional. Configuración personalizada, importación de datos, capacitación para gestión autónoma.",
        "provider": {
          "@id": "https://pukadigital.com/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Ecuador"
        },
        "offers": {
          "@type": "Offer",
          "price": "300",
          "priceCurrency": "USD",
          "description": "Implementación incluida en Programa de 3 Meses. Licencia $20/mes después."
        }
      },
      // FAQPage específico de ERP
      {
        "@type": "FAQPage",
        "@id": "https://pukadigital.com/sistema-erp-cloud#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuánto cuesta un sistema ERP para PYMEs en Ecuador?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ERPs tradicionales como SAP o Microsft Dynamics cuestan $5,000-$50,000 en licencias + $500-$2,000 mensuales por mantenimiento. Nuestro ERP basado en ODOO cuesta $20/mes todo incluido: licencia, servidor cloud, actualizaciones, soporte técnico y hasta 5 usuarios. La implementación está incluida en el Programa de 3 Meses ($300/mes)."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué ventajas tiene un ERP cloud versus llevar inventario en Excel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Excel: errores manuales frecuentes, información desactualizada, sin acceso móvil, imposible trabajo colaborativo, reportes limitados. ERP Cloud: actualizaciones en tiempo real, cero errores de cálculo, acceso desde cualquier dispositivo, multi-usuario simultáneo, alertas automáticas de stock bajo, facturación electrónica integrada, reportes avanzados. Caso real: Ferretería Los Andes eliminó 15 horas semanales de trabajo manual."
            }
          },
          {
            "@type": "Question",
            "name": "¿El sistema ERP cumple con las regulaciones del SRI Ecuador?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SÍ. Incluye facturación electrónica homologada por el SRI: emisión de facturas, notas de crédito, retenciones, guías de remisión. Generación automática de archivos XML, firma electrónica integrada, envío directo al SRI y clientes por email. Totalmente compatible con resoluciones vigentes del SRI."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo acceder al ERP desde mi celular?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SÍ. Interface responsive optimizada para móviles. Consulta inventario en tiempo real, registra ventas, emite facturas, revisa reportes desde cualquier smartphone o tablet. No requiere instalar apps, funciona en navegador web. Ideal para dueños de negocio que están en campo."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué pasa con mis datos si dejo de pagar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tienes 30 días para exportar toda tu información en formatos estándar (CSV, Excel, PDF). No retenemos datos como rehén. Si decides volver, puedes importar todo nuevamente. Esta es parte de nuestra filosofía de independencia digital: tus datos son TUYOS, no nuestros."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen transition-colors">
      <SEO 
        title="Sistema ERP Cloud para PYMEs Ecuador | Gestión Empresarial desde $20/mes"
        description="ERP completo en la nube: inventario, CRM, facturación SRI, reportes. Reemplaza Excel con software profesional. Casos de éxito en Ecuador. Implementación en 30 días."
        keywords="erp pymes ecuador, sistema erp cloud, software inventario ecuador, erp quito, facturacion electronica sri, sistema gestion empresarial, erp odoo ecuador"
        structuredData={structuredData}
      />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-800 to-puka-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600/30 backdrop-blur px-4 py-2 rounded-full mb-6 border border-emerald-400/30">
              <Database size={16} className="text-emerald-300" />
              <span className="text-sm font-semibold">Basado en ODOO - ERP Open Source Líder Mundial</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight">
              Di Adiós a Excel<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300">
                Bienvenido al ERP Cloud
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Gestiona inventario, clientes, ventas y facturación desde un solo sistema. 
              Información en tiempo real. Decisiones basadas en datos.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/contacto"
                className="bg-puka-red hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold text-lg shadow-2xl transition-all flex items-center gap-2"
              >
                Migrar desde Excel <ArrowRight size={20} />
              </Link>
              <Link 
                href="/demos"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-sm font-bold text-lg border border-white/30 transition-all flex items-center gap-2"
              >
                <BarChart3 size={20} /> Ver Demo del Sistema
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-emerald-300">80%</div>
                <div className="text-sm text-emerald-200">Menos tiempo en admin</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-emerald-300">0</div>
                <div className="text-sm text-emerald-200">Errores de inventario</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-emerald-300">SRI</div>
                <div className="text-sm text-emerald-200">Facturación integrada</div>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-sm border border-white/20">
                <div className="text-3xl font-bold text-emerald-300">$20</div>
                <div className="text-sm text-emerald-200">Por mes hasta 5 usuarios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULADORA ROI */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-sm shadow-lg">
            <h2 className="font-display font-bold text-3xl mb-6 text-center text-puka-black dark:text-white">
              Calcula Cuánto Ahorrarías con el ERP
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Número de empleados que usan Excel:
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={empleados}
                  onChange={(e) => setEmpleados(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-green-600"
                />
                <div className="text-right text-2xl font-bold text-green-600 mt-2">{empleados}</div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Productos en inventario:
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="1000" 
                  step="20"
                  value={productos}
                  onChange={(e) => setProductos(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-green-600"
                />
                <div className="text-right text-2xl font-bold text-green-600 mt-2">{productos}</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-emerald-700 text-white p-8 rounded-sm">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center border-r border-white/20 last:border-0">
                  <div className="text-sm opacity-90 mb-1">Costo Excel (tiempo)</div>
                  <div className="text-3xl font-bold">${costoMensualExcel.toFixed(0)}</div>
                  <div className="text-xs opacity-75">{horasPorSemanaExcel}h/semana</div>
                </div>
                <div className="text-center border-r border-white/20 last:border-0">
                  <div className="text-sm opacity-90 mb-1">Costo Errores</div>
                  <div className="text-3xl font-bold">${errorInventario.toFixed(0)}</div>
                  <div className="text-xs opacity-75">15% error promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-1">Ahorro Mensual</div>
                  <div className="text-3xl font-bold">${ahorroTotal.toFixed(0)}</div>
                  <div className="text-xs opacity-75">vs ERP $20</div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="text-center">
                  <div className="text-sm mb-2">ROI del ERP ($20/mes)</div>
                  <div className="text-4xl font-bold text-green-300">+{roi.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
              * Cálculo: 8h/semana por empleado en Excel ($3/hora), 15% error en inventario ($30/error). Datos conservadores.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARACIÓN: ERP vs EXCEL */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              ERP Cloud vs Excel: La Verdad
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th className="p-4 text-left font-bold text-gray-700 dark:text-gray-300">Funcionalidad</th>
                    <th className="p-4 text-center font-bold text-green-600">ERP Cloud PukaDigital</th>
                    <th className="p-4 text-center font-bold text-gray-500">Excel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Actualización de datos</td>
                    <td className="p-4 text-center text-green-600 font-bold">Tiempo real automático</td>
                    <td className="p-4 text-center text-red-600 font-bold">Manual (desactualizado)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Errores de cálculo</td>
                    <td className="p-4 text-center text-green-600 font-bold">0% (automatizado)</td>
                    <td className="p-4 text-center text-red-600 font-bold">15-30% promedio</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Acceso móvil</td>
                    <td className="p-4 text-center"><CheckCircle className="text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">Solo con OneDrive (lento)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Trabajo colaborativo</td>
                    <td className="p-4 text-center text-green-600 font-bold">5+ usuarios simultáneos</td>
                    <td className="p-4 text-center text-red-600 font-bold">Conflictos de versión</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Facturación SRI</td>
                    <td className="p-4 text-center"><CheckCircle className="text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">Sistema aparte ($50+/mes)</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Reportes avanzados</td>
                    <td className="p-4 text-center text-green-600 font-bold">Automáticos con gráficos</td>
                    <td className="p-4 text-center text-red-600 font-bold">Manual (horas de trabajo)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Alertas de stock bajo</td>
                    <td className="p-4 text-center"><CheckCircle className="text-green-600 mx-auto" /></td>
                    <td className="p-4 text-center text-gray-400">Revisión manual diaria</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">Historial de cambios</td>
                    <td className="p-4 text-center text-green-600 font-bold">Auditoría completa</td>
                    <td className="p-4 text-center text-red-600 font-bold">Se pierde info</td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-900/20 font-bold">
                    <td className="p-4 text-gray-900 dark:text-white">TIEMPO AHORRADO/MES</td>
                    <td className="p-4 text-center text-green-600 text-xl">40-60 horas</td>
                    <td className="p-4 text-center text-red-600 text-xl">0 horas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CASO DE ÉXITO */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-green-600 font-bold uppercase text-sm tracking-wider">Caso de Éxito Real</span>
              <h2 className="font-display font-bold text-4xl mt-2 text-puka-black dark:text-white">
                Ferretería Los Andes: Inventario en Tiempo Real
              </h2>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900/20 p-8 md:p-12 rounded-sm border border-green-200 dark:border-green-800">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="bg-green-600 text-white inline-block px-4 py-2 rounded-sm font-bold mb-4">
                    Ferretería - Quito Norte
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-puka-black dark:text-white">
                    "Eliminamos 15 horas semanales de conteo manual"
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Antes: 3 empleados dedicaban mañanas completas a conciliar Excel con inventario físico. Errores constantes. 
                    Ahora: Sistema actualiza stock automáticamente con cada venta. Alertas cuando producto llega a mínimo.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 dark:text-gray-300"><strong>80% menos tiempo</strong> en tareas administrativas</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 dark:text-gray-300"><strong>Cero faltantes</strong> de productos populares (antes 12/mes)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 dark:text-gray-300"><strong>ROI +520%</strong> en el segundo mes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-xl">
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">Métricas Reales</div>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-600 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Productos gestionados</div>
                      <div className="text-2xl font-bold text-puka-black dark:text-white">1,200+</div>
                      <div className="text-xs text-green-600">Antes: 300 en Excel (resto memoria)</div>
                    </div>
                    
                    <div className="border-l-4 border-green-600 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Errores de inventario/mes</div>
                      <div className="text-2xl font-bold text-puka-black dark:text-white">0</div>
                      <div className="text-xs text-green-600">Antes: 18 promedio ($540 en pérdidas)</div>
                    </div>
                    
                    <div className="border-l-4 border-green-600 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Facturas SRI/mes</div>
                      <div className="text-2xl font-bold text-puka-black dark:text-white">450+</div>
                      <div className="text-xs text-green-600">Electrónicas automáticas desde ERP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS DEL ERP */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Módulos Incluidos en Tu ERP
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-green-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Gestión de Inventario</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Control de stock en tiempo real
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Alertas de stock mínimo
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Múltiples bodegas/sucursales
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Transferencias entre bodegas
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">CRM y Ventas</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Base de datos de clientes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Historial de compras completo
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Seguimiento de cotizaciones
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Reportes de vendedores
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-purple-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Facturación SRI</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Facturas electrónicas automáticas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Notas de crédito/débito
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Retenciones en la fuente
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Guías de remisión
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="text-yellow-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Reportes y Analíticas</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Dashboard en tiempo real
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Productos más/menos vendidos
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Rentabilidad por producto
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Exportar a Excel/PDF
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="text-red-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Acceso Móvil</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    App responsive iOS/Android
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Consulta inventario en campo
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Registra ventas desde celular
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Sin necesidad de instalar apps
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-indigo-600" size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-puka-black dark:text-white">Multi-Usuario</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Hasta 5 usuarios simultáneos
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Permisos por rol (admin/vendedor)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Auditoría de acciones
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                    Sin conflictos de versiones
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl mb-4 text-puka-black dark:text-white">Inversión Transparente</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Precios fijos. Sin sorpresas.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Programa 3 Meses */}
              <div className="border-2 border-green-600 rounded-sm p-8 relative bg-white dark:bg-gray-800">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  TODO INCLUIDO
                </div>
                <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">Programa 3 Meses</h3>
                <div className="text-4xl font-bold mb-4 text-green-600">$300<span className="text-lg text-gray-500">/mes</span></div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 3: Implementación completa del ERP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 1: Web profesional (ya lista)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">MES 2: Chatbot IA WhatsApp incluido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Migración completa desde Excel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Capacitación para autonomía total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">$100/mes en Google Ads (3 meses)</span>
                  </li>
                </ul>

                <Link 
                  href="/contacto"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-sm font-bold transition-all"
                >
                  Empezar Ecosistema Completo
                </Link>
              </div>

              {/* Solo ERP */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-sm p-8 bg-white dark:bg-gray-800">
                <h3 className="font-bold text-2xl mb-2 text-puka-black dark:text-white">Solo Sistema ERP</h3>
                <div className="text-4xl font-bold mb-4 text-puka-black dark:text-white">$20<span className="text-lg text-gray-500">/mes</span></div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Hasta 5 usuarios simultáneos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Todos los módulos incluidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Facturación SRI integrada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-600 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Soporte técnico estándar</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <CheckCircle className="text-gray-400 shrink-0 mt-1" size={18} />
                    <span className="text-gray-400 line-through">Implementación: +$600</span>
                  </li>
                </ul>

                <Link 
                  href="/contacto"
                  className="block text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-puka-black dark:text-white py-3 rounded-sm font-bold transition-all"
                >
                  Consultar Implementación
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">*Requiere setup e importación de datos</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-sm mt-8 border border-green-200 dark:border-green-800">
              <p className="text-center text-gray-700 dark:text-gray-300">
                <strong className="text-green-600">Incluye GRATIS:</strong> Migración de datos desde Excel, capacitación en vivo (4 horas), 
                documentación en video, soporte extendido primer mes, backups automáticos diarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-4xl text-center mb-12 text-puka-black dark:text-white">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Cuánto cuesta un sistema ERP para PYMEs en Ecuador?
                  <span className="text-green-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  ERPs tradicionales como SAP o Microsoft Dynamics cuestan $5,000-$50,000 en licencias + $500-$2,000 mensuales por mantenimiento. 
                  Nuestro ERP basado en ODOO cuesta $20/mes todo incluido: licencia, servidor cloud, actualizaciones, soporte técnico y hasta 5 usuarios. 
                  La implementación está incluida en el Programa de 3 Meses ($300/mes).
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Qué ventajas tiene un ERP cloud versus llevar inventario en Excel?
                  <span className="text-green-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  Excel: errores manuales frecuentes, información desactualizada, sin acceso móvil, imposible trabajo colaborativo, reportes limitados. 
                  ERP Cloud: actualizaciones en tiempo real, cero errores de cálculo, acceso desde cualquier dispositivo, multi-usuario simultáneo, 
                  alertas automáticas de stock bajo, facturación electrónica integrada, reportes avanzados. Caso real: Ferretería Los Andes eliminó 
                  15 horas semanales de trabajo manual.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿El sistema ERP cumple con las regulaciones del SRI Ecuador?
                  <span className="text-green-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  SÍ. Incluye facturación electrónica homologada por el SRI: emisión de facturas, notas de crédito, retenciones, guías de remisión. 
                  Generación automática de archivos XML, firma electrónica integrada, envío directo al SRI y clientes por email. Totalmente compatible 
                  con resoluciones vigentes del SRI.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm shadow-md group">
                <summary className="font-bold text-lg cursor-pointer text-puka-black dark:text-white list-none flex justify-between items-center">
                  ¿Puedo acceder al ERP desde mi celular?
                  <span className="text-green-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                  SÍ. Interface responsive optimizada para móviles. Consulta inventario en tiempo real, registra ventas, emite facturas, revisa reportes 
                  desde cualquier smartphone o tablet. No requiere instalar apps, funciona en navegador web. Ideal para dueños de negocio que están en campo.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-800 to-puka-black text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Migra desde Excel en 30 Días
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Agenda videollamada. Importamos tus datos. Configuras el sistema. Empiezas a usarlo.
            </p>
            <Link 
              href="/contacto"
              className="inline-block bg-puka-red hover:bg-red-700 text-white px-10 py-5 rounded-sm font-bold text-lg shadow-2xl transition-all"
            >
              Agendar Migración Gratuita
            </Link>
            <p className="text-sm text-emerald-200 mt-4">
              Primera consultoría sin costo • Respuesta en 2 horas
            </p>
          </div>
        </div>
      </section>

      {/* RECURSOS RELACIONADOS */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl mb-8 text-puka-black dark:text-white">
              Recursos Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/local-14" className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-sm border border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-green-600">
                  Caso de Éxito: Ferretería Los Andes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cómo eliminaron 15 horas semanales de trabajo manual con el ERP cloud.
                </p>
              </Link>

              <Link href="/desarrollo-web-pymes" className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-sm border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-blue-600">
                  Desarrollo Web para PYMEs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complementa tu ERP con presencia digital profesional. Ecosistema integrado.
                </p>
              </Link>

              <Link href="/chatbot-ia-whatsapp" className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-sm border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-purple-600">
                  Chatbot IA WhatsApp
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatiza consultas de clientes mientras el ERP gestiona operaciones.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
