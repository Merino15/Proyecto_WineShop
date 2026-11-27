# WineShop - Tienda de Vinos Online

## 1. Nombre y Descripción

**WineShop** es una plataforma web para la visualización, exploración y catálogo de vinos finos, bodegas y accesorios vitivinícolas. La aplicación está desarrollada utilizando tecnologías web estándares sin librerías externas ni backend complejo, ofreciendo una experiencia ligera, rápida y fácil de mantener.

## 2. Funcionalidad Principal

* **Catálogo interactivo:** Navegación y filtrado de vinos por tipo (tinto, blanco, rosado, espumoso), origen y rango de precios mediante manipulación dinámica del DOM consumiendo datos localmente.
* **Carrito de compras (Local):** Gestión del carrito almacenado en `localStorage` del navegador para persistencia entre sesiones.
* **Vista de detalle de producto:** Modal o vista rápida para cada vino con notas de cata y detalles extra extraídos del origen de datos.
* **Diseño Responsive:** Interfaz adaptada a todos los dispositivos utilizando CSS3 puro (Flexbox/Grid).

## 3. Tecnologías Utilizadas

* **Lenguajes:** HTML5, CSS3, JavaScript Vanilla (ES6+).
* **Almacenamiento Local:** `localStorage` para persistir el carrito y `sessionStorage` para estados temporales.
* **Servidor Web:** Nginx, Apache, o cualquier servidor HTTP de archivos estáticos (ej. Live Server, Netlify, GitHub Pages).
* **Base de Datos:** Archivo JSON local (`data/db.json`).

## 4. Requisitos Necesarios para Ejecutarla

Para ejecutar la aplicación localmente solo necesitas:

* **Navegador Web:** Cualquier navegador moderno con soporte para ES6+ y Fetch API (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
* **Servidor HTTP Local:** Recomendado para habilitar las peticiones `fetch()` al archivo `db.json` sin bloquear el acceso por políticas CORS locales (`file://`).

## 5. Dependencias que Deben Instalarse

El proyecto está desarrollado completamente en **JavaScript Vanilla**, por lo que **no requiere dependencias externas, gestores de paquetes (npm/yarn), ni procesadores de build**.

* *Opcional:* Servidor estático sencillo como la extensión *Live Server* de VS Code o `http-server` de Node.js.

## 6. Procedimiento para Instalar y Ejecutar la Aplicación

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/wineshop.git
cd wineshop
```

### Paso 2: Abrir y Ejecutar

Debido a que los datos se leen mediante la Fetch API desde un archivo JSON local, es altamente aconsejable ejecutar el proyecto en un servidor estático:

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

Dado que se trata de un cliente frontend estático, la configuración general del sistema se centraliza en el archivo `js/config.js`:

```javascript
// js/config.js
const CONFIG = {
  DATA_PATH: "./data/db.json", // Ruta al archivo db.json que actúa como base de datos
  CURRENCY: "€",
  ITEMS_PER_PAGE: 12
};
```

## 8. Información sobre la Base de Datos

La base de datos del sistema se compone íntegramente de un archivo local en formato JSON (`data/db.json`). Este archivo funciona como la fuente única de verdad para el catálogo de productos y es leído dinámicamente mediante `fetch()`.

### Estructura de la Base de Datos (`data/db.json`):

```json
[
  {
    "id": 1,
    "name": "Reserva Rioja 2018",
    "type": "Tinto",
    "price": 18.50,
    "winery": "Bodegas Rioja",
    "description": "Vino de gran cuerpo con notas de roble y frutos rojos.",
    "image": "assets/img/rioja.jpg",
    "stock": 25
  },
  {
    "id": 2,
    "name": "Albariño Rías Baixas 2022",
    "type": "Blanco",
    "price": 14.20,
    "winery": "Pazo del Mar",
    "description": "Vino blanco fresco y afrutado con toque cítrico.",
    "image": "assets/img/albarino.jpg",
    "stock": 40
  }
]
```

## 9. Estructura de Directorios del Proyecto

```text
wineshop/
├── assets/
│   ├── css/
│   │   ├── main.css        # Estilos generales y maquetación
│   │   └── components.css  # Estilos para tarjetas, modales y botones
│   ├── img/                # Catálogo de imágenes de los vinos
│   └── js/
│       ├── main.js         # Lógica principal de renderizado y filtros
│       ├── cart.js         # Manipulación del carrito en localStorage
│       ├── config.js       # Configuración global del proyecto
│       └── db.js           # Módulo para el consumo y lectura de data/db.json
├── data/
│   └── db.json             # Archivo JSON que ejerce de Base de Datos
├── index.html              # Vista principal / Catálogo de productos
├── cart.html               # Vista del carrito de compra
└── README.md               # Documentación general del repositorio
```

## 10. Procedimiento Previsto para Desplegarla en el Servidor

Al ser una aplicación estática basada en archivos HTML/CSS/JS y JSON, el despliegue no requiere entornos de ejecución de backend:

### Opción A: Servicios de Hosting Estático (GitHub Pages / Netlify / Vercel)

1. Sube el código al repositorio en GitHub.
2. Configura el despliegue directo desde la rama `main` y la carpeta raíz (`/`).
3. El servicio servirá el sitio y el archivo `data/db.json` de manera automática.

### Opción B: Servidor Web Tradicional (Nginx / Apache / FTP)

1. Conéctate a tu servidor remoto (vía FTP, SCP o consola).
2. Transfiere el directorio raíz completo del proyecto `wineshop/` a la carpeta pública del servidor web (ej. `/var/www/html/` o `public_html/`).
3. Asegúrate de que los permisos de lectura en el servidor permitan acceder a la carpeta `data/db.json`.
