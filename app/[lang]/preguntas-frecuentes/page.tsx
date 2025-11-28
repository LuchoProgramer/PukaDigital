'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, Clock, GraduationCap, Target, Shield } from 'lucide-react';
import SEO from '@/components/SEO';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  faqs: FAQ[];
}

const PreguntasFrecuentes: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryId: string, index: number) => {
    const key = `${categoryId}-${index}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const faqCategories: FAQCategory[] = [
    {
      id: 'precio',
      title: 'Precio y Pagos',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      faqs: [
        {
          question: '¿Por qué $900 en total si otras agencias cobran $500 por solo una página web?',
          answer: 'El programa de PukaDigital incluye tres entregables en tres meses: página web profesional con posicionamiento en Google, asistente virtual inteligente integrado a WhatsApp Business, y sistema completo de gestión con facturación electrónica SRI. Además, incluye $300 en créditos de publicidad en Google y capacitación completa para que manejes todo de forma autónoma. Una agencia tradicional cobraría entre $2,000-$5,000 solo por el desarrollo inicial, más $200-$500 mensuales de manera permanente.'
        },
        {
          question: '¿Qué pasa después de los 3 meses? ¿Tengo que seguir pagando obligatoriamente?',
          answer: 'No. Después de los 3 meses, tú decides si necesitas los servicios opcionales de panel de administración y alojamiento ($20/mes), asistente virtual en WhatsApp ($20/mes), o sistema de gestión y facturación ($20/mes). El máximo que pagarías es $60/mes por todo, pero son completamente opcionales. El código de tu página web es tuyo, el conocimiento es tuyo, y puedes gestionarlo tú mismo o contratar a quien quieras sin ataduras ni contratos de permanencia.'
        },
        {
          question: '¿Los $100 mensuales de publicidad en Google están incluidos durante todo el programa?',
          answer: 'Sí. Durante los 3 meses del programa incluimos $100/mes ($300 en total) en créditos de publicidad de Google completamente operativos. Esto significa que tu negocio estará recibiendo clientes potenciales desde el primer mes. Después de los 3 meses, si quieres continuar con publicidad en Google, tendrás el conocimiento completo para manejarlo tú mismo o contratar directamente con Google.'
        },
        {
          question: '¿Puedo pagar en cuotas o solo de contado?',
          answer: 'El programa se paga en 3 cuotas de $300 mensuales, una al inicio de cada mes correspondiente a los entregables de ese mes. Mes 1: $300 al iniciar (página web + posicionamiento Google + alojamiento). Mes 2: $300 (asistente virtual + WhatsApp Business). Mes 3: $300 (sistema de gestión + facturación electrónica SRI). No se requiere pago total por adelantado.'
        },
        {
          question: '¿Qué incluye exactamente el precio de $900? ¿Hay costos ocultos?',
          answer: 'El precio de $900 incluye todo: desarrollo completo de tu página web, alojamiento durante los 3 meses, tu nombre propio (.com o .ec), candado de seguridad, posicionamiento en Google, asistente virtual entrenado para tu negocio, integración con WhatsApp Business, sistema de gestión configurado para facturación electrónica SRI de Ecuador, registro de clientes completo, y $300 en publicidad de Google. Los únicos costos opcionales post-programa son los servicios de mantenimiento mencionados ($20/mes cada uno si los deseas).'
        }
      ]
    },
    {
      id: 'tiempo',
      title: 'Proceso y Tiempo',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      faqs: [
        {
          question: '¿En cuánto tiempo veo los primeros resultados en mi negocio?',
          answer: 'Los resultados son progresivos. Mes 1: tu página web estará en línea y las campañas de publicidad en Google comenzarán a generar tráfico inmediatamente. Mes 2: el asistente virtual empezará a responder consultas 24/7 reduciendo tu carga de trabajo. Mes 3: tu sistema de gestión estará operativo para manejar clientes y facturación. Casos de éxito como PodoclinicEC lograron 53 consultas mensuales (33 de publicidad + 20 orgánicas) al finalizar el programa.'
        },
        {
          question: '¿Qué pasa si no puedo cumplir con las sesiones de capacitación por mi tiempo?',
          answer: 'El programa está diseñado con flexibilidad para dueños de negocios ocupados. Las sesiones de capacitación se agendarán según tu disponibilidad, pueden ser presenciales o virtuales, y todas quedan grabadas para que las revises cuando puedas. Si necesitas más tiempo en algún módulo, nos adaptamos. Lo importante es que al finalizar tengas el conocimiento necesario para ser autónomo.'
        },
        {
          question: '¿Por qué solo aceptan 3 clientes a la vez?',
          answer: 'Limitamos a 3 clientes simultáneos para garantizar atención personalizada de calidad y dedicación completa a cada proyecto. No somos una "fábrica de páginas web". Cada cliente recibe capacitación intensiva, acceso directo al equipo, y seguimiento constante durante los 3 meses. Este modelo asegura que verdaderamente logres la independencia digital prometida, no solo un entregable genérico.'
        },
        {
          question: '¿Qué sucede si mi negocio no está listo en 3 meses?',
          answer: 'El cronograma de 3 meses está diseñado para ser cumplible con compromiso de ambas partes. Sin embargo, si por razones justificadas necesitas más tiempo para completar algún módulo de capacitación, podemos extender el soporte sin costo adicional por 30 días más. Lo importante es que al finalizar tengas todos tus sistemas operativos y el conocimiento para gestionarlos.'
        }
      ]
    },
    {
      id: 'tecnico',
      title: 'Capacidad Técnica Requerida',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      faqs: [
        {
          question: '¿Necesito saber programar o tener conocimientos técnicos previos?',
          answer: 'No. El programa está diseñado específicamente para dueños de PYMEs sin conocimientos técnicos. Aprenderás mediante pantallas visuales intuitivas, tutoriales paso a paso, y práctica guiada. Si sabes usar Facebook o WhatsApp, tienes el nivel técnico suficiente. Enseñamos desde cero: cómo publicar contenido, actualizar imágenes, revisar estadísticas, gestionar el asistente virtual, y usar el sistema para tus facturas.'
        },
        {
          question: '¿Qué pasa si no aprendo a manejarlo todo en 3 meses?',
          answer: 'Si al finalizar los 3 meses sientes que necesitas refuerzo en algún área específica, ofrecemos sesiones adicionales de capacitación a precio preferencial. Además, toda la capacitación queda documentada en video y manuales escritos que puedes consultar cuando quieras. En más de 50 casos exitosos, el 95% de nuestros clientes logran autonomía completa dentro del programa. Y si definitivamente prefieres no hacerlo tú mismo, puedes contratar los servicios de mantenimiento mensuales.'
        },
        {
          question: '¿Puedo contratar a alguien más para que lo maneje si después no quiero hacerlo yo?',
          answer: 'Absolutamente sí. Como todo el código y los sistemas son tuyos sin restricciones, puedes contratar a cualquier desarrollador, agencia, o familiar con conocimientos para que lo maneje por ti. No hay código propietario ni ataduras. Incluso puedes contratar a PukaDigital para servicios de mantenimiento mensuales ($20-$60/mes según lo que necesites). La diferencia es que TÚ decides, no estás obligado a nada.'
        }
      ]
    },
    {
      id: 'entregables',
      title: 'Entregables Específicos',
      icon: <Target className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
      faqs: [
        {
          question: '¿El asistente virtual realmente puede responder como un humano o es muy robótico?',
          answer: 'El asistente virtual utiliza la misma tecnología de ChatGPT (inteligencia artificial avanzada) entrenado específicamente con información de tu negocio: servicios, precios, horarios, políticas, preguntas frecuentes. Puede mantener conversaciones naturales en español, entender la intención del cliente, responder consultas, agendar citas, y avisarte cuando sea necesario que intervengas. No es un bot de menú predefinido, es inteligencia artificial conversacional real que mejora con el tiempo.'
        },
        {
          question: '¿El sistema sirve para facturación electrónica del SRI de Ecuador?',
          answer: 'Sí. El sistema de gestión viene configurado completamente para cumplir con la normativa del Servicio de Rentas Internas (SRI) de Ecuador para facturación electrónica. Genera facturas, notas de crédito, retenciones, y guías de remisión con firma electrónica válida. Se conecta directamente con el portal del SRI para envío automático de comprobantes. Incluye configuración inicial de tu RUC, certificado digital, y puntos de emisión.'
        },
        {
          question: '¿Puedo migrar mi página web actual o tengo que empezar desde cero?',
          answer: 'Podemos hacer ambas opciones. Si tu sitio actual tiene contenido valioso (textos, imágenes, estructura), podemos migrarlo a la nueva página optimizada. Si prefieres renovar completamente, creamos desde cero con diseño moderno y enfocado en conseguir clientes. Durante la primera sesión evaluamos tu situación actual y recomendamos la mejor estrategia. En cualquier caso, el resultado será una página profesional, rápida, y optimizada.'
        },
        {
          question: '¿La página web funciona bien en celulares y tablets?',
          answer: 'Sí, absolutamente. Todas las páginas se diseñan para adaptarse perfectamente a cualquier dispositivo: celulares, tablets, laptops, y computadoras de escritorio. Más del 70% del tráfico web en Ecuador proviene de dispositivos móviles, por lo que priorizamos la experiencia en celular. Además, cumplimos con los estándares de Google para velocidad y rendimiento óptimos, lo que también ayuda a tu posicionamiento.'
        },
        {
          question: '¿Qué pasa si necesito agregar nuevas funcionalidades después del programa?',
          answer: 'Como la página está construida con tecnología moderna y escalable, y el código es completamente tuyo, puedes agregar cualquier funcionalidad que necesites en el futuro. Puedes hacerlo tú mismo si aprendes más, contratar a PukaDigital para desarrollos adicionales, o contratar a cualquier desarrollador del mercado. El sistema está diseñado para crecer con tu negocio sin necesidad de reconstruir desde cero.'
        }
      ]
    },
    {
      id: 'garantias',
      title: 'Garantías y Soporte',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30',
      faqs: [
        {
          question: '¿Tienen casos de éxito verificables con PYMEs reales?',
          answer: 'Sí. PodoclinicEC (podología, Quito Norte) logró 53 consultas mensuales; HealppyPets (veterinaria) implementó página web completa más asistente virtual en el mes 2; Hotel Eudiq tuvo sistema completo operativo en semana 2. Podemos mostrarte las páginas en vivo, estadísticas de Google anonimizadas, y si lo deseas, conectarte con algunos clientes actuales para que te cuenten su experiencia directamente.'
        },
        {
          question: '¿Qué garantía tengo de que la página web y sistemas seguirán funcionando?',
          answer: 'Durante los 3 meses del programa, cualquier error técnico, caída del sitio, o problema con los sistemas se resuelve inmediatamente sin costo adicional. Después del programa, si contratas los servicios de mantenimiento ($20/mes por servicio), incluyen vigilancia 24/7, actualizaciones de seguridad, copias de respaldo diarias automáticas, y soporte técnico prioritario. Si eliges gestionarlo tú mismo, te entregamos toda la documentación y accesos para que cualquier técnico pueda mantenerlo.'
        },
        {
          question: '¿Por qué debería elegir PukaDigital en lugar de una agencia tradicional o un freelancer?',
          answer: 'PukaDigital ofrece un modelo único anti-agencia: inversión única de $900 vs $2,000-$5,000 iniciales más $200-$500/mes perpetuos de agencias; código abierto tuyo vs código propietario; capacitación para independencia vs dependencia permanente; atención limitada a 3 clientes vs producción masiva; tecnología moderna vs tecnologías obsoletas. Comparado con freelancers: garantía empresarial vs riesgo individual; equipo multidisciplinario vs una sola persona; seguimiento estructurado vs improvisación. No construimos páginas web, construimos dignidad e independencia digital.'
        }
      ]
    }
  ];

  // Flatten all FAQs for schema
  const allFaqs = faqCategories.flatMap(cat => cat.faqs);

  // FAQPage Schema - Valid because content is visible on page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://pukadigital.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Preguntas Frecuentes",
        "item": "https://pukadigital.com/es/preguntas-frecuentes"
      }
    ]
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [faqSchema, breadcrumbSchema]
  };

  return (
    <div className="pt-12 pb-24 bg-white dark:bg-gray-900 transition-colors">
      <SEO 
        title="Preguntas Frecuentes | Todo sobre el Programa de Independencia Digital"
        description="Resuelve todas tus dudas sobre precios, proceso, capacitación y garantías del programa de 3 meses de PukaDigital. Sin jerga técnica, respuestas claras."
        keywords="preguntas frecuentes puka digital, cuanto cuesta pagina web ecuador, facturacion electronica sri, asistente virtual whatsapp precio"
        structuredData={combinedSchema}
      />

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block py-1 px-3 bg-puka-red/10 text-puka-red font-semibold text-xs tracking-wider uppercase mb-4 rounded-sm border border-puka-red/20">
            Resolvemos Tus Dudas
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Todo lo que necesitas saber antes de tomar la decisión. Sin jerga técnica, respuestas claras.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-puka-red">$900</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Inversión Total</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-puka-red">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Meses de Programa</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-puka-red">$0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Contratos Eternos</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-puka-red">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Código Tuyo</div>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Category Header */}
              <div className={`flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700`}>
                <div className={`p-2 rounded-lg ${category.color}`}>
                  {category.icon}
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">
                  {category.title}
                </h2>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {category.faqs.length} preguntas
                </span>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.faqs.map((faq, index) => {
                  const key = `${category.id}-${index}`;
                  const isOpen = openItems[key];
                  
                  return (
                    <div key={index} className="group">
                      <button
                        onClick={() => toggleItem(category.id, index)}
                        className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-puka-red transition-colors">
                          {faq.question}
                        </span>
                        <span className="flex-shrink-0 mt-1">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-puka-red" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </span>
                      </button>
                      
                      {/* Answer - Always in DOM for SEO, hidden with CSS */}
                      <div 
                        className={`px-6 pb-4 transition-all duration-300 ${
                          isOpen ? 'block' : 'hidden'
                        }`}
                      >
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-br from-puka-red to-red-700 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="font-bold text-2xl md:text-3xl mb-4">
              ¿Tienes más preguntas?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Agenda una entrevista gratuita de 15 minutos. Sin compromiso, sin vendedores agresivos. Solo una conversación honesta sobre si el programa es para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/es/contacto"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-puka-red font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Agendar Entrevista Gratis
              </Link>
              <a
                href="https://wa.me/593964065880?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20el%20programa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                WhatsApp Directo
              </a>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto mt-12">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Casos verificables: <span className="font-medium">PodoclinicEC</span> (53 consultas/mes) • <span className="font-medium">HealppyPets</span> (asistente virtual activo) • <span className="font-medium">Hotel Eudiq</span> (sistema en 2 semanas)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;
