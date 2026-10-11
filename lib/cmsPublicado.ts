/**
 * El CMS entrega también los borradores (`status: 'draft'`) en su API pública.
 * Solo lo marcado como publicado sale en el sitio: listado, post, sitemap y proxy.
 */
export function estaPublicado(post: { status?: unknown } | null | undefined): boolean {
  return post?.status === 'published';
}
