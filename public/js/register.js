document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    form.appendChild(errorMsg);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                errorMsg.textContent = data.message || 'Registration failed.';
            }
        } catch (err) {
            errorMsg.textContent = 'Error registering.';
        }
    });
}); 