const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// In-memory product store
let products = [];

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'product-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// GET /products – list all products
app.get('/products', (req, res) => {
  res.json({ count: products.length, products });
});

// POST /products – create a new product
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (price === undefined || price === null) {
    return res.status(400).json({ error: 'price is required' });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'price must be a non-negative number' });
  }

  const product = {
    id: uuidv4(),
    name,
    price,
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  res.status(201).json(product);
});

// GET /products/:id – get a single product
app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// PUT /products/:id – update a product's name and/or price
app.put('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  if (req.body.name !== undefined) product.name = req.body.name;

  if (req.body.price !== undefined) {
    if (typeof req.body.price !== 'number' || req.body.price < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number' });
    }
    product.price = req.body.price;
  }

  res.json(product);
});

// DELETE /products/:id – delete a product
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products.splice(index, 1);
  res.status(204).send();
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

module.exports = app;