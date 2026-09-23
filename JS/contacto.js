// =========================================================
// PRENDAS & STYLOS - LÓGICA DE CONTACTO Y ATENCIÓN (JS/contacto.js)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
inicializarPaginaContacto();
});
function inicializarPaginaContacto() {
configurarRestriccionNumerica();
configurarAccionesContacto();
configurarAgendarCalendario();
}
// Restricción numérica para el campo celular/teléfono (máx 15 dígitos)
function configurarRestriccionNumerica() {
const inputTel = document.getElementById('contact-telefono');
if (!inputTel) return;
    inputTel.addEventListener('keydown', (e) => {
        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
            e.preventDefault();
        }
    });

    inputTel.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 15) {
            val = val.slice(0, 15);
        }
        e.target.value = val;
    });
}
function configurarAccionesContacto() {
const btnWhatsApp = document.getElementById('btn-contact-whatsapp');
const btnLimpiar = document.getElementById('btn-contact-limpiar');
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', enviarMensajePorWhatsApp);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (confirm('🗑️ ¿Deseas limpiar todos los campos del formulario de contacto?')) {
                limpiarCamposContacto();
            }
        });
    }
}
// 1. VALIDACIÓN DEL FORMULARIO DE CONTACTO Y PROTECCIÓN DE DATOS (LEY 1581)
function validarCamposContacto() {
    const nombre = document.getElementById('contact-nombre')?.value.trim() || '';
    const email = document.getElementById('contact-email')?.value.trim() || '';
    const telefono = document.getElementById('contact-telefono')?.value.trim() || '';
    const asunto = document.getElementById('contact-asunto')?.value || 'Consulta General';
    const mensaje = document.getElementById('contact-mensaje')?.value.trim() || '';
    const checkPrivacidad = document.getElementById('check-privacidad-contacto');
    const privacidadAceptada = checkPrivacidad ? checkPrivacidad.checked : true;

    const hayCamposFaltantes = !nombre || !email || !telefono || !mensaje || !privacidadAceptada;

    if (hayCamposFaltantes) {
        let detalleFaltante = '';
        if (!nombre) detalleFaltante += '• Falta ingresar tu Nombre Completo.\n';
        if (!email) detalleFaltante += '• Falta ingresar tu Correo Electrónico.\n';
        if (!telefono) detalleFaltante += '• Falta ingresar tu Celular / Teléfono.\n';
        if (!mensaje) detalleFaltante += '• Falta escribir el detalle de tu Mensaje.\n';
        if (!privacidadAceptada) detalleFaltante += '• Debes autorizar el tratamiento de datos y aceptar las Políticas de Privacidad (Ley 1581 / MinTIC).\n';

        const mensajeAdvertencia = `⚠️ EL FORMULARIO DE CONTACTO ESTÁ INCOMPLETO:\n\n${detalleFaltante}\n` +
            `--------------------------------------------------\n` +
            `• Oprima [ACEPTAR] para CONTINUAR en la página y diligenciar los datos faltantes.\n` +
            `• Oprima [CANCELAR] para RECHAZAR el envío y limpiar los campos.`;

        const deseaContinuar = confirm(mensajeAdvertencia);

        if (deseaContinuar) {
            if (!nombre && document.getElementById('contact-nombre')) document.getElementById('contact-nombre').focus();
            else if (!email && document.getElementById('contact-email')) document.getElementById('contact-email').focus();
            else if (!telefono && document.getElementById('contact-telefono')) document.getElementById('contact-telefono').focus();
            else if (!mensaje && document.getElementById('contact-mensaje')) document.getElementById('contact-mensaje').focus();
            else if (!privacidadAceptada && checkPrivacidad) {
                checkPrivacidad.focus();
                checkPrivacidad.parentElement.style.outline = '2px solid var(--accent)';
                setTimeout(() => { if (checkPrivacidad.parentElement) checkPrivacidad.parentElement.style.outline = 'none'; }, 3000);
            }
        } else {
            alert('❌ El envío ha sido cancelado y los campos han sido limpiados.');
            limpiarCamposContacto();
        }

        return null;
    }

    return { nombre, email, telefono, asunto, mensaje };
}
// 2. BOTÓN "ENVÍANOS UN WHATSAPP"
function enviarMensajePorWhatsApp() {
const datos = validarCamposContacto();
if (!datos) return;
    const telefonoDestino = '573173247083';
    const textoWhatsApp = `Hola *Prendas & Stylos* 👋, deseo realizar la siguiente consulta desde el formulario web de contacto:

👤 DATOS DEL REMITENTE:
• Nombre: ${datos.nombre}
• Correo: ${datos.email}
• Teléfono: ${datos.telefono}
• Motivo de Consulta: ${datos.asunto}
📝 MENSAJE / DETALLE:
"${datos.mensaje}"
Quedo atento a su respuesta. ¡Muchas gracias!`;
    const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(textoWhatsApp)}`;
    window.open(url, '_blank');
}
function limpiarCamposContacto() {
['contact-nombre', 'contact-email', 'contact-telefono', 'contact-mensaje'].forEach(id => {
const el = document.getElementById(id);
if (el) el.value = '';
});
const select = document.getElementById('contact-asunto');
if (select) select.selectedIndex = 0;
}
// 3. AGENDAR HORARIO DE SERVICIO EN LA APP DE CALENDARIO DEL CLIENTE
function configurarAgendarCalendario() {
const btnCal = document.getElementById('btn-agendar-calendario');
if (!btnCal) return;
    btnCal.addEventListener('click', () => {
        const titulo = encodeURIComponent('Atención & Showroom - Prendas & Stylos');
        const detalles = encodeURIComponent('Horario de atención al cliente de Prendas & Stylos: Lunes a Viernes de 8:00 AM a 6:00 PM y Sábados de 9:00 AM a 1:00 PM. Ubicación: Cra 28 D1 #72 L 94 - Barrio Los Robles, Cali.');
        const ubicacion = encodeURIComponent('Cra 28 D1 #72 L 94 - Barrio Los Robles, Cali, Colombia');
        
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${detalles}&location=${ubicacion}&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA`;

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Prendas & Stylos//Horario de Atención//ES
BEGIN:VEVENT
SUMMARY:Atención & Showroom - Prendas & Stylos
DESCRIPTION:Horario de atención al cliente: Lunes a Viernes de 8:00 AM a 6:00 PM y Sábados de 9:00 AM a 1:00 PM.
LOCATION:Cra 28 D1 #72 L 94 - Barrio Los Robles, Cali, Colombia
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'PrendasStylos-HorarioAtencion.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.open(gcalUrl, '_blank');
    });
}