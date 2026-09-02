import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * El texto va literal. Lleva raya larga (—), no guion.
 *
 * No es una recomendación: una pieza que muestre pantalla del sistema sin este
 * aviso puede ser retirada. A este proyecto ya le costó un video en YouTube, con
 * la apelación rechazada.
 */
export const AVISO = 'Datos de paciente ficticios — sistema de demostración';

/** Proporciones medidas sobre el video original, para que escalen a vertical. */
const ALTO_BARRA = 0.061;
const ALTO_FUENTE = 0.027;

/** Fondo de la barra, tomado del mismo video. */
export const FONDO_AVISO = '#0D1717';

const DIR = join(process.cwd(), 'assets', 'capturas');

/**
 * La proporción del video original da un cuerpo que no cabe en una línea: el
 * aviso son 52 caracteres y el ancho útil de la pieza es menor que el de un
 * 1920 horizontal. Se toma el menor de los dos: la proporción del alto, o lo
 * que quepa en el ancho. Partido en dos líneas se lee peor y pierde el aire de
 * aviso oficial.
 */
export function medidasAviso(
  altoPieza: number,
  anchoDisponible = Infinity,
): { alto: number; fuente: number } {
  const porAlto = altoPieza * ALTO_FUENTE;
  const porAncho = anchoDisponible / (AVISO.length * 0.62);
  // Se trunca, no se redondea: redondear hacia arriba vuelve a desbordar.
  const fuente = Math.floor(Math.min(porAlto, porAncho));
  return {
    alto: Math.max(Math.round(altoPieza * ALTO_BARRA), Math.round(fuente * 2.2)),
    fuente,
  };
}

/** Satori no lee rutas de disco: la imagen tiene que ir embebida. */
export function cargarCaptura(archivo: string): string {
  const ruta = join(DIR, archivo);
  if (!existsSync(ruta)) {
    throw new Error(`La captura ${archivo} no existe en assets/capturas/`);
  }
  return `data:image/png;base64,${readFileSync(ruta).toString('base64')}`;
}
