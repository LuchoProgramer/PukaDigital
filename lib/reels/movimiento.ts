import { PAUSA_ENTRE_ESCENAS, type Escena } from './tiempos.ts';
import { calcularFotogramasContador } from './contador.ts';
import type { Pieza, Sistema } from '../piezas/tipos.ts';

export interface EnergiaSistema {
  salidaDuracion: number;
  salidaScale: number;
  salidaBlur: number;
  salidaEase: string;

  entradaDuracion: number;
  entradaScale: number;
  entradaBlur: number;
  entradaEase: string;

  titularEase: string;
  titularStagger: number;

  subtituloEase: string;
  subtituloDuracion: number;

  respiracionScale: number;
  brilloOpacidad: number;
}

export const ENERGIAS: Record<Sistema, EnergiaSistema> = {
  puka: {
    salidaDuracion: 0.3,
    salidaScale: 1.4,
    salidaBlur: 30,
    salidaEase: 'power2.in',

    entradaDuracion: 0.4,
    entradaScale: 0.8,
    entradaBlur: 30,
    entradaEase: 'power2.out',

    titularEase: 'back.out(1.4)',
    titularStagger: 0.08,

    subtituloEase: 'back.out(2.2)',
    subtituloDuracion: 0.22,

    respiracionScale: 1.05,
    brilloOpacidad: 0.3,
  },
  health: {
    // Regla: salida <= PAUSA_ENTRE_ESCENAS (0.4)
    salidaDuracion: 0.4,
    salidaScale: 1.12,
    salidaBlur: 14,
    salidaEase: 'sine.in',

    entradaDuracion: 0.8,
    entradaScale: 0.94,
    entradaBlur: 14,
    entradaEase: 'sine.out',

    titularEase: 'power3.out',
    titularStagger: 0.1,

    subtituloEase: 'sine.out',
    subtituloDuracion: 0.3,

    respiracionScale: 1.025,
    brilloOpacidad: 0.1,
  },
};

function escaparJS(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Genera la coreografía y las instrucciones de GSAP para la composición del Reel.
 * Garantiza:
 * 1. Portada no negra: el fotograma 0 arranca con la escena 1 visible.
 * 2. Transiciones de escena fluidas (zoom a través).
 * 3. Subtítulos independientes con rebote adaptado a la energía de la marca.
 * 4. Capturas con zoom continuo o foco centrado a coordenadas relativas.
 * 5. Contador frame a frame determinista para datos numéricos.
 * 6. Sin bucles infinitos (repeat: -1) para compatibilidad con render --strict.
 */
export function coreografiaReel(
  pieza: Pieza,
  escenas: Escena[],
  total: number
): string {
  const energia = ENERGIAS[pieza.sistema];
  const lineas: string[] = [];

  // Brillo ambiental de fondo con repeticiones finitas
  const repeticionesBrillo = Math.max(1, Math.ceil(total / 3));
  lineas.push(
    `tl.to('#brillo-fondo', { x: 80, y: -60, duration: 3, yoyo: true, repeat: ${repeticionesBrillo}, ease: 'sine.inOut' }, 0);`
  );

  escenas.forEach((escena, i) => {
    const slide = pieza.slides[i];
    const esPrimera = i === 0;
    const esUltima = i === escenas.length - 1;

    if (esPrimera) {
      // 🔴 FOTOGRAMA 0 VISIBLE: En t=0 todo arranca listo para que la portada no salga negra
      lineas.push(
        `tl.set('#c0', { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }, 0);`,
        `tl.set('#c0 .palabra', { opacity: 1, yPercent: 0 }, 0);`
      );
      if (slide.badge) {
        lineas.push(`tl.set('#c0 .badge', { opacity: 1, letterSpacing: '0.08em' }, 0);`);
      }
      if (slide.bajada) {
        lineas.push(
          `tl.fromTo('#c0 .bajada', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);`
        );
      }
    } else {
      // Entrada de escena posterior
      lineas.push(
        `tl.fromTo('#c${i}', { opacity: 0, scale: ${energia.entradaScale}, filter: 'blur(${energia.entradaBlur}px)', y: 0 }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: ${energia.entradaDuracion}, ease: '${energia.entradaEase}' }, ${escena.inicio});`
      );

      if (slide.badge) {
        lineas.push(
          `tl.fromTo('#c${i} .badge', { letterSpacing: '0.5em', opacity: 0 }, { letterSpacing: '0.08em', opacity: 1, duration: 0.7, ease: 'expo.out' }, ${escena.inicio});`
        );
      }

      lineas.push(
        `tl.fromTo('#c${i} .palabra', { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: ${energia.titularStagger}, ease: '${energia.titularEase}' }, ${escena.inicio + 0.1});`
      );

      if (slide.bajada) {
        lineas.push(
          `tl.fromTo('#c${i} .bajada', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, ${escena.inicio + 0.4});`
        );
      }
    }

    // Respiración sutil del contenido mientras habla Dora
    const duracionRespiracion = escena.duracion - (esUltima ? 0 : energia.salidaDuracion);
    lineas.push(
      `tl.to('#c${i}', { scale: ${energia.respiracionScale}, duration: ${duracionRespiracion}, ease: 'none' }, ${escena.inicio});`
    );

    // Transición de salida de escena (hacia el espectador con desenfoque)
    if (!esUltima) {
      const tSalida = Number((escena.inicio + escena.duracion - energia.salidaDuracion).toFixed(3));
      lineas.push(
        `tl.to('#c${i}', { opacity: 0, scale: ${energia.salidaScale}, filter: 'blur(${energia.salidaBlur}px)', duration: ${energia.salidaDuracion}, ease: '${energia.salidaEase}' }, ${tSalida});`
      );
    }

    // Animación de captura (foco o zoom continuo)
    if (slide.captura) {
      lineas.push(
        `tl.fromTo('#cap-${i}', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, ${escena.inicio + 0.2});`
      );

      if (slide.foco) {
        const tFoco = Number((escena.inicio + 2.0).toFixed(3));
        const escalaFoco = slide.foco.escala ?? 2;
        const origX = Number((slide.foco.x * 100).toFixed(1));
        const origY = Number((slide.foco.y * 100).toFixed(1));
        lineas.push(
          `tl.to('#cap-${i}', { scale: ${escalaFoco}, transformOrigin: '${origX}% ${origY}%', duration: 1.1, ease: 'power3.inOut' }, ${tFoco});`
        );
      } else {
        lineas.push(
          `tl.to('#cap-${i}', { scale: 1.15, transformOrigin: '30% 60%', duration: ${escena.duracion}, ease: 'none' }, ${escena.inicio});`
        );
      }
    }

    // Animación de dato (contador determinista o entrada suave)
    if (slide.dato) {
      const framesContador = calcularFotogramasContador(slide.dato.valor);
      const tDatoInicio = Number((escena.inicio + (esPrimera ? 0.3 : 0.55)).toFixed(3));

      if (framesContador && framesContador.length > 0) {
        for (const frame of framesContador) {
          const tFrame = Number((tDatoInicio + frame.tiempo).toFixed(3));
          lineas.push(
            `tl.set('#c${i} .dato-valor', { textContent: '${escaparJS(frame.texto)}' }, ${tFrame});`
          );
        }
        const tFinConteo = Number(
          (tDatoInicio + framesContador[framesContador.length - 1].tiempo).toFixed(3)
        );
        lineas.push(
          `tl.to('#c${i} .dato-valor', { scale: 1.12, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, ${tFinConteo});`
        );
      } else {
        lineas.push(
          `tl.fromTo('#c${i} .dato', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, ${tDatoInicio});`
        );
      }
    }

    // Subtítulos independientes (sin sufrir el blur o scale del contenedor de la escena)
    escena.subtitulos.forEach((sub, j) => {
      const idSub = `#s${i}-${j}`;
      lineas.push(
        `tl.fromTo('${idSub}', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: ${energia.subtituloDuracion}, ease: '${energia.subtituloEase}' }, ${sub.inicio});`,
        `tl.set('${idSub}', { opacity: 0 }, ${sub.fin});`
      );
    });
  });

  return lineas.join('\n      ');
}
