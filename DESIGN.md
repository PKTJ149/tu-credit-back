# Design System

## Product Register

product

## Visual Direction

Thammasat University Credit Bank uses a restrained product UI direction: official, calm, and supportive. The interface should feel like a trusted university system that has been modernized for task completion, not like a marketing landing page.

## Color

The active implementation uses OKLCH tokens exported from the Shadcn Studio `Tu Credit Bank` theme.

- Primary action: warm institutional red-orange
- Secondary surface: muted gold used sparingly for guidance and status
- Base surface: neutral white and near-white
- Text: high-contrast warm ink
- Error: destructive red from theme tokens

Primary color should be reserved for current step indicators, primary actions, and important status marks. Secondary gold should support context panels and gentle guidance, not decorate every section.

## Typography

Use `IBM Plex Sans Thai` as the main interface typeface with fixed product UI sizes. Do not use fluid typography for task surfaces. Labels, buttons, body copy, and headings should remain compact and readable.

Use `IBM Plex Mono` only where numeric or code-like data benefits from tabular rhythm.

## Layout

Auth and onboarding pages use a product workspace pattern:

- persistent institutional top bar
- compact progress indicator
- contextual support rail
- primary task panel
- responsive collapse to single-column on smaller screens

Avoid oversized hero treatments on protected or task-oriented surfaces.

## Components

Core UI patterns:

- primary buttons: solid primary, minimum 44px touch target
- secondary buttons: bordered neutral surface
- text links: primary color, no extra decoration
- form controls: explicit labels, visible focus ring, inline validation
- status panels: tinted full-surface panel with clear icon/status
- support rail: secondary guidance only, never the main interaction

## Motion

Motion should be subtle and state-driven. Use short transitions for hover, focus, active, loading, and panel affordances. Respect reduced-motion preferences.

## Accessibility

Target WCAG 2.2 AA. All text must remain readable on tinted surfaces, focus states must be visible, and form errors must be connected to the affected controls where practical.
