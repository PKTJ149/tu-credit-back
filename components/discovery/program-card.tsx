"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Users,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import type { Program } from "@/lib/discovery/types";

type ProgramCardProps = {
  program: Program;
  detailBasePath?: string;
  canSave?: boolean;
};

function getTypeBadgeStyle(type: string): string {
  if (type.includes("ปริญญาตรี")) return "bg-purple-50 text-purple-700";
  if (type.includes("ปริญญาโท")) return "bg-indigo-50 text-indigo-700";
  if (type.includes("ปริญญาเอก")) return "bg-violet-50 text-violet-700";
  if (type.includes("ประกาศนียบัตร")) return "bg-blue-50 text-blue-700";
  if (type.includes("อบรมระยะสั้น")) return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
}

export function ProgramCard({ program, detailBasePath = "/programs", canSave = true }: ProgramCardProps) {
  const [saved, setSaved] = useState(false);
  const isOpen = program.status !== "closed";
  const typeLabel = program.type ?? program.level;
  const badgeStyle = getTypeBadgeStyle(typeLabel);
  const hasDiscount =
    program.originalPrice !== undefined &&
    program.originalPrice > (program.totalPrice ?? 0);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--background)] shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">

      {/* Full-card clickable overlay */}
      <Link
        href={`${detailBasePath}/${program.slug}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`ดูรายละเอียด ${program.name}`}
      >
        <span className="sr-only">{program.name}</span>
      </Link>

      {/* ── Cover ── */}
      <div className="relative flex aspect-video items-center justify-center bg-[color:color-mix(in_oklch,var(--secondary)_12%,white)]">
        <GraduationCap
          aria-hidden="true"
          className="h-14 w-14 text-[var(--secondary-foreground)] opacity-[0.12]"
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-[var(--ink-subtle)] opacity-50">
          ภาพปก
        </span>

        {/* Status badge */}
        {program.status && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-full border px-3 py-1 text-xs font-semibold ${
              isOpen
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {isOpen ? "เปิดรับ" : "ปิดรับ"}
          </span>
        )}

        {/* Save button — visible only for logged-in users */}
        {canSave && (
          <button
            type="button"
            aria-label={saved ? "ยกเลิกการบันทึก" : "บันทึกหลักสูตรนี้"}
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
        <span className={`mb-3 self-start rounded-full px-3 py-1 text-xs font-medium ${badgeStyle}`}>
          {typeLabel}
        </span>

        <h3 className="mb-1 line-clamp-1 text-lg font-bold leading-tight text-[var(--foreground)]">
          {program.name}
        </h3>

        <div className="mb-12 flex flex-col">
          <p className="line-clamp-1 text-xs text-[var(--ink-subtle)]">{program.faculty}</p>
          {program.teachers && program.teachers.length > 0 && (
            <p className="line-clamp-1 text-xs text-[var(--ink-muted)]">
              <span className="font-semibold text-[var(--ink-subtle)]">ผู้สอน :</span>{" "}
              {program.teachers.slice(0, 2).join(" · ")}
              {program.teachers.length > 2 && (
                <span className="text-[var(--ink-subtle)]"> +{program.teachers.length - 2}</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center divide-x divide-[color:var(--border)] text-xs">
          <div className="flex items-center gap-1 pr-3">
            <BookOpen aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]" />
            <span className="font-bold text-[var(--foreground)]">{program.credits}</span>
            <span className="text-[var(--ink-muted)]">หน่วยกิต</span>
          </div>

          {program.seats !== undefined && (
            <div className="flex items-center gap-1 px-3">
              <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]" />
              <span className="font-bold text-emerald-600">
                {program.enrolledCount ?? 0}/{program.seats}
              </span>
              <span className="text-[var(--ink-muted)]">ที่นั่ง</span>
            </div>
          )}

          {program.duration && (
            <div className="flex items-center gap-1 pl-3">
              <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--ink-subtle)]" />
              <span className="font-bold text-[var(--foreground)]">{program.duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-[color:var(--border)] bg-[var(--surface)] px-4 pb-4 pt-3">
        <div className="flex flex-col gap-0">
          <span className="text-[11px] text-[var(--ink-subtle)]">รวมทุกรายวิชา</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl font-bold leading-tight ${
                program.totalPrice === 0
                  ? "text-green-700"
                  : "text-[color:var(--primary)]"
              }`}
            >
              {program.totalPrice === 0
                ? "ฟรี"
                : `฿${(program.totalPrice ?? 0).toLocaleString()}`}
            </span>
            {hasDiscount && program.originalPrice !== undefined && (
              <span className="text-xs text-[var(--ink-subtle)] line-through">
                ฿{program.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <span className="relative z-10 flex items-center gap-0.5 text-xs font-medium text-[color:var(--secondary-foreground)] pointer-events-none">
          ดูรายละเอียด
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
