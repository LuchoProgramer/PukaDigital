import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PAUSA_ENTRE_ESCENAS, type Escena } from './tiempos.ts';
import { ENERGIAS, coreografiaReel } from './movimiento.ts';
import type { Pieza } from '../piezas/tipos.ts';

const piezaBase: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  slides: [
    {
      badge: 'CRM VS CHATBOT',
      titular: 'PukaIA es un CRM, no un chatbot',
      bajada: 'Muchos piensan que automatizar es solo poner un bot.',
    },
    {
      titular: 'Validar recetas podológicas',
      captura: 'receta.png',
      foco: { x: 0.3, y: 0.63, escala: 2 },
    },
    {
      titular: 'Planes desde $14.99 al mes',
      dato: { valor: '$14.99', etiqueta: 'al mes' },
    },
  ],
};

const escenasBase: Escena[] = [
  {
    indice: 0,
    inicio: 0,
    duracion: 4.5,
    voz: 0.3,
    subtitulos: [
      { texto: 'PukaIA es un CRM', inicio: 0.3, fin: 1.8 },
      { texto: 'no un chatbot.', inicio: 1.9, fin: 4.1 },
    ],
  },
  {
    indice: 1,
    inicio: 4.5,
    duracion: 5.0,
    voz: 4.8,
    subtitulos: [{ texto: 'Valida tus recetas.', inicio: 4.8, fin: 8.8 }],
  },
  {
    indice: 2,
    inicio: 9.5,
    duracion: 4.0,
    voz: 9.8,
    subtitulos: [{ texto: 'Desde catorce noventa y nueve.', inicio: 9.8, fin: 13.0 }],
  },
];

test('la duración de salida de escena nunca supera PAUSA_ENTRE_ESCENAS en ningún sistema', () => {
  assert.ok(ENERGIAS.puka.salidaDuracion <= PAUSA_ENTRE_ESCENAS);
  assert.ok(ENERGIAS.health.salidaDuracion <= PAUSA_ENTRE_ESCENAS);
});

test('fotograma 0: la primera escena arranca con titular y badge visibles en t=0', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  // Comprueba que en t=0 se inicializa #c0 y sus palabras con opacidad 1
  assert.match(script, /tl\.set\('#c0',\s*\{[^}]*opacity:\s*1/);
  assert.match(script, /tl\.set\('#c0 \.palabra',\s*\{[^}]*opacity:\s*1/);
  assert.match(script, /tl\.set\('#c0 \.badge',\s*\{[^}]*opacity:\s*1/);
});

test('escenas posteriores a la primera tienen animación de entrada en su tiempo de inicio', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  // Escena 1 empieza en t=4.5
  assert.match(script, /tl\.fromTo\('#c1',/);
  assert.match(script, /4\.5\);/);
});

test('transición de salida termina justo donde empieza la escena siguiente', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  // Escena 0 dura 4.5s. Con salidaDuracion=0.3s, la salida arranca en 4.5 - 0.3 = 4.2s
  assert.match(script, /tl\.to\('#c0',\s*\{[^}]*scale:\s*1\.4[^}]*blur\(30px\)[^}]*\}, 4\.2\);/);
});

test('subtítulos son independientes de la animación del contenedor y no reciben blur de escena', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  // Los subtítulos tienen sus propios selectores #s{i}-{j} y animan escala/opacidad independientemente
  assert.match(script, /tl\.fromTo\('#s0-0',/);
  assert.match(script, /tl\.set\('#s0-0',\s*\{ opacity: 0 \},\s*1\.8\);/);
});

test('subtítulos en PukaHealth usan suavizado sine sin rebote brusco', () => {
  const piezaHealth: Pieza = {
    ...piezaBase,
    sistema: 'health',
  };
  const script = coreografiaReel(piezaHealth, escenasBase, 13.8);
  assert.match(script, /ease:\s*'sine\.out'/);
});

test('la captura con foco anima scale y transformOrigin hacia las coordenadas configuradas', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  // Escena 1 tiene foco: { x: 0.3, y: 0.63, escala: 2 }
  // A los 2s tras inicio de escena 1 (4.5 + 2 = 6.5s)
  assert.match(script, /tl\.to\('#cap-1',\s*\{[^}]*scale:\s*2,[^}]*transformOrigin:\s*'30% 63%'[^}]*\}, 6\.5\);/);
});

test('la captura sin foco aplica zoom lento continuo', () => {
  const piezaSinFoco: Pieza = {
    ...piezaBase,
    slides: [
      piezaBase.slides[0],
      { titular: 'Captura normal', captura: 'normal.png' },
      piezaBase.slides[2],
    ],
  };
  const script = coreografiaReel(piezaSinFoco, escenasBase, 13.8);
  assert.match(script, /tl\.to\('#cap-1',\s*\{[^}]*scale:\s*1\.15,[^}]*ease:\s*'none'/);
});

test('el dato con número operable genera fotogramas deterministas del contador', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  // Escena 2 tiene dato '$14.99'. Debe contener llamadas tl.set para los frames intermedios y el literal final
  assert.match(script, /tl\.set\('#c2 \.dato-valor',\s*\{ textContent:\s*'\$0\.00' \}/);
  assert.match(script, /tl\.set\('#c2 \.dato-valor',\s*\{ textContent:\s*'\$14\.99' \}/);
});

test('el brillo de fondo usa repeticiones finitas y no repeat: -1', () => {
  const script = coreografiaReel(piezaBase, escenasBase, 13.8);

  assert.doesNotMatch(script, /repeat:\s*-1/);
  assert.match(script, /#brillo-fondo/);
});
