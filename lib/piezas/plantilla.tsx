import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Formato, Slide } from './tipos.ts';
import { FORMATOS, MARGEN } from './formatos.ts';
import type { TokensSistema } from './sistemas.ts';

const DIR_MARCA = join(process.cwd(), 'assets', 'marca');

function cargarDataUri(archivo: string): string {
  const buf = readFileSync(join(DIR_MARCA, archivo));
  return `data:image/svg+xml;base64,${buf.toString('base64')}`;
}

// Cargar logos de marca embebidos como base64 data URI para Satori
const LOGO_PEGASO = cargarDataUri('pegaso-rojo.svg');
const LOGO_HEALTH = cargarDataUri('pukahealth-logo.svg');

export type PlantillaProps = {
  slide: Slide;
  tokens: TokensSistema;
  formato: Formato;
  indice?: number;
  total?: number;
};

/**
 * Plantilla paramétrica para renderizar una Slide en Satori.
 * Maneja composición adaptativa para cualquier combinación de slots opcionales,
 * respetando márgenes inmutables (88px) y zonas seguras por formato.
 */
export function Plantilla({
  slide,
  tokens,
  formato,
  indice = 1,
  total = 1,
}: PlantillaProps) {
  const medidas = FORMATOS[formato];
  const padTop = MARGEN + medidas.seguroArriba;
  const padBottom = MARGEN + medidas.seguroAbajo;
  const padHorizontal = MARGEN;

  const esPuka = tokens.pegaso;
  const esCarrusel = total > 1;

  // Ajuste fino tipográfico según densidad de slots y formato
  const tieneDato = Boolean(slide.dato);
  const tieneBajada = Boolean(slide.bajada);
  const tieneCta = Boolean(slide.cta);
  const tieneBadge = Boolean(slide.badge);
  const totalSlots = [tieneBadge, tieneBajada, tieneDato, tieneCta].filter(Boolean).length;

  let titularSize = 66;
  if (formato === '1x1') {
    titularSize = totalSlots >= 3 ? 48 : totalSlots >= 1 ? 54 : 62;
  } else if (formato === '9x16') {
    titularSize = totalSlots >= 3 ? 54 : totalSlots >= 1 ? 60 : 68;
  } else {
    // 4x5
    titularSize = totalSlots >= 3 ? 56 : totalSlots >= 1 ? 62 : 70;
  }

  const logoUri = esPuka ? LOGO_PEGASO : LOGO_HEALTH;
  const logoWidth = esPuka ? 52 : 44;
  const logoHeight = 44;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: medidas.ancho,
        height: medidas.alto,
        backgroundColor: tokens.fondo,
        color: tokens.tinta,
        paddingTop: padTop,
        paddingBottom: padBottom,
        paddingLeft: padHorizontal,
        paddingRight: padHorizontal,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Resplandor tenue de marca para Dark Glass Rojo */}
      {esPuka && (
        <div
          style={{
            position: 'absolute',
            top: formato === '9x16' ? '30%' : '25%',
            left: '15%',
            width: 750,
            height: 750,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(199, 23, 30, 0.14) 0%, rgba(8, 8, 8, 0) 70%)',
            display: 'flex',
          }}
        />
      )}

      {/* HEADER: Logo de marca + Nombre + Contador de carrusel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <img
            src={logoUri}
            width={logoWidth}
            height={logoHeight}
            style={{ display: 'flex' }}
            alt={tokens.nombre}
          />
          <span
            style={{
              fontFamily: 'Instrument Sans',
              fontSize: 22,
              fontWeight: 600,
              color: tokens.tinta,
              letterSpacing: '-0.02em',
            }}
          >
            {tokens.nombre}
          </span>
        </div>

        {esCarrusel && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'JetBrains Mono',
              fontSize: 18,
              fontWeight: 500,
              color: tokens.apoyo,
              backgroundColor: tokens.glass || 'rgba(0,0,0,0.04)',
              padding: '6px 16px',
              borderRadius: 9999,
              border: `1px solid ${tokens.borde}`,
            }}
          >
            {String(indice).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* CUERPO CENTRAL: Badge + Titular + Bajada + Dato + CTA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          gap: formato === '1x1' ? 18 : 24,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {/* Slot: Badge */}
        {slide.badge && (
          <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: 9999,
                backgroundColor:
                  tokens.glass || tokens.suave || 'rgba(37,99,235,0.08)',
                border: `1px solid ${
                  esPuka ? 'rgba(255,255,255,0.12)' : 'rgba(37,99,235,0.25)'
                }`,
                color: esPuka ? tokens.tinta : tokens.acento,
                fontSize: 15,
                fontFamily: 'Instrument Sans',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {slide.badge}
            </div>
          </div>
        )}

        {/* Slot: Titular */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'Bricolage Grotesque',
            fontSize: titularSize,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: tokens.tinta,
            maxWidth: '100%',
          }}
        >
          {slide.titular}
        </div>

        {/* Slot: Bajada */}
        {slide.bajada && (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Instrument Sans',
              fontSize: formato === '1x1' ? 24 : 26,
              fontWeight: 400,
              lineHeight: 1.4,
              color: tokens.apoyo,
              maxWidth: 860,
            }}
          >
            {slide.bajada}
          </div>
        )}

        {/* Slot: Dato numérico / métrica */}
        {slide.dato && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: formato === '1x1' ? '18px 26px' : '22px 30px',
              borderRadius: 18,
              backgroundColor: tokens.glass || tokens.suave || '#F8FAFC',
              border: `1px solid ${tokens.borde}`,
              gap: 4,
              alignSelf: 'flex-start',
              maxWidth: '100%',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: formato === '1x1' ? 44 : 52,
                fontWeight: 500,
                color: esPuka ? tokens.tinta : tokens.acento,
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {slide.dato.valor}
            </span>
            <span
              style={{
                fontFamily: 'Instrument Sans',
                fontSize: 17,
                fontWeight: 400,
                color: tokens.apoyo,
                lineHeight: 1.3,
              }}
            >
              {slide.dato.etiqueta}
            </span>
          </div>
        )}

        {/* Slot: CTA */}
        {slide.cta && (
          <div style={{ display: 'flex', marginTop: 6 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 32px',
                borderRadius: 12,
                backgroundColor: tokens.acento,
                color: '#FFFFFF',
                fontFamily: 'Instrument Sans',
                fontSize: 20,
                fontWeight: 600,
                boxShadow: esPuka
                  ? '0 0 24px rgba(199,23,30,0.45)'
                  : '0 4px 14px rgba(37,99,235,0.25)',
                letterSpacing: '-0.01em',
              }}
            >
              {slide.cta}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER: Firma de marca y canal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* En health el punto rojo de 8px es la única presencia de #C7171E */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#C7171E',
              display: 'flex',
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontFamily: 'Instrument Sans',
              fontWeight: 500,
              color: tokens.apoyo,
            }}
          >
            {esPuka ? 'pukadigital.com' : 'por PukaDigital'}
          </span>
        </div>

        <span
          style={{
            fontSize: 18,
            fontFamily: 'Instrument Sans',
            fontWeight: 400,
            color: tokens.apoyo,
          }}
        >
          @pukadigital
        </span>
      </div>
    </div>
  );
}

export const plantilla = Plantilla;
export default Plantilla;
