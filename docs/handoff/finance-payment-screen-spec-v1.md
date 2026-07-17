# Finance and Payment Screen Spec v1

## Purpose

This document defines the first-pass screen specification for the CREDIT BANK finance and payment redesign.

It is intended to support:

- UI design
- prototype creation
- future frontend implementation

## Screen Set

### 1. Registration Confirmation

Primary job:

- Confirm the user has registered successfully and explain whether payment is required next.

Required content:

- Registered item summary
- Total payable amount if any
- What happens next
- Go to finance CTA

Required states:

- Registration complete, payment required
- Registration complete, no payment required

Primary CTA:

- Go to finance

Secondary CTA:

- View my registrations

### 2. Finance Dashboard

Primary job:

- Show the member's current payment state and the next required action.

Required content:

- Outstanding balance summary
- Payable items list
- Payment state panel
- Next required action CTA
- Recent payment history preview
- Receipts/invoices entry point

Required states:

- No payable items
- Payment required
- Pending verification
- Payment confirmed
- Payment rejected
- Payment cancelled
- Payment refunded

Primary CTA:

- Varies by payment state

Examples:

- View payment instructions
- Submit payment proof
- View payment status
- Download receipt

Notes:

- Do not mix editable profile data into this screen.
- History should support the task, not dominate it.

### 3. Payment Instructions

Primary job:

- Explain exactly how to complete payment.

Required content:

- Payment amount
- Payment method
- Bank/account details
- Reference/instruction notes
- Required proof checklist
- Continue to proof submission CTA

Required states:

- Default
- Payment method unavailable if applicable

Primary CTA:

- Submit payment proof

Secondary CTA:

- Back to finance

### 4. Payment Proof Submission

Primary job:

- Collect required payment proof and related details.

Required content:

- File upload
- Amount paid
- Payment date/time if required
- Additional note if required
- Validation guidance
- Submit CTA

Required states:

- Default
- Missing required fields
- Invalid upload
- Upload success
- Upload failure
- Submission loading
- Draft in progress if supported

Primary CTA:

- Submit proof

Secondary CTA:

- Back to finance

### 5. Proof Submitted

Primary job:

- Confirm the proof was submitted successfully before review begins.

Required content:

- Success confirmation
- Submitted details summary
- What happens next
- View status CTA

Required states:

- Default confirmation

Primary CTA:

- View payment status

Secondary CTA:

- Return to finance

### 6. Pending Verification

Primary job:

- Reassure the member that payment proof is under review and avoid duplicate submission.

Required content:

- Pending status panel
- Read-only submitted proof summary
- Expected next-step guidance
- Support path if needed

Required states:

- Default pending
- Delayed review support state if needed

Primary CTA:

- Return to finance

Secondary CTA:

- Contact support

### 7. Payment Confirmed

Primary job:

- Confirm payment completion and unlock documents.

Required content:

- Confirmed status
- Paid amount
- Confirmation date
- Related item summary
- Receipt/invoice actions

Required states:

- Confirmed with documents available
- Confirmed with documents pending if applicable

Primary CTA:

- Download receipt

Secondary CTAs:

- Download invoice
- Return to registrations

### 8. Payment Rejected

Primary job:

- Explain the rejection and route the member into correction without panic or ambiguity.

Required content:

- Rejected status
- Rejection reason
- Correction guidance
- Previous submission summary
- Resubmit CTA

Required states:

- Default rejection
- Rejection with support recommendation

Primary CTA:

- Submit corrected proof

Secondary CTA:

- Contact support

### 9. Receipts and Invoices Archive

Primary job:

- Provide structured access to financial documents and transaction records.

Required content:

- Transaction list
- Receipt list
- Invoice list
- Download/view actions

Required states:

- Empty
- Documents available
- Download failure if applicable

Primary CTA:

- View/download document

## Shared Content Rules

- Use plain-language payment labels.
- Always explain the next action in transactional states.
- Avoid generic success messages with no directional follow-up.
- Keep payment-related wording specific to CREDIT BANK and the actual business process.

## Shared UI Rules

- One primary CTA per screen.
- Status should be visually dominant on every transactional screen.
- Receipts and invoices should be secondary until payment is confirmed or relevant.
- Do not merge payment history and active payment action into one undifferentiated block.

## Gating Rules

- `payment-required` should unlock payment instructions and proof submission.
- `pending-verification` should lock duplicate action unless resubmission is explicitly needed.
- `payment-confirmed` should unlock receipts and invoices according to business rules.
- `payment-rejected` should route directly to correction.

## Next Use

Use this spec to create:

- low-fidelity finance/payment wireframes
- high-fidelity finance/payment screens
- prototype links for stakeholder review

