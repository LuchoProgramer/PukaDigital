# Video con HyperFrames — investigación previa

Investigado el **2026-09-13**, y **construido ese mismo día**. Esto es la
investigación que alimentó la spec
(`superpowers/specs/2026-09-13-reels-hyperframes-design.md`) y sus dos planes: lo
decidido vive allí, y cómo se usa, en `PUBLICACION_EN_REDES.md` → «Los Reels».
Lo de abajo se conserva como fuente.

Para la cadencia acordada, ver la spec del 2026-09-07
(`superpowers/specs/2026-09-07-facebook-canal-propio-design.md`, líneas 25-35).
Para lo que PukaHealth no hace, `PUKAHEALTH_LIMITES.md`.

---

## De dónde viene

El plan se habló el 2026-09-07/08, en la sesión que diseñó el canal de Facebook,
y en el repositorio solo quedó una línea: *«Reels y video. HyperFrames, TTS y el
guion son otra spec.»* Lo acordado entonces, rescatado de esa conversación:

| Pieza | Por semana | Destino |
|---|---|---|
| Carrusel | 2 | Instagram + Facebook |
| Reel con HyperFrames | 2 | IG Reels + FB Reels + TikTok a mano |
| Storytelling con IA o animación | 1 | Igual |
| Video con la cara de Luis | 0,5 (cada 15 días) | Igual |

- **Orden acordado:** 0 Cloudflare, 1 Facebook, 2 video. Los dos primeros ya
  están hechos.
- **El video con la cara no lo hace HyperFrames.** Lo graba Luis.
- **«Storytelling con IA» quedó sin aclarar.** Puede ser video generativo tipo
  Veo (caro, se paga por segundo) o narración escrita sobre animación HTML (casi
  gratis). Es la primera pregunta de la spec, porque cambia el coste.
- **TikTok solo impone algo sobre el render:** el MP4 en disco, 9:16 y sin marca
  de agua. Su API excluye nuestro caso de uso.
- **XTTS v2 queda descartado:** licencia no comercial, y Coqui cerró en enero de
  2024, así que no hay a quién comprarle una licencia.

✅ **Resuelto el 2026-09-13.** La spec fijó dos Reels por semana, hechos por la
fábrica a partir de un carrusel, y `CALENDARIO_CONTENIDO.md` y
`COMMUNITY_MANAGEMENT.md` ya lo dicen.

---

## Lo esencial

1. **La comunidad repite un mismo flujo:** guion → voz → tiempos por palabra →
   HTML animado → revisión → render → escucha humana. Nadie genera el video de
   una sola vez.
2. **HyperFrames sí trae voz en español.** Verificado en su código
   (`packages/cli/src/tts/manager.ts`): la voz `ef_dora` de Kokoro viene
   incluida. El artículo de Web Reactiva que dice «solo inglés» está
   desactualizado. Pero Kokoro **no califica** sus voces en español.
3. **Hay voces mejores para Latinoamérica con licencia comercial:** Chatterbox
   `es-mx-latam` (MIT) y Qwen3-TTS (Apache 2.0).
4. **Los mejores resultados planifican antes de renderizar:** guion por segundos
   y por escena.
5. **Tres cosas chocan con nuestras reglas:** la etiqueta de IA de Meta, la
   música en cuentas de empresa y el aviso de datos ficticios en cada fotograma.

---

## 1. El flujo de la comunidad

- **[coleam00/hyperframes-ai-video-generation](https://github.com/coleam00/hyperframes-ai-video-generation)**
  (MIT). De un tema o una URL a un Short de 24-30 s. Claude investiga y escribe
  el guion con pausas marcadas; la voz sale de Kokoro o ElevenLabs y produce un
  `transcript.json` con `{word, start, end}` que mueve las animaciones. Pasa
  `hyperframes lint` antes de renderizar.
- **[nateherkai/hyperframes-student-kit](https://github.com/nateherkai/hyperframes-student-kit)**
  (MIT, 14 skills). Edición de Reels a partir de la transcripción: corta
  silencios y errores, añade subtítulos y B-roll, y exige un `VERIFY.md` de
  revisión antes de entregar.
- **[feicaiclub/video-spec-builder](https://github.com/feicaiclub/video-spec-builder)**
  (MIT). Pregunta hasta que la idea es un `video-spec.md` con cada toma
  cronometrada, y solo entonces pasa a HyperFrames. Su argumento: *lo difícil no
  es renderizar, es saber qué quieres*.

La [documentación oficial](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/storyboards.mdx)
dice lo mismo: se planifica una vez y cada escena se ejecuta contra ese plan.

---

## 2. Con qué se combina

| Capa | Herramienta | Licencia | Nota |
|---|---|---|---|
| Render | [HyperFrames](https://github.com/heygen-com/hyperframes) | Apache 2.0 | 49k ⭐. Saca versión casi a diario (v0.8.36 el 12/09): **fijar la versión** |
| Voz local | Kokoro (`ef_dora`) | Apache 2.0 / MIT | Viene en `npx hyperframes tts`. Para español necesita `espeak-ng` |
| Voz latina | [Chatterbox es-mx-latam](https://huggingface.co/ResembleAI/Chatterbox-Multilingual-es-mx-latam) | MIT | Corre en Apple Silicon. ⚠️ Marca de agua de audio imborrable |
| Voz latina | [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) | Apache 2.0 | Oficialmente pide GPU NVIDIA; en Mac, [repo comunitario](https://github.com/alblez/qwen3-tts-spanish-voices). ⚠️ Sus voces clonadas heredan GPL-3.0; las diseñadas por texto no |
| Tiempos por palabra | parakeet-mlx | Apache 2.0 (modelo CC-BY-4.0) | Motor por defecto de HyperFrames si está instalado. Entiende español. Exige atribución |
| Respaldo de transcripción | whisper.cpp | MIT | ⚠️ Su modelo por defecto es `small.en`, solo inglés: pasar `--language es` |
| Música, imágenes | CLI de HeyGen | cuenta gratuita | Licencia comercial del catálogo de música **sin verificar** |

**Telemetría:** el CLI de HyperFrames envía datos de uso. Se desactiva con
`HYPERFRAMES_NO_TELEMETRY=1`.

---

## 3. Buenas prácticas, con cifras

**Los primeros 3 segundos se editan aparte.** El kit los trata como una puerta:
si ahí no convence, lo demás no importa. Mosseri insiste en ese inicio.

**Antes de la primera escena, cuatro cosas:** el mensaje, el arco (gancho →
sustancia → cierre), la audiencia y el tono. Por escena, su función (gancho,
prueba o CTA) y en qué cae la mirada. La regla oficial de **dos colores** encaja
con Dark Glass Rojo.

**Subtítulos:**
- El video se piensa para verse sin sonido; los subtítulos hacen de narración.
- Zona segura en 1080×1920: el kit usa x 90–930, y 200–1600. Instagram no publica
  cifras oficiales y las guías no coinciden.
- Cada palabra a menos de 2 fotogramas de cuando se pronuncia.

**Audio:**
- Mezcla a -16 LUFS y como máximo -1 dBTP.
- Música entre 14 y 20 dB bajo la voz, bajándola solo mientras se habla.
- Con ElevenLabs: velocidad máxima 1.15 (más rápido aplana la entonación) y
  pausas de unos 0,4 s (más largas meten chasquidos).

**Reglas técnicas oficiales:**
- Nada de `Math.random()`: rompe el determinismo.
- Toda animación registrada en `window.__timelines`.
- Los `<video>` siempre `muted`; el audio va en `<audio>` aparte.
- Nada de `async` al construir las animaciones.
- **No renderizar en 4K ni a 60 fps para Instagram:** lo recomprime igual.

**Revisión humana:** escuchar el audio de verdad, no mirar la forma de onda, y
comprobar nombres, términos y cifras.

---

## 4. Lo que choca con nuestras reglas

- **Etiqueta de IA.** Meta pide declarar el *audio realista generado*, y una voz
  sintética entra ahí: activar «Hecho con IA». No verificado si la Graph API
  permite marcarlo al publicar.
- **Música.** Las cuentas de empresa no pueden usar la biblioteca musical de
  Instagram, y un Reel publicado por API tampoco puede adjuntarla. Hace falta
  música con licencia comercial propia.
- **El aviso de datos ficticios va en cada fotograma** que muestre pantalla. Por
  faltar ahí se retiró el video de YouTube. La plantilla de video tiene que
  estamparlo siempre, como `capturas.ts`.
- **Lo que dice la voz también se valida.** Un precio falso dicho en voz es tan
  grave como uno impreso: `catalogo.ts` y `prohibidas.ts` tienen que revisar el
  guion.

### Especificaciones de la API para Reels

MP4 con video H.264 (o HEVC) y audio AAC · 23-60 fps · de 3 s a 15 min · máximo
300 MB y 25 Mbps.

Admite **trial reels** (`trial_params`), que se muestran solo a quien no te
sigue. Sirven justo para medir qué funciona antes de la pauta.

---

## 5. La máquina de Luis

Apple M4 con 16 GB, medido el 2026-09-13:

- **Kokoro y parakeet-mlx** van sin problema.
- **Chatterbox** debería funcionar.
- **Qwen3-TTS 1.7B** va justo: el repo comunitario pide 16 GB mínimo y recomienda
  32.
- Ya están `ffmpeg`, Node y `espeak-ng`, y el entorno de Kokoro vive en
  `~/.venvs/kokoro`. Actualizado el 2026-09-13.

---

## Lo que no se pudo verificar

- **La calidad real de las voces en español latino.** Ninguna fuente la mide, y
  es la decisión que más pesa.
- La licencia comercial de la música del catálogo de HeyGen.
- Si la Graph API permite poner la etiqueta de IA.
- Que retener al 60% a los 3 s multiplique el alcance: viene de blogs, no de Meta.

---

## 6. Publicar video en Meta de forma automática

Verificado el 2026-09-13 contra la documentación oficial. **Sí se puede en los
dos canales**, y los tokens que ya tenemos sirven: los dos son de Página, no
caducan y traen `instagram_content_publish`, `pages_manage_posts` y
`pages_read_engagement`.

### Instagram Reels

El mismo patrón de los carruseles, con una espera en medio:

1. Contenedor con `media_type=REELS` y `video_url` a un MP4 público.
2. **Esperar**: consultar `status_code` hasta `FINISHED` — de 30 s a 2 min. Meta
   recomienda una vez por minuto y no más de 5.
3. `media_publish`.

- **No hay publicación programada**: la hora la dispara nuestro cron, como ahora.
- 100 publicaciones por API cada 24 h, sumando todos los formatos.
- Un contenedor sin publicar caduca a las 24 h.

### Facebook Reels

Endpoint distinto del que usamos hoy: `/{page-id}/video_reels`, en tres fases.

1. `upload_phase=start`.
2. Subir el video. **Se puede pasar una URL en la cabecera `file_url`** en vez de
   mandar los bytes — lo que importa para un Worker.
3. `upload_phase=finish` con `video_state=PUBLISHED`.

- Facebook **sí** programa nativamente: `video_state=SCHEDULED` con
  `scheduled_publish_time`, entre 10 minutos y 29 días.
- 30 reels por API cada 24 h.
- Especificaciones: 9:16, 1080×1920, 24-60 fps, **3 a 90 s**, H.264, AAC 48 kHz.

⚠️ **Un `200` en la fase final no es una publicación.** La transcodificación y la
revisión de integridad son posteriores y pueden rechazar el video minutos
después. Hay que consultar el estado hasta que la fase de publicación termine.

⚠️ **Meta rechaza archivos alojados en sitios que bloquean por `robots.txt`.** El
nuestro permite todo; no romperlo.

### Lo que hay que decidir en la spec

> ✅ **Resuelto en la spec del 2026-09-13.** Los MP4 van a R2
> (`pukadigital-reels`, servido en `reels.pukadigital.com`); en Facebook se
> compara contra `/video_reels`, no contra `/posts`; y el Reel dura de 3 a 90 s,
> con 20 a 30 como objetivo.

1. **Dónde viven los MP4.** Misma trampa que los PNG —sin desplegar, el CDN no
   los sirve—, pero el peso cambia: hoy `public/piezas` son 3,3 MB y el
   repositorio entero 13 MB. Cloudflare aguanta (25 MiB por archivo, 20.000
   archivos), así que la duda no es técnica: es si se versiona video o va a R2.
2. **Cómo se evita publicar dos veces.** Hoy se leen las publicaciones recientes
   y se compara el texto. Para Facebook habría que mirar `/video_reels`: **sin
   verificar si los reels salen en `/posts`**, que es lo que se consulta ahora.
3. **90 segundos es el techo de Facebook**, y fija el formato.

⚠️ **La etiqueta de IA no tiene parámetro en la API.** En la documentación solo
aparece como un interruptor en la pantalla de publicación. Con voz sintética,
puede que haya que ponerla a mano después de publicar, y eso rompe la
automatización completa. Hay que probarlo.

**Probado el 2026-09-14:** el primer Reel, publicado por API con la voz de Dora,
salió **sin** la etiqueta en Instagram y en Facebook, visto en la app. Meta no la
pone sola. Si se decide declararla, es a mano.

---

## Decidido el 2026-09-13

**Los Reels llevan voz.** Se descarta empezar por el formato mudo con
subtítulos. La medición de resultados y la etiqueta de IA se resuelven después,
no bloquean.

**La voz es `ef_dora`, la femenina de Kokoro**, elegida escuchando las cuatro
candidatas con la misma frase de `crm-no-chatbot`. No fue solo gusto: es también
la opción más ligera, la más rápida y **la única sin marca de agua**.

| | Kokoro (`ef_dora`) | Chatterbox latam |
|---|---|---|
| Generar 6 s de audio | ~2 s | 11,5 s, más 10 s de carga |
| Peso en disco | 27 MB | ~10 GB de caché + 1,7 GB de entorno |
| Marca de agua | no | **sí, imborrable** |

Medido en el M4 de 16 GB. Kokoro va ~3x más rápido que el tiempo real;
Chatterbox, ~2x más lento. Para 30 segundos da igual; el peso no.

Qwen3-TTS quedó sin probar: con Dora elegida, no hacía falta.

## Cuatro trampas de la prueba de voces

Cada una costó un intento y ninguna está documentada río arriba:

1. **`hyperframes tts` no funciona recién instalado.** Necesita `kokoro-onnx` y
   `soundfile` en un Python propio, señalado con `HYPERFRAMES_PYTHON`, y
   `espeak-ng` en el sistema: sin él no hay español.
2. **El finetune de español latino de Chatterbox está incompleto a propósito**:
   solo publica el T3. El codificador de voz, el vocoder y el tokenizador salen
   del modelo base, y el archivo hay que renombrarlo a
   `t3_mtl23ls_v2.safetensors`. No está escrito: sale de leer el cargador.
3. **La marca de agua de Resemble pide `pkg_resources`**, que ya no viene en
   `setuptools` moderno. Hay que fijar `setuptools<81`.
4. **`torchaudio` 2.14 no guarda audio sin `torchcodec`.** Se escribe con
   `soundfile`.

Y una quinta, que apareció al renderizar el primer Reel, el mismo día: **Kokoro
trae su propio `espeak-ng`**, compilado en la CI de sus autores y con la ruta de
los datos apuntando allí. Aquí falla con `phontab: No such file or directory`,
un error que no menciona ni Kokoro ni el español. Se arregla apuntando
`ESPEAK_DATA_PATH` y `PHONEMIZER_ESPEAK_LIBRARY` al `espeak-ng` de Homebrew.

Las pruebas viven en `~/Downloads/pruebas-voz/`, fuera del repositorio.

---

## Música — ideas del 2026-09-14, sin empezar

Guardado a pedido de Luis para retomarlo otro día. **Nada decidido y ninguna
licencia verificada todavía.**

**Lo que no se puede:** las cuentas de empresa no tienen la biblioteca musical de
Instagram, y un Reel publicado por API tampoco puede adjuntarla. La música tiene
que venir dentro del MP4, con licencia propia.

### De dónde sacarla

| Fuente | Coste | A verificar antes de elegir |
|---|---|---|
| Pixabay Music | gratis | Su licencia dice uso comercial sin atribución. La más cómoda para empezar |
| YouTube Audio Library | gratis | Algunas pistas piden atribución. Confirmar que se pueden usar fuera de YouTube |
| Kevin MacLeod / Incompetech | gratis | Creative Commons con atribución: habría que citarlo en cada caption |
| Epidemic Sound o Artlist | suscripción | La licencia más clara para redes, y catálogo enorme |
| Música generada con IA (Suno, ElevenLabs Music) | plan de pago | Los planes de pago suelen dar uso comercial. Pistas únicas de la marca |

**La idea de partida:** 2 o 3 pistas de Pixabay, guardando la página de su licencia
como prueba. Si la cuenta crece, Epidemic Sound o Artlist.

### Cómo encajaría en la fábrica

- **Versionadas en `assets/musica/`**, como las capturas, cada una con su ficha: de
  dónde salió, qué licencia tiene y cuándo se descargó. Si Meta reclama, la prueba
  está ahí.
- **Una por sistema visual**: con energía para la casa, tranquila para PukaHealth.
- **La voz de Dora manda.** Música 14 a 20 dB por debajo, que baja sola mientras
  habla (§3 de este documento), en la misma pasada de `ffmpeg` que ya normaliza el
  audio.
- **La validación solo aceptaría pistas con ficha de licencia**, igual que hoy un
  precio que no está en `catalogo.ts` no se publica.

### Además de la música

- Un **sonido de marca** de un segundo al final de cada Reel, siempre el mismo.
- Un **efecto suave en cada cambio de escena**, sin tapar la voz.
- **Probar con y sin música**: dos versiones del mismo Reel dicen si suma o distrae.

Al retomarlo, lo primero es **escuchar las candidatas**, como se eligió la voz.

---

## Fuentes

- [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) · [Voz y audio](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/voice-and-audio.mdx) · [Reglas y antipatrones](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/rules-and-anti-patterns.mdx) · [Storyboards](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/storyboards.mdx) · [Render y salida](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/rendering-and-output.mdx)
- [coleam00/hyperframes-ai-video-generation](https://github.com/coleam00/hyperframes-ai-video-generation) · [nateherkai/hyperframes-student-kit](https://github.com/nateherkai/hyperframes-student-kit) · [feicaiclub/video-spec-builder](https://github.com/feicaiclub/video-spec-builder)
- [Web Reactiva — Hyperframes](https://www.webreactiva.com/blog/hyperframes) · [HyperFrames vs Remotion (ArceApps)](https://arceapps.com/blog/hyperframes-vs-remotion-2026/) · [MindStudio — What is HyperFrames](https://www.mindstudio.ai/blog/what-is-hyperframes-html-video-renderer-ai-agents)
- [Kokoro VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) · [Chatterbox](https://github.com/resemble-ai/chatterbox) · [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) · [qwen3-tts-spanish-voices](https://github.com/alblez/qwen3-tts-spanish-voices) · [parakeet-tdt-0.6b-v3](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) · [TTS open source 2026 (BentoML)](https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models)
- [Instagram API — publicación de contenido](https://developers.facebook.com/docs/instagram-platform/content-publishing/) · [Referencia IG User Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- [Meta — Misinformation / etiquetas de IA](https://transparency.meta.com/policies/community-standards/misinformation) · [Reglas de divulgación de IA por plataforma](https://influencermarketinghub.com/ai-disclosure-rules/)
- [Hootsuite — algoritmo de Instagram](https://blog.hootsuite.com/instagram-algorithm/) · [Zonas seguras de Reels (Outfy)](https://www.outfy.com/blog/instagram-safe-zone/) · [Música en Reels 2026 (Foxi)](https://www.foximusic.com/blog/instagram-reels-music-copyright-legal-guide/)
