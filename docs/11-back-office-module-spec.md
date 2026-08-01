# Back Office System — Module Specification

## Context

`tu-credit-back` is a mock/demo student-facing site for a Thammasat University credit-bank platform (browse programs/subjects, register, submit payment proof). Everything today is hardcoded TypeScript data with **zero backend, zero auth, zero admin surface** — confirmed by direct code inspection:

- `lib/data/{programs,subjects,teachers}.ts` — real, well-structured entities with id-based cross-references and helper functions. Good foundation for CRUD.
- `lib/finance/payment-state.ts` + `lib/session/session-data.tsx` — a full payment/registration status lifecycle is *modeled* (`payment-required → pending-verification → payment-confirmed/rejected/refunded`, `awaiting-payment → active → completed/cancelled`) but only the happy path is wired. Rejection and refund have no trigger anywhere.
- `components/discovery/news-list/news-card/news-detail.tsx` — News is half-built: two different hardcoded data sources, detail page ignores the slug entirely (real bug, not just "no CMS yet").
- `home-banner.tsx`, `help-center.tsx` — pure hardcoded content, no data file, no type-level consistency.
- `lib/auth/auth-context.tsx` — accepts any string as login, no password, no role field, no session token, no server check. This does not extend to a staff back-office; it has to be built from scratch.

The initial ask covered 3 areas: **payment approval, news/activities, programs/subjects.** This document expands that into the complete module inventory needed for a professional back office — grounded in what the student site actually contains and requires to be administrable, not a generic admin-panel checklist.

### Additional grounding confirmed during audit

- **No backend infrastructure exists at all**: no `app/api/*` routes, no `middleware.ts`, no ORM/schema/migration files, no relevant packages in `package.json` (only `next`/`react`/`lucide-react`/Tailwind — nothing auth/db/email/upload-related). This back office is genuinely greenfield; there's no accidental half-built API to reconcile with.
- **The repo contains its own pre-build planning corpus** (`docs/00-10`, `PRODUCT.md`, `DESIGN.md` — written before the student site was implemented: state models, flow maps, and design briefs for auth, payment, and credit-transfer). These documents **explicitly and repeatedly scope "staff-side back-office screens" as future/out-of-scope work** at the time they were written (e.g. the payment state model's Scope section says so directly) — meaning this spec isn't inventing new obligations, it's completing work the team already flagged as owed.
- No TODO/FIXME markers exist in the codebase pointing at planned admin features — the gaps found are structural (missing screens/roles), not abandoned in-progress code.

---

## How modules are grouped

- 🟢 **Extends existing data** — Program/Subject/Teacher/Registration/Payment already have real types and mock data; back office CRUD sits directly on top.
- 🟡 **Exists as broken/placeholder** — News, Home Banner, Help Center have partial types but no real data layer; back office has to build the content model *and* the admin UI together.
- 🔴 **Doesn't exist at all** — the site has never needed this because there's no staff, no money reconciliation, no reporting. These are the modules a business/ops-minded back-office spec must add even though nothing on the student site "asked for" them — and they're usually what gets missed.

---

## A. Access Control & Staff Identity 🔴

The absolute prerequisite — nothing else in this back office is safe to build without it.

1. **Staff Authentication** — separate login from the student site; staff accounts are provisioned by a Super Admin, not self-registered.
2. **Role-Based Access Control** — **decided: three roles — Super Admin / Officer (เจ้าหน้าที่) / Teacher (อาจารย์).**
   - **Super Admin**: full access to every module below, plus the only role that can create staff accounts and assign roles. Also holds final authority on credit-transfer equivalency (see I.3).
   - **Officer (เจ้าหน้าที่)**: registrations + payment approval + credit-transfer review + student records; read-only on academic content.
   - **Teacher (อาจารย์)**: own assigned subjects/programs only — see roster, schedule, upload documents, enter grades; no pricing or financial access.
   - Officer is deliberately *not* split into Registrar and Finance. One operations role covers both; revisit only if the team grows enough that the same person shouldn't both register a student and approve their payment.
3. **Staff Account Management** — Super Admin creates/deactivates/resets staff accounts, assigns roles, and assigns a Teacher account to specific `teacherIds` so a real person logs in and sees *their* subjects.
4. **Permission matrix enforcement** — every module below needs its access level defined per role, not bolted on later.
5. **Audit Log** — every approve/reject/edit/delete action recorded with actor, timestamp, before/after. Not optional for a system that approves money and grades-adjacent academic records.

---

## B. Academic Content Management 🟢 + 🔴

1. **Program Management** — CRUD on all `Program` fields; publish/draft/archive workflow; assign `subjectIds` and `teacherIds`.
2. **Subject Management** — CRUD on all `Subject` fields; category assignment (หมวดวิชาแกน/เลือก/ทั่วไป); study mode (online/onsite/hybrid); pricing.
3. **Schedule Management** (sub-resource of Subject) — CRUD individual `ScheduleItem`s, advance session status (upcoming → ongoing → completed).
4. **Subject Documents Management** — upload/replace/remove downloadable files students see in the sidebar.
5. **Teacher/Instructor Management** — CRUD teacher profiles, assign to programs/subjects, workload view.
6. **Seats & Capacity Management** 🔴 — `seats`/`enrolledCount` exist as fields but nothing manages the relationship (auto-decrement, block at capacity, waitlist).
7. **Academic Term / Calendar Management** 🔴 — no concept of "the current term," registration open/close windows, or a shared academic calendar exists.

---

## C. Student & Registration Management 🟢 + 🔴

1. **Student Directory** — search/filter registered users, view registration/payment history in one place.
2. **Registration Management** — view all `LearnerRegistration` records; manual override actions (cancel, force-complete, move between subjects).
3. **Waitlist Management** 🔴 — depends on capacity management above.
4. **Bulk Export** 🔴 — registration lists to Excel/CSV for reporting up to the university registrar.

---

## D. Finance & Payment Management 🟢 + 🔴

1. **Payment Approval Queue** — officer reviews submitted slip/amount/date/note, approves or rejects.
2. **Rejection Reason & Re-submission Flow** 🔴 — `payment-rejected` state exists but nothing sets it or captures why.
3. **Refund Management** 🔴 — `payment-refunded` state exists in the type but has zero workflow.
4. **Receipt/Invoice Generation** 🔴 — currently a static mock; needs real generation on approval.
5. **Payment/Bank Account Settings** 🔴 — bank transfer instructions are hardcoded; admin needs to edit without a code change.
6. **Reconciliation & Revenue Reporting** 🔴 — no way today to answer "how much did we collect."
7. **Overdue/Pending Payment Tracking** 🔴 — `dueDate` exists but nothing flags overdue payments.

---

## E. Website Content Management 🟡

1. **News Management** — real CRUD + data layer, replacing two conflicting hardcoded sources; fix the slug-routing bug.
2. **Activities Management** 🔴 — no such content type exists today. **Decision needed:** distinct entity from News, or a News category?
3. **Home Banner Management** — CRUD the hero carousel slides.
4. **Help Center / FAQ Management** — categories exist with no real articles behind them.
5. **Media Library** 🔴 — every image is a static file in `/public`; needs upload/manage without a deploy.

---

## F. Reporting & Analytics 🔴

1. **Enrollment Reports** — by program, subject, term, faculty.
2. **Revenue Reports** — by program, term, payment status.
3. **Teacher Workload Reports** — subjects/programs per teacher.
4. **Operational Dashboard** — role-scoped landing view (pending approvals, capacity warnings, upcoming sessions).

---

## G. Communication 🔴

1. **Notification Triggers** — payment approved/rejected, registration confirmed, schedule changed, waitlist seat opened. Today `confirmPayment` is a silent client-side state flip.
2. **Announcement Broadcast** — admin/officer messages students in a specific program/subject.
3. **Notification Templates** — admin-editable wording, no code deploy required.

---

## H. System Administration 🔴

1. **Site Settings** — general config plus the **faculty/department list**, currently hardcoded to 5 Thai faculty names inside `register-form.tsx`.
2. **Terms & Consent Text Management** — the registration consent checkbox text should be editable without a deploy.

---

## I. Credit Transfer Management 🟢 — fully built both directions, zero approval UI

A complete, **bidirectional** student-facing flow already exists at `/profile/transfer/*` (12 routes, 15 components). A student picks a direction:
- **Transfer In** — bring credit earned elsewhere into TU.
- **Transfer Out** — send completed TU credit to another institution.

The full state machine down to `changes-requested` / `approved` / `rejected` / `withdrawn` is implemented on the student side. **There is no matching officer/admin side at all**, for either direction.

1. **Credit Transfer Approval Queue** — three possible outcomes, not two: `Approved`, `Rejected`, or **`Changes Requested`** (a middle state distinct from outright rejection, already modeled in `changes-requested.tsx`).
2. **Partner/Source & Destination Institution Management** — the partner university list is hardcoded; admin should manage it.
3. **Transfer Subject/Credit Mapping** — no admin surface exists for the core academic judgment call of how many TU credits an external subject counts for.
4. **Review SLA/Aging** — "3-5 business days" is copy text only; needs a real case queue with due dates.
5. **Withdrawal handling** — officer side needs visibility into withdrawn cases for audit purposes.

Cross-checked against the team's own pre-build planning docs (`docs/state-models/credit-transfer-state-model.md`, `docs/flow-maps/future-credit-transfer-flow.md`) — this gap was known and intentional at design time. Those documents define three staff touchpoints never built: **Intake Check**, **Academic/Policy Review**, and **Post-Decision Record Handling**.

---

## J. Academic Records, Grading & Certificates 🔴 — the actual point of a "credit bank"

1. **Grade Entry** — no UI exists for a teacher/officer to enter a grade when a subject finishes.
2. **GPA / Credit-Accumulation Engine** — the "หน่วยกิตสะสม" passbook concept is implemented client-side, but only recognizes 3 grade values (A/B+/B) against seed data.
3. **Certificate Issuance** — every "view certificate" link goes to `href="#"`. No template, generation, or issuance record exists.
4. **Transcript Export** — no PDF/transcript output exists anywhere.

---

## K. Site Chrome & Legal Content Management 🔴

1. **Centralized Navigation/Footer Management** — nav/footer content is hardcoded independently in three shell components and has already drifted apart.
2. **Legal Pages (Privacy Policy / Terms of Use) — do not exist at all.** Every reference is a dead `#privacy`/`#terms` anchor, including on the registration consent checkbox itself. Compliance gap, not a content nice-to-have.
3. **Contact/Support Info Management** — no phone/email/address/social link anywhere on the site.
4. **About Page Content** — hardcoded static copy, same pattern as Help Center.
5. **Cookie Consent** — the pre-rebuild legacy site had a cookie-consent banner; the current React rebuild has none — a regression.

---

## L. Homepage Curation & Emerging Content Types 🔴

1. **Featured/Recommended Program Curation** — hardcoded slug arrays drive the homepage carousels; needs a "featured" flag or ordering control.
2. **Job/Career Opportunities section** — out of scope for this back office (will connect to a separate external system).
3. **Homepage News Teasers vs. the real News entity** — a separate hardcoded array disconnected from the real News data store; needs to merge once News CMS exists.

---

## M. Data Integrity / Taxonomy Governance 🔴 — cross-cutting, not a standalone module

"Faculty" and "education level" are modeled three inconsistent ways across registration, three different profile-editing components, and the catalog data. Once Admin owns the canonical lists (extends H.1), every student-facing form must consume that single source. Left unresolved, this will silently corrupt the enrollment/demographic reports in Section F.

---

## N. Review & Rating System 🔴 — decided: build it for real

Both program and subject detail pages have a "Reviews & comments" tab rendering a permanent empty state — no submission form, rating, data model, or moderation exists. **Decided: build it out rather than remove the tab.** The homepage's "compare programs" banner claim is the same promise-without-delivery issue and is to be honoured too, not deleted.

What this decision obliges:

1. **Review data model** — rating + comment, tied to a `Registration`, so only students who actually took the subject can review it.
2. **Review Moderation queue** — Officer approves, hides, or removes a review before it goes public; spam and abuse handling.
3. **Review display & aggregation** — average rating on program/subject cards and detail pages, replacing the empty state.
4. **Program comparison feature** — the homepage banner promises it; needs a real compare view on the student side and nothing on the back office side beyond the data already covered by B.1/B.2.

---

## Decisions Made

### 1. Where the back office lives — `app/admin/` inside this repo

A new `app/admin/` route tree in `tu-credit-back`, **not** a separate project and not a monorepo.

Rationale, grounded in the current code:

- The back office administers the *same* entities the student site already defines in `lib/data/` (`Program`, `Subject`, `Teacher`, `Registration`, `Payment`). A separate project would have to duplicate those types and would drift.
- `app/layout.tsx` is already chrome-free — it renders only `<html>/<body>`, fonts, and providers, with no site header or footer. So `app/admin/` can own its own `layout.tsx` and get an entirely different shell **without moving any of the 80 existing routes** into a `(site)` route group.
- Next.js splits bundles per route, so admin code is never shipped to student pages.
- A single `middleware.ts` gates `/admin/*` in one place.
- One Vercel project, one deploy, one set of environment variables.

**Constraint that keeps the exit door open:** code under `app/admin/` must not import from the student-side `components/` tree. Anything genuinely shared goes through `lib/`. If the back office ever has to be split into its own deployment, that discipline is what makes the split mechanical instead of a rewrite.

**Provider note:** `AuthProvider` and `SessionDataProvider` in the root layout model a *student* session. Staff identity is a separate context mounted inside `app/admin/layout.tsx`; the two must not be conflated.

### 2. Roles — Super Admin / Officer (เจ้าหน้าที่) / Teacher (อาจารย์)

Three roles, detailed in Section A.2. Officer is not split into Registrar and Finance.

**Consequence for credit transfer:** with no separate academic-committee role, deciding how many TU credits an external subject is worth (I.3) sits with **Super Admin**, with Officer performing intake and completeness checks. If the university later requires a committee sign-off, that becomes a fourth role rather than a change to these three.

### 3. Scope — specify every module before building

The full A–N inventory is specified first; implementation follows the tiers below. No MVP-only cut.

*Trade-off accepted:* longer before anything is running, in exchange for not discovering a structural gap halfway through and rebuilding.

### 4. Reviews & ratings — build for real

See Section N. Adds a Review Moderation module to the Officer's workload.

---

## Open Questions

1. **"Activities" as its own module or a News category?** (Section E.2)
2. **Data persistence** — the whole site is hardcoded TypeScript today. A back office that writes data needs a real store. Which one, and does the student site migrate to read from it at the same time or later?

## Suggested Priority

**Tier 1 — nothing works without these:** Auth & Roles (A), Program/Subject/Teacher CRUD (B.1-B.5), Payment Approval Queue (D.1), Credit Transfer Approval Queue (I.1), Legal Pages / Privacy & Terms (K.2).

**Tier 2 — closes real gaps in the modeled-but-unwired lifecycle:** Rejection/Refund flows (D.2-D.3), Seats/Capacity (B.6), Registration Management (C.2), Audit Log (A.5), Credit Transfer subject/credit mapping (I.3), Data Integrity/Taxonomy Governance (M).

**Tier 3 — operational maturity:** Reports/Dashboard (F), News/Activities/Banner/Help Center (E), Notifications (G), Term/Calendar (B.7), Grade Entry & GPA Engine (J.1-J.2), Site Chrome centralization (K.1), Homepage Curation (L.1).

**Tier 4 — polish/scale:** Media Library, Bulk Export, System Settings (H), Certificate Issuance & Transcript Export (J.3-J.4), Review & Rating system incl. Review Moderation (N).
