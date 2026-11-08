# Dark Paradox Studios · Web oficial

Web de **Dark Paradox Studios**, productora independiente de cortometrajes de terror
([@darkparadox_studios_](https://www.instagram.com/darkparadox_studios_/)).

Es una web estática hecha solo con HTML, CSS y JavaScript, sin librerías, sin npm y sin
pasos de compilación. Se publica tal cual en GitHub Pages:
**https://frxnker.github.io/DarkParadox/**

Está en español y en inglés, tiene sonido ambiente opcional y una página de prensa. Incluye el
primer corto del estudio, **«Maleficio»**, completo, y el póster del siguiente, **«SentenZia»**.

---

## Datos pendientes de rellenar

Todos los datos están en `js/data.js`. **Lo que está vacío no se muestra**: no hay textos de
relleno ni avisos de «pendiente». En cuanto rellenas un dato, aparece en la web.

| Qué | Dónde |
|---|---|
| Confirmar el año de «Maleficio» (ahora pone 2026) | `js/data.js` → `SHORTS` → `anio` |
| Dirección, guion y reparto de «Maleficio» | `js/data.js` → `SHORTS` → `direccion`, `guion`, `reparto` |
| Festivales de «Maleficio», cuando los haya | `js/data.js` → `SHORTS` → `festivales` |
| Email, WhatsApp y ciudad (y, si queréis, un email solo para prensa) | `js/data.js` → `CONTACTO` |
| Año de fundación del estudio | `js/data.js` → `ESTUDIO` → `fundacion` |
| Fecha de estreno de «SentenZia» (activa la cuenta atrás) | `js/data.js` → `PROXIMO` → `fecha` |
| Más personas del equipo y sus fotos | `js/data.js` → `EQUIPO` |
| Pósters y fotogramas en alta resolución para prensa (opcional) | `js/data.js` → `posterAlta` y `fotogramasAlta` |

---

## Estructura

```
index.html          Inicio: intro, hero con efecto linterna, último corto y aviso del próximo
cortos.html         Listado de cortos (con buscador y filtros a partir de 4 cortos) y tarjeta del próximo
corto.html          Ficha de un corto, con el vídeo o el tráiler: corto.html?id=slug-del-corto
proximamente.html   Póster y sinopsis del próximo corto, y cuenta atrás (si hay fecha)
estudio.html        Quiénes somos y equipo
prensa.html         Press kit: descripciones, datos clave, logotipos, imágenes y contacto
contacto.html       Instagram, email, WhatsApp y ciudad (enlaces directos)
404.html            Página de error (GitHub Pages la usa automáticamente)
.nojekyll           Archivo vacío: le dice a GitHub Pages que no procese la web con Jekyll
css/styles.css      Todos los estilos (colores y fuentes en variables al principio)
js/data.js          Datos: cortos, próximo corto, equipo, estudio y contacto. Es el archivo que hay que tocar
js/i18n.js          Traducciones al inglés de los textos fijos de los HTML
js/main.js          Toda la lógica: idioma, intro, sonido, menú, listado, ficha, prensa…
img/                Imágenes: una carpeta por corto, más logo, favicon, hero, redes y prensa
video/              Cortos completos en MP4, uno por corto (slug-del-corto.mp4)
```

Cada página carga `data.js`, `i18n.js` y `main.js`, en ese orden. `main.js` tiene un índice
al principio con sus secciones.

---

## Añadir un corto

Solo hay que tocar `js/data.js`, la carpeta `img/` y, si se publica el corto entero, `video/`.
No hace falta editar ningún HTML. Hay dos formas de que se pueda ver en la web:

- **Con vídeo propio**: el corto completo se sube a la web y se ve con el reproductor del navegador.
- **Con YouTube**: el vídeo (o el tráiler) está en YouTube y la web lo incrusta.

### Pasos

1. **Elige un slug**: el identificador del corto en la URL. En minúsculas, sin espacios ni
   tildes, con guiones: `la-casa-del-lago`.

2. **Crea su carpeta de imágenes** `img/la-casa-del-lago/` con:
   - `poster.jpg`: vertical, proporción 2:3 (como 800 × 1200 px).
   - `fotograma-1.jpg`, `fotograma-2.jpg`…: horizontales, 16:9 (como 1280 × 720 px). El primero
     es también la imagen que se ve en el reproductor antes de darle al play.

   Comprime las imágenes antes de subirlas (con [squoosh.app](https://squoosh.app) o similar):
   lo ideal es que cada una pese menos de 200 KB.

3. **Solo con vídeo propio**: pon el corto en `video/la-casa-del-lago.mp4`.
   - Formato **MP4 (H.264 y audio AAC)**, que se reproduce en todos los navegadores.
   - Con [HandBrake](https://handbrake.fr) (gratis) puedes comprimirlo: marca la casilla
     **Web Optimized**, que hace que empiece a reproducirse antes de descargarse entero.
   - **Peso**: GitHub rechaza archivos de más de 100 MB y avisa a partir de 50 MB; intenta que no
     pase de 50 MB. «Maleficio» (2 min a 832 × 464) pesa unos 11 MB. Para cortos largos o en
     alta resolución, mejor súbelos a YouTube y usa la otra forma.

4. **Añade un objeto al array `SHORTS`** de `js/data.js`. Hay una plantilla comentada en el propio
   archivo. Con vídeo propio:

   ```js
   {
     slug: "la-casa-del-lago",
     titulo: { es: "La casa del lago", en: "The Lake House" },
     anio: 2027,
     duracion: "15 min",
     sinopsis: { es: "De qué trata el corto.", en: "What the film is about." },
     inspiracion: "",
     poster: "./img/la-casa-del-lago/poster.jpg",
     video: "./video/la-casa-del-lago.mp4",
     trailerUrl: "",
     direccion: "",
     guion: "",
     produccion: "",
     reparto: [],
     fotogramas: [
       "./img/la-casa-del-lago/fotograma-1.jpg",
       "./img/la-casa-del-lago/fotograma-2.jpg",
     ],
     festivales: [],
   },
   ```

   **Con YouTube**, lo mismo pero con `video: ""` y el enlace en `trailerUrl`:

   ```js
     video: "",
     trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
   ```

Y ya está: el corto aparece en el listado y en la página de prensa, y tiene su ficha en
`corto.html?id=la-casa-del-lago`. Si es el de año más reciente, lleva la etiqueta «Nuevo», pasa a
ser el destacado del inicio y el botón grande del inicio lleva a verlo:

| El corto tiene… | El botón del inicio dice… | Y lleva a… |
|---|---|---|
| `video` | «Ver La casa del lago» / «Watch The Lake House» | `corto.html?id=la-casa-del-lago#ver` (el reproductor) |
| solo `trailerUrl` | «Ver tráiler» | `corto.html?id=la-casa-del-lago#trailer` |
| ninguno | «Ver último corto» | `corto.html?id=la-casa-del-lago` |

### Detalles de cada campo

- Los textos (`titulo`, `sinopsis`, `duracion`, `inspiracion`, cada festival…) pueden ser un texto
  normal (`"Maleficio"`) o un objeto con los dos idiomas (`{ es: "…", en: "…" }`). Si falta el
  inglés, la web en inglés muestra el español. Ver [Idiomas](#idiomas-español-e-inglés).
- **Vacío no se muestra**: `""` o `[]` en cualquier campo opcional hace desaparecer su bloque.
- `duracion` admite `"14 min"`, `"1 h 5 min"` o solo `"14"`. El filtro de duración lee los números
  de ahí: corto (menos de 10 min), medio (de 10 a 20) y largo (más de 20).
- `video`: el corto completo, con los controles del navegador, en 16:9 (si el vídeo tiene otra
  proporción, quedan franjas negras). Solo descarga la duración y el tamaño al abrir la ficha;
  el archivo entero no se descarga hasta que alguien le da al play. Mientras suena, el sonido
  ambiente de la web se calla.
- `trailerUrl` acepta cualquier enlace de YouTube (`watch?v=`, `youtu.be/`, `shorts/`…). La web lo
  convierte sola a `youtube-nocookie.com`. Si el corto tiene `video` y `trailerUrl`, se muestra el
  `video`. Si no tiene ninguno, la ficha no muestra bloque de vídeo.
- **Ficha técnica**: `direccion`, `guion`, `produccion` (sale como «Producción» / «Producer»),
  `reparto`, `duracion` y `anio`. Cada fila vacía se oculta; si no queda ninguna, la ficha entera.
- `inspiracion` (opcional): una nota bajo la sinopsis, como «Inspirado en la película…».
- `fotogramas` y `festivales` pueden quedar vacíos (`[]`): la sección correspondiente no se muestra.
- La web ordena los cortos por año. El orden del array solo importa entre cortos del mismo año: el
  que esté antes se considera el más reciente.
- **Con pocos cortos**: mientras haya menos de 4, el listado no muestra el buscador ni los filtros
  (no hacen falta) y los pósters van centrados. Al llegar a 4 vuelven solos. El número está en
  `POCOS_CORTOS`, al principio de `js/main.js`. La navegación «Anterior / Siguiente» de la ficha
  solo aparece si hay otro corto.
- **Para prensa** (opcional): `posterAlta: "./img/la-casa-del-lago/alta/poster.jpg"` y
  `fotogramasAlta: [...]` (en el mismo orden que `fotogramas`) son las versiones grandes que se
  descargan desde `prensa.html`. Si no las pones, se descargan las de la web.

**Errores típicos**
- Olvidar la coma `,` entre dos objetos. La consola del navegador (F12) mostrará el error; el menú
  seguirá funcionando y el listado mostrará «La sala está vacía».
- Que la ruta no coincida exactamente con el nombre del archivo. GitHub Pages **distingue
  mayúsculas**: `Poster.JPG` no es lo mismo que `poster.jpg`. Usa siempre nombres en minúsculas,
  sin espacios ni tildes.

---

## Próximo corto: `PROXIMO`

El objeto `PROXIMO` de `js/data.js` alimenta cuatro sitios: la página **Próximamente**, el aviso
del inicio (con una miniatura del póster), una tarjeta «Próximamente» al final del listado de
cortos y una sección «Próximamente» en la página de prensa, con el póster para descargar.

| Campo | Qué es |
|---|---|
| `titulo` | El título. **Si está vacío, no se muestra nada del próximo corto** en ningún sitio: Próximamente solo enseña el enlace a Instagram. |
| `resaltar` | Opcional. Letras del título que se pintan en rojo: `"Z"` en «SentenZia». Distingue mayúsculas. |
| `estado` | `{ es: "En desarrollo", en: "In development" }`, `"En rodaje"`, `"En montaje"`… |
| `frase` | Opcional. La frase que cierra el texto de Próximamente y del aviso del inicio. |
| `sinopsis` | `{ es, en }`. Va junto al póster. |
| `fecha` | Opcional. Fecha y hora del estreno, con el formato `"2027-10-31T21:00:00"` (hora local de quien visita la web). Si está, aparece la cuenta atrás; al llegar a cero dice «Ya está aquí». |
| `imagen` | Opcional. El póster: `"./img/sentenzia/poster.jpg"`. **Vertical y en proporción 4:5** (como 1122 × 1402 px), y mejor por debajo de 500 KB. |
| `imagenAlt` | `{ es, en }`. Qué se ve en el póster, para quien no puede verlo (lectores de pantalla). |

**El póster se ve siempre entero**, nunca recortado (lleva el título escrito): en todos los sitios
se muestra con `aspect-ratio: 4 / 5` y `object-fit: contain`. En el listado de cortos ocupa el
mismo hueco que los demás pósters (2:3), centrado sobre negro, para que la rejilla siga alineada.
Esa tarjeta no cuenta como corto: los filtros, el buscador y el número de cortos no la tienen en
cuenta, y siempre va la última.

**En Próximamente** el póster es la pieza principal: en el móvil, a todo el ancho de la pantalla con
el texto debajo (estado, título, sinopsis y frase); en escritorio, póster y texto lado a lado,
centrados en vertical. El título (`<h1>`) es pequeño porque el póster ya lo lleva; está por
accesibilidad y para los buscadores. Efectos, todos en `css/styles.css`, sección «Próximamente»:

- el póster entra con un **fundido desde negro** cuando ha terminado de cargar;
- un **viñeteado que respira** despacio sobre sus bordes, sin llegar al título;
- cada 6 segundos, **un pequeño sacudón** (dos golpes secos), como una puerta que aporrean;
- **arañazos** en las esquinas: un dibujo SVG de unas garras (el `<symbol id="garras">` de
  `proximamente.html`) repetido cuatro veces, lejos del título del póster.

Si el sistema pide reducir el movimiento, el póster aparece sin fundido y quieto. **Sin póster**
(`imagen: ""`), Próximamente muestra solo el texto, con el título en grande.

**Imagen para redes**: `proximamente.html` usa el póster como `og:image` y lleva el título
«SentenZia · Próximamente · Dark Paradox Studios». Las redes no ejecutan JavaScript, así que esas
etiquetas están escritas a mano en el HTML: si cambia el próximo corto, actualízalas.

**Cuando se estrene**: añádelo a `SHORTS` como un corto más (con un póster 2:3, que es el formato
del listado) y cambia `PROXIMO` por el siguiente proyecto (o deja `titulo: ""` para ocultarlo
hasta que lo haya).

---

## Equipo: `EQUIPO`

La sección **Equipo** de `estudio.html` sale del array `EQUIPO` de `js/data.js`. Cada persona es
un objeto; para añadir a alguien, copia el bloque de una persona, pon una coma entre los dos y
cambia los datos:

```js
const EQUIPO = [
  {
    nombre: "Daniel López",
    rol: { es: "Producción", en: "Producer" },
    foto: "",
  },
  {
    nombre: "Nombre de la persona",
    rol: { es: "Dirección y guion", en: "Writer and director" },
    foto: "./img/equipo/nombre-de-la-persona.jpg",
  },
];
```

- `foto` es opcional. Se recorta en círculo y se pasa a blanco y negro, así que puede estar en
  color (cuadrada o vertical, unos 600 × 600 px). Sin foto, se muestra un círculo con las
  iniciales, que salen de las dos primeras palabras del nombre («Daniel López» → «DL»). Si no son
  las que quieres, añade `iniciales: "DL"`.
- Salen en el orden del array. Si el array se queda vacío, la sección Equipo no se muestra.

---

## Idiomas (español e inglés)

La web no tiene páginas duplicadas: cada HTML está escrito en español y `main.js` lo traduce al
inglés al pulsar **EN** en la cabecera. El idioma inicial se elige así:

1. Si la URL lleva `?lang=en` o `?lang=es`, ese (sirve para mandar enlaces ya en inglés, como a
   un festival: `https://frxnker.github.io/DarkParadox/?lang=en`).
2. Si no, el último que se eligió en este navegador (se guarda en `localStorage`).
3. Si no, el del navegador: el primero de su lista de idiomas que sea español o inglés. Si no hay
   ninguno de los dos, español.

Al cambiar de idioma se actualizan también `<html lang>`, el título de la pestaña y la meta
description. Si el corto se está reproduciendo, sigue por donde iba. Si JavaScript falla, la web
se ve en español.

### Textos fijos de los HTML: `js/i18n.js`

Cada texto traducible lleva un atributo con una **clave**:

```html
<h1 data-i18n="cortos.titulo">Cortos</h1>
<input placeholder="Título o sinopsis" data-i18n-placeholder="filtros.buscarPista">
```

Y en `js/i18n.js` esa clave tiene su texto en cada idioma:

```js
es: { "cortos.titulo": "Cortos", … },
en: { "cortos.titulo": "Films", … },
```

- `data-i18n` cambia el texto del elemento. Úsalo solo en elementos que tengan **solo texto**
  dentro (sin otras etiquetas), porque lo sustituye entero.
- `data-i18n-aria-label`, `data-i18n-alt`, `data-i18n-placeholder`, `data-i18n-title` y
  `data-i18n-content` cambian el atributo con ese nombre.
- Las palabras entre llaves, como `{titulo}`, se rellenan con un dato.

**Para cambiar un texto** que ya existe: cámbialo en el HTML (es lo que se ve si falla
JavaScript) y en las dos partes de `js/i18n.js`. Los textos de «Quiénes somos» de la página
Estudio son las claves `estudio.quienesTexto` y `estudio.cortosTexto`.

**Para añadir un texto nuevo**: ponle al elemento `data-i18n="pagina.algo"` e inventa la clave;
después añade `"pagina.algo": "…"` en `es` y en `en`. Si se te olvida el inglés, se mostrará el
español.

### Textos de los cortos, el próximo corto, el equipo y el estudio: `js/data.js`

Se traducen en el propio dato, como se explica en [Añadir un corto](#añadir-un-corto). Se pueden
ir traduciendo poco a poco: lo que no tenga `en` se muestra en español (marcado con `lang="es"`
para que los lectores de pantalla lo pronuncien bien).

---

## Funciones de la web

### Intro de cine
La primera vez que alguien entra en la web en cada sesión, el logo aparece sobre negro con el
parpadeo de un proyector y se funde (menos de 3 segundos). Se salta tocando la pantalla o pulsando
cualquier tecla. Se recuerda en `sessionStorage` (se olvida al cerrar la pestaña) y no aparece si
el sistema pide reducir el movimiento. Las animaciones están en `css/styles.css` (busca `.intro`).

### Efecto linterna
En el inicio, la imagen del hero queda casi a oscuras y un círculo de luz sigue al ratón o al dedo.
Si nadie la mueve, la luz deriva sola despacio. El CSS dibuja la oscuridad con un
`radial-gradient` y `main.js` solo actualiza las variables `--luz-x` y `--luz-y`. El tamaño del
círculo es `--radio-luz`, en la regla `.hero` del CSS. El texto queda siempre por encima de un
degradado oscuro, así que se lee igual. Sin efecto si se pide reducir el movimiento.

### Sonido ambiente
El botón del altavoz de la cabecera enciende un ambiente de terror. Está **apagado por defecto** y
nunca empieza a sonar solo.

No usa ningún archivo de audio (no hay nada que descargar ni derechos que pagar): se genera en el
navegador con la **Web Audio API** mezclando tres capas, todas en la sección «Sonido ambiente» de
`main.js`:

- **Zumbido** (`crearZumbido`): dos notas graves casi iguales (55 y 55,6 Hz) que «baten» entre sí,
  más una octava por encima para que se oiga en los altavoces del móvil.
- **Viento** (`crearViento`): ruido marrón pasado por un filtro cuyo tono y volumen cambian muy
  despacio, como rachas.
- **Crujidos** (`crearCrujido`): un tono áspero y muy grave, filtrado y troceado, que suena cada
  5 a 15 segundos, a un lado u otro.

El volumen sube en 2,5 segundos al encender y baja en 1,2 al apagar o al cambiar de página. La
elección se guarda en `localStorage`: si se deja encendido, en la página siguiente el botón sale
activado y el sonido vuelve con el primer clic, toque o tecla (los navegadores no dejan que una
página suene sin que la persona haga algo antes). Se pausa con la pestaña en segundo plano.

**Con vídeos**: al darle al play al corto completo, el ambiente se funde a silencio y el botón se
apaga; vuelve solo cuando el vídeo se pausa o termina. Con un tráiler de YouTube se apaga al pulsar
dentro, pero no puede volver solo (la web no sabe cuándo para un vídeo de YouTube): se vuelve a
encender con el botón. El volumen general se cambia en `VOLUMEN_SONIDO`.

En iPhone, si el interruptor de silencio está activado, no se oye: es el comportamiento normal de
Safari con la Web Audio API.

### Buscador y filtros (cortos.html)
Aparecen a partir de 4 cortos. Buscan en el título y la sinopsis (en los dos idiomas, sin importar
tildes ni mayúsculas) y filtran por año y duración; se puede ordenar por más recientes, más
antiguos o A-Z. Todo cambia al momento y queda guardado en la URL para poder compartir una
búsqueda: `cortos.html?q=casa&anio=2027&duracion=medio&orden=az`. Si no hay resultados, sale un
mensaje con un botón para limpiar los filtros. La tarjeta «Próximamente» del final no se filtra
ni se cuenta.

### Ficha de un corto (corto.html)
- **Vídeo**: el corto completo (`video`) o el tráiler de YouTube (`trailerUrl`). Ver
  [Detalles de cada campo](#detalles-de-cada-campo).
- **Anterior / Siguiente** al final: llevan al corto estrenado justo antes y justo después. Con un
  solo corto no aparecen.
- **Compartir**: en los navegadores con menú de compartir propio (la mayoría de móviles) hay un
  solo botón que lo abre. En los demás aparecen WhatsApp, X y «Copiar enlace», que avisa con
  «Enlace copiado». Si la web está en inglés, el enlace compartido lleva `?lang=en`.
- El título de la pestaña y la meta description cambian según el corto (la descripción se recorta
  a 155 caracteres).

### Prensa (prensa.html)
- **Descripciones** corta y larga en español e inglés, cada una con su botón de copiar
  (`ESTUDIO` en `data.js`).
- **Datos clave**: fundación (`ESTUDIO.fundacion`), ciudad (`CONTACTO.ciudad`), número de cortos y
  de selecciones en festivales, que se cuentan solos a partir de `SHORTS`. Solo aparecen los que
  tienen dato (un cero cuenta como vacío).
- **Logotipo** en SVG y PNG (1024 × 1024, fondo transparente), versión clara para fondos oscuros y
  oscura para fondos claros, en `img/prensa/`. Para cambiarlos, sustituye los archivos manteniendo
  los nombres.
- **Pósters y fotogramas** de todos los cortos, para descargar con un nombre claro
  (`maleficio-fotograma-2.jpg`).
- **Próximamente**: el póster del próximo corto (`PROXIMO.imagen`), para descargar como
  `sentenzia-poster.jpg`. Sin póster, la sección no aparece.
- **Contacto de prensa**: `CONTACTO.emailPrensa` o, si está vacío, `CONTACTO.email`, más WhatsApp
  e Instagram. El email y el WhatsApp solo aparecen si están rellenos.

---

## Otros cambios habituales

- **Email, WhatsApp y ciudad**: rellena `CONTACTO` en `js/data.js`. El WhatsApp va con prefijo de
  país y sin `+`, como `"34612345678"`. Mientras un campo esté vacío, no aparece en ninguna página
  (pie, contacto ni prensa). El Instagram está escrito directamente en los HTML.
- **Vídeo del hero**: sustituye `img/hero.mp4` por un clip propio en MP4 (H.264), sin sonido, de
  pocos segundos, que se repita bien y que pese menos de 3 MB. Pon un fotograma suyo en
  `img/hero.jpg`, que se ve mientras carga. Si prefieres solo imagen, borra la línea `<source>` de
  `index.html`. El vídeo no se reproduce si el sistema pide menos movimiento o ahorro de datos.
- **Imagen para redes** (la que sale al compartir un enlace): `img/og-image.jpg`, de 1200 × 630 px.
- **Colores y fuentes**: están en las variables del principio de `css/styles.css`.

---

## Ver la web en tu ordenador

Puedes abrir `index.html` con doble clic y casi todo funciona. Pero YouTube no reproduce los
vídeos en páginas abiertas así (sin servidor) y muestra un error de configuración del reproductor.
Para probarlo todo, usa un servidor local:

- **VS Code**: instala la extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Python**: abre una terminal en la carpeta y ejecuta `python3 -m http.server`. En Windows suele
  ser `python -m http.server` (`python3` puede abrir la Microsoft Store en lugar de Python).
  Después entra en http://localhost:8000

Para volver a ver la intro, cierra la pestaña y abre otra. Para probar el inglés sin tocar nada,
añade `?lang=en` a la dirección.

---

## Publicar en GitHub Pages

1. Sube los cambios a la rama `main` del repositorio:
   ```
   git add .
   git commit -m "Describe el cambio"
   git push
   ```
2. En GitHub, entra en el repositorio → **Settings** → **Pages**.
3. En *Build and deployment*, elige **Source: Deploy from a branch**.
4. En *Branch*, elige **main** y la carpeta **/ (root)**. Pulsa **Save**.
5. Espera uno o dos minutos. La web estará en **https://frxnker.github.io/DarkParadox/**

A partir de ahí, cada `git push` a `main` actualiza la web sola en uno o dos minutos. En la pestaña
*Actions* del repositorio puedes ver el progreso de cada publicación.

**Límites de GitHub para los vídeos**: cada archivo debe pesar menos de 100 MB (mejor menos de
50 MB), la web entera menos de 1 GB y el tráfico recomendado es de unos 100 GB al mes. Con muchos
cortos o muy largos, es mejor alojarlos en YouTube.

### Por qué todas las rutas son relativas

En GitHub Pages la web no vive en la raíz del dominio, sino en la subcarpeta `/DarkParadox/`. Una
ruta como `/css/styles.css` apuntaría a `frxnker.github.io/css/styles.css`, que no existe. Por eso
todas las rutas empiezan por `./` (`./css/styles.css`, `./img/logo.svg`, `./video/maleficio.mp4`).
**No escribas nunca rutas que empiecen por `/`.**

Hay dos excepciones que no son rutas internas:
- **`og:image`** (la imagen que sale al compartir un enlace en redes y WhatsApp). Tiene que ser una
  URL completa (`https://frxnker.github.io/DarkParadox/img/og-image.jpg`), porque las redes no
  entienden rutas relativas. Si cambias de usuario o de nombre de repositorio, actualízala en los
  8 HTML (en `proximamente.html` apunta al póster: `.../img/sentenzia/poster.jpg`).
- **`404.html`**. GitHub Pages la muestra en *cualquier* dirección inexistente, por profunda que
  sea. Un pequeño script al principio calcula la carpeta raíz de la web para que sus rutas
  relativas sigan funcionando. Está explicado en el propio archivo.

Al compartir un corto concreto, la vista previa muestra los datos generales de la web, no los del
corto, y siempre en español. Las redes no ejecutan JavaScript, y la ficha de cada corto y la
traducción se generan con JavaScript. Por eso las descripciones para redes (`og:description`) de
cada HTML están escritas a mano: si cambian los cortos, revísalas.

---

## Accesibilidad y efectos

- El grano de película, el viñeteado, el parpadeo ocasional, el glitch del logo, los fundidos, las
  apariciones al hacer scroll, la intro de cine, el efecto linterna y el fundido, el sacudón y el
  viñeteado del póster de Próximamente se desactivan si el sistema tiene activada la opción de
  reducir el movimiento
  (`prefers-reduced-motion`). Los parpadeos son suaves y no superan el límite de destellos por
  segundo de las pautas de accesibilidad, y el parpadeo ocasional no salta mientras se ve un vídeo.
- Sin sustos. El único sonido es el ambiente opcional, apagado hasta que alguien lo enciende.
- El rojo de la marca (`#8B0000`) solo tiene un contraste de 2:1 sobre el negro, así que nunca se
  usa para texto sobre negro: solo como fondo de botones y etiquetas (con texto blanco roto, 8:1),
  bordes y detalles. El texto es blanco roto (16:1) o gris (8:1). La única excepción son las
  letras resaltadas de un título muy grande (la Z de «SentenZia»), que usan un rojo más vivo
  (`--sangre-viva`, 3,4:1, por encima del 3:1 que piden las pautas para el texto grande).
- Todo se puede usar con el teclado. El primer tabulador lleva a «Saltar al contenido».
- Botones y enlaces miden al menos 44 px.
- Los botones de idioma y de sonido indican su estado con `aria-pressed`. Los avisos como «Enlace
  copiado» y el número de resultados de los filtros se anuncian a los lectores de pantalla.
- El menú aparece en línea a partir de 1024 px; por debajo, con el botón de hamburguesa.
- En el móvil, el primer toque sobre un póster muestra sus datos y el segundo entra en el corto.
  Si prefieres que un solo toque entre directamente, borra la función `iniciarTarjetasTactiles` de
  `js/main.js` y la línea que la llama (en la lista del final del archivo).

---

## Créditos

- Fuentes: [IM Fell English](https://fonts.google.com/specimen/IM+Fell+English),
  [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) y
  [Special Elite](https://fonts.google.com/specimen/Special+Elite), de Google Fonts (licencia OFL).
- El sonido ambiente y los arañazos de Próximamente se generan con código y no usan material de
  terceros.
