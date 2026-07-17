# Finance and Payment Wireframe Blueprint v1

## Purpose

This document converts the finance/payment design brief and screen spec into low-fidelity structural blueprints.

It is intended to guide:

- wireframe creation
- early Figma layout
- screen composition reviews

## Wireframe Principles

- Status first
- Next action second
- History third
- One transactional job per screen
- Documents should support the flow, not dominate it

## 1. Registration Confirmation

### Desktop / Mobile Shared Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
|                                                              |
|            Confirmation / Next-Step Panel                    |
|            -----------------------------                     |
|            H1: Registration complete                         |
|            Registered item summary                           |
|            Payment required?                                 |
|            What happens next                                 |
|            [ Go to finance ]                                 |
|            View my registrations                             |
|                                                              |
+--------------------------------------------------------------+
```

### Layout Notes

- The payment implication should be visible without scrolling.
- Only one next-step CTA should dominate.

## 2. Finance Dashboard

### Desktop Structure

```text
+--------------------------------------------------------------+
| Member Shell: Dashboard | Registrations | Finance | ...      |
+--------------------------------------------------------------+
| H1: Finance                                                 |
| Short state summary                                          |
+--------------------------------------------------------------+
|  Balance / Status Row                                        |
|  [ Outstanding ] [ Current State ] [ Due Items ]             |
+--------------------------------------------------------------+
|  Main Action Panel                 |  Supporting History      |
|  ----------------------------      |  --------------------    |
|  Current state explanation         |  Recent transactions     |
|  What you need to do next          |  Latest documents        |
|  [ Primary CTA ]                   |  View all                |
|                                    |                          |
+--------------------------------------------------------------+
| Payable Items List / Table                                     |
| ------------------------------------------------------------ |
| Item | Amount | Status | Action                              |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Member Shell                  |
+-------------------------------+
| H1: Finance                   |
| Short state summary           |
| [Outstanding summary]         |
| [State panel]                 |
| [ Primary CTA ]               |
|                               |
| Payable items                 |
| [Item row]                    |
| [Item row]                    |
|                               |
| Recent transactions           |
| [History preview]             |
+-------------------------------+
```

### Layout Notes

- The current payment state and CTA must appear above history.
- Profile-editing fields must not appear on this page.

## 3. Payment Instructions

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Payment instructions                                     |
| Short explanation                                            |
+--------------------------------------------------------------+
|  Instruction Card                                            |
|  ----------------                                            |
|  Amount to pay                                               |
|  Payment method                                              |
|  Bank/account details                                        |
|  Reference guidance                                          |
|  Required proof checklist                                    |
|  [ Submit payment proof ]                                    |
|  Back to finance                                             |
+--------------------------------------------------------------+
```

### Layout Notes

- Payment instructions should feel like a dedicated task page, not a sidebar note.

## 4. Payment Proof Submission

### Desktop Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Submit payment proof                                     |
| Short explanation                                            |
+--------------------------------------------------------------+
|  Left Requirements Panel         |  Right Form Panel         |
|  ----------------------------    |  ----------------------   |
|  Required proof checklist        |  Upload field             |
|  Accepted formats                |  Amount paid              |
|  Validation guidance             |  Payment date/time        |
|                                  |  Optional note            |
|                                  |  [ Submit proof ]         |
|                                  |  Back to finance          |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Member Shell                  |
+-------------------------------+
| H1: Submit payment proof      |
| Short explanation             |
| Required checklist            |
| Upload field                  |
| Amount paid                   |
| Payment date/time             |
| Optional note                 |
| [ Submit proof ]              |
| Back to finance               |
+-------------------------------+
```

### Layout Notes

- The checklist should remain visible before the CTA.
- Validation should be local and inline where possible.

## 5. Proof Submitted

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
|                                                              |
|             Success / Submission Confirmation                |
|             ---------------------------------                |
|             H1: Payment proof submitted                      |
|             Submitted details summary                        |
|             What happens next                                |
|             [ View payment status ]                          |
|             Return to finance                                |
|                                                              |
+--------------------------------------------------------------+
```

## 6. Pending Verification

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Awaiting verification                                    |
+--------------------------------------------------------------+
|  Status Panel                                                |
|  ------------                                                |
|  Pending badge                                               |
|  What this means                                             |
|  Do not resubmit guidance                                    |
|  Expected next step                                          |
|                                                              |
|  Submitted proof summary                                     |
|  [ Return to finance ]                                       |
|  Contact support                                             |
+--------------------------------------------------------------+
```

### Layout Notes

- This page should actively prevent unnecessary duplicate action.

## 7. Payment Confirmed

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Payment confirmed                                        |
+--------------------------------------------------------------+
|  Confirmation Panel                                          |
|  -------------------                                         |
|  Paid amount                                                 |
|  Confirmation date                                           |
|  Related registration/item                                   |
|  [ Download receipt ]                                        |
|  [ Download invoice ]                                        |
|  Return to registrations                                     |
+--------------------------------------------------------------+
```

## 8. Payment Rejected

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Action required                                          |
+--------------------------------------------------------------+
|  Rejection Guidance Panel                                    |
|  ------------------------                                    |
|  Rejected status                                              |
|  Reason for rejection                                        |
|  What to fix                                                 |
|  [ Submit corrected proof ]                                  |
|  Contact support                                             |
+--------------------------------------------------------------+
```

## 9. Receipts and Invoices Archive

### Desktop / Mobile Shared Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Receipts and invoices                                    |
| Short explanation                                            |
+--------------------------------------------------------------+
|  Transaction / Document Table                                |
|  --------------------------------                            |
|  Date | Item | Type | Status | Action                        |
|                                                              |
|  [ Download / View ]                                         |
+--------------------------------------------------------------+
```

## Review Checklist

- Can the user identify their current payment state within a few seconds?
- Is the primary CTA always above history content?
- Is the current job of the page unambiguous?
- Are rejection and pending states emotionally clear and operationally useful?
- Are document/archive surfaces kept secondary until relevant?

