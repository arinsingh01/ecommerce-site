// State management
let state = {
    products: [],
    filteredProducts: [],
    currentPage: 1,
    itemsPerPage: 12,
    filters: {
        categories: [],
        priceRange: {
            min: 0,
            max: 5000
        },
        brands: []
    },
    sort: 'newest'
};

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const productCount = document.getElementById('product-count');
const sortSelect = document.getElementById('sort');
const prevPageBtn = document.querySelector('.prev-page');
const nextPageBtn = document.querySelector('.next-page');
const pageNumbers = document.querySelector('.page-numbers');
const applyFiltersBtn = document.querySelector('.apply-filters');
const clearFiltersBtn = document.querySelector('.clear-filters');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search-input');

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.textContent = 'Loading...';

    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        if (!Array.isArray(products) || products.length === 0) {
            productsGrid.textContent = 'No products found.';
            return;
        }
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price.toFixed(2)}</div>
                <button onclick="addToCart('${product._id}')">Add to Cart</button>
            </div>
        `).join('');
    } catch (err) {
        productsGrid.textContent = 'Failed to load products.';
    }

    window.addToCart = async (productId) => {
        if (!isLoggedIn()) {
            window.location.href = '/login.html';
            return;
        }
        try {
            await apiCall('cart/add', 'POST', { productId, quantity: 1 });
            alert('Product added to cart!');
        } catch (error) {
            alert(error.message);
        }
    };

    // Event listeners for filters
    categoryFilter.addEventListener('change', () => {
        loadProducts(categoryFilter.value, searchInput.value);
    });

    searchInput.addEventListener('input', () => {
        loadProducts(categoryFilter.value, searchInput.value);
    });

    // Initial load
    loadProducts();
});

// Setup event listeners
function setupEventListeners() {
    // Sort change
    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        applyFilters();
    });

    // Filter changes
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });

    document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateFilters);
    });

    // Price range changes
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    priceMin.addEventListener('input', (e) => {
        minPriceInput.value = e.target.value;
        updateFilters();
    });

    priceMax.addEventListener('input', (e) => {
        maxPriceInput.value = e.target.value;
        updateFilters();
    });

    minPriceInput.addEventListener('change', (e) => {
        priceMin.value = e.target.value;
        updateFilters();
    });

    maxPriceInput.addEventListener('change', (e) => {
        priceMax.value = e.target.value;
        updateFilters();
    });

    // Filter buttons
    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProducts();
            renderPagination();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderProducts();
            renderPagination();
        }
    });
}

// Update filters state
function updateFilters() {
    // Categories
    state.filters.categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(checkbox => checkbox.value);

    // Brands
    state.filters.brands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
        .map(checkbox => checkbox.value);

    // Price range
    state.filters.priceRange = {
        min: parseInt(document.getElementById('min-price').value),
        max: parseInt(document.getElementById('max-price').value)
    };
}

// Apply filters
function applyFilters() {
    state.filteredProducts = state.products.filter(product => {
        // Category filter
        if (state.filters.categories.length > 0 && !state.filters.categories.includes(product.category)) {
            return false;
        }

        // Brand filter
        if (state.filters.brands.length > 0 && !state.filters.brands.includes(product.brand)) {
            return false;
        }

        // Price range filter
        if (product.price < state.filters.priceRange.min || product.price > state.filters.priceRange.max) {
            return false;
        }

        return true;
    });

    // Apply sorting
    sortProducts();

    // Reset to first page
    state.currentPage = 1;

    // Update UI
    updateProductCount();
    renderProducts();
    renderPagination();
}

// Sort products
function sortProducts() {
    switch (state.sort) {
        case 'price-asc':
            state.filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            state.filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            state.filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            state.filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
}

// Clear all filters
function clearFilters() {
    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset price range
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    priceMin.value = 0;
    priceMax.value = 5000;
    minPriceInput.value = 0;
    maxPriceInput.value = 5000;

    // Reset sort
    sortSelect.value = 'newest';

    // Reset state
    state.filters = {
        categories: [],
        priceRange: { min: 0, max: 5000 },
        brands: []
    };
    state.sort = 'newest';

    // Apply changes
    applyFilters();
}

// Render products
function renderProducts() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const productsToShow = state.filteredProducts.slice(start, end);

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-product-id="${product._id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        });
    });
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
    
    // Update button states
    prevPageBtn.disabled = state.currentPage === 1;
    nextPageBtn.disabled = state.currentPage === totalPages;

    // Generate page numbers
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= state.currentPage - 2 && i <= state.currentPage + 2)
        ) {
            pages.push(i);
        } else if (i === state.currentPage - 3 || i === state.currentPage + 3) {
            pages.push('...');
        }
    }

    pageNumbers.innerHTML = pages.map(page => {
        if (page === '...') {
            return '<span class="page-dots">...</span>';
        }
        return `
            <button class="page-number ${page === state.currentPage ? 'active' : ''}"
                    ${page === state.currentPage ? 'disabled' : ''}>
                ${page}
            </button>
        `;
    }).join('');

    // Add event listeners to page numbers
    document.querySelectorAll('.page-number').forEach(button => {
        button.addEventListener('click', (e) => {
            const page = parseInt(e.target.textContent);
            state.currentPage = page;
            renderProducts();
            renderPagination();
        });
    });
}

// Update product count
function updateProductCount() {
    productCount.textContent = state.filteredProducts.length;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update cart count
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