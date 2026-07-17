# UX/UI Audit Findings

## Audit Scope

This document captures first-pass UX/UI findings from the existing CREDIT BANK website. Findings are based on observed pages, page titles, headings, navigation, forms, and flow structure.

## Severity Scale

- Critical: Trust, security, or task-completion issue that can seriously harm user confidence or block a core flow.
- High: Major UX problem likely to confuse users or cause avoidable mistakes.
- Medium: Noticeable usability issue that should be improved during redesign.
- Low: Polish or consistency issue.

## Findings

### Critical: Unrelated Provident-Fund Content Appears Inside CREDIT BANK Website

Observed on:

- `/news-detail.html`
- `/change-password.html`
- `/setting.html`

Evidence:

- News detail page title and article content reference `กองทุนสำรองเลี้ยงชีพ`.
- Change password page title references `กองทุนสำรองเลี้ยงชีพ`.
- Settings page title references `กองทุนสำรองเลี้ยงชีพ`.

Impact:

- Users may lose trust because the website appears to contain copied or mismatched content.
- Stakeholders may question whether the product is reliable or complete.

Recommendation:

- Remove or rewrite all template residue.
- Add a content QA checklist before redesign approval.
- Treat content consistency as a core redesign requirement, not a final polish task.

### Critical: Login State Is Unclear Across Public and Authentication Pages

Observed on:

- `/index.html`
- `/program.html`
- `/subject.html`
- `/login.html`
- `/register.html`

Evidence:

- Public and login/register pages show user controls such as user name and logout.

Impact:

- Users may not understand whether they are browsing anonymously, already logged in, or seeing sample data.
- Login/register flow credibility is weakened.

Recommendation:

- Define separate navigation states:
  - Anonymous public user
  - Logged-in student/member
  - Staff/admin if applicable
- Remove member controls from anonymous and auth pages.

### High: Finance, Registration, and Profile Responsibilities Are Mixed

Observed on:

- `/profile.html`
- `/registration.html`
- `/finance.html`

Evidence:

- Finance page contains personal information fields, registered subjects, finance summary, receipts, invoices, and registration list.
- Registration page contains personal information, registered subjects, financial information, and learning summary.

Impact:

- Users may struggle to identify the next action.
- Editing profile details inside finance can distract from payment tasks.
- The same information appears in multiple contexts without a clear reason.

Recommendation:

- Separate pages by user intent:
  - Profile: identity and personal/education data.
  - Registration: selected/enrolled subjects and registration status.
  - Finance: payment obligations, payment notification, receipts, invoices.

### High: Payment Flow Lacks Clear State Model

Observed on:

- `/finance.html`
- `/checkout-subject-success.html`

Evidence:

- Checkout page is titled registration success but also contains bank account and transfer notification.
- Finance links to receipts, invoices, and payment notice without a clearly visible lifecycle.

Impact:

- Users may not know whether they have registered, need to pay, have paid, or are waiting for verification.
- Payment proof submission could be duplicated or missed.

Recommendation:

- Define payment states before redesign:
  - Not registered
  - Registered/unpaid
  - Payment proof submitted
  - Pending verification
  - Paid/confirmed
  - Rejected/requires correction
- Redesign finance around status and next required action.

### High: Credit Transfer Flow Is Too Complex For A Single Flat Page

Observed on:

- `/credit-transfer.html`

Evidence:

- Transfer-in form, transfer-out form, email preview, and request history appear in one page.
- Transfer-out includes many subject checkboxes and additional destination details.

Impact:

- Users may not understand which transfer type applies to them.
- Users may submit incomplete evidence or choose the wrong path.

Recommendation:

- Redesign as a guided multi-step flow:
  - Choose transfer type.
  - Enter details.
  - Add evidence.
  - Review.
  - Submit.
  - Track status.

### High: Sensitive Forms Appear To Use GET Method

Observed on:

- `/login.html`
- `/change-password.html`

Evidence:

- Browser extraction observed form method as `get` for login and password update.

Impact:

- If carried into production behavior, credentials or password-related information could be exposed through URLs or logs.

Recommendation:

- Confirm whether this is only static prototype behavior.
- For real implementation, credential and password forms must use secure POST submission and backend validation.

### Medium: Page Titles And Headings Are Inconsistent

Observed on:

- `/finance.html`
- `/learning-objectives.html`
- `/news-detail.html`
- `/change-password.html`
- `/setting.html`

Evidence:

- Finance page title says Profile while H1 says Finance.
- Learning objectives page title says Registration.
- Several account pages reference provident fund in the title.

Impact:

- Browser tabs, search previews, accessibility labels, and user orientation become unreliable.

Recommendation:

- Establish a title pattern:
  - `{Page Name} - CREDIT BANK - MCU`
- QA every page title and H1 pair.

### Medium: Program And Subject Discovery Need Stronger Decision Support

Observed on:

- `/program.html`
- `/program_detail.html?id=0`
- `/subject.html`

Evidence:

- Program/subject lists are catalog-heavy with filters and pagination.
- Program detail has save/share/overview/subjects/review controls.

Impact:

- Users may browse but not know what to choose, whether they are eligible, what credits apply, or what registration means.

Recommendation:

- Program/subject cards should show:
  - Name
  - Level/category
  - Credit count
  - Duration
  - Price/payment requirement if applicable
  - Registration status/eligibility
  - Primary CTA

### Medium: Manual Is Useful But Should Be Task-Based

Observed on:

- `/manual.html`

Evidence:

- Manual includes many help sections such as registration, profile, payment, certificates, and CREDIT BANK.

Impact:

- Long manuals can be hard to scan when users need immediate task help.

Recommendation:

- Convert manual into task-based help:
  - How to register
  - How to pay
  - How to check status
  - How to request credit transfer
  - How to download receipt/certificate

### Medium: Missing Or Weak Form Labels In Member Pages

Observed on:

- `/profile.html`
- `/registration.html`
- `/finance.html`
- `/credit-transfer.html`

Evidence:

- Several form fields were extracted without labels or names.

Impact:

- Accessibility, QA, error handling, and implementation handoff become weaker.

Recommendation:

- Every input/select/textarea should have a clear visible label, programmatic label, helper text where needed, and validation state.

### Low: Cookie Consent Appears On Many Pages And May Be Duplicated

Observed on:

- `/index.html`
- `/about-us.html`
- `/manual.html`
- `/news-detail.html`
- `/register.html`
- `/checkout-subject-success.html`

Evidence:

- Cookie controls observed repeatedly, sometimes with duplicate consent headings.

Impact:

- Repeated consent UI can distract from primary tasks.

Recommendation:

- Define one consistent cookie consent pattern and persistence behavior.

## Redesign Implications

The redesign should not treat this as a pure visual refresh. The current website needs structural cleanup before visual design:

1. Clarify user states and navigation.
2. Remove template/content mismatches.
3. Separate profile, registration, finance, and payment responsibilities.
4. Define payment and credit transfer state models.
5. Create reusable components for catalog, forms, tables, status, documents, and transactional feedback.

## Recommended Next Audit Step

Create detailed page audits for the highest-risk flows:

1. Finance and Payment
2. Registration
3. Credit Transfer
4. Login/Register
5. Program/Subject Discovery

