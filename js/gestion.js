// Archivo JavaScript para las páginas de gestión
// Inicializar la instancia de la API
const apiService = new ApiService();

// Verificar autenticación de administrador
function verificarAuthAdmin() {
    if (!authService.isAuthenticated() || !authService.isAdmin()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para mostrar toast
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensaje;
        toast.className = `toast toast-${tipo}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    } else {
        alert(mensaje);
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    authService.logout();
}

// Función para mostrar/ocultar formularios modales
function mostrarFormulario(formId) {
    const formulario = document.getElementById(formId);
    if (formulario) {
        formulario.style.display = 'flex';
    }
}

function cerrarFormulario(formId) {
    const formulario = document.getElementById(formId);
    if (formulario) {
        formulario.style.display = 'none';
        // Limpiar formulario
        const form = formulario.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Función para validar formularios
function validarFormulario(formData) {
    for (let [key, value] of formData.entries()) {
        if (!value || value.trim() === '') {
            mostrarToast(`El campo ${key} es requerido`, 'error');
            return false;
        }
    }
    return true;
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para formatear estado de turno
function formatearEstado(estado) {
    const estados = {
        'Pendiente': 'Pendiente',
        'Confirmado': 'Confirmado',
        'Cancelado': 'Cancelado',
        'Completado': 'Completado'
    };
    return estados[estado] || estado;
}

// Función para confirmar eliminación
function confirmarEliminacion(mensaje = '¿Estás seguro de que quieres eliminar este elemento?') {
    return confirm(mensaje);
}

// Función para manejar errores de API
function manejarErrorAPI(error, mensajeDefault = 'Error de conexión') {
    console.error('Error API:', error);
    const mensaje = error.message || mensajeDefault;
    mostrarToast(mensaje, 'error');
}

// Función para manejar respuesta exitosa de API
function manejarExitoAPI(mensaje, callback = null) {
    mostrarToast(mensaje, 'success');
    if (callback && typeof callback === 'function') {
        callback();
    }
}

// Función para limpiar formularios
function limpiarFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// Función para obtener datos del formulario
function obtenerDatosFormulario(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const formData = new FormData(form);
    const datos = {};
    
    for (let [key, value] of formData.entries()) {
        datos[key] = value.trim();
    }
    
    return datos;
}

// Función para llenar formulario con datos
function llenarFormulario(formId, datos) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    Object.keys(datos).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = datos[key];
        }
    });
}

// Función para actualizar tabla
function actualizarTabla(tbodyId, datos, generarFila) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (datos && datos.length > 0) {
        datos.forEach(item => {
            const row = generarFila(item);
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="100%" class="text-center">No hay datos disponibles</td>';
        tbody.appendChild(row);
    }
}

// Función para buscar en tiempo real
function buscarEnTiempoReal(inputId, datos, filtroFuncion, tbodyId, generarFila) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const datosFiltrados = datos.filter(item => filtroFuncion(item, termino));
        actualizarTabla(tbodyId, datosFiltrados, generarFila);
    });
}

// Función para paginación
function configurarPaginacion(datos, itemsPorPagina, tbodyId, generarFila) {
    let paginaActual = 1;
    const totalPaginas = Math.ceil(datos.length / itemsPorPagina);
    
    function mostrarPagina(pagina) {
        const inicio = (pagina - 1) * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const datosPagina = datos.slice(inicio, fin);
        actualizarTabla(tbodyId, datosPagina, generarFila);
        
        // Actualizar información de paginación
        const paginaInfo = document.getElementById('paginaInfo');
        if (paginaInfo) {
            paginaInfo.textContent = `Página ${pagina} de ${totalPaginas}`;
        }
    }
    
    function cambiarPagina(direccion) {
        const nuevaPagina = paginaActual + direccion;
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            paginaActual = nuevaPagina;
            mostrarPagina(paginaActual);
        }
    }
    
    // Mostrar primera página
    mostrarPagina(1);
    
    // Retornar función para cambiar página
    return cambiarPagina;
}

// Función para inicializar página de gestión
function inicializarPaginaGestion() {
    if (!verificarAuthAdmin()) {
        return;
    }
    
    // Configurar eventos globales
    document.addEventListener('click', function(e) {
        // Cerrar formularios al hacer clic fuera
        if (e.target.classList.contains('formulario-modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Configurar tecla Escape para cerrar formularios
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const formularios = document.querySelectorAll('.formulario-modal');
            formularios.forEach(form => {
                form.style.display = 'none';
            });
        }
    });
}

// Exportar funciones para uso en otras páginas
window.gestionUtils = {
    verificarAuthAdmin,
    mostrarToast,
    cerrarSesion,
    mostrarFormulario,
    cerrarFormulario,
    validarFormulario,
    formatearFecha,
    formatearEstado,
    confirmarEliminacion,
    manejarErrorAPI,
    manejarExitoAPI,
    limpiarFormulario,
    obtenerDatosFormulario,
    llenarFormulario,
    actualizarTabla,
    buscarEnTiempoReal,
    configurarPaginacion,
    inicializarPaginaGestion
}; 