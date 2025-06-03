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

    if (!formData.get('usuario')) {
        showError('usuario', 'Por favor ingrese un nombre de usuario');
        isValid = false;
    }

    if (!formData.get('nombre')) {
        showError('nombre', 'Por favor ingrese su nombre');
        isValid = false;
    }

    if (!formData.get('apellido')) {
        showError('apellido', 'Por favor ingrese su apellido');
        isValid = false;
    }

    if (!formData.get('email')) {
        showError('email', 'Por favor ingrese su email');
        isValid = false;
    } else if (!formData.get('email').match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError('email', 'Por favor ingrese un email válido');
        isValid = false;
    }

    if (!formData.get('password')) {
        showError('password', 'Por favor ingrese una contraseña');
        isValid = false;
    }

    if (formData.get('password') !== formData.get('password_conf')) {
        showError('password_conf', 'Las contraseñas no coinciden');
        isValid = false;
    }

    if (!formData.get('telefono')) {
        showError('telefono', 'Por favor ingrese su teléfono');
        isValid = false;
    }

    return isValid;
}

// Función para manejar el registro
async function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    
    if (!validateForm(formData)) {
        return;
    }

    const userData = {
        Usuario: formData.get('usuario'),
        Clave: formData.get('password'),
        Email: formData.get('email'),
        Nombre: formData.get('nombre'),
        Apellido: formData.get('apellido'),
        Telefono: formData.get('telefono')
    };

    try {
        const response = await fetch('http://localhost:3000/api/Auth/Registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Por favor inicie sesión.');
            window.location.href = 'login.html';
        } else {
            showError('email', data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('email', 'Error al conectar con el servidor');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}); 