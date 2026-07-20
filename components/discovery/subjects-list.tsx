"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar, type FilterSectionConfig } from "@/components/discovery/filter-sidebar";
import { SubjectCard } from "@/components/discovery/subject-card";
import type { Subject } from "@/lib/discovery/types";

const subjects: Subject[] = [
  {
    id: "s1",
    slug: "intro-programming",
    name: "การเขียนโปรแกรมเบื้องต้น",
    credits: 3,
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น",
    price: 1500,
  },
  {
    id: "s2",
    slug: "intro-statistics",
    name: "สถิติเบื้องต้นสำหรับนักวิจัย",
    credits: 3,
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "หลักการทางสถิติที่ใช้ในการวิจัยเบื้องต้น",
    price: 1500,
  },
  {
    id: "s3",
    slug: "digital-marketing-principles",
    name: "หลักการตลาดดิจิทัล",
    credits: 3,
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "แนวคิดและเครื่องมือการตลาดดิจิทัลเบื้องต้น",
    price: 1500,
  },
  {
    id: "s4",
    slug: "data-structures",
    name: "โครงสร้างข้อมูลและอัลกอริทึม",
    credits: 3,
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "หลักการจัดการข้อมูลและอัลกอริทึมพื้นฐาน",
    price: 1500,
  },
  {
    id: "s5",
    slug: "english-communication",
    name: "การสื่อสารภาษาอังกฤษเพื่อการทำงาน",
    credits: 2,
    faculty: "คณะศิลปศาสตร์",
    summary: "พัฒนาทักษะภาษาอังกฤษสำหรับการทำงานจริง",
    price: 1000,
  },
  {
    id: "s6",
    slug: "research-methods",
    name: "ระเบียบวิธีวิจัยเบื้องต้น",
    credits: 3,
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "แนวคิดพื้นฐานของการออกแบบและดำเนินการวิจัย",
    price: 1500,
  },
  {
    id: "s7",
    slug: "design-thinking",
    name: "การคิดเชิงออกแบบ",
    credits: 1,
    faculty: "คณะศิลปศาสตร์",
    summary: "กระบวนการออกแบบที่เน้นผู้ใช้เป็นศูนย์กลาง",
    price: 500,
  },
  {
    id: "s8",
    slug: "accounting-basics",
    name: "บัญชีเบื้องต้นสำหรับผู้ประกอบการ",
    credits: 2,
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "หลักการบัญชีเบื้องต้นและการอ่านงบการเงิน",
    price: 1000,
  },
];

const facultyOptions = Array.from(new Set(subjects.map((s) => s.faculty)));
const creditNumbers = Array.from(new Set(subjects.map((s) => s.credits))).sort((a, b) => a - b);
const creditOptions = creditNumbers.map((n) => `${n} หน่วยกิต`);

type SubjectsListProps = {
  showHeading?: boolean;
  detailBasePath?: string;
};

export function SubjectsList({ showHeading = true, detailBasePath = "/subjects" }: SubjectsListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [facultyValue, setFacultyValue] = useState("");
  const [creditsValue, setCreditsValue] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = [facultyValue, creditsValue].filter(Boolean).length;

  const clearAllFilters = () => {
    setFacultyValue("");
    setCreditsValue("");
  };

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        subject.name.toLowerCase().includes(normalizedSearch) ||
        subject.summary.toLowerCase().includes(normalizedSearch);

      const matchesFaculty = facultyValue.length === 0 || subject.faculty === facultyValue;
      const matchesCredits =
        creditsValue.length === 0 || `${subject.credits} หน่วยกิต` === creditsValue;

      return matchesSearch && matchesFaculty && matchesCredits;
    });
  }, [searchValue, facultyValue, creditsValue]);

  const filterSections: FilterSectionConfig[] = [
    { id: "faculty", label: "คณะ", options: facultyOptions, value: facultyValue, onChange: setFacultyValue },
    { id: "credits", label: "หน่วยกิต", options: creditOptions, value: creditsValue, onChange: setCreditsValue },
  ];

  return (
    <div className="flex flex-col gap-6">
      {showHeading && (
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            รายวิชาทั้งหมด
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)] sm:text-base">
            ค้นหาและประเมินรายวิชาที่เปิดสอนได้อย่างรวดเร็ว
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
            placeholder="ค้นหารายวิชา"
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
              <div key={section.id} className="border-b border-[color:var(--border)] py-3 last:border-0">
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
          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} detailBasePath={detailBasePath} />
              ))}
            </div>
          ) : (
            <div
              role="status"
              className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm leading-6 text-[var(--ink-muted)]"
            >
              ไม่พบรายวิชาที่ตรงกับการค้นหา ลองปรับคำค้นหาหรือตัวกรอง
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
