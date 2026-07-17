# Current Auth and Onboarding Flow

## Flow Goal

Help a new or returning user access the CREDIT BANK system and move into a usable member state.

## Current Entry Points

- Home CTA
- Public navigation login/register link
- Program or subject browsing path that eventually requires account access

## Current Pages

| Step | Page | URL | User Action | System Response |
|---|---|---|---|---|
| 1 | Login | `/login.html` | Enter email or national ID and password | Intended access to member area |
| 2 | Login | `/login.html` | Choose Google login | Intended alternate access path |
| 3 | Register | `/register.html` | Create new account with personal/contact credentials | Intended account creation |
| 4 | Profile | `/profile.html` | Fill or edit personal/education details | Intended member setup/completion |

## Observed Form Structure

### Login

- Identity field supports email or national ID
- Password field
- Remember-me checkbox
- Google sign-in option
- Help text references support contact

### Register

- First name
- Last name
- Phone number
- Email
- Password
- Confirm password
- Terms acceptance

### Profile Completion

- Personal details
- Education information
- Education history

## Current Friction

### 1. Public and logged-in states are mixed

- Login and register pages still show logged-in controls such as user name and logout.
- This weakens confidence in the authentication state.

### 2. Login hierarchy is weak

- No observed H1 on login page.
- The page relies on a section heading instead of a stronger page-level identity.

### 3. Support content feels mismatched

- Login help text refers to contacting `เจ้าหน้าที่กองทุน`, which may not match CREDIT BANK terminology.

### 4. Registration path is incomplete from a journey perspective

- Register captures basic fields but does not clearly communicate:
  - Email verification
  - Next required step
  - What happens after account creation
  - What profile completion is required before registration/payment

### 5. Profile completion is underdefined

- Profile page exists, but the difference between:
  - account creation
  - profile completion
  - identity verification
  - education record setup
  is not clear.

## Current-State Risk

| Severity | Risk | Why It Matters |
|---|---|---|
| Critical | Mixed login state | Users may not trust the platform or know whether they are already signed in. |
| High | Weak post-register path | New users may not know what to do next. |
| High | Mismatched support wording | Institutional trust drops when terminology feels copied from another system. |
| Medium | Missing strong page identity on login | Reduces clarity and confidence at a critical entry point. |

## Recommended Future Flow

1. User lands on Login or Register.
2. User chooses one clear path:
   - Sign in
   - Create account
3. After successful registration:
   - Show confirmation state
   - Explain next step
   - Route user to profile completion if needed
4. After successful login:
   - Route user to the most relevant destination:
     - dashboard
     - registration
     - finance
     - unfinished profile
5. Profile completion should be a separate guided step if required before course registration or payment.

## Required States For Redesign

- Default login
- Login validation error
- Login credential error
- Login success
- Register default
- Register validation error
- Register success
- Verification pending
- Profile incomplete
- Profile complete
- Forgot password

## Required Components

- Auth split layout or focused single-column auth layout
- Page-level trust header
- Form field with helper/error state
- Password visibility toggle
- Terms consent component
- Social login button
- Success/confirmation panel
- Support/help panel

## Open Questions

- Is email verification required today?
- Is national ID required for all user types?
- What data must exist before a user can register for a program or subject?
- Is there a forgot-password page or flow already?

