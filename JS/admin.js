
document.addEventListener('DOMContentLoaded', () => {
inicializarPanelAdmin();
});
const ADMIN_USER_DEFAULT = 'admin';
const ADMIN_PASS_DEFAULT = 'admin123';
let countTimerInterval = null;
function inicializarPanelAdmin() {
    configurarSistemaAutenticacion();
    configurarPestañasAdmin();
    configurarCargaImagenModal();
    configurarGestionProductos();
    configurarGestionPedidos();
    configurarFiltrosPedidos();
    configurarVentanaInventarioMetricas();
    actualizarMetricasKPI();

    window.addEventListener('storage', (e) => {
        if (e.key === 'prendas_admin_orders' || e.key === 'prendas_cart_orders') {
            renderizarTablaPedidos();
            actualizarMetricasKPI();
        }
        if (e.key === 'prendas_admin_products' || e.key === 'prendas_catalog') {
            renderizarVistaPreviaProductos();
            renderizarTablaProductos();
            actualizarMetricasKPI();
        }
    });
}

function configurarSistemaAutenticacion() {
    const authOverlay = document.getElementById('auth-modal-overlay');
    const authForm = document.getElementById('auth-login-form');
    const btnLogout = document.getElementById('btn-admin-logout');
    const adminBadge = document.getElementById('admin-user-badge');

    verificarEstadoSeguridadPrevio();

    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true' || sessionStorage.getItem('admin_logged_in') === 'true';
    if (isLoggedIn) {
        if (authOverlay) authOverlay.style.display = 'none';
        if (adminBadge) adminBadge.style.display = 'flex';
    } else {
        if (authOverlay) authOverlay.style.display = 'flex';
        if (adminBadge) adminBadge.style.display = 'none';
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            procesarIntentoLogin();
        });
    }

    // Toggle para visualizar/ocultar la contraseña con el ojito
    const btnTogglePass = document.getElementById('btn-toggle-password');
    const iconTogglePass = document.getElementById('icon-toggle-password');
    const inputPassword = document.getElementById('auth-password');

    if (btnTogglePass && inputPassword && iconTogglePass) {
        btnTogglePass.addEventListener('click', () => {
            const isPassword = inputPassword.getAttribute('type') === 'password';
            inputPassword.setAttribute('type', isPassword ? 'text' : 'password');
            iconTogglePass.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
            btnTogglePass.style.color = isPassword ? 'var(--accent)' : 'var(--text-muted)';
            btnTogglePass.setAttribute('title', isPassword ? 'Ocultar contraseña' : 'Ver contraseña');
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('🔒 ¿Desea cerrar la sesión administrativa?')) {
                localStorage.removeItem('admin_logged_in');
                sessionStorage.removeItem('admin_logged_in');
                window.location.href = 'index.html';
            }
        });
    }
}
function obtenerIntentosFallidos() {
return parseInt(localStorage.getItem('admin_failed_attempts') || '0', 10);
}
function guardarIntentosFallidos(num) {
localStorage.setItem('admin_failed_attempts', num.toString());
}
function verificarEstadoSeguridadPrevio() {
const estaBloqueadoPermanente = localStorage.getItem('admin_user_permanently_blocked') === 'true';
if (estaBloqueadoPermanente) {
mostrarPantallaUsuarioBloqueado();
return;
}
    const lockoutUntil = parseInt(localStorage.getItem('admin_lockout_until') || '0', 10);
    const ahora = Date.now();

    if (lockoutUntil > ahora) {
        const fallos = obtenerIntentosFallidos();
        let tituloEmergente = "Intento Fallido";
        if (fallos === 1) tituloEmergente = "Primer intento FALLIDO";
        if (fallos === 2) tituloEmergente = "Segundo intento FALLIDO";
        if (fallos === 3) tituloEmergente = "Tercer intento FALLIDO";

        iniciarConteoBloqueo(lockoutUntil, tituloEmergente);
    }
}
function procesarIntentoLogin() {
const userInput = document.getElementById('auth-user')?.value.trim();
const passInput = document.getElementById('auth-password')?.value.trim();
const alertBox = document.getElementById('auth-alert-box');
const authOverlay = document.getElementById('auth-modal-overlay');
    if (localStorage.getItem('admin_user_permanently_blocked') === 'true') {
        mostrarPantallaUsuarioBloqueado();
        return;
    }

    const lockoutUntil = parseInt(localStorage.getItem('admin_lockout_until') || '0', 10);
    if (lockoutUntil > Date.now()) {
        const fallos = obtenerIntentosFallidos();
        let tituloEmergente = "Intento Fallido";
        if (fallos === 1) tituloEmergente = "Primer intento FALLIDO";
        if (fallos === 2) tituloEmergente = "Segundo intento FALLIDO";
        if (fallos === 3) tituloEmergente = "Tercer intento FALLIDO";

        iniciarConteoBloqueo(lockoutUntil, tituloEmergente);
        return;
    }

    if (userInput === ADMIN_USER_DEFAULT && passInput === ADMIN_PASS_DEFAULT) {
        guardarIntentosFallidos(0);
        localStorage.removeItem('admin_lockout_until');
        localStorage.removeItem('admin_user_permanently_blocked');
        localStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_logged_in', 'true');

        if (alertBox) alertBox.style.display = 'none';
        if (authOverlay) authOverlay.style.display = 'none';

        window.location.reload();
    } else {
        let fallos = obtenerIntentosFallidos() + 1;
        guardarIntentosFallidos(fallos);

        if (fallos === 1) {
            const tiempoDesbloqueo = Date.now() + (5 * 1000);
            localStorage.setItem('admin_lockout_until', tiempoDesbloqueo.toString());
            iniciarConteoBloqueo(tiempoDesbloqueo, "Primer intento FALLIDO");
        } else if (fallos === 2) {
            const tiempoDesbloqueo = Date.now() + (15 * 1000);
            localStorage.setItem('admin_lockout_until', tiempoDesbloqueo.toString());
            iniciarConteoBloqueo(tiempoDesbloqueo, "Segundo intento FALLIDO");
        } else if (fallos === 3) {
            const tiempoDesbloqueo = Date.now() + (60 * 1000);
            localStorage.setItem('admin_lockout_until', tiempoDesbloqueo.toString());
            iniciarConteoBloqueo(tiempoDesbloqueo, "Tercer intento FALLIDO");
        } else if (fallos >= 4) {
            localStorage.setItem('admin_user_permanently_blocked', 'true');
            mostrarPantallaUsuarioBloqueado();
        }
    }
}
function iniciarConteoBloqueo(tiempoDesbloqueo, tituloEmergente) {
const alertBox = document.getElementById('auth-alert-box');
const userInput = document.getElementById('auth-user');
const passInput = document.getElementById('auth-password');
const btnSubmit = document.getElementById('btn-auth-submit');
    if (userInput) userInput.disabled = true;
    if (passInput) passInput.disabled = true;
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.5';
        btnSubmit.style.cursor = 'not-allowed';
    }

    if (countTimerInterval) clearInterval(countTimerInterval);

    const actualizarTimer = () => {
        const restanteMs = tiempoDesbloqueo - Date.now();
        const segundosRestantes = Math.ceil(restanteMs / 1000);

        if (segundosRestantes <= 0) {
            clearInterval(countTimerInterval);
            localStorage.removeItem('admin_lockout_until');

            if (userInput) userInput.disabled = false;
            if (passInput) passInput.disabled = false;
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
                btnSubmit.style.cursor = 'pointer';
            }

            if (alertBox) {
                alertBox.style.display = 'block';
                alertBox.style.background = 'rgba(76, 209, 55, 0.15)';
                alertBox.style.border = '1px solid #4cd137';
                alertBox.style.color = '#fff';
                alertBox.innerHTML = `
                    <div style="font-weight: 800; color: #4cd137;">
                        <i class="fa-solid fa-lock-open"></i> TIEMPO DE ESPERA FINALIZADO
                    </div>
                    <div>Ya puede ingresar nuevamente sus credenciales.</div>
                `;
            }
        } else {
            if (alertBox) {
                alertBox.style.display = 'block';
                alertBox.style.background = 'rgba(255, 51, 102, 0.2)';
                alertBox.style.border = '1px solid var(--accent)';
                alertBox.style.color = '#fff';
                alertBox.innerHTML = `
                    <div style="font-weight: 900; color: var(--accent); font-size: 0.98rem; margin-bottom: 0.3rem;">
                        <i class="fa-solid fa-triangle-exclamation"></i> ⚠️ ${tituloEmergente}
                    </div>
                    <div>Tiempo de espera obligatorio antes del siguiente intento:</div>
                    <div style="text-align: center; margin-top: 0.5rem; font-size: 1.5rem; font-weight: 900; color: #00f2fe;">
                        <i class="fa-solid fa-hourglass-half fa-spin"></i> ${segundosRestantes}s
                    </div>
                `;
            }
        }
    };

    actualizarTimer();
    countTimerInterval = setInterval(actualizarTimer, 1000);
}
function mostrarPantallaUsuarioBloqueado() {
const alertBox = document.getElementById('auth-alert-box');
const userInput = document.getElementById('auth-user');
const passInput = document.getElementById('auth-password');
const btnSubmit = document.getElementById('btn-auth-submit');
const iconLock = document.getElementById('auth-icon-lock');
    if (userInput) userInput.disabled = true;
    if (passInput) passInput.disabled = true;
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.style.display = 'none';
    }

    if (iconLock) {
        iconLock.className = 'fa-solid fa-user-slash';
    }

    if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = 'rgba(255, 51, 102, 0.25)';
        alertBox.style.border = '1px solid var(--accent)';
        alertBox.style.color = '#fff';
        alertBox.innerHTML = `
            <div style="font-weight: 900; color: var(--accent); font-size: 1.1rem; margin-bottom: 0.5rem; text-align: center;">
                <i class="fa-solid fa-ban"></i> ⛔ USUARIO BLOQUEADO PERMANENTEMENTE
            </div>
            <p style="margin-bottom: 0.8rem; font-size: 0.88rem; color: #ddd;">
                Ha superado el número máximo de <strong>4 intentos fallidos</strong>.
            </p>
            <div style="border-top: 1px dashed rgba(255,51,102,0.4); padding-top: 0.8rem; margin-top: 0.8rem;">
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                    <a href="mailto:soporte@prendasystylos.com?subject=Solicitud%20de%20Desbloqueo" class="btn-support-action btn-support-email" target="_blank">
                        <i class="fa-solid fa-envelope"></i> Enviar Correo a Soporte
                    </a>
                    <a href="tel:+573173247083" class="btn-support-action btn-support-phone">
                        <i class="fa-solid fa-phone"></i> Llamar a Soporte Directo (+57 317 324 7083)
                    </a>
                </div>
            </div>
        `;
    }
}
function configurarPestañasAdmin() {
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');

            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) targetContent.style.display = 'block';
        });
    });
}
function configurarCargaImagenModal() {
const trigger = document.getElementById('upload-box-trigger');
const fileInput = document.getElementById('prod-file-input');
const previewWrapper = document.getElementById('image-preview-wrapper');
const previewImg = document.getElementById('image-preview-el');
const btnRemove = document.getElementById('btn-remove-image');
const base64Input = document.getElementById('prod-imagen-base64');
    if (trigger && fileInput) {
        trigger.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                alert('⚠️ Formato de archivo no válido. Seleccione un archivo JPG, JPEG o PNG.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (evt) => {
                const base64Str = evt.target.result;
                if (base64Input) base64Input.value = base64Str;
                if (previewImg) previewImg.src = base64Str;
                if (previewWrapper) previewWrapper.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnRemove) {
        btnRemove.addEventListener('click', () => {
            if (fileInput) fileInput.value = '';
            if (base64Input) base64Input.value = '';
            if (previewImg) previewImg.src = '';
            if (previewWrapper) previewWrapper.style.display = 'none';
        });
    }
}
const PRODUCTOS_INICIALES_CATALOGO = [
{ id: 'PRD-101', nombre: 'Camiseta Oversize Acid Wash', categoria: 'Camisetas', precio: 45000, stock: 25, estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
{ id: 'PRD-102', nombre: 'Short Deportivo Streetwear', categoria: 'Shorts', precio: 38000, stock: 18, estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500' },
{ id: 'PRD-103', nombre: 'Gorra Trucker Snapback Black', categoria: 'Gorras', precio: 32000, stock: 30, estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500' },
{ id: 'PRD-104', nombre: 'Hoodie Oversize Heavy Fleece', categoria: 'Hoodies', precio: 85000, stock: 12, estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500' },
{ id: 'PRD-105', nombre: 'Pantallón Jogger Cargo Tech', categoria: 'Pantalones', precio: 68000, stock: 5, estado: 'Disponible', imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500' }
];
function obtenerProductosAdmin() {
const prods = localStorage.getItem('prendas_admin_products');
if (!prods) {
localStorage.setItem('prendas_admin_products', JSON.stringify(PRODUCTOS_INICIALES_CATALOGO));
localStorage.setItem('prendas_catalog', JSON.stringify(PRODUCTOS_INICIALES_CATALOGO));
return PRODUCTOS_INICIALES_CATALOGO;
}
return JSON.parse(prods);
}
function guardarProductosAdmin(prods) {
localStorage.setItem('prendas_admin_products', JSON.stringify(prods));
localStorage.setItem('prendas_catalog', JSON.stringify(prods));
    renderizarVistaPreviaProductos();
    renderizarTablaProductos();
    actualizarMetricasKPI();
}
function configurarGestionProductos() {
renderizarVistaPreviaProductos();
renderizarTablaProductos();
    const btnNuevo = document.getElementById('btn-nuevo-producto');
    const btnQuickNuevo = document.getElementById('btn-quick-new-product');
    const modalProd = document.getElementById('modal-producto');
    const btnCloseModal = document.getElementById('btn-close-modal-prod');
    const btnCancelModal = document.getElementById('btn-cancel-prod-modal');
    const formModal = document.getElementById('form-producto-modal');

    const abrirModal = () => {
        document.getElementById('modal-prod-title').innerHTML = '<i class="fa-solid fa-shirt" style="color: var(--accent);"></i> Cargar / Editar Prenda';
        document.getElementById('prod-id-edit').value = '';
        document.getElementById('prod-imagen-base64').value = '';
        document.getElementById('image-preview-wrapper').style.display = 'none';
        formModal.reset();
        if (modalProd) modalProd.style.display = 'flex';
    };

    const cerrarModal = () => {
        if (modalProd) modalProd.style.display = 'none';
    };

    if (btnNuevo) btnNuevo.addEventListener('click', abrirModal);
    if (btnQuickNuevo) btnQuickNuevo.addEventListener('click', abrirModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', cerrarModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', cerrarModal);

    if (formModal) {
        formModal.addEventListener('submit', (e) => {
            e.preventDefault();
            const idEdit = document.getElementById('prod-id-edit').value;
            const nombre = document.getElementById('prod-nombre').value.trim();
            const categoria = document.getElementById('prod-categoria').value;
            const precio = parseFloat(document.getElementById('prod-precio').value) || 0;
            const stock = parseInt(document.getElementById('prod-stock').value, 10) || 0;
            const estado = document.getElementById('prod-estado').value;
            let imagenBase64 = document.getElementById('prod-imagen-base64').value;

            if (!imagenBase64) {
                if (categoria === 'Camisetas') imagenBase64 = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';
                else if (categoria === 'Shorts') imagenBase64 = 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500';
                else if (categoria === 'Gorras') imagenBase64 = 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500';
                else if (categoria === 'Hoodies') imagenBase64 = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500';
                else if (categoria === 'Pantalones') imagenBase64 = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500';
                else imagenBase64 = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500';
            }

            let prods = obtenerProductosAdmin();

            if (idEdit) {
                const idx = prods.findIndex(p => p.id === idEdit);
                if (idx !== -1) {
                    prods[idx] = { id: idEdit, nombre, categoria, precio, stock, estado, imagen: imagenBase64 };
                }
            } else {
                const nuevoId = 'PRD-' + Math.floor(1000 + Math.random() * 9000);
                prods.push({ id: nuevoId, nombre, categoria, precio, stock, estado, imagen: imagenBase64 });
            }

            guardarProductosAdmin(prods);
            cerrarModal();
        });
    }
}
function renderizarVistaPreviaProductos() {
const container = document.getElementById('products-preview-container');
if (!container) return;
    const prods = obtenerProductosAdmin();
    container.innerHTML = '';

    if (prods.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; color: #777; text-align: center; padding: 2rem;">No hay prendas en el catálogo. Haz clic en "Cargar Nueva Prenda".</div>`;
        return;
    }

    prods.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-preview-card';

        card.innerHTML = `
            <div class="product-preview-img-wrapper">
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'">
                <span style="position: absolute; top: 10px; right: 10px; background: rgba(10,10,10,0.8); color: #fff; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.72rem; font-weight: 800; border: 1px solid #333;">
                    Stock: ${item.stock}
                </span>
            </div>
            <div class="product-preview-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="product-preview-badge">${item.categoria}</span>
                    <span class="badge-status ${item.estado === 'Disponible' ? 'badge-success' : 'badge-danger'}">${item.estado}</span>
                </div>
                <h4 class="product-preview-title">${item.nombre}</h4>
                <div class="product-preview-meta">
                    <span style="color: #aaa; font-size: 0.78rem;">Precio Base:</span>
                    <span class="product-preview-price">$${item.precio.toLocaleString('es-CO')} COP</span>
                </div>
                <div class="product-preview-actions">
                    <button onclick="editarProducto('${item.id}')" class="btn-hero-secondary" style="flex: 1; padding: 0.4rem; font-size: 0.78rem; justify-content: center;">
                        <i class="fa-solid fa-pen"></i> Editar
                    </button>
                    <button onclick="eliminarProducto('${item.id}')" style="background: rgba(255, 51, 102, 0.15); color: var(--accent); border: 1px solid rgba(255, 51, 102, 0.3); padding: 0.4rem 0.6rem; border-radius: 8px; cursor: pointer;" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}
function renderizarTablaProductos() {
    const tbody = document.getElementById('table-body-productos');
    if (!tbody) return;
    const prods = obtenerProductosAdmin();
    tbody.innerHTML = '';

    prods.forEach(item => {
        const tr = document.createElement('tr');

        let badgeClass = 'badge-success';
        if (item.estado === 'Agotado' || item.stock === 0) badgeClass = 'badge-danger';
        else if (item.stock <= 10) badgeClass = 'badge-warning';

        tr.innerHTML = `
            <td style="font-weight: 800; color: var(--text-main);">${item.nombre}</td>
            <td><span style="color: var(--accent); font-size: 0.82rem; font-weight: 700;">${item.categoria}</span></td>
            <td style="font-weight: 700; color: #16a34a;">$${item.precio.toLocaleString('es-CO')} COP</td>
            <td style="font-weight: 800; color: var(--text-main);">${item.stock} un.</td>
            <td><span class="badge-status ${badgeClass}">${item.estado}</span></td>
            <td style="text-align: right;">
                <button onclick="editarProducto('${item.id}')" style="background: rgba(2, 132, 199, 0.1); color: var(--accent); border: 1px solid rgba(2, 132, 199, 0.3); padding: 0.35rem 0.65rem; border-radius: 8px; cursor: pointer; margin-right: 0.4rem;" title="Editar Prenda">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarProducto('${item.id}')" style="background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.35rem 0.65rem; border-radius: 8px; cursor: pointer;" title="Eliminar Prenda">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}
function editarProducto(id) {
const prods = obtenerProductosAdmin();
const prod = prods.find(p => p.id === id);
if (!prod) return;
    document.getElementById('modal-prod-title').innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: #00f2fe;"></i> Editar Prenda';
    document.getElementById('prod-id-edit').value = prod.id;
    document.getElementById('prod-nombre').value = prod.nombre;
    document.getElementById('prod-categoria').value = prod.categoria;
    document.getElementById('prod-precio').value = prod.precio;
    document.getElementById('prod-stock').value = prod.stock;
    document.getElementById('prod-estado').value = prod.estado;
    document.getElementById('prod-imagen-base64').value = prod.imagen || '';

    if (prod.imagen) {
        document.getElementById('image-preview-el').src = prod.imagen;
        document.getElementById('image-preview-wrapper').style.display = 'flex';
    } else {
        document.getElementById('image-preview-wrapper').style.display = 'none';
    }

    const modalProd = document.getElementById('modal-producto');
    if (modalProd) modalProd.style.display = 'flex';
}
function eliminarProducto(id) {
if (confirm(`🗑️ ¿Está seguro de eliminar esta prenda del catálogo?`)) {
let prods = obtenerProductosAdmin();
prods = prods.filter(p => p.id !== id);
guardarProductosAdmin(prods);
}
}
const PEDIDOS_MOCK_INICIALES = [
{ orden: 'PS-849201', cliente: 'Camilo Gómez', contacto: '3001234567', detalle: '2x Camiseta Oversize + Estampado DTF', total: 128000, estado: 'En proceso' },
{ orden: 'PS-192840', cliente: 'María López', contacto: '3128889900', detalle: '1x Hoodie Heavy Fleece', total: 85000, estado: 'Cotización' },
{ orden: 'PS-338291', cliente: 'Diego Lemus', contacto: '3157774411', detalle: '3x Gorra Trucker Snapback', total: 96000, estado: 'Vendido' },
{ orden: 'PS-449102', cliente: 'Laura Restrepo', contacto: '3189990011', detalle: '2x Short Deportivo Streetwear', total: 76000, estado: 'Entregado' },
{ orden: 'PS-551029', cliente: 'Santiago Pérez', contacto: '3012223344', detalle: '1x Jogger Cargo + Estampado Vinilo', total: 83000, estado: 'Finalizado' }
];
function obtenerPedidosAdmin() {
const pedsAdmin = localStorage.getItem('prendas_admin_orders');
const pedsCart = localStorage.getItem('prendas_cart_orders');
    let combinados = [];

    if (pedsCart) {
        try { combinados = combinados.concat(JSON.parse(pedsCart)); } catch(e){}
    }

    if (pedsAdmin) {
        try {
            const adminParsed = JSON.parse(pedsAdmin);
            adminParsed.forEach(p => {
                if (!combinados.some(c => c.orden === p.orden)) {
                    combinados.push(p);
                }
            });
        } catch(e){}
    } else if (combinados.length === 0) {
        localStorage.setItem('prendas_admin_orders', JSON.stringify(PEDIDOS_MOCK_INICIALES));
        return PEDIDOS_MOCK_INICIALES;
    }

    return combinados;
}
let filtroPedidoActual = 'todos';
let busquedaPedidoActual = '';

function configurarGestionPedidos() {
    renderizarTablaPedidos();
    const btnExportar = document.getElementById('btn-exportar-pedidos');
    const btnVaciar = document.getElementById('btn-quick-clear-orders');

    if (btnExportar) {
        btnExportar.addEventListener('click', exportarPedidosCSV);
    }

    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (confirm('🗑️ ¿Desea vaciar el historial completo de pedidos registrados?')) {
                localStorage.setItem('prendas_admin_orders', JSON.stringify([]));
                localStorage.setItem('prendas_cart_orders', JSON.stringify([]));
                renderizarTablaPedidos();
                actualizarMetricasKPI();
            }
        });
    }
}

function configurarFiltrosPedidos() {
    const chips = document.querySelectorAll('#pedidos-filter-chips .filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filtroPedidoActual = chip.getAttribute('data-filter') || 'todos';
            renderizarTablaPedidos();
        });
    });

    const searchInput = document.getElementById('input-buscar-pedidos');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            busquedaPedidoActual = e.target.value.toLowerCase().trim();
            renderizarTablaPedidos();
        });
    }

    const btnExportarPdf = document.getElementById('btn-exportar-pedidos-pdf');
    if (btnExportarPdf) {
        btnExportarPdf.addEventListener('click', exportarPedidosPDF);
    }
}

function renderizarTablaPedidos() {
    const tbody = document.getElementById('table-body-pedidos');
    if (!tbody) return;

    const peds = obtenerPedidosAdmin();

    // Actualizar contadores de las etiquetas de filtro
    const totalTodos = peds.length;
    const totalCot = peds.filter(p => p.estado === 'Cotización').length;
    const totalProc = peds.filter(p => p.estado === 'En proceso').length;
    const totalVen = peds.filter(p => p.estado === 'Vendido').length;
    const totalEnt = peds.filter(p => p.estado === 'Entregado' || p.estado === 'Finalizado').length;

    const elChipTodos = document.getElementById('count-chip-todos');
    const elChipCot = document.getElementById('count-chip-cotizacion');
    const elChipProc = document.getElementById('count-chip-proceso');
    const elChipVen = document.getElementById('count-chip-vendido');
    const elChipEnt = document.getElementById('count-chip-entregado');
    const elBadgeTab = document.getElementById('badge-pedidos-count');

    if (elChipTodos) elChipTodos.textContent = totalTodos.toString();
    if (elChipCot) elChipCot.textContent = totalCot.toString();
    if (elChipProc) elChipProc.textContent = totalProc.toString();
    if (elChipVen) elChipVen.textContent = totalVen.toString();
    if (elChipEnt) elChipEnt.textContent = totalEnt.toString();
    if (elBadgeTab) elBadgeTab.textContent = totalTodos.toString();

    // Filtrar pedidos según estado y búsqueda
    let filtrados = peds;
    if (filtroPedidoActual === 'Entregado') {
        filtrados = filtrados.filter(p => p.estado === 'Entregado' || p.estado === 'Finalizado');
    } else if (filtroPedidoActual !== 'todos') {
        filtrados = filtrados.filter(p => p.estado === filtroPedidoActual);
    }

    if (busquedaPedidoActual) {
        filtrados = filtrados.filter(p => 
            (p.orden && p.orden.toLowerCase().includes(busquedaPedidoActual)) ||
            (p.cliente && p.cliente.toLowerCase().includes(busquedaPedidoActual)) ||
            (p.contacto && p.contacto.toLowerCase().includes(busquedaPedidoActual)) ||
            (p.detalle && p.detalle.toLowerCase().includes(busquedaPedidoActual))
        );
    }

    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
            <i class="fa-solid fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.5;"></i>
            No se encontraron pedidos con los criterios seleccionados.
        </td></tr>`;
        return;
    }

    filtrados.forEach(item => {
        const tr = document.createElement('tr');

        let badgeClass = 'badge-info';
        if (item.estado === 'Cotización') badgeClass = 'badge-warning';
        else if (item.estado === 'En proceso') badgeClass = 'badge-info';
        else if (item.estado === 'Vendido') badgeClass = 'badge-purple';
        else if (item.estado === 'Entregado') badgeClass = 'badge-success';
        else if (item.estado === 'Finalizado') badgeClass = 'badge-success';

        const numLimpio = String(item.contacto || '').replace(/\D/g, '');

        tr.innerHTML = `
            <td style="font-weight: 800; color: var(--accent);">
                <i class="fa-solid fa-receipt" style="margin-right: 0.3rem;"></i>${item.orden}
            </td>
            <td style="font-weight: 800; color: var(--text-main);">${item.cliente}</td>
            <td>
                <a href="https://wa.me/57${numLimpio}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;" title="Chatear en WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i> ${item.contacto}
                </a>
            </td>
            <td style="color: var(--text-secondary); font-size: 0.85rem; max-width: 250px;">${item.detalle}</td>
            <td style="font-weight: 800; color: var(--text-main);">$${(item.total || 0).toLocaleString('es-CO')} COP</td>
            <td><span class="badge-status ${badgeClass}">${item.estado}</span></td>
            <td style="text-align: right; white-space: nowrap;">
                <button onclick="verDetallePedido('${item.orden}')" style="background: rgba(2, 132, 199, 0.1); color: var(--accent); border: 1px solid rgba(2, 132, 199, 0.3); padding: 0.35rem 0.65rem; border-radius: 8px; cursor: pointer; margin-right: 0.3rem;" title="Ver Detalle de la Orden">
                    <i class="fa-solid fa-eye"></i> Detalle
                </button>
                <button onclick="cambiarEstadoPedido('${item.orden}')" style="background: rgba(251, 197, 49, 0.12); color: #b45309; border: 1px solid rgba(251, 197, 49, 0.4); padding: 0.35rem 0.65rem; border-radius: 8px; cursor: pointer; margin-right: 0.3rem;" title="Avanzar Estado">
                    <i class="fa-solid fa-arrows-rotate"></i> Estado
                </button>
                <button onclick="eliminarPedido('${item.orden}')" style="background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.35rem 0.65rem; border-radius: 8px; cursor: pointer;" title="Eliminar Pedido">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function cambiarEstadoPedido(ordenNum) {
    let peds = obtenerPedidosAdmin();
    const idx = peds.findIndex(p => p.orden === ordenNum);
    if (idx !== -1) {
        const estados = ['Cotización', 'En proceso', 'Vendido', 'Entregado', 'Finalizado'];
        const actualIdx = estados.indexOf(peds[idx].estado);
        const sigIdx = (actualIdx + 1) % estados.length;
        peds[idx].estado = estados[sigIdx];
        localStorage.setItem('prendas_admin_orders', JSON.stringify(peds));
        renderizarTablaPedidos();
        actualizarMetricasKPI();
    }
}

function eliminarPedido(ordenNum) {
    if (confirm(`🗑️ ¿Está seguro de eliminar el pedido ${ordenNum}?`)) {
        let peds = obtenerPedidosAdmin();
        peds = peds.filter(p => p.orden !== ordenNum);
        localStorage.setItem('prendas_admin_orders', JSON.stringify(peds));
        renderizarTablaPedidos();
        actualizarMetricasKPI();
    }
}

function verDetallePedido(ordenNum) {
    const peds = obtenerPedidosAdmin();
    const pedido = peds.find(p => p.orden === ordenNum);
    if (!pedido) return;

    const modal = document.getElementById('modal-detalle-pedido');
    const body = document.getElementById('modal-detalle-body');
    if (!modal || !body) return;

    const numLimpio = String(pedido.contacto || '').replace(/\D/g, '');

    body.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.2rem; margin-bottom: 1.2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 1.1rem; font-weight: 900; color: var(--accent);">N° Orden: ${pedido.orden}</span>
                <span class="badge-status ${pedido.estado === 'Cotización' ? 'badge-warning' : (pedido.estado === 'Vendido' ? 'badge-purple' : 'badge-success')}">${pedido.estado}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.88rem;">
                <div><strong style="color: var(--text-main);">Cliente:</strong> <span style="color: var(--text-secondary);">${pedido.cliente}</span></div>
                <div><strong style="color: var(--text-main);">Contacto:</strong> 
                    <a href="https://wa.me/57${numLimpio}" target="_blank" rel="noopener noreferrer" style="color: #16a34a; font-weight: 700; text-decoration: none;">
                        <i class="fa-brands fa-whatsapp"></i> ${pedido.contacto}
                    </a>
                </div>
                <div><strong style="color: var(--text-main);">Fecha de Registro:</strong> <span style="color: var(--text-secondary);">${pedido.fecha || 'Reciente'}</span></div>
                <div><strong style="color: var(--text-main);">Total Pedido:</strong> <span style="color: var(--accent); font-weight: 800;">$${(pedido.total || 0).toLocaleString('es-CO')} COP</span></div>
            </div>
        </div>

        <div style="margin-bottom: 1.2rem;">
            <h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 800; margin-bottom: 0.5rem;">
                <i class="fa-solid fa-list-check" style="color: var(--accent);"></i> Ítems / Especificación del Pedido:
            </h4>
            <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
                ${pedido.detalle}
            </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem; background: #f8fafc; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid var(--border-color);">
            <label style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">Actualizar Estado:</label>
            <select id="select-modal-estado" class="form-control-enhanced" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.88rem;">
                <option value="Cotización" ${pedido.estado === 'Cotización' ? 'selected' : ''}>Cotización</option>
                <option value="En proceso" ${pedido.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                <option value="Vendido" ${pedido.estado === 'Vendido' ? 'selected' : ''}>Vendido</option>
                <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                <option value="Finalizado" ${pedido.estado === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
            </select>
        </div>
    `;

    const selectEstado = document.getElementById('select-modal-estado');
    if (selectEstado) {
        selectEstado.addEventListener('change', (e) => {
            const nuevoEstado = e.target.value;
            let listaPeds = obtenerPedidosAdmin();
            const pIdx = listaPeds.findIndex(p => p.orden === ordenNum);
            if (pIdx !== -1) {
                listaPeds[pIdx].estado = nuevoEstado;
                localStorage.setItem('prendas_admin_orders', JSON.stringify(listaPeds));
                renderizarTablaPedidos();
                actualizarMetricasKPI();
                modal.style.display = 'none';
            }
        });
    }

    modal.style.display = 'flex';
}

function configurarVentanaInventarioMetricas() {
    const btnAbrir = document.getElementById('btn-ver-inventario-metricas');
    const modalInv = document.getElementById('modal-inventario-metricas');
    const btnCerrar = document.getElementById('btn-close-modal-inventario');
    const btnImprimir = document.getElementById('btn-imprimir-inventario');
    const btnExportarPdf = document.getElementById('btn-exportar-inventario-pdf');

    const modalDetalle = document.getElementById('modal-detalle-pedido');
    const btnCloseDetalle = document.getElementById('btn-close-modal-detalle');
    const btnCerrarDetalleAccion = document.getElementById('btn-cerrar-modal-detalle-btn');

    if (btnAbrir && modalInv) {
        btnAbrir.addEventListener('click', () => {
            renderizarModalInventario();
            modalInv.style.display = 'flex';
        });
    }

    if (btnCerrar && modalInv) {
        btnCerrar.addEventListener('click', () => modalInv.style.display = 'none');
    }

    if (btnImprimir) {
        btnImprimir.addEventListener('click', () => window.print());
    }

    if (btnExportarPdf) {
        btnExportarPdf.addEventListener('click', exportarInventarioPDF);
    }

    if (btnCloseDetalle && modalDetalle) {
        btnCloseDetalle.addEventListener('click', () => modalDetalle.style.display = 'none');
    }

    if (btnCerrarDetalleAccion && modalDetalle) {
        btnCerrarDetalleAccion.addEventListener('click', () => modalDetalle.style.display = 'none');
    }
}

function renderizarModalInventario() {
    const prods = obtenerProductosAdmin();
    const peds = obtenerPedidosAdmin();

    const totalPrendas = prods.length;
    const totalStock = prods.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalValorizado = prods.reduce((acc, p) => acc + ((p.precio || 0) * (p.stock || 0)), 0);
    const totalAlertas = prods.filter(p => (p.stock || 0) <= 10).length;
    const totalVentas = peds.reduce((acc, p) => acc + (p.total || 0), 0);
    const totalOrdenes = peds.length;

    const elPrendas = document.getElementById('inv-kpi-prendas');
    const elStock = document.getElementById('inv-kpi-stock');
    const elValor = document.getElementById('inv-kpi-valor');
    const elAlertas = document.getElementById('inv-kpi-alertas');
    const elVentas = document.getElementById('inv-kpi-ventas');
    const elOrdenes = document.getElementById('inv-kpi-ordenes');
    const elTimestamp = document.getElementById('inv-timestamp');

    if (elPrendas) elPrendas.textContent = totalPrendas.toString();
    if (elStock) elStock.textContent = `${totalStock} un.`;
    if (elValor) elValor.textContent = `$${totalValorizado.toLocaleString('es-CO')}`;
    if (elAlertas) elAlertas.textContent = totalAlertas.toString();
    if (elVentas) elVentas.textContent = `$${totalVentas.toLocaleString('es-CO')}`;
    if (elOrdenes) elOrdenes.textContent = totalOrdenes.toString();
    if (elTimestamp) elTimestamp.textContent = `Sincronizado: ${new Date().toLocaleString('es-CO')}`;

    const tbody = document.getElementById('table-body-inventario-modal');
    if (!tbody) return;

    tbody.innerHTML = '';
    prods.forEach(item => {
        const tr = document.createElement('tr');
        const valorFila = (item.precio || 0) * (item.stock || 0);

        let badgeClass = 'badge-success';
        if (item.estado === 'Agotado' || item.stock === 0) badgeClass = 'badge-danger';
        else if (item.stock <= 10) badgeClass = 'badge-warning';

        tr.innerHTML = `
            <td style="font-weight: 800; color: var(--accent);">${item.id}</td>
            <td style="font-weight: 800; color: var(--text-main);">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color);" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'">
                    <span>${item.nombre}</span>
                </div>
            </td>
            <td><span style="color: var(--accent); font-weight: 700;">${item.categoria}</span></td>
            <td style="color: var(--text-main); font-weight: 600;">$${(item.precio || 0).toLocaleString('es-CO')}</td>
            <td style="font-weight: 800; color: var(--text-main);">${item.stock} un.</td>
            <td style="font-weight: 800; color: #16a34a;">$${valorFila.toLocaleString('es-CO')} COP</td>
            <td><span class="badge-status ${badgeClass}">${item.estado}</span></td>
        `;

        tbody.appendChild(tr);
    });
}

function exportarInventarioPDF() {
    if (!window.jspdf) {
        alert('❌ Error: La librería jsPDF no está disponible. Verifique su conexión.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const prods = obtenerProductosAdmin();
    const peds = obtenerPedidosAdmin();

    const totalStock = prods.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalValor = prods.reduce((acc, p) => acc + ((p.precio || 0) * (p.stock || 0)), 0);
    const totalVentas = peds.reduce((acc, p) => acc + (p.total || 0), 0);

    const now = new Date();
    const fechaHora = now.toLocaleString('es-CO');

    // Header Banner
    doc.setFillColor(15, 23, 42); // slate dark
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PRENDAS & STYLOS", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Informe Oficial de Control de Inventario & Métricas Sincronizadas", 14, 26);

    doc.setTextColor(2, 132, 199);
    doc.setFontSize(9);
    doc.text(`Generado: ${fechaHora}`, 130, 18);
    doc.text(`Usuario: Administrador Activo`, 130, 25);

    // Resumen Ejecutivo KPIs
    let y = 42;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 24, 3, 3, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("RESUMEN EJECUTIVO DE OPERACIÓN:", 18, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`• Total de Prendas: ${prods.length} referencias`, 18, y + 15);
    doc.text(`• Unidades en Bodega: ${totalStock} un.`, 75, y + 15);
    doc.text(`• Valorización de Inventario: $${totalValor.toLocaleString('es-CO')} COP`, 125, y + 15);
    doc.text(`• Ventas Totales Registradas: $${totalVentas.toLocaleString('es-CO')} COP`, 18, y + 21);
    doc.text(`• Total Órdenes Registradas: ${peds.length} pedidos`, 125, y + 21);

    // Encabezado Tabla Inventario
    y += 32;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(2, 132, 199);
    doc.text("DETALLE GENERAL DE EXISTENCIAS EN BODEGA", 14, y);

    y += 5;
    doc.setFillColor(2, 132, 199);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Código", 16, y + 5);
    doc.text("Prenda", 38, y + 5);
    doc.text("Categoría", 95, y + 5);
    doc.text("Precio Unit.", 125, y + 5);
    doc.text("Stock", 152, y + 5);
    doc.text("Subtotal Valorizado", 166, y + 5);

    y += 11;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    prods.forEach((item, idx) => {
        if (y > 275) {
            doc.addPage();
            y = 20;
        }

        const subtotalFila = (item.precio || 0) * (item.stock || 0);

        if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y - 4, 182, 7, 'F');
        }

        doc.text(String(item.id || ''), 16, y);
        doc.text(String(item.nombre || '').substring(0, 32), 38, y);
        doc.text(String(item.categoria || ''), 95, y);
        doc.text(`$${(item.precio || 0).toLocaleString('es-CO')}`, 125, y);
        doc.text(`${item.stock} un.`, 152, y);
        doc.text(`$${subtotalFila.toLocaleString('es-CO')}`, 166, y);

        y += 7;
    });

    // Total final
    y += 4;
    doc.setDrawColor(2, 132, 199);
    doc.line(14, y, 196, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(2, 132, 199);
    doc.text(`TOTAL INVENTARIO VALORIZADO: $${totalValor.toLocaleString('es-CO')} COP`, 90, y);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Prendas & Stylos — Sistema Administrativo B2C | Documento Oficial de Auditoría de Inventario", 14, 287);

    setTimeout(() => {
        doc.save(`Inventario_PrendasStylos_${now.toISOString().slice(0, 10)}.pdf`);
    }, 100);
}

function exportarPedidosPDF() {
    if (!window.jspdf) {
        alert('❌ Error: La librería jsPDF no está disponible. Verifique su conexión.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const peds = obtenerPedidosAdmin();

    const now = new Date();
    const fechaHora = now.toLocaleString('es-CO');
    const totalVentas = peds.reduce((acc, p) => acc + (p.total || 0), 0);

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PRENDAS & STYLOS", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Reporte Oficial de Pedidos Recibidos y Ventas", 14, 26);

    doc.setTextColor(2, 132, 199);
    doc.setFontSize(9);
    doc.text(`Generado: ${fechaHora}`, 130, 18);
    doc.text(`Total Órdenes: ${peds.length}`, 130, 25);

    let y = 42;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 16, 3, 3, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`TOTAL RECAUDADO EN ÓRDENES: $${totalVentas.toLocaleString('es-CO')} COP`, 18, y + 10);

    y += 24;
    doc.setFillColor(2, 132, 199);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Orden #", 16, y + 5);
    doc.text("Cliente", 42, y + 5);
    doc.text("Contacto", 80, y + 5);
    doc.text("Detalle", 112, y + 5);
    doc.text("Total COP", 158, y + 5);
    doc.text("Estado", 182, y + 5);

    y += 11;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    peds.forEach((item, idx) => {
        if (y > 275) {
            doc.addPage();
            y = 20;
        }

        if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y - 4, 182, 7, 'F');
        }

        doc.text(String(item.orden || ''), 16, y);
        doc.text(String(item.cliente || '').substring(0, 18), 42, y);
        doc.text(String(item.contacto || ''), 80, y);
        doc.text(String(item.detalle || '').substring(0, 24), 112, y);
        doc.text(`$${(item.total || 0).toLocaleString('es-CO')}`, 158, y);
        doc.text(String(item.estado || ''), 182, y);

        y += 7;
    });

    setTimeout(() => {
        doc.save(`Reporte_Pedidos_PrendasStylos_${now.toISOString().slice(0, 10)}.pdf`);
    }, 100);
}

function exportarPedidosCSV() {
    const peds = obtenerPedidosAdmin();
    if (peds.length === 0) {
        alert('⚠️ No hay pedidos registrados para exportar.');
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,Orden,Cliente,Contacto,Detalle,Total_COP,Estado\n";
    peds.forEach(p => {
        csvContent += `${p.orden},"${p.cliente}",${p.contacto},"${p.detalle}",${p.total},${p.estado}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Pedidos_PrendasStylos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function actualizarMetricasKPI() {
    const prods = obtenerProductosAdmin();
    const peds = obtenerPedidosAdmin();

    const elVentas = document.getElementById('kpi-ventas');
    const elPedidos = document.getElementById('kpi-pedidos');
    const elItems = document.getElementById('kpi-items');
    const elStockBajo = document.getElementById('kpi-stock-bajo');

    const totalVentas = peds.reduce((acc, p) => acc + (p.total || 0), 0);
    const stockBajoCount = prods.filter(p => (p.stock || 0) <= 10).length;

    if (elVentas) elVentas.textContent = `$${totalVentas.toLocaleString('es-CO')}`;
    if (elPedidos) elPedidos.textContent = `${peds.length} Órdenes`;
    if (elItems) elItems.textContent = `${prods.length} Prendas`;
    if (elStockBajo) {
        elStockBajo.textContent = `${stockBajoCount} ${stockBajoCount === 1 ? 'Alerta' : 'Alertas'}`;
        elStockBajo.style.color = stockBajoCount > 0 ? '#dc2626' : '#16a34a';
    }
}