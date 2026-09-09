import { formatear, validar } from '../piezas/validar.ts';
import { componer } from '../captions/componer.ts';
import { urlPublica } from './meta.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

export type OpcionesFacebook = {
  pageId: string;
  token: string;
  /** Inyectable para pruebas unitarias sin red. */
  fetchImpl?: typeof fetch;
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

  const archivo = `${pieza.id}-1-4x5.png`;
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
