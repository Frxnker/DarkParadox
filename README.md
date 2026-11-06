# Dark Paradox Studios · Web oficial

Web de **Dark Paradox Studios**, productora independiente de cortometrajes de terror
([@darkparadox_studios_](https://www.instagram.com/darkparadox_studios_/)).

Es una web estática hecha solo con HTML, CSS y JavaScript, sin librerías, sin npm y sin
pasos de compilación. Se publica tal cual en GitHub Pages:
**https://frxnker.github.io/DarkParadox/**

---

## Antes de publicar: qué falta por rellenar

La web incluye **contenido de ejemplo** para que se vea completa. Mientras siga ahí, aparece
marcado con la etiqueta «Ejemplo» o «Contenido de ejemplo».

| Qué | Dónde |
|---|---|
| Los 3 cortos de ejemplo (títulos, sinopsis, equipo, festivales) | `js/data.js` → `SHORTS` |
| Email, WhatsApp y ciudad | `js/data.js` → `CONTACTO` |
| Tráileres: ahora usan «Sintel» (Blender Foundation, CC BY) como vídeo de prueba | `js/data.js` → `trailerUrl` |
| Pósters, fotogramas, fotos del equipo y vídeo del hero (son dibujos generados) | carpeta `img/` |
| Nombres y roles del equipo | `estudio.html` |
| Corto en desarrollo y fecha de la cuenta atrás | `proximamente.html` |
| Identificador de Formspree del formulario | `contacto.html` |

---

## Estructura

```
index.html          Inicio: hero con vídeo y último corto destacado
cortos.html         Listado de cortos (se genera desde js/data.js)
corto.html          Ficha de un corto: corto.html?id=slug-del-corto
proximamente.html   Teaser del corto en desarrollo y cuenta atrás
estudio.html        Quiénes somos y equipo
contacto.html       Email, WhatsApp, Instagram y formulario
404.html            Página de error (GitHub Pages la usa automáticamente)
.nojekyll           Archivo vacío: le dice a GitHub Pages que no procese la web con Jekyll
css/styles.css      Todos los estilos (colores y fuentes en variables al principio)
js/data.js          Datos: cortos y contacto. Es el único archivo que hay que tocar a diario
js/main.js          Menú, efectos y la lógica que pinta cortos, ficha y lightbox
img/                Imágenes: una carpeta por corto, más logo, favicon, hero y equipo
```

---

## Añadir un corto nuevo

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
     titulo: "La casa del lago",
     anio: 2027,
     duracion: "15 min",
     sinopsis: "De qué trata el corto.",
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

Y ya está: el corto aparece en el listado, tiene su ficha en `corto.html?id=la-casa-del-lago` y,
si es el de año más reciente, pasa a ser el destacado del inicio y el destino del botón «Ver tráiler».

**Detalles**
- `trailerUrl` acepta cualquier enlace de YouTube (`watch?v=`, `youtu.be/`, `shorts/`…). La web lo
  convierte sola a `youtube-nocookie.com`. Si aún no hay tráiler, déjalo vacío (`""`) y se mostrará
  un aviso.
- `fotogramas` y `festivales` pueden quedar vacíos (`[]`): la sección correspondiente no se muestra.
- El orden del array da igual: la web ordena los cortos por año.
- Para quitar la etiqueta «Ejemplo» de un corto, borra su línea `ejemplo: true`.

**Errores típicos**
- Olvidar la coma `,` entre dos objetos. La consola del navegador (F12) mostrará el error; el menú
  seguirá funcionando y el listado mostrará «La sala está vacía».
- Que la ruta no coincida exactamente con el nombre del archivo. GitHub Pages **distingue
  mayúsculas**: `Poster.JPG` no es lo mismo que `poster.jpg`. Usa siempre nombres en minúsculas,
  sin espacios ni tildes.

---

## Otros cambios habituales

- **Email, WhatsApp y ciudad**: rellena `CONTACTO` en `js/data.js`. El WhatsApp va con prefijo de
  país y sin `+`, por ejemplo `"34612345678"`. Mientras un campo esté vacío, su enlace no aparece
  en el pie y en la página de contacto se muestra como «pendiente».
- **Formulario de contacto**: crea un formulario gratuito en [formspree.io](https://formspree.io) y
  sustituye `TU_ID_DE_FORMSPREE` en el `action` del formulario de `contacto.html`. Mientras no lo
  hagas, al enviar se muestra un aviso en lugar de un error. Para quitar el formulario, borra su
  bloque `<section>`.
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
- **Python**: abre una terminal en la carpeta y ejecuta `python -m http.server`. Después entra en
  http://localhost:8000

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
  7 HTML.
- **`404.html`**. GitHub Pages la muestra en *cualquier* dirección inexistente, por profunda que
  sea. Un pequeño script al principio calcula la carpeta raíz de la web para que sus rutas
  relativas sigan funcionando. Está explicado en el propio archivo.

Al compartir un corto concreto, la vista previa muestra los datos generales de la web, no los del
corto. Las redes no ejecutan JavaScript, y la ficha de cada corto se genera con JavaScript.

---

## Accesibilidad y efectos

- El grano de película, el viñeteado, el parpadeo ocasional, el glitch del logo, los fundidos y
  las apariciones al hacer scroll se desactivan si el sistema tiene activada la opción de reducir
  el movimiento (`prefers-reduced-motion`). El parpadeo es muy suave y no supera el límite de
  destellos por segundo de las pautas de accesibilidad.
- Sin sonidos ni sustos.
- El rojo de la marca (`#8B0000`) solo tiene un contraste de 2:1 sobre el negro, así que nunca se
  usa para texto: solo como fondo de botones, bordes y detalles. El texto es blanco roto (16:1) o
  gris (8:1).
- Todo se puede usar con el teclado. El primer tabulador lleva a «Saltar al contenido».
- Botones y enlaces miden al menos 44 px.
- En el móvil, el primer toque sobre un póster muestra sus datos y el segundo entra en el corto.
  Si prefieres que un solo toque entre directamente, borra la función `iniciarTarjetasTactiles` de
  `js/main.js` y la línea que la llama.

---

## Créditos

- Fuentes: [IM Fell English](https://fonts.google.com/specimen/IM+Fell+English),
  [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) y
  [Special Elite](https://fonts.google.com/specimen/Special+Elite), de Google Fonts (licencia OFL).
- Vídeo de prueba de los tráileres: *Sintel* © Blender Foundation, [CC BY 3.0](https://durian.blender.org).
- Las imágenes de ejemplo de `img/` están dibujadas por código para esta web y no tienen derechos
  de terceros.
