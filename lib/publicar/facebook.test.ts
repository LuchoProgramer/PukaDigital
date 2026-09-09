import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicarPiezaFacebook, type OpcionesFacebook } from './facebook.ts';
import type { Pieza } from '../piezas/tipos.ts';

const TOKEN = 'TOKEN-SECRETO-DE-PAGINA-FB';

const piezaBase: Pieza = {
  id: 'sri-rechazo-01',
  sistema: 'puka',
  producto: 'ledgerxpertz',
  caption: 'Caption de Instagram con #hashtag',
  facebook: {
    imagen: { titular: 'Tu factura no pasó' },
  },
  slides: [
    { titular: 'Tu factura no pasó', bajada: 'El error más común es un dato mal escrito.' },
    { titular: 'Revisa antes de enviar', bajada: 'Evita rechazos del SRI.' },
  ],
};

function json(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function fetchFalso(respuestas: unknown[]) {
  const llamadas: Array<{ url: string; body: string; metodo: string }> = [];
  let i = 0;
  const impl = async (url: string | URL, init?: RequestInit) => {
    llamadas.push({
      url: String(url),
      body: String(init?.body ?? ''),
      metodo: String(init?.method ?? 'GET'),
    });
    return {
      ok: true,
      json: async () => respuestas[Math.min(i++, respuestas.length - 1)],
    } as Response;
  };
  return { impl: impl as unknown as typeof fetch, llamadas };
}

function opciones(fetchImpl: typeof fetch): OpcionesFacebook {
  return { pageId: 'PAGE_DE_PRUEBA', token: TOKEN, fetchImpl };
}

test('publicar en Facebook realiza los dos pasos en orden con token en el cuerpo', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'FOTO_FB_123' },
    { id: 'POST_FB_456' },
  ]);

  const res = await publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl));

  assert.equal(res.id, 'POST_FB_456');
  assert.equal(llamadas.length, 2);

  // Paso 1: Subir foto con published=false a {page-id}/photos
  assert.equal(llamadas[0].metodo, 'POST');
  assert.match(llamadas[0].url, /PAGE_DE_PRUEBA\/photos$/);
  assert.match(llamadas[0].body, /published=false/);
  assert.match(llamadas[0].body, /url=https%3A%2F%2Fpukadigital\.com%2Fpiezas%2F2026-09%2Fsri-rechazo-01-fb\.png/);
  assert.match(llamadas[0].body, /access_token=TOKEN-SECRETO-DE-PAGINA-FB/);
  assert.ok(!llamadas[0].url.includes(TOKEN), 'el token no debe viajar en la URL');

  // Paso 2: Publicar post en {page-id}/feed con attached_media y message
  assert.equal(llamadas[1].metodo, 'POST');
  assert.match(llamadas[1].url, /PAGE_DE_PRUEBA\/feed$/);
  assert.match(llamadas[1].body, /attached_media%5B0%5D=%7B%22media_fbid%22%3A%22FOTO_FB_123%22%7D/);
  assert.match(llamadas[1].body, /message=/);
  assert.ok(!llamadas[1].body.includes('caption='), 'el endpoint de feed usa message, no caption');
});

test('utiliza facebook.caption si está definido en la pieza', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'FOTO_FB_1' },
    { id: 'POST_FB_1' },
  ]);

  const piezaConFB: Pieza = {
    ...piezaBase,
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption: 'Texto específico para Facebook sin hashtags.',
    },
  };

  await publicarPiezaFacebook(piezaConFB, '2026-09', opciones(impl));

  assert.match(llamadas[1].body, /message=Texto\+espec%C3%ADfico\+para\+Facebook\+sin\+hashtags\./);
});

test('utiliza el compositor determinista si facebook.caption no está definido', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'FOTO_FB_2' },
    { id: 'POST_FB_2' },
  ]);

  await publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl));

  // El compositor incluye los titulares y la URL de LedgerXpertz
  assert.match(llamadas[1].body, /Tu\+factura\+no\+pas/);
  assert.match(llamadas[1].body, /pukadigital\.com%2Fledgerxpertz/);
});

test('una pieza que no pasa validación no llega a la Graph API de Facebook', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'FOTO' }]);
  const invalida: Pieza = {
    ...piezaBase,
    producto: 'pukahealth', // sistema puka, producto health -> error sistema
  };

  await assert.rejects(
    () => publicarPiezaFacebook(invalida, '2026-09', opciones(impl)),
    /sistema/,
  );
  assert.equal(llamadas.length, 0);
});

test('el token de Facebook nunca se filtra en el mensaje de error ante fallos de API', async () => {
  const impl = (async () => ({
    ok: false,
    status: 400,
    json: async () => ({ error: { message: 'OAuthException: Error validating access token' } }),
  })) as unknown as typeof fetch;

  await assert.rejects(
    () => publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl)),
    (e: Error) => {
      assert.ok(!e.message.includes(TOKEN), 'el token de Facebook se filtró en el error');
      assert.match(e.message, /OAuthException/);
      return true;
    },
  );
});

/**
 * Cubre un hueco que dejó el plan: la guarda de error mira `!res.ok` **y**
 * `json.error`, y solo la segunda mitad tenía test. Un gateway que devuelve 502
 * con un cuerpo sin campo `error` —lo normal en un proxy, no en Graph API— se
 * colaba: sin la mitad `!res.ok` la función no lanza, sigue al paso 2 y termina
 * devolviendo `{ id: 'undefined' }`, es decir, informa de un éxito que no
 * ocurrió. Comprobado por mutación el 2026-09-09.
 */
test('un error HTTP sin campo error en el cuerpo tambien lanza, no devuelve un id falso', async () => {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request) => {
    llamadas.push(String(url));
    return new Response('{}', { status: 502 });
  }) as unknown as typeof fetch;

  await assert.rejects(
    () => publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl)),
    /rechazo/,
  );
  // Y para en el paso 1: no debe intentar el post del feed con un id inventado.
  assert.equal(llamadas.length, 1);
});

test('sube el -fb.png, no la slide 1 del carrusel', async () => {
  const llamadas: string[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push(String(init?.body ?? ''));
    const u = String(url);
    if (u.endsWith('/photos')) return json({ id: 'foto-1' });
    return json({ id: 'post-77' });
  }) as unknown as typeof fetch;

  await publicarPiezaFacebook(piezaBase, '2026-09', opciones(impl));
  const subida = decodeURIComponent(llamadas[0]);
  assert.match(subida, /-fb\.png/);
  assert.doesNotMatch(subida, /-1-4x5\.png/);
});

