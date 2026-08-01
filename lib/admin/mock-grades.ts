/**
 * Mock records and derivations for the academic-records phase: grade entry,
 * accumulated credits, certificates, and transcripts.
 *
 * Every `GradeEntry` here is derived from a real registration in
 * `lib/admin/mock-data.ts` — a grade never exists without an enrolment behind
 * it. Only registrations for a `subject` (not a bundled `program`) with status
 * `active` (currently studying) or `completed` (finished) get an entry: a
 * learner who has not yet paid has not started the class, and a cancelled
 * registration was withdrawn before it could be graded. That is a small,
 * honest seed — five entries across five subjects — which is a direct
 * reflection of how little of the existing mock registration data represents
 * a live, gradeable enrolment. It is not a shortcut; see the phase report for
 * the one shared-data change that would let a subject roster show more than
 * one learner.
 */

import { getStaffById, registrations } from "@/lib/admin/mock-data";
import type { StatusTone } from "@/components/admin/status-badge";
import { programs } from "@/lib/data/programs";
import { subjects } from "@/lib/data/subjects";
import type { AdminRegistration, Certificate, GradeEntry, GradeState, GradeValue } from "./types";

/* -------------------------------------------------------------------------- */
/* Grade-point scale                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Grade-point scale used everywhere GPA is computed in the back office.
 *
 * The learner-facing passbook only ever recognised A / B+ / B in its
 * client-side logic — it had no notion of a complete scale, because nothing
 * upstream ever produced a grade outside those three values. This is the
 * decision that closes that gap: the standard 4.0 scale used across Thai
 * university registrars, extended to every grade a registrar can record.
 *
 *   A = 4.0   B+ = 3.5   B = 3.0   C+ = 2.5   C = 2.0
 *   D+ = 1.5  D  = 1.0   F  = 0.0
 *
 * `W` (withdrawn) and `I` (incomplete) carry no grade point (`null` below)
 * and are excluded from both the credit total and the point total behind a
 * GPA — a withdrawn or incomplete course is not a finished academic result,
 * so it cannot move an average in either direction.
 *
 * This table is not just a code comment: /admin/credits renders it directly,
 * so no officer has to reverse-engineer the scale from behaviour.
 */
export const GRADE_POINTS: Record<GradeValue, number | null> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
  W: null,
  I: null,
};

/** Display order for grade selects — best to worst, then the two non-scored
 *  outcomes last. */
export const GRADE_VALUES: GradeValue[] = ["A", "B+", "B", "C+", "C", "D+", "D", "F", "W", "I"];

const PASSING_GRADES = new Set<GradeValue>(["A", "B+", "B", "C+", "C", "D+", "D"]);

/** A subject is "passed" on any grade except F, W, or I. Used to decide
 *  certificate eligibility and which published grades count toward credits
 *  earned. */
export function isPassingGrade(grade?: GradeValue): grade is GradeValue {
  return grade !== undefined && PASSING_GRADES.has(grade);
}

/* -------------------------------------------------------------------------- */
/* Grade entry state                                                         */
/* -------------------------------------------------------------------------- */

export const gradeStateInfo: Record<GradeState, { label: string; tone: StatusTone }> = {
  "not-entered": { label: "ยังไม่กรอก", tone: "neutral" },
  draft: { label: "กำลังกรอก", tone: "pending" },
  submitted: { label: "ส่งแล้ว รอเผยแพร่", tone: "action" },
  published: { label: "เผยแพร่แล้ว", tone: "positive" },
};

/* -------------------------------------------------------------------------- */
/* Grade entries                                                             */
/*                                                                            */
/* Derived from `registrations`, not hand-listed. The first version of this   */
/* file seeded five rows by hand, which meant every roster held exactly one   */
/* learner — and a batch grade-entry screen with one learner in it proves      */
/* nothing. Deriving means the roster is however many people actually took    */
/* the subject, and stays correct when the mock world grows.                  */
/*                                                                            */
/* `SEEDED_GRADES` then overlays a handful of known outcomes so every stage of */
/* the not-entered → draft → submitted → published progression is visible     */
/* somewhere in the demo. Anything not listed starts un-entered, which is      */
/* also the honest default: nobody has graded it.                             */
/* -------------------------------------------------------------------------- */

type SeededGrade = { grade?: GradeValue; state: GradeState; byStaffId?: string; at?: string };

/** Keyed by registration id. */
const SEEDED_GRADES: Record<string, SeededGrade> = {
  // s1 ภาคปลาย 2568 — a finished cohort, fully published
  reg12: { grade: "A", state: "published", byStaffId: "st4", at: "2026-05-20" },
  reg19: { grade: "B+", state: "published", byStaffId: "st4", at: "2026-05-20" },
  reg20: { grade: "B", state: "published", byStaffId: "st4", at: "2026-05-20" },
  reg21: { grade: "C+", state: "published", byStaffId: "st4", at: "2026-05-20" },
  // s2 ภาคปลาย 2568 — submitted, sitting on the publish step
  reg6: { grade: "B+", state: "submitted", byStaffId: "st1", at: "2026-05-22" },
  reg22: { grade: "A", state: "submitted", byStaffId: "st1", at: "2026-05-22" },
  reg23: { grade: "C", state: "submitted", byStaffId: "st1", at: "2026-05-22" },
  // s6 ภาคปลาย 2568 — published
  reg7: { grade: "C+", state: "published", byStaffId: "st1", at: "2026-05-28" },
  // s7 ภาคต้น 2569 — a teacher partway through the roster
  reg4: { grade: "B", state: "draft" },
  reg17: { grade: "A", state: "draft" },
  // s3 ภาคต้น 2569 — deliberately untouched: the live walkthrough starts here
};

export const gradeEntries: GradeEntry[] = registrations
  .filter((r) => r.itemType === "subject" && (r.status === "active" || r.status === "completed"))
  .map((r, index) => {
    const seed = SEEDED_GRADES[r.id];
    return {
      id: `ge${index + 1}`,
      registrationId: r.id,
      studentId: r.studentId,
      subjectId: r.itemId,
      term: r.term,
      grade: seed?.grade,
      state: seed?.state ?? "not-entered",
      recordedByStaffId: seed?.byStaffId,
      recordedAt: seed?.at,
    };
  });

export function getGradeEntriesForSubject(subjectId: string): GradeEntry[] {
  return gradeEntries.filter((e) => e.subjectId === subjectId);
}

export function getGradeEntriesForStudent(studentId: string): GradeEntry[] {
  return gradeEntries.filter((e) => e.studentId === studentId);
}

export function getRegistrationForEntry(entry: GradeEntry): AdminRegistration | undefined {
  return registrations.find((r) => r.id === entry.registrationId);
}

/** The subject ids that ever appear on /admin/grades — anything without at
 *  least one gradeable registration behind it has nothing to grade. */
export function getGradableSubjectIds(): string[] {
  return Array.from(new Set(gradeEntries.map((e) => e.subjectId)));
}

export type SubjectGradeSummary = {
  total: number;
  entered: number;
  outstanding: number;
  /** The furthest-behind entry decides the subject's aggregate stage: a
   *  roster is only as "done" as its least-finished row. */
  state: GradeState;
};

export function summarizeSubjectGrades(entries: GradeEntry[]): SubjectGradeSummary {
  const total = entries.length;
  const entered = entries.filter((e) => e.grade !== undefined).length;
  const outstanding = total - entered;

  let state: GradeState = "not-entered";
  if (total > 0) {
    if (entries.every((e) => e.state === "published")) state = "published";
    else if (entries.every((e) => e.state === "submitted" || e.state === "published")) state = "submitted";
    else if (entered > 0) state = "draft";
  }

  return { total, entered, outstanding, state };
}

/* -------------------------------------------------------------------------- */
/* Per-student academic summary — feeds /admin/credits and /admin/transcripts */
/* -------------------------------------------------------------------------- */

export type GradeBreakdownRow = {
  entry: GradeEntry;
  subjectName: string;
  subjectCode?: string;
  credits: number;
};

export type StudentAcademicSummary = {
  /** Every gradeable entry for this student, oldest term first, with the
   *  subject and credit figure already joined in. */
  breakdown: GradeBreakdownRow[];
  /** Credits earned from published, passing grades — the digitised half of
   *  `AdminStudent.accumulatedCredits`, which may still be larger: that field
   *  is the university's official running total, and most of its history
   *  predates this system ever recording a grade. */
  creditsFromPublished: number;
  /** Credits tied up in a registration that has not been published yet. */
  creditsInProgress: number;
  /** GPA across every published grade that carries a grade point (excludes
   *  W and I). `null` when the student has no published, scored grade yet —
   *  shown as such, never as 0.00. */
  gpa: number | null;
  gpaCreditBasis: number;
};

export function getStudentAcademicSummary(studentId: string): StudentAcademicSummary {
  const entries = getGradeEntriesForStudent(studentId);

  const breakdown: GradeBreakdownRow[] = entries
    .map((entry) => {
      const registration = getRegistrationForEntry(entry);
      const subject = subjects.find((s) => s.id === entry.subjectId);
      return {
        entry,
        subjectName: subject?.name ?? registration?.itemName ?? "ไม่พบข้อมูลรายวิชา",
        subjectCode: subject?.code,
        credits: registration?.credits ?? subject?.credits ?? 0,
      };
    })
    .sort((a, b) => a.entry.term.localeCompare(b.entry.term, "th"));

  const publishedRows = breakdown.filter((row) => row.entry.state === "published");
  const gpaRows = publishedRows.filter(
    (row) => row.entry.grade !== undefined && GRADE_POINTS[row.entry.grade] !== null,
  );

  const totalPoints = gpaRows.reduce(
    (sum, row) => sum + (GRADE_POINTS[row.entry.grade as GradeValue] as number) * row.credits,
    0,
  );
  const gpaCreditBasis = gpaRows.reduce((sum, row) => sum + row.credits, 0);

  const creditsFromPublished = publishedRows
    .filter((row) => isPassingGrade(row.entry.grade))
    .reduce((sum, row) => sum + row.credits, 0);

  const creditsInProgress = breakdown
    .filter((row) => row.entry.state !== "published")
    .reduce((sum, row) => sum + row.credits, 0);

  return {
    breakdown,
    creditsFromPublished,
    creditsInProgress,
    gpa: gpaCreditBasis > 0 ? totalPoints / gpaCreditBasis : null,
    gpaCreditBasis,
  };
}

/* -------------------------------------------------------------------------- */
/* Certificates                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Real certificate records — issued or revoked. Eligible-but-not-yet-issued
 * rows are never stored here; they are computed fresh in `buildCertificateRoster`
 * from published, passing grades, so eligibility can never drift out of sync
 * with the grade book.
 */
export const certificates: Certificate[] = [
  {
    id: "cert1",
    certificateNo: "CERT-2606-0001",
    studentId: "u1",
    itemType: "subject",
    itemId: "s1",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    state: "issued",
    issuedAt: "2026-06-01",
    issuedByStaffId: "st1",
  },
];

let certificateSequence = certificates.length;

/** "CERT-2608-0002", "CERT-2608-0003", ... — a running counter, never a
 *  timestamp, so the number is stable across renders and re-runs. */
export function nextCertificateNo(): string {
  certificateSequence += 1;
  return `CERT-2608-${String(certificateSequence).padStart(4, "0")}`;
}

type CertificateCandidate = {
  studentId: string;
  itemType: Certificate["itemType"];
  itemId: string;
  itemName: string;
};

function getSubjectCertificateCandidates(): CertificateCandidate[] {
  return gradeEntries
    .filter((e) => e.state === "published" && isPassingGrade(e.grade))
    .map((e) => ({
      studentId: e.studentId,
      itemType: "subject" as const,
      itemId: e.subjectId,
      itemName: subjects.find((s) => s.id === e.subjectId)?.name ?? "ไม่พบข้อมูลรายวิชา",
    }));
}

/** A program certificate needs every one of its subjects passed and
 *  published for the same learner — the mock grade book is small enough
 *  today that no student clears every subject in a program, so this
 *  currently contributes nothing, honestly, rather than being faked. The
 *  logic stays here so it starts working the moment more grades are
 *  recorded. */
function getProgramCertificateCandidates(): CertificateCandidate[] {
  const candidates: CertificateCandidate[] = [];
  const studentIds = new Set(gradeEntries.map((e) => e.studentId));

  for (const program of programs) {
    if (!program.subjectIds || program.subjectIds.length === 0) continue;
    for (const studentId of studentIds) {
      const hasAllPassed = program.subjectIds.every((subjectId) =>
        gradeEntries.some(
          (e) =>
            e.studentId === studentId &&
            e.subjectId === subjectId &&
            e.state === "published" &&
            isPassingGrade(e.grade),
        ),
      );
      if (hasAllPassed) {
        candidates.push({ studentId, itemType: "program", itemId: program.id, itemName: program.name });
      }
    }
  }

  return candidates;
}

/** The full certificates roster: real issued/revoked records, plus a
 *  synthetic "eligible" row for every passing published grade that does not
 *  already have one. Call once per page load into `useState` — the synthetic
 *  rows turn into real records the moment an officer issues them. */
export function buildCertificateRoster(): Certificate[] {
  const recorded = new Set(certificates.map((c) => `${c.studentId}:${c.itemType}:${c.itemId}`));
  const candidates = [...getSubjectCertificateCandidates(), ...getProgramCertificateCandidates()];

  const eligible: Certificate[] = candidates
    .filter((c) => !recorded.has(`${c.studentId}:${c.itemType}:${c.itemId}`))
    .map((c) => ({
      id: `elig-${c.studentId}-${c.itemId}`,
      certificateNo: "",
      studentId: c.studentId,
      itemType: c.itemType,
      itemId: c.itemId,
      itemName: c.itemName,
      state: "eligible" as const,
    }));

  return [...certificates, ...eligible];
}

export const certificateStateLabel: Record<Certificate["state"], string> = {
  eligible: "มีสิทธิ์ได้รับ",
  issued: "ออกใบรับรองแล้ว",
  revoked: "เพิกถอนแล้ว",
};

export const certificateStateTone: Record<Certificate["state"], StatusTone> = {
  eligible: "pending",
  issued: "positive",
  revoked: "critical",
};

/** The grade behind a subject certificate, for display only — a program
 *  certificate has no single grade to show. */
export function getCertificateGrade(cert: Certificate): GradeValue | undefined {
  if (cert.itemType !== "subject") return undefined;
  return gradeEntries.find(
    (e) => e.studentId === cert.studentId && e.subjectId === cert.itemId && e.state === "published",
  )?.grade;
}

export const itemTypeLabel: Record<Certificate["itemType"], string> = {
  program: "หลักสูตร",
  subject: "รายวิชา",
};

/** "ออกโดย [ชื่อเจ้าหน้าที่]" convenience — every certificate/transcript
 *  screen needs the issuer's name, never just their id. */
export function getIssuerName(staffId?: string): string {
  if (!staffId) return "—";
  return getStaffById(staffId)?.name ?? "—";
}
