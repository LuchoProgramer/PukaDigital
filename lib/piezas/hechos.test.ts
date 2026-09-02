import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validar } from './validar.ts';
import type { Pieza } from './tipos.ts';

const base: Pieza = {
  id: 'prueba-01',
  sistema: 'puka',
  slides: [{ titular: 'Un titular corto' }],
};
const campos = (p: Pieza[]) => validar(p).map((e) => e.campo);

test('el sistema visual tiene que ser el del producto declarado', () => {
  assert.deepEqual(
    campos([{ ...base, producto: 'pukahealth' }]),
    ['sistema'],
    'PukaHealth con el kit de la agencia debe fallar',
  );
  assert.deepEqual(validar([{ ...base, sistema: 'health', producto: 'pukahealth' }]), []);
  assert.deepEqual(campos([{ ...base, sistema: 'health', producto: 'ledgerxpertz' }]), ['sistema']);
});

test('un precio tiene que ser del producto que la pieza dice anunciar', () => {
  const ok: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    slides: [{ titular: 'Facturacion SRI', dato: { valor: '$15', etiqueta: 'al mes' } }],
  };
  assert.deepEqual(validar([ok]), []);

  // El fallo real: mensaje de LedgerXpertz con el precio de PukaIA.
  const mezclado: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    slides: [{ titular: 'Facturacion SRI', dato: { valor: '$14.99', etiqueta: 'al mes' } }],
  };
  assert.deepEqual(campos([mezclado]), ['dato.valor']);
});

test('un precio sin producto declarado no se puede verificar', () => {
  const huerfano: Pieza = {
    ...base,
    slides: [{ titular: 'Desde $15 al mes' }],
  };
  assert.deepEqual(campos([huerfano]), ['producto']);
});

test('los productos sin precio visible no admiten precio', () => {
  const mal: Pieza = {
    ...base,
    producto: 'agencia',
    slides: [{ titular: 'Google Ads', dato: { valor: '$99', etiqueta: 'al mes' } }],
  };
  assert.deepEqual(campos([mal]), ['dato.valor']);
});

test('la oferta de gratuidad tiene que ser la del producto', () => {
  const ok: Pieza = {
    ...base,
    sistema: 'health',
    producto: 'pukahealth',
    slides: [{ titular: 'Historia clinica', cta: 'Prueba 30 dias gratis' }],
  };
  assert.deepEqual(validar([ok]), []);

  // El otro fallo real: la oferta de PukaHealth en una pieza de LedgerXpertz.
  const mal: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    slides: [{ titular: 'Facturacion SRI', cta: 'Prueba 30 dias gratis' }],
  };
  assert.deepEqual(campos([mal]), ['cta']);
});

test('la pieza frankenstein del experimento produce los tres errores', () => {
  const frankenstein: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    sistema: 'health',
    slides: [{
      titular: 'Facturacion SRI en segundos',
      dato: { valor: '$14.99', etiqueta: 'al mes' },
      cta: 'Prueba 30 dias gratis',
    }],
  };
  assert.deepEqual(campos([frankenstein]), ['sistema', 'dato.valor', 'cta']);
});

test('una pieza de utilidad sin producto ni precio sigue siendo valida', () => {
  const utilidad: Pieza = {
    ...base,
    slides: [{ titular: 'Tres errores que rechaza el SRI', bajada: 'El primero es el mas comun.' }],
  };
  assert.deepEqual(validar([utilidad]), []);
});
