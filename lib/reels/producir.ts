// lib/reels/producir.ts
import { join } from 'node:path';
import { parrafosDelGuion } from '../piezas/guion.ts';
import { formatear, validar } from '../piezas/validar.ts';
import type { Fuente } from '../piezas/fuentes.ts';
import type { Pieza } from '../piezas/tipos.ts';
import { composicion } from './composicion.ts';
import { generarGuion } from './guion.ts';
import { HYPERFRAMES, type Ejecutar } from './herramientas.ts';
import { argumentosSubida, claveReel, urlReel } from './r2.ts';
import { enviarVideo } from './telegram.ts';
import { escenasDesde } from './tiempos.ts';
import { ARGUMENTOS_FFPROBE, argumentosNormalizar, erroresDeVideo, type Ffprobe } from './verificacion.ts';

/** La voz elegida el 2026-09-13, escuchando cuatro candidatas. */
const VOZ = 'ef_dora';

export type Dependencias = {
  ejecutar: Ejecutar;
  llamarModelo: (prompt: string) => Promise<string>;
  leerArchivo: (ruta: string) => Uint8Array;
  escribirArchivo: (ruta: string, contenido: string) => void;
  crearCarpeta: () => string;
  gsap: string;
  fuentes: Fuente[];
  cargarCaptura: (archivo: string) => string;
  /** Sin `r2` es un ensayo: se renderiza y se verifica, pero no se sube nada. */
  r2?: { bucket: string; baseUrl: string };
  telegram?: { token: string; chatId: string };
  /** El Python con `kokoro-onnx` y `soundfile`, para `hyperframes tts`. */
  python?: string;
  regenerarGuion: boolean;
  avisar: (mensaje: string) => void;
  /** Inyectable para probar el aviso sin red. */
  enviar?: typeof enviarVideo;
};

export type ReelProducido = {
  guion: string;
  caption: string;
  /** URL pública en R2, o cadena vacía en un ensayo. */
  video: string;
  duracion: number;
  archivo: string;
};

export async function producirReel(
  pieza: Pieza,
  mes: string,
  d: Dependencias,
): Promise<ReelProducido> {
  // 1. El guion revisado a mano manda, salvo que se pida rehacerlo.
  const escrito = pieza.reel;
  const { guion, caption } =
    escrito && escrito.guion.trim() !== '' && escrito.caption.trim() !== '' && !d.regenerarGuion
      ? { guion: escrito.guion, caption: escrito.caption }
      : await generarGuion(pieza, d.llamarModelo);

  // 2. Antes de gastar minutos renderizando: las mismas puertas que un caption.
  const candidata: Pieza = { ...pieza, reel: { guion, caption, publicarEl: pieza.reel?.publicarEl } };
  const errores = validar([candidata]);
  if (errores.length > 0) {
    throw new Error(`El guion no pasa la validación:\n${formatear(errores)}`);
  }

  const carpeta = d.crearCarpeta();
  const entorno = {
    HYPERFRAMES_NO_TELEMETRY: '1',
    ...(d.python ? { HYPERFRAMES_PYTHON: d.python } : {}),
  };
  const parrafos = parrafosDelGuion(guion);

  // 3. Una voz por párrafo, y lo que dura cada una: ahí se corta la escena.
  const audios: string[] = [];
  const duraciones: number[] = [];
  for (const [i, parrafo] of parrafos.entries()) {
    const audio = `voz-${i}.wav`;
    await d.ejecutar('npx', ['-y', HYPERFRAMES, 'tts', parrafo, '--voice', VOZ, '--output', audio], {
      cwd: carpeta,
      env: entorno,
    });
    const { stdout } = await d.ejecutar(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio],
      { cwd: carpeta },
    );
    const segundos = Number.parseFloat(stdout);
    if (!(segundos > 0)) {
      throw new Error(`No se pudo medir la voz del párrafo ${i + 1}: «${stdout.trim()}»`);
    }
    audios.push(audio);
    duraciones.push(segundos);
  }

  // 4. La composición y el render.
  const { escenas, total } = escenasDesde(parrafos, duraciones);
  // GSAP se escribe como archivo, no en línea: en línea el lint lo lee como
  // código propio y aborta el render por el `Math.random()` que es suyo.
  const GSAP_ARCHIVO = 'gsap.min.js';
  d.escribirArchivo(join(carpeta, GSAP_ARCHIVO), d.gsap);
  d.escribirArchivo(
    join(carpeta, 'index.html'),
    composicion({
      pieza,
      escenas,
      total,
      audios,
      gsapArchivo: GSAP_ARCHIVO,
      fuentes: d.fuentes,
      cargarCaptura: d.cargarCaptura,
    }),
  );
  await d.ejecutar('npx', ['-y', HYPERFRAMES, 'render', '.', '-o', 'render.mp4', '--strict'], {
    cwd: carpeta,
    env: entorno,
  });
  await d.ejecutar('ffmpeg', argumentosNormalizar('render.mp4', 'reel.mp4'), { cwd: carpeta });

  // 5. Lo que exige Meta, sobre el MP4 real. Si no cumple, no se sube nada.
  const { stdout: json } = await d.ejecutar('ffprobe', ARGUMENTOS_FFPROBE('reel.mp4'), { cwd: carpeta });
  const probe = JSON.parse(json) as Ffprobe;
  const fallos = erroresDeVideo(probe);
  if (fallos.length > 0) {
    throw new Error(`El MP4 no cumple lo que exige Meta:\n  - ${fallos.join('\n  - ')}`);
  }

  const archivo = join(carpeta, 'reel.mp4');
  const bytes = d.leerArchivo(archivo);
  const duracion = Math.round(Number(probe.format.duration) * 10) / 10;

  // 6. R2. Sin configurarlo es un ensayo.
  let video = '';
  if (d.r2) {
    const clave = claveReel(mes, pieza.id, bytes);
    await d.ejecutar('npx', argumentosSubida(d.r2.bucket, clave, archivo));
    video = urlReel(d.r2.baseUrl, clave);
  } else {
    d.avisar('Ensayo: el MP4 no se subió a R2.');
  }

  // 7. Telegram no es fatal: el render y la subida ya costaron minutos.
  if (d.telegram) {
    try {
      await (d.enviar ?? enviarVideo)({ nombre: `${pieza.id}.mp4`, bytes }, caption, d.telegram);
    } catch (error) {
      d.avisar(`No se pudo mandar a Telegram: ${error instanceof Error ? error.message : error}`);
    }
  } else {
    d.avisar('Telegram sin configurar: revisa el video en el archivo local.');
  }

  return { guion, caption, video, duracion, archivo };
}
