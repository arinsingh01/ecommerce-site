document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    form.appendChild(errorMsg);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';
        const shippingDetails = {
            name: form.name.value,
            address: form.address.value,
            city: form.city.value,
            zip: form.zip.value
        };
        const paymentDetails = {
            card: form.card.value,
            expiry: form.expiry.value,
            cvv: form.cvv.value
        };
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shippingDetails, paymentDetails })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Order placed successfully!');
                window.location.href = '/';
            } else {
                errorMsg.textContent = data.message || 'Failed to place order.';
            }
        } catch (err) {
            errorMsg.textContent = 'Error placing order.';
        }
    });
}); 