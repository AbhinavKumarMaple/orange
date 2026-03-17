---
inclusion: always
---

# Next.js Development Rules

## UI Library — shadcn/ui

- We use **shadcn/ui** for all UI components.
- NEVER manually create shadcn components. Always install them using the official CLI:
  ```bash
  npx shadcn@latest add <component-name>
  ```
- If a component isn't available in shadcn, build a custom one in `components/custom/` and document it.

## UI Component Documentation

- Maintain a `components/UI_COMPONENTS.md` file.
- Keep it minimal — a table listing each component, its props, and a one-liner of what it does.
- Update this doc every time a new UI component is added or modified.
- Example format:
  ```
  | Component | Key Props | Description |
  |-----------|-----------|-------------|
  | Button    | variant, size, disabled | Triggers actions |
  | Dialog    | open, onOpenChange | Modal overlay |
  ```

## Modular Code

- If a component or function file exceeds ~150 lines, split it.
- Extract hooks into `hooks/`, helpers into `lib/` or `utils/`, and sub-components into the same folder as the parent.
- Prefer composition over monolithic files. Each file should have a single clear responsibility.

## Folder-Level Documentation

- Every utility/helper folder (`utils/`, `lib/`, `hooks/`, `services/`, etc.) must contain a small `README.md`.
- Format: a simple table or list of exported functions with a one-line description of what each does.
- Update the README whenever functions are added, removed, or renamed.
- Example:
  ```
  | Function        | Description                        |
  |-----------------|------------------------------------|
  | formatDate      | Formats a Date to "MMM DD, YYYY"  |
  | cn              | Merges Tailwind classes via clsx   |
  ```

## General Next.js Standards

- Use the App Router (`app/` directory).
- Default to Server Components. Only add `"use client"` when the component genuinely needs client-side interactivity (state, effects, event handlers, browser APIs).
- Colocate related files: keep page-specific components, types, and utils close to their route.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` for route-level UX states.
- Prefer Next.js `<Image>`, `<Link>`, and `<Script>` over raw HTML equivalents.
- Use `metadata` exports or `generateMetadata` for SEO on every page.

## Styling

- Tailwind CSS is the primary styling approach.
- Use the `cn()` utility (from `lib/utils`) to merge class names.
- Avoid inline `style` props unless absolutely necessary.
- Keep Tailwind classes readable — extract to component variants or `cva` when a class string gets long.

## Data Fetching & State

- Fetch data in Server Components where possible.
- For client-side state, prefer React hooks and context over external state libraries unless complexity demands it.
- Validate all external data (API responses, form inputs) using `zod`.

## File & Naming Conventions

- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Utilities/hooks: `camelCase.ts` (e.g., `useAuth.ts`, `formatDate.ts`)
- Route files: follow Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`)
- Types: colocate in a `types.ts` file near usage, or in a shared `types/` folder for cross-cutting types.

## Error Handling

- Wrap async operations in try/catch.
- Use `error.tsx` boundaries at the route level.
- Log errors server-side; show user-friendly messages client-side.

## Environment Variables

- Prefix client-exposed vars with `NEXT_PUBLIC_`.
- Keep secrets server-only — never import them in `"use client"` files.
- Use `.env.local` for local dev, never commit it.
