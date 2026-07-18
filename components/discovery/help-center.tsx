"use client";

import { useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import { SearchFilterBar } from "@/components/discovery/search-filter-bar";
import type { HelpCategory } from "@/lib/discovery/types";

const helpCategories: HelpCategory[] = [
  {
    id: "h1",
    title: "การสมัครสมาชิกและเข้าสู่ระบบ",
    description: "วิธีสร้างบัญชี ยืนยันตัวตน และแก้ปัญหาการเข้าสู่ระบบ",
    articleCount: 5,
  },
  {
    id: "h2",
    title: "การลงทะเบียนรายวิชาและหลักสูตร",
    description: "ขั้นตอนการเลือก ลงทะเบียน และตรวจสอบสถานะการลงทะเบียน",
    articleCount: 6,
  },
  {
    id: "h3",
    title: "การชำระเงินและใบเสร็จ",
    description: "วิธีชำระเงิน ส่งหลักฐาน และดาวน์โหลดเอกสารทางการเงิน",
    articleCount: 7,
  },
  {
    id: "h4",
    title: "การเทียบโอนหน่วยกิต",
    description: "ขั้นตอนการยื่นคำขอเทียบโอนเข้าและออก พร้อมหลักฐานที่ต้องเตรียม",
    articleCount: 4,
  },
  {
    id: "h5",
    title: "การติดตามผลการเรียน",
    description: "วิธีตรวจสอบหน่วยกิตสะสมและประวัติผลการเรียน",
    articleCount: 3,
  },
  {
    id: "h6",
    title: "การแก้ไขข้อมูลโปรไฟล์",
    description: "วิธีอัปเดตข้อมูลส่วนตัวและข้อมูลการศึกษาในโปรไฟล์",
    articleCount: 3,
  },
];

export function HelpCenter() {
  const [searchValue, setSearchValue] = useState("");

  const filteredCategories = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return helpCategories.filter((category) => {
      return (
        query.length === 0 ||
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    });
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          ศูนย์ช่วยเหลือ
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          ค้นหาคำตอบสำหรับงานที่คุณต้องการทำให้เสร็จอย่างรวดเร็ว
        </p>
      </div>

      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="ค้นหาหัวข้อช่วยเหลือ"
      />

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
                  <HelpCircle aria-hidden="true" className="h-4 w-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                  {category.description}
                </p>
              </div>

              <p className="font-mono text-xs font-medium text-[var(--ink-subtle)]">
                {category.articleCount} บทความ
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--ink-muted)]">
          ไม่พบหัวข้อที่ตรงกับการค้นหา ลองใช้คำค้นหาอื่น
        </div>
      )}
    </div>
  );
}
