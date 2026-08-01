/**
 * Derived, area-specific data for the registrations / students / waitlist
 * screens. Core entities (`students`, `registrations`, `waitlistEntries`, ...)
 * still live in `./mock-data` — nothing here duplicates them, it only reads
 * and reshapes them for these screens.
 */

import type { StatusTone } from "@/components/admin/status-badge";
import type { LearningItemType } from "@/lib/learning/registration-status";
import { waitlistEntries } from "./mock-data";
import type { AdminStudent, WaitlistEntry } from "./types";

/* -------------------------------------------------------------------------- */
/* Shared labels                                                              */
/* -------------------------------------------------------------------------- */

export const ITEM_TYPE_LABEL: Record<LearningItemType, string> = {
  program: "หลักสูตร",
  subject: "รายวิชา",
};

export const STUDENT_STATUS_LABEL: Record<AdminStudent["status"], string> = {
  active: "ใช้งานอยู่",
  inactive: "ไม่ใช้งาน",
};

export const studentStatusTone: Record<AdminStudent["status"], StatusTone> = {
  active: "positive",
  inactive: "neutral",
};

/** Re-exported so existing call sites keep working; the implementation lives in
 *  `lib/admin/format.ts`, which is the single source for display formatting. */
export { formatThaiDate } from "./format";

/* -------------------------------------------------------------------------- */
/* Waitlist                                                                   */
/* -------------------------------------------------------------------------- */

export type WaitlistStatus = WaitlistEntry["status"];

export const WAITLIST_STATUS_LABEL: Record<WaitlistStatus, string> = {
  waiting: "รอคิว",
  "seat-offered": "เสนอที่นั่งแล้ว",
  expired: "หมดสิทธิ์รับที่นั่ง",
};

export const waitlistStatusTone: Record<WaitlistStatus, StatusTone> = {
  waiting: "action",
  "seat-offered": "pending",
  expired: "neutral",
};

export type WaitlistGroup = {
  itemId: string;
  itemName: string;
  itemType: LearningItemType;
  entries: WaitlistEntry[];
};

/** Groups waitlist entries by the item people are waiting for, queue position
 *  ascending within each group. Accepts an entries array so a screen holding
 *  its own mutated copy in state can re-group after an action. */
export function getWaitlistGroups(entries: WaitlistEntry[] = waitlistEntries): WaitlistGroup[] {
  const groups = new Map<string, WaitlistGroup>();

  for (const entry of entries) {
    const existing = groups.get(entry.itemId);
    if (existing) {
      existing.entries.push(entry);
    } else {
      groups.set(entry.itemId, {
        itemId: entry.itemId,
        itemName: entry.itemName,
        itemType: entry.itemType,
        entries: [entry],
      });
    }
  }

  return Array.from(groups.values())
    .map((group) => ({ ...group, entries: [...group.entries].sort((a, b) => a.position - b.position) }))
    .sort((a, b) => b.entries.length - a.entries.length);
}

/** No per-student waitlist lookup exists on `./mock-data` (only registrations
 *  and payments do) — this fills that one gap for the student record screen. */
export function getWaitlistByStudent(studentId: string): WaitlistEntry[] {
  return waitlistEntries.filter((entry) => entry.studentId === studentId);
}
