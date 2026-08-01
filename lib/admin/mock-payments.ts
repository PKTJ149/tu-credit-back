/**
 * Derived data for the payments area of the back office.
 *
 * Nothing here is a new fact about the world — every function reads from the
 * core records in `lib/admin/mock-data.ts` and reshapes them for the five
 * payment screens. Adding a payment record still only ever happens in
 * `mock-data.ts`; this file only computes things like "how long has this
 * been waiting" from records that already exist there.
 */

import {
  getStudentById,
  payments,
  registrations,
  TODAY,
} from "@/lib/admin/mock-data";
import type { AdminPayment, AdminRegistration } from "@/lib/admin/types";
import type { PaymentState } from "@/lib/finance/payment-state";
import { paymentStateInfo } from "@/lib/finance/payment-state";
import type { LearningItemType } from "@/lib/learning/registration-status";

/* -------------------------------------------------------------------------- */
/* Labels shared across the payment screens                                   */
/* -------------------------------------------------------------------------- */

export const itemTypeLabel: Record<LearningItemType, string> = {
  program: "หลักสูตร",
  subject: "รายวิชา",
};

export const ALL_PAYMENT_STATES: PaymentState[] = [
  "no-payable-items",
  "payment-required",
  "notice-submitted",
  "pending-verification",
  "payment-confirmed",
  "payment-rejected",
  "payment-cancelled",
  "payment-refunded",
];

/* -------------------------------------------------------------------------- */
/* Waiting time                                                               */
/* -------------------------------------------------------------------------- */

/** Whole days between a fixed ISO date and `TODAY`. Both inputs are fixed
 *  strings from the mock world, never a live clock — this stays identical on
 *  every render. */
function daysBetween(from: string, to: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const fromMs = new Date(`${from}T00:00:00`).getTime();
  const toMs = new Date(`${to}T00:00:00`).getTime();
  return Math.round((toMs - fromMs) / msPerDay);
}

/** How long a submitted payment has been sitting in the queue, relative to
 *  the fixed `TODAY`. `null` when there is nothing submitted yet to measure. */
export function daysWaiting(payment: AdminPayment): number | null {
  if (!payment.submittedAt) return null;
  return Math.max(0, daysBetween(payment.submittedAt, TODAY));
}

/** "รอมาแล้ว 3 วัน" — the label an officer scans to triage the queue. */
export function formatWaitingLabel(payment: AdminPayment): string {
  const days = daysWaiting(payment);
  if (days === null) return "—";
  if (days === 0) return "ส่งวันนี้";
  if (days === 1) return "รอมาแล้ว 1 วัน";
  return `รอมาแล้ว ${days} วัน`;
}

/* -------------------------------------------------------------------------- */
/* Cross-references                                                          */
/* -------------------------------------------------------------------------- */

/** The registration a payment was raised for, if the mock world links one. */
export function getRegistrationForPayment(paymentId: string): AdminRegistration | undefined {
  return registrations.find((r) => r.paymentId === paymentId);
}

type StudentDisplay = { name: string; code: string };

/** Name + student code for a table cell — falls back cleanly when a payment
 *  points at a student id the mock world does not have. */
export function getStudentDisplay(studentId: string): StudentDisplay {
  const student = getStudentById(studentId);
  return { name: student?.name ?? "ไม่พบข้อมูลผู้เรียน", code: student?.studentCode ?? "—" };
}

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

/** Case-insensitive match across reference, student name, and item name — the
 *  three fields every payment screen searches by. */
export function matchesPaymentSearch(payment: AdminPayment, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  const student = getStudentDisplay(payment.studentId);
  return (
    payment.reference.toLowerCase().includes(q) ||
    payment.itemName.toLowerCase().includes(q) ||
    student.name.toLowerCase().includes(q) ||
    student.code.toLowerCase().includes(q)
  );
}

/* -------------------------------------------------------------------------- */
/* Refunds                                                                    */
/* -------------------------------------------------------------------------- */

/** Confirmed payments an officer could still refund. */
export function getRefundEligiblePayments(): AdminPayment[] {
  return payments
    .filter((p) => p.state === "payment-confirmed")
    .sort((a, b) => (b.reviewedAt ?? "").localeCompare(a.reviewedAt ?? ""));
}

/** Refunds already issued, most recent first. */
export function getIssuedRefunds(): AdminPayment[] {
  return payments
    .filter((p) => p.state === "payment-refunded")
    .sort((a, b) => (b.refundedAt ?? "").localeCompare(a.refundedAt ?? ""));
}

/* -------------------------------------------------------------------------- */
/* Filter option lists for TableToolbar                                       */
/* -------------------------------------------------------------------------- */

export const itemTypeFilterOptions = [
  { value: "program", label: itemTypeLabel.program },
  { value: "subject", label: itemTypeLabel.subject },
];

export const paymentMethodFilterOptions = [
  { value: "bank-transfer", label: "โอนผ่านธนาคาร" },
  { value: "qr-promptpay", label: "พร้อมเพย์ (QR)" },
];

export const paymentStateFilterOptions = ALL_PAYMENT_STATES.map((state) => ({
  value: state,
  label: paymentStateInfo[state].label,
}));
