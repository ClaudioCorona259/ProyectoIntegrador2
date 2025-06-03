// Verificar si el usuario está autenticado como empleado
function checkEmployeeAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'empleado') {
        window.location.href = 'login.html';
    }
}

// Cargar los turnos del empleado
async function loadTurns() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:3000/api/Turnos/Empleado/${user.id}`, {
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
            <td>${turn.ClienteNombre}</td>
            <td>${turn.ServicioNombre}</td>
            <td>${formatDate(turn.Fecha)}</td>
            <td>${formatTime(turn.HoraInicio)}</td>
            <td>${formatTime(turn.HoraFin)}</td>
            <td>${turn.Estado}</td>
            <td>${formatDateTime(turn.FechaModificacion)}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="updateTurnStatus(${turn.TurnoID})">Actualizar Estado</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
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

// Actualizar estado del turno
async function updateTurnStatus(turnId) {
    const newStatus = document.getElementById('turnStatus').value;
    const notes = document.getElementById('statusNotes').value;

    try {
        const response = await fetch(`http://localhost:3000/api/Turnos/${turnId}/Estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newStatus)
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkEmployeeAuth();
    loadTurns();

    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);

    // Formulario de estado
    document.getElementById('statusForm').addEventListener('submit', handleStatusForm);

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}); 