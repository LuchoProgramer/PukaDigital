# Transición a Puka Digital LLC (Stripe Atlas)

> Extraído de `CLAUDE.md` el 2026-08-29. Tarea pendiente, sin fecha: se activa cuando llegue el EIN.

## ⚠️ TAREA URGENTE PENDIENTE — Transición a Puka Digital LLC (Stripe Atlas)

**Trigger:** Cuando Luis active Stripe Atlas y reciba la LLC de Wyoming + EIN.

### Qué hace Atlas y qué cambia en el proyecto

- **EIN (Tax ID USA):** Equivale al RUC pero en USA. Se usa para pasar de "Developer Individual" a "Verified Organization" en Google Cloud Console → Verification Center.
- **Cuenta bancaria (Mercury/Novo):** Donde Stripe depositará cobros de clientes de PukaIA.
- **Documentación legal:** Atlas entrega Bylaws + Operating Agreement con cláusulas de privacidad de datos de USA (California Privacy), que simplifican la actualización de `/legal`.

### Checklist de cambios en este repositorio cuando llegue el EIN

#### 1. Actualizar páginas legales con nueva razón social

Archivos a modificar:
- `app/legal/google-calendar-privacidad/page.tsx` — reemplazar "PukaDigital" por "Puka Digital LLC" donde corresponda, agregar EIN y dirección registrada en Wyoming
- `app/legal/google-calendar-terminos/page.tsx` — ídem
- `app/legal/politica-de-privacidad/page.tsx` — agregar sección de empresa en USA
- `app/legal/terminos/page.tsx` — actualizar razón social y jurisdicción (Ecuador + Wyoming, USA)

#### 2. Actualizar CLAUDE.md (este archivo)

- Cambiar el campo "Fundador" por "Empresa: Puka Digital LLC (Wyoming, USA)"
- Agregar EIN al contexto del proyecto

#### 3. Google Cloud Console (fuera del repo)

1. Entrar a Google Cloud Console → OAuth consent screen
2. Cambiar "Organization Name" de "Luis Viteri" → "Puka Digital LLC"
3. Subir logo oficial de PukaIA
4. Actualizar los links de Privacy Policy y Terms of Service si cambia el dominio

#### 4. Stripe Webhooks en chatbot-python (repo separado)

En `chatbot-python`, configurar endpoint FastAPI para escuchar pagos de Stripe:
- Guardar `tenant_id` como metadata en Stripe Customer
- Cuando Stripe confirme pago → habilitar acceso a Google Calendar para ese tenant en Firestore
- Configurar Stripe Tax: clientes Ecuador → sin tax USA

### Contexto de decisión

Stripe Atlas resuelve la burocracia de Wyoming en un solo flujo y se integra con el ecosistema Python/Next.js ya armado. El EIN es el prerequisito para la verificación de organización en Google Cloud y para cobros internacionales via Stripe.

**Estado actual:** Pendiente activación de Stripe Atlas por Luis.
