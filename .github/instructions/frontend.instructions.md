---
applyTo: src/components/**, src/pages/**, src/**/*.tsx, src/**/*.jsx
---

# Frontend Component Instructions

> This file loads ONLY when editing files under `src/components/`, `src/pages/`, or any `.tsx`/`.jsx` file. It does not appear as context when editing backend code.

## Component Patterns

- **Functional components only** — no class components
- **Use React hooks** — `useState`, `useEffect`, `useContext`, `useMemo`
- **Prop interface per component:**
  ```typescript
  interface CardProps {
    title: string;
    description?: string;
    onClick?: (id: string) => void;
  }
  ```
- **Export as default or named** — be consistent within the project

## File Structure

- One component per file
- Filename matches component name in PascalCase: `UserCard.tsx`
- Keep components ≤300 lines; extract sub-components if longer

## Styling

- Use [CSS-in-JS / CSS Modules / Tailwind / Styled Components] (specify your approach)
- No inline styles on JSX elements
- Use design tokens from `src/theme/` for colors, spacing, fonts

## State Management

- Local state: `useState` for component-level state
- Shared state: [Redux / Zustand / Context API] (specify your tool)
- Never prop-drill more than 2 levels; use Context if deeper

## Performance

- Memoize expensive components: `React.memo()` if re-renders unnecessarily
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to child components
- Lazy-load routes with `React.lazy()` + `Suspense`

## Accessibility

- Add `aria-label` or `aria-labelledby` to interactive elements
- Use semantic HTML: `<button>`, `<a>`, `<form>`, not `<div>` with click handlers
- Test keyboard navigation (Tab key should work)
- Ensure color contrast meets WCAG AA standard

## Error Boundaries

- Wrap major features in Error Boundaries (import from `src/components/ErrorBoundary`)
- Pass `fallback` component to boundary

## Testing

- Every component gets a test file: `ComponentName.test.tsx`
- Test user interactions, not implementation details
- Mock external API calls and context providers

---

**Token Cost:** This file loads only when editing `.tsx`/`.jsx` files, not when editing APIs or configs.
