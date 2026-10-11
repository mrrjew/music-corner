# Music Corner

Music Corner is a web application for an online music school offering live group music courses, schedules, and student enrolment.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Set `NODE_ENV=development`.

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles the production build.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to check code quality.
- `npm run typecheck`: Runs TypeScript compiler (`tsc --noEmit`) to verify types.
- `npm run test`: Runs the Vitest test suite.

## Design & Tokens

- **Tokens Source**: `design/tokens.css` contains all raw design tokens, typography rules, component heights, and spacing scales.
- **Global Tokens**: Mirrored directly in `src/styles/tokens.css` and imported into Tailwind CSS via `tailwind.config.ts`.
- **Figma Assets**: Raw UI kit exports and mockup archives live in the project root.
