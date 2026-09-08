# Método — trabajar con Claude Code y agy en paralelo

Cómo se usa un segundo agente para contrastar y ejecutar, y cómo se verifica su
trabajo sin creerle el reporte.

**Este documento es dueño del *método*.** La fontanería —permisos, el bug de
`permissions.allow` en headless, el orden `deny > ask > allow`, y el hallazgo de
que `agy -p` no carga `AGENTS.md` por su cuenta— vive en
`docs/TRABAJO_CON_AGENTES.md` y no se repite aquí.

> **El origen y qué está medido.** El método viene de `SistemaSalud`
> (`docs/claude/metodo-agentes-paralelos.md`), destilado de sesiones del 3 al 7 de
> septiembre de 2026. **Los números que se citan son de allá**, sobre Django y una
> suite grande. En PukaDigital todavía no hay ninguna medición propia: cuando la
> haya, se anota aquí y se dice que es de aquí. No mezclar las dos cosas.

---

## 1. El wrapper: `agy-headless`

`agy -p` **no emite nada si su stdout no es un terminal real.** Gatea la salida
con `isatty()`, así que redirigida a un archivo, en un pipe o lanzada desde otro
proceso devuelve **exit code 0 y cero bytes**. Es un bug abierto,
`google-antigravity/antigravity-cli#318`.

El workaround habitual, `script -q /dev/null agy ...`, no sirve en macOS: `script`
necesita a su vez un TTY de *entrada* y falla con
`tcgetattr/ioctl: Operation not supported on socket`.

`~/.local/bin/agy-headless` crea el pseudo-terminal con el módulo `pty` de Python.
**Vive en `~/.local/bin`, que es global: ya funciona en este repositorio**, no hay
nada que instalar.

```bash
agy-headless "el prompt" --effort high --timeout 3600 > salida.md
agy-headless --prompt-file /ruta/prompt.txt --model gemini-3.7-flash-high --timeout 2400
```

Limpia las secuencias ANSI —sin eso el archivo queda ilegible—, respeta un
timeout propio y propaga el exit code (124 si venció).

⚠️ **`--model` y `--effort` chocan.** El id del modelo ya trae su nivel
(`gemini-3.7-flash-high`), así que pasar `--effort low` da
`invalid model selection`. Usar `--effort high` o ninguno de los dos.

### Qué modelo

**Para análisis largo, 3.7 Flash. No 3.8.** Medido en SistemaSalud con misma
tarea, mismo worktree, mismo momento:

| | 3.7 Flash | 3.8 Flash |
|---|---|---|
| Contraste largo | ✅ 291 s, 5 hallazgos correctos | ❌ timeout a 304 s, **2 de 2 intentos** |

`agy` tiene un timeout interno de ~5 minutos. El 3.8 tarda 13,3 s al primer token
—contra 2,99 s de mediana— y produce 70% más tokens: arranca más lento, es más
verboso y choca antes contra el límite.

🔑 La lección general vale más que el número concreto: **medir contra la tarea
propia**, no confiar en benchmarks de nadie. Los ids de modelo cambian rápido.

---

## 2. Los dos usos, y para qué sirve cada uno

### Contrastar un spec — es lo que más rinde

En SistemaSalud, cuatro pasadas dieron **26 hallazgos, todos verificados como
correctos**, tres de ellos bloqueantes que habrían producido una migración rota.

### Contrastar un plan — encuentra otra cosa, y hay que hacer los dos

🔑 **No se sustituyen.** Medido sobre el mismo trabajo:

| | Spec | Plan |
|---|---|---|
| Qué encuentra | decisiones de diseño mal tomadas | **código literal que no compila o no corre** |
| De 10 hallazgos | 3 tocaban secciones enteras | **4 reventaban al ejecutar** |

Un plan trae código que alguien va a copiar y pegar. Un nombre de campo
equivocado, una firma que no coincide o un import que no resuelve no son
discusión: son tiempo perdido.

**Corolario para el prompt:** pedirle explícitamente que verifique **cada símbolo,
firma e import contra el código real**, y que resuelva los avisos del tipo
«verificar X antes de escribir esto» que el plan ya trae. Esos avisos marcan las
dudas del autor — en la sesión medida, **ninguna de las tres coincidía con la
realidad**.

---

## 3. Pasadas independientes primero, compartidas después

**Primera pasada: cada uno por su cuenta, sin ver lo del otro.** Es lo que hace
confiable el resultado: cuando dos revisores independientes llegan al mismo
hallazgo, es real.

**De la segunda en adelante: compartir hallazgos y pedir lo que el otro perdió.**
Listarle las áreas ya cubiertas para que no las repita, y darle ángulos nuevos.

| Pasada | Enfoque | Hallazgos |
|---|---|---|
| 1ª (independiente) | inventario y conteos | 5 + 9 |
| 2ª (compartida) | tests, tipos, zonas sin mirar | 9 |
| 3ª (compartida) | runtime, orden, concurrencia | 3 |
| 4ª (contra el código **ya implementado**) | huecos de la implementación | 5 |

**El rendimiento decreciente es el criterio para parar.** La 3ª dio un tercio que
la 2ª; ahí se corta.

### 🔑 La cuarta pasada es distinta y hay que hacerla

Las tres primeras contrastan el spec contra el código **original**. La cuarta lo
contrasta contra el **código ya implementado**, y ahí aparecen los huecos de la
*implementación*, no del diseño. Encontró dos bugs graves que ningún contraste
previo podía ver.

---

## 4. Cómo se escribe el prompt

**Para contrastar:**

1. Decirle qué leer y que es **SOLO LECTURA**.
2. Listarle **lo que ya se cubrió**, para que no lo repita.
3. Darle **áreas concretas, numeradas**.
4. **Exigir formato de salida fijo**, con `archivo:línea` en cada hallazgo.
5. 🔑 **Decir que «no encontré nada» es un resultado válido y preferible a
   inventar uno.** Es lo que distingue a un revisor que aporta de uno que rellena.

Y lo que `TRABAJO_CON_AGENTES.md` ya establece y aquí solo se recuerda: **nombrar
`AGENTS.md` en el prompt**. En headless no se carga solo.

**Para ejecutar, además:**

- Rama propia, y **prohibición explícita** de cambiar de rama, mergear o pushear.
- **«El plan trae el código literal. Si algo no coincide con el código real, PARÁ
  esa task y anotalo»** — sin esto improvisa un arreglo distinto.
- **Nunca `git add -A`**: solo los archivos que la task nombra.
- **La línea base medida** (número de tests) para que sepa contra qué comparar.
- Un reporte con secciones para **desviaciones** y **lo que no pudo verificar**.
- **Avisos sobre lo que va a parecer un error y no lo es**: un import que queda sin
  usar porque lo consume la task siguiente, un tipo que ya existe y no hay que
  recrear, un componente parecido que todavía no hay que borrar. Sin esto «arregla»
  lo que no está roto.

🔴 **Antes de un borrado:** exigir que **liste quién importa lo que va a borrar** y
que pare sin tocar nada si aparece un consumidor inesperado. Un borrado es lo único
que no se revisa mirando el diff después.

---

## 5. Verificación: nunca creerle al reporte

```bash
git branch --show-current                    # ¿está donde dije?
git log --oneline main -1                    # ¿main intacta?
git log --oneline main..HEAD                 # ¿los commits que pedí?
git ls-remote origin <rama> | wc -l          # ¿pusheó? (debe dar 0)
git status --short                           # ¿dejó algo sin commitear?
```

Y **correr las suites uno mismo**, contra la línea base medida antes de empezar.

En este repositorio son dos comandos y **no son redundantes**:

```bash
npm test          # los tests de la fábrica
npx tsc --noEmit  # los tipos
```

Uno solo de los dos deja pasar clases enteras de error. Y `npm run piezas -- --check`
si se tocó algo de contenido.

⚠️ Recordar el aviso de `AGENTS.md`: `npm run lint` arrastra 180+ problemas
pre-existentes en `proxy.ts`, `types/index.ts` y scripts. **No son del agente.** Lo
que sí debe quedar limpio es `app/`.

**Detectar scope creep** comparando lo tocado contra lo que el plan nombra:

```bash
for f in $(git diff --name-only main..HEAD); do
  grep -q "$(basename $f)" docs/superpowers/plans/<plan>.md || echo "⚠️  $f"
done
```

⚠️ **No todo lo que sale de esa lista es scope creep.** En la sesión real
aparecieron 5 archivos y los 5 eran consecuencias necesarias. Mirar el diff de cada
uno, no rechazarlos de plano.

---

## 6. 🔴 Un git worktree NO aísla

Se le dio a agy un worktree anclado a `main` para que leyera el código original
mientras otro agente lo modificaba. **Leyó el repositorio principal igual**,
verificado por el número de líneas que reportó de un archivo.

La causa es `allowNonWorkspaceAccess: true` en
`~/.gemini/antigravity-cli/settings.json`: puede salir del directorio de trabajo y
resolver rutas absolutas.

Si hace falta aislamiento real: poner esa opción en `false`, o usar un contenedor.

---

## 7. Trabajar en paralelo de verdad

Dos `agy` simultáneos funcionan, con dos cuidados:

1. **Nunca dos agentes escribiendo el mismo árbol.** Uno escribe, el otro lee.
2. **El que lee debe leer código estable.** Si el otro está modificando archivos,
   sus hallazgos son sobre un blanco móvil — y ver el punto 6.

Lanzarlos en segundo plano, no esperándolos:

```bash
agy-headless --prompt-file prompt.txt --timeout 2400 > salida.md 2>&1 &
```

⚠️ **Verificar que terminó antes de concluir que falló.** En la sesión real se dio
por muerto un agy que estaba corriendo la línea base de tests. Chequear
`pgrep -f "^agy -p"` antes de sacar conclusiones.

---

## 8. Ejecución task por task: agy escribe, nosotros verificamos

| | |
|---|---|
| **agy** | escribe el código literal de UNA task. No toca git |
| **nosotros** | corremos los tests, verificamos el alcance del diff, comprobamos las guardas, commiteamos |

### Por qué no corre los tests él

En SistemaSalud la razón era el timeout: la suite tarda ~46 s y se come el
presupuesto de los 5 minutos.

⚠️ **Ese argumento no aplica aquí.** `npm test` son 14 tests que corren en
segundos. Técnicamente agy podría correrlos.

Sobrevive la razón mejor, que no es técnica: **quien escribe el código no es buen
juez de si su test sirve.** Separar escritura de verificación es el punto entero.

### 🔑 Comprobar la guarda quitándola — *mutation testing* a mano

Al terminar cada task: comentar la línea que la guarda aporta, correr el test,
**confirmar que cae**, restaurar.

*Si rompés el código a propósito, algún test tiene que fallar; si no falla, el test
no estaba probando nada.* Una aserción que sobrevive a la mutación es una aserción
que miente.

**Y el modo de fallo importa tanto como el fallo.** Si cae por un motivo distinto
del predicho, eso es un hallazgo.

### Lo que la medición invierte

Plan de 18 tasks (2026-09-05) y plan de 8 tasks (2026-09-07), en SistemaSalud:

| | 18 tasks | 8 tasks |
|---|---|---|
| Desviaciones de agy | **0** | **0** |
| Errores encontrados | 14, **todos del plan** | 13, **12 del plan** |
| Encontrados leyendo | 0 | 0 |
| Encontrados al ejecutar | 14 | 13 |

🔑 **La conclusión invierte la intuición.** Uno entra a esto para vigilar al
agente. Lo que rinde es lo contrario: **el agente es fiel y el plan es el que
miente.** Un plan contrastado por tres revisores llegó igual con catorce errores
que solo la ejecución muestra.

**Y ninguno apareció leyendo.** Contrastar es necesario y no alcanza.

---

## 9. Los cuatro tipos de hueco

**1. Tests falsos en verde.** La aserción se cumple por una vía distinta de la que
se quería probar. Una aserción corta y sin anclar pasa por casualidad:
`assertIn('UN', ...)` pasa porque `'UNO'` lo contiene. Lo que sirve ancla al
contexto. **Y mirar lo que la aserción NO dice**: un test que afirma dos de tres
campos deja pasar justo el tercero.

- Se cazan quitando la guarda y viendo si el test cae.

**2. Mitades de task sin ningún test.** Código que se puede borrar entero sin que
nada se ponga rojo. No falla la aserción, falla la **cobertura**.

- Se cazan preguntándose al cerrar la task: *«¿qué línea de esto podría borrar sin
  romper ningún test?»*

**3. Verificadores que miran cosas distintas.** `npm test` y `tsc --noEmit` no son
redundantes: en SistemaSalud 972 tests pasaban con los tipos mintiendo y con siete
call sites a los que les faltaba una prop **requerida**.

- Un `tsc` en rojo puede ser **buena señal**: completar un tipo rompe todo fixture
  que lo usaba incompleto, y eso prueba que los campos nuevos son reales.

**4. 🔴 El test prueba una pieza, producción usa otro camino.** El más caro, y el
único que la mutación **no** encuentra: no se puede mutar una línea que nadie
escribió.

> **La pregunta que sí los caza**, al cerrar cada task:
> **¿Qué camino recorre esto en producción, y hay un test que lo recorra entero?**

No «¿está testeada la función?» sino «¿está testeado **cómo se la llama**».

### 🔑 Este proyecto ya sufrió el tipo 4 dos veces

Los dos avisos en mayúscula de `AGENTS.md` son instancias del mismo hueco, y hasta
ahora no tenían nombre común:

| Qué se verificó | Qué usa producción | Cómo se manifestó |
|---|---|---|
| Que el schema JSON-LD estuviera en el código | El **HTML servido**, que los crawlers leen sin ejecutar JS | 46 preguntas de FAQ invisibles en 6 páginas |
| Que el build compilara con las fuentes nuevas | El **navegador**, resolviendo `fontFamily` de verdad | 24 elementos y 1.119 caracteres renderizados en monoespaciado |

Por eso las dos reglas dicen **«verificar contra el HTML servido»** y **«verificar
con `getComputedStyle`, no que el build compile»**. Compilar no es funcionar.

```bash
curl -s https://pukadigital.com/<ruta> | grep 'application/ld+json'
```

Es el mismo tipo de hueco que se lleva la sección entera de arriba. Aquí se llegó
por las malas; el método le pone nombre para no repetirlo.

---

## 10. 🔴 Contrastar contra la fuente de verdad, no solo contra el código

En SistemaSalud lo más rentable de una sesión no lo encontró ningún revisor: lo
encontró el usuario diciendo *«esto me lo dijo la clienta en una reunión, revisá
las transcripciones»*. Salieron tres decisiones que el spec había tomado solo.

🔑 **Ni agy ni Claude podían encontrarlo leyendo código**: no estaba en el
repositorio. Un contraste contra el código verifica que el plan sea
*implementable*; no verifica que sea **lo que se pidió**.

### Cuál es la fuente de verdad en este proyecto

Aquí no hay transcripciones de cliente, pero sí hay hechos que el código no
contiene y que un agente inventa alegremente:

| Qué | Dónde vive | Qué pasa si se ignora |
|---|---|---|
| Precios y ofertas vigentes | `lib/piezas/catalogo.ts` | Se publica un precio que no existe |
| Lo que PukaHealth **no** hace | `docs/PUKAHEALTH_LIMITES.md` y `lib/piezas/prohibidas.ts` | Se publica algo falso, y en salud eso pesa distinto |
| El estado real del producto | El repositorio `SistemaSalud`, no este | Se describe una función que no está construida |
| Lo que está en producción | `curl` contra `pukadigital.com` | Se arregla algo que ya estaba bien, o al revés |

⚠️ **El «precio beta de $25/mes» de PukaHealth es el caso de estudio:** salió de un
estudio de mercado de otro producto, se copió a una spec, y nunca se le ofreció a
nadie. Un agente que lea specs viejas lo repetirá. Por eso `validar.ts` comprueba
los hechos comerciales contra `catalogo.ts` y no se fía de que el agente los
recuerde.

⇒ **El orden correcto es: fuente de verdad → código → spec o plan.**

---

## 11. El ciclo completo

1. Escribir el spec con `superpowers:brainstorming` y commitearlo.
2. **Contraste independiente**: uno mismo y agy, sin verse. Verificar cada hallazgo
   contra el código antes de aceptarlo.
3. **Contrastes compartidos** hasta que el rendimiento caiga.
4. Escribir el plan con código literal en cada paso.
5. **Contrastar el plan** — encuentra otra cosa que el contraste del spec.
6. **Ejecución** en rama propia, sin push.
7. **Verificación independiente**: repositorio, alcance, y `npm test` + `tsc --noEmit`
   corridos por uno mismo.
8. **Cuarta pasada contra el código ya implementado.**
9. Arreglar lo que aparezca, con test en rojo primero.
10. `superpowers:verification-before-completion` antes de decir que está listo.

---

## Documentación relacionada

- `docs/TRABAJO_CON_AGENTES.md` — la fontanería: permisos, carga de reglas, el bug #548
- `~/Proyectos/SistemaSalud/docs/claude/metodo-agentes-paralelos.md` — el original, con el detalle de Django
- `~/Proyectos/SistemaSalud/docs/claude/metodo-reducir-contexto.md` — método aparte, para bajar el contexto de arranque
