# Transición a Puka Digital LLC (Wyoming, USA)

> Actualizado el **2026-08-30** tras verificar la cuenta comercial en Meta Business Suite.

## 📌 Datos de la Empresa (Activos y Confirmados)

- **Razón Social:** Puka Digital LLC
- **Jurisdicción:** Casper, Wyoming, Estados Unidos
- **Dirección Registrada:** 5830 East 2nd Street, Ste 7000, Casper, Wyoming 82609, USA
- **EIN (Tax ID):** `320856610`
- **Estado en Meta Business Suite:** ✅ Verificada como Organización + Tech Provider (ID: `758680150376625`)
- **Dominio Verificado en Meta:** ✅ `pukadigital.com` (Meta tag `zb46u0vripnq10zx6svtlcgj2n7k5o`)
- **Cuenta Publicitaria Creada:** ✅ `PukaDigital Ads` (ID `1097475412619983`, vinculada al Píxel `2045774666297992`)

---

## 📋 Checklist de Tareas

### ✅ Completadas (2026-08-30)
- [x] Registro y verificación de Puka Digital LLC en Meta Business Suite.
- [x] Verificación de Tech Provider para APIs de WhatsApp.
- [x] Inyección de metaetiqueta y verificación del dominio `pukadigital.com`.
- [x] Creación de cuenta publicitaria `PukaDigital Ads` y vinculación del Píxel.
- [x] Actualización de páginas legales en el repo (`/legal/politica-de-privacidad`, `/legal/terminos`, `/legal/google-calendar-privacidad`, `/legal/google-calendar-terminos`) con la razón social Puka Digital LLC (Wyoming, EIN 320856610).
- [x] Actualización del nombre de la App en Google Cloud Console OAuth Consent Screen a `PukaIA` y vinculación de URLs legales.
- [x] Asociación de Google Analytics 4 (`514366233`) a Google Search Console (`sc-domain:pukadigital.com`) para Search Console Insights.
- [x] Vinculación de las 4 redes sociales oficiales (Instagram, Facebook, LinkedIn, YouTube) en el Perfil de Empresa en Google (Google Business Profile).
- [x] Actualización del contexto de `CLAUDE.md`.

### ⚠️ Pendientes

#### 1. Configurar Método de Pago para Pauta
- [ ] Entrar a [Billing Hub de Meta](https://business.facebook.com/billing_hub/payment_methods) y agregar tarjeta de crédito/débito a `PukaDigital Ads` (`1097475412619983`).

#### 2. Google Cloud Console (Verificación de Marca / Brand Verification)
- [ ] Diseñar el logo definitivo de PukaIA (120x120px).
- [ ] Subir el logo oficial a Google Cloud Console → Branding y enviar a verificación de marca.

#### 3. Stripe Webhooks en chatbot-python (repo separado)
- [ ] En `chatbot-python`, configurar endpoint FastAPI para escuchar pagos de Stripe:
  - Guardar `tenant_id` como metadata en Stripe Customer.
  - Al confirmar pago → habilitar acceso a Google Calendar para ese tenant en Firestore.
  - Configurar Stripe Tax (Ecuador sin tax USA).
