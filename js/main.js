/**
 * WINESHOP - MOTOR PRINCIPAL JS ACCESIBLE Y DINÁMICO
 */

let appData = null;
let currentLang = "es";
const CART_STORAGE_KEY = "wineshop_carrito_items";
const FAVORITES_STORAGE_KEY = "wineshop_favoritos";

// Carga Asíncrona de Base de Datos JSON
async function loadDatabase() {
    try {
        const isSubdir = window.location.pathname.includes("/html/");
        const jsonPath = isSubdir ? "../db.json" : "db.json";
        
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("Error al consultar db.json");
        
        appData = await response.json();
    } catch (error) {
        console.error("Error cargando datos de WineShop:", error);
    }
}

// Anuncio Accesible para Lectores de Pantalla (WCAG AAA)
function announceToScreenReader(message) {
    const announcer = document.getElementById("live-announcer");
    if (announcer) {
        announcer.textContent = message;
    }
}

// Renderizado de Tarjetas de Vinos
function renderizarVinos(contenedorId, soloDestacados = false) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !appData) return;
    
    contenedor.innerHTML = "";
    const isSubdir = window.location.pathname.includes("/html/");
    const basePath = isSubdir ? "../" : "";
    const dicc = appData.i18n[currentLang] || appData.i18n["es"];
    
    let vinos = appData.vinos;
    if (soloDestacados) {
        vinos = vinos.filter(v => v.destacado);
    }

    vinos.forEach(vino => {
        const traduccion = vino.i18n[currentLang] || vino.i18n["es"];
        const isFav = getFavoritos().includes(vino.id);
        const article = document.createElement("article");
        
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);
        article.setAttribute("data-type", vino.tipo);
        article.setAttribute("data-price", vino.precioNum);
        
        article.innerHTML = `
            <div class="model-container">
                <button type="button" class="btn-fav-card ${isFav ? 'active' : ''}" aria-label="${isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${isFav}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
                <model-viewer src="${basePath}${vino.modelo}" alt="${vino.nombre}" touch-action="pan-y" shadow-intensity="1" camera-controls disable-zoom class="wine-3d-model"></model-viewer>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${vino.nombre}</h3>
                <p class="body-regular">${traduccion.desc}</p>
                <p class="wine-price"><span class="sr-only">${dicc.precio_label || 'Precio:'}</span> ${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full btn-add-cart">${dicc.btn_carrito || 'Añadir al Carrito'}</button>
            </div>
        `;
        contenedor.appendChild(article);
    });

    asignarEventosTarjetas(contenedor);
}

// Gestión de Favoritos
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

function asignarEventosTarjetas(contenedor) {
    contenedor.querySelectorAll(".wine-card").forEach(card => {
        const id = card.getAttribute("data-id");
        const btnFav = card.querySelector(".btn-fav-card");
        const btnCart = card.querySelector(".btn-add-cart");

        if (btnFav) {
            btnFav.addEventListener("click", () => {
                let favs = getFavoritos();
                if (favs.includes(id)) {
                    favs = favs.filter(item => item !== id);
                    btnFav.classList.remove("active");
                    btnFav.setAttribute("aria-pressed", "false");
                    mostrarToast("Eliminado de mis favoritos");
                    announceToScreenReader("Producto eliminado de favoritos");
                } else {
                    favs.push(id);
                    btnFav.classList.add("active");
                    btnFav.setAttribute("aria-pressed", "true");
                    mostrarToast("Guardado en mis favoritos");
                    announceToScreenReader("Producto añadido a favoritos");
                }
                setFavoritos(favs);
            });
        }

        if (btnCart) {
            btnCart.addEventListener("click", () => {
                const vino = appData.vinos.find(v => v.id === id);
                if (vino) {
                    agregarAlCarrito(vino);
                }
            });
        }
    });
}

// Carrito de Compras
function agregarAlCarrito(vino) {
    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const index = carrito.findIndex(item => item.id === vino.id);
    
    if (index > -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({ id: vino.id, nombre: vino.nombre, precio: vino.precio, precioNum: vino.precioNum, cantidad: 1 });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarrito();
    mostrarToast(`${vino.nombre} añadido al carrito`);
    announceToScreenReader(`${vino.nombre} añadido al carrito de compras`);
}

function actualizarBadgeCarrito() {
    const carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = document.getElementById("header-cart-count");
    if (badge) {
        badge.textContent = totalItems > 0 ? totalItems : "0";
    }
}

// Toast Notificaciones Accesibles
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

// Inicialización de Idiomas
function iniciarIdioma() {
    const select = document.getElementById("custom-lang-select");
    if (select) {
        select.addEventListener("change", (e) => {
            currentLang = e.target.value;
            document.documentElement.lang = currentLang;
            renderizarVinos("destacados-grid", true);
            renderizarVinos("catalogo-grid", false);
            announceToScreenReader(`Idioma cambiado a ${e.target.options[e.target.selectedIndex].text}`);
        });
    }
}

// Menú Móvil
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

// Inicialización Global DOM
document.addEventListener("DOMContentLoaded", async () => {
    iniciarMenuMobile();
    await loadDatabase();
    
    if (appData) {
        iniciarIdioma();
        renderizarVinos("destacados-grid", true);
        actualizarBadgeFavoritos();
        actualizarBadgeCarrito();
        
        if (typeof GEOEngine !== "undefined") {
            GEOEngine.init(appData, currentLang);
        }
    }
});