# Design Decision Record

## Decision

Adopt the user-created Shadcn Studio theme as the visual baseline for the website redesign implementation phase.

## Date

2026-07-17

## Status

Accepted

## Context

The redesign planning work is complete enough to begin real UI design. The user created a custom theme in Shadcn Studio and asked that it become the working visual foundation for the next phase.

The active theme observed in the browser was labeled `Tu Credit Bank`.

## Observed Theme Configuration

- Theme name: `Tu Credit Bank`
- Style preset: `Rhea`
- Icon library: `Lucide`
- Menu color mode: `Default / Solid`
- Menu accent mode: `Subtle`
- Color format in CSS export: `OKLCH`

## Export Paths Confirmed

### Theme Registry Install

Use the theme registry export shape, but keep account-specific query params out of repo documentation:

```bash
pnpm dlx shadcn@latest init "https://shadcnstudio.com/r/themes/tu-credit-bank.json?[REDACTED_PRIVATE_QUERY]" --base base
```

### Component Registry Install

```bash
pnpm dlx shadcn@latest init "https://shadcnstudio.com/r/components.json?style=rhea&iconLibrary=lucide&menuColor=default&menuAccent=subtle" --base base
```

## CSS Baseline Summary

The browser export for `app/globals.css` confirmed these baseline decisions:

- warm neutral background system
- muted gold secondary family
- warm red-orange primary family
- larger default radius: `0.875rem`
- soft, low-elevation shadow scale
- light and dark themes both defined
- sidebar tokens already included

## Key Tokens

### Light

- `--background: oklch(1 0 0)`
- `--foreground: oklch(0.147 0.004 49.3)`
- `--primary: oklch(0.39 0.16 29.23)`
- `--primary-foreground: oklch(0.971 0.013 17.38)`
- `--secondary: oklch(0.89 0.06 80.84)`
- `--accent: oklch(0.96 0.01 17.52)`
- `--border: oklch(0.92 0 0)`
- `--ring: oklch(0.86 0.18 88.48)`
- `--radius: 0.875rem`

### Dark

- `--background: oklch(0.147 0.004 49.3)`
- `--foreground: oklch(0.986 0.002 67.8)`
- `--primary: oklch(0.444 0.177 26.899)`
- `--secondary: oklch(0.274 0.006 286.033)`
- `--accent: oklch(0.268 0.011 36.5)`
- `--border: oklch(1 0 0 / 10%)`
- `--ring: oklch(0.547 0.021 43.1)`

## Implementation Guidance

- Treat this theme as the first implementation baseline, not the final immutable brand system.
- Apply these tokens first to the initial redesign flow before making local component-level exceptions.
- Keep `app/globals.css` merge-based, not full-file replacement, when integrating into an existing app.
- Reuse the exported component registry settings for consistency across new screens.
- Any later palette shift should update this record and the downstream screen specs together.

## Consequences

- Positive:
  - Removes ambiguity before redesign starts
  - Gives implementation a concrete token system now
  - Aligns future components with one shared baseline

- Negative:
  - The theme was generated outside the app codebase, so implementation still needs token integration work
  - Some flow-specific UI may still need custom tuning for institutional credibility and accessibility

- Follow-up needed:
  - Create a local theme reference file or design token mapping when the implementation repo is scaffolded
  - Apply this baseline to the first real redesigned flow
