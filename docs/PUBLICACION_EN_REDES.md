# Publicación en redes — cómo funciona

Cómo una pieza escrita en `content/piezas/` acaba publicada en Instagram y en
Facebook. Referenciado desde `AGENTS.md`, que se queda con lo de uso diario.

Para el trabajo manual de la community manager, ver `COMMUNITY_MANAGEMENT.md`.
Para el estado de hoy y lo que falta, `ESTADO_2026-09-09.md`.

---

## Los dos canales, y por qué son distintos

| | Instagram | Facebook |
|---|---|---|
| Qué sale | el carrusel completo | **una sola foto** |
| Archivos | un `-N-4x5.png` por slide | un `-fb.png` |
| Texto | `caption`, con hashtags | `facebook.caption`, **sin hashtags** |
| Cuándo | `publicarEl` | la **franja siguiente** |

**La franja siguiente:** 09:00 → 18:00 del mismo día; 18:00 → 09:00 del día
siguiente. Se puede fijar a mano con `facebook.publicarEl`.

⚠️ **Facebook no renderiza carruseles.** Un post con las cinco slides sale como
mosaico y destroza una narrativa pensada para deslizar. Por eso va una sola
imagen y el argumento entero vive en el caption.

---

## La imagen de Facebook no es la slide 1

Esta es la regla que más caro salió aprender, y se aprendió publicando.

La **slide 1 de un carrusel es un gancho incompleto a propósito**: existe para
que deslices. Sola en un feed no dice nada. El primer post real de la Página, el
2026-09-09, salió con la slide 1 de un carrusel y con el contador **«01 / 05»**
impreso, prometiendo cuatro imágenes que no existen.

Cada pieza declara su propia imagen:

```typescript
facebook: {
  publicarEl: '2026-09-11T09:00',
  caption: '…el texto largo…',
  imagen: {
    titular: 'Un bot contesta.\nUn CRM recuerda\nquién eres',
    dato: { valor: '$14.99', etiqueta: 'al mes' },   // opcional
    captura: 'agenda-dia.png',                        // opcional
  },
},
```

**El titular dice la conclusión, no el gancho.** «Un bot contesta. Un CRM recuerda
quién eres» se entiende sin leer nada más; «No es un chatbot», que es la slide 1,
no.

**Sin `bajada`, `badge` ni `cta`.** Cada franja de texto más compite por la
atención en una imagen que se ve de paso. Lo que no cabe va al caption.

**Sin `facebook.imagen` la pieza no se publica en Facebook**, y `piezas --check`
la rechaza. No hay degradado silencioso a la slide 1: eso es lo que se arregló.

### Cómo escribir el titular

- Máximo **9 palabras y 60 caracteres**, los mismos topes que una slide.
- **Los saltos de línea van a mano, y en líneas cortas.** El titular se encoge
  hasta que su línea más larga quepa, así que una línea de 35 caracteres lo deja
  pequeño y perdido. Tres líneas cortas salen grandes.
- Los precios se validan contra `catalogo.ts` y las afirmaciones contra
  `prohibidas.ts`, igual que un caption. Un precio falso impreso en un PNG es peor
  que en un texto: sobrevive a la captura de pantalla.

---

## Las capturas del producto

Van en `assets/capturas/`, y la plantilla les estampa **sola** el aviso de datos
ficticios, en cada imagen y sin bandera para quitarlo. Ya costó un video retirado
en YouTube con la apelación rechazada.

🔴 **Una captura es un recorte de la región de interés, no la pantalla entera.**
Medido: una captura de 1920 px escalada al ancho útil de la pieza queda al 47%, y
un texto de 14 px dentro se convierte en **6,6 px — ilegible**. Máximo ~1200 px
de ancho de origen.

Y revisar qué más entra en el encuadre: en un video de este proyecto se colaron
el dock de macOS y una ruta con nombres de archivo reales.

---

## Cómo se publica

```bash
npm run piezas -- --check   # valida sin escribir. Es lo que corre en CI
npm run piezas              # genera los PNG en public/piezas/<mes>/
```

⚠️ **Los PNG están versionados**, no se generan en el despliegue. Hay que
commitearlos, y **desplegar** para que el Worker los sirva: si no, la publicación
pide al CDN un archivo que en producción no existe.

El cron corre en Cloudflare (`0 14` y `0 23` UTC = 09:00 y 18:00 de Ecuador) y
tiene una **ventana de 60 minutos**: una pieza fuera de ventana no se publica y
no da error, simplemente no sale.

Disparo manual, dentro de esa ventana:

```bash
curl -s -H "Authorization: Bearer $(grep '^CRON_SECRET=' .env.local | cut -d= -f2-)" \
  https://pukadigital.com/api/cron/publicar
```

Ensayo de una pieza suelta, sin publicar:

```bash
npm run publicar -- --id crm-no-chatbot --facebook
```

### Cómo se evita publicar dos veces

No hay base de datos donde apuntar lo enviado: **se le pregunta a la red**. Antes
de publicar se leen las 25 publicaciones recientes del perfil y se compara el
texto. Si ya está, no se repite.

⚠️ Por eso, **si borras un post publicado, volverá a salir** cuando su franja
entre en ventana. Y al revés: si adelantas una pieza a mano y luego borras el
post, hay que **devolver su fecha** o no volverá a salir nunca.

---

## Dónde vive cada cosa

| Archivo | Qué hace |
|---|---|
| `content/piezas/<mes>.ts` | las piezas del mes, como datos |
| `content/piezas/index.ts` | el registro de meses. ⚠️ **estático a mano** |
| `lib/piezas/plantilla.tsx` | la slide del carrusel, con su contador |
| `lib/piezas/plantillaFacebook.tsx` | la imagen suelta de Facebook, sin contador |
| `lib/piezas/validar.ts` | lo que hace publicable una pieza |
| `lib/piezas/catalogo.ts` · `prohibidas.ts` | los hechos comerciales |
| `lib/publicar/tanda.ts` | el orquestador de los dos canales |
| `lib/publicar/meta.ts` · `facebook.ts` | los clientes de cada red |
| `lib/publicar/programado.ts` | qué toca publicar y cuándo |

---

## Tres trampas que ya costaron caro

**No cargar los meses con `await import()` de plantilla.** El bundle de un Worker
es estático: compila, despliega y luego responde «no hay piezas» todos los meses
**sin dar error**. Por eso `index.ts` es un registro a mano.

**`\n` no corta línea en Satori sin `whiteSpace: 'pre-line'`.** JSX lo normaliza
como espacio. Medido: 48 px contra 96 px.

**Un test que busca texto en un SVG de Satori pasa siempre.** Satori vectoriza a
`<path>`, así que la cadena buscada no aparece nunca. Para contar elementos de
texto, contar `<path>`: hay uno por bloque.
