/* ==========================================================================
   DATOS DE LA WEB
   Este es el único archivo que hay que tocar para añadir cortos o cambiar
   los datos de contacto. No hace falta editar ningún HTML.
   ========================================================================== */


/* --------------------------------------------------------------------------
   CONTACTO  ⚠️ PENDIENTE DE RELLENAR
   Mientras un campo esté vacío, su enlace no aparece en el pie y en la página
   de contacto se muestra como "pendiente". El Instagram ya está puesto en los
   HTML porque es un dato conocido.
   -------------------------------------------------------------------------- */
const CONTACTO = {
  email: "",     // Ejemplo: "hola@tudominio.com"
  whatsapp: "",  // Número con prefijo de país, sin "+" ni espacios. Ejemplo: "34XXXXXXXXX"
  ciudad: "",    // Ejemplo: "Sevilla"
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
     titulo: "Mi corto",
     anio: 2027,                  // El de año más alto es el que se destaca en el inicio
     duracion: "12 min",
     sinopsis: "De qué trata.",
     poster: "./img/mi-corto/poster.jpg",  // Vertical, proporción 2:3 (por ejemplo 800×1200)
     trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",  // Vale cualquier enlace de YouTube. Vacío ("") si aún no hay
     direccion: "Nombre Apellido",
     guion: "Nombre Apellido",
     reparto: ["Actriz Uno", "Actor Dos"],
     fotogramas: ["./img/mi-corto/fotograma-1.jpg"],  // Puede estar vacío: []
     festivales: ["Festival, ciudad y año"],          // Puede estar vacío: []
   },

   Cuidado: cada objeto termina con una coma, y las rutas deben coincidir
   exactamente con el nombre del archivo (GitHub Pages distingue mayúsculas).
   -------------------------------------------------------------------------- */
const SHORTS = [
  {
    ejemplo: true,  // Borra esta línea en los cortos reales
    slug: "dejame-subir",
    titulo: "Déjame subir",
    anio: 2026,
    duracion: "11 min",
    sinopsis:
      "Una noche de lluvia suena el telefonillo en el piso de Inés. Es la voz de su madre, que le pide que abra. Pero su madre lleva tres días ingresada a cuarenta kilómetros de allí. Inés no pulsa el botón. La voz insiste con calma y, poco después, empieza a contar los pisos que le quedan por subir.",
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
    titulo: "Repique",
    anio: 2025,
    duracion: "17 min",
    sinopsis:
      "Marta, técnica de sonido, viaja a un pantano para grabar el silencio sobre un pueblo que quedó bajo el agua en los años sesenta. En sus cintas aparece una campana que nadie más oye. Cada vez que repica, una casa del pueblo nuevo deja de contestar al teléfono.",
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
      "Festival de ejemplo de cine fantástico · Selección oficial",
      "Muestra de ejemplo de cortometrajes · Mención especial",
    ],
  },
  {
    ejemplo: true,  // Borra esta línea en los cortos reales
    slug: "lo-que-cruje",
    titulo: "Lo que cruje",
    anio: 2024,
    duracion: "14 min",
    sinopsis:
      "Tras la muerte de su abuela, Álvaro pasa una última noche en la casa familiar antes de venderla. A las tres, la madera del pasillo empieza a crujir: un paso, otro, siempre en el mismo orden. Decide grabarlo. A la mañana siguiente, al escuchar la cinta, entiende el orden: los pasos no se acercan a su habitación. Salen de ella.",
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
    festivales: ["Festival de ejemplo de cine de terror · Selección oficial"],
  },
];
