### [1] El modelo de Gemini propuesto contradice la especificación técnica
- **Severidad:** GRAVE
- **Dónde:** [docs/superpowers/plans/2026-09-07-facebook-canal-propio.md:1373](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/plans/2026-09-07-facebook-canal-propio.md#L1373), [docs/superpowers/plans/2026-09-07-facebook-canal-propio.md:2306](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/plans/2026-09-07-facebook-canal-propio.md#L2306) frente a [docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md:367-374](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L367-L374)
- **Qué dice el plan:**
  ```typescript
  const MODELO_CAPTION = 'gemini-2.5-flash';
  ```
  y en "Dudas y supuestos" (línea 2306):
  > «En `lib/captions/gemini.ts` se establece `'gemini-2.5-flash'` como valor por defecto verificable y compatible con `@google/genai 1.30.0` (idéntico al de `lib/genai.ts:16`), permitiendo parametrizar versiones más recientes (ej. Gemini 3.x Flash) en cuanto el endpoint esté disponible sin alterar la firma.»
- **Qué dice el código real / la spec:**
  [`docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md:367-374`](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L367-L374):
  > «**Gemini 3.x Flash, el más reciente disponible.** Verificar el ID exacto al implementar: la familia se mueve rápido y ya iba por la 3.8 el 2 de septiembre de 2026. No 2.5 Pro, aunque fuera la idea inicial. Es de marzo de 2025 y Gemini 3 Flash lo supera en AIME 2025, GPQA, Humanity's Last Exam, SimpleQA y SWE-Bench a una fracción del precio. Es mejor *y* más barato.»
- **Por qué importa:** La spec descarta de forma explícita y motivada los modelos 2.5 para la redacción de captions de Facebook, fijando Gemini 3.x Flash. El plan asume erróneamente en sus dudas que 3.x no está disponible y recurre por defecto a `gemini-2.5-flash` copiándolo de [`lib/genai.ts:16`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/genai.ts#L16), lo cual contradice la decisión técnica de diseño.

---

### [2] Regresión en `validar.ts`: omisión del parámetro `slide` en errores de precio y oferta en slides
- **Severidad:** GRAVE
- **Dónde:** [docs/superpowers/plans/2026-09-07-facebook-canal-propio.md:618,627](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/plans/2026-09-07-facebook-canal-propio.md#L618-L627) frente a [lib/piezas/validar.ts:156,164](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L156-L164)
- **Qué dice el plan:**
  ```typescript
  // plan líneas 618 y 627 (dentro del bucle de slides)
  en(campo, `$${precio} no es un precio de ${producto.nombre}: ${permitidos}`);
  ...
  en(campo, `'${oferta}' no es la oferta de ${producto.nombre}: ${permitidas}`);
  ```
- **Qué dice el código real:**
  ```typescript
  // lib/piezas/validar.ts:156 y 164
  en(campo, `$${precio} no es un precio de ${producto.nombre}: ${permitidos}`, n);
  ...
  en(campo, `'${oferta}' no es la oferta de ${producto.nombre}: ${permitidas}`, n);
  ```
- **Por qué importa:** La función `en(campo: string, mensaje: string, slide?: number)` en [`lib/piezas/validar.ts:46-52`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L46-L52) adjunta el número de slide al objeto [`ErrorValidacion`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts#L58-L63). Al implementar la validación unificada de captions y slides, el plan copió la llamada de los captions (que no tienen slide) dentro del bucle de slides omitiendo el argumento `n`. Esto provoca que los errores de precios y ofertas dentro de una slide reporten `slide: undefined` en lugar del número de la slide afectada, degradando los mensajes de CLI generados por [`formatear()`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L173-L177).

---

### [3] Descuadre en el recuento de tests unitarios (99 tests reales vs 100 reportados)
- **Severidad:** MENOR
- **Dónde:** [docs/superpowers/plans/2026-09-07-facebook-canal-propio.md:1214,1500,1766,2260,2267](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/plans/2026-09-07-facebook-canal-propio.md#L1214) frente a [lib/publicar/programado.test.ts:69-72](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.test.ts#L69-L72)
- **Qué dice el plan:**
  - Línea 1214 (Tarea 4): `"Resultado esperado: 96 tests pasando (+7 tests nuevos en programado.test.ts)."`
  - Líneas 1500, 1766, 2260, 2267: `"Resultado esperado: 100 tests pasando (29 tests nuevos sobre la línea base de 71)."`
- **Qué dice el código real:**
  - La suite base en `npm test` tiene **71 tests**.
  - Tarea 1: `componer.test.ts` añade 6 tests -> total acumulado: 77.
  - Tarea 2: `validar.test.ts` (+2) y `hechos.test.ts` (+5) añaden 7 tests -> total acumulado: 84.
  - Tarea 3: `facebook.test.ts` añade 5 tests -> total acumulado: 89.
  - Tarea 4: El plan propone reemplazar [`lib/publicar/programado.test.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.test.ts) por 14 tests. El archivo original tenía 8 tests y el plan omite 1 test existente (`test('una pieza sin caption no se puede comparar, asi que no se publica sola', ...)`), por lo que la ganancia neta es de **+6 tests** (89 + 6 = **95 tests**, no 96).
  - Tarea 5: `prompt.test.ts` añade 4 tests -> total acumulado: **99 tests** (no 100).
- **Por qué importa:** El plan promete que `npm test` terminará con 100 tests (+29 nuevos), pero el código literal escrito produce exactamente 99 tests (+28 nuevos netos). Si un proceso de CI o verificación automática contrasta el número exacto de tests (`100`), fallará.

---

### [4] Fallback hardcodeado de `FB_PAGE_ID` y omisión de error 500 por variables faltantes en `route.ts`
- **Severidad:** MENOR
- **Dónde:** [docs/superpowers/plans/2026-09-07-facebook-canal-propio.md:1575-1576,1733-1734,2304](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/plans/2026-09-07-facebook-canal-propio.md#L1575-L1576) frente a [app/api/cron/publicar/route.ts:34-38](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L34-L38) y [lib/publicar/cli.ts:45-50](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/cli.ts#L45-L50)
- **Qué dice el plan:**
  ```typescript
  const fbPageId = process.env.FB_PAGE_ID ?? '764585143409223';
  const fbToken = process.env.FB_PAGE_ACCESS_TOKEN ?? igToken;
  ```
  y en `route.ts` no se valida la presencia de credenciales al inicio:
  ```typescript
  if (igUserId && igToken) { ... }
  if (fbPageId && fbToken) { ... }
  return NextResponse.json({ mes: mesActual, revisadas: items.length, publicadas, fallidas });
  ```
- **Qué dice el código real:**
  [`app/api/cron/publicar/route.ts:34-38`](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L34-L38):
  ```typescript
  const igUserId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !token) {
    return NextResponse.json({ error: 'Faltan IG_USER_ID o IG_ACCESS_TOKEN' }, { status: 500 });
  }
  ```
  [`lib/publicar/cli.ts:45-50`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/cli.ts#L45-L50):
  ```typescript
  const igUserId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUserId || !token) {
    console.error('\nFaltan IG_USER_ID o IG_ACCESS_TOKEN en el entorno.');
    process.exit(1);
  }
  ```
- **Por qué importa:** En el código real de Instagram no existen fallbacks hardcodeados; las variables `IG_USER_ID` y `IG_ACCESS_TOKEN` son obligatorias y su ausencia aborta inmediatamente con status 500. El plan introduce un ID numérico hardcodeado en el código fuente (`'764585143409223'`) y hace que `route.ts` responda `200 OK` silenciosamente sin publicar nada si faltan los tokens en lugar de alertar el fallo de configuración en el cron.

---

## Resolución de "Dudas y supuestos" del plan

1. **Punto 1 (Variables de entorno y fallback hardcodeado):** Hoy en [`route.ts:34-38`](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L34-L38) y [`lib/publicar/cli.ts:45-50`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/cli.ts#L45-L50) se leen `IG_USER_ID` y `IG_ACCESS_TOKEN` sin ningún fallback. El plan inventa un fallback hardcodeado para Facebook (`'764585143409223'`) y reutiliza `IG_ACCESS_TOKEN` como fallback de `FB_PAGE_ACCESS_TOKEN` (lo cual es técnicamente válido según [`docs/PUBLICAR_EN_FACEBOOK.md:98`](file:///Users/luisviteri/Proyectos/PukaDigital/docs/PUBLICAR_EN_FACEBOOK.md#L98), pero desvía el patrón de manejo estricto de errores).
2. **Punto 2 (Modelo Gemini):** El plan contradice directamente la spec al poner `'gemini-2.5-flash'` (ver hallazgo **[1]**). La spec exige explícitamente Gemini 3.x Flash.
3. **Punto 3 (Mapeo de mes en cruces de fin de mes):** **Sin hallazgos.** La construcción `mapaMes.get(pieza.id)` combinada con `urlPublica(mesPieza, archivo)` en [`lib/publicar/meta.ts:25`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/meta.ts#L25) resuelve correctamente las URLs hacia `public/piezas/2026-09/...` aun cuando el cron se ejecute el 1 de octubre.
4. **Punto 4 (Piezas sin producto):** **Sin hallazgos.** La pieza `requisitos-facturar-sri` en [`content/piezas/2026-09.ts:2125`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L2125) no contiene precios con `$` ni ofertas de gratuidad, por lo que pasa la validación sin errores y no rompe ningún test existente.

---

## Áreas sin hallazgos

- **Área 1 (Símbolos, firmas e imports):** Todos los tipos ([`Pieza`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts#L31), [`Slide`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts#L5), [`ProductoId`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts#L23)), constantes ([`CATALOGO`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/catalogo.ts#L20), [`PROHIBIDAS`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/prohibidas.ts#L18)) y funciones auxiliares ([`preciosEn`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/catalogo.ts#L74), [`ofertasEn`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/catalogo.ts#L80), [`afirmacionesProhibidas`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/prohibidas.ts#L74), [`urlPublica`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/meta.ts#L25), [`aUTC`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L25)) existen, tienen los nombres exactos y sus imports utilizan la extensión `.ts` requerida por el repositorio.
- **Área 2 (Llamadores de firmas cambiadas):** Se verificó cada uso de [`yaPublicada()`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L40), [`pendientes()`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L52) y [`validar()`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L40) en todo el código y tests. El plan actualiza todos los llamadores y mantiene [`export const pendientes = pendientesInstagram`](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/plans/2026-09-07-facebook-canal-propio.md#L1208) para compatibilidad.
- **Área 5 (Orden de tareas):** Cada tarea (de la 1 a la 7) es incremental y deja el repositorio compilando con `tsc --noEmit` y pasando `npm test` en verde sin introducir estados intermedios rotos.
