'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, CheckCircle, X, ExternalLink, Search, Star, Calendar, TrendingUp, Users, Globe, MessageSquare } from 'lucide-react';

const CasoCristina = () => {
  // Timeline del proceso
  const timeline = [
    {
      month: 'Mes 1',
      title: 'Construcción de Base',
      date: 'Septiembre 2025',
      completed: true,
      items: [
        'Web profesional en podoclinicec.com',
        'Google Business Profile optimizado',
        'Fotos profesionales del consultorio',
        'Servicios detallados con precios',
        'Capacitación inicial en gestión digital',
      ],
      metrics: null,
    },
    {
      month: 'Mes 2',
      title: 'Activación de Google Ads',
      date: 'Octubre 2025',
      completed: true,
      items: [
        'Configuración de campaña Google Ads',
        'Keywords: "podóloga Quito Norte", "uñas encarnadas Quito"',
        'Segmentación Norte de Quito',
        'Aprendió a leer métricas y pausar campañas',
      ],
      metrics: [
        { value: '33', label: 'Conversiones Ads' },
        { value: '$', label: 'Costo eficiente' },
      ],
    },
    {
      month: 'Mes 3',
      title: 'Explosión Orgánica',
      date: 'Noviembre 2025',
      completed: true,
      items: [
        'Pacientes llegando por búsqueda orgánica',
        'Servicios a domicilio explotaron',
        'De 3 a 15 reseñas en Google',
        'Independencia digital completa',
      ],
      metrics: [
        { value: '+20', label: 'Conversiones orgánicas' },
        { value: '15', label: 'Reseñas Google' },
      ],
    },
    {
      month: 'Graduación',
      title: 'Independencia Total',
      date: '2 Diciembre 2025',
      completed: false,
      items: [
        'Maneja TODO ella misma',
        'No paga fees mensuales a agencias',
        'Control total de sus cuentas',
        'Puede crecer a su propio ritmo',
      ],
      metrics: null,
    },
  ];

  // Antes vs Después
  const before = [
    'Sin página web',
    'Google Business sin optimizar',
    'Solo 3 reseñas en Google',
    'Clientes solo por boca a boca',
    'Servicios a domicilio casi inexistentes',
    'Invisible en búsquedas locales',
  ];

  const after = [
    'Web profesional: podoclinicec.com',
    'Google Business 100% optimizado',
    '15 reseñas (5x más)',
    '33 conversiones por Google Ads',
    '20 conversiones orgánicas mensuales',
    'Top resultados "podóloga Quito Norte"',
    'Servicios a domicilio: principal fuente de ingresos',
  ];

  // Colores de marca PodoclinicEC
  const brandColors = {
    primary: '#60BEC3',    // Turquesa
    secondary: '#79A373',  // Verde
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Hero - Colores PodoclinicEC */}
      <section style={{ backgroundColor: brandColors.primary }} className="text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <Link href="/es/casos" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm">
              <ArrowLeft size={16} /> Volver a Casos Reales
            </Link>

            <div className="text-center">
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                ✅ Caso Completado — Graduándose 2 Dic 2025
              </span>
              
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Cristina Muñoz
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 mb-2">
                PodoclinicEC
              </p>
              <p className="text-lg opacity-80">
                Podología • Quito Norte, Ecuador
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Foto + Video placeholder */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dltfsttr7/image/upload/v1762797439/IMG_6879_lqniq0.jpg"
                alt="Yadira Cristina Muñoz - PodoclinicEC"
                width={1200}
                height={600}
                className="w-full rounded-sm shadow-2xl object-cover"
              />
              {/* Video overlay - para cuando tengas el video */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="bg-white rounded-full p-6 shadow-xl">
                  <div style={{ borderLeftColor: brandColors.primary }} className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
              📹 Video testimonial próximamente
            </p>
          </div>
        </div>
      </section>

      {/* Métricas destacadas */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-puka-black dark:text-white">
              Resultados en Números
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-6 rounded-sm text-center">
                <TrendingUp style={{ color: brandColors.primary }} className="mx-auto mb-3" size={32} />
                <div style={{ color: brandColors.primary }} className="text-4xl font-bold">33</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Conversiones Google Ads</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-sm text-center">
                <Users className="mx-auto text-green-600 mb-3" size={32} />
                <div className="text-4xl font-bold text-green-600">+20</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pacientes Orgánicos/Mes</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-sm text-center">
                <Star className="mx-auto text-yellow-600 mb-3" size={32} />
                <div className="text-4xl font-bold text-yellow-600">3→15</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reseñas Google</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-6 rounded-sm text-center">
                <Globe style={{ color: brandColors.secondary }} className="mx-auto mb-3" size={32} />
                <div style={{ color: brandColors.secondary }} className="text-4xl font-bold">Top 3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Google Maps Quito Norte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cita destacada */}
      <section style={{ backgroundColor: '#e8f5f5' }} className="py-16 dark:bg-teal-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div style={{ color: brandColors.primary }} className="text-6xl opacity-30 font-serif">"</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 -mt-8">
              Nunca había tenido presencia digital. Con Puka, en 3 meses pasé de 3 reseñas en Google a 15. Ahora recibo pacientes por Google Ads, búsquedas orgánicas, y los servicios a domicilio explotaron.
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Image
                src="https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg"
                alt="Cristina Muñoz"
                width={60}
                height={60}
                style={{ borderColor: brandColors.primary }}
                className="rounded-full border-2"
              />
              <div className="text-left">
                <p className="font-bold text-puka-black dark:text-white">Yadira Cristina Muñoz</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">PodoclinicEC • Quito Norte</p>
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
              El Viaje Completo (90 Días)
            </h2>
            
            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              
              {timeline.map((phase, index) => (
                <div key={index} className="relative pl-20 pb-12 last:pb-0">
                  {/* Dot */}
                  <div 
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 ${
                      phase.completed ? 'bg-green-500' : 'animate-pulse'
                    }`}
                    style={!phase.completed ? { backgroundColor: brandColors.primary } : {}}
                  />
                  
                  {/* Contenido */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-sm">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span style={{ backgroundColor: brandColors.primary }} className="text-white px-3 py-1 rounded-sm text-sm font-bold">
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
                          <CheckCircle size={16} className="text-green-500 mt-1 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    
                    {phase.metrics && (
                      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {phase.metrics.map((m, i) => (
                          <div key={i} className="bg-white dark:bg-gray-900 px-4 py-2 rounded-sm">
                            <span style={{ color: brandColors.primary }} className="text-2xl font-bold">{m.value}</span>
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

      {/* Antes vs Después */}
      <section className="py-16 bg-puka-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              La Transformación
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* ANTES */}
              <div className="bg-red-900/30 p-8 rounded-sm border border-red-500/30">
                <h3 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-2">
                  <X size={28} /> ANTES de Puka Digital
                </h3>
                <ul className="space-y-4">
                  {before.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="text-red-400 shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* DESPUÉS */}
              <div className="bg-green-900/30 p-8 rounded-sm border border-green-500/30">
                <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                  <CheckCircle size={28} /> DESPUÉS de 90 Días
                </h3>
                <ul className="space-y-4">
                  {after.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-green-400 shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Verificación */}
      <section style={{ backgroundColor: brandColors.primary }} className="py-16 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              No Nos Creas. Verifica Tú Mismo.
            </h2>
            <p className="text-lg opacity-90 mb-12">
              Todo lo que lees aquí es verificable públicamente.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <a 
                href="https://google.com/search?q=podóloga+quito+norte"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-6 rounded-sm transition-colors"
              >
                <Search className="mx-auto mb-4" size={40} />
                <h3 className="font-bold text-lg mb-2">Búscala en Google</h3>
                <p className="text-sm opacity-80 mb-4">
                  Busca "podóloga quito norte" y encuéntrala
                </p>
                <span className="text-sm font-bold">Buscar ahora →</span>
              </a>
              
              <a 
                href="https://google.com/maps/search/podoclinicec"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-6 rounded-sm transition-colors"
              >
                <Star className="mx-auto mb-4" size={40} />
                <h3 className="font-bold text-lg mb-2">Lee las Reseñas</h3>
                <p className="text-sm opacity-80 mb-4">
                  15 reseñas reales de pacientes satisfechos
                </p>
                <span className="text-sm font-bold">Ver reseñas →</span>
              </a>
              
              <a 
                href="https://podoclinicec.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-6 rounded-sm transition-colors"
              >
                <ExternalLink className="mx-auto mb-4" size={40} />
                <h3 className="font-bold text-lg mb-2">Visita su Web</h3>
                <p className="text-sm opacity-80 mb-4">
                  Todo lo que lees está en su sitio
                </p>
                <span className="text-sm font-bold">Visitar sitio →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lo que Cristina Hace Ahora */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-puka-black dark:text-white">
              ¿Qué Hace Cristina Ahora?
            </h2>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-lg">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Cada semana dedica <span style={{ color: brandColors.primary }} className="font-bold">menos de 1 hora</span> a su gestión digital:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm">
                  <p className="font-bold text-puka-black dark:text-white">20 min</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revisando métricas de Google Ads</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm">
                  <p className="font-bold text-puka-black dark:text-white">10 min</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Respondiendo reseñas nuevas</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-sm">
                  <p className="font-bold text-puka-black dark:text-white">5 min</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajustando horarios si es necesario</p>
                </div>
              </div>
              
              <p className="text-center text-gray-500 dark:text-gray-400 italic">
                El resto lo hacen las herramientas que aprendió a usar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: brandColors.primary }} className="py-20 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            ¿Quieres Resultados Como Este?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Si Cristina pudo pasar de cero a 53 conversiones mensuales, tú también puedes.
          </p>
          <Link 
            href="/es/contacto"
            style={{ color: brandColors.primary }}
            className="bg-white px-12 py-5 rounded-sm text-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Aplicar al Programa <ArrowRight size={24} />
          </Link>
          <p className="text-sm mt-6 opacity-80">
            Solo 2 cupos disponibles este mes
          </p>
        </div>
      </section>

      {/* Otros Casos */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-8 text-puka-black dark:text-white">
              Otros Casos en Progreso
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                href="/es/casos/healppypets-carla-tutistar"
                className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm hover:shadow-lg transition-shadow text-left border border-gray-200 dark:border-gray-700"
              >
                <span className="text-3xl">🐕</span>
                <h4 className="font-bold text-lg mt-3 text-puka-black dark:text-white">Carla - HealppyPets</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Veterinaria • Quito</p>
                <span className="inline-block mt-3 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded font-bold">
                  🟡 Mes 2 de 3
                </span>
              </Link>
              
              <Link 
                href="/es/casos/hotel-eudiq-cafeteria-viviantes"
                className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm hover:shadow-lg transition-shadow text-left border border-gray-200 dark:border-gray-700"
              >
                <span className="text-3xl">🏨</span>
                <h4 className="font-bold text-lg mt-3 text-puka-black dark:text-white">Hotel Eudiq + Viviantes</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Hotel & Cafetería • Loja</p>
                <span className="inline-block mt-3 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-bold">
                  🟢 Semana 2
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CasoCristina;
