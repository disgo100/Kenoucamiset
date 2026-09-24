// ============================================================================
// KENOU CAMISETAS - LÓGICA DEL BLOG Y VIDEOTUTORIALES YOUTUBE (JS/blog.js)
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarBlog();
});

// ----------------------------------------------------------------------------
// 1. VIDEOTUTORIALES DE YOUTUBE: CUIDADO DE PRENDAS
// ----------------------------------------------------------------------------
const VIDEOS_YOUTUBE = [
    {
        id: "vid-1",
        titulo: "Cómo Lavar Camisetas con Estampado DTF sin Dañarlas",
        canal: "Kenou Camisetas TV",
        duracion: "04:15",
        thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
        resumen: "Paso a paso definitivo para evitar cuarteaduras, pérdida de color y desprendimientos al lavar tus prendas DTF en lavadora o a mano.",
        youtubeUrl: "https://www.youtube.com/results?search_query=como+lavar+estampado+dtf",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        consejos: [
            "Lava siempre la prenda al revés (estampado hacia adentro).",
            "Usa agua fría (máximo 30°C) y ciclo suave.",
            "Evita blanqueadores, lejía o suavizantes abrasivos."
        ]
    },
    {
        id: "vid-2",
        titulo: "Planchado Correcto para Vinilo Textil y Detalles Neón",
        canal: "Kenou Camisetas TV",
        duracion: "05:30",
        thumbnail: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600",
        resumen: "Aprende la temperatura adecuada y el uso de papel siliconado o tela protectora para evitar derretir o levantar bordes de vinilo térmico.",
        youtubeUrl: "https://www.youtube.com/results?search_query=como+planchar+vinilo+textil",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        consejos: [
            "Nunca coloques la plancha caliente directa sobre el vinilo.",
            "Usa una hoja de papel siliconado o tela fina de algodón encima.",
            "Aplica presión firme por 10 a 15 segundos sin arrastrar la plancha."
        ]
    },
    {
        id: "vid-3",
        titulo: "Secretos para Mantener la Ropa Negra y Busos sin Decolorarse",
        canal: "Kenou Camisetas TV",
        duracion: "06:45",
        thumbnail: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
        resumen: "El truco del vinagre blanco como fijador de tintes, detergentes específicos para prendas oscuras y secado estratégico en sombra.",
        youtubeUrl: "https://www.youtube.com/results?search_query=cuidar+ropa+negra+decoloracion",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        consejos: [
            "Tiende siempre las prendas a la sombra; el sol directo oxida los tintes.",
            "Agrega media taza de vinagre blanco en el enjuague para fijar el negro.",
            "Usa detergente líquido en lugar de polvo para no dejar residuos blancos."
        ]
    },
    {
        id: "vid-4",
        titulo: "Cómo Eliminar Manchas Difíciles sin Dañar Fibras de Algodón",
        canal: "Kenou Camisetas TV",
        duracion: "03:50",
        thumbnail: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
        resumen: "Remueve grasa, sudor y roces accidentales en algodón pesado y cortes oversize sin arruinar la suavidad del tejido.",
        youtubeUrl: "https://www.youtube.com/results?search_query=quitar+manchas+algodon+sin+danar",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        consejos: [
            "Trata la mancha al instante con jabón neutro antes de que seque.",
            "Frota suavemente con las yemas de los dedos o cepillo de cerdas ultrasuaves.",
            "No apliques calor hasta que la mancha haya desaparecido por completo."
        ]
    }
];

// ----------------------------------------------------------------------------
// 2. ARTÍCULOS TÉCNICOS Y GUÍAS DE BLOG ESCRITAS
// ----------------------------------------------------------------------------
const ARTICULOS_BLOG = [
    {
        id: 1,
        titulo: "Guía Definitiva para Lavar y Conservar tus Estampados DTF",
        categoria: "dtf",
        categoriaNombre: "Cuidado DTF",
        fecha: "20 Septiembre, 2026",
        lectura: "3 min de lectura",
        imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600",
        resumen: "Aprende los secretos profesionales para evitar que el estampado DTF de tus camisetas se cuartee, se decolore o pierda elasticidad con los lavados cotidianos.",
        contenido: `
            <h3 style="font-size: 1.35rem; color: #ffffff; font-weight: 700; margin-bottom: 1rem;">¿Cómo alargar la vida útil de tu estampado DTF?</h3>
            <p style="color: #cbd5e1; line-height: 1.8; margin-bottom: 1rem;">El estampado en <strong>Direct to Film (DTF)</strong> ofrece una resolución fotográfica excelente y tacto elástico de alta definición, pero requiere de ciertos cuidados básicos de lavado para mantener su elasticidad original.</p>
            
            <h4 style="color: #38bdf8; font-size: 1.08rem; font-weight: 700; margin-top: 1.3rem; margin-bottom: 0.6rem;">Reglas de Oro para el Lavado:</h4>
            <ul style="color: #cbd5e1; margin-left: 1.3rem; line-height: 1.85; margin-bottom: 1.5rem;">
                <li><strong style="color: #ffffff;">Voltea la prenda:</strong> Lava siempre la camiseta al revés con el estampado hacia adentro.</li>
                <li><strong style="color: #ffffff;">Agua Fría:</strong> Utiliza ciclos de lavado suave con agua fría (máximo 30°C).</li>
                <li><strong style="color: #ffffff;">Sin Blanqueadores:</strong> Evita el uso de cloro, lejía o suavizantes abrasivos.</li>
                <li><strong style="color: #ffffff;">No Planchar Directamente:</strong> Si necesitas planchar, hazlo por el revés o utiliza papel siliconado/tela protectora encima del estampado.</li>
                <li><strong style="color: #ffffff;">Secado al Aire:</strong> No uses secadora automática con calor alto. Seca siempre a la sombra.</li>
            </ul>
        `
    },
    {
        id: 2,
        titulo: "Vinilo Textil Mate vs Reflectivo: Planchado y Mantenimiento",
        categoria: "vinilo",
        categoriaNombre: "Vinilo Textil",
        fecha: "18 Septiembre, 2026",
        lectura: "4 min de lectura",
        imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
        resumen: "Conoce las diferencias técnicas en el cuidado de prendas con detalles en vinilo reflectivo y cómo evitar que el calor arruine la fijación del adhesivo térmico.",
        contenido: `
            <h3 style="font-size: 1.35rem; color: #ffffff; font-weight: 700; margin-bottom: 1rem;">Mantenimiento Especial para Vinilo Textil</h3>
            <p style="color: #cbd5e1; line-height: 1.8; margin-bottom: 1rem;">El vinilo textil es ideal para diseños de corte limpio y efectos especiales como acabados reflectivos o neón. Para garantizar que los bordes no se levanten, sigue estas recomendaciones:</p>
            
            <h4 style="color: #38bdf8; font-size: 1.08rem; font-weight: 700; margin-top: 1.3rem; margin-bottom: 0.6rem;">Tips de Mantenimiento:</h4>
            <ul style="color: #cbd5e1; margin-left: 1.3rem; line-height: 1.85; margin-bottom: 1.5rem;">
                <li><strong style="color: #ffffff;">Reposo inicial:</strong> Espera al menos 24 a 48 horas antes del primer lavado tras recibir la prenda.</li>
                <li><strong style="color: #ffffff;">Lavado delicado:</strong> Lava a mano o en ciclo delicado con detergente líquido suave.</li>
                <li><strong style="color: #ffffff;">Cero fricción:</strong> Nunca exprimas o retuerzas la zona del vinilo al escurrir.</li>
                <li><strong style="color: #ffffff;">Almacenamiento:</strong> Guarda las prendas colgadas en ganchos para evitar marcas de doblez profundas en el diseño.</li>
            </ul>
        `
    },
    {
        id: 3,
        titulo: "Streetwear 2026: La Revolución del Algodón Heavy Weight y Oversize",
        categoria: "tendencias",
        categoriaNombre: "Tendencias Urbanas",
        fecha: "15 Septiembre, 2026",
        lectura: "5 min de lectura",
        imagen: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
        resumen: "Descubre por qué las camisetas de alto gramaje (220g+) y los cortes oversize son la tendencia dominante de la moda urbana actual.",
        contenido: `
            <h3 style="font-size: 1.35rem; color: #ffffff; font-weight: 700; margin-bottom: 1rem;">La Silueta Oversize y la Calidad Heavy Weight</h3>
            <p style="color: #cbd5e1; line-height: 1.8; margin-bottom: 1rem;">En 2026, la moda urbana prioriza la estructura del tejido y la durabilidad. Las telas de algodón de alto gramaje no solo caen mejor en el cuerpo, sino que retienen la pigmentación de los tintes por mucho más tiempo.</p>
            
            <p style="color: #cbd5e1; line-height: 1.8; margin-bottom: 1.5rem;">En <strong>Kenou Camisetas</strong> no confeccionamos: nos especializamos en estampados de diferentes técnicas y procesos para embellecer prendas y busos pesados, con acabados prémium diseñados para resistir el uso diario sin perder su calidad.</p>
        `
    },
    {
        id: 4,
        titulo: "Cómo Preservar el Color Negro Intenso en Busos y Ropa Oscura",
        categoria: "dtf",
        categoriaNombre: "Cuidado DTF",
        fecha: "12 Septiembre, 2026",
        lectura: "3 min de lectura",
        imagen: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600",
        resumen: "Evita que tus busos y joggers negros tomen ese tono grisáceo y desgastado con el paso del tiempo aplicando trucos caseros seguros.",
        contenido: `
            <h3 style="font-size: 1.35rem; color: #ffffff; font-weight: 700; margin-bottom: 1rem;">Mantenimiento de Prendas Negras y Oscuras</h3>
            <p style="color: #cbd5e1; line-height: 1.8; margin-bottom: 1rem;">La radiación solar y los detergentes en polvo son los principales enemigos del algodón negro. Sigue estos pasos para fijar el color:</p>
            <ul style="color: #cbd5e1; margin-left: 1.3rem; line-height: 1.85; margin-bottom: 1.5rem;">
                <li><strong style="color: #ffffff;">Temperatura:</strong> Lava siempre con agua fría (el agua tibia abre los poros de la fibra y expulsa el tinte).</li>
                <li><strong style="color: #ffffff;">Detergente:</strong> Usa detergente líquido especial para ropa oscura sin agentes blanqueadores.</li>
                <li><strong style="color: #ffffff;">Secado:</strong> Seca la prenda en un lugar ventilado y bajo sombra, nunca bajo luz directa del sol.</li>
            </ul>
        `
    }
];

// ----------------------------------------------------------------------------
// 3. INICIALIZACIÓN
// ----------------------------------------------------------------------------
function inicializarBlog() {
    renderizarVideosYouTube();
    renderizarArticulos('todos');
    configurarFiltros();
    configurarModales();
}

// ----------------------------------------------------------------------------
// 4. RENDERIZADO DE SECCIÓN YOUTUBE
// ----------------------------------------------------------------------------
function renderizarVideosYouTube() {
    const container = document.getElementById('youtube-grid-container');
    if (!container) return;

    container.innerHTML = '';

    VIDEOS_YOUTUBE.forEach(vid => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Ver video: ${vid.titulo}`);

        card.innerHTML = `
            <div class="video-thumbnail-box">
                <img src="${vid.thumbnail}" alt="${vid.titulo}" class="video-thumbnail" loading="lazy">
                <div class="video-duration-badge">
                    <i class="fa-regular fa-clock"></i> ${vid.duracion}
                </div>
                <div class="video-play-overlay">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <div class="video-info">
                <div class="video-channel">
                    <i class="fa-brands fa-youtube"></i> ${vid.canal}
                </div>
                <h3 class="video-title" title="${vid.titulo}">${vid.titulo}</h3>
                <p class="video-desc">${vid.resumen}</p>
                <button class="btn-watch-video">
                    <i class="fa-solid fa-play"></i> Ver Tutorial
                </button>
            </div>
        `;

        card.addEventListener('click', () => abrirVideoModal(vid.id));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirVideoModal(vid.id);
            }
        });

        container.appendChild(card);
    });
}

// ----------------------------------------------------------------------------
// 5. RENDERIZADO DE ARTÍCULOS ESCRITOS (DISTRIBUCIÓN Y ALINEACIÓN HOMOGÉNEA)
// ----------------------------------------------------------------------------
function renderizarArticulos(categoriaFiltro) {
    const gridContainer = document.getElementById('blog-grid-container');
    if (!gridContainer) return;

    let filtrados = ARTICULOS_BLOG;

    if (categoriaFiltro && categoriaFiltro !== 'todos') {
        filtrados = filtrados.filter(art => art.categoria === categoriaFiltro);
    }

    gridContainer.innerHTML = '';

    if (filtrados.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #64748b; padding: 3.5rem 1.5rem; background: #ffffff; border: 1px dashed var(--border-color, #e2e8f0); border-radius: 14px;">
                <i class="fa-solid fa-newspaper fa-3x" style="margin-bottom: 1rem; color: #94a3b8;"></i>
                <h3 style="color: var(--text-main, #0f172a); font-size: 1.2rem; margin-bottom: 0.5rem;">No hay artículos disponibles</h3>
                <p style="font-size: 0.92rem; color: #64748b;">No se encontraron guías en la categoría seleccionada.</p>
            </div>
        `;
        return;
    }

    filtrados.forEach(art => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container" style="height: 220px;">
                <img src="${art.imagen}" alt="${art.titulo}" class="product-image" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'">
                <div class="product-card-badges">
                    <span class="product-badge-category">${art.categoriaNombre}</span>
                    <span class="product-badge-status" style="background: rgba(0,0,0,0.75); color: #ddd; border-color: rgba(255,255,255,0.2);">
                        <i class="fa-regular fa-clock"></i> ${art.lectura}
                    </span>
                </div>
            </div>
            <div class="product-info">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <span class="product-category">${art.categoriaNombre}</span>
                    <span class="blog-card-reading-time"><i class="fa-regular fa-calendar"></i> ${art.fecha}</span>
                </div>
                <h3 class="product-title" title="${art.titulo}">${art.titulo}</h3>
                <p class="blog-card-excerpt">${art.resumen}</p>
                <button class="btn-hero-primary" onclick="abrirArticuloModal(${art.id})" style="width: 100%; justify-content: center; padding: 0.7rem 1rem; font-size: 0.9rem; margin-top: auto; border-radius: 8px;">
                    <i class="fa-solid fa-book-open"></i> Leer Guía Completa
                </button>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// ----------------------------------------------------------------------------
// 6. FILTRADO DE CATEGORÍAS (SIN BUSCADOR)
// ----------------------------------------------------------------------------
function configurarFiltros() {
    const btns = document.querySelectorAll('.blog-cat-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.getAttribute('data-category');
            renderizarArticulos(cat);
        });
    });
}

// ----------------------------------------------------------------------------
// 7. MODALES: LECTURA DE ARTÍCULO Y REPRODUCTOR YOUTUBE
// ----------------------------------------------------------------------------
function abrirArticuloModal(id) {
    const articulo = ARTICULOS_BLOG.find(a => a.id === id);
    if (!articulo) return;

    const modal = document.getElementById('article-modal');
    const modalTag = document.getElementById('modal-article-tag');
    const modalContent = document.getElementById('modal-article-content');

    if (modal && modalContent) {
        if (modalTag) modalTag.textContent = articulo.categoriaNombre.toUpperCase();

        modalContent.innerHTML = `
            <img src="${articulo.imagen}" alt="${articulo.titulo}" 
                 style="width: 100%; max-height: 270px; object-fit: cover; border-radius: 12px; margin-bottom: 1.3rem; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.6);"
                 onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600'">
            <h2 style="font-size: 1.55rem; color: #ffffff; font-weight: 800; margin-bottom: 0.6rem; line-height: 1.35; letter-spacing: -0.3px;">${articulo.titulo}</h2>
            <div style="display: flex; gap: 1.2rem; align-items: center; color: #94a3b8; font-size: 0.86rem; margin-bottom: 1.4rem; padding-bottom: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.12);">
                <span><i class="fa-regular fa-calendar" style="color: var(--accent);"></i> ${articulo.fecha}</span>
                <span><i class="fa-regular fa-clock" style="color: var(--accent);"></i> ${articulo.lectura}</span>
                <span style="color: #38bdf8; font-weight: 600;"><i class="fa-solid fa-tag"></i> ${articulo.categoriaNombre}</span>
            </div>
            <div class="article-text-body" style="color: #cbd5e1; font-size: 0.96rem; line-height: 1.8;">
                ${articulo.contenido}
            </div>
        `;

        modal.style.display = 'flex';
    }
}

function abrirVideoModal(id) {
    const video = VIDEOS_YOUTUBE.find(v => v.id === id);
    if (!video) return;

    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('modal-video-player-container');
    const modalTitle = document.getElementById('modal-video-title');
    const modalDesc = document.getElementById('modal-video-desc');
    const modalDuration = document.getElementById('modal-video-duration');
    const modalLink = document.getElementById('modal-video-link');
    const modalChannel = document.getElementById('modal-video-channel');

    if (modal && playerContainer) {
        if (modalTitle) modalTitle.textContent = video.titulo;
        if (modalChannel) modalChannel.textContent = video.canal;
        if (modalDuration) modalDuration.innerHTML = `<i class="fa-regular fa-clock"></i> Duración: ${video.duracion}`;
        if (modalLink) modalLink.href = video.youtubeUrl;

        let tipsHtml = '';
        if (video.consejos && video.consejos.length > 0) {
            tipsHtml = `
                <div style="background: #191919; border: 1px solid #282828; border-radius: 10px; padding: 1rem; margin-top: 0.8rem;">
                    <strong style="color: #ff3333; font-size: 0.88rem; display: block; margin-bottom: 0.4rem;">
                        <i class="fa-solid fa-lightbulb"></i> Puntos Clave del Tutorial:
                    </strong>
                    <ul style="color: #ccc; font-size: 0.84rem; padding-left: 1.2rem; line-height: 1.6;">
                        ${video.consejos.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (modalDesc) {
            modalDesc.innerHTML = `${video.resumen}${tipsHtml}`;
        }

        // Insertar reproductor con soporte responsivo
        playerContainer.innerHTML = `
            <iframe 
                src="${video.embedUrl}?autoplay=1&rel=0" 
                title="${video.titulo}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;

        modal.style.display = 'flex';
    }
}

function configurarModales() {
    // Modal de artículos
    const closeArticleBtn = document.getElementById('close-article-modal-btn');
    const articleModal = document.getElementById('article-modal');
    if (closeArticleBtn && articleModal) {
        closeArticleBtn.onclick = () => { articleModal.style.display = 'none'; };
    }

    // Modal de videos
    const closeVideoBtn = document.getElementById('close-video-modal-btn');
    const videoModal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('modal-video-player-container');

    function cerrarVideoModal() {
        if (videoModal) videoModal.style.display = 'none';
        if (playerContainer) playerContainer.innerHTML = ''; // Detiene el audio del video al cerrar
    }

    if (closeVideoBtn && videoModal) {
        closeVideoBtn.onclick = cerrarVideoModal;
    }

    // Cierre al presionar fuera del contenido
    window.onclick = (e) => {
        if (e.target === articleModal) {
            articleModal.style.display = 'none';
        }
        if (e.target === videoModal) {
            cerrarVideoModal();
        }
    };

    // Cierre al presionar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (articleModal && articleModal.style.display === 'flex') {
                articleModal.style.display = 'none';
            }
            if (videoModal && videoModal.style.display === 'flex') {
                cerrarVideoModal();
            }
        }
    });
}