import Link from "next/link";
import { NewsCard } from "@/components/discovery/news-card";
import type { NewsItem } from "@/lib/discovery/types";

const featuredNews: NewsItem = {
  id: "n1",
  slug: "new-transfer-process",
  title: "ปรับปรุงขั้นตอนการเทียบโอนหน่วยกิตให้รวดเร็วขึ้น",
  date: "15 ก.ค. 2569",
  summary:
    "Credit Bank ปรับปรุงกระบวนการตรวจสอบคำขอเทียบโอนเพื่อลดระยะเวลารอผลให้สั้นลง",
};

const relatedNews: NewsItem[] = [
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
];

export function NewsDetail() {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium text-[var(--ink-subtle)]">{featuredNews.date}</p>
        <h1 className="text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
          {featuredNews.title}
        </h1>
      </header>

      <p className="text-base leading-7 text-[var(--ink-muted)]">
        Credit Bank
        มหาวิทยาลัยธรรมศาสตร์ปรับปรุงกระบวนการตรวจสอบคำขอเทียบโอนหน่วยกิต
        โดยเพิ่มเจ้าหน้าที่ตรวจสอบและปรับขั้นตอนภายในให้กระชับขึ้น
        ส่งผลให้ระยะเวลาการพิจารณาคำขอลดลงจากเดิมอย่างมีนัยสำคัญ
        การเปลี่ยนแปลงนี้มีผลกับคำขอเทียบโอนทุกฉบับที่ยื่นตั้งแต่ภาคเรียนที่
        1/2569 เป็นต้นไป
      </p>

      <section aria-labelledby="related-news-heading" className="flex flex-col gap-4">
        <h2 id="related-news-heading" className="text-lg font-semibold text-[var(--foreground)]">
          ข่าวสารที่เกี่ยวข้อง
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {relatedNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      <div>
        <Link href="/news" className="ui-button-secondary h-11 px-5 text-sm">
          กลับไปหน้าข่าวสาร
        </Link>
      </div>
    </article>
  );
}
