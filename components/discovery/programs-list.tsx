"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProgramCard } from "@/components/discovery/program-card";
import { FilterSidebar, type FilterSectionConfig } from "@/components/discovery/filter-sidebar";
import type { Program } from "@/lib/discovery/types";

const programs: Program[] = [
  {
    id: "p1",
    slug: "software-development",
    name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    credits: 18,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
    description: "หลักสูตรออกแบบมาสำหรับผู้ที่ต้องการสร้างทักษะการพัฒนาซอฟต์แวร์จากพื้นฐานถึงระดับกลาง ครอบคลุมการเขียนโปรแกรม โครงสร้างข้อมูล และการพัฒนาแอปพลิเคชันจริง",
    seats: 40,
    enrolledCount: 28,
    teachers: ["ผศ.ดร. สมชาย ใจดี", "อ.ดร. วันดี มีสุข", "อ. ประสิทธิ์ เกิดผล"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 9000,
    qualification: "เปิดรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอกที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น",
    careerPaths: ["นักพัฒนาซอฟต์แวร์", "โปรแกรมเมอร์", "นักวิเคราะห์ระบบ", "DevOps Engineer"],
    outcomes: [
      "ทักษะการเขียนโปรแกรมที่นำไปใช้งานได้จริง",
      "ความเข้าใจหลักการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
      "ผลงานที่สามารถนำไปใช้ประกอบพอร์ตโฟลิโอ",
      "ประกาศนียบัตรรับรองจาก TU Credit Bank",
    ],
    subjects: [
      { id: "s1", slug: "intro-programming", name: "การเขียนโปรแกรมเบื้องต้น", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น", price: 1500 },
      { id: "s4", slug: "data-structures", name: "โครงสร้างข้อมูลและอัลกอริทึม", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "หลักการจัดการข้อมูลและอัลกอริทึมพื้นฐาน", price: 1500 },
      { id: "sw3", slug: "web-development", name: "การพัฒนาเว็บแอปพลิเคชัน", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "สร้างเว็บแอปพลิเคชันด้วย React และ Next.js", price: 2000 },
      { id: "sw4", slug: "database-design", name: "ออกแบบและจัดการฐานข้อมูล", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "หลักการออกแบบฐานข้อมูลเชิงสัมพันธ์และ NoSQL", price: 1500 },
      { id: "sw5", slug: "software-project", name: "โครงงานพัฒนาซอฟต์แวร์", credits: 6, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "พัฒนาโปรเจกต์จริงภายใต้การดูแลของอาจารย์", price: 2500 },
    ],
  },
  {
    id: "p2",
    slug: "data-analytics",
    name: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "เรียนรู้การวิเคราะห์และนำเสนอข้อมูลเพื่อการตัดสินใจ",
    description: "พัฒนาทักษะการวิเคราะห์ข้อมูลด้วย Python, SQL และเครื่องมือ Visualization ที่ใช้งานจริงในองค์กรชั้นนำ",
    seats: 35,
    enrolledCount: 20,
    teachers: ["รศ.ดร. วันดี มีสุข", "อ.ดร. เอกชัย ดีมาก"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 7500,
    qualification: "มีพื้นฐานสถิติและคณิตศาสตร์เบื้องต้น หรือผ่านรายวิชาสถิติเบื้องต้น",
    careerPaths: ["Data Analyst", "Business Intelligence Analyst", "Data Scientist", "นักวิจัยเชิงปริมาณ"],
    outcomes: [
      "วิเคราะห์และตีความข้อมูลได้อย่างถูกต้อง",
      "สร้าง Dashboard และ Report สำหรับผู้บริหาร",
      "ใช้เครื่องมือ Python และ SQL ในการทำงานจริง",
      "ประกาศนียบัตรรับรองจาก TU Credit Bank",
    ],
    subjects: [
      { id: "s2", slug: "intro-statistics", name: "สถิติเบื้องต้นสำหรับนักวิจัย", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "หลักการทางสถิติที่ใช้ในการวิจัยเบื้องต้น", price: 1500 },
      { id: "da2", slug: "python-data", name: "Python สำหรับการวิเคราะห์ข้อมูล", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "ใช้ Python และ pandas ในการวิเคราะห์ข้อมูล", price: 1500 },
      { id: "da3", slug: "data-visualization", name: "การนำเสนอข้อมูลเชิงภาพ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "สร้าง Dashboard และกราฟที่สื่อสารข้อมูลได้ชัดเจน", price: 1500 },
      { id: "da4", slug: "sql-business", name: "SQL สำหรับการวิเคราะห์ธุรกิจ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "เขียน SQL ระดับกลาง-สูงสำหรับการวิเคราะห์ธุรกิจ", price: 1500 },
      { id: "da5", slug: "ml-intro", name: "เครื่องจักรเรียนรู้เบื้องต้น", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "แนวคิดพื้นฐานและการประยุกต์ใช้ Machine Learning", price: 1500 },
    ],
  },
  {
    id: "p3",
    slug: "digital-marketing",
    name: "หลักสูตรประกาศนียบัตรการตลาดดิจิทัล",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการตลาดยุคดิจิทัลสำหรับผู้ประกอบการและนักการตลาด",
    description: "เรียนรู้กลยุทธ์การตลาดดิจิทัลครบวงจร ตั้งแต่ SEO, SEM, Social Media ไปจนถึง Data-Driven Marketing",
    seats: 40,
    enrolledCount: 40,
    teachers: ["อ.ดร. สุดา รักเรียน", "อ. มานพ ตั้งใจ"],
    status: "closed",
    type: "ประกาศนียบัตร",
    totalPrice: 6000,
    qualification: "ไม่มีข้อกำหนดพื้นฐาน เปิดรับทุกสาขา",
    careerPaths: ["Digital Marketing Manager", "Content Creator", "Social Media Strategist", "Growth Hacker"],
    outcomes: [
      "วางแผนกลยุทธ์การตลาดดิจิทัลได้อย่างมีประสิทธิภาพ",
      "ใช้เครื่องมือ Google Analytics และ Meta Ads",
      "สร้าง Content ที่ดึงดูดกลุ่มเป้าหมาย",
      "ประกาศนียบัตรรับรองจาก TU Credit Bank",
    ],
    subjects: [
      { id: "s3", slug: "digital-marketing-principles", name: "หลักการตลาดดิจิทัล", credits: 3, faculty: "คณะพาณิชยศาสตร์และการบัญชี", summary: "แนวคิดและเครื่องมือการตลาดดิจิทัลเบื้องต้น", price: 1500 },
      { id: "dm2", slug: "social-media-strategy", name: "กลยุทธ์ Social Media", credits: 3, faculty: "คณะพาณิชยศาสตร์และการบัญชี", summary: "สร้างและบริหาร Social Media ให้ตอบโจทย์ธุรกิจ", price: 1500 },
      { id: "dm3", slug: "seo-sem", name: "SEO และ SEM เบื้องต้น", credits: 3, faculty: "คณะพาณิชยศาสตร์และการบัญชี", summary: "เพิ่ม Traffic และ Conversion ด้วย Search Marketing", price: 1500 },
      { id: "dm4", slug: "marketing-analytics", name: "วิเคราะห์ข้อมูลทางการตลาด", credits: 3, faculty: "คณะพาณิชยศาสตร์และการบัญชี", summary: "ใช้ข้อมูลในการตัดสินใจเชิงการตลาด", price: 1500 },
    ],
  },
  {
    id: "p4",
    slug: "public-speaking-workshop",
    name: "อบรมเชิงปฏิบัติการการพูดในที่สาธารณะ",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะศิลปศาสตร์",
    summary: "ฝึกทักษะการพูดและการนำเสนออย่างมั่นใจ",
    description: "Workshop เข้มข้น 3 วัน ฝึกพูดหน้ากล้อง นำเสนองาน และสื่อสารในที่ประชุมอย่างมืออาชีพ",
    seats: 25,
    enrolledCount: 18,
    teachers: ["ผศ. อรทัย พูดเก่ง"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    qualification: "ไม่มีข้อกำหนด เปิดรับทุกระดับ",
    careerPaths: ["ผู้บริหาร", "วิทยากร", "MC / พิธีกร", "Sales Manager"],
    outcomes: [
      "พูดนำเสนอต่อหน้าผู้ฟังได้อย่างมั่นใจ",
      "จัดโครงสร้างการพูดให้น่าสนใจ",
      "รับมือกับคำถามและสถานการณ์เฉพาะหน้า",
    ],
    subjects: [
      { id: "ps1", slug: "public-speaking-basics", name: "การพูดในที่สาธารณะ", credits: 3, faculty: "คณะศิลปศาสตร์", summary: "ฝึกทักษะการพูดและการนำเสนออย่างมั่นใจ", price: 1500 },
    ],
  },
  {
    id: "p5",
    slug: "financial-literacy-workshop",
    name: "อบรมความรู้ทางการเงินเบื้องต้น",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการวางแผนการเงินส่วนบุคคล",
    description: "เรียนรู้หลักการบริหารเงิน งบประมาณส่วนตัว การออม และการลงทุนเบื้องต้นสำหรับคนทำงาน",
    seats: 30,
    enrolledCount: 12,
    teachers: ["อ.ดร. สมบัติ มีเงิน"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    qualification: "ไม่มีข้อกำหนด เปิดรับทุกระดับ",
    careerPaths: ["ผู้ประกอบการ", "นักบัญชี", "ที่ปรึกษาการเงิน"],
    outcomes: [
      "วางแผนการเงินส่วนตัวได้อย่างเป็นระบบ",
      "เข้าใจหลักการลงทุนเบื้องต้น",
      "อ่านงบการเงินเบื้องต้นได้",
    ],
    subjects: [
      { id: "s8", slug: "accounting-basics", name: "บัญชีเบื้องต้นสำหรับผู้ประกอบการ", credits: 3, faculty: "คณะพาณิชยศาสตร์และการบัญชี", summary: "หลักการบัญชีเบื้องต้นและการอ่านงบการเงิน", price: 1500 },
    ],
  },
  {
    id: "p6",
    slug: "ai-fundamentals",
    name: "หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "ทำความเข้าใจแนวคิดและการประยุกต์ใช้ปัญญาประดิษฐ์เบื้องต้น",
    description: "หลักสูตรครอบคลุม AI, Machine Learning และ Generative AI พร้อมฝึกประยุกต์ใช้ในงานจริง ไม่จำเป็นต้องมีพื้นฐานโค้ด",
    seats: 35,
    enrolledCount: 15,
    teachers: ["รศ.ดร. อนุชา เก่งมาก", "อ.ดร. นภา ฉลาดดี", "อ. พิทยา รู้จริง"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 7500,
    qualification: "มีพื้นฐานการใช้คอมพิวเตอร์ทั่วไป ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรม",
    careerPaths: ["AI Product Manager", "Prompt Engineer", "AI Consultant", "นักวิจัย AI"],
    outcomes: [
      "เข้าใจแนวคิดหลักของ AI และ Machine Learning",
      "ประยุกต์ใช้ AI Tools ในการทำงาน",
      "ออกแบบ AI Solution เบื้องต้นได้",
      "ประกาศนียบัตรรับรองจาก TU Credit Bank",
    ],
    subjects: [
      { id: "ai1", slug: "ai-intro", name: "ปัญญาประดิษฐ์เบื้องต้น", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "ภาพรวมของ AI, ML และ Deep Learning", price: 1500 },
      { id: "ai2", slug: "ml-fundamentals", name: "หลักการ Machine Learning", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "อัลกอริทึม ML พื้นฐานและการประยุกต์ใช้", price: 1500 },
      { id: "ai3", slug: "nlp-basics", name: "การประมวลผลภาษาธรรมชาติ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "NLP และ Large Language Models เบื้องต้น", price: 1500 },
      { id: "ai4", slug: "computer-vision", name: "Computer Vision เบื้องต้น", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "การประมวลผลภาพด้วย AI", price: 1500 },
      { id: "ai5", slug: "ai-ethics", name: "จริยธรรมและ AI ที่รับผิดชอบ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "แนวทางการใช้ AI อย่างมีจริยธรรมและรับผิดชอบ", price: 1500 },
    ],
  },
];

const levelOptions = Array.from(new Set(programs.map((p) => p.level)));
const facultyOptions = Array.from(new Set(programs.map((p) => p.faculty)));

type ProgramsListProps = {
  showHeading?: boolean;
  detailBasePath?: string;
};

export function ProgramsList({ showHeading = true, detailBasePath = "/programs" }: ProgramsListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = [levelFilter, facultyFilter, statusFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setLevelFilter("");
    setFacultyFilter("");
    setStatusFilter("");
  };

  const filteredPrograms = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesQuery =
        query.length === 0 ||
        program.name.toLowerCase().includes(query) ||
        program.summary.toLowerCase().includes(query);

      const matchesLevel = levelFilter.length === 0 || program.level === levelFilter;
      const matchesFaculty = facultyFilter.length === 0 || program.faculty === facultyFilter;
      const matchesStatus =
        statusFilter.length === 0 ||
        (statusFilter === "เปิดรับ"
          ? program.status === "open" || program.status === undefined
          : program.status === "closed");

      return matchesQuery && matchesLevel && matchesFaculty && matchesStatus;
    });
  }, [searchValue, levelFilter, facultyFilter, statusFilter]);

  const filterSections: FilterSectionConfig[] = [
    { id: "level", label: "ระดับ", options: levelOptions, value: levelFilter, onChange: setLevelFilter },
    { id: "faculty", label: "คณะ", options: facultyOptions, value: facultyFilter, onChange: setFacultyFilter },
    { id: "status", label: "สถานะการรับสมัคร", options: ["เปิดรับ", "ปิดรับ"], value: statusFilter, onChange: setStatusFilter },
  ];

  return (
    <div className="flex flex-col gap-6">
      {showHeading && (
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            หลักสูตรทั้งหมด
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
            สำรวจหลักสูตรที่เปิดสอนและเปรียบเทียบข้อมูลก่อนตัดสินใจ
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-subtle)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="ค้นหาหลักสูตร"
            className="ui-input w-full pl-9"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition lg:hidden ${
            mobileFiltersOpen || activeFilterCount > 0
              ? "border-[color:var(--primary)] text-[color:var(--primary)]"
              : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
          }`}
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          ตัวกรอง
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--primary)] text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-4 lg:hidden">
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {filterSections.map((section) => (
              <div key={section.id} className="border-b border-[color:var(--border)] py-3 last:border-0 sm:last:border-b">
                <p className="mb-2 text-xs font-semibold text-[var(--foreground)]">{section.label}</p>
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const selected = section.value === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => section.onChange(selected ? "" : option)}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          selected
                            ? "bg-[color:var(--primary)] text-white"
                            : "border border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-3 flex items-center gap-1 text-xs text-[var(--ink-subtle)] hover:text-[var(--foreground)]"
            >
              <X aria-hidden="true" className="h-3 w-3" />
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}

      {/* Desktop: sidebar + cards */}
      <div className="flex items-start gap-8">
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block">
          <FilterSidebar
            sections={filterSections}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Cards */}
        <div className="min-w-0 flex-1">
          {filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} detailBasePath={detailBasePath} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--ink-muted)]">
              ไม่พบหลักสูตรที่ตรงกับการค้นหา ลองปรับคำค้นหาหรือตัวกรอง
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
