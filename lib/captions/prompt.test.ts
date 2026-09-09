import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirPrompt } from './prompt.ts';
import type { Pieza } from '../piezas/tipos.ts';

test('el prompt incluye los precios del catálogo y la URL canónica del producto', () => {
  const pieza: Pieza = {
    id: 'crm-prueba',
    sistema: 'puka',
    producto: 'pukaia',
    slides: [{ titular: 'CRM para WhatsApp', bajada: 'Inbox y pipeline.' }],
  };

  const prompt = construirPrompt(pieza);

  assert.match(prompt, /pukaia/i);
  assert.match(prompt, /14\.99/);
  assert.match(prompt, /agentes-ia/);
});

test('el prompt incluye las afirmaciones prohibidas si el producto es PukaHealth', () => {
  const piezaSalud: Pieza = {
    id: 'salud-prueba',
    sistema: 'health',
    producto: 'pukahealth',
    slides: [{ titular: 'Historias clínicas', bajada: 'Facturación SRI.' }],
  };

  const prompt = construirPrompt(piezaSalud);

  assert.match(prompt, /podolog/i);
  assert.match(prompt, /WhatsApp/i);
  // El motivo de la regla `calendar-bidireccional` dice «unidireccional»: lo
  // que se vuelca al prompt es `motivo` y `enCambio`, no el nombre de la regla
  // ni su patron. El plan probaba /bidireccional/, que no aparece nunca.
  assert.match(prompt, /unidireccional/i);
});

test('el prompt no incluye afirmaciones médicas prohibidas para otros productos', () => {
  const piezaERP: Pieza = {
    id: 'erp-prueba',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [{ titular: 'POS e inventario', bajada: 'Facturación electrónica.' }],
  };

  const prompt = construirPrompt(piezaERP);

  assert.ok(!prompt.includes('Solo hay una especialidad implementada'));
});

test('el prompt prohíbe explícitamente el uso de hashtags', () => {
  const pieza: Pieza = {
    id: 'utilidad',
    sistema: 'puka',
    slides: [{ titular: 'Norma del SRI' }],
  };

  const prompt = construirPrompt(pieza);

  // El plan probaba la cadena literal «sin hashtags». El prompt lo dice mas
  // fuerte —«CERO HASHTAGS: Esta terminantemente prohibido»— asi que se ancla a
  // la intencion: que nombre los hashtags y que los prohiba.
  assert.match(prompt, /hashtags/i);
  assert.match(prompt, /prohibido incluir hashtags|cero hashtags/i);
});
