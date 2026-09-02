import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { FORMATOS, formatosDe } from './formatos.ts';
import { cargarFuentes, type Fuente } from './fuentes.ts';
import { Plantilla } from './plantilla.tsx';
import { sistemas } from './sistemas.ts';
import { formatear, validar } from './validar.ts';
import type { Formato, Pieza, Slide } from './tipos.ts';

export type Salida = { nombre: string; png: Buffer };

/** Las fuentes se leen de disco una sola vez por proceso. */
let cache: Fuente[] | null = null;
function fuentes(): Fuente[] {
  if (!cache) cache = cargarFuentes();
  return cache;
}

async function renderSlide(
  slide: Slide,
  pieza: Pieza,
  formato: Formato,
  indice: number,
  total: number,
): Promise<Buffer> {
  const { ancho, alto } = FORMATOS[formato];

  const svg = await satori(
    Plantilla({ slide, tokens: sistemas[pieza.sistema], formato, indice, total }),
    { width: ancho, height: alto, fonts: fuentes() },
  );

  return Buffer.from(
    new Resvg(svg, { fitTo: { mode: 'width', value: ancho } }).render().asPng(),
  );
}

/**
 * Renderiza una pieza a PNG, uno por slide y formato.
 *
 * Valida antes de dibujar: una pieza invalida no llega a producir archivos, que
 * es justo lo que evita que un precio equivocado acabe publicado.
 */
export async function renderPieza(pieza: Pieza): Promise<Salida[]> {
  const errores = validar([pieza]);
  if (errores.length > 0) {
    throw new Error(`La pieza no pasa la validacion:\n${formatear(errores)}`);
  }

  const salida: Salida[] = [];
  const total = pieza.slides.length;

  for (const formato of formatosDe(pieza)) {
    for (const [i, slide] of pieza.slides.entries()) {
      const indice = i + 1;
      salida.push({
        nombre: `${pieza.id}-${indice}-${formato}.png`,
        png: await renderSlide(slide, pieza, formato, indice, total),
      });
    }
  }

  return salida;
}
