# Ecosistema de publicidad — Meta y TikTok

Inventario de cuentas, píxeles e identificadores, más las reglas de qué se pauta
y cuándo. Actualizado: **2026-09-20**.

Para las convenciones de eventos en el código, ver `ANALYTICS_TRACKING.md`.
Para el trabajo orgánico de redes, ver `COMMUNITY_MANAGEMENT.md`.

---

## Meta (Facebook e Instagram)

| Activo | Identificador | Notas |
|---|---|---|
| Portfolio comercial | `758680150376625` | `PukaDigital` — verificado como **Puka Digital LLC** + Tech Provider |
| Cuenta publicitaria | `1097475412619983` | `PukaDigital Ads` · USD · America/Guayaquil |
| Píxel / dataset | `2045774666297992` | `PukaDigital Web` · conectado a `PukaDigital Ads` |
| Dominio verificado | `pukadigital.com` | Meta tag `zb46u0vripnq10zx6svtlcgj2n7k5o` en `app/layout.tsx` |
| Cuenta de WhatsApp (WABA) | `1124927996392227` | `PukaIA` · **sin números registrados** (consultado por API el 2026-09-21) |
| WhatsApp de ventas | `+593 96 406 5880` | En la **app WhatsApp Business**, no en la Cloud API. Es el número principal de la Página: los anuncios de clic a WhatsApp llegan ahí |
| Instagram | `17841476784325626` | `@pukadigital`, conectado a la página `PukaDigital` |
| Página de Facebook | `764585143409223` | `PukaDigital` |
| Usuario del sistema | `61585035184971` | `PukaDigital_Api` · admin · dueño de `META_ADS_TOKEN` |

**Pago:** Visa ···· 6230 asignada a `PukaDigital Ads` desde el 2026-09-20, con
**límite de gasto de $50 al mes** que se reinicia el día 1. Al llegar al tope,
Meta pausa todos los anuncios.

⚠️ La tarjeta se carga **en el portfolio** y luego hay que **asignarla aparte a
la cuenta publicitaria**. Con solo el primer paso, la cuenta sigue sin método de
pago.

El límite se cambia en el
[Billing Hub](https://business.facebook.com/billing_hub/accounts/details?asset_id=1097475412619983&business_id=758680150376625),
no por API: el token no tiene acceso a finanzas, a propósito. Por API
`spend_cap` se lee en **centavos**: `"5000"` son $50.

### Pautar por API

La Marketing API se usa con **`META_ADS_TOKEN`** en `.env.local`, solo en local:
el Worker no lo necesita. Es un token del usuario del sistema `PukaDigital_Api`
sobre la app **PukaDigital Social**, y **no caduca**.

| Permiso | Para qué |
|---|---|
| `ads_management` · `ads_read` | crear, editar y pausar campañas; leer sus métricas |
| `business_management` | leer los activos del portfolio |
| `pages_show_list` · `pages_read_engagement` · `pages_manage_ads` | anuncios a nombre de la Página y sus comentarios |
| `instagram_basic` | usar `@pukadigital` y sus Reels en anuncios |
| `read_insights` · `instagram_manage_insights` | métricas orgánicas, para compararlas con la pauta |

Los activos se asignaron con **acceso parcial**: en la cuenta publicitaria,
campañas y rendimiento, sin finanzas; en la Página y en Instagram, solo anuncios
y estadísticas.

⚠️ **No tiene permisos de publicar** (`pages_manage_posts`,
`instagram_content_publish`), y es deliberado: publicar es trabajo del token del
cron. Un error en un script de pauta no puede publicar en el feed.

🔴 **Nunca usar el botón «Obtener token» de la API de marketing** en
developers.facebook.com. Meta avisa ahí mismo que revoca los permisos que el
usuario ya le dio a la app, y de esos permisos salen los tokens de Página del
cron: la publicación se rompería **sin dar error**. Un token nuevo se genera
desde *Configuración del negocio → Usuarios del sistema → PukaDigital_Api →
Generar token*.

Para cargarlo sin que pase por pantalla, con el token copiado:

```bash
T="$(pbpaste | tr -d '[:space:]')"; sed -i '' '/^META_ADS_TOKEN=/d' .env.local
[ -n "$(tail -c1 .env.local)" ] && echo >> .env.local   # sin esto se pega a la última línea
printf 'META_ADS_TOKEN=%s\n' "$T" >> .env.local; pbcopy < /dev/null
curl -s "https://graph.facebook.com/v21.0/debug_token?input_token=$T&access_token=$T"
```

Tiene que decir `"type": "SYSTEM_USER"`, `"expires_at": 0` y los nueve permisos.

**El MCP oficial de Meta (`mcp.facebook.com/ads`) se descartó** el 2026-09-20:
con la API alcanza. Además no conecta desde Claude Code por terminal, porque Meta
rechaza el registro OAuth con `localhost` (issues #55002, #57191 y #58054 de
`anthropics/claude-code`), y solo funciona como conector de claude.ai.

### El píxel

Vive en `app/layout.tsx`, con el id en `lib/analytics.ts` como `META_PIXEL_ID`.
El bloque está envuelto en `{META_PIXEL_ID && ...}`: vaciar la constante lo
desactiva sin romper el build.

Existe un segundo dataset, `PukaDigital Engine` (`922568993500779`), que es de
**app**, no de web. Nunca recibió eventos y no sirve para el sitio. No usarlo.

---

## TikTok

| Activo | Identificador | Notas |
|---|---|---|
| Business Center | `7631984317779722256` | `Luis Omar Viteri Sarango_bc_q69h51` |
| Cuenta publicitaria | `7631984365191938064` | `Luis Omar Viteri Sarango_adv` · USD · America/Guayaquil |
| Píxel | `D7L49URC77U471PGSURG` | `Pixel_PukaDigital`, en `app/layout.tsx` |
| Cuenta orgánica | `7561567291788296209` | `@pukadigital` — conectada, Spark Ads habilitado |

⚠️ **Pendiente:** completar facturación y método de pago en
[TikTok Ads](https://ads.tiktok.com/i18n/account/payment).

**Spark Ads** permite promocionar publicaciones orgánicas conservando comentarios
y seguidores. Es el puente con el trabajo de la community manager: un post que
funcione solo es candidato a pauta, y rinde más que un anuncio hecho desde cero.

### Publicar en TikTok por API: no con app propia

Las *Content Sharing Guidelines* de TikTok excluyen este caso de uso:

> «API Clients must not be limited to test applications and should be intended for a
> wide audience, not limited to internal groups/private use.»

El ejemplo que dan de lo **no** aceptable es «a utility tool to help upload contents
to the account(s) you or your team manages» — literalmente esto. Una app propia se
rechaza, y mientras no esté auditada `privacy_level` se fuerza a `SELF_ONLY`: todo lo
publicado queda privado.

Aplica igual a Postiz autoalojado, que usa credenciales propias y por tanto necesita
app propia auditada.

Lo que sí funciona: **publicar a mano** —con dos videos al mes son dos minutos— o un
servicio multi-tenant ya auditado (Upload-Post $24/mes, Blotato $29, Postiz cloud).
Meta es distinto: ahí sí se puede publicar con Graph API propia, y el portfolio ya
está verificado como Tech Provider.

---

## Qué se pauta y cuándo

### Awareness: no

El objetivo **Reconocimiento de marca** le pide a Meta impresiones baratas, y
Meta cumple mostrando el anuncio a quien menos cuesta alcanzar, que es también
quien menos actúa. Sirve para cobertura masiva con presupuesto grande.

Para vender suscripciones a nichos pequeños es tirar plata: se pagan miles de
impresiones para alcanzar a decenas de personas.

### La secuencia

| Fase | Canal | Por qué |
|---|---|---|
| 1 · meses 1-2 | Contacto directo, cero pauta | Con un mercado que cabe en una hoja de cálculo se llega al 100% a mano en seis semanas. Y hay que oír las objeciones en vivo antes de pagar por repetirlas |
| 2 · meses 3-4 | Sigue sin pauta | Convertir los primeros clientes en testimonios y guion probado |
| 3 · mes 5+ | Pauta | Amplifica algo que ya funciona. Antes solo amplifica dudas |

### Cuando llegue la fase 3

- **Público personalizado con lista propia.** Subir los prospectos ya
  recopilados. Es más preciso que segmentar por intereses: no se estima, se sabe
  quiénes son.
- **Objetivo mensajes a WhatsApp.** La conversión ocurre dentro de Meta, así que
  no depende de que el píxel esté maduro, y deja la conversación abierta.
- **Retargeting a visitantes de `/pukahealth`.** Esto sí se puede montar ya: el
  píxel acumula ese público desde el 2026-08-30.

---

## Atribución

El problema que casi todos se saltan: **quien ve una pieza y escribe por WhatsApp
nunca pasa por la web.** Ni el píxel ni GA4 lo ven.

Dos medidas, ambas gratis y sin código:

1. **Un texto distinto por pieza en el enlace de WhatsApp**, para que el propio
   mensaje diga de dónde viene:

   ```
   wa.me/593964065880?text=Vengo de Instagram - LedgerXpertz
   wa.me/593964065880?text=Vengo de Instagram - PukaIA
   ```

2. **UTM en el enlace de la biografía.** GA4 los lee sin tocar código. Sin UTM,
   todo el tráfico de Instagram entra como una masa indistinguible.

   ```
   pukadigital.com/productos?utm_source=instagram&utm_medium=bio&utm_campaign=pukahealth
   ```

---

## Qué medir

Una métrica manda: **clientes pagando al cierre de mes**. No leads, no pruebas
iniciadas, no seguidores.

Los tres escalones, separados, porque dicen *dónde* se rompe:

1. De cada diez contactados, cuántos aceptan ver el demo
2. De los que lo ven, cuántos empiezan la prueba
3. De los que prueban, cuántos siguen pagando al tercer mes

Lo que no se mira: seguidores, likes, alcance suelto, pruebas gratis iniciadas
como métrica de éxito.

---

## Historial

| Fecha | Qué pasó |
|---|---|
| 2026-08-30 | Se crea el dataset `PukaDigital Web` y se instala el píxel de Meta en producción (PR #4). Antes el sitio solo tenía GA4, Google Ads, Clarity y TikTok, pese a que la política de privacidad ya declaraba el Facebook Pixel |
| 2026-08-31 | Se registran cuenta publicitaria de Meta, Business Center de TikTok y vinculación orgánica de `@pukadigital` con Spark Ads |
| 2026-09-20 | Se conecta la Marketing API con un token del usuario del sistema `PukaDigital_Api`, se asigna la Visa a `PukaDigital Ads` y se fija un límite de gasto de $50 al mes. Se descarta el MCP oficial de Meta |
| 2026-09-21 | Se corrige el inventario: la WABA `PukaIA` no tiene números. El `+593 96 406 5880` vive en la app WhatsApp Business y ya era el número principal de la Página |
