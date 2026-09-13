# Reels con HyperFrames — diseño

Fecha: **2026-09-13**. Estado: **spec aprobada, sin implementar**.

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
npm run reels -- --mes 2026-10
  └─ Gemini escribe el guion desde las slides ya revisadas
     └─ Kokoro (ef_dora) lo convierte en voz
        └─ Parakeet o whisper.cpp devuelve el tiempo de cada palabra
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
`prohibidas.ts`, y escribe un texto hablado de 20 a 30 segundos —55 a 75
palabras a la velocidad de Dora—. La rúbrica exige que los primeros 3 segundos
planteen el problema: ahí se decide la retención.

⚠️ Verificar el identificador exacto del modelo al implementar. Esa familia se
mueve rápido, y la regla de usar el Flash 3.x más reciente ya está escrita en la
spec del 2026-09-07.

**2. La voz.** `hyperframes tts --voice ef_dora`, local y sin cuentas, a 24 kHz.
Determinista: mismo texto, mismo audio. Requiere `espeak-ng` en el sistema y un
Python con `kokoro-onnx` y `soundfile`, señalado con `HYPERFRAMES_PYTHON`.

**3. Los tiempos.** `hyperframes transcribe --language es` devuelve el inicio y
el fin de cada palabra. De ahí salen los subtítulos y los cortes entre escenas:
la imagen cambia cuando la voz cambia de idea, no cada N segundos.

**4. La composición.** Una escena por slide. Subtítulos dentro de la zona segura
y aviso de datos ficticios en toda escena que muestre pantalla.

**5. El render.** MP4 a 1080×1920 y 30 fps. Después `ffprobe` comprueba
resolución, códecs (H.264 y AAC a 48 kHz), fps y duración contra lo que Meta
exige. Si algo no cumple, el comando falla y no sube nada.

**6. R2 y Telegram.** El MP4 va a `reels/<mes>/<id>.mp4`, el comando **imprime el
bloque `reel` listo para pegar** en `content/piezas/<mes>.ts` —con el guion, la
URL y la duración—, y manda el archivo al chat de Telegram para revisarlo en el
teléfono, con sonido, que es como lo verá la gente.

⚠️ **Imprime, no reescribe el archivo.** Es lo que ya hace `npm run captions`
(`lib/captions/cli.ts:63`), y por una razón: los calendarios del mes son
TypeScript con comentarios, no datos. Mutarlos desde un script pide manipular el
AST o hacer reemplazos frágiles, y el pegado a mano es además el momento en que
una persona lee lo que escribió el modelo.

Al repositorio solo entra texto: guion, caption y una URL.

### Las escenas

Una escena por slide, en el orden del carrusel: el guion recorre las mismas
ideas y en el mismo orden, así que un carrusel de cinco slides da unas cinco
escenas de unos cinco segundos. **Los cortes los fijan los tiempos de las
palabras, no un reloj**: la escena cambia en la palabra donde empieza la idea
siguiente.

### Credenciales, y dónde viven

Las tres son del comando local, no del Worker, así que van en `.env.local` y se
documentan en `docs/ENVIRONMENT_VARIABLES.md`:

| Variable | Para qué |
|---|---|
| `API_KEY` | El guion. ⚠️ **Es la de Gemini**, aunque el nombre no lo diga: es la que lee `lib/captions/gemini.ts:21`. `GEMINI_API_KEY` aparece en la documentación pero **el código no la usa** |
| `R2_*` (cuenta, bucket, clave S3) | Subir el MP4 |
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

🔑 **La espera ya está escrita:** `esperarContenedor()`, en `lib/publicar/meta.ts`,
hace exactamente eso para los carruseles —consulta `status_code`, aborta si dice
`ERROR`— y se reutiliza tal cual.

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
5. **La duración estimada: 2,6 palabras por segundo**, que es la velocidad medida
   de `ef_dora` —6,0 segundos para las 16 palabras de la frase de prueba—. El
   guion tiene que caer entre **8 y 230 palabras**, que son los 3 a 90 segundos
   que admite Facebook. El objetivo sigue siendo 55-75 palabras.
6. `reel.duracion`, cuando el render ya lo escribió, entre 3 y 90.

**Pruebas automáticas**, con `node --test` como el resto:

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
| `lib/reels/voz.ts` | Kokoro y los tiempos por palabra |
| `lib/reels/composicion.ts` | Genera el HTML desde los tokens del sistema |
| `lib/reels/render.ts` | HyperFrames y la verificación con `ffprobe` |
| `lib/reels/r2.ts` · `telegram.ts` | Subida y aviso |
| `lib/publicar/reels.ts` | Los dos canales nuevos, detrás de `Canal` |
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
| Falta la tasa de palabras por segundo del validador | agy | medido: 16 palabras en 6,0 s con `ef_dora` |
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

## Lo que queda abierto, a propósito

- **La etiqueta de «Hecho con IA»**: se prueba a mano con el primer Reel y se
  decide después.
- **Aprobar o rechazar desde Telegram**: necesitaría una ruta pública en el
  Worker y un almacén KV, y abriría dos puertas de calidad que pueden
  contradecirse. Spec propia si hace falta.
- **Música**: los Reels salen sin música. Las cuentas de empresa no pueden usar
  la biblioteca de Instagram, y la API tampoco la adjunta.
