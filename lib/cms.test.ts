import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bloqueAMarkdown, BloqueCMS } from './cms.ts';

test('bloqueAMarkdown: heading "Por qué todos los chatbots olvidan" -> "## Por qué todos los chatbots olvidan"', () => {
  const bloque: BloqueCMS = {
    type: 'text',
    style: 'heading',
    content: 'Por qué todos los chatbots olvidan',
  };
  assert.equal(bloqueAMarkdown(bloque), '## Por qué todos los chatbots olvidan');
});

test('bloqueAMarkdown: subheading \'1. El problema: El costo de oportunidad de un "Hola"\\n\' -> empieza con "### 1. El problema" y no tiene \\n final', () => {
  const bloque: BloqueCMS = {
    type: 'text',
    style: 'subheading',
    content: '1. El problema: El costo de oportunidad de un "Hola"\n',
  };
  const resultado = bloqueAMarkdown(bloque);
  assert.ok(resultado.startsWith('### 1. El problema'));
  assert.ok(!resultado.endsWith('\n'));
  assert.equal(resultado, '### 1. El problema: El costo de oportunidad de un "Hola"');
});

test('bloqueAMarkdown: subheading que ya empieza con "## " -> no se duplica el #', () => {
  const bloque: BloqueCMS = {
    type: 'text',
    style: 'subheading',
    content: '## Ya tiene numeral',
  };
  const resultado = bloqueAMarkdown(bloque);
  assert.equal(resultado, '## Ya tiene numeral');
});

test('bloqueAMarkdown: list-bullet "A\\nB\\n\\n" -> "- A\\n- B"', () => {
  const bloque: BloqueCMS = {
    type: 'text',
    style: 'list-bullet',
    content: 'A\nB\n\n',
  };
  assert.equal(bloqueAMarkdown(bloque), '- A\n- B');
});

test('bloqueAMarkdown: list-number "A\\nB" -> "1. A\\n1. B"', () => {
  const bloque: BloqueCMS = {
    type: 'text',
    style: 'list-number',
    content: 'A\nB',
  };
  assert.equal(bloqueAMarkdown(bloque), '1. A\n1. B');
});

test('bloqueAMarkdown: quote contiene <blockquote> y callout contiene <aside class="callout">', () => {
  const quoteBloque: BloqueCMS = {
    type: 'text',
    style: 'quote',
    content: 'Cita destacada',
  };
  const calloutBloque: BloqueCMS = {
    type: 'text',
    style: 'callout',
    content: 'Texto de aviso',
  };
  assert.ok(bloqueAMarkdown(quoteBloque).includes('<blockquote>'));
  assert.ok(bloqueAMarkdown(quoteBloque).includes('Cita destacada'));
  assert.ok(bloqueAMarkdown(calloutBloque).includes('<aside class="callout">'));
  assert.ok(bloqueAMarkdown(calloutBloque).includes('Texto de aviso'));
});

test('bloqueAMarkdown: paragraph y sin style -> contenido intacto', () => {
  const parrafo: BloqueCMS = {
    type: 'text',
    style: 'paragraph',
    content: 'Este es un párrafo normal.',
  };
  const sinEstilo: BloqueCMS = {
    type: 'text',
    content: 'Texto sin estilo asignado.',
  };
  assert.equal(bloqueAMarkdown(parrafo), 'Este es un párrafo normal.');
  assert.equal(bloqueAMarkdown(sinEstilo), 'Texto sin estilo asignado.');
});
