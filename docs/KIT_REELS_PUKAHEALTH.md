# Kit y Sistema de Producción de Reels PukaHealth (IA & CapCut)

Este documento contiene la biblioteca oficial de recursos, personajes, reglas de subtitulado milimétrico y el overlay Safe Zone para crear videos verticales de alto impacto (Reels, TikTok, Shorts) para PukaHealth.

---

## 1. Estructura de Archivos del Kit

Todos los recursos se encuentran organizados dentro del proyecto en:
📂 `file:///Users/luisviteri/Proyectos/PukaDigital/assets/reels-kit/`

```text
assets/reels-kit/
├── personajes/
│   ├── doctor_masculino_principal.jpeg    # Doctor sénior, estetoscopio, consultorio premium
│   ├── recepcionista_escritorio.jpeg       # Recepcionista profesional, clínica moderna
│   ├── recepcionista_archivadores_estres.jpeg # Recepcionista buscando carpetas con estrés
│   └── doctora_solucion_clinica.jpeg       # Doctora joven con tablet / solución PukaHealth
├── plantillas/
│   ├── Safe_Zone_Reels_TikTok_1080x1920.png # Guía visual PNG transparente para CapCut
│   ├── PukaHealth_1_subtitulos.srt         # Subtítulos medidos Video 1
│   └── PukaHealth_2_subtitulos.srt         # Subtítulos medidos Video 2
└── audio-sfx/
    ├── whoosh_cinematico.wav               # Transición rápida / giro de cámara
    └── chime_solucion.wav                  # Notificación moderna / solución tecnológica
```

---

## 2. Los Personajes y Storyboard Keyframing

Para mantener consistencia visual en Google Flow / Veo 3 sin deformaciones:
- Se usa siempre una imagen fija de referencia (*Keyframe*) creada en Gemini/Imagen 3.
- En Google Veo / Flow se sube el keyframe como imagen base y se describe la acción manteniendo la vestimenta e iluminación.

### Prompts de referencia usados:
- **Doctor Sénior**:
  > *Cinematic vertical 9:16 portrait of an Ecuadorian male doctor in his late 30s wearing a crisp white lab coat and stethoscope, sitting in a warm modern medical office. Photorealistic, soft cinematic lighting, 8k.*
- **Recepcionista (Estrés vs Solución)**:
  > *Cinematic vertical 9:16 portrait of a Latina clinic receptionist in her late 20s, medical uniform/scrubs, overwhelmed in a file archive room surrounded by overflowing physical medical paper folders, hand on forehead.*
- **Doctora (Solución Digital)**:
  > *Cinematic vertical 9:16 portrait of a confident Latina doctor holding an iPad showing medical charts, warm clinic backdrop, bright professional atmosphere.*

---

## 3. El Método Secreto del Subtitulado (La Fórmula del Salto de Línea Perfecto)

### ¿Cómo logramos que el salto de línea salga directo en CapCut sin tener que editar nada?
Cuando CapCut o cualquier editor importa un `.srt`, aplica el diseño y tamaño de fuente sobre la caja de texto. Si el texto viene como un párrafo largo de Whisper o transcripción normal, desborda y se parte feo.

Para que **CapCut arme automáticamente esa estructura de 2 líneas perfectas, equilibradas y legibles**, se usó esta **fórmula matemática**:

1. **La Regla de los 20 a 26 Caracteres por Entrada SRT:**
   - Si una línea en el archivo `.srt` tiene entre **20 y 26 caracteres** (incluyendo espacios), al ponerle en CapCut un tamaño de fuente de 11 a 14 puntos (la que se usa en Reels con fuente gruesa), **la caja por defecto de CapCut hace un "Soft Break" armónico**: exactamente 3 palabras en la primera línea y la palabra de impacto en la segunda.
   - Ejemplo exacto en el SRT:
     `¿Sabías que un consultorio` (26 caracteres)
     En CapCut cae automático como:
     ```text
     ¿SABÍAS QUE UN
     CONSULTORIO
     ```
   - No tuvimos que forzar un `\n` manual en CapCut; la longitud calibrada en el SRT hace que el motor tipográfico de CapCut balancee las palabras por simetría geométrica.

2. **Corte Sintáctico (Donde Respira la Voz):**
   - Nunca cortar una palabra de su preposición o artículo (ej. nunca dejar un `"un"` suelto al final).
   - Siempre agrupar: **[Conjunción/Pregunta + Sujeto]** y dejar el **[Núcleo del sujeto/verbo]** abajo.
   - La entrada 1 dice: `¿Sabías que un consultorio` (1.7 segundos).
   - La entrada 2 dice: `pierde en promedio 7 minutos` (1.6 segundos).

3. **La Ventana de Tiempo (1.4s a 1.8s):**
   - Si el bloque dura más de 2 segundos, la gente se aburre y desliza el Reel.
   - Si dura menos de 1 segundo, no alcanza a leer las 2 líneas.
   - 1.4s a 1.8s es el ritmo cerebral perfecto para leer 4 palabras en 2 alturas.

4. **El Prompt / Instrucción de Transcripción para la IA:**
   Cuando le pasas el audio a la IA (Gemini / Whisper), la instrucción exacta es:
   > *"Segmenta la transcripción en bloques SRT de máximo 4 a 5 palabras (entre 20 y 25 caracteres por bloque), cortando estrictamente en pausas sintácticas naturales para que el editor de video lo balancee en dos alturas equilibradas."*
   - Fuente gruesa sin serifas: *Montserrat Black*, *The Bold Font* o *Impact*.
   - Relleno Blanco `#FFFFFF`, Trazo Negro `#000000` (15-20%).
   - Animación: **Rebote (Bounce)** o **Palabra por palabra**.

---

## 4. Cómo usar la Plantilla Safe Zone en CapCut

El overlay [`Safe_Zone_Reels_TikTok_1080x1920.png`](file:///Users/luisviteri/Proyectos/PukaDigital/assets/reels-kit/plantillas/Safe_Zone_Reels_TikTok_1080x1920.png) tiene las coordenadas milimétricas de la interfaz móvil de Instagram y TikTok:

1. **Importar a CapCut**: Arrastra el PNG a una pista superior (encima del video).
2. **Zona Roja Superior (Top 220px)**: Tapado por la barra de estado del iPhone/Android, pestaña "Para ti" y la lupa. *No poner texto aquí.*
3. **Zona Roja Inferior (Bottom 420px)**: Tapado por tu nombre `@pukadigital`, el botón *Seguir*, las 3 líneas de descripción y el disco de música girando. *Ningún subtítulo debe bajar de esta línea.*
4. **Zona Roja Derecha (Right 140px)**: Tapado por los botones flotantes de Like, Comentarios, Compartir y Guardar.
5. **Caja Amarilla (Sweet Spot: Y=1180px a 1470px)**: Es el tercio inferior seguro. Ahí es donde debes colocar y centrar los subtítulos. Se leen con la vista natural hacia abajo sin interferir con la cara del personaje ni ser tapados por la interfaz de la red social.
6. **Al terminar:** Oculta el ojo de la capa de la plantilla antes de exportar.
