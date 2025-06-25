// Funcionalidad para clientes
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authService.getCurrentUser();
    
    // Solo clientes pueden acceder
    if (user.role !== 'cliente') {
        showApiError('Acceso denegado');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Cargar turnos del cliente
    await cargarTurnosCliente(user.id);
});

// Función para cargar los turnos del cliente
async function cargarTurnosCliente(clienteId) {
    try {
        const result = await turnosService.getTurnosCliente(clienteId);
        
        if (result.success && result.data) {
            mostrarTurnos(result.data);
        } else {
            mostrarTurnos([]);
            if (result.message) {
                showApiError(result.message);
            }
        }
    } catch (error) {
        console.error('Error al cargar los turnos:', error);
        showApiError('Error al cargar los turnos');
        mostrarTurnos([]);
    }
}

// Función para mostrar turnos en la tabla
function mostrarTurnos(turnos) {
    const tbody = document.getElementById('cuerpo-tabla-reservas');
    if (!tbody) {
        console.error('No se encontró la tabla de turnos');
        return;
    }
    
    if (turnos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 20px;">
                    No tienes turnos registrados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = turnos.map(turno => `
        <tr>
            <td>${turno.TurnoID}</td>
            <td>${obtenerNombreEmpleado(turno.EmpleadoID)}</td>
            <td>${obtenerNombreServicio(turno.ServicioID)}</td>
            <td>${formatearFecha(turno.Fecha)}</td>
            <td>${turno.HoraInicio}</td>
            <td>${turno.HoraFin}</td>
            <td>
                <span class="estado-${turno.Estado.toLowerCase()}">
                    ${formatearEstado(turno.Estado)}
                </span>
            </td>
            <td>
                ${turno.Estado === 'pendiente' || turno.Estado === 'confirmado' ? 
                    `<button class="btn-cancelar" onclick="cancelarTurno(${turno.TurnoID})">
                        Cancelar
                    </button>` : 
                    ''}
            </td>
            <td>${formatearFecha(turno.FechaModificacion || turno.Fecha)}</td>
            <td>
                ${turno.Estado === 'pendiente' ? 
                    `<button class="btn-editar" onclick="editarTurno(${turno.TurnoID})">
                        Editar
                    </button>` : 
                    ''}
            </td>
        </tr>
    `).join('');
}

// Función para obtener nombre del empleado
async function obtenerNombreEmpleado(empleadoId) {
    try {
        const result = await apiService.getEmpleado(empleadoId);
        if (result.success && result.data) {
            return `${result.data.Nombre} ${result.data.Apellido}`;
        }
        return 'Empleado no encontrado';
    } catch (error) {
        return 'Empleado no encontrado';
    }
}

// Función para obtener nombre del servicio
async function obtenerNombreServicio(servicioId) {
    try {
        const result = await apiService.getServicio(servicioId);
        if (result.success && result.data) {
            return result.data.Nombre;
        }
        return 'Servicio no encontrado';
    } catch (error) {
        return 'Servicio no encontrado';
    }
}

// Función para formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES');
}

// Función para formatear estado
function formatearEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'confirmado': 'Confirmado',
        'cancelado': 'Cancelado',
        'completado': 'Completado'
    };
    return estados[estado] || estado;
}

// Función para cancelar un turno
async function cancelarTurno(turnoId) {
    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
        try {
            const result = await turnosService.cancelarTurno(turnoId);
            
            if (result.success) {
                showApiSuccess('Turno cancelado exitosamente');
                // Recargar la lista de turnos
                const user = authService.getCurrentUser();
                await cargarTurnosCliente(user.id);
            } else {
                showApiError(result.message || 'Error al cancelar el turno');
            }
        } catch (error) {
            console.error('Error al cancelar el turno:', error);
            showApiError('Error al cancelar el turno');
        }
    }
}

// Función para editar un turno
function editarTurno(turnoId) {
    // Por ahora, redirigir a la página de registro con el ID del turno
    window.location.href = `registrar_turno.html?edit=${turnoId}`;
}

// Función para crear nuevo turno
function crearNuevoTurno() {
    window.location.href = 'registrar_turno.html';
}

// Función para cerrar sesión
function cerrarSesion() {
    authService.logout();
}

// Función para ir al inicio
function irAlInicio() {
    window.location.href = 'index.html';
} 
document.addEventListener('DOMContentLoaded', cargarTurnos); 