# Calculator App Documentation

## Overview

This repository contains two runnable Express applications and one reusable
calculator module:

1. The root application (`app.js`) serves an HTML calculator form.
2. `calculator.js` exposes arithmetic functions for use from other Node.js
   code and writes structured events through `logger.js`.
3. `api-demo/` is an independent REST API example that stores items in memory.

The applications are demonstrations rather than production services. They do
not use a database, authentication, or persistent storage.

## Requirements

- Node.js 18 or later (matching the root `Dockerfile`)
- npm
- Docker, optionally, for containerized use

## Calculator web application

### Install and run

From the repository root:

```bash
npm ci
npm start
```

The server listens on port `3000` by default. Override it with the `PORT`
environment variable:

```bash
PORT=8080 npm start
```

Open `http://localhost:<port>` in a browser.

### Web workflow

1. Enter two numeric operands.
2. Select `+`, `-`, `*`, or `/`.
3. Submit the form.
4. The server validates the values, performs the operation, and renders the
   result.

Both integer and decimal inputs are accepted. Invalid numbers, unsupported
operators, and division by zero produce an HTTP `400` response.

### Endpoint reference

| Method | Path | Request | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET` | `/` | None | `200` HTML calculator form | N/A |
| `GET` | `/healthz` | None | `200` JSON: `{"status":"ok"}` | N/A |
| `POST` | `/calculate` | URL-encoded `num1`, `num2`, and `op` | `200` HTML result | `400` for invalid input, operation, or division by zero |

Example request:

```bash
curl -X POST http://localhost:3000/calculate \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'num1=12.5&op=*&num2=2'
```

The response contains `Result: 25`.

### Error handling

The route validates both operands with `Number.isFinite`. It checks the
operator against an explicit allowlist and rejects division by zero before
performing the calculation. Unexpected route errors are forwarded to the
central error handler, logged, and returned as HTTP `500`.

The application disables Express's `X-Powered-By` response header and applies
a Content Security Policy to the calculator page.

### Logs

The root web application writes JSON lines to standard output:

- `request` after every completed request, with method, path, status, and
  duration;
- `calculation` after a successful calculation;
- validation warnings for invalid input, invalid operators, or division by
  zero;
- `unhandled_error` for unexpected errors; and
- `server_started` when the process begins listening.

These logs are suitable for collection by a container runtime or process
manager.

## Calculator module

`calculator.js` can be used independently of the web application.

```javascript
const { calc, processUserInput } = require('./calculator');

calc(8, 2, 'div'); // 4
processUserInput({ n1: '4', n2: '5', operation: 'mul' }); // { r: 20 }
```

### `calc(a, b, op, requestId?)`

Supported operation names:

| Operation | Meaning |
| --- | --- |
| `add` | Addition |
| `sub` | Subtraction |
| `mul` | Multiplication |
| `div` | Division |

The function returns the numeric result, `"NO"` for division by zero, or
`null` for an unknown operation. The optional request ID is included in log
events.

### `processUserInput(request)`

The request object accepts:

| Property | Description |
| --- | --- |
| `n1` | First number or numeric string |
| `n2` | Second number or numeric string |
| `operation` | One of the operation names above |
| `requestId` or `id` | Optional correlation ID |
| `headers["x-request-id"]` | Alternative correlation ID |

The return shape is `{ r: result }`.

### Module logging

`logger.js` emits JSON lines containing a level, event name, timestamp, and
optional request ID. It removes top-level `password`, `token`,
`authorization`, `ssn`, and `email` fields from log context.

## REST API demo

The application in `api-demo/` has its own dependencies and is run separately.

```bash
cd api-demo
npm install
npm start
```

It listens on port `3000` unless `PORT` is set.

### Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/api/items` | Returns all items as a JSON array |
| `POST` | `/api/items` | Adds the JSON request body and returns it with status `201` |

Example:

```bash
curl -X POST http://localhost:3000/api/items \
  -H 'Content-Type: application/json' \
  --data '{"name":"sample"}'

curl http://localhost:3000/api/items
```

Items are held in process memory. Restarting the API clears them. The demo does
not validate item fields and should not be exposed as a production API.

## Docker

The root `Dockerfile` installs dependencies with `npm ci`, copies the
repository, exposes port `3000`, and launches `app.js`.

```bash
docker build -t calculatorapp .
docker run --rm -p 3000:3000 calculatorapp
```

To publish on a different host port:

```bash
docker run --rm -p 8080:3000 calculatorapp
```

Then open <http://localhost:8080>.

## Project structure

```text
.
├── app.js                         Root calculator web server
├── calculator.js                  Reusable arithmetic module
├── logger.js                      Structured logger for calculator.js
├── package.json                   Root dependencies and scripts
├── Dockerfile                     Root application container
├── api-demo/
│   ├── package.json               REST API dependencies and scripts
│   └── src/
│       ├── index.js               REST API entry point
│       ├── config/config.js       Port configuration
│       ├── controllers/
│       │   └── apiController.js   In-memory item handlers
│       └── routes/api.js          Item routes
└── docs/architecture/
    └── hld-cdc-iceberg.md         Separate data-platform design reference
```

## Validation

After starting the root application, verify the main paths:

```bash
curl -i http://localhost:3000/healthz
curl -i http://localhost:3000/
curl -i -X POST http://localhost:3000/calculate \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'num1=9&op=/&num2=3'
curl -i -X POST http://localhost:3000/calculate \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'num1=9&op=/&num2=0'
```

The first three requests should return `200`; the division-by-zero request
should return `400`.

## Troubleshooting

### Port already in use

Choose another port:

```bash
PORT=8080 npm start
```

### Dependencies are missing

Run `npm ci` in the application directory. The root application and
`api-demo/` have separate `package.json` files and dependencies.

### API demo data disappeared

This is expected. The API demo uses an in-memory array and does not persist
items between process restarts.

### Calculator module and web operators differ

The HTML form uses symbols (`+`, `-`, `*`, `/`), while `calculator.js` uses
operation names (`add`, `sub`, `mul`, `div`). They are currently separate
demonstration interfaces.

## Additional architecture reference

[`docs/architecture/hld-cdc-iceberg.md`](docs/architecture/hld-cdc-iceberg.md)
documents an independent CDC-to-Iceberg data-platform design. It is included
for reference and is not part of either Node.js application's runtime.
