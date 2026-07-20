"use client";

import { useMemo, useState } from "react";
import { ProgramCard } from "@/components/discovery/program-card";
import { SearchFilterBar } from "@/components/discovery/search-filter-bar";
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
  },
  {
    id: "p2",
    slug: "data-analytics",
    name: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "เรียนรู้การวิเคราะห์และนำเสนอข้อมูลเพื่อการตัดสินใจ",
  },
  {
    id: "p3",
    slug: "digital-marketing",
    name: "หลักสูตรประกาศนียบัตรการตลาดดิจิทัล",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการตลาดยุคดิจิทัลสำหรับผู้ประกอบการและนักการตลาด",
  },
  {
    id: "p4",
    slug: "public-speaking-workshop",
    name: "อบรมเชิงปฏิบัติการการพูดในที่สาธารณะ",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะศิลปศาสตร์",
    summary: "ฝึกทักษะการพูดและการนำเสนออย่างมั่นใจ",
  },
  {
    id: "p5",
    slug: "financial-literacy-workshop",
    name: "อบรมความรู้ทางการเงินเบื้องต้น",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการวางแผนการเงินส่วนบุคคล",
  },
  {
    id: "p6",
    slug: "ai-fundamentals",
    name: "หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "ทำความเข้าใจแนวคิดและการประยุกต์ใช้ปัญญาประดิษฐ์เบื้องต้น",
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

  const filteredPrograms = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesQuery =
        query.length === 0 ||
        program.name.toLowerCase().includes(query) ||
        program.summary.toLowerCase().includes(query);

      const matchesLevel = levelFilter.length === 0 || program.level === levelFilter;
      const matchesFaculty = facultyFilter.length === 0 || program.faculty === facultyFilter;

      return matchesQuery && matchesLevel && matchesFaculty;
    });
  }, [searchValue, levelFilter, facultyFilter]);

  return (
    <div className="flex flex-col gap-6">
      {showHeading ? (
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            หลักสูตรทั้งหมด
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
            สำรวจหลักสูตรที่เปิดสอนและเปรียบเทียบข้อมูลก่อนตัดสินใจ
          </p>
        </div>
      ) : null}

      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="ค้นหาหลักสูตร"
        filters={[
          { label: "ระดับ", options: levelOptions, value: levelFilter, onChange: setLevelFilter },
          { label: "คณะ", options: facultyOptions, value: facultyFilter, onChange: setFacultyFilter },
        ]}
      />

      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
