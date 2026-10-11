# Music Corner Music School: Project Context

Read this file fully before every task. If a request conflicts with this file, stop and ask. Do not silently choose.

## 1. What we are building

A website and enrolment platform for Music Corner Musical School. Students (mostly international) subscribe to live group music courses with a recurring monthly payment, then join scheduled live sessions on Zoom.

This workspace contains ONLY this project. Ignore and never touch any other project (for example `church-gallery`). Never copy patterns, files or code from other projects.

## 2. Scope (matches the signed proposal)

In scope:
- Five public pages: Home, About Us, View Courses, Community (static page presenting school activities, content supplied by the client), Contact (details and enquiry form)
- Course detail and enrolment screens
- Sign in, sign up, password reset, with email and password plus "Continue with Google" (both handled by Clerk, never custom code). Follow Google's sign-in button branding rules
- Recurring monthly PayPal subscription, one per course enrolment, USD only
- Student dashboard: active subscriptions, upcoming sessions, join links, cancel subscription
- Guardian accounts for students under 18
- Teacher login: view own courses and rosters
- Admin: manage courses, teachers, schedules, capacity, enrolment and subscription records, cancel or reschedule a session and notify students
- Transactional emails: confirmation, renewal, failed payment, cancellation, session cancelled or rescheduled
- Responsive layouts: desktop, tablet, mobile

Out of scope. Do not build, scaffold, stub or suggest:
- Online shop or merchandise
- Forum, chat, messaging or any social-network features (the Community page is a static content page only)
- Private or 1:1 lessons
- Recordings, replays, recorded courses, assessments, certificates
- Custom video conferencing (Zoom links are pasted by an admin)
- Payment providers other than PayPal, installment plans, prepaid plans, coupons, discounts
- Tax, VAT or invoicing compliance
- CRM integrations, workflow automation

If a task seems to need something out of scope, stop and tell the user.

## 3. Pages to build from the designs

Designs live in `/design`. One screen per task. Build from the matching image only.

- Home, Courses, Course Details, Course Page, About Us
- Sign In, Sign Up, Reset
- UI Kit image is the reference for buttons, inputs, cards

Not designed yet (do NOT invent a layout; ask the user): Community, Contact, checkout or enrolment confirmation, student dashboard, teacher view, admin screens, mobile layouts. If a task needs one of these, stop and ask.

## 4. Stack (decided, do not change without approval)

- Next.js (App Router) with TypeScript, strict mode
- Tailwind CSS configured to use the design tokens. No shadcn/ui, no component library
- PostgreSQL with Prisma
- Auth: Clerk (managed). Never write custom password handling
- Payments: PayPal Subscriptions via the REST API and webhooks. Sandbox only until the user says otherwise
- Email: Resend
- Fonts: Manrope (headings) and Inter (body, labels) via `next/font`, self-hosted
- Tests: Vitest
- Validation: Zod on every API input and on environment variables

Do not add any dependency without asking first. State the package, why, and the alternative.

## 5. Data model (starting point)

All timestamps stored in UTC. All money stored as integer cents. Currency is always USD.

- User: id, authId, role (STUDENT, GUARDIAN, TEACHER, ADMIN), name, email, timezone
- GuardianLink: guardianUserId, studentUserId
- Course: id, slug, title, description, instrument, level, teacherId, priceCents, capacity, startDate, status (DRAFT, PUBLISHED, ARCHIVED), paypalPlanId
- Module: id, courseId, position, title, summary
- Session: id, courseId, moduleId (optional), startsAt (UTC), durationMinutes, joinUrl, status (SCHEDULED, CANCELLED, RESCHEDULED)
- Subscription: id, payerUserId, studentUserId, courseId, paypalSubscriptionId (unique), status, currentPeriodEnd, cancelAtPeriodEnd
- SeatHold: id, courseId, userId, expiresAt
- WebhookEvent: id, paypalEventId (unique), type, payload, processedAt

Seat belongs to the course, not to individual sessions.

## 6. Non-negotiable engineering rules

Payments and access:
1. Enrolment and access change ONLY from verified PayPal webhooks, never from the browser returning from PayPal.
2. Verify every webhook signature using PayPal's verification API before doing anything.
3. Webhook handling must be idempotent. Store `paypalEventId` with a unique constraint. A repeated or out-of-order event must not double-enrol, double-email or break state.
4. Seat capacity checks and seat holds run inside a database transaction. A hold lasts 10 minutes. Two people paying for the last seat must never both succeed.
5. A join link is returned by the server only after checking the caller has an active subscription (or cancelled but still inside the paid period) for that course. Never put join links in page source, client bundles or public APIs.
6. Every API route and server action checks authentication and authorisation itself. Never rely on hidden buttons.

Security:
7. Secrets only in environment variables. Never commit `.env`. Maintain `.env.example` with names only.
8. Validate all input with Zod. Parameterised queries only.
9. Rate limit auth-adjacent and payment-adjacent routes.
10. Never log tokens, card data, or full webhook payloads containing personal data.
11. Students under 18 are managed through a guardian account. Collect only the data we need.

Quality:
12. Money, access control, seat capacity and webhook idempotency each need tests before the feature is considered done.
13. No `any`. No ignored TypeScript or lint errors. No `console.log` left in committed code.
14. Handle loading, empty, error and timeout states on every screen and API call.
15. Display session times in the visitor's local time zone, with the school's time zone shown alongside.

## 7. Design rules

Source of truth: the images in `/design` and `src/styles/tokens.css`.

- Use ONLY values from `tokens.css`. Never invent colours, font sizes, spacing or radii.
- If a value is missing or marked TODO in `tokens.css`, stop and ask. Do not guess.
- `--color-accent-decorative` is decoration only. Never use it for text, buttons or any element that carries meaning.
- Headings use Manrope. Body and labels use Inter. No third font. Do not use Inter for headings.
- Match the design images closely: layout, hierarchy, spacing rhythm. Do not "improve" the design.
- Images and photos come from the design or the client. Never use stock placeholders or generated art without asking.

### 20 signs an app looks "vibecoded". Avoid all of them.

1. Purple-to-blue gradient
2. Gradient hero text
3. Emojis in headings
4. Inter font everywhere
5. Colored border cards
6. Glassmorphism cards
7. Low-contrast dark mode
8. Three icon boxes in a row
9. Badge above the headline
10. Lucide icons everywhere
11. Untouched shadcn UI
12. Fade-in on scroll
13. Cursor-following beam
14. Buttons that only fade on hover
15. Inconsistent spacing
16. Em dashes everywhere
17. Generic buzzword copy
18. Serif italic accents
19. Space Grotesk plus Instrument Serif
20. Confetti animation on trivial button clicks

Copy rules: plain, specific language about music lessons. No em dashes in UI copy. No filler such as "unlock your potential" or "seamless experience". Only add icons the design shows.

## 8. Way of working

- One small task per session. Before writing code, output a short plan: files to create or change, and anything unclear. Then STOP and wait for approval.
- Change only the files the task names. If another file needs changing, ask.
- Run lint, type check and tests before reporting done. Report the real output.
- Never claim something works unless you ran it. Say what you could not verify.
- Do not refactor, rename or reorganise code unrelated to the task.
- Do not use production credentials. PayPal sandbox only.
- Commit messages: short, imperative, one concern per commit. Do not commit unless asked.
- If you hit an error, report it exactly and stop. Do not try workarounds that change scope, stack or security.

## 9. Build order

1. Scaffold: project, tokens, fonts, tooling, README
2. Database schema and auth (roles, guardian link)
3. Courses, modules and sessions: admin CRUD
4. PayPal subscription in sandbox: create plan, subscribe, webhooks, idempotency, seat holds
5. Access control: join links gated by subscription
6. Student dashboard, cancel flow, emails
7. Public pages from the designs
8. Teacher view and admin polish
9. Hardening: rate limits, error states, logging, accessibility, test pass

Do not start a later step until the earlier one is reviewed and committed.

## 10. Open items (ask the user, do not decide)

- Cancellation, refund and failed-payment grace-period rules
- Missed-session, late-enrolment and minimum-enrolment policies
- Hosting target and domain
- Designs still missing (Section 3)