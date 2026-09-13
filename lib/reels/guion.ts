// lib/reels/guion.ts
import { GoogleGenAI } from '@google/genai';
import { CATALOGO } from '../piezas/catalogo.ts';
import { PROHIBIDAS } from '../piezas/prohibidas.ts';
import type { Pieza } from '../piezas/tipos.ts';

/** El mismo modelo que los captions de Facebook: el Flash 3.x más reciente. */
export const MODELO_REEL = process.env.MODELO_REEL ?? 'gemini-3.8-flash';

export type GuionGenerado = { guion: string; caption: string };

export function promptGuion(pieza: Pieza): string {
  const producto = pieza.producto ? CATALOGO[pieza.producto] : undefined;

  const hechos = producto
    ? `PRODUCTO: ${producto.nombre} (pukadigital.com${producto.url})
- Precios oficiales: ${producto.precios.length > 0 ? producto.precios.map((p) => `$${p}`).join(', ') : 'sin precio visible: no menciones precios'}
- Ofertas permitidas: ${producto.ofertas.length > 0 ? producto.ofertas.join(', ') : 'ninguna'}`
    : 'PRODUCTO: pieza de utilidad, no vende nada. No menciones precios ni ofertas.';

  const prohibidas =
    pieza.producto === 'pukahealth'
      ? `\nAFIRMACIONES PROHIBIDAS (PukaHealth):\n${PROHIBIDAS.map((p) => `- ${p.motivo}. En su lugar: ${p.enCambio}`).join('\n')}\n`
      : '';

  const slides = pieza.slides
    .map((slide, i) => {
      const dato = slide.dato ? ` [${slide.dato.valor} ${slide.dato.etiqueta}]` : '';
      const bajada = slide.bajada ? `\n  ${slide.bajada}` : '';
      return `Slide ${i + 1}: ${slide.titular}${dato}${bajada}`;
    })
    .join('\n');

  return `Escribe el guion hablado de un Reel vertical de PukaDigital, narrado en español neutro por una voz sintética, y el texto que acompaña al post.

${hechos}
${prohibidas}
LAS SLIDES DEL CARRUSEL, EN ORDEN:
${slides}

REGLAS DEL GUION:
1. Exactamente ${pieza.slides.length} párrafos, uno por slide y en el mismo orden, separados por una línea en blanco. Cada párrafo es una escena del video.
2. Entre 60 y 90 palabras en total: el Reel dura de 20 a 30 segundos.
3. El primer párrafo plantea el problema en los primeros 3 segundos. Nada de saludos ni de presentarse.
4. Escrito para oírse, no para leerse: frases cortas y completas, sin listas, sin emojis y sin símbolos. Los precios, en palabras ("catorce noventa y nueve").
5. No inventes nada: solo lo que dicen las slides y los hechos de arriba.

REGLAS DEL CAPTION:
1. Distinto del caption del carrusel${pieza.caption ? `, que es:\n"""${pieza.caption}"""` : ''}.
2. De dos a cuatro frases, sin hashtags, y cerrando con pukadigital.com${producto ? producto.url : ''}.

Devuelve SOLO un JSON con esta forma, sin texto alrededor:
{"guion": "párrafo uno\\n\\npárrafo dos", "caption": "..."}`;
}

/**
 * Quita la valla de un bloque de código, que Gemini pone la mitad de las veces.
 * El carácter va en escape Unicode y no literal: así esta función se puede pegar
 * dentro de un documento markdown sin cerrarle el bloque.
 */
function sinValla(texto: string): string {
  const valla = '`'.repeat(3);
  const lineas = texto.trim().split('\n');
  if (lineas.length > 1 && lineas[0].trimStart().startsWith(valla)) lineas.shift();
  if (lineas.length > 0 && lineas[lineas.length - 1].trimStart().startsWith(valla)) lineas.pop();
  return lineas.join('\n').trim();
}

export function leerRespuesta(texto: string): GuionGenerado {
  const limpio = sinValla(texto);
  let datos: unknown;
  try {
    datos = JSON.parse(limpio);
  } catch {
    throw new Error(`Gemini no devolvió un JSON válido: ${limpio.slice(0, 120)}`);
  }
  const { guion, caption } = datos as Partial<GuionGenerado>;
  if (typeof guion !== 'string' || guion.trim() === '' || typeof caption !== 'string' || caption.trim() === '') {
    throw new Error('Gemini devolvió un JSON sin guion o sin caption');
  }
  return { guion: guion.trim(), caption: caption.trim() };
}

export async function generarGuion(
  pieza: Pieza,
  llamar: (prompt: string) => Promise<string>,
): Promise<GuionGenerado> {
  return leerRespuesta(await llamar(promptGuion(pieza)));
}

/**
 * La llamada real. **No hay respaldo si falla**: un guion pegando las slides
 * suena a robot dicho en voz alta, y es peor que no tener Reel. Sin `API_KEY`
 * falla al llamarla, no al construirla: una pieza que ya trae guion no la
 * necesita.
 */
export function llamarGemini(
  apiKey: string | undefined,
  modelo = MODELO_REEL,
): (prompt: string) => Promise<string> {
  return async (prompt) => {
    if (!apiKey) {
      throw new Error('Falta API_KEY para escribir el guion con Gemini, o escribe reel.guion a mano en la pieza.');
    }
    const ai = new GoogleGenAI({ apiKey });
    const respuesta = await ai.models.generateContent({ model: modelo, contents: prompt });
    const texto = respuesta.text?.trim();
    if (!texto) {
      throw new Error('Gemini no devolvió contenido para el guion.');
    }
    return texto;
  };
}
