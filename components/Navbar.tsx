'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import Image from 'next/image';
import { NavItem } from '@/types';
import { useTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';

interface NavbarProps {
  lang?: string;
}

const Navbar: React.FC<NavbarProps> = ({ lang = 'es' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();

  // Dynamic Nav Items based on current language
  const navItems: NavItem[] = [
    { label: t('nav.method'), path: `/${lang}` },
    { label: t('nav.products'), path: `/${lang}/productos` },
    { label: t('nav.cases'), path: `/${lang}/casos` },
    { label: t('nav.blog'), path: `/${lang}/blog` },
    { label: t('nav.demos'), path: `/${lang}/demos` },
    { label: t('nav.contact'), path: `/${lang}/contacto` },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const languages = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
  ] as const;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image 
                src="/pegaso-rojo.svg" 
                fill
                className="object-contain"
                alt="Pegaso Puka Digital"
                priority
              />
            </div>
            <div className="relative h-10 w-44">
              <Image 
                src={theme === 'dark' ? '/logo-Puka-dark.svg' : '/logo-Puka.svg'}
                fill
                className="object-contain object-left"
                alt="Puka Digital Logo"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-puka-red ${
                  pathname === item.path 
                    ? 'text-puka-red font-semibold' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-6">
              {/* Slots Badge */}
              <div className="hidden lg:flex items-center gap-2 bg-puka-red/10 dark:bg-puka-red/20 px-3 py-1.5 rounded-full border border-puka-red/30">
                <span className="text-sm tracking-wider">🔴🔴🔴🟢🟢</span>
                <span className="text-xs font-bold text-puka-red">
                  {t('nav.slots_badge')} {t('nav.slots_available')}
                </span>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <Globe size={18} />
                  {language.toUpperCase()}
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-sm py-1 w-24 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${
                          language === lang.code ? 'text-puka-red font-bold' : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <span>{lang.flag}</span> {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>

            <Link
              href="/contacto"
              className="bg-puka-black dark:bg-white text-white dark:text-puka-black px-6 py-2.5 rounded-sm font-medium hover:bg-puka-red dark:hover:bg-gray-200 transition-colors text-sm"
            >
              {t('nav.cta')}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Lang Toggle (Simple Cycle) */}
            <button
              onClick={() => {
                const order: ('es'|'en'|'pt')[] = ['es', 'en', 'pt'];
                const nextIndex = (order.indexOf(language) + 1) % order.length;
                setLanguage(order[nextIndex]);
              }}
              className="p-2 text-puka-black dark:text-white font-bold text-xs border border-gray-200 dark:border-gray-700 rounded-sm"
            >
              {language.toUpperCase()}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-puka-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 text-puka-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg py-8 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium py-2 border-b border-gray-50 dark:border-gray-800 ${
                pathname === item.path ? 'text-puka-red' : 'text-puka-black dark:text-gray-200'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setIsOpen(false)}
            className="bg-puka-red text-white text-center py-4 rounded-sm font-bold mt-4"
          >
            {t('nav.start')}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;