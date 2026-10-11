# Music Corner: Build Plan and Task Prompts

Keep this file in the repo root next to `AGENTS.md`. It is the playbook for the whole build. The AI follows `AGENTS.md` (the rules). You follow this file (the process).

## 1. How every session works

One task = one fresh agent session = one commit.

1. Open a NEW session in the project folder. Never continue an old conversation.
2. Paste the **Session Starter** below, then the task prompt.
3. The agent replies with a plan and stops. Read it. Reply "approved" only if it matches the task and touches only the listed files.
4. The agent does the work and pastes real output of lint, type check, tests and build.
5. You run the same four commands yourself.
6. You review the diff with the checklist in Section 3.
7. You commit. Then ask the agent to update `PROGRESS.md` (Section 4) and commit that too.

If any step fails, fix it in the same session before moving on. Never start the next task on a broken build.

## 2. Session Starter (paste first, every time)

```
Read AGENTS.md and PROGRESS.md in the project root completely before doing anything. Follow AGENTS.md exactly. This workspace is the Music Corner music school project only. Ignore any other project or open editor tab.

Work in two steps. Step 1: reply with a plan (files to create or change, commands to run, anything unclear or in conflict) and STOP. Do not write code until I say "approved". Step 2: do only what the plan says.

Hard limits: change only the files the task names. Add no dependency without asking. Invent no colour, size, spacing or layout: use design/tokens.css and the images in design/. If a design is missing, stop and ask. PayPal sandbox only. Never print, log or commit secrets. Do not commit; I will review first. Report real command output. Say what you could not verify.
```

## 3. Review checklist (you, before every commit)

- `git status` and `git diff --stat`: only the files the task named changed. A surprise file means stop and ask why.
- `package.json` diff: no new dependency you did not approve.
- No `.env` or keys in the diff. `.env.example` has names only.
- No `console.log`, no `any`, no `@ts-ignore`, no skipped tests.
- Lint, type check, tests and build all pass when YOU run them.
- UI tasks: it matches the design image, uses only token values, and none of the 20 vibecoded signs in `AGENTS.md` Section 7 appear.
- Payment, access and capacity tasks: tests exist and cover the failure cases named in the task. Paste the webhook and access-control diffs to Claude for a second review before you commit them.

## 4. Progress file (context handoff)

At the end of every task, paste this:

```
Update PROGRESS.md: what is done, the current state of the data model, environment variables added (names only), decisions made and why, known issues, and what the next task should be. Keep it under 60 lines. Change no other file.
```

The next session reads it, so it starts with the right context instead of guessing.

## 5. If the agent goes off the rails

- It touched files outside the task: `git restore` those files, then tell it which rule it broke and ask for a corrected plan.
- It added a dependency or changed the stack: revert, and point it to AGENTS.md Section 4.
- It is guessing at a design: stop it and give it the exact screen image and the token names.
- It claims something works but shows no output: ask for the real command output.
- A session has gone long and sloppy: commit what is good, discard the rest, start a fresh session.

## 6. Task list

### Task 02: Database and auth

Prerequisites: Postgres database URL and Clerk keys in `.env` (Google enabled in the Clerk dashboard).

```
Task 02: database and auth. No pages from the designs.
1. Add Prisma and connect to Postgres. Create the schema from AGENTS.md Section 5 (User, GuardianLink, Course, Module, Session, Subscription, SeatHold, WebhookEvent) with sensible indexes and unique constraints (paypalSubscriptionId, paypalEventId, one active subscription per student per course). Money in cents, times in UTC. Create the first migration.
2. Add Clerk with email and password plus Google. Add middleware protecting everything except public routes (listed in a single config file).
3. Create a User row on first sign-in (upsert by Clerk id), default role STUDENT. Only an admin can change roles. Seed script that creates one ADMIN from an env var email.
4. Add server helpers requireUser() and requireRole(roles) that every protected route and server action must use.
5. Add the new env vars to src/lib/env.ts validation and .env.example (names only).
6. Tests: requireRole allows and denies correctly; the upsert does not create duplicates; a student cannot become admin through any code path.
Out of scope: pages, payments, emails, admin UI.
Done when: migration applies on a fresh database, tests pass, lint, typecheck and build pass. Paste the output.
```

### Task 03: Admin CRUD for courses, modules and sessions

Admin screens are not designed. Build plain functional forms using only UI Kit styling.

```
Task 03: admin CRUD. Protected by requireRole(ADMIN).
1. Courses: create, edit, publish and unpublish (DRAFT, PUBLISHED, ARCHIVED), assign a teacher, price in USD entered as dollars and stored as cents, capacity, start date.
2. Modules: add, edit, reorder within a course.
3. Sessions: add, edit, cancel, reschedule. Enter the time in the school's time zone, store UTC. Join URL field accepts only https URLs from zoom.us domains.
4. Validate everything with Zod on the server. Server actions or API routes only, no client-only checks.
5. Use the UI Kit look for inputs and buttons (design/ui-kit.png). Plain tables and forms. No invented dashboards, charts or decorative elements.
6. Tests: validation rejects bad input; non-admins are rejected; cents conversion has no rounding errors; times round-trip correctly across time zones.
Out of scope: public pages, payments, emails, notifications.
```

### Task 04: Enrolment domain logic (no PayPal calls yet)

```
Task 04: seat holds and subscription state, pure logic with tests. No PayPal API calls and no UI.
1. Seat holds: createHold(courseId, userId) inside a database transaction. Counts active subscriptions plus unexpired holds against capacity. Hold lasts 10 minutes. A user has at most one hold per course. Expired holds are ignored and cleaned up.
2. Subscription states: PENDING, ACTIVE, PAST_DUE, SUSPENDED, CANCELLED (access until currentPeriodEnd), EXPIRED. Write one function per allowed transition and make illegal transitions throw.
3. hasAccess(userId, courseId, now): true for ACTIVE, for PAST_DUE inside the grace period (a constant we will set later, default 3 days), and for CANCELLED before currentPeriodEnd.
4. Tests: two concurrent holds for the last seat (exactly one succeeds); expired hold frees the seat; every transition; access boundaries around currentPeriodEnd and the grace period.
Out of scope: PayPal, webhooks, emails, pages.
```

### Task 05: PayPal sandbox subscriptions and webhooks

Prerequisites: PayPal sandbox Business and personal test accounts, sandbox client id and secret in `.env`.

```
Task 05: PayPal sandbox integration. Sandbox only. Use the REST API directly with fetch, no PayPal SDK unless you ask first.
1. When a course is published, create a PayPal product and a monthly billing plan in USD for its price. Store paypalPlanId. If the price changes, create a new plan and keep the old one for existing subscribers.
2. Endpoint to start enrolment: requires a signed-in user, creates a seat hold, creates the PayPal subscription, returns the approval URL. If no seat is available, return a clear error.
3. The return URL page only shows "processing". It must never change access.
4. Webhook endpoint: verify the signature with PayPal's verify-webhook-signature API before anything else. Reject on failure. Insert WebhookEvent first (unique paypalEventId) and ignore repeats. Handle: subscription activated, payment completed, payment failed, suspended, cancelled, expired. Use the transition functions from Task 04. Out-of-order events must not corrupt state.
5. Student cancel: calls PayPal cancel, sets cancelAtPeriodEnd, access continues until currentPeriodEnd.
6. Tests with recorded sandbox payloads: duplicate event, out-of-order events, invalid signature, payment failed then succeeded, cancel then renewal event.
Out of scope: emails, dashboard UI, live mode.
Done when: I can subscribe with a sandbox account and see the status change from the webhook alone.
```

### Task 06: Join-link access and session changes

```
Task 06: gated join links.
1. Server route that returns a session's joinUrl only if hasAccess() is true for that course. Never include joinUrl in any public query, page props or client bundle. Teachers and admins can read their own courses' links.
2. Admin cancel or reschedule of a session records the change and queues a notification event for Task 07 (a database table, no email sending yet).
3. Tests: no account, wrong course, expired, cancelled-within-period, cancelled-after-period, past-due inside and outside grace. Confirm joinUrl never appears in any other response.
```

### Task 07: Emails and student dashboard

The dashboard is not designed. Ask me for a layout or build the simplest list view from UI Kit styles, and say which you chose.

```
Task 07: emails and dashboard.
1. Resend emails: enrolment confirmed, renewal received, payment failed, subscription cancelled, session cancelled or rescheduled. Plain, specific copy (no em dashes, no filler). Send from the webhook handlers and the notification table, never from the browser. Failures retry and never block the webhook response.
2. Dashboard for students: active subscriptions, upcoming sessions in the visitor's time zone with the school time zone alongside, join link button (via the Task 06 route), cancel subscription with a confirmation step.
3. Guardian accounts: a guardian can enrol and manage a linked student under 18.
4. Tests for email triggers and for the guardian permission boundaries.
```

### Task 08 onwards: Pages from the designs (one task per screen)

Use this template once per screen, in this order: Sign In, Sign Up, Reset, Home, Courses, Course Details, Course Page, About Us, then Contact and Community once they are designed.

```
Task 08-[screen]: build the [screen] page.
Source of truth: design/screens/[file].png (and design/ui-kit.png for components). Use only values from design/tokens.css and the type-style classes. Match layout, hierarchy and spacing exactly. Do not improve or restyle.
Use real data from the database where the page needs it (courses, teachers, sessions). Handle loading, empty and error states.
Assets: use only the SVGs I have placed in design/assets. If one is missing, stop and ask. No icon library. No stock images.
Responsive: desktop first from the design; tablet and mobile follow the same tokens and stack sensibly. Tell me the breakpoints you used.
Before writing code, list which of the 20 vibecoded signs in AGENTS.md Section 7 this page could accidentally hit, and how you will avoid them.
Auth pages: use Clerk's custom flows so the UI is ours, with Google sign-in, input adornments and states as designed. 
Done when: lint, typecheck, build pass and I can compare it side by side with the image. List any difference from the design.
```

### Task: Teacher view

```
Teacher view: signed-in teachers see their own courses, sessions and roster (names and emails of active students). They cannot see other teachers' courses or any payment data. No design exists: ask me before choosing a layout. Tests for the permission boundaries.
```

### Task: Hardening

```
Hardening pass. Rate limit sign-in-adjacent, enrolment and webhook routes. Add security headers and a content security policy. Confirm no secret or joinUrl leaks into client code or logs. Add error monitoring. Check accessibility (keyboard, focus, contrast, labels) on every page. Review every route for missing auth checks and list them. Fix only what you list; ask before anything larger.
```

### Task: Go live checklist (do by hand, with the agent only reviewing)

- Godfred's PayPal Business account is verified and can receive recurring payments.
- Cancellation, refund, grace-period, missed-session and late-enrolment policies are written and shown on course pages.
- Live PayPal keys and webhook created, tested with a small real payment, then refunded.
- Production database, backups on, environment variables set on the host, domain and HTTPS working.
- Clerk production instance with Google configured for the real domain.
- Resend domain verified (SPF, DKIM).
- Zoom account ready, audio setup guide handed to teachers.
- Real social links, contact details and photos supplied by the client.

## 7. Rules of thumb

- Smaller tasks beat clever prompts. If a task needs more than about 10 files, split it.
- Build the risky parts (payments, access, seat capacity) before the pretty parts.
- Never let the agent decide scope, stack or design. It proposes, you decide.
- Paste the payment and access diffs to Claude for review before committing them.