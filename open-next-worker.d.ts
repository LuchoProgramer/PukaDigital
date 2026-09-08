/**
 * Declaracion del bundle que genera OpenNext, que `worker.ts` importa.
 *
 * ⚠️ Existe por una dependencia circular que el plan de migracion no previo:
 * `build:cloudflare` corre `npm run build`, cuyo `prebuild` incluye
 * `tsc --noEmit`, pero el propio `opennextjs-cloudflare build` **borra
 * `.open-next/` al empezar** y la regenera al final. Sin esta declaracion el
 * type check falla con TS2307 en un build limpio, y pasa por casualidad si
 * quedaron restos de un build anterior — que es peor, porque esconde el fallo.
 *
 * Declarar el modulo desacopla el type check del artefacto: `tsc` compila igual
 * con o sin `.open-next/` en disco. Wrangler resuelve el import de verdad al
 * empaquetar, ya con el bundle generado.
 *
 * La documentacion oficial resuelve lo mismo con `// @ts-ignore` sobre cada
 * import (https://opennext.js.org/cloudflare/howtos/custom-worker). Se prefiere
 * declarar el modulo porque `@ts-ignore` apaga **todos** los errores de esa
 * linea, incluidos los que aparezcan de verdad manana; esto da tipos reales.
 * Si esta declaracion se desincroniza del bundle, cambiar a @ts-ignore es una
 * salida legitima y documentada.
 */
declare module '*/.open-next/worker.js' {
  const handler: { fetch: (peticion: Request, entorno: unknown, contexto: unknown) => Promise<Response> };
  export default handler;
  export const DOQueueHandler: unknown;
  export const DOShardedTagCache: unknown;
  export const BucketCachePurge: unknown;
}
