# Progress: Music Corner

## What is Done
- Task 01 completed: Project scaffolded with Next.js 15 (App Router), TypeScript (strict mode), ESLint, and Tailwind CSS.
- Git repository initialized with `.gitignore` covering `node_modules`, `.next`, `.env`, and `.env*.local`.
- Extracted and established design tokens in `design/tokens.css` and mirrored in `src/styles/tokens.css`.
- Configured Tailwind CSS to map colors, spacing, radii, component heights, and 14 typography utility classes (`display`, `page-title`, `section-title`, `card-title`, `subtitle`, `item`, `small-heading`, `body-large`, `body`, `supporting`, `button`, `form-label`, `meta`, `caption`).
- Loaded Manrope (600, 700) and Inter (400, 600) via self-hosted `next/font`.
- Added Zod environment variable validation in `src/lib/env.ts` with `.env.example`.
- Configured Vitest with smoke test suite passing.
- Replaced default home page with minimal "Music Corner" placeholder on background token.
- Created `README.md`.
- Added `BUILD-PLAN.md` and complete project context in `AGENTS.md`.

## Data Model State
- Not yet scaffolded (scheduled for Task 02).
- Prisma and PostgreSQL schema will be initialized in Task 02 according to `AGENTS.md` Section 5.

## Environment Variables Added
- `NODE_ENV`

## Decisions Made and Rationale
- Used Next.js 15 App Router with Tailwind CSS v3 for stable token integration and utility classes.
- Decorative typefaces (Anton SC, Kolker Brush) excluded from global fonts to be supplied as SVG assets per instructions.
- Tokens annotated with `CONFIRM` comments for values inferred from Figma and UI Kit (supporting line-height, input height, card radius target).

## Known Issues
- None. `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all pass cleanly.

## Next Task
- **Task 02: Database and auth**
  - Add Prisma & PostgreSQL connection.
  - Create initial schema: User, GuardianLink, Course, Module, Session, Subscription, SeatHold, WebhookEvent.
  - Setup Clerk integration (email/password + Google).
  - Add auth middleware, user upsert on first sign-in, and role helpers (`requireUser`, `requireRole`).
