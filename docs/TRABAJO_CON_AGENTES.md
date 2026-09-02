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

### La invocación que funciona

```bash
agy --sandbox --dangerously-skip-permissions -p "lee AGENTS.md y ..."
```

Las tres partes son necesarias y ninguna es opcional:

| Parte | Por qué |
|---|---|
| `--dangerously-skip-permissions` | **`permissions.allow` no se consulta en headless.** Es un bug abierto ([#548](https://github.com/google-antigravity/antigravity-cli/issues/548)): las llamadas a herramientas se deniegan solas y la respuesta sale vacía con `no output produced`. Ampliar la lista de `allow` no arregla nada |
| `--sandbox` | Restringe la terminal. Es lo que hace tolerable el flag anterior |
| «lee AGENTS.md» en el prompt | Sin eso el agente no tiene las reglas. Ver abajo |

⚠️ **`deny` sí se respeta, incluso con `--dangerously-skip-permissions`.** Verificado
el 2026-09-02: es la única barrera que sobrevive al flag, y por eso es donde tiene
que estar la protección de verdad.

### Los permisos, en `~/.gemini/antigravity-cli/settings.json`

Siete tipos de acción —`read_file`, `write_file`, `read_url`, `execute_url`,
`command`, `mcp`, `unsandboxed`— sobre tres listas que se evalúan en orden estricto:
**`deny` > `ask` > `allow`**.

```json
{
  "permissions": {
    "allow": ["command(git status)", "command(npm run)"],
    "deny":  ["command(sudo)", "read_file(/Users/tu-usuario/.ssh/)"]
  }
}
```

⚠️ **En las rutas, `~` no se expande.** `read_file(~/.ssh/)` **no bloquea nada**: se
comprobó leyendo el archivo con esa regla puesta. Hay que escribir la ruta absoluta.
Los comandos usan regex por tokens: `command(npm run (build|lint|test))`.

La lista `deny` instalada el 2026-09-02 cubre escalada de privilegios (`sudo`,
`chmod 777`), reescritura de historia y pérdida de trabajo no commiteado
(`git push --force`, `git reset --hard`, `git clean -fd`) y las credenciales de la
máquina (`.ssh/`, `.aws/`, el token OAuth de la propia CLI). El `allow` acumulado
—840 y pico de reglas -- se dejó intacto: sirve en modo interactivo.

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

### Verificado el 2026-09-02, ya con los permisos desbloqueados

| Prueba | Resultado |
|---|---|
| Preguntar el color de acento sin nombrar ningún archivo | **`#1a73e8`** — respondió con los colores de *Antigravity*, de su propio skill interno. No miró el proyecto |
| Pedirle que **lea `AGENTS.md`** y luego responder | `#C7171E` citando la línea 87, y el formato de commits citando la línea 149 |

La segunda fila cierra dos preguntas a la vez: el archivo entra **entero** —la línea
149 está casi al final— así que a 9.000 caracteres no hay truncado; y la carga
jerárquica **no ocurre sola** en `-p`.

**Conclusión: `agy -p` no carga `AGENTS.md` por su cuenta.** Sin nombrarlo en el
prompt, el agente no tiene las reglas y responde con lo que sea que traiga dentro.

### Cómo se soluciona

En headless, **no dar por hecho que las reglas están**. Por orden de preferencia:

**Nombrar el archivo en el propio prompt.** Es lo único que se ha comprobado que
funciona: «lee `AGENTS.md` y…». No es una precaución, es el requisito.

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
