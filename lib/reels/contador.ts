export interface NumeroDesglosado {
  prefijo: string;
  numero: number;
  decimales: number;
  sufijo: string;
}

export interface FotogramaContador {
  tiempo: number;
  texto: string;
}

/**
 * Desglosa un string que contiene un único valor numérico en prefijo,
 * número, cantidad de decimales y sufijo.
 * Si el valor no es operable (ej. "24/7", comas de miles, sin números), devuelve null.
 */
export function desglosarNumero(valor: string): NumeroDesglosado | null {
  if (!valor || valor.includes('/') || valor.includes(',')) {
    return null;
  }

  // Captura prefijo no numérico, número único (entero o decimal con punto) y sufijo no numérico
  const match = valor.match(/^([^0-9.]*?)(\d+(?:\.\d+)?)([^0-9.]*)$/);
  if (!match) {
    return null;
  }

  const [, prefijo, numStr, sufijo] = match;
  const numero = parseFloat(numStr);
  if (Number.isNaN(numero)) {
    return null;
  }

  const puntoIndex = numStr.indexOf('.');
  const decimales = puntoIndex >= 0 ? numStr.length - puntoIndex - 1 : 0;

  return {
    prefijo,
    numero,
    decimales,
    sufijo,
  };
}

/**
 * Genera la secuencia determinista de texto para cada fotograma a 30 fps
 * durante un tiempo máximo de 1.0 segundo con curva power2.out.
 * El último fotograma es estrictamente el valor literal original.
 */
export function calcularFotogramasContador(
  valor: string,
  opciones?: { fps?: number; duracionMax?: number }
): FotogramaContador[] | null {
  const desglosado = desglosarNumero(valor);
  if (!desglosado) {
    return null;
  }

  const fps = opciones?.fps ?? 30;
  const duracion = Math.min(opciones?.duracionMax ?? 1.0, 1.0);
  const totalFrames = Math.max(1, Math.round(fps * duracion));
  const frames: FotogramaContador[] = [];

  for (let k = 0; k <= totalFrames; k++) {
    const t = Number((k / fps).toFixed(4));

    // El último fotograma siempre es el literal original exacto
    if (k === totalFrames) {
      frames.push({ tiempo: t, texto: valor });
      continue;
    }

    const progreso = k / totalFrames;
    // Curva easeOut (power2.out: 1 - (1 - p)^2)
    const easing = 1 - (1 - progreso) * (1 - progreso);
    const valorIntermedio = easing * desglosado.numero;

    const vStr =
      desglosado.decimales === 0
        ? Math.round(valorIntermedio).toString()
        : valorIntermedio.toFixed(desglosado.decimales);

    frames.push({
      tiempo: t,
      texto: `${desglosado.prefijo}${vStr}${desglosado.sufijo}`,
    });
  }

  return frames;
}
