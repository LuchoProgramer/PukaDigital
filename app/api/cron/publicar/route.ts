import { NextResponse } from 'next/server';
import { publicarLoQueToca } from '@/lib/publicar/tanda';

export const dynamic = 'force-dynamic';

/**
 * Disparo manual de la publicación. El camino automático es el `scheduled()`
 * del Worker; esta ruta existe para poder ejecutarla a mano cuando el cron no
 * publica y hay que entender por qué.
 *
 * Toda la lógica vive en `lib/publicar/tanda.ts`: aquí solo se autentica y se
 * serializa, para que las dos puertas no puedan divergir.
 */
export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get('authorization') !== `Bearer ${secreto}`) {
    return new NextResponse('No autorizado', { status: 401 });
  }

  const igUserId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !token) {
    return NextResponse.json({ error: 'Faltan IG_USER_ID o IG_ACCESS_TOKEN' }, { status: 500 });
  }

  const resultado = await publicarLoQueToca({ igUserId, token, ahora: new Date() });
  return NextResponse.json(resultado, {
    status: resultado.fallidas.length > 0 ? 500 : 200,
  });
}
