/**
 * El CMS entrega también los borradores (`status: 'draft'`) en su API pública, y guarda la
 * «Fecha de Publicación» sin aplicarla. Aquí se decide qué sale en el sitio: listado, post,
 * sitemap y proxy.
 */

// Ecuador continental es UTC-5 todo el año, sin horario de verano.
const ZONA_ECUADOR = '-05:00';

/**
 * La fecha de publicación del post. El input del CMS guarda «2026-10-15T09:00» sin zona: esa
 * hora es la de Ecuador. Una fecha con zona (ISO con Z) se respeta tal cual.
 */
export function fechaDePublicacion(post: { publishDate?: unknown }): Date | null {
  const valor = post.publishDate;
  if (typeof valor !== 'string' || !valor) return null;
  const sinZona = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(valor);
  const fecha = new Date(sinZona ? `${valor}${ZONA_ECUADOR}` : valor);
  return isNaN(fecha.getTime()) ? null : fecha;
}

/** Sale en el sitio si está publicado y su fecha de publicación, si tiene, ya llegó. */
export function estaPublicado(
  post: { status?: unknown; publishDate?: unknown } | null | undefined,
  ahora: Date = new Date(),
): boolean {
  if (post?.status !== 'published') return false;
  const fecha = fechaDePublicacion(post);
  return !fecha || fecha.getTime() <= ahora.getTime();
}
