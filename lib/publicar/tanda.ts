import { piezasDe } from '../../content/piezas/index.ts';
import { publicarPieza } from './meta.ts';
import { pendientes } from './programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

/** Cuántas publicaciones recientes se miran para no repetir una pieza. */
const RECIENTES = 25;

export type Resultado = {
  mes: string;
  revisadas: number;
  publicadas: Array<{ id: string; mediaId: string }>;
  fallidas: Array<{ id: string; error: string }>;
};

export type Opciones = {
  igUserId: string;
  token: string;
  /** El instante que se considera «ahora». Inyectable para poder probar. */
  ahora: Date;
  /** Inyectable para poder probar sin red. */
  fetchImpl?: typeof fetch;
  /**
   * De dónde salen las piezas de un mes. Inyectable porque si no, los tests
   * dependerían del calendario real y se romperían solos al cambiar de mes.
   */
  buscarMes?: (mes: string) => Pieza[] | null;
};

/** `2026-09`, en UTC. El cron de Cloudflare y el de Vercel disparan en UTC. */
export function mesDe(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
}

async function captionsRecientes(opciones: Opciones): Promise<string[]> {
  const hacer = opciones.fetchImpl ?? fetch;
  const params = new URLSearchParams({
    fields: 'caption',
    limit: String(RECIENTES),
    access_token: opciones.token,
  });
  const res = await hacer(`${GRAPH}/${opciones.igUserId}/media?${params}`);
  const cuerpo = (await res.json()) as {
    data?: Array<{ caption?: string }>;
    error?: { message: string };
  };
  if (cuerpo.error) throw new Error(`No se pudo leer el perfil: ${cuerpo.error.message}`);
  return (cuerpo.data ?? []).map((m) => m.caption ?? '').filter(Boolean);
}

/**
 * Publica las piezas que toquen ahora mismo.
 *
 * La llaman dos puertas —el `scheduled()` del Worker y la ruta HTTP— y no puede
 * saber cuál de las dos fue: todo lo que depende del entorno entra por
 * parámetro.
 */
export async function publicarLoQueToca(opciones: Opciones): Promise<Resultado> {
  const mes = mesDe(opciones.ahora);
  const buscar = opciones.buscarMes ?? piezasDe;
  const piezas = buscar(mes);

  // Un mes sin calendario escrito no es un error: es un mes sin escribir.
  // Se sale antes de consultar el perfil para no gastar una llamada de balde.
  if (piezas === null) return { mes, revisadas: 0, publicadas: [], fallidas: [] };

  const captions = await captionsRecientes(opciones);
  const toca = pendientes(piezas, opciones.ahora, captions);

  const publicadas: Resultado['publicadas'] = [];
  const fallidas: Resultado['fallidas'] = [];

  for (const pieza of toca) {
    try {
      const { id } = await publicarPieza(pieza, mes, {
        igUserId: opciones.igUserId,
        token: opciones.token,
        fetchImpl: opciones.fetchImpl,
      });
      publicadas.push({ id: pieza.id, mediaId: id });
    } catch (e) {
      // Una pieza que falla no debe impedir las demás del mismo día.
      fallidas.push({ id: pieza.id, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return { mes, revisadas: piezas.length, publicadas, fallidas };
}
