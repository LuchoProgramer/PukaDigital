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
- [x] Actualización del contexto de `CLAUDE.md`.

### ⚠️ Pendientes

#### 1. Actualizar páginas legales con la razón social de la LLC
Archivos a modificar:
- [ ] `app/legal/politica-de-privacidad/page.tsx` — agregar Puka Digital LLC (Wyoming, EIN 320856610).
- [ ] `app/legal/terminos/page.tsx` — actualizar razón social y jurisdicción (Ecuador + Wyoming, USA).
- [ ] `app/legal/google-calendar-privacidad/page.tsx` — actualizar nombre legal y dirección de Wyoming.
- [ ] `app/legal/google-calendar-terminos/page.tsx` — ídem.

#### 2. Configurar Método de Pago para Pauta
- [ ] Entrar a [Billing Hub](https://business.facebook.com/billing_hub/payment_methods) y agregar tarjeta de crédito/débito a `PukaDigital Ads` (`1097475412619983`).

#### 3. Google Cloud Console (OAuth & Verified Organization)
- [ ] Entrar a Google Cloud Console → OAuth consent screen.
- [ ] Cambiar "Organization Name" a "Puka Digital LLC" y pasar verificación de organización con el EIN `320856610`.
- [ ] Subir logo oficial de PukaIA.

#### 4. Stripe Webhooks en chatbot-python (repo separado)
- [ ] En `chatbot-python`, configurar endpoint FastAPI para escuchar pagos de Stripe:
  - Guardar `tenant_id` como metadata en Stripe Customer.
  - Al confirmar pago → habilitar acceso a Google Calendar para ese tenant en Firestore.
  - Configurar Stripe Tax (Ecuador sin tax USA).
