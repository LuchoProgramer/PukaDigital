# Facebook como canal propio — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar piezas de redes en Facebook con formato de imagen nativo (slide 1 en 4x5) y caption argumentativo largo (sin hashtags), desacoplado del texto de Instagram, con generación asistida por Gemini en tiempo de PR y publicación determinista en cron.

**Architecture:** Dos tuberías independientes:
1. **Escritura (tiempo de PR):** CLI `npm run captions` consulta slides, catálogo de precios y afirmaciones prohibidas para generar captions vía Gemini (o compositor determinista como fallback) e imprimirlos por consola para revisión humana e inserción en `content/piezas/YYYY-MM.ts`. `piezas --check` valida reglas comerciales y de salud.
2. **Publicación (cron determinista):** Cada corrida revisa Instagram y Facebook. Facebook publica la slide 1 en 4x5 en dos pasos de Graph API (`/{page-id}/photos` con `published=false` y `/{page-id}/feed` con `attached_media` y `message`), utilizando la franja siguiente (09:00 → 18:00 mismo día; 18:00 → 09:00 día siguiente) y cargando mes actual y anterior para evitar pérdidas en fin de mes.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript 5 · `@google/genai` 1.30.0 · `node --import tsx --test`

**Spec:** `docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md`
**Contrastes resueltos:** `docs/superpowers/specs/2026-09-07-facebook-contraste-agy.md` y `docs/superpowers/specs/2026-09-07-facebook-contraste-agy-2.md`

---

## Línea base medida

⚠️ **La línea base cambió y los totales acumulados de abajo son de otra época.**

| Cuándo | `npm test` |
|---|---|
| 2026-09-07, cuando se escribió este plan | 71 pasando |
| **2026-09-09, medido** | **80 pasando, 0 fallando** |

La diferencia son los tests que entraron con `tanda.ts` (fase A) y con la ventana
de 60 minutos. Cada tarea dice **cuántos tests añade**; ese delta sigue valiendo.
Los **totales absolutos** que aparecen en las tareas 1 a 5 se calcularon sobre 71
y **no se han recalculado**, porque el número real de cada tramo solo se sabe
midiendo: sumar 9 a mano produciría otra cifra inventada, que es exactamente el
problema.

🔑 **Medir con `npm test` antes de empezar cada tarea y comparar contra lo
medido, no contra el número impreso aquí.** Un total escrito en un plan es una
verificación falsa en cuanto el código se mueve debajo.

---

## Tarea 1: Tipo `Pieza.facebook` y compositor determinista (`componer.ts`)

Extender la definición de `Pieza` en `lib/piezas/tipos.ts` con el campo `facebook?: { caption?: string; publicarEl?: string }` e implementar la función pura `componer(pieza: Pieza): string` en `lib/captions/componer.ts` que transforma slides en un caption estructurado sin hashtags, manejando piezas sin producto y rutas relativas de `catalogo.ts`.

**Files:**
- Create: `lib/captions/componer.ts`
- Create: `lib/captions/componer.test.ts`
- Modify: `lib/piezas/tipos.ts`

- [ ] **Paso 1: Escribir los tests unitarios de `componer.ts` (RED)**

Crear `lib/captions/componer.test.ts`:

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { componer } from './componer.ts';
import type { Pieza } from '../piezas/tipos.ts';

test('compone un caption con titulares y bajadas separadas por bloque', () => {
  const pieza: Pieza = {
    id: 'test-simple',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [
      { titular: 'Primer titular', bajada: 'Primera bajada explicativa.' },
      { titular: 'Segundo titular', bajada: 'Segunda bajada explicativa.' },
    ],
  };

  const esperado =
    'Primer titular\n' +
    'Primera bajada explicativa.\n\n' +
    'Segundo titular\n' +
    'Segunda bajada explicativa.\n\n' +
    'pukadigital.com/ledgerxpertz';

  assert.equal(componer(pieza), esperado);
});

test('anexa valor y etiqueta de dato al titular con guion largo', () => {
  const pieza: Pieza = {
    id: 'test-dato',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [
      {
        titular: 'Pruébalo un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Sin tarjeta para empezar.',
      },
    ],
  };

  const esperado =
    'Pruébalo un mes — $14.99 al mes\n' +
    'Sin tarjeta para empezar.\n\n' +
    'pukadigital.com/agentes-ia';

  assert.equal(componer(pieza), esperado);
});

test('cierra con pukadigital.com para piezas de utilidad sin producto', () => {
  const pieza: Pieza = {
    id: 'requisitos-facturar-sri',
    sistema: 'puka',
    slides: [
      { titular: 'Cuatro cosas', bajada: 'Lo que te pide el SRI.' },
    ],
  };

  const esperado =
    'Cuatro cosas\n' +
    'Lo que te pide el SRI.\n\n' +
    'pukadigital.com';

  assert.equal(componer(pieza), esperado);
});

test('omite la bajada en slides que solo tienen titular', () => {
  const pieza: Pieza = {
    id: 'test-sin-bajada',
    sistema: 'puka',
    slides: [
      { titular: 'Solo titular' },
      { titular: 'Otro titular', bajada: 'Con bajada.' },
    ],
  };

  const esperado =
    'Solo titular\n\n' +
    'Otro titular\n' +
    'Con bajada.\n\n' +
    'pukadigital.com';

  assert.equal(componer(pieza), esperado);
});

test('no incluye hashtags en ningún lugar del texto compuesto', () => {
  const pieza: Pieza = {
    id: 'test-no-hashtags',
    sistema: 'health',
    producto: 'pukahealth',
    caption: 'Texto de Instagram con #salud #medicina',
    slides: [
      { titular: 'Titular de salud', bajada: 'Bajada de salud.' },
    ],
  };

  const resultado = componer(pieza);
  assert.ok(!resultado.includes('#'));
});

test('coincide exactamente con el texto de muestra de la spec para crm-no-chatbot', () => {
  const pieza: Pieza = {
    id: 'crm-no-chatbot',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [
      {
        badge: 'CRM PARA WHATSAPP',
        titular: 'No es un chatbot',
        bajada: 'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.',
      },
      {
        titular: 'Un bot contesta y ya',
        bajada:
          'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ' +
          'ni qué quería.',
      },
      {
        titular: 'Un CRM recuerda',
        bajada:
          'Cada conversación es un cliente con historial, etapa y siguiente paso. ' +
          'Sabes a quién llamar sin buscar en el chat.',
      },
      {
        titular: 'Qué incluye',
        bajada:
          'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e ' +
          'integraciones. El bot es una parte.',
      },
      {
        titular: 'Pruébalo un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Sin tarjeta para empezar.',
        cta: 'Escríbenos',
      },
    ],
  };

  const esperado =
    'No es un chatbot\n' +
    'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.\n\n' +
    'Un bot contesta y ya\n' +
    'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ' +
    'ni qué quería.\n\n' +
    'Un CRM recuerda\n' +
    'Cada conversación es un cliente con historial, etapa y siguiente paso. ' +
    'Sabes a quién llamar sin buscar en el chat.\n\n' +
    'Qué incluye\n' +
    'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e ' +
    'integraciones. El bot es una parte.\n\n' +
    'Pruébalo un mes — $14.99 al mes\n' +
    'Sin tarjeta para empezar.\n\n' +
    'pukadigital.com/agentes-ia';

  assert.equal(componer(pieza), esperado);
});
```

- [ ] **Paso 2: Extender `Pieza` en `lib/piezas/tipos.ts`**

Modificar `lib/piezas/tipos.ts` para añadir el campo opcional `facebook`:

```typescript
export type Pieza = {
  id: string;
  sistema: Sistema;
  /**
   * Que producto anuncia la pieza. Obligatorio en cuanto la pieza menciona un
   * precio o una oferta: sin el no hay forma de comprobar que el dato es cierto.
   * Las piezas de utilidad, que no venden nada, pueden omitirlo.
   */
  producto?: ProductoId;
  formatos?: Formato[];
  /** El texto del post de Instagram. Va aparte del arte. */
  caption?: string;
  /**
   * Precios que **no son nuestros**: los de la competencia en una comparativa.
   * Hay que declararlos uno a uno, sin el símbolo.
   */
  preciosAjenos?: string[];
  /**
   * Cuándo publicarla en Instagram, en hora de Ecuador: `2026-09-09T09:00`.
   * Sin este campo, la pieza no entra en el cron de Instagram.
   */
  publicarEl?: string;
  /**
   * Facebook. Si falta el bloque entero, la pieza igual se publica: el caption
   * se compone desde las slides y la fecha cae a la franja siguiente a la de
   * Instagram — 09:00 → 18:00 del mismo día; 18:00 → 09:00 del día siguiente.
   */
  facebook?: {
    caption?: string;
    publicarEl?: string;
  };
  slides: Slide[];
};
```

- [ ] **Paso 3: Implementar `componer.ts` (GREEN)**

Crear `lib/captions/componer.ts`:

```typescript
import { CATALOGO } from '../piezas/catalogo.ts';
import type { Pieza, Slide } from '../piezas/tipos.ts';

const DOMINIO = 'pukadigital.com';

function bloqueDeSlide(slide: Slide): string {
  let lineaTitular = slide.titular;
  if (slide.dato) {
    lineaTitular = `${slide.titular} — ${slide.dato.valor} ${slide.dato.etiqueta}`;
  }
  if (slide.bajada && slide.bajada.trim() !== '') {
    return `${lineaTitular}\n${slide.bajada.trim()}`;
  }
  return lineaTitular;
}

function urlCierre(pieza: Pieza): string {
  if (pieza.producto && CATALOGO[pieza.producto]) {
    const ruta = CATALOGO[pieza.producto].url;
    // ruta en CATALOGO empieza con '/', ej: '/agentes-ia'
    return `${DOMINIO}${ruta}`;
  }
  return DOMINIO;
}

/**
 * Compone un caption para Facebook a partir de las slides de la pieza.
 * Función pura, determinista y sin dependencias externas.
 */
export function componer(pieza: Pieza): string {
  const bloques = pieza.slides.map(bloqueDeSlide);
  bloques.push(urlCierre(pieza));
  return bloques.join('\n\n');
}
```

- [ ] **Paso 4: Verificar tests**

Ejecutar: `npm test`
Resultado esperado: **77 tests pasando** (+6 tests de `componer.test.ts`).

---

## Tarea 2: Validación de precios, ofertas y prohibiciones en captions (`validar.ts`)

Extender `lib/piezas/validar.ts` para que:
1. Valide precios y ofertas tanto en `pieza.caption` como en `pieza.facebook.caption` para **todos los productos**.
2. Exija que piezas sin `producto` no anuncien precios ni ofertas en captions ni slides.
3. Valide afirmaciones prohibidas en ambos captions **únicamente si `producto === 'pukahealth'`** (manteniendo verde `hechos.test.ts:130`).
4. Rechace configuraciones incompletas de Facebook: si `pieza.facebook.publicarEl` está definido, `pieza.facebook.caption` debe existir y no estar vacío.

**Files:**
- Modify: `lib/piezas/validar.ts`
- Modify: `lib/piezas/validar.test.ts`
- Modify: `lib/piezas/hechos.test.ts`

- [ ] **Paso 1: Escribir los tests de validación adicionales (RED)**

En `lib/piezas/validar.test.ts`, añadir:

```typescript
test('falla si declara facebook.publicarEl pero no tiene facebook.caption', () => {
  const descuidada: Pieza = {
    ...ok,
    facebook: {
      publicarEl: '2026-09-03T18:00',
    },
  };
  assert.deepEqual(campos([descuidada]), ['facebook.caption']);

  const vacia: Pieza = {
    ...ok,
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: '   ',
    },
  };
  assert.deepEqual(campos([vacia]), ['facebook.caption']);
});

test('acepta una pieza sin bloque facebook o con bloque facebook completo', () => {
  const sinBloque: Pieza = { ...ok };
  assert.deepEqual(validar([sinBloque]), []);

  const completa: Pieza = {
    ...ok,
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Caption de Facebook válido',
    },
  };
  assert.deepEqual(validar([completa]), []);
});
```

En `lib/piezas/hechos.test.ts`, añadir:

```typescript
test('precios no permitidos en caption de Instagram o Facebook rompen la validacion', () => {
  const malaIG: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    caption: 'Consigue tu ERP por solo $99 al mes.',
  };
  assert.deepEqual(campos([malaIG]), ['caption']);

  const malaFB: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Consigue tu ERP por solo $99 al mes en Facebook.',
    },
  };
  assert.deepEqual(campos([malaFB]), ['facebook.caption']);
});

test('ofertas no permitidas en facebook.caption rompen la validacion', () => {
  const malaOferta: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Prueba 30 dias gratis con LedgerXpertz.',
    },
  };
  assert.deepEqual(campos([malaOferta]), ['facebook.caption']);
});

test('una pieza sin producto con precio en caption falla con error en producto', () => {
  const huerfanaEnCaption: Pieza = {
    ...base,
    caption: 'Software por solo $15 al mes.',
  };
  assert.deepEqual(campos([huerfanaEnCaption]), ['producto']);

  const huerfanaEnFBCaption: Pieza = {
    ...base,
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Software por solo $15 al mes.',
    },
  };
  assert.deepEqual(campos([huerfanaEnFBCaption]), ['producto']);
});

test('afirmaciones prohibidas de PukaHealth en facebook.caption rompen la validacion', () => {
  const malaSaludFB: Pieza = {
    ...base,
    sistema: 'health',
    producto: 'pukahealth',
    facebook: {
      publicarEl: '2026-09-08T18:00',
      caption: 'Recordatorios por WhatsApp automáticos para tus pacientes.',
    },
  };
  const [e] = validar([malaSaludFB]);
  assert.equal(e.campo, 'facebook.caption');
  assert.match(e.mensaje, /WhatsApp/i);
});

test('las afirmaciones prohibidas en facebook.caption no aplican a otros productos', () => {
  const otraFB: Pieza = {
    ...base,
    sistema: 'puka',
    producto: 'ledgerxpertz',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Sincronización bidireccional con tu tienda online.',
    },
  };
  assert.deepEqual(validar([otraFB]), []);
});
```

- [ ] **Paso 2: Modificar `lib/piezas/validar.ts` (GREEN)**

Actualizar `lib/piezas/validar.ts`:

```typescript
import { CATALOGO, ofertasEn, preciosEn } from './catalogo.ts';
import { afirmacionesProhibidas } from './prohibidas.ts';
import { formatosDe } from './formatos.ts';
import type { ErrorValidacion, Pieza, Slide } from './tipos.ts';

export type { ErrorValidacion } from './tipos.ts';

const TOPES = {
  titular: 60,
  titular9x16: 48,
  bajada: 140,
  badge: 24,
  valor: 8,
  etiqueta: 16,
  cta: 24,
} as const;

const MAX_PALABRAS_TITULAR = 9;
const MAX_SLIDES = 10;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Los textos de una slide, en el orden en que se reportan los errores. */
function textos(slide: Slide): Array<[string, string]> {
  const pares: Array<[string, string]> = [
    ['titular', slide.titular],
    ['bajada', slide.bajada ?? ''],
    ['badge', slide.badge ?? ''],
    ['dato.valor', slide.dato?.valor ?? ''],
    ['dato.etiqueta', slide.dato?.etiqueta ?? ''],
    ['cta', slide.cta ?? ''],
  ];
  return pares.filter(([, texto]) => texto !== '');
}

/**
 * Valida un array de piezas de redes sociales contra las reglas de diseño y contenido.
 * Función pura: devuelve un array con los errores encontrados (vacío si todo es válido).
 * Nunca recorta texto ni ajusta tamaños.
 */
export function validar(piezas: Pieza[]): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const vistos = new Set<string>();

  for (const pieza of piezas) {
    const en = (campo: string, mensaje: string, slide?: number) => {
      errores.push({
        pieza: pieza.id,
        ...(slide !== undefined ? { slide } : {}),
        campo,
        mensaje,
      });
    };

    if (!KEBAB.test(pieza.id)) {
      en('id', 'el id debe ser kebab-case');
    }
    if (vistos.has(pieza.id)) {
      en('id', 'id duplicado dentro del array');
    }
    vistos.add(pieza.id);

    if (pieza.slides.length === 0) {
      en('slides', 'la pieza debe tener al menos una slide');
    } else if (pieza.slides.length > MAX_SLIDES) {
      en('slides', `${pieza.slides.length} slides, el tope de carrusel de Instagram son ${MAX_SLIDES}`);
    }

    // Hechos comerciales: el sistema visual lo manda el producto, no el autor.
    const producto = pieza.producto ? CATALOGO[pieza.producto] : undefined;
    if (producto && pieza.sistema !== producto.sistema) {
      en(
        'sistema',
        `${producto.nombre} usa el sistema '${producto.sistema}', no '${pieza.sistema}'`,
      );
    }

    // Validación del bloque facebook
    if (pieza.facebook) {
      if (
        pieza.facebook.publicarEl &&
        (!pieza.facebook.caption || pieza.facebook.caption.trim() === '')
      ) {
        en('facebook.caption', 'la pieza declara facebook.publicarEl pero no tiene facebook.caption');
      }
    }

    // Un precio o una oferta sin producto declarado no se puede verificar.
    // Aplica a slides y a ambos captions.
    if (!producto) {
      const vendeEnSlides = pieza.slides.some((slide) =>
        textos(slide).some(([, t]) => preciosEn(t).length > 0 || ofertasEn(t).length > 0),
      );
      const vendeEnCaption =
        (pieza.caption && (preciosEn(pieza.caption).length > 0 || ofertasEn(pieza.caption).length > 0)) ||
        (pieza.facebook?.caption &&
          (preciosEn(pieza.facebook.caption).length > 0 || ofertasEn(pieza.facebook.caption).length > 0));

      if (vendeEnSlides || vendeEnCaption) {
        en('producto', 'la pieza anuncia un precio o una oferta sin declarar que producto es');
      }
    }

    // Validar afirmaciones prohibidas, precios y ofertas en captions
    const captionsAValidar: Array<[string, string | undefined]> = [
      ['caption', pieza.caption],
      ['facebook.caption', pieza.facebook?.caption],
    ];

    for (const [campo, texto] of captionsAValidar) {
      if (!texto || texto.trim() === '') continue;

      if (pieza.producto === 'pukahealth') {
        for (const p of afirmacionesProhibidas(texto)) {
          en(campo, `${p.motivo}. En cambio: ${p.enCambio}`);
        }
      }

      if (producto) {
        const ajenos = pieza.preciosAjenos ?? [];
        for (const precio of preciosEn(texto)) {
          if (!producto.precios.includes(precio) && !ajenos.includes(precio)) {
            const permitidos = producto.precios.length > 0
              ? `los de ${producto.nombre} son ${producto.precios.map((p) => `$${p}`).join(', ')}`
              : `${producto.nombre} no lleva precio visible: se cotiza por WhatsApp`;
            en(campo, `$${precio} no es un precio de ${producto.nombre}: ${permitidos}`);
          }
        }
        for (const oferta of ofertasEn(texto)) {
          if (!producto.ofertas.includes(oferta)) {
            const permitidas = producto.ofertas.length > 0
              ? `la de ${producto.nombre} es '${producto.ofertas.join("', '")}'`
              : `${producto.nombre} no tiene oferta de gratuidad`;
            en(campo, `'${oferta}' no es la oferta de ${producto.nombre}: ${permitidas}`);
          }
        }
      }
    }

    const formatos = formatosDe(pieza);
    const topeTitular = formatos.includes('9x16')
      ? TOPES.titular9x16
      : TOPES.titular;

    pieza.slides.forEach((slide, i) => {
      const n = i + 1;
      const ultima = i === pieza.slides.length - 1;

      const palabras = slide.titular.trim().split(/\s+/).filter(Boolean).length;
      if (palabras > MAX_PALABRAS_TITULAR) {
        en(
          'titular',
          `${palabras} palabras, máximo ${MAX_PALABRAS_TITULAR}: si no cabe grande, está mal escrito`,
          n
        );
      } else if (slide.titular.length > topeTitular) {
        en('titular', `${slide.titular.length} caracteres, máximo ${topeTitular}`, n);
      }

      if (slide.bajada && slide.bajada.length > TOPES.bajada) {
        en('bajada', `${slide.bajada.length} caracteres, máximo ${TOPES.bajada}`, n);
      }

      if (slide.badge && slide.badge.length > TOPES.badge) {
        en('badge', `${slide.badge.length} caracteres, máximo ${TOPES.badge}`, n);
      }

      if (slide.dato) {
        if (slide.dato.valor.length > TOPES.valor) {
          en('dato.valor', `${slide.dato.valor.length} caracteres, máximo ${TOPES.valor}`, n);
        }
        if (slide.dato.etiqueta.length > TOPES.etiqueta) {
          en('dato.etiqueta', `${slide.dato.etiqueta.length} caracteres, máximo ${TOPES.etiqueta}`, n);
        }
      }

      if (slide.cta) {
        if (!ultima) {
          en('cta', 'el CTA solo puede aparecer en la última slide de la pieza', n);
        } else if (slide.cta.length > TOPES.cta) {
          en('cta', `${slide.cta.length} caracteres, máximo ${TOPES.cta}`, n);
        }
      }

      if (!producto) return;

      for (const [campo, texto] of textos(slide)) {
        if (pieza.producto === 'pukahealth') {
          for (const p of afirmacionesProhibidas(texto)) {
            en(campo, `${p.motivo}. En cambio: ${p.enCambio}`, n);
          }
        }

        const ajenos = pieza.preciosAjenos ?? [];
        for (const precio of preciosEn(texto)) {
          if (!producto.precios.includes(precio) && !ajenos.includes(precio)) {
            const permitidos = producto.precios.length > 0
              ? `los de ${producto.nombre} son ${producto.precios.map((p) => `$${p}`).join(', ')}`
              : `${producto.nombre} no lleva precio visible: se cotiza por WhatsApp`;
            en(campo, `$${precio} no es un precio de ${producto.nombre}: ${permitidos}`, n);
          }
        }
        for (const oferta of ofertasEn(texto)) {
          if (!producto.ofertas.includes(oferta)) {
            const permitidas = producto.ofertas.length > 0
              ? `la de ${producto.nombre} es '${producto.ofertas.join("', '")}'`
              : `${producto.nombre} no tiene oferta de gratuidad`;
            en(campo, `'${oferta}' no es la oferta de ${producto.nombre}: ${permitidas}`, n);
          }
        }
      }
    });
  }

  return errores;
}

export function formatear(errores: ErrorValidacion[]): string {
  return errores
    .map((e) => `  ${e.pieza}${e.slide ? ` · slide ${e.slide}` : ''} · ${e.campo}: ${e.mensaje}`)
    .join('\n');
}
```

- [ ] **Paso 3: Verificar tests**

Ejecutar: `npm test`
Resultado esperado: **84 tests pasando** (+7 tests de validación añadidos).

---

## Tarea 3: Cliente de publicación en Graph API para Facebook (`facebook.ts`)

Implementar `lib/publicar/facebook.ts` para publicar en la Página de Facebook en dos pasos:
1. `POST https://graph.facebook.com/v21.0/{page-id}/photos` con `published=false`, `url={urlPublica}` y `access_token` en el cuerpo (devuelve `id`).
2. `POST https://graph.facebook.com/v21.0/{page-id}/feed` con `attached_media[0]={"media_fbid":"..."}`, `message={caption}` y `access_token` en el cuerpo.
Utiliza la slide 1 en 4x5 (`${pieza.id}-1-4x5.png`) y `pieza.facebook.caption ?? componer(pieza)`.

**Files:**
- Create: `lib/publicar/facebook.ts`
- Create: `lib/publicar/facebook.test.ts`

- [ ] **Paso 1: Escribir los tests unitarios de `facebook.ts` (RED)**

Crear `lib/publicar/facebook.test.ts`:

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicarPiezaFacebook, type OpcionesFacebook } from './facebook.ts';
import type { Pieza } from '../piezas/tipos.ts';

const TOKEN = 'TOKEN-SECRETO-DE-PAGINA-FB';

const piezaBase: Pieza = {
  id: 'sri-rechazo-01',
  sistema: 'puka',
  producto: 'ledgerxpertz',
  caption: 'Caption de Instagram con #hashtag',
  slides: [
    { titular: 'Tu factura no pasó', bajada: 'El error más común es un dato mal escrito.' },
    { titular: 'Revisa antes de enviar', bajada: 'Evita rechazos del SRI.' },
  ],
};

function fetchFalso(respuestas: unknown[]) {
  const llamadas: Array<{ url: string; body: string; metodo: string }> = [];
  let i = 0;
  const impl = async (url: string | URL, init?: RequestInit) => {
    llamadas.push({
      url: String(url),
      body: String(init?.body ?? ''),
      metodo: String(init?.method ?? 'GET'),
    });
    return {
      ok: true,
      json: async () => respuestas[Math.min(i++, respuestas.length - 1)],
    } as Response;
  };
  return { impl: impl as unknown as typeof fetch, llamadas };
}

function opciones(fetchImpl: typeof fetch): OpcionesFacebook {
  return { pageId: 'PAGE_DE_PRUEBA', token: TOKEN, fetchImpl };
}

test('publicar en Facebook realiza los dos pasos en orden con token en el cuerpo', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'FOTO_FB_123' },
    { id: 'POST_FB_456' },
  ]);

  const res = await publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl));

  assert.equal(res.id, 'POST_FB_456');
  assert.equal(llamadas.length, 2);

  // Paso 1: Subir foto con published=false a {page-id}/photos
  assert.equal(llamadas[0].metodo, 'POST');
  assert.match(llamadas[0].url, /PAGE_DE_PRUEBA\/photos$/);
  assert.match(llamadas[0].body, /published=false/);
  assert.match(llamadas[0].body, /url=https%3A%2F%2Fpukadigital\.com%2Fpiezas%2F2026-09%2Fsri-rechazo-01-1-4x5\.png/);
  assert.match(llamadas[0].body, /access_token=TOKEN-SECRETO-DE-PAGINA-FB/);
  assert.ok(!llamadas[0].url.includes(TOKEN), 'el token no debe viajar en la URL');

  // Paso 2: Publicar post en {page-id}/feed con attached_media y message
  assert.equal(llamadas[1].metodo, 'POST');
  assert.match(llamadas[1].url, /PAGE_DE_PRUEBA\/feed$/);
  assert.match(llamadas[1].body, /attached_media%5B0%5D=%7B%22media_fbid%22%3A%22FOTO_FB_123%22%7D/);
  assert.match(llamadas[1].body, /message=/);
  assert.ok(!llamadas[1].body.includes('caption='), 'el endpoint de feed usa message, no caption');
});

test('utiliza facebook.caption si está definido en la pieza', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'FOTO_FB_1' },
    { id: 'POST_FB_1' },
  ]);

  const piezaConFB: Pieza = {
    ...piezaBase,
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Texto específico para Facebook sin hashtags.',
    },
  };

  await publicarPiezaFacebook(piezaConFB, '2026-09', opciones(impl));

  assert.match(llamadas[1].body, /message=Texto\+espec%C3%ADfico\+para\+Facebook\+sin\+hashtags\./);
});

test('utiliza el compositor determinista si facebook.caption no está definido', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'FOTO_FB_2' },
    { id: 'POST_FB_2' },
  ]);

  await publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl));

  // El compositor incluye los titulares y la URL de LedgerXpertz
  assert.match(llamadas[1].body, /Tu\+factura\+no\+pas/);
  assert.match(llamadas[1].body, /pukadigital\.com%2Fledgerxpertz/);
});

test('una pieza que no pasa validación no llega a la Graph API de Facebook', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'FOTO' }]);
  const invalida: Pieza = {
    ...piezaBase,
    producto: 'pukahealth', // sistema puka, producto health -> error sistema
  };

  await assert.rejects(
    () => publicarPiezaFacebook(invalida, '2026-09', opciones(impl)),
    /sistema/,
  );
  assert.equal(llamadas.length, 0);
});

test('el token de Facebook nunca se filtra en el mensaje de error ante fallos de API', async () => {
  const impl = (async () => ({
    ok: false,
    status: 400,
    json: async () => ({ error: { message: 'OAuthException: Error validating access token' } }),
  })) as unknown as typeof fetch;

  await assert.rejects(
    () => publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl)),
    (e: Error) => {
      assert.ok(!e.message.includes(TOKEN), 'el token de Facebook se filtró en el error');
      assert.match(e.message, /OAuthException/);
      return true;
    },
  );
});
```

- [ ] **Paso 2: Implementar `facebook.ts` (GREEN)**

Crear `lib/publicar/facebook.ts`:

```typescript
import { formatear, validar } from '../piezas/validar.ts';
import { componer } from '../captions/componer.ts';
import { urlPublica } from './meta.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

export type OpcionesFacebook = {
  pageId: string;
  token: string;
  /** Inyectable para pruebas unitarias sin red. */
  fetchImpl?: typeof fetch;
};

export type PublicacionFacebook = {
  id: string;
};

async function llamarFB(
  ruta: string,
  params: Record<string, string>,
  opciones: OpcionesFacebook,
): Promise<Record<string, unknown>> {
  const hacer = opciones.fetchImpl ?? fetch;
  const cuerpo = new URLSearchParams({ ...params, access_token: opciones.token });

  const res = await hacer(`${GRAPH}/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: cuerpo,
  });

  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.error) {
    const error = json.error as { message?: string } | undefined;
    // Solo el mensaje devuelto por Graph API, jamás el token enviado
    throw new Error(`La API de Facebook rechazo ${ruta}: ${error?.message ?? 'sin detalle'}`);
  }
  return json;
}

/**
 * Publica una pieza en la Página de Facebook:
 * 1. Sube la foto slide 1 en 4x5 a /{page-id}/photos con published=false.
 * 2. Crea el post en /{page-id}/feed con attached_media[0] y el texto en message.
 */
export async function publicarPiezaFacebook(
  pieza: Pieza,
  mes: string,
  opciones: OpcionesFacebook,
): Promise<PublicacionFacebook> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const archivo = `${pieza.id}-1-4x5.png`;
  const urlFoto = urlPublica(mes, archivo);
  const texto = pieza.facebook?.caption ?? componer(pieza);
  const pageId = opciones.pageId;

  // Paso 1: Subir foto como no publicada
  const resFoto = await llamarFB(
    `${pageId}/photos`,
    { url: urlFoto, published: 'false' },
    opciones,
  );
  const mediaFbid = String(resFoto.id);

  // Paso 2: Crear el post en el feed con la foto adjunta y el texto en 'message'
  const resPost = await llamarFB(
    `${pageId}/feed`,
    {
      'attached_media[0]': JSON.stringify({ media_fbid: mediaFbid }),
      message: texto,
    },
    opciones,
  );

  return { id: String(resPost.id) };
}
```

- [ ] **Paso 3: Verificar tests**

Ejecutar: `npm test`
Resultado esperado: **89 tests pasando** (+5 tests de `facebook.test.ts`).

---

## Tarea 4: Programación, `yaPublicada()` parametrizada y franja siguiente (`programado.ts`)

Adaptar `lib/publicar/programado.ts`:
1. Parametrizar `yaPublicada(texto: string | undefined, textosRecientes: string[]): boolean` para comparar cualquier texto normalizado contra una lista de publicaciones recientes.
2. Implementar `franjaSiguiente(fechaLocal: string): string` (09:00 → 18:00 del mismo día; 18:00 → 09:00 del día siguiente, con soporte de cambio de mes).
3. Implementar `fechaPublicacionFacebook(pieza: Pieza): string | undefined` y `captionFacebook(pieza: Pieza): string`.
4. Implementar `pendientesFacebook(piezas: Pieza[], ahora: Date, mensajesRecientes: string[]): Pieza[]` y mantener `pendientesInstagram` (con alias `pendientes`).
5. Actualizar los tests unitarios en `lib/publicar/programado.test.ts` (adaptando la firma en líneas 64-67).

**Files:**
- Modify: `lib/publicar/programado.ts`
- Modify: `lib/publicar/programado.test.ts`

- [ ] **Paso 1: Escribir los tests unitarios para `programado.ts` (RED)**

Modificar `lib/publicar/programado.test.ts` adaptando los tests existentes y añadiendo los nuevos:

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
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
import type { Pieza } from '../piezas/tipos.ts';

const base: Omit<Pieza, 'id'> = {
  sistema: 'puka',
  caption: 'Un caption de Instagram',
  slides: [{ titular: 'Hola' }],
};

test('la hora se escribe en hora de Ecuador y se convierte a UTC', () => {
  assert.equal(aUTC('2026-09-09T09:00').toISOString(), '2026-09-09T14:00:00.000Z');
  assert.equal(aUTC('2026-09-09T18:30').toISOString(), '2026-09-09T23:30:00.000Z');
  assert.equal(aUTC('2026-09-09T21:00').toISOString(), '2026-09-10T02:00:00.000Z');
});

test('franjaSiguiente calcula las 18:00 del mismo día para publicaciones de las 09:00', () => {
  assert.equal(franjaSiguiente('2026-09-03T09:00'), '2026-09-03T18:00');
});

test('franjaSiguiente calcula las 09:00 del día siguiente para publicaciones de las 18:00', () => {
  assert.equal(franjaSiguiente('2026-09-02T18:00'), '2026-09-03T09:00');
  // Cambio de mes: 30 de septiembre a 1 de octubre
  assert.equal(franjaSiguiente('2026-09-30T18:00'), '2026-10-01T09:00');
});

test('fechaPublicacionFacebook usa facebook.publicarEl si existe, o cae a la franja siguiente', () => {
  const explicita: Pieza = {
    ...base,
    id: 'exp',
    publicarEl: '2026-09-03T09:00',
    facebook: { publicarEl: '2026-09-05T12:00' },
  };
  assert.equal(fechaPublicacionFacebook(explicita), '2026-09-05T12:00');

  const automatica: Pieza = {
    ...base,
    id: 'auto',
    publicarEl: '2026-09-03T09:00',
  };
  assert.equal(fechaPublicacionFacebook(automatica), '2026-09-03T18:00');

  const sinFecha: Pieza = { ...base, id: 'sin' };
  assert.equal(fechaPublicacionFacebook(sinFecha), undefined);
});

test('captionFacebook devuelve facebook.caption si existe o recurre al compositor', () => {
  const conCaption: Pieza = {
    ...base,
    id: 'con',
    facebook: { caption: 'Texto propio de FB' },
  };
  assert.equal(captionFacebook(conCaption), 'Texto propio de FB');

  const sinCaption: Pieza = {
    ...base,
    id: 'sin',
    slides: [{ titular: 'Solo titular', bajada: 'Una bajada.' }],
  };
  assert.equal(captionFacebook(sinCaption), 'Solo titular\nUna bajada.\n\npukadigital.com');
});

test('solo entra lo que ya toca, dentro de la ventana', () => {
  const piezas: Pieza[] = [
    { ...base, id: 'ayer', caption: 'ayer', publicarEl: '2026-09-08T09:00' },
    { ...base, id: 'ahora', caption: 'ahora', publicarEl: '2026-09-09T09:00' },
    { ...base, id: 'manana', caption: 'manana', publicarEl: '2026-09-10T09:00' },
  ];
  // 09:05 de Ecuador = 14:05 UTC
  const ahora = new Date('2026-09-09T14:05:00Z');
  assert.deepEqual(pendientes(piezas, ahora, []).map((p) => p.id), ['ahora']);
});

// 🔴 Este test viene tal cual de `main` (commit 55c399d). **Copiarlo literal, no
// reescribirlo.** Hasta el 2026-09-09 este plan traia en su lugar uno llamado
// «la ventana absorbe el desfase de una hora del plan Hobby», que comparaba
// 23:59:30 contra 00:31:00 y pasaba igual con VENTANA_MINUTOS en 60 que en 90:
// no anclaba la constante. Se sustituyo por estos dos limites, que la rodean y
// estan verificados por mutacion. Reintroducir el viejo deshace el despliegue
// del 2026-09-08.
test('la ventana son 60 minutos: 59 entra y 61 no', () => {
  const pieza: Pieza = { ...base, id: 'tarde', publicarEl: '2026-09-02T18:00' };
  // 18:00 de Ecuador = 23:00 UTC.
  assert.deepEqual(
    pendientes([pieza], new Date('2026-09-02T23:59:00Z'), []).map((p) => p.id),
    ['tarde'],
  );
  assert.deepEqual(pendientes([pieza], new Date('2026-09-03T00:01:00Z'), []), []);
});

test('lo viejo no se publica con retraso: la ventana se cierra', () => {
  const piezas: Pieza[] = [{ ...base, id: 'vieja', publicarEl: '2026-09-09T09:00' }];
  assert.deepEqual(pendientes(piezas, new Date('2026-09-09T17:00:00Z'), []), []);
});

test('una pieza sin fecha nunca entra en el cron', () => {
  const piezas: Pieza[] = [{ ...base, id: 'sin-fecha' }];
  assert.deepEqual(pendientes(piezas, new Date('2026-09-09T14:00:00Z'), []), []);
});

// ⚠️ Este test YA EXISTIA (programado.test.ts:69) y el plan original lo perdio al
// reescribir el archivo entero. La guarda `!pieza.caption` de pendientesInstagram
// sigue en pie, pero sin este test nadie la protege: si manana alguien la borra,
// nada se pone rojo y una pieza sin caption se publicaria sin poder comprobar
// si ya salio. NO ELIMINAR.
test('una pieza sin caption no se puede comparar, asi que no se publica sola', () => {
  const pieza: Pieza = { ...base, id: 'x', caption: undefined, publicarEl: '2026-09-09T09:00' };
  assert.deepEqual(pendientes([pieza], new Date('2026-09-09T14:05:00Z'), []), []);
});

test('no se republica lo que ya esta en el perfil', () => {
  const pieza: Pieza = { ...base, id: 'x', publicarEl: '2026-09-09T09:00', caption: 'Tu factura no pasó' };
  const ahora = new Date('2026-09-09T14:05:00Z');
  assert.deepEqual(pendientes([pieza], ahora, []).map((p) => p.id), ['x']);
  assert.deepEqual(pendientes([pieza], ahora, ['Tu factura no pasó']), []);
});

test('la comparacion de captions ignora espacios de mas y admite texto explícito', () => {
  assert.equal(yaPublicada('Hola  mundo ', ['Hola mundo']), true);
  assert.equal(yaPublicada('Hola mundo', ['Otra cosa']), false);
  assert.equal(yaPublicada(undefined, ['Cualquier cosa']), false);
});

test('yaPublicada con caption de Facebook no coincide con caption de Instagram', () => {
  const captionIG = '¿Un podólogo puede recetar? #podologia #Ecuador';
  const captionFB = 'Un podólogo no puede recetar\nY muchos sistemas dejan imprimir igual.\n\npukadigital.com/pukahealth';
  assert.equal(yaPublicada(captionFB, [captionIG]), false);
});

test('pendientesFacebook selecciona piezas según su fecha de Facebook', () => {
  const piezas: Pieza[] = [
    {
      ...base,
      id: 'ig-18-fb-siguiente',
      publicarEl: '2026-09-02T18:00',
    },
    {
      ...base,
      id: 'ig-09-fb-mismo-dia',
      publicarEl: '2026-09-03T09:00',
    },
  ];

  // 18:05 de Ecuador el día 3 = 23:05 UTC. Debe seleccionar 'ig-09-fb-mismo-dia' (franja 18:00)
  const ahoraTarde = new Date('2026-09-03T23:05:00Z');
  assert.deepEqual(
    pendientesFacebook(piezas, ahoraTarde, []).map((p) => p.id),
    ['ig-09-fb-mismo-dia'],
  );

  // 09:05 de Ecuador el día 3 = 14:05 UTC. Debe seleccionar 'ig-18-fb-siguiente' (siguiente de 18:00 del día 2)
  const ahoraManana = new Date('2026-09-03T14:05:00Z');
  assert.deepEqual(
    pendientesFacebook(piezas, ahoraManana, []).map((p) => p.id),
    ['ig-18-fb-siguiente'],
  );
});

test('las 3 piezas de septiembre a las 18:00 salen en Instagram y las 4 a las 09:00 llegan a Facebook', () => {
  const piezasSeptiembre: Pieza[] = [
    { ...base, id: 'podologo-no-receta', publicarEl: '2026-09-02T18:00', caption: 'IG 1' },
    { ...base, id: 'precios-software-ecuador', publicarEl: '2026-09-03T09:00', caption: 'IG 2' },
  ];

  // A las 18:00 del día 2 (23:00 UTC): podologo-no-receta sale en Instagram
  const corridaIG18 = new Date('2026-09-02T23:05:00Z');
  assert.deepEqual(
    pendientesInstagram(piezasSeptiembre, corridaIG18, []).map((p) => p.id),
    ['podologo-no-receta'],
  );

  // A las 18:00 del día 3 (23:00 UTC): precios-software-ecuador sale en Facebook
  const corridaFB18 = new Date('2026-09-03T23:05:00Z');
  assert.deepEqual(
    pendientesFacebook(piezasSeptiembre, corridaFB18, []).map((p) => p.id),
    ['precios-software-ecuador'],
  );
});
```

- [ ] **Paso 2: Modificar `lib/publicar/programado.ts` (GREEN)**

Actualizar `lib/publicar/programado.ts`:

```typescript
import { componer } from '../captions/componer.ts';
import type { Pieza } from '../piezas/tipos.ts';

/** Ecuador es UTC-5 todo el año: no hay horario de verano que compensar. */
const DESFASE_ECUADOR_HORAS = 5;

/**
 * Cuánto margen tiene el cron para publicar una pieza. Si se pasa, no la
 * publica: más vale una pieza sin salir que una saliendo de madrugada.
 */
const VENTANA_MINUTOS = 60; // bajado de 90 el 2026-09-08, ver programado.ts

/** `2026-09-09T09:00` en hora de Ecuador → el instante UTC equivalente. */
export function aUTC(local: string): Date {
  const comoSiFueraUTC = new Date(`${local}:00.000Z`).getTime();
  if (Number.isNaN(comoSiFueraUTC)) return new Date(NaN);
  return new Date(comoSiFueraUTC + DESFASE_ECUADOR_HORAS * 3600_000);
}

function normalizar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}

/**
 * Comprueba si un texto ya fue publicado en una lista de publicaciones recientes.
 */
export function yaPublicada(
  texto: string | undefined,
  textosRecientes: string[],
): boolean {
  if (!texto || texto.trim() === '') return false;
  const mio = normalizar(texto);
  return textosRecientes.some((c) => normalizar(c) === mio);
}

/**
 * Calcula la franja horaria siguiente para publicar en Facebook:
 * - Publicaciones de las 09:00 salen a las 18:00 del mismo día.
 * - Publicaciones de las 18:00 salen a las 09:00 del día siguiente.
 */
export function franjaSiguiente(fechaLocal: string): string {
  const [fechaStr, horaStr] = fechaLocal.split('T');
  if (!fechaStr || !horaStr) return fechaLocal;

  const hora = horaStr.slice(0, 5);
  if (hora <= '09:00') {
    return `${fechaStr}T18:00`;
  }

  // 18:00 o posterior -> siguiente día a las 09:00
  const [y, m, d] = fechaStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);

  const ny = dt.getUTCFullYear();
  const nm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const nd = String(dt.getUTCDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}T09:00`;
}

/**
 * Obtiene la fecha programada para Facebook: explícita o calculada por franja siguiente.
 */
export function fechaPublicacionFacebook(pieza: Pieza): string | undefined {
  if (pieza.facebook?.publicarEl) return pieza.facebook.publicarEl;
  if (pieza.publicarEl) return franjaSiguiente(pieza.publicarEl);
  return undefined;
}

/**
 * Obtiene el caption a publicar en Facebook: explícito o compuesto desde slides.
 */
export function captionFacebook(pieza: Pieza): string {
  return pieza.facebook?.caption ?? componer(pieza);
}

/**
 * Piezas pendientes para publicar en Instagram.
 */
export function pendientesInstagram(
  piezas: Pieza[],
  ahora: Date,
  captionsRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    if (!pieza.publicarEl || !pieza.caption) return false;

    const cuando = aUTC(pieza.publicarEl);
    if (Number.isNaN(cuando.getTime())) return false;

    const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
    if (minutos < 0 || minutos > VENTANA_MINUTOS) return false;

    return !yaPublicada(pieza.caption, captionsRecientes);
  });
}

/**
 * Piezas pendientes para publicar en Facebook.
 */
export function pendientesFacebook(
  piezas: Pieza[],
  ahora: Date,
  mensajesRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    const fecha = fechaPublicacionFacebook(pieza);
    if (!fecha) return false;

    const cuando = aUTC(fecha);
    if (Number.isNaN(cuando.getTime())) return false;

    const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
    if (minutos < 0 || minutos > VENTANA_MINUTOS) return false;

    const texto = captionFacebook(pieza);
    return !yaPublicada(texto, mensajesRecientes);
  });
}

/** Alias de compatibilidad hacia atrás para Instagram. */
export const pendientes = pendientesInstagram;
```

- [ ] **Paso 3: Verificar tests**

Ejecutar: `npm test`
Resultado esperado: **96 tests pasando** (+7 netos en `programado.test.ts`: 8 nuevos menos 1 test existente que se conserva reescrito).

---

## Tarea 5: Generación con IA y CLI de captions (`prompt.ts`, `gemini.ts`, `cli.ts`)

Implementar:
1. `lib/captions/prompt.ts`: Construcción determinista del prompt para Gemini con datos comerciales, afirmaciones prohibidas, slides y reglas de formato (sin hashtags, bloques argumentados).
2. `lib/captions/gemini.ts`: Llamada única al SDK `@google/genai` con modelo Gemini Flash y `API_KEY`.
3. `lib/captions/cli.ts`: Comando `npm run captions -- --mes 2026-09` (o `--id <pieza>`) que lee las piezas, genera los bloques TypeScript de `facebook: { ... }` y los **imprime por stdout** sin mutar archivos.

**Files:**
- Create: `lib/captions/prompt.ts`
- Create: `lib/captions/prompt.test.ts`
- Create: `lib/captions/gemini.ts`
- Create: `lib/captions/cli.ts`
- Modify: `package.json`

- [ ] **Paso 1: Escribir los tests unitarios de `prompt.ts` (RED)**

Crear `lib/captions/prompt.test.ts`:

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirPrompt } from './prompt.ts';
import type { Pieza } from '../piezas/tipos.ts';

test('el prompt incluye los precios del catálogo y la URL canónica del producto', () => {
  const pieza: Pieza = {
    id: 'crm-prueba',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [{ titular: 'CRM para WhatsApp', bajada: 'Inbox y pipeline.' }],
  };

  const prompt = construirPrompt(pieza);

  assert.match(prompt, /pukaia/i);
  assert.match(prompt, /14\.99/);
  assert.match(prompt, /agentes-ia/);
});

test('el prompt incluye las afirmaciones prohibidas si el producto es PukaHealth', () => {
  const piezaSalud: Pieza = {
    id: 'salud-prueba',
    sistema: 'health',
    producto: 'pukahealth',
    slides: [{ titular: 'Historias clínicas', bajada: 'Facturación SRI.' }],
  };

  const prompt = construirPrompt(piezaSalud);

  assert.match(prompt, /podolog/i);
  assert.match(prompt, /WhatsApp/i);
  assert.match(prompt, /bidireccional/i);
});

test('el prompt no incluye afirmaciones médicas prohibidas para otros productos', () => {
  const piezaERP: Pieza = {
    id: 'erp-prueba',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [{ titular: 'POS e inventario', bajada: 'Facturación electrónica.' }],
  };

  const prompt = construirPrompt(piezaERP);

  assert.ok(!prompt.includes('Solo hay una especialidad implementada'));
});

test('el prompt prohíbe explícitamente el uso de hashtags', () => {
  const pieza: Pieza = {
    id: 'utilidad',
    sistema: 'puka',
    slides: [{ titular: 'Norma del SRI' }],
  };

  const prompt = construirPrompt(pieza);

  assert.match(prompt, /sin hashtags/i);
});
```

- [ ] **Paso 2: Implementar `lib/captions/prompt.ts` (GREEN)**

Crear `lib/captions/prompt.ts`:

```typescript
import { CATALOGO } from '../piezas/catalogo.ts';
import { PROHIBIDAS } from '../piezas/prohibidas.ts';
import type { Pieza } from '../piezas/tipos.ts';

export function construirPrompt(pieza: Pieza): string {
  const producto = pieza.producto ? CATALOGO[pieza.producto] : undefined;

  let reglasProducto = '';
  if (producto) {
    reglasProducto = `
PRODUCTO: ${producto.nombre}
- URL canónica: pukadigital.com${producto.url}
- Precios oficiales: ${producto.precios.length > 0 ? producto.precios.map((p) => `$${p}`).join(', ') : 'Sin precio visible (cotización por WhatsApp)'}
- Ofertas permitidas: ${producto.ofertas.length > 0 ? producto.ofertas.join(', ') : 'Ninguna'}
`;
  } else {
    reglasProducto = `
PRODUCTO: Pieza de utilidad (sin producto específico de venta).
- URL de cierre: pukadigital.com
- No menciones precios ni ofertas comerciales.
`;
  }

  let reglasProhibidas = '';
  if (pieza.producto === 'pukahealth') {
    reglasProhibidas = `
AFIRMACIONES ESTRICTAMENTE PROHIBIDAS (PukaHealth):
${PROHIBIDAS.map((p) => `- Prohibido: ${p.motivo}. En su lugar: ${p.enCambio}`).join('\n')}
`;
  }

  const slidesTexto = pieza.slides
    .map((s, i) => {
      let linea = `Slide ${i + 1}: ${s.titular}`;
      if (s.dato) linea += ` [Dato: ${s.dato.valor} ${s.dato.etiqueta}]`;
      if (s.bajada) linea += `\n  ${s.bajada}`;
      return linea;
    })
    .join('\n');

  return `Actúa como redactor experto de contenido para Facebook de PukaDigital (pukadigital.com).
Tu tarea es escribir un caption largo y argumentativo para una publicación en Facebook basada en las slides de un carrusel de redes sociales.

${reglasProducto}
${reglasProhibidas}

CONTENIDO DE LAS SLIDES:
${slidesTexto}

REGLAS EDITORIALES PARA FACEBOOK:
1. Formato: Texto largo estructurado en párrafos legibles con saltos de línea entre bloques.
2. Argumento completo: Desarrolla la narrativa de las slides para que quien lo lea en Facebook reciba el valor entero sin necesitar deslizar.
3. Diferenciación: Debe ser una redacción nativa y fresca, distinta al caption breve de Instagram.
4. CERO HASHTAGS: Está terminantemente prohibido incluir hashtags (#). En Facebook no aportan alcance.
5. Cierre: Concluye siempre con la URL canónica indicada arriba.
6. Hechos estrictos: No inventes precios ni características no autorizadas.

Devuelve ÚNICAMENTE el texto final del caption, sin introducciones ni comillas envolventes.`;
}
```

- [ ] **Paso 3: Implementar `lib/captions/gemini.ts`**

Crear `lib/captions/gemini.ts`:

```typescript
import { GoogleGenAI } from '@google/genai';
import { construirPrompt } from './prompt.ts';
import type { Pieza } from '../piezas/tipos.ts';

/**
 * ⚠️ La spec exige el Flash 3.x mas reciente, NO 2.5. Gemini 3 Flash existe
 * desde diciembre de 2025 y gana a 2.5 Pro en AIME, GPQA, HLE, SimpleQA y
 * SWE-Bench a una fraccion del precio; el plan original lo puso en 2.5 diciendo
 * que 3.x no estaba disponible, y eso es falso.
 *
 * **Verificar el id exacto antes de implementar**: la familia se mueve rapido y
 * ya iba por la 3.8 el 2026-09-02. A ~9 captions al mes el coste no es criterio.
 */
const MODELO_CAPTION = process.env.MODELO_CAPTION ?? 'gemini-3.8-flash';

/**
 * Genera el caption para Facebook llamando a la API de Gemini.
 */
export async function generarCaption(
  pieza: Pieza,
  apiKey = process.env.API_KEY,
  modelo = MODELO_CAPTION,
): Promise<string> {
  if (!apiKey) {
    throw new Error('Falta la variable de entorno API_KEY para Gemini.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = construirPrompt(pieza);

  const response = await ai.models.generateContent({
    model: modelo,
    contents: prompt,
  });

  const texto = response.text?.trim();
  if (!texto) {
    throw new Error(`Gemini no devolvió contenido para la pieza ${pieza.id}.`);
  }

  return texto;
}
```

- [ ] **Paso 4: Implementar `lib/captions/cli.ts` y script en `package.json`**

Crear `lib/captions/cli.ts`:

```typescript
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { componer } from './componer.ts';
import { generarCaption } from './gemini.ts';
import { franjaSiguiente } from '../publicar/programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

function argumento(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

function mesActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

async function main() {
  const mes = argumento('mes') ?? mesActual();
  const soloId = argumento('id');
  const usarFallback = process.argv.includes('--fallback');

  const ruta = pathToFileURL(join(process.cwd(), 'content', 'piezas', `${mes}.ts`)).href;
  const todas: Pieza[] = (await import(ruta)).default;

  const piezas = soloId ? todas.filter((p) => p.id === soloId) : todas;
  if (piezas.length === 0) {
    console.error(`No hay piezas con id ${soloId} en ${mes}.`);
    process.exit(1);
  }

  console.log(`\nGenerando captions de Facebook para ${piezas.length} pieza(s) en ${mes}...\n`);

  for (const pieza of piezas) {
    let caption: string;
    let origen: string;

    if (usarFallback || !process.env.API_KEY) {
      caption = componer(pieza);
      origen = 'compositor determinista';
    } else {
      try {
        caption = await generarCaption(pieza);
        origen = 'Gemini';
      } catch (e) {
        console.warn(`Aviso: Gemini falló para ${pieza.id}, usando compositor determinista. (${e instanceof Error ? e.message : e})`);
        caption = componer(pieza);
        origen = 'compositor determinista (fallback)';
      }
    }

    const fechaFB = pieza.facebook?.publicarEl ?? (pieza.publicarEl ? franjaSiguiente(pieza.publicarEl) : undefined);

    console.log(`// ─── ${pieza.id} (${origen}) ───`);
    console.log(`facebook: {`);
    if (fechaFB) {
      console.log(`  publicarEl: '${fechaFB}',`);
    }
    console.log(`  caption:\n${JSON.stringify(caption, null, 4)},`);
    console.log(`},\n`);
  }

  console.log('Copia y pega los bloques anteriores dentro del array en content/piezas/' + mes + '.ts');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
```

En `package.json`, agregar el script `captions`:

```json
"scripts": {
  "dev": "next dev",
  "prebuild": "npm run piezas -- --check && npm test && tsc --noEmit",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "node --import tsx --test lib/*/*.test.ts",
  "piezas": "tsx lib/piezas/cli.ts",
  "piezas:muestra": "tsx lib/piezas/muestra.ts",
  "captions": "node --import tsx --env-file-if-exists=.env.local lib/captions/cli.ts",
  "publicar": "node --import tsx --env-file-if-exists=.env.local lib/publicar/cli.ts"
}
```

- [ ] **Paso 5: Verificar tests**

Ejecutar: `npm test`
Resultado esperado: **100 tests pasando** (+4 tests de `prompt.test.ts`).

---

## Tarea 6: Publicación multicanal y cruce de mes en `tanda.ts`, sus puertas y el CLI

> **Reescrita el 2026-09-09.** La versión anterior ponía toda la orquestación
> dentro de `app/api/cron/publicar/route.ts`. Se escribió el 2026-09-07, antes de
> que la fase A extrajera la lógica a `lib/publicar/tanda.ts`, y dejaba el cron
> automático —`worker.ts:scheduled()`, el que publica de verdad— sin Facebook.
> El contraste está en `docs/superpowers/specs/2026-09-09-facebook-contraste-agy-3.md`.

Llevar la publicación a dos canales tocando **un solo sitio**: `tanda.ts`. Las dos
puertas (`worker.ts` y la ruta HTTP) solo reenvían entorno, y por eso no pueden
divergir. El CLI gana `--facebook` para ensayos.

**Files:**
- Modify: `lib/publicar/tanda.ts`
- Modify: `lib/publicar/tanda.test.ts`
- Modify: `worker.ts`
- Modify: `app/api/cron/publicar/route.ts`
- Modify: `lib/publicar/cli.ts`

### Decisiones que fija esta tarea

1. **Un canal sin secretos no es un fallo.** Si faltan `FB_PAGE_ID` o
   `FB_PAGE_ACCESS_TOKEN`, Facebook se omite y la tanda **sigue publicando en
   Instagram**. Entra en `Resultado.omitidos`, no en `fallidas`: si entrara en
   `fallidas`, la ruta devolvería 500 en cada corrida hasta que alguien suba los
   secretos, y el 500 dejaría de significar algo.
   ⚠️ Hoy esos dos secretos **no están** en el Worker (los seis que hay son
   `API_KEY`, `CRON_SECRET`, `GA_API_SECRET`, `IG_ACCESS_TOKEN`, `IG_USER_ID`,
   `RESEND_API_KEY`). Desplegar esta tarea sin ellos debe dejar Instagram intacto.
2. **Aislamiento por canal.** Un `try/catch` por canal (si falla leer `/posts`,
   Facebook se acaba ahí y Instagram no se entera) y otro por pieza (la regla que
   ya existe: una pieza que falla no impide las demás del mismo día).
3. **El cruce de mes se carga, no se evita.** `franjaSiguiente` manda la pieza del
   día 30 a las 18:00 al día 1 del mes siguiente, así que la tanda carga el mes
   actual **y el anterior**.

- [ ] **Paso 1: Tests de la orquestación multicanal (RED)**

Modificar `lib/publicar/tanda.test.ts`. El `falsoFetch` existente solo simula
Instagram; hay que enseñarle `/posts` y `/photos` de Facebook.

⚠️ **Los tests actuales pasan `buscarMes: () => [...]`, que ahora devolvería las
mismas piezas para los dos meses y las publicaría dos veces.** Hay que volver el
doble sensible al mes: `buscarMes: (m) => (m === '2026-09' ? [...] : null)`. No es
cosmético: es el test que demuestra que el cruce de mes no duplica.

```typescript
const AHORA = new Date('2026-09-09T14:05:00Z'); // 09:05 de Ecuador
const soloEsteMes = (piezas: Pieza[]) => (m: string) => (m === '2026-09' ? piezas : null);
const CON_FB = { fbPageId: 'pagina-1', fbToken: 'tfb' };

test('sin secretos de Facebook publica en Instagram y lo anota en omitidos', async () => {
  const { impl } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('toca', '2026-09-09T09:00')]),
  });
  assert.deepEqual(r.publicadas, [{ canal: 'instagram', id: 'toca', mediaId: 'media-99' }]);
  assert.deepEqual(r.omitidos, ['facebook']);
  assert.deepEqual(r.fallidas, []);
});

test('un canal caido no impide el otro', async () => {
  // La lectura de /posts falla; Instagram tiene que publicar igual.
  const { impl } = falsoFetch({ fallaLecturaFacebook: true });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB, ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('toca', '2026-09-09T09:00')]),
  });
  assert.deepEqual(r.publicadas.map((p) => p.canal), ['instagram']);
  assert.deepEqual(r.fallidas, [
    { canal: 'facebook', id: 'lectura-perfil', error: 'No se pudo leer el perfil: caida' },
  ]);
});

test('publica en los dos canales en una sola corrida', async () => {
  const { impl } = falsoFetch();
  // La pieza de las 09:00 toca en Instagram; su franja de Facebook es a las 18:00,
  // asi que aqui solo debe salir Instagram. La de ayer a las 18:00 toca hoy en
  // Facebook a las 09:00 y ya salio en Instagram.
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB, ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([
      pieza('de-hoy', '2026-09-09T09:00'),
      pieza('de-ayer', '2026-09-08T18:00'),
    ]),
  });
  assert.deepEqual(r.publicadas, [
    { canal: 'instagram', id: 'de-hoy', mediaId: 'media-99' },
    { canal: 'facebook', id: 'de-ayer', mediaId: 'post-77' },
  ]);
});

test('una pieza del mes anterior se publica con SU mes, no con el de la corrida', async () => {
  // 1 de octubre, 09:05 de Ecuador. La pieza vive en 2026-09 y su imagen tambien:
  // publicarla con mes '2026-10' pedirla al CDN da 404.
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB,
    ahora: new Date('2026-10-01T14:05:00Z'), fetchImpl: impl,
    buscarMes: (m) => (m === '2026-09' ? [pieza('del-30', '2026-09-30T18:00')] : null),
  });
  assert.equal(r.mes, '2026-10');
  assert.deepEqual(r.publicadas.map((p) => p.canal), ['facebook']);
  assert.ok(
    llamadas.some((l) => l.includes('2026-09')),
    'la URL de la imagen debe llevar 2026-09, no 2026-10',
  );
});
```

Los tests existentes se adaptan al `canal` y a `omitidos`: `publicadas` pasa de
`{ id, mediaId }` a `{ canal, id, mediaId }`, y el `deepEqual` del mes vacío gana
`omitidos: ['facebook']`.

⚠️ **No escribir aquí un número de tests esperado.** La versión anterior de esta
tarea decía «100 tests pasando» cuando la línea base real era 80. Un número
inventado en un plan es una verificación falsa: quien lo ejecute creerá que rompió
algo. Medir la línea base con `npm test` **antes** de empezar y comparar contra
ella.

- [ ] **Paso 2: Reescribir `lib/publicar/tanda.ts` (GREEN)**

```typescript
import { piezasDe } from '../../content/piezas/index.ts';
import { publicarPieza } from './meta.ts';
import { publicarPiezaFacebook } from './facebook.ts';
import { pendientesFacebook, pendientesInstagram } from './programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

/** Cuántas publicaciones recientes se miran para no repetir una pieza. */
const RECIENTES = 25;

export type NombreCanal = 'instagram' | 'facebook';

export type Resultado = {
  /** El mes de la corrida. Pueden entrar piezas del anterior: ver `mesAnterior`. */
  mes: string;
  revisadas: number;
  publicadas: Array<{ canal: NombreCanal; id: string; mediaId: string }>;
  fallidas: Array<{ canal: NombreCanal; id: string; error: string }>;
  /** Canales que no se intentaron por no tener secretos. No es un fallo. */
  omitidos: NombreCanal[];
};

export type Opciones = {
  igUserId: string;
  token: string;
  /**
   * Facebook es opcional a propósito: sin estos dos el canal se omite y la tanda
   * sigue publicando en Instagram. Un despliegue sin los secretos de Facebook no
   * puede apagar lo que ya funcionaba.
   */
  fbPageId?: string;
  fbToken?: string;
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

/**
 * Lo que hay que saber hacer para ser un canal. Existe para que sumar el tercero
 * no obligue a tocar el orquestador.
 */
type Canal = {
  nombre: NombreCanal;
  recientes(o: Opciones): Promise<string[]>;
  pendientes(piezas: Pieza[], ahora: Date, recientes: string[]): Pieza[];
  publicar(pieza: Pieza, mes: string, o: Opciones): Promise<{ id: string }>;
};

/** `2026-09`, en UTC. El cron de Cloudflare dispara en UTC. */
export function mesDe(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** `2026-10` → `2026-09`. */
export function mesAnterior(mes: string): string {
  const [anio, numero] = mes.split('-').map(Number);
  return mesDe(new Date(Date.UTC(anio, numero - 2, 1)));
}

function mensaje(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

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
  const hacer = o.fetchImpl ?? fetch;
  const params = new URLSearchParams({
    fields: campo,
    limit: String(RECIENTES),
    access_token: token,
  });
  const res = await hacer(`${GRAPH}/${ruta}?${params}`);
  const cuerpo = (await res.json()) as {
    data?: Array<Record<string, string | undefined>>;
    error?: { message: string };
  };
  if (cuerpo.error) throw new Error(`No se pudo leer el perfil: ${cuerpo.error.message}`);
  return (cuerpo.data ?? []).map((m) => m[campo] ?? '').filter(Boolean);
}

function canalesDe(o: Opciones): { canales: Canal[]; omitidos: NombreCanal[] } {
  const canales: Canal[] = [
    {
      nombre: 'instagram',
      recientes: (op) => textosRecientes(op, `${op.igUserId}/media`, 'caption', op.token),
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
      recientes: (op) => textosRecientes(op, `${pageId}/posts`, 'message', fbToken),
      pendientes: pendientesFacebook,
      publicar: (pieza, mes, op) =>
        publicarPiezaFacebook(pieza, mes, { pageId, token: fbToken, fetchImpl: op.fetchImpl }),
    });
  } else {
    omitidos.push('facebook');
  }

  return { canales, omitidos };
}

/**
 * Publica las piezas que toquen ahora mismo, en todos los canales configurados.
 *
 * La llaman dos puertas —el `scheduled()` del Worker y la ruta HTTP— y no puede
 * saber cuál de las dos fue: todo lo que depende del entorno entra por
 * parámetro.
 */
export async function publicarLoQueToca(opciones: Opciones): Promise<Resultado> {
  const mes = mesDe(opciones.ahora);
  const previo = mesAnterior(mes);
  const buscar = opciones.buscarMes ?? piezasDe;
  const { canales, omitidos } = canalesDe(opciones);

  // El mes anterior entra porque la franja de Facebook de una pieza del ultimo
  // dia a las 18:00 cae el dia 1 del siguiente. Un mes sin calendario escrito no
  // es un error: es un mes sin escribir.
  const delPrevio = buscar(previo) ?? [];
  const deEsteMes = buscar(mes) ?? [];
  const piezas = [...delPrevio, ...deEsteMes];

  // Se sale antes de consultar los perfiles para no gastar llamadas de balde.
  if (piezas.length === 0) {
    return { mes, revisadas: 0, publicadas: [], fallidas: [], omitidos };
  }

  // ⚠️ El mapa va indexado por el OBJETO, no por `pieza.id`: nada garantiza que
  // un id sea unico entre meses, y una colision publicaria la imagen del mes
  // equivocado, que en el CDN es un 404.
  const mesDePieza = new Map<Pieza, string>();
  for (const p of delPrevio) mesDePieza.set(p, previo);
  for (const p of deEsteMes) mesDePieza.set(p, mes);

  const publicadas: Resultado['publicadas'] = [];
  const fallidas: Resultado['fallidas'] = [];

  for (const canal of canales) {
    try {
      const recientes = await canal.recientes(opciones);
      for (const pieza of canal.pendientes(piezas, opciones.ahora, recientes)) {
        try {
          const { id } = await canal.publicar(pieza, mesDePieza.get(pieza) ?? mes, opciones);
          publicadas.push({ canal: canal.nombre, id: pieza.id, mediaId: id });
        } catch (e) {
          // Una pieza que falla no debe impedir las demas del mismo dia.
          fallidas.push({ canal: canal.nombre, id: pieza.id, error: mensaje(e) });
        }
      }
    } catch (e) {
      // Un canal caido no debe impedir el otro.
      fallidas.push({ canal: canal.nombre, id: 'lectura-perfil', error: mensaje(e) });
    }
  }

  return { mes, revisadas: piezas.length, publicadas, fallidas, omitidos };
}
```

- [ ] **Paso 3: Pasar los secretos de Facebook en `worker.ts`**

`worker.ts` no aprende nada de Facebook: solo reenvía dos variables más y añade el
canal a su línea de log.

```typescript
    ctx.waitUntil(
      publicarLoQueToca({
        igUserId,
        token,
        // Opcionales a proposito: sin ellos Facebook se omite y la tanda sigue
        // publicando en Instagram. Ver `canalesDe` en tanda.ts.
        fbPageId: env.FB_PAGE_ID,
        fbToken: env.FB_PAGE_ACCESS_TOKEN,
        ahora: new Date(),
      })
        .then((r) => {
          // Sin el token ni el caption: esto acaba en los logs.
          const omitidos = r.omitidos.length > 0 ? `, omitidos ${r.omitidos.join(',')}` : '';
          console.log(
            `cron ${r.mes}: revisadas ${r.revisadas}, publicadas ` +
              `${r.publicadas.map((p) => `${p.canal}:${p.id}`).join(',') || 'ninguna'}, ` +
              `fallidas ${r.fallidas.map((f) => `${f.canal}:${f.id} (${f.error})`).join(',') || 'ninguna'}` +
              omitidos,
          );
        })
        .catch((e) => console.error(`cron: ${e instanceof Error ? e.message : e}`)),
    );
```

⚠️ La guarda de arriba (`if (!igUserId || !token)`) **no se toca**: Instagram sigue
siendo obligatorio. Facebook no.

- [ ] **Paso 4: Pasar los secretos de Facebook en la ruta HTTP**

`app/api/cron/publicar/route.ts` sigue siendo una puerta fina. Solo cambia la
llamada:

```typescript
  const resultado = await publicarLoQueToca({
    igUserId,
    token,
    fbPageId: process.env.FB_PAGE_ID,
    fbToken: process.env.FB_PAGE_ACCESS_TOKEN,
    ahora: new Date(),
  });
  return NextResponse.json(resultado, {
    status: resultado.fallidas.length > 0 ? 500 : 200,
  });
```

⚠️ **No añadir `export const maxDuration = 300`.** Es una directiva del runtime
serverless de Vercel y en Cloudflare Workers no hace nada; el ciclo de vida del
cron lo controla `ctx.waitUntil()` en `worker.ts`. El único `export const` que va
aquí es el `dynamic = 'force-dynamic'` que ya está.

⚠️ `omitidos` **no** cuenta para el status: un canal sin configurar devuelve 200.

- [ ] **Paso 5: `--facebook` en `lib/publicar/cli.ts`**

Tres cambios:

1. Añadir la opción `--facebook`, que cambia lo que se muestra en el ensayo (una
   sola imagen 4x5 y el caption de Facebook) y a dónde se publica.
2. Sustituir `await import(pathToFileURL(...))` por `piezasDe(mes)` de
   `content/piezas/index.ts`. Hoy el ensayo puede funcionar para un mes que el
   cron no ve —porque no está en `MESES`—, que es la peor forma posible de
   confirmar que algo va a salir.
3. **No copiar la guarda duplicada de la versión anterior de este plan:** tras
   `if (!pageId || !token)` traía un `if (!token)` inalcanzable que además
   nombraba `IG_ACCESS_TOKEN` dentro de la rama de Facebook.

```typescript
import { piezasDe } from '../../content/piezas/index.ts';
import { archivosDe, publicarPieza, urlPublica } from './meta.ts';
import { publicarPiezaFacebook } from './facebook.ts';
import { captionFacebook } from './programado.ts';

// ...

  const piezas = piezasDe(mes);
  if (!piezas) {
    console.error(`El mes ${mes} no esta en MESES (content/piezas/index.ts). El cron tampoco lo veria.`);
    process.exit(1);
  }
  const pieza = piezas.find((p) => p.id === id);

// ...

  if (esFacebook) {
    const pageId = process.env.FB_PAGE_ID;
    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    if (!pageId || !token) {
      console.error('\nFaltan FB_PAGE_ID o FB_PAGE_ACCESS_TOKEN en el entorno.');
      process.exit(1);
    }
    const { id: publicado } = await publicarPiezaFacebook(pieza, mes, { pageId, token });
    console.log(`Publicado en Facebook: https://facebook.com/${publicado}`);
  } else {
    // ...la rama de Instagram que ya existe, sin cambios
  }
```

- [ ] **Paso 6: Verificar**

```bash
npm test          # los tests de la fabrica
npx tsc --noEmit  # los tipos
```

Los dos, y **no son redundantes**: uno solo deja pasar clases enteras de error.
Comparar contra la línea base medida en el Paso 1, no contra un número escrito
aquí.

Comprobación adicional, porque el bug que más caro sale en esta tarea es mudo:

```bash
grep -rn "await import(\`" lib/ app/ content/ --include='*.ts'
```

Debe no devolver nada. Un import dinámico con plantilla compila, despliega y luego
responde «no hay piezas» todos los meses **sin dar error** — está documentado en
`content/piezas/index.ts:6-16`.

---

## Tarea 7: Incorporación del bloque `facebook` a las 7 piezas de septiembre (`2026-09.ts`)

Añadir el bloque `facebook: { publicarEl, caption }` a las 7 piezas de septiembre en `content/piezas/2026-09.ts` con su fecha escalonada correspondiente (franja siguiente) y texto argumentativo largo sin hashtags, y verificar que `npm run piezas -- --check` y `npx tsc --noEmit` queden 100% limpios.

**Files:**
- Modify: `content/piezas/2026-09.ts`

- [ ] **Paso 1: Actualizar `content/piezas/2026-09.ts`**

Modificar `content/piezas/2026-09.ts` incorporando el bloque `facebook` a cada una de las 7 piezas:

```typescript
import type { Pieza } from '../../lib/piezas/tipos.ts';

/**
 * Las piezas de septiembre de 2026.
 *
 * Dos por semana, martes y jueves, según `docs/COMMUNITY_MANAGEMENT.md`:
 *
 *   martes  → PukaHealth, el producto del mes
 *   jueves  → la casa, en Dark Glass Rojo
 *
 * Cada pieza publica en Instagram en su `publicarEl` y en Facebook en la franja
 * siguiente (o según `facebook.publicarEl`).
 */
const piezas: Pieza[] = [
  // ─────────────────────────────  miércoles 2  ·  PukaHealth  ──────────────
  {
    id: 'podologo-no-receta',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-02T18:00',
    caption:
      '¿Un podólogo puede recetar medicamentos en Ecuador?\n\n' +
      'No. El Art. 168 de la Ley Orgánica de Salud es explícito: solo médicos, ' +
      'odontólogos y obstetrices pueden prescribir.\n\n' +
      'Un podólogo emite indicaciones de tratamiento podológico. Es otra cosa, ' +
      'y el documento tiene que decirlo así.\n\n' +
      'Si tu software te deja imprimir algo titulado «receta médica», te está ' +
      'poniendo en un problema que no es tuyo: el papel lleva tu nombre y tu ' +
      'registro profesional, no el del sistema.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#podologia #recetamedica #Ecuador #normativasalud',
    facebook: {
      publicarEl: '2026-09-03T09:00',
      caption:
        'Un podólogo no puede recetar\n' +
        'Y muchos sistemas dejan imprimir «receta médica» igual. Ahí empieza el problema.\n\n' +
        'Lo dice el Art. 168\n' +
        'Solo médicos, odontólogos y obstetrices están facultados para prescribir medicamentos. La podología no está en esa lista.\n\n' +
        'No es un tecnicismo\n' +
        'Un documento mal titulado te expone a ti, no al software. El papel lleva tu nombre y tu registro profesional.\n\n' +
        'Lo correcto: indicaciones\n' +
        'El documento se llama «indicaciones de tratamiento podológico» y lo dice en su propio pie.\n\n' +
        'Y el paciente lo verifica\n' +
        'Cada documento sale con un enlace propio. Quien lo reciba comprueba que es auténtico sin llamar a la consulta.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'LEY ORGÁNICA DE SALUD',
        titular: 'Un podólogo no puede recetar',
        bajada: 'Y muchos sistemas dejan imprimir «receta médica» igual. Ahí empieza el problema.',
      },
      {
        titular: 'Lo dice el Art. 168',
        bajada:
          'Solo médicos, odontólogos y obstetrices están facultados para prescribir ' +
          'medicamentos. La podología no está en esa lista.',
      },
      {
        titular: 'No es un tecnicismo',
        bajada:
          'Un documento mal titulado te expone a ti, no al software. El papel lleva ' +
          'tu nombre y tu registro profesional.',
      },
      {
        titular: 'Lo correcto: indicaciones',
        bajada:
          'El documento se llama «indicaciones de tratamiento podológico» y lo dice ' +
          'en su propio pie. Así se ve en PukaHealth:',
        captura: 'validar-receta.png',
      },
      {
        titular: 'Y el paciente lo verifica',
        bajada:
          'Cada documento sale con un enlace propio. Quien lo reciba comprueba que es ' +
          'auténtico sin llamar a la consulta.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // ─────────────────────────────  jueves 3  ·  la casa  ─────────────────────
  {
    id: 'precios-software-ecuador',
    sistema: 'puka',
    producto: 'pukaia',
    // De la competencia, no nuestros. Ver `preciosAjenos` en tipos.ts.
    preciosAjenos: ['49', '499'],
    publicarEl: '2026-09-03T09:00',
    caption:
      '¿Cuánto cuesta un CRM con WhatsApp en Ecuador?\n\n' +
      'Los que se venden aquí como CRM cobran entre $49 y $499 al mes. Los ' +
      'revisamos uno por uno y los pusimos en la misma tabla.\n\n' +
      'PukaIA hace lo mismo desde $14.99: inbox centralizado, pipeline, gestión ' +
      'de clientes y reportes. No es un chatbot con otro nombre.\n\n' +
      'Si estás comparando herramientas para tu pyme, esta tabla te ahorra la ' +
      'tarde.\n\n' +
      'pukadigital.com/agentes-ia\n\n' +
      '#CRM #WhatsAppBusiness #Ecuador #pymes',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption:
        'Lo que cuesta un CRM aquí\n' +
        'Precios reales de los que se venden en Ecuador. Sin descuentos de lanzamiento.\n\n' +
        'Entre $49 y $499 al mes\n' +
        'Ese es el rango de los que se posicionan como CRM con WhatsApp para pymes en el mercado ecuatoriano.\n\n' +
        '¿Por qué tan caro?\n' +
        'Casi todos cobran por conversación o por agente. Creces, y la factura crece contigo aunque el trabajo sea el mismo.\n\n' +
        'Lo que cobramos nosotros — $14.99 al mes\n' +
        'Ese es el Básico. Pro $25 y Business $60. Un mes gratis para probarlo.\n\n' +
        'Compara antes de firmar\n' +
        'No te pedimos que nos creas: pide la tabla completa y decide con los números delante.\n\n' +
        'pukadigital.com/agentes-ia',
    },
    slides: [
      {
        badge: 'SIN MAQUILLAJE',
        titular: 'Lo que cuesta un CRM aquí',
        bajada: 'Precios reales de los que se venden en Ecuador. Sin descuentos de lanzamiento.',
      },
      {
        titular: 'Entre $49 y $499 al mes',
        bajada:
          'Ese es el rango de los que se posicionan como CRM con WhatsApp para pymes ' +
          'en el mercado ecuatoriano.',
      },
      {
        titular: '¿Por qué tan caro?',
        bajada:
          'Casi todos cobran por conversación o por agente. Creces, y la factura crece ' +
          'contigo aunque el trabajo sea el mismo.',
      },
      {
        titular: 'Lo que cobramos nosotros',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Ese es el Básico. Pro $25 y Business $60. Un mes gratis para probarlo.',
      },
      {
        titular: 'Compara antes de firmar',
        bajada:
          'No te pedimos que nos creas: pide la tabla completa y decide con los ' +
          'números delante.',
        cta: 'Pídenos la tabla',
      },
    ],
  },

  // ─────────────────────────────  martes 8  ·  PukaHealth  ──────────────────
  {
    id: 'proteccion-datos-clinicas',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-08T09:00',
    caption:
      '¿Tu clínica necesita un Delegado de Protección de Datos?\n\n' +
      'Según la Resolución SPDP-SPD-2026-0005-R, los datos de salud califican ' +
      'como tratamiento «a gran escala» por calificación directa. No hay que ' +
      'puntuar nada: una clínica califica por lo que hace.\n\n' +
      'Eso obliga a tener un Delegado de Protección de Datos registrado, un ' +
      'Registro de Actividades de Tratamiento y una auditoría cada 12 meses.\n\n' +
      'Aplica tengas o no software. El plazo de 90 días ya venció.\n\n' +
      'No somos abogados: esto existe y les aplica, confírmenlo con su asesor.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#proteccciondedatos #clinicas #Ecuador #normativasalud',
    facebook: {
      publicarEl: '2026-09-08T18:00',
      caption:
        'Tu clínica ya está en falta\n' +
        'Y el plazo para corregirlo venció hace meses. Casi nadie se enteró.\n\n' +
        'Datos de salud: gran escala\n' +
        'Por calificación directa. No hay que puntuar nada ni contar pacientes: una clínica califica por lo que hace.\n\n' +
        'Qué te obliga\n' +
        'Delegado de Protección de Datos registrado, Registro de Actividades de Tratamiento, y auditoría cada 12 meses con informe archivado 5 años.\n\n' +
        'Tengas o no software\n' +
        'Esto no va de sistemas. Aplica a la clínica que lleva fichas en papel exactamente igual que a la que las lleva digitales.\n\n' +
        'Confírmalo con tu asesor\n' +
        'No somos abogados y esto no es asesoría legal. Es un aviso: la norma existe y te aplica.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'RESOLUCIÓN 2026-0005-R',
        titular: 'Tu clínica ya está en falta',
        bajada: 'Y el plazo para corregirlo venció hace meses. Casi nadie se enteró.',
      },
      {
        titular: 'Datos de salud: gran escala',
        bajada:
          'Por calificación directa. No hay que puntuar nada ni contar pacientes: ' +
          'una clínica califica por lo que hace.',
      },
      {
        titular: 'Qué te obliga',
        bajada:
          'Delegado de Protección de Datos registrado, Registro de Actividades de ' +
          'Tratamiento, y auditoría cada 12 meses con informe archivado 5 años.',
      },
      {
        titular: 'Tengas o no software',
        bajada:
          'Esto no va de sistemas. Aplica a la clínica que lleva fichas en papel ' +
          'exactamente igual que a la que las lleva digitales.',
      },
      {
        titular: 'Confírmalo con tu asesor',
        bajada:
          'No somos abogados y esto no es asesoría legal. Es un aviso: la norma ' +
          'existe y te aplica.',
        cta: 'Habla con nosotros',
      },
    ],
  },

  // ─────────────────────────────  jueves 10  ·  la casa  ────────────────────
  {
    id: 'crm-no-chatbot',
    sistema: 'puka',
    producto: 'pukaia',
    publicarEl: '2026-09-10T18:00',
    caption:
      'Un chatbot responde. Un CRM te dice a quién llamar mañana.\n\n' +
      'La diferencia importa cuando tienes 40 conversaciones abiertas en ' +
      'WhatsApp y no sabes cuál de ellas iba a comprar.\n\n' +
      'PukaIA tiene inbox centralizado, pipeline en Kanban, ficha de cliente y ' +
      'reportes. El bot es una parte, no el producto.\n\n' +
      'Desde $14.99 al mes, con un mes gratis.\n\n' +
      'pukadigital.com/agentes-ia\n\n' +
      '#CRM #WhatsAppBusiness #ventas #Ecuador',
    facebook: {
      publicarEl: '2026-09-11T09:00',
      caption:
        'No es un chatbot\n' +
        'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.\n\n' +
        'Un bot contesta y ya\n' +
        'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ni qué quería.\n\n' +
        'Un CRM recuerda\n' +
        'Cada conversación es un cliente con historial, etapa y siguiente paso. Sabes a quién llamar sin buscar en el chat.\n\n' +
        'Qué incluye\n' +
        'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e integraciones. El bot es una parte.\n\n' +
        'Pruébalo un mes — $14.99 al mes\n' +
        'Sin tarjeta para empezar.\n\n' +
        'pukadigital.com/agentes-ia',
    },
    slides: [
      {
        badge: 'CRM PARA WHATSAPP',
        titular: 'No es un chatbot',
        bajada: 'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.',
      },
      {
        titular: 'Un bot contesta y ya',
        bajada:
          'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ' +
          'ni qué quería.',
      },
      {
        titular: 'Un CRM recuerda',
        bajada:
          'Cada conversación es un cliente con historial, etapa y siguiente paso. ' +
          'Sabes a quién llamar sin buscar en el chat.',
      },
      {
        titular: 'Qué incluye',
        bajada:
          'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e ' +
          'integraciones. El bot es una parte.',
      },
      {
        titular: 'Pruébalo un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Sin tarjeta para empezar.',
        cta: 'Escríbenos',
      },
    ],
  },

  // ─────────────────────────────  martes 15  ·  PukaHealth  ─────────────────
  {
    id: 'enter-tumba-factura',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-15T09:00',
    caption:
      '¿Por qué el SRI te devuelve el error 35?\n\n' +
      'Porque pulsaste Enter. El esquema XSD del SRI prohíbe los saltos de línea ' +
      'en los campos de texto, y un comprobante con uno dentro no cumple la ' +
      'estructura XML.\n\n' +
      'Pasa sobre todo escribiendo el motivo de una nota de crédito, donde uno ' +
      'tiende a separar en párrafos.\n\n' +
      'No es tu computadora ni tu internet. Es un carácter invisible.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#SRI #facturacionelectronica #Ecuador #consultoriomedico',
    facebook: {
      publicarEl: '2026-09-15T18:00',
      caption:
        'Pulsaste Enter y se cayó\n' +
        '«Archivo no cumple estructura XML». El motivo es más tonto de lo que parece.\n\n' +
        'El XSD no admite saltos\n' +
        'El esquema del SRI define los campos de texto sin permitir saltos de línea. Uno solo invalida el comprobante entero.\n\n' +
        'Dónde pasa siempre\n' +
        'En el motivo de una nota de crédito. Es texto largo, uno separa en párrafos, y ahí se rompe.\n\n' +
        'No es tu internet\n' +
        'Es un carácter que no se ve. Por eso el error desconcierta: el texto se ve perfecto en pantalla.\n\n' +
        'Un sistema debería avisarte\n' +
        'Antes de enviarlo, no después del rechazo. Eso es lo que separa un sistema que factura de uno que lo intenta.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'ERROR 35',
        titular: 'Pulsaste Enter y se cayó',
        bajada: '«Archivo no cumple estructura XML». El motivo es más tonto de lo que parece.',
      },
      {
        titular: 'El XSD no admite saltos',
        bajada:
          'El esquema del SRI define los campos de texto sin permitir saltos de línea. ' +
          'Uno solo invalida el comprobante entero.',
      },
      {
        titular: 'Dónde pasa siempre',
        bajada:
          'En el motivo de una nota de crédito. Es texto largo, uno separa en párrafos, ' +
          'y ahí se rompe.',
      },
      {
        titular: 'No es tu internet',
        bajada:
          'Es un carácter que no se ve. Por eso el error desconcierta: el texto se ve ' +
          'perfecto en pantalla.',
      },
      {
        titular: 'Un sistema debería avisarte',
        bajada:
          'Antes de enviarlo, no después del rechazo. Eso es lo que separa un sistema ' +
          'que factura de uno que lo intenta.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // ─────────────────────────────  jueves 17  ·  la casa  ────────────────────
  {
    id: 'requisitos-facturar-sri',
    sistema: 'puka',
    publicarEl: '2026-09-17T18:00',
    caption:
      '¿Qué necesitas para facturar electrónicamente en Ecuador?\n\n' +
      'Son cuatro cosas, y ninguna es el software: RUC activo, firma electrónica ' +
      'vigente, el ambiente de pruebas del SRI aprobado y un punto de emisión.\n\n' +
      'El orden importa. Y hay un detalle que quema a casi todos: el secuencial ' +
      'se comparte entre pruebas y producción, así que probar en tu punto real ' +
      'te consume números que no recuperas.\n\n' +
      'Reserva un punto de emisión alto y descartable para tus pruebas.\n\n' +
      'pukadigital.com\n\n' +
      '#SRI #facturacionelectronica #Ecuador #emprendimiento',
    facebook: {
      publicarEl: '2026-09-18T09:00',
      caption:
        'Cuatro cosas, y ninguna es el software\n' +
        'Lo que de verdad te pide el SRI para emitir tu primera factura electrónica.\n\n' +
        'RUC activo y firma vigente\n' +
        'La firma electrónica caduca. Si la tuya venció, no hay sistema que emita nada por ti.\n\n' +
        'El RUC debe coincidir\n' +
        'El de la empresa y el del certificado firmante. Si eres persona natural, tu RUC es tu cédula más 001.\n\n' +
        'Ojo con las pruebas\n' +
        'El secuencial se comparte entre pruebas y producción. Probar en tu punto real te quema números que no recuperas.\n\n' +
        'Reserva un punto descartable\n' +
        'Uno alto, solo para pruebas. Es el consejo que nadie te da y que evita un lío difícil de deshacer.\n\n' +
        'pukadigital.com',
    },
    slides: [
      {
        badge: 'ANTES DE EMPEZAR',
        titular: 'Cuatro cosas, y ninguna es el software',
        bajada: 'Lo que de verdad te pide el SRI para emitir tu primera factura electrónica.',
      },
      {
        titular: 'RUC activo y firma vigente',
        bajada:
          'La firma electrónica caduca. Si la tuya venció, no hay sistema que emita ' +
          'nada por ti.',
      },
      {
        titular: 'El RUC debe coincidir',
        bajada:
          'El de la empresa y el del certificado firmante. Si eres persona natural, ' +
          'tu RUC es tu cédula más 001.',
      },
      {
        titular: 'Ojo con las pruebas',
        bajada:
          'El secuencial se comparte entre pruebas y producción. Probar en tu punto ' +
          'real te quema números que no recuperas.',
      },
      {
        titular: 'Reserva un punto descartable',
        bajada:
          'Uno alto, solo para pruebas. Es el consejo que nadie te da y que evita ' +
          'un lío difícil de deshacer.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },

  // ─────────────────────────────  martes 22  ·  PukaHealth  ─────────────────
  {
    id: 'receta-contenido-minimo',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-22T09:00',
    caption:
      '¿Qué debe llevar una receta médica en Ecuador?\n\n' +
      'La Resolución ACESS-2023-0030 lo detalla en su Art. 5, y hay siete cosas ' +
      'que casi ninguna receta completa.\n\n' +
      'La que más sorprende: el registro ACESS del prescriptor, que no es el ' +
      'registro SENESCYT del título. Y la cantidad va en números y en letras.\n\n' +
      'Otra que casi nadie sabe: «no se aceptarán rúbricas o trazos por firma». ' +
      'Un garabato no es una firma.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#recetamedica #ACESS #Ecuador #normativasalud',
    facebook: {
      publicarEl: '2026-09-22T18:00',
      caption:
        'Siete cosas que faltan en tu receta\n' +
        'Y una de ellas la confunde casi todo el mundo.\n\n' +
        'La edad, en años y meses\n' +
        'Si el paciente es menor de cinco años, la edad va en años y meses. Solo el año no cumple.\n\n' +
        'La cantidad, dos veces\n' +
        'En números y en letras. Como en un cheque, y por el mismo motivo: que no se pueda alterar.\n\n' +
        'El registro ACESS\n' +
        'No es el registro SENESCYT de tu título. Son dos números distintos y la receta pide el de ACESS.\n\n' +
        'Un garabato no es firma\n' +
        'Textual del Art. 5: «no se aceptarán rúbricas o trazos por firma». Y las recetas se archivan cinco años.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'ACESS-2023-0030',
        titular: 'Siete cosas que faltan en tu receta',
        bajada: 'Y una de ellas la confunde casi todo el mundo.',
      },
      {
        titular: 'La edad, en años y meses',
        bajada:
          'Si el paciente es menor de cinco años, la edad va en años y meses. Solo el ' +
          'año no cumple.',
      },
      {
        titular: 'La cantidad, dos veces',
        bajada:
          'En números y en letras. Como en un cheque, y por el mismo motivo: que no se ' +
          'pueda alterar.',
      },
      {
        titular: 'El registro ACESS',
        bajada:
          'No es el registro SENESCYT de tu título. Son dos números distintos y la ' +
          'receta pide el de ACESS.',
      },
      {
        titular: 'Un garabato no es firma',
        bajada:
          'Textual del Art. 5: «no se aceptarán rúbricas o trazos por firma». Y las ' +
          'recetas se archivan cinco años.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },
];

export default piezas;
```

- [ ] **Paso 2: Comprobar la suite completa y `prebuild`**

Ejecutar:
1. `npm run piezas -- --check` → `7 pieza(s) validas en 2026-09.`
2. `npm test` → todo en verde, 0 fallando (contra la línea base medida, no contra un número escrito aquí).
3. `npx tsc --noEmit` → compilación TypeScript estricta sin errores.

---

## Criterio de aceptación global

1. `npm test` pasa con **0 fallando**, y con más tests que la línea base medida al empezar (los deltas de las siete tareas suman unos 29 nuevos).
2. `npm run piezas -- --check` valida correctamente `content/piezas/2026-09.ts` con sus bloques `facebook`.
3. `npm run captions -- --mes 2026-09` imprime los bloques `facebook: { ... }` listos para copiar.
4. `yaPublicada()` protege de forma independiente contra publicaciones dobles en Instagram y Facebook.
5. El cron `route.ts` soporta publicación simultánea en ambas redes y previene pérdidas por cruce de mes.
6. `npx tsc --noEmit` compila limpiamente sin errores de tipo.

---

## Lo que verifiqué

Lista exhaustiva de símbolos, firmas, tipos e imports verificados contra el código real del repositorio:

| Símbolo / Firma / Import | Archivo real y línea | Qué se comprobó |
|---|---|---|
| `type Pieza` | `lib/piezas/tipos.ts:31-56` | Estructura existente, compatibilidad con la adición del campo opcional `facebook?: { caption?: string; publicarEl?: string }`. |
| `type Slide` | `lib/piezas/tipos.ts:5-20` | Campos `badge`, `titular`, `bajada`, `dato: { valor, etiqueta }`, `cta`, `captura`. |
| `type ProductoId` | `lib/piezas/tipos.ts:23-29` | Las 6 claves: `agencia`, `pukaia`, `ledgerxpertz`, `pukahealth`, `pukasalud`, `desarrollo-web`. |
| `CATALOGO` | `lib/piezas/catalogo.ts:20-63` | `url` contiene rutas relativas (`/agentes-ia`), exigiendo anteponer `pukadigital.com` en `componer.ts`. |
| `preciosEn(texto)` | `lib/piezas/catalogo.ts:74-77` | Regex para extraer precios con `$`; devuelve array de strings normalizadas. |
| `ofertasEn(texto)` | `lib/piezas/catalogo.ts:80-85` | Regex para ofertas de gratuidad (`dias/meses gratis`). |
| `PROHIBIDAS` y `afirmacionesProhibidas(texto)` | `lib/piezas/prohibidas.ts:18-77` | 7 reglas médicas específicas de `pukahealth`. Se verificó que aplican solo a PukaHealth. |
| `validar(piezas)` y `formatear(errores)` | `lib/piezas/validar.ts:40-178` | Función pura; se verificó cómo reporta errores (`campo`, `mensaje`, `slide`) y cómo validar captions. |
| `hechos.test.ts:130` | `lib/piezas/hechos.test.ts:130-138` | Test de aislamiento de prohibiciones (`'Sincronización bidireccional con tu tienda'` en LedgerXpertz debe ser válido). |
| `urlPublica(mes, archivo)` | `lib/publicar/meta.ts:25-27` | Genera `https://pukadigital.com/piezas/${mes}/${archivo}` para consumo de Graph API. |
| `aUTC(local)` | `lib/publicar/programado.ts:25-29` | Conversión horaria de Ecuador (UTC-5) a UTC. |
| `programado.test.ts:64-67` | `lib/publicar/programado.test.ts:64-67` | Tests de `yaPublicada()` que requerían adaptación al parametrizar la firma a texto explícito. |
| `content/piezas/2026-09.ts` | `content/piezas/2026-09.ts:20-371` | Las 7 piezas reales de septiembre (3 a las 18:00 y 4 a las 09:00), verificando que ninguna tenía `facebook` previo. |
| `app/api/cron/publicar/route.ts` | `app/api/cron/publicar/route.ts:1-72` | Endpoint del cron, autenticación `CRON_SECRET`, carga dinámica de módulos y timeout `maxDuration = 300`. |
| `package.json` scripts y dependencias | `package.json:5-41` | `"@google/genai": "^1.30.0"` ya presente en `dependencies`, `"test": "node --import tsx --test lib/*/*.test.ts"`. |
| `lib/genai.ts` | `lib/genai.ts:4` | Confirma el uso de la variable de entorno `API_KEY` (sin prefijo). |

---

## Dudas y supuestos

1. **Variables de entorno para Facebook:**
   - **RESUELTO en la revisión.** Las variables son `FB_PAGE_ID` y
     `FB_PAGE_ACCESS_TOKEN`, **sin ningún fallback**. El plan original las hacía caer
     a un page id hardcodeado y al token de Instagram, y además borraba la guarda de
     error 500. Eso rompe el patrón del proyecto, que falla ruidosamente cuando falta
     una variable (`route.ts:36`, `cli.ts:47`): con el fallback, un entorno mal
     configurado publicaría en una página concreta sin avisar. El operador tiene que
     darlas de alta en la fase B de la migración.
2. **Modelo de Gemini por defecto:**
   - **RESUELTO en la revisión.** El plan original fijaba `'gemini-2.5-flash'`
     alegando que 3.x no estaba disponible. **Es falso:** Gemini 3 Flash existe desde
     diciembre de 2025 y la spec exige el Flash 3.x más reciente. Queda
     `process.env.MODELO_CAPTION ?? 'gemini-3.8-flash'` — aquí el fallback sí procede,
     porque es un valor por defecto razonable y no una credencial. **Verificar el id
     exacto antes de implementar.**
3. **Mapeo de mes en cruces de fin de mes:**
   - Se asume que cuando el cron carga tanto el mes actual como el anterior, las imágenes de cada pieza se resuelven contra la carpeta del mes de origen (`public/piezas/${mesDeOrigen}/${archivo}`) gracias al mapa `mapaMes`, evitando errores 404 al publicar en Facebook piezas del 30 de septiembre el 1 de octubre.
4. **Un test existente estuvo a punto de perderse.**
   - La Tarea 4 reescribe `lib/publicar/programado.test.ts` entero, y en el borrador
     original desaparecía `'una pieza sin caption no se puede comparar'`. El síntoma
     fue un descuadre de conteo (99 en vez de 100); la causa era perder cobertura de
     una guarda de seguridad. Está restaurado y marcado NO ELIMINAR.
   - 🔴 **Lección para las tareas que reescriben un archivo entero:** contar los tests
     antes y después, y nombrar los que se conservan. Un borrado no se ve en el diff
     de la misma forma que un cambio.

5. **Validación de piezas sin producto:**
   - Se mantiene el principio estricto de la spec: si una pieza de utilidad sin `producto` incluye un precio u oferta comercial en su caption de Instagram o Facebook, `validar.ts` emitirá un error en el campo `producto` requiriendo que se declare el producto correspondiente.
