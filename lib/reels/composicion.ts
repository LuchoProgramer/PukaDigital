// lib/reels/composicion.ts
import { AVISO, FONDO_AVISO, medidasAviso } from '../piezas/capturas.ts';
import { FORMATOS, MARGEN } from '../piezas/formatos.ts';
import { sistemas } from '../piezas/sistemas.ts';
import type { Fuente } from '../piezas/fuentes.ts';
import type { Pieza } from '../piezas/tipos.ts';
import type { Escena } from './tiempos.ts';

export const ANCHO = 1080;
export const ALTO = 1920;

/**
 * Dark Glass Rojo usa en web vidrio a 0.04 y bordes de 1 px a 0.08: tras la
 * compresión H.264 desaparecen. En video, los colores y las tipografías son los
 * del sistema; la opacidad y el grosor, estos.
 */
export const VIDRIO_VIDEO = {
  fondo: 'rgba(255,255,255,0.10)',
  borde: 'rgba(255,255,255,0.22)',
  grosor: 3,
} as const;

/** `PUKAHEALTH_LIMITES.md`: barra en `#0D1717` con el texto blanco, centrado. */
export const TEXTO_AVISO = '#FFFFFF';

export type EntradaComposicion = {
  pieza: Pieza;
  escenas: Escena[];
  total: number;
  /** El archivo de voz de cada escena, relativo al `index.html`. */
  audios: string[];
  /**
   * El archivo de GSAP, relativo al `index.html`. **Va como archivo, no en
   * línea**: el lint de HyperFrames analiza los scripts en línea, y GSAP usa
   * `Math.random()` y `Date.now()` por dentro, así que `render --strict` aborta
   * con `non_deterministic_code`. Medido en el render del paso 0, el 2026-09-13.
   */
  gsapArchivo: string;
  fuentes: Fuente[];
  /** La captura como data URI. Inyectable para no leer disco en los tests. */
  cargarCaptura: (archivo: string) => string;
};

export function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function idComposicion(pieza: Pieza): string {
  return `reel-${pieza.id}`;
}

export function composicion(entrada: EntradaComposicion): string {
  const { pieza, escenas, total, audios } = entrada;
  if (escenas.length !== pieza.slides.length || audios.length !== escenas.length) {
    throw new Error(
      `${pieza.slides.length} slides, ${escenas.length} escenas y ${audios.length} audios: tienen que coincidir`,
    );
  }

  const tokens = sistemas[pieza.sistema];
  const seguro = FORMATOS['9x16'];
  const aviso = medidasAviso(ALTO, ANCHO - 2 * MARGEN);
  const id = idComposicion(pieza);
  // El sistema claro no lleva vidrio: su tarjeta es el azul suave de la marca.
  const fondoTarjeta = tokens.glass ? VIDRIO_VIDEO.fondo : (tokens.suave ?? tokens.fondo);
  const bordeTarjeta = tokens.glass ? VIDRIO_VIDEO.borde : tokens.borde;

  const caras = entrada.fuentes
    .map(
      (fuente) =>
        `@font-face { font-family: '${fuente.name}'; src: url(data:font/ttf;base64,${fuente.data.toString('base64')}) format('truetype'); font-weight: ${fuente.weight}; font-style: normal; font-display: block; }`,
    )
    .join('\n');

  const css = `${caras}
html, body { margin: 0; width: ${ANCHO}px; height: ${ALTO}px; overflow: hidden; background: ${tokens.fondo}; }
#root { position: relative; width: ${ANCHO}px; height: ${ALTO}px; overflow: hidden; background: ${tokens.fondo}; color: ${tokens.tinta}; font-family: 'Instrument Sans', sans-serif; }
.clip { position: absolute; inset: 0; }
.contenido { position: absolute; left: ${MARGEN}px; right: ${MARGEN}px; top: ${seguro.seguroArriba}px; bottom: ${seguro.seguroAbajo + 200}px; display: flex; flex-direction: column; justify-content: center; gap: 36px; }
.badge { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 34px; letter-spacing: 0.08em; color: ${tokens.acento}; }
.titular { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 96px; line-height: 1.02; margin: 0; }
.bajada { font-size: 44px; line-height: 1.3; margin: 0; color: ${tokens.apoyo}; }
.dato { display: flex; align-items: baseline; gap: 20px; }
.dato-valor { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 120px; color: ${tokens.acento}; }
.dato-etiqueta { font-size: 40px; color: ${tokens.apoyo}; }
.tarjeta { background: ${fondoTarjeta}; border: ${VIDRIO_VIDEO.grosor}px solid ${bordeTarjeta}; border-radius: 28px; overflow: hidden; }
.captura { display: block; width: 100%; }
.aviso { height: ${aviso.alto}px; display: flex; align-items: center; justify-content: center; background: ${FONDO_AVISO}; color: ${TEXTO_AVISO}; font-size: ${aviso.fuente}px; font-weight: 600; }
.subtitulo { position: absolute; left: ${MARGEN}px; right: ${MARGEN}px; bottom: ${seguro.seguroAbajo + 40}px; text-align: center; opacity: 0; }
.subtitulo span { display: inline-block; padding: 12px 24px; border-radius: 16px; background: ${tokens.tinta}; color: ${tokens.fondo}; font-weight: 600; font-size: 56px; line-height: 1.2; }`;

  const secciones = escenas
    .map((escena, i) => {
      const slide = pieza.slides[i];
      const partes = [
        slide.badge ? `<div class="badge">${escapar(slide.badge)}</div>` : '',
        `<div class="titular">${escapar(slide.titular)}</div>`,
        slide.bajada ? `<p class="bajada">${escapar(slide.bajada)}</p>` : '',
        slide.dato
          ? `<div class="dato"><span class="dato-valor">${escapar(slide.dato.valor)}</span><span class="dato-etiqueta">${escapar(slide.dato.etiqueta)}</span></div>`
          : '',
        slide.captura
          ? `<div class="tarjeta"><img class="captura" src="${entrada.cargarCaptura(slide.captura)}" alt="" /><div class="aviso">${escapar(AVISO)}</div></div>`
          : '',
      ]
        .filter(Boolean)
        .join('\n        ');

      const subtitulos = escena.subtitulos
        .map((sub, j) => `<div class="subtitulo" id="s${i}-${j}"><span>${escapar(sub.texto)}</span></div>`)
        .join('\n      ');

      return `    <section id="escena-${i}" class="clip" data-start="${escena.inicio}" data-duration="${escena.duracion}" data-track-index="${i}">
      <div class="contenido" id="c${i}">
        ${partes}
      </div>
      ${subtitulos}
    </section>`;
    })
    .join('\n');

  const voces = escenas
    .map(
      (escena, i) =>
        `    <audio id="voz-${i}" src="${escapar(audios[i])}" data-start="${escena.voz}" data-volume="1"></audio>`,
    )
    .join('\n');

  // Todo se construye de forma síncrona y sin `Math.random()`: el render seekea
  // la línea de tiempo fotograma a fotograma y tiene que dar siempre lo mismo.
  const pasos = escenas
    .flatMap((escena, i) => [
      `tl.fromTo('#c${i}', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, ${escena.inicio});`,
      ...escena.subtitulos.flatMap((sub, j) => [
        `tl.set('#s${i}-${j}', { opacity: 1 }, ${sub.inicio});`,
        `tl.set('#s${i}-${j}', { opacity: 0 }, ${sub.fin});`,
      ]),
    ])
    .join('\n      ');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${ANCHO}, height=${ALTO}" />
    <script src="${escapar(entrada.gsapArchivo)}"></script>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${id}" data-start="0" data-duration="${total}" data-width="${ANCHO}" data-height="${ALTO}">
${secciones}
${voces}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      ${pasos}
      window.__timelines['${id}'] = tl;
    </script>
  </body>
</html>
`;
}
