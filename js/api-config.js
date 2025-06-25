// Configuración de la API optimizada
const API_CONFIG = {
    BASE_URL: 'http://localhost:62239/api',
    ENDPOINTS: {
        // Clientes
        CLIENTES: '/clientes',
        CLIENTE_BY_ID: (id) => `/clientes/${id}`,
        CLIENTES_BUSCAR: (searchTerm) => `/clientes/buscar?searchTerm=${searchTerm}`,
        
        // Empleados
        EMPLEADOS: '/empleados',
        EMPLEADO_BY_ID: (id) => `/empleados/${id}`,
        EMPLEADOS_BUSCAR: (searchTerm) => `/empleados/buscar?searchTerm=${searchTerm}`,
        
        // Servicios
        SERVICIOS: '/servicios',
        SERVICIO_BY_ID: (id) => `/servicios/${id}`,
        SERVICIOS_BUSCAR: (searchTerm) => `/servicios/buscar?searchTerm=${searchTerm}`,
        
        // Turnos
        TURNOS: '/turnos',
        TURNO_BY_ID: (id) => `/turnos/${id}`,
        TURNOS_POR_FECHA: (fecha) => `/turnos/por-fecha?fecha=${fecha}`,
        TURNO_ESTADO: (id) => `/turnos/${id}/estado`
    }
};

// Clase para manejar las llamadas a la API
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    // Método genérico para hacer peticiones HTTP
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en petición API:', error);
            throw error;
        }
    }

    // Métodos para Clientes
    async getClientes() {
        return this.request(API_CONFIG.ENDPOINTS.CLIENTES);
    }

    async getCliente(id) {
        return this.request(API_CONFIG.ENDPOINTS.CLIENTE_BY_ID(id));
    }

    async createCliente(clienteData) {
        return this.request(API_CONFIG.ENDPOINTS.CLIENTES, {
            method: 'POST',
            body: JSON.stringify(clienteData)
        });
    }

    async updateCliente(id, clienteData) {
        return this.request(API_CONFIG.ENDPOINTS.CLIENTE_BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify(clienteData)
        });
    }

    async deleteCliente(id) {
        return this.request(API_CONFIG.ENDPOINTS.CLIENTE_BY_ID(id), {
            method: 'DELETE'
        });
    }

    async searchClientes(searchTerm) {
        return this.request(API_CONFIG.ENDPOINTS.CLIENTES_BUSCAR(searchTerm));
    }

    // Métodos para Empleados
    async getEmpleados() {
        return this.request(API_CONFIG.ENDPOINTS.EMPLEADOS);
    }

    async getEmpleado(id) {
        return this.request(API_CONFIG.ENDPOINTS.EMPLEADO_BY_ID(id));
    }

    async createEmpleado(empleadoData) {
        return this.request(API_CONFIG.ENDPOINTS.EMPLEADOS, {
            method: 'POST',
            body: JSON.stringify(empleadoData)
        });
    }

    async updateEmpleado(id, empleadoData) {
        return this.request(API_CONFIG.ENDPOINTS.EMPLEADO_BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify(empleadoData)
        });
    }

    async deleteEmpleado(id) {
        return this.request(API_CONFIG.ENDPOINTS.EMPLEADO_BY_ID(id), {
            method: 'DELETE'
        });
    }

    async searchEmpleados(searchTerm) {
        return this.request(API_CONFIG.ENDPOINTS.EMPLEADOS_BUSCAR(searchTerm));
    }

    // Métodos para Servicios
    async getServicios() {
        return this.request(API_CONFIG.ENDPOINTS.SERVICIOS);
    }

    async getServicio(id) {
        return this.request(API_CONFIG.ENDPOINTS.SERVICIO_BY_ID(id));
    }

    async createServicio(servicioData) {
        return this.request(API_CONFIG.ENDPOINTS.SERVICIOS, {
            method: 'POST',
            body: JSON.stringify(servicioData)
        });
    }

    async updateServicio(id, servicioData) {
        return this.request(API_CONFIG.ENDPOINTS.SERVICIO_BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify(servicioData)
        });
    }

    async deleteServicio(id) {
        return this.request(API_CONFIG.ENDPOINTS.SERVICIO_BY_ID(id), {
            method: 'DELETE'
        });
    }

    async searchServicios(searchTerm) {
        return this.request(API_CONFIG.ENDPOINTS.SERVICIOS_BUSCAR(searchTerm));
    }

    // Métodos para Turnos
    async getTurnos() {
        return this.request(API_CONFIG.ENDPOINTS.TURNOS);
    }

    async getTurno(id) {
        return this.request(API_CONFIG.ENDPOINTS.TURNO_BY_ID(id));
    }

    async createTurno(turnoData) {
        return this.request(API_CONFIG.ENDPOINTS.TURNOS, {
            method: 'POST',
            body: JSON.stringify(turnoData)
        });
    }

    async updateTurno(id, turnoData) {
        return this.request(API_CONFIG.ENDPOINTS.TURNO_BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify(turnoData)
        });
    }

    async updateTurnoStatus(id, estado) {
        return this.request(API_CONFIG.ENDPOINTS.TURNO_ESTADO(id), {
            method: 'PUT',
            body: JSON.stringify(estado)
        });
    }

    async deleteTurno(id) {
        return this.request(API_CONFIG.ENDPOINTS.TURNO_BY_ID(id), {
            method: 'DELETE'
        });
    }

    async getTurnosPorFecha(fecha) {
        return this.request(API_CONFIG.ENDPOINTS.TURNOS_POR_FECHA(fecha));
    }

    // Método para obtener turnos de un cliente específico
    async getTurnosByCliente(clienteId) {
        const allTurnos = await this.getTurnos();
        if (allTurnos.success && allTurnos.data) {
            return {
                success: true,
                data: allTurnos.data.filter(turno => turno.ClienteID === clienteId),
                message: 'Turnos del cliente obtenidos exitosamente'
            };
        }
        return allTurnos;
    }

    // Método para obtener turnos de un empleado específico
    async getTurnosByEmpleado(empleadoId) {
        const allTurnos = await this.getTurnos();
        if (allTurnos.success && allTurnos.data) {
            return {
                success: true,
                data: allTurnos.data.filter(turno => turno.EmpleadoID === empleadoId),
                message: 'Turnos del empleado obtenidos exitosamente'
            };
        }
        return allTurnos;
    }
}

// Instancia global del servicio API
const apiService = new ApiService();

// Función para mostrar mensajes de error
function showApiError(message) {
    console.error('Error API:', message);
    // Crear un toast o alert más elegante
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Función para mostrar mensajes de éxito
function showApiSuccess(message) {
    console.log('Éxito API:', message);
    // Crear un toast o alert más elegante
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Función para validar si el usuario está autenticado
function isAuthenticated() {
    const user = localStorage.getItem('user');
    return user !== null;
}

// Función para obtener información del usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
} 