import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desglosarNumero, calcularFotogramasContador } from './contador.ts';

test('desglosarNumero extrae prefijo, número, decimales y sufijo en precios', () => {
  const res = desglosarNumero('$14.99');
  assert.deepEqual(res, {
    prefijo: '$',
    numero: 14.99,
    decimales: 2,
    sufijo: '',
  });
});

test('desglosarNumero maneja números enteros sin prefijo ni sufijo', () => {
  const res = desglosarNumero('7');
  assert.deepEqual(res, {
    prefijo: '',
    numero: 7,
    decimales: 0,
    sufijo: '',
  });
});

test('desglosarNumero extrae prefijos como + y sufijos de texto', () => {
  const res = desglosarNumero('+400 pacientes');
  assert.deepEqual(res, {
    prefijo: '+',
    numero: 400,
    decimales: 0,
    sufijo: ' pacientes',
  });

  const porcentaje = desglosarNumero('98.5%');
  assert.deepEqual(porcentaje, {
    prefijo: '',
    numero: 98.5,
    decimales: 1,
    sufijo: '%',
  });
});

test('desglosarNumero descarta valores no operables como conteo simple (ej: 24/7)', () => {
  assert.equal(desglosarNumero('24/7'), null);
  assert.equal(desglosarNumero('Texto sin número'), null);
  assert.equal(desglosarNumero(''), null);
});

test('calcularFotogramasContador genera frames a 30 fps con duración máxima de 1 segundo', () => {
  const frames = calcularFotogramasContador('$14.99', { fps: 30, duracionMax: 1.0 });
  assert.ok(frames !== null);
  assert.equal(frames.length, 31); // frame 0 hasta frame 30 inclusive (1 segundo)

  // Frame 0 empieza en 0 con formato
  assert.equal(frames[0].tiempo, 0);
  assert.equal(frames[0].texto, '$0.00');

  // Fotograma final dura exactamente 1 segundo y es el literal exacto
  const ultimo = frames[frames.length - 1];
  assert.equal(ultimo.tiempo, 1.0);
  assert.equal(ultimo.texto, '$14.99');

  // Los intermedios están ordenados y tienen 2 decimales
  for (let i = 1; i < frames.length - 1; i++) {
    assert.match(frames[i].texto, /^\$\d+\.\d{2}$/);
    assert.ok(frames[i].tiempo > frames[i - 1].tiempo);
  }
});

test('el último fotograma del contador es LITERALMENTE el string original recibido', () => {
  // Caso de valor con espacios o signos especiales que podrían perderse en formateo numérico
  const valorOriginal = '  $14.99  ';
  const frames = calcularFotogramasContador(valorOriginal);
  assert.ok(frames !== null);
  assert.equal(frames[frames.length - 1].texto, valorOriginal);
});

test('calcularFotogramasContador para enteros no incluye decimales intermedios', () => {
  const frames = calcularFotogramasContador('7', { fps: 30, duracionMax: 0.5 });
  assert.ok(frames !== null);
  assert.equal(frames[0].texto, '0');
  assert.equal(frames[frames.length - 1].texto, '7');

  for (const frame of frames) {
    assert.doesNotMatch(frame.texto, /\./);
  }
});

test('calcularFotogramasContador devuelve null si el valor no es operable', () => {
  assert.equal(calcularFotogramasContador('24/7'), null);
});
