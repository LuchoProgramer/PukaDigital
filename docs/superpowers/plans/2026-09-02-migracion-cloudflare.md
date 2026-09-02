# Migración a Cloudflare Workers — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mover `pukadigital.com` de Vercel Hobby a Cloudflare Workers sin perder ninguna publicación programada en Instagram ni la barrera de CI.

**Architecture:** La orquestación del cron sale de la ruta HTTP a un módulo propio (`lib/publicar/tanda.ts`) que llaman dos puertas: el handler `scheduled()` del Worker y la ruta HTTP, que sobrevive como disparo manual. El import dinámico con plantilla se sustituye por un registro estático de meses, porque el bundle de un Worker no resuelve especificadores en caliente. El cutover es en paralelo y el cron se mueve el último, en un hueco entre publicaciones.

**Tech Stack:** Next.js 16.0.7 · `@opennextjs/cloudflare` v1 · Wrangler 4 · `node:test` con `tsx`

**Spec:** `docs/superpowers/specs/2026-09-02-migracion-cloudflare-design.md`

---

## Antes de empezar: cómo se corre y se prueba esto

```bash
npm test                      # node --import tsx --test lib/*/*.test.ts
npx tsc --noEmit              # los tipos: tsx los quita sin mirarlos
npm run piezas -- --check     # valida las piezas sin escribir nada
npm run build                 # dispara prebuild = las tres de arriba
```

⚠️ **El glob de los tests es `lib/*/*.test.ts`.** Un test fuera de
`lib/<algo>/` **no se ejecuta y nadie se entera**. Por eso el test del registro
de meses vive en `lib/piezas/meses.test.ts` aunque lo que prueba esté en
`content/`.

⚠️ **`npm run lint` arrastra 180+ problemas preexistentes** en `proxy.ts`,
`types/index.ts` y scripts. No son tuyos. Los archivos de `app/` sí deben quedar
limpios.

⚠️ **Nunca manejes tokens ni claves.** Los pasos marcados **[OPERADOR]** los
ejecuta la persona, no el agente. Si un paso pide pegar un secreto, para y
pídelo.

---

## Estructura de archivos

| Archivo | Responsabilidad | Estado |
|---|---|---|
| `content/piezas/index.ts` | Registro estático mes → piezas. Única fuente de qué meses existen para el runtime | **Crear** |
| `lib/piezas/meses.test.ts` | Invariantes del registro: formato de clave, y que las piezas de un mes se publiquen en ese mes | **Crear** |
| `lib/publicar/tanda.ts` | Orquestación: resolver mes, leer captions, publicar lo que toca, repartir éxitos y fallos | **Crear** |
| `lib/publicar/tanda.test.ts` | Tests de la orquestación con reloj, red y calendario inyectados | **Crear** |
| `app/api/cron/publicar/route.ts` | Puerta HTTP: autentica, llama a `tanda`, serializa. Sin lógica | **Adelgazar** |
| `lib/cms.ts` | Se le borra `getBaseUrl()`, código muerto con `VERCEL_URL` | **Modificar** |
| `package.json` | `satori` y `@resvg/resvg-js` a `devDependencies`; scripts de Cloudflare | **Modificar** |
| `wrangler.jsonc` | Configuración del Worker | **Crear** |
| `worker.ts` | Entry propio: envuelve el handler de OpenNext y añade `scheduled()` | **Crear** |
| `vercel.json` | Se le quitan los crons en el paso 12, se borra en el 14 | **Modificar y borrar** |

---

# FASE A — Preparación

Todo lo de esta fase es verificable **hoy, en Vercel**, y mejora el código
aunque la migración se cancele. No toca Cloudflare.

---

### Task 1: Registro estático de meses

Sustituye `await import(\`@/content/piezas/${mes}\`)`, que en un Worker
compilaría y luego respondería «no hay piezas» todos los meses, sin error.

**Files:**
- Create: `content/piezas/index.ts`
- Create: `lib/piezas/meses.test.ts`

- [ ] **Step 1: Escribe el test que falla**

Crea `lib/piezas/meses.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MESES, piezasDe } from '../../content/piezas/index.ts';

test('cada clave del registro es un mes en formato YYYY-MM', () => {
  for (const mes of Object.keys(MESES)) {
    assert.match(mes, /^\d{4}-(0[1-9]|1[0-2])$/, `clave invalida: ${mes}`);
  }
});

test('las piezas de un mes se publican en ese mes', () => {
  // Un archivo '2026-09' con una pieza de octubre es un fallo que solo se ve
  // en produccion: el cron busca por mes y esa pieza no aparece jamas.
  for (const [mes, piezas] of Object.entries(MESES)) {
    for (const pieza of piezas) {
      if (!pieza.publicarEl) continue;
      assert.equal(
        pieza.publicarEl.slice(0, 7),
        mes,
        `${pieza.id} esta registrada en ${mes} pero se publica el ${pieza.publicarEl}`,
      );
    }
  }
});

test('un mes sin calendario escrito devuelve null, no revienta', () => {
  assert.equal(piezasDe('2027-01'), null);
});

test('septiembre de 2026 esta registrado', () => {
  const piezas = piezasDe('2026-09');
  assert.ok(piezas !== null && piezas.length > 0);
});
```

- [ ] **Step 2: Compruébalo fallando**

Run: `npm test 2>&1 | grep -A3 "meses"`
Expected: FAIL — `Cannot find module '../../content/piezas/index.ts'`

- [ ] **Step 3: Escribe el registro**

Crea `content/piezas/index.ts`:

```ts
import type { Pieza } from '../../lib/piezas/tipos.ts';
import septiembre from './2026-09.ts';

/**
 * Los meses con calendario escrito.
 *
 * ⚠️ **No sustituir por un import dinámico con plantilla.** El bundle de un
 * Worker de Cloudflare es estático: `await import(`./${mes}.ts`)` compila,
 * despliega y después responde «no hay piezas para este mes» todos los meses,
 * sin dar error — porque quien llama trata la ausencia como un mes sin escribir,
 * que es lo correcto para el caso legítimo y desastroso para este.
 *
 * Añadir un mes es añadirlo aquí a mano. Que sea manual es la gracia: se ve en
 * el diff, y `lib/piezas/meses.test.ts` comprueba que las piezas registradas en
 * un mes se publican en ese mes.
 */
export const MESES: Record<string, Pieza[]> = {
  '2026-09': septiembre,
};

/** Las piezas de un mes, o `null` si ese mes no tiene calendario escrito. */
export function piezasDe(mes: string): Pieza[] | null {
  return MESES[mes] ?? null;
}
```

- [ ] **Step 4: Compruébalo pasando**

Run: `npm test 2>&1 | tail -8`
Expected: PASS, y el total sube de 71 a 75 tests.

- [ ] **Step 5: Los tipos**

Run: `npx tsc --noEmit`
Expected: sin salida.

- [ ] **Step 6: Commit**

```bash
git add content/piezas/index.ts lib/piezas/meses.test.ts
git commit -m "feat(piezas): registro estatico de meses en vez de import dinamico"
```

---

### Task 2: Extraer la orquestación a `lib/publicar/tanda.ts`

Hoy la ruta mezcla la puerta HTTP con la orquestación, y **la orquestación no
tiene un solo test**. Se saca a un módulo con el reloj, la red y el calendario
inyectables.

⚠️ **`buscarMes` tiene que ser inyectable.** Sin eso, los tests dependerían del
calendario real de septiembre y se romperían solos en octubre.

**Files:**
- Create: `lib/publicar/tanda.ts`
- Create: `lib/publicar/tanda.test.ts`

- [ ] **Step 1: Escribe el test que falla**

Crea `lib/publicar/tanda.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicarLoQueToca, mesDe } from './tanda.ts';
import type { Pieza } from '../piezas/tipos.ts';

const pieza = (id: string, publicarEl: string): Pieza => ({
  id,
  sistema: 'puka',
  caption: `caption de ${id}`,
  publicarEl,
  formatos: ['4x5'],
  slides: [{ titular: 'Un titular corto' }],
});

function json(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Simula la Graph API. El verbo importa: consultar el contenedor es GET y el
 * resto POST — un falso fetch que ignore el metodo deja pasar el bug que ya
 * costo un despliegue roto.
 */
function falsoFetch(opciones: { captions?: string[]; falla?: string } = {}) {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    const metodo = init?.method ?? 'GET';
    llamadas.push(`${metodo} ${u.split('?')[0].split('/v21.0/')[1] ?? u}`);

    if (u.includes('/media?') && metodo === 'GET') {
      return json({ data: (opciones.captions ?? []).map((caption) => ({ caption })) });
    }
    if (u.endsWith('/media') && metodo === 'POST') {
      const cuerpo = String(init?.body ?? '');
      if (opciones.falla && cuerpo.includes(opciones.falla)) {
        return json({ error: { message: 'la imagen no es accesible' } }, 400);
      }
      return json({ id: 'contenedor-1' });
    }
    if (u.endsWith('/media_publish')) return json({ id: 'media-99' });
    if (metodo === 'GET') return json({ status_code: 'FINISHED' });
    throw new Error(`ruta no simulada: ${metodo} ${u}`);
  }) as typeof fetch;
  return { impl, llamadas };
}

const AHORA = new Date('2026-09-09T14:05:00Z'); // 09:05 de Ecuador

test('un mes sin calendario no falla y no toca la red', async () => {
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => null,
  });
  assert.deepEqual(r, { mes: '2026-09', revisadas: 0, publicadas: [], fallidas: [] });
  assert.deepEqual(llamadas, [], 'no debe consultar el perfil si no hay calendario');
});

test('publica la pieza que toca y devuelve su media id', async () => {
  const { impl } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => [pieza('toca', '2026-09-09T09:00')],
  });
  assert.equal(r.revisadas, 1);
  assert.deepEqual(r.publicadas, [{ id: 'toca', mediaId: 'media-99' }]);
  assert.deepEqual(r.fallidas, []);
});

test('una pieza que falla no impide las demas del mismo dia', async () => {
  const { impl } = falsoFetch({ falla: 'rota' });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => [
      pieza('rota', '2026-09-09T09:00'),
      pieza('buena', '2026-09-09T09:00'),
    ],
  });
  assert.deepEqual(r.publicadas.map((p) => p.id), ['buena']);
  assert.equal(r.fallidas.length, 1);
  assert.equal(r.fallidas[0].id, 'rota');
});

test('no republica lo que ya esta en el perfil', async () => {
  const { impl } = falsoFetch({ captions: ['caption de repetida'] });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => [pieza('repetida', '2026-09-09T09:00')],
  });
  assert.deepEqual(r.publicadas, []);
  assert.equal(r.revisadas, 1);
});

test('el mes se calcula en UTC', () => {
  assert.equal(mesDe(new Date('2026-09-30T23:00:00Z')), '2026-09');
  assert.equal(mesDe(new Date('2026-10-01T00:30:00Z')), '2026-10');
});
```

- [ ] **Step 2: Compruébalo fallando**

Run: `npm test 2>&1 | grep -c "^not ok\|Cannot find"`
Expected: FAIL — `Cannot find module './tanda.ts'`

- [ ] **Step 3: Escribe el módulo**

Crea `lib/publicar/tanda.ts`:

```ts
import { piezasDe } from '../../content/piezas/index.ts';
import { publicarPieza } from './meta.ts';
import { pendientes } from './programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

/** Cuántas publicaciones recientes se miran para no repetir una pieza. */
const RECIENTES = 25;

export type Resultado = {
  mes: string;
  revisadas: number;
  publicadas: Array<{ id: string; mediaId: string }>;
  fallidas: Array<{ id: string; error: string }>;
};

export type Opciones = {
  igUserId: string;
  token: string;
  /** El instante que se considera «ahora». Inyectable para poder probar. */
  ahora: Date;
  /** Inyectable para poder probar sin red. */
  fetchImpl?: typeof fetch;
  /**
   * De dónde salen las piezas de un mes. Inyectable porque si no, los tests
   * dependerían del calendario real y se romperían solos al cambiar de mes.
   */
  buscarMes?: (mes: string) => Pieza[] | null;
};

/** `2026-09`, en UTC. El cron de Cloudflare y el de Vercel disparan en UTC. */
export function mesDe(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
}

async function captionsRecientes(opciones: Opciones): Promise<string[]> {
  const hacer = opciones.fetchImpl ?? fetch;
  const params = new URLSearchParams({
    fields: 'caption',
    limit: String(RECIENTES),
    access_token: opciones.token,
  });
  const res = await hacer(`${GRAPH}/${opciones.igUserId}/media?${params}`);
  const cuerpo = (await res.json()) as {
    data?: Array<{ caption?: string }>;
    error?: { message: string };
  };
  if (cuerpo.error) throw new Error(`No se pudo leer el perfil: ${cuerpo.error.message}`);
  return (cuerpo.data ?? []).map((m) => m.caption ?? '').filter(Boolean);
}

/**
 * Publica las piezas que toquen ahora mismo.
 *
 * La llaman dos puertas —el `scheduled()` del Worker y la ruta HTTP— y no puede
 * saber cuál de las dos fue: todo lo que depende del entorno entra por
 * parámetro.
 */
export async function publicarLoQueToca(opciones: Opciones): Promise<Resultado> {
  const mes = mesDe(opciones.ahora);
  const buscar = opciones.buscarMes ?? piezasDe;
  const piezas = buscar(mes);

  // Un mes sin calendario escrito no es un error: es un mes sin escribir.
  // Se sale antes de consultar el perfil para no gastar una llamada de balde.
  if (piezas === null) return { mes, revisadas: 0, publicadas: [], fallidas: [] };

  const captions = await captionsRecientes(opciones);
  const toca = pendientes(piezas, opciones.ahora, captions);

  const publicadas: Resultado['publicadas'] = [];
  const fallidas: Resultado['fallidas'] = [];

  for (const pieza of toca) {
    try {
      const { id } = await publicarPieza(pieza, mes, {
        igUserId: opciones.igUserId,
        token: opciones.token,
        fetchImpl: opciones.fetchImpl,
      });
      publicadas.push({ id: pieza.id, mediaId: id });
    } catch (e) {
      // Una pieza que falla no debe impedir las demás del mismo día.
      fallidas.push({ id: pieza.id, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return { mes, revisadas: piezas.length, publicadas, fallidas };
}
```

- [ ] **Step 4: Compruébalo pasando**

Run: `npm test 2>&1 | tail -8`
Expected: PASS, 80 tests.

- [ ] **Step 5: Los tipos**

Run: `npx tsc --noEmit`
Expected: sin salida.

- [ ] **Step 6: Commit**

```bash
git add lib/publicar/tanda.ts lib/publicar/tanda.test.ts
git commit -m "feat(publicar): extraer la orquestacion del cron a tanda.ts"
```

---

### Task 3: Adelgazar la ruta HTTP

La ruta se queda con lo suyo: autenticar y serializar. Y pierde `maxDuration`,
que es una directiva de Vercel.

**Files:**
- Modify: `app/api/cron/publicar/route.ts` (se reescribe entero)

- [ ] **Step 1: Reescribe la ruta**

Sustituye **todo** el contenido de `app/api/cron/publicar/route.ts` por:

```ts
import { NextResponse } from 'next/server';
import { publicarLoQueToca } from '@/lib/publicar/tanda';

export const dynamic = 'force-dynamic';

/**
 * Disparo manual de la publicación. El camino automático es el `scheduled()`
 * del Worker; esta ruta existe para poder ejecutarla a mano cuando el cron no
 * publica y hay que entender por qué.
 *
 * Toda la lógica vive en `lib/publicar/tanda.ts`: aquí solo se autentica y se
 * serializa, para que las dos puertas no puedan divergir.
 */
export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get('authorization') !== `Bearer ${secreto}`) {
    return new NextResponse('No autorizado', { status: 401 });
  }

  const igUserId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !token) {
    return NextResponse.json({ error: 'Faltan IG_USER_ID o IG_ACCESS_TOKEN' }, { status: 500 });
  }

  const resultado = await publicarLoQueToca({ igUserId, token, ahora: new Date() });
  return NextResponse.json(resultado, {
    status: resultado.fallidas.length > 0 ? 500 : 200,
  });
}
```

- [ ] **Step 2: Comprueba que no queda nada del import dinámico**

Run: `grep -rn "await import(\`" app lib || echo "limpio"`
Expected: `limpio`

- [ ] **Step 3: Comprueba que no queda `maxDuration`**

Run: `grep -rn "maxDuration" app || echo "limpio"`
Expected: `limpio`

- [ ] **Step 4: Tests y tipos**

Run: `npm test 2>&1 | tail -5 && npx tsc --noEmit && echo TIPOS-OK`
Expected: 80 tests pasando y `TIPOS-OK`.

- [ ] **Step 5: Commit**

```bash
git add app/api/cron/publicar/route.ts
git commit -m "refactor(cron): la ruta pasa a ser puerta fina sobre tanda.ts"
```

---

### Task 4: Limpiar los restos de Vercel

**Files:**
- Modify: `lib/cms.ts` (borrar `getBaseUrl`)
- Modify: `package.json` (mover dos dependencias)

- [ ] **Step 1: Confirma que `getBaseUrl` no se llama desde ningún sitio**

Run: `grep -rn "getBaseUrl" app lib components`
Expected: **una sola línea**, la declaración en `lib/cms.ts`. Si aparece
cualquier otra, **para y avisa**: el método está vivo y borrarlo rompe algo.

- [ ] **Step 2: Borra el método**

En `lib/cms.ts`, elimina este bloque completo, comentario incluido:

```ts
  /**
   * Obtiene la URL base interna para peticiones del servidor o relativa para el cliente
   */
  private static getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return ''; // Relativa en el cliente: /api/cms-proxy
    }

    // En el servidor
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    return 'http://localhost:3000';
  }
```

- [ ] **Step 3: Comprueba que `VERCEL_URL` ya no aparece**

Run: `grep -rn "VERCEL_URL" app lib components || echo "limpio"`
Expected: `limpio`

- [ ] **Step 4: Mueve las dependencias nativas a `devDependencies`**

`satori` y `@resvg/resvg-js` solo los usa el CLI local de la fábrica.
`@resvg/resvg-js` es un binding nativo de Rust y no debe figurar como
dependencia de producción.

Run:
```bash
npm uninstall satori @resvg/resvg-js
npm install --save-dev satori@0.33.4 @resvg/resvg-js@2.6.2
```

- [ ] **Step 5: Comprueba que la fábrica sigue funcionando**

Run: `npm run piezas -- --check`
Expected: `7 pieza(s) validas en 2026-09.`

- [ ] **Step 6: Tests, tipos y build completo**

Run: `npm run build 2>&1 | tail -15`
Expected: el `prebuild` pasa (piezas, 80 tests, tipos) y el build de Next
termina sin error.

- [ ] **Step 7: Commit**

```bash
git add lib/cms.ts package.json package-lock.json
git commit -m "chore: borrar getBaseUrl muerto y sacar satori y resvg de produccion"
```

- [ ] **Step 8: Abre el PR de la fase A**

```bash
git push -u origin HEAD
gh pr create --title "refactor(cron): un cerebro y dos puertas, y registro estatico de meses" \
  --body "Fase A de la migracion a Cloudflare. No toca Cloudflare: todo esto mejora el codigo aunque la migracion se cancele.

- Registro estatico de meses: el import dinamico con plantilla no sobrevive a un bundle estatico.
- La orquestacion del cron sale de la ruta a lib/publicar/tanda.ts, con reloj, red y calendario inyectables. Primera cobertura de esa logica.
- La ruta queda como puerta fina. Fuera maxDuration, que es de Vercel.
- Borrado getBaseUrl, muerto y con VERCEL_URL dentro.
- satori y @resvg/resvg-js pasan a devDependencies."
```

**⚠️ No mergear sin que Vercel construya el PR en verde.** Es la barrera actual.

---

# FASE B — Cloudflare en paralelo

Vercel sigue sirviendo producción intacto durante toda esta fase.

---

### Task 5: Instalar el adaptador y los scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instala**

Run:
```bash
npm install --save-dev @opennextjs/cloudflare@^1 wrangler@^4
```

- [ ] **Step 2: Añade los scripts**

En `package.json`, dentro de `"scripts"`, añade estas tres entradas junto a las
que ya existen (no toques `build`, `prebuild` ni `test`):

```json
"build:cloudflare": "opennextjs-cloudflare build",
"preview:cloudflare": "opennextjs-cloudflare build && wrangler dev",
"deploy:cloudflare": "opennextjs-cloudflare build && wrangler deploy"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(cloudflare): adaptador de OpenNext y wrangler"
```

---

### Task 6: `wrangler.jsonc` sin dominio y sin crons

⚠️ **Sin `routes` y sin `triggers`.** El dominio llega en la Task 13 y el cron en
la 12. Un `triggers.crons` aquí armaría un segundo cron mientras Vercel todavía
tiene el suyo.

**Files:**
- Create: `wrangler.jsonc`

- [ ] **Step 1: Crea el archivo**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "pukadigital",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-09-02",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "binding": "ASSETS",
    "directory": ".open-next/assets"
  },
  // 7 archivos usan next/image; sin este binding no hay optimizacion en el edge.
  "images": {
    "binding": "IMAGES"
  },
  "observability": {
    "enabled": true
  }
  // Sin "routes": el dominio se conecta en el ultimo paso del cutover.
  // Sin "triggers": el cron se mueve cuando se quita el de Vercel, nunca antes.
}
```

- [ ] **Step 2: Ignora la salida del build de OpenNext**

Añade al final de `.gitignore`:

```
# OpenNext / Cloudflare
.open-next/
.wrangler/
```

- [ ] **Step 3: Construye para Cloudflare por primera vez**

Run: `npm run build:cloudflare 2>&1 | tail -30`
Expected: termina sin error y existe `.open-next/worker.js`.

Si falla, **el mensaje de error es el entregable de este paso**: anótalo y para.
Los sospechosos, por orden: `@google/genai` en `generate-blog`, y algún módulo de
Node sin equivalente bajo `nodejs_compat`.

- [ ] **Step 4: Mide el bundle contra el techo de 10 MB comprimidos**

Run: `du -sh .open-next/worker.js && gzip -c .open-next/worker.js | wc -c | awk '{print $1/1048576 " MB comprimido"}'`
Expected: por debajo de 10 MB comprimidos.

- [ ] **Step 5: Commit**

```bash
git add wrangler.jsonc .gitignore
git commit -m "feat(cloudflare): configuracion del worker, sin dominio ni crons"
```

---

### Task 7: Primer despliegue y secretos — **[OPERADOR]**

- [ ] **Step 1: [OPERADOR] Autentica wrangler**

```
! npx wrangler login
```

- [ ] **Step 2: Despliega a `workers.dev`**

Run: `npm run deploy:cloudflare 2>&1 | tail -20`
Expected: una URL `https://pukadigital.<subdominio>.workers.dev`. **Anótala**:
se usa en las tasks 8 y 11.

- [ ] **Step 3: [OPERADOR] Carga los seis secretos**

⚠️ **El agente no ejecuta este paso ni ve los valores.** Uno por uno:

```
! npx wrangler secret put GA_API_SECRET
! npx wrangler secret put RESEND_API_KEY
! npx wrangler secret put API_KEY
! npx wrangler secret put CRON_SECRET
! npx wrangler secret put IG_USER_ID
! npx wrangler secret put IG_ACCESS_TOKEN
```

`API_KEY` es la de Gemini — el nombre no lo dice y por eso se avisa aquí.

- [ ] **Step 4: [OPERADOR] Carga las tres variables públicas**

Estas **se inlinean en el build**, así que van como variables de entorno del
proyecto en el panel de Cloudflare (Workers → pukadigital → Settings →
Variables), no como secretos:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_CMS_URL`
- `NEXT_PUBLIC_CMS_TENANT_ID`

- [ ] **Step 5: Comprueba que están los seis secretos**

Run: `npx wrangler secret list`
Expected: los seis nombres. Los valores no se muestran, y así debe ser.

---

### Task 8: Verificar el sitio desplegado

Contra el Worker, **comparando con producción**. Sustituye `<WORKER>` por la URL
anotada en la Task 7.

**Files:** ninguno — es verificación.

- [ ] **Step 1: Las páginas responden 200**

Run:
```bash
for r in / /agencia /agentes-ia /ledgerxpertz /pukahealth /salud /desarrollo-web-pymes /blog; do
  printf "%-28s %s\n" "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://<WORKER>$r)"
done
```
Expected: `200` en las ocho.

- [ ] **Step 2: El JSON-LD está en el HTML servido**

⚠️ Contra el HTML servido, **nunca contra el navegador**. Esta comprobación ya
cazó una regresión real aquí: schema inyectado desde el cliente, invisible para
los crawlers, 46 preguntas de FAQ perdidas en 6 páginas.

Run:
```bash
for r in /agentes-ia /ledgerxpertz /pukahealth; do
  printf "%-16s worker:%s  vercel:%s\n" "$r" \
    "$(curl -s https://<WORKER>$r | grep -c 'application/ld+json')" \
    "$(curl -s https://pukadigital.com$r | grep -c 'application/ld+json')"
done
```
Expected: los dos números **iguales** en cada ruta.

- [ ] **Step 3: Los PNG de las piezas se sirven**

Run: `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://<WORKER>/piezas/2026-09/podologo-no-receta-1-4x5.png`
Expected: `200 image/png`

- [ ] **Step 4: El sitemap y los archivos de raíz**

Run:
```bash
for r in /sitemap.xml /robots.txt /llms.txt; do
  printf "%-14s %s\n" "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://<WORKER>$r)"
done
```
Expected: `200` en los tres.

- [ ] **Step 5: La ruta del cron está protegida**

Run: `curl -s -o /dev/null -w '%{http_code}\n' https://<WORKER>/api/cron/publicar`
Expected: `401`. Si sale `200`, **para**: la ruta está abierta.

- [ ] **Step 6: Anota lo que falle**

Si algo de los pasos 1-5 no cuadra, **para aquí**. No se sigue a la Task 9 con
el sitio a medias.

---

### Task 9: Workers Builds — **[OPERADOR]**

Recupera la barrera por PR que hoy da Vercel. GitHub Actions no sirve: está
bloqueado por facturación a nivel de cuenta y ser repo público no lo salva.

- [ ] **Step 1: [OPERADOR] Conecta el repositorio**

En el panel de Cloudflare: Workers & Pages → `pukadigital` → Settings → Builds →
Connect repository → `LuchoProgramer/PukaDigital`.

Configuración:
- Build command: `npm run build:cloudflare`
- Deploy command: `npx wrangler deploy`
- Branch de producción: `main`
- Builds de preview para pull requests: **activado**

- [ ] **Step 2: [OPERADOR] Repite las variables de entorno**

Los secretos del Worker no están disponibles durante el build. Las tres
`NEXT_PUBLIC_*` **sí** tienen que existir en la configuración de Builds, o el
bundle saldrá con los valores por defecto del código.

- [ ] **Step 3: Comprueba que el gate se dispara**

Abre un PR trivial (por ejemplo, una línea en un comentario) y mira el log del
build en Cloudflare.

Expected: en el log aparecen las tres etapas del `prebuild` — `piezas válidas`,
el recuento de tests y el paso de tipos — **antes** del build de Next. Si no
aparecen, `npm run build:cloudflare` no está disparando el hook y hay que
cambiar el build command a `npm run build && npm run build:cloudflare`.

- [ ] **Step 4: Cierra el PR de prueba**

---

# FASE C — El cron y el cutover

---

### Task 10: El handler `scheduled()`

**Files:**
- Create: `worker.ts`
- Modify: `wrangler.jsonc` (cambiar `main`)

- [ ] **Step 1: Averigua qué exporta el worker generado**

No lo adivines: la forma del export depende de la versión del adaptador.

Run:
```bash
grep -n "^export" .open-next/worker.js | head -20
cat node_modules/@opennextjs/cloudflare/README.md | grep -n -A25 -i "custom worker\|scheduled\|entrypoint" | head -60
```

Expected: el `export default` con `fetch`, y la lista de exports nombrados
(handlers de Durable Object, si los hay). **Anótalos**: el paso 2 tiene que
reexportarlos todos o Wrangler fallará al desplegar.

- [ ] **Step 2: Escribe el entry**

Crea `worker.ts` en la raíz. Sustituye la línea de reexport por los nombres
anotados en el paso 1 (si no hubiera ninguno, borra esa línea):

```ts
import handler from './.open-next/worker.js';
import { publicarLoQueToca } from './lib/publicar/tanda.ts';

// Reexportar lo que genere OpenNext ademas del default, o wrangler no despliega.
export * from './.open-next/worker.js';

export default {
  fetch: handler.fetch,

  /**
   * El camino automatico de la publicacion. Cloudflare no dispara rutas HTTP:
   * invoca esto. La ruta `/api/cron/publicar` llama a la misma funcion, asi que
   * las dos puertas no pueden divergir.
   *
   * Los errores se registran y no se relanzan: que una tanda falle no debe
   * marcar el Worker como caido.
   */
  async scheduled(_event: ScheduledController, env: Record<string, string>, ctx: ExecutionContext) {
    const igUserId = env.IG_USER_ID;
    const token = env.IG_ACCESS_TOKEN;
    if (!igUserId || !token) {
      console.error('cron: faltan IG_USER_ID o IG_ACCESS_TOKEN');
      return;
    }

    ctx.waitUntil(
      publicarLoQueToca({ igUserId, token, ahora: new Date() })
        .then((r) => {
          // Sin el token ni el caption: esto acaba en los logs.
          console.log(`cron ${r.mes}: revisadas ${r.revisadas}, publicadas ` +
            `${r.publicadas.map((p) => p.id).join(',') || 'ninguna'}, ` +
            `fallidas ${r.fallidas.map((f) => `${f.id} (${f.error})`).join(',') || 'ninguna'}`);
        })
        .catch((e) => console.error(`cron: ${e instanceof Error ? e.message : e}`)),
    );
  },
};
```

- [ ] **Step 3: Apunta `main` al entry propio**

En `wrangler.jsonc`, cambia:

```jsonc
"main": ".open-next/worker.js",
```

por:

```jsonc
"main": "worker.ts",
```

- [ ] **Step 4: Tipos y despliegue**

Run: `npx tsc --noEmit && npm run deploy:cloudflare 2>&1 | tail -20`
Expected: tipos limpios y despliegue correcto.

⚠️ Si `tsc` se queja de `ScheduledController` o `ExecutionContext`, faltan los
tipos de Workers. Arréglalo así y vuelve a probar:

```bash
npm install --save-dev @cloudflare/workers-types
```

y añade `"types": ["@cloudflare/workers-types"]` a `compilerOptions` en
`tsconfig.json`.

- [ ] **Step 5: Commit**

```bash
git add worker.ts wrangler.jsonc tsconfig.json package.json package-lock.json
git commit -m "feat(cloudflare): handler scheduled sobre la misma funcion que la ruta"
```

---

### Task 11: Probar el camino de publicación sin publicar — **[OPERADOR]**

El paso que decide si la Task 12 es segura. Prueba autenticación, registro de
meses, lectura del perfil de Instagram y límites del Worker, **sin publicar
nada**.

- [ ] **Step 1: Comprueba que ninguna pieza está en ventana**

Run: `date -u +"%Y-%m-%dT%H:%M UTC" && grep -n "publicarEl" content/piezas/2026-09.ts`
Expected: la hora actual **no** está dentro de los 90 minutos siguientes a
ninguna fecha de la lista (las horas del archivo son de Ecuador, UTC-5).

Si lo está, **espera**. Este paso no se hace con prisa.

- [ ] **Step 2: [OPERADOR] Llama la ruta a mano**

⚠️ El agente no ejecuta esto: lleva el `CRON_SECRET`.

```
! curl -s -H "Authorization: Bearer $CRON_SECRET" https://<WORKER>/api/cron/publicar | head -40
```

Expected, exactamente esta forma:

```json
{"mes":"2026-09","revisadas":7,"publicadas":[],"fallidas":[]}
```

Lo que dice cada campo si sale distinto:

| Salida | Significa |
|---|---|
| `revisadas: 7` | El registro estático funciona en el Worker |
| `revisadas: 0` | **El registro no llegó al bundle.** Para: es el fallo que toda la Task 1 existía para evitar |
| `401` | El `CRON_SECRET` del Worker no coincide con el usado |
| Error de perfil | El `IG_ACCESS_TOKEN` no llegó o caducó |
| `publicadas` no vacío | Había una pieza en ventana. Revisa el paso 1 |

- [ ] **Step 3: Mira los logs del Worker**

Run: `npx wrangler tail --format pretty`

Repite el paso 2 en otra terminal. Expected: la petición aparece sin errores y
**sin ningún token en el log**.

---

### Task 12: Mover el cron — **el paso delicado**

⚠️ **Nunca dos crons armados a la vez.** Dos plataformas disparando sobre la
misma cuenta de Instagram publica dos veces. La defensa por captions existe,
pero no se apoya una migración en ella.

⚠️ **El orden importa y no es el intuitivo:** quitar los crons de `vercel.json`
**no surte efecto hasta que Vercel redespliega**. Primero se apaga Vercel, se
espera al deploy, y solo entonces se arma Cloudflare.

**Files:**
- Modify: `vercel.json`
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Elige el hueco**

Run: `date -u +"%Y-%m-%dT%H:%M UTC" && grep -n "publicarEl" content/piezas/2026-09.ts`

Expected: eliges un momento con **al menos 12 horas** hasta la siguiente
publicación. Con el calendario actual, los huecos cómodos son entre el 10 y el
15, entre el 17 y el 22, o después del 22.

- [ ] **Step 2: Apaga el cron de Vercel**

Sustituye **todo** el contenido de `vercel.json` por:

```json
{}
```

- [ ] **Step 3: Mergea y espera al despliegue de Vercel**

```bash
git add vercel.json
git commit -m "chore(cron): apagar el cron de Vercel antes de armar el de Cloudflare"
git push -u origin HEAD
gh pr create --title "chore(cron): apagar el cron de Vercel" --body "Primera mitad del movimiento del cron. El de Cloudflare se arma cuando este deploy termine, no antes."
```

Mergea el PR.

⚠️ **La única comprobación válida es visual, y la hace el operador.** No hay
`curl` que sirva: la ruta `/api/cron/publicar` sigue existiendo y devolviendo
`401` esté el cron armado o no, así que responder `401` **no prueba nada**.

**[OPERADOR]** En el panel de Vercel, comprueba las dos cosas:

1. El despliegue de producción del merge figura como **Ready**.
2. En el proyecto, la pestaña **Cron Jobs** ya no lista ninguno.

Hasta que las dos sean ciertas, no sigas al paso 4. Si armas Cloudflare antes,
hay dos crons vivos sobre la misma cuenta de Instagram.

- [ ] **Step 4: Arma el cron de Cloudflare**

En `wrangler.jsonc`, añade antes de `"observability"`:

```jsonc
  // 09:00 y 18:00 de Ecuador (UTC-5, sin horario de verano).
  "triggers": {
    "crons": ["0 14 * * *", "0 23 * * *"]
  },
```

- [ ] **Step 5: Despliega y verifica que quedó registrado**

Run: `npm run deploy:cloudflare 2>&1 | tail -20`
Expected: la salida lista los dos triggers.

Run: `npx wrangler deployments list | head -10`
Expected: el despliegue más reciente es el que acabas de hacer.

- [ ] **Step 6: Commit**

```bash
git add wrangler.jsonc
git commit -m "feat(cron): armar el cron en Cloudflare"
git push
```

- [ ] **Step 7: Comprueba la primera publicación automática**

En la siguiente fecha del calendario, **después** de la hora prevista:

Run: `npx wrangler tail --format pretty`

Expected: la línea `cron 2026-09: revisadas 7, publicadas <id>, fallidas ninguna`.

⚠️ Si no publicó, el plan B es la ruta manual de la Task 11 — con la misma
comprobación previa de que sigue dentro de ventana.

---

### Task 13: Conectar el dominio

**Files:**
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Añade las rutas**

En `wrangler.jsonc`, añade antes de `"assets"`:

```jsonc
  "routes": [
    { "pattern": "pukadigital.com", "custom_domain": true },
    { "pattern": "www.pukadigital.com", "custom_domain": true }
  ],
```

- [ ] **Step 2: Despliega**

Run: `npm run deploy:cloudflare 2>&1 | tail -20`

- [ ] **Step 3: Comprueba que el dominio sirve el Worker**

Run:
```bash
curl -s -o /dev/null -w 'status %{http_code}\n' https://pukadigital.com
curl -sI https://pukadigital.com | grep -i "server\|cf-ray" 
```
Expected: `200`, y una cabecera `cf-ray` — que solo pone Cloudflare.

- [ ] **Step 4: Repite las comprobaciones de la Task 8 contra el dominio real**

Run:
```bash
for r in / /agencia /agentes-ia /ledgerxpertz /pukahealth /salud /desarrollo-web-pymes /blog /sitemap.xml /robots.txt /llms.txt; do
  printf "%-28s %s\n" "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://pukadigital.com$r)"
done
curl -s https://pukadigital.com/ledgerxpertz | grep -c 'application/ld+json'
```
Expected: `200` en todas y el mismo número de bloques JSON-LD que en la Task 8.

⚠️ **La vuelta atrás** es quitar las `routes`, redesplegar y devolver el registro
DNS a Vercel en el panel de Cloudflare. Son minutos.

- [ ] **Step 5: Commit**

```bash
git add wrangler.jsonc
git commit -m "feat(cloudflare): conectar pukadigital.com al worker"
git push
```

---

### Task 14: Apagar Vercel — **una semana después**

⚠️ **No antes.** Hasta aquí Vercel es la red de seguridad, y volver es cambiar
un registro DNS.

**Files:**
- Delete: `vercel.json`

- [ ] **Step 1: Comprueba que pasó una semana limpia**

Expected: al menos una publicación automática salió por Cloudflare y el sitio
lleva siete días sirviéndose desde el Worker sin incidencias.

- [ ] **Step 2: Borra el archivo**

Run: `git rm vercel.json`

- [ ] **Step 3: Actualiza la documentación**

En `AGENTS.md`, en la tabla de repos, sustituye el texto de la fila
`PukaDigital` — que hoy dice «Deploy automático en Vercel al pushear a `main`» —
por: «Deploy automático en **Cloudflare Workers** al pushear a `main`».

Y en la misma línea de la sección de comandos, sustituye la frase
«Deploy: automático en Vercel al pushear a `main`.» por «Deploy: automático en
Cloudflare Workers al pushear a `main`. La configuración vive en
`wrangler.jsonc`.»

- [ ] **Step 4: Comprueba el tope de tamaño de AGENTS.md**

Run: `wc -m AGENTS.md`
Expected: por debajo de 12.000. Antigravity trunca ahí en silencio y por el
final.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: apagar Vercel y documentar el despliegue en Cloudflare"
git push
```

- [ ] **Step 6: [OPERADOR] Borra el proyecto en el panel de Vercel**

Y comprueba que `pukadigital.com` sigue respondiendo `200` después de hacerlo.

---

## Qué NO hace este plan

- **Publicar en Facebook.** Otro endpoint, otro trabajo.
- **Bajar `VENTANA_MINUTOS` de 90 a 60.** Cloudflare da precisión al minuto y
  técnicamente sobra el margen, pero tocarlo durante la migración añade una
  variable. Se revisa después, actualizando el comentario de la constante.
- **Añadir el bucket R2 de caché incremental.** Se empieza sin él, asumiendo que
  las tres cachés de `revalidate: 300` no persistan entre invocaciones.
- **Mover la fábrica de piezas a la nube.** Sigue siendo un CLI local.
- **Cualquier cambio de contenido o diseño.** Esto es una mudanza: al final debe
  servirse exactamente lo mismo que hoy.
