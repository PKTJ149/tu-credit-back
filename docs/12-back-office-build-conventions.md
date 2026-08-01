# Back Office Build Conventions

Binding rules for every `/admin` screen. Phase 0 built the shell and the shared
patterns; every later phase consumes them rather than inventing its own. If a
screen needs something not listed here, it is a gap in the shared layer — say
so rather than solving it locally.

## Non-negotiables

1. **Never import from the student-side `components/` tree** (`components/discovery`,
   `components/finance`, `components/learning`, `components/credit-transfer`,
   `components/account`, the `*-page-shell.tsx` files). Anything shared goes
   through `lib/`. This is what keeps the back office extractable into its own
   deployment later.
2. **Never write a colour literal.** No hex, no `oklch(...)`, no `text-red-500`.
   Use the theme tokens: `var(--foreground)`, `var(--ink-muted)`,
   `var(--ink-subtle)`, `var(--border)`, `var(--surface)`, `var(--surface-strong)`,
   `var(--background)`, `var(--primary)`, `var(--destructive)`, `var(--success)`.
3. **Never render a state colour by hand.** Use `StatusBadge` and its
   domain wrappers. A new state means a new entry in the tone map, not an
   inline class.
4. **Never add mock data in a page file.** Everything lives in
   `lib/admin/mock-data.ts`. If a screen needs a record that does not exist,
   add it there so every other screen sees the same world.
5. **Never call `new Date()` or `Date.now()`.** The prototype must render
   identically on every machine and in every screenshot. Use the fixed
   `TODAY` constant from `lib/admin/mock-data.ts`.
6. **All user-facing copy is Thai.** All code, comments, identifiers, commit
   messages, and file names are English.

## The shared layer

| Need | Use | From |
|---|---|---|
| Page title, description, breadcrumbs, back link, header actions | `PageHeader` | `@/components/admin/page-header` |
| Any surface/container | `Panel` | `@/components/admin/detail-panel` |
| Label/value pairs on a detail screen | `DetailList` | `@/components/admin/detail-panel` |
| Any table | `DataTable` + `Column<T>` | `@/components/admin/data-table` |
| Loading table | `DataTableSkeleton` | `@/components/admin/data-table` |
| Search + filters above a table | `TableToolbar`, `ALL_FILTER_VALUE` | `@/components/admin/table-toolbar` |
| Nothing to show | `EmptyState` | `@/components/admin/empty-state` |
| Destructive or consequential action | `ConfirmDialog` | `@/components/admin/confirm-dialog` |
| A status pill | `PaymentStatusBadge`, `TransferStatusBadge`, `RegistrationStatusBadge`, `StatusBadge` | `@/components/admin/status-badge` |
| Buttons, inputs, selects, tabs, dialogs, dropdowns, avatars, checkboxes, textareas, tooltips, sheets, separators, toasts | shadcn primitives | `@/components/ui/*` |
| Money | `formatTHB` | `@/lib/finance/payment-state` |
| Dates | `formatThaiDate`, `formatThaiDateLong`, `daysBetween` | `@/lib/admin/format` |
| Add/remove row list, checklist, field error, error summary | `StringListField`, `MultiSelectList`, `FieldError`, `FormErrorSummary` | `@/components/admin/form-fields` |
| A subject's enrolment | `subjectEnrolment` | `@/lib/admin/mock-academic` |
| Icons | `lucide-react` only |  |

**Never render a raw ISO date.** `2026-07-30` is not a date a Thai officer reads;
`30 ก.ค. 2569` is. Three areas each solved this differently during phase 1-3,
which is how one task showed a date three ways — hence one module.

**Never compute a subject's enrolment locally.** `Subject.enrolledCount` is
unpopulated in the catalogue; `subjectEnrolment` derives it from live
registrations and reports whether the number was derived. Two screens disagreeing
about the same fact is worse than either number alone.

`Panel` never nests inside another `Panel`. If content needs a boundary inside
a panel, use `Separator` or a bordered list, not a second card.

## Data

Everything comes from `lib/admin/mock-data.ts` and `lib/data/*`:

- `students`, `getStudentById`, `getStudentName`
- `payments`, `getPaymentById`, `getPendingPayments`, `getPaymentsByStudent`, `bankAccounts`
- `registrations`, `getRegistrationsByStudent`, `waitlistEntries`
- `transferCases`, `getTransferCaseById`, `getOpenTransferCases`, `partnerInstitutions`
- `staffUsers`, `getStaffById`, `getStaffName`
- `academicTerms`, `currentTerm`, `auditEntries`, `TODAY`
- `programs`, `subjects`, `teachers` from `@/lib/data/*`

Types live in `lib/admin/types.ts`. State machines are **not** redefined —
payment states come from `lib/finance/payment-state`, registration statuses from
`lib/learning/registration-status`, transfer states from
`lib/credit-transfer/transfer-state`.

## Routing

- Every workspace screen goes under `app/admin/(workspace)/`. The group's layout
  supplies the sidebar, top bar, role switcher, and account menu. **Do not
  render your own shell, sidebar, or header.**
- Route paths must match the `href` values already declared in `lib/admin/nav.ts`.
  Adding a route means updating that file, including its `roles`.
- Detail routes are `[id]` segments under their list route, e.g.
  `app/admin/(workspace)/payments/[id]/page.tsx`.
- An unknown id calls `notFound()` from `next/navigation`.

## Interaction model in a prototype

Actions are real in the UI and local in effect: clicking Approve updates client
state and fires a `sonner` toast. Nothing persists across a reload, and no
screen should claim otherwise.

- Mutating screens are client components holding their own `useState` copy of
  the relevant mock rows.
- Every consequential action goes through `ConfirmDialog`. Rejections and
  refunds use its `reason` option with `required: true` — the student sees that
  text, and a rejection with no reason is the exact gap the current payment
  state machine has.
- Feedback is a `sonner` toast: what happened, to which record.

## Design rules

The register is **product**: design serves the task. Earned familiarity beats
novelty. The tool should disappear into the work.

- **Density.** Staff sit with this all day. Table rows `py-2.5`, body `text-sm`,
  labels and metadata `text-xs`. Buttons stay `h-9` (`size="sm"` where tighter).
  Interactive targets never below 32px, and primary form actions stay `h-11`.
- **Row height is the scarce resource.** `DataTable` cells are single-line by
  default. A long value gets `truncate: "max-w-[26ch]"`, never a wrap — one
  wrapped Thai program name costs every row in the table 40px, and a 12-row queue
  then needs three screens. `wrap: true` exists for notes and reasons and should
  stay rare. Measure it: a list row should land near 48px, not 120px.
- **Actions must never require a sideways scroll.** Put row actions in a
  `DropdownMenu` behind a single `MoreHorizontal` trigger rather than two or three
  labelled buttons, and mark the column `stickyEnd: true` so it stays pinned to
  the right edge while the rest of the table scrolls under it. A control an
  officer cannot see is a control they do not have.
- **Keep table labels short.** A cell is not a place to spell out a definition;
  if a label needs the long form, keep a separate `*Long` map for detail screens.
- **Validate on submit, not on blur.** Radix focuses a dialog's first field on
  open and then moves focus, firing a blur nobody caused — validate-on-blur shows
  an error before the officer has typed anything.
- **Type.** One family (IBM Plex Sans Thai). Page title `text-xl font-semibold`,
  panel title `text-sm font-semibold`. No fluid/`clamp()` sizing. `IBM Plex Mono`
  only for reference codes and figures that benefit from tabular rhythm.
- **Colour is restrained.** Primary is for the primary action, the current nav
  item, and status only. Never decoration. Never a full-saturation inactive state.
- **Every interactive element ships all its states**: default, hover, focus-visible,
  active, disabled, and loading where relevant. Focus is
  `focus-visible:ring-[3px] focus-visible:ring-ring/50`.
- **Empty states teach.** Say what puts something here. "ไม่มีข้อมูล" alone is a
  failure. Reaching an empty approval queue is good news and should read that way.
- **Loading is a skeleton**, never a spinner parked in the middle of content.
- **Motion is 150–250ms, state-driven only.** No entrance choreography, no
  decorative animation. Respect `prefers-reduced-motion` (the global rule in
  `globals.css` covers CSS; anything JS-driven needs its own guard).
- **Responsive is structural**: the sidebar collapses into a sheet below `lg`,
  tables scroll inside their own `overflow-x-auto` container (`DataTable` already
  does this), secondary columns take `hideOnMobile`. The page body never scrolls
  horizontally.
- **Accessibility is WCAG 2.2 AA**, not a later pass. Real `<th scope>`, `<dl>`
  for label/value pairs, labels tied to inputs, errors tied via
  `aria-describedby`, `aria-live` on result counts, icons `aria-hidden` when a
  text label sits beside them.

### Banned

Side-stripe accent borders. Gradient text. Decorative blur or glass. Nested
cards. Identical icon+heading+text card grids used as filler. Hero metric
blocks. Tiny uppercase tracked eyebrows above sections. Numbered section
scaffolding. Custom scrollbars or reinvented form controls. Modal as the first
answer — exhaust inline and progressive alternatives first; `ConfirmDialog` is
for consequences, not for editing.

## Definition of done, per screen

- `npx tsc --noEmit` clean, `npx eslint <paths>` clean.
- Renders with data, and renders with an empty/filtered-to-nothing result.
- Keyboard reachable end to end; visible focus on every control.
- No horizontal page scroll at 375px, 768px, 1280px.
- No console errors.
- Copy is Thai, specific, and says what happens next. The learner is
  **ผู้เรียน**, never นักเรียน — the whole product uses the former.
- Row height measured, not eyeballed, and no action column sitting off-screen at
  1280px.
