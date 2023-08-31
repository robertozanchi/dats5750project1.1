const express = require('express');
const cors = require('cors');  // Import the CORS library.
const app = express();

const cart = [];

// Middleware setup
app.use(cors());  // Use CORS middleware to handle cross-origin requests.
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