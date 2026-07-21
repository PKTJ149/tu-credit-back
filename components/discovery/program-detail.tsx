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
  Clock,
  BadgeCheck,
} from "lucide-react";
import type { Program } from "@/lib/discovery/types";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const TABS = ["ภาพรวม", "รายวิชา", "รีวิวและความคิดเห็น"] as const;
type Tab = (typeof TABS)[number];

type ProgramDetailProps = {
  program: Program;
  mode?: "public" | "member";
  subjectDetailBasePath?: string;
};

function getTypeBadgeStyle(type: string): string {
  if (type.includes("ปริญญาตรี")) return "bg-purple-50 text-purple-700";
  if (type.includes("ปริญญาโท")) return "bg-indigo-50 text-indigo-700";
  if (type.includes("ปริญญาเอก")) return "bg-violet-50 text-violet-700";
  if (type.includes("ประกาศนียบัตร")) return "bg-blue-50 text-blue-700";
  if (type.includes("อบรมระยะสั้น")) return "bg-emerald-50 text-emerald-700";
  return "bg-[color:color-mix(in_oklch,var(--secondary)_40%,white)] text-[var(--secondary-foreground)]";
}

export function ProgramDetail({
  program,
  mode = "public",
  subjectDetailBasePath = "/subjects",
}: ProgramDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ภาพรวม");
  const [saved, setSaved] = useState(false);
  const isMember = mode === "member";
  const isOpen = program.status !== "closed";
  const typeLabel = program.type ?? program.level;
  const badgeStyle = getTypeBadgeStyle(typeLabel);
  const hasDiscount =
    program.originalPrice !== undefined &&
    program.originalPrice > (program.totalPrice ?? 0);

  /* count all subjects (flat or categorised) */
  const totalSubjectCount = program.subjectCategories
    ? program.subjectCategories.reduce((n, c) => n + c.subjects.length, 0)
    : (program.subjects?.length ?? 0);

  const subjectTabLabel =
    totalSubjectCount > 0
      ? `รายวิชา (${totalSubjectCount})`
      : "รายวิชา";

  return (
    <article className="w-full">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: "หลักสูตร", href: isMember ? "/member/programs" : "/programs" },
            { label: program.name },
          ]}
        />
      </div>

      {/* Banner */}
      <div className="relative mb-6 flex aspect-[4/1] items-center justify-center overflow-hidden rounded-2xl bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)]">
        <GraduationCap
          aria-hidden="true"
          className="h-16 w-16 text-[var(--secondary-foreground)] opacity-10"
        />
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

      {/* 2-column layout: main content + sticky sidebar */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ── LEFT: main content ── */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyle}`}>
                {typeLabel}
              </span>
              <span className="text-sm text-[var(--ink-subtle)]">{program.faculty}</span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
              {program.name}
            </h1>

            {program.summary && (
              <p className="text-base leading-7 text-[var(--ink-muted)]">{program.summary}</p>
            )}

            {/* Mobile-only CTA (shows before tabs on small screens) */}
            <div className="flex flex-col gap-3 lg:hidden">
              <Link
                href={isMember ? "/registrations" : "/register"}
                className="ui-button-primary h-11 w-full text-sm"
              >
                {isMember ? "ลงทะเบียนหลักสูตร" : "สมัครสมาชิกเพื่อลงทะเบียน"}
              </Link>
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  saved
                    ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[color:var(--primary)]"
                    : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
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
                const label = tab === "รายวิชา" ? subjectTabLabel : tab;
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
                    {tab === "ภาพรวม" && (
                      <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {tab === "รายวิชา" && (
                      <GraduationCap aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {tab === "รีวิวและความคิดเห็น" && (
                      <Star aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab content */}
          <div role="tabpanel">
            {/* ── ภาพรวม ── */}
            {activeTab === "ภาพรวม" && (
              <div className="flex flex-col gap-4">
                {program.description && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
                      เกี่ยวกับหลักสูตร
                    </h2>
                    <p className="text-sm leading-7 text-[var(--ink-muted)]">
                      {program.description}
                    </p>
                  </section>
                )}

                {program.qualification && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
                      คุณสมบัติผู้เรียน
                    </h2>
                    <p className="text-sm leading-7 text-[var(--ink-muted)]">
                      {program.qualification}
                    </p>
                  </section>
                )}

                {program.outcomes && program.outcomes.length > 0 && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
                      สิ่งที่จะได้รับ
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {program.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-3">
                          <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--secondary-foreground)]"
                          />
                          <span className="text-sm leading-6 text-[var(--ink-muted)]">
                            {outcome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {program.careerPaths && program.careerPaths.length > 0 && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
                      แนวทางอาชีพ
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {program.careerPaths.map((path) => (
                        <span
                          key={path}
                          className="flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className="h-3 w-3 text-[var(--ink-subtle)]"
                          />
                          {path}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ── รายวิชา ── */}
            {activeTab === "รายวิชา" && (
              <div className="flex flex-col gap-4">
                {/* Categorised subjects */}
                {program.subjectCategories && program.subjectCategories.length > 0 ? (
                  <>
                    <p className="text-sm text-[var(--ink-muted)]">
                      หลักสูตรนี้ประกอบด้วย{" "}
                      <strong className="text-[var(--foreground)]">
                        {totalSubjectCount} รายวิชา
                      </strong>{" "}
                      รวม{" "}
                      <strong className="text-[var(--foreground)]">
                        {program.credits} หน่วยกิต
                      </strong>
                      {program.totalPrice !== undefined && (
                        <>
                          {" "}· ค่าใช้จ่ายรวม{" "}
                          <strong className="text-[var(--foreground)]">
                            ฿{program.totalPrice.toLocaleString()}
                          </strong>
                        </>
                      )}
                    </p>

                    {program.subjectCategories.map((category, catIdx) => {
                      const catCredits = category.subjects.reduce(
                        (n, s) => n + s.credits,
                        0,
                      );
                      const colorSchemes = [
                        { sectionBg: "bg-blue-50/60", headerBg: "bg-blue-100", headingColor: "text-blue-800", badgeClass: "bg-blue-200 text-blue-800" },
                        { sectionBg: "bg-emerald-50/60", headerBg: "bg-emerald-100", headingColor: "text-emerald-800", badgeClass: "bg-emerald-200 text-emerald-800" },
                        { sectionBg: "bg-purple-50/60", headerBg: "bg-purple-100", headingColor: "text-purple-800", badgeClass: "bg-purple-200 text-purple-800" },
                        { sectionBg: "bg-amber-50/60", headerBg: "bg-amber-100", headingColor: "text-amber-800", badgeClass: "bg-amber-200 text-amber-800" },
                      ];
                      const colors = colorSchemes[catIdx % colorSchemes.length];
                      return (
                        <div
                          key={category.id}
                          className={`overflow-hidden rounded-xl border border-[color:var(--border)] ${colors.sectionBg}`}
                        >
                          {/* Category header */}
                          <div className={`flex items-center justify-between ${colors.headerBg} px-4 py-3`}>
                            <div>
                              <span className={`text-sm font-semibold ${colors.headingColor}`}>
                                {category.name}
                              </span>
                              {category.nameEn && (
                                <span className="ml-2 text-xs text-[var(--ink-muted)]">
                                  {category.nameEn}
                                </span>
                              )}
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badgeClass}`}>
                              {category.subjects.length} วิชา · {catCredits} หน่วยกิต
                            </span>
                          </div>

                          {/* 2-column subject grid */}
                          <div className="grid grid-cols-1 divide-y divide-[color:var(--border)] sm:grid-cols-2 sm:divide-y-0">
                            {category.subjects.map((subject, idx) => {
                              const isRightCol = idx % 2 === 1;
                              const isLastRow =
                                idx >= category.subjects.length - (category.subjects.length % 2 === 0 ? 2 : 1);
                              return (
                                <div
                                  key={subject.id}
                                  className={`flex items-start justify-between gap-4 px-4 py-3 ${
                                    isRightCol
                                      ? "sm:border-l sm:border-[color:var(--border)]"
                                      : ""
                                  } ${
                                    !isLastRow
                                      ? "sm:border-b sm:border-[color:var(--border)]"
                                      : ""
                                  }`}
                                >
                                  {/* Left: name, EN name, code */}
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium leading-snug text-[var(--foreground)]">
                                      {subject.name}
                                    </p>
                                    {subject.nameEn && (
                                      <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                                        {subject.nameEn}
                                      </p>
                                    )}
                                    {subject.code && (
                                      <p className="mt-0.5 font-mono text-[11px] text-[var(--ink-subtle)]">
                                        {subject.code}
                                      </p>
                                    )}
                                  </div>
                                  {/* Right: price (prominent) + credits */}
                                  <div className="shrink-0 text-right">
                                    {subject.price !== undefined && (
                                      <p className="text-sm font-bold text-[color:var(--primary)]">
                                        ฿{subject.price.toLocaleString()}
                                      </p>
                                    )}
                                    <p className="text-xs font-medium text-[var(--ink-muted)]">
                                      {subject.credits} หน่วยกิต
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : program.subjects && program.subjects.length > 0 ? (
                  /* Flat subjects (legacy fallback) */
                  <>
                    <p className="text-sm text-[var(--ink-muted)]">
                      หลักสูตรนี้ประกอบด้วย {program.subjects.length} รายวิชา รวม{" "}
                      {program.credits} หน่วยกิต
                    </p>
                    <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
                      <div className="grid grid-cols-1 divide-y divide-[color:var(--border)] sm:grid-cols-2 sm:divide-y-0">
                        {program.subjects.map((subject, idx) => {
                          const isRightCol = idx % 2 === 1;
                          const isLastRow =
                            idx >= program.subjects!.length - (program.subjects!.length % 2 === 0 ? 2 : 1);
                          return (
                            <div
                              key={subject.id}
                              className={`flex items-start justify-between gap-4 px-4 py-3 ${
                                isRightCol
                                  ? "sm:border-l sm:border-[color:var(--border)]"
                                  : ""
                              } ${
                                !isLastRow
                                  ? "sm:border-b sm:border-[color:var(--border)]"
                                  : ""
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium leading-snug text-[var(--foreground)]">
                                  {subject.name}
                                </p>
                                {subject.nameEn && (
                                  <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                                    {subject.nameEn}
                                  </p>
                                )}
                                {subject.code && (
                                  <p className="mt-0.5 font-mono text-[11px] text-[var(--ink-subtle)]">
                                    {subject.code}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                {subject.price !== undefined && (
                                  <p className="text-sm font-bold text-[color:var(--primary)]">
                                    ฿{subject.price.toLocaleString()}
                                  </p>
                                )}
                                <p className="text-xs font-medium text-[var(--ink-muted)]">
                                  {subject.credits} หน่วยกิต
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--ink-muted)]">
                    ยังไม่มีข้อมูลรายวิชาในหลักสูตรนี้
                  </div>
                )}
              </div>
            )}

            {/* ── รีวิว ── */}
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
        </div>

        {/* ── RIGHT: sticky sidebar ── */}
        <aside className="hidden shrink-0 lg:block lg:w-80 xl:w-96">
          <div className="sticky top-8 flex flex-col gap-4">
            {/* Price card */}
            <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
              {program.totalPrice !== undefined && (
                <div className="mb-4 flex flex-col gap-0.5">
                  {hasDiscount && program.originalPrice !== undefined && (
                    <span className="text-sm text-[var(--ink-subtle)] line-through">
                      ฿{program.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span
                    className={`text-3xl font-bold leading-none tracking-tight ${
                      program.totalPrice === 0
                        ? "text-green-700"
                        : hasDiscount
                          ? "text-[color:var(--primary)]"
                          : "text-[var(--foreground)]"
                    }`}
                  >
                    {program.totalPrice === 0
                      ? "ฟรี"
                      : `฿${program.totalPrice.toLocaleString()}`}
                  </span>
                  {program.totalPrice > 0 && (
                    <span className="text-xs text-[var(--ink-muted)]">รวมทุกรายวิชา</span>
                  )}
                  {hasDiscount && program.originalPrice !== undefined && (
                    <span className="mt-1 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                      ประหยัด ฿{(program.originalPrice - (program.totalPrice ?? 0)).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link
                  href={isMember ? "/registrations" : "/register"}
                  className="ui-button-primary h-11 w-full text-sm"
                >
                  {isMember ? "ลงทะเบียนหลักสูตร" : "สมัครสมาชิกเพื่อลงทะเบียน"}
                </Link>
                <button
                  type="button"
                  aria-label={saved ? "ยกเลิกการบันทึก" : "บันทึกหลักสูตรนี้"}
                  onClick={() => setSaved(!saved)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
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

            {/* Key stats card */}
            <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                ข้อมูลหลักสูตร
              </h3>
              <dl className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <BookOpen
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                  />
                  <dt className="text-sm text-[var(--ink-muted)]">หน่วยกิต</dt>
                  <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                    {program.credits} หน่วยกิต
                  </dd>
                </div>
                {program.seats !== undefined && (
                  <div className="flex items-center gap-3">
                    <Users
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">ที่นั่ง</dt>
                    <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                      {program.enrolledCount ?? 0}/{program.seats}
                    </dd>
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-center gap-3">
                    <Clock
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">ระยะเวลา</dt>
                    <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                      {program.duration}
                    </dd>
                  </div>
                )}
                {program.type && (
                  <div className="flex items-center gap-3">
                    <BadgeCheck
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">ระดับ</dt>
                    <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                      {program.type}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Teachers card */}
            {program.teachers && program.teachers.length > 0 && (
              <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                  ผู้สอน
                </h3>
                <ul className="flex flex-col gap-2">
                  {program.teachers.map((teacher, index) => (
                    <li key={teacher} className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-bold text-[var(--ink-muted)]">{index + 1}</span>
                      <span className="text-sm text-[var(--foreground)]">{teacher}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
