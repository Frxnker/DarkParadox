# Dark Paradox Studios · Web oficial

Web de **Dark Paradox Studios**, productora independiente de cortometrajes de terror
([@darkparadox_studios_](https://www.instagram.com/darkparadox_studios_/)).

Es una web estática hecha solo con HTML, CSS y JavaScript, sin librerías, sin npm y sin
pasos de compilación. Se publica tal cual en GitHub Pages:
**https://frxnker.github.io/DarkParadox/**

Está en español y en inglés, tiene sonido ambiente opcional y una página de prensa.

---

## Antes de publicar: qué falta por rellenar

La web incluye **contenido de ejemplo** para que se vea completa. Mientras siga ahí, aparece
marcado con la etiqueta «Ejemplo» o «Contenido de ejemplo».

| Qué | Dónde |
|---|---|
| Los 3 cortos de ejemplo (títulos, sinopsis y sus traducciones, equipo, festivales) | `js/data.js` → `SHORTS` |
| Email, WhatsApp y ciudad (y, si queréis, un email solo para prensa) | `js/data.js` → `CONTACTO` |
| Año de fundación y descripciones corta y larga del estudio (ES y EN) | `js/data.js` → `ESTUDIO` |
| Tráileres: ahora usan «Sintel» (Blender Foundation, CC BY) como vídeo de prueba | `js/data.js` → `trailerUrl` |
| Pósters, fotogramas, fotos del equipo y vídeo del hero (son dibujos generados) | carpeta `img/` |
| Pósters y fotogramas en alta resolución para prensa (opcional) | `js/data.js` → `posterAlta` y `fotogramasAlta` |
| Logotipos para prensa, si tenéis una versión oficial distinta | carpeta `img/prensa/` |
| Nombres y roles del equipo | `estudio.html` (y los roles en inglés en `js/i18n.js`) |
| Corto en desarrollo y fecha de la cuenta atrás | `proximamente.html` (y sus textos en inglés en `js/i18n.js`) |
| Identificador de Formspree del formulario | `contacto.html` |

---

## Estructura

```
index.html          Inicio: intro, hero con efecto linterna y último corto destacado
cortos.html         Listado de cortos con buscador y filtros (se genera desde js/data.js)
corto.html          Ficha de un corto: corto.html?id=slug-del-corto
proximamente.html   Teaser del corto en desarrollo y cuenta atrás
estudio.html        Quiénes somos y equipo
prensa.html         Press kit: descripciones, datos clave, logotipos, imágenes y contacto
contacto.html       Email, WhatsApp, Instagram y formulario
404.html            Página de error (GitHub Pages la usa automáticamente)
.nojekyll           Archivo vacío: le dice a GitHub Pages que no procese la web con Jekyll
css/styles.css      Todos los estilos (colores y fuentes en variables al principio)
js/data.js          Datos: cortos, contacto y estudio. Es el archivo que hay que tocar a diario
js/i18n.js          Traducciones al inglés de los textos fijos de los HTML
js/main.js          Toda la lógica: idioma, intro, sonido, menú, listado, ficha, prensa…
img/                Imágenes: una carpeta por corto, más logo, favicon, hero, equipo y prensa
```

Cada página carga `data.js`, `i18n.js` y `main.js`, en ese orden. `main.js` tiene un índice
al principio con sus secciones.

---

## Añadir un corto

Solo hay que tocar `js/data.js` y la carpeta `img/`. No hace falta editar ningún HTML.

1. **Elige un slug**: el identificador del corto en la URL. En minúsculas, sin espacios ni
   tildes, con guiones: `la-casa-del-lago`.

2. **Crea su carpeta de imágenes** `img/la-casa-del-lago/` con:
   - `poster.jpg`: vertical, proporción 2:3 (por ejemplo 800 × 1200 px).
   - `fotograma-1.jpg`, `fotograma-2.jpg`…: horizontales, 16:9 (por ejemplo 1280 × 720 px).

   Comprime las imágenes antes de subirlas (por ejemplo con [squoosh.app](https://squoosh.app)):
   lo ideal es que cada una pese menos de 200 KB.

3. **Añade un objeto al array `SHORTS`** de `js/data.js`. Hay una plantilla comentada en el propio
   archivo:

   ```js
   {
     slug: "la-casa-del-lago",
     titulo: { es: "La casa del lago", en: "The Lake House" },
     anio: 2027,
     duracion: "15 min",
     sinopsis: { es: "De qué trata el corto.", en: "What the film is about." },
     poster: "./img/la-casa-del-lago/poster.jpg",
     trailerUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
     direccion: "Nombre Apellido",
     guion: "Nombre Apellido",
     reparto: ["Actriz Uno", "Actor Dos"],
     fotogramas: [
       "./img/la-casa-del-lago/fotograma-1.jpg",
       "./img/la-casa-del-lago/fotograma-2.jpg",
     ],
     festivales: ["Festival, ciudad y año"],
   },
   ```

Y ya está: el corto aparece en el listado, en los filtros y en la página de prensa, tiene su ficha
en `corto.html?id=la-casa-del-lago` con enlaces al anterior y al siguiente y, si es el de año más
reciente, lleva la etiqueta «Nuevo», pasa a ser el destacado del inicio y el destino del botón
«Ver tráiler».

**Detalles**
- Los textos (`titulo`, `sinopsis`, `duracion`, cada festival…) pueden ser un texto normal
  (`"Repique"`) o un objeto con los dos idiomas (`{ es: "Repique", en: "The Tolling" }`). Si falta
  el inglés, la web en inglés muestra el español. Ver [Idiomas](#idiomas-español-e-inglés).
- `duracion` admite `"14 min"`, `"1 h 5 min"` o solo `"14"`. El filtro de duración lee los números
  de ahí: corto (menos de 10 min), medio (de 10 a 20) y largo (más de 20).
- `trailerUrl` acepta cualquier enlace de YouTube (`watch?v=`, `youtu.be/`, `shorts/`…). La web lo
  convierte sola a `youtube-nocookie.com`. Si aún no hay tráiler, déjalo vacío (`""`) y se mostrará
  un aviso.
- `fotogramas` y `festivales` pueden quedar vacíos (`[]`): la sección correspondiente no se muestra.
- La web ordena los cortos por año. El orden del array solo importa entre cortos del mismo año: el
  que esté antes se considera el más reciente.
- **Para prensa** (opcional): `posterAlta: "./img/la-casa-del-lago/alta/poster.jpg"` y
  `fotogramasAlta: [...]` (en el mismo orden que `fotogramas`) son las versiones grandes que se
  descargan desde `prensa.html`. Si no las pones, se descargan las de la web.
- Para quitar la etiqueta «Ejemplo» de un corto, borra su línea `ejemplo: true`.

**Errores típicos**
- Olvidar la coma `,` entre dos objetos. La consola del navegador (F12) mostrará el error; el menú
  seguirá funcionando y el listado mostrará «La sala está vacía».
- Que la ruta no coincida exactamente con el nombre del archivo. GitHub Pages **distingue
  mayúsculas**: `Poster.JPG` no es lo mismo que `poster.jpg`. Usa siempre nombres en minúsculas,
  sin espacios ni tildes.

---

## Idiomas (español e inglés)

La web no tiene páginas duplicadas: cada HTML está escrito en español y `main.js` lo traduce al
inglés al pulsar **EN** en la cabecera. El idioma inicial se elige así:

1. Si la URL lleva `?lang=en` o `?lang=es`, ese (sirve para mandar enlaces ya en inglés, por
   ejemplo a un festival: `https://frxnker.github.io/DarkParadox/?lang=en`).
2. Si no, el último que se eligió en este navegador (se guarda en `localStorage`).
3. Si no, el del navegador: el primero de su lista de idiomas que sea español o inglés. Si no hay
   ninguno de los dos, español.

Al cambiar de idioma se actualizan también `<html lang>`, el título de la pestaña y la meta
description. Si JavaScript falla, la web se ve en español.

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
- Las palabras entre llaves, como `{titulo}`, se rellenan con un dato. En las fotos del equipo,
  `{nombre}` se toma del atributo `data-nombre` de la propia imagen.

**Para cambiar un texto** que ya existe: cámbialo en el HTML (es lo que se ve si falla
JavaScript) y en las dos partes de `js/i18n.js`.

**Para añadir un texto nuevo**: ponle al elemento `data-i18n="pagina.algo"` e inventa la clave;
después añade `"pagina.algo": "…"` en `es` y en `en`. Si se te olvida el inglés, se mostrará el
español.

### Textos de los cortos y del estudio: `js/data.js`

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
página suene sin que la persona haga algo antes). Se pausa con la pestaña en segundo plano y se
apaga al pulsar dentro de un tráiler. El volumen general se cambia en `VOLUMEN_SONIDO`.

En iPhone, si el interruptor de silencio está activado, no se oye: es el comportamiento normal de
Safari con la Web Audio API.

### Buscador y filtros (cortos.html)
Busca en el título y la sinopsis (en los dos idiomas, sin importar tildes ni mayúsculas) y filtra
por año y duración; se puede ordenar por más recientes, más antiguos o A-Z. Todo cambia al
momento y queda guardado en la URL para poder compartir una búsqueda:
`cortos.html?q=cinta&anio=2025&duracion=medio&orden=az`. Si no hay resultados, sale un mensaje con
un botón para limpiar los filtros.

### Ficha de un corto (corto.html)
- **Anterior / Siguiente** al final: llevan al corto estrenado justo antes y justo después.
- **Compartir**: en los navegadores con menú de compartir propio (la mayoría de móviles) hay un
  solo botón que lo abre. En los demás aparecen WhatsApp, X y «Copiar enlace», que avisa con
  «Enlace copiado». Si la web está en inglés, el enlace compartido lleva `?lang=en`.
- El título de la pestaña y la meta description cambian según el corto (la descripción se recorta
  a 155 caracteres).

### Prensa (prensa.html)
- **Descripciones** corta y larga en español e inglés, cada una con su botón de copiar
  (`ESTUDIO` en `data.js`).
- **Datos clave**: fundación (`ESTUDIO.fundacion`), ciudad (`CONTACTO.ciudad`), número de cortos y
  de selecciones en festivales, que se cuentan solos a partir de `SHORTS`.
- **Logotipo** en SVG y PNG (1024 × 1024, fondo transparente), versión clara para fondos oscuros y
  oscura para fondos claros, en `img/prensa/`. Para cambiarlos, sustituye los archivos manteniendo
  los nombres.
- **Pósters y fotogramas** de todos los cortos, para descargar con un nombre claro
  (`repique-fotograma-2.jpg`).
- **Contacto de prensa**: `CONTACTO.emailPrensa` o, si está vacío, `CONTACTO.email`.

---

## Otros cambios habituales

- **Email, WhatsApp y ciudad**: rellena `CONTACTO` en `js/data.js`. El WhatsApp va con prefijo de
  país y sin `+`, por ejemplo `"34612345678"`. Mientras un campo esté vacío, su enlace no aparece
  en el pie y en las páginas de contacto y prensa se muestra como «pendiente».
- **Formulario de contacto**: crea un formulario gratuito en [formspree.io](https://formspree.io) y
  sustituye `TU_ID_DE_FORMSPREE` en el `action` del formulario de `contacto.html`. Mientras no lo
  hagas, al enviar se muestra un aviso en lugar de un error. Para quitar el formulario, borra su
  bloque `<section>`.
- **Equipo**: en `estudio.html`, cada persona tiene su nombre en tres sitios del mismo bloque: el
  `<h3>`, el `alt` de la foto y el atributo `data-nombre`. Los roles en inglés están en
  `js/i18n.js` (claves `estudio.rol…`).
- **Cuenta atrás**: cambia `data-fecha="2027-10-31T21:00:00"` en `proximamente.html` (formato
  año-mes-díaThora:minutos:segundos, en la hora local de quien visita la web). Para quitarla, borra
  el bloque `cuenta-atras`.
- **Vídeo del hero**: sustituye `img/hero.mp4` por un clip propio en MP4 (H.264), sin sonido, de
  pocos segundos, que se repita bien y que pese menos de 3 MB. Pon un fotograma suyo en
  `img/hero.jpg`, que se ve mientras carga. Si prefieres solo imagen, borra la línea `<source>` de
  `index.html`. El vídeo no se reproduce si el sistema pide menos movimiento o ahorro de datos.
- **Colores y fuentes**: están en las variables del principio de `css/styles.css`.

---

## Ver la web en tu ordenador

Puedes abrir `index.html` con doble clic y casi todo funciona. Pero YouTube no reproduce los
tráileres en páginas abiertas así (sin servidor) y muestra un error de configuración del reproductor.
Para probarlo todo, usa un servidor local:

- **VS Code**: instala la extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Python**: abre una terminal en la carpeta y ejecuta `python3 -m http.server` (en Windows suele
  ser `python -m http.server`). Después entra en http://localhost:8000

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

### Por qué todas las rutas son relativas

En GitHub Pages la web no vive en la raíz del dominio, sino en la subcarpeta `/DarkParadox/`. Una
ruta como `/css/styles.css` apuntaría a `frxnker.github.io/css/styles.css`, que no existe. Por eso
todas las rutas empiezan por `./` (`./css/styles.css`, `./img/logo.svg`, `./cortos.html`).
**No escribas nunca rutas que empiecen por `/`.**

Hay dos excepciones que no son rutas internas:
- **`og:image`** (la imagen que sale al compartir un enlace en redes y WhatsApp). Tiene que ser una
  URL completa (`https://frxnker.github.io/DarkParadox/img/og-image.jpg`), porque las redes no
  entienden rutas relativas. Si cambias de usuario o de nombre de repositorio, actualízala en los
  8 HTML.
- **`404.html`**. GitHub Pages la muestra en *cualquier* dirección inexistente, por profunda que
  sea. Un pequeño script al principio calcula la carpeta raíz de la web para que sus rutas
  relativas sigan funcionando. Está explicado en el propio archivo.

Al compartir un corto concreto, la vista previa muestra los datos generales de la web, no los del
corto, y siempre en español. Las redes no ejecutan JavaScript, y la ficha de cada corto y la
traducción se generan con JavaScript.

---

## Accesibilidad y efectos

- El grano de película, el viñeteado, el parpadeo ocasional, el glitch del logo, los fundidos, las
  apariciones al hacer scroll, la intro de cine y el efecto linterna se desactivan si el sistema
  tiene activada la opción de reducir el movimiento (`prefers-reduced-motion`). Los parpadeos son
  suaves y no superan el límite de destellos por segundo de las pautas de accesibilidad.
- Sin sustos. El único sonido es el ambiente opcional, apagado hasta que alguien lo enciende.
- El rojo de la marca (`#8B0000`) solo tiene un contraste de 2:1 sobre el negro, así que nunca se
  usa para texto sobre negro: solo como fondo de botones y etiquetas (con texto blanco roto, 8:1),
  bordes y detalles. El texto es blanco roto (16:1) o gris (8:1).
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
- Vídeo de prueba de los tráileres: *Sintel* © Blender Foundation, [CC BY 3.0](https://durian.blender.org).
- Las imágenes de ejemplo de `img/` están dibujadas por código para esta web y no tienen derechos
  de terceros. El sonido ambiente se genera en el navegador y tampoco usa material de terceros.
