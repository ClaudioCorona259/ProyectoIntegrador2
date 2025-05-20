// Función para cargar los turnos del cliente
async function cargarTurnos() {
    try {
        const response = await fetch('/api/turnos/cliente');
        const turnos = await response.json();
        const tbody = document.getElementById('cuerpo-tabla-reservas');
        
        tbody.innerHTML = turnos.map(turno => `
            <tr>
                <td>${turno.id}</td>
                <td>${turno.empleado}</td>
                <td>${turno.servicio}</td>
                <td>${turno.fecha}</td>
                <td>${turno.horaInicio}</td>
                <td>${turno.horaFin}</td>
                <td>${turno.estado}</td>
                <td>
                    ${turno.estado === 'PENDIENTE' || turno.estado === 'CONFIRMADO' ? 
                        `<button class="btn-cancelar" onclick="cancelarTurno(${turno.id})">
                            Cancelar
                        </button>` : 
                        ''}
                </td>
                <td>${turno.fechaModificacion}</td>
                <td>${turno.acciones || ''}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar los turnos:', error);
    }
}

// Función para cancelar un turno
async function cancelarTurno(turnoId) {
    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
        try {
            const response = await fetch(`/api/turnos/${turnoId}/cancelar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Turno cancelado exitosamente');
                cargarTurnos(); // Recargar la lista de turnos
            } else {
                alert('Error al cancelar el turno');
            }
        } catch (error) {
            console.error('Error al cancelar el turno:', error);
            alert('Error al cancelar el turno');
        }
    }
}

// Cargar los turnos cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarTurnos); 