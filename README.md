# Tres Gatos · guía rápida

Blog estático para GitHub Pages, hecho con Jekyll (viene incluido en GitHub Pages: no hay que instalar nada para publicar).

---

## 1. Publicar por primera vez

1. Crea una cuenta en [github.com](https://github.com) si no la tienes.
2. Crea un repositorio nuevo **público** llamado exactamente `TU-USUARIO.github.io` (cambia TU-USUARIO por tu nombre de usuario).
3. Sube todo el contenido de esta carpeta al repositorio. Sin instalar nada: botón **Add file → Upload files**, arrastra todo y pulsa **Commit changes**.
4. Abre `_config.yml` y cambia `url: "https://TU-USUARIO.github.io"` por tu dirección real.
5. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
6. En 1–2 minutos el blog estará en `https://TU-USUARIO.github.io`.

> Si el repositorio tiene otro nombre (por ejemplo `tres-gatos`), pon `baseurl: "/tres-gatos"` en `_config.yml`.

**Para trabajar desde tu computador** (recomendado): instala [GitHub Desktop](https://desktop.github.com), clona el repositorio, edita los archivos con cualquier editor (VS Code, Notepad++, etc.) y pulsa *Commit* y *Push*. Cada vez que subes cambios, el sitio se vuelve a publicar solo.

---

## 2. Escribir un post nuevo

1. Copia `_plantillas/nuevo-post.md` dentro de la carpeta `_posts`.
2. Cámbiale el nombre: `AÑO-MES-DÍA-titulo-sin-tildes.md`, por ejemplo `2026-11-02-la-lluvia-en-cali.md`.
3. Llena los datos de arriba (título, fecha, temas, foto, resumen, fuentes).
4. Escribe el texto debajo. El orden en que escribes es el orden en que se ve.
5. Pon la foto principal (y las de apoyo) en `assets/img/posts/`.

### Lo que puedes poner dentro del texto

| Quiero... | Escribo... |
|---|---|
| Un párrafo nuevo | Una línea en blanco entre párrafos |
| Un subtítulo | `## Mi subtítulo` |
| Un enlace | `[texto que se ve](https://direccion.com)` |
| Negrita / cursiva | `**negrita**` / `*cursiva*` |
| Una cita destacada | Empieza la línea con `> ` |
| Una lista | Líneas que empiezan con `- ` (o `1. ` para numerada) |
| Una imagen de apoyo | `{% include figura.html src="foto.jpg" alt="Descripción" pie="Leyenda" %}` |
| Imagen más ancha que el texto | Añade `ancho="completo"` a la línea anterior |
| Una tabla | Mira el post *El precio de un tinto* como ejemplo |

- **Resumen:** sale en la tarjeta, en el carrusel y al compartir. Nunca dentro del post.
- **Fuentes:** siempre salen al final, en el orden en que las escribas. Si no hay, sale "Texto de opinión: no cita fuentes externas".
- **Posts anónimos:** no hay campo de autor en ningún lado.
- **Fecha futura:** el post no aparece hasta que vuelvas a subir algo después de esa fecha (GitHub Pages solo publica cuando hay cambios).

### Fotos

- Formato horizontal (16:10 o 16:9), unos **1400 px de ancho** y menos de **400 KB**. Puedes comprimirlas gratis en [squoosh.app](https://squoosh.app).
- El sitio las muestra en blanco y negro y les devuelve el color al pasar el mouse o al abrir el post. No hace falta editarlas.
- Las fotos de ejemplo (paisajes) son de relleno: bórralas cuando tengas las tuyas.

---

## 3. Elegir los destacados del carrusel

En el post que quieras destacar, pon `destacado: 1`, `destacado: 2` o `destacado: 3` (es el orden de aparición). Para cambiar un destacado, borra esa línea del post viejo y ponla en el nuevo. Si marcas menos de 3, el carrusel se completa con los posts más recientes.

---

## 4. Temas (filtros)

Están en `_data/temas.yml`. Para crear uno nuevo:

```yaml
- slug: deportes        # sin tildes ni espacios; es lo que usas en los posts
  nombre: Deportes      # lo que lee la gente
  icono: generico       # estrella de alguacil, mientras no tenga dibujo propio
```

Luego en los posts: `temas: [deportes, social]`.

**Dibujo propio para un tema nuevo:** abre `assets/img/iconos.svg` y agrega un `<symbol id="t-deportes" viewBox="0 0 48 48">…</symbol>` con la silueta (un solo color, sin relleno de color). Después pon `icono: deportes`.

---

## 5. Redes sociales, contacto y textos legales

- **Redes:** en `_config.yml`, sección `redes`, pega el enlace de cada cuenta cuando exista. Mientras esté vacío, el icono sale atenuado con "Próximamente".
- **Correo y responsable:** también en `_config.yml`.
- **Textos legales:** en la carpeta `paginas/`. Son borradores sencillos pensados para Colombia (Ley 1581 de 2012); conviene que un abogado les dé una revisión.

---

## 6. Dominio propio (cuando lo compres)

1. Crea en la raíz un archivo llamado `CNAME` con una sola línea: `tresgatos.com` (tu dominio).
2. En tu proveedor del dominio, crea los registros DNS que indica la [guía de GitHub](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. Cambia en `_config.yml`: `url: "https://tresgatos.com"` y `baseurl: ""`.
4. En **Settings → Pages** marca **Enforce HTTPS**.

---

## 7. Qué hace cada carpeta

```
_config.yml          Configuración general (nombre, correo, redes, dirección)
_data/temas.yml      Lista de temas e iconos
_posts/              Los posts (uno por archivo .md)
_plantillas/         Plantilla para copiar al crear un post
paginas/             Aviso legal, privacidad, cookies, contacto
_layouts/            Estructura de las páginas (no hace falta tocar)
_includes/           Piezas reutilizables: cabecera, pie, figura… (no hace falta tocar)
assets/css/          Estilos (colores en las primeras líneas de estilos.css)
assets/js/app.js     Carrusel, scroll infinito, buscador, likes, compartir
assets/img/          Logo, iconos, texturas, fotos de los posts, iconos de la app
sw.js, manifest      Lo que permite instalar el blog como app (PWA)
```

### Funciones incluidas

- Carrusel de 3 destacados (cambia cada 5 s, se pausa con el mouse, con puntos, flechas, botón de pausa y deslizar con el dedo; respeta "reducir movimiento").
- Scroll infinito (6 posts por carga, configurable en `_config.yml`) con filtros por tema; teclas **Q / E** para cambiar de tema.
- Tarjetas que se abren al pasar el mouse; en celular se ven abiertas.
- Fechas "hace X min / h / días" y, desde el día 7, la fecha completa, en hora de Colombia.
- Me gusta guardados en una cookie del navegador (sin servidor, sin conteo público).
- Buscador interno por título, resumen, tema y texto completo.
- Post con tiempo de lectura, barra de progreso, compartir (WhatsApp, Facebook, X, Threads, Telegram, copiar enlace y menú nativo del celular), fuentes y relacionados.
- Botón **Volver** (o tecla Esc) que regresa a la lista sin perder la posición.
- App instalable y lectura sin conexión, página 404 temática, RSS (`/feed.xml`), mapa del sitio y vista previa al compartir.

### Probar en tu computador (opcional)

Requiere Ruby. En la carpeta del proyecto: `bundle install` y luego `bundle exec jekyll serve`. Abre `http://localhost:4000`.

---

Fuentes tipográficas: Staatliches y Crimson Pro (licencia SIL Open Font, incluidas en `assets/fonts`). Iconos de redes sociales: Simple Icons (CC0).
