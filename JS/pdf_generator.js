// js/pdf-generator.js


// js/pdf-generator.js

function generarOrdenPDFData(orderData) {
    // 1. Validar que la librería jsPDF esté cargada en el navegador
    if (!window.jspdf) {
        alert("❌ Error: La librería jsPDF no se ha cargado. Verifica tu conexión a internet o el enlace CDN en carrito.html.");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Paleta de Colores de Kenou Camisetas (Valores RGB corregidos)
    const brandPink = [255, 51, 102];
    const darkHeader = [18, 18, 18];

    // 2. ENCABEZADO Y BANNER SUPERIOR
    doc.setFillColor(darkHeader[0], darkHeader[1], darkHeader[2]);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("KENOU CAMISETAS", 15, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Orden de Pedido Digital & Comprobante de Compra", 15, 27);

    // Fecha y Hora Exacta de Generación (HH:MM:SS)
    const now = new Date();
    const fechaExacta = now.toLocaleDateString('es-CO');
    const horaExacta = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeStampCompleto = `${fechaExacta} | ${horaExacta}`;

    // Número de Orden y Fecha/Hora
    doc.setTextColor(brandPink[0], brandPink[1], brandPink[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`N° ORDEN: ${orderData.orderNumber}`, 120, 18);
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${timeStampCompleto}`, 120, 25);

    // 3. DATOS DEL COMPRADOR
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL COMPRADOR", 15, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nombre: ${orderData.clientName || 'Cliente'}`, 15, 55);
    doc.text(`Teléfono / WhatsApp: ${orderData.clientPhone || 'No registrado'}`, 15, 61);
    doc.text(`Correo Electrónico: ${orderData.clientEmail || 'No registrado'}`, 15, 67);

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 73, 195, 73);

    // 4. DETALLE DEL PEDIDO Y COTIZACIÓN
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DETALLE DEL PEDIDO Y COTIZACIÓN", 15, 82);

    // Encabezados de Tabla
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 87, 180, 8, 'F');
    doc.setFontSize(9);
    doc.text("Ítem / Servicio Cotizado", 18, 92);
    doc.text("Cant.", 130, 92);
    doc.text("Precio Total", 160, 92);

    let yPos = 101;
    doc.setFont("helvetica", "normal");

    if (orderData.items && orderData.items.length > 0) {
        orderData.items.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.text(String(item.name || "Producto"), 18, yPos);
            doc.text(String(item.qty || 1), 133, yPos);
            doc.text(`$${(item.subtotal || 0).toLocaleString('es-CO')} COP`, 160, yPos);

            if (item.detail) {
                yPos += 5;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(`• ${item.detail}`, 22, yPos);
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
            }
            yPos += 9;
        });
    } else {
        doc.text("Sin ítems registrados", 18, yPos);
        yPos += 9;
    }

    // TOTAL PAGADO
    doc.line(15, yPos, 195, yPos);
    yPos += 9;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL PAGADO:", 110, yPos);
    doc.setTextColor(brandPink[0], brandPink[1], brandPink[2]);
    doc.text(`$${(orderData.total || 0).toLocaleString('es-CO')} COP`, 155, yPos);

    // 5. CLÁUSULA DE ENTREGA Y RECOGIDA EN TIENDA (HU04 / RF03)
    yPos += 18;
    doc.setFillColor(252, 235, 238);
    doc.setDrawColor(brandPink[0], brandPink[1], brandPink[2]);
    doc.roundedRect(15, yPos, 180, 28, 3, 3, 'FD');
    doc.setTextColor(brandPink[0], brandPink[1], brandPink[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN IMPORTANTE DE ENTREGA", 20, yPos + 8);
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("• Modalidad exclusiva: Recogida en Tienda Física (Sin envíos nacionales).", 20, yPos + 15);
    doc.text("• Presentar este documento impreso o en PDF digital al momento de reclamar el pedido.", 20, yPos + 21);

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Kenou Camisetas — Moda Urbana B2C | Documento generado automáticamente", 15, 285);

    // Descargar el archivo PDF con un breve retardo para asegurar la compilación binaria
    setTimeout(() => {
        try {
            doc.save(`Orden_Pedido_${orderData.orderNumber}.pdf`);
            console.log("✅ PDF descargado exitosamente de forma tradicional.");
        } catch (error) {
            console.log("Aviso: Falló el guardado directo, aplicando descarga forzada mediante DataURI...");
            const dataUri = doc.output('datauristring');
            const fallbackLink = document.createElement('a');
            fallbackLink.href = dataUri;
            fallbackLink.download = `Orden_Pedido_${orderData.orderNumber}.pdf`;
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
        }
    }, 150);
}

