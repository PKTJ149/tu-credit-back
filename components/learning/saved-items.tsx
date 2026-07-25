"use client";

import Image from "next/image";
import Link from "next/link";
import { BookmarkCheck, BookOpen, GraduationCap, Trash2 } from "lucide-react";
import { useSessionData, type SavedLearningItem } from "@/lib/session/session-data";

function formatTHB(amount?: number) {
  if (amount === undefined) return "ยังไม่ระบุค่าใช้จ่าย";
  if (amount === 0) return "ฟรี";
  return `฿${amount.toLocaleString()}`;
}

function formatSavedDate(savedAt: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(savedAt));
}

function getItemHref(item: SavedLearningItem) {
  return item.itemType === "program"
    ? `/member/programs/${item.slug}`
    : `/member/subjects/${item.slug}`;
}

function SavedItemRow({ item }: { item: SavedLearningItem }) {
  const { removeSavedItem } = useSessionData();
  const isProgram = item.itemType === "program";
  const Icon = isProgram ? GraduationCap : BookOpen;

  return (
    <article className="flex flex-col gap-4 border-b border-[color:var(--border)] py-4 last:border-b-0 sm:flex-row sm:items-center">
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--surface)] sm:h-24 sm:w-36">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="144px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[color:color-mix(in_oklch,var(--primary)_8%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
            {isProgram ? "หลักสูตร" : "รายวิชา"}
          </span>
          <span className="text-xs text-[var(--ink-subtle)]">
            บันทึกเมื่อ {formatSavedDate(item.savedAt)}
          </span>
        </div>
        <h2 className="line-clamp-2 text-base font-semibold text-[var(--foreground)]">
          {item.name}
        </h2>
        {item.nameEn ? (
          <p className="mt-0.5 line-clamp-1 text-xs italic text-[var(--ink-subtle)]">
            {item.nameEn}
          </p>
        ) : null}
        <p className="mt-1 line-clamp-1 text-sm text-[var(--ink-muted)]">
          {item.detail}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ink-muted)]">
          {item.credits !== undefined ? (
            <span>
              <span className="font-semibold text-[var(--foreground)]">{item.credits}</span>{" "}
              หน่วยกิต
            </span>
          ) : null}
          <span className="font-semibold text-[var(--primary)]">{formatTHB(item.amount)}</span>
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col">
        <Link href={getItemHref(item)} className="ui-button-secondary h-10 flex-1 px-4 text-sm sm:flex-none">
          ดูรายละเอียด
        </Link>
        <button
          type="button"
          onClick={() => removeSavedItem(item.itemType, item.slug)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] px-4 text-sm font-medium text-[var(--ink-muted)] transition hover:border-red-200 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] sm:flex-none"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          นำออก
        </button>
      </div>
    </article>
  );
}

function SavedSection({
  title,
  items,
  emptyHref,
  emptyLabel,
}: {
  title: string;
  items: SavedLearningItem[];
  emptyHref: string;
  emptyLabel: string;
}) {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
        <p className="text-sm text-[var(--ink-muted)]">{items.length} รายการ</p>
      </div>

      {items.length > 0 ? (
        <div className="mt-2">
          {items.map((item) => (
            <SavedItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-10 text-center">
          <BookmarkCheck aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
          <p className="text-sm leading-7 text-[var(--ink-muted)]">
            ยังไม่มีรายการที่บันทึกไว้ในหมวดนี้
          </p>
          <Link href={emptyHref} className="ui-button-secondary">
            {emptyLabel}
          </Link>
        </div>
      )}
    </section>
  );
}

export function SavedItems() {
  const { data } = useSessionData();
  const savedPrograms = data.savedItems.filter((item) => item.itemType === "program");
  const savedSubjects = data.savedItems.filter((item) => item.itemType === "subject");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[color:var(--border)] bg-[color:color-mix(in_oklch,var(--secondary)_16%,white)] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              รายการที่บันทึกไว้
            </h1>
            <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
              รวมหลักสูตรและรายวิชาที่คุณบันทึกไว้เพื่อกลับมาพิจารณาภายหลัง
            </p>
          </div>
          <div className="rounded-lg bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            ทั้งหมด {data.savedItems.length} รายการ
          </div>
        </div>
      </div>

      <SavedSection
        title="หลักสูตรที่บันทึกไว้"
        items={savedPrograms}
        emptyHref="/member/programs"
        emptyLabel="สำรวจหลักสูตร"
      />
      <SavedSection
        title="รายวิชาที่บันทึกไว้"
        items={savedSubjects}
        emptyHref="/member/subjects"
        emptyLabel="สำรวจรายวิชา"
      />
    </div>
  );
}
