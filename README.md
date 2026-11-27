# WineShop - Tienda de Vinos Online

## 1. Nombre y Descripción

**WineShop** es una plataforma web para la visualización, exploración y compra de vinos finos, bodegas y experiencias vitivinícolas. La aplicación está desarrollada utilizando tecnologías web estándares sin dependencias externas ni backend complejo, ofreciendo una experiencia ligera, accesible, rápida y fácil de mantener.

## 2. Funcionalidad Principal

* **Catálogo interactivo:** Navegación y filtrado de vinos por tipo, origen y rango de precios consumiendo datos dinámicamente desde la base de datos local.
* **Detalle de Producto:** Vista dedicada para la ficha técnica y notas de cata de cada vino (`html/producto.html`).
* **Experiencias y Bodegas:** Secciones dedicadas para explorar bodegas colaboradoras y actividades enoturísticas (`html/bodegas.html`, `html/experiencias.html`).
* **Juego interactivo:** Mini-juego/sección lúdica integrada (`html/juego_menores.html` y `js/arcade.js`).
* **Proceso de Checkout:** Simulación y validación del proceso de pago (`html/checkout.html` y `js/checkout.js`).
* **Gestión de Usuario y Favoritos:** Vistas para el perfil del usuario (`html/mi_cuenta.html`) y productos guardados (`html/favoritos.html`).
* **PWA y Acceso Offline:** Soporte para PWA mediante manifiesto (`manifest.json`) y Service Worker (`sw.js`).
* **Accesibilidad y Legal:** Cumplimiento con declaración de accesibilidad, términos y condiciones, y política de privacidad.

## 3. Tecnologías Utilizadas

* **Lenguajes:** HTML5, CSS3, JavaScript Vanilla (ES6+).
* **PWA / Service Worker:** `sw.js` y `manifest.json` para instalación y soporte offline.
* **Almacenamiento Local:** `localStorage` y `sessionStorage` para persistencia de datos (carrito, favoritos, sesión).
* **Servidor Web:** Nginx, Apache, o cualquier servidor HTTP de archivos estáticos (ej. Live Server, GitHub Pages).
* **Base de Datos:** Archivo JSON local (`db.json` en la raíz del proyecto).

## 4. Requisitos Necesarios para Ejecutarla

Para ejecutar la aplicación localmente se requiere:

* **Navegador Web Moderno:** Soporte para ES6+, Fetch API y Service Workers (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
* **Servidor HTTP Local:** Necesario para permitir que las peticiones `fetch()` hacia `db.json` funcionen correctamente y no queden bloqueadas por políticas CORS (`file://`).

## 5. Dependencias que Deben Instalarse

El proyecto está desarrollado completamente en **JavaScript Vanilla**, por lo que **no requiere dependencias externas ni gestores de paquetes (npm/yarn)**.

* *Opcional:* Una extensión de servidor estático como **Live Server** (VS Code) o el paquete `http-server` de Node.js.

## 6. Procedimiento para Instalar y Ejecutar la Aplicación

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Proyecto_WineShop.git
cd Proyecto_WineShop
```

### Paso 2: Abrir y Ejecutar

Debido al uso de `fetch()` para leer `db.json` y el registro de `sw.js`, la aplicación debe ser servida bajo un protocolo HTTP/HTTPS:

* **Opción con Live Server (VS Code):** Haz clic derecho sobre `index.html` y selecciona *Open with Live Server*.
* **Opción con Python:** Abre una terminal en la raíz del proyecto y ejecuta:
  ```bash
  python -m http.server 8000
  ```
  Luego accede en tu navegador a `http://localhost:8000`.
* **Opción con Node.js (npx):**
  ```bash
  npx serve .
  ```

## 7. Variables de Entorno y Parámetros de Configuración Necesarios

Al ser una aplicación frontend estática, la configuración global se gestiona internamente desde los scripts de JavaScript:

* **Ruta de Base de Datos:** `./db.json` (ubicada en la raíz del proyecto).
* **Service Worker:** `./sw.js` registrado desde la raíz.
* **Manifest PWA:** `./manifest.json` enlazado en la cabecera de las páginas HTML.

## 8. Información sobre la Base de Datos

La base de datos del sistema se encuentra en la raíz del proyecto bajo el nombre **`db.json`**. Funciona como origen principal de datos para el catálogo y la información de los productos.

### Estructura de la Base de Datos (`db.json`):

```json
[
  {
    "id": 1,
    "nombre": "Reserva Rioja 2018",
    "tipo": "Tinto",
    "precio": 18.50,
    "bodega": "Bodegas Rioja",
    "descripcion": "Vino de gran cuerpo con notas de roble y frutos rojos.",
    "imagen": "img/rioja.jpg",
    "stock": 25
  }
]
```

## 9. Estructura de Directorios del Proyecto

```text
Proyecto_WineShop/
├── css/
│   └── estilos_wineshop.css          # Hoja de estilos principal del sitio
├── html/
│   ├── bodegas.html                  # Página de bodegas asociadas
│   ├── catalogo.html                 # Catálogo general de productos
│   ├── checkout.html                 # Página de proceso de pago
│   ├── declaracion_accesibilidad.html# Declaración de accesibilidad
│   ├── experiencias.html             # Actividades y experiencias enoturísticas
│   ├── favoritos.html                # Lista de vinos guardados
│   ├── juego_menores.html            # Mini-juego interactivo
│   ├── login.html                    # Iniciar sesión / Registro
│   ├── mi_cuenta.html                # Perfil y panel del usuario
│   ├── politica_privacidad.html      # Política de privacidad
│   ├── producto.html                 # Ficha y detalle del vino
│   └── terminos_condiciones.html     # Términos y condiciones legales
├── img/
│   ├── favicon.png                   # Icono de pestaña
│   ├── logocompleto.png              # Logo completo principal
│   ├── solologo.png                  # Isotipo / versión reducida del logo
│   ├── solologoblanco.png            # Logo en versión blanca
│   ├── transparent-logo.ico          # Favicon formato .ico
│   ├── transparent-logo.png          # Logo con fondo transparente (.png)
│   └── transparent-logo.svg          # Logo vectorial (.svg)
├── js/
│   ├── arcade.js                     # Lógica del juego interactivo
│   ├── catalogo.js                   # Renderizado y filtros del catálogo
│   ├── checkout.js                   # Validación y gestión del checkout
│   ├── geo.js                        # Lógica de geolocalización o ubicaciones
│   ├── main.js                       # Script principal e interacciones globales
│   ├── mi_cuenta.js                  # Lógica del perfil de usuario
│   └── validators.js                 # Utilidades para validación de formularios
├── db.json                           # Archivo JSON que actúa como Base de Datos
├── index.html                        # Página de inicio / Landing page principal
├── manifest.json                     # Configuración PWA (Progressive Web App)
├── README.md                         # Documentación técnica del proyecto
├── robots.txt                        # Instrucciones para motores de búsqueda
├── sitemap.xml                       # Mapa del sitio web para SEO
└── sw.js                             # Service Worker para almacenamiento en caché y offline
```

## 10. Procedimiento Previsto para Desplegarla en el Servidor

Al ser una aplicación web estática (PWA), su despliegue es inmediato y no requiere configuración de servidores de aplicación:

### Opción A: Hosting Estático (GitHub Pages / Netlify / Vercel)

1. Sube el código al repositorio de GitHub.
2. En la plataforma elegida (ej. GitHub Pages), selecciona la rama `main` y la carpeta raíz (`/`).
3. La plataforma servirá los HTML, el `db.json`, las imágenes y registrará el `sw.js` de forma automática.

### Opción B: Servidor Web Tradicional (Nginx / Apache / FTP)

1. Conéctate a tu servidor web vía FTP o consola SSH.
2. Copia todo el contenido del directorio `Proyecto_WineShop/` en el directorio público del servidor (ej. `/var/www/html/`).
3. Asegúrate de que el servidor web entregue los tipos MIME correctos (`application/json` para `db.json` y `application/manifest+json` para `manifest.json`).