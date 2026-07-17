# Future Flow Priority Map

## Purpose

This document turns the audit, state models, sitemap, and component inventory into a practical execution map for redesign.

## Priority Sequence

### Flow 1: Auth and Onboarding

Why first:

- Every protected journey depends on correct account state.
- Current website trust is weakened by mixed anonymous and signed-in navigation.

Required inputs already available:

- `docs/flow-maps/current-auth-onboarding-flow.md`
- `docs/state-models/auth-onboarding-state-model.md`
- `docs/06-cross-flow-design-rules.md`
- `docs/09-component-inventory-mapped-to-flows.md`

Pages to design:

- Login
- Register
- Register success
- Verification pending if required
- Forgot password
- Profile completion

Primary components:

- Global header with public/auth variants
- Page header
- Form field
- Form section
- CTA bar
- Status panel
- Success panel

Output target:

- One complete auth/onboarding redesign flow

### Flow 2: Registration to Finance Entry

Why second:

- This is where academic intent becomes a transactional commitment.
- Current website mixes registration review, finance, and history too early.

Required inputs:

- `docs/flow-maps/current-finance-payment-flow.md`
- `docs/state-models/payment-state-model.md`
- `docs/08-future-sitemap-v1.md`

Pages to design:

- Registration review
- Registration confirmation
- Route into finance dashboard

Primary components:

- Item list row
- Summary card
- CTA bar
- Status badge
- Confirmation panel

Output target:

- Clear bridge between enrollment and payment

### Flow 3: Finance and Payment

Why third:

- Highest trust-sensitive journey.
- Benefits directly from payment states already being defined.

Required inputs:

- `docs/state-models/payment-state-model.md`
- `docs/09-component-inventory-mapped-to-flows.md`
- `docs/06-cross-flow-design-rules.md`

Pages to design:

- Finance dashboard
- Payment instructions
- Payment proof submission
- Payment status
- Receipts and invoices archive

Primary components:

- Outstanding balance summary
- Status panel
- File upload
- Timeline/progress stepper
- Transaction table
- Action menu

Output target:

- One complete state-driven finance/payment journey

### Flow 4: Credit Transfer

Why fourth:

- Complex, but now substantially de-risked by the state model.

Required inputs:

- `docs/state-models/credit-transfer-state-model.md`
- `docs/09-component-inventory-mapped-to-flows.md`
- `docs/08-future-sitemap-v1.md`

Pages to design:

- Credit transfer hub
- Transfer request flow
- Review screen
- Submission confirmation
- Status/history

Primary components:

- Transfer type cards
- Stepper
- Form sections
- Evidence checklist
- File upload
- Status timeline

Output target:

- Guided transfer journey that replaces the current flat page

### Flow 5: Learning and Registration

Why fifth:

- Should reflect the logic already established in auth and finance.

Required inputs:

- `docs/08-future-sitemap-v1.md`
- `docs/09-component-inventory-mapped-to-flows.md`

Pages to design:

- My registrations
- Learning goals
- Academic progress

Output target:

- Clear distinction between planning, active enrollment, and historical progress

### Flow 6: Public Discovery

Why sixth:

- Public IA and messaging will be stronger once member and transactional logic are stable.

Required inputs:

- `docs/08-future-sitemap-v1.md`
- `docs/09-component-inventory-mapped-to-flows.md`
- audit findings on trust and content integrity

Pages to design:

- Home
- Programs
- Program detail
- Subjects
- Subject detail
- Help center
- About
- News

Output target:

- Strong public story with clear conversion into register/login

## Readiness Checklist Before Designing A Flow

- Current flow documented
- Future-state model documented
- Target pages identified
- Required states listed
- Core components mapped
- Open questions isolated

## Recommended Immediate Next Step

Start high-fidelity redesign with `Auth and Onboarding`, then move directly into `Registration to Finance Entry`, then `Finance and Payment`.

