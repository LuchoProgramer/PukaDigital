# Imagen propia para Facebook — diseño

**2026-09-09.** La primera publicación real en la Página de Facebook salió hoy a
las 12:35 y dejó a la vista un hueco de diseño: la imagen no era una pieza de
Facebook, era la slide 1 del carrusel de Instagram sacada de contexto.

Continúa `2026-09-07-facebook-canal-propio-design.md`, que resolvió *cómo*
publicar en Facebook. Este resuelve *qué* publicar.

---

## El problema, con nombre y apellido

La slide 1 de un carrusel es un **gancho incompleto a propósito**: existe para
que deslices. Sola en un feed no dice nada.

Dos defectos concretos, verificados en el post que salió hoy
(`764585143409223_122139713577028608`):

1. **Lleva «01 / 05» impreso.** `plantilla.tsx:165` dibuja el contador cuando
   `total > 1`, y `renderPieza` pasa `total = pieza.slides.length`. En un post de
   una sola foto, esa etiqueta promete cuatro imágenes que no existen.
2. **Dice el gancho, no la conclusión.** El titular fue «Tu clínica ya está en
   falta» y la bajada «el plazo venció hace meses». La respuesta —qué te obliga,
   qué hacer— vive en las slides 2 a 5, que en Facebook nadie ve.

---

## Lo que dice la industria, y lo que descarta

Investigado el 2026-09-09. Las fuentes al final.

**Las dimensiones ya son las correctas.** Facebook recomienda **1080×1350 (4:5)**
para el feed en 2026, porque el 98% del tráfico es móvil y el vertical ocupa más
pantalla. Es exactamente lo que ya genera `FORMATOS['4x5']`.

⇒ **No hace falta una fábrica separada.** El renderizador (Satori + Resvg), las
fuentes, los tokens de sistema y el tamaño sirven igual. Lo que falta es el
modelo de contenido.

**Fotos de stock: descartadas.** En salud las fotos *reales* rinden más que las
de banco, pero «reales» significa las del consultorio propio. Para B2B la
recomendación es explícita: evitar visuales genéricos de stock, porque restan
credibilidad. Una foto comprada de un médico con estetoscopio es el cliché que
nos haría parecer una plantilla más.

**Tipografía rotunda: sí.** La literatura lo dice para nuestro caso exacto —
funciona «particularmente bien para marcas que no pueden depender de fotografía
cara pero necesitan visuales de alto impacto a escala». Y añade que en Meta hay
más ruido visual que antes, así que contraste y titular rotundo es lo que gana.

**Capturas del producto: sí, y son la mejor opción disponible.** Son «fotos
reales» en el sentido que importa: prueba de que la cosa existe y funciona.

**Menos texto en la imagen — pero no por la regla del 20%.** Un borrador de esta
spec justificaba quitar elementos citando la «regla del 20% de texto» de Meta.
**Era un argumento falso por partida doble**, y el contraste lo tumbó:

- La regla dura se **eliminó en septiembre de 2020**. Hoy no hay rechazo
  automático.
- Y lo que importa más: **nunca aplicó a las publicaciones orgánicas**, que es lo
  que hacemos. Solo afecta a anuncios y publicaciones promocionadas, donde
  sobrevive como una escala de valoración que influye en el alcance pagado.
- Además la aritmética del borrador era errónea: en 1080×1350 cada celda de una
  rejilla 5×5 mide 216×270 px, y **cualquier** titular a ancho completo toca las
  cinco columnas de su fila. Una composición normal toca entre 10 y 14 celdas
  hagas lo que hagas.

La conclusión práctica no cambia —la imagen suelta lleva menos elementos que una
slide de carrusel— pero el motivo es otro y hay que decirlo bien: **se lee mejor
y compite mejor en un feed ruidoso**. Si algún día se promociona un post, la
valoración de texto de Meta pasa a contar; hoy no.

⚠️ No repetir la cifra del 20% como si fuera una restricción vigente sobre lo
orgánico. No lo es.

**La regla de composición que ordena todo lo anterior:** *el mensaje central va
en el gráfico y el detalle en el caption.* Una frase corta o un dato, no un
párrafo, y no un gancho.

---

## El diseño

### 1. `facebook.imagen` — la pieza declara su imagen de Facebook

```typescript
facebook: {
  publicarEl: '2026-09-15T18:00',
  caption: '…el texto largo…',
  imagen: {
    titular: 'En un mes construimos la vertical\ncompleta de hemodiálisis',
    dato: { valor: '166', etiqueta: 'sesiones registradas' },   // opcional
    captura: 'hemodialisis-sesiones.png',                       // opcional
  },
},
```

Tres campos y ninguno más. **No lleva `bajada`, ni `badge`, ni `cta`**: cada uno
es una franja de texto más compitiendo por la atención en una imagen que se ve de
paso. Lo que no cabe en el titular va al caption, que es donde la industria dice
que debe ir.

El titular debe poder cortar de línea a mano: uno que rompe donde no debe se lee
peor que uno más corto.

🔴 **Pero `\n` a secas NO funciona, y un borrador de esta spec decía que sí.**
Verificado renderizando con Satori el 2026-09-09: un texto `'AAA\nBBB'` a 40 px
ocupa **48 px de alto —una sola línea—**, porque JSX y el motor flex normalizan
el salto como espacio. Con `whiteSpace: 'pre-line'` ocupa 96 px, dos líneas.

Las dos vías que funcionan, medidas: **`whiteSpace: 'pre-line'` en el estilo del
titular**, o partir la cadena por `\n` y mapear cada trozo a su propio bloque
flex. La primera es un cambio de una línea; se prefiere esa.

### 2. Plantilla propia, mismo renderizador

Una variante de `Plantilla` para Facebook. Tres diferencias con la de carrusel:

| | Carrusel (Instagram) | Suelta (Facebook) |
|---|---|---|
| Contador `01 / 05` | sí | **nunca** |
| Elementos de texto | badge, titular, bajada, dato, cta | **titular + dato** |
| Papel de la captura | ilustra una de cinco | **prueba, debajo del titular** |

Composición: **titular en el tercio superior, captura debajo.** Respeta la zona
segura —lo importante hacia el centro vertical— y deja la captura como evidencia,
no como decoración.

**El presupuesto vertical, medido** (1080×1350, margen 88, ancho útil 904):

| | px |
|---|---|
| márgenes | 176 |
| titular, hasta 3 líneas a 82 px | 246 |
| bloque de dato | 120 |
| pie con la URL | 60 |
| aviso de datos ficticios | 82 |
| **queda para la captura** | **666** |

Una captura 16:9 escalada a 904 px de ancho ocupa 508 px: cabe con holgura. Pero
si además se declara `dato` **y** el titular usa las tres líneas, el margen se
estrecha, así que la plantilla debe **medir y encoger**, no confiar en que cabe.

🔴 **Y el riesgo real no es el espacio, es la legibilidad.** Medido: una captura
de 1920 px escalada al ancho útil queda al 47%, y un texto de 14 px dentro de
ella se convierte en 6,6 px — ilegible. La regla que sale de ahí:

> **La captura es un recorte de la región de interés, no la pantalla entera.
> Máximo ~1200 px de ancho de origen**, para que el texto de dentro se lea.

Es además lo que evita que se cuele el dock de macOS, que ya pasó una vez.

Se descartó la captura a sangre con el titular superpuesto: en 4:5 una captura de
escritorio obliga a recortar tanto que no se entiende qué se está viendo, y el
aviso de datos ficticios competiría con el titular.

El nombre del archivo lo distingue del resto: `<id>-fb.png`. No `-1-4x5`, que es
la nomenclatura de slides del carrusel.

🔴 **Cambiar el nombre obliga a tocar tres sitios que un borrador de esta spec no
nombraba**, y de ahí salía un 404 en producción:

| Archivo | Qué tiene hoy | Qué necesita |
|---|---|---|
| `lib/publicar/facebook.ts:57` | `${pieza.id}-1-4x5.png` cableado | `${pieza.id}-fb.png` |
| `lib/publicar/cli.ts:42` | lo mismo, en el ensayo | igual |
| `lib/publicar/facebook.test.ts` | espera `-1-4x5` | actualizar |

Y hay un cuarto, más sutil: **`fechaPublicacionFacebook` (`programado.ts:83-87`)
da fecha a cualquier pieza con `publicarEl`, tenga bloque `facebook` o no.** Con
el nombre nuevo, una pieza sin `imagen` se programaría igual e intentaría subir
una URL que no existe. Debe devolver `undefined` si la pieza no tiene
`facebook.imagen`.

**Los PNG están versionados**, no se generan en el despliegue:
`public/piezas/2026-09/` tiene hoy 35 archivos. Añadir `-fb.png` son 7 archivos
nuevos que hay que generar con `npm run piezas` **y commitear**.

### 3. El aviso de datos ficticios no se toca

`capturas.ts` lo estampa pegado a la captura y sin bandera para quitarlo. Eso se
mantiene tal cual: la pieza de Facebook lleva captura, luego lleva aviso. Ya
costó un video retirado en YouTube con la apelación rechazada.

### 4. Sin `facebook.imagen` la validación falla — no hay degradado silencioso

Hoy, si falta, se usa la slide 1. **Eso se elimina.** Una pieza con bloque
`facebook` y sin `imagen` no pasa `validar()`.

El motivo es la lección de esta mañana: tres de los fallos que aparecieron en el
canal de Facebook eran mudos —el perfil ilegible que devolvía `[]`, el caption
vacío que publicaba en blanco, la fecha mal escrita que no salía nunca—. Un
fallback que publica algo genérico en vez de avisar es de la misma familia:
nadie se entera hasta que lo ve publicado, que es exactamente lo que pasó hoy.

**Qué valida exactamente `facebook.imagen`** —sin esto, dos implementadores lo
resolverían distinto:

| Comprobación | Regla |
|---|---|
| `titular` | obligatorio, no vacío tras `trim()` |
| largo del titular | **mismos topes que una slide**: `MAX_PALABRAS_TITULAR = 9` y `TOPES.titular = 60` |
| `dato` | opcional; si está, `valor` y `etiqueta` no vacíos |
| `captura` | opcional; si está, **el archivo debe existir** en `assets/capturas/` |
| precios y ofertas | **sí**, pasa por `preciosEn` y `ofertasEn` contra `catalogo.ts` |
| afirmaciones prohibidas | **sí**, pasa por `afirmacionesProhibidas` si el producto es PukaHealth |

Las dos últimas no son opcionales: una imagen es tan publicable como un caption,
y un precio falso impreso en un PNG es peor que en un texto, porque sobrevive a
la captura de pantalla.

⚠️ **Cuidado con el titular de ejemplo de esta spec**: «En un mes construimos la
vertical completa de hemodiálisis» tiene **exactamente 9 palabras**, que es el
tope. Una palabra más y CI se rompe. Los titulares de conclusión tienden a ser
largos, así que conviene comprobar si 9 palabras da para lo que hace falta, o si
la imagen de Facebook merece su propio tope. **Decisión: se mantiene el tope de 9
en la primera versión**, y si al escribir las siete piezas resulta asfixiante, se
sube con el dato delante en vez de por intuición.

### 5. `prohibidas.ts` — reescribir la regla de especialidades

Dos cosas, y ninguna es cosmética.

**a) El motivo actual es falso en sus dos mitades.** Dice «Solo hay una
especialidad implementada: podología. Las demás caen a un formulario genérico».
Verificado contra el código de `SistemaSalud` el 2026-09-09:

- Hay **dos** verticales clínicas: podología y **hemodiálisis**
  (`LedgerXpertz/hemodialisis/`, 260 commits entre el 8 de agosto y el 9 de
  septiembre, ~32.700 líneas, 50 migraciones en producción, y un cliente real
  —`dialife`— con 166 sesiones registradas). Hemodiálisis no está en el registry
  **a propósito**: necesita series temporales y consultas sobre columnas, y el
  JSONField del registry habría impedido las agregaciones. Hay un ADR del
  2026-08-08 que lo explica.
- «Caen a un formulario genérico» suena a que algo se rompe. La realidad: sin
  ficha propia el médico igual tiene historia clínica, nota SOAP, examen físico,
  diagnósticos CIE-10, receta, consentimiento, fotos, estudios en PDF y
  certificado de reposo. Lo único que falta es el bloque clínico de su rubro.

Redacción nueva:

> Hay dos verticales clínicas implementadas: **podología** y **hemodiálisis**.
> Las demás especialidades pueden usar el sistema —historia clínica, SOAP,
> CIE-10, recetas, certificados, estudios en PDF y facturación al SRI funcionan
> igual— pero sin un bloque clínico propio de su rubro. Añadir uno es desarrollo
> a medida, no configuración.

**b) El anclaje a palabras literales tiene fugas, y no solo en esta regla.**
Probadas las siete reglas contra sinónimos corrientes el 2026-09-09, ejecutando
`afirmacionesProhibidas`: **cuatro se esquivan**.

| Regla | Frase que NO atrapa |
|---|---|
| especialidades | «nos adaptamos a cualquier **rubro**» · «cualquier **sector**» |
| app nativa | «descarga nuestra **aplicación móvil**» |
| reservas del paciente | «tu paciente **pide su turno** sin llamarte» |
| recordatorios WhatsApp | «le llega un **mensaje automático** por WhatsApp» |

Las tres que aguantan: calendario, firma electrónica y el precio beta de $25.

🔑 **Esto no lo encontró el validador: lo encontró el usuario redactando.** La
frase que destapó el hueco —«nos adaptamos a cualquier rubro»— es exactamente
cómo se escribe de verdad, no un caso rebuscado.

Se amplían los patrones de las cuatro. **No se rediseña el mecanismo**: un
sistema de sinónimos genérico o un clasificador serían otra spec, y aquí la
prioridad es que las cuatro fugas conocidas queden tapadas con test que las
demuestre.

Lo que se prohíbe **sigue siendo lo mismo**, y conviene dejar escrito por qué:
«se adapta a cualquier especialidad» le suena al lector a **configuración** —me
registro, elijo mi especialidad, ya está—. Y no lo es: es desarrollo a medida,
por rápido que se haga. Un cliente que lea eso y descubra que su ficha requiere
semanas se sentirá engañado aunque las semanas sean pocas.

### 6. Lo que sí se puede decir, y es mejor material

De la verificación sale una afirmación más fuerte que la que se quería hacer:

> **«En un mes construimos la vertical completa de hemodiálisis, con la normativa
> del IESS incluida.»**

Es verificable —están los commits— y concreta, que es justo lo que la
investigación dice que funciona en salud: prueba por encima de promesa.

Tres cuidados, para que no se rompa ante el primer cliente que pregunte:

- **No se generaliza.** Ese mes incluyó sesiones semanales con una auditora
  clínica externa para validar normativa. Sin ese acompañamiento el plazo no se
  sostiene, así que «cualquier especialidad en un mes» no está respaldado.
- **Mostrar el caso, no prometer el plazo.** «Tu especialidad en un mes» es una
  promesa que un solo caso no respalda.
- **Decir «vertical» o «módulo», no «especialidad»** al hablar de hemodiálisis:
  en el código no es una especialidad del registry, y quien lo revise se
  confundirá.

Mencionar que el cliente validó semana a semana convierte la velocidad en método
en vez de en suerte, y fija la expectativa correcta.

---

### 7. La transición — las 7 piezas de septiembre ya existentes

⚠️ **Las siete piezas de `2026-09.ts` tienen bloque `facebook` con `caption` y
sin `imagen`.** La regla del punto 4 las invalidaría a todas a la vez, y
`npm run piezas -- --check` —que corre en CI— pasaría a fallar.

No es un detalle de implementación: es la mitad del trabajo. Escribir siete
titulares de conclusión es tarea editorial, no de código.

El orden que lo evita:

1. Añadir el campo y la plantilla, **sin** activar la validación estricta.
2. Escribir las siete `facebook.imagen`, y las capturas que hagan falta.
3. **Al final**, activar la regla que rechaza la pieza sin imagen.

Con ese orden, CI nunca queda en rojo y ninguna pieza sale con la imagen
equivocada por prisa.

🔴 **Son CUATRO las piezas pendientes, no tres.** Un borrador de esta spec listó
solo tres y se dejó fuera justamente la más inminente. Contadas contra
`content/piezas/2026-09.ts` el 2026-09-09:

| Pieza | Sale en Facebook | |
|---|---|---|
| `crm-no-chatbot` | **11/09 09:00** | 🔴 **en 2 días** |
| `enter-tumba-factura` | 15/09 18:00 | |
| `requisitos-facturar-sri` | 18/09 09:00 | |
| `receta-contenido-minimo` | 22/09 18:00 | |

`crm-no-chatbot` manda el calendario entero: si su imagen no está escrita y
generada para el **11/09 por la mañana**, saldrá con la slide 1 del carrusel y su
contador «01 / 05» — exactamente el defecto que esta spec existe para arreglar, y
el segundo post de la historia de la Página.

**Salida de emergencia si no llega a tiempo:** correr su `facebook.publicarEl` a
una fecha posterior. Es un cambio de una línea y evita publicar mal; no publicar
es reversible, publicar no.

---

## Capturas: lo que falta

`assets/capturas/` tiene hoy **un** archivo: `validar-receta.png`. Hacen falta,
como mínimo:

| Captura | Para hablar de |
|---|---|
| Agenda | agendamiento |
| Facturación | facturación al SRI |
| Consulta / historia clínica | la consulta |
| Hemodiálisis (sesiones o CARDEX) | la vertical construida en un mes |

⚠️ Al tomarlas, revisar **qué más entra en el encuadre**: en un video de este
proyecto se colaron el dock de macOS y una ruta con nombres de archivo reales.

---

## Verificación

Lo que hay que poder demostrar al terminar, no solo afirmar:

1. **La imagen de Facebook no lleva contador.** Renderizar una pieza de 5 slides
   y comprobar que su `-fb.png` no contiene «01» ni «05». Mutación: si se
   reintroduce el contador, el test cae.
2. **Sin `facebook.imagen`, `piezas --check` sale con código 1** y nombra la
   pieza y el campo. Es el camino real de CI, no solo el test unitario.
3. **El aviso de datos ficticios aparece en toda pieza con captura.** Sin
   excepción y sin bandera.
4. **La regla de especialidades atrapa las cuatro variantes**: «cualquier
   especialidad», «cualquier rubro», «cualquier sector», «cualquier área».
5. **El salto de línea del titular sale de verdad.** Renderizar un titular con
   `\n` y comprobar que ocupa dos líneas, no una. Es el fallo que el contraste
   destapó: sin `whiteSpace: 'pre-line'` el salto se traga en silencio y nadie lo
   ve hasta mirar el PNG.
6. **Las cuatro fugas de `prohibidas.ts` quedan tapadas**, cada una con su test:
   «cualquier rubro», «aplicación móvil», «pide su turno», «mensaje automático por
   WhatsApp». Y las tres que ya funcionaban siguen funcionando.
7. **Una pieza sin `facebook.imagen` no se programa para Facebook.**
   `fechaPublicacionFacebook` debe devolver `undefined`, para que no se intente
   publicar una imagen que no existe.
8. **Los 7 PNG nuevos están generados y commiteados** en `public/piezas/2026-09/`.
9. **Las tres suites**: `npm test`, `npx tsc --noEmit`, `npm run piezas --
   --check`. No son redundantes.

⚠️ **Ninguna de estas comprobaciones lleva un número de tests esperado.** Medir
con `npm test` antes de empezar y comparar contra lo medido: un total escrito en
un documento es una verificación falsa en cuanto el código se mueve debajo.

---

## Alcance: qué va en este trabajo y qué no

La reescritura de la regla de especialidades toca **doctrina de producto**, no el
generador de imágenes. Va en **commit aparte**, antes del resto, por dos motivos:
se puede revisar por sí sola —es una afirmación sobre lo que el producto hace— y
si hay que discutirla no bloquea el trabajo de la imagen.

Lo mismo para `docs/PUKAHEALTH_LIMITES.md`.

---

## Lo que este diseño NO hace

- **No separa la fábrica.** Se descartó con dato: el tamaño de Facebook y el de
  Instagram coinciden, así que separar renderizadores solo duplicaría el
  mantenimiento.
- **No genera el titular de Facebook automáticamente.** Se escribe a mano, como
  el caption. Una máquina uniendo frases escritas para otro contexto suena rara,
  y la voz es lo que distingue estas piezas.
- **No toca el carrusel de Instagram.** La plantilla de carrusel, sus slides y su
  contador se quedan como están.

---

## Cómo se contrastó esta spec

Contraste independiente el 2026-09-09: Claude Code por su cuenta, y `agy` con
**dos modelos en paralelo y el mismo prompt**, para medir cuál rinde más en esta
tarea.

| | tiempo | hallazgos |
|---|---|---|
| `gemini-3.7-flash-high` | 142 s | 7 |
| `gemini-3.8-flash-high` | 242 s | 12 |

🔑 **Esto contradice lo que `docs/METODO_AGENTES_PARALELOS.md` tenía medido**, que
era que 3.8 hacía timeout 2 de 2 veces en análisis largo. Hoy terminó, tardó un
70% más y encontró un 70% más. Los dos hallazgos que solo vio 3.8 —el `\n` que no
funciona y la aritmética falsa del 20%— eran de los importantes.

Vale la pena actualizar esa tabla del método con esta medición, y de paso su
lección: **medir contra la tarea propia**, porque el resultado de hace dos días no
se sostuvo.

Convergieron los tres revisores en: el acoplamiento a `-1-4x5.png`, el riesgo de
desbordamiento, la validación sin especificar y el anclaje por palabras de
`prohibidas.ts`.

---

## Fuentes

- [Facebook Post Size 2026 (Feed Image & Video)](https://socialsizes.io/facebook-post-size/)
- [Social media image sizes for all networks — Hootsuite](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- [Facebook Text Overlay Guide: Ads, Posts & Covers (2026)](https://overlaytext.com/blog/text-overlay-for-facebook-ads-increase-ctr)
- [The Anatomy of a Single Image Ad — AdvertiseMint](https://www.advertisemint.com/the-anatomy-of-a-single-image-ad/)
- [Bold Typography Trend 2026 — Dot2shape](https://dot2shape.com/blog/bold-typography-trend-2026/)
- [The Ultimate Guide to B2B Graphic Design Strategies — Visual Soldiers](https://visualsoldiers.com/b2b-graphic-design/)
- [A Comprehensive Guide to Healthcare Social Media Marketing — Officite](https://www.officite.com/a-comprehensive-guide-to-healthcare-social-media-marketing/)
