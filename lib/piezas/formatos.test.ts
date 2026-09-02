import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatosDe, FORMATOS, MARGEN } from './formatos.ts';
import type { Pieza } from './tipos.ts';

const base: Pick<Pieza, 'id' | 'sistema'> = { id: 'x', sistema: 'puka' };

test('una pieza de una sola slide sale en los tres formatos', () => {
  const pieza: Pieza = { ...base, slides: [{ titular: 'Hola' }] };
  assert.deepEqual(formatosDe(pieza), ['4x5', '1x1', '9x16']);
});

test('un carrusel sale solo en 4x5', () => {
  const pieza: Pieza = { ...base, slides: [{ titular: 'A' }, { titular: 'B' }] };
  assert.deepEqual(formatosDe(pieza), ['4x5']);
});

test('los formatos explicitos ganan a la regla por defecto', () => {
  const pieza: Pieza = { ...base, formatos: ['1x1'], slides: [{ titular: 'A' }, { titular: 'B' }] };
  assert.deepEqual(formatosDe(pieza), ['1x1']);
});

test('las medidas y margenes cumplen la especificacion', () => {
  assert.equal(MARGEN, 88);
  assert.deepEqual(FORMATOS['4x5'], { ancho: 1080, alto: 1350, seguroArriba: 0, seguroAbajo: 0 });
  assert.deepEqual(FORMATOS['1x1'], { ancho: 1080, alto: 1080, seguroArriba: 0, seguroAbajo: 0 });
  assert.deepEqual(FORMATOS['9x16'], { ancho: 1080, alto: 1920, seguroArriba: 250, seguroAbajo: 320 });
});
