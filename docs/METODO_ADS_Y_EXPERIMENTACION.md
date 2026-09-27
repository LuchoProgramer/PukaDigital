# Método de Publicidad y Experimentación A/B — Framework Top 1%

Documento de doctrina y arquitectura para el análisis de pauta, pruebas A/B y
la futura **Skill de Antigravity (`meta-ads-analytics`)** una vez que se cuente con
datos de gasto real en Meta Ads. Escrito el **2026-09-21**.

Complementa a `docs/ECOSISTEMA_ADS.md` (cuentas, tokens e inventario).

---

## 1. Cuándo se activa este método

Este método y su skill asociada se activan únicamente cuando la cuenta entra en
**Fase 3 (Pauta)** con campañas activas y gasto real en la cuenta `1097475412619983`:

* **Mínimo estadístico para evaluar un anuncio:** 500 a 1.000 impresiones por variante.
* **Mínimo para declarar un ganador A/B:** Al menos 3x a 5x el costo por resultado objetivo o 3 a 5 días continuos sin tocar el presupuesto.
* **Regla de oro:** No juzgar un anuncio antes de que salga de la fase de aprendizaje o alcance el umbral de impresiones mínimas.

---

## 2. Los Permisos Requeridos (System User)

Para que los scripts y la Skill consulten la Marketing API sin bloqueos, el token en
`.env.local` (`META_ADS_TOKEN`) debe provenir del usuario del sistema `PukaDigital_Api`
con los siguientes permisos activos:

| Permiso | Uso en la Skill / Scripts |
|---|---|
| `ads_read` | Inspección de campañas, conjuntos de anuncios y anuncios. |
| `read_insights` | Extracción de métricas de rendimiento por anuncio (`/insights`). |
| `ads_management` | Creación de variantes A/B, escalado y apagado de perdedores. |
| `instagram_manage_insights` | Lectura de retención nativa de Reels (segundo a segundo). |
| `pages_read_engagement` | Lectura de comentarios y engagement en la Página de Facebook. |
| `business_management` | Acceso a datasets, píxeles y estudios de atribución. |

---

## 3. Arquitectura del Top 1%: Creative Sandbox & Post ID Stacking

El 99% de los anunciantes mezcla pruebas de creatividad en la misma campaña donde gasta
su presupuesto principal, o resetea el aprendizaje del algoritmo duplicando anuncios.
El Top 1% utiliza una estructura de **dos niveles aislados**:

```
                              ┌──────────────────────────────────────────────┐
                              │    CAMPAÑA 1: SANDBOX (20% del presupuesto) │
                              │    Objetivo: Descubrir ganchos ganadores     │
                              └──────────────────────┬───────────────────────┘
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │                                               │
                      [Hook A (Dolor)]                [Hook B (Miedo)]       [Hook C (Contraintuitivo)]
                      "Son las 7 PM..."               "ACESS te clausura..."  "Podólogo no receta..."
                             │                               │                       │
                             └───────────────────────┬───────────────────────┘
                                                     │ Ganador estadístico
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │   CAMPAÑA 2: ESCALADO (80% del presupuesto)  │
                              │   Importado vía Post ID existente            │
                              │   Conserva comentarios, likes y shares       │
                              └──────────────────────────────────────────────┘
```

### A. Pruebas A/B de Hooks (Primeros 3 segundos)
En formato Reel/Vertical, el 80% de la deserción ocurre antes del segundo 3:
1. Se mantiene el **mismo cuerpo de video** (mismas explicaciones, misma oferta).
2. Se generan **3 variantes de Hook** (los primeros 2 a 3 segundos del guion).
3. Se lanzan en un conjunto de anuncios de prueba durante 72 horas.

### B. Post ID Stacking
Para no fragmentar la prueba social, el anuncio de escalado **nunca sube un video nuevo**:
* Se vincula al Reel orgánico existente mediante `source_instagram_media_id` (o el `post_id` de Facebook).
* Todo el engagement pagado (reproducciones, likes, dudas y comentarios de médicos) se acumula en el post visible del perfil.

---

## 4. Las 4 Métricas de Decisión del Algoritmo

La Skill y los scripts evalúan los anuncios comparando contra estos 4 benchmarks:

### 1. Hook Rate (Stop Rate) — ¿Frenó el scroll?
$$\text{Hook Rate} = \frac{\text{Reproducciones de 3 segundos}}{\text{Impresiones Totales}}$$

* **> 30%:** Excelente. El gancho inicial conecta con el dolor del nicho.
* **20% – 30%:** Aceptable.
* **< 20%:** Falló el gancho. El anuncio se descarta aunque el resto del video sea bueno.

### 2. Hold Rate — ¿El argumento retiene o aburre?
$$\text{Hold Rate} = \frac{\text{ThruPlays (15s o video completo)}}{\text{Reproducciones de 3 segundos}}$$

* **> 20%:** Excelente retención de guion.
* **10% – 20%:** Normal para video educativo técnico.
* **< 10%:** El cuerpo del video es lento, redundante o el audio es confuso.

### 3. Outbound CTR — ¿Provoca acción comercial?
$$\text{Outbound CTR} = \frac{\text{Clics salientes directos a WhatsApp/Web}}{\text{Impresiones}}$$

* **> 1.5%:** Tráfico altamente intencionado.
* **< 0.8%:** El llamado a la acción (CTA) es débil o la oferta no es clara.

### 4. Costo por Conversación Iniciada (WhatsApp)
$$\text{CPA WhatsApp} = \frac{\text{Gasto Total}}{\text{Chats abiertos por prospectos cualificados}}$$

* **Benchmark en Ecuador / LATAM:** **$1.50 a $3.50 USD** por médico o dueño de pyme que inicia conversación.

---

## 5. Diseño de la Skill de Antigravity (`meta-ads-analytics`)

Cuando existan datos reales de facturación y gasto, la skill se instanciará en
`.gemini/antigravity-cli/custom/skills/meta-ads-analytics/SKILL.md`:

### Comportamiento esperado de la Skill:
1. **Entrada:**
   * El usuario pide: *"Audita los anuncios de esta semana y dime cuál gancho ganó"* o *"Revisa si el Reel de ACESS está fatigado"*.
2. **Acción:**
   * Ejecuta el script de lectura que llama a `GET /v21.0/act_1097475412619983/insights`.
   * Computa `Hook Rate`, `Hold Rate`, `Outbound CTR` y `CPA`.
3. **Salida / Diagnóstico Automatizado:**
   * **Diagnóstico de Gancho:** Si el Hook Rate cayó por debajo de 20%, alerta fatiga de audiencia.
   * **Diagnóstico de Oferta:** Si el Hook Rate es alto pero el Outbound CTR es bajo, sugiere revisar el CTA final o el enlace de WhatsApp.
   * **Recomendación de Escalado:** Si una variante supera el benchmark de Hook y Hold Rate con CPA bajo, propone el comando para moverla a la campaña de escalado.
