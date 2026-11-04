document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("search-input");
    const typeSelect = document.getElementById("type-select");
    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-value");
    const resultsCount = document.getElementById("results-counter");
    const btnReset = document.getElementById("btn-reset-filters");

    const aplicarFiltros = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const tipo = typeSelect ? typeSelect.value : "todos";
        const maxPrice = priceRange ? parseFloat(priceRange.value) : 250;
        if (priceVal) priceVal.textContent = `${maxPrice.toFixed(2)} €`;

        let visibles = 0;
        document.querySelectorAll("#catalogo-grid .wine-card").forEach(card => {
            const nombreEl = card.querySelector(".wine-name");
            const nombre = nombreEl ? nombreEl.textContent.toLowerCase() : "";
            const cardTipo = card.getAttribute("data-type");
            const precio = parseFloat(card.getAttribute("data-price")) || 0;

            const coincideTexto = query === "" || nombre.includes(query);
            const coincideTipo = tipo === "todos" || cardTipo === tipo;
            const coincidePrecio = precio <= maxPrice;

            if (coincideTexto && coincideTipo && coincidePrecio) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        if (resultsCount) resultsCount.textContent = `${visibles} vino(s) encontrado(s)`;
    };

    if (searchInput) searchInput.addEventListener("input", aplicarFiltros);
    if (typeSelect) typeSelect.addEventListener("change", aplicarFiltros);
    if (priceRange) priceRange.addEventListener("input", aplicarFiltros);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (typeSelect) typeSelect.value = "todos";
            if (priceRange) priceRange.value = 210;
            aplicarFiltros();
        });
    }

    setTimeout(() => { 
        if (typeof renderizarVinos === "function") {
            renderizarVinos("catalogo-grid", false);
        }
        aplicarFiltros(); 
    }, 250);
});