# Reels con más movimiento: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **En este proyecto se ejecuta con `agy`, de a una task**, según
> `docs/METODO_AGENTES_PARALELOS.md`: `agy` escribe el código literal de
> UNA task; Claude corre los tests, comprueba las mutaciones y commitea.

**Goal:** Transformar las animaciones estáticas de los Reels (`lib/reels/`) en transiciones dinámicas y fluidas (zoom a través, titular palabra por palabra en máscara, contador numérico fotograma a fotograma, zoom lento/foco en capturas, brillo de fondo y rebote suave de subtítulos), asegurando que el fotograma 0 inicie visible para que la portada no salga negra en Instagram ni en Facebook.

**Architecture:** 
- Desacoplar la lógica de animación de `composicion.ts` a un nuevo módulo `movimiento.ts` (energía por sistema, coreografía) y `contador.ts` (cálculo determinista a 30 fps).
- Extender el tipo `Slide` con el campo opcional `foco` en `lib/piezas/tipos.ts` y validar con `piezas --check`.
- `composicion.ts` pasa a generar el marcado con máscaras y pide las líneas de tiempo GSAP a `coreografia()`.
- Ningún cambio en la API de publicación ni en el Worker: el fotograma 0 visible resuelve la portada por defecto en ambas redes.

**Tech Stack:** TypeScript estricto, `node --test` con `tsx`, HyperFrames 0.8.36, GSAP 3.14.2 en local, ffmpeg.

**Spec:** `docs/superpowers/specs/2026-09-14-reels-movimiento-design.md` (aprobada el 2026-09-19).

---

## Línea base

```bash
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)"   # ℹ tests 225 · ℹ pass 225 · ℹ fail 0
npx tsc --noEmit; echo "exit=$?"                   # exit=0
npm run piezas -- --check                          # 7 pieza(s) validas en 2026-09.
```

Al terminar: **~265 tests** (225 base + ~40 nuevos), `tsc` limpio, `render --strict` pasando y nada de `lib/reels/` dentro del bundle del Worker.

| Task | Qué hace | Tests nuevos | Acumulado estimado |
|---|---|---|---|
| 1 | Campo `foco` y validación en `lib/piezas/` | 6 | 231 |
| 2 | Módulo `contador.ts` determinista fotograma a fotograma | 8 | 239 |
| 3 | Módulo `movimiento.ts`: energías, funciones de elementos y coreografía | 16 | 255 |
| 4 | Integración en `composicion.ts`: marcado, máscaras y fotograma 0 visible | 8 | 263 |
| 5 | Render de ensayo, verificación del fotograma 0 y prueba visual | 2 | 265 |

---

## Task 1: Campo `foco` en el modelo y su validación

**Archivos:**
- Modifica: `lib/piezas/tipos.ts`
- Modifica: `lib/piezas/validar.ts`
- Modifica: `lib/piezas/validar.test.ts`

### Pasos

- [x] **1.1 Escribir los tests primero en `lib/piezas/validar.test.ts`:**
  - `foco` válido con `x`, `y` entre 0 y 1, y `escala` opcional entre 1.2 y 3 pasa la validación.
  - `foco` sin `captura` en la misma slide es rechazado con mensaje descriptivo.
  - `foco` con `x < 0` o `x > 1` o `y < 0` o `y > 1` es rechazado.
  - `foco` con `escala < 1.2` o `escala > 3` es rechazado.

- [x] **1.2 Extender los tipos en `lib/piezas/tipos.ts`:**
  ```typescript
  export interface FocoCaptura {
    x: number;      // 0 a 1 (fracción del ancho)
    y: number;      // 0 a 1 (fracción del alto)
    escala?: number; // 1.2 a 3 (por defecto 2)
  }
  ```
  Y añadir `foco?: FocoCaptura;` a `Slide`.

- [x] **1.3 Implementar la validación en `lib/piezas/validar.ts`:**
  - Si `slide.foco` existe:
    - Exigir que `slide.captura` esté definido.
    - Exigir `0 <= slide.foco.x <= 1` y `0 <= slide.foco.y <= 1`.
    - Si `slide.foco.escala` está definido, exigir `1.2 <= slide.foco.escala <= 3`.

- [x] **1.4 Verificar:**
  ```bash
  npm test lib/piezas/validar.test.ts
  npm run piezas -- --check
  npx tsc --noEmit
  ```

- [x] **1.5 Mutación:**
  - Comentar la comprobación de `x > 1` → el test correspondiente debe fallar.
  - Comentar la comprobación de `slide.captura` → el test correspondiente debe fallar.

- [x] **1.6 Commit:**
  `feat(piezas): campo foco para capturas en slides y validacion`

---

## Task 2: Contador numérico determinista fotograma a fotograma

El render salta de frame en frame (30 fps). Para evitar inconsistencias de `onUpdate`, el contador calcula el texto exacto de cada frame de Node con `tl.set(el, { textContent: '...' }, t)`.

**Archivos:**
- Crea: `lib/reels/contador.ts`
- Crea: `lib/reels/contador.test.ts`

### Pasos

- [x] **2.1 Escribir los tests en `lib/reels/contador.test.ts`:**
  - `desglosarNumero('$14.99')` devuelve prefijo `'$'`, número `14.99`, 2 decimales, sufijo `''`.
  - `desglosarNumero('7')` devuelve prefijo `''`, número `7`, 0 decimales, sufijo `''`.
  - `desglosarNumero('+400 pacientes')` devuelve prefijo `'+'`, número `400`, 0 decimales, sufijo `' pacientes'`.
  - `desglosarNumero('24/7')` devuelve `null` (no operable como conteo simple).
  - `calcularFotogramasContador('$14.99', { fps: 30, duracionMax: 1.0 })`:
    - El frame 0 empieza en `0` (o `$0.00`).
    - El último fotograma es **literalmente** el string original `'$14.99'`.
    - Los frames intermedios tienen 2 decimales y prefijo `$`.
    - La duración total no supera 1 segundo.

- [x] **2.2 Implementar `lib/reels/contador.ts`:**
  - `desglosarNumero(valor: string)`: parsea con regex prefijos (`$`, `+`), valor numérico (con punto o coma), y sufijo. Devuelve `null` si no hay un único número identificable o si contiene barras (`24/7`).
  - `calcularFotogramasContador(valor: string, opciones?: { fps?: number; duracionMax?: number })`:
    - Easing `power2.out` evaluado matemáticamente en Node para cada frame $k \in [0, N]$.
    - Formateo con los mismos decimales que el original.
    - Forzar que el fotograma final $N$ sea idéntico al `valor` literal original.

- [x] **2.3 Verificar:**
  ```bash
  npm test lib/reels/contador.test.ts
  npx tsc --noEmit
  ```

- [x] **2.4 Mutación:**
  - Cambiar el último fotograma para que use `toFixed` en vez del literal original → el test de identidad literal debe fallar.

- [x] **2.5 Commit:**
  `feat(reels): modulo contador determinista frame a frame para datos`

---

## Task 3: Energías y funciones de movimiento de elementos

Centraliza la física y curvas de animación según el sistema visual (`puka` vs `health`) y desacopla la coreografía de `composicion.ts`.

**Archivos:**
- Crea: `lib/reels/movimiento.ts`
- Crea: `lib/reels/movimiento.test.ts`

### Pasos

- [x] **3.1 Escribir los tests en `lib/reels/movimiento.test.ts`:**
  - Regla fundamental: para cualquier sistema visual (`puka` y `health`), la duración de salida de escena es $\le \text{PAUSA\_ENTRE\_ESCENAS}$ (0.4 s).
  - Transición de escena: la transición entre escenas se encadena exactamente en el corte de tiempos.
  - Subtítulos: los subtítulos no reciben el desenfoque ni la escala de respiración de la escena (son independientes).
  - **Fotograma 0:** en la primera escena ($i = 0$), el titular y badge se inicializan en $t = 0$ con opacidad 1 y posición final para garantizar portada no negra.
  - Foco en capturas: las coordenadas transformadas centran el punto `(x, y)` respetando los límites de escala sin mostrar bordes vacíos.
  - Respiración mientras habla: el contenido escala sutilmente ($1.0$ a $1.05$ en `puka`, $1.0$ a $1.025$ en `health`).
  - Brillo de fondo: repeticiones finitas que cubren la duración total del reel sin usar `repeat: -1`.

- [x] **3.2 Implementar `lib/reels/movimiento.ts`:**
  - Definir interfaces `EnergiaSistema` (duraciones de entrada/salida, escalas, blurs, easings).
  - Constantes `ENERGIAS`:
    - `puka`: entrada 0.4s `power2.out`, salida 0.3s `power2.in` (1.4x, blur 30px), titular `back.out(1.4)`, badge `expo.out`, brillo opacidad 0.30.
    - `health`: entrada 0.8s `sine.out`, salida 0.4s `sine.in` (1.12x, blur 14px), titular `power3.out`, subtítulos con rebote suave `sine`, brillo opacidad 0.10.
  - Funciones generadoras de instrucciones GSAP:
    - `coreografiaEscena(escena, slide, sistema, tiempos, esPrimeraEscena)`
    - `animacionTitularPalabras(selector, palabras, sistema, tInicio, esPrimeraEscena)`
    - `animacionCaptura(selector, captura, foco, duracion, sistema, tInicio)`
    - `animacionContador(selector, dato, sistema, tInicio)`
    - `animacionSubtitulos(grupos, sistema)`
    - `animacionBrillo(selector, colorAcento, duracionTotal, sistema)`
  - Función integradora: `generarTimelineReel(pieza, escenas, total)`

- [x] **3.3 Verificar:**
  ```bash
  npm test lib/reels/movimiento.test.ts
  npx tsc --noEmit
  ```

- [x] **3.4 Mutación:**
  - Cambiar la duración de salida en `health` a 0.5s → el test `salida <= PAUSA_ENTRE_ESCENAS` debe fallar.
  - Quitar la regla de `esPrimeraEscena` en el titular → el test de fotograma 0 debe fallar.

- [x] **3.5 Commit:**
  `feat(reels): modulo de movimiento, energias visuales y coreografia`

---

## Task 4: Integración en HTML/CSS de `composicion.ts`

Actualiza el marcado HTML generado para que admita las máscaras de texto palabra por palabra, marcos de captura con punto de anclaje, y capa de brillo.

**Archivos:**
- Modifica: `lib/reels/composicion.ts`
- Modifica: `lib/reels/composicion.test.ts`

### Pasos

- [x] **4.1 Escribir tests de marcado en `lib/reels/composicion.test.ts`:**
  - Cada palabra del titular está envuelta en un `span.palabra-wrapper > span.palabra` para permitir el corte de máscara con `overflow: hidden`.
  - La captura está envuelta en un contenedor con marco que controla el zoom y el recorte.
  - Existe la capa del brillo ambiental `#brillo-fondo` con el color de acento de los tokens del sistema.
  - El script generado dentro del HTML llama a la coreografía modular y no tiene `repeat: -1` ni callbacks en línea.
  - El primer fotograma no tiene opacidad 0 en el titular de la primera escena.

- [x] **4.2 Modificar `lib/reels/composicion.ts`:**
  - Separar palabras del titular con su contenedor de máscara CSS.
  - Agregar CSS de máscaras (`.palabra-wrapper { display: inline-block; overflow: hidden; vertical-align: top; }`).
  - Agregar capa del brillo de fondo con el acento del sistema visual.
  - Reemplazar la generación rígida de la timeline en el HTML por el script devuelto por `generarTimelineReel`.

- [x] **4.3 Verificar:**
  ```bash
  npm test lib/reels/composicion.test.ts
  npm test
  npx tsc --noEmit
  ```

- [x] **4.4 Mutación:**
  - Quitar el contenedor de máscara de las palabras → el test de estructura de máscara debe fallar.

- [x] **4.5 Commit:**
  `refactor(reels): integracion de marcado para mascaras, brillo y coreografia`

---

## Task 5: Verificación integral, render de ensayo y validación de portada

**Archivos:**
- `content/piezas/2026-09.ts` (temporal para ensayo si aplica)
- Verificación con `render --strict` y extracción de frame con `ffmpeg`.

### Pasos

- [x] **5.1 Ejecutar render de ensayo en la máquina:**
  ```bash
  npm run reels -- --mes 2026-09 --id crm-no-chatbot --ensayo
  ```
  Verificar que:
  - HyperFrames corre con `render --strict` sin errores de GSAP.
  - La síntesis de voz Kokoro sincroniza con los subtítulos y escenas.
  - El contador salta de frame en frame correctamente.
  - El video se normaliza y verifica exitosamente.

- [x] **5.2 Verificar fotograma 0 con `ffmpeg`:**
  Extraer el primer fotograma ($t = 0.0\text{ s}$) del video generado:
  ```bash
  ffmpeg -ss 00:00:00.000 -i .reels-render/crm-no-chatbot/crm-no-chatbot.mp4 -vframes 1 -q:v 2 .reels-render/crm-no-chatbot/frame0.jpg
  ```
  Comprobar que `frame0.jpg` **no está negro** y que el titular del gancho es perfectamente legible.

- [x] **5.3 Verificación de la frontera con Cloudflare:**
  ```bash
  npm run build:cloudflare
  ```
  Asegurar que `lib/reels/movimiento.ts` y `lib/reels/contador.ts` no se cuelen en el bundle del Worker de producción.

- [x] **5.4 Commit final:**
  `test(reels): verificacion de render con movimiento y portada visible en frame 0`
