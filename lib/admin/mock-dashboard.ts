/**
 * Derived data for the three role-scoped `/admin` dashboards.
 *
 * Nothing here is a new fact about the world. Every function reads records
 * that already exist in `lib/admin/mock-data.ts` and the area-specific
 * `mock-*.ts` modules (or the real catalogue in `lib/data/*`) and reshapes
 * them for a dashboard panel. Adding a record still only ever happens where
 * it already lives; this file only answers "what does today look like" from
 * records that are already there.
 *
 * One exception worth calling out: `getTeacherUngradedCompletions` reports
 * every *completed* registration in a teacher's subjects, because no grade
 * has ever been recorded for any registration anywhere in this prototype —
 * `GradeEntry` (declared in `./types`) has no records yet, that screen is a
 * later phase. Reporting "no grade recorded" for a completed registration is
 * therefore accurate against the current data model, not invented.
 */

import { subjects } from "@/lib/data/subjects";
import type { PaymentState } from "@/lib/finance/payment-state";

import { daysBetween } from "./format";
import {
  capacityLevel,
  getCapacityItems,
  getScheduleSessions,
  thaiDateSortKey,
  type CapacityItem,
  type ScheduleSession,
} from "./mock-schedule";
import { getProgramsForTeacher, getSubjectsForTeacher } from "./mock-academic";
import {
  auditEntries,
  currentTerm,
  getOpenTransferCases,
  getPendingPayments,
  payments,
  registrations,
  TODAY,
  waitlistEntries,
} from "./mock-data";
import { formatWaitingLabel } from "./mock-payments";
import { getDueSignal } from "./mock-transfers";
import type { AdminPayment, AdminRegistration, AuditEntry, WaitlistEntry } from "./types";

/* -------------------------------------------------------------------------- */
/* Super admin — institution-wide health                                     */
/* -------------------------------------------------------------------------- */

export type PaymentsQueueSummary = {
  count: number;
  oldest: AdminPayment | null;
  oldestWaitingLabel: string;
};

/** `getPendingPayments` already sorts oldest submission first, so the first
 *  row is the longest-waiting payment without re-deriving the order here. */
export function getPaymentsQueueSummary(): PaymentsQueueSummary {
  const pending = getPendingPayments();
  const oldest = pending[0] ?? null;
  return {
    count: pending.length,
    oldest,
    oldestWaitingLabel: oldest ? formatWaitingLabel(oldest) : "",
  };
}

export type TransferQueueSummary = {
  openCount: number;
  overdueCount: number;
};

export function getTransferQueueSummary(): TransferQueueSummary {
  const open = getOpenTransferCases();
  const overdueCount = open.filter((c) => getDueSignal(c.dueAt, TODAY).overdue).length;
  return { openCount: open.length, overdueCount };
}

export type RevenueSummary = {
  confirmedAmount: number;
  confirmedCount: number;
  outstandingAmount: number;
  outstandingCount: number;
};

/** States still expected to convert into confirmed revenue through the normal
 *  flow. `payment-rejected` is deliberately excluded — it needs an officer to
 *  intervene, not a student to wait it out, so it belongs to the payments
 *  queue's own vocabulary rather than "money on the way". */
const OUTSTANDING_STATES = new Set<PaymentState>(["payment-required", "notice-submitted", "pending-verification"]);

export function getRevenueSummary(): RevenueSummary {
  let confirmedAmount = 0;
  let confirmedCount = 0;
  let outstandingAmount = 0;
  let outstandingCount = 0;

  for (const p of payments) {
    if (p.state === "payment-confirmed") {
      confirmedAmount += p.amount;
      confirmedCount += 1;
    } else if (OUTSTANDING_STATES.has(p.state)) {
      outstandingAmount += p.amount;
      outstandingCount += 1;
    }
  }

  return { confirmedAmount, confirmedCount, outstandingAmount, outstandingCount };
}

export type CapacitySummary = {
  overCount: number;
  nearFullCount: number;
  /** The single most over-subscribed item, if any — the one an admin would
   *  open first. */
  worstItem: CapacityItem | null;
};

export function getCapacitySummary(): CapacitySummary {
  const items = getCapacityItems();
  const over = items.filter((i) => capacityLevel(i.seats, i.enrolled) === "over");
  const nearFull = items.filter((i) => capacityLevel(i.seats, i.enrolled) === "near-full");
  const worstItem =
    [...over].sort((a, b) => b.enrolled - b.seats - (a.enrolled - a.seats))[0] ?? null;
  return { overCount: over.length, nearFullCount: nearFull.length, worstItem };
}

export type RegistrationWindowSummary = {
  isOpen: boolean;
  daysRemaining: number;
  closesAt: string;
};

/** Reads `currentTerm` as-is — this does not decide when a term is open, it
 *  only reports the fixed record's own status and how many days remain
 *  against the fixed `TODAY`. */
export function getRegistrationWindowSummary(): RegistrationWindowSummary {
  return {
    isOpen: currentTerm.status === "open",
    daysRemaining: daysBetween(TODAY, currentTerm.registrationClosesAt),
    closesAt: currentTerm.registrationClosesAt,
  };
}

/** Most recent staff actions across the whole institution, newest first. */
export function getRecentAuditEntries(limit = 5): AuditEntry[] {
  return [...auditEntries].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Officer — the day's queue                                                 */
/* -------------------------------------------------------------------------- */

export type OfficerTaskKind = "payment" | "transfer" | "registration" | "waitlist";

export type OfficerTask = {
  id: string;
  kind: OfficerTaskKind;
  kindLabel: string;
  title: string;
  detail: string;
  signal: string;
  urgent: boolean;
  href: string;
  /** Lower sorts first. Overdue items outrank everything else regardless of
   *  category, because a breached deadline is worse than a long wait. */
  rank: number;
};

const KIND_LABEL: Record<OfficerTaskKind, string> = {
  payment: "การชำระเงิน",
  transfer: "เทียบโอนหน่วยกิต",
  registration: "การลงทะเบียน",
  waitlist: "รอที่นั่ง",
};

/** Waiting entries whose item now has open seats — the exact gap between "a
 *  seat is free" and "the queue was told" that this list exists to close.
 *  Combines `waitlistEntries` with the same capacity figures the capacity
 *  screen shows, so the two never disagree about what "has room" means. */
export function getOfferableWaitlistEntries(): (WaitlistEntry & { seatsAvailable: number })[] {
  const capacityByKey = new Map(getCapacityItems().map((i) => [`${i.type}-${i.id}`, i]));
  return waitlistEntries
    .filter((w) => w.status === "waiting")
    .map((w) => {
      const capacity = capacityByKey.get(`${w.itemType}-${w.itemId}`);
      const seatsAvailable = capacity ? capacity.seats - capacity.enrolled : 0;
      return { ...w, seatsAvailable };
    })
    .filter((w) => w.seatsAvailable > 0)
    .sort((a, b) => a.position - b.position);
}

/** Registrations still awaiting payment whose linked payment's due date has
 *  already passed the fixed `TODAY` — the case a payment being rejected or
 *  never submitted both land in equally, because either way nothing is
 *  confirmed and the clock has run out. */
export function getOverdueAwaitingPaymentRegistrations(): (AdminRegistration & { payment: AdminPayment })[] {
  const result: (AdminRegistration & { payment: AdminPayment })[] = [];
  for (const r of registrations) {
    if (r.status !== "awaiting-payment" || !r.paymentId) continue;
    const payment = payments.find((p) => p.id === r.paymentId);
    if (!payment) continue;
    if (daysBetween(payment.dueDate, TODAY) > 0) result.push({ ...r, payment });
  }
  return result;
}

/**
 * The single prioritised worklist an officer opens instead of three separate
 * queues. Rank bands are 1000 apart — every real value fed into a band
 * (a wait, an overdue count, a queue position) stays far below that gap in
 * this mock world, so bands never cross:
 *
 *   < 0      anything overdue (a transfer case or a registration whose
 *            payment due date has passed) — more overdue sorts first
 *   1000+    payments still waiting on verification — longest wait first
 *   2000+    open transfer cases not yet overdue — soonest due date first
 *   3000+    seats that could be offered — lowest queue position first
 */
const RANK_PAYMENT = 1000;
const RANK_TRANSFER_OPEN = 2000;
const RANK_WAITLIST = 3000;

export function getOfficerWorklist(): OfficerTask[] {
  const tasks: OfficerTask[] = [];

  for (const c of getOpenTransferCases()) {
    const signal = getDueSignal(c.dueAt, TODAY);
    const daysRemaining = daysBetween(TODAY, c.dueAt);
    tasks.push({
      id: `transfer-${c.id}`,
      kind: "transfer",
      kindLabel: KIND_LABEL.transfer,
      title: c.reference,
      detail: c.institution,
      signal: signal.label,
      urgent: signal.overdue,
      href: `/admin/transfers/${c.id}`,
      rank: signal.overdue ? daysRemaining : RANK_TRANSFER_OPEN + daysRemaining,
    });
  }

  for (const r of getOverdueAwaitingPaymentRegistrations()) {
    const overdueDays = daysBetween(r.payment.dueDate, TODAY);
    tasks.push({
      id: `registration-${r.id}`,
      kind: "registration",
      kindLabel: KIND_LABEL.registration,
      title: r.reference,
      detail: r.itemName,
      signal: `เลยกำหนดชำระ ${overdueDays} วัน`,
      urgent: true,
      href: `/admin/payments/${r.payment.id}`,
      rank: -overdueDays,
    });
  }

  for (const p of getPendingPayments()) {
    const waitingDays = daysBetween(p.submittedAt ?? TODAY, TODAY);
    tasks.push({
      id: `payment-${p.id}`,
      kind: "payment",
      kindLabel: KIND_LABEL.payment,
      title: p.reference,
      detail: p.itemName,
      signal: formatWaitingLabel(p),
      urgent: false,
      href: `/admin/payments/${p.id}`,
      rank: RANK_PAYMENT - waitingDays,
    });
  }

  for (const w of getOfferableWaitlistEntries()) {
    tasks.push({
      id: `waitlist-${w.id}`,
      kind: "waitlist",
      kindLabel: KIND_LABEL.waitlist,
      title: w.itemName,
      detail: `ลำดับคิว ${w.position} · ที่นั่งว่าง ${w.seatsAvailable} ที่`,
      signal: "เสนอที่นั่งได้แล้ว",
      urgent: false,
      href: "/admin/waitlist",
      rank: RANK_WAITLIST + w.position,
    });
  }

  return tasks.sort((a, b) => a.rank - b.rank);
}

/** A single staff member's own recent actions, newest first. */
export function getStaffRecentActions(staffId: string, limit = 5): AuditEntry[] {
  return auditEntries
    .filter((a) => a.staffId === staffId)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Teacher — their own subjects only                                        */
/* -------------------------------------------------------------------------- */

/**
 * A teacher's subjects: assigned directly on the subject, or reachable
 * through a program they are assigned to teach. A teacher can be listed on a
 * program without being listed on every one of its subjects individually
 * (the catalogue models it that way), so scanning subjects alone would miss
 * real assignments — this is why both `teacherIds` lists matter, exactly as
 * the two already-established helpers in `mock-academic.ts` expose them.
 */
export function getTeacherSubjectIds(teacherId: string): Set<string> {
  const direct = getSubjectsForTeacher(teacherId).map((s) => s.id);
  const viaPrograms = getProgramsForTeacher(teacherId).flatMap((p) => p.subjectIds ?? []);
  return new Set([...direct, ...viaPrograms]);
}

export function getTeacherSubjects(teacherId: string) {
  const ids = getTeacherSubjectIds(teacherId);
  return subjects.filter((s) => ids.has(s.id));
}

/** Every non-completed session across a teacher's own subjects, soonest
 *  first. Reuses `getScheduleSessions` — sessions are never re-flattened
 *  locally. */
export function getTeacherUpcomingSessions(teacherId: string, limit = 6): ScheduleSession[] {
  const subjectIds = getTeacherSubjectIds(teacherId);
  return getScheduleSessions()
    .filter((s) => subjectIds.has(s.subjectId) && s.status !== "completed")
    .sort(
      (a, b) =>
        thaiDateSortKey(a.date) - thaiDateSortKey(b.date) || a.subjectName.localeCompare(b.subjectName, "th"),
    )
    .slice(0, limit);
}

/**
 * Completed registrations in a teacher's own subjects or programs. No
 * `GradeEntry` records exist yet anywhere in this prototype, so every
 * completed registration here has, factually, no grade recorded — that is
 * the real state of the data, not an assumption this function makes.
 */
export function getTeacherUngradedCompletions(teacherId: string): AdminRegistration[] {
  const subjectIds = getTeacherSubjectIds(teacherId);
  const programIds = new Set(getProgramsForTeacher(teacherId).map((p) => p.id));
  return registrations.filter(
    (r) =>
      r.status === "completed" &&
      ((r.itemType === "subject" && subjectIds.has(r.itemId)) ||
        (r.itemType === "program" && programIds.has(r.itemId))),
  );
}
