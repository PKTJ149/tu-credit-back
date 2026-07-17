# Learning and Registration Screen Spec v1

## Purpose

This document defines the first-pass screen specification for the CREDIT BANK learning and registration redesign.

It is intended to support:

- UI design
- prototype creation
- future frontend implementation

## Screen Set

### 1. Learning Goals

Primary job:

- Help the member understand recommended learning directions and decide where to go next.

Required content:

- Goal summary
- Recommended programs
- Recommended subjects
- Progress snapshot
- Optional career/outcome framing

Required states:

- Default
- No recommendations
- Returning user with progress

Primary CTA:

- View program
- View subject

### 2. Program / Subject Decision View

Primary job:

- Help the member evaluate one item before registration.

Required content:

- Item title
- Credits
- Eligibility
- Key benefits/outcomes
- Related items
- Register CTA

Required states:

- Eligible to register
- Not yet eligible
- Saved for later if supported

Primary CTA:

- Register

Secondary CTA:

- Save for later

### 3. Registration Review

Primary job:

- Confirm exactly what the member is about to register for.

Required content:

- Selected item summary
- Credits summary
- Important warnings or prerequisites
- Payment summary if applicable

Required states:

- Default
- Payment required
- Eligibility issue

Primary CTA:

- Confirm registration

Secondary CTA:

- Edit selection

### 4. Registration Confirmation

Primary job:

- Confirm successful registration and route to the right next destination.

Required content:

- Confirmation message
- Registered item summary
- Next-step explanation

Required states:

- No payment required
- Payment required

Primary CTA:

- Go to my registrations
- Go to finance

### 5. My Registrations

Primary job:

- Show active or recent registrations and their current status.

Required content:

- Registration list
- Status badges
- Important next-action indicators
- Finance link when payment is outstanding

Required states:

- Active registrations
- No active registrations
- Registration awaiting payment

Primary CTA:

- View registration detail

Secondary CTA:

- Go to finance

### 6. Academic Progress

Primary job:

- Show historical learning record and completion progress separately from active registration tasks.

Required content:

- Earned credits summary
- Completed items
- Grades/results
- Historical periods or terms

Required states:

- Records available
- No historical record

Primary CTA:

- View detailed record

## Shared Content Rules

- Keep planning, committing, and historical review clearly separate.
- Use plain-language registration and progress labels.
- Show payment implication only where it affects the next action.

## Shared UI Rules

- One primary CTA per screen.
- Use status badges for active registrations and academic records consistently.
- Use tables or list rows for dense historical content, but keep them secondary to the main task.
- Do not mix finance actions directly into learning-planning screens.

## Gating Rules

- Learning Goals should not feel like a transactional page.
- Registration Review must happen before Registration Confirmation.
- Payment-required outcomes must route into finance, not remain buried in registrations.
- Academic Progress should be read as history, not active action.

## Next Use

Use this spec to create:

- low-fidelity learning/registration wireframes
- high-fidelity member learning screens
- prototype links for stakeholder review

