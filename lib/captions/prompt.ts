import { CATALOGO } from '../piezas/catalogo.ts';
import { PROHIBIDAS } from '../piezas/prohibidas.ts';
import type { Pieza } from '../piezas/tipos.ts';

export function construirPrompt(pieza: Pieza): string {
  const producto = pieza.producto ? CATALOGO[pieza.producto] : undefined;

  let reglasProducto = '';
  if (producto) {
    reglasProducto = `
PRODUCTO: ${producto.nombre}
- URL canónica: pukadigital.com${producto.url}
- Precios oficiales: ${producto.precios.length > 0 ? producto.precios.map((p) => `$${p}`).join(', ') : 'Sin precio visible (cotización por WhatsApp)'}
- Ofertas permitidas: ${producto.ofertas.length > 0 ? producto.ofertas.join(', ') : 'Ninguna'}
`;
  } else {
    reglasProducto = `
PRODUCTO: Pieza de utilidad (sin producto específico de venta).
- URL de cierre: pukadigital.com
- No menciones precios ni ofertas comerciales.
`;
  }

  let reglasProhibidas = '';
  if (pieza.producto === 'pukahealth') {
    reglasProhibidas = `
AFIRMACIONES ESTRICTAMENTE PROHIBIDAS (PukaHealth):
${PROHIBIDAS.map((p) => `- Prohibido: ${p.motivo}. En su lugar: ${p.enCambio}`).join('\n')}
`;
  }

  const slidesTexto = pieza.slides
    .map((s, i) => {
      let linea = `Slide ${i + 1}: ${s.titular}`;
      if (s.dato) linea += ` [Dato: ${s.dato.valor} ${s.dato.etiqueta}]`;
      if (s.bajada) linea += `\n  ${s.bajada}`;
      return linea;
    })
    .join('\n');

  return `Actúa como redactor experto de contenido para Facebook de PukaDigital (pukadigital.com).
Tu tarea es escribir un caption largo y argumentativo para una publicación en Facebook basada en las slides de un carrusel de redes sociales.

${reglasProducto}
${reglasProhibidas}

CONTENIDO DE LAS SLIDES:
${slidesTexto}

REGLAS EDITORIALES PARA FACEBOOK:
1. Formato: Texto largo estructurado en párrafos legibles con saltos de línea entre bloques.
2. Argumento completo: Desarrolla la narrativa de las slides para que quien lo lea en Facebook reciba el valor entero sin necesitar deslizar.
3. Diferenciación: Debe ser una redacción nativa y fresca, distinta al caption breve de Instagram.
4. CERO HASHTAGS: Está terminantemente prohibido incluir hashtags (#). En Facebook no aportan alcance.
5. Cierre: Concluye siempre con la URL canónica indicada arriba.
6. Hechos estrictos: No inventes precios ni características no autorizadas.

Devuelve ÚNICAMENTE el texto final del caption, sin introducciones ni comillas envolventes.`;
}
