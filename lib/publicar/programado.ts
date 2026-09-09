import { componer } from '../captions/componer.ts';
import type { Pieza } from '../piezas/tipos.ts';

/** Ecuador es UTC-5 todo el año: no hay horario de verano que compensar. */
const DESFASE_ECUADOR_HORAS = 5;

/**
 * Cuánto margen tiene el cron para publicar una pieza. Si se pasa, no la
 * publica: más vale una pieza sin salir que una saliendo de madrugada, cuando
 * nadie la ve y encima descoloca el calendario.
 *
 * Fueron 90 mientras el cron vivía en el plan **Hobby** de Vercel, que documenta
 * una precisión de «per-hour (±59 min)»: un cron `0 23 * * *` saltaba en
 * cualquier momento hasta las 23:59, y con la ventana en 60 la pieza entraba por
 * un minuto — un minuto que se podía comer el arranque en frío, fallando en
 * silencio, porque una pieza fuera de ventana no da error: simplemente no sale.
 *
 * Desde el 2026-09-08 el cron corre en **Cloudflare Workers**, con precisión al
 * minuto. Medido en la primera publicación automática: pedida a las 09:00, salió
 * a las **09:03**. Los 90 minutos ya no compensan nada y solo ensanchan la
 * ventana en la que una pieza puede salir a deshora.
 *
 * 60 sigue dejando una hora de margen para un fallo puntual, y acota el daño: en
 * el peor caso una pieza de las 09:00 sale a las 10:00, no a las 10:30.
 */
const VENTANA_MINUTOS = 60;

/** `2026-09-09T09:00` en hora de Ecuador → el instante UTC equivalente. */
export function aUTC(local: string): Date {
  const comoSiFueraUTC = new Date(`${local}:00.000Z`).getTime();
  if (Number.isNaN(comoSiFueraUTC)) return new Date(NaN);
  return new Date(comoSiFueraUTC + DESFASE_ECUADOR_HORAS * 3600_000);
}

function normalizar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}

/**
 * Si el texto ya está en el perfil, la pieza salió antes. Es la defensa contra
 * publicar dos veces: no hay base de datos donde apuntar lo enviado, así que se
 * le pregunta a la red — a Instagram el `caption`, a Facebook el `message`.
 *
 * Recibe el texto y no la pieza justamente para servir a los dos canales.
 */
export function yaPublicada(
  texto: string | undefined,
  textosRecientes: string[],
): boolean {
  if (!texto || texto.trim() === '') return false;
  const mio = normalizar(texto);
  return textosRecientes.some((c) => normalizar(c) === mio);
}

/**
 * Calcula la franja horaria siguiente para publicar en Facebook:
 * - Publicaciones de las 09:00 salen a las 18:00 del mismo día.
 * - Publicaciones de las 18:00 salen a las 09:00 del día siguiente.
 */
export function franjaSiguiente(fechaLocal: string): string {
  const [fechaStr, horaStr] = fechaLocal.split('T');
  if (!fechaStr || !horaStr) return fechaLocal;

  const hora = horaStr.slice(0, 5);
  if (hora <= '09:00') {
    return `${fechaStr}T18:00`;
  }

  // 18:00 o posterior -> siguiente día a las 09:00
  const [y, m, d] = fechaStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);

  const ny = dt.getUTCFullYear();
  const nm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const nd = String(dt.getUTCDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}T09:00`;
}

/**
 * Obtiene la fecha programada para Facebook: explícita o calculada por franja siguiente.
 */
export function fechaPublicacionFacebook(pieza: Pieza): string | undefined {
  // Sin imagen no hay nada que publicar: el `-fb.png` no se genera, asi que
  // programarla terminaria pidiendo al CDN un archivo que no existe.
  if (!pieza.facebook?.imagen) return undefined;
  if (pieza.facebook.publicarEl) return pieza.facebook.publicarEl;
  if (pieza.publicarEl) return franjaSiguiente(pieza.publicarEl);
  return undefined;
}

/**
 * Obtiene el caption a publicar en Facebook: explícito o compuesto desde slides.
 */
export function captionFacebook(pieza: Pieza): string {
  return pieza.facebook?.caption ?? componer(pieza);
}

/**
 * Piezas pendientes para publicar en Instagram.
 */
export function pendientesInstagram(
  piezas: Pieza[],
  ahora: Date,
  captionsRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    if (!pieza.publicarEl || !pieza.caption) return false;

    const cuando = aUTC(pieza.publicarEl);
    if (Number.isNaN(cuando.getTime())) return false;

    const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
    if (minutos < 0 || minutos > VENTANA_MINUTOS) return false;

    return !yaPublicada(pieza.caption, captionsRecientes);
  });
}

/**
 * Piezas pendientes para publicar en Facebook.
 */
export function pendientesFacebook(
  piezas: Pieza[],
  ahora: Date,
  mensajesRecientes: string[],
): Pieza[] {
  return piezas.filter((pieza) => {
    const fecha = fechaPublicacionFacebook(pieza);
    if (!fecha) return false;

    const cuando = aUTC(fecha);
    if (Number.isNaN(cuando.getTime())) return false;

    const minutos = (ahora.getTime() - cuando.getTime()) / 60_000;
    if (minutos < 0 || minutos > VENTANA_MINUTOS) return false;

    const texto = captionFacebook(pieza);
    return !yaPublicada(texto, mensajesRecientes);
  });
}

/** Alias de compatibilidad hacia atrás para Instagram. */
export const pendientes = pendientesInstagram;
