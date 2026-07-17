# Auth and Onboarding Design Brief v1

## Purpose

This brief translates the auth/onboarding flow and screen spec into a design-ready brief for the first UI design pass.

It is intended for:

- product design
- UI design
- agency handoff
- prototype creation

## Scope

This brief covers:

- Login
- Register
- Register Success
- Verification Pending
- Forgot Password
- Reset Sent
- Profile Completion

This brief does not yet cover:

- finance/payment screens
- credit transfer screens
- public marketing/discovery screens

## Primary Product Goals

1. Increase trust at the moment users enter the system.
2. Separate anonymous and signed-in states clearly.
3. Make account creation feel simple and guided.
4. Make profile completion feel like onboarding, not admin work.
5. Reduce ambiguity about what the user should do next.

## UX Problems This Design Must Solve

- Public and auth screens currently show logged-in controls.
- Login lacks strong page identity and trust framing.
- Register success and next-step guidance are unclear.
- Profile completion is not clearly separated from general settings/profile maintenance.
- Error and recovery states are not well expressed.

## Audience Mindset

Typical user concerns at this stage:

- Am I in the right place?
- Is this an official university system?
- What do I need to fill in now?
- What happens after I sign in or register?
- Why do I need to complete my profile before moving on?

The design should answer these quickly without sounding technical.

## Design Intent

The auth journey should feel:

- official
- calm
- trustworthy
- modern
- structured
- supportive, not bureaucratic

The experience should not feel:

- like an old admin portal
- overloaded with too many actions
- visually noisy
- generic startup SaaS

## Suggested Visual Direction

This is a provisional design direction, not a final aesthetic lock:

- Tone: academic, credible, warm, digitally current
- Layout: focused and task-centered, with restrained supporting information
- Density: moderate, not sparse and not dashboard-heavy
- Trust signals: MCU/CREDIT BANK identity, short support copy, clear step framing
- Interaction feel: guided and steady, with minimal surprise

## Content Priorities By Screen

### Login

Must emphasize:

- official system identity
- clear sign-in form
- support/recovery path

Must de-emphasize:

- secondary links
- unrelated member navigation

### Register

Must emphasize:

- minimum required information
- password and consent clarity
- easy switch back to sign in

Must de-emphasize:

- long institutional explanation
- advanced profile fields

### Register Success

Must emphasize:

- success
- exactly what happens next

### Verification Pending

Must emphasize:

- what the user must do now
- what to expect next

### Forgot Password / Reset Sent

Must emphasize:

- simplicity
- reassurance

### Profile Completion

Must emphasize:

- why this is required
- what is still missing
- what unlocks after completion

Must de-emphasize:

- generic settings behavior
- unrelated history or dashboard content

## Structural Recommendations

### Layout

- Use focused single-purpose pages for Login, Register, Forgot Password, and Reset Sent.
- Use a guided form layout for Profile Completion.
- Keep supporting information in compact secondary panels, not equal-weight columns unless the composition clearly benefits from it.

### Navigation

- Public/auth header only until onboarding is complete.
- No member shortcuts, no logout, no mixed navigation state.

### Hierarchy

- One page title
- One primary CTA
- One clear next step

## Component Priorities

Components that should be designed first:

1. Public/auth header variant
2. Auth page header
3. Form field set
4. Password field pattern
5. Validation pattern
6. CTA bar/button hierarchy
7. Success panel
8. Status/instruction panel
9. Profile completion checklist

## Responsive Priorities

- Mobile auth experience must be first-class, not a scaled-down desktop form.
- Field grouping should remain readable without long scrolling confusion.
- CTA placement should remain obvious on smaller screens.

## Success Criteria

The design pass is successful if:

- login and register are visually distinct from member pages
- next-step guidance is obvious after every auth outcome
- profile completion feels required but not punitive
- error states feel recoverable
- the flow can be reviewed end-to-end without requiring verbal explanation

## Open Questions

- Is verification required in v1?
- What exact profile fields are mandatory before registration/payment?
- Should Google sign-in remain visually secondary or be promoted?
- What is the preferred destination after successful login when there is no pending route?

