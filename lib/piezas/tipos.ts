export type Formato = '4x5' | '1x1' | '9x16';
export type Sistema = 'puka' | 'health';
export type NombreSistema = Sistema;

export interface FocoCaptura {
  /** Fracción del ancho de la imagen (0 a 1) sobre la que centrar el zoom */
  x: number;
  /** Fracción del alto de la imagen (0 a 1) sobre la que centrar el zoom */
  y: number;
  /** Factor de aumento (1.2 a 3, por defecto 2) */
  escala?: number;
}

export type Slide = {
  badge?: string;
  titular: string;
  bajada?: string;
  dato?: {
    valor: string;
    etiqueta: string;
  };
  cta?: string;
  /**
   * Captura del producto, archivo de `assets/capturas/`. La plantilla le estampa
   * encima el aviso de datos ficticios **siempre**, sin bandera para quitarlo:
   * distinguir cuándo hace falta es criterio, y el criterio falla.
   */
  captura?: string;
  /**
   * Encuadre del zoom para video/Reels. Solo aplica si hay captura.
   */
  foco?: FocoCaptura;
};

/** Los seis productos del catalogo. Ver catalogo.ts. */
export type ProductoId =
  | 'agencia'
  | 'pukaia'
  | 'ledgerxpertz'
  | 'pukahealth'
  | 'pukasalud'
  | 'desarrollo-web';

export type Pieza = {
  id: string;
  sistema: Sistema;
  /**
   * Que producto anuncia la pieza. Obligatorio en cuanto la pieza menciona un
   * precio o una oferta: sin el no hay forma de comprobar que el dato es cierto.
   * Las piezas de utilidad, que no venden nada, pueden omitirlo.
   */
  producto?: ProductoId;
  formatos?: Formato[];
  /** El texto del post. Va aparte del arte: es lo que se lee bajo la imagen. */
  caption?: string;
  /**
   * Precios que **no son nuestros**: los de la competencia en una comparativa.
   * Hay que declararlos uno a uno, sin el símbolo. Sin esto el validador los
   * confunde con un precio propio equivocado, que es lo que debe hacer: la
   * excepción se pide a mano, no se deduce.
   */
  preciosAjenos?: string[];
  /**
   * Cuándo publicarla, en hora de Ecuador: `2026-09-09T09:00`.
   * Sin este campo, la pieza no entra en el cron y solo se publica a mano.
   */
  publicarEl?: string;
  /**
   * Facebook. Si falta el bloque entero, la pieza igual se publica: el caption
   * se compone desde las slides y la fecha cae a la franja siguiente a la de
   * Instagram — 09:00 → 18:00 del mismo día; 18:00 → 09:00 del día siguiente.
   */
  facebook?: {
    caption?: string;
    publicarEl?: string;
    /**
     * La imagen que sale en Facebook. **No es la slide 1 del carrusel**: una
     * slide 1 es un gancho incompleto a propósito —existe para que deslices— y
     * sola en un feed no dice nada. Esta lleva la conclusión.
     *
     * Sin `bajada`, `badge` ni `cta`: cada uno es una franja de texto más
     * compitiendo por la atención en una imagen que se ve de paso. Lo que no
     * cabe en el titular va al caption.
     */
    imagen?: {
      /** Admite `\n` para cortar de línea a mano. Ver `plantillaFacebook.tsx`. */
      titular: string;
      dato?: { valor: string; etiqueta: string };
      /** Archivo de `assets/capturas/`. Recorte de la región de interés. */
      captura?: string;
    };
  };
  /**
   * El Reel de la pieza. **Sin este bloque no hay Reel**: ningún degradado
   * silencioso, igual que `facebook.imagen`. `video` y `duracion` los escribe
   * `npm run reels`; a mano no se tocan.
   *
   * Un tema ocupa cuatro franjas seguidas: carrusel, imagen de Facebook, Reel de
   * Instagram y Reel de Facebook. Ver la spec del 2026-09-13.
   */
  reel?: {
    /** El guion hablado. Lo escribe Gemini y lo revisa una persona en el PR. */
    guion: string;
    /**
     * El texto del post. **Distinto** del carrusel y del de Facebook: la defensa
     * contra repetidos compara texto, y con el mismo el Reel se daría por
     * publicado sin haber salido nunca.
     */
    caption: string;
    /** Hora de Ecuador del Reel de Instagram. El de Facebook va en la franja siguiente. */
    publicarEl?: string;
    /** URL pública del MP4 en R2. */
    video?: string;
    /** Segundos del MP4 renderizado, entre 3 y 90: el techo de Facebook. */
    duracion?: number;
  };
  slides: Slide[];
};

export type ErrorValidacion = {
  pieza: string;
  slide?: number;
  campo: string;
  mensaje: string;
};
