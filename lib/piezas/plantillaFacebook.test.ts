import { test } from 'node:test';
import assert from 'node:assert/strict';
import satori from 'satori';
import { PlantillaFacebook } from './plantillaFacebook.tsx';
import { cargarFuentes } from './fuentes.ts';
import { sistemas } from './sistemas.ts';
import { FORMATOS } from './formatos.ts';

const fuentes = cargarFuentes();

async function render(imagen: Parameters<typeof PlantillaFacebook>[0]['imagen']) {
  const { ancho, alto } = FORMATOS['4x5'];
  return satori(PlantillaFacebook({ imagen, tokens: sistemas.puka }), {
    width: ancho,
    height: alto,
    fonts: fuentes,
  });
}

/**
 * Cuanto espacio vertical ocupa el titular dibujado.
 *
 * Satori vectoriza el texto, asi que no hay `<text>` que medir ni una altura de
 * caja fiable — el `<rect>` de mascara es el del lienzo entero. Lo que si vale
 * es el recorrido vertical de los glifos del primer `<path>`, que es el
 * titular: mas lineas lo agrandan, una fuente mas pequena lo encoge.
 */
function altoDelTitular(svg: string): number {
  const d = svg.match(/<path fill="[^"]*" d="([^"]*)"/)?.[1] ?? '';
  const ys = [...d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map((m) => Number(m[2]));
  return ys.length === 0 ? 0 : Math.max(...ys) - Math.min(...ys);
}

test('la imagen de Facebook no lleva contador de carrusel', async () => {
  // El post del 2026-09-09 salio con «01 / 05» impreso, prometiendo cuatro
  // imagenes que no existen. Este test es el que impide que vuelva.
  // ⚠️ NO buscar la cadena «01 / 05» en el SVG: Satori vectoriza el texto a
  // <path>, asi que esa cadena no aparece nunca y el test pasaria siempre — es
  // un test falso en verde. Lo comprobado el 2026-09-09.
  //
  // Lo que si distingue: Satori emite **un <path> por bloque de texto**. Con
  // titular y pie son 2; cualquier bloque de mas —un contador, por ejemplo— lo
  // sube a 3. Verificado por mutacion: inyectando un contador da 3.
  const svg = await render({ titular: 'Un titular de conclusion' });
  const bloques = (svg.match(/<path/g) ?? []).length;
  assert.equal(bloques, 2, `esperaba titular + pie y nada mas, hay ${bloques} bloques de texto`);
});

test('el salto de linea del titular sale de verdad, no se traga', async () => {
  // Sin `whiteSpace: pre-line` Satori normaliza el \n como espacio y el titular
  // sale en una sola linea. Comprobado el 2026-09-09: 48px contra 96px.
  const unaLinea = altoDelTitular(await render({ titular: 'AAAA BBBB' }));
  const dosLineas = altoDelTitular(await render({ titular: 'AAAA\nBBBB' }));
  assert.ok(
    dosLineas > unaLinea * 1.5,
    `el \\n debe ocupar mas alto: una linea ${unaLinea}, dos ${dosLineas}`,
  );
});

test('el dato aparece cuando se declara y no cuando no', async () => {
  const con = await render({ titular: 'Titular', dato: { valor: '166', etiqueta: 'sesiones' } });
  const sin = await render({ titular: 'Titular' });
  assert.ok(con.length > sin.length, 'con dato debe dibujar mas');
});

/**
 * Cubre lo que se vio mirando los PNG del 2026-09-09, no leyendo el codigo: un
 * titular de 9 palabras a tamano fijo desbordaba el ancho util y Satori lo
 * partia por su cuenta, justo donde el `\n` intentaba evitarlo. El titular se
 * encoge hasta que su linea mas larga quepa.
 */
test('un titular de lineas largas se encoge para caber; uno corto no', async () => {
  // Tres lineas cortas caben grandes; tres largas obligan a encoger, asi que el
  // titular ocupa menos alto pese a tener las mismas tres lineas.
  const corto = altoDelTitular(await render({ titular: 'Uno\nDos\nTres' }));
  const largo = altoDelTitular(
    await render({
      titular: 'Facturar al SRI: cuatro requisitos y ninguno\nes el software que uses\nni el que te vendan',
    }),
  );
  assert.ok(
    corto > largo,
    `el titular de lineas largas deberia encogerse: corto ${corto}, largo ${largo}`,
  );
});
