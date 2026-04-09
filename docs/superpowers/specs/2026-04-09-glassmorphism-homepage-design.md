# Diseño: Glassmorphism Aurora Dark Glass — Homepage `/`

**Fecha:** 2026-04-09
**Alcance:** Solo `app/page.tsx`
**Aprobado por:** Luis Viteri

---

## Objetivo

Modernizar la homepage de PukaDigital con un glassmorphism muy marcado, optimizado para pantallas Retina de MacBook. El diseño mantiene el design system "Dark Glass Rojo" ya usado en las landings de producto, unificando la identidad visual del sitio completo.

**Restricción crítica:** El logo SVG (`/pegaso-rojo.svg` y `/logo-Puka.svg`) no se modifica ni reemplaza.

---

## 1. Canvas Base (Background Global)

El wrapper principal `<div>` cambia de `bg-white text-gray-900` a un canvas oscuro con tres orbes de color difuso posicionados absolutamente.

**Colores base:**
- Fondo: `#080808`
- Texto base: `white`

**Tres orbes decorativos** (`position: absolute`, `pointer-events: none`, `z-index: 0`, `border-radius: 50%`, `filter: blur(Xpx)`):

| Orbe | Color | Tamaño | Posición | Blur |
|------|-------|--------|----------|------|
| Rojo (inferior-izq) | `rgba(199,23,30,0.25)` | 400×400px | `bottom: -100px, left: -100px` | 120px |
| Azul (superior-der) | `rgba(30,60,199,0.12)` | 500×500px | `top: -150px, right: -150px` | 140px |
| Púrpura (centro) | `rgba(120,20,180,0.10)` | 300×300px | `top: 40%, left: 40%` | 100px |

Todo el contenido va en `position: relative; z-index: 10` sobre los orbes.

---

## 2. Header Flotante Glass

**Reemplaza:** `fixed bg-white/90 backdrop-blur-md border-b border-gray-100`

**Nuevo estilo (inline styles):**
```
background: rgba(8,8,8,0.70)
backdrop-filter: blur(40px)
-webkit-backdrop-filter: blur(40px)
border-bottom: 1px solid rgba(255,255,255,0.08)
```

**Botón "Cotizar Ahora":**
- Reemplaza `bg-black text-white hover:bg-puka-red`
- Nuevo: `background: rgba(199,23,30,0.15)`, `border: 1px solid rgba(199,23,30,0.40)`, `color: white`
- Hover: `background: rgba(199,23,30,0.30)`, `box-shadow: 0 0 20px rgba(199,23,30,0.35)`

---

## 3. Hero Section

**Wrapper sección:** Quita decorative noise SVG externo (URL externa — se reemplaza por rejilla interna). La rejilla cambia de `#80808012` a `rgba(255,255,255,0.03)`.

**Badge superior:**
- Reemplaza `bg-gray-100 text-gray-600 border-gray-200`
- Nuevo: `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.12)`, `backdrop-filter: blur(12px)`, `color: rgba(255,255,255,0.60)`

**`<h1>`:** `color: white` — el span con gradiente `from-puka-red to-red-600` se mantiene intacto.

**`<h2>` subtítulo:** `color: rgba(255,255,255,0.65)`, los `<strong>` en `color: white`.

**Botón primario "Ver nuestro Método":**
- Mantiene `bg-puka-red text-white`
- Agrega: `box-shadow: 0 0 32px rgba(199,23,30,0.45)` (glow rojo)
- Hover: glow más intenso `0 0 48px rgba(199,23,30,0.60)`

**Botón secundario "Cotizar Proyecto Web":**
- Reemplaza `bg-white border-2 border-gray-900 text-gray-900`
- Nuevo: `background: rgba(255,255,255,0.07)`, `border: 1px solid rgba(255,255,255,0.20)`, `color: white`, `backdrop-filter: blur(12px)`

---

## 4. Sección "El Problema"

**Reemplaza:** `bg-gray-50 border-y border-gray-100`

**Nuevo:** Fondo transparente + panel glass centrado:
- Panel: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.08)`, `backdrop-filter: blur(20px)`, `border-radius: 24px`, `padding: 48px`
- Ícono contenedor: `background: rgba(199,23,30,0.15)`, `color: rgba(199,23,30,0.90)` (reemplaza `bg-orange-100 text-orange-600`)
- `<h2>`: `color: white`
- `<p>` cita: `color: rgba(255,255,255,0.65)`

---

## 5. Sección Metodología (3 cards)

**Wrapper sección:** Quita `bg-white`. Fondo transparente — el canvas oscuro se ve a través.

**Título sección:** `color: white`, el span de acento rojo permanece.
**Badge "Diferenciador Técnico":** `color: rgba(199,23,30,0.90)` (similar a lo actual).

**Cada card glass:**
```
background: rgba(255,255,255,0.05)
backdrop-filter: blur(24px)
-webkit-backdrop-filter: blur(24px)
border: 1px solid rgba(255,255,255,0.08)
border-top: 3px solid rgba(255,255,255,0.04)   ← en estado normal
border-radius: 20px
```

**Hover de card:**
```
background: rgba(255,255,255,0.09)
box-shadow: 0 8px 32px rgba(0,0,0,0.40)
border-top: 3px solid #C7171E   ← acento rojo en hover (ya existía, se mantiene)
```

**Iconos contenedor:** `background: rgba(255,255,255,0.08)`, `color: rgba(255,255,255,0.80)` — reemplaza los colores blue/purple/green.

**`<h3>` cards:** `color: white`
**`<p>` descripción:** `color: rgba(255,255,255,0.60)`
**Badges de keyword** (ej. "Keywords", "Relevancia"): `background: rgba(255,255,255,0.08)`, `color: rgba(255,255,255,0.50)`

---

## 6. Sección Soluciones (2 cards grandes)

**Wrapper sección:** Quita `bg-gray-900`. Fondo transparente.

**Título:** `color: white`

**Card "Soy Emprendedor"** (era `bg-gray-800 border-gray-700`):
```
background: rgba(255,255,255,0.06)
backdrop-filter: blur(24px)
border: 1px solid rgba(255,255,255,0.10)
```
- Hover: `background: rgba(255,255,255,0.10)`, `border-color: rgba(199,23,30,0.50)`
- Ícono fondo decorativo: mantiene `opacity-10/20`
- Ícono circulo: `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.12)`
- CTA link: mantiene `text-puka-red`

**Card "Soy una Empresa"** (era `bg-white text-gray-900`):
```
background: rgba(255,255,255,0.06)
backdrop-filter: blur(24px)
border: 1px solid rgba(255,255,255,0.10)
```
- Todo el texto en blanco — `<h3>` white, `<p>` `rgba(255,255,255,0.65)`
- Ícono circulo: `background: rgba(255,255,255,0.08)`
- CTA link: cambia de `text-blue-700` → `text-puka-red` (coherencia del design system)
- Hover: mismo glass hover que la otra card

---

## 7. Footer

**Reemplaza:** `bg-gray-50 border-t border-gray-200`

**Nuevo:**
```
background: rgba(0,0,0,0.60)
border-top: 1px solid rgba(255,255,255,0.08)
backdrop-filter: blur(20px)
```
- Copyright: `color: rgba(255,255,255,0.40)`
- Links legales: `color: rgba(255,255,255,0.40)`, hover `color: #C7171E`

---

## Tokens de estilo reutilizables (objeto `glass`)

Definir a nivel de módulo en `page.tsx` para spread:

```typescript
const glass = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '20px',
  },
  cardHover: {
    background: 'rgba(255,255,255,0.09)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.40)',
  },
  header: {
    background: 'rgba(8,8,8,0.70)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
};
```

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---------|---------------|
| `app/page.tsx` | Rediseño completo de estilos — sin cambios de estructura HTML ni lógica |

**No se modifican:**
- `tailwind.config.ts`
- `components/Navbar.tsx` (la homepage tiene su propio header)
- `components/Footer.tsx` (la homepage tiene su propio footer)
- Cualquier archivo de SEO, schema, o analytics
- Los SVGs del logo

---

## Criterios de éxito

1. Glassmorphism visible y marcado en todas las cards y el header en pantallas MacBook (1440px+)
2. `backdrop-filter: blur()` funciona en Safari (via `-webkit-backdrop-filter`)
3. El logo SVG aparece sin cambios
4. Los links de analytics y WhatsApp funcionan igual
5. No se rompe el schema JSON-LD ni el SEO
6. El sitio se ve legible y funcional en móvil (360px) aunque el diseño prioriza desktop
