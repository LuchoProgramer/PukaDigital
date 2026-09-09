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

/**
 * Las cuatro fugas las encontro el usuario redactando, no el validador: la
 * frase «nos adaptamos a cualquier rubro» es como se escribe de verdad, no un
 * caso rebuscado. Los patrones estaban anclados a una palabra literal, asi que
 * un sinonimo corriente los esquivaba.
 */
test('las prohibiciones no se esquivan cambiando una palabra por su sinonimo', () => {
  const fugas = [
    'Nos adaptamos a cualquier rubro medico',
    'Servimos a cualquier sector de la salud',
    'Descarga nuestra aplicacion movil',
    'Tu paciente pide su turno sin llamarte',
    'Le llega un mensaje automatico por WhatsApp',
  ];
  for (const texto of fugas) {
    assert.ok(afirmacionesProhibidas(texto).length > 0, `deberia atrapar: "${texto}"`);
  }
});

test('las prohibiciones que ya funcionaban siguen funcionando', () => {
  const conocidas = [
    'Se adapta a cualquier especialidad',
    'Descarga nuestra app',
    'Tu paciente agenda solo',
    'Recordatorios por WhatsApp',
    'Sincronizacion bidireccional con Google',
    'Precio beta $25/mes',
  ];
  for (const texto of conocidas) {
    assert.ok(afirmacionesProhibidas(texto).length > 0, `dejo de atrapar: "${texto}"`);
  }
});

test('una frase legitima no se marca como prohibida', () => {
  // La red contra patrones demasiado anchos: ensanchar un patron es tan
  // peligroso como dejarlo estrecho, solo que el fallo se ve al reves.
  const buenas = [
    'La arquitectura permite sumar especialidades sin reescribir el sistema',
    'Funciona en el celular',
    'Tus citas se envian a tu Google Calendar',
    'Historia clinica digital para cualquier consultorio medico',
    'Un bot contesta. Un CRM recuerda quien eres',
    'Tu receta necesita siete datos que casi nadie pone',
  ];
  for (const texto of buenas) {
    assert.deepEqual(afirmacionesProhibidas(texto), [], `falso positivo en: "${texto}"`);
  }
});
