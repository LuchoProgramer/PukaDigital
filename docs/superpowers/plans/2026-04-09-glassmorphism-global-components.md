# Glassmorphism Global Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar Aurora Dark Glass a `Navbar.tsx`, `Footer.tsx` y `MobileBottomNav.tsx` — los tres componentes globales que afectan todas las páginas no-standalone.

**Architecture:** Inline styles para valores glass exactos (rgba, backdrop-filter), Tailwind para layout/spacing/hover. Navbar scroll-aware con `useEffect` + `useState<boolean>`. Footer recibe glass layer + glow rojo decorativo. MobileBottomNav glass en modo navegación y conversión. Sin cambios en lógica, routing, analytics ni i18n.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide React

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `components/Navbar.tsx` | Glass scroll-aware + quitar dark: + logo siempre dark |
| `components/Footer.tsx` | Glass layer + glow rojo + quitar dark: |
| `components/MobileBottomNav.tsx` | Glass en ambos modos |

---

### Task 1: Navbar — reescritura completa

**Files:**
- Modify: `components/Navbar.tsx` (reemplazar archivo completo)

- [ ] **Step 1: Leer el archivo actual**

```bash
cat components/Navbar.tsx
```

Confirmar que el archivo tiene exactamente la estructura conocida antes de reemplazar.

- [ ] **Step 2: Reemplazar `components/Navbar.tsx` completo**

```tsx
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
```

- [ ] **Step 3: Verificar en dev**

```bash
npm run dev
```

Abrir cualquier página con navbar (ej. http://localhost:3000/agencia):
- Al top: navbar muy transparente, se ve el fondo a través
- Al scrollear 20px+: navbar se oscurece con blur marcado
- Logo: usa `logo-Puka-dark.svg` (visible sobre oscuro)
- Links: `rgba(255,255,255,0.60)` inactivos, blancos activos
- Botón CTA: glass rojo
- Toggle dark mode: ícono blanco semitransparente

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(navbar): glass scroll-aware Aurora Dark Glass"
```

---

### Task 2: Footer — glass layer + glow + cleanup

**Files:**
- Modify: `components/Footer.tsx` (reemplazar archivo completo)

- [ ] **Step 1: Reemplazar `components/Footer.tsx` completo**

```tsx
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
```

- [ ] **Step 2: Verificar en dev**

```bash
npm run dev
```

Ir a http://localhost:3000/agencia y scrollear hasta el footer:
- Footer tiene blur glass — el fondo se ve difuso a través
- Línea roja brillante sutil en el borde superior (glow)
- Íconos de nav con `rgba(255,255,255,0.06)` de fondo, hover los pone rojos
- Copyright en `rgba(255,255,255,0.35)`

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(footer): glass layer + glow rojo decorativo"
```

---

### Task 3: MobileBottomNav — glass en ambos modos

**Files:**
- Modify: `components/MobileBottomNav.tsx` (reemplazar archivo completo)

- [ ] **Step 1: Reemplazar `components/MobileBottomNav.tsx` completo**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, Package, BookOpen, PlayCircle, Trophy, MessageCircle } from 'lucide-react';
import * as ga from '@/lib/analytics';

const mobileGlass = {
  bar: {
    background: 'rgba(8,8,8,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.40)',
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
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.50)' }}>Oferta Especial</span>
            <span className="text-sm font-black text-white leading-tight">{context.label}</span>
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
                <div className="bg-puka-red text-white p-4 rounded-full shadow-lg shadow-puka-red/40 transform transition-transform group-active:scale-95 border-4 border-white">
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
              style={{ color: active ? 'white' : 'rgba(255,255,255,0.40)' }}
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
```

- [ ] **Step 2: Verificar en dev (modo móvil)**

```bash
npm run dev
```

Abrir http://localhost:3000/agencia en DevTools con viewport móvil (375px):
- Bottom nav: glass oscuro con blur visible
- Íconos inactivos: `rgba(255,255,255,0.40)` (semitransparente)
- Ícono activo: blanco
- Botón central "Empezar": círculo rojo flotante con borde blanco — sin cambios
- Probar también en una ruta de conversión (si existe `/salud`) — action bar también glass oscuro

- [ ] **Step 3: Commit**

```bash
git add components/MobileBottomNav.tsx
git commit -m "feat(mobile-nav): glass Aurora Dark Glass — navegación y conversión"
```

---

### Task 4: Build de producción + verificación final

**Files:**
- No modifications

- [ ] **Step 1: TypeScript check**

```bash
rm -rf .next && npx tsc --noEmit
```

Esperado: sin errores en los 3 componentes modificados. Errores pre-existentes en `proxy.ts` y `types/index.ts` son conocidos — no son parte de este trabajo.

- [ ] **Step 2: Build de producción**

```bash
npm run build
```

Esperado: build exitoso. Puede haber warnings de lint pre-existentes — ignorar si no son de los 3 archivos modificados.

- [ ] **Step 3: Verificación visual rápida**

```bash
npm run dev
```

Checklist visual en http://localhost:3000/agencia:
- [ ] Navbar: transparente al top, opaco al scroll, transición suave
- [ ] Navbar: logo SVG sin cambios, botón CTA glass rojo
- [ ] Navbar mobile: abrir menú, overlay glass oscuro visible
- [ ] Footer: glow rojo en borde superior
- [ ] Footer: íconos de nav con fondo glass, hover rojo
- [ ] MobileBottomNav (viewport 375px): glass oscuro, íconos semitransparentes

- [ ] **Step 4: Commit final**

```bash
git add components/Navbar.tsx components/Footer.tsx components/MobileBottomNav.tsx
git commit -m "feat(global): glassmorphism Aurora Dark Glass — Navbar + Footer + MobileBottomNav completo"
```

---

## Self-Review

**Cobertura del spec:**
- [x] Navbar scroll-aware (`isScrolled` + `useEffect`) → Task 1
- [x] Navbar `navGlass` tokens a nivel módulo → Task 1
- [x] Logo siempre `/logo-Puka-dark.svg` → Task 1
- [x] Links inactivos `rgba(255,255,255,0.60)`, activos `white` → Task 1
- [x] Slots badge glass rojo → Task 1
- [x] Dark mode toggle `rgba(255,255,255,0.60)` + `hover:bg-white/[0.08]` → Task 1
- [x] CTA button glass rojo → Task 1
- [x] Mobile overlay glass oscuro `rgba(8,8,8,0.95)` → Task 1
- [x] Footer glass layer `rgba(5,5,5,0.92)` + `blur(20px)` → Task 2
- [x] Glow rojo decorativo en borde superior footer → Task 2
- [x] Íconos nav footer `rgba(255,255,255,0.06)` → Task 2
- [x] Copyright/borde footer `rgba(255,255,255,0.35)` → Task 2
- [x] MobileBottomNav glass ambos modos → Task 3
- [x] Íconos nav mobile: inactivo `rgba(255,255,255,0.40)`, activo `white` → Task 3
- [x] Botón primario "Empezar" sin cambios → Task 3
- [x] CTAs de conversión (`bg-green-600`, etc.) sin cambios → Task 3
- [x] Build verification → Task 4

**Placeholders:** Ninguno.

**Consistencia de tipos:** `navGlass` definido en Task 1 y usado en todo Task 1. `mobileGlass` definido en Task 3 y usado en Task 3. Nombres consistentes entre spec y plan.
