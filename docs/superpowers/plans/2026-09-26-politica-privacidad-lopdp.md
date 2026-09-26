# Política de privacidad conforme a la LOPDP — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> ⚠️ **NO ENSAYADO.** Plan de contratos: dice qué archivo, qué estructura, qué datos
> y qué comprobación debe pasar. No trae el JSX: es texto legal, y se redacta al
> implementar contra los hechos de este plan, no de memoria.

**Goal:** Reescribir `/legal/politica-de-privacidad` en dos partes —PukaDigital como
responsable y como encargado—, sin afirmaciones falsas y con lo que la LOPDP pide.

**Spec:** `docs/superpowers/specs/2026-09-26-politica-privacidad-lopdp-design.md`

**Architecture:** Una sola página `'use client'`, la misma de hoy. Las tablas salen de
arrays a nivel de módulo; el resto es JSX con el patrón visual actual (sección con
`<h2>` e icono Lucide). Sin archivos nuevos de código.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind · Lucide React

**Worktree:** `~/Proyectos/wt-privacidad`, rama `docs/politica-privacidad-lopdp`.

---

## Hechos que la página usa — verificados el 2026-09-26

Todo lo que la página afirme sale de aquí. Si hace falta un hecho que no está, se
verifica y se añade a esta tabla antes de escribirlo.

| Hecho | Fuente |
|---|---|
| Servidor de PukaHealth, LedgerXpertz y el bot: Hetzner, **Núremberg, Alemania** | Consola de Hetzner, servidor `puka-api-prod` |
| Conversaciones del bot: Firestore **`southamerica-east1`, São Paulo, Brasil** | `gcloud firestore databases list --project agentes-ia-6c41e` |
| Respaldo diario del servidor, se retienen 7 | `SistemaSalud/docs/claude/deployment.md` |
| Contraseñas con hash PBKDF2-SHA256 (default de Django), sesión por JWT | `SistemaSalud`: `simplejwt`; `PASSWORD_HASHERS` solo en settings de test |
| Tokens de Google Calendar cifrados con AES-256-GCM | `chatbot-python/app/utils/crypto.py` |
| El recordatorio envía por la plantilla de Meta: nombre del paciente, fecha, hora y nombre del médico, al teléfono del paciente | `chatbot-python/app/health/router.py:30` (`_template_params`) |
| Las respuestas del paciente al recordatorio no pasan por el LLM (`reminders_only: True`) | `chatbot-python/app/models/health.py:35` |
| El bot ofrece «Hablar con asesor» | `chatbot-python/app/middleware/consent.py` (`_BUTTONS`) |
| Píxeles que cargan sin consentimiento: GA4, Google Ads, Meta, TikTok | `app/layout.tsx:134-185` |
| El sitio lo sirve Cloudflare Workers desde el 2026-09-08 | `AGENTS.md` § Deploy |

## Archivos

- Modify: `app/legal/politica-de-privacidad/page.tsx` — la página entera.
- Create: `docs/superpowers/plans/2026-09-26-contradicciones-legales.md` — lo que las
  otras páginas legales contradicen (Task 6). Solo se lista, no se corrige.

---

### Task 1: Preparar el worktree y medir la línea base

- [ ] **Step 1:** `cd ~/Proyectos/wt-privacidad && npm ci` (el worktree no trae `node_modules`).
- [ ] **Step 2:** Línea base del archivo:
  ```bash
  npx eslint app/legal/politica-de-privacidad/page.tsx
  npx tsc --noEmit
  ```
  Anotar la salida. Lo que ya falle antes no es de este cambio; lo que falle después sí.
- [ ] **Step 3:** Guardar las secciones que no se reescriben, para compararlas al final:
  ```bash
  sed -n '96,142p' app/legal/politica-de-privacidad/page.tsx > /tmp/pp-google-meta.antes
  ```

### Task 2: Arrays de datos a nivel de módulo

**Files:** Modify `app/legal/politica-de-privacidad/page.tsx`

Contrato — fuera del componente, tipados, sin `any`:

```typescript
interface Tratamiento { quien: string; datos: string; finalidad: string; base: string; plazo: string }
interface Proveedor   { nombre: string; ubicacion: string; dato: string; proposito: string }
interface Derecho     { nombre: string; descripcion: string }

const TRATAMIENTOS: Tratamiento[]   // 4 filas: visitantes, prospectos, clientes, facturación
const PROVEEDORES: Proveedor[]      // Hetzner, Google Cloud (Firestore/Vertex/Speech), Meta, Cloudflare, GA4, Google Ads, píxel Meta, píxel TikTok
const DERECHOS: Derecho[]           // acceso, rectificación y actualización, eliminación, oposición, limitación, suspensión, portabilidad, no ser objeto de decisiones automatizadas
```

Filas de `TRATAMIENTOS`, tal como las aprobó el spec:

| quien | base | plazo |
|---|---|---|
| Visitantes del sitio | Interés legítimo, con derecho de oposición | 14 meses |
| Prospectos (formularios y WhatsApp de ventas) | Consentimiento y medidas precontractuales | 2 años desde el último contacto |
| Clientes que contratan | Ejecución del contrato | Mientras dure el contrato, más los plazos legales |
| Facturación | Obligación legal | 7 años |

`PROVEEDORES` **no** lleva Stripe.

- [ ] **Step 1:** Escribir los tres arrays.
- [ ] **Step 2:** `npx tsc --noEmit` — sin errores nuevos respecto a la línea base.
- [ ] **Step 3:** Commit: `feat(legal): datos de tratamientos, proveedores y derechos`

### Task 3: Encabezado, resumen, secciones 1-2 y Parte 1 (secciones 3-4)

**Files:** Modify `app/legal/politica-de-privacidad/page.tsx`

- Encabezado: un solo `<h1>`. La fecha de actualización es **una constante de módulo**
  `ULTIMA_ACTUALIZACION` que usan el encabezado y el pie; se fija el día del despliegue.
- Resumen: sin «Sin almacenamiento de contraseñas» ni «Google Cloud en Estados Unidos».
- **1. Quiénes somos** — el texto actual.
- **2. Responsable y encargado** — cuándo PukaDigital decide (Parte 1) y cuándo trata
  por cuenta de su cliente (Parte 2).
- **3.** Tabla renderizada desde `TRATAMIENTOS`. Debajo, un párrafo que dice que los
  píxeles de GA4, Google Ads, Meta y TikTok **cargan al entrar** y cómo oponerse.
  Mencionar que el WhatsApp de ventas lo contesta un bot con IA.
- **4. Lo opcional** — comunicaciones comerciales con consentimiento aparte; negarse
  no limita el servicio; revocable sin afectar lo tratado antes.

La tabla, a ancho de teléfono, va dentro de un contenedor con `overflow-x-auto`
(la página no debe tener scroll horizontal).

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** `npx eslint app/legal/politica-de-privacidad/page.tsx` sin problemas nuevos.
- [ ] **Step 3:** Commit: `feat(legal): politica en dos partes — PukaDigital como responsable`

### Task 4: Parte 2 — encargado (secciones 5-8)

**Files:** Modify `app/legal/politica-de-privacidad/page.tsx`

- **5. PukaHealth** — el médico es responsable; la historia clínica es dato sensible de
  salud. Recordatorios: lo que sale es exactamente lo de la tabla de hechos (nombre del
  paciente, fecha, hora, nombre del médico, al teléfono del paciente), pasa por el bot y
  por Meta, y **ningún dato clínico sale**. El paciente ejerce sus derechos ante su
  médico; PukaDigital lo asiste.
- **6. PukaIA** — la actual «3 bis», movida.
- **7. LedgerXpertz** — el negocio es responsable de los datos de sus compradores
  (cédula/RUC, nombre, dirección para la factura al SRI).
- **8. APIs de Google** — la actual «3», movida.

🔴 Las secciones 6 y 8 se **mueven, no se reescriben**: las leen los revisores de Google
(OAuth) y Meta (Tech Provider). Solo cambia el número del título.

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** Comparar el cuerpo de 6 y 8 con `/tmp/pp-google-meta.antes`: el texto
  entre `<h2>` y el cierre de cada `<section>` debe ser idéntico salvo el número.
- [ ] **Step 3:** Commit: `feat(legal): PukaDigital como encargado — PukaHealth, PukaIA y LedgerXpertz`

### Task 5: Secciones comunes (9-18)

**Files:** Modify `app/legal/politica-de-privacidad/page.tsx`

- **9.** Tabla desde `PROVEEDORES`.
- **10. Transferencias** — Alemania (Hetzner), Brasil (Firestore) y Estados Unidos
  (Google, Meta, Cloudflare); con las garantías contractuales de cada proveedor.
- **11. Conservación** — la lista actual, sin contradecir `TRATAMIENTOS`.
- **12. Seguridad** — solo lo de la tabla de hechos: PBKDF2-SHA256, JWT, AES-256-GCM,
  TLS, respaldo diario con 7 retenidos, acceso por tenant.
- **13. Decisiones automatizadas** — el bot responde solo; no hay decisiones con efectos
  jurídicos o similares; siempre se puede pedir una persona («Hablar con asesor»).
- **14. Derechos** — desde `DERECHOS`, más: qué pasa si no se entrega un dato
  obligatorio, y el plazo de respuesta actual (15 días hábiles, se mantiene; lo revisa
  el abogado).
- **15. Reclamo** ante la Superintendencia de Protección de Datos Personales.
- **16. Cookies** — la lista actual más el píxel de TikTok.
- **17. Cambios** y **18. Contacto** — el pie usa `ULTIMA_ACTUALIZACION`.

- [ ] **Step 1:** Implementar.
- [ ] **Step 2:** Comprobar el archivo fuente:
  ```bash
  F=app/legal/politica-de-privacidad/page.tsx
  grep -c 'Sin almacenamiento de contrase' $F   # 0
  grep -c 'Stripe' $F                          # 0
  grep -c '08 de abril\|30 de agosto' $F       # 0
  grep -c '<h1' $F                             # 1
  grep -c 'Superintendencia' $F                # ≥1
  grep -c 'TikTok' $F                          # ≥1
  ```
- [ ] **Step 3:** `npx tsc --noEmit` y `npx eslint app/legal/politica-de-privacidad/page.tsx` — sin problemas nuevos.
- [ ] **Step 4:** Commit: `feat(legal): proveedores, transferencias, derechos y reclamo`

### Task 6: Contradicciones en otras páginas

**Files:** Create `docs/superpowers/plans/2026-09-26-contradicciones-legales.md`

- [ ] **Step 1:** Leer `app/legal/cookies/page.tsx`, `app/legal/terminos/page.tsx`,
  `app/legal/google-calendar-privacidad/page.tsx` y `public/llms.txt`, y anotar cada
  frase que contradiga la nueva política (archivo:línea, qué dice, qué es verdad).
  **No se corrigen aquí.**
- [ ] **Step 2:** Commit: `docs(legal): contradicciones pendientes con la nueva politica`

### Task 7: Verificación en el navegador

- [ ] **Step 1:** `npm run dev` y abrir `http://localhost:3000/legal/politica-de-privacidad`.
- [ ] **Step 2:** A 1440 px y a 390 px: las 18 secciones se ven, las tablas se leen, sin
  scroll horizontal en la página (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 3:** Consola sin errores de hidratación.

### Task 8: PR y despliegue

- [ ] **Step 1:** Push y PR contra `main`. El cuerpo lleva la lista de la Task 6 y el
  aviso de que el texto no pasó por un abogado.
- [ ] **Step 2:** 🔴 **Esperar la señal de Luis** de que los recordatorios están activos.
  La política no sale antes.
- [ ] **Step 3:** En la rama, fijar `ULTIMA_ACTUALIZACION` al día y commitear
  (`fix(legal): fecha de actualizacion de la politica`). Merge del PR, y
  `npm run deploy:cloudflare` desde `main` actualizado. Nada se commitea directo a `main`.
- [ ] **Step 4:** Contra producción:
  ```bash
  curl -s https://pukadigital.com/legal/politica-de-privacidad > /tmp/pp.html
  grep -c 'Sin almacenamiento de contrase' /tmp/pp.html   # 0
  grep -c 'Stripe' /tmp/pp.html                          # 0
  grep -c '08 de abril de 2026' /tmp/pp.html             # 0
  grep -c 'N&uacute;remberg\|Núremberg' /tmp/pp.html     # ≥1
  grep -c 'Superintendencia' /tmp/pp.html                # ≥1
  grep -c 'TikTok' /tmp/pp.html                          # ≥1
  ```
