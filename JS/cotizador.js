// =========================================================
// PRENDAS & STYLOS - LÓGICA DEL COTIZADOR AUTOMÁTICO (js/cotizador.js)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
inicializarCotizador();
});
let datosCotizacionActual = {};
function inicializarCotizador() {
const inputPrenda = document.getElementById('tipo-prenda');
const inputTecnica = document.getElementById('tecnica-estampado');
const inputPosiciones = document.getElementById('posiciones-estampado');
const inputCantidad = document.getElementById('cantidad-unidades');
const btnMinus = document.getElementById('btn-qty-minus');
const btnPlus = document.getElementById('btn-qty-plus');
const qtyChips = document.querySelectorAll('.qty-chip');
const btnWhatsapp = document.getElementById('btn-pedir-whatsapp');
const btnCarrito = document.getElementById('btn-agregar-carrito-cotizado');
    if (!inputPrenda || !inputTecnica || !inputCantidad || !inputPosiciones) return;

    // Escuchar eventos de cambio para actualizar el cálculo instantáneamente
    [inputPrenda, inputTecnica, inputPosiciones, inputCantidad].forEach(el => {
        el.addEventListener('input', calcularPresupuesto);
        el.addEventListener('change', calcularPresupuesto);
    });

    // Botones de incremento / decremento
    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            let val = parseInt(inputCantidad.value, 10) || 1;
            if (val > 1) {
                inputCantidad.value = val - 1;
                calcularPresupuesto();
            }
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            let val = parseInt(inputCantidad.value, 10) || 1;
            inputCantidad.value = val + 1;
            calcularPresupuesto();
        });
    }

    // Chips de selección rápida de cantidad
    qtyChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const targetQty = parseInt(chip.getAttribute('data-qty'), 10);
            if (targetQty) {
                inputCantidad.value = targetQty;
                qtyChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                calcularPresupuesto();
            }
        });
    });

    // Acción de WhatsApp
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', enviarCotizacionWhatsApp);
    }

    // Acción de Añadir al Carrito
    if (btnCarrito) {
        btnCarrito.addEventListener('click', agregarCotizacionAlCarrito);
    }

    // Cálculo inicial
    calcularPresupuesto();
}
function calcularPresupuesto() {
const selectPrenda = document.getElementById('tipo-prenda');
const selectTecnica = document.getElementById('tecnica-estampado');
const selectPosiciones = document.getElementById('posiciones-estampado');
const inputCantidad = document.getElementById('cantidad-unidades');
    if (!selectPrenda || !selectTecnica || !selectPosiciones || !inputCantidad) return;

    const precioBasePrenda = parseFloat(selectPrenda.value) || 0;
    const precioBaseEstampado = parseFloat(selectTecnica.value) || 0;
    const factorPosiciones = parseFloat(selectPosiciones.value) || 1;
    let cantidad = parseInt(inputCantidad.value, 10);

    // Límites de cantidad
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
    if (cantidad > 1000) cantidad = 1000;

    // Nombres seleccionados
    const nombrePrenda = selectPrenda.options[selectPrenda.selectedIndex].getAttribute('data-nombre') || 'Prenda Base';
    const nombreTecnica = selectTecnica.options[selectTecnica.selectedIndex].getAttribute('data-nombre') || 'Técnica Estampado';
    const textoPosicion = selectPosiciones.options[selectPosiciones.selectedIndex].text;

    // Determinar porcentaje de descuento por escala
    let porcentajeDescuento = 0;
    let stepId = 'step-d1';

    if (cantidad >= 11 && cantidad <= 25) {
        porcentajeDescuento = 0.10; // 10%
        stepId = 'step-d2';
    } else if (cantidad >= 26 && cantidad <= 50) {
        porcentajeDescuento = 0.15; // 15%
        stepId = 'step-d3';
    } else if (cantidad >= 51) {
        porcentajeDescuento = 0.20; // 20%
        stepId = 'step-d4';
    }

    // Actualizar badges visuales de descuento
    document.querySelectorAll('.discount-step').forEach(step => step.classList.remove('active'));
    const activeStep = document.getElementById(stepId);
    if (activeStep) activeStep.classList.add('active');

    // Sincronizar chips activos si coincide
    document.querySelectorAll('.qty-chip').forEach(chip => {
        if (parseInt(chip.getAttribute('data-qty'), 10) === cantidad) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    // Cálculo financiero
    const costoEstampadoAjustado = precioBaseEstampado * factorPosiciones;
    const valorUnitarioSinDescuento = precioBasePrenda + costoEstampadoAjustado;
    const subtotalBruto = valorUnitarioSinDescuento * cantidad;
    
    const valorDescuento = subtotalBruto * porcentajeDescuento;
    const totalConDescuento = subtotalBruto - valorDescuento;
    const valorUnitarioFinal = totalConDescuento / cantidad;

    // Guardar datos globales de la cotización
    datosCotizacionActual = {
        prenda: nombrePrenda,
        tecnica: nombreTecnica,
        cantidad: cantidad,
        posiciones: textoPosicion,
        unitario: valorUnitarioFinal,
        subtotal: subtotalBruto,
        descuentoPct: (porcentajeDescuento * 100) + '%',
        total: totalConDescuento
    };

    // Actualizar elementos DOM
    const summaryPrenda = document.getElementById('summary-prenda');
    const summaryTecnica = document.getElementById('summary-tecnica');
    const summaryCantidad = document.getElementById('summary-cantidad');
    const summaryDescuento = document.getElementById('summary-descuento');
    const summaryUnitario = document.getElementById('summary-unitario');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    if (summaryPrenda) summaryPrenda.textContent = nombrePrenda;
    if (summaryTecnica) summaryTecnica.textContent = `${nombreTecnica}`;
    if (summaryCantidad) summaryCantidad.textContent = `${cantidad} un.`;
    if (summaryDescuento) summaryDescuento.textContent = porcentajeDescuento > 0 ? `${porcentajeDescuento * 100}% OFF` : '0%';
    
    if (summaryUnitario) summaryUnitario.textContent = `$${Math.round(valorUnitarioFinal).toLocaleString('es-CO')} COP`;
    if (summarySubtotal) summarySubtotal.textContent = `$${Math.round(subtotalBruto).toLocaleString('es-CO')} COP`;
    if (summaryTotal) summaryTotal.textContent = `$${Math.round(totalConDescuento).toLocaleString('es-CO')} COP`;
}
function enviarCotizacionWhatsApp() {
    if (!datosCotizacionActual.total) return;

    const ordenNum = 'COT-' + Math.floor(100000 + Math.random() * 900000);

    try {
        const nuevaCot = {
            orden: ordenNum,
            cliente: 'Cotizante Web',
            contacto: 'WhatsApp Directo',
            detalle: `${datosCotizacionActual.cantidad}x ${datosCotizacionActual.prenda} (${datosCotizacionActual.tecnica}, ${datosCotizacionActual.posiciones})`,
            total: Math.round(datosCotizacionActual.total),
            estado: 'Cotización',
            fecha: new Date().toLocaleString('es-CO')
        };
        const existentes = JSON.parse(localStorage.getItem('prendas_admin_orders') || '[]');
        existentes.unshift(nuevaCot);
        localStorage.setItem('prendas_admin_orders', JSON.stringify(existentes));
    } catch(e) {
        console.warn('No se pudo registrar la cotización en admin:', e);
    }

    const telefono = '573173247083';
    const mensaje = `Hola *Prendas & Stylos* 👋, deseo consultar disponibilidad para la siguiente Pre-Orden (Cotización: ${ordenNum}):

📌 *Prenda Base:* ${datosCotizacionActual.prenda}
🎨 *Técnica:* ${datosCotizacionActual.tecnica}
📍 *Posiciones:* ${datosCotizacionActual.posiciones}
📦 *Cantidad:* ${datosCotizacionActual.cantidad} unidades
💰 *Descuento Aplicado:* ${datosCotizacionActual.descuentoPct}
🏷️ *VALOR TOTAL ESTIMADO:* $${Math.round(datosCotizacionActual.total).toLocaleString('es-CO')} COP

¿Me indican los pasos para enviar mis diseños y confirmar el pedido?`;

    const urlWhatsapp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
}
function agregarCotizacionAlCarrito() {
    if (!datosCotizacionActual.total) return;
    const cartItem = {
        id: 'cot-' + Date.now(),
        nombre: `Pre-Orden: ${datosCotizacionActual.prenda} (${datosCotizacionActual.tecnica})`,
        precio: Math.round(datosCotizacionActual.total / datosCotizacionActual.cantidad),
        imagen: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
        cantidad: datosCotizacionActual.cantidad
    };

    let cart = [];
    const guardado = localStorage.getItem('prendas_cart');
    if (guardado) cart = JSON.parse(guardado);

    cart.push(cartItem);
    localStorage.setItem('prendas_cart', JSON.stringify(cart));

    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    } else if (typeof actualizarContadorCarritoGlobal === 'function') {
        actualizarContadorCarritoGlobal();
    }

    const btn = document.getElementById('btn-agregar-carrito-cotizado');
    if (btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ¡Pre-Orden Añadida al Carrito!`;
        btn.style.background = '#25d366';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    }
}