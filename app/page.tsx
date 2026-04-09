'use client';

import React, { useState } from 'react';
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
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

const glass = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    borderTop: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '20px',
  },
  cardHover: {
    background: 'rgba(255,255,255,0.09)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40)',
  },
  cardLarge: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderLeft: '1px solid rgba(255,255,255,0.10)',
    borderRight: '1px solid rgba(255,255,255,0.10)',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    borderTop: '1px solid rgba(255,255,255,0.20)',
    borderRadius: '24px',
  },
  cardLargeHover: {
    background: 'rgba(255,255,255,0.10)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.50)',
    borderLeft: '1px solid rgba(199,23,30,0.50)',
    borderRight: '1px solid rgba(199,23,30,0.50)',
    borderBottom: '1px solid rgba(199,23,30,0.50)',
    borderTop: '1px solid rgba(199,23,30,0.50)',
  },
  panel: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
  },
  header: {
    background: 'rgba(8,8,8,0.70)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  badge: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.20)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  btnCotizar: {
    background: 'rgba(199,23,30,0.15)',
    border: '1px solid rgba(199,23,30,0.40)',
  },
  iconContainer: {
    background: 'rgba(255,255,255,0.08)',
  },
  footer: {
    background: 'rgba(0,0,0,0.60)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
};

const HomePage = () => {
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

  const [hoveredMethod, setHoveredMethod] = useState<number | null>(null);
  const [hoveredSolution, setHoveredSolution] = useState<'emprendedor' | 'empresa' | null>(null);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://pukadigital.com/#howto-ingenieria-inversa",
    "name": "Ingeniería Inversa de Ventas: Proceso de PukaDigital",
    "description": "Metodología de 3 pasos para crear sitios web que venden, basada en datos reales de búsqueda antes de escribir una línea de código.",
    "inLanguage": "es-EC",
    "totalTime": "P30D",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Minería de Datos (Keywords)",
        "text": "Investigamos qué busca tu cliente real en Google: volumen de búsqueda, intención de compra y costo por clic (CPC). No diseñamos nada sin datos previos que garanticen tráfico calificado."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Arquitectura Web (Relevancia)",
        "text": "Creamos la estructura de páginas y el copy del sitio para coincidir exactamente con esas búsquedas. Google premia la relevancia con mejores posiciones orgánicas y menores costos en Ads."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Tráfico de Precisión (Google Ads)",
        "text": "Lanzamos campañas de Google Ads con Quality Score 10/10. Al tener una web alineada con los anuncios, reducimos el costo por clic a la mitad y duplicamos las conversiones."
      }
    ]
  };

  return (
    <div className="font-sans selection:bg-puka-red/20 selection:text-puka-red" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#080808', color: 'white', position: 'relative' }}>
      {/* Orbes de fondo — position fixed para que no scrolleen */}
      <div aria-hidden="true" style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(199,23,30,0.22)', filter: 'blur(130px)', borderRadius: '50%', bottom: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: 'fixed', width: '600px', height: '600px', background: 'rgba(30,60,199,0.12)', filter: 'blur(150px)', borderRadius: '50%', top: '-200px', right: '-200px', pointerEvents: 'none', zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: 'fixed', width: '350px', height: '350px', background: 'rgba(120,20,180,0.10)', filter: 'blur(110px)', borderRadius: '50%', top: '40vh', left: '30%', pointerEvents: 'none', zIndex: 0 }} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
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
          "inLanguage": "es-EC",
          "isPartOf": { "@id": "https://pukadigital.com/#website" },
          "about": { "@id": "https://pukadigital.com/#organization" }
        }}
      />

      {/* HEADER GLASS */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300" style={glass.header}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
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
            className="hidden md:inline-flex text-white px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(199,23,30,0.35)]"
            style={glass.btnCotizar}
            target="_blank"
          >
            Cotizar Ahora
          </Link>
        </div>
      </header>

      {/* 1. HERO SECTION (SEO LITERAL) */}
      <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden" style={{ zIndex: 1 }}>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ ...glass.badge, color: 'rgba(255,255,255,0.60)' }}
          >
            SEO &amp; Performance en Quito, Guayaquil y Cuenca
          </div>

          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-8 tracking-tight" style={{ color: 'white' }}>
            Agencia de Marketing Digital y <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-puka-red to-red-600">Dise&ntilde;o de P&aacute;ginas Web</span> en Ecuador
          </h1>

          <h2 className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
            No adivines. Construimos sitios web basados en <strong style={{ color: 'white' }}>Investigaci&oacute;n de Palabras Clave</strong> y <strong style={{ color: 'white' }}>Google Ads</strong>. Ingenier&iacute;a de relevancia para vender m&aacute;s, no solo para verse bien.
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={scrollToMethod}
              className="bg-puka-red text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ boxShadow: '0 0 32px rgba(199,23,30,0.45)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 48px rgba(199,23,30,0.65)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(199,23,30,0.45)'; }}
            >
              Ver nuestro M&eacute;todo de 3 Pasos
            </button>
            <Link
              href={`https://wa.me/593964065880?text=Hola,%20quisiera%20cotizar%20un%20proyecto.`}
              target="_blank"
              className="text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:bg-white/10"
              style={glass.btnSecondary}
            >
              Cotizar Proyecto Web
            </Link>
          </div>
        </div>

        {/* Rejilla decorativa sobre oscuro */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" style={{ zIndex: 0 }} />
      </section>

      {/* 2. EL PROBLEMA (Why websites fail) */}
      <section className="py-20 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center p-12 md:p-16" style={glass.panel}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full" style={{ background: 'rgba(199,23,30,0.15)' }}>
                <AlertTriangle size={40} strokeWidth={1.5} style={{ color: 'rgba(199,23,30,0.90)' }} />
              </div>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6" style={{ color: 'white' }}>
              &iquest;Por qu&eacute; la mayor&iacute;a de sitios web fracasan?
            </h2>
            <p className="text-xl leading-relaxed font-serif italic text-pretty" style={{ color: 'rgba(255,255,255,0.65)' }}>
              &ldquo;Porque se dise&ntilde;an primero y se intenta vender despu&eacute;s. <br className="hidden md:block" />
              Es como construir una llave sin saber c&oacute;mo es la cerradura.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 3. TU METODOLOGÍA (Ingeniería Inversa) */}
      <section id="metodo" className="py-24 relative overflow-hidden" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-puka-red font-bold text-sm tracking-widest uppercase mb-2 block">Diferenciador T&eacute;cnico</span>
            <h2 className="font-display font-black text-4xl md:text-5xl" style={{ color: 'white' }}>
              Nuestro Proceso: <span className="underline decoration-puka-red/40 decoration-4 underline-offset-4">Ingenier&iacute;a Inversa de Ventas</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div
              className="group p-8 relative cursor-default transition-all duration-300"
              style={{ ...glass.card, ...(hoveredMethod === 1 ? glass.cardHover : {}) }}
              onMouseEnter={() => setHoveredMethod(1)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-[20px] transition-colors duration-300"
                style={{ background: hoveredMethod === 1 ? '#C7171E' : 'rgba(255,255,255,0.08)' }}
              />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 font-bold text-xl transition-transform duration-300 group-hover:scale-110"
                style={{ ...glass.iconContainer, color: 'rgba(255,255,255,0.80)' }}
              >
                <Search size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                1. Miner&iacute;a de Datos{' '}
                <span className="text-xs py-1 px-2 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }}>Keywords</span>
              </h3>
              <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                No dise&ntilde;amos nada sin datos. Primero investigamos qu&eacute; busca tu cliente real en Google (Volumen y CPC) para garantizar tr&aacute;fico antes de escribir una l&iacute;nea de c&oacute;digo.
              </p>
            </div>

            {/* Paso 2 */}
            <div
              className="group p-8 relative cursor-default transition-all duration-300"
              style={{ ...glass.card, ...(hoveredMethod === 2 ? glass.cardHover : {}) }}
              onMouseEnter={() => setHoveredMethod(2)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-[20px] transition-colors duration-300"
                style={{ background: hoveredMethod === 2 ? '#C7171E' : 'rgba(255,255,255,0.08)' }}
              />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 font-bold text-xl transition-transform duration-300 group-hover:scale-110"
                style={{ ...glass.iconContainer, color: 'rgba(255,255,255,0.80)' }}
              >
                <Layout size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                2. Arquitectura Web{' '}
                <span className="text-xs py-1 px-2 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }}>Relevancia</span>
              </h3>
              <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Creamos la estructura y el copy del sitio para coincidir <strong style={{ color: 'white' }}>exactamente</strong> con esas b&uacute;squedas. Google premia la relevancia con mejores posiciones y costos m&aacute;s bajos.
              </p>
            </div>

            {/* Paso 3 */}
            <div
              className="group p-8 relative cursor-default transition-all duration-300"
              style={{ ...glass.card, ...(hoveredMethod === 3 ? glass.cardHover : {}) }}
              onMouseEnter={() => setHoveredMethod(3)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-[20px] transition-colors duration-300"
                style={{ background: hoveredMethod === 3 ? '#C7171E' : 'rgba(255,255,255,0.08)' }}
              />
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 font-bold text-xl transition-transform duration-300 group-hover:scale-110"
                style={{ ...glass.iconContainer, color: 'rgba(255,255,255,0.80)' }}
              >
                <Target size={28} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: 'white' }}>
                3. Tr&aacute;fico de Precisi&oacute;n{' '}
                <span className="text-xs py-1 px-2 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)' }}>Ads</span>
              </h3>
              <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Lanzamos campa&ntilde;as con <strong style={{ color: 'white' }}>Quality Score 10/10</strong>. Al tener una web alineada con los anuncios, reducimos tu costo por clic a la mitad y duplicamos conversiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DE SERVICIOS (Traffic Controller Secundario) */}
      <section className="py-24 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <h2 className="font-display font-bold text-3xl text-center mb-16" style={{ color: 'white' }}>
            Soluciones Especializadas para tu Etapa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Emprendedor */}
            <Link
              href="/sistema"
              onClick={() => handleNavigation('sistema')}
              className="group p-10 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                ...glass.cardLarge,
                ...(hoveredSolution === 'emprendedor' ? glass.cardLargeHover : {}),
              }}
              onMouseEnter={() => setHoveredSolution('emprendedor')}
              onMouseLeave={() => setHoveredSolution(null)}
            >
              <div className="absolute top-0 right-0 p-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.06)' }}>
                <Rocket size={120} />
              </div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg transition-all duration-300"
                style={{ ...glass.iconContainer, color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <Rocket size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>Soy Emprendedor</h3>
              <p className="mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Quiero mi propio sistema de ventas, web y facturaci&oacute;n. Busco independencia sin pagar rentas mensuales.
              </p>
              <span className="text-puka-red font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Ver Programa de Independencia <ArrowRight size={20} />
              </span>
            </Link>

            {/* Card Empresa */}
            <Link
              href="/agencia"
              onClick={() => handleNavigation('agencia')}
              className="group p-10 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                ...glass.cardLarge,
                ...(hoveredSolution === 'empresa' ? glass.cardLargeHover : {}),
              }}
              onMouseEnter={() => setHoveredSolution('empresa')}
              onMouseLeave={() => setHoveredSolution(null)}
            >
              <div className="absolute top-0 right-0 p-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.06)' }}>
                <Building2 size={120} />
              </div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg transition-all duration-300"
                style={{ ...glass.iconContainer, color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'white' }}>Soy una Empresa</h3>
              <p className="mb-8 leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Busco consultor&iacute;a estrat&eacute;gica, infraestructura corporativa y optimizaci&oacute;n avanzada de Google Ads.
              </p>
              <span className="text-puka-red font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Ir a Servicios Corporativos <ArrowRight size={20} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center relative" style={{ ...glass.footer, zIndex: 1 }}>
        <div className="container mx-auto px-4">
          <p className="mb-4 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>
            &copy; {new Date().getFullYear()} PukaDigital. Ingenier&iacute;a de Marketing.
          </p>
          <div className="flex justify-center gap-6 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.40)' }}>
            <Link href="/legal/politica-de-privacidad" className="hover:text-puka-red transition-colors">Privacidad</Link>
            <Link href="/legal/terminos" className="hover:text-puka-red transition-colors">T&eacute;rminos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
