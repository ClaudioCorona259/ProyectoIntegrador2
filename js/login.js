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

// Función para manejar el login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    if (!validateForm(email, password, userType)) {
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/Auth/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                Usuario: email, 
                Clave: password 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token y la información del usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.UsuarioID,
                name: data.Nombre,
                surname: data.Apellido,
                email: data.Email,
                role: data.Rol
            }));

            // Redirigir según el rol
            switch (data.Rol) {
                case 'admin':
                    window.location.href = 'admin-panel.html';
                    break;
                case 'empleado':
                    window.location.href = 'empleado-panel.html';
                    break;
                case 'cliente':
                    window.location.href = 'index.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        } else {
            showError('email', data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('email', 'Error al conectar con el servidor');
    }
}

// Función para manejar la recuperación de contraseña
async function handlePasswordRecovery(event) {
    event.preventDefault();
    const email = document.getElementById('recoveryEmail').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Se ha enviado un correo con las instrucciones para recuperar su contraseña');
            closeModal();
        } else {
            alert(data.message || 'Error al procesar la solicitud');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Password recovery
    document.getElementById('forgotPassword').addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    // Close modal
    document.querySelector('.close')?.addEventListener('click', closeModal);

    // Password recovery form
    document.getElementById('recoveryForm')?.addEventListener('submit', handlePasswordRecovery);
}); 