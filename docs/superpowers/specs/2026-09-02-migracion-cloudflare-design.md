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
| Satori y `@resvg/resvg-js` **no son alcanzables desde `app/`** | Las dependencias nativas se quedan en el CLI local y no tocan el Worker |

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
assets* de Workers, que **no cuentan contra el límite de bundle del Worker**. Los
límites ahí son 20.000 archivos: a 35 piezas por mes, hay margen para décadas.

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
aquí son 28 páginas casi todas estáticas o de cliente. YAGNI: se añade si el
build lo pide, no antes.

Los scripts siguen el patrón que ya funciona:

```json
"build:cloudflare": "opennextjs-cloudflare build",
"preview": "opennextjs-cloudflare build && wrangler dev",
"deploy": "opennextjs-cloudflare build && wrangler deploy"
```

### Secretos y variables

Cinco secretos: `GA_API_SECRET`, `RESEND_API_KEY`, `CRON_SECRET`, `IG_USER_ID`,
`IG_ACCESS_TOKEN`.

⚠️ **Los introduce el operador.** Claude no maneja tokens ni claves, ni aunque se
le pidan. Se cargan en el panel de Cloudflare o con `wrangler secret put`.

Las `NEXT_PUBLIC_*` (`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CMS_URL`,
`NEXT_PUBLIC_CMS_TENANT_ID`) **no son secretos y se inlinean en el build**, así
que tienen que existir como variables de entorno en Workers Builds o el bundle
saldrá con los valores por defecto del código.

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

**El carrusel dentro de un Worker.** Publicar una pieza de 5 slides son 6
llamadas a Meta más el sondeo del contenedor, hasta 30 intentos con 2 segundos de
espera. El plan Paid da 30 s de CPU por invocación y 1.000 subpeticiones, y casi
todo el tiempo es espera de red, que no cuenta como CPU. **No está probado**, y
es exactamente lo que verifica el paso previo al armado del trigger. Si no
entrara, la salida es reducir `INTENTOS` y el intervalo de sondeo, que hoy son
generosos.

**Next 16.0.7 aquí contra 16.1.6 en `salud-frontend`.** Misma major, distinta
minor. Riesgo bajo, pero es la diferencia entre «ya funciona» y «funciona algo
muy parecido».

**`generate-blog` y el SDK de GenAI.** Es la ruta con más superficie de
dependencias y la que más puede pesar en el bundle. Si el Worker se pasa de los
10 MB comprimidos, es la primera candidata a mirar.

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
