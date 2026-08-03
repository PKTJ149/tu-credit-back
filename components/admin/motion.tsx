"use client";

/**
 * Back office motion primitives.
 *
 * A third piece — an AnimatedNumber that transitioned when its value moved —
 * was written and then removed: every dashboard here is static, computed once
 * from the mock data, so no number on them ever changes. It would have been
 * either dead code or a count that ticks up on load, which reports nothing.
 * It belongs on the filterable list screens, where a result count really does
 * move as you type.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* Stagger is capped: past ~8 items the last one arrives late enough to read as
   a loading delay rather than a reveal, which is the opposite of the point. */
const STAGGER_MS = 45;
const MAX_STAGGERED = 8;

/**
 * Staggered entry for a group of siblings.
 *
 * The resting style is the visible one; `@starting-style` in globals.css
 * supplies the transient offset. That ordering matters — a reveal built the
 * other way round (hidden by default, shown by a class) ships a blank panel
 * anywhere transitions do not run, and hidden tabs and headless renderers are
 * exactly where that happens.
 */
export function Reveal({
  index = 0,
  as: Tag = "div",
  className,
  children,
}: {
  index?: number;
  as?: "div" | "li" | "section";
  className?: string;
  children: ReactNode;
}) {
  const delay = Math.min(index, MAX_STAGGERED) * STAGGER_MS;
  return (
    <Tag
      className={cn("admin-reveal", className)}
      style={{ "--admin-reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * A single-value proportion bar.
 *
 * Grows from zero on first paint so the fill is read as a share of the whole,
 * and morphs when the value moves. Driven by `scaleX` rather than `width` —
 * width would reflow on every frame.
 */
export function ProportionBar({
  percent,
  label,
  className,
  tone = "success",
}: {
  percent: number;
  /** Required: the bar is a graphic, and a graphic needs a name. */
  label: string;
  className?: string;
  tone?: "success" | "primary";
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-strong)]",
        className,
      )}
    >
      <div
        className={cn(
          "admin-bar-fill h-full w-full rounded-full",
          tone === "success" ? "bg-[var(--success)]" : "bg-[var(--primary)]",
        )}
        style={{ "--admin-bar-scale": clamped / 100 } as React.CSSProperties}
      />
    </div>
  );
}
