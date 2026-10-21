let appData = null;
let currentLang = "es";
const CART_STORAGE_KEY = "wineshop_carrito_items";

// 1. CARGA DE BASE DE DATOS
async function loadDatabase() {
    try {
        const isSubdir = window.location.pathname.includes("/html/");
        const jsonPath = isSubdir ? "../db.json" : "db.json";
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("No se pudo cargar db.json");
        appData = await response.json();
    } catch (error) {
        console.error("Error al cargar la base de datos:", error);
    }
}

// 2. RENDERIZADO DINÁMICO MPA
function renderizarVinos(contenedorId, soloDestacados = false) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !appData) return;
    
    contenedor.innerHTML = "";
    const isSubdir = window.location.pathname.includes("/html/");
    const basePath = isSubdir ? "../" : "";
    const dicc = appData.i18n[currentLang];
    
    let vinos = appData.vinos;
    if (soloDestacados) {
        vinos = vinos.filter(v => v.destacado);
    }

    vinos.forEach(vino => {
        const traduccion = vino.i18n[currentLang];
        const isFav = getFavoritos().includes(vino.id);
        const article = document.createElement("article");
        
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);
        article.setAttribute("data-type", vino.tipo);
        article.setAttribute("data-price", vino.precioNum);
        
        article.innerHTML = `
            <div class="model-container">
                <button type="button" class="btn-fav-card ${isFav ? 'active' : ''}" aria-label="Favoritos" aria-pressed="${isFav}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
                <model-viewer src="${basePath}${vino.modelo}" touch-action="pan-y" shadow-intensity="1" camera-controls="false" disable-zoom class="wine-3d-model"></model-viewer>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${vino.nombre}</h3>
                <p class="body-regular">${traduccion.desc}</p>
                <p class="wine-price"><span class="sr-only">${dicc.precio_label}</span>${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full">${dicc.btn_carrito}</button>
            </div>
        `;
        contenedor.appendChild(article);
    });

    asignarEventosTarjetas(contenedor);
}

function renderizarBodegas() {
    const contenedor = document.getElementById("bodegas-grid");
    if (!contenedor || !appData) return;
    
    contenedor.innerHTML = "";
    const dicc = appData.i18n[currentLang];

    appData.bodegas.forEach(bodega => {
        const tr = bodega.i18n[currentLang];
        const article = document.createElement("article");
        article.className = "wine-card";
        article.innerHTML = `
            <div class="model-container" style="display: flex; align-items: center; justify-content: center; background-color: var(--color-neutro-calido-300);">
                <span style="font-family: var(--font-titulos); font-size: 1.8rem; color: var(--color-primario-bordeos); font-weight: 700;">${bodega.abreviatura}</span>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${bodega.nombre}</h3>
                <p class="wine-vintage">${tr.subtitulo}</p>
                <p class="body-regular" style="margin: var(--espaciado-8) 0 var(--espaciado-16);">${tr.desc}</p>
                <a href="catalogo.html" class="btn btn-secondary btn-full">${dicc.btn_ver_vinos}</a>
            </div>
        `;
        contenedor.appendChild(article);
    });
}

function renderizarExperiencias() {
    const contenedor = document.getElementById("experiencias-grid");
    if (!contenedor || !appData) return;
    
    contenedor.innerHTML = "";
    const dicc = appData.i18n[currentLang];

    appData.experiencias.forEach(exp => {
        const tr = exp.i18n[currentLang];
        const article = document.createElement("article");
        article.className = "wine-card";
        article.innerHTML = `
            <div class="model-container" style="display: flex; align-items: center; justify-content: center; background-color: var(--color-neutro-calido-300);">
                <span style="font-family: var(--font-titulos); font-size: 1.8rem; color: var(--color-primario-bordeos); font-weight: 700;">${tr.banner}</span>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${tr.titulo}</h3>
                <p class="wine-vintage">${tr.duracion}</p>
                <p class="body-regular" style="margin: var(--espaciado-8) 0 var(--espaciado-16);">${tr.desc}</p>
                <p class="wine-price"><span class="sr-only">${dicc.precio_label}</span>${exp.precio} <span style="font-size: 0.9rem; font-weight: 600; color: var(--color-gris-700);">${dicc.per_person}</span></p>
                <button type="button" class="btn btn-primary btn-full">${dicc.btn_reservar}</button>
            </div>
        `;
        contenedor.appendChild(article);
    });
}

// 3. I18N Y SELECCIÓN DE IDIOMA
function obtenerIdiomaGuardado() {
    return localStorage.getItem("wineshop_idioma") || "es";
}

function aplicarTraducciones(idioma) {
    if (!appData) return;
    currentLang = idioma;
    document.documentElement.lang = idioma;
    const dicc = appData.i18n[idioma];

    // Textos estáticos UI
    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const clave = elem.getAttribute("data-i18n");
        if (dicc[clave]) elem.textContent = dicc[clave];
    });

    // Re-renderizar Vistas dinámicas
    renderizarVinos("destacados-grid", true);
    renderizarVinos("catalogo-grid", false);
    renderizarBodegas();
    renderizarExperiencias();
    if(document.getElementById("producto-detalle")) cargarDetalleProducto();
    if(document.getElementById("catalogo-grid")) inicializarFiltrosCatalogo();
    
    actualizarBadgeFavoritos();
}

function iniciarControladorIdioma() {
    const customSelect = document.getElementById("custom-lang-select");
    currentLang = obtenerIdiomaGuardado();

    if (customSelect) {
        customSelect.value = currentLang;
        customSelect.addEventListener("change", (e) => {
            const nuevoIdioma = e.target.value;
            localStorage.setItem("wineshop_idioma", nuevoIdioma);
            aplicarTraducciones(nuevoIdioma);
        });
    }
    aplicarTraducciones(currentLang);
}

// 4. FAVORITOS Y EVENTOS
function getFavoritos() {
    return JSON.parse(localStorage.getItem("wineshop_favoritos")) || [];
}

function setFavoritos(favs) {
    localStorage.setItem("wineshop_favoritos", JSON.stringify(favs));
    actualizarBadgeFavoritos();
}

function actualizarBadgeFavoritos() {
    const favs = getFavoritos();
    const countElements = document.querySelectorAll(".badge-count[id*='fav']");
    countElements.forEach(el => {
        el.textContent = favs.length > 0 ? favs.length : "";
        if (favs.length > 0) el.setAttribute("data-count", favs.length);
        else el.removeAttribute("data-count");
    });
}

function asignarEventosTarjetas(contenedor) {
    const favs = getFavoritos();
    contenedor.querySelectorAll(".wine-card[data-id]").forEach(card => {
        const id = card.getAttribute("data-id");
        const btnFav = card.querySelector(".btn-fav-card");
        
        if (btnFav) {
            btnFav.addEventListener("click", (e) => {
                e.stopPropagation();
                let actuales = getFavoritos();
                if (actuales.includes(id)) {
                    actuales = actuales.filter(v => v !== id);
                    btnFav.classList.remove("active");
                } else {
                    actuales.push(id);
                    btnFav.classList.add("active");
                }
                setFavoritos(actuales);
            });
        }

        const isSubdir = window.location.pathname.includes("/html/");
        const rutaProducto = isSubdir ? "producto.html" : "html/producto.html";
        
        const irAlProducto = (e) => {
            if (e.target.closest(".btn-fav-card") || e.target.closest(".btn-primary")) return;
            window.location.href = `${rutaProducto}?id=${id}`;
        };

        card.querySelector(".wine-name")?.addEventListener("click", irAlProducto);
        card.querySelector(".model-container")?.addEventListener("click", irAlProducto);
    });
}

// 5. INICIALIZACIÓN GENERAL DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    // Verificar edad
    const modalEdad = document.getElementById("modal-edad");
    const contenedorSitio = document.getElementById("sitio-web");
    if (modalEdad && sessionStorage.getItem("wineshop_mayor_edad") === "true") {
        modalEdad.classList.add("oculto");
        contenedorSitio.classList.remove("contenido-bloqueado");
    }

    document.getElementById("btn-mayor-edad")?.addEventListener("click", () => {
        sessionStorage.setItem("wineshop_mayor_edad", "true");
        window.location.reload();
    });
    document.getElementById("btn-menor-edad")?.addEventListener("click", () => {
        const ruta = window.location.pathname.includes("/html/") ? "juego_menores.html" : "html/juego_menores.html";
        window.location.href = ruta;
    });

    // Cargar datos JSON y construir UI
    await loadDatabase();
    if(appData) {
        iniciarControladorIdioma();
    }
});