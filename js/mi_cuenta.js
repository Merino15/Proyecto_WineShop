        document.addEventListener('DOMContentLoaded', async () => {
            const usuario = obtenerUsuarioActivo();

            if (!usuario) {
                window.location.href = 'login.html';
                return;
            }

            // Rellenar cabecera lateral
            document.getElementById('account-user-name').textContent = usuario.nombre;
            document.getElementById('account-user-email').textContent = usuario.email;
            document.getElementById('account-avatar').textContent = usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U';

            // Cargar datos en el formulario de edición
            document.getElementById('edit-nombre').value = usuario.nombre || '';
            document.getElementById('edit-email').value = usuario.email || '';
            document.getElementById('edit-telefono').value = usuario.telefono || '';
            document.getElementById('edit-nacimiento').value = usuario.fechaNacimiento || '';
            document.getElementById('edit-dni').value = usuario.dni || '';
            document.getElementById('edit-direccion').value = usuario.direccion || '';
            document.getElementById('edit-ciudad').value = usuario.ciudad || '';
            document.getElementById('edit-cp').value = usuario.codigoPostal || '';
            document.getElementById('edit-provincia').value = usuario.provincia || '';

            // Pestañas
            const menuBtns = document.querySelectorAll('.account-menu-btn[data-tab]');
            const panels = document.querySelectorAll('.account-panel');

            menuBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetTab = btn.getAttribute('data-tab');

                    menuBtns.forEach(b => b.classList.remove('active'));
                    panels.forEach(p => p.classList.add('oculto'));

                    btn.classList.add('active');
                    document.getElementById(targetTab)?.classList.remove('oculto');
                });
            });

            // Guardar Cambios del Formulario
            document.getElementById('form-datos-personales').addEventListener('submit', (e) => {
                e.preventDefault();

                const nuevosDatos = {
                    nombre: document.getElementById('edit-nombre').value.trim(),
                    telefono: document.getElementById('edit-telefono').value.trim(),
                    fechaNacimiento: document.getElementById('edit-nacimiento').value,
                    dni: document.getElementById('edit-dni').value.trim(),
                    direccion: document.getElementById('edit-direccion').value.trim(),
                    ciudad: document.getElementById('edit-ciudad').value.trim(),
                    codigoPostal: document.getElementById('edit-cp').value.trim(),
                    provincia: document.getElementById('edit-provincia').value.trim()
                };

                const res = actualizarPerfilUsuario(nuevosDatos);
                if (res.success) {
                    document.getElementById('account-user-name').textContent = res.user.nombre;
                    document.getElementById('account-avatar').textContent = res.user.nombre.charAt(0).toUpperCase();
                    mostrarToast('Tus datos han sido actualizados correctamente');
                } else {
                    mostrarToast('Ocurrió un error al guardar los cambios');
                }
            });

            // Botón Cerrar Sesión
            document.getElementById('btn-logout-account').addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas cerrar sesión? Tu carrito actual se vaciará.')) {
                    cerrarSesion();
                }
            });

            if (!appData) await loadDatabase();

            renderizarPedidos(usuario.id);
            renderizarReservas(usuario.id);
            renderizarDirecciones(usuario.id);
        });

        function renderizarPedidos(usuarioId) {
            const container = document.getElementById('pedidos-container');
            if (!container || !appData) return;

            const pedidos = appData.pedidos ? appData.pedidos.filter(p => p.usuarioId === usuarioId || usuarioId.startsWith('usr-google') || usuarioId === 'usr-1') : [];

            if (pedidos.length === 0) {
                container.innerHTML = `<p class="body-regular">Aún no has realizado ningún pedido.</p>`;
                return;
            }

            let html = '';
            pedidos.forEach(ped => {
                const statusClass = ped.estado === 'Entregado' ? 'status-entregado' : 'status-camino';
                let itemsHtml = '';
                ped.items.forEach(it => {
                    itemsHtml += `
                        <div class="order-item-row">
                            <span><strong>${it.cantidad}x</strong> ${it.nombre}</span>
                            <span>${it.precio}</span>
                        </div>
                    `;
                });

                html += `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <strong>Pedido ${ped.id}</strong> — <span class="body-regular">${ped.fecha}</span>
                            </div>
                            <span class="order-status ${statusClass}">${ped.estado}</span>
                        </div>
                        <div style="margin-bottom: var(--espaciado-12);">
                            ${itemsHtml}
                        </div>
                        <div style="border-top: 1px solid var(--color-neutro-calido-300); padding-top: var(--espaciado-8); display: flex; justify-content: space-between; align-items: center;">
                            <span class="body-regular" style="font-size: 0.9rem;">Pago: ${ped.metodoPago}</span>
                            <strong style="font-size: 1.1rem; color: var(--color-primario-bordeos);">Total: ${ped.total}</strong>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function renderizarReservas(usuarioId) {
            const container = document.getElementById('reservas-container');
            if (!container || !appData) return;

            const reservas = appData.reservas ? appData.reservas.filter(r => r.usuarioId === usuarioId || usuarioId.startsWith('usr-google') || usuarioId === 'usr-1') : [];

            if (reservas.length === 0) {
                container.innerHTML = `<p class="body-regular">No tienes reservas activas de enoturismo.</p>`;
                return;
            }

            let html = '';
            reservas.forEach(res => {
                html += `
                    <div class="order-card">
                        <div class="order-header">
                            <strong>${res.titulo}</strong>
                            <span class="order-status status-entregado">${res.estado}</span>
                        </div>
                        <p class="body-regular" style="margin-bottom: var(--espaciado-8);"><strong>Fecha y hora:</strong> ${res.fechaEvento}</p>
                        <p class="body-regular" style="margin-bottom: var(--espaciado-8);"><strong>Asistentes:</strong> ${res.personas} personas</p>
                        <strong style="color: var(--color-primario-bordeos);">Importe: ${res.total}</strong>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        function renderizarDirecciones(usuarioId) {
            const container = document.getElementById('direcciones-container');
            if (!container || !appData) return;

            const dirs = appData.direcciones ? appData.direcciones.filter(d => d.usuarioId === usuarioId || usuarioId.startsWith('usr-google') || usuarioId === 'usr-1') : [];

            if (dirs.length === 0) {
                container.innerHTML = `<p class="body-regular">No hay direcciones registradas.</p>`;
                return;
            }

            let html = '';
            dirs.forEach(d => {
                html += `
                    <div class="address-card">
                        <strong style="color: var(--color-primario-bordeos); display: block; margin-bottom: 4px;">${d.alias}</strong>
                        <p class="body-regular" style="font-size: 0.95rem;">${d.calle}</p>
                        <p class="body-regular" style="font-size: 0.95rem;">${d.codigoPostal} ${d.ciudad} (${d.provincia})</p>
                        <p class="body-regular" style="font-size: 0.9rem; color: var(--color-gris-700); margin-top: 4px;">Tel: ${d.telefono}</p>
                    </div>
                `;
            });

            container.innerHTML = html;
        }
        // Lógica para habilitar/deshabilitar la edición del formulario de datos
const btnToggleEdit = document.getElementById('btn-toggle-edit');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const fieldsetDatos = document.getElementById('fieldset-datos');
const actionButtons = document.getElementById('action-buttons-edit');

if (btnToggleEdit && fieldsetDatos && actionButtons) {
    btnToggleEdit.addEventListener('click', () => {
        const isDisabled = fieldsetDatos.hasAttribute('disabled');
        if (isDisabled) {
            fieldsetDatos.removeAttribute('disabled');
            actionButtons.style.display = 'flex';
            btnToggleEdit.style.display = 'none';
        }
    });
}

if (btnCancelEdit && fieldsetDatos && actionButtons) {
    btnCancelEdit.addEventListener('click', () => {
        fieldsetDatos.setAttribute('disabled', 'true');
        actionButtons.style.display = 'none';
        btnToggleEdit.style.display = 'inline-block';
        
        // Restaurar valores originales
        const usuario = obtenerUsuarioActivo();
        if (usuario) {
            document.getElementById('edit-nombre').value = usuario.nombre || '';
            document.getElementById('edit-email').value = usuario.email || '';
            document.getElementById('edit-telefono').value = usuario.telefono || '';
            document.getElementById('edit-nacimiento').value = usuario.fechaNacimiento || '';
            document.getElementById('edit-dni').value = usuario.dni || '';
            document.getElementById('edit-direccion').value = usuario.direccion || '';
            document.getElementById('edit-ciudad').value = usuario.ciudad || '';
            document.getElementById('edit-cp').value = usuario.codigoPostal || '';
            document.getElementById('edit-provincia').value = usuario.provincia || '';
        }
    });
}