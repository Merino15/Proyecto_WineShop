let itemPendienteEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuarioActivo();
  if (usuario) {
    if (document.getElementById("co-nombre")) document.getElementById("co-nombre").value = usuario.nombre || "";
    if (document.getElementById("co-dni")) document.getElementById("co-dni").value = usuario.dni || "";
    if (document.getElementById("co-direccion")) document.getElementById("co-direccion").value = usuario.direccion || "";
    if (document.getElementById("co-cp")) document.getElementById("co-cp").value = usuario.codigoPostal || "";
    if (document.getElementById("co-ciudad")) document.getElementById("co-ciudad").value = usuario.ciudad || "";
    if (document.getElementById("co-provincia")) document.getElementById("co-provincia").value = usuario.provincia || "";
  }

  renderizarResumenCheckout();

  const btnCancel = document.getElementById("btn-modal-cancel");
  const btnConfirm = document.getElementById("btn-modal-confirm");

  if (btnCancel) btnCancel.addEventListener("click", cerrarModalConfirmacion);

  if (btnConfirm) {
    btnConfirm.addEventListener("click", () => {
      if (itemPendienteEliminar !== null) {
        let carrito = JSON.parse(localStorage.getItem("wineshop_carrito_items")) || [];
        const idx = itemPendienteEliminar.index;
        const nombre = itemPendienteEliminar.nombre;

        carrito.splice(idx, 1);
        localStorage.setItem("wineshop_carrito_items", JSON.stringify(carrito));

        if (typeof actualizarBadgeCarrito === "function") actualizarBadgeCarrito();
        renderizarResumenCheckout();
        if (typeof mostrarToast === "function") mostrarToast(`Se ha eliminado "${nombre}" del carrito`);
      }
      cerrarModalConfirmacion();
    });
  }

  const formCheckout = document.getElementById("form-checkout");
  if (formCheckout) {
    formCheckout.addEventListener("submit", (e) => {
      e.preventDefault();
      const carrito = JSON.parse(localStorage.getItem("wineshop_carrito_items")) || [];
      if (carrito.length === 0) {
        mostrarToast("El carrito está vacío");
        return;
      }
      localStorage.removeItem("wineshop_carrito_items");
      if (typeof actualizarBadgeCarrito === "function") actualizarBadgeCarrito();
      mostrarToast("¡Pedido realizado con éxito! Gracias por tu compra.");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    });
  }
});

function renderizarResumenCheckout() {
  const container = document.getElementById("checkout-items-list");
  if (!container) return;

  const carrito = JSON.parse(localStorage.getItem("wineshop_carrito_items")) || [];
  let subtotal = 0;

  if (carrito.length === 0) {
    container.innerHTML = '<p class="body-regular" style="padding: 12px 0;">No hay productos en el carrito.</p>';
  } else {
    container.innerHTML = carrito.map((item, index) => {
        const totalItem = item.precioNum * item.cantidad;
        subtotal += totalItem;

        return `
          <div class="summary-row" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 0;">
              <div style="flex: 1; min-width: 120px;">
                  <strong style="display: block; font-size: 0.95rem; color: var(--color-primario-bordeos);">${item.nombre}</strong>
                  <span style="font-size: 0.85rem; color: var(--color-neutro-gris);">${item.precioNum.toFixed(2)} € / ud.</span>
              </div>

              <div class="quantity-selector">
                  <button type="button" class="qty-btn btn-checkout-minus" data-index="${index}" aria-label="Reducir cantidad">-</button>
                  <input type="number" class="quantity-input" value="${item.cantidad}" readonly aria-label="Cantidad de ${item.nombre}">
                  <button type="button" class="qty-btn btn-checkout-plus" data-index="${index}" aria-label="Aumentar cantidad">+</button>
              </div>

              <span style="font-weight: 700; min-width: 65px; text-align: right;">${totalItem.toFixed(2)} €</span>

              <button type="button" class="btn-checkout-remove" data-index="${index}" aria-label="Eliminar producto ${item.nombre}" style="background: none; border: none; color: #D32F2F; cursor: pointer; font-size: 1.1rem; padding: 2px 4px;">&times;</button>
          </div>
        `;
      }).join("");
  }

  const gastosEnvio = subtotal > 50 || subtotal === 0 ? 0 : 4.95;
  if (document.getElementById("co-subtotal")) document.getElementById("co-subtotal").textContent = `${subtotal.toFixed(2)} €`;
  if (document.getElementById("co-envio")) document.getElementById("co-envio").textContent = gastosEnvio === 0 ? "Gratis" : `${gastosEnvio.toFixed(2)} €`;
  if (document.getElementById("co-total")) document.getElementById("co-total").textContent = `${(subtotal + gastosEnvio).toFixed(2)} €`;

  container.querySelectorAll(".btn-checkout-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      modificarItemCheckout(idx, -1);
    });
  });

  container.querySelectorAll(".btn-checkout-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      modificarItemCheckout(idx, 1);
    });
  });

  container.querySelectorAll(".btn-checkout-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      modificarItemCheckout(idx, -999);
    });
  });
}

function modificarItemCheckout(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("wineshop_carrito_items")) || [];
  if (!carrito[index]) return;

  const producto = carrito[index];

  if (cambio === -999 || (producto.cantidad === 1 && cambio === -1)) {
    itemPendienteEliminar = { index, nombre: producto.nombre };
    mostrarModalConfirmacion(`¿Estás seguro de que deseas eliminar "${producto.nombre}" de tu pedido?`);
  } else {
    producto.cantidad += cambio;
    localStorage.setItem("wineshop_carrito_items", JSON.stringify(carrito));
    if (typeof actualizarBadgeCarrito === "function") actualizarBadgeCarrito();
    renderizarResumenCheckout();
  }
}

function mostrarModalConfirmacion(mensaje) {
  const modal = document.getElementById("confirm-modal-overlay");
  const texto = document.getElementById("confirm-modal-text");
  if (!modal) return;

  if (texto) texto.textContent = mensaje;
  modal.classList.remove("hidden");
}

function cerrarModalConfirmacion() {
  const modal = document.getElementById("confirm-modal-overlay");
  if (modal) modal.classList.add("hidden");
  itemPendienteEliminar = null;
}