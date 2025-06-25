// Funcionalidad para registro de clientes
document.addEventListener('DOMContentLoaded', () => {
    configurarFormulario();
});

// Función para configurar el formulario
function configurarFormulario() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', handleSignup);
    }
}

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
function validateForm(formData) {
    let isValid = true;
    clearErrors();

    // Validar nombre
    if (!formData.get('nombre') || formData.get('nombre').trim().length < 2) {
        showError('nombre', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }

    // Validar apellido
    if (!formData.get('apellido') || formData.get('apellido').trim().length < 2) {
        showError('apellido', 'El apellido debe tener al menos 2 caracteres');
        isValid = false;
    }

    // Validar email
    const email = formData.get('email');
    if (!email) {
        showError('email', 'Por favor ingrese su email');
        isValid = false;
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError('email', 'Por favor ingrese un email válido');
        isValid = false;
    }

    // Validar teléfono
    const telefono = formData.get('telefono');
    if (!telefono) {
        showError('telefono', 'Por favor ingrese su teléfono');
        isValid = false;
    } else if (!telefono.match(/^\+?[\d\s\-\(\)]+$/)) {
        showError('telefono', 'Por favor ingrese un teléfono válido');
        isValid = false;
    }

    // Validar contraseña
    const password = formData.get('password');
    if (!password) {
        showError('password', 'Por favor ingrese una contraseña');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }

    // Validar confirmación de contraseña
    const confirmPassword = formData.get('confirmPassword');
    if (!confirmPassword) {
        showError('confirmPassword', 'Por favor confirme su contraseña');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Las contraseñas no coinciden');
        isValid = false;
    }

    return isValid;
}

// Función para mostrar loading
function showLoading() {
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    submitBtn.textContent = 'Registrando...';
    submitBtn.disabled = true;
}

// Función para ocultar loading
function hideLoading() {
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    submitBtn.textContent = 'Registrarse';
    submitBtn.disabled = false;
}

// Función para manejar el registro
async function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (!validateForm(formData)) {
        return;
    }

    showLoading();

    try {
        const clienteData = {
            Nombre: formData.get('nombre').trim(),
            Apellido: formData.get('apellido').trim(),
            Email: formData.get('email').trim(),
            Telefono: formData.get('telefono').trim(),
            Password: formData.get('password') // En un caso real, esto debería hashearse
        };

        const result = await authService.registerCliente(clienteData);

        if (result.success) {
            showApiSuccess('Registro exitoso. Redirigiendo al login...');
            
            // Limpiar formulario
            event.target.reset();
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showError('email', result.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('email', 'Error al conectar con el servidor');
    } finally {
        hideLoading();
    }
}

// Función para ir al login
function irALogin() {
    window.location.href = 'login.html';
}

// Función para ir al inicio
function irAlInicio() {
    window.location.href = 'index.html';
} 