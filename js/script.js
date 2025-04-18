document.addEventListener('DOMContentLoaded', function () {
    const tablaReservas = document.getElementById('tabla-reservas');
    const cuerpoTablaReservas = document.getElementById('cuerpo-tabla-reservas');
    const mensajeSinReservas = document.getElementById('mensaje-sin-reservas');
    const formularioGestionReserva = document.getElementById('formulario-gestion-reserva');
    const modificarReservaForm = document.getElementById('modificarReservaForm');
    const cartelCancelar = document.getElementById('cartel-cancelar');
    const btnConfirmarCancelar = document.getElementById('btnConfirmarCancelar');
    const reservaIdCancelarInput = document.getElementById('reservaIdCancelar');

    // Reemplaza con la URL de tu API de reservas
    const API_RESERVAS_URL = 'TU_API_DE_RESERVAS';

    // Función para cargar las reservas del usuario
    function cargarReservas() {
        fetch(`${API_RESERVAS_URL}/usuario/123`) // Reemplaza '123' con el ID del usuario actual
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(reservas => {
                if (reservas.length > 0) {
                    mensajeSinReservas.style.display = 'none';
                    tablaReservas.style.display = 'table';
                    cuerpoTablaReservas.innerHTML = '';
                    reservas.forEach(reserva => {
                        const row = cuerpoTablaReservas.insertRow();
                        row.insertCell().textContent = reserva.id;
                        row.insertCell().textContent = reserva.nombre;
                        row.insertCell().textContent = reserva.apellido;
                        row.insertCell().textContent = reserva.servicio;
                        row.insertCell().textContent = reserva.fecha;
                        row.insertCell().textContent = reserva.hora;
                        const accionesCell = row.insertCell();
                        const btnModificar = document.createElement('button');
                        btnModificar.textContent = 'Modificar';
                        btnModificar.classList.add('button', 'secondary-small');
                        btnModificar.addEventListener('click', () => mostrarFormularioModificar(reserva.id));
                        accionesCell.appendChild(btnModificar);
                        const btnEliminar = document.createElement('button');
                        btnEliminar.textContent = 'Eliminar';
                        btnEliminar.classList.add('button', 'danger-small');
                        btnEliminar.addEventListener('click', () => mostrarCartelCancelar(reserva.id));
                        accionesCell.appendChild(btnEliminar);
                    });
                } else {
                    tablaReservas.style.display = 'none';
                    mensajeSinReservas.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error al cargar las reservas:', error);
                alert('No se pudieron cargar tus reservas. Por favor, intenta nuevamente más tarde.');
            });
    }

    // Función para mostrar el formulario de modificación con los datos de la reserva
    function mostrarFormularioModificar(reservaId) {
        fetch(`${API_RESERVAS_URL}/${reservaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(reserva => {
                document.getElementById('reservaIdModificar').value = reserva.id;
                document.getElementById('nombreModificar').value = reserva.nombre;
                document.getElementById('apellidoModificar').value = reserva.apellido;
                document.getElementById('servicioModificar').value = reserva.servicio;
                document.getElementById('fechaModificar').value = reserva.fecha;
                document.getElementById('horaModificar').value = reserva.hora;
                formularioGestionReserva.style.display = 'block';
                document.getElementById('lista-reservas').style.display = 'none';
            })
            .catch(error => {
                console.error('Error al obtener los detalles de la reserva:', error);
                alert('No se pudieron cargar los detalles de la reserva.');
            });
    }

    // Función para guardar los cambios de la reserva
    modificarReservaForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const reservaId = document.getElementById('reservaIdModificar').value;
        const nombre = document.getElementById('nombreModificar').value;
        const apellido = document.getElementById('apellidoModificar').value;
        const servicio = document.getElementById('servicioModificar').value;
        const fecha = document.getElementById('fechaModificar').value;
        const hora = document.getElementById('horaModificar').value;

        const datosModificados = { nombre, apellido, servicio, fecha, hora };

        fetch(`${API_RESERVAS_URL}/${reservaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosModificados)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Reserva modificada con éxito.');
                formularioGestionReserva.style.display = 'none';
                document.getElementById('lista-reservas').style.display = 'block';
                cargarReservas(); // Recargar la lista de reservas
            })
            .catch(error => {
                console.error('Error al modificar la reserva:', error);
                alert('No se pudo modificar la reserva.');
            });
    });

    // Función para mostrar el cartel de cancelar
    function mostrarCartelCancelar(reservaId) {
        reservaIdCancelarInput.value = reservaId;
        cartelCancelar.style.display = 'flex';
    }

    // Función para ocultar el cartel de cancelar
    function ocultarCartelCancelar() {
        cartelCancelar.style.display = 'none';
    }

    // Función para confirmar la cancelación de la reserva
    btnConfirmarCancelar.addEventListener('click', function () {
        const reservaId = reservaIdCancelarInput.value;
        fetch(`${API_RESERVAS_URL}/${reservaId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Reserva cancelada con éxito.');
                cartelCancelar.style.display = 'none';
                cargarReservas(); // Recargar la lista de reservas
            })
            .catch(error => {
                console.error('Error al cancelar la reserva:', error);
                alert('No se pudo cancelar la reserva.');
            });
    });

    // Función para ocultar el formulario de modificar
    function ocultarFormularioModificar() {
        formularioGestionReserva.style.display = 'none';
        document.getElementById('lista-reservas').style.display = 'block';
    }

    // Cargar las reservas al cargar la página (o cuando el usuario acceda a esta sección)
    cargarReservas();
});

document.addEventListener('DOMContentLoaded', function () {
    // ... (tu código JavaScript existente) ...

    const nuevaReservaForm = document.getElementById('nuevaReservaForm');

    nuevaReservaForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombreNueva').value;
        const apellido = document.getElementById('apellidoNueva').value;
        const servicio = document.getElementById('servicioNueva').value;
        const fecha = document.getElementById('fechaNueva').value;
        const hora = document.getElementById('horaNueva').value;

        const nuevaReservaData = {
            nombre: nombre,
            apellido: apellido,
            servicio: servicio,
            fecha: fecha,
            hora: hora
        };

        const API_RESERVAS_URL = 'TU_API_DE_RESERVAS'; // Asegúrate de que esta URL sea correcta

        fetch(API_RESERVAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaReservaData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Nueva reserva creada con éxito:', data);
                alert('Su reserva ha sido realizada con éxito. Nos pondremos en contacto con usted para confirmarla.');
                nuevaReservaForm.reset();
                cargarReservas(); // Si quieres recargar la lista de reservas después de una nueva reserva
            })
            .catch(error => {
                console.error('Error al crear la nueva reserva:', error);
                alert('Hubo un error al realizar su reserva. Por favor, intente nuevamente más tarde.');
            });
    });

    // ... (el resto de tu código JavaScript para la gestión de reservas) ...
});