export const HOST_OFICIAL = 'pukadigital.com';

export function redireccionWww(url: URL): URL | null {
  if (url.hostname === `www.${HOST_OFICIAL}` || url.host === `www.${HOST_OFICIAL}`) {
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
