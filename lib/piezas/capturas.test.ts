import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AVISO, cargarCaptura, medidasAviso } from './capturas.ts';

test('el texto del aviso es exacto, con raya larga y no guion', () => {
  assert.equal(AVISO, 'Datos de paciente ficticios — sistema de demostración');
  assert.ok(AVISO.includes('—'), 'debe llevar raya larga U+2014');
  assert.ok(!AVISO.includes(' - '), 'no debe llevar guion suelto');
});

test('sin limite de ancho, manda la proporcion del video original', () => {
  // 6,1% del alto y 2,7% del alto.
  assert.deepEqual(medidasAviso(1350), { alto: 82, fuente: 36 });
  // Se trunca en vez de redondear, para que nunca desborde por un pixel.
  assert.deepEqual(medidasAviso(1920), { alto: 117, fuente: 51 });
});

test('con el ancho de la pieza, el aviso se encoge para caber en una linea', () => {
  // 904 px es el ancho util de una pieza de 1080 con margen de 88.
  const m = medidasAviso(1350, 904);
  assert.ok(m.fuente < 36, 'debe encoger respecto a la proporcion por alto');
  // El texto completo tiene que caber holgado.
  assert.ok(m.fuente * AVISO.length * 0.62 <= 904, 'sigue sin caber en una linea');
});

test('la barra crece si hace falta para que el texto respire', () => {
  const m = medidasAviso(1350, 904);
  assert.ok(m.alto >= m.fuente * 2, 'la barra debe dar aire al texto');
});

test('la captura se carga como data URI, que es lo unico que satori entiende', () => {
  const uri = cargarCaptura('validar-receta.png');
  assert.ok(uri.startsWith('data:image/png;base64,'));
  assert.ok(uri.length > 1000, 'parece vacia');
});

test('una captura que no existe falla nombrando el archivo', () => {
  assert.throws(() => cargarCaptura('no-existe.png'), /no-existe\.png/);
});
