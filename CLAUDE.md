@AGENTS.md

# Claude Code — PukaDigital

Las reglas del proyecto están en `AGENTS.md`, importado arriba. Aquí va **solo lo que no
viaja a otros agentes**: el método de trabajo que dan los skills de Claude Code.

Si trabajas desde Antigravity, Cursor o Codex, este archivo no aplica y `AGENTS.md` te
basta — salvo el método, que ahí hay que dar a mano.

## Método

Antes de crear o modificar comportamiento —una función, una página, una pieza— va el
skill `superpowers:brainstorming`. No es opcional y no se salta por simplicidad
aparente: los proyectos «simples» son donde las suposiciones sin examinar cuestan más.

El recorrido completo:

| Paso | Dónde queda |
|---|---|
| Brainstorming → spec aprobada | `docs/superpowers/specs/YYYY-MM-DD-<tema>-design.md` |
| Spec → plan de implementación | `docs/superpowers/plans/YYYY-MM-DD-<tema>.md` |
| Implementación | rama propia, nunca directo a `main` |

Antes de decir que algo está listo, corre `superpowers:verification-before-completion`:
evidencia primero, afirmación después. «Compila» no es lo mismo que «funciona» — ver la
advertencia de tipografía en `AGENTS.md`, que compilaba perfecto y renderizaba mal.

## Ramas y commits

`main` es la rama por defecto y despliega a producción en Vercel. Trabajar siempre en
rama y entrar por PR.

Formato de commit y ejemplos: sección *Commits* de `AGENTS.md`. Añadir además el pie de
atribución de Claude Code.

## Memoria

La memoria persistente de sesiones vive fuera del repositorio, en
`~/.claude/projects/-Users-luisviteri-Proyectos-PukaDigital/memory/`. No duplicar ahí lo
que ya dice `AGENTS.md` o el código: la memoria es para lo que no se deduce leyendo el
repositorio.
