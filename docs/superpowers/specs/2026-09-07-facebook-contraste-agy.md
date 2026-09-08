### [1] La selección fija por franja (09:00 IG / 18:00 FB) rompe la publicación de piezas de Instagram existentes y bloquea Facebook
- **Severidad:** BLOQUEANTE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:62, 94, 131-132, 296](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L62-L62), [content/piezas/2026-09.ts:26, 180, 277](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L26-L26), [lib/publicar/programado.ts:22, 58-64](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L22-L22)
- **Qué dice la spec:**
  > «Mismo día, franjas distintas: Instagram 09:00, Facebook 18:00» (línea 62)
  > «`vercel.json` ya corre el cron a las 09:00 y 18:00 de Ecuador. Dar a cada red su franja no cuesta infraestructura.» (línea 94)
  > «09:00 Ecuador → Instagram: carrusel 5 slides + caption de Instagram / 18:00 Ecuador → Facebook: slide 1 en 4x5 + facebook.caption» (líneas 131-132)
  > «`programado.ts` | Que la franja de las 18:00 seleccione Facebook y la de las 09:00 Instagram» (línea 296)
- **Qué dice el código:**
  En [`content/piezas/2026-09.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L26), 3 de las 7 piezas tienen `publicarEl` programado a las 18:00 para salir en Instagram:
  - `podologo-no-receta` (línea 26): `publicarEl: '2026-09-02T18:00'`
  - `crm-no-chatbot` (línea 180): `publicarEl: '2026-09-10T18:00'`
  - `requisitos-facturar-sri` (línea 277): `publicarEl: '2026-09-17T18:00'`
  
  En [`lib/publicar/programado.ts:22, 63-64`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L22-L64):
  ```typescript
  const VENTANA_MINUTOS = 90;
  // ...
  const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
  if (minutos < 0 || minutos > VENTANA_MINUTOS) return false;
  ```
- **Por qué importa:**
  La spec asume erróneamente que las 09:00 era «la franja de Instagram» y las 18:00 estaba libre para Facebook. En el repositorio real, las dos franjas en `vercel.json` corresponden a publicaciones de Instagram (algunos días a las 09:00 y otros a las 18:00).
  Si el cron de las 09:00 solo publica en Instagram y el de las 18:00 solo en Facebook:
  1. Las piezas de Instagram fijadas a las 18:00 (`crm-no-chatbot`, `requisitos-facturar-sri`, `podologo-no-receta`) **nunca se publicarán en Instagram**, ya que a las 09:00 son futuras y a las 18:00 el cron ignorará Instagram.
  2. Las piezas con `publicarEl` a las 09:00 (`precios-software-ecuador`, `proteccion-datos-clinicas`, `enter-tumba-factura`, `receta-contenido-minimo`) **nunca se publicarán en Facebook**, porque al ejecutarse el cron de las 18:00 habrán transcurrido 9 horas (540 minutos), quedando descartadas por exceder la `VENTANA_MINUTOS` (90 min).

---

### [2] Contradicción interna entre el fallback de `componer.ts` y la barrera de CI (`piezas --check`)
- **Severidad:** BLOQUEANTE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:244-247, 274, 338](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L244-L247), [package.json:7](file:///Users/luisviteri/Proyectos/PukaDigital/package.json#L7-L7), [content/piezas/2026-09.ts](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L20-L371)
- **Qué dice la spec:**
  > «Facebook. Si falta el bloque entero, la pieza igual se publica: el caption se compone desde las slides y la hora cae a las 18:00 del mismo día.» (líneas 244-247)
  > «Los 7 carruseles de septiembre se republican en Facebook... sin producir nada nuevo.» (línea 338)
  > «`Pieza.caption` es implícitamente el de Instagram. No se renombra: tocarlo obligaría a reescribir las 7 piezas de septiembre para no ganar nada.» (líneas 258-260)
  
  Pero en la tabla de manejo de errores afirma:
  > «Pieza con `publicarEl` y sin caption de Facebook | **`piezas --check` falla y rompe el build.** Se detecta en el PR, no en producción» (línea 274)
  > «⚠️ El fallback **no debería activarse nunca**. Existe para el despiste, no como puerta trasera: por eso `--check` falla antes...» (líneas 279-281)
- **Qué dice el código:**
  En [`package.json:7`](file:///Users/luisviteri/Proyectos/PukaDigital/package.json#L7):
  ```json
  "prebuild": "npm run piezas -- --check && npm test && tsc --noEmit"
  ```
  Las 7 piezas de [`content/piezas/2026-09.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts) tienen `publicarEl` pero ninguna incluye la propiedad `facebook`.
- **Por qué importa:**
  Existe una contradicción directa: si `piezas --check` rompe el build cuando falta `facebook.caption` en una pieza con `publicarEl`, el comando `prebuild` fallará inmediatamente en CI sobre las 7 piezas de septiembre, obligando a reescribirlas todas (lo que la spec prometió no hacer en la línea 258). Si por el contrario `facebook` es opcional para permitir que `componer.ts` actúe como fallback transparente, la regla de fallo en `--check` de la línea 274 es errónea e incompatible.

---

### [3] `yaPublicada()` es incompatible con Facebook por comparar el campo incorrecto y la Graph API de Páginas usa `message`
- **Severidad:** GRAVE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:142-145, 277](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L142-L145), [lib/publicar/programado.ts:40-44](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L40-L44), [app/api/cron/publicar/route.ts:18-24](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L18-L24)
- **Qué dice la spec:**
  > «`yaPublicada()` pregunta a la página por los captions recientes. Funciona porque el texto es fijo en el archivo» (línea 277)
  > «Sin base de datos, la única defensa contra publicar dos veces es preguntarle a la red si ya existe ese caption (`programado.ts:40`).» (líneas 142-145)
- **Qué dice el código:**
  En [`lib/publicar/programado.ts:40-44`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/programado.ts#L40-L44):
  ```typescript
  export function yaPublicada(pieza: Pieza, captionsRecientes: string[]): boolean {
    if (!pieza.caption) return false;
    const mio = normalizar(pieza.caption);
    return captionsRecientes.some((c) => normalizar(c) === mio);
  }
  ```
  En [`app/api/cron/publicar/route.ts:18-24`](file:///Users/luisviteri/Proyectos/PukaDigital/app/api/cron/publicar/route.ts#L18-L24):
  ```typescript
  const url = `https://graph.facebook.com/v21.0/${igUserId}/media?fields=caption&limit=${RECIENTES}&access_token=${token}`;
  ```
- **Por qué importa:**
  1. `yaPublicada` compara estrictamente `pieza.caption` (el caption de Instagram, con hashtags y redacción diferente). En Facebook, el texto publicado proviene de `pieza.facebook.caption` o de `componer.ts` (sin hashtags). Reutilizar `yaPublicada(pieza, ...)` sin adaptar la función provocará que siempre devuelva `false`, anulando por completo la defensa contra duplicados en Facebook.
  2. En la Graph API de Facebook para publicaciones de Página (`/{page-id}/feed` o `/{page-id}/posts`), el campo que contiene el texto es **`message`** (en Instagram es `caption`). Solicitar `fields=caption` en el feed de una página de Facebook genera un error de Graph API (`#100 Tried accessing nonexisting field`).

---

### [4] `componer.ts` falla en piezas de utilidad sin `producto` y `catalogo.ts` usa rutas relativas
- **Severidad:** GRAVE
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:188-191](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L188-L191), [lib/piezas/tipos.ts:39](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts#L39-L39), [content/piezas/2026-09.ts:275-277](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L275-L277), [lib/piezas/catalogo.ts:20-63](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/catalogo.ts#L20-L63)
- **Qué dice la spec:**
  > «`componer.ts` recorre las slides y emite, por cada una, el titular en una línea y la bajada debajo, separadas por línea en blanco. Si la slide trae `dato`, el valor y la etiqueta se anexan al titular. Cierra con la URL canónica del producto según `catalogo.ts`. Sin hashtags.» (líneas 188-191)
- **Qué dice el código:**
  En [`lib/piezas/tipos.ts:39`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts#L39):
  ```typescript
  /** Las piezas de utilidad, que no venden nada, pueden omitirlo. */
  producto?: ProductoId;
  ```
  En [`content/piezas/2026-09.ts:274-278`](file:///Users/luisviteri/Proyectos/PukaDigital/content/piezas/2026-09.ts#L274-L278), la pieza `requisitos-facturar-sri` **no tiene `producto` declarado**:
  ```typescript
  {
    id: 'requisitos-facturar-sri',
    sistema: 'puka',
    publicarEl: '2026-09-17T18:00',
    // ...
  }
  ```
  En [`lib/piezas/catalogo.ts:20-63`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/catalogo.ts#L20-L63), `CATALOGO` almacena rutas relativas (ej. `url: '/agentes-ia'`), no dominios completos (`pukadigital.com/agentes-ia`).
- **Por qué importa:**
  Si `componer.ts` asume que toda pieza tiene `producto` y busca `CATALOGO[pieza.producto]`, arrojará un error de tipo en tiempo de ejecución (`Cannot read properties of undefined`) al procesar piezas de utilidad como `requisitos-facturar-sri`. El compositor debe manejar piezas sin producto cerrando con `pukadigital.com` y transformar los paths relativos de `catalogo.ts` en URLs absolutas sin protocolo.

---

### [5] `validar.ts` no valida precios ni ofertas en los captions, al contrario de lo que afirma la spec
- **Severidad:** MENOR
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:167-170](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L167-L170), [lib/piezas/validar.ts:87-91, 138-166](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L87-L91)
- **Qué dice la spec:**
  > «`lib/piezas/validar.ts` no cambia de responsabilidad: valida el `facebook.caption` con las mismas reglas de hechos, precios y afirmaciones prohibidas que ya aplica al de Instagram. Un caption que invente un precio o diga «recordatorios por WhatsApp» rompe el build, venga de Gemini o de un teclado.» (líneas 167-170)
- **Qué dice el código:**
  En [`lib/piezas/validar.ts:87-91`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L87-L91):
  ```typescript
  if (pieza.producto === 'pukahealth' && pieza.caption) {
    for (const p of afirmacionesProhibidas(pieza.caption)) {
      en('caption', `${p.motivo}. En cambio: ${p.enCambio}`);
    }
  }
  ```
  Las validaciones de precios (`preciosEn`) y de ofertas (`ofertasEn`) en [`lib/piezas/validar.ts:149-166`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts#L149-L166) se ejecutan **únicamente** sobre `textos(slide)` (el arte de las slides), nunca sobre `pieza.caption`.
- **Por qué importa:**
  La spec describe `validar.ts` como un componente que «no cambia de responsabilidad» porque «ya aplica» reglas de precios y ofertas a los captions. Esto no es cierto: el validador actual solo comprueba afirmaciones prohibidas de salud en el caption. Si se quiere que un precio inventado en un caption rompa el build, `validar.ts` sí debe extender sus responsabilidades para analizar precios y ofertas en los textos de caption.

---

### [6] Desalineación arquitectónica con la spec de Cloudflare: la orquestación no vivirá en `/api/cron/publicar`
- **Severidad:** MENOR
- **Dónde:** [2026-09-07-facebook-canal-propio-design.md:6, 103-105](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-07-facebook-canal-propio-design.md#L6-L6), [2026-09-02-migracion-cloudflare-design.md:80-120](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-02-migracion-cloudflare-design.md#L80-L120)
- **Qué dice la spec:**
  > «**Prerrequisito:** migración a Cloudflare, fases B y C.» (línea 6)
  > «Facebook se construye dentro de `/api/cron/publicar`, que es exactamente el archivo que la migración mueve.» (líneas 103-105)
- **Qué dice el código:**
  En [`docs/superpowers/specs/2026-09-02-migracion-cloudflare-design.md:80-120`](file:///Users/luisviteri/Proyectos/PukaDigital/docs/superpowers/specs/2026-09-02-migracion-cloudflare-design.md#L80-L120):
  > «Cloudflare no dispara rutas HTTP. Invoca un handler `scheduled()` del Worker. Hoy `app/api/cron/publicar/route.ts` mezcla dos cosas... Se extrae a un módulo propio: `lib/publicar/tanda.ts` (`publicarLoQueToca`). Dos llamadores: `scheduled()` en el entry propio del Worker y la ruta HTTP.»
- **Por qué importa:**
  Al fijar la migración a Cloudflare como prerrequisito completado, la lógica de publicación ya no reside en `app/api/cron/publicar/route.ts` sino en `lib/publicar/tanda.ts`. En Cloudflare Workers, los crons automáticos (`scheduled()`) llaman a `lib/publicar/tanda.ts` y no tocan la ruta HTTP. Si la integración de Facebook se implementa dentro de `app/api/cron/publicar/route.ts`, los cron triggers desatendidos de Cloudflare nunca publicarán en Facebook.

---

## Áreas sin hallazgos

- **Estructura del tipo `Pieza` y compatibilidad con `validar.ts`:**
  Añadir el campo opcional `facebook?: { caption?: string; publicarEl?: string }` a [`lib/piezas/tipos.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts) no genera conflictos estructurales. [`lib/piezas/validar.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/validar.ts) no itera sobre `Object.keys(pieza)` ni asume un conjunto cerrado de campos en tiempo de ejecución.

- **Renderizado y URLs públicas de imágenes:**
  Los archivos PNG en relación 4:5 correspondientes a la primera slide de cada pieza (`public/piezas/2026-09/*-1-4x5.png`) existen en disco. La función [`urlPublica()`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/publicar/meta.ts#L25) en `lib/publicar/meta.ts:25` construye URLs absolutas estables que cumplen con los requisitos de la Graph API para la carga de fotos vía URL pública.

- **Topes de caracteres de Facebook:**
  Facebook admite hasta 63.206 caracteres en posts de feed orgánico. Ni los captions compuestos por [`componer.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/tipos.ts) ni los generados por Gemini superan una fracción de dicho límite.

- **Capturas de pantalla y avisos obligatorios:**
  [`lib/piezas/capturas.ts`](file:///Users/luisviteri/Proyectos/PukaDigital/lib/piezas/capturas.ts#L11) y su constante `AVISO` se mantienen inalterados. La única captura de pantalla utilizada en el mes (`validar-receta.png` en `podologo-no-receta`) cuenta con su archivo correspondiente y su tratamiento de datos ficticios.
