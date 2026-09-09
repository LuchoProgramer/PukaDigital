# Contraste 3 — el plan de Facebook contra el código de `main`

**2026-09-09.** Los dos contrastes anteriores (`2026-09-07-facebook-contraste-agy.md`
y `-agy-2.md`) miraron la **spec**. Este mira el **plan**, y contra un `main` que
se movió debajo: la fase A extrajo la lógica de publicación a `lib/publicar/tanda.ts`
y el 2026-09-08 la ventana del cron bajó de 90 a 60 minutos.

Pasada **independiente**: Claude Code y `agy` revisaron por separado, sin verse.
Modelo `gemini-3.7-flash-high`, solo lectura, informe en
`/tmp/.../agy-tarea6.md`.

---

## Convergencia

Seis hallazgos, los seis encontrados por ambos. Cuando dos revisores que no se
vieron llegan al mismo sitio, el hallazgo es real.

| # | Hallazgo | Claude | agy |
|---|---|---|---|
| 1 | La Tarea 6 implementa en `route.ts`; el cron real es `worker.ts:42` | crítico | crítico |
| 2 | `cargarMes()` con import dinámico: falla mudo en el Worker | crítico | crítico |
| 3 | Se pierden las costuras `fetchImpl` y `buscarMes` | alto | alto |
| 4 | La Tarea 4 revierte el anclaje de `VENTANA_MINUTOS = 60` | alto | alto |
| 5 | `maxDuration = 300` es de Vercel | bajo | medio |
| 6 | Rama muerta en el CLI | bajo | bajo |

**Cero divergencias.** Ninguno encontró nada que al otro se le escapara, salvo
un detalle por lado (abajo). El rendimiento decreciente es el criterio para
parar: aquí se corta la ronda de plan.

---

## Los seis, en detalle

### 1. La Tarea 6 deja el cron automático sin Facebook — CRÍTICO

**Dónde:** `plan:1523-1704` · `worker.ts:42-60`, `lib/publicar/tanda.ts:60`,
`app/api/cron/publicar/route.ts:14-30`

La Tarea 6 dicta reescribir `app/api/cron/publicar/route.ts` con toda la
orquestación multicanal dentro, y deja `tanda.ts` intacto.

Hay **tres** entradas que acaban publicando: `worker.ts:42` (`scheduled()`), la
ruta HTTP, y `lib/publicar/cli.ts`. La que corre sin intervención humana —la que
publica de verdad— es la primera, y delega en `tanda.ts`. Implementar la Tarea 6
literal deja Facebook funcionando **solo por la ruta manual y jamás por el cron**,
y convierte `route.ts` en una segunda implementación divergente. Es exactamente
lo que `worker.ts:36-38` dice por escrito que no puede pasar.

El plan se escribió el 2026-09-07, antes de que `tanda.ts` existiera en `main`.

### 2. `cargarMes()` con import dinámico — CRÍTICO

**Dónde:** `plan:1578-1584` · `content/piezas/index.ts:6-16`

```typescript
return (await import(`@/content/piezas/${mes}`)).default;
```

`content/piezas/index.ts:6-16` lo prohíbe por escrito: el bundle de un Worker es
estático, así que esto compila, despliega y **responde «no hay piezas» todos los
meses sin dar error**, porque quien llama trata la ausencia como un mes sin
escribir. El registro estático `piezasDe()` existe precisamente para esto.

### 3. Se pierden las costuras de inyección — ALTO

**Dónde:** `plan:1540-1704` · `lib/publicar/tanda.ts:18-30`

`Opciones` tiene `ahora`, `fetchImpl` y `buscarMes` inyectables. Sin `buscarMes`
los tests leen el calendario real y se rompen solos al cambiar de mes; sin
`fetchImpl` no se puede probar la Graph API sin red. El código del plan llama a
`fetch` directo.

### 4. La Tarea 4 revierte el arreglo del 2026-09-08 — ALTO

**Dónde:** `plan:982-1000` · `lib/publicar/programado.test.ts:33-45`

El Paso 1 de la Tarea 4 dicta el contenido completo de `programado.test.ts` e
incluye `'la ventana absorbe el desfase de una hora del plan Hobby'`, con
23:59:30 y 00:31. Ese test **pasa igual con 60 que con 90**: no ancla la
constante. El commit `55c399d` lo sustituyó por `'la ventana son 60 minutos: 59
entra y 61 no'`, que la rodea y está verificado por mutación.

Implementar la Tarea 4 tal como está escrita borra ese test y restaura el que no
demuestra nada — sobre un valor que se desplegó a producción ayer.

### 5. `maxDuration = 300` es de Vercel — BAJO/MEDIO

**Dónde:** `plan:1548`

Directiva del runtime serverless de Vercel. En Workers no hace nada: el ciclo de
vida del cron lo controla `ctx.waitUntil()` en `worker.ts:50-59`.

### 6. Rama muerta en el CLI — BAJO

**Dónde:** `plan:1770-1773`

Tras `if (!pageId || !token)` viene un `if (!token)` inalcanzable que además
menciona `IG_ACCESS_TOKEN` dentro de la rama exclusiva de `--facebook`.

---

## Lo que aportó cada uno por su lado

**Solo `agy`:** que el mensaje de la rama muerta, además de inalcanzable, nombra
la variable del canal equivocado.

**Solo Claude:** la Tarea 6 Paso 3 afirma «Resultado esperado: **100 tests
pasando**». Hoy son 80. Un número inventado en un plan es una verificación falsa,
y quien la ejecute creerá que algo se rompió.

---

## Lo que `agy` descartó, y se verificó

`agy` contrastó los captions de la Tarea 7 contra `catalogo.ts`, `prohibidas.ts`
y `docs/PUKAHEALTH_LIMITES.md` y reportó **cero hallazgos**.

Se intentó tumbar ese «cero» antes de aceptarlo, que es el uso correcto de un
descarte. El caption de PukaIA dice «entre $49 y $499 al mes» —precios de
Mercately y Sellerchat— y ninguno está en `CATALOGO.pukaia.precios`
(`['14.99','25','60']`), así que `preciosEn()` los extraería y la validación de
la Tarea 2 los rechazaría. Pero la válvula existe: `preciosAjenos` está declarada
en `lib/piezas/tipos.ts:49` y ya puesta en `content/piezas/2026-09.ts:79`.

`agy` tenía razón. Un descarte verificado vale tanto como un hallazgo.

---

## Lo que no se pudo verificar

- Las respuestas reales de la Graph API de Facebook: contraste solo lectura, sin red.
- La generación en vivo de captions con Gemini.
- El disparo real del cron en Cloudflare, que solo se observa desplegado.

---

## Lo que falta

La **cuarta pasada**, contra el código **ya implementado**. Las tres primeras
contrastan diseño y plan contra el código original; la cuarta encuentra los
huecos de la implementación, que ninguna anterior puede ver. Va después de
implementar las Tareas 1-7, no antes.
