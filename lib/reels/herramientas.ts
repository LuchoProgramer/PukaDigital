// lib/reels/herramientas.ts
import { execFile } from 'node:child_process';

/**
 * La versión va fija: HyperFrames saca versión casi a diario, y un render que
 * cambia solo no es reproducible. Se invoca con `npx -y`, así que no entra como
 * dependencia del proyecto: `npm ci` no se trae Chrome ni ffmpeg.
 */
export const HYPERFRAMES = 'hyperframes@0.8.36';

export type Ejecutar = (
  comando: string,
  argumentos: string[],
  opciones?: { cwd?: string; env?: Record<string, string> },
) => Promise<{ stdout: string; stderr: string }>;

/**
 * La única capa que toca el sistema. Se inyecta en `producirReel`, y por eso los
 * tests no necesitan ffmpeg, ni Chrome, ni red.
 */
export const ejecutar: Ejecutar = (comando, argumentos, opciones = {}) =>
  new Promise((resolver, rechazar) => {
    execFile(
      comando,
      argumentos,
      { cwd: opciones.cwd, env: { ...process.env, ...opciones.env }, maxBuffer: 64 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          // HyperFrames escribe sus errores en stdout, no en stderr: sin mirar los
          // dos, un render abortado por el lint deja un «Command failed» sin motivo.
          const salida = stderr.trim() || stdout.trim();
          const detalle = salida.split('\n').slice(-6).join(' | ') || error.message;
          rechazar(new Error(`${comando} ${argumentos.slice(0, 3).join(' ')} falló: ${detalle}`));
        } else {
          resolver({ stdout, stderr });
        }
      },
    );
  });
