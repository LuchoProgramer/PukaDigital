# Imagen propia para Facebook — Plan de Implementación

> **Para quien ejecute esto:** usar `superpowers:subagent-driven-development` o
> `superpowers:executing-plans` y hacerlo tarea por tarea. Los pasos llevan
> casillas (`- [ ]`) para ir marcando.

**Objetivo:** que la publicación de Facebook lleve una imagen escrita para ir
sola, en vez de la slide 1 del carrusel de Instagram con su contador «01 / 05».

**Arquitectura:** no se separa la fábrica. Se reutiliza el mismo renderizador
(Satori + Resvg), las mismas fuentes, los mismos tokens y el mismo tamaño 4:5 —
que es el que Facebook recomienda—. Lo que se añade es un modelo de contenido
propio (`facebook.imagen`) y una variante de plantilla sin contador.

**Stack:** TypeScript estricto, Satori, Resvg, `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-09-imagen-propia-facebook-design.md`

---

## Línea base medida

`npm test` da **121 pasando, 0 fallando** el 2026-09-09.

⚠️ **No hay totales esperados en este plan, a propósito.** Cada tarea dice qué
tests añade; el total se mide, no se escribe. Un número escrito en un plan es una
verificación falsa en cuanto el código se mueve debajo — este proyecto ya se
comió esa (el plan de Facebook decía «100 tests pasando» cuando eran 80).

---

## 🔴 La fecha que manda

**`crm-no-chatbot` sale en Facebook el 11/09 a las 09:00.** Si su imagen no está
escrita y generada para entonces, saldrá con la slide 1 del carrusel y el
contador. Las tareas 1 a 6 tienen que estar hechas antes de esa mañana.

**Si no llega:** correr su `facebook.publicarEl` a una fecha posterior. Es una
línea, y no publicar es reversible.

---

## Estructura de archivos

| Archivo | Responsabilidad | Tarea |
|---|---|---|
| `lib/piezas/tipos.ts` | el campo `facebook.imagen` | 1 |
| `lib/piezas/validar.ts` | qué hace válida una imagen de Facebook | 2 |
| `lib/piezas/plantillaFacebook.tsx` | **nuevo** — la composición sin contador | 3 |
| `lib/piezas/render.ts` | emitir `<id>-fb.png` | 4 |
| `lib/publicar/facebook.ts` · `cli.ts` | dejar de pedir `-1-4x5.png` | 5 |
| `lib/publicar/programado.ts` | no programar piezas sin imagen | 5 |
| `content/piezas/2026-09.ts` | las 4 imágenes que faltan | 6 |
| `lib/piezas/prohibidas.ts` | las 4 fugas de sinónimos | 7 |
| `docs/PUKAHEALTH_LIMITES.md` | doctrina de producto — **commit aparte** | 8 |

---

## Tarea 1: El campo `facebook.imagen`

**Files:**
- Modify: `lib/piezas/tipos.ts`

- [ ] **Paso 1: Añadir el campo**

En `lib/piezas/tipos.ts`, el bloque `facebook` es hoy:

```typescript
  facebook?: {
    caption?: string;
    publicarEl?: string;
  };
```

Sustituirlo por:

```typescript
  facebook?: {
    caption?: string;
    publicarEl?: string;
    /**
     * La imagen que sale en Facebook. **No es la slide 1 del carrusel**: una
     * slide 1 es un gancho incompleto a propósito —existe para que deslices— y
     * sola en un feed no dice nada. Esta lleva la conclusión.
     *
     * Sin `bajada`, `badge` ni `cta`: cada uno es una franja de texto más
     * compitiendo por la atención en una imagen que se ve de paso. Lo que no
     * cabe en el titular va al caption.
     */
    imagen?: {
      /** Admite `\n` para cortar de línea a mano. Ver `plantillaFacebook.tsx`. */
      titular: string;
      dato?: { valor: string; etiqueta: string };
      /** Archivo de `assets/capturas/`. Recorte de la región de interés. */
      captura?: string;
    };
  };
```

- [ ] **Paso 2: Comprobar que compila**

Ejecutar: `npx tsc --noEmit`
Esperado: exit 0. Nadie usa el campo todavía, así que no debe romper nada.

- [ ] **Paso 3: Commit**

```bash
git add lib/piezas/tipos.ts
git commit -m "feat(piezas): campo facebook.imagen en el tipo Pieza"
```

---

## Tarea 2: Validar la imagen de Facebook

Sin esto, dos implementadores resolverían distinto qué es una imagen válida.

**Files:**
- Modify: `lib/piezas/validar.ts`
- Modify: `lib/piezas/validar.test.ts`

- [ ] **Paso 1: Escribir los tests (ROJO)**

Añadir al final de `lib/piezas/validar.test.ts`:

```typescript
test('el titular de la imagen de Facebook es obligatorio y no puede ir vacio', () => {
  const pieza: Pieza = {
    id: 'sin-titular',
    sistema: 'puka',
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: 'fb', imagen: { titular: '   ' } },
    slides: [{ titular: 'T' }],
  };
  const errores = validar([pieza]);
  assert.equal(errores.length, 1);
  assert.match(errores[0].campo, /facebook\.imagen\.titular/);
});

test('el titular de Facebook respeta los mismos topes que una slide', () => {
  const base = {
    id: 'topes',
    sistema: 'puka' as const,
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    slides: [{ titular: 'T' }],
  };
  // 10 palabras: una por encima de MAX_PALABRAS_TITULAR.
  const diezPalabras: Pieza = {
    ...base,
    facebook: { caption: 'fb', imagen: { titular: 'una dos tres cuatro cinco seis siete ocho nueve diez' } },
  };
  assert.equal(validar([diezPalabras]).length, 1, '10 palabras debe fallar');

  // 61 caracteres: uno por encima de TOPES.titular.
  const largo: Pieza = {
    ...base,
    facebook: { caption: 'fb', imagen: { titular: 'a'.repeat(61) } },
  };
  assert.equal(validar([largo]).length, 1, '61 caracteres debe fallar');
});

test('una captura de Facebook que no existe en disco rompe la validacion', () => {
  const pieza: Pieza = {
    id: 'captura-fantasma',
    sistema: 'puka',
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: 'fb', imagen: { titular: 'Un titular', captura: 'no-existe.png' } },
    slides: [{ titular: 'T' }],
  };
  const errores = validar([pieza]);
  assert.equal(errores.length, 1);
  assert.match(errores[0].campo, /facebook\.imagen\.captura/);
});

test('un precio ajeno al catalogo en la imagen de Facebook rompe la validacion', () => {
  // Una imagen es tan publicable como un caption, y un precio falso impreso en
  // un PNG es peor: sobrevive a la captura de pantalla.
  const pieza: Pieza = {
    id: 'precio-falso',
    sistema: 'puka',
    producto: 'pukaia',
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: 'fb', imagen: { titular: 'Desde $7 al mes' } },
    slides: [{ titular: 'T' }],
  };
  const errores = validar([pieza]);
  assert.ok(errores.some((e) => e.campo.includes('facebook.imagen')));
});

test('una afirmacion prohibida en la imagen de PukaHealth rompe la validacion', () => {
  const pieza: Pieza = {
    id: 'prohibida-en-imagen',
    sistema: 'health',
    producto: 'pukahealth',
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: 'fb', imagen: { titular: 'Descarga nuestra app' } },
    slides: [{ titular: 'T' }],
  };
  const errores = validar([pieza]);
  assert.ok(errores.some((e) => e.campo.includes('facebook.imagen')));
});
```

- [ ] **Paso 2: Verlos fallar**

Ejecutar: `node --import tsx --test lib/piezas/validar.test.ts`
Esperado: los 5 nuevos en rojo. Los que ya existían, en verde.

- [ ] **Paso 3: Implementar**

En `lib/piezas/validar.ts`, dentro del bloque `if (pieza.facebook) { … }` que ya
existe, y **después** de las comprobaciones de `caption` y `publicarEl`, añadir:

```typescript
      const img = pieza.facebook.imagen;
      if (img) {
        const titular = img.titular?.trim() ?? '';
        if (titular === '') {
          en('facebook.imagen.titular', 'el titular de la imagen de Facebook está vacío');
        } else {
          // Los mismos topes que una slide: si no cabe grande, está mal escrito.
          const palabras = titular.split(/\s+/).length;
          if (palabras > MAX_PALABRAS_TITULAR) {
            en(
              'facebook.imagen.titular',
              `${palabras} palabras, máximo ${MAX_PALABRAS_TITULAR}: si no cabe grande, está mal escrito`,
            );
          }
          if (titular.length > TOPES.titular) {
            en('facebook.imagen.titular', `${titular.length} caracteres, máximo ${TOPES.titular}`);
          }
        }

        if (img.dato) {
          if (!img.dato.valor?.trim()) en('facebook.imagen.dato.valor', 'el valor del dato está vacío');
          if (!img.dato.etiqueta?.trim()) en('facebook.imagen.dato.etiqueta', 'la etiqueta del dato está vacía');
        }

        if (img.captura && !existsSync(join(process.cwd(), 'assets', 'capturas', img.captura))) {
          en('facebook.imagen.captura', `la captura ${img.captura} no existe en assets/capturas/`);
        }
      }
```

Y añadir el texto de la imagen a la lista de captions que ya se validan por
precios, ofertas y prohibiciones. La lista actual es:

```typescript
    const captionsAValidar: Array<[string, string | undefined]> = [
      ['caption', pieza.caption],
      ['facebook.caption', pieza.facebook?.caption],
    ];
```

Sustituirla por:

```typescript
    const captionsAValidar: Array<[string, string | undefined]> = [
      ['caption', pieza.caption],
      ['facebook.caption', pieza.facebook?.caption],
      // La imagen se valida igual que un caption: un precio falso impreso en un
      // PNG es peor que en un texto, porque sobrevive a la captura de pantalla.
      ['facebook.imagen.titular', pieza.facebook?.imagen?.titular],
      ['facebook.imagen.dato', pieza.facebook?.imagen?.dato
        ? `${pieza.facebook.imagen.dato.valor} ${pieza.facebook.imagen.dato.etiqueta}`
        : undefined],
    ];
```

Al principio del archivo hacen falta dos imports que quizá no estén:

```typescript
import { existsSync } from 'node:fs';
import { join } from 'node:path';
```

- [ ] **Paso 4: Verlos pasar**

Ejecutar: `node --import tsx --test lib/piezas/validar.test.ts`
Esperado: todos en verde, los nuevos y los de antes.

- [ ] **Paso 5: Comprobar por mutación**

Comentar la línea `if (titular.length > TOPES.titular)`, correr los tests y
**confirmar que cae** el test de topes. Restaurar. Si no cae, el test no probaba
nada.

- [ ] **Paso 6: Commit**

```bash
git add lib/piezas/validar.ts lib/piezas/validar.test.ts
git commit -m "feat(piezas): validar la imagen de Facebook como un caption mas"
```

---

## Tarea 3: La plantilla de Facebook

**Files:**
- Create: `lib/piezas/plantillaFacebook.tsx`
- Create: `lib/piezas/plantillaFacebook.test.ts`

- [ ] **Paso 1: Escribir los tests (ROJO)**

Crear `lib/piezas/plantillaFacebook.test.ts`:

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import satori from 'satori';
import { PlantillaFacebook } from './plantillaFacebook.tsx';
import { cargarFuentes } from './fuentes.ts';
import { sistemas } from './sistemas.ts';
import { FORMATOS } from './formatos.ts';

const fuentes = cargarFuentes();

async function render(imagen: Parameters<typeof PlantillaFacebook>[0]['imagen']) {
  const { ancho, alto } = FORMATOS['4x5'];
  return satori(PlantillaFacebook({ imagen, tokens: sistemas.puka }), {
    width: ancho,
    height: alto,
    fonts: fuentes,
  });
}

test('la imagen de Facebook no lleva contador de carrusel', async () => {
  // El post del 2026-09-09 salio con «01 / 05» impreso, prometiendo cuatro
  // imagenes que no existen. Este test es el que impide que vuelva.
  const svg = await render({ titular: 'Un titular de conclusion' });
  assert.doesNotMatch(svg, /01\s*\/\s*0/, 'no debe dibujar el contador');
});

test('el salto de linea del titular sale de verdad, no se traga', async () => {
  // Sin `whiteSpace: pre-line` Satori normaliza el \n como espacio y el titular
  // sale en una sola linea. Comprobado el 2026-09-09: 48px contra 96px.
  const unaLinea = await render({ titular: 'AAAA BBBB' });
  const dosLineas = await render({ titular: 'AAAA\nBBBB' });
  const alto = (svg: string) => {
    const m = svg.match(/<rect x="0" y="0" width="\d+" height="(\d+)"/);
    return m ? Number(m[1]) : 0;
  };
  assert.ok(
    alto(dosLineas) > alto(unaLinea),
    `el \\n debe ocupar mas alto: una linea ${alto(unaLinea)}px, dos ${alto(dosLineas)}px`,
  );
});

test('el dato aparece cuando se declara y no cuando no', async () => {
  const con = await render({ titular: 'Titular', dato: { valor: '166', etiqueta: 'sesiones' } });
  const sin = await render({ titular: 'Titular' });
  assert.ok(con.length > sin.length, 'con dato debe dibujar mas');
});
```

- [ ] **Paso 2: Verlos fallar**

Ejecutar: `node --import tsx --test lib/piezas/plantillaFacebook.test.ts`
Esperado: FAIL, `Cannot find module './plantillaFacebook.tsx'`.

- [ ] **Paso 3: Implementar**

Crear `lib/piezas/plantillaFacebook.tsx`. **En JSX**, como `plantilla.tsx`:

```tsx
import { AVISO, FONDO_AVISO, cargarCaptura, medidasAviso } from './capturas.ts';
import { FORMATOS, MARGEN } from './formatos.ts';
import type { TokensSistema } from './sistemas.ts';

export type ImagenFacebook = {
  titular: string;
  dato?: { valor: string; etiqueta: string };
  captura?: string;
};

type Props = {
  imagen: ImagenFacebook;
  tokens: TokensSistema;
};

/**
 * La pieza que sale en Facebook, que NO es una slide de carrusel.
 *
 * Tres diferencias con `Plantilla`, y las tres tienen motivo:
 *
 * 1. **Sin contador `01 / 05`.** Es un post de una sola foto: ese contador
 *    prometeria cuatro imagenes que no existen. Fue el defecto del primer post
 *    real, el 2026-09-09.
 * 2. **Solo titular y dato.** Cada franja de texto mas compite por la atencion
 *    en una imagen que se ve de paso. Lo demas va al caption.
 * 3. **La captura es prueba, no decoracion**: va debajo del titular, con su
 *    aviso de datos ficticios pegado.
 */
export function PlantillaFacebook({ imagen, tokens }: Props) {
  const medidas = FORMATOS['4x5'];
  const anchoUtil = medidas.ancho - MARGEN * 2;
  const aviso = medidasAviso(medidas.alto, anchoUtil);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: medidas.ancho,
        height: medidas.alto,
        padding: MARGEN,
        backgroundColor: tokens.fondo,
        color: tokens.tinta,
        fontFamily: 'Instrument Sans',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Bricolage Grotesque',
          fontWeight: tokens.pegaso ? 800 : 700,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          // ⚠️ NO QUITAR. Sin esto Satori normaliza el \n como espacio y el
          // titular sale en una sola linea. Medido el 2026-09-09: 48px con
          // whiteSpace por defecto, 96px con pre-line.
          whiteSpace: 'pre-line',
        }}
      >
        {imagen.titular}
      </div>

      {imagen.dato && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 32 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontSize: 72,
              color: tokens.acento,
            }}
          >
            {imagen.dato.valor}
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: tokens.apoyo }}>
            {imagen.dato.etiqueta}
          </div>
        </div>
      )}

      {imagen.captura && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${tokens.borde}`,
          }}
        >
          <img src={cargarCaptura(imagen.captura)} width={anchoUtil} />
          {/* El aviso va pegado a la captura, no al pie de la pieza. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: anchoUtil,
              height: aviso.alto,
              backgroundColor: FONDO_AVISO,
              color: '#FFFFFF',
              fontSize: aviso.fuente,
            }}
          >
            {AVISO}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', marginTop: 'auto', fontSize: 26, color: tokens.apoyo }}>
        pukadigital.com
      </div>
    </div>
  );
}
```

⚠️ **El `whiteSpace: 'pre-line'` no es cosmetico.** Es lo unico que hace que el
`\n` del titular corte de linea. El Paso 5 lo comprueba quitandolo.

- [ ] **Paso 4: Verlos pasar**

Ejecutar: `node --import tsx --test lib/piezas/plantillaFacebook.test.ts`
Esperado: los 3 en verde.

- [ ] **Paso 5: Comprobar por mutación el que más importa**

Quitar `whiteSpace: 'pre-line'` del titular y correr los tests.
Esperado: cae `'el salto de linea del titular sale de verdad, no se traga'`.
Restaurar. **Si no cae, el test no sirve** y hay que arreglarlo antes de seguir.

- [ ] **Paso 6: Commit**

```bash
git add lib/piezas/plantillaFacebook.tsx lib/piezas/plantillaFacebook.test.ts
git commit -m "feat(piezas): plantilla propia de Facebook, sin contador de carrusel"
```

---

## Tarea 4: Generar el `<id>-fb.png`

**Files:**
- Modify: `lib/piezas/render.ts`
- Modify: `lib/piezas/render.test.ts`

- [ ] **Paso 1: Escribir el test (ROJO)**

Añadir a `lib/piezas/render.test.ts`:

```typescript
test('una pieza con facebook.imagen emite ademas su -fb.png', async () => {
  const pieza: Pieza = {
    id: 'con-imagen-fb',
    sistema: 'puka',
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    formatos: ['4x5'],
    facebook: { caption: 'fb', imagen: { titular: 'Un titular de conclusion' } },
    slides: [{ titular: 'Slide uno' }, { titular: 'Slide dos' }],
  };
  const salida = await renderPieza(pieza);
  const nombres = salida.map((s) => s.nombre);
  assert.ok(nombres.includes('con-imagen-fb-fb.png'), `falta el -fb.png en ${nombres.join(', ')}`);
  assert.equal(nombres.filter((n) => n.endsWith('-fb.png')).length, 1, 'solo uno');
});

test('una pieza sin facebook.imagen no emite -fb.png', async () => {
  const pieza: Pieza = {
    id: 'sin-imagen-fb',
    sistema: 'puka',
    caption: 'ig',
    publicarEl: '2026-09-09T09:00',
    formatos: ['4x5'],
    slides: [{ titular: 'Slide uno' }],
  };
  const salida = await renderPieza(pieza);
  assert.ok(!salida.some((s) => s.nombre.endsWith('-fb.png')));
});
```

- [ ] **Paso 2: Verlos fallar**

Ejecutar: `node --import tsx --test lib/piezas/render.test.ts`
Esperado: FAIL, falta `con-imagen-fb-fb.png`.

- [ ] **Paso 3: Implementar**

En `lib/piezas/render.ts`, añadir el import:

```typescript
import { PlantillaFacebook } from './plantillaFacebook.tsx';
```

Y en `renderPieza`, **después** del bucle de formatos y slides y **antes** del
`return salida;`:

```typescript
  // La imagen de Facebook, si la pieza la declara. Va en 4x5 —el formato que
  // Facebook recomienda para el feed— y con su propia plantilla: no es una
  // slide del carrusel.
  const imagenFb = pieza.facebook?.imagen;
  if (imagenFb) {
    const { ancho, alto } = FORMATOS['4x5'];
    const svg = await satori(
      PlantillaFacebook({ imagen: imagenFb, tokens: sistemas[pieza.sistema] }),
      { width: ancho, height: alto, fonts: fuentes() },
    );
    salida.push({
      nombre: `${pieza.id}-fb.png`,
      png: Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: ancho } }).render().asPng()),
    });
  }
```

- [ ] **Paso 4: Verlos pasar**

Ejecutar: `node --import tsx --test lib/piezas/render.test.ts`
Esperado: verde.

- [ ] **Paso 5: Commit**

```bash
git add lib/piezas/render.ts lib/piezas/render.test.ts
git commit -m "feat(piezas): renderizar la imagen de Facebook como <id>-fb.png"
```

---

## Tarea 5: Que la publicación pida el archivo correcto

🔴 **Esta es la tarea que evita un 404 en producción.** Hoy `facebook.ts` pide
`-1-4x5.png` cableado, y `fechaPublicacionFacebook` programa cualquier pieza con
`publicarEl` tenga imagen o no.

**Files:**
- Modify: `lib/publicar/facebook.ts:57`
- Modify: `lib/publicar/facebook.test.ts`
- Modify: `lib/publicar/cli.ts:42`
- Modify: `lib/publicar/programado.ts`
- Modify: `lib/publicar/programado.test.ts`

- [ ] **Paso 1: Escribir los tests (ROJO)**

Añadir a `lib/publicar/programado.test.ts`:

```typescript
test('una pieza sin facebook.imagen no se programa para Facebook', () => {
  // Si se programara, se intentaria subir un -fb.png que no existe: 404 en el
  // CDN y un fallo en produccion que nadie ve venir.
  const pieza: Pieza = { ...base, id: 'sin-imagen', publicarEl: '2026-09-09T09:00' };
  assert.equal(fechaPublicacionFacebook(pieza), undefined);
  assert.deepEqual(pendientesFacebook([pieza], new Date('2026-09-09T23:05:00Z'), []), []);
});

test('una pieza con facebook.imagen si se programa, por la franja siguiente', () => {
  const pieza: Pieza = {
    ...base,
    id: 'con-imagen',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: 'texto de facebook', imagen: { titular: 'Un titular' } },
  };
  assert.equal(fechaPublicacionFacebook(pieza), '2026-09-09T18:00');
});
```

Y en `lib/publicar/facebook.test.ts`, cambiar la expectativa del archivo: donde
diga `-1-4x5.png` debe decir `-fb.png`. Añadir además:

```typescript
test('sube el -fb.png, no la slide 1 del carrusel', async () => {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push(String(init?.body ?? ''));
    const u = String(url);
    if (u.endsWith('/photos')) return json({ id: 'foto-1' });
    return json({ id: 'post-77' });
  }) as unknown as typeof fetch;

  await publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl));
  const subida = decodeURIComponent(llamadas[0]);
  assert.match(subida, /-fb\.png/);
  assert.doesNotMatch(subida, /-1-4x5\.png/);
});
```

⚠️ `piezaBase` de ese archivo necesita ahora un bloque
`facebook: { caption: '…', imagen: { titular: '…' } }` para seguir siendo válida.

- [ ] **Paso 2: Verlos fallar**

Ejecutar:
`node --import tsx --test lib/publicar/programado.test.ts lib/publicar/facebook.test.ts`
Esperado: rojo en los nuevos.

- [ ] **Paso 3: Implementar los cuatro cambios**

En `lib/publicar/facebook.ts:57`:

```typescript
  const archivo = `${pieza.id}-fb.png`;
```

En `lib/publicar/cli.ts:42`:

```typescript
    console.log(`  ${urlPublica(mes, `${pieza.id}-fb.png`)}`);
```

En `lib/publicar/programado.ts`, `fechaPublicacionFacebook` pasa de:

```typescript
export function fechaPublicacionFacebook(pieza: Pieza): string | undefined {
  if (pieza.facebook?.publicarEl) return pieza.facebook.publicarEl;
  if (pieza.publicarEl) return franjaSiguiente(pieza.publicarEl);
  return undefined;
}
```

a:

```typescript
export function fechaPublicacionFacebook(pieza: Pieza): string | undefined {
  // Sin imagen no hay nada que publicar: el `-fb.png` no se genera, asi que
  // programarla terminaria pidiendo al CDN un archivo que no existe.
  if (!pieza.facebook?.imagen) return undefined;
  if (pieza.facebook.publicarEl) return pieza.facebook.publicarEl;
  if (pieza.publicarEl) return franjaSiguiente(pieza.publicarEl);
  return undefined;
}
```

- [ ] **Paso 4: Verlos pasar**

Ejecutar: `npm test`
Esperado: todo verde. ⚠️ Si algún test de `tanda.test.ts` se pone rojo es porque
sus piezas de prueba no tienen `facebook.imagen`: añadírselo, **no aflojar la
aserción**.

- [ ] **Paso 5: Comprobar por mutación**

Devolver `facebook.ts:57` a `-1-4x5.png` y confirmar que cae el test nuevo.
Restaurar.

- [ ] **Paso 6: Commit**

```bash
git add lib/publicar/facebook.ts lib/publicar/facebook.test.ts lib/publicar/cli.ts \
        lib/publicar/programado.ts lib/publicar/programado.test.ts
git commit -m "fix(publicar): pedir el -fb.png y no programar piezas sin imagen"
```

---

## Tarea 6: Las cuatro imágenes que faltan

🔴 **Tarea editorial, y la que manda el calendario.** `crm-no-chatbot` sale el
11/09 a las 09:00.

**Files:**
- Modify: `content/piezas/2026-09.ts`
- Generate: `public/piezas/2026-09/*-fb.png`

- [ ] **Paso 1: Escribir los cuatro bloques `imagen`**

Para cada una de estas piezas, añadir `imagen` dentro de su bloque `facebook`:

| Pieza | Sale | Qué debe decir el titular |
|---|---|---|
| `crm-no-chatbot` | 11/09 09:00 | la conclusión: que es un CRM, no un chatbot |
| `enter-tumba-factura` | 15/09 18:00 | la conclusión sobre el error de facturación |
| `requisitos-facturar-sri` | 18/09 09:00 | el requisito concreto, no el gancho |
| `receta-contenido-minimo` | 22/09 18:00 | qué debe llevar la receta |

Ejemplo completo para la primera, como referencia de forma:

```typescript
    facebook: {
      publicarEl: '2026-09-11T09:00',
      caption: '…el que ya existe, sin tocar…',
      imagen: {
        titular: 'No es un chatbot:\nes un CRM completo',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
      },
    },
```

⚠️ **Reglas al escribirlos**, que la validación hará cumplir:
- máximo **9 palabras** y **60 caracteres**;
- el `\n` corta línea, y conviene usarlo para que no rompa donde no debe;
- si lleva precio, tiene que ser del catálogo del producto;
- en PukaHealth, cuidado con las afirmaciones prohibidas.

- [ ] **Paso 2: Validar antes de generar**

Ejecutar: `npm run piezas -- --check`
Esperado: `7 pieza(s) validas en 2026-09.` y exit 0.

- [ ] **Paso 3: Generar los PNG**

Ejecutar: `npm run piezas`
Esperado: entre los archivos escritos aparecen los cuatro `-fb.png`.

- [ ] **Paso 4: Mirarlos con los ojos**

Abrir los cuatro PNG y comprobar, uno por uno:
- **no** aparece «01 / 05» ni ningún contador;
- el titular se lee entero y corta donde debe;
- si hay captura, se entiende qué se está viendo y **el aviso de datos ficticios
  está presente**;
- no se coló nada raro en el encuadre.

⚠️ Este paso no se salta. «Compila» no es «se ve bien»: en este proyecto una
tipografía compilaba perfecto y renderizaba en monoespaciado.

- [ ] **Paso 5: Comprobar que la red de seguridad está puesta**

Aquí no hay guarda de código que mutar —es contenido—, pero sí se puede
comprobar que **la validación protege este contenido de verdad**, que es lo que
importa. Sobre `content/piezas/2026-09.ts`, una a una y restaurando después:

1. Añadir una palabra al titular de una imagen hasta pasar de 9 →
   `npx tsx lib/piezas/cli.ts --check` debe salir con **código 1**.
2. Cambiar el `$14.99` de `crm-no-chatbot` por `$7` → debe salir con código 1 y
   decir que no es un precio de PukaIA.
3. Poner `captura: 'no-existe.png'` en cualquiera → código 1.

**Si alguna de las tres sale con código 0, la validación no está protegiendo el
contenido** y hay que volver a la Tarea 2 antes de seguir.

- [ ] **Paso 6: Commit**

```bash
git add content/piezas/2026-09.ts public/piezas/2026-09/
git commit -m "feat(piezas): imagen propia de Facebook para las piezas de septiembre"
```

---

## Tarea 7: Tapar las cuatro fugas de `prohibidas.ts`

**Files:**
- Modify: `lib/piezas/prohibidas.ts`
- Modify: `lib/piezas/prohibidas.test.ts`

- [ ] **Paso 1: Escribir los tests (ROJO)**

Añadir a `lib/piezas/prohibidas.test.ts`:

```typescript
test('las prohibiciones no se esquivan cambiando una palabra por su sinonimo', () => {
  // Las cuatro las encontro el usuario redactando, no el validador: la frase
  // «nos adaptamos a cualquier rubro» es como se escribe de verdad.
  const fugas = [
    'Nos adaptamos a cualquier rubro medico',
    'Servimos a cualquier sector de la salud',
    'Descarga nuestra aplicacion movil',
    'Tu paciente pide su turno sin llamarte',
    'Le llega un mensaje automatico por WhatsApp',
  ];
  for (const texto of fugas) {
    assert.ok(
      afirmacionesProhibidas(texto).length > 0,
      `deberia atrapar: "${texto}"`,
    );
  }
});

test('las prohibiciones que ya funcionaban siguen funcionando', () => {
  const conocidas = [
    'Se adapta a cualquier especialidad',
    'Descarga nuestra app',
    'Tu paciente agenda solo',
    'Recordatorios por WhatsApp',
    'Sincronizacion bidireccional con Google',
    'Precio beta $25/mes',
  ];
  for (const texto of conocidas) {
    assert.ok(afirmacionesProhibidas(texto).length > 0, `dejo de atrapar: "${texto}"`);
  }
});

test('una frase legitima no se marca como prohibida', () => {
  // La red de seguridad contra patrones demasiado anchos.
  const buenas = [
    'La arquitectura permite sumar especialidades sin reescribir el sistema',
    'Funciona en el celular',
    'Tus citas se envian a tu Google Calendar',
    'Historia clinica digital para cualquier consultorio medico',
  ];
  for (const texto of buenas) {
    assert.deepEqual(afirmacionesProhibidas(texto), [], `falso positivo en: "${texto}"`);
  }
});
```

- [ ] **Paso 2: Verlos fallar**

Ejecutar: `node --import tsx --test lib/piezas/prohibidas.test.ts`
Esperado: cae el primero; los otros dos pasan ya.

- [ ] **Paso 3: Ampliar los cuatro patrones**

En `lib/piezas/prohibidas.ts`:

```typescript
    nombre: 'especialidades',
    patron: /(cualquier|toda|todas las|cada)\s+(especialidad|rubro|sector|[aá]rea|profesi[oó]n)/,
```

```typescript
    nombre: 'app-nativa',
    patron: /(nuestra|la)\s+(app|aplicaci[oó]n)\b|descarga\s+(la|nuestra)\s+(app|aplicaci[oó]n)|app\s+nativa/,
```

```typescript
    nombre: 'reservas-paciente',
    patron: /(paciente|pacientes)[^.]{0,30}(reserva|agenda|agendan?|pide|solicita)\s+(su\s+)?(turno|cita|hora)?\s*(solo|por su cuenta|en l[ií]nea|sin llamar\w*)/,
```

```typescript
    nombre: 'whatsapp',
    patron: /(recordatorio|recordatorios|aviso|avisos|notificacion|notificaciones|mensaje|mensajes)\s*(automatico|automaticos|automático|automáticos)?[^.]{0,40}whatsapp/,
```

- [ ] **Paso 4: Verlos pasar**

Ejecutar: `node --import tsx --test lib/piezas/prohibidas.test.ts`
Esperado: los tres en verde. **El tercero importa tanto como el primero**: es el
que impide que un patrón demasiado ancho empiece a marcar frases legítimas.

- [ ] **Paso 5: Comprobar que el contenido real sigue válido**

Ejecutar: `npm run piezas -- --check`
Esperado: `7 pieza(s) validas`. Si alguna pieza real cae, el patrón se pasó de
ancho: estrecharlo, **no borrar el test**.

- [ ] **Paso 6: Comprobar por mutación, patrón por patrón**

Devolver **uno solo** de los cuatro patrones a su versión vieja, correr los tests
y confirmar que cae el test de fugas. Restaurar y repetir con el siguiente.

| Patrón devuelto a su versión vieja | Debe caer |
|---|---|
| `especialidades` | el test de fugas |
| `app-nativa` | el test de fugas |
| `reservas-paciente` | el test de fugas |
| `whatsapp` | el test de fugas |

🔑 **Los cuatro por separado, no los cuatro a la vez.** Mutándolos juntos, el
test cae igual y no demuestra que cada patrón esté cubierto: bastaría con que uno
solo funcionase. Si al devolver un patrón el test **no** cae, esa fuga concreta no
tiene test y hay que añadirlo.

- [ ] **Paso 7: Commit**

```bash
git add lib/piezas/prohibidas.ts lib/piezas/prohibidas.test.ts
git commit -m "fix(piezas): las prohibiciones ya no se esquivan con un sinonimo"
```

---

## Tarea 8: La regla de especialidades — commit aparte

Esto es **doctrina de producto**, no el generador de imágenes. Va en su propio
commit para que se pueda revisar por sí solo.

**Files:**
- Modify: `lib/piezas/prohibidas.ts` (solo el `motivo` de `especialidades`)
- Modify: `docs/PUKAHEALTH_LIMITES.md`

- [ ] **Paso 1: Corregir el motivo**

El actual dice: `'Solo hay una especialidad implementada: podología. Las demás
caen a un formulario genérico'`. Es falso en sus dos mitades. Sustituir por:

```typescript
    motivo:
      'Hay dos verticales clínicas: podología y hemodiálisis. Las demás usan el ' +
      'sistema completo (historia clínica, SOAP, CIE-10, recetas, certificados, ' +
      'facturación SRI) pero sin bloque clínico propio de su rubro',
    enCambio: '«la arquitectura permite sumar especialidades sin reescribir el sistema»',
```

- [ ] **Paso 2: Actualizar `docs/PUKAHEALTH_LIMITES.md`**

En la tabla «Lo que el producto NO hace», la fila de «Se adapta a cualquier
especialidad» pasa a decir, en la columna de la verdad:

```markdown
**Hay dos verticales clínicas: podología y hemodiálisis** (verificado contra el
código de `SistemaSalud` el 2026-09-09: `LedgerXpertz/hemodialisis/`, 260 commits
en un mes, ~32.700 líneas, 50 migraciones en producción, y un cliente real
—`dialife`— con 166 sesiones registradas). Las demás especialidades usan el
sistema completo, sin bloque clínico propio. Añadir uno es **desarrollo a
medida**, no configuración. Sí vale: «la arquitectura permite sumar
especialidades sin reescribir el sistema»
```

Y añadir debajo de la tabla:

```markdown
⚠️ **Lo que sí se puede decir sobre la velocidad**, y es mejor material que
cualquier promesa de adaptabilidad: «en un mes construimos la vertical completa
de hemodiálisis, con la normativa del IESS incluida». Es verificable —están los
commits— y concreto.

Tres cuidados: ese mes incluyó **sesiones semanales con una auditora clínica
externa**, así que no se generaliza a «cualquier especialidad en un mes»; hay que
**mostrar el caso, no prometer el plazo**; y conviene decir «vertical» o
«módulo», no «especialidad», porque en el código hemodiálisis no está en el
registry.
```

- [ ] **Paso 3: Comprobar**

ℹ️ **Aquí tampoco hay mutación**, y también es correcto: lo que cambia es el
**texto** del mensaje de error y un documento. No hay guarda nueva ni
comportamiento nuevo — el patrón que decide qué se atrapa ya se mutó en la Tarea
7. Lo único que hay que comprobar es que el cambio de texto no rompe nada.

Ejecutar: `npm test && npm run piezas -- --check`
Esperado: verde. El `motivo` es texto de mensaje, no debería romper tests — si
alguno lo compara literal, actualizarlo.

- [ ] **Paso 4: Commit**

```bash
git add lib/piezas/prohibidas.ts docs/PUKAHEALTH_LIMITES.md
git commit -m "docs(pukahealth): dos verticales clinicas, no una"
```

---

## Criterio de aceptación global

1. `npm test` en verde, con más tests que la línea base **medida al empezar**.
2. `npx tsc --noEmit` exit 0.
3. `npm run piezas -- --check` → `7 pieza(s) validas en 2026-09.`, exit 0.
4. Los cuatro `-fb.png` generados, **mirados con los ojos** y commiteados.
5. Ninguno lleva contador de carrusel.
6. `grep -rn '1-4x5' lib/publicar/` no devuelve nada.
7. ESLint en `app/`: los mismos 31 problemas preexistentes, ni uno más.

## Después

⚠️ **Mergear no despliega.** Hace falta `npm run deploy:cloudflare`. Y los PNG
son estáticos servidos por el Worker: sin desplegar, la publicación del 11/09
pediría un `-fb.png` que en producción todavía no existe.

**El orden seguro el 11/09:** desplegar **antes** de las 09:00, o correr la fecha
de `crm-no-chatbot`.
