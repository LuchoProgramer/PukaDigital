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
   * Cuándo publicarla, en hora de Ecuador: `2026-09-09T09:00`.
   * Sin este campo, la pieza no entra en el cron y solo se publica a mano.
   */
  publicarEl?: string;
  slides: Slide[];
};

export type ErrorValidacion = {
  pieza: string;
  slide?: number;
  campo: string;
  mensaje: string;
};
