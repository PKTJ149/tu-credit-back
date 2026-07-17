# CREDIT BANK Website Redesign Operating Plan

## Purpose

This document is the operating plan for the CREDIT BANK website redesign project. It captures the agreed workflow and should be treated as the source of truth before any visual redesign work begins.

The project must not start by redesigning isolated screens. It must start by understanding the existing website, mapping the current flows, defining the future structure, and then redesigning one complete flow at a time.

## Guiding Principles

1. Understand the current system before changing it.
2. Design by user flow, not by isolated page.
3. Prioritize user experience, simplicity, speed, and clarity.
4. Reuse patterns through a small design system instead of designing every screen from scratch.
5. Redesign high-impact flows first.
6. Keep every decision traceable to an observed page, user need, flow issue, or project goal.
7. Create documentation that can be handed to an agency, developer, or internal stakeholder.

## Required Sequence

### Phase 1: Current Website Inventory

Goal: Capture what exists today.

Activities:

- Collect all known URLs.
- Identify public pages, authenticated/member pages, and transactional pages.
- Record page purpose, main content, CTAs, forms, navigation links, and visible states.
- Note duplicated navigation, inconsistent labels, missing context, and unclear next actions.

Deliverable:

- Current Website Audit
- Page Inventory
- Initial Sitemap

### Phase 2: Current Flow Mapping

Goal: Understand how users move through the existing website.

Activities:

- Map public discovery flows.
- Map login/register/account flows.
- Map course/program discovery flows.
- Map subject discovery and registration flows.
- Map finance/payment flows.
- Map credit transfer flows.
- Map profile/settings/password flows.
- Identify entry points, decision points, dead ends, and repeated steps.

Deliverable:

- Current Flow Map
- Flow Relationship Map
- List of UX risks and friction points

### Phase 3: UX/UI Audit

Goal: Identify what needs to improve before redesigning.

Activities:

- Review information hierarchy.
- Review navigation and IA clarity.
- Review forms and transactional steps.
- Review table/list/card density.
- Review mobile suitability.
- Review language consistency.
- Review trust, credibility, and institutional presentation.
- Review accessibility risks where visible.

Deliverable:

- UX/UI Findings
- Severity and impact notes
- Improvement opportunities by flow

### Phase 4: Future Flow Definition

Goal: Decide how the redesigned website should work.

Activities:

- Define target users.
- Define redesigned flow structure.
- Decide which pages should remain, merge, split, or be removed.
- Prioritize flows based on user value and project importance.
- Define success criteria for each flow.

Deliverable:

- Future Sitemap
- Future Flow Map
- Flow Priority Plan

### Phase 5: UI Component Direction

Goal: Define the reusable interface system before full screen design.

Activities:

- Define core layout patterns.
- Define navigation patterns.
- Define course/program cards.
- Define data tables.
- Define filters and search.
- Define form controls and validation states.
- Define status badges.
- Define alerts, confirmations, and empty states.
- Define payment/receipt/invoice components.
- Define document upload components.

Deliverable:

- UI Component Direction
- Initial Design System Checklist
- Component-to-flow usage map

### Phase 6: Redesign Flow by Flow

Goal: Redesign complete journeys in priority order.

Activities:

- Start with the highest-impact flow.
- Design all pages and states required for that flow.
- Review the flow end-to-end before moving to the next flow.
- Reuse and refine components after each flow.
- Keep the design system updated as patterns stabilize.

Deliverable:

- Flow-based redesigned screens
- Interactive prototype per major flow
- Updated design system components

### Phase 7: Handoff and Validation

Goal: Prepare the redesign for implementation or agency handoff.

Activities:

- Document screen purpose and expected behavior.
- Document component usage.
- Document responsive behavior.
- Document content rules.
- Document edge cases and empty/error/success states.
- Validate flow completeness before development begins.

Deliverable:

- Final redesign package
- Handoff notes
- Implementation priority plan

## Initial Flow Groups

### Public Discovery Flow

Likely pages:

- Home
- Program list
- Program detail
- Subject list
- Subject detail
- About
- Manual
- News
- News detail

Primary goal:

- Help users understand what CREDIT BANK is, discover programs/subjects, and decide whether to register or log in.

### Authentication and Onboarding Flow

Likely pages:

- Login
- Register
- Profile
- Change password

Primary goal:

- Help users access their account and complete required identity/profile information.

### Learning and Registration Flow

Likely pages:

- Program list/detail
- Subject list/detail
- Registration
- Learning objectives

Primary goal:

- Help users choose courses/subjects, understand requirements, and manage enrolled learning.

### Finance and Payment Flow

Likely pages:

- Finance
- Checkout/payment notice
- Receipt
- Invoice

Primary goal:

- Help users understand unpaid balance, paid history, payment status, receipts, invoices, and payment confirmation.

### Credit Transfer Flow

Likely pages:

- Credit transfer
- Credit transfer in
- Credit transfer out
- Request history
- Email preview / submission confirmation

Primary goal:

- Help users submit and track credit transfer requests with clear evidence/document requirements.

### Account and Settings Flow

Likely pages:

- Profile
- Settings
- Change password
- Notification preferences
- Privacy/system preferences

Primary goal:

- Help users manage account information, preferences, security, and communication settings.

## Initial Priority Recommendation

1. Public Discovery Flow
2. Authentication and Onboarding Flow
3. Learning and Registration Flow
4. Finance and Payment Flow
5. Credit Transfer Flow
6. Account and Settings Flow

Reason:

The public discovery and onboarding flows shape first trust and conversion. Learning, registration, and finance then become the core utility flows. Credit transfer is important but more specialized. Settings should follow once the main product structure is clear.

## Working Rule

Before redesigning any flow, the project must have:

- Current state captured
- Current pain points listed
- Future flow goal defined
- Required components identified
- Success criteria agreed

Only then should visual UI design begin for that flow.

