import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPieza } from './render.ts';
import type { Pieza } from './tipos.ts';

/** Ancho y alto salen de la cabecera IHDR: es la unica forma de comprobar la
 *  medida real del archivo sin abrirlo a ojo. */
function medidas(png: Buffer): { ancho: number; alto: number } {
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'no es un PNG');
  return { ancho: png.readUInt32BE(16), alto: png.readUInt32BE(20) };
}

test('una pieza suelta sale en los tres formatos con sus medidas', async () => {
  const pieza: Pieza = {
    id: 'prueba-suelta',
    sistema: 'puka',
    slides: [{ titular: 'Tu factura no paso' }],
  };
  const salida = await renderPieza(pieza);

  assert.equal(salida.length, 3);
  assert.deepEqual(
    salida.map((s) => s.nombre).sort(),
    ['prueba-suelta-1-1x1.png', 'prueba-suelta-1-4x5.png', 'prueba-suelta-1-9x16.png'],
  );

  const porNombre = (sufijo: string) => salida.find((s) => s.nombre.endsWith(sufijo))!;
  assert.deepEqual(medidas(porNombre('4x5.png').png), { ancho: 1080, alto: 1350 });
  assert.deepEqual(medidas(porNombre('1x1.png').png), { ancho: 1080, alto: 1080 });
  assert.deepEqual(medidas(porNombre('9x16.png').png), { ancho: 1080, alto: 1920 });
});

test('un carrusel produce un archivo 4x5 por slide, numerado desde 1', async () => {
  const pieza: Pieza = {
    id: 'prueba-carrusel',
    sistema: 'health',
    producto: 'pukahealth',
    slides: [
      { titular: 'Uno' },
      { titular: 'Dos' },
      { titular: 'Tres', cta: 'Escribenos' },
    ],
  };
  const salida = await renderPieza(pieza);

  assert.deepEqual(salida.map((s) => s.nombre), [
    'prueba-carrusel-1-4x5.png',
    'prueba-carrusel-2-4x5.png',
    'prueba-carrusel-3-4x5.png',
  ]);
  for (const { png } of salida) {
    assert.deepEqual(medidas(png), { ancho: 1080, alto: 1350 });
  }
});

test('renderPieza rechaza una pieza que no pasa la validacion', async () => {
  const invalida: Pieza = {
    id: 'MAL Id',
    sistema: 'puka',
    slides: [{ titular: 'una dos tres cuatro cinco seis siete ocho nueve diez' }],
  };
  await assert.rejects(() => renderPieza(invalida), /MAL Id/);
});

test('los dos sistemas producen imagenes distintas', async () => {
  const base: Omit<Pieza, 'sistema'> = {
    id: 'mismo-texto',
    slides: [{ titular: 'Mismo texto' }],
    formatos: ['4x5'],
  };
  const [puka] = await renderPieza({ ...base, sistema: 'puka' });
  const [health] = await renderPieza({ ...base, sistema: 'health' });
  assert.notEqual(puka.png.toString('base64'), health.png.toString('base64'));
});
