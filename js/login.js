// Función para mostrar mensajes de error
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        const newErrorDiv = document.createElement('div');
        newErrorDiv.className = 'error-message';
        newErrorDiv.textContent = message;
        element.parentNode.insertBefore(newErrorDiv, element.nextSibling);
    }
}

// Función para limpiar mensajes de error
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
}

// Función para validar el formulario
function validateForm(email, password, userType) {
    let isValid = true;
    clearErrors();

    if (!email) {
        showError('email', 'Por favor ingrese su email');
        isValid = false;
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError('email', 'Por favor ingrese un email válido');
        isValid = false;
    }

    if (!password) {
        showError('password', 'Por favor ingrese su contraseña');
        isValid = false;
    }

    if (!userType) {
        showError('userType', 'Por favor seleccione un tipo de usuario');
        isValid = false;
    }

    return isValid;
}

// Función para mostrar loading
function showLoading() {
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;
}

// Función para ocultar loading
function hideLoading() {
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    submitBtn.textContent = 'Ingresar';
    submitBtn.disabled = false;
}

// Función para manejar el login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    if (!validateForm(email, password, userType)) {
        return;
    }

    showLoading();

    try {
        const result = await authService.login(email, password, userType);
        
        if (result.success) {
            // Guardar información del usuario
            authService.setUser(result.user);
            
            // Mostrar mensaje de éxito
            showApiSuccess('Inicio de sesión exitoso');
            
            // Redirigir según el rol
            setTimeout(() => {
                switch (userType) {
                    case 'admin':
                        window.location.href = 'admin-panel.html';
                        break;
                    case 'empleado':
                        window.location.href = 'empleado-panel.html';
                        break;
                    case 'cliente':
                        window.location.href = 'turnos_clientes.html';
                        break;
                    default:
                        window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            showError('email', result.message || 'Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('email', 'Error al conectar con el servidor');
    } finally {
        hideLoading();
    }
}

// Función para manejar la recuperación de contraseña
async function handlePasswordRecovery(event) {
    event.preventDefault();
    const email = document.getElementById('recoveryEmail').value;

    if (!email) {
        alert('Por favor ingrese su email');
        return;
    }

    try {
        // En un caso real, esto debería enviar un email
        // Por ahora, solo verificamos que el usuario existe
        const response = await fetch('http://localhost:62239/api/clientes');
        const result = await response.json();
        
        if (result.success && result.data) {
            const cliente = result.data.find(c => c.Email === email);
            if (cliente) {
                alert('Se ha enviado un correo con las instrucciones para recuperar su contraseña');
                closeModal();
            } else {
                alert('No se encontró un usuario con ese email');
            }
        } else {
            alert('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('recoveryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para abrir modal de recuperación
function openRecoveryModal() {
    const modal = document.getElementById('recoveryModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password recovery
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            openRecoveryModal();
        });
    }

    // Recovery form
    const recoveryForm = document.getElementById('recoveryForm');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', handlePasswordRecovery);
    }

    // Close modal
    const closeModalBtn = document.querySelector('.close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('recoveryModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Verificar si ya está autenticado
    if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        switch (user.role) {
            case 'admin':
                window.location.href = 'admin-panel.html';
                break;
            case 'empleado':
                window.location.href = 'empleado-panel.html';
                break;
            case 'cliente':
                window.location.href = 'turnos_clientes.html';
                break;
        }
    }
}); 