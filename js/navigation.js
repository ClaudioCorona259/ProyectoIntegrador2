// Función para verificar el rol del usuario
function checkUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
}

// Función para cargar el menú de navegación según el rol
function loadNavigation() {
    const role = checkUserRole();
    const nav = document.querySelector('nav ul');
    
    // Menú común para todos los usuarios
    const commonMenu = `
        <li><img src="Assets/logo-02.svg" alt="logo"></li>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="index.html#Servicios">Nuestros Servicios</a></li>
        <li><a href="index.html#Contacto">Contacto</a></li>
    `;

    // Menú específico según el rol
    let roleSpecificMenu = '';
    if (role === 'admin') {
        roleSpecificMenu = `
            <li><a href="admin-panel.html">Panel de Administración</a></li>
            <li><a href="gestion-empleados.html">Gestión de Empleados</a></li>
        `;
    } else if (role === 'empleado') {
        roleSpecificMenu = `
            <li><a href="empleado-panel.html">Panel de Empleado</a></li>
            <li><a href="turnos-empleado.html">Mis Turnos</a></li>
        `;
    } else if (role === 'cliente') {
        roleSpecificMenu = `
            <li><a href="turnos-cliente.html">Mis Turnos</a></li>
            <li><a href="registrar-turno.html">Agendar Turno</a></li>
        `;
    }

    // Menú de usuario (login/logout)
    const userMenu = role ? 
        `<li><a href="#" id="logoutBtn">Cerrar Sesión</a></li>` :
        `<li><a href="login.html">Iniciar Sesión</a></li>
         <li class="nav_btn"><a href="signup.html">Registrarse</a></li>`;

    // Actualizar la navegación
    nav.innerHTML = commonMenu + roleSpecificMenu;
    
    // Agregar el menú de usuario en una lista separada
    const userNav = document.querySelector('nav .header_list');
    if (userNav) {
        userNav.innerHTML = userMenu;
    }

    // Agregar evento de logout si el usuario está autenticado
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
}

// Cargar la navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavigation); 