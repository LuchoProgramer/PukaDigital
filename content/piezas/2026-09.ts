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
