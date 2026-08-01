"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Move-up / move-down for any ordered list.
 *
 * Four screens — banners, featured programs, help articles, taxonomy terms —
 * each hand-rolled this same pair, and all four landed on `size="icon-xs"`:
 * 24px targets stacked with no gap between them. That is the WCAG 2.5.8 floor
 * exactly, and it violates this project's own 32px rule; worse, two adjacent
 * 24px targets that do *opposite* things means a mis-tap reorders the list the
 * wrong way. Consolidating puts the size decision in one place.
 *
 * The buttons sit side by side rather than stacked. Stacking reads as a spinner
 * — two halves of one control — when these are two separate destinations, and
 * side-by-side gives each its own 32px box without doubling the row height.
 */
export function ReorderControls({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  /** Names the thing being moved, for the screen-reader label. */
  itemLabel,
  /** Shown before the buttons when the list exposes a position number. */
  position,
  className,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  itemLabel: string;
  position?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {position !== undefined ? (
        <span className="me-1 font-mono text-xs tabular-nums text-[var(--ink-subtle)]">{position}</span>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={!canMoveUp}
        onClick={onMoveUp}
        aria-label={`เลื่อน “${itemLabel}” ขึ้น`}
      >
        <ArrowUp className="size-3.5" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={!canMoveDown}
        onClick={onMoveDown}
        aria-label={`เลื่อน “${itemLabel}” ลง`}
      >
        <ArrowDown className="size-3.5" aria-hidden />
      </Button>
    </div>
  );
}
