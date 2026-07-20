"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Bookmark, BookmarkCheck, Users } from "lucide-react";
import type { Program } from "@/lib/discovery/types";

type ProgramCardProps = {
  program: Program;
  detailBasePath?: string;
};

export function ProgramCard({ program, detailBasePath = "/programs" }: ProgramCardProps) {
  const [saved, setSaved] = useState(false);
  const isOpen = program.status !== "closed";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[color:var(--border)] bg-[var(--background)] transition hover:border-[color:var(--ring)] hover:shadow-sm">
      {/* Cover placeholder */}
      <div className="relative aspect-[16/9] flex items-center justify-center bg-[color:color-mix(in_oklch,var(--secondary)_18%,white)]">
        <GraduationCap aria-hidden="true" className="h-12 w-12 text-[var(--secondary-foreground)] opacity-15" />
        <span className="absolute bottom-2 right-3 text-[10px] font-medium text-[var(--ink-subtle)] opacity-60">
          ภาพปก
        </span>

        {program.status && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${
              isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}
          >
            {isOpen ? "เปิดรับ" : "ปิดรับ"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Type + faculty badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_40%,white)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--secondary-foreground)]">
            {program.type ?? program.level}
          </span>
          <span className="truncate text-[11px] text-[var(--ink-subtle)]">{program.faculty}</span>
        </div>

        {/* Name + description */}
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--foreground)]">
            {program.name}
          </h3>
          {program.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--ink-muted)]">
              {program.description}
            </p>
          )}
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ink-subtle)]">
          <span className="font-mono font-medium">{program.credits} หน่วยกิต</span>

          {program.seats !== undefined && (
            <span className="flex items-center gap-1">
              <Users aria-hidden="true" className="h-3 w-3" />
              {program.enrolledCount ?? 0}/{program.seats} ที่นั่ง
            </span>
          )}

          {program.totalPrice !== undefined && (
            <span className="font-medium text-[var(--foreground)]">
              {program.totalPrice === 0
                ? "ฟรี"
                : `฿${program.totalPrice.toLocaleString()}`}
            </span>
          )}
        </div>

        {/* Teachers */}
        {program.teachers && program.teachers.length > 0 && (
          <p className="line-clamp-1 text-[11px] text-[var(--ink-subtle)]">
            {program.teachers.slice(0, 2).join(" · ")}
            {program.teachers.length > 2 && ` +${program.teachers.length - 2}`}
          </p>
        )}
      </div>

      {/* Footer: save + detail button */}
      <div className="flex items-center gap-2 border-t border-[color:var(--border)] p-4 pt-3">
        <button
          type="button"
          aria-label={saved ? "ยกเลิกการบันทึก" : "บันทึกหลักสูตรนี้"}
          onClick={() => setSaved(!saved)}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
            saved
              ? "border-[color:var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_10%,white)] text-[color:var(--primary)]"
              : "border-[color:var(--border)] text-[var(--ink-subtle)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
          }`}
        >
          {saved ? (
            <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Bookmark aria-hidden="true" className="h-4 w-4" />
          )}
        </button>

        <Link
          href={`${detailBasePath}/${program.slug}`}
          className="ui-button-primary flex h-9 flex-1 items-center justify-center px-4 text-xs"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
