// Credenciales de acceso
const CREDENTIALS = {
    username: 'ximena',
    password: '123'
};

// Agregar animación shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Verificar que los elementos existan
    if (!loginForm || !usernameInput || !passwordInput || !errorMessage) {
        console.error('Error: No se encontraron algunos elementos del DOM');
        return;
    }

    // Función para mostrar error
    function showError(message) {
        console.log('Mostrando error:', message);
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
        errorMessage.style.display = 'flex';
        errorMessage.classList.add('show');
        
        // Resaltar inputs con error
        usernameInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
        
        // Shake animation para el login-box
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'none';
        setTimeout(() => {
            loginBox.style.animation = 'shake 0.5s ease-in-out';
        }, 10);
        
        // Scroll al error
        setTimeout(() => {
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // Función para limpiar error
    function clearError() {
        console.log('Limpiando error');
        errorMessage.innerHTML = '';
        errorMessage.style.display = 'none';
        errorMessage.classList.remove('show');
        
        // Remover clase de error de inputs
        usernameInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
    }

    // Función para manejar el login
    function handleLogin(e) {
        e.preventDefault();
        clearError();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validar campos vacíos
        if (!username || !password) {
            showError('Por favor completa todos los campos');
            return;
        }

        // Validar credenciales
        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            // Guardar en sessionStorage
            sessionStorage.setItem('user', JSON.stringify({
                username: username,
                loginTime: new Date().toISOString()
            }));

            // Simular efecto de carga
            loginForm.style.opacity = '0.7';
            loginForm.style.pointerEvents = 'none';

            // Redirigir después de 800ms
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            showError('❌ Usuario o contraseña incorrectos');
            passwordInput.value = '';
        }
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    usernameInput.addEventListener('focus', clearError);
    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('focus', clearError);
    passwordInput.addEventListener('input', clearError);

    // Verificar si ya está logueado
    if (sessionStorage.getItem('user')) {
        window.location.href = 'index.html';
    }
});

