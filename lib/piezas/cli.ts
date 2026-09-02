import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderPieza } from './render.ts';
import { formatear, validar } from './validar.ts';
import type { Pieza } from './tipos.ts';

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
  const soloCheck = process.argv.includes('--check');

  // pathToFileURL: en ESM un import() de ruta absoluta falla sin el esquema file://
  const ruta = pathToFileURL(join(process.cwd(), 'content', 'piezas', `${mes}.ts`)).href;
  const todas: Pieza[] = (await import(ruta)).default;

  // Se valida el mes completo aunque se renderice una sola pieza: los ids
  // duplicados solo se ven mirando todo.
  const errores = validar(todas);
  if (errores.length > 0) {
    console.error(`${errores.length} error(es) en ${mes}:\n${formatear(errores)}`);
    process.exit(1);
  }

  if (soloCheck) {
    console.log(`${todas.length} pieza(s) validas en ${mes}.`);
    return;
  }

  const piezas = soloId ? todas.filter((p) => p.id === soloId) : todas;
  if (piezas.length === 0) {
    console.error(`No hay piezas con id ${soloId} en ${mes}.`);
    process.exit(1);
  }

  const destino = join(process.cwd(), 'public', 'piezas', mes);
  await mkdir(destino, { recursive: true });

  let escritos = 0;
  for (const pieza of piezas) {
    for (const { nombre, png } of await renderPieza(pieza)) {
      await writeFile(join(destino, nombre), png);
      console.log(`  public/piezas/${mes}/${nombre}`);
      escritos++;
    }
  }
  console.log(`${escritos} archivo(s) en public/piezas/${mes}/`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
