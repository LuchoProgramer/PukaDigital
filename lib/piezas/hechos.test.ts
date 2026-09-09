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

test('una pieza de PukaHealth no puede prometer lo que el producto no hace', () => {
  const mala: Pieza = {
    id: 'x',
    sistema: 'health',
    producto: 'pukahealth',
    caption: 'Se adapta a cualquier especialidad médica.',
    slides: [{ titular: 'Uno' }],
  };
  const [e] = validar([mala]);
  assert.equal(e.campo, 'caption');
  assert.match(e.mensaje, /podolog/i);
});

test('la prohibicion tambien aplica al arte, no solo al caption', () => {
  const mala: Pieza = {
    id: 'x',
    sistema: 'health',
    producto: 'pukahealth',
    slides: [{ titular: 'Sincronización bidireccional' }],
  };
  assert.deepEqual(validar([mala]).map((e) => e.campo), ['titular']);
});

test('el mensaje dice que escribir en su lugar', () => {
  const mala: Pieza = {
    id: 'x',
    sistema: 'health',
    producto: 'pukahealth',
    slides: [{ titular: 'Descarga la app' }],
  };
  assert.match(validar([mala])[0].mensaje, /funciona en el celular/);
});

test('las prohibiciones son de PukaHealth: no aplican a otro producto', () => {
  const otra: Pieza = {
    id: 'x',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [{ titular: 'Sincronización bidireccional con tu tienda' }],
  };
  assert.deepEqual(validar([otra]), []);
});

test('los precios de terceros se declaran y entonces se permiten', () => {
  const comparativa: Pieza = {
    id: 'x',
    sistema: 'puka',
    producto: 'pukaia',
    preciosAjenos: ['49', '499'],
    slides: [{ titular: 'Cobran entre $49 y $499', dato: { valor: '$14.99', etiqueta: 'al mes' } }],
  };
  assert.deepEqual(validar([comparativa]), []);
});

test('un precio de tercero sin declarar sigue bloqueado', () => {
  const mala: Pieza = {
    id: 'x',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [{ titular: 'Cobran $49' }],
  };
  assert.deepEqual(validar([mala]).map((e) => e.campo), ['titular']);
});

test('declarar un precio ajeno no habilita otro distinto', () => {
  const mala: Pieza = {
    id: 'x',
    sistema: 'puka',
    producto: 'pukaia',
    preciosAjenos: ['49'],
    slides: [{ titular: 'Cobran $49 y hasta $999' }],
  };
  assert.equal(validar([mala]).length, 1);
});

test('precios no permitidos en caption de Instagram o Facebook rompen la validacion', () => {
  const malaIG: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    caption: 'Consigue tu ERP por solo $99 al mes.',
  };
  assert.deepEqual(campos([malaIG]), ['caption']);

  const malaFB: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Consigue tu ERP por solo $99 al mes en Facebook.',
    },
  };
  assert.deepEqual(campos([malaFB]), ['facebook.caption']);
});

test('ofertas no permitidas en facebook.caption rompen la validacion', () => {
  const malaOferta: Pieza = {
    ...base,
    producto: 'ledgerxpertz',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Prueba 30 dias gratis con LedgerXpertz.',
    },
  };
  assert.deepEqual(campos([malaOferta]), ['facebook.caption']);
});

test('una pieza sin producto con precio en caption falla con error en producto', () => {
  const huerfanaEnCaption: Pieza = {
    ...base,
    caption: 'Software por solo $15 al mes.',
  };
  assert.deepEqual(campos([huerfanaEnCaption]), ['producto']);

  const huerfanaEnFBCaption: Pieza = {
    ...base,
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Software por solo $15 al mes.',
    },
  };
  assert.deepEqual(campos([huerfanaEnFBCaption]), ['producto']);
});

test('afirmaciones prohibidas de PukaHealth en facebook.caption rompen la validacion', () => {
  const malaSaludFB: Pieza = {
    ...base,
    sistema: 'health',
    producto: 'pukahealth',
    facebook: {
      publicarEl: '2026-09-08T18:00',
      caption: 'Recordatorios por WhatsApp automáticos para tus pacientes.',
    },
  };
  const [e] = validar([malaSaludFB]);
  assert.equal(e.campo, 'facebook.caption');
  assert.match(e.mensaje, /WhatsApp/i);
});

test('las afirmaciones prohibidas en facebook.caption no aplican a otros productos', () => {
  const otraFB: Pieza = {
    ...base,
    sistema: 'puka',
    producto: 'ledgerxpertz',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Sincronización bidireccional con tu tienda online.',
    },
  };
  assert.deepEqual(validar([otraFB]), []);
});

