/* ==========================================================================
   DATOS DE LA WEB
   Este es el único archivo que hay que tocar para añadir cortos o cambiar
   los datos de contacto y de prensa. No hace falta editar ningún HTML.

   TEXTOS EN DOS IDIOMAS
   Cualquier texto de aquí (titulo, sinopsis, duracion, festivales…) puede ser:
     - un texto normal:          titulo: "Repique"
     - un objeto con los dos:    titulo: { es: "Repique", en: "The Tolling" }
   Si falta el inglés, la web en inglés muestra el español. Así que no hace
   falta traducirlo todo a la vez.
   ========================================================================== */


/* --------------------------------------------------------------------------
   CONTACTO  ⚠️ PENDIENTE DE RELLENAR
   Mientras un campo esté vacío, su enlace no aparece en el pie y en las
   páginas de contacto y de prensa se muestra como "pendiente". El Instagram
   ya está puesto en los HTML porque es un dato conocido.
   -------------------------------------------------------------------------- */
const CONTACTO = {
  email: "",       // Ejemplo: "hola@tudominio.com"
  emailPrensa: "", // Opcional, para la página de prensa. Si está vacío, se usa el email de arriba
  whatsapp: "",    // Número con prefijo de país, sin "+" ni espacios. Ejemplo: "34XXXXXXXXX"
  ciudad: "",      // Ejemplo: "Sevilla"
};


/* --------------------------------------------------------------------------
   ESTUDIO (página de prensa)  ⚠️ CONTENIDO DE EJEMPLO
   La descripción larga y el año de fundación son inventados. Mientras quede
   "ejemplo: true", la página de prensa los marca con la etiqueta "Ejemplo".
   El número de cortos y de festivales se calcula solo a partir de SHORTS.
   -------------------------------------------------------------------------- */
const ESTUDIO = {
  ejemplo: true, // Borra esta línea cuando los textos y el año sean los reales
  fundacion: 2023,
  // Una frase, para notas breves y programas de festival
  descripcionCorta: {
    es: "Dark Paradox Studios es una productora independiente de cortometrajes de terror.",
    en: "Dark Paradox Studios is an independent production company making horror short films.",
  },
  // Un párrafo, para artículos y dosieres
  descripcionLarga: {
    es: "Dark Paradox Studios es una productora independiente de cortometrajes de terror. Trabaja con equipos pequeños, pocas luces y mucha paciencia para construir un miedo que no depende de los sustos, sino de la duda que se queda después: un telefonillo que suena de madrugada, una campana bajo el agua, un pasillo que cruje en el orden equivocado. Sus cortos recorren festivales de cine fantástico y de terror, y su próximo proyecto ya está en desarrollo.",
    en: "Dark Paradox Studios is an independent production company making horror short films. It works with small crews, few lights and plenty of patience to build a kind of fear that doesn't rely on jump scares, but on the doubt that lingers afterwards: an intercom buzzing in the middle of the night, a bell beneath the water, a hallway that creaks in the wrong order. Its films travel the fantasy and horror festival circuit, and its next project is already in development.",
  },
};


/* --------------------------------------------------------------------------
   CORTOS

   ⚠️ LOS TRES CORTOS DE ABAJO SON CONTENIDO DE EJEMPLO INVENTADO: títulos,
   sinopsis, equipo, festivales e imágenes. Hay que sustituirlos por los reales.
   Mientras tengan "ejemplo: true", la web les pone una etiqueta visible
   de "Ejemplo" para que nadie los confunda con cortos de verdad.

   CÓMO AÑADIR UN CORTO
   1. Crea la carpeta img/slug-del-corto/ con sus imágenes.
   2. Copia esta plantilla dentro del array SHORTS y rellénala:

   {
     slug: "mi-corto",            // Identificador para la URL: minúsculas, sin espacios ni tildes
     titulo: { es: "Mi corto", en: "My Short Film" },  // O solo "Mi corto" si no hay traducción
     anio: 2027,                  // El de año más alto es el "Nuevo" y el que se destaca en el inicio
     duracion: "12 min",          // También vale "1 h 5 min". Los filtros leen los números de aquí
     sinopsis: { es: "De qué trata.", en: "What it's about." },
     poster: "./img/mi-corto/poster.jpg",  // Vertical, proporción 2:3 (por ejemplo 800×1200)
     trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",  // Vale cualquier enlace de YouTube. Vacío ("") si aún no hay
     direccion: "Nombre Apellido",
     guion: "Nombre Apellido",
     reparto: ["Actriz Uno", "Actor Dos"],
     fotogramas: ["./img/mi-corto/fotograma-1.jpg"],  // Puede estar vacío: []
     festivales: ["Festival, ciudad y año"],          // Puede estar vacío: []

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
    ejemplo: true,  // Borra esta línea en los cortos reales
    slug: "dejame-subir",
    titulo: { es: "Déjame subir", en: "Let Me Come Up" },
    anio: 2026,
    duracion: "11 min",
    sinopsis: {
      es: "Una noche de lluvia suena el telefonillo en el piso de Inés. Es la voz de su madre, que le pide que abra. Pero su madre lleva tres días ingresada a cuarenta kilómetros de allí. Inés no pulsa el botón. La voz insiste con calma y, poco después, empieza a contar los pisos que le quedan por subir.",
      en: "One rainy night, the intercom buzzes in Inés's flat. It's her mother's voice, asking her to open the door. But her mother has been in hospital for three days, forty kilometres away. Inés doesn't press the button. The voice insists, calmly, and soon starts counting the floors it still has to climb.",
    },
    poster: "./img/dejame-subir/poster.jpg",
    // Vídeo de prueba para ver funcionar el reproductor: «Sintel», de la Blender Foundation (CC BY). Sustituir.
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    direccion: "Nombre Apellido",
    guion: "Nombre Apellido",
    reparto: ["Intérprete Uno", "Intérprete Dos"],
    fotogramas: [
      "./img/dejame-subir/fotograma-1.jpg",
      "./img/dejame-subir/fotograma-2.jpg",
      "./img/dejame-subir/fotograma-3.jpg",
    ],
    festivales: [],
  },
  {
    ejemplo: true,  // Borra esta línea en los cortos reales
    slug: "repique",
    titulo: { es: "Repique", en: "The Tolling" },
    anio: 2025,
    duracion: "17 min",
    sinopsis: {
      es: "Marta, técnica de sonido, viaja a un pantano para grabar el silencio sobre un pueblo que quedó bajo el agua en los años sesenta. En sus cintas aparece una campana que nadie más oye. Cada vez que repica, una casa del pueblo nuevo deja de contestar al teléfono.",
      en: "Marta, a sound recordist, travels to a reservoir to record the silence above a village that was flooded in the sixties. A bell that no one else can hear turns up on her tapes. Every time it tolls, another house in the new village stops answering the phone.",
    },
    poster: "./img/repique/poster.jpg",
    // Vídeo de prueba: «Sintel», de la Blender Foundation (CC BY). Sustituir.
    trailerUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    direccion: "Nombre Apellido",
    guion: "Nombre Apellido",
    reparto: ["Intérprete Uno"],
    fotogramas: [
      "./img/repique/fotograma-1.jpg",
      "./img/repique/fotograma-2.jpg",
      "./img/repique/fotograma-3.jpg",
    ],
    festivales: [
      {
        es: "Festival de ejemplo de cine fantástico · Selección oficial",
        en: "Example fantasy film festival · Official selection",
      },
      {
        es: "Muestra de ejemplo de cortometrajes · Mención especial",
        en: "Example short film showcase · Special mention",
      },
    ],
  },
  {
    ejemplo: true,  // Borra esta línea en los cortos reales
    slug: "lo-que-cruje",
    titulo: { es: "Lo que cruje", en: "What Creaks" },
    anio: 2024,
    duracion: "14 min",
    sinopsis: {
      es: "Tras la muerte de su abuela, Álvaro pasa una última noche en la casa familiar antes de venderla. A las tres, la madera del pasillo empieza a crujir: un paso, otro, siempre en el mismo orden. Decide grabarlo. A la mañana siguiente, al escuchar la cinta, entiende el orden: los pasos no se acercan a su habitación. Salen de ella.",
      en: "After his grandmother's death, Álvaro spends one last night in the family house before selling it. At three in the morning, the hallway floorboards begin to creak: one step, then another, always in the same order. He decides to record it. The next morning, listening to the tape, he understands the order: the footsteps aren't coming towards his room. They're leaving it.",
    },
    poster: "./img/lo-que-cruje/poster.jpg",
    trailerUrl: "",  // Sin tráiler: la web muestra un aviso en su lugar
    direccion: "Nombre Apellido",
    guion: "Nombre Apellido",
    reparto: ["Intérprete Uno", "Intérprete Dos", "Intérprete Tres"],
    fotogramas: [
      "./img/lo-que-cruje/fotograma-1.jpg",
      "./img/lo-que-cruje/fotograma-2.jpg",
      "./img/lo-que-cruje/fotograma-3.jpg",
    ],
    festivales: [
      {
        es: "Festival de ejemplo de cine de terror · Selección oficial",
        en: "Example horror film festival · Official selection",
      },
    ],
  },
];
