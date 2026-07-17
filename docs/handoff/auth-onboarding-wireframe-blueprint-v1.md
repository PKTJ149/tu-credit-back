# Auth and Onboarding Wireframe Blueprint v1

## Purpose

This document converts the auth/onboarding design brief and screen spec into low-fidelity structural blueprints.

It is intended to guide:

- wireframe creation
- early Figma layout
- screen composition reviews

## Wireframe Principles

- One primary task per screen
- One dominant CTA per screen
- Support content stays secondary
- Public/auth shell only until onboarding is complete
- Layout should feel official, calm, and focused

## 1. Login

### Desktop Structure

```text
+--------------------------------------------------------------+
| Public Header: Logo | Programs | Subjects | Help | Sign in   |
+--------------------------------------------------------------+
|                                                              |
|  Left Support Column            |  Right Primary Form Panel  |
|  ----------------------------   |  ------------------------  |
|  CREDIT BANK identity           |  H1: Sign in to CREDIT     |
|  Short trust message            |  Short support line        |
|  MCU trust/support note         |                            |
|                                  |  [Email / National ID ]   |
|                                  |  [Password            ]   |
|                                  |  [ ] Remember me          |
|                                  |  [ Sign in ]              |
|                                  |  [ Google sign in ]       |
|                                  |  Forgot password          |
|                                  |  Create account           |
|                                                              |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Public Header                 |
+-------------------------------+
| CREDIT BANK identity          |
| Short trust message           |
|                               |
| H1: Sign in                   |
| Support line                  |
| [Email / National ID      ]   |
| [Password                ]   |
| [ ] Remember me               |
| [ Sign in ]                   |
| [ Google sign in ]            |
| Forgot password               |
| Create account                |
+-------------------------------+
```

### Layout Notes

- The support column should not overpower the form.
- The form panel should visually read as the main action zone.
- Error text should appear directly below the relevant field.

## 2. Register

### Desktop Structure

```text
+--------------------------------------------------------------+
| Public Header                                                |
+--------------------------------------------------------------+
|                                                              |
|  Intro / reassurance area      |  Registration form panel    |
|  ----------------------------   |  ------------------------   |
|  Why create an account          |  H1: Create your account    |
|  Short trust message            |  [First name            ]   |
|                                  |  [Last name             ]   |
|                                  |  [Phone                 ]   |
|                                  |  [Email                 ]   |
|                                  |  [Password              ]   |
|                                  |  [Confirm password      ]   |
|                                  |  [ ] Terms consent         |
|                                  |  [ Create account ]        |
|                                  |  Sign in instead           |
|                                                              |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Public Header                 |
+-------------------------------+
| H1: Create your account       |
| Short explanation             |
| [First name               ]   |
| [Last name                ]   |
| [Phone                    ]   |
| [Email                    ]   |
| [Password                 ]   |
| [Confirm password         ]   |
| [ ] Terms consent             |
| [ Create account ]            |
| Sign in instead               |
+-------------------------------+
```

### Layout Notes

- Password requirements should live near the password field, not hidden in a tooltip only.
- Terms consent must sit immediately before the main CTA.

## 3. Register Success

### Structure

```text
+--------------------------------------------------------------+
| Public/Auth Header                                            |
+--------------------------------------------------------------+
|                                                              |
|                   Success Confirmation Panel                 |
|                   -------------------------                  |
|                   Success icon / status                      |
|                   H1: Account created                        |
|                   What completed                             |
|                   What happens next                          |
|                   [ Continue ]                               |
|                                                              |
+--------------------------------------------------------------+
```

### Layout Notes

- This screen should feel like a pause and confirmation, not another form.
- Keep only one main next-step CTA.

## 4. Verification Pending

### Structure

```text
+--------------------------------------------------------------+
| Public/Auth Header                                            |
+--------------------------------------------------------------+
|                                                              |
|                  Instruction / Status Panel                  |
|                  --------------------------                  |
|                  H1: Verify your account                     |
|                  What to do now                              |
|                  What to expect next                         |
|                  [ Resend email ] (if supported)             |
|                  [ Back to sign in ]                         |
|                                                              |
+--------------------------------------------------------------+
```

## 5. Forgot Password

### Structure

```text
+--------------------------------------------------------------+
| Public/Auth Header                                            |
+--------------------------------------------------------------+
|                                                              |
|                Focused Recovery Form Panel                   |
|                ---------------------------                   |
|                H1: Reset password                            |
|                Short explanation                             |
|                [Email field             ]                    |
|                [ Send reset instructions ]                   |
|                Back to sign in                               |
|                                                              |
+--------------------------------------------------------------+
```

## 6. Reset Sent

### Structure

```text
+--------------------------------------------------------------+
| Public/Auth Header                                            |
+--------------------------------------------------------------+
|                                                              |
|                 Confirmation / Next-Step Panel               |
|                 -----------------------------                |
|                 H1: Check your email                         |
|                 Confirmation message                         |
|                 What to do if not received                   |
|                 [ Back to sign in ]                          |
|                                                              |
+--------------------------------------------------------------+
```

## 7. Profile Completion

### Desktop Structure

```text
+--------------------------------------------------------------+
| Authenticated Minimal Shell                                  |
+--------------------------------------------------------------+
|                                                              |
|  Left Progress Panel             |  Right Form Workspace     |
|  ----------------------------    |  -----------------------  |
|  H1: Complete your profile       |  Personal details         |
|  Why this is required            |  [Field] [Field]          |
|  Missing requirements checklist  |                           |
|  What this unlocks               |  Education details        |
|                                  |  [Field] [Field]          |
|                                  |                           |
|                                  |  Education history        |
|                                  |  [Field groups]           |
|                                  |                           |
|                                  |  [ Save and continue ]    |
|                                  |  Continue later (if allowed) |
|                                                              |
+--------------------------------------------------------------+
```

### Mobile Structure

```text
+-------------------------------+
| Minimal Member Shell          |
+-------------------------------+
| H1: Complete your profile     |
| Why this is required          |
| Missing checklist             |
|                               |
| Personal details              |
| [Field]                       |
| [Field]                       |
|                               |
| Education details             |
| [Field]                       |
| [Field]                       |
|                               |
| Education history             |
| [Field groups]                |
|                               |
| [ Save and continue ]         |
| Continue later                |
+-------------------------------+
```

### Layout Notes

- The checklist should remain visible on desktop while the user fills the form.
- The form should be chunked into sections, not one long undifferentiated stack.

## 8. Authenticated Ready Redirect

### Structure

```text
+--------------------------------------------------------------+
| Transitional state if needed                                 |
+--------------------------------------------------------------+
|                                                              |
|  Optional lightweight redirect panel                         |
|  ---------------------------------                           |
|  Success / ready message                                     |
|  Next destination label                                      |
|  [ Continue ] or automatic redirect                          |
|                                                              |
+--------------------------------------------------------------+
```

## Review Checklist

- Is the primary action obvious in under 3 seconds?
- Is there any member-only control visible too early?
- Does every screen explain what happens next?
- Are error and recovery paths clearly placed?
- Does Profile Completion feel like onboarding rather than settings?

