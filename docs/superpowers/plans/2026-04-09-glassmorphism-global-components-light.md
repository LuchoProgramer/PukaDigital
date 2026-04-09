# Glassmorphism Global Components — Light Frosted Glass Revision Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir Navbar, Footer y MobileBottomNav de Dark Glass a Light Frosted Glass para mantener coherencia visual con la homepage clara.

**Architecture:** Misma estructura de tokens en objeto a nivel de módulo. Se invierten los valores rgba: fondos oscuros → blancos/claros, textos blancos → grises oscuros. Logo vuelve a `/logo-Puka.svg`. Footer pasa de fondo negro a fondo frosted claro. Sin cambios en lógica, routing, analytics ni i18n.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, inline styles.

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `components/Navbar.tsx` | Tokens light + logo claro + textos oscuros |
| `components/Footer.tsx` | Fondo frosted claro + textos oscuros |
| `components/MobileBottomNav.tsx` | Bar frosted clara + íconos oscuros |

---

### Task 1: Navbar — Light Frosted Glass

**Files:**
- Modify: `components/Navbar.tsx` (reemplazar archivo completo)

- [ ] **Step 1: Reemplazar `components/Navbar.tsx` completo**

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
    background: 'rgba(255,255,255,0.60)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
  },
  scrolled: {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
  mobileOverlay: {
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  slotsBadge: {
    background: 'rgba(199,23,30,0.08)',
    border: '1px solid rgba(199,23,30,0.25)',
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
                src="/logo-Puka.svg"
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
                style={{ color: pathname === item.path ? '#111827' : '#6B7280' }}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-2 border-l pl-6" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {/* Slots Badge */}
              <div
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={navGlass.slotsBadge}
              >
                <span className="text-sm tracking-wider">🔴🔴🔴🟢🟢</span>
                <span className="text-xs font-bold" style={{ color: '#C7171E' }}>
                  {t('nav.slots_badge')} {t('nav.slots_available')}
                </span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors hover:bg-black/[0.05]"
                style={{ color: '#6B7280' }}
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>

            <Link
              href="/contacto"
              className="bg-puka-red text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors shadow-sm shadow-puka-red/20"
            >
              {t('nav.cta')}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm transition-colors hover:bg-black/[0.05]"
              style={{ color: '#6B7280' }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-sm transition-colors hover:bg-black/[0.05]"
              style={{ color: '#111827' }}
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
              className="text-lg font-medium py-2 transition-colors hover:text-puka-red"
              style={{
                color: pathname === item.path ? '#111827' : '#4B5563',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setIsOpen(false)}
            className="bg-puka-red text-white text-center py-4 rounded-lg font-bold mt-4"
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

- [ ] **Step 2: Verificar en dev**

```bash
npm run dev
```

Ir a http://localhost:3000/agencia:
- Navbar: frosted blanco semitransparente al top, más opaco al scroll
- Logo: `/logo-Puka.svg` visible sobre fondo claro
- Links: gris `#6B7280`, activo `#111827` oscuro
- CTA: rojo sólido
- Mobile overlay: blanco con texto oscuro

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(navbar): light frosted glass — coherencia con homepage clara"
```

---

### Task 2: Footer — Light Frosted Glass

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
            {t('footer.slots_title')}
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
            <span className="text-puka-red font-bold">{activeAlliesCount}</span> {t('footer.slots_occupied')} ·
            <span className="text-green-500 font-bold ml-1">{availableSlots}</span> {t('footer.slots_available')}
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
              {t('footer.nav_title')}
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', icon: Home, label: t('nav.method') },
                { href: '/productos', icon: Package, label: t('nav.products') },
                { href: '/blog', icon: FileText, label: t('nav.blog') },
                { href: '/demos', icon: PlayCircle, label: t('nav.demos') },
                { href: '/nosotros', icon: Users, label: t('nav.about') },
                { href: '/preguntas-frecuentes', icon: HelpCircle, label: t('nav.faq') },
                { href: '/contacto', icon: Mail, label: t('nav.contact') },
                { href: '/cuanto-cuesta-publicidad-google-ecuador', icon: DollarSign, label: t('nav.google_price_guide') },
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
              {t('footer.legal_title')}
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

Ir a http://localhost:3000/agencia y scrollear al footer:
- Fondo frosted blanco/azulado muy suave
- "PUKADIGITAL" en negro, "DIGITAL" en rojo
- Íconos de nav con fondo `rgba(0,0,0,0.04)`, hover → rojos
- Copyright en gris suave
- Sin glow rojo (no aplica en diseño claro)

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(footer): light frosted glass — fondo claro coherente con homepage"
```

---

### Task 3: MobileBottomNav — Light Frosted Glass

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
```

- [ ] **Step 2: Verificar en dev (viewport móvil)**

```bash
npm run dev
```

Abrir http://localhost:3000/agencia en DevTools viewport 375px:
- Bottom nav: frosted blanco, sombra suave hacia arriba
- Íconos inactivos: `rgba(0,0,0,0.35)` gris suave
- Ícono activo: `#111827` negro
- Botón central rojo con borde blanco: sin cambios
- CTAs de conversión: sin cambios

- [ ] **Step 3: Commit**

```bash
git add components/MobileBottomNav.tsx
git commit -m "feat(mobile-nav): light frosted glass — coherencia con diseño claro"
```

---

### Task 4: Build final

- [ ] **Step 1: TypeScript check**

```bash
rm -rf .next && npx tsc --noEmit
```

Esperado: sin errores en los 3 archivos modificados.

- [ ] **Step 2: Build de producción**

```bash
npm run build
```

Esperado: build exitoso.

- [ ] **Step 3: Verificación visual rápida**

```bash
npm run dev
```

Checklist en http://localhost:3000/agencia:
- [ ] Navbar: frosted blanco, transparente al top, opaco al scroll
- [ ] Navbar: logo claro visible, links grises, CTA rojo sólido
- [ ] Footer: fondo frosted claro, texto gris, "PUKADIGITAL" negro+rojo
- [ ] MobileBottomNav (375px): frosted blanco, íconos grises/negro

- [ ] **Step 4: Commit final**

```bash
git commit -m "feat(global): light frosted glass completo — Navbar + Footer + MobileBottomNav"
```
