// lib/reels/telegram.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enviarVideo } from './telegram.ts';

const TOKEN = '123456:TOKEN-SECRETO-QUE-NUNCA-DEBE-APARECER';
const VIDEO = { nombre: 'crm-no-chatbot.mp4', bytes: new Uint8Array([1, 2, 3]) };

function fetchFalso(respuesta: unknown, ok = true) {
  const llamadas: Array<{ url: string; cuerpo: FormData }> = [];
  const impl = (async (url: string | URL, init?: RequestInit) => {
    llamadas.push({ url: String(url), cuerpo: init?.body as FormData });
    return { ok, status: ok ? 200 : 400, json: async () => respuesta } as Response;
  }) as unknown as typeof fetch;
  return { impl, llamadas };
}

test('sube el archivo con sendVideo, al chat indicado y reproducible en el chat', async () => {
  const { impl, llamadas } = fetchFalso({ ok: true });
  await enviarVideo(VIDEO, 'Caption del Reel', { token: TOKEN, chatId: '42', fetchImpl: impl });

  assert.equal(llamadas[0].url, `https://api.telegram.org/bot${TOKEN}/sendVideo`);
  assert.equal(llamadas[0].cuerpo.get('chat_id'), '42');
  assert.equal(llamadas[0].cuerpo.get('supports_streaming'), 'true');
  const video = llamadas[0].cuerpo.get('video') as File;
  assert.equal(video.name, 'crm-no-chatbot.mp4');
  assert.equal(video.size, 3);
});

test('el caption se recorta a 1024 caracteres, el máximo de Telegram', async () => {
  const { impl, llamadas } = fetchFalso({ ok: true });
  await enviarVideo(VIDEO, 'x'.repeat(2000), { token: TOKEN, chatId: '42', fetchImpl: impl });
  assert.equal(String(llamadas[0].cuerpo.get('caption')).length, 1024);
});

test('si Telegram lo rechaza, falla con su descripción y sin el token', async () => {
  const { impl } = fetchFalso({ ok: false, description: 'Bad Request: chat not found' }, false);
  await assert.rejects(
    () => enviarVideo(VIDEO, 'c', { token: TOKEN, chatId: '42', fetchImpl: impl }),
    (e: Error) => {
      assert.match(e.message, /chat not found/);
      assert.ok(!e.message.includes('TOKEN-SECRETO-QUE-NUNCA-DEBE-APARECER'), 'el token se filtro');
      return true;
    },
  );
});
