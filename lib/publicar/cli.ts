import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { archivosDe, publicarPieza, urlPublica } from './meta.ts';
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
  const id = argumento('id');
  // Publicar no se deshace: hay que pedirlo explicitamente.
  const enSerio = process.argv.includes('--publicar');

  if (!id) {
    console.error('Falta --id <pieza>. Ejemplo: npm run publicar -- --id sri-rechazo-01');
    process.exit(1);
  }

  const ruta = pathToFileURL(join(process.cwd(), 'content', 'piezas', `${mes}.ts`)).href;
  const piezas: Pieza[] = (await import(ruta)).default;
  const pieza = piezas.find((p) => p.id === id);

  if (!pieza) {
    console.error(`No hay ninguna pieza con id ${id} en ${mes}.`);
    process.exit(1);
  }

  console.log(`${pieza.id} · ${pieza.producto ?? 'sin producto'} · ${pieza.slides.length} slide(s)`);
  for (const archivo of archivosDe(pieza)) console.log(`  ${urlPublica(mes, archivo)}`);
  console.log(`  caption: ${pieza.caption ?? '(vacio)'}`);

  if (!enSerio) {
    console.log('\nEnsayo. Nada se publico. Anade --publicar para hacerlo de verdad.');
    return;
  }

  const igUserId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !token) {
    console.error('\nFaltan IG_USER_ID o IG_ACCESS_TOKEN en el entorno.');
    process.exit(1);
  }

  console.log('\nPublicando...');
  const { id: publicado } = await publicarPieza(pieza, mes, { igUserId, token });
  console.log(`Publicado: ${publicado}`);
  console.log(`https://www.instagram.com/p/  (revisa el perfil para confirmarlo)`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
