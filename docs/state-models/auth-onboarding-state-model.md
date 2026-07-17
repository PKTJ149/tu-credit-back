# CREDIT BANK Auth and Onboarding State Model

## Purpose

Define the future-state auth and onboarding logic for CREDIT BANK before redesigning screens.

This document is based on:

- `docs/01-current-website-audit.md`
- `docs/04-ux-ui-audit-findings.md`
- `docs/flow-maps/current-auth-onboarding-flow.md`
- `docs/05-redesign-priority-backlog.md`

## Actors

- Primary actor: learner/member
- Secondary actor: support staff
- System actor: auth service, profile service, session manager

## Scope

Included:

- Login
- Register
- Register success
- Verification pending
- Forgot password request
- Profile completion
- Ready-for-member-use state
- Session expiry recovery

Not yet included:

- Staff/admin authentication
- Multi-factor authentication
- Detailed identity verification workflow
- Non-Google external SSO providers

## Design Intent

The auth journey should make these questions obvious at every step:

1. Can I sign in right now?
2. If I am new, what do I need to create an account?
3. What must I finish before I can register or pay?
4. What should I do next after each successful step?

## State Principles

- Public and authenticated navigation must be clearly separated.
- Registration success is not the same as onboarding complete.
- Onboarding complete is not the same as payment or registration success.
- Each state must show one primary next action.
- Error states should preserve user progress where safely possible.

## States

| State | Description | Entry Condition | Exit Condition | User-Facing Label |
|---|---|---|---|---|
| `anonymous` | User is browsing public pages without an authenticated session. | No valid session exists. | User starts sign in, starts registration, or is redirected from a protected page. | Browse as guest |
| `login_ready` | User can submit credentials to sign in. | User opens login or is redirected after session expiry. | User submits credentials, switches to register, or opens forgot password. | Sign in |
| `login_invalid` | Login submission failed validation. | Required input is missing or malformed. | User corrects errors and resubmits. | Fix sign-in details |
| `login_failed` | Login submission was valid structurally but authentication failed. | Backend rejects credentials or account state. | User retries, resets password, or changes path to register. | Sign-in failed |
| `register_ready` | User can create a new account. | User opens register from a public or login context. | User submits the form successfully or returns to login. | Create account |
| `register_invalid` | Registration submission failed validation. | Required fields, password match, or consent requirement fails. | User corrects errors and resubmits. | Fix account details |
| `register_submitted` | Account creation succeeded. | Backend accepted registration. | User moves to verification or profile completion. | Account created |
| `verification_pending` | User must complete a verification step before full access. | Verification is required after registration or sign-in. | Verification completes or expires. | Verify your account |
| `forgot_password_ready` | User can request a password reset. | User opens password recovery from login. | Reset request is sent or user returns to login. | Reset password |
| `forgot_password_sent` | Reset instructions have been sent. | Password reset request is accepted. | User returns to login after completing reset steps. | Check your email |
| `authenticated_profile_incomplete` | User is signed in but missing required onboarding information. | Auth succeeded but required fields are incomplete. | User enters onboarding and submits the minimum valid data. | Complete your profile |
| `authenticated_profile_review` | User is actively filling or editing onboarding data. | User opens the onboarding form from an incomplete state. | User saves valid data, cancels, or hits validation errors. | Review your details |
| `authenticated_profile_invalid` | Onboarding submission failed validation. | Required onboarding fields or formats are invalid. | User corrects errors and resubmits. | Fix required details |
| `authenticated_ready` | User is signed in and has met the minimum onboarding requirements. | Auth succeeded and all required gating data is complete. | User signs out or session expires. | Continue to your account |
| `session_expired` | The user had a session but must authenticate again. | Session timeout, invalid token, or forced sign-out. | User signs in again successfully. | Session expired |

## Transitions

| From | Trigger | To | Notes |
|---|---|---|---|
| `anonymous` | User chooses sign in | `login_ready` | Public navigation should remain visible until auth starts. |
| `anonymous` | User chooses create account | `register_ready` | Register can start from public CTAs or login switch link. |
| `anonymous` | User attempts protected route | `login_ready` | Preserve intended destination for post-login routing. |
| `login_ready` | Missing or malformed credentials | `login_invalid` | Validation can be client-side and server-side. |
| `login_ready` | Credentials rejected | `login_failed` | Message should avoid unsafe account enumeration. |
| `login_ready` | Auth succeeds but onboarding incomplete | `authenticated_profile_incomplete` | This is the key split missing in the current site. |
| `login_ready` | Auth succeeds and onboarding complete | `authenticated_ready` | User should continue to intended task, not a generic landing page by default. |
| `login_ready` | User chooses forgot password | `forgot_password_ready` | Keep a lightweight recovery path. |
| `login_ready` | User chooses create account | `register_ready` | Preserve non-sensitive input only if helpful. |
| `login_invalid` | User fixes form issues | `login_ready` | Focus first invalid field. |
| `login_failed` | User retries sign in | `login_ready` | Keep identity field populated if policy allows. |
| `login_failed` | User opens forgot password | `forgot_password_ready` | Recovery path. |
| `login_failed` | User chooses register | `register_ready` | Fallback for genuinely new users. |
| `register_ready` | Validation fails | `register_invalid` | Includes consent, format, or password mismatch. |
| `register_ready` | Registration succeeds | `register_submitted` | Show a distinct success state, not a silent redirect. |
| `register_ready` | User switches to sign in | `login_ready` | Needed for users who already have an account. |
| `register_invalid` | User fixes issues | `register_ready` | Preserve non-sensitive entered data. |
| `register_submitted` | Verification required | `verification_pending` | Requirement is still an open product question. |
| `register_submitted` | No verification, onboarding incomplete | `authenticated_profile_incomplete` | Most likely current target state. |
| `register_submitted` | No verification and onboarding already satisfied | `authenticated_ready` | Less likely, but allowed if registration captures all required data. |
| `verification_pending` | Verification succeeds and onboarding incomplete | `authenticated_profile_incomplete` | Continue setup after verification. |
| `verification_pending` | Verification succeeds and onboarding complete | `authenticated_ready` | Direct ready state. |
| `verification_pending` | Verification expires or session drops | `session_expired` | User must re-enter a valid path. |
| `forgot_password_ready` | Reset request accepted | `forgot_password_sent` | Confirmation should explain where instructions were sent. |
| `forgot_password_ready` | User returns to sign in | `login_ready` | Non-destructive back path. |
| `forgot_password_sent` | User returns after reset | `login_ready` | Could be via explicit CTA or natural return path. |
| `authenticated_profile_incomplete` | User opens required onboarding form | `authenticated_profile_review` | Prefer dedicated onboarding rather than generic profile/settings mix. |
| `authenticated_profile_incomplete` | Session ends | `session_expired` | Preserve progress if possible. |
| `authenticated_profile_review` | Validation fails | `authenticated_profile_invalid` | Missing education or profile details should surface clearly. |
| `authenticated_profile_review` | User saves valid required data | `authenticated_ready` | Downstream flows become available. |
| `authenticated_profile_review` | User leaves without completing | `authenticated_profile_incomplete` | Resume later with checklist reminder. |
| `authenticated_profile_review` | Session ends | `session_expired` | Avoid data loss if drafts are supported. |
| `authenticated_profile_invalid` | User corrects issues | `authenticated_profile_review` | Keep current entries intact. |
| `authenticated_ready` | User signs out | `anonymous` | Public navigation resumes. |
| `authenticated_ready` | Session expires | `session_expired` | Route back into login with context. |
| `session_expired` | User re-authenticates | `login_ready` | Then continue through normal login outcomes. |

## State Notes

### `anonymous`

Observed issue from current docs:

- Public and auth pages currently appear to show logged-in controls, which weakens trust.

UI implications:

- Show public navigation only.
- Hide member shortcuts, member name, and logout controls.
- If redirected from a protected route, explain why the user must sign in.

### `login_ready`

UI implications:

- Strong page heading and trust framing are required.
- Use one clear primary auth form.
- Keep Google sign-in visually secondary to the main task unless product strategy says otherwise.
- Clarify accepted identifier types such as email or national ID.

### `login_invalid`

UI implications:

- Inline errors on the exact fields.
- Focus the first invalid field after submit.
- Keep the user on the same screen.

### `login_failed`

UI implications:

- Explain failure without overexposing security-sensitive information.
- Keep identity value when safe.
- Offer obvious recovery actions: retry, reset password, create account.

### `register_ready`

UI implications:

- Explain minimum required fields before submit.
- Make password rules visible before error.
- Make consent required and explicit.

### `register_invalid`

UI implications:

- Inline field errors plus optional top-level summary.
- Preserve non-sensitive input values.
- Separate required vs optional inputs clearly.

### `register_submitted`

UI implications:

- Dedicated success state.
- Explain what happens next.
- Do not drop the user straight into a confusing member page with no guidance.

### `verification_pending`

Assumption:

- Verification appears necessary as a modeled state even though current docs do not confirm whether it already exists.

UI implications:

- Show clear instruction, resend option if available, and support path only when needed.
- Distinguish this state from full completion.

### `forgot_password_ready`

UI implications:

- Keep the screen minimal.
- Explain where reset instructions will be sent.
- Reuse auth layout patterns for consistency.

### `forgot_password_sent`

UI implications:

- Confirmation panel with next action.
- Explain delivery delay expectations if relevant.
- Allow return to sign in.

### `authenticated_profile_incomplete`

Observed issue from current docs:

- The current site does not clearly separate account creation from profile completion.

UI implications:

- Show a checklist of missing requirements.
- Gate downstream actions that require complete data.
- Route to a dedicated onboarding step, not a mixed finance/profile/settings page.

### `authenticated_profile_review`

UI implications:

- Group fields by mental model: personal info, education info, education history.
- Explain why each group matters if it affects eligibility or credit transfer later.
- If the form is long, define whether drafts are supported before screen design starts.

### `authenticated_profile_invalid`

UI implications:

- Keep data intact.
- Highlight only the fields that need attention.
- Show one strong next action: fix and save.

### `authenticated_ready`

UI implications:

- Route the user to the most relevant next destination:
  - intended protected route
  - registration
  - finance
  - future member dashboard
- Only this state should unlock the full member navigation model.

### `session_expired`

UI implications:

- Explain that the session expired.
- Preserve user context where possible so the next action feels recoverable.

## Gating Rules For Downstream Flows

These rules should be confirmed before redesigning registration and finance:

- Public discovery can stay available in `anonymous`.
- Starting registration interest may be allowed in `anonymous`, but committing a subject or program should likely require at least `authenticated_profile_incomplete`.
- Submitting a registration that leads to payment should likely require `authenticated_ready`.
- Finance and payment should require `authenticated_ready`.
- Credit transfer should require `authenticated_ready`.

## Required UI States

- Login default
- Login validation error
- Login credential failure
- Register default
- Register validation error
- Register success
- Verification pending
- Forgot password request
- Forgot password confirmation
- Profile completion default
- Profile completion validation error
- Profile completion success or route-forwarding state
- Session expired prompt

## Required Screens or Views

- Public auth entry point
- Login screen
- Register screen
- Register success screen
- Verification pending screen
- Forgot password screen
- Forgot password confirmation screen
- Profile completion screen
- Session expired dialog or page

## Edge Cases

- User signs in successfully but is redirected to an outdated or unauthorized destination.
- User creates an account with data that duplicates an existing person record.
- User begins onboarding, leaves, and returns on another device.
- User attempts finance or credit-transfer access while profile is incomplete.
- Google sign-in returns an account that still requires missing local profile data.
- Session expires during onboarding form completion.

## Open Questions

- Is email verification required now, planned, or not used?
- Is national ID required at login, registration, or only later in onboarding?
- What is the minimum data required before a user can:
  - register for a subject or program
  - submit payment
  - request credit transfer
- Is Google sign-in live or just a placeholder?
- Does a forgot-password flow already exist but remain unlinked?
- Should onboarding be one long form or a step-based sequence?
- Are there multiple user types with different onboarding requirements?
- Should onboarding progress save as draft?
