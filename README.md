# Tres Gatos · guía para manejar el blog

Esta guía está pensada para alguien que **no sabe nada de código**. Si sigues los pasos en orden, vas a poder publicar noticias, poner fotos, cambiar el pie de página y arreglar los problemas más comunes.

> **Consejo:** para leer esta guía con formato bonito dentro de VS Code, abre este archivo y presiona `Ctrl + Shift + V`. También se ve bien en la página del repositorio en GitHub.

---

## Índice

1. [Cómo funciona el blog (la idea general)](#1-cómo-funciona-el-blog-la-idea-general)
2. [Las herramientas que vas a usar](#2-las-herramientas-que-vas-a-usar)
3. [El ciclo de trabajo: editar → revisar → publicar](#3-el-ciclo-de-trabajo-editar--revisar--publicar)
4. [Publicar una noticia, paso a paso](#4-publicar-una-noticia-paso-a-paso)
5. [Cómo escribir el texto (negritas, subtítulos, enlaces…)](#5-cómo-escribir-el-texto)
6. [Imágenes: portada, fotos dentro del texto y pies de foto](#6-imágenes)
7. [El orden de las noticias y el carrusel de destacados](#7-el-orden-de-las-noticias-y-el-carrusel)
8. [Corregir o borrar una noticia](#8-corregir-o-borrar-una-noticia)
9. [Temas (los filtros de la portada)](#9-temas-los-filtros-de-la-portada)
10. [El pie de página](#10-el-pie-de-página)
11. [Redes sociales, correo y páginas legales](#11-redes-sociales-correo-y-páginas-legales)
12. [La imagen que sale al compartir el blog](#12-la-imagen-que-sale-al-compartir-el-blog)
13. [Cuando algo sale mal](#13-cuando-algo-sale-mal)
14. [Mapa de carpetas: qué tocar y qué no](#14-mapa-de-carpetas-qué-tocar-y-qué-no)

---

## 1. Cómo funciona el blog (la idea general)

- El blog no tiene un panel de administración con botones como WordPress. **Cada noticia es un archivo de texto** dentro de la carpeta `_posts`.
- Tú escribes esos archivos en tu computador y los **subes a GitHub**. GitHub los convierte automáticamente en páginas web y las publica en **https://tres-gatos.com**.
- Cada vez que subes cambios, el sitio se vuelve a publicar solo, y eso tarda **1 o 2 minutos**.
- Todo lo que necesitas cambiar en el día a día está en **tres lugares**:

| Qué | Dónde |
|---|---|
| Las noticias | Carpeta `_posts` |
| Las fotos de las noticias | Carpeta `assets/img/posts` |
| Nombre, lema, correo, redes sociales | Archivo `_config.yml` |

Lo demás casi nunca hace falta tocarlo.

---

## 2. Las herramientas que vas a usar

1. **VS Code**: el programa donde editas los archivos (ya lo tienes).
   - Panel de la izquierda (**Explorador**, `Ctrl + Shift + E`): muestra las carpetas y los archivos.
   - **Control de código fuente** (`Ctrl + Shift + G`, el ícono de ramitas): ahí publicas los cambios.
   - **Terminal** (`` Ctrl + ` `` o, en teclado español, `Ctrl + Ñ`): una ventanita donde se escriben comandos. Solo la usas para ver el blog en tu computador antes de publicarlo.
2. **[squoosh.app](https://squoosh.app)**: una página gratuita para achicar el peso de las fotos.
3. **GitHub** ([github.com/Dalex11/tres-gatos](https://github.com/Dalex11/tres-gatos)): ahí vive el blog. En la pestaña **Actions** puedes ver si la publicación salió bien.

---

## 3. El ciclo de trabajo: editar → revisar → publicar

Esto es lo que vas a hacer **siempre**, sin importar qué cambies.

### A. Editar
Cambias o creas archivos en VS Code y los guardas con `Ctrl + S`. Un punto blanco en la pestaña del archivo significa que **no** lo has guardado.

### B. Revisar en tu computador (recomendado)
1. Abre la terminal de VS Code.
2. Escribe esto y presiona Enter:
   ```
   bundle exec jekyll serve --livereload
   ```
3. Espera a que diga `Server running...` y abre **http://localhost:4000** en el navegador.
4. Mientras esa terminal siga abierta, cada vez que guardes un archivo la página se actualiza sola.
5. Para apagarla: haz clic dentro de la terminal y presiona `Ctrl + C`.

> ⚠️ Si cambias `_config.yml`, tienes que **apagar y volver a encender** el comando, porque ese archivo solo se lee al arrancar.

Esta vista previa es solo tuya: nadie más la ve.

### C. Publicar
1. Ve a **Control de código fuente** (`Ctrl + Shift + G`). Ahí aparece la lista de archivos que cambiaste.
2. En la caja de texto de arriba, escribe una frase corta que describa el cambio, por ejemplo: `Nueva noticia: la lluvia en Cali`.
3. Haz clic en **Confirmar** (o **Commit**). Si VS Code te pregunta si quieres incluir todos los cambios, responde **Sí** (o **Siempre**).
4. Haz clic en **Sincronizar cambios** (o **Sync Changes**).
5. Espera 1 o 2 minutos y recarga https://tres-gatos.com. Si no ves el cambio, recarga con `Ctrl + Shift + R`.

**Si prefieres la terminal**, estos tres comandos hacen lo mismo:
```
git add .
git commit -m "Nueva noticia: la lluvia en Cali"
git push
```

---

## 4. Publicar una noticia, paso a paso

### Paso 1 · Prepara la foto principal
1. Usa una foto **horizontal**, de unos **1400 píxeles de ancho**.
2. Entra a [squoosh.app](https://squoosh.app), arrastra la foto, elige **MozJPEG** a la derecha y baja la calidad hasta que pese **menos de 400 KB**. Luego descárgala.
3. **Ponle un nombre sencillo**: en minúsculas, sin tildes, sin ñ y sin espacios (usa guiones).
   - ✅ `lluvia-en-cali.jpg`
   - ❌ `Lluvia en Cali (1).JPG`, ❌ `año-nuevo.jpg`
4. Copia la foto a la carpeta **`assets/img/posts`**. Puedes arrastrarla al Explorador de VS Code.

No hace falta pasarla a blanco y negro: el sitio lo hace solo y le devuelve el color cuando el lector pasa el mouse o abre la noticia.

### Paso 2 · Crea el archivo de la noticia
1. En la carpeta **`_plantillas`**, haz clic derecho sobre `nuevo-post.md` y elige **Copiar**.
2. Haz clic derecho sobre la carpeta **`_posts`** y elige **Pegar**.
3. Haz clic derecho sobre la copia, elige **Cambiar nombre** y llámala así:

   ```
   AÑO-MES-DÍA-titulo-corto-sin-tildes.md
   ```
   Por ejemplo: `2026-11-02-la-lluvia-en-cali.md`

   - La fecha va **al principio**, con guiones y con dos dígitos (`2026-11-02`, no `2026-11-2`).
   - Lo que va después de la fecha será la dirección de la noticia: `tres-gatos.com/posts/la-lluvia-en-cali/`.
   - Tiene que terminar en **`.md`**.

### Paso 3 · Llena los datos de la noticia
Abre el archivo. Arriba hay un bloque entre dos líneas `---`. Esos son los **datos** de la noticia. Las líneas que empiezan con `#` son instrucciones para ti: puedes borrarlas o dejarlas, porque no salen en la página.

Así queda un ejemplo completo:

```yaml
---
title: "La lluvia en Cali: por qué este año llovió el doble"
date: 2026-11-02 08:00:00 -0500
temas: [ciencia, social]
imagen: lluvia-en-cali.jpg
imagen_alt: "Calle del centro de Cali inundada, con motos atravesando el agua"
imagen_credito: "Foto: Ana Pérez"
resumen: "El fenómeno de La Niña explica una parte. La otra la explican los desagües."
destacado: 1
fuentes:
  - titulo: "Boletín climático de octubre"
    medio: "IDEAM"
    fecha: "2026"
    url: "https://www.ideam.gov.co"
  - titulo: "Cien años de soledad"
    medio: "Gabriel García Márquez, Sudamericana"
---
```

Qué significa cada dato:

| Dato | Para qué sirve | ¿Obligatorio? |
|---|---|---|
| `title` | El título de la noticia. | Sí |
| `autor` | Quién la escribió. Sale junto a la fecha como "Por …". Si la borras, la noticia sale sin firma. | No |
| `date` | Fecha y hora de publicación en hora de Colombia. Respeta el formato: `AÑO-MES-DÍA HORA:MIN:SEG -0500`. | Sí |
| `temas` | Uno o varios temas entre corchetes y separados por comas. Los temas que existen están en la [sección 9](#9-temas-los-filtros-de-la-portada). | Sí |
| `imagen` | El nombre **exacto** de la foto principal que pusiste en `assets/img/posts`. | Sí |
| `imagen_alt` | Una descripción de la foto para personas ciegas que usan lectores de pantalla. | Sí |
| `imagen_credito` | El autor de la foto. Sale pequeño debajo de la portada. | No |
| `resumen` | Una o dos frases que invitan a leer. Salen en la tarjeta de la portada, en el carrusel y cuando alguien comparte el enlace. **No salen dentro de la noticia.** | Sí |
| `epigrafe` y `epigrafe_autor` | Una cita o unos versos que salen antes del texto, con su autor (ver el ejemplo abajo). | No |
| `destacado` | `1`, `2` o `3` para ponerla en el carrusel de la portada (ver [sección 7](#7-el-orden-de-las-noticias-y-el-carrusel)). Si no la quieres destacar, borra la línea. | No |
| `fuentes` | Lista de fuentes o referencias. Salen al final de la noticia en el mismo orden. Si borras todas, sale "Texto de opinión: no cita fuentes externas". | No |

#### Epígrafe (cita antes del texto)
Cada línea del poema o de la cita va en su propio renglón y empieza con **2 espacios**:
```yaml
epigrafe: |
  Esta es la boca que hubo,
  esto los besos.
epigrafe_autor: "María Mercedes Carranza, «Tierralta»"
```

#### Referencias en formato APA
Si ya tienes las referencias escritas, ponlas cada una entre comillas en una línea que empieza con `  - `. Dentro puedes usar `*cursiva*` y poner los enlaces entre `<` y `>` para que se puedan abrir:
```yaml
fuentes:
  - "Roberts, M. E. (2014). *Fear, friction, and flooding* [Tesis doctoral, Harvard University]."
  - "EFE. (1981, 27 de marzo). El escritor García Márquez abandona Colombia. *El País*. <https://elpais.com/...>"
```
La forma por partes (`titulo`, `medio`, `fecha`, `url`) del ejemplo de arriba también sigue funcionando.

#### ⚠️ Reglas de oro para los datos
Casi todos los errores vienen de aquí:

1. **Pon los textos entre comillas** (`"…"`), sobre todo si llevan dos puntos `:`, como en `"La lluvia en Cali: por qué…"`.
2. Si un texto lleva comillas por dentro, usa comillas latinas o simples: `"El llamado «paro armado»"`.
3. **No borres los espacios del principio** en las fuentes. Cada `- titulo:` lleva **2 espacios** antes y las líneas de abajo (`medio`, `fecha`, `url`) llevan **4**. Usa la barra espaciadora, no la tecla Tab.
4. Siempre va un espacio **después** de los dos puntos: `title: "Hola"`, no `title:"Hola"`.
5. No borres las dos líneas `---` (la de arriba y la de abajo).

### Paso 4 · Escribe el texto
Debajo de la segunda línea `---`, borra el texto de ejemplo de la plantilla y escribe tu noticia. Para negritas, subtítulos, enlaces y demás, mira la [sección 5](#5-cómo-escribir-el-texto).

### Paso 5 · Revisa y publica
Guarda con `Ctrl + S`, revisa en http://localhost:4000 (si tienes encendida la vista previa) y publica como se explica en la [sección 3](#c-publicar).

---

## 5. Cómo escribir el texto

El texto se escribe en un formato llamado **Markdown**: es texto normal con algunos símbolos.

| Quiero… | Escribo… | Se ve… |
|---|---|---|
| Un párrafo nuevo | Una **línea en blanco** entre los párrafos | Dos párrafos separados |
| Un subtítulo | `## Mi subtítulo` | Un subtítulo grande |
| Un subtítulo más pequeño | `### Mi subtítulo` | Un subtítulo mediano |
| Negrita | `**texto**` | **texto** |
| Cursiva | `*texto*` | *texto* |
| Un enlace | `[texto que se ve](https://direccion.com)` | [texto que se ve](https://direccion.com) |
| Una cita destacada | `> El texto de la cita` al inicio de la línea | Un bloque de cita |
| Una lista con viñetas | Líneas que empiezan con `- ` | • elemento |
| Una lista numerada | Líneas que empiezan con `1. `, `2. ` … | 1. elemento |
| Una nota al pie | `texto[^1]` donde va el número y, al final del texto, una línea `[^1]: Texto de la nota.` | Un ¹ pequeño que lleva a la nota, al final del artículo |
| Una línea separadora | `---` sola en una línea, con una línea en blanco antes | Una raya horizontal |

**Detalles:**
- La **primera letra del primer párrafo** sale grande y en rojo de forma automática.
- Un solo salto de línea (Enter) **no** crea un párrafo nuevo: hay que dejar una línea en blanco.
- El tiempo de lectura ("4 min de lectura") se calcula solo.

### Tablas
```
| Producto | Precio 2025 | Precio 2026 |
|---|---|---|
| Tinto | $1.500 | $2.000 |
| Pan | $500 | $700 |
```
La primera fila son los títulos. La segunda (`|---|---|---|`) es obligatoria y debe tener tantos `---` como columnas.

---

## 6. Imágenes

Todas las fotos de las noticias van en **`assets/img/posts`**, con nombres sencillos (minúsculas, sin tildes, sin espacios). Recomendaciones: horizontales, unos 1400 px de ancho y menos de 400 KB.

### Foto principal (portada de la noticia)
Es la del dato `imagen:` (ver el [Paso 3](#paso-3--llena-los-datos-de-la-noticia)). Sale arriba de la noticia, en la tarjeta de la portada, en el carrusel y cuando alguien comparte el enlace en redes. **Toda noticia necesita una.**

### Fotos dentro del texto
Pon esta línea donde quieras que aparezca la foto, sola y con una línea en blanco antes y después:

```
{% include figura.html src="calle-inundada.jpg" alt="Calle inundada en el barrio San Fernando" pie="Así amaneció San Fernando el 30 de octubre. Foto: Ana Pérez" %}
```

| Parte | Qué es |
|---|---|
| `src="…"` | El nombre exacto del archivo en `assets/img/posts`. |
| `alt="…"` | La descripción para lectores de pantalla (no se ve). |
| `pie="…"` | **El pie de foto**: el texto pequeño que sale debajo de la imagen. Es opcional, así que si no lo quieres, borra todo `pie="…"`. |
| `ancho="completo"` | Opcional. Hace que la foto sea más ancha que la columna de texto. |

Ejemplo con foto ancha:
```
{% include figura.html src="panoramica-cali.jpg" alt="Vista de Cali desde Cristo Rey" pie="Cali desde Cristo Rey" ancho="completo" %}
```

### Si una foto no aparece
- Revisa que el nombre en el texto sea **idéntico** al del archivo, incluidas las mayúsculas: en internet, `Foto.JPG` y `foto.jpg` son archivos distintos.
- Revisa que la foto esté en `assets/img/posts` y no en otra carpeta.
- Revisa que la hayas publicado: la foto también tiene que aparecer en la lista de **Control de código fuente**.

---

## 7. El orden de las noticias y el carrusel

### La lista de la portada
- Las noticias se ordenan **solas por fecha y hora** (el dato `date:`): la más nueva va primero.
- Para **subir o bajar** una noticia, cambia su `date:`. Si publicas dos el mismo día, la hora decide cuál va primero.
- La portada carga 6 noticias y trae 6 más cuando el lector baja. Ese número se cambia en `_config.yml` → `posts_por_carga`.

### El carrusel de destacados (arriba de la portada)
- Muestra **hasta 3** noticias. Para elegirlas, pon `destacado: 1`, `destacado: 2` o `destacado: 3` en sus datos. El número es el orden en el carrusel.
- Para cambiar un destacado, **borra** la línea `destacado:` de la noticia vieja y ponla en la nueva. No dejes dos noticias con el mismo número.
- Si marcas menos de 3, el carrusel se completa con las noticias más recientes.
- **Mientras no haya ninguna noticia, el carrusel no aparece.** Saldrá solo cuando publiques la primera.
- Cuánto dura cada diapositiva: `_config.yml` → `segundos_carrusel`.

### Noticias con fecha futura (programadas)
Si pones una fecha futura, la noticia **no se publica**, pero GitHub no la saca sola cuando llega el día: solo vuelve a construir el sitio cuando subes un cambio. Así que, después de esa fecha, tienes que publicar cualquier cambio (aunque sea pequeño) para que aparezca. En la práctica, es más fácil publicar con la fecha y hora del momento.

---

## 8. Corregir o borrar una noticia

- **Corregir**: abre el archivo en `_posts`, cambia lo que necesites, guarda y publica.
- **Borrar**: haz clic derecho sobre el archivo en `_posts` → **Eliminar**. Si su foto no la usa ninguna otra noticia, bórrala también de `assets/img/posts`. Luego publica.
- ⚠️ **No le cambies el nombre al archivo** de una noticia ya publicada: cambiaría su dirección y los enlaces que la gente ya compartió dejarían de funcionar. Si te equivocaste en el título, corrige solo `title:` dentro del archivo.

---

## 9. Temas (los filtros de la portada)

Los temas que existen hoy son estos (lo de la izquierda es lo que escribes en `temas:`):

| Escribes | Se ve |
|---|---|
| `politica` | Política |
| `economia` | Economía |
| `ciencia` | Ciencia |
| `tecnologia` | Tecnología |
| `pedagogia` | Pedagogía |
| `social` | Social |
| `filosofia` | Filosofía |
| `literatura` | Literatura |
| `cultura` | Cultura |

Se escriben **sin tildes y en minúsculas**: `temas: [politica, economia]`.

### Crear un tema nuevo
Abre `_data/temas.yml` y agrega al final, con los mismos espacios que los demás:

```yaml
- slug: deportes
  nombre: Deportes
  icono: generico
```

- `slug`: lo que escribirás en las noticias (sin tildes, sin espacios).
- `nombre`: lo que leen las personas.
- `icono: generico` usa una estrella de alguacil. Hacer un dibujo propio requiere editar `assets/img/iconos.svg`, y para eso conviene pedir ayuda.

El orden de la lista es el orden de los íconos en la portada.

---

## 10. El pie de página

El pie de página es la franja oscura al final de todas las páginas. Esto es lo que tiene y dónde se cambia:

| Parte del pie | Dónde se cambia |
|---|---|
| Logo y nombre "Tres Gatos" | `_config.yml` → `title` (el nombre) |
| Lema ("No es mucho, pero es nuestro.") | `_config.yml` → `lema` |
| Enlaces "Lo legal" | Páginas de la carpeta `paginas/` |
| Correo de contacto | `_config.yml` → `correo` |
| Íconos de redes sociales | `_config.yml` → `redes` (ver [sección 11](#11-redes-sociales-correo-y-páginas-legales)) |
| Texto final "© 2026 Tres Gatos. Todos los derechos reservados…" | `_includes/footer.html`, en la línea que empieza con `<p class="pie__copy">`. El año se actualiza solo. |

Para cambiar el texto del © en `_includes/footer.html`, cambia **solo las palabras** y no toques nada de lo que está entre `<` `>` ni entre `{{` `}}`.

Recuerda que después de cambiar `_config.yml` hay que reiniciar la vista previa (ver la [sección 3](#b-revisar-en-tu-computador-recomendado)).

---

## 11. Redes sociales, correo y páginas legales

### Redes sociales
Están en `_config.yml`, en la sección `redes`. Cada red tiene su enlace en `url:`.
- Si una cuenta deja de existir, pon `url: ""`: el ícono queda atenuado con el aviso "Próximamente".
- Los íconos salen en la cabecera y en el pie de página.
- El enlace de Facebook es uno de los que genera el botón "Compartir" (`facebook.com/share/…`). Si después tienes la dirección directa de la página (algo como `facebook.com/blog.tresgatos`), es mejor ponerla en su lugar.

### Correo y responsable
En `_config.yml`: `correo`, `responsable`, `pais` y `fecha_legal`. Salen en el pie de página y en los textos legales.

### Página de RSS
El enlace "Suscribirse por RSS" del pie lleva a `tres-gatos.com/rss/`, una página que explica qué es RSS, tiene un botón para copiar la dirección del feed y lista las últimas 10 noticias. El texto está en `paginas/rss.md`. El feed en sí (`/feed.xml`) lo generan las noticias solas; no hay que tocarlo.

### Páginas legales y de contacto
Están en la carpeta `paginas/`: `aviso-legal.md`, `privacidad.md`, `cookies.md` y `contacto.md`. Se editan como una noticia: datos arriba y texto abajo. Son borradores pensados para Colombia (Ley 1581 de 2012), y conviene que un abogado les dé una revisión. Si las cambias, actualiza también `fecha_legal` en `_config.yml`.

---

## 12. La imagen que sale al compartir el blog

- Cuando alguien comparte **una noticia**, WhatsApp, Facebook o X muestran **la foto principal de esa noticia**, su título y su resumen.
- Cuando alguien comparte **la portada** (`tres-gatos.com`), se muestra `assets/img/og-tres-gatos.jpg`. Si la reemplazas, la nueva tiene que llamarse igual y medir **1200 × 630 píxeles**.
- Las redes guardan una copia de esa imagen por un tiempo. Para que Facebook muestre la nueva, pega el enlace en el [Sharing Debugger](https://developers.facebook.com/tools/debug/) y haz clic en **Scrape Again**.

---

## 13. Cuando algo sale mal

### ¿Cómo sé si la publicación falló?
En GitHub, entra al repositorio → pestaña **Actions**:
- ✅ círculo verde: se publicó bien.
- 🟡 círculo amarillo: todavía se está publicando.
- ❌ cruz roja: hubo un error. Haz clic encima para ver el detalle. Casi siempre es un error en los datos de una noticia (ver las [reglas de oro](#️-reglas-de-oro-para-los-datos)). Mientras tanto, el sitio sigue mostrando la última versión que funcionó.

### Problemas frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| La noticia no aparece | El nombre del archivo no empieza por `AÑO-MES-DÍA-` o no termina en `.md` | Renombra el archivo (`2026-11-02-titulo.md`) |
| La noticia no aparece | La fecha (`date:`) es futura | Ver "Noticias con fecha futura" en la [sección 7](#7-el-orden-de-las-noticias-y-el-carrusel) |
| La noticia no aparece y Actions muestra ❌ | Error en los datos: faltan comillas, sobran espacios o se borró un `---` | Revisa las [reglas de oro](#️-reglas-de-oro-para-los-datos) |
| La foto sale rota | El nombre no coincide (mayúsculas, extensión `.JPG` o `.jpeg`) o la foto no se subió | Ver "Si una foto no aparece" en la [sección 6](#6-imágenes) |
| Todo el sitio sale sin colores ni estilos | Se cambió `url` o `baseurl` en `_config.yml` | Deben quedar así: `url: "https://tres-gatos.com"` y `baseurl: ""` |
| Hice un cambio y no lo veo | Caché del navegador | Recarga con `Ctrl + Shift + R` o prueba en una ventana de incógnito |
| Cambié `_config.yml` y en la vista previa no cambia nada | Ese archivo solo se lee al arrancar | Apaga la vista previa (`Ctrl + C`) y vuelve a encenderla |
| La terminal dice `Address already in use` | La vista previa ya está encendida en otra terminal | Ciérrala allá o usa la que ya está abierta |
| Un texto sale con `**` o `##` visibles | Falta un espacio o un cierre: `## Título` lleva espacio y `**negrita**` debe cerrarse | Revisa el símbolo |

### Deshacer un cambio que todavía no publicaste
En **Control de código fuente**, pasa el mouse sobre el archivo y haz clic en la flecha curva (**Descartar cambios**). Esto **no se puede deshacer**, así que úsalo con cuidado.

---

## 14. Mapa de carpetas: qué tocar y qué no

```
_posts/              ✏️  Las noticias (un archivo .md por noticia)
assets/img/posts/    ✏️  Las fotos de las noticias
_config.yml          ✏️  Nombre, lema, correo, redes, opciones de la portada
_data/temas.yml      ✏️  Lista de temas
paginas/             ✏️  Aviso legal, privacidad, cookies, contacto, RSS
_plantillas/         📋  Plantilla para copiar al crear una noticia
_includes/footer.html  ✏️  Solo el texto del © (ver sección 10)

assets/img/og-tres-gatos.jpg   Imagen al compartir la portada
assets/img/logo/     🚫  Logos del blog
assets/css/          🚫  Diseño y colores
assets/js/           🚫  Carrusel, buscador, "me gusta", compartir
_layouts/, _includes/  🚫  Estructura de las páginas
CNAME                🚫  El dominio tres-gatos.com (no lo borres)
sw.js, manifest.webmanifest  🚫  Lo que permite instalar el blog como app
_site/               🚫  Se genera solo con la vista previa; no se publica
```
✏️ = lo editas tú · 📋 = lo copias · 🚫 = no hace falta tocarlo

### Lo que el blog ya hace solo
- Ordena las noticias, calcula el tiempo de lectura y muestra las fechas como "hace 2 h" (y desde el día 7, la fecha completa).
- Pasa las fotos a blanco y negro y les devuelve el color al pasar el mouse.
- Tiene un buscador que busca en títulos, resúmenes, temas y en todo el texto.
- Tiene botones para compartir en WhatsApp, Facebook, X, Threads y Telegram, además de copiar el enlace.
- Guarda los "me gusta" en el navegador de cada lector. No hay conteo público.
- Se puede instalar como app en el celular y se puede leer sin conexión.
- Genera un RSS (`/feed.xml`) y un mapa del sitio para Google.

---

Fuentes tipográficas: Staatliches y Crimson Pro (licencia SIL Open Font, incluidas en `assets/fonts`). Íconos de redes sociales: Simple Icons (CC0).
