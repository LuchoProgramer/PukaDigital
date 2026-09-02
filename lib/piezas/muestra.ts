import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderPieza } from './render.ts';
import type { Pieza } from './tipos.ts';

/** Las seis combinaciones de sistema x formato, mas un carrusel. */
const MUESTRAS: Pieza[] = [
  {
    id: 'puka',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    formatos: ['4x5', '1x1', '9x16'],
    slides: [
      {
        badge: 'SRI · FACTURACIÓN',
        titular: 'Facturación SRI en segundos',
        bajada: 'Emite facturas electrónicas, retenciones y guías sin errores ni multas.',
        dato: { valor: '$15', etiqueta: 'al mes · sin IVA' },
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },
  {
    id: 'health',
    sistema: 'health',
    producto: 'pukahealth',
    formatos: ['4x5', '1x1', '9x16'],
    slides: [
      {
        badge: 'HISTORIA CLÍNICA',
        titular: 'Tu consultorio 100% digital',
        bajada: 'Historias clínicas, recetas electrónicas y cobros SRI en una sola app médica.',
        dato: { valor: '30 días', etiqueta: 'de prueba gratis' },
        cta: 'Empieza gratis hoy',
      },
    ],
  },
  {
    id: 'carrusel',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [
      {
        badge: 'WHATSAPP',
        titular: 'Tres ventas que perdiste ayer',
        bajada: 'El 78% de los clientes escribe fuera de horario de oficina.',
      },
      {
        titular: 'Contesta mientras duermes',
        bajada: 'El agente responde, califica y agenda. Tú revisas por la mañana.',
      },
      {
        titular: 'Un CRM, no un chatbot',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        cta: 'Escríbenos',
      },
    ],
  },
];

async function main() {
  const destino = join(process.cwd(), 'public', 'piezas', 'muestra');
  mkdirSync(destino, { recursive: true });

  let escritos = 0;
  for (const pieza of MUESTRAS) {
    for (const { nombre, png } of await renderPieza(pieza)) {
      writeFileSync(join(destino, nombre), png);
      console.log(`  public/piezas/muestra/${nombre}`);
      escritos++;
    }
  }
  console.log(`${escritos} archivo(s) en public/piezas/muestra/`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
