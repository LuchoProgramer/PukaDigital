# Google Calendar Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear dos páginas legales en pukadigital.com para pasar la revisión de Google OAuth — `/legal/google-calendar-privacidad` y `/legal/google-calendar-terminos`.

**Architecture:** Dos nuevos `page.tsx` en `app/legal/` siguiendo el patrón exacto de las páginas legales existentes (`'use client'`, Tailwind, Lucide icons, dark mode). Sin lógica, sin tests de lógica — son componentes de contenido estático. Actualizar `app/sitemap.ts` con las dos rutas nuevas.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide React

---

## File Map

| Acción | Archivo |
|---|---|
| Crear | `app/legal/google-calendar-privacidad/page.tsx` |
| Crear | `app/legal/google-calendar-terminos/page.tsx` |
| Modificar | `app/sitemap.ts` (líneas 44-49, array `legalPages`) |

---

## Task 1: Página de Privacidad Google Calendar

**Files:**
- Create: `app/legal/google-calendar-privacidad/page.tsx`

- [ ] **Step 1: Crear el archivo**

Crear `app/legal/google-calendar-privacidad/page.tsx` con el siguiente contenido:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Lock, Shield, Eye, Globe, AlertCircle } from 'lucide-react';

const GoogleCalendarPrivacidadPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-puka-red hover:underline mb-8 font-bold uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-puka-red/10 rounded-sm">
                            <Calendar className="text-puka-red" size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-puka-red mb-1">
                                Integraci&oacute;n Google Calendar
                            </p>
                            <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                                Pol&iacute;tica de Privacidad
                            </h1>
                        </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">

                        <section className="bg-puka-red/10 p-6 rounded-sm border-l-4 border-puka-red">
                            <h2 className="text-xl font-bold text-puka-black dark:text-white mt-0">
                                Resumen
                            </h2>
                            <p className="mt-2">
                                PukaDigital accede a Google Calendar &uacute;nicamente para consultar disponibilidad y crear citas en nombre del negocio que autoriz&oacute; el acceso. <strong>No leemos correos, no accedemos a eventos anteriores con detalle personal, no vendemos datos.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Eye size={20} className="text-puka-red" /> 1. &iquest;Qu&eacute; datos accedemos?
                            </h2>
                            <p className="mt-4">
                                Al autorizar la integraci&oacute;n con Google Calendar, nuestro sistema accede exclusivamente a:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li><strong>Disponibilidad de horarios:</strong> rangos de tiempo libres u ocupados para determinar cu&aacute;ndo se puede agendar una cita.</li>
                                <li><strong>Creaci&oacute;n de eventos:</strong> insertamos un evento con el nombre del servicio, la fecha y hora acordada, y opcionalmente un enlace de Google Meet si el negocio lo requiere.</li>
                            </ul>
                            <p className="mt-4 font-semibold">
                                Expl&iacute;citamente NO accedemos a:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Correos electr&oacute;nicos (Gmail).</li>
                                <li>Contenido detallado de eventos existentes (t&iacute;tulos, descripci&oacute;n, asistentes de citas previas).</li>
                                <li>Contactos de Google.</li>
                                <li>Archivos de Google Drive.</li>
                                <li>Informaci&oacute;n de pago o financiera.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Lock size={20} className="text-puka-red" /> 2. Seguridad y almacenamiento de tokens
                            </h2>
                            <p className="mt-4">
                                Cuando el propietario del negocio autoriza el acceso, Google nos entrega un <em>refresh token</em> OAuth 2.0. Este token:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Se cifra con <strong>AES-256</strong> inmediatamente antes de ser almacenado.</li>
                                <li>Se guarda en <strong>Firestore</strong> (Google Cloud), asociado &uacute;nicamente al identificador del negocio (tenant).</li>
                                <li><strong>Nunca se almacena en texto plano</strong>, nunca aparece en logs ni en c&oacute;digo fuente.</li>
                                <li>Solo el sistema interno de PukaDigital puede descifrarlo para ejecutar llamadas a la API de Google Calendar en nombre del negocio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Shield size={20} className="text-puka-red" /> 3. Uso de Inteligencia Artificial
                            </h2>
                            <p className="mt-4">
                                El agente conversacional de PukaDigital (impulsado por Google Gemini) interpreta los mensajes de WhatsApp del cliente final para identificar su intenci&oacute;n de agendar una cita y extraer fecha, hora y servicio solicitado.
                            </p>
                            <p className="mt-4">
                                La IA <strong>no toma decisiones financieras, legales o m&eacute;dicas</strong> en nombre del usuario. Su &uacute;nica funci&oacute;n en este contexto es procesar la solicitud de agendamiento y coordinar la disponibilidad con Google Calendar. La confirmaci&oacute;n final de la cita puede requerir aprobaci&oacute;n del due&ntilde;o del negocio seg&uacute;n su configuraci&oacute;n.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <AlertCircle size={20} className="text-puka-red" /> 4. Revocaci&oacute;n del acceso
                            </h2>
                            <p className="mt-4">
                                El propietario del negocio puede revocar el acceso de PukaDigital a su Google Calendar en cualquier momento:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Desde <strong>myaccount.google.com/permissions</strong>, eliminando el permiso de la aplicaci&oacute;n PukaDigital.</li>
                                <li>Contactando directamente a nuestro equipo en <strong>legal@pukadigital.com</strong> para solicitar la eliminaci&oacute;n inmediata del token almacenado.</li>
                            </ul>
                            <p className="mt-4">
                                Tras la revocaci&oacute;n, el sistema dejar&aacute; de poder crear eventos nuevos. Los eventos ya creados en Google Calendar no son modificados ni eliminados por PukaDigital.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Globe size={20} className="text-puka-red" /> 5. Jurisdicci&oacute;n y cumplimiento legal
                            </h2>
                            <p className="mt-4">
                                PukaDigital opera desde Ecuador y cumple con la <strong>Ley Org&aacute;nica de Protecci&oacute;n de Datos Personales (LOPDP)</strong> vigente en el pa&iacute;s. Para clientes y usuarios ubicados en la Uni&oacute;n Europea o Reino Unido, el tratamiento de datos se realiza conforme a los principios del <strong>Reglamento General de Protecci&oacute;n de Datos (GDPR)</strong>, incluyendo minimizaci&oacute;n de datos, limitaci&oacute;n de finalidad y derecho a supresi&oacute;n.
                            </p>
                            <p className="mt-4">
                                Los datos personales tratados a trav&eacute;s de esta integraci&oacute;n no son transferidos a terceros con fines comerciales.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                6. Contacto
                            </h2>
                            <p className="mt-4">
                                Para consultas sobre esta pol&iacute;tica o para ejercer sus derechos de acceso, rectificaci&oacute;n o supresi&oacute;n de datos:
                            </p>
                            <p className="mt-2">
                                <strong>Email:</strong> legal@pukadigital.com<br />
                                <strong>WhatsApp:</strong> +593 96 406 5880
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 05 de abril de 2026. Esta pol&iacute;tica aplica espec&iacute;ficamente al uso de Google Calendar API mediante OAuth 2.0 en los servicios de agendamiento de PukaDigital.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarPrivacidadPage;
```

- [ ] **Step 2: Verificar que Next.js resuelve la ruta**

```bash
cd /Users/luisviteri/PukaDigital
npm run build 2>&1 | grep -E "(google-calendar|error|Error)" | head -20
```

Esperado: la ruta `/legal/google-calendar-privacidad` aparece en el output del build sin errores.

- [ ] **Step 3: Commit**

```bash
git add app/legal/google-calendar-privacidad/page.tsx
git commit -m "feat(legal): add Google Calendar privacy policy page for OAuth review"
```

---

## Task 2: Página de Términos Google Calendar

**Files:**
- Create: `app/legal/google-calendar-terminos/page.tsx`

- [ ] **Step 1: Crear el archivo**

Crear `app/legal/google-calendar-terminos/page.tsx` con el siguiente contenido:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle, FileText, AlertCircle, Globe, XCircle } from 'lucide-react';

const GoogleCalendarTerminosPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-puka-red hover:underline mb-8 font-bold uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-puka-red/10 rounded-sm">
                            <Calendar className="text-puka-red" size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-puka-red mb-1">
                                Integraci&oacute;n Google Calendar
                            </p>
                            <h1 className="font-display text-3xl md:text-4xl font-black text-puka-black dark:text-white uppercase tracking-tighter">
                                T&eacute;rminos de Servicio
                            </h1>
                        </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-8">

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <FileText size={20} className="text-puka-red" /> 1. Prop&oacute;sito del acceso
                            </h2>
                            <p className="mt-4">
                                La integraci&oacute;n con Google Calendar de PukaDigital tiene como &uacute;nico prop&oacute;sito permitir que el agente conversacional agende, consulte disponibilidad y gestione citas <strong>en nombre del negocio (tenant) que autoriz&oacute; el acceso OAuth</strong>.
                            </p>
                            <p className="mt-4">
                                El agente act&uacute;a como un asistente del negocio &mdash; no como representante del cliente final (usuario de WhatsApp). Cualquier compromiso contractual derivado de una cita es responsabilidad exclusiva del negocio y su cliente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 2. Uso permitido
                            </h2>
                            <p className="mt-4">El acceso a Google Calendar se utiliza exclusivamente para:</p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Consultar la disponibilidad de horarios del negocio.</li>
                                <li>Crear eventos de cita con el nombre del servicio, fecha, hora y enlace de videollamada (opcional).</li>
                                <li>Evitar la creaci&oacute;n de citas duplicadas mediante verificaci&oacute;n interna.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <XCircle size={20} className="text-puka-red" /> 3. Uso prohibido
                            </h2>
                            <p className="mt-4">Queda expresamente prohibido:</p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>Acceder a calendarios de terceros no autorizados.</li>
                                <li>Exportar, compartir o comercializar datos del calendario.</li>
                                <li>Utilizar el acceso fuera del servicio de agendamiento contratado con PukaDigital.</li>
                                <li>Modificar o eliminar eventos existentes creados por el propietario del negocio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <AlertCircle size={20} className="text-puka-red" /> 4. Responsabilidad limitada de IA
                            </h2>
                            <p className="mt-4">
                                El agente de inteligencia artificial facilita el proceso de agendamiento interpretando los mensajes del cliente final. Sin embargo:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>El <strong>negocio es responsable</strong> de confirmar, reprogramar o cancelar citas seg&uacute;n sus pol&iacute;ticas internas.</li>
                                <li>PukaDigital no garantiza la exactitud de la informaci&oacute;n interpretada por la IA en casos de mensajes ambiguos o incompletos.</li>
                                <li>Si el negocio tiene activada la opci&oacute;n de <em>aprobaci&oacute;n manual</em>, ning&uacute;n evento se crea sin confirmaci&oacute;n expl&iacute;cita del propietario.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Calendar size={20} className="text-puka-red" /> 5. Revocaci&oacute;n y datos existentes
                            </h2>
                            <p className="mt-4">
                                El propietario del negocio puede revocar el acceso de PukaDigital a Google Calendar en cualquier momento desde <strong>myaccount.google.com/permissions</strong> o contactando a <strong>legal@pukadigital.com</strong>.
                            </p>
                            <p className="mt-4">
                                Tras la revocaci&oacute;n:
                            </p>
                            <ul className="mt-2 space-y-2 list-disc pl-5">
                                <li>El sistema dejar&aacute; de poder crear nuevos eventos de forma inmediata.</li>
                                <li>Los eventos ya creados en Google Calendar <strong>no son eliminados autom&aacute;ticamente</strong> por PukaDigital &mdash; permanecen en el calendario del negocio.</li>
                                <li>El historial de citas almacenado en Firestore puede ser solicitado para exportaci&oacute;n o eliminaci&oacute;n mediante solicitud a legal@pukadigital.com.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <CheckCircle size={20} className="text-puka-red" /> 6. Vigencia del servicio
                            </h2>
                            <p className="mt-4">
                                El acceso a Google Calendar se mantiene activo mientras el negocio tenga una suscripci&oacute;n vigente al servicio de agendamiento de PukaDigital. La cancelaci&oacute;n de la suscripci&oacute;n implica la suspensi&oacute;n del agendamiento autom&aacute;tico, pero no elimina los registros hist&oacute;ricos de citas (los cuales pueden ser exportados a solicitud del cliente).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-puka-black dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <Globe size={20} className="text-puka-red" /> 7. Jurisdicci&oacute;n y facturaci&oacute;n
                            </h2>
                            <p className="mt-4">
                                Estos t&eacute;rminos est&aacute;n sujetos a las leyes de la Rep&uacute;blica del Ecuador. PukaDigital emite facturas electr&oacute;nicas v&aacute;lidas para el <strong>Servicio de Rentas Internas (SRI)</strong> por todos los servicios contratados. Los precios no incluyen IVA a menos que se especifique lo contrario.
                            </p>
                            <p className="mt-4">
                                Para clientes internacionales, los t&eacute;rminos se interpretar&aacute;n conforme a los principios del <strong>GDPR</strong> en lo que respecta al tratamiento de datos personales.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-puka-red/5 rounded-sm border border-puka-red/10">
                            <p className="text-sm italic text-gray-500">
                                &Uacute;ltima actualizaci&oacute;n: 05 de abril de 2026. Para dudas legales espec&iacute;ficas sobre esta integraci&oacute;n, cont&aacute;ctanos en legal@pukadigital.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarTerminosPage;
```

- [ ] **Step 2: Verificar que Next.js resuelve la ruta**

```bash
cd /Users/luisviteri/PukaDigital
npm run build 2>&1 | grep -E "(google-calendar|error|Error)" | head -20
```

Esperado: ambas rutas `/legal/google-calendar-privacidad` y `/legal/google-calendar-terminos` aparecen en el output del build sin errores.

- [ ] **Step 3: Commit**

```bash
git add app/legal/google-calendar-terminos/page.tsx
git commit -m "feat(legal): add Google Calendar terms of service page for OAuth review"
```

---

## Task 3: Actualizar sitemap

**Files:**
- Modify: `app/sitemap.ts` (array `legalPages`, líneas 44-49)

- [ ] **Step 1: Agregar las dos rutas al array `legalPages`**

En `app/sitemap.ts`, el array `legalPages` actualmente termina en:

```typescript
  const legalPages = [
    { path: '/legal/terminos', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/politica-de-privacidad', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/cookies', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/garantia', priority: 0.5, changeFreq: 'monthly' as const },
  ];
```

Reemplazar con:

```typescript
  const legalPages = [
    { path: '/legal/terminos', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/politica-de-privacidad', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/cookies', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/garantia', priority: 0.5, changeFreq: 'monthly' as const },
    { path: '/legal/google-calendar-privacidad', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/google-calendar-terminos', priority: 0.3, changeFreq: 'yearly' as const },
  ];
```

- [ ] **Step 2: Verificar build limpio**

```bash
cd /Users/luisviteri/PukaDigital
npm run build 2>&1 | tail -10
```

Esperado: `✓ Compiled successfully` sin errores TypeScript.

- [ ] **Step 3: Commit final**

```bash
git add app/sitemap.ts
git commit -m "feat(sitemap): add Google Calendar legal pages to sitemap"
```
