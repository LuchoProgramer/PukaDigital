import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROHIBIDAS, afirmacionesProhibidas } from './prohibidas.ts';

test('cada regla dice qué está mal y qué se puede decir en su lugar', () => {
  for (const r of PROHIBIDAS) {
    assert.ok(r.motivo.length > 20, `${r.nombre}: el motivo es demasiado corto`);
    assert.ok(r.enCambio.length > 10, `${r.nombre}: falta la alternativa`);
  }
});

test('«cualquier especialidad» se bloquea: solo hay podología', () => {
  const [e] = afirmacionesProhibidas('Se adapta a cualquier especialidad médica');
  assert.equal(e.nombre, 'especialidades');
  assert.match(e.motivo, /podolog/i);
});

test('prometer WhatsApp se bloquea: no existe el enganche', () => {
  assert.equal(afirmacionesProhibidas('Recordatorios por WhatsApp automáticos').length, 1);
  assert.equal(afirmacionesProhibidas('recordatorio automatico por whatsapp').length, 1);
});

test('«sincronización bidireccional» se bloquea; «se envía a Google» no', () => {
  assert.equal(afirmacionesProhibidas('Sincronización bidireccional con Google Calendar').length, 1);
  assert.equal(afirmacionesProhibidas('Tus citas se envían a tu Google Calendar').length, 0);
});

test('«nuestra app» se bloquea; «funciona en el celular» no', () => {
  assert.equal(afirmacionesProhibidas('Descarga nuestra app').length, 1);
  assert.equal(afirmacionesProhibidas('Funciona en el celular sin instalar nada').length, 0);
});

test('el precio beta de $25 se bloquea: nunca existió', () => {
  assert.equal(afirmacionesProhibidas('Precio beta $25/mes el primer año').length, 1);
  assert.equal(afirmacionesProhibidas('$50 al mes, 30 días para probarlo').length, 0);
});

test('ignora tildes y mayúsculas, que es como se cuela el error', () => {
  assert.equal(afirmacionesProhibidas('SINCRONIZACION BIDIRECCIONAL').length, 1);
  assert.equal(afirmacionesProhibidas('sincronizacion  bidireccional').length, 1);
});

test('un texto correcto no dispara nada', () => {
  assert.deepEqual(
    afirmacionesProhibidas(
      'Historia clínica electrónica y facturación al SRI. Tus citas se envían a ' +
      'tu Google Calendar. $50 al mes.',
    ),
    [],
  );
});
