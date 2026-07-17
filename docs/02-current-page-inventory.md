# Current Page Inventory

## Scope

Source website:

- https://creditbank.mcu.ac.th/

Audit date:

- 2026-07-18 Asia/Bangkok

Method:

- Read-only browser inspection.
- Key pages were opened directly and reviewed through visible structure, headings, forms, links, buttons, and page titles.

## Inventory Summary

| Group | Pages Observed | Audit Status |
|---|---:|---|
| Public discovery | 8 | First pass complete |
| Authentication/onboarding | 2 | First pass complete |
| Member/account | 3 | First pass complete |
| Learning/registration | 3 | First pass complete |
| Finance/payment | 2 | First pass complete |
| Credit transfer | 1 | First pass complete |

## Public Discovery Pages

### Home

- URL: `/index.html`
- Page title: CREDIT BANK system description and MCU branding.
- H1: `CREDIT BANK`
- Main sections observed:
  - New programs
  - News and announcements
  - Overall statistics
  - Registration CTA
- Primary role:
  - Public entry point and trust-building page.
- Notes:
  - Public page shows logged-in user controls such as user name and logout.
  - Cookie consent appears and may duplicate.

### Program List

- URL: `/program.html`
- Page title: `หลักสูตรเรียน - CREDIT BANK`
- H1: `หลักสูตรเรียน`
- Main sections observed:
  - Program filter
  - All programs
  - Pagination
  - CTA section
- Primary role:
  - Help users browse and filter programs.
- Notes:
  - Catalog appears dense and long.
  - Needs stronger filtering, search, comparison, and detail-card hierarchy.

### Program Detail

- URL: `/program_detail.html?id=0`
- Page title: `รายละเอียดหลักสูตร - ครุศาสตรบัณฑิต (สังคมศึกษา)`
- H1: `ครุศาสตรบัณฑิต (สังคมศึกษา)`
- Main controls observed:
  - Save program
  - Share
  - Overview
  - Subjects
  - Reviews/comments
  - Helpful feedback
- Primary role:
  - Help users understand one program before deciding next action.
- Notes:
  - Needs a clear primary CTA: register, view subjects, save, or contact.
  - Tabs/sections should be validated for decision-making order.

### Subject List

- URL: `/subject.html`
- Page title: `รายวิชา - CREDIT BANK`
- H1: `รายวิชา`
- Main sections observed:
  - Subject filter
  - All subjects
  - Pagination
  - CTA section
- Primary role:
  - Help users browse and select subjects.
- Notes:
  - Relationship between subjects and programs must be clarified.
  - Needs stronger distinction between browsing, selecting, and registering.

### About

- URL: `/about-us.html`
- Page title: `เกี่ยวกับเรา - CREDIT BANK`
- H1: `เกี่ยวกับเรา`
- Main sections observed:
  - MCU institutional context
  - CTA section
- Primary role:
  - Build credibility and explain institutional context.
- Notes:
  - Should be reviewed for trust, authority, and user-friendly explanation of CREDIT BANK.

### Manual

- URL: `/manual.html`
- Page title: `คู่มือการใช้งานระบบ - CREDIT BANK`
- H1: `คู่มือการใช้งานระบบ`
- Main sections observed:
  - Table of contents
  - Getting started
  - Registration
  - Profile management
  - Course registration
  - Learning progress
  - CREDIT BANK system
  - Payment
  - Certificates
  - Help
- Primary role:
  - Help users complete tasks and reduce support needs.
- Notes:
  - Strong candidate to restructure into task-based help rather than long documentation only.

### News List

- URL: `/news.html`
- Page title: `ข่าวสารและประชาสัมพันธ์ - CREDIT BANK`
- H1: `ข่าวสารและประชาสัมพันธ์`
- Main sections observed:
  - News filter
  - Grid/list toggle
  - Pagination
- Primary role:
  - Public announcements and updates.
- Notes:
  - Useful but likely lower priority than registration/payment flows.

### News Detail

- URL: `/news-detail.html`
- Page title: `ข่าวประชาสัมพันธ์ - กองทุนสำรองเลี้ยงชีพ`
- H1: `ประกาศปรับปรุงอัตราผลตอบแทนกองทุนสำรองเลี้ยงชีพ ประจำปี 2567`
- Main sections observed:
  - Article detail
  - Social share
  - Related news
- Primary role:
  - Detail page for one announcement.
- Notes:
  - Critical content mismatch: page title and article content reference a provident fund, not CREDIT BANK.
  - This likely indicates reused template content.

## Authentication and Onboarding Pages

### Login

- URL: `/login.html`
- Page title: `เข้าสู่ระบบ - CREDIT BANK`
- H2: `เข้าสู่ระบบ CREDIT BANK`
- Form fields observed:
  - Email or national ID
  - Password
  - Remember me
- Other control observed:
  - Login with Google
- Notes:
  - No H1 observed.
  - Login page still shows logged-in user controls in global navigation.
  - Form method appears as `get`, which is inappropriate for real credential submission if this becomes production behavior.

### Register

- URL: `/register.html`
- Page title: `สมัครใช้งาน - CREDIT BANK`
- H1: `ลงทะเบียนใช้งานระบบ CREDIT BANK`
- Form action observed:
  - `/register-thank-you.html`
- Form fields observed:
  - First name
  - Last name
  - Phone
  - Email
  - Password
  - Confirm password
  - Terms acceptance
- Notes:
  - Good starting field set for basic onboarding.
  - Needs clear account verification, consent, validation, and post-registration state.

## Member and Account Pages

### Profile

- URL: `/profile.html`
- Page title: `โปรไฟล์นิสิต - CREDIT BANK`
- H1: `โปรไฟล์นิสิต`
- Main sections observed:
  - Personal information
  - Education information
  - Education history
- Form observed:
  - Personal details fields, but several labels/names are missing in extracted structure.
- Notes:
  - Profile completeness and identity fields should be clarified.
  - Missing labels may create accessibility and maintainability issues.

### Change Password

- URL: `/change-password.html`
- Page title: `เปลี่ยนรหัสผ่าน - กองทุนสำรองเลี้ยงชีพ`
- H1: `เปลี่ยนรหัสผ่าน`
- Form fields observed:
  - Current password
  - New password
  - Confirm new password
- Notes:
  - Page title has provident-fund mismatch.
  - Form method appears as `get`, which is inappropriate for password updates if this becomes production behavior.

### Settings

- URL: `/setting.html`
- Page title: `การตั้งค่า - กองทุนสำรองเลี้ยงชีพ`
- H1: `การตั้งค่า`
- Main sections observed:
  - Account settings
  - Notifications
  - Privacy
  - System settings
- Controls observed:
  - Export
  - Cancel
  - Save settings
- Notes:
  - Page title has provident-fund mismatch.
  - Need to confirm whether notification/privacy/export settings are real requirements or placeholder content.

## Learning, Registration, Finance, and Payment Pages

### Learning Objectives

- URL: `/learning-objectives.html`
- Page title: `ทะเบียนเรียน - CREDIT BANK`
- H1: `เป้าหมายการเรียนรู้`
- Main sections observed:
  - Your goals
  - Progress by subject category
  - Recommended programs
  - Learning path
  - Career outcomes
  - Labor market analysis
- Notes:
  - Promising high-value planning page.
  - Needs clarification: is this a real product feature, a dashboard, or a recommendation concept?

### Registration

- URL: `/registration.html`
- Page title: `ทะเบียนเรียน - CREDIT BANK`
- H1: `ทะเบียนเรียน`
- Main sections observed:
  - Personal information
  - Subjects registered this term
  - Financial information
  - Learning summary
- Notes:
  - Registration combines personal profile, enrolled subjects, finance, and learning summary.
  - This overlaps heavily with Finance and Profile.

### Finance

- URL: `/finance.html`
- Page title: `โปรไฟล์นิสิต - CREDIT BANK`
- H1: `ข้อมูลการเงิน`
- Main sections observed:
  - Personal information
  - Subjects registered this term
  - Financial information
  - Full registration list
- Controls observed:
  - Edit information
  - Save information
  - Cancel
  - Clear filters
  - Receipt
  - Invoice
- Notes:
  - Page title says profile while page H1 says finance.
  - Finance includes profile editing, registration data, payment summary, receipts, and invoices in one place.
  - Needs separation between "what I owe", "what I paid", "what action is next", and "documents".

### Checkout / Payment Notice

- URL: `/checkout-subject-success.html`
- Page title: `ลงทะเบียนสำเร็จ - CREDIT BANK`
- H1: `ลงทะเบียนสำเร็จ!`
- Main sections observed:
  - Registration summary
  - University bank account
  - Transfer payment notice
- Primary control observed:
  - Submit payment notice
- Notes:
  - This is both a registration-success page and payment-notice page.
  - Naming should be clarified because users may arrive here from registration or finance.
  - Payment status states are not yet clear.

## Credit Transfer Page

### Credit Transfer

- URL: `/credit-transfer.html`
- Page title: `ระบบเทียบโอนหน่วยกิต - CREDIT BANK`
- H1: `ระบบเทียบโอนหน่วยกิต`
- Main sections observed:
  - Transfer-in request
  - Transfer-out request
  - Email preview
  - Request history
- Transfer-in fields observed:
  - Select input
  - Source institution
  - Subject/course name
  - Request detail
  - File upload
- Transfer-out fields observed:
  - Completed subject checkboxes
  - Destination institution
  - Destination type
  - Additional detail
- Notes:
  - This is a complex task and should become a step-by-step flow.
  - Transfer-in and transfer-out should likely be separated visually and behaviorally.
  - Request status, evidence requirements, and post-submit confirmation need much clearer handling.

## Global Observations

### Observed Facts

- Public and member navigation are both visible on many pages.
- User controls such as user name and logout appear even on public pages and login/register pages.
- Some pages contain CREDIT BANK branding while other page titles/content refer to a provident fund.
- Several forms appear with `get` method, including sensitive flows such as login and password change.
- Profile, registration, and finance pages repeat personal information blocks.

### Assumptions To Verify

- The current website may be a static prototype or older mock implementation.
- The logged-in user state may be hardcoded or sample data.
- Some provident-fund content may be placeholder/template residue.
- Some form methods may not reflect actual backend behavior.

### Immediate Audit Risks

- Users may not understand whether they are logged in or browsing public content.
- Users may lose trust when unrelated provident-fund content appears.
- Transactional pages mix too many unrelated tasks into one screen.
- Sensitive flows need clear security and validation treatment before implementation.

