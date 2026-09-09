import { AVISO, FONDO_AVISO, cargarCaptura, medidasAviso } from './capturas.ts';
import { FORMATOS, MARGEN } from './formatos.ts';
import type { TokensSistema } from './sistemas.ts';

export type ImagenFacebook = {
  titular: string;
  dato?: { valor: string; etiqueta: string };
  captura?: string;
};

type Props = {
  imagen: ImagenFacebook;
  tokens: TokensSistema;
};

/**
 * La pieza que sale en Facebook, que NO es una slide de carrusel.
 *
 * Tres diferencias con `Plantilla`, y las tres tienen motivo:
 *
 * 1. **Sin contador `01 / 05`.** Es un post de una sola foto: ese contador
 *    prometeria cuatro imagenes que no existen. Fue el defecto del primer post
 *    real, el 2026-09-09.
 * 2. **Solo titular y dato.** Cada franja de texto mas compite por la atencion
 *    en una imagen que se ve de paso. Lo demas va al caption.
 * 3. **La captura es prueba, no decoracion**: va debajo del titular, con su
 *    aviso de datos ficticios pegado.
 */
export function PlantillaFacebook({ imagen, tokens }: Props) {
  const medidas = FORMATOS['4x5'];
  const anchoUtil = medidas.ancho - MARGEN * 2;
  const aviso = medidasAviso(medidas.alto, anchoUtil);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: medidas.ancho,
        height: medidas.alto,
        padding: MARGEN,
        backgroundColor: tokens.fondo,
        color: tokens.tinta,
        fontFamily: 'Instrument Sans',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Bricolage Grotesque',
          fontWeight: tokens.pegaso ? 800 : 700,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          // ⚠️ NO QUITAR. Sin esto Satori normaliza el \n como espacio y el
          // titular sale en una sola linea. Medido el 2026-09-09: 48px con
          // whiteSpace por defecto, 96px con pre-line.
          whiteSpace: 'pre-line',
        }}
      >
        {imagen.titular}
      </div>

      {imagen.dato && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 32 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontSize: 72,
              color: tokens.acento,
            }}
          >
            {imagen.dato.valor}
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: tokens.apoyo }}>
            {imagen.dato.etiqueta}
          </div>
        </div>
      )}

      {imagen.captura && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${tokens.borde}`,
          }}
        >
          <img src={cargarCaptura(imagen.captura)} width={anchoUtil} />
          {/* El aviso va pegado a la captura, no al pie de la pieza. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: anchoUtil,
              height: aviso.alto,
              backgroundColor: FONDO_AVISO,
              color: '#FFFFFF',
              fontSize: aviso.fuente,
            }}
          >
            {AVISO}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', marginTop: 'auto', fontSize: 26, color: tokens.apoyo }}>
        pukadigital.com
      </div>
    </div>
  );
}
