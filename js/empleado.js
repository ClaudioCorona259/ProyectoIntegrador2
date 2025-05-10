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