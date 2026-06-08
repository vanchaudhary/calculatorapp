---
applyTo: **/*.test.ts, **/*.test.tsx, **/*.spec.ts, test/**, tests/**
---

# Testing Instructions

> This file loads ONLY when editing test files (`.test.ts`, `.spec.ts`). It does not appear when editing application code.

## Test Structure

```typescript
describe('Module or Function Name', () => {
  describe('Feature or Scenario', () => {
    test('should do X in case A', () => {
      // Arrange: set up data/mocks
      // Act: call the function
      // Assert: check the result
    });
  });
});
```

## Naming Conventions

- Test names: `should [expected behavior] when [condition]`
- Examples:
  - ✅ `should return user email when user exists`
  - ✅ `should throw error when email is invalid`
  - ❌ `test user`
  - ❌ `works`

## Mocking & Stubs

- Mock external APIs (HTTP calls, databases, third-party services)
- Use `jest.mock()` or your framework's mocking tool
- Mock at the module level, not in individual tests (unless testing different mock scenarios)
- Verify mocks were called with `expect(mock).toHaveBeenCalledWith(...)`

## Fixtures & Test Data

- Keep fixtures in `test/fixtures/` or `src/__tests__/fixtures/`
- One fixture file per module/feature
- Use factory functions for generating test data: `createUser({ name: 'John' })`
- Never hardcode IDs; use `uuid()` for realistic test data

## Coverage & Assertions

- Aim for >80% coverage on critical paths
- Test happy path, error cases, and edge cases
- Use specific assertions: `expect(x).toBe(5)` not `expect(x).toBeTruthy()`
- Test behavior, not implementation details

## Async & Promises

- Mark test as `async` if testing async code
- Use `await` for promises
- Test rejected promises: `expect(fn()).rejects.toThrow()`

## Component Testing (React)

- Import `render` from `@testing-library/react`
- Render component, query by role/label, simulate user events
- Test user interactions, not internal state
- Example:
  ```typescript
  test('should call onClick when button is clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
  ```

## Cleanup

- Tests should not depend on other tests (no shared global state)
- Use `beforeEach` to reset mocks, clear timers, etc.
- Cleanup database state after each test (if testing with real DB)

---

**Token Cost:** This file loads only in test files, not in application code.
