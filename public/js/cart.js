document.addEventListener('DOMContentLoaded', async () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Load cart
    const loadCart = async () => {
        try {
            const cart = await apiCall('cart');
            
            if (cart.items.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty</p>';
                cartTotal.textContent = '$0.00';
                checkoutBtn.disabled = true;
                return;
            }

            cartItems.innerHTML = cart.items.map(item => `
                <div class="cart-item">
                    <img src="${item.product.image}" alt="${item.product.name}">
                    <div class="item-details">
                        <h3>${item.product.name}</h3>
                        <p>$${item.product.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button onclick="removeItem('${item.product._id}')" class="remove-btn">Remove</button>
                </div>
            `).join('');

            cartTotal.textContent = `$${cart.total.toFixed(2)}`;
            checkoutBtn.disabled = false;
        } catch (error) {
            console.error('Error loading cart:', error);
            cartItems.innerHTML = '<p>Error loading cart. Please try again later.</p>';
        }
    };

    // Update quantity
    window.updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await apiCall('cart/update', 'POST', { productId, quantity: newQuantity });
            loadCart();
        } catch (error) {
            alert(error.message);
        }
    };

    // Remove item
    window.removeItem = async (productId) => {
        try {
            await apiCall('cart/remove', 'POST', { productId });
            loadCart();
        } catch (error) {
            alert(error.message);
        }
    };

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (!isLoggedIn()) {
            window.location.href = '/login.html';
            return;
        }
        window.location.href = '/checkout.html';
    });

    // Initial load
    loadCart();
}); 