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
| Cuándo | Facebook en la franja siguiente a la de Instagram. Nunca por hora fija |
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

### Por qué la franja siguiente, y no una hora fija por red

⚠️ **Este punto se diseñó mal en el primer borrador y lo corrigió un contraste
con `agy`.** Queda escrito porque el error es fácil de repetir.

El borrador decía «Instagram a las 09:00, Facebook a las 18:00», dando por hecho
que las 09:00 eran la franja de Instagram y las 18:00 estaba libre. **Es falso.**
`vercel.json` corre el cron a las dos horas, pero son **dos oportunidades de
publicación**, no dos canales: cada pieza elige la suya en su `publicarEl`. De las
7 piezas de septiembre, **3 publican en Instagram a las 18:00**:

| Pieza | `publicarEl` |
|---|---|
| `podologo-no-receta` | `2026-09-02T18:00` |
| `crm-no-chatbot` | `2026-09-10T18:00` |
| `requisitos-facturar-sri` | `2026-09-17T18:00` |

Atar cada red a una hora fija rompía las dos direcciones: esas 3 no habrían salido
nunca en Instagram, y las otras 4 —las de las 09:00— no habrían llegado nunca a
Facebook, porque al correr el cron de las 18:00 llevarían 540 minutos de retraso y
`VENTANA_MINUTOS` son 90.

**La regla correcta no mira la hora, mira la pieza.** Cada corrida del cron revisa
las dos redes y publica lo que esté en ventana, cada una según su propia fecha:

- Instagram usa `publicarEl`, como hoy.
- Facebook usa `facebook.publicarEl`. Si falta, cae a **la franja siguiente**:
  una pieza de Instagram de las 09:00 sale en Facebook a las 18:00 del mismo día;
  una de las 18:00 sale a las 09:00 del día siguiente.

🔴 **La franja siguiente puede caer en el mes que viene, y ahí se pierde.** El cron
carga **un solo archivo**, el del mes actual (`route.ts:15,44`):

```typescript
function mesDe(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
}
piezas = (await import(`@/content/piezas/${mes}`)).default;
```

Una pieza que sale en Instagram el **30 a las 18:00** tiene su Facebook el **1 a las
09:00**. Ese día el cron carga `2026-10.ts`, donde esa pieza no está: **la
publicación se pierde en silencio**, sin error y sin rastro.

**Solución:** en cada corrida, cargar el mes actual **y el anterior**, y unir las
listas. Es barato —un `import()` más, con el mismo `catch` que ya tolera un mes sin
archivo— y cierra el agujero sin tocar el formato de los datos. Los ids solo tienen
que ser únicos dentro de su mes, y `--check` ya los valida así (`cli.ts`), de modo
que unir dos meses no introduce colisiones nuevas.

⚠️ **Y `mesDe()` usa `getUTCMonth()`, no la hora de Ecuador.** Hoy no muerde porque
los dos crons (14:00 y 23:00 UTC) caen dentro del mismo día UTC, incluso con los 59
minutos de retraso de Vercel Hobby. Al migrar a Workers o al añadir franjas sí
mordería. Cargar dos meses lo vuelve inocuo, pero conviene saberlo.

Se conserva el escalonado —que era el objetivo— sin hora fija por red, sin franjas
nuevas y sin romper ninguna pieza existente.

---

## Por qué va después de Cloudflare

Facebook se construye dentro de la lógica que la migración mueve. Construirlo en
Vercel y migrarlo después es hacer el mismo trabajo dos veces.

⚠️ **Y el destino importa, no solo el momento.** Cloudflare no dispara rutas HTTP:
invoca un handler `scheduled()`. La spec de migración extrae la lógica de
`app/api/cron/publicar/route.ts` a **`lib/publicar/tanda.ts`**
(`publicarLoQueToca`), con dos llamadores: el `scheduled()` del Worker y la ruta
HTTP. **Facebook va en `tanda.ts`.** Implementarlo en la ruta HTTP dejaría los
crons desatendidos de Cloudflare sin publicar nunca en Facebook.

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
        └─ IMPRIME los bloques facebook: { ... } por pantalla
           └─ los pegás en content/piezas/2026-10.ts
              └─ npm run piezas -- --check valida hechos, precios y topes
                 └─ pull request ← revisión humana. La puerta de calidad está aquí.

  PUBLICACIÓN — cron, determinista, sin IA y sin clave de API
     cada corrida revisa LAS DOS redes y publica lo que este en ventana
     ├─ Instagram (publicarEl):          carrusel 5 slides + caption
     └─ Facebook  (facebook.publicarEl): slide 1 en 4x5 + facebook.caption
                                          └─ sin fecha → la franja siguiente
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
| `lib/captions/cli.ts` | `npm run captions` — **imprime** los captions. No escribe en el archivo del mes | los tres de arriba |

`componer.ts` sin dependencias es lo que permite probar el fallback sin red y sin
clave. `prompt.ts` como dato es lo que permite probar el prompt sin llamar a
Gemini.

⚠️ **`lib/piezas/validar.ts` sí cambia, y el primer borrador decía lo contrario.**
Afirmaba que el validador «ya aplica» reglas de precios y afirmaciones prohibidas
a los captions. No es cierto:

| Qué se valida hoy | Sobre qué | Dónde |
|---|---|---|
| Afirmaciones prohibidas | El caption, **solo si `producto === 'pukahealth'`** | `validar.ts:87` |
| Precios y ofertas | **Solo `textos(slide)`** — el arte, nunca el caption | `validar.ts:150,158` |

Es decir: **hoy un caption puede inventar un precio y el build pasa.** Ya es un
hueco con el caption de Instagram escrito a mano; con uno escrito por un LLM sería
temerario.

Este spec lo cierra, **pero solo hasta donde debe**:

| Regla | Se extiende al caption | ¿Para todos los productos? |
|---|---|---|
| Precios y ofertas | **Sí** | **Sí** |
| Afirmaciones prohibidas | **Sí** | **No: solo PukaHealth**, como hoy |

⚠️ **Generalizar las prohibiciones a todos los productos sería un error**, y el
primer intento de corrección lo cometió. La lista de `prohibidas.ts` es médica y
específica de PukaHealth: «sincronización bidireccional» es falso ahí y **cierto**
en LedgerXpertz, que sí sincroniza con una tienda. `validar.ts:141` lo comenta
—«en los demas productos estas frases pueden ser ciertas»— y `hechos.test.ts:130`
lo prueba a propósito. Ese test debe seguir en verde.

⚠️ **Y hay un límite estructural que el plan tiene que resolver:** `validar.ts:138`
hace `if (!producto) return;`. Las piezas sin `producto` —`requisitos-facturar-sri`
es una— **no validan ningún hecho hoy**. Al llevar la validación al caption hay que
decidir si esas piezas siguen exentas o si un precio en su caption debe romper el
build. Este spec dice que **sí debe romperlo**: un precio es un precio, lo diga la
pieza que lo diga.

Un caption que invente un precio o que diga «recordatorios por WhatsApp» en una
pieza de PukaHealth rompe el build, venga de Gemini o de un teclado.

### Publicar en la página son dos pasos

Verificado en el documento de investigación:

1. `POST {page-id}/photos` con `published=false` → devuelve un `media_fbid`.
2. `POST {page-id}/feed` con `attached_media[0]={"media_fbid":"..."}`.

Igual que en Instagram, la imagen necesita **URL pública**: la sirve
`public/piezas/` del propio sitio, que es la razón por la que los PNG viven
versionados. `urlPublica()` en `meta.ts:25` ya la construye y se reutiliza.

El token va **en el cuerpo, nunca en la URL**, por la misma razón que en
`meta.ts:35`: así no acaba en logs ni en historiales.

### `yaPublicada()` no se reutiliza tal cual

El primer borrador decía que la función actual sirve para Facebook. No sirve, por
dos motivos independientes:

**1. Compara el campo equivocado.** `programado.ts:41` hace `if (!pieza.caption)` y
compara contra `pieza.caption` — el de Instagram, con hashtags y otra redacción. El
texto que sale en Facebook es `facebook.caption` o el compuesto. Reutilizarla sin
tocar devolvería siempre `false` y **anularía la defensa entera, en silencio**. Hay
que parametrizar qué texto se compara.

**2. El campo de la Graph API es otro.** El cron pide hoy `fields=caption` contra
`{ig-user-id}/media`, y para Instagram es correcto. En posts de **página** el texto
está en **`message`**: `caption` quedó **obsoleto para page posts desde la v3.3**, y
cuando existía significaba otra cosa — la leyenda de un enlace, no el cuerpo del
post. Pedir `fields=caption` contra `{page-id}/posts` da
`#100 Tried accessing nonexisting field`.

⇒ Facebook consulta `{page-id}/posts?fields=message`.

### El formato del caption compuesto

`componer.ts` recorre las slides y emite, por cada una, el titular en una línea y
la bajada debajo, separadas por línea en blanco. Si la slide trae `dato`, el
valor y la etiqueta se anexan al titular. Sin hashtags.

⚠️ **Dos trampas al cerrar con la URL**, las dos verificadas contra el código:

1. **`producto` es opcional** (`tipos.ts:39`): las piezas de utilidad, que no
   venden nada, lo omiten. `requisitos-facturar-sri` es una de ellas — 1 de las 7
   de septiembre. Buscar `CATALOGO[pieza.producto]` a ciegas revienta con
   `Cannot read properties of undefined`. Sin producto se cierra con
   `pukadigital.com` a secas.
2. **`catalogo.ts` guarda rutas relativas**, no dominios: `url: '/agentes-ia'`.
   Hay que anteponer el dominio.

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

### 🔴 Por qué el CLI imprime y no escribe

**El archivo del mes no es JSON: es TypeScript con cosas que se perderían.** Tiene
`import type { Pieza }`, un bloque JSDoc con las reglas editoriales, separadores de
fecha (`// ─── jueves 3 · la casa ───`), comentarios dentro de los objetos —«De la
competencia, no nuestros»— y captions como concatenaciones multilínea.

Las dos formas obvias de escribirlo automáticamente fallan:

| Cómo | Qué rompe |
|---|---|
| Importar el módulo y volver a serializarlo | Borra **todos** los comentarios y el formato. El archivo deja de ser legible |
| Insertar con expresiones regulares | Frágil ante cualquier variación de formato; un fallo produce TypeScript inválido |

Escribirlo bien pediría un manipulador de AST que preserve formato —`ts-morph` o
`recast`—, y **no hay ninguno en `package.json`**: solo `typescript`.

⇒ **El CLI imprime los bloques por pantalla y se pegan a mano.** Son entre 2 y 9 al
mes. No merece una dependencia de peso, y encaja con el diseño: el PR ya es la
puerta de revisión, así que vas a leer esos textos de todas formas. Pegarlos **es**
la revisión.

Es la misma lógica que ya gobierna la fábrica: la tubería no toca el contenido; el
humano decide qué entra en git.

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
   * se compone desde las slides y la fecha cae a la franja siguiente a la de
   * Instagram — 09:00 → 18:00 del mismo día; 18:00 → 09:00 del día siguiente.
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
| Pieza que **declara** `facebook` con `publicarEl` pero sin `caption` | **`piezas --check` falla y rompe el build.** Se detecta en el PR |
| Pieza que **no declara** `facebook` en absoluto | Válida. `componer.ts` genera el texto y la fecha cae a la franja siguiente |
| Ese caso llega a producción igual | `componer.ts` genera el texto. Pasa por `validar.ts` como cualquier otro |
| Facebook rechaza la foto o el post | Se registra y se sigue con la siguiente pieza. Instagram no se ve afectado |
| Riesgo de publicar dos veces | `yaPublicada()` pregunta a la página por los captions recientes. Funciona porque el texto es fijo en el archivo |

⚠️ **El primer borrador se contradecía aquí y lo corrigió un contraste con `agy`.**
Decía a la vez que `--check` falla si una pieza con `publicarEl` no tiene caption de
Facebook, y que las 7 piezas de septiembre funcionan sin tocarlas. Las dos no pueden
ser ciertas: ninguna de las 7 declara `facebook`, así que `prebuild`
—`piezas --check && npm test && tsc --noEmit`, en `package.json:7`— habría roto el
build del repositorio entero en cuanto se añadiera la regla.

**La regla que sí funciona distingue el descuido de la ausencia.** Un bloque
`facebook` a medias —con fecha y sin texto— es un descuido y rompe el build. No
declararlo es una elección válida: el compositor actúa y la pieza sale igual.

El fallback existe para el despiste, no como puerta trasera, y por eso el texto
compuesto pasa por el mismo validador. Un fallback que publique texto sin revisar
sería peor que no publicar.

---

## Testing

Todo lo nuevo es puro o inyectable, siguiendo el patrón que `meta.ts` ya usa con
`fetchImpl`.

**Línea base medida el 2026-09-07: `npm test` da 71 pasando, 0 fallando, en 2,4 s.**
Es contra ese número que se compara cualquier ejecución. (`docs/ESTADO_2026-09-04.md`
dice «14/14»: está desactualizado.)

| Qué | Cómo |
|---|---|
| `componer.ts` | Casos fijos entrada→salida. Sin red |
| `prompt.ts` | Que incluya los precios del catálogo y las afirmaciones prohibidas |
| `facebook.ts` | `fetchImpl` falso: los dos pasos en orden, el token en el cuerpo y no en la URL, y que el fallo de una pieza no arrastre al resto |
| `programado.ts` | Que **las 3 piezas de septiembre con `publicarEl` a las 18:00 sigan saliendo en Instagram**, y que las 4 de las 09:00 lleguen a Facebook. Es el caso que el primer diseño rompía |
| `yaPublicada()` | Que compare el texto de Facebook y no el de Instagram. Un test que la llame con el caption de Instagram debe dar `false` |
| **Tests que hay que adaptar** | `programado.test.ts:64-67` llama a `yaPublicada(pieza, [...])` con la firma vieja: al parametrizarla dejan de compilar. `hechos.test.ts:130` debe seguir **en verde** — es el que prueba que las prohibiciones no salen de PukaHealth |
| Fin de mes | Una pieza con `publicarEl` el día 30 a las 18:00 debe publicarse en Facebook el 1 del mes siguiente. Es el caso que se pierde si el cron carga un solo mes |

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

Los 7 carruseles de septiembre se republican en Facebook, uno al día. Es contenido
ya probado en Instagram: da inercia inmediata a una página que hoy no publica y
produce el primer dato de alcance comparable entre las dos redes.

⚠️ **Sí hay que tocar `content/piezas/2026-09.ts`**, y el primer borrador decía que
no. Ninguna de las 7 declara `facebook`, así que hay que añadirles el bloque con su
fecha. Es un commit único y acotado, no trabajo recurrente — pero conviene no
prometer lo contrario.

El caption de esas 7 puede salir de Gemini o del compositor; las dos opciones son
válidas y la decisión no bloquea nada de este diseño.

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
