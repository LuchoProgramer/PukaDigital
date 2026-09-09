import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validar } from './validar.ts';
import type { Pieza } from './tipos.ts';

const ok: Pieza = {
  id: 'sri-errores-01',
  sistema: 'puka',
  slides: [{ titular: 'Tu factura no paso el SRI' }],
};

function campos(piezas: Pieza[]): string[] {
  return validar(piezas).map((e) => e.campo);
}

test('una pieza correcta no produce errores', () => {
  assert.deepEqual(validar([ok]), []);
});

test('el id debe ser kebab-case', () => {
  assert.deepEqual(campos([{ ...ok, id: 'SRI Errores' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: 'sri_errores' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: '-sri' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: 'sri-' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: 'sri--01' }]), ['id']);
});

test('el id debe ser unico dentro del array', () => {
  const piezas: Pieza[] = [ok, { ...ok }];
  assert.deepEqual(campos(piezas), ['id']);
});

test('una pieza sin slides produce error en slides', () => {
  assert.deepEqual(campos([{ ...ok, slides: [] }]), ['slides']);
});

test('una pieza admite hasta 10 slides pero falla con 11', () => {
  const diez: Pieza = {
    ...ok,
    slides: Array.from({ length: 10 }, (_, i) => ({ titular: `Slide ${i + 1}` })),
  };
  assert.deepEqual(validar([diez]), []);

  const once: Pieza = {
    ...ok,
    slides: Array.from({ length: 11 }, (_, i) => ({ titular: `Slide ${i + 1}` })),
  };
  assert.deepEqual(campos([once]), ['slides']);
});

test('el titular admite como maximo 9 palabras', () => {
  const nuevePalabras: Pieza = {
    ...ok,
    slides: [{ titular: 'una dos tres cuatro cinco seis siete ocho nueve' }],
  };
  assert.deepEqual(validar([nuevePalabras]), []);

  const diezPalabras: Pieza = {
    ...ok,
    slides: [{ titular: 'una dos tres cuatro cinco seis siete ocho nueve diez' }],
  };
  assert.deepEqual(campos([diezPalabras]), ['titular']);
});

test('tope de caracteres en titular: 60 en feed y 48 en 9x16', () => {
  const titular55 = 'a'.repeat(55);

  // Pieza de 1 slide por defecto va a 9x16 -> tope 48 -> 55 falla
  const piezaSuelta: Pieza = { ...ok, slides: [{ titular: titular55 }] };
  assert.deepEqual(campos([piezaSuelta]), ['titular']);

  // Pieza con formato explicito solo 4x5 -> tope 60 -> 55 pasa
  const soloFeed: Pieza = { ...ok, formatos: ['4x5'], slides: [{ titular: titular55 }] };
  assert.deepEqual(validar([soloFeed]), []);

  // Pieza con mas de 60 caracteres falla incluso en feed
  const titular61 = 'a'.repeat(61);
  const feedLargo: Pieza = { ...ok, formatos: ['4x5'], slides: [{ titular: titular61 }] };
  assert.deepEqual(campos([feedLargo]), ['titular']);
});

test('topes de caracteres en slots opcionales', () => {
  const piezaOk: Pieza = {
    ...ok,
    formatos: ['4x5'],
    slides: [{
      titular: 'Valido',
      bajada: 'b'.repeat(140),
      badge: 'g'.repeat(24),
      dato: { valor: 'v'.repeat(8), etiqueta: 'e'.repeat(16) },
      cta: 'c'.repeat(24),
    }],
  };
  assert.deepEqual(validar([piezaOk]), []);

  const piezaExcedida: Pieza = {
    ...ok,
    formatos: ['4x5'],
    slides: [{
      titular: 'Valido',
      bajada: 'b'.repeat(141),
      badge: 'g'.repeat(25),
      dato: { valor: 'v'.repeat(9), etiqueta: 'e'.repeat(17) },
      cta: 'c'.repeat(25),
    }],
  };
  assert.deepEqual(campos([piezaExcedida]), ['bajada', 'badge', 'dato.valor', 'dato.etiqueta', 'cta']);
});

test('el CTA solo puede aparecer en la ultima slide de la pieza', () => {
  const ctaEnPrimeraDeDos: Pieza = {
    ...ok,
    slides: [
      { titular: 'Uno', cta: 'Registrate hoy' },
      { titular: 'Dos' },
    ],
  };
  assert.deepEqual(campos([ctaEnPrimeraDeDos]), ['cta']);

  const ctaEnUltimaDeDos: Pieza = {
    ...ok,
    slides: [
      { titular: 'Uno' },
      { titular: 'Dos', cta: 'Registrate hoy' },
    ],
  };
  assert.deepEqual(validar([ctaEnUltimaDeDos]), []);

  const ctaEnUnicaSlide: Pieza = {
    ...ok,
    slides: [{ titular: 'Uno', cta: 'Registrate hoy' }],
  };
  assert.deepEqual(validar([ctaEnUnicaSlide]), []);
});

test('el error identifica la pieza y el numero de slide', () => {
  const pieza: Pieza = {
    ...ok,
    slides: [
      { titular: 'Valido' },
      { titular: 'una dos tres cuatro cinco seis siete ocho nueve diez' },
    ],
  };
  const errores = validar([pieza]);
  assert.equal(errores.length, 1);
  assert.equal(errores[0].pieza, 'sri-errores-01');
  assert.equal(errores[0].slide, 2);
  assert.equal(errores[0].campo, 'titular');
});

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


/**
 * Los dos que siguen cierran huecos que encontró el contraste contra el código
 * ya implementado. Los dos fallaban **en silencio**, que es la forma cara de
 * fallar en este proyecto: `piezas --check` daba el visto bueno y el problema
 * aparecía —o no aparecía— en producción.
 */
test('un facebook.caption en blanco no pasa, aunque no declare facebook.publicarEl', () => {
  // `??` solo cae al compositor con null o undefined: con '' devuelve ''. La
  // pieza publicaria un post vacio, y en cada corrida dentro de la ventana,
  // porque `yaPublicada('')` es false y nunca lo reconoce como ya publicado.
  const pieza: Pieza = {
    id: 'cap-vacio',
    sistema: 'puka',
    caption: 'El caption de Instagram',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: '   ' },
    slides: [{ titular: 'Un titular' }],
  };
  const errores = validar([pieza]);
  assert.equal(errores.length, 1);
  assert.match(errores[0].campo, /facebook\.caption/);
});

test('una fecha mal formada no pasa la validacion: si no, el cron la descarta sin decir nada', () => {
  // `aUTC()` da NaN y `pendientes*` la descarta con un `return false` mudo: la
  // pieza no sale y no hay error en ningun log que lo explique.
  const conEspacio: Pieza = {
    id: 'fecha-con-espacio',
    sistema: 'puka',
    caption: 'c',
    publicarEl: '2026-09-09 09:00',
    slides: [{ titular: 'T' }],
  };
  assert.equal(validar([conEspacio]).length, 1, 'publicarEl con espacio en vez de T');

  const diaImposible: Pieza = {
    id: 'dia-imposible',
    sistema: 'puka',
    caption: 'c',
    publicarEl: '2026-09-09T09:00',
    facebook: { caption: 'fb', publicarEl: '2026-09-31T09:00' },
    slides: [{ titular: 'T' }],
  };
  assert.equal(validar([diaImposible]).length, 1, '31 de septiembre no existe');
});

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

