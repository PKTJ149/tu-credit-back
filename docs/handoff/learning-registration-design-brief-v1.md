# Learning and Registration Design Brief v1

## Purpose

This brief translates the learning/registration flow and screen spec into a design-ready brief for a future UI design pass.

It is intended for:

- product design
- UI design
- agency handoff
- prototype creation

## Scope

This brief covers:

- Learning Goals
- Program / Subject Decision View
- Registration Review
- Registration Confirmation
- My Registrations
- Academic Progress

This brief does not yet cover:

- public program/subject discovery pages
- finance/payment task pages
- internal academic administration tools

## Primary Product Goals

1. Separate planning from commitment.
2. Separate active registrations from historical progress.
3. Make registration feel deliberate and understandable.
4. Route members into finance only when payment is actually relevant.
5. Keep academic progress readable without turning it into a cluttered admin report.

## UX Problems This Design Must Solve

- Learning goals, registration, and finance currently overlap too heavily.
- Registration is unclear as a mental model: active workflow, history, cart, or dashboard.
- Academic history and current tasks compete for attention.

## Audience Mindset

Typical user concerns at this stage:

- What should I learn next?
- Am I eligible for this program or subject?
- What exactly am I registering for?
- What have I already registered for?
- Where do I see my past academic record?

The design should keep these questions separate instead of answering all of them on one page.

## Design Intent

The learning and registration journey should feel:

- guided
- motivating
- structured
- academically clear
- progress-aware

The experience should not feel:

- like a mixed dashboard with no clear job
- finance-first when the user is still exploring learning
- overloaded with historical data too early

## Suggested Visual Direction

This is a provisional direction aligned with the rest of the redesign:

- Tone: educational, modern, encouraging
- Layout: task-first, with visible progress context
- Density: moderate, with clear separation between active and historical content
- Trust signals: explicit academic labels, credits, statuses, and progression cues
- Interaction feel: focused and forward-moving

## Content Priorities By Screen

### Learning Goals

Must emphasize:

- recommendations
- progress direction
- next useful learning options

### Program / Subject Decision

Must emphasize:

- relevance
- credits
- eligibility
- why this item matters

### Registration Review

Must emphasize:

- exactly what the user is about to commit to
- any prerequisite or payment implication

### Registration Confirmation

Must emphasize:

- success
- next step
- whether finance is required next

### My Registrations

Must emphasize:

- active registration status
- immediate next actions

### Academic Progress

Must emphasize:

- earned results
- historical record
- completion direction

## Structural Recommendations

### Layout

- Keep Learning Goals aspirational but still practical.
- Make Registration Review a clear checkpoint.
- Keep My Registrations operational.
- Keep Academic Progress historical and reflective.

### Navigation

- Use authenticated/member shell.
- Keep `My Registrations`, `Academic Progress`, and `Finance` as distinct destinations.

### Hierarchy

- One primary job per screen.
- Active tasks above historical context.

## Component Priorities

Components that should be designed first:

1. Learning recommendation card
2. Program/subject decision card
3. Registration review summary
4. Status badge
5. Registrations list row
6. Progress summary card
7. Academic record table

## Responsive Priorities

- Recommendation and decision cards must remain scannable on mobile.
- Registration review should not become a long ambiguous stack on smaller screens.
- Academic tables need a mobile-friendly fallback.

## Success Criteria

The design pass is successful if:

- learning exploration feels different from registration commitment
- users can tell what is active versus historical
- finance appears only when truly needed
- the screens help members move forward without confusion

## Open Questions

- How personalized should Learning Goals be in v1?
- Can users register both subjects and programs directly in one unified path?
- Which statuses belong in My Registrations beyond active/completed?
- What historical data matters most in Academic Progress?

