"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Users,
  Clock,
} from "lucide-react";
import type { Subject } from "@/lib/discovery/types";

type SubjectCardProps = {
  subject: Subject;
  detailBasePath?: string;
  canSave?: boolean;
};

function getCategoryBadgeStyle(category?: string): string {
  if (!category) {
    return "bg-[color:color-mix(in_oklch,var(--secondary)_40%,white)] text-[var(--secondary-foreground)]";
  }
  if (category.includes("ทั่วไป")) return "bg-blue-50 text-blue-700";
  if (category.includes("เลือก")) return "bg-amber-50 text-amber-700";
  if (category.includes("แกน") || category.includes("บังคับ")) return "bg-purple-50 text-purple-700";
  return "bg-emerald-50 text-emerald-700";
}

export function SubjectCard({ subject, detailBasePath = "/subjects", canSave = true }: SubjectCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background)] shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">

      {/* Full-card clickable overlay */}
      <Link
        href={`${detailBasePath}/${subject.slug}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`ดูรายละเอียด ${subject.name}`}
      >
        <span className="sr-only">{subject.name}</span>
      </Link>

      {/* ── Cover ── */}
      <div className="relative flex aspect-video items-center justify-center bg-[color:color-mix(in_oklch,var(--primary)_10%,white)]">
        <BookOpen
          aria-hidden="true"
          className="h-14 w-14 text-[var(--primary)] opacity-[0.12]"
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-[var(--ink-subtle)] opacity-50">
          ภาพปก
        </span>

        {/* Subject code badge */}
        {subject.code && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-[color:var(--border)] bg-white/90 px-3 py-1 font-mono text-xs font-semibold text-[var(--foreground)] shadow-sm backdrop-blur-sm">
            {subject.code}
          </span>
        )}

        {/* Save button — visible only for logged-in users */}
        {canSave && (
          <button
            type="button"
            aria-label={saved ? "ยกเลิกการบันทึก" : "บันทึกรายวิชานี้"}
            onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 ${
              saved
                ? "border-[color:var(--primary)] text-[color:var(--primary)]"
                : "border-[color:var(--border)] text-[var(--ink-subtle)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
            }`}
          >
            {saved ? (
              <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Bookmark aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-4">
        {subject.category && (
          <span
            className={`mb-3 self-start rounded-full px-3 py-1 text-xs font-medium ${getCategoryBadgeStyle(subject.category)}`}
          >
            {subject.category}
          </span>
        )}

        <h3 className="mb-1 line-clamp-1 text-lg font-bold leading-tight text-[var(--foreground)]">
          {subject.name}
        </h3>

        {subject.nameEn && (
          <p className="mb-3 line-clamp-1 text-xs italic text-[var(--ink-subtle)]">
            {subject.nameEn}
          </p>
        )}

        {subject.summary && (
          <p className="line-clamp-2 text-sm leading-6 text-[var(--ink-muted)]">
            {subject.summary}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center divide-x divide-[color:var(--border)] text-xs">
          <div className="flex items-center gap-1 pr-3">
            <BookOpen aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]" />
            <span className="font-bold text-[var(--foreground)]">{subject.credits}</span>
            <span className="text-[var(--ink-muted)]">หน่วยกิต</span>
          </div>
          {subject.seats !== undefined && (
            <div className="flex items-center gap-1 px-3">
              <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]" />
              <span className="font-bold text-[var(--foreground)]">{subject.seats}</span>
              <span className="text-[var(--ink-muted)]">ที่นั่ง</span>
            </div>
          )}
          {subject.duration && (
            <div className="flex items-center gap-1 pl-3">
              <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]" />
              <span className="font-bold text-[var(--foreground)]">{subject.duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-[color:var(--border)] bg-[var(--surface)] px-4 pb-4 pt-3">
        <div className="flex flex-col gap-0">
          <span className="text-[11px] text-[var(--ink-subtle)]">ค่าลงทะเบียน</span>
          <span
            className={`text-xl font-bold leading-tight ${
              subject.price === 0 ? "text-green-700" : "text-[color:var(--primary)]"
            }`}
          >
            {subject.price === undefined
              ? "-"
              : subject.price === 0
                ? "ฟรี"
                : `฿${subject.price.toLocaleString()}`}
          </span>
        </div>

        <span className="relative z-10 flex items-center gap-0.5 text-xs font-medium text-[color:var(--secondary-foreground)] pointer-events-none">
          ดูรายละเอียด
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
