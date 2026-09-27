# Calculator App

A small Node.js repository containing:

- an Express-based calculator web application;
- a reusable calculator module with structured logging; and
- a separate in-memory REST API example under [`api-demo/`](api-demo/).

## Quick start

### Prerequisites

- Node.js 18 or later
- npm

### Run the calculator web app

```bash
git clone https://github.com/vanchaudhary/calculatorapp.git
cd calculatorapp
npm ci
npm start
```

Open <http://localhost:3000>. Set `PORT` to use a different port:

```bash
PORT=8080 npm start
```

The web app supports addition, subtraction, multiplication, and division. It
validates numeric input and rejects division by zero.

### Run with Docker

```bash
docker build -t calculatorapp .
docker run --rm -p 3000:3000 calculatorapp
```

### Check the service

```bash
curl http://localhost:3000/healthz
```

Expected response:

```json
{"status":"ok"}
```

## Documentation

See [`DOCUMENTATION.md`](DOCUMENTATION.md) for the project structure, endpoint
reference, calculator module API, logging behavior, REST API demo, deployment
instructions, and troubleshooting guidance.

The repository also includes a separate data-platform architecture reference:
[`docs/architecture/hld-cdc-iceberg.md`](docs/architecture/hld-cdc-iceberg.md).
