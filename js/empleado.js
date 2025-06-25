// Verificar si el usuario está autenticado como empleado
function checkEmployeeAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'empleado') {
        window.location.href = 'login.html';
    }
}

// Cargar los turnos asignados al empleado
async function loadTurns() {
    try {
        const response = await fetch('http://localhost:3000/api/turns/employee', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const turns = await response.json();
        displayTurns(turns);
    } catch (error) {
        console.error('Error al cargar turnos:', error);
        alert('Error al cargar la lista de turnos');
    }
}

// Mostrar turnos en la tabla
function displayTurns(turns) {
    const tbody = document.getElementById('turnsTableBody');
    tbody.innerHTML = '';

    turns.forEach(turn => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${turn.id}</td>
            <td>${turn.clientName}</td>
            <td>${formatDate(turn.date)}</td>
            <td>${turn.time}</td>
            <td>${turn.service}</td>
            <td>${formatStatus(turn.status)}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="updateTurnStatus(${turn.id})">Actualizar Estado</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Formatear estado
function formatStatus(status) {
    const statusMap = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completado': 'Completado',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Actualizar estado del turno
async function updateTurnStatus(turnId) {
    try {
        const response = await fetch(`http://localhost:3000/api/turns/${turnId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const turn = await response.json();
        
        document.getElementById('turnStatus').value = turn.status;
        document.getElementById('statusNotes').value = turn.notes || '';
        
        // Guardar el ID del turno en el formulario
        document.getElementById('statusForm').dataset.turnId = turnId;
        
        openModal();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar datos del turno');
    }
}

// Manejar el formulario de actualización de estado
async function handleStatusForm(event) {
    event.preventDefault();
    
    const turnId = event.target.dataset.turnId;
    const statusData = {
        status: document.getElementById('turnStatus').value,
        notes: document.getElementById('statusNotes').value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/turns/${turnId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(statusData)
        });

        if (response.ok) {
            closeModal();
            loadTurns();
            alert('Estado actualizado exitosamente');
        } else {
            throw new Error('Error al actualizar estado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar estado');
    }
}

// Funciones del modal
function openModal() {
    document.getElementById('statusModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
    document.getElementById('statusForm').reset();
}

// Funcionalidad para empleados
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authService.getCurrentUser();
    
    // Solo empleados pueden acceder
    if (user.role !== 'empleado') {
        showApiError('Acceso denegado');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Cargar turnos del empleado
    await cargarTurnosEmpleado(user.id);
    
    // Configurar filtros
    configurarFiltros();
});

// Función para cargar los turnos del empleado
async function cargarTurnosEmpleado(empleadoId) {
    try {
        const result = await turnosService.getTurnosEmpleado(empleadoId);
        
        if (result.success && result.data) {
            mostrarTurnosEmpleado(result.data);
        } else {
            mostrarTurnosEmpleado([]);
            if (result.message) {
                showApiError(result.message);
            }
        }
    } catch (error) {
        console.error('Error al cargar los turnos:', error);
        showApiError('Error al cargar los turnos');
        mostrarTurnosEmpleado([]);
    }
}

// Función para mostrar turnos del empleado en la tabla
function mostrarTurnosEmpleado(turnos) {
    const tbody = document.getElementById('cuerpo-tabla-turnos');
    if (!tbody) {
        console.error('No se encontró la tabla de turnos');
        return;
    }
    
    if (turnos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px;">
                    No tienes turnos asignados
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = turnos.map(turno => `
        <tr>
            <td>${turno.TurnoID}</td>
            <td>${obtenerNombreCliente(turno.ClienteID)}</td>
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
                ${turno.Estado === 'pendiente' ? 
                    `<button class="btn-confirmar" onclick="confirmarTurno(${turno.TurnoID})">
                        Confirmar
                    </button>` : 
                    ''}
                ${turno.Estado === 'confirmado' ? 
                    `<button class="btn-completar" onclick="completarTurno(${turno.TurnoID})">
                        Completar
                    </button>` : 
                    ''}
            </td>
            <td>${formatearFecha(turno.FechaModificacion || turno.Fecha)}</td>
        </tr>
    `).join('');
}

// Función para obtener nombre del cliente
async function obtenerNombreCliente(clienteId) {
    try {
        const result = await apiService.getCliente(clienteId);
        if (result.success && result.data) {
            return `${result.data.Nombre} ${result.data.Apellido}`;
        }
        return 'Cliente no encontrado';
    } catch (error) {
        return 'Cliente no encontrado';
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

// Función para confirmar un turno
async function confirmarTurno(turnoId) {
    if (confirm('¿Estás seguro de que deseas confirmar este turno?')) {
        try {
            const result = await turnosService.actualizarEstadoTurno(turnoId, 'confirmado');
            
            if (result.success) {
                showApiSuccess('Turno confirmado exitosamente');
                // Recargar la lista de turnos
                const user = authService.getCurrentUser();
                await cargarTurnosEmpleado(user.id);
            } else {
                showApiError(result.message || 'Error al confirmar el turno');
            }
        } catch (error) {
            console.error('Error al confirmar el turno:', error);
            showApiError('Error al confirmar el turno');
        }
    }
}

// Función para completar un turno
async function completarTurno(turnoId) {
    if (confirm('¿Estás seguro de que deseas marcar este turno como completado?')) {
        try {
            const result = await turnosService.actualizarEstadoTurno(turnoId, 'completado');
            
            if (result.success) {
                showApiSuccess('Turno completado exitosamente');
                // Recargar la lista de turnos
                const user = authService.getCurrentUser();
                await cargarTurnosEmpleado(user.id);
            } else {
                showApiError(result.message || 'Error al completar el turno');
            }
        } catch (error) {
            console.error('Error al completar el turno:', error);
            showApiError('Error al completar el turno');
        }
    }
}

// Función para configurar filtros
function configurarFiltros() {
    const filtroFecha = document.getElementById('filtroFecha');
    const filtroEstado = document.getElementById('filtroEstado');
    
    if (filtroFecha) {
        filtroFecha.addEventListener('change', aplicarFiltros);
    }
    
    if (filtroEstado) {
        filtroEstado.addEventListener('change', aplicarFiltros);
    }
}

// Función para aplicar filtros
async function aplicarFiltros() {
    const user = authService.getCurrentUser();
    const filtroFecha = document.getElementById('filtroFecha')?.value;
    const filtroEstado = document.getElementById('filtroEstado')?.value;
    
    try {
        let result;
        
        if (filtroFecha) {
            result = await turnosService.getTurnosPorFecha(filtroFecha);
            if (result.success && result.data) {
                // Filtrar por empleado
                result.data = result.data.filter(t => t.EmpleadoID === user.id);
            }
        } else {
            result = await turnosService.getTurnosEmpleado(user.id);
        }
        
        if (result.success && result.data) {
            let turnosFiltrados = result.data;
            
            // Aplicar filtro de estado si está seleccionado
            if (filtroEstado && filtroEstado !== 'todos') {
                turnosFiltrados = turnosFiltrados.filter(t => t.Estado === filtroEstado);
            }
            
            mostrarTurnosEmpleado(turnosFiltrados);
        } else {
            mostrarTurnosEmpleado([]);
        }
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        showApiError('Error al aplicar filtros');
    }
}

// Función para limpiar filtros
function limpiarFiltros() {
    const filtroFecha = document.getElementById('filtroFecha');
    const filtroEstado = document.getElementById('filtroEstado');
    
    if (filtroFecha) filtroFecha.value = '';
    if (filtroEstado) filtroEstado.value = 'todos';
    
    // Recargar todos los turnos
    const user = authService.getCurrentUser();
    cargarTurnosEmpleado(user.id);
}

// Función para cerrar sesión
function cerrarSesion() {
    authService.logout();
}

// Función para ir al inicio
function irAlInicio() {
    window.location.href = 'index.html';
}

// Función para ver detalles del turno
function verDetallesTurno(turnoId) {
    // Por ahora, mostrar en un alert
    alert(`Detalles del turno ${turnoId}`);
    // En el futuro, podría abrir un modal con más información
} 