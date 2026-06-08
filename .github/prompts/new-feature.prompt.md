# New Feature Prompt Template

Use this prompt instead of relying on chat history when starting a new feature.
**Copy → fill in the [SLOTS] → paste into Copilot Chat.**

---

## Feature Request

**Title:** [FEATURE_TITLE]

**User Story:**
> As a [USER_TYPE], I want to [GOAL], so that [BENEFIT].

**Requirements:**
- [REQ_1]
- [REQ_2]
- [REQ_3]

**Out of Scope:**
- [NOT_DOING_1]
- [NOT_DOING_2]

---

## API / Component Interface

```typescript
// Expected interface/signature
[INTERFACE_OR_TYPE_DEFINITION]
```

**Example Usage:**
```typescript
[EXAMPLE_CALL_OR_USAGE]
```

---

## Acceptance Criteria

- [ ] [CRITERION_1]
- [ ] [CRITERION_2]
- [ ] [CRITERION_3]
- [ ] Unit tests written with >80% coverage
- [ ] No console.error or unhandled rejections in test run

---

## Files to Create/Modify

- `[FILE_1]` — [PURPOSE]
- `[FILE_2]` — [PURPOSE]
- `[FILE_3]` — [PURPOSE]

---

## Test Stubs (if Needed)

```typescript
describe('[FEATURE_NAME]', () => {
  test('should [BEHAVIOR]', () => {
    // [TODO]
  });

  test('should [ERROR_CASE]', () => {
    // [TODO]
  });
});
```

---

**Context Cost:** This prompt costs ~150–200 tokens. A rambling chat session to arrive at the same point costs 2,000–5,000 tokens.
