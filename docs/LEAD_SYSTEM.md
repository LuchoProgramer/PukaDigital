# 📧 Sistema de Leads - PukaDigital

## Configuración

### Servicio de Email
- **Proveedor:** Resend
- **Dominio verificado:** `leads.pukadigital.com`
- **Email de envío:** `leads@leads.pukadigital.com`
- **Email de destino:** `luis.viteri@pukadigital.com`

### Variables de Entorno

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 📬 API Endpoint

### `POST /api/send-lead`

Recibe los datos del formulario y envía un email formateado.

**Request Body:**
```json
{
  "businessName": "Restaurante El Buen Sabor",
  "userName": "Juan Pérez",
  "whatsapp": "593991234567",
  "growthBlocker": "no_web",
  "source": "/es/contacto"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Lead enviado correctamente"
}
```

**Response (error):**
```json
{
  "error": "Error al procesar el lead"
}
```

---

## 📝 Formato del Email

El email que recibes tiene este formato:

```
🔴 Nuevo Lead: [Nombre del Negocio] - [Nombre del Usuario]

📍 Negocio: [businessName]
👤 Nombre: [userName]
📱 WhatsApp: [whatsapp]
🎯 Principal Reto: [growthBlocker traducido]
📄 Origen: [source]

[💬 Responder por WhatsApp] ← Botón clickeable

Recibido: [fecha y hora Ecuador]
```

### Traducción de Growth Blockers

| Valor | Texto en Email |
|-------|----------------|
| `no_web` | No tengo página web |
| `no_clients` | No consigo clientes online |
| `no_time` | No tengo tiempo para redes |
| `other` | Otro problema |
| (vacío) | No seleccionado |

---

## 🎨 LeadForm - Características UX

### Features Implementadas

| Feature | Descripción |
|---------|-------------|
| **Floating Labels** | Labels que suben con animación al enfocar |
| **Validación en vivo** | Feedback inmediato mientras escriben |
| **Auto-formato WhatsApp** | `0999...` → `+593 99...` automáticamente |
| **Barra de progreso** | 4 pasos visuales que se llenan |
| **Auto-guardado** | LocalStorage - recupera datos al recargar |
| **Success animado** | Confetti sutil + mensaje de próximos pasos |
| **Fallback WhatsApp** | Si falla email, botón directo a WhatsApp |
| **Botón inteligente** | Deshabilitado hasta formulario válido |
| **Checkmark verde** | Confirma número de teléfono válido |

### Validaciones

```typescript
// Negocio: mínimo 2 caracteres
isValidBusiness(business) => business.trim().length >= 2

// Nombre: mínimo 2 caracteres  
isValidName(name) => name.trim().length >= 2

// WhatsApp: mínimo 10 dígitos
isValidPhone(phone) => phone.replace(/\D/g, '').length >= 10
```

### Auto-formato de WhatsApp (Ecuador)

```typescript
// Input: 0991234567
// Output: +593 99 123 4567

// Si empieza con 0, se reemplaza por 593
// Se formatea: +593 XX XXX XXXX
```

### LocalStorage Draft

```javascript
// Se guarda automáticamente al escribir
localStorage.setItem('leadFormDraft', JSON.stringify({
  businessName,
  userName,
  whatsapp
}));

// Se recupera al cargar el componente
// Se borra al enviar exitosamente
```

---

## 🔄 Flujo Completo

```
1. Usuario llega al formulario
   └── Se recupera draft de localStorage (si existe)
   └── Se trackea cupos_disponibles_visto

2. Usuario completa campos
   └── Floating labels suben con animación
   └── Validación en tiempo real
   └── WhatsApp se auto-formatea
   └── Barra de progreso avanza
   └── Draft se guarda en localStorage

3. Usuario hace click en "Solicitar"
   └── Validación final
   └── Estado: Loading
   └── Se envía tracking a GA (server-side)
   └── Se envía email via /api/send-lead

4a. Éxito
   └── Animación de confetti
   └── Mensaje: "Te contactaremos en menos de 2 horas"
   └── Se borra draft de localStorage
   └── Opción de enviar otra solicitud

4b. Error
   └── Mensaje de error
   └── Botón "Enviar por WhatsApp" con datos pre-llenados
   └── Draft permanece en localStorage
```

---

## 🛠️ Configuración DNS (Resend)

Registros DNS a agregar en Cloudflare para `leads.pukadigital.com`:

### DKIM
```
Type: TXT
Name: resend._domainkey.leads
Content: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClLpsyJ2NVcEKbBa6V5zva9buyJdQDdQ2gAODJNXy8t8YszGPoEFHQRP6Kz0KSzzKdbaabMJS7ev3UTBHZfb53vLhau3Fpec/kutopfnZtVQgVb7TfExhKzzDVJGo9uxDLxgvNkCYLDyo2/lCZXfHcBCEsGfaIj+IGvRk67lTvUwIDAQAB
```

### SPF
```
Type: MX
Name: send.leads
Content: feedback-smtp.sa-east-1.amazonses.com

Type: TXT
Name: send.leads
Content: v=spf1 include:amazonses.com ~all
```

### MX (Receiving)
```
Type: MX
Name: leads
Content: inbound-smtp.sa-east-1.amazonaws.com
Priority: 10
```

### DMARC (Opcional)
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none;
```

---

## 📋 Checklist

- [x] API endpoint `/api/send-lead`
- [x] Template HTML profesional
- [x] Botón "Responder por WhatsApp" en email
- [x] LeadForm con validación
- [x] Floating labels
- [x] Auto-formato WhatsApp
- [x] Barra de progreso
- [x] LocalStorage draft
- [x] Success state animado
- [x] WhatsApp fallback en error
- [x] Integración con GA tracking
- [ ] Verificar dominio en Resend
- [ ] Agregar RESEND_API_KEY en Vercel
- [ ] Testing end-to-end
