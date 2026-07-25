"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Target,
} from "lucide-react";
import type { Program, Subject } from "@/lib/discovery/types";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useSessionData } from "@/lib/session/session-data";
import { getTeacherInitial } from "@/lib/discovery/teacher-utils";
import { getTeachersByIds } from "@/lib/data/teachers";
import { getSubjectsByIds } from "@/lib/data/subjects";

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

const FALLBACK_SUBJECT_CATEGORY = "ไม่ระบุหมวดวิชา";

function groupSubjectsByCategory(subjects: Subject[]) {
  return subjects.reduce<Array<{ category: string; subjects: Subject[] }>>((groups, subject) => {
    const category = subject.category ?? FALLBACK_SUBJECT_CATEGORY;
    const existingGroup = groups.find((group) => group.category === category);

    if (existingGroup) {
      existingGroup.subjects.push(subject);
    } else {
      groups.push({ category, subjects: [subject] });
    }

    return groups;
  }, []);
}

function getStudyModeLabel(mode?: Subject["studyMode"]) {
  if (mode === "online") return "ออนไลน์";
  if (mode === "onsite") return "ในชั้นเรียน";
  if (mode === "hybrid") return "ผสมผสาน";
  return "ยังไม่ระบุรูปแบบ";
}

function getStudyModeBadgeStyle(mode?: Subject["studyMode"]) {
  if (mode === "online") return "border-blue-200 bg-blue-50 text-blue-700";
  if (mode === "onsite") return "border-amber-200 bg-amber-50 text-amber-700";
  if (mode === "hybrid") return "border-violet-200 bg-violet-50 text-violet-700";
  return "border-[color:var(--border)] bg-[var(--surface)] text-[var(--ink-muted)]";
}

function getSubjectStatusLabel(status?: Subject["status"]) {
  if (status === "open") return "เปิดรับ";
  if (status === "closed") return "ปิดรับ";
  return "รอประกาศ";
}

export function ProgramDetail({
  program,
  mode = "public",
  subjectDetailBasePath = "/subjects",
}: ProgramDetailProps) {
  const router = useRouter();
  const { data, registerForItem, addGoal, removeGoal, isSavedItem, toggleSavedItem } =
    useSessionData();
  const [activeTab, setActiveTab] = useState<Tab>("ภาพรวม");
  const isMember = mode === "member";
  const saved = isSavedItem("program", program.slug);

  // Is this program already one of the learner's goals?
  const existingGoal = data.goals.find((g) => g.slug === program.slug);
  const goalSet = existingGoal !== undefined;

  function handleRegister() {
    if (!isMember) return;
    registerForItem({
      itemName: program.name,
      itemType: "program",
      slug: program.slug,
      amount: program.totalPrice ?? 0,
    });
    router.push("/registrations/confirmation");
  }

  function handleToggleGoal() {
    if (!isMember) return;
    if (existingGoal) {
      removeGoal(existingGoal.id);
    } else {
      addGoal({
        name: program.name,
        itemType: "program",
        slug: program.slug,
        credits: program.credits,
      });
    }
  }

  function handleToggleSaved() {
    if (!isMember) return;
    toggleSavedItem({
      itemType: "program",
      slug: program.slug,
      name: program.name,
      detail: program.faculty,
      credits: program.credits,
      amount: program.totalPrice,
      image: program.image,
    });
  }

  const isOpen = program.status !== "closed";
  const programTeachers = getTeachersByIds(program.teacherIds);
  const typeLabel = program.type ?? program.level;
  const badgeStyle = getTypeBadgeStyle(typeLabel);
  const hasDiscount =
    program.originalPrice !== undefined &&
    program.originalPrice > (program.totalPrice ?? 0);

  const programSubjects = getSubjectsByIds(program.subjectIds);
  const subjectGroups = groupSubjectsByCategory(programSubjects);
  const totalSubjectCredits = programSubjects.reduce(
    (total, subject) => total + subject.credits,
    0,
  );
  const subjectTabLabel =
    programSubjects.length > 0
      ? `รายวิชา (${programSubjects.length})`
      : "รายวิชา";

  return (
    <article className="w-full">
      {/* Breadcrumb (member pages render this via MemberPageShell instead, above the title) */}
      {!isMember && (
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "หลักสูตร", href: "/programs" },
              { label: program.name },
            ]}
          />
        </div>
      )}

      {/* Banner */}
      <div className="relative mb-6 flex aspect-[4/1] items-center justify-center overflow-hidden rounded-2xl bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)]">
        {program.image ? (
          <Image
            src={program.image}
            alt={program.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <GraduationCap
            aria-hidden="true"
            className="h-16 w-16 text-[var(--secondary-foreground)] opacity-10"
          />
        )}
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
              {isMember ? (
                <button
                  type="button"
                  onClick={handleRegister}
                  className="ui-button-primary h-11 w-full text-sm"
                >
                  ลงทะเบียนหลักสูตร
                </button>
              ) : (
                <Link
                  href="/register"
                  className="ui-button-primary h-11 w-full text-sm"
                >
                  สมัครสมาชิกเพื่อลงทะเบียน
                </Link>
              )}
              <button
                type="button"
                onClick={handleToggleSaved}
                disabled={!isMember}
                title={!isMember ? "เข้าสู่ระบบเพื่อบันทึกหลักสูตร" : undefined}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  !isMember
                    ? "cursor-not-allowed border-[color:var(--border)] text-[var(--ink-subtle)] opacity-50"
                    : saved
                    ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[color:var(--primary)]"
                    : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                }`}
              >
                {saved && isMember ? (
                  <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Bookmark aria-hidden="true" className="h-4 w-4" />
                )}
                {saved && isMember ? "บันทึกแล้ว" : "บันทึกหลักสูตร"}
              </button>
              <button
                type="button"
                onClick={handleToggleGoal}
                disabled={!isMember}
                title={!isMember ? "เข้าสู่ระบบเพื่อตั้งเป้าหมาย" : undefined}
                className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                  !isMember
                    ? "cursor-not-allowed border-[color:var(--border)] text-[var(--ink-subtle)] opacity-50"
                    : goalSet
                    ? "border-[color:var(--secondary-foreground)] bg-[color:color-mix(in_oklch,var(--secondary)_12%,white)] text-[color:var(--secondary-foreground)]"
                    : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                }`}
              >
                {goalSet && isMember ? (
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Target aria-hidden="true" className="h-4 w-4" />
                )}
                {goalSet && isMember ? "อยู่ในเป้าหมายแล้ว" : "เลือกเป็นเป้าหมายการเรียนรู้"}
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
                    <div className="flex flex-col gap-3">
                      {program.description.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-sm leading-7 text-[var(--ink-muted)]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
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
              <div className="flex flex-col gap-5">
                {programSubjects.length > 0 ? (
                  <>
                    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-base font-semibold text-[var(--foreground)]">
                            โครงสร้างรายวิชาในหลักสูตร
                          </h2>
                          <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                            รายวิชาถูกจัดกลุ่มตามหมวดวิชา เพื่อให้เห็นเส้นทางการเรียนและหน่วยกิตที่ต้องเก็บครบทั้งหลักสูตร
                          </p>
                        </div>
                        <dl className="grid shrink-0 grid-cols-2 gap-2 text-sm sm:min-w-64">
                          <div className="rounded-lg bg-[var(--surface)] px-3 py-2">
                            <dt className="text-xs text-[var(--ink-subtle)]">รายวิชาทั้งหมด</dt>
                            <dd className="mt-0.5 font-semibold text-[var(--foreground)]">
                              {programSubjects.length} รายวิชา
                            </dd>
                          </div>
                          <div className="rounded-lg bg-[var(--surface)] px-3 py-2">
                            <dt className="text-xs text-[var(--ink-subtle)]">หน่วยกิตรวม</dt>
                            <dd className="mt-0.5 font-semibold text-[var(--foreground)]">
                              {totalSubjectCredits} / {program.credits}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </section>

                    <div className="flex flex-col gap-4">
                      {subjectGroups.map((group) => {
                        const groupCredits = group.subjects.reduce(
                          (total, subject) => total + subject.credits,
                          0,
                        );

                        return (
                          <section
                            key={group.category}
                            className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)]"
                          >
                            <div className="flex flex-col gap-2 border-b border-[color:var(--border)] bg-[var(--surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                                  {group.category}
                                </h3>
                                <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                                  {group.subjects.length} รายวิชา · {groupCredits} หน่วยกิต
                                </p>
                              </div>
                            </div>

                            <ul className="divide-y divide-[color:var(--border)]">
                              {group.subjects.map((subject) => (
                                <li key={subject.id}>
                                  <Link
                                    href={`${subjectDetailBasePath}/${subject.slug}`}
                                    className="group grid gap-4 px-5 py-4 transition-colors hover:bg-[color:color-mix(in_oklch,var(--surface)_65%,white)] md:grid-cols-[minmax(0,1fr)_auto]"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        {subject.code && (
                                          <span className="rounded-full bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] px-2.5 py-1 text-xs font-semibold text-[color:var(--primary)]">
                                            {subject.code}
                                          </span>
                                        )}
                                        <span className="text-xs font-medium text-[var(--ink-subtle)]">
                                          {getSubjectStatusLabel(subject.status)}
                                        </span>
                                      </div>
                                      <h4 className="mt-2 text-base font-semibold leading-snug text-[var(--foreground)] group-hover:text-[color:var(--primary)]">
                                        {subject.name}
                                      </h4>
                                      {subject.nameEn && (
                                        <p className="mt-1 text-sm italic text-[var(--ink-muted)]">
                                          {subject.nameEn}
                                        </p>
                                      )}
                                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-muted)]">
                                        {subject.summary}
                                      </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--ink-muted)] md:justify-end">
                                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                        <BookOpen aria-hidden="true" className="h-4 w-4" />
                                        {subject.credits} หน่วยกิต
                                      </span>
                                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                        <Clock aria-hidden="true" className="h-4 w-4" />
                                        {subject.duration ?? "-"}
                                      </span>
                                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                        <Users aria-hidden="true" className="h-4 w-4" />
                                        {subject.seats !== undefined ? `${subject.enrolledCount ?? 0}/${subject.seats}` : "-"}
                                      </span>
                                      <span
                                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${getStudyModeBadgeStyle(subject.studyMode)}`}
                                      >
                                        {getStudyModeLabel(subject.studyMode)}
                                      </span>
                                      <ChevronRight
                                        aria-hidden="true"
                                        className="h-4 w-4 text-[var(--ink-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--primary)]"
                                      />
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </section>
                        );
                      })}
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
                {isMember ? (
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="ui-button-primary h-11 w-full text-sm"
                  >
                    ลงทะเบียนหลักสูตร
                  </button>
                ) : (
                  <Link
                    href="/register"
                    className="ui-button-primary h-11 w-full text-sm"
                  >
                    สมัครสมาชิกเพื่อลงทะเบียน
                  </Link>
                )}
                <button
                  type="button"
                  aria-label={saved && isMember ? "ยกเลิกการบันทึก" : "บันทึกหลักสูตรนี้"}
                  onClick={handleToggleSaved}
                  disabled={!isMember}
                  title={!isMember ? "เข้าสู่ระบบเพื่อบันทึกหลักสูตร" : undefined}
                  className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                    !isMember
                      ? "cursor-not-allowed border-[color:var(--border)] text-[var(--ink-subtle)] opacity-50"
                      : saved
                      ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] text-[color:var(--primary)]"
                      : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {saved && isMember ? (
                    <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Bookmark aria-hidden="true" className="h-4 w-4" />
                  )}
                  {saved && isMember ? "บันทึกแล้ว" : "บันทึกหลักสูตร"}
                </button>
                <button
                  type="button"
                  onClick={handleToggleGoal}
                  disabled={!isMember}
                  title={!isMember ? "เข้าสู่ระบบเพื่อตั้งเป้าหมาย" : undefined}
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition ${
                    !isMember
                      ? "cursor-not-allowed border-[color:var(--border)] text-[var(--ink-subtle)] opacity-50"
                      : goalSet
                      ? "border-[color:var(--secondary-foreground)] bg-[color:color-mix(in_oklch,var(--secondary)_12%,white)] text-[color:var(--secondary-foreground)]"
                      : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {goalSet && isMember ? (
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Target aria-hidden="true" className="h-4 w-4" />
                  )}
                  {goalSet && isMember ? "อยู่ในเป้าหมายแล้ว" : "เลือกเป็นเป้าหมายการเรียนรู้"}
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
            {programTeachers.length > 0 && (
              <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                  ผู้สอน
                </h3>
                <ul className="flex flex-col divide-y divide-[color:var(--border)]">
                  {programTeachers.map((teacher) => (
                    <li key={teacher.id} className="first:pt-0 py-3">
                      <Link
                        href={`/teachers/${teacher.id}?from=program:${program.slug}`}
                        className="group flex items-center gap-2.5 rounded-lg -m-1 p-1 transition-colors hover:bg-[var(--surface)]"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)] text-xs font-bold text-[var(--secondary-foreground)]"
                        >
                          {getTeacherInitial(teacher.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="truncate text-sm font-medium text-[var(--foreground)] group-hover:text-[color:var(--primary)]">
                              {teacher.name}
                            </p>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)] opacity-0 transition-opacity group-hover:opacity-100"
                            />
                          </div>
                          {teacher.title && (
                            <p className="truncate text-xs text-[var(--ink-subtle)]">{teacher.title}</p>
                          )}
                        </div>
                      </Link>
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
