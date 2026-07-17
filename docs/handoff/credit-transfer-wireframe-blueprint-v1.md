# Credit Transfer Wireframe Blueprint v1

## Purpose

This document converts the credit transfer design brief and screen spec into low-fidelity structural blueprints.

It is intended to guide:

- wireframe creation
- early Figma layout
- screen composition reviews

## Wireframe Principles

- Choose transfer type before long-form entry
- Keep progress visible throughout the request flow
- Make evidence requirements visible before submission
- Separate active request entry from history
- Keep correction flows targeted and calm

## 1. Credit Transfer Hub

### Desktop Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Credit transfer                                          |
| Short explanation                                            |
+--------------------------------------------------------------+
|  Transfer Type Cards                                         |
|  [ Transfer in ]   [ Transfer out ]                          |
+--------------------------------------------------------------+
|  Eligibility / Help Summary                                  |
+--------------------------------------------------------------+
|  Recent Request History Preview                              |
|  [ View all requests ]                                       |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Member Shell                  |
+-------------------------------+
| H1: Credit transfer           |
| Short explanation             |
| [ Transfer in ]               |
| [ Transfer out ]              |
| Eligibility / help summary    |
| Recent request preview        |
| [ View all requests ]         |
+-------------------------------+
```

## 2. Transfer Type Selection

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Choose transfer type                                     |
| Short explanation                                            |
+--------------------------------------------------------------+
|  [ Transfer in card ]                                        |
|  explanation, requirements, continue CTA                     |
|                                                              |
|  [ Transfer out card ]                                       |
|  explanation, requirements, continue CTA                     |
+--------------------------------------------------------------+
```

## 3. Credit Transfer Request

### Desktop Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Credit transfer request                                  |
| Stepper: Type -> Details -> Evidence -> Review -> Submit     |
+--------------------------------------------------------------+
|  Main Form Workspace                                         |
|  -------------------                                         |
|  Form section 1                                              |
|  Form section 2                                              |
|  Form section 3                                              |
|                                                              |
|  [ Continue to evidence ]                                    |
|  Save draft                                                  |
+--------------------------------------------------------------+
```

### Layout Notes

- Transfer-in and transfer-out should share structure, not identical field content.
- Only fields relevant to the chosen type should be shown.

## 4. Evidence Step

### Desktop Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Add supporting evidence                                  |
| Stepper visible                                              |
+--------------------------------------------------------------+
|  Left Checklist Panel            |  Right Upload Workspace   |
|  ----------------------------    |  ----------------------   |
|  Required documents              |  Upload area              |
|  Missing items                   |  Uploaded files list      |
|  Accepted formats                |  Replace/remove actions   |
|                                  |  [ Continue to review ]   |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Member Shell                  |
+-------------------------------+
| H1: Add supporting evidence   |
| Stepper                       |
| Required checklist            |
| Upload area                   |
| Uploaded files                |
| [ Continue to review ]        |
+-------------------------------+
```

## 5. Review Request

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Review your request                                      |
| Stepper visible                                              |
+--------------------------------------------------------------+
|  Summary Blocks                                              |
|  - Transfer type                                             |
|  - Request details                                           |
|  - Evidence summary                                          |
|  - Edit links                                                |
|                                                              |
|  [ Submit request ]                                          |
|  Edit request                                                |
+--------------------------------------------------------------+
```

## 6. Submission Confirmation

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
|                   Confirmation Panel                         |
|                   ------------------                         |
|                   H1: Request submitted                      |
|                   Request ID                                 |
|                   Submitted date/time                        |
|                   What happens next                          |
|                   [ View status and history ]                |
|                   Return to hub                              |
+--------------------------------------------------------------+
```

## 7. Status and History

### Desktop Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Request status and history                               |
+--------------------------------------------------------------+
|  Request Table                                               |
|  Date | Type | Title | Status | Action                       |
+--------------------------------------------------------------+
|  Optional Detail Drawer / Secondary Panel                    |
|  Timeline, evidence summary, reviewer notes                  |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Member Shell                  |
+-------------------------------+
| H1: Request history           |
| [Request card]                |
| status, date, action          |
| [Request card]                |
+-------------------------------+
```

## 8. Under Review

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Under review                                             |
+--------------------------------------------------------------+
|  Status Panel                                                |
|  - What is happening now                                     |
|  - What to expect next                                       |
|  - Support path if needed                                    |
|                                                              |
|  Submitted request summary                                   |
|  [ Return to history ]                                       |
+--------------------------------------------------------------+
```

## 9. Changes Requested

### Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
| H1: Changes requested                                        |
+--------------------------------------------------------------+
|  Reviewer Guidance Panel                                     |
|  - What needs correction                                     |
|  - Why                                                       |
|  - Where to update                                           |
|                                                              |
|  [ Continue correction ]                                     |
|  Return to history                                           |
+--------------------------------------------------------------+
```

## 10. Approved / Rejected / Withdrawn

### Shared Structure

```text
+--------------------------------------------------------------+
| Member Shell                                                 |
+--------------------------------------------------------------+
|  Outcome Panel                                               |
|  -------------                                               |
|  H1: Final status                                            |
|  Explanation                                                 |
|  Next step or support path                                   |
|  [ Return to history ]                                       |
+--------------------------------------------------------------+
```

## Review Checklist

- Is transfer type selection clear before form entry?
- Is step progress visible throughout the active request?
- Are missing evidence requirements impossible to miss?
- Does review-before-submit feel trustworthy?
- Are status and correction states actionable without extra explanation?

