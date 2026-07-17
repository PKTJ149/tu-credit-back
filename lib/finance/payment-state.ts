export type PaymentState =
  | "no-payable-items"
  | "payment-required"
  | "notice-submitted"
  | "pending-verification"
  | "payment-confirmed"
  | "payment-rejected"
  | "payment-cancelled"
  | "payment-refunded";

export type PaymentStateTone =
  | "neutral"
  | "urgent"
  | "positive"
  | "corrective"
  | "administrative";

type PaymentStateInfo = {
  label: string;
  tone: PaymentStateTone;
};

export const paymentStateInfo: Record<PaymentState, PaymentStateInfo> = {
  "no-payable-items": { label: "ไม่มีรายการค้างชำระ", tone: "neutral" },
  "payment-required": { label: "ต้องชำระเงิน", tone: "urgent" },
  "notice-submitted": { label: "ส่งหลักฐานการชำระแล้ว", tone: "positive" },
  "pending-verification": { label: "รอการตรวจสอบ", tone: "neutral" },
  "payment-confirmed": { label: "ยืนยันการชำระแล้ว", tone: "positive" },
  "payment-rejected": { label: "ต้องดำเนินการแก้ไข", tone: "corrective" },
  "payment-cancelled": { label: "ยกเลิกรายการชำระ", tone: "neutral" },
  "payment-refunded": { label: "คืนเงินแล้ว", tone: "administrative" },
};

export const paymentStateToneClasses: Record<
  PaymentStateTone,
  { badgeBg: string; badgeText: string; panelBg: string; panelBorder: string; icon: string }
> = {
  neutral: {
    badgeBg: "bg-[color:color-mix(in_oklch,var(--muted)_60%,white)]",
    badgeText: "text-[var(--foreground)]",
    panelBg: "bg-[var(--background)]",
    panelBorder: "border-[color:var(--border)]",
    icon: "text-[var(--ink-muted)]",
  },
  urgent: {
    badgeBg: "bg-[color:color-mix(in_oklch,var(--primary)_16%,white)]",
    badgeText: "text-[var(--primary)]",
    panelBg: "bg-[color:color-mix(in_oklch,var(--primary)_6%,white)]",
    panelBorder: "border-[color:color-mix(in_oklch,var(--primary)_28%,white)]",
    icon: "text-[var(--primary)]",
  },
  positive: {
    badgeBg: "bg-[color:color-mix(in_oklch,var(--secondary)_45%,white)]",
    badgeText: "text-[var(--secondary-foreground)]",
    panelBg: "bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)]",
    panelBorder: "border-[color:color-mix(in_oklch,var(--secondary)_45%,white)]",
    icon: "text-[var(--primary)]",
  },
  corrective: {
    badgeBg: "bg-[color:color-mix(in_oklch,var(--destructive)_16%,white)]",
    badgeText: "text-[var(--destructive)]",
    panelBg: "bg-[color:color-mix(in_oklch,var(--destructive)_6%,white)]",
    panelBorder: "border-[color:color-mix(in_oklch,var(--destructive)_30%,white)]",
    icon: "text-[var(--destructive)]",
  },
  administrative: {
    badgeBg: "bg-[color:color-mix(in_oklch,var(--muted)_70%,white)]",
    badgeText: "text-[var(--ink-subtle)]",
    panelBg: "bg-[var(--background)]",
    panelBorder: "border-[color:var(--border)]",
    icon: "text-[var(--ink-subtle)]",
  },
};

export type PayableItem = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  state: PaymentState;
  dueDate?: string;
};

export function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}
