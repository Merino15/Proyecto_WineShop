let itemPendienteEliminar = null;
let ultimoBotonEnfocado = null; // Variable para recordar qué botón abrió el modal

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

  if (btnCancel) {
    btnCancel.addEventListener("click", () => cerrarModalConfirmacion(false));
  }

  if (btnConfirm) {
    btnConfirm.addEventListener("click", () => {
      let idxEliminado = null;

      if (itemPendienteEliminar !== null) {
        let carrito = JSON.parse(localStorage.getItem("wineshop_carrito_items")) || [];
        idxEliminado = itemPendienteEliminar.index;
        const nombre = itemPendienteEliminar.nombre;

        carrito.splice(idxEliminado, 1);
        localStorage.setItem("wineshop_carrito_items", JSON.stringify(carrito));

        if (typeof actualizarBadgeCarrito === "function") actualizarBadgeCarrito();
        renderizarResumenCheckout();
        if (typeof mostrarToast === "function") mostrarToast(`Se ha eliminado "${nombre}" del carrito`);
      }
      
      // Cerrar modal indicando que SÍ se eliminó para recolocar el foco
      cerrarModalConfirmacion(true, idxEliminado);
    });
  }

  const formCheckout = document.getElementById("form-checkout");
  if (formCheckout) {
    formCheckout.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validación de los datos de envío
      const nombre = document.getElementById("co-nombre")?.value.trim();
      const dni = document.getElementById("co-dni")?.value.trim();
      const direccion = document.getElementById("co-direccion")?.value.trim();
      const cp = document.getElementById("co-cp")?.value.trim();
      const ciudad = document.getElementById("co-ciudad")?.value.trim();
      const provincia = document.getElementById("co-provincia")?.value.trim();

      if (!nombre || !dni || !direccion || !cp || !ciudad || !provincia) {
        if (typeof mostrarToast === "function") {
          mostrarToast("Por favor, completa todos los datos de envío obligatorios.");
        } else {
          alert("Por favor, completa todos los datos de envío obligatorios.");
        }
        return;
      }

      // Validación del carrito vacío
      const carrito = JSON.parse(localStorage.getItem("wineshop_carrito_items")) || [];
      if (carrito.length === 0) {
        if (typeof mostrarToast === "function") {
          mostrarToast("El carrito está vacío");
        } else {
          alert("El carrito está vacío");
        }
        return;
      }

      // Procesamiento del pedido
      localStorage.removeItem("wineshop_carrito_items");
      if (typeof actualizarBadgeCarrito === "function") actualizarBadgeCarrito();
      if (typeof mostrarToast === "function") {
        mostrarToast("¡Pedido realizado con éxito! Gracias por tu compra.");
      }
      
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

/**
 * Muestra el modal asignando foco inicial y activando trampa de foco (WCAG AAA)
 */
function mostrarModalConfirmacion(mensaje) {
  const modal = document.getElementById("confirm-modal-overlay");
  const texto = document.getElementById("confirm-modal-text");
  const btnCancel = document.getElementById("btn-modal-cancel");
  
  if (!modal) return;

  // 1. Guardar el elemento enfocado antes de abrir el modal
  ultimoBotonEnfocado = document.activeElement;

  if (texto) texto.textContent = mensaje;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // 2. Mover el foco inicial al botón Cancelar
  if (btnCancel) {
    setTimeout(() => btnCancel.focus(), 50);
  }

  // 3. Trampa de foco (Focus Trap)
  modal.onkeydown = function (e) {
    if (e.key === "Escape") {
      cerrarModalConfirmacion(false);
      return;
    }

    if (e.key === "Tab") {
      const focusables = modal.querySelectorAll("button");
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };
}

/**
 * Cierra el modal y gestiona la recolocación del foco
 */
function cerrarModalConfirmacion(seElimino = false, idxEliminado = null) {
  const modal = document.getElementById("confirm-modal-overlay");
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  modal.onkeydown = null;
  itemPendienteEliminar = null;

  const container = document.getElementById("checkout-items-list");

  if (seElimino) {
    // Si se eliminó el producto, el botón original desapareció. Recolocamos el foco:
    const botonesRestantes = container ? container.querySelectorAll(".btn-checkout-remove") : [];

    if (botonesRestantes.length > 0) {
      // Enfocar el botón de borrar de la misma posición (o la última disponible)
      const nuevoIdx = Math.min(idxEliminado !== null ? idxEliminado : 0, botonesRestantes.length - 1);
      botonesRestantes[nuevoIdx].focus();
    } else {
      // Si el carrito quedó vacío, enfocar el mensaje descriptivo
      const mensajeVacio = container ? container.querySelector("p") : null;
      if (mensajeVacio) {
        mensajeVacio.setAttribute("tabindex", "-1");
        mensajeVacio.focus();
      }
    }
  } else {
    // Si se canceló, devolver el foco al botón exacto que abrió el modal
    if (ultimoBotonEnfocado && typeof ultimoBotonEnfocado.focus === "function") {
      ultimoBotonEnfocado.focus();
    }
  }
}