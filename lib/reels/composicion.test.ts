// lib/reels/composicion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AVISO, FONDO_AVISO } from '../piezas/capturas.ts';
import { sistemas } from '../piezas/sistemas.ts';
import { ALTO, ANCHO, TEXTO_AVISO, VIDRIO_VIDEO, composicion, escapar, type EntradaComposicion } from './composicion.ts';
import { escenasDesde } from './tiempos.ts';
import type { Pieza } from '../piezas/tipos.ts';

const pieza: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  producto: 'pukaia',
  slides: [
    { badge: 'CRM PARA WHATSAPP', titular: 'No es un chatbot', bajada: 'Y la diferencia se nota.' },
    { titular: 'Un CRM recuerda', dato: { valor: '$14.99', etiqueta: 'al mes' }, captura: 'validar-receta.png' },
  ],
};

const PARRAFOS = ['Un chatbot responde y ya.', 'Un CRM recuerda quién eres.'];

function entrada(extra: Partial<EntradaComposicion> = {}): EntradaComposicion {
  const { escenas, total } = escenasDesde(PARRAFOS, [2, 3.5]);
  return {
    pieza,
    escenas,
    total,
    audios: ['voz-0.wav', 'voz-1.wav'],
    gsapArchivo: 'gsap.min.js',
    fuentes: [],
    cargarCaptura: (archivo) => `data:image/png;base64,CAPTURA-${archivo}`,
    ...extra,
  };
}

test('la raíz declara el vertical, empieza en 0, dura lo que suman las escenas y registra su línea de tiempo', () => {
  const html = composicion(entrada());
  assert.match(
    html,
    /<div id="root" data-composition-id="reel-crm-no-chatbot" data-start="0" data-duration="7" data-width="1080" data-height="1920">/,
  );
  assert.match(html, /window\.__timelines\['reel-crm-no-chatbot'\] = tl;/);
  assert.equal(ANCHO * 16, ALTO * 9);
});

test('una escena por slide con sus tiempos, y la voz de cada una entra con su escena', () => {
  const html = composicion(entrada());
  assert.match(html, /<section id="escena-0" class="clip" data-start="0" data-duration="2.7"/);
  assert.match(html, /<section id="escena-1" class="clip" data-start="2.7" data-duration="4.3"/);
  assert.match(html, /<audio id="voz-0" src="voz-0.wav" data-start="0.3"/);
  assert.match(html, /<audio id="voz-1" src="voz-1.wav" data-start="2.7"/);
});

test('todos los colores salen de los tokens, del aviso o del vidrio de video', () => {
  for (const sistema of ['puka', 'health'] as const) {
    const html = composicion(entrada({ pieza: { ...pieza, sistema } }));
    const tokens = sistemas[sistema];
    const permitidos = new Set([
      tokens.fondo, tokens.tinta, tokens.acento, tokens.apoyo, tokens.borde, tokens.suave, tokens.glass,
      FONDO_AVISO, TEXTO_AVISO, VIDRIO_VIDEO.fondo, VIDRIO_VIDEO.borde,
    ]);
    const colores = html.match(/#[0-9A-Fa-f]{3,8}\b|rgba?\([^)]*\)/g) ?? [];
    assert.ok(colores.length > 0, 'el HTML tiene que llevar colores');
    for (const color of colores) {
      assert.ok(permitidos.has(color), `${color} no sale de ningún token (${sistema})`);
    }
  }
});

test('el aviso de datos ficticios va literal en la escena con captura, y solo en esa', () => {
  const html = composicion(entrada());
  assert.equal(html.split(AVISO).length - 1, 1);
  const escenaConCaptura = html.slice(html.indexOf('id="escena-1"'), html.indexOf('id="voz-0"'));
  assert.ok(escenaConCaptura.includes(AVISO));
  assert.ok(escenaConCaptura.includes('data:image/png;base64,CAPTURA-validar-receta.png'));
});

test('cada subtítulo aparece y desaparece en sus tiempos', () => {
  const datos = entrada();
  const html = composicion(datos);
  const primero = datos.escenas[0].subtitulos[0];
  assert.ok(html.includes(`tl.fromTo('#s0-0', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(2.2)' }, ${primero.inicio});`));
  assert.ok(html.includes(`tl.set('#s0-0', { opacity: 0 }, ${primero.fin});`));
});

test('el texto de las slides se escapa', () => {
  assert.equal(escapar('<b>"A" & B</b>'), '&lt;b&gt;&quot;A&quot; &amp; B&lt;/b&gt;');
  const conEtiqueta = composicion(entrada({ pieza: { ...pieza, slides: [{ titular: 'Uno <script>' }, pieza.slides[1]] } }));
  assert.ok(conEtiqueta.includes('&lt;script&gt;'));
});

test('el titular envuelve cada palabra con .palabra-wrapper y span.palabra', () => {
  const html = composicion(entrada());
  assert.match(html, /<span class="palabra-wrapper"><span class="palabra">No<\/span><\/span>/);
  assert.match(html, /<span class="palabra-wrapper"><span class="palabra">chatbot<\/span><\/span>/);
});

test('incluye el contenedor de brillo de fondo y la tarjeta con id para zoom', () => {
  const html = composicion(entrada());
  assert.ok(html.includes('<div id="brillo-fondo"></div>'));
  assert.ok(html.includes('id="cap-1"'));
});

test('nada se carga de la red: las fuentes van embebidas y GSAP es un archivo de al lado', () => {
  const html = composicion(entrada({
    fuentes: [{ name: 'Instrument Sans', weight: 400, style: 'normal', data: Buffer.from('fuente') }],
  }));
  assert.ok(!/\b(?:src|href)="https?:/.test(html), 'ningún recurso remoto');
  assert.ok(!/url\(https?:/.test(html), 'ninguna fuente remota');
  // GSAP va referenciado, no en línea: en línea el lint de HyperFrames lee su
  // `Math.random()` como código nuestro y aborta el render.
  assert.ok(html.includes('<script src="gsap.min.js"></script>'));
  assert.ok(!html.includes('<script>window.gsap'), 'GSAP nunca en línea');
  assert.match(html, /font-display: block/);
});

test('slides, escenas y audios tienen que coincidir', () => {
  assert.throws(() => composicion(entrada({ audios: ['voz-0.wav'] })), /tienen que coincidir/);
});
