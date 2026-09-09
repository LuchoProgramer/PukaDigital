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

**Regla del 20% de texto.** Meta reduce el alcance si el texto cubre más de ~20%
de la imagen — rejilla de 5×5, más de 5 celdas con texto. Las slides actuales
llevan badge + titular + bajada, que para una imagen suelta es demasiado.

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
de ellos es una franja de texto más, y la regla del 20% es un presupuesto que se
gasta rápido. Lo que no cabe en el titular va al caption, que es donde la
industria dice que debe ir.

El titular admite `\n` para controlar el corte de línea a mano. Es deliberado:
un titular que rompe donde no debe se lee peor que uno más corto.

### 2. Plantilla propia, mismo renderizador

Una variante de `Plantilla` para Facebook. Tres diferencias con la de carrusel:

| | Carrusel (Instagram) | Suelta (Facebook) |
|---|---|---|
| Contador `01 / 05` | sí | **nunca** |
| Elementos de texto | badge, titular, bajada, dato, cta | **titular + dato** |
| Papel de la captura | ilustra una de cinco | **prueba, debajo del titular** |

Composición: **titular en el tercio superior, captura debajo.** Cumple el 20%,
respeta la zona segura —lo importante hacia el centro vertical—, y deja la
captura como evidencia y no como decoración.

Se descartó la captura a sangre con el titular superpuesto: en 4:5 una captura de
escritorio obliga a recortar tanto que no se entiende qué se está viendo, y el
aviso de datos ficticios competiría con el titular.

El nombre del archivo lo distingue del resto: `<id>-fb.png`. No `-1-4x5`, que es
la nomenclatura de slides del carrusel.

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

**b) El patrón deja pasar la misma afirmación con otra palabra.** Hoy es
`/(cualquier|toda|todas las|cada)\s+especialidad/`: exige la palabra
«especialidad», así que «cualquier **rubro**», «**sector**», «**área**» o
«**profesión**» pasan limpios. Se amplía a esas variantes.

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

⚠️ Las tres piezas que aún no han salido en Facebook —`enter-tumba-factura`
(15/09), `requisitos-facturar-sri` (18/09) y `receta-contenido-minimo` (22/09)—
son las urgentes: si el paso 2 no está hecho para esas fechas, saldrán con la
slide 1 del carrusel y el contador «01 / 05», que es justo lo que este diseño
existe para evitar.

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
5. **Las tres suites**: `npm test`, `npx tsc --noEmit`, `npm run piezas --
   --check`. No son redundantes.

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

## Fuentes

- [Facebook Post Size 2026 (Feed Image & Video)](https://socialsizes.io/facebook-post-size/)
- [Social media image sizes for all networks — Hootsuite](https://blog.hootsuite.com/social-media-image-sizes-guide/)
- [Facebook Text Overlay Guide: Ads, Posts & Covers (2026)](https://overlaytext.com/blog/text-overlay-for-facebook-ads-increase-ctr)
- [The Anatomy of a Single Image Ad — AdvertiseMint](https://www.advertisemint.com/the-anatomy-of-a-single-image-ad/)
- [Bold Typography Trend 2026 — Dot2shape](https://dot2shape.com/blog/bold-typography-trend-2026/)
- [The Ultimate Guide to B2B Graphic Design Strategies — Visual Soldiers](https://visualsoldiers.com/b2b-graphic-design/)
- [A Comprehensive Guide to Healthcare Social Media Marketing — Officite](https://www.officite.com/a-comprehensive-guide-to-healthcare-social-media-marketing/)
