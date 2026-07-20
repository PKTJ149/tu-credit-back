"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Users,
  BookOpen,
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
} from "lucide-react";
import type { Program } from "@/lib/discovery/types";
import { SubjectCard } from "@/components/discovery/subject-card";

const TABS = ["ภาพรวม", "รายวิชา", "รีวิวและความคิดเห็น"] as const;
type Tab = (typeof TABS)[number];

type ProgramDetailProps = {
  program: Program;
  mode?: "public" | "member";
  subjectDetailBasePath?: string;
};

export function ProgramDetail({
  program,
  mode = "public",
  subjectDetailBasePath = "/subjects",
}: ProgramDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ภาพรวม");
  const [saved, setSaved] = useState(false);
  const isMember = mode === "member";
  const isOpen = program.status !== "closed";

  return (
    <article className="mx-auto w-full max-w-4xl">
      {/* Banner */}
      <div className="relative mb-6 flex aspect-[3/1] items-center justify-center overflow-hidden rounded-2xl bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)]">
        <GraduationCap aria-hidden="true" className="h-16 w-16 text-[var(--secondary-foreground)] opacity-10" />
        <span className="absolute bottom-3 right-4 text-[10px] font-medium text-[var(--ink-subtle)] opacity-60">
          ภาพปก
        </span>
        {program.status && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
              isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}
          >
            {isOpen ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
          </span>
        )}
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Type + faculty badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_40%,white)] px-3 py-1 text-xs font-medium text-[var(--secondary-foreground)]">
            {program.type ?? program.level}
          </span>
          <span className="text-sm text-[var(--ink-subtle)]">{program.faculty}</span>
        </div>

        <h1 className="text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
          {program.name}
        </h1>

        {program.summary && (
          <p className="text-base leading-7 text-[var(--ink-muted)]">{program.summary}</p>
        )}

        {/* Key metrics */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2.5">
            <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
            <span className="font-mono text-sm font-semibold text-[var(--foreground)]">
              {program.credits} หน่วยกิต
            </span>
          </div>

          {program.seats !== undefined && (
            <div className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2.5">
              <Users aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
              <span className="text-sm text-[var(--foreground)]">
                {program.enrolledCount ?? 0}/{program.seats} ที่นั่ง
              </span>
            </div>
          )}

          {program.totalPrice !== undefined && (
            <div className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2.5">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {program.totalPrice === 0
                  ? "ฟรี"
                  : `฿${program.totalPrice.toLocaleString()}`}
              </span>
              <span className="text-xs text-[var(--ink-subtle)]">รวมทุกรายวิชา</span>
            </div>
          )}
        </div>

        {/* Teachers */}
        {program.teachers && program.teachers.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-xs font-medium text-[var(--ink-subtle)]">ผู้สอน</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {program.teachers.map((teacher) => (
                <span key={teacher} className="text-sm text-[var(--foreground)]">
                  {teacher}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={isMember ? "/registrations" : "/register"}
            className="ui-button-primary h-11 flex-1 px-6 text-sm sm:flex-initial sm:min-w-48"
          >
            {isMember ? "ลงทะเบียนหลักสูตร" : "สมัครสมาชิกเพื่อลงทะเบียน"}
          </Link>

          <button
            type="button"
            aria-label={saved ? "ยกเลิกการบันทึก" : "บันทึกหลักสูตรนี้"}
            onClick={() => setSaved(!saved)}
            className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-medium transition ${
              saved
                ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[color:var(--primary)]"
                : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
            }`}
          >
            {saved ? (
              <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Bookmark aria-hidden="true" className="h-4 w-4" />
            )}
            {saved ? "บันทึกแล้ว" : "บันทึกหลักสูตร"}
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 border-b border-[color:var(--border)]">
        <nav className="-mb-px flex gap-0" aria-label="แท็บเนื้อหา">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[color:var(--primary)] text-[color:var(--primary)]"
                    : "border-transparent text-[var(--ink-muted)] hover:border-[color:var(--border)] hover:text-[var(--foreground)]"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {tab === "ภาพรวม" && <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />}
                {tab === "รายวิชา" && <GraduationCap aria-hidden="true" className="h-3.5 w-3.5" />}
                {tab === "รีวิวและความคิดเห็น" && <Star aria-hidden="true" className="h-3.5 w-3.5" />}
                {tab}
                {tab === "รายวิชา" && program.subjects && program.subjects.length > 0 && (
                  <span className="ml-1 rounded-full bg-[var(--surface)] px-1.5 text-[10px] font-semibold text-[var(--ink-subtle)]">
                    {program.subjects.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === "ภาพรวม" && (
          <div className="flex flex-col gap-6">
            {/* Description */}
            {program.description && (
              <section className="flex flex-col gap-2 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                <h2 className="text-base font-semibold text-[var(--foreground)]">เกี่ยวกับหลักสูตร</h2>
                <p className="text-sm leading-7 text-[var(--ink-muted)]">{program.description}</p>
              </section>
            )}

            {/* Qualification */}
            {program.qualification && (
              <section className="flex flex-col gap-2 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                <h2 className="text-base font-semibold text-[var(--foreground)]">คุณสมบัติผู้เรียน</h2>
                <p className="text-sm leading-7 text-[var(--ink-muted)]">{program.qualification}</p>
              </section>
            )}

            {/* Outcomes */}
            {program.outcomes && program.outcomes.length > 0 && (
              <section className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                <h2 className="text-base font-semibold text-[var(--foreground)]">สิ่งที่จะได้รับ</h2>
                <ul className="flex flex-col gap-3">
                  {program.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--secondary-foreground)]"
                      />
                      <span className="text-sm leading-6 text-[var(--ink-muted)]">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Career paths */}
            {program.careerPaths && program.careerPaths.length > 0 && (
              <section className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                <h2 className="text-base font-semibold text-[var(--foreground)]">แนวทางอาชีพ</h2>
                <div className="flex flex-wrap gap-2">
                  {program.careerPaths.map((path) => (
                    <span
                      key={path}
                      className="flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
                    >
                      <ChevronRight aria-hidden="true" className="h-3 w-3 text-[var(--ink-subtle)]" />
                      {path}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* CTA section */}
            <section className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm font-medium text-[var(--foreground)]">
                {isMember
                  ? "พร้อมเริ่มต้นแล้วใช่ไหม? เลือกขั้นตอนถัดไป"
                  : "สมัครสมาชิกเพื่อเริ่มต้นการลงทะเบียน"}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={isMember ? "/registrations" : "/register"}
                  className="ui-button-primary h-11 px-5 text-sm sm:flex-1"
                >
                  {isMember ? "ลงทะเบียนหลักสูตร" : "สมัครสมาชิก"}
                </Link>
                <Link
                  href={isMember ? "/learning" : "/login"}
                  className="ui-button-secondary h-11 px-5 text-sm sm:flex-1"
                >
                  {isMember ? "กลับไปเป้าหมายการเรียนรู้" : "เข้าสู่ระบบ"}
                </Link>
              </div>
            </section>
          </div>
        )}

        {activeTab === "รายวิชา" && (
          <div className="flex flex-col gap-4">
            {program.subjects && program.subjects.length > 0 ? (
              <>
                <p className="text-sm text-[var(--ink-muted)]">
                  หลักสูตรนี้ประกอบด้วย {program.subjects.length} รายวิชา รวม {program.credits} หน่วยกิต
                  {program.totalPrice !== undefined && (
                    <> · ค่าใช้จ่ายรวม ฿{program.totalPrice.toLocaleString()}</>
                  )}
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {program.subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      detailBasePath={subjectDetailBasePath}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--ink-muted)]">
                ยังไม่มีข้อมูลรายวิชาในหลักสูตรนี้
              </div>
            )}
          </div>
        )}

        {activeTab === "รีวิวและความคิดเห็น" && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface)]">
              <Star aria-hidden="true" className="h-7 w-7 text-[var(--ink-subtle)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">ยังไม่มีรีวิว</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                เป็นคนแรกที่รีวิวหลักสูตรนี้หลังจากเรียนจบ
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
