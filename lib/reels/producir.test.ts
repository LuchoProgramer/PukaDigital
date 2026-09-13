// lib/reels/producir.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { producirReel, type Dependencias } from './producir.ts';
import type { Pieza } from '../piezas/tipos.ts';

const PIEZA: Pieza = {
  id: 'crm-no-chatbot',
  sistema: 'puka',
  producto: 'pukaia',
  caption: 'Caption del carrusel',
  slides: [{ titular: 'No es un chatbot' }, { titular: 'Un CRM recuerda' }],
};

const GUION = 'Un chatbot responde lo que le preguntas y ya.\n\nUn CRM recuerda quién eres y qué querías.';
const CON_GUION: Pieza = { ...PIEZA, reel: { guion: GUION, caption: 'Caption del Reel' } };

const PROBE = JSON.stringify({
  streams: [
    { codec_type: 'video', codec_name: 'h264', width: 1080, height: 1920, pix_fmt: 'yuv420p', r_frame_rate: '30/1' },
    { codec_type: 'audio', codec_name: 'aac', sample_rate: '48000', channels: 2 },
  ],
  format: { duration: '9.84', size: '2000000' },
});

function dependencias(extra: Partial<Dependencias> = {}) {
  const comandos: string[] = [];
  const archivos = new Map<string, string>();
  const avisos: string[] = [];
  const base: Dependencias = {
    ejecutar: async (comando, argumentos) => {
      comandos.push([comando, ...argumentos.slice(0, 3)].join(' '));
      if (comando === 'ffprobe' && argumentos.includes('format=duration')) return { stdout: '3.2\n', stderr: '' };
      if (comando === 'ffprobe') return { stdout: PROBE, stderr: '' };
      return { stdout: '', stderr: '' };
    },
    llamarModelo: async () => {
      throw new Error('no debería llamar al modelo');
    },
    leerArchivo: () => new TextEncoder().encode('hola'),
    escribirArchivo: (ruta, contenido) => {
      archivos.set(ruta, contenido);
    },
    crearCarpeta: () => '/tmp/reel-prueba',
    gsap: '/* gsap */',
    fuentes: [],
    cargarCaptura: () => 'data:image/png;base64,X',
    r2: { bucket: 'pukadigital-reels', baseUrl: 'https://reels.pukadigital.com' },
    regenerarGuion: false,
    avisar: (mensaje) => {
      avisos.push(mensaje);
    },
    ...extra,
  };
  return { d: base, comandos, archivos, avisos };
}

test('con guion escrito no llama al modelo, y produce en orden: voz, medida, render, normalizar, verificar y subir', async () => {
  const { d, comandos } = dependencias();
  await producirReel(CON_GUION, '2026-10', d);
  assert.deepEqual(comandos, [
    'npx -y hyperframes@0.8.36 tts',
    'ffprobe -v error -show_entries',
    'npx -y hyperframes@0.8.36 tts',
    'ffprobe -v error -show_entries',
    'npx -y hyperframes@0.8.36 render',
    'ffmpeg -y -i render.mp4',
    'ffprobe -v error -print_format',
    'npx wrangler r2 object',
  ]);
});

test('sin guion se lo pide al modelo, y si no pasa la validación no renderiza nada', async () => {
  const { d, comandos } = dependencias({
    llamarModelo: async () => '{"guion": "Un solo parrafo no alcanza para dos slides de esta pieza.", "caption": "C"}',
  });
  await assert.rejects(() => producirReel(PIEZA, '2026-10', d), /párrafos y 2 slides/);
  assert.deepEqual(comandos, []);
});

test('--regenerar-guion ignora el guion escrito y vuelve a pedirlo', async () => {
  let llamado = false;
  const { d } = dependencias({
    regenerarGuion: true,
    llamarModelo: async () => {
      llamado = true;
      return JSON.stringify({ guion: GUION, caption: 'Otro caption' });
    },
  });
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.ok(llamado);
  assert.equal(reel.caption, 'Otro caption');
});

test('si el MP4 no cumple lo que exige Meta, no se sube nada', async () => {
  const malo = PROBE.replace('"48000"', '"24000"');
  const comandos: string[] = [];
  const { d } = dependencias({
    ejecutar: async (comando, argumentos) => {
      comandos.push([comando, ...argumentos.slice(0, 3)].join(' '));
      if (comando === 'ffprobe' && argumentos.includes('format=duration')) return { stdout: '3.2\n', stderr: '' };
      if (comando === 'ffprobe') return { stdout: malo, stderr: '' };
      return { stdout: '', stderr: '' };
    },
  });
  await assert.rejects(() => producirReel(CON_GUION, '2026-10', d), /48000/);
  assert.ok(!comandos.some((c) => c.includes('wrangler')));
});

test('el resultado trae la URL con el hash del MP4 y la duración del render', async () => {
  const { d } = dependencias();
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.equal(reel.video, 'https://reels.pukadigital.com/reels/2026-10/crm-no-chatbot-b221d9db.mp4');
  assert.equal(reel.duracion, 9.8);
  assert.equal(reel.archivo, '/tmp/reel-prueba/reel.mp4');
});

test('en ensayo, sin R2, renderiza y verifica pero no sube nada', async () => {
  const { d, comandos, avisos } = dependencias({ r2: undefined });
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.equal(reel.video, '');
  assert.ok(!comandos.some((c) => c.includes('wrangler')));
  assert.ok(avisos.some((a) => a.includes('Ensayo')));
});

test('si Telegram falla, el reel se entrega igual y queda el aviso', async () => {
  const { d, avisos } = dependencias({
    telegram: { token: 't', chatId: '1' },
    enviar: async () => {
      throw new Error('chat not found');
    },
  });
  const reel = await producirReel(CON_GUION, '2026-10', d);
  assert.ok(reel.video.startsWith('https://'));
  assert.ok(avisos.some((a) => a.includes('chat not found')));
});

test('la composición se escribe en la carpeta del render, con la voz de cada párrafo y GSAP al lado', async () => {
  const { d, archivos } = dependencias();
  await producirReel(CON_GUION, '2026-10', d);
  const html = archivos.get('/tmp/reel-prueba/index.html') ?? '';
  assert.match(html, /<audio id="voz-1" src="voz-1.wav"/);
  // GSAP como archivo hermano, no en línea: si no, `render --strict` aborta.
  assert.equal(archivos.get('/tmp/reel-prueba/gsap.min.js'), '/* gsap */');
  assert.match(html, /<script src="gsap\.min\.js"><\/script>/);
});
