import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Configuración de OpenNext para Cloudflare Workers.
 *
 * `defineCloudflareConfig` genera la estructura requerida por el adaptador:
 * - default: wrapper 'cloudflare-node' y conversor 'edge'.
 * - middleware: external con wrapper 'cloudflare-edge'.
 * - edgeExternals: ['node:crypto'] para cálculo de claves de cache.
 *
 * Al no pasar argumentos (o un objeto vacío), el adaptador asigna 'dummy' a:
 * - incrementalCache (sin bucket R2 en esta fase inicial).
 * - tagCache (sin cache de tags).
 * - queue (sin colas de revalidación).
 * - cdnInvalidation (sin purga automática de CDN).
 */
export default defineCloudflareConfig();
