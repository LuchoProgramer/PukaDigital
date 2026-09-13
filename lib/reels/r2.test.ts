// lib/reels/r2.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { argumentosSubida, claveReel, urlReel } from './r2.ts';

test('la clave lleva el mes, el id y 8 caracteres del hash del MP4', () => {
  assert.equal(
    claveReel('2026-10', 'crm-no-chatbot', new TextEncoder().encode('hola')),
    'reels/2026-10/crm-no-chatbot-b221d9db.mp4',
  );
});

test('otro MP4 da otra clave: re-renderizar nunca pisa la URL publicada', () => {
  const uno = claveReel('2026-10', 'x', new TextEncoder().encode('render 1'));
  const dos = claveReel('2026-10', 'x', new TextEncoder().encode('render 2'));
  assert.notEqual(uno, dos);
});

test('la URL une base y clave con una sola barra, y se sube con wrangler en remoto', () => {
  assert.equal(
    urlReel('https://reels.pukadigital.com/', 'reels/2026-10/x-1a2b3c4d.mp4'),
    'https://reels.pukadigital.com/reels/2026-10/x-1a2b3c4d.mp4',
  );
  assert.deepEqual(argumentosSubida('pukadigital-reels', 'reels/2026-10/x.mp4', '/tmp/reel.mp4'), [
    'wrangler', 'r2', 'object', 'put', 'pukadigital-reels/reels/2026-10/x.mp4',
    '--file', '/tmp/reel.mp4', '--remote', '--content-type', 'video/mp4',
  ]);
});
