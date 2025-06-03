document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordModal = document.getElementById('passwordModal');
    const closeModal = document.querySelector('.close');

    // Cargar datos del perfil
    loadProfileData();

    // Event Listeners
    profileForm.addEventListener('submit', handleProfileUpdate);
    passwordForm.addEventListener('submit', handlePasswordChange);
    changePasswordBtn.addEventListener('click', () => passwordModal.style.display = 'block');
    closeModal.addEventListener('click', () => passwordModal.style.display = 'none');

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
    });

    async function loadProfileData() {
        try {
            const response = await fetch('/api/cliente/perfil', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Error al cargar datos del perfil');
            
            const data = await response.json();
            
            // Llenar el formulario con los datos
            document.getElementById('nombre').value = data.nombre || '';
            document.getElementById('apellido').value = data.apellido || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('telefono').value = data.telefono || '';
            document.getElementById('direccion').value = data.direccion || '';
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los datos del perfil');
        }
    }

    async function handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value
        };

        try {
            const response = await fetch('/api/cliente/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al actualizar perfil');
            
            alert('Perfil actualizado exitosamente');
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el perfil');
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('/api/cliente/cambiar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (!response.ok) throw new Error('Error al cambiar contraseña');
            
            alert('Contraseña actualizada exitosamente');
            passwordModal.style.display = 'none';
            passwordForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cambiar la contraseña');
        }
    }
}); 