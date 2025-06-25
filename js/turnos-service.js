// Servicio para gestión de turnos
class TurnosService {
    constructor() {
        this.apiService = apiService;
    }

    // Cargar servicios disponibles
    async cargarServicios() {
        try {
            const result = await this.apiService.getServicios();
            if (result.success) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            return [];
        }
    }

    // Cargar empleados disponibles
    async cargarEmpleados() {
        try {
            const result = await this.apiService.getEmpleados();
            if (result.success) {
                return result.data.filter(emp => emp.Estado === 'activo');
            }
            return [];
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            return [];
        }
    }

    // Crear nuevo turno
    async crearTurno(turnoData) {
        try {
            const result = await this.apiService.createTurno(turnoData);
            return result;
        } catch (error) {
            console.error('Error al crear turno:', error);
            throw error;
        }
    }

    // Obtener turnos del cliente actual
    async getTurnosCliente(clienteId) {
        try {
            const result = await this.apiService.getTurnosByCliente(clienteId);
            return result;
        } catch (error) {
            console.error('Error al obtener turnos del cliente:', error);
            return { success: false, data: [], message: 'Error al cargar turnos' };
        }
    }

    // Obtener turnos del empleado actual
    async getTurnosEmpleado(empleadoId) {
        try {
            const result = await this.apiService.getTurnosByEmpleado(empleadoId);
            return result;
        } catch (error) {
            console.error('Error al obtener turnos del empleado:', error);
            return { success: false, data: [], message: 'Error al cargar turnos' };
        }
    }

    // Obtener todos los turnos (para admin)
    async getAllTurnos() {
        try {
            const result = await this.apiService.getTurnos();
            return result;
        } catch (error) {
            console.error('Error al obtener todos los turnos:', error);
            return { success: false, data: [], message: 'Error al cargar turnos' };
        }
    }

    // Actualizar estado de turno
    async actualizarEstadoTurno(turnoId, nuevoEstado) {
        try {
            const result = await this.apiService.updateTurnoStatus(turnoId, nuevoEstado);
            return result;
        } catch (error) {
            console.error('Error al actualizar estado del turno:', error);
            throw error;
        }
    }

    // Cancelar turno
    async cancelarTurno(turnoId) {
        try {
            const result = await this.apiService.updateTurnoStatus(turnoId, 'cancelado');
            return result;
        } catch (error) {
            console.error('Error al cancelar turno:', error);
            throw error;
        }
    }

    // Eliminar turno
    async eliminarTurno(turnoId) {
        try {
            const result = await this.apiService.deleteTurno(turnoId);
            return result;
        } catch (error) {
            console.error('Error al eliminar turno:', error);
            throw error;
        }
    }

    // Obtener turnos por fecha
    async getTurnosPorFecha(fecha) {
        try {
            const result = await this.apiService.getTurnosPorFecha(fecha);
            return result;
        } catch (error) {
            console.error('Error al obtener turnos por fecha:', error);
            return { success: false, data: [], message: 'Error al cargar turnos' };
        }
    }

    // Verificar disponibilidad de empleado
    async verificarDisponibilidad(empleadoId, fecha, horaInicio, horaFin) {
        try {
            const turnosFecha = await this.getTurnosPorFecha(fecha);
            if (turnosFecha.success) {
                const turnosEmpleado = turnosFecha.data.filter(t => 
                    t.EmpleadoID === empleadoId && 
                    t.Estado !== 'cancelado'
                );

                // Verificar solapamientos
                for (const turno of turnosEmpleado) {
                    const turnoInicio = new Date(`2000-01-01T${turno.HoraInicio}`);
                    const turnoFin = new Date(`2000-01-01T${turno.HoraFin}`);
                    const nuevoInicio = new Date(`2000-01-01T${horaInicio}`);
                    const nuevoFin = new Date(`2000-01-01T${horaFin}`);

                    if ((nuevoInicio >= turnoInicio && nuevoInicio < turnoFin) ||
                        (nuevoFin > turnoInicio && nuevoFin <= turnoFin) ||
                        (turnoInicio >= nuevoInicio && turnoFin <= nuevoFin)) {
                        return {
                            disponible: false,
                            mensaje: `El empleado ya tiene un turno de ${turno.HoraInicio} a ${turno.HoraFin}`
                        };
                    }
                }
            }
            return { disponible: true };
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            return { disponible: false, mensaje: 'Error al verificar disponibilidad' };
        }
    }

    // Formatear fecha para la API
    formatearFecha(fecha) {
        const d = new Date(fecha);
        return d.toISOString().split('T')[0];
    }

    // Formatear hora para la API
    formatearHora(hora) {
        return hora + ':00';
    }

    // Validar datos del turno
    validarTurno(turnoData) {
        const errores = [];

        if (!turnoData.ClienteID) {
            errores.push('Debe seleccionar un cliente');
        }

        if (!turnoData.EmpleadoID) {
            errores.push('Debe seleccionar un empleado');
        }

        if (!turnoData.ServicioID) {
            errores.push('Debe seleccionar un servicio');
        }

        if (!turnoData.Fecha) {
            errores.push('Debe seleccionar una fecha');
        }

        if (!turnoData.HoraInicio) {
            errores.push('Debe seleccionar una hora de inicio');
        }

        // Validar que la fecha no sea en el pasado
        const fechaSeleccionada = new Date(turnoData.Fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSeleccionada < hoy) {
            errores.push('No puede seleccionar una fecha en el pasado');
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }
}

// Instancia global del servicio de turnos
const turnosService = new TurnosService(); 