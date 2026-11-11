/**
 * WINESHOP - MOTOR PRINCIPAL JS ACCESIBLE Y DINÁMICO
 * Incluye verificación de edad, newsletter popup, login / mi_cuenta con sesión activa,
 * carrusel hero, carrusel de reseñas dinámico traducido desde db.json, banner de anuncios,
 * carrito de compras, favoritos dinámicos, vista de detalle de producto e i18n persistente.
 */

const LANG_STORAGE_KEY = "wineshop_idioma";
const CART_STORAGE_KEY = "wineshop_carrito_items";
const FAVORITES_STORAGE_KEY = "wineshop_favoritos";
const USER_STORAGE_KEY = "wineshop_usuario_activo";

// Carga el idioma guardado previamente o usa 'es' por defecto
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || "es";
let appData = null;

// Determina si la ejecución se encuentra en la raíz o en el subdirectorio /html/
const isSubdir = window.location.pathname.includes("/html/");
const basePath = isSubdir ? "../" : "./";

/**
 * Obtiene la ruta ajustada para páginas HTML según la ubicación actual
 * @param {string} page - Nombre del archivo html (ej: "producto.html")
 */
function getPagePath(page) {
    return isSubdir ? page : `html/${page}`;
}

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
 * Aplicación Completa de Traducciones DOM según el Idioma Activo
 * Soporta textContent (data-i18n), placeholder (data-i18n-placeholder) y aria-label (data-i18n-aria)
 */
function aplicarTraducciones() {
    if (!appData || !appData.i18n) return;

    const dicc = appData.i18n[currentLang] || appData.i18n["es"];

    // 1. Traducir textos normales
    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (dicc[key]) {
            elem.textContent = dicc[key];
        }
    });

    // 2. Traducir placeholders de inputs y buscadores
    document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
        const key = elem.getAttribute("data-i18n-placeholder");
        if (dicc[key]) {
            elem.setAttribute("placeholder", dicc[key]);
        }
    });

    // 3. Traducir atributos accesibles aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach(elem => {
        const key = elem.getAttribute("data-i18n-aria");
        if (dicc[key]) {
            elem.setAttribute("aria-label", dicc[key]);
        }
    });
}

/**
 * Actualiza los enlaces del icono de usuario en la cabecera según el estado de la sesión
 */
function actualizarEnlaceUsuario() {
    const usuario = obtenerUsuarioActivo();
    const userLinks = document.querySelectorAll('a[href*="login.html"], a[href*="mi_cuenta.html"]');
    
    const targetPage = usuario ? getPagePath("mi_cuenta.html") : getPagePath("login.html");

    userLinks.forEach(link => {
        link.href = targetPage;
        if (usuario) {
            link.setAttribute("aria-label", `Mi Cuenta (${usuario.nombre})`);
        } else {
            link.setAttribute("aria-label", "Mi Cuenta e Iniciar Sesión");
        }
    });

    const path = window.location.pathname;
    if (usuario && path.includes("login.html")) {
        window.location.href = getPagePath("mi_cuenta.html");
    } else if (!usuario && path.includes("mi_cuenta.html")) {
        window.location.href = getPagePath("login.html");
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
            window.location.href = getPagePath("juego_menores.html");
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
 * Gestión de Autenticación
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
                window.location.href = getPagePath("mi_cuenta.html");
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
            window.location.href = getPagePath("mi_cuenta.html");
        }, 1000);
    });
}

/**
 * Inicialización de la vista Mi Cuenta
 */
function iniciarMiCuenta() {
    const usuario = obtenerUsuarioActivo();
    if (!usuario) return;

    const displayNameEl = document.getElementById("user-display-name");
    const displayEmailEl = document.getElementById("user-display-email");
    const avatarBadgeEl = document.querySelector(".user-avatar-badge");

    if (displayNameEl) displayNameEl.textContent = usuario.nombre || "Usuario";
    if (displayEmailEl) displayEmailEl.textContent = usuario.email || "";
    if (avatarBadgeEl && usuario.nombre) {
        const iniciales = usuario.nombre
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
        avatarBadgeEl.textContent = iniciales || "U";
    }

    const inputNombre = document.getElementById("acc-nombre");
    const inputEmail = document.getElementById("acc-email");
    const inputTelefono = document.getElementById("acc-telefono");
    const inputDni = document.getElementById("acc-dni");
    const inputDireccion = document.getElementById("acc-direccion");

    if (inputNombre) inputNombre.value = usuario.nombre || "";
    if (inputEmail) inputEmail.value = usuario.email || "";
    if (inputTelefono) inputTelefono.value = usuario.telefono || "";
    if (inputDni) inputDni.value = usuario.dni || "";
    if (inputDireccion) inputDireccion.value = usuario.direccion || "";

    const btnTabDatos = document.getElementById("btn-tab-datos");
    const btnTabPedidos = document.getElementById("btn-tab-pedidos");
    const secDatos = document.getElementById("sec-datos-personales");
    const secPedidos = document.getElementById("sec-historial-pedidos");

    if (btnTabDatos && btnTabPedidos && secDatos && secPedidos) {
        btnTabDatos.addEventListener("click", () => {
            secDatos.classList.remove("hidden");
            secPedidos.classList.add("hidden");
            btnTabDatos.style.backgroundColor = "var(--color-primario-bordeos)";
            btnTabDatos.style.color = "var(--color-blanco)";
            btnTabPedidos.style.backgroundColor = "";
            btnTabPedidos.style.color = "";
        });

        btnTabPedidos.addEventListener("click", () => {
            secPedidos.classList.remove("hidden");
            secDatos.classList.add("hidden");
            btnTabPedidos.style.backgroundColor = "var(--color-primario-bordeos)";
            btnTabPedidos.style.color = "var(--color-blanco)";
            btnTabDatos.style.backgroundColor = "";
            btnTabDatos.style.color = "";
        });
    }

    const btnToggleEdit = document.getElementById("btn-toggle-edit");
    const fieldsetDetails = document.getElementById("fieldset-user-details");
    const btnSaveDetails = document.getElementById("btn-save-details");
    const formDetails = document.getElementById("form-user-details");

    if (btnToggleEdit && fieldsetDetails && btnSaveDetails) {
        btnToggleEdit.addEventListener("click", () => {
            const isDisabled = fieldsetDetails.hasAttribute("disabled");
            if (isDisabled) {
                fieldsetDetails.removeAttribute("disabled");
                btnSaveDetails.classList.remove("hidden");
                btnToggleEdit.textContent = "❌ Cancelar Edición";
            } else {
                fieldsetDetails.setAttribute("disabled", "true");
                btnSaveDetails.classList.add("hidden");
                btnToggleEdit.textContent = "✏️ Editar Datos";
            }
        });
    }

    if (formDetails) {
        formDetails.addEventListener("submit", (e) => {
            e.preventDefault();
            
            usuario.nombre = inputNombre?.value.trim() || usuario.nombre;
            usuario.email = inputEmail?.value.trim() || usuario.email;
            usuario.telefono = inputTelefono?.value.trim() || "";
            usuario.dni = inputDni?.value.trim() || "";
            usuario.direccion = inputDireccion?.value.trim() || "";

            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuario));

            if (fieldsetDetails) fieldsetDetails.setAttribute("disabled", "true");
            if (btnSaveDetails) btnSaveDetails.classList.add("hidden");
            if (btnToggleEdit) btnToggleEdit.textContent = "✏️ Editar Datos";

            if (displayNameEl) displayNameEl.textContent = usuario.nombre;
            if (displayEmailEl) displayEmailEl.textContent = usuario.email;

            mostrarToast("Datos actualizados correctamente.");
            announceToScreenReader("Datos de usuario actualizados.");
        });
    }

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

/**
 * Renderizado del Historial de Pedidos
 */
function renderizarPedidosUsuario(usuarioId) {
    const contenedor = document.getElementById("orders-list") || document.getElementById("pedidos-lista");
    if (!contenedor || !appData) return;

    const misPedidos = (appData.pedidos || []).filter(p => p.usuarioId === usuarioId || usuarioId.startsWith("usr-local"));
    
    if (misPedidos.length === 0) {
        contenedor.innerHTML = `<p class="body-regular">Aún no has realizado ningún pedido en WineShop.</p>`;
        return;
    }

    contenedor.innerHTML = misPedidos.map(p => `
        <article class="order-card-history">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-borde); padding-bottom: 12px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div>
                    <strong style="color: var(--color-primario-bordeos);">Pedido #${p.id}</strong>
                    <span class="body-regular" style="font-size: 0.85rem; display: block;">${p.fecha}</span>
                </div>
                <span style="background-color: #E8F5E9; color: #2E7D32; font-weight: 700; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem;">${p.estado}</span>
            </div>
            <p class="body-regular" style="margin-bottom: 8px;">Método de pago: ${p.metodoPago}</p>
            <strong style="font-size: 1.1rem; color: var(--color-neutro-oscuro);">Total: ${p.total}</strong>
        </article>
    `).join("");
}

/**
 * Carrusel Hero Interactivo
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
 * Renderizado de Reseñas desde db.json con Soporte Multilenguaje Completo
 */
function renderizarResenas() {
    const slider = document.querySelector(".testimonials-slider");
    const indicatorsWrap = document.querySelector(".testimonials-indicators");
    
    if (!slider || !appData || !appData.resenas) return;

    slider.innerHTML = appData.resenas.map((resena, index) => {
        // Extraer los datos i18n del idioma actual o usar fallback
        const i18nResena = (resena.i18n && resena.i18n[currentLang]) 
            ? resena.i18n[currentLang] 
            : (resena.i18n ? resena.i18n["es"] : {});

        const comentario = i18nResena.comentario || resena.comentario || "";
        const rol = i18nResena.rol || resena.rol || "";
        const estrellasStr = "★".repeat(resena.estrellas || 5);

        return `
            <article class="testimonial-card ${index === 0 ? 'active' : ''}">
                <div class="testimonial-stars" aria-label="Valoración: ${resena.estrellas || 5} de 5 estrellas">
                    ${estrellasStr}
                </div>
                <blockquote class="testimonial-quote">
                    "${comentario}"
                </blockquote>
                <div class="testimonial-author">
                    <img src="${resena.avatar}" alt="Foto de ${resena.nombre}" class="author-avatar" loading="lazy" />
                    <div>
                        <strong class="author-name">${resena.nombre}</strong>
                        <span class="author-role">${rol}</span>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    if (indicatorsWrap) {
        indicatorsWrap.innerHTML = appData.resenas.map((_, index) => `
            <button
                type="button"
                class="dot ${index === 0 ? 'active' : ''}"
                role="tab"
                aria-selected="${index === 0 ? 'true' : 'false'}"
                aria-label="Ver reseña ${index + 1}"
            ></button>
        `).join("");
    }
}

// Timer global para el carrusel de reseñas para evitar intervalos duplicados
let resenasTimer = null;

/**
 * Carrusel de Reseñas
 */
function iniciarCarruselResenas() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials-indicators .dot');
    const btnPrev = document.querySelector('.prev-testimonial');
    const btnNext = document.querySelector('.next-testimonial');
    
    if (!slides.length) return;

    let currentIndex = 0;

    function goToSlide(index) {
        slides[currentIndex]?.classList.remove('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove('active');
            dots[currentIndex].setAttribute('aria-selected', 'false');
        }

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex]?.classList.add('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
            dots[currentIndex].setAttribute('aria-selected', 'true');
        }
    }

    function startAutoplay() {
        stopAutoplay();
        resenasTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5500);
    }

    function stopAutoplay() {
        if (resenasTimer) clearInterval(resenasTimer);
    }

    if (btnNext) {
        btnNext.onclick = () => {
            goToSlide(currentIndex + 1);
            startAutoplay();
        };
    }

    if (btnPrev) {
        btnPrev.onclick = () => {
            goToSlide(currentIndex - 1);
            startAutoplay();
        };
    }

    dots.forEach((dot, idx) => {
        dot.onclick = () => {
            goToSlide(idx);
            startAutoplay();
        };
    });

    startAutoplay();
}

/**
 * Carrusel de Anuncios Superior
 */
function iniciarBannerAnuncios() {
    const items = document.querySelectorAll('.announcement-item');
    if (!items.length) return;

    let currentIndex = 0;

    setInterval(() => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add('active');
    }, 4500);
}

/**
 * Renderizado Dinámico de Vinos
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
                        aria-label="${isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}" 
                        aria-pressed="${isFav}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <img src="${imgPath}" alt="${vino.nombre}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h2 class="wine-name">
                    <a href="${getPagePath('producto.html')}?id=${vino.id}" style="color: inherit; text-decoration: none;">${vino.nombre}</a>
                </h2>
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
                    <a href="${getPagePath('catalogo.html')}" class="btn btn-secondary" style="flex: 1;">${dicc.btn_ver_vinos || 'Ver sus vinos'}</a>
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

        const enlaceUrl = exp.urlBodega || getPagePath("bodegas.html");
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
            const traduccion = (vino.i18n && vino.i18n[currentLang]) ? vino.i18n[currentLang] : (vino.i18n ? vino.i18n["es"] : {});
            const coincideTexto = vino.nombre.toLowerCase().includes(texto) || 
                                 (traduccion.desc && traduccion.desc.toLowerCase().includes(texto));
            const coincideTipo = (tipo === "todos") || (vino.tipo === tipo);
            const coincidePrecio = vino.precioNum <= maxPrecio;

            return coincideTexto && coincideTipo && coincidePrecio;
        });

        const dicc = appData.i18n[currentLang] || appData.i18n["es"];
        if (resultsCounter) {
            resultsCounter.textContent = `${filtrados.length} ${dicc.results_text || 'vino(s) encontrado(s)'}`;
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

    aplicarFiltros();
}

function renderizarVinosFiltrados(contenedorId, listaVinos) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    contenedor.innerHTML = "";
    const dicc = appData.i18n[currentLang] || appData.i18n["es"];

    if (listaVinos.length === 0) {
        contenedor.innerHTML = `<p class="body-regular" style="grid-column: 1/-1; text-align: center; padding: 40px 0;">${dicc.no_wines_found || 'No hay vinos que coincidan con los filtros seleccionados.'}</p>`;
        return;
    }

    listaVinos.forEach(vino => {
        const traduccion = (vino.i18n && vino.i18n[currentLang]) ? vino.i18n[currentLang] : (vino.i18n ? vino.i18n["es"] : {});
        const isFav = getFavoritos().includes(vino.id);
        const imgPath = vino.imagen && vino.imagen.startsWith('http') ? vino.imagen : `${basePath}${vino.imagen}`;

        const article = document.createElement("article");
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);
        
        article.innerHTML = `
            <div class="card-img-wrap">
                <button type="button" class="btn-fav-card ${isFav ? 'active' : ''}" aria-label="Favoritos" aria-pressed="${isFav}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <img src="${imgPath}" alt="${vino.nombre}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">
                    <a href="producto.html?id=${vino.id}" style="color: inherit; text-decoration: none;">${vino.nombre}</a>
                </h3>
                <p class="body-regular" style="margin-bottom: 12px;">${traduccion.desc || ''}</p>
                <p class="wine-price" style="margin-top: auto;">${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full btn-add-cart" style="margin-top: 12px;">${dicc.btn_carrito || 'Añadir al carrito'}</button>
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
        const titleEl = document.getElementById("detail-title");
        if (titleEl) titleEl.textContent = "Producto no encontrado";
        return;
    }

    const traduccion = (vino.i18n && vino.i18n[currentLang]) ? vino.i18n[currentLang] : (vino.i18n ? vino.i18n["es"] : {});
    const imgPath = vino.imagen && vino.imagen.startsWith('http') ? vino.imagen : `${basePath}${vino.imagen}`;

    const titleEl = document.getElementById("detail-title");
    if (titleEl) titleEl.textContent = vino.nombre;

    const priceEl = document.getElementById("detail-price");
    if (priceEl) priceEl.textContent = vino.precio;

    const descEl = document.getElementById("detail-desc");
    if (descEl) descEl.textContent = traduccion.desc || "";

    const vintageEl = document.getElementById("detail-vintage");
    if (vintageEl) vintageEl.textContent = traduccion.vintage || "D.O.Ca. Rioja";

    const grapeEl = document.getElementById("detail-grape");
    if (grapeEl) grapeEl.textContent = traduccion.grape || "-";

    const agingEl = document.getElementById("detail-aging");
    if (agingEl) agingEl.textContent = traduccion.aging || "-";

    const alcoholEl = document.getElementById("detail-alcohol");
    if (alcoholEl) alcoholEl.textContent = vino.alcohol || "-";

    const tempEl = document.getElementById("detail-temp");
    if (tempEl) tempEl.textContent = vino.temp || "-";

    const imgEl = document.getElementById("detail-img");
    const modelEl = document.getElementById("detail-model");
    if (imgEl && vino.imagen) {
        imgEl.src = imgPath;
        imgEl.style.display = "block";
        if (modelEl) modelEl.style.display = "none";
    }

    const btnMinus = document.getElementById("qty-minus");
    const btnPlus = document.getElementById("qty-plus");
    const inputQty = document.getElementById("product-quantity");

    if (btnMinus && btnPlus && inputQty) {
        btnMinus.onclick = () => {
            let val = parseInt(inputQty.value) || 1;
            if (val > 1) inputQty.value = val - 1;
        };
        btnPlus.onclick = () => {
            let val = parseInt(inputQty.value) || 1;
            if (val < 99) inputQty.value = val + 1;
        };
    }

    const btnAddCart = document.getElementById("btn-add-detail");
    if (btnAddCart) {
        btnAddCart.replaceWith(btnAddCart.cloneNode(true));
        const newBtn = document.getElementById("btn-add-detail");
        
        newBtn.addEventListener("click", () => {
            const cantidad = inputQty ? parseInt(inputQty.value) || 1 : 1;
            agregarAlCarrito(vino, cantidad);
        });
    }
}

/**
 * Renderizado de la lista de Vinos Favoritos
 */
function renderizarPaginaFavoritos() {
    const contenedorGrid = document.getElementById("favoritos-grid");
    const contenedorVacio = document.getElementById("favoritos-vacio");
    
    if (!contenedorGrid || !appData || !appData.vinos) return;

    const idsFavoritos = getFavoritos();
    const vinosFavoritos = appData.vinos.filter(vino => idsFavoritos.includes(vino.id));
    const dicc = appData.i18n[currentLang] || appData.i18n["es"];

    if (vinosFavoritos.length === 0) {
        contenedorGrid.innerHTML = "";
        if (contenedorVacio) contenedorVacio.style.display = "block";
        return;
    }

    if (contenedorVacio) contenedorVacio.style.display = "none";
    contenedorGrid.innerHTML = "";

    vinosFavoritos.forEach(vino => {
        const traduccion = (vino.i18n && vino.i18n[currentLang]) ? vino.i18n[currentLang] : (vino.i18n ? vino.i18n["es"] : {});
        const imgPath = vino.imagen && vino.imagen.startsWith('http') ? vino.imagen : `${basePath}${vino.imagen}`;

        const article = document.createElement("article");
        article.className = "wine-card";
        article.setAttribute("data-id", vino.id);

        article.innerHTML = `
            <div class="card-img-wrap">
                <button type="button" class="btn-fav-card active" aria-label="Quitar de favoritos" aria-pressed="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <img src="${imgPath}" alt="${vino.nombre}" class="card-img" loading="lazy">
            </div>
            <div class="wine-info">
                <h3 class="wine-name">
                    <a href="producto.html?id=${vino.id}" style="color: inherit; text-decoration: none;">${vino.nombre}</a>
                </h3>
                <p class="body-regular" style="margin-bottom: 12px;">${traduccion.desc || ''}</p>
                <p class="wine-price" style="margin-top: auto;">${vino.precio}</p>
                <button type="button" class="btn btn-primary btn-full btn-add-cart" style="margin-top: 12px;">${dicc.btn_carrito || 'Añadir al carrito'}</button>
            </div>
        `;

        const btnFav = article.querySelector(".btn-fav-card");
        if (btnFav) {
            btnFav.addEventListener("click", () => {
                let favs = getFavoritos().filter(id => id !== vino.id);
                setFavoritos(favs);
                mostrarToast(`${vino.nombre} eliminado de favoritos`);
                renderizarPaginaFavoritos();
            });
        }

        const btnCart = article.querySelector(".btn-add-cart");
        if (btnCart) {
            btnCart.addEventListener("click", () => {
                agregarAlCarrito(vino);
            });
        }

        contenedorGrid.appendChild(article);
    });
}

/**
 * Renderizado y Control de Cantidades en el Carrito
 */
function renderizarCarritoCompleto() {
    const contenedorItems = document.getElementById("carrito-items-lista") || document.getElementById("cart-items-container");
    const totalElemento = document.getElementById("carrito-total-precio") || document.getElementById("cart-total-price");
    
    if (!contenedorItems) return;

    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    if (carrito.length === 0) {
        contenedorItems.innerHTML = `<p class="body-regular" style="padding: 20px 0;">Tu carrito está vacío.</p>`;
        if (totalElemento) totalElemento.textContent = "0,00 €";
        return;
    }

    let html = "";
    let totalAcumulado = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precioNum * item.cantidad;
        totalAcumulado += subtotal;

        html += `
            <div class="cart-item-row" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--color-borde);">
                <div style="flex: 1;">
                    <strong style="color: var(--color-primario-bordeos); font-size: 1.05rem; display: block;">${item.nombre}</strong>
                    <span style="color: var(--color-neutro-gris); font-size: 0.9rem;">${item.precioNum.toFixed(2)} € / ud.</span>
                </div>

                <div class="quantity-selector" style="height: 38px;">
                    <button type="button" class="qty-btn btn-cart-minus" data-index="${index}" aria-label="Reducir cantidad">-</button>
                    <input type="number" class="quantity-input" value="${item.cantidad}" readonly style="width: 36px; font-size: 0.95rem;">
                    <button type="button" class="qty-btn btn-cart-plus" data-index="${index}" aria-label="Aumentar cantidad">+</button>
                </div>

                <div style="text-align: right; min-width: 80px;">
                    <strong style="font-size: 1.05rem;">${subtotal.toFixed(2)} €</strong>
                </div>

                <button type="button" class="btn-cart-remove" data-index="${index}" style="background: none; border: none; color: #D32F2F; cursor: pointer; font-size: 1.2rem; padding: 4px;" aria-label="Eliminar producto">&times;</button>
            </div>
        `;
    });

    contenedorItems.innerHTML = html;
    if (totalElemento) totalElemento.textContent = `${totalAcumulado.toFixed(2)} €`;

    contenedorItems.querySelectorAll(".btn-cart-minus").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"));
            modificarCantidadCarrito(idx, -1);
        });
    });

    contenedorItems.querySelectorAll(".btn-cart-plus").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"));
            modificarCantidadCarrito(idx, 1);
        });
    });

    contenedorItems.querySelectorAll(".btn-cart-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-index"));
            eliminarItemCarrito(idx);
        });
    });
}

function modificarCantidadCarrito(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    if (!carrito[index]) return;

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarrito();
    renderizarCarritoCompleto();
}

function eliminarItemCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    carrito.splice(index, 1);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
    actualizarBadgeCarrito();
    renderizarCarritoCompleto();
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
 * Re-renderizado Unificado al cambiar de Idioma
 */
function actualizarYRenderizarTodo() {
    aplicarTraducciones();

    if (document.getElementById("destacados-grid")) {
        renderizarVinos("destacados-grid", true);
    }
    if (document.getElementById("catalogo-grid")) {
        if (document.getElementById("search-input") || document.getElementById("type-select")) {
            iniciarFiltrosCatalogo();
        } else {
            renderizarVinos("catalogo-grid", false);
        }
    }
    if (document.getElementById("bodegas-grid")) {
        renderizarBodegas("bodegas-grid");
    }
    if (document.getElementById("experiencias-grid")) {
        renderizarExperiencias("experiencias-grid");
    }
    if (document.getElementById("favoritos-grid")) {
        renderizarPaginaFavoritos();
    }
    if (document.querySelector(".testimonials-slider")) {
        renderizarResenas();
        iniciarCarruselResenas();
    }
    if (window.location.pathname.includes("producto.html")) {
        iniciarDetalleProducto();
    }
    if (window.location.pathname.includes("checkout.html") || document.getElementById("carrito-items-lista")) {
        renderizarCarritoCompleto();
    }
}

/**
 * Control del Selector de Idioma con Persistencia
 */
function iniciarIdioma() {
    const select = document.getElementById("custom-lang-select");
    if (select) {
        select.value = currentLang;
        select.addEventListener("change", (e) => {
            currentLang = e.target.value;
            localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            document.documentElement.lang = currentLang;
            
            actualizarYRenderizarTodo();
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
    document.documentElement.lang = currentLang;

    iniciarMenuMobile();
    await loadDatabase();
    
    if (appData) {
        iniciarIdioma();
        actualizarEnlaceUsuario();
        iniciarVerificacionEdad();
        iniciarNewsletterPopup();
        iniciarAutenticacion();
        iniciarMiCuenta();
        
        iniciarCarruselHero();
        renderizarResenas();
        iniciarCarruselResenas();
        iniciarBannerAnuncios();
        
        actualizarYRenderizarTodo();

        actualizarBadgeFavoritos();
        actualizarBadgeCarrito();
    }
});