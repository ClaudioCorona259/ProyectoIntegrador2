// Funcionalidad de navegación simplificada y coherente
document.addEventListener('DOMContentLoaded', () => {
    configurarNavegacion();
});

// Función para configurar la navegación
function configurarNavegacion() {
    const user = authService.getCurrentUser();
    
    if (user) {
        mostrarNavegacionAutenticada(user);
    } else {
        mostrarNavegacionPublica();
    }
}

// Función para mostrar navegación para usuarios autenticados
function mostrarNavegacionAutenticada(user) {
    const nav = document.querySelector('nav ul');
    const headerList = document.querySelector('.header_list');
    
    if (nav) {
        // Navegación principal - igual que la pública
        nav.innerHTML = `
            <img src="Assets/logo-02.svg" alt="logo">
            <li><a href="index.html">Inicio</a></li>
            <li><a href="index.html#Servicios">Nuestros Servicios</a></li>
            <li><a href="index.html#Contacto">Contacto</a></li>
        `;
    }
    
    if (headerList) {
        // Menú de usuario - botón simple sin dropdown
        if (user.role === 'admin') {
            headerList.innerHTML = `
                <li><a href="admin-panel.html">Panel Admin</a></li>
                <li class="nav_btn">
                    <a href="#" onclick="cerrarSesion()">Cerrar Sesión</a>
                </li>
            `;
        } else if (user.role === 'empleado') {
            headerList.innerHTML = `
                <li><a href="empleado-panel.html">Panel Empleado</a></li>
                <li class="nav_btn">
                    <a href="#" onclick="cerrarSesion()">Cerrar Sesión</a>
                </li>
            `;
        } else {
            headerList.innerHTML = `
                <li><a href="turnos_clientes.html">Mis Turnos</a></li>
                <li class="nav_btn">
                    <a href="#" onclick="cerrarSesion()">Cerrar Sesión</a>
                </li>
            `;
        }
    }
}

// Función para mostrar navegación pública
function mostrarNavegacionPublica() {
    const nav = document.querySelector('nav ul');
    const headerList = document.querySelector('.header_list');
    
    if (nav) {
        nav.innerHTML = `
            <img src="Assets/logo-02.svg" alt="logo">
            <li><a href="index.html">Inicio</a></li>
            <li><a href="index.html#Servicios">Nuestros Servicios</a></li>
            <li><a href="index.html#Contacto">Contacto</a></li>
        `;
    }
    
    if (headerList) {
        headerList.innerHTML = `
            <li><a href="login.html">Iniciar Sesión</a></li>
            <li class="nav_btn">
                <a href="signup.html">Registrarse</a>
            </li>
        `;
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    authService.logout();
    window.location.href = 'index.html';
}

// Función para mostrar/ocultar menú móvil
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-open');
}

// Función para cerrar menú móvil
function closeMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.remove('mobile-open');
}

// Función para ir al inicio
function irAlInicio() {
    window.location.href = 'index.html';
}

// Función para ir a servicios
function irAServicios() {
    window.location.href = 'index.html#Servicios';
}

// Función para ir a contacto
function irAContacto() {
    window.location.href = 'index.html#Contacto';
}

// Función para ir a login
function irALogin() {
    window.location.href = 'login.html';
}

// Función para ir a registro
function irARegistro() {
    window.location.href = 'signup.html';
}

// Event listeners para menú móvil
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav && nav.classList.contains('mobile-open') && 
            !nav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}); 