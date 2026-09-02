import { test } from 'node:test';
import assert from 'node:assert/strict';
import { archivosDe, publicarPieza, urlPublica, type Opciones } from './meta.ts';
import type { Pieza } from '../piezas/tipos.ts';

const TOKEN = 'TOKEN-SECRETO-QUE-NUNCA-DEBE-APARECER';

const suelta: Pieza = {
  id: 'sri-rechazo-01',
  sistema: 'puka',
  producto: 'ledgerxpertz',
  caption: 'Tu factura no pasó. Escríbenos.',
  slides: [{ titular: 'Tu factura no pasó' }],
};

const carrusel: Pieza = {
  id: 'historia-clinica-papel',
  sistema: 'health',
  producto: 'pukahealth',
  caption: 'Historia clínica y facturación en el mismo sitio.',
  slides: [{ titular: 'Uno' }, { titular: 'Dos', cta: 'Empieza gratis hoy' }],
};

/** fetch de mentira: registra las llamadas y devuelve respuestas preparadas. */
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

function opciones(fetchImpl: typeof fetch): Opciones {
  return { igUserId: '17841476784325626', token: TOKEN, fetchImpl, esperarMs: 0 };
}

test('la URL publica apunta al sitio, que hace de CDN', () => {
  assert.equal(
    urlPublica('2026-09', 'sri-rechazo-01-1-4x5.png'),
    'https://pukadigital.com/piezas/2026-09/sri-rechazo-01-1-4x5.png',
  );
});

test('se publican los archivos 4x5, que es el formato de feed', () => {
  assert.deepEqual(archivosDe(suelta), ['sri-rechazo-01-1-4x5.png']);
  assert.deepEqual(archivosDe(carrusel), [
    'historia-clinica-papel-1-4x5.png',
    'historia-clinica-papel-2-4x5.png',
  ]);
});

test('una pieza suelta hace crear, comprobar y publicar', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'CONTENEDOR-1' },
    { status_code: 'FINISHED' },
    { id: 'PUBLICADO-1' },
  ]);
  const res = await publicarPieza(suelta, '2026-09', opciones(impl));

  assert.equal(res.id, 'PUBLICADO-1');
  assert.equal(llamadas.length, 3);
  assert.match(llamadas[0].url, /17841476784325626\/media$/);
  assert.match(llamadas[0].body, /image_url=.*sri-rechazo-01-1-4x5\.png/);
  assert.match(llamadas[2].url, /media_publish$/);
  assert.match(llamadas[2].body, /creation_id=CONTENEDOR-1/);
});

test('un carrusel crea un hijo por slide y luego el contenedor padre', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'HIJO-1' },
    { id: 'HIJO-2' },
    { id: 'PADRE' },
    { status_code: 'FINISHED' },
    { id: 'PUBLICADO-2' },
  ]);
  const res = await publicarPieza(carrusel, '2026-09', opciones(impl));

  assert.equal(res.id, 'PUBLICADO-2');
  assert.match(llamadas[0].body, /is_carousel_item=true/);
  assert.match(llamadas[1].body, /is_carousel_item=true/);
  assert.match(llamadas[2].body, /media_type=CAROUSEL/);
  assert.match(llamadas[2].body, /children=HIJO-1%2CHIJO-2/);
});

test('el caption viaja en el contenedor que se publica', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'C' },
    { status_code: 'FINISHED' },
    { id: 'P' },
  ]);
  await publicarPieza(suelta, '2026-09', opciones(impl));
  assert.match(llamadas[0].body, /caption=Tu\+factura\+no\+pas/);
});

test('el estado del contenedor se consulta con GET, no con POST', async () => {
  // Con POST, Meta responde «does not exist ... or does not support this
  // operation» aunque el contenedor exista. Costo una publicacion fallida.
  const { impl, llamadas } = fetchFalso([
    { id: 'C' },
    { status_code: 'FINISHED' },
    { id: 'P' },
  ]);
  await publicarPieza(suelta, '2026-09', opciones(impl));

  assert.equal(llamadas[0].metodo, 'POST', 'crear el contenedor es POST');
  assert.equal(llamadas[1].metodo, 'GET', 'consultar el estado es GET');
  assert.match(llamadas[1].url, /status_code/);
  assert.equal(llamadas[2].metodo, 'POST', 'publicar es POST');
});

test('espera a que el contenedor termine antes de publicar', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'C' },
    { status_code: 'IN_PROGRESS' },
    { status_code: 'FINISHED' },
    { id: 'P' },
  ]);
  await publicarPieza(suelta, '2026-09', opciones(impl));
  assert.equal(llamadas.length, 4, 'debe reintentar mientras esta IN_PROGRESS');
});

test('un contenedor con error aborta y no publica', async () => {
  const { impl, llamadas } = fetchFalso([
    { id: 'C' },
    { status_code: 'ERROR', status: 'El formato no es valido' },
  ]);
  await assert.rejects(
    () => publicarPieza(suelta, '2026-09', opciones(impl)),
    /ERROR/,
  );
  assert.equal(llamadas.length, 2, 'no debe llegar a media_publish');
});

test('el token nunca aparece en el mensaje de error', async () => {
  const impl = (async () => ({
    ok: false,
    status: 400,
    json: async () => ({ error: { message: 'Invalid OAuth access token' } }),
  })) as unknown as typeof fetch;

  await assert.rejects(
    () => publicarPieza(suelta, '2026-09', opciones(impl)),
    (e: Error) => {
      assert.ok(!e.message.includes(TOKEN), 'el token se filtro en el error');
      assert.match(e.message, /Invalid OAuth access token/);
      return true;
    },
  );
});

test('una pieza que no pasa la validacion no llega a la API', async () => {
  const { impl, llamadas } = fetchFalso([{ id: 'C' }]);
  const mala: Pieza = { ...suelta, producto: 'pukahealth' }; // sistema puka, producto health
  await assert.rejects(() => publicarPieza(mala, '2026-09', opciones(impl)), /sistema/);
  assert.equal(llamadas.length, 0);
});
