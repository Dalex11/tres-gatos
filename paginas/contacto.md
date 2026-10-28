---
title: Contacto
subtitulo: Somos pocos, pero leemos todo.
permalink: /contacto/
---

## Escríbenos

La forma de hablar con {{ site.title }} es el correo:

<p class="correo-grande"><a href="mailto:{{ site.correo }}">{{ site.correo }}</a></p>

Escríbenos para:

- Señalar un error o un dato que haya que corregir.
- Proponer un tema o enviarnos una fuente.
- Pedir permiso para reproducir un texto.
- Cualquier consulta sobre privacidad o derechos de autor.

Solemos responder en pocos días. Usaremos tu correo solo para contestarte (más detalles en la [política de privacidad]({{ '/privacidad/' | relative_url }})).

## Redes sociales

También puedes seguirnos y escribirnos en:

{% for red in site.redes %}{% if red.url and red.url != "" %}
- [{{ red.nombre }}]({{ red.url }}){:target="_blank" rel="noopener"}
{%- endif %}{% endfor %}

## Datos del responsable

- **Responsable:** {{ site.responsable }}
- **País:** {{ site.pais }}
- **Correo:** [{{ site.correo }}](mailto:{{ site.correo }})
