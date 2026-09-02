import type { Pieza } from '../piezas/tipos.ts';

/** Ecuador es UTC-5 todo el año: no hay horario de verano que compensar. */
const DESFASE_ECUADOR_HORAS = 5;

/**
 * Cuánto margen tiene el cron para publicar una pieza. Si se pasa, no la
 * publica: más vale una pieza sin salir que una saliendo de madrugada, cuando
 * nadie la ve y encima descoloca el calendario.
 */
const VENTANA_MINUTOS = 60;

/** `2026-09-09T09:00` en hora de Ecuador → el instante UTC equivalente. */
export function aUTC(local: string): Date {
  const comoSiFueraUTC = new Date(`${local}:00.000Z`).getTime();
  if (Number.isNaN(comoSiFueraUTC)) return new Date(NaN);
  return new Date(comoSiFueraUTC + DESFASE_ECUADOR_HORAS * 3600_000);
}

function normalizar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}

/**
 * Si el caption ya está en el perfil, la pieza salió antes. Es la defensa
 * contra publicar dos veces: no hay base de datos donde apuntar lo enviado,
 * así que se le pregunta a Instagram.
 */
export function yaPublicada(pieza: Pieza, captionsRecientes: string[]): boolean {
  if (!pieza.caption) return false;
  const mio = normalizar(pieza.caption);
  return captionsRecientes.some((c) => normalizar(c) === mio);
}

/**
 * Qué piezas toca publicar ahora mismo.
 *
 * Una pieza sin `caption` nunca entra: sin él no se puede comprobar si ya salió,
 * y publicar dos veces es peor que no publicar.
 */
export function pendientes(
  piezas: Pieza[],
  ahora: Date,
  captionsRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    if (!pieza.publicarEl || !pieza.caption) return false;

    const cuando = aUTC(pieza.publicarEl);
    if (Number.isNaN(cuando.getTime())) return false;

    const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
    if (minutos < 0 || minutos > VENTANA_MINUTOS) return false;

    return !yaPublicada(pieza, captionsRecientes);
  });
}
