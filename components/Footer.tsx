'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Package, PlayCircle, Mail, ChevronRight, FileText, Shield, AlertCircle, Flag } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface FooterProps {
  lang?: string;
}

const Footer: React.FC<FooterProps> = ({ lang = 'es' }) => {
  const { t } = useTranslation();

  // Simulated slot availability - can be connected to real data later
  const totalSlots = 5;
  const occupiedSlots = 3;
  const availableSlots = totalSlots - occupiedSlots;

  return (
    <footer className="bg-puka-black dark:bg-black text-white py-16 md:py-20 border-t border-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Manifesto Section - NEW */}
        <div className="mb-16 pb-16 border-b border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Flag className="text-puka-red" size={24} />
              <h3 className="font-display font-bold text-2xl text-puka-beige">
                {t('footer.manifesto_title')}
              </h3>
            </div>
            <div className="space-y-4 text-lg text-gray-300 italic">
              <p className="relative">
                <span className="text-puka-red font-bold">•</span> {t('footer.manifesto_1')}
              </p>
              <p className="relative">
                <span className="text-puka-red font-bold">•</span> {t('footer.manifesto_2')}
              </p>
              <p className="relative">
                <span className="text-puka-red font-bold">•</span> {t('footer.manifesto_3')}
              </p>
              <p className="relative font-bold text-white not-italic">
                <span className="text-puka-red">•</span> {t('footer.manifesto_4')}
              </p>
            </div>
            <p className="mt-8 font-display font-bold text-puka-red text-xl">
              {t('footer.signature')}
            </p>
          </div>
        </div>

        {/* Slots Counter - Visual */}
        <div className="mb-16 text-center">
          <h4 className="font-display font-bold text-lg mb-4 text-gray-400">
            {t('footer.slots_title')}
          </h4>
          <div className="flex justify-center items-center gap-2 mb-3">
            {/* Red circles for occupied */}
            {Array.from({ length: occupiedSlots }).map((_, i) => (
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
            <span className="text-puka-red font-bold">{occupiedSlots}</span> {t('footer.slots_occupied')} · 
            <span className="text-green-500 font-bold ml-1">{availableSlots}</span> {t('footer.slots_available')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="font-display font-bold text-3xl tracking-tighter">
              PUKA<span className="text-puka-red">DIGITAL</span>
            </h3>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="relative inline-block mt-4">
              <span className="absolute -left-4 -top-4 text-puka-red text-6xl opacity-20 font-serif">"</span>
              <p className="font-display font-bold text-xl text-white relative z-10 leading-tight">
                {t('footer.quote')}
              </p>
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
                <Link href={`/${lang}/contacto`} className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.contact')}</span>
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
                <span className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                  <Shield size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                  Términos de Servicio
                </span>
              </li>
              <li>
                <span className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                   <Shield size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                   Política de Privacidad
                </span>
              </li>
              <li>
                <span className="group flex items-center gap-2 p-2 -mx-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
                   <AlertCircle size={16} className="text-gray-600 dark:text-gray-500 group-hover:text-puka-red transition-colors" />
                   Garantía de Devolución
                </span>
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