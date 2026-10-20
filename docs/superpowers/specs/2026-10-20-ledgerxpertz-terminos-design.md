# Términos de LedgerXpertz — diseño

Aprobado por Luis el 2026-10-20. Encargo de la sesión de Inventario: un cliente con
5 locales recibió accesos hace un mes, casi no usó el sistema y ahora pide cambios a
medida sin fin. Hace falta dejar por escrito qué incluye el plan y qué no.

## Decisiones

| Tema | Decisión |
|---|---|
| URL | `/legal/ledgerxpertz`. Hereda el `noindex` de `app/legal/layout.tsx` y queda **fuera** del sitemap, como el resto de las páginas legales |
| Relación con los generales | Complementa `/legal/terminos` y `/legal/politica-de-privacidad`. Si chocan, para LedgerXpertz mandan estos términos |
| Proveedor | Puka Digital LLC, EIN 320856610: el mismo dato que ya está en los generales. Nada inventado |
| Prueba | 30 días desde la **entrega de accesos**, se use o no el sistema. Lo que no se reporte en ese plazo no forma parte de la implementación |
| Error frente a mejora | Si el sistema no hace algo que promete, es un error y se corrige gratis. Una función nueva, un cambio en cómo trabaja o una integración es desarrollo a medida: se cotiza, se aprueba por escrito y se agenda |
| Locales | Se pasa al plan que cubra los locales. Por encima de los 3 de Pro: **$10/mes + IVA por local adicional** |
| Soporte | WhatsApp, de lunes a viernes de 9:00 a 18:00 (hora de Ecuador), respuesta en 24 h hábiles |
| Suspensión | A los **5 días** del vencimiento sin pago |
| Responsabilidad | Mejor esfuerzo; tope = lo pagado en los últimos 12 meses. Cambios con 30 días de aviso |
| Precio anual | Se mantienen $144/$192/$240. «2 meses gratis» era falso (son 2,4): pasa a «20% de descuento» |

## Archivos

- `app/legal/ledgerxpertz/page.tsx` — nuevo, mismo molde que `app/legal/terminos/page.tsx`.
- `app/ledgerxpertz/page.tsx` — enlaces legales bajo los planes y en el pie; «20% de descuento» en el selector y en la FAQ de precios.
- `public/llms.txt` — el descuento anual de LedgerXpertz.

## Fuera

- El sitemap: las páginas legales se excluyen a propósito.
- PukaHealth también dice «2 meses gratis» con $480/año (serían $500). Anotado, no se toca aquí.
- Push y despliegue: esperan el ok de Luis.

## Verificación de punta a punta

1. `npx tsc --noEmit` y `npx eslint` de los archivos tocados, limpios.
2. En `npm run dev`: `/legal/ledgerxpertz` responde 200 y trae `noindex`; desde `/ledgerxpertz` los tres enlaces llevan a páginas que existen; el selector anual dice «20% de descuento».
3. `grep -rn "2 meses gratis" app/ledgerxpertz public/llms.txt` solo deja la línea de PukaHealth.
