import { piezasDe } from '../../content/piezas/index.ts';
import { archivosDe, publicarPieza, urlPublica } from './meta.ts';
import { publicarPiezaFacebook } from './facebook.ts';
import { captionFacebook } from './programado.ts';

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
  const esFacebook = process.argv.includes('--facebook');

  if (!id) {
    console.error('Falta --id <pieza>. Ejemplo: npm run publicar -- --id sri-rechazo-01');
    process.exit(1);
  }

  const piezas = piezasDe(mes);
  if (!piezas) {
    console.error(`El mes ${mes} no esta en MESES (content/piezas/index.ts). El cron tampoco lo veria.`);
    process.exit(1);
  }
  const pieza = piezas.find((p) => p.id === id);

  if (!pieza) {
    console.error(`No hay ninguna pieza con id ${id} en ${mes}.`);
    process.exit(1);
  }

  console.log(`${pieza.id} · ${pieza.producto ?? 'sin producto'} · ${pieza.slides.length} slide(s)`);
  if (esFacebook) {
    console.log(`  ${urlPublica(mes, `${pieza.id}-fb.png`)}`);
    console.log(`  caption: ${captionFacebook(pieza)}`);
  } else {
    for (const archivo of archivosDe(pieza)) console.log(`  ${urlPublica(mes, archivo)}`);
    console.log(`  caption: ${pieza.caption ?? '(vacio)'}`);
  }

  if (!enSerio) {
    console.log('\nEnsayo. Nada se publico. Anade --publicar para hacerlo de verdad.');
    return;
  }

  if (esFacebook) {
    const pageId = process.env.FB_PAGE_ID;
    const token = process.env.FB_PAGE_ACCESS_TOKEN;
    if (!pageId || !token) {
      console.error('\nFaltan FB_PAGE_ID o FB_PAGE_ACCESS_TOKEN en el entorno.');
      process.exit(1);
    }
    const { id: publicado } = await publicarPiezaFacebook(pieza, mes, { pageId, token });
    console.log(`Publicado en Facebook: https://facebook.com/${publicado}`);
  } else {
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
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
