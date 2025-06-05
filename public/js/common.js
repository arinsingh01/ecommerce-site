// Check if user is logged in
const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
};

// Get user role
const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
};

// API call helper
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null
    };

    try {
        const response = await fetch(`/api/${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Update navigation based on auth status
const updateNavigation = () => {
    const authLinks = document.querySelectorAll('.auth-link');
    const profileLink = document.querySelector('.profile-link');
    const cartLink = document.querySelector('.cart-link');

    if (isLoggedIn()) {
        authLinks.forEach(link => link.style.display = 'none');
        if (profileLink) profileLink.style.display = 'block';
        if (cartLink) cartLink.style.display = 'block';
    } else {
        authLinks.forEach(link => link.style.display = 'block');
        if (profileLink) profileLink.style.display = 'none';
        if (cartLink) cartLink.style.display = 'none';
    }
};

// Logout function
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateNavigation();
    window.location.href = '/';
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
}); 