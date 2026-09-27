# Contradicciones con la política de privacidad del 2026-09-26
Se listan, no se corrigen en este PR.

## app/legal/cookies/page.tsx

| Archivo:línea | Qué dice (cita textual corta) | Qué dice la política nueva |
|---|---|---|
| `app/legal/cookies/page.tsx:47-48` | `"Cookies de Análisis: Utilizamos Google Analytics para entender cómo interactúan los usuarios con nuestra web..."` | Omite a **Microsoft Clarity**, el cual se utiliza para analítica de comportamiento y experiencia de usuario (grabaciones de sesiones y mapas de calor) y carga automáticamente bajo interés legítimo (sección 3, línea 279; sección 9, líneas 111-115; sección 16, línea 575). |
| `app/legal/cookies/page.tsx:50-51` | `"Cookies de Conversión: Nos ayudan a medir el éxito de nuestras campañas publicitarias en Google Ads y Meta Business."` | Omite el **Píxel de TikTok**, el cual se utiliza activamente para medición y optimización de conversión publicitaria (sección 3, línea 279; sección 9, líneas 123-127; sección 16, línea 574). |
| `app/legal/cookies/page.tsx:66` | `"Última actualización: 28 de diciembre de 2025."` | La política nueva fija como fecha de vigencia y última actualización el `26 de septiembre de 2026` (línea 165, 187, 606). |

## app/legal/terminos/page.tsx

| Archivo:línea | Qué dice (cita textual corta) | Qué dice la política nueva |
|---|---|---|
| `app/legal/terminos/page.tsx:73` | `"Nuestros chatbots y agentes utilizan modelos de Inteligencia Artificial de terceros (Google Gemini, OpenAI)."` | **OpenAI es falso / no utilizado**. El único proveedor de IA conversacional y LLM es **Google Cloud Vertex AI / Gemini** (sección 8, líneas 407-412; sección 9, líneas 81-85). OpenAI no es subprocesador, no tiene DPA ni aparece en transferencias internacionales (sección 10). |
| `app/legal/terminos/page.tsx:88` | `"Última actualización: 30 de agosto de 2026."` | La política nueva fija como fecha de vigencia y última actualización el `26 de septiembre de 2026` (línea 165, 187, 606). |

## app/legal/google-calendar-privacidad/page.tsx

| Archivo:línea | Qué dice (cita textual corta) | Qué dice la política nueva |
|---|---|---|
| `app/legal/google-calendar-privacidad/page.tsx:136` | `"Última actualización: 30 de agosto de 2026."` | La política nueva fija como fecha de vigencia y última actualización el `26 de septiembre de 2026` (línea 165, 187, 606). El resto del contenido técnico y de seguridad (OAuth 2.0, cifrado AES-256 de tokens en Firestore, revocación y no acceso a correos/Drive) es plenamente coherente con la sección 8 y 12. |

## public/llms.txt

Sin contradicciones.

En lo relativo a privacidad, datos, seguridad e infraestructura, el archivo menciona la Meta Cloud API oficial, Gemini 2.5 Flash de Google, el CRM de leads con historial y la operación en la nube (líneas 25, 27, 30, 31, 59). Todo ello es consistente con la política nueva y no incluye afirmaciones sobre almacenamiento de contraseñas, ubicación física de servidores, transferencias internacionales ni subprocesadores que contradigan la política de privacidad.
