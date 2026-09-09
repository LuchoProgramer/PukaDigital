# AGENTS.md — PukaDigital

Reglas del proyecto, portables a cualquier agente. Las lee Antigravity, Cursor y Codex
de forma nativa; Claude Code las carga vía el `@AGENTS.md` de `CLAUDE.md`, que además
añade encima lo específico de ese agente. **Cada regla tiene un solo dueño: lo que es
del proyecto vive aquí y no se copia al otro archivo.**

⚠️ **Tope de 12.000 caracteres.** Antigravity trunca los archivos de reglas ahí,
en silencio y por el final. Este archivo va por ~8.500 y llegó a rozar 11.500: lo
que crece son los detalles de producto. **Al añadir algo, sacar el detalle a
`docs/` y referenciarlo con `@`.** Aquí solo lo que se usa a diario.

Comprobar el tamaño: `wc -m AGENTS.md`

Empresa: **Puka Digital LLC** (Casper, Wyoming, USA · EIN: `320856610`)
Fundador: Luis Omar Viteri Sarango (LuchoDev) · Producción: **https://pukadigital.com**
Agencia de marketing digital y software SaaS para PYMEs en Ecuador y LATAM.

## Stack

**Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS · Lucide React**

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run lint         # ESLint
npx tsc --noEmit     # type check (limpiar .next/ primero si hay errores de rutas eliminadas)

npm run piezas       # genera las piezas de redes del mes en public/piezas/
npm run piezas -- --check   # solo valida, sin escribir nada. Es lo que corre en CI
npm test             # tests de la fabrica de piezas

npm run deploy:cloudflare   # build de OpenNext + wrangler deploy. Es como se despliega
npm run build:cloudflare    # solo construye, sin desplegar
```

⚠️ `lint` arrastra 180+ problemas pre-existentes en `proxy.ts`, `types/index.ts` y scripts. No son tuyos. **Los archivos en `app/` sí deben quedar limpios.**

Aquí se compila en local. **No todos los repos del ecosistema lo hacen** — verificar antes de correr nada:

| Repo | Compila | Notas |
|---|---|---|
| `PukaDigital` | sí | Este. **Cloudflare Workers**, con `npm run deploy:cloudflare` |
| `SistemaSalud` | sí (`salud-frontend/`) | PukaHealth. **No es Vercel**: frontend a Cloudflare con `npm run deploy`, backend al VPS por SSH. Leer su `docs/claude/deployment.md` —de ese repo, no de este— antes de desplegar |
| `prospecting-tools` | sí, con venv | Prospección de podólogos. Python; usa `.venv/bin/python`, no el del sistema (PEP 668) |
| `Podoclinic`, `HealppyPets` | no | Clones solo lectura, sin dependencias. Verificar contra producción con `curl` y dejar que Vercel compile en el preview del PR |

## Deploy

⚠️ **Ya no es Vercel.** Desde el 2026-09-08 `pukadigital.com` lo sirve un
**Cloudflare Worker**, y el despliegue **no** es automático al pushear: se hace a
mano con `npm run deploy:cloudflare` desde la máquina.

El cron de publicación también vive ahí (`0 14` y `0 23` UTC = 09:00 y 18:00 de
Ecuador), con precisión al minuto. Vercel sigue detrás como origen de respaldo y
se apaga a partir del 2026-09-15.

Detalle, vuelta atrás y lo que falta: @docs/ESTADO_2026-09-09.md

## Productos y URLs canónicas

| Producto | URL | Qué es |
|---|---|---|
| Agencia | `/agencia` | Marketing digital, Google Ads, SEO, desarrollo web |
| PukaIA | `/agentes-ia` | CRM con agentes IA para WhatsApp Business |
| LedgerXpertz | `/ledgerxpertz` | ERP SaaS: POS + inventario + facturación SRI |
| PukaHealth | `/pukahealth` | Historias clínicas + facturación SRI para médicos |
| PukaSalud | `/salud` | Marketing médico ético |
| Desarrollo web | `/desarrollo-web-pymes` | Sitios para PYMEs |

**Una sola URL canónica por producto.** Al añadir o quitar rutas, actualizar `app/sitemap.ts`.

### Precios vigentes

| Producto | Planes |
|---|---|
| PukaIA | Básico $14.99/mes · Pro $25/mes · Business $60/mes — 1 mes gratis, sin plan gratuito permanente |
| LedgerXpertz | Starter $15 · Grow $20 · Pro $25 (+IVA) — anual: 2 meses gratis |
| PukaHealth | Individual $50/mes · Anual $480/año — 30 días gratis |
| PukaSalud, Agencia, Desarrollo web | Sin precio visible, cotización por WhatsApp |

### PukaHealth: leer antes de escribir sobre él

⚠️ **Cuatro cosas que este repositorio daba por hechas y no lo están**: no hay
recordatorios por WhatsApp, Google Calendar es unidireccional, no hay app nativa
y no hay portal de reservas. **El «precio beta de $25» no existe.** Y toda
captura de pantalla lleva el aviso de datos ficticios dentro de la imagen.

Hay **dos** verticales clínicas —podología y hemodiálisis, verificado el
2026-09-09—, no una. Las demás usan el sistema completo sin bloque clínico
propio. «Se adapta a cualquier especialidad» sigue prohibido: suena a
configuración y es desarrollo a medida.

La lista completa, con el texto exacto del aviso, en @docs/PUKAHEALTH_LIMITES.md

## Arquitectura

Páginas de producto en `'use client'`. Metadata SEO en el `layout.tsx` de cada
ruta, **no** en `page.tsx`. JSON-LD vía `<SEO structuredData={schema} />` en el
`page.tsx`, que renderiza el `<script>` en el JSX.

⚠️ Dos reglas que ya costaron caro y no se deducen leyendo el código:

- **Nunca inyectar schema con `useEffect` + `appendChild` ni con `<Script>`.** Los
  crawlers que no ejecutan JS no lo ven jamás. Verificar contra el HTML servido:
  `curl -s https://pukadigital.com/<ruta> | grep 'application/ld+json'`
- **Los nombres de las variables de fuente tienen que decir la verdad.** Con
  nombres mentirosos el error es invisible leyendo el código. Verificar en el
  navegador con `getComputedStyle(el).fontFamily`, no que el build compile.

Lo mínimo que no se puede fallar: fondo `#080808`, acento **`#C7171E`** (sale del
wordmark del logo), titulares en Bricolage Grotesque, texto en Instrument Sans y
cifras en JetBrains Mono.

Detalle completo —cards glass, retícula, tipografía, landings standalone y el
porqué de cada decisión— en @docs/ARQUITECTURA.md

## Analytics y CTAs

```typescript
import * as ga from '@/lib/analytics';
ga.trackWhatsAppDirectoClick('ledgerxpertz_hero_primary');
```

Formato de location: `{producto}_{seccion}`.

WhatsApp: número `593964065880`, patrón `https://wa.me/{numero}?text={encodeURIComponent(mensaje)}`, siempre `window.open(url, '_blank', 'noopener,noreferrer')`, y **llamar al tracking antes de abrir**.

## Publicación en redes

Una pieza de `content/piezas/` sale en **dos canales**: el carrusel completo en
Instagram, y en Facebook **una sola imagen** con su caption largo, en la franja
siguiente (09:00 → 18:00; 18:00 → 09:00 del día siguiente).

⚠️ **La imagen de Facebook no es la slide 1 del carrusel.** Cada pieza declara su
`facebook.imagen` con un titular que dice la **conclusión**, no el gancho: una
slide 1 existe para que deslices y sola no dice nada. Sin ese campo, la pieza no
se publica en Facebook y `piezas --check` la rechaza.

⚠️ **Los PNG están versionados y hay que desplegar**: `npm run piezas`, commit, y
`npm run deploy:cloudflare`. Sin desplegar, la publicación pide al CDN un archivo
que en producción no existe.

Cómo escribir el titular, las capturas, la ventana de 60 minutos y cómo se evita
publicar dos veces: @docs/PUBLICACION_EN_REDES.md

## Publicidad y redes

Cuentas, píxeles e identificadores de Meta y TikTok: `docs/ECOSISTEMA_ADS.md`.
Trabajo orgánico y calendario de la community manager: `docs/COMMUNITY_MANAGEMENT.md`.

Lo único que vive en el código: `META_PIXEL_ID` y el pixel de TikTok en
`lib/analytics.ts`, inyectados desde `app/layout.tsx`. **No pautar sin leer
`docs/ECOSISTEMA_ADS.md`**: la secuencia acordada es contacto directo primero y
pauta recién en el mes 5.

## SEO y GEO

Reglas por página de producto:

1. `layout.tsx` — metadata completa: `title`, `description`, `keywords`, `canonical`, `openGraph`, `twitter`.
2. `page.tsx` — dos schemas: `SoftwareApplication` + `FAQPage`.
3. `public/llms.txt` — actualizar con URLs y precios al crear o modificar un producto.
4. `public/robots.txt` — ya permite todos los crawlers de IA. No tocar sin leer `docs/GEO_LLM_VISIBILITY.md`.

El porqué de todo esto, y el formato de las FAQ, en @docs/GEO_LLM_VISIBILITY.md

⚠️ En resumen: Google dice expresamente que **no** necesita `llms.txt` ni schema
para citarte en su IA. Se mantienen porque el schema alimenta los rich results y
`llms.txt` lo leen crawlers no-Google. No inventes tácticas «para LLMs».

## Convenciones

- TypeScript estricto, sin `any` en archivos nuevos.
- Un solo `<h1>` por página. Si hace falta split visual, `<span>` dentro del mismo `<h1>`.
- Entidades HTML en español: `&iquest;` `&Aacute;` `&Eacute;` `&ntilde;` `&copy;` `&mdash;`.
- Iconos: **Lucide React** exclusivamente, sin emojis como iconos.
- Arrays de datos (`PLANS`, `FEATURES`, `FAQS`) a nivel de módulo, fuera del componente.

## Commits

Formato: `tipo(scope): descripción en español`.

```
feat(ledgerxpertz): add FAQ section with FAQPage schema
fix(analytics): eliminar el doble conteo de conversiones
```

## Archivos importantes

| Archivo | Propósito |
|---|---|
| `app/sitemap.ts` | Sitemap dinámico — añadir/quitar rutas aquí |
| `lib/piezas/` | Fábrica de estáticos para redes — spec del 2026-09-01 |
| `content/piezas/` | Las piezas de cada mes, como datos versionados |
| `lib/analytics.ts` | Tracking de eventos GA |
| `components/ConditionalShell.tsx` | Oculta el shell global en landings standalone |
| `components/SEO.tsx` | Renderiza el JSON-LD en el JSX |
| `public/llms.txt` | Mapa del sitio para crawlers no-Google |
| `next.config.ts` | Solo imágenes, sin redirects |

## Documentación relacionada

- `docs/ARQUITECTURA.md` — detalle de arquitectura, estilos y tipografía
- `docs/PUKAHEALTH_LIMITES.md` — lo que el producto no hace y el aviso de capturas
- `docs/TRABAJO_CON_AGENTES.md` — cómo se coordinan Claude Code y Antigravity (`agy`)
- `docs/METODO_AGENTES_PARALELOS.md` — método de contraste, ejecución y verificación con `agy`
- `docs/ESTADO_2026-09-09.md` — **estado vigente**: infraestructura, vueltas atrás y lo que falta
- `docs/PROXIMOS_PASOS.md` — auditoría del 2026-08-29 y backlog priorizado
- `docs/GEO_LLM_VISIBILITY.md` — guía de GEO/LLM SEO
- `docs/CRO_MASTERY_GUIDE.md` — landing pages de alta conversión
- `docs/ANALYTICS_TRACKING.md` — convenciones de tracking
- `docs/HISTORIAL_SEO.md` — auditorías cerradas y keyword research (historial, no doctrina)
- `docs/TRANSICION_LLC.md` — checklist pendiente de Puka Digital LLC / Stripe Atlas
- `docs/ECOSISTEMA_ADS.md` — cuentas, píxeles y reglas de pauta en Meta y TikTok
- `docs/PUBLICACION_EN_REDES.md` — cómo publica la fábrica en Instagram y Facebook
- `docs/ENVIRONMENT_VARIABLES.md` — las variables, y **cómo se sacan los tokens de Meta**
- `docs/COMMUNITY_MANAGEMENT.md` — cadencia, mezcla y calendario del orgánico
- `docs/PUBLICAR_EN_FACEBOOK.md` — investigación previa; la decisión está en la spec del 2026-09-07
- `docs/CALENDARIO_CONTENIDO.md` — los temas de sep-nov 2026
