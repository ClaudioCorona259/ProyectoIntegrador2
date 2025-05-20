// Verificar si el usuario está autenticado como administrador
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Cargar la lista de empleados
async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:3000/api/employees', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        alert('Error al cargar la lista de empleados');
    }
}

// Mostrar empleados en la tabla
function displayEmployees(employees) {
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';

    employees.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.role}</td>
            <td class="action-buttons">
                <button class="btn-edit" onclick="editEmployee(${employee.id})">Editar</button>
                <button class="btn-delete" onclick="deleteEmployee(${employee.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Manejar el formulario de empleado
async function handleEmployeeForm(event) {
    event.preventDefault();
    
    const employeeData = {
        name: document.getElementById('employeeName').value,
        email: document.getElementById('employeeEmail').value,
        password: document.getElementById('employeePassword').value,
        role: document.getElementById('employeeRole').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(employeeData)
        });

        if (response.ok) {
            closeModal();
            loadEmployees();
            alert('Empleado agregado exitosamente');
        } else {
            throw new Error('Error al agregar empleado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar empleado');
    }
}

// Eliminar empleado
async function deleteEmployee(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadEmployees();
            alert('Empleado eliminado exitosamente');
        } else {
            throw new Error('Error al eliminar empleado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar empleado');
    }
}

// Editar empleado
async function editEmployee(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const employee = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Editar Empleado';
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeeEmail').value = employee.email;
        document.getElementById('employeeRole').value = employee.role;
        
        openModal();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar datos del empleado');
    }
}

// Funciones del modal
function openModal() {
    document.getElementById('employeeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
    document.getElementById('employeeForm').reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadEmployees();

    // Modal
    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Agregar Nuevo Empleado';
        openModal();
    });

    document.querySelector('.close').addEventListener('click', closeModal);

    // Formulario
    document.getElementById('employeeForm').addEventListener('submit', handleEmployeeForm);

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}); 