# Design: Páginas Legales Google Calendar OAuth

**Fecha:** 2026-04-05  
**Proyecto:** PukaDigital (pukadigital.com)  
**Propósito:** Pasar la revisión de Google OAuth — dos URLs públicas requeridas por Google para verificar el acceso a Google Calendar API.

---

## Contexto

El backend `chatbot-python` ya tiene OAuth implementado (`app/oauth/router.py`) y el servicio de calendario (`app/services/calendar_service.py`). Google requiere URLs públicas de Privacy Policy y Terms of Service para aprobar la aplicación OAuth en producción.

## Rutas nuevas

| Ruta | URL pública | Uso |
|---|---|---|
| `app/legal/google-calendar-privacidad/page.tsx` | `pukadigital.com/legal/google-calendar-privacidad` | Privacy Policy URL en Google Cloud Console |
| `app/legal/google-calendar-terminos/page.tsx` | `pukadigital.com/legal/google-calendar-terminos` | Terms of Service URL en Google Cloud Console |

## Archivos afectados

- **Nuevos:** los dos `page.tsx` arriba indicados
- **Sin tocar:** resto del proyecto PukaDigital, proyecto `agentes-ia`, backend `chatbot-python`

## Contenido — google-calendar-privacidad

1. Qué datos accedemos (solo slots libres/ocupados + creación de eventos)
2. Qué NO hacemos (no leemos correos, no leemos eventos detallados, no vendemos datos)
3. Almacenamiento de tokens OAuth (refresh_token cifrado AES-256 en Firestore, nunca en texto plano)
4. Uso de IA (Gemini procesa solicitud de agendamiento, no toma decisiones financieras/legales)
5. Revocación (el tenant revoca en myaccount.google.com/permissions en cualquier momento)
6. Jurisdicción: LOPDP Ecuador + referencia GDPR para escala internacional
7. Contacto: legal@pukadigital.com

## Contenido — google-calendar-terminos

1. Propósito del acceso (bot agenda en nombre del negocio que autorizó, no del usuario final de WhatsApp)
2. Uso permitido / prohibido (solo agendamiento; prohibido acceder a calendarios de terceros o exportar datos)
3. Responsabilidad limitada de IA (el negocio es responsable de confirmar/cancelar citas)
4. Revocación (tenant puede revocar; eventos ya creados no se eliminan automáticamente)
5. Vigencia (acceso activo mientras haya suscripción activa en PukaDigital)
6. Facturación SRI Ecuador

## Decisiones de diseño

- **Enfoque:** páginas independientes y autosuficientes (no referencian otras páginas legales)
- **Razón:** Google revisa cada URL de forma aislada; páginas que dependen de navegación adicional pueden ser rechazadas
- **Estilo:** mismo patrón visual que páginas legales existentes (`'use client'`, Tailwind, iconos Lucide, dark mode)
- **Sin i18n** por ahora: contenido en español, suficiente para revisión inicial de Google
