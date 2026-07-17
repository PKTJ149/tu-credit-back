# Public Discovery Screen Spec v1

## Purpose

This document defines the first-pass screen specification for the CREDIT BANK public discovery redesign.

It is intended to support:

- UI design
- prototype creation
- future frontend implementation

## Screen Set

### 1. Home

Primary job:

- Explain CREDIT BANK and guide the visitor into the right next path.

Required content:

- Value proposition
- Institutional trust content
- Featured programs or subjects
- Primary browse and auth CTAs

Required states:

- Default
- Returning visitor emphasis

Primary CTA:

- Browse programs
- Browse subjects

### 2. Programs

Primary job:

- Help visitors browse and compare programs.

Required content:

- Search/filter
- Program cards
- Key comparison data

Required states:

- Default
- Filtered results
- No results

Primary CTA:

- View program detail

### 3. Program Detail

Primary job:

- Help visitors evaluate a program and know what to do next.

Required content:

- Program overview
- Credits
- Requirements
- Outcomes
- Related subjects
- Primary CTA

Required states:

- Default
- Register/login required to continue

Primary CTA:

- Register
- Sign in

### 4. Subjects

Primary job:

- Help visitors browse subjects independently from program flow.

Required content:

- Search/filter
- Subject cards or rows
- Key subject metadata

Required states:

- Default
- Filtered results
- No results

Primary CTA:

- View subject detail

### 5. Subject Detail

Primary job:

- Help visitors understand a subject before taking action.

Required content:

- Subject overview
- Credits
- Eligibility
- Related program context
- Primary CTA

Required states:

- Default
- Register/login required to continue

Primary CTA:

- Register
- Sign in

### 6. Help Center

Primary job:

- Help visitors solve common questions quickly.

Required content:

- Help categories
- Task-based articles
- Search if supported

Required states:

- Default
- Search result
- No results

Primary CTA:

- View help content

### 7. About CREDIT BANK

Primary job:

- Build credibility and explain institutional context.

Required content:

- Institutional overview
- Why the system exists
- Trust/governance content

Required states:

- Default

Primary CTA:

- Browse offerings

### 8. News and News Detail

Primary job:

- Show verified announcements without pulling users away from the main journey.

Required content:

- News list
- News detail
- Related updates

Required states:

- News available
- No news available

Primary CTA:

- Return to browse journey

## Shared Content Rules

- Public content must use CREDIT BANK-specific language only.
- Trust content must be real and institutionally accurate.
- Browsing content should support decision-making before auth.

## Shared UI Rules

- Use public header variant only.
- Keep auth CTAs available but not overwhelming.
- Program/subject cards should surface the fields needed for decision-making, not decorative clutter.
- Help content should be organized by task, not by long static manual sections.

## Gating Rules

- Browsing should stay available without auth.
- Committing to registration should route into auth when needed.
- Public screens must preserve item context if they hand off to login/register.

## Next Use

Use this spec to create:

- low-fidelity public IA wireframes
- high-fidelity public website screens
- prototype links for stakeholder review

