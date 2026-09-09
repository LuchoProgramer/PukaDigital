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

  // A las 18:00 del día 3 (23:05 UTC): precios-software-ecuador sale en Facebook
  const corridaFB18 = new Date('2026-09-03T23:05:00Z');
  assert.deepEqual(
    pendientesFacebook(piezasSeptiembre, corridaFB18, []).map((p) => p.id),
    ['precios-software-ecuador'],
  );
});

/**
 * Cubre un hueco que dejó el plan: `pendientesFacebook` descarta las fechas
 * imposibles y nada lo probaba. Importa porque `NaN < 0` y `NaN > 60` son
 * **las dos falsas**: sin la guarda una fecha mal tecleada no se descarta, pasa
 * los dos límites de la ventana y la pieza se vuelve publicable a deshora.
 * Y estas fechas se escriben a mano en `content/piezas/`, que es justo donde se
 * cuela un dedazo. Comprobado por mutación el 2026-09-09.
 */
test('una fecha de Facebook imposible descarta la pieza, no la cuela por la ventana', () => {
  const pieza: Pieza = {
    ...base,
    id: 'fecha-mala',
    facebook: { caption: 'texto de facebook', publicarEl: '2026-09-31T25:99' },
  };
  assert.deepEqual(pendientesFacebook([pieza], new Date('2026-09-09T14:05:00Z'), []), []);
});
