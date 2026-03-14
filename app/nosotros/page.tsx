'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  Calendar,
  Heart,
  Target,
  Compass,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function NosotrosPage() {
  const { t } = useTranslation();

  const c = {
    pageTitle: "Nuestra Historia",
    subtitle: "Por qué existe Puka Digital",
    storyParts: [
      "Tenía 10 años. Cementerio de San Diego, Quito.",
      "Vi a un anciano arrastrando una lápida de piedra casi de su tamaño bajo el sol.",
      "Me agarré a mi mamá, llorando.",
      "Esa imagen nunca se fue."
    ],
    transition: "Años después, viajando por Latinoamérica, vi la misma injusticia en digital:",
    injustices: [
      "Pequeños negocios atrapados en contratos eternos.",
      "Pagando por algo que nunca entenderían.",
      "Dependiendo de \"expertos\" que los mantenían dependientes."
    ],
    brazilQuote: "\"Los servicios digitales son inalcanzables para nosotros.\"",
    brazilContext: "En Brasil, una emprendedora me confesó:",
    birthMoment: "Esa noche, a las 3 AM, compré el dominio.",
    birth: "Puka Digital nació antes del amanecer.",
    notFor: "No para vender más servicios.",
    butFor: "Para terminar con el modelo extractivo.",
    manifesto: [
      "No construimos websites.",
      "Construimos independencia.",
      "Y te graduamos para que ya no nos necesites."
    ],
    finalWord: "Eso es dignidad digital.",
    
    // Founder section
    founderTitle: "El Fundador",
    founderName: "Luis Omar Viteri Sarango",
    founderRole: "Fundador & Autodidacta Digital",
    founderBio: "Autodidacta con 3 años de experiencia en transformación digital para pymes. Fundé PukaDigital para ayudar a los negocios pequeños a competir en el mundo digital sin depender de agencias costosas. Siempre aprendiendo, siempre mejorando.",
    
    // Mission, Vision, Values
    missionTitle: "Misión",
    missionText: "Democratizar el acceso a herramientas digitales de calidad para pequeños negocios en Ecuador y Latinoamérica, educándolos para lograr independencia tecnológica.",
    
    visionTitle: "Visión",
    visionText: "Un ecosistema donde cada pyme pueda competir digitalmente sin importar su tamaño o presupuesto, con dueños empoderados que controlan su propia tecnología.",
    
    valuesTitle: "Valores",
    values: [
      { icon: Heart, title: "Dignidad", text: "Tratamos a cada cliente como socio, no como dependiente." },
      { icon: Target, title: "Transparencia", text: "Precios claros, sin contratos ocultos, sin sorpresas." },
      { icon: Compass, title: "Educación", text: "No hacemos por ti, te enseñamos a hacerlo." },
      { icon: Users, title: "Accesibilidad", text: "$20/mes por herramienta. Punto." }
    ],
    
    // Timeline
    timelineTitle: "Nuestra Historia",
    timeline: [
      { date: "2 Agosto 2025", event: "Fundación de Puka Digital", description: "A las 3 AM, después de una conversación con una emprendedora en Brasil." },
      { date: "Agosto 2025", event: "Primeros clientes", description: "Cristina (podología), Carla (veterinaria), Hotel Eudiq." },
      { date: "Presente", event: "Creciendo", description: "Cada día más negocios logran su independencia digital." }
    ],
    
    // CTA
    ctaTitle: "¿Listo para tu independencia digital?",
    ctaButton: "Agenda tu entrevista gratuita",
    
    // Contact info
    location: "Quito, Carcelén, Ecuador",
    founded: "Fundado: 2 de Agosto, 2025"
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs 
            items={[
              { name: 'Inicio', url: '/' },
              { name: c.pageTitle, url: '/nosotros' }
            ]}
          />
        </div>
      </div>

      {/* Hero - The Story */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-puka-red blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-puka-red blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Subtitle */}
            <p className="text-puka-red font-medium text-sm uppercase tracking-widest mb-4 text-center">
              {c.subtitle}
            </p>
            
            {/* Main Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12">
              {c.pageTitle}
            </h1>
            
            {/* The Story - Poetic formatting */}
            <div className="space-y-8 text-lg md:text-xl leading-relaxed">
              {/* Opening scene */}
              <div className="space-y-2 text-gray-300">
                {c.storyParts.map((part, i) => (
                  <p key={i} className={i === c.storyParts.length - 1 ? "text-white font-medium italic" : ""}>
                    {part}
                  </p>
                ))}
              </div>
              
              {/* Transition */}
              <p className="text-gray-400 border-l-2 border-puka-red pl-4">
                {c.transition}
              </p>
              
              {/* Injustices list */}
              <div className="space-y-2 text-gray-300 pl-4">
                {c.injustices.map((injustice, i) => (
                  <p key={i}>{injustice}</p>
                ))}
              </div>
              
              {/* Brazil quote */}
              <div className="bg-gray-800/50 p-6 rounded-lg border-l-4 border-puka-red">
                <p className="text-sm text-gray-400 mb-2">{c.brazilContext}</p>
                <p className="text-xl md:text-2xl font-display text-white italic">
                  {c.brazilQuote}
                </p>
              </div>
              
              {/* Birth moment */}
              <div className="text-center space-y-2 py-4">
                <p className="text-gray-400">{c.birthMoment}</p>
                <p className="text-2xl md:text-3xl font-bold text-puka-red">
                  {c.birth}
                </p>
              </div>
              
              {/* Purpose */}
              <div className="text-center space-y-1 text-gray-300">
                <p>{c.notFor}</p>
                <p className="text-white font-medium">{c.butFor}</p>
              </div>
              
              {/* Manifesto */}
              <div className="text-center space-y-2 py-6">
                {c.manifesto.map((line, i) => (
                  <p key={i} className={`text-xl md:text-2xl ${i === 0 ? "text-gray-400" : i === 1 ? "text-white font-bold" : "text-puka-red font-medium"}`}>
                    {line}
                  </p>
                ))}
              </div>
              
              {/* Final word */}
              <p className="text-center text-2xl md:text-3xl font-display font-bold text-white pt-4 border-t border-gray-700">
                {c.finalWord}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-puka-red shadow-xl">
                  <Image
                    src="https://res.cloudinary.com/dltfsttr7/image/upload/v1759786002/LuisViteri_rwyq16.png"
                    alt={c.founderName}
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Decorative badge */}
                <div className="absolute -bottom-2 -right-2 bg-puka-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  <Sparkles size={16} className="inline mr-1" />
                  Autodidacta
                </div>
              </div>
              
              {/* Info */}
              <div className="text-center md:text-left">
                <p className="text-puka-red font-medium text-sm uppercase tracking-widest mb-2">
                  {c.founderTitle}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-puka-black dark:text-white mb-2">
                  {c.founderName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
                  {c.founderRole}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-lg">
                  {c.founderBio}
                </p>
                
                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <a 
                    href="https://www.linkedin.com/in/luisviteri/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
                  >
                    <Linkedin size={18} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/luchodev_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Instagram size={18} />
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                  <a 
                    href="mailto:luis.viteri@pukadigital.com"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Mail size={18} />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
                
                {/* Location & Founded */}
                <div className="flex items-center justify-center md:justify-start gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{c.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{c.founded}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Mission */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-puka-red/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-puka-red" />
                </div>
                <h3 className="font-display text-2xl font-bold text-puka-black dark:text-white mb-4">
                  {c.missionTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {c.missionText}
                </p>
              </div>
              
              {/* Vision */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-puka-red/10 rounded-lg flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-puka-red" />
                </div>
                <h3 className="font-display text-2xl font-bold text-puka-black dark:text-white mb-4">
                  {c.visionTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {c.visionText}
                </p>
              </div>
            </div>
            
            {/* Values */}
            <div>
              <h3 className="font-display text-3xl font-bold text-center text-puka-black dark:text-white mb-12">
                {c.valuesTitle}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {c.values.map((value, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:border-puka-red transition-colors group">
                    <div className="w-14 h-14 bg-puka-red/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-puka-red transition-colors">
                      <value.icon className="w-7 h-7 text-puka-red group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-display text-lg font-bold text-puka-black dark:text-white mb-2">
                       {value.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {value.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-3xl font-bold text-center text-puka-black dark:text-white mb-12">
              {c.timelineTitle}
            </h3>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform md:-translate-x-1/2" />
              
              {/* Timeline items */}
              <div className="space-y-8">
                {c.timeline.map((item, i) => (
                  <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-puka-red rounded-full transform -translate-x-1/2 mt-2 z-10 ring-4 ring-white dark:ring-gray-900" />
                    
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <span className="text-puka-red font-bold text-sm">{item.date}</span>
                      <h4 className="font-display text-xl font-bold text-puka-black dark:text-white mt-1">
                        {item.event}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-puka-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
            {c.ctaTitle}
          </h2>
          <Link 
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-puka-red font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            {c.ctaButton}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
