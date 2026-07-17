# Finance and Payment Design Brief v1

## Purpose

This brief translates the finance/payment flow and screen spec into a design-ready brief for the next UI design pass after Auth and Onboarding.

It is intended for:

- product design
- UI design
- agency handoff
- prototype creation

## Scope

This brief covers:

- Registration Confirmation
- Finance Dashboard
- Payment Instructions
- Payment Proof Submission
- Proof Submitted
- Pending Verification
- Payment Confirmed
- Payment Rejected
- Receipts and Invoices Archive

This brief does not yet cover:

- internal finance/staff review tools
- accounting policy workflows
- refund administration beyond user-facing status

## Primary Product Goals

1. Make the current payment state obvious at a glance.
2. Make the next required action unmistakable.
3. Separate active payment action from historical records.
4. Reduce duplicate proof submission and uncertainty during review.
5. Increase trust in the most sensitive transactional journey.

## UX Problems This Design Must Solve

- Current finance and registration responsibilities are mixed together.
- Payment lifecycle is not explicit.
- Page naming and purpose are inconsistent.
- History and documents compete with urgent actions.
- Users may not know whether payment is required, submitted, pending, confirmed, or rejected.

## Audience Mindset

Typical user concerns at this stage:

- Do I need to pay right now?
- How much do I owe?
- Where do I send payment?
- Did my proof go through?
- Am I supposed to wait or do something else?
- Where are my official documents?

The design should answer these immediately and calmly.

## Design Intent

The finance journey should feel:

- clear
- trustworthy
- controlled
- reassuring
- operationally simple

The experience should not feel:

- like a cluttered admin report
- ambiguous about status
- risky or hard to verify
- overloaded with secondary history

## Suggested Visual Direction

This is a provisional design direction, aligned with the auth flow but more transactional:

- Tone: institutional, precise, dependable
- Layout: action-first, summary-first, history-second
- Density: moderate to high, but well organized for scanning
- Trust signals: strong status visibility, confirmation states, clear supporting detail
- Interaction feel: stable, explicit, low ambiguity

## Content Priorities By Screen

### Registration Confirmation

Must emphasize:

- what was registered
- whether payment is required
- where to go next

### Finance Dashboard

Must emphasize:

- current state
- amount owed
- next action

Must de-emphasize:

- older historical data
- profile editing

### Payment Instructions

Must emphasize:

- how to pay
- amount
- what proof is required

### Payment Proof Submission

Must emphasize:

- required fields
- upload confidence
- what happens after submit

### Pending Verification

Must emphasize:

- do not resubmit
- your proof is under review
- what to expect next

### Payment Confirmed

Must emphasize:

- completion
- receipts/invoices now available

### Payment Rejected

Must emphasize:

- what went wrong
- how to fix it
- that recovery is possible

### Receipts and Invoices Archive

Must emphasize:

- structured document access
- relationship between documents and payment records

## Structural Recommendations

### Layout

- Use summary-first layout for Finance Dashboard.
- Keep active action surfaces above history surfaces.
- Use dedicated task pages for Payment Instructions and Payment Proof Submission.

### Navigation

- This flow should live inside the authenticated/member shell.
- Navigation should keep the user oriented between `My Registrations`, `Finance`, and document/archive areas.

### Hierarchy

- One dominant status
- One dominant next action
- Supporting details below

## Component Priorities

Components that should be designed first:

1. Outstanding balance summary
2. Payment state panel
3. Payable item row/card
4. Payment instruction card
5. File upload pattern
6. Transaction status badge
7. Confirmation panel
8. Rejection guidance panel
9. Receipt/invoice archive row

## Responsive Priorities

- Finance dashboard must stay highly scannable on mobile.
- Proof submission should feel safe and simple on smaller screens.
- Status and CTA should remain visible without deep scrolling confusion.

## Success Criteria

The design pass is successful if:

- users can identify their payment state within seconds
- the next required action is obvious on every transactional screen
- pending/rejected states reduce uncertainty instead of increasing it
- receipts/invoices are easy to access when relevant, but do not distract from unresolved tasks
- the flow reads clearly without verbal explanation

## Open Questions

- Which fields are mandatory for proof submission besides file upload?
- Are invoices available before confirmation, after confirmation, or both?
- Can a user have multiple simultaneous payable items in v1?
- Is draft-saving required for payment proof submission?

