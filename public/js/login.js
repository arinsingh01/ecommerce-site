document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await apiCall('auth/login', 'POST', { email, password });
            
            // Store token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Update navigation and redirect
            updateNavigation();
            window.location.href = '/';
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });
}); 