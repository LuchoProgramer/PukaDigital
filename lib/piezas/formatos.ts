import type { Formato, Pieza } from './tipos.ts';

/** Margen estándar e inmutable de 88px para todos los formatos */
export const MARGEN = 88;

export type Medidas = {
  ancho: number;
  alto: number;
  seguroArriba: number;
  seguroAbajo: number;
};

export const FORMATOS: Record<Formato, Medidas> = {
  '4x5': { ancho: 1080, alto: 1350, seguroArriba: 0, seguroAbajo: 0 },
  '1x1': { ancho: 1080, alto: 1080, seguroArriba: 0, seguroAbajo: 0 },
  '9x16': { ancho: 1080, alto: 1920, seguroArriba: 250, seguroAbajo: 320 },
};

/**
 * Decide en qué formatos se renderiza una pieza:
 * - Si la pieza declara formatos explícitos, esos mandan.
 * - Si no, una pieza de 1 slide sale en los tres formatos ('4x5', '1x1', '9x16').
 * - Una pieza de 2+ slides (carrusel) sale solo en '4x5'.
 */
export function formatosDe(pieza: Pieza): Formato[] {
  if (pieza.formatos && pieza.formatos.length > 0) {
    return pieza.formatos;
  }
  return pieza.slides.length > 1 ? ['4x5'] : ['4x5', '1x1', '9x16'];
}
