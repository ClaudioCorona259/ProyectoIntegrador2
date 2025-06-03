// Verificar si el usuario está autenticado como cliente
function checkClientAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'cliente') {
        window.location.href = 'login.html';
    }
}

// Cargar los turnos del cliente
async function loadTurns() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:3000/api/Turnos/Cliente/${user.id}`, {
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
            <td>${turn.TurnoID}</td>
            <td>${turn.ServicioNombre}</td>
            <td>${turn.EmpleadoNombre}</td>
            <td>${formatDate(turn.Fecha)}</td>
            <td>${formatTime(turn.HoraInicio)}</td>
            <td>${formatTime(turn.HoraFin)}</td>
            <td>${turn.Estado}</td>
            <td>${formatDateTime(turn.FechaModificacion)}</td>
            <td class="action-buttons">
                ${turn.Estado === 'Pendiente' ? 
                    `<button class="btn-cancel" onclick="openCancelModal(${turn.TurnoID})">Cancelar</button>` : 
                    ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Cargar servicios disponibles
async function loadServices() {
    try {
        const response = await fetch('http://localhost:3000/api/Servicios', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const services = await response.json();
        const select = document.getElementById('service');
        select.innerHTML = '<option value="">Seleccione un servicio</option>';
        services.forEach(service => {
            select.innerHTML += `<option value="${service.ServicioID}">${service.Nombre} - $${service.Precio}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        alert('Error al cargar la lista de servicios');
    }
}

// Cargar empleados disponibles
async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:3000/api/Empleados', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const employees = await response.json();
        const select = document.getElementById('employee');
        select.innerHTML = '<option value="">Seleccione un empleado</option>';
        employees.forEach(employee => {
            select.innerHTML += `<option value="${employee.EmpleadoID}">${employee.Nombre} ${employee.Apellido}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        alert('Error al cargar la lista de empleados');
    }
}

// Crear nuevo turno
async function createTurn(turnData) {
    try {
        const response = await fetch('http://localhost:3000/api/Turnos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(turnData)
        });

        if (response.ok) {
            closeNewTurnModal();
            loadTurns();
            alert('Turno creado exitosamente');
        } else {
            throw new Error('Error al crear turno');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el turno');
    }
}

// Cancelar turno
async function cancelTurn(turnId, reason) {
    try {
        const response = await fetch(`http://localhost:3000/api/Turnos/${turnId}/Cancelar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ motivo: reason })
        });

        if (response.ok) {
            closeCancelModal();
            loadTurns();
            alert('Turno cancelado exitosamente');
        } else {
            throw new Error('Error al cancelar turno');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cancelar el turno');
    }
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
}

// Formatear hora
function formatTime(timeString) {
    return timeString.substring(0, 5);
}

// Formatear fecha y hora
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-AR');
}

// Funciones del modal de nuevo turno
function openNewTurnModal() {
    document.getElementById('newTurnModal').style.display = 'block';
    loadServices();
    loadEmployees();
}

function closeNewTurnModal() {
    document.getElementById('newTurnModal').style.display = 'none';
    document.getElementById('newTurnForm').reset();
}

// Funciones del modal de cancelación
function openCancelModal(turnId) {
    document.getElementById('cancelTurnModal').style.display = 'block';
    document.getElementById('cancelTurnForm').dataset.turnId = turnId;
}

function closeCancelModal() {
    document.getElementById('cancelTurnModal').style.display = 'none';
    document.getElementById('cancelTurnForm').reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkClientAuth();
    loadTurns();

    // Modal de nuevo turno
    document.querySelector('#newTurnModal .close').addEventListener('click', closeNewTurnModal);
    document.getElementById('newTurnForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const turnData = {
            ClienteID: user.id,
            EmpleadoID: document.getElementById('employee').value,
            ServicioID: document.getElementById('service').value,
            Fecha: document.getElementById('date').value,
            HoraInicio: document.getElementById('time').value
        };
        await createTurn(turnData);
    });

    // Modal de cancelación
    document.querySelector('#cancelTurnModal .close').addEventListener('click', closeCancelModal);
    document.getElementById('cancelTurnForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const turnId = e.target.dataset.turnId;
        const reason = document.getElementById('cancelReason').value;
        await cancelTurn(turnId, reason);
    });

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}); 