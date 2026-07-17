# Credit Transfer Design Brief v1

## Purpose

This brief translates the credit transfer flow and screen spec into a design-ready brief for a future UI design pass.

It is intended for:

- product design
- UI design
- agency handoff
- prototype creation

## Scope

This brief covers:

- Credit Transfer Hub
- Transfer Type Selection
- Credit Transfer Request
- Evidence Step
- Review Request
- Submission Confirmation
- Status and History
- Under Review
- Changes Requested
- Approved / Rejected / Withdrawn outcomes

This brief does not yet cover:

- staff-side review tools
- academic policy governance screens
- back-office decision logic

## Primary Product Goals

1. Make transfer type selection clear before any heavy form entry.
2. Reduce mistakes in evidence submission.
3. Replace the current flat-page confusion with a guided journey.
4. Make review and status states easy to understand.
5. Keep correction and resubmission flows controlled and predictable.

## UX Problems This Design Must Solve

- Transfer in and transfer out currently live on one overloaded page.
- Evidence requirements are not prominent enough.
- Email preview is doing the wrong job as a primary confirmation surface.
- Users may not know what staff is doing, what they are waiting for, or what needs correction.

## Audience Mindset

Typical user concerns at this stage:

- Which transfer path am I supposed to use?
- What evidence do I need?
- Did I fill the right details?
- Has someone reviewed my request yet?
- If they rejected or questioned it, what exactly should I fix?

The design should reduce anxiety and complexity at every step.

## Design Intent

The credit transfer journey should feel:

- guided
- structured
- transparent
- careful
- academically trustworthy

The experience should not feel:

- like a long uncontrolled form
- bureaucratically opaque
- hard to correct after submission
- overloaded with internal/staff artifacts

## Suggested Visual Direction

This is a provisional direction aligned with the broader redesign:

- Tone: academic, structured, supportive
- Layout: step-based, with strong progress cues
- Density: moderate, with generous grouping for complex information
- Trust signals: clear state labels, review summary, evidence checklist, history transparency
- Interaction feel: careful and well-guided

## Content Priorities By Screen

### Credit Transfer Hub

Must emphasize:

- what credit transfer is
- the difference between transfer in and transfer out
- where to start

### Transfer Type Selection

Must emphasize:

- choosing the correct path before data entry

### Credit Transfer Request

Must emphasize:

- only the fields needed for the chosen path
- clear grouping
- clarity over density

### Evidence Step

Must emphasize:

- what is required
- what is missing
- whether the upload is acceptable

### Review Request

Must emphasize:

- confidence before submission
- the ability to correct before committing

### Submission Confirmation

Must emphasize:

- success
- request identity
- what happens next

### Status and History

Must emphasize:

- lifecycle transparency
- clear distinction between active and past requests

### Changes Requested

Must emphasize:

- exactly what needs to change
- that the user can recover

## Structural Recommendations

### Layout

- Use a stepper for active request flow.
- Use a summary-and-details structure on review screens.
- Keep request history separate from active entry flow.

### Navigation

- Use authenticated/member shell.
- Keep the user anchored to the credit transfer area during multi-step entry.

### Hierarchy

- One dominant step
- One dominant CTA
- One visible progress cue

## Component Priorities

Components that should be designed first:

1. Transfer type cards
2. Stepper
3. Form section pattern
4. Evidence checklist
5. File upload pattern
6. Review summary block
7. Status panel
8. Request timeline/history row
9. Changes-requested guidance panel

## Responsive Priorities

- Multi-step request flow must remain understandable on mobile.
- Long forms should use chunked sections rather than overwhelming scroll blocks.
- Status/history must still be readable when compressed.

## Success Criteria

The design pass is successful if:

- users can choose the correct transfer path without explanation
- evidence requirements are impossible to miss
- review-before-submit feels trustworthy
- status screens clearly explain whether the user should wait, fix, or move on
- the full journey is understandable without staff intervention

## Open Questions

- Can drafts be saved in v1?
- Can requests be withdrawn after submission?
- What exact evidence set is required for transfer out?
- What happens for the user immediately after approval beyond the status change?

