export const HOST_OFICIAL = 'pukadigital.com';

/**
 * `host` es el header Host de la petición. Manda sobre `url`: con `next start` (y según el
 * runtime), `request.nextUrl` trae el host interno y no el que pidió el navegador.
 */
export function redireccionWww(url: URL, host?: string | null): URL | null {
  const nombre = (host ?? url.host).split(':')[0].toLowerCase();
  if (nombre === `www.${HOST_OFICIAL}`) {
    return new URL(`https://${HOST_OFICIAL}${url.pathname}${url.search}`);
  }
  return null;
}

export const CABECERAS_SEGURIDAD: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
};

export function conCabeceras<T extends { headers: Headers }>(respuesta: T): T {
  for (const [clave, valor] of Object.entries(CABECERAS_SEGURIDAD)) {
    respuesta.headers.set(clave, valor);
  }
  return respuesta;
}
