'use strict';

const express = require('express');
const app = express();
const PORTNO = Number(process.env.PORT) || 3000;

// Basic hardening
app.disable('x-powered-by');

// Body parsing: no nested objects needed
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - started;
    // Minimal structured log
    console.log(JSON.stringify({
      level: 'info',
      msg: 'request',
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: ms,
    }));
  });
  next();
});

// Health endpoint for readiness/liveness checks
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  // Minimal CSP and content type for the demo page
  res.set('Content-Security-Policy', "default-src 'self'; base-uri 'self'; form-action 'self'");
  res.type('html').send(`
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

app.post('/calculate', (req, res, next) => {
  try {
    const { num1, num2, op } = req.body ?? {};
    const a = Number(num1);
    const b = Number(num2);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      console.warn(JSON.stringify({
        level: 'warn',
        msg: 'invalid_input',
        num1, num2
      }));
      return res.status(400).type('html').send('<h2>Invalid numeric input</h2><a href="/">Try again</a>');
    }

    const ops = {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '*': (x, y) => x * y,
      '/': (x, y) => x / y,
    };

    const fn = ops[op];
    if (!fn) {
      console.warn(JSON.stringify({
        level: 'warn',
        msg: 'invalid_operation',
        op
      }));
      return res.status(400).type('html').send('<h2>Invalid operation</h2><a href="/">Try again</a>');
    }

    if (op === '/' && b === 0) {
      console.warn(JSON.stringify({
        level: 'warn',
        msg: 'divide_by_zero_attempt',
        a, b
      }));
      return res.status(400).type('html').send('<h2>Cannot divide by zero</h2><a href="/">Try again</a>');
    }

    const result = fn(a, b);
    console.log(JSON.stringify({
      level: 'info',
      msg: 'calculation',
      a, op, b, result
    }));
    res.type('html').send(`<h2>Result: ${result}</h2><a href="/">Try again</a>`);
  } catch (err) {
    next(err);
  }
});

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(JSON.stringify({
    level: 'error',
    msg: 'unhandled_error',
    error: err && err.stack ? err.stack : String(err),
  }));
  if (res.headersSent) return;
  res.status(500).type('html').send('<h2>Internal Server Error</h2><a href="/">Home</a>');
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    level: 'info',
    msg: 'server_started',
    url: `http://localhost:${PORT}`,
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  }));
});


