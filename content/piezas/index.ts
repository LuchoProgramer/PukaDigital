import type { Pieza } from '../../lib/piezas/tipos.ts';
import septiembre from './2026-09.ts';

/**
 * Los meses con calendario escrito.
 *
 * ⚠️ **No sustituir por un import dinámico con plantilla.** El bundle de un
 * Worker de Cloudflare es estático: `await import(`./${mes}.ts`)` compila,
 * despliega y después responde «no hay piezas para este mes» todos los meses,
 * sin dar error — porque quien llama trata la ausencia como un mes sin escribir,
 * que es lo correcto para el caso legítimo y desastroso para este.
 *
 * Añadir un mes es añadirlo aquí a mano. Que sea manual es la gracia: se ve en
 * el diff, y `lib/piezas/meses.test.ts` comprueba que las piezas registradas en
 * un mes se publican en ese mes.
 */
export const MESES: Record<string, Pieza[]> = {
  '2026-09': septiembre,
};

/** Las piezas de un mes, o `null` si ese mes no tiene calendario escrito. */
export function piezasDe(mes: string): Pieza[] | null {
  return MESES[mes] ?? null;
}
