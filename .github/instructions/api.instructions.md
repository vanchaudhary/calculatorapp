---
applyTo: src/api/**, src/routes/**, src/controllers/**, src/**/*.controller.ts
---

# API & Backend Instructions

> This file loads ONLY when editing API routes, controllers, or backend services. It does not appear when editing components or tests.

## Route / Endpoint Conventions

- **Naming:** `/api/v1/resource-name` (kebab-case, plural for collections)
- **HTTP methods:** GET, POST, PUT, PATCH, DELETE (not custom verbs)
- **Status codes:** 200 (ok), 201 (created), 204 (no content), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- **Response shape:** Always return JSON with `{ data: {...}, meta?: {...}, error?: {...} }`

## Request Validation

- Validate all inputs before processing
- Use [Zod / Joi / Yup] (specify your validator) for schema validation
- Return 400 with detailed error messages if validation fails
- Never assume request data is in the expected format

## Authentication & Authorization

- Check auth token on every protected route
- Use middleware for auth checks, not inline in every handler
- Attach user context to `req.user` after validation
- Return 401 if token invalid, 403 if user lacks permissions

## Error Handling

- Wrap async handlers in try/catch
- Log errors with context (user ID, request ID, timestamp)
- Return 500 with generic message to client (do not leak internal details)
- Pass full error details to monitoring service (Sentry, DataDog, etc.)

## Database Access

- Use an ORM or query builder — never raw SQL concatenation
- All queries should have parameterized statements
- Always include appropriate indexes for common queries
- Test queries on production-like data volumes

## Middleware Order

1. Request logging
2. Body parsing
3. Authentication
4. Authorization
5. Route handler
6. Error handling

## Testing

- Test each endpoint with valid and invalid inputs
- Test unauthorized/forbidden scenarios
- Mock database calls — do not hit real DB in tests
- Use fixtures for consistent test data

---

**Token Cost:** This file loads only when editing `/api/`, `/routes/`, or controller files, not when editing components or tests.
