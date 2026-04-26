const request = require('supertest');
const app = require('../src/app');

describe('Product API', () => {

  // ── GET /products ─────────────────────────────────────────────────────────
  describe('GET /products', () => {
    it('should return an array of products', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.products)).toBe(true);
    });
  });

  // ── POST /products ────────────────────────────────────────────────────────
  describe('POST /products', () => {
    it('should create a product with name and price', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'apple', price: 5 });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('apple');
      expect(res.body.price).toBe(5);
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
    });
  });

  // ── GET /products/:id ─────────────────────────────────────────────────────
  describe('GET /products/:id', () => {
    it('should retrieve an existing product by id', async () => {
      const created = await request(app).post('/products').send({ name: 'Chocolate', price: 10 });
      const res = await request(app).get(`/products/${created.body.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Chocolate');
    });
  });

  // ── PUT /products/:id ───────────────────────────────────────────────────
  describe('PUT /products/:id', () => {
    it('should update a product price', async () => {
      const created = await request(app).post('/products').send({ name: 'Ice Cream', price: 5 });
      const res = await request(app)
        .put(`/products/${created.body.id}`)
        .send({ price: 6 });
      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(6);
    });
  });

  // ── DELETE /products/:id ──────────────────────────────────────────────────
  describe('DELETE /products/:id', () => {
    it('should delete a product and return 204', async () => {
      const created = await request(app).post('/products').send({ name: 'Banana', price: 0 });
      const res = await request(app).delete(`/products/${created.body.id}`);
      expect(res.statusCode).toBe(204);
    });
  });
});