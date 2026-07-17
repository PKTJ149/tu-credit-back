# Credit Transfer Screen Spec v1

## Purpose

This document defines the first-pass screen specification for the CREDIT BANK credit transfer redesign.

It is intended to support:

- UI design
- prototype creation
- future frontend implementation

## Screen Set

### 1. Credit Transfer Hub

Primary job:

- Help the member choose the correct transfer path and understand the feature before starting.

Required content:

- Overview of credit transfer
- Transfer in card
- Transfer out card
- Short eligibility/help content
- Recent request history preview

Required states:

- First visit
- Existing history available
- No existing requests

Primary CTA:

- Start transfer in
- Start transfer out

### 2. Transfer Type Selection

Primary job:

- Confirm the correct request direction before detailed data entry.

Required content:

- Transfer in explanation
- Transfer out explanation
- Requirement summary for each

Required states:

- Default
- Type selected

Primary CTA:

- Continue

### 3. Credit Transfer Request

Primary job:

- Collect the structured details of the selected request type.

Transfer-in required content:

- Source institution
- Subject/course name
- Request detail

Transfer-out required content:

- Completed subjects selection
- Destination institution
- Destination type
- Additional detail

Required states:

- Transfer-in variant
- Transfer-out variant
- Validation errors
- Draft in progress if supported

Primary CTA:

- Continue to evidence

Secondary CTA:

- Save draft if supported

### 4. Evidence Step

Primary job:

- Collect and validate supporting documents.

Required content:

- Evidence checklist
- File upload
- Accepted format guidance
- Missing evidence warnings

Required states:

- Default
- Missing required evidence
- Invalid upload
- Upload success
- Upload failure

Primary CTA:

- Continue to review

### 5. Review Request

Primary job:

- Let the member confirm the full request before submission.

Required content:

- Transfer type summary
- Detail summary
- Evidence summary
- Edit links to previous steps

Required states:

- Ready to submit
- Blocked by incomplete requirement

Primary CTA:

- Submit request

Secondary CTA:

- Edit request

### 6. Submission Confirmation

Primary job:

- Confirm successful submission and provide next-step guidance.

Required content:

- Request ID
- Submitted date/time
- Transfer type
- Next-step explanation

Required states:

- Default confirmation

Primary CTA:

- View status and history

Secondary CTA:

- Return to hub

### 7. Status and History

Primary job:

- Help the member monitor all transfer requests and open details when needed.

Required content:

- Request history table
- Status badges
- Request metadata
- View detail actions

Required states:

- No requests
- Active requests
- Historical requests

Primary CTA:

- View request detail

Secondary CTA:

- Start new request

### 8. Under Review

Primary job:

- Explain that the request is under staff review and prevent unnecessary duplicate action.

Required content:

- Under-review status panel
- Submitted evidence summary
- Expected next-step guidance

Required states:

- Default under review
- Delayed support guidance if needed

Primary CTA:

- Return to history

Secondary CTA:

- Contact support

### 9. Changes Requested

Primary job:

- Show exactly what the reviewer needs changed and route the member back into correction.

Required content:

- Requested change summary
- Reviewer reason
- Highlighted fields/evidence to update

Required states:

- Default correction

Primary CTA:

- Continue correction

Secondary CTA:

- Return to history

### 10. Approved

Primary job:

- Confirm approval and explain the result.

Required content:

- Approved status
- Result summary
- Next academic/administrative implication

Required states:

- Default approved

Primary CTA:

- Return to history

### 11. Rejected

Primary job:

- Explain final rejection clearly and provide support next step if applicable.

Required content:

- Rejected status
- Final reason
- Support guidance

Required states:

- Default rejected

Primary CTA:

- Contact support or return to history

### 12. Withdrawn

Primary job:

- Confirm that the request has been withdrawn.

Required content:

- Withdrawn status
- What this means

Required states:

- Default withdrawn

Primary CTA:

- Return to history

## Shared Content Rules

- Use explicit transfer terminology consistently.
- Explain the difference between transfer in and transfer out early.
- Use plain-language status labels plus short explanation text.
- Keep reviewer feedback actionable, not vague.

## Shared UI Rules

- One primary CTA per screen.
- Use a stepper for the active request flow.
- Do not mix request history and active request entry in one undifferentiated screen.
- Evidence requirements should be visible before the user reaches review.

## Gating Rules

- Request flow starts only after transfer type is selected.
- Review is unavailable until required evidence is complete.
- Submitted and under-review states should be read-only except where changes are explicitly requested.
- Changes-requested should deep-link the user into the exact correction step where possible.

## Next Use

Use this spec to create:

- low-fidelity credit transfer wireframes
- high-fidelity credit transfer screens
- prototype links for stakeholder review

