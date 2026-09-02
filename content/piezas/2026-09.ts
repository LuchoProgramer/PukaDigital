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
    publicarEl: '2026-09-08T09:00',
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
    publicarEl: '2026-09-10T18:00',
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
  {
    id: 'podologo-no-receta',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-15T09:00',
    caption:
      'El Art. 168 de la Ley Orgánica de Salud es claro: solo médicos, ' +
      'odontólogos y obstetrices pueden prescribir medicamentos.\n\n' +
      'Un podólogo no receta. Emite indicaciones de tratamiento podológico, ' +
      'que es otra cosa y así debe decirlo el documento.\n\n' +
      'Si tu sistema te deja imprimir algo titulado «receta», te está poniendo ' +
      'en un problema que no es tuyo.\n\n' +
      'pukadigital.com/pukahealth',
    slides: [
      {
        badge: 'LEY ORGÁNICA DE SALUD',
        titular: 'Un podólogo no puede recetar',
        bajada:
          'Y muchos sistemas dejan imprimir «receta médica» igual. Ahí empieza el problema.',
      },
      {
        titular: 'Lo dice el Art. 168',
        bajada:
          'Solo médicos, odontólogos y obstetrices están facultados para prescribir ' +
          'medicamentos. La podología no está en esa lista.',
      },
      {
        titular: 'No es un tecnicismo',
        bajada:
          'Un documento mal titulado te expone a ti, no al software. El papel lleva ' +
          'tu nombre y tu registro profesional.',
      },
      {
        titular: 'Lo correcto: indicaciones',
        bajada:
          'El documento se llama «indicaciones de tratamiento podológico» y lo dice ' +
          'en su propio pie. Así se ve en PukaHealth:',
        captura: 'validar-receta.png',
      },
      {
        titular: 'Y el paciente lo verifica',
        bajada:
          'Cada documento sale con un enlace propio. Quien lo reciba comprueba que es ' +
          'auténtico sin llamar a la consulta.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },
];

export default piezas;
