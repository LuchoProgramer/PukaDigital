'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Rocket,
  ArrowRight,
  Search,
  Layout,
  Target,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

const HomePage = () => {
  const { language } = useTranslation();
  const lang = language || 'es';

  const handleNavigation = (destination: string) => {
    ga.event({
      action: 'select_path',
      category: 'Home Navigation',
      label: destination,
    });
  };

  const scrollToMethod = () => {
    document.getElementById('metodo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 selection:bg-puka-red/20 selection:text-puka-red">
      <SEO
        title="Agencia de Marketing Digital y Diseño Web Ecuador | PukaDigital"
        description="Especialistas en Diseño Web estratégico y Google Ads. Creamos sitios web optimizados desde la investigación de palabras clave. Cotiza tu proyecto hoy."
        keywords="agencia marketing digital ecuador, diseño paginas web ecuador, seo ecuador, google ads quito, desarrollo web nextjs"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://pukadigital.com/#webpage",
          "url": "https://pukadigital.com",
          "name": "Agencia de Marketing Digital y Diseño Web Ecuador | PukaDigital",
          "description": "Especialistas en Diseño Web estratégico y Google Ads. Creamos sitios web optimizados desde la investigación de palabras clave.",
          "inLanguage": lang === 'es' ? 'es-EC' : lang === 'en' ? 'en-US' : 'pt-BR',
          "isPartOf": { "@id": "https://pukadigital.com/#website" },
          "about": { "@id": "https://pukadigital.com/#organization" }
        }}
      />

      {/* HEADER SIMPLE */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/pegaso-rojo.svg"
                fill
                className="object-contain"
                alt="Pegaso Puka Digital"
                priority
              />
            </div>
            <div className="relative h-8 w-36">
              <Image
                src="/logo-Puka.svg"
                fill
                className="object-contain object-left"
                alt="Puka Digital Logo"
                priority
              />
            </div>
          </Link>
          <Link
            href={`https://wa.me/593964065880?text=Hola,%20me%20interesa%20un%20proyecto%20web.`}
            className="hidden md:inline-flex bg-black text-white px-5 py-2 rounded-sm font-bold text-sm hover:bg-puka-red transition-colors"
            target="_blank"
          >
            Cotizar Ahora
          </Link>
        </div>
      </header>

      {/* 1. HERO SECTION (SEO LITERAL) */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-gray-200">
            SEO & Performance en Quito, Guayaquil y Cuenca
          </div>

          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-8 text-gray-900 tracking-tight">
            Agencia de Marketing Digital y <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-puka-red to-red-600">Diseño de Páginas Web</span> en Ecuador
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            No adivines. Construimos sitios web basados en <strong>Investigación de Palabras Clave</strong> y <strong>Google Ads</strong>. Ingeniería de relevancia para vender más, no solo para verse bien.
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={scrollToMethod}
              className="bg-puka-red text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-black transition-all shadow-xl shadow-puka-red/20 transform hover:-translate-y-1"
            >
              Ver nuestro Método de 3 Pasos
            </button>
            <Link
              href={`https://wa.me/593964065880?text=Hola,%20quisiera%20cotizar%20un%20proyecto.`}
              target="_blank"
              className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Cotizar Proyecto Web
            </Link>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>
      </section>

      {/* 2. EL PROBLEMA (Why websites fail) */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600">
              <AlertTriangle size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6 text-gray-900">
            ¿Por qué la mayoría de sitios web fracasan?
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed font-serif italic text-pretty">
            "Porque se diseñan primero y se intenta vender después. <br className="hidden md:block" />
            Es como construir una llave sin saber cómo es la cerradura."
          </p>
        </div>
      </section>

      {/* 3. TU METODOLOGÍA (Ingeniería Inversa) */}
      <section id="metodo" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-puka-red font-bold text-sm tracking-widest uppercase mb-2 block">Diferenciador Técnico</span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900">
              Nuestro Proceso: <span className="underline decoration-puka-red/30 decoration-4 underline-offset-4">Ingeniería Inversa de Ventas</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-puka-red/30 hover:shadow-xl transition-all duration-300 bg-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-puka-red transition-colors rounded-t-2xl"></div>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
                <Search size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                1. Minería de Datos <span className="text-xs bg-gray-100 text-gray-500 py-1 px-2 rounded">Keywords</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No diseñamos nada sin datos. Primero investigamos qué busca tu cliente real en Google (Volumen y CPC) para garantizar tráfico antes de escribir una línea de código.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-puka-red/30 hover:shadow-xl transition-all duration-300 bg-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-puka-red transition-colors rounded-t-2xl"></div>
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
                <Layout size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                2. Arquitectura Web <span className="text-xs bg-gray-100 text-gray-500 py-1 px-2 rounded">Relevancia</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Creamos la estructura y el copy del sitio para coincidir <strong>exactamente</strong> con esas búsquedas. Google premia la relevancia con mejores posiciones y costos más bajos.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="group p-8 rounded-2xl border border-gray-100 hover:border-puka-red/30 hover:shadow-xl transition-all duration-300 bg-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-puka-red transition-colors rounded-t-2xl"></div>
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
                <Target size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                3. Tráfico de Precisión <span className="text-xs bg-gray-100 text-gray-500 py-1 px-2 rounded">Ads</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lanzamos campañas con <strong>Quality Score 10/10</strong>. Al tener una web alineada con los anuncios, reducimos tu costo por clic a la mitad y duplicamos conversiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE SERVICIOS (Traffic Controller Secundario) */}
      <section className="py-24 bg-gray-900 text-white relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <h2 className="font-display font-bold text-3xl text-center mb-16">
            Soluciones Especializadas para tu Etapa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Emprendedor */}
            <Link
              href={`/${lang}/sistema`}
              onClick={() => handleNavigation('sistema')}
              className="group bg-gray-800 p-10 rounded-3xl border border-gray-700 hover:bg-gray-700/50 hover:border-puka-red transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Rocket size={120} />
              </div>
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white mb-6 shadow-lg border border-gray-600 group-hover:border-puka-red transition-colors">
                <Rocket size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Soy Emprendedor</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Quiero mi propio sistema de ventas, web y facturación. Busco independencia sin pagar rentas mensuales.
              </p>
              <span className="text-puka-red font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Ver Programa de Independencia <ArrowRight size={20} />
              </span>
            </Link>

            {/* Card Empresa */}
            <Link
              href={`/${lang}/agencia`}
              onClick={() => handleNavigation('agencia')}
              className="group bg-white text-gray-900 p-10 rounded-3xl border border-gray-200 hover:shadow-2xl hover:shadow-white/10 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 size={120} />
              </div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 mb-6 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Soy una Empresa</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                Busco consultoría estratégica, infraestructura corporativa y optimización avanzada de Google Ads.
              </p>
              <span className="text-blue-700 font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Ir a Servicios Corporativos <ArrowRight size={20} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-gray-50 text-center border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 mb-4 text-sm font-medium">© {new Date().getFullYear()} PukaDigital. Ingeniería de Marketing.</p>
          <div className="flex justify-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <Link href={`/${lang}/legal/politica-de-privacidad`} className="hover:text-puka-red transition-colors">Privacidad</Link>
            <Link href={`/${lang}/legal/terminos`} className="hover:text-puka-red transition-colors">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;