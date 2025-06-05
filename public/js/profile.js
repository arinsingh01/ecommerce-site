document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('profile-form');
    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    form.appendChild(errorMsg);

    async function fetchProfile() {
        try {
            const res = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                form.name.value = data.name;
                form.email.value = data.email;
            } else {
                errorMsg.textContent = data.message || 'Failed to load profile.';
            }
        } catch (err) {
            errorMsg.textContent = 'Error loading profile.';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        const name = form.name.value;
        const email = form.email.value;
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, email })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                errorMsg.textContent = data.message || 'Failed to update profile.';
            }
        } catch (err) {
            errorMsg.textContent = 'Error updating profile.';
        }
    });

    fetchProfile();
}); 