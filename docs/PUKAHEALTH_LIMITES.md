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
| «Se adapta a cualquier especialidad» | **Solo podología está implementada.** Las demás caen a un formulario genérico. Sí vale: «la arquitectura permite sumar especialidades sin reescribir el sistema» |
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
