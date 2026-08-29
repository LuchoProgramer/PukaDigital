'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, CheckCircle, X, ExternalLink, Search, Star, TrendingUp, Users, Globe } from 'lucide-react';
import VideoTestimonial from '@/components/VideoTestimonial';
import * as ga from '@/lib/analytics';
import { RANKINGS, COMPETITORS, SEO_YOY } from './data';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
      month: 'Mes 4',
      title: 'Independencia Total',
      date: '2 Diciembre 2025',
      completed: true,
      items: [
        'Maneja TODO ella misma',
        'No paga fees mensuales a agencias',
        'Control total de sus cuentas',
        'Partner Early Adopter: Nuevo Sistema de Citas Médicas',
      ],
      metrics: [{ value: '100%', label: 'Independencia' }],
    },
    {
      month: 'Hoy',
      title: 'Nueve meses después, sigue creciendo sola',
      date: 'Agosto 2026',
      completed: true,
      items: [
        'Lidera su categoría en Quito Norte: 56 reseñas contra 10 del segundo lugar',
        'Top 3 en "podólogo quito precios" y "podólogo quito norte"',
        'Amplió el equipo: ya no atiende sola',
        'Landings propias por servicio y por zona (La Florida, Iñaquito, Rumipamba)',
        'Blog activo y quiz de evaluación para captar pacientes',
      ],
      metrics: [
        { value: '371', label: 'Conversiones Ads' },
        { value: '$2,52', label: 'Costo por conversión' },
      ],
    },
  ];

  // Antes vs Después
  const before = [
    'Sin página web',
    'Google Business sin optimizar',
    'Solo 3 reseñas en Google',
    '2 clics orgánicos en todo un trimestre',
    'Posición media 17,2 — página 2 de Google',
    'Clientes solo por boca a boca',
    'Servicios a domicilio casi inexistentes',
  ];

  const after = [
    'Web propia con landings por servicio y por zona',
    '56 reseñas con calificación 5,0 (18x más)',
    '281 clics orgánicos por trimestre (140x más)',
    'Posición media 6,6 — primera página',
    '371 conversiones por Google Ads a $2,52 cada una',
    'Top 3 en "podólogo quito precios" y "podólogo quito norte"',
    'Equipo ampliado: ya no atiende sola',
  ];

  // Colores de marca PodoclinicEC
  const brandColors = {
    primary: '#60BEC3',    // Turquesa
    secondary: '#79A373',  // Verde
  };

  const WHATSAPP_NUMBER = '593964065880';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

  const handleWhatsAppClick = (location: string, message?: string) => {
    ga.trackWhatsAppDirectoClick(location);
    const finalLink = message
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
      : WHATSAPP_LINK;
    window.open(finalLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero - Colores PodoclinicEC */}
      <section style={{ backgroundColor: brandColors.primary }} className="text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <Link href="/casos" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft size={16} /> Ver otros casos de éxito
            </Link>

            <div className="text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-xs font-black mb-6 uppercase tracking-widest border border-white/30">
                  ✅ DATOS VERIFICABLES &mdash; ACTUALIZADO AGOSTO 2026
                </span>

                <h1 className="font-display text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                  371 conversiones a{' '}
                  <span className="underline decoration-white/30 underline-offset-8">$2,52 cada una</span>
                </h1>

                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl leading-relaxed">
                  Cristina Mu&ntilde;oz ten&iacute;a 20 pacientes al mes y 2 clics org&aacute;nicos
                  en todo un trimestre. Once meses despu&eacute;s lidera la podolog&iacute;a de Quito
                  Norte en Google &mdash; y lo gestiona ella misma.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-10 text-lg md:text-xl font-medium opacity-90">
                  <p className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-sm border border-white/20">
                    <CheckCircle size={22} /> 371 conversiones
                  </p>
                  <p className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-sm border border-white/20">
                    <CheckCircle size={22} /> 5,0 &#9733; con 56 rese&ntilde;as
                  </p>
                  <p className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-sm border border-white/20">
                    <CheckCircle size={22} /> Top 3 en Google
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleWhatsAppClick('caso_cristina_hero_primary', 'Hola Luis, vi el caso de éxito de Cristina y quiero resultados similares para mi negocio de podología/salud.')}
                    className="bg-puka-black text-white px-8 py-4 rounded-sm font-bold text-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-2xl transform hover:-translate-y-1"
                  >
                    <WhatsAppIcon size={24} className="text-[#25D366]" />
                    Quiero resultados como Cristina
                  </button>
                  <a
                    href="https://google.com/search?q=podóloga+quito+norte"
                    target="_blank"
                    className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-sm font-bold text-xl transition-all border border-white/30 text-center"
                  >
                    Verificar en Google
                  </a>
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-widest text-white/70 animate-pulse">
                  Datos de Google Ads, Search Console y Google Business — publicados con autorización de la clienta
                </p>
              </div>

              <div className="hidden md:block">
                <div className="bg-white/10 p-4 rounded-sm border border-white/20 backdrop-blur-sm shadow-2xl skew-y-1 transform hover:skew-y-0 transition-transform duration-500">
                  <Image
                    src="https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg"
                    alt="Cristina Muñoz"
                    width={600}
                    height={400}
                    className="rounded-sm object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-sm shadow-2xl">
                    <p className="text-puka-black font-black text-4xl">371</p>
                    <p className="text-puka-black/60 text-xs font-bold uppercase tracking-widest">Conversiones a hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Foto + Video placeholder */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <VideoTestimonial
                videoId="bSge9e1Se4w"
                title="Testimonio Yadira Cristina Muñoz - PodoclinicEC"
              />
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
              📹 Testimonio completo
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
              <div style={{ backgroundColor: '#e8f5f5' }} className="dark:bg-teal-900/20 p-6 rounded-sm text-center">
                <TrendingUp style={{ color: brandColors.primary }} className="mx-auto mb-3" size={32} />
                <div style={{ color: brandColors.primary }} className="text-4xl font-bold">371</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Conversiones Google Ads</div>
              </div>
              <div style={{ backgroundColor: '#e8f5f5' }} className="dark:bg-teal-900/20 p-6 rounded-sm text-center">
                <Users style={{ color: brandColors.secondary }} className="mx-auto mb-3" size={32} />
                <div style={{ color: brandColors.secondary }} className="text-4xl font-bold">$2,52</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Costo por conversi&oacute;n</div>
              </div>
              <div style={{ backgroundColor: '#e8f5f5' }} className="dark:bg-teal-900/20 p-6 rounded-sm text-center">
                <Star style={{ color: brandColors.primary }} className="mx-auto mb-3" size={32} />
                <div style={{ color: brandColors.primary }} className="text-4xl font-bold">5,0 &#9733;</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">56 reseñas en Google (antes 3)</div>
              </div>
              <div style={{ backgroundColor: '#e8f5f5' }} className="dark:bg-teal-900/20 p-6 rounded-sm text-center">
                <Globe style={{ color: brandColors.secondary }} className="mx-auto mb-3" size={32} />
                <div style={{ color: brandColors.secondary }} className="text-4xl font-bold">&times;140</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clics org&aacute;nicos vs. hace un a&ntilde;o</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cita destacada */}
      <section style={{ backgroundColor: '#e8f5f5' }} className="py-16 dark:bg-teal-900/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div style={{ color: brandColors.primary }} className="text-6xl opacity-30 font-serif">&ldquo;</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 -mt-8">
              &ldquo;Lo que más me sorprendió es que estoy logrando mi objetivo: hacer crecer Podoclinic. Antes tenía 20 pacientes al mes, ahora tengo 3 a 4 diarios. El reconocimiento de mi marca ha crecido increíblemente.&rdquo;
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
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 ${phase.completed ? 'bg-green-500' : 'animate-pulse'
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
      <section style={{ backgroundColor: '#1a1a2e' }} className="py-16 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              La Transformación
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* ANTES */}
              <div className="bg-gray-800/50 p-8 rounded-sm border border-gray-600/30">
                <h3 className="text-2xl font-bold mb-6 text-gray-400 flex items-center gap-2">
                  <X size={28} /> ANTES de Puka Digital
                </h3>
                <ul className="space-y-4">
                  {before.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="text-gray-500 shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DESPUÉS */}
              <div style={{ backgroundColor: 'rgba(96, 190, 195, 0.15)', borderColor: brandColors.primary }} className="p-8 rounded-sm border">
                <h3 style={{ color: brandColors.primary }} className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle size={28} /> HOY, 11 MESES DESPU&Eacute;S
                </h3>
                <ul className="space-y-4">
                  {after.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle style={{ color: brandColors.primary }} className="shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Posiciones ganadas en Google */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-puka-black dark:text-white">
              De la p&aacute;gina 2 al top 3
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              Comparando junio&ndash;agosto de 2026 contra el mismo trimestre de 2025, antes de
              empezar. Datos de Google Search Console.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Clics org\u00e1nicos', before: SEO_YOY.clicksBefore.toString(), after: SEO_YOY.clicksAfter.toString() },
                { label: 'Impresiones', before: SEO_YOY.impressionsBefore.toLocaleString('es-EC'), after: SEO_YOY.impressionsAfter.toLocaleString('es-EC') },
                { label: 'Posici\u00f3n media', before: SEO_YOY.positionBefore.toString().replace('.', ','), after: SEO_YOY.positionAfter.toString().replace('.', ',') },
              ].map((row) => (
                <div key={row.label} className="border border-gray-200 dark:border-white/10 rounded-sm p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{row.label}</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl text-gray-400 line-through">{row.before}</span>
                    <ArrowRight size={18} className="text-gray-400 shrink-0" />
                    <span style={{ color: brandColors.primary }} className="text-4xl font-bold">{row.after}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-6 text-puka-black dark:text-white">
              Posiciones actuales en b&uacute;squedas con intenci&oacute;n de compra
            </h3>
            <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-sm">
              <table className="w-full min-w-[420px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500">B&uacute;squeda en Google</th>
                    <th className="py-3 px-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Posici&oacute;n</th>
                  </tr>
                </thead>
                <tbody>
                  {RANKINGS.map((r) => (
                    <tr key={r.query} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                      <td className="py-3 px-5 text-gray-700 dark:text-gray-300">&laquo;{r.query}&raquo;</td>
                      <td className="py-3 px-5 text-right font-bold tabular-nums" style={{ color: brandColors.primary }}>
                        {r.position.toString().replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativa con la competencia local */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-puka-black dark:text-white">
              C&oacute;mo se ve frente a su competencia
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
              Rese&ntilde;as en Google Maps de las consultas de podolog&iacute;a que compiten en la
              misma zona de Quito. Puedes comprobarlo buscando &laquo;pod&oacute;logo quito norte&raquo;.
            </p>

            <div className="flex flex-col gap-3">
              {COMPETITORS.map((c, i) => {
                const isPuka = i === 0;
                const width = Math.max((c.count / COMPETITORS[0].count) * 100, 2);
                return (
                  <div key={c.name} className="flex items-center gap-4">
                    <span className={`w-52 shrink-0 text-sm ${isPuka ? 'font-bold text-puka-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {c.name}
                    </span>
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-white/5 rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${width}%`,
                          backgroundColor: isPuka ? brandColors.primary : '#cbd5d5',
                        }}
                      />
                    </div>
                    <span className="w-28 shrink-0 text-sm text-right tabular-nums text-gray-600 dark:text-gray-400">
                      {c.count} rese&ntilde;as
                      {c.rating !== null && <span className="ml-1">&middot; {c.rating.toFixed(1).replace('.', ',')}&#9733;</span>}
                    </span>
                  </div>
                );
              })}
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
                  Busca &laquo;podóloga quito norte&raquo; y encuéntrala
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

      {/* CTA Final Optimizado */}
      <section style={{ backgroundColor: brandColors.primary }} className="py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-8">
            ¿Quieres los mismos números?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
            Si Cristina pudo pasar de 20 pacientes a 4 diarios en 90 días, tú también puedes.
            No dejes que tu negocio siga siendo invisible.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              onClick={() => handleWhatsAppClick('caso_cristina_footer_primary', 'Hola Luis, vi el caso de Cristina y quiero conversar sobre la presencia digital de mi negocio.')}
              className="bg-puka-black text-white px-12 py-5 rounded-sm text-2xl font-bold hover:bg-gray-900 transition-all flex items-center gap-3 shadow-2xl transform hover:scale-105"
            >
              <WhatsAppIcon size={32} className="text-[#25D366]" />
              Quiero resultados como Cristina
            </button>
            <button
              onClick={() => handleWhatsAppClick('caso_cristina_footer_secondary', 'Hola Luis, verifiqué los resultados de PodoclinicEC, ¿crees que calificaría yo para el programa?')}
              className="bg-white/20 hover:bg-white/30 text-white px-12 py-5 rounded-sm text-2xl font-bold transition-all border border-white/30 backdrop-blur-sm"
            >
              ¿Yo calificaría?
            </button>
          </div>
          <p className="text-sm mt-8 font-bold uppercase tracking-widest opacity-80 flex items-center justify-center gap-2">
            <TrendingUp size={16} /> Cifras verificadas al 28 de agosto de 2026
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
                href="/casos/healppypets-carla-tutistar"
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
                href="/casos/hotel-eudiq-cafeteria-viviantes"
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

      {/* STICKY WHATSAPP BAR (MOBILE) */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-50 md:hidden flex justify-center">
        <button
          onClick={() => handleWhatsAppClick('sticky_cristina_bar', 'Hola Luis, vi caso Cristina (podología): quiero resultados como los de ella.')}
          className="bg-[#25D366] text-white w-full py-3 rounded-full font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
        >
          <WhatsAppIcon size={24} />
          WA: Podología como Cristina
        </button>
      </div>

    </div>
  );
};

export default CasoCristina;
