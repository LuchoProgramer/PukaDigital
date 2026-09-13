// lib/reels/r2.ts
import { createHash } from 'node:crypto';

/**
 * La clave lleva los primeros 8 caracteres del SHA-256 del MP4. Con una clave
 * fija, re-renderizar tras corregir el guion deja la misma URL, y tanto la caché
 * de Cloudflare como la de Meta pueden servir el video viejo. Con el hash, cada
 * render es una URL nueva —hay que pegarla— y lo ya publicado no se toca.
 */
export function claveReel(mes: string, id: string, bytes: Uint8Array): string {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  return `reels/${mes}/${id}-${hash}.mp4`;
}

export function urlReel(base: string, clave: string): string {
  return `${base.replace(/\/+$/, '')}/${clave}`;
}

/**
 * Se sube con la sesión de `wrangler`, que ya está iniciada: sin SDK de S3 y sin
 * claves nuevas. `--remote` es lo que evita subirlo al R2 simulado de local.
 */
export function argumentosSubida(bucket: string, clave: string, archivo: string): string[] {
  return [
    'wrangler', 'r2', 'object', 'put', `${bucket}/${clave}`,
    '--file', archivo, '--remote', '--content-type', 'video/mp4',
  ];
}
