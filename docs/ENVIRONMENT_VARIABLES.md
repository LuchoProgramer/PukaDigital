# 🔧 Variables de Entorno - PukaDigital

## Resumen

Este documento lista todas las variables de entorno necesarias para el funcionamiento completo de PukaDigital.

---

## Variables Requeridas

### Google Analytics 4

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ID de medición de GA4 | `G-VSGYR0EJSZ` |
| `GA_API_SECRET` | Secret para Measurement Protocol | `ZzwOlwY4RaaqCyDU_5Ys3w` |

> ⚠️ `GA_API_SECRET` es sensible y NO debe tener prefijo `NEXT_PUBLIC_`

### Email (Resend)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `RESEND_API_KEY` | API Key de Resend | `re_xxxxxxxxxx` |

### IA (Gemini)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GEMINI_API_KEY` | API Key de Google Gemini | `AIza...` |

---

## Archivo `.env.local` (Desarrollo)

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Analytics 4
GA_API_SECRET=ZzwOlwY4RaaqCyDU_5Ys3w
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-VSGYR0EJSZ

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key
```

---

## Configuración en Vercel

### Pasos:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable

### Variables a configurar:

| Name | Environment | Value |
|------|-------------|-------|
| `GEMINI_API_KEY` | Production, Preview | (tu API key) |
| `GA_API_SECRET` | Production, Preview | `ZzwOlwY4RaaqCyDU_5Ys3w` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production, Preview | `G-VSGYR0EJSZ` |
| `RESEND_API_KEY` | Production, Preview | (tu API key de Resend) |

---

## Obtener las API Keys

### Google Analytics (GA_API_SECRET)
1. Ve a [Google Analytics](https://analytics.google.com)
2. Admin → Data Streams → Tu stream
3. Measurement Protocol → Create secret

### Resend (RESEND_API_KEY)
1. Ve a [Resend](https://resend.com)
2. API Keys → Create API Key
3. Copia el token (solo se muestra una vez)

### Gemini (GEMINI_API_KEY)
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Get API Key → Create API Key

---

## Seguridad

### ❌ NO hacer:
- Commitear `.env.local` a Git
- Usar `NEXT_PUBLIC_` para secrets sensibles
- Compartir API keys en código

### ✅ SÍ hacer:
- Usar `.env.local` solo para desarrollo
- Configurar variables en Vercel para producción
- Rotar API keys periódicamente
- Usar diferentes keys para dev/prod si es posible

---

## Verificación

### Verificar que las variables están cargadas:

```typescript
// En un API route o Server Component
console.log('GA Secret exists:', !!process.env.GA_API_SECRET);
console.log('Resend Key exists:', !!process.env.RESEND_API_KEY);
```

### Verificar en el cliente:

```javascript
// En la consola del navegador
console.log('GA ID:', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
// Debería mostrar: G-VSGYR0EJSZ
```
