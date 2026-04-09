# Diseño: Light Frosted Glass — `/agencia`

**Fecha:** 2026-04-09
**Alcance:** `app/agencia/page.tsx`
**Aprobado por:** Luis Viteri

---

## Objetivo

Aplicar Light Frosted Glass a la página `/agencia`, eliminando el header embebido duplicado y convirtiendo el footer embebido en una sección CTA oscura. El global Navbar y Footer manejan la navegación y el pie de página.

---

## Cambios estructurales

1. **Eliminar `<header>` embebido** — el Navbar global (frosted glass) lo reemplaza
2. **Convertir `<footer>` en `<section>`** — sección CTA oscura, no elemento footer semántico

---

## 1. Page wrapper

`bg-white text-gray-900` → canvas blanco con 3 orbes pastel fijos:
- Rojo: `rgba(199,23,30,0.06)`, 500px, `blur(140px)`, bottom-left
- Azul: `rgba(30,60,199,0.05)`, 600px, `blur(150px)`, top-right
- Púrpura: `rgba(120,20,180,0.04)`, 350px, `blur(120px)`, center

---

## 2. Hero section

- Badge: frosted glass — `rgba(255,255,255,0.70)` + `border: 1px solid rgba(0,0,0,0.08)` + `blur(12px)`. Texto e ícono azul se mantienen.
- `<h1>`: `#111827`, span "Ecuador" mantiene `text-blue-700`
- `<h2>`: `#4B5563`, `<strong>` en `#111827`
- Botón primario: `bg-puka-red` sólido + `shadow-lg shadow-puka-red/25` + hover `-translate-y-1`
- Botón secundario: `rgba(255,255,255,0.80)` + `border: 2px solid rgba(17,24,39,0.85)` + `blur(12px)` + `color: #111827`
- **Tarjeta métricas** (derecha): frosted glass — `rgba(255,255,255,0.70)` + `blur(20px)` + `border: 1px solid rgba(255,255,255,0.80)` + `box-shadow: 0 8px 32px rgba(0,0,0,0.08)`. Blobs decorativos se mantienen con opacidad reducida a `opacity-30`.

---

## 3. Sección Anti-Servicio

- Quita `bg-gray-50 border-b border-gray-200` → fondo `rgba(199,23,30,0.02)` (sutilísimo)
- Panel "NO hacemos": frosted glass — `rgba(255,255,255,0.70)` + `blur(20px)` + `border: 1px solid rgba(255,255,255,0.80)` + `box-shadow: 0 4px 24px rgba(0,0,0,0.05)` + `border-radius: 20px`
- Headings: `#111827`, items tachados: sin cambios

---

## 4. Grid de Servicios (3 cards)

- Quita `bg-white` del wrapper → transparente
- Heading sección: `#111827`
- Cada card: `rgba(255,255,255,0.65)` + `blur(20px)` + `border: 1px solid rgba(255,255,255,0.80)` + `box-shadow: 0 4px 20px rgba(0,0,0,0.05)` + `border-radius: 16px`
- Hover card 1 (azul): `hover:bg-blue-50/50 hover:border-blue-200` se mantiene
- Hover card 2 (rojo): `hover:bg-red-50/30 hover:border-red-200` se mantiene
- Hover card 3 (verde): `hover:bg-green-50/30 hover:border-green-200` se mantiene
- Íconos container: `rounded-xl` (era `rounded-sm`)
- Textos: h3 `#111827`, p `#4B5563`, items `#6B7280`

---

## 5. Sección CTA (ex-footer)

- Cambia de `<footer>` a `<section>`
- Fondo: `#111827` + 2 orbes rojos difusos para profundidad
- Heading: `color: white`
- Párrafo: `color: rgba(255,255,255,0.65)`
- Botón: `bg-white text-gray-900` + hover `bg-gray-100` — sin cambios funcionales
- `border-radius` del botón: `8px`
- Sin border-top oscuro — el contraste de sección lo separa naturalmente

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/agencia/page.tsx` | Eliminar header/footer, aplicar frosted glass |

**No se modifican:** `app/agencia/layout.tsx`, SEO metadata, analytics, estructura HTML de contenido.

---

## Criterios de éxito

1. Sin header duplicado — solo el global Navbar se muestra
2. Cards frosted glass visibles con `backdrop-filter: blur()` sobre el canvas blanco
3. Colores de hover azul/rojo/verde intactos en servicios
4. Sección CTA oscura contrasta correctamente con el resto de la página clara
5. Sin el `<footer>` embebido — el global Footer se muestra al final
