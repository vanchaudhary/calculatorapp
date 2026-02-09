/**
 * Integration tests for the calculator app
 */

const request = require('supertest');
const express = require('express');
const { calculate } = require('./calculator');

// Create a test app instance
const createTestApp = () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.send(`
      <h2>🚀 Calculator App - Azure Demo v2.0 ✨</h2>
      <form method="post" action="/calculate">
        <input name="num1" type="number" step="any" required>
        <select name="op">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
        <input name="num2" type="number" step="any" required>
        <button type="submit">Calculate</button>
      </form>
    `);
  });

  app.post('/calculate', (req, res) => {
    const num1 = req.body.num1;
    const num2 = req.body.num2;
    const op = req.body.op;
    
    const result = calculate(num1, num2, op);
    
    if (result.success) {
      res.send(`<h2>Result: ${result.result}</h2><a href="/">Try again</a>`);
    } else {
      res.send(`<h2>Error: ${result.error}</h2><a href="/">Try again</a>`);
    }
  });

  return app;
};

describe('Calculator App Routes', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /', () => {
    test('should return the calculator form', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Calculator App');
      expect(response.text).toContain('<form');
      expect(response.text).toContain('num1');
      expect(response.text).toContain('num2');
    });
  });

  describe('POST /calculate', () => {
    test('should calculate addition correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '5', num2: '3', op: '+' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 8');
      expect(response.text).toContain('Try again');
    });

    test('should calculate subtraction correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '10', num2: '3', op: '-' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 7');
    });

    test('should calculate multiplication correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '5', num2: '3', op: '*' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 15');
    });

    test('should calculate division correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '10', num2: '2', op: '/' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 5');
    });

    test('should handle divide by zero with error message', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '10', num2: '0', op: '/' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Cannot divide by zero');
      expect(response.text).not.toContain('Infinity');
      expect(response.text).toContain('Try again');
    });

    test('should handle invalid num1 with error message', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '', num2: '5', op: '+' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Invalid input');
      expect(response.text).toContain('Try again');
    });

    test('should handle invalid num2 with error message', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: '5', num2: '', op: '+' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Invalid input');
    });

    test('should handle non-numeric inputs', async () => {
      const response = await request(app)
        .post('/calculate')
        .type('form')
        .send({ num1: 'abc', num2: '5', op: '+' });
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Invalid input');
    });
  });
});
