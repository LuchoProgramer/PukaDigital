// lib/reels/bloque.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bloqueReel } from './bloque.ts';

test('el bloque se pega en el archivo del mes y vuelve a dar el mismo reel', () => {
  const reel = {
    guion: 'Uno dos.\n\nTres "cuatro".',
    caption: "Caption con 'comillas'",
    video: 'https://reels.pukadigital.com/reels/2026-10/x-1a2b3c4d.mp4',
    duracion: 24.3,
  };
  const leido = new Function(`return {${bloqueReel(reel)}}`)() as { reel: typeof reel };
  assert.deepEqual(leido.reel, reel);
});

test('el guion va un párrafo por línea, para leerlo en el PR', () => {
  const bloque = bloqueReel({ guion: 'Uno.\n\nDos.', caption: 'c', video: 'v', duracion: 3 });
  assert.match(bloque, /guion:\n {4}"Uno\.\\n\\n" \+\n {4}"Dos\.",/);
});
