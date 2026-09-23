// =========================================================
// PRENDAS & STYLOS - LÓGICA DEL CARRITO DE COMPRAS (js/carrito.js)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
inicializarCarritoPagina();
});
function inicializarCarritoPagina() {
    // 1. Ocultar modales al cargar
    const modalReceipt = document.getElementById('receipt-modal');
    if (modalReceipt) modalReceipt.style.display = 'none';
    const modalPasarela = document.getElementById('modal-pasarela-pago');
    if (modalPasarela) modalPasarela.style.display = 'none';

    renderizarCarrito();
    configurarControlesEntrega();
    configurarRestriccionNumerica();
    configurarAccionesCheckout();
    configurarPasarelaPagos();
    configurarVentanaMovible();
}
function obtenerCarrito() {
const cart = localStorage.getItem('prendas_cart');
return cart ? JSON.parse(cart) : [];
}
function guardarCarrito(cart) {
localStorage.setItem('prendas_cart', JSON.stringify(cart));
if (typeof actualizarContadorCarrito === 'function') {
actualizarContadorCarrito();
} else if (typeof actualizarContadorCarritoGlobal === 'function') {
actualizarContadorCarritoGlobal();
}
}
// RESTRICCIÓN NUMÉRICA PARA CÉDULA Y TELÉFONO (MÁX 15 DIGITOS)
function configurarRestriccionNumerica() {
const camposNumericos = ['input-cedula', 'input-telefono'];
    camposNumericos.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 15) {
                val = val.slice(0, 15);
            }
            e.target.value = val;
        });
    });
}
// RENDERIZADO Y DISPOSICIÓN DE LOS ITEMS EN EL CARRITO
function renderizarCarrito() {
    const container = document.getElementById('cart-items-container');
    const btnEmpty = document.getElementById('btn-empty-cart');
    if (!container) return;
    const cart = obtenerCarrito();
    container.innerHTML = '';

    if (cart.length === 0) {
        if (btnEmpty) btnEmpty.style.display = 'none';

        container.innerHTML = `
            <div style="text-align: center; padding: 3.5rem 1.5rem; color: var(--text-secondary);">
                <i class="fa-solid fa-cart-flatbed fa-4x" style="margin-bottom: 1.2rem; color: var(--accent); opacity: 0.6;"></i>
                <h3 style="color: var(--text-main); font-size: 1.35rem; margin-bottom: 0.5rem; font-weight: 800;">Tu carrito está vacío</h3>
                <p style="font-size: 0.95rem; margin-bottom: 1.5rem; color: var(--text-secondary);">Parece que aún no has agregado prendas o cotizaciones a tu lista.</p>
                <a href="galeria.html" class="btn-hero-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-shirt"></i> Explorar Colección
                </a>
            </div>
        `;

        actualizarResumenTotales(0);
        return;
    }

    if (btnEmpty) {
        btnEmpty.style.display = 'inline-flex';
        btnEmpty.onclick = vaciarCarrito;
    }

    let subtotalGeneral = 0;

    cart.forEach((item, index) => {
        const itemSubtotal = item.precio * item.cantidad;
        subtotalGeneral += itemSubtotal;

        const cardItem = document.createElement('div');
        cardItem.className = 'cart-item-card';

        // Detalle descriptivo de la prenda (técnica, tipo o categoría)
        const detalleTexto = item.categoria || item.detalle || item.detail || 'Prenda personalizada';

        cardItem.innerHTML = `
            <!-- Imagen en miniatura -->
            <img src="${item.imagen}" alt="${item.nombre}" 
                 style="width: 85px; height: 85px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border-color); flex-shrink: 0;"
                 onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'">

            <!-- Detalles del Producto Seleccionado -->
            <div style="min-width: 160px;">
                <h4 style="color: var(--text-main); font-size: 1.05rem; margin-bottom: 0.25rem; font-weight: 800; line-height: 1.3;">${item.nombre}</h4>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                    <i class="fa-solid fa-tag" style="color: var(--accent); font-size: 0.72rem;"></i>
                    <span>${detalleTexto}</span>
                </div>
                <p style="color: var(--accent); font-weight: 800; font-size: 0.98rem; margin-bottom: 0;">
                    $${Number(item.precio).toLocaleString('es-CO')} COP <span style="color: var(--text-muted); font-size: 0.78rem; font-weight: 400;">/ unidad</span>
                </p>
            </div>

            <!-- Acciones de Cantidad: Adicionar Más o Disminuir -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.3rem;">
                <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Cantidad</span>
                <div class="cart-qty-control">
                    <button class="cart-qty-btn" onclick="cambiarCantidad(${index}, -1)" title="Disminuir una unidad" aria-label="Disminuir">-</button>
                    <span style="color: var(--text-main); font-weight: 800; font-size: 1.05rem; min-width: 28px; text-align: center;">${item.cantidad}</span>
                    <button class="cart-qty-btn" onclick="cambiarCantidad(${index}, 1)" title="Adicionar una unidad más" aria-label="Adicionar más">+</button>
                </div>
            </div>

            <!-- Subtotal del Item y Botón de Descarte Individual -->
            <div class="cart-item-bottom-actions" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem; justify-content: center;">
                <div style="text-align: right;">
                    <span style="color: var(--text-secondary); font-size: 0.75rem; display: block;">Subtotal:</span>
                    <strong style="color: var(--text-main); font-size: 1.12rem; font-weight: 800;">$${itemSubtotal.toLocaleString('es-CO')} COP</strong>
                </div>

                <button onclick="eliminarItem(${index})" class="btn-discard-item" title="Descartar esta prenda de la compra">
                    <i class="fa-solid fa-trash-can"></i> Descartar
                </button>
            </div>
        `;

        container.appendChild(cardItem);
    });

    actualizarResumenTotales(subtotalGeneral);
}

function cambiarCantidad(index, cambio) {
    let cart = obtenerCarrito();
    if (!cart[index]) return;
    cart[index].cantidad += cambio;

    if (cart[index].cantidad <= 0) {
        const nombrePrenda = cart[index].nombre || 'esta prenda';
        if (confirm(`¿Deseas descartar "${nombrePrenda}" de tu carrito?`)) {
            cart.splice(index, 1);
        } else {
            cart[index].cantidad = 1;
        }
    }

    guardarCarrito(cart);
    renderizarCarrito();
    if (typeof actualizarContadorCarritoGlobal === 'function') {
        actualizarContadorCarritoGlobal();
    }
}

function eliminarItem(index) {
    let cart = obtenerCarrito();
    if (!cart[index]) return;
    const nombrePrenda = cart[index].nombre || 'esta prenda';
    if (confirm(`¿Deseas descartar "${nombrePrenda}" de tu lista de compra?`)) {
        cart.splice(index, 1);
        guardarCarrito(cart);
        renderizarCarrito();
        if (typeof actualizarContadorCarritoGlobal === 'function') {
            actualizarContadorCarritoGlobal();
        }
    }
}
function vaciarCarrito() {
if (confirm('🗑️ ¿Está seguro de vaciar todos los productos del carrito?')) {
limpiarFormularioYCarrito();
}
}
function limpiarFormularioYCarrito() {
localStorage.removeItem('prendas_cart');
    ['input-nombre', 'input-email', 'input-cedula', 'input-telefono'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    guardarCarrito([]);
    renderizarCarrito();
}
// CÁLCULO DE TOTALES Y ENVÍO
function actualizarResumenTotales(subtotalProductos) {
const elSubtotal = document.getElementById('cart-subtotal');
const elEnvioVal = document.getElementById('cart-envio-val');
const elTotal = document.getElementById('cart-total');
const selectEntrega = document.getElementById('tipo-entrega');
    if (!elSubtotal || !elTotal) return;

    let costoEnvio = 0;
    if (selectEntrega) {
        const metodo = selectEntrega.value;
        if (metodo === 'envio-local') costoEnvio = 10000;
        if (metodo === 'envio-nacional') costoEnvio = 18000;
    }

    if (elEnvioVal) {
        elEnvioVal.textContent = costoEnvio === 0 ? 'GRATIS' : `$${costoEnvio.toLocaleString('es-CO')} COP`;
        elEnvioVal.style.color = costoEnvio === 0 ? '#4cd137' : '#fff';
    }

    const totalFinal = Math.max(0, subtotalProductos + costoEnvio);

    elSubtotal.textContent = `$${subtotalProductos.toLocaleString('es-CO')} COP`;
    elTotal.textContent = `$${Math.round(totalFinal).toLocaleString('es-CO')} COP`;
}
function configurarControlesEntrega() {
const selectEntrega = document.getElementById('tipo-entrega');
if (selectEntrega) {
selectEntrega.addEventListener('change', () => {
const cart = obtenerCarrito();
const subtotal = cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
actualizarResumenTotales(subtotal);
});
}
}
// LÓGICA PARA HACER LA VENTANA MODAL MOVIBLE (DRAGGABLE WINDOW)
function configurarVentanaMovible() {
const modalCard = document.getElementById('receipt-modal-card');
const dragHeader = document.getElementById('receipt-drag-header');
    if (!modalCard || !dragHeader) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    dragHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('#close-receipt-btn')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = modalCard.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        modalCard.style.transform = 'none';
        modalCard.style.left = `${initialLeft}px`;
        modalCard.style.top = `${initialTop}px`;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        modalCard.style.left = `${initialLeft + dx}px`;
        modalCard.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}
// VALIDACIÓN DE ORDEN INCOMPLETA Y AUTORIZACIÓN DE DATOS (HABEAS DATA LEY 1581)
function validarYObtenerOrden() {
    const cart = obtenerCarrito();
    const nombre = document.getElementById('input-nombre')?.value.trim() || '';
    const email = document.getElementById('input-email')?.value.trim() || '';
    const cedula = document.getElementById('input-cedula')?.value.trim() || '';
    const telefono = document.getElementById('input-telefono')?.value.trim() || '';
    const checkPrivacidad = document.getElementById('check-privacidad-cart');
    const privacidadAceptada = checkPrivacidad ? checkPrivacidad.checked : true;

    const hayCarritoVacio = cart.length === 0;
    const hayCamposIncompletos = !nombre || !email || !cedula || !telefono || !privacidadAceptada;

    if (hayCarritoVacio || hayCamposIncompletos) {
        let detalleFaltante = '';
        if (hayCarritoVacio) detalleFaltante += '• No tienes productos agregados al carrito.\n';
        if (!nombre) detalleFaltante += '• Falta ingresar tu Nombre Completo.\n';
        if (!email) detalleFaltante += '• Falta ingresar tu Correo Electrónico.\n';
        if (!cedula) detalleFaltante += '• Falta ingresar tu Cédula / CC.\n';
        if (!telefono) detalleFaltante += '• Falta ingresar tu Celular / Teléfono.\n';
        if (!privacidadAceptada) detalleFaltante += '• Debes autorizar el tratamiento de datos y aceptar las Políticas de Privacidad (Ley 1581 de 2012 / MinTIC).\n';

        const mensajeAdvertencia = `⚠️ LA ORDEN DE PEDIDO ESTÁ INCOMPLETA:\n\n${detalleFaltante}\n` +
            `--------------------------------------------------\n` +
            `• Oprima [ACEPTAR] para CONTINUAR en la página y completar los requisitos.\n` +
            `• Oprima [CANCELAR] para RECHAZAR la orden en proceso (se limpiará la orden y el formulario).`;

        const deseaContinuar = confirm(mensajeAdvertencia);

        if (deseaContinuar) {
            if (!nombre && document.getElementById('input-nombre')) document.getElementById('input-nombre').focus();
            else if (!email && document.getElementById('input-email')) document.getElementById('input-email').focus();
            else if (!cedula && document.getElementById('input-cedula')) document.getElementById('input-cedula').focus();
            else if (!telefono && document.getElementById('input-telefono')) document.getElementById('input-telefono').focus();
            else if (!privacidadAceptada && checkPrivacidad) {
                checkPrivacidad.focus();
                checkPrivacidad.parentElement.style.outline = '2px solid var(--accent)';
                setTimeout(() => { if (checkPrivacidad.parentElement) checkPrivacidad.parentElement.style.outline = 'none'; }, 3000);
            }
        } else {
            alert('❌ La orden en proceso ha sido RECHAZADA y limpiada correctamente.');
            limpiarFormularioYCarrito();
        }

        return null;
    }

    return {
        cliente: { nombre, email, cedula, telefono },
        cart: cart
    };
}
// CHECKOUT VIA WHATSAPP Y GENERACIÓN DE COMPROBANTE DE ORDEN
function configurarAccionesCheckout() {
const btnWhatsapp = document.getElementById('btn-checkout-whatsapp');
const btnReceipt = document.getElementById('btn-imprimir-comprobante');
const modalReceipt = document.getElementById('receipt-modal');
const btnCloseReceipt = document.getElementById('close-receipt-btn');
const btnCloseReceiptAction = document.getElementById('close-receipt-modal-action');
const btnEjecutarImpresion = document.getElementById('btn-ejecutar-impresion');
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', procesarPedidoWhatsApp);
    }

    if (btnReceipt) {
        btnReceipt.addEventListener('click', generarComprobanteOrden);
    }

    if (btnEjecutarImpresion) {
        btnEjecutarImpresion.addEventListener('click', () => {
            if (typeof generarOrdenPDFData === 'function' && window.currentOrderData) {
                generarOrdenPDFData(window.currentOrderData);
            } else {
                window.print();
            }
        });
    }

    if (btnCloseReceipt && modalReceipt) {
        btnCloseReceipt.onclick = () => modalReceipt.style.display = 'none';
    }
    if (btnCloseReceiptAction && modalReceipt) {
        btnCloseReceiptAction.onclick = () => modalReceipt.style.display = 'none';
    }
}
function procesarPedidoWhatsApp() {
const ordenValida = validarYObtenerOrden();
if (!ordenValida) return;
    const { cliente, cart } = ordenValida;

    const selectEntrega = document.getElementById('tipo-entrega');
    const metodoEntregaTexto = selectEntrega ? selectEntrega.options[selectEntrega.selectedIndex].text : 'Entrega Estándar';

    let subtotal = cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    let costoEnvio = 0;
    if (selectEntrega) {
        if (selectEntrega.value === 'envio-local') costoEnvio = 10000;
        if (selectEntrega.value === 'envio-nacional') costoEnvio = 18000;
    }

    let totalFinal = Math.max(0, subtotal + costoEnvio);

    let listaItemsTexto = '';
    cart.forEach((item, idx) => {
        listaItemsTexto += `${idx + 1}. *${item.nombre}*\n   - Cantidad: ${item.cantidad} un.\n   - Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-CO')} COP\n`;
    });

    const ordenNumWhatsApp = 'PS-' + Math.floor(100000 + Math.random() * 900000);
    registrarPedidoEnAdmin(ordenNumWhatsApp, cliente, cart, totalFinal, 'En proceso');

    const mensajeWhatsApp = `Hola *Prendas & Stylos* 👋, confirmo el envío de mi orden de pedido:

👤 DATOS DEL CLIENTE:
• Nombre: ${cliente.nombre}
• Correo: ${cliente.email}
• Cédula/CC: ${cliente.cedula}
• Teléfono/Cel: ${cliente.telefono}
🛍️ DETALLE DEL PEDIDO (Orden: ${ordenNumWhatsApp}):
${listaItemsTexto}
🚚 Método de Entrega: ${metodoEntregaTexto}
💰 TOTAL A PAGAR: $${Math.round(totalFinal).toLocaleString('es-CO')} COP
¿Me pueden indicar las opciones de pago (Nequi, Daviplata, Bancolombia) para proceder?`;
    const url = `https://wa.me/573173247083?text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(url, '_blank');
}

function registrarPedidoEnAdmin(ordenNum, cliente, cart, totalFinal, estado = 'En proceso') {
    try {
        const detalleTexto = cart.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');
        const nuevaOrden = {
            orden: ordenNum,
            cliente: cliente.nombre || 'Cliente Web',
            contacto: cliente.telefono || '',
            detalle: detalleTexto || 'Prendas personalizadas',
            total: Math.round(totalFinal),
            estado: estado,
            fecha: new Date().toLocaleString('es-CO')
        };

        const existentes = JSON.parse(localStorage.getItem('prendas_admin_orders') || '[]');
        if (!existentes.some(o => o.orden === ordenNum)) {
            existentes.unshift(nuevaOrden);
            localStorage.setItem('prendas_admin_orders', JSON.stringify(existentes));
        }
    } catch(e) {
        console.warn('Aviso: no se pudo guardar pedido en admin:', e);
    }
}

function generarComprobanteOrden() {
    const ordenValida = validarYObtenerOrden();
    if (!ordenValida) return;
    const { cliente, cart } = ordenValida;

    const modalReceipt = document.getElementById('receipt-modal');
    const printableArea = document.getElementById('receipt-printable-area');

    const selectEntrega = document.getElementById('tipo-entrega');
    const metodoEntregaTexto = selectEntrega ? selectEntrega.options[selectEntrega.selectedIndex].text : 'Recogida Local';

    let subtotal = cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    let costoEnvio = 0;
    if (selectEntrega) {
        if (selectEntrega.value === 'envio-local') costoEnvio = 10000;
        if (selectEntrega.value === 'envio-nacional') costoEnvio = 18000;
    }

    let totalFinal = Math.max(0, subtotal + costoEnvio);

    const ordenNum = 'PS-' + Math.floor(100000 + Math.random() * 900000);
    const fechaHora = new Date().toLocaleString('es-CO');

    registrarPedidoEnAdmin(ordenNum, cliente, cart, totalFinal, 'En proceso');

    window.currentOrderData = {
        orderNumber: ordenNum,
        clientName: cliente.nombre,
        clientPhone: cliente.telefono,
        clientEmail: cliente.email,
        total: totalFinal,
        items: cart.map(i => ({
            name: i.nombre,
            qty: i.cantidad,
            subtotal: i.precio * i.cantidad,
            detail: i.detail || ''
        }))
    };

    let tablaFilas = '';
    cart.forEach(item => {
        tablaFilas += `
            <tr>
                <td style="padding: 0.4rem 0;">${item.nombre}</td>
                <td style="padding: 0.4rem 0; text-align: center;">${item.cantidad}</td>
                <td style="padding: 0.4rem 0; text-align: right;">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</td>
            </tr>
        `;
    });

    if (printableArea && modalReceipt) {
        printableArea.innerHTML = `
            <div style="text-align: center; border-bottom: 2px dashed var(--border-color, #cbd5e1); padding-bottom: 1rem; margin-bottom: 1rem;">
                <h2 style="margin: 0; color: var(--text-main, #0f172a); font-size: 1.4rem; font-weight: 800;">PRENDAS & STYLOS</h2>
                <p style="margin: 0.2rem 0 0 0; color: var(--text-muted, #64748b); font-size: 0.85rem;">COMPROBANTE DE ORDEN DE PEDIDO</p>
                <p style="margin: 0.4rem 0 0 0; color: var(--accent, #0284c7); font-weight: 800; font-size: 1.05rem;">ORDEN #${ordenNum}</p>
                <p style="margin: 0.2rem 0 0 0; color: var(--text-muted, #94a3b8); font-size: 0.75rem;">Fecha: ${fechaHora}</p>
            </div>

            <div style="background: #ffffff; padding: 0.9rem; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0); margin-bottom: 1rem; font-size: 0.82rem; line-height: 1.5;">
                <strong style="color: var(--text-main, #0f172a); display: block; margin-bottom: 0.3rem;">DATOS DEL CLIENTE:</strong>
                <div>• <span style="color: var(--text-muted, #64748b);">Cliente:</span> <strong style="color: var(--text-main, #0f172a);">${cliente.nombre}</strong></div>
                <div>• <span style="color: var(--text-muted, #64748b);">Cédula:</span> <span style="color: var(--text-main, #0f172a);">${cliente.cedula}</span></div>
                <div>• <span style="color: var(--text-muted, #64748b);">Correo:</span> <span style="color: var(--text-main, #0f172a);">${cliente.email}</span></div>
                <div>• <span style="color: var(--text-muted, #64748b);">Teléfono:</span> <span style="color: var(--text-main, #0f172a);">${cliente.telefono}</span></div>
            </div>

            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 1rem;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--border-color, #e2e8f0); text-align: left; color: var(--text-secondary, #475569);">
                        <th style="padding: 0.5rem 0;">Ítem</th>
                        <th style="padding: 0.5rem 0; text-align: center;">Cant.</th>
                        <th style="padding: 0.5rem 0; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody style="color: var(--text-main, #0f172a);">
                    ${tablaFilas}
                </tbody>
            </table>

            <div style="border-top: 1px dashed var(--border-color, #cbd5e1); padding-top: 0.8rem; font-size: 0.88rem; color: var(--text-secondary, #475569);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span>Subtotal:</span>
                    <strong style="color: var(--text-main, #0f172a);">$${subtotal.toLocaleString('es-CO')} COP</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                    <span>Entrega:</span>
                    <strong style="color: var(--text-main, #0f172a);">${metodoEntregaTexto}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.15rem; color: var(--accent, #0284c7); border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 0.6rem; margin-top: 0.4rem;">
                    <span>TOTAL:</span>
                    <span>$${Math.round(totalFinal).toLocaleString('es-CO')} COP</span>
                </div>
            </div>

            <div style="text-align: center; margin-top: 1.5rem; font-size: 0.78rem; color: var(--text-muted, #94a3b8); border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 0.8rem;">
                <p style="margin: 0;">Presenta este comprobante en el Punto de Entrega o envíalo por WhatsApp.</p>
                <p style="margin: 0.2rem 0 0 0; font-weight: 600; color: var(--text-secondary, #64748b);">¡Gracias por comprar en Prendas & Stylos!</p>
            </div>
        `;

        modalReceipt.style.display = 'flex';
    }
}

// =========================================================
// GESTIÓN Y LÓGICA DE LA PASARELA DE PAGOS SEGURA (PSE / TARJETA / NEQUI)
// =========================================================
function configurarPasarelaPagos() {
    const btnCheckoutPasarela = document.getElementById('btn-checkout-pasarela');
    const modalPasarela = document.getElementById('modal-pasarela-pago');
    const btnClosePasarela = document.getElementById('close-pasarela-btn');
    const btnProcesarPago = document.getElementById('btn-procesar-pago-pasarela');
    const methodTabs = document.querySelectorAll('.payment-method-card');
    const btnVerComprobante = document.getElementById('btn-pasarela-ver-comprobante');

    if (!btnCheckoutPasarela || !modalPasarela) return;

    let metodoActivo = 'pse';

    // 1. Abrir Pasarela al dar clic en el botón de pasarela segura
    btnCheckoutPasarela.addEventListener('click', () => {
        const ordenValida = validarYObtenerOrden();
        if (!ordenValida) return;

        const { cliente, cart } = ordenValida;

        // Calcular costo de entrega y total final
        const selectEntrega = document.getElementById('tipo-entrega');
        let costoEnvio = 0;
        if (selectEntrega) {
            if (selectEntrega.value === 'envio-local') costoEnvio = 10000;
            if (selectEntrega.value === 'envio-nacional') costoEnvio = 18000;
        }
        const subtotal = cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
        const totalFinal = Math.max(0, subtotal + costoEnvio);

        // Prellenar datos en la pasarela
        const elMontoTotal = document.getElementById('pasarela-monto-total');
        const elResumenCliente = document.getElementById('pasarela-resumen-cliente');
        const elPseEmail = document.getElementById('pse-email');
        const elWalletTelefono = document.getElementById('wallet-telefono');

        if (elMontoTotal) elMontoTotal.textContent = `$${Math.round(totalFinal).toLocaleString('es-CO')} COP`;
        if (elResumenCliente) elResumenCliente.textContent = `Cliente: ${cliente.nombre} • Tel: ${cliente.telefono}`;
        if (elPseEmail && !elPseEmail.value) elPseEmail.value = cliente.email || '';
        if (elWalletTelefono && !elWalletTelefono.value) elWalletTelefono.value = cliente.telefono || '';

        // Resetear vistas del modal
        const stepForm = document.getElementById('pasarela-step-form');
        const stepLoading = document.getElementById('pasarela-step-loading');
        const stepSuccess = document.getElementById('pasarela-step-success');

        if (stepForm) stepForm.style.display = 'block';
        if (stepLoading) stepLoading.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';

        modalPasarela.style.display = 'flex';
    });

    // 2. Cerrar Modal
    if (btnClosePasarela) {
        btnClosePasarela.addEventListener('click', () => {
            modalPasarela.style.display = 'none';
        });
    }

    modalPasarela.addEventListener('click', (e) => {
        if (e.target === modalPasarela) {
            modalPasarela.style.display = 'none';
        }
    });

    // 3. Selección dinámica de métodos de pago
    methodTabs.forEach(card => {
        card.addEventListener('click', () => {
            methodTabs.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            metodoActivo = card.getAttribute('data-method');

            const psePanel = document.getElementById('method-pse-panel');
            const cardPanel = document.getElementById('method-card-panel');
            const walletPanel = document.getElementById('method-wallet-panel');

            if (psePanel) psePanel.style.display = metodoActivo === 'pse' ? 'flex' : 'none';
            if (cardPanel) cardPanel.style.display = metodoActivo === 'card' ? 'flex' : 'none';
            if (walletPanel) walletPanel.style.display = metodoActivo === 'wallet' ? 'flex' : 'none';
        });
    });

    // Formateo visual para tarjeta
    const inputCardNumero = document.getElementById('card-numero');
    if (inputCardNumero) {
        inputCardNumero.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 16);
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted;
        });
    }

    const inputCardExpira = document.getElementById('card-expira');
    if (inputCardExpira) {
        inputCardExpira.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 2) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2);
            } else {
                e.target.value = val;
            }
        });
    }

    // 4. Procesar el pago con pasarela
    if (btnProcesarPago) {
        btnProcesarPago.addEventListener('click', () => {
            const ordenValida = validarYObtenerOrden();
            if (!ordenValida) return;
            const { cliente, cart } = ordenValida;

            // Validar según método
            let metodoNombreTexto = 'PSE Débito Bancario';
            if (metodoActivo === 'pse') {
                const pseEmail = document.getElementById('pse-email')?.value.trim();
                if (!pseEmail) {
                    alert('Por favor ingresa el correo registrado en PSE para debitar el pago.');
                    document.getElementById('pse-email')?.focus();
                    return;
                }
                const banco = document.getElementById('pse-banco')?.value || 'Bancolombia';
                metodoNombreTexto = `PSE (${banco})`;
            } else if (metodoActivo === 'card') {
                const num = document.getElementById('card-numero')?.value.replace(/\s+/g, '');
                const titular = document.getElementById('card-nombre')?.value.trim();
                const exp = document.getElementById('card-expira')?.value.trim();
                const cvv = document.getElementById('card-cvv')?.value.trim();
                if (!num || num.length < 13 || !titular || !exp || !cvv) {
                    alert('Por favor diligencia todos los datos requeridos de la tarjeta de crédito o débito.');
                    return;
                }
                metodoNombreTexto = `Tarjeta terminada en •••• ${num.slice(-4)}`;
            } else if (metodoActivo === 'wallet') {
                const tel = document.getElementById('wallet-telefono')?.value.trim();
                const app = document.getElementById('wallet-app')?.value || 'Nequi';
                if (!tel) {
                    alert('Por favor ingresa el celular vinculado a la billetera digital.');
                    document.getElementById('wallet-telefono')?.focus();
                    return;
                }
                metodoNombreTexto = `${app} (${tel})`;
            }

            // Calcular totales
            const selectEntrega = document.getElementById('tipo-entrega');
            let costoEnvio = 0;
            const metodoEntregaTexto = selectEntrega ? selectEntrega.options[selectEntrega.selectedIndex].text : 'Recogida Local';
            if (selectEntrega) {
                if (selectEntrega.value === 'envio-local') costoEnvio = 10000;
                if (selectEntrega.value === 'envio-nacional') costoEnvio = 18000;
            }
            const subtotal = cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
            const totalFinal = Math.max(0, subtotal + costoEnvio);

            // Mostrar estado de carga / procesamiento
            const stepForm = document.getElementById('pasarela-step-form');
            const stepLoading = document.getElementById('pasarela-step-loading');
            const stepSuccess = document.getElementById('pasarela-step-success');

            if (stepForm) stepForm.style.display = 'none';
            if (stepLoading) stepLoading.style.display = 'block';

            setTimeout(() => {
                const ordenNum = 'PYS-' + Math.floor(100000 + Math.random() * 900000);
                const refCode = 'CUS-' + Math.floor(10000000 + Math.random() * 90000000);

                // Registrar orden en administrador con estado 'Vendido'
                registrarPedidoEnAdmin(ordenNum, cliente, cart, totalFinal, 'Vendido');

                // Guardar datos globales de la orden para el comprobante / PDF
                window.currentOrderData = {
                    orderNumber: ordenNum,
                    refCode: refCode,
                    clientName: cliente.nombre,
                    clientPhone: cliente.telefono,
                    clientEmail: cliente.email,
                    clientCedula: cliente.cedula,
                    metodoPago: metodoNombreTexto,
                    metodoEntrega: metodoEntregaTexto,
                    estadoPago: 'Aprobado - Pagado en Línea',
                    total: totalFinal,
                    subtotal: subtotal,
                    costoEnvio: costoEnvio,
                    items: cart.map(i => ({
                        name: i.nombre,
                        qty: i.cantidad,
                        subtotal: i.precio * i.cantidad,
                        detail: i.categoria || i.detalle || i.detail || ''
                    }))
                };

                // Actualizar vista de éxito en la pasarela
                const elRefCode = document.getElementById('pasarela-ref-code');
                const elMetodoUtilizado = document.getElementById('pasarela-metodo-utilizado');
                const elTitular = document.getElementById('pasarela-titular-nombre');
                const elTotalCancelado = document.getElementById('pasarela-total-cancelado');

                if (elRefCode) elRefCode.textContent = refCode;
                if (elMetodoUtilizado) elMetodoUtilizado.textContent = metodoNombreTexto;
                if (elTitular) elTitular.textContent = cliente.nombre;
                if (elTotalCancelado) elTotalCancelado.textContent = `$${Math.round(totalFinal).toLocaleString('es-CO')} COP`;

                if (stepLoading) stepLoading.style.display = 'none';
                if (stepSuccess) stepSuccess.style.display = 'block';

                // Vaciar el carrito y actualizar contadores tras pago aprobado
                localStorage.removeItem('prendas_cart');
                renderizarCarrito();
                if (typeof actualizarContadorCarritoGlobal === 'function') {
                    actualizarContadorCarritoGlobal();
                }
            }, 1300);
        });
    }

    // 5. Botón Ver Comprobante tras pago exitoso
    if (btnVerComprobante) {
        btnVerComprobante.addEventListener('click', () => {
            modalPasarela.style.display = 'none';
            if (window.currentOrderData) {
                mostrarComprobanteDesdeData(window.currentOrderData);
            }
        });
    }
}

// MOSTRAR COMPROBANTE OFICIAL DE ORDEN (UTILIZABLE POR CHECKOUT Y PASARELA)
function mostrarComprobanteDesdeData(data) {
    const modalReceipt = document.getElementById('receipt-modal');
    const printableArea = document.getElementById('receipt-printable-area');
    if (!modalReceipt || !printableArea) return;

    const fechaHora = new Date().toLocaleString('es-CO');

    let tablaFilas = '';
    (data.items || []).forEach(item => {
        tablaFilas += `
            <tr>
                <td style="padding: 0.45rem 0; border-bottom: 1px solid var(--border-color, #f1f5f9);">
                    <strong>${item.name}</strong>
                    ${item.detail ? `<br><small style="color: var(--text-secondary);">${item.detail}</small>` : ''}
                </td>
                <td style="padding: 0.45rem 0; text-align: center; border-bottom: 1px solid var(--border-color, #f1f5f9);">${item.qty}</td>
                <td style="padding: 0.45rem 0; text-align: right; border-bottom: 1px solid var(--border-color, #f1f5f9); font-weight: 700;">$${Number(item.subtotal).toLocaleString('es-CO')}</td>
            </tr>
        `;
    });

    printableArea.innerHTML = `
        <div style="text-align: center; border-bottom: 2px dashed var(--border-color, #cbd5e1); padding-bottom: 1rem; margin-bottom: 1rem;">
            <h2 style="margin: 0; color: var(--text-main, #0f172a); font-size: 1.4rem; font-weight: 800;">PRENDAS & STYLOS</h2>
            <p style="margin: 0.2rem 0 0 0; color: var(--text-muted, #64748b); font-size: 0.85rem;">COMPROBANTE DE PAGO Y ORDEN DE COMPRA</p>
            <p style="margin: 0.4rem 0 0 0; color: var(--accent, #0284c7); font-weight: 800; font-size: 1.05rem;">ORDEN #${data.orderNumber}</p>
            ${data.refCode ? `<span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 0.15rem 0.55rem; border-radius: 6px; font-size: 0.76rem; font-weight: 700; margin-top: 0.25rem;">REF: ${data.refCode}</span>` : ''}
            <p style="margin: 0.3rem 0 0 0; color: var(--text-muted, #94a3b8); font-size: 0.75rem;">Fecha: ${fechaHora}</p>
        </div>

        <div style="background: #ffffff; padding: 0.9rem; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0); margin-bottom: 1rem; font-size: 0.82rem; line-height: 1.5;">
            <strong style="color: var(--text-main, #0f172a); display: block; margin-bottom: 0.3rem;">DATOS DEL CLIENTE:</strong>
            <div>• <span style="color: var(--text-muted, #64748b);">Cliente:</span> <strong style="color: var(--text-main, #0f172a);">${data.clientName}</strong></div>
            <div>• <span style="color: var(--text-muted, #64748b);">Cédula / CC:</span> <span style="color: var(--text-main, #0f172a);">${data.clientCedula || 'No registrada'}</span></div>
            <div>• <span style="color: var(--text-muted, #64748b);">Correo:</span> <span style="color: var(--text-main, #0f172a);">${data.clientEmail}</span></div>
            <div>• <span style="color: var(--text-muted, #64748b);">Teléfono:</span> <span style="color: var(--text-main, #0f172a);">${data.clientPhone}</span></div>
            ${data.metodoPago ? `<div>• <span style="color: var(--text-muted, #64748b);">Medio de Pago:</span> <strong style="color: #10b981;">${data.metodoPago} (${data.estadoPago || 'Pagado'})</strong></div>` : ''}
        </div>

        <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color, #e2e8f0); text-align: left; color: var(--text-secondary, #475569);">
                    <th style="padding: 0.5rem 0;">Ítem / Prenda</th>
                    <th style="padding: 0.5rem 0; text-align: center;">Cant.</th>
                    <th style="padding: 0.5rem 0; text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody style="color: var(--text-main, #0f172a);">
                ${tablaFilas}
            </tbody>
        </table>

        <div style="border-top: 1px dashed var(--border-color, #cbd5e1); padding-top: 0.8rem; font-size: 0.88rem; color: var(--text-secondary, #475569);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span>Subtotal:</span>
                <strong style="color: var(--text-main, #0f172a);">$${Number(data.subtotal || 0).toLocaleString('es-CO')} COP</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                <span>Entrega:</span>
                <strong style="color: var(--text-main, #0f172a);">${data.metodoEntrega || 'Punto de Entrega'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.18rem; color: var(--accent, #0284c7); border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 0.6rem; margin-top: 0.4rem;">
                <span>TOTAL PAGADO:</span>
                <span>$${Math.round(data.total || 0).toLocaleString('es-CO')} COP</span>
            </div>
        </div>

        <div style="text-align: center; margin-top: 1.3rem; font-size: 0.78rem; color: var(--text-muted, #94a3b8); border-top: 1px solid var(--border-color, #e2e8f0); padding-top: 0.8rem;">
            <p style="margin: 0; color: #10b981; font-weight: 700;">✓ Transacción verificada y aprobada por Pasarela Segura</p>
            <p style="margin: 0.2rem 0 0 0; color: var(--text-secondary, #64748b);">¡Gracias por tu compra en Prendas & Stylos!</p>
        </div>
    `;

    modalReceipt.style.display = 'flex';
}