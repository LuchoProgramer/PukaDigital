# Fábrica de estáticos — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir un archivo de datos versionado en el repositorio en los PNG de redes sociales del mes, en dos sistemas visuales y tres formatos, sin abrir un editor gráfico.

**Architecture:** Tres capas. `content/piezas/<mes>.ts` dice **qué**; `plantilla.tsx` dice **cómo se compone**; `sistemas.ts` dice **con qué colores**. `validar.ts` corre antes del render y aborta en vez de encoger texto. La salida va a `public/piezas/`, versionada, porque el propio sitio hace de CDN para la Graph API en la fase 3.

**Tech Stack:** TypeScript · `satori` 0.33.4 · `@resvg/resvg-js` 2.6.2 · `tsx` 4.23.13 · `node --test`

**Spec:** `docs/superpowers/specs/2026-09-01-fabrica-estaticos-design.md`

---

## Estado — 2026-09-02

Las tareas 1-7 están **hechas** (commits `7c0f25c` y `e5eef53`). 32 tests en verde,
`npx tsc --noEmit` limpio.

| Archivo | Qué hace |
|---|---|
| `lib/piezas/tipos.ts` | `Pieza`, `Slide`, `Formato`, `Sistema`, `ProductoId`, `ErrorValidacion` |
| `lib/piezas/formatos.ts` | Medidas, márgenes, zonas seguras, `formatosDe()` |
| `lib/piezas/catalogo.ts` | Hechos comerciales de los seis productos |
| `lib/piezas/validar.ts` | Longitudes + hechos comerciales |
| `lib/piezas/fuentes.ts` | Las cuatro instancias estáticas |
| `lib/piezas/sistemas.ts` | Los dos sistemas visuales como tokens |
| `lib/piezas/plantilla.tsx` | La plantilla paramétrica |
| `lib/piezas/render.ts` | `renderPieza()` — valida y devuelve los PNG |
| `lib/piezas/muestra.ts` | Nueve muestras: 2 sistemas × 3 formatos + carrusel |

**Las tareas 8 y 9 están hechas** (commit al cierre de esta rama). La fase 1 está
completa: `npm run piezas` genera el mes desde datos versionados.

### Lo que se corrigió sobre la marcha

Cinco defectos del plan original, todos encontrados implementando:

1. **`allowImportingTsExtensions`** hacía falta en `tsconfig.json` y el plan no lo
   mencionaba: los imports con extensión `.ts` no compilaban. Ya está puesto.
2. **El comando de tests.** `node --test` a secas basta para TypeScript —Node 26
   hace type stripping nativo— pero **no procesa JSX**: en cuanto un test llega a
   `plantilla.tsx` falla con `ERR_UNKNOWN_FILE_EXTENSION`. El script es
   `node --import tsx --test`.
3. **Choque de nombres.** `Sistema` en `tipos.ts` es la unión `'puka' | 'health'`;
   el objeto de tokens se llama `TokensSistema`.
4. **`/scripts/` está en `.gitignore`**, bajo «automation & security», desde el
   commit inicial. Un script ahí **nunca se commitea**. Todo vive en `lib/piezas/`.
5. **El validador no miraba los hechos comerciales.** La primera muestra generada
   mezclaba el mensaje de LedgerXpertz, el precio de PukaIA y la oferta de
   PukaHealth, con las longitudes perfectas. De ahí salió `catalogo.ts`.

---

## Tarea 8: El contenido del mes y la CLI

Hoy `muestra.ts` lleva sus piezas dentro. El contenido real vive aparte, un archivo
por mes, para que un agente o una persona lo escriba sin tocar código.

**Files:**
- Create: `content/piezas/2026-09.ts`
- Create: `lib/piezas/cli.ts`
- Modify: `package.json`

- [x] **Paso 1: Crear el archivo del mes**

Dos piezas reales, una por sistema. Los tipos de contenido salen de la mezcla de
`docs/COMMUNITY_MANAGEMENT.md`: utilidad, producto y prueba.

```typescript
import type { Pieza } from '../../lib/piezas/tipos.ts';

const piezas: Pieza[] = [
  {
    id: 'sri-rechazo-01',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [
      {
        badge: 'SRI',
        titular: 'Tu factura no pasó',
        bajada: 'El error más común no es del sistema: es un dato del cliente mal escrito.',
        cta: 'Cotiza por WhatsApp',
      },
    ],
  },
  {
    id: 'historia-clinica-papel',
    sistema: 'health',
    producto: 'pukahealth',
    slides: [
      {
        badge: 'PukaHealth',
        titular: 'Tu consultorio sigue en papel',
        bajada: 'Historia clínica y facturación electrónica en el mismo sitio.',
      },
      {
        titular: 'Treinta días gratis',
        dato: { valor: '$50', etiqueta: 'al mes' },
        cta: 'Empieza gratis hoy',
      },
    ],
  },
];

export default piezas;
```

- [x] **Paso 2: Escribir la CLI**

`pathToFileURL` no es opcional: en ESM un `import()` de ruta absoluta falla en
macOS sin el esquema `file://`.

```typescript
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderPieza } from './render.ts';
import { formatear, validar } from './validar.ts';
import type { Pieza } from './tipos.ts';

function argumento(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

function mesActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

async function main() {
  const mes = argumento('mes') ?? mesActual();
  const soloId = argumento('id');
  const soloCheck = process.argv.includes('--check');

  const ruta = pathToFileURL(join(process.cwd(), 'content', 'piezas', `${mes}.ts`)).href;
  const todas: Pieza[] = (await import(ruta)).default;

  // Se valida el mes completo aunque se renderice una sola pieza: los ids
  // duplicados solo se ven mirando todo.
  const errores = validar(todas);
  if (errores.length > 0) {
    console.error(`${errores.length} error(es) en ${mes}:\n${formatear(errores)}`);
    process.exit(1);
  }

  if (soloCheck) {
    console.log(`${todas.length} pieza(s) validas en ${mes}.`);
    return;
  }

  const piezas = soloId ? todas.filter((p) => p.id === soloId) : todas;
  if (piezas.length === 0) {
    console.error(`No hay piezas con id ${soloId} en ${mes}.`);
    process.exit(1);
  }

  const destino = join(process.cwd(), 'public', 'piezas', mes);
  await mkdir(destino, { recursive: true });

  let escritos = 0;
  for (const pieza of piezas) {
    for (const { nombre, png } of await renderPieza(pieza)) {
      await writeFile(join(destino, nombre), png);
      console.log(`  public/piezas/${mes}/${nombre}`);
      escritos++;
    }
  }
  console.log(`${escritos} archivo(s) en public/piezas/${mes}/`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
```

- [x] **Paso 3: Apuntar los scripts al nuevo destino**

En `package.json`, `piezas` deja de apuntar a las muestras:

```json
"piezas": "tsx lib/piezas/cli.ts",
"piezas:muestra": "tsx lib/piezas/muestra.ts"
```

- [x] **Paso 4: Verificar que `--check` acepta lo válido**

Run: `npm run piezas -- --mes 2026-09 --check`
Expected: `2 pieza(s) validas en 2026-09.`

- [x] **Paso 5: Verificar que `--check` rechaza lo inválido**

Añadir temporalmente al final del array de `content/piezas/2026-09.ts`:

```typescript
  {
    id: 'MAL Id',
    sistema: 'puka',
    producto: 'ledgerxpertz',
    slides: [{ titular: 'Tu ERP por $14.99 con 30 días gratis' }],
  },
```

Run: `npm run piezas -- --mes 2026-09 --check`
Expected: código de salida 1 y tres errores — `id` por no ser kebab-case, y dos de
`titular` por el precio y la oferta, que no son de LedgerXpertz. Quitar la pieza
después.

- [x] **Paso 6: Generar el mes**

Run: `npm run piezas -- --mes 2026-09`
Expected: 5 archivos — 3 de `sri-rechazo-01` (los tres formatos, por ser de una
sola slide) y 2 de `historia-clinica-papel` (carrusel, solo 4x5).

- [x] **Paso 7: Commit**

```bash
git add content/piezas lib/piezas/cli.ts package.json public/piezas
git commit -m "feat(piezas): cli del mes y contenido de septiembre"
```

---

## Tarea 9: Revisión visual y documentación

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/superpowers/specs/2026-09-01-fabrica-estaticos-design.md`

- [x] **Paso 1: Abrir las piezas del mes**

Run: `open public/piezas/2026-09/*.png`

| Qué | Criterio |
|---|---|
| Márgenes | Ningún texto a menos de 88 px del borde |
| Historia 9:16 | Nada en los 250 px de arriba ni en los 320 de abajo |
| Fuentes | Titular en Bricolage ExtraBold, no una sans genérica |
| Cifra | `$50` en JetBrains Mono |
| `sri-rechazo-01` | Fondo `#080808`, acento rojo, pegaso |
| `historia-clinica-papel` | Fondo blanco, azul `#2563EB`, **estetoscopio, no pegaso** |
| Firma | El punto rojo en las dos |
| Carrusel | Contador `01/02` en la primera; CTA solo en la segunda |

- [x] **Paso 2: Corregir lo que aparezca**

Si un texto se sale, **bajar el tope en `TOPES` de `validar.ts`**, no reducir el
cuerpo de letra en la plantilla. La regla es que el sistema no permita expresar lo
que no cabe.

- [x] **Paso 3: Documentar los comandos en `AGENTS.md`**

En la sección *Comandos*:

```
npm run piezas       # genera las piezas de redes del mes en public/piezas/
npm test             # tests de la fabrica de piezas
```

Y en *Archivos importantes*:

```
| `lib/piezas/` | Fabrica de estaticos para redes — ver la spec del 2026-09-01 |
| `content/piezas/` | Las piezas de cada mes, como datos |
```

- [x] **Paso 4: Corregir la sección *Verificación* de la spec**

Dice que el repositorio no tiene runner de tests y que añadir uno queda fuera de
alcance. Node 26 trae `node --test` incorporado: se usa, sin dependencia nueva.

- [x] **Paso 5: Commit**

```bash
git add AGENTS.md docs/superpowers/specs/2026-09-01-fabrica-estaticos-design.md
git commit -m "docs(piezas): documentar la fabrica y corregir la nota de tests"
```

---

## Criterio de aceptación de la fase

Una pieza real del calendario de septiembre sale por `npm run piezas`, en los tres
formatos, sin retoque manual, con el sistema visual y los datos comerciales
correctos según el producto. `npm test` en verde.

## Deuda conocida

- ~~Dos sistemas de firma sin decidir.~~ **Resuelto el 2026-09-02.** No eran dos
  versiones de lo mismo: `pukadigital.com` es marca de agua y «por PukaDigital» es
  respaldo de sub-brand. Se quitó `@pukadigital`, que sí sobraba —redundante dentro
  de Instagram, inservible fuera—. Documentado en `COMMUNITY_MANAGEMENT.md`.
- ~~Los dos azules de PukaHealth.~~ **Resuelto el 2026-09-02.** La landing pasa a
  `#2563eb`, el del logo. El motivo que decidió no fue de marca sino de accesibilidad:
  `#0ea5e9` da 2,77:1 sobre blanco y fallaba WCAG incluso para texto grande.
- **`assets/marca/pukahealth-logo.svg` es una copia** de `SistemaSalud`, sin vínculo:
  si el logo cambia allí, aquí no se entera nadie.

## Lo que sigue, y no entra aquí

Fase 2 (un agente redacta las piezas y abre el PR), fase 3 (publicación a Meta por
Graph API) y fase 4 (TikTok).

⚠️ **La fase 4 no lleva app propia.** TikTok excluye explícitamente las herramientas
para publicar en la cuenta que uno mismo gestiona, así que una app propia sería
rechazada y sin auditoría todo sale privado. Se publica a mano o con un servicio
multi-tenant ya auditado. Detalle en la spec.
