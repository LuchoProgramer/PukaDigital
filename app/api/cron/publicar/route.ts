import { NextResponse } from 'next/server';
import { publicarPieza } from '@/lib/publicar/meta';
import { pendientes } from '@/lib/publicar/programado';
import type { Pieza } from '@/lib/piezas/tipos';

export const dynamic = 'force-dynamic';
// Publicar un carrusel son varias llamadas encadenadas mas la espera del
// contenedor: el limite por defecto se queda corto.
export const maxDuration = 300;

/** Cuantas publicaciones recientes se miran para no repetir una pieza. */
const RECIENTES = 25;

function mesDe(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
}

async function captionsRecientes(igUserId: string, token: string): Promise<string[]> {
  const url = `https://graph.facebook.com/v21.0/${igUserId}/media?fields=caption&limit=${RECIENTES}&access_token=${token}`;
  const res = await fetch(url);
  const json = (await res.json()) as { data?: Array<{ caption?: string }>; error?: { message: string } };
  if (json.error) throw new Error(`No se pudo leer el perfil: ${json.error.message}`);
  return (json.data ?? []).map((m) => m.caption ?? '').filter(Boolean);
}

export async function GET(request: Request) {
  // Vercel firma sus crons con este encabezado. Sin la comprobacion, cualquiera
  // con la URL podria disparar publicaciones en la cuenta.
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get('authorization') !== `Bearer ${secreto}`) {
    return new NextResponse('No autorizado', { status: 401 });
  }

  const igUserId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !token) {
    return NextResponse.json({ error: 'Faltan IG_USER_ID o IG_ACCESS_TOKEN' }, { status: 500 });
  }

  const ahora = new Date();
  const mes = mesDe(ahora);

  let piezas: Pieza[];
  try {
    piezas = (await import(`@/content/piezas/${mes}`)).default;
  } catch {
    // Un mes sin archivo no es un error: es un mes sin calendario escrito.
    return NextResponse.json({ mes, publicadas: [], nota: 'No hay piezas para este mes.' });
  }

  const captions = await captionsRecientes(igUserId, token);
  const toca = pendientes(piezas, ahora, captions);

  const publicadas: Array<{ id: string; mediaId: string }> = [];
  const fallidas: Array<{ id: string; error: string }> = [];

  for (const pieza of toca) {
    try {
      const { id } = await publicarPieza(pieza, mes, { igUserId, token });
      publicadas.push({ id: pieza.id, mediaId: id });
    } catch (e) {
      // Una pieza que falla no debe impedir las demas del mismo dia.
      fallidas.push({ id: pieza.id, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return NextResponse.json(
    { mes, revisadas: piezas.length, publicadas, fallidas },
    { status: fallidas.length > 0 ? 500 : 200 },
  );
}
