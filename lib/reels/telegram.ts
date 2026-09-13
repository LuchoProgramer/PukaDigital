// lib/reels/telegram.ts
/** El caption de un video admite 1024 caracteres en la Bot API. */
export const MAX_CAPTION = 1024;

export type OpcionesTelegram = {
  token: string;
  chatId: string;
  /** Inyectable para probar sin red. */
  fetchImpl?: typeof fetch;
};

/**
 * Manda el MP4 al chat para verlo en el teléfono, con sonido, que es como lo verá
 * la gente. Con `sendVideo` y el archivo subido, no con la URL: la Bot API admite
 * 50 MB subiendo y solo 20 por URL, y `sendDocument` no se reproduce en el chat.
 *
 * Quien llama decide qué hacer si falla. En la producción no es fatal: el render
 * y la subida ya costaron minutos.
 */
export async function enviarVideo(
  archivo: { nombre: string; bytes: Uint8Array },
  caption: string,
  opciones: OpcionesTelegram,
): Promise<void> {
  const hacer = opciones.fetchImpl ?? fetch;
  const formulario = new FormData();
  formulario.append('chat_id', opciones.chatId);
  formulario.append('caption', caption.slice(0, MAX_CAPTION));
  formulario.append('supports_streaming', 'true');
  formulario.append(
    'video',
    new Blob([new Uint8Array(archivo.bytes)], { type: 'video/mp4' }),
    archivo.nombre,
  );

  const res = await hacer(`https://api.telegram.org/bot${opciones.token}/sendVideo`, {
    method: 'POST',
    body: formulario,
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || !json.ok) {
    // La descripción de Telegram, nunca la URL: lleva el token dentro.
    throw new Error(`Telegram rechazo el video: ${json.description ?? `HTTP ${res.status}`}`);
  }
}
