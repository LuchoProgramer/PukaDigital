// lib/reels/bloque.ts
import { parrafosDelGuion } from '../piezas/guion.ts';

/**
 * El bloque `reel` listo para pegar en `content/piezas/<mes>.ts`. **Se imprime,
 * no se escribe en el archivo**: los calendarios del mes son TypeScript con
 * comentarios, y el pegado a mano es el momento en que una persona lee lo que
 * escribió el modelo. Es lo mismo que hace `npm run captions`.
 */
export function bloqueReel(reel: {
  guion: string;
  caption: string;
  video: string;
  duracion: number;
}): string {
  const parrafos = parrafosDelGuion(reel.guion);
  const guion = parrafos
    .map((parrafo, i) => `    ${JSON.stringify(i < parrafos.length - 1 ? `${parrafo}\n\n` : parrafo)}`)
    .join(' +\n');

  return `reel: {
  guion:
${guion},
  caption: ${JSON.stringify(reel.caption)},
  video: ${JSON.stringify(reel.video)},
  duracion: ${reel.duracion},
},`;
}
