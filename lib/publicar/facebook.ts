import { formatear, validar } from '../piezas/validar.ts';
import { componer } from '../captions/componer.ts';
import { ESPERA_REEL, urlPublica } from './meta.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

export type OpcionesFacebook = {
  pageId: string;
  token: string;
  /** Inyectable para pruebas unitarias sin red. */
  fetchImpl?: typeof fetch;
  /** Espera entre consultas del estado de un Reel. Por defecto, la de `ESPERA_REEL`. */
  esperarMs?: number;
  /** Cuántas veces se consulta el estado de un Reel antes de rendirse. */
  intentos?: number;
};

export type PublicacionFacebook = {
  id: string;
};

async function llamarFB(
  ruta: string,
  params: Record<string, string>,
  opciones: OpcionesFacebook,
): Promise<Record<string, unknown>> {
  const hacer = opciones.fetchImpl ?? fetch;
  const cuerpo = new URLSearchParams({ ...params, access_token: opciones.token });

  const res = await hacer(`${GRAPH}/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: cuerpo,
  });

  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.error) {
    const error = json.error as { message?: string } | undefined;
    // Solo el mensaje devuelto por Graph API, jamás el token enviado
    throw new Error(`La API de Facebook rechazo ${ruta}: ${error?.message ?? 'sin detalle'}`);
  }
  return json;
}

/**
 * Publica una pieza en la Página de Facebook:
 * 1. Sube la foto slide 1 en 4x5 a /{page-id}/photos con published=false.
 * 2. Crea el post en /{page-id}/feed con attached_media[0] y el texto en message.
 */
export async function publicarPiezaFacebook(
  pieza: Pieza,
  mes: string,
  opciones: OpcionesFacebook,
): Promise<PublicacionFacebook> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const archivo = `${pieza.id}-fb.png`;
  const urlFoto = urlPublica(mes, archivo);
  const texto = pieza.facebook?.caption ?? componer(pieza);
  const pageId = opciones.pageId;

  // Paso 1: Subir foto como no publicada
  const resFoto = await llamarFB(
    `${pageId}/photos`,
    { url: urlFoto, published: 'false' },
    opciones,
  );
  const mediaFbid = String(resFoto.id);

  // Paso 2: Crear el post en el feed con la foto adjunta y el texto en 'message'
  const resPost = await llamarFB(
    `${pageId}/feed`,
    {
      'attached_media[0]': JSON.stringify({ media_fbid: mediaFbid }),
      message: texto,
    },
    opciones,
  );

  return { id: String(resPost.id) };
}

function dormir(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

type Fase = { status?: string };

type EstadoReel = {
  status?: {
    video_status?: string;
    processing_phase?: Fase;
    publishing_phase?: Fase & { publish_status?: string };
  };
  error?: { message?: string };
};

/**
 * Consulta el estado del Reel hasta que la fase de publicación termine.
 * **Un `success: true` del `finish` no es una publicación**: Meta procesa y
 * revisa después, y puede rechazar el video minutos más tarde.
 */
async function esperarPublicacion(videoId: string, opciones: OpcionesFacebook): Promise<void> {
  const hacer = opciones.fetchImpl ?? fetch;
  const espera = opciones.esperarMs ?? ESPERA_REEL.esperarMs;
  const intentos = opciones.intentos ?? ESPERA_REEL.intentos;
  const params = new URLSearchParams({ fields: 'status', access_token: opciones.token });

  for (let i = 0; i < intentos; i++) {
    const res = await hacer(`${GRAPH}/${videoId}?${params}`, { method: 'GET' });
    const json = (await res.json()) as EstadoReel;
    if (!res.ok || json.error) {
      throw new Error(`La API de Facebook rechazo el estado de ${videoId}: ${json.error?.message ?? 'sin detalle'}`);
    }

    const estado = json.status;
    const fallo =
      ['error', 'expired', 'upload_failed'].includes(estado?.video_status ?? '') ||
      estado?.processing_phase?.status === 'error' ||
      estado?.publishing_phase?.status === 'error';
    if (fallo) {
      throw new Error(`Facebook rechazo el Reel ${videoId}: ${estado?.video_status ?? 'error'}`);
    }
    if (estado?.publishing_phase?.status === 'completed') return;

    await dormir(espera);
  }
  throw new Error(`El Reel ${videoId} sigue sin publicarse despues de ${intentos} intentos.`);
}

/**
 * Publica el Reel de una pieza en la Página, en tres fases y una espera:
 *
 * 1. `start` abre la subida y devuelve el `video_id` y la `upload_url`.
 * 2. La subida pasa la URL de R2 en la cabecera `file_url`: Meta descarga el
 *    video y **el Worker nunca toca los bytes**. Se usa la `upload_url` que
 *    devuelve `start`, no una armada a mano.
 * 3. `finish` con `video_state=PUBLISHED` y el caption del Reel en `description`.
 * 4. La espera de `esperarPublicacion()`.
 */
export async function publicarReelFacebook(
  pieza: Pieza,
  opciones: OpcionesFacebook,
): Promise<PublicacionFacebook> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const reel = pieza.reel;
  if (!reel?.video) {
    throw new Error(`La pieza ${pieza.id} no tiene el video del Reel renderizado`);
  }

  const hacer = opciones.fetchImpl ?? fetch;
  const pageId = opciones.pageId;

  const inicio = await llamarFB(`${pageId}/video_reels`, { upload_phase: 'start' }, opciones);
  const videoId = String(inicio.video_id);

  const subida = await hacer(String(inicio.upload_url), {
    method: 'POST',
    headers: { Authorization: `OAuth ${opciones.token}`, file_url: reel.video },
  });
  const cuerpoSubida = (await subida.json()) as { success?: boolean; debug_info?: { message?: string } };
  if (!subida.ok || cuerpoSubida.success !== true) {
    // El mensaje de Meta, nunca el token: viaja en la cabecera, no en el error.
    const detalle = cuerpoSubida.debug_info?.message ?? `HTTP ${subida.status}`;
    throw new Error(`Facebook no pudo descargar el video de ${pieza.id}: ${detalle}`);
  }

  await llamarFB(
    `${pageId}/video_reels`,
    { upload_phase: 'finish', video_id: videoId, video_state: 'PUBLISHED', description: reel.caption },
    opciones,
  );

  await esperarPublicacion(videoId, opciones);
  return { id: videoId };
}
