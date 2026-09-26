# Política de privacidad conforme a la LOPDP — diseño

**Fecha:** 2026-09-26 · **Aprobado por:** Luis, en sesión · **Archivo:** `app/legal/politica-de-privacidad/page.tsx`

## Por qué

La política publicada afirma cosas falsas y le faltan piezas que la LOPDP del Ecuador
pide. La referencia de estructura es el consentimiento de QUITObici del Municipio de
Quito (PDF recibido por AirDrop el 2026-09-26): no se copia su texto —es una entidad
pública con otras bases legales—, se toma lo que hace bien: base legal por
tratamiento, consentimiento opcional separado, revocación, decisiones automatizadas
con revisión humana, reclamo ante la autoridad.

## Lo que hoy es falso o falta — verificado el 2026-09-26

| La política dice | La verdad | Evidencia |
|---|---|---|
| «Sin almacenamiento de contraseñas — autenticación delegada a Google OAuth» | PukaHealth y LedgerXpertz usan contraseñas, con el hasher por defecto de Django (PBKDF2-SHA256) y JWT | `SistemaSalud`: `simplejwt`, `PASSWORD_HASHERS` solo en settings de test |
| «Datos almacenados en Google Cloud Firestore» / «se procesan en Google Cloud en Estados Unidos» | PukaHealth, LedgerXpertz y el bot corren en un VPS de Hetzner en **Núremberg, Alemania**. Las conversaciones del bot están en Firestore **`southamerica-east1` (São Paulo)** | Consola de Hetzner (`puka-api-prod`, CX33, `178.104.71.228`); `gcloud firestore databases list` |
| Stripe «(próximamente)» como subprocesador | No es proveedor hoy | — |
| — | Falta Cloudflare, que sirve el sitio desde el 2026-09-08 | `AGENTS.md` § Deploy |
| — | Falta el píxel de TikTok, que carga en todas las páginas | `app/layout.tsx:161` |
| Dos fechas: «08 de abril de 2026» arriba, «30 de agosto de 2026» al pie | Una sola | — |
| No dice quién es responsable de las historias clínicas | El médico es el responsable; PukaDigital, encargado | — |
| No declara los recordatorios de citas por WhatsApp | Se activan el 2026-09-26: teléfono y datos de la cita pasan de PukaHealth al bot y a Meta | `chatbot-python`: `feat(health): recordatorio 2 días antes`, 2026-09-24 |

Sí es cierto y se mantiene: tokens de Google Calendar cifrados con AES-256-GCM
(`chatbot-python/app/utils/crypto.py`).

## Diseño: dos partes, según quién decide sobre los datos

**Encabezado**
- **Resumen** — reescrito sin afirmaciones falsas.
- **1. Quiénes somos** — sin cambios de fondo.
- **2. Responsable y encargado** — nueva. Cuándo PukaDigital decide sobre los datos y
  cuándo los trata por cuenta de su cliente.

**Parte 1 — PukaDigital como responsable**
- **3. Qué tratamos, para qué, con qué base legal y por cuánto tiempo.** Tabla:

  | Quién | Datos | Finalidad | Base legal (LOPDP art. 7) | Plazo |
  |---|---|---|---|---|
  | Visitantes del sitio | cookies, IP, dispositivo (GA4, Google Ads, píxel de Meta, píxel de TikTok) | analítica y publicidad de PukaDigital | interés legítimo, con derecho de oposición | 14 meses (GA4) |
  | Prospectos | nombre, teléfono, correo, mensajes (formularios y WhatsApp de ventas, que contesta un bot) | responder y cotizar | consentimiento / medidas precontractuales | 2 años desde el último contacto |
  | Clientes que contratan | datos del negocio y de contacto | prestar el servicio | ejecución del contrato | mientras dure + plazos legales |
  | Facturación | RUC, razón social, montos | obligación tributaria | obligación legal | 7 años |

  Sobre los píxeles se dice la verdad: **cargan al entrar al sitio**, y cómo
  desactivarlos. Cuando exista el banner (spec aparte), su base pasa a consentimiento.
- **4. Lo opcional.** Comunicaciones comerciales: consentimiento separado, negarse no
  limita el servicio, revocable en cualquier momento sin afectar lo tratado antes.

**Parte 2 — PukaDigital como encargado**
- **5. PukaHealth.** El médico es responsable. La historia clínica es **dato sensible de
  salud**. Recordatorios por WhatsApp: salen el teléfono del paciente y los datos de la cita
  (los campos exactos se leen en `chatbot-python/app/health/` antes de escribirlos); pasan por el bot y por Meta; no se usan para nada más. El
  paciente ejerce sus derechos ante su médico, y PukaDigital lo asiste.
- **6. PukaIA.** La actual «3 bis», sin cambios de redacción salvo lo que la haga falsa.
- **7. LedgerXpertz.** El negocio es responsable de los datos de sus compradores.
- **8. APIs de Google.** La actual «3», **sin cambios de redacción**.

⚠️ Las secciones 6 y 8 las leen los revisores de Google (verificación OAuth) y Meta
(Tech Provider). No se reescriben por estilo.

**Común**
- **9. Proveedores y ubicación:** Hetzner (Alemania), Google Cloud — Firestore (Brasil),
  Vertex AI/Gemini y Speech —, Meta (WhatsApp), Cloudflare, GA4, Google Ads, píxel de
  Meta, píxel de TikTok. Sale Stripe.
- **10. Transferencias internacionales:** Alemania, Brasil y Estados Unidos, y con qué
  garantías.
- **11. Conservación:** la lista actual, revisada contra la tabla de la sección 3.
- **12. Seguridad:** contraseñas con hash (PBKDF2-SHA256), JWT, tokens de Google con
  AES-256-GCM, TLS, respaldo diario del servidor con 7 días de retención, acceso por
  tenant.
- **13. Decisiones automatizadas:** el bot responde de forma automática, no toma
  decisiones con efectos jurídicos o similares, y siempre se puede pedir una persona.
- **14. Tus derechos:** acceso, rectificación y actualización, eliminación, oposición,
  limitación, suspensión, portabilidad, no ser objeto de decisiones automatizadas.
  Qué pasa si no se entrega un dato obligatorio. Plazo de respuesta.
- **15. Reclamo** ante la Superintendencia de Protección de Datos Personales.
- **16. Cookies:** se añade TikTok.
- **17. Cambios** y **18. Contacto**, con **una sola fecha de actualización**: la del
  despliegue.

**Forma:** mismo patrón visual de la página actual (secciones con icono Lucide,
entidades HTML en español). Los datos de las tablas como arrays a nivel de módulo.

## Fuera de alcance

- El banner de consentimiento de cookies — spec propio.
- La plantilla de consentimiento para pacientes de PukaHealth — el trabajo siguiente.
- Versión en inglés.
- Delegado de protección de datos — decisión para el abogado.
- Corregir `/legal/cookies`, `/legal/terminos` y `public/llms.txt`: se **revisan**
  contra la nueva política y las contradicciones se **listan** en el PR, sin tocarlas.

## Riesgos

- **Texto legal sin abogado.** Las bases legales de la Parte 1, sobre todo el interés
  legítimo para píxeles publicitarios, deben pasar por uno.
- **Afirmar el recordatorio antes de que exista.** El despliegue va el mismo día que
  Luis active los recordatorios, no antes.

## Verificación de punta a punta

1. `npx tsc --noEmit` sin errores y `npx eslint app/legal/politica-de-privacidad/page.tsx` limpio.
2. `npm run dev` y la página en el navegador: se ve completa, tablas legibles a ancho de
   teléfono, un solo `<h1>`.
3. Tras `npm run deploy:cloudflare`, contra producción:
   ```bash
   curl -s https://pukadigital.com/legal/politica-de-privacidad > /tmp/pp.html
   grep -c 'Sin almacenamiento de contrase' /tmp/pp.html   # 0
   grep -c 'Stripe' /tmp/pp.html                          # 0
   grep -c '08 de abril de 2026' /tmp/pp.html             # 0
   grep -c 'N&uacute;remberg\|Núremberg' /tmp/pp.html     # ≥1
   grep -c 'Superintendencia' /tmp/pp.html                # ≥1
   grep -c 'TikTok' /tmp/pp.html                          # ≥1
   ```
4. Las secciones de APIs de Google y de WhatsApp comparadas con `git diff`: solo cambian
   donde el texto anterior era falso.
