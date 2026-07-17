# Future Sitemap v1

## Purpose

This document proposes a concise future sitemap for the CREDIT BANK redesign based on the current audit, current flow maps, and redesign backlog.

This v1 is intended to:

- separate public, member, and transactional responsibilities more clearly
- reduce overlap between profile, registration, and finance
- create a cleaner foundation for phased redesign work

## Sitemap Principles

- Public pages should help users understand the system, browse offerings, and decide whether to create an account.
- Member pages should support identity, planning, and progress tracking.
- Transactional pages should focus on one task at a time and make the next required action obvious.

## Future Public Pages

| Page | Purpose | Rationale | Priority |
|---|---|---|---|
| Home | Introduce CREDIT BANK and route users into the right journey. | Current home mixes trust, discovery, and CTA. Future home should clearly direct users to browse, learn, or sign in. | P2 |
| Programs | Browse all programs with strong filtering and comparison cues. | Program discovery is already a major entry path and needs better decision support. | P2 |
| Program Detail | Explain one program, requirements, credits, outcomes, related subjects, and next action. | Current detail page has many controls but weak decision order. | P2 |
| Subjects | Browse individual subjects independently from programs. | Current subject browsing exists but its relationship to programs is unclear. | P3 |
| Subject Detail | Explain one subject, credit value, eligibility, fees, and related program context. | Needed to support subject-first decision making and registration clarity. | P3 |
| About CREDIT BANK | Build trust with institutional context, purpose, and credibility. | Important trust page, but lower urgency than auth and payment flows. | P4 |
| Help Center | Task-based help for registration, payment, status checking, and credit transfer. | Current manual is useful but too document-like for fast task completion. | P3 |
| News | Show announcements and updates relevant to users. | Keep as a lightweight communication surface after content cleanup. | P4 |
| News Detail | Show one verified announcement with related updates. | Needed to replace current mismatched template content. | P4 |
| Login | Dedicated sign-in entry for returning users. | Must clearly separate anonymous and logged-in states. | P1 |
| Register | Dedicated account creation entry for new users. | Core entry into all member and transactional journeys. | P1 |

## Future Member Pages

| Page | Purpose | Rationale | Priority |
|---|---|---|---|
| Member Dashboard | Give users one clear overview of profile status, current registrations, payment status, and pending actions. | Current member flows are scattered across profile, registration, and finance. | P2 |
| Profile | Manage identity, contact, and education information. | Current profile is valid but needs clearer ownership and completeness rules. | P1 |
| Profile Completion | Guide users through required setup before registration or payment. | Needed because account creation and full profile setup should not be the same step. | P1 |
| Learning Goals | Help users define goals, recommended paths, and progress direction. | Current learning objectives page has high value but needs clearer role. | P3 |
| My Registrations | Show selected, enrolled, and historical subjects or programs. | Registration should stand on its own instead of being mixed into finance. | P1 |
| Academic Progress | Show progress, earned credits, and completion history. | Separate learning/progress from payment and profile concerns. | P3 |
| Settings | Manage real user preferences such as notifications and language. | Keep only settings that map to real system behavior. | P4 |
| Security | Manage password and account security actions. | Change password should be separated from generic settings. | P2 |

## Future Transactional Pages

| Page | Purpose | Rationale | Priority |
|---|---|---|---|
| Registration Review | Confirm what the user is about to register for before submission. | Current registration flow mixes review, history, finance, and profile content. | P1 |
| Registration Confirmation | Confirm successful registration and route user to payment if required. | Current success/payment notice page is ambiguous. | P1 |
| Finance Dashboard | Show outstanding balance, payment status, payable items, and next required action. | Highest-trust transactional hub and current major pain point. | P1 |
| Payment Instructions | Present payment method, bank details, and submission guidance. | Should be a focused task page rather than part of a mixed summary screen. | P1 |
| Payment Proof Submission | Let users upload payment proof with required fields and validation. | Current payment-notice behavior needs a clearer, standalone step. | P1 |
| Payment Status | Show whether proof is pending, confirmed, rejected, or needs correction. | Required to reduce uncertainty and duplicate submissions. | P1 |
| Receipts and Invoices | Provide structured access to official financial documents. | Document actions should live in a clear archive/history context. | P2 |
| Credit Transfer Hub | Let users choose transfer in or transfer out before entering a request flow. | Current flat page is too complex for direct entry. | P2 |
| Credit Transfer Request | Guided multi-step request flow with details and evidence upload. | Core redesign need for a high-complexity flow. | P2 |
| Credit Transfer Review | Review request details before final submission. | Reduces mistakes in a sensitive academic process. | P2 |
| Credit Transfer Status and History | Track all transfer requests and their statuses. | Important for transparency and follow-up after submission. | P2 |

## Recommended Rollout Order

1. Login, Register, Profile Completion, Profile
2. Registration Review, Registration Confirmation
3. Finance Dashboard, Payment Instructions, Payment Proof Submission, Payment Status
4. My Registrations, Member Dashboard
5. Credit Transfer Hub, Credit Transfer Request, Credit Transfer Review, Credit Transfer Status and History
6. Learning Goals, Academic Progress
7. Home, Programs, Program Detail, Subjects, Subject Detail
8. Help Center, About CREDIT BANK, News, News Detail, Settings

## Notes

- `Finance Dashboard` should become the primary transactional anchor after a user registers for anything payable.
- `My Registrations` and `Academic Progress` should be separate even if they reuse the same data source.
- `Help Center` should be task-based, not a long static manual.
- `Member Dashboard` can remain lightweight in v1 if the team wants to prioritize transaction completion over dashboard richness.
