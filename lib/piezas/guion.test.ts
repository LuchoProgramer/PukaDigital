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
