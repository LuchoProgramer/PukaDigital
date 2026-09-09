import { piezasDe } from '../../content/piezas/index.ts';
import { publicarPieza } from './meta.ts';
import { publicarPiezaFacebook } from './facebook.ts';
import { pendientesFacebook, pendientesInstagram } from './programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

/** Cuántas publicaciones recientes se miran para no repetir una pieza. */
const RECIENTES = 25;

export type NombreCanal = 'instagram' | 'facebook';

export type Resultado = {
  /** El mes de la corrida. Pueden entrar piezas del anterior: ver `mesAnterior`. */
  mes: string;
  revisadas: number;
  publicadas: Array<{ canal: NombreCanal; id: string; mediaId: string }>;
  fallidas: Array<{ canal: NombreCanal; id: string; error: string }>;
  /** Canales que no se intentaron por no tener secretos. No es un fallo. */
  omitidos: NombreCanal[];
};

export type Opciones = {
  igUserId: string;
  token: string;
  /**
   * Facebook es opcional a propósito: sin estos dos el canal se omite y la tanda
   * sigue publicando en Instagram. Un despliegue sin los secretos de Facebook no
   * puede apagar lo que ya funcionaba.
   */
  fbPageId?: string;
  fbToken?: string;
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

/**
 * Lo que hay que saber hacer para ser un canal. Existe para que sumar el tercero
 * no obligue a tocar el orquestador.
 */
type Canal = {
  nombre: NombreCanal;
  recientes(o: Opciones): Promise<string[]>;
  pendientes(piezas: Pieza[], ahora: Date, recientes: string[]): Pieza[];
  publicar(pieza: Pieza, mes: string, o: Opciones): Promise<{ id: string }>;
};

/** `2026-09`, en UTC. El cron de Cloudflare dispara en UTC. */
export function mesDe(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** `2026-10` → `2026-09`. */
export function mesAnterior(mes: string): string {
  const [anio, numero] = mes.split('-').map(Number);
  return mesDe(new Date(Date.UTC(anio, numero - 2, 1)));
}

function mensaje(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/**
 * Las publicaciones recientes de un perfil. Instagram las llama `caption` en
 * `/media`; Facebook, `message` en `/posts`. Lo demás es idéntico.
 */
async function textosRecientes(
  o: Opciones,
  ruta: string,
  campo: 'caption' | 'message',
  token: string,
): Promise<string[]> {
  const hacer = o.fetchImpl ?? fetch;
  const params = new URLSearchParams({
    fields: campo,
    limit: String(RECIENTES),
    access_token: token,
  });
  const res = await hacer(`${GRAPH}/${ruta}?${params}`);
  const cuerpo = (await res.json()) as {
    data?: Array<Record<string, string | undefined>>;
    error?: { message: string };
  };
  if (cuerpo.error) throw new Error(`No se pudo leer el perfil: ${cuerpo.error.message}`);
  return (cuerpo.data ?? []).map((m) => m[campo] ?? '').filter(Boolean);
}

function canalesDe(o: Opciones): { canales: Canal[]; omitidos: NombreCanal[] } {
  const canales: Canal[] = [
    {
      nombre: 'instagram',
      recientes: (op) => textosRecientes(op, `${op.igUserId}/media`, 'caption', op.token),
      pendientes: pendientesInstagram,
      publicar: (pieza, mes, op) =>
        publicarPieza(pieza, mes, {
          igUserId: op.igUserId,
          token: op.token,
          fetchImpl: op.fetchImpl,
        }),
    },
  ];
  const omitidos: NombreCanal[] = [];

  // Capturados en constantes: dentro de los closures el estrechamiento de tipo
  // de `o.fbPageId` no sobrevive.
  const pageId = o.fbPageId;
  const fbToken = o.fbToken;
  if (pageId && fbToken) {
    canales.push({
      nombre: 'facebook',
      recientes: (op) => textosRecientes(op, `${pageId}/posts`, 'message', fbToken),
      pendientes: pendientesFacebook,
      publicar: (pieza, mes, op) =>
        publicarPiezaFacebook(pieza, mes, { pageId, token: fbToken, fetchImpl: op.fetchImpl }),
    });
  } else {
    omitidos.push('facebook');
  }

  return { canales, omitidos };
}

/**
 * Publica las piezas que toquen ahora mismo, en todos los canales configurados.
 *
 * La llaman dos puertas —el `scheduled()` del Worker y la ruta HTTP— y no puede
 * saber cuál de las dos fue: todo lo que depende del entorno entra por
 * parámetro.
 */
export async function publicarLoQueToca(opciones: Opciones): Promise<Resultado> {
  const mes = mesDe(opciones.ahora);
  const previo = mesAnterior(mes);
  const buscar = opciones.buscarMes ?? piezasDe;
  const { canales, omitidos } = canalesDe(opciones);

  // El mes anterior entra porque la franja de Facebook de una pieza del ultimo
  // dia a las 18:00 cae el dia 1 del siguiente. Un mes sin calendario escrito no
  // es un error: es un mes sin escribir.
  const delPrevio = buscar(previo) ?? [];
  const deEsteMes = buscar(mes) ?? [];
  const piezas = [...delPrevio, ...deEsteMes];

  // Se sale antes de consultar los perfiles para no gastar llamadas de balde.
  if (piezas.length === 0) {
    return { mes, revisadas: 0, publicadas: [], fallidas: [], omitidos };
  }

  // ⚠️ El mapa va indexado por el OBJETO, no por `pieza.id`: nada garantiza que
  // un id sea unico entre meses, y una colision publicaria la imagen del mes
  // equivocado, que en el CDN es un 404.
  const mesDePieza = new Map<Pieza, string>();
  for (const p of delPrevio) mesDePieza.set(p, previo);
  for (const p of deEsteMes) mesDePieza.set(p, mes);

  const publicadas: Resultado['publicadas'] = [];
  const fallidas: Resultado['fallidas'] = [];

  for (const canal of canales) {
    try {
      const recientes = await canal.recientes(opciones);
      for (const pieza of canal.pendientes(piezas, opciones.ahora, recientes)) {
        try {
          const { id } = await canal.publicar(pieza, mesDePieza.get(pieza) ?? mes, opciones);
          publicadas.push({ canal: canal.nombre, id: pieza.id, mediaId: id });
        } catch (e) {
          // Una pieza que falla no debe impedir las demas del mismo dia.
          fallidas.push({ canal: canal.nombre, id: pieza.id, error: mensaje(e) });
        }
      }
    } catch (e) {
      // Un canal caido no debe impedir el otro.
      fallidas.push({ canal: canal.nombre, id: 'lectura-perfil', error: mensaje(e) });
    }
  }

  return { mes, revisadas: piezas.length, publicadas, fallidas, omitidos };
}
