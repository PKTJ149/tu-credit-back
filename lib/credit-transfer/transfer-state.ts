export type TransferState =
  | "draft"
  | "evidence-incomplete"
  | "ready-for-review"
  | "submitted"
  | "under-review"
  | "changes-requested"
  | "approved"
  | "rejected"
  | "withdrawn";

export type TransferStateTone =
  | "neutral"
  | "urgent"
  | "positive"
  | "corrective"
  | "administrative";

type TransferStateInfo = {
  label: string;
  tone: TransferStateTone;
};

export const transferStateInfo: Record<TransferState, TransferStateInfo> = {
  draft: { label: "ร่างคำขอ", tone: "neutral" },
  "evidence-incomplete": { label: "ขาดหลักฐานประกอบ", tone: "urgent" },
  "ready-for-review": { label: "พร้อมส่งตรวจสอบ", tone: "neutral" },
  submitted: { label: "ส่งคำขอแล้ว", tone: "positive" },
  "under-review": { label: "อยู่ระหว่างตรวจสอบ", tone: "neutral" },
  "changes-requested": { label: "ต้องแก้ไขข้อมูล", tone: "corrective" },
  approved: { label: "อนุมัติแล้ว", tone: "positive" },
  rejected: { label: "ไม่อนุมัติ", tone: "corrective" },
  withdrawn: { label: "ถอนคำขอแล้ว", tone: "administrative" },
};

export const transferStateToneClasses: Record<
  TransferStateTone,
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

export type TransferType = "in" | "out";

export type TransferRequest = {
  id: string;
  type: TransferType;
  title: string;
  submittedDate: string;
  state: TransferState;
};

export const stepperSteps = ["ประเภท", "รายละเอียด", "หลักฐาน", "ตรวจทาน", "ส่งคำขอแล้ว"] as const;
