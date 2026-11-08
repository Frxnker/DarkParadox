/* ==========================================================================
   DATOS DE LA WEB
   Este es el único archivo que hay que tocar para añadir cortos, cambiar el
   próximo estreno o el equipo, o rellenar los datos de contacto y de prensa.
   No hace falta editar ningún HTML.

   TEXTOS EN DOS IDIOMAS
   Cualquier texto de aquí (titulo, sinopsis, duracion, festivales…) puede ser:
     - un texto normal:          titulo: "Maleficio"
     - un objeto con los dos:    estado: { es: "En desarrollo", en: "In development" }
   Si falta el inglés, la web en inglés muestra el español. Así que no hace
   falta traducirlo todo a la vez.

   DATOS VACÍOS
   Un dato vacío ("" o []) no se muestra: desaparece su bloque entero, sin
   textos de relleno. En cuanto lo escribas aquí, aparece en la web.
   ========================================================================== */


/* --------------------------------------------------------------------------
   CONTACTO
   Mientras un campo esté vacío, su enlace no aparece en ninguna página.
   El Instagram está escrito directamente en los HTML.
   -------------------------------------------------------------------------- */
const CONTACTO = {
  email: "",       // Formato: "hola@tudominio.com"
  emailPrensa: "", // Opcional, solo para la página de prensa. Si está vacío, se usa el de arriba
  whatsapp: "",    // Con prefijo de país, sin "+" ni espacios. Formato: "34612345678"
  ciudad: "",      // Formato: "Sevilla"
};


/* --------------------------------------------------------------------------
   ESTUDIO (página de prensa)
   El número de cortos y de selecciones en festivales se calcula solo a partir
   de SHORTS.
   -------------------------------------------------------------------------- */
const ESTUDIO = {
  fundacion: "", // Año de fundación, como 2025. Vacío: no se muestra
  // Una frase, para notas breves y programas de festival
  descripcionCorta: {
    es: "Dark Paradox Studios es una productora independiente de cortometrajes de terror.",
    en: "Dark Paradox Studios is an independent production company making horror short films.",
  },
  // Un párrafo, para artículos y dosieres
  descripcionLarga: {
    es: "Dark Paradox Studios es una productora independiente de cortometrajes de terror. Su primer corto, «Maleficio», sigue a un chico que una tarde cualquiera enciende la tele y encuentra en la pantalla un símbolo que no debería estar ahí; desde ese momento, algo empieza a moverse por la casa. Su siguiente cortometraje, «SentenZia», ya está en desarrollo.",
    en: "Dark Paradox Studios is an independent production company making horror short films. Its first short, “Maleficio”, follows a boy who turns on the TV one ordinary afternoon and finds a symbol on the screen that shouldn't be there; from that moment on, something starts moving through the house. Its next short film, “SentenZia”, is already in development.",
  },
};


/* --------------------------------------------------------------------------
   EQUIPO (página Estudio)
   Una persona por objeto, en el orden en que deben aparecer. Para añadir a
   alguien, copia el bloque de una persona, pon una coma entre los dos y
   cambia los datos:
     nombre:    tal cual se escribe.
     rol:       { es: "Dirección", en: "Director" }, o un texto si no hay traducción.
     foto:      opcional, como "./img/equipo/nombre-apellido.jpg". Se
                recorta en círculo y se pasa a blanco y negro. Vacía (""): se
                muestra un círculo con las iniciales.
     iniciales: opcional. Si no se ponen, salen de las dos primeras palabras
                del nombre ("Daniel López" → "DL").
   Si el array se queda vacío, la sección Equipo no se muestra.
   -------------------------------------------------------------------------- */
const EQUIPO = [
  {
    nombre: "Daniel López",
    rol: { es: "Producción", en: "Producer" },
    foto: "",
  },
];


/* --------------------------------------------------------------------------
   CORTOS

   CÓMO AÑADIR UN CORTO
   1. Crea la carpeta img/slug-del-corto/ con el póster y los fotogramas.
   2. Si vas a publicar el corto entero en la web, pon el vídeo en
      video/slug-del-corto.mp4. Si solo hay tráiler en YouTube, no hace falta.
   3. Copia esta plantilla dentro del array SHORTS y rellénala. Lo que todavía
      no tengas, déjalo vacío ("" o []): no se muestra.

   {
     slug: "mi-corto",            // Identificador para la URL: minúsculas, sin espacios ni tildes
     titulo: { es: "Mi corto", en: "My Short Film" },  // O solo "Mi corto" si no hay traducción
     anio: 2027,                  // El de año más alto es el "Nuevo" y el que se destaca en el inicio
     duracion: "12 min",          // También vale "1 h 5 min". Los filtros leen los números de aquí
     sinopsis: { es: "De qué trata.", en: "What it's about." },
     inspiracion: { es: "Inspirado en…", en: "Inspired by…" },  // Opcional: nota bajo la sinopsis
     poster: "./img/mi-corto/poster.jpg",  // Vertical, proporción 2:3 (como 800×1200)

     // Para verlo en la web, rellena uno de estos dos (si están los dos, se usa
     // el vídeo; si no hay ninguno, el bloque de vídeo no aparece):
     video: "./video/mi-corto.mp4",  // El corto completo, en la propia web (MP4 H.264)
     trailerUrl: "",                 // Un enlace de YouTube, en cualquier formato

     direccion: "",               // Nombres tal cual. Cada fila vacía de la ficha técnica no se muestra
     guion: "",
     produccion: "",
     reparto: [],                 // Nombres entre comillas y separados por comas
     fotogramas: ["./img/mi-corto/fotograma-1.jpg"],  // Horizontales. El primero es también la imagen del reproductor
     festivales: [],              // Un texto por selección: "Festival, ciudad y año"

     // Opcional, para la página de prensa: versiones en alta resolución para
     // descargar. Si no las pones, se descargan las de la web.
     posterAlta: "./img/mi-corto/alta/poster.jpg",
     fotogramasAlta: ["./img/mi-corto/alta/fotograma-1.jpg"],  // En el mismo orden que fotogramas
   },

   Cuidado: cada objeto termina con una coma, y las rutas deben coincidir
   exactamente con el nombre del archivo (GitHub Pages distingue mayúsculas).
   -------------------------------------------------------------------------- */
const SHORTS = [
  {
    slug: "maleficio",
    titulo: { es: "Maleficio", en: "Maleficio" },
    anio: 2026, // POR CONFIRMAR: año de estreno de «Maleficio»
    duracion: "2 min",
    sinopsis: {
      es: "Una tarde cualquiera, un chico enciende la tele. En la pantalla aparece un símbolo que no debería estar ahí. Desde ese momento, algo empieza a moverse por la casa.",
      en: "An ordinary afternoon, a boy turns on the TV. A symbol appears on the screen that shouldn't be there. From that moment on, something starts moving through the house.",
    },
    inspiracion: {
      es: "Inspirado en la película Maleficio (Incantation, 2022)",
      en: "Inspired by the film Incantation (2022)",
    },
    poster: "./img/maleficio/poster.jpg",
    video: "./video/maleficio.mp4",
    trailerUrl: "",
    direccion: "",
    guion: "",
    produccion: "Daniel López",
    reparto: [],
    fotogramas: [
      "./img/maleficio/fotograma-1.jpg",
      "./img/maleficio/fotograma-2.jpg",
      "./img/maleficio/fotograma-3.jpg",
    ],
    festivales: [],
  },
];


/* --------------------------------------------------------------------------
   PRÓXIMO CORTO
   Sale en la página Próximamente, en el aviso del inicio, al final del
   listado de cortos (con su póster) y en la página de prensa.
   Si titulo está vacío, no se muestra nada de él en ningún sitio.
   -------------------------------------------------------------------------- */
const PROXIMO = {
  titulo: "SentenZia",
  resaltar: "Z", // Opcional: letras del título que se pintan en rojo (distingue mayúsculas)
  estado: { es: "En desarrollo", en: "In development" },
  // Opcional: la frase que cierra el texto de Próximamente y del aviso del inicio
  frase: {
    es: "Algo está golpeando la puerta.",
    en: "Something is pounding on the door.",
  },
  sinopsis: {
    es: "Dani consigue cerrar la puerta justo a tiempo. Fuera, los golpes no paran. Dentro, la casa es lo único que le queda: tiene que encontrar comida y munición antes de que sea demasiado tarde. Aunque quizá ya lo sea.",
    en: "Dani manages to shut the door just in time. Outside, the pounding won't stop. Inside, the house is all he has left: he must find food and ammo before it's too late. Though maybe it already is.",
  },
  // Opcional: fecha y hora del estreno para la cuenta atrás, con el formato
  // "2027-10-31T21:00:00" (hora local de quien visita la web). Vacía: sin cuenta atrás
  fecha: "",
  // Opcional: el póster. Vertical y en proporción 4:5 (como 1122×1402); se
  // muestra siempre entero, nunca recortado. Vacío: Próximamente enseña solo el
  // texto, con el título en grande, y no aparece en el listado ni en prensa.
  // Si lo cambias, cambia también el og:image de proximamente.html.
  imagen: "./img/sentenzia/poster.jpg",
  // Texto alternativo del póster: qué se ve en él, para quien no puede verlo
  imagenAlt: {
    es: "Póster de SentenZia: un brazo vendado y ensangrentado se apoya en el suelo junto al título en rojo",
    en: "SentenZia poster: a bandaged, bloodied arm rests on the floor beside the title in red",
  },
};
