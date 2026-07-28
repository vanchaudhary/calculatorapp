# Implementation Documentation

## Scope

This branch contains a simple calculator web application implemented with Node.js and Express.

## Runtime Components

- **`app.js`**
  - Starts the Express server on `PORT` (default `3000`)
  - Serves a calculator form at `GET /`
  - Exposes a health endpoint at `GET /healthz`
  - Handles calculation requests at `POST /calculate`
  - Validates input and operation values
  - Prevents division by zero
  - Logs requests, calculation activity, warnings, and unhandled errors

- **`calculator.js`**
  - Exposes reusable calculation logic (`calc`)
  - Exposes input-processing helper (`processUserInput`)
  - Adds structured logging through `logger.js`

- **`logger.js`**
  - Centralized logger utility used by calculation logic

## Request Flow

1. User opens `/` and submits two numbers plus an operator.
2. Server parses form input from URL-encoded payload.
3. Server validates numbers and operation.
4. Server computes result or returns a safe validation error.
5. Server responds with a simple HTML message and retry link.

## Validation and Error Handling

- Rejects invalid numeric input
- Rejects unsupported operations
- Rejects division by zero
- Uses a centralized Express error handler for unexpected failures

## Test Coverage in This Branch

- Unit tests for `calculator.js` are located at `tests/calculator.test.js`
- Covered behaviors:
  - add, subtract, multiply, divide
  - divide-by-zero handling
  - unsupported operation handling
  - `processUserInput` happy path

## Verification Commands

```bash
npm install
npm test
node app.js
```
