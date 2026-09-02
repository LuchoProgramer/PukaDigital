import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, preciosEn, ofertasEn } from './catalogo.ts';

test('el catalogo cubre los seis productos con su URL canonica', () => {
  assert.deepEqual(Object.keys(CATALOGO).sort(), [
    'agencia', 'desarrollo-web', 'ledgerxpertz', 'pukahealth', 'pukaia', 'pukasalud',
  ]);
  assert.equal(CATALOGO.ledgerxpertz.url, '/ledgerxpertz');
  assert.equal(CATALOGO.pukaia.url, '/agentes-ia');
});

test('solo PukaHealth usa el sistema visual claro', () => {
  assert.equal(CATALOGO.pukahealth.sistema, 'health');
  for (const [id, p] of Object.entries(CATALOGO)) {
    if (id !== 'pukahealth') assert.equal(p.sistema, 'puka', `${id} deberia ser puka`);
  }
});

test('los precios son los de AGENTS.md', () => {
  assert.deepEqual(CATALOGO.pukaia.precios, ['14.99', '25', '60']);
  assert.deepEqual(CATALOGO.ledgerxpertz.precios, ['15', '20', '25']);
  assert.deepEqual(CATALOGO.pukahealth.precios, ['50', '480']);
});

test('los productos sin precio visible tienen la lista vacia', () => {
  assert.deepEqual(CATALOGO.agencia.precios, []);
  assert.deepEqual(CATALOGO.pukasalud.precios, []);
  assert.deepEqual(CATALOGO['desarrollo-web'].precios, []);
});

test('preciosEn extrae cifras con y sin decimales', () => {
  assert.deepEqual(preciosEn('Desde $15 al mes'), ['15']);
  assert.deepEqual(preciosEn('$14.99 y $60'), ['14.99', '60']);
  assert.deepEqual(preciosEn('$ 480 al ano'), ['480']);
  assert.deepEqual(preciosEn('sin precio'), []);
});

test('preciosEn ignora cifras que no son precios', () => {
  assert.deepEqual(preciosEn('30 dias gratis'), []);
  assert.deepEqual(preciosEn('100% digital'), []);
});

test('ofertasEn detecta las promesas de gratuidad, con o sin tilde', () => {
  assert.deepEqual(ofertasEn('Prueba 30 dias gratis'), ['30 dias gratis']);
  assert.deepEqual(ofertasEn('Prueba 30 días gratis'), ['30 dias gratis']);
  assert.deepEqual(ofertasEn('1 mes gratis'), ['1 mes gratis']);
  assert.deepEqual(ofertasEn('2 meses gratis'), ['2 meses gratis']);
  assert.deepEqual(ofertasEn('Escribenos'), []);
});
