/**
 * The one place the back office decides what a state looks like.
 *
 * Screens pass a domain state, never a colour. Three different state machines
 * (payment, registration, credit transfer) collapse into six visual tones, so
 * an officer learns the vocabulary once and it holds across every table.
 *
 * Tone meanings, in the order an officer cares about them:
 *   action    — you have to do something with this, now
 *   pending   — someone else owes the next move
 *   positive  — finished, nothing owed
 *   critical  — went wrong, or was refused
 *   neutral   — closed, archived, or not applicable
 */

import { cn } from "@/lib/utils";
import { paymentStateInfo, type PaymentState } from "@/lib/finance/payment-state";
import { registrationStatusInfo, type RegistrationStatus } from "@/lib/learning/registration-status";
import { transferStateInfo, type TransferState } from "@/lib/credit-transfer/transfer-state";

export type StatusTone = "neutral" | "pending" | "action" | "positive" | "critical";

/* Contrast note: every pairing below puts ink at OKLCH L ≤ 0.42 on a tint at
   L ≥ 0.93, which clears 4.5:1 — the bar for the 12px text a badge uses. */
const toneClasses: Record<StatusTone, string> = {
  neutral:
    "bg-[color:color-mix(in_oklch,var(--muted)_70%,white)] text-[var(--ink-muted)] ring-[color:color-mix(in_oklch,var(--border)_100%,transparent)]",
  pending:
    "bg-[color:color-mix(in_oklch,var(--secondary)_38%,white)] text-[var(--secondary-foreground)] ring-[color:color-mix(in_oklch,var(--secondary)_62%,white)]",
  action:
    "bg-[color:color-mix(in_oklch,var(--primary)_11%,white)] text-[var(--primary)] ring-[color:color-mix(in_oklch,var(--primary)_26%,white)]",
  positive:
    "bg-[color:color-mix(in_oklch,var(--success)_13%,white)] text-[var(--success-ink)] ring-[color:color-mix(in_oklch,var(--success)_28%,white)]",
  critical:
    "bg-[color:color-mix(in_oklch,var(--destructive)_11%,white)] text-[color:color-mix(in_oklch,var(--destructive)_72%,black)] ring-[color:color-mix(in_oklch,var(--destructive)_26%,white)]",
};

export const paymentStateTone: Record<PaymentState, StatusTone> = {
  "no-payable-items": "neutral",
  "payment-required": "pending",
  "notice-submitted": "action",
  "pending-verification": "action",
  "payment-confirmed": "positive",
  "payment-rejected": "critical",
  "payment-cancelled": "neutral",
  "payment-refunded": "neutral",
};

export const transferStateTone: Record<TransferState, StatusTone> = {
  draft: "neutral",
  "evidence-incomplete": "critical",
  "ready-for-review": "pending",
  submitted: "action",
  "under-review": "action",
  "changes-requested": "critical",
  approved: "positive",
  rejected: "critical",
  withdrawn: "neutral",
};

export const registrationStatusTone: Record<RegistrationStatus, StatusTone> = {
  "awaiting-payment": "pending",
  active: "positive",
  completed: "neutral",
  cancelled: "neutral",
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  className?: string;
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function PaymentStatusBadge({ state, className }: { state: PaymentState; className?: string }) {
  return <StatusBadge label={paymentStateInfo[state].label} tone={paymentStateTone[state]} className={className} />;
}

export function TransferStatusBadge({ state, className }: { state: TransferState; className?: string }) {
  return <StatusBadge label={transferStateInfo[state].label} tone={transferStateTone[state]} className={className} />;
}

export function RegistrationStatusBadge({
  status,
  className,
}: {
  status: RegistrationStatus;
  className?: string;
}) {
  return (
    <StatusBadge
      label={registrationStatusInfo[status].label}
      tone={registrationStatusTone[status]}
      className={className}
    />
  );
}
