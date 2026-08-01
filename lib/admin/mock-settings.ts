/**
 * Mock data for the system-administration screens (Phase 8):
 * `/admin/settings/staff`, `/admin/settings/taxonomy`, `/admin/settings/general`,
 * `/admin/settings/audit`.
 *
 * `staffUsers` and the base `auditEntries` still live in `./mock-data` — this
 * file only adds what belongs to this area alone: the canonical taxonomy
 * terms Admin owns, the site settings catalogue, and the fuller audit history
 * these screens need to be a believable log rather than five rows.
 *
 * Dates are fixed strings, never `new Date()` — the prototype must render the
 * same thing on every machine and in every screenshot.
 */

import type { StatusTone } from "@/components/admin/status-badge";

import type { AuditEntry, SiteSetting, StaffUser, TaxonomyKind, TaxonomyTerm } from "./types";
import { auditEntries as baseAuditEntries } from "./mock-data";

/* -------------------------------------------------------------------------- */
/* Staff account status                                                       */
/* -------------------------------------------------------------------------- */

export const STAFF_STATUS_LABEL: Record<StaffUser["status"], string> = {
  active: "ใช้งานอยู่",
  suspended: "ถูกระงับ",
};

export const staffStatusTone: Record<StaffUser["status"], StatusTone> = {
  active: "positive",
  suspended: "critical",
};

/* -------------------------------------------------------------------------- */
/* Taxonomy                                                                   */
/*                                                                             */
/* Faculty and education level are, right now, modelled three different ways: */
/*  - `components/register-form.tsx` hardcodes five faculty names in the      */
/*    learner-facing sign-up form                                            */
/*  - `components/account/profile-form.tsx` and `profile-info.tsx` each take */
/*    faculty and education level as free-text input with no shared list     */
/*  - `lib/data/programs.ts` and `lib/data/subjects.ts` carry a `faculty`     */
/*    string per catalogue record, including "คณะวิศวกรรมศาสตร์" — a value   */
/*    that shows up on admitted students but not on a single program or      */
/*    subject in the catalogue                                              */
/*                                                                             */
/* These terms are the list every one of those forms should end up reading   */
/* from instead. The taxonomy screen says so plainly, because the fix only   */
/* holds if the staff who maintain this list understand why it exists.       */
/* -------------------------------------------------------------------------- */

export const TAXONOMY_KIND_LABEL: Record<TaxonomyKind, string> = {
  faculty: "คณะ",
  "education-level": "ระดับการศึกษา",
  "subject-category": "หมวดวิชา",
  "grade-scale": "ระดับคะแนน",
};

export const TAXONOMY_KIND_HINT: Record<TaxonomyKind, string> = {
  faculty: "คณะหรือหน่วยงานต้นสังกัดของผู้เรียน ใช้ในแบบฟอร์มสมัครสมาชิกและข้อมูลส่วนตัวของผู้เรียน",
  "education-level": "ระดับการศึกษาปัจจุบันของผู้เรียน ใช้ในแบบฟอร์มสมัครสมาชิกและข้อมูลส่วนตัว",
  "subject-category": "หมวดวิชาของรายวิชาในหลักสูตร ใช้จัดกลุ่มรายวิชาในหน้าแคตตาล็อกและตัวกรอง",
  "grade-scale": "ระดับคะแนนที่ใช้บันทึกผลการเรียน พร้อมค่าแต้มระดับคะแนนที่เทียบเท่า",
};

export const taxonomyTerms: TaxonomyTerm[] = [
  // Faculty — usage counts reflect real occurrences across lib/data/programs.ts,
  // lib/data/subjects.ts, and the students in lib/admin/mock-data.ts.
  { id: "tax-fac-1", kind: "faculty", value: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", valueEn: "Faculty of Learning Sciences and Education", order: 1, active: true, usageCount: 6 },
  { id: "tax-fac-2", kind: "faculty", value: "คณะวิทยาศาสตร์และเทคโนโลยี", valueEn: "Faculty of Science and Technology", order: 2, active: true, usageCount: 12 },
  { id: "tax-fac-3", kind: "faculty", value: "คณะพาณิชยศาสตร์และการบัญชี", valueEn: "Faculty of Commerce and Accountancy", order: 3, active: true, usageCount: 15 },
  { id: "tax-fac-4", kind: "faculty", value: "คณะศิลปศาสตร์", valueEn: "Faculty of Liberal Arts", order: 4, active: true, usageCount: 10 },
  { id: "tax-fac-5", kind: "faculty", value: "คณะสาธารณสุขศาสตร์", valueEn: "Faculty of Public Health", order: 5, active: true, usageCount: 1 },
  {
    id: "tax-fac-6",
    kind: "faculty",
    value: "คณะวิศวกรรมศาสตร์",
    valueEn: "Faculty of Engineering",
    order: 6,
    active: true,
    // In use on admitted students, but not yet on any program or subject in
    // the catalogue — exactly the kind of mismatch this screen exists to
    // surface and stop from spreading further.
    usageCount: 2,
  },
  { id: "tax-fac-7", kind: "faculty", value: "คณะนิติศาสตร์", valueEn: "Faculty of Law", order: 7, active: false, usageCount: 0 },

  // Education level
  { id: "tax-edu-1", kind: "education-level", value: "ปริญญาตรี", valueEn: "Bachelor's Degree", order: 1, active: true, usageCount: 7 },
  { id: "tax-edu-2", kind: "education-level", value: "ปริญญาโท", valueEn: "Master's Degree", order: 2, active: true, usageCount: 3 },
  { id: "tax-edu-3", kind: "education-level", value: "ปริญญาเอก", valueEn: "Doctoral Degree", order: 3, active: true, usageCount: 0 },
  { id: "tax-edu-4", kind: "education-level", value: "ประกาศนียบัตร", valueEn: "Certificate", order: 4, active: false, usageCount: 0 },

  // Subject category — usage counts match lib/data/subjects.ts exactly.
  { id: "tax-cat-1", kind: "subject-category", value: "หมวดวิชาแกน", valueEn: "Core Courses", order: 1, active: true, usageCount: 5 },
  { id: "tax-cat-2", kind: "subject-category", value: "หมวดวิชาทั่วไป", valueEn: "General Education", order: 2, active: true, usageCount: 6 },
  { id: "tax-cat-3", kind: "subject-category", value: "วิชาเลือก", valueEn: "Elective Courses", order: 3, active: true, usageCount: 7 },
  { id: "tax-cat-4", kind: "subject-category", value: "หมวดวิชาเฉพาะ", valueEn: "Specialized Courses", order: 4, active: true, usageCount: 0 },

  // Grade scale — `valueEn` carries the grade-point equivalent, not a translation.
  { id: "tax-grd-1", kind: "grade-scale", value: "A", valueEn: "4.0", order: 1, active: true, usageCount: 42 },
  { id: "tax-grd-2", kind: "grade-scale", value: "B+", valueEn: "3.5", order: 2, active: true, usageCount: 38 },
  { id: "tax-grd-3", kind: "grade-scale", value: "B", valueEn: "3.0", order: 3, active: true, usageCount: 31 },
  { id: "tax-grd-4", kind: "grade-scale", value: "C+", valueEn: "2.5", order: 4, active: true, usageCount: 19 },
  { id: "tax-grd-5", kind: "grade-scale", value: "C", valueEn: "2.0", order: 5, active: true, usageCount: 14 },
  { id: "tax-grd-6", kind: "grade-scale", value: "D+", valueEn: "1.5", order: 6, active: true, usageCount: 6 },
  { id: "tax-grd-7", kind: "grade-scale", value: "D", valueEn: "1.0", order: 7, active: true, usageCount: 4 },
  { id: "tax-grd-8", kind: "grade-scale", value: "F", valueEn: "0.0", order: 8, active: true, usageCount: 5 },
  { id: "tax-grd-9", kind: "grade-scale", value: "W", valueEn: "ถอนรายวิชา (Withdrawn)", order: 9, active: true, usageCount: 3 },
  { id: "tax-grd-10", kind: "grade-scale", value: "I", valueEn: "รอผลสมบูรณ์ (Incomplete)", order: 10, active: true, usageCount: 2 },
];

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export const SITE_SETTING_GROUP_LABEL: Record<SiteSetting["group"], string> = {
  identity: "ข้อมูลองค์กร",
  contact: "ช่องทางติดต่อ",
  registration: "การลงทะเบียน",
  consent: "ความยินยอมและนโยบาย",
};

export const SITE_SETTING_GROUP_HINT: Record<SiteSetting["group"], string> = {
  identity: "ชื่อ คำโปรย และตราสัญลักษณ์ที่แสดงบนเว็บไซต์และแท็บเบราว์เซอร์",
  contact: "ช่องทางที่ผู้เรียนใช้ติดต่อฝ่ายสนับสนุน แสดงในหน้าช่วยเหลือและอีเมลอัตโนมัติ",
  registration: "ค่าที่ควบคุมพฤติกรรมการลงทะเบียนของผู้เรียนบนเว็บไซต์",
  consent: "เวอร์ชันนโยบายที่ใช้งานอยู่และการควบคุมความยินยอมระหว่างสมัครสมาชิก",
};

export const siteSettings: SiteSetting[] = [
  // Identity
  { id: "set-site-name", group: "identity", label: "ชื่อเว็บไซต์", description: "แสดงในส่วนหัวเว็บไซต์และแท็บเบราว์เซอร์", kind: "text", value: "Thammasat University Credit Bank" },
  { id: "set-site-tagline", group: "identity", label: "คำโปรยใต้ชื่อเว็บไซต์", description: "แสดงใต้ชื่อเว็บไซต์บนหน้าแรก", kind: "text", value: "ระบบคลังหน่วยกิต มหาวิทยาลัยธรรมศาสตร์" },
  { id: "set-site-description", group: "identity", label: "คำอธิบายเว็บไซต์ (SEO)", description: "ใช้เป็นคำอธิบายเมื่อแชร์ลิงก์หรือค้นหาบน Google", kind: "textarea", value: "แพลตฟอร์มลงทะเบียนเรียนและสะสมหน่วยกิตออนไลน์ของมหาวิทยาลัยธรรมศาสตร์ สำหรับผู้เรียนทุกช่วงวัย" },
  { id: "set-logo-url", group: "identity", label: "ที่อยู่ไฟล์โลโก้", description: "ลิงก์ไปยังไฟล์โลโก้ที่ใช้บนเว็บไซต์", kind: "url", value: "https://cdn.tucreditbank.ac.th/brand/logo.svg" },

  // Contact
  { id: "set-support-email", group: "contact", label: "อีเมลติดต่อฝ่ายสนับสนุน", description: "แสดงในหน้าช่วยเหลือและอีเมลอัตโนมัติถึงผู้เรียน", kind: "email", value: "support@tucreditbank.ac.th" },
  { id: "set-support-phone", group: "contact", label: "เบอร์โทรฝ่ายสนับสนุน", description: "แสดงในหน้าช่วยเหลือและหน้าติดต่อเรา", kind: "phone", value: "02-613-2000" },
  { id: "set-office-hours", group: "contact", label: "เวลาทำการ", description: "แสดงในหน้าติดต่อเรา", kind: "text", value: "จันทร์–ศุกร์ 08:30–16:30 น." },
  { id: "set-office-address", group: "contact", label: "ที่อยู่สำนักงานทะเบียน", description: "แสดงในหน้าติดต่อเราและท้ายอีเมลอัตโนมัติ", kind: "textarea", value: "อาคารโดมบริหาร ชั้น 2 มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ กรุงเทพฯ 10200" },

  // Registration
  { id: "set-reg-open", group: "registration", label: "เปิดรับลงทะเบียนผ่านเว็บไซต์", description: "เมื่อปิด ผู้เรียนจะเห็นข้อความว่าปิดรับลงทะเบียนชั่วคราวทั่วทั้งเว็บไซต์", kind: "toggle", value: "true" },
  { id: "set-max-credit", group: "registration", label: "จำนวนหน่วยกิตสูงสุดต่อภาคการศึกษา", description: "ระบบจะเตือนผู้เรียนเมื่อพยายามลงทะเบียนเกินจำนวนนี้", kind: "number", value: "22" },
  { id: "set-waitlist-enabled", group: "registration", label: "เปิดใช้งานระบบรอที่นั่ง", description: "เมื่อปิด รายวิชาที่เต็มจะแสดงว่าปิดรับสมัครแทนปุ่มขอรอที่นั่ง", kind: "toggle", value: "true" },
  { id: "set-auto-cancel-days", group: "registration", label: "จำนวนวันก่อนยกเลิกอัตโนมัติเมื่อไม่ชำระเงิน", description: "ค่าควบคุมภายใน ไม่แสดงผลบนเว็บไซต์โดยตรง", kind: "number", value: "3" },

  // Consent
  { id: "set-privacy-version", group: "consent", label: "เวอร์ชันนโยบายความเป็นส่วนตัวที่ใช้งานอยู่", description: "แสดงในหน้านโยบายความเป็นส่วนตัวและบันทึกคู่กับความยินยอมของผู้เรียนแต่ละคน", kind: "text", value: "2.3" },
  { id: "set-consent-required", group: "consent", label: "บังคับยอมรับเงื่อนไขก่อนสมัครสมาชิก", description: "ค่าควบคุมภายใน กำหนดว่าฟอร์มสมัครสมาชิกต้องติ๊กยอมรับก่อนส่งได้หรือไม่", kind: "toggle", value: "true" },
  { id: "set-marketing-consent", group: "consent", label: "แสดงช่องขอความยินยอมรับข่าวสารเพิ่มเติม", description: "เมื่อเปิด ผู้เรียนจะเห็นช่องติ๊กแยกสำหรับรับข่าวสารในฟอร์มสมัครสมาชิก", kind: "toggle", value: "false" },
  { id: "set-data-retention-days", group: "consent", label: "ระยะเวลาการเก็บข้อมูลผู้เรียนที่ไม่ใช้งาน (วัน)", description: "ค่าควบคุมภายใน ไม่แสดงผลบนเว็บไซต์โดยตรง", kind: "number", value: "1825" },
];

/** Settings a ผู้เรียน can actually see or feel the effect of on the learner
 *  site, as opposed to internal operating parameters. Shown on the screen so
 *  a staff member knows which changes are publicly visible before saving. */
export const LEARNER_VISIBLE_SETTING_IDS: ReadonlySet<string> = new Set([
  "set-site-name",
  "set-site-tagline",
  "set-site-description",
  "set-logo-url",
  "set-support-email",
  "set-support-phone",
  "set-office-hours",
  "set-office-address",
  "set-reg-open",
  "set-max-credit",
  "set-waitlist-enabled",
  "set-privacy-version",
  "set-marketing-consent",
]);

/* -------------------------------------------------------------------------- */
/* Audit trail                                                                */
/* -------------------------------------------------------------------------- */

export type AuditActionCategory = "payment" | "transfer" | "staff" | "grade" | "content";

export const AUDIT_CATEGORY_LABEL: Record<AuditActionCategory, string> = {
  payment: "การชำระเงิน",
  transfer: "เทียบโอนหน่วยกิต",
  staff: "บัญชีเจ้าหน้าที่",
  grade: "ผลการเรียน",
  content: "เนื้อหาเว็บไซต์",
};

/** Every action string this screen ever renders is written to match exactly
 *  one of these keyword groups, so filtering by category never falls back to
 *  guessing. New entries should follow the same vocabulary. */
export function classifyAuditAction(action: string): AuditActionCategory {
  if (action.includes("ชำระเงิน") || action.includes("คืนเงิน")) return "payment";
  if (action.includes("เทียบโอน")) return "transfer";
  if (action.includes("ผลการเรียน")) return "grade";
  if (action.includes("บัญชีเจ้าหน้าที่") || action.includes("สิทธิ์การใช้งาน") || action.includes("รหัสผ่านเจ้าหน้าที่")) return "staff";
  return "content";
}

/** Entries this area adds on top of the five already in `mock-data.ts`, so
 *  the audit screen reads like a real operating history — payment decisions,
 *  transfer decisions, staff account changes, grade publishing, and content
 *  edits, the actions the rest of this back office actually performs. */
const additionalAuditEntries: AuditEntry[] = [
  { id: "sa1", staffId: "st2", action: "อนุมัติการชำระเงิน", target: "PAY-2607-0038", at: "2026-07-23" },
  { id: "sa2", staffId: "st2", action: "อนุมัติการชำระเงิน", target: "PAY-2607-0031", at: "2026-07-09" },
  { id: "sa3", staffId: "st2", action: "คืนเงินให้ผู้เรียน", target: "PAY-2607-0031", at: "2026-07-19" },
  { id: "sa4", staffId: "st3", action: "อนุมัติการชำระเงิน", target: "PAY-2606-0027", at: "2026-06-30" },
  { id: "sa5", staffId: "st2", action: "ปฏิเสธการชำระเงิน", target: "PAY-2606-0024", at: "2026-06-24" },
  { id: "sa6", staffId: "st3", action: "อนุมัติการชำระเงิน", target: "PAY-2606-0019", at: "2026-06-18" },
  { id: "sa7", staffId: "st2", action: "คืนเงินให้ผู้เรียน", target: "PAY-2605-0014", at: "2026-05-28" },
  { id: "sa8", staffId: "st3", action: "อนุมัติการชำระเงิน", target: "PAY-2605-0009", at: "2026-05-20" },
  { id: "sa9", staffId: "st2", action: "ปฏิเสธการชำระเงิน", target: "PAY-2605-0006", at: "2026-05-14" },

  { id: "sa10", staffId: "st1", action: "อนุมัติคำขอเทียบโอน", target: "TRF-2607-0018", at: "2026-07-18" },
  { id: "sa11", staffId: "st1", action: "ปฏิเสธคำขอเทียบโอน", target: "TRF-2607-0012", at: "2026-07-07" },
  { id: "sa12", staffId: "st3", action: "ขอให้แก้ไขคำขอเทียบโอน", target: "TRF-2607-0016", at: "2026-07-13" },
  { id: "sa13", staffId: "st3", action: "รับพิจารณาคำขอเทียบโอน", target: "TRF-2608-0022", at: "2026-07-28" },
  { id: "sa14", staffId: "st1", action: "อนุมัติคำขอเทียบโอน", target: "TRF-2606-0005", at: "2026-06-15" },
  { id: "sa15", staffId: "st3", action: "ปฏิเสธคำขอเทียบโอน", target: "TRF-2605-0002", at: "2026-05-22" },

  { id: "sa16", staffId: "st1", action: "สร้างบัญชีเจ้าหน้าที่ใหม่", target: "จิราภรณ์ แสงทอง", at: "2026-05-02" },
  { id: "sa17", staffId: "st1", action: "ระงับบัญชีเจ้าหน้าที่", target: "จิราภรณ์ แสงทอง", at: "2026-06-12" },
  { id: "sa18", staffId: "st1", action: "เปลี่ยนสิทธิ์การใช้งาน", target: "ณัฐพงษ์ ทองแท้", at: "2026-04-20" },
  { id: "sa19", staffId: "st1", action: "รีเซ็ตรหัสผ่านเจ้าหน้าที่", target: "ปิยะดา ศรีสุวรรณ", at: "2026-06-30" },
  { id: "sa20", staffId: "st1", action: "สร้างบัญชีเจ้าหน้าที่ใหม่", target: "อ.ดร. สุดา รักเรียน", at: "2026-03-11" },

  { id: "sa21", staffId: "st4", action: "บันทึกผลการเรียน", target: "TU110 · ภาคปลาย 2568", at: "2026-05-10" },
  { id: "sa22", staffId: "st4", action: "เผยแพร่ผลการเรียน", target: "TU110 · ภาคปลาย 2568", at: "2026-05-15" },
  { id: "sa23", staffId: "st5", action: "บันทึกผลการเรียน", target: "หลักการตลาดดิจิทัล · ภาคปลาย 2568", at: "2026-05-11" },
  { id: "sa24", staffId: "st5", action: "เผยแพร่ผลการเรียน", target: "หลักการตลาดดิจิทัล · ภาคปลาย 2568", at: "2026-05-16" },
  { id: "sa25", staffId: "st4", action: "แก้ไขผลการเรียน", target: "ระเบียบวิธีวิจัยเบื้องต้น · ภาคปลาย 2568", at: "2026-05-19" },

  { id: "sa26", staffId: "st2", action: "เผยแพร่ข่าวประชาสัมพันธ์", target: "เปิดรับสมัครหลักสูตรใหม่ ภาคต้น 2569", at: "2026-06-20" },
  { id: "sa27", staffId: "st3", action: "แก้ไขแบนเนอร์หน้าแรก", target: "แบนเนอร์ประชาสัมพันธ์รับสมัครภาคต้น 2569", at: "2026-06-25" },
  { id: "sa28", staffId: "st1", action: "อัปเดตหน้านโยบายความเป็นส่วนตัว", target: "นโยบายความเป็นส่วนตัว เวอร์ชัน 2.3", at: "2026-06-01" },
  { id: "sa29", staffId: "st2", action: "แก้ไขหน้าเนื้อหา", target: "หน้าเกี่ยวกับเรา", at: "2026-04-15" },
];

/** The full log this screen reads — the five original entries plus the
 *  history above, newest first. */
export const auditEntries: AuditEntry[] = [...baseAuditEntries, ...additionalAuditEntries].sort((a, b) =>
  b.at.localeCompare(a.at),
);
