// El Worker corre en UTC; esta Mac, en hora de Ecuador. Sin esto, el test no ve el error de zona.
process.env.TZ = 'UTC';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estaPublicado } from './cmsPublicado';

test('un post publicado sale en el sitio', () => {
  assert.equal(estaPublicado({ status: 'published' }), true);
});

test('un borrador no sale en el sitio', () => {
  assert.equal(estaPublicado({ status: 'draft' }), false);
});

test('sin status, o sin post, no sale en el sitio', () => {
  assert.equal(estaPublicado({}), false);
  assert.equal(estaPublicado(null), false);
  assert.equal(estaPublicado(undefined), false);
});

import { fechaDePublicacion } from './cmsPublicado';

const AHORA = new Date('2026-10-15T14:00:00Z'); // 09:00 en Ecuador

test('una fecha sin zona se lee como hora de Ecuador (UTC-5)', () => {
  assert.equal(fechaDePublicacion({ publishDate: '2026-10-15T09:00' })?.toISOString(), '2026-10-15T14:00:00.000Z');
});

test('una fecha con zona se respeta', () => {
  assert.equal(fechaDePublicacion({ publishDate: '2026-04-13T15:25:51.881Z' })?.toISOString(), '2026-04-13T15:25:51.881Z');
});

test('sin fecha, o con una fecha que no se entiende, no hay fecha de publicación', () => {
  assert.equal(fechaDePublicacion({}), null);
  assert.equal(fechaDePublicacion({ publishDate: 'mañana' }), null);
});

test('un post publicado con fecha futura todavía no sale', () => {
  assert.equal(estaPublicado({ status: 'published', publishDate: '2026-10-15T09:01' }, AHORA), false);
});

test('un post publicado sale en cuanto llega su hora de Ecuador', () => {
  assert.equal(estaPublicado({ status: 'published', publishDate: '2026-10-15T09:00' }, AHORA), true);
});

test('un borrador con fecha pasada sigue sin salir', () => {
  assert.equal(estaPublicado({ status: 'draft', publishDate: '2026-01-01T09:00' }, AHORA), false);
});

test('un publicado sin fecha sale, como los posts de antes', () => {
  assert.equal(estaPublicado({ status: 'published' }, AHORA), true);
});
