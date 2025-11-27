'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Clock, Rocket, ExternalLink, Search, Star } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';
import type { SupportedLocale } from '@/lib/schema';

// Datos de los casos (después podemos moverlo a un archivo separado)
const cases = [
  {
    slug: 'podoclinicec-cristina-munoz',
    clientName: 'Yadira Cristina Muñoz',
    business: 'PodoclinicEC',
    industry: 'Podología',
    city: 'Quito Norte',
    status: 'graduating', // 'completed' | 'in-progress' | 'just-started'
    statusLabel: 'Graduándose 2 Dic 2025',
    statusEmoji: '✅',
    photo: 'https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg',
    website: 'https://podoclinicec.com',
    metrics: {
      conversionsAds: 33,
      conversionsOrganic: 20,
      reviewsBefore: 3,
      reviewsAfter: 15,
    },
    highlight: '53 conversiones/mes',
    testimonialQuote: 'Nunca había tenido presencia digital. Con Puka, en 3 meses pasé de 3 reseñas en Google a 15.',
  },
  {
    slug: 'healppypets-carla-tutistar',
    clientName: 'Carla Vanesa Tutistar',
    business: 'HealppyPets',
    industry: 'Veterinaria',
    city: 'Quito',
    status: 'in-progress',
    statusLabel: 'Mes 2 de 3',
    statusEmoji: '🟡',
    photo: null, // Usaremos emoji
    emoji: '🐕',
    website: 'https://healppypets.com',
    metrics: null, // En progreso
    highlight: 'Web + Chatbot + Google Business',
    currentPhase: 'Configurando campañas Google Ads',
  },
  {
    slug: 'hotel-eudiq-cafeteria-viviantes',
    clientName: 'Eudalia Jadán & Diego Quezada',
    business: 'Hotel Eudiq + Cafetería Viviantes',
    industry: 'Hotelería & Gastronomía',
    city: 'Loja',
    status: 'just-started',
    statusLabel: 'Semana 2',
    statusEmoji: '🟢',
    photo: null,
    emoji: '🏨',
    website: 'https://hoteleudiq.com',
    metrics: null,
    highlight: 'Sistema completo en construcción',
    currentPhase: 'Web SEO + Analytics + Blog',
  },
];

const CasosPage = () => {
  const { language } = useTranslation();
  const lang = (language || 'es') as SupportedLocale;
  
  const completedCases = cases.filter(c => c.status === 'graduating' || c.status === 'completed');
  const inProgressCases = cases.filter(c => c.status === 'in-progress');
  const justStartedCases = cases.filter(c => c.status === 'just-started');

  // Track case clicks
  const handleCaseClick = async (caseName: 'PodoclinicEC' | 'HealppyPets' | 'Hotel Eudiq', industry: 'healthcare' | 'veterinary' | 'hospitality') => {
    await ga.trackCasoExitoView(caseName, industry);
  };

  // Track external website clicks
  const handleWebsiteClick = (caseName: string, websiteUrl: string) => {
    ga.trackCasoLinkClick(caseName, websiteUrl, 'casos_page');
  };

  // Breadcrumbs
  const breadcrumbItems = [
    { name: lang === 'es' ? 'Inicio' : lang === 'en' ? 'Home' : 'Início', url: `https://pukadigital.com/${lang}` },
    { name: lang === 'es' ? 'Casos Reales' : lang === 'en' ? 'Case Studies' : 'Casos Reais', url: `https://pukadigital.com/${lang}/casos` }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Hero dramático */}
      <section className="py-20 text-center bg-gradient-to-b from-puka-black to-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs 
              items={breadcrumbItems} 
              className="justify-center text-gray-400 [&_a]:text-gray-400 [&_a:hover]:text-white"
            />
          </div>
          
          <span className="text-sm uppercase tracking-widest text-gray-400 font-medium">
            Transparencia Radical
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mt-4">
            Construyendo en Público
          </h1>
          <p className="text-xl md:text-2xl mt-6 text-gray-300 max-w-3xl mx-auto">
            No te mostramos "resultados increíbles" editados.<br />
            Te mostramos el proceso <span className="text-puka-red font-bold">REAL</span>. Errores incluidos.
          </p>
        </div>
      </section>

      {/* Métricas agregadas */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-puka-black dark:text-white">
            Estado Actual del Programa
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-puka-red">{cases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clientes Activos</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-green-600">{completedCases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Graduándose</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-yellow-600">{inProgressCases.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">En Progreso</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Cupos Disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Caso Principal - Cristina (Graduándose) */}
      {completedCases.map((caso) => (
        <section key={caso.slug} className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              
              {/* Badge de estado */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                  {caso.statusEmoji} {caso.statusLabel}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Foto y info */}
                <div className="text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <Image
                      src={caso.photo!}
                      alt={caso.clientName}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-puka-red object-cover"
                    />
                    <div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-puka-black dark:text-white">
                        {caso.clientName}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400">
                        {caso.business} • {caso.city}
                      </p>
                      <p className="text-puka-red font-medium">{caso.industry}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-lg italic text-gray-600 dark:text-gray-300 border-l-4 border-puka-red pl-4 my-6">
                    "{caso.testimonialQuote}"
                  </blockquote>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <Link 
                      href={`/es/casos/${caso.slug}`}
                      onClick={() => handleCaseClick(
                        caso.business as 'PodoclinicEC' | 'HealppyPets' | 'Hotel Eudiq',
                        caso.industry === 'Podología' ? 'healthcare' : caso.industry === 'Veterinaria' ? 'veterinary' : 'hospitality'
                      )}
                      className="bg-puka-red text-white px-6 py-3 rounded-sm font-bold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                    >
                      Ver caso completo <ArrowRight size={18} />
                    </Link>
                    <a 
                      href={caso.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleWebsiteClick(caso.business, caso.website)}
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-sm font-bold hover:border-puka-red hover:text-puka-red transition-colors inline-flex items-center gap-2"
                    >
                      Visitar web <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

                {/* Métricas */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-sm">
                  <h3 className="text-xl font-bold mb-6 text-puka-black dark:text-white text-center">
                    Resultados Verificables
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-puka-red">{caso.metrics?.conversionsAds}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Conversiones Google Ads</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-green-600">+{caso.metrics?.conversionsOrganic}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Conversiones Orgánicas</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-yellow-600">{caso.metrics?.reviewsBefore}→{caso.metrics?.reviewsAfter}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Reseñas Google</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-sm text-center shadow-sm">
                      <div className="text-3xl font-bold text-blue-600">5★</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Calificación Promedio</div>
                    </div>
                  </div>

                  {/* Verificación */}
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-sm">
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium text-center">
                      🔍 Verifica tú mismo: Busca "podóloga quito norte" en Google
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Casos en Progreso */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-puka-black dark:text-white">
              Casos en Progreso
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              Actualizamos su progreso cada semana. Transparencia total.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[...inProgressCases, ...justStartedCases].map((caso) => (
                <div 
                  key={caso.slug}
                  className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 ${
                      caso.status === 'in-progress' 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}>
                      {caso.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          caso.status === 'in-progress'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {caso.statusEmoji} {caso.statusLabel}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-puka-black dark:text-white">
                        {caso.clientName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {caso.business} • {caso.city}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Rocket size={18} className="text-puka-red" />
                      <span className="font-medium">{caso.highlight}</span>
                    </div>
                    
                    {caso.currentPhase && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock size={18} className="text-gray-400" />
                        <span>Ahora: {caso.currentPhase}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Link 
                      href={`/es/casos/${caso.slug}`}
                      className="text-puka-red font-bold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      Ver progreso <ArrowRight size={14} />
                    </Link>
                    <a 
                      href={caso.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 font-bold text-sm hover:text-puka-red inline-flex items-center gap-1"
                    >
                      {caso.website.replace('https://', '')} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-puka-red text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            ¿Quieres Ser el Siguiente Caso?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Estamos documentando cada paso de nuestros clientes.<br />
            Tu historia podría ser la próxima.
          </p>
          <Link 
            href="/es/contacto"
            className="bg-white text-puka-red px-12 py-5 rounded-sm text-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Aplicar al Programa <ArrowRight size={24} />
          </Link>
          <p className="text-sm mt-6 opacity-80">
            Solo 2 cupos disponibles este mes
          </p>
        </div>
      </section>

    </div>
  );
};

export default CasosPage;
