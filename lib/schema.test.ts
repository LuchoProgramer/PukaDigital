import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getBreadcrumbSchema } from './schema.ts';

test('getBreadcrumbSchema convierte URLs relativas en URLs absolutas válidas para Google Search Console', () => {
  const schema = getBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Nosotros', url: '/nosotros' },
    { name: 'Equipo', url: 'equipo' },
    { name: 'Blog', url: 'https://pukadigital.com/blog' }
  ]);

  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.equal(schema.itemListElement.length, 4);

  assert.deepEqual(schema.itemListElement[0], {
    '@type': 'ListItem',
    position: 1,
    name: 'Inicio',
    item: 'https://pukadigital.com'
  });

  assert.deepEqual(schema.itemListElement[1], {
    '@type': 'ListItem',
    position: 2,
    name: 'Nosotros',
    item: 'https://pukadigital.com/nosotros'
  });

  assert.deepEqual(schema.itemListElement[2], {
    '@type': 'ListItem',
    position: 3,
    name: 'Equipo',
    item: 'https://pukadigital.com/equipo'
  });

  assert.deepEqual(schema.itemListElement[3], {
    '@type': 'ListItem',
    position: 4,
    name: 'Blog',
    item: 'https://pukadigital.com/blog'
  });
});
