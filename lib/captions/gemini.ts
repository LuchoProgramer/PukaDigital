import { GoogleGenAI } from '@google/genai';
import { construirPrompt } from './prompt.ts';
import type { Pieza } from '../piezas/tipos.ts';

/**
 * ⚠️ La spec exige el Flash 3.x mas reciente, NO 2.5. Gemini 3 Flash existe
 * desde diciembre de 2025 y gana a 2.5 Pro en AIME, GPQA, HLE, SimpleQA y
 * SWE-Bench a una fraccion del precio; el plan original lo puso en 2.5 diciendo
 * que 3.x no estaba disponible, y eso es falso.
 *
 * **Verificar el id exacto antes de implementar**: la familia se mueve rapido y
 * ya iba por la 3.8 el 2026-09-02. A ~9 captions al mes el coste no es criterio.
 */
const MODELO_CAPTION = process.env.MODELO_CAPTION ?? 'gemini-3.8-flash';

/**
 * Genera el caption para Facebook llamando a la API de Gemini.
 */
export async function generarCaption(
  pieza: Pieza,
  apiKey = process.env.API_KEY,
  modelo = MODELO_CAPTION,
): Promise<string> {
  if (!apiKey) {
    throw new Error('Falta la variable de entorno API_KEY para Gemini.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = construirPrompt(pieza);

  const response = await ai.models.generateContent({
    model: modelo,
    contents: prompt,
  });

  const texto = response.text?.trim();
  if (!texto) {
    throw new Error(`Gemini no devolvió contenido para la pieza ${pieza.id}.`);
  }

  return texto;
}
