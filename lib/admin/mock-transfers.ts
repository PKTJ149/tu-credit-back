/**
 * Derived, area-specific data for the credit-transfer screens.
 *
 * Core entities (`transferCases`, `partnerInstitutions`, `students`, `TODAY`,
 * ...) still live in `./mock-data` — nothing here duplicates them. This file
 * only adds what belongs to the transfer area alone:
 *
 * - the canonical equivalency table (`creditMappings`) the review screen and
 *   the mapping screen both consult
 * - small, deterministic date helpers so ageing reads the same on every
 *   machine (never `new Date()` with no argument, never `Date.now()`)
 */

import type { PartnerInstitution } from "./types";
import { daysBetween } from "./format";

/* -------------------------------------------------------------------------- */
/* Agreement type labels                                                      */
/* -------------------------------------------------------------------------- */

export const agreementTypeLabel: Record<PartnerInstitution["agreementType"], string> = {
  mou: "บันทึกข้อตกลงความร่วมมือ (MOU)",
  network: "เครือข่ายสถาบันคู่ความร่วมมือ",
  "case-by-case": "พิจารณาเป็นรายกรณี",
};

/* -------------------------------------------------------------------------- */
/* Canonical credit-equivalency table                                        */
/* -------------------------------------------------------------------------- */

/**
 * institution + external subject → TU subject + credits granted. This is the
 * authority an officer consults on the review screen; the mapping an officer
 * sets on a single case is local to that case and does not write back here.
 */
export type CreditMapping = {
  id: string;
  institutionId: string;
  externalCode: string;
  externalName: string;
  tuSubjectId: string;
  tuCredits: number;
  notes?: string;
};

export const creditMappings: CreditMapping[] = [
  {
    id: "map1",
    institutionId: "inst1",
    externalCode: "2110101",
    externalName: "Computer Programming",
    tuSubjectId: "s1",
    tuCredits: 3,
  },
  {
    id: "map2",
    institutionId: "inst1",
    externalCode: "2301107",
    externalName: "Statistics for Research",
    tuSubjectId: "s2",
    tuCredits: 3,
  },
  {
    id: "map3",
    institutionId: "inst1",
    externalCode: "2110211",
    externalName: "User Experience Research",
    tuSubjectId: "s9",
    tuCredits: 2,
  },
  {
    id: "map4",
    institutionId: "inst2",
    externalCode: "751100",
    externalName: "Principles of Marketing",
    tuSubjectId: "s3",
    tuCredits: 3,
  },
  {
    id: "map5",
    institutionId: "inst2",
    externalCode: "703103",
    externalName: "Introduction to Accounting",
    tuSubjectId: "s8",
    tuCredits: 2,
    notes: "รับเทียบเฉพาะกรณีเกรด C ขึ้นไป",
  },
  {
    id: "map6",
    institutionId: "inst2",
    externalCode: "751210",
    externalName: "Research Methodology",
    tuSubjectId: "s6",
    tuCredits: 3,
  },
  {
    id: "map7",
    institutionId: "inst3",
    externalCode: "322101",
    externalName: "Design Thinking",
    tuSubjectId: "s7",
    tuCredits: 1,
  },
  {
    id: "map8",
    institutionId: "inst3",
    externalCode: "460210",
    externalName: "Data Structures and Algorithms",
    tuSubjectId: "s4",
    tuCredits: 3,
  },
  {
    id: "map9",
    institutionId: "inst4",
    externalCode: "CS1010",
    externalName: "Programming Methodology",
    tuSubjectId: "s1",
    tuCredits: 3,
    notes: "หน่วยกิตต้นทาง 4 หน่วยกิต เทียบให้ 3 หน่วยกิตตามเกณฑ์ TU",
  },
  {
    id: "map10",
    institutionId: "inst5",
    externalCode: "460101",
    externalName: "Business English",
    tuSubjectId: "s5",
    tuCredits: 2,
  },
];

export function getMappingsByInstitution(institutionId: string): CreditMapping[] {
  return creditMappings.filter((m) => m.institutionId === institutionId);
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Re-exported so existing call sites keep working; the implementations live in
 *  `lib/admin/format.ts`, which is the single source for display formatting. */
export { formatThaiDate, daysBetween } from "./format";

export type DueSignal = {
  label: string;
  overdue: boolean;
  dueSoon: boolean;
};

/** Ageing signal for a case's due date against the fixed `TODAY`. Overdue
 *  cases and cases due imminently both need to stand out on the queue —
 *  everything else reads as routine. */
export function getDueSignal(dueAt: string, today: string): DueSignal {
  const daysRemaining = daysBetween(today, dueAt);
  if (daysRemaining < 0) {
    return { label: `เลยกำหนด ${Math.abs(daysRemaining)} วัน`, overdue: true, dueSoon: false };
  }
  if (daysRemaining === 0) {
    return { label: "ครบกำหนดวันนี้", overdue: false, dueSoon: true };
  }
  if (daysRemaining <= 2) {
    return { label: `อีก ${daysRemaining} วัน`, overdue: false, dueSoon: true };
  }
  return { label: `อีก ${daysRemaining} วัน`, overdue: false, dueSoon: false };
}
