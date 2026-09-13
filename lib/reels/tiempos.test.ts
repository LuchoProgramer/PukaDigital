// lib/reels/tiempos.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escenasDesde, subtitulosDe } from './tiempos.ts';

test('las escenas se encadenan: cada una empieza donde acaba la anterior', () => {
  const { escenas, total } = escenasDesde(['Uno dos.', 'Tres cuatro.', 'Cinco.'], [2, 3, 1.5]);
  assert.deepEqual(
    escenas.map((e) => [e.inicio, e.duracion, e.voz]),
    [
      [0, 2.7, 0.3], // 0,3 de entrada + 2 de voz + 0,4 de pausa
      [2.7, 3.4, 2.7], // 3 de voz + 0,4 de pausa
      [6.1, 2.3, 6.1], // 1,5 de voz + 0,8 de cola
    ],
  );
  assert.equal(total, 8.4);
});

test('los párrafos y los audios tienen que coincidir', () => {
  assert.throws(() => escenasDesde(['a', 'b'], [1]), /2 párrafos y 1 audios/);
});

test('los subtítulos cubren la voz entera, sin huecos ni solapes', () => {
  const subs = subtitulosDe('Un chatbot responde. Un CRM te dice a quién llamar mañana.', 1, 4);
  assert.equal(subs[0].inicio, 1);
  assert.equal(subs[subs.length - 1].fin, 5);
  for (let i = 1; i < subs.length; i++) assert.equal(subs[i].inicio, subs[i - 1].fin);
});

test('los grupos cortan a las 4 palabras o donde cierra una idea', () => {
  const subs = subtitulosDe('Un chatbot responde. Un CRM te dice a quién llamar mañana.', 0, 4);
  assert.deepEqual(subs.map((s) => s.texto), [
    'Un chatbot responde.',
    'Un CRM te dice',
    'a quién llamar mañana.',
  ]);
});

test('una enumeración no deja palabras sueltas en pantalla', () => {
  // El fotograma 2 del ensayo del paso 0 mostraba un subtítulo que decía
  // «reportes.» y nada más. Ni las comas cortan, ni una cola queda sola.
  const subs = subtitulosDe(
    'Inbox centralizado, pipeline en Kanban, ficha de cliente y reportes. El bot es una parte.',
    0,
    8,
  );
  assert.deepEqual(subs.map((s) => s.texto), [
    'Inbox centralizado, pipeline en',
    'Kanban, ficha de cliente',
    'y reportes.',
    'El bot es una parte.',
  ]);
});

test('pero una frase de una sola palabra sí es un subtítulo', () => {
  assert.deepEqual(subtitulosDe('Sí. Extraordinariamente.', 0, 10).map((s) => s.texto), [
    'Sí.',
    'Extraordinariamente.',
  ]);
});

test('una palabra larga recibe más tiempo que una corta', () => {
  const [corto, largo] = subtitulosDe('Sí. Extraordinariamente.', 0, 10);
  assert.ok(largo.fin - largo.inicio > corto.fin - corto.inicio);
});

test('sin palabras o sin duración no hay subtítulos', () => {
  assert.deepEqual(subtitulosDe('   ', 0, 3), []);
  assert.deepEqual(subtitulosDe('Hola', 0, 0), []);
});
