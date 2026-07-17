# State Models

Use this folder for future-state behavioral definitions before high-fidelity design starts.

Each state model should define:

- purpose
- actors
- states
- entry conditions
- exit conditions
- transitions
- user-facing labels/messages
- required UI states
- edge cases
- open questions

Recommended files:

- `auth-onboarding-state-model.md`
- `payment-state-model.md`
- `credit-transfer-state-model.md`
- `registration-state-model.md`
- `profile-completeness-state-model.md`

## Working Rules

- Define states before screens.
- One screen should have one primary job.
- Avoid mixing profile editing, transaction handling, and historical records in the same primary view unless there is a very strong reason.
- Every state should map to a user-facing explanation and a next action.
