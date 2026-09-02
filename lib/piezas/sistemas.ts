import type { Sistema } from './tipos.ts';

export type TokensSistema = {
  nombre: string;
  fondo: string;
  tinta: string;
  acento: string;
  apoyo: string;
  suave?: string;
  glass: string | null;
  borde: string;
  pegaso: boolean;
};

export const sistemas: Record<Sistema, TokensSistema> = {
  puka: {
    nombre: 'PukaDigital',
    fondo: '#080808',
    tinta: '#FFFFFF',
    acento: '#C7171E',
    apoyo: 'rgba(255,255,255,0.60)',
    glass: 'rgba(255,255,255,0.04)',
    borde: 'rgba(255,255,255,0.08)',
    pegaso: true,
  },
  health: {
    nombre: 'PukaHealth',
    fondo: '#FFFFFF',
    tinta: '#0F172B',
    acento: '#2563EB',
    apoyo: '#45556C',
    suave: '#EFF6FF',
    glass: null,
    borde: '#E2E8F0',
    pegaso: false,
  },
};

export const SISTEMAS = sistemas;
