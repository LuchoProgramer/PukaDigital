# Publicar en Facebook — investigación previa

**Estado: sin decidir.** Investigado el 2026-09-02, pendiente de pasar por
`brainstorming` antes de tocar código. Hoy solo se publica en Instagram.

---

## El hallazgo que cambia la pregunta

**El formato no sobrevive el viaje.** Un post de varias fotos publicado por la
Graph API (`attached_media` sobre `{page-id}/feed`, con las fotos subidas antes
como `published=false`) se renderiza en Facebook como **collage de álbum**: todas
las imágenes visibles a la vez, en mosaico.

Las piezas de este proyecto son **narrativas de cinco slides**: la primera
engancha, la última cierra con el CTA. En mosaico la primera slide deja de
enganchar, porque el final ya se ve.

El carrusel deslizable de verdad existe en Facebook (`child_attachments`), pero
**cada tarjeta necesita su propia URL de destino**: es un formato de
tarjetas-enlace, más cercano a un anuncio que a una pieza editorial.

Conclusión: publicar en Facebook **no es «lo mismo pero con otro endpoint»**. Es
otro formato, y por tanto otra decisión de contenido.

---

## Los números de Ecuador

| Red | Usuarios en Ecuador | Perfil |
|---|---|---|
| **Facebook** | +14 millones | Llega a ciudades secundarias y zonas rurales |
| **Instagram** | 7,6 millones (jun 2026) | Urbano, 18-35; 53,7% mujeres |

En ambas el grupo más grande es **25-34 años**.

Esto importa para este negocio en concreto: los compradores son dueños de PYMEs
—podólogos, tiendas, consultorios— y muchos no están en el núcleo de Quito y
Guayaquil. **Facebook no es el canal de segunda aquí.** Merece contenido propio,
no las sobras del de Instagram.

---

## Lo que NO hay que hacer

**Alternar días** (Instagram un día, Facebook otro). Era la idea inicial y es la
que hay que descartar: con dos carruseles por semana, alternar deja **una sola
publicación semanal en cada plataforma**, por debajo del umbral donde cualquiera
de las dos coge inercia. Y no resuelve nada del formato: el día que toque
Facebook se publicaría un mosaico igual.

**Captions idénticos.** No hay penalización por publicar contenido propio y
original en ambas plataformas —eso es un mito—, pero Meta sí suprime alcance
cuando el texto es copia y pega entre redes. Lo que de verdad hunde el alcance es
otra cosa: marcas de agua de otras plataformas y reposts de contenido ajeno.
Nada de eso aplica aquí.

---

## La dirección propuesta, pendiente de validar

**Mismo tema, misma semana, en las dos plataformas — pero render nativo en cada
una.**

- **Instagram:** el carrusel de cinco slides que ya existe.
- **Facebook:** una sola imagen fuerte —la fábrica ya genera el 1:1— con un
  caption largo que lleve el argumento entero.

Facebook se lee, Instagram se desliza. Es usar la fuerza de cada plataforma en
vez de forzar un formato en las dos.

El coste es bajo: los mismos datos de origen, otro formato de salida y otro
texto. Y `lib/piezas/validar.ts` protege los hechos comerciales igual en ambos
canales.

---

## Lo que falta decidir antes de escribir código

1. **¿Quién escribe el caption de Facebook?** Si es otro texto, es trabajo nuevo
   cada semana. Si lo escribe una IA, entra en la fase 2 y necesita evals.
2. **¿La misma semana o desfasado?** Publicar el mismo tema el mismo día en las
   dos, o dejar dos o tres días entre medias.
3. **¿Y las piezas que ya salieron en Instagram?** Hay un archivo de siete
   carruseles de septiembre que podría alimentar Facebook sin producir nada
   nuevo.
4. **El formato de datos.** Hoy `Pieza` asume un carrusel de Instagram. Habría
   que decidir si Facebook es un campo más de la misma pieza o una entidad
   aparte.

---

## Lo técnico, ya verificado

- **La página de Facebook y la cuenta de Instagram ya están enlazadas**: el IG
  User ID `17841476784325626` se obtuvo a través de la página `764585143409223`
  del portfolio de empresa.
- El **token de página no caduca**, comprobado con `debug_token`
  (`expires_at: NUNCA`). Sirve para ambos endpoints.
- Publicar en la página son **dos pasos**: subir cada foto a `{page-id}/photos`
  con `published=false`, y crear el post en `{page-id}/feed` con
  `attached_media[N]={"media_fbid":"..."}`.
- Igual que en Instagram, **la imagen necesita una URL pública**: la sirve
  `public/piezas/` del propio sitio.

---

## Fuentes

- [NapoleonCat — usuarios de Facebook en Ecuador (mar 2026)](https://stats.napoleoncat.com/facebook-users-in-ecuador/2026/03/)
- [NapoleonCat — usuarios de Instagram en Ecuador](https://stats.napoleoncat.com/instagram-users-in-ecuador/)
- [Meta Ads en Ecuador 2026 — guía para negocios locales](https://armasadvisory.com/blog/meta-ads-ecuador-2026/)
- [Duplicate content al cross-postear (2026)](https://www.socialync.io/blog/avoid-content-duplication-penalties-cross-posting-2026)
- [Facebook carousel para posts orgánicos](https://www.strengthinbusiness.com/facebook-carousel-format-for-organic-posts/)
- [Publicar multi-foto con la Graph API](https://phppot.com/php/publishing-multi-photo-stories-to-facebook-using-php-sdk/)
