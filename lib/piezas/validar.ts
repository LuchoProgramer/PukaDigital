import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CATALOGO, ofertasEn, preciosEn } from './catalogo.ts';
import { afirmacionesProhibidas } from './prohibidas.ts';
import { formatosDe } from './formatos.ts';
import type { ErrorValidacion, Pieza, Slide } from './tipos.ts';

export type { ErrorValidacion } from './tipos.ts';

const TOPES = {
  titular: 60,
  titular9x16: 48,
  bajada: 140,
  badge: 24,
  valor: 8,
  etiqueta: 16,
  cta: 24,
} as const;

const MAX_PALABRAS_TITULAR = 9;
const MAX_SLIDES = 10;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Los textos de una slide, en el orden en que se reportan los errores. */
function textos(slide: Slide): Array<[string, string]> {
  const pares: Array<[string, string]> = [
    ['titular', slide.titular],
    ['bajada', slide.bajada ?? ''],
    ['badge', slide.badge ?? ''],
    ['dato.valor', slide.dato?.valor ?? ''],
    ['dato.etiqueta', slide.dato?.etiqueta ?? ''],
    ['cta', slide.cta ?? ''],
  ];
  return pares.filter(([, texto]) => texto !== '');
}

/**
 * Valida un array de piezas de redes sociales contra las reglas de diseño y contenido.
 * Función pura: devuelve un array con los errores encontrados (vacío si todo es válido).
 * Nunca recorta texto ni ajusta tamaños.
 */
export function validar(piezas: Pieza[]): ErrorValidacion[] {
  const errores: ErrorValidacion[] = [];
  const vistos = new Set<string>();

  for (const pieza of piezas) {
    const en = (campo: string, mensaje: string, slide?: number) => {
      errores.push({
        pieza: pieza.id,
        ...(slide !== undefined ? { slide } : {}),
        campo,
        mensaje,
      });
    };

    if (!KEBAB.test(pieza.id)) {
      en('id', 'el id debe ser kebab-case');
    }
    if (vistos.has(pieza.id)) {
      en('id', 'id duplicado dentro del array');
    }
    vistos.add(pieza.id);

    if (pieza.slides.length === 0) {
      en('slides', 'la pieza debe tener al menos una slide');
    } else if (pieza.slides.length > MAX_SLIDES) {
      en('slides', `${pieza.slides.length} slides, el tope de carrusel de Instagram son ${MAX_SLIDES}`);
    }

    // Hechos comerciales: el sistema visual lo manda el producto, no el autor.
    const producto = pieza.producto ? CATALOGO[pieza.producto] : undefined;
    if (producto && pieza.sistema !== producto.sistema) {
      en(
        'sistema',
        `${producto.nombre} usa el sistema '${producto.sistema}', no '${pieza.sistema}'`,
      );
    }

    // Una fecha con formato malo no da error en ninguna parte: `aUTC()` devuelve
    // NaN y `pendientes*` la descarta con un `return false` mudo. La pieza no
    // sale, y no hay nada en los logs que lo explique. Se caza aquí o no se caza.
    const fechaValida = (valor: string) =>
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor) &&
      !Number.isNaN(new Date(`${valor}:00.000Z`).getTime()) &&
      // `new Date('2026-09-31')` no falla: rueda al 1 de octubre. Comparar el
      // día de vuelta es lo único que caza un día que no existe.
      new Date(`${valor}:00.000Z`).toISOString().slice(8, 10) === valor.slice(8, 10);

    if (pieza.publicarEl && !fechaValida(pieza.publicarEl)) {
      en('publicarEl', `«${pieza.publicarEl}» no es una fecha válida: se escribe YYYY-MM-DDTHH:mm`);
    }

    // Validación del bloque facebook
    if (pieza.facebook) {
      // ⚠️ El caption se comprueba exista o no `facebook.publicarEl`: sin él la
      // fecha cae a la franja siguiente, así que la pieza se publica igual. Y un
      // caption vacío no cae al compositor —`'' ?? componer(p)` devuelve `''`,
      // porque `??` solo mira null y undefined—, así que saldría un post en
      // blanco. En cada corrida, además: `yaPublicada('')` es false y nunca lo
      // reconoce como ya publicado.
      if (pieza.facebook.publicarEl && pieza.facebook.caption === undefined) {
        en('facebook.caption', 'la pieza declara facebook.publicarEl pero no tiene facebook.caption');
      } else if (
        pieza.facebook.caption !== undefined &&
        pieza.facebook.caption.trim() === ''
      ) {
        en('facebook.caption', 'el caption de Facebook está vacío: quítalo para que lo componga desde las slides, o escríbelo');
      }
      if (pieza.facebook.publicarEl && !fechaValida(pieza.facebook.publicarEl)) {
        en('facebook.publicarEl', `«${pieza.facebook.publicarEl}» no es una fecha válida: se escribe YYYY-MM-DDTHH:mm`);
      }

      const img = pieza.facebook.imagen;
      if (img) {
        const titular = img.titular?.trim() ?? '';
        if (titular === '') {
          en('facebook.imagen.titular', 'el titular de la imagen de Facebook está vacío');
        } else {
          // Los mismos topes que una slide: si no cabe grande, está mal escrito.
          const palabras = titular.split(/\s+/).length;
          if (palabras > MAX_PALABRAS_TITULAR) {
            en(
              'facebook.imagen.titular',
              `${palabras} palabras, máximo ${MAX_PALABRAS_TITULAR}: si no cabe grande, está mal escrito`,
            );
          }
          if (titular.length > TOPES.titular) {
            en('facebook.imagen.titular', `${titular.length} caracteres, máximo ${TOPES.titular}`);
          }
        }

        if (img.dato) {
          if (!img.dato.valor?.trim()) en('facebook.imagen.dato.valor', 'el valor del dato está vacío');
          if (!img.dato.etiqueta?.trim()) en('facebook.imagen.dato.etiqueta', 'la etiqueta del dato está vacía');
        }

        if (img.captura && !existsSync(join(process.cwd(), 'assets', 'capturas', img.captura))) {
          en('facebook.imagen.captura', `la captura ${img.captura} no existe en assets/capturas/`);
        }
      }
    }

    // Un precio o una oferta sin producto declarado no se puede verificar.
    // Aplica a slides y a ambos captions.
    if (!producto) {
      const vendeEnSlides = pieza.slides.some((slide) =>
        textos(slide).some(([, t]) => preciosEn(t).length > 0 || ofertasEn(t).length > 0),
      );
      const vendeEnCaption =
        (pieza.caption && (preciosEn(pieza.caption).length > 0 || ofertasEn(pieza.caption).length > 0)) ||
        (pieza.facebook?.caption &&
          (preciosEn(pieza.facebook.caption).length > 0 || ofertasEn(pieza.facebook.caption).length > 0));

      if (vendeEnSlides || vendeEnCaption) {
        en('producto', 'la pieza anuncia un precio o una oferta sin declarar que producto es');
      }
    }

    // Validar afirmaciones prohibidas, precios y ofertas en captions
    const captionsAValidar: Array<[string, string | undefined]> = [
      ['caption', pieza.caption],
      ['facebook.caption', pieza.facebook?.caption],
      // La imagen se valida igual que un caption: un precio falso impreso en un
      // PNG es peor que en un texto, porque sobrevive a la captura de pantalla.
      ['facebook.imagen.titular', pieza.facebook?.imagen?.titular],
      ['facebook.imagen.dato', pieza.facebook?.imagen?.dato
        ? `${pieza.facebook.imagen.dato.valor} ${pieza.facebook.imagen.dato.etiqueta}`
        : undefined],
    ];

    for (const [campo, texto] of captionsAValidar) {
      if (!texto || texto.trim() === '') continue;

      if (pieza.producto === 'pukahealth') {
        for (const p of afirmacionesProhibidas(texto)) {
          en(campo, `${p.motivo}. En cambio: ${p.enCambio}`);
        }
      }

      if (producto) {
        const ajenos = pieza.preciosAjenos ?? [];
        for (const precio of preciosEn(texto)) {
          if (!producto.precios.includes(precio) && !ajenos.includes(precio)) {
            const permitidos = producto.precios.length > 0
              ? `los de ${producto.nombre} son ${producto.precios.map((p) => `$${p}`).join(', ')}`
              : `${producto.nombre} no lleva precio visible: se cotiza por WhatsApp`;
            en(campo, `$${precio} no es un precio de ${producto.nombre}: ${permitidos}`);
          }
        }
        for (const oferta of ofertasEn(texto)) {
          if (!producto.ofertas.includes(oferta)) {
            const permitidas = producto.ofertas.length > 0
              ? `la de ${producto.nombre} es '${producto.ofertas.join("', '")}'`
              : `${producto.nombre} no tiene oferta de gratuidad`;
            en(campo, `'${oferta}' no es la oferta de ${producto.nombre}: ${permitidas}`);
          }
        }
      }
    }

    const formatos = formatosDe(pieza);
    const topeTitular = formatos.includes('9x16')
      ? TOPES.titular9x16
      : TOPES.titular;

    pieza.slides.forEach((slide, i) => {
      const n = i + 1;
      const ultima = i === pieza.slides.length - 1;

      const palabras = slide.titular.trim().split(/\s+/).filter(Boolean).length;
      if (palabras > MAX_PALABRAS_TITULAR) {
        en(
          'titular',
          `${palabras} palabras, máximo ${MAX_PALABRAS_TITULAR}: si no cabe grande, está mal escrito`,
          n
        );
      } else if (slide.titular.length > topeTitular) {
        en('titular', `${slide.titular.length} caracteres, máximo ${topeTitular}`, n);
      }

      if (slide.bajada && slide.bajada.length > TOPES.bajada) {
        en('bajada', `${slide.bajada.length} caracteres, máximo ${TOPES.bajada}`, n);
      }

      if (slide.badge && slide.badge.length > TOPES.badge) {
        en('badge', `${slide.badge.length} caracteres, máximo ${TOPES.badge}`, n);
      }

      if (slide.dato) {
        if (slide.dato.valor.length > TOPES.valor) {
          en('dato.valor', `${slide.dato.valor.length} caracteres, máximo ${TOPES.valor}`, n);
        }
        if (slide.dato.etiqueta.length > TOPES.etiqueta) {
          en('dato.etiqueta', `${slide.dato.etiqueta.length} caracteres, máximo ${TOPES.etiqueta}`, n);
        }
      }

      if (slide.cta) {
        if (!ultima) {
          en('cta', 'el CTA solo puede aparecer en la última slide de la pieza', n);
        } else if (slide.cta.length > TOPES.cta) {
          en('cta', `${slide.cta.length} caracteres, máximo ${TOPES.cta}`, n);
        }
      }

      if (!producto) return;

      for (const [campo, texto] of textos(slide)) {
        // Lo que el producto no hace. Solo PukaHealth: en los demas productos
        // estas frases pueden ser ciertas.
        if (pieza.producto === 'pukahealth') {
          for (const p of afirmacionesProhibidas(texto)) {
            en(campo, `${p.motivo}. En cambio: ${p.enCambio}`, n);
          }
        }

        const ajenos = pieza.preciosAjenos ?? [];
        for (const precio of preciosEn(texto)) {
          if (!producto.precios.includes(precio) && !ajenos.includes(precio)) {
            const permitidos = producto.precios.length > 0
              ? `los de ${producto.nombre} son ${producto.precios.map((p) => `$${p}`).join(', ')}`
              : `${producto.nombre} no lleva precio visible: se cotiza por WhatsApp`;
            en(campo, `$${precio} no es un precio de ${producto.nombre}: ${permitidos}`, n);
          }
        }
        for (const oferta of ofertasEn(texto)) {
          if (!producto.ofertas.includes(oferta)) {
            const permitidas = producto.ofertas.length > 0
              ? `la de ${producto.nombre} es '${producto.ofertas.join("', '")}'`
              : `${producto.nombre} no tiene oferta de gratuidad`;
            en(campo, `'${oferta}' no es la oferta de ${producto.nombre}: ${permitidas}`, n);
          }
        }
      }
    });
  }

  return errores;
}

export function formatear(errores: ErrorValidacion[]): string {
  return errores
    .map((e) => `  ${e.pieza}${e.slide ? ` · slide ${e.slide}` : ''} · ${e.campo}: ${e.mensaje}`)
    .join('\n');
}
