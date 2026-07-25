"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Star,
  Bookmark,
  BookmarkCheck,
  Users,
  Clock,
  MonitorPlay,
  MapPin,
  Calendar,
  CheckCircle2,
  BadgeCheck,
  Target,
  ExternalLink,
  FileText,
  Download,
} from "lucide-react";
import type { Subject, ScheduleItem } from "@/lib/discovery/types";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useSessionData } from "@/lib/session/session-data";
import { getTeachersByIds } from "@/lib/data/teachers";
import { getTeacherInitial } from "@/lib/discovery/teacher-utils";

const TABS = ["ภาพรวม", "รีวิวและความคิดเห็น"] as const;
type Tab = (typeof TABS)[number];

type SubjectDetailProps = {
  subject: Subject;
  mode?: "public" | "member";
};

function getStudyModeLabel(mode: Subject["studyMode"]): string {
  if (mode === "online") return "ออนไลน์";
  if (mode === "onsite") return "เรียนในสถานที่";
  if (mode === "hybrid") return "ออนไลน์และในสถานที่";
  return "";
}

function getScheduleStatusBadge(status: ScheduleItem["status"]): {
  label: string;
  className: string;
} {
  if (status === "upcoming")
    return { label: "กำลังจะมาถึง", className: "bg-blue-50 text-blue-700" };
  if (status === "ongoing")
    return { label: "กำลังดำเนินการ", className: "bg-amber-50 text-amber-700" };
  if (status === "completed")
    return { label: "เสร็จสิ้น", className: "bg-green-50 text-green-700" };
  return { label: status, className: "bg-[var(--surface)] text-[var(--ink-muted)]" };
}

export function SubjectDetail({ subject, mode = "public" }: SubjectDetailProps) {
  const router = useRouter();
  const { data, registerForItem, addGoal, removeGoal, isSavedItem, toggleSavedItem } =
    useSessionData();
  const [activeTab, setActiveTab] = useState<Tab>("ภาพรวม");
  const isMember = mode === "member";
  const saved = isSavedItem("subject", subject.slug);
  const isOpen = subject.status !== "closed";
  const subjectTeachers = getTeachersByIds(subject.teacherIds);

  // Is this subject already one of the learner's goals?
  const existingGoal = data.goals.find((g) => g.slug === subject.slug);
  const goalSet = existingGoal !== undefined;

  function handleRegister() {
    if (!isMember) return;
    registerForItem({
      itemName: subject.name,
      itemType: "subject",
      slug: subject.slug,
      amount: subject.price ?? 0,
    });
    router.push("/registrations/confirmation");
  }

  function handleToggleGoal() {
    if (!isMember) return;
    if (existingGoal) {
      removeGoal(existingGoal.id);
    } else {
      addGoal({
        name: subject.name,
        nameEn: subject.nameEn,
        itemType: "subject",
        slug: subject.slug,
        credits: subject.credits,
        // Subjects carry their own category; fall back handled in the store.
        category: undefined,
      });
    }
  }

  function handleToggleSaved() {
    if (!isMember) return;
    toggleSavedItem({
      itemType: "subject",
      slug: subject.slug,
      name: subject.name,
      nameEn: subject.nameEn,
      detail: subject.faculty,
      credits: subject.credits,
      amount: subject.price,
      image: subject.image,
    });
  }


  return (
    <article className="w-full">
      {/* Breadcrumb (member pages render this via MemberPageShell instead, above the title) */}
      {!isMember && (
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "รายวิชา", href: "/subjects" },
              { label: subject.name },
            ]}
          />
        </div>
      )}

      {/* Banner */}
      <div className="relative mb-6 flex aspect-[4/1] items-center justify-center overflow-hidden rounded-2xl bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)]">
        {subject.image ? (
          <Image
            src={subject.image}
            alt={subject.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <BookOpen
            aria-hidden="true"
            className="h-16 w-16 text-[var(--secondary-foreground)] opacity-10"
          />
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {subject.status && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}
            >
              {isOpen ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
            </span>
          )}
          {subject.code && (
            <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] px-3 py-1 font-mono text-xs font-semibold text-[var(--ink-muted)]">
              {subject.code}
            </span>
          )}
        </div>
      </div>

      {/* 2-column layout: main content + sticky sidebar */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ── LEFT: main content ── */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--ink-subtle)]">{subject.faculty}</span>
              {subject.category && (
                <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)] px-3 py-1 text-xs font-medium text-[var(--ink-muted)]">
                  {subject.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
              {subject.name}
            </h1>

            {subject.nameEn && (
              <p className="text-sm text-[var(--ink-muted)]">{subject.nameEn}</p>
            )}

            {subject.summary && (
              <p className="text-base leading-7 text-[var(--ink-muted)]">{subject.summary}</p>
            )}

            {/* Mobile-only CTA (shows before tabs on small screens) */}
            <div className="flex flex-col gap-3 lg:hidden">
              {isMember ? (
                <button
                  type="button"
                  onClick={handleRegister}
                  className="ui-button-primary h-11 w-full text-sm"
                >
                  ลงทะเบียนรายวิชา
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
                title={!isMember ? "เข้าสู่ระบบเพื่อบันทึกรายวิชา" : undefined}
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
                {saved && isMember ? "บันทึกแล้ว" : "บันทึกรายวิชา"}
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
                    {tab === "รีวิวและความคิดเห็น" && (
                      <Star aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {tab}
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
                {/* เกี่ยวกับรายวิชา */}
                {(subject.summary || subject.description) && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
                      เกี่ยวกับรายวิชา
                    </h2>
                    <div className="flex flex-col gap-3">
                      {(subject.description ?? subject.summary).split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-sm leading-7 text-[var(--ink-muted)]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                )}

                {/* รูปแบบการเรียน */}
                {subject.studyMode && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
                      รูปแบบการเรียน
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(subject.studyMode === "online" || subject.studyMode === "hybrid") && (
                        <span className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_10%,white)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
                          <MonitorPlay aria-hidden="true" className="h-4 w-4 text-[var(--ink-subtle)]" />
                          ออนไลน์
                        </span>
                      )}
                      {(subject.studyMode === "onsite" || subject.studyMode === "hybrid") && (
                        <span className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_10%,white)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
                          <MapPin aria-hidden="true" className="h-4 w-4 text-[var(--ink-subtle)]" />
                          เรียนในสถานที่
                        </span>
                      )}
                    </div>
                  </section>
                )}

                {/* กำหนดการเรียน */}
                {(subject.startDate || subject.endDate) && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
                      กำหนดการเรียน
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {subject.startDate && (
                        <div className="flex items-center gap-3">
                          <Calendar aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
                          <div>
                            <p className="text-xs text-[var(--ink-muted)]">วันเริ่มเรียน</p>
                            <p className="text-sm font-semibold text-[var(--foreground)]">
                              {subject.startDate}
                            </p>
                          </div>
                        </div>
                      )}
                      {subject.endDate && (
                        <div className="flex items-center gap-3">
                          <Calendar aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]" />
                          <div>
                            <p className="text-xs text-[var(--ink-muted)]">วันสิ้นสุด</p>
                            <p className="text-sm font-semibold text-[var(--foreground)]">
                              {subject.endDate}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* สิ่งที่จะได้รับ */}
                {subject.outcomes && subject.outcomes.length > 0 && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
                      สิ่งที่จะได้รับ
                    </h2>
                    <ul className="flex flex-col gap-3">
                      {subject.outcomes.map((outcome) => (
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

                {/* คุณสมบัติผู้เรียน */}
                {subject.qualification && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
                      คุณสมบัติผู้เรียน
                    </h2>
                    <p className="text-sm leading-7 text-[var(--ink-muted)]">
                      {subject.qualification}
                    </p>
                  </section>
                )}

                {/* ตารางการเรียน */}
                {subject.scheduleItems && subject.scheduleItems.length > 0 && (
                  <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6">
                    <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
                      ตารางการเรียน
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-[color:var(--border)]">
                            <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                              วันที่ / เวลา
                            </th>
                            <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                              หัวข้อ
                            </th>
                            <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                              ผู้สอน
                            </th>
                            <th className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                              {subject.studyMode === "onsite" ? "สถานที่เรียน" : "ช่องทางเรียน"}
                            </th>
                            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                              สถานะ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[color:var(--border)]">
                          {subject.scheduleItems.map((item, idx) => {
                            const badge = getScheduleStatusBadge(item.status);
                            return (
                              <tr key={idx}>
                                <td className="whitespace-nowrap py-3 pr-4 text-sm text-[var(--foreground)]">
                                  <p>{item.date}</p>
                                  {item.time && (
                                    <p className="text-xs text-[var(--ink-subtle)]">{item.time} น.</p>
                                  )}
                                </td>
                                <td className="py-3 pr-4 text-sm text-[var(--ink-muted)]">
                                  {item.topic}
                                </td>
                                <td className="whitespace-nowrap py-3 pr-4 text-sm text-[var(--ink-muted)]">
                                  {item.teacher}
                                </td>
                                <td className="py-3 pr-4 text-sm text-[var(--ink-muted)]">
                                  {item.mode === "online" && item.studyLink && (
                                    <a
                                      href={item.studyLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--primary)] transition-colors hover:border-[color:var(--ring)] hover:bg-[var(--surface)]"
                                    >
                                      <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                                      เข้าเรียนออนไลน์
                                    </a>
                                  )}
                                  {item.mode === "onsite" && item.location && (
                                    <div className="flex items-start gap-1.5 whitespace-nowrap">
                                      <MapPin
                                        aria-hidden="true"
                                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]"
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-medium text-[var(--foreground)]">
                                          {item.location.building}
                                        </span>
                                        <span className="text-xs text-[var(--ink-subtle)]">
                                          {item.location.room} · {item.location.venue.replace("มหาวิทยาลัยธรรมศาสตร์ ", "")}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="whitespace-nowrap py-3">
                                  <span
                                    className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                                  >
                                    {badge.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
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
                    เป็นคนแรกที่รีวิวรายวิชานี้หลังจากเรียนจบ
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
              {subject.price !== undefined && (
                <div className="mb-4 flex flex-col gap-0.5">
                  <span
                    className={`text-3xl font-bold leading-none tracking-tight ${
                      subject.price === 0
                        ? "text-green-700"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {subject.price === 0 ? "ฟรี" : `฿${subject.price.toLocaleString()}`}
                  </span>
                  {subject.price > 0 && (
                    <span className="text-xs text-[var(--ink-muted)]">ค่าลงทะเบียนรายวิชา</span>
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
                    ลงทะเบียนรายวิชา
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
                  aria-label={saved && isMember ? "ยกเลิกการบันทึก" : "บันทึกรายวิชานี้"}
                  onClick={handleToggleSaved}
                  disabled={!isMember}
                  title={!isMember ? "เข้าสู่ระบบเพื่อบันทึกรายวิชา" : undefined}
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
                  {saved && isMember ? "บันทึกแล้ว" : "บันทึกรายวิชา"}
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
                ข้อมูลรายวิชา
              </h3>
              <dl className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <BookOpen
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                  />
                  <dt className="text-sm text-[var(--ink-muted)]">หน่วยกิต</dt>
                  <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                    {subject.credits} หน่วยกิต
                  </dd>
                </div>
                {subject.seats !== undefined && (
                  <div className="flex items-center gap-3">
                    <Users
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">ที่นั่ง</dt>
                    <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                      {subject.enrolledCount ?? 0}/{subject.seats}
                    </dd>
                  </div>
                )}
                {subject.studyMode && (
                  <div className="flex items-center gap-3">
                    <MonitorPlay
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">รูปแบบ</dt>
                    <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                      {getStudyModeLabel(subject.studyMode)}
                    </dd>
                  </div>
                )}
                {subject.duration && (
                  <div className="flex items-center gap-3">
                    <Clock
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">ระยะเวลา</dt>
                    <dd className="ml-auto text-sm font-semibold text-[var(--foreground)]">
                      {subject.duration}
                    </dd>
                  </div>
                )}
                {subject.status && (
                  <div className="flex items-center gap-3">
                    <BadgeCheck
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--ink-subtle)]"
                    />
                    <dt className="text-sm text-[var(--ink-muted)]">สถานะ</dt>
                    <dd className="ml-auto">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isOpen
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isOpen ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Documents card */}
            {subject.documents && subject.documents.length > 0 && (
              <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                  เอกสารประกอบการเรียน
                </h3>
                <ul className="flex flex-col gap-1">
                  {subject.documents.map((doc) => (
                    <li key={doc.name}>
                      <a
                        href={doc.url}
                        download
                        className="group -m-1 flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-[var(--surface)]"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)]"
                        >
                          <FileText className="h-4 w-4 text-[var(--secondary-foreground)]" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--foreground)] group-hover:text-[color:var(--primary)]">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[var(--ink-subtle)]">
                            {doc.fileType.toUpperCase()} · {doc.size}
                          </p>
                        </div>
                        <Download
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-[var(--ink-subtle)] transition-colors group-hover:text-[color:var(--primary)]"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Teachers card */}
            {subjectTeachers.length > 0 && (
              <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                  ผู้สอน
                </h3>
                <ul className="flex flex-col divide-y divide-[color:var(--border)]">
                  {subjectTeachers.map((teacher) => (
                    <li key={teacher.id} className="first:pt-0 py-3">
                      <Link
                        href={`/teachers/${teacher.id}?from=subject:${subject.slug}`}
                        className="group flex items-center gap-2.5 rounded-lg -m-1 p-1 transition-colors hover:bg-[var(--surface)]"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)] text-xs font-bold text-[var(--secondary-foreground)]"
                        >
                          {getTeacherInitial(teacher.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--foreground)] group-hover:text-[color:var(--primary)]">
                            {teacher.name}
                          </p>
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
