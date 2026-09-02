import { mkdir, readdir, writeFile } from 'node:fs/promises';
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

const DIR_CONTENIDO = join(process.cwd(), 'content', 'piezas');

/** pathToFileURL: en ESM un import() de ruta absoluta falla sin el esquema file:// */
async function cargarMes(mes: string): Promise<Pieza[]> {
  const ruta = pathToFileURL(join(DIR_CONTENIDO, `${mes}.ts`)).href;
  return (await import(ruta)).default;
}

async function mesesDisponibles(): Promise<string[]> {
  const archivos = await readdir(DIR_CONTENIDO).catch(() => [] as string[]);
  return archivos.filter((a) => /^\d{4}-\d{2}\.ts$/.test(a)).map((a) => a.replace(/\.ts$/, '')).sort();
}

/**
 * Valida todos los meses del repositorio. Cada uno por separado: los ids solo
 * tienen que ser únicos dentro de su mes.
 *
 * Sin --mes se validan todos y no solo el actual, para que el 1 de octubre —con
 * el archivo del mes todavía sin escribir— el build no se rompa solo.
 */
async function comprobarTodos(): Promise<void> {
  const meses = await mesesDisponibles();
  if (meses.length === 0) {
    console.log('No hay meses que validar.');
    return;
  }

  let fallos = 0;
  for (const mes of meses) {
    const piezas = await cargarMes(mes);
    const errores = validar(piezas);
    if (errores.length > 0) {
      console.error(`${errores.length} error(es) en ${mes}:\n${formatear(errores)}`);
      fallos++;
    } else {
      console.log(`${piezas.length} pieza(s) validas en ${mes}.`);
    }
  }
  if (fallos > 0) process.exit(1);
}

async function main() {
  const mesPedido = argumento('mes');
  const soloId = argumento('id');
  const soloCheck = process.argv.includes('--check');

  if (soloCheck && !mesPedido) {
    await comprobarTodos();
    return;
  }

  const mes = mesPedido ?? mesActual();
  const todas: Pieza[] = await cargarMes(mes);

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
