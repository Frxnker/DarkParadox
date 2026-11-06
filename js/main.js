/* ==========================================================================
   DARK PARADOX STUDIOS · LÓGICA DE LA WEB

   Todas las páginas cargan este mismo archivo. Cada función comprueba primero
   si los elementos que necesita existen en la página actual; si no, no hace nada.
   Las funciones se ponen en marcha al final del archivo.

   Se carga como <script defer> normal, no como módulo ES: así la web también
   funciona abriendo los HTML con doble clic, sin servidor.
   ========================================================================== */
"use strict";


/* --------------------------------------------------------------------------
   DATOS Y AYUDANTES
   -------------------------------------------------------------------------- */

// ¿Ha pedido la persona menos animaciones en su sistema?
const MOVIMIENTO_REDUCIDO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Si data.js tiene un error (por ejemplo, una coma olvidada), SHORTS no existirá.
// Con estas comprobaciones, el menú y el resto de la web siguen funcionando.
const LISTA_CORTOS = typeof SHORTS !== "undefined" ? SHORTS : [];
const DATOS_CONTACTO = typeof CONTACTO !== "undefined" ? CONTACTO : {};

// Evita que un carácter como < o " de los datos rompa el HTML que generamos
function escaparHTML(texto) {
  const caja = document.createElement("div");
  caja.textContent = String(texto);
  return caja.innerHTML.replace(/"/g, "&quot;");
}

// Devuelve los cortos del más reciente al más antiguo, sin alterar el array original
function cortosPorFecha() {
  return [...LISTA_CORTOS].sort((a, b) => b.anio - a.anio);
}

function urlDelCorto(corto) {
  return `./corto.html?id=${encodeURIComponent(corto.slug)}`;
}

// Saca el identificador de un enlace de YouTube, sea del formato que sea:
// watch?v=, youtu.be/, embed/ o shorts/. Devuelve null si no lo encuentra.
function idDeYoutube(url) {
  const coincidencia = String(url).match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return coincidencia ? coincidencia[1] : null;
}

// El reparto puede venir como lista o como texto suelto: aceptamos los dos
function textoReparto(reparto) {
  return [].concat(reparto).join(", ");
}

// Etiquetas visibles para los cortos marcados con "ejemplo: true" en data.js.
// La corta va sobre el póster; la larga, junto al título.
function etiquetaEjemplo(corto) {
  return corto.ejemplo ? '<span class="etiqueta-ejemplo">Ejemplo</span>' : "";
}

function avisoEjemplo(corto) {
  return corto.ejemplo
    ? '<p class="corto__aviso-ejemplo"><span class="etiqueta-ejemplo">Contenido de ejemplo</span></p>'
    : "";
}


/* --------------------------------------------------------------------------
   CABECERA Y MENÚ
   -------------------------------------------------------------------------- */

function iniciarMenu() {
  const boton = document.querySelector(".menu-boton");
  const menu = document.getElementById("menu-principal");
  if (!boton || !menu) return;

  // Mientras el menú está abierto, el contenido de detrás queda inactivo (inert)
  // y el tabulador no se escapa a él.
  const contenidoDeFondo = document.querySelectorAll("main, .pie");

  function cambiarMenu(abrir) {
    boton.setAttribute("aria-expanded", String(abrir));
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("abierto", abrir);
    document.documentElement.classList.toggle("sin-scroll", abrir);
    contenidoDeFondo.forEach((elemento) => {
      elemento.inert = abrir;
    });
  }

  boton.addEventListener("click", () => {
    cambiarMenu(boton.getAttribute("aria-expanded") !== "true");
  });

  // Se cierra al elegir una página…
  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) cambiarMenu(false);
  });

  // …al pulsar Escape, devolviendo el foco al botón…
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("abierto")) {
      cambiarMenu(false);
      boton.focus();
    }
  });

  // …y si la pantalla crece hasta el diseño de escritorio (por ejemplo, al girar la tablet)
  window.matchMedia("(min-width: 48rem)").addEventListener("change", (evento) => {
    if (evento.matches) cambiarMenu(false);
  });
}

// La cabecera gana un fondo sólido en cuanto se baja un poco
function iniciarFondoCabecera() {
  const cabecera = document.querySelector(".cabecera");
  if (!cabecera) return;

  const actualizar = () => cabecera.classList.toggle("con-fondo", window.scrollY > 24);
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
}


/* --------------------------------------------------------------------------
   DATOS DE CONTACTO
   Rellena los enlaces de todas las páginas a partir de CONTACTO (data.js).
   -------------------------------------------------------------------------- */

function iniciarContacto() {
  const { email, whatsapp, ciudad } = DATOS_CONTACTO;

  const enlaces = {
    email: email ? `mailto:${email}` : "",
    whatsapp: whatsapp ? `https://wa.me/${String(whatsapp).replace(/\D/g, "")}` : "",
  };

  // Los enlaces vienen ocultos en el HTML y solo aparecen si hay dato
  document.querySelectorAll("[data-contacto]").forEach((enlace) => {
    const url = enlaces[enlace.dataset.contacto];
    if (!url) return;
    enlace.href = url;
    enlace.hidden = false;
  });

  // En contacto.html el email también se muestra escrito
  document.querySelectorAll("[data-valor-email]").forEach((elemento) => {
    if (email) elemento.textContent = email;
  });

  document.querySelectorAll("[data-ciudad]").forEach((elemento) => {
    if (!ciudad) return;
    elemento.textContent = ciudad;
    elemento.hidden = false;
  });

  // Avisos de "pendiente" de contacto.html: solo se ven si falta el dato
  const datos = { email, whatsapp, ciudad };
  document.querySelectorAll("[data-pendiente]").forEach((aviso) => {
    aviso.hidden = Boolean(datos[aviso.dataset.pendiente]);
  });

  // Año actual en el pie
  document.querySelectorAll("[data-anio]").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
  });
}

// Mientras el action del formulario tenga el texto de muestra, Formspree no puede
// recibir nada: avisamos en lugar de mandar a la persona a una página de error.
function iniciarFormulario() {
  const formulario = document.getElementById("formulario-contacto");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    if (!formulario.getAttribute("action").includes("TU_ID_DE_FORMSPREE")) return;
    evento.preventDefault();
    document.getElementById("formulario-aviso").hidden = false;
  });
}


/* --------------------------------------------------------------------------
   INICIO
   -------------------------------------------------------------------------- */

// El vídeo no lleva el atributo autoplay a propósito: solo arranca desde aquí, y
// no lo hace si se pidió menos movimiento o ahorro de datos. En esos casos, o si
// el navegador lo bloquea, simplemente se queda la imagen del atributo poster.
function iniciarVideoHero() {
  const video = document.querySelector(".hero__video");
  if (!video || !video.querySelector("source")) return;

  const ahorroDeDatos = navigator.connection && navigator.connection.saveData;
  if (MOVIMIENTO_REDUCIDO || ahorroDeDatos) return;

  video.play().catch(() => {});
}

function pintarDestacado() {
  const caja = document.getElementById("destacado");
  if (!caja) return;

  const corto = cortosPorFecha()[0];
  if (!corto) {
    caja.closest("section").hidden = true;
    return;
  }

  const url = urlDelCorto(corto);
  const titulo = escaparHTML(corto.titulo);

  caja.innerHTML = `
    <a class="destacado__poster-enlace aparece" href="${url}">
      <img class="destacado__poster" src="${escaparHTML(corto.poster)}"
           alt="Póster de «${titulo}»" width="800" height="1200" loading="lazy">
    </a>
    <div class="aparece">
      <p class="ficha-texto">Último corto · ${escaparHTML(corto.anio)} · ${escaparHTML(corto.duracion)}</p>
      <h2>${titulo}</h2>
      ${avisoEjemplo(corto)}
      <p class="corto__sinopsis">${escaparHTML(corto.sinopsis)}</p>
      <div class="destacado__acciones">
        <a class="boton boton--secundario" href="${url}">Ver ficha del corto</a>
      </div>
    </div>
  `;

  // El botón del hero lleva al tráiler del último corto. Si aún no tiene, a su ficha.
  const botonHero = document.getElementById("hero-trailer");
  if (botonHero) {
    botonHero.href = corto.trailerUrl ? `${url}#trailer` : url;
    botonHero.textContent = corto.trailerUrl ? "Ver tráiler" : "Ver último corto";
  }
}


/* --------------------------------------------------------------------------
   LISTADO DE CORTOS
   -------------------------------------------------------------------------- */

function pintarListado() {
  const lista = document.getElementById("lista-cortos");
  if (!lista) return;

  const cortos = cortosPorFecha();

  if (cortos.length === 0) {
    lista.outerHTML = `
      <p class="texto-secundario">La sala está vacía. Vuelve más tarde; quizá ya no lo esté.</p>
    `;
    return;
  }

  lista.innerHTML = cortos
    .map((corto) => {
      const titulo = escaparHTML(corto.titulo);
      return `
        <li class="tarjeta aparece">
          <a class="tarjeta__enlace" href="${urlDelCorto(corto)}">
            <img class="tarjeta__poster" src="${escaparHTML(corto.poster)}"
                 alt="Póster de «${titulo}»" width="800" height="1200" loading="lazy">
            <div class="tarjeta__velo">
              <h2 class="tarjeta__titulo">${titulo}</h2>
              <p class="tarjeta__datos">${escaparHTML(corto.anio)} · ${escaparHTML(corto.duracion)}</p>
              <span class="tarjeta__accion" aria-hidden="true">Ver corto →</span>
            </div>
            ${etiquetaEjemplo(corto)}
          </a>
        </li>
      `;
    })
    .join("");

  iniciarTarjetasTactiles(lista);
}

// En una pantalla táctil no hay "pasar el ratón". El primer toque muestra los datos
// del póster y el segundo entra en el corto. Si prefieres que un solo toque entre
// directamente, basta con borrar esta función y la línea que la llama.
function iniciarTarjetasTactiles(lista) {
  let ultimoPuntero = "";

  const quitarActiva = () => {
    lista.querySelectorAll(".tarjeta.activa").forEach((tarjeta) => {
      tarjeta.classList.remove("activa");
    });
  };

  lista.addEventListener("pointerdown", (evento) => {
    ultimoPuntero = evento.pointerType;
  });

  lista.addEventListener("click", (evento) => {
    const enlace = evento.target.closest(".tarjeta__enlace");
    const venimosDeToque = ultimoPuntero === "touch";
    ultimoPuntero = "";

    if (!enlace || !venimosDeToque) return;

    const tarjeta = enlace.closest(".tarjeta");
    if (tarjeta.classList.contains("activa")) return; // Segundo toque: se sigue el enlace

    evento.preventDefault();
    quitarActiva();
    tarjeta.classList.add("activa");
  });

  // Tocar fuera de los pósters vuelve a ocultar los datos
  document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".tarjeta")) quitarActiva();
  });
}


/* --------------------------------------------------------------------------
   DETALLE DE CORTO
   -------------------------------------------------------------------------- */

function pintarDetalle() {
  const caja = document.getElementById("detalle-corto");
  if (!caja) return;

  // Lee el ?id=slug de la URL y busca ese corto en data.js
  const id = new URLSearchParams(window.location.search).get("id");
  const corto = LISTA_CORTOS.find((elemento) => elemento.slug === id);

  if (!corto) {
    pintarCortoNoEncontrado(caja);
    return;
  }

  const titulo = escaparHTML(corto.titulo);

  // Título y descripción de la pestaña, adaptados a este corto
  document.title = `${corto.titulo} · Dark Paradox Studios`;
  document.querySelector('meta[name="description"]').setAttribute("content", corto.sinopsis);

  caja.innerHTML = `
    <article class="corto contenedor">
      <a class="enlace corto__volver" href="./cortos.html">← Todos los cortos</a>

      <div class="corto__portada">
        <img class="corto__poster aparece" src="${escaparHTML(corto.poster)}"
             alt="Póster de «${titulo}»" width="800" height="1200" loading="lazy">
        <div class="aparece">
          <p class="ficha-texto">${escaparHTML(corto.anio)} · ${escaparHTML(corto.duracion)}</p>
          <h1>${titulo}</h1>
          ${avisoEjemplo(corto)}
          <p class="corto__sinopsis">${escaparHTML(corto.sinopsis)}</p>
        </div>
      </div>

      <section class="corto__bloque aparece" id="trailer">
        <h2>Tráiler</h2>
        ${htmlDelTrailer(corto)}
      </section>

      <section class="corto__bloque aparece">
        <h2>Ficha técnica</h2>
        <dl class="ficha-tecnica">
          ${filaFicha("Dirección", corto.direccion)}
          ${filaFicha("Guion", corto.guion)}
          ${filaFicha("Reparto", textoReparto(corto.reparto))}
          ${filaFicha("Duración", corto.duracion)}
          ${filaFicha("Año", corto.anio)}
        </dl>
      </section>

      ${htmlDeLaGaleria(corto)}
      ${htmlDeFestivales(corto)}
    </article>
  `;

  iniciarLightbox(corto);

  // El contenido se acaba de crear, así que el navegador no ha podido saltar por sí
  // solo a #trailer (el botón "Ver tráiler" del inicio enlaza ahí).
  if (window.location.hash === "#trailer") {
    document.getElementById("trailer").scrollIntoView();
  }
}

function filaFicha(nombre, valor) {
  return `
    <div class="ficha-tecnica__fila">
      <dt>${nombre}</dt>
      <dd>${escaparHTML(valor)}</dd>
    </div>
  `;
}

// iframe de youtube-nocookie. La referrerpolicy es necesaria: sin ella, YouTube
// puede negarse a reproducir el vídeo.
function htmlDelTrailer(corto) {
  const id = idDeYoutube(corto.trailerUrl);

  if (!id) {
    return '<p class="trailer-pendiente">El tráiler todavía no ha salido a la luz.</p>';
  }

  return `
    <iframe class="video-16-9"
            src="https://www.youtube-nocookie.com/embed/${id}?rel=0"
            title="Tráiler de «${escaparHTML(corto.titulo)}»"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
  `;
}

function htmlDeLaGaleria(corto) {
  if (!corto.fotogramas || corto.fotogramas.length === 0) return "";

  const titulo = escaparHTML(corto.titulo);
  const miniaturas = corto.fotogramas
    .map((ruta, indice) => `
      <li>
        <button class="galeria__miniatura" type="button" data-indice="${indice}"
                aria-label="Ampliar el fotograma ${indice + 1} de «${titulo}»">
          <img src="${escaparHTML(ruta)}" alt="Fotograma ${indice + 1} de «${titulo}»"
               width="1280" height="720" loading="lazy">
        </button>
      </li>
    `)
    .join("");

  return `
    <section class="corto__bloque aparece">
      <h2>Fotogramas</h2>
      <ul class="galeria" id="galeria">${miniaturas}</ul>
    </section>
  `;
}

function htmlDeFestivales(corto) {
  if (!corto.festivales || corto.festivales.length === 0) return "";

  const filas = corto.festivales.map((festival) => `<li>${escaparHTML(festival)}</li>`).join("");

  return `
    <section class="corto__bloque aparece">
      <h2>Festivales</h2>
      <ul class="lista-festivales">${filas}</ul>
    </section>
  `;
}

function pintarCortoNoEncontrado(caja) {
  document.title = "Corto no encontrado · Dark Paradox Studios";
  caja.innerHTML = `
    <div class="mensaje-tematico contenedor">
      <p class="ficha-texto">Archivo no encontrado</p>
      <h1>Este corto nunca se rodó.</h1>
      <p class="texto-ancho texto-secundario">
        O eso dice el archivo. No hay ninguna cinta con esa etiqueta en el estante.
        Mejor no sigas buscándola.
      </p>
      <div class="mensaje-tematico__acciones">
        <a class="boton" href="./cortos.html">Ver los cortos que sí existen</a>
      </div>
    </div>
  `;
}


/* --------------------------------------------------------------------------
   LIGHTBOX (galería ampliada, hecha a mano con <dialog>)
   -------------------------------------------------------------------------- */

function iniciarLightbox(corto) {
  const galeria = document.getElementById("galeria");
  if (!galeria) return;

  const fotogramas = corto.fotogramas;
  let actual = 0;

  const dialogo = document.createElement("dialog");
  dialogo.className = "lightbox";
  dialogo.setAttribute("aria-label", `Fotogramas de ${corto.titulo}`);
  dialogo.innerHTML = `
    <div class="lightbox__barra">
      <button class="lightbox__boton" type="button" data-accion="cerrar" aria-label="Cerrar" autofocus>×</button>
    </div>
    <figure class="lightbox__figura">
      <img alt="" draggable="false">
    </figure>
    <div class="lightbox__controles">
      <button class="lightbox__boton" type="button" data-accion="anterior" aria-label="Fotograma anterior">←</button>
      <span class="lightbox__contador" aria-live="polite"></span>
      <button class="lightbox__boton" type="button" data-accion="siguiente" aria-label="Fotograma siguiente">→</button>
    </div>
  `;
  document.body.append(dialogo);

  const imagen = dialogo.querySelector("img");
  const contador = dialogo.querySelector(".lightbox__contador");
  const figura = dialogo.querySelector(".lightbox__figura");

  function mostrar(indice) {
    // El resto (%) hace que después del último se vuelva al primero, y al revés
    actual = (indice + fotogramas.length) % fotogramas.length;
    imagen.src = fotogramas[actual];
    imagen.alt = `Fotograma ${actual + 1} de ${corto.titulo}`;
    contador.textContent = `${actual + 1} / ${fotogramas.length}`;
  }

  // Abrir al pulsar una miniatura
  galeria.addEventListener("click", (evento) => {
    const miniatura = evento.target.closest("[data-indice]");
    if (!miniatura) return;
    mostrar(Number(miniatura.dataset.indice));
    dialogo.showModal();
    document.documentElement.classList.add("sin-scroll");
  });

  dialogo.addEventListener("close", () => {
    document.documentElement.classList.remove("sin-scroll");
  });

  // Botones. Un clic en el propio diálogo (zona vacía alrededor) también cierra.
  dialogo.addEventListener("click", (evento) => {
    const accion = evento.target.closest("[data-accion]")?.dataset.accion;
    if (accion === "cerrar" || evento.target === dialogo) dialogo.close();
    if (accion === "anterior") mostrar(actual - 1);
    if (accion === "siguiente") mostrar(actual + 1);
  });

  // Flechas del teclado. Escape ya lo gestiona <dialog>.
  dialogo.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") mostrar(actual - 1);
    if (evento.key === "ArrowRight") mostrar(actual + 1);
  });

  // Deslizar el dedo a los lados para cambiar de fotograma
  let inicioX = null;
  figura.addEventListener("pointerdown", (evento) => {
    inicioX = evento.clientX;
  });
  figura.addEventListener("pointercancel", () => {
    inicioX = null;
  });
  figura.addEventListener("pointerup", (evento) => {
    if (inicioX === null) return;
    const recorrido = evento.clientX - inicioX;
    inicioX = null;
    if (Math.abs(recorrido) > 50) mostrar(actual + (recorrido < 0 ? 1 : -1));
  });
}


/* --------------------------------------------------------------------------
   PRÓXIMAMENTE
   -------------------------------------------------------------------------- */

// Las líneas del teaser aparecen una a una
function iniciarTeaser() {
  const lineas = document.querySelectorAll(".teaser__linea");

  lineas.forEach((linea, indice) => {
    const espera = MOVIMIENTO_REDUCIDO ? 0 : 500 + indice * 1800;
    setTimeout(() => linea.classList.add("visible"), espera);
  });
}

// La fecha se cambia en proximamente.html (atributo data-fecha).
// Para quitar la cuenta atrás, basta con borrar ese bloque del HTML.
function iniciarCuentaAtras() {
  const caja = document.getElementById("cuenta-atras");
  if (!caja) return;

  const objetivo = new Date(caja.dataset.fecha).getTime();
  if (Number.isNaN(objetivo)) {
    caja.hidden = true;
    return;
  }

  const poner = (unidad, valor) => {
    caja.querySelector(`[data-unidad="${unidad}"]`).textContent = String(valor).padStart(2, "0");
  };

  let temporizador = null;

  function actualizar() {
    const resto = objetivo - Date.now();

    if (resto <= 0) {
      clearInterval(temporizador);
      caja.innerHTML = '<p class="ficha-texto">Ya está aquí.</p>';
      return;
    }

    const segundos = Math.floor(resto / 1000);
    poner("dias", Math.floor(segundos / 86400));
    poner("horas", Math.floor(segundos / 3600) % 24);
    poner("minutos", Math.floor(segundos / 60) % 60);
    poner("segundos", segundos % 60);
  }

  actualizar();
  temporizador = setInterval(actualizar, 1000);
}


/* --------------------------------------------------------------------------
   EFECTOS
   -------------------------------------------------------------------------- */

// Aparición de los elementos .aparece al entrar en pantalla
function iniciarApariciones() {
  const elementos = document.querySelectorAll(".aparece");

  if (MOVIMIENTO_REDUCIDO || !("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target); // Solo aparece una vez
      });
    },
    { threshold: 0.12 }
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

// Parpadeo ocasional, a intervalos irregulares de entre 12 y 30 segundos
function iniciarParpadeo() {
  if (MOVIMIENTO_REDUCIDO) return;

  const capa = document.createElement("div");
  capa.className = "parpadeo";
  capa.setAttribute("aria-hidden", "true");
  document.body.append(capa);

  // Al acabar la animación se quita la clase, para poder repetirla
  capa.addEventListener("animationend", () => capa.classList.remove("activo"));

  function programar() {
    const espera = 12000 + Math.random() * 18000;
    setTimeout(() => {
      if (!document.hidden) capa.classList.add("activo");
      programar();
    }, espera);
  }

  programar();
}

// Fundido a negro al ir a otra página de la web
function iniciarFundidos() {
  if (MOVIMIENTO_REDUCIDO) return;

  document.addEventListener("click", (evento) => {
    const enlace = evento.target.closest("a[href]");

    // Se deja actuar al navegador si ya se canceló el clic (primer toque en un póster),
    // si se quiere abrir en otra pestaña…
    if (!enlace || evento.defaultPrevented) return;
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
    if (enlace.target === "_blank" || enlace.hasAttribute("download")) return;

    // …si sale de la web (mailto:, wa.me, Instagram…) o si es un ancla de esta misma página
    if (enlace.protocol !== window.location.protocol || enlace.host !== window.location.host) return;
    const mismaPagina =
      enlace.pathname === window.location.pathname && enlace.search === window.location.search;
    if (mismaPagina && enlace.hash) return;

    evento.preventDefault();
    document.body.classList.add("saliendo");
    setTimeout(() => {
      window.location.href = enlace.href;
    }, 280);
  });

  // Al volver con el botón "atrás", algunos navegadores restauran la página tal
  // como estaba (en negro): hay que deshacer el fundido.
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("saliendo");
  });
}


/* --------------------------------------------------------------------------
   PUESTA EN MARCHA
   Primero se pinta el contenido y después los efectos, porque las apariciones
   tienen que encontrar en la página los elementos recién creados. Si una función
   falla, el error se muestra en la consola y las demás siguen ejecutándose.
   -------------------------------------------------------------------------- */
[
  iniciarMenu,
  iniciarFondoCabecera,
  iniciarContacto,
  iniciarFormulario,
  iniciarVideoHero,
  pintarDestacado,
  pintarListado,
  pintarDetalle,
  iniciarTeaser,
  iniciarCuentaAtras,
  iniciarParpadeo,
  iniciarFundidos,
  iniciarApariciones,
].forEach((iniciar) => {
  try {
    iniciar();
  } catch (error) {
    console.error(`Error en ${iniciar.name}:`, error);
  }
});
