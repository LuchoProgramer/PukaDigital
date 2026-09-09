export type Formato = '4x5' | '1x1' | '9x16';
export type Sistema = 'puka' | 'health';
export type NombreSistema = Sistema;

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
  slides: Slide[];
};

export type ErrorValidacion = {
  pieza: string;
  slide?: number;
  campo: string;
  mensaje: string;
};
