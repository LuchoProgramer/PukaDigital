'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, TrendingUp, Users, Star, Globe, Shield, ShoppingCart, BarChart3, ArrowRight } from 'lucide-react';

const CasoYanett = () => {
    // Timeline del proceso
    const timeline = [
        {
            month: 'Día 1',
            title: 'Implementación de Inventario',
            date: 'Diciembre 2025',
            completed: true,
            items: [
                'Carga masiva de stock inicial en LedgerXpertz',
                'Configuración de categorías (Whisky, Ron, Cervezas, etc)',
                'Control de utilidades por producto configurado',
                'Acceso móvil para Yanett desde su local',
            ],
            metrics: null,
        },
        {
            month: 'Semana 1',
            title: 'Digitalización de Ventas',
            date: 'En progreso',
            completed: false,
            items: [
                'Registro de ventas en tiempo real',
                'Alertas de stock mínimo para evitar quiebres',
                'Identificación de "horas pico" de ventas',
            ],
            metrics: [
                { value: '0', label: 'Robos detectados' },
                { value: '100%', label: 'Claridad en caja' },
            ],
        },
        {
            month: 'Mes 2',
            title: 'Catálogo Web SEO',
            date: 'Próximamente',
            completed: false,
            items: [
                'Lanzamiento de web catálogo pública',
                'Sincronización API con inventario real',
                'SEO Local: "licorería cerca de mí"',
            ],
            metrics: null,
        },
        {
            month: 'Mes 3',
            title: 'Independencia Total',
            date: 'Febrero 2026',
            completed: false,
            items: [
                'Análisis de utilidades mensual automático',
                'Cero dependencia de Puka para cambios de precios',
                'Control total del negocio desde el celular',
            ],
            metrics: [{ value: '100%', label: 'Control' }],
        },
    ];

    // Colores de marca La Huequita Quiteña (Negro, Blanco, Dorado)
    const brandColors = {
        primary: '#B8860B',    // DarkGoldenRod (Dorado Premium)
        secondary: '#000000',  // Negro
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">

            {/* Hero - Colores Premium */}
            <section style={{ backgroundColor: brandColors.secondary }} className="text-white py-20 border-b-4 border-amber-500">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Breadcrumb */}
                        <Link href="/es/casos" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm">
                            <ArrowLeft size={16} /> Volver a Casos Reales
                        </Link>

                        <div className="text-center">
                            <span className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">
                                🟢 Caso Recién Iniciado — Día 1
                            </span>

                            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                                Yanett Susana Sarango
                            </h1>
                            <p className="text-2xl md:text-3xl font-display text-amber-500 mb-2 uppercase tracking-tighter">
                                Licorería La Huequita Quiteña
                            </p>
                            <p className="text-lg opacity-80">
                                Comercio & Retail • Quito, Ecuador
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* El Desafío */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-puka-black dark:text-white">
                            El Desafío: El "Caos" de los Inventarios
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-sm border border-red-100 dark:border-red-900/30">
                                <h3 className="text-red-700 dark:text-red-400 font-bold text-xl mb-4 flex items-center gap-2">
                                    <Shield size={24} /> Problemas Identificados
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-red-500 font-bold">!</span>
                                        Pérdida de stock no explicada (posibles robos).
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-red-500 font-bold">!</span>
                                        Desconocimiento de la utilidad neta real por producto.
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-red-500 font-bold">!</span>
                                        Dependencia de facturas en papel y memoria para el stock.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-sm border border-amber-100 dark:border-amber-900/30">
                                <h3 className="text-amber-700 dark:text-amber-400 font-bold text-xl mb-4 flex items-center gap-2">
                                    <ShoppingCart size={24} /> Solución PukaDigital
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="text-amber-600 shrink-0 mt-1" size={20} />
                                        Implementación de <strong>LedgerXpertz</strong> para control total.
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="text-amber-600 shrink-0 mt-1" size={20} />
                                        Creación de Web Catálogo conectada vía API.
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="text-amber-600 shrink-0 mt-1" size={20} />
                                        Capacitación en análisis de utilidades y gestión de merma.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Indicator de LedgerXpertz */}
            <section className="py-20 bg-puka-black text-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-amber-500">
                                Control en su Bolsillo
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                Yanett ahora puede ver, desde su celular, exactamente cuántas botellas de cada producto tiene en su local, cuánto le costó cada una y cuánto está ganando.
                            </p>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/10">
                                <BarChart3 className="text-amber-500" size={40} />
                                <div>
                                    <p className="font-bold">Facturación vía API</p>
                                    <p className="text-sm text-gray-500">Próximamente integrada al Catálogo</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute -inset-10 bg-amber-500 opacity-20 blur-3xl rounded-full"></div>
                            <div className="bg-gray-900 border border-gray-800 p-2 rounded-xl shadow-2xl relative z-10">
                                <div className="bg-white rounded-lg p-4 text-puka-black aspect-[9/16] max-w-[280px] mx-auto overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="font-bold text-xs">Inventario Real</div>
                                        <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-12 bg-gray-100 rounded-sm flex items-center px-3 justify-between">
                                            <span className="text-[10px] font-bold">Whisky Black Label</span>
                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 rounded-full font-bold">24 unid</span>
                                        </div>
                                        <div className="h-12 bg-gray-100 rounded-sm flex items-center px-3 justify-between">
                                            <span className="text-[10px] font-bold">Gin Tanqueray</span>
                                            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 rounded-full font-bold">12 unid</span>
                                        </div>
                                        <div className="h-12 bg-gray-100 rounded-sm flex items-center px-3 justify-between">
                                            <span className="text-[10px] font-bold">Ron Abuelo</span>
                                            <span className="bg-red-100 text-red-700 text-[10px] px-2 rounded-full font-bold">3 unid</span>
                                        </div>
                                    </div>
                                    <div className="mt-20 pt-4 border-t border-gray-100">
                                        <div className="text-[10px] text-gray-400">Utilidad Proyectada hoy:</div>
                                        <div className="text-2xl font-bold text-amber-600">$142.50</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline del proceso */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center text-puka-black dark:text-white">
                            Hoja de Ruta de Independencia
                        </h2>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                            {timeline.map((phase, index) => (
                                <div key={index} className="relative pl-20 pb-12 last:pb-0">
                                    <div
                                        className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 ${phase.completed ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
                                            }`}
                                    />

                                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-sm">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="bg-amber-500 text-white px-3 py-1 rounded-sm text-sm font-bold">
                                                {phase.month}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                {phase.date}
                                            </span>
                                            {phase.completed && (
                                                <CheckCircle className="text-green-500" size={20} />
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-puka-black dark:text-white mb-4">
                                            {phase.title}
                                        </h3>

                                        <ul className="space-y-2 mb-4">
                                            {phase.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                                    <CheckCircle size={16} className={`${phase.completed ? 'text-green-500' : 'text-amber-500/50'} mt-1 shrink-0`} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        {phase.metrics && (
                                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                {phase.metrics.map((m, i) => (
                                                    <div key={i} className="bg-white dark:bg-gray-900 px-4 py-2 rounded-sm">
                                                        <span className="text-2xl font-bold text-amber-500">{m.value}</span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{m.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section style={{ backgroundColor: brandColors.primary }} className="py-20 text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
                        ¿Quieres un Sistema que Cuide tu Negocio?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Deja de perder dinero por falta de control. Domina tu inventario y tus utilidades hoy.
                    </p>
                    <Link
                        href="/es/contacto"
                        className="bg-puka-black text-white px-12 py-5 rounded-sm text-xl font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                    >
                        Saber más de LedgerXpertz <ArrowRight size={24} />
                    </Link>
                    <p className="text-sm mt-6 opacity-80">
                        Último cupo disponible para el programa de Inventario este mes
                    </p>
                </div>
            </section>

        </div>
    );
};

export default CasoYanett;
