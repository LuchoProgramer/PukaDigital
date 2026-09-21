# Próximos pasos — PukaDigital

> Auditoría del **2026-08-29**, verificada contra producción (`curl` al HTML servido), no contra el repo.
> Ordenado por impacto sobre esfuerzo. Al cerrar un punto, márcalo y anota la fecha.

## 1. Falta `og:image` en las páginas de producto — ALTO impacto, bajo esfuerzo

Verificado: la home sí lo tiene. **`/agentes-ia`, `/ledgerxpertz` y `/pukahealth` no.**

**Por qué duele.** Todos los CTAs del sitio empujan a WhatsApp. Cuando alguien comparte por WhatsApp el enlace de un producto — que es exactamente lo que hace un prospecto interesado al consultarlo con su socio — sale sin imagen. Es el peor momento posible para verse roto.

- [ ] Añadir `openGraph.images` en el `layout.tsx` de cada producto
- [ ] Imagen 1200x630, idealmente una por producto y no la genérica
- [ ] Verificar: `curl -s https://pukadigital.com/agentes-ia | grep 'og:image'`

## 2. Titles demasiado largos — MEDIO

Google trunca alrededor de los 60 caracteres:

| Página | Largo | Estado |
|---|---|---|
| `/` | 60 | ✅ justo en el límite |
| `/ledgerxpertz` | 79 | ⚠️ se corta |
| `/agentes-ia` | 82 | ⚠️ se corta |
| `/pukahealth` | 88 | ⚠️ se corta |

Lo que se corta es la cola, así que hay que asegurar que **la keyword y la propuesta de valor entren en los primeros 60**.

- [ ] Recortar los tres, cuidando que `crm para whatsapp business` siga al frente en `/agentes-ia`
- [ ] La description de `/agentes-ia` también está larga (189 caracteres; el corte ronda los 160)

## 3. Revisar el schema `HowTo` de la home — BAJO

La home emite `HowTo` + `HowToStep`. Google **retiró los rich results de HowTo** en 2023: ya no genera resultado enriquecido en ningún dispositivo.

No hace daño, pero ocupa bytes y da una falsa sensación de cobertura.

- [ ] Decidir si se conserva por otros consumidores o se elimina
- [ ] Si se conserva, dejar el porqué escrito para que nadie lo "arregle" después

## 4. Hipótesis de conversión a testear — no aplicar a ciegas

La literatura de CRO 2026 dice que **las landings con menú de navegación convierten 10-15% menos** que las equivalentes sin menú. `/ledgerxpertz` es una landing standalone y **sí** tiene navbar propio.

No lo cambies porque lo diga un blog: es una hipótesis, y el dato viene de agregados de la industria, no de tu tráfico.

- [ ] Medir primero el comportamiento actual en GA4 (¿cuánta gente usa ese navbar?)
- [ ] Si el uso es marginal, es candidato a A/B test
- [ ] Orden de test recomendado por impacto: **titular → copy y color del CTA → ubicación de la prueba social**

## 5. Tarea de fondo pendiente

- [ ] `lib/i18n` + `LanguageProvider` — 73 llamadas a `t()` en 4 páginas (`productos`, `demos`, `contacto`, `casos`). El sistema siempre estuvo hardcodeado a español y nunca generó rutas `/es/` ni `/en/`. **No causa daño SEO.** Impacto de bundle mínimo (~2 KB comprimido). Baja prioridad.

## 6. Documento de Estrategia de Ads / Pauta Publicitaria (Pendiente próxima sesión)

- [ ] Crear `docs/ADS_STRATEGY.md` con estructura de campañas (Meta, TikTok, Google), copies, presupuestos mínimos ($3-$5/día), retargeting y automatización por API.
- [x] Conectar la Marketing API de Meta: token, tarjeta y límite de gasto. Hecho el 2026-09-20, ver `ECOSISTEMA_ADS.md` → «Pautar por API». El script `npm run pautar` espera instrucciones.

## 7. Estrategia de Reseñas Verificadas en Clutch.co & Directorios

- [ ] Configurar Cloudflare Email Routing (o Zoho Mail Free) para clientes reales (`podoclinicec.com`, `healppypets.com`, `hoteleudiq.com`) para crear alias corporativos (ej. `contacto@podoclinicec.com` reenviando a sus Gmails).
- [ ] Enviar enlace directo de reseña de [Clutch.co](https://clutch.co/profile/pukadigital) a los clientes clave.
- [ ] Obtener 3 a 5 reseñas verificadas (vía email corporativo o LinkedIn) para desbloquear la insignia de **Top Verified Agency** en Clutch.

## 8. WhatsApp de ventas por coexistencia — ✅ hecho el 2026-09-21

El `+593 96 406 5880` quedó conectado por coexistencia desde `chatbot-python`: el bot
(tenant «PukaDigital Ventas») responde y se calla solo en el chat donde Luis contesta a
mano. Quedó en la WABA `1371993187962176`, **no** en `PukaIA`. Detalle en
`chatbot-python/docs/claude/estado.md`, sesión 2026-09-21.

- [ ] 🔴 **El historial no sincroniza** (`/smb_app_data` da `131000`): el bot no sabe qué
  chats ya existían y ya se metió una vez en uno personal. Se resuelve en `chatbot-python`.
- [ ] Caso de soporte de Meta `#29666578639598061`, abierto por el error `#1690130`
  (Tech Provider dueño del mismo portfolio).

## 9. Pendientes que dejó `chatbot-python` el 2026-09-21

Llegaron como nota en `CLAUDE.md`; se movieron aquí porque `CLAUDE.md` es para el método.

- [ ] 🔴 **Migrar `lib/genai.ts`** de `gemini-2.5-flash` a Gemini 3 antes del
  **2026-10-16**. Usa la Gemini API con API key, no Vertex: verificar sus fechas de retiro
  en ai.google.dev. El bot eligió `gemini-3.7-flash` con su gate de evals (13/0 contra 7/2
  de 3.8). Gemini 3 solo existe en la región `global`. Decisión completa en
  `chatbot-python/docs/decisions/2026-09-21-migracion-gemini-3-7-flash.md`.
- [x] Prueba de PukaHealth de 30 a **15 días**, y fuera la oferta de «primeros 10 médicos
  sin instalación» — hecho el 2026-09-21.
- [ ] **«Cualquier especialidad»**: la FAQ de `/pukahealth`, la tabla comparativa y
  `public/llms.txt` lo afirman, y `PUKAHEALTH_LIMITES.md` lo prohíbe. Luis dice que ya está
  listo: se decide en un brainstorming, junto con el prompt inicial del bot, y se alinea
  con `chatbot-python`.
- [ ] La FAQ compara con Orpheus ($60–80/mes, «formularios fijos») y promete «Cumplimiento
  MSP», sin fuente en el repo.

## Lo que está bien y conviene no romper

Verificado en producción el 2026-08-29:

- Un solo `<h1>` en las cuatro páginas auditadas
- Canonicals correctos en todas
- `robots.txt` declara 5 crawlers de IA
- `llms.txt` presente y actualizado
- Schema renderizado en el HTML servido, no inyectado por JS — el arreglo del 2026-08-28 aguanta
- Cobertura de schema muy alta: `SoftwareApplication` + `FAQPage` + `Organization` + `ProfessionalService` en las páginas de producto
- HTML de la home en 56 KB, el más liviano de los tres sitios del ecosistema
- Analytics: doble conteo de conversiones y atribución arreglados, y la cookie de sesión de GA4 se lee bien en producción

## Contexto para la próxima sesión

Este documento nació junto con la reescritura de `CLAUDE.md` del 2026-08-29, en la que:

- se recortó `CLAUDE.md` de 343 a menos de 200 líneas (consenso 2026: cada línea gasta contexto en cada turno)
- las auditorías cerradas de abril y el keyword research se movieron a `docs/HISTORIAL_SEO.md`
- la transición a LLC se movió a `docs/TRANSICION_LLC.md`
- **se corrigió la justificación de GEO**: `llms.txt` y el schema no sirven para que la IA de Google te cite — Google lo dice explícitamente desde mayo de 2026. Se mantienen por los rich results y por los crawlers no-Google. El detalle está en `CLAUDE.md`.
