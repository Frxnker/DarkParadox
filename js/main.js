/* ==========================================================================
   DARK PARADOX STUDIOS · LÓGICA DE LA WEB

   Todas las páginas cargan este mismo archivo. Cada función comprueba primero
   si los elementos que necesita existen en la página actual; si no, no hace nada.
   Las funciones se ponen en marcha al final del archivo.

   Se carga como <script defer> normal, no como módulo ES: así la web también
   funciona abriendo los HTML con doble clic, sin servidor.

   ÍNDICE
   1.  Datos y ayudantes
   2.  Idioma (español / inglés)
   3.  Intro de cine
   4.  Cabecera y menú
   5.  Sonido ambiente
   6.  Datos de contacto
   7.  Inicio (vídeo, linterna y último corto)
   8.  Listado de cortos y filtros
   9.  Detalle de corto (vídeo, ficha, navegación y compartir)
   10. Lightbox
   11. Prensa
   12. Próximamente (póster, aviso del inicio y cuenta atrás)
   13. Equipo
   14. Efectos
   15. Puesta en marcha
   ========================================================================== */
"use strict";


/* --------------------------------------------------------------------------
   1. DATOS Y AYUDANTES
   -------------------------------------------------------------------------- */

// ¿Ha pedido la persona menos animaciones en su sistema?
const MOVIMIENTO_REDUCIDO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Si data.js tiene un error (como una coma olvidada), SHORTS no existirá.
// Con estas comprobaciones, el menú y el resto de la web siguen funcionando.
const LISTA_CORTOS = typeof SHORTS !== "undefined" ? SHORTS : [];
const DATOS_CONTACTO = typeof CONTACTO !== "undefined" ? CONTACTO : {};
const DATOS_ESTUDIO = typeof ESTUDIO !== "undefined" ? ESTUDIO : {};
const DATOS_PROXIMO = typeof PROXIMO !== "undefined" ? PROXIMO : {};
const LISTA_EQUIPO = typeof EQUIPO !== "undefined" ? EQUIPO : [];

// Con menos cortos que este número, el listado no muestra el buscador ni los
// filtros (no hacen falta) y centra los pósters en lugar de dejar la rejilla
// a medio llenar. Ambas cosas vuelven solas al llegar a este número.
const POCOS_CORTOS = 4;

// ¿Hay algo que mostrar? Un texto vacío, una lista vacía o un { es: "", en: "" }
// cuentan como "no hay dato", y entonces su bloque no se muestra.
function hayDato(valor) {
  if (Array.isArray(valor)) return valor.some(hayDato);
  if (valor && typeof valor === "object") return Object.values(valor).some(hayDato);
  return valor !== undefined && valor !== null && String(valor).trim() !== "";
}

// Evita que un carácter como < o " de los datos rompa el HTML que generamos
function escaparHTML(texto) {
  const caja = document.createElement("div");
  caja.textContent = String(texto);
  return caja.innerHTML.replace(/"/g, "&quot;");
}

// Devuelve los cortos del más reciente al más antiguo, sin alterar el array original.
// Si dos son del mismo año, va antes el que esté antes en data.js.
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

// El reparto puede venir como lista o como texto suelto: aceptamos los dos.
// Los nombres vacíos se saltan.
function textoReparto(reparto) {
  return [].concat(reparto ?? []).map(enIdioma).filter(hayDato).join(", ");
}

// Qué se puede ver de un corto en su ficha: el corto completo (video), el
// tráiler de YouTube (trailerUrl) o nada. Si tiene los dos, manda el vídeo.
// Cada caso tiene su ancla en la ficha: #ver o #trailer.
function queSePuedeVer(corto) {
  if (hayDato(corto.video)) return "ver";
  if (idDeYoutube(corto.trailerUrl)) return "trailer";
  return "";
}

// Etiqueta "Nuevo" para el corto más reciente (en el listado y en el inicio)
function etiquetaNuevo(corto) {
  return corto === cortosPorFecha()[0] ? `<span class="etiqueta-nuevo">${t("comun.nuevo")}</span>` : "";
}

// Pasa un texto a minúsculas y le quita las tildes, para que al buscar
// "camara" se encuentre "Cámara"
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")                 // Separa cada letra de su tilde: "é" → "e" + "´"
    .replace(/[\u0300-\u036f]/g, ""); // …y borra las tildes sueltas
}

// Minutos de un corto a partir de su duración escrita: "14 min", "1 h 5 min" o "14"
function minutosDe(corto) {
  const texto = String(enIdioma(corto.duracion)).toLowerCase();
  const horas = texto.match(/(\d+)\s*h/);
  const minutos = texto.match(/(\d+)\s*m/);
  if (!horas && !minutos) return parseInt(texto, 10) || 0; // Solo un número: son minutos
  return (horas ? Number(horas[1]) * 60 : 0) + (minutos ? Number(minutos[1]) : 0);
}

// Clasifica un corto según lo que dura: corto (menos de 10 min), medio (de 10
// a 20) o largo (más de 20). Son los valores del filtro de duración.
function tipoDeDuracion(corto) {
  const minutos = minutosDe(corto);
  if (minutos < 10) return "corto";
  if (minutos <= 20) return "medio";
  return "largo";
}

// Recorta un texto largo sin partir palabras, para la meta description
function resumir(texto, maximo) {
  if (texto.length <= maximo) return texto;
  return texto.slice(0, texto.lastIndexOf(" ", maximo - 1)) + "…";
}

// Copia un texto al portapapeles. Devuelve una promesa con true si lo consigue.
async function copiarTexto(texto) {
  // La forma moderna solo funciona en páginas https o en localhost
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (error) {
      // Si falla, se prueba la forma antigua
    }
  }

  // Forma antigua: un campo de texto invisible que se selecciona y se copia.
  // Después se devuelve el foco a donde estaba, para no despistar al teclado.
  const focoAnterior = document.activeElement;
  const campo = document.createElement("textarea");
  campo.value = texto;
  campo.setAttribute("readonly", "");
  campo.className = "oculto-visual";
  document.body.append(campo);
  campo.select();
  let copiado = false;
  try {
    copiado = document.execCommand("copy");
  } catch (error) {
    copiado = false;
  }
  campo.remove();
  if (focoAnterior) focoAnterior.focus();
  return copiado;
}

// Aviso breve en la parte de abajo de la pantalla, como "Enlace copiado".
// Con role="status", los lectores de pantalla también lo leen en voz alta.
let temporizadorAviso = null;

function mostrarAviso(texto) {
  let aviso = document.querySelector(".aviso-flotante");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.className = "aviso-flotante";
    aviso.setAttribute("role", "status");
    document.body.append(aviso);
  }

  // Se vacía y se rellena un instante después: así el lector de pantalla lo
  // anuncia también la primera vez y cuando se repite el mismo texto
  aviso.textContent = "";
  setTimeout(() => {
    aviso.textContent = texto;
    aviso.classList.add("visible");
  }, 50);

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("visible"), 2600);
}


/* --------------------------------------------------------------------------
   2. IDIOMA (ESPAÑOL / INGLÉS)
   Los textos fijos de los HTML llevan atributos data-i18n con una clave del
   diccionario de js/i18n.js. Los textos de data.js pueden ser un texto normal
   o un objeto { es: "...", en: "..." }. El HTML trae el español escrito, así
   que la web se lee bien aunque falle el JavaScript.
   -------------------------------------------------------------------------- */

const IDIOMAS = ["es", "en"];
const CLAVE_IDIOMA = "dp-idioma";
const DICCIONARIOS = typeof TRADUCCIONES !== "undefined" ? TRADUCCIONES : { es: {}, en: {} };

// Atributos que se pueden traducir con data-i18n-<atributo>="clave"
const ATRIBUTOS_TRADUCIBLES = ["aria-label", "alt", "placeholder", "title", "content"];

// Idioma actual de la página: "es" o "en"
let idioma = elegirIdiomaInicial();

function guardarIdioma(valor) {
  try {
    localStorage.setItem(CLAVE_IDIOMA, valor);
  } catch (error) {
    // Si el navegador no deja guardar, simplemente no se recuerda
  }
}

// Orden de preferencia: ?lang= en la URL, el idioma guardado y el del navegador
function elegirIdiomaInicial() {
  // Un enlace con ?lang=en también cuenta como elección: se guarda para que
  // las demás páginas sigan en ese idioma
  const deLaUrl = new URLSearchParams(window.location.search).get("lang");
  if (IDIOMAS.includes(deLaUrl)) {
    guardarIdioma(deLaUrl);
    return deLaUrl;
  }

  try {
    const guardado = localStorage.getItem(CLAVE_IDIOMA);
    if (IDIOMAS.includes(guardado)) return guardado;
  } catch (error) {
    // Sin localStorage se pasa al idioma del navegador
  }

  // navigator.languages es la lista de idiomas preferidos, por orden ("de-DE",
  // "en-US"…). Se usa el primero que sea español o inglés; si no hay, español.
  const delNavegador = (navigator.languages || [navigator.language])
    .map((codigo) => String(codigo).slice(0, 2).toLowerCase())
    .find((codigo) => IDIOMAS.includes(codigo));
  return delNavegador || "es";
}

// Devuelve un texto fijo en el idioma actual (o en español si falta). Las
// palabras entre llaves se sustituyen por los datos que se pasen:
// t("corto.trailerDe", { titulo: "Maleficio" }) → "Tráiler de «Maleficio»"
function t(clave, datos = {}) {
  const texto = DICCIONARIOS[idioma]?.[clave] ?? DICCIONARIOS.es?.[clave] ?? clave;
  return texto.replace(/\{(\w+)\}/g, (marca, nombre) => datos[nombre] ?? marca);
}

// Elige el idioma de un texto de data.js. Si es un objeto { es, en }, devuelve
// el del idioma actual o, si falta, el español. Si es un texto normal, tal cual.
function enIdioma(valor) {
  if (valor && typeof valor === "object" && !Array.isArray(valor)) {
    return valor[idioma] || valor.es || "";
  }
  return valor ?? "";
}

// Si un texto de data.js se muestra en español porque le falta el inglés, se
// marca con lang="es": así el lector de pantalla lo pronuncia en español.
function langDe(valor) {
  const traducido = valor && typeof valor === "object" && valor[idioma];
  return idioma !== "es" && !traducido ? ' lang="es"' : "";
}

// Todas las versiones de un texto unidas, para que el buscador encuentre un
// título en español aunque la web esté en inglés, y al revés
function todasLasVersiones(valor) {
  return valor && typeof valor === "object" ? Object.values(valor).join(" ") : String(valor ?? "");
}

// Traduce los textos fijos de la página (data-i18n y data-i18n-<atributo>).
// Los datos del propio elemento (data-nombre…) rellenan las {llaves}.
function aplicarTextosFijos() {
  document.documentElement.lang = idioma;

  document.querySelectorAll("[data-i18n]").forEach((elemento) => {
    elemento.textContent = t(elemento.dataset.i18n, elemento.dataset);
  });

  ATRIBUTOS_TRADUCIBLES.forEach((atributo) => {
    document.querySelectorAll(`[data-i18n-${atributo}]`).forEach((elemento) => {
      const clave = elemento.getAttribute(`data-i18n-${atributo}`);
      elemento.setAttribute(atributo, t(clave, elemento.dataset));
    });
  });

  // Botones ES / EN de la cabecera: queda marcado el idioma actual
  document.querySelectorAll("[data-idioma]").forEach((boton) => {
    boton.setAttribute("aria-pressed", String(boton.dataset.idioma === idioma));
  });
}

// Selector ES / EN de la cabecera. Viene con hidden en el HTML porque sin
// JavaScript no funcionaría.
function iniciarSelectorIdioma() {
  const selector = document.querySelector(".idioma");
  if (!selector) return;

  selector.hidden = false;
  selector.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-idioma]");
    if (boton && boton.dataset.idioma !== idioma) cambiarIdioma(boton.dataset.idioma);
  });
}

function cambiarIdioma(nuevo) {
  idioma = nuevo;
  guardarIdioma(nuevo);

  // Si la URL lleva ?lang=, se actualiza: si no, al recargar volvería al anterior
  const url = new URL(window.location.href);
  if (url.searchParams.has("lang")) {
    url.searchParams.set("lang", nuevo);
    try {
      history.replaceState(null, "", url);
    } catch (error) {
      // Abriendo el HTML con doble clic algunos navegadores no lo permiten
    }
  }

  // Se vuelve a pintar todo lo que tiene texto (la lista está al final del archivo)
  ejecutar(PINTAR_TEXTOS);

  // Lo recién pintado aparece directamente, sin repetir la animación de entrada
  document.querySelectorAll(".aparece").forEach((elemento) => elemento.classList.add("visible"));
}


/* --------------------------------------------------------------------------
   3. INTRO DE CINE
   La primera vez que se entra en la web en cada sesión, el logo aparece sobre
   negro con el parpadeo de un proyector antiguo. Toda la animación está en el
   CSS (.intro); aquí solo se crea, se decide si se muestra y se quita al acabar.
   -------------------------------------------------------------------------- */

const CLAVE_INTRO = "dp-intro-vista";

function iniciarIntro() {
  if (MOVIMIENTO_REDUCIDO) return;

  // sessionStorage se vacía al cerrar la pestaña: así la intro sale una vez por
  // visita. Si el navegador no deja usarlo (algunos modos privados), mejor no
  // mostrarla que repetirla en cada página.
  try {
    if (sessionStorage.getItem(CLAVE_INTRO)) return;
    sessionStorage.setItem(CLAVE_INTRO, "si");
  } catch (error) {
    return;
  }

  // Es pura decoración: aria-hidden hace que los lectores de pantalla la ignoren
  const intro = document.createElement("div");
  intro.className = "intro";
  intro.setAttribute("aria-hidden", "true");
  intro.innerHTML = `
    <div class="intro__contenido">
      <img class="intro__logo" src="./img/logo.svg" alt="" width="104" height="104">
      <p class="intro__marca">Dark Paradox <span>Studios</span></p>
    </div>
  `;
  document.body.append(intro);

  function terminar() {
    document.removeEventListener("pointerdown", saltar);
    document.removeEventListener("keydown", saltar);
    intro.remove();
  }

  // Tocar la pantalla, hacer clic o pulsar cualquier tecla la funde enseguida
  function saltar() {
    intro.classList.add("intro--saltando");
    setTimeout(terminar, 300);
  }

  document.addEventListener("pointerdown", saltar);
  document.addEventListener("keydown", saltar);

  // Cuando termina la animación de salida del CSS, se quita del todo. El
  // setTimeout es un seguro por si el navegador no avisa (pestaña en segundo plano).
  intro.addEventListener("animationend", (evento) => {
    if (evento.animationName === "intro-salida") terminar();
  });
  setTimeout(terminar, 3200);
}


/* --------------------------------------------------------------------------
   4. CABECERA Y MENÚ
   -------------------------------------------------------------------------- */

function iniciarMenu() {
  const boton = document.querySelector(".menu-boton");
  const menu = document.getElementById("menu-principal");
  if (!boton || !menu) return;

  // Mientras el menú está abierto, el contenido de detrás queda inactivo (inert)
  // y el tabulador no se escapa a él.
  const contenidoDeFondo = document.querySelectorAll("main, .pie");

  function cambiarMenu(abrir) {
    // La clave de la etiqueta también se guarda en el atributo data-i18n-aria-label,
    // para que siga siendo la correcta si se cambia de idioma con el menú abierto
    boton.dataset.i18nAriaLabel = abrir ? "menu.cerrar" : "menu.abrir";
    boton.setAttribute("aria-label", t(boton.dataset.i18nAriaLabel));
    boton.setAttribute("aria-expanded", String(abrir));
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

  // …y si la pantalla crece hasta el diseño de escritorio (como al girar
  // la tablet). Esta medida tiene que coincidir con la del CSS (sección 5).
  window.matchMedia("(min-width: 64rem)").addEventListener("change", (evento) => {
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
   5. SONIDO AMBIENTE
   Botón del altavoz de la cabecera. Está apagado por defecto y nunca empieza a
   sonar solo. No usa ningún archivo de audio: el sonido se genera en el
   navegador con la Web Audio API, mezclando tres capas:
     - un zumbido grave,
     - viento (ruido filtrado que cambia de tono y de fuerza muy despacio),
     - algún crujido de madera suelto, muy suave, cada pocos segundos.

   La elección se guarda en localStorage. Si se dejó encendido, en la página
   siguiente vuelve a sonar con el primer clic, toque o tecla: los navegadores
   no permiten que una página suene sin que la persona haga algo antes.

   Mientras se reproduce un vídeo de la web (el corto completo), el ambiente
   se calla, y vuelve solo cuando el vídeo se pausa o termina.
   -------------------------------------------------------------------------- */

const CLAVE_SONIDO = "dp-sonido";
const VOLUMEN_SONIDO = 0.5; // Volumen final del ambiente, de 0 a 1

// Se crean la primera vez que se enciende el sonido
let contextoAudio = null;  // El "motor" de audio del navegador
let volumenGeneral = null; // Nodo de volumen por el que pasan todas las capas
let sonidoEncendido = false;
let temporizadorCrujidos = null;
let temporizadorPausa = null;

function guardarPreferenciaSonido() {
  try {
    localStorage.setItem(CLAVE_SONIDO, sonidoEncendido ? "si" : "no");
  } catch (error) {
    // Si el navegador no deja guardar, simplemente no se recuerda
  }
}

function leerPreferenciaSonido() {
  try {
    return localStorage.getItem(CLAVE_SONIDO) === "si";
  } catch (error) {
    return false;
  }
}

// El botón del altavoz sale pulsado mientras el ambiente suena
function pintarBotonSonido() {
  document.querySelectorAll(".sonido-boton").forEach((boton) => {
    boton.setAttribute("aria-pressed", String(sonidoEncendido));
  });
}

// Reproductores con sonido de la web: los <video> con controles (el corto
// completo). El vídeo del inicio no cuenta: no tiene controles ni sonido.
function esReproductor(elemento) {
  return elemento instanceof HTMLVideoElement && elemento.controls;
}

function hayVideoSonando() {
  return [...document.querySelectorAll("video[controls]")].some(
    (video) => !video.paused && !video.ended
  );
}

function iniciarSonido() {
  const boton = document.querySelector(".sonido-boton");
  if (!boton || !window.AudioContext) return;

  boton.hidden = false;

  // true mientras el ambiente está callado porque suena un vídeo
  let pausadoPorVideo = false;

  boton.addEventListener("click", () => {
    // Un clic en el botón manda sobre la pausa automática del vídeo
    pausadoPorVideo = false;
    if (sonidoEncendido) {
      apagarSonido();
    } else {
      encenderSonido();
    }
    guardarPreferenciaSonido();
    pintarBotonSonido();
  });

  // Al darle al play a un vídeo, el ambiente se funde a silencio (sin cambiar
  // lo guardado). Los eventos de vídeo no "suben" por la página, así que se
  // escuchan en la fase de captura: el true del final.
  document.addEventListener("play", (evento) => {
    if (!esReproductor(evento.target) || !sonidoEncendido) return;
    pausadoPorVideo = true;
    apagarSonido();
    pintarBotonSonido();
  }, true);

  // Cuando el vídeo se pausa o termina (y no queda otro sonando), vuelve
  const alPararVideo = (evento) => {
    if (!esReproductor(evento.target) || !pausadoPorVideo || hayVideoSonando()) return;
    pausadoPorVideo = false;
    encenderSonido();
    pintarBotonSonido();
  };
  document.addEventListener("pause", alPararVideo, true);
  document.addEventListener("ended", alPararVideo, true);

  // Si se dejó encendido en otra página, el botón ya sale pulsado y el sonido
  // arranca con la primera interacción. Se sigue escuchando hasta que el
  // navegador deja sonar de verdad (estado "running").
  if (leerPreferenciaSonido()) {
    sonidoEncendido = true;
    pintarBotonSonido();

    const eventos = ["click", "keydown", "touchend"];
    const alInteractuar = (evento) => {
      // El clic en el propio botón ya lo gestiona su oyente (y lo apagaría)
      if (boton.contains(evento.target)) return;
      if (sonidoEncendido) encenderSonido();
      if (contextoAudio && contextoAudio.state !== "running") return;
      eventos.forEach((tipo) => document.removeEventListener(tipo, alInteractuar, true));
    };
    eventos.forEach((tipo) => document.addEventListener(tipo, alInteractuar, true));
  }

  // Con la pestaña en segundo plano se pausa, para no gastar batería
  document.addEventListener("visibilitychange", () => {
    if (!contextoAudio || !sonidoEncendido) return;
    if (document.hidden) {
      contextoAudio.suspend();
    } else {
      contextoAudio.resume();
    }
  });

  // Al pulsar dentro del tráiler de YouTube, el foco pasa a su iframe: se apaga
  // el ambiente para que no se mezcle con el vídeo (sin cambiar lo guardado).
  window.addEventListener("blur", () => {
    setTimeout(() => {
      if (sonidoEncendido && document.activeElement?.tagName === "IFRAME") {
        apagarSonido();
        pintarBotonSonido();
      }
    }, 0);
  });

  // Al volver con "atrás", la página puede restaurarse con el volumen a cero
  // (se bajó al salir): se vuelve a subir.
  window.addEventListener("pageshow", (evento) => {
    if (evento.persisted && sonidoEncendido && contextoAudio) {
      fundirVolumen(VOLUMEN_SONIDO, 1.5);
    }
  });
}

function encenderSonido() {
  if (!contextoAudio) crearAmbiente();
  sonidoEncendido = true;
  clearTimeout(temporizadorPausa);
  contextoAudio.resume();
  fundirVolumen(VOLUMEN_SONIDO, 2.5); // Fundido de entrada: 2,5 segundos
  programarCrujido();
}

function apagarSonido() {
  sonidoEncendido = false;
  clearTimeout(temporizadorCrujidos);
  if (!contextoAudio) return;

  fundirVolumen(0, 1.2); // Fundido de salida: 1,2 segundos
  // Cuando ya no se oye nada, se suspende el motor de audio
  clearTimeout(temporizadorPausa);
  temporizadorPausa = setTimeout(() => contextoAudio.suspend(), 1300);
}

// Lleva el volumen general hasta "valor" en "segundos", con una rampa suave
function fundirVolumen(valor, segundos) {
  if (!contextoAudio) return;
  const ahora = contextoAudio.currentTime;
  const volumen = volumenGeneral.gain;
  volumen.cancelScheduledValues(ahora);
  volumen.setValueAtTime(volumen.value, ahora);
  volumen.linearRampToValueAtTime(valor, ahora + segundos);
}

function crearAmbiente() {
  contextoAudio = new AudioContext();
  volumenGeneral = contextoAudio.createGain();
  volumenGeneral.gain.value = 0; // Empieza en silencio: el fundido lo sube
  volumenGeneral.connect(contextoAudio.destination);

  crearZumbido(contextoAudio, volumenGeneral);
  crearViento(contextoAudio, volumenGeneral);
}

// Conecta un oscilador muy lento (un LFO) a un parámetro para que suba y baje
// sin parar alrededor de su valor: "cantidad" hacia arriba y hacia abajo,
// "vecesPorSegundo" ciclos cada segundo (0,1 = un ciclo cada 10 segundos).
function modular(contexto, parametro, vecesPorSegundo, cantidad) {
  const lfo = contexto.createOscillator();
  const intensidad = contexto.createGain();
  lfo.frequency.value = vecesPorSegundo;
  intensidad.gain.value = cantidad;
  lfo.connect(intensidad).connect(parametro);
  lfo.start();
}

// Zumbido: dos notas graves casi iguales (55 y 55,6 Hz) "baten" entre sí y
// producen una vibración lenta. La octava de arriba (110 Hz) hace que se oiga
// también en los altavoces del móvil, que apenas reproducen graves tan bajos.
function crearZumbido(contexto, salida) {
  const volumen = contexto.createGain();
  volumen.gain.value = 0.16;
  volumen.connect(salida);

  const notas = [
    { frecuencia: 55, nivel: 1 },
    { frecuencia: 55.6, nivel: 0.8 },
    { frecuencia: 110, nivel: 0.3 },
  ];

  notas.forEach((nota) => {
    const oscilador = contexto.createOscillator();
    const nivel = contexto.createGain();
    oscilador.frequency.value = nota.frecuencia;
    nivel.gain.value = nota.nivel;
    oscilador.connect(nivel).connect(volumen);
    oscilador.start();
  });

  // Respiración: el zumbido crece y mengua muy despacio
  modular(contexto, volumen.gain, 0.08, 0.05);
}

// Viento: ruido "marrón" (más grave y suave que el ruido blanco de una tele sin
// señal) que pasa por un filtro. Unos osciladores lentos mueven el tono del
// filtro y el volumen: son las rachas.
function crearViento(contexto, salida) {
  const muestras = contexto.sampleRate * 6; // 6 segundos que se repiten en bucle
  const buffer = contexto.createBuffer(1, muestras, contexto.sampleRate);
  const datos = buffer.getChannelData(0);

  // Cada muestra es la anterior más un poco de azar: así sale ruido marrón
  let anterior = 0;
  for (let i = 0; i < muestras; i++) {
    const azar = Math.random() * 2 - 1;
    anterior = (anterior + 0.02 * azar) / 1.02;
    datos[i] = anterior * 3.5;
  }

  // Se endereza la señal para que acabe en el mismo valor en el que empieza:
  // si no, al repetirse el bucle se oiría un "clic" cada 6 segundos.
  const salto = datos[muestras - 1] - datos[0];
  for (let i = 0; i < muestras; i++) {
    datos[i] -= salto * (i / (muestras - 1));
  }

  const ruido = contexto.createBufferSource();
  ruido.buffer = buffer;
  ruido.loop = true;

  const filtro = contexto.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = 420;
  filtro.Q.value = 0.8;

  const volumen = contexto.createGain();
  volumen.gain.value = 0.5;

  ruido.connect(filtro).connect(volumen).connect(salida);
  ruido.start();

  modular(contexto, filtro.frequency, 0.05, 220); // El tono sube y baja cada 20 s…
  modular(contexto, filtro.frequency, 0.13, 90);  // …con pequeñas variaciones encima
  modular(contexto, volumen.gain, 0.09, 0.3);     // Rachas: más fuerte, más flojo
}

// Crujido de madera: un tono áspero y muy grave (onda de diente de sierra),
// filtrado para que suene a madera y "troceado" a toda velocidad por otro
// oscilador. Tono, duración y lado (izquierda o derecha) salen al azar.
function crearCrujido(contexto, salida, momento) {
  const duracion = 0.35 + Math.random() * 0.8;
  const fin = momento + duracion;

  const tono = contexto.createOscillator();
  const notaInicial = 50 + Math.random() * 40;
  tono.type = "sawtooth";
  tono.frequency.setValueAtTime(notaInicial, momento);
  tono.frequency.linearRampToValueAtTime(notaInicial * (0.7 + Math.random() * 0.6), fin);

  const filtro = contexto.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.value = 700 + Math.random() * 900;
  filtro.Q.value = 5;

  // Troceado: el volumen salta entre 0 y 1 de 14 a 30 veces por segundo
  const troceado = contexto.createGain();
  troceado.gain.value = 0.5;
  const cortador = contexto.createOscillator();
  const amplitudCortador = contexto.createGain();
  cortador.type = "square";
  cortador.frequency.value = 14 + Math.random() * 16;
  amplitudCortador.gain.value = 0.5;
  cortador.connect(amplitudCortador).connect(troceado.gain);

  // Envolvente: entra rápido, se mantiene y se apaga despacio. Tras el filtro
  // queda poca señal, así que 0,8 sigue sonando muy por debajo del viento.
  const envolvente = contexto.createGain();
  envolvente.gain.setValueAtTime(0, momento);
  envolvente.gain.linearRampToValueAtTime(0.8, momento + 0.06);
  envolvente.gain.setTargetAtTime(0, fin - 0.15, 0.08);

  const lado = contexto.createStereoPanner();
  lado.pan.value = Math.random() * 1.6 - 0.8;

  tono.connect(filtro).connect(troceado).connect(envolvente).connect(lado).connect(salida);
  tono.start(momento);
  cortador.start(momento);
  tono.stop(fin + 0.5);
  cortador.stop(fin + 0.5);
}

// Programa el siguiente crujido dentro de 5 a 15 segundos
function programarCrujido() {
  clearTimeout(temporizadorCrujidos);
  temporizadorCrujidos = setTimeout(() => {
    if (!sonidoEncendido) return;
    crearCrujido(contextoAudio, volumenGeneral, contextoAudio.currentTime + 0.05);
    programarCrujido();
  }, 5000 + Math.random() * 10000);
}


/* --------------------------------------------------------------------------
   6. DATOS DE CONTACTO
   Rellena los enlaces de todas las páginas a partir de CONTACTO (data.js).
   Lo que no tiene dato no se muestra.
   -------------------------------------------------------------------------- */

function iniciarContacto() {
  const { email, emailPrensa, whatsapp, ciudad } = DATOS_CONTACTO;
  const correoPrensa = emailPrensa || email; // Si no hay email de prensa, el general

  const enlaces = {
    email: email ? `mailto:${email}` : "",
    prensa: correoPrensa ? `mailto:${correoPrensa}` : "",
    whatsapp: whatsapp ? `https://wa.me/${String(whatsapp).replace(/\D/g, "")}` : "",
  };

  // Los enlaces vienen ocultos en el HTML y solo aparecen si hay dato
  document.querySelectorAll("[data-contacto]").forEach((enlace) => {
    const url = enlaces[enlace.dataset.contacto];
    if (!url) return;
    enlace.href = url;
    enlace.hidden = false;
  });

  // Bloques enteros que solo se muestran si existe su dato: data-si-hay="email",
  // "prensa", "whatsapp" o "ciudad". Vienen con hidden en el HTML.
  const datos = { email, prensa: correoPrensa, whatsapp, ciudad };
  document.querySelectorAll("[data-si-hay]").forEach((bloque) => {
    bloque.hidden = !hayDato(datos[bloque.dataset.siHay]);
  });

  // En contacto.html y prensa.html el email también se muestra escrito
  document.querySelectorAll("[data-valor-email]").forEach((elemento) => {
    if (email) elemento.textContent = email;
  });

  document.querySelectorAll("[data-valor-prensa]").forEach((elemento) => {
    if (correoPrensa) elemento.textContent = correoPrensa;
  });

  document.querySelectorAll("[data-ciudad]").forEach((elemento) => {
    if (!ciudad) return;
    elemento.textContent = ciudad;
    elemento.hidden = false;
  });

  // Año actual en el pie
  document.querySelectorAll("[data-anio]").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
  });
}


/* --------------------------------------------------------------------------
   7. INICIO
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

// Efecto linterna: la imagen del hero queda casi a oscuras y solo se ve un
// círculo de luz que sigue al ratón o al dedo. Si nadie lo mueve, la luz deriva
// sola y despacio. El dibujo lo hace el CSS (.hero--linterna); aquí solo se
// actualizan las variables --luz-x y --luz-y, una vez por fotograma.
function iniciarLinterna() {
  const hero = document.querySelector(".hero");
  if (!hero || MOVIMIENTO_REDUCIDO) return;

  hero.classList.add("hero--linterna");

  let ancho = hero.clientWidth;
  let alto = hero.clientHeight;
  const luz = { x: ancho * 0.5, y: alto * 0.4 }; // Dónde está la luz ahora
  const destino = { x: luz.x, y: luz.y };        // Hacia dónde va
  let derivarDesde = 0;   // Momento a partir del cual la luz vuelve a ir sola
  let idFotograma = null; // Para poder parar la animación

  function seguirPuntero(evento) {
    const caja = hero.getBoundingClientRect();
    destino.x = evento.clientX - caja.left;
    destino.y = evento.clientY - caja.top;
    derivarDesde = Infinity; // Mientras haya ratón o dedo, la luz va con él
  }

  hero.addEventListener("pointermove", seguirPuntero);
  hero.addEventListener("pointerdown", seguirPuntero);
  // Al sacar el ratón o levantar el dedo, la luz espera un poco y vuelve a derivar
  hero.addEventListener("pointerleave", () => {
    derivarDesde = performance.now() + 2000;
  });

  window.addEventListener("resize", () => {
    ancho = hero.clientWidth;
    alto = hero.clientHeight;
  });

  function fotograma(ahora) {
    const derivando = ahora > derivarDesde;

    if (derivando) {
      // Dos ondas lentas con ritmos distintos: el recorrido parece casual y
      // tarda mucho en repetirse (es una curva de Lissajous)
      destino.x = ancho * (0.5 + 0.3 * Math.sin(ahora / 3700));
      destino.y = alto * (0.42 + 0.2 * Math.sin(ahora / 5300 + 1.3));
    }

    // En cada fotograma la luz recorre solo una parte de lo que le falta:
    // así se mueve con suavidad, como una linterna de verdad
    const suavidad = derivando ? 0.03 : 0.15;
    luz.x += (destino.x - luz.x) * suavidad;
    luz.y += (destino.y - luz.y) * suavidad;

    hero.style.setProperty("--luz-x", `${luz.x.toFixed(1)}px`);
    hero.style.setProperty("--luz-y", `${luz.y.toFixed(1)}px`);
    idFotograma = requestAnimationFrame(fotograma);
  }

  // Solo se anima mientras el hero está en pantalla, para no gastar batería
  if (!("IntersectionObserver" in window)) {
    idFotograma = requestAnimationFrame(fotograma);
    return;
  }

  new IntersectionObserver(([entrada]) => {
    cancelAnimationFrame(idFotograma);
    if (entrada.isIntersecting) idFotograma = requestAnimationFrame(fotograma);
  }).observe(hero);
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
  const titulo = enIdioma(corto.titulo);
  const datos = t("inicio.ultimoCorto", { anio: corto.anio, duracion: enIdioma(corto.duracion) });

  caja.innerHTML = `
    <a class="destacado__poster-enlace aparece" href="${url}">
      <img class="destacado__poster" src="${escaparHTML(corto.poster)}"
           alt="${escaparHTML(t("cortos.poster", { titulo }))}" width="800" height="1200" loading="lazy">
      ${etiquetaNuevo(corto)}
    </a>
    <div class="aparece">
      <p class="ficha-texto">${escaparHTML(datos)}</p>
      <h2${langDe(corto.titulo)}>${escaparHTML(titulo)}</h2>
      <p class="corto__sinopsis"${langDe(corto.sinopsis)}>${escaparHTML(enIdioma(corto.sinopsis))}</p>
      <div class="destacado__acciones">
        <a class="boton boton--secundario" href="${url}">${t("inicio.verFicha")}</a>
      </div>
    </div>
  `;

  // El botón del hero lleva a ver el último corto: "Ver {titulo}" si está el
  // corto completo, "Ver tráiler" si solo hay tráiler y, si no hay ninguno de
  // los dos, "Ver último corto" a su ficha. El ancla (#ver o #trailer) hace
  // que la ficha se abra directamente en el reproductor.
  const botonHero = document.getElementById("hero-boton");
  if (botonHero) {
    const ancla = queSePuedeVer(corto);
    const claves = { ver: "inicio.verCorto", trailer: "inicio.verTrailer" };
    botonHero.href = ancla ? `${url}#${ancla}` : url;
    botonHero.dataset.titulo = titulo; // Rellena el {titulo} de "Ver {titulo}"
    botonHero.dataset.i18n = claves[ancla] || "inicio.verUltimo";
    botonHero.textContent = t(botonHero.dataset.i18n, botonHero.dataset);
  }
}


/* --------------------------------------------------------------------------
   8. LISTADO DE CORTOS Y FILTROS
   -------------------------------------------------------------------------- */

// La rellena iniciarFiltros. Así, al repintar el listado (como al
// cambiar de idioma) se vuelven a aplicar los filtros que hubiera.
let aplicarFiltros = null;

function pintarListado() {
  const lista = document.getElementById("lista-cortos");
  if (!lista) return;

  const cortos = cortosPorFecha();

  if (cortos.length === 0) {
    lista.outerHTML = `
      <p class="texto-secundario" data-i18n="cortos.vacia">${t("cortos.vacia")}</p>
    `;
    return;
  }

  // Con pocos cortos, los pósters (y el título de la página) van centrados
  const pocos = cortos.length < POCOS_CORTOS;
  lista.classList.toggle("rejilla-cortos--pocos", pocos);
  lista.closest(".listado")?.classList.toggle("listado--pocos", pocos);

  // data-slug permite a los filtros encontrar la tarjeta de cada corto
  lista.innerHTML = cortos
    .map((corto) => {
      const titulo = enIdioma(corto.titulo);
      return `
        <li class="tarjeta aparece" data-slug="${escaparHTML(corto.slug)}">
          <a class="tarjeta__enlace" href="${urlDelCorto(corto)}">
            <img class="tarjeta__poster" src="${escaparHTML(corto.poster)}"
                 alt="${escaparHTML(t("cortos.poster", { titulo }))}" width="800" height="1200" loading="lazy">
            <div class="tarjeta__velo">
              <h2 class="tarjeta__titulo"${langDe(corto.titulo)}>${escaparHTML(titulo)}</h2>
              <p class="tarjeta__datos">${escaparHTML(corto.anio)} · ${escaparHTML(enIdioma(corto.duracion))}</p>
              <span class="tarjeta__accion" aria-hidden="true">${t("cortos.verCorto")}</span>
            </div>
            ${etiquetaNuevo(corto)}
          </a>
        </li>
      `;
    })
    .join("") + htmlDeTarjetaProxima();

  if (aplicarFiltros) aplicarFiltros();
}

// Tarjeta "Próximamente" al final del listado, con el póster de PROXIMO
// (data.js) y enlace a proximamente.html. No es un corto: no lleva data-slug,
// así que los filtros, el buscador y el número de cortos no la tienen en cuenta.
// El póster se ve entero (4:5) dentro de un hueco del mismo tamaño que los
// demás pósters (2:3), para que la rejilla siga alineada.
function htmlDeTarjetaProxima() {
  if (!hayDato(DATOS_PROXIMO.titulo) || !hayDato(DATOS_PROXIMO.imagen)) return "";

  const titulo = enIdioma(DATOS_PROXIMO.titulo);
  const estado = hayDato(DATOS_PROXIMO.estado)
    ? `<p class="tarjeta__datos"${langDe(DATOS_PROXIMO.estado)}>${escaparHTML(enIdioma(DATOS_PROXIMO.estado))}</p>`
    : "";

  return `
    <li class="tarjeta tarjeta--proxima aparece" data-tarjeta-proxima>
      <a class="tarjeta__enlace" href="./proximamente.html">
        <img class="tarjeta__poster tarjeta__poster--proxima" src="${escaparHTML(DATOS_PROXIMO.imagen)}"
             alt="${escaparHTML(t("cortos.poster", { titulo }))}" width="1122" height="1402" loading="lazy">
        <div class="tarjeta__velo">
          <h2 class="tarjeta__titulo"${langDe(DATOS_PROXIMO.titulo)}>${escaparHTML(titulo)}</h2>
          ${estado}
          <span class="tarjeta__accion" aria-hidden="true">${t("cortos.verProximo")}</span>
        </div>
        <span class="etiqueta-proxima">${t("menu.proximamente")}</span>
      </a>
    </li>
  `;
}

// En una pantalla táctil no hay "pasar el ratón". El primer toque muestra los datos
// del póster y el segundo entra en el corto. Si prefieres que un solo toque entre
// directamente, basta con borrar esta función y la línea que la llama (al final).
function iniciarTarjetasTactiles() {
  const lista = document.getElementById("lista-cortos");
  if (!lista) return;

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

// Buscador y filtros de cortos.html. Las tarjetas no se vuelven a crear: solo se
// ocultan las que no encajan y se reordenan las demás. El estado se guarda en la
// URL (?q=&anio=&duracion=&orden=) para que se pueda compartir una búsqueda.
// Con menos de POCOS_CORTOS cortos no hacen falta: el formulario sigue oculto
// (viene con hidden en el HTML) y no se filtra nada.
function iniciarFiltros() {
  const formulario = document.getElementById("filtros");
  const lista = document.getElementById("lista-cortos");
  if (!formulario || !lista || LISTA_CORTOS.length < POCOS_CORTOS) return;

  const resultado = document.getElementById("filtros-resultado");
  const sinResultados = document.getElementById("sin-resultados");
  const campos = {
    q: formulario.elements.q,
    anio: formulario.elements.anio,
    duracion: formulario.elements.duracion,
    orden: formulario.elements.orden,
  };

  // Un año en el desplegable por cada año con algún corto, sin repetir
  const anios = new Set(cortosPorFecha().map((corto) => String(corto.anio)));
  anios.forEach((anio) => campos.anio.append(new Option(anio, anio)));

  // Estado inicial: el de la URL. Si un valor no existe en su desplegable
  // (alguien escribió ?anio=1900), ese desplegable se queda en su primera opción.
  const parametros = new URLSearchParams(window.location.search);
  campos.q.value = parametros.get("q") || "";
  ["anio", "duracion", "orden"].forEach((nombre) => {
    const desplegable = campos[nombre];
    desplegable.value = parametros.get(nombre) || "";
    if (desplegable.selectedIndex === -1) desplegable.selectedIndex = 0;
  });

  aplicarFiltros = () => {
    // Cada palabra buscada tiene que aparecer en el título o en la sinopsis
    const palabras = normalizar(campos.q.value).split(/\s+/).filter(Boolean);
    const anio = campos.anio.value;
    const duracion = campos.duracion.value;
    const orden = campos.orden.value;

    const cortos = cortosPorFecha().filter((corto) => {
      const texto = normalizar(`${todasLasVersiones(corto.titulo)} ${todasLasVersiones(corto.sinopsis)}`);
      if (anio && String(corto.anio) !== anio) return false;
      if (duracion && tipoDeDuracion(corto) !== duracion) return false;
      return palabras.every((palabra) => texto.includes(palabra));
    });

    if (orden === "antiguos") cortos.reverse();
    if (orden === "az") {
      cortos.sort((a, b) =>
        enIdioma(a.titulo).localeCompare(enIdioma(b.titulo), idioma, { sensitivity: "base" })
      );
    }

    // Se ocultan todas las tarjetas de cortos y se vuelven a mostrar, en el orden
    // pedido, las que pasan el filtro (append mueve un elemento que ya existe al
    // final). La tarjeta "Próximamente" no se filtra y siempre va la última.
    const tarjetas = [...lista.children].filter((tarjeta) => tarjeta.dataset.slug);
    tarjetas.forEach((tarjeta) => {
      tarjeta.hidden = true;
    });
    cortos.forEach((corto) => {
      const tarjeta = tarjetas.find((elemento) => elemento.dataset.slug === corto.slug);
      tarjeta.hidden = false;
      lista.append(tarjeta);
    });
    const tarjetaProxima = lista.querySelector("[data-tarjeta-proxima]");
    if (tarjetaProxima) lista.append(tarjetaProxima);

    resultado.textContent = textoDeResultados(cortos.length, LISTA_CORTOS.length);
    lista.hidden = cortos.length === 0;
    sinResultados.hidden = cortos.length > 0;

    guardarFiltrosEnUrl({ q: campos.q.value.trim(), anio, duracion, orden });
  };

  // "input" salta con cada letra escrita y con cada cambio de los desplegables
  formulario.addEventListener("input", aplicarFiltros);
  // Pulsar Intro en el buscador no debe recargar la página
  formulario.addEventListener("submit", (evento) => evento.preventDefault());

  document.getElementById("limpiar-filtros").addEventListener("click", () => {
    formulario.reset();
    aplicarFiltros();
    campos.q.focus();
  });

  formulario.hidden = false;
  aplicarFiltros();
}

// "1 corto", "3 cortos" o, si hay filtros, "1 de 3 cortos"
function textoDeResultados(numero, total) {
  if (numero === total) return total === 1 ? t("filtros.totalUno") : t("filtros.total", { total });
  return total === 1 ? t("filtros.parcialUno", { numero }) : t("filtros.parcial", { numero, total });
}

// Escribe los filtros en la URL sin recargar ni añadir pasos al historial.
// Los que están en su valor por defecto no se escriben, para que quede limpia.
function guardarFiltrosEnUrl(filtros) {
  const url = new URL(window.location.href);
  Object.entries(filtros).forEach(([nombre, valor]) => {
    if (valor && !(nombre === "orden" && valor === "recientes")) {
      url.searchParams.set(nombre, valor);
    } else {
      url.searchParams.delete(nombre);
    }
  });

  // Abriendo el HTML con doble clic (file://) algunos navegadores no lo permiten
  try {
    history.replaceState(null, "", url);
  } catch (error) {
    // La búsqueda funciona igual; solo no se refleja en la URL
  }
}


/* --------------------------------------------------------------------------
   9. DETALLE DE CORTO
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

  const titulo = enIdioma(corto.titulo);
  const sinopsis = enIdioma(corto.sinopsis);

  // Título de la pestaña y meta description, adaptados a este corto. Google
  // muestra unos 155 caracteres de la descripción, así que se recorta ahí.
  document.title = `${titulo} · Dark Paradox Studios`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", resumir(sinopsis, 155));

  // Al cambiar de idioma se vuelve a pintar toda la ficha. Si el vídeo estaba en
  // marcha, se apunta por dónde iba para que el reproductor nuevo siga ahí.
  const videoAnterior = caja.querySelector(".reproductor");
  const estadoVideo = videoAnterior && {
    tiempo: videoAnterior.currentTime,
    sonando: !videoAnterior.paused && !videoAnterior.ended,
    silenciado: videoAnterior.muted,
    volumen: videoAnterior.volume,
  };

  caja.innerHTML = `
    <article class="corto contenedor">
      <a class="enlace corto__volver" href="./cortos.html">${t("corto.volver")}</a>

      <div class="corto__portada">
        <img class="corto__poster aparece" src="${escaparHTML(corto.poster)}"
             alt="${escaparHTML(t("cortos.poster", { titulo }))}" width="800" height="1200" loading="lazy">
        <div class="aparece">
          <p class="ficha-texto">${escaparHTML(corto.anio)} · ${escaparHTML(enIdioma(corto.duracion))}</p>
          <h1${langDe(corto.titulo)}>${escaparHTML(titulo)}</h1>
          <p class="corto__sinopsis"${langDe(corto.sinopsis)}>${escaparHTML(sinopsis)}</p>
          ${hayDato(corto.inspiracion)
            ? `<p class="corto__inspiracion"${langDe(corto.inspiracion)}>${escaparHTML(enIdioma(corto.inspiracion))}</p>`
            : ""}
          <div class="compartir" id="compartir"></div>
        </div>
      </div>

      ${htmlDelVideo(corto)}
      ${htmlDeLaFicha(corto)}
      ${htmlDeLaGaleria(corto)}
      ${htmlDeFestivales(corto)}
      ${htmlDeNavegacion(corto)}
    </article>
  `;

  pintarCompartir(corto, false);
  iniciarLightbox(corto);

  const videoNuevo = caja.querySelector(".reproductor");
  if (estadoVideo && videoNuevo) {
    videoNuevo.muted = estadoVideo.silenciado;
    videoNuevo.volume = estadoVideo.volumen;
    if (estadoVideo.tiempo > 0) videoNuevo.currentTime = estadoVideo.tiempo;
    if (estadoVideo.sonando) videoNuevo.play().catch(() => {});
  }

  // El contenido se acaba de crear, así que el navegador no ha podido saltar por sí
  // solo a #ver o #trailer (el botón del inicio enlaza ahí). Solo se hace la
  // primera vez: al repintar por un cambio de idioma, la página se queda donde está.
  const ancla = window.location.hash.slice(1);
  if (!caja.dataset.pintado && (ancla === "ver" || ancla === "trailer")) {
    document.getElementById(ancla)?.scrollIntoView();
  }
  caja.dataset.pintado = "si";
}

// Bloque para ver el corto. Con video (data.js), el corto completo en un
// <video> de la propia web; con trailerUrl, el tráiler de YouTube. Si no hay
// ninguno de los dos, no se muestra nada.
function htmlDelVideo(corto) {
  const titulo = enIdioma(corto.titulo);
  const tipo = queSePuedeVer(corto);

  if (tipo === "ver") {
    // El primer fotograma hace de portada hasta que se le da al play.
    // preload="metadata" solo descarga la duración y el tamaño del vídeo: el
    // archivo entero no se descarga hasta que alguien lo reproduce.
    const portada = (corto.fotogramas || []).find(hayDato);
    return `
      <section class="corto__bloque aparece" id="ver">
        <h2>${t("corto.completo")}</h2>
        <video class="video-16-9 reproductor" src="${escaparHTML(corto.video)}"
               controls playsinline preload="metadata"
               ${portada ? `poster="${escaparHTML(portada)}"` : ""}
               aria-label="${escaparHTML(t("corto.videoDe", { titulo }))}"></video>
      </section>
    `;
  }

  // iframe de youtube-nocookie. La referrerpolicy es necesaria: sin ella,
  // YouTube puede negarse a reproducir el vídeo.
  if (tipo === "trailer") {
    return `
      <section class="corto__bloque aparece" id="trailer">
        <h2>${t("corto.trailer")}</h2>
        <iframe class="video-16-9"
                src="https://www.youtube-nocookie.com/embed/${idDeYoutube(corto.trailerUrl)}?rel=0"
                title="${escaparHTML(t("corto.trailerDe", { titulo }))}"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen></iframe>
      </section>
    `;
  }

  return "";
}

// Ficha técnica: solo las filas que tienen dato. Si no hay ninguna, no se muestra.
function htmlDeLaFicha(corto) {
  const filas = [
    filaFicha(t("corto.direccion"), enIdioma(corto.direccion)),
    filaFicha(t("corto.guion"), enIdioma(corto.guion)),
    filaFicha(t("corto.produccion"), enIdioma(corto.produccion)),
    filaFicha(t("corto.reparto"), textoReparto(corto.reparto)),
    filaFicha(t("corto.duracion"), enIdioma(corto.duracion)),
    filaFicha(t("corto.anio"), corto.anio),
  ].join("");

  if (!filas) return "";

  return `
    <section class="corto__bloque aparece">
      <h2>${t("corto.ficha")}</h2>
      <dl class="ficha-tecnica">${filas}</dl>
    </section>
  `;
}

function filaFicha(nombre, valor) {
  if (!hayDato(valor)) return "";

  return `
    <div class="ficha-tecnica__fila">
      <dt>${nombre}</dt>
      <dd>${escaparHTML(valor)}</dd>
    </div>
  `;
}

function htmlDeLaGaleria(corto) {
  if (!hayDato(corto.fotogramas)) return "";

  const titulo = enIdioma(corto.titulo);
  const miniaturas = corto.fotogramas
    .map((ruta, indice) => {
      const datos = { numero: indice + 1, titulo };
      return `
        <li>
          <button class="galeria__miniatura" type="button" data-indice="${indice}"
                  aria-label="${escaparHTML(t("corto.ampliar", datos))}">
            <img src="${escaparHTML(ruta)}" alt="${escaparHTML(t("corto.fotograma", datos))}"
                 width="1280" height="720" loading="lazy">
          </button>
        </li>
      `;
    })
    .join("");

  return `
    <section class="corto__bloque aparece">
      <h2>${t("corto.fotogramas")}</h2>
      <ul class="galeria" id="galeria">${miniaturas}</ul>
    </section>
  `;
}

function htmlDeFestivales(corto) {
  if (!hayDato(corto.festivales)) return "";

  const filas = corto.festivales
    .filter(hayDato)
    .map((festival) => `<li${langDe(festival)}>${escaparHTML(enIdioma(festival))}</li>`)
    .join("");

  return `
    <section class="corto__bloque aparece">
      <h2>${t("corto.festivales")}</h2>
      <ul class="lista-festivales">${filas}</ul>
    </section>
  `;
}

// Enlaces al corto anterior y al siguiente, por orden de estreno: "Anterior" es
// el que salió antes y "Siguiente", el que salió después. El primero y el
// último solo tienen uno de los dos, y si no hay otro corto no se muestra nada.
function htmlDeNavegacion(corto) {
  const cortos = cortosPorFecha(); // Del más reciente al más antiguo
  const posicion = cortos.indexOf(corto);
  const anterior = cortos[posicion + 1];
  const siguiente = cortos[posicion - 1];
  if (!anterior && !siguiente) return "";

  return `
    <nav class="corto-nav aparece" aria-label="${t("corto.otros")}">
      ${anterior ? enlaceDeNavegacion(anterior, "anterior") : ""}
      ${siguiente ? enlaceDeNavegacion(siguiente, "siguiente") : ""}
    </nav>
  `;
}

// El póster es decorativo (alt=""), porque el título ya está escrito al lado
function enlaceDeNavegacion(corto, direccion) {
  const rel = direccion === "anterior" ? "prev" : "next";

  return `
    <a class="corto-nav__enlace corto-nav__enlace--${direccion}" href="${urlDelCorto(corto)}" rel="${rel}">
      <img class="corto-nav__poster" src="${escaparHTML(corto.poster)}" alt=""
           width="800" height="1200" loading="lazy">
      <span>
        <span class="corto-nav__direccion">${t(`corto.${direccion}`)}</span>
        <span class="corto-nav__titulo"${langDe(corto.titulo)}>${escaparHTML(enIdioma(corto.titulo))}</span>
      </span>
    </a>
  `;
}

// Botones para compartir el corto. Si el navegador tiene su propio menú de
// compartir (navigator.share, habitual en el móvil), se usa ese con un solo
// botón. Si no, se muestran WhatsApp, X y "Copiar enlace".
function pintarCompartir(corto, forzarBotones) {
  const caja = document.getElementById("compartir");
  if (!caja) return;

  // Dirección completa del corto (https://…/corto.html?id=…), no la relativa.
  // Si la web está en inglés, el enlace lo dice, para que quien lo abra la vea igual.
  const url = new URL(urlDelCorto(corto), window.location.href);
  if (idioma !== "es") url.searchParams.set("lang", idioma);
  const texto = t("corto.textoCompartir", { titulo: enIdioma(corto.titulo) });

  if (navigator.share && !forzarBotones) {
    caja.innerHTML = `
      <button class="boton boton--secundario boton--pequeno" type="button" data-compartir="menu">
        <svg class="compartir__icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 15V3.5M7.5 8 12 3.5 16.5 8M5 12v8.5h14V12"/>
        </svg>
        ${t("corto.compartir")}
      </button>
    `;

    caja.querySelector("button").addEventListener("click", () => {
      navigator.share({ title: document.title, text: texto, url: url.href }).catch((error) => {
        // AbortError significa que la persona cerró el menú: no es un fallo.
        // Con cualquier otro error, se ofrecen los botones de siempre.
        if (error.name !== "AbortError") pintarCompartir(corto, true);
      });
    });
    return;
  }

  const enWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${texto} ${url.href}`)}`;
  const enX = `https://x.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url.href)}`;

  caja.innerHTML = `
    <p class="ficha-texto" id="compartir-titulo">${t("corto.compartir")}</p>
    <div class="compartir__botones" role="group" aria-labelledby="compartir-titulo">
      <a class="boton boton--secundario boton--pequeno" href="${escaparHTML(enWhatsApp)}"
         target="_blank" rel="noopener noreferrer"
         aria-label="${t("corto.compartirEn", { red: "WhatsApp" })}">WhatsApp</a>
      <a class="boton boton--secundario boton--pequeno" href="${escaparHTML(enX)}"
         target="_blank" rel="noopener noreferrer"
         aria-label="${t("corto.compartirEn", { red: "X" })}">X</a>
      <button class="boton boton--secundario boton--pequeno" type="button" data-compartir="copiar">${t("corto.copiarEnlace")}</button>
    </div>
  `;

  caja.querySelector('[data-compartir="copiar"]').addEventListener("click", async () => {
    const copiado = await copiarTexto(url.href);
    mostrarAviso(t(copiado ? "corto.enlaceCopiado" : "corto.enlaceNoCopiado"));
  });
}

function pintarCortoNoEncontrado(caja) {
  document.title = t("corto.noEncontradoPagina");
  caja.innerHTML = `
    <div class="mensaje-tematico contenedor">
      <p class="ficha-texto">${t("corto.noEncontradoFicha")}</p>
      <h1>${t("corto.noEncontradoTitulo")}</h1>
      <p class="texto-ancho texto-secundario">${t("corto.noEncontradoTexto")}</p>
      <div class="mensaje-tematico__acciones">
        <a class="boton" href="./cortos.html">${t("corto.noEncontradoBoton")}</a>
      </div>
    </div>
  `;
}


/* --------------------------------------------------------------------------
   10. LIGHTBOX (galería ampliada, hecha a mano con <dialog>)
   -------------------------------------------------------------------------- */

function iniciarLightbox(corto) {
  const galeria = document.getElementById("galeria");
  if (!galeria) return;

  // Al cambiar de idioma la ficha se vuelve a pintar: se quita el diálogo anterior
  document.querySelector(".lightbox")?.remove();

  const fotogramas = corto.fotogramas;
  const titulo = enIdioma(corto.titulo);
  let actual = 0;

  const dialogo = document.createElement("dialog");
  dialogo.className = "lightbox";
  dialogo.setAttribute("aria-label", t("lightbox.nombre", { titulo }));
  dialogo.innerHTML = `
    <div class="lightbox__barra">
      <button class="lightbox__boton" type="button" data-accion="cerrar" aria-label="${t("lightbox.cerrar")}" autofocus>×</button>
    </div>
    <figure class="lightbox__figura">
      <img alt="" draggable="false" loading="lazy">
    </figure>
    <div class="lightbox__controles">
      <button class="lightbox__boton" type="button" data-accion="anterior" aria-label="${t("lightbox.anterior")}">←</button>
      <span class="lightbox__contador" aria-live="polite"></span>
      <button class="lightbox__boton" type="button" data-accion="siguiente" aria-label="${t("lightbox.siguiente")}">→</button>
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
    imagen.alt = t("corto.fotograma", { numero: actual + 1, titulo });
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
   11. PRENSA
   En prensa.html, las descripciones, los datos clave y las galerías salen de
   data.js (ESTUDIO, CONTACTO, SHORTS y PROXIMO). El logotipo y el contacto de
   prensa están escritos en el propio HTML. Una sección sin datos no se muestra.
   -------------------------------------------------------------------------- */

function pintarPrensa() {
  pintarDescripciones();
  pintarDatosClave();
  pintarGaleriaPrensa();
  pintarProximoPrensa();
}

// Descripción corta y larga del estudio, en español y en inglés a la vez
// (quien escribe un artículo puede necesitar cualquiera de las dos), cada una
// con su botón de copiar
function pintarDescripciones() {
  const caja = document.getElementById("prensa-descripciones");
  if (!caja) return;

  const tipos = [
    { nombre: "Corta", textos: DATOS_ESTUDIO.descripcionCorta },
    { nombre: "Larga", textos: DATOS_ESTUDIO.descripcionLarga },
  ];

  const bloques = tipos
    .filter((tipo) => hayDato(tipo.textos))
    .map((tipo) => {
      // Si alguien escribe un texto normal en lugar de { es, en }, cuenta como español
      const textos = typeof tipo.textos === "object" ? tipo.textos : { es: tipo.textos };
      const versiones = IDIOMAS.filter((lengua) => hayDato(textos[lengua]))
        .map((lengua) => `
          <div class="descripcion__version">
            <p class="ficha-texto">${t(`prensa.${lengua}`)}</p>
            <p class="descripcion__texto" lang="${lengua}">${escaparHTML(textos[lengua])}</p>
            <button class="boton boton--secundario boton--pequeno" type="button"
                    aria-label="${t(`prensa.copiar${tipo.nombre}.${lengua}`)}">${t("prensa.copiar")}</button>
          </div>
        `)
        .join("");

      return `
        <article class="descripcion aparece">
          <h3>${t(`prensa.${tipo.nombre.toLowerCase()}`)}</h3>
          <div class="descripcion__versiones">${versiones}</div>
        </article>
      `;
    })
    .join("");

  caja.closest("section").hidden = !bloques;
  caja.innerHTML = bloques;

  // Cada botón copia el párrafo que tiene justo encima
  caja.querySelectorAll(".descripcion__version button").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const texto = boton.previousElementSibling.textContent;
      const copiado = await copiarTexto(texto);
      mostrarAviso(t(copiado ? "prensa.copiado" : "prensa.noCopiado"));
    });
  });
}

// Fundación, ciudad, número de cortos y número de selecciones en festivales.
// Los dos últimos se cuentan solos a partir de SHORTS. Los que no tienen dato
// (o son cero) no se muestran; si no queda ninguno, tampoco la sección.
function pintarDatosClave() {
  const caja = document.getElementById("prensa-datos");
  if (!caja) return;

  const festivales = LISTA_CORTOS.reduce(
    (total, corto) => total + [].concat(corto.festivales ?? []).filter(hayDato).length,
    0
  );

  const datos = [
    { nombre: t("prensa.fundacion"), valor: DATOS_ESTUDIO.fundacion },
    { nombre: t("prensa.ciudad"), valor: DATOS_CONTACTO.ciudad },
    { nombre: t("prensa.cortos"), valor: LISTA_CORTOS.length || "" },
    { nombre: t("prensa.festivales"), valor: festivales || "" },
  ].filter((dato) => hayDato(dato.valor));

  caja.closest("section").hidden = datos.length === 0;

  const filas = datos
    .map((dato) => `
      <div class="datos-clave__dato">
        <dt>${dato.nombre}</dt>
        <dd>${escaparHTML(enIdioma(dato.valor))}</dd>
      </div>
    `)
    .join("");

  caja.innerHTML = filas ? `<dl class="datos-clave aparece">${filas}</dl>` : "";
}

// Pósters y fotogramas de todos los cortos, para descargar. Si el corto tiene
// versiones en alta (posterAlta y fotogramasAlta en data.js), se descargan
// esas; si no, las mismas de la web.
function pintarGaleriaPrensa() {
  const caja = document.getElementById("prensa-galeria");
  if (!caja) return;

  caja.closest("section").hidden = LISTA_CORTOS.length === 0;

  caja.innerHTML = cortosPorFecha()
    .map((corto) => {
      const titulo = enIdioma(corto.titulo);
      const imagenes = [
        {
          ruta: corto.poster,
          alta: corto.posterAlta,
          pie: t("prensa.poster"),
          etiqueta: t("prensa.descargarPoster", { titulo }),
          archivo: `${corto.slug}-poster`,
          esPoster: true,
        },
        ...(corto.fotogramas || []).map((ruta, indice) => ({
          ruta,
          alta: corto.fotogramasAlta ? corto.fotogramasAlta[indice] : "",
          pie: t("prensa.fotograma", { numero: indice + 1 }),
          etiqueta: t("prensa.descargarFotograma", { numero: indice + 1, titulo }),
          archivo: `${corto.slug}-fotograma-${indice + 1}`,
          esPoster: false,
        })),
      ];

      return `
        <section class="prensa-corto aparece">
          <h3 class="prensa-corto__titulo">
            <span${langDe(corto.titulo)}>${escaparHTML(titulo)}</span>
            <span class="prensa-corto__anio">${escaparHTML(corto.anio)}</span>
          </h3>
          <ul class="prensa-galeria">${imagenes.map(htmlDeDescarga).join("")}</ul>
        </section>
      `;
    })
    .join("");
}

// Póster del próximo corto (PROXIMO) para descargar, en su propia sección.
// La sección se muestra u oculta desde pintarProximo (data-proximo-si-hay).
function pintarProximoPrensa() {
  const caja = document.getElementById("prensa-proximo-galeria");
  if (!caja) return;

  if (!hayDato(DATOS_PROXIMO.titulo) || !hayDato(DATOS_PROXIMO.imagen)) {
    caja.innerHTML = "";
    return;
  }

  const titulo = enIdioma(DATOS_PROXIMO.titulo);
  // Nombre del archivo descargado: "SentenZia" → "sentenzia-poster.jpg"
  const nombreArchivo = normalizar(titulo).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const poster = {
    ruta: DATOS_PROXIMO.imagen,
    pie: t("prensa.poster"),
    etiqueta: t("prensa.descargarPoster", { titulo }),
    archivo: `${nombreArchivo}-poster`,
    ancho: 1122,
    alto: 1402,
  };

  caja.innerHTML = `
    <section class="prensa-corto aparece">
      <h3 class="prensa-corto__titulo">
        <span${langDe(DATOS_PROXIMO.titulo)}>${escaparHTML(titulo)}</span>
        ${hayDato(DATOS_PROXIMO.estado)
          ? `<span class="prensa-corto__anio"${langDe(DATOS_PROXIMO.estado)}>${escaparHTML(enIdioma(DATOS_PROXIMO.estado))}</span>`
          : ""}
      </h3>
      <ul class="prensa-galeria">${htmlDeDescarga(poster)}</ul>
    </section>
  `;
}

// Una miniatura que descarga la imagen. El atributo download le pone un nombre
// claro al archivo (como maleficio-fotograma-2.jpg). ancho y alto solo sirven
// para reservar el hueco con la proporción correcta mientras carga.
function htmlDeDescarga(imagen) {
  const destino = imagen.alta || imagen.ruta;
  const extension = destino.split(".").pop();
  const ancho = imagen.ancho || (imagen.esPoster ? 800 : 1280);
  const alto = imagen.alto || (imagen.esPoster ? 1200 : 720);

  return `
    <li>
      <a class="prensa-galeria__enlace" href="${escaparHTML(destino)}"
         download="${escaparHTML(`${imagen.archivo}.${extension}`)}" aria-label="${escaparHTML(imagen.etiqueta)}">
        <img src="${escaparHTML(imagen.ruta)}" alt="" width="${ancho}" height="${alto}" loading="lazy">
        <span class="prensa-galeria__pie" aria-hidden="true">↓ ${escaparHTML(imagen.pie)}</span>
      </a>
    </li>
  `;
}


/* --------------------------------------------------------------------------
   12. PRÓXIMAMENTE
   proximamente.html, el aviso del inicio y la sección de prensa salen de
   PROXIMO (data.js). En el HTML se marcan con dos atributos, y vienen con hidden:
     data-proximo="campo"        se rellena con ese dato y se muestra si lo hay
     data-proximo-si-hay="campo" solo se muestra si ese dato existe
   Con data-proximo="imagen", el dato es la ruta del póster (src); si además
   lleva data-proximo-alt, su texto alternativo sale de PROXIMO.imagenAlt.
   -------------------------------------------------------------------------- */

// Momento del estreno en milisegundos, o NaN si no hay fecha o no se entiende
function fechaDelProximo() {
  return hayDato(DATOS_PROXIMO.fecha) ? new Date(DATOS_PROXIMO.fecha).getTime() : NaN;
}

// El título con las letras de "resaltar" envueltas en <span class="resalte">,
// que el CSS pinta en rojo: SentenZia → Senten<span>Z</span>ia
function htmlDelTituloResaltado(titulo, resaltar) {
  const letras = String(resaltar || "");
  return [...titulo]
    .map((letra) => {
      const html = escaparHTML(letra);
      return letras.includes(letra) ? `<span class="resalte">${html}</span>` : html;
    })
    .join("");
}

function pintarProximo() {
  const hayProximo = hayDato(DATOS_PROXIMO.titulo);
  // Sin título no se enseña nada del próximo corto, aunque haya otros datos.
  // Una fecha que no se entiende cuenta como vacía.
  const valores = hayProximo
    ? { ...DATOS_PROXIMO, fecha: Number.isNaN(fechaDelProximo()) ? "" : DATOS_PROXIMO.fecha }
    : {};

  document.querySelectorAll("[data-proximo-si-hay]").forEach((bloque) => {
    bloque.hidden = !hayDato(valores[bloque.dataset.proximoSiHay]);
  });

  document.querySelectorAll("[data-proximo]").forEach((elemento) => {
    const campo = elemento.dataset.proximo;
    const valor = valores[campo];
    elemento.hidden = !hayDato(valor);
    if (elemento.hidden) return;

    if (campo === "imagen") {
      // Al repintar por un cambio de idioma la ruta es la misma: no se toca,
      // para no volver a cargar la imagen
      if (elemento.getAttribute("src") !== valor) elemento.src = valor;
      if (elemento.hasAttribute("data-proximo-alt")) elemento.alt = enIdioma(valores.imagenAlt);
      return;
    }

    const texto = enIdioma(valor);
    if (langDe(valor)) {
      elemento.lang = "es";
    } else {
      elemento.removeAttribute("lang");
    }

    // Si el título lleva letras resaltadas, queda partido en varios <span>: el
    // aria-label hace que el lector de pantalla lo lea como una sola palabra
    if (campo === "titulo" && hayDato(valores.resaltar)) {
      elemento.innerHTML = htmlDelTituloResaltado(texto, valores.resaltar);
      elemento.setAttribute("aria-label", texto);
    } else {
      elemento.textContent = texto;
    }
  });

  // En proximamente.html: con póster, póster y texto lado a lado y el título
  // pequeño (el póster ya lo lleva); sin póster, solo el texto con el título en
  // grande. Además, el título de la pestaña y la descripción para buscadores
  // pasan a ser los del próximo corto, como en la ficha de cada corto.
  const bloque = document.querySelector(".proximo");
  if (bloque && hayProximo) {
    bloque.classList.toggle("proximo--con-poster", hayDato(valores.imagen));
    document.title = `${enIdioma(valores.titulo)} · ${t("proximamente.tituloPagina")}`;
    if (hayDato(valores.sinopsis)) {
      document
        .querySelector('meta[name="description"]')
        .setAttribute("content", resumir(enIdioma(valores.sinopsis), 155));
    }
  }
}

// El póster de proximamente.html entra con un fundido desde negro, pero solo
// cuando ya ha cargado: si empezara antes, se vería aparecer de golpe a medias.
// El fundido lo hace el CSS al recibir la clase "cargado" (sin movimiento
// reducido, aparece sin más). Si la imagen falla, se muestra igualmente.
function iniciarPosterProximo() {
  const poster = document.querySelector(".proximo__poster");
  const imagen = poster?.querySelector("img");
  if (!imagen || !imagen.getAttribute("src")) return;

  const mostrar = () => poster.classList.add("cargado");
  if (imagen.complete) {
    mostrar();
  } else {
    imagen.addEventListener("load", mostrar, { once: true });
    imagen.addEventListener("error", mostrar, { once: true });
  }
}

// Cuenta atrás hasta PROXIMO.fecha. Sin fecha, su bloque no se muestra.
function iniciarCuentaAtras() {
  const caja = document.getElementById("cuenta-atras");
  if (!caja) return;

  const objetivo = fechaDelProximo();
  if (!hayDato(DATOS_PROXIMO.titulo) || Number.isNaN(objetivo)) return;

  const poner = (unidad, valor) => {
    caja.querySelector(`[data-unidad="${unidad}"]`).textContent = String(valor).padStart(2, "0");
  };

  let temporizador = null;

  function actualizar() {
    const resto = objetivo - Date.now();

    if (resto <= 0) {
      clearInterval(temporizador);
      // data-i18n hace que este texto también cambie si luego se cambia de idioma
      caja.innerHTML = `<p class="ficha-texto" data-i18n="proximamente.yaEsta">${t("proximamente.yaEsta")}</p>`;
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
   13. EQUIPO
   En estudio.html, una ficha por cada persona de EQUIPO (data.js). Quien no
   tiene foto aparece con sus iniciales dentro de un círculo.
   -------------------------------------------------------------------------- */

// Las iniciales salen de las dos primeras palabras del nombre: "Daniel López" → "DL"
function inicialesDe(nombre) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0))
    .join("")
    .toUpperCase();
}

function pintarEquipo() {
  const lista = document.getElementById("equipo");
  if (!lista) return;

  const personas = LISTA_EQUIPO.filter((persona) => persona && hayDato(persona.nombre));
  lista.closest("section").hidden = personas.length === 0;

  lista.innerHTML = personas
    .map((persona) => {
      const nombre = String(persona.nombre).trim();
      // Las iniciales son decorativas: el nombre ya está escrito debajo
      const retrato = hayDato(persona.foto)
        ? `<img class="equipo__retrato" src="${escaparHTML(persona.foto)}"
                alt="${escaparHTML(t("estudio.retrato", { nombre }))}" width="600" height="600" loading="lazy">`
        : `<span class="equipo__retrato equipo__iniciales" aria-hidden="true">${escaparHTML(
            hayDato(persona.iniciales) ? persona.iniciales : inicialesDe(nombre)
          )}</span>`;
      const rol = hayDato(persona.rol)
        ? `<p class="equipo__rol"${langDe(persona.rol)}>${escaparHTML(enIdioma(persona.rol))}</p>`
        : "";

      return `
        <li class="aparece">
          ${retrato}
          <h3 class="equipo__nombre">${escaparHTML(nombre)}</h3>
          ${rol}
        </li>
      `;
    })
    .join("");
}


/* --------------------------------------------------------------------------
   14. EFECTOS
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

// Parpadeo ocasional, a intervalos irregulares de entre 12 y 30 segundos.
// No salta mientras se está viendo un vídeo, para no oscurecerlo.
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
      if (!document.hidden && !hayVideoSonando()) capa.classList.add("activo");
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
    // si se quiere abrir en otra pestaña o si es una descarga…
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
    fundirVolumen(0, 0.25); // Si suena el ambiente, también se funde
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
   15. PUESTA EN MARCHA
   Primero se traducen los textos y se pinta el contenido, y después los
   efectos, porque las apariciones tienen que encontrar en la página los
   elementos recién creados. Si una función falla, el error se muestra en la
   consola y las demás siguen ejecutándose.
   -------------------------------------------------------------------------- */

function ejecutar(funciones) {
  funciones.forEach((funcion) => {
    try {
      funcion();
    } catch (error) {
      console.error(`Error en ${funcion.name}:`, error);
    }
  });
}

// Funciones que escriben textos: se repiten al cambiar de idioma
const PINTAR_TEXTOS = [
  aplicarTextosFijos,
  pintarDestacado,
  pintarProximo,
  pintarListado,
  pintarDetalle,
  pintarEquipo,
  pintarPrensa,
];

ejecutar([
  aplicarTextosFijos,
  iniciarSelectorIdioma,
  iniciarIntro,
  iniciarMenu,
  iniciarFondoCabecera,
  iniciarSonido,
  iniciarContacto,
  iniciarVideoHero,
  iniciarLinterna,
  pintarDestacado,
  pintarProximo,
  pintarListado,
  iniciarTarjetasTactiles,
  iniciarFiltros,
  pintarDetalle,
  pintarEquipo,
  pintarPrensa,
  iniciarPosterProximo,
  iniciarCuentaAtras,
  iniciarParpadeo,
  iniciarFundidos,
  iniciarApariciones,
]);
