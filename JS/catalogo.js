/* ============================================================================
   KENOU CAMISETAS - LÓGICA DEL CATÁLOGO DINÁMICO (JS/catalogo.js)
   Sincronizado con inventario de Administrador y Carrito de Compras
   ============================================================================ */

const PRODUCTOS_INICIALES = [
  {
    id: "PRD-101",
    nombre: "Camiseta Manga Sisa Fresh Urban (Mujer)",
    categoria: "Camisetas",
    precio: 45000,
    stock: 25,
    estado: "Disponible",
    imagen: "img/manga_sisa_mujer.jpg",
  },
  {
    id: "PRD-102",
    nombre: "Camiseta Manga Sisa Urban Tribe (Hombre)",
    categoria: "Camisetas",
    precio: 45000,
    stock: 28,
    estado: "Disponible",
    imagen: "img/manga_sisa_hombre.jpg",
  },
  {
    id: "PRD-103",
    nombre: "Camiseta Manga Sisa Urban Rhythm (Adulto)",
    categoria: "Camisetas",
    precio: 48000,
    stock: 16,
    estado: "Disponible",
    imagen: "img/manga_sisa_adulto.jpg",
  },
  {
    id: "PRD-104",
    nombre: "Short Deportivo Fresh Streetwear",
    categoria: "Shorts",
    precio: 38000,
    stock: 18,
    estado: "Disponible",
    imagen: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500",
  },
  {
    id: "PRD-105",
    nombre: "Buso Oversize Heavy Fleece Street",
    categoria: "Busos",
    precio: 85000,
    stock: 12,
    estado: "Disponible",
    imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
  },
  {
    id: "PRD-106",
    nombre: "Gorra Trucker Snapback Black (En construcción - Próximamente)",
    categoria: "Gorras",
    precio: 32000,
    stock: 30,
    estado: "Disponible",
    imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
  },
  {
    id: "PRD-107",
    nombre: "Pantalón Jogger Cargo Tech (En construcción - Próximamente)",
    categoria: "Pantalones",
    precio: 68000,
    stock: 4,
    estado: "Últimas Unidades",
    imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
  },
];

let categoriaActualCatalogo = "todos";

document.addEventListener("DOMContentLoaded", () => {
  inicializarCatalogo();
  inicializarFiltrosCatalogo();
  inicializarModalZoomCatalogo();
  if (typeof actualizarContadorCarritoGlobal === "function") {
    actualizarContadorCarritoGlobal();
  }
});

// Escuchar cambios en LocalStorage por si el Administrador actualiza inventario en otra pestaña
window.addEventListener("storage", (e) => {
  if (e.key === "prendas_catalog" || e.key === "prendas_admin_products") {
    renderizarCatalogo(categoriaActualCatalogo);
  }
});

function obtenerProductosCatalogo() {
  let prods = JSON.parse(
    localStorage.getItem("prendas_catalog") ||
      localStorage.getItem("prendas_admin_products"),
  );
  // Auto-sincronizar si falta el catálogo actualizado de prendas manga sisa
  const tieneMangaSisa = prods && prods.some((p) => (p.nombre || "").toLowerCase().includes("manga sisa"));
  if (!prods || prods.length === 0 || !tieneMangaSisa) {
    prods = PRODUCTOS_INICIALES;
    localStorage.setItem(
      "prendas_catalog",
      JSON.stringify(PRODUCTOS_INICIALES),
    );
    localStorage.setItem(
      "prendas_admin_products",
      JSON.stringify(PRODUCTOS_INICIALES),
    );
  }
  return prods;
}

function inicializarCatalogo() {
  renderizarCatalogo(categoriaActualCatalogo);
}

function renderizarCatalogo(categoria = "todos") {
  categoriaActualCatalogo = categoria;
  const grid =
    document.getElementById("catalog-grid-container") ||
    document.getElementById("product-grid");
  if (!grid) return;

  const activeProducts = obtenerProductosCatalogo();
  grid.innerHTML = "";

  // Filtrar prendas activas y por categoría seleccionada
  const productosFiltrados = activeProducts.filter((p) => {
    const estado = (p.estado || "Disponible").toLowerCase();
    if (estado !== "disponible" && estado !== "activo" && estado !== "últimas unidades" && estado !== "ultimas unidades" && estado !== "agotado") return false;

    if (categoria === "todos") return true;
    const catPrenda = (p.categoria || p.material || "").toLowerCase();
    const catFiltro = categoria.toLowerCase();
    if (catFiltro === "busos" && (catPrenda === "busos" || catPrenda === "hoodies")) return true;
    if ((catFiltro === "pantalones" || catFiltro === "joggers") && (catPrenda === "pantalones" || catPrenda === "joggers")) return true;
    return catPrenda === catFiltro;
  });

  if (productosFiltrados.length === 0) {
    grid.innerHTML = `
            <div class="catalog-empty-state">
                <i class="fa-solid fa-shirt"></i>
                <h3>No hay prendas disponibles</h3>
                <p>Actualmente no hay artículos disponibles en esta categoría.</p>
            </div>
        `;
    return;
  }

  productosFiltrados.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const imgUrl =
      p.imagen ||
      p.image ||
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500";
    const nombre = p.nombre || p.name || "Prenda Exclusiva";
    const categoriaNombre = p.categoria || p.material || "Moda Urbana";
    const precio = Number(p.precio || p.price || 0);
    const stock = p.stock !== undefined ? p.stock : 20;
    const esUltimas = stock <= 0 || (p.estado || "").toLowerCase() === "agotado" || (p.estado || "").toLowerCase() === "últimas unidades" || (p.estado || "").toLowerCase() === "ultimas unidades";
    const stockTexto = esUltimas ? "Últimas Unidades" : `Stock: ${stock}`;

    card.innerHTML = `
            <div class="product-image-container" onclick="abrirModalZoomProducto('${p.id}')" title="Haz clic para ver y ampliar la imagen">
                <img src="${imgUrl}" 
                     alt="${nombre}" 
                     class="product-image" 
                     loading="lazy" 
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';">
                <div class="product-card-badges">
                    <span class="product-badge-category">${categoriaNombre}</span>
                    <span class="product-badge-status ${esUltimas ? "status-warning" : "status-available"}">${stockTexto}</span>
                </div>
                <div class="product-zoom-hint">
                    <span class="product-zoom-hint-badge">
                        <i class="fa-solid fa-magnifying-glass-plus"></i> Clic para ampliar
                    </span>
                </div>
            </div>
            <div class="product-info"> 
                <h4 class="product-title" title="${nombre}">${nombre}</h4> 
                <div class="product-price-row">
                    <span class="product-price">$${precio.toLocaleString("es-CO")} <span style="font-size: 0.8rem; color: #888; font-weight: 600;">COP</span></span>
                </div>
                <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${p.id}')">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div> 
        `;
    grid.appendChild(card);
  });
}

function inicializarFiltrosCatalogo() {
  const filterBtns = document.querySelectorAll(".catalog-filter-btn");
  if (!filterBtns || filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-category") || "todos";
      renderizarCatalogo(cat);
    });
  });
}

window.addToCart = function (productId) {
  const activeProducts = obtenerProductosCatalogo();
  const product = activeProducts.find((p) => p.id == productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("prendas_cart")) || [];
  const existingIndex = cart.findIndex((item) => item.id == product.id);

  if (existingIndex > -1) {
    cart[existingIndex].cantidad += 1;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre || product.name,
      categoria: product.categoria || product.material || "Prenda",
      precio: product.precio || product.price,
      imagen: product.imagen || product.image,
      cantidad: 1,
    });
  }

  localStorage.setItem("prendas_cart", JSON.stringify(cart));

  if (typeof actualizarContadorCarritoGlobal === "function") {
    actualizarContadorCarritoGlobal();
  }

  alert(`¡${product.nombre || product.name} ha sido añadido al carrito!`);
};

/* ============================================================================
   LÓGICA DEL MODAL DE ZOOM EMERGENTE (LUPA Y VISTA PREVIA DETALLADA)
   ============================================================================ */
let zoomActual = 1.0;
let productoSeleccionadoZoom = null;

function inicializarModalZoomCatalogo() {
  let modalOverlay = document.getElementById("product-zoom-modal-overlay");
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "product-zoom-modal-overlay";
    modalOverlay.className = "product-zoom-overlay";
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOverlay.innerHTML = `
      <div class="product-zoom-dialog" role="dialog" aria-modal="true" aria-labelledby="zoom-product-title">
        <div class="product-zoom-header">
          <div class="product-zoom-title-group">
            <span class="product-zoom-category-tag" id="zoom-product-category">Camisetas</span>
            <h3 class="product-zoom-title" id="zoom-product-title">Prenda</h3>
          </div>
          <div class="product-zoom-controls">
            <button type="button" class="btn-zoom-action" id="btn-zoom-out" title="Alejar (-)">
              <i class="fa-solid fa-minus"></i>
            </button>
            <button type="button" class="btn-zoom-action" id="btn-zoom-reset" title="Restablecer escala (1x)" style="font-weight: 800; font-size: 0.82rem;">
              1x
            </button>
            <button type="button" class="btn-zoom-action" id="btn-zoom-in" title="Acercar (+)">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button type="button" class="btn-zoom-action btn-zoom-close" id="btn-zoom-close" title="Cerrar ventana (Esc)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div class="product-zoom-stage" id="zoom-stage" title="Haz clic o mueve el cursor para explorar con zoom">
          <img id="zoom-modal-img" src="" alt="Vista previa detallada" class="product-zoom-img">
          <div class="product-zoom-scale-indicator" id="zoom-scale-badge">1.0x</div>
          <div class="product-zoom-instruction" id="zoom-instruction">
            <i class="fa-solid fa-magnifying-glass-plus"></i> Clic para acercar o alejar • Mueve el cursor para explorar detalles
          </div>
        </div>

        <div class="product-zoom-footer">
          <div class="product-zoom-price-box">
            <span class="product-zoom-price-label">Precio Colección Kenou</span>
            <span class="product-zoom-price-val" id="zoom-product-price">$0 COP</span>
          </div>
          <div class="product-zoom-footer-actions">
            <a id="zoom-whatsapp-link" href="#" target="_blank" rel="noopener noreferrer" class="btn-zoom-whatsapp" title="Preguntar por esta prenda en WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> Consultar en WhatsApp
            </a>
            <button type="button" class="btn-zoom-add-cart" id="btn-zoom-add-cart">
              <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const zoomStage = document.getElementById("zoom-stage");
  const zoomImg = document.getElementById("zoom-modal-img");
  const scaleBadge = document.getElementById("zoom-scale-badge");
  const btnClose = document.getElementById("btn-zoom-close");
  const btnIn = document.getElementById("btn-zoom-in");
  const btnOut = document.getElementById("btn-zoom-out");
  const btnReset = document.getElementById("btn-zoom-reset");
  const btnAddCart = document.getElementById("btn-zoom-add-cart");

  const aplicarZoom = (nivel, x = 50, y = 50) => {
    zoomActual = Math.min(3.0, Math.max(1.0, nivel));
    if (scaleBadge) scaleBadge.textContent = `${zoomActual.toFixed(1)}x`;

    if (zoomActual > 1.0) {
      if (zoomStage) zoomStage.classList.add("is-zoomed");
      if (zoomImg) {
        zoomImg.style.transformOrigin = `${x}% ${y}%`;
        zoomImg.style.transform = `scale(${zoomActual})`;
      }
    } else {
      if (zoomStage) zoomStage.classList.remove("is-zoomed");
      if (zoomImg) {
        zoomImg.style.transformOrigin = "center center";
        zoomImg.style.transform = "scale(1)";
      }
    }
  };

  // Movimiento del cursor para inspección tipo lupa
  if (zoomStage && !zoomStage._zoomConfigured) {
    zoomStage._zoomConfigured = true;

    zoomStage.addEventListener("mousemove", (e) => {
      if (zoomActual <= 1.0) return;
      const rect = zoomStage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (zoomImg) {
        zoomImg.style.transformOrigin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
      }
    });

    // Clic sobre la prenda: alterna entre 1.0x y 2.2x
    zoomStage.addEventListener("click", (e) => {
      const rect = zoomStage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (zoomActual > 1.0) {
        aplicarZoom(1.0);
      } else {
        aplicarZoom(2.2, x, y);
      }
    });

    // Soporte táctil para smartphones y tablets
    zoomStage.addEventListener(
      "touchmove",
      (e) => {
        if (zoomActual <= 1.0 || !e.touches[0]) return;
        const rect = zoomStage.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        if (zoomImg) {
          zoomImg.style.transformOrigin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
        }
      },
      { passive: true },
    );
  }

  if (btnIn && !btnIn._configured) {
    btnIn._configured = true;
    btnIn.addEventListener("click", () => aplicarZoom(zoomActual + 0.5));
  }
  if (btnOut && !btnOut._configured) {
    btnOut._configured = true;
    btnOut.addEventListener("click", () => aplicarZoom(zoomActual - 0.5));
  }
  if (btnReset && !btnReset._configured) {
    btnReset._configured = true;
    btnReset.addEventListener("click", () => aplicarZoom(1.0));
  }

  if (btnAddCart && !btnAddCart._configured) {
    btnAddCart._configured = true;
    btnAddCart.addEventListener("click", () => {
      if (productoSeleccionadoZoom && typeof addToCart === "function") {
        addToCart(productoSeleccionadoZoom.id);
      }
    });
  }

  if (btnClose && !btnClose._configured) {
    btnClose._configured = true;
    btnClose.addEventListener("click", cerrarModalZoomProducto);
  }

  if (!modalOverlay._configured) {
    modalOverlay._configured = true;
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        cerrarModalZoomProducto();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (modalOverlay.classList.contains("active")) {
        if (e.key === "Escape") {
          cerrarModalZoomProducto();
        } else if (e.key === "+" || e.key === "=") {
          aplicarZoom(zoomActual + 0.5);
        } else if (e.key === "-") {
          aplicarZoom(zoomActual - 0.5);
        }
      }
    });
  }
}

window.abrirModalZoomProducto = function (productId) {
  const prods = obtenerProductosCatalogo();
  const prod = prods.find((p) => p.id == productId);
  if (!prod) return;

  productoSeleccionadoZoom = prod;
  inicializarModalZoomCatalogo();

  const overlay = document.getElementById("product-zoom-modal-overlay");
  const zoomImg = document.getElementById("zoom-modal-img");
  const titleEl = document.getElementById("zoom-product-title");
  const catEl = document.getElementById("zoom-product-category");
  const priceEl = document.getElementById("zoom-product-price");
  const waLink = document.getElementById("zoom-whatsapp-link");
  const scaleBadge = document.getElementById("zoom-scale-badge");
  const zoomStage = document.getElementById("zoom-stage");

  const imgUrl =
    prod.imagen ||
    prod.image ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500";
  const nombre = prod.nombre || prod.name || "Prenda Exclusiva";
  const categoria = prod.categoria || prod.material || "Moda Urbana";
  const precio = Number(prod.precio || prod.price || 0);

  if (zoomImg) {
    zoomImg.src = imgUrl;
    zoomImg.alt = nombre;
    zoomImg.style.transform = "scale(1)";
    zoomImg.style.transformOrigin = "center center";
  }
  if (zoomStage) zoomStage.classList.remove("is-zoomed");
  if (titleEl) titleEl.textContent = nombre;
  if (catEl) catEl.textContent = categoria;
  if (priceEl) priceEl.textContent = `$${precio.toLocaleString("es-CO")} COP`;
  if (scaleBadge) scaleBadge.textContent = "1.0x";
  zoomActual = 1.0;

  if (waLink) {
    const msg = encodeURIComponent(
      `¡Hola Kenou Camisetas! Vi la prenda "${nombre}" ($${precio.toLocaleString("es-CO")} COP) en la galería y me gustaría hacer una consulta o pedido.`,
    );
    waLink.href = `https://wa.me/573053905216?text=${msg}`;
  }

  if (overlay) {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
};

window.cerrarModalZoomProducto = function () {
  const overlay = document.getElementById("product-zoom-modal-overlay");
  if (overlay) {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
};
