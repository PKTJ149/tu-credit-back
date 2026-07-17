# Auth and Onboarding Screen Spec v1

## Purpose

This document defines the first-pass screen specification for the CREDIT BANK auth and onboarding redesign.

It is intended to support:

- UI design
- prototype creation
- future frontend implementation

## Screen Set

### 1. Login

Primary job:

- Help a returning user sign in confidently.

Required content:

- Page title and short trust/support description
- Email or national-ID field
- Password field
- Remember-me control
- Primary sign-in CTA
- Google sign-in action if retained
- Forgot password link
- Create account link

Required states:

- Default
- Missing required fields
- Invalid credential attempt
- Loading
- Session expired entry state

Primary CTA:

- Sign in

Secondary CTAs:

- Create account
- Reset password

Notes:

- Must use public navigation variant only.
- Must not show member name or logout.

### 2. Register

Primary job:

- Help a new user create an account with the minimum required information.

Required content:

- First name
- Last name
- Phone number
- Email
- Password
- Confirm password
- Consent checkbox
- Create account CTA
- Back to sign in link

Required states:

- Default
- Field validation errors
- Password mismatch
- Missing consent
- Loading

Primary CTA:

- Create account

Secondary CTA:

- Sign in instead

Notes:

- Password rules should be visible before submit.
- Avoid overloading this page with profile-completion fields.

### 3. Register Success

Primary job:

- Confirm successful account creation and explain the next required step.

Required content:

- Success message
- Short summary of what was completed
- Next-step explanation
- Continue CTA

Possible next-step variants:

- Continue to verification
- Continue to profile completion

Required states:

- Verification required
- No verification required

Primary CTA:

- Continue

### 4. Verification Pending

Primary job:

- Help the user complete or understand account verification.

Required content:

- Verification message
- Delivery/expectation note
- Resend option if supported
- Return to sign in

Required states:

- Default
- Resend success
- Resend temporarily unavailable if applicable

Primary CTA:

- Continue after verification

Secondary CTA:

- Back to sign in

### 5. Forgot Password

Primary job:

- Let the user request password recovery with minimal friction.

Required content:

- Email field
- Reset CTA
- Back to sign in

Required states:

- Default
- Invalid email
- Loading

Primary CTA:

- Send reset instructions

### 6. Reset Sent

Primary job:

- Confirm the reset request and route the user back to sign in.

Required content:

- Confirmation message
- What to check next
- Back to sign in CTA

Required states:

- Default confirmation

Primary CTA:

- Back to sign in

### 7. Profile Completion

Primary job:

- Collect the minimum required learner data before protected downstream actions.

Required content groups:

- Personal details
- Education details
- Education history if required
- Missing-requirements checklist
- Save and continue CTA

Required states:

- Default
- Incomplete required fields
- Validation errors
- Saving
- Save success

Primary CTA:

- Save and continue

Secondary CTA:

- Continue later if policy allows

Notes:

- This screen should feel like onboarding, not generic profile settings.
- Each missing requirement should explain why it matters if it gates registration or payment.

### 8. Authenticated Ready Redirect

Primary job:

- Route the user to the right next destination after auth/onboarding is complete.

Possible destinations:

- Member dashboard
- My registrations
- Finance dashboard
- Intended protected route

Required behavior:

- Preserve intended destination where available
- Show a lightweight transitional state only if needed

## Shared Content Rules

- Use CREDIT BANK-specific terminology only.
- Never reuse provident-fund wording or unrelated support language.
- Keep success messages explicit about what finished and what is next.
- Keep error messages actionable and calm.

## Shared UI Rules

- One primary CTA per screen.
- Use public/auth header variant, never member header, until onboarding is complete.
- Keep support/help content secondary to the main action.
- Every screen must have a clear page-level title.

## Gating Rules

- Login success does not always mean account-ready.
- Register success does not always mean onboarding complete.
- Only `authenticated_ready` should unlock registration, finance, and credit transfer submission flows.

## Next Use

Use this spec to create:

- low-fidelity auth wireframes
- high-fidelity auth screens
- prototype links for stakeholder review

