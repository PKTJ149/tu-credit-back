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
