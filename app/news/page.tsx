import { PublicPageShell } from "@/components/public-page-shell";
import { NewsList } from "@/components/discovery/news-list";
import type { NewsItem } from "@/lib/discovery/types";

const newsItems: NewsItem[] = [
  {
    id: "n1",
    slug: "new-transfer-process",
    title: "ปรับปรุงขั้นตอนการเทียบโอนหน่วยกิตให้รวดเร็วขึ้น",
    date: "15 ก.ค. 2569",
    summary:
      "Credit Bank ปรับปรุงกระบวนการตรวจสอบคำขอเทียบโอนเพื่อลดระยะเวลารอผลให้สั้นลง",
  },
  {
    id: "n2",
    slug: "new-programs-2569",
    title: "เปิดหลักสูตรใหม่ 3 หลักสูตรสำหรับภาคเรียนที่ 1/2569",
    date: "1 ก.ค. 2569",
    summary: "เพิ่มทางเลือกด้านเทคโนโลยีดิจิทัลและการวิเคราะห์ข้อมูลสำหรับผู้เรียนทุกกลุ่ม",
  },
  {
    id: "n3",
    slug: "payment-channel-update",
    title: "อัปเดตช่องทางการชำระเงินสำหรับการลงทะเบียน",
    date: "20 มิ.ย. 2569",
    summary: "ตรวจสอบรายละเอียดบัญชีธนาคารที่ใช้รับชำระเงินก่อนดำเนินการชำระเงินครั้งถัดไป",
  },
  {
    id: "n4",
    slug: "system-maintenance-notice",
    title: "ประกาศปิดปรับปรุงระบบชั่วคราว",
    date: "5 มิ.ย. 2569",
    summary: "ระบบจะปิดปรับปรุงชั่วคราวเพื่อเพิ่มความเสถียรและประสิทธิภาพการใช้งาน",
  },
];

export default function NewsPage() {
  return (
    <PublicPageShell>
      <NewsList newsItems={newsItems} />
    </PublicPageShell>
  );
}
