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
  const unaLinea = await render({ titular: 'AAAA BBBB' });
  const dosLineas = await render({ titular: 'AAAA\nBBBB' });
  const alto = (svg: string) => {
    const m = svg.match(/<rect x="88" y="88" width="\d+" height="(\d+)"/);
    return m ? Number(m[1]) : 0;
  };
  assert.ok(
    alto(dosLineas) > alto(unaLinea),
    `el \\n debe ocupar mas alto: una linea ${alto(unaLinea)}px, dos ${alto(dosLineas)}px`,
  );
});

test('el dato aparece cuando se declara y no cuando no', async () => {
  const con = await render({ titular: 'Titular', dato: { valor: '166', etiqueta: 'sesiones' } });
  const sin = await render({ titular: 'Titular' });
  assert.ok(con.length > sin.length, 'con dato debe dibujar mas');
});
