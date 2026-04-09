'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, Package, BookOpen, PlayCircle, Trophy, MessageCircle } from 'lucide-react';
import * as ga from '@/lib/analytics';

const mobileGlass = {
  bar: {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
  },
};

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getPageContext = () => {
    if (pathname?.includes('/salud')) {
      return { type: 'conversion', color: 'bg-green-600', label: 'Pacientes Calificados', cta: 'Llenar Agenda', link: `https://wa.me/593964065880?text=Hola,%20soy%20médico%20y%20me%20interesa%20llenar%20mi%20agenda.`, trackArgs: 'salud_sticky_mobile' };
    }
    if (pathname?.includes('/inventario')) {
      return { type: 'conversion', color: 'bg-cyan-600', label: 'Beta Fundadores (-50%)', cta: 'Pedir Acceso', link: `https://wa.me/593964065880?text=Me%20interesa%20la%20Beta%20de%20Inventario.`, trackArgs: 'inventario_sticky_mobile' };
    }
    if (pathname?.includes('/chatbot')) {
      return { type: 'conversion', color: 'bg-purple-600', label: 'IA 24/7 sin Mensualidad', cta: 'Ver Demo', link: `https://wa.me/593964065880?text=Hola,%20quiero%20ver%20la%20demo%20del%20Chatbot%20IA.`, trackArgs: 'chatbot_sticky_mobile' };
    }
    return { type: 'navigation' };
  };

  const context = getPageContext();

  // CASO A: sticky ACTION BAR (Conversión)
  if (context.type === 'conversion' && context.color) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 pb-safe" style={mobileGlass.bar}>
        <div className="flex justify-between items-center h-16 px-4 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#9CA3AF' }}>Oferta Especial</span>
            <span className="text-sm font-black leading-tight" style={{ color: '#111827' }}>{context.label}</span>
          </div>
          <a
            href={context.link}
            target="_blank"
            onClick={() => ga.trackWhatsAppDirectoClick(context.trackArgs || 'sticky_mobile')}
            className={`${context.color} text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap`}
          >
            {context.cta} <MessageCircle size={16} fill="currentColor" />
          </a>
        </div>
      </div>
    );
  }

  // CASO B: MENÚ DE NAVEGACIÓN
  const navItems = [
    { label: 'Inicio', path: `/`, icon: Home },
    { label: 'Soluciones', path: `/sistema`, icon: Package },
    { label: 'Empezar', path: `/contacto`, icon: Home, isPrimary: true },
    { label: 'Blog', path: `/blog`, icon: BookOpen },
    { label: 'Casos', path: `/casos`, icon: Trophy }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 pb-safe" style={mobileGlass.bar}>
      <div className="flex justify-around items-end h-16 pb-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isPrimary) {
            return (
              <Link key={item.path} href={item.path} className="relative -top-5 group">
                <div className="bg-puka-red text-white p-4 rounded-full shadow-lg shadow-puka-red/30 transform transition-transform group-active:scale-95 border-4 border-white">
                  <div className="relative w-6 h-6">
                    <Image
                      src="/pegaso-rojo.svg"
                      fill
                      className="object-contain invert brightness-0 contrast-200"
                      alt="Pegaso"
                    />
                  </div>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-puka-red whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center w-16 py-1 transition-colors duration-200"
              style={{ color: active ? '#111827' : 'rgba(0,0,0,0.35)' }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={`mb-1 transition-transform ${active ? '-translate-y-0.5' : ''}`}
              />
              <span className={`text-[10px] font-medium leading-none text-center ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
