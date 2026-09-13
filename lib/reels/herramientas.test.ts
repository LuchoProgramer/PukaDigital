// lib/reels/herramientas.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ejecutar } from './herramientas.ts';

test('ejecutar devuelve la salida del comando', async () => {
  const { stdout } = await ejecutar(process.execPath, ['-e', 'process.stdout.write("hola")']);
  assert.equal(stdout, 'hola');
});

test('si el comando falla, el error trae sus últimas líneas de stderr', async () => {
  await assert.rejects(
    () => ejecutar(process.execPath, ['-e', 'console.error("uno\\ndos\\ntres\\ncuatro"); process.exit(3)']),
    /dos \| tres \| cuatro/,
  );
});

test('y si el comando solo escribió en stdout, el error trae eso', async () => {
  // HyperFrames escribe ahí sus errores de lint. Sin esto, un render abortado
  // deja «Command failed» y nada más: pasó en el ensayo del paso 0.
  //
  // ⚠️ El texto se arma en tiempo de ejecución a propósito. Si se escribe literal,
  // `error.message` de Node —que es `Command failed: <comando>`— ya lo contiene, y
  // el test pasa aunque se borre la lectura de stdout. Lo destapó la mutación.
  await assert.rejects(
    () => ejecutar(process.execPath, ['-e', "process.stdout.write(['non','deterministic','code'].join('_')); process.exit(3)"]),
    /non_deterministic_code/,
  );
});
