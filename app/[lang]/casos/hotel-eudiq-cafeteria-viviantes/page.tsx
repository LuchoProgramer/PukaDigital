'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle, Clock, Rocket, ExternalLink, Calendar, Building, Coffee } from 'lucide-react';

const CasoHotelEudiq = () => {
  // Colores de marca Hotel Eudiq
  const brandColors = {
    primary: '#03A688',    // Verde/Teal
    secondary: '#95BF39',  // Verde lima
    light: '#F2F2F2',      // Gris muy claro
  };

  // Timeline del proceso
  const timeline = [
    {
      week: 'Semana 1',
      title: 'Setup Inicial',
      date: '11-17 Nov 2025',
      completed: true,
      items: [
        'Web Hotel Eudiq con SEO optimizado',
        'Google Analytics configurado',
        'Landing page Cafetería Viviantes',
        'Menú digital interactivo',
        'Blog corporativo activo',
      ],
    },
    {
      week: 'Semana 2',
      title: 'Capacitación Fundamentos',
      date: '18-24 Nov 2025',
      completed: false,
      current: true,
      items: [
        'Aprendiendo: Por qué una web es máquina de conversiones',
        'Configurando Google Business para ambos negocios',
        'Entendiendo métricas básicas',
        'Primeras fotos profesionales',
      ],
    },
    {
      week: 'Semana 3-4',
      title: 'Activación Digital',
      date: 'Dic 2025',
      completed: false,
      items: [
        'Optimización Google Business',
        'Primeras reseñas solicitadas',
        'Contenido para redes sociales',
        'SEO local Loja',
      ],
    },
    {
      week: 'Mes 2',
      title: 'Google Ads',
      date: 'Dic-Ene 2026',
      completed: false,
      items: [
        'Primera campaña: "hotel loja centro"',
        'Remarketing visitantes web',
        'Optimización según temporada',
      ],
    },
    {
      week: 'Mes 3',
      title: 'Graduación',
      date: 'Febrero 2026',
      completed: false,
      items: [
        'Independencia digital completa',
        'Gestión autónoma de ambos negocios',
        'Sistema de reservas optimizado',
      ],
    },
  ];

  // Lo que ya tienen
  const achieved = [
    { icon: <Building style={{ color: brandColors.primary }} size={32} />, title: 'Web Hotel Eudiq', desc: 'Sitio profesional con SEO' },
    { icon: <Coffee style={{ color: brandColors.secondary }} size={32} />, title: 'Landing Viviantes', desc: 'Cafetería con menú digital' },
    { icon: '📊', title: 'Analytics', desc: 'Métricas desde día 1' },
    { icon: '📝', title: 'Blog', desc: 'Contenido SEO activo' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero */}
      <section style={{ backgroundColor: brandColors.primary }} className="text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <Link href="/es/casos" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm">
              <ArrowLeft size={16} /> Volver a Casos Reales
            </Link>

            <div className="text-center">
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse border border-white/30">
                🚀 Campaña Google Ads Activa - Fase Aprendizaje
              </span>

              <div className="text-7xl mb-6">🏨</div>

              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Eudalia Jadán & Diego Quezada
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 mb-2">
                Hotel Eudiq + Cafetería Viviantes
              </p>
              <p className="text-lg opacity-80">
                Hotelería & Gastronomía • Loja, Ecuador
              </p>
              <p className="text-sm opacity-70 mt-2">
                📍 Av. 8 de Diciembre y Juan José Flores
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Update más reciente */}
      <section style={{ backgroundColor: '#E8F5F1' }} className="py-8 dark:bg-teal-900/20 border-b dark:border-teal-800" >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div style={{ backgroundColor: brandColors.primary }} className="text-white p-2 rounded-full">
                <Rocket size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-puka-black dark:text-white">
                  Update Más Reciente — 7 Ene 2026
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  ¡Hito desbloqueado! Hoy <b>7 de Enero</b> hemos lanzado oficialmente las campañas de búsqueda para "Hotel en Loja". Tras la temporada alta de fiestas, entramos en la fase de adquisición pagada con una estructura web validada. Actualmente estamos en la fase de "Aprendizaje" del algoritmo de Google (primeros 7 días) recolectando datos de intención.
                </p>
                <p style={{ color: brandColors.primary }} className="text-sm dark:text-teal-400 mt-3 font-medium">
                  📊 Próximo reporte: Primeras conversiones y CTR (Click Through Rate).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estado actual */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-puka-black dark:text-white">
              Lo Que Ya Tienen (Semana 1)
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              Velocidad récord: 4 entregables en 7 días
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {achieved.map((item, i) => (
                <div key={i} style={{ backgroundColor: '#E8F5F1', borderColor: brandColors.primary }} className="dark:bg-teal-900/20 p-6 rounded-sm text-center border dark:border-teal-800">
                  <div className="flex justify-center mb-3">
                    {typeof item.icon === 'string' ? (
                      <span className="text-4xl">{item.icon}</span>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <h3 className="font-bold text-puka-black dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  <CheckCircle style={{ color: brandColors.primary }} className="mx-auto mt-3" size={24} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dos negocios */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-puka-black dark:text-white">
              Un Programa, Dos Negocios
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Hotel Eudiq */}
              <div style={{ borderColor: brandColors.primary }} className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-lg border-2 dark:border-teal-800">
                <div className="flex items-center gap-4 mb-6">
                  <Building style={{ color: brandColors.primary }} size={40} />
                  <div>
                    <h3 className="text-2xl font-bold text-puka-black dark:text-white">Hotel Eudiq</h3>
                    <p className="text-gray-600 dark:text-gray-400">Hospedaje en Loja</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    Web con sistema de información
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    SEO local optimizado
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    Google Business (próximamente)
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    Sistema de reservas (próximamente)
                  </li>
                </ul>

                <a
                  href="https://hoteleudiq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: brandColors.primary }}
                  className="font-bold hover:underline inline-flex items-center gap-1"
                >
                  hoteleudiq.com <ExternalLink size={16} />
                </a>
              </div>

              {/* Cafetería Viviantes */}
              <div style={{ borderColor: brandColors.secondary }} className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-lg border-2 dark:border-lime-800">
                <div className="flex items-center gap-4 mb-6">
                  <Coffee style={{ color: brandColors.secondary }} size={40} />
                  <div>
                    <h3 className="text-2xl font-bold text-puka-black dark:text-white">Cafetería Viviantes</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gastronomía en Loja</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    Landing page dedicada
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    Menú digital interactivo
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    Google Business (próximamente)
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
                    Pedidos WhatsApp (próximamente)
                  </li>
                </ul>

                <a
                  href="https://hoteleudiq.com/viviantes"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: brandColors.secondary }}
                  className="font-bold hover:underline inline-flex items-center gap-1"
                >
                  Ver menú <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-puka-black dark:text-white">
              Plan de 3 Meses
            </h2>

            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />

              {timeline.map((phase, index) => (
                <div key={index} className="relative pl-20 pb-10 last:pb-0">
                  {/* Dot */}
                  <div
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 ${phase.completed
                      ? ''
                      : phase.current
                        ? 'animate-pulse'
                        : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    style={phase.completed ? { backgroundColor: brandColors.primary } : phase.current ? { backgroundColor: brandColors.secondary } : {}}
                  />

                  {/* Contenido */}
                  <div
                    className={`p-5 rounded-sm ${phase.current
                      ? 'dark:bg-teal-900/20'
                      : phase.completed
                        ? 'dark:bg-teal-900/20'
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    style={phase.current ? { backgroundColor: '#E8F5F1', border: `2px solid ${brandColors.secondary}` } : phase.completed ? { backgroundColor: '#E8F5F1', border: `1px solid ${brandColors.primary}` } : {}}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-sm text-sm font-bold ${phase.current
                          ? 'text-white'
                          : phase.completed
                            ? 'text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                          }`}
                        style={phase.current ? { backgroundColor: brandColors.secondary } : phase.completed ? { backgroundColor: brandColors.primary } : {}}
                      >
                        {phase.week}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {phase.date}
                      </span>
                      {phase.current && (
                        <span style={{ color: brandColors.secondary }} className="dark:text-lime-400 text-sm font-bold">
                          ← AQUÍ
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-puka-black dark:text-white mb-3">
                      {phase.title}
                    </h3>

                    <ul className="space-y-1.5 text-sm">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          {phase.completed ? (
                            <CheckCircle size={14} style={{ color: brandColors.primary }} className="mt-0.5 shrink-0" />
                          ) : phase.current ? (
                            <Rocket size={14} style={{ color: brandColors.secondary }} className="mt-0.5 shrink-0" />
                          ) : (
                            <Clock size={14} className="text-gray-400 mt-0.5 shrink-0" />
                          )}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Esta semana */}
      <section style={{ backgroundColor: '#E8F5F1' }} className="py-16 dark:bg-teal-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-puka-black dark:text-white">
              Esta Semana Están Aprendiendo
            </h2>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-lg max-w-2xl mx-auto">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                <strong style={{ color: brandColors.primary }}>"¿Por qué una web es una máquina de conversiones?"</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                No es un catálogo digital. Es un vendedor 24/7 que trabaja mientras duermes.
                Eudalia y Diego están entendiendo cómo cada elemento de su web
                (títulos, botones, textos) está diseñado para convertir visitantes en huéspedes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: brandColors.primary }} className="py-20 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            ¿Tienes un Negocio en Loja o Ecuador?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Si Eudalia y Diego pueden digitalizar un hotel Y una cafetería al mismo tiempo,
            imagina lo que puedes lograr con tu negocio.
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
              Ver Otros Casos
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/es/casos/podoclinicec-cristina-munoz"
                className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm hover:shadow-lg transition-shadow text-left border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mb-3">
                  <img
                    src="https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg"
                    alt="Cristina"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-lg text-puka-black dark:text-white">Cristina - PodoclinicEC</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Podología • Quito Norte</p>
                <span className="inline-block mt-3 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold">
                  ✅ Graduándose
                </span>
              </Link>

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
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CasoHotelEudiq;
