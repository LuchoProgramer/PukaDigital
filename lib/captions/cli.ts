import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { componer } from './componer.ts';
import { generarCaption } from './gemini.ts';
import { franjaSiguiente } from '../publicar/programado.ts';
import type { Pieza } from '../piezas/tipos.ts';

function argumento(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

function mesActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

async function main() {
  const mes = argumento('mes') ?? mesActual();
  const soloId = argumento('id');
  const usarFallback = process.argv.includes('--fallback');

  const ruta = pathToFileURL(join(process.cwd(), 'content', 'piezas', `${mes}.ts`)).href;
  const todas: Pieza[] = (await import(ruta)).default;

  const piezas = soloId ? todas.filter((p) => p.id === soloId) : todas;
  if (piezas.length === 0) {
    console.error(`No hay piezas con id ${soloId} en ${mes}.`);
    process.exit(1);
  }

  console.log(`\nGenerando captions de Facebook para ${piezas.length} pieza(s) en ${mes}...\n`);

  for (const pieza of piezas) {
    let caption: string;
    let origen: string;

    if (usarFallback || !process.env.API_KEY) {
      caption = componer(pieza);
      origen = 'compositor determinista';
    } else {
      try {
        caption = await generarCaption(pieza);
        origen = 'Gemini';
      } catch (e) {
        console.warn(`Aviso: Gemini falló para ${pieza.id}, usando compositor determinista. (${e instanceof Error ? e.message : e})`);
        caption = componer(pieza);
        origen = 'compositor determinista (fallback)';
      }
    }

    const fechaFB = pieza.facebook?.publicarEl ?? (pieza.publicarEl ? franjaSiguiente(pieza.publicarEl) : undefined);

    console.log(`// ─── ${pieza.id} (${origen}) ───`);
    console.log(`facebook: {`);
    if (fechaFB) {
      console.log(`  publicarEl: '${fechaFB}',`);
    }
    console.log(`  caption:\n${JSON.stringify(caption, null, 4)},`);
    console.log(`},\n`);
  }

  console.log('Copia y pega los bloques anteriores dentro del array en content/piezas/' + mes + '.ts');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
