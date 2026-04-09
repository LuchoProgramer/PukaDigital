'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, PlayCircle, Mail, ChevronRight, FileText, Shield, AlertCircle, Users, HelpCircle, DollarSign } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { allies } from '@/data/allies';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

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
      className="text-white py-16 md:py-20 transition-colors duration-300"
      style={{
        background: 'rgba(5,5,5,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
      }}
    >
      {/* Glow rojo decorativo en el borde superior */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(199,23,30,0.50), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div className="container mx-auto px-4 md:px-6">

        {/* Slots Counter - Visual */}
        <div className="mb-16 text-center pb-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h4 className="font-display font-bold text-lg mb-4 text-gray-400">
            {t('footer.slots_title')}
          </h4>
          <div className="flex justify-center items-center gap-2 mb-3">
            {Array.from({ length: activeAlliesCount }).map((_, i) => (
              <div
                key={`occupied-${i}`}
                className="w-8 h-8 rounded-full bg-puka-red flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-puka-red/30"
              >
                ✗
              </div>
            ))}
            {Array.from({ length: availableSlots }).map((_, i) => (
              <div
                key={`available-${i}`}
                className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold animate-pulse shadow-lg shadow-green-500/30"
              >
                ✓
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            <span className="text-puka-red font-bold">{activeAlliesCount}</span> {t('footer.slots_occupied')} ·
            <span className="text-green-500 font-bold ml-1">{availableSlots}</span> {t('footer.slots_available')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="font-display font-black text-2xl tracking-tighter">
              PUKA<span className="text-puka-red">DIGITAL</span>
            </h3>
            <p className="text-gray-400 max-w-sm leading-relaxed font-medium">
              Ingenier&iacute;a de Relevancia en Ecuador. <br />
              Marketing Digital Estrat&eacute;gico y Desarrollo Web High-Performance.
            </p>
            <div className="flex gap-4 pt-4">
            </div>
          </div>

          {/* Sitemap Column */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-puka-beige inline-block pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              {t('footer.nav_title')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Home size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.method')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/productos" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Package size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.products')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/blog" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.blog')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/demos" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <PlayCircle size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.demos')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.about')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <HelpCircle size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.faq')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.contact')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/cuanto-cuesta-publicidad-google-ecuador" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <DollarSign size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.google_price_guide')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-puka-beige inline-block pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              {t('footer.legal_title')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terminos" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 group-hover:text-puka-red transition-colors" />
                  T&eacute;rminos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/legal/politica-de-privacidad" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 group-hover:text-puka-red transition-colors" />
                  Pol&iacute;tica de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 group-hover:text-puka-red transition-colors" />
                  Pol&iacute;tica de Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/garantia" className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <AlertCircle size={16} className="text-gray-600 group-hover:text-puka-red transition-colors" />
                  Garant&iacute;a de Devoluci&oacute;n
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
          <p>&copy; {new Date().getFullYear()} PukaDigital S.A.C. {t('footer.rights')}</p>
          <div className="flex gap-4">
            <span>{t('footer.made_in')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
