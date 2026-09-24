/* ============================================================================
   KENOU CAMISETAS - LÓGICA DE MENÚ Y CATÁLOGO GLOBAL
   Archivo: js/menu_catalogo.js
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    inyectarEstilosMenuDrawer();
    asegurarEstructuraMenuDrawerHTML();
    inicializarMenuDrawer();
    asegurarModalTallasHTML();
    inicializarModalTallas();
    actualizarContadorCarritoGlobal();
    verificarIndicadorAdminGlobal();
    configurarEnlacesAdminPestanaIndependiente();
});

/**
 * Inyecta los estilos CSS globales para el menú lateral (Nav Drawer), 
 * el overlay, el footer estructurado y la etiqueta de admin.
 */
function inyectarEstilosMenuDrawer() {
    if (document.getElementById('menu-drawer-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'menu-drawer-styles';
    styleEl.textContent = `
        /* OVERLAY OSCURO DE FONDO */
        .nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(6px);
            z-index: 99998;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .nav-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* PANEL LATERAL DESPLEGABLE (NAV DRAWER) */
        .nav-drawer {
            position: fixed;
            top: 0;
            right: 0;
            width: 320px;
            max-width: 85vw;
            height: 100vh;
            background: #ffffff;
            border-left: 1px solid var(--border-color, #e2e8f0);
            box-shadow: -10px 0 35px rgba(15, 23, 42, 0.15);
            z-index: 99999; /* Máxima prioridad sobre cualquier otro elemento */
            display: flex;
            flex-direction: column;
            transform: translateX(100%); /* Oculto completamente a la derecha */
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
        }

        .nav-drawer.open {
            transform: translateX(0) !important; /* Visible al deslizarse */
            visibility: visible !important;
            pointer-events: auto !important;
        }

        /* CABECERA DEL DRAWER */
        .drawer-header {
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            background: #ffffff;
        }

        .drawer-title {
            font-size: 1.25rem;
            font-weight: 900;
            letter-spacing: 1px;
            color: var(--text-main, #0f172a);
            display: inline-block;
            white-space: nowrap;
        }

        .drawer-title span {
            color: var(--accent, #0284c7);
        }

        .close-drawer-btn {
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.3rem;
            transition: color 0.2s ease;
        }

        .close-drawer-btn:hover {
            color: var(--accent, #0284c7);
        }

        /* LISTA DE ENLACES DEL DRAWER */
        .drawer-links {
            list-style: none;
            padding: 1rem 0;
            margin: 0;
            display: flex;
            flex-direction: column;
        }

        .drawer-links li {
            width: 100%;
        }

        .drawer-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            color: #334155;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.95rem;
            transition: all 0.25s ease;
            border-left: 3px solid transparent;
        }

        .drawer-item:hover, .drawer-item.active {
            background: var(--accent-soft, rgba(2, 132, 199, 0.08));
            color: var(--accent, #0284c7);
            border-left-color: var(--accent, #0284c7);
        }

        .drawer-item i {
            width: 22px;
            text-align: center;
            color: var(--accent, #0284c7);
        }

        .drawer-admin-divider {
            border-top: 1px dashed var(--border-color, #e2e8f0);
            margin-top: 1rem;
            padding-top: 1rem;
        }

        .btn-admin-drawer {
            color: var(--accent, #0284c7) !important;
        }

        .btn-admin-drawer i {
            color: var(--accent, #0284c7) !important;
        }

        /* ETIQUETA GLOBAL DE ADMINISTRADOR AUTENTICADO */
        .admin-global-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            background: #ecfdf5;
            padding: 0.4rem 0.85rem;
            border-radius: 20px;
            border: 1px solid #a7f3d0;
            color: #065f46;
            font-size: 0.82rem;
            font-weight: 700;
        }

        .admin-global-badge a {
            color: var(--accent, #0284c7);
            text-decoration: none;
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            transition: transform 0.2s ease;
        }

        .admin-global-badge a:hover {
            transform: scale(1.1);
        }

        .btn-logout-global {
            background: transparent;
            border: none;
            color: #dc2626;
            cursor: pointer;
            padding: 0.2rem 0.4rem;
            font-size: 0.95rem;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            transition: opacity 0.2s ease;
        }

        .btn-logout-global:hover {
            opacity: 0.8;
        }

        /* FOOTER DE ACCESOS RÁPIDOS */
        .main-footer-enhanced {
            background: #0d0d0d;
            border-top: 1px solid #222;
            padding: 3.5rem 1.5rem 1.5rem 1.5rem;
            color: #aaa;
            margin-top: 4rem;
        }

        .footer-grid-container {
            max-width: 1250px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 2.5rem;
            margin-bottom: 2.5rem;
        }

        .footer-col h4 {
            color: #fff;
            font-size: 1.05rem;
            font-weight: 800;
            margin-bottom: 1.2rem;
            position: relative;
            padding-bottom: 0.5rem;
        }

        .footer-col h4::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 35px;
            height: 2px;
            background: var(--accent, #ff3366);
        }

        .footer-col p {
            font-size: 0.88rem;
            line-height: 1.6;
            color: #888;
        }

        .footer-links-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
        }

        .footer-links-list a {
            color: #aaa;
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.25s ease;
        }

        .footer-links-list a:hover {
            color: #fff;
            transform: translateX(4px);
        }

        .footer-links-list a i {
            color: #00f2fe;
            font-size: 0.8rem;
        }

        .footer-bottom-bar {
            max-width: 1250px;
            margin: 0 auto;
            border-top: 1px solid #1a1a1a;
            padding-top: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.82rem;
            color: #666;
        }
    `;

    document.head.appendChild(styleEl);
}

/**
 * Garantiza que la estructura HTML del menú desplegable y overlay exista en el DOM.
 * Si no está presente en la página actual, la construye e inyecta dinámicamente.
 */
function asegurarEstructuraMenuDrawerHTML() {
    // 1. Verificar e inyectar el Overlay
    let navOverlay = document.getElementById('nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        navOverlay.id = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    // 2. Verificar e inyectar el Drawer Panel
    let navDrawer = document.getElementById('nav-drawer');
    if (!navDrawer) {
        navDrawer = document.createElement('nav');
        navDrawer.className = 'nav-drawer';
        navDrawer.id = 'nav-drawer';
        navDrawer.setAttribute('aria-hidden', 'true');

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navDrawer.innerHTML = `
            <div class="drawer-header">
                <div class="drawer-brand">
                    <img src="logo.jpg" alt="Logo Kenou Camisetas" class="drawer-logo-img">
                    <span class="drawer-title">KENOU <span>CAMISETAS</span></span>
                </div>
                <button class="close-drawer-btn" id="close-drawer-btn" aria-label="Cerrar Menú">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <ul class="drawer-links">
                <li>
                    <a href="index.html" class="drawer-item ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">
                        <i class="fa-solid fa-house"></i> Principal
                    </a>
                </li>
                <li>
                    <a href="galeria.html" class="drawer-item ${currentPath === 'galeria.html' ? 'active' : ''}">
                        <i class="fa-solid fa-images"></i> Galería de Colección
                    </a>
                </li>
                <li>
                    <a href="cotizador.html" class="drawer-item ${currentPath === 'cotizador.html' ? 'active' : ''}">
                        <i class="fa-solid fa-calculator"></i> Cotizador Automático
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0)" class="drawer-item btn-open-size-guide">
                        <i class="fa-solid fa-ruler-combined"></i> Tabla de Tallas & Medidas
                    </a>
                </li>
                <li>
                    <a href="blog.html" class="drawer-item ${currentPath === 'blog.html' ? 'active' : ''}">
                        <i class="fa-solid fa-newspaper"></i> Blog & Cuidado
                    </a>
                </li>
                <li>
                    <a href="nosotros.html" class="drawer-item ${currentPath === 'nosotros.html' ? 'active' : ''}">
                        <i class="fa-solid fa-users"></i> Sobre Nosotros
                    </a>
                </li>
                <li>
                    <a href="contacto.html" class="drawer-item ${currentPath === 'contacto.html' ? 'active' : ''}">
                        <i class="fa-solid fa-envelope"></i> Contacto Directo
                    </a>
                </li>
                <li class="drawer-admin-divider">
                    <a href="admin.html" target="_blank" rel="noopener noreferrer" class="drawer-item btn-admin-drawer ${currentPath === 'admin.html' ? 'active' : ''}">
                        <i class="fa-solid fa-user-gear"></i> Panel de Administración
                    </a>
                </li>
            </ul>
        `;

        document.body.appendChild(navDrawer);
    }
}

/**
 * Inicializa los eventos de apertura y cierre del menú lateral (Nav Drawer).
 */
function inicializarMenuDrawer() {
    const hamburgerBtn = document.getElementById('hamburger-btn');

    // Selección dinámica diferida para asegurar la captura de elementos inyectados en tiempo de ejecución
    const abrirDrawer = (e) => {
        if (e) e.preventDefault();
        const navDrawer = document.getElementById('nav-drawer');
        const navOverlay = document.getElementById('nav-overlay');
        
        if (navDrawer) {
            navDrawer.classList.add('open', 'active');
            navDrawer.setAttribute('aria-hidden', 'false');
        }
        if (navOverlay) navOverlay.classList.add('active');
    };

    const cerrarDrawer = () => {
        const navDrawer = document.getElementById('nav-drawer');
        const navOverlay = document.getElementById('nav-overlay');
        
        if (navDrawer) {
            navDrawer.classList.remove('open', 'active');
            navDrawer.setAttribute('aria-hidden', 'true');
        }
        if (navOverlay) navOverlay.classList.remove('active');
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', abrirDrawer);
    }

    // Escucha segura tras la inyección dinámica del markup
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', cerrarDrawer);
    }

    const navOverlay = document.getElementById('nav-overlay');
    if (navOverlay) {
        navOverlay.addEventListener('click', cerrarDrawer);
    }
}

/**
 * Actualiza el contador badge del carrito de compras en tiempo real.
 */
function actualizarContadorCarritoGlobal() {
    const cartBadge = document.getElementById('cart-count');
    if (!cartBadge) return;

    const carrito = JSON.parse(localStorage.getItem('prendas_cart') || '[]');
    const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    cartBadge.textContent = totalItems.toString();
}

/**
 * Muestra el indicador global cuando el usuario está autenticado como Administrador.
 * Sincronizado mediante el token unificado 'adminAuth'.
 */
function verificarIndicadorAdminGlobal() {
    // Verificación de la clave de acceso persistente
    const isAdmin = localStorage.getItem('admin_logged_in') === 'true' || sessionStorage.getItem('admin_logged_in') === 'true';
    if (!isAdmin) return;

    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    // Evitar duplicar la etiqueta si ya existe en el árbol del DOM
    if (document.getElementById('admin-user-badge') || document.querySelector('.admin-global-badge')) return;

    const adminBadge = document.createElement('div');
    adminBadge.className = 'admin-global-badge';

    adminBadge.innerHTML = `
        <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); display: inline-block;"></span>
        <span>Admin Activo</span>
        <a href="admin.html" target="_blank" rel="noopener noreferrer" title="Ir al Panel de Administración">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <button id="btn-global-admin-logout" class="btn-logout-global" title="Cerrar Sesión de Administrador">
            <i class="fa-solid fa-power-off"></i>
        </button>
    `;

    headerActions.insertBefore(adminBadge, headerActions.firstChild);

    // Evento de Logout Global con destrucción limpia de sesión y redirección
    const btnLogout = document.getElementById('btn-global-admin-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('🔒 ¿Desea cerrar la sesión de Administrador y regresar a la página principal?')) {
                localStorage.removeItem('admin_logged_in');
                sessionStorage.removeItem('admin_logged_in');
                window.location.href = 'index.html';
            }
        });
    }
}

/**
 * Permite navegación entre el catálogo y el panel de administración conservando la sesión.
 */
function configurarEnlacesAdminPestanaIndependiente() {
    // Se mantiene la navegación estándar fluida sin aislar la sesión
}

/**
 * Garantiza la existencia del Modal interactivo de Tabla de Tallas y Medidas en el DOM.
 */
function asegurarModalTallasHTML() {
    if (document.getElementById('modal-tallas-medidas')) return;

    const modal = document.createElement('div');
    modal.id = 'modal-tallas-medidas';
    modal.className = 'modal-size-guide';
    modal.innerHTML = `
        <div class="modal-size-card" role="dialog" aria-labelledby="modal-size-title" aria-modal="true">
            <!-- CABECERA DEL MODAL -->
            <div class="modal-size-header">
                <div class="modal-size-title-group">
                    <h3 id="modal-size-title">
                        <i class="fa-solid fa-ruler-combined" style="color: var(--accent, #0284c7);"></i> Tabla de Tallas & Medidas Oficial
                    </h3>
                    <span>Medidas en centímetros (cm) para elegir el calce ideal en cada silueta textil</span>
                </div>
                <button type="button" class="btn-close-size-modal" id="btn-close-size-guide" aria-label="Cerrar Guía de Tallas">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- CUERPO DEL MODAL -->
            <div class="modal-size-body">
                <!-- TABS DE CATEGORÍAS -->
                <div class="size-tabs-bar" id="size-guide-tabs">
                    <button type="button" class="size-tab-pill active" data-tab="tab-size-oversize">
                        <i class="fa-solid fa-shirt"></i> Camisetas Oversize
                    </button>
                    <button type="button" class="size-tab-pill" data-tab="tab-size-clasica">
                        <i class="fa-solid fa-tshirt"></i> Camisetas Clásicas
                    </button>
                    <button type="button" class="size-tab-pill" data-tab="tab-size-hoodie">
                        <i class="fa-solid fa-vest"></i> Hoodies & Busos
                    </button>
                    <button type="button" class="size-tab-pill" data-tab="tab-size-shorts">
                        <i class="fa-solid fa-scissors"></i> Shorts Deportivos
                    </button>
                    <button type="button" class="size-tab-pill" data-tab="tab-size-gorras">
                        <i class="fa-solid fa-hat-cowboy"></i> Gorras & Accesorios
                    </button>
                </div>

                <!-- PANEL 1: CAMISETAS OVERSIZE -->
                <div class="size-tab-content-panel active" id="tab-size-oversize">
                    <div class="size-desc-box">
                        <i class="fa-solid fa-street-view"></i>
                        <div>
                            <strong>Corte Oversize Heavyweight (220g+):</strong> Silueta holgada con hombro caído (Drop Shoulder), cuello redondo reforzado de 3cm y tejido de máxima densidad que mantiene su estructura.
                        </div>
                    </div>

                    <div class="size-table-container">
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Talla</th>
                                    <th>Ancho Pecho (Plano)</th>
                                    <th>Contorno Pecho</th>
                                    <th>Largo Total</th>
                                    <th>Caída Manga</th>
                                    <th>Estatura Aprox.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="size-badge-tag">S</span></td>
                                    <td>54 cm</td>
                                    <td>108 cm</td>
                                    <td>72 cm</td>
                                    <td>22 cm</td>
                                    <td>1.60 - 1.70 m</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">M</span></td>
                                    <td>57 cm</td>
                                    <td>114 cm</td>
                                    <td>74 cm</td>
                                    <td>23 cm</td>
                                    <td>1.70 - 1.76 m</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">L</span></td>
                                    <td>60 cm</td>
                                    <td>120 cm</td>
                                    <td>77 cm</td>
                                    <td>24 cm</td>
                                    <td>1.76 - 1.83 m</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">XL</span></td>
                                    <td>63 cm</td>
                                    <td>126 cm</td>
                                    <td>80 cm</td>
                                    <td>25 cm</td>
                                    <td>1.83 - 1.90 m</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">XXL</span></td>
                                    <td>66 cm</td>
                                    <td>132 cm</td>
                                    <td>82 cm</td>
                                    <td>26 cm</td>
                                    <td>1.88 m o más</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PANEL 2: CAMISETAS CLÁSICAS -->
                <div class="size-tab-content-panel" id="tab-size-clasica">
                    <div class="size-desc-box">
                        <i class="fa-solid fa-circle-check"></i>
                        <div>
                            <strong>Corte Clásico / Regular Fit (180g):</strong> Silueta tradicional recta en algodón 100% peinado prelavado. Ideal para uso diario o corporativo con calce al cuerpo estándar.
                        </div>
                    </div>

                    <div class="size-table-container">
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Talla</th>
                                    <th>Ancho Pecho (Plano)</th>
                                    <th>Largo Total</th>
                                    <th>Ancho de Hombros</th>
                                    <th>Largo de Manga</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="size-badge-tag">S</span></td>
                                    <td>49 cm</td>
                                    <td>69 cm</td>
                                    <td>43 cm</td>
                                    <td>19 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">M</span></td>
                                    <td>52 cm</td>
                                    <td>71 cm</td>
                                    <td>46 cm</td>
                                    <td>20 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">L</span></td>
                                    <td>55 cm</td>
                                    <td>74 cm</td>
                                    <td>49 cm</td>
                                    <td>21 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">XL</span></td>
                                    <td>58 cm</td>
                                    <td>77 cm</td>
                                    <td>52 cm</td>
                                    <td>22 cm</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PANEL 3: HOODIES Y BUSOS -->
                <div class="size-tab-content-panel" id="tab-size-hoodie">
                    <div class="size-desc-box">
                        <i class="fa-solid fa-snowflake"></i>
                        <div>
                            <strong>Hoodies con Capota Heavy Fleece (280g+):</strong> Confección con felpa térmica interior perchada suave, bolsillo canguro reforzado y capota con doble tela para abrigo y comodidad urbana.
                        </div>
                    </div>

                    <div class="size-table-container">
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Talla</th>
                                    <th>Ancho Pecho</th>
                                    <th>Largo Total</th>
                                    <th>Manga (con puño)</th>
                                    <th>Hombro a Hombro</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="size-badge-tag">S</span></td>
                                    <td>56 cm</td>
                                    <td>68 cm</td>
                                    <td>62 cm</td>
                                    <td>50 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">M</span></td>
                                    <td>59 cm</td>
                                    <td>71 cm</td>
                                    <td>64 cm</td>
                                    <td>53 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">L</span></td>
                                    <td>62 cm</td>
                                    <td>74 cm</td>
                                    <td>66 cm</td>
                                    <td>56 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">XL</span></td>
                                    <td>65 cm</td>
                                    <td>77 cm</td>
                                    <td>68 cm</td>
                                    <td>59 cm</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PANEL 4: SHORTS DEPORTIVOS -->
                <div class="size-tab-content-panel" id="tab-size-shorts">
                    <div class="size-desc-box">
                        <i class="fa-solid fa-running"></i>
                        <div>
                            <strong>Shorts Streetwear & Deportivos:</strong> Cintura elástica acanalada con cordón ajustable de alta resistencia y tiro confortable sobre la rodilla.
                        </div>
                    </div>

                    <div class="size-table-container">
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Talla</th>
                                    <th>Equivalencia Jean (Col)</th>
                                    <th>Cintura (Elástica)</th>
                                    <th>Contorno Cadera</th>
                                    <th>Largo Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="size-badge-tag">S</span></td>
                                    <td>Talla 28 - 30</td>
                                    <td>72 - 80 cm</td>
                                    <td>102 cm</td>
                                    <td>42 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">M</span></td>
                                    <td>Talla 31 - 32</td>
                                    <td>78 - 86 cm</td>
                                    <td>108 cm</td>
                                    <td>44 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">L</span></td>
                                    <td>Talla 33 - 34</td>
                                    <td>84 - 92 cm</td>
                                    <td>114 cm</td>
                                    <td>46 cm</td>
                                </tr>
                                <tr>
                                    <td><span class="size-badge-tag">XL</span></td>
                                    <td>Talla 35 - 36</td>
                                    <td>90 - 98 cm</td>
                                    <td>120 cm</td>
                                    <td>48 cm</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- PANEL 5: GORRAS Y ACCESORIOS -->
                <div class="size-tab-content-panel" id="tab-size-gorras">
                    <div class="size-desc-box">
                        <i class="fa-solid fa-hat-wizard"></i>
                        <div>
                            <strong>Gorras Trucker, Snapback y Dad Caps:</strong> Diseño ergonómico de 5 y 6 paneles con visera semirrígida y broche trasero adaptable.
                        </div>
                    </div>

                    <div class="size-table-container">
                        <table class="size-table">
                            <thead>
                                <tr>
                                    <th>Referencia</th>
                                    <th>Calce / Ajuste</th>
                                    <th>Circunferencia Cabeza</th>
                                    <th>Profundidad Corona</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="size-badge-tag">Talla Única</span></td>
                                    <td>Regulable con broche Snapback</td>
                                    <td>54 cm a 60 cm (Ajustable)</td>
                                    <td>12 cm (Estructurada)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- SECCIÓN: CÓMO TOMARTE LAS MEDIDAS -->
                <div class="size-how-to-measure">
                    <h4><i class="fa-solid fa-tape" style="color: var(--accent, #0284c7);"></i> ¿Cómo tomar tus medidas correctamente en casa?</h4>
                    <div class="size-tips-grid">
                        <div class="size-tip-card">
                            <strong><i class="fa-solid fa-arrows-left-right"></i> 1. Pecho / Ancho Plano</strong>
                            <p>Toma tu camiseta favorita, extiéndela en una superficie plana y mide horizontalmente de axila a axila.</p>
                        </div>
                        <div class="size-tip-card">
                            <strong><i class="fa-solid fa-arrows-up-down"></i> 2. Largo Total</strong>
                            <p>Mide verticalmente desde la unión del hombro con el cuello hasta el borde inferior de la prenda.</p>
                        </div>
                        <div class="size-tip-card">
                            <strong><i class="fa-solid fa-circle-notch"></i> 3. Cintura & Cadera</strong>
                            <p>Rodea tu cintura con la cinta métrica en su parte más estrecha manteniendo la cinta relajada sin ajustar.</p>
                        </div>
                    </div>

                    <div class="size-alert-note">
                        <i class="fa-solid fa-lightbulb" style="font-size: 1.2rem; margin-top: 0.1rem;"></i>
                        <div>
                            <strong>Tip Kenou Camisetas:</strong> Las prendas confeccionadas en algodón pueden tener un margen de tolerancia artesanal de ±1 cm. Si buscas un ajuste holgado streetwear urbano, te recomendamos pedir tu talla habitual en corte Oversize o una talla superior en corte Regular.
                        </div>
                    </div>
                </div>
            </div>

            <!-- PIE DEL MODAL -->
            <div class="modal-size-footer">
                <a href="https://wa.me/573053905216?text=Hola%20Kenou%20Camisetas,%20necesito%20ayuda%20para%20elegir%20mi%20talla%20ideal" target="_blank" rel="noopener noreferrer" class="btn-hero-primary" style="padding: 0.6rem 1.2rem; font-size: 0.88rem; text-decoration: none;">
                    <i class="fa-brands fa-whatsapp"></i> ¿Dudas? Asesoría en WhatsApp
                </a>
                <button type="button" class="btn-hero-secondary" id="btn-close-size-guide-footer" style="padding: 0.6rem 1.2rem; font-size: 0.88rem;">
                    Entendido, Cerrar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Inicializa los eventos de apertura, cierre e interactividad de tabs de la Guía de Tallas.
 */
function inicializarModalTallas() {
    const modal = document.getElementById('modal-tallas-medidas');
    if (!modal) return;

    const btnCloseHeader = document.getElementById('btn-close-size-guide');
    const btnCloseFooter = document.getElementById('btn-close-size-guide-footer');

    const abrirModal = (e) => {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Si el drawer está abierto, cerrarlo suavemente
        const navDrawer = document.getElementById('nav-drawer');
        const navOverlay = document.getElementById('nav-overlay');
        if (navDrawer) navDrawer.classList.remove('open', 'active');
        if (navOverlay) navOverlay.classList.remove('active');
    };

    const cerrarModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Vincular todos los botones o enlaces que tengan la clase .btn-open-size-guide
    document.querySelectorAll('.btn-open-size-guide').forEach(btn => {
        btn.addEventListener('click', abrirModal);
    });

    if (btnCloseHeader) btnCloseHeader.addEventListener('click', cerrarModal);
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', cerrarModal);

    // Cerrar al hacer clic en el backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });

    // Pestañas de categorías dentro de la guía de tallas
    const tabs = modal.querySelectorAll('.size-tab-pill');
    const panels = modal.querySelectorAll('.size-tab-content-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}
