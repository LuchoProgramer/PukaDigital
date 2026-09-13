// lib/reels/verificacion.ts
/**
 * Lo que Meta exige a un Reel publicado por API, comprobado sobre el MP4 real.
 * De la documentación de IG User Media y de Page Video Reels, leída el
 * 2026-09-13: H.264 progresivo en 4:2:0, AAC a 48 kHz como máximo, de 23 a 60
 * fps, de 3 a 90 segundos —el techo es el de Facebook— y hasta 300 MB.
 */
export type Ffprobe = {
  streams: Array<{
    codec_type?: string;
    codec_name?: string;
    width?: number;
    height?: number;
    pix_fmt?: string;
    r_frame_rate?: string;
    sample_rate?: string;
    channels?: number;
  }>;
  format: { duration?: string; size?: string };
};

export const ARGUMENTOS_FFPROBE = (archivo: string): string[] => [
  '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', archivo,
];

/**
 * El render sale de Chrome y del ffmpeg de HyperFrames. Esta pasada deja el audio
 * en AAC a 48 kHz estéreo y **el índice del MP4 al principio** (`+faststart`):
 * Meta pide el «moov atom» delante. El video no se recodifica, así que es rápida.
 */
export const argumentosNormalizar = (entrada: string, salida: string): string[] => [
  '-y', '-i', entrada,
  '-c:v', 'copy',
  '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k',
  '-movflags', '+faststart',
  salida,
];

/** `30000/1001` son 29,97 fps: la fracción se divide, no se lee como entero. */
function cuadrosPorSegundo(fraccion: string | undefined): number {
  const [numerador, denominador] = (fraccion ?? '0/1').split('/').map(Number);
  return denominador ? numerador / denominador : 0;
}

export function erroresDeVideo(probe: Ffprobe): string[] {
  const errores: string[] = [];
  const video = probe.streams.find((pista) => pista.codec_type === 'video');
  const audio = probe.streams.find((pista) => pista.codec_type === 'audio');

  if (!video) {
    errores.push('no hay pista de video');
  } else {
    if (video.codec_name !== 'h264') {
      errores.push(`el video es ${video.codec_name}, tiene que ser h264`);
    }
    if (video.width !== 1080 || video.height !== 1920) {
      errores.push(`el video mide ${video.width}×${video.height}, tiene que ser 1080×1920`);
    }
    if (video.pix_fmt !== 'yuv420p') {
      errores.push(`el video usa ${video.pix_fmt}, tiene que ser yuv420p`);
    }
    const fps = cuadrosPorSegundo(video.r_frame_rate);
    if (fps < 23 || fps > 60) {
      errores.push(`${fps} fps, Meta admite de 23 a 60`);
    }
  }

  if (!audio) {
    errores.push('no hay pista de audio: el Reel lleva voz');
  } else {
    if (audio.codec_name !== 'aac') {
      errores.push(`el audio es ${audio.codec_name}, tiene que ser aac`);
    }
    if (audio.sample_rate !== '48000') {
      errores.push(`el audio va a ${audio.sample_rate} Hz, tiene que ir a 48000`);
    }
    if (!audio.channels || audio.channels > 2) {
      errores.push(`el audio tiene ${audio.channels} canales, Meta admite 1 o 2`);
    }
  }

  const duracion = Number(probe.format.duration);
  if (!(duracion >= 3 && duracion <= 90)) {
    errores.push(`dura ${probe.format.duration} s, Facebook admite de 3 a 90`);
  }
  const megas = Number(probe.format.size) / 1024 / 1024;
  if (megas > 300) {
    errores.push(`pesa ${megas.toFixed(0)} MB, Meta admite hasta 300`);
  }

  return errores;
}
