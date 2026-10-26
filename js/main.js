/**
 * WINESHOP - MOTOR PRINCIPAL JS ACCESIBLE Y DINÁMICO
 * Incluye carrusel Hero interactivo, verificación de edad flotante con desenfoque de fondo,
 * catálogo 3D, bodegas con imágenes y enlaces externos, enoturismo, carrito de compras, 
 * favoritos e internacionalización (es, en, fr, de).
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
 * Control del Modal de Verificación de Edad con Desenfoque de Fondo
 */
function iniciarVerificacionEdad() {
    const modal = document.getElementById("age-gate-modal");
    if (!modal) return;

    const btnMayor = document.getElementById("btn-confirm-mayor");
    const btnMenor = document.getElementById("btn-confirm-menor");

    const esMayor = sessionStorage.getItem("wineshop_mayor_edad") === "true";

    if (esMayor) {
        modal.classList.add("hidden");
        document.body.classList.remove("modal-open");
    } else {
        modal.classList.remove("hidden");
        document.body.classList.add("modal-open");
    }

    if (btnMayor) {
        btnMayor.addEventListener("click", () => {
            sessionStorage.setItem("wineshop_mayor_edad", "true");
            modal.classList.add("hidden");
            document.body.classList.remove("modal-open");
            announceToScreenReader("Verificación de edad completada. Acceso permitido a WineShop.");
        });
    }

    if (btnMenor) {
        btnMenor.addEventListener("click", () => {
            const redirectUrl = isSubdir ? "juego_menores.html" : "html/juego_menores.html";
            window.location.href = redirectUrl;
        });
    }
}

/**
 * Carrusel Hero Interactivo y Accesible
 */
function iniciarCarruselHero() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-indicators .dot');
    const btnPrev = document.querySelector('.carousel-arrow.prev');
    const btnNext = document.querySelector('.carousel-arrow.next');
    const carouselSection = document.querySelector('.hero-carousel-section');
    
    if (!slides.length) return;

    let currentIndex = 0;
    let timer = null;

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove('active');
            dots[currentIndex].setAttribute('aria-selected', 'false');
        }

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
            dots[currentIndex].setAttribute('aria-selected', 'true');
        }
    }

    function startAutoplay() {
        stopAutoplay();
        timer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 6000);
    }

    function stopAutoplay() {
        if (timer) clearInterval(timer);
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            startAutoplay();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            startAutoplay();
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startAutoplay();
        });
    });

    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', stopAutoplay);
        carouselSection.addEventListener('mouseleave', startAutoplay);
        carouselSection.addEventListener('focusin', stopAutoplay);
        carouselSection.addEventListener('focusout', startAutoplay);
    }

    startAutoplay();
}

/**
 * Renderizado Dinámico de Vinos con Imagen Real
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
        const imgPath = vino.imagen && vino.imagen.startsWith('http') ? vino.imagen : `${basePath}${vino.imagen || 'img/hero/banner-1.jpg'}`;

        const article = document.createElement("article");
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);
        article.setAttribute("data-type", vino.tipo || "tinto");
        article.setAttribute("data-price", vino.precioNum);
        
        article.innerHTML = `
            <div class="card-img-wrap">
                <button type="button" class="btn-fav-card ${isFav ? 'active' : ''}" 
                        aria-label="${isFav ? (dicc.fav_remove_aria || 'Quitar de favoritos') : 'Añadir a favoritos'}" 
                        aria-pressed="${isFav}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <img src="${imgPath}" alt="${vino.nombre}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">
                    <a href="${basePath}html/producto.html?id=${vino.id}" style="color: inherit; text-decoration: none;">${vino.nombre}</a>
                </h3>
                <p class="body-regular" style="margin-bottom: 12px;">${traduccion.desc || ''}</p>
                <p class="wine-price" style="margin-top: auto;"><span class="sr-only">${dicc.precio_label || 'Precio:'}</span> ${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full btn-add-cart" style="margin-top: 12px;">${dicc.btn_carrito || 'Añadir al carrito'}</button>
            </div>
        `;
        contenedor.appendChild(article);
    });

    asignarEventosTarjetas(contenedor);
}

/**
 * Renderizado de Bodegas con Imagen Destacada
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

        const imgPath = bodega.imagen.startsWith('http') ? bodega.imagen : `${basePath}${bodega.imagen}`;

        article.innerHTML = `
            <div class="card-img-wrap">
                <img src="${imgPath}" alt="Instalaciones de ${bodega.nombre}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${bodega.nombre}</h3>
                <p class="hero-tag" style="margin-bottom: 8px;">${traduccion.subtitulo || ''}</p>
                <p class="body-regular" style="margin-bottom: 16px;">${traduccion.desc || ''}</p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: auto;">
                    <a href="${basePath}html/catalogo.html" class="btn btn-secondary" style="flex: 1;">${dicc.btn_ver_vinos || 'Ver sus vinos'}</a>
                    ${bodega.url ? `
                        <a href="${bodega.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
                            Web Oficial 
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 6px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        contenedor.appendChild(article);
    });
}

/**
 * Renderizado de Experiencias con Imagen Destacada y Redirección
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

        const enlaceUrl = exp.urlBodega || `${basePath}html/bodegas.html`;
        const imgPath = exp.imagen.startsWith('http') ? exp.imagen : `${basePath}${exp.imagen}`;

        article.innerHTML = `
            <div class="card-img-wrap">
                <span class="badge-overlay">${traduccion.banner || 'Enoturismo'}</span>
                <img src="${imgPath}" alt="${traduccion.titulo || 'Experiencia enoturística'}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${traduccion.titulo || 'Experiencia'}</h3>
                <p style="font-weight: 700; color: var(--color-secundario-oro); margin-bottom: 6px;">
                    Organizado por: ${exp.nombreBodega || 'Bodega Asociada'}
                </p>
                <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 8px;">${traduccion.duracion || ''}</p>
                <p class="body-regular" style="margin-bottom: 16px;">${traduccion.desc || ''}</p>
                <p class="wine-price" style="margin-top: auto;">${exp.precio} <small style="font-size: 0.9rem; font-weight: 400;">${dicc.per_person || '/ persona'}</small></p>
                
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
            </div>
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
        
        iniciarVerificacionEdad();
        iniciarCarruselHero();
        iniciarCarruselResenas(); // <--- Añadir aquí
        
        renderizarVinos("destacados-grid", true);
        renderizarVinos("catalogo-grid", false);
        renderizarBodegas("bodegas-grid");
        renderizarExperiencias("experiencias-grid");
        
        actualizarBadgeFavoritos();
        actualizarBadgeCarrito();
    }
});
/**
 * Carrusel de Reseñas / Testimonios
 */
function iniciarCarruselResenas() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials-indicators .dot');
    const btnPrev = document.querySelector('.prev-testimonial');
    const btnNext = document.querySelector('.next-testimonial');
    
    if (!slides.length) return;

    let currentIndex = 0;
    let timer = null;

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove('active');
            dots[currentIndex].setAttribute('aria-selected', 'false');
        }

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
            dots[currentIndex].setAttribute('aria-selected', 'true');
        }
    }

    function startAutoplay() {
        stopAutoplay();
        timer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5500);
    }

    function stopAutoplay() {
        if (timer) clearInterval(timer);
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            startAutoplay();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            startAutoplay();
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startAutoplay();
        });
    });

    startAutoplay();
}