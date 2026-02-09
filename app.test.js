const request = require('supertest');
const { app, calculate } = require('./app');

describe('Calculator Function Tests', () => {
  describe('Addition', () => {
    test('should add two positive numbers', () => {
      const result = calculate('5', '3', '+');
      expect(result).toEqual({ result: 8 });
    });

    test('should add negative numbers', () => {
      const result = calculate('-5', '-3', '+');
      expect(result).toEqual({ result: -8 });
    });
  });

  describe('Subtraction', () => {
    test('should subtract two numbers', () => {
      const result = calculate('10', '3', '-');
      expect(result).toEqual({ result: 7 });
    });

    test('should handle negative results', () => {
      const result = calculate('3', '10', '-');
      expect(result).toEqual({ result: -7 });
    });
  });

  describe('Multiplication', () => {
    test('should multiply two positive numbers', () => {
      const result = calculate('5', '3', '*');
      expect(result).toEqual({ result: 15 });
    });

    test('should handle multiplication by zero', () => {
      const result = calculate('5', '0', '*');
      expect(result).toEqual({ result: 0 });
    });
  });

  describe('Division', () => {
    test('should divide two numbers', () => {
      const result = calculate('10', '2', '/');
      expect(result).toEqual({ result: 5 });
    });

    test('should handle decimal results', () => {
      const result = calculate('10', '3', '/');
      expect(result.result).toBeCloseTo(3.333, 3);
    });

    test('should return error for division by zero', () => {
      const result = calculate('10', '0', '/');
      expect(result).toEqual({ error: 'Cannot divide by zero' });
    });
  });

  describe('Invalid Input Handling', () => {
    test('should return error for non-numeric num1', () => {
      const result = calculate('abc', '5', '+');
      expect(result).toEqual({ error: 'Invalid input: Please provide valid numbers' });
    });

    test('should return error for non-numeric num2', () => {
      const result = calculate('5', 'xyz', '+');
      expect(result).toEqual({ error: 'Invalid input: Please provide valid numbers' });
    });

    test('should return error for both inputs non-numeric', () => {
      const result = calculate('abc', 'xyz', '+');
      expect(result).toEqual({ error: 'Invalid input: Please provide valid numbers' });
    });

    test('should return error for empty strings', () => {
      const result = calculate('', '', '+');
      expect(result).toEqual({ error: 'Invalid input: Please provide valid numbers' });
    });

    test('should return error for undefined inputs', () => {
      const result = calculate(undefined, undefined, '+');
      expect(result).toEqual({ error: 'Invalid input: Please provide valid numbers' });
    });

    test('should return error for invalid operation', () => {
      const result = calculate('5', '3', '^');
      expect(result).toEqual({ error: 'Invalid operation' });
    });
  });
});

describe('API Endpoint Tests', () => {
  describe('GET /', () => {
    test('should return the calculator form', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Calculator App');
      expect(response.text).toContain('<form');
      expect(response.text).toContain('action="/calculate"');
    });
  });

  describe('POST /calculate', () => {
    test('should calculate addition correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '5', num2: '3', op: '+' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 8');
      expect(response.text).toContain('Try again');
    });

    test('should calculate subtraction correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '10', num2: '3', op: '-' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 7');
    });

    test('should calculate multiplication correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '5', num2: '3', op: '*' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 15');
    });

    test('should calculate division correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '10', num2: '2', op: '/' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Result: 5');
    });

    test('should show error for division by zero', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '10', num2: '0', op: '/' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Cannot divide by zero');
      expect(response.text).toContain('Try again');
      expect(response.text).not.toContain('Infinity');
    });

    test('should show error for invalid num1', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: 'abc', num2: '5', op: '+' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Invalid input: Please provide valid numbers');
      expect(response.text).toContain('Try again');
    });

    test('should show error for invalid num2', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '5', num2: 'xyz', op: '+' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Invalid input: Please provide valid numbers');
    });

    test('should show error for missing inputs', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ num1: '', num2: '', op: '+' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error: Invalid input: Please provide valid numbers');
    });
  });
});
