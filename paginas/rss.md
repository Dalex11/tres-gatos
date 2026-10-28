---
title: Síguenos por RSS
subtitulo: Sin algoritmos, sin correo, sin cuentas. Lo publicamos y te llega.
permalink: /rss/
---

{% assign direccion = '/feed.xml' | absolute_url %}

## Qué es

RSS es una forma de seguir blogs y periódicos desde una sola app, llamada **lector de noticias**. Cada vez que publicamos algo, te aparece ahí, en orden y completo: nadie decide por ti qué ves y qué no.

No tienes que darnos tu correo ni crear una cuenta, y puedes dejar de seguirnos cuando quieras.

## Cómo suscribirte

**1.** Copia esta dirección:

<div class="rss-direccion">
  <p class="correo-grande"><code>{{ direccion }}</code></p>
  <button class="boton" type="button" data-copiar="{{ direccion }}">Copiar dirección</button>
</div>

**2.** Pégala en tu lector de noticias, en la opción *Agregar*, *Seguir* o *Suscribirse*. Si todavía no tienes uno, estos son gratuitos:

- [Feedly](https://feedly.com): en la web, Android y iPhone.
- [Inoreader](https://www.inoreader.com): en la web, Android y iPhone.
- [NetNewsWire](https://netnewswire.com): en iPhone y Mac.

Muchos lectores también encuentran el feed solos si escribes simplemente **{{ site.url | remove_first: 'https://' }}**.

## Lo último que publicamos

{% if site.posts.size > 0 %}
<ul class="rss-lista">
  {%- for p in site.posts limit: 10 %}
  <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a> <time class="fecha-rel" datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: "%d/%m/%Y" }}</time></li>
  {%- endfor %}
</ul>
{% else %}
Todavía no hemos publicado nada. Si te suscribes ahora, la primera noticia te llegará apenas salga.
{% endif %}
