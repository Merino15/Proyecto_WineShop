/**
 * WINESHOP - MÓDULO DE CATÁLOGO Y FILTRADO DINÁMICO
 * Se ejecuta exclusivamente en catalogo.html para renderizar vinos y filtrar en tiempo real.
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("search-input");
    const typeSelect = document.getElementById("type-select");
    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-value");
    const resultsCount = document.getElementById("results-counter");
    const btnReset = document.getElementById("btn-reset-filters");
    const filterForm = document.getElementById("filter-form");

    /**
     * Filtra los productos renderizados en #catalogo-grid según los controles
     */
    const aplicarFiltros = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const tipo = typeSelect ? typeSelect.value : "todos";
        const maxPrice = priceRange ? parseFloat(priceRange.value) : 250;
        
        if (priceVal) priceVal.textContent = `${maxPrice.toFixed(2)} €`;

        let visibles = 0;
        const cards = document.querySelectorAll("#catalogo-grid .wine-card");

        cards.forEach(card => {
            const nombreEl = card.querySelector(".wine-name");
            const descEl = card.querySelector(".body-regular");
            const nombre = nombreEl ? nombreEl.textContent.toLowerCase() : "";
            const desc = descEl ? descEl.textContent.toLowerCase() : "";
            const cardTipo = card.getAttribute("data-type") || "tinto";
            const precio = parseFloat(card.getAttribute("data-price")) || 0;

            const coincideTexto = query === "" || nombre.includes(query) || desc.includes(query);
            const coincideTipo = tipo === "todos" || cardTipo === tipo;
            const coincidePrecio = precio <= maxPrice;

            if (coincideTexto && coincideTipo && coincidePrecio) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        if (resultsCount) {
            const dicc = (window.appData && window.appData.i18n) ? (window.appData.i18n[window.currentLang] || window.appData.i18n["es"]) : {};
            resultsCount.textContent = `${visibles} ${dicc.results_text || 'vino(s) encontrado(s)'}`;
        }
    };

    /**
     * Espera la carga de la base de datos appData de main.js y renderiza el catálogo
     */
    const inicializarCatalogo = () => {
        if (typeof renderizarVinos === "function") {
            renderizarVinos("catalogo-grid", false);
            aplicarFiltros();
        }
    };

    // Vincular eventos de entrada de datos
    if (searchInput) searchInput.addEventListener("input", aplicarFiltros);
    if (typeSelect) typeSelect.addEventListener("change", aplicarFiltros);
    if (priceRange) priceRange.addEventListener("input", aplicarFiltros);

    if (filterForm) {
        filterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            aplicarFiltros();
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (typeSelect) typeSelect.value = "todos";
            if (priceRange) priceRange.value = priceRange.max || 250;
            aplicarFiltros();
        });
    }

    // Escuchar el evento de cambio de idioma global de main.js
    window.addEventListener("wineshop:langchange", () => {
        inicializarCatalogo();
    });

    // Comprobar la disponibilidad de los datos globales de main.js
    const interval = setInterval(() => {
        if (window.appData) {
            clearInterval(interval);
            inicializarCatalogo();
        }
    }, 50);
});