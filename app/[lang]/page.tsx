'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Rocket, ArrowRight, Shield, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SEO from '@/components/SEO';
import * as ga from '@/lib/analytics';

const HomePage = () => {
  const { language } = useTranslation();
  const lang = language || 'es';

  const handleNavigation = (destination: string) => {
    ga.event({
      action: 'select_path',
      category: 'Home Gate',
      label: destination,
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SEO
        title="PukaDigital: Ecosistema de Tecnología y Marketing en Ecuador"
        description="Agencia de Marketing Digital y Sistema de Ventas SaaS. Elige tu camino: Servicios Corporativos o Independencia para Emprendedores."
        keywords="puka digital, agencia marketing quito, sistema ventas ecuador, desarrollo web, google ads"
      />

      {/* HEADER COMPARTIDO */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-center items-center pointer-events-none">
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg pointer-events-auto border border-gray-200 dark:border-gray-800">
          <Link href={`/${lang}`} className="font-display font-black text-xl tracking-tighter">
            <span className="text-gray-900 dark:text-white">PUKA</span>
            <span className="text-puka-red">DIGITAL</span>
          </Link>
        </div>
      </header>

      {/* CONTENEDOR SPLIT SCREEN */}
      <main className="flex-1 flex flex-col lg:flex-row">

        {/* LADO IZQUIERDO: AGENCIA (Empresas) */}
        <section className="relative flex-1 bg-white hover:bg-gray-50 transition-colors duration-500 flex flex-col justify-center items-center text-center p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-100 group">
          <div className="max-w-md space-y-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
              <Building2 size={40} />
            </div>

            <h2 className="font-display font-bold text-4xl text-gray-900 tracking-tight">Soy una Empresa</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Busco infraestructura web propia, SEO técnico y campañas de Google Ads de alto rendimiento.
            </p>

            <div className="pt-4">
              <Link
                href={`/${lang}/agencia`}
                onClick={() => handleNavigation('agencia')}
                className="inline-flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-900 px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-900 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-gray-200"
              >
                Ir a Servicios Corporativos <ArrowRight size={20} />
              </Link>
            </div>

            <p className="text-xs text-gray-400 font-mono pt-4 uppercase tracking-widest">
              Para Gerentes & Directores
            </p>
          </div>
        </section>

        {/* LADO DERECHO: SISTEMA (Emprendedores) */}
        <section className="relative flex-1 bg-[#050505] text-white flex flex-col justify-center items-center text-center p-12 lg:p-24 overflow-hidden group">

          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-puka-red/5 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10 max-w-md space-y-8 animate-fade-in-up delay-100">
            <div className="w-20 h-20 bg-gray-900 text-puka-red rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-puka-red/10 border border-gray-800">
              <Rocket size={40} />
            </div>

            <h2 className="font-display font-bold text-4xl text-white tracking-tight">Soy Emprendedor</h2>
            <p className="text-lg text-gray-400 leading-relaxed font-medium">
              Quiero mi propio sistema de ventas, web y facturación <span className="text-puka-red italic">sin pagar rentas mensuales</span>.
            </p>

            <div className="pt-4">
              <Link
                href={`/${lang}/sistema`}
                onClick={() => handleNavigation('sistema')}
                className="inline-flex items-center gap-2 bg-puka-red text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-red-600 transition-all transform hover:-translate-y-1 shadow-2xl shadow-puka-red/20 border border-transparent"
              >
                Ver Programa Beta <ArrowRight size={20} />
              </Link>
            </div>

            <p className="text-xs text-gray-600 font-mono pt-4 uppercase tracking-widest group-hover:text-puka-red/50 transition-colors">
              Para Fundadores & Dueños
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER MINIMALISTA */}
      <footer className="absolute bottom-0 w-full py-6 px-4 z-40 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest pointer-events-auto">
          <span className="hidden md:inline text-gray-300">|</span>
          <Link href={`/${lang}/legal/politica-de-privacidad`} className="hover:text-gray-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            Privacidad
          </Link>
          <a href="https://wa.me/593964065880" target="_blank" rel="noopener noreferrer" className="hover:text-puka-red transition-colors flex items-center gap-1 bg-white/50 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <MessageCircle size={12} /> Soporte
          </a>
        </div>
      </footer>

      {/* ESTILOS GLOBALES PARA ANIMACIONES */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;