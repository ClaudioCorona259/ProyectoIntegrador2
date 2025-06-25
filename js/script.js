document.addEventListener('DOMContentLoaded', function () {
    const tablaReservas = document.getElementById('tabla-reservas');
    const cuerpoTablaReservas = document.getElementById('cuerpo-tabla-reservas');
    const mensajeSinReservas = document.getElementById('mensaje-sin-reservas');
    const formularioGestionReserva = document.getElementById('formulario-gestion-reserva');
    const modificarReservaForm = document.getElementById('modificarReservaForm');
    const cartelCancelar = document.getElementById('cartel-cancelar');
    const btnConfirmarCancelar = document.getElementById('btnConfirmarCancelar');
    const reservaIdCancelarInput = document.getElementById('reservaIdCancelar');

    // URL de la API de turnos
    const API_TURNOS_URL = 'http://localhost:62239/api/turnos';

    // Función para cargar las reservas del usuario
    async function cargarReservas() {
        try {
            // Obtener usuario actual del localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                console.error('Usuario no autenticado');
                return;
            }

            const response = await fetch(`${API_TURNOS_URL}/cliente/${user.id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const turnos = result.data || [];

            if (turnos.length > 0) {
                mensajeSinReservas.style.display = 'none';
                tablaReservas.style.display = 'table';
                cuerpoTablaReservas.innerHTML = '';
                
                turnos.forEach(turno => {
                    const row = cuerpoTablaReservas.insertRow();
                    row.insertCell().textContent = turno.Id;
                    row.insertCell().textContent = turno.Cliente?.Nombre || 'N/A';
                    row.insertCell().textContent = turno.Cliente?.Apellido || 'N/A';
                    row.insertCell().textContent = turno.Servicio?.Nombre || 'N/A';
                    row.insertCell().textContent = turno.Fecha;
                    row.insertCell().textContent = turno.HoraInicio;
                    
                    const accionesCell = row.insertCell();
                    
                    const btnModificar = document.createElement('button');
                    btnModificar.textContent = 'Modificar';
                    btnModificar.classList.add('button', 'secondary-small');
                    btnModificar.addEventListener('click', () => mostrarFormularioModificar(turno.Id));
                    accionesCell.appendChild(btnModificar);
                    
                    const btnEliminar = document.createElement('button');
                    btnEliminar.textContent = 'Eliminar';
                    btnEliminar.classList.add('button', 'danger-small');
                    btnEliminar.addEventListener('click', () => mostrarCartelCancelar(turno.Id));
                    accionesCell.appendChild(btnEliminar);
                });
            } else {
                tablaReservas.style.display = 'none';
                mensajeSinReservas.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar las reservas:', error);
            alert('No se pudieron cargar tus reservas. Por favor, intenta nuevamente más tarde.');
        }
    }

    // Función para mostrar el formulario de modificación con los datos de la reserva
    async function mostrarFormularioModificar(turnoId) {
        try {
            const response = await fetch(`${API_TURNOS_URL}/${turnoId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const turno = result.data;

            document.getElementById('reservaIdModificar').value = turno.Id;
            document.getElementById('nombreModificar').value = turno.Cliente?.Nombre || '';
            document.getElementById('apellidoModificar').value = turno.Cliente?.Apellido || '';
            document.getElementById('servicioModificar').value = turno.ServicioId || '';
            document.getElementById('fechaModificar').value = turno.Fecha;
            document.getElementById('horaModificar').value = turno.HoraInicio;
            
            formularioGestionReserva.style.display = 'block';
            document.getElementById('lista-reservas').style.display = 'none';
        } catch (error) {
            console.error('Error al obtener los detalles de la reserva:', error);
            alert('No se pudieron cargar los detalles de la reserva.');
        }
    }

    // Función para guardar los cambios de la reserva
    modificarReservaForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const turnoId = document.getElementById('reservaIdModificar').value;
        const nombre = document.getElementById('nombreModificar').value;
        const apellido = document.getElementById('apellidoModificar').value;
        const servicioId = document.getElementById('servicioModificar').value;
        const fecha = document.getElementById('fechaModificar').value;
        const hora = document.getElementById('horaModificar').value;

        const datosModificados = {
            Fecha: fecha,
            HoraInicio: hora,
            ServicioId: parseInt(servicioId)
        };

        try {
            const response = await fetch(`${API_TURNOS_URL}/${turnoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosModificados)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Reserva modificada con éxito.');
            formularioGestionReserva.style.display = 'none';
            document.getElementById('lista-reservas').style.display = 'block';
            cargarReservas(); // Recargar la lista de reservas
        } catch (error) {
            console.error('Error al modificar la reserva:', error);
            alert('No se pudo modificar la reserva.');
        }
    });

    // Función para mostrar el cartel de cancelar
    function mostrarCartelCancelar(turnoId) {
        reservaIdCancelarInput.value = turnoId;
        cartelCancelar.style.display = 'flex';
    }

    // Función para ocultar el cartel de cancelar
    function ocultarCartelCancelar() {
        cartelCancelar.style.display = 'none';
    }

    // Función para confirmar la cancelación de la reserva
    btnConfirmarCancelar.addEventListener('click', async function () {
        const turnoId = reservaIdCancelarInput.value;
        
        try {
            const response = await fetch(`${API_TURNOS_URL}/${turnoId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Reserva cancelada con éxito.');
            cartelCancelar.style.display = 'none';
            cargarReservas(); // Recargar la lista de reservas
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
            alert('No se pudo cancelar la reserva.');
        }
    });

    // Función para ocultar el formulario de modificar
    function ocultarFormularioModificar() {
        formularioGestionReserva.style.display = 'none';
        document.getElementById('lista-reservas').style.display = 'block';
    }

    // Cargar las reservas al cargar la página
    cargarReservas();
});

document.addEventListener('DOMContentLoaded', function () {
    const nuevaReservaForm = document.getElementById('nuevaReservaForm');

    nuevaReservaForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombreNueva').value;
        const apellido = document.getElementById('apellidoNueva').value;
        const servicio = document.getElementById('servicioNueva').value;
        const fecha = document.getElementById('fechaNueva').value;
        const hora = document.getElementById('horaNueva').value;

        // Obtener usuario actual del localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Usuario no autenticado');
            return;
        }

        const nuevaReservaData = {
            ClienteId: user.id,
            ServicioId: parseInt(servicio),
            Fecha: fecha,
            HoraInicio: hora,
            EstadoId: 1 // Estado pendiente
        };

        try {
            const response = await fetch('http://localhost:62239/api/turnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaReservaData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Reserva creada con éxito.');
            
            // Limpiar formulario
            nuevaReservaForm.reset();
            
            // Recargar la lista de reservas si existe
            if (typeof cargarReservas === 'function') {
                cargarReservas();
            }
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            alert('No se pudo crear la reserva.');
        }
    });
});