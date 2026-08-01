import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TransferType } from "@/lib/credit-transfer/transfer-state";

/**
 * Direction is the first thing an officer needs to read off a case, but it is
 * not a state — it never changes. It gets an icon + label pairing, not a
 * status colour, so it stays legible without borrowing the state vocabulary
 * `StatusBadge` already owns.
 */
export const transferDirectionLabel: Record<TransferType, string> = {
  in: "โอนเข้า",
  out: "โอนออก",
};

export function TransferDirectionBadge({ type, className }: { type: TransferType; className?: string }) {
  const Icon = type === "in" ? ArrowDownToLine : ArrowUpFromLine;
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-[var(--foreground)]",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {transferDirectionLabel[type]}
    </span>
  );
}
