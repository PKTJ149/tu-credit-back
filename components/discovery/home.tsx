import Link from "next/link";
import { ChevronRight, MapPin, Clock } from "lucide-react";
import { ProgramCard } from "@/components/discovery/program-card";
import { HomeBanner } from "@/components/discovery/home-banner";
import { programs } from "@/lib/data/programs";

/* Both lists pull real programs (real images, teachers, pricing) by slug
   instead of duplicating mock data — keeps homepage cards in sync with
   /programs and avoids linking to slugs that don't exist. */
const RECOMMENDED_SLUGS = [
  "software-development",
  "data-analytics",
  "digital-marketing",
  "public-speaking-workshop",
];
const LATEST_SLUGS = ["ai-fundamentals", "ux-ui-design", "environmental-sustainability"];

const recommendedPrograms = RECOMMENDED_SLUGS.map((slug) =>
  programs.find((p) => p.slug === slug),
).filter((p) => p !== undefined);

const latestPrograms = LATEST_SLUGS.map((slug) =>
  programs.find((p) => p.slug === slug),
).filter((p) => p !== undefined);

const newsItems = [
  {
    id: "n1",
    category: "ประกาศ",
    title: "เปิดรับสมัครหลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์ รุ่นที่ 3",
    date: "18 กรกฎาคม 2568",
    excerpt: "TU Credit Bank เปิดรับสมัครนักศึกษาและบุคคลทั่วไป สำหรับหลักสูตรพัฒนาซอฟต์แวร์รุ่นใหม่",
    coverBg: "bg-blue-50",
    coverIcon: "📋",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "n2",
    category: "ข่าวสาร",
    title: "TU Credit Bank ร่วมมือกับภาคอุตสาหกรรมพัฒนาหลักสูตร AI",
    date: "10 กรกฎาคม 2568",
    excerpt: "มหาวิทยาลัยธรรมศาสตร์ลงนาม MOU กับบริษัทชั้นนำเพื่อออกแบบหลักสูตรที่ตอบโจทย์ตลาดแรงงาน",
    coverBg: "bg-emerald-50",
    coverIcon: "📰",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "n3",
    category: "กิจกรรม",
    title: "งาน Open House Credit Bank 2568 — พบกันวันที่ 1 สิงหาคม",
    date: "5 กรกฎาคม 2568",
    excerpt: "เชิญพบที่ปรึกษาด้านหลักสูตรและรับฟังแผนการเรียนรู้ที่เหมาะกับคุณ ณ ศูนย์การเรียนรู้ TU",
    coverBg: "bg-amber-50",
    coverIcon: "🎪",
    badgeClass: "bg-amber-100 text-amber-700",
  },
];

const jobItems = [
  {
    id: "j1",
    company: "บริษัท เทคโนโลยีไทย จำกัด",
    title: "Junior Software Developer",
    type: "งานประจำ",
    location: "กรุงเทพมหานคร",
    posted: "3 วันที่แล้ว",
    tags: ["React", "Node.js", "TypeScript"],
    coverBg: "bg-blue-50",
    coverIcon: "💻",
    typeClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "j2",
    company: "ธนาคารแห่งหนึ่ง",
    title: "Data Analyst",
    type: "งานประจำ",
    location: "กรุงเทพมหานคร (Hybrid)",
    posted: "1 สัปดาห์ที่แล้ว",
    tags: ["SQL", "Python", "Power BI"],
    coverBg: "bg-indigo-50",
    coverIcon: "📊",
    typeClass: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "j3",
    company: "สตาร์ทอัพ EdTech",
    title: "UX Researcher",
    type: "Freelance",
    location: "Remote",
    posted: "2 วันที่แล้ว",
    tags: ["User Research", "Figma", "Usability Testing"],
    coverBg: "bg-purple-50",
    coverIcon: "🎨",
    typeClass: "bg-purple-100 text-purple-700",
  },
];

const trustStatements = [
  "ดำเนินการโดยมหาวิทยาลัยธรรมศาสตร์ สถาบันการศึกษาที่ได้รับการรับรองมาตรฐาน",
  "หลักสูตรและรายวิชาทุกรายการผ่านการตรวจสอบและอนุมัติตามเกณฑ์ของมหาวิทยาลัย",
  "ระบบเทียบโอนหน่วยกิตดำเนินการโดยเจ้าหน้าที่วิชาการที่มีความเชี่ยวชาญ",
];

function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--ink-subtle)]">{subtitle}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[color:var(--secondary-foreground)] transition-opacity hover:opacity-70"
        >
          {linkLabel}
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20">

      {/* ── Hero Banner ── */}
      <HomeBanner />


      {/* ── Recommended Programs (slidable) ── */}
      <section className="flex flex-col gap-5">
        <SectionHeader
          title="หลักสูตรแนะนำ"
          subtitle="เริ่มต้นเส้นทางการเรียนรู้ที่เป็นระบบ"
          href="/programs"
          linkLabel="ดูทั้งหมด"
        />
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recommendedPrograms.map((program) => (
            <div key={program.id} className="w-[300px] shrink-0 snap-start sm:w-[320px]">
              <ProgramCard program={program} canSave={false} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest Launch Programs (slidable) ── */}
      <section className="flex flex-col gap-5">
        <SectionHeader
          title="หลักสูตรใหม่ล่าสุด"
          subtitle="เพิ่งเปิดตัว — สมัครด่วนก่อนที่นั่งเต็ม"
          href="/programs"
          linkLabel="ดูทั้งหมด"
        />
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {latestPrograms.map((program) => (
            <div key={program.id} className="w-[300px] shrink-0 snap-start sm:w-[320px]">
              <ProgramCard program={program} canSave={false} />
            </div>
          ))}
        </div>
      </section>

      {/* ── News & Announcement ── */}
      <section className="flex flex-col gap-5">
        <SectionHeader
          title="ข่าวสารและประกาศ"
          subtitle="อัปเดตจาก TU Credit Bank"
          href="/news"
          linkLabel="ดูทั้งหมด"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background)] shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Cover */}
              <div className={`relative flex aspect-video items-center justify-center ${item.coverBg}`}>
                <span className="text-5xl opacity-20" aria-hidden="true">{item.coverIcon}</span>
                <span className="absolute bottom-2 right-3 text-[10px] text-[var(--ink-subtle)] opacity-40">ภาพปก</span>
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${item.badgeClass}`}>
                  {item.category}
                </span>
              </div>
              {/* Body */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-xs text-[var(--ink-subtle)]">{item.date}</span>
                <p className="font-semibold text-sm leading-snug text-[var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mt-auto pt-1">{item.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Job Opportunities ── */}
      <section className="flex flex-col gap-5">
        <SectionHeader
          title="โอกาสงานสำหรับผู้เรียน"
          subtitle="ตำแหน่งงานที่ต้องการทักษะจาก TU Credit Bank"
          href="#"
          linkLabel="ดูทั้งหมด"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobItems.map((job) => (
            <a
              key={job.id}
              href="#"
              className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background)] shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Cover */}
              <div className={`relative flex aspect-video items-center justify-center ${job.coverBg}`}>
                <span className="text-5xl opacity-20" aria-hidden="true">{job.coverIcon}</span>
                <span className="absolute bottom-2 right-3 text-[10px] text-[var(--ink-subtle)] opacity-40">ภาพปก</span>
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${job.typeClass}`}>
                  {job.type}
                </span>
              </div>
              {/* Body */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="font-semibold text-sm text-[var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors">
                    {job.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{job.company}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ink-subtle)]">
                  <span className="flex items-center gap-1">
                    <MapPin aria-hidden="true" className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock aria-hidden="true" className="h-3 w-3" /> {job.posted}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ink-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
