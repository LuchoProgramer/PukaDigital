# Facebook como canal propio — Spec de Diseño

**Fecha:** 2026-09-07
**Estado:** Propuesto
**Alcance:** Publicar en Facebook con formato y texto nativos. El video queda fuera.
**Prerrequisito:** migración a Cloudflare, fases B y C. Ver *Por qué va después*.

Sucede a `docs/PUBLICAR_EN_FACEBOOK.md`, que era investigación sin decidir. Este
documento decide.

---

## Contexto

Hoy solo se publica en Instagram. La página de Facebook existe, está enlazada a
la cuenta de Instagram y su token no caduca — está verificado con `debug_token`
en el documento de investigación. Lo que falta no es acceso: es decidir **qué**
se publica ahí.

La cadencia también cambia. La spec de la fábrica (2026-09-01) fijó 8 estáticos
y 2 videos al mes con una advertencia explícita: más volumen no ayuda, Instagram
premia cadencia sostenida. Eso sigue siendo cierto. Lo que cambia no es el
volumen por red, sino el número de formatos y de canales:

| Pieza | Por semana | Destino |
|---|---|---|
| Carrusel | 2 | Instagram (5 slides) + Facebook (formato nativo) |
| Reel | 2 | IG Reels + FB Reels + descarga manual a TikTok |
| Storytelling o animación | 1 | Igual |
| Video con cara | 0,5 (cada 15 días) | Igual |

Son 5,5 piezas producidas por semana y ~22-24 publicaciones al mes, frente a las
10 de hoy. Cae dentro de lo que Mosseri recomienda —~2 Reels y 3-5 posts de feed
por semana— así que **no contradice la spec de la fábrica**: no es más volumen
por red, es la misma pieza rindiendo en dos canales.

**Este documento cubre solo los estáticos en Facebook.** Los Reels y TikTok son
otra spec.

---

## Dos correcciones al documento de investigación

**El 1:1 no está.** El documento afirma que «la fábrica ya genera el 1:1». Es
falso para los carruseles: `formatos.ts:29` renderiza en `1x1` únicamente las
piezas de una sola slide. Un carrusel de 2 o más sale **solo en 4x5**.

**El caption de Facebook no hace falta escribirlo dos veces.** El documento lo
dejaba como pregunta abierta y como el mayor coste recurrente. No lo es: el
argumento completo ya está escrito en los `titular`, `bajada` y `dato` de las
cinco slides.

---

## Decisiones

| Pregunta | Decisión |
|---|---|
| Qué imagen | La **slide 1 en 4x5**, que ya existe renderizada |
| Qué texto | Caption largo con el argumento entero, distinto del de Instagram |
| Quién lo escribe | Gemini, en tiempo de PR. Compositor determinista como red |
| Cuándo | Mismo día, franjas distintas: Instagram 09:00, Facebook 18:00 |
| Modelo de datos | Campo `facebook` opcional dentro de `Pieza` |
| Arranque | Los 7 carruseles de septiembre se republican en Facebook |

### Por qué la slide 1 en 4x5 y no el 1:1

Cero render nuevo: los PNG de las 7 piezas de septiembre ya están en
`public/piezas/2026-09/`. El vertical 4:5 además ocupa más pantalla en el feed
que un cuadrado. Añadir `1x1` a los carruseles obligaría a revisar que la
plantilla —compuesta para 4x5— no rompa el texto al cuadrar, a cambio de nada.

### Por qué no el carrusel completo

Un post multi-foto por la Graph API se renderiza en Facebook como **collage de
álbum**: todas las imágenes a la vez, en mosaico. Las piezas son narrativas de
cinco slides donde la primera engancha y la última cierra. En mosaico la primera
deja de enganchar, porque el final ya se ve.

El carrusel deslizable de verdad existe (`child_attachments`) pero cada tarjeta
necesita su propia URL de destino: es un formato de tarjetas-enlace, más cercano
a un anuncio que a una pieza editorial.

### Por qué el texto tiene que ser distinto

No hay penalización por publicar contenido propio en las dos plataformas —eso es
un mito—, pero Meta sí suprime alcance cuando el texto es copia y pega entre
redes. El caption de Instagram es prosa narrativa con hashtags; el de Facebook
es argumentado en bloques y **sin hashtags**, que en Facebook no hacen
prácticamente nada y solo acercarían los dos textos.

### Por qué las franjas ya existentes

`vercel.json` ya corre el cron a las 09:00 y 18:00 de Ecuador. Dar a cada red su
franja no cuesta infraestructura. Desfasar Facebook dos o tres días estiraría el
calendario, pero exigiría más franjas y un campo de fecha propio para ganar algo
que no está medido.

---

## Por qué va después de Cloudflare

Facebook se construye dentro de `/api/cron/publicar`, que es exactamente el
archivo que la migración mueve. Construirlo en Vercel y migrarlo después es
hacer el mismo trabajo dos veces.

Además Workers da crons de precisión por minuto. Eso permite bajar
`VENTANA_MINUTOS` de 90 a 60 en `lib/publicar/programado.ts` y publicar dentro
de la franja de verdad, en vez de aceptar que una pieza de las 09:00 pueda salir
a las 10:30.

La duda razonable sobre Workers —Satori y `@resvg/resvg-js` son bindings nativos
de Rust y no corren ahí— ya está resuelta en
`docs/superpowers/specs/2026-09-02-migracion-cloudflare-design.md:44`: la única
referencia desde `app/` es un `import type`, que se borra al compilar. La fábrica
se queda como CLI local y solo viaja el publicador.

---

## Arquitectura: dos tuberías que no se tocan

```
  ESCRITURA — a mano, al preparar el mes
  npm run captions -- --mes 2026-10
     └─ Gemini lee slides + catálogo + afirmaciones prohibidas
        └─ escribe facebook.caption en content/piezas/2026-10.ts
           └─ npm run piezas -- --check valida hechos, precios y topes
              └─ pull request ← revisión humana. La puerta de calidad está aquí.

  PUBLICACIÓN — cron, determinista, sin IA y sin clave de API
     ├─ 09:00 Ecuador → Instagram: carrusel 5 slides + caption de Instagram
     └─ 18:00 Ecuador → Facebook:  slide 1 en 4x5 + facebook.caption
                                    └─ si falta → componer.ts desde las slides
```

Es la regla que la spec de la fábrica ya impuso, aplicada al caption:

> **La tubería nunca llama a una API de modelo. El agente llama a la tubería.**

Esto no es ceremonia. Resuelve tres cosas a la vez:

1. **El determinismo.** Sin base de datos, la única defensa contra publicar dos
   veces es preguntarle a la red si ya existe ese caption
   (`programado.ts:40`). Un texto que cambia en cada ejecución produce
   duplicados. Escrito en el archivo, el texto es fijo.
2. **La revisión.** El PR es donde un humano lee lo que va a salir. Si el LLM
   escribiera en tiempo de publicación, nadie lo leería antes que el público.
3. **La independencia.** El publicador no tiene clave de API. Si mañana no hay
   presupuesto de tokens, sigue publicando lo que ya está escrito.

---

## Componentes

| Archivo | Trabajo | Depende de |
|---|---|---|
| `lib/publicar/facebook.ts` | Sube la foto a `{page}/photos` con `published=false` y crea el post en `{page}/feed` | Graph API |
| `lib/captions/componer.ts` | **Función pura**: slides → caption. Es el fallback | nada |
| `lib/captions/prompt.ts` | El prompt, como dato | nada |
| `lib/captions/gemini.ts` | Una llamada, un caption. Sin lógica de negocio | `@google/genai` |
| `lib/captions/cli.ts` | `npm run captions` — escribe en el archivo del mes | los tres de arriba |

`componer.ts` sin dependencias es lo que permite probar el fallback sin red y sin
clave. `prompt.ts` como dato es lo que permite probar el prompt sin llamar a
Gemini.

`lib/piezas/validar.ts` no cambia de responsabilidad: valida el
`facebook.caption` con las mismas reglas de hechos, precios y afirmaciones
prohibidas que ya aplica al de Instagram. Un caption que invente un precio o diga
«recordatorios por WhatsApp» rompe el build, venga de Gemini o de un teclado.

### Publicar en la página son dos pasos

Verificado en el documento de investigación:

1. `POST {page-id}/photos` con `published=false` → devuelve un `media_fbid`.
2. `POST {page-id}/feed` con `attached_media[0]={"media_fbid":"..."}`.

Igual que en Instagram, la imagen necesita **URL pública**: la sirve
`public/piezas/` del propio sitio, que es la razón por la que los PNG viven
versionados. `urlPublica()` en `meta.ts:25` ya la construye y se reutiliza.

El token va **en el cuerpo, nunca en la URL**, por la misma razón que en
`meta.ts:35`: así no acaba en logs ni en historiales.

### El formato del caption compuesto

`componer.ts` recorre las slides y emite, por cada una, el titular en una línea y
la bajada debajo, separadas por línea en blanco. Si la slide trae `dato`, el
valor y la etiqueta se anexan al titular. Cierra con la URL canónica del producto
según `catalogo.ts`. Sin hashtags.

Sobre `crm-no-chatbot`, que ya existe, produce:

```
No es un chatbot
Y la diferencia se nota el día que tienes 40 conversaciones abiertas.

Un bot contesta y ya
Resuelve la pregunta del momento. Mañana no recuerda quién era esa
persona ni qué quería.

Un CRM recuerda
Cada conversación es un cliente con historial, etapa y siguiente paso.
Sabes a quién llamar sin buscar en el chat.

Qué incluye
Inbox centralizado, pipeline en Kanban, ficha de cliente, reportes e
integraciones. El bot es una parte.

Pruébalo un mes — $14.99 al mes
Sin tarjeta para empezar.

pukadigital.com/agentes-ia
```

Es legible y publicable tal cual. Gemini existe para mejorarlo, no para
rescatarlo.

### Qué modelo

**Gemini 3.x Flash, el más reciente disponible.** Verificar el ID exacto al
implementar: la familia se mueve rápido y ya iba por la 3.8 el 2 de septiembre de
2026.

No 2.5 Pro, aunque fuera la idea inicial. Es de marzo de 2025 y Gemini 3 Flash lo
supera en AIME 2025, GPQA, Humanity's Last Exam, SimpleQA y SWE-Bench a una
fracción del precio. Es mejor *y* más barato.

⚠️ El coste **no es un criterio aquí** y no debe usarse para decidir. A ~9
captions al mes, la diferencia entre el modelo más caro y el más barato es de
centavos. Decide la calidad.

⚠️ La clave vive en `API_KEY` —el nombre no dice que es de Gemini, y por eso se
avisa aquí—, la misma que ya usa `lib/genai.ts`.

---

## Modelo de datos

```typescript
export type Pieza = {
  // ...lo que ya hay
  /**
   * Facebook. Si falta el bloque entero, la pieza igual se publica: el caption
   * se compone desde las slides y la hora cae a las 18:00 del mismo día.
   */
  facebook?: {
    caption?: string;
    publicarEl?: string;
  };
};
```

La pieza es el **tema**; Instagram y Facebook son destinos de ese tema. Un solo
archivo por mes, un solo validador, una sola comprobación de hechos.

⚠️ `Pieza.caption` es implícitamente el de Instagram. No se renombra: tocarlo
obligaría a reescribir las 7 piezas de septiembre para no ganar nada. Queda
documentado en `tipos.ts`.

Se descartó una entidad `PublicacionFacebook` aparte —duplicaría validación y
catálogo para ganar flexibilidad que no se necesita— y un array `canales`
genérico, que es la opción que parece elegante y que YAGNI descarta: hoy son dos
canales y el tercero, TikTok, es manual por decisión ajena.

---

## Manejo de errores

| Fallo | Qué pasa |
|---|---|
| Gemini se cae al escribir | El PR no se escribe. La publicación no se entera: el LLM no está en ese camino |
| Pieza con `publicarEl` y sin caption de Facebook | **`piezas --check` falla y rompe el build.** Se detecta en el PR, no en producción |
| Ese caso llega a producción igual | `componer.ts` genera el texto. Pasa por `validar.ts` como cualquier otro |
| Facebook rechaza la foto o el post | Se registra y se sigue con la siguiente pieza. Instagram no se ve afectado |
| Riesgo de publicar dos veces | `yaPublicada()` pregunta a la página por los captions recientes. Funciona porque el texto es fijo en el archivo |

⚠️ El fallback **no debería activarse nunca**. Existe para el despiste, no como
puerta trasera: por eso `--check` falla antes, y por eso el texto compuesto pasa
por el mismo validador. Un fallback que publique texto sin revisar sería peor que
no publicar.

---

## Testing

Todo lo nuevo es puro o inyectable, siguiendo el patrón que `meta.ts` ya usa con
`fetchImpl`.

| Qué | Cómo |
|---|---|
| `componer.ts` | Casos fijos entrada→salida. Sin red |
| `prompt.ts` | Que incluya los precios del catálogo y las afirmaciones prohibidas |
| `facebook.ts` | `fetchImpl` falso: los dos pasos en orden, el token en el cuerpo y no en la URL, y que el fallo de una pieza no arrastre al resto |
| `programado.ts` | Que la franja de las 18:00 seleccione Facebook y la de las 09:00 Instagram |

### Evals del prompt

Las 7 piezas de septiembre son los casos de oro. El caption generado debe:

1. No contener ningún precio que no esté en `catalogo.ts`.
2. No contener ninguna afirmación de `prohibidas.ts` — «recordatorios por
   WhatsApp», «cualquier especialidad», «sincronización bidireccional».
3. Diferir del caption de Instagram de la misma pieza.
4. No llevar hashtags.
5. Pasar `validar.ts` sin errores.

Las cinco son comprobables por código: son evals de verdad, no lectura a ojo.

---

## Las capturas de producto

El sistema ya está construido: se deja el PNG en `assets/capturas/` y se pone
`captura: 'nombre.png'` en la slide. `capturas.ts:44` la embebe en base64 —Satori
no lee rutas de disco— y la plantilla le estampa el aviso de datos ficticios
**siempre, sin bandera para quitarlo**.

Hoy hay una sola: `validar-receta.png`, en la slide 4 de `podologo-no-receta`.
Sacar más es trabajo manual y **no bloquea nada de este spec**.

Cuatro reglas al producirlas, todas con historia detrás:

1. **Solo podología.** Es la única especialidad implementada en `SistemaSalud`.
   Otra especialidad muestra el formulario genérico y la pieza pasa a ser falsa.
2. **Nombres inventados**, no pacientes reales medio anonimizados.
3. **Revisar el encuadre.** A este proyecto ya se le colaron el dock de macOS y
   una ruta con nombres de archivo reales.
4. El aviso va en **cada slide** que muestre pantalla. Eso es lo que costó un
   video retirado en YouTube con la apelación rechazada, y por eso la plantilla
   no deja apagarlo.

---

## Arranque

Los 7 carruseles de septiembre se republican en Facebook, uno al día en la franja
de las 18:00. Es contenido ya probado en Instagram: da inercia inmediata a una
página que hoy no publica y produce el primer dato de alcance comparable entre
las dos redes, sin producir nada nuevo.

---

## Lo que este spec NO cubre

- **Reels y video.** HyperFrames, TTS y el guion son otra spec.
- **TikTok.** Manual por decisión de TikTok, que excluye este caso de uso de su
  API. El único requisito que deja sobre el diseño de video es que el MP4 quede
  en disco, en 9:16 y sin marca de agua.
- **Métricas para decidir la pauta.** La Graph API da `insights` por post con el
  mismo token, pero `ECOSISTEMA_ADS.md` fija la pauta en el mes 5. Se recogen
  datos ahora; se decide después.
- **Que un agente redacte las piezas del mes.** Es la fase 2 de la fábrica. Este
  spec solo automatiza el caption de Facebook, que es un texto derivado de datos
  ya escritos y revisados.

---

## Fuentes

Además de las de `docs/PUBLICAR_EN_FACEBOOK.md`:

- [Changelog de la API de Gemini](https://ai.google.dev/gemini-api/docs/changelog) — modelos vigentes y retiradas
- [Gemini 2.5 Pro vs Gemini 3 Flash](https://llm-stats.com/models/compare/gemini-2.5-pro-vs-gemini-3-flash-preview)
- [Gemini 3 Flash — Simon Willison](https://simonwillison.net/2025/Dec/17/gemini-3-flash/)
