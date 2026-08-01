/**
 * Presentation vocabulary for `AcademicTerm.status`, scoped to this screen —
 * it is not one of the three shared state machines in
 * `components/admin/status-badge.tsx`, so it gets its own small tone map
 * here rather than reaching into that file.
 */

import type { StatusTone } from "@/components/admin/status-badge";
import type { AcademicTerm } from "@/lib/admin/types";

export type TermStatus = AcademicTerm["status"];

export const TERM_STATUS_LABEL: Record<TermStatus, string> = {
  planned: "วางแผนไว้",
  open: "เปิดรับลงทะเบียน",
  "in-progress": "กำลังดำเนินการเรียน",
  closed: "ปิดภาคการศึกษา",
};

export const TERM_STATUS_TONE: Record<TermStatus, StatusTone> = {
  planned: "neutral",
  open: "action",
  "in-progress": "positive",
  closed: "neutral",
};

/** The one forward status this term can move to next, and what telling an
 *  officer the consequence of that move looks like. `null` marks a terminal
 *  state — closed terms do not reopen from this screen. */
export const NEXT_TERM_STATUS: Partial<Record<TermStatus, TermStatus>> = {
  planned: "open",
  open: "in-progress",
  "in-progress": "closed",
};

export const TERM_TRANSITION_LABEL: Record<TermStatus, string> = {
  planned: "เปิดรับลงทะเบียน",
  open: "เริ่มการเรียนการสอน",
  "in-progress": "ปิดภาคการศึกษา",
  closed: "",
};

/** What happens to students when a term moves to each status — shown inside
 *  the confirmation before an officer commits to it. */
export const TERM_TRANSITION_CONSEQUENCE: Record<TermStatus, string> = {
  planned: "",
  open: "ภาคการศึกษานี้จะเปิดให้ผู้เรียนเห็นและลงทะเบียนได้ทันที ตามช่วงเปิดรับลงทะเบียนที่ตั้งไว้",
  "in-progress": "ระบบจะถือว่าภาคการศึกษานี้เริ่มการเรียนการสอนแล้ว แต่จะไม่ปิดรับลงทะเบียนอัตโนมัติ หากต้องการปิดรับลงทะเบียนต้องทำแยกต่างหาก",
  closed: "ผู้เรียนจะลงทะเบียนภาคการศึกษานี้เพิ่มไม่ได้อีก รายการที่ลงทะเบียนไว้แล้วจะไม่ได้รับผลกระทบ",
};

export type RegistrationWindowState = "not-open-yet" | "open-now" | "closed";

/** Where a term's registration window sits relative to the fixed `TODAY`
 *  constant. Both inputs are plain ISO date strings already in the mock
 *  world — this never touches a live clock. */
export function registrationWindowState(term: AcademicTerm, today: string): RegistrationWindowState {
  if (today < term.registrationOpensAt) return "not-open-yet";
  if (today > term.registrationClosesAt) return "closed";
  return "open-now";
}

/** Whole days between two fixed ISO dates. Never `Date.now()` — both dates
 *  already exist in the data, this only measures the gap between them. */
export function daysBetween(from: string, to: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const fromMs = new Date(`${from}T00:00:00`).getTime();
  const toMs = new Date(`${to}T00:00:00`).getTime();
  return Math.round((toMs - fromMs) / msPerDay);
}
