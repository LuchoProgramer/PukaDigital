# Calendario de contenido — septiembre, octubre y noviembre de 2026

Los temas de tres meses. Escrito el 2026-09-02.

Para la cadencia, la mezcla y la doctrina visual, ver `COMMUNITY_MANAGEMENT.md`.
Para lo que PukaHealth **no** hace y no se puede prometer, ver `AGENTS.md`.

---

## Cómo se reparte

| Por semana | Pieza | Sistema visual | Quién |
|---|---|---|---|
| 1 | Carrusel de PukaHealth | Claro y azul | La fábrica |
| 1 | Carrusel de la casa | Dark Glass Rojo | La fábrica |
| 2 | Reel de objeto parlante | Según el tema | Luis en Flow |
| 1 | Video a cámara | — | Luis, grabado por lotes |

**Los Reels no llevan tema propio.** Salen de un carrusel ya escrito: se toma
una sola de sus ideas y se cuenta en 20 segundos. Así 24 temas alimentan 48
piezas, y de paso el mensaje se repite sin sonar repetido — que es lo que hace
que la gente lo recuerde.

Los videos a cámara sí son distintos: no explican, dan la cara. Van aparte.

---

## Los 24 carruseles

Ordenados de mayor a menor fuerza. Los primeros son los que más se comparten, y
conviene gastarlos pronto: con la cuenta pequeña, lo que hace falta es alcance.

### PukaHealth — utilidad (los que se comparten)

| # | Tema | Por qué funciona |
|---|---|---|
| 1 | **Un podólogo no puede recetar medicamentos.** Art. 168 de la Ley Orgánica de Salud: solo médicos, odontólogos y obstetrices | Le sorprende a medio gremio y afecta a quien lo lee. El mejor de la lista |
| 2 | **Tu clínica necesita un Delegado de Protección de Datos, y el plazo ya venció.** Resolución SPDP-SPD-2026-0005-R | Aplica a toda clínica, tenga software o no. Va como «esto existe, confírmenlo con su asesor», nunca como asesoría legal |
| 3 | **Un Enter tumba tu factura.** El XSD del SRI prohíbe saltos de línea → error 35 | Concreto, verificable, y le ha pasado a todos |
| 4 | **Siete cosas que le faltan a tu receta.** Contenido mínimo del Art. 5: edad en meses si es menor de 5, CIE, alergias, DCI sin abreviaturas, cantidad en números **y letras**, registro ACESS | Lista accionable. El registro ACESS no es el del título, y casi nadie lo sabe |
| 5 | **El SRI te autorizó una factura mal hecha.** Caso real: $70 a Consumidor Final cuando el tope es $50 | Enseña algo incómodo: que te la autoricen no significa que esté bien |
| 6 | **Tu sistema rechaza cédulas válidas.** El tercer dígito ≥6 es legal; el SRI no aplica esa regla | Contraintuitivo y comprobado emitiendo contra el SRI real |
| 7 | **Un garabato no es una firma.** Art. 5.d.iii: «no se aceptarán rúbricas o trazos por firma» | Corto, visual, y todo el mundo firma así |
| 8 | **Cuánto dura una receta.** Ambulatoria 3 días, emergencia 1, antimicrobianos 3. Y se archivan 5 años | Dato de referencia, del tipo que se guarda |
| 9 | **Por qué tu factura falla solo de noche.** Error 65: si el sistema toma la fecha en UTC, después de las 19:00 emite con fecha de mañana | Un misterio con solución. Formato ideal para carrusel |
| 10 | **Probar te quema números.** El secuencial se comparte entre pruebas y producción por RUC + establecimiento + punto de emisión | Le ahorra un lío real a quien está montando su facturación |

### PukaHealth — producto y prueba

| # | Tema | Nota |
|---|---|---|
| 11 | **Tu agenda en tu Google Calendar.** Ves tus citas en el teléfono antes de cargar un solo paciente | El gancho del día uno. ⚠️ Es **unidireccional**: nunca escribir «se sincroniza» |
| 12 | **Una receta que el paciente puede verificar.** Captura de `/validar-receta/[token]`: medicamento, dosis y badge vigente/vencida | Pantalla pública, sin login. La mejor captura del producto |
| 13 | **El papel no te defiende en una auditoría.** 72 h, adendas y registro de accesos | El dolor más caro, aunque no se sienta hasta que pasa |
| 14 | **La consulta que se perdió.** Autoguardado y trabajo sin conexión | El dolor más frecuente: pasa a diario |
| 15 | **Producción contra facturado, por profesional.** Captura de `/reportes/profesionales` | Concepto que da para explicar y que nadie más muestra |
| 16 | **Lo que el software extranjero no hace.** Jane App y Cliniko no facturan al SRI | Barrera de entrada real, no un diferencial inventado |

### La casa — Dark Glass Rojo

| # | Tema | Nota |
|---|---|---|
| 17 | **Precios de software en Ecuador, sin maquillaje.** Mercately $99-499, Zolutium $79, Sellerchat $49, PukaIA desde $14.99 | El ángulo competitivo, ya documentado |
| 18 | **PukaIA es un CRM, no un chatbot.** Inbox, pipeline, clientes, reportes | Corrige la categoría en la que te meten |
| 19 | **Cuánto te cuesta de verdad tu Excel.** El cierre de caja a mano contra el POS, con cronómetro | Utilidad pura, sin vender |
| 20 | **Cuántas ventas pierdes por tardar en contestar** | Con datos, no con opinión |
| 21 | **Qué te pide el SRI para facturar electrónicamente.** Certificado, RUC, ambiente de pruebas | La misma materia del SRI, para pymes en vez de clínicas |
| 22 | **Cuánto cuesta de verdad una landing page** | Ya hay una página del sitio sobre esto: se recicla |
| 23 | **Presupuesto mínimo real para Google Ads en Ecuador** | Lo que nadie dice antes de venderte la campaña |
| 24 | **Por qué tu web no aparece en Google** | Entrada natural al servicio de agencia |

---

## Los 12 videos a cámara

No explican: dan la cara. Son el ancla de confianza y lo único que no puede
hacer nadie más.

1. Quién soy y por qué hago software para pymes ecuatorianas
2. Por qué una agencia de marketing terminó construyendo un ERP
3. El error que me costó un cliente
4. Por qué no vendo «paquetes de redes sociales»
5. Lo que aprendí facturando al SRI a las malas
6. Por qué PukaHealth nació de un consultorio de podología
7. Cómo decido qué construir y qué no
8. Lo que nadie te dice de trabajar con el SRI
9. Por qué mis precios son públicos
10. El día que un cliente me dijo que no
11. Qué hago cuando el sistema falla un viernes
12. En qué me equivoqué este año

⚠️ **Se graban por lotes**, cuatro por sesión, una mañana al mes. Es la
diferencia entre que esto dure tres meses o tres años.

---

## Reglas que no se negocian

- **Nada que PukaHealth no haga.** La lista está en `AGENTS.md`. En salud, una
  promesa falsa pesa más que en cualquier otro producto.
- **Los precios son $50/mes y $480/año.** No existe ningún precio beta. Y los
  Términos de Servicio delegan el precio en el sitio web: lo que se publique es
  la referencia contractual.
- **Toda captura de pantalla lleva el aviso de datos ficticios**, dentro de la
  imagen y **en cada slide que muestre pantalla**, no solo en la portada.
- **Lo normativo se comparte como «esto existe y les aplica, confírmenlo con su
  asesor».** Nunca como asesoría legal.
- **Nunca los números internos de la clienta.** «39 de 351 fichas sin cédula» y
  similares la exponen y la retratan mal. Tampoco nombres del personal sin
  consentimiento escrito.

## Números que sí se pueden publicar

1.733 tests automatizados en backend y 934 en frontend · en producción desde
marzo de 2026 · el autocompletado desde el SRI cubre el **70%** medido sobre 40
cédulas reales, y el resto cae a llenado manual sin error · la adopción de
historia clínica electrónica en Ecuador ronda el **24,5%**.
