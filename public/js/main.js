// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.nav-container').appendChild(mobileNavToggle);

    mobileNavToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });

    // Featured Products Loading
    loadFeaturedProducts();
});

// Load Featured Products
async function loadFeaturedProducts() {
    try {
        const response = await fetch('/api/products/featured');
        const products = await response.json();
        
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="add-to-cart" data-product-id="${product.id}">
            Add to Cart
        </button>
    `;

    // Add to Cart functionality
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(product.id));

    return card;
}

// Add to Cart Function
async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        if (response.ok) {
            showNotification('Product added to cart!');
            updateCartCount();
        } else {
            showNotification('Failed to add product to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding to cart', 'error');
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update Cart Count
async function updateCartCount() {
    try {
        const response = await fetch('/api/cart/count');
        const { count } = await response.json();
        
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            const countBadge = document.createElement('span');
            countBadge.className = 'cart-count';
            countBadge.textContent = count;
            cartIcon.parentElement.appendChild(countBadge);
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Search Functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value;
        if (query.length < 2) return;

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            displaySearchResults(results);
        } catch (error) {
            console.error('Error searching:', error);
        }
    }, 300));
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Display Search Results
function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${result.image}" alt="${result.name}">
            <div class="result-info">
                <h4>${result.name}</h4>
                <p>$${result.price}</p>
            </div>
        `;
        resultItem.addEventListener('click', () => {
            window.location.href = `/product/${result.id}`;
        });
        searchResults.appendChild(resultItem);
    });
} 