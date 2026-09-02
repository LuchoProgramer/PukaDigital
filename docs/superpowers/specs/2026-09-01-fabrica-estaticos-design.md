# Fábrica de estáticos — Spec de Diseño

**Fecha:** 2026-09-01
**Estado:** Propuesto
**Alcance de esta spec:** Fase 1 — el render. Las fases 2-4 se describen solo para fijar los bordes.

---

## Contexto

Hoy las piezas de redes se producen a mano: 8 estáticos y 2 videos al mes, con la
community manager en el camino crítico de cada una. El cuello de botella no es la
publicación, es el arte.

Lo que **no** resuelve más volumen: Instagram premia cadencia sostenida y calidad,
no cantidad. Mosseri fija ~2 Reels + 3-5 posts de feed por semana, y publicar muchas
piezas flojas al día reparte el alcance en vez de sumarlo. El objetivo de la fábrica
es **quitar a una persona del camino crítico de producción**, no multiplicar por diez
las publicaciones. Donde el volumen sí paga es TikTok, y eso es la fase 4.

---

## Decisión de arquitectura: content as code

Las piezas son **datos versionados en el repositorio**. Se proponen por pull request
—que es la puerta de aprobación, con diff, revisión y rollback— y el merge a `main`
dispara la publicación.

**Se descarta n8n.** Existe para encadenar APIs sin escribir código; el costo es un
servicio más que hospedar, credenciales fuera del repo y el calendario de contenido
viviendo en una base de datos que no es git. Los conectores que aporta son ~200 líneas
de `fetch`. Para un equipo que ya trabaja en la terminal, es sobrecoste puro.

El orquestador es **git**. El cerebro, cuando llegue, es un agente en modo headless
—`claude -p`, Antigravity o cualquier otro— disparado por `cron` o GitHub Actions. Cuál
de ellos es intercambiable por diseño; ver *Independencia del agente*.

### El circuito se cierra sin servicios externos

La API de Meta no acepta subir el binario de la imagen: exige una **URL pública**. Ese
era el hueco donde haría falta S3 o Cloudinary. No hace falta: los PNG viven en
`public/piezas/` y los sirve `pukadigital.com`, que ya está en Vercel.

```
content/piezas/2026-09.ts   →   render   →   public/piezas/2026-09/*.png
        (datos, en git)                        (servido por el propio sitio)
                                                        ↓
                                            Meta Graph API los consume por URL
```

---

## Fases

| Fase | Qué | Depende de |
|---|---|---|
| **1** | **Fábrica de estáticos** — datos → PNG en `public/piezas/` | nada |
| 2 | Un agente redacta las piezas del mes y abre el PR | fase 1 |
| 3 | Publicación a Facebook + Instagram por Graph API directa | app de Meta |
| 4 | TikTok | auditoría de 2-4 semanas, iniciar el trámite en paralelo |

Esta spec cubre **la fase 1**.

---

## Independencia del agente

La fase 1 **no contiene ningún LLM**. Es TypeScript puro: Satori, resvg, una plantilla
y un validador. Corre sin agente, sin clave de API y sin red. Si mañana no hay
presupuesto de tokens, `npm run piezas` sigue funcionando.

La dependencia aparece en la fase 2, cuando un agente redacta las piezas del mes. Ahí
el diseño impone una regla:

> **La tubería nunca llama a una API de modelo. El agente llama a la tubería.**

```
cualquier agente  →  escribe content/piezas/<mes>.ts
                  →  corre npm run piezas -- --check
                  →  abre el pull request
```

El contrato es **un archivo tipado y un comando**, no una integración. `validar.ts` es
el árbitro y no sabe qué modelo escribió el archivo: comprueba el tipo `Pieza[]`, las
nueve palabras del titular, los presupuestos de caracteres, el CTA en la última slide y
el tope de diez slides. Un agente que no cumple, falla en CI.

Consecuencia práctica: Claude Code, Gemini en Antigravity, Codex o una persona a mano
son intercambiables en la fase 2 sin tocar una línea de la fábrica. Es lo que permite
mover el trabajo a donde haya presupuesto ese mes.

### Instrucciones portables

Dos capas, cada regla con un solo dueño:

| Archivo | Qué lleva | Quién lo lee |
|---|---|---|
| `AGENTS.md` | las reglas del proyecto | Antigravity (desde v1.20.3, 5-mar-2026), Cursor, Codex y 30+ agentes, de forma nativa |
| `CLAUDE.md` | `@AGENTS.md` + el método de Claude Code (skills, spec→plan, verificación) | solo Claude Code |

El puente es un import `@AGENTS.md` en la primera línea de `CLAUDE.md`, **no un
symlink**: el symlink obliga a que los dos archivos sean idénticos, mientras que el
import deja `CLAUDE.md` como archivo real al que se le añade encima la capa específica.
Es también lo que funciona en Windows sin permisos de administrador.

Nunca se copia contenido de un archivo al otro. Duplicar deriva en una semana.

**Verificado el 2026-09-01** en una sesión limpia de Claude Code: las reglas de
`AGENTS.md` llegan completas y **una sola vez**, sin duplicar contexto. Llegan como
bloque hermano etiquetado con su propia ruta, no embebidas dentro del texto de
`CLAUDE.md`. Queda sin determinar si las produce el import o una lectura nativa del
harness —ambas darían la misma presentación—; para saberlo habría que quitar la línea
`@AGENTS.md` y abrir otra sesión limpia. El resultado observable es el mismo, así que
la línea se queda: es el puente documentado y cuesta un renglón.

⚠️ **Antigravity topa cada archivo de reglas en 12.000 caracteres.** `AGENTS.md` son
10.696: quedan ~1.300 de margen. Si aprieta, se sacan secciones a `@docs/...`, que
`AGENTS.md` soporta inlinear. **No está confirmado si el tope cuenta el contenido
inlineado o solo el archivo raíz** — hay que medirlo con Antigravity abierto, no
asumirlo.

⚠️ **La convención no es estándar.** La spec oficial de `agents.md` no dice nada sobre
convivir con archivos por herramienta: no hay guía de symlinks ni de imports. Lo de
arriba es consenso de comunidad. Lo que la spec sí define es el anidamiento —un
`AGENTS.md` por subdirectorio, gana el más cercano—, útil si `content/piezas/` acaba
necesitando reglas propias de redacción.

### Lo que no se vuelve portable

Los skills de Claude Code que se usaron para producir esta spec —brainstorming,
writing-plans— no existen en Antigravity, que tiene su propio sistema de reglas y
skills. **Las reglas del proyecto se vuelven portables; el método de trabajo no.** En
otro agente hay que dar ese contexto a mano o traducir los skills a su formato.

---

## Motor de render: Satori

`satori` (JSX → SVG) + `@resvg/resvg-js` (SVG → PNG). Sin navegador.

Se evaluó Puppeteer, que permitiría reusar literalmente el CSS del sitio. Se descarta:
descarga ~170 MB de Chromium en cada `npm install`, lo que ralentiza todos los deploys
de `pukadigital.com`, tarda ~1-2 s por imagen y no corre en una función serverless
estándar. Satori resuelve en ~50 ms y pesa ~2 MB.

**Lo que Satori sí soporta**, verificado contra el README oficial de `vercel/satori` y
no contra blogs de terceros —que afirman lo contrario y están desactualizados—:
`backdrop-filter` encadenado (`blur`, `brightness`, `drop-shadow`…), `box-shadow`,
`text-shadow` y `radial-gradient`. Es decir, Dark Glass Rojo entero.

**Lo que no soporta:** CSS Grid —el motor de layout es Flexbox, el mismo de React
Native— y pseudo-elementos `::before` / `::after`. Los layouts se escriben en Flexbox.

### Las fuentes: la trampa

**Satori no lee `woff2`.** Acepta `ttf`, `otf` y `woff`. Las tres fuentes de marca hoy
solo existen como `woff2` dentro de `.next/`, generadas por `next/font/google`, y no son
utilizables.

Hay que vendorizar los `.ttf` en `assets/fonts/` —no en `public/`, que los serviría al
mundo sin motivo— y cargarlos con `fs.readFileSync`. Cada peso es una entrada
independiente en Satori:

| Fuente | Peso | Uso |
|---|---|---|
| Bricolage Grotesque | 800 | titulares |
| Instrument Sans | 400 | bajadas |
| Instrument Sans | 600 | badges, CTA |
| JetBrains Mono | 500 | precios, fechas, cifras |

Nota para la fase 3: si el render se envuelve en una ruta de Next desplegada en Vercel,
estos archivos hay que incluirlos explícitamente en el bundle de la función.

---

## Modelo de datos

```typescript
type Formato = '4x5' | '1x1' | '9x16';
type Sistema = 'puka' | 'health';

type Slide = {
  badge?: string;                              // 'SRI' · 'POS · INVENTARIO'
  titular: string;                             // máximo 9 palabras
  bajada?: string;
  dato?: { valor: string; etiqueta: string };  // se renderiza en JetBrains Mono
  cta?: string;                                // solo en la última slide
};

type Pieza = {
  id: string;                                  // 'sri-errores-01' → nombre de archivo
  sistema: Sistema;
  formatos?: Formato[];                        // por defecto, según nº de slides
  slides: Slide[];                             // 1 = pieza suelta · 2+ = carrusel
};
```

Un archivo por mes: `content/piezas/2026-09.ts` exporta `Pieza[]`.

**Regla de formatos por defecto**, aplicada por el render y no escrita a mano:

- 1 slide → los tres formatos.
- 2+ slides (carrusel) → solo `4x5`. Un carrusel no es una historia; generar 9:16 de
  cada slide produce archivos que nadie usa.

`formatos` explícito sobrescribe la regla.

**Salida:** `public/piezas/<mes>/<id>-<n>-<formato>.png`, con `<n>` empezando en 1.
Una pieza de una sola slide también lleva el `-1`, para que el nombre sea uniforme y
predecible desde código.

---

## Los dos sistemas visuales

Doctrina en `docs/COMMUNITY_MANAGEMENT.md`. Dark Glass Rojo es el kit **de la cuenta**;
un producto con sistema aprobado manda sobre él. Hoy el único es PukaHealth.

```typescript
sistemas.puka = {
  fondo:  '#080808',   tinta:  '#FFFFFF',
  acento: '#C7171E',   apoyo:  'rgba(255,255,255,0.60)',
  glass:  'rgba(255,255,255,0.04)',
  borde:  'rgba(255,255,255,0.08)',
  pegaso: true,
}

sistemas.health = {
  fondo:  '#FFFFFF',   tinta:  '#0F172B',
  acento: '#2563EB',   apoyo:  '#45556C',
  suave:  '#EFF6FF',
  glass:  null,        // prohibido: sin glassmorphism, sin fondos oscuros
  pegaso: false,
}
```

**El azul de PukaHealth es `#2563EB`.** La spec de la landing
(`2026-03-25-pukahealth-landing-design.md`) usa `#0ea5e9`; el sistema de piezas usa el
azul del logo, que manda. Esta spec no modifica la landing — quedan dos azules en el
producto y resolverlo es trabajo aparte.

**El rojo `#C7171E` en el sistema `health`** aparece únicamente en el punto de 8 px de
la firma «por PukaDigital» del pie. Nunca en titulares, botones ni fondos. Esto lo
codifica la plantilla; no queda a criterio de quien escribe los datos.

**El pegaso** se dibuja solo si `sistema.pegaso`. En `health` va el logo de PukaHealth.

La plantilla no conoce colores: recibe un objeto de sistema y lee tokens. Añadir un
tercer producto con ambiente propio es un objeto nuevo en `sistemas.ts` y cero cambios
en la plantilla.

---

## Formatos y reglas duras

| Formato | Medida | Margen | Zona segura extra |
|---|---|---|---|
| `4x5` | 1080 × 1350 | 88 | — |
| `1x1` | 1080 × 1080 | 88 | — |
| `9x16` | 1080 × 1920 | 88 | 250 px arriba, 320 abajo (UI de Instagram) |

El margen **no es un parámetro configurable**. Es la falla más repetida en las entregas
manuales y la única forma de eliminarla es que el sistema no permita expresarla.

### Validación: falla, no encoge

Antes de renderizar, cada pieza pasa por una función pura de validación. Si algo no
cumple, el proceso **aborta con un error que nombra la pieza, la slide y el campo**.
Nunca reduce el cuerpo de letra ni recorta texto para que quepa.

Reglas:

1. `titular` — máximo 9 palabras. Ya está en la doctrina: si no cabe grande, está mal
   escrito.
2. Presupuesto de caracteres por slot. Es un límite conservador sobre el ancho útil
   (1080 − 176 = 904 px), no una medición tipográfica: se prefiere un tope explícito y
   algo estrecho a una medición frágil. Valores de arranque, a confirmar a ojo contra
   el juego de muestra:

   | Slot | Máximo |
   |---|---|
   | `titular` | 60 caracteres |
   | `bajada` | 140 |
   | `badge` | 24 |
   | `dato.valor` | 8 |
   | `dato.etiqueta` | 16 |
   | `cta` | 24 |

   En `9x16` el `titular` baja a 48, porque la zona segura come 570 px de alto.
3. `cta` solo en la última slide de la pieza.
4. `id` único dentro del mes, y en kebab-case.
5. Máximo 10 slides por pieza — el tope de carrusel de Instagram.

La validación vive separada del render y no depende de Satori, para poder ejercitarla
sin generar imágenes.

---

## Estructura de archivos

```
lib/piezas/
  tipos.ts        Pieza, Slide, Formato, Sistema
  sistemas.ts     los dos objetos de tokens
  formatos.ts     medidas, márgenes, zonas seguras, regla de formatos por defecto
  fuentes.ts      carga los .ttf y arma el array de fuentes de Satori
  validar.ts      función pura: Pieza[] → Error[]
  plantilla.tsx   la plantilla paramétrica (Flexbox)
  render.ts       Pieza → PNG[]  (satori + resvg)
assets/fonts/     los .ttf vendorizados
content/piezas/
  2026-09.ts      las piezas del mes
public/piezas/    la salida, versionada
scripts/piezas.ts CLI
```

Dependencias nuevas: `satori`, `@resvg/resvg-js` y `tsx` (dev, para correr el script).

---

## Interfaz de línea de comandos

```bash
npm run piezas                      # renderiza el mes en curso
npm run piezas -- --mes 2026-09     # un mes concreto
npm run piezas -- --id sri-errores-01
npm run piezas -- --check           # solo valida, no escribe nada
```

`--check` es lo que corre en CI sobre el pull request: el PR falla si una pieza no
cumple las reglas, antes de que nadie mire un PNG.

---

## Verificación

El repositorio no tiene runner de tests, y añadir uno queda fuera de alcance.

- `validar.ts` es una función pura sin dependencias: se ejercita desde `--check` con un
  archivo de piezas deliberadamente inválidas.
- Se genera un juego de muestra de **6 combinaciones** —dos sistemas × tres formatos—
  más un carrusel de 4 slides, y se revisa a ojo una vez contra la doctrina: márgenes,
  color, firma, pegaso.
- Criterio de aceptación de la fase: una pieza real del calendario de septiembre sale
  por el comando, en los tres formatos, sin retoque manual.

---

## Fuera de alcance

Generación de texto por LLM, publicación a las redes, editor visual, video, variantes
A/B, y analítica por pieza. Todo eso engancha con la salida de esta fase, que son PNG
en disco.

---

## Bloqueos y riesgos conocidos

1. **El SVG del logo de PukaHealth no está en el repositorio.** Lo entrega Luis por
   WhatsApp. Sin él, el sistema `health` renderiza con un hueco marcado y visible. No
   detiene la fase 1: el día que el archivo caiga en `assets/`, `health` queda completo.
2. **Los PNG en `public/` son públicos desde el merge**, incluso antes de publicarse en
   la red. Se acepta: son piezas destinadas a ser públicas en días, y esa exposición es
   justamente lo que permite que la Graph API las consuma por URL.
3. **Los dos azules de PukaHealth** (`#0ea5e9` en la landing, `#2563EB` en las piezas)
   quedan sin unificar. Fuera de alcance, anotado.
4. **La auditoría de TikTok tarda 2-4 semanas.** No bloquea esta fase, pero el trámite
   conviene iniciarlo ya, en paralelo, porque el reloj corre solo.
