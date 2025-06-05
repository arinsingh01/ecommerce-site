document.addEventListener('DOMContentLoaded', async () => {
    const productDetails = document.getElementById('product-details');
    const productReviews = document.getElementById('product-reviews');
    productDetails.textContent = 'Loading product details...';
    productReviews.textContent = 'Loading reviews...';

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        productDetails.textContent = 'Product ID not found.';
        return;
    }

    try {
        const res = await fetch(`/api/products/${productId}`);
        const product = await res.json();
        if (!product) {
            productDetails.textContent = 'Product not found.';
            return;
        }
        productDetails.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}" />
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button id="add-to-cart" data-product-id="${product._id}">Add to Cart</button>
        `;
        productReviews.innerHTML = product.reviews.map(review => `
            <div class="review">
                <p>Rating: ${review.rating}/5</p>
                <p>${review.comment}</p>
            </div>
        `).join('');
    } catch (err) {
        productDetails.textContent = 'Failed to load product details.';
    }
});

document.getElementById('add-to-cart').addEventListener('click', async () => {
    const productId = document.getElementById('add-to-cart').dataset.productId;
    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });
        if (res.ok) {
            alert('Product added to cart!');
        } else {
            alert('Failed to add product to cart.');
        }
    } catch (err) {
        alert('Error adding product to cart.');
    }
}); 