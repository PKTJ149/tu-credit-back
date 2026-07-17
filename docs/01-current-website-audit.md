# CREDIT BANK Current Website Audit

## Audit Context

Source website:

- https://creditbank.mcu.ac.th/finance.html

Audit started:

- 2026-07-18 Asia/Bangkok

Method:

- Read-only browser inspection of the existing website.
- Initial first-pass inventory from visible navigation, headings, links, forms, and page content.
- This is an initial audit, not yet a full UX review.

## Known Website Areas

### Public Navigation

Observed public navigation items:

- Home: `index.html`
- Programs: `program.html`
- Subjects: `subject.html`
- About: `about-us.html`
- Manual: `manual.html`
- News: `news.html`
- Login/Register: `login.html`

### Member Navigation

Observed member/account navigation items:

- Profile: `profile.html`
- Learning Objectives: `learning-objectives.html`
- Finance: `finance.html`
- Registration: `registration.html`
- Payment Notice: `checkout-subject-success.html`
- Credit Transfer: `credit-transfer.html`
- Change Password: `change-password.html`
- Settings: `setting.html`

## Initial Page Inventory

| Page | URL | Observed Purpose | Initial Notes |
|---|---|---|---|
| Home | `/index.html` | Introduces CREDIT BANK, highlights new programs, news, statistics, and registration CTA. | Public entry point. Includes login/register CTA and duplicated cookie consent UI. |
| Programs | `/program.html` | Lists available programs with filters and pagination. | Large catalog. Needs strong filtering, comparison, and detail-page pathway. |
| Subjects | `/subject.html` | Lists subjects/courses. | Needs deeper inspection for filters, cards, registration path, and detail structure. |
| About | `/about-us.html` | Explains organization/system context. | Public trust and institutional credibility page. |
| Manual | `/manual.html` | Provides usage guidance. | Important for reducing support burden. Needs review for clarity and task-based structure. |
| News | `/news.html` | Lists announcements/news. | Public communication flow. Needs detail-state review. |
| Login | `/login.html` | Allows users to access or register account. | Authentication/onboarding flow starts here. Needs full form/state audit. |
| Profile | `/profile.html` | Member profile and personal information. | Authenticated area. Needs review for editable fields and required information. |
| Learning Objectives | `/learning-objectives.html` | Member learning goals/objectives. | Likely connected to learning progress and selected subjects. |
| Finance | `/finance.html` | Shows personal info, registered subjects, unpaid balance, paid amount, receipts, invoices, and payment notice links. | Critical transactional flow. Needs redesign for clarity and trust. |
| Registration | `/registration.html` | Shows registration-related information. | Needs full path review with subject/program flow. |
| Payment Notice | `/checkout-subject-success.html` | Payment notification / registration success path. | The current page title says registration success. Relationship to payment notice needs clarification. |
| Credit Transfer | `/credit-transfer.html` | Supports credit transfer in/out requests, document upload, request history, and email preview. | Complex form flow. Needs careful redesign and state mapping. |
| Change Password | `/change-password.html` | Allows password update. | Security form with current, new, and confirm password fields. |
| Settings | `/setting.html` | Account, notification, privacy, language, and export settings. | Some labels appear unrelated to CREDIT BANK context and need content review. |

## Observed Current Flows

### Flow 1: Public Discovery to Registration/Login

Observed path:

1. User lands on Home.
2. User browses Programs, Subjects, About, Manual, or News.
3. User selects Login/Register or a program/subject detail.
4. User proceeds toward account access or registration.

Known pages:

- `index.html`
- `program.html`
- `program_detail.html?id=...`
- `subject.html`
- `login.html`
- `register.html`

Open questions:

- What is the intended difference between program registration and subject registration?
- Should users be able to browse all details before login?
- Which CTA should be primary on public pages: register, login, browse programs, or browse subjects?

### Flow 2: Course/Program Discovery

Observed path:

1. User opens Programs.
2. User filters/browses paginated program list.
3. User opens Program Detail.
4. User may proceed toward registration or related subjects.

Known pages:

- `program.html`
- `program_detail.html?id=...`
- `subject.html`
- likely `subject_detail.html` or equivalent, pending verification

Initial UX risks:

- Program catalog appears dense.
- Filter controls and pagination may need clearer hierarchy.
- Repeated program names and long Thai titles may need stronger card layout rules.

### Flow 3: Member Profile and Account Management

Observed path:

1. User accesses Profile.
2. User reviews or edits personal information.
3. User may change password or update settings.

Known pages:

- `profile.html`
- `change-password.html`
- `setting.html`

Initial UX risks:

- Account, profile, setting, and password pages may have overlapping navigation.
- Some page titles/content appear inconsistent with CREDIT BANK context.

### Flow 4: Learning and Registration

Observed path:

1. User accesses learning objectives or registration.
2. User reviews enrolled subjects/courses.
3. User manages registration status or learning plan.

Known pages:

- `learning-objectives.html`
- `registration.html`
- `finance.html`

Open questions:

- Is learning objectives a planning tool, progress page, or requirement checklist?
- How does registration connect to payment?
- What are the required states after registration: pending, unpaid, paid, confirmed, rejected?

### Flow 5: Finance and Payment

Observed path:

1. User opens Finance.
2. User reviews personal information and subjects registered in the current term.
3. User sees financial summary: unpaid amount, paid amount, total amount.
4. User reviews registered programs/subjects.
5. User reviews payment history.
6. User opens receipt, invoice, or payment notice.

Known pages:

- `finance.html`
- `checkout-subject-success.html`

Observed components:

- Personal information form
- Registered subject list
- Summary metric cards
- Payment history table/list
- Receipt buttons
- Invoice buttons
- Payment notice links

Initial UX risks:

- Finance combines profile, registration, summary, payment history, and documents in one page.
- The payment notice page title appears to be "Registration Success", which may confuse users.
- Payment status and next required action should be much clearer.

### Flow 6: Credit Transfer

Observed path:

1. User opens Credit Transfer.
2. User chooses transfer in or transfer out.
3. User fills request details.
4. User uploads evidence/document.
5. User submits request and views email preview.
6. User reviews request history.

Known page:

- `credit-transfer.html`

Observed forms:

- Transfer-in request form with source institution, subject/course, detail, and file upload.
- Transfer-out request form with selectable completed subjects, destination institution, destination type, and extra detail.

Initial UX risks:

- This is a high-complexity flow and needs step-by-step structure.
- Transfer in and transfer out should be clearly separated.
- Evidence requirements and request status should be explicit.
- Email preview may not be the right primary feedback for users.

## Initial Component Inventory

Components likely required for the redesign:

- Global header
- Public navigation
- Member sidebar navigation
- Breadcrumbs
- Hero/intro section
- Program card
- Subject card
- Filter panel
- Search input
- Pagination
- Status badge
- Summary metric card
- Data table
- Course/subject list item
- Profile form
- Password form
- Settings toggle
- Payment summary
- Payment history row
- Receipt/invoice action button
- Payment notice CTA
- File upload field
- Stepper
- Confirmation modal
- Empty state
- Error state
- Success state
- Cookie consent banner/modal

## Initial Redesign Priorities

### Priority 1: Public Discovery Flow

Reason:

- Sets first impression and institutional trust.
- Drives users toward registration/login.
- Establishes the visual direction for the whole redesign.

### Priority 2: Authentication and Onboarding Flow

Reason:

- Users cannot access transactional flows without account access.
- Login/register/profile completeness affects every later flow.

### Priority 3: Learning and Registration Flow

Reason:

- Core product value depends on users understanding what they can learn and register for.

### Priority 4: Finance and Payment Flow

Reason:

- High trust requirement.
- Users need clear status, outstanding amount, payment proof, receipt, and invoice handling.

### Priority 5: Credit Transfer Flow

Reason:

- Complex but specialized.
- Needs clear evidence, status, and submission feedback.

### Priority 6: Settings and Account Maintenance

Reason:

- Necessary, but should follow after core flows and information architecture are stable.

## Immediate Next Steps

1. Complete full page inventory for all linked detail pages.
2. Capture screenshots of each key page and important state.
3. Map current flows visually.
4. Identify UX issues by severity.
5. Define future sitemap and flow priority.
6. Define component direction before designing screens.

## Notes and Assumptions

- The website appears to include both public pages and a member/authenticated area.
- Some authenticated pages are currently visible in the browser session and include sample user data.
- Current labels, titles, and page purposes need stakeholder confirmation before final redesign.
- This audit is a first pass and should be expanded before visual redesign begins.

