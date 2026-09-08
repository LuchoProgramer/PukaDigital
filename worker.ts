import handler from './.open-next/worker.js';
import { publicarLoQueToca } from './lib/publicar/tanda.ts';

/**
 * Reexportar lo que genere OpenNext ademas del default, o wrangler no despliega.
 *
 * La documentacion oficial reexporta DOQueueHandler y DOShardedTagCache por
 * nombre (https://opennext.js.org/cloudflare/howtos/custom-worker). Aqui va un
 * `export *` porque el bundle real de la 1.20.6 exporta tres y no dos -- el
 * tercero es BucketCachePurge-- y una lista escrita a mano se queda vieja en
 * silencio cuando el adaptador anada el cuarto.
 */
export * from './.open-next/worker.js';

/**
 * El tipo de Workers que este archivo necesita, declarado aqui.
 *
 * ⚠️ NO instalar @cloudflare/workers-types ni declararlo en compilerOptions.types.
 * Sus tipos son interfaces globales ambientales -no se pueden importar sueltas- y
 * redefinen Response.json() como Promise<unknown> en vez del any que da lib.dom.
 * Eso rompe 12 sitios de app/ que hacen `await res.json()` y despues leen una
 * propiedad: generate-blog, indexnow, BlogListClient, demos y SmartChatbot.
 * Un `/// <reference types=...>` aqui tampoco sirve: aplica igual a todo el
 * programa. Comprobado el 2026-09-07.
 *
 * De ExecutionContext solo se usa waitUntil, y el evento no se usa en absoluto,
 * asi que la superficie que hace falta declarar es esta y nada mas.
 */
type ContextoDeEjecucion = { waitUntil(promesa: Promise<unknown>): void };

export default {
  fetch: handler.fetch,

  /**
   * El camino automatico de la publicacion. Cloudflare no dispara rutas HTTP:
   * invoca esto. La ruta `/api/cron/publicar` llama a la misma funcion, asi que
   * las dos puertas no pueden divergir.
   *
   * Los errores se registran y no se relanzan: que una tanda falle no debe
   * marcar el Worker como caido.
   */
  async scheduled(_evento: unknown, env: Record<string, string>, ctx: ContextoDeEjecucion) {
    const igUserId = env.IG_USER_ID;
    const token = env.IG_ACCESS_TOKEN;
    if (!igUserId || !token) {
      console.error('cron: faltan IG_USER_ID o IG_ACCESS_TOKEN');
      return;
    }

    ctx.waitUntil(
      publicarLoQueToca({ igUserId, token, ahora: new Date() })
        .then((r) => {
          // Sin el token ni el caption: esto acaba en los logs.
          console.log(`cron ${r.mes}: revisadas ${r.revisadas}, publicadas ` +
            `${r.publicadas.map((p) => p.id).join(',') || 'ninguna'}, ` +
            `fallidas ${r.fallidas.map((f) => `${f.id} (${f.error})`).join(',') || 'ninguna'}`);
        })
        .catch((e) => console.error(`cron: ${e instanceof Error ? e.message : e}`)),
    );
  },
};
