/**
 * WINESHOP - MOTOR PRINCIPAL JS ACCESIBLE Y DINÁMICO
 * Incluye verificación de edad, newsletter popup, login / mi_cuenta con sesión activa,
 * carrusel hero, carrusel de reseñas, carrito de compras, favoritos e i18n.
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
 * Actualiza los enlaces del icono de usuario en la cabecera según el estado de la sesión
 */
function actualizarEnlaceUsuario() {
    const usuario = obtenerUsuarioActivo();
    const userLinks = document.querySelectorAll('a[href*="login.html"], a[href*="mi_cuenta.html"]');
    
    const targetPage = usuario 
        ? (isSubdir ? "mi_cuenta.html" : "html/mi_cuenta.html")
        : (isSubdir ? "login.html" : "html/login.html");

    userLinks.forEach(link => {
        link.href = targetPage;
        if (usuario) {
            link.setAttribute("aria-label", `Mi Cuenta (${usuario.nombre})`);
        } else {
            link.setAttribute("aria-label", "Mi Cuenta e Iniciar Sesión");
        }
    });

    // Redirecciones automáticas según si hay o no sesión activa
    const path = window.location.pathname;
    if (usuario && path.includes("login.html")) {
        window.location.href = isSubdir ? "mi_cuenta.html" : "html/mi_cuenta.html";
    } else if (!usuario && path.includes("mi_cuenta.html")) {
        window.location.href = isSubdir ? "login.html" : "html/login.html";
    }
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
 * Control del Modal Popup de Newsletter
 */
function iniciarNewsletterPopup() {
    const modal = document.getElementById("newsletter-modal");
    if (!modal) return;

    const btnClose = document.getElementById("btn-close-newsletter");
    const btnSkip = document.getElementById("btn-skip-newsletter");
    const form = document.getElementById("newsletter-form");

    const yaInteractuado = localStorage.getItem("wineshop_newsletter_dismissed");

    if (!yaInteractuado) {
        setTimeout(() => {
            const ageModal = document.getElementById("age-gate-modal");
            const ageModalAbierto = ageModal && !ageModal.classList.contains("hidden");

            if (!ageModalAbierto) {
                modal.classList.remove("hidden");
            }
        }, 3500);
    }

    function cerrarModal() {
        modal.classList.add("hidden");
        localStorage.setItem("wineshop_newsletter_dismissed", "true");
    }

    if (btnClose) btnClose.addEventListener("click", cerrarModal);
    if (btnSkip) btnSkip.addEventListener("click", cerrarModal);

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("newsletter-email");
            const privacyCheckbox = document.getElementById("newsletter-privacy");

            if (!emailInput.value || !emailInput.checkValidity()) {
                mostrarToast("Introduce un correo electrónico válido.");
                return;
            }

            if (!privacyCheckbox.checked) {
                mostrarToast("Debes aceptar la política de privacidad.");
                return;
            }

            cerrarModal();
            mostrarToast("¡Gracias por suscribirte! Revisa tu email para tu 10% dto.");
            announceToScreenReader("Suscripción a la newsletter realizada con éxito.");
        });
    }
}

/**
 * Gestión de Autenticación (Login, Registro y Alternancia de Pestañas)
 */
function iniciarAutenticacion() {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;

    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabLogin.setAttribute("aria-selected", "true");
        tabRegister.classList.remove("active");
        tabRegister.setAttribute("aria-selected", "false");

        formLogin.classList.remove("hidden");
        formRegister.classList.add("hidden");
    });

    tabRegister.addEventListener("click", () => {
        tabRegister.classList.add("active");
        tabRegister.setAttribute("aria-selected", "true");
        tabLogin.classList.remove("active");
        tabLogin.setAttribute("aria-selected", "false");

        formRegister.classList.remove("hidden");
        formLogin.classList.add("hidden");
    });

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email")?.value.trim();
        const password = document.getElementById("login-password")?.value.trim();

        if (!email || !password) {
            mostrarToast("Por favor, rellena todos los campos.");
            return;
        }

        const usuariosLocales = JSON.parse(localStorage.getItem("wineshop_usuarios_locales")) || [];
        const todosLosUsuarios = [...(appData?.usuarios || []), ...usuariosLocales];

        const usuarioEncontrado = todosLosUsuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (usuarioEncontrado) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuarioEncontrado));
            mostrarToast(`¡Bienvenido de nuevo, ${usuarioEncontrado.nombre}!`);
            announceToScreenReader(`Sesión iniciada como ${usuarioEncontrado.nombre}`);
            
            setTimeout(() => {
                window.location.href = isSubdir ? "mi_cuenta.html" : "html/mi_cuenta.html";
            }, 1000);
        } else {
            mostrarToast("Correo electrónico o contraseña incorrectos.");
        }
    });

    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("reg-nombre")?.value.trim();
        const email = document.getElementById("reg-email")?.value.trim();
        const password = document.getElementById("reg-password")?.value.trim();
        const confirmPass = document.getElementById("reg-confirm-password")?.value.trim();
        const terms = document.getElementById("reg-terms")?.checked;

        if (!nombre || !email || !password || !confirmPass) {
            mostrarToast("Por favor, completa todos los campos.");
            return;
        }

        if (password.length < 6) {
            mostrarToast("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== confirmPass) {
            mostrarToast("Las contraseñas no coinciden.");
            return;
        }

        if (!terms) {
            mostrarToast("Debes aceptar la política de privacidad.");
            return;
        }

        const usuariosLocales = JSON.parse(localStorage.getItem("wineshop_usuarios_locales")) || [];
        const todosLosUsuarios = [...(appData?.usuarios || []), ...usuariosLocales];

        if (todosLosUsuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            mostrarToast("Ya existe una cuenta con este correo electrónico.");
            return;
        }

        const nuevoUsuario = {
            id: `usr-local-${Date.now()}`,
            nombre: nombre,
            email: email,
            password: password,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
        };

        usuariosLocales.push(nuevoUsuario);
        localStorage.setItem("wineshop_usuarios_locales", JSON.stringify(usuariosLocales));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nuevoUsuario));

        mostrarToast("¡Cuenta creada correctamente! Redirigiendo...");
        announceToScreenReader("Cuenta creada con éxito.");

        setTimeout(() => {
            window.location.href = isSubdir ? "mi_cuenta.html" : "html/mi_cuenta.html";
        }, 1000);
    });
}

/**
 * Inicialización de la vista Mi Cuenta
 */
function iniciarMiCuenta() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const avatarEl = document.getElementById("user-avatar");
    const nombreEl = document.getElementById("user-name");
    const emailEl = document.getElementById("user-email");
    const dniEl = document.getElementById("user-dni");
    const telEl = document.getElementById("user-phone");
    const dirEl = document.getElementById("user-address");

    if (avatarEl && usuario.avatar) avatarEl.src = usuario.avatar;
    if (nombreEl) nombreEl.textContent = usuario.nombre;
    if (emailEl) emailEl.textContent = usuario.email;
    if (dniEl) dniEl.textContent = usuario.dni || "No especificado";
    if (telEl) telEl.textContent = usuario.telefono || "No especificado";
    if (dirEl) dirEl.textContent = usuario.direccion ? `${usuario.direccion}, ${usuario.ciudad || ''}` : "No especificada";

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem(USER_STORAGE_KEY);
            mostrarToast("Has cerrado sesión correctamente.");
            setTimeout(() => {
                window.location.href = isSubdir ? "../index.html" : "index.html";
            }, 800);
        });
    }

    renderizarPedidosUsuario(usuario.id);
}

function renderizarPedidosUsuario(usuarioId) {
    const contenedor = document.getElementById("pedidos-lista");
    if (!contenedor || !appData) return;

    const misPedidos = (appData.pedidos || []).filter(p => p.usuarioId === usuarioId || usuarioId.startsWith("usr-local"));
    
    if (misPedidos.length === 0) {
        contenedor.innerHTML = `<p class="body-regular">Aún no has realizado ningún pedido en WineShop.</p>`;
        return;
    }

    contenedor.innerHTML = misPedidos.map(p => `
        <div style="background: var(--color-blanco); border: 2px solid var(--color-borde); border-radius: 8px; margin-bottom: 16px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-borde); padding-bottom: 10px; margin-bottom: 12px;">
                <strong>${p.id}</strong>
                <span style="background: var(--color-primario-bordeos); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">${p.estado}</span>
            </div>
            <p><strong>Fecha:</strong> ${p.fecha}</p>
            <p><strong>Método de pago:</strong> ${p.metodoPago}</p>
            <p><strong>Total:</strong> <strong style="color: var(--color-primario-bordeos);">${p.total}</strong></p>
        </div>
    `).join("");
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
    }

    startAutoplay();
}

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
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        contenedor.appendChild(article);
    });
}

/**
 * Renderizado de Experiencias
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
                <img src="${imgPath}" alt="${traduccion.titulo || 'Experiencia'}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${traduccion.titulo || 'Experiencia'}</h3>
                <p style="font-weight: 700; color: var(--color-secundario-oro); margin-bottom: 6px;">
                    Organizado por: ${exp.nombreBodega || 'Bodega Asociada'}
                </p>
                <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 8px;">${traduccion.duracion || ''}</p>
                <p class="body-regular" style="margin-bottom: 16px;">${traduccion.desc || ''}</p>
                <p class="wine-price" style="margin-top: auto;">${exp.precio} <small style="font-size: 0.9rem; font-weight: 400;">${dicc.per_person || '/ persona'}</small></p>
                
                <a href="${enlaceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full">
                    ${dicc.btn_reservar_bodega || 'Reservar en la web de la bodega'}
                </a>
            </div>
        `;
        contenedor.appendChild(article);
    });
}

/**
 * Gestión de Favoritos
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
 * Asignación de Eventos a Tarjetas
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
                } else {
                    favs.push(id);
                    btnFav.classList.add("active");
                    btnFav.setAttribute("aria-pressed", "true");
                    if (svg) svg.setAttribute("fill", "currentColor");
                    mostrarToast("Guardado en mis favoritos");
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
 * Gestión de Carrito
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
 * Autenticación de Usuario Activo
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
 * Control de Selector de Idioma
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
        });
    }
}

/**
 * Menú Móvil
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
        
        actualizarEnlaceUsuario();
        iniciarVerificacionEdad();
        iniciarNewsletterPopup();
        iniciarAutenticacion();
        iniciarMiCuenta();
        
        iniciarCarruselHero();
        iniciarCarruselResenas();
        
        renderizarVinos("destacados-grid", true);
        
        // Comprobación para páginas específicas
        if (document.getElementById("search-input") || document.getElementById("type-select")) {
            iniciarFiltrosCatalogo();
        } else {
            renderizarVinos("catalogo-grid", false);
        }

        // <--- Activa la carga del detalle si estamos en producto.html --->
        if (window.location.pathname.includes("producto.html")) {
            iniciarDetalleProducto();
        }
        
        renderizarBodegas("bodegas-grid");
        renderizarExperiencias("experiencias-grid");
        
        actualizarBadgeFavoritos();
        actualizarBadgeCarrito();
    }
});
/**
 * Inicializa la lógica interactiva de filtrado del catálogo
 */
function iniciarFiltrosCatalogo() {
    const inputSearch = document.getElementById("search-input");
    const selectType = document.getElementById("type-select");
    const rangePrice = document.getElementById("price-range");
    const labelPrice = document.getElementById("price-value");
    const resultsCounter = document.getElementById("results-counter");
    const btnReset = document.getElementById("btn-reset-filters");

    if (!rangePrice || !appData || !appData.vinos) return;

    function aplicarFiltros() {
        const texto = (inputSearch?.value || "").toLowerCase().trim();
        const tipo = selectType?.value || "todos";
        const maxPrecio = parseFloat(rangePrice.value);

        if (labelPrice) {
            labelPrice.textContent = `${maxPrecio.toFixed(2)} €`;
        }

        const filtrados = appData.vinos.filter(vino => {
            const coincideTexto = vino.nombre.toLowerCase().includes(texto) || 
                                 (vino.i18n && vino.i18n.es && vino.i18n.es.desc.toLowerCase().includes(texto));
            const coincideTipo = (tipo === "todos") || (vino.tipo === tipo);
            const coincidePrecio = vino.precioNum <= maxPrecio;

            return coincideTexto && coincideTipo && coincidePrecio;
        });

        if (resultsCounter) {
            resultsCounter.textContent = `${filtrados.length} vino(s) encontrado(s)`;
        }

        renderizarVinosFiltrados("catalogo-grid", filtrados);
    }

    if (inputSearch) inputSearch.addEventListener("input", aplicarFiltros);
    if (selectType) selectType.addEventListener("change", aplicarFiltros);
    if (rangePrice) rangePrice.addEventListener("input", aplicarFiltros);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (inputSearch) inputSearch.value = "";
            if (selectType) selectType.value = "todos";
            if (rangePrice) rangePrice.value = rangePrice.max;
            aplicarFiltros();
        });
    }

    // Ejecutar filtro inicial
    aplicarFiltros();
}

function renderizarVinosFiltrados(contenedorId, listaVinos) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (listaVinos.length === 0) {
        contenedor.innerHTML = `<p class="body-regular" style="grid-column: 1/-1; text-align: center; padding: 40px 0;">No hay vinos que coincidan con los filtros seleccionados.</p>`;
        return;
    }

    listaVinos.forEach(vino => {
        const isFav = getFavoritos().includes(vino.id);
        const article = document.createElement("article");
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);
        
        article.innerHTML = `
            <div class="card-img-wrap">
                <button type="button" class="btn-fav-card ${isFav ? 'active' : ''}" aria-label="Favoritos">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <img src="${vino.imagen}" alt="${vino.nombre}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">
                    <a href="producto.html?id=${vino.id}" style="color: inherit; text-decoration: none;">${vino.nombre}</a>
                </h3>
                <p class="body-regular" style="margin-bottom: 12px;">${vino.i18n?.es?.desc || ''}</p>
                <p class="wine-price" style="margin-top: auto;">${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full btn-add-cart" style="margin-top: 12px;">Añadir al carrito</button>
            </div>
        `;
        contenedor.appendChild(article);
    });

    asignarEventosTarjetas(contenedor);
}
/**
 * Carga y renderiza los detalles del producto en producto.html
 */
function iniciarDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const vinoId = urlParams.get("id");
    
    if (!vinoId || !appData || !appData.vinos) return;

    const vino = appData.vinos.find(v => v.id === vinoId);
    if (!vino) {
        const titleEl = document.querySelector("h1");
        if (titleEl) titleEl.textContent = "Producto no encontrado";
        return;
    }

    const traduccion = (vino.i18n && vino.i18n[currentLang]) ? vino.i18n[currentLang] : (vino.i18n ? vino.i18n["es"] : {});
    const imgPath = vino.imagen && vino.imagen.startsWith('http') ? vino.imagen : `${basePath}${vino.imagen}`;

    // Rellenar Nombre
    const titleEl = document.querySelector("h1");
    if (titleEl) titleEl.textContent = vino.nombre;

    // Rellenar Precio
    const priceEl = document.querySelector(".product-price, [id*='precio'], h2 + p, .wine-price");
    if (priceEl) priceEl.textContent = vino.precio;

    // Rellenar Descripción / Detalles
    const descEl = document.querySelector(".product-desc, .body-regular");
    if (descEl) descEl.textContent = traduccion.desc || "";

    // Rellenar Imagen principal
    const imgEl = document.querySelector(".product-img-wrap img, .card-img, main img");
    if (imgEl) {
        imgEl.src = imgPath;
        imgEl.alt = vino.nombre;
    }

    // Especificaciones técnicas (si existen en el HTML de producto.html)
    const specGrape = document.getElementById("spec-grape") || document.querySelector(".spec-grape");
    if (specGrape) specGrape.textContent = traduccion.grape || "-";

    const specAging = document.getElementById("spec-aging") || document.querySelector(".spec-aging");
    if (specAging) specAging.textContent = traduccion.aging || "-";

    const specAlcohol = document.getElementById("spec-alcohol") || document.querySelector(".spec-alcohol");
    if (specAlcohol) specAlcohol.textContent = vino.alcohol || "-";

    const specTemp = document.getElementById("spec-temp") || document.querySelector(".spec-temp");
    if (specTemp) specTemp.textContent = vino.temp || "-";

    // Botón de añadir al carrito en la vista de detalle
    const btnAddCart = document.querySelector(".btn-add-cart, button[class*='cart']");
    if (btnAddCart) {
        // Evitar duplicar listeners clonando el botón o asignando directamente
        btnAddCart.replaceWith(btnAddCart.cloneNode(true));
        const newBtn = document.querySelector(".btn-add-cart, button[class*='cart']");
        
        newBtn.addEventListener("click", () => {
            const inputQty = document.querySelector("input[type='number'], .quantity-input");
            const cantidad = inputQty ? parseInt(inputQty.value) || 1 : 1;
            agregarAlCarrito(vino, cantidad);
        });
    }
}