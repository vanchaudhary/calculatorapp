const { test } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('./app');

test('adds numbers', async () => {
  const res = await request(app)
    .post('/calculate')
    .type('form')
    .send({ num1: '2', op: '+', num2: '3' });

  assert.strictEqual(res.statusCode, 200);
  assert.match(res.text, /Result:\s*5/);
});

test('subtracts numbers', async () => {
  const res = await request(app)
    .post('/calculate')
    .type('form')
    .send({ num1: '5', op: '-', num2: '2' });

  assert.strictEqual(res.statusCode, 200);
  assert.match(res.text, /Result:\s*3/);
});

test('multiplies numbers', async () => {
  const res = await request(app)
    .post('/calculate')
    .type('form')
    .send({ num1: '4', op: '*', num2: '2' });

  assert.strictEqual(res.statusCode, 200);
  assert.match(res.text, /Result:\s*8/);
});

test('divides numbers', async () => {
  const res = await request(app)
    .post('/calculate')
    .type('form')
    .send({ num1: '8', op: '/', num2: '4' });

  assert.strictEqual(res.statusCode, 200);
  assert.match(res.text, /Result:\s*2/);
});

test('handles divide by zero', async () => {
  const res = await request(app)
    .post('/calculate')
    .type('form')
    .send({ num1: '5', op: '/', num2: '0' });

  assert.strictEqual(res.statusCode, 400);
  assert.match(res.text, /Cannot divide by zero/);
});

test('rejects invalid numbers', async () => {
  const res = await request(app)
    .post('/calculate')
    .type('form')
    .send({ num1: 'abc', op: '+', num2: '3' });

  assert.strictEqual(res.statusCode, 400);
  assert.match(res.text, /Please enter valid numbers/);
});
