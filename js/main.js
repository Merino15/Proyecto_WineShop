// ==========================================================================
// 1. CATÁLOGO CENTRALIZADO DE PRODUCTOS
// ==========================================================================
const catalogoVinos = {
    "vino-1": {
        id: "vino-1",
        nombre: "Reserva Especial 2018",
        desc: "Tempranillo, intenso, elegante y estructurado.",
        precio: "24,00 €",
        modelo: "botella_vino.glb",
        vintage: "D.O.Ca. Rioja · Cosecha 2018",
        grape: "Tempranillo 95%, Graciano 5%",
        aging: "24 meses en barrica francesa y americana",
        alcohol: "14,5% Vol.",
        temp: "16°C - 18°C"
    },
    "vino-2": {
        id: "vino-2",
        nombre: "Gran Bordeos Crianza",
        desc: "Aromas a roble tostado, ciruela y frutos rojos.",
        precio: "35,50 €",
        modelo: "botella_vino.glb",
        vintage: "AOC Bordeaux Superieur",
        grape: "Cabernet Sauvignon 70%, Merlot 30%",
        aging: "18 meses en barrica francesa nueva",
        alcohol: "14,0% Vol.",
        temp: "16°C - 17°C"
    },
    "vino-3": {
        id: "vino-3",
        nombre: "Blanco Fermentado en Barrica",
        desc: "Viura fresca, notas cítricas, florales y miel.",
        precio: "18,90 €",
        modelo: "botella_vino.glb",
        vintage: "D.O.Ca. Rioja · Selección Especial",
        grape: "Viura 85%, Malvasía 15%",
        aging: "6 meses sobre lías con battonage",
        alcohol: "13,0% Vol.",
        temp: "10°C - 12°C"
    },
    "vino-4": {
        id: "vino-4",
        nombre: "Espumoso Brut Nature",
        desc: "Burbuja fina persistente, ideal para celebraciones.",
        precio: "29,00 €",
        modelo: "botella_vino.glb",
        vintage: "Método Tradicional · Reserva",
        grape: "Chardonnay 60%, Pinot Noir 40%",
        aging: "30 meses de rima en calado",
        alcohol: "12,5% Vol.",
        temp: "6°C - 8°C"
    },
    "vino-5": {
        id: "vino-5",
        nombre: "Selección de Autor 2017",
        desc: "Edición limitada procedente de viñedos viejos.",
        precio: "42,00 €",
        modelo: "botella_vino.glb",
        vintage: "Viñedo Singular · Edición Limitada",
        grape: "Garnacha 100%",
        aging: "20 meses en foudres de roble austríaco",
        alcohol: "15,0% Vol.",
        temp: "17°C - 19°C"
    },
    "vino-6": {
        id: "vino-6",
        nombre: "Rosado Pálido de Lágrima",
        desc: "Garnacha suave, sutil, aromática y muy refrescante.",
        precio: "15,50 €",
        modelo: "botella_vino.glb",
        vintage: "Prensado Directo · Añada Actual",
        grape: "Garnacha 80%, Tempranillo Blanco 20%",
        aging: "Joven · 3 meses en acero inoxidable",
        alcohol: "13,5% Vol.",
        temp: "8°C - 10°C"
    }
};

// ==========================================================================
// 2. NAVEGACIÓN MOBILE RESPONSIVE (MENÚ HAMBURGUESA ACCESIBLE)
// ==========================================================================
function iniciarMenuMobile() {
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    if (!navToggle || !mainNav) return;

    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });

    document.addEventListener("click", (e) => {
        if (!mainNav.contains(e.target) && !navToggle.contains(e.target) && mainNav.classList.contains("is-open")) {
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menú de navegación");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menú de navegación");
            navToggle.focus();
        }
    });
}

// ==========================================================================
// 3. GESTIÓN DE IDIOMAS (Controlador Robusto)
// ==========================================================================
function iniciarControladorIdioma() {
    const customSelect = document.getElementById("custom-lang-select");
    if (!customSelect) return;

    function obtenerIdiomaActual() {
        const match = document.cookie.match(/(^|;\s*)googtrans=([^;]+)/);
        if (match) {
            const partes = decodeURIComponent(match[2]).split("/");
            return partes[2] || "es";
        }
        return "es";
    }

    customSelect.value = obtenerIdiomaActual();

    customSelect.addEventListener("change", (e) => {
        const nuevoIdioma = e.target.value;

        if (nuevoIdioma === "es") {
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + window.location.hostname + "; path=/;";
        } else {
            const valorCookie = `/es/${nuevoIdioma}`;
            document.cookie = `googtrans=${valorCookie}; path=/;`;
            document.cookie = `googtrans=${valorCookie}; domain=${window.location.hostname}; path=/;`;
        }

        window.location.reload();
    });
}

// ==========================================================================
// 4. FAVORITOS (localStorage)
// ==========================================================================
function getFavoritos() {
    return JSON.parse(localStorage.getItem("wineshop_favoritos")) || [];
}

function setFavoritos(favs) {
    localStorage.setItem("wineshop_favoritos", JSON.stringify(favs));
    actualizarBadgeFavoritos();
}

function actualizarBadgeFavoritos() {
    const favs = getFavoritos();
    const countElement = document.getElementById("header-fav-count");
    if (countElement) {
        if (favs.length > 0) {
            countElement.textContent = favs.length;
            countElement.setAttribute("data-count", favs.length);
        } else {
            countElement.textContent = "";
            countElement.removeAttribute("data-count");
        }
    }
}

function toggleFavorito(vinoId, btn) {
    let favs = getFavoritos();
    if (favs.includes(vinoId)) {
        favs = favs.filter(id => id !== vinoId);
        if (btn) {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
            btn.setAttribute("aria-label", "Añadir a favoritos");
        }
    } else {
        favs.push(vinoId);
        if (btn) {
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");
            btn.setAttribute("aria-label", "Quitar de favoritos");
        }
    }
    setFavoritos(favs);

    if (document.getElementById("favoritos-grid")) {
        renderizarPaginaFavoritos();
    }
}

function renderizarPaginaFavoritos() {
    const grid = document.getElementById("favoritos-grid");
    const emptyMsg = document.getElementById("favoritos-vacio");
    if (!grid) return;

    const favs = getFavoritos();
    grid.innerHTML = "";

    if (favs.length === 0) {
        grid.style.display = "none";
        if (emptyMsg) emptyMsg.style.display = "block";
        return;
    }

    grid.style.display = "grid";
    if (emptyMsg) emptyMsg.style.display = "none";

    const isSubdir = window.location.pathname.includes("/html/");
    const rutaBase = isSubdir ? "../" : "";
    const rutaProducto = isSubdir ? "producto.html" : "html/producto.html";

    favs.forEach(id => {
        const vino = catalogoVinos[id];
        if (!vino) return;

        const card = document.createElement("article");
        card.className = "wine-card";
        card.setAttribute("data-id", vino.id);
        card.innerHTML = `
            <div class="model-container">
                <button type="button" class="btn-fav-card active" aria-label="Quitar de favoritos" aria-pressed="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <model-viewer 
                    src="${rutaBase}${vino.modelo}" 
                    alt="Modelo 3D de ${vino.nombre}" 
                    touch-action="pan-y"
                    shadow-intensity="1" 
                    camera-controls="false" 
                    disable-zoom
                    class="wine-3d-model">
                </model-viewer>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${vino.nombre}</h3>
                <p class="body-regular">${vino.desc}</p>
                <p class="wine-price"><span class="sr-only">Precio: </span>${vino.precio}</p>
                <button class="btn btn-primary btn-full">Añadir al carrito</button>
            </div>
        `;

        const btn = card.querySelector(".btn-fav-card");
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorito(vino.id, btn);
        });

        const openProduct = (e) => {
            if (e.target.closest(".btn-fav-card") || e.target.closest(".btn-primary")) return;
            window.location.href = `${rutaProducto}?id=${vino.id}`;
        };
        card.querySelector(".wine-name").addEventListener("click", openProduct);
        card.querySelector(".model-container").addEventListener("click", openProduct);

        grid.appendChild(card);
    });
}

// ==========================================================================
// 5. DETALLE EN PRODUCTO.HTML
// ==========================================================================
function cargarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const vinoId = params.get("id") || "vino-1";
    const vino = catalogoVinos[vinoId];
    if (!vino) return;

    const title = document.getElementById("detail-title");
    const vintage = document.getElementById("detail-vintage");
    const price = document.getElementById("detail-price");
    const desc = document.getElementById("detail-desc");
    const grape = document.getElementById("detail-grape");
    const aging = document.getElementById("detail-aging");
    const alcohol = document.getElementById("detail-alcohol");
    const temp = document.getElementById("detail-temp");
    const model = document.getElementById("detail-model");
    const btnFav = document.getElementById("btn-fav-detail");

    const isSubdir = window.location.pathname.includes("/html/");
    const rutaBase = isSubdir ? "../" : "";

    if (title) title.textContent = vino.nombre;
    if (vintage) vintage.textContent = vino.vintage;
    if (price) price.textContent = vino.precio;
    if (desc) desc.textContent = vino.desc;
    if (grape) grape.textContent = vino.grape;
    if (aging) aging.textContent = vino.aging;
    if (alcohol) alcohol.textContent = vino.alcohol;
    if (temp) temp.textContent = vino.temp;
    if (model) {
        model.setAttribute("src", `${rutaBase}${vino.modelo}`);
        model.setAttribute("touch-action", "pan-y");
    }

    if (btnFav) {
        const favs = getFavoritos();
        if (favs.includes(vino.id)) {
            btnFav.classList.add("active");
            btnFav.setAttribute("aria-pressed", "true");
        }
        btnFav.addEventListener("click", () => toggleFavorito(vino.id, btnFav));
    }

    const qtyInput = document.getElementById("qty-input");
    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");

    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener("click", () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });
        qtyPlus.addEventListener("click", () => {
            let val = parseInt(qtyInput.value) || 1;
            qtyInput.value = val + 1;
        });
    }
}

// ==========================================================================
// 6. FILTRADO MULTI-VARIABLE (Buscador por Nombre, Tipo y Precio)
// ==========================================================================
function inicializarFiltrosCatalogo() {
    const wineCardsCatalog = document.querySelectorAll("#catalogo-grid .wine-card");
    const searchInput = document.getElementById("wine-search");
    const typeRadios = document.querySelectorAll('input[name="wine-type"]');
    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-val");
    const btnReset = document.getElementById("btn-reset-filters");
    const resultsCount = document.getElementById("results-count");
    const noResultsMsg = document.getElementById("no-results");

    if (wineCardsCatalog.length === 0) return;

    const normalizar = (txt) => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    function aplicarFiltros() {
        const query = searchInput ? normalizar(searchInput.value) : "";
        const radioActivo = document.querySelector('input[name="wine-type"]:checked');
        const tipoSeleccionado = radioActivo ? radioActivo.value : "todos";
        const precioMax = priceRange ? parseFloat(priceRange.value) : 100;
        let visibles = 0;

        wineCardsCatalog.forEach(card => {
            const nombreVino = normalizar(card.querySelector(".wine-name")?.textContent || "");
            const tipoVino = card.getAttribute("data-type") || "";
            const precioVino = parseFloat(card.getAttribute("data-price")) || 0;

            const coincideNombre = query === "" || nombreVino.includes(query);
            const coincideTipo = (tipoSeleccionado === "todos" || tipoVino.toLowerCase() === tipoSeleccionado.toLowerCase());
            const coincidePrecio = (precioVino <= precioMax);

            if (coincideNombre && coincideTipo && coincidePrecio) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        if (resultsCount) resultsCount.textContent = visibles;
        if (noResultsMsg) {
            noResultsMsg.style.display = (visibles === 0) ? "block" : "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", aplicarFiltros);
    }

    typeRadios.forEach(radio => {
        radio.addEventListener("change", aplicarFiltros);
    });

    if (priceRange) {
        priceRange.addEventListener("input", (e) => {
            if (priceVal) priceVal.textContent = e.target.value;
            aplicarFiltros();
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            const radioTodos = document.querySelector('input[name="wine-type"][value="todos"]');
            if (radioTodos) radioTodos.checked = true;

            if (priceRange) {
                priceRange.value = 50;
                if (priceVal) priceVal.textContent = "50";
            }
            aplicarFiltros();
        });
    }

    aplicarFiltros();
}

// ==========================================================================
// 7. INICIALIZACIÓN GENERAL (DOM Ready)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // A. INICIALIZAR MENÚ MÓVIL Y TOUCH ACTION EN 3D
    iniciarMenuMobile();

    document.querySelectorAll("model-viewer").forEach(mv => {
        mv.setAttribute("touch-action", "pan-y");
    });

    // B. CONTROL DE MAYORÍA DE EDAD (+18) CON DESENFOQUE
    const modalEdad = document.getElementById("modal-edad");
    const contenedorSitio = document.getElementById("sitio-web");
    const btnMayor = document.getElementById("btn-mayor-edad");
    const btnMenor = document.getElementById("btn-menor-edad");
    const verificado = sessionStorage.getItem("wineshop_mayor_edad");

    if (modalEdad && contenedorSitio) {
        if (verificado === "true") {
            modalEdad.classList.add("oculto");
            contenedorSitio.classList.remove("contenido-bloqueado");
            document.documentElement.classList.add("edad-verificada");
            document.body.style.overflow = "";
        } else {
            modalEdad.classList.remove("oculto");
            contenedorSitio.classList.add("contenido-bloqueado");
            document.documentElement.classList.remove("edad-verificada");
            document.body.style.overflow = "hidden";
        }

        if (btnMayor) {
            btnMayor.addEventListener("click", () => {
                sessionStorage.setItem("wineshop_mayor_edad", "true");
                document.documentElement.classList.add("edad-verificada");
                modalEdad.classList.add("oculto");
                contenedorSitio.classList.remove("contenido-bloqueado");
                document.body.style.overflow = "";
            });
        }

        if (btnMenor) {
            btnMenor.addEventListener("click", () => {
                const rutaJuego = window.location.pathname.includes("/html/") 
                    ? "juego_menores.html" 
                    : "html/juego_menores.html";
                window.location.href = rutaJuego;
            });
        }
    } else if (verificado !== "true" && window.location.pathname.includes("/html/") && !window.location.pathname.includes("juego_menores.html")) {
        window.location.replace("../index.html");
        return;
    }

    // C. INICIALIZAR GESTOR DE IDIOMAS
    iniciarControladorIdioma();

    // D. INICIALIZACIÓN DE FAVORITOS Y TARJETAS
    actualizarBadgeFavoritos();

    const favs = getFavoritos();
    document.querySelectorAll(".wine-card[data-id]").forEach(card => {
        const id = card.getAttribute("data-id");
        const btnFav = card.querySelector(".btn-fav-card");

        if (btnFav) {
            if (favs.includes(id)) {
                btnFav.classList.add("active");
                btnFav.setAttribute("aria-pressed", "true");
                btnFav.setAttribute("aria-label", "Quitar de favoritos");
            }

            btnFav.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorito(id, btnFav);
            });
        }

        const isSubdir = window.location.pathname.includes("/html/");
        const rutaProducto = isSubdir ? "producto.html" : "html/producto.html";
        const clickableName = card.querySelector(".wine-name");
        const clickableModel = card.querySelector(".model-container");

        const irAlProducto = (e) => {
            if (e.target.closest(".btn-fav-card") || e.target.closest(".btn-primary")) return;
            window.location.href = `${rutaProducto}?id=${id}`;
        };

        if (clickableName) clickableName.addEventListener("click", irAlProducto);
        if (clickableModel) clickableModel.addEventListener("click", irAlProducto);
    });

    if (document.getElementById("favoritos-grid")) {
        renderizarPaginaFavoritos();
    }

    if (document.getElementById("producto-detalle")) {
        cargarDetalleProducto();
    }

    // E. EJECUTAR FILTROS DEL CATÁLOGO
    inicializarFiltrosCatalogo();

    // F. ROTACIÓN 3D AL HACER HOVER SOBRE MODELOS
    const wineCards = document.querySelectorAll(".wine-card");
    wineCards.forEach(card => {
        const model = card.querySelector("model-viewer");
        if (model) {
            let rotationFrame = null;
            let currentAngle = 0;

            const rotateBottle = () => {
                currentAngle = (currentAngle + 1.2) % 360;
                model.setAttribute("camera-orbit", `${currentAngle}deg 75deg 105%`);
                rotationFrame = requestAnimationFrame(rotateBottle);
            };

            card.addEventListener("mouseenter", () => {
                rotationFrame = requestAnimationFrame(rotateBottle);
            });

            card.addEventListener("mouseleave", () => {
                if (rotationFrame) {
                    cancelAnimationFrame(rotationFrame);
                }
                model.setAttribute("camera-orbit", "0deg 75deg 105%");
                currentAngle = 0;
            });
        }
    });
});
