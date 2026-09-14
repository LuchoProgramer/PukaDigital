# Reels con más movimiento — diseño

Fecha: **2026-09-14**. Estado: 🟡 **en diseño, a medias.** Las partes 1 y 2 están
aprobadas; la 3 y la 4 son propuestas **sin aprobar**. Se retoma en la próxima
sesión por la parte 3.

Continúa la spec de los Reels (`2026-09-13-reels-hyperframes-design.md`): allí se
decidió **qué** es un Reel; aquí, **cómo se mueve**. La investigación, con sus
fuentes, está en `docs/VIDEO_CON_HYPERFRAMES.md` → «Movimiento».

---

## Cómo retomarlo

1. Leer las partes 1 y 2: son lo decidido y no se reabren.
2. Aprobar o corregir la **parte 3** (el campo `foco`) y la **parte 4** (las pruebas).
3. Resolver las **preguntas abiertas** del final antes de escribir el plan.
4. Entonces, el plan: `docs/superpowers/plans/<fecha>-reels-movimiento.md`, con
   la fecha del día en que se escriba.

Las demos que se usaron para decidir viven en `.superpowers/brainstorm/`, fuera de
git: son locales y no hacen falta para retomar. Los números de abajo son los suyos.

---

## Por qué

El primer Reel —`crm-no-chatbot`, publicado el 14/09— funciona, pero son
tarjetas con **una sola animación por escena**: el bloque entero sube 60 px en
0,5 s (`lib/reels/composicion.ts`, el `tl.fromTo` de cada `#c{i}`) y después
nada. Entre escenas no hay transición, mientras habla Dora la imagen está
quieta, el dato aparece ya escrito y los subtítulos se encienden y se apagan.

La guía oficial de HyperFrames lo dice sin rodeos: *«Every composition uses
transitions. No exceptions. Scenes without transitions feel like jump cuts.»*

Luis lo pidió así: *«solo un poco más dinámicos»*.

---

## Alcance

Se eligió entre tres niveles:

| | Qué | |
|---|---|---|
| **A** | Misma estructura —una escena por slide—, con más vida | ✅ **elegido** |
| **B** | Escenas distintas según el papel de la slide: gancho, prueba, cierre | 🔜 el código queda preparado |
| **C** | Movimiento antes que texto, sin tarjetas, al estilo reelforge | ❌ es otro proyecto |

**Dentro:** transición entre escenas, entrada por elemento, contador en el dato,
movimiento de la captura con el campo opcional `foco`, subtítulos con entrada,
fondo con vida, y la energía distinta de cada sistema visual.

**Fuera:** WebGL y shaders, música, karaoke —pide transcribir la voz, ver
abajo—, instalar piezas del catálogo de HyperFrames, y la opción B en sí.

**No cambia:** la voz, `tiempos.ts`, los grupos de subtítulos, los colores de
cada sistema, el aviso de datos ficticios, `producir.ts`, R2, Telegram ni la
publicación.

---

## Las decisiones, y lo que se descartó

Cada una se eligió **viéndola animada** en el navegador, con piezas reales.

| Qué | Elegido | Descartado, y por qué |
|---|---|---|
| Paso de escena | **Zoom a través**, en todos los cambios y sin acento | Empuje vertical (se dudó entre los dos) · barrido rojo, el que más cansa. Con 4 cambios por Reel, una sola transición no llega a cansar; el acento se añade si hace falta al verlo con voz |
| El dato | **Contador** | Rodillo · golpe. Ver «Riesgo aceptado» |
| La captura | **Zoom lento por defecto, foco si la slide lo marca** | Tarjeta en 3D: para PukaHealth grita demasiado |
| Subtítulos | **Frase que salta** | Palabra a palabra · karaoke. Los dos necesitan el tiempo de cada palabra, y la fábrica lo estima por el largo: palabra por palabra, el desfase de décimas se vería. Hacerlos bien pide transcribir la voz, un paso más por Reel |
| PukaHealth | **La misma familia, tranquila** | Igual que la casa. La guía oficial pide 0,5–0,8 s con `sine` para contenido calmado, y `ARQUITECTURA.md` lo dice: «un consultorio no vende gritando» |

### ⚠️ Riesgo aceptado: el contador enseña precios que no existen

Durante el conteo aparecen valores intermedios —$7.42 al mes, $11.30—, y un
fotograma pausado o una captura de pantalla puede atraparlos. Se recomendó el
golpe, que nunca muestra otro número que el real, y **Luis eligió el contador**.

Se acota así: el conteo dura **1 s como máximo**, y el último fotograma es el
`valor` **literal** de la pieza, el mismo que valida `catalogo.ts`.

---

## Parte 1 — Qué se mueve y cómo · ✅ aprobada

| Elemento | La casa (`puka`) | PukaHealth (`health`) |
|---|---|---|
| Salida de escena | 0,3 s `power2.in`: se acerca a ×1,4 y desenfoca 30 px | 0,4 s `sine.in`: ×1,12, 14 px |
| Entrada de escena | 0,4 s `power2.out`, desde ×0,8 y 30 px | 0,8 s `sine.out`, desde ×0,94 y 14 px |
| Titular | palabra por palabra, cada una sube desde `yPercent: 115` dentro de su máscara · 0,6 s `back.out(1.4)`, 0,08 s entre palabras | 0,7 s `power3.out`, 0,1 s entre palabras, sin rebote |
| Badge | espaciado de 0,5 em a 0,08 em · 0,7 s `expo.out` | igual |
| Bajada | sube 40 px y aparece · 0,6 s `power2.out`, 0,4 s tras la entrada | igual |
| Dato | contador ≤ 1 s `power2.out`, 0,55 s tras la entrada, y un pulso a ×1,12 de 0,12 s ida y vuelta | igual |
| Captura | la tarjeta sube 60 px y aparece; luego **zoom lento** de ×1 a ×1,15 hasta el final de la escena, sin easing, origen en `30% 60%` | igual |
| Captura con `foco` | a los 2 s de empezar la escena, 1,1 s `power3.inOut` hasta centrar el foco a su escala, sin salirse del marco | igual |
| Subtítulos | cada grupo entra desde ×0,7 y 30 px · 0,22 s `back.out(2.2)`; se apaga de golpe al terminar, como hoy | rebote más suave — **sin demo**: fijar en el render |
| Fondo | brillo del acento que deriva despacio | el azul, más tenue |
| Mientras habla | el contenido crece de ×1 a ×1,05 durante la escena | hasta ×1,025 |

Los tiempos de la voz y de los subtítulos no se tocan: salen de `tiempos.ts` como
hoy. Lo nuevo solo decide **cómo** entra cada cosa en el momento que ya tenía.

### Cuatro ajustes que salen del código, no de las demos

**1. La salida nunca dura más que la pausa.** Entre dos párrafos Dora respira
exactamente `PAUSA_ENTRE_ESCENAS` = 0,4 s. La demo de PukaHealth salía en 0,6 s y
se habría comido el final de la frase: queda en 0,4 s, y la entrada sube a 0,8 s
para que se siga sintiendo tranquila. **Es una regla, con test:** para todo
sistema, `salida ≤ PAUSA_ENTRE_ESCENAS`.

**2. Los subtítulos no se acercan ni desenfocan.** La transición y la
respiración van sobre el contenido (`#c{i}`); el subtítulo es hermano, no hijo,
y se queda quieto. Si no, la última frase de cada escena se leería borrosa.

**3. El contador no usa `onUpdate`.** Se hace como el componente oficial
`count-up` de HyperFrames: el valor de **cada fotograma** (30 por segundo) se
calcula en Node al componer y se fija con
`tl.set(el, { textContent: '…' }, t)`. El render salta de fotograma en
fotograma, y así cada salto muestra siempre lo mismo. Además:

- Respeta los decimales del literal: `$14.99` cuenta con dos, `7` con enteros.
- El prefijo y el sufijo quedan fijos: cuenta el número, no el `$`.
- **El último fotograma es el `valor` literal**, no un número formateado.
- Si el valor no es un número limpio —`24/7`, `1,200`—, entra sin contar.

**4. El brillo no inventa colores.** Hay un test que exige que todo color del
HTML salga de los tokens del sistema, del aviso o del vidrio de video, y se
queda. El brillo se pinta con el **hex del acento** y la opacidad del elemento
(0,30 en la casa, 0,10 en PukaHealth), no con un `rgba` nuevo.

---

## Parte 2 — Arquitectura · ✅ aprobada

Hoy `composicion.ts` hace tres cosas: el HTML, el CSS y la línea de tiempo. El
movimiento sale a su propio módulo.

| Archivo | Qué hace | |
|---|---|---|
| `lib/reels/movimiento.ts` | La **energía** de cada sistema (`Record<Sistema, Energia>`: duraciones, escalas, desenfoque, easings) y **una función por elemento** —transición, titular, badge, bajada, dato, captura, subtítulos, respiración, brillo— que devuelve sus líneas de la línea de tiempo | **nuevo** |
| `lib/reels/contador.ts` | Parte `$14.99` en prefijo, número, decimales y sufijo, y calcula el valor de cada fotograma con su curva | **nuevo** |
| `lib/reels/composicion.ts` | Sigue con el HTML y el CSS. El marcado cambia poco: cada palabra del titular en su máscara, la captura dentro de un marco, la capa del brillo. Los pasos se los pide a `coreografia()` | cambia |
| `lib/piezas/tipos.ts` · `validar.ts` | El campo `foco` y su validación — parte 3 | cambia |

### Dónde queda preparada la opción B

`movimiento.ts` expone **una sola función que decide**:
`coreografia(pieza, escenas)`. Hoy elige por lo que trae cada slide: con dato,
el contador; con captura, zoom lento o foco. La opción B se escribirá **solo ahí
dentro** —otras animaciones según el papel de la slide—, sin tocar
`composicion.ts` ni las funciones por elemento, que ya tendrán sus tests.

### Límites que no se mueven

- **Sin dependencias nuevas.** El mismo `gsap.min.js` como archivo, sin WebGL.
  Del catálogo de HyperFrames se **reimplementan técnicas**, no se copia código.
- **Sin `Math.random()`, sin callbacks, sin `repeat: -1`.** Todo es `set`,
  `fromTo` o `to` con tiempos literales dentro de la línea de tiempo registrada;
  el brillo, con repeticiones finitas que cubren `total`. `render --strict`
  tiene que seguir pasando.
- **Nada de esto entra al Worker.** `lib/reels/` sigue fuera de su bundle y
  `frontera.test.ts` se queda. Lo único compartido es el tipo `foco` y su
  validación, que no importan nada de `lib/reels/`.

---

## Parte 3 — El campo `foco` · 🟡 propuesta, sin aprobar

Un campo opcional en la slide, **solo con sentido si hay `captura`**:

```typescript
{
  titular: 'Lo correcto: indicaciones',
  captura: 'validar-receta.png',
  foco: { x: 0.30, y: 0.63, escala: 2 },  // el pie naranja del documento
}
```

- `x`, `y`: el punto a centrar, en **fracciones de la imagen** (0 a 1), para que
  no dependa del tamaño en píxeles.
- `escala`: opcional, 2 por defecto, entre 1,2 y 3.
- El encuadre **nunca se sale de la imagen**: si el punto está cerca del borde,
  se para en el borde.
- El carrusel lo ignora: es solo del Reel.

**`piezas --check` rechazaría:** `foco` sin `captura`, `x` o `y` fuera de 0–1, y
una `escala` fuera de rango.

A decidir: si vive en la slide, como arriba, o dentro del bloque `reel`.

---

## Parte 4 — Pruebas · 🟡 propuesta, sin aprobar

**Tests unitarios**, con `node:test` como el resto:

- El último fotograma del contador es el `valor` **literal**; `7` cuenta en
  enteros y `$14.99` con dos decimales; `24/7` no cuenta.
- Para todo sistema, `salida ≤ PAUSA_ENTRE_ESCENAS`.
- La transición termina justo donde empieza la escena siguiente.
- Los subtítulos no están dentro de lo que se acerca.
- El aviso nunca aparece separado de su captura: los dos entran juntos y el
  aviso **no** está dentro del marco que se acerca.
- El foco no deja ver fuera de la imagen.
- Los tests actuales que siguen valiendo: colores de los tokens, nada remoto,
  GSAP como archivo, escapado del texto.

**Un render de verdad antes de dárselo a `agy`**, como el paso 0 del plan 2, que
encontró cuatro fallos que ningún test veía. Mirar en concreto:

1. Que `render --strict` pase con todo lo nuevo.
2. **Cuánto tarda** con `filter: blur()` a 1080×1920 en cada fotograma.
3. **Si el brillo hace bandas** tras la compresión H.264: el vidrio de 0,04 ya
   desapareció al pasar a video (`VIDRIO_VIDEO`).
4. Que el contador se vea bien saltando de fotograma en fotograma.

**Mutaciones**, como en los planes 1 y 2 — ver `METODO_AGENTES_PARALELOS.md`.

**Y verlo en el teléfono, con sonido,** antes de mergear.

---

## Preguntas abiertas, para antes del plan

- 🔴 **La portada del Reel sale negra.** Luis lo confirmó el 14/09 con
  `crm-no-chatbot`. La publicación no fija portada (`lib/publicar/meta.ts`,
  `facebook.ts`), y el fotograma 0 tiene el contenido con opacidad 0. Con las
  entradas nuevas seguiría igual. Lo que ofrece Meta, leído en su documentación
  el 14/09:

  | | Cómo | Límites |
  |---|---|---|
  | Instagram | `thumb_offset` en el contenedor: el milisegundo del fotograma. **Por defecto 0**, el primero | — |
  | Instagram | `cover_url` en el contenedor: una imagen por URL pública. Si van los dos, gana esta | JPEG, ≤ 8 MB, sRGB, 9:16 ideal |
  | Facebook | `POST /{video_id}/thumbnails` con `source` e `is_preferred=true`, **aparte** de las fases de `video_reels`, que no tienen parámetro de portada | el **archivo**, no una URL · ≤ 10 MB |

  Sin verificar: si el token de Página tiene los permisos que pide
  `/thumbnails` (`pages_read_user_content`, `pages_manage_engagement`,
  `pages_show_list`); si ese endpoint funciona con Reels —la guía de Reels lo
  enlaza para «añadir una portada», su referencia no lo dice—; y si la portada de
  Instagram se puede cambiar después de publicar: la documentación no lo menciona.

  **Dos caminos:**
  1. **Recomendado:** la fábrica saca con `ffmpeg` un fotograma del MP4 con el
     gancho entero, lo sube a R2 como `portada.jpg` junto al video, y la misma
     imagen sirve a las dos redes: `cover_url` en Instagram y `/thumbnails` en
     Facebook.
  2. **El más simple:** el fotograma 0 ya trae el titular. Arregla las dos redes
     sin tocar la API, y nadie ve un inicio en negro al hacer scroll; a cambio,
     la primera escena pierde su entrada.

  La portada del Reel ya publicado: `/thumbnails` en Facebook, si funciona con
  Reels; en Instagram, a mano en la app, si lo permite.
- **El rebote de los subtítulos en PukaHealth**: no se vio en demo.
- **Dónde vive `foco`**: parte 3.

---

## Lo que se aprendió en esta sesión

**La demo que compila puede no funcionar.** El servidor de demos del
brainstorming mete el HTML en su plantilla con `String.replace`, y ahí `$'`
significa «el resto de la plantilla»: un `'$' + precio` rompió el script, y
todo salía en negro. `node --check` sobre el archivo pasaba. **Verificar sobre la
página servida**, y en un Chrome que avance en tiempo real: con
`--virtual-time-budget`, GSAP no avanza y todo parece roto aunque no lo esté.
