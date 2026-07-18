"use client";

import { useMemo, useState } from "react";
import { SearchFilterBar } from "@/components/discovery/search-filter-bar";
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
  },
  {
    id: "s2",
    slug: "intro-statistics",
    name: "สถิติเบื้องต้นสำหรับนักวิจัย",
    credits: 3,
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "หลักการทางสถิติที่ใช้ในการวิจัยเบื้องต้น",
  },
  {
    id: "s3",
    slug: "digital-marketing-principles",
    name: "หลักการตลาดดิจิทัล",
    credits: 3,
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "แนวคิดและเครื่องมือการตลาดดิจิทัลเบื้องต้น",
  },
  {
    id: "s4",
    slug: "data-structures",
    name: "โครงสร้างข้อมูลและอัลกอริทึม",
    credits: 3,
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "หลักการจัดการข้อมูลและอัลกอริทึมพื้นฐาน",
  },
  {
    id: "s5",
    slug: "english-communication",
    name: "การสื่อสารภาษาอังกฤษเพื่อการทำงาน",
    credits: 3,
    faculty: "คณะศิลปศาสตร์",
    summary: "พัฒนาทักษะภาษาอังกฤษสำหรับการทำงานจริง",
  },
  {
    id: "s6",
    slug: "research-methods",
    name: "ระเบียบวิธีวิจัยเบื้องต้น",
    credits: 3,
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "แนวคิดพื้นฐานของการออกแบบและดำเนินการวิจัย",
  },
];

const facultyOptions = Array.from(new Set(subjects.map((subject) => subject.faculty)));

export function SubjectsList() {
  const [searchValue, setSearchValue] = useState("");
  const [facultyValue, setFacultyValue] = useState("");

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        subject.name.toLowerCase().includes(normalizedSearch) ||
        subject.summary.toLowerCase().includes(normalizedSearch);

      const matchesFaculty = facultyValue.length === 0 || subject.faculty === facultyValue;

      return matchesSearch && matchesFaculty;
    });
  }, [searchValue, facultyValue]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          รายวิชาทั้งหมด
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)] sm:text-base">
          ค้นหาและประเมินรายวิชาที่เปิดสอนได้อย่างรวดเร็ว
        </p>
      </div>

      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="ค้นหารายวิชา"
        filterOptions={facultyOptions}
        filterValue={facultyValue}
        onFilterChange={setFacultyValue}
        filterLabel="คณะ"
      />

      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
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
  );
}
