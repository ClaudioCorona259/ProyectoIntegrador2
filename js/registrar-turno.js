// Funcionalidad para registrar turnos
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authService.getCurrentUser();
    
    // Solo clientes pueden registrar turnos
    if (user.role !== 'cliente') {
        showApiError('Solo los clientes pueden registrar turnos');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Cargar información del cliente
    await cargarInformacionCliente(user.id);
    
    // Cargar servicios y empleados
    await cargarServicios();
    await cargarEmpleados();
    
    // Configurar fecha mínima (hoy)
    configurarFechaMinima();
    
    // Configurar evento del formulario
    configurarFormulario();
});

// Cargar información del cliente
async function cargarInformacionCliente(clienteId) {
    try {
        const result = await apiService.getCliente(clienteId);
        if (result.success && result.data) {
            const cliente = result.data;
            document.getElementById('nombre').value = `${cliente.Nombre} ${cliente.Apellido}`;
            document.getElementById('email').value = cliente.Email;
            document.getElementById('tel').value = cliente.Telefono || '';
        }
    } catch (error) {
        console.error('Error al cargar información del cliente:', error);
        showApiError('Error al cargar información del cliente');
    }
}

// Cargar servicios disponibles
async function cargarServicios() {
    try {
        const servicios = await turnosService.cargarServicios();
        const selectServicio = document.getElementById('servicio');
        
        servicios.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio.ServicioID;
            option.textContent = `${servicio.Nombre} - $${servicio.Precio}`;
            selectServicio.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        showApiError('Error al cargar servicios');
    }
}

// Cargar empleados disponibles
async function cargarEmpleados() {
    try {
        const empleados = await turnosService.cargarEmpleados();
        const selectEmpleado = document.getElementById('empleado');
        
        empleados.forEach(empleado => {
            const option = document.createElement('option');
            option.value = empleado.EmpleadoID;
            option.textContent = `${empleado.Nombre} ${empleado.Apellido}`;
            selectEmpleado.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        showApiError('Error al cargar empleados');
    }
}

// Configurar fecha mínima (hoy)
function configurarFechaMinima() {
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
    fechaInput.value = hoy;
}

// Configurar evento del formulario
function configurarFormulario() {
    const form = document.getElementById('turnoForm');
    form.addEventListener('submit', handleSubmitTurno);
    
    // Configurar hora fin automática
    const horaInicioInput = document.getElementById('horaInicio');
    const horaFinInput = document.getElementById('horaFin');
    
    horaInicioInput.addEventListener('change', () => {
        if (horaInicioInput.value) {
            // Calcular hora fin (1 hora después por defecto)
            const horaInicio = new Date(`2000-01-01T${horaInicioInput.value}`);
            const horaFin = new Date(horaInicio.getTime() + 60 * 60 * 1000); // +1 hora
            horaFinInput.value = horaFin.toTimeString().slice(0, 5);
        }
    });
}

// Manejar envío del formulario
async function handleSubmitTurno(event) {
    event.preventDefault();
    
    const user = authService.getCurrentUser();
    const formData = new FormData(event.target);
    
    const turnoData = {
        ClienteID: user.id,
        EmpleadoID: parseInt(formData.get('empleado')),
        ServicioID: parseInt(formData.get('servicio')),
        Fecha: formData.get('fecha'),
        HoraInicio: formData.get('horaInicio'),
        HoraFin: formData.get('horaFin'),
        Estado: 'pendiente'
    };
    
    // Validar datos
    const validacion = turnosService.validarTurno(turnoData);
    if (!validacion.valido) {
        showApiError(validacion.errores.join(', '));
        return;
    }
    
    // Verificar disponibilidad
    const disponibilidad = await turnosService.verificarDisponibilidad(
        turnoData.EmpleadoID,
        turnoData.Fecha,
        turnoData.HoraInicio,
        turnoData.HoraFin
    );
    
    if (!disponibilidad.disponible) {
        showApiError(disponibilidad.mensaje);
        return;
    }
    
    // Mostrar loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creando turno...';
    submitBtn.disabled = true;
    
    try {
        const result = await turnosService.crearTurno(turnoData);
        
        if (result.success) {
            showApiSuccess('Turno creado exitosamente');
            setTimeout(() => {
                window.location.href = 'turnos_clientes.html';
            }, 2000);
        } else {
            showApiError(result.message || 'Error al crear el turno');
        }
    } catch (error) {
        console.error('Error al crear turno:', error);
        showApiError('Error al crear el turno');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Función para mostrar mensajes de error
function showError(message) {
    showApiError(message);
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
    showApiSuccess(message);
} 