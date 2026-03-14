'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { NavItem } from '@/types';
import { useTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // Track navigation
  const handleNavClick = (toSection: string) => {
    const currentSection = pathname.split('/').pop() || 'inicio';
    ga.trackSeccionNavega(
      currentSection,
      toSection as 'metodo' | 'programa' | 'casos' | 'blog' | 'demos' | 'nosotros' | 'productos' | 'contacto',
      'menu'
    );
  };

  // Dynamic Nav Items (Paths are now static Spanish)
  const navItems: NavItem[] = [
    { label: t('nav.method'), path: '/' },
    { label: t('nav.products'), path: '/productos' },
    { label: t('nav.cases'), path: '/casos' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.demos'), path: '/demos' },
    { label: t('nav.about'), path: '/nosotros' },
    { label: t('nav.contact'), path: '/contacto' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // Check if current page is Home or special landing to hide global navbar (avoid double header)
  const isHiddenNavbarPage = ['/'].includes(pathname) ||
    pathname?.includes('/salud') ||
    pathname?.includes('/inventario') ||
    pathname?.includes('/chatbot') ||
    pathname?.includes('/sistema');

  if (isHiddenNavbarPage) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
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
                onClick={() => handleNavClick(item.path.split('/').pop() || 'inicio')}
                className={`text-sm font-medium transition-colors hover:text-puka-red ${pathname === item.path
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
              className={`text-lg font-medium py-2 border-b border-gray-50 dark:border-gray-800 ${pathname === item.path ? 'text-puka-red' : 'text-puka-black dark:text-gray-200'
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