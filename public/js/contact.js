document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    form.appendChild(errorMsg);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Message sent successfully!');
                form.reset();
            } else {
                errorMsg.textContent = data.message || 'Failed to send message.';
            }
        } catch (err) {
            errorMsg.textContent = 'Error sending message.';
        }
    });
}); 