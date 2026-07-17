# Component Inventory Mapped To Flows

## Purpose

This document defines the core reusable UI components for the CREDIT BANK redesign, maps them to major flows, and notes critical redesign constraints from the current audit.

## Flow Keys

- `Public Discovery`
- `Auth and Onboarding`
- `Learning and Registration`
- `Finance and Payment`
- `Credit Transfer`
- `Account and Settings`

## Core Reusable Components

| Component | Primary Use | Flows | Critical Redesign Notes |
|---|---|---|---|
| Global header | Primary navigation, identity, entry points | Public Discovery, Auth and Onboarding, Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | Must visibly differentiate anonymous and signed-in states. Do not show member controls on public/auth screens. |
| Page header | Page title, summary, top-level action | Public Discovery, Auth and Onboarding, Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | Every page needs a clear H1 and task framing. Title/H1 mismatches must be eliminated. |
| Section shell | Groups content into scannable task sections | Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | Use to separate jobs cleanly. Do not mix profile, finance, and history in one undifferentiated block. |
| CTA bar | Primary and secondary actions for a page or section | Public Discovery, Auth and Onboarding, Learning and Registration, Finance and Payment, Credit Transfer | Transactional screens must make the next action obvious. |
| Status badge | Short state label for items and flows | Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | All critical states must be human-readable and consistent across tables, cards, and timelines. |
| Status panel | Explains current state, meaning, and next step | Auth and Onboarding, Finance and Payment, Credit Transfer | Needed where simple badges are not enough, especially for verification, pending review, or rejection states. |
| Timeline / progress stepper | Shows step sequence or request lifecycle | Auth and Onboarding, Finance and Payment, Credit Transfer | Best used for multi-step or review-based flows. Especially important for credit transfer and payment verification. |
| Form field | Text, select, date, and structured inputs | Auth and Onboarding, Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | Must support helper text, validation, error, and disabled states. Sensitive forms need strong trust cues. |
| Form section | Structured grouping for related fields | Auth and Onboarding, Credit Transfer, Account and Settings | Helps reduce cognitive load on longer forms and clarifies required vs optional information. |
| File upload | Upload evidence or supporting documents | Finance and Payment, Credit Transfer | Must clearly state accepted files, requirements, upload status, and replacement rules. |
| Summary card | Key numeric or descriptive summary | Public Discovery, Learning and Registration, Finance and Payment, Account and Settings | Use for totals, credits, registration count, outstanding balance, or profile completeness. |
| Item card / list row | Program, subject, transaction, or request preview | Public Discovery, Learning and Registration, Finance and Payment, Credit Transfer | Cards and rows should expose the decision-critical fields only, not decorative detail. |
| Data table | Dense history, enrolled items, payments, documents | Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | History should support the task, not overpower the page. Needs responsive fallback for mobile. |
| Action menu | Secondary document or item actions | Finance and Payment, Credit Transfer, Account and Settings | Good for receipts, invoices, download, or view details. Keep primary task outside the menu. |
| Filter/search controls | Narrow lists and records | Public Discovery, Learning and Registration, Finance and Payment, Credit Transfer | Especially useful for catalogs and history screens. Must not bury the main CTA. |
| Empty state | Explains no data or no eligibility | Public Discovery, Learning and Registration, Finance and Payment, Credit Transfer, Account and Settings | Should tell the user what it means and what to do next. |
| Success / confirmation panel | Confirms completion and routes next step | Auth and Onboarding, Learning and Registration, Finance and Payment, Credit Transfer | Important for register success, payment proof submitted, and request submitted moments. |
| Help / support panel | Contextual guidance and contact path | Public Discovery, Auth and Onboarding, Finance and Payment, Credit Transfer | Replace copied or mismatched institutional wording. Keep support language CREDIT BANK-specific. |

## Flow Mapping Summary

### Public Discovery

Core components:

- Global header
- Page header
- CTA bar
- Summary card
- Item card / list row
- Filter/search controls
- Empty state
- Help / support panel

Critical notes:

- Public discovery must clearly route users into register or login.
- Program and subject browsing should surface eligibility, credits, and next action more clearly than the current site.

### Auth and Onboarding

Core components:

- Global header
- Page header
- Form field
- Form section
- CTA bar
- Status panel
- Timeline / progress stepper
- Success / confirmation panel
- Help / support panel

Critical notes:

- Account creation, verification, and profile completion should be distinct states.
- Trust cues matter here more than decoration.

### Learning and Registration

Core components:

- Global header
- Page header
- Section shell
- Summary card
- Item card / list row
- Status badge
- Data table
- CTA bar
- Empty state

Critical notes:

- Separate planning, enrolling, and progress tracking into clearly different screen purposes.
- Registration should route into finance when payment is required.

### Finance and Payment

Core components:

- Global header
- Page header
- Section shell
- Summary card
- Status badge
- Status panel
- Timeline / progress stepper
- Payable item list via item card / list row or data table
- File upload
- Action menu
- Success / confirmation panel
- Empty state
- Help / support panel

Critical notes:

- This is the highest trust-sensitive flow and needs strong state visibility.
- Outstanding balance, payment instructions, and proof submission status should dominate the layout.

### Credit Transfer

Core components:

- Global header
- Page header
- Timeline / progress stepper
- Form field
- Form section
- File upload
- Status badge
- Status panel
- Data table
- Success / confirmation panel
- Help / support panel

Critical notes:

- Transfer type selection should happen before the long form.
- Evidence requirements must be impossible to miss.

### Account and Settings

Core components:

- Global header
- Page header
- Section shell
- Form field
- Form section
- Summary card
- Status badge
- Data table
- Action menu
- Empty state

Critical notes:

- Keep identity/profile management separate from transactional tasks.
- Remove all unrelated template content and ensure page labels match actual content.

## Cross-Flow Rules For Component Use

1. Reusable components must expose state clearly before visual polish.
2. Primary actions should stay outside dense tables whenever a task is time-sensitive.
3. History, documents, and archives should appear as supporting structures, not page owners.
4. All transactional components need default, loading, success, error, and empty states defined.
5. Components that appear in both public and member contexts must have distinct variants when state or trust expectations differ.

## Immediate Design Use

Use this inventory before:

- future sitemap definition
- state-model expansion
- auth/onboarding redesign
- finance/payment redesign
- credit transfer redesign
