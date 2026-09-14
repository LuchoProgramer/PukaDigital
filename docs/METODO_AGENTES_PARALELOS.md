# Método — trabajar con Claude Code y agy en paralelo

Cómo se usa un segundo agente para contrastar y ejecutar, y cómo se verifica su
trabajo sin creerle el reporte.

**Este documento es dueño del *método*.** La fontanería —permisos, el bug de
`permissions.allow` en headless, el orden `deny > ask > allow`, y el hallazgo de
que `agy -p` no carga `AGENTS.md` por su cuenta— vive en
`docs/TRABAJO_CON_AGENTES.md` y no se repite aquí.

> **El origen y qué está medido.** El método viene de `SistemaSalud`
> (`docs/claude/metodo-agentes-paralelos.md`), destilado de sesiones del 3 al 13 de
> septiembre de 2026. **Salvo donde diga lo contrario, los números son de allá**,
> sobre Django y una suite grande. Lo medido aquí se marca como de aquí —la
> comparación de modelos del 2026-09-09 y **las dos primeras ejecuciones de un plan
> con `agy`, el 2026-09-13 (§14 y §15)**—, y las dos cosas no se mezclan.
>
> **Última sincronización con SistemaSalud: 2026-09-13**, pedida y contestada por
> su propia sesión. Entraron: correr el código del plan antes de dárselo al
> agente, mutar la plantilla y no solo la lógica, medir el propio arnés antes de
> acusar al código, pedirle al agente los caminos de entrada, las dos plantillas
> de prompt, y **la corrección del `--print-timeout`**, que desmiente lo que este
> documento decía sobre los modelos.
>
> **Solo `agy` está medido.** Cursor y Gemini CLI están instalados en la máquina
> pero no forman parte del método, ni allá ni aquí. Codex no se usa.

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

La invocación vigente, la que usa SistemaSalud al 2026-09-13:

```bash
agy-headless --prompt-file prompt.txt --model gemini-3.8-flash-high \
  --timeout 1560 --print-timeout=25m > salida.md 2> salida.err
```

Limpia las secuencias ANSI —sin eso el archivo queda ilegible—, respeta un
timeout propio y propaga el exit code (124 si venció).

🔴 **`--print-timeout` vale 5 minutos por defecto, y el `--timeout` del wrapper
no lo cambia.** Pasado ese límite `agy` devuelve salida parcial o vacía **con
exit code 0**: parece que terminó bien. Casi todo lo que se creyó «timeout del
modelo» era esto.

⚠️ **Y se escribe con `=` y sin `--` delante.** Las dos formas equivocadas fallan
sin decirlo:

| Cómo se escribe | Qué pasa |
|---|---|
| `--print-timeout=25m` | ✅ correcto |
| `-- --print-timeout 25m` | el wrapper toma la opción como prompt y `agy` recibe `25m` suelto: `unexpected argument` |
| `-- --print-timeout=25m` | se la traga como prompt y corre con los 5 minutos de siempre, **sin ningún error** |

Confirmar con `pgrep -fl "^agy -p"` que la opción quedó al final del comando.

⚠️ **`--model` y `--effort` chocan.** El id del modelo ya trae su nivel
(`gemini-3.8-flash-high`), así que pasar `--effort low` da
`invalid model selection`. Usar `--effort high` o ninguno de los dos.

⚠️ **Y es `--model`, no `-m`.** El wrapper reenvía lo que no reconoce y `agy` lo
rechaza, pero imprime la ayuda en el archivo de salida y no en el de errores: ver
§15.

### Qué modelo

🔴 **Corrección del 2026-09-13, que invalida la explicación de abajo.** Lo que se
leyó como «3.8 hace timeout» era el `--print-timeout` de 5 minutos por defecto:
un límite de la CLI, no del modelo. **Hoy SistemaSalud usa 3.8 Flash High para
todo**, con `--print-timeout=25m`, y aquí se hace igual.

La historia se conserva porque explica cómo se llegó a una conclusión falsa
midiendo de verdad: el experimento estaba bien hecho y la interpretación era
mala. Se atribuyó al modelo lo que era de la herramienta.

**La medición original, para el registro.** Misma
tarea, mismo worktree, mismo momento:

| | 3.7 Flash | 3.8 Flash |
|---|---|---|
| SistemaSalud, 2026-09-05 | ✅ 291 s, 5 hallazgos correctos | ❌ timeout a 304 s, **2 de 2 intentos** |
| PukaDigital, **2026-09-09** | ✅ 142 s, 7 hallazgos | ✅ **242 s, 12 hallazgos** |

⚠️ **La segunda medición contradice a la primera, y por eso está aquí.** El
2026-09-09, con el mismo prompt y lanzados a la vez, 3.8 **no** hizo timeout:
tardó un 70% más y encontró un 70% más. Y los dos hallazgos que solo vio él eran
de los importantes —un `\n` que no cortaba línea y un argumento técnico falso—.

No se sustituye la fila vieja: las dos son ciertas, en tareas y días distintos.
Lo que cambia es la conclusión práctica: **3.8 ya no se descarta de entrada.**

🔑 **La regla vigente: subir el `--print-timeout`, acotar la tarea, y usar el que
encuentra más** — hoy, 3.8 High.

### Si 3.8 se queda sin cupo: la cadena de reserva

Cuando el modelo elegido agota su cuota o choca contra el límite de la cuenta,
**se baja al siguiente de la lista y se sigue**. No se espera, y no se cancela la
pasada.

```bash
agy models   # la lista real, que cambia sola
```

Verificada el 2026-09-13, en orden de preferencia para contrastar:

1. `gemini-3.8-flash-high` — el de hoy
2. `gemini-3.7-flash-high` — el anterior, con 9 hallazgos medidos contra 15
3. `gemini-3.6-flash-high`
4. `gemini-3.1-pro-high` — otra familia, más lento

⚠️ **`agy` también ofrece `claude-sonnet-4-6` y `claude-opus-4-6-thinking`, y para
contrastar son el último recurso.** El revisor de esta casa ya es Claude: pedirle
a otro Claude que contraste lo mismo da un segundo par de ojos mucho menos
independiente. Para *ejecutar* un plan da igual, porque ahí solo se copia código.

**Anotar siempre con qué modelo salió cada pasada.** Sin eso, comparar hallazgos
entre sesiones no significa nada — es la mitad de lo que hizo falsa la conclusión
del `--print-timeout`.

⚠️ **Y no confundir quedarse sin cupo con el `--print-timeout`.** Los dos terminan
en salida vacía. El límite de cuota lo dice en `salida.err`; el del print-timeout
no dice nada y devuelve exit code 0. Por eso se redirige el error a un archivo
aparte y se mira antes de cambiar de modelo.

Por qué el 3.8 chocaba primero contra un límite que era de la herramienta: tarda
13,3 s al primer token —contra 2,99 s de mediana— y produce un 70% más de tokens.
Arranca más lento y es más verboso, así que llegaba antes a los cinco minutos. Con
el límite en 25 minutos deja de importar.

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

⚠️ **Ese argumento no aplica aquí.** `npm test` son 225 tests —al 2026-09-13—
que corren en segundos. Técnicamente agy podría correrlos.

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

### 🔑 Mutar la plantilla, no solo la lógica

Traído de SistemaSalud el 2026-09-13, donde un documento con todos sus tests en
verde salía **vacío en producción**: los tests ejercitaban la función que arma los
datos, nunca la plantilla que los imprime.

Aquí el equivalente es directo. `validar.ts` y `catalogo.ts` tienen tests de
sobra; **quien imprime es `plantilla.tsx`**. Las mutaciones que sirven son suyas:
borrar el bloque del dato, imprimir el valor crudo en vez del formateado, quitar
la captura, saltarse el aviso de datos ficticios.

⚠️ Y recordar la trampa propia de este repositorio: **un test que busca texto en
un SVG de Satori pasa siempre**, porque Satori vectoriza a `<path>`. Se cuentan
bloques, no cadenas. Una mutación de plantilla verificada con una búsqueda de
texto no prueba nada.

### ⚠️ Medir el propio arnés antes de acusar al código

En SistemaSalud una tanda entera de mutaciones dio rojo, línea base incluida.
Parecía una regresión y era **zsh, que no hace word splitting**: dos nombres de
test en una variable viajaban como un solo argumento.

Aquí se corre en zsh igual. Antes de concluir que algo se rompió: correr un caso
suelto a mano y confirmar que el arnés hace lo que uno cree.

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

### 🔑 Correr el código del plan antes de dárselo al agente

Tercera medición de SistemaSalud, **2026-09-13**, y es lo que cambia el orden de
trabajo: 9 tasks, **0 desviaciones de agy** y **3 errores del plan, los tres
encontrados antes de mandarle nada**.

El procedimiento es simple: sacar todos los bloques de código del plan a una
carpeta aparte y **ejecutarlos**. Lo que apareció fue una espera mal puesta, una
expresión regular inválida y una mutación que «tenía que caer» y no caía, porque
había dos protecciones y cada una alcanzaba sola.

Con eso corregido, agy copia un plan que ya funciona, y verificar cada task pasa
a ser **confirmar en vez de depurar**. Es el mismo hallazgo de la tabla de arriba
—el plan es el que miente— pero atacado antes, que sale mucho más barato.

**Y «copió literal» deja de leerse: se diffea.** Ellos escribieron un comparador
que extrae del plan el bloque de cada archivo y lo compara con lo que escribió el
agente. Aquí vale lo mismo, y es más fácil todavía, porque los planes de este
repositorio traen el archivo completo en la mayoría de las tasks.

**Lo que no depende del destino se ensaya igual en otro lado.** Ellos probaron
contra una producción simulada antes de tocar la real. El equivalente aquí:
renderizar y validar en local antes de desplegar, y `curl` al HTML servido
después — nunca estrenar un script contra producción.

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

**Corolario para el prompt de la task:** pedirle al agente que, al final, **liste
los caminos de entrada** de lo que escribió —quién lo llama en producción, por
dónde entra— y diga cuáles tienen test. No hace falta que los escriba: basta con
nombrarlos, porque la lista deja el hueco a la vista.

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

## 12. Las dos plantillas de prompt

Vienen de SistemaSalud, probadas en las corridas que están medidas arriba.
Adaptadas aquí: cambian los comandos y las rutas, no la estructura.

### Contrastar (solo lectura)

```
Sos un revisor técnico senior. Contraste de <spec|plan> contra el código real.

## Reglas — SOLO LECTURA, sin excepciones
- NO modifiques ningún archivo. NO uses git para escribir nada.
- NO despliegues, no publiques en redes, no llames a la Graph API de Meta.
- SÍ podés leer cualquier archivo del repositorio.
- "No encontré nada en esta área" es un resultado VÁLIDO y preferible a inventar
  uno. Cada hallazgo cita archivo:línea o URL — sin cita no es hallazgo.
- Tenés ~20 minutos. Priorizá las áreas en orden y decí cuáles no cubriste.

## Qué leer
AGENTS.md (no se carga solo en headless) y <ruta del spec o del plan>.

## YA CUBIERTO — no lo repitas
- <lista>

## Áreas NUEVAS, en orden de prioridad
1. <área concreta, con archivos y preguntas>

## Formato de salida (obligatorio)
### H1 — <título corto>
- Severidad: BLOQUEANTE | GRAVE | MENOR
- Evidencia: <archivo:línea o URL>
- Qué dice el documento / Qué pasa en realidad / Qué cambiar
## Áreas sin hallazgos — qué revisaste y por qué no encontraste nada
## Áreas no cubiertas por tiempo
```

La primera pasada es igual, sin «YA CUBIERTO», y listando lo que uno ya verificó.

### Ejecutar UNA task

```
Sos el ejecutor de UNA sola task. La rama <rama> ya está creada y activa.

## Qué leer
El plan: <ruta>. Leé SOLO la sección "Task N", hasta donde empieza "Task N+1".

## Qué hacer (solo esto)
Crear o editar estos archivos con el contenido EXACTO de los bloques del plan:
- <ruta>
Copialo tal cual: sin mejorarlo, sin reformatear, sin añadir comentarios ni
type hints ni líneas en blanco extra.

## Qué NO es tuyo
- Correr tests, mutaciones y commitear: los hace otra persona.
- NO uses git. NO ejecutes nada. NO toques archivos fuera de la lista.

## Si algo no coincide
PARÁ esa parte y anotalo en el reporte. No improvises un arreglo distinto.

## Avisos: lo que va a parecer un error y no lo es
- <por task: un import que consume la task siguiente, un tipo que ya existe…>

## Reporte (formato fijo)
1. Archivos tocados y líneas de cada uno.
2. Desviaciones respecto del plan: "ninguna", o cuáles y por qué.
3. Verificación estática: que los símbolos y rutas que usa el código existan.
4. Los caminos de entrada de lo que escribiste, y cuáles tienen test.
5. Lo que no pudiste verificar.
```

### «¿Copió literal?» se diffea, no se lee

SistemaSalud escribió un comparador de 55 líneas que extrae del plan el bloque de
cada archivo y lo diffea contra lo que quedó en el repositorio. Para que funcione,
**cada bloque de código del plan empieza con un comentario con su ruta**
(`// lib/piezas/plantilla.tsx`). Conviene adoptar esa convención al escribir
planes aquí, aunque el comparador se escriba después.

⚠️ Si se escribe, **no en `scripts/`**: está en `.gitignore` y no se commitearía
nunca. Ya pasó una vez.

---

## 13. Repartir un trabajo de video

No hay experiencia medida —ni aquí ni en SistemaSalud— con agentes y video. Esto
es aplicar el método, y conviene decirlo antes de confiarse:

- **Lo determinista se reparte igual que cualquier código**: composición, tiempos
  y scripts de render, por task y con código literal. Antes de dárselo, correr el
  código del plan y **renderizar una muestra**.
- **El juicio visual y de marca no se delega.** El agente reporta lo que ve
  —duración, resolución, texto en pantalla, literal— y decide una persona o un
  criterio escrito antes. «Se ve bien» no es evidencia.
- **La evidencia que no se pierde** es el archivo renderizado con su duración y su
  resolución, y un fotograma por escena. El equivalente al status HTTP del QA.
- **Copy, precios y nombres de clientes quedan fuera del agente.** Salen de
  `catalogo.ts` y se nombran en el prompt; no se le piden de memoria.

---

## 14. Primera ejecución medida aquí — 2026-09-13

**Todo lo de esta sección es de PukaDigital.** Plan:
`docs/superpowers/plans/2026-09-13-reels-publicacion.md`, 9 tasks con código,
`gemini-3.8-flash-high` con `--print-timeout=25m`.

| Task | Qué | `agy` tardó | Desviaciones | Tests al cerrar |
|---|---|---|---|---|
| 1 | tipo `reel` | 33 s | 0 | 138 |
| 2 | estructura del Reel | 87 s | 0 | 144 |
| 3 | hechos del Reel | 81 s | 0 | 148 |
| 4 | franjas 3 y 4 | 76 s | 0 | 155 |
| 5 | Reel de Instagram | 106 s | 0 | 161 |
| 6 | Reel de Facebook | 77 s | 0 | 167 |
| 7 | canales en la tanda | 141 s | 0 | 172 |
| 8 | frontera del Worker | 59 s | 0 | 174 |
| 9 | documentación | 77 s | 0 | 174 |

**Cero desviaciones en 9 tasks**, comprobadas con `diff` y no leyendo. 26
mutaciones, todas como decían las tablas del plan. `build:cloudflare` en verde.

### 🔑 Dónde estuvieron los errores: en el plan, y antes de ejecutar

Confirma lo que SistemaSalud midió tres veces —el agente es fiel, el plan
miente—, con una diferencia: aquí **ningún error llegó a `agy`**.

| Cuándo apareció | Qué |
|---|---|
| Escribiendo el plan | la spec contaba 16 palabras donde hay 18: todos los rangos del validador estaban mal |
| Autorrevisión del plan | 7 fallos: recuentos de tests, un `git worktree add` que no funciona sobre una rama abierta, dos descripciones de mutación falsas |
| **Paso 0** | 4 «Expected» de fases rojas equivocados |
| Al cerrar | una línea de la documentación que el plan no actualizó |

### Tres cosas nuevas, medidas aquí

**1. `tsx` no rechaza un import que no existe: lo deja en `undefined`.** Un
«Expected: error de import, todo el archivo cae» es falso: caen los tests uno a
uno con un `TypeError`. La fase roja se escribe con el número de fallos, no con
el tipo de error. Lo cazó el paso 0 en tres tasks.

**2. `agy` no tiene criterio fijo con la línea en blanco del final.** La
conservó en una task y la quitó en la siguiente. Se compara ignorando **solo**
las líneas en blanco finales; cualquier otra diferencia sigue parando la task.

**3. El plan se aplica con un script, no a mano.** El mismo script —que aplica
«reemplazar exactamente» literalmente y para si el texto no aparece una sola
vez— sirvió tres veces:

- el **paso 0**, aplicando el plan entero;
- la **verificación de cada task**, aplicando solo esa task sobre el commit
  anterior y diffeando contra lo que dejó `agy`;
- generar el **prompt de cada task**, leyendo del plan qué Steps son de código.

Y la fase roja se comprueba aunque `agy` escriba tests e implementación de una
vez: `git stash push -- <implementación>`, correr el test, `git stash pop`.

### ⚠️ El arnés, en zsh

Dos veces midió mal el arnés, no el código:

- **`PIPESTATUS` es de bash**: en zsh sale vacío, y un `exit` de `tsc` pareció
  ausente.
- **Un glob sin coincidencias aborta el comando**: `.eslintrc*` no existía, y el
  «vacío» que devolvió significaba «no corrió», no «no hay cambios».

Es la regla de §8 con dos casos nuevos: antes de creer un resultado vacío,
comprobar que el comando llegó a correr.

---

## 15. Segunda ejecución medida aquí — 2026-09-13

**Todo lo de esta sección es de PukaDigital.** Plan:
`docs/superpowers/plans/2026-09-13-reels-produccion.md`, 11 tasks con código,
el mismo modelo y las mismas opciones que §14. Esta vez no se cronometró a `agy`.

| Task | Qué | Desviaciones | Mutaciones | Tests al cerrar |
|---|---|---|---|---|
| 1 | un párrafo por slide | 0 | 3 | 178 |
| 2 | escenas y subtítulos | 0 | 7 | 186 |
| 3 | lo que exige Meta | 0 | 4 | 192 |
| 4 | la clave en R2 | 0 | 3 | 195 |
| 5 | el aviso por Telegram | 0 | 3 | 198 |
| 6 | el guion con Gemini | 0 | 3 | 204 |
| 7 | la composición | 0 | 4 | 212 |
| 8 | ejecutar y el bloque | 0 | 4 | 217 |
| 9 | la tubería | 0 | 4 | 225 |
| 10 | el comando | 0 | — | 225 |
| 11 | documentación | 0 | — | 225 |

**Otra vez cero desviaciones**, y los tests cayeron exactamente donde el plan los
predijo, hasta el 225 final.

### 🔑 El paso 0 incluyó un render de verdad

§13 lo recomendaba sin haberlo medido. Medido: se aplicó el plan entero en un
worktree descartable, se le puso a mano un bloque `reel` a una pieza y se
renderizó. **Salieron cuatro fallos, y ninguno lo habría encontrado un test ni
un contraste**:

| Qué pasó | Cómo se vio |
|---|---|
| `render --strict` abortó con `non_deterministic_code`. No era código nuestro: era GSAP en línea, que el lint analiza como propio | leyendo el error |
| El error solo decía «Command failed»: HyperFrames escribe en stdout y `ejecutar` miraba stderr | leyendo el error |
| Un subtítulo entero decía «reportes.»: cortar en las comas parte las enumeraciones | **solo mirando el video** |
| Las escenas compartían pista y HyperFrames avisaba `timeline_track_too_dense` | leyendo el aviso |

El contraste con `agy` de ese mismo plan dio dos hallazgos: uno cierto, y otro
falso, que se descartó compilando las dos versiones. Ninguno era de estos cuatro.

🔑 **Para video, el paso 0 no termina en «los tests pasan»: termina mirando un
fotograma por escena.** Es el tipo 4 de §9 —el test prueba una pieza, producción
usa otro camino— en su forma más literal.

### 🔑 Dos tests en verde que no probaban nada

| Task | Tipo (§9) | Qué pasaba |
|---|---|---|
| 6 | 2 — mitad sin test | La respuesta de Gemini se rechazaba sin guion **o** sin caption, y el test solo probaba la primera mitad. Borrar la comprobación del caption no rompía nada |
| 8 | 1 — verde por otra vía | El test buscaba `non_deterministic_code` en el error, y el texto ya estaba en el propio comando: `error.message` de Node es `Command failed: <comando>`. Pasaba aunque se borrara la lectura de stdout |

**Los dos los escribió Claude al corregir el plan, no `agy`.** Es la conclusión
de §8 una vez más —el agente es fiel, el plan miente— con un matiz: **un test
añadido para arreglar el plan también es plan**, y necesita su mutación el mismo
día. Los dos se corrigieron en el plan y en el código, y sus mutaciones ya caen.

### El arnés, otra vez

- **`git stash` no ve archivos sin rastrear.** En §14 la implementación modificaba
  archivos existentes; aquí casi todas eran nuevas. La fase roja se consigue
  apartando el archivo con `mv`, no con `stash`.
- **Una tabla de mutaciones se queda vieja cuando el plan cambia después.** Pasó
  dos veces: el paso 0 añadió tests y lógica, y las tablas de las Tasks 2 y 8
  seguían describiendo el código de antes. Al corregir el plan, se corrige su
  tabla en el mismo commit.
- **`agy-headless -m` no hace lo que parece.** El wrapper reenvió `-m`, `agy` lo
  rechazó con exit 2 e imprimió la ayuda **en el archivo de salida**. Un reporte
  que no está vacío no es un reporte: hay que leerlo.
- **`| tail` se queda con el exit code.** `npm run reels | tail` dio 0 con el
  comando saliendo en 1. Es la regla de §14 con otro caso: el código de salida se
  mide sin tubería.

---

## Documentación relacionada

- `docs/TRABAJO_CON_AGENTES.md` — la fontanería: permisos, carga de reglas, el bug #548
- `~/Proyectos/SistemaSalud/docs/claude/metodo-agentes-paralelos.md` — el original, con el detalle de Django
- `~/Proyectos/SistemaSalud/docs/claude/metodo-reducir-contexto.md` — método aparte, para bajar el contexto de arranque
