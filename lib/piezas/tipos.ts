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
  slides: Slide[];
};

export type ErrorValidacion = {
  pieza: string;
  slide?: number;
  campo: string;
  mensaje: string;
};
