# Diseño: Glassmorphism Aurora Dark Glass — Componentes Globales

**Fecha:** 2026-04-09
**Alcance:** `components/Navbar.tsx`, `components/Footer.tsx`, `components/MobileBottomNav.tsx`
**Aprobado por:** Luis Viteri

---

## Objetivo

Aplicar el sistema Aurora Dark Glass (ya implementado en `app/page.tsx`) a los tres componentes globales del sitio. Estos componentes afectan todas las páginas que no son standalone, modernizando el sitio completo de un solo golpe.

**Restricciones:**
- Logo SVGs (`/pegaso-rojo.svg`, `/logo-Puka-dark.svg`) no se modifican
- El dark mode toggle se mantiene — controla el tema del contenido de las páginas
- Toda la lógica, analytics, i18n y routing se mantiene intacta
- El comportamiento de ocultamiento por ruta se mantiene (Navbar retorna `null` en `/`, `/salud`, `/inventario`, `/chatbot`, `/sistema`)

---

## 1. Navbar Glass (`components/Navbar.tsx`)

### 1.1 Scroll-Aware Background

Agregar estado `isScrolled: boolean` con `useEffect` que escucha `window.scroll`:

```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 20);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**Estado "en el top"** (`isScrolled = false`):
```
background: rgba(8,8,8,0.30)
backdrop-filter: blur(12px)
-webkit-backdrop-filter: blur(12px)
border-bottom: 1px solid rgba(255,255,255,0.04)
```

**Estado "scrolled"** (`isScrolled = true`):
```
background: rgba(8,8,8,0.85)
backdrop-filter: blur(24px)
-webkit-backdrop-filter: blur(24px)
border-bottom: 1px solid rgba(255,255,255,0.10)
```

**Transición suave entre estados** (en className, no inline):
```
transition-all duration-300
```

El wrapper `<nav>` cambia de Tailwind classes a inline style condicional + clase de transición:

```tsx
<nav
  className="sticky top-0 z-50 transition-all duration-300"
  style={isScrolled ? scrolledStyle : topStyle}
>
```

### 1.2 Logo

- Siempre usar `/logo-Puka-dark.svg` — el navbar es siempre oscuro
- Eliminar el condicional `theme === 'dark' ? '/logo-Puka-dark.svg' : '/logo-Puka.svg'`
- `/pegaso-rojo.svg` se mantiene sin cambios

### 1.3 Links de Navegación Desktop

Reemplazar `text-gray-600 dark:text-gray-300` y clases `dark:`:

- **Inactivo:** `color: rgba(255,255,255,0.60)`, hover `color: white` + `hover:text-white`
- **Activo** (`pathname === item.path`): `color: white`, `font-semibold`
- Hover `text-puka-red` se mantiene para el acento rojo en hover

```tsx
className={`text-sm font-medium transition-colors hover:text-puka-red ${
  pathname === item.path
    ? 'text-white font-semibold'
    : 'hover:text-white'
}`}
style={{ color: pathname === item.path ? 'white' : 'rgba(255,255,255,0.60)' }}
```

### 1.4 Slots Badge

Reemplazar `bg-puka-red/10 dark:bg-puka-red/20 border-puka-red/30`:

```
background: rgba(199,23,30,0.12)
border: 1px solid rgba(199,23,30,0.35)
```
Texto: `color: rgba(199,23,30,0.90)` para el label rojo.

### 1.5 Dark Mode Toggle

- Icono: `color: rgba(255,255,255,0.60)`
- Hover background: `rgba(255,255,255,0.08)` via Tailwind `hover:bg-white/[0.08]`
- Quitar `dark:hover:bg-gray-800` y `dark:text-gray-300`

### 1.6 CTA Button "/contacto"

Reemplazar `bg-puka-black dark:bg-white text-white dark:text-puka-black hover:bg-puka-red dark:hover:bg-gray-200`:

```
background: rgba(199,23,30,0.15)
border: 1px solid rgba(199,23,30,0.40)
color: white
border-radius: 8px
```
Hover: `background: rgba(199,23,30,0.30)` via `onMouseEnter`/`onMouseLeave` o clase Tailwind.

### 1.7 Mobile Menu Overlay

Reemplazar `bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg`:

```
background: rgba(8,8,8,0.95)
backdrop-filter: blur(24px)
-webkit-backdrop-filter: blur(24px)
border-bottom: 1px solid rgba(255,255,255,0.08)
box-shadow: 0 8px 32px rgba(0,0,0,0.60)
```

Links en el overlay:
- Normal: `color: rgba(255,255,255,0.75)`, quitar `text-puka-black dark:text-gray-200`
- Activo: `color: white`
- Separador: `border-b border-white/[0.06]` reemplaza `border-gray-50 dark:border-gray-800`

CTA mobile: mantiene `bg-puka-red text-white` — sin cambios.

### 1.8 Mobile Menu Toggle Buttons

Reemplazar `text-puka-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800`:
- `color: rgba(255,255,255,0.80)`
- `hover:bg-white/[0.08]`

---

## 2. Footer Glass (`components/Footer.tsx`)

### 2.1 Wrapper `<footer>`

Reemplazar `bg-puka-black dark:bg-black border-t border-gray-900 dark:border-gray-800`:

```
background: rgba(5,5,5,0.92)
backdrop-filter: blur(20px)
-webkit-backdrop-filter: blur(20px)
border-top: 1px solid rgba(255,255,255,0.08)
```

### 2.2 Glow rojo decorativo

Agregar justo dentro del `<footer>`, antes del `<div className="container">`:

```tsx
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
```

El `<footer>` necesita `position: relative` para contenerlo.

### 2.3 Slots Counter

Sin cambios funcionales. Quitar solo las clases `dark:` redundantes:
- `border-b border-gray-800` → se mantiene (ya correcto sobre oscuro)
- Los círculos rojos/verdes se mantienen igual

### 2.4 Columna Brand

Sin cambios de contenido. Quitar clases `dark:` redundantes:
- `text-gray-400` → se mantiene (correcto sobre oscuro)

### 2.5 Columna Sitemap — Fondos de íconos

Reemplazar `bg-gray-900 dark:bg-gray-800` en cada ícono de nav:
```
background: rgba(255,255,255,0.06)
border-radius: 6px
```
Via Tailwind: `bg-white/[0.06]` — elimina la dependencia de dark:.

El hover `group-hover:bg-puka-red group-hover:text-white` se mantiene.
El hover de fila `hover:bg-white/5` se mantiene.

### 2.6 Columna Legal

Sin cambios — ya usa `text-gray-400` y `hover:bg-white/5`, correcto.

### 2.7 Borde inferior + Copyright

Reemplazar `border-gray-900 dark:border-gray-800` → `border-white/[0.06]`
Reemplazar `text-gray-600 dark:text-gray-500` → `text-white/35`

---

## 3. MobileBottomNav Glass (`components/MobileBottomNav.tsx`)

### 3.1 Modo Navegación — Wrapper

Reemplazar `bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`:

```
background: rgba(8,8,8,0.85)
backdrop-filter: blur(20px)
-webkit-backdrop-filter: blur(20px)
border-top: 1px solid rgba(255,255,255,0.08)
box-shadow: 0 -4px 24px rgba(0,0,0,0.40)
```

### 3.2 Íconos de Navegación

- **Inactivo:** `text-gray-400 hover:text-gray-600` → `color: rgba(255,255,255,0.40)`, hover `rgba(255,255,255,0.70)`
- **Activo:** `text-puka-red` → `color: white` (blanco es más legible sobre glass oscuro que el rojo)
- Labels: mismo cambio de color

```tsx
className={`flex flex-col items-center justify-center w-16 py-1 transition-colors duration-200`}
style={{ color: active ? 'white' : 'rgba(255,255,255,0.40)' }}
```

### 3.3 Botón Primario "Empezar"

Sin cambios — `bg-puka-red`, `shadow-puka-red/40`, `border-4 border-white`. Perfecto sobre glass oscuro.

### 3.4 Modo Conversión — Action Bar

Reemplazar `bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]`:

```
background: rgba(8,8,8,0.85)
backdrop-filter: blur(20px)
-webkit-backdrop-filter: blur(20px)
border-top: 1px solid rgba(255,255,255,0.08)
box-shadow: 0 -4px 24px rgba(0,0,0,0.40)
```

Texto label "Oferta Especial": `color: rgba(255,255,255,0.50)` reemplaza `text-gray-400`
Texto nombre oferta: `color: white` reemplaza `text-gray-900`

Los botones de colores (`bg-green-600`, `bg-cyan-600`, `bg-purple-600`) se mantienen — son CTAs de conversión críticos.

---

## Tokens de estilo (objeto `navGlass` — a nivel de módulo en Navbar)

```typescript
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
```

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---------|---------------|
| `components/Navbar.tsx` | Glass + scroll-aware + quitar dark: clases |
| `components/Footer.tsx` | Glass layer + glow rojo + quitar dark: clases |
| `components/MobileBottomNav.tsx` | Glass en ambos modos |

**No se modifican:**
- Lógica de routing, analytics, i18n
- Estructura HTML
- SVGs del logo
- Comportamiento de ocultar en rutas específicas
- CTAs de conversión en MobileBottomNav (colores funcionales)

---

## Criterios de éxito

1. Navbar se ve transparente al top de cualquier página y opaco al scrollear — transición suave
2. `backdrop-filter: blur()` funciona en Safari via `-webkit-backdrop-filter`
3. Logo SVG sin cambios visuales
4. El dark mode toggle funciona y cambia el tema del contenido de las páginas
5. El menú mobile overlay es glass oscuro, legible
6. Footer tiene glow rojo sutil en el borde superior
7. MobileBottomNav glass en navegación y en modo conversión
8. No se rompen rutas, analytics ni i18n
