# Video con HyperFrames — investigación previa

Investigado el **2026-09-13**. **Nada decidido y nada construido**: esto es el
material para la spec de video, que todavía no existe. No empezar a implementar
sin instrucciones.

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

⚠️ `CALENDARIO_CONTENIDO.md` y `COMMUNITY_MANAGEMENT.md` siguen con la cadencia
vieja («8 estáticos + 2 videos al mes», Reels hechos en Flow). Hay que decidir
cuál vale antes de escribir la spec.

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
- Ya están `ffmpeg` y Node. Faltan `espeak-ng` (sin él no hay español con
  Kokoro) y `uv`.

---

## Lo que no se pudo verificar

- **La calidad real de las voces en español latino.** Ninguna fuente la mide, y
  es la decisión que más pesa.
- La licencia comercial de la música del catálogo de HeyGen.
- Si la Graph API permite poner la etiqueta de IA.
- Que retener al 60% a los 3 s multiplique el alcance: viene de blogs, no de Meta.

## El siguiente paso propuesto

Una **prueba de voces**, fuera del repositorio: la misma frase de una pieza real
con `ef_dora`, Chatterbox latam y Qwen3-TTS, para escucharlas. Decide lo que más
pesa sin escribir código.

---

## Fuentes

- [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) · [Voz y audio](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/voice-and-audio.mdx) · [Reglas y antipatrones](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/rules-and-anti-patterns.mdx) · [Storyboards](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/storyboards.mdx) · [Render y salida](https://github.com/heygen-com/hyperframes/blob/main/docs/prompting/rendering-and-output.mdx)
- [coleam00/hyperframes-ai-video-generation](https://github.com/coleam00/hyperframes-ai-video-generation) · [nateherkai/hyperframes-student-kit](https://github.com/nateherkai/hyperframes-student-kit) · [feicaiclub/video-spec-builder](https://github.com/feicaiclub/video-spec-builder)
- [Web Reactiva — Hyperframes](https://www.webreactiva.com/blog/hyperframes) · [HyperFrames vs Remotion (ArceApps)](https://arceapps.com/blog/hyperframes-vs-remotion-2026/) · [MindStudio — What is HyperFrames](https://www.mindstudio.ai/blog/what-is-hyperframes-html-video-renderer-ai-agents)
- [Kokoro VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) · [Chatterbox](https://github.com/resemble-ai/chatterbox) · [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) · [qwen3-tts-spanish-voices](https://github.com/alblez/qwen3-tts-spanish-voices) · [parakeet-tdt-0.6b-v3](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) · [TTS open source 2026 (BentoML)](https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models)
- [Instagram API — publicación de contenido](https://developers.facebook.com/docs/instagram-platform/content-publishing/) · [Referencia IG User Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- [Meta — Misinformation / etiquetas de IA](https://transparency.meta.com/policies/community-standards/misinformation) · [Reglas de divulgación de IA por plataforma](https://influencermarketinghub.com/ai-disclosure-rules/)
- [Hootsuite — algoritmo de Instagram](https://blog.hootsuite.com/instagram-algorithm/) · [Zonas seguras de Reels (Outfy)](https://www.outfy.com/blog/instagram-safe-zone/) · [Música en Reels 2026 (Foxi)](https://www.foximusic.com/blog/instagram-reels-music-copyright-legal-guide/)
