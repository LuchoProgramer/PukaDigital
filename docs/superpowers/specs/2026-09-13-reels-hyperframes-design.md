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
| Colores | `lib/piezas/sistemas.ts` |
| Tipografías | `assets/fonts/` |
| Texto del aviso de datos ficticios | `AVISO` en `lib/piezas/capturas.ts` |
| Zona segura de 9:16 | `FORMATOS['9x16']` en `lib/piezas/formatos.ts` |

Un color escrito a mano en el HTML hace fallar un test.

---

## Modelo de datos

```typescript
reel?: {
  /** El guion hablado. Lo escribe Gemini, lo revisa una persona en el PR. */
  guion: string;
  /** El texto del post. Obligatorio y distinto del caption del carrusel. */
  caption: string;
  /** Hora de Ecuador. Sin él, cae en la franja siguiente a la de Facebook. */
  publicarEl?: string;
  /** URL pública en R2. La escribe el render; a mano no se toca. */
  video?: string;
  /** Segundos del MP4 renderizado. Entre 3 y 90: es el techo de Facebook. */
  duracion?: number;
};
```

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

**6. R2 y Telegram.** El MP4 va a `reels/<mes>/<id>.mp4`, su URL pública queda en
el campo `video`, y el archivo se envía al chat de Telegram para revisarlo en el
teléfono, con sonido, que es como lo verá la gente.

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
| `GEMINI_API_KEY` | El guion. Ya existe para los captions |
| `R2_*` (cuenta, bucket, clave S3) | Subir el MP4 |
| `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` | Mandarte el video al terminar |

El cron no necesita ninguna: publica desde la URL pública del bucket.

---

## Publicación

Dos canales nuevos detrás del descriptor `Canal` de `lib/publicar/tanda.ts`. Las
franjas, la ventana de 60 minutos y el reenvío del entorno no se tocan.

**Instagram.** Contenedor con `media_type=REELS` y la URL de R2; esperar a
`status_code = FINISHED` —de 30 s a 2 min, preguntando una vez por minuto, como
máximo cinco— y publicar con `media_publish`. El Worker espera sin gastar CPU.

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

---

## Validación y pruebas

**El validador (`piezas --check`) gana cuatro reglas:**

1. Con bloque `reel`, `guion` y `caption` son obligatorios.
2. El `caption` del Reel no puede coincidir con el del carrusel ni con el de
   Facebook.
3. El guion pasa por las mismas puertas que un caption: precios contra
   `catalogo.ts`, afirmaciones contra `prohibidas.ts`. Un precio falso dicho en
   voz es igual de falso, y encima no se puede copiar y verificar.
4. La duración estimada por número de palabras cae entre 3 y 90 segundos.

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

## Lo que queda abierto, a propósito

- **La etiqueta de «Hecho con IA»**: se prueba a mano con el primer Reel y se
  decide después.
- **Aprobar o rechazar desde Telegram**: necesitaría una ruta pública en el
  Worker y un almacén KV, y abriría dos puertas de calidad que pueden
  contradecirse. Spec propia si hace falta.
- **Música**: los Reels salen sin música. Las cuentas de empresa no pueden usar
  la biblioteca de Instagram, y la API tampoco la adjunta.
