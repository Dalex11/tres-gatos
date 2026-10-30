---
# ===================== PLANTILLA DE POST =====================
# 1. Copia este archivo dentro de la carpeta _posts
# 2. Ponle nombre así:  AÑO-MES-DÍA-titulo-sin-tildes.md
#    Ejemplo:           2026-11-02-la-lluvia-en-cali.md
#    (ese nombre, sin la fecha, será la dirección del post)
# 3. Llena los datos de abajo y escribe el texto debajo de las líneas ---
# =============================================================

title: "Título del post"

# Fecha y hora de publicación, en hora de Colombia (-0500).
# Si pones una fecha futura, el post no aparecerá hasta ese día.
date: 2026-11-02 08:00:00 -0500

# Autor (opcional): sale junto a la fecha como "Por ...". Bórralo para no firmar.
autor: "Nombre del autor"

# Uno o varios temas (los slugs de _data/temas.yml), separados por comas
temas: [politica, social]

# Foto principal: el archivo debe estar en assets/img/posts/
imagen: nombre-de-la-foto.jpg
imagen_alt: "Describe la foto para personas que no pueden verla"
# imagen_credito: "Foto: Nombre del autor / Fuente"   # opcional

# Resumen: sale en la tarjeta y al compartir. NO sale dentro del post.
resumen: "Una o dos frases que inviten a leer."

# Destacado en el carrusel: 1, 2 o 3 (el orden). Bórralo si no es destacado.
# Para cambiar los destacados, quita el número del post viejo y ponlo en el nuevo.
# destacado: 1

# Epígrafe (opcional): una cita o unos versos que salen antes del texto.
# Cada línea debe empezar con 2 espacios. Bórralo si no hay cita.
epigrafe: |
  Primera línea de la cita,
  segunda línea.
epigrafe_autor: "Autor, «Obra»"

# Fuentes: SIEMPRE salen al final del post, en este orden.
# Opción A (recomendada si ya tienes la referencia en APA): una línea por fuente,
# entre comillas. *cursiva* y <https://enlace> funcionan.
#   - "Apellido, N. (2026). Título. *Medio*. <https://...>"
# Opción B: por partes (medio, fecha y url son opcionales).
fuentes:
  - titulo: "Nombre del documento o artículo"
    medio: "Quién lo publicó"
    fecha: "2026"
    url: "https://..."
  - titulo: "Un libro sin enlace"
    medio: "Autor, Editorial"
---

El primer párrafo va aquí. Su primera letra sale grande y en rojo.

Cada párrafo nuevo se separa con una línea en blanco. El orden en que los escribes es el orden en que aparecen.

## Un subtítulo

Para poner un enlace: [texto que se ve](https://ejemplo.com).
Para **negrita** usa dos asteriscos y para *cursiva* uno.

{% include figura.html src="otra-foto.jpg" alt="Descripción de la foto" pie="Leyenda opcional que va debajo" %}

> Una cita destacada se escribe empezando la línea con el signo >

Una nota al pie se marca así[^1] y su texto se escribe al final del post.

- Una lista
- con viñetas

1. Una lista
2. numerada

[^1]: Este es el texto de la nota al pie. Sale al final del artículo, antes de las fuentes.
