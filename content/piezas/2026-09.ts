import type { Pieza } from '../../lib/piezas/tipos.ts';

/**
 * Las piezas de septiembre de 2026.
 *
 * La mezcla del mes sale de docs/COMMUNITY_MANAGEMENT.md: utilidad, producto y
 * prueba. Las de utilidad no declaran producto porque no venden nada; en cuanto
 * una pieza menciona un precio o una oferta, el producto es obligatorio y el
 * validador comprueba que el dato sea suyo.
 */
const piezas: Pieza[] = [
  {
    id: 'sri-rechazo-01',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    caption:
      'El SRI no rechaza tu factura por el sistema. La rechaza por un dato del ' +
      'cliente mal escrito: cédula, razón social, correo.\n\n' +
      '¿Te ha pasado? Escríbenos y te contamos cómo lo resolvemos.\n\n' +
      'pukadigital.com',
    slides: [
      {
        badge: 'SRI',
        titular: 'Tu factura no pasó',
        bajada: 'El error más común no es del sistema: es un dato del cliente mal escrito.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },
  {
    id: 'historia-clinica-papel',
    sistema: 'health',
    producto: 'pukahealth',
    caption:
      'Historia clínica y facturación electrónica en el mismo sitio, sin pasar ' +
      'nada a mano dos veces.\n\n' +
      'PukaHealth · $50 al mes · 30 días para probarlo.\n\n' +
      'pukadigital.com/pukahealth',
    slides: [
      {
        badge: 'HISTORIA CLÍNICA',
        titular: 'Tu consultorio sigue en papel',
        bajada: 'Historia clínica y facturación electrónica en el mismo sitio.',
      },
      {
        titular: 'Treinta días para probarlo',
        dato: { valor: '$50', etiqueta: 'al mes' },
        cta: 'Empieza gratis hoy',
      },
    ],
  },
];

export default piezas;
