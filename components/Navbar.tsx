'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { NavItem } from '@/types';
import { useTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';

const navGlass = {
  top: {
    background: 'rgba(8,8,8,0.30)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  scrolled: {
    background: 'rgba(8,8,8,0.85)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
  },
  ctaBtn: {
    background: 'rgba(199,23,30,0.15)',
    border: '1px solid rgba(199,23,30,0.40)',
    borderRadius: '8px',
  },
  mobileOverlay: {
    background: 'rgba(8,8,8,0.95)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.60)',
  },
  slotsBadge: {
    background: 'rgba(199,23,30,0.12)',
    border: '1px solid rgba(199,23,30,0.35)',
  },
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (toSection: string) => {
    const currentSection = pathname.split('/').pop() || 'inicio';
    ga.trackSeccionNavega(
      currentSection,
      toSection as 'metodo' | 'programa' | 'casos' | 'blog' | 'demos' | 'nosotros' | 'productos' | 'contacto',
      'menu'
    );
  };

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

  const isHiddenNavbarPage = ['/'].includes(pathname) ||
    pathname?.includes('/salud') ||
    pathname?.includes('/inventario') ||
    pathname?.includes('/chatbot') ||
    pathname?.includes('/sistema');

  if (isHiddenNavbarPage) {
    return null;
  }

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={isScrolled ? navGlass.scrolled : navGlass.top}
    >
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
                src="/logo-Puka-dark.svg"
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
                className={`text-sm font-medium transition-colors hover:text-puka-red ${pathname === item.path ? 'font-semibold' : ''}`}
                style={{ color: pathname === item.path ? 'white' : 'rgba(255,255,255,0.60)' }}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-2 border-l pl-6" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
              {/* Slots Badge */}
              <div
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={navGlass.slotsBadge}
              >
                <span className="text-sm tracking-wider">🔴🔴🔴🟢🟢</span>
                <span className="text-xs font-bold" style={{ color: 'rgba(199,23,30,0.90)' }}>
                  {t('nav.slots_badge')} {t('nav.slots_available')}
                </span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors hover:bg-white/[0.08]"
                style={{ color: 'rgba(255,255,255,0.60)' }}
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>

            <Link
              href="/contacto"
              className="px-6 py-2.5 font-medium text-sm text-white transition-all duration-200 hover:bg-puka-red/30"
              style={navGlass.ctaBtn}
            >
              {t('nav.cta')}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm transition-colors hover:bg-white/[0.08]"
              style={{ color: 'rgba(255,255,255,0.80)' }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-sm transition-colors hover:bg-white/[0.08]"
              style={{ color: 'rgba(255,255,255,0.80)' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div
          className="md:hidden absolute top-20 left-0 w-full py-8 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5"
          style={navGlass.mobileOverlay}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium py-2 transition-colors hover:text-white"
              style={{
                color: pathname === item.path ? 'white' : 'rgba(255,255,255,0.75)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
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
