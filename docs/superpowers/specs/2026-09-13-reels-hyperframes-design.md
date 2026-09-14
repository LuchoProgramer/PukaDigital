# Reels con HyperFrames — diseño

Fecha: **2026-09-13**. Estado: **implementada** el mismo día —plan 1 en el PR
#29, plan 2 en el PR #32—. Producción no publica Reels hasta el próximo
despliegue: ver `docs/ESTADO_2026-09-13.md`.

Los Reels de la fábrica: un video vertical por pieza, narrado con voz local, que
se publica solo en Instagram y en Facebook.

Investigación previa, con las fuentes y lo que se midió: `docs/VIDEO_CON_HYPERFRAMES.md`.
Cadencia acordada: spec del 2026-09-07, líneas 25-35.
Lo que PukaHealth no hace: `docs/PUKAHEALTH_LIMITES.md`.

---

## Por qué

La fábrica publica dos carruseles por semana, y cada tema rinde ya en dos
canales. Lo que falta es el formato que Instagram premia y que hoy no
producimos. La cadencia acordada añade **dos Reels por semana**, sacados de
carruseles ya escritos y revisados: el mismo tema, contado en 25 segundos.

No es más volumen por red. Es la misma pieza rindiendo en más formatos, que es
lo que la spec de la fábrica dejó escrito que sí funciona.

---

## Alcance

**Dentro:**

- Un bloque `reel` en las piezas que lo declaren.
- Guion escrito por Gemini en el momento del PR.
- Voz local con Kokoro `ef_dora`.
- Render a MP4 1080×1920 con HyperFrames, con plantilla de video propia.
- Alojamiento en R2 y publicación automática en Instagram y Facebook.
- Envío del MP4 a Telegram al terminar el render, para revisarlo en el teléfono.

**Fuera:**

- Imágenes y video generados por modelos.
- El video con la cara de Luis: lo graba él, no lo hace esto.
- La etiqueta de «Hecho con IA»: no hay parámetro en la API y se resuelve aparte.
- Métricas por pieza y decisiones de pauta.
- Aprobar o rechazar desde Telegram, y conversar con un agente: subsistemas
  propios, con su propia spec.

---

## Decisiones y su porqué

| Decisión | Por qué |
|---|---|
| Voz `ef_dora` de Kokoro | Elegida escuchando cuatro candidatas. Además es la más ligera (27 MB), la más rápida (~3x el tiempo real) y **la única sin marca de agua** |
| Guion escrito por Gemini | Un texto pensado para leerse suena seco dicho en voz alta. Y el camino ya existe: `npm run captions` hace lo mismo con Facebook |
| Plantilla de video propia en HTML | Se eligió sobre animar los PNG existentes: un Reel retiene por el movimiento del texto. **El costo aceptado es la duplicación**, y por eso hay una defensa explícita (ver abajo) |
| MP4 en R2, no en el repositorio | Medio giga al año que git no suelta nunca. Y rompe el acoplamiento actual: hoy, sin desplegar, el CDN no tiene el archivo |
| Bloque `reel` dentro de la pieza | Hereda producto, precios y validación del carrusel, y deja ver los canales de un tema de un vistazo |
| Franja siguiente encadenada | La regla ya existe y está probada: cuatro franjas seguidas por tema |

---

## Arquitectura

Dos tuberías, como ya hace la fábrica.

**Producción — en la máquina, al preparar el mes.** HyperFrames necesita Chrome
y ffmpeg, que no existen en un Worker.

```
npm run reels -- --mes 2026-10 --id <pieza>
  └─ Gemini escribe el guion desde las slides ya revisadas: un párrafo por slide
     └─ Kokoro (ef_dora) convierte cada párrafo en voz, por separado
        └─ ffprobe mide cada voz: ahí empieza la escena siguiente
           └─ se genera la composición HTML desde los tokens del sistema
              └─ HyperFrames renderiza el MP4 en 1080×1920
                 └─ ffprobe verifica que cumple lo que Meta exige
                    └─ sube a R2 y escribe la URL en la pieza
                       └─ manda el MP4 por Telegram
                          └─ PR ← la revisión humana. La puerta de calidad
```

**Publicación — en el cron de Cloudflare.** Sin IA, sin claves de modelos y sin
tocar los bytes del video: solo pasa URLs a Meta.

### La defensa contra la duplicación

Se aceptó mantener dos motores de dibujo —Satori para las imágenes, HTML para el
video—, así que el riesgo es que se desincronicen sin avisar. Es el mismo
problema que el logo copiado entre repositorios.

**La composición HTML se genera, nunca se escribe a mano.** Sus valores salen
de:

| Qué | De dónde |
|---|---|
| Colores del sistema | `lib/piezas/sistemas.ts` |
| Tipografías | `assets/fonts/` |
| Texto del aviso de datos ficticios | `AVISO` en `lib/piezas/capturas.ts` |
| **Color de la barra del aviso** | `FONDO_AVISO` en `lib/piezas/capturas.ts`, **no** en `sistemas.ts` |
| Zona segura de 9:16 | `FORMATOS['9x16']` en `lib/piezas/formatos.ts` |
| Margen | `MARGEN` en `lib/piezas/formatos.ts` |

Un color escrito a mano en el HTML hace fallar un test. Y el test tiene que
conocer las dos fuentes: buscar solo en `sistemas.ts` daría por bueno un
`#0D1717` escrito a mano.

### ⚠️ El vidrio no sobrevive al video

**Los colores y las fuentes se copian estrictos; el vidrio no.** HyperFrames lo
advierte en su guía de sistemas de diseño: un borde de 1 px o una sombra de 0,06
de opacidad **desaparecen tras la compresión H.264**. Dark Glass Rojo usa vidrio
a `0.04` y bordes a `0.08`: copiados tal cual dan tarjetas invisibles.

| Qué | En video |
|---|---|
| Fondo, tinta, acento y tipografías | idénticos a `sistemas.ts` y `assets/fonts/` |
| Opacidad del vidrio, grosor de borde, tamaños de texto | **escalados** para el medio, en constantes propias de `composicion.ts` y con su porqué |

Así el test de colores sigue teniendo sentido: vigila la identidad de marca, no
un valor de web que el códec se come.

### 🔴 La frontera: `lib/reels/` no entra al Worker

`worker.ts` y la ruta del cron importan `lib/publicar/tanda.ts`. Todo lo que ese
archivo alcance acaba en el bundle del Worker, igual que pasó con Satori en la
spec de la migración a Cloudflare.

**Regla: `lib/publicar/` y `lib/piezas/` no importan nada de `lib/reels/`.** Los
canales de Reel solo leen `reel.video` como texto y hablan HTTP con Meta. Un test
de fronteras lo vigila: recorre los imports de `lib/publicar/` y falla si alguno
alcanza `lib/reels/`.

Y a la inversa, `lib/reels/` **sí** puede importar de `lib/piezas/` —tokens,
`AVISO`, `validar`—: es exactamente lo que evita la duplicación.

---

## Modelo de datos

```typescript
reel?: {
  /** El guion hablado. Lo escribe Gemini, lo revisa una persona en el PR. */
  guion: string;
  /** El texto del post. Obligatorio y distinto del caption del carrusel. */
  caption: string;
  /**
   * Hora de Ecuador, y es la franja del Reel **de Instagram**. El de Facebook
   * cae siempre en la franja siguiente a esa. Sin el campo, ver la tabla.
   */
  publicarEl?: string;
  /** URL pública en R2. La escribe el render; a mano no se toca. */
  video?: string;
  /** Segundos del MP4 renderizado. Entre 3 y 90: es el techo de Facebook. */
  duracion?: number;
};
```

### Las cuatro franjas, sin ambigüedad

Un tema ocupa cuatro franjas consecutivas, y cada una se calcula de la anterior
con `franjaSiguiente()`:

| Franja | Qué sale | De dónde sale la fecha |
|---|---|---|
| 1 | Carrusel en Instagram | `pieza.publicarEl` |
| 2 | Imagen en Facebook | `facebook.publicarEl`, o `franjaSiguiente(1)` |
| 3 | Reel en Instagram | `reel.publicarEl`, o `franjaSiguiente(2)` |
| 4 | Reel en Facebook | siempre `franjaSiguiente(3)` |

⚠️ **Si la pieza no tiene bloque de Facebook, la franja 2 no existe** —hoy
`fechaPublicacionFacebook()` devuelve `undefined` sin `facebook.imagen`— y el
Reel de Instagram encadena entonces desde `pieza.publicarEl`. Sin esta regla, una
pieza sin imagen de Facebook dejaría al Reel sin fecha y no se publicaría nunca,
en silencio.

⚠️ **El bloque `reel` no tiene nada que ver con `pieza.formatos`.** Añadir
`'9x16'` a ese array no produce un Reel: produce un PNG vertical que nadie usa, y
**deja de generar el `4x5` que el carrusel necesita**, rompiendo Instagram.

⚠️ **Por qué el caption del Reel debe ser distinto.** La defensa contra publicar
dos veces compara el texto contra las publicaciones recientes. Con el mismo
caption que su carrusel, el sistema creería que el Reel ya salió y no lo
publicaría nunca. Es exactamente el fallo que dejó sin publicar a
`crm-no-chatbot` el 2026-09-11, y aquí se cierra por diseño.

**Sin bloque `reel` no hay Reel.** Ningún degradado silencioso, igual que en
Facebook.

---

## La tubería, paso a paso

**1. El guion.** Gemini Flash 3.x lee las slides, `catalogo.ts` y
`prohibidas.ts`, y escribe un texto hablado de 20 a 30 segundos —60 a 90
palabras a la velocidad de Dora—. La rúbrica exige que los primeros 3 segundos
planteen el problema: ahí se decide la retención.

**El modelo:** `gemini-3.8-flash`, el mismo que usa hoy `lib/captions/gemini.ts:14`,
sobreescribible con la variable `MODELO_REEL`. La regla de usar el Flash 3.x más
reciente ya está escrita en la spec del 2026-09-07.

🔴 **Si la pieza ya tiene `reel.guion`, no se vuelve a llamar a Gemini.** El guion
se revisa y se retoca a mano en el PR; re-renderizar para corregir una pausa no
puede borrar esa edición. Rehacerlo desde cero pide una bandera explícita,
`--regenerar-guion`.

🔴 **Y no hay respaldo si Gemini falla.** `captions` cae a un compositor que pega
las slides (`lib/captions/cli.ts:38-48`); para un guion hablado eso es peor que
no tener Reel, porque un texto telegráfico leído en voz alta suena a robot. Sin
`API_KEY` o con Gemini caído, el comando **falla para esa pieza con un mensaje
claro** y sigue con las demás.

**2. La voz.** `hyperframes tts --voice ef_dora`, local y sin cuentas, a 24 kHz.
Determinista: mismo texto, mismo audio. Requiere `espeak-ng` en el sistema y un
Python con `kokoro-onnx` y `soundfile`, señalado con `HYPERFRAMES_PYTHON`. Y
además `ESPEAK_DATA_PATH` y `PHONEMIZER_ESPEAK_LIBRARY` apuntando al `espeak-ng`
de Homebrew: Kokoro trae una copia propia cuya ruta de datos aquí no existe.
Medido al renderizar el primer Reel.

**3. Los tiempos, sin transcribir.** Decidido el 2026-09-13, al escribir el plan
2: en esta máquina no hay ninguna herramienta de transcripción, y
`hyperframes transcribe` compila whisper.cpp la primera vez y baja un modelo
multilingüe de cientos de MB. En su lugar:

- **El guion lleva un párrafo por slide**, y el validador lo exige.
- **Cada párrafo se sintetiza por separado**, y `ffprobe` mide cuánto dura: esa
  duración es el corte de escena. La imagen cambia cuando la voz cambia de idea,
  no cada N segundos.
- **Los subtítulos van en grupos de hasta 4 palabras**, cortando también donde
  termina una frase (`.`, `?`, `!`) **y nunca en una coma**: en una enumeración
  eso dejaba palabras sueltas, y el render del paso 0 mostró un subtítulo que
  decía «reportes.» y nada más. Una cola de una sola palabra vuelve a su grupo.
  Dentro del párrafo, cada palabra recibe tiempo según su largo. El desfase de
  una palabra suelta es de décimas y en grupos no se nota.

Si al ver los primeros Reels los subtítulos se notan desfasados, whisper entra en
un plan aparte sin rehacer nada: solo cambia de dónde salen los tiempos.

**4. La composición.** Una escena por slide. Subtítulos dentro de la zona segura
y aviso de datos ficticios en toda escena que muestre pantalla.

El HTML generado cumple el contrato de HyperFrames, verificado contra su
documentación y contra su propio test vertical
(`packages/producer/tests/portrait-edge-bleed`):

- **El tamaño va en la raíz**: `data-width="1080" data-height="1920"` y
  `data-duration`, y el mismo tamaño en el CSS de `html` y `body`. Sin eso
  renderiza en su defecto, 1920×1080.
- **Las fuentes van embebidas** en el `index.html`, con `@font-face` en base64,
  `format("truetype")` y **`font-display: block`**. Salen de `cargarFuentes()`, las
  mismas que usan las imágenes. Sin `block`, Chrome captura los primeros fotogramas antes de que la
  fuente cargue y el texto sale invisible o cambia de tipografía a mitad.
- **El audio es un `<audio>`** con `data-start` y el archivo relativo. HyperFrames
  controla la reproducción: nada de `play()` ni `currentTime`.
- **Las animaciones se registran síncronas** en `window.__timelines`. Nada de
  `async`, `fetch` ni `Math.random()` al construirlas: rompe el determinismo.
- **GSAP va en local, como archivo al lado del HTML**, leído de `node_modules`
  (`gsap` 3.14.2, la versión de la documentación de HyperFrames, como dependencia
  de desarrollo), no cargado de un CDN. Su test vertical lo toma de jsdelivr, y un
  render que depende de la red no es reproducible.
  ⚠️ **Y no en línea.** El lint de `render --strict` analiza los `<script>`
  inline, lee el `Math.random()` y el `Date.now()` de GSAP como código nuestro y
  aborta. Corregido tras el render del paso 0: va como `gsap.min.js`. La captura
  sí va embebida, con `cargarCaptura()`: la composición es **un HTML y
  `gsap.min.js`**, más un audio por escena.
- **Una pista por escena** (`data-track-index`). Con todas en la 0, HyperFrames
  avisa `timeline_track_too_dense`.

⚠️ `data-resolution="portrait"` **no existe**: lo propuso un revisor y no aparece
en ninguna parte de su documentación. No añadirlo.

**5. El render.** MP4 a 1080×1920 y 30 fps. Después `ffprobe` comprueba
resolución, códecs (H.264 y AAC a 48 kHz), fps y duración contra lo que Meta
exige. Si algo no cumple, el comando falla y no sube nada.

**6. R2 y Telegram.** El MP4 va a `reels/<mes>/<id>-<hash8>.mp4`, el comando
**imprime el bloque `reel` listo para pegar** en `content/piezas/<mes>.ts` —con el
guion, la URL y la duración—, y manda el archivo al chat de Telegram para
revisarlo en el teléfono, con sonido, que es como lo verá la gente.

- **El hash va en la clave** —los primeros 8 caracteres del SHA-256 del MP4—. Con
  una clave fija, re-renderizar tras corregir el guion deja la misma URL, y la
  caché de Cloudflare o la de Meta pueden servir el video viejo. Con el hash, cada
  render es una URL nueva que hay que pegar, y lo ya publicado no se toca nunca.
- **La subida es `wrangler r2 object put <bucket>/<clave> --remote --file`.**
  `wrangler` ya está en el proyecto y con sesión iniciada: no hace falta SDK de S3
  ni claves nuevas.
- **Telegram con `sendVideo` subiendo el archivo**, no pasando la URL. La Bot API
  admite 50 MB subiendo y solo 20 MB por URL; y `sendDocument` no se reproduce en
  el chat. **Y es un paso no fatal**: si Telegram falla, avisa y el comando
  termina igual imprimiendo el bloque. El render y la subida ya costaron minutos.

⚠️ **Imprime, no reescribe el archivo.** Es lo que ya hace `npm run captions`
(`lib/captions/cli.ts:63`), y por una razón: los calendarios del mes son
TypeScript con comentarios, no datos. Mutarlos desde un script pide manipular el
AST o hacer reemplazos frágiles, y el pegado a mano es además el momento en que
una persona lee lo que escribió el modelo.

Al repositorio solo entra texto: guion, caption y una URL.

### Las escenas

Una escena por slide, en el orden del carrusel: el guion recorre las mismas
ideas y en el mismo orden, así que un carrusel de cinco slides da unas cinco
escenas de unos cinco segundos. **Los cortes los fija lo que dura la voz de cada
párrafo, no un reloj**: la escena cambia cuando empieza el párrafo siguiente.

### Credenciales, y dónde viven

Todas son del comando local, no del Worker, así que van en `.env.local` y se
documentan en `docs/ENVIRONMENT_VARIABLES.md`:

| Variable | Para qué |
|---|---|
| `API_KEY` | El guion. ⚠️ **Es la de Gemini**, aunque el nombre no lo diga: es la que lee `lib/captions/gemini.ts:21`. `GEMINI_API_KEY` aparece en la documentación pero **el código no la usa** |
| `R2_BUCKET` | El nombre del bucket. Sin claves: la subida usa la sesión de `wrangler` |
| `HYPERFRAMES_PYTHON` | El Python con `kokoro-onnx` y `soundfile` que usa `hyperframes tts` |
| `MODELO_REEL` | Opcional: por defecto `gemini-3.8-flash` |

**`--ensayo` renderiza y verifica sin subir nada**, y no necesita `R2_*`. Existe
porque el bucket no existe todavía, y porque probar el render no debería obligar
a publicar un archivo.
| `R2_PUBLIC_BASE_URL` | La base de la URL pública del bucket, para componer `reel.video`. Los buckets de R2 son privados por defecto: hay que exponerlo con dominio propio o `r2.dev` |
| `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` | Mandarte el video al terminar |

El cron no necesita ninguna: publica desde la URL que ya viene en la pieza.

⚠️ **`urlPublica()` de `meta.ts` no sirve para el video.** Arma la ruta del CDN a
partir de `public/piezas/<mes>/`, y el MP4 no está ahí. Los canales de Reel leen
`reel.video` tal cual.

---

## Publicación

Dos canales nuevos detrás del descriptor `Canal` de `lib/publicar/tanda.ts`. Las
franjas, la ventana de 60 minutos y el reenvío del entorno no se tocan.

**Lo que sí hay que tocar del orquestador**, y es poco:

- `NombreCanal` pasa de dos valores a cuatro.
- `textosRecientes()` acepta hoy solo los campos `caption` y `message`: los reels
  de Facebook se comparan por `description`.
- Las dos funciones `pendientes` nuevas **descartan la pieza si no tiene
  `reel.video`**. Sin esa guarda, una pieza con guion escrito pero sin renderizar
  llega a la Graph API con la URL vacía y falla en cada corrida.

**Instagram.** Contenedor con `media_type=REELS` y la URL de R2; esperar a
`status_code = FINISHED` y publicar con `media_publish`. El Worker espera sin
gastar CPU.

🔑 **La espera ya está escrita, pero no sirve tal cual.** `esperarContenedor()`, en
`lib/publicar/meta.ts:75`, consulta `status_code` y aborta si dice `ERROR` o
`EXPIRED`. **Corta a los 60 segundos**: `INTENTOS = 30` es una constante del módulo
(`meta.ts:9`) y solo `esperarMs` es inyectable, a 2 s por defecto. Basta para una
imagen; un video tarda de 1 a 3 minutos en procesarse, y cortar a los 60 s marca
como fallido un Reel que iba bien.

Se reutiliza **haciendo inyectables también los intentos**, y el canal de Reel la
llama con 5 minutos: **cada 20 s, 15 intentos**. El carrusel conserva sus valores.
Dos razones para esos números y no otros: son la mitad de llamadas que cada
10 s, y 15 es distinto de los 30 de una imagen, así que un test puede
distinguir cuál de las dos esperas se usó. Un
contenedor abandonado no duplica nada —`media_publish` nunca se llamó— y caduca
solo a las 24 h.

**Facebook.** `upload_phase=start`, subir pasando la URL en la cabecera
`file_url` —el Worker nunca toca los bytes—, y `upload_phase=finish` con
`video_state=PUBLISHED`.

⚠️ **Un `200` no es una publicación.** La transcodificación y la revisión de
integridad son posteriores y pueden rechazar el video minutos después. Hay que
consultar el estado hasta que la fase de publicación termine.

**No publicar dos veces.** El mismo método —preguntarle a la red—, pero cada
canal mira donde debe:

| Canal | Dónde se consulta | Campo |
|---|---|---|
| Reel de Instagram | `/{ig-user-id}/media` | `caption` |
| Reel de Facebook | `/{page-id}/video_reels` | `description` |

⚠️ El `/posts` que se consulta hoy **no sirve para reels**. Verificado el
2026-09-13: `/video_reels` responde con el token actual y devuelve `description`.

### 🔴 El hueco de Facebook mientras Meta procesa

Dos hechos que juntos abren una ventana de doble publicación:

1. **La referencia oficial de Meta dice que `GET /{page-id}/video_reels` no se
   admite**, y sin embargo respondió con datos el 2026-09-13. La defensa se apoya
   en un comportamiento no documentado.
2. Un revisor afirma que ese listado **solo muestra reels ya publicados**, no los
   que están en proceso. **No se pudo verificar** sin publicar uno.

Si ambas cosas son ciertas, un Reel recién enviado es invisible durante uno a
tres minutos, y un segundo intento en ese hueco lo publicaría dos veces.

**Por qué el cron no lo provoca solo:** cada franja tiene **exactamente una
ejecución dentro de su ventana**. El cron dispara a las 14:00 y 23:00 UTC —09:00
y 18:00 de Ecuador, justo las franjas— y la ventana es de 60 minutos
(`programado.ts:26`). La siguiente ejecución cae nueve horas después, fuera.

**Lo que sí lo provoca:** un disparo manual de `/api/cron/publicar` dentro de la
misma hora de una franja con Reel de Facebook, o un `curl` cortado a mitad y
repetido. Por eso:

- El canal **sondea hasta que la fase de publicación termine** antes de dar el
  Reel por publicado, como ya dice arriba.
- Si la lectura de `/video_reels` falla, el canal **falla ruidosamente**, igual
  que hoy `textosRecientes()` (`tanda.ts:97`): nunca se trata como «no hay nada».
- `PUBLICACION_EN_REDES.md` gana el aviso: **no disparar a mano un Reel de
  Facebook dentro de su hora** sin comprobar antes en la Página que no salió.
- **Con el primer Reel real, verificarlo**: publicar, y listar `/video_reels`
  durante el procesamiento. Si el Reel aparece mientras se procesa, el hueco no
  existe y el aviso se puede quitar.

**Permisos:** los tokens actuales ya bastan. Verificado el 2026-09-13:
`instagram_content_publish`, `pages_manage_posts` y `pages_read_engagement`, los
dos de Página y sin caducidad.

**Topes de Meta:** 30 reels y 100 publicaciones por API cada 24 h. Quedan lejos
de dos por semana.

### Los límites del Worker, que ahora importan

El sondeo hace muchas más llamadas por corrida que publicar una imagen, así que
conviene tenerlos a la vista. **La cuenta está en el plan Workers Paid, 5 USD al
mes** (confirmado el 2026-09-13):

| | Gratuito | **El nuestro** |
|---|---|---|
| CPU por ejecución | 10 ms | **30 s** |
| Subpeticiones por ejecución | 50 | **10.000** |
| Reloj, en un cron | 15 min | 15 min |

Esperar en un `fetch` **no gasta CPU**, así que sondear durante minutos cabe de
sobra. En el plan gratuito, las 50 subpeticiones habrían sido un techo real con
cuatro canales publicando a la vez.

⚠️ **La ruta HTTP manual va a tardar minutos**, y eso cambia cómo se siente. No
hay límite duro: la documentación de Cloudflare dice que un Worker disparado por
HTTP puede seguir *«mientras el cliente siga conectado»*, y **no** devuelve 524.
Pero si se corta el `curl`, el Worker muere a media publicación. Al dispararlo a
mano, dejarlo terminar.

⚠️ Con cuatro canales se leen **cuatro perfiles por corrida**, y dos de esas
lecturas son al mismo endpoint de Instagram. Conviene compartir la lectura entre
el canal del carrusel y el del Reel: es una llamada menos y una fuente menos de
falsos negativos.

---

## Validación y pruebas

**El validador (`piezas --check`) gana estas reglas:**

1. Con bloque `reel`, `guion` y `caption` son obligatorios.
2. El `caption` del Reel no puede coincidir con el del carrusel ni con el de
   Facebook, **comparando con los espacios normalizados**, como hace
   `normalizar()` en `programado.ts`. Dos textos que solo difieren en saltos de
   línea son el mismo texto para la red, y el sistema los daría por publicados.
   Se comparan los captions **escritos**: cuando el de Facebook se compone desde
   las slides, `validar.ts` no lo puede ver sin importar `lib/captions/`, y esa
   frontera se respeta.
3. El guion pasa por las mismas puertas que un caption: precios contra
   `catalogo.ts`, afirmaciones contra `prohibidas.ts`. Un precio falso dicho en
   voz es igual de falso, y encima no se puede copiar y verificar. **Y el guion y
   el caption del Reel entran en la comprobación de `producto` obligatorio**: si
   mencionan un precio o una oferta, la pieza tiene que declarar de qué producto
   habla, igual que los otros textos.
4. `reel.publicarEl`, si está, tiene que ser una fecha válida. Una fecha mal
   escrita **no da error en ninguna parte**: `aUTC()` devuelve `NaN` y la pieza
   desaparece del cron en silencio. Ya está documentado en `validar.ts:79`.
5. **La duración estimada: 3 palabras por segundo**, que es la velocidad medida
   de `ef_dora` —**18 palabras en 5,95 s**, contadas con `wc -w` y medidas con
   `ffprobe` el 2026-09-13—. El guion tiene que caer entre **9 y 270 palabras**,
   que son los 3 a 90 segundos que admite Facebook. El objetivo, 20-30 segundos,
   son **60-90 palabras**.

   ⚠️ Una versión anterior de esta spec decía 2,6 palabras por segundo, contando
   16 palabras a mano. Salió al escribir el plan, al volver a contarlas.
6. `reel.duracion`, cuando el render ya lo escribió, entre 3 y 90.
7. `reel.video`, si está, es la URL `https` de un `.mp4`. Un dedazo al pegar el
   bloque se caza aquí y no en la Graph API, a la hora de publicar.

🔴 **Los tests de `lib/reels/` son herméticos, sin excepción.** `npm test` es
`node --test lib/*/*.test.ts`: el glob los recoge solo, y corre en CI
(`piezas.yml`, un `ubuntu-latest` sin `ffmpeg`, Chrome, Kokoro ni `espeak-ng`) y en
`prebuild`, antes de cada `build` y cada despliegue. Un test que necesite un
binario rompe el despliegue del sitio entero.

Por eso las herramientas externas —HyperFrames, `ffprobe`, `wrangler`, Telegram,
Gemini— se llaman desde una capa fina que **recibe la función de ejecutar por
parámetro**, igual que `fetchImpl` en `tanda.ts`. Los tests inyectan una falsa. Lo
que necesita la herramienta de verdad se prueba renderizando a mano, no en la
suite.

**Pruebas automáticas**, con `node --test` como el resto:

- Ningún archivo de `lib/publicar/` ni `lib/piezas/` alcanza `lib/reels/`.

- El HTML generado no contiene ningún color escrito a mano.
- El aviso de datos ficticios aparece literal, con raya larga, en cada escena que
  muestre pantalla.
- El encadenado de franjas y la detección de repetidos hacen lo que dicen.
- Los dos canales nuevos respetan la ventana de 60 minutos.

**Comprobación del artefacto**, dentro de `npm run reels` y no en los tests
porque renderizar tarda: `ffprobe` contra las especificaciones de Meta.

⚠️ **La revisión humana no se automatiza.** Ver el video entero, con sonido, en
el teléfono, antes de mergear. Los tests impiden publicar algo **falso**, no algo
**malo**: una pieza puede pasarlos todos y ser olvidable.

---

## Dónde vive cada cosa

Siguiendo la separación que ya usa la fábrica: `lib/piezas/` produce,
`lib/publicar/` publica.

| Archivo | Qué hace |
|---|---|
| `lib/reels/cli.ts` | El comando `npm run reels` |
| `lib/reels/guion.ts` | Gemini escribe el guion desde las slides |
| `lib/piezas/guion.ts` | Los párrafos de un guion: los usan el validador y la producción |
| `lib/reels/tiempos.ts` | Escenas y subtítulos a partir de lo que dura cada voz |
| `lib/reels/composicion.ts` | Genera el HTML desde los tokens del sistema |
| `lib/reels/verificacion.ts` | Lo que exige Meta, contra la salida de `ffprobe` |
| `lib/reels/producir.ts` | La tubería entera, con las herramientas inyectadas |
| `lib/reels/herramientas.ts` · `bloque.ts` | Ejecutar comandos, e imprimir el bloque para pegar |
| `lib/reels/r2.ts` · `telegram.ts` | Subida y aviso |
| `lib/publicar/meta.ts` · `facebook.ts` | Los dos canales nuevos, junto al cliente de cada red: reutilizan `llamar()` y `llamarFB()`, que son privados. Un archivo aparte obligaría a exportarlos |
| `lib/publicar/frontera.test.ts` | Que lo que carga el Worker no alcance `lib/reels/` |
| `lib/piezas/validar.ts` | Las cuatro reglas nuevas, junto a las que ya hay |
| `lib/piezas/tipos.ts` | El bloque `reel` |

---

## Riesgos

| Riesgo | Qué se hace |
|---|---|
| Los dos sistemas visuales se desincronizan | La composición se genera desde los tokens, y un test lo vigila |
| Gemini inventa un dato que el validador no caza | El validador solo caza lo que tiene escrito. La revisión humana en el PR es la otra mitad |
| La voz sintética exige la etiqueta de IA | Fuera de alcance, pero **hay que probarlo con el primer Reel publicado** antes de automatizar más |
| El MP4 no está donde Meta va a buscarlo | `npm run reels` sube a R2 y la publicación falla ruidosamente si la URL no responde |
| HyperFrames saca versión casi a diario | Se fija la versión en `package.json` |
| Una captura de pantalla se cuela mal recortada | El aviso se estampa siempre; el encuadre es criterio humano |

---

## De dónde salió cada corrección

Primera pasada de contraste, 2026-09-13: Claude y `agy` por separado, sin verse.
`agy` con `gemini-3.8-flash-high` y `--print-timeout=25m`, 9 hallazgos en una
corrida; Claude, 7. **Cada uno se verificó contra el código antes de aceptarlo.**

| Corrección | Quién | Cómo se verificó |
|---|---|---|
| Las cuatro franjas estaban sin asignar, y sin bloque de Facebook el Reel se quedaba sin fecha | los dos | `programado.ts:83-90` |
| Falta la guarda de `reel.video`: sin ella se publica una URL vacía | agy | `programado.ts:86`, el precedente de `facebook.imagen` |
| `esperarContenedor()` ya existe y se reutiliza | Claude | `meta.ts:75-86` |
| `NombreCanal` y `textosRecientes` hay que ampliarlos | Claude | `tanda.ts:12` y `tanda.ts:75-102` |
| La variable de Gemini es `API_KEY`, no `GEMINI_API_KEY` | agy | `lib/captions/gemini.ts:21` |
| El comando imprime el bloque, no reescribe el `.ts` | agy | `lib/captions/cli.ts:63` |
| Falta la tasa de palabras por segundo del validador | agy | medido: 18 palabras en 5,95 s con `ef_dora` (corregido al escribir el plan) |
| Comparar captions normalizando espacios | los dos | `programado.ts:35-37` |
| Faltaba validar `reel.publicarEl` y `reel.duracion` | agy | `validar.ts:79-91` |
| `FONDO_AVISO` vive en `capturas.ts`, no en `sistemas.ts` | agy | `capturas.ts:18` |
| Falta definir la URL pública de R2 | agy | los buckets son privados por defecto |
| `urlPublica()` no sirve para el video | Claude | `meta.ts:30-32` |
| `formatos: ['9x16']` rompería el carrusel | agy | `formatos.ts:25-30` |
| Los límites del Worker, con el plan pagado | Claude, dato de Luis | documentación de Cloudflare |

**Un hallazgo de `agy` resultó a medias y se anota para que nadie lo reintroduzca:**
dijo que la ruta HTTP manual daría error 524 a los 100 segundos. La documentación
de Cloudflare dice lo contrario —un Worker disparado por HTTP no tiene límite duro
de duración mientras el cliente siga conectado—, así que no hay que desacoplar la
ruta. Lo que sí es cierto es el fondo: **si se corta el `curl`, el Worker muere a
media publicación.**

---

### Segunda pasada, compartida

Mismo día. `agy` recibió la lista de lo ya cubierto y seis áreas nuevas; terminó
en **396 s**, pasado el límite de 5 minutos, lo que confirma que
`--print-timeout=25m` funciona. 8 hallazgos suyos y 8 de Claude, **3 en común**.

| Corrección | Quién | Cómo se verificó |
|---|---|---|
| `esperarContenedor()` corta a los 60 s: hay que inyectar los intentos | agy | `meta.ts:9` y `meta.ts:76` |
| Tests de `lib/reels/` herméticos, o rompen CI y `prebuild` | los dos | `package.json`, `piezas.yml` |
| Frontera: `lib/publicar/` no importa `lib/reels/` | los dos | `worker.ts:2`, `route.ts:2` |
| Sin respaldo si Gemini falla, y no reescribir un guion ya editado | los dos | `lib/captions/cli.ts:38-48` |
| El hueco de doble publicación en Facebook mientras Meta procesa | agy, con el análisis del cron de Claude | referencia de Meta; `wrangler.jsonc:41`, `programado.ts:26` |
| La referencia de Meta dice que `GET /video_reels` no se admite | Claude | referencia oficial contra la llamada real |
| El vidrio de Dark Glass desaparece tras H.264 | Claude | guía de sistemas de diseño de HyperFrames; `sistemas.ts` |
| Contrato del HTML: tamaño en la raíz, fuentes copiadas con `font-display: block` | los dos | `html-schema.mdx`; `master-skeleton.html:11-14` |
| Hash en la clave de R2 | los dos | — decisión de diseño |
| Subir con `wrangler`, sin SDK ni claves | Claude | `wrangler r2 object put --help` |
| Telegram: `sendVideo` por subida, y no fatal | los dos | Bot API |

**Un hallazgo de `agy` resultó inventado a medias:** propuso
`data-resolution="portrait"`. No aparece en ninguna parte de la documentación de
HyperFrames; salió de una propiedad del componente de video de su propia web. Lo
cierto de su fondo —que sin declarar el tamaño renderiza en 1920×1080— sí entró.

**Criterio de parada:** la primera pasada dio 16 hallazgos entre los dos y la
segunda 13, con un inventado. El rendimiento baja pero no se desploma, y lo que
queda por descubrir ya **no sale de leer**: sale de ejecutar —renderizar una
muestra, publicar un primer Reel—. Eso va al plan, no a una tercera pasada.

---

## Pasos manuales, antes de implementar

Son de infraestructura y los hace una persona, no el plan:

1. **Crear el bucket** de R2 —hoy no existe ninguno de PukaDigital; hay de
   LedgerXpertz y PukaHealth— y **exponerlo con dominio público** para que Meta
   pueda descargar.
2. **Crear el bot de Telegram** con @BotFather y anotar el `chat_id`.
3. Poner `R2_BUCKET`, `R2_PUBLIC_BASE_URL`, `TELEGRAM_BOT_TOKEN` y
   `TELEGRAM_CHAT_ID` en `.env.local`.

---

## Lo que queda abierto, a propósito

- **La etiqueta de «Hecho con IA»**: se prueba a mano con el primer Reel y se
  decide después.
- **Aprobar o rechazar desde Telegram**: necesitaría una ruta pública en el
  Worker y un almacén KV, y abriría dos puertas de calidad que pueden
  contradecirse. Spec propia si hace falta.
- **Música**: los Reels salen sin música. Las cuentas de empresa no pueden usar
  la biblioteca de Instagram, y la API tampoco la adjunta.
