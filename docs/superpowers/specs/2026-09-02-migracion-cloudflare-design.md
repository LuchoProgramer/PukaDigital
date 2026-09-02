# Migración de Vercel a Cloudflare Workers

**Fecha:** 2026-09-02
**Estado:** spec aprobada, pendiente de plan de implementación

Mover `pukadigital.com` de Vercel Hobby a Cloudflare Workers con
`@opennextjs/cloudflare`, incluido el cron que publica en Instagram y la barrera
de CI que hoy da el `prebuild` de Vercel.

---

## Por qué

Dos razones, y la segunda es la que aprieta.

**El plan Hobby de Vercel es solo para uso no comercial**, y `pukadigital.com` es
el sitio de una LLC que vende SaaS. Está fuera de los términos. No es urgente
hoy, pero es la clase de cosa que se hace visible el día que la aplican, y ese
día se cae el sitio entero, no solo el cron.

**Y Hobby no da la precisión que el cron necesita.** Vercel documenta para Hobby
una precisión «per-hour (±59 min)»: un cron `0 23 * * *` se dispara en cualquier
momento entre las 23:00 y las 23:59. Por eso `VENTANA_MINUTOS` está hoy en 90 y
no en 60. Los Cron Triggers de Cloudflare son precisos al minuto.

Subir a Vercel Pro son $20/mes y arregla ambas. Cloudflare cuesta **cero
marginal**: ya se paga Workers Paid porque el bundle de PukaHealth pasó los 3 MB
del plan gratuito.

---

## Lo que ya está a favor

Verificado el 2026-09-02, no supuesto:

| Hecho | Consecuencia |
|---|---|
| `salud-frontend` corre **Next `^16.1.6`** sobre `@opennextjs/cloudflare ^1` y `wrangler ^4`, en producción | El adaptador con Next 16 no es una apuesta: ya está funcionando |
| Este repo está en **Next 16.0.7** | Misma major que el que ya funciona |
| **Cero dependencias `@vercel/*`** en `package.json` | Lo único atado a Vercel es `vercel.json` y el `maxDuration` de una ruta |
| Las imágenes remotas ya salen de **Cloudinary**, no del optimizador de Vercel | No hay migración de imágenes que hacer |
| **No hay `middleware.ts`** | Una fuente clásica de fricción que aquí no existe |
| El DNS de `pukadigital.com` **ya está en Cloudflare** (`virginia`/`sonny.ns.cloudflare.com`), apuntando a `216.198.79.1` de Vercel | El cutover es cambiar un registro dentro de Cloudflare. No hay migración de nameservers y la vuelta atrás son minutos |
| Satori y `@resvg/resvg-js` **no son alcanzables desde `app/`**: la única referencia es `import type { Pieza }` en la ruta del cron, y `lib/piezas/tipos.ts` no tiene ni un `import` ni un solo export en tiempo de ejecución | Las dependencias nativas se quedan en el CLI local. Un `import type` se borra al compilar, así que no llega nada al Worker |

---

## Alcance

### Se mueve

La aplicación completa: **28 `page.tsx` y 7 rutas de API** (`analytics`,
`cms-proxy`, `generate-blog`, `indexnow`, `indexnow/batch`, `send-lead`,
`cron/publicar`).

### No se mueve

**La fábrica de piezas.** `lib/piezas/` sigue siendo un CLI que se corre en
local: usa Satori y `@resvg/resvg-js`, que es un binding nativo de Rust y no
existe en el runtime de Workers. Los PNG se siguen generando en la máquina y
versionando en `public/piezas/`.

`public/` son **5,0 MB en 69 archivos** (44 de ellos piezas). Van como *static
assets* de Workers, que **no cuentan contra el límite de bundle del Worker**.

Los límites documentados en el plan Paid son **100.000 archivos por versión** y
**25 MiB por archivo**, y las peticiones a static assets son «free and
unlimited», sin coste de almacenamiento. A 35 piezas al mes, el techo de
archivos queda a más de dos siglos.

### Desaparece

`vercel.json`, el proyecto de Vercel y `export const maxDuration = 300` — que es
una directiva de Vercel y en Cloudflare no significa nada.

---

## Arquitectura

### El cron: un cerebro, dos puertas

Cloudflare no dispara rutas HTTP. Invoca un handler `scheduled()` del Worker.

Hoy `app/api/cron/publicar/route.ts` mezcla dos cosas: la puerta HTTP
(autenticación y serialización) y la orquestación (resolver el mes, leer los
captions recientes, el bucle de publicación y el reparto entre publicadas y
fallidas). **Esa orquestación no está cubierta por ningún test** — los 71 tests
actuales cubren `pendientes`, `yaPublicada` y `publicarPieza`, que están por
debajo.

Se extrae a un módulo propio:

```ts
// lib/publicar/tanda.ts
export type Resultado = {
  mes: string;
  revisadas: number;
  publicadas: Array<{ id: string; mediaId: string }>;
  fallidas: Array<{ id: string; error: string }>;
};

export async function publicarLoQueToca(opciones: {
  igUserId: string;
  token: string;
  ahora: Date;
  fetchImpl?: typeof fetch;
}): Promise<Resultado>;
```

`ahora` y `fetchImpl` entran por parámetro precisamente para poder probar la
orquestación sin reloj real y sin red.

Dos llamadores:

- **`scheduled()`**, en el entry propio del Worker. Es el camino automático.
- **La ruta HTTP**, que sobrevive. Comprueba el `Bearer ${CRON_SECRET}`, llama a
  la función y serializa el resultado. Es el disparo manual, y es el plan B
  cuando el cron no publica y hay que entender por qué.

Un solo cerebro, dos puertas: no pueden divergir.

### El registro estático de meses

Hoy, en `app/api/cron/publicar/route.ts:45`:

```ts
piezas = (await import(`@/content/piezas/${mes}`)).default;
```

Un import dinámico con plantilla. En Node se resuelve en caliente; el bundle de
un Worker es estático. Es la clase de fallo que **compila, despliega y luego
responde «No hay piezas para este mes» todos los meses, sin error** — porque el
`catch` que envuelve ese import trata la ausencia de archivo como un mes sin
calendario, que es lo correcto para el caso legítimo y desastroso para este.

Se sustituye por un registro explícito:

```ts
// content/piezas/index.ts
import septiembre from './2026-09.ts';
import type { Pieza } from '../../lib/piezas/tipos.ts';

/** Los meses con calendario escrito. Añadir uno nuevo es añadirlo aquí. */
export const MESES: Record<string, Pieza[]> = {
  '2026-09': septiembre,
};
```

Y la búsqueda pasa a ser `MESES[mes] ?? null`.

**Esto es mejor también en Vercel**, con independencia de la migración: lo
comprueba el compilador, y olvidarse de registrar octubre se ve en el diff en
lugar de convertirse en un mes de silencio.

### Configuración de Cloudflare

`wrangler.jsonc` en la raíz, calcado del de `salud-frontend`:

- `main`: `.open-next/worker.js`
- `compatibility_flags`: `nodejs_compat`
- `assets`: binding `ASSETS`, directorio `.open-next/assets`
- `images`: binding `IMAGES` — **7 archivos usan `next/image`**
- `observability`: activada
- `triggers.crons`: `["0 14 * * *", "0 23 * * *"]` (UTC, como hoy)
- `routes`: `pukadigital.com` y `www.pukadigital.com` como `custom_domain`,
  **solo en el último paso del cutover**

**Sin bucket R2 de caché incremental de entrada.** `salud-frontend` lo usa, pero
aquí son 28 páginas casi todas estáticas o de cliente.

El precio de no ponerlo no es cero, y conviene decirlo: hay **tres
`next: { revalidate: 300 }`** en el código (`lib/cms.ts:40` y `:106`,
`app/api/cms-proxy/route.ts:33`). Sin caché incremental persistente, esas
cachés de cinco minutos no sobreviven entre invocaciones y el CMS recibe más
peticiones. Para el tráfico de este sitio es asumible, y añadir R2 después es
un binding y un redespliegue. Se empieza sin él.

Los scripts siguen el patrón que ya funciona:

```json
"build:cloudflare": "opennextjs-cloudflare build",
"preview": "opennextjs-cloudflare build && wrangler dev",
"deploy": "opennextjs-cloudflare build && wrangler deploy"
```

### Secretos y variables

Inventario completo, sacado de `grep -rho "process\.env\.[A-Z_0-9]*" app lib components`
— **seis secretos, no cinco**:

| Variable | Dónde | Para qué |
|---|---|---|
| `GA_API_SECRET` | `app/api/analytics/route.ts` | Measurement Protocol de GA |
| `RESEND_API_KEY` | `app/api/send-lead/route.ts` | Envío de leads |
| `API_KEY` | `lib/genai.ts:4` | **Gemini.** El nombre es genérico de más y no dice qué abre |
| `CRON_SECRET` | `app/api/cron/publicar/route.ts` | Autoriza el disparo manual |
| `IG_USER_ID` | íd. | Cuenta de Instagram. No es secreto, pero viaja con los otros |
| `IG_ACCESS_TOKEN` | íd. | Token de Meta |

⚠️ **Los introduce el operador.** Claude no maneja tokens ni claves, ni aunque se
le pidan. Se cargan en el panel de Cloudflare o con `wrangler secret put`.

Las tres `NEXT_PUBLIC_*` (`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CMS_URL`,
`NEXT_PUBLIC_CMS_TENANT_ID`) **no son secretos y se inlinean en el build**, así
que tienen que existir como variables de entorno en Workers Builds o el bundle
saldrá con los valores por defecto del código.

`NODE_ENV` lo pone el runtime. `VERCEL_URL` se trata abajo.

### Limpieza que la mudanza obliga a hacer

Dos restos que hoy no molestan y en Cloudflare serían mentira:

**`process.env.VERCEL_URL` en `lib/cms.ts:15`.** Vive dentro de
`HybridCMSService.getBaseUrl()`, un método privado que **no se llama desde
ningún sitio** — verificado: la única aparición de `getBaseUrl` en el archivo es
su propia declaración. Es código muerto, no un fallo latente: en el servidor,
`getAllPosts()` va directo a `CMS_URL`. Se borra el método entero. Dejarlo sería
peor que borrarlo, porque en Workers `VERCEL_URL` es `undefined` y la rama viva
devolvería `http://localhost:3000`.

**`satori` y `@resvg/resvg-js` están en `dependencies`, no en
`devDependencies`.** Solo los usa el CLI local de la fábrica. `@resvg/resvg-js`
es un binding nativo de Rust: tenerlo como dependencia de producción es
engañoso y una invitación a que el bundler o el instalador de Workers Builds
tropiecen con él. Se mueven a `devDependencies`.

### La barrera de CI

GitHub Actions **está muerto para esta cuenta**: existe `.github/workflows/piezas.yml`,
pero cada ejecución falla en 2-4 segundos sin producir log — es el bloqueo por
facturación a nivel de cuenta, y **ser un repositorio público no lo salva**.

Hoy la única barrera automática es que Vercel construye cada PR y ahí dispara el
hook `prebuild`:

```
npm run piezas -- --check && npm test && tsc --noEmit
```

Se sustituye por **Workers Builds** conectado al repositorio: construye en cada
PR y en cada push a `main`. Como el build es `npm run build`, el hook `prebuild`
se dispara solo. Misma barrera, mismo momento, en la plataforma que ya se paga.

El workflow de GitHub se deja donde está: no estorba, y el día que se desbloquee
la cuenta vuelve solo.

---

## Cutover

En paralelo, y **el cron al final**. El calendario de septiembre está vivo:
piezas el 2, 3, 8, 10, 15, 17 y 22.

1. **Worker desplegado en `*.workers.dev`.** Sin dominio propio y **sin
   `triggers.crons`**. Vercel sigue sirviendo producción, intacto.
2. **Verificación del sitio.** Las 28 páginas y las 6 rutas que no son el cron,
   comparadas contra producción.
3. **Workers Builds conectado.** Vuelve la barrera por PR.
4. **Esperar un hueco entre publicaciones.** No se toca el cron el día que hay
   pieza.
5. **El cron, en un solo movimiento:** se añade `triggers.crons` al
   `wrangler.jsonc` y se quitan los `crons` de `vercel.json` en el mismo cambio.
   ⚠️ **Nunca dos crons armados a la vez**: dos plataformas disparando sobre la
   misma cuenta de Instagram es la receta para publicar dos veces. La defensa por
   captions existe, pero no se apoya una migración en ella.

   Dos precisiones de orden, porque este paso ocurre **antes** del cambio de DNS:

   - Quitar los crons de `vercel.json` **no surte efecto hasta que Vercel
     redespliega**. El movimiento no está completo cuando se mergea el PR, sino
     cuando ese deploy termina. Hasta entonces, no armar el trigger de
     Cloudflare.
   - El Worker publica sin tener aún el dominio, y eso está bien: `meta.ts`
     construye las URL de las imágenes contra `https://pukadigital.com`, que en
     ese momento sigue sirviendo Vercel. La URL de la imagen es absoluta y
     estable, así que el cron funciona igual antes y después del paso 6.
6. **DNS.** Se cambia el registro dentro de Cloudflare para que
   `pukadigital.com` resuelva al Worker. **La vuelta atrás es cambiarlo de
   nuevo**, y son minutos.
7. **Borrar el proyecto de Vercel**, una semana limpia después. No antes: hasta
   entonces es la red de seguridad.

---

## Verificación

**De la orquestación.** `publicarLoQueToca` con `fetchImpl` y `ahora`
inyectados: primera cobertura de la lógica que hoy vive en la ruta. Casos
mínimos: un mes sin registro devuelve `revisadas: 0` sin fallar; una pieza que
falla no impide las demás; el resultado reparte publicadas y fallidas.

**Del registro de meses.** Un test que comprueba que cada clave de `MESES`
coincide con el `publicarEl` de sus piezas — un `'2026-09'` que contenga piezas
de octubre es un fallo silencioso que solo se ve en producción.

**De la barrera.** `prebuild` sigue corriendo `piezas --check`, los tests y
`tsc`. Si Workers Builds no lo dispara, el paso 3 del cutover no está hecho.

**Del camino de publicación, antes de armar el trigger.** El operador llama la
ruta HTTP con el `CRON_SECRET` contra el Worker desplegado, **fuera de toda
ventana de publicación**. Debe responder que revisó las piezas y no publicó
ninguna. Eso prueba la autenticación, el registro de meses, la lectura del
perfil de Instagram y los límites del Worker — sin publicar nada.

**De las páginas.** Comparar con `curl` el JSON-LD de las rutas de producto
entre Vercel y el Worker:

```bash
curl -s https://<worker>.workers.dev/<ruta> | grep 'application/ld+json'
```

Esta comprobación ya cazó una regresión real en este repositorio: el schema
inyectado desde el cliente no aparecía en el HTML servido, y se perdieron 46
preguntas de FAQ en 6 páginas. Se hace contra el HTML servido, nunca contra el
navegador.

---

## Riesgos abiertos

**El carrusel dentro de un Worker — riesgo rebajado tras contar bien.** En la
primera redacción de esta spec dije «6 llamadas» y cité límites de memoria. Los
números reales, contados sobre `lib/publicar/meta.ts` y verificados contra la
documentación de Cloudflare:

| | Cuánto |
|---|---|
| Llamadas fijas por pieza de 5 slides | **7** (5 hijos + 1 padre + 1 `media_publish`) |
| Sondeo del contenedor | 1 a 30 más, con 2 s de espera (`INTENTOS = 30`) |
| Lectura de captions | 1 por ejecución del cron, no por pieza |
| **Peor caso por ejecución** | **~38 subpeticiones y ~65 s de reloj** |

Contra los límites del plan Paid para un cron de intervalo ≥ 1 hora —el nuestro
es diario—: **10.000 subpeticiones**, **15 min de CPU** y **15 min de reloj**. No
es que quepa: sobra por dos órdenes de magnitud. Y la espera del sondeo es E/S,
que no cuenta como CPU.

Así que **los límites dejan de ser el riesgo**. Lo que sigue sin probarse es el
comportamiento del runtime —`nodejs_compat`, el `fetch` de OpenNext, el camino
entero de punta a punta—, y eso es exactamente lo que verifica el paso previo a
armar el trigger.

**El bundle.** Los candidatos a pesar son `@google/genai` (lo arrastra
`generate-blog`), `recharts` y `react-markdown` con `remark-gfm` y `rehype-raw`.
El techo es 10 MB comprimidos en Paid. Si se pasa, el primer sitio donde mirar
es `generate-blog`, que es la ruta con más superficie de dependencias y la de
uso menos frecuente.

**Next 16.0.7 aquí contra 16.1.6 en `salud-frontend`.** Misma major, distinta
minor. Riesgo bajo, pero es la diferencia entre «ya funciona» y «funciona algo
muy parecido».

---

## Fuera de alcance

- **Publicar en Facebook.** Hoy solo se publica en Instagram; el endpoint de
  página es otro y no está escrito. Es trabajo aparte.
- **Bajar `VENTANA_MINUTOS` de 90 a 60.** Cloudflare da precisión al minuto y
  técnicamente sobra el margen, pero 90 no hace daño y tocarlo durante la
  migración añade una variable. Se revisa después, con el comentario de la
  constante actualizado.
- **Mover la fábrica de piezas a la nube.** Sigue siendo local y así se queda.
- **Rediseño o cambios de contenido.** Esto es una mudanza: al final debe
  servirse lo mismo que hoy.

---

## Decisiones descartadas

**Subir el sitio al VPS propio.** Descartada. El Hetzner CX33 corre a la vez
PukaHealth —el sistema de historias clínicas de una clienta— y LedgerXpertz,
compartiendo nginx, red Docker y disco. `next build` necesita 1-2 GB de RAM y
clava la CPU: construir ahí arriesga un OOM que se lleve por delante un sistema
clínico en producción, y construir fuera añade piezas móviles. Además pondría un
sitio de marketing en el mismo radio de explosión que las dos cosas que facturan.

**Vercel Pro a $20/mes.** Es la opción de menos trabajo y sigue siendo válida si
la migración se atasca. Se descarta ahora por coste: Cloudflare es cero
marginal.

**`scheduled()` llamando a la ruta por HTTP.** Sería el cambio más pequeño, pero
añade un salto de red contra uno mismo y mantiene el `CRON_SECRET` en juego para
una llamada interna. Extraer la función cuesta poco más y de paso cubre con tests
una lógica que hoy no los tiene.

**Borrar la ruta HTTP y dejar solo `scheduled()`.** Menos superficie expuesta,
pero se pierde el disparo manual — que es justo el plan B cuando el cron no
publica.
