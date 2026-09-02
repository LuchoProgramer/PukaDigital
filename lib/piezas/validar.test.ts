import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validar } from './validar.ts';
import type { Pieza } from './tipos.ts';

const ok: Pieza = {
  id: 'sri-errores-01',
  sistema: 'puka',
  slides: [{ titular: 'Tu factura no paso el SRI' }],
};

function campos(piezas: Pieza[]): string[] {
  return validar(piezas).map((e) => e.campo);
}

test('una pieza correcta no produce errores', () => {
  assert.deepEqual(validar([ok]), []);
});

test('el id debe ser kebab-case', () => {
  assert.deepEqual(campos([{ ...ok, id: 'SRI Errores' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: 'sri_errores' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: '-sri' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: 'sri-' }]), ['id']);
  assert.deepEqual(campos([{ ...ok, id: 'sri--01' }]), ['id']);
});

test('el id debe ser unico dentro del array', () => {
  const piezas: Pieza[] = [ok, { ...ok }];
  assert.deepEqual(campos(piezas), ['id']);
});

test('una pieza sin slides produce error en slides', () => {
  assert.deepEqual(campos([{ ...ok, slides: [] }]), ['slides']);
});

test('una pieza admite hasta 10 slides pero falla con 11', () => {
  const diez: Pieza = {
    ...ok,
    slides: Array.from({ length: 10 }, (_, i) => ({ titular: `Slide ${i + 1}` })),
  };
  assert.deepEqual(validar([diez]), []);

  const once: Pieza = {
    ...ok,
    slides: Array.from({ length: 11 }, (_, i) => ({ titular: `Slide ${i + 1}` })),
  };
  assert.deepEqual(campos([once]), ['slides']);
});

test('el titular admite como maximo 9 palabras', () => {
  const nuevePalabras: Pieza = {
    ...ok,
    slides: [{ titular: 'una dos tres cuatro cinco seis siete ocho nueve' }],
  };
  assert.deepEqual(validar([nuevePalabras]), []);

  const diezPalabras: Pieza = {
    ...ok,
    slides: [{ titular: 'una dos tres cuatro cinco seis siete ocho nueve diez' }],
  };
  assert.deepEqual(campos([diezPalabras]), ['titular']);
});

test('tope de caracteres en titular: 60 en feed y 48 en 9x16', () => {
  const titular55 = 'a'.repeat(55);

  // Pieza de 1 slide por defecto va a 9x16 -> tope 48 -> 55 falla
  const piezaSuelta: Pieza = { ...ok, slides: [{ titular: titular55 }] };
  assert.deepEqual(campos([piezaSuelta]), ['titular']);

  // Pieza con formato explicito solo 4x5 -> tope 60 -> 55 pasa
  const soloFeed: Pieza = { ...ok, formatos: ['4x5'], slides: [{ titular: titular55 }] };
  assert.deepEqual(validar([soloFeed]), []);

  // Pieza con mas de 60 caracteres falla incluso en feed
  const titular61 = 'a'.repeat(61);
  const feedLargo: Pieza = { ...ok, formatos: ['4x5'], slides: [{ titular: titular61 }] };
  assert.deepEqual(campos([feedLargo]), ['titular']);
});

test('topes de caracteres en slots opcionales', () => {
  const piezaOk: Pieza = {
    ...ok,
    formatos: ['4x5'],
    slides: [{
      titular: 'Valido',
      bajada: 'b'.repeat(140),
      badge: 'g'.repeat(24),
      dato: { valor: 'v'.repeat(8), etiqueta: 'e'.repeat(16) },
      cta: 'c'.repeat(24),
    }],
  };
  assert.deepEqual(validar([piezaOk]), []);

  const piezaExcedida: Pieza = {
    ...ok,
    formatos: ['4x5'],
    slides: [{
      titular: 'Valido',
      bajada: 'b'.repeat(141),
      badge: 'g'.repeat(25),
      dato: { valor: 'v'.repeat(9), etiqueta: 'e'.repeat(17) },
      cta: 'c'.repeat(25),
    }],
  };
  assert.deepEqual(campos([piezaExcedida]), ['bajada', 'badge', 'dato.valor', 'dato.etiqueta', 'cta']);
});

test('el CTA solo puede aparecer en la ultima slide de la pieza', () => {
  const ctaEnPrimeraDeDos: Pieza = {
    ...ok,
    slides: [
      { titular: 'Uno', cta: 'Registrate hoy' },
      { titular: 'Dos' },
    ],
  };
  assert.deepEqual(campos([ctaEnPrimeraDeDos]), ['cta']);

  const ctaEnUltimaDeDos: Pieza = {
    ...ok,
    slides: [
      { titular: 'Uno' },
      { titular: 'Dos', cta: 'Registrate hoy' },
    ],
  };
  assert.deepEqual(validar([ctaEnUltimaDeDos]), []);

  const ctaEnUnicaSlide: Pieza = {
    ...ok,
    slides: [{ titular: 'Uno', cta: 'Registrate hoy' }],
  };
  assert.deepEqual(validar([ctaEnUnicaSlide]), []);
});

test('el error identifica la pieza y el numero de slide', () => {
  const pieza: Pieza = {
    ...ok,
    slides: [
      { titular: 'Valido' },
      { titular: 'una dos tres cuatro cinco seis siete ocho nueve diez' },
    ],
  };
  const errores = validar([pieza]);
  assert.equal(errores.length, 1);
  assert.equal(errores[0].pieza, 'sri-errores-01');
  assert.equal(errores[0].slide, 2);
  assert.equal(errores[0].campo, 'titular');
});
