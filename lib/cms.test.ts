import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bloqueAMarkdown, BloqueCMS, extraerFaqs, mapearPostCMS } from './cms.ts';
import { getFAQPageSchema } from './schema.ts';

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

test('extraerFaqs: sección «Preguntas frecuentes» (heading) + 3 preguntas subheading con <p>...</p> -> 3 pares, respuestas sin HTML', () => {
  const bloques: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'Preguntas frecuentes' },
    { type: 'text', style: 'subheading', content: '¿Qué es PukaIA?' },
    { type: 'text', style: 'paragraph', content: '<p>Es un CRM con IA para WhatsApp.</p>' },
    { type: 'text', style: 'subheading', content: '¿Tiene costo de instalación?' },
    { type: 'text', style: 'paragraph', content: '<p>No, la instalación es <strong>gratuita</strong>.</p>' },
    { type: 'text', style: 'subheading', content: '¿Puedo cancelar en cualquier momento?' },
    { type: 'text', style: 'paragraph', content: '<p>Sí, no hay contratos de permanencia.</p>' },
  ];

  const faqs = extraerFaqs(bloques);
  assert.equal(faqs.length, 3);
  assert.deepEqual(faqs, [
    { pregunta: '¿Qué es PukaIA?', respuesta: 'Es un CRM con IA para WhatsApp.' },
    { pregunta: '¿Tiene costo de instalación?', respuesta: 'No, la instalación es gratuita.' },
    { pregunta: '¿Puedo cancelar en cualquier momento?', respuesta: 'Sí, no hay contratos de permanencia.' },
  ]);
});

test('extraerFaqs: encabezado «PREGUNTAS FRECUENTES» y «preguntas frecuéntes» -> detectado; «FAQ» también', () => {
  const bloquesMayus: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'PREGUNTAS FRECUENTES' },
    { type: 'text', style: 'subheading', content: '¿Pregunta 1?' },
    { type: 'text', content: 'Respuesta 1' },
    { type: 'text', style: 'subheading', content: '¿Pregunta 2?' },
    { type: 'text', content: 'Respuesta 2' },
  ];
  assert.equal(extraerFaqs(bloquesMayus).length, 2);

  const bloquesTildes: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'preguntas frecuéntes' },
    { type: 'text', style: 'subheading', content: '¿Pregunta A?' },
    { type: 'text', content: 'Respuesta A' },
    { type: 'text', style: 'subheading', content: '¿Pregunta B?' },
    { type: 'text', content: 'Respuesta B' },
  ];
  assert.equal(extraerFaqs(bloquesTildes).length, 2);

  const bloquesFaq: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'FAQ' },
    { type: 'text', style: 'subheading', content: '¿Pregunta X?' },
    { type: 'text', content: 'Respuesta X' },
    { type: 'text', style: 'subheading', content: '¿Pregunta Y?' },
    { type: 'text', content: 'Respuesta Y' },
  ];
  assert.equal(extraerFaqs(bloquesFaq).length, 2);
});

test('extraerFaqs: una pregunta con dos párrafos -> respuesta con los dos, separados por un espacio', () => {
  const bloques: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'Preguntas frecuentes' },
    { type: 'text', style: 'subheading', content: '¿Cómo funciona el soporte?' },
    { type: 'text', content: '<p>Ofrecemos soporte técnico 24/7 vía WhatsApp.</p>' },
    { type: 'text', content: '<p>También contamos con sesiones 1 a 1 por Google Meet.</p>' },
    { type: 'text', style: 'subheading', content: '¿Dónde están ubicados?' },
    { type: 'text', content: 'En Quito, Ecuador.' },
  ];

  const faqs = extraerFaqs(bloques);
  assert.equal(faqs.length, 2);
  assert.equal(
    faqs[0].respuesta,
    'Ofrecemos soporte técnico 24/7 vía WhatsApp. También contamos con sesiones 1 a 1 por Google Meet.'
  );
});

test('extraerFaqs: pregunta sin respuesta -> se descarta', () => {
  const bloques: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'Preguntas frecuentes' },
    { type: 'text', style: 'subheading', content: '¿Pregunta sin respuesta?' },
    { type: 'text', style: 'subheading', content: '¿Pregunta con respuesta 1?' },
    { type: 'text', content: 'Esta sí tiene respuesta.' },
    { type: 'text', style: 'subheading', content: '¿Pregunta con respuesta 2?' },
    { type: 'text', content: 'Esta también tiene respuesta.' },
  ];

  const faqs = extraerFaqs(bloques);
  assert.equal(faqs.length, 2);
  assert.equal(faqs[0].pregunta, '¿Pregunta con respuesta 1?');
  assert.equal(faqs[1].pregunta, '¿Pregunta con respuesta 2?');
});

test('extraerFaqs: un heading sin ? después de las preguntas -> corta la sección; lo que sigue no entra', () => {
  const bloques: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'Preguntas frecuentes' },
    { type: 'text', style: 'subheading', content: '¿Pregunta 1?' },
    { type: 'text', content: 'Respuesta 1.' },
    { type: 'text', style: 'subheading', content: '¿Pregunta 2?' },
    { type: 'text', content: 'Respuesta 2.' },
    { type: 'text', style: 'heading', content: 'Conclusión y siguientes pasos' },
    { type: 'text', style: 'subheading', content: '¿Pregunta fuera de sección?' },
    { type: 'text', content: 'Respuesta fuera.' },
  ];

  const faqs = extraerFaqs(bloques);
  assert.equal(faqs.length, 2);
  assert.equal(faqs[0].pregunta, '¿Pregunta 1?');
  assert.equal(faqs[1].pregunta, '¿Pregunta 2?');
});

test('extraerFaqs: solo 1 par válido -> []', () => {
  const bloques: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'Preguntas frecuentes' },
    { type: 'text', style: 'subheading', content: '¿Única pregunta?' },
    { type: 'text', content: 'Única respuesta válida.' },
  ];

  const faqs = extraerFaqs(bloques);
  assert.deepEqual(faqs, []);
});

test('extraerFaqs: subheading con ? fuera de una sección FAQ -> no cuenta', () => {
  const bloques: BloqueCMS[] = [
    { type: 'text', style: 'heading', content: 'Introducción' },
    { type: 'text', style: 'subheading', content: '¿Por qué deberías automatizar?' },
    { type: 'text', content: 'Porque ahorra mucho tiempo.' },
    { type: 'text', style: 'subheading', content: '¿Cómo empezar hoy?' },
    { type: 'text', content: 'Registrándote en la plataforma.' },
  ];

  const faqs = extraerFaqs(bloques);
  assert.deepEqual(faqs, []);
});

test('mapearPostCMS: con updatedAt y bloques de FAQ, el resultado trae dateModified y faqs.length === 2', () => {
  const cmsPost = {
    id: 'post-123',
    title: 'Post de prueba',
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-13T15:28:43.189Z',
    slug: 'post-de-prueba',
    blocks: [
      { type: 'text', style: 'heading', content: 'Preguntas frecuentes' },
      { type: 'text', style: 'subheading', content: '¿Primera pregunta?' },
      { type: 'text', content: 'Primera respuesta.' },
      { type: 'text', style: 'subheading', content: '¿Segunda pregunta?' },
      { type: 'text', content: 'Segunda respuesta.' },
    ],
  };

  const post = mapearPostCMS(cmsPost);
  assert.equal(post.dateModified, '2026-04-13T15:28:43.189Z');
  assert.equal(post.faqs?.length, 2);
  assert.equal(post.faqs?.[0]?.pregunta, '¿Primera pregunta?');
  assert.equal(post.faqs?.[1]?.pregunta, '¿Segunda pregunta?');
});

test('getFAQPageSchema: genera estructura FAQPage con Question y acceptedAnswer', () => {
  const faqs = [
    { pregunta: '¿Pregunta 1?', respuesta: 'Respuesta 1' },
    { pregunta: '¿Pregunta 2?', respuesta: 'Respuesta 2' },
  ];
  const schema = getFAQPageSchema(faqs);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity.length, 2);
  assert.deepEqual(schema.mainEntity[0], {
    '@type': 'Question',
    name: '¿Pregunta 1?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Respuesta 1',
    },
  });
});


test('mapearPostCMS: la fecha del post es la de publicación, en hora de Ecuador, no la de creación', () => {
  const post = mapearPostCMS({
    id: 'x', title: 'T', slug: 't', createdAt: '2026-10-11T01:01:00.000Z', publishDate: '2026-10-20T09:00',
  });
  assert.equal(post.date, '2026-10-20T14:00:00.000Z');
});

test('mapearPostCMS: sin fecha de publicación, la fecha es la de creación', () => {
  const post = mapearPostCMS({ id: 'x', title: 'T', slug: 't', createdAt: '2026-10-11T01:01:00.000Z' });
  assert.equal(post.date, '2026-10-11T01:01:00.000Z');
});
