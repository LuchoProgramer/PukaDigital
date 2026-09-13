// lib/piezas/guion.ts
/**
 * El guion de un Reel lleva **un párrafo por slide**, separados por una línea en
 * blanco. Cada párrafo se sintetiza aparte y lo que dura su voz marca dónde
 * empieza la escena siguiente: por eso el número de párrafos tiene que coincidir
 * con el de slides.
 *
 * Decidido el 2026-09-13: sin transcripción, los cortes salen de aquí. Vive en
 * `lib/piezas/` porque lo usan el validador y la producción, y `lib/piezas/` no
 * depende de nadie.
 */
export function parrafosDelGuion(guion: string): string[] {
  return guion
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.replace(/\s+/g, ' ').trim())
    .filter((parrafo) => parrafo !== '');
}
