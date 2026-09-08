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

## Configuración en Cloudflare Workers

⚠️ **Desde el 2026-09-08 esto es lo que importa**: `pukadigital.com` lo sirve un
Worker, y las variables que usa en producción son **los secretos de Cloudflare**,
no las de Vercel. Cambiar una en Vercel ya no afecta al sitio.

```bash
npx wrangler secret put NOMBRE      # pide el valor por teclado
npx wrangler secret list            # lista los nombres, nunca los valores
```

Los seis que necesita el Worker: `API_KEY` (es la de **Gemini**, el nombre no lo
dice), `CRON_SECRET`, `GA_API_SECRET`, `IG_ACCESS_TOKEN`, `IG_USER_ID` y
`RESEND_API_KEY`.

🔴 **Tras subir un secreto hay que redesplegar** (`npm run deploy:cloudflare`), o
el Worker no lo ve. Falla de forma engañosa: `wrangler secret list` lo muestra y
`process.env` lo devuelve `undefined`, y además solo falla con los secretos
subidos **antes** del último despliegue. Ver `docs/ESTADO_2026-09-08.md`.

⚠️ `CRON_SECRET` está marcado como **Sensitive** en Vercel: se puede escribir pero
**no leer**, ni por CLI ni por panel. Si hace falta el valor, se genera uno nuevo:

```bash
S=$(openssl rand -hex 32); printf '%s' "$S" | npx wrangler secret put CRON_SECRET
```

Solo protege la ruta HTTP `/api/cron/publicar`; el handler `scheduled()` no lo usa,
así que no tiene que coincidir con el de Vercel.

---

## Configuración en Vercel

⚠️ **Ya no sirve el sitio**, pero sigue construyendo y es la red de seguridad hasta
que se apague (Task 14, no antes del 15/09). Mantener sus variables al día mientras
tanto.

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
