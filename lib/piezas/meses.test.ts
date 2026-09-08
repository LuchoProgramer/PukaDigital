import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MESES, piezasDe } from '../../content/piezas/index.ts';

test('cada clave del registro es un mes en formato YYYY-MM', () => {
  for (const mes of Object.keys(MESES)) {
    assert.match(mes, /^\d{4}-(0[1-9]|1[0-2])$/, `clave invalida: ${mes}`);
  }
});

test('las piezas de un mes se publican en ese mes', () => {
  // Un archivo '2026-09' con una pieza de octubre es un fallo que solo se ve
  // en produccion: el cron busca por mes y esa pieza no aparece jamas.
  for (const [mes, piezas] of Object.entries(MESES)) {
    for (const pieza of piezas) {
      if (!pieza.publicarEl) continue;
      assert.equal(
        pieza.publicarEl.slice(0, 7),
        mes,
        `${pieza.id} esta registrada en ${mes} pero se publica el ${pieza.publicarEl}`,
      );
    }
  }
});

test('un mes sin calendario escrito devuelve null, no revienta', () => {
  assert.equal(piezasDe('2027-01'), null);
});

test('septiembre de 2026 esta registrado', () => {
  const piezas = piezasDe('2026-09');
  assert.ok(piezas !== null && piezas.length > 0);
});
