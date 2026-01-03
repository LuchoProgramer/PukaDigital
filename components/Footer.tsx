'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, PlayCircle, Mail, ChevronRight, FileText, Shield, AlertCircle, Flag, Users, HelpCircle, DollarSign } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { allies } from '@/data/allies';

interface FooterProps {
  lang?: string;
}

const Footer: React.FC<FooterProps> = ({ lang = 'es' }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Dynamic slot availability based on real allies data
  const totalSlots = 5;
  const activeAlliesCount = allies.filter(a => a.status !== 'graduated').length;
  const availableSlots = Math.max(0, totalSlots - activeAlliesCount);

  // Check if current page has a custom footer to hide the global one
  const isCustomFooterPage = pathname === '/' || pathname === `/${lang}` || pathname?.includes('/sistema') || pathname?.includes('/salud');

  if (isCustomFooterPage) {
    return null;
  }

  return (
    <footer className="bg-puka-black dark:bg-black text-white py-16 md:py-20 border-t border-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">

        {/* Manifesto Section Removed */}

        {/* Slots Counter - Visual */}
        <div className="mb-16 text-center border-b border-gray-800 pb-16">
          <h4 className="font-display font-bold text-lg mb-4 text-gray-400">
            {t('footer.slots_title')}
          </h4>
          <div className="flex justify-center items-center gap-2 mb-3">
            {/* Red circles for occupied */}
            {Array.from({ length: activeAlliesCount }).map((_, i) => (
              <div
                key={`occupied-${i}`}
                className="w-8 h-8 rounded-full bg-puka-red flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-puka-red/30"
              >
                ✗
              </div>
            ))}
            {/* Green circles for available */}
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

          {/* Brand Column - Simplified */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="font-display font-black text-2xl tracking-tighter">
              PUKA<span className="text-puka-red">DIGITAL</span>
            </h3>
            <p className="text-gray-400 max-w-sm leading-relaxed font-medium">
              Ingeniería de Relevancia en Ecuador. <br />
              Marketing Digital Estratégico y Desarrollo Web High-Performance.
            </p>
            <div className="flex gap-4 pt-4">
              {/* Social Icons or Trust Badges could go here */}
            </div>
          </div>

          {/* Sitemap Column - ENHANCED */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-puka-beige border-b border-gray-800 pb-2 inline-block">
              {t('footer.nav_title')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Home size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.method')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/productos`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Package size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.products')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.blog')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/demos`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <PlayCircle size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.demos')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/nosotros`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.about')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/preguntas-frecuentes`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <HelpCircle size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.faq')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contacto`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.contact')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/cuanto-cuesta-publicidad-google-ecuador`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
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
            <h4 className="font-display font-bold text-lg mb-6 text-puka-beige border-b border-gray-800 pb-2 inline-block">
              {t('footer.legal_title')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}/legal/terminos`} className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/legal/politica-de-privacidad`} className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/legal/cookies`} className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/legal/garantia`} className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <AlertCircle size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                  Garantía de Devolución
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 dark:border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 dark:text-gray-500">
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