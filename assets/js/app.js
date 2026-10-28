/* =====================================================================
   TRES GATOS · comportamiento del sitio
   - Fechas relativas ("hace 3 h") en hora de Colombia
   - Me gusta guardados en una cookie
   - Carrusel de destacados
   - Scroll infinito con filtros por tema
   - Buscador interno (sin servicios externos)
   - Post: compartir, volver sin perder el lugar, relacionados
   - App instalable (PWA)
   ===================================================================== */
(function () {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const meta = (n) => (document.querySelector(`meta[name="${n}"]`) || {}).content || '';

  const BASE = meta('tg-base').replace(/index\.html$/, '');
  const SPRITE = BASE + 'assets/img/iconos.svg';
  const POR_CARGA = parseInt(meta('tg-carga'), 10) || 6;
  const SEG_CARRUSEL = parseFloat(meta('tg-carrusel')) || 5;
  const ZONA = 'America/Bogota';
  const POCO_MOVIMIENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TACTIL = window.matchMedia('(hover: none)').matches;

  let TEMAS = [];
  try { TEMAS = JSON.parse($('#datos-temas').textContent) || []; } catch (e) { TEMAS = []; }
  const TEMA = Object.fromEntries(TEMAS.map((t) => [t.slug, t]));

  const escapar = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icono = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="${SPRITE}#${id}"/></svg>`;
  const normalizar = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* -------------------------------------------------------------- fechas */
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const partesFecha = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: 'numeric', day: 'numeric' });

  function fechaColombia(d) {
    const p = Object.fromEntries(partesFecha.formatToParts(d).map((x) => [x.type, x.value]));
    return { dia: +p.day, mes: +p.month - 1, anio: +p.year };
  }

  /** Menos de 7 días: "hace X". Desde el día 7: fecha completa. */
  function fechaRelativa(iso, larga) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const seg = Math.max(0, (Date.now() - d.getTime()) / 1000);
    if (seg < 60) return 'hace un momento';
    const min = Math.floor(seg / 60);
    if (min < 60) return `hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `hace ${h} h`;
    const dias = Math.floor(h / 24);
    if (dias < 7) return dias === 1 ? 'hace 1 día' : `hace ${dias} días`;
    const f = fechaColombia(d);
    return larga ? `${f.dia} de ${MESES_LARGOS[f.mes]} de ${f.anio}` : `${f.dia} ${MESES[f.mes]} ${f.anio}`;
  }

  function pintarFechas(raiz = document) {
    $$('time.fecha-rel', raiz).forEach((t) => {
      t.textContent = fechaRelativa(t.getAttribute('datetime'), t.dataset.larga);
      if (!t.title) {
        const f = fechaColombia(new Date(t.getAttribute('datetime')));
        t.title = `${f.dia} de ${MESES_LARGOS[f.mes]} de ${f.anio}`;
      }
    });
  }

  /* -------------------------------------------------------------- cookies */
  const COOKIE_LIKES = 'tg_likes';
  const COOKIE_OK = 'tg_consentimiento';
  const UN_ANIO = 60 * 60 * 24 * 365;
  const RUTA_COOKIE = BASE.startsWith('/') ? BASE : '/';

  function leerCookie(n) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function escribirCookie(n, v, persistente) {
    let c = `${n}=${encodeURIComponent(v)}; path=${RUTA_COOKIE}; SameSite=Lax`;
    if (persistente) c += `; max-age=${UN_ANIO}`;
    if (location.protocol === 'https:') c += '; Secure';
    document.cookie = c;
  }
  function borrarCookie(n) { document.cookie = `${n}=; path=${RUTA_COOKIE}; max-age=0`; }
  const aceptoCookies = () => leerCookie(COOKIE_OK) === 'si';

  function avisoCookies() {
    const aviso = $('#aviso-cookies');
    if (!aviso) return;
    if (!leerCookie(COOKIE_OK)) aviso.hidden = false;
    aviso.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consentimiento]');
      if (!b) return;
      const si = b.dataset.consentimiento === 'si';
      escribirCookie(COOKIE_OK, si ? 'si' : 'no', true);
      // Reescribe los likes con la duración que corresponde a la elección
      const likes = leerCookie(COOKIE_LIKES);
      if (likes) escribirCookie(COOKIE_LIKES, likes, si);
      aviso.hidden = true;
    });
    $$('[data-reiniciar-cookies]').forEach((b) => b.addEventListener('click', () => {
      borrarCookie(COOKIE_OK);
      aviso.hidden = false;
      aviso.querySelector('button').focus();
    }));
  }

  /* -------------------------------------------------------------- me gusta */
  /** Código corto para cada post (así caben cientos de likes en la cookie). */
  function codigo(url) {
    let h = 5381;
    const s = String(url).replace(/index\.html$/, '').replace(/^\/+/, '');
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function misLikes() {
    const v = leerCookie(COOKIE_LIKES);
    return new Set(v ? v.split('.').filter(Boolean) : []);
  }
  function guardarLikes(set) {
    if (set.size) escribirCookie(COOKIE_LIKES, Array.from(set).join('.'), aceptoCookies());
    else borrarCookie(COOKIE_LIKES);
  }
  function sincronizarLikes(raiz = document) {
    const set = misLikes();
    $$('[data-like]', raiz).forEach((b) => {
      const on = set.has(codigo(b.dataset.like));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', on ? 'Quitar me gusta' : 'Me gusta');
    });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-like]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const id = codigo(b.dataset.like);
    const set = misLikes();
    const activar = !set.has(id);
    activar ? set.add(id) : set.delete(id);
    guardarLikes(set);
    $$('[data-like]').forEach((x) => {
      if (codigo(x.dataset.like) !== id) return;
      x.setAttribute('aria-pressed', activar ? 'true' : 'false');
      x.setAttribute('aria-label', activar ? 'Quitar me gusta' : 'Me gusta');
      if (activar) { x.classList.remove('latido'); void x.offsetWidth; x.classList.add('latido'); }
    });
  });

  /* -------------------------------------------------------------- datos */
  let promesaPosts = null;
  function cargarPosts() {
    if (!promesaPosts) {
      promesaPosts = fetch(BASE + 'posts.json')
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then((lista) => lista
          .map((p) => ({ ...p, temas: Array.isArray(p.temas) ? p.temas : (p.temas ? [p.temas] : []), _t: new Date(p.fecha).getTime() }))
          .sort((a, b) => b._t - a._t));
      promesaPosts.catch(() => { promesaPosts = null; });
    }
    return promesaPosts;
  }

  /* -------------------------------------------------------------- tarjeta */
  function tarjeta(p, resaltar) {
    const temas = p.temas.filter((t) => TEMA[t]).map((t) =>
      `<li title="${escapar(TEMA[t].nombre)}">${icono('t-' + (TEMA[t].icono || 'generico'))}<span>${escapar(TEMA[t].nombre)}</span></li>`).join('');
    const titulo = resaltar ? resaltar(p.titulo) : escapar(p.titulo);
    const url = BASE + p.url;
    return `<div class="ranura">
  <article class="tarjeta">
    <a class="tarjeta__foto" href="${url}" tabindex="-1" aria-hidden="true">
      <img src="${BASE + escapar(p.imagen)}" alt="${escapar(p.alt)}" loading="lazy" decoding="async" width="700" height="438">
    </a>
    <div class="tarjeta__info">
      <ul class="tarjeta__temas" aria-label="Temas">${temas}</ul>
      <h3 class="tarjeta__titulo"><a href="${url}">${titulo}</a></h3>
      <p class="tarjeta__resumen">${escapar(p.resumen)}</p>
      <div class="tarjeta__pie">
        <time class="tarjeta__fecha fecha-rel" datetime="${escapar(p.fecha)}"></time>
        <button class="like" type="button" data-like="${escapar(p.url)}" aria-pressed="false" aria-label="Me gusta">
          ${icono('i-corazon', 'like__vacio')}${icono('i-corazon-lleno', 'like__lleno')}
        </button>
      </div>
      <a class="tarjeta__leer" href="${url}" tabindex="-1" aria-hidden="true">Leer post <span class="tecla">↵</span></a>
    </div>
  </article>
</div>`;
  }

  function insertarTarjetas(contenedor, lista, resaltar) {
    const tmp = document.createElement('div');
    tmp.innerHTML = lista.map((p) => tarjeta(p, resaltar)).join('');
    const nuevos = Array.from(tmp.children);
    nuevos.forEach((n, i) => { n.style.animationDelay = (i * 60) + 'ms'; contenedor.appendChild(n); });
    pintarFechas(contenedor);
    sincronizarLikes(contenedor);
    if (TACTIL) nuevos.forEach((n) => observadorFoco && observadorFoco.observe(n.querySelector('.tarjeta')));
  }

  // En pantallas táctiles, la foto se colorea cuando la tarjeta pasa por el centro
  const observadorFoco = TACTIL && 'IntersectionObserver' in window
    ? new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('en-foco', e.isIntersecting)), { rootMargin: '-35% 0px -35% 0px' })
    : null;

  /* -------------------------------------------------------------- carrusel */
  function carrusel() {
    const raiz = $('#carrusel');
    if (!raiz) return;
    const slides = $$('.slide', raiz);
    const puntos = $$('.carrusel__punto', raiz);
    const botonPausa = $('[data-carrusel="pausa"]', raiz);
    if (slides.length < 2) { $('.carrusel__controles', raiz).hidden = true; return; }

    let actual = 0;
    let temporizador = null;
    let pausadoUsuario = POCO_MOVIMIENTO; // con "reducir movimiento" no avanza solo
    let pausadoHover = false;
    raiz.style.setProperty('--dur', SEG_CARRUSEL + 's');
    if (POCO_MOVIMIENTO) { raiz.classList.add('quieto'); botonPausa.setAttribute('aria-pressed', 'true'); botonPausa.setAttribute('aria-label', 'Reanudar el carrusel'); }

    function ir(i) {
      actual = (i + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === actual;
        s.classList.toggle('activo', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        $$('a', s).forEach((a) => {
          if (a.classList.contains('slide__foto') || a.classList.contains('slide__leer')) return;
          on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1');
        });
      });
      puntos.forEach((p, k) => {
        p.classList.toggle('activo', k === actual);
        k === actual ? p.setAttribute('aria-current', 'true') : p.removeAttribute('aria-current');
        if (k === actual) { p.classList.remove('activo'); void p.offsetWidth; p.classList.add('activo'); }
      });
      programar();
    }
    function programar() {
      clearTimeout(temporizador);
      const quieto = pausadoUsuario || pausadoHover || document.hidden;
      raiz.classList.toggle('pausado', quieto);
      if (!quieto) temporizador = setTimeout(() => ir(actual + 1), SEG_CARRUSEL * 1000);
    }

    raiz.addEventListener('click', (e) => {
      const b = e.target.closest('[data-carrusel], [data-ir]');
      if (!b) return;
      if (b.dataset.ir != null) ir(+b.dataset.ir);
      else if (b.dataset.carrusel === 'anterior') ir(actual - 1);
      else if (b.dataset.carrusel === 'siguiente') ir(actual + 1);
      else if (b.dataset.carrusel === 'pausa') {
        pausadoUsuario = !pausadoUsuario;
        raiz.classList.toggle('quieto', pausadoUsuario);
        b.setAttribute('aria-pressed', pausadoUsuario ? 'true' : 'false');
        b.setAttribute('aria-label', pausadoUsuario ? 'Reanudar el carrusel' : 'Pausar el carrusel');
        programar();
      }
    });
    raiz.addEventListener('mouseenter', () => { pausadoHover = true; programar(); });
    raiz.addEventListener('mouseleave', () => { pausadoHover = false; ir(actual); });
    raiz.addEventListener('focusin', () => { pausadoHover = true; programar(); });
    raiz.addEventListener('focusout', (e) => { if (!raiz.contains(e.relatedTarget)) { pausadoHover = false; programar(); } });
    document.addEventListener('visibilitychange', programar);

    // deslizar con el dedo
    let x0 = null;
    raiz.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    raiz.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) ir(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    ir(0);
  }

  /* -------------------------------------------------------------- feed + filtros */
  const CLAVE_ESTADO = 'tg_feed';

  function feed() {
    const cont = $('#feed');
    if (!cont) return;
    const estado = $('#feed-estado');
    const centinela = $('#feed-centinela');
    const nombre = $('#filtro-nombre');
    const conteo = $('#filtro-conteo');
    const botones = $$('.filtro');

    let todos = [];
    let lista = [];
    let mostrados = 0;
    let tema = new URLSearchParams(location.search).get('tema') || '';
    if (tema && !TEMA[tema]) tema = '';

    // ¿Volvemos de un post? Recupera filtro, cantidad y posición
    let guardado = null;
    try { guardado = JSON.parse(sessionStorage.getItem(CLAVE_ESTADO) || 'null'); } catch (e) { /* sin almacenamiento */ }
    const volviendo = guardado && performance.getEntriesByType && (performance.getEntriesByType('navigation')[0] || {}).type === 'back_forward';
    if (volviendo && !new URLSearchParams(location.search).get('tema')) tema = guardado.tema || '';

    function nombreTema(t) { return t ? TEMA[t].nombre : 'Recientes'; }

    function marcarBotones() {
      botones.forEach((b) => {
        const on = b.dataset.tema === tema;
        b.classList.toggle('activo', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      nombre.textContent = nombreTema(tema);
    }

    function mas() {
      const lote = lista.slice(mostrados, mostrados + POR_CARGA);
      if (lote.length) insertarTarjetas(cont, lote);
      mostrados += lote.length;
      actualizarEstado();
    }

    function actualizarEstado() {
      estado.classList.remove('cargando');
      if (!lista.length) estado.textContent = 'Aún no hay posts sobre este tema. Pronto.';
      else if (mostrados >= lista.length) estado.textContent = lista.length > POR_CARGA ? '— Llegaste al final de la alforja —' : '';
      else estado.textContent = '';
    }

    function aplicar(nuevo, desdeUsuario) {
      tema = nuevo;
      lista = tema ? todos.filter((p) => p.temas.includes(tema)) : todos.slice();
      cont.innerHTML = '';
      mostrados = 0;
      marcarBotones();
      conteo.textContent = `${lista.length} ${lista.length === 1 ? 'post' : 'posts'}`;
      mas();
      if (desdeUsuario) {
        const url = new URL(location.href);
        tema ? url.searchParams.set('tema', tema) : url.searchParams.delete('tema');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    }

    $('#filtros').addEventListener('click', (e) => {
      const b = e.target.closest('.filtro');
      if (b) { aplicar(b.dataset.tema, true); return; }
      const paso = e.target.closest('[data-paso]');
      if (paso) mover(+paso.dataset.paso);
    });
    function mover(d) {
      const orden = botones.map((b) => b.dataset.tema);
      const i = orden.indexOf(tema);
      const nuevo = orden[(i + d + orden.length) % orden.length];
      aplicar(nuevo, true);
      const b = botones.find((x) => x.dataset.tema === nuevo);
      if (b) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: POCO_MOVIMIENTO ? 'auto' : 'smooth' });
    }
    // Vista previa del nombre al pasar por encima de un icono
    botones.forEach((b) => {
      b.addEventListener('mouseenter', () => { nombre.textContent = b.dataset.nombre; });
      b.addEventListener('mouseleave', () => { nombre.textContent = nombreTema(tema); });
    });
    // Q / E cambian de tema (como los gatillos del mando)
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'q') mover(-1);
      if (k === 'e') mover(1);
    });

    // Guarda estado al salir hacia un post
    window.addEventListener('pagehide', () => {
      try { sessionStorage.setItem(CLAVE_ESTADO, JSON.stringify({ tema, mostrados, y: window.scrollY })); } catch (e) { /* nada */ }
    });

    estado.textContent = 'Cargando posts';
    estado.classList.add('cargando');
    cargarPosts().then((ps) => {
      todos = ps;
      aplicar(tema, false);
      if (volviendo && guardado) {
        while (mostrados < Math.min(guardado.mostrados, lista.length)) mas();
        requestAnimationFrame(() => window.scrollTo(0, guardado.y || 0));
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((es) => {
          if (es[0].isIntersecting && mostrados < lista.length) mas();
        }, { rootMargin: '600px 0px' }).observe(centinela);
      } else {
        estado.innerHTML = '<button class="boton" type="button">Cargar más</button>';
        estado.addEventListener('click', mas);
      }
    }).catch(() => {
      estado.classList.remove('cargando');
      estado.textContent = 'No pudimos cargar los posts. Revisa tu conexión y recarga la página.';
    });
  }

  /* -------------------------------------------------------------- búsqueda */
  function buscarEn(posts, consulta) {
    const terminos = normalizar(consulta).split(/\s+/).filter((t) => t.length > 1);
    if (!terminos.length) return [];
    return posts.map((p) => {
      const ti = normalizar(p.titulo), re = normalizar(p.resumen), tx = normalizar(p.texto);
      const te = normalizar(p.temas.map((t) => (TEMA[t] || {}).nombre || t).join(' '));
      let puntos = 0;
      for (const t of terminos) {
        const enTitulo = ti.includes(t), enResumen = re.includes(t), enTema = te.includes(t), enTexto = tx.includes(t);
        if (!enTitulo && !enResumen && !enTema && !enTexto) return null;
        puntos += (enTitulo ? 6 : 0) + (enTema ? 4 : 0) + (enResumen ? 3 : 0) + (enTexto ? 1 : 0);
      }
      return { p, puntos };
    }).filter(Boolean).sort((a, b) => b.puntos - a.puntos || b.p._t - a.p._t).map((x) => x.p);
  }

  function resaltador(consulta) {
    const terminos = normalizar(consulta).split(/\s+/).filter((t) => t.length > 1);
    return (texto) => {
      const original = String(texto);
      const norm = normalizar(original);
      const marcas = new Array(original.length).fill(false);
      terminos.forEach((t) => {
        let i = norm.indexOf(t);
        while (i !== -1) { for (let k = i; k < i + t.length; k++) marcas[k] = true; i = norm.indexOf(t, i + t.length); }
      });
      let out = '', abierto = false;
      for (let i = 0; i < original.length; i++) {
        if (marcas[i] && !abierto) { out += '<mark>'; abierto = true; }
        if (!marcas[i] && abierto) { out += '</mark>'; abierto = false; }
        out += escapar(original[i]);
      }
      return out + (abierto ? '</mark>' : '');
    };
  }

  function buscadorCabecera() {
    const form = $('#buscador');
    if (!form) return;
    const input = $('#buscador-q');
    const caja = $('#buscador-resultados');
    const cabecera = $('#cabecera');
    const lupa = $('#abrir-buscador');
    let activa = -1;
    let espera = null;

    lupa && lupa.addEventListener('click', () => {
      const abrir = !cabecera.classList.contains('buscando');
      cabecera.classList.toggle('buscando', abrir);
      lupa.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      if (abrir) input.focus();
    });

    function cerrar() { caja.hidden = true; activa = -1; }
    function pintar(consulta) {
      if (normalizar(consulta).trim().length < 2) { cerrar(); return; }
      cargarPosts().then((ps) => {
        const res = buscarEn(ps, consulta);
        const marcar = resaltador(consulta);
        const enlace = `${BASE}buscar/?q=${encodeURIComponent(consulta)}`;
        caja.innerHTML = res.length
          ? res.slice(0, 6).map((p) => `<a class="sugerencia" role="option" href="${BASE + p.url}">
              <img src="${BASE + escapar(p.imagen)}" alt="" loading="lazy">
              <span><strong>${marcar(p.titulo)}</strong><small><time class="fecha-rel" datetime="${escapar(p.fecha)}"></time></small></span></a>`).join('') +
            `<a class="sugerencias__todas" href="${enlace}">Ver todos los resultados (${res.length})</a>`
          : '<p class="sugerencias__nada">Nada por aquí con esa palabra.</p>';
        pintarFechas(caja);
        caja.hidden = false;
        activa = -1;
      }).catch(() => {});
    }
    input.addEventListener('input', () => { clearTimeout(espera); espera = setTimeout(() => pintar(input.value), 140); });
    input.addEventListener('focus', () => { if (input.value) pintar(input.value); cargarPosts().catch(() => {}); });
    input.addEventListener('keydown', (e) => {
      const items = $$('a', caja);
      if (e.key === 'Escape') { cerrar(); return; }
      if (caja.hidden || !items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        activa = (activa + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle('activa', i === activa));
        items[activa].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && activa >= 0) {
        e.preventDefault();
        location.href = items[activa].href;
      }
    });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) cerrar(); });
  }

  function paginaBusqueda() {
    const res = $('#busqueda-resultados');
    if (!res) return;
    const input = $('#busqueda-q');
    const resumen = $('#busqueda-resumen');
    const q = new URLSearchParams(location.search).get('q') || '';
    input.value = q;
    if (!q.trim()) { resumen.textContent = 'Busca por título, resumen, tema o cualquier palabra del texto.'; input.focus(); return; }
    resumen.textContent = 'Buscando…';
    cargarPosts().then((ps) => {
      const lista = buscarEn(ps, q);
      resumen.textContent = lista.length
        ? `${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'} para «${q}»`
        : `Nada para «${q}». Prueba con otra palabra o explora por temas en la portada.`;
      insertarTarjetas(res, lista, resaltador(q));
    }).catch(() => { resumen.textContent = 'No pudimos cargar los posts. Revisa tu conexión.'; });
  }

  /* -------------------------------------------------------------- post */
  function post() {
    const art = $('#articulo');
    if (!art) return;

    // Volver: si vienes de este sitio, regresa exactamente a donde estabas
    const volver = $('#volver');
    const desdeSitio = document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
    function regresar(e) {
      if (desdeSitio) { e && e.preventDefault(); history.back(); }
      else if (!e) location.href = volver.href;
    }
    volver.addEventListener('click', regresar);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !e.target.closest('input, textarea')) regresar();
    });

    // Barra de progreso de lectura
    const barra = $('#progreso-barra');
    const papel = $('.papel', art);
    function progreso() {
      const r = papel.getBoundingClientRect();
      const total = r.height - window.innerHeight * .6;
      const hecho = Math.min(1, Math.max(0, -r.top / (total || 1)));
      barra.style.transform = `scaleX(${hecho})`;
    }
    window.addEventListener('scroll', progreso, { passive: true });
    progreso();

    // Compartir
    const url = location.href.split('#')[0].split('?')[0];
    const titulo = $('.articulo__titulo').textContent.trim();
    const t = encodeURIComponent(titulo), u = encodeURIComponent(url);
    const destinos = {
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      x: `https://x.com/intent/tweet?text=${t}&url=${u}`,
      threads: `https://www.threads.com/intent/post?text=${t}%20${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    };
    $$('[data-compartir]').forEach((el) => {
      const red = el.dataset.compartir;
      if (destinos[red]) el.href = destinos[red];
      if (red === 'nativo' && navigator.share) {
        el.hidden = false;
        el.addEventListener('click', () => navigator.share({ title: titulo, url }).catch(() => {}));
      }
      if (red === 'copiar') {
        el.addEventListener('click', () => {
          const listo = () => { tostada('Enlace copiado'); el.classList.add('copiado'); setTimeout(() => el.classList.remove('copiado'), 1500); };
          if (navigator.clipboard) navigator.clipboard.writeText(url).then(listo).catch(() => prompt('Copia el enlace:', url));
          else prompt('Copia el enlace:', url);
        });
      }
    });

    // Relacionados: comparten más temas, y entre ellos, los más recientes
    const misTemas = (art.dataset.temas || '').split(',').filter(Boolean);
    const miUrl = art.dataset.url;
    cargarPosts().then((ps) => {
      const rel = ps.filter((p) => p.url !== miUrl)
        .map((p) => ({ p, n: p.temas.filter((x) => misTemas.includes(x)).length }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n || b.p._t - a.p._t)
        .slice(0, 3).map((x) => x.p);
      if (rel.length) {
        insertarTarjetas($('#relacionados'), rel);
        $('#relacionados-bloque').hidden = false;
      }
    }).catch(() => {});
  }

  function tostada(texto) {
    const t = document.createElement('div');
    t.className = 'tostada';
    t.setAttribute('role', 'status');
    t.textContent = texto;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  /* -------------------------------------------------------------- cabecera */
  function cabeceraCompacta() {
    const c = $('#cabecera');
    if (!c) return;
    let antes = false;
    const revisar = () => {
      const ahora = window.scrollY > 60;
      if (ahora !== antes) { c.classList.toggle('compacta', ahora); antes = ahora; }
    };
    window.addEventListener('scroll', revisar, { passive: true });
    revisar();
  }

  /* -------------------------------------------------------------- PWA */
  function pwa() {
    if (meta('tg-vista-previa')) return;
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => navigator.serviceWorker.register(BASE + 'sw.js', { scope: BASE }).catch(() => {}));
    }
    const boton = $('#instalar-app');
    let aviso = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      aviso = e;
      if (boton) boton.hidden = false;
    });
    boton && boton.addEventListener('click', async () => {
      if (!aviso) return;
      aviso.prompt();
      await aviso.userChoice.catch(() => {});
      aviso = null;
      boton.hidden = true;
    });
    window.addEventListener('appinstalled', () => { if (boton) boton.hidden = true; });
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone;
    if (ios && $('#ayuda-ios')) $('#ayuda-ios').hidden = false;
  }

  /* ------------------------------------------- botones "copiar" (página RSS) */
  function botonesCopiar() {
    $$('[data-copiar]').forEach((b) => {
      b.addEventListener('click', () => {
        const texto = b.dataset.copiar;
        if (navigator.clipboard) navigator.clipboard.writeText(texto).then(() => tostada('Dirección copiada')).catch(() => prompt('Copia la dirección:', texto));
        else prompt('Copia la dirección:', texto);
      });
    });
  }

  /* -------------------------------------------------------------- arranque */
  function iniciar() {
    pintarFechas();
    setInterval(() => pintarFechas(), 60 * 1000);
    sincronizarLikes();
    avisoCookies();
    cabeceraCompacta();
    carrusel();
    feed();
    buscadorCabecera();
    paginaBusqueda();
    post();
    pwa();
    botonesCopiar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  // Al volver con el botón "atrás" desde la caché del navegador, refresca likes y fechas
  window.addEventListener('pageshow', (e) => { if (e.persisted) { sincronizarLikes(); pintarFechas(); } });
})();
