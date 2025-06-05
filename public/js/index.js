document.addEventListener('DOMContentLoaded', async () => {
    const featuredGrid = document.getElementById('featured-products-grid');
    featuredGrid.textContent = 'Loading...';

    try {
        const res = await fetch('/api/products/featured');
        const products = await res.json();
        if (!Array.isArray(products) || products.length === 0) {
            featuredGrid.textContent = 'No featured products found.';
            return;
        }
        featuredGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price.toFixed(2)}</div>
                <a href="/product.html?id=${product._id}" class="btn" style="margin-top: 0.5rem;">View Details</a>
            </div>
        `).join('');
    } catch (err) {
        featuredGrid.textContent = 'Failed to load featured products.';
    }
}); 