// lib/reels/tiempos.ts
/** Silencio entre un párrafo y el siguiente: la voz respira y la escena cambia. */
export const PAUSA_ENTRE_ESCENAS = 0.4;
/** Aire antes de la primera palabra, para que la primera escena entre sin cortar. */
export const ENTRADA = 0.3;
/** Aire al final, para que el último subtítulo no se corte con el video. */
export const COLA = 0.8;
/** Palabras por subtítulo, como máximo. */
export const MAX_PALABRAS_SUBTITULO = 4;

export type Subtitulo = { texto: string; inicio: number; fin: number };

export type Escena = {
  indice: number;
  inicio: number;
  duracion: number;
  /** Cuándo entra la voz de esta escena. */
  voz: number;
  subtitulos: Subtitulo[];
};

/** Milisegundos: más precisión no la usa nadie y ensucia el HTML. */
const redondear = (segundos: number): number => Math.round(segundos * 1000) / 1000;

/**
 * Reparte el tiempo de un párrafo entre sus palabras según su largo, y las junta
 * en grupos de hasta `max`, cortando también donde cierra una idea.
 *
 * Sin transcripción, decidido el 2026-09-13: el desfase de una palabra suelta
 * puede ser de décimas, pero en grupos de tres o cuatro no se nota.
 */
export function subtitulosDe(
  texto: string,
  inicio: number,
  duracion: number,
  max = MAX_PALABRAS_SUBTITULO,
): Subtitulo[] {
  const palabras = texto.split(/\s+/).filter(Boolean);
  if (palabras.length === 0 || duracion <= 0) return [];

  const peso = (palabra: string) => palabra.length + 1;
  const total = palabras.reduce((suma, palabra) => suma + peso(palabra), 0);

  const grupos: string[][] = [];
  let actual: string[] = [];
  for (const palabra of palabras) {
    actual.push(palabra);
    // Se corta al llegar al tope, o donde termina una frase. **No en las comas**:
    // con ellas una enumeración deja palabras sueltas, y en pantalla se lee un
    // subtítulo que dice «reportes.» y nada más. Visto en el render del paso 0.
    if (actual.length >= max || /[.?!]$/.test(palabra)) {
      grupos.push(actual);
      actual = [];
    }
  }
  if (actual.length > 0) grupos.push(actual);

  // Una palabra sola en pantalla se lee mal, pero «Sí.» sí es un subtítulo: lo que
  // sobra es la **cola de una frase que el tope partió**. Se distinguen por lo que
  // hay antes: si el grupo anterior no cerró frase, esta palabra es su cola y vuelve
  // con ella, aunque el grupo quede en cinco.
  for (let i = grupos.length - 1; i > 0; i--) {
    const anterior = grupos[i - 1];
    if (grupos[i].length === 1 && !/[.?!]$/.test(anterior[anterior.length - 1])) {
      anterior.push(...grupos[i]);
      grupos.splice(i, 1);
    }
  }

  const subtitulos: Subtitulo[] = [];
  let acumulado = 0;
  for (const grupo of grupos) {
    const desde = inicio + (acumulado / total) * duracion;
    acumulado += grupo.reduce((suma, palabra) => suma + peso(palabra), 0);
    const hasta = inicio + (acumulado / total) * duracion;
    subtitulos.push({ texto: grupo.join(' '), inicio: redondear(desde), fin: redondear(hasta) });
  }
  return subtitulos;
}

/**
 * Las escenas del Reel, una por párrafo, a partir de lo que dura la voz de cada
 * uno. Cada escena empieza donde acaba la anterior: es lo que hace que el corte
 * caiga en la palabra correcta sin transcribir nada.
 */
export function escenasDesde(
  parrafos: string[],
  duracionesVoz: number[],
): { escenas: Escena[]; total: number } {
  if (parrafos.length !== duracionesVoz.length) {
    throw new Error(
      `${parrafos.length} párrafos y ${duracionesVoz.length} audios: tienen que coincidir`,
    );
  }

  const escenas: Escena[] = [];
  let reloj = 0;
  parrafos.forEach((texto, i) => {
    const antes = i === 0 ? ENTRADA : 0;
    const despues = i === parrafos.length - 1 ? COLA : PAUSA_ENTRE_ESCENAS;
    const voz = duracionesVoz[i];
    escenas.push({
      indice: i,
      inicio: redondear(reloj),
      duracion: redondear(antes + voz + despues),
      voz: redondear(reloj + antes),
      subtitulos: subtitulosDe(texto, redondear(reloj + antes), voz),
    });
    reloj += antes + voz + despues;
  });

  return { escenas, total: redondear(reloj) };
}
