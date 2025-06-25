// Verificar si el usuario está autenticado como administrador
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Cargar la lista de empleados
async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:62239/api/empleados', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.success) {
            displayEmployees(result.data);
        } else {
            console.error('Error al cargar empleados:', result.message);
            alert('Error al cargar la lista de empleados');
        }
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        alert('Error al cargar la lista de empleados');
    }
}

// Mostrar empleados en la tabla
function displayEmployees(employees) {
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';

    employees.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.empleadoID}</td>
            <td>${employee.apellido} ${employee.nombre}</td>
            <td>${employee.email}</td>
            <td>${employee.especialidad}</td>
            <td>${employee.telefono}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editEmployee(${employee.empleadoID})">Editar</button>
                <button class="btn-delete" onclick="deleteEmployee(${employee.empleadoID})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Manejar el formulario de empleado
async function handleEmployeeForm(event) {
    event.preventDefault();
    
    const employeeData = {
        apellido: document.getElementById('employeeApellido').value,
        nombre: document.getElementById('employeeNombre').value,
        telefono: document.getElementById('employeeTelefono').value,
        email: document.getElementById('employeeEmail').value,
        especialidad: document.getElementById('employeeEspecialidad').value
    };

    try {
        const response = await fetch('http://localhost:62239/api/empleados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });

        const result = await response.json();
        if (result.success) {
            closeModal();
            loadEmployees();
            alert('Empleado agregado exitosamente');
        } else {
            throw new Error(result.message || 'Error al agregar empleado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar empleado: ' + error.message);
    }
}

// Eliminar empleado
async function deleteEmployee(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:62239/api/empleados/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            loadEmployees();
            alert('Empleado eliminado exitosamente');
        } else {
            throw new Error(result.message || 'Error al eliminar empleado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar empleado: ' + error.message);
    }
}

// Editar empleado
async function editEmployee(id) {
    try {
        const response = await fetch(`http://localhost:62239/api/empleados/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        
        if (result.success) {
            const employee = result.data;
            document.getElementById('modalTitle').textContent = 'Editar Empleado';
            document.getElementById('employeeApellido').value = employee.apellido;
            document.getElementById('employeeNombre').value = employee.nombre;
            document.getElementById('employeeTelefono').value = employee.telefono;
            document.getElementById('employeeEmail').value = employee.email;
            document.getElementById('employeeEspecialidad').value = employee.especialidad;
            
            openModal();
        } else {
            throw new Error(result.message || 'Error al cargar datos del empleado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar datos del empleado: ' + error.message);
    }
}

// Funciones del modal
function openModal() {
    document.getElementById('employeeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
    document.getElementById('employeeForm').reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authService.getCurrentUser();
    
    // Solo administradores pueden acceder
    if (user.role !== 'admin') {
        showApiError('Acceso denegado');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Cargar datos del dashboard
    await cargarDashboard();
    
    // Configurar eventos
    configurarEventos();
});

// Función para cargar el dashboard
async function cargarDashboard() {
    try {
        // Cargar estadísticas
        await cargarEstadisticas();
        
        // Cargar turnos recientes
        await cargarTurnosRecientes();
        
        // Cargar clientes recientes
        await cargarClientesRecientes();
        
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
        showApiError('Error al cargar el dashboard');
    }
}

// Función para cargar estadísticas
async function cargarEstadisticas() {
    try {
        const [turnosResult, clientesResult, empleadosResult, serviciosResult] = await Promise.all([
            apiService.getTurnos(),
            apiService.getClientes(),
            apiService.getEmpleados(),
            apiService.getServicios()
        ]);

        const estadisticas = {
            totalTurnos: turnosResult.success ? turnosResult.data.length : 0,
            totalClientes: clientesResult.success ? clientesResult.data.length : 0,
            totalEmpleados: empleadosResult.success ? empleadosResult.data.length : 0,
            totalServicios: serviciosResult.success ? serviciosResult.data.length : 0
        };

        mostrarEstadisticas(estadisticas);
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Mostrar estadísticas en el dashboard
function mostrarEstadisticas(estadisticas) {
    const statsContainer = document.getElementById('statsContainer');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>${estadisticas.totalTurnos}</h3>
                <p>Turnos Totales</p>
            </div>
            <div class="stat-card">
                <h3>${estadisticas.totalClientes}</h3>
                <p>Clientes Registrados</p>
            </div>
            <div class="stat-card">
                <h3>${estadisticas.totalEmpleados}</h3>
                <p>Empleados Activos</p>
            </div>
            <div class="stat-card">
                <h3>${estadisticas.totalServicios}</h3>
                <p>Servicios Disponibles</p>
            </div>
        `;
    }
}

// Cargar turnos recientes
async function cargarTurnosRecientes() {
    try {
        const result = await apiService.getTurnos();
        if (result.success && result.data) {
            const turnosRecientes = result.data.slice(0, 5); // Últimos 5 turnos
            mostrarTurnosRecientes(turnosRecientes);
        }
    } catch (error) {
        console.error('Error al cargar turnos recientes:', error);
    }
}

// Mostrar turnos recientes
function mostrarTurnosRecientes(turnos) {
    const turnosContainer = document.getElementById('recentTurnos');
    if (turnosContainer) {
        if (turnos.length === 0) {
            turnosContainer.innerHTML = '<p>No hay turnos recientes</p>';
            return;
        }

        let html = '<div class="recent-list">';
        turnos.forEach(turno => {
            html += `
                <div class="recent-item" onclick="verDetallesTurno(${turno.TurnoID})">
                    <div class="item-info">
                        <h4>Turno #${turno.TurnoID}</h4>
                        <p>Fecha: ${formatearFecha(turno.Fecha)}</p>
                        <p>Hora: ${turno.HoraInicio} - ${turno.HoraFin}</p>
                    </div>
                    <div class="item-status">
                        <span class="status-badge status-${turno.Estado}">${formatearEstado(turno.Estado)}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        turnosContainer.innerHTML = html;
    }
}

// Cargar clientes recientes
async function cargarClientesRecientes() {
    try {
        const result = await apiService.getClientes();
        if (result.success && result.data) {
            const clientesRecientes = result.data.slice(0, 5); // Últimos 5 clientes
            mostrarClientesRecientes(clientesRecientes);
        }
    } catch (error) {
        console.error('Error al cargar clientes recientes:', error);
    }
}

// Mostrar clientes recientes
function mostrarClientesRecientes(clientes) {
    const clientesContainer = document.getElementById('recentClientes');
    if (clientesContainer) {
        if (clientes.length === 0) {
            clientesContainer.innerHTML = '<p>No hay clientes registrados</p>';
            return;
        }

        let html = '<div class="recent-list">';
        clientes.forEach(cliente => {
            html += `
                <div class="recent-item" onclick="verDetallesCliente(${cliente.ClienteID})">
                    <div class="item-info">
                        <h4>${cliente.Apellido}, ${cliente.Nombre}</h4>
                        <p>Tel: ${cliente.Telefono}</p>
                        <p>Email: ${cliente.Email}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        clientesContainer.innerHTML = html;
    }
}

// Funciones de utilidad
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES');
}

function formatearEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'confirmado': 'Confirmado',
        'completado': 'Completado',
        'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
}

// Configurar eventos del dashboard
function configurarEventos() {
    // Botón de refrescar
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refrescarDashboard);
    }

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', cerrarSesion);
    }

    // Botón de ir al inicio
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', irAlInicio);
    }
}

// Funciones de navegación
function verDetallesTurno(turnoId) {
    // Implementar vista de detalles del turno
    console.log('Ver detalles del turno:', turnoId);
}

function verDetallesCliente(clienteId) {
    // Implementar vista de detalles del cliente
    console.log('Ver detalles del cliente:', clienteId);
}

function cerrarSesion() {
    authService.logout();
    window.location.href = 'index.html';
}

function irAlInicio() {
    window.location.href = 'index.html';
}

async function refrescarDashboard() {
    await cargarDashboard();
    showApiSuccess('Dashboard actualizado');
}

// Funciones para mostrar mensajes
function showApiSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showApiError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
} 