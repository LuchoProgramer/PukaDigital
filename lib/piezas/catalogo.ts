import type { ProductoId, Sistema } from './tipos.ts';

/**
 * Los hechos comerciales de cada producto, copiados de la tabla canónica de
 * AGENTS.md. Existe para que una pieza no pueda anunciar un precio que no es
 * del producto que dice estar anunciando.
 */
export type Producto = {
  nombre: string;
  /** URL canónica. Una sola por producto. */
  url: string;
  /** Qué sistema visual le corresponde. Solo PukaHealth tiene el suyo. */
  sistema: Sistema;
  /** Precios permitidos, sin símbolo. Lista vacía = sin precio visible. */
  precios: string[];
  /** Ofertas de gratuidad permitidas, ya normalizadas (sin tildes). */
  ofertas: string[];
};

export const CATALOGO: Record<ProductoId, Producto> = {
  agencia: {
    nombre: 'Agencia',
    url: '/agencia',
    sistema: 'puka',
    precios: [],
    ofertas: [],
  },
  pukaia: {
    nombre: 'PukaIA',
    url: '/agentes-ia',
    sistema: 'puka',
    precios: ['14.99', '25', '60'],
    ofertas: ['1 mes gratis'],
  },
  ledgerxpertz: {
    nombre: 'LedgerXpertz',
    url: '/ledgerxpertz',
    sistema: 'puka',
    precios: ['15', '20', '25'],
    ofertas: ['2 meses gratis'],
  },
  pukahealth: {
    nombre: 'PukaHealth',
    url: '/pukahealth',
    sistema: 'health',
    precios: ['50', '480'],
    ofertas: ['30 dias gratis'],
  },
  pukasalud: {
    nombre: 'PukaSalud',
    url: '/salud',
    sistema: 'puka',
    precios: [],
    ofertas: [],
  },
  'desarrollo-web': {
    nombre: 'Desarrollo web',
    url: '/desarrollo-web-pymes',
    sistema: 'puka',
    precios: [],
    ofertas: [],
  },
};

/** Quita tildes y baja a minúsculas, para comparar texto escrito a mano. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** Extrae los precios de un texto. Exige el símbolo: «100%» no es un precio. */
export function preciosEn(texto: string): string[] {
  const encontrados = texto.matchAll(/\$\s*(\d+(?:[.,]\d{1,2})?)/g);
  return [...encontrados].map((m) => m[1].replace(',', '.'));
}

/** Extrae las promesas de gratuidad: «30 días gratis», «1 mes gratis». */
export function ofertasEn(texto: string): string[] {
  const encontradas = normalizar(texto).matchAll(
    /(\d+)\s+(dias?|mes(?:es)?)\s+grati\w*/g,
  );
  return [...encontradas].map((m) => `${m[1]} ${m[2]} gratis`);
}
