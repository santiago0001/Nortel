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

Ejemplo:

```js
export const APP_VERSION = "1.0.0";

export function getVersionedAssetUrl(url) {
  return `${url}?v=${APP_VERSION}`;
}
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
export const APP_VERSION = "1.0.1";
```


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
  import(getVersionedAssetUrl("./constants.js")),
  import(getVersionedAssetUrl("./script.js")),
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
