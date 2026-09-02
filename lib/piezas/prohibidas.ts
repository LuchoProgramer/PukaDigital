/**
 * Afirmaciones que el producto no cumple.
 *
 * Verificadas contra el código de `SistemaSalud` el 2026-09-02. Están aquí y no
 * en un documento porque la memoria falla: si el bloqueo depende de que alguien
 * recuerde la lista, algún día no la recuerda. En salud, publicar algo falso
 * pesa más que en cualquier otro producto.
 *
 * Detalle completo en `docs/PUKAHEALTH_LIMITES.md`.
 */
export type Prohibida = {
  nombre: string;
  patron: RegExp;
  motivo: string;
  enCambio: string;
};

export const PROHIBIDAS: Prohibida[] = [
  {
    nombre: 'especialidades',
    patron: /(cualquier|toda|todas las|cada)\s+especialidad/,
    motivo: 'Solo hay una especialidad implementada: podología. Las demás caen a un formulario genérico',
    enCambio: '«la arquitectura permite sumar especialidades sin reescribir el sistema»',
  },
  {
    nombre: 'whatsapp',
    patron: /(recordatorio|recordatorios|aviso|avisos|notificacion|notificaciones)[^.]{0,40}whatsapp/,
    motivo: 'El enganche entre el sistema clínico y el bot de WhatsApp no está construido',
    enCambio: 'no prometerlo hasta que exista',
  },
  {
    nombre: 'calendar-bidireccional',
    // «bidireccional» a secas basta: en este producto siempre es falso, y el
    // patron anterior exigia «calendar» cerca, asi que se colaba.
    patron: /bidireccional|dos v[ií]as|se sincroniza\w*\s+con\s+(tu\s+)?google/,
    motivo: 'Google Calendar es unidireccional: sistema → Google. Si el médico mueve la cita en su Google, el sistema no se entera',
    enCambio: '«tus citas se envían a tu Google Calendar»',
  },
  {
    nombre: 'app-nativa',
    patron: /(nuestra|la)\s+app\b|descarga\s+la\s+app|app\s+nativa/,
    motivo: 'Es una web instalable, no una app nativa',
    enCambio: '«funciona en el celular»',
  },
  {
    nombre: 'firma-electronica',
    patron: /firma\s+(electr[oó]nica|digital|criptogr[aá]fica)\s+(del|de la)\s+(profesional|m[eé]dico)/,
    motivo: 'Hay autoría, timestamp y auditoría, pero no firma criptográfica del profesional',
    enCambio: '«queda registrado quién y cuándo»',
  },
  {
    nombre: 'reservas-paciente',
    patron: /(paciente|pacientes)[^.]{0,30}(reserva|agenda|agendan?)\s+(solo|por su cuenta|en l[ií]nea)/,
    motivo: 'No hay portal de reservas para el paciente. Es una decisión deliberada, no un pendiente',
    enCambio: 'no mencionarlo',
  },
  {
    nombre: 'precio-beta',
    patron: /(precio\s+beta|\$\s?25\s*\/?\s*mes|25\s+al\s+mes)/,
    motivo: 'El precio beta de $25 nunca existió: salió de un estudio de mercado de LedgerXpertz y se copió por error',
    enCambio: '$50/mes o $480/año, que son los públicos',
  },
];

/** Quita tildes, baja a minúsculas y colapsa espacios: así se cuela el error. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function afirmacionesProhibidas(texto: string): Prohibida[] {
  const t = normalizar(texto);
  return PROHIBIDAS.filter((p) => p.patron.test(t));
}
