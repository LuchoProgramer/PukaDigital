// lib/reels/cli.ts
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { piezasDe } from '../../content/piezas/index.ts';
import { cargarCaptura } from '../piezas/capturas.ts';
import { cargarFuentes } from '../piezas/fuentes.ts';
import { bloqueReel } from './bloque.ts';
import { llamarGemini } from './guion.ts';
import { ejecutar } from './herramientas.ts';
import { producirReel } from './producir.ts';

const USO = 'Uso: npm run reels -- --mes 2026-10 --id <pieza> [--ensayo] [--regenerar-guion]';

function argumento(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main(): Promise<void> {
  const mes = argumento('mes');
  const id = argumento('id');
  if (!mes || !id) throw new Error(USO);

  const pieza = piezasDe(mes)?.find((p) => p.id === id);
  if (!pieza) {
    throw new Error(`No hay una pieza «${id}» en ${mes}. ¿Está el mes registrado en content/piezas/index.ts?`);
  }

  const ensayo = process.argv.includes('--ensayo');
  const bucket = process.env.R2_BUCKET;
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!ensayo && (!bucket || !baseUrl)) {
    throw new Error('Faltan R2_BUCKET y R2_PUBLIC_BASE_URL en .env.local. Para probar sin subir nada: --ensayo.');
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const reel = await producirReel(pieza, mes, {
    ejecutar,
    llamarModelo: llamarGemini(process.env.API_KEY),
    leerArchivo: (ruta) => readFileSync(ruta),
    escribirArchivo: (ruta, contenido) => writeFileSync(ruta, contenido),
    crearCarpeta: () => mkdtempSync(join(tmpdir(), `reel-${id}-`)),
    gsap: readFileSync(join(process.cwd(), 'node_modules', 'gsap', 'dist', 'gsap.min.js'), 'utf8'),
    fuentes: cargarFuentes(),
    cargarCaptura,
    r2: !ensayo && bucket && baseUrl ? { bucket, baseUrl } : undefined,
    telegram: token && chatId ? { token, chatId } : undefined,
    python: process.env.HYPERFRAMES_PYTHON,
    regenerarGuion: process.argv.includes('--regenerar-guion'),
    avisar: (mensaje) => console.warn(`⚠️  ${mensaje}`),
  });

  console.log(`\nMP4 local: ${reel.archivo} · ${reel.duracion} s`);
  if (reel.video === '') {
    console.log('Ensayo: no se subió nada. Míralo, y cuando esté bien corre el comando sin --ensayo.');
    return;
  }
  console.log(`Subido: ${reel.video}\n\nPega este bloque dentro de la pieza «${id}» en content/piezas/${mes}.ts:\n`);
  console.log(bloqueReel(reel));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
