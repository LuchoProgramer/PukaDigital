import { CATALOGO } from '../piezas/catalogo.ts';
import type { Pieza, Slide } from '../piezas/tipos.ts';

const DOMINIO = 'pukadigital.com';

function bloqueDeSlide(slide: Slide): string {
  let lineaTitular = slide.titular;
  if (slide.dato) {
    lineaTitular = `${slide.titular} — ${slide.dato.valor} ${slide.dato.etiqueta}`;
  }
  if (slide.bajada && slide.bajada.trim() !== '') {
    return `${lineaTitular}\n${slide.bajada.trim()}`;
  }
  return lineaTitular;
}

function urlCierre(pieza: Pieza): string {
  if (pieza.producto && CATALOGO[pieza.producto]) {
    const ruta = CATALOGO[pieza.producto].url;
    // ruta en CATALOGO empieza con '/', ej: '/agentes-ia'
    return `${DOMINIO}${ruta}`;
  }
  return DOMINIO;
}

/**
 * Compone un caption para Facebook a partir de las slides de la pieza.
 * Función pura, determinista y sin dependencias externas.
 */
export function componer(pieza: Pieza): string {
  const bloques = pieza.slides.map(bloqueDeSlide);
  bloques.push(urlCierre(pieza));
  return bloques.join('\n\n');
}
