/**
 * Derived data and authored records for phase 7 — reports, communication, and
 * reviews.
 *
 * The three report screens compute every figure from the real mock world
 * (`registrations`, `payments`, `programs`, `subjects`, `teachers`,
 * `academicTerms`) rather than storing a single hard-coded number anywhere.
 * Reviews, announcements, and notification templates are new records this
 * phase owns — they live here, not in `lib/admin/mock-data.ts`, so the shared
 * file five other areas depend on stays untouched.
 */

import { academicTerms, payments, registrations, TODAY } from "@/lib/admin/mock-data";
import { itemTypeLabel } from "@/lib/admin/mock-payments";
import { getProgramsForTeacher, getSubjectsForTeacher, getTeacherWorkloads } from "@/lib/admin/mock-academic";
import type { AdminPayment, AdminRegistration, Announcement, AnnouncementAudience, NotificationTemplate, Review, ReviewState } from "@/lib/admin/types";
import { daysBetween } from "@/lib/admin/format";
import { programs } from "@/lib/data/programs";
import { subjects } from "@/lib/data/subjects";
import { teachers } from "@/lib/data/teachers";
import type { RegistrationStatus } from "@/lib/learning/registration-status";

export { itemTypeLabel };

/* ============================================================================
 * Enrollment report
 *
 * Every count below is read live off `registrations`. Nothing is stored as a
 * pre-computed total, so filtering by term or switching the breakdown
 * dimension can never disagree with the registrations list itself.
 * ========================================================================== */

const facultyByItemId = new Map<string, string>();
programs.forEach((p) => facultyByItemId.set(p.id, p.faculty));
subjects.forEach((s) => facultyByItemId.set(s.id, s.faculty));

export type EnrollmentDimension = "program" | "subject" | "term" | "faculty";

export const enrollmentDimensionLabel: Record<EnrollmentDimension, string> = {
  program: "ตามหลักสูตร",
  subject: "ตามรายวิชา",
  term: "ตามภาคการศึกษา",
  faculty: "ตามคณะ",
};

export type EnrollmentBreakdownRow = {
  key: string;
  label: string;
  sublabel?: string;
  total: number;
  awaitingPayment: number;
  active: number;
  completed: number;
  cancelled: number;
  /** completed + cancelled — grouped for the chart's three-colour palette;
   *  the table still shows both counts separately. */
  closed: number;
  credits: number;
};

function newRow(key: string, label: string, sublabel?: string): EnrollmentBreakdownRow {
  return { key, label, sublabel, total: 0, awaitingPayment: 0, active: 0, completed: 0, cancelled: 0, closed: 0, credits: 0 };
}

function bumpRow(row: EnrollmentBreakdownRow, status: RegistrationStatus, credits: number) {
  row.total += 1;
  row.credits += credits;
  if (status === "awaiting-payment") row.awaitingPayment += 1;
  else if (status === "active") row.active += 1;
  else if (status === "completed") {
    row.completed += 1;
    row.closed += 1;
  } else if (status === "cancelled") {
    row.cancelled += 1;
    row.closed += 1;
  }
}

/** Term names come straight off `registrations[].term`, which already match
 *  `academicTerms[].name` — no separate id mapping needed. */
export const enrollmentTermOptions = academicTerms.map((t) => ({ value: t.name, label: t.name }));

export function getEnrollmentBreakdown(dimension: EnrollmentDimension, termFilter?: string): EnrollmentBreakdownRow[] {
  const pool = termFilter ? registrations.filter((r) => r.term === termFilter) : registrations;
  const map = new Map<string, EnrollmentBreakdownRow>();

  for (const r of pool) {
    let key: string;
    let label: string;
    let sublabel: string | undefined;

    if (dimension === "term") {
      key = r.term;
      label = r.term;
    } else if (dimension === "faculty") {
      const faculty = facultyByItemId.get(r.itemId) ?? "ไม่ระบุคณะ";
      key = faculty;
      label = faculty;
    } else if (dimension === "program") {
      if (r.itemType !== "program") continue;
      key = r.itemId;
      label = r.itemName;
      sublabel = facultyByItemId.get(r.itemId);
    } else {
      if (r.itemType !== "subject") continue;
      key = r.itemId;
      label = r.itemName;
      sublabel = facultyByItemId.get(r.itemId);
    }

    if (!map.has(key)) map.set(key, newRow(key, label, sublabel));
    bumpRow(map.get(key)!, r.status, r.credits);
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

/* ============================================================================
 * Revenue report
 *
 * A payment's bucket is derived from its `PaymentState`, never stored. Term
 * is resolved through the registration that raised the payment, since
 * `AdminPayment` itself carries no term field — that link is exactly what
 * `registrations[].paymentId` is for.
 * ========================================================================== */

const registrationByPaymentId = new Map<string, AdminRegistration>();
registrations.forEach((r) => {
  if (r.paymentId) registrationByPaymentId.set(r.paymentId, r);
});

function paymentTerm(p: AdminPayment): string {
  return registrationByPaymentId.get(p.id)?.term ?? "ไม่ระบุภาคการศึกษา";
}

export type RevenueBucket = "confirmed" | "outstanding" | "refunded";

export const revenueBucketLabel: Record<RevenueBucket, string> = {
  confirmed: "ยืนยันแล้ว",
  outstanding: "ค้างชำระ",
  refunded: "คืนเงินแล้ว",
};

/** `payment-cancelled` and `no-payable-items` never entered any of the three
 *  buckets — no money was ever expected, so counting them as "outstanding"
 *  would overstate what the university is actually owed. */
function classifyPayment(p: AdminPayment): RevenueBucket | null {
  if (p.state === "payment-confirmed") return "confirmed";
  if (p.state === "payment-refunded") return "refunded";
  if (p.state === "payment-required" || p.state === "pending-verification" || p.state === "payment-rejected") {
    return "outstanding";
  }
  return null;
}

export type RevenueTotals = Record<RevenueBucket, number> & { total: number };

export function getRevenueTotals(): RevenueTotals {
  const totals: RevenueTotals = { confirmed: 0, outstanding: 0, refunded: 0, total: 0 };
  for (const p of payments) {
    const bucket = classifyPayment(p);
    if (!bucket) continue;
    totals[bucket] += p.amount;
    totals.total += p.amount;
  }
  return totals;
}

export type RevenueBreakdownRow = {
  key: string;
  label: string;
  confirmed: number;
  outstanding: number;
  refunded: number;
  total: number;
};

export function getRevenueBreakdown(dimension: "program" | "term", termFilter?: string): RevenueBreakdownRow[] {
  const map = new Map<string, RevenueBreakdownRow>();
  for (const p of payments) {
    const bucket = classifyPayment(p);
    if (!bucket) continue;
    if (termFilter && paymentTerm(p) !== termFilter) continue;

    let key: string;
    if (dimension === "term") {
      key = paymentTerm(p);
    } else {
      if (p.itemType !== "program") continue;
      key = p.itemName;
    }

    if (!map.has(key)) map.set(key, { key, label: key, confirmed: 0, outstanding: 0, refunded: 0, total: 0 });
    const row = map.get(key)!;
    row[bucket] += p.amount;
    row.total += p.amount;
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export type OverduePayment = AdminPayment & { daysOverdue: number };

/** `dueDate` before the fixed `TODAY` and still unpaid — rejected slips count
 *  as unpaid too, since a rejection with no resubmission is still money the
 *  university has not received. */
export function getOverduePayments(): OverduePayment[] {
  return payments
    .filter(
      (p) =>
        (p.state === "payment-required" || p.state === "pending-verification" || p.state === "payment-rejected") &&
        p.dueDate < TODAY,
    )
    .map((p) => ({ ...p, daysOverdue: daysBetween(p.dueDate, TODAY) }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/* ============================================================================
 * Workload report
 * ========================================================================== */

export type WorkloadRow = {
  teacherId: string;
  name: string;
  title?: string;
  programCount: number;
  subjectCount: number;
  total: number;
  isHighLoad: boolean;
  learners: number;
};

/** Distinct learners across every active/awaiting-payment/completed
 *  registration for anything this teacher is assigned to. Cancelled
 *  registrations do not count as someone the teacher is actually teaching. */
export function getLearnersTaught(teacherId: string): number {
  const programIds = new Set(getProgramsForTeacher(teacherId).map((p) => p.id));
  const subjectIds = new Set(getSubjectsForTeacher(teacherId).map((s) => s.id));
  const studentIds = new Set<string>();
  for (const r of registrations) {
    if (r.status === "cancelled") continue;
    if ((r.itemType === "program" && programIds.has(r.itemId)) || (r.itemType === "subject" && subjectIds.has(r.itemId))) {
      studentIds.add(r.studentId);
    }
  }
  return studentIds.size;
}

/** Reuses `getTeacherWorkloads` rather than recomputing program/subject
 *  counts — this screen only adds the teacher's display name and the
 *  learner count on top of it. */
export function getWorkloadRows(): WorkloadRow[] {
  return getTeacherWorkloads()
    .map((w) => {
      const teacher = teachers.find((t) => t.id === w.teacherId);
      return {
        teacherId: w.teacherId,
        name: teacher?.name ?? "ไม่พบชื่ออาจารย์",
        title: teacher?.title,
        programCount: w.programCount,
        subjectCount: w.subjectCount,
        total: w.total,
        isHighLoad: w.isHighLoad,
        learners: getLearnersTaught(w.teacherId),
      };
    })
    .sort((a, b) => b.total - a.total);
}

/* ============================================================================
 * Communication — announcements
 * ========================================================================== */

/** The number the compose screen must show before a send is confirmed. All
 *  four audiences resolve against real `registrations`, never a stored count
 *  that could drift from the data underneath it. */
export function resolveAnnouncementRecipients(audience: AnnouncementAudience, targetId?: string): number {
  const ids = new Set<string>();
  for (const r of registrations) {
    if (audience === "all") {
      ids.add(r.studentId);
    } else if (audience === "program" && r.itemType === "program" && r.itemId === targetId) {
      ids.add(r.studentId);
    } else if (audience === "subject" && r.itemType === "subject" && r.itemId === targetId) {
      ids.add(r.studentId);
    } else if (audience === "term" && targetId && r.term === targetId) {
      ids.add(r.studentId);
    }
  }
  return ids.size;
}

export const announcementAudienceLabel: Record<AnnouncementAudience, string> = {
  all: "ผู้เรียนทั้งหมด",
  program: "หลักสูตรที่เลือก",
  subject: "รายวิชาที่เลือก",
  term: "ภาคการศึกษาที่เลือก",
};

export const announcementChannelLabel: Record<"in-app" | "email", string> = {
  "in-app": "แจ้งเตือนในระบบ",
  email: "อีเมล",
};

export let announcements: Announcement[] = [
  {
    id: "ann1",
    title: "ปิดปรับปรุงระบบชำระเงินชั่วคราว",
    body: "ระบบชำระเงินจะปิดปรับปรุงในวันที่ 3 ส.ค. 2569 เวลา 00:00–04:00 น. ผู้เรียนที่ต้องการชำระเงินในช่วงเวลาดังกล่าวสามารถทำรายการได้อีกครั้งหลังระบบเปิดใช้งานตามปกติ",
    audience: "all",
    channels: ["in-app", "email"],
    state: "sent",
    sentAt: "2026-07-28",
    createdByStaffId: "st1",
    recipientCount: resolveAnnouncementRecipients("all"),
  },
  {
    id: "ann2",
    title: "ปรับตารางเรียนสัปดาห์ที่ 3",
    body: "รายวิชาการเขียนโปรแกรมเบื้องต้นขอปรับเวลาเรียนของสัปดาห์ที่ 3 จาก 19:00 เป็น 18:30 น. เพื่อไม่ให้กระทบกับกิจกรรมของมหาวิทยาลัยในวันเดียวกัน",
    audience: "subject",
    targetId: "s1",
    channels: ["in-app", "email"],
    state: "sent",
    sentAt: "2026-07-25",
    createdByStaffId: "st3",
    recipientCount: resolveAnnouncementRecipients("subject", "s1"),
  },
  {
    id: "ann3",
    title: "เปิดรับสมัครโครงการฝึกงานภาคต้น 2569",
    body: "ผู้เรียนหลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์สามารถสมัครเข้าร่วมโครงการฝึกงานร่วมกับพันธมิตรของมหาวิทยาลัยได้ตั้งแต่วันนี้ถึง 15 ส.ค. 2569",
    audience: "program",
    targetId: "p1",
    channels: ["in-app"],
    state: "scheduled",
    scheduledAt: "2026-08-04",
    createdByStaffId: "st1",
    recipientCount: resolveAnnouncementRecipients("program", "p1"),
  },
  {
    id: "ann4",
    title: "แจ้งกำหนดการสอบปลายภาค ภาคต้น 2569",
    body: "กำหนดการสอบปลายภาคของภาคต้น 2569 จะประกาศอย่างเป็นทางการภายในสัปดาห์นี้ ผู้เรียนสามารถติดตามรายละเอียดเพิ่มเติมได้ทางอีเมลที่ลงทะเบียนไว้",
    audience: "term",
    targetId: "ภาคต้น 2569",
    channels: ["in-app", "email"],
    state: "draft",
    createdByStaffId: "st2",
    recipientCount: resolveAnnouncementRecipients("term", "ภาคต้น 2569"),
  },
];

export function addAnnouncement(a: Announcement) {
  announcements = [a, ...announcements];
}

let announcementIdCounter = announcements.length;
export function nextAnnouncementId(): string {
  announcementIdCounter += 1;
  return `ann${announcementIdCounter}`;
}

/* ============================================================================
 * Communication — notification templates
 * ========================================================================== */

/** Sample values used only for the live preview. Every variable any template
 *  declares must resolve here — an unresolved variable would render as a
 *  literal `{{...}}`, which is the exact bug this screen exists to prevent. */
export const templateSampleValues: Record<string, string> = {
  ชื่อผู้เรียน: "กันตพงศ์ เรืองวิทย์",
  รายการ: "การเขียนโปรแกรมเบื้องต้น",
  จำนวนเงิน: "3,500 บาท",
  วันที่: "1 ส.ค. 2569",
  เหตุผล: "ยอดเงินในสลิปไม่ตรงกับยอดที่ต้องชำระ",
  ภาคการศึกษา: "ภาคต้น 2569",
  วันเวลาใหม่: "8 ส.ค. 2569 เวลา 18:30 น.",
  สถานที่: "ห้อง 203 อาคารบรรยายรวม 5",
  ผลการพิจารณา: "อนุมัติ",
  เลขที่อ้างอิง: "TRF-2608-0021",
};

export function substituteTemplate(text: string, vars: string[]): string {
  return vars.reduce((acc, v) => acc.split(`{{${v}}}`).join(templateSampleValues[v] ?? `[ยังไม่มีค่าตัวอย่างสำหรับ ${v}]`), text);
}

export let notificationTemplates: NotificationTemplate[] = [
  {
    id: "tmpl1",
    key: "payment-approved",
    event: "อนุมัติการชำระเงิน",
    channels: ["in-app", "email"],
    subject: "ยืนยันการชำระเงิน {{รายการ}} เรียบร้อยแล้ว",
    body: "เรียน {{ชื่อผู้เรียน}}\n\nระบบได้ตรวจสอบและยืนยันการชำระเงินสำหรับ {{รายการ}} จำนวน {{จำนวนเงิน}} เรียบร้อยแล้ว\n\nขอบคุณที่ใช้บริการ Thammasat Credit Bank",
    variables: ["ชื่อผู้เรียน", "รายการ", "จำนวนเงิน"],
    active: true,
    updatedAt: "2026-07-15",
    updatedByStaffId: "st1",
  },
  {
    id: "tmpl2",
    key: "payment-rejected",
    event: "ปฏิเสธการชำระเงิน",
    channels: ["in-app", "email"],
    subject: "ต้องดำเนินการแก้ไขการชำระเงิน {{รายการ}}",
    body: "เรียน {{ชื่อผู้เรียน}}\n\nการชำระเงินสำหรับ {{รายการ}} จำนวน {{จำนวนเงิน}} ยังไม่สามารถยืนยันได้ เนื่องจาก: {{เหตุผล}}\n\nกรุณาส่งหลักฐานการชำระเงินใหม่ภายในกำหนด",
    variables: ["ชื่อผู้เรียน", "รายการ", "จำนวนเงิน", "เหตุผล"],
    active: true,
    updatedAt: "2026-07-15",
    updatedByStaffId: "st1",
  },
  {
    id: "tmpl3",
    key: "registration-confirmed",
    event: "ยืนยันการลงทะเบียน",
    channels: ["in-app", "email"],
    subject: "ยืนยันการลงทะเบียน {{รายการ}} ภาค {{ภาคการศึกษา}}",
    body: "เรียน {{ชื่อผู้เรียน}}\n\nการลงทะเบียน {{รายการ}} ประจำภาคการศึกษา {{ภาคการศึกษา}} ของท่านสมบูรณ์แล้ว\n\nพบกันในวันเปิดเรียน",
    variables: ["ชื่อผู้เรียน", "รายการ", "ภาคการศึกษา"],
    active: true,
    updatedAt: "2026-06-20",
    updatedByStaffId: "st1",
  },
  {
    id: "tmpl4",
    key: "schedule-changed",
    event: "แจ้งเปลี่ยนแปลงตารางเรียน",
    channels: ["in-app", "email"],
    subject: "แจ้งเปลี่ยนแปลงตารางเรียน {{รายการ}}",
    body: "เรียน {{ชื่อผู้เรียน}}\n\nตารางเรียนของ {{รายการ}} มีการเปลี่ยนแปลงเป็นวันเวลาใหม่: {{วันเวลาใหม่}} สถานที่: {{สถานที่}}\n\nกรุณาตรวจสอบตารางเรียนของท่านอีกครั้ง",
    variables: ["ชื่อผู้เรียน", "รายการ", "วันเวลาใหม่", "สถานที่"],
    active: true,
    updatedAt: "2026-07-02",
    updatedByStaffId: "st3",
  },
  {
    id: "tmpl5",
    key: "waitlist-seat-offered",
    event: "แจ้งได้รับที่นั่งจากคิวรอ",
    channels: ["in-app", "email"],
    subject: "มีที่นั่งว่างสำหรับ {{รายการ}} แล้ว",
    body: "เรียน {{ชื่อผู้เรียน}}\n\nขณะนี้มีที่นั่งว่างสำหรับ {{รายการ}} ที่ท่านอยู่ในคิวรอ กรุณายืนยันและชำระเงินภายใน 48 ชั่วโมง มิฉะนั้นระบบจะเสนอที่นั่งให้ผู้เรียนลำดับถัดไป",
    variables: ["ชื่อผู้เรียน", "รายการ"],
    active: true,
    updatedAt: "2026-06-28",
    updatedByStaffId: "st3",
  },
  {
    id: "tmpl6",
    key: "transfer-decided",
    event: "แจ้งผลคำขอเทียบโอนหน่วยกิต",
    channels: ["in-app", "email"],
    subject: "ผลการพิจารณาคำขอเทียบโอน {{เลขที่อ้างอิง}}",
    body: "เรียน {{ชื่อผู้เรียน}}\n\nคำขอเทียบโอนหน่วยกิตเลขที่ {{เลขที่อ้างอิง}} ได้รับการพิจารณาแล้ว ผลการพิจารณา: {{ผลการพิจารณา}}\n\nดูรายละเอียดเพิ่มเติมได้ในระบบ",
    variables: ["ชื่อผู้เรียน", "เลขที่อ้างอิง", "ผลการพิจารณา"],
    active: false,
    updatedAt: "2026-05-30",
    updatedByStaffId: "st1",
  },
];

export function getNotificationTemplateById(id: string): NotificationTemplate | undefined {
  return notificationTemplates.find((t) => t.id === id);
}

export function updateNotificationTemplate(next: NotificationTemplate) {
  notificationTemplates = notificationTemplates.map((t) => (t.id === next.id ? next : t));
}

/* ============================================================================
 * Reviews
 *
 * Every review's `registrationId` resolves against a real record in
 * `lib/admin/mock-data.ts::registrations` — that is what keeps this from
 * becoming an open comment box. The mock world only has 12 registrations;
 * two of them (reg6, reg12) carry a second review below to reach a realistic
 * queue size, standing in for a learner who left a follow-up comment after
 * their first one was moderated. Everything else is a distinct registration.
 * ========================================================================== */

function regOrThrow(id: string): AdminRegistration {
  const r = registrations.find((reg) => reg.id === id);
  if (!r) throw new Error(`mock-reports: registration ${id} not found`);
  return r;
}

function reviewFromRegistration(
  regId: string,
  fields: {
    id: string;
    rating: Review["rating"];
    comment: string;
    submittedAt: string;
    state: ReviewState;
    moderatedByStaffId?: string;
    moderatedAt?: string;
    moderationNote?: string;
  },
): Review {
  const reg = regOrThrow(regId);
  return {
    id: fields.id,
    studentId: reg.studentId,
    registrationId: regId,
    itemType: reg.itemType,
    itemId: reg.itemId,
    itemName: reg.itemName,
    rating: fields.rating,
    comment: fields.comment,
    submittedAt: fields.submittedAt,
    state: fields.state,
    moderatedByStaffId: fields.moderatedByStaffId,
    moderatedAt: fields.moderatedAt,
    moderationNote: fields.moderationNote,
  };
}

export let reviews: Review[] = [
  reviewFromRegistration("reg12", {
    id: "rev1",
    rating: 5,
    comment: "อาจารย์สอนเข้าใจง่ายมาก เนื้อหาเรียงจากง่ายไปยากเหมาะกับคนไม่มีพื้นฐานเลย ประทับใจมากครับ",
    submittedAt: "2026-01-20",
    state: "published",
    moderatedByStaffId: "st2",
    moderatedAt: "2026-01-21",
  }),
  reviewFromRegistration("reg6", {
    id: "rev2",
    rating: 4,
    comment: "เนื้อหาแน่นดี แต่การบ้านค่อนข้างเยอะในช่วงท้าย ควรกระจายให้สม่ำเสมอกว่านี้",
    submittedAt: "2026-02-02",
    state: "published",
    moderatedByStaffId: "st2",
    moderatedAt: "2026-02-03",
  }),
  reviewFromRegistration("reg7", {
    id: "rev3",
    rating: 5,
    comment: "กระบวนการวิจัยที่สอนนำไปใช้ทำวิทยานิพนธ์ได้จริง อาจารย์ให้ feedback ละเอียดทุกสัปดาห์",
    submittedAt: "2026-02-05",
    state: "published",
    moderatedByStaffId: "st3",
    moderatedAt: "2026-02-06",
  }),
  reviewFromRegistration("reg3", {
    id: "rev4",
    rating: 3,
    comment: "ภาพรวมดี แต่บางหัวข้อสอนเร็วไปหน่อย อยากให้มีคลิปย้อนหลังให้ทบทวนได้มากกว่านี้",
    submittedAt: "2026-07-24",
    state: "published",
    moderatedByStaffId: "st2",
    moderatedAt: "2026-07-25",
  }),
  reviewFromRegistration("reg4", {
    id: "rev5",
    rating: 4,
    comment: "ได้ฝึกปฏิบัติจริงเยอะ ชอบที่มี feedback แบบเรียลไทม์จากอาจารย์และเพื่อนร่วมกลุ่ม",
    submittedAt: "2026-07-26",
    state: "published",
    moderatedByStaffId: "st3",
    moderatedAt: "2026-07-27",
  }),
  reviewFromRegistration("reg9", {
    id: "rev6",
    rating: 2,
    comment: "แบบฝึกหัดในคลาสกับที่สอนไม่ค่อยตรงกัน ตามไม่ค่อยทันในสัปดาห์ที่ 3-4 อยากให้ปรับความเร็วในการสอน",
    submittedAt: "2026-07-29",
    state: "published",
    moderatedByStaffId: "st2",
    moderatedAt: "2026-07-30",
  }),
  reviewFromRegistration("reg1", {
    id: "rev7",
    rating: 5,
    comment: "หลักสูตรครบวงจรตั้งแต่พื้นฐานจนถึงโปรเจกต์จริง คุ้มค่ากับเวลาที่เสียไปมาก แนะนำเลย",
    submittedAt: "2026-07-31",
    state: "pending",
  }),
  reviewFromRegistration("reg2", {
    id: "rev8",
    rating: 4,
    comment: "เนื้อหาทันสมัย ใช้เครื่องมือที่ตลาดต้องการจริง แต่ระยะเวลาหลักสูตรค่อนข้างกระชั้นสำหรับคนทำงานประจำ",
    submittedAt: "2026-07-31",
    state: "pending",
  }),
  reviewFromRegistration("reg10", {
    id: "rev9",
    rating: 5,
    comment: "เข้าใจแนวคิด AI ได้ง่ายขึ้นมากทั้งที่ไม่มีพื้นฐานเขียนโค้ดมาก่อน อาจารย์ยกตัวอย่างได้ชัดเจน",
    submittedAt: "2026-07-30",
    state: "pending",
  }),
  reviewFromRegistration("reg5", {
    id: "rev10",
    rating: 1,
    comment: "เนื้อหายากเกินกว่าที่ระบุไว้ในคำอธิบายวิชา ไม่มีพื้นฐานมาก่อนตามแทบไม่ทันเลยตลอดทั้งเทอม",
    submittedAt: "2026-07-28",
    state: "pending",
  }),
  reviewFromRegistration("reg11", {
    id: "rev11",
    rating: 3,
    comment: "พื้นฐานดีสำหรับผู้ไม่มีความรู้บัญชีมาก่อน แต่กรณีศึกษาที่ใช้ค่อนข้างเก่า อยากให้ปรับให้ทันสมัยกว่านี้",
    submittedAt: "2026-07-27",
    state: "pending",
  }),
  reviewFromRegistration("reg8", {
    id: "rev12",
    rating: 1,
    comment:
      "อาจารย์คนนี้สอนแย่มาก ไม่รู้เรื่องอะไรเลย เสียเวลาสมัครจริงๆ ปล. ใครสนใจหาเงินออนไลน์ทักไลน์มาคุยกันได้นะครับ รายได้เสริมดีมาก",
    submittedAt: "2026-07-10",
    state: "pending",
  }),
  reviewFromRegistration("reg6", {
    id: "rev13",
    rating: 2,
    comment: "ตารางเรียนเปลี่ยนกะทันหันหลายครั้งจนวางแผนงานอื่นไม่ได้ ทั้งที่เนื้อหาการสอนโอเคอยู่",
    submittedAt: "2026-01-25",
    state: "hidden",
    moderatedByStaffId: "st2",
    moderatedAt: "2026-01-26",
    moderationNote: "เนื้อหาเป็นความเห็นเรื่องตารางเรียนที่คลาดเคลื่อนไปแล้ว ซ่อนไว้เพื่อรอตรวจสอบข้อเท็จจริงกับผู้สอนก่อน",
  }),
  reviewFromRegistration("reg12", {
    id: "rev14",
    rating: 5,
    comment: "อยากให้ทุกคนมาเรียนคอร์สนี้ ติดต่อผมได้เลยมีส่วนลดพิเศษ inbox มาคุยกันได้ครับ",
    submittedAt: "2026-01-22",
    state: "removed",
    moderatedByStaffId: "st1",
    moderatedAt: "2026-01-23",
    moderationNote: "เนื้อหาเป็นการโฆษณาแอบแฝง ไม่เกี่ยวข้องกับการรีวิวรายวิชา ลบออกจากระบบ",
  }),
];

export function setReviews(next: Review[]) {
  reviews = next;
}

export type ItemRatingAggregate = {
  itemType: "program" | "subject";
  itemId: string;
  itemName: string;
  average: number;
  count: number;
};

/** Only published reviews count toward the aggregate — this is the number
 *  the learner-facing site would actually display. */
export function getItemRatingAggregates(source: Review[] = reviews): ItemRatingAggregate[] {
  const map = new Map<string, ItemRatingAggregate>();
  for (const r of source) {
    if (r.state !== "published") continue;
    const key = `${r.itemType}-${r.itemId}`;
    if (!map.has(key)) map.set(key, { itemType: r.itemType, itemId: r.itemId, itemName: r.itemName, average: 0, count: 0 });
    const entry = map.get(key)!;
    entry.average = (entry.average * entry.count + r.rating) / (entry.count + 1);
    entry.count += 1;
  }
  return Array.from(map.values()).sort((a, b) => b.average - a.average);
}
