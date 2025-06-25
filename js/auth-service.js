// Servicio de autenticación simplificado
class AuthService {
    constructor() {
        this.baseUrl = 'http://localhost:62239/api';
    }

    // Simular login basado en clientes existentes
    async login(email, password, userType) {
        try {
            // Para simplificar, vamos a buscar en clientes primero
            if (userType === 'cliente') {
                const response = await fetch(`${this.baseUrl}/clientes`);
                const result = await response.json();
                
                if (result.success && result.data) {
                    const cliente = result.data.find(c => c.Email === email);
                    if (cliente) {
                        // En un caso real, la contraseña debería estar hasheada
                        // Por ahora, usamos el email como contraseña para demo
                        if (email === password) {
                            return {
                                success: true,
                                user: {
                                    id: cliente.ClienteID,
                                    email: cliente.Email,
                                    nombre: cliente.Nombre,
                                    apellido: cliente.Apellido,
                                    role: 'cliente',
                                    tipo: 'cliente'
                                }
                            };
                        }
                    }
                }
            }

            // Para empleados
            if (userType === 'empleado') {
                const response = await fetch(`${this.baseUrl}/empleados`);
                const result = await response.json();
                
                if (result.success && result.data) {
                    const empleado = result.data.find(e => e.Email === email);
                    if (empleado) {
                        // En un caso real, la contraseña debería estar hasheada
                        if (email === password) {
                            return {
                                success: true,
                                user: {
                                    id: empleado.EmpleadoID,
                                    email: empleado.Email || email,
                                    nombre: empleado.Nombre,
                                    apellido: empleado.Apellido,
                                    role: 'empleado',
                                    tipo: 'empleado'
                                }
                            };
                        }
                    }
                }
            }

            // Para admin (usuario hardcodeado para demo)
            if (userType === 'admin') {
                if (email === 'admin@barberia.com' && password === 'admin123') {
                    return {
                        success: true,
                        user: {
                            id: 1,
                            email: 'admin@barberia.com',
                            nombre: 'Administrador',
                            apellido: 'Sistema',
                            role: 'admin',
                            tipo: 'admin'
                        }
                    };
                }
            }

            return {
                success: false,
                message: 'Credenciales inválidas'
            };

        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                message: 'Error al conectar con el servidor'
            };
        }
    }

    // Registrar nuevo cliente
    async registerCliente(clienteData) {
        try {
            const response = await fetch(`${this.baseUrl}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                message: 'Error al registrar usuario'
            };
        }
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        const user = localStorage.getItem('user');
        return user !== null;
    }

    // Obtener usuario actual
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Guardar usuario en localStorage
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    // Verificar si el usuario tiene un rol específico
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }

    // Verificar si el usuario es admin
    isAdmin() {
        return this.hasRole('admin');
    }

    // Verificar si el usuario es empleado
    isEmpleado() {
        return this.hasRole('empleado');
    }

    // Verificar si el usuario es cliente
    isCliente() {
        return this.hasRole('cliente');
    }
}

// Instancia global del servicio de autenticación
const authService = new AuthService(); 