let appData = null;
let currentLang = "es";
const CART_STORAGE_KEY = "wineshop_carrito_items";
const USERS_STORAGE_KEY = "wineshop_usuarios";
const ACTIVE_USER_KEY = "wineshop_usuario_activo";

// ==========================================================================
// 1. CARGA DE BASE DE DATOS (JSON)
// ==========================================================================
async function loadDatabase() {
    try {
        const isSubdir = window.location.pathname.includes("/html/");
        const jsonPath = isSubdir ? "../db.json" : "db.json";
        
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("No se pudo cargar db.json. Verifica la ruta o tu servidor local.");
        
        appData = await response.json();
    } catch (error) {
        console.error("Error al cargar la base de datos:", error);
    }
}

// ==========================================================================
// 2. RENDERIZADO DINÁMICO MPA
// ==========================================================================
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
        
        article.className = "wine-card reveal";
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
                <p class="body-regular">${contenedorId === 'catalogo-grid' ? traduccion.cat_desc : traduccion.desc}</p>
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
        article.className = "wine-card reveal";
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
        article.className = "wine-card reveal";
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

function renderizarPaginaFavoritos() {
    const grid = document.getElementById("favoritos-grid");
    const emptyMsg = document.getElementById("favoritos-vacio");
    if (!grid || !appData) return;

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
    const basePath = isSubdir ? "../" : "";
    const dicc = appData.i18n[currentLang];

    favs.forEach(id => {
        const vino = appData.vinos.find(v => v.id === id);
        if (!vino) return;

        const traduccion = vino.i18n[currentLang];
        const card = document.createElement("article");
        card.className = "wine-card reveal";
        card.setAttribute("data-id", vino.id);
        
        card.innerHTML = `
            <div class="model-container">
                <button type="button" class="btn-fav-card active" aria-label="${dicc.fav_remove_aria}" aria-pressed="true">
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
        
        grid.appendChild(card);
    });

    asignarEventosTarjetas(grid);
}

// ==========================================================================
// 3. I18N Y SELECCIÓN DE IDIOMA
// ==========================================================================
function obtenerIdiomaGuardado() {
    return localStorage.getItem("wineshop_idioma") || "es";
}

function aplicarTraducciones(idioma) {
    if (!appData) return;
    currentLang = idioma;
    document.documentElement.lang = idioma;
    const dicc = appData.i18n[idioma];

    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const clave = elem.getAttribute("data-i18n");
        if (dicc[clave]) elem.textContent = dicc[clave];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
        const clave = elem.getAttribute("data-i18n-placeholder");
        if (dicc[clave]) elem.setAttribute("placeholder", dicc[clave]);
    });

    renderizarVinos("destacados-grid", true);
    renderizarVinos("catalogo-grid", false);
    renderizarBodegas();
    renderizarExperiencias();
    renderizarPaginaFavoritos();
    
    if(document.getElementById("producto-detalle")) cargarDetalleProducto();
    if(document.getElementById("catalogo-grid")) inicializarFiltrosCatalogo();
    
    actualizarBadgesCarrito();
    actualizarBadgeFavoritos();
    iniciarAnimacionesScroll();

    if (typeof GEOEngine !== "undefined") {
        GEOEngine.init(appData, currentLang);
    }
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

// ==========================================================================
// 4. FAVORITOS Y EVENTOS
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
    document.querySelectorAll(".badge-count[id*='fav']").forEach(el => {
        el.textContent = favs.length > 0 ? favs.length : "";
        if (favs.length > 0) el.setAttribute("data-count", favs.length);
        else el.removeAttribute("data-count");
    });
}

function asignarEventosTarjetas(contenedor) {
    const isSubdir = window.location.pathname.includes("/html/");
    const rutaProducto = isSubdir ? "producto.html" : "html/producto.html";

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
                    mostrarToast("Eliminado de favoritos", "heart");
                } else {
                    actuales.push(id);
                    btnFav.classList.add("active");
                    mostrarToast("Añadido a favoritos", "heart");
                }
                setFavoritos(actuales);
                if (contenedor.id === "favoritos-grid") renderizarPaginaFavoritos();
            });
        }
        
        const irAlProducto = (e) => {
            if (e.target.closest(".btn-fav-card") || e.target.closest(".btn-primary")) return;
            window.location.href = `${rutaProducto}?id=${id}`;
        };

        card.querySelector(".wine-name")?.addEventListener("click", irAlProducto);
        card.querySelector(".model-container")?.addEventListener("click", irAlProducto);
    });
}

// ==========================================================================
// 5. DETALLE EN PRODUCTO.HTML
// ==========================================================================
function cargarDetalleProducto() {
    if (!appData) return;
    const params = new URLSearchParams(window.location.search);
    const vinoId = params.get("id") || "vino-1";
    const vino = appData.vinos.find(v => v.id === vinoId);
    if (!vino) return;

    const lang = currentLang;
    const trans = vino.i18n[lang];
    const isSubdir = window.location.pathname.includes("/html/");
    const basePath = isSubdir ? "../" : "";

    document.getElementById("detail-title").textContent = vino.nombre;
    document.getElementById("detail-vintage").textContent = trans.vintage;
    document.getElementById("detail-price").textContent = vino.precio;
    document.getElementById("detail-desc").textContent = trans.desc;
    document.getElementById("detail-grape").textContent = trans.grape;
    document.getElementById("detail-aging").textContent = trans.aging;
    document.getElementById("detail-alcohol").textContent = vino.alcohol;
    document.getElementById("detail-temp").textContent = vino.temp;

    const model = document.getElementById("detail-model");
    if (model) {
        model.setAttribute("src", `${basePath}${vino.modelo}`);
    }

    const btnFav = document.getElementById("btn-fav-detail");
    if (btnFav && !btnFav.dataset.bound) {
        btnFav.dataset.bound = "true";
        if (getFavoritos().includes(vino.id)) btnFav.classList.add("active");
        
        btnFav.addEventListener("click", () => {
            let favs = getFavoritos();
            if (favs.includes(vino.id)) {
                favs = favs.filter(id => id !== vino.id);
                btnFav.classList.remove("active");
                mostrarToast("Eliminado de favoritos", "heart");
            } else {
                favs.push(vino.id);
                btnFav.classList.add("active");
                mostrarToast("Añadido a favoritos", "heart");
            }
            setFavoritos(favs);
        });
    }

    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");
    const qtyInput = document.getElementById("qty-input");
    
    if (qtyMinus && !qtyMinus.dataset.bound) {
        qtyMinus.dataset.bound = "true";
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
// 6. FILTROS CATÁLOGO
// ==========================================================================
function inicializarFiltrosCatalogo() {
    if (!document.getElementById("catalogo-grid")) return;

    const searchInput = document.getElementById("wine-search");
    const typeRadios = document.querySelectorAll('input[name="wine-type"]');
    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-val");
    const btnReset = document.getElementById("btn-reset-filters");

    const normalizar = (txt) => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const aplicarFiltros = () => {
        const query = searchInput ? normalizar(searchInput.value) : "";
        const radioActivo = document.querySelector('input[name="wine-type"]:checked');
        const tipoSeleccionado = radioActivo ? radioActivo.value : "todos";
        const precioMax = priceRange ? parseFloat(priceRange.value) : 100;
        let visibles = 0;

        document.querySelectorAll("#catalogo-grid .wine-card").forEach(card => {
            const nombreVino = normalizar(card.querySelector(".wine-name")?.textContent || "");
            const tipoVino = card.getAttribute("data-type") || "";
            const precioVino = parseFloat(card.getAttribute("data-price")) || 0;

            if ((query === "" || nombreVino.includes(query)) && 
                (tipoSeleccionado === "todos" || tipoVino === tipoSeleccionado) && 
                (precioVino <= precioMax)) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        const resultsCountEl = document.getElementById("results-count");
        const noResultsEl = document.getElementById("no-results");
        
        if (resultsCountEl) resultsCountEl.textContent = visibles;
        if (noResultsEl) noResultsEl.style.display = visibles === 0 ? "block" : "none";
    };

    if(searchInput) searchInput.addEventListener("input", aplicarFiltros);
    typeRadios.forEach(radio => radio.addEventListener("change", aplicarFiltros));
    if(priceRange) {
        priceRange.addEventListener("input", (e) => {
            if(priceVal) priceVal.textContent = e.target.value;
            aplicarFiltros();
        });
    }

    if(btnReset) {
        btnReset.addEventListener("click", () => {
            if(searchInput) searchInput.value = "";
            const radioTodos = document.querySelector('input[name="wine-type"][value="todos"]');
            if (radioTodos) radioTodos.checked = true;
            if(priceRange) {
                priceRange.value = 50;
                if(priceVal) priceVal.textContent = "50";
            }
            aplicarFiltros();
        });
    }
}

// ==========================================================================
// 7. TOAST Y CARRITO
// ==========================================================================
function mostrarToast(mensaje, icono = "check") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${mensaje}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("toast-exit");
        toast.addEventListener("animationend", () => toast.remove());
    }, 3200);
}

function obtenerCarrito() { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; }
function guardarCarrito(items) { 
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); 
    actualizarBadgesCarrito();
    renderizarCarritoUI();
}

function actualizarBadgesCarrito() {
    const total = obtenerCarrito().reduce((acc, it) => acc + (it.cantidad || 0), 0);
    document.querySelectorAll(".cart-btn .badge-count").forEach(b => {
        b.textContent = total > 0 ? total : "";
        if (total > 0) b.setAttribute("data-count", total);
        else b.removeAttribute("data-count");
    });
}

function iniciarCarrito() {
    if (!document.getElementById("cart-slide-panel")) {
        const overlay = document.createElement("div");
        overlay.className = "cart-overlay";
        overlay.id = "cart-overlay";
        const panel = document.createElement("aside");
        panel.className = "cart-panel";
        panel.id = "cart-slide-panel";
        panel.innerHTML = `
            <header class="cart-panel-header">
                <h2 class="cart-panel-title">Tu Carrito</h2>
                <button type="button" class="cart-close-btn" id="cart-close-btn">&times;</button>
            </header>
            <div class="cart-panel-body" id="cart-panel-body"></div>
            <footer class="cart-panel-footer" id="cart-panel-footer">
                <div class="cart-total-row"><span>Total:</span><span id="cart-total-value">0,00 €</span></div>
                <button type="button" class="btn btn-primary btn-full" id="cart-checkout-btn">Tramitar Pedido</button>
            </footer>
        `;
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
        
        const cerrar = () => { overlay.classList.remove("is-open"); panel.classList.remove("is-open"); };
        document.getElementById("cart-close-btn").addEventListener("click", cerrar);
        overlay.addEventListener("click", cerrar);
        
        document.getElementById("cart-checkout-btn").addEventListener("click", () => {
            if (obtenerCarrito().length === 0) {
                mostrarToast("El carrito está vacío");
                return;
            }
            mostrarToast("¡Gracias por tu compra!", "check");
            guardarCarrito([]);
            cerrar();
        });
    }

    document.querySelectorAll(".cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            renderizarCarritoUI();
            document.getElementById("cart-overlay").classList.add("is-open");
            document.getElementById("cart-slide-panel").classList.add("is-open");
        });
    });

    document.addEventListener("click", (e) => {
        const btnAdd = e.target.closest(".btn-primary");
        if (btnAdd && btnAdd.textContent.toLowerCase().includes("carrito")) {
            e.stopPropagation();
            const card = btnAdd.closest(".wine-card[data-id]");
            const detailBtn = btnAdd.id === "btn-add-detail";
            const params = new URLSearchParams(window.location.search);
            const id = detailBtn ? params.get("id") : (card ? card.getAttribute("data-id") : null);
            
            if (id && appData) {
                const vinoInfo = appData.vinos.find(v => v.id === id);
                if (!vinoInfo) return;
                
                let items = obtenerCarrito();
                const index = items.findIndex(it => it.id === id);
                const qtyInput = document.getElementById("qty-input");
                const qty = (detailBtn && qtyInput) ? parseInt(qtyInput.value) : 1;
                
                if (index > -1) items[index].cantidad += qty;
                else items.push({ id, nombre: vinoInfo.nombre, precio: vinoInfo.precio, precioNum: vinoInfo.precioNum, cantidad: qty });
                
                guardarCarrito(items);
                mostrarToast(`Añadido al carrito`, "cart");
                
                renderizarCarritoUI();
                document.getElementById("cart-overlay").classList.add("is-open");
                document.getElementById("cart-slide-panel").classList.add("is-open");
            }
        }
    });
}

function renderizarCarritoUI() {
    const body = document.getElementById("cart-panel-body");
    const footer = document.getElementById("cart-panel-footer");
    if (!body || !footer) return;
    
    const items = obtenerCarrito();
    
    if (items.length === 0) {
        body.innerHTML = `<div class="cart-empty-msg"><p>Tu carrito está vacío</p></div>`;
        footer.style.display = "none";
        return;
    }

    footer.style.display = "block";
    let html = "", total = 0;
    items.forEach(it => {
        total += it.precioNum * it.cantidad;
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${it.nombre}</div>
                    <div class="cart-item-price">${it.precio}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="btn-cart-dec" data-id="${it.id}">-</button>
                    <span>${it.cantidad}</span>
                    <button class="btn-cart-inc" data-id="${it.id}">+</button>
                </div>
            </div>`;
    });
    
    body.innerHTML = html;
    document.getElementById("cart-total-value").textContent = total.toLocaleString("es-ES", { minimumFractionDigits: 2 }) + " €";

    body.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            let items = obtenerCarrito();
            const index = items.findIndex(it => it.id === id);
            if (btn.classList.contains("btn-cart-dec")) items[index].cantidad--;
            if (btn.classList.contains("btn-cart-inc")) items[index].cantidad++;
            if (items[index].cantidad <= 0) items.splice(index, 1);
            guardarCarrito(items);
        });
    });
}

// ==========================================================================
// 8. MENÚ MÓVIL Y ANIMACIONES SCROLL
// ==========================================================================
function iniciarMenuMobile() {
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", isOpen);
        });
    }
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal:not(.is-visible)").forEach(el => observer.observe(el));
}

// ==========================================================================
// 9. GESTIÓN DE AUTENTICACIÓN Y EDICIÓN DE PERFIL (localStorage + db.json)
// ==========================================================================
function obtenerTodosLosUsuarios() {
    const usuariosLocal = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const usuariosBD = appData && appData.usuarios ? appData.usuarios : [];
    
    // Fusionar manteniendo la versión más reciente en localStorage
    const mapaUsuarios = new Map();
    usuariosBD.forEach(u => mapaUsuarios.set(u.id, u));
    usuariosLocal.forEach(u => mapaUsuarios.set(u.id, { ...mapaUsuarios.get(u.id), ...u }));

    return Array.from(mapaUsuarios.values());
}

function registrarUsuario(nombre, email, password, avatar = null) {
    const usuariosLocal = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const todos = obtenerTodosLosUsuarios();
    const existe = todos.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existe) {
        guardarSesionUsuario(existe);
        return { success: true, user: existe };
    }

    const nuevoUsuario = {
        id: "usr-" + Date.now(),
        nombre: nombre,
        email: email,
        password: password || "google-oauth-login",
        telefono: "",
        fechaNacimiento: "",
        dni: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        provincia: "",
        avatar: avatar || "https://lh3.googleusercontent.com/a/default-user"
    };

    usuariosLocal.push(nuevoUsuario);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuariosLocal));
    guardarSesionUsuario(nuevoUsuario);
    return { success: true, user: nuevoUsuario };
}

function autenticarUsuario(email, password) {
    const todos = obtenerTodosLosUsuarios();
    const usuario = todos.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (usuario) {
        guardarSesionUsuario(usuario);
        return { success: true, user: usuario };
    }

    return { success: false, message: "Correo o contraseña incorrectos." };
}

function guardarSesionUsuario(usuario) {
    const sesion = { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email,
        telefono: usuario.telefono || "",
        fechaNacimiento: usuario.fechaNacimiento || "",
        dni: usuario.dni || "",
        direccion: usuario.direccion || "",
        ciudad: usuario.ciudad || "",
        codigoPostal: usuario.codigoPostal || "",
        provincia: usuario.provincia || "",
        avatar: usuario.avatar || "https://lh3.googleusercontent.com/a/default-user"
    };
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(sesion));
    actualizarEstadoUsuarioUI();
}

function obtenerUsuarioActivo() {
    try {
        return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY));
    } catch (e) {
        return null;
    }
}
// Actualización del perfil con persistencia total
function actualizarPerfilUsuario(datosNuevos) {
    const sesion = obtenerUsuarioActivo();
    if (!sesion) return { success: false, message: "No hay sesión activa." };

    // 1. Unificar datos de la sesión con los nuevos datos introducidos
    const usuarioActualizado = {
        ...sesion,
        ...datosNuevos
    };

    // 2. Guardar en la sesión activa
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(usuarioActualizado));

    // 3. Actualizar la lista global de usuarios registrados en localStorage
    const usuariosLocal = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const index = usuariosLocal.findIndex(u => u.id === sesion.id || u.email.toLowerCase() === sesion.email.toLowerCase());

    if (index !== -1) {
        usuariosLocal[index] = { ...usuariosLocal[index], ...datosNuevos };
    } else {
        usuariosLocal.push(usuarioActualizado);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuariosLocal));

    // 4. Refrescar interfaz
    actualizarEstadoUsuarioUI();

    return { success: true, user: usuarioActualizado };
}

function cerrarSesion() {
    localStorage.removeItem(ACTIVE_USER_KEY);
    localStorage.removeItem(CART_STORAGE_KEY);
    actualizarBadgesCarrito();
    renderizarCarritoUI();

    actualizarEstadoUsuarioUI();
    mostrarToast("Sesión cerrada y carrito vaciado");

    const isSubdir = window.location.pathname.includes("/html/");
    const rutaInicio = isSubdir ? "../index.html" : "index.html";
    setTimeout(() => {
        window.location.href = rutaInicio;
    }, 800);
}
// ==========================================================================
// 10. INICIALIZACIÓN GLOBAL
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
    iniciarMenuMobile();
    
    // Verificación de edad
    const modalEdad = document.getElementById("modal-edad");
    if (modalEdad) {
        if (sessionStorage.getItem("wineshop_mayor_edad") === "true") {
            modalEdad.classList.add("oculto");
            document.getElementById("sitio-web")?.classList.remove("contenido-bloqueado");
        }

        document.getElementById("btn-mayor-edad")?.addEventListener("click", () => {
            sessionStorage.setItem("wineshop_mayor_edad", "true");
            document.documentElement.classList.add("edad-verificada");
            modalEdad.classList.add("oculto");
            document.getElementById("sitio-web")?.classList.remove("contenido-bloqueado");
            document.body.style.overflow = "";
        });

        document.getElementById("btn-menor-edad")?.addEventListener("click", () => {
            const isSubdir = window.location.pathname.includes("/html/");
            const rutaJuego = isSubdir ? "juego_menores.html" : "html/juego_menores.html";
            window.location.href = rutaJuego;
        });
    }

    // Cargar datos y renderizar
    await loadDatabase();
    if(appData) {
        iniciarControladorIdioma();
        iniciarCarrito();
        actualizarEstadoUsuarioUI();
    }
});