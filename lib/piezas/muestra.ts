import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { cargarFuentes } from './fuentes.ts';
import { FORMATOS } from './formatos.ts';
import { sistemas } from './sistemas.ts';
import { Plantilla } from './plantilla.tsx';
import { validar } from './validar.ts';
import type { Formato, Pieza, Sistema, Slide } from './tipos.ts';

const SLIDE_PUKA: Slide = {
  badge: 'SRI · FACTURACIÓN',
  titular: 'Facturación SRI en segundos',
  bajada:
    'Emite facturas electrónicas, retenciones y guías sin errores ni multas.',
  dato: {
    valor: '$15',
    etiqueta: 'al mes · sin IVA',
  },
  cta: 'Cotiza por WhatsApp',
};

const SLIDE_HEALTH: Slide = {
  badge: 'HISTORIA CLÍNICA',
  titular: 'Tu consultorio 100% digital',
  bajada:
    'Historias clínicas, recetas electrónicas y cobros SRI en una sola app médica.',
  dato: {
    valor: '30 días',
    etiqueta: 'de prueba gratis',
  },
  cta: 'Empieza gratis hoy',
};

const SISTEMAS_LIST: Sistema[] = ['puka', 'health'];
const FORMATOS_LIST: Formato[] = ['4x5', '1x1', '9x16'];

async function main() {
  console.log('🚀 Iniciando render de muestras de piezas de redes sociales...');

  // 1. Validar las piezas de muestra
  const piezasParaValidar: Pieza[] = [
    {
      id: 'muestra-puka',
      sistema: 'puka',
      producto: 'ledgerxpertz',
      formatos: FORMATOS_LIST,
      slides: [SLIDE_PUKA],
    },
    {
      id: 'muestra-health',
      sistema: 'health',
      producto: 'pukahealth',
      formatos: FORMATOS_LIST,
      slides: [SLIDE_HEALTH],
    },
  ];

  const errores = validar(piezasParaValidar);
  if (errores.length > 0) {
    console.error('❌ Errores de validación en las piezas de muestra:');
    for (const err of errores) {
      console.error(`  - ${err.pieza} [${err.campo}]: ${err.mensaje}`);
    }
    process.exit(1);
  }
  console.log('✔ Validación de contenido superada sin errores.');

  // 2. Cargar fuentes estáticas (.ttf) para Satori
  const fonts = cargarFuentes();
  console.log(`✔ ${fonts.length} fuentes cargadas para Satori.`);

  // 3. Crear directorio de destino
  const dirSalida = join(process.cwd(), 'public', 'piezas', 'muestra');
  mkdirSync(dirSalida, { recursive: true });

  // 4. Renderizar las 6 combinaciones (2 sistemas × 3 formatos)
  for (const sistema of SISTEMAS_LIST) {
    const tokens = sistemas[sistema];
    const slide = sistema === 'puka' ? SLIDE_PUKA : SLIDE_HEALTH;

    for (const formato of FORMATOS_LIST) {
      const { ancho, alto } = FORMATOS[formato];

      console.log(`🎨 Renderizando [${sistema}] en formato [${formato}] (${ancho}x${alto})...`);

      const jsx = Plantilla({
        slide,
        tokens,
        formato,
        indice: 1,
        total: 1,
      });

      const svg = await satori(jsx, {
        width: ancho,
        height: alto,
        fonts,
      });

      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: ancho,
        },
      });

      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      const nombreArchivo = `${sistema}-${formato}.png`;
      const rutaArchivo = join(dirSalida, nombreArchivo);
      writeFileSync(rutaArchivo, pngBuffer);

      console.log(`  ✔ Guardado en: public/piezas/muestra/${nombreArchivo}`);
    }
  }

  console.log('✨ Muestras generadas con éxito.');
}

main().catch((err) => {
  console.error('❌ Error fatal al generar muestras:', err);
  process.exit(1);
});
