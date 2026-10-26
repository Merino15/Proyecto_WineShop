/**
 * WINESHOP - MOTOR PRINCIPAL JS ACCESIBLE Y DINÁMICO
 * Soporta renderizado dinámico, internacionalización, gestión de carrito, favoritos y redirección de enoturismo a bodegas.
 */

let appData = null;
let currentLang = "es";

const CART_STORAGE_KEY = "wineshop_carrito_items";
const FAVORITES_STORAGE_KEY = "wineshop_favoritos";
const USER_STORAGE_KEY = "wineshop_usuario_activo";

// Determina si la ejecución se encuentra en la raíz o en el subdirectorio /html/
const isSubdir = window.location.pathname.includes("/html/");
const basePath = isSubdir ? "../" : "./";

/**
 * Carga Asíncrona de Base de Datos JSON
 */
async function loadDatabase() {
    try {
        const jsonPath = `${basePath}db.json`;
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        appData = await response.json();
    } catch (error) {
        console.error("Error al cargar db.json de WineShop:", error);
    }
}

/**
 * Anuncio Accesible para Lectores de Pantalla (WCAG AAA)
 */
function announceToScreenReader(message) {
    const announcer = document.getElementById("live-announcer");
    if (announcer) {
        announcer.textContent = message;
    }
}

/**
 * Aplicación de Traducciones DOM según el Idioma Activo
 */
function aplicarTraducciones() {
    if (!appData || !appData.i18n) return;

    const dicc = appData.i18n[currentLang] || appData.i18n["es"];

    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (dicc[key]) {
            elem.textContent = dicc[key];
        }
    });
}

/**
 * Renderizado Dinámico de Vinos (Destacados y Catálogo Completo)
 */
function renderizarVinos(contenedorId, soloDestacados = false) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !appData || !appData.vinos) return;
    
    contenedor.innerHTML = "";
    const dicc = appData.i18n[currentLang] || appData.i18n["es"];
    
    let vinos = appData.vinos;
    if (soloDestacados) {
        vinos = vinos.filter(v => v.destacado);
    }

    if (vinos.length === 0) {
        contenedor.innerHTML = `<p class="body-regular">${dicc.no_wines_found || 'No hay vinos disponibles.'}</p>`;
        return;
    }

    vinos.forEach(vino => {
        const traduccion = (vino.i18n && vino.i18n[currentLang]) ? vino.i18n[currentLang] : (vino.i18n ? vino.i18n["es"] : {});
        const isFav = getFavoritos().includes(vino.id);
        const modelPath = vino.modelo.includes('/') ? vino.modelo : `models/${vino.modelo}`;

        const article = document.createElement("article");
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);
        article.setAttribute("data-type", vino.tipo || "tinto");
        article.setAttribute("data-price", vino.precioNum);
        
        article.innerHTML = `
            <div class="model-container">
                <button type="button" class="btn-fav-card ${isFav ? 'active' : ''}" 
                        aria-label="${isFav ? (dicc.fav_remove_aria || 'Quitar de favoritos') : 'Añadir a favoritos'}" 
                        aria-pressed="${isFav}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <model-viewer src="${basePath}${modelPath}" alt="${vino.nombre}" touch-action="pan-y" shadow-intensity="1" camera-controls disable-zoom class="wine-3d-model"></model-viewer>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">
                    <a href="${basePath}html/producto.html?id=${vino.id}" style="color: inherit; text-decoration: none;">${vino.nombre}</a>
                </h3>
                <p class="body-regular">${traduccion.desc || ''}</p>
                <p class="wine-price"><span class="sr-only">${dicc.precio_label || 'Precio:'}</span> ${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full btn-add-cart">${dicc.btn_carrito || 'Añadir al carrito'}</button>
            </div>
        `;
        contenedor.appendChild(article);
    });

    asignarEventosTarjetas(contenedor);
}

/**
 * Renderizado de Bodegas
 */
function renderizarBodegas(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !appData || !appData.bodegas) return;

    contenedor.innerHTML = "";
    const dicc = appData.i18n[currentLang] || appData.i18n["es"];

    appData.bodegas.forEach(bodega => {
        const traduccion = (bodega.i18n && bodega.i18n[currentLang]) ? bodega.i18n[currentLang] : (bodega.i18n ? bodega.i18n["es"] : {});
        const article = document.createElement("article");
        article.className = "wine-card";
        article.style.padding = "var(--espaciado-24)";

        article.innerHTML = `
            <h3 class="wine-name">${bodega.nombre}</h3>
            <p class="hero-tag" style="margin-bottom: 8px;">${traduccion.subtitulo || ''}</p>
            <p class="body-regular" style="margin-bottom: 16px;">${traduccion.desc || ''}</p>
            <a href="${basePath}html/catalogo.html" class="btn btn-secondary">${dicc.btn_ver_vinos || 'Ver sus vinos'}</a>
        `;
        contenedor.appendChild(article);
    });
}

/**
 * Renderizado de Experiencias de Enoturismo con Redirección Externa a Bodegas
 */
function renderizarExperiencias(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !appData || !appData.experiencias) return;

    contenedor.innerHTML = "";
    const dicc = appData.i18n[currentLang] || appData.i18n["es"];

    appData.experiencias.forEach(exp => {
        const traduccion = (exp.i18n && exp.i18n[currentLang]) ? exp.i18n[currentLang] : (exp.i18n ? exp.i18n["es"] : {});
        const article = document.createElement("article");
        article.className = "wine-card";
        article.style.padding = "var(--espaciado-24)";

        const enlaceUrl = exp.urlBodega || `${basePath}html/bodegas.html`;

        article.innerHTML = `
            <span class="hero-tag">${traduccion.banner || 'Enoturismo'}</span>
            <h3 class="wine-name">${traduccion.titulo || 'Experiencia'}</h3>
            <p style="font-weight: 700; color: var(--color-secundario-oro); margin-bottom: 6px;">
                Organizado por: ${exp.nombreBodega || 'Bodega Asociada'}
            </p>
            <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 8px;">${traduccion.duracion || ''}</p>
            <p class="body-regular" style="margin-bottom: 16px;">${traduccion.desc || ''}</p>
            <p class="wine-price">${exp.precio} <small style="font-size: 0.9rem; font-weight: 400;">${dicc.per_person || '/ persona'}</small></p>
            
            <a href="${enlaceUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-primary btn-full"
               aria-label="${traduccion.titulo} - ${dicc.btn_reservar_bodega || 'Reservar en la web de la bodega'} (abre en nueva pestaña)">
                ${dicc.btn_reservar_bodega || 'Reservar en la web de la bodega'}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px;" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        `;
        contenedor.appendChild(article);
    });
}

/**
 * Gestión de Favoritos (LocalStorage)
 */
function getFavoritos() {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
}

function setFavoritos(favs) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
    actualizarBadgeFavoritos();
}

function actualizarBadgeFavoritos() {
    const favs = getFavoritos();
    const badge = document.getElementById("header-fav-count");
    if (badge) {
        badge.textContent = favs.length > 0 ? favs.length : "";
    }
}

/**
 * Asignación de Listeners a Tarjetas de Vino
 */
function asignarEventosTarjetas(contenedor) {
    contenedor.querySelectorAll(".wine-card").forEach(card => {
        const id = card.getAttribute("data-id");
        const btnFav = card.querySelector(".btn-fav-card");
        const btnCart = card.querySelector(".btn-add-cart");

        if (btnFav) {
            btnFav.addEventListener("click", (e) => {
                e.stopPropagation();
                let favs = getFavoritos();
                const svg = btnFav.querySelector("svg");

                if (favs.includes(id)) {
                    favs = favs.filter(item => item !== id);
                    btnFav.classList.remove("active");
                    btnFav.setAttribute("aria-pressed", "false");
                    if (svg) svg.setAttribute("fill", "none");
                    mostrarToast("Eliminado de mis favoritos");
                    announceToScreenReader("Producto eliminado de favoritos");
                } else {
                    favs.push(id);
                    btnFav.classList.add("active");
                    btnFav.setAttribute("aria-pressed", "true");
                    if (svg) svg.setAttribute("fill", "currentColor");
                    mostrarToast("Guardado en mis favoritos");
                    announceToScreenReader("Producto añadido a favoritos");
                }
                setFavoritos(favs);
            });
        }

        if (btnCart) {
            btnCart.addEventListener("click", (e) => {
                e.stopPropagation();
                const vino = appData.vinos.find(v => v.id === id);
                if (vino) {
                    agregarAlCarrito(vino);
                }
            });
        }
    });
}

/**
 * Gestión de Carrito de Compras (LocalStorage)
 */
function agregarAlCarrito(vino, cantidad = 1) {
    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const index = carrito.findIndex(item => item.id === vino.id);
    
    if (index > -1) {
        carrito[index].cantidad += cantidad;
    } else {
        carrito.push({ 
            id: vino.id, 
            nombre: vino.nombre, 
            precio: vino.precio, 
            precioNum: vino.precioNum, 
            cantidad: cantidad 
        });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarrito();
    mostrarToast(`${vino.nombre} añadido al carrito`);
    announceToScreenReader(`${vino.nombre} añadido al carrito de compras`);
}

function actualizarBadgeCarrito() {
    const carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const badges = document.querySelectorAll(".badge-count#header-cart-count, .cart-btn .badge-count");
    badges.forEach(badge => {
        badge.textContent = totalItems > 0 ? totalItems : "0";
    });
}

/**
 * Autenticación y Gestión de Usuario Activo
 */
function obtenerUsuarioActivo() {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null;
}

/**
 * Sistema de Notificaciones Flotantes (Toast)
 */
function mostrarToast(mensaje) {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<span>${mensaje}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

/**
 * Inicialización de Control de Idioma
 */
function iniciarIdioma() {
    const select = document.getElementById("custom-lang-select");
    if (select) {
        select.addEventListener("change", (e) => {
            currentLang = e.target.value;
            document.documentElement.lang = currentLang;
            
            aplicarTraducciones();
            renderizarVinos("destacados-grid", true);
            renderizarVinos("catalogo-grid", false);
            renderizarBodegas("bodegas-grid");
            renderizarExperiencias("experiencias-grid");
            
            announceToScreenReader(`Idioma cambiado a ${e.target.options[e.target.selectedIndex].text}`);
        });
    }
}

/**
 * Menú Navegación Móvil
 */
function iniciarMenuMobile() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("main-nav-list");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", isOpen);
        });
    }
}

/**
 * Inicialización Global en DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", async () => {
    iniciarMenuMobile();
    await loadDatabase();
    
    if (appData) {
        iniciarIdioma();
        aplicarTraducciones();
        
        renderizarVinos("destacados-grid", true);
        renderizarVinos("catalogo-grid", false);
        renderizarBodegas("bodegas-grid");
        renderizarExperiencias("experiencias-grid");
        
        actualizarBadgeFavoritos();
        actualizarBadgeCarrito();
        
        if (typeof GEOEngine !== "undefined") {
            GEOEngine.init(appData, currentLang);
        }
    }
});