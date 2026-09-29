import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HOST_OFICIAL,
  redireccionWww,
  CABECERAS_SEGURIDAD,
  conCabeceras,
} from './borde.ts';

test('redireccionWww: www con ruta y query redirige a https://pukadigital.com/agencia?gclid=x', () => {
  const entrada = new URL('https://www.pukadigital.com/agencia?gclid=x');
  const salida = redireccionWww(entrada);

  assert.notEqual(salida, null);
  assert.equal(salida?.href, 'https://pukadigital.com/agencia?gclid=x');
});

test('redireccionWww: host oficial devuelve null; otro host devuelve null', () => {
  const oficial = new URL('https://pukadigital.com/agencia');
  assert.equal(redireccionWww(oficial), null);

  const subdominio = new URL('https://reels.pukadigital.com/video/123');
  assert.equal(redireccionWww(subdominio), null);

  const localhost = new URL('http://localhost:3000/contacto');
  assert.equal(redireccionWww(localhost), null);
});

test('CABECERAS_SEGURIDAD: contiene las cuatro cabeceras requeridas y HSTS no incluye includeSubDomains ni preload', () => {
  assert.equal(HOST_OFICIAL, 'pukadigital.com');

  assert.equal(CABECERAS_SEGURIDAD['Strict-Transport-Security'], 'max-age=31536000');
  assert.equal(CABECERAS_SEGURIDAD['X-Content-Type-Options'], 'nosniff');
  assert.equal(CABECERAS_SEGURIDAD['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(CABECERAS_SEGURIDAD['X-Frame-Options'], 'DENY');

  const hsts = CABECERAS_SEGURIDAD['Strict-Transport-Security'];
  assert.ok(!hsts.includes('includeSubDomains'), 'HSTS no debe incluir includeSubDomains');
  assert.ok(!hsts.includes('preload'), 'HSTS no debe incluir preload');
});

test('conCabeceras: setea las cuatro cabeceras sobre un Response', () => {
  const respuesta = new Response('ok', { status: 200 });
  const resultado = conCabeceras(respuesta);

  assert.equal(resultado, respuesta);
  assert.equal(resultado.headers.get('Strict-Transport-Security'), 'max-age=31536000');
  assert.equal(resultado.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(resultado.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.equal(resultado.headers.get('X-Frame-Options'), 'DENY');
});
