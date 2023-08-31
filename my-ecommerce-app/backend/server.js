const express = require('express');
const app = express();
const path = require('path');

const cart = [];

app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.json());

const PRODUCT_INFO = {
  '1': { name: 'Cotton Comforter', price: 150 },
  '2': { name: 'Linen Cover', price: 200 }
};

app.post('/api/add-to-cart', (req, res) => {
  const { productId } = req.body;

  if (!PRODUCT_INFO[productId]) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const product = {
    id: productId,
    ...PRODUCT_INFO[productId]
  };

  cart.push(product);
  res.json({ message: 'Product added to cart', cart, cartTotal: calculateTotal() });
});

function calculateTotal() {
  return cart.reduce((total, product) => total + product.price, 0);
}

app.get('/api/cart', (req, res) => {
  res.json({ cart });
});

app.post('/api/checkout', (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const total = calculateTotal();
  cart.length = 0;
  res.json({ message: 'Checkout successful', orderTotal: total });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Define a default route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});