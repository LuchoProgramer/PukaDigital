# Trabajo con agentes — Claude Code y Antigravity

Cómo se coordinan los dos agentes sobre este repositorio, qué carga cada uno y
cómo se verifica en vez de suponerlo. Actualizado: **2026-09-02**.

Las reglas del proyecto están en `AGENTS.md`. Este documento es sobre la
fontanería: quién las lee, cuándo, y qué hacer cuando no las lee.

---

## El canal directo: `agy`

Antigravity trae CLI propia, `agy`, con modo headless. Se invoca como cualquier
comando, sin MCP de por medio:

```bash
agy -p "la pregunta o la tarea"
```

| Flag | Para qué |
|---|---|
| `-p`, `--print` | Una sola vuelta, no interactivo. Es el modo para automatizar |
| `--add-dir` | Añade un directorio al workspace |
| `--mode plan` | Planifica sin editar |
| `--output-format json` | Salida estructurada, para encadenar |
| `-c`, `--continue` | Retoma la conversación anterior |

Google retira el Gemini CLI el **18 de junio de 2026** y lo sustituye por `agy`.
Existen servidores MCP que lo envuelven; para llamarlo desde aquí no hacen falta.

⚠️ **En headless, un permiso denegado deja la respuesta vacía.** Si el modelo
decide usar una herramienta y no hay regla que la permita, `agy` no puede
preguntar y aborta con `no output produced`. Se resuelve añadiendo reglas en
`permissions.allow` de su `settings.json`, o con `--dangerously-skip-permissions`,
que aprueba **todo** y conviene tratar con el respeto que sugiere el nombre.

---

## Qué carga cada agente

| | Claude Code | Antigravity |
|---|---|---|
| Archivo raíz | `CLAUDE.md` (importa `@AGENTS.md`) | `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md` |
| Método de trabajo | Skills de superpowers | No los tiene |
| Verificado | Sí, en sesión limpia | Parcialmente — ver abajo |

En Claude Code está comprobado: las reglas llegan completas y **una sola vez**,
como bloque hermano etiquetado con su ruta, no embebidas dentro de `CLAUDE.md`.

### El límite de 12.000 caracteres

Documentación oficial de Antigravity: *«Rules files are limited to 12,000
characters each»*, **por archivo**. Lo que se reporta al pasarse es truncado
**silencioso y por el final**: sin aviso ni error, el archivo deja de inyectarse
a media página. Las últimas secciones son las primeras en desaparecer.

Por eso `AGENTS.md` se mantiene por debajo de 9.000 y el detalle vive en `docs/`,
referenciado con `@`. **No está confirmado si lo inlineado con `@` cuenta para el
tope**; el margen está para no depender de esa respuesta.

---

## Cómo se cargan las reglas en Antigravity

La fuente es el skill que trae la propia CLI, en
`~/.gemini/antigravity-cli/builtin/skills/agy-customizations/`. Manda sobre
cualquier blog:

> **Directory & Project Rules** (Hierarchical): Paths: `GEMINI.md`, `AGENTS.md`,
> `.agents/rules/*.md`. **As you open or edit files**, the agent walks up from the
> file's directory to the repository root, loading all rules it finds.

Dos cosas que se deducen de ahí:

1. **`AGENTS.md` en la raíz sí es una ubicación válida.** La página web de
   documentación no lo menciona —solo cita `.agents/rules` y `~/.gemini/GEMINI.md`—
   pero el skill local sí, y el changelog de la v2.11.0 añade la sintaxis `@path`
   *«within AGENTS.md»*, que no se añadiría a un archivo que no se lee.
2. **La carga se dispara al tocar archivos**, no al arrancar la sesión. El recorrido
   sube desde el directorio del archivo hasta la raíz del repositorio.

Además hay **divulgación progresiva**: solo las reglas `always_on` se cargan sin
condición. Los skills solo aportan nombre y descripción hasta que se activan.

### Lo verificado el 2026-09-02

Con `agy -p` en la raíz del repositorio, preguntando por datos que **solo** están
en `AGENTS.md`:

| Prueba | Resultado |
|---|---|
| Preguntar por el final del archivo (commits, convenciones) sin permitir herramientas | «no lo tengo» |
| Preguntar por el principio (empresa, color de acento) sin permitir herramientas | «no lo tengo» |
| Pedir la lista de archivos de instrucciones en contexto | Solo dos skills internos de la CLI. Nada del repositorio |
| Repetir con `--add-dir .` | Idéntico |
| Preguntar el color sin prohibir herramientas | **Intentó usar una herramienta** y se quedó sin permiso |

La última fila es la que explica las anteriores: **no lo tenía en contexto y fue a
buscarlo.** En una pregunta suelta, sin abrir ningún archivo, no se dispara el
recorrido jerárquico y las reglas no entran.

**Lo que queda sin verificar:** si al tocar un archivo del repositorio las reglas
entran de verdad. Hace falta desbloquear permisos en `agy` para comprobarlo.

### Cómo se soluciona

En headless, **no dar por hecho que las reglas están**. Por orden de preferencia:

1. **Nombrar el archivo en el propio prompt** — «lee `AGENTS.md` antes de nada» —
   para que la primera acción sea una lectura y dispare el recorrido.
2. **Pasar las reglas por `stdin`** cuando la tarea sea corta y no se quiera
   depender de permisos de herramienta.
3. **Que la primera instrucción sea una operación de archivo** dentro del repo.

Para la fase 2 de la fábrica de piezas —un agente redactando el contenido del
mes— esto no es un detalle: si las reglas no entran, el agente inventa precios.
Por eso el validador comprueba los hechos comerciales y no se confía en que el
agente los recuerde. Ver `lib/piezas/catalogo.ts`.

---

## Cómo se le encarga trabajo a otro agente

Protocolo que funcionó, y los dos errores que costaron un experimento cada uno.

### El prompt

- **Autocontenido en la tarea**, para que no necesite la conversación previa.
- **Mudo en las convenciones** que se quieren medir. Si el prompt dice «comenta en
  español», el resultado no prueba nada sobre si leyó las reglas.
- **Definición de hecho explícita**: qué comando tiene que pasar y con qué salida.

### Verificar, no creer

Un agente que dice «lo revisé y se ve bien» no es evidencia. Lo que vale:

- Correr **tests de referencia propios**, que el otro agente no ha visto, contra su
  implementación.
- Comprobar los artefactos a mano. Las medidas de un PNG se leen de la cabecera
  IHDR del archivo, no del mensaje de quien lo generó.
- Preguntas de control cuya respuesta solo esté en un sitio.

### Los dos errores

**1. Dejar la hoja de respuestas sobre la mesa.** El primer experimento se hizo con
el plan de implementación sin commitear en el repositorio, con el código de
referencia dentro. Antigravity lo leyó —hizo bien— y el experimento midió su
capacidad de copiar. Antes de encargar una tarea, sacar del repositorio el
material que la resuelve.

**2. Confundir «lo encontró» con «lo tenía cargado».** Un agente con herramientas
de fichero lee la documentación del repositorio. Que acierte no demuestra que las
reglas se inyecten. Para distinguirlo hay que prohibir explícitamente las
herramientas en la pregunta de control.

---

## Lo que Antigravity encontró y nosotros no

Los experimentos no fueron gratis. Salieron cinco defectos reales del plan:

1. `allowImportingTsExtensions` faltaba en `tsconfig.json`.
2. El script de tests: `node --test` basta para TypeScript pero **no procesa JSX**.
3. Un choque de nombres entre el tipo `Sistema` y el objeto de tokens.
4. `/scripts/` está en `.gitignore`: un script ahí nunca se commitea.
5. El validador no miraba los hechos comerciales — y la primera pieza generada
   mezclaba el mensaje de un producto, el precio de otro y la oferta de un tercero,
   con todas las longitudes correctas.

Sus tests, además, probaban el borde que **pasa** —exactamente 10 slides, exactamente
140 caracteres— y no solo el que rompe. Esa costumbre se adoptó.
