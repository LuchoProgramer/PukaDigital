'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, PlayCircle, Mail, ChevronRight, FileText, Shield, AlertCircle, Users, HelpCircle, DollarSign } from 'lucide-react';
import { allies } from '@/data/allies';

const Footer: React.FC = () => {
  const pathname = usePathname();

  const totalSlots = 5;
  const activeAlliesCount = allies.filter(a => a.status !== 'graduated').length;
  const availableSlots = Math.max(0, totalSlots - activeAlliesCount);

  const isCustomFooterPage = pathname === '/' ||
    pathname?.includes('/sistema') ||
    pathname?.includes('/salud') ||
    pathname?.includes('/inventario') ||
    pathname?.includes('/chatbot');

  if (isCustomFooterPage) {
    return null;
  }

  return (
    <footer
      className="py-16 md:py-20 transition-colors duration-300"
      style={{
        background: 'rgba(248,249,255,0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
      }}
    >
      <div className="container mx-auto px-4 md:px-6">

        {/* Slots Counter */}
        <div className="mb-16 text-center pb-16" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h4 className="font-display font-bold text-lg mb-4" style={{ color: '#6B7280' }}>
            Cupos Disponibles
          </h4>
          <div className="flex justify-center items-center gap-2 mb-3">
            {Array.from({ length: activeAlliesCount }).map((_, i) => (
              <div
                key={`occupied-${i}`}
                className="w-8 h-8 rounded-full bg-puka-red flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-puka-red/20"
              >
                ✗
              </div>
            ))}
            {Array.from({ length: availableSlots }).map((_, i) => (
              <div
                key={`available-${i}`}
                className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold animate-pulse shadow-lg shadow-green-500/20"
              >
                ✓
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            <span className="text-puka-red font-bold">{activeAlliesCount}</span> ocupados &middot;
            <span className="text-green-500 font-bold ml-1">{availableSlots}</span> disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="font-display font-black text-2xl tracking-tighter" style={{ color: '#111827' }}>
              PUKA<span className="text-puka-red">DIGITAL</span>
            </h3>
            <p className="max-w-sm leading-relaxed font-medium" style={{ color: '#6B7280' }}>
              Ingenier&iacute;a de Relevancia en Ecuador. <br />
              Marketing Digital Estrat&eacute;gico y Desarrollo Web High-Performance.
            </p>
          </div>

          {/* Sitemap Column */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 inline-block pb-2" style={{ color: '#374151', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
              Navegaci&oacute;n
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', icon: Home, label: 'El Método' },
                { href: '/productos', icon: Package, label: 'El Programa' },
                { href: '/blog', icon: FileText, label: 'Blog' },
                { href: '/demos', icon: PlayCircle, label: 'Demos' },
                { href: '/nosotros', icon: Users, label: 'Nosotros' },
                { href: '/preguntas-frecuentes', icon: HelpCircle, label: 'Preguntas Frecuentes' },
                { href: '/contacto', icon: Mail, label: 'Contacto' },
                { href: '/cuanto-cuesta-publicidad-google-ecuador', icon: DollarSign, label: 'Guía de Precios Google' },
              ].map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-black/[0.03] transition-all duration-300" style={{ color: '#6B7280' }}>
                    <div
                      className="p-2 rounded-md transition-colors duration-300 group-hover:bg-puka-red group-hover:text-white"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#9CA3AF' }}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform group-hover:text-gray-900">{label}</span>
                    <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 inline-block pb-2" style={{ color: '#374151', borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terminos" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm hover:bg-black/[0.03] cursor-pointer transition-all" style={{ color: '#6B7280' }}>
                  <Shield size={16} style={{ color: '#9CA3AF' }} className="group-hover:text-puka-red transition-colors" />
                  T&eacute;rminos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/legal/politica-de-privacidad" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm hover:bg-black/[0.03] cursor-pointer transition-all" style={{ color: '#6B7280' }}>
                  <Shield size={16} style={{ color: '#9CA3AF' }} className="group-hover:text-puka-red transition-colors" />
                  Pol&iacute;tica de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm hover:bg-black/[0.03] cursor-pointer transition-all" style={{ color: '#6B7280' }}>
                  <Shield size={16} style={{ color: '#9CA3AF' }} className="group-hover:text-puka-red transition-colors" />
                  Pol&iacute;tica de Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/garantia" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm hover:bg-black/[0.03] cursor-pointer transition-all" style={{ color: '#6B7280' }}>
                  <AlertCircle size={16} style={{ color: '#9CA3AF' }} className="group-hover:text-puka-red transition-colors" />
                  Garant&iacute;a de Devoluci&oacute;n
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
          <p>&copy; {new Date().getFullYear()} PukaDigital S.A.C. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span>Hecho con dignidad en Ecuador 🇪🇨</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
