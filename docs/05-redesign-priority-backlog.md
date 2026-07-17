# Redesign Priority Backlog

## Purpose

This backlog turns the current audit into an execution order for redesign work.

## Priority Order

### Priority 1: Define State Models Before UI

Why first:

- Several critical flows are unclear because states are undefined, not just because screens are old.

Required definitions:

- Authentication state
- Profile completeness state
- Registration state
- Payment state
- Credit transfer state

Expected output:

- One state model note per critical flow

### Priority 2: Redesign Authentication and Onboarding

Why second:

- Every later member flow depends on clear account entry and trusted user state.

Scope:

- Login
- Register
- Register success / next step
- Profile completion
- Password recovery/change

Expected output:

- One complete auth journey
- Required validation and success states

### Priority 3: Redesign Finance and Payment

Why third:

- Highest trust-sensitive transactional flow.
- Strongest current overlap and confusion.

Scope:

- Registration confirmation
- Finance dashboard
- Payment instruction
- Payment proof submission
- Payment verification states
- Receipts and invoices

Expected output:

- One complete finance/payment journey
- Clear state-driven screens

### Priority 4: Redesign Learning and Registration

Why fourth:

- Needs to connect clearly with discovery, profile, and finance.

Scope:

- Learning objectives
- Subject/program registration
- Enrolled items view
- Learning summary

Expected output:

- Clear distinction between planning, enrolling, and tracking progress

### Priority 5: Redesign Credit Transfer

Why fifth:

- Complex flow with many fields and status needs, but not every user will use it first.

Scope:

- Transfer type selection
- Transfer in
- Transfer out
- Evidence upload
- Review and submit
- History and status tracking

Expected output:

- Guided, step-based transfer flow

### Priority 6: Redesign Public Discovery

Why sixth:

- Important for trust and acquisition, but should reflect the logic of the member journeys.

Scope:

- Home
- Program list/detail
- Subject list/detail
- About
- Manual
- News

Expected output:

- Clear public information architecture
- Strong conversion path into register/login

## Suggested Immediate Next Deliverables

1. State models for auth, payment, and credit transfer
2. Future sitemap v1
3. Future flow priority map
4. Component inventory mapped to flows

## Working Rule

Do not start high-fidelity visual design for a priority flow until:

- current flow is documented
- future flow is defined
- states are listed
- component needs are listed

