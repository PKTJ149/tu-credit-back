/**
 * Mock data for phase 6b: help center, content pages, legal documents, media.
 *
 * Same rules as `mock-data.ts` — fixed dates, no `new Date()`, one shared
 * world every screen in this area reads from. Ids for records a screen can
 * add at runtime (a new help article, a new legal version) come from the
 * counters below rather than `Date.now()`, so a prototype session replays
 * identically.
 *
 * Help category ids/labels mirror `components/discovery/help-center.tsx`
 * verbatim (that file is student-side and never imported from here — these
 * are plain string literals, not a shared import) so an officer edits the
 * same six categories a ผู้เรียน actually sees.
 */

import type { HelpArticle, LegalDocument, MediaAsset, StaticPage } from "./types";

/* -------------------------------------------------------------------------- */
/* Shared publish-state vocabulary for this content area                     */
/* -------------------------------------------------------------------------- */


/** Re-exported so existing call sites keep working; the labels and tones live
 *  in `lib/admin/publish-state.ts`, the single source for this lifecycle. */
export { publishStateLabel, publishStateTone } from "./publish-state";

/* -------------------------------------------------------------------------- */
/* Help center                                                                */
/* -------------------------------------------------------------------------- */

/** The six categories declared in `components/discovery/help-center.tsx`,
 *  in the order the learner site renders them. */
export const helpCategoryOrder = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export const helpCategoryLabel: Record<string, string> = {
  h1: "การสมัครสมาชิกและเข้าสู่ระบบ",
  h2: "การลงทะเบียนรายวิชาและหลักสูตร",
  h3: "การชำระเงินและใบเสร็จ",
  h4: "การเทียบโอนหน่วยกิต",
  h5: "การติดตามผลการเรียน",
  h6: "การแก้ไขข้อมูลโปรไฟล์",
};

export const helpCategoryDescription: Record<string, string> = {
  h1: "วิธีสร้างบัญชี ยืนยันตัวตน และแก้ปัญหาการเข้าสู่ระบบ",
  h2: "ขั้นตอนการเลือก ลงทะเบียน และตรวจสอบสถานะการลงทะเบียน",
  h3: "วิธีชำระเงิน ส่งหลักฐาน และดาวน์โหลดเอกสารทางการเงิน",
  h4: "ขั้นตอนการยื่นคำขอเทียบโอนเข้าและออก พร้อมหลักฐานที่ต้องเตรียม",
  h5: "วิธีตรวจสอบหน่วยกิตสะสมและประวัติผลการเรียน",
  h6: "วิธีอัปเดตข้อมูลส่วนตัวและข้อมูลการศึกษาในโปรไฟล์",
};

export const helpArticles: HelpArticle[] = [
  // h1 — การสมัครสมาชิกและเข้าสู่ระบบ
  {
    id: "ha1",
    categoryId: "h1",
    question: "จะสมัครสมาชิกด้วยอีเมลมหาวิทยาลัยได้อย่างไร",
    answer:
      "เลือกประเภทผู้สมัคร \"นักศึกษา มธ.\" ในหน้าสมัครสมาชิก แล้วกรอกรหัสนักศึกษา คณะ/สาขาวิชา และอีเมลที่ลงท้ายด้วย @tu.ac.th ระบบจะยืนยันตัวตนผ่านอีเมลนี้เท่านั้น หากไม่มีอีเมลมหาวิทยาลัยให้สมัครเป็น \"บุคคลทั่วไป\" แทน",
    state: "published",
    order: 1,
    updatedAt: "2026-06-02",
    viewCount: 812,
  },
  {
    id: "ha2",
    categoryId: "h1",
    question: "ลืมรหัสผ่านต้องทำอย่างไร",
    answer:
      "กดลิงก์ \"ลืมรหัสผ่าน\" ที่หน้าเข้าสู่ระบบ แล้วกรอกอีเมลที่ใช้สมัคร ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้ ลิงก์มีอายุ 30 นาที หากหมดอายุให้ขอลิงก์ใหม่อีกครั้ง",
    state: "published",
    order: 2,
    updatedAt: "2026-07-10",
    viewCount: 1290,
  },
  {
    id: "ha3",
    categoryId: "h1",
    question: "เข้าสู่ระบบไม่ได้ ขึ้นข้อความ Invalid credentials",
    answer:
      "ข้อความนี้มักเกิดจากอีเมลหรือรหัสผ่านพิมพ์ผิด หรือบัญชียังไม่ได้ยืนยันตัวตนหลังสมัคร ลองรีเซ็ตรหัสผ่านก่อน หากยังเข้าไม่ได้ให้ติดต่อเจ้าหน้าที่พร้อมแจ้งอีเมลที่ใช้สมัคร",
    state: "published",
    order: 3,
    updatedAt: "2026-05-20",
    viewCount: 430,
  },

  // h2 — การลงทะเบียนรายวิชาและหลักสูตร
  {
    id: "ha4",
    categoryId: "h2",
    question: "เลือกรายวิชาหรือหลักสูตรอย่างไรให้ตรงกับความสนใจ",
    answer:
      "ใช้ตัวกรองคณะและระดับการศึกษาในหน้ารายวิชา/หลักสูตร แต่ละรายการมีคำโปรยสั้น ผลลัพธ์การเรียนรู้ และคุณสมบัติผู้เรียนให้เทียบก่อนตัดสินใจลงทะเบียน",
    state: "published",
    order: 1,
    updatedAt: "2026-06-18",
    viewCount: 260,
  },
  {
    id: "ha5",
    categoryId: "h2",
    question: "ลงทะเบียนแล้วสถานะขึ้นว่า \"รอชำระเงิน\" ต้องทำอย่างไรต่อ",
    answer:
      "สถานะนี้แปลว่าที่นั่งถูกจองไว้ชั่วคราวแล้ว แต่การลงทะเบียนจะยืนยันสมบูรณ์ก็ต่อเมื่อชำระเงินและได้รับการตรวจสอบแล้วเท่านั้น ไปที่เมนูการชำระเงินเพื่อโอนเงินหรือสแกน QR ภายในกำหนดที่ระบุ",
    state: "published",
    order: 2,
    updatedAt: "2026-07-22",
    viewCount: 940,
  },
  {
    id: "ha6",
    categoryId: "h2",
    question: "ถ้าที่นั่งเต็ม ระบบรอที่นั่ง (Waitlist) ทำงานอย่างไร",
    answer:
      "เมื่อรายวิชาเต็ม ระบบจะเสนอให้เข้าคิวรอที่นั่งตามลำดับการสมัคร หากมีผู้เรียนสละสิทธิ์ ระบบจะเสนอที่นั่งให้ผู้ที่อยู่ลำดับถัดไปโดยอัตโนมัติ และแจ้งเตือนให้ชำระเงินภายในเวลาที่กำหนด",
    state: "published",
    order: 3,
    updatedAt: "2026-06-30",
    viewCount: 512,
  },

  // h3 — การชำระเงินและใบเสร็จ
  {
    id: "ha7",
    categoryId: "h3",
    question: "ช่องทางการชำระเงินที่รองรับมีอะไรบ้าง",
    answer:
      "รองรับ 2 ช่องทาง คือโอนผ่านบัญชีธนาคารของมหาวิทยาลัย และสแกน QR พร้อมเพย์ เลือกช่องทางในหน้าชำระเงิน แล้วอัปโหลดหลักฐานการโอนเพื่อให้เจ้าหน้าที่ตรวจสอบ",
    state: "published",
    order: 1,
    updatedAt: "2026-06-10",
    viewCount: 610,
  },
  {
    id: "ha8",
    categoryId: "h3",
    question: "อัปโหลดสลิปแล้วสถานะยังไม่เปลี่ยน ต้องรอกี่วัน",
    answer:
      "เจ้าหน้าที่การเงินตรวจสอบสลิปภายใน 1-2 วันทำการ หากยอดเงินหรือชื่อบัญชีในสลิปไม่ตรงกับยอดที่ต้องชำระ ระบบจะปฏิเสธพร้อมเหตุผลที่ระบุไว้ในประวัติการชำระเงินของผู้เรียน",
    state: "published",
    order: 2,
    updatedAt: "2026-07-15",
    viewCount: 705,
  },
  {
    id: "ha9",
    categoryId: "h3",
    question: "สแกน QR พร้อมเพย์ไม่ได้ หรือสแกนแล้วชำระไม่สำเร็จ",
    answer:
      "ตรวจสอบว่าแอปธนาคารรองรับพร้อมเพย์และยอดเงินในบัญชีเพียงพอ หาก QR หมดอายุให้กลับไปหน้าชำระเงินเพื่อสร้าง QR ใหม่ กรณีตัดเงินแล้วแต่สถานะไม่เปลี่ยน ให้แนบสลิปและติดต่อเจ้าหน้าที่การเงินโดยตรง ไม่ต้องชำระซ้ำ",
    state: "published",
    order: 3,
    updatedAt: "2026-07-29",
    viewCount: 1840,
  },

  // h4 — การเทียบโอนหน่วยกิต
  {
    id: "ha10",
    categoryId: "h4",
    question: "ยื่นคำขอเทียบโอนหน่วยกิตเข้าใช้เอกสารอะไรบ้าง",
    answer:
      "ต้องแนบทรานสคริปต์ฉบับที่สถาบันต้นทางออกให้ (ไฟล์ PDF เท่านั้น ไม่รับภาพถ่าย) และเอกสารประมวลรายวิชา (course syllabus) ของรายวิชาที่ขอเทียบโอนแต่ละรายวิชา",
    state: "published",
    order: 1,
    updatedAt: "2026-07-02",
    viewCount: 388,
  },
  {
    id: "ha11",
    categoryId: "h4",
    question: "เทียบโอนออกไปสถาบันอื่นใช้เวลานานเท่าไหร่",
    answer:
      "โดยทั่วไปเจ้าหน้าที่พิจารณาให้แล้วเสร็จภายใน 7 วันทำการนับจากวันที่ยื่นคำขอครบถ้วน ผู้เรียนตรวจสอบสถานะและผลการพิจารณาได้ที่หน้าประวัติคำขอเทียบโอนของตนเองตลอดเวลา",
    state: "published",
    order: 2,
    updatedAt: "2026-06-25",
    viewCount: 176,
  },

  // h5 — การติดตามผลการเรียน
  {
    id: "ha12",
    categoryId: "h5",
    question: "ตรวจสอบหน่วยกิตสะสมได้จากที่ไหน",
    answer:
      "หน่วยกิตสะสมทั้งหมดแสดงอยู่ในหน้าโปรไฟล์ของผู้เรียน นับรวมทั้งรายวิชาที่เรียนจบแล้วและหน่วยกิตที่ได้รับอนุมัติจากการเทียบโอน อัปเดตทันทีที่เจ้าหน้าที่บันทึกผลการเรียน",
    state: "published",
    order: 1,
    updatedAt: "2026-06-05",
    viewCount: 322,
  },
  {
    id: "ha13",
    categoryId: "h5",
    question: "ผลการเรียนยังไม่ขึ้น ทั้งที่เรียนจบแล้ว ต้องรอกี่วัน",
    answer:
      "อาจารย์ผู้สอนมีเวลาบันทึกและส่งผลการเรียนภายใน 14 วันหลังวันสอบสุดท้ายของภาคการศึกษา หากเลยกำหนดแล้วยังไม่ขึ้น ให้ติดต่อเจ้าหน้าที่งานทะเบียนพร้อมแจ้งรหัสวิชาและภาคการศึกษา",
    state: "draft",
    order: 2,
    updatedAt: "2026-07-27",
    viewCount: 244,
  },

  // h6 — การแก้ไขข้อมูลโปรไฟล์
  {
    id: "ha14",
    categoryId: "h6",
    question: "แก้ไขเบอร์โทรศัพท์หรืออีเมลติดต่อได้ที่ไหน",
    answer:
      "ไปที่หน้าโปรไฟล์ผู้เรียน เลือก \"แก้ไขข้อมูลส่วนตัว\" แล้วอัปเดตเบอร์โทรศัพท์หรืออีเมลติดต่อได้ทันที ส่วนอีเมลมหาวิทยาลัย (@tu.ac.th) ที่ใช้ยืนยันตัวตนไม่สามารถเปลี่ยนเองได้",
    state: "published",
    order: 1,
    updatedAt: "2026-05-28",
    viewCount: 198,
  },
  {
    id: "ha15",
    categoryId: "h6",
    question: "เปลี่ยนคณะ/สาขาในโปรไฟล์ได้หรือไม่",
    answer:
      "คำตอบนี้อ้างอิงขั้นตอนเดิมที่ปิดใช้งานแล้ว การเปลี่ยนคณะ/สาขาต้องยื่นคำร้องผ่านงานทะเบียนโดยตรง ไม่สามารถแก้ไขเองผ่านหน้าโปรไฟล์",
    state: "archived",
    order: 2,
    updatedAt: "2026-04-11",
    viewCount: 54,
  },
];

let helpArticleSeq = helpArticles.length;

/** Ids for help articles added at runtime — a counter, never `Date.now()`,
 *  so a prototype session replays the same way twice. */
export function nextHelpArticleId(): string {
  helpArticleSeq += 1;
  return `ha${helpArticleSeq}`;
}

/** Highest-viewed article per category, used to flag when the most-opened
 *  answer in a category is not sitting at the top of it — the one signal
 *  that turns FAQ ordering from a guess into a decision. */
export function topViewedArticleId(categoryId: string, articles: HelpArticle[]): string | undefined {
  const inCategory = articles.filter((a) => a.categoryId === categoryId);
  if (inCategory.length === 0) return undefined;
  return inCategory.reduce((top, a) => (a.viewCount > top.viewCount ? a : top)).id;
}

/* -------------------------------------------------------------------------- */
/* Static content pages                                                      */
/* -------------------------------------------------------------------------- */

export const staticPages: StaticPage[] = [
  {
    id: "page-about",
    slug: "about",
    title: "เกี่ยวกับ Credit Bank",
    sections: [
      {
        id: "page-about-s1",
        heading: "Credit Bank คืออะไร",
        body: "Credit Bank เป็นระบบสะสมและเทียบโอนหน่วยกิตของมหาวิทยาลัยธรรมศาสตร์ พัฒนาขึ้นเพื่อรองรับการเรียนรู้ตลอดชีวิตที่ยืดหยุ่นและเข้าถึงได้ง่ายขึ้น สำหรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอก",
      },
      {
        id: "page-about-s2",
        heading: "เหตุผลที่ระบบนี้มีอยู่",
        body: "การเรียนรู้ในปัจจุบันไม่จำเป็นต้องเกิดขึ้นในรูปแบบเดียวอีกต่อไป Credit Bank ถูกสร้างขึ้นเพื่อให้ผู้เรียนสามารถสะสมความรู้จากหลายแหล่ง และเทียบโอนหน่วยกิตระหว่างสถาบันได้อย่างเป็นระบบ โปร่งใส และตรวจสอบได้",
      },
      {
        id: "page-about-s3",
        heading: "การกำกับดูแลและมาตรฐาน",
        body: "หลักสูตร รายวิชา และกระบวนการเทียบโอนหน่วยกิตทั้งหมดดำเนินการภายใต้การกำกับดูแลของมหาวิทยาลัยธรรมศาสตร์ และเป็นไปตามเกณฑ์มาตรฐานทางวิชาการที่มหาวิทยาลัยกำหนด",
      },
    ],
    state: "published",
    updatedAt: "2026-07-05",
    updatedByStaffId: "st1",
  },
  {
    id: "page-contact",
    slug: "contact",
    title: "ติดต่อเรา",
    sections: [
      {
        id: "page-contact-s1",
        heading: "ช่องทางติดต่อสำนักงาน Credit Bank",
        body: "โทรศัพท์ 02-613-2000 ต่อ 1234 (จันทร์-ศุกร์ 08:30-16:30 น.) อีเมล creditbank@tu.ac.th ตอบกลับภายใน 2 วันทำการ",
      },
      {
        id: "page-contact-s2",
        heading: "ที่ตั้งสำนักงาน",
        body: "สำนักงาน Credit Bank อาคารเรียนรวม ชั้น 2 มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต เลขที่ 99 หมู่ 18 ตำบลคลองหนึ่ง อำเภอคลองหลวง จังหวัดปทุมธานี 12120",
      },
      {
        id: "page-contact-s3",
        heading: "ช่องทางโซเชียลมีเดีย",
        body: "Facebook: TU Credit Bank | LINE Official: @tucreditbank สำหรับคำถามเร่งด่วนนอกเวลาทำการ",
      },
    ],
    state: "draft",
    updatedAt: "2026-07-28",
    updatedByStaffId: "st2",
  },
];

/* -------------------------------------------------------------------------- */
/* Legal documents — privacy, terms, cookie, each versioned                  */
/* -------------------------------------------------------------------------- */

export const legalDocuments: LegalDocument[] = [
  // Privacy policy — 3 versions, v2.1 current
  {
    id: "legal1",
    kind: "privacy",
    title: "นโยบายความเป็นส่วนตัว",
    version: "1.0",
    effectiveAt: "2026-01-15",
    body: "มหาวิทยาลัยธรรมศาสตร์เก็บรวบรวมข้อมูลส่วนบุคคลของผู้ใช้งาน Credit Bank เท่าที่จำเป็นต่อการให้บริการ ได้แก่ ชื่อ อีเมล เบอร์โทรศัพท์ และข้อมูลการศึกษา ฉบับนี้ถูกแทนที่แล้ว โปรดดูฉบับปัจจุบัน",
    state: "archived",
    updatedByStaffId: "st1",
  },
  {
    id: "legal2",
    kind: "privacy",
    title: "นโยบายความเป็นส่วนตัว",
    version: "2.0",
    effectiveAt: "2026-05-01",
    body: "ปรับปรุงขอบเขตการเก็บข้อมูลให้ครอบคลุมหลักฐานการชำระเงินและเอกสารเทียบโอนหน่วยกิต พร้อมระบุระยะเวลาจัดเก็บและสิทธิของเจ้าของข้อมูลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล ฉบับนี้ถูกแทนที่แล้ว โปรดดูฉบับปัจจุบัน",
    state: "archived",
    updatedByStaffId: "st1",
  },
  {
    id: "legal3",
    kind: "privacy",
    title: "นโยบายความเป็นส่วนตัว",
    version: "2.1",
    effectiveAt: "2026-07-15",
    body: "มหาวิทยาลัยธรรมศาสตร์เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของผู้ใช้งาน Credit Bank เท่าที่จำเป็นต่อการให้บริการเท่านั้น ได้แก่ ข้อมูลระบุตัวตน ข้อมูลการศึกษา หลักฐานการชำระเงิน และเอกสารประกอบการเทียบโอนหน่วยกิต\n\nข้อมูลจะถูกเก็บไว้ตลอดระยะเวลาที่ผู้ใช้งานมีสถานะเป็นสมาชิก และอีก 5 ปีหลังจากนั้นเพื่อวัตถุประสงค์ทางบัญชีและการตรวจสอบ ผู้ใช้งานมีสิทธิขอเข้าถึง แก้ไข หรือขอให้ลบข้อมูลของตนได้ตามที่กฎหมายกำหนด โดยติดต่อผ่านอีเมล creditbank@tu.ac.th",
    state: "published",
    updatedByStaffId: "st1",
  },

  // Terms of use — 2 versions, v1.1 current
  {
    id: "legal4",
    kind: "terms",
    title: "เงื่อนไขการใช้งาน",
    version: "1.0",
    effectiveAt: "2026-01-15",
    body: "ผู้ใช้งานต้องให้ข้อมูลที่ถูกต้องและเป็นความจริงในการสมัครสมาชิก และรับผิดชอบต่อการรักษาความปลอดภัยของบัญชีตนเอง ฉบับนี้ถูกแทนที่แล้ว โปรดดูฉบับปัจจุบัน",
    state: "archived",
    updatedByStaffId: "st1",
  },
  {
    id: "legal5",
    kind: "terms",
    title: "เงื่อนไขการใช้งาน",
    version: "1.1",
    effectiveAt: "2026-06-01",
    body: "การใช้งาน Credit Bank อยู่ภายใต้เงื่อนไขต่อไปนี้ ผู้ใช้งานต้องให้ข้อมูลที่ถูกต้องในการสมัครสมาชิกและการชำระเงิน และรับผิดชอบต่อความปลอดภัยของบัญชีตนเอง\n\nการชำระเงินค่าลงทะเบียนถือเป็นที่สิ้นสุดเมื่อเจ้าหน้าที่ตรวจสอบและยืนยันแล้ว การขอคืนเงินเป็นไปตามระเบียบการคืนเงินของมหาวิทยาลัย มหาวิทยาลัยสงวนสิทธิ์ระงับบัญชีที่มีการใช้งานผิดเงื่อนไขโดยไม่ต้องแจ้งล่วงหน้า",
    state: "published",
    updatedByStaffId: "st1",
  },

  // Cookie notice — 1 version
  {
    id: "legal6",
    kind: "cookie",
    title: "นโยบายคุกกี้",
    version: "1.0",
    effectiveAt: "2026-03-01",
    body: "เว็บไซต์ Credit Bank ใช้คุกกี้ที่จำเป็นต่อการทำงานของระบบ เช่น การคงสถานะการเข้าสู่ระบบ และคุกกี้เพื่อการวิเคราะห์การใช้งานเว็บไซต์แบบไม่ระบุตัวตน ผู้ใช้งานสามารถจัดการการตั้งค่าคุกกี้ได้ผ่านเบราว์เซอร์ของตนเอง",
    state: "published",
    updatedByStaffId: "st1",
  },
];

let legalVersionSeq = legalDocuments.length;

/** Ids for legal-document versions created at runtime. */
export function nextLegalDocumentId(): string {
  legalVersionSeq += 1;
  return `legal${legalVersionSeq}`;
}

export const legalKindLabel: Record<LegalDocument["kind"], string> = {
  privacy: "นโยบายความเป็นส่วนตัว",
  terms: "เงื่อนไขการใช้งาน",
  cookie: "นโยบายคุกกี้",
};

export const legalKindOrder: LegalDocument["kind"][] = ["privacy", "terms", "cookie"];

/** Every version of a kind, most recent effective date first. */
export function legalVersionsOf(kind: LegalDocument["kind"], all: LegalDocument[]): LegalDocument[] {
  return all.filter((d) => d.kind === kind).sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt));
}

/** The version currently in force — published, most recent effective date.
 *  Falls back to the most recent version of any state if nothing is
 *  published yet, so the screen always has something to show. */
export function currentLegalVersion(kind: LegalDocument["kind"], all: LegalDocument[]): LegalDocument | undefined {
  const versions = legalVersionsOf(kind, all);
  return versions.find((d) => d.state === "published") ?? versions[0];
}

/** "2.1" → "2.2". Bumps the trailing numeric segment so a new draft starts
 *  from a sensible suggestion instead of a blank field. Falls back to
 *  appending ".1" for a version string with no numeric tail. */
export function suggestNextVersion(current: string): string {
  const match = current.match(/^(.*?)(\d+)$/);
  if (!match) return `${current}.1`;
  const [, prefix, digits] = match;
  const bumped = String(Number(digits) + 1).padStart(digits.length, "0");
  return `${prefix}${bumped}`;
}

/* -------------------------------------------------------------------------- */
/* Media library                                                             */
/* -------------------------------------------------------------------------- */

export const mediaAssets: MediaAsset[] = [
  {
    id: "media1",
    filename: "home-graduation.png",
    fileType: "png",
    size: "1.4 MB",
    dimensions: "1600 × 900",
    url: "/images/banners/home-graduation.png",
    uploadedAt: "2026-05-02",
    uploadedByStaffId: "st1",
    usedIn: ["แบนเนอร์หน้าแรก · \"เรียนต่อสู่ปริญญา\""],
  },
  {
    id: "media2",
    filename: "home-industry.png",
    fileType: "png",
    size: "1.6 MB",
    dimensions: "1600 × 900",
    url: "/images/banners/home-industry.png",
    uploadedAt: "2026-05-02",
    uploadedByStaffId: "st1",
    usedIn: ["แบนเนอร์หน้าแรก · \"ร่วมมือภาคอุตสาหกรรม\""],
  },
  {
    id: "media3",
    filename: "home-research.png",
    fileType: "png",
    size: "1.5 MB",
    dimensions: "1600 × 900",
    url: "/images/banners/home-research.png",
    uploadedAt: "2026-05-02",
    uploadedByStaffId: "st1",
    usedIn: ["แบนเนอร์หน้าแรก · \"งานวิจัยและนวัตกรรม\""],
  },
  {
    id: "media4",
    filename: "software-development.png",
    fileType: "png",
    size: "980 KB",
    dimensions: "800 × 600",
    url: "/images/programs/software-development.png",
    uploadedAt: "2026-05-14",
    uploadedByStaffId: "st2",
    usedIn: ["หลักสูตร · หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์"],
  },
  {
    id: "media5",
    filename: "data-analytics.png",
    fileType: "png",
    size: "1.1 MB",
    dimensions: "800 × 600",
    url: "/images/programs/data-analytics.png",
    uploadedAt: "2026-05-14",
    uploadedByStaffId: "st2",
    usedIn: ["หลักสูตร · หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล"],
  },
  {
    id: "media6",
    filename: "ai-fundamentals.png",
    fileType: "png",
    size: "1.0 MB",
    dimensions: "800 × 600",
    url: "/images/programs/ai-fundamentals.png",
    uploadedAt: "2026-06-20",
    uploadedByStaffId: "st2",
    usedIn: ["หลักสูตร · หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์"],
  },
  {
    id: "media7",
    filename: "project-management.png",
    fileType: "png",
    size: "890 KB",
    dimensions: "800 × 600",
    url: "/images/programs/project-management.png",
    uploadedAt: "2026-06-22",
    uploadedByStaffId: "st3",
    usedIn: [],
  },
  {
    id: "media8",
    filename: "intro-programming.png",
    fileType: "png",
    size: "760 KB",
    dimensions: "800 × 600",
    url: "/images/subjects/intro-programming.png",
    uploadedAt: "2026-05-18",
    uploadedByStaffId: "st2",
    usedIn: ["รายวิชา · การเขียนโปรแกรมเบื้องต้น"],
  },
  {
    id: "media9",
    filename: "data-structures.png",
    fileType: "png",
    size: "820 KB",
    dimensions: "800 × 600",
    url: "/images/subjects/data-structures.png",
    uploadedAt: "2026-05-18",
    uploadedByStaffId: "st2",
    usedIn: ["รายวิชา · โครงสร้างข้อมูลและอัลกอริทึม"],
  },
  {
    id: "media10",
    filename: "public-speaking.png",
    fileType: "png",
    size: "700 KB",
    dimensions: "800 × 600",
    url: "/images/subjects/public-speaking.png",
    uploadedAt: "2026-06-25",
    uploadedByStaffId: "st3",
    usedIn: [],
  },
  {
    id: "media11",
    filename: "โบรชัวร์แนะนำหลักสูตร-creditbank.pdf",
    fileType: "pdf",
    size: "3.1 MB",
    url: "#",
    uploadedAt: "2026-06-30",
    uploadedByStaffId: "st1",
    usedIn: ["หน้าเนื้อหา · เกี่ยวกับ Credit Bank (ลิงก์ดาวน์โหลดโบรชัวร์)"],
  },
  {
    id: "media12",
    filename: "แบบฟอร์มขอเทียบโอนหน่วยกิต.pdf",
    fileType: "pdf",
    size: "540 KB",
    url: "#",
    uploadedAt: "2026-07-02",
    uploadedByStaffId: "st3",
    usedIn: ["ศูนย์ช่วยเหลือ · \"ยื่นคำขอเทียบโอนหน่วยกิตเข้าใช้เอกสารอะไรบ้าง\""],
  },
  {
    id: "media13",
    filename: "logo-tu-creditbank.svg",
    fileType: "svg",
    size: "48 KB",
    dimensions: "512 × 512",
    url: "#",
    uploadedAt: "2026-04-08",
    uploadedByStaffId: "st1",
    usedIn: [],
  },
  {
    id: "media14",
    filename: "คู่มือการใช้งานระบบสำหรับผู้เรียน.pdf",
    fileType: "pdf",
    size: "2.7 MB",
    url: "#",
    uploadedAt: "2026-07-20",
    uploadedByStaffId: "st2",
    usedIn: ["หน้าเนื้อหา · ติดต่อเรา (ลิงก์ดาวน์โหลดคู่มือ)"],
  },
];
