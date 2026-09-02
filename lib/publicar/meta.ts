import { formatear, validar } from '../piezas/validar.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';
const SITIO = 'https://pukadigital.com';

/** Cuántas veces se pregunta por el contenedor antes de rendirse. */
const INTENTOS = 30;

export type Opciones = {
  igUserId: string;
  token: string;
  /** Inyectable para poder probar sin red. */
  fetchImpl?: typeof fetch;
  /** Espera entre comprobaciones del contenedor. */
  esperarMs?: number;
};

export type Publicacion = { id: string };

/**
 * La Graph API exige una URL pública y no acepta subir el binario, así que el
 * propio sitio hace de CDN. Por eso los PNG viven versionados en public/piezas/.
 */
export function urlPublica(mes: string, archivo: string): string {
  return `${SITIO}/piezas/${mes}/${archivo}`;
}

/** El feed usa 4x5. Una slide por archivo, numeradas desde 1. */
export function archivosDe(pieza: Pieza): string[] {
  return pieza.slides.map((_, i) => `${pieza.id}-${i + 1}-4x5.png`);
}

/** El token va en el cuerpo, nunca en la URL: así no acaba en logs ni en el historial. */
async function llamar(
  ruta: string,
  params: Record<string, string>,
  opciones: Opciones,
): Promise<Record<string, unknown>> {
  const hacer = opciones.fetchImpl ?? fetch;
  const body = new URLSearchParams({ ...params, access_token: opciones.token });

  const res = await hacer(`${GRAPH}/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.error) {
    const error = json.error as { message?: string } | undefined;
    // El mensaje de Meta, nunca el token ni los parámetros enviados.
    throw new Error(`La API de Meta rechazo ${ruta}: ${error?.message ?? 'sin detalle'}`);
  }
  return json;
}

function dormir(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Un contenedor recién creado no está listo para publicar. Hay que preguntar
 * hasta que diga FINISHED; si dice ERROR, se aborta sin publicar nada.
 */
async function esperarContenedor(id: string, opciones: Opciones): Promise<void> {
  const espera = opciones.esperarMs ?? 2000;

  for (let i = 0; i < INTENTOS; i++) {
    const estado = await llamar(id, { fields: 'status_code,status' }, opciones);
    const codigo = String(estado.status_code ?? '');

    if (codigo === 'FINISHED') return;
    if (codigo === 'ERROR' || codigo === 'EXPIRED') {
      throw new Error(`El contenedor ${id} quedo en ${codigo}: ${estado.status ?? 'sin detalle'}`);
    }
    await dormir(espera);
  }
  throw new Error(`El contenedor ${id} sigue sin estar listo despues de ${INTENTOS} intentos.`);
}

/**
 * Publica una pieza en Instagram.
 *
 * Valida antes de tocar la red: una pieza con un precio que no es de su producto
 * no llega a la API. Es la misma barrera que en el render, aquí importa más
 * porque publicar no se deshace.
 */
export async function publicarPieza(
  pieza: Pieza,
  mes: string,
  opciones: Opciones,
): Promise<Publicacion> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const archivos = archivosDe(pieza);
  const caption = pieza.caption ?? '';
  const usuario = opciones.igUserId;

  let contenedor: string;

  if (archivos.length === 1) {
    const res = await llamar(
      `${usuario}/media`,
      { image_url: urlPublica(mes, archivos[0]), caption },
      opciones,
    );
    contenedor = String(res.id);
  } else {
    // Carrusel: primero un contenedor por slide, luego el que los agrupa.
    const hijos: string[] = [];
    for (const archivo of archivos) {
      const hijo = await llamar(
        `${usuario}/media`,
        { image_url: urlPublica(mes, archivo), is_carousel_item: 'true' },
        opciones,
      );
      hijos.push(String(hijo.id));
    }
    const padre = await llamar(
      `${usuario}/media`,
      { media_type: 'CAROUSEL', children: hijos.join(','), caption },
      opciones,
    );
    contenedor = String(padre.id);
  }

  await esperarContenedor(contenedor, opciones);

  const publicado = await llamar(`${usuario}/media_publish`, { creation_id: contenedor }, opciones);
  return { id: String(publicado.id) };
}
