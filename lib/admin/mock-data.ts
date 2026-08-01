/**
 * Back office mock data.
 *
 * Single source of truth for every admin screen. Records cross-reference the
 * real catalogue in `lib/data/*` by id, so a payment always points at a
 * program/subject that actually exists.
 *
 * Dates are fixed strings, never `new Date()` — the prototype must render the
 * same thing on every machine and in every screenshot.
 */

import type {
  AcademicTerm,
  AdminPayment,
  AdminRegistration,
  AdminStudent,
  AuditEntry,
  BankAccount,
  PartnerInstitution,
  StaffUser,
  TransferCase,
  WaitlistEntry,
} from "./types";

/** The "today" every screen renders against. Keeps due dates and ageing stable. */
export const TODAY = "2026-08-01";

/* -------------------------------------------------------------------------- */
/* Staff accounts                                                             */
/* -------------------------------------------------------------------------- */

export const staffUsers: StaffUser[] = [
  {
    id: "st1",
    name: "ธนกร วงศ์อนันต์",
    email: "thanakorn.w@tu.ac.th",
    role: "super-admin",
    department: "สำนักงานทะเบียนนักศึกษา",
    status: "active",
    lastActiveAt: "2026-08-01",
  },
  {
    id: "st2",
    name: "ปิยะดา ศรีสุวรรณ",
    email: "piyada.s@tu.ac.th",
    role: "officer",
    department: "งานการเงินและบัญชี",
    status: "active",
    lastActiveAt: "2026-08-01",
  },
  {
    id: "st3",
    name: "ณัฐพงษ์ ทองแท้",
    email: "nattapong.t@tu.ac.th",
    role: "officer",
    department: "งานทะเบียนและประมวลผล",
    status: "active",
    lastActiveAt: "2026-07-31",
  },
  {
    id: "st4",
    name: "ผศ.ดร. สมชาย ใจดี",
    email: "somchai.j@tu.ac.th",
    role: "teacher",
    teacherId: "p1-t1",
    department: "คณะวิทยาศาสตร์และเทคโนโลยี",
    status: "active",
    lastActiveAt: "2026-07-30",
  },
  {
    id: "st5",
    name: "อ.ดร. สุดา รักเรียน",
    email: "suda.r@tu.ac.th",
    role: "teacher",
    teacherId: "p3-t1",
    department: "คณะพาณิชยศาสตร์และการบัญชี",
    status: "active",
    lastActiveAt: "2026-07-28",
  },
  {
    id: "st6",
    name: "จิราภรณ์ แสงทอง",
    email: "jiraporn.s@tu.ac.th",
    role: "officer",
    department: "งานการเงินและบัญชี",
    status: "suspended",
    lastActiveAt: "2026-06-12",
  },
];

/** The account the prototype is "signed in" as by default. */
export const DEFAULT_STAFF_ID = "st1";

export function getStaffById(id: string): StaffUser | undefined {
  return staffUsers.find((s) => s.id === id);
}

export function getStaffName(id?: string): string {
  if (!id) return "—";
  return getStaffById(id)?.name ?? "—";
}

/* -------------------------------------------------------------------------- */
/* Students                                                                   */
/* -------------------------------------------------------------------------- */

export const students: AdminStudent[] = [
  {
    id: "u1",
    studentCode: "CB6801001",
    name: "กันตพงศ์ เรืองวิทย์",
    email: "kantapong.r@gmail.com",
    phone: "081-234-5678",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-05-14",
    status: "active",
    accumulatedCredits: 12,
  },
  {
    id: "u2",
    studentCode: "CB6801002",
    name: "ศิริพร ทองดี",
    email: "siriporn.t@gmail.com",
    phone: "089-876-5432",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-05-20",
    status: "active",
    accumulatedCredits: 6,
  },
  {
    id: "u3",
    studentCode: "CB6801003",
    name: "อนุชา พัฒนกิจ",
    email: "anucha.p@outlook.com",
    phone: "062-345-6789",
    faculty: "คณะวิศวกรรมศาสตร์",
    educationLevel: "ปริญญาโท",
    registeredAt: "2026-06-02",
    status: "active",
    accumulatedCredits: 21,
  },
  {
    id: "u4",
    studentCode: "CB6801004",
    name: "ปาริชาต แก้วมณี",
    email: "parichat.k@gmail.com",
    phone: "094-111-2233",
    faculty: "คณะศิลปศาสตร์",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-06-11",
    status: "active",
    accumulatedCredits: 3,
  },
  {
    id: "u5",
    studentCode: "CB6801005",
    name: "วีระชัย สุขสมบูรณ์",
    email: "weerachai.s@gmail.com",
    phone: "086-555-7788",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-06-18",
    status: "active",
    accumulatedCredits: 9,
  },
  {
    id: "u6",
    studentCode: "CB6801006",
    name: "ณัฏฐา บุญมาก",
    email: "nattha.b@gmail.com",
    phone: "081-999-0011",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    educationLevel: "ปริญญาโท",
    registeredAt: "2026-06-25",
    status: "active",
    accumulatedCredits: 15,
  },
  {
    id: "u7",
    studentCode: "CB6801007",
    name: "ธีรภัทร อินทรีย์",
    email: "teerapat.i@gmail.com",
    phone: "092-333-4455",
    faculty: "คณะวิศวกรรมศาสตร์",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-07-02",
    status: "active",
    accumulatedCredits: 0,
  },
  {
    id: "u8",
    studentCode: "CB6801008",
    name: "มนัสนันท์ ชัยวัฒน์",
    email: "manatsanan.c@gmail.com",
    phone: "083-777-8899",
    faculty: "คณะศิลปศาสตร์",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-07-08",
    status: "inactive",
    accumulatedCredits: 6,
  },
  {
    id: "u9",
    studentCode: "CB6801009",
    name: "ภานุวัฒน์ เจริญสุข",
    email: "panuwat.j@gmail.com",
    phone: "095-222-3344",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    educationLevel: "ปริญญาโท",
    registeredAt: "2026-07-15",
    status: "active",
    accumulatedCredits: 18,
  },
  {
    id: "u10",
    studentCode: "CB6801010",
    name: "รัตนาภรณ์ พงษ์ไพบูลย์",
    email: "rattanaporn.p@gmail.com",
    phone: "087-444-5566",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    educationLevel: "ปริญญาตรี",
    registeredAt: "2026-07-21",
    status: "active",
    accumulatedCredits: 3,
  },
];

export function getStudentById(id: string): AdminStudent | undefined {
  return students.find((s) => s.id === id);
}

export function getStudentName(id: string): string {
  return getStudentById(id)?.name ?? "ไม่พบข้อมูลผู้เรียน";
}

/* -------------------------------------------------------------------------- */
/* Payments                                                                   */
/* -------------------------------------------------------------------------- */

export const payments: AdminPayment[] = [
  {
    id: "pay1",
    reference: "PAY-2608-0041",
    studentId: "u1",
    itemName: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    itemType: "program",
    amount: 18000,
    method: "bank-transfer",
    state: "pending-verification",
    dueDate: "2026-08-05",
    submittedAt: "2026-07-31",
    slipUrl: "/images/mock-slip.png",
    slipNote: "โอนจากบัญชีของผู้ปกครอง ชื่อบัญชี สมหญิง เรืองวิทย์",
  },
  {
    id: "pay2",
    reference: "PAY-2608-0042",
    studentId: "u3",
    itemName: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    itemType: "program",
    amount: 16500,
    method: "qr-promptpay",
    state: "pending-verification",
    dueDate: "2026-08-03",
    submittedAt: "2026-07-31",
    slipUrl: "/images/mock-slip.png",
  },
  {
    id: "pay3",
    reference: "PAY-2608-0043",
    studentId: "u5",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    itemType: "subject",
    amount: 3500,
    method: "bank-transfer",
    state: "pending-verification",
    dueDate: "2026-08-02",
    submittedAt: "2026-07-30",
    slipUrl: "/images/mock-slip.png",
    slipNote: "ยอดโอนรวมค่าธรรมเนียมธนาคาร 10 บาท",
  },
  {
    id: "pay4",
    reference: "PAY-2608-0044",
    studentId: "u6",
    itemName: "ระเบียบวิธีวิจัยเบื้องต้น",
    itemType: "subject",
    amount: 4200,
    method: "qr-promptpay",
    state: "pending-verification",
    dueDate: "2026-08-06",
    submittedAt: "2026-07-30",
    slipUrl: "/images/mock-slip.png",
  },
  {
    id: "pay5",
    reference: "PAY-2608-0045",
    studentId: "u9",
    itemName: "หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์",
    itemType: "program",
    amount: 22000,
    method: "bank-transfer",
    state: "pending-verification",
    dueDate: "2026-08-08",
    submittedAt: "2026-07-29",
    slipUrl: "/images/mock-slip.png",
  },
  {
    id: "pay6",
    reference: "PAY-2607-0038",
    studentId: "u2",
    itemName: "หลักการตลาดดิจิทัล",
    itemType: "subject",
    amount: 3800,
    method: "bank-transfer",
    state: "payment-confirmed",
    dueDate: "2026-07-25",
    submittedAt: "2026-07-22",
    slipUrl: "/images/mock-slip.png",
    reviewedByStaffId: "st2",
    reviewedAt: "2026-07-23",
  },
  {
    id: "pay7",
    reference: "PAY-2607-0039",
    studentId: "u4",
    itemName: "การคิดเชิงออกแบบ",
    itemType: "subject",
    amount: 3600,
    method: "qr-promptpay",
    state: "payment-confirmed",
    dueDate: "2026-07-26",
    submittedAt: "2026-07-24",
    slipUrl: "/images/mock-slip.png",
    reviewedByStaffId: "st2",
    reviewedAt: "2026-07-25",
  },
  {
    id: "pay8",
    reference: "PAY-2607-0036",
    studentId: "u7",
    itemName: "โครงสร้างข้อมูลและอัลกอริทึม",
    itemType: "subject",
    amount: 4000,
    method: "bank-transfer",
    state: "payment-rejected",
    dueDate: "2026-07-20",
    submittedAt: "2026-07-18",
    slipUrl: "/images/mock-slip.png",
    reviewedByStaffId: "st3",
    reviewedAt: "2026-07-19",
    rejectionReason: "ยอดเงินในสลิปไม่ตรงกับยอดที่ต้องชำระ (โอนมา 3,000 บาท จากยอด 4,000 บาท)",
  },
  {
    id: "pay9",
    reference: "PAY-2607-0031",
    studentId: "u8",
    itemName: "การสื่อสารภาษาอังกฤษเพื่อการทำงาน",
    itemType: "subject",
    amount: 3200,
    method: "bank-transfer",
    state: "payment-refunded",
    dueDate: "2026-07-10",
    submittedAt: "2026-07-08",
    slipUrl: "/images/mock-slip.png",
    reviewedByStaffId: "st2",
    reviewedAt: "2026-07-09",
    refundedAt: "2026-07-19",
    refundReason: "ผู้เรียนขอยกเลิกก่อนวันเปิดเรียน ตามระเบียบคืนเงินเต็มจำนวน",
  },
  {
    id: "pay10",
    reference: "PAY-2608-0046",
    studentId: "u10",
    itemName: "บัญชีเบื้องต้นสำหรับผู้ประกอบการ",
    itemType: "subject",
    amount: 3400,
    method: "bank-transfer",
    state: "payment-required",
    dueDate: "2026-07-28",
  },
  {
    id: "pay11",
    reference: "PAY-2608-0047",
    studentId: "u7",
    itemName: "หลักสูตรประกาศนียบัตรการตลาดดิจิทัล",
    itemType: "program",
    amount: 15000,
    method: "bank-transfer",
    state: "payment-required",
    dueDate: "2026-08-12",
  },
  {
    id: "pay12",
    reference: "PAY-2607-0029",
    studentId: "u2",
    itemName: "สถิติเบื้องต้นสำหรับนักวิจัย",
    itemType: "subject",
    amount: 3900,
    method: "qr-promptpay",
    state: "payment-cancelled",
    dueDate: "2026-07-05",
  },
];

export function getPaymentById(id: string): AdminPayment | undefined {
  return payments.find((p) => p.id === id);
}

/** Payments an officer still has to act on, oldest submission first. */
export function getPendingPayments(): AdminPayment[] {
  return payments
    .filter((p) => p.state === "pending-verification")
    .sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
}

export const bankAccounts: BankAccount[] = [
  {
    id: "bank1",
    bankName: "ธนาคารกรุงเทพ",
    accountName: "มหาวิทยาลัยธรรมศาสตร์ (Credit Bank)",
    accountNumber: "091-3-45678-9",
    branch: "ท่าพระจันทร์",
    isPrimary: true,
  },
  {
    id: "bank2",
    bankName: "ธนาคารกสิกรไทย",
    accountName: "มหาวิทยาลัยธรรมศาสตร์ (Credit Bank)",
    accountNumber: "003-8-76543-2",
    branch: "ศูนย์รังสิต",
    isPrimary: false,
  },
];

/* -------------------------------------------------------------------------- */
/* Registrations                                                              */
/* -------------------------------------------------------------------------- */

export const registrations: AdminRegistration[] = [
  {
    id: "reg1",
    reference: "REG-2608-0101",
    studentId: "u1",
    itemId: "p1",
    itemType: "program",
    itemName: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    term: "ภาคต้น 2569",
    status: "awaiting-payment",
    registeredAt: "2026-07-30",
    paymentId: "pay1",
    credits: 12,
  },
  {
    id: "reg2",
    reference: "REG-2608-0102",
    studentId: "u3",
    itemId: "p2",
    itemType: "program",
    itemName: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    term: "ภาคต้น 2569",
    status: "awaiting-payment",
    registeredAt: "2026-07-30",
    paymentId: "pay2",
    credits: 12,
  },
  {
    id: "reg3",
    reference: "REG-2607-0098",
    studentId: "u2",
    itemId: "s3",
    itemType: "subject",
    itemName: "หลักการตลาดดิจิทัล",
    term: "ภาคต้น 2569",
    status: "active",
    registeredAt: "2026-07-21",
    paymentId: "pay6",
    credits: 3,
  },
  {
    id: "reg4",
    reference: "REG-2607-0099",
    studentId: "u4",
    itemId: "s7",
    itemType: "subject",
    itemName: "การคิดเชิงออกแบบ",
    term: "ภาคต้น 2569",
    status: "active",
    registeredAt: "2026-07-23",
    paymentId: "pay7",
    credits: 3,
  },
  {
    id: "reg5",
    reference: "REG-2607-0094",
    studentId: "u7",
    itemId: "s4",
    itemType: "subject",
    itemName: "โครงสร้างข้อมูลและอัลกอริทึม",
    term: "ภาคต้น 2569",
    status: "awaiting-payment",
    registeredAt: "2026-07-17",
    paymentId: "pay8",
    credits: 3,
  },
  {
    id: "reg6",
    reference: "REG-2606-0071",
    studentId: "u6",
    itemId: "s2",
    itemType: "subject",
    itemName: "สถิติเบื้องต้นสำหรับนักวิจัย",
    term: "ภาคปลาย 2568",
    status: "completed",
    registeredAt: "2026-01-12",
    credits: 3,
  },
  {
    id: "reg7",
    reference: "REG-2606-0072",
    studentId: "u9",
    itemId: "s6",
    itemType: "subject",
    itemName: "ระเบียบวิธีวิจัยเบื้องต้น",
    term: "ภาคปลาย 2568",
    status: "completed",
    registeredAt: "2026-01-15",
    credits: 3,
  },
  {
    id: "reg8",
    reference: "REG-2607-0088",
    studentId: "u8",
    itemId: "s5",
    itemType: "subject",
    itemName: "การสื่อสารภาษาอังกฤษเพื่อการทำงาน",
    term: "ภาคต้น 2569",
    status: "cancelled",
    registeredAt: "2026-07-07",
    paymentId: "pay9",
    credits: 3,
  },
  {
    id: "reg9",
    reference: "REG-2608-0103",
    studentId: "u5",
    itemId: "s1",
    itemType: "subject",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    term: "ภาคต้น 2569",
    status: "awaiting-payment",
    registeredAt: "2026-07-29",
    paymentId: "pay3",
    credits: 3,
  },
  {
    id: "reg10",
    reference: "REG-2608-0104",
    studentId: "u9",
    itemId: "p6",
    itemType: "program",
    itemName: "หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์",
    term: "ภาคต้น 2569",
    status: "awaiting-payment",
    registeredAt: "2026-07-28",
    paymentId: "pay5",
    credits: 15,
  },
  {
    id: "reg11",
    reference: "REG-2608-0105",
    studentId: "u10",
    itemId: "s8",
    itemType: "subject",
    itemName: "บัญชีเบื้องต้นสำหรับผู้ประกอบการ",
    term: "ภาคต้น 2569",
    status: "awaiting-payment",
    registeredAt: "2026-07-27",
    paymentId: "pay10",
    credits: 3,
  },
  {
    id: "reg12",
    reference: "REG-2606-0065",
    studentId: "u1",
    itemId: "s1",
    itemType: "subject",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    term: "ภาคปลาย 2568",
    status: "completed",
    registeredAt: "2026-01-08",
    credits: 3,
  },
];

export function getRegistrationsByStudent(studentId: string): AdminRegistration[] {
  return registrations.filter((r) => r.studentId === studentId);
}

export function getPaymentsByStudent(studentId: string): AdminPayment[] {
  return payments.filter((p) => p.studentId === studentId);
}

export const waitlistEntries: WaitlistEntry[] = [
  {
    id: "wl1",
    studentId: "u4",
    itemId: "s1",
    itemType: "subject",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    position: 1,
    requestedAt: "2026-07-26",
    status: "seat-offered",
  },
  {
    id: "wl2",
    studentId: "u10",
    itemId: "s1",
    itemType: "subject",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    position: 2,
    requestedAt: "2026-07-28",
    status: "waiting",
  },
  {
    id: "wl3",
    studentId: "u7",
    itemId: "s4",
    itemType: "subject",
    itemName: "โครงสร้างข้อมูลและอัลกอริทึม",
    position: 1,
    requestedAt: "2026-07-29",
    status: "waiting",
  },
  {
    id: "wl4",
    studentId: "u8",
    itemId: "p1",
    itemType: "program",
    itemName: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    position: 1,
    requestedAt: "2026-07-12",
    status: "expired",
  },
];

/* -------------------------------------------------------------------------- */
/* Credit transfer                                                            */
/* -------------------------------------------------------------------------- */

export const partnerInstitutions: PartnerInstitution[] = [
  {
    id: "inst1",
    name: "จุฬาลงกรณ์มหาวิทยาลัย",
    nameEn: "Chulalongkorn University",
    country: "ไทย",
    agreementType: "mou",
    status: "active",
    caseCount: 14,
  },
  {
    id: "inst2",
    name: "มหาวิทยาลัยเชียงใหม่",
    nameEn: "Chiang Mai University",
    country: "ไทย",
    agreementType: "network",
    status: "active",
    caseCount: 8,
  },
  {
    id: "inst3",
    name: "มหาวิทยาลัยขอนแก่น",
    nameEn: "Khon Kaen University",
    country: "ไทย",
    agreementType: "network",
    status: "active",
    caseCount: 5,
  },
  {
    id: "inst4",
    name: "National University of Singapore",
    nameEn: "National University of Singapore",
    country: "สิงคโปร์",
    agreementType: "mou",
    status: "active",
    caseCount: 3,
  },
  {
    id: "inst5",
    name: "มหาวิทยาลัยสงขลานครินทร์",
    nameEn: "Prince of Songkla University",
    country: "ไทย",
    agreementType: "case-by-case",
    status: "paused",
    caseCount: 1,
  },
];

export const transferCases: TransferCase[] = [
  {
    id: "tr1",
    reference: "TRF-2608-0021",
    studentId: "u3",
    type: "in",
    institution: "จุฬาลงกรณ์มหาวิทยาลัย",
    state: "submitted",
    submittedAt: "2026-07-30",
    dueAt: "2026-08-06",
    subjects: [
      {
        id: "trs1",
        externalCode: "2110101",
        externalName: "Computer Programming",
        externalCredits: 3,
        externalGrade: "A",
        decision: "pending",
      },
      {
        id: "trs2",
        externalCode: "2301107",
        externalName: "Statistics for Research",
        externalCredits: 3,
        externalGrade: "B+",
        decision: "pending",
      },
    ],
    evidence: [
      { id: "ev1", name: "transcript-chula.pdf", fileType: "pdf", size: "1.2 MB", uploadedAt: "2026-07-30" },
      { id: "ev2", name: "course-syllabus.pdf", fileType: "pdf", size: "840 KB", uploadedAt: "2026-07-30" },
    ],
  },
  {
    id: "tr2",
    reference: "TRF-2608-0022",
    studentId: "u6",
    type: "in",
    institution: "มหาวิทยาลัยเชียงใหม่",
    state: "under-review",
    submittedAt: "2026-07-28",
    dueAt: "2026-08-04",
    subjects: [
      {
        id: "trs3",
        externalCode: "751100",
        externalName: "Principles of Marketing",
        externalCredits: 3,
        externalGrade: "A",
        tuSubjectId: "s3",
        tuCredits: 3,
        decision: "accepted",
      },
      {
        id: "trs4",
        externalCode: "703103",
        externalName: "Introduction to Accounting",
        externalCredits: 3,
        externalGrade: "C+",
        decision: "pending",
      },
    ],
    evidence: [
      { id: "ev3", name: "transcript-cmu.pdf", fileType: "pdf", size: "980 KB", uploadedAt: "2026-07-28" },
    ],
    reviewedByStaffId: "st3",
  },
  {
    id: "tr3",
    reference: "TRF-2607-0018",
    studentId: "u9",
    type: "out",
    institution: "National University of Singapore",
    state: "approved",
    submittedAt: "2026-07-14",
    dueAt: "2026-07-21",
    subjects: [
      {
        id: "trs5",
        externalCode: "CS1010",
        externalName: "Programming Methodology",
        externalCredits: 4,
        externalGrade: "A-",
        tuSubjectId: "s1",
        tuCredits: 3,
        decision: "accepted",
      },
    ],
    evidence: [
      { id: "ev4", name: "tu-transcript.pdf", fileType: "pdf", size: "620 KB", uploadedAt: "2026-07-14" },
      { id: "ev5", name: "acceptance-letter.pdf", fileType: "pdf", size: "410 KB", uploadedAt: "2026-07-14" },
    ],
    reviewedByStaffId: "st1",
    reviewedAt: "2026-07-18",
    reviewNote: "เอกสารครบถ้วน หน่วยกิตตรงตามเกณฑ์ อนุมัติให้โอนออกได้",
  },
  {
    id: "tr4",
    reference: "TRF-2607-0016",
    studentId: "u1",
    type: "in",
    institution: "มหาวิทยาลัยขอนแก่น",
    state: "changes-requested",
    submittedAt: "2026-07-10",
    dueAt: "2026-07-17",
    subjects: [
      {
        id: "trs6",
        externalCode: "322101",
        externalName: "Design Thinking",
        externalCredits: 3,
        externalGrade: "B",
        decision: "pending",
      },
    ],
    evidence: [
      { id: "ev6", name: "transcript-kku.jpg", fileType: "jpg", size: "2.4 MB", uploadedAt: "2026-07-10" },
    ],
    reviewedByStaffId: "st3",
    reviewedAt: "2026-07-13",
    reviewNote: "ทรานสคริปต์ที่ส่งมาเป็นภาพถ่าย อ่านเกรดไม่ชัด กรุณาส่งฉบับ PDF ที่ออกโดยสถาบัน",
  },
  {
    id: "tr5",
    reference: "TRF-2607-0012",
    studentId: "u2",
    type: "in",
    institution: "มหาวิทยาลัยสงขลานครินทร์",
    state: "rejected",
    submittedAt: "2026-07-02",
    dueAt: "2026-07-09",
    subjects: [
      {
        id: "trs7",
        externalCode: "460101",
        externalName: "Business English",
        externalCredits: 2,
        externalGrade: "D+",
        decision: "rejected",
      },
    ],
    evidence: [
      { id: "ev7", name: "transcript-psu.pdf", fileType: "pdf", size: "710 KB", uploadedAt: "2026-07-02" },
    ],
    reviewedByStaffId: "st1",
    reviewedAt: "2026-07-07",
    reviewNote: "ผลการเรียนต่ำกว่าเกณฑ์ขั้นต่ำ (ต้องได้ C ขึ้นไป) และหน่วยกิตไม่ครบตามรายวิชาเทียบเคียง",
  },
  {
    id: "tr6",
    reference: "TRF-2606-0009",
    studentId: "u5",
    type: "out",
    institution: "มหาวิทยาลัยเชียงใหม่",
    state: "withdrawn",
    submittedAt: "2026-06-20",
    dueAt: "2026-06-27",
    subjects: [
      {
        id: "trs8",
        externalCode: "—",
        externalName: "การเขียนโปรแกรมเบื้องต้น",
        externalCredits: 3,
        externalGrade: "B+",
        decision: "pending",
      },
    ],
    evidence: [],
    reviewNote: "ผู้เรียนแจ้งถอนคำขอเอง",
  },
];

export function getTransferCaseById(id: string): TransferCase | undefined {
  return transferCases.find((t) => t.id === id);
}

/** Cases still sitting on an officer's desk, oldest first. */
export function getOpenTransferCases(): TransferCase[] {
  const open = new Set(["submitted", "under-review", "changes-requested"]);
  return transferCases
    .filter((t) => open.has(t.state))
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
}

/* -------------------------------------------------------------------------- */
/* Academic calendar                                                          */
/* -------------------------------------------------------------------------- */

export const academicTerms: AcademicTerm[] = [
  {
    id: "term1",
    name: "ภาคต้น 2569",
    startDate: "2026-08-17",
    endDate: "2026-12-18",
    registrationOpensAt: "2026-06-15",
    registrationClosesAt: "2026-08-10",
    status: "open",
  },
  {
    id: "term2",
    name: "ภาคปลาย 2569",
    startDate: "2027-01-11",
    endDate: "2027-05-14",
    registrationOpensAt: "2026-11-16",
    registrationClosesAt: "2027-01-05",
    status: "planned",
  },
  {
    id: "term3",
    name: "ภาคปลาย 2568",
    startDate: "2026-01-12",
    endDate: "2026-05-15",
    registrationOpensAt: "2025-11-17",
    registrationClosesAt: "2026-01-06",
    status: "closed",
  },
];

export const currentTerm = academicTerms[0];

/* -------------------------------------------------------------------------- */
/* Audit trail                                                                */
/* -------------------------------------------------------------------------- */

export const auditEntries: AuditEntry[] = [
  { id: "a1", staffId: "st2", action: "อนุมัติการชำระเงิน", target: "PAY-2607-0039", at: "2026-07-25" },
  { id: "a2", staffId: "st3", action: "ขอให้แก้ไขคำขอเทียบโอน", target: "TRF-2607-0016", at: "2026-07-13" },
  { id: "a3", staffId: "st2", action: "ปฏิเสธการชำระเงิน", target: "PAY-2607-0036", at: "2026-07-19" },
  { id: "a4", staffId: "st1", action: "อนุมัติคำขอเทียบโอน", target: "TRF-2607-0018", at: "2026-07-18" },
  { id: "a5", staffId: "st1", action: "ระงับบัญชีเจ้าหน้าที่", target: "จิราภรณ์ แสงทอง", at: "2026-06-12" },
];
