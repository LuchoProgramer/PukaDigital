import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicarLoQueToca, mesDe, mesAnterior } from './tanda.ts';
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
function falsoFetch(
  opciones: {
    captions?: string[];
    falla?: string;
    fallaLecturaFacebook?: boolean;
  } = {},
) {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    const metodo = init?.method ?? 'GET';
    const cuerpoStr = init?.body ? ` ${String(init.body)}` : '';
    llamadas.push(`${metodo} ${u.split('?')[0].split('/v21.0/')[1] ?? u}${cuerpoStr}`);

    if (u.includes('/media?') && metodo === 'GET') {
      return json({ data: (opciones.captions ?? []).map((caption) => ({ caption })) });
    }
    if (u.includes('/posts?') && metodo === 'GET') {
      if (opciones.fallaLecturaFacebook) {
        return json({ error: { message: 'caida' } }, 400);
      }
      return json({ data: [] });
    }
    if (u.endsWith('/media') && metodo === 'POST') {
      const cuerpo = String(init?.body ?? '');
      if (opciones.falla && cuerpo.includes(opciones.falla)) {
        return json({ error: { message: 'la imagen no es accesible' } }, 400);
      }
      return json({ id: 'contenedor-1' });
    }
    if (u.endsWith('/photos') && metodo === 'POST') {
      return json({ id: 'foto-1' });
    }
    if (u.endsWith('/feed') && metodo === 'POST') {
      return json({ id: 'post-77' });
    }
    if (u.endsWith('/media_publish')) return json({ id: 'media-99' });
    if (metodo === 'GET') return json({ status_code: 'FINISHED' });
    throw new Error(`ruta no simulada: ${metodo} ${u}`);
  }) as typeof fetch;
  return { impl, llamadas };
}

const AHORA = new Date('2026-09-09T14:05:00Z'); // 09:05 de Ecuador
const soloEsteMes = (piezas: Pieza[]) => (m: string) => (m === '2026-09' ? piezas : null);
const CON_FB = { fbPageId: 'pagina-1', fbToken: 'tfb' };

test('un mes sin calendario no falla y no toca la red', async () => {
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: () => null,
  });
  assert.deepEqual(r, { mes: '2026-09', revisadas: 0, publicadas: [], fallidas: [], omitidos: ['facebook'] });
  assert.deepEqual(llamadas, [], 'no debe consultar el perfil si no hay calendario');
});

test('sin secretos de Facebook publica en Instagram y lo anota en omitidos', async () => {
  const { impl } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('toca', '2026-09-09T09:00')]),
  });
  assert.deepEqual(r.publicadas, [{ canal: 'instagram', id: 'toca', mediaId: 'media-99' }]);
  assert.deepEqual(r.omitidos, ['facebook']);
  assert.deepEqual(r.fallidas, []);
});

test('un canal caido no impide el otro', async () => {
  // La lectura de /posts falla; Instagram tiene que publicar igual.
  const { impl } = falsoFetch({ fallaLecturaFacebook: true });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB, ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('toca', '2026-09-09T09:00')]),
  });
  assert.deepEqual(r.publicadas.map((p) => p.canal), ['instagram']);
  assert.deepEqual(r.fallidas, [
    { canal: 'facebook', id: 'lectura-perfil', error: 'No se pudo leer el perfil: caida' },
  ]);
});

test('publica en los dos canales en una sola corrida', async () => {
  const { impl } = falsoFetch();
  // La pieza de las 09:00 toca en Instagram; su franja de Facebook es a las 18:00,
  // asi que aqui solo debe salir Instagram. La de ayer a las 18:00 toca hoy en
  // Facebook a las 09:00 y ya salio en Instagram.
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB, ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([
      pieza('de-hoy', '2026-09-09T09:00'),
      pieza('de-ayer', '2026-09-08T18:00'),
    ]),
  });
  assert.deepEqual(r.publicadas, [
    { canal: 'instagram', id: 'de-hoy', mediaId: 'media-99' },
    { canal: 'facebook', id: 'de-ayer', mediaId: 'post-77' },
  ]);
});

test('una pieza del mes anterior se publica con SU mes, no con el de la corrida', async () => {
  // 1 de octubre, 09:05 de Ecuador. La pieza vive en 2026-09 y su imagen tambien:
  // publicarla con mes '2026-10' pedirla al CDN da 404.
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB,
    ahora: new Date('2026-10-01T14:05:00Z'), fetchImpl: impl,
    buscarMes: (m) => (m === '2026-09' ? [pieza('del-30', '2026-09-30T18:00')] : null),
  });
  assert.equal(r.mes, '2026-10');
  assert.deepEqual(r.publicadas.map((p) => p.canal), ['facebook']);
  assert.ok(
    llamadas.some((l) => l.includes('2026-09')),
    'la URL de la imagen debe llevar 2026-09, no 2026-10',
  );
});

test('publica la pieza que toca y devuelve su media id', async () => {
  const { impl } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('toca', '2026-09-09T09:00')]),
  });
  assert.equal(r.revisadas, 1);
  assert.deepEqual(r.publicadas, [{ canal: 'instagram', id: 'toca', mediaId: 'media-99' }]);
  assert.deepEqual(r.fallidas, []);
});

test('una pieza que falla no impide las demas del mismo dia', async () => {
  const { impl } = falsoFetch({ falla: 'rota' });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([
      pieza('rota', '2026-09-09T09:00'),
      pieza('buena', '2026-09-09T09:00'),
    ]),
  });
  assert.deepEqual(r.publicadas.map((p) => p.id), ['buena']);
  assert.equal(r.fallidas.length, 1);
  assert.equal(r.fallidas[0].id, 'rota');
});

test('no republica lo que ya esta en el perfil', async () => {
  const { impl } = falsoFetch({ captions: ['caption de repetida'] });
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ahora: AHORA, fetchImpl: impl,
    buscarMes: soloEsteMes([pieza('repetida', '2026-09-09T09:00')]),
  });
  assert.deepEqual(r.publicadas, []);
  assert.equal(r.revisadas, 1);
});

test('el mes se calcula en UTC', () => {
  assert.equal(mesDe(new Date('2026-09-30T23:00:00Z')), '2026-09');
  assert.equal(mesDe(new Date('2026-10-01T00:30:00Z')), '2026-10');
});

/**
 * Cubre un hueco que dejó el plan: el mapa pieza→mes va indexado por el objeto
 * y no por `pieza.id`, y nada lo probaba porque ningún test repetía un id entre
 * meses. Nada garantiza que sean únicos —los escribe a mano quien redacta cada
 * archivo mensual—, y con el mapa indexado por id el `set` del mes en curso
 * pisa al del anterior: la pieza de septiembre pediría su imagen a
 * `piezas/2026-10/`, que en el CDN es un 404. Comprobado por mutación el
 * 2026-09-09.
 */
test('dos piezas con el mismo id en meses distintos no se pisan el mes de la imagen', async () => {
  const { impl, llamadas } = falsoFetch();
  const r = await publicarLoQueToca({
    igUserId: '1', token: 't', ...CON_FB,
    // 1 de octubre: la de septiembre toca hoy en Facebook por la franja siguiente.
    ahora: new Date('2026-10-01T14:05:00Z'), fetchImpl: impl,
    buscarMes: (m) =>
      m === '2026-09' ? [pieza('repe', '2026-09-30T18:00')]
      : m === '2026-10' ? [pieza('repe', '2026-10-15T09:00')]
      : null,
  });

  assert.deepEqual(r.publicadas.map((p) => p.canal), ['facebook']);
  const subida = llamadas.find((l) => l.includes('/photos'));
  assert.ok(subida, 'debe subir la foto a Facebook');
  assert.match(
    decodeURIComponent(subida),
    /piezas\/2026-09\/repe-1-4x5\.png/,
    'la imagen debe pedirse a su propio mes, no al de la corrida',
  );
});
