# Reels — modelo, validación y publicación: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **En este proyecto se ejecuta con `agy`, de a una task**, según
> `docs/METODO_AGENTES_PARALELOS.md` §8: `agy` escribe el código literal de UNA
> task; Claude corre los tests, comprueba las mutaciones y commitea.

**Goal:** que una pieza con bloque `reel` y un MP4 ya subido se valide y se publique sola como Reel en Instagram y en Facebook, en sus franjas.

**Architecture:** el bloque `reel` entra en el tipo `Pieza` y en `validar.ts`; `programado.ts` calcula las franjas 3 y 4 del tema; `meta.ts` y `facebook.ts` ganan una función de Reel cada uno, junto a su cliente HTTP; `tanda.ts` los suma como dos canales más detrás del descriptor `Canal`. El Worker no toca bytes de video: pasa la URL de R2 a Meta.

**Tech Stack:** TypeScript estricto, `node --test` con `tsx`, Graph API v21.0 de Meta, Cloudflare Workers.

**Spec:** `docs/superpowers/specs/2026-09-13-reels-hyperframes-design.md`.

**Este es el plan 1 de 2.** El 2 —`npm run reels`: guion, voz, composición, render, R2 y Telegram— va aparte y depende de los tipos de este. Este plan se prueba solo: con cualquier URL pública de un MP4 en el bloque `reel`, el cron ya publica.

---

## Antes de empezar

### Prerrequisitos

- La spec y este plan tienen que estar en `main` (PR de la rama `docs/spec-reels-hyperframes` mergeado).
- Rama propia desde `main`:

```bash
git checkout main && git pull
git checkout -b feat/reels-publicacion
```

### Línea base, medida el 2026-09-13

```bash
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)"   # ℹ tests 138 · ℹ pass 138 · ℹ fail 0
npx tsc --noEmit; echo "exit=$?"                   # exit=0
npm run piezas -- --check                          # 7 pieza(s) validas en 2026-09.
```

Al terminar el plan: **174 tests** (138 + 36 nuevos), `tsc` limpio y las 7 piezas válidas.

| Task | Tests nuevos | Acumulado |
|---|---|---|
| 2 | 6 | 144 |
| 3 | 4 | 148 |
| 4 | 7 | 155 |
| 5 | 6 | 161 |
| 6 | 6 | 167 |
| 7 | 5 | 172 |
| 8 | 2 | 174 |

### 🔑 Paso 0: correr el código del plan antes de dárselo a `agy`

`METODO_AGENTES_PARALELOS.md` §8: el agente es fiel y **el plan es el que miente**. Antes de mandar la Task 1, Claude aplica todas las tasks en un worktree descartable y corre la suite:

```bash
# --detach: git no deja abrir en otro worktree una rama que ya está abierta aquí
git worktree add --detach ../PukaDigital-ensayo-reels HEAD
# aplicar a mano las Tasks 1-8 en ../PukaDigital-ensayo-reels
cd ../PukaDigital-ensayo-reels && npm ci && npm test && npx tsc --noEmit
# corregir el plan con lo que falle; después:
cd - && git worktree remove --force ../PukaDigital-ensayo-reels
```

Con eso, verificar cada task de `agy` pasa a ser confirmar, no depurar.

### Resultado del paso 0 — 2026-09-13

Hecho con un script que aplica el plan **literalmente** (no a mano, que es justo el error que se busca), task por task, midiendo la fase roja y la verde de cada una:

| Comprobación | Resultado |
|---|---|
| Instrucciones del plan aplicadas | **26 de 26**, cada texto a reemplazar encontrado exactamente una vez |
| Suite al final | **174 tests**, 0 fallos · `tsc` exit 0 · 7 piezas válidas |
| Mutaciones que deben caer | **22 de 22** caen, con el test que dice cada tabla |
| Mutaciones marcadas «no cae» | **3 de 3** no caen, como está escrito |
| `npm run build:cloudflare` | exit 0: el Worker se genera |

**Lo que corrigió:** cuatro «Expected» de fases rojas. Las Tasks 4, 5 y 6 decían «error de import, todo el archivo cae», y en realidad `tsx` deja en `undefined` lo que no existe y los tests caen uno a uno. La Task 7 decía que caerían 6 y caen 5. **Ningún bloque de código cambió.**

⚠️ El worktree del ensayo se conserva mientras dura la ejecución: tiene el estado final exacto, y sirve para comprobar cada task de `agy` con un `diff` en vez de leyendo. Se borra al terminar.

### Desviaciones de la spec, ya corregidas en ella

| Qué | Por qué |
|---|---|
| Los canales de Reel viven en `meta.ts` y `facebook.ts`, no en `lib/publicar/reels.ts` | Reutilizan `llamar()` y `llamarFB()`, que son privados. Un archivo aparte obligaría a exportarlos |
| 3 palabras por segundo, no 2,6 | La spec contó 16 palabras y son 18. Medido con `wc -w` y `ffprobe` |
| Espera del Reel: cada 20 s, 15 intentos | La mitad de llamadas, y 15 ≠ 30 deja a un test distinguir la espera de un Reel de la de una imagen |
| Regla nueva: `reel.video` es la URL `https` de un `.mp4` | Caza un dedazo al pegar el bloque antes de la Graph API |

### Mapa de archivos

| Archivo | Cambio | Responsabilidad |
|---|---|---|
| `lib/piezas/tipos.ts` | modificar | el bloque `reel` en `Pieza` |
| `lib/piezas/validar.ts` | modificar | reglas del bloque `reel` |
| `lib/publicar/programado.ts` | modificar | franjas 3 y 4, y qué Reels tocan ahora |
| `lib/publicar/meta.ts` | modificar | intentos inyectables y `publicarReelInstagram()` |
| `lib/publicar/facebook.ts` | modificar | `publicarReelFacebook()` con su espera |
| `lib/publicar/tanda.ts` | modificar | dos canales más, lectura compartida, `aplica` |
| `lib/publicar/frontera.test.ts` | crear | que el Worker no alcance `lib/reels/` |
| `docs/PUBLICACION_EN_REDES.md`, `AGENTS.md` | modificar | cómo salen los Reels, y el aviso del disparo manual |

---

### Task 1: el bloque `reel` en el tipo

**Files:**
- Modify: `lib/piezas/tipos.ts:79-80`

Sin test propio: es un tipo, y lo verifica `tsc`. Las Tasks 2 a 7 lo usan.

- [ ] **Step 1: añadir el bloque**

En `lib/piezas/tipos.ts`, reemplazar exactamente:

```typescript
  };
  slides: Slide[];
};
```

por:

```typescript
  };
  /**
   * El Reel de la pieza. **Sin este bloque no hay Reel**: ningún degradado
   * silencioso, igual que `facebook.imagen`. `video` y `duracion` los escribe
   * `npm run reels`; a mano no se tocan.
   *
   * Un tema ocupa cuatro franjas seguidas: carrusel, imagen de Facebook, Reel de
   * Instagram y Reel de Facebook. Ver la spec del 2026-09-13.
   */
  reel?: {
    /** El guion hablado. Lo escribe Gemini y lo revisa una persona en el PR. */
    guion: string;
    /**
     * El texto del post. **Distinto** del carrusel y del de Facebook: la defensa
     * contra repetidos compara texto, y con el mismo el Reel se daría por
     * publicado sin haber salido nunca.
     */
    caption: string;
    /** Hora de Ecuador del Reel de Instagram. El de Facebook va en la franja siguiente. */
    publicarEl?: string;
    /** URL pública del MP4 en R2. */
    video?: string;
    /** Segundos del MP4 renderizado, entre 3 y 90: el techo de Facebook. */
    duracion?: number;
  };
  slides: Slide[];
};
```

⚠️ El `};` de la primera línea es el cierre del bloque `facebook`. El reemplazo tiene que dejarlo en su sitio.

- [ ] **Step 2: comprobar los tipos**

Run: `npx tsc --noEmit; echo "exit=$?"`
Expected: `exit=0`

- [ ] **Step 3: commit**

```bash
git add lib/piezas/tipos.ts
git commit -m "feat(reels): el bloque reel en el tipo Pieza"
```

---

### Task 2: validar la estructura del bloque `reel`

**Files:**
- Modify: `lib/piezas/validar.ts` (constantes tras la línea 22; bloque antes de la línea 143)
- Test: `lib/piezas/validar.test.ts` (añadir al final)

- [ ] **Step 1: escribir los tests que fallan**

Añadir al final de `lib/piezas/validar.test.ts`:

```typescript
// 18 palabras: la frase de la prueba de voces, 5,95 s con ef_dora.
const GUION = 'Un chatbot responde. Un CRM te dice a quién llamar mañana. Desde catorce noventa y nueve al mes.';

const conReel = (reel: NonNullable<Pieza['reel']>): Pieza => ({ ...ok, reel });

const palabras = (n: number) => Array.from({ length: n }, () => 'palabra').join(' ');

test('un reel correcto no produce errores', () => {
  assert.deepEqual(validar([conReel({ guion: GUION, caption: 'Caption propio del Reel' })]), []);
});

test('un reel sin guion o sin caption se rechaza', () => {
  assert.deepEqual(campos([conReel({ guion: '', caption: 'Caption del Reel' })]), ['reel.guion']);
  assert.deepEqual(campos([conReel({ guion: GUION, caption: '   ' })]), ['reel.caption']);
});

test('el guion admite de 9 a 270 palabras: los 3 a 90 segundos de Facebook', () => {
  assert.deepEqual(validar([conReel({ guion: palabras(9), caption: 'c' })]), []);
  assert.deepEqual(validar([conReel({ guion: palabras(270), caption: 'c' })]), []);
  assert.deepEqual(campos([conReel({ guion: palabras(8), caption: 'c' })]), ['reel.guion']);
  assert.deepEqual(campos([conReel({ guion: palabras(271), caption: 'c' })]), ['reel.guion']);
});

test('una fecha de reel imposible se rechaza: si no, desaparece del cron en silencio', () => {
  assert.deepEqual(validar([conReel({ guion: GUION, caption: 'c', publicarEl: '2026-09-30T09:00' })]), []);
  assert.deepEqual(
    campos([conReel({ guion: GUION, caption: 'c', publicarEl: '2026-09-31T09:00' })]),
    ['reel.publicarEl'],
  );
});

test('la duración del render va de 3 a 90 segundos', () => {
  const reel = { guion: GUION, caption: 'c' };
  assert.deepEqual(validar([conReel({ ...reel, duracion: 3 })]), []);
  assert.deepEqual(validar([conReel({ ...reel, duracion: 90 })]), []);
  assert.deepEqual(campos([conReel({ ...reel, duracion: 2.9 })]), ['reel.duracion']);
  assert.deepEqual(campos([conReel({ ...reel, duracion: 90.1 })]), ['reel.duracion']);
});

test('el video es la URL https de un MP4', () => {
  const reel = { guion: GUION, caption: 'c' };
  assert.deepEqual(
    validar([conReel({ ...reel, video: 'https://reels.pukadigital.com/reels/2026-10/tema-1a2b3c4d.mp4' })]),
    [],
  );
  assert.deepEqual(campos([conReel({ ...reel, video: 'http://reels.pukadigital.com/tema.mp4' })]), ['reel.video']);
  assert.deepEqual(campos([conReel({ ...reel, video: 'https://reels.pukadigital.com/tema.mov' })]), ['reel.video']);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/piezas/validar.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 5` — los cinco que esperan un error no lo reciben. «un reel correcto» pasa ya, porque hoy el bloque se ignora.

- [ ] **Step 3: las constantes**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
```

por:

```typescript
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Velocidad de `ef_dora` medida el 2026-09-13: 18 palabras en 5,95 s. Sirve para
 * rechazar un guion imposible antes de renderizar; la duración de verdad la mide
 * `ffprobe` después, y queda en `reel.duracion`.
 */
const PALABRAS_POR_SEGUNDO = 3;
/** 3 segundos: el mínimo de un Reel en Facebook. */
const MIN_PALABRAS_GUION = 3 * PALABRAS_POR_SEGUNDO;
/** 90 segundos: el máximo de un Reel en Facebook. */
const MAX_PALABRAS_GUION = 90 * PALABRAS_POR_SEGUNDO;
```

- [ ] **Step 4: el bloque de validación**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
    // Un precio o una oferta sin producto declarado no se puede verificar.
    // Aplica a slides y a ambos captions.
```

por:

```typescript
    // Validación del bloque reel
    if (pieza.reel) {
      const reel = pieza.reel;
      const guion = reel.guion?.trim() ?? '';

      if (guion === '') {
        en('reel.guion', 'el Reel no tiene guion: sin guion no hay voz');
      } else {
        const cuantas = guion.split(/\s+/).length;
        if (cuantas < MIN_PALABRAS_GUION || cuantas > MAX_PALABRAS_GUION) {
          en(
            'reel.guion',
            `${cuantas} palabras, entre ${MIN_PALABRAS_GUION} y ${MAX_PALABRAS_GUION}: son los 3 a 90 segundos que admite Facebook, a ${PALABRAS_POR_SEGUNDO} palabras por segundo`,
          );
        }
      }

      if ((reel.caption?.trim() ?? '') === '') {
        en('reel.caption', 'el Reel no tiene caption: sin él no hay forma de saber si ya salió');
      }

      if (reel.publicarEl && !fechaValida(reel.publicarEl)) {
        en('reel.publicarEl', `«${reel.publicarEl}» no es una fecha válida: se escribe YYYY-MM-DDTHH:mm`);
      }

      if (reel.duracion !== undefined && (reel.duracion < 3 || reel.duracion > 90)) {
        en('reel.duracion', `${reel.duracion} segundos: Facebook admite entre 3 y 90`);
      }

      if (reel.video !== undefined && !/^https:\/\/\S+\.mp4$/.test(reel.video)) {
        en('reel.video', `«${reel.video}» no es la URL https de un MP4`);
      }
    }

    // Un precio o una oferta sin producto declarado no se puede verificar.
    // Aplica a slides y a ambos captions.
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `fechaValida` no hay que crearla: ya está declarada más arriba, dentro del mismo `for`, y se usa para `facebook.publicarEl`.
- `reel.guion?.trim()` sobre un campo no opcional es el estilo del archivo: ver `img.titular?.trim()` en la validación de Facebook. No «corregirlo».
- La variable se llama `cuantas` y no `palabras` a propósito: `palabras` ya existe en otros bloques del mismo `for`.

- [ ] **Step 5: comprobar que pasan**

Run: `node --import tsx --test lib/piezas/validar.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`

- [ ] **Step 6: mutaciones — cada guarda tiene que tener un test que caiga**

Una por vez, restaurando después de cada una:

| Mutación | Test que tiene que caer |
|---|---|
| `cuantas < MIN_PALABRAS_GUION` → `cuantas <= MIN_PALABRAS_GUION` | «el guion admite de 9 a 270 palabras» |
| borrar el `if (reel.publicarEl && ...)` entero | «una fecha de reel imposible» |
| `reel.duracion > 90` → `reel.duracion >= 90` | «la duración del render va de 3 a 90» |
| `\.mp4$` → `\.mp4` | «el video es la URL https de un MP4»… **no cae**: `.mov` sigue fallando. Sirve la mutación `^https` → `^https?` |

Run tras cada una: `node --import tsx --test lib/piezas/validar.test.ts 2>&1 | grep -E "^ℹ fail"`
Expected: `ℹ fail 1` con la mutación puesta; `ℹ fail 0` al restaurar.

- [ ] **Step 7: commit**

```bash
git add lib/piezas/validar.ts lib/piezas/validar.test.ts
git commit -m "feat(reels): validar la estructura del bloque reel"
```

**Caminos de entrada:** `validar()` la llaman `npm run piezas -- --check` (CI y `prebuild`), el render de PNG, y `publicarPieza*` antes de tocar la red. Los tests llaman a `validar()` directamente, que es la función que usan los tres.

---

### Task 3: los hechos del Reel — caption propio, precios y afirmaciones

**Files:**
- Modify: `lib/piezas/validar.ts`
- Test: `lib/piezas/validar.test.ts` (añadir al final)

- [ ] **Step 1: escribir los tests que fallan**

Añadir al final de `lib/piezas/validar.test.ts`:

```typescript
test('el caption del Reel no puede repetir el del carrusel ni el de Facebook, aunque cambien los espacios', () => {
  const comoElCarrusel: Pieza = {
    ...ok,
    caption: 'Tu factura no pasó.\n\nEscríbenos.',
    reel: { guion: GUION, caption: 'Tu factura  no pasó. Escríbenos.' },
  };
  assert.deepEqual(campos([comoElCarrusel]), ['reel.caption']);

  const comoFacebook: Pieza = {
    ...ok,
    facebook: { caption: 'Texto de Facebook' },
    reel: { guion: GUION, caption: 'Texto de  Facebook' },
  };
  assert.deepEqual(campos([comoFacebook]), ['reel.caption']);
});

test('un precio falso dicho en el guion se rechaza como en un caption', () => {
  const pieza: Pieza = {
    ...ok,
    producto: 'ledgerxpertz',
    reel: { guion: `${GUION} El plan Starter cuesta $99 al mes.`, caption: 'Caption del Reel' },
  };
  assert.deepEqual(campos([pieza]), ['reel.guion']);
});

test('una afirmación prohibida de PukaHealth en el guion se rechaza', () => {
  const pieza: Pieza = {
    ...ok,
    sistema: 'health',
    producto: 'pukahealth',
    reel: { guion: `${GUION} Recordatorios por WhatsApp automáticos para tus pacientes.`, caption: 'Caption del Reel' },
  };
  assert.deepEqual(campos([pieza]), ['reel.guion']);
});

test('un precio en el guion o en el caption del Reel exige declarar el producto', () => {
  const enElGuion: Pieza = { ...ok, reel: { guion: `${GUION} Pruébalo desde $14.99 al mes.`, caption: 'c' } };
  assert.deepEqual(campos([enElGuion]), ['producto']);

  const enElCaption: Pieza = { ...ok, reel: { guion: GUION, caption: 'Desde $14.99 al mes' } };
  assert.deepEqual(campos([enElCaption]), ['producto']);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/piezas/validar.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 4`

- [ ] **Step 3: el normalizador**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
const MAX_PALABRAS_GUION = 90 * PALABRAS_POR_SEGUNDO;
```

por:

```typescript
const MAX_PALABRAS_GUION = 90 * PALABRAS_POR_SEGUNDO;

/**
 * Como `normalizar()` de `lib/publicar/programado.ts`, que es con lo que la red
 * compara. Se repite en vez de importarse: `lib/piezas/` no depende de
 * `lib/publicar/`, y la dependencia al revés ya existe.
 */
function normalizarEspacios(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}
```

- [ ] **Step 4: el caption propio**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
      if ((reel.caption?.trim() ?? '') === '') {
        en('reel.caption', 'el Reel no tiene caption: sin él no hay forma de saber si ya salió');
      }
```

por:

```typescript
      const captionReel = reel.caption?.trim() ?? '';
      if (captionReel === '') {
        en('reel.caption', 'el Reel no tiene caption: sin él no hay forma de saber si ya salió');
      } else {
        // La red compara con los espacios normalizados: dos textos que solo
        // difieren en saltos de línea son el mismo post, y el Reel se daría por
        // publicado sin haber salido nunca.
        const mio = normalizarEspacios(captionReel);
        const otros = [pieza.caption, pieza.facebook?.caption]
          .filter((t): t is string => Boolean(t))
          .map(normalizarEspacios);
        if (otros.includes(mio)) {
          en('reel.caption', 'el caption del Reel repite el del carrusel o el de Facebook: se daría por publicado y no saldría nunca');
        }
      }
```

- [ ] **Step 5: el producto obligatorio**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
        (pieza.facebook?.caption &&
          (preciosEn(pieza.facebook.caption).length > 0 || ofertasEn(pieza.facebook.caption).length > 0));
```

por:

```typescript
        (pieza.facebook?.caption &&
          (preciosEn(pieza.facebook.caption).length > 0 || ofertasEn(pieza.facebook.caption).length > 0)) ||
        // Un precio dicho en voz es igual de verificable, y de falso, que uno escrito.
        [pieza.reel?.guion, pieza.reel?.caption].some(
          (t) => Boolean(t) && (preciosEn(t ?? '').length > 0 || ofertasEn(t ?? '').length > 0),
        );
```

- [ ] **Step 6: el guion por las puertas de un caption**

En `lib/piezas/validar.ts`, reemplazar exactamente:

```typescript
        ? `${pieza.facebook.imagen.dato.valor} ${pieza.facebook.imagen.dato.etiqueta}`
        : undefined],
    ];
```

por:

```typescript
        ? `${pieza.facebook.imagen.dato.valor} ${pieza.facebook.imagen.dato.etiqueta}`
        : undefined],
      // El guion pasa por las mismas puertas: un precio falso dicho en voz no se
      // puede copiar y verificar, y encima suena a promesa.
      ['reel.guion', pieza.reel?.guion],
      ['reel.caption', pieza.reel?.caption],
    ];
```

- [ ] **Step 7: comprobar que pasan, y que nada de antes se rompió**

Run: `node --import tsx --test lib/piezas/validar.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`

- [ ] **Step 8: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `otros.includes(mio)` → `[pieza.caption, pieza.facebook?.caption].includes(captionReel)` | «el caption del Reel no puede repetir…» (los espacios) |
| borrar `['reel.guion', pieza.reel?.guion],` | «un precio falso dicho en el guion» y «una afirmación prohibida» |
| borrar el `|| [pieza.reel?.guion, …].some(…)` añadido en el Step 5 | «un precio en el guion o en el caption del Reel exige declarar el producto» |

- [ ] **Step 9: commit**

```bash
git add lib/piezas/validar.ts lib/piezas/validar.test.ts
git commit -m "feat(reels): el guion y el caption del reel pasan por los hechos comerciales"
```

---

### Task 4: las franjas 3 y 4, y qué Reels tocan ahora

**Files:**
- Modify: `lib/publicar/programado.ts:143-144`
- Test: `lib/publicar/programado.test.ts` (añadir al final)

- [ ] **Step 1: escribir los tests que fallan**

Primero, en `lib/publicar/programado.test.ts`, reemplazar exactamente el import:

```typescript
import {
  aUTC,
  captionFacebook,
  fechaPublicacionFacebook,
  franjaSiguiente,
  pendientes,
  pendientesFacebook,
  pendientesInstagram,
  yaPublicada,
} from './programado.ts';
```

por:

```typescript
import {
  aUTC,
  captionFacebook,
  fechaPublicacionFacebook,
  fechaReelFacebook,
  fechaReelInstagram,
  franjaSiguiente,
  pendientes,
  pendientesFacebook,
  pendientesInstagram,
  pendientesReelFacebook,
  pendientesReelInstagram,
  yaPublicada,
} from './programado.ts';
```

Después, añadir al final del archivo:

```typescript
const VIDEO = 'https://reels.pukadigital.com/reels/2026-10/tema-1a2b3c4d.mp4';

const conReel = (extra: Partial<Pieza> = {}): Pieza => ({
  ...base,
  id: 'tema',
  publicarEl: '2026-10-06T09:00',
  facebook: { imagen: { titular: 'Titular' } },
  reel: { guion: 'guion', caption: 'Caption del Reel', video: VIDEO },
  ...extra,
});

test('las cuatro franjas de un tema son consecutivas', () => {
  const pieza = conReel();
  assert.equal(pieza.publicarEl, '2026-10-06T09:00'); // 1 · carrusel
  assert.equal(fechaPublicacionFacebook(pieza), '2026-10-06T18:00'); // 2 · imagen de Facebook
  assert.equal(fechaReelInstagram(pieza), '2026-10-07T09:00'); // 3 · Reel de Instagram
  assert.equal(fechaReelFacebook(pieza), '2026-10-07T18:00'); // 4 · Reel de Facebook
});

test('sin imagen de Facebook, el Reel encadena desde el carrusel y no se queda sin fecha', () => {
  const pieza = conReel({ facebook: undefined });
  assert.equal(fechaPublicacionFacebook(pieza), undefined);
  assert.equal(fechaReelInstagram(pieza), '2026-10-06T18:00');
  assert.equal(fechaReelFacebook(pieza), '2026-10-07T09:00');
});

test('reel.publicarEl fija la franja del Reel de Instagram, y la de Facebook la sigue', () => {
  const pieza = conReel({
    reel: { guion: 'guion', caption: 'Caption del Reel', video: VIDEO, publicarEl: '2026-10-09T18:00' },
  });
  assert.equal(fechaReelInstagram(pieza), '2026-10-09T18:00');
  assert.equal(fechaReelFacebook(pieza), '2026-10-10T09:00');
});

test('un Reel sin video renderizado no se programa en ningún canal', () => {
  const pieza = conReel({ reel: { guion: 'guion', caption: 'Caption del Reel' } });
  assert.equal(fechaReelInstagram(pieza), undefined);
  assert.equal(fechaReelFacebook(pieza), undefined);
  // 09:05 del 7 = 14:05 UTC: sería su franja de Instagram si tuviera video.
  assert.deepEqual(pendientesReelInstagram([pieza], new Date('2026-10-07T14:05:00Z'), []), []);
});

test('pendientesReelInstagram entra en su ventana y no repite lo publicado', () => {
  const pieza = conReel();
  const ahora = new Date('2026-10-07T14:05:00Z'); // 09:05 de Ecuador del 7
  assert.deepEqual(pendientesReelInstagram([pieza], ahora, []).map((p) => p.id), ['tema']);
  assert.deepEqual(pendientesReelInstagram([pieza], ahora, ['Caption  del Reel']), []);
  assert.deepEqual(
    pendientesReelInstagram([pieza], new Date('2026-10-07T15:01:00Z'), []),
    [],
    '61 minutos después ya no entra',
  );
});

test('pendientesReelFacebook usa la cuarta franja y compara contra las descripciones', () => {
  const pieza = conReel();
  const ahora = new Date('2026-10-07T23:05:00Z'); // 18:05 de Ecuador del 7
  assert.deepEqual(pendientesReelFacebook([pieza], ahora, []).map((p) => p.id), ['tema']);
  assert.deepEqual(pendientesReelFacebook([pieza], ahora, ['Caption del Reel']), []);
  assert.deepEqual(
    pendientesReelFacebook([pieza], new Date('2026-10-07T14:05:00Z'), []),
    [],
    'a las 09:05 toca el de Instagram, no este',
  );
});

test('un Reel sin caption no se publica solo: no se podría comprobar si ya salió', () => {
  const pieza = conReel({ reel: { guion: 'guion', caption: '', video: VIDEO } });
  assert.deepEqual(pendientesReelInstagram([pieza], new Date('2026-10-07T14:05:00Z'), []), []);
  assert.deepEqual(pendientesReelFacebook([pieza], new Date('2026-10-07T23:05:00Z'), []), []);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/publicar/programado.test.ts 2>&1 | tail -5`
Expected: `ℹ fail 7` — los siete nuevos. ⚠️ **No es un error de import**: `tsx` no rechaza importar algo que todavía no existe, lo deja en `undefined`, y cada test cae por separado con un `TypeError`. Medido en el ensayo del paso 0.

- [ ] **Step 3: implementar**

En `lib/publicar/programado.ts`, reemplazar exactamente:

```typescript
/** Alias de compatibilidad hacia atrás para Instagram. */
export const pendientes = pendientesInstagram;
```

por:

```typescript
/**
 * La franja del Reel de Instagram: la tercera del tema. Encadena desde la de
 * Facebook, o desde la del carrusel si la pieza no sale en Facebook. **Sin esa
 * caída**, una pieza sin imagen de Facebook dejaría al Reel sin fecha, y no
 * saldría nunca sin que nada lo avisara.
 *
 * Sin video renderizado no hay fecha: el Reel todavía no existe.
 */
export function fechaReelInstagram(pieza: Pieza): string | undefined {
  if (!pieza.reel?.video) return undefined;
  if (pieza.reel.publicarEl) return pieza.reel.publicarEl;
  const previa = fechaPublicacionFacebook(pieza) ?? pieza.publicarEl;
  return previa ? franjaSiguiente(previa) : undefined;
}

/** La cuarta franja del tema: siempre la siguiente a la del Reel de Instagram. */
export function fechaReelFacebook(pieza: Pieza): string | undefined {
  const deInstagram = fechaReelInstagram(pieza);
  return deInstagram ? franjaSiguiente(deInstagram) : undefined;
}

/**
 * Si un instante cae dentro de la ventana de publicación. Una fecha imposible no
 * entra nunca: `NaN < 0` y `NaN > 60` son las dos falsas, y sin la guarda la
 * pieza se colaría a deshora.
 */
function enVentana(fechaLocal: string, ahora: Date): boolean {
  const cuando = aUTC(fechaLocal);
  if (Number.isNaN(cuando.getTime())) return false;
  const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
  return minutos >= 0 && minutos <= VENTANA_MINUTOS;
}

/** Reels pendientes para Instagram. Se compara el caption del Reel contra `/media`. */
export function pendientesReelInstagram(
  piezas: Pieza[],
  ahora: Date,
  captionsRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    const fecha = fechaReelInstagram(pieza);
    if (!fecha || !pieza.reel?.caption?.trim()) return false;
    if (!enVentana(fecha, ahora)) return false;
    return !yaPublicada(pieza.reel.caption, captionsRecientes);
  });
}

/**
 * Reels pendientes para Facebook. Se compara contra las `description` de
 * `/video_reels`: los Reels no salen en `/posts`.
 */
export function pendientesReelFacebook(
  piezas: Pieza[],
  ahora: Date,
  descripcionesRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    const fecha = fechaReelFacebook(pieza);
    if (!fecha || !pieza.reel?.caption?.trim()) return false;
    if (!enVentana(fecha, ahora)) return false;
    return !yaPublicada(pieza.reel.caption, descripcionesRecientes);
  });
}

/** Alias de compatibilidad hacia atrás para Instagram. */
export const pendientes = pendientesInstagram;
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `pendientesInstagram` y `pendientesFacebook` repiten la lógica de la ventana en vez de usar `enVentana()`. **No refactorizarlas**: tienen tests por mutación propios y esta task no las toca.
- `VENTANA_MINUTOS`, `aUTC`, `franjaSiguiente`, `fechaPublicacionFacebook` y `yaPublicada` ya existen en el mismo archivo.

- [ ] **Step 4: comprobar que pasan**

Run: `node --import tsx --test lib/publicar/programado.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`

- [ ] **Step 5: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `fechaPublicacionFacebook(pieza) ?? pieza.publicarEl` → `fechaPublicacionFacebook(pieza)` | «sin imagen de Facebook, el Reel encadena desde el carrusel» |
| `if (!pieza.reel?.video) return undefined;` → borrarla | «un Reel sin video renderizado no se programa» |
| `if (!fecha \|\| !pieza.reel?.caption?.trim()) return false;` → `if (!fecha) return false;` (en los dos) | «un Reel sin caption no se publica solo». ⚠️ Cambiar solo `?.trim()` por nada **no cae**: `''` ya es falsy |
| `minutos <= VENTANA_MINUTOS` → `minutos <= VENTANA_MINUTOS + 5` | «pendientesReelInstagram entra en su ventana…» (los 61 minutos) |

- [ ] **Step 6: commit**

```bash
git add lib/publicar/programado.ts lib/publicar/programado.test.ts
git commit -m "feat(reels): las franjas 3 y 4 del tema y los reels pendientes"
```

**Caminos de entrada:** `publicarLoQueToca()` en `tanda.ts` los llama como `pendientes` de sus canales, desde `worker.ts` y la ruta del cron. Ese camino entero se prueba en la Task 7.

---

### Task 5: el Reel de Instagram

**Files:**
- Modify: `lib/publicar/meta.ts`
- Test: `lib/publicar/meta.test.ts`

- [ ] **Step 1: escribir los tests que fallan**

En `lib/publicar/meta.test.ts`, reemplazar exactamente:

```typescript
import { archivosDe, publicarPieza, urlPublica, type Opciones } from './meta.ts';
```

por:

```typescript
import {
  ESPERA_REEL,
  archivosDe,
  publicarPieza,
  publicarReelInstagram,
  urlPublica,
  type Opciones,
} from './meta.ts';
```

Y añadir al final del archivo:

```typescript
const reelDeSuelta: Pieza = {
  ...suelta,
  reel: {
    guion: 'Un chatbot responde. Un CRM te dice a quién llamar mañana. Desde catorce noventa y nueve al mes.',
    caption: 'Caption del Reel',
    video: 'https://reels.pukadigital.com/reels/2026-10/sri-rechazo-01-1a2b3c4d.mp4',
  },
};

test('un Reel crea el contenedor REELS con la URL de R2, espera y publica', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'REEL-C' }, { status_code: 'FINISHED' }, { id: 'REEL-P' }]);
  const res = await publicarReelInstagram(reelDeSuelta, opciones(impl));

  assert.equal(res.id, 'REEL-P');
  assert.equal(llamadas.length, 3);
  assert.equal(llamadas[0].metodo, 'POST');
  assert.match(llamadas[0].url, /17841476784325626\/media$/);
  assert.match(llamadas[0].body, /media_type=REELS/);
  assert.match(
    llamadas[0].body,
    /video_url=https%3A%2F%2Freels\.pukadigital\.com%2Freels%2F2026-10%2Fsri-rechazo-01-1a2b3c4d\.mp4/,
  );
  assert.match(llamadas[0].body, /caption=Caption\+del\+Reel/);
  assert.ok(!llamadas[0].body.includes('Tu+factura'), 'lleva el caption del Reel, no el del carrusel');
  assert.equal(llamadas[1].metodo, 'GET');
  assert.match(llamadas[2].url, /media_publish$/);
  assert.match(llamadas[2].body, /creation_id=REEL-C/);
});

test('los intentos de espera son inyectables: agotados, aborta sin publicar', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'C' }, { status_code: 'IN_PROGRESS' }]);
  await assert.rejects(
    () => publicarReelInstagram(reelDeSuelta, { ...opciones(impl), intentos: 2 }),
    /despues de 2 intentos/,
  );
  assert.equal(llamadas.length, 3, 'crear y dos consultas; nunca media_publish');
});

test('sin intentos explícitos, un Reel usa su propia espera y no la de una imagen', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'C' }, { status_code: 'IN_PROGRESS' }]);
  await assert.rejects(() => publicarReelInstagram(reelDeSuelta, opciones(impl)), /despues de 15 intentos/);
  assert.equal(llamadas.length, 16);
});

test('una imagen conserva su espera de 30 intentos', async () => {
  const { impl } = fetchFalso([{ id: 'C' }, { status_code: 'IN_PROGRESS' }]);
  await assert.rejects(() => publicarPieza(suelta, '2026-09', opciones(impl)), /despues de 30 intentos/);
});

test('un Reel espera 5 minutos: la mitad de llamadas que cada 10 s, y cabe en el cron', () => {
  assert.equal(ESPERA_REEL.esperarMs * ESPERA_REEL.intentos, 300_000);
});

test('una pieza sin el video del Reel no llega a la API', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'C' }]);
  const sinVideo: Pieza = {
    ...suelta,
    reel: { guion: 'Un chatbot responde. Un CRM te dice a quién llamar mañana. Desde catorce noventa y nueve al mes.', caption: 'Caption del Reel' },
  };
  await assert.rejects(() => publicarReelInstagram(sinVideo, opciones(impl)), /no tiene el video/);
  assert.equal(llamadas.length, 0);
});
```

⚠️ `opciones(impl)` ya fija `esperarMs: 0`: los tests de espera no duermen de verdad.

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/publicar/meta.test.ts 2>&1 | tail -5`
Expected: `ℹ fail 5`. Los imports que faltan quedan en `undefined` y cada test cae por separado. «una imagen conserva su espera de 30 intentos» **pasa ya**, y tiene que pasar: prueba que el cambio no rompe lo que había.

- [ ] **Step 3: los intentos inyectables**

En `lib/publicar/meta.ts`, reemplazar exactamente:

```typescript
  /** Espera entre comprobaciones del contenedor. */
  esperarMs?: number;
};
```

por:

```typescript
  /** Espera entre comprobaciones del contenedor. */
  esperarMs?: number;
  /** Cuántas veces se comprueba antes de rendirse. Por defecto, `INTENTOS`. */
  intentos?: number;
};
```

Y reemplazar exactamente:

```typescript
async function esperarContenedor(id: string, opciones: Opciones): Promise<void> {
  const espera = opciones.esperarMs ?? 2000;

  for (let i = 0; i < INTENTOS; i++) {
```

por:

```typescript
async function esperarContenedor(id: string, opciones: Opciones): Promise<void> {
  const espera = opciones.esperarMs ?? 2000;
  const intentos = opciones.intentos ?? INTENTOS;

  for (let i = 0; i < intentos; i++) {
```

Y reemplazar exactamente:

```typescript
  throw new Error(`El contenedor ${id} sigue sin estar listo despues de ${INTENTOS} intentos.`);
```

por:

```typescript
  throw new Error(`El contenedor ${id} sigue sin estar listo despues de ${intentos} intentos.`);
```

- [ ] **Step 4: la espera y la función del Reel**

Añadir al final de `lib/publicar/meta.ts`:

```typescript

/**
 * Un video tarda de 1 a 3 minutos en procesarse. Con la espera de una imagen
 * —30 intentos cada 2 s— un Reel que iba bien se daría por fallido al minuto.
 *
 * Cinco minutos caben de sobra en los 15 de reloj del cron, y esperar en un
 * `fetch` no gasta CPU. Cada 20 s son la mitad de llamadas que cada 10, y los 15
 * intentos, distintos de los 30 de una imagen, dejan a un test saber cuál se usó.
 */
export const ESPERA_REEL = { esperarMs: 20_000, intentos: 15 } as const;

/**
 * Publica el Reel de una pieza en Instagram. El MP4 ya está en R2: la Graph API
 * lo descarga de `reel.video`, y el Worker nunca toca los bytes.
 *
 * Un contenedor abandonado a mitad de espera no duplica nada: `media_publish`
 * nunca se llamó, y Meta lo caduca solo a las 24 h.
 */
export async function publicarReelInstagram(
  pieza: Pieza,
  opciones: Opciones,
): Promise<Publicacion> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const reel = pieza.reel;
  if (!reel?.video) {
    throw new Error(`La pieza ${pieza.id} no tiene el video del Reel renderizado`);
  }

  const usuario = opciones.igUserId;
  const creado = await llamar(
    `${usuario}/media`,
    { media_type: 'REELS', video_url: reel.video, caption: reel.caption, share_to_feed: 'true' },
    opciones,
  );
  const contenedor = String(creado.id);

  await esperarContenedor(contenedor, {
    ...opciones,
    esperarMs: opciones.esperarMs ?? ESPERA_REEL.esperarMs,
    intentos: opciones.intentos ?? ESPERA_REEL.intentos,
  });

  const publicado = await llamar(`${usuario}/media_publish`, { creation_id: contenedor }, opciones);
  return { id: String(publicado.id) };
}
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `llamar`, `esperarContenedor`, `validar`, `formatear`, `Pieza` y `Publicacion` ya existen en `meta.ts` o en sus imports. No crear nada más.
- `share_to_feed: 'true'` va como texto: el cuerpo es `application/x-www-form-urlencoded`.

- [ ] **Step 5: comprobar que pasan**

Run: `node --import tsx --test lib/publicar/meta.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`

- [ ] **Step 6: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| `opciones.intentos ?? INTENTOS` → `INTENTOS` | «los intentos de espera son inyectables» |
| `intentos: 15` → `intentos: 30` en `ESPERA_REEL` | «sin intentos explícitos, un Reel usa su propia espera» y «un Reel espera 5 minutos» |
| `caption: reel.caption` → `caption: pieza.caption ?? ''` | «un Reel crea el contenedor REELS…» |
| borrar el `if (!reel?.video) { … }` y dejar `video_url: reel?.video ?? ''` | «una pieza sin el video del Reel no llega a la API». Cae por la guarda y solo por ella: `validar()` **no** exige `reel.video`, porque un Reel sin renderizar es válido |

- [ ] **Step 7: commit**

```bash
git add lib/publicar/meta.ts lib/publicar/meta.test.ts
git commit -m "feat(reels): publicar el reel en Instagram con su propia espera"
```

---

### Task 6: el Reel de Facebook

**Files:**
- Modify: `lib/publicar/facebook.ts`
- Test: `lib/publicar/facebook.test.ts`

Detalles de la API verificados el 2026-09-13 contra la guía de Meta (*Publish a Reel*): `start` devuelve `video_id` y `upload_url`; la subida por URL es un POST a esa `upload_url` con las cabeceras `Authorization: OAuth <token>` y `file_url`; `finish` lleva `video_id`, `video_state=PUBLISHED` y `description`; el estado final es **`completed`**, no `complete`.

- [ ] **Step 1: escribir los tests que fallan**

En `lib/publicar/facebook.test.ts`, reemplazar exactamente:

```typescript
import { publicarPiezaFacebook, type OpcionesFacebook } from './facebook.ts';
```

por:

```typescript
import { publicarPiezaFacebook, publicarReelFacebook, type OpcionesFacebook } from './facebook.ts';
```

Y añadir al final del archivo:

```typescript
const GUION = 'Un chatbot responde. Un CRM te dice a quién llamar mañana. Desde catorce noventa y nueve al mes.';
const VIDEO = 'https://reels.pukadigital.com/reels/2026-10/sri-rechazo-01-1a2b3c4d.mp4';

const reelBase: Pieza = {
  ...piezaBase,
  reel: { guion: GUION, caption: 'Caption del Reel de Facebook', video: VIDEO },
};

/** Como `fetchFalso`, pero guarda las cabeceras: la subida de un Reel viaja en ellas. */
function fetchConCabeceras(respuestas: unknown[]) {
  const llamadas: Array<{ url: string; body: string; metodo: string; cabeceras: Record<string, string> }> = [];
  let i = 0;
  const impl = async (url: string | URL, init?: RequestInit) => {
    llamadas.push({
      url: String(url),
      body: String(init?.body ?? ''),
      metodo: String(init?.method ?? 'GET'),
      cabeceras: (init?.headers ?? {}) as Record<string, string>,
    });
    return {
      ok: true,
      json: async () => respuestas[Math.min(i++, respuestas.length - 1)],
    } as Response;
  };
  return { impl: impl as unknown as typeof fetch, llamadas };
}

const INICIO = (id: string) => ({ video_id: id, upload_url: `https://rupload.facebook.com/video-upload/v21.0/${id}` });
const PUBLICADO = {
  status: {
    video_status: 'ready',
    processing_phase: { status: 'completed' },
    publishing_phase: { status: 'completed', publish_status: 'published' },
  },
};
const PROCESANDO = {
  status: {
    video_status: 'processing',
    processing_phase: { status: 'in_progress' },
    publishing_phase: { status: 'not_started' },
  },
};

test('un Reel de Facebook abre la subida, pasa la URL de R2 en la cabecera y publica', async () => {
  const { impl, llamadas } = fetchConCabeceras([INICIO('VID-1'), { success: true }, { success: true }, PUBLICADO]);
  const res = await publicarReelFacebook(reelBase, { ...opciones(impl), esperarMs: 0 });

  assert.equal(res.id, 'VID-1');
  assert.equal(llamadas.length, 4);

  assert.match(llamadas[0].url, /PAGE_DE_PRUEBA\/video_reels$/);
  assert.match(llamadas[0].body, /upload_phase=start/);

  assert.equal(llamadas[1].url, 'https://rupload.facebook.com/video-upload/v21.0/VID-1');
  assert.equal(llamadas[1].metodo, 'POST');
  assert.equal(llamadas[1].cabeceras.file_url, VIDEO);
  assert.equal(llamadas[1].cabeceras.Authorization, `OAuth ${TOKEN}`);
  assert.equal(llamadas[1].body, '', 'la subida por URL no manda bytes');

  assert.match(llamadas[2].body, /upload_phase=finish/);
  assert.match(llamadas[2].body, /video_id=VID-1/);
  assert.match(llamadas[2].body, /video_state=PUBLISHED/);
  assert.match(llamadas[2].body, /description=Caption\+del\+Reel\+de\+Facebook/);

  assert.equal(llamadas[3].metodo, 'GET');
  assert.match(llamadas[3].url, /VID-1\?fields=status/);
});

test('un success del finish no basta: espera a que la fase de publicación termine', async () => {
  const { impl, llamadas } = fetchConCabeceras([
    INICIO('VID-2'), { success: true }, { success: true }, PROCESANDO, PROCESANDO, PUBLICADO,
  ]);
  await publicarReelFacebook(reelBase, { ...opciones(impl), esperarMs: 0 });
  assert.equal(llamadas.length, 6, 'debe seguir consultando mientras Meta procesa');
});

test('si Meta rechaza el Reel en la revisión, falla aunque el finish dijera success', async () => {
  const { impl } = fetchConCabeceras([
    INICIO('VID-3'), { success: true }, { success: true },
    { status: { video_status: 'error', processing_phase: { status: 'error' }, publishing_phase: { status: 'not_started' } } },
  ]);
  await assert.rejects(
    () => publicarReelFacebook(reelBase, { ...opciones(impl), esperarMs: 0 }),
    /rechazo el Reel VID-3/,
  );
});

test('si la espera se agota, falla con el número de intentos', async () => {
  const { impl } = fetchConCabeceras([INICIO('VID-4'), { success: true }, { success: true }, PROCESANDO]);
  await assert.rejects(
    () => publicarReelFacebook(reelBase, { ...opciones(impl), esperarMs: 0, intentos: 3 }),
    /despues de 3 intentos/,
  );
});

test('si Facebook no puede descargar el video, no llega al finish y no filtra el token', async () => {
  const { impl, llamadas } = fetchConCabeceras([
    INICIO('VID-5'),
    { debug_info: { message: 'Failed to download the file' } },
  ]);
  await assert.rejects(
    () => publicarReelFacebook(reelBase, { ...opciones(impl), esperarMs: 0 }),
    (e: Error) => {
      assert.match(e.message, /Failed to download the file/);
      assert.ok(!e.message.includes(TOKEN), 'el token se filtro en el error');
      return true;
    },
  );
  assert.equal(llamadas.length, 2, 'nunca llega al finish');
});

test('una pieza sin el video del Reel no llega a la API de Facebook', async () => {
  const { impl, llamadas } = fetchConCabeceras([INICIO('VID-6')]);
  const sinVideo: Pieza = { ...piezaBase, reel: { guion: GUION, caption: 'Caption del Reel de Facebook' } };
  await assert.rejects(() => publicarReelFacebook(sinVideo, opciones(impl)), /no tiene el video/);
  assert.equal(llamadas.length, 0);
});
```

- [ ] **Step 2: comprobar que fallan**

Run: `node --import tsx --test lib/publicar/facebook.test.ts 2>&1 | tail -5`
Expected: `ℹ fail 6` — los seis nuevos, cada uno con un `TypeError`: `tsx` deja en `undefined` el import que falta en vez de rechazar el archivo.

- [ ] **Step 3: el import y las opciones**

En `lib/publicar/facebook.ts`, reemplazar exactamente:

```typescript
import { urlPublica } from './meta.ts';
```

por:

```typescript
import { ESPERA_REEL, urlPublica } from './meta.ts';
```

Y reemplazar exactamente:

```typescript
  /** Inyectable para pruebas unitarias sin red. */
  fetchImpl?: typeof fetch;
};
```

por:

```typescript
  /** Inyectable para pruebas unitarias sin red. */
  fetchImpl?: typeof fetch;
  /** Espera entre consultas del estado de un Reel. Por defecto, la de `ESPERA_REEL`. */
  esperarMs?: number;
  /** Cuántas veces se consulta el estado de un Reel antes de rendirse. */
  intentos?: number;
};
```

- [ ] **Step 4: la espera y la función del Reel**

Añadir al final de `lib/publicar/facebook.ts`:

```typescript

function dormir(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

type Fase = { status?: string };

type EstadoReel = {
  status?: {
    video_status?: string;
    processing_phase?: Fase;
    publishing_phase?: Fase & { publish_status?: string };
  };
  error?: { message?: string };
};

/**
 * Consulta el estado del Reel hasta que la fase de publicación termine.
 * **Un `success: true` del `finish` no es una publicación**: Meta procesa y
 * revisa después, y puede rechazar el video minutos más tarde.
 */
async function esperarPublicacion(videoId: string, opciones: OpcionesFacebook): Promise<void> {
  const hacer = opciones.fetchImpl ?? fetch;
  const espera = opciones.esperarMs ?? ESPERA_REEL.esperarMs;
  const intentos = opciones.intentos ?? ESPERA_REEL.intentos;
  const params = new URLSearchParams({ fields: 'status', access_token: opciones.token });

  for (let i = 0; i < intentos; i++) {
    const res = await hacer(`${GRAPH}/${videoId}?${params}`, { method: 'GET' });
    const json = (await res.json()) as EstadoReel;
    if (!res.ok || json.error) {
      throw new Error(`La API de Facebook rechazo el estado de ${videoId}: ${json.error?.message ?? 'sin detalle'}`);
    }

    const estado = json.status;
    const fallo =
      ['error', 'expired', 'upload_failed'].includes(estado?.video_status ?? '') ||
      estado?.processing_phase?.status === 'error' ||
      estado?.publishing_phase?.status === 'error';
    if (fallo) {
      throw new Error(`Facebook rechazo el Reel ${videoId}: ${estado?.video_status ?? 'error'}`);
    }
    if (estado?.publishing_phase?.status === 'completed') return;

    await dormir(espera);
  }
  throw new Error(`El Reel ${videoId} sigue sin publicarse despues de ${intentos} intentos.`);
}

/**
 * Publica el Reel de una pieza en la Página, en tres fases y una espera:
 *
 * 1. `start` abre la subida y devuelve el `video_id` y la `upload_url`.
 * 2. La subida pasa la URL de R2 en la cabecera `file_url`: Meta descarga el
 *    video y **el Worker nunca toca los bytes**. Se usa la `upload_url` que
 *    devuelve `start`, no una armada a mano.
 * 3. `finish` con `video_state=PUBLISHED` y el caption del Reel en `description`.
 * 4. La espera de `esperarPublicacion()`.
 */
export async function publicarReelFacebook(
  pieza: Pieza,
  opciones: OpcionesFacebook,
): Promise<PublicacionFacebook> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const reel = pieza.reel;
  if (!reel?.video) {
    throw new Error(`La pieza ${pieza.id} no tiene el video del Reel renderizado`);
  }

  const hacer = opciones.fetchImpl ?? fetch;
  const pageId = opciones.pageId;

  const inicio = await llamarFB(`${pageId}/video_reels`, { upload_phase: 'start' }, opciones);
  const videoId = String(inicio.video_id);

  const subida = await hacer(String(inicio.upload_url), {
    method: 'POST',
    headers: { Authorization: `OAuth ${opciones.token}`, file_url: reel.video },
  });
  const cuerpoSubida = (await subida.json()) as { success?: boolean; debug_info?: { message?: string } };
  if (!subida.ok || cuerpoSubida.success !== true) {
    // El mensaje de Meta, nunca el token: viaja en la cabecera, no en el error.
    const detalle = cuerpoSubida.debug_info?.message ?? `HTTP ${subida.status}`;
    throw new Error(`Facebook no pudo descargar el video de ${pieza.id}: ${detalle}`);
  }

  await llamarFB(
    `${pageId}/video_reels`,
    { upload_phase: 'finish', video_id: videoId, video_state: 'PUBLISHED', description: reel.caption },
    opciones,
  );

  await esperarPublicacion(videoId, opciones);
  return { id: videoId };
}
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `facebook.ts` ya tiene `GRAPH`, `llamarFB`, `validar`, `formatear`, `Pieza` y `PublicacionFacebook`. `dormir` **no** existe en este archivo —la de `meta.ts` es privada—, por eso se declara aquí.
- `meta.ts` no importa `facebook.ts`: importar `ESPERA_REEL` desde allí no crea un ciclo.
- El `GET` del estado lleva el token en la URL, igual que `llamar()` de `meta.ts` con `GET`. Es el patrón que ya funciona en producción; no cambiarlo en esta task.

- [ ] **Step 5: comprobar que pasan**

Run: `node --import tsx --test lib/publicar/facebook.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`

- [ ] **Step 6: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| borrar `await esperarPublicacion(videoId, opciones);` | «un success del finish no basta» |
| `=== 'completed'` → `=== 'complete'` | «un Reel de Facebook abre la subida…» (se agota la espera) |
| borrar `estado?.processing_phase?.status === 'error' \|\|` y `estado?.publishing_phase?.status === 'error'`, dejando solo `video_status` | **no cae**: el fixture de rechazo trae `video_status: 'error'`. Anotarlo: el test cubre el caso que Meta documenta, no las fases por separado |
| `cuerpoSubida.success !== true` → `false` | «si Facebook no puede descargar el video» |

- [ ] **Step 7: commit**

```bash
git add lib/publicar/facebook.ts lib/publicar/facebook.test.ts
git commit -m "feat(reels): publicar el reel en Facebook y esperar a que Meta lo publique"
```

---

### Task 7: los dos canales en la tanda

**Files:**
- Modify: `lib/publicar/tanda.ts`
- Test: `lib/publicar/tanda.test.ts`

- [ ] **Step 1: ajustar los dos tests que cambian de expectativa**

Sin secretos de Facebook, ahora se omiten dos canales, no uno. En `lib/publicar/tanda.test.ts`, reemplazar exactamente:

```typescript
  assert.deepEqual(r, { mes: '2026-09', revisadas: 0, publicadas: [], fallidas: [], omitidos: ['facebook'] });
```

por:

```typescript
  assert.deepEqual(r, {
    mes: '2026-09', revisadas: 0, publicadas: [], fallidas: [], omitidos: ['facebook', 'reel-facebook'],
  });
```

Y reemplazar exactamente:

```typescript
  assert.deepEqual(r.omitidos, ['facebook']);
```

por:

```typescript
  assert.deepEqual(r.omitidos, ['facebook', 'reel-facebook']);
```

- [ ] **Step 2: el fetch falso aprende las rutas de los Reels**

En `lib/publicar/tanda.test.ts`, reemplazar la función `falsoFetch` entera —desde `function falsoFetch(` hasta su `return { impl, llamadas };` y la `}` que la cierra— por:

```typescript
function falsoFetch(
  opciones: {
    captions?: string[];
    descripciones?: string[];
    falla?: string;
    fallaLecturaFacebook?: boolean;
  } = {},
) {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    const metodo = init?.method ?? 'GET';
    const cuerpoStr = init?.body ? ` ${String(init.body)}` : '';
    llamadas.push(`${metodo} ${u.split('?')[0].split('/v21.0/')[1] ?? u}${cuerpoStr}`);

    if (u.includes('/media?') && metodo === 'GET') {
      return json({ data: (opciones.captions ?? []).map((caption) => ({ caption })) });
    }
    if (u.includes('/posts?') && metodo === 'GET') {
      if (opciones.fallaLecturaFacebook) {
        return json({ error: { message: 'caida' } }, 400);
      }
      return json({ data: [] });
    }
    if (u.includes('/video_reels?') && metodo === 'GET') {
      return json({ data: (opciones.descripciones ?? []).map((description) => ({ description })) });
    }
    if (u.endsWith('/video_reels') && metodo === 'POST') {
      if (String(init?.body ?? '').includes('upload_phase=start')) {
        return json({ video_id: 'VID-1', upload_url: 'https://rupload.facebook.com/video-upload/v21.0/VID-1' });
      }
      return json({ success: true });
    }
    if (u.startsWith('https://rupload.facebook.com/') && metodo === 'POST') {
      return json({ success: true });
    }
    if (u.includes('fields=status&') && metodo === 'GET') {
      return json({
        status: {
          video_status: 'ready',
          processing_phase: { status: 'completed' },
          publishing_phase: { status: 'completed', publish_status: 'published' },
        },
      });
    }
    if (u.endsWith('/media') && metodo === 'POST') {
      const cuerpo = String(init?.body ?? '');
      if (opciones.falla && cuerpo.includes(opciones.falla)) {
        return json({ error: { message: 'la imagen no es accesible' } }, 400);
      }
      return json({ id: 'contenedor-1' });
    }
    if (u.endsWith('/photos') && metodo === 'POST') {
      return json({ id: 'foto-1' });
    }
    if (u.endsWith('/feed') && metodo === 'POST') {
      return json({ id: 'post-77' });
    }
    if (u.endsWith('/media_publish')) return json({ id: 'media-99' });
    if (metodo === 'GET') return json({ status_code: 'FINISHED' });
    throw new Error(`ruta no simulada: ${metodo} ${u}`);
  }) as typeof fetch;
  return { impl, llamadas };
}
```

⚠️ El orden de los `if` importa: el estado de un Reel de Facebook (`fields=status&`) tiene que ir **antes** del `GET` genérico del final, que responde como un contenedor de Instagram. El de Instagram se consulta con `fields=status_code%2Cstatus`, que no casa con `fields=status&`.

- [ ] **Step 3: los tests nuevos**

Añadir al final de `lib/publicar/tanda.test.ts`:

```typescript
const GUION = 'Un chatbot responde. Un CRM te dice a quién llamar mañana. Desde catorce noventa y nueve al mes.';

const conReel = (id: string, publicarEl: string): Pieza => ({
  ...pieza(id, publicarEl),
  reel: {
    guion: GUION,
    caption: `reel de ${id}`,
    video: `https://reels.pukadigital.com/reels/2026-09/${id}-1a2b3c4d.mp4`,
  },
});

test('el Reel de Instagram sale en su franja, la tercera del tema', async () => {
  // Carrusel el 8 a las 09:00, imagen de Facebook el 8 a las 18:00: el Reel de
  // Instagram toca el 9 a las 09:00, que es AHORA.
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB, ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([conReel('tema', '2026-09-08T09:00')]),
  });
  assert.deepEqual(r.publicadas, [{ canal: 'reel-instagram', id: 'tema', mediaId: 'media-99' }]);
  assert.deepEqual(r.fallidas, []);
  assert.ok(llamadas.some((l) => l.includes('media_type=REELS')), 'debe crear un contenedor REELS');
});

test('el Reel de Facebook sale en la cuarta franja y espera a que Meta lo publique', async () => {
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB,
    ahora: new Date('2026-09-09T23:05:00Z'), // 18:05 de Ecuador del 9
    fetchImpl: impl,
    buscarMes: soloEsteMes([conReel('tema', '2026-09-08T09:00')]),
  });
  assert.deepEqual(r.publicadas, [{ canal: 'reel-facebook', id: 'tema', mediaId: 'VID-1' }]);
  assert.ok(llamadas.some((l) => l.includes('upload_phase=finish')), 'debe cerrar la subida');
  assert.ok(llamadas.some((l) => l.startsWith('GET VID-1')), 'debe consultar el estado del Reel');
});

test('no republica un Reel de Facebook que ya está en la Página', async () => {
  const { impl } = falsoFetch({ descripciones: ['reel de tema'] });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB,
    ahora: new Date('2026-09-09T23:05:00Z'), fetchImpl: impl,
    buscarMes: soloEsteMes([conReel('tema', '2026-09-08T09:00')]),
  });
  assert.deepEqual(r.publicadas, []);
  assert.deepEqual(r.fallidas, []);
});

test('el carrusel y el Reel de Instagram comparten una sola lectura del perfil', async () => {
  // A las 09:05 del 9 tocan a la vez el carrusel de una pieza y el Reel de otra.
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('carrusel', '2026-09-09T09:00'), conReel('tema', '2026-09-08T09:00')]),
  });
  assert.deepEqual(r.publicadas.map((p) => p.canal), ['instagram', 'reel-instagram']);
  assert.equal(llamadas.filter((l) => l === 'GET 1/media').length, 1, 'una sola lectura de /media');
});

test('sin Reels en la tanda, los canales de Reel no leen nada', async () => {
  const { impl, llamadas } = falsoFetch();
  await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB, ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('toca', '2026-09-09T09:00')]),
  });
  assert.ok(!llamadas.some((l) => l.includes('video_reels')), 'no debe leer /video_reels');
});
```

- [ ] **Step 4: comprobar que fallan**

Run: `node --import tsx --test lib/publicar/tanda.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 5` — los dos de `omitidos` y tres de los nuevos. Dos **pasan ya**, y no es un fallo del test:

- «sin Reels en la tanda, los canales de Reel no leen nada», porque hoy nadie lee `/video_reels`;
- «no republica un Reel de Facebook que ya está en la Página», porque hoy no hay canal que lo publique.

Su valor está en las mutaciones del Step 11. Medido en el ensayo del paso 0.

- [ ] **Step 5: los imports**

En `lib/publicar/tanda.ts`, reemplazar exactamente:

```typescript
import { publicarPieza } from './meta.ts';
import { publicarPiezaFacebook } from './facebook.ts';
import { pendientesFacebook, pendientesInstagram } from './programado.ts';
```

por:

```typescript
import { publicarPieza, publicarReelInstagram } from './meta.ts';
import { publicarPiezaFacebook, publicarReelFacebook } from './facebook.ts';
import {
  pendientesFacebook,
  pendientesInstagram,
  pendientesReelFacebook,
  pendientesReelInstagram,
} from './programado.ts';
```

- [ ] **Step 6: los nombres de canal y el descriptor**

En `lib/publicar/tanda.ts`, reemplazar exactamente:

```typescript
export type NombreCanal = 'instagram' | 'facebook';
```

por:

```typescript
export type NombreCanal = 'instagram' | 'facebook' | 'reel-instagram' | 'reel-facebook';
```

Y reemplazar exactamente:

```typescript
type Canal = {
  nombre: NombreCanal;
  recientes(o: Opciones): Promise<string[]>;
```

por:

```typescript
type Canal = {
  nombre: NombreCanal;
  /**
   * Si el canal tiene algo que mirar en esta tanda. Los de Reel se saltan enteros
   * cuando ninguna pieza trae video: sin esto leerían el perfil de balde, y un
   * fallo de esa lectura saldría como fallo de un canal que no tenía nada que hacer.
   */
  aplica?(piezas: Pieza[]): boolean;
  recientes(o: Opciones): Promise<string[]>;
```

- [ ] **Step 7: la lectura con `description`**

En `lib/publicar/tanda.ts`, reemplazar exactamente:

```typescript
/**
 * Las publicaciones recientes de un perfil. Instagram las llama `caption` en
 * `/media`; Facebook, `message` en `/posts`. Lo demás es idéntico.
 */
async function textosRecientes(
  o: Opciones,
  ruta: string,
  campo: 'caption' | 'message',
  token: string,
): Promise<string[]> {
```

por:

```typescript
type CampoTexto = 'caption' | 'message' | 'description';

/**
 * Las publicaciones recientes de un perfil. Instagram las llama `caption` en
 * `/media`; Facebook, `message` en `/posts`, y `description` en `/video_reels`
 * para los Reels, que no salen en `/posts`. Lo demás es idéntico.
 */
async function textosRecientes(
  o: Opciones,
  ruta: string,
  campo: CampoTexto,
  token: string,
): Promise<string[]> {
```

- [ ] **Step 8: los canales**

En `lib/publicar/tanda.ts`, reemplazar la función `canalesDe` entera —desde `function canalesDe(o: Opciones)` hasta el `return { canales, omitidos };` y la `}` que la cierra— por:

```typescript
function canalesDe(o: Opciones): { canales: Canal[]; omitidos: NombreCanal[] } {
  // Una lectura por perfil y por tanda: el carrusel y el Reel de Instagram miran
  // los dos `/media`. Si esa lectura falla, falla para los dos, que es lo que
  // tiene que pasar: ninguno puede saber qué ya salió.
  const lecturas = new Map<string, Promise<string[]>>();
  const leer = (op: Opciones, ruta: string, campo: CampoTexto, token: string) => {
    const clave = `${ruta}#${campo}`;
    let lectura = lecturas.get(clave);
    if (!lectura) {
      lectura = textosRecientes(op, ruta, campo, token);
      lecturas.set(clave, lectura);
    }
    return lectura;
  };
  const traeReel = (piezas: Pieza[]) => piezas.some((p) => Boolean(p.reel?.video));

  const canales: Canal[] = [
    {
      nombre: 'instagram',
      recientes: (op) => leer(op, `${op.igUserId}/media`, 'caption', op.token),
      pendientes: pendientesInstagram,
      publicar: (pieza, mes, op) =>
        publicarPieza(pieza, mes, {
          igUserId: op.igUserId,
          token: op.token,
          fetchImpl: op.fetchImpl,
        }),
    },
  ];
  const omitidos: NombreCanal[] = [];

  // Capturados en constantes: dentro de los closures el estrechamiento de tipo
  // de `o.fbPageId` no sobrevive.
  const pageId = o.fbPageId;
  const fbToken = o.fbToken;
  if (pageId && fbToken) {
    canales.push({
      nombre: 'facebook',
      recientes: (op) => leer(op, `${pageId}/posts`, 'message', fbToken),
      pendientes: pendientesFacebook,
      publicar: (pieza, mes, op) =>
        publicarPiezaFacebook(pieza, mes, { pageId, token: fbToken, fetchImpl: op.fetchImpl }),
    });
  } else {
    omitidos.push('facebook');
  }

  // Los Reels van después de los canales de imagen: el orden del resultado es el
  // de las franjas de un tema.
  canales.push({
    nombre: 'reel-instagram',
    aplica: traeReel,
    recientes: (op) => leer(op, `${op.igUserId}/media`, 'caption', op.token),
    pendientes: pendientesReelInstagram,
    publicar: (pieza, _mes, op) =>
      publicarReelInstagram(pieza, { igUserId: op.igUserId, token: op.token, fetchImpl: op.fetchImpl }),
  });

  if (pageId && fbToken) {
    canales.push({
      nombre: 'reel-facebook',
      aplica: traeReel,
      recientes: (op) => leer(op, `${pageId}/video_reels`, 'description', fbToken),
      pendientes: pendientesReelFacebook,
      publicar: (pieza, _mes, op) =>
        publicarReelFacebook(pieza, { pageId, token: fbToken, fetchImpl: op.fetchImpl }),
    });
  } else {
    omitidos.push('reel-facebook');
  }

  return { canales, omitidos };
}
```

- [ ] **Step 9: el orquestador respeta `aplica`**

En `lib/publicar/tanda.ts`, reemplazar exactamente:

```typescript
  for (const canal of canales) {
    try {
```

por:

```typescript
  for (const canal of canales) {
    if (canal.aplica && !canal.aplica(piezas)) continue;
    try {
```

⚠️ **Avisos: lo que va a parecer un error y no lo es.**
- `_mes` sin usar es intencional: los Reels no dependen del mes, porque su URL ya viene completa en `reel.video`. La firma de `publicar` la fija el descriptor `Canal`.
- Los canales de Reel **no** pasan `esperarMs` ni `intentos`: usan `ESPERA_REEL` por defecto, que es lo que tiene que pasar en producción. En los tests el estado responde publicado a la primera, así que no se duerme.
- `worker.ts` imprime `r.omitidos.join(',')` y `p.canal`: los nombres nuevos se imprimen solos, **no hay que tocarlo**.

- [ ] **Step 10: comprobar que pasan, y la suite entera**

Run: `node --import tsx --test lib/publicar/tanda.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ fail 0`

Run: `npm test 2>&1 | grep -E "^ℹ (tests|fail)"` y `npx tsc --noEmit; echo "exit=$?"`
Expected: `ℹ tests 172` · `ℹ fail 0` · `exit=0`

- [ ] **Step 11: mutaciones**

| Mutación | Test que tiene que caer |
|---|---|
| borrar `if (canal.aplica && !canal.aplica(piezas)) continue;` | «sin Reels en la tanda, los canales de Reel no leen nada» |
| en `leer`, quitar la caché: `return textosRecientes(op, ruta, campo, token);` | «el carrusel y el Reel de Instagram comparten una sola lectura» |
| `'description'` → `'message'` en el canal `reel-facebook` | «no republica un Reel de Facebook que ya está en la Página» |

- [ ] **Step 12: commit**

```bash
git add lib/publicar/tanda.ts lib/publicar/tanda.test.ts
git commit -m "feat(reels): los reels como dos canales mas de la tanda"
```

**Caminos de entrada:** `publicarLoQueToca()` la llaman `worker.ts:scheduled()` y `app/api/cron/publicar/route.ts`. Los dos solo reenvían entorno y **no cambian**: los tests de `tanda.test.ts` recorren el camino entero desde `publicarLoQueToca()` hasta la Graph API simulada.

---

### Task 8: la frontera del Worker

**Files:**
- Create: `lib/publicar/frontera.test.ts`

`lib/reels/` todavía no existe; lo crea el plan 2. Este test se escribe **antes**, para que la frontera esté vigilada desde el primer archivo de ese plan.

- [ ] **Step 1: escribir el test**

Crear `lib/publicar/frontera.test.ts`:

```typescript
// lib/publicar/frontera.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const RAIZ = process.cwd();
const LIB = join(RAIZ, 'lib');

/** Los imports relativos de un archivo, resueltos a rutas absolutas. */
function importsDe(archivo: string): string[] {
  const codigo = readFileSync(archivo, 'utf8');
  return [...codigo.matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g)]
    .map((m) => m[1])
    .filter((especificador) => especificador.startsWith('.'))
    .map((especificador) => resolve(dirname(archivo), especificador));
}

/**
 * Todo lo que alcanza un punto de entrada siguiendo imports relativos. Solo se
 * baja por `lib/`: `worker.ts` importa también el bundle de `.open-next/`, que es
 * generado y no hace falta recorrer.
 */
function alcanzables(entrada: string): string[] {
  const inicio = resolve(RAIZ, entrada);
  const vistos = new Set<string>();
  const pendientes = [inicio];
  while (pendientes.length > 0) {
    const actual = pendientes.pop() as string;
    if (vistos.has(actual)) continue;
    vistos.add(actual);
    const recorrible = actual === inicio || actual.startsWith(LIB);
    if (recorrible && existsSync(actual)) pendientes.push(...importsDe(actual));
  }
  return [...vistos].map((ruta) => relative(RAIZ, ruta));
}

test('lo que carga el Worker no alcanza lib/reels/: sus dependencias no caben en un Worker', () => {
  const prohibidos = alcanzables('worker.ts').filter((ruta) => ruta.startsWith(join('lib', 'reels')));
  assert.deepEqual(prohibidos, []);
});

test('el detector sigue imports de verdad: si no, el test de arriba pasaría siempre', () => {
  const alcanza = alcanzables('worker.ts');
  assert.ok(alcanza.includes(join('lib', 'publicar', 'tanda.ts')), 'debe seguir worker.ts → tanda.ts');
  assert.ok(alcanza.includes(join('lib', 'piezas', 'validar.ts')), 'y bajar hasta lib/piezas/');
});
```

- [ ] **Step 2: comprobar que pasa**

Run: `node --import tsx --test lib/publicar/frontera.test.ts 2>&1 | grep -E "^ℹ (pass|fail)"`
Expected: `ℹ pass 2` · `ℹ fail 0`

Aquí no hay fase roja posible: la frontera ya se cumple. **La mutación del Step 3 es la que prueba que el test sirve.**

- [ ] **Step 3: mutación — la única prueba de que el test vigila algo**

Añadir temporalmente, como primera línea de `lib/publicar/tanda.ts`:

```typescript
import '../reels/cualquiera.ts';
```

Run: `node --import tsx --test lib/publicar/frontera.test.ts 2>&1 | grep -E "^ℹ fail"`
Expected: `ℹ fail 1`, con `lib/reels/cualquiera.ts` en el mensaje.

Borrar la línea. Run otra vez. Expected: `ℹ fail 0`.

⚠️ Correr **solo** `frontera.test.ts` durante la mutación: el resto de la suite importa `tanda.ts` de verdad y fallaría por otro motivo —el archivo no existe—, lo que no prueba nada sobre la frontera.

- [ ] **Step 4: commit**

```bash
git add lib/publicar/frontera.test.ts
git commit -m "test(reels): el worker no alcanza lib/reels/"
```

---

### Task 9: la documentación

**Files:**
- Modify: `docs/PUBLICACION_EN_REDES.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: la sección de los Reels**

En `docs/PUBLICACION_EN_REDES.md`, reemplazar exactamente:

```markdown
---

## Cómo se publica
```

por:

```markdown
---

## Los Reels

Una pieza puede traer un bloque `reel` con el guion, su caption y la URL del MP4
en R2. Sale entonces en dos canales más, y el tema ocupa cuatro franjas seguidas:

| Franja | Qué sale | Fecha |
|---|---|---|
| 1 | Carrusel en Instagram | `publicarEl` |
| 2 | Imagen en Facebook | `facebook.publicarEl`, o la siguiente |
| 3 | Reel en Instagram | `reel.publicarEl`, o la siguiente |
| 4 | Reel en Facebook | siempre la siguiente a la 3 |

Sin imagen de Facebook la franja 2 no existe, y el Reel encadena desde el carrusel.

⚠️ **El caption del Reel tiene que ser distinto** del carrusel y del de Facebook.
Con el mismo texto, la defensa contra repetidos lo daría por publicado y no saldría
nunca. `piezas --check` lo rechaza.

⚠️ **Un Reel sin `reel.video` no se publica**: todavía no está renderizado.

🔴 **No dispares a mano un Reel de Facebook dentro de su hora** sin mirar antes la
Página. Meta tarda de uno a tres minutos en procesarlo, y puede que en ese tiempo
no aparezca en el listado que se usa para no repetir: un segundo disparo lo
publicaría dos veces. El cron solo no puede, porque cada franja tiene una única
ejecución dentro de su ventana.

**La publicación de un Reel tarda minutos**: el Worker espera a que Meta procese
el video. Si disparas la ruta a mano, **deja terminar el `curl`**. Cortarlo mata el
Worker a media publicación.

---

## Cómo se publica
```

- [ ] **Step 2: la tabla de archivos**

En `docs/PUBLICACION_EN_REDES.md`, reemplazar exactamente:

```markdown
| `lib/publicar/meta.ts` · `facebook.ts` | los clientes de cada red |
```

por:

```markdown
| `lib/publicar/meta.ts` · `facebook.ts` | los clientes de cada red: carrusel, imagen y Reel |
| `lib/publicar/frontera.test.ts` | que lo que carga el Worker no alcance `lib/reels/` |
```

- [ ] **Step 3: una línea en `AGENTS.md`**

En `AGENTS.md`, reemplazar exactamente:

```markdown
Una pieza de `content/piezas/` sale en **dos canales**: el carrusel completo en
Instagram, y en Facebook **una sola imagen** con su caption largo, en la franja
siguiente (09:00 → 18:00; 18:00 → 09:00 del día siguiente).
```

por:

```markdown
Una pieza de `content/piezas/` sale en **dos canales**: el carrusel completo en
Instagram, y en Facebook **una sola imagen** con su caption largo, en la franja
siguiente (09:00 → 18:00; 18:00 → 09:00 del día siguiente). Con bloque `reel`,
sale además como Reel en los dos, en las dos franjas que siguen.
```

- [ ] **Step 4: el tope de `AGENTS.md`**

Run: `wc -m AGENTS.md`
Expected: por debajo de `12000`.

- [ ] **Step 5: commit**

```bash
git add docs/PUBLICACION_EN_REDES.md AGENTS.md
git commit -m "docs(reels): como salen los reels y el aviso del disparo manual"
```

---

### Task 10: verificación final

Sin código. `superpowers:verification-before-completion`: evidencia antes que afirmación.

- [ ] **Step 1: la suite, los tipos y el contenido**

```bash
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)"
npx tsc --noEmit; echo "exit=$?"
npm run piezas -- --check
```

Expected: `ℹ tests 174` · `ℹ fail 0` · `exit=0` · `7 pieza(s) validas en 2026-09.`

- [ ] **Step 2: el camino de producción, no solo que compile**

El Worker se construye con OpenNext. Que `tsc` pase no prueba que el bundle salga:

```bash
npm run build:cloudflare
```

Expected: termina sin error. `build:cloudflare` corre `npm run build`, que a su vez corre `prebuild`: piezas, tests y tipos otra vez.

- [ ] **Step 3: el repositorio está donde tiene que estar**

```bash
git branch --show-current                          # feat/reels-publicacion
git log --oneline main -1                          # main intacta
git log --oneline main..HEAD                       # los 9 commits de las Tasks 1-9
git ls-remote origin feat/reels-publicacion | wc -l  # 0 si no se pusheó todavía
git status --short                                 # vacío
```

- [ ] **Step 4: alcance — lo tocado contra lo que nombra el plan**

```bash
for f in $(git diff --name-only main..HEAD); do
  grep -q "$(basename $f)" docs/superpowers/plans/2026-09-13-reels-publicacion.md || echo "⚠️  $f"
done
```

Expected: sin salida. Si aparece algo, mirar su diff antes de rechazarlo: no todo lo que sale es scope creep.

- [ ] **Step 5: `app/` sigue limpio**

```bash
npx eslint app/ 2>&1 | tail -3
```

Expected: sin problemas nuevos. Este plan no toca `app/`.

---

## Lo que este plan NO hace, a propósito

- **No despliega.** El despliegue es a mano: `npm run deploy:cloudflare`, y lo hace una persona.
- **No produce ningún Reel.** Eso es el plan 2. Hasta entonces, un Reel solo sale si alguien pega a mano un bloque `reel` con la URL pública de un MP4.
- **No toca `lib/publicar/cli.ts`.** El ensayo `npm run publicar -- --id … --facebook` sigue siendo solo de imágenes.
- **No verifica el hueco de Facebook.** Que un Reel en proceso aparezca o no en `/video_reels` solo se puede ver publicando uno real: queda para el primer Reel.
