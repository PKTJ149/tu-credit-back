# Cross-Flow Design Rules

## Purpose

These rules are derived from the current audit and should guide every future flow redesign.

## Rules

### 1. Define State Before Screen

Do not design a screen until the underlying user/system state is defined.

Why:

- The current website confusion is driven by unclear states more than visual style alone.

Applies especially to:

- authentication
- profile completion
- registration
- payment
- credit transfer

### 2. One Primary Task Per Screen

Each screen should have one dominant user job.

Why:

- Current pages mix profile, registration, finance, history, and document actions together.
- This makes next actions hard to understand.

### 3. Public and Logged-In States Must Be Visibly Different

Anonymous browsing and signed-in member areas must not share the same navigation state or user controls.

Why:

- Current login/register/public pages display member controls and reduce trust.

### 4. Every Transactional Screen Must Show The Next Action Clearly

A transactional flow should never make the user guess what to do next.

Examples:

- pay now
- upload proof
- wait for verification
- correct rejected submission
- download receipt

### 5. Content Integrity Is A Core Requirement

No page in the redesigned system should contain copied or unrelated institutional content.

Why:

- Current provident-fund content residue creates severe trust issues.

### 6. Status Must Be Human-Readable

Every important state should have:

- a plain-language label
- a short explanation
- a next action if one exists

### 7. History Should Not Compete With Action

Past records, archives, receipts, and logs should support the main task, not dominate it.

Why:

- In current flows, history tables often compete with urgent tasks like payment and submission.

## Immediate Use

These rules should be checked before:

- future sitemap definition
- component planning
- redesign of auth/onboarding
- redesign of finance/payment
- redesign of credit transfer

