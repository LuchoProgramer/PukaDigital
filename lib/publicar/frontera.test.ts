// lib/publicar/frontera.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const RAIZ = process.cwd();
const LIB = join(RAIZ, 'lib');

/** Los imports relativos de un archivo, resueltos a rutas absolutas. */
function importsDe(archivo: string): string[] {
  const codigo = readFileSync(archivo, 'utf8');
  return [...codigo.matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g)]
    .map((m) => m[1])
    .filter((especificador) => especificador.startsWith('.'))
    .map((especificador) => resolve(dirname(archivo), especificador));
}

/**
 * Todo lo que alcanza un punto de entrada siguiendo imports relativos. Solo se
 * baja por `lib/`: `worker.ts` importa también el bundle de `.open-next/`, que es
 * generado y no hace falta recorrer.
 */
function alcanzables(entrada: string): string[] {
  const inicio = resolve(RAIZ, entrada);
  const vistos = new Set<string>();
  const pendientes = [inicio];
  while (pendientes.length > 0) {
    const actual = pendientes.pop() as string;
    if (vistos.has(actual)) continue;
    vistos.add(actual);
    const recorrible = actual === inicio || actual.startsWith(LIB);
    if (recorrible && existsSync(actual)) pendientes.push(...importsDe(actual));
  }
  return [...vistos].map((ruta) => relative(RAIZ, ruta));
}

test('lo que carga el Worker no alcanza lib/reels/: sus dependencias no caben en un Worker', () => {
  const prohibidos = alcanzables('worker.ts').filter((ruta) => ruta.startsWith(join('lib', 'reels')));
  assert.deepEqual(prohibidos, []);
});

test('el detector sigue imports de verdad: si no, el test de arriba pasaría siempre', () => {
  const alcanza = alcanzables('worker.ts');
  assert.ok(alcanza.includes(join('lib', 'publicar', 'tanda.ts')), 'debe seguir worker.ts → tanda.ts');
  assert.ok(alcanza.includes(join('lib', 'piezas', 'validar.ts')), 'y bajar hasta lib/piezas/');
});
