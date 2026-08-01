/**
 * Derived data for the academic screens (programs, subjects, teachers).
 *
 * Nothing here is a new source of truth — every value is computed from the
 * real catalogue in `lib/data/*` and the registrations in `lib/admin/mock-data.ts`.
 * Screens read these instead of re-deriving the same aggregation three times,
 * so the programs, subjects, and teachers screens always agree on what
 * "at capacity" or "high workload" means.
 */

import { programs } from "@/lib/data/programs";
import { subjects } from "@/lib/data/subjects";
import { teachers } from "@/lib/data/teachers";
import type { Program, Subject } from "@/lib/discovery/types";
import type { StatusTone } from "@/components/admin/status-badge";
import { registrations } from "@/lib/admin/mock-data";
import type { AdminRegistration } from "@/lib/admin/types";

/* -------------------------------------------------------------------------- */
/* Shared vocabulary: catalogue status (open / closed)                       */
/* -------------------------------------------------------------------------- */

export type CatalogueStatus = "open" | "closed";

export const catalogueStatusLabel: Record<CatalogueStatus, string> = {
  open: "เปิดรับสมัคร",
  closed: "ปิดรับสมัคร",
};

export const catalogueStatusTone: Record<CatalogueStatus, StatusTone> = {
  open: "positive",
  closed: "neutral",
};

/** What a learner sees on the student-facing catalogue in each state — shown
 *  next to the status control so a staff member knows the effect of the
 *  toggle before saving it. */
export const catalogueStatusEffect: Record<CatalogueStatus, string> = {
  open: "ผู้เรียนจะเห็นรายการนี้ในหน้าคลังหลักสูตร และสามารถลงทะเบียนได้ทันทีหากยังมีที่นั่งว่าง",
  closed: "ผู้เรียนจะไม่สามารถลงทะเบียนรายการนี้ได้ ผู้ที่ลงทะเบียนไว้แล้วไม่ได้รับผลกระทบ",
};

/* -------------------------------------------------------------------------- */
/* Capacity                                                                   */
/* -------------------------------------------------------------------------- */

export function isAtCapacity(seats?: number, enrolledCount?: number): boolean {
  return typeof seats === "number" && typeof enrolledCount === "number" && enrolledCount >= seats && seats > 0;
}

/* -------------------------------------------------------------------------- */
/* Option lists — derived from the real catalogue so a select never offers a  */
/* value that does not already exist somewhere in the data.                   */
/* -------------------------------------------------------------------------- */

function uniqueSorted(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())))).sort((a, b) =>
    a.localeCompare(b, "th"),
  );
}

export const facultyOptions = uniqueSorted([...programs.map((p) => p.faculty), ...subjects.map((s) => s.faculty)]);
export const programLevelOptions = uniqueSorted(programs.map((p) => p.level));
export const programTypeOptions = uniqueSorted(programs.map((p) => p.type));
export const subjectCategoryOptions = uniqueSorted(subjects.map((s) => s.category));

/** Table labels. The hybrid option used to spell out "(ออนไลน์และเรียนที่
 *  มหาวิทยาลัย)", which restates the other two options and cost ~120px in every
 *  table it appeared in — enough on its own to push the seats and status columns
 *  off screen. Detail screens can afford the long form; a cell cannot. */
export const studyModeLabel: Record<NonNullable<Subject["studyMode"]>, string> = {
  online: "ออนไลน์",
  onsite: "เรียนที่มหาวิทยาลัย",
  hybrid: "ผสมผสาน",
};

/** The spelled-out version, for detail screens and form help text. */
export const studyModeLabelLong: Record<NonNullable<Subject["studyMode"]>, string> = {
  online: "ออนไลน์",
  onsite: "เรียนที่มหาวิทยาลัย",
  hybrid: "ผสมผสาน (ออนไลน์และเรียนที่มหาวิทยาลัย)",
};

export const scheduleStatusLabel: Record<"upcoming" | "ongoing" | "completed", string> = {
  upcoming: "ยังไม่ถึงรอบ",
  ongoing: "กำลังดำเนินการ",
  completed: "เสร็จสิ้นแล้ว",
};

export const scheduleStatusTone: Record<"upcoming" | "ongoing" | "completed", StatusTone> = {
  upcoming: "neutral",
  ongoing: "action",
  completed: "positive",
};

/* -------------------------------------------------------------------------- */
/* Registrations by catalogue item                                           */
/* -------------------------------------------------------------------------- */

export function getProgramRegistrations(programId: string): AdminRegistration[] {
  return registrations.filter((r) => r.itemType === "program" && r.itemId === programId);
}

export function getSubjectRegistrations(subjectId: string): AdminRegistration[] {
  return registrations.filter((r) => r.itemType === "subject" && r.itemId === subjectId);
}

/**
 * Subjects never had `enrolledCount` populated in the catalogue — only programs
 * did. That is the tracking gap the back office exists to surface, not a bug
 * here. Counting live registrations gives an honest, if partial, number.
 *
 * Every screen that shows a subject's enrolment must go through this, or the
 * catalogue list and the capacity screen report different numbers for the same
 * fact — which is worse than either number alone.
 */
export function deriveSubjectEnrolled(subjectId: string): number {
  return getSubjectRegistrations(subjectId).filter(
    (r) => r.status === "active" || r.status === "awaiting-payment",
  ).length;
}

/** A subject's enrolment: the catalogue value when present, derived otherwise.
 *  `isDerived` tells the UI to mark the number as inferred. */
export function subjectEnrolment(subject: { id: string; enrolledCount?: number }): {
  enrolled: number;
  isDerived: boolean;
} {
  if (subject.enrolledCount !== undefined) {
    return { enrolled: subject.enrolledCount, isDerived: false };
  }
  return { enrolled: deriveSubjectEnrolled(subject.id), isDerived: true };
}

/* -------------------------------------------------------------------------- */
/* Teacher workload — how many programs and subjects list this teacher in    */
/* their `teacherIds`. Flags whoever carries meaningfully more than the rest, */
/* which a plain count column would bury among a wall of similar numbers.    */
/* -------------------------------------------------------------------------- */

export type TeacherWorkload = {
  teacherId: string;
  programCount: number;
  subjectCount: number;
  total: number;
  /** True once a teacher's load sits a full assignment above the rounded
   *  average — the threshold that turns "carries more" into "visibly more". */
  isHighLoad: boolean;
};

function countAssignments(teacherId: string): { programCount: number; subjectCount: number } {
  const programCount = programs.filter((p) => p.teacherIds?.includes(teacherId)).length;
  const subjectCount = subjects.filter((s) => s.teacherIds?.includes(teacherId)).length;
  return { programCount, subjectCount };
}

export function getTeacherWorkloads(): TeacherWorkload[] {
  const raw = teachers.map((t) => {
    const { programCount, subjectCount } = countAssignments(t.id);
    return { teacherId: t.id, programCount, subjectCount, total: programCount + subjectCount };
  });
  const average = raw.length > 0 ? raw.reduce((sum, r) => sum + r.total, 0) / raw.length : 0;
  const threshold = Math.round(average) + 1;
  return raw.map((r) => ({ ...r, isHighLoad: r.total >= threshold }));
}

export function getTeacherWorkload(teacherId: string): TeacherWorkload {
  return (
    getTeacherWorkloads().find((w) => w.teacherId === teacherId) ?? {
      teacherId,
      programCount: 0,
      subjectCount: 0,
      total: 0,
      isHighLoad: false,
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Cross references used by the teacher detail screen                        */
/* -------------------------------------------------------------------------- */

export function getProgramsForTeacher(teacherId: string): Program[] {
  return programs.filter((p) => p.teacherIds?.includes(teacherId));
}

export function getSubjectsForTeacher(teacherId: string): Subject[] {
  return subjects.filter((s) => s.teacherIds?.includes(teacherId));
}
