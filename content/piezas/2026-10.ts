import type { Pieza } from '../../lib/piezas/tipos.ts';

/**
 * Las piezas de octubre de 2026.
 *
 * Cadencia de 4 piezas por semana (martes, jueves, sábado y domingo/martes),
 * alternando PukaHealth (clínico y operativo) y La Casa (Dark Glass Rojo).
 *
 * Los temas abordan dolores reales, cotidianos y económicos del consultorio
 * y de las pymes en Ecuador, alejándose de leyes teóricas aburridas.
 */
const piezas: Pieza[] = [
  // ─────────────────────────────  Semana 1  ─────────────────────────────────
  // Jueves 1 · La Casa
  {
    id: 'whatsapp-como-en-2018',
    sistema: 'puka',
    producto: 'pukaia',
    publicarEl: '2026-10-01T18:00',
    caption:
      '¿Sigues atendiendo las ventas de tu negocio por WhatsApp como en 2018?\n\n' +
      'Tener 40 conversaciones abiertas sin saber quién te iba a comprar, quién ya pagó ' +
      'y a quién tienes que llamar hoy es la forma más rápida de quemar clientes.\n\n' +
      'PukaIA organiza tus chats en un embudo Kanban con historial y recordatorios.\n\n' +
      'Desde $14.99 al mes, con 1 mes gratis.\n\n' +
      'pukadigital.com/agentes-ia\n\n' +
      '#CRM #WhatsAppBusiness #ventas #Ecuador #PukaIA',
    facebook: {
      publicarEl: '2026-10-02T09:00',
      imagen: {
        titular: 'Vender por WhatsApp\nsin CRM quema\ntus clientes',
      },
      caption:
        'El desorden de vender por WhatsApp\n' +
        'El chat se llena de mensajes y las ventas que estaban por cerrar se pierden abajo.\n\n' +
        'Un inbox centralizado\n' +
        'Organiza tus conversaciones en columnas de prospecto, cotizado y vendido.\n\n' +
        'Todo tu equipo conectado\n' +
        'Varios asesores atendiendo desde un solo número sin pisarse los clientes.\n\n' +
        'Pruébalo un mes gratis\n' +
        'Planes desde $14.99 al mes sin contratos forzosos.\n\n' +
        'pukadigital.com/agentes-ia',
    },
    slides: [
      {
        badge: 'VENTAS POR CHAT',
        titular: 'WhatsApp sin orden te quema',
        bajada: 'Tener decenas de chats abiertos sin seguimiento te hace perder ventas a diario.',
      },
      {
        titular: 'Mensajes que se pierden',
        bajada:
          'El cliente que iba a comprar queda sepultado bajo 30 consultas nuevas.',
      },
      {
        titular: 'Un embudo visual en Kanban',
        bajada:
          'Mueve cada chat de etapa con un clic: de contacto inicial a cobrado.',
      },
      {
        titular: 'Historial completo del cliente',
        bajada:
          'Cualquiera en tu equipo sabe qué pidió y qué se le cotizó sin buscar en ' +
          'el celular.',
      },
      {
        titular: 'Pruébalo gratis un mes',
        dato: { valor: '$14.99', etiqueta: 'al mes' },
        bajada: 'PukaIA organiza tus chats de WhatsApp. Empieza sin tarjeta hoy.',
        cta: 'Escríbenos',
      },
    ],
  },

  // Sábado 3 · PukaHealth
  {
    id: 'el-mito-de-solo-agenda',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-03T09:00',
    caption:
      '«Doctor, yo solo necesito una agenda para anotar turnos»:\n\n' +
      'El problema de tener solo una agenda es que te deja completamente vendido ' +
      'en la consulta. Una cita aislada no guarda las fotos de evolución del ' +
      'paciente ni te emite la factura electrónica al SRI en un clic.\n\n' +
      'PukaHealth une la agenda con la ficha clínica y la facturación inmediata.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#softwaremedico #podologia #consultoriomedico #Ecuador #PukaHealth',
    facebook: {
      publicarEl: '2026-10-03T18:00',
      imagen: {
        titular: 'Una agenda sola\nte deja vendido\nen la consulta',
      },
      caption:
        'El error de buscar «solo una agenda»\n' +
        'Anotar citas en un calendario aislado no resuelve el desorden de tu consultorio.\n\n' +
        'La cita debe alimentar la ficha\n' +
        'Cuando el paciente entra, su historial, fotos de evolución y antecedentes ya están en pantalla.\n\n' +
        'Facturación en un solo paso\n' +
        'Al terminar la atención, la factura electrónica se emite al SRI sin abrir otras páginas.\n\n' +
        'Todo conectado en la nube\n' +
        'PukaHealth organiza tu práctica médica desde $50 al mes con 15 días gratis.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'GESTIÓN CLÍNICA',
        titular: 'El mito de «solo la agenda»',
        bajada: 'Anotar turnos en una app aislada no te salva del caos administrativo.',
      },
      {
        titular: 'Citas desconectadas de la ficha',
        bajada:
          'Tener la hora anotada no te ayuda si luego tienes que buscar carpetas ' +
          'de papel.',
      },
      {
        titular: 'La ficha que se abre sola',
        bajada:
          'Haces clic en la cita del día y accedes al historial y fotos de control ' +
          'al instante.',
      },
      {
        titular: 'Cobro y factura inmediata',
        bajada:
          'Cierras la atención y la factura electrónica al SRI se genera en un ' +
          'solo clic.',
      },
      {
        titular: 'Tu consultorio ordenado',
        bajada:
          'Menos fricción administrativa y más profesionalismo para tus pacientes.',
        cta: 'Prueba 15 días gratis',
      },
    ],
  },

  // Martes 6 · PukaHealth
  {
    id: 'error-35-sri-enter',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-06T09:00',
    caption:
      '¿Por qué el SRI te devuelve el error 35 al emitir tu factura médica?\n\n' +
      'Por pulsar Enter. El esquema XML del SRI no admite saltos de línea en campos ' +
      'de texto, y un solo carácter invisible invalida el comprobante completo.\n\n' +
      'Un software médico bien diseñado limpia y valida los campos antes de enviarlos, ' +
      'evitando rechazos y pérdidas de tiempo.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#SRI #facturacionelectronica #consultoriomedico #Ecuador',
    facebook: {
      publicarEl: '2026-10-06T18:00',
      imagen: {
        titular: 'Un Enter invisible\ninvalida tu factura\nen el SRI',
      },
      caption:
        'El famoso error 35 del SRI\n' +
        '«El archivo no cumple estructura XML». El fallo es más simple de lo que parece.\n\n' +
        'Los saltos de línea están prohibidos\n' +
        'En los campos de descripción o notas de crédito, un Enter rompe la estructura del archivo.\n\n' +
        'No es tu computadora\n' +
        'Es un fallo del sistema que usas si no valida los caracteres antes de mandar el comprobante.\n\n' +
        'PukaHealth factura sin errores\n' +
        'Integración nativa con el SRI para profesionales de salud en Ecuador.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'ERROR DEL SRI',
        titular: 'El misterio del error 35',
        bajada: 'Tu factura se cae y el portal dice «error en estructura XML».',
      },
      {
        titular: 'Un carácter que no se ve',
        bajada:
          'Pulsar Enter para separar una frase introduce un salto prohibido en ' +
          'el esquema XSD.',
      },
      {
        titular: 'Pasa en notas y descripciones',
        bajada:
          'Escribes el detalle del servicio y un salto de línea arruina la ' +
          'autorización.',
      },
      {
        titular: 'Validación antes de enviar',
        bajada:
          'El sistema debe corregir el texto automáticamente para que el SRI nunca ' +
          'te rechace.',
      },
      {
        titular: 'Factura sin dolores de cabeza',
        bajada:
          'PukaHealth cuida tu facturación médica en cada consulta. 15 días gratis.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // Jueves 8 · La Casa
  {
    id: 'cuanto-tiempo-pierdes-contestando',
    sistema: 'puka',
    publicarEl: '2026-10-08T18:00',
    caption:
      '¿Cuánto tiempo pierde tu equipo respondiendo «¿qué precio tiene?» a mano?\n\n' +
      'El 70% de las preguntas que entran a un negocio son las mismas: precios, ' +
      'horarios, ubicación y disponibilidad. Responderlas una por una a mano ' +
      'agota a tu personal y retrasa la atención.\n\n' +
      'Automatizar las respuestas frecuentes te deja tiempo para las ventas que ' +
      'de verdad necesitan asesoría humana.\n\n' +
      'pukadigital.com\n\n' +
      '#productividad #automatizacion #ventas #pymes #Ecuador',
    facebook: {
      publicarEl: '2026-10-09T09:00',
      imagen: {
        titular: 'Responder precios a mano\nte quema horas\ncada semana',
      },
      caption:
        'El bucle de las preguntas repetitivas\n' +
        'Precios, catálogo, ubicación. Siempre las mismas 5 dudas en WhatsApp.\n\n' +
        'El cliente quiere rapidez\n' +
        'Si tardas 20 minutos en contestar cuánto cuesta, se va con la competencia.\n\n' +
        'Automatiza lo repetitivo\n' +
        'Deja que un flujo automático responda lo básico en segundos y atiende tú los cierres.\n\n' +
        'Más ventas con menos estrés\n' +
        'Tecnología simple para negocios y pymes en Ecuador.\n\n' +
        'pukadigital.com',
    },
    slides: [
      {
        badge: 'ATENCIÓN AL CLIENTE',
        titular: 'Las mismas 5 preguntas',
        bajada: '«¿Qué precio tiene?», «¿Dónde quedan?», «¿Atienden hoy?», una y otra vez.',
      },
      {
        titular: 'La velocidad lo es todo',
        bajada:
          'El cliente que escribe por WhatsApp le escribió a tres negocios al ' +
          'mismo tiempo.',
      },
      {
        titular: 'Horas de tipeo mecánico',
        bajada:
          'Tener a un colaborador escribiendo lo mismo 50 veces al día es tirar ' +
          'su talento.',
      },
      {
        titular: 'Respuestas al instante',
        bajada:
          'Entrega catálogos y precios en segundos para calentar al cliente listo ' +
          'para comprar.',
      },
      {
        titular: 'Enfócate en cerrar ventas',
        bajada:
          'La tecnología atiende la entrada; tú cierras las negociaciones importantes.',
        cta: 'Conoce más en la web',
      },
    ],
  },

  // ─────────────────────────────  Semana 2  ─────────────────────────────────
  // Sábado 10 · PukaHealth
  {
    id: 'siete-minutos-buscando-carpeta',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-10T09:00',
    caption:
      'La cara de tu paciente cuando tardas 7 minutos buscando su carpeta de papel:\n\n' +
      'Llega a su control, se sienta en el sillón de atención y tú vas al archivero ' +
      'a revisar carpetas viejas entre decenas de nombres parecidos.\n\n' +
      'La confianza médica también entra por los ojos: abrir su ficha en la tablet en 2 ' +
      'segundos y mostrarle sus fotos anteriores cambia por completo su percepción.\n\n' +
      'PukaHealth moderniza tu consultorio. 15 días gratis.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#consultoriomedico #podologia #historiaclinica #Ecuador',
    facebook: {
      publicarEl: '2026-10-10T18:00',
      imagen: {
        titular: 'Buscar carpetas en papel\ndaña tu imagen',
      },
      caption:
        'La experiencia del paciente en tu consultorio\n' +
        'El paciente sentado esperando mientras tú revuelves carpetas de papel.\n\n' +
        'El papel daña tu imagen\n' +
        'Hojas dobladas, fichas con tachones y fotos impresas de mala calidad.\n\n' +
        'La alternativa digital\n' +
        'Escribes su apellido en la tablet y en 2 segundos ves toda su evolución clínica.\n\n' +
        'Profesionalismo y orden\n' +
        'PukaHealth te ayuda a digitalizar tus historias clínicas en Ecuador.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'IMAGEN PROFESIONAL',
        titular: 'El paciente esperando',
        bajada: 'Tú buscando su carpeta en el archivero mientras el tiempo de consulta corre.',
      },
      {
        titular: 'El desgaste del papel',
        bajada:
          'Fichas manchadas, hojas sueltas y letra apurada que después nadie entiende.',
      },
      {
        titular: 'Todo a un clic en la tablet',
        bajada:
          'Buscas por nombre o cédula y tienes el historial clínico en 2 segundos.',
      },
      {
        titular: 'Fotos de evolución en pantalla',
        bajada:
          'Le muestras al paciente cómo llegó en la primera sesión y cómo va su ' +
          'mejora hoy.',
      },
      {
        titular: 'Eleva el nivel de tu clínica',
        bajada:
          'PukaHealth transforma la experiencia de tus pacientes. Pruébalo 15 días.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // Martes 13 · PukaHealth
  {
    id: 'cedulas-validas-rechazadas',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-13T09:00',
    caption:
      '¿Por qué algunos sistemas rechazan cédulas perfectamente válidas en Ecuador?\n\n' +
      'Porque usan un algoritmo viejo que asume que el tercer dígito de la cédula ' +
      'solo puede ser menor a 6. Cuando llega un documento de persona jurídica o ' +
      'extranjero residente, el sistema se bloquea y no te deja registrar al paciente.\n\n' +
      'PukaHealth valida documentos según la normativa real y completa los datos ' +
      'desde el SRI para ahorrarte tipeo.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#SRI #cedulaecuador #consultoriomedico #softwaremedico',
    facebook: {
      publicarEl: '2026-10-13T18:00',
      imagen: {
        titular: 'Tu sistema rechaza\ncédulas válidas\nsin motivo real',
      },
      caption:
        'Cédulas rechazadas en tu consultorio\n' +
        'El paciente te dicta su cédula y tu software dice «documento inválido».\n\n' +
        'La regla del tercer dígito\n' +
        'Muchos sistemas asumen que el tercer dígito siempre es menor a 6, lo cual ya no aplica.\n\n' +
        'Autocompletado con el SRI\n' +
        'PukaHealth se conecta con la base del SRI para traer los nombres y apellidos sin errores.\n\n' +
        'Cero bloqueos en recepción\n' +
        'Registra a tus pacientes rápido y sin trabas técnicas.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'VALIDACIÓN REAL',
        titular: '«Cédula inválida»',
        bajada: 'Tu sistema no deja guardar al paciente aunque el documento sea original.',
      },
      {
        titular: 'Algoritmos desactualizados',
        bajada:
          'Muchos programas aplican reglas viejas que fallan con documentos ' +
          'nuevos o de extranjeros.',
      },
      {
        titular: 'Fricción en la recepción',
        bajada:
          'El paciente esperando incómodo mientras el sistema no permite avanzar.',
      },
      {
        titular: 'Autocompletado del SRI',
        bajada:
          'PukaHealth consulta los datos del SRI y llena el nombre exacto de ' +
          'forma automática.',
      },
      {
        titular: 'Software médico a tu medida',
        bajada:
          'Diseñado específicamente para la normativa y realidad de Ecuador. 15 días gratis.',
        cta: 'Prueba 15 días gratis',
      },
    ],
  },

  // Jueves 15 · La Casa
  {
    id: 'cuanto-cuesta-web-barata',
    sistema: 'puka',
    producto: 'desarrollo-web',
    preciosAjenos: ['50'],
    publicarEl: '2026-10-15T18:00',
    caption:
      '¿Cuánto cuesta de verdad una página web de $50 en Ecuador?\n\n' +
      'Lo barato sale caro cuando a los tres meses se cae el servidor, nadie te contesta ' +
      'el soporte y la página tarda 8 segundos en cargar en el celular de tus clientes.\n\n' +
      'Un sitio web no es un folleto digital: es un canal de ventas que debe ser ' +
      'rápido, seguro y posicionado en Google.\n\n' +
      'pukadigital.com/desarrollo-web-pymes\n\n' +
      '#desarrolloweb #paginasweb #negocios #Ecuador #PukaDigital',
    facebook: {
      publicarEl: '2026-10-16T09:00',
      imagen: {
        titular: 'Una web barata\nte cuesta clientes\ny reputación',
      },
      caption:
        'La trampa de la web barata\n' +
        'Comprar un sitio por $50 parece un negocio redondo hasta que intentas usarlo.\n\n' +
        'Páginas lentas que no venden\n' +
        'Si tu web tarda más de 3 segundos en abrir en el celular, el 60% de la gente se sale.\n\n' +
        'Sin soporte ni actualizaciones\n' +
        'Quien te la armó desaparece y el sitio queda obsoleto y vulnerable.\n\n' +
        'Desarrollo profesional para PYMEs\n' +
        'En Puka Digital creamos sitios veloces, alojados en la nube y optimizados para Google.\n\n' +
        'pukadigital.com/desarrollo-web-pymes',
    },
    slides: [
      {
        badge: 'DESARROLLO WEB',
        titular: 'La web de $50',
        bajada: 'Parece una ganga hasta que descubres lo que no te dijeron.',
      },
      {
        titular: 'Lenta en celulares',
        bajada:
          'Plantillas pesadas que demoran una eternidad en cargar los datos de ' +
          'tu negocio.',
      },
      {
        titular: 'Sin presencia en Google',
        bajada:
          'Nadie la encuentra porque no tiene arquitectura SEO ni optimización ' +
          'técnica.',
      },
      {
        titular: 'El soporte que desaparece',
        bajada:
          'Cuando necesitas cambiar un número o una foto, nadie te responde el ' +
          'WhatsApp.',
      },
      {
        titular: 'Una web que sí trabaja',
        bajada:
          'Rápida, moderna y diseñada para convertir visitas en clientes reales.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },

  // Sábado 17 · PukaHealth
  {
    id: 'el-dolor-de-las-siete-pm',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-17T09:00',
    caption:
      'Son las 7:30 PM, tu familia te espera en casa y tú sigues cuadrando facturas:\n\n' +
      'Atendiste 10 pacientes en el día, terminaste cansado y ahora te toca sentarte a ' +
      'abrir el portal del SRI para tipear rucs, conceptos y valores uno a uno.\n\n' +
      'En PukaHealth la factura electrónica se emite al terminar cada consulta con un solo clic. ' +
      'Sales de tu consultorio a tiempo, con todo en orden.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#facturacionmedica #SRI #consultoriomedico #Ecuador #PukaHealth',
    facebook: {
      publicarEl: '2026-10-17T18:00',
      imagen: {
        titular: 'Facturar al SRI a mano\nte quita tus noches',
      },
      caption:
        'El cansancio de facturar al final del día\n' +
        'El consultorio cierra pero tu jornada no termina: quedan 10 facturas pendientes en el SRI.\n\n' +
        'Un trámite que quita horas\n' +
        'Entrar al portal, tipear la cédula, buscar el concepto y esperar que el sistema no se caiga.\n\n' +
        'Factura emitida en la consulta\n' +
        'Con PukaHealth el comprobante se autoriza en el mismo instante en que cobras.\n\n' +
        'Recupera tus noches\n' +
        'Llega a casa a tiempo con la tranquilidad de que tu facturación está al día.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'GESTIÓN Y TIEMPO',
        titular: 'La jornada que no acaba',
        bajada: 'Terminaste las consultas pero te espera una pila de facturas por emitir.',
      },
      {
        titular: 'Tipear en el SRI a mano',
        bajada:
          'Copiar datos de cada paciente a la página del SRI es agotador tras un ' +
          'día intenso.',
      },
      {
        titular: 'El riesgo de equivocarse',
        bajada:
          'Con el cansancio de la noche es fácil cometer errores en montos o datos ' +
          'del cliente.',
      },
      {
        titular: 'Facturación en un clic',
        bajada:
          'En PukaHealth la factura sale autorizada antes de que el paciente salga ' +
          'del sillón.',
      },
      {
        titular: 'Sal de tu consulta a tiempo',
        bajada:
          'Tu tiempo fuera del consultorio vale oro. PukaHealth te ayuda a cuidarlo.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // ─────────────────────────────  Semana 3  ─────────────────────────────────
  // Martes 20 · PukaHealth
  {
    id: 'pasar-de-papel-a-digital',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-20T09:00',
    caption:
      '«Tengo 400 historias clínicas en papel y me da pánico el cambio a digital»:\n\n' +
      'El mayor temor de los profesionales de salud es pensar que tienen que digitalizar ' +
      'años de carpetas viejas de golpe. No funciona así.\n\n' +
      'Solo digitalizas al paciente que llega hoy a su consulta. En pocas semanas, tus ' +
      'pacientes activos están en la nube sin que hayas tenido que pasar noches escaneando.\n\n' +
      'PukaHealth hace la transición simple y progresiva. 15 días gratis.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#consultoriomedico #digitalizacion #historiasclinicas #podologia #Ecuador',
    facebook: {
      publicarEl: '2026-10-20T18:00',
      imagen: {
        titular: 'Digitalizar tu clínica\nno requiere pasar\nmeses escaneando',
      },
      caption:
        'El miedo a pasar del papel al sistema\n' +
        'Pensar en pasar cientos de carpetas viejas a la computadora frena a cualquiera.\n\n' +
        'El método progresivo\n' +
        'No digitalizas el pasado: digitalizas al paciente que llega hoy a su turno.\n\n' +
        'Tu clínica en la nube en 30 días\n' +
        'En un mes tu consulta activa está 100% digitalizada sin horas extras de trabajo.\n\n' +
        'Fácil y sin complicaciones\n' +
        'PukaHealth está diseñado para usarse desde el primer día sin capacitaciones largas.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'TRANSICIÓN DIGITAL',
        titular: 'El miedo a las carpetas',
        bajada: 'Creer que pasar a digital significa pasar noches enteras escaneando papeles.',
      },
      {
        titular: 'No digitalices el archivo',
        bajada:
          'El 70% de las carpetas viejas pertenecen a pacientes que no volverán.',
      },
      {
        titular: 'Digitaliza solo al que llega',
        bajada:
          'Abres su ficha digital en la tablet en su cita de control y tomas su ' +
          'foto de hoy.',
      },
      {
        titular: 'En 30 días estás al 100%',
        bajada:
          'Toda tu base activa queda organizada de forma natural y sin esfuerzo ' +
          'adicional.',
      },
      {
        titular: 'Da el paso con PukaHealth',
        bajada:
          'Acompañamos a tu consultorio para dejarlo andando en 30 minutos. 15 días gratis.',
        cta: 'Prueba 15 días gratis',
      },
    ],
  },

  // Jueves 22 · La Casa
  {
    id: 'presupuesto-google-ads-ecuador',
    sistema: 'puka',
    producto: 'agencia',
    preciosAjenos: ['5', '300', '400', '0.50', '1.00'],
    publicarEl: '2026-10-22T18:00',
    caption:
      '¿Cuál es el presupuesto mínimo real para pautar en Google Ads en Ecuador?\n\n' +
      'Las agencias suelen venderte campañas prometiendo ventas con $5 al día. La realidad ' +
      'es que si el costo por clic en tu sector ronda $0.50, con $5 solo consigues 10 visitas ' +
      'al día: una muestra insuficiente para que el algoritmo aprenda.\n\n' +
      'Menos de $300 a $400 al mes en pauta suele ser dinero tirado a la basura.\n\n' +
      'pukadigital.com\n\n' +
      '#GoogleAds #marketingdigital #Ecuador #ventasonline #pymes',
    facebook: {
      publicarEl: '2026-10-23T09:00',
      imagen: {
        titular: 'Pautar con poco\nen Google Ads\nes quemar dinero',
      },
      caption:
        'La verdad sobre Google Ads en Ecuador\n' +
        'Te prometen resultados milagrosos invirtiendo $5 al día en publicidad.\n\n' +
        'La matemática del costo por clic\n' +
        'Con clics a $0.50 o $1.00, un presupuesto muy bajo no alcanza para generar conversiones.\n\n' +
        'El algoritmo necesita datos\n' +
        'Para optimizar y traerte clientes listos para comprar, Google necesita volumen diario.\n\n' +
        'Estrategia antes de gastar\n' +
        'En Puka Digital optimizamos tu presupuesto para conseguir clientes, no solo clics.\n\n' +
        'pukadigital.com',
    },
    slides: [
      {
        badge: 'PUBLICIDAD DIGITAL',
        titular: 'La promesa de los $5 al día',
        bajada: 'Te dicen que con poco dinero vas a llenar tu negocio de clientes nuevos.',
      },
      {
        titular: 'La realidad del costo por clic',
        bajada:
          'En rubros competidos, un presupuesto bajo apenas te da 8 o 10 visitas ' +
          'diarias.',
      },
      {
        titular: 'El algoritmo a ciegas',
        bajada:
          'Sin suficiente volumen de datos, Google no puede aprender quién es tu ' +
          'comprador ideal.',
      },
      {
        titular: 'Presupuestos que sí funcionan',
        bajada:
          'Concentrar el presupuesto en palabras clave de alta intención de ' +
          'compra real.',
      },
      {
        titular: 'Marketing ético y rentable',
        bajada:
          'Estrategias claras con números reales para negocios que quieren crecer.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },

  // Sábado 24 · PukaHealth
  {
    id: 'pacientes-no-vuelven-control',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-24T09:00',
    caption:
      '¿Por qué tus pacientes no regresan a su cita de control al mes siguiente?\n\n' +
      'Porque cuando el dolor pasa, el tratamiento se olvida. Si solo le dices con palabras ' +
      'que debe volver, el paciente no percibe la urgencia.\n\n' +
      'Pero cuando le muestras en la tablet la foto de cómo llegó el primer día comparada ' +
      'con la foto de hoy, el impacto visual le demuestra el avance y asegura su regreso.\n\n' +
      'PukaHealth guarda y compara fotos de evolución por sesión.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#podologia #fichaclinica #consultorio #pacientes #Ecuador',
    facebook: {
      publicarEl: '2026-10-24T18:00',
      imagen: {
        titular: 'Mostrar fotos de avance\nasegura el regreso',
      },
      caption:
        'Por qué los pacientes no vuelven al control\n' +
        'Apenas desaparece el síntoma, el paciente cree que ya está curado y abandona.\n\n' +
        'Las palabras no convencen\n' +
        'Explicarle la importancia del tratamiento no genera el mismo impacto que verlo.\n\n' +
        'El poder del antes y después\n' +
        'Mostrarle la foto de su primera consulta en la tablet le hace valorar tu trabajo profesional.\n\n' +
        'Fidelización médica real\n' +
        'PukaHealth organiza fotos de evolución clínica por cada consulta del paciente.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'FIDELIZACIÓN',
        titular: 'El paciente que no vuelve',
        bajada: 'Apenas se le quita la molestia, suspende el tratamiento y no regresa.',
      },
      {
        titular: 'Las palabras se olvidan',
        bajada:
          'Decirle «debe venir el próximo mes» rara vez asegura que agende su cita.',
      },
      {
        titular: 'El impacto de la foto',
        bajada:
          'Ver en la tablet cómo estaba su lesión hace 3 semanas le demuestra el ' +
          'avance.',
      },
      {
        titular: 'Evolución clínica visible',
        bajada:
          'PukaHealth guarda las imágenes directamente en la ficha del paciente ' +
          'en segundos.',
      },
      {
        titular: 'Pacientes que valoran tu labor',
        bajada:
          'Tecnología que respalda tu diagnóstico y fideliza a quienes atiendes. 15 días gratis.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },

  // Martes 27 · PukaHealth
  {
    id: 'auditoria-acess-papel-no-salva',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-27T09:00',
    caption:
      'El papel no te defiende en una inspección de ACESS:\n\n' +
      'La normativa exige trazabilidad: saber qué profesional atendió, qué fecha, a qué ' +
      'hora exacta y que no existan tachones ni alteraciones en la historia clínica.\n\n' +
      'Una auditoría sobre carpetas de papel donde faltan firmas o no se entiende la ' +
      'letra te expone a observaciones graves y sanciones administrativas.\n\n' +
      'PukaHealth registra autoría, fecha y hora con respaldo seguro en la nube.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#ACESS #normativasalud #consultoriomedico #Ecuador #PukaHealth',
    facebook: {
      publicarEl: '2026-10-27T18:00',
      imagen: {
        titular: 'El papel no te salva\nante una inspección',
      },
      caption:
        'La realidad de una auditoría en tu consultorio\n' +
        'Cuando llega una inspección, las historias clínicas en papel son tu mayor debilidad.\n\n' +
        'Exigencia de trazabilidad\n' +
        'La normativa prohíbe tachones, exige claridad y registro exacto del profesional que atendió.\n\n' +
        'El respaldo de la historia digital\n' +
        'Cada registro queda guardado con fecha, hora inalterable y firma de autoría clara.\n\n' +
        'Trabaja con tranquilidad\n' +
        'PukaHealth te ayuda a cumplir los estándares normativos de salud en Ecuador.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'CUMPLIMIENTO LEGAL',
        titular: 'El papel ante una auditoría',
        bajada: 'Las carpetas físicas son el primer blanco de observación en una inspección.',
      },
      {
        titular: 'Tachones y letra ilegible',
        bajada:
          'Enmiendas o notas poco claras pueden anular la validez de tu respaldo ' +
          'clínico.',
      },
      {
        titular: 'Registro inalterable',
        bajada:
          'El sistema digital sella la hora, fecha y profesional de cada ' +
          'atención médica.',
      },
      {
        titular: 'Documentos verificables',
        bajada:
          'Recetas e indicaciones con código único que cualquiera puede validar ' +
          'en línea.',
      },
      {
        titular: 'Protege tu ejercicio médico',
        bajada:
          'PukaHealth te da la seguridad jurídica que tu consultorio necesita. 15 días gratis.',
        cta: 'Prueba 15 días gratis',
      },
    ],
  },

  // ─────────────────────────────  Semana 4  ─────────────────────────────────
  // Jueves 29 · La Casa
  {
    id: 'por-que-tu-web-no-sale-en-google',
    sistema: 'puka',
    publicarEl: '2026-10-29T18:00',
    caption:
      '¿Por qué tu negocio no sale en Google cuando la gente busca lo que vendes?\n\n' +
      'Tener una página web bonita no basta si nadie le avisó a Google que existe. ' +
      'Sin sitemap, sin etiquetas meta adecuadas, sin velocidad de carga y sin ' +
      'contenido optimizado, los buscadores simplemente te ignoran.\n\n' +
      'En Puka Digital construimos sitios web con arquitectura SEO para que te encuentren clientes reales.\n\n' +
      'pukadigital.com/desarrollo-web-pymes\n\n' +
      '#SEO #posicionamiento #paginasweb #Ecuador #PukaDigital',
    facebook: {
      publicarEl: '2026-10-30T09:00',
      imagen: {
        titular: 'Tu página web\nno existe en Google\nsin SEO',
      },
      caption:
        'Tener una web que nadie visita\n' +
        'Pagas por un sitio web, lo buscas en Google con lo que ofreces y no aparece por ningún lado.\n\n' +
        'Google no premia lo bonito\n' +
        'El buscador premia la velocidad, la estructura técnica y que el contenido responda a lo que la gente busca.\n\n' +
        'Arquitectura SEO desde el día uno\n' +
        'Cada página debe tener sus metadatos, datos estructurados y sitemap dinámico.\n\n' +
        'Aparece donde tus clientes buscan\n' +
        'Desarrollo web optimizado para negocios y profesionales en Ecuador.\n\n' +
        'pukadigital.com/desarrollo-web-pymes',
    },
    slides: [
      {
        badge: 'SEO Y VISIBILIDAD',
        titular: 'Tu web invisible en Google',
        bajada: 'Pagas por una página y cuando buscas tus servicios en tu ciudad no apareces.',
      },
      {
        titular: 'El diseño no lo es todo',
        bajada:
          'Google no ve si los colores son bonitos; lee el código, la velocidad ' +
          'y el contenido.',
      },
      {
        titular: 'La falta de indexación',
        bajada:
          'Muchos sitios se entregan sin registrar ante los motores de búsqueda ' +
          'ni sitemaps.',
      },
      {
        titular: 'Optimización para tu ciudad',
        bajada:
          'Aparecer cuando alguien busca en Quito, Guayaquil o Cuenca lo que tu ' +
          'negocio vende.',
      },
      {
        titular: 'Haz que tu web trabaje',
        bajada:
          'Desarrollamos páginas preparadas para competir y posicionar en Google.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },

  // Sábado 31 · PukaHealth
  {
    id: 'recepcionista-buscando-papeles-vs-nube',
    sistema: 'health',
    producto: 'pukahealth',
    publicarEl: '2026-10-31T09:00',
    caption:
      'El costo de tener a tu asistente buscando papeles vs un sistema en la nube:\n\n' +
      'Tu recepcionista o asistente debería estar dedicada a confirmar citas, responder ' +
      'mensajes y recibir con calidez a los pacientes. En vez de eso, pasa horas ' +
      'archivando carpetas, buscando fichas perdidas y pasando cuentas a mano.\n\n' +
      'Liberar a tu equipo del papeleo mejora la atención y la rentabilidad de tu clínica.\n\n' +
      'pukadigital.com/pukahealth\n\n' +
      '#consultoriomedico #eficiencia #podologia #Ecuador #PukaHealth',
    facebook: {
      publicarEl: '2026-10-31T18:00',
      imagen: {
        titular: 'Tu asistente debe\natender pacientes,\nno buscar papeles',
      },
      caption:
        'El talento de tu equipo atrapado en el papel\n' +
        'Tu recepcionista pasa media jornada archivando y buscando carpetas en cajones.\n\n' +
        'Atención de calidad al paciente\n' +
        'Su tiempo vale más confirmando turnos, respondiendo dudas y brindando una buena bienvenida.\n\n' +
        'La nube hace el trabajo pesado\n' +
        'Las fichas se organizan solas, las facturas se emiten al instante y nada se traspapela.\n\n' +
        'Clínicas más eficientes y humanas\n' +
        'PukaHealth le devuelve el tiempo a tu equipo. Pruébalo 15 días sin costo.\n\n' +
        'pukadigital.com/pukahealth',
    },
    slides: [
      {
        badge: 'EQUIPO Y EFICIENCIA',
        titular: 'Horas perdidas en cajones',
        bajada: 'Tu equipo dedicando media mañana a archivar y buscar carpetas traspapeladas.',
      },
      {
        titular: 'El paciente desatendido',
        bajada:
          'Mientras buscan una ficha física, el teléfono suena y la sala de ' +
          'espera se llena.',
      },
      {
        titular: 'Organización automática',
        bajada:
          'En la nube cada ficha se guarda, actualiza y respalda sin tocar un ' +
          'solo archivador.',
      },
      {
        titular: 'Un equipo más enfocado',
        bajada:
          'Tu asistente se dedica a fidelizar pacientes y confirmar turnos para ' +
          'que no falten.',
      },
      {
        titular: 'Transforma tu consultorio',
        bajada:
          'Moderniza la operación de tu clínica con PukaHealth. 15 días de prueba gratis.',
        cta: 'Empieza gratis hoy',
      },
    ],
  },
];

export default piezas;
