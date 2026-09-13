# Reels — producción: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **En este proyecto se ejecuta con `agy`, de a una task**, según
> `docs/METODO_AGENTES_PARALELOS.md` §8 y §14: `agy` escribe el código literal de
> UNA task; Claude corre los tests, comprueba las mutaciones y commitea.

**Goal:** que `npm run reels -- --mes 2026-10 --id <pieza>` produzca el MP4 de un Reel, lo verifique contra lo que exige Meta, lo suba a R2 y deje el bloque `reel` listo para pegar.

**Architecture:** una tubería de funciones puras —párrafos, tiempos, composición HTML, verificación— y una capa fina que habla con las herramientas externas (`hyperframes`, `ffmpeg`, `ffprobe`, `wrangler`, Telegram, Gemini) a través de una función `ejecutar` inyectable. Todo corre en la máquina, nunca en el Worker.

**Tech Stack:** TypeScript estricto, `node --test` con `tsx`, HyperFrames 0.8.36 (Kokoro `ef_dora` y render con Chrome), GSAP 3.14.2 en local, ffmpeg, wrangler y la Bot API de Telegram.

**Spec:** `docs/superpowers/specs/2026-09-13-reels-hyperframes-design.md`.

**Este es el plan 2 de 2.** El 1 —modelo, validación y publicación— ya está en `main`. Este produce lo que aquel publica.

---

## Antes de empezar

### Prerrequisitos

- Este plan tiene que estar en `main` (PR de `docs/plan-reels-produccion` mergeado).
- Rama propia desde `main`:

```bash
git checkout main && git pull
git checkout -b feat/reels-produccion
```

- **Herramientas de la máquina**, que no son dependencias de npm. Sin ellas el código se escribe y los tests pasan, pero no se puede renderizar de verdad:

```bash
brew install espeak-ng ffmpeg
python3 -m venv ~/.venvs/kokoro && ~/.venvs/kokoro/bin/pip install kokoro-onnx soundfile
npx -y hyperframes@0.8.36 doctor
```

Y en `.env.local`, con rutas absolutas —el `~` no se expande ahí—:

```
HYPERFRAMES_PYTHON=/Users/luisviteri/.venvs/kokoro/bin/python
ESPEAK_DATA_PATH=/opt/homebrew/share/espeak-ng-data
PHONEMIZER_ESPEAK_LIBRARY=/opt/homebrew/lib/libespeak-ng.dylib
```

⚠️ **Las dos de `espeak` no son opcionales, y su fallo no se parece a lo que es.**
`kokoro-onnx` trae su propio `espeak-ng` compilado en CI, con la ruta de los datos
grabada dentro apuntando a `/Users/runner/work/...`. En esta máquina eso no existe,
así que la voz falla con `Error processing file '.../phontab': No such file or
directory` — un error que no menciona ni Kokoro ni el español. Medido el 2026-09-13.

- **Para subir de verdad** hacen falta además el bucket de R2 con dominio público, el bot de Telegram y `API_KEY` de Gemini. **No hacen falta para empezar**: `--ensayo` renderiza y verifica sin subir nada.

### Línea base

```bash
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)"   # ℹ tests 174 · ℹ pass 174 · ℹ fail 0
npx tsc --noEmit; echo "exit=$?"                   # exit=0
npm run piezas -- --check                          # 7 pieza(s) validas en 2026-09.
```

Al terminar: **225 tests** (174 + 51), `tsc` limpio y las 7 piezas válidas.

| Task | Tests nuevos | Acumulado |
|---|---|---|
| 1 | 4 | 178 |
| 2 | 6 | 184 |
| 3 | 6 | 190 |
| 4 | 3 | 193 |
| 5 | 3 | 196 |
| 6 | 6 | 202 |
| 7 | 8 | 210 |
| 8 | 4 | 214 |
| 9 | 8 | 225 |

### 🔑 Paso 0: correr el código del plan antes de dárselo a `agy`

Como en el plan 1, y aquí importa más: **casi todo depende de herramientas externas**, y un flag inventado no se ve leyendo.

```bash
git worktree add --detach ../PukaDigital-ensayo-produccion HEAD
cd ../PukaDigital-ensayo-produccion && npm ci
# aplicar las Tasks 1-11 y correr la suite
```

Y **el paso 0 incluye un render de verdad**, que es lo único que puede desmentir tres suposiciones que el plan no pudo verificar leyendo:

1. que `hyperframes render --strict` acepta la composición generada;
2. que las animaciones y los subtítulos caen donde deben;
3. que el audio del MP4 sale como Meta lo exige después de la pasada de `ffmpeg`.

```bash
# con una pieza a la que se le añade a mano un bloque reel con guion, sin commitearla
npm run reels -- --mes 2026-09 --id crm-no-chatbot --ensayo
ffmpeg -y -ss 3 -i <carpeta>/reel.mp4 -frames:v 1 /tmp/fotograma.png   # y mirarlo
```

Lo que falle ahí se corrige **en el plan**, no en el código que copiará `agy`.

### Desviaciones de la spec, ya corregidas en ella

| Qué | Por qué |
|---|---|
| Sin transcripción: los cortes salen de lo que dura la voz de cada párrafo | No hay whisper ni parakeet en la máquina, y transcribir baja un modelo multilingüe pesado. Decidido con Luis el 2026-09-13 |
| El guion lleva **un párrafo por slide**, y el validador lo exige | Es lo que hace que el corte de escena sea exacto sin transcribir |
| Fuentes y captura **embebidas** en el HTML; GSAP, como archivo hermano | Nada se descarga de la red, que es lo que hace el render reproducible. GSAP no va en línea porque el lint de `--strict` lee su `Math.random()` como código nuestro y aborta — medido en el render del paso 0 |
| `--id`: un Reel por comando | Renderizar tarda minutos; un mes entero de golpe no es útil y complica el manejo de errores |
| `--ensayo`: renderiza y verifica sin subir | El bucket de R2 todavía no existe, y probar el render no debería obligar a publicar |

### El contraste del plan, 2026-09-13

Claude y `agy` (`gemini-3.8-flash-high`) contrastaron este plan contra el código
real, por separado. **Contrastar un plan encuentra otra cosa que contrastar un
spec**: aquí lo que importa es el código literal que alguien va a copiar.

| Hallazgo | Quién | Veredicto |
|---|---|---|
| La Task 1 esperaba 4 fallos en su fase roja, y son 2 | agy | ✅ **corregido**: un archivo que no carga cuenta como un test y un fallo |
| El tipo `env` de `Ejecutar` no compilaría con `Record<string, string>` | agy | ❌ **descartado**, midiendo |

🔴 **Por qué `env?: Record<string, string>` se queda como está.** El argumento era
que `...(d.python ? { HYPERFRAMES_PYTHON: d.python } : {})` produce una propiedad
opcional, y `string | undefined` no entra en una firma de índice que pide
`string`. Suena bien y es falso: TypeScript infiere ahí **la unión de dos
objetos**, no una propiedad opcional, y las dos ramas encajan. Comprobado
compilando las dos versiones con la configuración del proyecto: las dos pasan.

Lo que verificó Claude, sin hallazgos: las firmas de `Fuente`, `cargarFuentes`,
`medidasAviso`, `AVISO`, `FONDO_AVISO`, `cargarCaptura`, `FORMATOS`, `MARGEN`,
`sistemas`, `CATALOGO`, `PROHIBIDAS`, `validar`, `formatear` y `piezasDe`; **las
seis cuentas de los tests**, ejecutando la lógica que el plan propone; y que la
regla nueva del validador solo rompe los tests de Facebook, que la Task 1 arregla.

⚠️ Lo que ningún contraste puede decidir, y por eso el paso 0 incluye un render de
verdad: si `render --strict` acepta esta composición, si las animaciones caen
donde deben y si el audio sale como Meta lo exige.

### Lo que contestó ese render, 2026-09-13

Se aplicó el plan entero en un worktree descartable, se le puso a mano un bloque
`reel` a `crm-no-chatbot` y se renderizó de verdad. **Ninguno de los cuatro
hallazgos lo habría encontrado un test**: tres hicieron falta mirar el error, y
uno, mirar el video.

| Qué pasó | Corregido en |
|---|---|
| `render --strict` abortó con `non_deterministic_code: Math.random()` y `Date.now()`. **No era código nuestro: era GSAP en línea.** El lint analiza los `<script>` inline | Task 7 y Task 10: GSAP se escribe como `gsap.min.js` al lado del `index.html` y se referencia con `src` |
| El fallo solo decía «Command failed». HyperFrames escribe sus errores en **stdout**, y `ejecutar` solo miraba stderr | Task 8: `ejecutar` mira los dos, y hay un test que lo fija |
| El fotograma 2 mostraba un subtítulo entero que decía **«reportes.»**. Cortar en las comas parte las enumeraciones y deja palabras sueltas | Task 2: solo cortan `.?!`, y una cola de una palabra vuelve a su grupo |
| Aviso `timeline_track_too_dense`: las 5 escenas iban en la pista 0 | Task 7: `data-track-index="${i}"`, una pista por escena |

Con eso el render terminó: **827 fotogramas, 27,6 s de video, en 13 s**. Y tras la
pasada de `ffmpeg`, `ffprobe` dio h264 · 1080×1920 · yuv420p · 30 fps · aac 48000 ·
2 canales · 27,57 s · 1,37 MB — todo lo que exige Meta, sin un solo error.

---

### Mapa de archivos

| Archivo | Cambio | Responsabilidad |
|---|---|---|
| `lib/piezas/guion.ts` | crear | Partir un guion en párrafos. Lo usan el validador y la producción |
| `lib/piezas/validar.ts` | modificar | Un párrafo por slide |
| `lib/reels/tiempos.ts` | crear | Escenas y subtítulos desde lo que dura cada voz |
| `lib/reels/verificacion.ts` | crear | Lo que exige Meta, contra `ffprobe` |
| `lib/reels/r2.ts` | crear | Clave con hash, URL pública y argumentos de `wrangler` |
| `lib/reels/telegram.ts` | crear | `sendVideo` con el archivo subido |
| `lib/reels/guion.ts` | crear | El prompt del guion y la lectura de la respuesta |
| `lib/reels/composicion.ts` | crear | El HTML, generado desde los tokens del sistema |
| `lib/reels/herramientas.ts` · `bloque.ts` | crear | Ejecutar comandos; imprimir el bloque para pegar |
| `lib/reels/producir.ts` | crear | La tubería entera, con todo inyectado |
| `lib/reels/cli.ts` | crear | `npm run reels`: argumentos y herramientas de verdad |
| `package.json` | modificar | El script `reels` y `gsap` como dependencia de desarrollo |
| `docs/` · `AGENTS.md` | modificar | Variables, cómo se produce un Reel y el comando |

---

### Task 1: un párrafo por slide

**Files:**
- Create: `lib/piezas/guion.ts`, `lib/piezas/guion.test.ts`
- Modify: `lib/piezas/validar.ts`, `lib/piezas/validar.test.ts`, `lib/publicar/facebook.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/piezas/guion.test.ts`:

```typescript
// lib/piezas/guion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parrafosDelGuion } from './guion.ts';

test('separa por línea en blanco y normaliza los espacios de dentro', () => {
  assert.deepEqual(parrafosDelGuion('Uno\ndos.\n\nTres  cuatro.'), ['Uno dos.', 'Tres cuatro.']);
});

test('una línea con espacios también separa, y las de más no cuentan', () => {
  assert.deepEqual(parrafosDelGuion('A.\n   \nB.\n\n\n\nC.'), ['A.', 'B.', 'C.']);
});

test('un guion vacío no tiene párrafos', () => {
  assert.deepEqual(parrafosDelGuion('  \n\n  '), []);
});
```

Añadir al final de `lib/piezas/validar.test.ts`:

```typescript
test('el guion lleva un párrafo por slide, separados por una línea en blanco', () => {
  const dos: Pieza = { ...ok, slides: [{ titular: 'Uno' }, { titular: 'Dos' }] };
  assert.deepEqual(validar([{ ...dos, reel: { guion: `${GUION}\n\n${GUION}`, caption: 'c' } }]), []);
  assert.deepEqual(campos([{ ...dos, reel: { guion: GUION, caption: 'c' } }]), ['reel.guion']);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/piezas/guion.test.ts lib/piezas/validar.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 2` — uno de `guion.test.ts`, que **no carga** porque el módulo no existe todavía, y el nuevo de `validar.test.ts`. ⚠️ Un archivo que falla al importar cuenta como **un** test y un fallo, no como los que contiene: medido el 2026-09-13.

- [ ] **Step 3: los párrafos**

Crear `lib/piezas/guion.ts`:

```typescript
// lib/piezas/guion.ts
/**
 * El guion de un Reel lleva **un párrafo por slide**, separados por una línea en
 * blanco. Cada párrafo se sintetiza aparte y lo que dura su voz marca dónde
 * empieza la escena siguiente: por eso el número de párrafos tiene que coincidir
 * con el de slides.
 *
 * Decidido el 2026-09-13: sin transcripción, los cortes salen de aquí. Vive en
 * `lib/piezas/` porque lo usan el validador y la producción, y `lib/piezas/` no
 * depende de nadie.
 */
export function parrafosDelGuion(guion: string): string[] {
  return guion
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.replace(/\s+/g, ' ').trim())
    .filter((parrafo) => parrafo !== '');
}
```

- [ ] **Step 4: la regla en el validador**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
import { formatosDe } from './formatos.ts';
```

por:

```typescript
import { formatosDe } from './formatos.ts';
import { parrafosDelGuion } from './guion.ts';
```

Y reemplazar exactamente:

```typescript
            `${cuantas} palabras, entre ${MIN_PALABRAS_GUION} y ${MAX_PALABRAS_GUION}: son los 3 a 90 segundos que admite Facebook, a ${PALABRAS_POR_SEGUNDO} palabras por segundo`,
          );
        }
      }
```

por:

```typescript
            `${cuantas} palabras, entre ${MIN_PALABRAS_GUION} y ${MAX_PALABRAS_GUION}: son los 3 a 90 segundos que admite Facebook, a ${PALABRAS_POR_SEGUNDO} palabras por segundo`,
          );
        }

        // Un párrafo por slide: es lo que hace que el corte de escena sea exacto
        // sin transcribir el audio.
        const parrafos = parrafosDelGuion(guion).length;
        if (parrafos !== pieza.slides.length) {
          en(
            'reel.guion',
            `${parrafos} párrafos y ${pieza.slides.length} slides: el guion lleva un párrafo por slide, separados por una línea en blanco`,
          );
        }
      }
```

- [ ] **Step 5: el guion de los tests de Facebook pasa a tener dos párrafos**

`piezaBase` tiene dos slides, así que su guion de un párrafo deja de ser válido. En `lib/publicar/facebook.test.ts`, reemplazar exactamente:

```typescript
const GUION = 'Un chatbot responde. Un CRM te dice a quién llamar mañana. Desde catorce noventa y nueve al mes.';
```

por:

```typescript
const GUION =
  'Un chatbot responde. Un CRM te dice a quién llamar mañana.\n\n' +
  'Desde catorce noventa y nueve al mes.';
```

- [ ] **Step 6: comprobar que pasan**

Run: `npm test 2>&1 | grep -E "^ℹ (tests|fail)"`
Expected: `ℹ tests 178` · `ℹ fail 0`

- [ ] **Step 7: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `split(/\n\s*\n/)` → `split('\n\n')` | «una línea con espacios también separa» |
| `parrafos !== pieza.slides.length` → `parrafos > pieza.slides.length` | «el guion lleva un párrafo por slide» |
| deshacer el Step 5 (guion de un párrafo en `facebook.test.ts`) | los 6 tests del Reel de Facebook: la validación los rechaza |

- [ ] **Step 8: commit**

```bash
git add lib/piezas/guion.ts lib/piezas/guion.test.ts lib/piezas/validar.ts lib/piezas/validar.test.ts lib/publicar/facebook.test.ts
git commit -m "feat(reels): el guion lleva un parrafo por slide"
```

**Caminos de entrada:** `validar()` la llaman `piezas --check`, el render y las cuatro funciones de publicar. `parrafosDelGuion` la usarán además `producir.ts` y `bloque.ts`.

---

### Task 2: escenas y subtítulos

**Files:**
- Create: `lib/reels/tiempos.ts`, `lib/reels/tiempos.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/tiempos.test.ts`:

```typescript
// lib/reels/tiempos.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escenasDesde, subtitulosDe } from './tiempos.ts';

test('las escenas se encadenan: cada una empieza donde acaba la anterior', () => {
  const { escenas, total } = escenasDesde(['Uno dos.', 'Tres cuatro.', 'Cinco.'], [2, 3, 1.5]);
  assert.deepEqual(
    escenas.map((e) => [e.inicio, e.duracion, e.voz]),
    [
      [0, 2.7, 0.3], // 0,3 de entrada + 2 de voz + 0,4 de pausa
      [2.7, 3.4, 2.7], // 3 de voz + 0,4 de pausa
      [6.1, 2.3, 6.1], // 1,5 de voz + 0,8 de cola
    ],
  );
  assert.equal(total, 8.4);
});

test('los párrafos y los audios tienen que coincidir', () => {
  assert.throws(() => escenasDesde(['a', 'b'], [1]), /2 párrafos y 1 audios/);
});

test('los subtítulos cubren la voz entera, sin huecos ni solapes', () => {
  const subs = subtitulosDe('Un chatbot responde. Un CRM te dice a quién llamar mañana.', 1, 4);
  assert.equal(subs[0].inicio, 1);
  assert.equal(subs[subs.length - 1].fin, 5);
  for (let i = 1; i < subs.length; i++) assert.equal(subs[i].inicio, subs[i - 1].fin);
});

test('los grupos cortan a las 4 palabras o donde cierra una idea', () => {
  const subs = subtitulosDe('Un chatbot responde. Un CRM te dice a quién llamar mañana.', 0, 4);
  assert.deepEqual(subs.map((s) => s.texto), [
    'Un chatbot responde.',
    'Un CRM te dice',
    'a quién llamar mañana.',
  ]);
});

test('una enumeración no deja palabras sueltas en pantalla', () => {
  // El fotograma 2 del ensayo del paso 0 mostraba un subtítulo que decía
  // «reportes.» y nada más. Ni las comas cortan, ni una cola queda sola.
  const subs = subtitulosDe(
    'Inbox centralizado, pipeline en Kanban, ficha de cliente y reportes. El bot es una parte.',
    0,
    8,
  );
  assert.deepEqual(subs.map((s) => s.texto), [
    'Inbox centralizado, pipeline en',
    'Kanban, ficha de cliente',
    'y reportes.',
    'El bot es una parte.',
  ]);
});

test('pero una frase de una sola palabra sí es un subtítulo', () => {
  assert.deepEqual(subtitulosDe('Sí. Extraordinariamente.', 0, 10).map((s) => s.texto), [
    'Sí.',
    'Extraordinariamente.',
  ]);
});

test('una palabra larga recibe más tiempo que una corta', () => {
  const [corto, largo] = subtitulosDe('Sí. Extraordinariamente.', 0, 10);
  assert.ok(largo.fin - largo.inicio > corto.fin - corto.inicio);
});

test('sin palabras o sin duración no hay subtítulos', () => {
  assert.deepEqual(subtitulosDe('   ', 0, 3), []);
  assert.deepEqual(subtitulosDe('Hola', 0, 0), []);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/tiempos.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/tiempos.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/tiempos.ts`:

```typescript
// lib/reels/tiempos.ts
/** Silencio entre un párrafo y el siguiente: la voz respira y la escena cambia. */
export const PAUSA_ENTRE_ESCENAS = 0.4;
/** Aire antes de la primera palabra, para que la primera escena entre sin cortar. */
export const ENTRADA = 0.3;
/** Aire al final, para que el último subtítulo no se corte con el video. */
export const COLA = 0.8;
/** Palabras por subtítulo, como máximo. */
export const MAX_PALABRAS_SUBTITULO = 4;

export type Subtitulo = { texto: string; inicio: number; fin: number };

export type Escena = {
  indice: number;
  inicio: number;
  duracion: number;
  /** Cuándo entra la voz de esta escena. */
  voz: number;
  subtitulos: Subtitulo[];
};

/** Milisegundos: más precisión no la usa nadie y ensucia el HTML. */
const redondear = (segundos: number): number => Math.round(segundos * 1000) / 1000;

/**
 * Reparte el tiempo de un párrafo entre sus palabras según su largo, y las junta
 * en grupos de hasta `max`, cortando también donde cierra una idea.
 *
 * Sin transcripción, decidido el 2026-09-13: el desfase de una palabra suelta
 * puede ser de décimas, pero en grupos de tres o cuatro no se nota.
 */
export function subtitulosDe(
  texto: string,
  inicio: number,
  duracion: number,
  max = MAX_PALABRAS_SUBTITULO,
): Subtitulo[] {
  const palabras = texto.split(/\s+/).filter(Boolean);
  if (palabras.length === 0 || duracion <= 0) return [];

  const peso = (palabra: string) => palabra.length + 1;
  const total = palabras.reduce((suma, palabra) => suma + peso(palabra), 0);

  const grupos: string[][] = [];
  let actual: string[] = [];
  for (const palabra of palabras) {
    actual.push(palabra);
    // Se corta al llegar al tope, o donde termina una frase. **No en las comas**:
    // con ellas una enumeración deja palabras sueltas, y en pantalla se lee un
    // subtítulo que dice «reportes.» y nada más. Visto en el render del paso 0.
    if (actual.length >= max || /[.?!]$/.test(palabra)) {
      grupos.push(actual);
      actual = [];
    }
  }
  if (actual.length > 0) grupos.push(actual);

  // Una palabra sola en pantalla se lee mal, pero «Sí.» sí es un subtítulo: lo que
  // sobra es la **cola de una frase que el tope partió**. Se distinguen por lo que
  // hay antes: si el grupo anterior no cerró frase, esta palabra es su cola y vuelve
  // con ella, aunque el grupo quede en cinco.
  for (let i = grupos.length - 1; i > 0; i--) {
    const anterior = grupos[i - 1];
    if (grupos[i].length === 1 && !/[.?!]$/.test(anterior[anterior.length - 1])) {
      anterior.push(...grupos[i]);
      grupos.splice(i, 1);
    }
  }

  const subtitulos: Subtitulo[] = [];
  let acumulado = 0;
  for (const grupo of grupos) {
    const desde = inicio + (acumulado / total) * duracion;
    acumulado += grupo.reduce((suma, palabra) => suma + peso(palabra), 0);
    const hasta = inicio + (acumulado / total) * duracion;
    subtitulos.push({ texto: grupo.join(' '), inicio: redondear(desde), fin: redondear(hasta) });
  }
  return subtitulos;
}

/**
 * Las escenas del Reel, una por párrafo, a partir de lo que dura la voz de cada
 * uno. Cada escena empieza donde acaba la anterior: es lo que hace que el corte
 * caiga en la palabra correcta sin transcribir nada.
 */
export function escenasDesde(
  parrafos: string[],
  duracionesVoz: number[],
): { escenas: Escena[]; total: number } {
  if (parrafos.length !== duracionesVoz.length) {
    throw new Error(
      `${parrafos.length} párrafos y ${duracionesVoz.length} audios: tienen que coincidir`,
    );
  }

  const escenas: Escena[] = [];
  let reloj = 0;
  parrafos.forEach((texto, i) => {
    const antes = i === 0 ? ENTRADA : 0;
    const despues = i === parrafos.length - 1 ? COLA : PAUSA_ENTRE_ESCENAS;
    const voz = duracionesVoz[i];
    escenas.push({
      indice: i,
      inicio: redondear(reloj),
      duracion: redondear(antes + voz + despues),
      voz: redondear(reloj + antes),
      subtitulos: subtitulosDe(texto, redondear(reloj + antes), voz),
    });
    reloj += antes + voz + despues;
  });

  return { escenas, total: redondear(reloj) };
}
```

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/tiempos.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 8` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `i === 0 ? ENTRADA : 0` → `0` | «las escenas se encadenan» |
| `actual.length >= max` → `actual.length > max` | «los grupos cortan a las 4 palabras» |
| `peso = (palabra) => palabra.length + 1` → `() => 1` | «una palabra larga recibe más tiempo» |
| borrar el `if (parrafos.length !== duracionesVoz.length)` | «los párrafos y los audios tienen que coincidir» |
| `/[.?!]$/.test(palabra)` → `/[.,;:?!]$/.test(palabra)` | «una enumeración no deja palabras sueltas» |
| borrar el bucle que recoge la cola de una palabra | «una enumeración no deja palabras sueltas» |
| quitarle al bucle la guarda `!/[.?!]$/.test(...)` | «pero una frase de una sola palabra sí es un subtítulo» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/tiempos.ts lib/reels/tiempos.test.ts
git commit -m "feat(reels): escenas y subtitulos desde lo que dura cada voz"
```

---

### Task 3: lo que exige Meta

**Files:**
- Create: `lib/reels/verificacion.ts`, `lib/reels/verificacion.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/verificacion.test.ts`:

```typescript
// lib/reels/verificacion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { argumentosNormalizar, erroresDeVideo, type Ffprobe } from './verificacion.ts';

type Pista = Ffprobe['streams'][number];

const BUENO: Ffprobe = {
  streams: [
    { codec_type: 'video', codec_name: 'h264', width: 1080, height: 1920, pix_fmt: 'yuv420p', r_frame_rate: '30/1' },
    { codec_type: 'audio', codec_name: 'aac', sample_rate: '48000', channels: 2 },
  ],
  format: { duration: '24.500000', size: '6200000' },
};

const con = (video: Partial<Pista> = {}, audio: Partial<Pista> = {}, format: Partial<Ffprobe['format']> = {}): Ffprobe => ({
  streams: [{ ...BUENO.streams[0], ...video }, { ...BUENO.streams[1], ...audio }],
  format: { ...BUENO.format, ...format },
});

test('un MP4 que cumple no da errores', () => {
  assert.deepEqual(erroresDeVideo(BUENO), []);
});

test('el video va en h264, 1080×1920, yuv420p y de 23 a 60 fps', () => {
  assert.equal(erroresDeVideo(con({ codec_name: 'hevc' })).length, 1);
  assert.equal(erroresDeVideo(con({ width: 1920, height: 1080 })).length, 1);
  assert.equal(erroresDeVideo(con({ pix_fmt: 'yuv444p' })).length, 1);
  assert.equal(erroresDeVideo(con({ r_frame_rate: '120/1' })).length, 1);
  assert.deepEqual(erroresDeVideo(con({ r_frame_rate: '30000/1001' })), []);
});

test('el audio va en aac a 48 kHz y en 1 o 2 canales', () => {
  assert.match(erroresDeVideo(con({}, { sample_rate: '24000' }))[0], /48000/);
  assert.equal(erroresDeVideo(con({}, { codec_name: 'mp3' })).length, 1);
  assert.equal(erroresDeVideo(con({}, { channels: 6 })).length, 1);
});

test('sin pista de audio no pasa: el Reel lleva voz', () => {
  assert.deepEqual(erroresDeVideo({ ...BUENO, streams: [BUENO.streams[0]] }), [
    'no hay pista de audio: el Reel lleva voz',
  ]);
});

test('dura de 3 a 90 segundos y pesa hasta 300 MB', () => {
  assert.deepEqual(erroresDeVideo(con({}, {}, { duration: '3' })), []);
  assert.deepEqual(erroresDeVideo(con({}, {}, { duration: '90' })), []);
  assert.equal(erroresDeVideo(con({}, {}, { duration: '90.1' })).length, 1);
  assert.equal(erroresDeVideo(con({}, {}, { size: String(301 * 1024 * 1024) })).length, 1);
});

test('la normalización no recodifica el video y deja el índice delante', () => {
  const args = argumentosNormalizar('render.mp4', 'reel.mp4');
  assert.equal(args[args.indexOf('-c:v') + 1], 'copy');
  assert.equal(args[args.indexOf('-ar') + 1], '48000');
  assert.ok(args.includes('+faststart'));
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/verificacion.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/verificacion.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/verificacion.ts`:

```typescript
// lib/reels/verificacion.ts
/**
 * Lo que Meta exige a un Reel publicado por API, comprobado sobre el MP4 real.
 * De la documentación de IG User Media y de Page Video Reels, leída el
 * 2026-09-13: H.264 progresivo en 4:2:0, AAC a 48 kHz como máximo, de 23 a 60
 * fps, de 3 a 90 segundos —el techo es el de Facebook— y hasta 300 MB.
 */
export type Ffprobe = {
  streams: Array<{
    codec_type?: string;
    codec_name?: string;
    width?: number;
    height?: number;
    pix_fmt?: string;
    r_frame_rate?: string;
    sample_rate?: string;
    channels?: number;
  }>;
  format: { duration?: string; size?: string };
};

export const ARGUMENTOS_FFPROBE = (archivo: string): string[] => [
  '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', archivo,
];

/**
 * El render sale de Chrome y del ffmpeg de HyperFrames. Esta pasada deja el audio
 * en AAC a 48 kHz estéreo y **el índice del MP4 al principio** (`+faststart`):
 * Meta pide el «moov atom» delante. El video no se recodifica, así que es rápida.
 */
export const argumentosNormalizar = (entrada: string, salida: string): string[] => [
  '-y', '-i', entrada,
  '-c:v', 'copy',
  '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k',
  '-movflags', '+faststart',
  salida,
];

/** `30000/1001` son 29,97 fps: la fracción se divide, no se lee como entero. */
function cuadrosPorSegundo(fraccion: string | undefined): number {
  const [numerador, denominador] = (fraccion ?? '0/1').split('/').map(Number);
  return denominador ? numerador / denominador : 0;
}

export function erroresDeVideo(probe: Ffprobe): string[] {
  const errores: string[] = [];
  const video = probe.streams.find((pista) => pista.codec_type === 'video');
  const audio = probe.streams.find((pista) => pista.codec_type === 'audio');

  if (!video) {
    errores.push('no hay pista de video');
  } else {
    if (video.codec_name !== 'h264') {
      errores.push(`el video es ${video.codec_name}, tiene que ser h264`);
    }
    if (video.width !== 1080 || video.height !== 1920) {
      errores.push(`el video mide ${video.width}×${video.height}, tiene que ser 1080×1920`);
    }
    if (video.pix_fmt !== 'yuv420p') {
      errores.push(`el video usa ${video.pix_fmt}, tiene que ser yuv420p`);
    }
    const fps = cuadrosPorSegundo(video.r_frame_rate);
    if (fps < 23 || fps > 60) {
      errores.push(`${fps} fps, Meta admite de 23 a 60`);
    }
  }

  if (!audio) {
    errores.push('no hay pista de audio: el Reel lleva voz');
  } else {
    if (audio.codec_name !== 'aac') {
      errores.push(`el audio es ${audio.codec_name}, tiene que ser aac`);
    }
    if (audio.sample_rate !== '48000') {
      errores.push(`el audio va a ${audio.sample_rate} Hz, tiene que ir a 48000`);
    }
    if (!audio.channels || audio.channels > 2) {
      errores.push(`el audio tiene ${audio.channels} canales, Meta admite 1 o 2`);
    }
  }

  const duracion = Number(probe.format.duration);
  if (!(duracion >= 3 && duracion <= 90)) {
    errores.push(`dura ${probe.format.duration} s, Facebook admite de 3 a 90`);
  }
  const megas = Number(probe.format.size) / 1024 / 1024;
  if (megas > 300) {
    errores.push(`pesa ${megas.toFixed(0)} MB, Meta admite hasta 300`);
  }

  return errores;
}
```

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/verificacion.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 6` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `audio.sample_rate !== '48000'` → `!== '44100'` | «el audio va en aac a 48 kHz» |
| `fps < 23 \|\| fps > 60` → `fps < 23` | «el video va en h264…» |
| `denominador ? numerador / denominador : 0` → `numerador` | «el video va en h264…» (los 29,97 fps) |
| `'-c:v', 'copy'` → `'-c:v', 'libx264'` | «la normalización no recodifica el video» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/verificacion.ts lib/reels/verificacion.test.ts
git commit -m "feat(reels): verificar el MP4 contra lo que exige Meta"
```

---

### Task 4: la clave en R2

**Files:**
- Create: `lib/reels/r2.ts`, `lib/reels/r2.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/r2.test.ts`:

```typescript
// lib/reels/r2.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { argumentosSubida, claveReel, urlReel } from './r2.ts';

test('la clave lleva el mes, el id y 8 caracteres del hash del MP4', () => {
  assert.equal(
    claveReel('2026-10', 'crm-no-chatbot', new TextEncoder().encode('hola')),
    'reels/2026-10/crm-no-chatbot-b221d9db.mp4',
  );
});

test('otro MP4 da otra clave: re-renderizar nunca pisa la URL publicada', () => {
  const uno = claveReel('2026-10', 'x', new TextEncoder().encode('render 1'));
  const dos = claveReel('2026-10', 'x', new TextEncoder().encode('render 2'));
  assert.notEqual(uno, dos);
});

test('la URL une base y clave con una sola barra, y se sube con wrangler en remoto', () => {
  assert.equal(
    urlReel('https://reels.pukadigital.com/', 'reels/2026-10/x-1a2b3c4d.mp4'),
    'https://reels.pukadigital.com/reels/2026-10/x-1a2b3c4d.mp4',
  );
  assert.deepEqual(argumentosSubida('pukadigital-reels', 'reels/2026-10/x.mp4', '/tmp/reel.mp4'), [
    'wrangler', 'r2', 'object', 'put', 'pukadigital-reels/reels/2026-10/x.mp4',
    '--file', '/tmp/reel.mp4', '--remote', '--content-type', 'video/mp4',
  ]);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/r2.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/r2.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/r2.ts`:

```typescript
// lib/reels/r2.ts
import { createHash } from 'node:crypto';

/**
 * La clave lleva los primeros 8 caracteres del SHA-256 del MP4. Con una clave
 * fija, re-renderizar tras corregir el guion deja la misma URL, y tanto la caché
 * de Cloudflare como la de Meta pueden servir el video viejo. Con el hash, cada
 * render es una URL nueva —hay que pegarla— y lo ya publicado no se toca.
 */
export function claveReel(mes: string, id: string, bytes: Uint8Array): string {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  return `reels/${mes}/${id}-${hash}.mp4`;
}

export function urlReel(base: string, clave: string): string {
  return `${base.replace(/\/+$/, '')}/${clave}`;
}

/**
 * Se sube con la sesión de `wrangler`, que ya está iniciada: sin SDK de S3 y sin
 * claves nuevas. `--remote` es lo que evita subirlo al R2 simulado de local.
 */
export function argumentosSubida(bucket: string, clave: string, archivo: string): string[] {
  return [
    'wrangler', 'r2', 'object', 'put', `${bucket}/${clave}`,
    '--file', archivo, '--remote', '--content-type', 'video/mp4',
  ];
}
```

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/r2.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 3` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `.slice(0, 8)` → `.slice(0, 12)` | «la clave lleva el mes, el id y 8 caracteres» |
| `base.replace(/\/+$/, '')` → `base` | «la URL une base y clave con una sola barra» |
| borrar `'--remote'` | «…y se sube con wrangler en remoto» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/r2.ts lib/reels/r2.test.ts
git commit -m "feat(reels): la clave en R2 lleva el hash del MP4"
```

---

### Task 5: el aviso por Telegram

**Files:**
- Create: `lib/reels/telegram.ts`, `lib/reels/telegram.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/telegram.test.ts`:

```typescript
// lib/reels/telegram.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enviarVideo } from './telegram.ts';

const TOKEN = '123456:TOKEN-SECRETO-QUE-NUNCA-DEBE-APARECER';
const VIDEO = { nombre: 'crm-no-chatbot.mp4', bytes: new Uint8Array([1, 2, 3]) };

function fetchFalso(respuesta: unknown, ok = true) {
  const llamadas: Array<{ url: string; cuerpo: FormData }> = [];
  const impl = (async (url: string | URL, init?: RequestInit) => {
    llamadas.push({ url: String(url), cuerpo: init?.body as FormData });
    return { ok, status: ok ? 200 : 400, json: async () => respuesta } as Response;
  }) as unknown as typeof fetch;
  return { impl, llamadas };
}

test('sube el archivo con sendVideo, al chat indicado y reproducible en el chat', async () => {
  const { impl, llamadas } = fetchFalso({ ok: true });
  await enviarVideo(VIDEO, 'Caption del Reel', { token: TOKEN, chatId: '42', fetchImpl: impl });

  assert.equal(llamadas[0].url, `https://api.telegram.org/bot${TOKEN}/sendVideo`);
  assert.equal(llamadas[0].cuerpo.get('chat_id'), '42');
  assert.equal(llamadas[0].cuerpo.get('supports_streaming'), 'true');
  const video = llamadas[0].cuerpo.get('video') as File;
  assert.equal(video.name, 'crm-no-chatbot.mp4');
  assert.equal(video.size, 3);
});

test('el caption se recorta a 1024 caracteres, el máximo de Telegram', async () => {
  const { impl, llamadas } = fetchFalso({ ok: true });
  await enviarVideo(VIDEO, 'x'.repeat(2000), { token: TOKEN, chatId: '42', fetchImpl: impl });
  assert.equal(String(llamadas[0].cuerpo.get('caption')).length, 1024);
});

test('si Telegram lo rechaza, falla con su descripción y sin el token', async () => {
  const { impl } = fetchFalso({ ok: false, description: 'Bad Request: chat not found' }, false);
  await assert.rejects(
    () => enviarVideo(VIDEO, 'c', { token: TOKEN, chatId: '42', fetchImpl: impl }),
    (e: Error) => {
      assert.match(e.message, /chat not found/);
      assert.ok(!e.message.includes('TOKEN-SECRETO-QUE-NUNCA-DEBE-APARECER'), 'el token se filtro');
      return true;
    },
  );
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/telegram.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/telegram.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/telegram.ts`:

```typescript
// lib/reels/telegram.ts
/** El caption de un video admite 1024 caracteres en la Bot API. */
export const MAX_CAPTION = 1024;

export type OpcionesTelegram = {
  token: string;
  chatId: string;
  /** Inyectable para probar sin red. */
  fetchImpl?: typeof fetch;
};

/**
 * Manda el MP4 al chat para verlo en el teléfono, con sonido, que es como lo verá
 * la gente. Con `sendVideo` y el archivo subido, no con la URL: la Bot API admite
 * 50 MB subiendo y solo 20 por URL, y `sendDocument` no se reproduce en el chat.
 *
 * Quien llama decide qué hacer si falla. En la producción no es fatal: el render
 * y la subida ya costaron minutos.
 */
export async function enviarVideo(
  archivo: { nombre: string; bytes: Uint8Array },
  caption: string,
  opciones: OpcionesTelegram,
): Promise<void> {
  const hacer = opciones.fetchImpl ?? fetch;
  const formulario = new FormData();
  formulario.append('chat_id', opciones.chatId);
  formulario.append('caption', caption.slice(0, MAX_CAPTION));
  formulario.append('supports_streaming', 'true');
  formulario.append(
    'video',
    new Blob([new Uint8Array(archivo.bytes)], { type: 'video/mp4' }),
    archivo.nombre,
  );

  const res = await hacer(`https://api.telegram.org/bot${opciones.token}/sendVideo`, {
    method: 'POST',
    body: formulario,
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || !json.ok) {
    // La descripción de Telegram, nunca la URL: lleva el token dentro.
    throw new Error(`Telegram rechazo el video: ${json.description ?? `HTTP ${res.status}`}`);
  }
}
```

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/telegram.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 3` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `caption.slice(0, MAX_CAPTION)` → `caption` | «el caption se recorta a 1024 caracteres» |
| `sendVideo` → `sendDocument` en la URL | «sube el archivo con sendVideo» |
| en el `throw`, `json.description` → `` `${res.url}` `` | «…y sin el token» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/telegram.ts lib/reels/telegram.test.ts
git commit -m "feat(reels): mandar el MP4 a Telegram para revisarlo en el telefono"
```

---

### Task 6: el guion con Gemini

**Files:**
- Create: `lib/reels/guion.ts`, `lib/reels/guion.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/guion.test.ts`:

```typescript
// lib/reels/guion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarGuion, leerRespuesta, llamarGemini, promptGuion } from './guion.ts';
import type { Pieza } from '../piezas/tipos.ts';

const pieza: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  producto: 'pukaia',
  caption: 'Caption del carrusel',
  slides: [
    { titular: 'No es un chatbot' },
    { titular: 'Un CRM recuerda', bajada: 'Cada conversación es un cliente.' },
  ],
};

test('el prompt pide un párrafo por slide y da los hechos del producto', () => {
  const prompt = promptGuion(pieza);
  assert.match(prompt, /Exactamente 2 párrafos/);
  assert.match(prompt, /\$14\.99/);
  assert.match(prompt, /Caption del carrusel/);
  assert.ok(!prompt.includes('AFIRMACIONES PROHIBIDAS'), 'PukaIA no lleva las de PukaHealth');
});

test('a PukaHealth le llegan las afirmaciones prohibidas', () => {
  const salud: Pieza = { ...pieza, sistema: 'health', producto: 'pukahealth' };
  assert.match(promptGuion(salud), /AFIRMACIONES PROHIBIDAS/);
});

test('lee el JSON aunque venga dentro de un bloque de código', () => {
  // La valla se construye en vez de escribirse: este plan también es markdown.
  const valla = '`'.repeat(3);
  const respuesta = `${valla}json\n{"guion": "Uno.\\n\\nDos.", "caption": "C"}\n${valla}`;
  assert.deepEqual(leerRespuesta(respuesta), { guion: 'Uno.\n\nDos.', caption: 'C' });
});

test('una respuesta sin guion, o que no es JSON, falla: no hay respaldo', () => {
  assert.throws(() => leerRespuesta('{"caption": "C"}'), /sin guion o sin caption/);
  assert.throws(() => leerRespuesta('Aquí tienes tu guion: ...'), /JSON válido/);
});

test('generarGuion le pasa el prompt al modelo y devuelve lo que leyó', async () => {
  let recibido = '';
  const generado = await generarGuion(pieza, async (prompt) => {
    recibido = prompt;
    return '{"guion": "A.\\n\\nB.", "caption": "C"}';
  });
  assert.equal(recibido, promptGuion(pieza));
  assert.deepEqual(generado, { guion: 'A.\n\nB.', caption: 'C' });
});

test('sin API_KEY la llamada real falla al llamarla, no al construirla', async () => {
  const llamar = llamarGemini(undefined);
  await assert.rejects(() => llamar('lo que sea'), /Falta API_KEY/);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/guion.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/guion.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/guion.ts`:

```typescript
// lib/reels/guion.ts
import { GoogleGenAI } from '@google/genai';
import { CATALOGO } from '../piezas/catalogo.ts';
import { PROHIBIDAS } from '../piezas/prohibidas.ts';
import type { Pieza } from '../piezas/tipos.ts';

/** El mismo modelo que los captions de Facebook: el Flash 3.x más reciente. */
export const MODELO_REEL = process.env.MODELO_REEL ?? 'gemini-3.8-flash';

export type GuionGenerado = { guion: string; caption: string };

export function promptGuion(pieza: Pieza): string {
  const producto = pieza.producto ? CATALOGO[pieza.producto] : undefined;

  const hechos = producto
    ? `PRODUCTO: ${producto.nombre} (pukadigital.com${producto.url})
- Precios oficiales: ${producto.precios.length > 0 ? producto.precios.map((p) => `$${p}`).join(', ') : 'sin precio visible: no menciones precios'}
- Ofertas permitidas: ${producto.ofertas.length > 0 ? producto.ofertas.join(', ') : 'ninguna'}`
    : 'PRODUCTO: pieza de utilidad, no vende nada. No menciones precios ni ofertas.';

  const prohibidas =
    pieza.producto === 'pukahealth'
      ? `\nAFIRMACIONES PROHIBIDAS (PukaHealth):\n${PROHIBIDAS.map((p) => `- ${p.motivo}. En su lugar: ${p.enCambio}`).join('\n')}\n`
      : '';

  const slides = pieza.slides
    .map((slide, i) => {
      const dato = slide.dato ? ` [${slide.dato.valor} ${slide.dato.etiqueta}]` : '';
      const bajada = slide.bajada ? `\n  ${slide.bajada}` : '';
      return `Slide ${i + 1}: ${slide.titular}${dato}${bajada}`;
    })
    .join('\n');

  return `Escribe el guion hablado de un Reel vertical de PukaDigital, narrado en español neutro por una voz sintética, y el texto que acompaña al post.

${hechos}
${prohibidas}
LAS SLIDES DEL CARRUSEL, EN ORDEN:
${slides}

REGLAS DEL GUION:
1. Exactamente ${pieza.slides.length} párrafos, uno por slide y en el mismo orden, separados por una línea en blanco. Cada párrafo es una escena del video.
2. Entre 60 y 90 palabras en total: el Reel dura de 20 a 30 segundos.
3. El primer párrafo plantea el problema en los primeros 3 segundos. Nada de saludos ni de presentarse.
4. Escrito para oírse, no para leerse: frases cortas y completas, sin listas, sin emojis y sin símbolos. Los precios, en palabras ("catorce noventa y nueve").
5. No inventes nada: solo lo que dicen las slides y los hechos de arriba.

REGLAS DEL CAPTION:
1. Distinto del caption del carrusel${pieza.caption ? `, que es:\n"""${pieza.caption}"""` : ''}.
2. De dos a cuatro frases, sin hashtags, y cerrando con pukadigital.com${producto ? producto.url : ''}.

Devuelve SOLO un JSON con esta forma, sin texto alrededor:
{"guion": "párrafo uno\\n\\npárrafo dos", "caption": "..."}`;
}

/**
 * Quita la valla de un bloque de código, que Gemini pone la mitad de las veces.
 * El carácter va en escape Unicode y no literal: así esta función se puede pegar
 * dentro de un documento markdown sin cerrarle el bloque.
 */
function sinValla(texto: string): string {
  const valla = '`'.repeat(3);
  const lineas = texto.trim().split('\n');
  if (lineas.length > 1 && lineas[0].trimStart().startsWith(valla)) lineas.shift();
  if (lineas.length > 0 && lineas[lineas.length - 1].trimStart().startsWith(valla)) lineas.pop();
  return lineas.join('\n').trim();
}

export function leerRespuesta(texto: string): GuionGenerado {
  const limpio = sinValla(texto);
  let datos: unknown;
  try {
    datos = JSON.parse(limpio);
  } catch {
    throw new Error(`Gemini no devolvió un JSON válido: ${limpio.slice(0, 120)}`);
  }
  const { guion, caption } = datos as Partial<GuionGenerado>;
  if (typeof guion !== 'string' || guion.trim() === '' || typeof caption !== 'string' || caption.trim() === '') {
    throw new Error('Gemini devolvió un JSON sin guion o sin caption');
  }
  return { guion: guion.trim(), caption: caption.trim() };
}

export async function generarGuion(
  pieza: Pieza,
  llamar: (prompt: string) => Promise<string>,
): Promise<GuionGenerado> {
  return leerRespuesta(await llamar(promptGuion(pieza)));
}

/**
 * La llamada real. **No hay respaldo si falla**: un guion pegando las slides
 * suena a robot dicho en voz alta, y es peor que no tener Reel. Sin `API_KEY`
 * falla al llamarla, no al construirla: una pieza que ya trae guion no la
 * necesita.
 */
export function llamarGemini(
  apiKey: string | undefined,
  modelo = MODELO_REEL,
): (prompt: string) => Promise<string> {
  return async (prompt) => {
    if (!apiKey) {
      throw new Error('Falta API_KEY para escribir el guion con Gemini, o escribe reel.guion a mano en la pieza.');
    }
    const ai = new GoogleGenAI({ apiKey });
    const respuesta = await ai.models.generateContent({ model: modelo, contents: prompt });
    const texto = respuesta.text?.trim();
    if (!texto) {
      throw new Error('Gemini no devolvió contenido para el guion.');
    }
    return texto;
  };
}
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `llamarGemini` **no** tiene valor por defecto para `apiKey`: si lo tuviera, pasarle `undefined` en el test usaría la variable de entorno y podría llamar a la API de verdad.
- El `\\n\\n` del último bloque del prompt es intencional: el modelo tiene que ver los caracteres `\n\n` dentro de un JSON de ejemplo.

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/guion.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 6` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `Exactamente ${pieza.slides.length} párrafos` → `Varios párrafos` | «el prompt pide un párrafo por slide» |
| `pieza.producto === 'pukahealth'` → `false` | «a PukaHealth le llegan las afirmaciones prohibidas» |
| en `leerRespuesta`, borrar la comprobación de `caption` | «una respuesta sin guion, o que no es JSON, falla» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/guion.ts lib/reels/guion.test.ts
git commit -m "feat(reels): el guion lo escribe Gemini con las slides y los hechos"
```

---

### Task 7: la composición

**Files:**
- Create: `lib/reels/composicion.ts`, `lib/reels/composicion.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/composicion.test.ts`:

```typescript
// lib/reels/composicion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AVISO, FONDO_AVISO } from '../piezas/capturas.ts';
import { sistemas } from '../piezas/sistemas.ts';
import { ALTO, ANCHO, TEXTO_AVISO, VIDRIO_VIDEO, composicion, escapar, type EntradaComposicion } from './composicion.ts';
import { escenasDesde } from './tiempos.ts';
import type { Pieza } from '../piezas/tipos.ts';

const pieza: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  producto: 'pukaia',
  slides: [
    { badge: 'CRM PARA WHATSAPP', titular: 'No es un chatbot', bajada: 'Y la diferencia se nota.' },
    { titular: 'Un CRM recuerda', dato: { valor: '$14.99', etiqueta: 'al mes' }, captura: 'validar-receta.png' },
  ],
};

const PARRAFOS = ['Un chatbot responde y ya.', 'Un CRM recuerda quién eres.'];

function entrada(extra: Partial<EntradaComposicion> = {}): EntradaComposicion {
  const { escenas, total } = escenasDesde(PARRAFOS, [2, 3.5]);
  return {
    pieza,
    escenas,
    total,
    audios: ['voz-0.wav', 'voz-1.wav'],
    gsapArchivo: 'gsap.min.js',
    fuentes: [],
    cargarCaptura: (archivo) => `data:image/png;base64,CAPTURA-${archivo}`,
    ...extra,
  };
}

test('la raíz declara el vertical, empieza en 0, dura lo que suman las escenas y registra su línea de tiempo', () => {
  const html = composicion(entrada());
  assert.match(
    html,
    /<div id="root" data-composition-id="reel-crm-no-chatbot" data-start="0" data-duration="7" data-width="1080" data-height="1920">/,
  );
  assert.match(html, /window\.__timelines\['reel-crm-no-chatbot'\] = tl;/);
  assert.equal(ANCHO * 16, ALTO * 9);
});

test('una escena por slide con sus tiempos, y la voz de cada una entra con su escena', () => {
  const html = composicion(entrada());
  assert.match(html, /<section id="escena-0" class="clip" data-start="0" data-duration="2.7"/);
  assert.match(html, /<section id="escena-1" class="clip" data-start="2.7" data-duration="4.3"/);
  assert.match(html, /<audio id="voz-0" src="voz-0.wav" data-start="0.3"/);
  assert.match(html, /<audio id="voz-1" src="voz-1.wav" data-start="2.7"/);
});

test('todos los colores salen de los tokens, del aviso o del vidrio de video', () => {
  for (const sistema of ['puka', 'health'] as const) {
    const html = composicion(entrada({ pieza: { ...pieza, sistema } }));
    const tokens = sistemas[sistema];
    const permitidos = new Set([
      tokens.fondo, tokens.tinta, tokens.acento, tokens.apoyo, tokens.borde, tokens.suave, tokens.glass,
      FONDO_AVISO, TEXTO_AVISO, VIDRIO_VIDEO.fondo, VIDRIO_VIDEO.borde,
    ]);
    const colores = html.match(/#[0-9A-Fa-f]{3,8}\b|rgba?\([^)]*\)/g) ?? [];
    assert.ok(colores.length > 0, 'el HTML tiene que llevar colores');
    for (const color of colores) {
      assert.ok(permitidos.has(color), `${color} no sale de ningún token (${sistema})`);
    }
  }
});

test('el aviso de datos ficticios va literal en la escena con captura, y solo en esa', () => {
  const html = composicion(entrada());
  assert.equal(html.split(AVISO).length - 1, 1);
  const escenaConCaptura = html.slice(html.indexOf('id="escena-1"'), html.indexOf('id="voz-0"'));
  assert.ok(escenaConCaptura.includes(AVISO));
  assert.ok(escenaConCaptura.includes('data:image/png;base64,CAPTURA-validar-receta.png'));
});

test('cada subtítulo aparece y desaparece en sus tiempos', () => {
  const datos = entrada();
  const html = composicion(datos);
  const primero = datos.escenas[0].subtitulos[0];
  assert.ok(html.includes(`tl.set('#s0-0', { opacity: 1 }, ${primero.inicio});`));
  assert.ok(html.includes(`tl.set('#s0-0', { opacity: 0 }, ${primero.fin});`));
});

test('el texto de las slides se escapa', () => {
  assert.equal(escapar('<b>"A" & B</b>'), '&lt;b&gt;&quot;A&quot; &amp; B&lt;/b&gt;');
  const conEtiqueta = composicion(entrada({ pieza: { ...pieza, slides: [{ titular: 'Uno <script>' }, pieza.slides[1]] } }));
  assert.ok(conEtiqueta.includes('Uno &lt;script&gt;'));
});

test('nada se carga de la red: las fuentes van embebidas y GSAP es un archivo de al lado', () => {
  const html = composicion(entrada({
    fuentes: [{ name: 'Instrument Sans', weight: 400, style: 'normal', data: Buffer.from('fuente') }],
  }));
  assert.ok(!/\b(?:src|href)="https?:/.test(html), 'ningún recurso remoto');
  assert.ok(!/url\(https?:/.test(html), 'ninguna fuente remota');
  // GSAP va referenciado, no en línea: en línea el lint de HyperFrames lee su
  // `Math.random()` como código nuestro y aborta el render.
  assert.ok(html.includes('<script src="gsap.min.js"></script>'));
  assert.ok(!html.includes('<script>window.gsap'), 'GSAP nunca en línea');
  assert.match(html, /font-display: block/);
});

test('slides, escenas y audios tienen que coincidir', () => {
  assert.throws(() => composicion(entrada({ audios: ['voz-0.wav'] })), /tienen que coincidir/);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/composicion.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/composicion.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/composicion.ts`:

```typescript
// lib/reels/composicion.ts
import { AVISO, FONDO_AVISO, medidasAviso } from '../piezas/capturas.ts';
import { FORMATOS, MARGEN } from '../piezas/formatos.ts';
import { sistemas } from '../piezas/sistemas.ts';
import type { Fuente } from '../piezas/fuentes.ts';
import type { Pieza } from '../piezas/tipos.ts';
import type { Escena } from './tiempos.ts';

export const ANCHO = 1080;
export const ALTO = 1920;

/**
 * Dark Glass Rojo usa en web vidrio a 0.04 y bordes de 1 px a 0.08: tras la
 * compresión H.264 desaparecen. En video, los colores y las tipografías son los
 * del sistema; la opacidad y el grosor, estos.
 */
export const VIDRIO_VIDEO = {
  fondo: 'rgba(255,255,255,0.10)',
  borde: 'rgba(255,255,255,0.22)',
  grosor: 3,
} as const;

/** `PUKAHEALTH_LIMITES.md`: barra en `#0D1717` con el texto blanco, centrado. */
export const TEXTO_AVISO = '#FFFFFF';

export type EntradaComposicion = {
  pieza: Pieza;
  escenas: Escena[];
  total: number;
  /** El archivo de voz de cada escena, relativo al `index.html`. */
  audios: string[];
  /**
   * El archivo de GSAP, relativo al `index.html`. **Va como archivo, no en
   * línea**: el lint de HyperFrames analiza los scripts en línea, y GSAP usa
   * `Math.random()` y `Date.now()` por dentro, así que `render --strict` aborta
   * con `non_deterministic_code`. Medido en el render del paso 0, el 2026-09-13.
   */
  gsapArchivo: string;
  fuentes: Fuente[];
  /** La captura como data URI. Inyectable para no leer disco en los tests. */
  cargarCaptura: (archivo: string) => string;
};

export function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function idComposicion(pieza: Pieza): string {
  return `reel-${pieza.id}`;
}

export function composicion(entrada: EntradaComposicion): string {
  const { pieza, escenas, total, audios } = entrada;
  if (escenas.length !== pieza.slides.length || audios.length !== escenas.length) {
    throw new Error(
      `${pieza.slides.length} slides, ${escenas.length} escenas y ${audios.length} audios: tienen que coincidir`,
    );
  }

  const tokens = sistemas[pieza.sistema];
  const seguro = FORMATOS['9x16'];
  const aviso = medidasAviso(ALTO, ANCHO - 2 * MARGEN);
  const id = idComposicion(pieza);
  // El sistema claro no lleva vidrio: su tarjeta es el azul suave de la marca.
  const fondoTarjeta = tokens.glass ? VIDRIO_VIDEO.fondo : (tokens.suave ?? tokens.fondo);
  const bordeTarjeta = tokens.glass ? VIDRIO_VIDEO.borde : tokens.borde;

  const caras = entrada.fuentes
    .map(
      (fuente) =>
        `@font-face { font-family: '${fuente.name}'; src: url(data:font/ttf;base64,${fuente.data.toString('base64')}) format('truetype'); font-weight: ${fuente.weight}; font-style: normal; font-display: block; }`,
    )
    .join('\n');

  const css = `${caras}
html, body { margin: 0; width: ${ANCHO}px; height: ${ALTO}px; overflow: hidden; background: ${tokens.fondo}; }
#root { position: relative; width: ${ANCHO}px; height: ${ALTO}px; overflow: hidden; background: ${tokens.fondo}; color: ${tokens.tinta}; font-family: 'Instrument Sans', sans-serif; }
.clip { position: absolute; inset: 0; }
.contenido { position: absolute; left: ${MARGEN}px; right: ${MARGEN}px; top: ${seguro.seguroArriba}px; bottom: ${seguro.seguroAbajo + 200}px; display: flex; flex-direction: column; justify-content: center; gap: 36px; }
.badge { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 34px; letter-spacing: 0.08em; color: ${tokens.acento}; }
.titular { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 96px; line-height: 1.02; margin: 0; }
.bajada { font-size: 44px; line-height: 1.3; margin: 0; color: ${tokens.apoyo}; }
.dato { display: flex; align-items: baseline; gap: 20px; }
.dato-valor { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 120px; color: ${tokens.acento}; }
.dato-etiqueta { font-size: 40px; color: ${tokens.apoyo}; }
.tarjeta { background: ${fondoTarjeta}; border: ${VIDRIO_VIDEO.grosor}px solid ${bordeTarjeta}; border-radius: 28px; overflow: hidden; }
.captura { display: block; width: 100%; }
.aviso { height: ${aviso.alto}px; display: flex; align-items: center; justify-content: center; background: ${FONDO_AVISO}; color: ${TEXTO_AVISO}; font-size: ${aviso.fuente}px; font-weight: 600; }
.subtitulo { position: absolute; left: ${MARGEN}px; right: ${MARGEN}px; bottom: ${seguro.seguroAbajo + 40}px; text-align: center; opacity: 0; }
.subtitulo span { display: inline-block; padding: 12px 24px; border-radius: 16px; background: ${tokens.tinta}; color: ${tokens.fondo}; font-weight: 600; font-size: 56px; line-height: 1.2; }`;

  const secciones = escenas
    .map((escena, i) => {
      const slide = pieza.slides[i];
      const partes = [
        slide.badge ? `<div class="badge">${escapar(slide.badge)}</div>` : '',
        `<div class="titular">${escapar(slide.titular)}</div>`,
        slide.bajada ? `<p class="bajada">${escapar(slide.bajada)}</p>` : '',
        slide.dato
          ? `<div class="dato"><span class="dato-valor">${escapar(slide.dato.valor)}</span><span class="dato-etiqueta">${escapar(slide.dato.etiqueta)}</span></div>`
          : '',
        slide.captura
          ? `<div class="tarjeta"><img class="captura" src="${entrada.cargarCaptura(slide.captura)}" alt="" /><div class="aviso">${escapar(AVISO)}</div></div>`
          : '',
      ]
        .filter(Boolean)
        .join('\n        ');

      const subtitulos = escena.subtitulos
        .map((sub, j) => `<div class="subtitulo" id="s${i}-${j}"><span>${escapar(sub.texto)}</span></div>`)
        .join('\n      ');

      return `    <section id="escena-${i}" class="clip" data-start="${escena.inicio}" data-duration="${escena.duracion}" data-track-index="${i}">
      <div class="contenido" id="c${i}">
        ${partes}
      </div>
      ${subtitulos}
    </section>`;
    })
    .join('\n');

  const voces = escenas
    .map(
      (escena, i) =>
        `    <audio id="voz-${i}" src="${escapar(audios[i])}" data-start="${escena.voz}" data-volume="1"></audio>`,
    )
    .join('\n');

  // Todo se construye de forma síncrona y sin `Math.random()`: el render seekea
  // la línea de tiempo fotograma a fotograma y tiene que dar siempre lo mismo.
  const pasos = escenas
    .flatMap((escena, i) => [
      `tl.fromTo('#c${i}', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, ${escena.inicio});`,
      ...escena.subtitulos.flatMap((sub, j) => [
        `tl.set('#s${i}-${j}', { opacity: 1 }, ${sub.inicio});`,
        `tl.set('#s${i}-${j}', { opacity: 0 }, ${sub.fin});`,
      ]),
    ])
    .join('\n      ');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${ANCHO}, height=${ALTO}" />
    <script src="${escapar(entrada.gsapArchivo)}"></script>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${id}" data-start="0" data-duration="${total}" data-width="${ANCHO}" data-height="${ALTO}">
${secciones}
${voces}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      ${pasos}
      window.__timelines['${id}'] = tl;
    </script>
  </body>
</html>
`;
}
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `AVISO`, `FONDO_AVISO` y `medidasAviso()` ya existen en `lib/piezas/capturas.ts`, y `MARGEN` y `FORMATOS` en `formatos.ts`. No recrear ninguno: que sean los mismos que usan las imágenes es justo el punto.
- La zona segura deja `seguroAbajo + 200` libre abajo en `.contenido` porque ahí van los subtítulos.

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/composicion.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 8` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `background: ${FONDO_AVISO}` → `background: #123456` | «todos los colores salen de los tokens» |
| borrar el `<div class="aviso">…</div>` de la tarjeta | «el aviso de datos ficticios va literal…» |
| `data-duration="${total}"` → `data-duration="10"` | «la raíz declara el vertical…» |
| en `escapar`, borrar el reemplazo de `<` | «el texto de las slides se escapa» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/composicion.ts lib/reels/composicion.test.ts
git commit -m "feat(reels): la composicion HTML desde los tokens del sistema"
```

---

### Task 8: ejecutar comandos, y el bloque para pegar

**Files:**
- Create: `lib/reels/herramientas.ts`, `lib/reels/herramientas.test.ts`, `lib/reels/bloque.ts`, `lib/reels/bloque.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/herramientas.test.ts`:

```typescript
// lib/reels/herramientas.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ejecutar } from './herramientas.ts';

test('ejecutar devuelve la salida del comando', async () => {
  const { stdout } = await ejecutar(process.execPath, ['-e', 'process.stdout.write("hola")']);
  assert.equal(stdout, 'hola');
});

test('si el comando falla, el error trae sus últimas líneas de stderr', async () => {
  await assert.rejects(
    () => ejecutar(process.execPath, ['-e', 'console.error("uno\\ndos\\ntres\\ncuatro"); process.exit(3)']),
    /dos \| tres \| cuatro/,
  );
});

test('y si el comando solo escribió en stdout, el error trae eso', async () => {
  // HyperFrames escribe ahí sus errores de lint. Sin esto, un render abortado
  // deja «Command failed» y nada más: pasó en el ensayo del paso 0.
  await assert.rejects(
    () => ejecutar(process.execPath, ['-e', 'console.log("non_deterministic_code"); process.exit(3)']),
    /non_deterministic_code/,
  );
});
```

Crear `lib/reels/bloque.test.ts`:

```typescript
// lib/reels/bloque.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bloqueReel } from './bloque.ts';

test('el bloque se pega en el archivo del mes y vuelve a dar el mismo reel', () => {
  const reel = {
    guion: 'Uno dos.\n\nTres "cuatro".',
    caption: "Caption con 'comillas'",
    video: 'https://reels.pukadigital.com/reels/2026-10/x-1a2b3c4d.mp4',
    duracion: 24.3,
  };
  const leido = new Function(`return {${bloqueReel(reel)}}`)() as { reel: typeof reel };
  assert.deepEqual(leido.reel, reel);
});

test('el guion va un párrafo por línea, para leerlo en el PR', () => {
  const bloque = bloqueReel({ guion: 'Uno.\n\nDos.', caption: 'c', video: 'v', duracion: 3 });
  assert.match(bloque, /guion:\n {4}"Uno\.\\n\\n" \+\n {4}"Dos\.",/);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/herramientas.test.ts lib/reels/bloque.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 2` — ninguno de los dos módulos existe todavía.

- [ ] **Step 3: implementar**

Crear `lib/reels/herramientas.ts`:

```typescript
// lib/reels/herramientas.ts
import { execFile } from 'node:child_process';

/**
 * La versión va fija: HyperFrames saca versión casi a diario, y un render que
 * cambia solo no es reproducible. Se invoca con `npx -y`, así que no entra como
 * dependencia del proyecto: `npm ci` no se trae Chrome ni ffmpeg.
 */
export const HYPERFRAMES = 'hyperframes@0.8.36';

export type Ejecutar = (
  comando: string,
  argumentos: string[],
  opciones?: { cwd?: string; env?: Record<string, string> },
) => Promise<{ stdout: string; stderr: string }>;

/**
 * La única capa que toca el sistema. Se inyecta en `producirReel`, y por eso los
 * tests no necesitan ffmpeg, ni Chrome, ni red.
 */
export const ejecutar: Ejecutar = (comando, argumentos, opciones = {}) =>
  new Promise((resolver, rechazar) => {
    execFile(
      comando,
      argumentos,
      { cwd: opciones.cwd, env: { ...process.env, ...opciones.env }, maxBuffer: 64 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          // HyperFrames escribe sus errores en stdout, no en stderr: sin mirar los
          // dos, un render abortado por el lint deja un «Command failed» sin motivo.
          const salida = stderr.trim() || stdout.trim();
          const detalle = salida.split('\n').slice(-6).join(' | ') || error.message;
          rechazar(new Error(`${comando} ${argumentos.slice(0, 3).join(' ')} falló: ${detalle}`));
        } else {
          resolver({ stdout, stderr });
        }
      },
    );
  });
```

Crear `lib/reels/bloque.ts`:

```typescript
// lib/reels/bloque.ts
import { parrafosDelGuion } from '../piezas/guion.ts';

/**
 * El bloque `reel` listo para pegar en `content/piezas/<mes>.ts`. **Se imprime,
 * no se escribe en el archivo**: los calendarios del mes son TypeScript con
 * comentarios, y el pegado a mano es el momento en que una persona lee lo que
 * escribió el modelo. Es lo mismo que hace `npm run captions`.
 */
export function bloqueReel(reel: {
  guion: string;
  caption: string;
  video: string;
  duracion: number;
}): string {
  const parrafos = parrafosDelGuion(reel.guion);
  const guion = parrafos
    .map((parrafo, i) => `    ${JSON.stringify(i < parrafos.length - 1 ? `${parrafo}\n\n` : parrafo)}`)
    .join(' +\n');

  return `reel: {
  guion:
${guion},
  caption: ${JSON.stringify(reel.caption)},
  video: ${JSON.stringify(reel.video)},
  duracion: ${reel.duracion},
},`;
}
```

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/reels/herramientas.test.ts lib/reels/bloque.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 5` · `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `stderr.trim().split('\n').slice(-3)` → `[]` | «si el comando falla, el error trae sus últimas líneas» |
| en `bloqueReel`, `JSON.stringify(reel.caption)` → `` `'${reel.caption}'` `` | «el bloque se pega… y vuelve a dar el mismo reel» (el caption lleva comillas) |
| `i < parrafos.length - 1 ? `${parrafo}\n\n` : parrafo` → `parrafo` | «el bloque se pega…» y «el guion va un párrafo por línea» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/herramientas.ts lib/reels/herramientas.test.ts lib/reels/bloque.ts lib/reels/bloque.test.ts
git commit -m "feat(reels): ejecutar comandos inyectable y el bloque para pegar"
```

---

### Task 9: la tubería

**Files:**
- Create: `lib/reels/producir.ts`, `lib/reels/producir.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

Crear `lib/reels/producir.test.ts`:

```typescript
// lib/reels/producir.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { producirReel, type Dependencias } from './producir.ts';
import type { Pieza } from '../piezas/tipos.ts';

const PIEZA: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  producto: 'pukaia',
  caption: 'Caption del carrusel',
  slides: [{ titular: 'No es un chatbot' }, { titular: 'Un CRM recuerda' }],
};

const GUION = 'Un chatbot responde lo que le preguntas y ya.\n\nUn CRM recuerda quién eres y qué querías.';
const CON_GUION: Pieza = { ...PIEZA, reel: { guion: GUION, caption: 'Caption del Reel' } };

const PROBE = JSON.stringify({
  streams: [
    { codec_type: 'video', codec_name: 'h264', width: 1080, height: 1920, pix_fmt: 'yuv420p', r_frame_rate: '30/1' },
    { codec_type: 'audio', codec_name: 'aac', sample_rate: '48000', channels: 2 },
  ],
  format: { duration: '9.84', size: '2000000' },
});

function dependencias(extra: Partial<Dependencias> = {}) {
  const comandos: string[] = [];
  const archivos = new Map<string, string>();
  const avisos: string[] = [];
  const base: Dependencias = {
    ejecutar: async (comando, argumentos) => {
      comandos.push([comando, ...argumentos.slice(0, 3)].join(' '));
      if (comando === 'ffprobe' && argumentos.includes('format=duration')) return { stdout: '3.2\n', stderr: '' };
      if (comando === 'ffprobe') return { stdout: PROBE, stderr: '' };
      return { stdout: '', stderr: '' };
    },
    llamarModelo: async () => {
      throw new Error('no debería llamar al modelo');
    },
    leerArchivo: () => new TextEncoder().encode('hola'),
    escribirArchivo: (ruta, contenido) => {
      archivos.set(ruta, contenido);
    },
    crearCarpeta: () => '/tmp/reel-prueba',
    gsap: '/* gsap */',
    fuentes: [],
    cargarCaptura: () => 'data:image/png;base64,X',
    r2: { bucket: 'pukadigital-reels', baseUrl: 'https://reels.pukadigital.com' },
    regenerarGuion: false,
    avisar: (mensaje) => {
      avisos.push(mensaje);
    },
    ...extra,
  };
  return { d: base, comandos, archivos, avisos };
}

test('con guion escrito no llama al modelo, y produce en orden: voz, medida, render, normalizar, verificar y subir', async () => {
  const { d, comandos } = dependencias();
  await producirReel(CON_GUION, '2026-10', d);
  assert.deepEqual(comandos, [
    'npx -y hyperframes@0.8.36 tts',
    'ffprobe -v error -show_entries',
    'npx -y hyperframes@0.8.36 tts',
    'ffprobe -v error -show_entries',
    'npx -y hyperframes@0.8.36 render',
    'ffmpeg -y -i render.mp4',
    'ffprobe -v error -print_format',
    'npx wrangler r2 object',
  ]);
});

test('sin guion se lo pide al modelo, y si no pasa la validación no renderiza nada', async () => {
  const { d, comandos } = dependencias({
    llamarModelo: async () => '{"guion": "Un solo parrafo no alcanza para dos slides de esta pieza.", "caption": "C"}',
  });
  await assert.rejects(() => producirReel(PIEZA, '2026-10', d), /párrafos y 2 slides/);
  assert.deepEqual(comandos, []);
});

test('--regenerar-guion ignora el guion escrito y vuelve a pedirlo', async () => {
  let llamado = false;
  const { d } = dependencias({
    regenerarGuion: true,
    llamarModelo: async () => {
      llamado = true;
      return JSON.stringify({ guion: GUION, caption: 'Otro caption' });
    },
  });
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.ok(llamado);
  assert.equal(reel.caption, 'Otro caption');
});

test('si el MP4 no cumple lo que exige Meta, no se sube nada', async () => {
  const malo = PROBE.replace('"48000"', '"24000"');
  const comandos: string[] = [];
  const { d } = dependencias({
    ejecutar: async (comando, argumentos) => {
      comandos.push([comando, ...argumentos.slice(0, 3)].join(' '));
      if (comando === 'ffprobe' && argumentos.includes('format=duration')) return { stdout: '3.2\n', stderr: '' };
      if (comando === 'ffprobe') return { stdout: malo, stderr: '' };
      return { stdout: '', stderr: '' };
    },
  });
  await assert.rejects(() => producirReel(CON_GUION, '2026-10', d), /48000/);
  assert.ok(!comandos.some((c) => c.includes('wrangler')));
});

test('el resultado trae la URL con el hash del MP4 y la duración del render', async () => {
  const { d } = dependencias();
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.equal(reel.video, 'https://reels.pukadigital.com/reels/2026-10/crm-no-chatbot-b221d9db.mp4');
  assert.equal(reel.duracion, 9.8);
  assert.equal(reel.archivo, '/tmp/reel-prueba/reel.mp4');
});

test('en ensayo, sin R2, renderiza y verifica pero no sube nada', async () => {
  const { d, comandos, avisos } = dependencias({ r2: undefined });
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.equal(reel.video, '');
  assert.ok(!comandos.some((c) => c.includes('wrangler')));
  assert.ok(avisos.some((a) => a.includes('Ensayo')));
});

test('si Telegram falla, el reel se entrega igual y queda el aviso', async () => {
  const { d, avisos } = dependencias({
    telegram: { token: 't', chatId: '1' },
    enviar: async () => {
      throw new Error('chat not found');
    },
  });
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.ok(reel.video.startsWith('https://'));
  assert.ok(avisos.some((a) => a.includes('chat not found')));
});

test('la composición se escribe en la carpeta del render, con la voz de cada párrafo y GSAP al lado', async () => {
  const { d, archivos } = dependencias();
  await producirReel(CON_GUION, '2026-10', d);
  const html = archivos.get('/tmp/reel-prueba/index.html') ?? '';
  assert.match(html, /<audio id="voz-1" src="voz-1.wav"/);
  // GSAP como archivo hermano, no en línea: si no, `render --strict` aborta.
  assert.equal(archivos.get('/tmp/reel-prueba/gsap.min.js'), '/* gsap */');
  assert.match(html, /<script src="gsap\.min\.js"><\/script>/);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/reels/producir.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 1` — el archivo no carga: `lib/reels/producir.ts` no existe.

- [ ] **Step 3: implementar**

Crear `lib/reels/producir.ts`:

```typescript
// lib/reels/producir.ts
import { join } from 'node:path';
import { parrafosDelGuion } from '../piezas/guion.ts';
import { formatear, validar } from '../piezas/validar.ts';
import type { Fuente } from '../piezas/fuentes.ts';
import type { Pieza } from '../piezas/tipos.ts';
import { composicion } from './composicion.ts';
import { generarGuion } from './guion.ts';
import { HYPERFRAMES, type Ejecutar } from './herramientas.ts';
import { argumentosSubida, claveReel, urlReel } from './r2.ts';
import { enviarVideo } from './telegram.ts';
import { escenasDesde } from './tiempos.ts';
import { ARGUMENTOS_FFPROBE, argumentosNormalizar, erroresDeVideo, type Ffprobe } from './verificacion.ts';

/** La voz elegida el 2026-09-13, escuchando cuatro candidatas. */
const VOZ = 'ef_dora';

export type Dependencias = {
  ejecutar: Ejecutar;
  llamarModelo: (prompt: string) => Promise<string>;
  leerArchivo: (ruta: string) => Uint8Array;
  escribirArchivo: (ruta: string, contenido: string) => void;
  crearCarpeta: () => string;
  gsap: string;
  fuentes: Fuente[];
  cargarCaptura: (archivo: string) => string;
  /** Sin `r2` es un ensayo: se renderiza y se verifica, pero no se sube nada. */
  r2?: { bucket: string; baseUrl: string };
  telegram?: { token: string; chatId: string };
  /** El Python con `kokoro-onnx` y `soundfile`, para `hyperframes tts`. */
  python?: string;
  regenerarGuion: boolean;
  avisar: (mensaje: string) => void;
  /** Inyectable para probar el aviso sin red. */
  enviar?: typeof enviarVideo;
};

export type ReelProducido = {
  guion: string;
  caption: string;
  /** URL pública en R2, o cadena vacía en un ensayo. */
  video: string;
  duracion: number;
  archivo: string;
};

export async function producirReel(
  pieza: Pieza,
  mes: string,
  d: Dependencias,
): Promise<ReelProducido> {
  // 1. El guion revisado a mano manda, salvo que se pida rehacerlo.
  const escrito = pieza.reel;
  const { guion, caption } =
    escrito && escrito.guion.trim() !== '' && escrito.caption.trim() !== '' && !d.regenerarGuion
      ? { guion: escrito.guion, caption: escrito.caption }
      : await generarGuion(pieza, d.llamarModelo);

  // 2. Antes de gastar minutos renderizando: las mismas puertas que un caption.
  const candidata: Pieza = { ...pieza, reel: { guion, caption, publicarEl: pieza.reel?.publicarEl } };
  const errores = validar([candidata]);
  if (errores.length > 0) {
    throw new Error(`El guion no pasa la validación:\n${formatear(errores)}`);
  }

  const carpeta = d.crearCarpeta();
  const entorno = {
    HYPERFRAMES_NO_TELEMETRY: '1',
    ...(d.python ? { HYPERFRAMES_PYTHON: d.python } : {}),
  };
  const parrafos = parrafosDelGuion(guion);

  // 3. Una voz por párrafo, y lo que dura cada una: ahí se corta la escena.
  const audios: string[] = [];
  const duraciones: number[] = [];
  for (const [i, parrafo] of parrafos.entries()) {
    const audio = `voz-${i}.wav`;
    await d.ejecutar('npx', ['-y', HYPERFRAMES, 'tts', parrafo, '--voice', VOZ, '--output', audio], {
      cwd: carpeta,
      env: entorno,
    });
    const { stdout } = await d.ejecutar(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio],
      { cwd: carpeta },
    );
    const segundos = Number.parseFloat(stdout);
    if (!(segundos > 0)) {
      throw new Error(`No se pudo medir la voz del párrafo ${i + 1}: «${stdout.trim()}»`);
    }
    audios.push(audio);
    duraciones.push(segundos);
  }

  // 4. La composición y el render.
  const { escenas, total } = escenasDesde(parrafos, duraciones);
  // GSAP se escribe como archivo, no en línea: en línea el lint lo lee como
  // código propio y aborta el render por el `Math.random()` que es suyo.
  const GSAP_ARCHIVO = 'gsap.min.js';
  d.escribirArchivo(join(carpeta, GSAP_ARCHIVO), d.gsap);
  d.escribirArchivo(
    join(carpeta, 'index.html'),
    composicion({
      pieza,
      escenas,
      total,
      audios,
      gsapArchivo: GSAP_ARCHIVO,
      fuentes: d.fuentes,
      cargarCaptura: d.cargarCaptura,
    }),
  );
  await d.ejecutar('npx', ['-y', HYPERFRAMES, 'render', '.', '-o', 'render.mp4', '--strict'], {
    cwd: carpeta,
    env: entorno,
  });
  await d.ejecutar('ffmpeg', argumentosNormalizar('render.mp4', 'reel.mp4'), { cwd: carpeta });

  // 5. Lo que exige Meta, sobre el MP4 real. Si no cumple, no se sube nada.
  const { stdout: json } = await d.ejecutar('ffprobe', ARGUMENTOS_FFPROBE('reel.mp4'), { cwd: carpeta });
  const probe = JSON.parse(json) as Ffprobe;
  const fallos = erroresDeVideo(probe);
  if (fallos.length > 0) {
    throw new Error(`El MP4 no cumple lo que exige Meta:\n  - ${fallos.join('\n  - ')}`);
  }

  const archivo = join(carpeta, 'reel.mp4');
  const bytes = d.leerArchivo(archivo);
  const duracion = Math.round(Number(probe.format.duration) * 10) / 10;

  // 6. R2. Sin configurarlo es un ensayo.
  let video = '';
  if (d.r2) {
    const clave = claveReel(mes, pieza.id, bytes);
    await d.ejecutar('npx', argumentosSubida(d.r2.bucket, clave, archivo));
    video = urlReel(d.r2.baseUrl, clave);
  } else {
    d.avisar('Ensayo: el MP4 no se subió a R2.');
  }

  // 7. Telegram no es fatal: el render y la subida ya costaron minutos.
  if (d.telegram) {
    try {
      await (d.enviar ?? enviarVideo)({ nombre: `${pieza.id}.mp4`, bytes }, caption, d.telegram);
    } catch (error) {
      d.avisar(`No se pudo mandar a Telegram: ${error instanceof Error ? error.message : error}`);
    }
  } else {
    d.avisar('Telegram sin configurar: revisa el video en el archivo local.');
  }

  return { guion, caption, video, duracion, archivo };
}
```

- [ ] **Step 4: comprobar que pasan, y la suite entera**

Run: `node --import tsx --test lib/reels/producir.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 8` · `ℹ fail 0`

Run: `npm test 2>&1 | grep -E "^ℹ (tests|fail)"` y `npx tsc --noEmit; echo "exit=$?"`
Expected: `ℹ tests 225` · `ℹ fail 0` · `exit=0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| borrar el bloque de validación del Step 2 | «sin guion se lo pide al modelo, y si no pasa la validación no renderiza nada» |
| `if (fallos.length > 0)` → `if (false)` | «si el MP4 no cumple lo que exige Meta, no se sube nada» |
| `!d.regenerarGuion` → `true` | «--regenerar-guion ignora el guion escrito» |
| quitar el `try/catch` de Telegram | «si Telegram falla, el reel se entrega igual» |

- [ ] **Step 6: commit**

```bash
git add lib/reels/producir.ts lib/reels/producir.test.ts
git commit -m "feat(reels): la tuberia entera con las herramientas inyectadas"
```

**Caminos de entrada:** `producirReel` la llama `lib/reels/cli.ts`, que es la Task 10. Nada de `lib/publicar/` ni de `app/` la alcanza: la frontera del Worker sigue intacta, y `lib/publicar/frontera.test.ts` lo comprueba.

---

### Task 10: el comando

**Files:**
- Create: `lib/reels/cli.ts`
- Modify: `package.json`

- [ ] **Step 1: GSAP como dependencia de desarrollo** *(este Step lo hace Claude, no `agy`: instala paquetes)*

```bash
npm install --save-dev --save-exact gsap@3.14.2
```

Expected: `package.json` y `package-lock.json` cambian, y `node_modules/gsap/dist/gsap.min.js` existe.

- [ ] **Step 2: el script**

En `package.json`, reemplazar exactamente:

```json
    "publicar": "node --import tsx --env-file-if-exists=.env.local lib/publicar/cli.ts",
```

por:

```json
    "publicar": "node --import tsx --env-file-if-exists=.env.local lib/publicar/cli.ts",
    "reels": "node --import tsx --env-file-if-exists=.env.local lib/reels/cli.ts",
```

- [ ] **Step 3: el comando**

Crear `lib/reels/cli.ts`:

```typescript
// lib/reels/cli.ts
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { piezasDe } from '../../content/piezas/index.ts';
import { cargarCaptura } from '../piezas/capturas.ts';
import { cargarFuentes } from '../piezas/fuentes.ts';
import { bloqueReel } from './bloque.ts';
import { llamarGemini } from './guion.ts';
import { ejecutar } from './herramientas.ts';
import { producirReel } from './producir.ts';

const USO = 'Uso: npm run reels -- --mes 2026-10 --id <pieza> [--ensayo] [--regenerar-guion]';

function argumento(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main(): Promise<void> {
  const mes = argumento('mes');
  const id = argumento('id');
  if (!mes || !id) throw new Error(USO);

  const pieza = piezasDe(mes)?.find((p) => p.id === id);
  if (!pieza) {
    throw new Error(`No hay una pieza «${id}» en ${mes}. ¿Está el mes registrado en content/piezas/index.ts?`);
  }

  const ensayo = process.argv.includes('--ensayo');
  const bucket = process.env.R2_BUCKET;
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!ensayo && (!bucket || !baseUrl)) {
    throw new Error('Faltan R2_BUCKET y R2_PUBLIC_BASE_URL en .env.local. Para probar sin subir nada: --ensayo.');
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const reel = await producirReel(pieza, mes, {
    ejecutar,
    llamarModelo: llamarGemini(process.env.API_KEY),
    leerArchivo: (ruta) => readFileSync(ruta),
    escribirArchivo: (ruta, contenido) => writeFileSync(ruta, contenido),
    crearCarpeta: () => mkdtempSync(join(tmpdir(), `reel-${id}-`)),
    gsap: readFileSync(join(process.cwd(), 'node_modules', 'gsap', 'dist', 'gsap.min.js'), 'utf8'),
    fuentes: cargarFuentes(),
    cargarCaptura,
    r2: !ensayo && bucket && baseUrl ? { bucket, baseUrl } : undefined,
    telegram: token && chatId ? { token, chatId } : undefined,
    python: process.env.HYPERFRAMES_PYTHON,
    regenerarGuion: process.argv.includes('--regenerar-guion'),
    avisar: (mensaje) => console.warn(`⚠️  ${mensaje}`),
  });

  console.log(`\nMP4 local: ${reel.archivo} · ${reel.duracion} s`);
  if (reel.video === '') {
    console.log('Ensayo: no se subió nada. Míralo, y cuando esté bien corre el comando sin --ensayo.');
    return;
  }
  console.log(`Subido: ${reel.video}\n\nPega este bloque dentro de la pieza «${id}» en content/piezas/${mes}.ts:\n`);
  console.log(bloqueReel(reel));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
```

- [ ] **Step 4: comprobar el comando sin tocar ninguna herramienta**

```bash
npm run reels 2>&1 | tail -2
npm run reels -- --mes 2026-09 --id no-existe 2>&1 | tail -2
```

Expected: el primero imprime el uso; el segundo, `No hay una pieza «no-existe» en 2026-09`. Los dos salen con código 1 y **sin llamar a ninguna herramienta**.

- [ ] **Step 5: la suite y los tipos**

Run: `npm test 2>&1 | grep -E "^ℹ (tests|fail)"` y `npx tsc --noEmit; echo "exit=$?"`
Expected: `ℹ tests 225` · `ℹ fail 0` · `exit=0`

- [ ] **Step 6: commit**

```bash
git add package.json package-lock.json lib/reels/cli.ts
git commit -m "feat(reels): el comando npm run reels, con --ensayo"
```

---

### Task 11: la documentación

**Files:**
- Modify: `docs/ENVIRONMENT_VARIABLES.md`, `docs/PUBLICACION_EN_REDES.md`, `AGENTS.md`

- [ ] **Step 1: las variables**

En `docs/ENVIRONMENT_VARIABLES.md`, reemplazar exactamente:

```markdown
## Seguridad
```

por:

```markdown
## Reels — `npm run reels`

> Añadidas el **2026-09-13** con la producción de Reels. Todas son del comando
> local: el Worker no necesita ninguna.

| Variable | Para qué |
|---|---|
| `API_KEY` | El guion, con Gemini. ⚠️ Es la de Gemini aunque el nombre no lo diga. Solo hace falta si la pieza no trae `reel.guion` |
| `MODELO_REEL` | Opcional. Por defecto `gemini-3.8-flash` |
| `HYPERFRAMES_PYTHON` | Ruta **absoluta** al Python con `kokoro-onnx` y `soundfile`. El `~` no se expande en `.env.local` |
| `ESPEAK_DATA_PATH` · `PHONEMIZER_ESPEAK_LIBRARY` | Los datos y la librería de `espeak-ng` de Homebrew. Sin ellas Kokoro usa su copia de CI, cuya ruta de datos no existe aquí |
| `R2_BUCKET` | El bucket de los MP4. La subida usa la sesión de `wrangler`: sin claves |
| `R2_PUBLIC_BASE_URL` | La URL pública del bucket, sin barra final |
| `TELEGRAM_BOT_TOKEN` · `TELEGRAM_CHAT_ID` | Opcionales: sin ellas el video no llega al teléfono y el comando lo avisa |

**Lo que hay que instalar una vez**, porque no son dependencias de npm:
`brew install espeak-ng ffmpeg` —sin `espeak-ng` no hay voz en español—, un
entorno de Python con `kokoro-onnx` y `soundfile`, y `npx -y hyperframes@0.8.36 doctor`
para el Chrome del render.

⚠️ **`--ensayo` no necesita ninguna de las de R2**: renderiza, verifica y deja el
MP4 en una carpeta temporal.

---

## Seguridad
```

- [ ] **Step 2: cómo se produce un Reel**

En `docs/PUBLICACION_EN_REDES.md`, reemplazar exactamente:

```markdown
**La publicación de un Reel tarda minutos**: el Worker espera a que Meta procese
el video. Si disparas la ruta a mano, **deja terminar el `curl`**. Cortarlo mata el
Worker a media publicación.
```

por:

```markdown
**La publicación de un Reel tarda minutos**: el Worker espera a que Meta procese
el video. Si disparas la ruta a mano, **deja terminar el `curl`**. Cortarlo mata el
Worker a media publicación.

### Cómo se produce

`npm run reels -- --mes 2026-10 --id crm-no-chatbot --ensayo` renderiza y
verifica sin subir nada; sin `--ensayo`, además sube a R2 y manda el video por
Telegram. Produce **un Reel por corrida**: renderizar tarda minutos.

El comando **imprime el bloque `reel` para pegar** en la pieza; no reescribe el
archivo del mes. Ese pegado es el momento en que una persona lee lo que escribió
el modelo.

- **El guion lleva un párrafo por slide**, separados por una línea en blanco.
  Cada párrafo es una escena, y lo que dura su voz marca cuándo empieza la
  siguiente. `piezas --check` lo exige.
- **Si la pieza ya trae `reel.guion`, no se vuelve a pedir a Gemini.** Para
  rehacerlo: `--regenerar-guion`.
- **Míralo en el teléfono, con sonido, antes de mergear.** Los tests impiden
  publicar algo falso, no algo malo.
```

- [ ] **Step 3: el comando en `AGENTS.md`**

En `AGENTS.md`, reemplazar exactamente:

```
npm test             # tests de la fabrica de piezas
```

por:

```
npm test             # tests de la fabrica de piezas
npm run reels -- --mes 2026-10 --id <pieza>   # produce el Reel de una pieza. --ensayo no sube nada
```

- [ ] **Step 4: el tope de `AGENTS.md`**

Run: `wc -m AGENTS.md`
Expected: por debajo de `12000`.

- [ ] **Step 5: commit**

```bash
git add docs/ENVIRONMENT_VARIABLES.md docs/PUBLICACION_EN_REDES.md AGENTS.md
git commit -m "docs(reels): como se produce un Reel y las variables que necesita"
```

---

### Task 12: verificación final

Sin código. `superpowers:verification-before-completion`: evidencia antes que afirmación.

- [ ] **Step 1: la suite, los tipos y el contenido**

```bash
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)"
npx tsc --noEmit; echo "exit=$?"
npm run piezas -- --check
npx eslint app/ 2>&1 | tail -2
```

Expected: `ℹ tests 225` · `ℹ fail 0` · `exit=0` · `7 pieza(s) validas en 2026-09.` · los mismos 8 problemas de `app/` que ya estaban.

- [ ] **Step 2: la frontera del Worker sigue en pie**

```bash
node --import tsx --test lib/publicar/frontera.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"
npm run build:cloudflare > /tmp/build-reels.log 2>&1; echo "build exit=$?"
grep -c "lib/reels" .open-next/worker.js
```

Expected: `ℹ pass 2` · `build exit=0` · `0` — nada de `lib/reels/` entra al Worker.

- [ ] **Step 3: un Reel de verdad, en ensayo**

Con una pieza a la que se le añada a mano un bloque `reel` con guion —sin commitearla—:

```bash
npm run reels -- --mes 2026-09 --id crm-no-chatbot --ensayo
ffmpeg -y -ss 3 -i <carpeta>/reel.mp4 -frames:v 1 /tmp/fotograma.png
```

Expected: termina sin error, y el fotograma muestra el titular, los subtítulos y —si la escena lleva captura— el aviso de datos ficticios. **Mirar el video entero, con sonido.**

- [ ] **Step 4: el repositorio está donde tiene que estar**

```bash
git branch --show-current                            # feat/reels-produccion
git log --oneline main -1                            # main intacta
git log --oneline main..HEAD                         # los 11 commits de las Tasks 1-11
git status --short                                   # vacío
```

- [ ] **Step 5: alcance — lo tocado contra lo que nombra el plan**

```bash
for f in $(git diff --name-only main..HEAD); do
  grep -q "$(basename $f)" docs/superpowers/plans/2026-09-13-reels-produccion.md || echo "⚠️  $f"
done
```

Expected: sin salida, salvo `package-lock.json`, que el plan nombra solo en el commit de la Task 10.

---

## Lo que este plan NO hace, a propósito

- **No publica nada.** Eso es el plan 1, que ya está en `main`. Aquí solo se produce el MP4 y se deja el bloque para pegar.
- **No crea el bucket de R2 ni el bot de Telegram.** Son pasos manuales de Luis; `--ensayo` funciona sin ellos.
- **No escribe en `content/piezas/`.** El bloque se imprime y se pega a mano, como en `npm run captions`.
- **No mete `lib/reels/` en el Worker.** La frontera de la Task 8 del plan 1 lo vigila.
- **No resuelve la etiqueta de «Hecho con IA»** de Meta, que no tiene parámetro en la API. Con el primer Reel publicado se decide si hay que ponerla a mano.
