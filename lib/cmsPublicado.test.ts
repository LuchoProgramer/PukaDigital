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
