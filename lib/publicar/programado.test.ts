import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aUTC, pendientes, yaPublicada } from './programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

// El caption es obligatorio para el cron: sin el no se puede comprobar si la
// pieza ya salio, asi que todas las de prueba lo llevan.
const base: Omit<Pieza, 'id'> = {
  sistema: 'puka',
  caption: 'Un caption',
  slides: [{ titular: 'Hola' }],
};

test('la hora se escribe en hora de Ecuador y se convierte a UTC', () => {
  // Ecuador es UTC-5 todo el ano: no hay horario de verano.
  assert.equal(aUTC('2026-09-09T09:00').toISOString(), '2026-09-09T14:00:00.000Z');
  assert.equal(aUTC('2026-09-09T18:30').toISOString(), '2026-09-09T23:30:00.000Z');
  // Cruzando la medianoche: las 21:00 de Ecuador son las 02:00 UTC del dia siguiente.
  assert.equal(aUTC('2026-09-09T21:00').toISOString(), '2026-09-10T02:00:00.000Z');
});

test('solo entra lo que ya toca, con margen de una hora', () => {
  const piezas: Pieza[] = [
    { ...base, id: 'ayer', caption: 'ayer', publicarEl: '2026-09-08T09:00' },
    { ...base, id: 'ahora', caption: 'ahora', publicarEl: '2026-09-09T09:00' },
    { ...base, id: 'manana', caption: 'manana', publicarEl: '2026-09-10T09:00' },
  ];
  // 09:05 de Ecuador = 14:05 UTC
  const ahora = new Date('2026-09-09T14:05:00Z');
  assert.deepEqual(pendientes(piezas, ahora, []).map((p) => p.id), ['ahora']);
});

test('lo viejo no se publica con retraso: la ventana se cierra', () => {
  const piezas: Pieza[] = [{ ...base, id: 'vieja', publicarEl: '2026-09-09T09:00' }];
  // Tres horas tarde. Si el cron fallo, se publica a mano, no de madrugada.
  assert.deepEqual(pendientes(piezas, new Date('2026-09-09T17:00:00Z'), []), []);
});

test('una pieza sin fecha nunca entra en el cron', () => {
  const piezas: Pieza[] = [{ ...base, id: 'sin-fecha' }];
  assert.deepEqual(pendientes(piezas, new Date('2026-09-09T14:00:00Z'), []), []);
});

test('no se republica lo que ya esta en el perfil', () => {
  const pieza: Pieza = { ...base, id: 'x', publicarEl: '2026-09-09T09:00', caption: 'Tu factura no pasó' };
  const ahora = new Date('2026-09-09T14:05:00Z');
  assert.deepEqual(pendientes([pieza], ahora, []).map((p) => p.id), ['x']);
  assert.deepEqual(pendientes([pieza], ahora, ['Tu factura no pasó']), []);
});

test('la comparacion de captions ignora espacios de mas', () => {
  assert.equal(yaPublicada({ ...base, id: 'x', caption: 'Hola  mundo ' }, ['Hola mundo']), true);
  assert.equal(yaPublicada({ ...base, id: 'x', caption: 'Hola mundo' }, ['Otra cosa']), false);
});

test('una pieza sin caption no se puede comparar, asi que no se publica sola', () => {
  const pieza: Pieza = { ...base, id: 'x', caption: undefined, publicarEl: '2026-09-09T09:00' };
  assert.deepEqual(pendientes([pieza], new Date('2026-09-09T14:05:00Z'), []), []);
});
