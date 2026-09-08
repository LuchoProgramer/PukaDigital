### [1] Hueco de diseño crítico: el CLI asume la mutación directa de archivos `.ts` sin AST ni preservación de código
- **Severidad:** BLOQUEANTE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:156-158, 194](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L156-L158), [package.json:16-41](file:///Users/luisviteri/Proyectos/PukaDigital/package.json#L16-L41), [content/piezas/2026-09.ts:1-374](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L1-L374)
- **Qué dice la spec:**
  > «`npm run captions -- --mes 2026-10`
  >    └─ Gemini lee slides + catálogo + afirmaciones prohibidas
  >       └─ escribe facebook.caption en content/piezas/2026-10.ts» (líneas 156-158)
  > «`| lib/captions/cli.ts | npm run captions — escribe en el archivo del mes | los tres de arriba |`» (línea 194)
- **Qué dice el código:**
  En [`content/piezas/2026-09.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L1-L20):
  El archivo mensual no es un JSON de datos puros; es un módulo TypeScript estructurado con importaciones (`import type { Pieza }`), bloques JSDoc con reglas editoriales (`líneas 3-19`), separadores visuales de fecha (`// ─── jueves 3 · la casa ───`), comentarios explicativos dentro de objetos (`// De la competencia, no nuestros. Ver preciosAjenos en tipos.ts.`) y concatenaciones de cadenas multilínea (`'...' + '\n\n' + '...'`).
  En [`package.json:16-41`](file:///Users/luisviteri/Proyectos/PukaDigital/package.json#L16-L41):
  No existe ninguna dependencia para parsear o mutar AST en TypeScript preservando comentarios y formato (como `ts-morph`, `recast`, `@babel/parser` o `prettier`).
- **Por qué importa:**
  La spec da por resuelto el paso de escritura sin diseñar cómo mutar un archivo de código TypeScript. Si `cli.ts` importa el módulo en memoria y serializa el objeto de vuelta (`JSON.stringify` o template strings), destruirá las anotaciones de tipo, eliminará todos los comentarios editoriales y corromperá el estilo del archivo. Si recurre a manipulación con expresiones regulares sobre código TypeScript multilínea, el mecanismo será extremadamente frágil y generará errores de sintaxis ante cualquier variación de formato. La spec debe especificar el mecanismo exacto de inserción (ej. inyección controlada vía AST o emitir un parche/snippet) para no dejar este bloqueo a criterio del implementador.

---

### [2] Pérdida de publicaciones en fin de mes por la regla de "la franja siguiente" cruzando particiones mensuales
- **Severidad:** BLOQUEANTE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:118-121](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L118-L121), [app/api/cron/publicar/route.ts:14-16, 40-49](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L14-L49), [lib/publicar/programado.ts:25-29](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L25-L29)
- **Qué dice la spec:**
  > «Facebook usa `facebook.publicarEl`. Si falta, cae a **la franja siguiente**: una pieza de Instagram de las 09:00 sale en Facebook a las 18:00 del mismo día; una de las 18:00 sale a las 09:00 del día siguiente.» (líneas 118-120)
- **Qué dice el código:**
  En [`app/api/cron/publicar/route.ts:14-16, 40-49`](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L14-L49):
  ```typescript
  function mesDe(fecha: Date): string {
    return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
  }
  // ...
  const ahora = new Date();
  const mes = mesDe(ahora);
  piezas = (await import(`@/content/piezas/${mes}`)).default;
  ```
- **Por qué importa:**
  El contenido está particionado en un archivo `.ts` por mes (`content/piezas/YYYY-MM.ts`). Si una pieza publica en Instagram el último día del mes a las 18:00 (ej. `2026-09-30T18:00`), su franja siguiente para Facebook cae el primer día del mes siguiente a las 09:00 (`2026-10-01T09:00`).
  Cuando el cron corre el 1 de octubre a las 09:00 (14:00 UTC), `mesDe(ahora)` carga exclusivamente `content/piezas/2026-10.ts`. La pieza del 30 de septiembre está en `content/piezas/2026-09.ts` y nunca será leída. Como resultado, la publicación de Facebook de fin de mes **se pierde permanentemente en silencio**.
  Además, `mesDe()` usa `getUTCMonth()`. En Ecuador (UTC-5), a partir de las 19:00 del último día del mes, la hora UTC ya pertenece al mes siguiente, provocando que `mesDe()` intente cargar prematuramente el archivo del mes que viene.

---

### [3] Generalización indebida de "afirmaciones prohibidas" a todos los productos rompe tests existentes
- **Severidad:** GRAVE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:213-216](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L213-L216), [lib/piezas/validar.ts:140-147](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L140-L147), [lib/piezas/hechos.test.ts:130-138](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/hechos.test.ts#L130-L138)
- **Qué dice la spec:**
  > «Este spec lo cierra: precios, ofertas y afirmaciones prohibidas pasan a validarse sobre los dos captions y para todos los productos, no solo PukaHealth.» (líneas 213-215)
- **Qué dice el código:**
  En [`lib/piezas/validar.ts:140-147`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L140-L147):
  ```typescript
  // Lo que el producto no hace. Solo PukaHealth: en los demas productos
  // estas frases pueden ser ciertas.
  if (pieza.producto === 'pukahealth') {
    for (const p of afirmacionesProhibidas(texto)) {
      en(campo, `${p.motivo}. En cambio: ${p.enCambio}`, n);
    }
  }
  ```
  En [`lib/piezas/hechos.test.ts:130-138`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/hechos.test.ts#L130-L138):
  ```typescript
  test('las prohibiciones son de PukaHealth: no aplican a otro producto', () => {
    const otra: Pieza = {
      id: 'x',
      sistema: 'puka',
      producto: 'ledgerxpertz',
      slides: [{ titular: 'Sincronización bidireccional con tu tienda' }],
    };
    assert.deepEqual(validar([otra]), []);
  });
  ```
- **Por qué importa:**
  La lista en [`lib/piezas/prohibidas.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/prohibidas.ts#L18-L63) contiene restricciones médicas específicas de `PukaHealth` (ej. «sincronización bidireccional», «cualquier especialidad», «nuestra app»). Si `validar.ts` extiende las afirmaciones prohibidas a *todos* los productos como indica la spec, el test existente en `hechos.test.ts:130` fallará de inmediato y bloqueará textos válidos para LedgerXpertz o PukaIA. La generalización a todos los productos debe aplicar únicamente a **precios y ofertas**; las afirmaciones prohibidas deben mantenerse restringidas a `pukahealth`.

---

### [4] Contradicción interna en el docstring de `Pieza.facebook` sobre la hora por defecto
- **Severidad:** MENOR
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:320-327](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L320-L327) frente a [2026-09-07-facebook-canal-propio-design.md:118-121](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L118-L121)
- **Qué dice la spec:**
  En la definición de tipos:
  > ```typescript
  > /**
  >  * Facebook. Si falta el bloque entero, la pieza igual se publica: el caption
  >  * se compone desde las slides y la hora cae a las 18:00 del mismo día.
  >  */
  > facebook?: {
  >   caption?: string;
  >   publicarEl?: string;
  > };
  > ``` (líneas 320-327)
  En la sección de decisiones:
  > «una pieza de Instagram de las 09:00 sale en Facebook a las 18:00 del mismo día; una de las 18:00 sale a las 09:00 del día siguiente.» (líneas 119-120)
- **Qué dice el código:**
  En [`content/piezas/2026-09.ts:26, 180, 277`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L26), 3 piezas publican en Instagram a las 18:00 (`podologo-no-receta`, `crm-no-chatbot`, `requisitos-facturar-sri`).
- **Por qué importa:**
  El comentario JSDoc propuesto para `lib/piezas/tipos.ts` conserva la redacción del primer borrador («la hora cae a las 18:00 del mismo día»). Si se copia tal cual al código, documenta una regla falsa que contradice la lógica escalonada (para una pieza de Instagram de las 18:00, la franja siguiente es las 09:00 del día siguiente, no las 18:00 del mismo día).

---

### [5] Cambio de signatura en `yaPublicada()` romperá los tests unitarios de `programado.test.ts`
- **Severidad:** MENOR
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:241, 383](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L241), [lib/publicar/programado.ts:40-44](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L40-L44), [lib/publicar/programado.test.ts:64-67](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.test.ts#L64-L67)
- **Qué dice la spec:**
  > «Hay que parametrizar qué texto se compara.» (línea 241)
  > «`yaPublicada()` | Que compare el texto de Facebook y no el de Instagram. Un test que la llame con el caption de Instagram debe dar `false`» (línea 383)
- **Qué dice el código:**
  En [`lib/publicar/programado.ts:40-44`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L40-L44):
  ```typescript
  export function yaPublicada(pieza: Pieza, captionsRecientes: string[]): boolean {
    if (!pieza.caption) return false;
    const mio = normalizar(pieza.caption);
    return captionsRecientes.some((c) => normalizar(c) === mio);
  }
  ```
  En [`lib/publicar/programado.test.ts:64-67`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.test.ts#L64-L67):
  ```typescript
  test('la comparacion de captions ignora espacios de mas', () => {
    assert.equal(yaPublicada({ ...base, id: 'x', caption: 'Hola  mundo ' }, ['Hola mundo']), true);
    assert.equal(yaPublicada({ ...base, id: 'x', caption: 'Hola mundo' }, ['Otra cosa']), false);
  });
  ```
- **Por qué importa:**
  Al parametrizar `yaPublicada` para recibir el texto explícito (o la red destino), la signatura actual `(pieza: Pieza, captionsRecientes: string[])` cambiará. Los tests existentes en `lib/publicar/programado.test.ts:64-67` romperán la compilación en TypeScript y el comando `npm test` a menos que se adapten explícitamente en el plan de cambios.

---

## Áreas sin hallazgos

- **Captions existentes de septiembre de 2026 frente a validación de precios:**
  Se revisaron los captions de las 7 piezas de [`content/piezas/2026-09.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts) uno por uno contra [`lib/piezas/catalogo.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/catalogo.ts).
  - `podologo-no-receta`: Sin precios ni ofertas. Limpio.
  - `precios-software-ecuador`: Contiene `$49` y `$499` (declarados en `preciosAjenos`), y `$14.99` (precio válido de `pukaia`). Limpio.
  - `proteccion-datos-clinicas`: Sin precios. «90 días» no activa `ofertasEn` (no incluye «gratis»). Limpio.
  - `crm-no-chatbot`: Contiene `$14.99` (precio válido de `pukaia`). Limpio.
  - `enter-tumba-factura`: Sin precios ni ofertas. Limpio.
  - `requisitos-facturar-sri`: Sin producto ni precios. Limpio.
  - `receta-contenido-minimo`: Sin precios ni ofertas. Limpio.
  Ningún caption de septiembre romperá el build al incorporar la validación de precios en captions.

- **Comportamiento de `piezas --check` en CI ante meses futuros inexistentes:**
  [`lib/piezas/cli.ts:26-57`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/cli.ts#L26-L57) (`comprobarTodos()`) lee únicamente los archivos `.ts` presentes en `content/piezas/`. No asume la existencia de meses futuros ni falla el 1 de octubre si `2026-10.ts` todavía no ha sido creado.

- **Aislamiento de errores e idempotencia entre Instagram y Facebook en el cron:**
  La consulta anti-duplicación es independiente por red (Instagram consulta `{ig-user-id}/media?fields=caption` y Facebook consulta `{page-id}/posts?fields=message`). Si una red falla o la ejecución se interrumpe tras publicar en una de ellas, la corrida siguiente detectará de forma aislada qué post ya existe en qué red sin provocar publicaciones dobles.

- **Autenticación con Gemini:**
  [`lib/genai.ts:4`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/genai.ts#L4) confirma que la clave del entorno en este proyecto se llama `API_KEY` (sin prefijo `GEMINI_`), tal como describe la spec.
