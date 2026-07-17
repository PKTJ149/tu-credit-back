# Payment State Model

## Purpose

Define the future-state payment lifecycle for the CREDIT BANK finance and payment journey before screen redesign starts.

This state model translates the current audit into a usable behavioral model for:

- registration-linked payable items
- finance dashboard status handling
- payment instruction and payment notice submission
- verification outcomes
- receipts and invoices

## Actors

- Primary actor: CREDIT BANK member
- Secondary actor: finance/admin staff reviewer
- System actor: CREDIT BANK web platform

## Scope

This document covers:

- the member-visible payment states after a payable item exists
- state transitions caused by member action, system processing, or staff review
- recommended user-facing labels for the redesigned UI
- required screens and UI states for finance and payment

This document does not yet define:

- detailed subject/program registration logic before a payable item is created
- staff-side back-office screens
- refund policy rules and accounting rules in full detail

## Source Inputs

This model is based on the current repo audit documents, especially:

- `docs/04-ux-ui-audit-findings.md`
- `docs/05-redesign-priority-backlog.md`
- `docs/flow-maps/current-finance-payment-flow.md`

## Working Assumptions

- Registration creates one or more payable items.
- Manual bank transfer is the currently visible payment path.
- Payment notice submission is followed by manual staff verification.
- Receipt and invoice access should be tied to explicit states instead of always-visible generic actions.
- A member may eventually have multiple payable items with different statuses, even if the first redesign release simplifies the presentation.

## States

| State | Description | Entry Condition | Exit Condition | User-Facing Label |
|---|---|---|---|---|
| `no-payable-items` | Member has no active payable item. | No current dues exist, or all dues are settled/cancelled. | New payable item is created from registration or admin action. | No Payment Due |
| `payment-required` | Member owes money and has not submitted valid proof yet. | Registration or admin process creates a payable item. | Member starts notice draft, submits proof, or item is cancelled. | Payment Required |
| `notice-draft` | Member started payment notice but has not submitted it. | Member enters payment notice flow and saves or preserves progress. | Member submits, discards, or expires draft. | Payment Notice In Progress |
| `notice-submitted` | Member successfully submitted payment notice and evidence. | Member submits complete notice form. | System queues submission for review or rejects immediately for invalid submission. | Payment Notice Submitted |
| `pending-verification` | Submission is under staff review. | Submitted notice enters verification queue. | Staff confirms payment or rejects submission. | Awaiting Verification |
| `payment-confirmed` | Payment is verified and matched to the payable item. | Staff approves or system confirms payment. | Later refund or reversal, if supported. | Payment Confirmed |
| `payment-rejected` | Submission is rejected and needs correction. | Staff or system rejects submitted notice. | Member starts correction or submits corrected notice. | Action Required |
| `payment-cancelled` | Original payable item no longer requires payment. | Registration/payable item is cancelled or withdrawn. | New payable item is created later. | Payment Cancelled |
| `payment-refunded` | Previously confirmed payment was refunded or reversed. | Refund/reversal is completed after confirmation. | No further transition in current model. | Refunded |

## Lifecycle Overview

Primary success path:

```text
no-payable-items
  -> payment-required
  -> notice-draft
  -> notice-submitted
  -> pending-verification
  -> payment-confirmed
```

Alternative and recovery paths:

```text
payment-required -> notice-submitted
payment-required -> payment-cancelled
notice-draft -> payment-required
notice-submitted -> payment-rejected
pending-verification -> payment-rejected
pending-verification -> payment-confirmed
payment-rejected -> notice-draft
payment-rejected -> notice-submitted
payment-confirmed -> payment-refunded
```

## Transitions

| From | Trigger | To | Notes |
|---|---|---|---|
| `no-payable-items` | Registration creates payable item | `payment-required` | Registration and payment are linked, per current audit. |
| `payment-required` | Member starts payment notice | `notice-draft` | Use only if draft-saving exists in the redesigned flow. |
| `payment-required` | Member submits notice in one session | `notice-submitted` | Draft state can be skipped. |
| `payment-required` | Admin or system cancels payable item | `payment-cancelled` | Needs business rule confirmation. |
| `notice-draft` | Member submits complete notice | `notice-submitted` | Validation must pass first. |
| `notice-draft` | Member discards or abandons draft | `payment-required` | Outstanding amount remains unpaid. |
| `notice-submitted` | System accepts submission for review | `pending-verification` | Usually immediate after successful submission. |
| `notice-submitted` | System/staff detects invalid submission quickly | `payment-rejected` | Example: unreadable slip or missing required fields. |
| `pending-verification` | Staff confirms payment | `payment-confirmed` | Should record verification timestamp and actor. |
| `pending-verification` | Staff rejects payment | `payment-rejected` | Rejection reason must be stored and shown. |
| `payment-rejected` | Member begins correction | `notice-draft` | Prefer carrying forward previous values. |
| `payment-rejected` | Member resubmits directly | `notice-submitted` | Useful when no draft mechanism exists. |
| `payment-confirmed` | Finance/admin issues refund | `payment-refunded` | Optional for first release. |

## State Detail

### `no-payable-items`

Member expectation:

- Confirm there is nothing to pay right now.

Must show:

- empty finance summary
- context for current term or latest registration
- link to registration or enrolled items if relevant

Primary actions:

- View registration summary
- View transaction history
- Return to learning/registration

### `payment-required`

Member expectation:

- Understand exactly what is owed and what to do next.

Must show:

- total outstanding amount
- itemized payable items
- due date if applicable
- payment method/instructions
- strong primary CTA to submit payment notice
- invoice availability if business rules allow it before payment

Primary actions:

- View payment instruction
- Start payment notice
- Download invoice if available

### `notice-draft`

Member expectation:

- Continue a partially completed payment notice without losing work.

Must show:

- draft status
- missing required fields
- saved progress message if draft save exists
- clear continue, discard, and submit actions

Primary actions:

- Continue editing
- Upload or replace proof
- Submit notice
- Discard draft

### `notice-submitted`

Member expectation:

- Know that the notice was received successfully.

Must show:

- confirmation message
- submitted amount
- submitted timestamp
- submitted evidence preview or filename
- what happens next

Primary actions:

- View submitted notice
- Return to finance dashboard

### `pending-verification`

Member expectation:

- Track review progress without resubmitting unnecessarily.

Must show:

- pending status
- instruction not to submit duplicate proof
- expected review message or SLA if available
- support contact if review is delayed

Primary actions:

- View submitted details
- View payable item details
- Contact support

### `payment-confirmed`

Member expectation:

- Confirm payment success and access official records.

Must show:

- confirmed status
- paid amount
- confirmation date
- related registration/enrollment context
- receipt and invoice actions if supported

Primary actions:

- Download receipt
- Download invoice
- View transaction history
- Return to enrolled items or learning record

### `payment-rejected`

Member expectation:

- Understand what went wrong and how to fix it.

Must show:

- action-required status
- rejection reason
- correction guidance
- resubmission CTA

Primary actions:

- Edit and resubmit
- Replace/upload corrected proof
- Contact support

### `payment-cancelled`

Member expectation:

- Understand why payment is no longer needed and what this means for registration.

Must show:

- cancelled status
- cancellation reason
- next-step guidance

Primary actions:

- View details
- Return to registration
- Contact support

### `payment-refunded`

Member expectation:

- Understand that a prior confirmed payment was reversed.

Must show:

- refunded status
- original payment reference
- refund amount
- refund date
- impact on registration or entitlement if any

Primary actions:

- View refund detail
- Contact support

## User-Facing Labels and Status Treatment

| State | Recommended Label | Tone | UI Guidance |
|---|---|---|---|
| `no-payable-items` | No Payment Due | Neutral | Use calm empty-state presentation. |
| `payment-required` | Payment Required | Urgent but clear | Strong CTA and amount emphasis. |
| `notice-draft` | Payment Notice In Progress | Supportive | Show incomplete progress and what is missing. |
| `notice-submitted` | Payment Notice Submitted | Positive confirmation | Confirmation banner plus next-step explanation. |
| `pending-verification` | Awaiting Verification | Calm waiting | Emphasize that duplicate submission is unnecessary. |
| `payment-confirmed` | Payment Confirmed | Positive | Elevate success and document access. |
| `payment-rejected` | Action Required | Corrective | Explain rejection plainly and preserve recovery path. |
| `payment-cancelled` | Payment Cancelled | Neutral warning | Explain consequence, not just status. |
| `payment-refunded` | Refunded | Administrative | Tie to original transaction. |

## Required UI Implications

- Finance dashboard must be state-driven, not a mixed profile/finance/academic page.
- Registration confirmation and finance should be separate views with different primary jobs.
- The strongest UI element on finance screens must reflect the next required action.
- Receipt and invoice actions should appear only when the current state allows them.
- Payment notice should not live on a page named like a final success page.
- Rejected submissions should preserve prior user input where possible.
- Mixed-status members need a list model that can show different payable items with different states without collapsing everything into one ambiguous total.

## Required Screens or Views

- Registration confirmation
- Finance dashboard
- Payment instruction view
- Payment notice form
- Payment notice success confirmation
- Pending verification status view
- Rejected payment correction view
- Confirmed payment history/documents view
- Empty finance state

## Required Screen States

- No payable items
- One unpaid item
- Multiple unpaid items
- Draft in progress
- Submission validation error
- Submission success
- Pending verification
- Rejected with explicit reason
- Confirmed with documents available
- Mixed transaction history
- Document unavailable

## Required Data Per Payable Item

- registration or enrollment reference
- program/subject name
- payable item type
- amount due
- amount paid
- currency
- current payment state
- due date if applicable
- submitted proof timestamp
- verification timestamp
- reviewer/review source if needed
- rejection reason if rejected
- receipt availability
- invoice availability

## Edge Cases

- Member has multiple payable items with different states at the same time.
- Member submits duplicate payment notice for the same payable item.
- Staff rejects payment because amount does not match expected amount.
- Staff rejects payment because slip is unreadable or wrong account is used.
- Payment is confirmed after the user already attempted resubmission.
- Payable item disappears because registration is cancelled.
- Receipt is unavailable even though payment is confirmed because document generation failed or is delayed.
- Draft support does not exist in implementation; if so, `notice-draft` becomes a transient UX state instead of a persisted state.

## Open Questions

- Is manual bank transfer the only supported payment path in the current or intended product?
- Does the platform truly support saved drafts, or should `notice-draft` be removed from the first redesign release?
- What exact fields are required for payment notice:
  - transfer date
  - transfer time
  - amount
  - payer name
  - bank name
  - reference number
  - uploaded slip
- What is the real verification workflow after notice submission: admin panel, email, spreadsheet, or another manual process?
- Can one registration generate multiple payable rows with different due dates or statuses?
- When exactly do invoice and receipt become available?
- Should cancellation and refund states be shown to members in v1, or handled only internally?
- Does registration become fully active before payment confirmation, or only after payment is confirmed?

## Recommended Follow-Up

- Draft `auth-onboarding-state-model.md`
- Draft `credit-transfer-state-model.md`
- Convert this state model into a future finance/payment journey map
- Build finance/payment component inventory from these states
