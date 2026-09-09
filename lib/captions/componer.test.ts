import { test } from 'node:test';
import assert from 'node:assert/strict';
import { componer } from './componer.ts';
import type { Pieza } from '../piezas/tipos.ts';

test('compone un caption con titulares y bajadas separadas por bloque', () => {
  const pieza: Pieza = {
    id: 'test-simple',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [
      { titular: 'Primer titular', bajada: 'Primera bajada explicativa.' },
      { titular: 'Segundo titular', bajada: 'Segunda bajada explicativa.' },
    ],
  };

  const esperado =
    'Primer titular\n' +
    'Primera bajada explicativa.\n\n' +
    'Segundo titular\n' +
    'Segunda bajada explicativa.\n\n' +
    'pukadigital.com/ledgerxpertz';

  assert.equal(componer(pieza), esperado);
});

test('anexa valor y etiqueta de dato al titular con guion largo', () => {
  const pieza: Pieza = {
    id: 'test-dato',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [
      {
        titular: 'Pruébalo un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Sin tarjeta para empezar.',
      },
    ],
  };

  const esperado =
    'Pruébalo un mes — $14.99 al mes\n' +
    'Sin tarjeta para empezar.\n\n' +
    'pukadigital.com/agentes-ia';

  assert.equal(componer(pieza), esperado);
});

test('cierra con pukadigital.com para piezas de utilidad sin producto', () => {
  const pieza: Pieza = {
    id: 'requisitos-facturar-sri',
    sistema: 'puka',
    slides: [
      { titular: 'Cuatro cosas', bajada: 'Lo que te pide el SRI.' },
    ],
  };

  const esperado =
    'Cuatro cosas\n' +
    'Lo que te pide el SRI.\n\n' +
    'pukadigital.com';

  assert.equal(componer(pieza), esperado);
});

test('omite la bajada en slides que solo tienen titular', () => {
  const pieza: Pieza = {
    id: 'test-sin-bajada',
    sistema: 'puka',
    slides: [
      { titular: 'Solo titular' },
      { titular: 'Otro titular', bajada: 'Con bajada.' },
    ],
  };

  const esperado =
    'Solo titular\n\n' +
    'Otro titular\n' +
    'Con bajada.\n\n' +
    'pukadigital.com';

  assert.equal(componer(pieza), esperado);
});

test('no incluye hashtags en ningún lugar del texto compuesto', () => {
  const pieza: Pieza = {
    id: 'test-no-hashtags',
    sistema: 'health',
    producto: 'pukahealth',
    caption: 'Texto de Instagram con #salud #medicina',
    slides: [
      { titular: 'Titular de salud', bajada: 'Bajada de salud.' },
    ],
  };

  const resultado = componer(pieza);
  assert.ok(!resultado.includes('#'));
});

test('coincide exactamente con el texto de muestra de la spec para crm-no-chatbot', () => {
  const pieza: Pieza = {
    id: 'crm-no-chatbot',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [
      {
        badge: 'CRM PARA WHATSAPP',
        titular: 'No es un chatbot',
        bajada: 'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.',
      },
      {
        titular: 'Un bot contesta y ya',
        bajada:
          'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ' +
          'ni qué quería.',
      },
      {
        titular: 'Un CRM recuerda',
        bajada:
          'Cada conversación es un cliente con historial, etapa y siguiente paso. ' +
          'Sabes a quién llamar sin buscar en el chat.',
      },
      {
        titular: 'Qué incluye',
        bajada:
          'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e ' +
          'integraciones. El bot es una parte.',
      },
      {
        titular: 'Pruébalo un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Sin tarjeta para empezar.',
        cta: 'Escríbenos',
      },
    ],
  };

  const esperado =
    'No es un chatbot\n' +
    'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.\n\n' +
    'Un bot contesta y ya\n' +
    'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ' +
    'ni qué quería.\n\n' +
    'Un CRM recuerda\n' +
    'Cada conversación es un cliente con historial, etapa y siguiente paso. ' +
    'Sabes a quién llamar sin buscar en el chat.\n\n' +
    'Qué incluye\n' +
    'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e ' +
    'integraciones. El bot es una parte.\n\n' +
    'Pruébalo un mes — $14.99 al mes\n' +
    'Sin tarjeta para empezar.\n\n' +
    'pukadigital.com/agentes-ia';

  assert.equal(componer(pieza), esperado);
});

/**
 * Los dos que siguen cubren un hueco que dejó el plan: `bloqueDeSlide` limpia la
 * bajada en dos sitios —descarta la que solo tiene espacios y recorta la que
 * viene con ellos— y ninguna de las dos limpiezas tenía test. Se pueden borrar
 * las dos y la suite del plan sigue verde, comprobado por mutación el
 * 2026-09-09. Una bajada asi llega escribiendo el calendario a mano, que es
 * como se escribe.
 */
test('una bajada que solo son espacios se descarta, no deja una linea vacia', () => {
  const pieza: Pieza = {
    id: 'bajada-en-blanco',
    sistema: 'puka',
    slides: [{ titular: 'Solo titular', bajada: '   ' }],
  };
  assert.equal(componer(pieza), 'Solo titular\n\npukadigital.com');
});

test('la bajada se recorta: los espacios de los bordes no llegan al caption', () => {
  const pieza: Pieza = {
    id: 'bajada-con-espacios',
    sistema: 'puka',
    slides: [{ titular: 'Un titular', bajada: '  Una bajada con espacios.  ' }],
  };
  assert.equal(componer(pieza), 'Un titular\nUna bajada con espacios.\n\npukadigital.com');
});
