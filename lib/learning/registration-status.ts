export type RegistrationStatus = "awaiting-payment" | "active" | "completed";

type RegistrationStatusInfo = {
  label: string;
  badgeBg: string;
  badgeText: string;
};

export const registrationStatusInfo: Record<RegistrationStatus, RegistrationStatusInfo> = {
  "awaiting-payment": {
    label: "รอการชำระเงิน",
    badgeBg: "bg-[color:color-mix(in_oklch,var(--primary)_16%,white)]",
    badgeText: "text-[var(--primary)]",
  },
  active: {
    label: "กำลังเรียน",
    badgeBg: "bg-[color:color-mix(in_oklch,var(--secondary)_45%,white)]",
    badgeText: "text-[var(--secondary-foreground)]",
  },
  completed: {
    label: "เสร็จสิ้น",
    badgeBg: "bg-[color:color-mix(in_oklch,var(--muted)_70%,white)]",
    badgeText: "text-[var(--ink-subtle)]",
  },
};

export type LearningItemType = "program" | "subject";

export type LearningItem = {
  id: string;
  type: LearningItemType;
  name: string;
  credits: number;
  description: string;
};

export type Registration = {
  id: string;
  itemName: string;
  itemType: LearningItemType;
  term: string;
  status: RegistrationStatus;
};

export type AcademicRecord = {
  id: string;
  term: string;
  itemName: string;
  credits: number;
  grade: string;
};
