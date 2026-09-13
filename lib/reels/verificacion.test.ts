// lib/reels/verificacion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { argumentosNormalizar, erroresDeVideo, type Ffprobe } from './verificacion.ts';

type Pista = Ffprobe['streams'][number];

const BUENO: Ffprobe = {
  streams: [
    { codec_type: 'video', codec_name: 'h264', width: 1080, height: 1920, pix_fmt: 'yuv420p', r_frame_rate: '30/1' },
    { codec_type: 'audio', codec_name: 'aac', sample_rate: '48000', channels: 2 },
  ],
  format: { duration: '24.500000', size: '6200000' },
};

const con = (video: Partial<Pista> = {}, audio: Partial<Pista> = {}, format: Partial<Ffprobe['format']> = {}): Ffprobe => ({
  streams: [{ ...BUENO.streams[0], ...video }, { ...BUENO.streams[1], ...audio }],
  format: { ...BUENO.format, ...format },
});

test('un MP4 que cumple no da errores', () => {
  assert.deepEqual(erroresDeVideo(BUENO), []);
});

test('el video va en h264, 1080×1920, yuv420p y de 23 a 60 fps', () => {
  assert.equal(erroresDeVideo(con({ codec_name: 'hevc' })).length, 1);
  assert.equal(erroresDeVideo(con({ width: 1920, height: 1080 })).length, 1);
  assert.equal(erroresDeVideo(con({ pix_fmt: 'yuv444p' })).length, 1);
  assert.equal(erroresDeVideo(con({ r_frame_rate: '120/1' })).length, 1);
  assert.deepEqual(erroresDeVideo(con({ r_frame_rate: '30000/1001' })), []);
});

test('el audio va en aac a 48 kHz y en 1 o 2 canales', () => {
  assert.match(erroresDeVideo(con({}, { sample_rate: '24000' }))[0], /48000/);
  assert.equal(erroresDeVideo(con({}, { codec_name: 'mp3' })).length, 1);
  assert.equal(erroresDeVideo(con({}, { channels: 6 })).length, 1);
});

test('sin pista de audio no pasa: el Reel lleva voz', () => {
  assert.deepEqual(erroresDeVideo({ ...BUENO, streams: [BUENO.streams[0]] }), [
    'no hay pista de audio: el Reel lleva voz',
  ]);
});

test('dura de 3 a 90 segundos y pesa hasta 300 MB', () => {
  assert.deepEqual(erroresDeVideo(con({}, {}, { duration: '3' })), []);
  assert.deepEqual(erroresDeVideo(con({}, {}, { duration: '90' })), []);
  assert.equal(erroresDeVideo(con({}, {}, { duration: '90.1' })).length, 1);
  assert.equal(erroresDeVideo(con({}, {}, { size: String(301 * 1024 * 1024) })).length, 1);
});

test('la normalización no recodifica el video y deja el índice delante', () => {
  const args = argumentosNormalizar('render.mp4', 'reel.mp4');
  assert.equal(args[args.indexOf('-c:v') + 1], 'copy');
  assert.equal(args[args.indexOf('-ar') + 1], '48000');
  assert.ok(args.includes('+faststart'));
});
