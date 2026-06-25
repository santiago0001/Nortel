# Requerimiento base para proyecto web

## Objetivo

Crear un sitio web estático, liviano y fácil de mantener, separando la estructura HTML, los estilos visuales, la lógica JavaScript y los datos editables del sitio.

## Estructura técnica esperada

El proyecto debe organizarse con archivos separados:

- `index.html`: estructura principal del sitio, metadatos SEO, carga de estilos y módulos JavaScript.
- `styles.css`: estilos visuales, responsive design, layout, botones, secciones y estados.
- `script.js`: lógica de inicialización, asignación de datos dinámicos, comportamiento de navegación y componentes interactivos.
- `constants.js`: datos editables del sitio, como teléfonos, emails, direcciones, textos, imágenes, enlaces y redes sociales.
- `app-version.js`: versión centralizada para controlar el cache de assets.
- Carpeta `imagenes/`: imágenes usadas por el sitio.

## Manejo de datos editables

Toda información que pueda cambiar con frecuencia debe estar centralizada en `constants.js`.

Ejemplos:

- Nombre del sitio o empresa.
- Teléfonos.
- WhatsApp.
- Emails.
- Dirección.
- Textos institucionales.
- Links de navegación.
- Links de redes sociales.
- URLs de imágenes.
- Mensajes predeterminados.

El HTML no debe contener datos de contacto repetidos manualmente si esos datos pueden venir desde `constants.js`.

## Carga de enlaces

Los enlaces deben asignarse desde `script.js` usando atributos `data-link` en el HTML.

Ejemplo:

```html
<a data-link="instagram" aria-label="Instagram"></a>
```

Y en `constants.js`:

```js
links: {
  instagram: "https://www.instagram.com/usuario",
}
```

Los enlaces externos, especialmente redes sociales, deben abrir en una pestaña nueva:

```html
target="_blank"
rel="noopener noreferrer"
```

## Manejo de cache

El proyecto debe incluir un archivo `app-version.js` para centralizar la versión de assets.

Debe cargarse como script clásico, no como módulo, antes del CSS local. Esto evita problemas cuando un navegador tiene cacheada una versión anterior del versionador.

Ejemplo recomendado:

```js
const APP_VERSION = "1.0.0";

function getVersionedAssetUrl(url) {
  if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${APP_VERSION}`;
}

window.APP_VERSION = APP_VERSION;
window.getVersionedAssetUrl = getVersionedAssetUrl;
```

Todos los assets locales importantes deben cargarse usando `getVersionedAssetUrl`.

Ejemplos:

- CSS local.
- Scripts locales.
- Imágenes.
- Favicons.
- Imágenes de Open Graph.
- Manifest icons.

Cuando se necesite forzar una actualización para los visitantes, se debe cambiar solamente `APP_VERSION`, por ejemplo:

```js
const APP_VERSION = "1.0.1";
```

## Carga temprana del CSS y prevención de FOUC

El CSS principal debe cargarse lo antes posible para evitar que el usuario vea un pantallazo de HTML sin estilos.

No se debe esperar a que cargue el módulo principal para asignar el CSS.

Patrón recomendado en cada HTML:

```html
<script src="app-version.js"></script>
<script>
  window.getVersionedAssetUrl ||= url => {
    if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) return url;
    return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
  };

  document.write(`<link rel="stylesheet" href="${window.getVersionedAssetUrl("styles.css")}" data-versioned-href="styles.css" onload="document.documentElement.classList.add('css-ready')">`);
</script>
```

En páginas dentro de subcarpetas, ajustar rutas:

```html
<script src="../app-version.js"></script>
<script>
  window.getVersionedAssetUrl ||= url => {
    if (!url || url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) return url;
    return `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
  };

  document.write(`<link rel="stylesheet" href="${window.getVersionedAssetUrl("../styles.css")}" data-versioned-href="../styles.css" onload="document.documentElement.classList.add('css-ready')">`);
</script>
```

La función fallback con `Date.now()` es importante: si un navegador tiene cacheado un `app-version.js` viejo o roto, la página igual debe poder cargar el CSS.

Para evitar el flash visual mientras carga el CSS, cada HTML debe incluir CSS crítico inline y un loader mínimo:

```html
<style>
  html:not(.css-ready) body{overflow:hidden;background:#fff}
  html:not(.css-ready) body>*:not(.page-loader){visibility:hidden}
  .page-loader{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:#fff;color:#ff5a1f}
  .page-loader:before{content:"";width:46px;height:46px;border:4px solid rgba(255,90,31,.18);border-top-color:#ff5a1f;border-radius:50%;animation:loader-spin .8s linear infinite}
  html.css-ready .page-loader{display:none}
  @keyframes loader-spin{to{transform:rotate(360deg)}}
</style>
```

Y al comienzo del `body`:

```html
<div class="page-loader" aria-label="Cargando sitio"></div>
```

Este loader debe ocultar el contenido real hasta que el CSS principal dispare `onload` y agregue la clase `css-ready` al elemento `html`.

## Inicialización JavaScript

El sitio debe inicializarse desde `index.html` usando módulos JavaScript.

La lógica principal debe vivir en `script.js`, idealmente exportando una función:

```js
export function initSite(constants) {
  // Inicialización del sitio
}
```

Y desde `index.html`:

```js
const [{ SITE_CONSTANTS }, { initSite }] = await Promise.all([
  import(window.getVersionedAssetUrl("./constants.js")),
  import(window.getVersionedAssetUrl("./script.js")),
]);

initSite(SITE_CONSTANTS);
```

En páginas dentro de subcarpetas:

```js
const [{ SITE_CONSTANTS }, { initSite }] = await Promise.all([
  import(window.getVersionedAssetUrl("../constants.js")),
  import(window.getVersionedAssetUrl("../script.js")),
]);

initSite(SITE_CONSTANTS);
```

## Imágenes

Las imágenes deben estar organizadas dentro de `imagenes/`.

Recomendaciones:

- Usar formatos livianos como `.webp` cuando sea posible.
- Mantener nombres claros y descriptivos.
- Definir las rutas en `constants.js`.
- Cargar las imágenes desde JavaScript cuando sean parte de datos editables.
- Usar `loading="lazy"` en imágenes que no estén en el primer viewport.
- Usar `decoding="async"` cuando corresponda.

## SEO y metadatos

El `index.html` debe incluir metadatos básicos:

- `title`.
- `description`.
- `keywords` si el proyecto lo requiere.
- `robots`.
- `canonical`.
- Open Graph.
- Twitter Card.
- Datos estructurados JSON-LD cuando aplique.
- `theme-color`.
- Favicons.
- Manifest.

Las imágenes usadas en Open Graph y Twitter también deben versionarse con `getVersionedAssetUrl`.

## Responsive design

El sitio debe estar preparado para escritorio, tablet y mobile.

El CSS debe incluir:

- Variables CSS para colores, tamaños y sombras.
- Layouts flexibles con `grid` o `flex`.
- Media queries.
- Botones y textos que no se rompan en pantallas chicas.
- Imágenes con tamaños controlados.
- Estados `hover`, `focus` y `active` cuando corresponda.

## Accesibilidad básica

El sitio debe contemplar:

- Textos alternativos en imágenes relevantes.
- `aria-label` en botones o enlaces con solo ícono.
- Contraste correcto entre texto y fondo.
- Navegación usable con teclado.
- Estados visibles de foco.
- Estructura semántica con `header`, `main`, `section`, `footer`, `nav`.

## Buenas prácticas

- No duplicar datos editables en varios archivos.
- No mezclar estilos inline salvo casos puntuales justificados.
- No cargar assets sin versionar si forman parte del sitio.
- Mantener el HTML limpio y semántico.
- Mantener el CSS separado de la lógica.
- Mantener los datos del cliente/proyecto en `constants.js`.
- Evitar dependencias innecesarias.
- Priorizar carga rápida y mantenimiento simple.

## Resultado esperado

El resultado debe ser un sitio estático fácil de editar, donde los cambios frecuentes puedan hacerse principalmente desde `constants.js` y donde el cache se controle modificando únicamente `APP_VERSION` en `app-version.js`.
