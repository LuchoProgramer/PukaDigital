'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle, Clock, Rocket, ExternalLink, Calendar } from 'lucide-react';

const CasoCarla = () => {
  // Colores de marca HealppyPets
  const brandColors = {
    primary: '#FFB6C1',      // Rosa claro
    primaryDark: '#FF8FA3',  // Rosa intenso
    secondary: '#87CEEB',    // Celeste
    accent: '#FFA500',       // Naranja
    success: '#4CAF50',      // Verde
    dark: '#2C3E50',         // Azul oscuro
  };

  // Timeline del proceso
  const timeline = [
    {
      month: 'Mes 1',
      title: 'Construcción de Base',
      date: 'Octubre 2025',
      completed: true,
      items: [
        'Web profesional en healppypets.com',
        'Google Business Profile optimizado',
        'Chatbot IA para WhatsApp configurado',
        'Fotos profesionales de la clínica',
        'Capacitación inicial completada',
      ],
    },
    {
      month: 'Mes 2',
      title: 'Posicionamiento Orgánico Logrado',
      date: 'Noviembre 2025',
      completed: true,
      current: false,
      items: [
        'Top 1 en ChatGPT por "Veterinaria Carcelén"',
        'Top 3 en Google Maps sin pagar publicidad',
        'Optimización de Landing Pages completada',
        'Primeros clientes llegando solo por búsqueda',
      ],
    },
    {
      month: 'Mes 3',
      title: 'La Decisión de Escalar (Dilema Actual)',
      date: 'Enero 2026',
      completed: false,
      current: true,
      items: [
        'Disfrutando del "Tráfico Gratuito" (SEO)',
        'Análisis: ¿Vale la pena pagar si ya tengo clientes?',
        'Superando el miedo a invertir en Ads',
        'Buscando el siguiente nivel de facturación',
      ],
    },
  ];

  // Lo que ya tiene
  const achieved = [
    { icon: '🌐', title: 'Web Profesional', desc: 'healppypets.com activo y funcionando' },
    { icon: '🤖', title: 'Chatbot IA', desc: 'Responde consultas 24/7 en WhatsApp' },
    { icon: '📍', title: 'Google Business', desc: 'Perfil optimizado y verificado' },
    { icon: '📸', title: 'Contenido Visual', desc: 'Fotos profesionales de la clínica' },
  ];

  // Próximos pasos
  const nextSteps = [
    'Lanzar primera campaña Google Ads',
    'Conseguir primeras conversiones pagadas',
    'Aumentar reseñas en Google',
    'Optimizar chatbot según consultas reales',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero */}
      <section style={{ backgroundColor: brandColors.primaryDark }} className="text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <Link href="/es/casos" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm">
              <ArrowLeft size={16} /> Volver a Casos Reales
            </Link>

            <div className="text-center">
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse border border-white/30">
                � SEO Orgánico Dominante - Top 3 Google / Top 1 IA
              </span>

              <div className="text-7xl mb-6">🐕</div>

              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Carla Vanesa Tutistar
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 mb-2">
                HealppyPets
              </p>
              <p className="text-lg opacity-80">
                Veterinaria • Quito, Ecuador
              </p>

              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <div className="bg-white/10 px-4 py-2 rounded flex items-center gap-2">
                  <span className="text-2xl">🥇</span>
                  <div className="text-left leading-tight">
                    <div className="text-xs opacity-70 uppercase tracking-widest">Ranking ChatGPT</div>
                    <div className="font-bold">#1 "Veterinaria Carcelén"</div>
                  </div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded flex items-center gap-2">
                  <span className="text-2xl">🥉</span>
                  <div className="text-left leading-tight">
                    <div className="text-xs opacity-70 uppercase tracking-widest">Ranking Google</div>
                    <div className="font-bold">Top 3 Orgánico</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Update más reciente */}
      <section style={{ backgroundColor: '#FFF0F3' }} className="py-8 dark:bg-pink-900/20 border-b border-pink-200 dark:border-pink-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div style={{ backgroundColor: brandColors.primaryDark }} className="text-white p-2 rounded-full">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-puka-black dark:text-white">
                  Update Honesto — 7 Ene 2026
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 italic">
                  "¿Para qué pagar si ya me encuentran gratis?"
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Esta es la pregunta real que enfrenta Carla hoy. El éxito orgánico (SEO) ha sido tan bueno que ha generado una comprensible resistencia a invertir dinero real en Ads. Como agencia, nuestro reto este mes no es técnico, es <b>estratégico</b>: Demostrarle que aunque el tráfico gratis es bueno, el tráfico pago es la llave para escalar de "estar llena" a "expandir el negocio".
                </p>
                <div className="mt-4 bg-white/50 dark:bg-black/20 p-3 rounded-sm border-l-4 border-puka-red text-sm text-gray-700 dark:text-gray-300">
                  <strong>Estado Real:</strong> La tarjeta de crédito está lista, pero el miedo a invertir sigue presente. Documentamos esto porque es la realidad de muchos emprendedores.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estado actual */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-puka-black dark:text-white">
              Lo Que Ya Tiene Carla
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {achieved.map((item, i) => (
                <div key={i} style={{ backgroundColor: '#FFF0F3', borderColor: brandColors.primary }} className="dark:bg-pink-900/20 p-6 rounded-sm text-center border dark:border-pink-800">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-puka-black dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  <CheckCircle style={{ color: brandColors.primaryDark }} className="mx-auto mt-3" size={24} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-puka-black dark:text-white">
              Timeline del Proceso
            </h2>

            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />

              {timeline.map((phase, index) => (
                <div key={index} className="relative pl-20 pb-12 last:pb-0">
                  {/* Dot */}
                  <div
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 ${phase.completed
                      ? 'bg-green-500'
                      : phase.current
                        ? 'animate-pulse'
                        : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    style={phase.current ? { backgroundColor: brandColors.primaryDark } : {}}
                  />

                  {/* Contenido */}
                  <div
                    className={`p-6 rounded-sm ${phase.current
                      ? 'dark:bg-pink-900/20'
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                      }`}
                    style={phase.current ? { backgroundColor: '#FFF0F3', border: `2px solid ${brandColors.primaryDark}` } : {}}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`px-3 py-1 rounded-sm text-sm font-bold ${phase.current
                          ? 'text-white'
                          : phase.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        style={phase.current ? { backgroundColor: brandColors.primaryDark } : {}}
                      >
                        {phase.month}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {phase.date}
                      </span>
                      {phase.current && (
                        <span style={{ color: brandColors.primaryDark }} className="dark:text-pink-400 text-sm font-bold">
                          ← ESTAMOS AQUÍ
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-puka-black dark:text-white mb-4">
                      {phase.title}
                    </h3>

                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          {phase.completed ? (
                            <CheckCircle size={16} className="text-green-500 mt-1 shrink-0" />
                          ) : phase.current ? (
                            <Rocket size={16} style={{ color: brandColors.primaryDark }} className="mt-1 shrink-0" />
                          ) : (
                            <Clock size={16} className="text-gray-400 mt-1 shrink-0" />
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

      {/* Próximos pasos */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-puka-black dark:text-white">
              Próximos Pasos Esta Semana
            </h2>

            <div style={{ backgroundColor: '#FFF0F3' }} className="dark:bg-pink-900/20 p-8 rounded-sm border border-pink-200 dark:border-pink-800">
              <ul className="space-y-4">
                {nextSteps.map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div style={{ backgroundColor: brandColors.primaryDark }} className="w-8 h-8 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visita su web */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 text-puka-black dark:text-white">
              Visita el Sitio de Carla
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ya puedes ver su web funcionando y su Google Business activo.
            </p>
            <a
              href="https://healppypets.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: brandColors.primaryDark }}
              className="text-white px-8 py-4 rounded-sm font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Visitar healppypets.com <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: brandColors.primaryDark }} className="py-20 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            ¿Quieres Tu Propio Proceso Documentado?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Documenta tu transformación digital desde el día 1.
          </p>
          <Link
            href="/es/contacto"
            style={{ color: brandColors.primaryDark }}
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

export default CasoCarla;
