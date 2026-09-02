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
      '¿Por qué el SRI te rechaza la factura electrónica?\n\n' +
      'Casi nunca es el sistema. Es un dato del cliente mal escrito: la cédula, ' +
      'la razón social, el correo.\n\n' +
      'Si facturas en Ecuador y llevas semanas peleando con comprobantes ' +
      'rechazados, escríbenos y te contamos cómo lo resolvemos.\n\n' +
      'pukadigital.com\n\n' +
      '#facturacionelectronica #SRI #Ecuador #pymes',
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
      'Historia clínica electrónica y facturación al SRI en el mismo sistema.\n\n' +
      'Si tu consultorio todavía lleva las fichas en papel y factura aparte, ' +
      'estás escribiendo los mismos datos dos veces todos los días.\n\n' +
      'PukaHealth es software médico hecho en Ecuador, con facturación ' +
      'electrónica incluida. $50 al mes, 30 días para probarlo.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#historiaclinicaelectronica #softwaremedico #Ecuador #consultoriomedico',
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
      '¿Un podólogo puede recetar medicamentos en Ecuador?\n\n' +
      'No. El Art. 168 de la Ley Orgánica de Salud es explícito: solo médicos, ' +
      'odontólogos y obstetrices pueden prescribir.\n\n' +
      'Un podólogo emite indicaciones de tratamiento podológico. Es otra cosa, ' +
      'y el documento tiene que decirlo así.\n\n' +
      'Si tu software te deja imprimir algo titulado «receta médica», te está ' +
      'poniendo en un problema que no es tuyo: el papel lleva tu nombre y tu ' +
      'registro profesional, no el del sistema.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#podologia #recetamedica #Ecuador #normativasalud',
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
