/**
 * Website content mock data — news & activities, homepage banners, and
 * homepage curation ("featured").
 *
 * News and activities share one entity (`NewsArticle.category`) per the
 * recorded decision: one list, one editor, filterable by category. Nothing
 * here duplicates that shape into two content types.
 *
 * Banners and featured entries reference real catalogue records in
 * `lib/data/*` by id, the same convention `lib/admin/mock-data.ts` uses for
 * payments and registrations — a featured pick always points at a
 * program/subject that actually exists.
 *
 * Dates are fixed strings, never `new Date()` — the prototype renders the
 * same thing on every machine and in every screenshot.
 */

import { programs } from "@/lib/data/programs";
import { subjects } from "@/lib/data/subjects";
import type { ContentCategory, FeaturedEntry, HomeBanner, NewsArticle, PublishState } from "./types";

/* -------------------------------------------------------------------------- */
/* Shared vocabulary                                                         */
/* -------------------------------------------------------------------------- */

export const contentCategoryLabel: Record<ContentCategory, string> = {
  news: "ข่าว",
  activity: "กิจกรรม",
};

/** Re-exported so existing call sites keep working; the labels and tones live
 *  in `lib/admin/publish-state.ts`, the single source for this lifecycle. */
export { publishStateLabel, publishStateTone } from "./publish-state";

/** News-specific elaboration of `publishStateLearnerEffect`, naming the actual
 *  learner-facing pages. The generic version in `./publish-state` covers every
 *  other content type; this one is only worth its extra words in the article
 *  editor, where the writer is deciding whether to publish right now. */
export const newsPublishStateEffect: Record<PublishState, string> = {
  draft: "ผู้เรียนจะไม่เห็นรายการนี้ที่ใดในเว็บไซต์ จนกว่าจะเปลี่ยนสถานะเป็น “ตั้งเวลาเผยแพร่” หรือ “เผยแพร่แล้ว”",
  scheduled: "ผู้เรียนจะยังไม่เห็นรายการนี้จนถึงวันที่กำหนดเผยแพร่ หลังจากนั้นจะปรากฏในหน้าข่าวสารโดยอัตโนมัติ โดยไม่ต้องทำอะไรเพิ่ม",
  published: "ผู้เรียนเห็นรายการนี้ในหน้าข่าวสารและหน้ารายละเอียดทันทีที่บันทึก",
  archived: "ผู้เรียนจะไม่เห็นรายการนี้อีกต่อไปในเว็บไซต์ ข้อมูลยังถูกเก็บไว้ในระบบแต่ถูกซ่อนจากทุกหน้าที่ผู้เรียนเข้าถึงได้",
};

/* -------------------------------------------------------------------------- */
/* News & activities                                                          */
/* -------------------------------------------------------------------------- */

export const newsArticles: NewsArticle[] = [
  {
    id: "na1",
    slug: "new-transfer-process",
    title: "ปรับปรุงขั้นตอนการเทียบโอนหน่วยกิตให้รวดเร็วขึ้น",
    category: "news",
    state: "published",
    excerpt: "Credit Bank ปรับปรุงกระบวนการตรวจสอบคำขอเทียบโอนเพื่อลดระยะเวลารอผลให้สั้นลง",
    body: "Credit Bank มหาวิทยาลัยธรรมศาสตร์ปรับปรุงกระบวนการตรวจสอบคำขอเทียบโอนหน่วยกิต โดยเพิ่มเจ้าหน้าที่ตรวจสอบและปรับขั้นตอนภายในให้กระชับขึ้น ส่งผลให้ระยะเวลาการพิจารณาคำขอลดลงจากเดิมอย่างมีนัยสำคัญ\n\nการเปลี่ยนแปลงนี้มีผลกับคำขอเทียบโอนทุกฉบับที่ยื่นตั้งแต่ภาคเรียนที่ 1/2569 เป็นต้นไป ผู้เรียนที่มีคำขออยู่ระหว่างการพิจารณาสามารถติดตามสถานะได้จากหน้าประวัติคำขอตามปกติ",
    coverImage: "/images/banners/home-research.png",
    publishAt: "2026-07-15",
    authorStaffId: "st1",
    updatedAt: "2026-07-15",
    tags: ["เทียบโอนหน่วยกิต", "ประกาศ"],
  },
  {
    id: "na2",
    slug: "new-programs-2569",
    title: "เปิดหลักสูตรใหม่ 3 หลักสูตรสำหรับภาคเรียนที่ 1/2569",
    category: "news",
    state: "published",
    excerpt: "เพิ่มทางเลือกด้านเทคโนโลยีดิจิทัลและการวิเคราะห์ข้อมูลสำหรับผู้เรียนทุกกลุ่ม",
    body: "Credit Bank เปิดหลักสูตรประกาศนียบัตรใหม่ 3 หลักสูตรสำหรับภาคเรียนที่ 1/2569 ครอบคลุมด้านปัญญาประดิษฐ์ การออกแบบ UX/UI และการบริหารโครงการ ออกแบบร่วมกับผู้เชี่ยวชาญในอุตสาหกรรมเพื่อให้เนื้อหาทันสมัยและใช้งานได้จริง\n\nผู้สนใจสามารถดูรายละเอียดหลักสูตร ค่าธรรมเนียม และช่วงเวลาเรียนได้ที่หน้าคลังหลักสูตร ที่นั่งมีจำนวนจำกัดในแต่ละรุ่น",
    coverImage: "/images/banners/home-graduation.png",
    publishAt: "2026-07-01",
    authorStaffId: "st2",
    updatedAt: "2026-07-01",
    tags: ["หลักสูตรใหม่"],
  },
  {
    id: "na3",
    slug: "payment-channel-update",
    title: "อัปเดตช่องทางการชำระเงินสำหรับการลงทะเบียน",
    category: "news",
    state: "published",
    excerpt: "ตรวจสอบรายละเอียดบัญชีธนาคารที่ใช้รับชำระเงินก่อนดำเนินการชำระเงินครั้งถัดไป",
    body: "งานการเงินและบัญชีปรับปรุงบัญชีธนาคารที่ใช้รับชำระค่าลงทะเบียน เพื่อรองรับปริมาณธุรกรรมที่เพิ่มขึ้น ผู้เรียนที่มีรายการค้างชำระกรุณาตรวจสอบเลขที่บัญชีปลายทางให้ตรงกับที่แจ้งในระบบก่อนโอนเงินทุกครั้ง\n\nหากพบว่าโอนเงินผิดบัญชี กรุณาติดต่องานการเงินและบัญชีทันทีพร้อมแนบหลักฐานการโอน เพื่อให้เจ้าหน้าที่ตรวจสอบและดำเนินการแก้ไขได้เร็วที่สุด",
    publishAt: "2026-06-20",
    authorStaffId: "st2",
    updatedAt: "2026-06-20",
    tags: ["การชำระเงิน"],
  },
  {
    id: "na4",
    slug: "system-maintenance-notice",
    title: "ประกาศปิดปรับปรุงระบบชั่วคราว",
    category: "news",
    state: "draft",
    excerpt: "แจ้งช่วงเวลาปิดระบบเพื่อปรับปรุงเซิร์ฟเวอร์ ผู้เรียนจะไม่สามารถเข้าสู่ระบบได้ชั่วคราว",
    body: "ทีมงานระบบมีกำหนดปิดปรับปรุงเซิร์ฟเวอร์เพื่อเพิ่มความเสถียรของระบบลงทะเบียนและชำระเงิน ระหว่างการปรับปรุง ผู้เรียนจะไม่สามารถเข้าสู่ระบบ ลงทะเบียน หรือชำระเงินได้ชั่วคราว\n\nยังไม่ยืนยันวันและเวลาที่แน่นอน อยู่ระหว่างประสานงานกับทีมเทคนิคเพื่อเลือกช่วงเวลาที่กระทบผู้เรียนน้อยที่สุด",
    authorStaffId: "st3",
    updatedAt: "2026-07-30",
    tags: ["ระบบ"],
  },
  {
    id: "na5",
    slug: "early-registration-2569-2",
    title: "เปิดรับสมัครหลักสูตรภาคปลาย 2569 ล่วงหน้า",
    category: "news",
    state: "scheduled",
    excerpt: "ลงทะเบียนล่วงหน้าสำหรับภาคปลาย 2569 พร้อมส่วนลดค่าธรรมเนียมช่วงต้น",
    body: "Credit Bank เปิดรับลงทะเบียนล่วงหน้าสำหรับภาคปลาย ปีการศึกษา 2569 ผู้ที่ลงทะเบียนภายในช่วงเวลาที่กำหนดจะได้รับส่วนลดค่าธรรมเนียมพิเศษ และมีสิทธิ์เลือกที่นั่งก่อนรอบลงทะเบียนปกติ\n\nรายละเอียดหลักสูตรที่เปิดสอนในภาคนี้จะประกาศพร้อมกับการเปิดข่าวนี้ ผู้สนใจสามารถติดตามรายชื่อหลักสูตรได้ที่หน้าคลังหลักสูตรเมื่อถึงกำหนด",
    publishAt: "2026-08-15",
    authorStaffId: "st1",
    updatedAt: "2026-07-29",
    tags: ["การรับสมัคร", "หลักสูตร"],
  },
  {
    id: "na6",
    slug: "annual-report-2568",
    title: "สรุปผลการดำเนินงาน Credit Bank ปีการศึกษา 2568",
    category: "news",
    state: "archived",
    excerpt: "ภาพรวมจำนวนผู้เรียน หน่วยกิตสะสม และหลักสูตรยอดนิยมตลอดปีการศึกษา 2568",
    body: "Credit Bank สรุปผลการดำเนินงานประจำปีการศึกษา 2568 มีผู้เรียนลงทะเบียนสะสมเพิ่มขึ้นจากปีก่อนหน้า และหลักสูตรด้านเทคโนโลยีดิจิทัลยังคงได้รับความนิยมสูงสุดต่อเนื่องเป็นปีที่สอง\n\nรายงานฉบับนี้เก็บไว้เป็นข้อมูลอ้างอิงภายใน ไม่แสดงบนหน้าข่าวสารของผู้เรียนอีกต่อไป",
    publishAt: "2026-05-30",
    authorStaffId: "st1",
    updatedAt: "2026-06-02",
    tags: ["รายงานประจำปี"],
  },
  {
    id: "na7",
    slug: "open-house-2569",
    title: "งานเปิดบ้าน Credit Bank Open House 2569",
    category: "activity",
    state: "published",
    excerpt: "พบที่ปรึกษาด้านหลักสูตรและทดลองเรียนจริงกับอาจารย์ประจำวิชา ณ ท่าพระจันทร์",
    body: "ขอเชิญผู้สนใจทุกท่านเข้าร่วมงานเปิดบ้าน Credit Bank Open House 2569 พบปะที่ปรึกษาด้านหลักสูตร ทดลองกิจกรรมเรียนรู้สั้น ๆ จากอาจารย์ประจำวิชา และรับคำแนะนำเส้นทางการเรียนที่เหมาะกับเป้าหมายของแต่ละคน\n\nลงทะเบียนเข้าร่วมงานล่วงหน้าเพื่อรับของที่ระลึก ที่นั่งภายในงานมีจำนวนจำกัด",
    coverImage: "/images/banners/home-industry.png",
    publishAt: "2026-07-25",
    authorStaffId: "st2",
    updatedAt: "2026-07-25",
    tags: ["กิจกรรม", "Open House"],
    eventDate: "2026-08-20",
    eventLocation: "หอประชุมศรีบูรพา มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
  },
  {
    id: "na8",
    slug: "python-workshop-beginner",
    title: "เวิร์กช็อป Python สำหรับผู้เริ่มต้น",
    category: "activity",
    state: "scheduled",
    excerpt: "เวิร์กช็อปออนไลน์ครึ่งวัน ปูพื้นฐาน Python สำหรับผู้ที่ไม่เคยเขียนโปรแกรมมาก่อน",
    body: "เวิร์กช็อปออนไลน์ครึ่งวันนี้ออกแบบมาสำหรับผู้ที่ไม่มีพื้นฐานการเขียนโปรแกรมมาก่อน ปูพื้นฐาน Python ตั้งแต่การติดตั้งเครื่องมือไปจนถึงการเขียนโปรแกรมง่าย ๆ ด้วยตนเอง\n\nผู้เข้าร่วมจะได้รับลิงก์ห้องเรียนออนไลน์และเอกสารประกอบล่วงหน้าก่อนวันจัดกิจกรรม 3 วัน",
    publishAt: "2026-08-10",
    authorStaffId: "st4",
    updatedAt: "2026-07-31",
    tags: ["เวิร์กช็อป", "Python"],
    eventDate: "2026-09-05",
    eventLocation: "ออนไลน์ผ่าน Zoom",
  },
  {
    id: "na9",
    slug: "data-career-seminar",
    title: "สัมมนาแนะแนวเส้นทางอาชีพด้านข้อมูล",
    category: "activity",
    state: "draft",
    excerpt: "เชิญผู้เชี่ยวชาญด้านข้อมูลจากภาคอุตสาหกรรมมาแบ่งปันเส้นทางอาชีพและทักษะที่ตลาดต้องการ",
    body: "งานสัมมนานี้เชิญผู้เชี่ยวชาญด้านข้อมูลจากภาคอุตสาหกรรมมาร่วมแบ่งปันประสบการณ์และเส้นทางอาชีพสายข้อมูล ครอบคลุมทั้งสาย Data Analyst และ Data Scientist\n\nอยู่ระหว่างประสานงานสถานที่จัดงานกับวิทยากร รายละเอียดจะปรับปรุงอีกครั้งก่อนเปิดให้ลงทะเบียน",
    authorStaffId: "st5",
    updatedAt: "2026-07-28",
    tags: ["สัมมนา", "สายอาชีพข้อมูล"],
    eventDate: "2026-09-20",
    eventLocation: "ยังไม่ยืนยันสถานที่",
  },
  {
    id: "na10",
    slug: "orientation-2568-2",
    title: "กิจกรรมปฐมนิเทศผู้เรียนใหม่ ภาคปลาย 2568",
    category: "activity",
    state: "archived",
    excerpt: "แนะนำระบบ Credit Bank ขั้นตอนการลงทะเบียน และสิทธิประโยชน์ของผู้เรียนใหม่",
    body: "กิจกรรมปฐมนิเทศผู้เรียนใหม่ประจำภาคปลาย ปีการศึกษา 2568 แนะนำภาพรวมระบบ Credit Bank ขั้นตอนการลงทะเบียนเรียน การชำระเงิน และสิทธิประโยชน์ต่าง ๆ ที่ผู้เรียนควรทราบ\n\nกิจกรรมนี้จัดขึ้นแล้วและปิดรับลงทะเบียนเรียบร้อย เก็บไว้เป็นข้อมูลอ้างอิงเท่านั้น",
    publishAt: "2026-01-10",
    authorStaffId: "st3",
    updatedAt: "2026-01-13",
    tags: ["ปฐมนิเทศ"],
    eventDate: "2026-01-12",
    eventLocation: "มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
  },
  {
    id: "na11",
    slug: "data-analytics-bootcamp",
    title: "ค่ายอบรมเชิงปฏิบัติการ Data Analytics Bootcamp",
    category: "activity",
    state: "published",
    excerpt: "ค่ายอบรมเข้มข้น 2 วัน ลงมือวิเคราะห์ข้อมูลจริงกับเครื่องมือที่ใช้ในอุตสาหกรรม",
    body: "ค่ายอบรมเชิงปฏิบัติการ Data Analytics Bootcamp จัดขึ้นเป็นเวลา 2 วัน ผู้เข้าร่วมจะได้ลงมือวิเคราะห์ชุดข้อมูลจริงร่วมกับเครื่องมือที่ใช้ในอุตสาหกรรม พร้อมคำแนะนำจากวิทยากรตลอดกิจกรรม\n\nเหมาะสำหรับผู้ที่มีพื้นฐานสถิติเบื้องต้นมาแล้ว และต้องการฝึกฝนทักษะการวิเคราะห์ข้อมูลอย่างเข้มข้นในเวลาสั้น ๆ",
    publishAt: "2026-07-28",
    authorStaffId: "st2",
    updatedAt: "2026-07-28",
    tags: ["ค่ายอบรม", "Data Analytics"],
    eventDate: "2026-08-23",
    eventLocation: "อาคารเรียนรวม มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
  },
];

export function getNewsArticleById(id: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.id === id);
}

/* -------------------------------------------------------------------------- */
/* Homepage banners                                                           */
/* -------------------------------------------------------------------------- */

export const homeBanners: HomeBanner[] = [
  {
    id: "b1",
    title: "สะสมหน่วยกิตให้กลายเป็นความสำเร็จที่จับต้องได้",
    subtitle: "เริ่มจากรายวิชาที่สนใจ สะสมหน่วยกิตตามเป้าหมาย และต่อยอดสู่หลักสูตรหรือประกาศนียบัตร",
    image: "/images/banners/home-graduation.png",
    ctaLabel: "สำรวจหลักสูตร",
    ctaHref: "/programs",
    order: 1,
    state: "published",
  },
  {
    id: "b2",
    title: "เรียนรู้ทักษะใหม่ที่เชื่อมกับอุตสาหกรรมและอาชีพ",
    subtitle: "เลือกหลักสูตรที่ออกแบบจากความต้องการของตลาดแรงงาน ทั้งสายเทคโนโลยี ข้อมูล และธุรกิจ",
    image: "/images/banners/home-industry.png",
    ctaLabel: "ดูหลักสูตรแนะนำ",
    ctaHref: "/programs/software-development",
    order: 2,
    state: "published",
    startAt: "2026-07-20",
    endAt: "2026-08-10",
  },
  {
    id: "b3",
    title: "เปิดรับสมัครภาคต้น 2569 ลงทะเบียนก่อนเต็ม",
    subtitle: "ลงทะเบียนล่วงหน้าภายในช่วงเวลาที่กำหนด รับส่วนลดค่าธรรมเนียมพิเศษ",
    image: "",
    ctaLabel: "ลงทะเบียนเรียน",
    ctaHref: "/programs",
    order: 3,
    state: "scheduled",
    startAt: "2026-08-15",
    endAt: "2026-09-01",
  },
  {
    id: "b4",
    title: "โปรโมชันค่าธรรมเนียมพิเศษ ภาคฤดูร้อน 2569",
    subtitle: "ส่วนลดค่าธรรมเนียมสำหรับผู้ลงทะเบียนภาคฤดูร้อน หมดเขตก่อนเปิดภาคต้น",
    image: "",
    ctaLabel: "ดูรายละเอียด",
    ctaHref: "/programs",
    order: 4,
    state: "published",
    startAt: "2026-06-01",
    endAt: "2026-07-15",
  },
  {
    id: "b5",
    title: "แบนเนอร์แคมเปญรับสมัครอาจารย์พิเศษ",
    subtitle: "ชวนผู้เชี่ยวชาญในอุตสาหกรรมมาร่วมเป็นอาจารย์พิเศษกับ Credit Bank",
    image: "",
    order: 5,
    state: "draft",
  },
  {
    id: "b6",
    title: "รวมผลการเรียนรู้จากหลายแหล่งไว้ในระบบเดียว",
    subtitle: "ใช้ Credit Bank เพื่อวางแผนการเรียน ติดตามหน่วยกิต และเตรียมหลักฐานสำหรับการเทียบโอนอย่างเป็นระบบ",
    image: "/images/banners/home-research.png",
    ctaLabel: "วางเป้าหมายการเรียนรู้",
    ctaHref: "/learning",
    order: 6,
    state: "archived",
  },
];

/** A banner is only actually visible on the site when it is published *and*
 *  today falls inside its live window (or it has no window at all). A
 *  "published" banner whose window has already ended is exactly the trap
 *  this screen has to surface — it still reads as published, but a learner
 *  refreshing the homepage right now would never see it. */
export function isBannerLiveNow(banner: HomeBanner, today: string): boolean {
  if (banner.state !== "published") return false;
  if (banner.startAt && banner.startAt > today) return false;
  if (banner.endAt && banner.endAt < today) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/* Featured (homepage curation)                                              */
/* -------------------------------------------------------------------------- */

export const featuredSlotLabel: Record<FeaturedEntry["slot"], string> = {
  hero: "ไฮไลต์หน้าแรก",
  recommended: "หลักสูตรแนะนำ",
  popular: "หลักสูตรใหม่ล่าสุด",
};

/** Ties each slot back to the exact hardcoded array it replaces in
 *  `components/discovery/home.tsx`, so a staff member reading this screen can
 *  see the concrete consequence of reordering or removing an entry. */
export const featuredSlotHomepageNote: Record<FeaturedEntry["slot"], string> = {
  hero: "สำรองไว้สำหรับจุดไฮไลต์แรกของหน้าแรก ปัจจุบันหน้าแรกยังไม่มีโซนนี้ในโค้ด — เตรียมไว้ล่วงหน้าสำหรับตำแหน่งนี้",
  recommended: "รายการนี้คือชุดข้อมูลของโซน “หลักสูตรแนะนำ” กลางหน้าแรก (แทนที่ตัวแปร RECOMMENDED_SLUGS ที่ฝังอยู่ในโค้ดปัจจุบัน) — เพิ่ม ลบ หรือสลับลำดับที่นี่จะเปลี่ยนสิ่งที่ผู้เรียนเห็นบนหน้าแรกโดยตรง",
  popular: "รายการนี้คือชุดข้อมูลของโซน “หลักสูตรใหม่ล่าสุด” หน้าแรก (แทนที่ตัวแปร LATEST_SLUGS ที่ฝังอยู่ในโค้ดปัจจุบัน) — เพิ่ม ลบ หรือสลับลำดับที่นี่จะเปลี่ยนสิ่งที่ผู้เรียนเห็นบนหน้าแรกโดยตรง",
};

export const featuredEntries: FeaturedEntry[] = [
  { id: "fe1", itemType: "program", itemId: "p1", slot: "hero", order: 1, active: true },
  { id: "fe2", itemType: "program", itemId: "p6", slot: "hero", order: 2, active: true },
  { id: "fe3", itemType: "subject", itemId: "s1", slot: "hero", order: 3, active: true },

  { id: "fe4", itemType: "program", itemId: "p7", slot: "recommended", order: 1, active: true },
  { id: "fe5", itemType: "program", itemId: "p2", slot: "recommended", order: 2, active: true },
  { id: "fe6", itemType: "subject", itemId: "s12", slot: "recommended", order: 3, active: true },
  { id: "fe7", itemType: "subject", itemId: "s9", slot: "recommended", order: 4, active: false },

  { id: "fe8", itemType: "program", itemId: "p9", slot: "popular", order: 1, active: true },
  { id: "fe9", itemType: "subject", itemId: "s3", slot: "popular", order: 2, active: true },
  { id: "fe10", itemType: "subject", itemId: "s16", slot: "popular", order: 3, active: true },
  { id: "fe11", itemType: "program", itemId: "p13", slot: "popular", order: 4, active: true },
  /** Deliberately a closed subject: the catalogue closed after this pick was
   *  made. Existing data demonstrating the guard the screen must surface —
   *  new picks of a closed item are blocked at the source. */
  { id: "fe12", itemType: "subject", itemId: "s4", slot: "popular", order: 5, active: true },
];

export type FeaturedCatalogueItem = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  status: "open" | "closed";
  meta: string;
  href: string;
};

/** Resolves a featured entry against the real catalogue. Returns `undefined`
 *  only if the referenced id has been removed from the catalogue entirely —
 *  which should not happen in this dataset, but a curation screen has to
 *  survive a dangling reference without crashing. */
export function getFeaturedCatalogueItem(entry: FeaturedEntry): FeaturedCatalogueItem | undefined {
  if (entry.itemType === "program") {
    const p = programs.find((x) => x.id === entry.itemId);
    if (!p) return undefined;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.image,
      status: p.status ?? "open",
      meta: `${p.level} · ${p.credits} หน่วยกิต`,
      href: `/programs/${p.slug}`,
    };
  }
  const s = subjects.find((x) => x.id === entry.itemId);
  if (!s) return undefined;
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    image: s.image,
    status: s.status ?? "open",
    meta: `${s.credits} หน่วยกิต · ${s.faculty}`,
    href: `/subjects/${s.slug}`,
  };
}

/** Catalogue picker options for the "add to slot" control, each tagged with
 *  its current status so a closed item can be shown but disabled rather than
 *  silently hidden — a staff member should see *why* it cannot be picked. */
export function listCatalogueOptions(itemType: "program" | "subject"): FeaturedCatalogueItem[] {
  if (itemType === "program") {
    return programs.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.image,
      status: p.status ?? "open",
      meta: `${p.level} · ${p.credits} หน่วยกิต`,
      href: `/programs/${p.slug}`,
    }));
  }
  return subjects.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    image: s.image,
    status: s.status ?? "open",
    meta: `${s.credits} หน่วยกิต · ${s.faculty}`,
    href: `/subjects/${s.slug}`,
  }));
}
