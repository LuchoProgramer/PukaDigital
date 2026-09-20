import type { Pieza } from '../../lib/piezas/tipos.ts';

/**
 * Las piezas de septiembre de 2026.
 *
 * Dos por semana, martes y jueves, según `docs/COMMUNITY_MANAGEMENT.md`:
 *
 *   martes  → PukaHealth, el producto del mes
 *   jueves  → la casa, en Dark Glass Rojo
 *
 * La primera semana es la excepción: las dos primeras van miércoles 2 y jueves 3
 * para estrenar el cron con la cuenta real antes de dejarlo solo. A partir del 8
 * ya es martes y jueves.
 *
 * El jueves no es relleno: es el ancla visual que impide que un mes entero de
 * piezas claras convierta el feed en el de otra cuenta.
 *
 * Los temas salen de `docs/CALENDARIO_CONTENIDO.md`, de más a menos fuerte.
 */
const piezas: Pieza[] = [
  // ─────────────────────────────  miércoles 2  ·  PukaHealth  ──────────────
  {
    id: 'podologo-no-receta',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-02T18:00',
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
    facebook: {
      publicarEl: '2026-09-03T09:00',
      caption:
        'Un podólogo no puede recetar\n' +
        'Y muchos sistemas dejan imprimir «receta médica» igual. Ahí empieza el problema.\n\n' +
        'Lo dice el Art. 168\n' +
        'Solo médicos, odontólogos y obstetrices están facultados para prescribir medicamentos. La podología no está en esa lista.\n\n' +
        'No es un tecnicismo\n' +
        'Un documento mal titulado te expone a ti, no al software. El papel lleva tu nombre y tu registro profesional.\n\n' +
        'Lo correcto: indicaciones\n' +
        'El documento se llama «indicaciones de tratamiento podológico» y lo dice en su propio pie.\n\n' +
        'Y el paciente lo verifica\n' +
        'Cada documento sale con un enlace propio. Quien lo reciba comprueba que es auténtico sin llamar a la consulta.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'LEY ORGÁNICA DE SALUD',
        titular: 'Un podólogo no puede recetar',
        bajada: 'Y muchos sistemas dejan imprimir «receta médica» igual. Ahí empieza el problema.',
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

  // ─────────────────────────────  jueves 3  ·  la casa  ─────────────────────
  {
    id: 'precios-software-ecuador',
    sistema: 'puka',
    producto: 'pukaia',
    // De la competencia, no nuestros. Ver `preciosAjenos` en tipos.ts.
    preciosAjenos: ['49', '499'],
    publicarEl: '2026-09-03T09:00',
    caption:
      '¿Cuánto cuesta un CRM con WhatsApp en Ecuador?\n\n' +
      'Los que se venden aquí como CRM cobran entre $49 y $499 al mes. Los ' +
      'revisamos uno por uno y los pusimos en la misma tabla.\n\n' +
      'PukaIA hace lo mismo desde $14.99: inbox centralizado, pipeline, gestión ' +
      'de clientes y reportes. No es un chatbot con otro nombre.\n\n' +
      'Si estás comparando herramientas para tu pyme, esta tabla te ahorra la ' +
      'tarde.\n\n' +
      'pukadigital.com/agentes-ia\n\n' +
      '#CRM #WhatsAppBusiness #Ecuador #pymes',
    facebook: {
      publicarEl: '2026-09-03T18:00',
      caption:
        'Lo que cuesta un CRM aquí\n' +
        'Precios reales de los que se venden en Ecuador. Sin descuentos de lanzamiento.\n\n' +
        'Entre $49 y $499 al mes\n' +
        'Ese es el rango de los que se posicionan como CRM con WhatsApp para pymes en el mercado ecuatoriano.\n\n' +
        '¿Por qué tan caro?\n' +
        'Casi todos cobran por conversación o por agente. Creces, y la factura crece contigo aunque el trabajo sea el mismo.\n\n' +
        'Lo que cobramos nosotros — $14.99 al mes\n' +
        'Ese es el Básico. Pro $25 y Business $60. Un mes gratis para probarlo.\n\n' +
        'Compara antes de firmar\n' +
        'No te pedimos que nos creas: pide la tabla completa y decide con los números delante.\n\n' +
        'pukadigital.com/agentes-ia',
    },
    slides: [
      {
        badge: 'SIN MAQUILLAJE',
        titular: 'Lo que cuesta un CRM aquí',
        bajada: 'Precios reales de los que se venden en Ecuador. Sin descuentos de lanzamiento.',
      },
      {
        titular: 'Entre $49 y $499 al mes',
        bajada:
          'Ese es el rango de los que se posicionan como CRM con WhatsApp para pymes ' +
          'en el mercado ecuatoriano.',
      },
      {
        titular: '¿Por qué tan caro?',
        bajada:
          'Casi todos cobran por conversación o por agente. Creces, y la factura crece ' +
          'contigo aunque el trabajo sea el mismo.',
      },
      {
        titular: 'Lo que cobramos nosotros',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Ese es el Básico. Pro $25 y Business $60. Un mes gratis para probarlo.',
      },
      {
        titular: 'Compara antes de firmar',
        bajada:
          'No te pedimos que nos creas: pide la tabla completa y decide con los ' +
          'números delante.',
        cta: 'Pídenos la tabla',
      },
    ],
  },

  // ─────────────────────────────  martes 8  ·  PukaHealth  ──────────────────
  {
    id: 'proteccion-datos-clinicas',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-08T09:00',
    caption:
      '¿Tu clínica necesita un Delegado de Protección de Datos?\n\n' +
      'Según la Resolución SPDP-SPD-2026-0005-R, los datos de salud califican ' +
      'como tratamiento «a gran escala» por calificación directa. No hay que ' +
      'puntuar nada: una clínica califica por lo que hace.\n\n' +
      'Eso obliga a tener un Delegado de Protección de Datos registrado, un ' +
      'Registro de Actividades de Tratamiento y una auditoría cada 12 meses.\n\n' +
      'Aplica tengas o no software. El plazo de 90 días ya venció.\n\n' +
      'No somos abogados: esto existe y les aplica, confírmenlo con su asesor.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#proteccciondedatos #clinicas #Ecuador #normativasalud',
    facebook: {
      publicarEl: '2026-09-09T12:35',
      caption:
        'Tu clínica ya está en falta\n' +
        'Y el plazo para corregirlo venció hace meses. Casi nadie se enteró.\n\n' +
        'Datos de salud: gran escala\n' +
        'Por calificación directa. No hay que puntuar nada ni contar pacientes: una clínica califica por lo que hace.\n\n' +
        'Qué te obliga\n' +
        'Delegado de Protección de Datos registrado, Registro de Actividades de Tratamiento, y auditoría cada 12 meses con informe archivado 5 años.\n\n' +
        'Tengas o no software\n' +
        'Esto no va de sistemas. Aplica a la clínica que lleva fichas en papel exactamente igual que a la que las lleva digitales.\n\n' +
        'Confírmalo con tu asesor\n' +
        'No somos abogados y esto no es asesoría legal. Es un aviso: la norma existe y te aplica.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'RESOLUCIÓN 2026-0005-R',
        titular: 'Tu clínica ya está en falta',
        bajada: 'Y el plazo para corregirlo venció hace meses. Casi nadie se enteró.',
      },
      {
        titular: 'Datos de salud: gran escala',
        bajada:
          'Por calificación directa. No hay que puntuar nada ni contar pacientes: ' +
          'una clínica califica por lo que hace.',
      },
      {
        titular: 'Qué te obliga',
        bajada:
          'Delegado de Protección de Datos registrado, Registro de Actividades de ' +
          'Tratamiento, y auditoría cada 12 meses con informe archivado 5 años.',
      },
      {
        titular: 'Tengas o no software',
        bajada:
          'Esto no va de sistemas. Aplica a la clínica que lleva fichas en papel ' +
          'exactamente igual que a la que las lleva digitales.',
      },
      {
        titular: 'Confírmalo con tu asesor',
        bajada:
          'No somos abogados y esto no es asesoría legal. Es un aviso: la norma ' +
          'existe y te aplica.',
        cta: 'Habla con nosotros',
      },
    ],
  },

  // ─────────────────────────────  jueves 10  ·  la casa  ────────────────────
  {
    id: 'crm-no-chatbot',
    sistema: 'puka',
    producto: 'pukaia',
    publicarEl: '2026-09-10T18:00',
    caption:
      'Un chatbot responde. Un CRM te dice a quién llamar mañana.\n\n' +
      'La diferencia importa cuando tienes 40 conversaciones abiertas en ' +
      'WhatsApp y no sabes cuál de ellas iba a comprar.\n\n' +
      'PukaIA tiene inbox centralizado, pipeline en Kanban, ficha de cliente y ' +
      'reportes. El bot es una parte, no el producto.\n\n' +
      'Desde $14.99 al mes, con un mes gratis.\n\n' +
      'pukadigital.com/agentes-ia\n\n' +
      '#CRM #WhatsAppBusiness #ventas #Ecuador',
    facebook: {
      publicarEl: '2026-09-11T09:00',
      imagen: {
        titular: 'Un bot contesta.\nUn CRM recuerda\nquién eres',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
      },
      caption:
        'No es un chatbot\n' +
        'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.\n\n' +
        'Un bot contesta y ya\n' +
        'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ni qué quería.\n\n' +
        'Un CRM recuerda\n' +
        'Cada conversación es un cliente con historial, etapa y siguiente paso. Sabes a quién llamar sin buscar en el chat.\n\n' +
        'Qué incluye\n' +
        'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e integraciones. El bot es una parte.\n\n' +
        'Pruébalo un mes — $14.99 al mes\n' +
        'Sin tarjeta para empezar.\n\n' +
        'pukadigital.com/agentes-ia',
    },
    slides: [
      {
        badge: 'CRM PARA WHATSAPP',
        titular: 'No es un chatbot',
        bajada: 'Y la diferencia se nota el día que tienes 40 conversaciones abiertas.',
      },
      {
        titular: 'Un bot contesta y ya',
        bajada:
          'Resuelve la pregunta del momento. Mañana no recuerda quién era esa persona ' +
          'ni qué quería.',
      },
      {
        titular: 'Un CRM recuerda',
        bajada:
          'Cada conversación es un cliente con historial, etapa y siguiente paso. ' +
          'Sabes a quién llamar sin buscar en el chat.',
      },
      {
        titular: 'Qué incluye',
        bajada:
          'Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e ' +
          'integraciones. El bot es una parte.',
      },
      {
        titular: 'Pruébalo un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'Sin tarjeta para empezar.',
        cta: 'Escríbenos',
      },
    ],
    reel: {
      guion:
        'Si manejas tus ventas por WhatsApp, un chatbot básico no te alcanza.\n\n' +
        'El bot solo responde preguntas sueltas y mañana no recuerda quién era esa persona.\n\n' +
        'Un verdadero CRM guarda cada conversación como un cliente con historial y siguiente paso.\n\n' +
        'Incluye inbox centralizado, embudo en Kanban y reportes claros para tu equipo.\n\n' +
        'Pruébalo gratis un mes por catorce dólares con noventa y nueve centavos al mes.',
      caption:
        'Un bot contesta mensajes sueltos. Un CRM te organiza las ventas de todo tu equipo.\n\n' +
        'PukaIA centraliza tus chats de WhatsApp con Kanban y seguimiento de clientes.\n\n' +
        'pukadigital.com/agentes-ia',
    },
  },

  // ─────────────────────────────  martes 15  ·  PukaHealth  ─────────────────
  {
    id: 'enter-tumba-factura',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-15T09:00',
    caption:
      '¿Por qué el SRI te devuelve el error 35?\n\n' +
      'Porque pulsaste Enter. El esquema XSD del SRI prohíbe los saltos de línea ' +
      'en los campos de texto, y un comprobante con uno dentro no cumple la ' +
      'estructura XML.\n\n' +
      'Pasa sobre todo escribiendo el motivo de una nota de crédito, donde uno ' +
      'tiende a separar en párrafos.\n\n' +
      'No es tu computadora ni tu internet. Es un carácter invisible.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#SRI #facturacionelectronica #Ecuador #consultoriomedico',
    facebook: {
      publicarEl: '2026-09-15T18:00',
      imagen: {
        titular: 'Un Enter invisible\ntumba tu factura\nen el SRI',
      },
      caption:
        'Pulsaste Enter y se cayó\n' +
        '«Archivo no cumple estructura XML». El motivo es más tonto de lo que parece.\n\n' +
        'El XSD no admite saltos\n' +
        'El esquema del SRI define los campos de texto sin permitir saltos de línea. Uno solo invalida el comprobante entero.\n\n' +
        'Dónde pasa siempre\n' +
        'En el motivo de una nota de crédito. Es texto largo, uno separa en párrafos, y ahí se rompe.\n\n' +
        'No es tu internet\n' +
        'Es un carácter que no se ve. Por eso el error desconcierta: el texto se ve perfecto en pantalla.\n\n' +
        'Un sistema debería avisarte\n' +
        'Antes de enviarlo, no después del rechazo. Eso es lo que separa un sistema que factura de uno que lo intenta.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'ERROR 35',
        titular: 'Pulsaste Enter y se cayó',
        bajada: '«Archivo no cumple estructura XML». El motivo es más tonto de lo que parece.',
      },
      {
        titular: 'El XSD no admite saltos',
        bajada:
          'El esquema del SRI define los campos de texto sin permitir saltos de línea. ' +
          'Uno solo invalida el comprobante entero.',
      },
      {
        titular: 'Dónde pasa siempre',
        bajada:
          'En el motivo de una nota de crédito. Es texto largo, uno separa en párrafos, ' +
          'y ahí se rompe.',
      },
      {
        titular: 'No es tu internet',
        bajada:
          'Es un carácter que no se ve. Por eso el error desconcierta: el texto se ve ' +
          'perfecto en pantalla.',
      },
      {
        titular: 'Un sistema debería avisarte',
        bajada:
          'Antes de enviarlo, no después del rechazo. Eso es lo que separa un sistema ' +
          'que factura de uno que lo intenta.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // ─────────────────────────────  jueves 17  ·  la casa  ────────────────────
  {
    id: 'requisitos-facturar-sri',
    sistema: 'puka',
    publicarEl: '2026-09-17T18:00',
    caption:
      '¿Qué necesitas para facturar electrónicamente en Ecuador?\n\n' +
      'Son cuatro cosas, y ninguna es el software: RUC activo, firma electrónica ' +
      'vigente, el ambiente de pruebas del SRI aprobado y un punto de emisión.\n\n' +
      'El orden importa. Y hay un detalle que quema a casi todos: el secuencial ' +
      'se comparte entre pruebas y producción, así que probar en tu punto real ' +
      'te consume números que no recuperas.\n\n' +
      'Reserva un punto de emisión alto y descartable para tus pruebas.\n\n' +
      'pukadigital.com\n\n' +
      '#SRI #facturacionelectronica #Ecuador #emprendimiento',
    facebook: {
      publicarEl: '2026-09-18T09:00',
      imagen: {
        titular: 'Facturar al SRI:\ncuatro requisitos,\nninguno es el software',
      },
      caption:
        'Cuatro cosas, y ninguna es el software\n' +
        'Lo que de verdad te pide el SRI para emitir tu primera factura electrónica.\n\n' +
        'RUC activo y firma vigente\n' +
        'La firma electrónica caduca. Si la tuya venció, no hay sistema que emita nada por ti.\n\n' +
        'El RUC debe coincidir\n' +
        'El de la empresa y el del certificado firmante. Si eres persona natural, tu RUC es tu cédula más 001.\n\n' +
        'Ojo con las pruebas\n' +
        'El secuencial se comparte entre pruebas y producción. Probar en tu punto real te quema números que no recuperas.\n\n' +
        'Reserva un punto descartable\n' +
        'Uno alto, solo para pruebas. Es el consejo que nadie te da y que evita un lío difícil de deshacer.\n\n' +
        'pukadigital.com',
    },
    slides: [
      {
        badge: 'ANTES DE EMPEZAR',
        titular: 'Cuatro cosas, y ninguna es el software',
        bajada: 'Lo que de verdad te pide el SRI para emitir tu primera factura electrónica.',
      },
      {
        titular: 'RUC activo y firma vigente',
        bajada:
          'La firma electrónica caduca. Si la tuya venció, no hay sistema que emita ' +
          'nada por ti.',
      },
      {
        titular: 'El RUC debe coincidir',
        bajada:
          'El de la empresa y el del certificado firmante. Si eres persona natural, ' +
          'tu RUC es tu cédula más 001.',
      },
      {
        titular: 'Ojo con las pruebas',
        bajada:
          'El secuencial se comparte entre pruebas y producción. Probar en tu punto ' +
          'real te quema números que no recuperas.',
      },
      {
        titular: 'Reserva un punto descartable',
        bajada:
          'Uno alto, solo para pruebas. Es el consejo que nadie te da y que evita ' +
          'un lío difícil de deshacer.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },

  // ─────────────────────────────  martes 22  ·  PukaHealth  ─────────────────
  {
    id: 'receta-contenido-minimo',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-22T09:00',
    caption:
      '¿Qué debe llevar una receta médica en Ecuador?\n\n' +
      'La Resolución ACESS-2023-0030 lo detalla en su Art. 5, y hay siete cosas ' +
      'que casi ninguna receta completa.\n\n' +
      'La que más sorprende: el registro ACESS del prescriptor, que no es el ' +
      'registro SENESCYT del título. Y la cantidad va en números y en letras.\n\n' +
      'Otra que casi nadie sabe: «no se aceptarán rúbricas o trazos por firma». ' +
      'Un garabato no es una firma.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#recetamedica #ACESS #Ecuador #normativasalud',
    facebook: {
      publicarEl: '2026-09-22T18:00',
      imagen: {
        titular: 'Tu receta necesita\nsiete datos que\ncasi nadie pone',
        dato: { valor: '7', etiqueta: 'datos obligatorios' },
      },
      caption:
        'Siete cosas que faltan en tu receta\n' +
        'Y una de ellas la confunde casi todo el mundo.\n\n' +
        'La edad, en años y meses\n' +
        'Si el paciente es menor de cinco años, la edad va en años y meses. Solo el año no cumple.\n\n' +
        'La cantidad, dos veces\n' +
        'En números y en letras. Como en un cheque, y por el mismo motivo: que no se pueda alterar.\n\n' +
        'El registro ACESS\n' +
        'No es el registro SENESCYT de tu título. Son dos números distintos y la receta pide el de ACESS.\n\n' +
        'Un garabato no es firma\n' +
        'Textual del Art. 5: «no se aceptarán rúbricas o trazos por firma». Y las recetas se archivan cinco años.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'ACESS-2023-0030',
        titular: 'Siete cosas que faltan en tu receta',
        bajada: 'Y una de ellas la confunde casi todo el mundo.',
      },
      {
        titular: 'La edad, en años y meses',
        bajada:
          'Si el paciente es menor de cinco años, la edad va en años y meses. Solo el ' +
          'año no cumple.',
      },
      {
        titular: 'La cantidad, dos veces',
        bajada:
          'En números y en letras. Como en un cheque, y por el mismo motivo: que no se ' +
          'pueda alterar.',
      },
      {
        titular: 'El registro ACESS',
        bajada:
          'No es el registro SENESCYT de tu título. Son dos números distintos y la ' +
          'receta pide el de ACESS.',
      },
      {
        titular: 'Un garabato no es firma',
        bajada:
          'Textual del Art. 5: «no se aceptarán rúbricas o trazos por firma». Y las ' +
          'recetas se archivan cinco años.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // ─────────────────────────────  jueves 24  ·  la casa  ────────────────────
  {
    id: 'cuanto-cuesta-tu-excel',
    sistema: 'puka',
    publicarEl: '2026-09-24T18:00',
    caption:
      '¿Cuánto te cuesta de verdad llevar tu negocio en Excel?\n\n' +
      'Parece gratis porque no pagas suscripción mensual. Pero el costo real aparece ' +
      'a las 7:00 PM cuando te quedas una hora cuadrando cobros, transferencias y ' +
      'notas sueltas a mano.\n\n' +
      'Una hora al día son más de 20 horas al mes que le quitas a tu descanso o a ' +
      'hacer crecer tus ventas. El software no es un gasto: te devuelve tu tiempo.\n\n' +
      'pukadigital.com\n\n' +
      '#negociosecuador #productividad #emprendimiento #gestionempresarial',
    facebook: {
      publicarEl: '2026-09-25T09:00',
      imagen: {
        titular: 'Tu Excel te cuesta\nuna hora cada noche',
      },
      caption:
        'Tu Excel no es gratis\n' +
        'El error común es creer que por no pagar mensualidad estás ahorrando.\n\n' +
        'El costo oculto\n' +
        'Una hora al final del día revisando cobros, cruzando datos y cuadrando caja a mano.\n\n' +
        '20 horas al mes\n' +
        'Es el tiempo que pierdes en tareas mecánicas en vez de atender clientes o descansar con tu familia.\n\n' +
        'La solución real\n' +
        'Un sistema en la nube automatiza el cuadre y deja todo listo al instante en que cobras.\n\n' +
        'pukadigital.com',
    },
    slides: [
      {
        badge: 'COSTO OCULTO',
        titular: 'Tu Excel no es gratis',
        bajada: 'Parece gratis porque no pagas licencia, pero el costo real se paga en tiempo.',
      },
      {
        titular: 'Una hora cada noche',
        bajada:
          'Cruzar cobros del día, conciliar transferencias y buscar un número que no ' +
          'cuadra en la celda.',
      },
      {
        titular: '20 horas al mes perdidas',
        bajada:
          'Es casi una semana completa de trabajo al año consumida en digitar datos ' +
          'a mano.',
      },
      {
        titular: 'El riesgo del error humano',
        bajada:
          'Una fórmula borrada sin querer o un archivo corrupto pueden dejarte sin ' +
          'el historial de meses.',
      },
      {
        titular: 'El software te devuelve tiempo',
        bajada:
          'Tus ventas y caja cuadradas en el mismo segundo en que cobras al cliente.',
        cta: 'Conoce más en la web',
      },
    ],
  },

  // ─────────────────────────────  sábado 26  ·  PukaHealth  ─────────────────
  {
    id: 'software-extranjero-sri',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-26T09:00',
    caption:
      'Lo que el software médico extranjero no te dice al llegar a Ecuador:\n\n' +
      'Sistemas creados en Chile, México o España se ven bonitos para agendar citas. ' +
      'Pero cuando terminas la consulta, te das cuenta de que no están conectados al SRI.\n\n' +
      'Te toca abrir la página del SRI o un sistema contable por fuera, digitar los datos ' +
      'otra vez y duplicar tu trabajo administrativo.\n\n' +
      'PukaHealth emite y autoriza tu factura electrónica al SRI en la misma consulta, en un clic.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#softwaremedico #SRI #facturacionelectronica #consultoriomedico #Ecuador',
    facebook: {
      publicarEl: '2026-09-26T18:00',
      imagen: {
        titular: 'El software extranjero\nte deja colgado\ncon el SRI',
      },
      caption:
        'El problema del software extranjero en Ecuador\n' +
        'Te venden una agenda bonita, pero te dejan solo frente al SRI.\n\n' +
        'Doble trabajo administrativo\n' +
        'Terminas de atender al paciente y tienes que abrir otro sistema o el portal del SRI para tipear la factura a mano.\n\n' +
        'No están adaptados al país\n' +
        'Fueron diseñados para otros países. No entienden los esquemas XML del SRI ni sus validaciones estrictas.\n\n' +
        'Facturación en la misma consulta\n' +
        'PukaHealth integra la ficha clínica con la factura electrónica autorizada en un solo clic.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'REALIDAD ECUADOR',
        titular: 'El software extranjero y el SRI',
        bajada: 'Se ven modernos para agendar citas, pero te dejan solo a la hora de facturar.',
      },
      {
        titular: 'Doble trabajo cada día',
        bajada:
          'Atiendes la consulta y luego debes abrir otra pestaña para emitir la ' +
          'factura en el SRI.',
      },
      {
        titular: 'No conocen la normativa local',
        bajada:
          'Los sistemas de otros países no están integrados con la firma digital ni ' +
          'los esquemas del SRI.',
      },
      {
        titular: 'Todo en una sola pantalla',
        bajada:
          'En PukaHealth la ficha clínica genera la factura electrónica autorizada ' +
          'en un solo clic.',
      },
      {
        titular: 'Ahorra horas administrativas',
        bajada:
          'Menos tiempo en pantallas del SRI y más tiempo para tus pacientes y tu ' +
          'familia.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // ─────────────────────────────  martes 29  ·  PukaHealth  ─────────────────
  {
    id: 'paciente-se-fue-sin-pagar',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-09-29T09:00',
    caption:
      '«Doctor, más tarde le hago la transferencia y me envía la factura»:\n\n' +
      'Es la frase que más dinero le hace perder a un consultorio cada mes. Entre el ' +
      'ajetreo del día, el paciente lo olvida o tú no tienes tiempo de hacer seguimiento.\n\n' +
      'Llevar el control de cobros y facturación desde la misma tablet en el sillón de ' +
      'atención evita que se queden cuentas en el aire.\n\n' +
      'En PukaHealth registras el cobro y emites la factura antes de que el paciente salga por la puerta.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#consultoriomedico #gestionclinica #podologia #Ecuador #PukaHealth',
    facebook: {
      publicarEl: '2026-09-29T18:00',
      imagen: {
        titular: '«Después le transfiero»:\nla frase que más\nte cuesta',
      },
      caption:
        'El peligro de cobrar después de la consulta\n' +
        '«Más tarde le transfiero y me manda la factura». Y al final del mes faltan cobros.\n\n' +
        'El desorden de transferencias\n' +
        'Buscar comprobantes en WhatsApp al final de la semana es una pérdida de tiempo agotadora.\n\n' +
        'Cobro y factura en la misma consulta\n' +
        'Al cerrar la ficha clínica, registras el método de pago y emites la factura electrónica al instante.\n\n' +
        'Cero cuentas en el aire\n' +
        'El paciente se va con su tratamiento y su factura autorizada en el correo.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'COBROS Y CONTROL',
        titular: '«Más tarde le transfiero»',
        bajada: 'La frase que más dinero y tiempo le quema a los consultorios cada mes.',
      },
      {
        titular: 'El desorden de los comprobantes',
        bajada:
          'Pacientes que olvidan transferir y tú perdiendo horas revisando capturas ' +
          'en WhatsApp.',
      },
      {
        titular: 'Cobro en el momento de atención',
        bajada:
          'Registrar el pago y emitir la factura en la tablet antes de que el ' +
          'paciente salga.',
      },
      {
        titular: 'Cuentas claras al instante',
        bajada:
          'Sabes exactamente cuánto ingresó en efectivo y cuánto en transferencias ' +
          'cada día.',
      },
      {
        titular: 'Tu consultorio bajo control',
        bajada:
          'Protege tus ingresos con un sistema profesional de historia clínica y ' +
          'facturación integrada.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },
];

export default piezas;
