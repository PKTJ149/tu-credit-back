# Current Finance and Payment Flow

## Flow Goal

Help a member understand what they registered for, what they owe, what they already paid, and what they need to do next.

## Current Pages

| Step | Page | URL | User Action | System Response |
|---|---|---|---|---|
| 1 | Registration | `/registration.html` | Review current term subjects and learning summary | Shows personal info, finance, grades, and history together |
| 2 | Finance | `/finance.html` | Review financial data, receipts, invoices, and payment status | Shows mixed profile/registration/finance content |
| 3 | Registration Success / Payment Notice | `/checkout-subject-success.html` | Review bank account details and submit transfer notice | Acts as both success page and payment instruction page |

## Observed Current Structure

### Registration Page

Main sections:

- Personal information
- Subjects registered this term
- Financial information
- Payment history
- Learning/grade summary

Observed table themes:

- Subject code / subject name / credits / payment status
- Payment history with date, item, amount, and status
- Grade summary across academic years

Observed statuses:

- `กำลังเรียน`
- `จบแล้ว`

### Finance Page

Main sections:

- Personal information
- Subjects registered this term
- Financial information
- Outstanding amount
- Paid amount
- Total amount
- Program/subject breakdown
- Registered program list
- Payment history
- Full registration list

Observed document actions:

- Receipt
- Invoice

Observed table themes:

- Subject code / subject name / credits / payment status
- Subject / program / amount / status / action
- Full registration list with grade/term

### Checkout / Payment Notice Page

Main sections:

- Registration summary
- University bank account details
- Transfer payment notice

Observed primary action:

- Submit transfer notice

## Current Friction

### 1. Registration and finance are not cleanly separated

- Registration page already contains finance data.
- Finance page still contains editable personal/profile information and academic record data.

### 2. Payment lifecycle is not explicit

- The pages show payment history and transfer notice, but not a clear end-to-end state model.
- Users may not know whether they are:
  - registered
  - unpaid
  - awaiting payment confirmation
  - fully paid

### 3. Page naming is inconsistent

- Finance page title says Profile while H1 says Finance.
- Checkout page sounds like a final success page but still asks for payment notification.

### 4. Next action is not visually dominant enough

- Critical actions such as paying, uploading proof, or checking status should be the strongest signal on the page.
- Instead, the screens distribute attention across profile, courses, documents, and history at the same time.

### 5. Document actions are present without enough context

- Receipts and invoices appear as actions, but the user context for each document is not clear enough.

## Current-State Risk

| Severity | Risk | Why It Matters |
|---|---|---|
| Critical | Ambiguous payment state | Users may miss payment or submit duplicate proof. |
| High | Task mixing across registration and finance | Users may not understand what the page is for. |
| High | Misleading page naming | Trust and orientation suffer at the most sensitive transactional step. |
| High | Weak next-action clarity | Users can stall even when they have enough information on screen. |

## Recommended Future Flow

1. User completes registration selection.
2. System shows registration confirmation with explicit payment requirement.
3. User enters finance dashboard.
4. Finance dashboard emphasizes:
   - current outstanding balance
   - due items
   - due date if any
   - payment method/instruction
   - payment proof submission status
5. User submits payment proof.
6. System shows pending verification state.
7. System later shows confirmed or rejected payment result.
8. User can access receipts/invoices from a history section, not as the main primary action.

## Recommended Page Separation

### Registration

Purpose:

- Show selected or enrolled items.
- Confirm what the user is registering for.
- Route user into payment when needed.

### Finance Dashboard

Purpose:

- Show exactly what the user owes and the status of each payable item.
- Make the next required payment action clear.

### Payment Instruction / Proof Submission

Purpose:

- Give bank/account details or chosen payment method.
- Let the user submit proof cleanly.

### Payment History and Documents

Purpose:

- Show all transactions, statuses, receipts, and invoices in a structured archive.

## Required States For Redesign

- No payable items
- Registered but unpaid
- Payment proof not yet submitted
- Payment proof submitted
- Pending verification
- Payment confirmed
- Payment rejected
- Partial payment if applicable
- Refunded/cancelled if applicable

## Required Components

- Outstanding balance summary
- Payable item list
- Status badge
- Payment instruction card
- Payment proof upload form
- Verification timeline/status panel
- Transaction history table
- Receipt/invoice action menu
- Empty state for no transactions

## Open Questions

- What payment methods are actually supported?
- Is manual transfer the only current payment path?
- What fields are required when submitting transfer proof?
- Is payment verified by staff manually?
- Can one registration include multiple payable items with different statuses?

