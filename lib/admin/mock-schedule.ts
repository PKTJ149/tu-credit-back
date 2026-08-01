/**
 * Derived data for the schedule, capacity, and terms screens.
 *
 * Nothing here is a new source of truth. Sessions are flattened out of
 * `subjects[].scheduleItems`; capacity combines `programs` and `subjects`
 * with `waitlistEntries` and the registration helpers already established in
 * `lib/admin/mock-academic.ts`, so this screen agrees with the programs and
 * subjects screens on what "at capacity" means instead of inventing a second
 * definition.
 */

import { programs } from "@/lib/data/programs";
import { subjects } from "@/lib/data/subjects";
import type { ScheduleItem } from "@/lib/discovery/types";
import { waitlistEntries } from "@/lib/admin/mock-data";
import { deriveSubjectEnrolled, isAtCapacity } from "@/lib/admin/mock-academic";

/* -------------------------------------------------------------------------- */
/* Schedule                                                                   */
/* -------------------------------------------------------------------------- */

export type ScheduleSession = ScheduleItem & {
  /** Stable id derived from the subject and the session's position in its
   *  schedule array — sessions have no id of their own in `lib/data/subjects`. */
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
};

const THAI_MONTHS: Record<string, number> = {
  "ม.ค.": 1,
  "ก.พ.": 2,
  "มี.ค.": 3,
  "เม.ย.": 4,
  "พ.ค.": 5,
  "มิ.ย.": 6,
  "ก.ค.": 7,
  "ส.ค.": 8,
  "ก.ย.": 9,
  "ต.ค.": 10,
  "พ.ย.": 11,
  "ธ.ค.": 12,
};

/** Sort key for a Thai date string like "15 ส.ค. 2569" (day, month, Buddhist
 *  year). Session dates in `lib/data/subjects` are plain display strings, not
 *  `Date` objects, so ordering them across subjects needs this parse. */
export function thaiDateSortKey(date: string): number {
  const parts = date.trim().split(/\s+/);
  if (parts.length < 3) return 0;
  const day = Number(parts[0]);
  const month = THAI_MONTHS[parts[1]] ?? 0;
  const year = Number(parts[2]);
  return year * 10000 + month * 100 + (Number.isFinite(day) ? day : 0);
}

/** Every session across every subject, flattened into one list an officer can
 *  filter and sort chronologically instead of hunting through each subject. */
export function getScheduleSessions(): ScheduleSession[] {
  return subjects.flatMap((subject) =>
    (subject.scheduleItems ?? []).map((item, index) => ({
      ...item,
      id: `${subject.id}-${index}`,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
    })),
  );
}

/** Subjects that actually have sessions to manage — the option list for the
 *  subject filter and the subject picker when adding a new session. */
export function getSubjectsWithSchedule() {
  return subjects.filter((s) => (s.scheduleItems?.length ?? 0) > 0);
}

/* -------------------------------------------------------------------------- */
/* Capacity                                                                   */
/* -------------------------------------------------------------------------- */

export type CapacityItemType = "program" | "subject";

export type CapacityItem = {
  id: string;
  type: CapacityItemType;
  name: string;
  code?: string;
  seats: number;
  enrolled: number;
  /** True when this row's enrolment was never tracked on the record itself
   *  (every subject in `lib/data/subjects`) and had to be derived from live
   *  registrations instead — the exact relationship this screen exists to
   *  put a number on. Shown so an officer does not mistake a derived count
   *  for a maintained one. */
  enrolledIsDerived: boolean;
  waitlistCount: number;
  href: string;
};

export function getCapacityItems(): CapacityItem[] {
  const programItems: CapacityItem[] = programs.map((p) => ({
    id: p.id,
    type: "program",
    name: p.name,
    seats: p.seats ?? 0,
    enrolled: p.enrolledCount ?? 0,
    enrolledIsDerived: false,
    waitlistCount: waitlistEntries.filter((w) => w.itemId === p.id && w.itemType === "program").length,
    href: `/admin/programs/${p.id}`,
  }));

  const subjectItems: CapacityItem[] = subjects.map((s) => ({
    id: s.id,
    type: "subject",
    name: s.name,
    code: s.code,
    seats: s.seats ?? 0,
    enrolled: s.enrolledCount ?? deriveSubjectEnrolled(s.id),
    enrolledIsDerived: s.enrolledCount === undefined,
    waitlistCount: waitlistEntries.filter((w) => w.itemId === s.id && w.itemType === "subject").length,
    href: `/admin/subjects/${s.id}`,
  }));

  return [...programItems, ...subjectItems];
}

export type CapacityLevel = "over" | "near-full" | "healthy";

/** Same "at or over capacity" boundary `lib/admin/mock-academic.ts` already
 *  uses for the programs/subjects screens (`isAtCapacity`), plus one earlier
 *  warning tier so a seat crunch is visible before it becomes a conflict.
 *
 *  `isAtCapacity` guards on `seats > 0` (it treats untracked capacity as "not
 *  at capacity" elsewhere) — but on this screen seats can be edited down to 0
 *  while people are still enrolled, and that is the clearest possible
 *  conflict. Checked first, ahead of the shared helper, so it is never
 *  read as "healthy". */
export function capacityLevel(seats: number, enrolled: number): CapacityLevel {
  if (enrolled > 0 && seats <= 0) return "over";
  if (isAtCapacity(seats, enrolled)) return "over";
  if (seats > 0 && enrolled / seats >= 0.9) return "near-full";
  return "healthy";
}
