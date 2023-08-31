document.addEventListener('DOMContentLoaded', () => {
  const cartItemsList = document.getElementById('cart-items');
  const checkoutButton = document.getElementById('checkout-btn');

  document.body.addEventListener('click', async (event) => {
    if (event.target.classList.contains('add-to-cart')) {
      const productId = event.target.getAttribute('data-product-id');
      const response = await performFetch('/api/add-to-cart', { productId });
      updateCartUI(response.cart);
      updateOrderTotal(response.cartTotal);
    }
  });

  checkoutButton.addEventListener('click', async () => {
    const response = await performFetch('/api/checkout');
    updateCartUI(response.cart);
    updateOrderTotal(response.orderTotal);
  });

  async function performFetch(url, body = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  function updateCartUI(cartItems) {
    cartItemsList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    cartItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${getProductName(item.id)} - $${item.price}`;
      fragment.appendChild(li);
    });
    cartItemsList.appendChild(fragment);
  }

  function getProductName(productId) {
    const productNames = {
      '1': 'Comforter',
      '2': 'Cover'
    };
    return productNames[productId] || 'Unknown Product';
  }

  function updateOrderTotal(total) {
    const orderTotalElement = document.getElementById('order-total');
    orderTotalElement.textContent = `Order Total: $${total}`;
  }
});