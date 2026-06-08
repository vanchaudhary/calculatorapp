# Token-Optimized Copilot Setup Guide

> 📋 **This file is for humans, not for Copilot.** It documents session rules, model selection, and billing strategies.

## Background

As of June 2026, GitHub Copilot switched from flat-rate billing to **usage-based pricing on tokens consumed**. Input tokens, output tokens, and cached tokens all cost money. Without proper setup and discipline, costs can increase 10x–50x overnight.

**The goal:** Start every developer with the right files, settings, and habits so token costs stay predictable.

---

## Session Discipline — Daily Habits

These are the highest-impact practices for controlling costs. No tooling can enforce them — they must become team norms.

### ✅ Do This

- **One topic per session** — Open a new chat when the subject changes (e.g., "fixing auth" → "new API endpoint")
- **Close chat every ~25 min** — Reopen after a Pomodoro break or task switch
- **Max 8 exchanges per session** — Close and start fresh after; chat history bloats context
- **Keep 5 tabs max open** — Each open tab is potential context payload sent with every request
- **Highlight only relevant lines** — Selecting code before asking scopes the context cost
- **Save decisions to `.prompt.md`** — Not chat history; see [`new-feature.prompt.md`](.github/prompts/new-feature.prompt.md) for the pattern
- **Use `Ctrl+I` for small edits** — Inline edit mode costs less than chat for simple changes

### ❌ Avoid This

- Long rambling chat sessions (saves 1,000s of tokens if you break at 8 exchanges)
- Leaving Copilot chat open between work sessions (context persists)
- Pasting large error logs or stack traces directly — summarize first
- Asking one question per line — batch related questions together
- Keeping 10+ editor tabs open (Copilot includes them as context)

---

## Model Selection — Always Start Cheap

| Model | Cost | When to Use | ⚠️ When NOT to Use |
|---|---|---|---|
| **GPT-4o mini** / **Claude Haiku** | ✅ Cheapest | Autocomplete, CRUD boilerplate, simple fixes, variable renaming, formatting | Complex logic, security decisions, architectural choices |
| **GPT-4o** / **Claude Sonnet** | 🟡 Mid-tier | Code review, refactoring, test writing, documentation | Hard debugging, system design, security audits |
| **o3** / **Claude Opus** | 🔴 Most expensive | System design, hard debugging, security audits, architecture decisions | Routine coding, simple fixes, boilerplate generation |

**Rule:** Always start with the **cheapest model** that can answer your question. Upgrade only if the first attempt is wrong or insufficient. Never leave a frontier model selected as your default.

---

## Monthly Billing Checklist

### First of Every Month
- [ ] Check GitHub billing dashboard: `github.com → Settings → Billing → Copilot`
- [ ] Review per-model token breakdown from previous month
- [ ] Note any spikes and correlate to project work
- [ ] Adjust team rules if a category spiked

### Set a Spending Cap (One-Time, Per Account)
- Go to: `github.com → Settings → Billing → Copilot → Spending Limit`
- Set a monthly cap (e.g., $50 for a team of 5)
- GitHub will disable Copilot for the month if cap is reached
- **Recommended:** Set cap to (monthly budget × 1.2) to avoid surprises

### Disable Auto Code Review on PR
- GitHub's code review auto-trigger (Copilot reviewing every PR) consumes extra AI Credits
- Disable in repository settings → Code Security and Analysis → GitHub Copilot
- Trigger code review manually only when needed

---

## Path-Specific Instructions

This project has additional instruction files scoped to specific file patterns:

| File | Applies To | Purpose |
|---|---|---|
| `.github/instructions/frontend.instructions.md` | `src/components/**` | Component patterns, hooks, styling |
| `.github/instructions/api.instructions.md` | `src/api/**` or `src/routes/**` | REST/API conventions, validation, error handling |
| `.github/instructions/tests.instructions.md` | `**/*.test.ts`, `**/*.spec.ts` | Test framework, mocks, assertions |
| `.github/instructions/migrations.instructions.md` | `prisma/migrations/**` or `db/migrations/**` | Database safety: no raw SQL, backfill strategy |

These files are only loaded when you edit files matching their pattern — zero cost overhead when not in use.

---

## Reusable Prompts

Instead of relying on long chat history, save common tasks as prompt files in `.github/prompts/`:

- **[`new-feature.prompt.md`](.github/prompts/new-feature.prompt.md)** — Structured prompt for starting a new feature (requirements, API shape, test stubs)
- **[`debug-session.prompt.md`](.github/prompts/debug-session.prompt.md)** — Structured debug prompt (stack trace, reproduction steps, files in scope)

**To use:** Copy the relevant prompt file, fill in the slots, paste into Copilot Chat. This replaces rambling chat history with a focused request (~200 tokens vs. 3,000+).

---

## Weekly Habits

- [ ] Run: `npx copilot-token-optimizer audit` — Check your project score
- [ ] Review which MCP servers are connected — disable any unused
- [ ] Spot-check which model you're actually using — adjust defaults if pattern changed

---

## Monthly Maintenance

- [ ] Audit `copilot-instructions.md` — Paste it into Copilot Chat and ask: *"Which rules are redundant or could move to a path-specific file?"*
- [ ] Run: `npx copilot-token-optimizer update` — Pull latest template improvements
- [ ] Review `.copilotignore` — Add any new generated or build directories that appeared
- [ ] Check MCP servers — Remove stale servers from your Copilot CLI config

---

## Model Routing Guide

**Use this table to pick the right model for your task:**

### ✅ Use GPT-4o mini (Default chat model override)
- Autocomplete & inline suggestions
- CRUD boilerplate (controllers, models, simple services)
- Simple bug fixes (off-by-one, typo, simple logic error)
- Renaming, formatting, import organization
- Test stub generation (basic test case templates)
- Markdown, comments, documentation drafts

### ✅ Use GPT-4o (Suggested default for chat)
- Code review & refactoring proposals
- Test writing for complex scenarios
- Documentation generation from code
- API endpoint design & contract definition
- Package/library selection advice
- Moderate debugging (multi-step traces)

### ✅ Use o3 (Manual upgrade only)
- System design & architecture decisions
- Hard debugging (multi-layer, production data-dependent)
- Security audit & vulnerability fix
- Performance optimization across layers
- Complex business logic refactoring
- Legal/compliance decision-making

---

## Troubleshooting

**Q: My Copilot chat is slow or giving bad answers.**
- Close the chat, reopen (clears context history)
- Reduce open editor tabs to ≤5
- Try a different model (upgrade to GPT-4o if using mini)
- Make sure `.copilotignore` is populated

**Q: My monthly bill spiked without explanation.**
- Check GitHub billing dashboard for per-model breakdown
- Look for long chat sessions with many exchanges
- Verify `.copilotignore` has `node_modules/`, `dist/`, `*.lock`
- Disable auto code review on PR (if enabled)

**Q: Can I revert to a cheaper model mid-task?**
- Yes. In VS Code, highlight code → right-click → "Ask Copilot" → select model. But this starts a new request, so only do it if the current model's answer is wrong.

**Q: My instructions file keeps growing. What do I do?**
- Extract domain-specific rules to path-specific `.instructions.md` files
- Move rationale & explanations to `CONTRIBUTING.md`
- Ask Copilot: *"Which rules in this instructions file could be path-specific?"*

---

## Rationale & Further Reading

For the reasoning behind every decision in this setup, see [`docs/why.md`](docs/why.md).

Key insights:
- Input context is the biggest cost driver (not output)
- Session discipline (closing chat, max 8 exchanges) saves 80% of wasted tokens
- Model selection per task saves 50–70% compared to always using the most expensive model
- Path-specific instructions keep core instructions lean without losing coverage

---

**Last Updated:** June 2026
**Questions?** See the troubleshooting section above or open an issue in the repository.
