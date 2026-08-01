/**
 * Display formatting shared by every back office screen.
 *
 * Two areas each grew their own copy of `formatThaiDate` while phase 1-3 was
 * built in parallel, and two other areas rendered raw ISO strings instead —
 * so the same date appeared three ways across screens an officer moves between
 * in one task. This module is the single answer.
 *
 * Nothing here reads the system clock. Every function reformats a fixed string
 * that already exists in the mock data, so the prototype renders identically on
 * every machine and in every screenshot.
 */

const thaiDate = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const thaiDateLong = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "2026-07-30" → "30 ก.ค. 2569". Buddhist era, matching the learner site. */
export function formatThaiDate(value: string): string {
  if (!value) return "—";
  return thaiDate.format(new Date(value));
}

/** "2026-07-30" → "30 กรกฎาคม 2569". For detail screens where one date is the
 *  subject of the sentence rather than a cell in a dense column. */
export function formatThaiDateLong(value: string): string {
  if (!value) return "—";
  return thaiDateLong.format(new Date(value));
}

/** Whole days between two fixed ISO date strings, positive when `to` is after
 *  `from`. Only ever used to diff stored dates against the fixed `TODAY`. */
export function daysBetween(from: string, to: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / msPerDay);
}
