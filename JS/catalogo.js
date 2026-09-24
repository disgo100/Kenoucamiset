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
            <div class="product-image-container">
                <img src="${imgUrl}" 
                     alt="${nombre}" 
                     class="product-image" 
                     loading="lazy" 
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';">
                <div class="product-card-badges">
                    <span class="product-badge-category">${categoriaNombre}</span>
                    <span class="product-badge-status ${esUltimas ? "status-warning" : "status-available"}">${stockTexto}</span>
                </div>
            </div>
            <div class="product-info"> 
                <h4 class="product-title" title="${nombre}">${nombre}</h4> 
                <div class="product-price-row">
                    <span class="product-price">$${precio.toLocaleString("es-CO")} <span style="font-size: 0.8rem; color: #888; font-weight: 600;">COP</span></span>
                </div>
                <button class="btn-add-cart" onclick="addToCart('${p.id}')">
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
