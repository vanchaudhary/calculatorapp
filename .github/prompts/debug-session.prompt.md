# Debug Session Prompt Template

Use this when debugging a production issue or confusing test failure.
**Copy → fill in the [SLOTS] → paste into Copilot Chat.**

This replaces a rambling 20-message debug chat with a focused request.

---

## Problem Summary

**What's Happening:**
[BRIEF_DESCRIPTION]

**Expected Behavior:**
[WHAT_SHOULD_HAPPEN]

**Actual Behavior:**
[WHAT_IS_HAPPENING]

**Severity:** [critical / high / medium / low]

---

## Stack Trace

```
[PASTE_FULL_STACK_TRACE_HERE]
```

---

## Reproduction Steps

1. [STEP_1]
2. [STEP_2]
3. [STEP_3]
4. Observe: [EXPECTED_vs_ACTUAL]

---

## Relevant Files

These files are involved (Copilot will search inside them):

- `[FILE_1]` — [WHY_RELEVANT]
- `[FILE_2]` — [WHY_RELEVANT]
- `[FILE_3]` — [WHY_RELEVANT]

---

## What I've Tried

- [ ] [ATTEMPT_1]
- [ ] [ATTEMPT_2]
- [ ] [ATTEMPT_3]

---

## Questions for Copilot

1. What does the stack trace indicate about the root cause?
2. Is this a known pattern or edge case?
3. What's the minimal fix vs. the proper fix?

---

**Context Cost:** This prompt costs ~200–300 tokens. An unstructured debug conversation costs 3,000–8,000 tokens with often less clarity.
