// lib/reels/guion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarGuion, leerRespuesta, llamarGemini, promptGuion } from './guion.ts';
import type { Pieza } from '../piezas/tipos.ts';

const pieza: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  producto: 'pukaia',
  caption: 'Caption del carrusel',
  slides: [
    { titular: 'No es un chatbot' },
    { titular: 'Un CRM recuerda', bajada: 'Cada conversación es un cliente.' },
  ],
};

test('el prompt pide un párrafo por slide y da los hechos del producto', () => {
  const prompt = promptGuion(pieza);
  assert.match(prompt, /Exactamente 2 párrafos/);
  assert.match(prompt, /\$14\.99/);
  assert.match(prompt, /Caption del carrusel/);
  assert.ok(!prompt.includes('AFIRMACIONES PROHIBIDAS'), 'PukaIA no lleva las de PukaHealth');
});

test('a PukaHealth le llegan las afirmaciones prohibidas', () => {
  const salud: Pieza = { ...pieza, sistema: 'health', producto: 'pukahealth' };
  assert.match(promptGuion(salud), /AFIRMACIONES PROHIBIDAS/);
});

test('lee el JSON aunque venga dentro de un bloque de código', () => {
  // La valla se construye en vez de escribirse: este plan también es markdown.
  const valla = '`'.repeat(3);
  const respuesta = `${valla}json\n{"guion": "Uno.\\n\\nDos.", "caption": "C"}\n${valla}`;
  assert.deepEqual(leerRespuesta(respuesta), { guion: 'Uno.\n\nDos.', caption: 'C' });
});

test('una respuesta sin guion, sin caption, o que no es JSON, falla: no hay respaldo', () => {
  assert.throws(() => leerRespuesta('{"caption": "C"}'), /sin guion o sin caption/);
  // Las dos mitades, no una: sin esta, borrar la comprobación del caption no
  // rompe ningún test. Lo destapó la mutación de la Task 6.
  assert.throws(() => leerRespuesta('{"guion": "Uno.\\n\\nDos."}'), /sin guion o sin caption/);
  assert.throws(() => leerRespuesta('Aquí tienes tu guion: ...'), /JSON válido/);
});

test('generarGuion le pasa el prompt al modelo y devuelve lo que leyó', async () => {
  let recibido = '';
  const generado = await generarGuion(pieza, async (prompt) => {
    recibido = prompt;
    return '{"guion": "A.\\n\\nB.", "caption": "C"}';
  });
  assert.equal(recibido, promptGuion(pieza));
  assert.deepEqual(generado, { guion: 'A.\n\nB.', caption: 'C' });
});

test('sin API_KEY la llamada real falla al llamarla, no al construirla', async () => {
  const llamar = llamarGemini(undefined);
  await assert.rejects(() => llamar('lo que sea'), /Falta API_KEY/);
});
