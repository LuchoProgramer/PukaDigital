# PukaHealth — límites del producto y reglas de publicación

Lo que el producto **no** hace, verificado contra el código de `SistemaSalud`, y
las reglas que gobiernan cualquier pieza que lo muestre.

Referenciado desde `AGENTS.md`. En salud, una promesa falsa pesa más que en
cualquier otro producto: esto no es una lista de matices, es la diferencia entre
publicar algo cierto y publicar algo falso.

## Lo que el producto NO hace

Verificado contra el código de `SistemaSalud` el 2026-09-02. Escribir esto como si
estuviera hecho es publicar algo falso, y en salud pesa más que en cualquier otro
producto.

| No escribir | La verdad |
|---|---|
| «Se adapta a cualquier especialidad» | **Hay dos verticales clínicas: podología y hemodiálisis** (verificado contra el código de `SistemaSalud` el 2026-09-09: `LedgerXpertz/hemodialisis/`, 260 commits en un mes, ~32.700 líneas, 50 migraciones en producción, y un cliente real —`dialife`— con 166 sesiones registradas). Las demás especialidades **usan el sistema completo** —historia clínica, SOAP, CIE-10, recetas, certificados, estudios en PDF y facturación al SRI— pero sin bloque clínico propio de su rubro. Añadir uno es **desarrollo a medida**, no configuración. Sí vale: «la arquitectura permite sumar especialidades sin reescribir el sistema» |
| «Recordatorios por WhatsApp» | **No existe.** El bot vive en otro proyecto y el enganche no está construido |
| «Sincronización bidireccional con Google Calendar» | **Es unidireccional**, sistema → Google |
| «Nuestra app» | Es web instalable, no nativa. «Funciona en el celular» sí |
| «Firma electrónica del profesional» | Hay autoría y auditoría; no firma criptográfica |
| «Tu paciente reserva solo» | No hay portal de reservas. Es decisión deliberada |

⚠️ **El «precio beta de $25/mes» no existe.** Salió de un estudio de mercado de
LedgerXpertz —un precio promedio para calcular el punto de equilibrio— y se copió
a la spec de PukaHealth. No se le ofreció nunca a nadie. Los precios son **$50/mes
y $480/año**, y la única fuente son ellos: no están respaldados en ningún
repositorio.

⚠️ Y no son solo marketing: los Términos de Servicio de PukaHealth delegan el
precio **en el sitio web**. Lo que se publique aquí pasa a ser la referencia
contractual.


⚠️ **Lo que sí se puede decir sobre la velocidad**, y es mejor material que
cualquier promesa de adaptabilidad: «en un mes construimos la vertical completa
de hemodiálisis, con la normativa del IESS incluida». Es verificable —están los
commits— y concreto, que es lo que funciona en salud: prueba por encima de
promesa.

Tres cuidados para que la frase no se rompa ante el primer cliente que pregunte:

- **No se generaliza.** Ese mes incluyó sesiones semanales con una auditora
  clínica externa. Sin ese acompañamiento el plazo no se sostiene, así que
  «cualquier especialidad en un mes» no está respaldado.
- **Mostrar el caso, no prometer el plazo.** «Tu especialidad en un mes» es una
  promesa que un solo caso no respalda.
- **Decir «vertical» o «módulo», no «especialidad»** al hablar de hemodiálisis:
  en el código no está en el registry, y quien lo revise se confundirá.

⚠️ Y el porqué de que la prohibición siga en pie: «se adapta a cualquier
especialidad» le suena al lector a **configuración** —me registro, elijo mi
especialidad, ya está—, y no lo es: es desarrollo a medida, por rápido que se
haga. Un cliente que lea eso y descubra que su ficha requiere semanas se sentirá
engañado aunque las semanas sean pocas.

## Lo que sí hace, y se puso en duda

Esta lista existe porque una afirmación ausente de la tabla de arriba **no está
permitida por omisión**: `prohibidas.ts` solo caza lo que tiene escrito, así que
lo que no está ahí no lo atrapa nadie. Lo de abajo se preguntó expresamente y se
confirmó; anotarlo evita volver a dudarlo.

| Sí se puede decir | Confirmado |
|---|---|
| Cada documento sale con un **enlace propio de verificación**: quien lo recibe comprueba que es auténtico sin llamar a la consulta | 2026-09-09 |

## El aviso de datos ficticios

Toda pieza que muestre una pantalla del sistema lleva, **dentro de la imagen**,
este texto exacto —con raya larga, no guion—:

```
Datos de paciente ficticios — sistema de demostración
```

⚠️ **Va en cada slide que muestre pantalla, no solo en la portada.** Ese fue
exactamente el error que le costó a este proyecto la retirada de un video en
YouTube, con la apelación rechazada: el aviso estaba en las cards y faltaba en
los fotogramas donde se veía la historia clínica.

Proporciones, medidas sobre el video original y expresadas relativas para que
escalen a vertical: barra del **6,1%** del alto, fuente del **2,7%** del alto,
barra en `#0D1717` con texto blanco centrado. Lo que debe ser idéntico es **el
texto**, no la geometría.

⚠️ Revisar también qué más entra en el encuadre. En un video de este proyecto se
colaron el dock de macOS y una ruta con nombres de archivo reales.

**PukaIA es un CRM, no solo un chatbot.** Tiene inbox centralizado, pipeline Kanban, gestión de clientes, reportes e integraciones. Los competidores que se posicionan como CRM cobran 5-15x más (Mercately $99-499/mes, Zolutium $79, Sellerchat $49). Ese es el ángulo competitivo; no lo describas como "chatbot" a secas.

`next.config.ts` **no tiene redirects** — solo configuración de imágenes. Decisión del 2026-04-12: empezar limpio.
