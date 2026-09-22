# Método de Producción de Video Reels con IA (Google Flow + Veo 3 + CapCut)

Este documento compila el **método de producción audiovisual con Inteligencia Artificial** desarrollado y probado en PukaDigital para crear Reels cinemáticos de alta retención para **PukaHealth**.

Cubre desde la consistencia de personajes (Storyboard Keyframing), la generación de video y voz nativa con Google Veo 3 / Flow, evasión de falsos positivos en filtros de seguridad, hasta el diseño sonoro (SFX), la fórmula matemática de subtitulado y el ensamblaje en CapCut.

---

## 1. Filosofía y Arquitectura del Método

Los videos generados por IA suelen verse artificiales o deformes si se intenta crear todo desde cero en un solo prompt de texto. Nuestro método se basa en **4 pilares**:

```text
[ 1. Keyframe Inicial ] ──> [ 2. Animación & Voz ] ──> [ 3. Edición & SFX ] ──> [ 4. Subtitulado ]
  Imagen fija consistente      Google Flow / Veo 3          CapCut Desktop          Fórmula 20-25 chars
  (Gemini / Imagen 3)          Español neutro sin cortes    Swooshes + Chimes       Salto de línea auto
```

---

## 2. Storyboard Keyframing: Consistencia Absoluta de Personajes

El mayor problema de la IA es que en cada generación cambia el rostro del actor. Para resolver esto:

### A. Creación del "Actor Base" (Keyframe Maestro)
1. Se genera una imagen fotográfica vertical (9:16) con **Gemini / Imagen 3** definiendo rasgos, vestimenta y atmósfera.
2. Esta imagen se almacena en el repositorio local como activo reutilizable:
   `file:///Users/luisviteri/Proyectos/PukaDigital/assets/reels-kit/personajes/`
   - `doctor_masculino_principal.jpeg`: Doctor sénior, bata blanca, estetoscopio, consultorio cálido.
   - `recepcionista_escritorio.jpeg`: Recepcionista joven, uniforme celeste, clínica moderna.
   - `recepcionista_archivadores_estres.jpeg`: Misma recepcionista, agobiada entre archivadores de papel.
   - `doctora_solucion_clinica.jpeg`: Doctora sosteniendo tablet/software.

### B. Técnica de "Prop Acting" (Actuación con Utilería)
Los personajes de IA se ven falsos si están con las manos vacías flotando. Para dotar de realismo a la escena:
- El doctor debe sostener un **esfero y un recetario físico** en su escritorio.
- La recepcionista debe sostener una **carpeta de papel abierta o un documento**.
- La doctora de la solución debe **sostener una tablet con ambas manos**, mostrando la interfaz médica en pantalla con un check verde o código QR.

### C. Modificación de Pose manteniendo el Rostro (Image-to-Image)
Para crear una nueva escena sin perder la cara del actor:
1. Se sube la foto del actor base a Gemini.
2. Se utiliza el prompt de anclaje:
   > *"Keep the exact same face, hair, and appearance of this person from the reference image. Adjust the pose: [describir nueva acción y utilería]. Cinematic vertical 9:16, photorealistic, 8k."*

---

## 3. Animación y Voz Nativa con Google Flow / Veo 3

Google Veo 3 dentro de Google Flow permite animación fotorrealista sincronizada con labios y voz nativa en español latinoamericano sin necesidad de herramientas externas de lip-sync (como Hedra o SadTalker).

### A. Estructura del Prompt de Generación de Clip
El prompt debe combinar la descripción cinemática con el diálogo textual entre comillas:

```text
The doctor looks up from his paper document pad and speaks directly to camera with professional concern in Latin American Spanish: "Son las siete de la tarde y tus recetas en papel podrían reprobar una auditoría médica."
```

### B. Evasión de Falsos Positivos (Filtros de Seguridad de Google)
Los filtros de Google Flow bloquean peticiones si detectan términos médicos, regulatorios o punitivos que confunden con deepfakes o contenido legal conflictivo.

| Término Bloqueado por la IA | Sustituto Seguro (Pasa el Filtro) |
|---|---|
| `sanción del ACESS` | `reprobar una auditoría médica` / `observación legal` |
| `ACESS` / `Ministerio` | `entidades de control` / `auditoría de salud` |
| `receta médica` *(en ciertos contextos de queja)* | `recetas en papel` / `documento de prescripción` |
| `multa grave` | `serias observaciones de control` |

---

## 4. Guion y Estructura Dramática (20 a 25 Segundos)

Para lograr máxima retención y evitar el "scroll" en redes, el Reel se divide en 3 tomas de ritmo ágil:

1. **Toma 1: El Gancho / Dolor (0 a 6 segundos)**
   - *Personaje:* Doctor principal o recepcionista.
   - *Conflicto:* La hora tardía (7:00 PM), el desorden del papel, el riesgo de auditoría.
2. **Toma 2: La Consecuencia Operativa (6 a 14 segundos)**
   - *Personaje:* Recepcionista buscando carpetas o farmacéutico revisando recetas.
   - *Datos concretos:* "7 minutos por paciente", "falta el CIE-10", "vigencia de 3 días".
3. **Toma 3: La Solución Tecnológica & CTA (14 a 23 segundos)**
   - *Personaje:* Doctora con tablet o interfaz digital.
   - *Resolución:* Búsqueda en 1 segundo, recetas con QR, facturación SRI en 1 clic.
   - *Llamado a la acción:* "Prueba 30 días gratis en pukadigital.com".

---

## 5. Diseño Sonoro y SFX (Sound Foley Layer)

El audio nativo generado por Veo contiene la voz y un murmullo ambiental. Para darle pegada comercial y dinamismo:
1. **Swoosh / Whoosh Cinemático:**
   - Se coloca un efecto rápido de viento o barrido justo en el corte entre la Toma 1 ➔ Toma 2 y Toma 2 ➔ Toma 3.
   - Da sensación de ritmo y transición ágil.
   - Archivo: `assets/reels-kit/audio-sfx/whoosh_cinematico.wav`.
2. **Chime / Éxito Tecnológico:**
   - Se reproduce un sonido brillante de notificación o campana digital en el segundo exacto donde aparece la tablet o la solución PukaHealth.
   - Refuerza visual y auditivamente que el problema quedó resuelto.
   - Archivo: `assets/reels-kit/audio-sfx/chime_solucion.wav`.

---

## 6. La Fórmula Matemática del Subtitulado Perfecto (SRI)

El error más común es importar transcripciones largas que generan párrafos pesados y desbalanceados en CapCut. Para que los subtítulos se armen **en 2 líneas automáticas, simétricas y legibles sin intervención manual**:

### Regla 1: Bloques de 20 a 26 Caracteres
Cada entrada del archivo `.srt` debe contener estrictamente entre 20 y 26 caracteres (incluyendo espacios).
- Con el ancho de caja predeterminado de CapCut en 9:16 y un tamaño de letra adecuado (11-14 pt), **CapCut produce un salto de línea natural ("Soft Break")** dejando 3 palabras arriba y la palabra de remate abajo.

```text
¿SABÍAS QUE UN     <-- Línea 1 (15 caracteres)
CONSULTORIO        <-- Línea 2 (11 caracteres)
```

### Regla 2: Respeto al Corte Sintáctico
Nunca separar un artículo de su sustantivo ni cortar palabras a destiempo. El corte se hace donde la voz toma aire:
- `¿Sabías que un consultorio` (26 caracteres) ➔ Entrada 1.
- `pierde en promedio 7 minutos` (29 caracteres) ➔ Entrada 2.

### Regla 3: Ventana Temporal de 1.4s a 1.8s
- Menos de 1 segundo: no da tiempo de leer dos alturas.
- Más de 2 segundos: aburre y se siente lento.
- 1.5s promedio: ritmo de lectura dinámico.

---

## 7. El Overlay Safe Zone (Zona Segura para Redes)

Para garantizar que ningún botón de la red social tape los subtítulos ni las caras:

- **Archivo base:** `assets/reels-kit/plantillas/Safe_Zone_Reels_TikTok_1080x1920.png` (PNG transparente).
- **Márgenes prohibidos:**
  - **Superior (0 a 220 px):** Oculto por la barra de estado del teléfono, pestañas y buscador.
  - **Inferior (1500 a 1920 px - 420 px de altura):** Oculto por el nombre de cuenta `@pukadigital`, el botón *Seguir*, las 3 líneas de descripción y el disco de música girando.
  - **Lateral Derecho (140 px de margen):** Oculto por los botones flotantes de Like, Comentarios, Compartir y Guardar.
- **Punto Dulce (Sweet Spot - Caja Amarilla):**
  - Ubicado verticalmente entre **`Y = 1180 px` y `Y = 1470 px`**.
  - Centrado horizontalmente.
  - Es el tercio inferior seguro: la mirada reposa naturalmente allí, no tapa la cara del actor y queda completamente visible tanto en Instagram Reels como en TikTok y YouTube Shorts.

---

## 8. Checklist de Publicación y Programación en Meta Business Suite

1. **Montaje en CapCut:**
   - Cargar clips ➔ Ajustar cortes a 20-25s.
   - Importar `.srt` calibrado a *Subtítulos Locales*.
   - Activar plantilla Safe Zone como capa superior para verificar posición.
   - Estilo: Mayúsculas (`TT`), fuente sin serifas gruesa, trazo negro 20%, animación *Rebote (Bounce)* o *Palabra por palabra*.
   - Ocultar capa de Safe Zone y exportar en 1080x1920 MP4.
2. **Programación en Meta:**
   - Subir a Meta Business Suite Reels Composer.
   - **Copys diferenciados:**
     - Facebook: Párrafo largo editorial con enlace cliqueable.
     - Instagram: Párrafo espaciado con bullets, llamada al enlace en bio y hashtags médicos nicho.
   - **Horario estricto:** 19:00 hora de Ecuador (lunes o días que no choquen con los carruseles de las 09:00 y 18:00).
