import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicarLoQueToca, mesDe } from './tanda.ts';
import type { Pieza } from '../piezas/tipos.ts';

const pieza = (id: string, publicarEl: string): Pieza => ({
  id,
  sistema: 'puka',
  caption: `caption de ${id}`,
  publicarEl,
  formatos: ['4x5'],
  slides: [{ titular: 'Un titular corto' }],
});

function json(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Simula la Graph API. El verbo importa: consultar el contenedor es GET y el
 * resto POST — un falso fetch que ignore el metodo deja pasar el bug que ya
 * costo un despliegue roto.
 */
function falsoFetch(opciones: { captions?: string[]; falla?: string } = {}) {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    const metodo = init?.method ?? 'GET';
    llamadas.push(`${metodo} ${u.split('?')[0].split('/v21.0/')[1] ?? u}`);

    if (u.includes('/media?') && metodo === 'GET') {
      return json({ data: (opciones.captions ?? []).map((caption) => ({ caption })) });
    }
    if (u.endsWith('/media') && metodo === 'POST') {
      const cuerpo = String(init?.body ?? '');
      if (opciones.falla && cuerpo.includes(opciones.falla)) {
        return json({ error: { message: 'la imagen no es accesible' } }, 400);
      }
      return json({ id: 'contenedor-1' });
    }
    if (u.endsWith('/media_publish')) return json({ id: 'media-99' });
    if (metodo === 'GET') return json({ status_code: 'FINISHED' });
    throw new Error(`ruta no simulada: ${metodo} ${u}`);
  }) as typeof fetch;
  return { impl, llamadas };
}

const AHORA = new Date('2026-09-09T14:05:00Z'); // 09:05 de Ecuador

test('un mes sin calendario no falla y no toca la red', async () => {
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => null,
  });
  assert.deepEqual(r, { mes: '2026-09', revisadas: 0, publicadas: [], fallidas: [] });
  assert.deepEqual(llamadas, [], 'no debe consultar el perfil si no hay calendario');
});

test('publica la pieza que toca y devuelve su media id', async () => {
  const { impl } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => [pieza('toca', '2026-09-09T09:00')],
  });
  assert.equal(r.revisadas, 1);
  assert.deepEqual(r.publicadas, [{ id: 'toca', mediaId: 'media-99' }]);
  assert.deepEqual(r.fallidas, []);
});

test('una pieza que falla no impide las demas del mismo dia', async () => {
  const { impl } = falsoFetch({ falla: 'rota' });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => [
      pieza('rota', '2026-09-09T09:00'),
      pieza('buena', '2026-09-09T09:00'),
    ],
  });
  assert.deepEqual(r.publicadas.map((p) => p.id), ['buena']);
  assert.equal(r.fallidas.length, 1);
  assert.equal(r.fallidas[0].id, 'rota');
});

test('no republica lo que ya esta en el perfil', async () => {
  const { impl } = falsoFetch({ captions: ['caption de repetida'] });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => [pieza('repetida', '2026-09-09T09:00')],
  });
  assert.deepEqual(r.publicadas, []);
  assert.equal(r.revisadas, 1);
});

test('el mes se calcula en UTC', () => {
  assert.equal(mesDe(new Date('2026-09-30T23:00:00Z')), '2026-09');
  assert.equal(mesDe(new Date('2026-10-01T00:30:00Z')), '2026-10');
});
