/**
 * Back office domain types.
 *
 * These sit on top of the student-facing entities in `lib/discovery/types.ts`
 * and the state models in `lib/finance`, `lib/learning`, `lib/credit-transfer`.
 * Nothing here redefines a state machine that already exists — staff screens
 * read the same states the student screens write.
 */

import type { PaymentState } from "@/lib/finance/payment-state";
import type { RegistrationStatus, LearningItemType } from "@/lib/learning/registration-status";
import type { TransferState, TransferType } from "@/lib/credit-transfer/transfer-state";

/* -------------------------------------------------------------------------- */
/* Staff identity                                                             */
/* -------------------------------------------------------------------------- */

export type StaffRole = "super-admin" | "officer" | "teacher";

export type StaffRoleInfo = {
  label: string;
  shortLabel: string;
  description: string;
};

export const staffRoleInfo: Record<StaffRole, StaffRoleInfo> = {
  "super-admin": {
    label: "ผู้ดูแลระบบสูงสุด",
    shortLabel: "ผู้ดูแลระบบ",
    description: "เข้าถึงได้ทุกส่วน จัดการบัญชีเจ้าหน้าที่และสิทธิ์การใช้งาน",
  },
  officer: {
    label: "เจ้าหน้าที่",
    shortLabel: "เจ้าหน้าที่",
    description: "ตรวจสอบการชำระเงิน การลงทะเบียน และคำขอเทียบโอน",
  },
  teacher: {
    label: "อาจารย์",
    shortLabel: "อาจารย์",
    description: "ดูแลรายวิชาที่รับผิดชอบ รายชื่อผู้เรียน และบันทึกผลการเรียน",
  },
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  /** Set only for role "teacher" — links the account to a `Teacher` record. */
  teacherId?: string;
  department: string;
  status: "active" | "suspended";
  lastActiveAt: string;
};

/* -------------------------------------------------------------------------- */
/* Students                                                                   */
/* -------------------------------------------------------------------------- */

export type AdminStudent = {
  id: string;
  studentCode: string;
  name: string;
  email: string;
  phone: string;
  faculty: string;
  educationLevel: string;
  registeredAt: string;
  status: "active" | "inactive";
  /** Credits already banked, used by the academic-records screens. */
  accumulatedCredits: number;
};

/* -------------------------------------------------------------------------- */
/* Payments                                                                   */
/* -------------------------------------------------------------------------- */

export type PaymentMethod = "bank-transfer" | "qr-promptpay";

export type AdminPayment = {
  id: string;
  reference: string;
  studentId: string;
  /** What is being paid for — denormalised so tables need one lookup, not two. */
  itemName: string;
  itemType: LearningItemType;
  amount: number;
  method: PaymentMethod;
  state: PaymentState;
  dueDate: string;
  submittedAt?: string;
  slipUrl?: string;
  slipNote?: string;
  reviewedByStaffId?: string;
  reviewedAt?: string;
  /** Required whenever state is "payment-rejected". */
  rejectionReason?: string;
  refundedAt?: string;
  refundReason?: string;
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  "bank-transfer": "โอนผ่านธนาคาร",
  "qr-promptpay": "พร้อมเพย์ (QR)",
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  isPrimary: boolean;
};

/* -------------------------------------------------------------------------- */
/* Registrations                                                              */
/* -------------------------------------------------------------------------- */

export type AdminRegistration = {
  id: string;
  reference: string;
  studentId: string;
  itemId: string;
  itemType: LearningItemType;
  itemName: string;
  term: string;
  status: RegistrationStatus;
  registeredAt: string;
  paymentId?: string;
  credits: number;
};

export type WaitlistEntry = {
  id: string;
  studentId: string;
  itemId: string;
  itemType: LearningItemType;
  itemName: string;
  position: number;
  requestedAt: string;
  status: "waiting" | "seat-offered" | "expired";
};

/* -------------------------------------------------------------------------- */
/* Credit transfer                                                            */
/* -------------------------------------------------------------------------- */

export type TransferEvidence = {
  id: string;
  name: string;
  fileType: "pdf" | "jpg" | "png";
  size: string;
  uploadedAt: string;
};

export type TransferSubjectLine = {
  id: string;
  externalCode: string;
  externalName: string;
  externalCredits: number;
  externalGrade: string;
  /** Mapped TU subject — empty until an officer decides the equivalency. */
  tuSubjectId?: string;
  tuCredits?: number;
  decision?: "accepted" | "rejected" | "pending";
};

export type TransferCase = {
  id: string;
  reference: string;
  studentId: string;
  type: TransferType;
  institution: string;
  state: TransferState;
  submittedAt: string;
  dueAt: string;
  subjects: TransferSubjectLine[];
  evidence: TransferEvidence[];
  reviewedByStaffId?: string;
  reviewedAt?: string;
  reviewNote?: string;
};

export type PartnerInstitution = {
  id: string;
  name: string;
  nameEn?: string;
  country: string;
  agreementType: "mou" | "network" | "case-by-case";
  status: "active" | "paused";
  caseCount: number;
};

/* -------------------------------------------------------------------------- */
/* Academic calendar & capacity                                               */
/* -------------------------------------------------------------------------- */

export type AcademicTerm = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  status: "planned" | "open" | "in-progress" | "closed";
};

/* -------------------------------------------------------------------------- */
/* Audit                                                                      */
/* -------------------------------------------------------------------------- */

export type AuditEntry = {
  id: string;
  staffId: string;
  action: string;
  target: string;
  at: string;
};

/* ========================================================================== */
/* Phase 4-8 domain                                                           */
/*                                                                            */
/* Declared centrally so five areas built in parallel share one vocabulary.   */
/* Each area owns its own mock records in `lib/admin/mock-<area>.ts`, but the  */
/* shapes live here.                                                          */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/* Website content                                                            */
/* -------------------------------------------------------------------------- */

/** News and activities are one entity with a category, not two content types.
 *  They share every field; splitting them would duplicate the editor and make
 *  staff guess which menu a given post belongs in. */
export type ContentCategory = "news" | "activity";

export type PublishState = "draft" | "scheduled" | "published" | "archived";

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  category: ContentCategory;
  state: PublishState;
  excerpt: string;
  body: string;
  coverImage?: string;
  /** Set when state is "published" or "scheduled". */
  publishAt?: string;
  authorStaffId: string;
  updatedAt: string;
  tags: string[];
  /** Activities have a real-world date and place; news does not. */
  eventDate?: string;
  eventLocation?: string;
};

export type HomeBanner = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
  order: number;
  state: PublishState;
  startAt?: string;
  endAt?: string;
};

/** Homepage curation. The live site drives its carousels from hardcoded slug
 *  arrays; this is the control that replaces them. */
export type FeaturedEntry = {
  id: string;
  itemType: "program" | "subject";
  itemId: string;
  slot: "hero" | "recommended" | "popular";
  order: number;
  active: boolean;
};

export type HelpArticle = {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  state: PublishState;
  order: number;
  updatedAt: string;
  /** How often learners opened this article — drives ordering decisions. */
  viewCount: number;
};

/** About, contact, and any other prose page the site renders from content
 *  rather than code. */
export type StaticPage = {
  id: string;
  slug: string;
  title: string;
  sections: { id: string; heading: string; body: string }[];
  state: PublishState;
  updatedAt: string;
  updatedByStaffId: string;
};

/** Privacy policy and terms of use. Versioned because consent is given against
 *  a specific version, and "which text did they agree to" has to be answerable. */
export type LegalDocument = {
  id: string;
  kind: "privacy" | "terms" | "cookie";
  title: string;
  version: string;
  effectiveAt: string;
  body: string;
  state: Extract<PublishState, "draft" | "published" | "archived">;
  updatedByStaffId: string;
};

export type MediaAsset = {
  id: string;
  filename: string;
  fileType: "png" | "jpg" | "webp" | "svg" | "pdf";
  size: string;
  dimensions?: string;
  url: string;
  uploadedAt: string;
  uploadedByStaffId: string;
  /** Human-readable places this file is referenced. Deleting something that is
   *  in use is the mistake a media library has to prevent. */
  usedIn: string[];
};

/* -------------------------------------------------------------------------- */
/* Academic records                                                           */
/* -------------------------------------------------------------------------- */

/** Grades the learner site already recognises, plus the ones a real registrar
 *  needs. `W` is withdrawn, `I` is incomplete. */
export type GradeValue = "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F" | "W" | "I";

export type GradeState = "not-entered" | "draft" | "submitted" | "published";

export type GradeEntry = {
  id: string;
  registrationId: string;
  studentId: string;
  subjectId: string;
  term: string;
  grade?: GradeValue;
  state: GradeState;
  recordedByStaffId?: string;
  recordedAt?: string;
  note?: string;
};

export type Certificate = {
  id: string;
  certificateNo: string;
  studentId: string;
  itemType: "program" | "subject";
  itemId: string;
  itemName: string;
  state: "eligible" | "issued" | "revoked";
  issuedAt?: string;
  issuedByStaffId?: string;
  revokedReason?: string;
};

/* -------------------------------------------------------------------------- */
/* Reviews                                                                    */
/* -------------------------------------------------------------------------- */

export type ReviewState = "pending" | "published" | "hidden" | "removed";

export type Review = {
  id: string;
  studentId: string;
  /** Only a learner with a matching registration may review — that link is
   *  what keeps this from becoming an open comment box. */
  registrationId: string;
  itemType: "program" | "subject";
  itemId: string;
  itemName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  submittedAt: string;
  state: ReviewState;
  moderatedByStaffId?: string;
  moderatedAt?: string;
  moderationNote?: string;
};

/* -------------------------------------------------------------------------- */
/* Communication                                                              */
/* -------------------------------------------------------------------------- */

export type AnnouncementAudience = "all" | "program" | "subject" | "term";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  /** Program id, subject id, or term name, depending on `audience`. */
  targetId?: string;
  channels: ("in-app" | "email")[];
  state: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  sentAt?: string;
  createdByStaffId: string;
  /** How many learners the audience resolves to. */
  recipientCount: number;
};

/** The wording behind an automatic notification. Editable without a deploy,
 *  which is the whole point — today these strings do not exist anywhere. */
export type NotificationTemplate = {
  id: string;
  key: string;
  event: string;
  channels: ("in-app" | "email")[];
  subject: string;
  body: string;
  /** Placeholders the body may use, e.g. "{{ชื่อผู้เรียน}}". */
  variables: string[];
  active: boolean;
  updatedAt: string;
  updatedByStaffId: string;
};

/* -------------------------------------------------------------------------- */
/* System administration                                                      */
/* -------------------------------------------------------------------------- */

/** A canonical list Admin owns. Faculty and education level are currently
 *  modelled three inconsistent ways across the learner site; every form must
 *  end up reading from one of these. */
export type TaxonomyKind = "faculty" | "education-level" | "subject-category" | "grade-scale";

export type TaxonomyTerm = {
  id: string;
  kind: TaxonomyKind;
  value: string;
  valueEn?: string;
  order: number;
  active: boolean;
  /** How many records reference this term — a term in use must not vanish. */
  usageCount: number;
};

export type SiteSetting = {
  id: string;
  group: "identity" | "contact" | "registration" | "consent";
  label: string;
  description?: string;
  kind: "text" | "textarea" | "email" | "phone" | "url" | "toggle" | "number";
  value: string;
};
