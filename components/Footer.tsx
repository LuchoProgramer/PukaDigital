'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Package, PlayCircle, Mail, ChevronRight, FileText, Shield, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-puka-black dark:bg-black text-white py-16 md:py-20 border-t border-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
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
                <Link href="/" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Home size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.method')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/productos" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Package size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.products')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/blog" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.blog')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/demos" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
                  <div className="p-2 rounded-md bg-gray-900 dark:bg-gray-800 text-gray-400 group-hover:bg-puka-red group-hover:text-white transition-colors duration-300 shadow-sm">
                    <PlayCircle size={18} />
                  </div>
                  <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform">{t('nav.demos')}</span>
                  <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-puka-red" />
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="group flex items-center gap-3 p-2 -mx-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300">
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